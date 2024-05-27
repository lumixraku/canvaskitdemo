import CanvasKitInit from 'canvaskit-wasm/bin/profiling/canvaskit.js';
import * as opentype from 'opentype.js';
const runCanvaskitExample = async () => {

    // 官方加载方式
    const CanvasKit = await CanvasKitInit({
        locateFile: (file: any) => "/node_modules/canvaskit-wasm/bin/profiling/" + file
    });


    // 创建画布
    const surface = CanvasKit.MakeCanvasSurface("canvas");
    if (!surface) {
        throw "Could not make surface";
    }
    const skCanvas = surface.getCanvas();

    // 绘制文本路径并应用渐变填充
    const paint = new CanvasKit.Paint();
    paint.setStyle(CanvasKit.PaintStyle.Fill);
    paint.setAntiAlias(true);
    // paint.setColor(CanvasKit.Color(1, 1, 1, 255));
    paint.setColor(CanvasKit.Color4f(0.5, 0.5, 1.0, 0.8)); // 浅蓝色，半透明

    const buffer = fetch('/font/ZCOOLQingKeHuangYou-Regular.ttf').then(res => res.arrayBuffer());
    const opentypeFont = opentype.parse(await buffer);
    const opentypePath = opentypeFont.getPath('圣诞树Tree', 0, 0, 72);
    const path = CanvasKit.Path.MakeFromSVGString(opentypePath.toPathData(0))!;

    const translateMatrix = CanvasKit.Matrix.translated(100, 100);
    path.transform(translateMatrix);


    const blurStyle = CanvasKit.BlurStyle.Normal; // 模糊样式
    const sigma = 2.0; // 模糊程度，高斯模糊的标准差
    const blurFilter = CanvasKit.MaskFilter.MakeBlur(blurStyle, sigma, true);
    paint.setMaskFilter(blurFilter);
    skCanvas.drawPath(path, paint);


    paint.setMaskFilter(null);
    const translateMatrixFont = CanvasKit.Matrix.translated(10, 10);
    path.transform(translateMatrixFont);
    skCanvas.drawPath(path, paint);


    surface.flush();
};



export { runCanvaskitExample };