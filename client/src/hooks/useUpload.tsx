// hooks/useUploadFile.ts

import { useState } from 'react';
import axios from 'axios';

const useUploadFile = () => {
  const [isUploading, setIsUploading] = useState(false); 
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File, fileType: 'imageOrVideo' | 'document') => {
    setIsUploading(true);   
    setUploadError(null);   

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsUploading(false); 
      return response.data.url;
    } catch (err) {
      setIsUploading(false); 
      setUploadError(`Failed to upload ${fileType}`);
      console.error(err);
      return null;
    }
  };

  return { uploadFile, isUploading, uploadError }; 
};

export default useUploadFile;
