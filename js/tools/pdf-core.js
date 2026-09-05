/* ============================================================
   PdfKit — pure-JS PDF engine (no dependencies)
   Parser: classic xref tables, xref streams (PDF 1.5+), object
   streams, FlateDecode. Writer: clean objects + classic xref.
   Used by the PDF Merger and PDF Splitter tools.
   ============================================================ */
(function () {
  "use strict";

  /* ============ Inflate (RFC 1951) ============ */
  function BitReader(b, start) {
    this.b = b; this.pos = start || 0;
    this.bit = function () {
      if ((this.pos >> 3) >= this.b.length) throw new Error("inflate: unexpected end of stream");
      var v = (this.b[this.pos >> 3] >> (this.pos & 7)) & 1; this.pos++; return v;
    };
    this.bits = function (n) { var v = 0; for (var i = 0; i < n; i++) v |= this.bit() << i; return v; };
  }
  function buildTable(lengths, max) {
    var blCount = new Array(max + 1).fill(0);
    lengths.forEach(function (l) { if (l > 0) blCount[l]++; });
    var nextCode = new Array(max + 1).fill(0), code = 0;
    for (var bits = 1; bits <= max; bits++) { code = (code + blCount[bits - 1]) << 1; nextCode[bits] = code; }
    var table = new Array(1 << max);
    for (var i = 0; i < lengths.length; i++) {
      var len = lengths[i]; if (!len) continue;
      var c = nextCode[len]++;
      for (var rev = 0, k = 0; k < len; k++) rev |= ((c >> k) & 1) << (len - 1 - k);
      table[rev] = { s: i, l: len };
    }
    return { table: table, max: max };
  }
  var FIX_LEN = new Array(288).fill(0);
  (function () {
    for (var i = 0; i < 144; i++) FIX_LEN[i] = 8;
    for (i = 144; i < 256; i++) FIX_LEN[i] = 9;
    for (i = 256; i < 280; i++) FIX_LEN[i] = 7;
    for (i = 280; i < 288; i++) FIX_LEN[i] = 8;
  })();
  var FIX_DIST = new Array(30).fill(5);
  var LEN_BASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  var LEN_EXTRA = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  var DIST_BASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  var DIST_EXTRA = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  function inflate(bytes) {
    // PDF FlateDecode streams are zlib-wrapped (RFC 1950: 2-byte header +
    // Adler-32); ZIP entries are raw deflate (RFC 1951). Detect and skip a
    // zlib header so both decode.
    var start = 0;
    if (bytes.length >= 2 && (bytes[0] & 0x0f) === 8 && (((bytes[0] << 8) | bytes[1]) % 31) === 0) start = 2;
    var br = new BitReader(bytes, start * 8), out = []; // start is in BYTES; BitReader counts BITS
    var litTable = buildTable(FIX_LEN, 9), distTable = buildTable(FIX_DIST, 5);
    var litMax = 9, distMax = 5;
    function decode(tbl, max) {
      var code = 0;
      for (var len = 1; len <= max; len++) {
        code |= br.bit() << (len - 1);
        var e = tbl.table[code];
        if (e && e.l <= len) return e.s;
      }
      throw new Error("Bad Huffman code");
    }
    var done = false;
    while (!done) {
      var bfinal = br.bit(), btype = br.bits(2);
      if (btype === 0) {
        br.pos = (br.pos + 7) & ~7;
        var len = br.bits(16); br.bits(16);
        var base = br.pos >> 3;
        for (var s = 0; s < len; s++) out.push(bytes[base + s]);
        br.pos += len * 8;
      } else if (btype === 1) {
        litTable = buildTable(FIX_LEN, 9); litMax = 9;
        distTable = buildTable(FIX_DIST, 5); distMax = 5;
      } else if (btype === 2) {
        var hlit = br.bits(5) + 257, hdist = br.bits(5) + 1, hclen = br.bits(4) + 4;
        var order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        var clLengths = new Array(19).fill(0);
        for (var ci = 0; ci < hclen; ci++) clLengths[order[ci]] = br.bits(3);
        var clTable = buildTable(clLengths, 7), lengths = [];
        while (lengths.length < hlit + hdist) {
          var sym = decode(clTable, 7);
          if (sym < 16) lengths.push(sym);
          else if (sym === 16) {
            var rep = br.bits(2) + 3, prev = lengths[lengths.length - 1] || 0;
            for (var r = 0; r < rep; r++) lengths.push(prev);
          } else if (sym === 17) {
            var rep2 = br.bits(3) + 3;
            for (r = 0; r < rep2; r++) lengths.push(0);
          } else {
            var rep3 = br.bits(7) + 11;
            for (r = 0; r < rep3; r++) lengths.push(0);
          }
        }
        litTable = buildTable(lengths.slice(0, hlit), 15); litMax = 15;
        distTable = buildTable(lengths.slice(hlit), 15); distMax = 15;
      }
      while (true) {
        var s2 = decode(litTable, litMax);
        if (s2 < 256) out.push(s2);
        else if (s2 === 256) break;
        else {
          var li = s2 - 257, lenv = LEN_BASE[li] + br.bits(LEN_EXTRA[li]);
          var dsym = decode(distTable, distMax), dist = DIST_BASE[dsym] + br.bits(DIST_EXTRA[dsym]);
          for (var cp = 0; cp < lenv; cp++) out.push(out[out.length - dist]);
        }
      }
      if (bfinal) done = true;
    }
    return out;
  }

  /* ============ byte helpers ============ */
  function isWs(c) { return c === 0 || c === 9 || c === 10 || c === 12 || c === 13 || c === 32; }
  function isDelim(c) { return c === 40 || c === 41 || c === 60 || c === 62 || c === 91 || c === 93 || c === 123 || c === 125 || c === 47 || c === 37; }
  function latin1(arr) {
    var s = "";
    for (var i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
    return s;
  }

  /* ============ tokenizer ============ */
  function Tokenizer(bytes, pos) { this.b = bytes; this.pos = pos || 0; }
  Tokenizer.prototype.skipWs = function () {
    var b = this.b;
    while (this.pos < b.length) {
      var c = b[this.pos];
      if (c === 37 /* % */) {
        while (this.pos < b.length && b[this.pos] !== 10 && b[this.pos] !== 13) this.pos++;
      } else if (isWs(c)) this.pos++;
      else break;
    }
  };
  Tokenizer.prototype.peek = function () { return this.pos < this.b.length ? this.b[this.pos] : -1; };
  Tokenizer.prototype.number = function () {
    var b = this.b;
    this.skipWs();
    var start = this.pos, sawDigit = false;
    while (this.pos < b.length) {
      var c = b[this.pos];
      if ((c >= 48 && c <= 57) || c === 43 || c === 45 || c === 46) { this.pos++; if (c >= 48 && c <= 57) sawDigit = true; }
      else break;
    }
    if (!sawDigit) { this.pos = start; return null; }
    return parseFloat(latin1(b.subarray(start, this.pos)));
  };
  Tokenizer.prototype.name = function () {
    var b = this.b, out = "";
    while (this.pos < b.length) {
      var c = b[this.pos];
      if (isWs(c) || isDelim(c)) break;
      if (c === 35 /* # */ && this.pos + 2 < b.length) {
        var v = parseInt(latin1(b.subarray(this.pos + 1, this.pos + 3)), 16);
        if (!isNaN(v)) { out += String.fromCharCode(v); this.pos += 3; continue; }
      }
      out += String.fromCharCode(c); this.pos++;
    }
    return { n: out };
  };
  Tokenizer.prototype.string = function () {
    var b = this.b, out = [], depth = 1;
    while (this.pos < b.length) {
      var c = b[this.pos];
      if (c === 92) { /* backslash */
        var e = b[this.pos + 1];
        if (e === 110) out.push(10);
        else if (e === 114) out.push(13);
        else if (e === 116) out.push(9);
        else if (e === 98) out.push(8);
        else if (e === 102) out.push(12);
        else if (e === 40) out.push(40);
        else if (e === 41) out.push(41);
        else if (e === 92) out.push(92);
        else if (e >= 48 && e <= 55) {
          var oct = 0, n = 0;
          while (n < 3 && this.pos + 1 < b.length && b[this.pos + 1] >= 48 && b[this.pos + 1] <= 55) { oct = oct * 8 + (b[this.pos + 1] - 48); this.pos++; n++; }
          out.push(oct & 0xff);
        } else if (e === 10) { this.pos++; }
        else if (e === 13) { if (b[this.pos + 2] === 10) this.pos++; }
        else if (e !== undefined) out.push(e);
        this.pos += 2;
        continue;
      }
      if (c === 40) depth++;
      else if (c === 41) { depth--; if (depth === 0) { this.pos++; return latin1(Uint8Array.from(out)); } }
      out.push(c);
      this.pos++;
    }
    return latin1(Uint8Array.from(out));
  };
  Tokenizer.prototype.hexString = function () {
    var b = this.b, out = [], acc = -1;
    while (this.pos < b.length) {
      var c = b[this.pos];
      if (c === 62) { this.pos++; break; }
      var v = -1;
      if (c >= 48 && c <= 57) v = c - 48;
      else if (c >= 97 && c <= 102) v = c - 87;
      else if (c >= 65 && c <= 70) v = c - 55;
      if (v >= 0) { if (acc < 0) acc = v; else { out.push((acc << 4) | v); acc = -1; } }
      this.pos++;
    }
    if (acc >= 0) out.push(acc << 4);
    return latin1(Uint8Array.from(out));
  };
  Tokenizer.prototype.array = function () {
    var out = [];
    while (true) {
      this.skipWs();
      var c = this.peek();
      if (c === 93) { this.pos++; return out; }
      if (c < 0) return out;
      var v = this.valueSafe();
      if (v !== null) out.push(v);
    }
  };
  Tokenizer.prototype.dict = function () {
    var out = {};
    while (true) {
      this.skipWs();
      var c = this.peek();
      if (c === 62 && this.b[this.pos + 1] === 62) { this.pos += 2; return out; }
      if (c < 0) return out;
      var key = this.valueSafe();
      if (!key || typeof key !== "object" || key.n === undefined) { continue; }
      this.skipWs();
      var v = this.valueSafe();
      out["/" + key.n] = v;
    }
  };
  Tokenizer.prototype.value = function () {
    this.skipWs();
    var b = this.b, c = this.peek();
    if (c < 0) return null;
    if (c === 60) {
      if (b[this.pos + 1] === 60) { this.pos += 2; return this.dict(); }
      this.pos++;
      return this.hexString();
    }
    if (c === 40) { this.pos++; return this.string(); }
    if (c === 91) { this.pos++; return this.array(); }
    if (c === 47) { this.pos++; return this.name(); }
    var t = this.number();
    if (t !== null) {
      var save = this.pos;
      this.skipWs();
      var g = this.number();
      if (g !== null) {
        var save2 = this.pos;
        this.skipWs();
        if (this.peek() === 82 /* R */) {
          var nx = this.pos + 1 < b.length ? b[this.pos + 1] : -1;
          if (nx < 0 || isWs(nx) || isDelim(nx)) { this.pos++; return { r: t, g: g }; }
        }
        this.pos = save2;
      }
      this.pos = save;
      return t;
    }
    var start = this.pos;
    while (this.pos < b.length && !isWs(b[this.pos]) && !isDelim(b[this.pos])) this.pos++;
    if (this.pos === start) return null; // no progress — never spin
    var kw = latin1(b.subarray(start, this.pos));
    if (kw === "true") return true;
    if (kw === "false") return false;
    if (kw === "null") return null;
    return { kw: kw };
  };
  Tokenizer.prototype.valueSafe = function () {
    // like value(), but guarantees the position advances so parsers can
    // never loop forever on malformed input.
    var before = this.pos;
    var v = this.value();
    if (v === null && this.pos <= before) {
      if (this.pos < this.b.length) this.pos++;
    }
    return v;
  };

  /* ============ document parsing ============ */
  function findStartXref(b) {
    for (var i = b.length - 20; i >= 0; i--) {
      if (b[i] === 115 && latin1(b.subarray(i, i + 9)) === "startxref") {
        var t = new Tokenizer(b, i + 9);
        t.skipWs();
        var off = t.number();
        if (off !== null) return off;
      }
    }
    return -1;
  }

  function parseClassicXref(b, off, doc) {
    if (latin1(b.subarray(off, off + 4)) !== "xref") return null;
    var t = new Tokenizer(b, off + 4);
    var trailer = null;
    while (true) {
      t.skipWs();
      if (t.peek() < 0) return trailer;
      if (b[t.pos] === 116 && latin1(b.subarray(t.pos, t.pos + 7)) === "trailer") {
        t.pos += 7; t.skipWs();
        trailer = t.value();
        return trailer;
      }
      var start = t.number();
      if (start === null) return trailer;
      var count = t.number();
      if (count === null) return trailer;
      for (var i = 0; i < count; i++) {
        while (t.pos < b.length && isWs(b[t.pos])) t.pos++;
        var off10 = parseInt(latin1(b.subarray(t.pos, t.pos + 10)), 10);
        var gen5 = parseInt(latin1(b.subarray(t.pos + 11, t.pos + 16)), 10);
        var flag = b[t.pos + 17];
        var objNum = start + i;
        if (flag === 110 /* n */ && objNum > 0 && !isNaN(off10)) doc.entries[objNum] = { type: 1, off: off10, gen: gen5 };
        t.pos += 20;
      }
    }
  }

  function parseXrefStream(b, xrefObj, doc) {
    var d = xrefObj;
    var W = d["/W"];
    if (!W || !Array.isArray(W) || W.length !== 3) return null;
    var w1 = W[0], w2 = W[1], w3 = W[2];
    var size = d["/Size"];
    var Index = d["/Index"];
    var sections = [];
    if (Array.isArray(Index)) for (var i = 0; i < Index.length; i += 2) sections.push([Index[i], Index[i + 1]]);
    else sections.push([0, size]);
    var data = xrefObj.data;
    var pos = 0;
    for (var s = 0; s < sections.length; s++) {
      var start = sections[s][0], cnt = sections[s][1];
      for (var i2 = 0; i2 < cnt; i2++) {
        var type = 1;
        if (w1 > 0) {
          type = 0;
          for (var k = 0; k < w1; k++) type = (type << 8) | data[pos + k];
        }
        var f2 = 0;
        for (k = 0; k < w2; k++) f2 = (f2 << 8) | data[pos + w1 + k];
        var f3 = 0;
        for (k = 0; k < w3; k++) f3 = (f3 << 8) | data[pos + w1 + w2 + k];
        pos += w1 + w2 + w3;
        var num = start + i2;
        if (type === 1) doc.entries[num] = { type: 1, off: f2, gen: f3 };
        else if (type === 2) doc.entries[num] = { type: 2, stream: f2, idx: f3 };
      }
    }
  }

  function asciiHexDecode(d) {
    var out = [], acc = -1;
    for (var i = 0; i < d.length; i++) {
      var c = d[i];
      if (c === 62) break;
      var v = -1;
      if (c >= 48 && c <= 57) v = c - 48;
      else if (c >= 97 && c <= 102) v = c - 87;
      else if (c >= 65 && c <= 70) v = c - 55;
      if (v >= 0) { if (acc < 0) acc = v; else { out.push((acc << 4) | v); acc = -1; } }
    }
    if (acc >= 0) out.push(acc << 4);
    return Uint8Array.from(out);
  }
  function ascii85Decode(d) {
    var out = [], chunk = [];
    for (var i = 0; i < d.length; i++) {
      var c = d[i];
      if (c === 122 && chunk.length === 0) { out.push(0, 0, 0, 0); continue; }
      if (c >= 33 && c <= 117) chunk.push(c - 33);
      else if (c === 126) break;
      else continue;
      if (chunk.length === 5) {
        var val = 0;
        for (var k = 0; k < 5; k++) val = val * 85 + chunk[k];
        out.push((val >> 24) & 0xff, (val >> 16) & 0xff, (val >> 8) & 0xff, val & 0xff);
        chunk = [];
      }
    }
    if (chunk.length >= 2) {
      var n = chunk.length - 1, val2 = 0;
      for (var j = 0; j < chunk.length; j++) val2 = val2 * 85 + chunk[j];
      var bytes = [(val2 >> 24) & 0xff, (val2 >> 16) & 0xff, (val2 >> 8) & 0xff, val2 & 0xff];
      for (var m = 0; m < n; m++) out.push(bytes[m]);
    }
    return Uint8Array.from(out);
  }

  function decodeStream(streamObj) {
    var f = streamObj["/Filter"];
    var filters = [];
    if (Array.isArray(f)) filters = f;
    else if (f) filters = [f];
    var data = streamObj.data;
    for (var i = 0; i < filters.length; i++) {
      var name = filters[i].n;
      if (name === "FlateDecode" || name === "Fl") data = Uint8Array.from(inflate(data));
      else if (name === "ASCIIHexDecode" || name === "AHx") data = asciiHexDecode(data);
      else if (name === "ASCII85Decode" || name === "A85") data = ascii85Decode(data);
    }
    return data;
  }

  function readStreamTail(t, val, doc) {
    // After a dict value, check for a following stream and attach raw data.
    var b = t.b;
    if (!val || typeof val !== "object" || val.s || val.n !== undefined || val.kw || Array.isArray(val) || val.r !== undefined) return;
    var lenRef = val["/Length"];
    var len = null;
    if (typeof lenRef === "number") len = lenRef;
    else if (lenRef && lenRef.r !== undefined) {
      var lo = doc.readObject(lenRef.r);
      if (lo && typeof lo.value === "number") len = lo.value;
    }
    t.skipWs();
    var sp = t.pos;
    if (latin1(b.subarray(sp, sp + 6)) !== "stream") return;
    sp += 6;
    if (b[sp] === 13) sp++;
    if (b[sp] === 10) sp++;
    if (len !== null) {
      val.data = b.slice(sp, sp + len);
    } else {
      var endIdx = -1;
      for (var idx = sp; idx + 9 < b.length; idx++) {
        if (latin1(b.subarray(idx, idx + 9)) === "endstream") { endIdx = idx; break; }
      }
      if (endIdx > 0) val.data = b.slice(sp, endIdx);
    }
    val.s = true;
  }

  function parseObjectAt(doc, off, num) {
    var b = doc.bytes;
    if (off <= 0 || off >= b.length) return null;
    var t = new Tokenizer(b, off);
    t.skipWs();
    var n = t.number();
    if (n === null) return null;
    t.number(); // generation
    t.skipWs();
    if (latin1(b.subarray(t.pos, t.pos + 3)) !== "obj") return null;
    t.pos += 3;
    var val = t.value();
    if (val === null || typeof val !== "object" || val.kw) return { num: num, gen: 0, value: val };
    readStreamTail(t, val, doc);
    return { num: num, gen: 0, value: val };
  }

  function parseObjStmEntry(doc, os, idx) {
    var data = decodeStream(os.value);
    var dict = os.value;
    var n = dict["/N"], first = dict["/First"];
    if (!n || !first) return null;
    var t = new Tokenizer(data, 0);
    var objNums = [], offsets = [];
    for (var i = 0; i < n; i++) {
      var on = t.number(); var oo = t.number();
      if (on === null || oo === null) return null;
      objNums.push(on); offsets.push(oo);
    }
    if (idx < 0 || idx >= objNums.length) return null;
    var start = first + offsets[idx];
    var t2 = new Tokenizer(data, start);
    var v = t2.value();
    return { num: objNums[idx], gen: 0, value: v };
  }

  function parseDocument(bytes) {
    var b = new Uint8Array(bytes);
    var doc = { bytes: b, entries: {}, cache: {}, trailer: null, root: null };
    var xrefOff = findStartXref(b);
    var visited = {};
    var ok = false;
    var cur = xrefOff;
    while (cur > 0 && !visited[cur] && cur < b.length) {
      visited[cur] = true;
      if (latin1(b.subarray(cur, cur + 4)) === "xref") {
        var trailer = parseClassicXref(b, cur, doc);
        if (trailer && typeof trailer === "object") doc.trailer = trailer;
        ok = true;
        var prevRef = trailer && trailer["/Prev"];
        cur = prevRef && prevRef.r !== undefined ? prevRef.r : -1;
      } else {
        var t = new Tokenizer(b, cur);
        t.skipWs();
        var num = t.number(), gen = t.number();
        if (num !== null && gen !== null) {
          t.skipWs();
          if (latin1(b.subarray(t.pos, t.pos + 3)) === "obj") {
            t.pos += 3;
            var val = t.value();
            readStreamTail(t, val, doc);
            if (val && val.s) {
              val.data = decodeStream(val);
              parseXrefStream(b, val, doc);
              doc.trailer = val;
              ok = true;
              var pv = val["/Prev"];
              cur = pv && pv.r !== undefined ? pv.r : -1;
            } else cur = -1;
          } else cur = -1;
        } else cur = -1;
      }
    }

    if (!ok) {
      // fallback: regex scan for object offsets
      var re = /(\d+)\s+(\d+)\s+obj/g, m;
      var text = latin1(b);
      while ((m = re.exec(text)) !== null) {
        var on = parseInt(m[1], 10);
        doc.entries[on] = { type: 1, off: m.index, gen: parseInt(m[2], 10) };
      }
      // last trailer before startxref
      var ti = text.lastIndexOf("trailer");
      if (ti >= 0) {
        var tt = new Tokenizer(b, ti + 7);
        tt.skipWs();
        doc.trailer = tt.value();
      }
      ok = Object.keys(doc.entries).length > 0;
    }

    doc.readObject = function (num) {
      if (doc.cache[num]) return doc.cache[num];
      var e = doc.entries[num];
      if (!e) return null;
      var obj = null;
      if (e.type === 2) {
        var os = doc.readObject(e.stream);
        if (!os || !os.value || !os.value.s || !os.value.data) return null;
        obj = parseObjStmEntry(doc, os, e.idx);
      } else if (e.type === 1) {
        obj = parseObjectAt(doc, e.off, num);
      }
      if (obj) doc.cache[num] = obj;
      return obj;
    };

    var rootRef = doc.trailer && doc.trailer["/Root"];
    if (rootRef && rootRef.r !== undefined) {
      var rootObj = doc.readObject(rootRef.r);
      if (rootObj && rootObj.value) doc.root = rootObj.value;
    }
    return doc;
  }

  /* ============ page collection ============ */
  function pageList(doc) {
    var pages = [];
    if (!doc.root || !doc.root["/Pages"]) return pages;
    var pagesRef = doc.root["/Pages"];
    var rootPages = pagesRef.r !== undefined ? doc.readObject(pagesRef.r) : null;
    if (!rootPages || !rootPages.value) return pages;
    var seen = {};
    function walk(node) {
      if (!node || !node["/Type"] || node["/Type"].n !== "Pages") return;
      var kids = node["/Kids"];
      if (!kids || !Array.isArray(kids)) return;
      kids.forEach(function (kid) {
        if (!kid || kid.r === undefined) return;
        if (seen[kid.r]) return;
        seen[kid.r] = true;
        var o = doc.readObject(kid.r);
        if (!o || !o.value) return;
        var v = o.value;
        if (v["/Type"] && v["/Type"].n === "Pages") walk(v);
        else pages.push({ doc: doc, objNum: kid.r, value: v });
      });
    }
    walk(rootPages.value);
    return pages;
  }

  function inherited(doc, pageValue, key) {
    var cur = pageValue;
    var walked = new Set();
    while (cur) {
      if (cur[key] !== undefined && cur[key] !== null) return cur[key];
      var p = cur["/Parent"];
      if (p && p.r !== undefined) {
        if (walked.has(p.r)) return null; // /Parent cycle — malformed PDF
        walked.add(p.r);
        var po = doc.readObject(p.r);
        cur = po && po.value ? po.value : null;
      } else cur = null;
    }
    return null;
  }

  /* Collect every indirect object a page needs (excluding the page-tree
     structure). Returns Map oldNum -> value. Injects inherited attributes
     (MediaBox/CropBox/Resources/Rotate) so the page stands alone. */
  function collectPage(doc, pageValue, selfNum) {
    var collected = new Map();
    var seen = new Set();
    var visitCount = 0;
    function visit(v) {
      if (++visitCount > 200000) throw new Error("collectPage: visit limit exceeded (possible cycle)");
      if (v === null || v === undefined || typeof v !== "object") return;
      if (v.r !== undefined) {
        if (seen.has(v.r)) return;
        seen.add(v.r);
        var o = doc.readObject(v.r);
        if (!o || o.value === undefined) return;
        collected.set(v.r, o.value);
        visit(o.value);
        return;
      }
      if (Array.isArray(v)) { for (var i = 0; i < v.length; i++) visit(v[i]); return; }
      if (v.s) {
        for (var k in v) {
          if (k === "/Length" || k === "s" || k === "data") continue;
          visit(v[k]);
        }
        return;
      }
      for (var k2 in v) {
        if (k2 === "/Parent" || k2 === "/Kids") continue;
        visit(v[k2]);
      }
    }
    ["/MediaBox", "/CropBox", "/Resources", "/Rotate"].forEach(function (key) {
      if (pageValue[key] === undefined || pageValue[key] === null) {
        var inh = inherited(doc, pageValue, key);
        if (inh !== null && inh !== undefined) pageValue[key] = inh;
      }
    });
    visit(pageValue);
    collected.set(selfNum, pageValue);
    return collected;
  }

  /* ============ serialization ============ */
  function strBytes(s) {
    var out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff;
    return out;
  }
  function escapeString(s) {
    var needsHex = false;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 32 || c > 126) { needsHex = true; break; }
    }
    if (needsHex) {
      var h = "";
      for (var j = 0; j < s.length; j++) {
        var cc = s.charCodeAt(j);
        h += (cc >> 4).toString(16) + (cc & 15).toString(16);
      }
      return "<" + h + ">";
    }
    return "(" + s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)") + ")";
  }
  function serName(nm) {
    var out = "/";
    for (var i = 0; i < nm.length; i++) {
      var c = nm.charCodeAt(i);
      if (c < 33 || c > 126 || c === 35) out += "#" + (c >> 4).toString(16) + (c & 15).toString(16);
      else out += nm[i];
    }
    return out;
  }
  function serializeValue(v, remap) {
    if (v === null || v === undefined) return "null";
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number") return String(v);
    if (v.r !== undefined) return remap(v.r) + " 0 R";
    if (v.n !== undefined) return serName(v.n);
    if (typeof v === "string") return escapeString(v);
    if (Array.isArray(v)) {
      var parts = [];
      for (var i = 0; i < v.length; i++) parts.push(serializeValue(v[i], remap));
      return "[" + parts.join(" ") + "]";
    }
    if (v.s) {
      var body = "";
      for (var k in v) {
        if (k === "/Length" || k === "s" || k === "data" || v[k] === undefined || v[k] === null) continue;
        body += " " + serName(k.slice(1)) + " " + serializeValue(v[k], remap);
      }
      body += " /Length " + v.data.length;
      return "<<" + body + " >>\nstream\n" + latin1(v.data) + "\nendstream";
    }
    var db = "";
    for (var k2 in v) {
      if (v[k2] === undefined || v[k2] === null) continue;
      db += " " + serName(k2.slice(1)) + " " + serializeValue(v[k2], remap);
    }
    return "<<" + db + " >>";
  }
  function pad10(n) { var s = String(n); while (s.length < 10) s = "0" + s; return s; }

  function buildPdf(objects, rootNum) {
    var parts = [], pos = 0;
    var maxNum = 0;
    objects.forEach(function (o) { if (o.num > maxNum) maxNum = o.num; });
    if (maxNum > 1000000) throw new Error("buildPdf: object count too large (" + maxNum + ")");
    function pushU8(u8) { parts.push(u8); pos += u8.length; }
    function pushStr(s) { var u = strBytes(s); parts.push(u); pos += u.length; }
    pushU8(Uint8Array.from([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 0xe2, 0xe3, 0xcf, 0xd3, 10]));
    var offs = {};
    objects.forEach(function (o) {
      offs[o.num] = pos;
      pushStr(o.num + " 0 obj\n");
      var remap = o.remap || function (n) { return n; };
      pushStr(serializeValue(o.value, remap) + "\nendobj\n");
    });
    var xrefOff = pos;
    var count = maxNum + 1;
    var xref = "xref\n0 " + count + "\n0000000000 65535 f \n";
    for (var i = 1; i < count; i++) xref += pad10(offs[i] || 0) + " 00000 n \n";
    pushStr(xref);
    var id = randomHex(16);
    pushStr("trailer\n<< /Size " + count + " /Root " + rootNum + " 0 R /ID [<" + id + "><" + id + ">] >>\nstartxref\n" + xrefOff + "\n%%EOF\n");
    var total = 0;
    parts.forEach(function (p) { total += p.length; });
    var out = new Uint8Array(total);
    var at = 0;
    parts.forEach(function (p) { out.set(p, at); at += p.length; });
    return out;
  }
  function randomHex(len) {
    var s = "";
    var arr = new Uint8Array(len);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(arr);
    else for (var i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256);
    for (var j = 0; j < len; j++) s += (arr[j] >> 4).toString(16) + (arr[j] & 15).toString(16);
    return s;
  }

  /* ============ merge / split ============ */
  function pageOut(doc, pageObj, nextNumRef) {
    // returns { entries: [{num, value, remap}], pageNum }
    var collected = collectPage(doc, pageObj.value, pageObj.objNum);
    var remap = {};
    var nums = [];
    collected.forEach(function (v, oldNum) { remap[oldNum] = nextNumRef.n++; nums.push(oldNum); });
    nums.sort(function (a, b) { return a - b; });
    var byNum = {};
    collected.forEach(function (v, oldNum) { byNum[oldNum] = v; });
    var entries = [];
    var remapFn = function (n) { return remap[n] !== undefined ? remap[n] : n; };
    nums.forEach(function (oldNum) { entries.push({ num: remap[oldNum], value: byNum[oldNum], remap: remapFn }); });
    return { entries: entries, pageNum: remap[pageObj.objNum], pageValue: byNum[pageObj.objNum] };
  }

  function finish(objects, pageNums, pagesNum, rootNum) {
    objects.push({
      num: pagesNum,
      value: { "/Type": { n: "Pages" }, "/Kids": pageNums.map(function (n) { return { r: n, g: 0 }; }), "/Count": pageNums.length }
    });
    objects.push({ num: rootNum, value: { "/Type": { n: "Catalog" }, "/Pages": { r: pagesNum, g: 0 } } });
    return buildPdf(objects, rootNum);
  }

  function merge(files) {
    var docs = files.map(function (f) { return parseDocument(f.bytes); });
    var allPages = [];
    docs.forEach(function (doc) { pageList(doc).forEach(function (p) { allPages.push(p); }); });
    if (!allPages.length) throw new Error("No pages found in the selected PDFs.");
    var objects = [];
    var nextNum = { n: 1 };
    var pageNums = [];
    var pageValues = [];
    allPages.forEach(function (p) {
      var out = pageOut(p.doc, p, nextNum);
      out.entries.forEach(function (e) { objects.push(e); });
      pageNums.push(out.pageNum);
      pageValues.push(out.pageValue);
    });
    var pagesNum = nextNum.n++;
    var rootNum = nextNum.n++;
    pageValues.forEach(function (pv) { pv["/Parent"] = { r: pagesNum, g: 0 }; });
    return finish(objects, pageNums, pagesNum, rootNum);
  }

  function split(bytes, pageIndex) {
    var doc = parseDocument(bytes);
    var pages = pageList(doc);
    if (!pages.length) throw new Error("No pages found in the PDF.");
    if (pageIndex < 0 || pageIndex >= pages.length) throw new Error("Page " + (pageIndex + 1) + " is out of range (1–" + pages.length + ").");
    var objects = [];
    var nextNum = { n: 1 };
    var out = pageOut(doc, pages[pageIndex], nextNum);
    out.entries.forEach(function (e) { objects.push(e); });
    var pageNum = out.pageNum;
    var pagesNum = nextNum.n++;
    var rootNum = nextNum.n++;
    out.pageValue["/Parent"] = { r: pagesNum, g: 0 };
    return finish(objects, [pageNum], pagesNum, rootNum);
  }

  function pageCount(bytes) {
    return pageList(parseDocument(bytes)).length;
  }

  window.PdfKit = {
    parse: parseDocument,
    merge: merge,
    split: split,
    pageCount: pageCount
  };
})();