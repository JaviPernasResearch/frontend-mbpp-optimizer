import { useState, useRef } from 'react';

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
      setIsLoading(true);
      
      // Simulate file processing delay
      setTimeout(() => {
        setFileName(file.name);
        setIsLoading(false);
        // Here you would typically handle the file upload or processing
        console.log("File selected:", file);
      }, 1000);
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