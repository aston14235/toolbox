ToolBox.define("stop-word-filter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<textarea id="input" placeholder="Paste your text or keyword list — one word per line works great…" aria-label="Input text"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<label>Extra stop words (comma-separated) <input type="text" id="extra" placeholder="e.g. thing, stuff" style="padding:9px 12px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);"></label>'
      + '<button id="filter" class="btn primary">🧹 Filter stop words</button>'
      + '<span id="report" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<label class="section-sub" style="display:block; margin:6px 0 8px;"><strong>Filtered</strong></label>'
      + '<textarea id="output" readonly aria-label="Filtered text"></textarea>'
      + '<div class="controls" style="margin-top:16px;"><button id="copy" class="btn">📋 Copy result</button></div>'
      + '<p class="note-box">Removes common English stop words (the, and, is, a, of…) — handy for keyword lists, tags and search analysis.</p>'
      + "</div>";

    var STOP = new Set(("a about above after again against all am an and any are aren't as at be because been before being below between both but by can can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's me more most mustn't my myself no nor not now of off on once only or other ought our ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through to too under until up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while who who's whom why why's will with won't would wouldn't you you'd you'll you're you've your yours yourself yourselves").split(" "));

    function run() {
      var v = box.querySelector("#input").value;
      var extra = box.querySelector("#extra").value.split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
      var stop = new Set(STOP);
      extra.forEach(function (w) { stop.add(w); });
      var lines = v.split("\n");
      var removed = 0;
      var out = lines.map(function (line) {
        return line.replace(/[a-z']+/gi, function (word) {
          var lower = word.toLowerCase();
          if (stop.has(lower)) { removed++; return ""; }
          return word;
        });
      }).join("\n").replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/[ ,]+$/gm, "");
      box.querySelector("#output").value = out.trim();
      var r = box.querySelector("#report");
      r.textContent = removed ? "Removed " + removed + " stop " + (removed === 1 ? "word" : "words") : "No stop words found";
      r.style.color = removed ? "var(--accent)" : "var(--ok)";
    }

    box.querySelector("#filter").addEventListener("click", run);
    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#output");
      if (!o.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy result"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(o.value).then(done, done);
      } else { o.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
  }
});