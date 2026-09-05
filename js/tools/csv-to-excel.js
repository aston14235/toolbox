ToolBox.define("csv-to-excel", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose a CSV file">'
      + '<span class="dz-icon">📊</span><strong>Drop a CSV file here</strong> or click to browse — or paste below'
      + '<input type="file" id="file" accept=".csv,text/csv,text/plain" class="hidden">'
      + "</div>"
      + '<textarea id="csv" placeholder="name,email,age&#10;Ada,ada@example.com,36&#10;Grace,grace@example.com,41" aria-label="CSV input" style="margin-top:16px;"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<button id="parse" class="btn primary">👁️ Parse</button>'
      + '<button id="download" class="btn">⬇️ Download Excel (.xls)</button>'
      + "</div>"
      + '<div id="preview"></div>'
      + "</div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var csvEl = box.querySelector("#csv");
    var previewEl = box.querySelector("#preview");
    var downloadBtn = box.querySelector("#download");
    var rows = [];

    function parseCSV(text) {
      var rows = [], row = [], field = "", inQ = false;
      for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (inQ) {
          if (c === '"') {
            if (text[i + 1] === '"') { field += '"'; i++; }
            else inQ = false;
          } else field += c;
        } else {
          if (c === '"') inQ = true;
          else if (c === ",") { row.push(field); field = ""; }
          else if (c === "\n" || c === "\r") {
            if (c === "\r" && text[i + 1] === "\n") i++;
            row.push(field); field = "";
            if (row.some(function (f) { return f !== ""; })) rows.push(row);
            row = [];
          } else field += c;
        }
      }
      if (field !== "" || row.length) { row.push(field); if (row.some(function (f) { return f !== ""; })) rows.push(row); }
      return rows;
    }

    function renderPreview() {
      if (!rows.length) { previewEl.innerHTML = ""; return; }
      var html = '<table class="data" style="margin-top:16px;"><thead><tr>';
      rows[0].forEach(function (c) { html += "<th>" + ToolBox.esc(c) + "</th>"; });
      html += "</tr></thead><tbody>";
      var shown = rows.slice(1, 51);
      shown.forEach(function (r) {
        html += "<tr>";
        for (var i = 0; i < rows[0].length; i++) html += "<td>" + ToolBox.esc(r[i] || "") + "</td>";
        html += "</tr>";
      });
      html += "</tbody></table>";
      if (rows.length > 51) html += '<p class="muted small" style="margin-top:8px;">Showing first 50 rows of ' + (rows.length - 1) + ".</p>";
      previewEl.innerHTML = html;
    }

    function parse() {
      rows = parseCSV(csvEl.value);
      if (!rows.length) { previewEl.innerHTML = '<p class="muted" style="margin-top:14px;">Nothing to parse — paste some CSV first.</p>'; return; }
      renderPreview();
      downloadBtn.disabled = false;
    }

    function downloadXls() {
      if (!rows.length) return;
      var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
      var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1">';
      rows.forEach(function (r) {
        html += "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
      });
      html += "</table></body></html>";
      var blob = new Blob(["\ufeff" + html], { type: "application/vnd.ms-excel;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "data.xls";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
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
    drop.addEventListener("drop", function (e) {
      var f = e.dataTransfer.files[0];
      if (f) loadFile(f);
    });
    fileInput.addEventListener("change", function () {
      var f = fileInput.files[0];
      if (f) loadFile(f);
      fileInput.value = "";
    });
    function loadFile(file) {
      var reader = new FileReader();
      reader.onload = function () {
        csvEl.value = String(reader.result);
        parse();
      };
      reader.readAsText(file);
    }

    box.querySelector("#parse").addEventListener("click", parse);
    downloadBtn.addEventListener("click", downloadXls);
    downloadBtn.disabled = true;
  }
});