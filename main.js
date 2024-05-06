import ConfigService from "./dist/services/ConfigService";
import { ModuleService } from "./dist/services/ModuleService";

const main = async () => {

    let {device, gl, presentationFormat} = await ConfigService();

    const module = await ModuleService.getModule("testUniform");

    const uniformBufferSize = 4*4 + 2*4 + 2*4;
    const uniformBuffer = device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM |GPUBufferUsage.COPY_DST
    });

    const uniformValues = new Float32Array(uniformBufferSize / 4);

    uniformValues.set([0, 1, 0, 1]);
    uniformValues.set([-0.5, -0.25], 6);
    
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
    
    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: {buffer: uniformBuffer }}
        ]
    })

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
        
        uniformValues.set([0.5, 0.5], 4);
        console.log(uniformValues);
        device.queue.writeBuffer(uniformBuffer, 0, uniformValues);

        const pass = encoder.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
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