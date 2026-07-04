from PIL import Image
import sys

def remove_white_bg(img_path, output_path, threshold=220):
    try:
        img = Image.open(img_path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # Change all white (also shades of whites)
            # to transparent
            if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(output_path, "PNG")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

remove_white_bg("c:/Users/vedan/Downloads/Vitalis_HealthCare_AI/public/logo.jpeg", "c:/Users/vedan/Downloads/Vitalis_HealthCare_AI/public/logo.png")
