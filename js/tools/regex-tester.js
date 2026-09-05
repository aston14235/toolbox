ToolBox.define("regex-tester", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label for="pat">Pattern</label><input type="text" id="pat" placeholder="e.g. \\d+" value="\\b\\w{5,}\\b"></div>'
      + '<div class="field"><label for="flags">Flags</label><input type="text" id="flags" placeholder="g i m s u" value="g"></div>'
      + "</div>"
      + '<label class="section-sub" style="margin:6px 0 8px; display:block;"><strong>Test text</strong></label>'
      + '<textarea id="text" placeholder="Text to test against…" aria-label="Test text">The quick brown fox jumps over 42 lazy dogs at 7:00 AM.</textarea>'
      + '<div id="status" class="note-box" style="margin-top:14px;"></div>'
      + '<div id="matches"></div>'
      + '<label class="section-sub" style="margin:16px 0 8px; display:block;"><strong>Replace with</strong> <span class="muted small">(use $1 for group 1)</span></label>'
      + '<div class="controls">'
      + '<input type="text" id="repl" placeholder="replacement" style="flex:1; min-width:180px; padding:10px 12px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);">'
      + '<button id="do-replace" class="btn">🔁 Replace</button>'
      + "</div>"
      + '<textarea id="replaced" readonly class="mono" style="min-height:100px;" aria-label="Replaced text"></textarea>'
      + "</div>";

    var patEl = box.querySelector("#pat");
    var flagsEl = box.querySelector("#flags");
    var textEl = box.querySelector("#text");
    var statusEl = box.querySelector("#status");
    var matchesEl = box.querySelector("#matches");
    var replEl = box.querySelector("#repl");
    var replacedEl = box.querySelector("#replaced");

    function compile() {
      try {
        return new RegExp(patEl.value, flagsEl.value);
      } catch (e) {
        return null;
      }
    }

    function run() {
      var re = compile();
      var text = textEl.value;
      if (!re) {
        statusEl.textContent = "❌ Invalid pattern";
        statusEl.style.color = "var(--danger)";
        matchesEl.innerHTML = "";
        return;
      }
      var g = flagsEl.value.indexOf("g") !== -1;
      var matches = [];
      var m;
      while ((m = re.exec(text)) !== null) {
        matches.push({ text: m[0], index: m.index });
        if (!g) break;
        if (m[0] === "") re.lastIndex++;
      }
      statusEl.textContent = matches.length + (matches.length === 1 ? " match" : " matches") + " · pattern: /" + patEl.value + "/" + flagsEl.value;
      statusEl.style.color = "var(--ok)";
      if (!matches.length) { matchesEl.innerHTML = ""; return; }
      var html = '<table class="data" style="margin-top:12px;"><thead><tr><th>#</th><th>Match</th><th>Position</th></tr></thead><tbody>';
      matches.forEach(function (m, i) {
        var shown = m.text.length > 60 ? m.text.slice(0, 60) + "…" : m.text;
        html += "<tr><td>" + (i + 1) + "</td><td><code>" + ToolBox.esc(shown) + "</code></td><td>" + m.index + "</td></tr>";
      });
      matchesEl.innerHTML = html + "</tbody></table>";
    }

    function doReplace() {
      var re = compile();
      if (!re) return;
      replacedEl.value = textEl.value.replace(re, replEl.value);
    }

    ["input", "change"].forEach(function (ev) {
      patEl.addEventListener(ev, run);
      flagsEl.addEventListener(ev, run);
      textEl.addEventListener(ev, run);
    });
    box.querySelector("#do-replace").addEventListener("click", doReplace);
    run();
  }
});