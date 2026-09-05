ToolBox.define("color-scheme", {
  styles: ".wheel-area { margin-top: 20px; } .hue-slider { -webkit-appearance: none; appearance: none; width: min(300px, 78vw); height: 18px; border-radius: 999px; background: linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%)); border: 1px solid rgba(0,0,0,.25); cursor: pointer; display: block; margin: 0 auto 14px; } .hue-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2px solid rgba(0,0,0,.55); box-shadow: 0 1px 3px rgba(0,0,0,.4); } .hue-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 2px solid rgba(0,0,0,.55); } .wheel-wrap { position: relative; width: min(300px, 78vw); margin: 0 auto; aspect-ratio: 1 / 1; } .wheel-wrap canvas { width: 100%; height: 100%; display: block; border-radius: 50%; cursor: crosshair; touch-action: none; box-shadow: 0 6px 24px rgba(0,0,0,.28); } .wheel-dot { position: absolute; width: 15px; height: 15px; border-radius: 50%; background: #fff; border: 2px solid rgba(0,0,0,.55); transform: translate(-50%,-50%); pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,.45); } .board-wrap { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 8px; margin-top: 22px; } .board { display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px; max-width: 480px; margin-inline: auto; } .board-cell { aspect-ratio: 1 / 1; border: none; border-radius: 2px; cursor: pointer; padding: 0; transition: transform .08s ease; } .board-cell:hover { transform: scale(1.05); z-index: 2; } .board-cap { text-align: center; font-size: .78rem; color: var(--muted); margin-top: 10px; } .chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; justify-content: center; } .chip { padding: 6px 13px; border-radius: 999px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: .8rem; font-weight: 600; cursor: pointer; } .chip:hover { border-color: var(--accent); background: var(--accent-soft); } #copied { min-height: 1.4em; font-size: .85rem; color: var(--ok); font-weight: 600; margin-top: 8px; }",
  render: function (box) {
    var NAMED = {
      aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc",
      bisque: "ffe4c4", black: "000000", blanchedalmond: "ffebcd", blue: "0000ff", blueviolet: "8a2be2", brown: "a52a2a",
      burlywood: "deb887", cadetblue: "5f9ea0", chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50",
      cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c", cyan: "00ffff", darkblue: "00008b",
      darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9", darkgreen: "006400", darkkhaki: "bdb76b",
      darkmagenta: "8b008b", darkolivegreen: "556b2f", darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000",
      darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b", darkslategray: "2f4f4f",
      darkturquoise: "00ced1", darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969",
      dodgerblue: "1e90ff", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "ff00ff",
      gainsboro: "dcdcdc", ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000",
      greenyellow: "adff2f", honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c", indigo: "4b0082",
      ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00",
      lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff", lightgray: "d3d3d3",
      lightgreen: "90ee90", lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa",
      lightslategray: "778899", lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "00ff00", limegreen: "32cd32",
      linen: "faf0e6", magenta: "ff00ff", maroon: "800000", mediumaquamarine: "66cdaa", mediumblue: "0000cd",
      mediumorchid: "ba55d3", mediumpurple: "9370db", mediumseagreen: "3cb371", mediumslateblue: "7b68ee",
      mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585", midnightblue: "191970",
      mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5", navajowhite: "ffdead", navy: "000080",
      oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23", orange: "ffa500", orangered: "ff4500", orchid: "da70d6",
      palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee", palevioletred: "db7093",
      papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6",
      purple: "800080", rebeccapurple: "663399", red: "ff0000", rosybrown: "bc8f8f", royalblue: "4169e1",
      saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee",
      sienna: "a0522d", silver: "c0c0c0", skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", snow: "fffafa",
      springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8", tomato: "ff6347",
      turquoise: "40e0d0", violet: "ee82ee", wheat: "f5deb3", white: "ffffff", whitesmoke: "f5f5f5",
      yellow: "ffff00", yellowgreen: "9acd32"
    };
    var REVERSE = {};
    Object.keys(NAMED).forEach(function (k) { REVERSE[NAMED[k]] = k; });

    var CHIPS = [
      ["Red", "#ef4444"], ["Orange", "#f97316"], ["Amber", "#f59e0b"], ["Gold", "#eab308"],
      ["Lime", "#84cc16"], ["Green", "#22c55e"], ["Teal", "#14b8a6"], ["Cyan", "#06b6d4"],
      ["Sky", "#0ea5e9"], ["Blue", "#3b82f6"], ["Indigo", "#6366f1"], ["Violet", "#8b5cf6"],
      ["Purple", "#a855f7"], ["Pink", "#ec4899"], ["Rose", "#f43f5e"], ["Slate", "#64748b"]
    ];

    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls" style="justify-content:center;">'
      + '<input type="text" id="color-input" placeholder="Color name or hex — e.g. indigo, #6366f1, rgb(100,100,255)" style="flex:1; min-width:220px; max-width:420px; padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text); font-size:1rem;">'
      + '<input type="color" id="picker" value="#6366f1" aria-label="Pick a color">'
      + "</div>"
      + '<div class="chips">' + CHIPS.map(function (c) { return '<button class="chip" data-hex="' + c[1] + '">' + c[0] + "</button>"; }).join("") + "</div>"
      + '<div class="wheel-area">'
      + '<input type="range" id="hue-slider" class="hue-slider" min="0" max="359" value="275" aria-label="Hue">'
      + '<div class="wheel-wrap">'
      + '<canvas id="wheel" aria-label="Color wheel — click or drag to pick a color"></canvas>'
      + '<div class="wheel-dot" id="wheel-dot"></div>'
      + "</div></div>"
      + '<div id="base" class="center" style="margin-top:20px;"></div>'
      + '<div class="board-wrap"><div class="board" id="board" aria-label="Shades of the chosen color"></div>'
      + '<div class="board-cap" id="board-cap"></div></div>'
      + '<div class="center"><span id="copied"></span></div>'
      + '<p class="note-box">Click or drag on the wheel to pick a color — the board below shows only shades of that color, light to dark. You can also type a name, hex, or rgb() value. Click any square to copy its hex.</p>'
      + "</div>";

    var inputEl = box.querySelector("#color-input");
    var pickerEl = box.querySelector("#picker");
    var hueSliderEl = box.querySelector("#hue-slider");
    var wheelEl = box.querySelector("#wheel");
    var dotEl = box.querySelector("#wheel-dot");
    var boardEl = box.querySelector("#board");
    var copiedEl = box.querySelector("#copied");

    function parseColor(s) {
      s = String(s).trim().toLowerCase().replace(/\s+/g, "");
      if (!s) return null;
      if (s.charAt(0) === "#") {
        var h = s.slice(1);
        if (/^[0-9a-f]{3}$/.test(h)) h = h.split("").map(function (c) { return c + c; }).join("");
        if (/^[0-9a-f]{6}$/.test(h)) return h;
        return null;
      }
      var rgb = s.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
      if (rgb) {
        var r = Number(rgb[1]), g = Number(rgb[2]), b = Number(rgb[3]);
        if (r > 255 || g > 255 || b > 255) return null;
        function hx(v) { return ("0" + v.toString(16)).slice(-2); }
        return hx(r) + hx(g) + hx(b);
      }
      if (NAMED[s]) return NAMED[s];
      return null;
    }

    function hexToHsl(hex) {
      var r = parseInt(hex.slice(0, 2), 16) / 255;
      var g = parseInt(hex.slice(2, 4), 16) / 255;
      var b = parseInt(hex.slice(4, 6), 16) / 255;
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
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToHex(h, s, l) {
      h = ((h % 360) + 360) % 360;
      s = Math.min(100, Math.max(0, s));
      l = Math.min(100, Math.max(0, l));
      var c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
      var hp = h / 60;
      var x = c * (1 - Math.abs((hp % 2) - 1));
      var rgb;
      if (hp < 1) rgb = [c, x, 0];
      else if (hp < 2) rgb = [x, c, 0];
      else if (hp < 3) rgb = [0, c, x];
      else if (hp < 4) rgb = [0, x, c];
      else if (hp < 5) rgb = [x, 0, c];
      else rgb = [c, 0, x];
      var m = l / 100 - c / 2;
      return rgb.map(function (v) {
        return ("0" + Math.round((v + m) * 255).toString(16)).slice(-2);
      }).join("");
    }

    // Draw the wheel: hue = angle, saturation = radius (center white), matches pick() exactly
    function drawWheel() {
      var dpr = window.devicePixelRatio || 1;
      var N = 300 * dpr;
      wheelEl.width = N;
      wheelEl.height = N;
      var ctx = wheelEl.getContext("2d");
      var img = ctx.createImageData(N, N);
      var data = img.data;
      var hueRgb = [];
      for (var hd = 0; hd < 360; hd++) {
        var hp = hd / 60;
        var xx = 1 - Math.abs((hp % 2) - 1);
        if (hp < 1) hueRgb.push([1, xx, 0]);
        else if (hp < 2) hueRgb.push([xx, 1, 0]);
        else if (hp < 3) hueRgb.push([0, 1, xx]);
        else if (hp < 4) hueRgb.push([0, xx, 1]);
        else if (hp < 5) hueRgb.push([xx, 0, 1]);
        else hueRgb.push([1, 0, xx]);
      }
      for (var y = 0; y < N; y++) {
        for (var x = 0; x < N; x++) {
          var dx = (x + 0.5) / N - 0.5;
          var dy = (y + 0.5) / N - 0.5;
          var r = Math.sqrt(dx * dx + dy * dy) * 2;
          if (r > 1) continue;
          var hue = Math.floor((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360);
          var r2 = r * r;
          var m = 1 - r / 2 - r2 / 2;
          var hrgb = hueRgb[hue];
          var i = (y * N + x) * 4;
          data[i] = Math.round((hrgb[0] * r2 + m) * 255);
          data[i + 1] = Math.round((hrgb[1] * r2 + m) * 255);
          data[i + 2] = Math.round((hrgb[2] * r2 + m) * 255);
          data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    // Pick from a pointer event — same formula as the wheel pixels
    function pick(e) {
      var rect = wheelEl.getBoundingClientRect();
      var dx = (e.clientX - rect.left) / rect.width - 0.5;
      var dy = (e.clientY - rect.top) / rect.height - 0.5;
      var r = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2);
      var hue = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      var hex = hslToHex(hue, r * 100, 50 + 50 * (1 - r));
      inputEl.value = "#" + hex;
      render();
    }

    var dragging = false;
    wheelEl.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      wheelEl.setPointerCapture(e.pointerId);
      dragging = true;
      pick(e);
    });
    wheelEl.addEventListener("pointermove", function (e) {
      if (dragging) pick(e);
    });
    ["pointerup", "pointercancel"].forEach(function (ev) {
      wheelEl.addEventListener(ev, function () { dragging = false; });
    });

    function render() {
      var hex = parseColor(inputEl.value);
      var baseEl = box.querySelector("#base");
      if (!hex) {
        baseEl.innerHTML = '<span class="muted">Pick a color on the wheel, or type a name / hex / rgb() value.</span>';
        boardEl.innerHTML = "";
        box.querySelector("#board-cap").textContent = "";
        return;
      }
      pickerEl.value = "#" + hex;
      var hsl = hexToHsl(hex);
      var name = REVERSE[hex];

      // keep the hue slider in sync with the current color
      hueSliderEl.value = hsl.h;

      // move the wheel indicator to the color's position
      var rad = hsl.h * Math.PI / 180;
      var rr = hsl.s / 100;
      dotEl.style.left = (50 + Math.cos(rad) * rr * 50) + "%";
      dotEl.style.top = (50 + Math.sin(rad) * rr * 50) + "%";

      baseEl.innerHTML = '<div style="display:inline-flex; align-items:center; gap:12px; flex-wrap:wrap; justify-content:center;">'
        + '<div style="width:56px; height:56px; border-radius:14px; background:#' + hex + '; border:1px solid var(--border);"></div>'
        + '<div style="text-align:left;"><div style="font-weight:800; font-size:1.1rem;">#' + hex.toUpperCase() + "</div>"
        + '<div class="muted small">' + (name ? name.charAt(0).toUpperCase() + name.slice(1) + " · " : "") + "HSL " + hsl.h + "°, " + hsl.s + "%, " + hsl.l + "%</div></div></div>";

      // Compact monochromatic board: 8 columns (light->dark) x 4 rows (vivid->muted), SAME hue only
      var LITS = [85, 76, 67, 58, 49, 40, 31, 22];
      var rowSats = [hsl.s, Math.max(15, hsl.s - 12), Math.max(15, hsl.s - 24), Math.max(15, hsl.s - 36)];
      boardEl.innerHTML = "";
      rowSats.forEach(function (sat) {
        for (var c = 0; c < 8; c++) {
          var col = hslToHex(hsl.h, sat, LITS[c]);
          var cell = document.createElement("button");
          cell.className = "board-cell";
          cell.style.background = "#" + col;
          cell.title = "#" + col.toUpperCase();
          cell.setAttribute("aria-label", "Color #" + col.toUpperCase());
          cell.addEventListener("click", function () {
            function done() {
              copiedEl.textContent = "#" + col.toUpperCase() + " copied ✓";
              setTimeout(function () { copiedEl.textContent = ""; }, 1400);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText("#" + col).then(done, done);
            } else done();
          });
          boardEl.appendChild(cell);
        }
      });
      box.querySelector("#board-cap").textContent = "Shades of " + (name ? name.charAt(0).toUpperCase() + name.slice(1) : "#" + hex.toUpperCase()) + " — light to dark";
    }

    inputEl.addEventListener("input", render);
    pickerEl.addEventListener("input", function () {
      inputEl.value = pickerEl.value;
      render();
    });
    // hue slider: keep the current saturation/lightness, change only the hue
    hueSliderEl.addEventListener("input", function () {
      var hex = parseColor(inputEl.value);
      if (!hex) return;
      var hsl = hexToHsl(hex);
      var newHex = hslToHex(Number(hueSliderEl.value), hsl.s, hsl.l);
      inputEl.value = "#" + newHex;
      render();
    });
    box.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        inputEl.value = chip.dataset.hex;
        render();
      });
    });
    drawWheel();
    inputEl.value = "indigo";
    render();
  }
});