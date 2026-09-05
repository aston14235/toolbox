ToolBox.define("coin-flipper", {
  styles: ".coin { width: 150px; height: 150px; margin: 24px auto 8px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fbbf24, #d97706 70%); border: 4px solid #92400e; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 800; color: #78350f; box-shadow: 0 10px 26px rgba(0,0,0,.3); user-select: none; } .coin.tails { background: radial-gradient(circle at 35% 30%, #e2e8f0, #94a3b8 70%); border-color: #475569; color: #334155; } .coin-result { text-align: center; font-size: 1.15rem; font-weight: 700; min-height: 1.6em; }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body center">'
      + '<div class="coin" id="coin">?</div>'
      + '<div class="coin-result" id="result">Press flip!</div>'
      + '<div class="controls" style="justify-content:center; margin-top:10px;"><button id="flip" class="btn primary">🪙 Flip</button></div>'
      + '<div class="stats" style="max-width:420px; margin-inline:auto;">'
      + '<div class="stat"><div class="num" id="flips">0</div><div class="label">Total flips</div></div>'
      + '<div class="stat"><div class="num" id="heads">0</div><div class="label">Heads</div></div>'
      + '<div class="stat"><div class="num" id="tails">0</div><div class="label">Tails</div></div>'
      + "</div></div>";

    var coinEl = box.querySelector("#coin");
    var resultEl = box.querySelector("#result");
    var flips = 0, heads = 0, tails = 0;
    var flipping = false;

    function updateStats() {
      box.querySelector("#flips").textContent = flips;
      box.querySelector("#heads").textContent = heads + (flips ? " (" + Math.round(heads / flips * 100) + "%)" : "");
      box.querySelector("#tails").textContent = tails + (flips ? " (" + Math.round(tails / flips * 100) + "%)" : "");
    }

    // Keep a reference to the animation — an unreferenced Animation from
    // element.animate() can be garbage-collected mid-flight, and then its
    // onfinish never fires (flips silently stall). Drive the state update from
    // a timeout instead so the flip ALWAYS completes.
    var currentAnim = null;
    box.querySelector("#flip").addEventListener("click", function () {
      if (flipping) return;
      flipping = true;
      var isHeads = Math.random() < 0.5;
      currentAnim = coinEl.animate(
        [{ transform: "rotateY(0deg)" }, { transform: "rotateY(1440deg)" }],
        { duration: 700, easing: "ease-out" }
      );
      setTimeout(function () {
        coinEl.classList.toggle("tails", !isHeads);
        coinEl.textContent = isHeads ? "H" : "T";
        resultEl.textContent = isHeads ? "🦅 Heads!" : "🪙 Tails!";
        flips++;
        if (isHeads) heads++; else tails++;
        updateStats();
        flipping = false;
      }, 700);
    });
    updateStats();
  }
});