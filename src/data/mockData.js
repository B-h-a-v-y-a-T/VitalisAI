// ═══════════════════════════════════════════════════════════════
// VITALIS AI — Mock Data
// ═══════════════════════════════════════════════════════════════

export const dashboardStats = [
  { label: 'Datasets Uploaded', value: 24, change: '+3 this week', icon: 'database', color: 'var(--teal)' },
  { label: 'Patients Processed', value: 18472, change: '+2,140 this week', icon: 'users', color: 'var(--mint)' },
  { label: 'Trials Supported', value: 12, change: '+2 this month', icon: 'flask', color: 'var(--info)' },
  { label: 'Raw Records Viewed', value: 0, change: 'Always zero', icon: 'eye-off', color: 'var(--success)', highlight: true },
];

export const recentActivity = [
  { id: 1, action: 'Dataset encrypted', dataset: 'CARDIO-2025-Q2', time: '2 min ago', status: 'success', hash: '0x7a3f...e91d' },
  { id: 2, action: 'Matching job completed', dataset: 'ONCO-TRIAL-489', time: '15 min ago', status: 'success', hash: '0xb2c1...4f3a' },
  { id: 3, action: 'New dataset uploaded', dataset: 'NEURO-PHASE3', time: '1 hr ago', status: 'info', hash: '0xd4e5...8b7c' },
  { id: 4, action: 'Access granted', dataset: 'CARDIO-2025-Q2', time: '2 hr ago', status: 'warning', hash: '0x1f2a...c5d6' },
  { id: 5, action: 'Audit log verified', dataset: 'ONCO-TRIAL-489', time: '3 hr ago', status: 'success', hash: '0x9e8d...7a2b' },
  { id: 6, action: 'Trial configuration updated', dataset: 'DIABETES-RCT', time: '5 hr ago', status: 'info', hash: '0x3c4d...1e0f' },
];

export const matchingJobs = [
  { id: 'MJ-001', dataset: 'CARDIO-2025-Q2', trial: 'NCT04892531', status: 'completed', progress: 100, matches: 847, total: 3200, time: '4m 32s' },
  { id: 'MJ-002', dataset: 'ONCO-TRIAL-489', trial: 'NCT05128293', status: 'processing', progress: 67, matches: 0, total: 5100, time: '—' },
  { id: 'MJ-003', dataset: 'NEURO-PHASE3', trial: 'NCT04567890', status: 'queued', progress: 0, matches: 0, total: 2800, time: '—' },
  { id: 'MJ-004', dataset: 'DIABETES-RCT', trial: 'NCT05234567', status: 'completed', progress: 100, matches: 1203, total: 4500, time: '6m 18s' },
];

export const datasets = [
  { id: 'DS-001', name: 'CARDIO-2025-Q2', patients: 3200, uploadTime: '2025-06-28 14:32', encryptionStatus: 'encrypted', matchingStatus: 'completed', size: '24.7 MB' },
  { id: 'DS-002', name: 'ONCO-TRIAL-489', patients: 5100, uploadTime: '2025-06-30 09:15', encryptionStatus: 'encrypted', matchingStatus: 'processing', size: '41.2 MB' },
  { id: 'DS-003', name: 'NEURO-PHASE3', patients: 2800, uploadTime: '2025-07-01 11:48', encryptionStatus: 'encrypting', matchingStatus: 'pending', size: '19.8 MB' },
  { id: 'DS-004', name: 'DIABETES-RCT', patients: 4500, uploadTime: '2025-06-25 16:22', encryptionStatus: 'encrypted', matchingStatus: 'completed', size: '35.6 MB' },
  { id: 'DS-005', name: 'RESP-COHORT-7', patients: 1900, uploadTime: '2025-07-02 08:05', encryptionStatus: 'pending', matchingStatus: 'pending', size: '14.1 MB' },
];

export const matchResults = [
  { patientId: 'PID-A7X2K9', score: 0.94, status: 'eligible', timestamp: '2025-07-01 14:32:18', trial: 'NCT04892531' },
  { patientId: 'PID-B3M8N1', score: 0.87, status: 'eligible', timestamp: '2025-07-01 14:32:19', trial: 'NCT04892531' },
  { patientId: 'PID-C5P2Q7', score: 0.72, status: 'review', timestamp: '2025-07-01 14:32:20', trial: 'NCT04892531' },
  { patientId: 'PID-D1R6S4', score: 0.91, status: 'eligible', timestamp: '2025-07-01 14:32:21', trial: 'NCT04892531' },
  { patientId: 'PID-E8T3U0', score: 0.45, status: 'ineligible', timestamp: '2025-07-01 14:32:22', trial: 'NCT04892531' },
  { patientId: 'PID-F2V9W6', score: 0.83, status: 'eligible', timestamp: '2025-07-01 14:32:23', trial: 'NCT04892531' },
  { patientId: 'PID-G7X1Y3', score: 0.68, status: 'review', timestamp: '2025-07-01 14:32:24', trial: 'NCT04892531' },
  { patientId: 'PID-H4Z5A8', score: 0.96, status: 'eligible', timestamp: '2025-07-01 14:32:25', trial: 'NCT04892531' },
];

