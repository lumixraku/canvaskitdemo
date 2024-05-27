import CanvasKitInit from 'canvaskit-wasm';
import { CanvasKit, Surface } from 'canvaskit-wasm';
const runCanvaskitExample = async () => {
    // const response = await fetch("/node_modules/canvaskit-wasm/bin/canvaskit.wasm");
    // const wasmBinary = await response.arrayBuffer();
    // // @ts-ignore
    // const CanvasKit = await CanvasKitInit({ wasmBinary });
    // 官方加载方式
    const CanvasKit = await CanvasKitInit({
        locateFile: (file: any) => "/node_modules/canvaskit-wasm/bin/" + file
    });
    const surface = CanvasKit.MakeCanvasSurface("canvas");
    if (!surface) {
      console.error("Failed to make canvas surface");
      return;
    }

    drawAndCheckBezier(surface, CanvasKit, 100, 190)


    surface.flush();
};

function drawAndCheckBezier(surface: Surface, CanvasKit: CanvasKit, pointX: number, pointY: number) {
  const paint = new CanvasKit.Paint();
  paint.setColor(CanvasKit.Color4f(0, 0, 1, 1)); // 设置颜色为蓝色
  paint.setStyle(CanvasKit.PaintStyle.Stroke);
  paint.setStrokeWidth(4.0);

  const path = new CanvasKit.Path();

  path.moveTo(50, 200); // 起点
  path.cubicTo(150, 100, 250, 300, 350, 200); // 第一段
  path.cubicTo(450, 100, 550, 300, 650, 200); // 第二段
  path.cubicTo(750, 100, 850, 300, 950, 200); // 第三段
  path.cubicTo(1050, 100, 1150, 300, 1250, 200); // 第四段
  path.close(); // 关闭路径以形成封闭图形

  const canvas = surface.getCanvas();
  canvas.clear(CanvasKit.WHITE);
  canvas.drawPath(path, paint);

  // 检查点是否在路径内
  const contains = path.contains(pointX, pointY);
  console.log('Point inside path:', contains);

  surface.flush();
}

export { runCanvaskitExample };