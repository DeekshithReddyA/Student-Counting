// import React, { useState, useRef } from 'react';
// import { useDropzone } from 'react-dropzone';

// const DualImageUpload = ({path}) => {
//   const [files, setFiles] = useState({ first: null, second: null });
//   const [previews, setPreviews] = useState({ first: null, second: null });
//   const [prediction, setPrediction] = useState(null);
//   const hiddenTextAreaRef = useRef(null);

//   const handleFile = (file, key) => {
//     if (file) {
//       setFiles(prev => ({ ...prev, [key]: file }));
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviews(prev => ({ ...prev, [key]: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const {
//     getRootProps: getFirstRootProps,
//     getInputProps: getFirstInputProps,
//     isDragActive: isFirstDragActive
//   } = useDropzone({
//     onDrop: (acceptedFiles) => handleFile(acceptedFiles[0], 'first'),
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png']
//     }
//   });

//   const {
//     getRootProps: getSecondRootProps,
//     getInputProps: getSecondInputProps,
//     isDragActive: isSecondDragActive
//   } = useDropzone({
//     onDrop: (acceptedFiles) => handleFile(acceptedFiles[0], 'second'),
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png']
//     }
//   });

//   const handleFileChange = (event, key) => {
//     handleFile(event.target.files[0], key);
//   };

//   const handlePaste = (event) => {
//     const items = event.clipboardData.items;
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
//       if (item.kind === 'file') {
//         const key = !files.first ? 'first' : !files.second ? 'second' : null;
//         if (key) {
//           handleFile(item.getAsFile(), key);
//         }
//         break;
//       }
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!files.first || !files.second) return;

//     const formData = new FormData();
//     formData.append('file1', files.first);
//     formData.append('file2', files.second);

//     try {
//         console.log(`http://localhost:4000${path}`)
//         console.log(formData)
//       const response = await fetch(`http://localhost:4000${path}`, {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await response.json();
//       setPrediction(data.label);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const renderDropzone = (key, getRootProps, getInputProps, isDragActive) => (
//     <div
//       {...getRootProps()}
//       className={`transition-all duration-300 ease-in-out border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
//         ${isDragActive 
//           ? 'border-blue-500 bg-blue-50' 
//           : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
//     >
//       <input {...getInputProps()} />
//       <p className="text-gray-600">
//         {isDragActive
//           ? "Drop the image here..."
//           : "Drag 'n' drop an image, click to select, or paste from clipboard"}
//       </p>
//     </div>
//   );

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       <textarea
//         ref={hiddenTextAreaRef}
//         className="sr-only"
//         onPaste={handlePaste}
//         aria-hidden="true"
//       />
      
//       <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
//         Upload two images to compare
//       </h2>

//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-700">First Image</h3>
//           {renderDropzone('first', getFirstRootProps, getFirstInputProps, isFirstDragActive)}
//           {previews.first && (
//             <div className="transition-all duration-300 ease-in-out">
//               <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
//                 <img
//                   src={previews.first}
//                   alt="First preview"
//                   className="w-full h-full object-contain bg-gray-100"
//                 />
//               </div>
//             </div>
//           )}
//           <input
//             type="file"
//             onChange={(e) => handleFileChange(e, 'first')}
//             accept="image/*"
//             className="block w-full text-sm text-gray-500
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-md file:border-0
//               file:text-sm file:font-semibold
//               file:bg-blue-50 file:text-blue-700
//               hover:file:bg-blue-100
//               transition-all duration-300 ease-in-out"
//           />
//         </div>

//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-700">Second Image</h3>
//           {renderDropzone('second', getSecondRootProps, getSecondInputProps, isSecondDragActive)}
//           {previews.second && (
//             <div className="transition-all duration-300 ease-in-out">
//               <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
//                 <img
//                   src={previews.second}
//                   alt="Second preview"
//                   className="w-full h-full object-contain bg-gray-100"
//                 />
//               </div>
//             </div>
//           )}
//           <input
//             type="file"
//             onChange={(e) => handleFileChange(e, 'second')}
//             accept="image/*"
//             className="block w-full text-sm text-gray-500
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-md file:border-0
//               file:text-sm file:font-semibold
//               file:bg-blue-50 file:text-blue-700
//               hover:file:bg-blue-100
//               transition-all duration-300 ease-in-out"
//           />
//         </div>
//       </div>

//       <div className="flex justify-center mt-6">
//         <button
//           onClick={handleSubmit}
//           className="px-8 py-3 bg-blue-600 text-white rounded-lg
//             hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
//             transition-all duration-300 ease-in-out
//             disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={!files.first || !files.second}
//         >
//           Compare Images
//         </button>
//       </div>

//       {prediction && (
//         <div className="animate-fade-in mt-6 p-4 bg-gray-50 rounded-lg shadow-sm text-center">
//           <p className="text-xl font-semibold text-gray-800">
//             Student Count: {prediction}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DualImageUpload;


import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

const DualImageUpload = ({path}) => {
  const [files, setFiles] = useState({ first: null, second: null });
  const [previews, setPreviews] = useState({ first: null, second: null });
  const [prediction, setPrediction] = useState(null);
  const hiddenTextAreaRef = useRef(null);

  const handleFile = (file, key) => {
    if (file) {
      setFiles(prev => ({ ...prev, [key]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [key]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    getRootProps: getFirstRootProps,
    getInputProps: getFirstInputProps,
    isDragActive: isFirstDragActive
  } = useDropzone({
    onDrop: (acceptedFiles) => handleFile(acceptedFiles[0], 'first'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const {
    getRootProps: getSecondRootProps,
    getInputProps: getSecondInputProps,
    isDragActive: isSecondDragActive
  } = useDropzone({
    onDrop: (acceptedFiles) => handleFile(acceptedFiles[0], 'second'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const handleFileChange = (event, key) => {
    handleFile(event.target.files[0], key);
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const key = !files.first ? 'first' : !files.second ? 'second' : null;
        if (key) {
          handleFile(item.getAsFile(), key);
        }
        break;
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!files.first || !files.second) return;

    const formData = new FormData();
    formData.append('file1', files.first, files.first.name);
    formData.append('file2', files.second, files.second.name);

    // Debug FormData contents
    console.log('First File:', files.first);
    console.log('First File name:', files.first.name);
    console.log('First File type:', files.first.type);
    console.log('First File size:', files.first.size);
    
    console.log('Second File:', files.second);
    console.log('Second File name:', files.second.name);
    console.log('Second File type:', files.second.type);
    console.log('Second File size:', files.second.size);
    
    // Properly log FormData contents
    for (let pair of formData.entries()) {
      console.log('FormData entry:', pair[0], pair[1]);
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

  const renderDropzone = (key, getRootProps, getInputProps, isDragActive) => (
    <div
      {...getRootProps()}
      className={`transition-all duration-300 ease-in-out border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
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
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <textarea
        ref={hiddenTextAreaRef}
        className="sr-only"
        onPaste={handlePaste}
        aria-hidden="true"
      />
      
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Upload two images to compare
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">First Image</h3>
          {renderDropzone('first', getFirstRootProps, getFirstInputProps, isFirstDragActive)}
          {previews.first && (
            <div className="transition-all duration-300 ease-in-out">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={previews.first}
                  alt="First preview"
                  className="w-full h-full object-contain bg-gray-100"
                />
              </div>
            </div>
          )}
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'first')}
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              transition-all duration-300 ease-in-out"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Second Image</h3>
          {renderDropzone('second', getSecondRootProps, getSecondInputProps, isSecondDragActive)}
          {previews.second && (
            <div className="transition-all duration-300 ease-in-out">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={previews.second}
                  alt="Second preview"
                  className="w-full h-full object-contain bg-gray-100"
                />
              </div>
            </div>
          )}
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'second')}
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              transition-all duration-300 ease-in-out"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
            transition-all duration-300 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!files.first || !files.second}
        >
          Analyze Images
        </button>
      </div>

      {prediction && (
        <div className="animate-fade-in mt-6 p-4 bg-gray-50 rounded-lg shadow-sm text-center">
          <p className="text-xl font-semibold text-gray-800">
            Student Count: {prediction}
          </p>
        </div>
      )}
    </div>
  );
};

export default DualImageUpload;