// import { ModuleService } from "./dist/services/ModuleService";
import { ModuleService } from "./dist/services/ModuleService";

const main = async () => {
    const canvas = document.querySelector("#screen");
    const gl = canvas.getContext("webgpu");
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    gl.configure({
        device,
        format: presentationFormat
    })
    if(!device) {
        alert("Gl not supported");
        return;
    }

    const module = device.createShaderModule({
        label: "shader module",
        code: await ModuleService.getModule("triangle")
    });
    console.log(await ModuleService.getModule("triangle"));

    const pipeline = device.createRenderPipeline({
        label: 'triangle pipeline',
        layout: 'auto',
        vertex: {
            module,
        },
        fragment: {
            module,
            targets: [{ format: presentationFormat }]
        }
    });

    const renderPassDescriptor = {
        label: 'renderPipeline',
        colorAttachments: [
            {
                clearValue: [0.3, 0.3, 0.3, 1],
                loadOp: 'clear',
                storeOp: 'store'
            }
        ]
    }
    
    const render = () => {
        renderPassDescriptor.colorAttachments[0].view = gl.getCurrentTexture().createView();
        const encoder = device.createCommandEncoder({label: 'encoder'});

        const pass = encoder.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(pipeline);
        pass.draw(3);
        pass.end();

        const commandBuffer = encoder.finish();
        device.queue.submit([commandBuffer]);
    }

    render();
}

main();

export function printMsg() {
    console.log("testing npm !");
}