ToolBox.define("csv-json", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="tojson" class="btn primary">CSV → JSON</button>'
      + '<button id="tocsv" class="btn">JSON → CSV</button>'
      + '<button id="swap" class="btn ghost">⇅ Swap sides</button>'
      + '<button id="copy" class="btn">📋 Copy output</button>'
      + "</div>"
      + '<label class="field"><span class="flabel">Input</span><textarea id="input" class="mono" placeholder="Paste CSV or JSON here…" aria-label="Input"></textarea></label>'
      + '<label class="field"><span class="flabel">Output</span><textarea id="output" class="mono" readonly placeholder="Result appears here…" aria-label="Output"></textarea></label>'
      + '<p id="msg" class="note-box">CSV parsing handles quoted fields, commas and newlines inside quotes. JSON → CSV works on arrays of flat objects.</p>'
      + "</div>";

    var inputEl = box.querySelector("#input");
    var outputEl = box.querySelector("#output");
    var msgEl = box.querySelector("#msg");

    function setMsg(t, ok) {
      msgEl.textContent = t;
      msgEl.style.color = ok ? "var(--ok)" : "var(--danger)";
    }
    function parseCSV(text) {
      var rows = [];
      var row = [];
      var field = "";
      var inQ = false;
      for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (inQ) {
          if (c === '"') {
            if (text[i + 1] === '"') { field += '"'; i++; }
            else inQ = false;
          } else field += c;
        } else if (c === '"') {
          inQ = true;
        } else if (c === ",") {
          row.push(field); field = "";
        } else if (c === "\n" || c === "\r") {
          if (c === "\r" && text[i + 1] === "\n") i++;
          row.push(field); field = "";
          if (row.some(function (f) { return f !== ""; })) rows.push(row);
          row = [];
        } else {
          field += c;
        }
      }
      row.push(field);
      if (row.some(function (f) { return f !== ""; })) rows.push(row);
      return rows;
    }
    function toJson() {
      var rows = parseCSV(inputEl.value);
      if (rows.length < 2) { setMsg("⚠️ Need a header row plus at least one data row.", false); return; }
      var headers = rows[0].map(function (h) { return h.trim(); });
      var out = rows.slice(1).map(function (r) {
        var o = {};
        headers.forEach(function (h, i) { o[h] = r[i] !== undefined ? r[i] : ""; });
        return o;
      });
      outputEl.value = JSON.stringify(out, null, 2);
      setMsg("✅ Converted " + out.length + " row" + (out.length === 1 ? "" : "s") + " → JSON.", true);
    }
    function toCsv() {
      var data;
      try { data = JSON.parse(inputEl.value); } catch (e) { setMsg("⚠️ Invalid JSON: " + e.message, false); return; }
      if (!Array.isArray(data) || !data.length) { setMsg("⚠️ Expected an array of objects.", false); return; }
      var headers = [];
      data.forEach(function (o) {
        Object.keys(o).forEach(function (k) { if (headers.indexOf(k) === -1) headers.push(k); });
      });
      function escCell(v) {
        var s = v === null || v === undefined ? "" : String(v);
        return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }
      var lines = [headers.map(escCell).join(",")];
      data.forEach(function (o) {
        lines.push(headers.map(function (h) { return escCell(o[h]); }).join(","));
      });
      outputEl.value = lines.join("\n");
      setMsg("✅ Converted " + data.length + " object" + (data.length === 1 ? "" : "s") + " → CSV.", true);
    }
    box.querySelector("#tojson").addEventListener("click", toJson);
    box.querySelector("#tocsv").addEventListener("click", toCsv);
    box.querySelector("#swap").addEventListener("click", function () {
      var t = inputEl.value;
      inputEl.value = outputEl.value;
      outputEl.value = t;
    });
    box.querySelector("#copy").addEventListener("click", function () {
      if (!outputEl.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied";
        setTimeout(function () { b.textContent = "📋 Copy output"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outputEl.value).then(done, done);
      } else {
        outputEl.select();
        try { document.execCommand("copy"); } catch (e) {}
        done();
      }
    });
  }
});