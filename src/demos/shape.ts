import CanvasKitInit from 'canvaskit-wasm';
import { CanvasKit, Surface } from 'canvaskit-wasm';


const globalThis = window;
globalThis.state = {
  pos: {
    x: 0,
    y: 0,
  },
};
const runCanvaskitExample = async () => {
  // const response = await fetch("/node_modules/canvaskit-wasm/bin/canvaskit.wasm");
  // const wasmBinary = await response.arrayBuffer();
  // // @ts-ignore
  // const CanvasKit = await CanvasKitInit({ wasmBinary });
  // 官方加载方式
  const CanvasKit = await CanvasKitInit({
    locateFile: (file: any) => "/node_modules/canvaskit-wasm/bin/" + file
  });
  const canvasEl = document.getElementById('canvas')!;
  const surface = CanvasKit.MakeCanvasSurface(canvasEl);
  if (!surface) {
    console.error("Failed to make canvas surface");
    return;
  }

  canvasEl.addEventListener('pointermove', (event: MouseEvent) => {
    // 获取鼠标相对于文档的位置
    const mouseX = event.pageX;
    const mouseY = event.pageY;

    // 获取canvas相对于文档的位置
    const canvasRect = canvasEl.getBoundingClientRect();

    // 计算鼠标相对于canvas的位置
    const canvasX = mouseX - canvasRect.left;
    const canvasY = mouseY - canvasRect.top;

    globalThis.state.pos.x = canvasX;
    globalThis.state.pos.y = canvasY;

  });




  window.requestAnimationFrame(() => {
    drawAndCheckBezier(surface, CanvasKit);
  });
  surface.flush();
};

function drawAndCheckBezier(surface: Surface, CanvasKit: CanvasKit) {
  const canvas = surface.getCanvas();
  canvas.clear(CanvasKit.WHITE);

  const pointX = globalThis.state.pos.x;
  const pointY = globalThis.state.pos.y;


  const path = new CanvasKit.Path();

  path.moveTo(50, 200); // 起点
  path.cubicTo(150, 100, 250, 300, 350, 200); // 第一段
  path.cubicTo(450, 100, 550, 300, 650, 200); // 第二段
  path.cubicTo(750, 100, 850, 300, 950, 200); // 第三段
  path.cubicTo(1050, 100, 1150, 300, 1250, 200); // 第四段
  path.close(); // 关闭路径以形成封闭图形

  // 检查点是否在路径内
  const contains = path.contains(pointX, pointY);
  console.log('Point inside path:', contains);

  const paint = new CanvasKit.Paint();
  paint.setColor(contains ? CanvasKit.Color(128, 0, 0, 1.0) : CanvasKit.Color(128, 0, 128, 1.0)); // 设置画笔颜色为紫色 (RGBA)
  paint.setStyle(CanvasKit.PaintStyle.Fill); // 设置画笔样式为填充
  // const paint = new CanvasKit.Paint();
  // paint.setColor(CanvasKit.Color4f(0, 0, 1, 1)); // 设置颜色为蓝色
  // paint.setStyle(CanvasKit.PaintStyle.Stroke);
  // paint.setStrokeWidth(4.0);
  canvas.drawPath(path, paint);

  surface.flush();

  requestAnimationFrame(() => drawAndCheckBezier(surface, CanvasKit));
}

export { runCanvaskitExample };