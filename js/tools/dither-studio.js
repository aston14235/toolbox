ToolBox.define("dither-studio", {
  styles: [
    /* ============ app shell (Dither Boy-style) ============ */
    ".ds-app { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: #131722; height: min(780px, calc(100vh - 150px)); min-height: 540px; }",
    ".ds-menubar { display: flex; align-items: center; gap: 2px; padding: 0 10px; background: linear-gradient(#1d2431, #161b27); border-bottom: 1px solid #0b0f16; flex-shrink: 0; }",
    ".ds-brand { display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: .78rem; color: #d3dcea; margin-right: 10px; letter-spacing: .02em; white-space: nowrap; }",
    ".ds-brand .ds-logo { width: 18px; height: 18px; border-radius: 4px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: #fff; font-size: .56rem; display: inline-flex; align-items: center; justify-content: center; }",
    ".ds-menu { position: relative; }",
    ".ds-menu-btn { background: none; border: none; color: #a9b4c6; font-size: .74rem; padding: 7px 9px; border-radius: 5px; cursor: pointer; font-family: inherit; }",
    ".ds-menu-btn:hover, .ds-menu.open .ds-menu-btn { background: rgba(255,255,255,.08); color: #e8eef7; }",
    ".ds-menu-drop { display: none; position: absolute; top: calc(100% + 4px); left: 0; min-width: 200px; background: #1b2130; border: 1px solid #2b3545; border-radius: 8px; padding: 5px; box-shadow: 0 10px 28px rgba(0,0,0,.55); z-index: 60; }",
    ".ds-menu.open .ds-menu-drop { display: block; }",
    ".ds-menu-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; text-align: left; background: none; border: none; color: #ccd5e3; font-size: .74rem; padding: 7px 10px; border-radius: 5px; cursor: pointer; font-family: inherit; }",
    ".ds-menu-item:hover { background: rgba(139,92,246,.25); color: #fff; }",
    ".ds-menu-sep { height: 1px; background: #2b3545; margin: 4px 8px; }",
    ".ds-kbd { font-size: .64rem; color: #6f7d92; }",
    ".ds-menubar .ds-spacer { flex: 1; }",
    ".ds-menubar .controls { gap: 6px; flex-wrap: nowrap; }",
    ".ds-main { display: flex; flex: 1; min-height: 0; }",
    ".ds-tools { width: 50px; background: #1a202c; border-right: 1px solid #10151f; padding: 8px 6px; display: flex; flex-direction: column; align-items: center; gap: 5px; overflow-y: auto; flex-shrink: 0; }",
    ".ds-tool-btn { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; background: transparent; border: 1px solid transparent; border-radius: 8px; color: #b7c1d3; cursor: pointer; }",
    ".ds-tool-btn:hover { background: rgba(255,255,255,.07); border-color: #2a3442; color: #fff; }",
    ".ds-tool-btn.active { background: rgba(139,92,246,.22); border-color: #8b5cf6; color: #fff; }",
    ".ds-workspace { flex: 1; min-width: 0; display: flex; flex-direction: column; }",
    ".ds-canvas-area { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 18px; overflow: auto; background-color: #151a24; background-image: radial-gradient(circle, #1e2532 1.2px, transparent 1.2px); background-size: 18px 18px; }",
    ".ds-canvas-wrap { position: relative; display: inline-flex; background: repeating-conic-gradient(#1e2530 0 25%, #141a24 0 50%) 0 0 / 22px 22px; border: 1px solid #2b3545; border-radius: 4px; padding: 10px; box-shadow: 0 8px 28px rgba(0,0,0,.5); }",
    ".ds-canvas-wrap canvas { display: block; max-width: 100%; height: auto; border-radius: 2px; box-shadow: 0 1px 8px rgba(0,0,0,.55); }",
    ".ds-panels { width: 300px; background: #1a202c; border-left: 1px solid #10151f; overflow-y: auto; padding: 10px 12px 14px; flex-shrink: 0; }",
    ".ds-panel { border: 1px solid #242d3d; border-radius: 8px; background: #171d28; margin-bottom: 10px; overflow: hidden; }",
    ".ds-panel-head { padding: 7px 10px; background: linear-gradient(#202837, #1a2230); border-bottom: 1px solid #242d3d; font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #9fb0c8; }",
    ".ds-panel-body { padding: 10px; }",
    ".ds-row { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }",
    ".ds-row label { font-size: .72rem; color: #a9b4c6; min-width: 62px; flex-shrink: 0; }",
    ".ds-row input[type=range] { flex: 1; min-width: 0; }",
    ".ds-row select { flex: 1; }",
    ".ds-row span { min-width: 2.6em; text-align: right; font-size: .7rem; font-variant-numeric: tabular-nums; color: #7e8ba0; }",
    ".ds-select { width: 100%; padding: 6px 8px; background: #1d2431; border: 1px solid #2b3545; border-radius: 6px; color: #ccd5e3; font-size: .76rem; }",
    ".ds-pal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; margin-bottom: 8px; }",
    ".ds-pal-btn { display: flex; align-items: center; gap: 6px; padding: 5px 7px; background: #1d2431; border: 1px solid #2b3545; border-radius: 6px; color: #c5cede; font-size: .7rem; cursor: pointer; text-align: left; }",
    ".ds-pal-btn:hover, .ds-pal-btn.active { border-color: #8b5cf6; }",
    ".ds-swatch { display: inline-flex; width: 14px; height: 14px; border-radius: 3px; border: 1px solid rgba(255,255,255,.25); flex-shrink: 0; }",
    ".ds-swatch-row { display: flex; gap: 3px; }",
    ".ds-btn { padding: 5px 8px; background: #232c3b; border: 1px solid #2b3545; border-radius: 6px; color: #ccd5e3; font-size: .7rem; cursor: pointer; }",
    ".ds-btn:hover { background: #2a3442; }",
    ".ds-btn.primary { background: #4c1d95; border-color: #8b5cf6; color: #fff; }",
    ".ds-btn.primary:hover { background: #5b21b6; }",
    ".ds-btn.ghost { background: transparent; border-color: transparent; color: #8491a5; }",
    ".ds-btn.ghost:hover { color: #fff; background: rgba(255,255,255,.06); }",
    ".ds-effect { display: flex; align-items: center; gap: 6px; padding: 6px 8px; background: #1d2431; border: 1px solid #2b3545; border-radius: 6px; margin-bottom: 5px; }",
    ".ds-effect-name { font-size: .72rem; color: #ccd5e3; min-width: 92px; flex-shrink: 0; }",
    ".ds-effect input[type=range] { flex: 1; min-width: 0; }",
    ".ds-effect .ds-effect-v { min-width: 2em; text-align: right; font-size: .66rem; color: #7e8ba0; }",
    ".ds-effect-acts { display: flex; gap: 1px; margin-left: 2px; }",
    ".ds-effect-acts button { background: none; border: none; color: #6f7d92; font-size: .78rem; cursor: pointer; padding: 0 2px; }",
    ".ds-effect-acts button:hover { color: #fff; }",
    ".ds-empty { font-size: .7rem; color: #5d6b80; text-align: center; padding: 6px 0; font-style: italic; }",
    ".ds-statusbar { display: flex; align-items: center; gap: 16px; padding: 5px 12px; background: #161c28; border-top: 1px solid #10151f; font-size: .7rem; color: #8491a5; flex-shrink: 0; white-space: nowrap; overflow: hidden; }",
    ".ds-statusbar .ds-spacer { flex: 1; }",
    ".ds-statusbar b { color: #c5cede; font-weight: 600; }",
    ".ds-statusbar .ds-algo-tag { color: #b795ff; }",
    "@media (max-width: 900px) { .ds-app { height: auto; } .ds-main { flex-direction: column; } .ds-tools { width: auto; flex-direction: row; justify-content: center; border-right: none; border-bottom: 1px solid #10151f; } .ds-canvas-area { min-height: 340px; } .ds-panels { width: auto; border-left: none; border-top: 1px solid #10151f; } }",
    "@media (max-width: 640px) { .ds-menubar .ds-menu { display: none; } .ds-statusbar { font-size: .62rem; gap: 8px; } .ds-pal-grid { grid-template-columns: 1fr; } }"
  ].join(""),

  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose an image">'
      + '<span class="dz-icon">🎛️</span><strong>Drop a photo here</strong> or click to browse'
      + '<input type="file" id="file" accept="image/*" class="hidden">'
      + "</div>"
      + '<div id="editor" class="hidden">'
      + '<div class="ds-app">'
      /* ---------- menu bar ---------- */
      + '<div class="ds-menubar">'
      + '<span class="ds-brand"><span class="ds-logo">DB</span> Dither Studio</span>'
      + '<div class="ds-menu" id="menu-file"><button class="ds-menu-btn" type="button">File ▾</button><div class="ds-menu-drop">'
      + '<button class="ds-menu-item" data-action="open">Open Image… <span class="ds-kbd">Ctrl+O</span></button>'
      + '<button class="ds-menu-item" data-action="export">Export…</button>'
      + '<div class="ds-menu-sep"></div>'
      + '<button class="ds-menu-item" data-action="reset">Reset All</button>'
      + "</div></div>"
      + '<div class="ds-menu" id="menu-edit"><button class="ds-menu-btn" type="button">Edit ▾</button><div class="ds-menu-drop">'
      + '<button class="ds-menu-item" data-action="undo">Undo <span class="ds-kbd">Ctrl+Z</span></button>'
      + '<button class="ds-menu-item" data-action="redo">Redo <span class="ds-kbd">Ctrl+Shift+Z</span></button>'
      + "</div></div>"
      + '<div class="ds-menu" id="menu-view"><button class="ds-menu-btn" type="button">View ▾</button><div class="ds-menu-drop">'
      + '<button class="ds-menu-item" data-action="compare">Hold to Compare</button>'
      + '<button class="ds-menu-item" data-action="extract">Extract Palette from Image</button>'
      + "</div></div>"
      + '<span class="ds-spacer"></span>'
      + '<div class="controls">'
      + '<button id="undo" class="btn" disabled title="Undo (Ctrl+Z)">↩️ Undo</button>'
      + '<button id="redo" class="btn" disabled title="Redo (Ctrl+Shift+Z)">↪️ Redo</button>'
      + '<button id="compare" class="btn" title="Hold to see the original">👁️ Hold</button>'
      + '<button id="reset" class="btn ghost" title="Reset every setting">♻️ Reset</button>'
      + '<button id="export" class="btn primary">⬇️ Export</button>'
      + "</div>"
      + "</div>"
      /* ---------- main ---------- */
      + '<div class="ds-main">'
      /* left tool rail */
      + '<div class="ds-tools" aria-label="Toolbox">'
      + '<button class="ds-tool-btn" id="tool-open" title="Open image">📂</button>'
      + '<button class="ds-tool-btn" id="tool-undo" title="Undo">↩️</button>'
      + '<button class="ds-tool-btn" id="tool-redo" title="Redo">↪️</button>'
      + '<button class="ds-tool-btn" id="tool-compare" title="Hold to compare original">👁️</button>'
      + '<button class="ds-tool-btn" id="tool-extract" title="Extract palette from image">🎨</button>'
      + '<button class="ds-tool-btn" id="tool-reset" title="Reset all">♻️</button>'
      + "</div>"
      /* center workspace */
      + '<div class="ds-workspace">'
      + '<div class="ds-canvas-area">'
      + '<div class="ds-canvas-wrap" id="wrap">'
      + '<canvas id="view" aria-label="Dithered preview"></canvas>'
      + "</div>"
      + "</div>"
      + '<div class="ds-statusbar">'
      + '<span id="dims"></span>'
      + '<span class="ds-algo-tag" id="algo-tag"></span>'
      + '<span class="ds-spacer"></span>'
      + '<span>Zoom <b id="zoom-v">—</b></span>'
      + "</div>"
      + "</div>"
      /* right panels */
      + '<div class="ds-panels">'
      + '<div class="ds-panel">'
      + '<div class="ds-panel-head">⚙️ Algorithm</div>'
      + '<div class="ds-panel-body">'
      + '<select class="ds-select" id="algo">'
      + '<optgroup label="Error Diffusion">'
      + '<option value="floyd">Floyd–Steinberg</option>'
      + '<option value="false-floyd">False Floyd–Steinberg</option>'
      + '<option value="jarvis">Jarvis–Judice–Ninke</option>'
      + '<option value="stucki">Stucki</option>'
      + '<option value="atkinson">Atkinson</option>'
      + '<option value="burkes">Burkes</option>'
      + '<option value="sierra">Sierra</option>'
      + '<option value="sierra2">Two-Row Sierra</option>'
      + '<option value="sierra-lite">Sierra Lite</option>'
      + '<option value="stevenson">Stevenson–Arce</option>'
      + "</optgroup>"
      + '<optgroup label="Ordered / Bayer">'
      + '<option value="bayer2">Bayer 2×2</option>'
      + '<option value="bayer4">Bayer 4×4</option>'
      + '<option value="bayer8">Bayer 8×8</option>'
      + "</optgroup>"
      + '<optgroup label="Pattern">'
      + '<option value="dots">Dot Pattern</option>'
      + '<option value="checker">Checker</option>'
      + '<option value="diagonal">Diagonal Lines</option>'
      + '<option value="crosshatch">Crosshatch</option>'
      + '<option value="circles">Concentric Circles</option>'
      + "</optgroup>"
      + '<optgroup label="Halftone">'
      + '<option value="halftone">Classic Halftone</option>'
      + '<option value="halftone-bw">Halftone (Crush)</option>'
      + "</optgroup>"
      + '<optgroup label="Special">'
      + '<option value="posterize">Posterize</option>'
      + '<option value="noise">Noise Dither</option>'
      + '<option value="glitch-crush">JPEG Block Crush</option>'
      + '<option value="glitch-split">RGB Split</option>'
      + "</optgroup>"
      + "</select>"
      + '<div class="ds-row" style="margin-top:9px;"><label>Strength</label><input type="range" id="str" min="0" max="100" value="100"><span id="str-v">100</span></div>'
      + '<div class="ds-row"><label>Scale</label><input type="range" id="scl" min="2" max="32" value="8"><span id="scl-v">8</span></div>'
      + '<div class="ds-row"><label>Angle</label><input type="range" id="ang" min="0" max="360" value="45"><span id="ang-v">45°</span></div>'
      + "</div></div>"
      + '<div class="ds-panel">'
      + '<div class="ds-panel-head">🎨 Palette</div>'
      + '<div class="ds-panel-body">'
      + '<div class="ds-pal-grid" id="pal-grid"></div>'
      + '<div class="ds-row" style="margin-bottom:0;">'
      + '<button id="extract" class="ds-btn primary">✨ Extract from image</button>'
      + '<button id="custom-add" class="ds-btn" title="Add a custom color">+ Hex</button>'
      + "</div>"
      + '<div class="ds-row" style="margin:7px 0 0;"><input type="color" id="custom-color" value="#ff0000" style="width:34px;height:26px;padding:0;border:1px solid #2b3545;border-radius:4px;background:none;"><span style="font-size:.68rem;color:#8491a5;" id="custom-hex">#ff0000</span></div>'
      + '<div class="ds-swatch-row" id="pal-strip" style="margin-top:9px;"></div>'
      + "</div></div>"
      + '<div class="ds-panel">'
      + '<div class="ds-panel-head">🧩 Effects Stack</div>'
      + '<div class="ds-panel-body">'
      + '<div id="effects-list"></div>'
      + '<div class="ds-row" style="margin:8px 0 0;">'
      + '<select class="ds-select" id="add-effect"><option value="">— Add effect —</option>'
      + '<option value="chromatic">Chromatic Aberration</option>'
      + '<option value="jpeg">JPEG Glitch</option>'
      + '<option value="split">RGB Split</option>'
      + '<option value="scanlines">Scanlines</option>'
      + '<option value="shift">Glitch Shift</option>'
      + '<option value="noise">Noise / Grain</option>'
      + '<option value="posterize">Posterize</option>'
      + '<option value="invert">Invert</option>'
      + '<option value="vignette">Vignette</option>'
      + '<option value="glow">Epsilon Glow</option>'
      + "</select>"
      + "</div>"
      + "</div></div>"
      + '<div class="ds-panel hidden" id="export-panel">'
      + '<div class="ds-panel-head">💾 Export</div>'
      + '<div class="ds-panel-body">'
      + '<div class="ds-row"><label>Format</label><select class="ds-select" id="ex-format"><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option><option value="image/svg+xml">SVG Vector</option></select></div>'
      + '<div class="ds-row"><label>Quality</label><input type="range" id="ex-quality" min="10" max="100" value="92"><span id="ex-quality-v">92</span></div>'
      + '<button id="ex-download" class="ds-btn primary" style="width:100%;">⬇️ Download</button>'
      + '<p class="muted small" style="margin:8px 0 0;">SVG exports dithered pixels as crisp vector shapes.</p>'
      + "</div></div>"
      + "</div>"
      + "</div>"
      + "</div></div>";

    var $ = function (id) { return box.querySelector("#" + id); };
    var img = null;
    var state = null;
    var history = [];
    var hIndex = -1;
    var currentResult = null;
    var comparing = false;

    /* ================= palettes ================= */
    var PALETTES = {
      "B&W": ["#000000", "#ffffff"],
      "Amber CRT": ["#000000", "#ffb000"],
      "Cyan CRT": ["#000000", "#00e5ff"],
      "Sepia": ["#2b1d0e", "#c9a26b", "#f3e3c3"],
      "GameBoy": ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"],
      "Grayscale 4": ["#000000", "#555555", "#aaaaaa", "#ffffff"],
      "Grayscale 8": ["#000000", "#1c1c1c", "#383838", "#555555", "#717171", "#8e8e8e", "#aaaaaa", "#ffffff"],
      "CGA 16": ["#000000", "#0000aa", "#00aa00", "#00aaaa", "#aa0000", "#aa00aa", "#aa5500", "#aaaaaa", "#555555", "#5555ff", "#55ff55", "#55ffff", "#ff5555", "#ff55ff", "#ffff55", "#ffffff"],
      "PICO-8": ["#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8", "#ff004d", "#ffa300", "#ffec27", "#00e436", "#29adff", "#83769c", "#ff77a8", "#ffccaa"],
      "C64": ["#000000", "#626262", "#898989", "#adadad", "#ffffff", "#9f4e44", "#cb7e75", "#6d5412", "#a1683c", "#435900", "#9ac9f5", "#a8c4c9", "#5f7e9c", "#8839ac", "#6d5bbe", "#3c2b6f"]
    };
    var customColors = [];
    var ACTIVE_PAL_NAME = "B&W";
    function hexToRgb(hex) {
      var h = hex.replace("#", "");
      if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    function rgbToHex(r, g, b) {
      function p(v) { var s = Math.max(0, Math.min(255, Math.round(v))).toString(16); return s.length === 1 ? "0" + s : s; }
      return "#" + p(r) + p(g) + p(b);
    }
    function activePalette() {
      var base = PALETTES[ACTIVE_PAL_NAME] || PALETTES["B&W"];
      return base.concat(customColors);
    }
    function nearestIdx(r, g, b, pal) {
      var best = 0, bd = Infinity;
      for (var i = 0; i < pal.length; i++) {
        var c = hexToRgb(pal[i]);
        var dr = r - c[0], dg = g - c[1], db = b - c[2];
        var d = dr * dr + dg * dg + db * db;
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }
    function palLum(hex) { var c = hexToRgb(hex); return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; }
    function sortPalByLum(pal) {
      var withLum = pal.map(function (h, i) { return { h: h, l: palLum(h), i: i }; });
      withLum.sort(function (a, b) { return a.l - b.l; });
      return withLum.map(function (x) { return x.h; });
    }

    /* ================= engine ================= */
    function luminance(d, i) {
      return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    }
    var DIFFUSION = {
      floyd: { m: [[0, 0, 7], [3, 5, 1]], div: 16 },
      "false-floyd": { m: [[0, 0, 3], [0, 3, 2]], div: 8 },
      jarvis: { m: [[0, 0, 0, 7, 5], [3, 5, 7, 5, 3], [1, 3, 5, 3, 1]], div: 48 },
      stucki: { m: [[0, 0, 0, 8, 4], [2, 4, 8, 4, 2], [1, 2, 4, 2, 1]], div: 42 },
      atkinson: { m: [[0, 0, 1, 1], [1, 1, 1, 0], [0, 1, 0, 0]], div: 8 },
      burkes: { m: [[0, 0, 0, 8, 4], [2, 4, 8, 4, 2]], div: 32 },
      sierra: { m: [[0, 0, 0, 5, 3], [2, 4, 5, 4, 2], [0, 2, 3, 2, 0]], div: 32 },
      sierra2: { m: [[0, 0, 0, 4, 3], [1, 2, 3, 2, 1]], div: 16 },
      "sierra-lite": { m: [[0, 0, 2], [1, 1, 0]], div: 4 },
      stevenson: { m: [[0, 0, 0, 0, 0, 0, 32], [0, 0, 0, 0, 0, 32, 0], [0, 0, 0, 0, 32, 0, 0], [0, 0, 32, 0, 0, 0, 0], [2, 4, 8, 4, 2, 0, 0]], div: 84 }
    };
    function applyDiffusion(d, W, H, pal, algo, strength) {
      var spec = DIFFUSION[algo];
      var m = spec.m, div = spec.div;
      var er = strength / 100;
      var n = W * H;
      for (var y = 0; y < H; y++) {
        var rowStart = y * W;
        for (var xi = 0; xi < W; xi++) {
          var x = (y % 2 === 1) ? (W - 1 - xi) : xi;
          var i = (rowStart + x) * 4;
          var idx = nearestIdx(d[i], d[i + 1], d[i + 2], pal);
          var c = hexToRgb(pal[idx]);
          var e0 = (d[i] - c[0]) * er / div;
          var e1 = (d[i + 1] - c[1]) * er / div;
          var e2 = (d[i + 2] - c[2]) * er / div;
          d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
          for (var ry = 0; ry < m.length; ry++) {
            var ny = y + ry;
            if (ny >= H) continue;
            var dir = (y % 2 === 1) ? -1 : 1;
            var colOffset = dir * (Math.floor(m[ry].length / 2) - 1);
            for (var rx = 0; rx < m[ry].length; rx++) {
              var wgt = m[ry][rx];
              if (!wgt) continue;
              var nx = x + dir * (rx - colOffset);
              if (nx < 0 || nx >= W) continue;
              var j = (ny * W + nx) * 4;
              d[j] += e0 * wgt; d[j + 1] += e1 * wgt; d[j + 2] += e2 * wgt;
            }
          }
        }
      }
    }
    function bayer(n) {
      var size = n * n, m = new Array(size);
      for (var i = 0; i < size; i++) {
        var x = i % n, y = Math.floor(i / n);
        var v = 0, cx = x, cy = y, nn = n;
        while (nn > 1) {
          var hx = nn >> 1;
          v = v * 4 + (cx >= hx ? 1 : 0) + (cy >= hx ? 2 : 0);
          cx %= hx; cy %= hx; nn = hx;
        }
        m[y * n + x] = v;
      }
      return m;
    }
    function applyOrdered(d, W, H, pal, n, strength) {
      var m = bayer(n);
      var size = n * n;
      var lo = hexToRgb(pal[0]), hi = hexToRgb(pal[pal.length - 1]);
      if (palLum(pal[0]) > palLum(pal[pal.length - 1])) { var t = lo; lo = hi; hi = t; }
      var amt = strength / 100;
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var i = (y * W + x) * 4;
          var th = (m[(y % n) * n + (x % n)] + 0.5) / size - 0.5;
          var lum = luminance(d, i) / 255;
          if (pal.length === 2) {
            var v = lum + th * amt * 2;
            if (v > 0.5) { d[i] = hi[0]; d[i + 1] = hi[1]; d[i + 2] = hi[2]; }
            else { d[i] = lo[0]; d[i + 1] = lo[1]; d[i + 2] = lo[2]; }
          } else {
            var rr = d[i] + th * amt * 255;
            var gg = d[i + 1] + th * amt * 255;
            var bb = d[i + 2] + th * amt * 255;
            var idx = nearestIdx(rr, gg, bb, pal);
            var c = hexToRgb(pal[idx]);
            d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
          }
        }
      }
    }
    /* pattern threshold tables (normalized to 0..1), N x N */
    var PATTERN_MATS = {
      dots: { n: 6, m: [35, 13, 6, 10, 18, 30, 25, 4, 1, 3, 2, 22, 9, 33, 29, 31, 34, 12, 16, 23, 27, 32, 26, 20, 15, 21, 36, 35, 24, 14, 28, 8, 5, 11, 7, 17] },
      checker: { n: 4, m: [0, 14, 0, 14, 14, 0, 14, 0, 0, 14, 0, 14, 14, 0, 14, 0] },
      diagonal: { n: 4, m: [0, 4, 8, 12, 4, 8, 12, 0, 8, 12, 0, 4, 12, 0, 4, 8] },
      crosshatch: { n: 4, m: [0, 8, 0, 8, 8, 0, 8, 0, 0, 8, 0, 8, 8, 0, 8, 0] },
      circles: { n: 4, m: [12, 6, 6, 12, 6, 0, 0, 6, 6, 0, 0, 6, 12, 6, 6, 12] }
    };
    function applyPattern(d, W, H, pal, pat, strength) {
      var p = PATTERN_MATS[pat];
      var n = p.n;
      var max = 16;
      var lo = hexToRgb(pal[0]), hi = hexToRgb(pal[pal.length - 1]);
      if (palLum(pal[0]) > palLum(pal[pal.length - 1])) { var t = lo; lo = hi; hi = t; }
      var amt = 0.5 + strength / 100;
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var i = (y * W + x) * 4;
          var lum = luminance(d, i) / 255;
          var th = p.m[(y % n) * n + (x % n)] / max;
          var v = lum + (th - 0.5) * amt * 2;
          if (v > 0.5) { d[i] = hi[0]; d[i + 1] = hi[1]; d[i + 2] = hi[2]; }
          else { d[i] = lo[0]; d[i + 1] = lo[1]; d[i + 2] = lo[2]; }
        }
      }
    }
    function applyHalftone(canvas, size, angleDeg, strength, pal) {
      var w = canvas.width, h = canvas.height;
      var ctx0 = canvas.getContext("2d");
      var src = ctx0.getImageData(0, 0, w, h);
      var out = document.createElement("canvas"); out.width = w; out.height = h;
      var octx = out.getContext("2d");
      octx.fillStyle = "#ffffff"; octx.fillRect(0, 0, w, h);
      var rad = angleDeg * Math.PI / 180;
      var cos = Math.cos(rad), sin = Math.sin(rad);
      var half = size / 2;
      var dark = hexToRgb(pal[pal.length - 1]);
      if (palLum(pal[pal.length - 1]) > palLum(pal[0])) dark = hexToRgb(pal[0]);
      var boost = 0.55 + (strength / 100) * 0.9;
      for (var cy = half; cy < h + half; cy += size) {
        for (var cx = half; cx < w + half; cx += size) {
          var lumSum = 0, npx = 0;
          for (var dy = -half; dy < half; dy++) {
            for (var dx = -half; dx < half; dx++) {
              var rx = Math.round(cx + dx * cos - dy * sin);
              var ry = Math.round(cy + dx * sin + dy * cos);
              if (rx < 0 || ry < 0 || rx >= w || ry >= h) continue;
              var i = (ry * w + rx) * 4;
              lumSum += (src.data[i] * 0.299 + src.data[i + 1] * 0.587 + src.data[i + 2] * 0.114) / 255;
              npx++;
            }
          }
          var lum = npx ? lumSum / npx : 0.5;
          var r = Math.min(half - 0.5, Math.max(0.4, (1 - lum) * boost * half));
          if (r > 0.3) {
            octx.beginPath();
            octx.arc(cx, cy, r, 0, Math.PI * 2);
            octx.fillStyle = "rgb(" + dark[0] + "," + dark[1] + "," + dark[2] + ")";
            octx.fill();
          }
        }
      }
      ctx0.drawImage(out, 0, 0);
    }

    /* ================= effects (post-dither) ================= */
    function clamp255(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }
    function boxBlur(d, W, H, r) {
      /* separable two-pass box blur — O(n·r) instead of O(n·r²), keeps glow cheap */
      var n = W * H;
      var tmp = new Float32Array(n * 3);
      var x, y, dx, dy;
      for (y = 0; y < H; y++) {
        for (x = 0; x < W; x++) {
          var a0 = 0, a1 = 0, a2 = 0, cnt = 0;
          for (dx = -r; dx <= r; dx++) {
            var nx = x + dx;
            if (nx < 0 || nx >= W) continue;
            var j = (y * W + nx) * 4;
            a0 += d[j]; a1 += d[j + 1]; a2 += d[j + 2];
            cnt++;
          }
          var i3 = (y * W + x) * 3;
          tmp[i3] = a0 / cnt; tmp[i3 + 1] = a1 / cnt; tmp[i3 + 2] = a2 / cnt;
        }
      }
      for (y = 0; y < H; y++) {
        for (x = 0; x < W; x++) {
          var b0 = 0, b1 = 0, b2 = 0, cnt2 = 0;
          for (dy = -r; dy <= r; dy++) {
            var ny = y + dy;
            if (ny < 0 || ny >= H) continue;
            var j2 = (ny * W + x) * 3;
            b0 += tmp[j2]; b1 += tmp[j2 + 1]; b2 += tmp[j2 + 2];
            cnt2++;
          }
          var i4 = (y * W + x) * 4;
          d[i4] = b0 / cnt2; d[i4 + 1] = b1 / cnt2; d[i4 + 2] = b2 / cnt2;
        }
      }
    }
    var EFFECTS = {
      chromatic: { min: 1, max: 24, def: 6, label: "Chromatic Aberration" },
      jpeg: { min: 2, max: 32, def: 12, label: "JPEG Glitch" },
      split: { min: 1, max: 30, def: 8, label: "RGB Split" },
      scanlines: { min: 2, max: 12, def: 4, label: "Scanlines" },
      shift: { min: 1, max: 40, def: 12, label: "Glitch Shift" },
      noise: { min: 1, max: 120, def: 40, label: "Noise / Grain" },
      posterize: { min: 2, max: 32, def: 6, label: "Posterize" },
      invert: { min: 1, max: 1, def: 1, label: "Invert" },
      vignette: { min: 1, max: 100, def: 45, label: "Vignette" },
      glow: { min: 1, max: 60, def: 14, label: "Epsilon Glow" }
    };
    function applyEffect(d, W, H, id, v) {
      var n = W * H;
      if (id === "chromatic") {
        var src = d.slice(0);
        for (var y = 0; y < H; y++) {
          for (var x = 0; x < W; x++) {
            var i = (y * W + x) * 4;
            var ox = x - v, oy = y - v;
            var j = (Math.max(0, Math.min(H - 1, oy)) * W + Math.max(0, Math.min(W - 1, ox))) * 4;
            d[i] = src[j];
            var k = (Math.max(0, Math.min(H - 1, y + v)) * W + Math.max(0, Math.min(W - 1, x + v))) * 4;
            d[i + 2] = src[k + 2];
          }
        }
      } else if (id === "jpeg") {
        for (var y2 = 0; y2 < H; y2 += v) {
          for (var x2 = 0; x2 < W; x2 += v) {
            var sum = [0, 0, 0], cnt = 0;
            for (var dy = 0; dy < v && y2 + dy < H; dy++) {
              for (var dx = 0; dx < v && x2 + dx < W; dx++) {
                var j2 = ((y2 + dy) * W + (x2 + dx)) * 4;
                sum[0] += d[j2]; sum[1] += d[j2 + 1]; sum[2] += d[j2 + 2]; cnt++;
              }
            }
            if (!cnt) continue;
            var ar = Math.round(sum[0] / cnt / 16) * 16;
            var ag = Math.round(sum[1] / cnt / 16) * 16;
            var ab = Math.round(sum[2] / cnt / 16) * 16;
            for (var dy2 = 0; dy2 < v && y2 + dy2 < H; dy2++) {
              for (var dx2 = 0; dx2 < v && x2 + dx2 < W; dx2++) {
                var j3 = ((y2 + dy2) * W + (x2 + dx2)) * 4;
                d[j3] = ar; d[j3 + 1] = ag; d[j3 + 2] = ab;
              }
            }
          }
        }
      } else if (id === "split") {
        var s2 = d.slice(0);
        for (var y3 = 0; y3 < H; y3++) {
          for (var x3 = 0; x3 < W; x3++) {
            var i3 = (y3 * W + x3) * 4;
            d[i3] = s2[i3];
            d[i3 + 2] = s2[(y3 * W + Math.max(0, x3 - v)) * 4 + 2];
            d[i3 + 1] = s2[(Math.max(0, y3 - v) * W + x3) * 4 + 1];
          }
        }
      } else if (id === "scanlines") {
        for (var y4 = 0; y4 < H; y4 += v) {
          for (var x4 = 0; x4 < W; x4++) {
            var i4 = (y4 * W + x4) * 4;
            d[i4] *= 0.25; d[i4 + 1] *= 0.25; d[i4 + 2] *= 0.25;
          }
        }
      } else if (id === "shift") {
        var s3 = d.slice(0);
        var rows = Math.floor(H / 4);
        for (var y5 = 0; y5 < H; y5++) {
          var amt = (Math.sin(y5 * 0.35) * 0.5 + 0.5) * v * (0.4 + 0.6 * Math.random());
          var off = Math.round(amt);
          if (off === 0) continue;
          for (var x5 = 0; x5 < W; x5++) {
            var srcX = (x5 - off + W) % W;
            var i5 = (y5 * W + x5) * 4;
            var j5 = (y5 * W + srcX) * 4;
            d[i5] = s3[j5]; d[i5 + 1] = s3[j5 + 1]; d[i5 + 2] = s3[j5 + 2];
          }
        }
        void rows;
      } else if (id === "noise") {
        for (var i6 = 0; i6 < n * 4; i6 += 4) {
          var nv = (Math.random() - 0.5) * 2 * v;
          d[i6] = clamp255(d[i6] + nv);
          d[i6 + 1] = clamp255(d[i6 + 1] + nv);
          d[i6 + 2] = clamp255(d[i6 + 2] + nv);
        }
      } else if (id === "posterize") {
        var step = 255 / (v - 1);
        for (var i7 = 0; i7 < n * 4; i7 += 4) {
          d[i7] = Math.round(d[i7] / step) * step;
          d[i7 + 1] = Math.round(d[i7 + 1] / step) * step;
          d[i7 + 2] = Math.round(d[i7 + 2] / step) * step;
        }
      } else if (id === "invert") {
        for (var i8 = 0; i8 < n * 4; i8 += 4) {
          d[i8] = 255 - d[i8]; d[i8 + 1] = 255 - d[i8 + 1]; d[i8 + 2] = 255 - d[i8 + 2];
        }
      } else if (id === "vignette") {
        var cx = (W - 1) / 2, cy = (H - 1) / 2;
        var inv = 1 / Math.sqrt(cx * cx + cy * cy);
        var amt2 = v / 100;
        for (var y6 = 0; y6 < H; y6++) {
          for (var x6 = 0; x6 < W; x6++) {
            var dist = Math.sqrt((x6 - cx) * (x6 - cx) + (y6 - cy) * (y6 - cy)) * inv;
            var f = 1 - Math.max(0, dist - 0.45) / 0.55 * amt2;
            var i9 = (y6 * W + x6) * 4;
            d[i9] *= f; d[i9 + 1] *= f; d[i9 + 2] *= f;
          }
        }
      } else if (id === "glow") {
        var copy = d.slice(0);
        boxBlur(copy, W, H, v);
        var g = v / 60;
        for (var i10 = 0; i10 < n * 4; i10 += 4) {
          d[i10] = clamp255(d[i10] + copy[i10] * g);
          d[i10 + 1] = clamp255(d[i10 + 1] + copy[i10 + 1] * g);
          d[i10 + 2] = clamp255(d[i10 + 2] + copy[i10 + 2] * g);
        }
      }
    }

    /* ================= render pipeline ================= */
    function buildResult(maxDim) {
      var W0 = img.naturalWidth, H0 = img.naturalHeight;
      var scaleF = 1;
      if (maxDim) {
        var longest = Math.max(W0, H0);
        if (longest > maxDim) scaleF = maxDim / longest;
      }
      var W = Math.max(1, Math.round(W0 * scaleF));
      var H = Math.max(1, Math.round(H0 * scaleF));
      var canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, W, H);
      var algo = state.algo;
      var pal = activePalette();
      var strength = state.strength;

      if (algo === "halftone" || algo === "halftone-bw") {
        var s = state.scale;
        if (algo === "halftone-bw") s = Math.max(4, Math.round(s * 0.5));
        applyHalftone(canvas, s, state.angle, strength, pal);
      } else {
        var d = ctx.getImageData(0, 0, W, H).data;
        if (DIFFUSION[algo]) {
          applyDiffusion(d, W, H, pal, algo, strength);
        } else if (algo.indexOf("bayer") === 0) {
          applyOrdered(d, W, H, pal, Number(algo.slice(5)) || 4, strength);
        } else if (PATTERN_MATS[algo]) {
          applyPattern(d, W, H, pal, algo, strength);
        } else if (algo === "noise") {
          for (var i = 0; i < W * H * 4; i += 4) {
            var th = 0.5 + (Math.random() - 0.5) * (strength / 50);
            var lum = luminance(d, i) / 255;
            var c2 = lum > th ? hexToRgb(pal[pal.length - 1]) : hexToRgb(pal[0]);
            if (palLum(pal[pal.length - 1]) < palLum(pal[0])) c2 = lum > th ? hexToRgb(pal[0]) : hexToRgb(pal[pal.length - 1]);
            d[i] = c2[0]; d[i + 1] = c2[1]; d[i + 2] = c2[2];
          }
        } else if (algo === "posterize") {
          var steps = Math.max(2, Math.round(strength / 100 * 14) + 2);
          var step = 255 / (steps - 1);
          for (var i2 = 0; i2 < W * H * 4; i2 += 4) {
            var idx = nearestIdx(d[i2], d[i2 + 1], d[i2 + 2], pal);
            var c3 = hexToRgb(pal[idx]);
            d[i2] = c3[0]; d[i2 + 1] = c3[1]; d[i2 + 2] = c3[2];
          }
        } else if (algo === "glitch-crush") {
          var bs = Math.max(2, Math.round(strength / 100 * 14) + 2);
          for (var y = 0; y < H; y += bs) {
            for (var x = 0; x < W; x += bs) {
              var sum = [0, 0, 0], cnt = 0;
              for (var dy = 0; dy < bs && y + dy < H; dy++) {
                for (var dx = 0; dx < bs && x + dx < W; dx++) {
                  var j = ((y + dy) * W + (x + dx)) * 4;
                  sum[0] += d[j]; sum[1] += d[j + 1]; sum[2] += d[j + 2]; cnt++;
                }
              }
              if (!cnt) continue;
              var idx2 = nearestIdx(sum[0] / cnt, sum[1] / cnt, sum[2] / cnt, pal);
              var c4 = hexToRgb(pal[idx2]);
              for (var dy2 = 0; dy2 < bs && y + dy2 < H; dy2++) {
                for (var dx2 = 0; dx2 < bs && x + dx2 < W; dx2++) {
                  var j2 = ((y + dy2) * W + (x + dx2)) * 4;
                  d[j2] = c4[0]; d[j2 + 1] = c4[1]; d[j2 + 2] = c4[2];
                }
              }
            }
          }
        } else if (algo === "glitch-split") {
          var src = d.slice(0);
          var off = Math.max(1, Math.round(strength / 100 * 20));
          for (var y3 = 0; y3 < H; y3++) {
            for (var x3 = 0; x3 < W; x3++) {
              var i3 = (y3 * W + x3) * 4;
              d[i3 + 2] = src[(y3 * W + Math.max(0, x3 - off)) * 4 + 2];
              d[i3 + 1] = src[(Math.max(0, y3 - off) * W + x3) * 4 + 1];
            }
          }
        } else {
          /* fallback: plain nearest-color */
          for (var i4 = 0; i4 < W * H * 4; i4 += 4) {
            var idx3 = nearestIdx(d[i4], d[i4 + 1], d[i4 + 2], pal);
            var c5 = hexToRgb(pal[idx3]);
            d[i4] = c5[0]; d[i4 + 1] = c5[1]; d[i4 + 2] = c5[2];
          }
        }
        ctx.putImageData(new ImageData(new Uint8ClampedArray(d), W, H), 0, 0);
      }

      /* effects stack */
      for (var e = 0; e < state.effects.length; e++) {
        var ef = state.effects[e];
        var ed = ctx.getImageData(0, 0, W, H);
        applyEffect(ed.data, W, H, ef.id, ef.v);
        ctx.putImageData(ed, 0, 0);
      }
      return { canvas: canvas, W: W, H: H };
    }

    /* ================= display ================= */
    var view = $("view");
    var viewCtx = view.getContext("2d");
    var wrapEl = $("wrap");
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
      viewCtx.imageSmoothingEnabled = false;
      viewCtx.drawImage(r.canvas, 0, 0, view.width, view.height);
      $("dims").textContent = r.W + " × " + r.H + " px";
      $("zoom-v").textContent = Math.round(fit * 100) + "%";
      var tag = $("algo-tag");
      var pal = ACTIVE_PAL_NAME + (customColors.length ? " +" + customColors.length : "");
      tag.textContent = "· " + ALGO_LABELS[state.algo] + " · " + pal;
    }
    function drawOriginal() {
      var fit = areaFit(img.naturalWidth, img.naturalHeight);
      view.width = Math.max(1, Math.round(img.naturalWidth * fit));
      view.height = Math.max(1, Math.round(img.naturalHeight * fit));
      viewCtx.drawImage(img, 0, 0, view.width, view.height);
    }
    function renderPreview() {
      if (!img) return;
      currentResult = buildResult(960); /* interactive preview stays light; export uses full res */
      drawCurrent();
    }
    /* coalesced, throttled rendering for continuous inputs (slider drags, effect sliders) */
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

    /* ================= state / history ================= */
    var ALGO_LABELS = {
      floyd: "Floyd–Steinberg", "false-floyd": "False Floyd", jarvis: "Jarvis", stucki: "Stucki",
      atkinson: "Atkinson", burkes: "Burkes", sierra: "Sierra", sierra2: "Two-Row Sierra",
      "sierra-lite": "Sierra Lite", stevenson: "Stevenson–Arce",
      bayer2: "Bayer 2×2", bayer4: "Bayer 4×4", bayer8: "Bayer 8×8",
      dots: "Dot Pattern", checker: "Checker", diagonal: "Diagonal", crosshatch: "Crosshatch", circles: "Circles",
      halftone: "Halftone", "halftone-bw": "Halftone Crush",
      posterize: "Posterize", noise: "Noise Dither", "glitch-crush": "JPEG Block Crush", "glitch-split": "RGB Split"
    };
    var DEFAULTS = function () {
      return {
        algo: "floyd",
        strength: 100,
        scale: 8,
        angle: 45,
        effects: []
      };
    };
    function clone(s) { return JSON.parse(JSON.stringify(s)); }
    function pushHistory() {
      history = history.slice(0, hIndex + 1);
      history.push(clone(state));
      if (history.length > 30) history.shift();
      hIndex = history.length - 1;
      $("undo").disabled = hIndex <= 0;
      $("redo").disabled = hIndex >= history.length - 1;
    }
    function undo() {
      if (hIndex <= 0) return;
      hIndex--;
      state = clone(history[hIndex]);
      syncControls();
      renderEffects();
      renderPreview();
      $("undo").disabled = hIndex <= 0;
      $("redo").disabled = hIndex >= history.length - 1;
    }
    function redo() {
      if (hIndex >= history.length - 1) return;
      hIndex++;
      state = clone(history[hIndex]);
      syncControls();
      renderEffects();
      renderPreview();
      $("undo").disabled = hIndex <= 0;
      $("redo").disabled = hIndex >= history.length - 1;
    }
    $("undo").addEventListener("click", undo);
    $("redo").addEventListener("click", redo);

    /* ================= controls ================= */
    var algoEl = $("algo");
    var strEl = $("str"), sclEl = $("scl"), angEl = $("ang");
    function syncControls() {
      algoEl.value = state.algo;
      strEl.value = state.strength; $("str-v").textContent = state.strength;
      sclEl.value = state.scale; $("scl-v").textContent = state.scale;
      angEl.value = state.angle; $("ang-v").textContent = state.angle + "°";
    }
    algoEl.addEventListener("change", function () { pushHistory(); state.algo = algoEl.value; renderPreview(); });
    [[strEl, "strength", "str-v", ""], [sclEl, "scale", "scl-v", ""], [angEl, "angle", "ang-v", "°"]].forEach(function (pair) {
      pair[0].addEventListener("input", function () {
        state[pair[1]] = Number(pair[0].value);
        $(pair[2]).textContent = pair[0].value + pair[3];
        scheduleRender();
      });
      pair[0].addEventListener("change", pushHistory);
    });

    /* ================= palettes ================= */
    var palGrid = $("pal-grid");
    function swatches(hexes) {
      return hexes.map(function (h) { return '<span class="ds-swatch" style="background:' + h + ';"></span>'; }).join("");
    }
    function renderPalettes() {
      var names = Object.keys(PALETTES);
      palGrid.innerHTML = names.map(function (nm) {
        return '<button class="ds-pal-btn' + (ACTIVE_PAL_NAME === nm ? " active" : "") + '" data-pal="' + nm + '">'
          + '<span class="ds-swatch-row">' + swatches(PALETTES[nm].slice(0, 4)) + '</span> ' + nm + '</button>';
      }).join("");
      palGrid.querySelectorAll("[data-pal]").forEach(function (b) {
        b.addEventListener("click", function () {
          pushHistory();
          ACTIVE_PAL_NAME = b.dataset.pal;
          renderPalettes();
          renderPalStrip();
          renderPreview();
        });
      });
      renderPalStrip();
    }
    function renderPalStrip() {
      $("pal-strip").innerHTML = swatches(activePalette());
    }
    function extractPalette() {
      if (!img) return;
      var W = Math.max(1, Math.round(img.naturalWidth * Math.min(1, 300 / img.naturalWidth)));
      var H = Math.max(1, Math.round(img.naturalHeight * Math.min(1, 300 / img.naturalHeight)));
      var c = document.createElement("canvas");
      c.width = W; c.height = H;
      var ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, W, H);
      var d = ctx.getImageData(0, 0, W, H).data;
      var counts = {};
      for (var i = 0; i < W * H * 4; i += 4) {
        var q = rgbToHex(Math.round(d[i] / 24) * 24, Math.round(d[i + 1] / 24) * 24, Math.round(d[i + 2] / 24) * 24);
        counts[q] = (counts[q] || 0) + 1;
      }
      var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 8);
      if (top.length < 2) top.push("#ffffff", "#000000");
      ACTIVE_PAL_NAME = "B&W";
      customColors = top;
      renderPalettes();
      renderPalStrip();
      renderPreview();
    }
    $("extract").addEventListener("click", function () {
      pushHistory();
      extractPalette();
    });
    $("tool-extract").addEventListener("click", function () { $("extract").click(); });
    var customColorEl = $("custom-color");
    var customHexEl = $("custom-hex");
    customColorEl.addEventListener("input", function () { customHexEl.textContent = customColorEl.value; });
    $("custom-add").addEventListener("click", function () {
      var h = customColorEl.value;
      if (customColors.indexOf(h) === -1) {
        customColors.push(h);
        pushHistory();
      }
      renderPalStrip();
      renderPreview();
    });

    /* ================= effects stack ================= */
    var effectsList = $("effects-list");
    function renderEffects() {
      if (!state.effects.length) {
        effectsList.innerHTML = '<div class="ds-empty">No effects — stack some retro glitch!</div>';
        return;
      }
      effectsList.innerHTML = state.effects.map(function (ef, i) {
        var spec = EFFECTS[ef.id];
        return '<div class="ds-effect" data-idx="' + i + '">'
          + '<span class="ds-effect-name">' + spec.label + '</span>'
          + '<input type="range" data-ef="' + ef.id + '" min="' + spec.min + '" max="' + spec.max + '" value="' + ef.v + '">'
          + '<span class="ds-effect-v">' + ef.v + '</span>'
          + '<span class="ds-effect-acts">'
          + '<button data-act="up" title="Move up">↑</button>'
          + '<button data-act="down" title="Move down">↓</button>'
          + '<button data-act="del" title="Remove">✕</button>'
          + "</span></div>";
      }).join("");
      effectsList.querySelectorAll(".ds-effect").forEach(function (row) {
        var idx = Number(row.dataset.idx);
        row.querySelector("input").addEventListener("input", function () {
          var v = Number(this.value);
          state.effects[idx].v = v;
          row.querySelector(".ds-effect-v").textContent = v;
          scheduleRender();
        });
        row.querySelector("input").addEventListener("change", pushHistory);
        row.querySelector('[data-act="up"]').addEventListener("click", function () {
          if (idx <= 0) return;
          pushHistory();
          var e = state.effects.splice(idx, 1)[0];
          state.effects.splice(idx - 1, 0, e);
          renderEffects(); renderPreview();
        });
        row.querySelector('[data-act="down"]').addEventListener("click", function () {
          if (idx >= state.effects.length - 1) return;
          pushHistory();
          var e = state.effects.splice(idx, 1)[0];
          state.effects.splice(idx + 1, 0, e);
          renderEffects(); renderPreview();
        });
        row.querySelector('[data-act="del"]').addEventListener("click", function () {
          pushHistory();
          state.effects.splice(idx, 1);
          renderEffects(); renderPreview();
        });
      });
    }
    $("add-effect").addEventListener("change", function () {
      var id = this.value;
      if (!id) return;
      pushHistory();
      state.effects.push({ id: id, v: EFFECTS[id].def });
      this.value = "";
      renderEffects();
      renderPreview();
    });

    /* ================= export ================= */
    function toSVG(canvas) {
      var W = canvas.width, H = canvas.height;
      var ctx = canvas.getContext("2d");
      var d = ctx.getImageData(0, 0, W, H).data;
      var pal = activePalette();
      var groups = [];
      for (var c = 0; c < pal.length; c++) {
        var runs = [];
        for (var y = 0; y < H; y++) {
          var start = -1;
          for (var x = 0; x < W; x++) {
            var i = (y * W + x) * 4;
            var idx = nearestIdx(d[i], d[i + 1], d[i + 2], pal);
            if (idx === c && start < 0) start = x;
            if (idx !== c && start >= 0) { runs.push([start, y, x - start]); start = -1; }
          }
          if (start >= 0) runs.push([start, y, W - start]);
        }
        if (runs.length) groups.push({ color: pal[c], runs: runs });
      }
      var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">';
      groups.forEach(function (g) {
        s += '<g fill="' + g.color + '">';
        g.runs.forEach(function (r) { s += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="1"/>'; });
        s += "</g>";
      });
      return s + "</svg>";
    }
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
      var result = buildResult(0);
      if (format === "image/svg+xml") {
        var svg = toSVG(result.canvas);
        var blob = new Blob([svg], { type: "image/svg+xml" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "dither-" + Date.now() + ".svg";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
        return;
      }
      result.canvas.toBlob(function (blob) {
        if (!blob) return;
        var ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "dither-" + Date.now() + "." + ext;
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
      }, format, quality);
    });

    /* ================= menus / rail ================= */
    var menuEls = box.querySelectorAll(".ds-menu");
    menuEls.forEach(function (m) {
      m.querySelector(".ds-menu-btn").addEventListener("click", function (e) {
        e.stopPropagation();
        var wasOpen = m.classList.contains("open");
        menuEls.forEach(function (x) { x.classList.remove("open"); });
        if (!wasOpen) m.classList.add("open");
      });
    });
    document.addEventListener("click", function () {
      menuEls.forEach(function (m) { m.classList.remove("open"); });
    });
    box.querySelectorAll(".ds-menu-item").forEach(function (item) {
      item.addEventListener("click", function () {
        var action = item.dataset.action;
        var map = {
          undo: undo, redo: redo, reset: function () { $("reset").click(); },
          export: function () { $("export").click(); },
          compare: function () { $("compare").click(); },
          extract: function () { $("extract").click(); },
          open: function () { fileInput.click(); }
        };
        if (map[action]) map[action]();
      });
    });
    [["tool-open", function () { fileInput.click(); }], ["tool-undo", undo], ["tool-redo", redo],
     ["tool-compare", function () { $("compare").click(); }], ["tool-reset", function () { $("reset").click(); }]].forEach(function (pair) {
      var tb = $(pair[0]);
      if (tb) tb.addEventListener("click", pair[1]);
    });

    /* compare (hold to see original) */
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
    var toolCompare = $("tool-compare");
    toolCompare.addEventListener("pointerdown", function () {
      if (!img) return;
      comparing = true;
      drawOriginal();
    });
    toolCompare.addEventListener("pointerup", function () {
      if (comparing) { comparing = false; drawCurrent(); }
    });

    $("reset").addEventListener("click", function () {
      if (!img) return;
      pushHistory();
      state = DEFAULTS();
      customColors = [];
      ACTIVE_PAL_NAME = "B&W";
      syncControls();
      renderPalettes();
      renderEffects();
      renderPreview();
    });

    /* keyboard shortcuts */
    document.addEventListener("keydown", function (e) {
      if (!img || (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT"))) return;
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
    });

    /* ================= load ================= */
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
          customColors = [];
          ACTIVE_PAL_NAME = "B&W";
          history = [clone(state)];
          hIndex = 0;
          $("editor").classList.remove("hidden");
          drop.style.display = "none";
          $("undo").disabled = true;
          $("redo").disabled = true;
          syncControls();
          renderPalettes();
          renderEffects();
          renderPreview();
        };
        im.onerror = function () { window.alert("Could not read that image."); };
        im.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
});