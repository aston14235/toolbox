ToolBox.define("rhyme-finder", {
  styles: ".rhyme-list { display:flex; flex-wrap:wrap; gap:8px; } .rhyme-chip { padding:7px 14px; border-radius:999px; border:1px solid var(--border); background:var(--bg); font-size:.9rem; font-weight:600; } .rhyme-chip.exact { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }",
  render: function (box) {
    // A compact dictionary of common words grouped by their rhyme tail.
    var DICT = {
      "at": ["bat", "cat", "chat", "fat", "flat", "hat", "mat", "pat", "rat", "sat", "that"],
      "ay": ["bay", "day", "gay", "gray", "hay", "lay", "may", "pay", "play", "pray", "say", "stay", "tray", "way"],
      "ight": ["bright", "fight", "flight", "knight", "light", "might", "night", "right", "sight", "tight", "white"],
      "ake": ["bake", "cake", "fake", "flake", "lake", "make", "quake", "rake", "shake", "take", "wake"],
      "ell": ["bell", "fell", "hell", "sell", "shell", "smell", "spell", "tell", "well", "yell"],
      "ing": ["bring", "cling", "king", "ring", "sing", "spring", "sting", "string", "swing", "thing", "wing"],
      "ine": ["dine", "fine", "line", "mine", "nine", "pine", "shine", "sign", "wine"],
      "one": ["bone", "cone", "phone", "stone", "throne", "alone"],
      "eet": ["feet", "meet", "neat", "sweet", "treat"],
      "own": ["brown", "clown", "crown", "down", "frown", "gown", "town"],
      "eed": ["breed", "deed", "feed", "indeed", "need", "seed", "weed"],
      "ick": ["brick", "chick", "click", "kick", "lick", "pick", "quick", "sick", "stick", "thick", "trick"],
      "ip": ["chip", "clip", "dip", "flip", "grip", "hip", "lip", "rip", "ship", "skip", "tip", "trip"],
      "op": ["chop", "crop", "drop", "flop", "hop", "mop", "pop", "shop", "stop", "top"],
      "un": ["bun", "fun", "gun", "nun", "run", "sun"],
      "all": ["ball", "call", "fall", "hall", "mall", "small", "tall", "wall"],
      "eam": ["beam", "cream", "dream", "scream", "seem", "stream", "team"],
      "ale": ["fail", "hail", "mail", "nail", "pale", "sale", "sail", "tail", "whale"],
      "ock": ["block", "clock", "dock", "flock", "knock", "lock", "rock", "shock", "sock"],
      "ar": ["bar", "car", "far", "guitar", "jar", "star"],
      "end": ["bend", "friend", "lend", "mend", "send", "spend", "tend"],
      "ook": ["book", "cook", "hook", "look", "took"],
      "oom": ["boom", "broom", "gloom", "room"],
      "eep": ["beep", "cheap", "creep", "deep", "keep", "leap", "sheep", "sleep", "sweep"],
      "ill": ["bill", "chill", "fill", "hill", "kill", "mill", "pill", "skill", "still", "will"],
      "ate": ["create", "date", "fate", "gate", "great", "late", "mate", "plate", "rate", "state", "wait"],
      "ow": ["blow", "bow", "crow", "flow", "glow", "grow", "know", "low", "show", "snow", "throw", "window"],
      "e": ["be", "free", "he", "key", "me", "sea", "she", "tea", "three", "tree", "we"],
      "oo": ["blue", "canoe", "do", "goo", "shoe", "to", "true", "two", "who", "you"]
    };
    var TAILS = Object.keys(DICT);

    function tailOf(word) {
      var w = word.toLowerCase().replace(/[^a-z]/g, "");
      if (!w) return null;
      // prefer a known dictionary tail if it ends the word
      for (var i = 0; i < TAILS.length; i++) {
        if (w.length > TAILS[i].length && w.endsWith(TAILS[i])) return TAILS[i];
      }
      return null;
    }

    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Word to rhyme</label>'
      + '<input type="text" id="word" placeholder="e.g. cat, night, dream…" style="padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text); font-size:1.05rem;"></div>'
      + '<div id="results"></div>'
      + '<p class="note-box">Rhymes match by ending sound, so <em>cat</em> finds <em>hat</em>, <em>flat</em>, <em>that</em>… If a word isn\u2019t in the built-in dictionary, try a different spelling or a shorter word.</p>'
      + "</div>";

    function update() {
      var word = box.querySelector("#word").value.trim();
      var res = box.querySelector("#results");
      if (!word) { res.innerHTML = ""; return; }
      var tail = tailOf(word);
      if (!tail) {
        res.innerHTML = '<p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">No rhyme family found for \u201C' + ToolBox.esc(word) + "\u201D — try a common English word.</p>";
        return;
      }
      var rhymes = DICT[tail].filter(function (w) { return w !== word.toLowerCase(); });
      if (!rhymes.length) {
        res.innerHTML = "<p>No rhymes in the dictionary for \u201C" + ToolBox.esc(word) + "\u201D (family: \u201C" + tail + "\u201D).</p>";
        return;
      }
      res.innerHTML =
        '<div class="stats" style="margin-top:0;">'
        + '<div class="stat"><div class="num">' + rhymes.length + '</div><div class="label">Rhymes found</div></div>'
        + '<div class="stat"><div class="num" style="font-size:1rem;">“' + tail + '”</div><div class="label">Rhyme family</div></div>'
        + "</div>"
        + '<div class="rhyme-list" style="margin-top:14px;">' + rhymes.map(function (w) { return '<span class="rhyme-chip exact">' + w + "</span>"; }).join("") + "</div>";
    }

    box.querySelector("#word").addEventListener("input", update);
    box.querySelector("#word").value = "night";
    update();
  }
});