import React from 'react';
import { useContainerConfig } from '../../hooks/useContainerConfig';

const ContainerConfig = () => {
  const {
    fileName,
    isLoading,
    fileInputRef,
    binData,
    containerCount,
    setContainerCount,
    handleFileChange,
    triggerFileInput,
    removeFile,
  } = useContainerConfig();

  return (
    <div className="p-4 space-y-4">
      {/* Container Model Upload Section */}
      <div className="border rounded-md p-3 bg-gray-50">
        <h3 className="font-medium text-sm mb-2">Container JSON Model</h3>
        
        <div className="flex flex-col space-y-2">
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          {!fileName && !isLoading && (
            <button
              onClick={triggerFileInput}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload JSON File
            </button>
          )}
          
          {isLoading && (
            <div className="bg-blue-100 text-blue-700 py-2 px-4 rounded flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading JSON file...
            </div>
          )}
          
          {fileName && !isLoading && (
            <div className="border rounded p-2 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate max-w-[180px]">
                    {binData ? `IMOS Container (ID: ${binData.id})` : fileName}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={triggerFileInput}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Change
                  </button>
                  <button 
                    onClick={removeFile}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Container Count */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm mb-2">Container Settings</h3>
        <div className="flex items-center space-x-2">
          <label htmlFor="containerCount" className="w-40">Number of Containers:</label>
          <input 
            type="number" 
            id="containerCount" 
            value={containerCount}
            onChange={(e) => setContainerCount(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="border rounded p-1 w-full" 
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Specify how many containers are available for optimization.
        </p>
      </div>
    </div>
  );
};

export default ContainerConfig;