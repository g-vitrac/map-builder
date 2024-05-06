import ConfigService from "./ConfigService";


export const ModuleService = (() => {
    return {
        getModuleSource: async (moduleName) => {
            return (await fetch(`dist/modules/${moduleName}.wgsl`)).text();
        },
        getModule: async (moduleName, moduleTag = "shader module") => {
            if(!moduleName) throw Error("the module name must be set");
            const {device} = await ConfigService();
            const module = device.createShaderModule({
                label: moduleTag,
                code: await ModuleService.getModuleSource(moduleName)
            });
            return module;
        }
    }
})();