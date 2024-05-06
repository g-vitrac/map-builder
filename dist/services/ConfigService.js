export default(canvasId = "screen") => (async () => {
    const canvas = document.querySelector(`#${canvasId}`);
    const gl = canvas.getContext("webgpu");
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    gl.configure({
        device,
        format: presentationFormat
    })
    if(!device) {
        alert("webgpu not supported");
        return;
    }
    return {device,gl,presentationFormat}
})()