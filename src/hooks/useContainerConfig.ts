import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import { binDataState } from '@/states/binDataState';
import { loadBinFromFile } from '@/services/BinService';

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
        clearFileInput();
      }
    }
  };

  const handleJsonFile = async (file: File) => {
    setIsLoading(true);
    
    try {
      // Use the BinService to load the file
      const { imosBin } = await loadBinFromFile(file);
      
      if (imosBin) {
        setFileName(file.name);
        setBinData(imosBin);
        toast.success('JSON container file loaded successfully!');
      } else {
        toast.error('Unsupported container format');
        clearFileInput();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading file';
      toast.error(errorMessage);
      clearFileInput();
    } finally {
      setIsLoading(false);
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const removeFile = () => {
    setFileName(null);
    setBinData(null);
    clearFileInput();
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