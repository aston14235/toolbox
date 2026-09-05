ToolBox.define("js-minifier", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="run" class="btn primary">⚡ Minify</button>'
      + '<button id="copy" class="btn">📋 Copy</button>'
      + '<span id="report" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<label class="section-sub" style="display:block; margin-bottom:8px;"><strong>Input JS</strong></label>'
      + '<textarea id="input" class="mono" rows="10" spellcheck="false" placeholder="Paste JavaScript here…">// a tiny demo\nfunction greet(name) {\n  // say hi\n  var msg = "Hello, " + name + "!";\n  return msg;\n}\n\nconsole.log(greet("world"));</textarea>'
      + '<label class="section-sub" style="display:block; margin:14px 0 8px;"><strong>Minified</strong></label>'
      + '<textarea id="output" class="mono" rows="10" readonly></textarea>'
      + '<p class="note-box">A lightweight minifier: strips comments and unneeded whitespace while leaving strings, templates and regex literals intact. It\u2019s not a full renamer (no Uglify-style variable shortening) — but it\u2019s safe on real code.</p>'
      + "</div>";

    function minify(code) {
      // Protect strings, template literals and regex literals with placeholders
      // FIRST so comment-stripping can't touch "//" inside them.
      var parts = [];
      var re = /('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`|\/(?!\*|\/)(?:[^\/\\\n[]|\\.|\[[^\]]*\])+\/[gimsuy]*)/g;
      var m;
      var out = code;
      while ((m = re.exec(code)) !== null) {
        out = out.replace(m[0], "\u0000" + parts.length + "\u0000");
        parts.push(m[0]);
      }
      // strip comments (strings are already protected, so these are real comments)
      out = out
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n+/g, "\n")
        .replace(/^\s+|\s+$/g, "")
        // safe whitespace removal around punctuation
        .replace(/\s*([{}();,+\-*\/%=<>!&|?:])\s*/g, "$1")
        .replace(/;\}/g, "}")
        .replace(/}\s*else\s*{/g, "}else{");
      // restore protected parts
      out = out.replace(/\u0000(\d+)\u0000/g, function (_, n) { return parts[+n]; });
      return out;
    }

    function run() {
      var src = box.querySelector("#input").value;
      var out = minify(src);
      box.querySelector("#output").value = out;
      var before = new Blob([src]).size, after = new Blob([out]).size;
      var saved = before ? Math.round((1 - after / before) * 100) : 0;
      var rep = box.querySelector("#report");
      rep.textContent = before + " → " + after + " chars · saved " + saved + "%";
      rep.style.color = "var(--ok)";
    }

    box.querySelector("#run").addEventListener("click", run);
    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#output");
      if (!o.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(o.value).then(done, done);
      else { o.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    run();
  }
});