import CanvasKitInit from 'canvaskit-wasm';
import PathKitInit from 'pathkit-wasm';
const runCanvaskitExample = async () => {
    // const response = await fetch("/node_modules/canvaskit-wasm/bin/canvaskit.wasm");
    // const wasmBinary = await response.arrayBuffer();
    // // @ts-ignore
    // const CanvasKit = await CanvasKitInit({ wasmBinary });
    // 官方加载方式
    const CanvasKit = await CanvasKitInit({
        locateFile: (file: any) => "/node_modules/canvaskit-wasm/bin/" + file
    });

    // 加载 PathKit
    const PathKit = await PathKitInit({
        locateFile: (file: any) => '/node_modules/pathkit-wasm/bin/' + file,
    });


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

    // 最小字体 9 号 小于9 提示 zero-length path in getPosTa
    const font = new CanvasKit.Font(typeface, 19);
    const fontPaint = new CanvasKit.Paint();
    fontPaint.setStyle(CanvasKit.PaintStyle.Fill);
    fontPaint.setAntiAlias(true);


    // 绘制文本路径并应用渐变填充
    const paint = new CanvasKit.Paint();
    paint.setStyle(CanvasKit.PaintStyle.Fill);
    paint.setAntiAlias(true);
    // paint.setColor(CanvasKit.Color(1, 1, 1, 255));
    paint.setColor(CanvasKit.Color4f(0.5, 0.5, 1.0, 0.5)); // 浅蓝色，半透明



    const path = new CanvasKit.Path();
    path.addCircle(100, 100, 80);

    const rectPath = new CanvasKit.Path();
    rectPath.addRect(CanvasKit.LTRBRect(350, 0, 450, 100));
    path.op(rectPath, PathKit.PathOp.UNION);

    const trianglePath = new CanvasKit.Path();
    trianglePath.moveTo(650, 0);
    trianglePath.lineTo(650, 100);
    // 注意时针顺序  如果是顺时针, 文字将在 shape 内部
    trianglePath.lineTo(550, 100);
    trianglePath.close();
    path.op(trianglePath, PathKit.PathOp.UNION);
    // Not working
    // const path = PathKit.MakeFromOp(circlePath, trianglePath, PathKit.PathOp.UNION);
    // console.log('path', path.toSVGString())
    skCanvas.drawPath(path, paint);

    // Create a TextBlob
    const elem = document.querySelector('#editor') as HTMLElement;
    const text = elem?.innerText;
    const textBlob = CanvasKit.TextBlob.MakeOnPath(text, path, font, 0);
    skCanvas.drawTextBlob(textBlob, 0, 0, paint);

    surface.flush();
};

export { runCanvaskitExample };