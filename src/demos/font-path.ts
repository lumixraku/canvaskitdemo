import CanvasKitInit from 'canvaskit-wasm';
const runCanvaskitExample = async () => {
    // 传统加载方式
    // const CanvasKit = await CanvasKitInit({
    //     locateFile: (file) =>
    //         // "https://unpkg.com/canvaskit-wasm@0.19.0/bin/" + file
    //         "/node_modules/canvaskit-wasm/bin/canvaskit.wasm"
    // });

    // 加载 CanvasKit
    const response = await fetch("/node_modules/canvaskit-wasm/bin/canvaskit.wasm");
    const wasmBinary = await response.arrayBuffer();
    // @ts-ignore
    const CanvasKit = await CanvasKitInit({ wasmBinary });

    // 创建画布
    const surface = CanvasKit.MakeCanvasSurface("canvas");
    if (!surface) {
        throw "Could not make surface";
    }
    const skCanvas = surface.getCanvas();

    //#region font
    let robotoData = await fetch(
        "/font/Roboto-Regular.ttf"
    ).then((resp) => resp.arrayBuffer());

    let emojiData = await fetch(
        "/font/NotoColorEmoji.ttf"
    ).then((resp) => resp.arrayBuffer());

    const fontMgr = CanvasKit.FontMgr.FromData(robotoData, emojiData)!;
    const typeface = CanvasKit.Typeface.MakeFreeTypeFaceFromData(robotoData);


    //#endregion


    const font = new CanvasKit.Font(typeface, 18);
    const fontPaint = new CanvasKit.Paint();
    fontPaint.setStyle(CanvasKit.PaintStyle.Fill);
    fontPaint.setAntiAlias(true);


    // 绘制文本路径并应用渐变填充
    const paint = new CanvasKit.Paint();
    paint.setStyle(CanvasKit.PaintStyle.Fill);
    paint.setAntiAlias(true);
    paint.setColor(CanvasKit.Color(1, 1, 1, 255));
    

    const path = new CanvasKit.Path(); 
    path.addCircle(100, 100, 80);

    // Create a TextBlob
    const textBlob = CanvasKit.TextBlob.MakeOnPath('Hello, Canvaskit!', path, font, 0);
    skCanvas.drawTextBlob(textBlob, 20, 20, paint);

    surface.flush();
};

export { runCanvaskitExample };