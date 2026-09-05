ToolBox.define("text-to-speech", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<textarea id="text" placeholder="Type or paste text to read aloud…" aria-label="Text to speak">Hello! This is ToolBox text to speech. Paste anything here and press speak.</textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<label>Voice <select id="voice"></select></label>'
      + '<label>Rate <input type="range" id="rate" min="0.5" max="2" step="0.1" value="1"> <span id="rate-label">1×</span></label>'
      + '<label>Pitch <input type="range" id="pitch" min="0" max="2" step="0.1" value="1"></label>'
      + "</div>"
      + '<div class="controls">'
      + '<button id="speak" class="btn primary">🔊 Speak</button>'
      + '<button id="stop" class="btn">⏹️ Stop</button>'
      + "</div>"
      + '<p class="note-box">Uses your browser\'s built-in speech synthesis — no audio is ever uploaded. Voice availability depends on your operating system.</p>'
      + "</div>";

    var voiceSel = box.querySelector("#voice");
    var rateEl = box.querySelector("#rate");
    var pitchEl = box.querySelector("#pitch");

    function loadVoices() {
      var voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
      if (!voices.length) {
        voiceSel.innerHTML = '<option value="">Default voice</option>';
        return;
      }
      voiceSel.innerHTML = "";
      voices.forEach(function (v, i) {
        var o = document.createElement("option");
        o.value = i;
        o.textContent = v.name + " (" + v.lang + ")";
        voiceSel.appendChild(o);
      });
    }
    loadVoices();
    if (window.speechSynthesis) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    rateEl.addEventListener("input", function () { box.querySelector("#rate-label").textContent = Number(rateEl.value).toFixed(1) + "×"; });

    box.querySelector("#speak").addEventListener("click", function () {
      if (!("speechSynthesis" in window)) { window.alert("Speech synthesis is not supported in this browser."); return; }
      var text = box.querySelector("#text").value.trim();
      if (!text) return;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var voices = speechSynthesis.getVoices();
      if (voices.length && voiceSel.value !== "") u.voice = voices[Number(voiceSel.value)];
      u.rate = Number(rateEl.value);
      u.pitch = Number(pitchEl.value);
      speechSynthesis.speak(u);
    });
    box.querySelector("#stop").addEventListener("click", function () {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    });
  }
});