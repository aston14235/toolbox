ToolBox.define("photo-editor", {
  styles: [
    /* ============ Photoshop-style shell ============ */
    ".pe-app { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: #131722; height: min(760px, calc(100vh - 150px)); min-height: 520px; }",
    ".pe-menubar { display: flex; align-items: center; gap: 2px; padding: 0 10px; background: linear-gradient(#1d2431, #161b27); border-bottom: 1px solid #0b0f16; flex-shrink: 0; }",
    ".pe-brand { display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: .78rem; color: #d3dcea; margin-right: 10px; letter-spacing: .02em; white-space: nowrap; }",
    ".pe-brand .pe-logo { width: 18px; height: 18px; border-radius: 4px; background: linear-gradient(135deg, #4b6ef5, #00c2ff); color: #fff; font-size: .62rem; display: inline-flex; align-items: center; justify-content: center; }",
    ".pe-menu { position: relative; }",
    ".pe-menu-btn { background: none; border: none; color: #a9b4c6; font-size: .74rem; padding: 7px 9px; border-radius: 5px; cursor: pointer; font-family: inherit; }",
    ".pe-menu-btn:hover, .pe-menu.open .pe-menu-btn { background: rgba(255,255,255,.08); color: #e8eef7; }",
    ".pe-menu-drop { display: none; position: absolute; top: calc(100% + 4px); left: 0; min-width: 190px; background: #1b2130; border: 1px solid #2b3545; border-radius: 8px; padding: 5px; box-shadow: 0 10px 28px rgba(0,0,0,.55); z-index: 60; }",
    ".pe-menu.open .pe-menu-drop { display: block; }",
    ".pe-menu-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; text-align: left; background: none; border: none; color: #ccd5e3; font-size: .74rem; padding: 7px 10px; border-radius: 5px; cursor: pointer; font-family: inherit; }",
    ".pe-menu-item:hover { background: rgba(75,110,245,.22); color: #fff; }",
    ".pe-menu-sep { height: 1px; background: #2b3545; margin: 4px 8px; }",
    ".pe-kbd { font-size: .64rem; color: #6f7d92; }",
    ".pe-menubar .pe-spacer { flex: 1; }",
    ".pe-menubar .controls { gap: 6px; flex-wrap: nowrap; }",
    ".pe-main { display: flex; flex: 1; min-height: 0; }",
    ".pe-tools { width: 50px; background: #1a202c; border-right: 1px solid #10151f; padding: 8px 6px; display: flex; flex-direction: column; align-items: center; gap: 5px; overflow-y: auto; flex-shrink: 0; }",
    ".pe-tool-btn { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; background: transparent; border: 1px solid transparent; border-radius: 8px; color: #b7c1d3; cursor: pointer; }",
    ".pe-tool-btn:hover { background: rgba(255,255,255,.07); border-color: #2a3442; color: #fff; }",
    ".pe-tool-btn.active { background: rgba(75,110,245,.22); border-color: #4b6ef5; color: #fff; }",
    ".pe-workspace { flex: 1; min-width: 0; display: flex; flex-direction: column; }",
    ".pe-canvas-area { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 18px; overflow: auto; background-color: #151a24; background-image: radial-gradient(circle, #1e2532 1.2px, transparent 1.2px); background-size: 18px 18px; }",
    ".pe-canvas-wrap { position: relative; display: inline-flex; background: repeating-conic-gradient(#1e2530 0 25%, #141a24 0 50%) 0 0 / 22px 22px; border: 1px solid #2b3545; border-radius: 4px; padding: 10px; box-shadow: 0 8px 28px rgba(0,0,0,.5); }",
    ".pe-canvas-wrap canvas { display: block; max-width: 100%; height: auto; border-radius: 2px; box-shadow: 0 1px 8px rgba(0,0,0,.55); }",
    "#crop-overlay { position: absolute; inset: 10px; z-index: 10; }",
    "#crop-box { position: absolute; border: 1.5px solid #fff; box-shadow: 0 0 0 9999px rgba(0,0,0,.55), 0 0 0 1px rgba(0,0,0,.4) inset; cursor: move; }",
    ".pe-h { position: absolute; width: 13px; height: 13px; background: #fff; border: 1px solid #2a3442; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,.5); }",
    ".pe-panels { width: 290px; background: #1a202c; border-left: 1px solid #10151f; overflow-y: auto; padding: 10px 12px 14px; flex-shrink: 0; }",
    ".pe-panel { border: 1px solid #242d3d; border-radius: 8px; background: #171d28; margin-bottom: 10px; overflow: hidden; }",
    ".pe-panel-head { padding: 7px 10px; background: linear-gradient(#202837, #1a2230); border-bottom: 1px solid #242d3d; font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #9fb0c8; }",
    ".pe-panel-body { padding: 10px; }",
    ".pe-slider-row { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }",
    ".pe-slider-row label { font-size: .72rem; color: #a9b4c6; min-width: 76px; }",
    ".pe-slider-row input[type=range] { flex: 1; min-width: 0; }",
    ".pe-slider-row select { flex: 1; }",
    ".pe-slider-row span { min-width: 2.6em; text-align: right; font-size: .7rem; font-variant-numeric: tabular-nums; color: #7e8ba0; }",
    ".pe-btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px; }",
    ".pe-panel .btn { padding: 6px 8px; font-size: .72rem; }",
    ".pe-crop-actions { display: none; margin-top: 8px; gap: 6px; }",
    ".pe-crop-actions.show { display: flex; }",
    ".pe-check-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: .78rem; color: #c5cede; cursor: pointer; }",
    ".pe-check-row input { accent-color: #4b6ef5; }",
    ".pe-statusbar { display: flex; align-items: center; gap: 16px; padding: 5px 12px; background: #161c28; border-top: 1px solid #10151f; font-size: .7rem; color: #8491a5; flex-shrink: 0; }",
    ".pe-statusbar .pe-spacer { flex: 1; }",
    ".pe-statusbar b { color: #c5cede; font-weight: 600; }",
    "@media (max-width: 900px) { .pe-app { height: auto; } .pe-main { flex-direction: column; } .pe-tools { width: auto; flex-direction: row; justify-content: center; border-right: none; border-bottom: 1px solid #10151f; } .pe-canvas-area { min-height: 340px; } .pe-panels { width: auto; border-left: none; border-top: 1px solid #10151f; } }",
    "@media (max-width: 640px) { .pe-menubar .pe-menu { display: none; } .pe-statusbar { font-size: .64rem; } .pe-menubar .controls { gap: 4px; } }",
    "@media (prefers-reduced-motion: no-preference) { .pe-panel-body { animation: none; } }"
  ].join(""),

  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose an image">'
      + '<span class="dz-icon">🖼️</span><strong>Drop a photo here</strong> or click to browse'
      + '<input type="file" id="file" accept="image/*" class="hidden">'
      + "</div>"
      + '<div id="editor" class="hidden">'
      + '<div class="pe-app">'
      /* ---------- menu bar ---------- */
      + '<div class="pe-menubar">'
      + '<span class="pe-brand"><span class="pe-logo">PS</span> Photo Editor</span>'
      + '<div class="pe-menu" id="menu-file"><button class="pe-menu-btn" type="button">File ▾</button><div class="pe-menu-drop">'
      + '<button class="pe-menu-item" data-action="export">Export…</button>'
      + '<button class="pe-menu-item" data-action="download">Download <span class="pe-kbd">PNG</span></button>'
      + '<div class="pe-menu-sep"></div>'
      + '<button class="pe-menu-item" data-action="reset">Reset All</button>'
      + "</div></div>"
      + '<div class="pe-menu" id="menu-edit"><button class="pe-menu-btn" type="button">Edit ▾</button><div class="pe-menu-drop">'
      + '<button class="pe-menu-item" data-action="undo">Undo <span class="pe-kbd">Ctrl+Z</span></button>'
      + '<button class="pe-menu-item" data-action="redo">Redo <span class="pe-kbd">Ctrl+Shift+Z</span></button>'
      + "</div></div>"
      + '<div class="pe-menu" id="menu-image"><button class="pe-menu-btn" type="button">Image ▾</button><div class="pe-menu-drop">'
      + '<button class="pe-menu-item" data-action="rotate-cw">Rotate 90° CW</button>'
      + '<button class="pe-menu-item" data-action="rotate-ccw">Rotate 90° CCW</button>'
      + '<div class="pe-menu-sep"></div>'
      + '<button class="pe-menu-item" data-action="flip-h">Flip Horizontal</button>'
      + '<button class="pe-menu-item" data-action="flip-v">Flip Vertical</button>'
      + "</div></div>"
      + '<div class="pe-menu" id="menu-view"><button class="pe-menu-btn" type="button">View ▾</button><div class="pe-menu-drop">'
      + '<button class="pe-menu-item" data-action="compare">Hold to Compare</button>'
      + '<button class="pe-menu-item" data-action="crop">Crop Mode</button>'
      + "</div></div>"
      + '<span class="pe-spacer"></span>'
      + '<div class="controls">'
      + '<button id="undo" class="btn" disabled title="Undo (Ctrl+Z)">↩️ Undo</button>'
      + '<button id="redo" class="btn" disabled title="Redo (Ctrl+Shift+Z)">↪️ Redo</button>'
      + '<button id="compare" class="btn" title="Hold to see the original">👁️ Hold</button>'
      + '<button id="reset" class="btn ghost" title="Reset every adjustment">♻️ Reset</button>'
      + '<button id="export" class="btn primary">⬇️ Export</button>'
      + "</div>"
      + "</div>"
      /* ---------- main ---------- */
      + '<div class="pe-main">'
      /* left tool rail */
      + '<div class="pe-tools" aria-label="Toolbox">'
      + '<button class="pe-tool-btn" id="tool-crop" title="Crop (C)">✂️</button>'
      + '<button class="pe-tool-btn" id="tool-rotate-cw" title="Rotate 90° clockwise">↻</button>'
      + '<button class="pe-tool-btn" id="tool-rotate-ccw" title="Rotate 90° counter-clockwise">↺</button>'
      + '<button class="pe-tool-btn" id="tool-flip-h" title="Flip horizontal">⇋</button>'
      + '<button class="pe-tool-btn" id="tool-flip-v" title="Flip vertical">⇵</button>'
      + '<button class="pe-tool-btn" id="tool-reset" title="Reset all adjustments">♻️</button>'
      + "</div>"
      /* center workspace */
      + '<div class="pe-workspace">'
      + '<div class="pe-canvas-area">'
      + '<div class="pe-canvas-wrap" id="wrap">'
      + '<canvas id="view" aria-label="Edited photo preview"></canvas>'
      + '<div id="crop-overlay" class="hidden"><div id="crop-box">'
      + '<span class="pe-h" data-dir="nw"></span><span class="pe-h" data-dir="n"></span><span class="pe-h" data-dir="ne"></span>'
      + '<span class="pe-h" data-dir="e"></span><span class="pe-h" data-dir="se"></span><span class="pe-h" data-dir="s"></span>'
      + '<span class="pe-h" data-dir="sw"></span><span class="pe-h" data-dir="w"></span>'
      + "</div></div>"
      + "</div>"
      + "</div>"
      + '<div class="pe-statusbar">'
      + '<span id="dims"></span>'
      + '<span class="pe-spacer"></span>'
      + '<span>Zoom <b id="zoom-v">—</b></span>'
      + "</div>"
      + "</div>"
      /* right panels */
      + '<div class="pe-panels">'
      + '<div class="pe-panel" id="crop-controls">'
      + '<div class="pe-panel-head">✂️ Crop</div>'
      + '<div class="pe-panel-body">'
      + '<div class="controls" id="crop-idle" style="gap:6px;">'
      + '<button id="crop-btn" class="btn">✂️ Crop</button>'
      + '<label style="font-size:.72rem;display:flex;align-items:center;gap:4px;">Aspect <select id="crop-aspect"><option value="free">Free</option><option value="1">1:1</option><option value="1.333">4:3</option><option value="1.5">3:2</option><option value="1.778">16:9</option></select></label>'
      + "</div>"
      + '<div class="pe-crop-actions" id="crop-actions">'
      + '<button id="crop-apply" class="btn primary">✅ Apply crop</button>'
      + '<button id="crop-cancel" class="btn ghost">✕ Cancel</button>'
      + "</div>"
      + "</div></div>"
      + '<div class="pe-panel">'
      + '<div class="pe-panel-head">🖼️ Image</div>'
      + '<div class="pe-panel-body">'
      + '<div class="pe-btn-row">'
      + '<button id="rotate-cw" class="btn">↻ 90°</button>'
      + '<button id="rotate-ccw" class="btn">↺ 90°</button>'
      + '<button id="flip-h" class="btn">⇋ Flip H</button>'
      + '<button id="flip-v" class="btn">⇵ Flip V</button>'
      + "</div>"
      + '<div class="pe-slider-row"><label>Rotate</label><input type="range" id="a-rotate" min="-180" max="180" value="0"><span id="a-rotate-v">0°</span></div>'
      + '<div class="pe-slider-row"><label>Output size</label><input type="range" id="a-scale" min="25" max="200" value="100"><span id="a-scale-v">100%</span></div>'
      + "</div></div>"
      + '<div class="pe-panel">'
      + '<div class="pe-panel-head">🎚️ Adjustments</div>'
      + '<div class="pe-panel-body">'
      + '<div class="pe-slider-row"><label>Brightness</label><input type="range" id="a-brightness" min="-100" max="100" value="0"><span id="a-brightness-v">0</span></div>'
      + '<div class="pe-slider-row"><label>Contrast</label><input type="range" id="a-contrast" min="0" max="200" value="100"><span id="a-contrast-v">100</span></div>'
      + '<div class="pe-slider-row"><label>Saturation</label><input type="range" id="a-saturation" min="0" max="200" value="100"><span id="a-saturation-v">100</span></div>'
      + '<div class="pe-slider-row"><label>Hue</label><input type="range" id="a-hue" min="-180" max="180" value="0"><span id="a-hue-v">0</span></div>'
      + '<div class="pe-slider-row"><label>Exposure</label><input type="range" id="a-exposure" min="-100" max="100" value="0"><span id="a-exposure-v">0</span></div>'
      + '<div class="pe-slider-row"><label>Temperature</label><input type="range" id="a-temp" min="-100" max="100" value="0"><span id="a-temp-v">0</span></div>'
      + '<div class="pe-slider-row"><label>Tint</label><input type="range" id="a-tint" min="-100" max="100" value="0"><span id="a-tint-v">0</span></div>'
      + '<div class="pe-slider-row"><label>Vignette</label><input type="range" id="a-vignette" min="0" max="100" value="0"><span id="a-vignette-v">0</span></div>'
      + '<div class="pe-slider-row"><label>Sharpen</label><input type="range" id="a-sharpen" min="0" max="100" value="0"><span id="a-sharpen-v">0</span></div>'
      + '<div class="pe-slider-row"><label>Blur</label><input type="range" id="a-blur" min="0" max="100" value="0"><span id="a-blur-v">0</span></div>'
      + '<div class="pe-slider-row"><label>Grain</label><input type="range" id="a-grain" min="0" max="100" value="0"><span id="a-grain-v">0</span></div>'
      + "</div></div>"
      + '<div class="pe-panel">'
      + '<div class="pe-panel-head">🎨 Filters</div>'
      + '<div class="pe-panel-body">'
      + '<label class="pe-check-row"><input type="checkbox" id="a-gray"> Grayscale</label>'
      + '<label class="pe-check-row"><input type="checkbox" id="a-sepia"> Sepia</label>'
      + '<label class="pe-check-row"><input type="checkbox" id="a-invert"> Invert</label>'
      + "</div></div>"
      + '<div class="pe-panel hidden" id="export-panel">'
      + '<div class="pe-panel-head">💾 Export</div>'
      + '<div class="pe-panel-body">'
      + '<div class="pe-slider-row"><label>Format</label><select id="ex-format"><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option></select></div>'
      + '<div class="pe-slider-row"><label>Quality</label><input type="range" id="ex-quality" min="10" max="100" value="92"><span id="ex-quality-v">92</span></div>'
      + '<button id="ex-download" class="btn primary" style="width:100%;">⬇️ Download</button>'
      + '<p class="muted small" style="margin:8px 0 0;">Exports at full resolution.</p>'
      + "</div></div>"
      + "</div>"
      + "</div>"
      + "</div></div>";

    var $ = function (id) { return box.querySelector("#" + id); };
    var img = null;
    var state = null;
    var history = [];
    var hIndex = -1;
    var currentResult = null; // {canvas, W, H, fullW, fullH, baseW, baseH}
    var cropMode = false;
    var comparing = false;

    var DEFAULTS = function () {
      return {
        adj: { brightness: 0, contrast: 100, saturation: 100, hue: 0, exposure: 0, temp: 0, tint: 0, vignette: 0, sharpen: 0, blur: 0, grain: 0, gray: false, sepia: false, invert: false },
        rotate: 0, flipH: false, flipV: false,
        crop: null,
        scale: 100
      };
    };

    function clone(s) { return JSON.parse(JSON.stringify(s)); }
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    /* ---------- color math ---------- */
    function rgbToHsl(r, g, b) {
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
      }
      return [h, s, l];
    }
    function hslToRgb(h, s, l) {
      if (s === 0) { var v = l * 255; return [v, v, v]; }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      function hue2rgb(t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }
      return [hue2rgb(h + 1 / 3) * 255, hue2rgb(h) * 255, hue2rgb(h - 1 / 3) * 255];
    }

    /* ---------- per-pixel adjustment pipeline ---------- */
    function adjustPixels(data, W, H, a) {
      var n = W * H;
      var bright = a.brightness / 100;
      var contrast = a.contrast / 100;
      var sat = a.saturation / 100;
      var hueShift = a.hue / 360;
      var exp = Math.pow(2, a.exposure / 100);
      var temp = a.temp / 100;
      var tint = a.tint / 100;
      var vig = a.vignette / 100;
      var cx = (W - 1) / 2, cy = (H - 1) / 2;
      var invMaxD = 1 / Math.sqrt(cx * cx + cy * cy);
      for (var i = 0; i < n; i++) {
        var p = i * 4;
        var r = data[p] / 255, g = data[p + 1] / 255, b = data[p + 2] / 255;
        // exposure + temperature + tint (linear-ish space)
        r *= exp; g *= exp; b *= exp;
        if (temp !== 0) { r += temp * 0.14; b -= temp * 0.16; }
        if (tint !== 0) { g += tint * 0.12; }
        r = clamp01(r); g = clamp01(g); b = clamp01(b);
        // HSL adjustments
        var hsl = rgbToHsl(r, g, b);
        if (a.gray) hsl[1] = 0;
        else if (sat !== 1) hsl[1] = clamp01(hsl[1] * sat);
        if (hueShift !== 0) { hsl[0] = (hsl[0] + hueShift) % 1; if (hsl[0] < 0) hsl[0] += 1; }
        hsl[2] = (hsl[2] - 0.5) * contrast + 0.5 + bright;
        hsl[2] = clamp01(hsl[2]);
        var rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
        r = rgb[0]; g = rgb[1]; b = rgb[2];
        // sepia
        if (a.sepia) {
          var nr = r * 0.393 + g * 0.769 + b * 0.189;
          var ng = r * 0.349 + g * 0.686 + b * 0.168;
          var nb = r * 0.272 + g * 0.534 + b * 0.131;
          r = nr; g = ng; b = nb;
        }
        // invert
        if (a.invert) { r = 255 - r; g = 255 - g; b = 255 - b; }
        // vignette
        if (vig > 0) {
          var dx = (i % W) - cx, dy = ((i / W) | 0) - cy;
          var d = Math.sqrt(dx * dx + dy * dy) * invMaxD;
          var f = 1 - vig * d * d;
          r *= f; g *= f; b *= f;
        }
        data[p] = r > 255 ? 255 : r < 0 ? 0 : r;
        data[p + 1] = g > 255 ? 255 : g < 0 ? 0 : g;
        data[p + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
      }
    }

    /* ---------- convolution (blur / sharpen) ---------- */
    function convolve(imgData, W, H, kernel, kdiv, koff) {
      var src = new Uint8ClampedArray(imgData.data);
      var d = imgData.data;
      var k = kernel;
      var half = Math.sqrt(k.length) / 2 | 0;
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var i = (y * W + x) * 4;
          var r = 0, g = 0, b = 0;
          var ki = 0;
          for (var ky = -half; ky <= half; ky++) {
            var yy = y + ky;
            if (yy < 0) yy = 0; else if (yy >= H) yy = H - 1;
            for (var kx = -half; kx <= half; kx++) {
              var xx = x + kx;
              if (xx < 0) xx = 0; else if (xx >= W) xx = W - 1;
              var si = (yy * W + xx) * 4;
              var wgt = k[ki++];
              r += src[si] * wgt;
              g += src[si + 1] * wgt;
              b += src[si + 2] * wgt;
            }
          }
          d[i] = r / kdiv + koff;
          d[i + 1] = g / kdiv + koff;
          d[i + 2] = b / kdiv + koff;
        }
      }
    }

    function addGrain(data, n, amount) {
      var m = amount / 100 * 55;
      for (var i = 0; i < n; i++) {
        var p = i * 4;
        var no = (Math.random() * 2 - 1) * m;
        data[p] += no;
        data[p + 1] += no;
        data[p + 2] += no;
      }
    }

    /* ---------- build the edited image ---------- */
    function buildResult(st, maxDim) {
      var angle = st.rotate * Math.PI / 180;
      var rad = Math.abs(angle);
      var cw = Math.abs(Math.cos(rad)), sh = Math.abs(Math.sin(rad));
      var iw = img.naturalWidth, ih = img.naturalHeight;
      var bw = iw * cw + ih * sh;
      var bh = iw * sh + ih * cw;
      var rot = document.createElement("canvas");
      rot.width = Math.max(1, Math.round(bw));
      rot.height = Math.max(1, Math.round(bh));
      var rctx = rot.getContext("2d");
      rctx.fillStyle = "#ffffff";
      rctx.fillRect(0, 0, rot.width, rot.height);
      rctx.translate(rot.width / 2, rot.height / 2);
      rctx.rotate(angle);
      rctx.scale(st.flipH ? -1 : 1, st.flipV ? -1 : 1);
      rctx.drawImage(img, -iw / 2, -ih / 2);

      var crop = st.crop;
      var baseW = crop ? Math.max(1, Math.round(crop.w)) : rot.width;
      var baseH = crop ? Math.max(1, Math.round(crop.h)) : rot.height;
      var outW = Math.max(1, Math.round(baseW * st.scale / 100));
      var outH = Math.max(1, Math.round(baseH * st.scale / 100));
      var scaleF = 1;
      if (maxDim) {
        var longest = Math.max(outW, outH);
        if (longest > maxDim) scaleF = maxDim / longest;
      }
      var W = Math.max(1, Math.round(outW * scaleF));
      var H = Math.max(1, Math.round(outH * scaleF));
      var canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      var ctx = canvas.getContext("2d");
      if (crop) ctx.drawImage(rot, crop.x, crop.y, crop.w, crop.h, 0, 0, W, H);
      else ctx.drawImage(rot, 0, 0, W, H);

      var imgData = ctx.getImageData(0, 0, W, H);
      adjustPixels(imgData.data, W, H, st.adj);
      if (st.adj.blur > 0) {
        var blurIters = Math.min(4, Math.ceil(st.adj.blur / 25));
        for (var bi = 0; bi < blurIters; bi++) convolve(imgData, W, H, [1, 2, 1, 2, 4, 2, 1, 2, 1], 16, 0);
      }
      if (st.adj.sharpen > 0) {
        var k = st.adj.sharpen / 100 * 0.8;
        convolve(imgData, W, H, [0, -k, 0, -k, 1 + 4 * k, -k, 0, -k, 0], 1, 0);
      }
      if (st.adj.grain > 0) addGrain(imgData.data, W * H, st.adj.grain);
      ctx.putImageData(imgData, 0, 0);

      return {
        canvas: canvas, W: W, H: H,
        fullW: outW, fullH: outH,
        baseW: baseW, baseH: baseH,
        scale: st.scale
      };
    }

    /* ---------- display ---------- */
    var view = $("view");
    var viewCtx = view.getContext("2d");
    var wrapEl = $("wrap");

    function renderPreview() {
      if (!img) return;
      currentResult = buildResult(state, 960); /* interactive preview stays light; export uses full res */
      drawCurrent();
    }
    /* coalesced, throttled rendering for continuous slider drags */
    var renderQueued = false;
    var lastRenderAt = 0;
    var RENDER_MIN_MS = 60;
    function scheduleRender() {
      if (renderQueued) return;
      renderQueued = true;
      requestAnimationFrame(function () {
        renderQueued = false;
        var now = performance.now();
        if (now - lastRenderAt < RENDER_MIN_MS) { scheduleRender(); return; }
        lastRenderAt = now;
        renderPreview();
      });
    }
    function areaFit(W, H) {
      var area = wrapEl.parentElement;
      var maxW = Math.max(140, area.clientWidth - 44);
      var maxH = Math.max(140, area.clientHeight - 30);
      return Math.min(maxW / W, maxH / H);
    }
    function drawCurrent() {
      var r = currentResult;
      var fit = areaFit(r.W, r.H);
      view.width = Math.max(1, Math.round(r.W * fit));
      view.height = Math.max(1, Math.round(r.H * fit));
      viewCtx.drawImage(r.canvas, 0, 0, view.width, view.height);
      $("dims").textContent = r.fullW + " × " + r.fullH + " px" + (r.scale !== 100 ? " · " + r.scale + "% size" : "");
      if ($("zoom-v")) $("zoom-v").textContent = Math.round(fit * 100) + "%";
    }
    function drawOriginal() {
      var fit = areaFit(img.naturalWidth, img.naturalHeight);
      view.width = Math.max(1, Math.round(img.naturalWidth * fit));
      view.height = Math.max(1, Math.round(img.naturalHeight * fit));
      viewCtx.drawImage(img, 0, 0, view.width, view.height);
    }

    /* ---------- history ---------- */
    function pushHistory() {
      history = history.slice(0, hIndex + 1);
      history.push(clone(state));
      if (history.length > 30) history.shift();
      hIndex = history.length - 1;
      $("undo").disabled = hIndex <= 0;
      $("redo").disabled = true;
    }
    function undo() {
      if (hIndex <= 0) return;
      hIndex--;
      state = clone(history[hIndex]);
      syncControls();
      exitCrop();
      renderPreview();
      $("undo").disabled = hIndex <= 0;
      $("redo").disabled = hIndex >= history.length - 1;
    }
    function redo() {
      if (hIndex >= history.length - 1) return;
      hIndex++;
      state = clone(history[hIndex]);
      syncControls();
      exitCrop();
      renderPreview();
      $("undo").disabled = hIndex <= 0;
      $("redo").disabled = hIndex >= history.length - 1;
    }
    $("undo").addEventListener("click", undo);
    $("redo").addEventListener("click", redo);

    /* ---------- controls ---------- */
    var SLIDERS = [
      ["a-brightness", "brightness"], ["a-contrast", "contrast"], ["a-saturation", "saturation"],
      ["a-hue", "hue"], ["a-exposure", "exposure"], ["a-temp", "temp"], ["a-tint", "tint"],
      ["a-vignette", "vignette"], ["a-sharpen", "sharpen"], ["a-blur", "blur"], ["a-grain", "grain"]
    ];
    SLIDERS.forEach(function (pair) {
      var el = $(pair[0]);
      el.addEventListener("input", function () {
        state.adj[pair[1]] = Number(el.value);
        $(pair[0] + "-v").textContent = el.value;
        scheduleRender();
      });
      el.addEventListener("change", pushHistory);
    });
    ["a-gray", "a-sepia", "a-invert"].forEach(function (id) {
      $(id).addEventListener("change", function () {
        pushHistory();
        state.adj[id.slice(2)] = $(id).checked;
        renderPreview();
      });
    });
    var rotateEl = $("a-rotate");
    rotateEl.addEventListener("input", function () {
      state.rotate = Number(rotateEl.value);
      $("a-rotate-v").textContent = rotateEl.value + "°";
      state.crop = null;
      scheduleRender();
    });
    rotateEl.addEventListener("change", pushHistory);
    var scaleEl = $("a-scale");
    scaleEl.addEventListener("input", function () {
      state.scale = Number(scaleEl.value);
      $("a-scale-v").textContent = scaleEl.value + "%";
      scheduleRender();
    });
    scaleEl.addEventListener("change", pushHistory);

    $("rotate-cw").addEventListener("click", function () {
      pushHistory();
      state.rotate = (state.rotate + 90 + 180) % 360 - 180;
      state.crop = null;
      rotateEl.value = state.rotate;
      $("a-rotate-v").textContent = state.rotate + "°";
      renderPreview();
    });
    $("rotate-ccw").addEventListener("click", function () {
      pushHistory();
      state.rotate = (state.rotate - 90 + 180) % 360 - 180;
      state.crop = null;
      rotateEl.value = state.rotate;
      $("a-rotate-v").textContent = state.rotate + "°";
      renderPreview();
    });
    $("flip-h").addEventListener("click", function () {
      pushHistory();
      state.flipH = !state.flipH;
      state.crop = null;
      renderPreview();
    });
    $("flip-v").addEventListener("click", function () {
      pushHistory();
      state.flipV = !state.flipV;
      state.crop = null;
      renderPreview();
    });

    function syncControls() {
      var a = state.adj;
      SLIDERS.forEach(function (pair) {
        var el = $(pair[0]);
        el.value = a[pair[1]];
        $(pair[0] + "-v").textContent = el.value;
      });
      ["gray", "sepia", "invert"].forEach(function (k) { $("a-" + k).checked = a[k]; });
      rotateEl.value = state.rotate;
      $("a-rotate-v").textContent = state.rotate + "°";
      scaleEl.value = state.scale;
      $("a-scale-v").textContent = state.scale + "%";
    }

    $("reset").addEventListener("click", function () {
      if (!img) return;
      pushHistory();
      state = DEFAULTS();
      syncControls();
      renderPreview();
    });

    /* ---------- before/after compare ---------- */
    var compareBtn = $("compare");
    compareBtn.addEventListener("pointerdown", function () {
      if (!img) return;
      comparing = true;
      drawOriginal();
    });
    ["pointerup", "pointerleave"].forEach(function (ev) {
      compareBtn.addEventListener(ev, function () {
        if (comparing) { comparing = false; drawCurrent(); }
      });
    });

    /* ---------- crop ---------- */
    var overlay = $("crop-overlay");
    var cropBox = $("crop-box");
    var aspectSel = $("crop-aspect");

    function setCropBox(rect) {
      var ov = overlay.getBoundingClientRect();
      var x = Math.max(0, Math.min(ov.width - rect.w, rect.x));
      var y = Math.max(0, Math.min(ov.height - rect.h, rect.y));
      cropBox.style.left = x + "px";
      cropBox.style.top = y + "px";
      cropBox.style.width = Math.min(rect.w, ov.width) + "px";
      cropBox.style.height = Math.min(rect.h, ov.height) + "px";
      placeHandles(x, y, Math.min(rect.w, ov.width), Math.min(rect.h, ov.height));
      return { x: x, y: y, w: Math.min(rect.w, ov.width), h: Math.min(rect.h, ov.height) };
    }
    function placeHandles(x, y, w, h) {
      var pos = {
        nw: [x, y], n: [x + w / 2, y], ne: [x + w, y],
        e: [x + w, y + h / 2], se: [x + w, y + h], s: [x + w / 2, y + h],
        sw: [x, y + h], w: [x, y + h / 2]
      };
      cropBox.querySelectorAll(".pe-h").forEach(function (hd) {
        var p = pos[hd.dataset.dir];
        hd.style.left = (p[0] - 7) + "px";
        hd.style.top = (p[1] - 7) + "px";
      });
    }
    function cropRect() {
      var ov = overlay.getBoundingClientRect();
      var b = cropBox.getBoundingClientRect();
      return { x: b.left - ov.left, y: b.top - ov.top, w: b.width, h: b.height };
    }
    function enterCrop() {
      if (!img || cropMode) return;
      cropMode = true;
      overlay.classList.remove("hidden");
      $("crop-idle").style.display = "none";
      $("crop-actions").classList.add("show");
      if ($("tool-crop")) $("tool-crop").classList.add("active");
      var ov = overlay.getBoundingClientRect();
      setCropBox({ x: 0, y: 0, w: ov.width, h: ov.height });
    }
    function exitCrop() {
      if (!cropMode) return;
      cropMode = false;
      overlay.classList.add("hidden");
      $("crop-idle").style.display = "";
      $("crop-actions").classList.remove("show");
      if ($("tool-crop")) $("tool-crop").classList.remove("active");
    }
    $("crop-btn").addEventListener("click", enterCrop);
    $("crop-cancel").addEventListener("click", exitCrop);
    $("crop-apply").addEventListener("click", function () {
      if (!currentResult) return;
      var rect = cropRect();
      var r = currentResult;
      var kx = r.baseW / view.width;
      var ky = r.baseH / view.height;
      var ox = state.crop ? state.crop.x : 0;
      var oy = state.crop ? state.crop.y : 0;
      var w = Math.max(4, Math.round(rect.w * kx));
      var h = Math.max(4, Math.round(rect.h * ky));
      state.crop = { x: Math.round(ox + rect.x * kx), y: Math.round(oy + rect.y * ky), w: w, h: h };
      exitCrop();
      pushHistory();
      renderPreview();
    });

    // drag logic
    var drag = null;
    function clampAspect(w, h, ratio) {
      if (!ratio) return { w: w, h: h };
      var ar = ratio; // w/h
      var rw = w, rh = Math.round(w / ar);
      if (rh > h) { rh = h; rw = Math.round(h * ar); }
      return { w: rw, h: rh };
    }
    overlay.addEventListener("pointerdown", function (e) {
      if (!cropMode) return;
      var target = e.target;
      var dir = target.dataset && target.dataset.dir;
      var start = { x: e.clientX, y: e.clientY, rect: cropRect(), dir: dir };
      drag = start;
      e.preventDefault();
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      var dy = e.clientY - drag.y;
      var rect = { x: drag.rect.x, y: drag.rect.y, w: drag.rect.w, h: drag.rect.h };
      var ratio = aspectSel.value === "free" ? 0 : Number(aspectSel.value);
      var ov = overlay.getBoundingClientRect();
      var d = drag.dir;
      if (!d) { // move
        rect.x += dx;
        rect.y += dy;
      } else {
        if (d.indexOf("e") !== -1) rect.w += dx;
        if (d.indexOf("s") !== -1) rect.h += dy;
        if (d.indexOf("w") !== -1) { rect.x += dx; rect.w -= dx; }
        if (d.indexOf("n") !== -1) { rect.y += dy; rect.h -= dy; }
        if (rect.w < 30 || rect.h < 30) return;
        if (ratio) {
          var fixed = clampAspect(rect.w, rect.h, ratio);
          var growW = d.indexOf("e") !== -1;
          var growH = d.indexOf("s") !== -1;
          if (growW || d.indexOf("w") !== -1) {
            rect.w = fixed.w;
            if (d.indexOf("w") !== -1) rect.x = drag.rect.x + drag.rect.w - fixed.w;
          }
          if (growH || d.indexOf("n") !== -1) {
            rect.h = fixed.h;
            if (d.indexOf("n") !== -1) rect.y = drag.rect.y + drag.rect.h - fixed.h;
          }
        }
      }
      setCropBox(rect);
    });
    window.addEventListener("pointerup", function () { drag = null; });

    /* ---------- export ---------- */
    $("export").addEventListener("click", function () {
      if (!img) return;
      $("export-panel").classList.remove("hidden");
      $("export-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    var qEl = $("ex-quality");
    qEl.addEventListener("input", function () { $("ex-quality-v").textContent = qEl.value; });
    $("ex-download").addEventListener("click", function () {
      if (!img) return;
      var format = $("ex-format").value;
      var quality = Number(qEl.value) / 100;
      var result = buildResult(state, 0);
      result.canvas.toBlob(function (blob) {
        if (!blob) return;
        var ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "photo-editor-" + Date.now() + "." + ext;
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
      }, format, quality);
    });

    /* ---------- menus ---------- */
    var menuEls = box.querySelectorAll(".pe-menu");
    menuEls.forEach(function (m) {
      var btn = m.querySelector(".pe-menu-btn");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var wasOpen = m.classList.contains("open");
        menuEls.forEach(function (x) { x.classList.remove("open"); });
        if (!wasOpen) m.classList.add("open");
      });
    });
    document.addEventListener("click", function () {
      menuEls.forEach(function (m) { m.classList.remove("open"); });
    });
    box.querySelectorAll(".pe-menu-item").forEach(function (item) {
      item.addEventListener("click", function () {
        var action = item.dataset.action;
        var map = {
          undo: function () { $("undo").click(); },
          redo: function () { $("redo").click(); },
          reset: function () { $("reset").click(); },
          export: function () { $("export").click(); },
          compare: function () { $("compare").click(); },
          crop: function () { $("crop-btn").click(); },
          "rotate-cw": function () { $("rotate-cw").click(); },
          "rotate-ccw": function () { $("rotate-ccw").click(); },
          "flip-h": function () { $("flip-h").click(); },
          "flip-v": function () { $("flip-v").click(); },
          download: function () { $("export").click(); $("ex-download").click(); }
        };
        if (map[action]) map[action]();
      });
    });

    /* ---------- left tool rail ---------- */
    [["tool-crop", "crop-btn"], ["tool-rotate-cw", "rotate-cw"], ["tool-rotate-ccw", "rotate-ccw"],
     ["tool-flip-h", "flip-h"], ["tool-flip-v", "flip-v"], ["tool-reset", "reset"]].forEach(function (pair) {
      var tb = $(pair[0]);
      if (tb) tb.addEventListener("click", function () { $(pair[1]).click(); });
    });

    /* ---------- keyboard shortcuts ---------- */
    document.addEventListener("keydown", function (e) {
      if (!img || (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT"))) return;
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
    });

    /* ---------- load ---------- */
    var drop = $("drop");
    var fileInput = $("file");
    drop.addEventListener("click", function () { fileInput.click(); });
    drop.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
    });
    ["dragenter", "dragover"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); });
    });
    drop.addEventListener("drop", function (e) {
      var f = e.dataTransfer.files[0];
      if (f) load(f);
    });
    fileInput.addEventListener("change", function () {
      var f = fileInput.files[0];
      if (f) load(f);
      fileInput.value = "";
    });

    function load(file) {
      if (!file || !file.type || file.type.indexOf("image/") !== 0) { window.alert("Please choose an image file."); return; }
      var reader = new FileReader();
      reader.onload = function () {
        var im = new Image();
        im.onload = function () {
          img = im;
          state = DEFAULTS();
          history = [clone(state)];
          hIndex = 0;
          $("editor").classList.remove("hidden");
          drop.style.display = "none";
          $("undo").disabled = true;
          $("redo").disabled = true;
          exitCrop();
          $("export-panel").classList.add("hidden");
          syncControls();
          renderPreview();
        };
        im.onerror = function () { window.alert("Could not read that image."); };
        im.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
});