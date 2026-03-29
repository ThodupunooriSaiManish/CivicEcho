import sys
import torch
from PIL import Image
from torchvision import transforms, models
import torch.nn as nn

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
    _, pred = torch.max(output, 1)

label = class_names[pred.item()]

# ------------------------------
# SPLIT LABEL
# ------------------------------
transport, issue = label.split("_")

print(f"{issue.capitalize()}|{transport.capitalize()}")