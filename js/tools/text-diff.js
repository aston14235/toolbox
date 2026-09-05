ToolBox.define("text-diff", {
  styles: ".diff-out { margin-top: 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; overflow: auto; max-height: 420px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12.5px; line-height: 1.6; } .diff-out .row { padding: 1px 12px; white-space: pre-wrap; word-break: break-all; } .diff-out .add { background: rgba(34, 197, 94, 0.16); } .diff-out .del { background: rgba(239, 68, 68, 0.16); } .diff-out .marker { display: inline-block; width: 1.4em; user-select: none; opacity: 0.7; }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div><label class="section-sub" style="display:block; margin-bottom:8px;"><strong>Original</strong></label>'
      + '<textarea id="a" placeholder="Paste the original text…" aria-label="Original text"></textarea></div>'
      + '<div><label class="section-sub" style="display:block; margin-bottom:8px;"><strong>Changed</strong></label>'
      + '<textarea id="b" placeholder="Paste the changed text…" aria-label="Changed text"></textarea></div>'
      + "</div>"
      + '<div class="controls" style="margin-top:14px;">'
      + '<button id="diff" class="btn primary">🔍 Compare</button>'
      + '<span id="stats" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<div id="out" class="diff-out"></div>'
      + "</div>";

    var aEl = box.querySelector("#a");
    var bEl = box.querySelector("#b");
    var outEl = box.querySelector("#out");
    var statsEl = box.querySelector("#stats");
    var MAX_LINES = 600;

    function split(v) { return v.replace(/\r\n/g, "\n").split("\n"); }

    function lcs(a, b) {
      var n = a.length, m = b.length;
      var dp = [];
      for (var i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); }
      for (i = n - 1; i >= 0; i--) {
        for (var j = m - 1; j >= 0; j--) {
          dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
      var ops = [];
      i = 0; j = 0;
      while (i < n && j < m) {
        if (a[i] === b[j]) { ops.push({ t: "eq", text: a[i] }); i++; j++; }
        else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: "del", text: a[i] }); i++; }
        else { ops.push({ t: "add", text: b[j] }); j++; }
      }
      while (i < n) { ops.push({ t: "del", text: a[i] }); i++; }
      while (j < m) { ops.push({ t: "add", text: b[j] }); j++; }
      return ops;
    }

    function run() {
      var aLines = split(aEl.value);
      var bLines = split(bEl.value);
      var truncated = aLines.length > MAX_LINES || bLines.length > MAX_LINES;
      if (truncated) {
        aLines = aLines.slice(0, MAX_LINES);
        bLines = bLines.slice(0, MAX_LINES);
      }
      if (!aLines.length && !bLines.length) { outEl.innerHTML = ""; statsEl.textContent = ""; return; }
      var ops = lcs(aLines, bLines);
      var adds = 0, dels = 0, eqs = 0;
      var html = "";
      ops.forEach(function (op) {
        if (op.t === "add") { adds++; html += '<div class="row add"><span class="marker">+</span>' + ToolBox.esc(op.text) + "</div>"; }
        else if (op.t === "del") { dels++; html += '<div class="row del"><span class="marker">−</span>' + ToolBox.esc(op.text) + "</div>"; }
        else { eqs++; html += '<div class="row"><span class="marker"> </span>' + ToolBox.esc(op.text) + "</div>"; }
      });
      outEl.innerHTML = html + (truncated ? '<div class="row" style="color:var(--muted);">…diff truncated at ' + MAX_LINES + " lines</div>" : "");
      statsEl.textContent = adds + " added · " + dels + " removed · " + eqs + " unchanged";
    }

    box.querySelector("#diff").addEventListener("click", run);
    run();
  }
});