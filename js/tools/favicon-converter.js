ToolBox.define("favicon-converter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0">🖼️ <strong>Drop an image here</strong> or click to browse<input type="file" id="file" accept="image/*" class="hidden"></div>'
      + '<div id="wrap" class="hidden" style="margin-top:16px;">'
      + '<div class="controls">'
      + '<button id="dl-ico" class="btn primary">⬇️ Download .ico (all sizes)</button>'
      + '<button id="dl-png" class="btn">⬇️ Download 32px .png</button>'
      + "</div>"
      + '<div id="preview" class="controls" style="margin-top:12px;"></div>'
      + "</div>"
      + "</div>";

    var SIZES = [16, 32, 48, 64];

    function loadFile(f) {
      if (!f || !/^image\//.test(f.type)) return;
      var reader = new FileReader();
      reader.onload = function () {
        var im = new Image();
        im.onload = function () {
          box.querySelector("#drop").classList.add("hidden");
          box.querySelector("#wrap").classList.remove("hidden");
          var canvases = {};
          SIZES.forEach(function (s) {
            var c = document.createElement("canvas");
            c.width = s; c.height = s;
            var x = c.getContext("2d");
            x.imageSmoothingQuality = "high";
            x.drawImage(im, 0, 0, s, s);
            canvases[s] = c;
          });
          box.querySelector("#preview").innerHTML = SIZES.map(function (s) {
            return '<div class="center" style="display:flex;flex-direction:column;align-items:center;gap:4px;"><canvas width="' + s + '" height="' + s + '"></canvas><span class="small muted">' + s + "px</span></div>";
          }).join("");
          SIZES.forEach(function (s) {
            box.querySelector("#preview canvas[width=\"" + s + "\"]").getContext("2d").drawImage(canvases[s], 0, 0);
          });
          window.__favData = canvases;
        };
        im.src = reader.result;
      };
      reader.readAsDataURL(f);
    }

    function pngBlob(canvas) {
      return new Promise(function (resolve) { canvas.toBlob(resolve, "image/png"); });
    }

    async function buildIco() {
      var blobs = [];
      for (var i = 0; i < SIZES.length; i++) blobs.push(await pngBlob(window.__favData[SIZES[i]]));
      var header = new ArrayBuffer(6);
      new DataView(header).setUint16(0, 0, true); // reserved
      new DataView(header).setUint16(2, 1, true); // type: icon
      new DataView(header).setUint16(4, SIZES.length, true); // count
      var dirSize = 16 * SIZES.length;
      var total = 6 + dirSize + blobs.reduce(function (n, b) { return n + b.size; }, 0);
      var buf = new ArrayBuffer(total);
      var dv = new DataView(buf);
      new Uint8Array(buf).set(new Uint8Array(header), 0);
      var offset = 6 + dirSize;
      blobs.forEach(function (b, i) {
        var s = SIZES[i];
        var base = 6 + i * 16;
        dv.setUint8(base, s === 256 ? 0 : s);
        dv.setUint8(base + 1, s === 256 ? 0 : s);
        dv.setUint8(base + 2, 0);
        dv.setUint8(base + 3, 0);
        dv.setUint16(base + 4, 1, true); // planes
        dv.setUint16(base + 6, 32, true); // bpp
        dv.setUint32(base + 8, b.size, true);
        dv.setUint32(base + 12, offset, true);
        new Uint8Array(buf, offset, b.size).set(new Uint8Array(b));
        offset += b.size;
      });
      return new Blob([buf], { type: "image/x-icon" });
    }

    box.querySelector("#dl-ico").addEventListener("click", async function () {
      var blob = await buildIco();
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "favicon.ico";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
    box.querySelector("#dl-png").addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = window.__favData[32].toDataURL("image/png");
      a.download = "favicon-32x32.png";
      a.click();
    });

    box.querySelector("#file").addEventListener("change", function () { loadFile(box.querySelector("#file").files[0]); box.querySelector("#file").value = ""; });
    var drop = box.querySelector("#drop");
    drop.addEventListener("click", function () { box.querySelector("#file").click(); });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) loadFile(f); });
  }
});