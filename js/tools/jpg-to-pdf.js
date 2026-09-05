ToolBox.define("jpg-to-pdf", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose images">'
      + '<span class="dz-icon">🖼️</span><strong>Drop one or more images here</strong> or click to browse (order = PDF page order)'
      + '<input type="file" id="file" accept="image/*" multiple class="hidden">'
      + "</div>"
      + '<div id="list-wrap" class="hidden" style="margin-top:18px;">'
      + '<ul id="file-list" class="file-list"></ul>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<button id="make" class="btn primary">📄 Create PDF</button>'
      + '<button id="clear" class="btn ghost danger">🗑️ Remove all</button>'
      + "</div>"
      + "</div>"
      + '<p class="note-box">Your images are converted to JPEG and assembled into a PDF entirely on your device — nothing is uploaded.</p>'
      + "</div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var listWrap = box.querySelector("#list-wrap");
    var fileListEl = box.querySelector("#file-list");
    var makeBtn = box.querySelector("#make");
    var images = []; // {name, w, h, bytes}

    function render() {
      fileListEl.innerHTML = "";
      images.forEach(function (item, i) {
        var li = document.createElement("li");
        var name = document.createElement("span");
        name.className = "fname";
        name.textContent = item.name;
        var meta = document.createElement("span");
        meta.className = "fmeta";
        meta.textContent = item.w + " × " + item.h + " px";
        var rm = document.createElement("button");
        rm.className = "mini-btn rm";
        rm.textContent = "✕";
        rm.addEventListener("click", function () {
          images.splice(i, 1);
          render();
        });
        li.appendChild(name);
        li.appendChild(meta);
        li.appendChild(rm);
        fileListEl.appendChild(li);
      });
      listWrap.classList.toggle("hidden", images.length === 0);
      makeBtn.disabled = images.length === 0;
    }

    function addFiles(fileList) {
      var pending = Array.prototype.slice.call(fileList).filter(function (f) { return f.type.indexOf("image/") === 0; });
      if (!pending.length) { window.alert("Please choose image files."); return; }
      var done = 0;
      pending.forEach(function (file) {
        var reader = new FileReader();
        reader.onload = function () {
          var img = new Image();
          img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function (blob) {
              blob.arrayBuffer().then(function (buf) {
                images.push({ name: file.name, w: img.naturalWidth, h: img.naturalHeight, bytes: new Uint8Array(buf) });
                done++;
                if (done === pending.length) render();
              });
            }, "image/jpeg", 0.92);
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    }

    function pad10(n) { return ("0000000000" + n).slice(-10); }

    function makePdf(items) {
      var enc = new TextEncoder();
      var chunks = [];
      var offsets = [];
      var total = 0;
      function emit(bytes) { chunks.push(bytes); total += bytes.length; }
      function emitStr(s) { emit(enc.encode(s)); }
      function obj(num, body) {
        offsets[num] = total;
        emitStr(num + " 0 obj\n" + body + "\nendobj\n");
      }
      function streamObj(num, header, bytes) {
        offsets[num] = total;
        emitStr(num + " 0 obj\n" + header + "\nstream\n");
        emit(bytes);
        emitStr("\nendstream\nendobj\n");
      }

      emitStr("%PDF-1.4\n");
      obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
      var kids = [];
      for (var i = 0; i < items.length; i++) kids.push((3 + i * 3) + " 0 R");
      obj(2, "<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + items.length + " >>");

      items.forEach(function (item, i) {
        var pageNum = 3 + i * 3;
        var imgNum = pageNum + 1;
        var contNum = pageNum + 2;
        obj(pageNum, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + item.w + " " + item.h + "] /Resources << /XObject << /Im0 " + imgNum + " 0 R >> >> /Contents " + contNum + " 0 R >>");
        streamObj(imgNum, "<< /Type /XObject /Subtype /Image /Width " + item.w + " /Height " + item.h + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + item.bytes.length + " >>", item.bytes);
        var content = "q\n" + item.w + " 0 0 " + item.h + " 0 0 cm\n/Im0 Do\nQ\n";
        obj(contNum, "<< /Length " + enc.encode(content).length + " >>\nstream\n" + content + "endstream");
      });

      var maxObj = 2 + items.length * 3;
      var xrefOffset = total;
      var xref = "xref\n0 " + (maxObj + 1) + "\n0000000000 65535 f \n";
      for (var n = 1; n <= maxObj; n++) xref += pad10(offsets[n]) + " 00000 n \n";
      emitStr(xref);
      emitStr("trailer\n<< /Size " + (maxObj + 1) + " /Root 1 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF");

      var out = new Uint8Array(total);
      var pos = 0;
      chunks.forEach(function (c) { out.set(c, pos); pos += c.length; });
      return out;
    }

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
    drop.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });
    fileInput.addEventListener("change", function () {
      addFiles(fileInput.files);
      fileInput.value = "";
    });

    makeBtn.addEventListener("click", function () {
      if (!images.length) return;
      var bytes = makePdf(images);
      var blob = new Blob([bytes], { type: "application/pdf" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "images.pdf";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    });
    box.querySelector("#clear").addEventListener("click", function () {
      images = [];
      render();
    });
    render();
  }
});