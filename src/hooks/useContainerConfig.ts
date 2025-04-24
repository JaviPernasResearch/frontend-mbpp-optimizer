import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

export function useContainerConfig() {
  const [isContainerConfigOpen, setContainerConfigOpen] = useState(false);
  const [isOptimizationSettingsOpen, setOptimizationSettingsOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleContainerConfig = () => {
    setContainerConfigOpen(!isContainerConfigOpen);
  };

  const toggleOptimizationSettings = () => {
    setOptimizationSettingsOpen(!isOptimizationSettingsOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file extension
      if (!file.name.toLowerCase().endsWith('.stl')) {
        toast.error('Please upload a valid STL file.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
  
      setIsLoading(true);
      
      // Read file header to validate it's actually an STL file
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          
          if (result instanceof ArrayBuffer) {
            // Check for ASCII STL (starts with "solid")
            const header = new TextDecoder().decode(result.slice(0, 5));
            const isBinary = !header.startsWith('solid');
            
            if (isBinary) {
              // Binary STL validation (check file size matches header)
              const view = new DataView(result);
              const triangleCount = view.getUint32(80, true);
              const expectedSize = 84 + (triangleCount * 50); // Header + triangles
              
              if (Math.abs(file.size - expectedSize) > 100) { // Allow small margin of error
                throw new Error('Invalid binary STL file structure');
              }
            }
            
            setFileName(file.name);
            toast.success('STL file uploaded successfully!');
          }
        } catch (error) {
          toast.error('Invalid STL file format.');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Error reading the file.');
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
      // Read the first chunk to check the header
      reader.readAsArrayBuffer(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const removeFile = () => {
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    isContainerConfigOpen,
    isOptimizationSettingsOpen,
    fileName,
    isLoading,
    fileInputRef,
    toggleContainerConfig,
    toggleOptimizationSettings,
    handleFileChange,
    triggerFileInput,
    removeFile,
  };
}