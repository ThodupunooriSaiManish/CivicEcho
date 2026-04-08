import sys
import torch
from PIL import Image
from torchvision import transforms, models
import torch.nn as nn
import torch.nn.functional as F
import random


# ------------------------------
# LOAD CLASSES
# ------------------------------
with open("classes.txt", "r") as f:
    class_names = [line.strip() for line in f.readlines()]

# ------------------------------
# LOAD MODEL
# ------------------------------
model = models.mobilenet_v2(pretrained=False)
model.classifier[1] = nn.Linear(model.last_channel, len(class_names))
model.load_state_dict(torch.load("model.pth"))
model.eval()

# ------------------------------
# TRANSFORM
# ------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# ------------------------------
# LOAD IMAGE
# ------------------------------
image_path = sys.argv[1]
image = Image.open(image_path).convert("RGB")
image = transform(image).unsqueeze(0)

# ------------------------------
# PREDICT
# ------------------------------

with torch.no_grad():
    output = model(image)

    probs = F.softmax(output, dim=1)   # ✅ convert to probabilities
    confidence, pred = torch.max(probs, 1)


label = class_names[pred.item()]

# convert confidence to %
confidence = round(confidence.item() * 100, 2)

transport, issue = label.split("_")

print(f"{issue.capitalize()}|{transport.capitalize()}|{confidence}")