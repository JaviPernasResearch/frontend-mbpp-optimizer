import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import { binDataState } from '@/states/binDataState';
import { partsDataState } from '@/states/partsDataState';
import { binCountState } from '@/states/binCountState';
import { loadBinFromFile, loadPartsFromFile } from '@/services/BinLoaderService';
import { solutionDataState } from '@/states/solutionDataState';

export function useBinConfig() {
  const [isBinConfigOpen, setBinConfigOpen] = useState(true);
  const [isOptimizationSettingsOpen, setOptimizationSettingsOpen] = useState(false);
  const [binFileName, setBinFileName] = useState<string | null>(null);
  const [partsFileName, setPartsFileName] = useState<string | null>(null);
  const [binData, setBinData] = useAtom(binDataState);
  const [partsData, setPartsData] = useAtom(partsDataState);
  const [isLoadingBin, setIsLoadingBin] = useState(false);
  const [isLoadingParts, setIsLoadingParts] = useState(false);
  const [BinCount, setBinCount] = useAtom(binCountState);
  const binFileInputRef = useRef<HTMLInputElement>(null);
  const partsFileInputRef = useRef<HTMLInputElement>(null);
  const [solution, setSolution] = useAtom(solutionDataState)
  
  // This effect ensures fileName is always in sync with binData
  useEffect(() => {
    if (binData && !binFileName) {
      setBinFileName(`Container (ID: ${binData.id})`);
      if(solution){
        setSolution(null);
      }
    } else if (!binData && binFileName) {
      setBinFileName(null);
    }
  }, [binData, binFileName]);

  // This effect ensures partsFileName is always in sync with partsData
    useEffect(() => {
    if (partsData && !partsFileName) {
      setPartsFileName(`Parts (ID: ${partsData.map(part => part.guid).join(', ')})`);
      if(solution){
        setSolution(null);
      }
    } else if (!partsData && partsFileName) {
      setPartsFileName(null);
    }
  }, [partsData, partsFileName]);


  // Limit container count to 10
  const handleBinCountChange = (count: number) => {
    setBinCount(Math.min(Math.max(1, count), 10));
    if(solution){
        setSolution(null);
      }
  };

  const toggleBinConfig = () => {
    setOptimizationSettingsOpen(false);
    setBinConfigOpen(!isBinConfigOpen);
  };

  const toggleOptimizationSettings = () => {
    setBinConfigOpen(false);
    setOptimizationSettingsOpen(!isOptimizationSettingsOpen);
  };

  const handleBinFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.name.toLowerCase().endsWith('.json')) {
        handleJsonFile(file);
      } else {
        toast.error('Please upload a valid JSON file.');
        clearBinFileInput();
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
    setIsLoadingBin(true);
    
    try {
      const bin = await loadBinFromFile(file);
      
      setBinFileName(file.name);
      setBinData(bin);
      toast.success('Container file loaded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading file';
      toast.error(errorMessage);
      clearBinFileInput();
    } finally {
      setIsLoadingBin(false);
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

  const clearBinFileInput = () => {
    if (binFileInputRef.current) {
      binFileInputRef.current.value = '';
    }
  };

  const clearPartsFileInput = () => {
    if (partsFileInputRef.current) {
      partsFileInputRef.current.value = '';
    }
  };

  const triggerBinFileInput = () => {
    if (binFileInputRef.current) {
      binFileInputRef.current.click();
    }
  };
  
  const triggerPartsFileInput = () => {
    if (partsFileInputRef.current) {
      partsFileInputRef.current.click();
    }
  };
  
  const removeBinFile = () => {
    setBinFileName(null);
    setBinData(null);
    clearBinFileInput();
    
    // Clear solution with timeout to ensure it happens after render
    setTimeout(() => {
      setSolution(null);
    }, 0);
  };
  
  const removePartsFile = () => {
    setPartsFileName(null);
    setPartsData(null);
    clearPartsFileInput();
    
    // Clear solution with timeout to ensure it happens after render
    setTimeout(() => {
      setSolution(null);
    }, 0);
  };

  return {
    isBinConfigOpen,
    isOptimizationSettingsOpen,
    binFileName,
    partsFileName,
    binData,
    partsData,
    isLoadingBin,
    isLoadingParts,
    BinCount,
    handleBinCountChange,
    binFileInputRef,
    partsFileInputRef,
    toggleBinConfig,
    toggleOptimizationSettings,
    handleBinFileChange,
    handlePartsFileChange,
    triggerBinFileInput,
    triggerPartsFileInput,
    removeBinFile,
    removePartsFile,
  };
}