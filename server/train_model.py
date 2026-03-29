import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# ------------------------------
# SETTINGS
# ------------------------------
data_dir = "dataset/train"
batch_size = 8
epochs = 6

# ------------------------------
# TRANSFORMS
# ------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# ------------------------------
# LOAD DATA
# ------------------------------
dataset = datasets.ImageFolder(data_dir, transform=transform)
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

class_names = dataset.classes
print("Classes:", class_names)

# ------------------------------
# MODEL
# ------------------------------
model = models.mobilenet_v2(pretrained=True)
model.classifier[1] = nn.Linear(model.last_channel, len(class_names))

# ------------------------------
# TRAINING
# ------------------------------
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

for epoch in range(epochs):
    for images, labels in dataloader:
        outputs = model(images)
        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    print(f"Epoch {epoch+1}, Loss: {loss.item()}")

# ------------------------------
# SAVE MODEL
# ------------------------------
torch.save(model.state_dict(), "model.pth")

# Save class names also
with open("classes.txt", "w") as f:
    for c in class_names:
        f.write(c + "\n")

print("✅ Training Done")