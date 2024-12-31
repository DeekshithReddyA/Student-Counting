import torch
import torch.nn.functional as F
from torchvision import models
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import io

class StudentCounter(nn.Module):
    def __init__(self, backbone='resnet50', pretrained=True):
        super(StudentCounter, self).__init__()
        
        # Load pretrained backbone
        if backbone == 'resnet50':
            self.backbone = models.resnet50(pretrained=pretrained)
            feature_dim = self.backbone.fc.in_features
            self.backbone.fc = nn.Identity()  # Remove classification layer
        
        # Shared features
        self.shared_layers = nn.Sequential(
            nn.Linear(feature_dim, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        
        # Branch for total count
        self.total_branch = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(128, 1)
        )
        
        # Branch for intersection count
        self.intersection_branch = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(128, 1)
        )
        
        # Learnable parameters for loss weighting
        self.total_weight = nn.Parameter(torch.tensor([1.0]))
        self.intersection_weight = nn.Parameter(torch.tensor([1.0]))
        
    def forward(self, x):
        # Extract features
        features = self.backbone(x)
        shared = self.shared_layers(features)
        
        # Get predictions
        total_count = self.total_branch(shared)
        intersection_count = self.intersection_branch(shared)
        
        # Ensure counts are positive using softplus
        total_count = F.softplus(total_count)
        intersection_count = F.softplus(intersection_count)
        
        return total_count, intersection_count

def predict_student_count_of_two_cam(img_bytes, model_path, device='cuda' if torch.cuda.is_available() else 'cpu'):
    """
    Predicts student counts from image bytes.
    
    Args:
        img_bytes: Bytes of the input image
        model_path: Path to the trained model weights
        device: Device to run inference on ('cuda' or 'cpu')
    
    Returns:
        dict: Dictionary containing predictions
    """
    # Initialize model
    model = StudentCounter().to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    # Prepare transform for prediction
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                           std=[0.229, 0.224, 0.225])
    ])
    
    # Load and transform image
    image = Image.open(io.BytesIO(img_bytes))
    image_tensor = transform(image).unsqueeze(0).to(device)
    
    # Make prediction
    with torch.no_grad():
        total_pred, intersect_pred = model(image_tensor)
    
    # Convert predictions to rounded numbers
    total_count = round(total_pred.item())
    intersect_count = round(intersect_pred.item())
    unique_count = total_count - intersect_count
    
    # Return predictions as dictionary
    return {
        'total_count': total_count,
        'intersection_count': intersect_count,
        'unique_student_count': unique_count
    }

