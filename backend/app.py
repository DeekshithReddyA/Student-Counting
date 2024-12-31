from flask import Flask , request, jsonify
from flask_cors import CORS
from PIL import Image
from waitress import serve
import os
from stitched import predict_student_count_of_two_cam
from twoCamPP import combine_images
from inferenceresnet50 import predict_student_count_of_one_cam


app = Flask(__name__)
CORS(app)



@app.route('/bstitched', methods=['POST'])
def stitched():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension in ['jpg', 'jpeg', 'png']:
            img_bytes = file.read()
            predictions = predict_student_count_of_two_cam(img_bytes, r'/media/deeks/New Volume/Projects/Student Attendance/PROJECT/backend/student_counter_for_100_images.pth' )
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        return jsonify(predictions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/btwocam', methods=['POST'])
def twoCam():
    # Check if files are present in request
    if 'file1' not in request.files:
        return jsonify({'error': 'File1 not provided'}), 400
    if 'file2' not in request.files:
        return jsonify({'error': 'File2 not provided'}), 400

    file1 = request.files['file1']
    file2 = request.files['file2']
    
    # Check if filenames are empty
    if file1.filename == '':
        return jsonify({'error': 'file1 not selected'}), 400
    if file2.filename == '':
        return jsonify({'error': 'file2 not selected'}), 400

    try:
        # Check file extensions for both files
        file1_extension = file1.filename.split('.')[-1].lower()
        file2_extension = file2.filename.split('.')[-1].lower()
        allowed_extensions = {'jpg', 'jpeg', 'png'}
        
        if file1_extension not in allowed_extensions or file2_extension not in allowed_extensions:
            return jsonify({'error': 'Unsupported file type'}), 400
        
        # Combine images
        combined_image = combine_images(file1, file2)
        
        # Convert BytesIO to bytes for the prediction function
        img_bytes = combined_image.getvalue()
        
        # Make predictions
        model_path = r'/media/deeks/New Volume/Projects/Student Attendance/PROJECT/backend/student_counter_for_100_images.pth'
        predictions = predict_student_count_of_two_cam(img_bytes, model_path)
        
        return jsonify(predictions)
        
    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error for debugging
        return jsonify({'error': str(e)}), 500
    


@app.route('/bonecam' , methods=['POST'])
def oneCam():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension in ['jpg', 'jpeg', 'png']:
            img_bytes = file.read()
            predictions = predict_student_count_of_one_cam(img_bytes)
            predictions = int(predictions)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        return jsonify({'unique_student_count': predictions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
env = 'prod'
port = int(os.environ.get('PORT',10000))

if __name__ == '__main__':
    if env == 'dev':
        app.run(host='0.0.0.0', port=port)
    else:
        serve(app , host='0.0.0.0',port=port)
