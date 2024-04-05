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
    const CanvasKit = await CanvasKitInit({ wasmBinary });

    // 创建画布
    const surface = CanvasKit.MakeCanvasSurface("canvas");
    if (!surface) {
        throw "Could not make surface";
    }
    const fontPaint = new CanvasKit.Paint();
    fontPaint.setStyle(CanvasKit.PaintStyle.Fill);
    fontPaint.setAntiAlias(true);

    // 绘制文本路径并应用渐变填充
    const paint = new CanvasKit.Paint();
    paint.setStyle(CanvasKit.PaintStyle.Fill);
    paint.setAntiAlias(true);


    let editor = document.getElementById("editor")!;
    let str = editor.innerText;


    const fetchFont = async () => {
        let robotoData = await fetch(
            "/font/Roboto-Regular.ttf"
        ).then((resp) => resp.arrayBuffer());

        let emojiData = await fetch(
            "/font/NotoColorEmoji.ttf"
        ).then((resp) => resp.arrayBuffer());

        const fontMgr = CanvasKit.FontMgr.FromData([robotoData, emojiData]);

        // Flutter uses the same bindings, docs here:
        // https://api.flutter.dev/flutter/painting/StrutStyle-class.html
        const paraStyle = new CanvasKit.ParagraphStyle({
            // See here: https://github.com/google/skia/blob/1f193df9b393d50da39570dab77a0bb5d28ec8ef/modules/canvaskit/npm_build/types/index.d.ts#L919
            textStyle: {
                color: CanvasKit.RED,
                fontFamilies: ["Roboto", "Noto Color Emoji"],
                fontSize: 50
            },
            // See here:
            // https://api.flutter.dev/flutter/painting/StrutStyle-class.html
            // Trying to match this to css line-height
            strutStyle: {
                strutEnabled: true,
                fontFamilies: ["Roboto", "Noto Color Emoji"],
                fontSize: 50,
                // mapping css line-height to this is does not seem 1:1
                heightMultiplier: 1,
                forceStrutHeight: true
            },
            textAlign: CanvasKit.TextAlign.Left,
            maxLines: 7,

            ellipsis: "..."
        });

        return { fontMgr, paraStyle };
    };

    let { paraStyle, fontMgr } = await fetchFont();


    let wrapTo = 350;
    let count = 1;
    function drawFrame(canvas) {

        wrapTo = 350 + 150 * Math.sin(Date.now() / 2000);

        let builder = CanvasKit.ParagraphBuilder.Make(paraStyle, fontMgr);
        builder.addText(str);
        let paragraph = builder.build();
        canvas.clear(CanvasKit.WHITE);
        paragraph.layout(wrapTo);
        canvas.drawParagraph(paragraph, 0, 0);
        canvas.drawLine(wrapTo, 0, wrapTo, 400, fontPaint);

        surface.requestAnimationFrame(drawFrame);
    }

    // hdpi painting
    surface.getCanvas().scale(2, 2);
    surface.requestAnimationFrame(drawFrame);
};

// 执行 CanvasKit 示例
// runCanvaskitExample();
export { runCanvaskitExample }