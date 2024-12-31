from PIL import Image
from io import BytesIO

def combine_images(image_file1, image_file2):
    """
    Combines two image files side by side and returns the combined image as a file-like object
    
    Args:
        image_file1: File object of the first image
        image_file2: File object of the second image
    
    Returns:
        BytesIO: A file-like object containing the combined image
    """
    # Open the images directly from the file objects
    image1 = Image.open(image_file1)
    image2 = Image.open(image_file2)
    
    # Convert images to RGB if they're not already
    if image1.mode != 'RGB':
        image1 = image1.convert('RGB')
    if image2.mode != 'RGB':
        image2 = image2.convert('RGB')
    
    # Resize images to the same height
    height = min(image1.height, image2.height)
    image1 = image1.resize((int(image1.width * height / image1.height), height))
    image2 = image2.resize((int(image2.width * height / image2.height), height))
    
    # Calculate dimensions of the combined image
    combined_width = image1.width + image2.width
    combined_height = max(image1.height, image2.height)
    
    # Create a new blank image
    combined_image = Image.new("RGB", (combined_width, combined_height))
    
    # Paste the images side by side
    combined_image.paste(image1, (0, 0))
    combined_image.paste(image2, (image1.width, 0))
    
    # Create a BytesIO object to store the image
    output_image = BytesIO()
    combined_image.save(output_image, format='JPEG')
    output_image.seek(0)  # Reset the pointer to the beginning of the BytesIO object
    
    return output_image