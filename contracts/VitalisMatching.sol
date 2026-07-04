// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FHE, euint32, ebool, inEuint32} from "@fhenixprotocol/cofhe-contracts/FHE.sol";

/**
 * @title VitalisMatching
 * @notice Confidential clinical trial patient matching using FHE
 * @dev Uses Fhenix CoFHE coprocessor for homomorphic computation on Arbitrum Sepolia.
 *
 * Architecture:
 *   1. Pharma uploads ML-derived integer weights via setTrialCriteria()
 *   2. Hospital submits encrypted patient features via evaluatePatient()
 *   3. Contract computes eligibility score homomorphically (no plaintext exposure)
 *   4. Pharma unseals binary match result via getMatchStatus()
 *
 * FHE-Safe Scoring:
 *   Instead of: score = Σ(wᵢ × xᵢ) + intercept >= 0
 *   We compute: positiveScore >= negativeScore + threshold
 *   This avoids unsigned integer underflow on euint32.
 */
contract VitalisMatching {
    // ─── State ───
    address public admin;        // Pharma company (sets criteria, reads results)
    address public hospital;     // Hospital (submits encrypted patient data)

    // Trial criteria weights (set by Pharma from ML model output)
    uint32[6] public positiveWeights;
    uint32[6] public negativeWeights;
    uint32 public threshold;
    bool public criteriaSet;

    // Patient match results (encrypted)
    mapping(uint256 => ebool) private matchResults;
    uint256 public patientCount;

    // Cohort Feasibility Queries
    struct FeasibilityQuery {
        string description;
        euint32 encryptedAggregateCount;
        uint256 submissionsCount;
        bool active;
    }
    mapping(uint256 => FeasibilityQuery) private feasibilityQueries;
    uint256 public queryCount;

    // Feature labels for documentation
    string[6] public featureNames = ["age", "sex", "trestbps", "chol", "fbs", "thalach"];

    // ─── Events ───
    event CriteriaUpdated(address indexed admin, uint32 threshold);
    event PatientEvaluated(uint256 indexed patientId, address indexed hospital);
    event MatchUnsealed(uint256 indexed patientId, address indexed requester);
    event QueryCreated(uint256 indexed queryId, string description);
    event FlagSubmitted(uint256 indexed queryId, address indexed hospital);

    // ─── Modifiers ───
    modifier onlyAdmin() {
        require(msg.sender == admin, "VitalisMatching: caller is not admin");
        _;
    }

    modifier onlyHospital() {
        require(msg.sender == hospital, "VitalisMatching: caller is not hospital");
        _;
    }

    // ─── Constructor ───
    constructor(address _hospital) {
        admin = msg.sender;
        hospital = _hospital;
    }

    // ─── Admin Functions ───

    /**
     * @notice Pharma uploads ML model weights (scaled to integers)
     * @param _positiveWeights Weights for features that positively contribute to match
     * @param _negativeWeights Absolute values of weights that negatively contribute
     * @param _threshold Decision boundary threshold (absorbs intercept)
     *
     * Example from trained model:
     *   positiveWeights = [0, 0, 0, 0, 0, 48]      // only thalach is positive
     *   negativeWeights = [6, 1575, 16, 9, 113, 0]  // age, sex, bp, chol, fbs
     *   threshold = 1225                              // from negative intercept
     */
    function setTrialCriteria(
        uint32[6] calldata _positiveWeights,
        uint32[6] calldata _negativeWeights,
        uint32 _threshold
    ) external onlyAdmin {
        positiveWeights = _positiveWeights;
        negativeWeights = _negativeWeights;
        threshold = _threshold;
        criteriaSet = true;

        emit CriteriaUpdated(msg.sender, _threshold);
    }

    /**
     * @notice Update the authorized hospital address
     */
    function setHospital(address _hospital) external onlyAdmin {
        hospital = _hospital;
    }

    // ─── Core FHE Matching ───

    /**
     * @notice Hospital submits 6 encrypted patient features for matching
     * @param encAge       Encrypted age (euint32)
     * @param encSex       Encrypted sex (euint32, 0 or 1)
     * @param encTrestbps  Encrypted resting blood pressure (euint32)
     * @param encChol      Encrypted serum cholesterol (euint32)
     * @param encFbs       Encrypted fasting blood sugar > 120 (euint32, 0 or 1)
     * @param encThalach   Encrypted max heart rate (euint32)
     * @return patientId   The ID assigned to this patient evaluation
     *
     * All computation happens on ciphertexts — no plaintext is ever seen by the contract.
     */
    function evaluatePatient(
        inEuint32 calldata encAge,
        inEuint32 calldata encSex,
        inEuint32 calldata encTrestbps,
        inEuint32 calldata encChol,
        inEuint32 calldata encFbs,
        inEuint32 calldata encThalach
    ) external onlyHospital returns (uint256 patientId) {
        require(criteriaSet, "VitalisMatching: trial criteria not set");

        // Convert input ciphertexts to euint32
        euint32[6] memory features;
        features[0] = FHE.asEuint32(encAge);
        features[1] = FHE.asEuint32(encSex);
        features[2] = FHE.asEuint32(encTrestbps);
        features[3] = FHE.asEuint32(encChol);
        features[4] = FHE.asEuint32(encFbs);
        features[5] = FHE.asEuint32(encThalach);

        // ─── Compute Positive Score ───
        // positiveScore = Σ(positiveWeights[i] * features[i])
        euint32 positiveScore = FHE.asEuint32(0);
        for (uint i = 0; i < 6; i++) {
            if (positiveWeights[i] > 0) {
                euint32 weighted = FHE.mul(
                    features[i],
                    FHE.asEuint32(positiveWeights[i])
                );
                positiveScore = FHE.add(positiveScore, weighted);
            }
        }

        // ─── Compute Negative Score ───
        // negativeScore = Σ(negativeWeights[i] * features[i])
        euint32 negativeScore = FHE.asEuint32(0);
        for (uint i = 0; i < 6; i++) {
            if (negativeWeights[i] > 0) {
                euint32 weighted = FHE.mul(
                    features[i],
                    FHE.asEuint32(negativeWeights[i])
                );
                negativeScore = FHE.add(negativeScore, weighted);
            }
        }

        // ─── Underflow-Safe Comparison ───
        // Instead of: positiveScore - negativeScore >= threshold (UNDERFLOW RISK!)
        // We use:     positiveScore >= negativeScore + threshold  (SAFE)
        euint32 negPlusThreshold = FHE.add(negativeScore, FHE.asEuint32(threshold));
        ebool isMatch = FHE.gte(positiveScore, negPlusThreshold);

        // ─── Store Result ───
        patientId = patientCount;
        matchResults[patientId] = isMatch;
        patientCount++;

        // Grant access to both admin (pharma) and the contract itself
        FHE.allowSender(isMatch);
        FHE.allowThis(isMatch);

        emit PatientEvaluated(patientId, msg.sender);
    }

    // ─── Unsealing ───

    /**
     * @notice Pharma reads the encrypted match status for a patient
     * @dev The caller must have been granted access via FHE.allowSender.
     *      On the frontend, cofhejs handles the permit signature and unsealing.
     * @param patientId The patient evaluation ID
     * @return The encrypted boolean match result (to be unsealed client-side)
     */
    function getMatchStatus(uint256 patientId) external view returns (ebool) {
        require(patientId < patientCount, "VitalisMatching: invalid patient ID");
        return matchResults[patientId];
    }

    /**
     * @notice Grant an additional address access to a patient's match result
     * @param patientId The patient evaluation ID
     * @param viewer The address to grant access to
     */
    function grantAccess(uint256 patientId, address viewer) external onlyAdmin {
        require(patientId < patientCount, "VitalisMatching: invalid patient ID");
        FHE.allow(matchResults[patientId], viewer);
    }

    // ─── View Functions ───

    function getTrialCriteria() external view returns (
        uint32[6] memory _positiveWeights,
        uint32[6] memory _negativeWeights,
        uint32 _threshold
    ) {
        return (positiveWeights, negativeWeights, threshold);
    }

    // ─── Cohort Feasibility Functions ───

    /**
     * @notice Pharma admin creates a new cohort size estimation query
     * @param _description Description of the cohort query (e.g. "Trial NCT0123: Age > 60 & Fasting Blood Sugar == 1")
     */
    function createFeasibilityQuery(string calldata _description) external onlyAdmin returns (uint256 queryId) {
        queryId = queryCount;
        feasibilityQueries[queryId].description = _description;
        feasibilityQueries[queryId].encryptedAggregateCount = FHE.asEuint32(0);
        feasibilityQueries[queryId].active = true;
        queryCount++;
        emit QueryCreated(queryId, _description);
    }

    /**
     * @notice Hospital submits an encrypted flag (0 or 1) indicating if a single patient fits the criteria
     * @param queryId The feasibility query ID
     * @param encryptedFlag The encrypted boolean or uint32 (0 or 1) indicating eligibility
     *
     * The contract homomorphically sums these flags, updating the query's total matching patients count.
     */
    function submitFeasibilityFlag(uint256 queryId, inEuint32 calldata encryptedFlag) external onlyHospital {
        require(queryId < queryCount, "VitalisMatching: invalid query ID");
        FeasibilityQuery storage q = feasibilityQueries[queryId];
        require(q.active, "VitalisMatching: query is not active");

        euint32 flag = FHE.asEuint32(encryptedFlag);
        q.encryptedAggregateCount = FHE.add(q.encryptedAggregateCount, flag);
        q.submissionsCount++;

        // Authorize admin (Pharma) and the contract to view the aggregated sum
        FHE.allow(q.encryptedAggregateCount, admin);
        FHE.allowThis(q.encryptedAggregateCount);

        emit FlagSubmitted(queryId, msg.sender);
    }

    /**
     * @notice Return the query status and aggregate data
     */
    function getFeasibilityQueryInfo(uint256 queryId) external view returns (
        string memory description,
        uint256 submissionsCount,
        bool active
    ) {
        require(queryId < queryCount, "VitalisMatching: invalid query ID");
        FeasibilityQuery storage q = feasibilityQueries[queryId];
        return (q.description, q.submissionsCount, q.active);
    }

    /**
     * @notice Pharma reads the encrypted cohort size for a feasibility query
     */
    function getFeasibilityCount(uint256 queryId) external view onlyAdmin returns (euint32) {
        require(queryId < queryCount, "VitalisMatching: invalid query ID");
        return feasibilityQueries[queryId].encryptedAggregateCount;
    }
}
