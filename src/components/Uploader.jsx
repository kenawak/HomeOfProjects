import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';
import axios from 'axios';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageEdit);

const Uploader = ({ setFieldValue }) => {
  const [files, setFiles] = useState([]);

  const handleUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const byteArray = new Uint8Array(arrayBuffer);
    
      console.log('File uploaded', byteArray);
    //   try {
    //     const response = await axios.post('/api/upload', byteArray, {
    //       headers: {
    //         'Content-Type': 'application/octet-stream',
    //       },
    //     });
    //     console.log('File uploaded successfully', response.data);
    //   } catch (error) {
    //     console.error('Error uploading file', error);
    //   }
    // };
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="App">
      <FilePond
        files={files}
        onupdatefiles={(fileItems) => {
          setFiles(fileItems.map(fileItem => fileItem.file));
          setFieldValue('files', fileItems.map(fileItem => fileItem.file));
        }}
        allowMultiple={true}
        maxFiles={3}
        acceptedFileTypes={['image/*']}
        name="files"
        labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
        onprocessfile={(error, file) => {
          if (!error) {
            handleUpload(file.file);
          }
        }}
      />
    </div>
  );
};

export default Uploader;