ToolBox.define("case-converter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<label class="section-sub" style="margin-bottom:8px; display:block;"><strong>Your text</strong></label>'
      + '<textarea id="input" placeholder="Type or paste text here…" aria-label="Input text"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<button class="btn" data-case="upper">UPPERCASE</button>'
      + '<button class="btn" data-case="lower">lowercase</button>'
      + '<button class="btn" data-case="title">Title Case</button>'
      + '<button class="btn" data-case="sentence">Sentence case</button>'
      + '<button class="btn" data-case="camel">camelCase</button>'
      + '<button class="btn" data-case="pascal">PascalCase</button>'
      + '<button class="btn" data-case="kebab">kebab-case</button>'
      + '<button class="btn" data-case="snake">snake_case</button>'
      + "</div>"
      + '<label class="section-sub" style="margin:16px 0 8px; display:block;"><strong>Result</strong></label>'
      + '<textarea id="output" readonly placeholder="Converted text appears here…" aria-label="Result text"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<button id="copy" class="btn primary">📋 Copy result</button>'
      + '<button id="swap" class="btn ghost">⇄ Swap input / output</button>'
      + "</div></div>";

    var input = box.querySelector("#input");
    var output = box.querySelector("#output");

    function words(s) {
      return s.split(/[^a-zA-Z0-9]+|(?<=[a-z0-9])(?=[A-Z])/).filter(Boolean);
    }
    function convert(s, kind) {
      if (!s) return "";
      switch (kind) {
        case "upper": return s.toUpperCase();
        case "lower": return s.toLowerCase();
        case "title":
          return s.toLowerCase().split(/\s+/).map(function (w) {
            return w ? w[0].toUpperCase() + w.slice(1) : w;
          }).join(" ");
        case "sentence":
          return s.toLowerCase().replace(/(^\s*[a-z]|(?<=[.!?]\s+)[a-z])/g, function (c) { return c.toUpperCase(); });
        case "camel": {
          var ws = words(s);
          return ws.map(function (w, i) {
            w = w.toLowerCase();
            return i === 0 ? w : w[0].toUpperCase() + w.slice(1);
          }).join("");
        }
        case "pascal": {
          var pw = words(s);
          return pw.map(function (w) {
            w = w.toLowerCase();
            return w[0].toUpperCase() + w.slice(1);
          }).join("");
        }
        case "kebab": return words(s).join("-").toLowerCase();
        case "snake": return words(s).join("_").toLowerCase();
        default: return s;
      }
    }

    box.querySelectorAll("[data-case]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        output.value = convert(input.value, btn.dataset.case);
      });
    });

    box.querySelector("#copy").addEventListener("click", function () {
      if (!output.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy result"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(output.value).then(done, function () { fallback(); done(); });
      } else { fallback(); done(); }
      function fallback() { output.focus(); output.select(); try { document.execCommand("copy"); } catch (e) {} }
    });

    box.querySelector("#swap").addEventListener("click", function () {
      var tmp = input.value;
      input.value = output.value;
      output.value = tmp;
    });
  }
});