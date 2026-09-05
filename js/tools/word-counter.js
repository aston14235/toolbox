ToolBox.define("word-counter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<textarea id="text" placeholder="Paste your text here to count it…" aria-label="Text to count"></textarea>'
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="words">0</div><div class="label">Words</div></div>'
      + '<div class="stat"><div class="num" id="chars">0</div><div class="label">Characters</div></div>'
      + '<div class="stat"><div class="num" id="chars-nospace">0</div><div class="label">Chars (no spaces)</div></div>'
      + '<div class="stat"><div class="num" id="sentences">0</div><div class="label">Sentences</div></div>'
      + '<div class="stat"><div class="num" id="paragraphs">0</div><div class="label">Paragraphs</div></div>'
      + '<div class="stat"><div class="num" id="reading">0 min</div><div class="label">Reading time</div></div>'
      + '<div class="stat"><div class="num" id="speaking">0 min</div><div class="label">Speaking time</div></div>'
      + "</div></div>";

    var ta = box.querySelector("#text");
    function update() {
      var v = ta.value;
      var words = v.trim() ? v.trim().split(/\s+/).length : 0;
      box.querySelector("#words").textContent = words.toLocaleString();
      box.querySelector("#chars").textContent = v.length.toLocaleString();
      box.querySelector("#chars-nospace").textContent = v.replace(/\s/g, "").length.toLocaleString();
      var sentences = v.trim() ? (v.trim().match(/[^.!?]+[.!?]+["']?\s*|[^.!?]+$/g) || []).length : 0;
      box.querySelector("#sentences").textContent = sentences.toLocaleString();
      var paragraphs = v.trim() ? v.trim().split(/\n\s*\n/).filter(function (p) { return p.trim(); }).length : 0;
      box.querySelector("#paragraphs").textContent = paragraphs.toLocaleString();
      box.querySelector("#reading").textContent = (words ? Math.max(1, Math.ceil(words / 200)) : 0) + " min";
      box.querySelector("#speaking").textContent = (words ? Math.max(1, Math.ceil(words / 130)) : 0) + " min";
    }
    ta.addEventListener("input", update);
    update();
  }
});