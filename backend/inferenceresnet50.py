# import torch
# from torchvision import models, transforms
# from PIL import Image
# import torch.nn as nn

# # 1. Define the same ResNet-50 model structure (as used in training)
# def get_resnet50_model():
#     model = models.resnet50(pretrained=False)  # Load architecture without pretrained weights
    
#     # Modify the final layer for regression (output 1 value: student count)
#     model.fc = nn.Linear(in_features=2048, out_features=1)  # Output 1 value
    
#     return model

# # 2. Define image transformations (same as used in training)
# transform = transforms.Compose([
#     transforms.Resize((224, 224)),  # ResNet50 requires 224x224 input size
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # ImageNet stats
# ])

# # 3. Load the saved model weights
# device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')  # Use GPU if available
# model = get_resnet50_model().to(device)

# # Load the model weights (make sure to replace this with your trained model path)
# model.load_state_dict(torch.load('resnet50.pth'))
# model.eval()  # Set model to evaluation mode

# # 4. Function to predict student count from an image
# def predict_student_count(image_path):
#     # Open the image
#     image = Image.open(image_path).convert('RGB')
    
#     # Apply transformations to the image
#     image = transform(image).unsqueeze(0).to(device)  # Add batch dimension and move to GPU if available

#     # Perform inference
#     with torch.no_grad():
#         output = model(image).item()  # Get the predicted student count as a scalar value
    
#     return output

# # 5. Take an image path as input (e.g., replace this with your test image)
# image_path = "./img20.jpg"  # Path to the image you want to predict

# # 6. Predict and display the student count
# student_count = predict_student_count(image_path)
# print(f'Predicted student count: {student_count:.2f}')


import torch
from torchvision import models, transforms
from PIL import Image
import torch.nn as nn
import io

# 1. Define the ResNet-50 model structure
def get_resnet50_model():
    model = models.resnet50(pretrained=False)
    model.fc = nn.Linear(in_features=2048, out_features=1)
    return model

# 2. Define image transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# 3. Load the model (do this at startup, not in the route)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = get_resnet50_model().to(device)
model.load_state_dict(torch.load('resnet50.pth', map_location=device))
model.eval()

# 4. Function to predict student count from image bytes
def predict_student_count_of_one_cam(image_bytes):
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Apply transformations
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Perform inference
        with torch.no_grad():
            output = model(image_tensor).item()
            
        return output
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return None