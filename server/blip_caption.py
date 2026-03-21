import sys
import random
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

image_path = sys.argv[1]

image = Image.open(image_path).convert("RGB")

inputs = processor(images=image, return_tensors="pt")

out = model.generate(**inputs, max_new_tokens=50)

caption = processor.decode(out[0], skip_special_tokens=True).lower()

# ------------------------------
# Issue Classification + Variations
# ------------------------------

issue = "General Issue"

# Overcrowding
if "crowd" in caption or "people" in caption or "standing" in caption:
    issue = "Overcrowding"

    variations = [
        "crowded bus with heavy passenger rush",
        "overcrowded public transport with no space",
        "too many passengers trying to board the bus",
        "high congestion at public transport entry",
        "passengers packed tightly inside the bus"
    ]

# Cleanliness
elif "dirty" in caption or "garbage" in caption or "trash" in caption:
    issue = "Cleanliness Issue"

    variations = [
        "unclean bus with garbage present",
        "poor cleanliness inside public transport",
        "dirty environment in transport vehicle",
        "lack of hygiene in public transport",
        "waste scattered inside the vehicle"
    ]

# Safety / Accident
elif "accident" in caption or "danger" in caption:
    issue = "Safety Issue"

    variations = [
        "unsafe situation in public transport",
        "potential accident risk observed",
        "dangerous condition for passengers",
        "safety issue detected in transport",
        "risk of accident in current situation"
    ]

# Maintenance
elif "broken" in caption or "damage" in caption:
    issue = "Maintenance Issue"

    variations = [
        "damaged parts observed in vehicle",
        "maintenance required for transport",
        "broken components inside vehicle",
        "vehicle not in proper condition",
        "repair needed for transport system"
    ]

# Driver Behaviour
elif "driver" in caption or "driving" in caption:
    issue = "Driver Behaviour Issue"

    variations = [
        "driver behaving improperly",
        "rash driving detected",
        "unsafe driving by transport driver",
        "driver not following safety rules",
        "irresponsible driving behavior observed"
    ]

# Default
else:
    variations = [
        "issue observed in public transport",
        "problem detected in transport system",
        "passenger inconvenience noticed",
        "transport service issue identified",
        "general complaint in public transport"
    ]

# Pick random variation
final_caption = random.choice(variations)

print(f"{final_caption}|{issue}")