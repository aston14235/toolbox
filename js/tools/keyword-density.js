ToolBox.define("keyword-density", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<textarea id="text" placeholder="Paste your text here to analyze keyword density…" aria-label="Text to analyze"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<label>Top <input type="number" id="limit" min="5" max="50" value="15" style="width:70px; padding:9px 10px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);"></label>'
      + '<button id="run" class="btn primary">🔍 Analyze</button>'
      + "</div>"
      + '<div id="results"></div>'
      + "</div>";

    function analyze() {
      var v = box.querySelector("#text").value.trim();
      var out = box.querySelector("#results");
      if (!v) { out.innerHTML = ""; return; }
      var limit = Math.min(50, Math.max(5, Number(box.querySelector("#limit").value) || 15));
      var counts = {};
      var total = 0;
      v.toLowerCase().match(/[a-z0-9']+/g).forEach(function (w) {
        counts[w] = (counts[w] || 0) + 1;
        total++;
      });
      var rows = Object.keys(counts).map(function (w) { return { w: w, n: counts[w] }; })
        .sort(function (a, b) { return b.n - a.n; }).slice(0, limit);
      var html = '<table class="data" style="margin-top:14px;"><thead><tr><th>Word</th><th>Count</th><th>Density</th></tr></thead><tbody>';
      rows.forEach(function (r) {
        var pct = (r.n / total * 100).toFixed(2);
        var bar = Math.min(100, Math.round(r.n / total * 1000));
        html += "<tr><td><strong>" + ToolBox.esc(r.w) + "</strong></td><td>" + r.n + "</td><td>" + pct + '% <div class="strength-bar" style="margin-top:4px;"><div style="width:' + bar + '%; background:var(--accent);"></div></div></td></tr>';
      });
      html += "</tbody></table>";
      html += '<p class="muted small" style="margin-top:10px;">' + total + " words total</p>";
      out.innerHTML = html;
    }
    box.querySelector("#run").addEventListener("click", analyze);
    box.querySelector("#text").addEventListener("input", analyze);
    analyze();
  }
});