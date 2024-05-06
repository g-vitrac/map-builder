

export const ModuleService = (() => {
    return {
        getModule: async (moduleName) => {
            return (await fetch(`dist/modules/${moduleName}.wgsl`)).text();
        }
    }
})();