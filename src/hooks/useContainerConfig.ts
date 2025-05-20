import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import { binDataState } from '@/states/binDataState';
import { partsDataState } from '@/states/partsDataState';
import { containerCountState } from '@/states/containerCountState';
import { loadBinFromFile, loadPartsFromFile } from '@/services/BinLoaderService';

export function useContainerConfig() {
  const [isContainerConfigOpen, setContainerConfigOpen] = useState(true);
  const [isOptimizationSettingsOpen, setOptimizationSettingsOpen] = useState(false);
  const [binFileName, setFileName] = useState<string | null>(null);
  const [partsFileName, setPartsFileName] = useState<string | null>(null);
  const [binData, setBinData] = useAtom(binDataState);
  const [partsData, setPartsData] = useAtom(partsDataState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingParts, setIsLoadingParts] = useState(false);
  const [containerCount, setContainerCount] = useAtom(containerCountState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const partsFileInputRef = useRef<HTMLInputElement>(null);

  // This effect ensures fileName is always in sync with binData
  useEffect(() => {
    if (binData && !binFileName) {
      setFileName(`Container (ID: ${binData.id})`);
    } else if (!binData && binFileName) {
      setFileName(null);
    }
  }, [binData, binFileName]);

  // This effect ensures partsFileName is always in sync with partsData
    useEffect(() => {
    if (partsData && !partsFileName) {
      setPartsFileName(`Parts (ID: ${partsData.map(part => part.guid).join(', ')})`);
    } else if (!partsData && partsFileName) {
      setPartsFileName(null);
    }
  }, [partsData, partsFileName]);


  // Limit container count to 10
  const handleContainerCountChange = (count: number) => {
    setContainerCount(Math.min(Math.max(1, count), 10));
  };

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

  const handlePartsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.name.toLowerCase().endsWith('.json')) {
        handlePartsJsonFile(file);
      } else {
        toast.error('Please upload a valid JSON file.');
        clearPartsFileInput();
      }
    }
  };

  const handleJsonFile = async (file: File) => {
    setIsLoading(true);
    
    try {
      const bin = await loadBinFromFile(file);
      
      setFileName(file.name);
      setBinData(bin);
      toast.success('Container file loaded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading file';
      toast.error(errorMessage);
      clearFileInput();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartsJsonFile = async (file: File) => {
    setIsLoadingParts(true);
    
    try {
      const parts = await loadPartsFromFile(file);
      
      setPartsFileName(file.name);
      setPartsData(parts);
      toast.success(`Parts file with ${parts.length} parts loaded successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading parts file';
      toast.error(errorMessage);
      clearPartsFileInput();
    } finally {
      setIsLoadingParts(false);
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearPartsFileInput = () => {
    if (partsFileInputRef.current) {
      partsFileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const triggerPartsFileInput = () => {
    if (partsFileInputRef.current) {
      partsFileInputRef.current.click();
    }
  };
  
  const removeFile = () => {
    setFileName(null);
    setBinData(null);
    clearFileInput();
  };
  
  const removePartsFile = () => {
    setPartsFileName(null);
    setPartsData(null);
    clearPartsFileInput();
  };

  return {
    isContainerConfigOpen,
    isOptimizationSettingsOpen,
    fileName: binFileName,
    partsFileName,
    binData,
    partsData,
    isLoading,
    isLoadingParts,
    containerCount,
    setContainerCount: handleContainerCountChange,
    fileInputRef,
    partsFileInputRef,
    toggleContainerConfig,
    toggleOptimizationSettings,
    handleFileChange,
    handlePartsFileChange,
    triggerFileInput,
    triggerPartsFileInput,
    removeFile,
    removePartsFile,
  };
}