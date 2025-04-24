import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

export function useContainerConfig() {
  const [isContainerConfigOpen, setContainerConfigOpen] = useState(true);
  const [isOptimizationSettingsOpen, setOptimizationSettingsOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [stlData, setStlData] = useState<ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [containerCount, setContainerCount] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleContainerConfig = () => {
    setOptimizationSettingsOpen(false); // Close optimization settings when opening container config
    setContainerConfigOpen(!isContainerConfigOpen);
  };

  const toggleOptimizationSettings = () => {
    setContainerConfigOpen(false); // Close container config when opening optimization settings
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
      
      // Read file to validate and store it
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          
          if (result instanceof ArrayBuffer) {
            // Additional validation if needed
            
            setFileName(file.name);
            setStlData(result);
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
    setStlData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    isContainerConfigOpen,
    isOptimizationSettingsOpen,
    fileName,
    stlData,
    isLoading,
    containerCount,
    setContainerCount,
    fileInputRef,
    toggleContainerConfig,
    toggleOptimizationSettings,
    handleFileChange,
    triggerFileInput,
    removeFile,
  };
}