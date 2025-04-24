import { useState } from "react";

export function useSidebar () {
    const [isContainerConfigOpen, setContainerConfigOpen] = useState(true);
    const [isOptimizationSettingsOpen, setOptimizationSettingsOpen] = useState(false);

    const toggleContainerConfig = () => {
        setOptimizationSettingsOpen(false);
        setContainerConfigOpen(!isContainerConfigOpen);
    };

    const toggleOptimizationSettings = () => {
        setContainerConfigOpen(false);
        setOptimizationSettingsOpen(!isOptimizationSettingsOpen);
    };
    return {
        isContainerConfigOpen,
        isOptimizationSettingsOpen,
        toggleContainerConfig,
        toggleOptimizationSettings,
    };
}
