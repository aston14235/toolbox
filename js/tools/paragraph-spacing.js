ToolBox.define("paragraph-spacing", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<textarea id="input" placeholder="Paste text with messy line breaks…" aria-label="Input text"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<label>Spacing between paragraphs <select id="spacing">'
      + '<option value="1">Single (1 blank line)</option>'
      + '<option value="2">Double (2 blank lines)</option>'
      + '<option value="3">Triple (3 blank lines)</option>'
      + '<option value="0">None (paragraphs run together)</option>'
      + "</select></label>"
      + '<button id="apply" class="btn primary">✨ Apply</button>'
      + '<span id="report" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<label class="section-sub" style="display:block; margin:6px 0 8px;"><strong>Result</strong></label>'
      + '<textarea id="output" readonly aria-label="Result text"></textarea>'
      + '<div class="controls" style="margin-top:16px;"><button id="copy" class="btn">📋 Copy result</button></div>'
      + '<p class="note-box">Each paragraph is trimmed and rejoined with the spacing you choose — loose line breaks inside paragraphs are collapsed into single lines.</p>'
      + "</div>";

    function apply() {
      var v = box.querySelector("#input").value;
      var n = Number(box.querySelector("#spacing").value);
      var paras = v.split(/\n\s*\n/).map(function (p) {
        return p.split("\n").map(function (l) { return l.trim(); }).filter(Boolean).join(" ");
      }).filter(Boolean);
      var sep = "\n".repeat(n + 1);
      box.querySelector("#output").value = paras.join(sep);
      box.querySelector("#report").textContent = paras.length + " paragraph" + (paras.length === 1 ? "" : "s");
      box.querySelector("#report").style.color = "var(--muted)";
    }

    box.querySelector("#apply").addEventListener("click", apply);
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