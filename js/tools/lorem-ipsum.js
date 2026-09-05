ToolBox.define("lorem-ipsum", {
  render: function (box) {
    var WORDS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"];
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Paragraphs <input type="number" id="paras" min="1" max="20" value="3" style="width:70px; padding:9px 10px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);"></label>'
      + '<label>Words per paragraph <input type="number" id="words" min="5" max="200" value="40" style="width:80px; padding:9px 10px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);"></label>'
      + '<button id="generate" class="btn primary">✨ Generate</button>'
      + '<button id="copy" class="btn">📋 Copy</button>'
      + "</div>"
      + '<textarea id="output" readonly aria-label="Generated placeholder text"></textarea>'
      + "</div>";

    function generate() {
      var p = Math.min(20, Math.max(1, Number(box.querySelector("#paras").value) || 1));
      var n = Math.min(200, Math.max(5, Number(box.querySelector("#words").value) || 40));
      var paras = [];
      for (var i = 0; i < p; i++) {
        var sentenceCount = Math.max(1, Math.round(n / 12));
        var sentences = [];
        for (var j = 0; j < sentenceCount; j++) {
          var len = 6 + Math.floor(Math.random() * 8);
          var ws = [];
          for (var k = 0; k < len; k++) ws.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
          var s = ws.join(" ");
          s = s.charAt(0).toUpperCase() + s.slice(1) + ".";
          sentences.push(s);
        }
        paras.push(sentences.join(" "));
      }
      box.querySelector("#output").value = paras.join("\n\n");
    }
    box.querySelector("#generate").addEventListener("click", generate);
    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#output");
      if (!o.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(o.value).then(done, function () { o.select(); done(); });
      } else { o.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    generate();
  }
});