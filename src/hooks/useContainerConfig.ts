import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import { binDataState } from '@/states/binDataState';
import { IMOSBin } from '@/types/BinTypes';

export function useContainerConfig() {
  const [isContainerConfigOpen, setContainerConfigOpen] = useState(true);
  const [isOptimizationSettingsOpen, setOptimizationSettingsOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [binData, setBinData] = useAtom(binDataState);
  const [isLoading, setIsLoading] = useState(false);
  const [containerCount, setContainerCount] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // This effect ensures fileName is always in sync with binData
  useEffect(() => {
    if (binData && !fileName) {
      setFileName(`IMOS Container (ID: ${binData.Id})`);
    } else if (!binData && fileName) {
      setFileName(null);
    }
  }, [binData, fileName]);
  
  const toggleContainerConfig = () => {
    setOptimizationSettingsOpen(false);
    setContainerConfigOpen(!isContainerConfigOpen);
  };

  const toggleOptimizationSettings = () => {
    setContainerConfigOpen(false);
    setOptimizationSettingsOpen(!isOptimizationSettingsOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.name.toLowerCase().endsWith('.json')) {
        handleJsonFile(file);
      } else {
        toast.error('Please upload a valid JSON file.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleJsonFile = (file: File) => {
    setIsLoading(true);
    
    // Read file to validate and store it
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        
        if (typeof result === 'string') {
          const jsonData = JSON.parse(result) as IMOSBin;
          
          // Basic validation for IMOS bin structure
          if (jsonData.Modules && jsonData.Guid) {
            setFileName(file.name);
            setBinData(jsonData);
            toast.success('JSON container file loaded successfully!');
          } else {
            toast.error('Invalid container JSON format.');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        }
      } catch (error) {
        toast.error('Invalid JSON file format.');
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
    
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const removeFile = () => {
    setFileName(null);
    setBinData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    isContainerConfigOpen,
    isOptimizationSettingsOpen,
    fileName,
    binData,
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