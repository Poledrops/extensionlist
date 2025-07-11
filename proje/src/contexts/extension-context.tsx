import { createContext, use, useMemo, useState } from "react";
import { data } from "../lib/data";
import type { Extension, ButtonFilters } from "../lib/types";

type ExtensionContextType = {
    extensions : Extension[]
    activeFilter: ButtonFilters
    handleFilterChange: (filter: ButtonFilters) => void
    handleDeleteExtension: (idToDelete: Extension["id"]) => void
    handleToggleExtension: (idToToggle: Extension["id"]) => void
}

export const ExtensionContext = createContext<ExtensionContextType | null>(null);

export const ExtensionProvider = ({children}: {children: React.ReactNode;}) => {
    const [extensions, setExtensions] = useState<Extension[]>(data);
    const [activeFilter, setActiveFilter] = useState<ButtonFilters>("all");
    
    const filteredExtensions = useMemo(() => {
        switch (activeFilter) {
            case "active":
                return extensions.filter((extension) => extension.isActive);
            case "inactive":
                return extensions.filter((extension) => !extension.isActive);
            default:
                return extensions;
        }
    }, [extensions, activeFilter]);
      
    function handleFilterChange(filter: ButtonFilters) {
        setActiveFilter(filter);
    }

    function handleDeleteExtension(idToDelete: Extension["id"]) {
        setExtensions((prevExtensions) => {
            return prevExtensions.filter((extension) => extension.id !== idToDelete);
        });
    }

    function handleToggleExtension(idToggle: Extension["id"]) {
        setExtensions((prevExtensions) =>
            prevExtensions.map((extension) =>
                extension.id === idToggle
                    ? { ...extension, isActive: !extension.isActive }
                    : extension
            )
        );
    }

    return (
        <ExtensionContext.Provider value={{
            extensions: filteredExtensions,
            activeFilter,
            handleFilterChange,
            handleDeleteExtension,
            handleToggleExtension
        }}>
            {children}
        </ExtensionContext.Provider>
    );
}

export const useExtensionContext = () => {
    const context = use(ExtensionContext);
    if(!context) {
        throw new Error(
            "useExtensionContext must be used within an ExtensionProvider"
        );
    }
    return context;
}