ToolBox.define("html-entity", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<textarea id="input" placeholder="Paste text or HTML here…" aria-label="Input"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<button id="encode" class="btn primary">🔒 Encode</button>'
      + '<button id="decode" class="btn">🔓 Decode</button>'
      + '<label><input type="checkbox" id="all"> Encode all non-ASCII (e.g. é → &amp;#233;)</label>'
      + "</div>"
      + '<textarea id="output" readonly placeholder="Result appears here…" aria-label="Output" style="margin-top:12px;"></textarea>'
      + '<div class="controls" style="margin-top:16px;"><button id="copy" class="btn">📋 Copy result</button></div>'
      + "</div>";

    var MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

    box.querySelector("#encode").addEventListener("click", function () {
      var v = box.querySelector("#input").value;
      var s = v.replace(/[&<>"']/g, function (c) { return MAP[c]; });
      if (box.querySelector("#all").checked) {
        s = s.replace(/[^\x00-\x7F]/g, function (c) { return "&#" + c.codePointAt(0) + ";"; });
      }
      box.querySelector("#output").value = s;
    });

    box.querySelector("#decode").addEventListener("click", function () {
      var v = box.querySelector("#input").value;
      var el = document.createElement("textarea");
      el.innerHTML = v; // browser decodes named + numeric entities safely
      box.querySelector("#output").value = el.value;
    });

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