export const auditLogs = [
  { hash: '0x7a3f8b2c1d4e5f6a9b0c...e91d', timestamp: '2025-07-01 14:35:22', dataset: 'CARDIO-2025-Q2', action: 'MATCH_COMPLETE', status: 'verified', block: 18234567 },
  { hash: '0xb2c14f3a8d7e6b5c0a1f...4f3a', timestamp: '2025-07-01 14:32:18', dataset: 'CARDIO-2025-Q2', action: 'MATCH_START', status: 'verified', block: 18234565 },
  { hash: '0xd4e58b7c2f1a3e6d9c0b...8b7c', timestamp: '2025-07-01 11:48:05', dataset: 'NEURO-PHASE3', action: 'ENCRYPT_START', status: 'verified', block: 18234501 },
  { hash: '0x1f2ac5d63b8e7a4f0d9c...c5d6', timestamp: '2025-07-01 10:15:33', dataset: 'CARDIO-2025-Q2', action: 'ACCESS_GRANT', status: 'verified', block: 18234489 },
  { hash: '0x9e8d7a2b5c1f3e6a4d0b...7a2b', timestamp: '2025-06-30 16:42:11', dataset: 'ONCO-TRIAL-489', action: 'ENCRYPT_COMPLETE', status: 'verified', block: 18234102 },
  { hash: '0x3c4d1e0f8a7b2c5d6e9f...1e0f', timestamp: '2025-06-30 09:15:00', dataset: 'ONCO-TRIAL-489', action: 'UPLOAD', status: 'verified', block: 18233890 },
];

export const accessControlUsers = [
  { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68', role: 'Hospital Admin', org: 'Metro General Hospital', datasets: ['CARDIO-2025-Q2', 'NEURO-PHASE3'], status: 'active' },
  { address: '0x8Ba1f109551bD432803012645Hac136c22C57e03', role: 'Sponsor', org: 'PharmaCorp Inc.', datasets: ['ONCO-TRIAL-489'], status: 'active' },
  { address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', role: 'CRO Analyst', org: 'ClinOps Global', datasets: ['DIABETES-RCT'], status: 'active' },
  { address: '0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C', role: 'Auditor', org: 'ChainVerify LLC', datasets: [], status: 'pending' },
];

export const systemHealth = [
  { service: 'CoFHE Engine', status: 'operational', latency: '45ms', uptime: '99.97%' },
  { service: 'Matching API', status: 'operational', latency: '12ms', uptime: '99.99%' },
  { service: 'Encryption Service', status: 'operational', latency: '28ms', uptime: '99.95%' },
  { service: 'Blockchain Node', status: 'operational', latency: '150ms', uptime: '99.90%' },
  { service: 'Audit Logger', status: 'operational', latency: '8ms', uptime: '100%' },
];

export const csvPreviewData = {
  headers: ['patient_id', 'age', 'gender', 'diagnosis_code', 'lab_value_1', 'lab_value_2', 'medication', 'trial_eligible'],
  rows: [
    ['P-10042', '58', 'M', 'I25.1', '142', '6.8', 'Metoprolol', 'true'],
    ['P-10043', '34', 'F', 'I10', '128', '5.2', 'Lisinopril', 'false'],
    ['P-10044', '67', 'M', 'I25.1', '165', '7.4', 'Atorvastatin', 'true'],
    ['P-10045', '45', 'F', 'I48.0', '138', '6.1', 'Apixaban', 'true'],
    ['P-10046', '72', 'M', 'I50.9', '155', '8.2', 'Furosemide', 'false'],
  ],
  encryptedRows: [
    ['0x7a3f...', '0xe2b1...', '0x4c8d...', '0xf1a5...', '0x9d3e...', '0x2b7c...', '0x8f4a...', '0x1e6d...'],
    ['0xb2c1...', '0xd4e5...', '0x6a9f...', '0x3c8b...', '0xe7d2...', '0x5f1a...', '0xa4c6...', '0x0b9e...'],
    ['0x1f2a...', '0x8d7c...', '0xc5e3...', '0x2a6f...', '0x7b4d...', '0xf0c8...', '0x3e9a...', '0x6d1b...'],
    ['0x9e8d...', '0x3c4d...', '0xb7a2...', '0x5e1f...', '0xd2c6...', '0x8a3f...', '0x4b7e...', '0xc9d0...'],
    ['0x4f6b...', '0xa1c3...', '0x7e2d...', '0xd8f4...', '0x0c5a...', '0x6b9e...', '0xe3a7...', '0x2f8c...'],
  ]
};

export const trialConfig = {
  name: 'NCT04892531',
  phase: 'Phase III',
  sponsor: 'PharmaCorp Inc.',
  indication: 'Coronary Artery Disease',
  criteria: [
    { field: 'age', operator: '>=', value: '40', weight: 1.0 },
    { field: 'age', operator: '<=', value: '75', weight: 1.0 },
    { field: 'diagnosis_code', operator: 'in', value: 'I25.1, I25.0', weight: 2.0 },
    { field: 'lab_value_1', operator: '>=', value: '130', weight: 1.5 },
    { field: 'trial_eligible', operator: '==', value: 'true', weight: 3.0 },
  ],
  thresholds: {
    eligibility: 0.70,
    highConfidence: 0.90,
  }
};

export const encryptionProgress = {
  totalRows: 3200,
  encryptedRows: 2847,
  currentField: 'lab_value_2',
  speed: '~142 rows/sec',
  eta: '2m 30s',
  status: 'encrypting',
};

export const chartData = {
  encryptionOverTime: [
    { time: 'Mon', datasets: 2, patients: 1200 },
    { time: 'Tue', datasets: 3, patients: 2400 },
    { time: 'Wed', datasets: 1, patients: 800 },
    { time: 'Thu', datasets: 4, patients: 5200 },
    { time: 'Fri', datasets: 2, patients: 3100 },
    { time: 'Sat', datasets: 5, patients: 4800 },
    { time: 'Sun', datasets: 3, patients: 2940 },
  ],
  matchDistribution: [
    { name: 'Eligible', value: 2050, color: 'var(--success)' },
    { name: 'Review', value: 680, color: 'var(--warning)' },
    { name: 'Ineligible', value: 470, color: 'var(--error)' },
  ],
};
