ToolBox.define("riddle-generator", {
  render: function (box) {
    var RIDDLES = [
      { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An echo" },
      { q: "The more of me you take, the more you leave behind. What am I?", a: "Footsteps" },
      { q: "What has keys but can't open locks?", a: "A piano" },
      { q: "What gets wetter the more it dries?", a: "A towel" },
      { q: "I have cities, but no houses; forests, but no trees; water, but no fish. What am I?", a: "A map" },
      { q: "What has a head, a tail, but no body?", a: "A coin" },
      { q: "The more you take away from me, the bigger I get. What am I?", a: "A hole" },
      { q: "What runs around all day but never gets tired?", a: "Water in a river (or a clock)" },
      { q: "What has one eye but cannot see?", a: "A needle" },
      { q: "What goes up but never comes down?", a: "Your age" },
      { q: "I am not alive, but I grow; I don't have lungs, but I need air. What am I?", a: "Fire" },
      { q: "What can you catch but never throw?", a: "A cold" },
      { q: "What has many teeth but cannot bite?", a: "A comb" },
      { q: "What is full of holes but still holds water?", a: "A sponge" },
      { q: "What gets broken without being held?", a: "A promise" },
      { q: "The person who makes it doesn't need it; the person who buys it doesn't use it; the person who uses it can't see it. What is it?", a: "A coffin" },
      { q: "What has hands but can't clap?", a: "A clock" },
      { q: "What runs around a yard but never moves?", a: "A fence" },
      { q: "What can travel around the world while staying in a corner?", a: "A stamp" },
      { q: "What has a neck but no head?", a: "A bottle" },
      { q: "What begins with T, ends with T, and has T in it?", a: "A teapot" },
      { q: "What word is spelled incorrectly in every dictionary?", a: "Incorrectly" },
      { q: "What has four letters, sometimes has nine, but never has five?", a: "The words: what (4), sometimes (9), never (5)" },
      { q: "I have no life, but I can die. What am I?", a: "A battery" },
      { q: "What kind of room has no doors or windows?", a: "A mushroom" }
    ];
    box.innerHTML =
      '<div class="tool-body center">'
      + '<div class="controls" style="justify-content:center;"><button id="next" class="btn primary">🤔 Next riddle</button></div>'
      + '<div id="q" style="font-size:1.15rem; font-weight:600; max-width:560px; margin-inline:auto; min-height:4em; display:flex; align-items:center; justify-content:center;">—</div>'
      + '<div class="controls" style="justify-content:center;"><button id="reveal" class="btn">💡 Reveal answer</button></div>'
      + '<div id="a" class="note-box hidden" style="max-width:480px; margin-inline:auto;"></div>'
      + "</div>";

    var qEl = box.querySelector("#q");
    var aEl = box.querySelector("#a");
    var revealBtn = box.querySelector("#reveal");
    var last = -1;

    function next() {
      var i;
      do { i = Math.floor(Math.random() * RIDDLES.length); } while (i === last && RIDDLES.length > 1);
      last = i;
      qEl.textContent = RIDDLES[i].q;
      aEl.textContent = RIDDLES[i].a;
      aEl.classList.add("hidden");
      revealBtn.textContent = "💡 Reveal answer";
    }
    box.querySelector("#next").addEventListener("click", next);
    revealBtn.addEventListener("click", function () {
      if (aEl.classList.contains("hidden")) {
        aEl.classList.remove("hidden");
        revealBtn.textContent = "🙈 Hide answer";
      } else {
        aEl.classList.add("hidden");
        revealBtn.textContent = "💡 Reveal answer";
      }
    });
    next();
  }
});