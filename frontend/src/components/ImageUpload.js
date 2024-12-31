


// import React, { useState, useRef } from 'react';
// import { useDropzone } from 'react-dropzone';

// const ImageUpload = ({path}) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [prediction, setPrediction] = useState(null);
//   const hiddenTextAreaRef = useRef(null);

//   const onDrop = (acceptedFiles) => {
//     handleFile(acceptedFiles[0]);
//   };

//   const handleFile = (file) => {
//     if (file) {
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
//     onDrop,
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png']
//     }
//   });

//   const handleFileChange = (event) => {
//     handleFile(event.target.files[0]);
//   };

//   const handlePaste = (event) => {
//     const items = event.clipboardData.items;
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
//       if (item.kind === 'file') {
//         handleFile(item.getAsFile());
//         break;
//       }
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//         console.log(`http://localhost:4000${path}`)
//         console.log(formData)
//       const response = await fetch(`http://localhost:4000${path}`, {
//         method: 'POST',
//         body: formData,
//       });
//       console.log(response.data);
//       const data = await response.json();
//       setPrediction(data.label);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <textarea
//         ref={hiddenTextAreaRef}
//         className="sr-only"
//         onPaste={handlePaste}
//         aria-hidden="true"
//       />
      
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         Upload an image to check student count
//       </h2>

//       <div
//         {...getRootProps()}
//         className={`transition-all duration-300 ease-in-out border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
//           ${isDragActive 
//             ? 'border-blue-500 bg-blue-50' 
//             : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
//       >
//         <input {...getInputProps()} />
//         <p className="text-gray-600">
//           {isDragActive
//             ? "Drop the image here..."
//             : "Drag 'n' drop an image, click to select, or paste from clipboard"}
//         </p>
//       </div>

//       {preview && (
//         <div className="transition-all duration-300 ease-in-out">
//           <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
//             <img
//               src={preview}
//               alt="Preview"
//               className="w-full h-full object-contain bg-gray-100"
//             />
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="file"
//           onChange={handleFileChange}
//           accept="image/*"
//           className="block w-full text-sm text-gray-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded-md file:border-0
//             file:text-sm file:font-semibold
//             file:bg-blue-50 file:text-blue-700
//             hover:file:bg-blue-100
//             transition-all duration-300 ease-in-out"
//         />
//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg
//             hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
//             transition-all duration-300 ease-in-out
//             disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={!selectedFile}
//         >
//           Analyze Image
//         </button>
//       </form>

//       {prediction && (
//         <div className="animate-fade-in mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
//           <p className="text-xl font-semibold text-gray-800">
//             Student Count: {prediction}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload;



import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({path}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const hiddenTextAreaRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    handleFile(acceptedFiles[0]);
  };

  const handleFile = (file) => {
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const handleFileChange = (event) => {
    handleFile(event.target.files[0]);
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        handleFile(item.getAsFile());
        break;
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name); // Added filename

    // Debug FormData contents
    console.log('Selected File:', selectedFile);
    console.log('File name:', selectedFile.name);
    console.log('File type:', selectedFile.type);
    console.log('File size:', selectedFile.size);
    
    // Properly log FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch(`https://student-counting.onrender.com${path}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      setPrediction(data.unique_student_count);
    } catch (error) {
      console.error('Error details:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <textarea
        ref={hiddenTextAreaRef}
        className="sr-only"
        onPaste={handlePaste}
        aria-hidden="true"
      />
      
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Upload an image to check student count
      </h2>

      <div
        {...getRootProps()}
        className={`transition-all duration-300 ease-in-out border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive
            ? "Drop the image here..."
            : "Drag 'n' drop an image, click to select, or paste from clipboard"}
        </p>
      </div>

      {preview && (
        <div className="transition-all duration-300 ease-in-out">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain bg-gray-100"
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            transition-all duration-300 ease-in-out"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
            transition-all duration-300 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFile}
        >
          Analyze Image
        </button>
      </form>

      {prediction && (
        <div className="animate-fade-in mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-xl font-semibold text-gray-800">
            Student Count: {prediction}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;