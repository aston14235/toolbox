ToolBox.define("color-converter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<input type="text" id="input" placeholder="Type any color: #3b82f6, rgb(59,130,246), hsl(217, 91%, 60%), dodgerblue…" style="flex:1; min-width:220px; padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text); font-size:1rem;">'
      + '<input type="color" id="picker" value="#3b82f6" aria-label="Pick a color">'
      + "</div>"
      + '<div id="preview" class="center" style="margin-top:18px;"></div>'
      + '<div id="rows" class="kv" style="margin-top:16px;"></div>'
      + '<p class="note-box">Converts between HEX, RGB, HSL and CSS color names. Click any format to copy it.</p>'
      + "</div>";

    var NAMED = {
      aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc",
      black: "000000", blue: "0000ff", blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", cadetblue: "5f9ea0",
      chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", crimson: "dc143c",
      cyan: "00ffff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9",
      darkgreen: "006400", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f", darkorange: "ff8c00",
      darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b",
      darkslategray: "2f4f4f", darkturquoise: "00ced1", darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff",
      dimgray: "696969", dodgerblue: "1e90ff", firebrick: "b22222", forestgreen: "228b22", fuchsia: "ff00ff",
      gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000", greenyellow: "adff2f", hotpink: "ff69b4",
      indianred: "cd5c5c", indigo: "4b0082", khaki: "f0e68c", lavender: "e6e6fa", lawngreen: "7cfc00",
      lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff", lightgray: "d3d3d3", lightgreen: "90ee90",
      lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa",
      lightslategray: "778899", lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "00ff00", limegreen: "32cd32",
      magenta: "ff00ff", maroon: "800000", mediumblue: "0000cd", mediumorchid: "ba55d3", mediumpurple: "9370db",
      mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumturquoise: "48d1cc", mediumvioletred: "c71585",
      midnightblue: "191970", navy: "000080", olive: "808000", olivedrab: "6b8e23", orange: "ffa500",
      orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee",
      palevioletred: "db7093", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd",
      powderblue: "b0e0e6", purple: "800080", rebeccapurple: "663399", red: "ff0000", rosybrown: "bc8f8f",
      royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57",
      sienna: "a0522d", silver: "c0c0c0", skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090",
      springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8", tomato: "ff6347",
      turquoise: "40e0d0", violet: "ee82ee", wheat: "f5deb3", white: "ffffff", whitesmoke: "f5f5f5",
      yellow: "ffff00", yellowgreen: "9acd32"
    };
    var REVERSE = {};
    Object.keys(NAMED).forEach(function (k) { REVERSE[NAMED[k]] = k; });

    var inputEl = box.querySelector("#input");
    var pickerEl = box.querySelector("#picker");
    var previewEl = box.querySelector("#preview");
    var rowsEl = box.querySelector("#rows");

    function parseColor(s) {
      s = String(s).trim().toLowerCase().replace(/\s+/g, "");
      if (!s) return null;
      if (s.charAt(0) === "#") {
        var h = s.slice(1);
        if (/^[0-9a-f]{3}$/.test(h)) h = h.split("").map(function (c) { return c + c; }).join("");
        if (/^[0-9a-f]{6}$/.test(h)) return { hex: h };
        return null;
      }
      var rgb = s.match(/^rgba?\((\d+)[,](\d+)[,](\d+)(?:[,](\d*\.?\d+))?\)$/);
      if (rgb) {
        var r = Number(rgb[1]), g = Number(rgb[2]), b = Number(rgb[3]);
        if (r > 255 || g > 255 || b > 255) return null;
        function hx(v) { return ("0" + v.toString(16)).slice(-2); }
        return { hex: hx(r) + hx(g) + hx(b) };
      }
      var hsl = s.match(/^hsla?\((\d+)[,](\d+)%[,](\d+)%(?:[,](\d*\.?\d+))?\)$/);
      if (hsl) {
        return { hex: hslToHex(Number(hsl[1]), Number(hsl[2]), Number(hsl[3])) };
      }
      if (NAMED[s]) return { hex: NAMED[s], name: s };
      return null;
    }

    function hslToHex(h, s, l) {
      h = ((h % 360) + 360) % 360;
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
      return rgb.map(function (v) { return ("0" + Math.round((v + m) * 255).toString(16)).slice(-2); }).join("");
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

    function copyRow(text, btn) {
      function done() {
        var orig = btn.textContent;
        btn.textContent = "✅ Copied";
        setTimeout(function () { btn.textContent = orig; }, 1200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else done();
    }

    function render() {
      var parsed = parseColor(inputEl.value);
      if (!parsed) {
        previewEl.innerHTML = '<span class="muted">Type a color above — supports hex, rgb(), hsl() and CSS names.</span>';
        rowsEl.innerHTML = "";
        return;
      }
      var hex = parsed.hex;
      pickerEl.value = "#" + hex;
      var hsl = hexToHsl(hex);
      var name = parsed.name || REVERSE[hex];
      var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
      previewEl.innerHTML = '<div style="display:inline-flex; align-items:center; gap:12px;">'
        + '<div style="width:56px; height:56px; border-radius:14px; background:#' + hex + '; border:1px solid var(--border);"></div>'
        + '<div style="text-align:left;"><div style="font-weight:800; font-size:1.1rem;">#' + hex.toUpperCase() + "</div>"
        + '<div class="muted small">' + (name ? name.charAt(0).toUpperCase() + name.slice(1) : "No matching name") + "</div></div></div>";

      var rows = [
        ["HEX", "#" + hex.toUpperCase()],
        ["RGB", "rgb(" + r + ", " + g + ", " + b + ")"],
        ["HSL", "hsl(" + hsl.h + "°, " + hsl.s + "%, " + hsl.l + "%)"],
        ["Name", name ? name.charAt(0).toUpperCase() + name.slice(1) : "—"]
      ];
      var html = "";
      rows.forEach(function (row) {
        if (row[1] === "—") { html += '<div class="row"><span><strong>' + row[0] + "</strong></span><code>" + row[1] + "</code></div>"; return; }
        html += '<div class="row"><span><strong>' + row[0] + "</strong></span><code>" + ToolBox.esc(row[1]) + '</code><button class="mini-btn">📋 Copy</button></div>';
      });
      rowsEl.innerHTML = html;
      rowsEl.querySelectorAll(".row").forEach(function (rowEl, i) {
        var btn = rowEl.querySelector(".mini-btn");
        if (btn) btn.addEventListener("click", function () { copyRow(rows[i][1], btn); });
      });
    }

    inputEl.addEventListener("input", render);
    pickerEl.addEventListener("input", function () {
      inputEl.value = pickerEl.value;
      render();
    });
    inputEl.value = "#3b82f6";
    render();
  }
});