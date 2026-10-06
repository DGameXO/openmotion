import { a as parseEffectXml, b as parseAmfxBinary, c as setDefaultPrecision, d as buildParamNameMap, e as buildFragmentShaderSource, f as buildVertexShaderSource, i as compileScriptEffect, j as makeTextState } from "./chunk.js";
var Oi = new Map(),
  xs = {
    vec2: 2,
    vec3: 3,
    vec4: 4
  };
function parseNumberList(a) {
  return a == null ? [] : String(a).trim().split(/[,\s]+/).map(a2 => parseFloat(a2)).filter(a2 => !Number.isNaN(a2));
}
function parseHexColor(a) {
  if (!a) return [0, 0, 0, 1];
  let replace = String(a).trim().replace(/^#/, '');
  if (replace.length === 3 && (replace = replace.split('').map(a2 => a2 + a2).join('')), replace.length === 6 && (replace = 'ff' + replace), replace.length !== 8) return [0, 0, 0, 1];
  let items3 = [0, 2, 4, 6].map(a2 => parseInt(replace.substr(a2, 2), 16) / 255);
  return [items3[1], items3[2], items3[3], items3[0]];
}
function fn2(a, b, c, d) {
  let val3 = 3 * a,
    val4 = 3 * (c - a) - val3,
    val5 = 1 - val3 - val4,
    val6 = 3 * b,
    val7 = 3 * (d - b) - val6,
    val8 = 1 - val6 - val7,
    fn8 = a2 => ((val5 * a2 + val4) * a2 + val3) * a2,
    fn9 = a2 => ((val8 * a2 + val7) * a2 + val6) * a2,
    fn10 = a2 => (3 * val5 * a2 + 2 * val4) * a2 + val3;
  return a2 => {
    if (a2 <= 0) return 0;
    if (a2 >= 1) return 1;
    let a22 = a2;
    for (let n4 = 0; n4 < 8; n4++) {
      let val9 = fn8(a22) - a2;
      if (Math.abs(val9) < 0.00001) return fn9(a22);
      let res5 = fn10(a22);
      if (Math.abs(res5) < 0.000001) break;
      a22 -= val9 / res5;
    }
    let n = 0,
      n3 = 1;
    a22 = a2;
    for (let n4 = 0; n4 < 24; n4++) {
      let val9 = fn8(a22) - a2;
      if (Math.abs(val9) < 0.00001) break;
      val9 > 0 ? n3 = a22 : n = a22, a22 = (n + n3) / 2;
    }
    return fn9(a22);
  };
}
function render(a, b, c) {
  return a * (1 - c) + b * c;
}
function apply(a, b, c) {
  let val3 = b - a;
  if (Math.abs(val3) < 1e-12) return c < a ? 0 : 1;
  let val4 = (c - a) / val3;
  return val4 = val4 < 0 ? 0 : val4 > 1 ? 1 : val4, val4 * val4 * (3 - 2 * val4);
}
function get(a, b, c, d, arg) {
  let val3 = Number.isFinite(a) && a > 0 ? a : 0.5,
    val4 = Number.isFinite(c) ? c : 0.5,
    val5 = Number.isFinite(d) ? d : 0,
    fn8 = a2 => {
      let cos = Math.cos(Math.PI * a2 / Math.max(val3, 0.01)),
        val6 = 1 - Math.max(a2, 0.005);
      return cos * Math.abs(Math.pow(val6, val4 * val4 * 15 + 1));
    },
    fn9 = a2 => {
      if (a2 >= val3) return 1 - fn8(a2) * val5;
      let max5 = Math.max(val3, 0.01);
      return render((1 - Math.cos(Math.PI * a2 / max5)) / 2 * (1 - fn8(val3) * val5), 1 - fn8(a2) * val5, Math.pow(a2 / max5, 3));
    };
  return arg ? a2 => 1 - fn9(1 - a2) : fn9;
}
function fn3(a, b, c, d, arg = 0) {
  let val3 = Number.isFinite(a) ? a : 0.5,
    max5 = Math.max(val3, 0.001),
    val4 = Number.isFinite(b) ? b : 0,
    val5 = Number.isFinite(c) ? c : 0.5,
    val6 = Number.isFinite(d) ? d : 0,
    fn8 = a2 => a2 % max5 / max5,
    fn9 = a2 => 1 - (Math.cos(a2 / max5 * Math.PI * 2) + 1) / 2,
    fn10 = a2 => 1 - Math.abs(fn8(a2) - 0.5) * 2,
    fn11 = a2 => {
      let res5 = fn8(a2),
        n = 0.5;
      return res5 < val5 ? n = 0.5 * res5 / (val5 || 0.000001) : res5 > val5 && (n = 0.5 + (res5 - val5) / (1 - val5 || 0.000001) / 2), a2 - res5 * max5 + max5 * n;
    };
  return a2 => {
    let res5 = fn11(a2),
      res6 = render(fn9(res5), fn10(res5), val4),
      val7 = a2 - a2 % max5;
    return max5 / 4 + val7 > 1 ? res6 = 0 : max5 / 2 + val7 < 1 && val7 + max5 * 3 / 4 > 1 && fn8(a2) > val5 && (res6 = 1), res6 * (1 - a2 * val6) + a2 * val6;
  };
}
function fn4(a, b) {
  let val3 = Number.isFinite(a) ? a : 0.3,
    val4 = Number.isFinite(b) ? b : 0.8;
  return a2 => {
    let ref24 = val3,
      val5 = a2 + val3 / 2,
      n = 0;
    if (val3 === 0) return 1;
    let n3 = 1;
    for (;;) {
      let val6 = n + ref24;
      if (val5 <= val6) return ref24 / 3 + n > val3 / 2 + 1 || ref24 < 0.1 && val6 > val3 / 2 + 1 ? 1 : Math.pow(Math.abs(((val5 - n) / ref24 - 0.5) * 2), 2) * n3 + (1 - n3);
      if (ref24 *= val4, n3 *= val4, n3 < 0.005) return 1;
      n = val6;
    }
  };
}
function fn5(a, b) {
  let val3 = Number.isFinite(a) && a > 0.000001 ? a : 0.25,
    val4 = Number.isFinite(b) ? b : 0;
  return a2 => {
    let val5 = a2 % val3;
    return a2 - val5 + apply(val3 - val4 * val3, val3, val5) * val3;
  };
}
function fn6(a, b) {
  let val3 = Number.isFinite(a) && a > 0.000001 ? a : 0.2,
    val4 = Number.isFinite(b) ? b : 0.5,
    res5 = get(0.5 - 0.45 * val4, 1, 1 - val4 * 0.5, (1 - val4) * 0.5 + 0.5, false);
  return a2 => {
    if (a2 < val3) return 0;
    let val5 = a2 % val3;
    return a2 - val5 + val3 * (res5(val5 / val3) - 1);
  };
}
var on = new Uint8Array(512),
  Un = new Uint8Array(512),
  St = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [0, 1], [0, -1]];
{
  let arr2 = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
  for (let n = 0; n < 512; n++) on[n] = arr2[n % 256], Un[n] = on[n] % 12;
}
var Br = (Math.sqrt(3) - 1) * 0.5,
  an = (3 - Math.sqrt(3)) / 6;
function compute(a, b) {
  let val3 = (a + b) * Br,
    floor = Math.floor(a + val3),
    floor2 = Math.floor(b + val3),
    val4 = (floor + floor2) * an,
    val5 = a - (floor - val4),
    val6 = b - (floor2 - val4),
    n = 0,
    n3 = 1;
  val5 > val6 && (n = 1, n3 = 0);
  let val7 = val5 - n + an,
    val8 = val6 - n3 + an,
    val9 = val5 - 1 + 2 * an,
    val10 = val6 - 1 + 2 * an,
    val11 = floor & 255,
    val12 = floor2 & 255,
    val13 = Un[val11 + on[val12]],
    val14 = Un[n + val11 + on[n3 + val12]],
    val15 = Un[val11 + 1 + on[val12 + 1]],
    n4 = 0,
    n5 = 0,
    n6 = 0,
    val16 = 0.5 - val5 * val5 - val6 * val6;
  val16 >= 0 && (val16 *= val16, n4 = val16 * val16 * (St[val13][0] * val5 + St[val13][1] * val6));
  let val17 = 0.5 - val7 * val7 - val8 * val8;
  val17 >= 0 && (val17 *= val17, n5 = val17 * val17 * (St[val14][0] * val7 + St[val14][1] * val8));
  let val18 = 0.5 - val9 * val9 - val10 * val10;
  return val18 >= 0 && (val18 *= val18, n6 = val18 * val18 * (St[val15][0] * val9 + St[val15][1] * val10)), (n4 + n5 + n6) * 70;
}
function fn7(a, b, c, d, arg, arg2) {
  let val3 = Number.isFinite(a) ? a : 0.5,
    val4 = Number.isFinite(b) ? b : 0.5,
    val5 = Number.isFinite(c) ? c : 0.5,
    val6 = Number.isFinite(d) ? d : 0.5,
    val7 = Number.isFinite(arg) ? arg : 0.5,
    val8 = Number.isFinite(arg2) ? arg2 : 0.5,
    val9 = 1 - Math.abs(1 - val4),
    val10 = Math.abs(val6 - 0.5) * 2,
    val11 = Math.abs(val7 - 0.5) * 2;
  return a2 => {
    let val12 = a2 * 2 - 1,
      val13 = 1 - Math.pow(Math.abs(val12), 3),
      val14 = val13 * compute(val3 * 30 * a2, val5 * 10) * val9 + val13 * compute(val3 * 60 * a2, val5 * 10 + 23453.234534) * val9 * 0.5,
      val15 = val6 > 0.5 ? render(1, 1 - a2, val10) : val6 < 0.5 ? render(1, a2, val10) : 1,
      a22 = a2;
    return val7 < 0.5 ? a22 = Math.pow(a2, val11 * 5 + 1) : val7 > 0.5 && (a22 = 1 - Math.pow(1 - a2, val11 * 5 + 1)), render(a22, 1 - a22, val8) + val14 * val15 * val15;
  };
}
function obj(a) {
  if (!a) return null;
  let trim = String(a).trim();
  if (!trim) return null;
  let parts = trim.split(/\s+/),
    val3 = parts[0] === "local",
    val4 = val3 ? parts[1] : parts[0],
    val5 = val4 === "reverse" && parts[1] === "elastic",
    val6 = val5 ? "elastic" : val4,
    items3 = parts.slice(val5 || val3 ? 2 : 1).map(parseFloat);
  return {
    type: val6,
    params: items3,
    raw: trim,
    reverse: val5,
    local: val3
  };
}
var ks = {
  linear: a => a <= 0 ? 0 : a >= 1 ? 1 : a,
  none: a => a <= 0 ? 0 : a >= 1 ? 1 : a
};
function _r(a) {
  let res5 = obj(a);
  if (!res5) return null;
  let val3 = res5.raw;
  if (Oi.has(val3)) return Oi.get(val3);
  let val4 = res5.params,
    fn8 = a2 => val4.length >= a2 && val4.slice(0, a2).every(a3 => Number.isFinite(a3)),
    val5 = res5.type,
    val6 = null;
  return val5 === "cubicBezier" && fn8(4) ? val6 = fn2(val4[0], val4[1], val4[2], val4[3]) : val5 === "elastic" && fn8(3) ? val6 = get(val4[0], val4[1], val4[2], val4[3], res5.reverse) : val5 === "cyclic" && fn8(5) ? val6 = fn3(val4[0], val4[1], val4[2], val4[3], val4[4]) : val5 === "bounce" ? val6 = fn4(val4[0], val4[1]) : val5 === "step" ? val6 = fn5(val4[0], val4[1]) : val5 === "elasticStep" ? val6 = fn6(val4[0], val4[1]) : val5 === "random" && fn8(2) ? val6 = fn7(val4[0], val4[1], val4[2], val4[3], val4[4], val4[5]) : ks[val5] && (val6 = ks[val5]), Oi.set(val3, val6), val6;
}
function ref(a, b, c) {
  let arr2 = [];
  for (let n = 0; n < b; n++) {
    let val3 = a[n];
    arr2.push(val3 === void 0 ? c[n] === void 0 ? 0 : c[n] : val3);
  }
  return arr2;
}
function update(a, b) {
  return !a || !a.children ? [] : Array.from(a.children).filter(a2 => !b || a2.tagName === b);
}
var vs = /([MmLlHhVvCcSsQqTtAaZz])|(-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/g;
function ref2(a) {
  let arr2 = [];
  if (!a) return arr2;
  let arr3 = [],
    val3;
  for (vs.lastIndex = 0; (val3 = vs.exec(a)) !== null;) arr3.push(val3[1] ? val3[1] : parseFloat(val3[2]));
  let obj23 = {
      M: 2,
      L: 2,
      H: 1,
      V: 1,
      C: 6,
      S: 4,
      Q: 4,
      T: 2,
      A: 7
    },
    n = 0,
    val4 = null,
    str = '',
    n3 = 0,
    n4 = 0,
    n5 = 0,
    n6 = 0,
    n7 = 0,
    n8 = 0,
    fn8 = () => typeof arr3[n] == "number" ? arr3[n++] : 0;
  for (; n < arr3.length;) {
    if (typeof arr3[n] == "string") val4 = arr3[n++];else {
      if (val4) val4 === 'M' ? val4 = 'L' : val4 === 'm' && (val4 = 'l');else {
        n++;
        continue;
      }
    }
    let toUpperCase = val4.toUpperCase(),
      val5 = val4 !== toUpperCase;
    if (toUpperCase === 'Z') {
      arr2.push(['Z']), n3 = n5, n4 = n6, str = 'Z';
      continue;
    }
    let val6 = obj23[toUpperCase] || 0,
      arr4 = [];
    for (let n9 = 0; n9 < val6; n9++) arr4.push(fn8());
    switch (toUpperCase) {
      case 'M':
        n3 = val5 ? n3 + arr4[0] : arr4[0], n4 = val5 ? n4 + arr4[1] : arr4[1], n5 = n3, n6 = n4, arr2.push(['M', n3, n4]);
        break;
      case 'L':
        n3 = val5 ? n3 + arr4[0] : arr4[0], n4 = val5 ? n4 + arr4[1] : arr4[1], arr2.push(['L', n3, n4]);
        break;
      case 'H':
        n3 = val5 ? n3 + arr4[0] : arr4[0], arr2.push(['L', n3, n4]);
        break;
      case 'V':
        n4 = val5 ? n4 + arr4[0] : arr4[0], arr2.push(['L', n3, n4]);
        break;
      case 'C':
        {
          let val7 = val5 ? n3 + arr4[0] : arr4[0],
            val8 = val5 ? n4 + arr4[1] : arr4[1],
            val9 = val5 ? n3 + arr4[2] : arr4[2],
            val10 = val5 ? n4 + arr4[3] : arr4[3],
            val11 = val5 ? n3 + arr4[4] : arr4[4],
            val12 = val5 ? n4 + arr4[5] : arr4[5];
          arr2.push(['C', val7, val8, val9, val10, val11, val12]), n7 = val9, n8 = val10, n3 = val11, n4 = val12;
          break;
        }
      case 'S':
        {
          let val7 = str === 'C' || str === 'S' ? 2 * n3 - n7 : n3,
            val8 = str === 'C' || str === 'S' ? 2 * n4 - n8 : n4,
            val9 = val5 ? n3 + arr4[0] : arr4[0],
            val10 = val5 ? n4 + arr4[1] : arr4[1],
            val11 = val5 ? n3 + arr4[2] : arr4[2],
            val12 = val5 ? n4 + arr4[3] : arr4[3];
          arr2.push(['C', val7, val8, val9, val10, val11, val12]), n7 = val9, n8 = val10, n3 = val11, n4 = val12;
          break;
        }
      case 'Q':
        {
          let val7 = val5 ? n3 + arr4[0] : arr4[0],
            val8 = val5 ? n4 + arr4[1] : arr4[1],
            val9 = val5 ? n3 + arr4[2] : arr4[2],
            val10 = val5 ? n4 + arr4[3] : arr4[3];
          arr2.push(['C', n3 + 2 / 3 * (val7 - n3), n4 + 2 / 3 * (val8 - n4), val9 + 2 / 3 * (val7 - val9), val10 + 2 / 3 * (val8 - val10), val9, val10]), n7 = val7, n8 = val8, n3 = val9, n4 = val10;
          break;
        }
      case 'T':
        {
          let val7 = str === 'Q' || str === 'T' ? 2 * n3 - n7 : n3,
            val8 = str === 'Q' || str === 'T' ? 2 * n4 - n8 : n4,
            val9 = val5 ? n3 + arr4[0] : arr4[0],
            val10 = val5 ? n4 + arr4[1] : arr4[1];
          arr2.push(['C', n3 + 2 / 3 * (val7 - n3), n4 + 2 / 3 * (val8 - n4), val9 + 2 / 3 * (val7 - val9), val10 + 2 / 3 * (val8 - val10), val9, val10]), n7 = val7, n8 = val8, n3 = val9, n4 = val10;
          break;
        }
      case 'A':
        {
          let val7 = val5 ? n3 + arr4[5] : arr4[5],
            val8 = val5 ? n4 + arr4[6] : arr4[6];
          arr2.push(['L', val7, val8]), n3 = val7, n4 = val8;
          break;
        }
      default:
        break;
    }
    str = toUpperCase, toUpperCase !== 'C' && toUpperCase !== 'S' && toUpperCase !== 'Q' && toUpperCase !== 'T' && (n7 = n3, n8 = n4);
  }
  return arr2;
}
function obj2(a) {
  let val3 = 1 / 0,
    val4 = 1 / 0,
    val5 = -1 / 0,
    val6 = -1 / 0,
    fn8 = (a2, b) => {
      a2 < val3 && (val3 = a2), a2 > val5 && (val5 = a2), b < val4 && (val4 = b), b > val6 && (val6 = b);
    },
    n = 0,
    n3 = 0;
  for (let val9 of a) if (val9[0] === 'M' || val9[0] === 'L') fn8(val9[1], val9[2]), n = val9[1], n3 = val9[2];else {
    if (val9[0] === 'C') {
      let val10 = val9[1],
        val11 = val9[2],
        val12 = val9[3],
        val13 = val9[4],
        val14 = val9[5],
        val15 = val9[6];
      for (let n4 = 0; n4 <= 16; n4++) {
        let val16 = n4 / 16,
          val17 = 1 - val16;
        fn8(val17 * val17 * val17 * n + 3 * val17 * val17 * val16 * val10 + 3 * val17 * val16 * val16 * val12 + val16 * val16 * val16 * val14, val17 * val17 * val17 * n3 + 3 * val17 * val17 * val16 * val11 + 3 * val17 * val16 * val16 * val13 + val16 * val16 * val16 * val15);
      }
      n = val14, n3 = val15;
    }
  }
  if (!(val3 <= val5)) return {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    cx: 0,
    cy: 0,
    hx: 1,
    hy: 1,
    w: 2,
    h: 2
  };
  let val7 = val5 - val3,
    val8 = val6 - val4;
  return {
    minX: val3,
    minY: val4,
    maxX: val5,
    maxY: val6,
    cx: (val3 + val5) / 2,
    cy: (val4 + val6) / 2,
    hx: val7 / 2,
    hy: val8 / 2,
    w: val7,
    h: val8
  };
}
function obj3(a) {
  let res5 = ref2(a.getAttribute('d'));
  return {
    commands: res5,
    bounds: obj2(res5)
  };
}
function obj4(a) {
  let val3 = update(a, "color")[0],
    val4 = update(a, "size")[0];
  return {
    enabled: a.getAttribute("enabled") !== "false",
    direction: a.getAttribute("direction") || "centered",
    cap: a.getAttribute("cap") || "round",
    endSize: parseFloat(a.getAttribute("end-size")) || 1,
    color: parseHexColor(val3 ? val3.getAttribute("value") : null),
    size: parseFloat(val4 ? val4.getAttribute("value") : '') || 0
  };
}
function render2(a) {
  let val3 = update(a, "color")[0],
    val4 = update(a, "size")[0],
    val5 = update(a, "offset")[0],
    res5 = parseNumberList(val5 ? val5.getAttribute("value") : ''),
    val6 = update(a, "opacity")[0],
    val7 = val6 ? parseFloat(val6.getAttribute("value")) : NaN,
    val8 = val3 ? parseHexColor(val3.getAttribute("value")) : [0, 0, 0, 1];
  return Number.isFinite(val7) ? val8[3] *= val7 : val3 || (val8[3] = 0.5), {
    enabled: a.getAttribute("enabled") !== "false",
    direction: a.getAttribute("direction") || "outside",
    color: val8,
    size: parseFloat(val4 ? val4.getAttribute("value") : '') || 0,
    offset: [res5[0] || 0, res5[1] || 0]
  };
}
function obj5(a, b = 1, c = [0]) {
  let arr2 = [];
  for (let val4 of update(a, 'kf')) {
    let res6 = parseFloat(val4.getAttribute('t'));
    if (Number.isNaN(res6)) continue;
    let res7 = parseNumberList(val4.getAttribute('v')),
      val5 = val4.getAttribute('e') || null;
    arr2.push({
      t: res6,
      v: res7.length ? res7 : [0],
      e: val5,
      easing: obj(val5)
    });
  }
  arr2.sort((a2, b2) => a2.t - b2.t);
  let res5 = parseNumberList(a.getAttribute("value")),
    val3;
  res5.length ? val3 = res5 : arr2.length ? val3 = arr2[0].v.slice() : val3 = c.slice(), val3 = ref(val3, b, c);
  let items3 = arr2.map(a2 => ({
    ...a2,
    v: ref(a2.v, b, val3)
  }));
  return {
    value: val3,
    kfs: items3
  };
}
function res(a, b) {
  return ref3(a, b, []);
}
function ref3(a, b, c = [0, 0, 0, 0]) {
  if (!a) return c[0] = 0, c;
  let val3 = a.kfs;
  if (!val3 || !val3.length) {
    let val6 = a.value;
    for (let n3 = 0; n3 < val6.length; n3++) c[n3] = val6[n3];
    return c;
  }
  let val4 = val3[0],
    val5 = null,
    n = 0;
  if (b <= val3[0].t) val4 = val3[0];else {
    if (b >= val3[val3.length - 1].t) val4 = val3[val3.length - 1];else for (let n3 = 0; n3 < val3.length - 1; n3++) {
      let val6 = val3[n3],
        val7 = val3[n3 + 1];
      if (b < val6.t || b > val7.t) continue;
      val4 = val6, val5 = val7;
      let val8 = val7.t - val6.t;
      n = val8 > 1e-9 ? (b - val6.t) / val8 : 1;
      let res5 = _r(val7.e);
      res5 && (n = res5(n));
      break;
    }
  }
  for (let n3 = 0; n3 < val4.v.length; n3++) {
    let val6 = val4.v[n3];
    c[n3] = val5 ? val6 + ((val5.v[n3] ?? val6) - val6) * n : val6;
  }
  return c;
}
function build(a, b) {
  return res(a, b)[0];
}
function obj6(a) {
  let arr2 = [];
  for (let val3 of update(a, "property")) {
    let attr = val3.getAttribute("type"),
      attr2 = val3.getAttribute("value"),
      val4;
    attr === "color" ? val4 = {
      value: parseHexColor(attr2),
      kfs: []
    } : attr === "bool" ? val4 = {
      value: [attr2 === "true" || attr2 === '1' ? 1 : 0],
      kfs: []
    } : val4 = obj5(val3, xs[attr] || 1, [0]), arr2.push({
      id: val3.getAttribute("name"),
      dataType: attr,
      channel: val4
    });
  }
  return {
    id: a.getAttribute('id') || '',
    shortId: (a.getAttribute('id') || '').split('.').pop(),
    locallyApplied: a.getAttribute("locallyApplied") !== "false",
    hidden: a.getAttribute("hidden") === "true",
    params: arr2
  };
}
var Wr = {
  ...xs,
  point: 2,
  size: 2,
  offset: 2
};
function obj7(a) {
  let val3 = a.getAttribute("type") || "float";
  if (val3 === "color") return {
    dataType: val3,
    channel: {
      value: parseHexColor(a.getAttribute("value")),
      kfs: []
    }
  };
  if (val3 === "bool" || val3 === "switch") {
    let attr = a.getAttribute("value");
    return {
      dataType: val3,
      channel: {
        value: [attr === "true" || attr === '1' ? 1 : 0],
        kfs: []
      }
    };
  }
  return {
    dataType: val3,
    channel: obj5(a, Wr[val3] || 1, [0])
  };
}
function ref4(a) {
  let arr2 = [];
  if (!a) return arr2;
  for (let val3 of String(a).split(';')) {
    let trim = val3.trim();
    if (!trim) continue;
    let items3 = trim.split(',').map(a2 => parseFloat(a2));
    if (items3.length < 2 || !Number.isFinite(items3[0]) || !Number.isFinite(items3[1])) continue;
    let val4 = Number.isFinite(items3[2]) ? items3[2] : 1;
    arr2.push([items3[0], items3[1], val4]);
  }
  return arr2;
}
function obj8(a) {
  return {
    color: parseHexColor(a.getAttribute("color")),
    width: parseFloat(a.getAttribute("width")) || 0,
    type: a.getAttribute("type") || "pen",
    points: ref4(a.getAttribute("points"))
  };
}
function obj9(a) {
  let val3 = 1 / 0,
    val4 = 1 / 0,
    val5 = -1 / 0,
    val6 = -1 / 0;
  for (let val9 of a.strokes || []) {
    let val10 = Math.max(0, val9.width || 0) / 2;
    for (let val11 of val9.points) val11[0] - val10 < val3 && (val3 = val11[0] - val10), val11[0] + val10 > val5 && (val5 = val11[0] + val10), val11[1] - val10 < val4 && (val4 = val11[1] - val10), val11[1] + val10 > val6 && (val6 = val11[1] + val10);
  }
  if (!(val3 <= val5)) return {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    cx: 0,
    cy: 0,
    hx: 1,
    hy: 1,
    w: 2,
    h: 2
  };
  let val7 = val5 - val3,
    val8 = val6 - val4;
  return {
    minX: val3,
    minY: val4,
    maxX: val5,
    maxY: val6,
    cx: (val3 + val5) / 2,
    cy: (val4 + val6) / 2,
    hx: val7 / 2,
    hy: val8 / 2,
    w: val7,
    h: val8
  };
}
function ref5(a, b) {
  let val3 = a && a.layers || [],
    val4 = null;
  for (let n = 0; n < val3.length; n++) {
    let val5 = val3[n];
    val5.tag === "camera" && (b < val5.startTime || b > val5.endTime || (val4 = {
      camera: val5,
      index: n
    }));
  }
  return val4;
}
function ref6(a) {
  let obj23 = {
    location: {
      value: [0, 0, 0],
      kfs: []
    },
    scale: {
      value: [1, 1],
      kfs: []
    },
    rotation: {
      value: [0],
      kfs: []
    },
    opacity: {
      value: [1],
      kfs: []
    },
    pivot: {
      value: [0, 0],
      kfs: []
    },
    skew: {
      value: [0, 0],
      kfs: []
    }
  };
  if (!a) return obj23;
  for (let val3 of update(a)) switch (val3.tagName) {
    case "location":
      obj23.location = obj5(val3, 3, [0, 0, 0]);
      break;
    case "scale":
      obj23.scale = obj5(val3, 2, [1, 1]);
      break;
    case "rotation":
      obj23.rotation = obj5(val3, 1, [0]);
      break;
    case "opacity":
      obj23.opacity = obj5(val3, 1, [1]);
      break;
    case "pivot":
      obj23.pivot = obj5(val3, 2, [0, 0]);
      break;
    case "skew":
      obj23.skew = obj5(val3, 2, [0, 0]);
      break;
    default:
      break;
  }
  return obj23;
}
function build2(a) {
  return a ? {
    type: a.getAttribute("type") || "linear",
    startColor: parseHexColor(a.getAttribute("startColor")),
    endColor: parseHexColor(a.getAttribute("endColor")),
    start: parseNumberList(a.getAttribute("start")),
    end: parseNumberList(a.getAttribute("end")),
    radius: parseNumberList(a.getAttribute("radius")),
    stops: update(a, "stop").map(a2 => ({
      t: parseFloat(a2.getAttribute('t')) || 0,
      color: parseHexColor(a2.getAttribute("color") || a2.getAttribute("value"))
    }))
  } : null;
}
function handle(a) {
  let obj23 = {
    title: a.getAttribute("title") || '',
    width: parseFloat(a.getAttribute("width")) || 1080,
    height: parseFloat(a.getAttribute("height")) || 1920,
    totalTime: parseFloat(a.getAttribute("totalTime")) || 0,
    fps: parseFloat(a.getAttribute("fps")) || 30,
    bgcolor: parseHexColor(a.getAttribute("bgcolor")),
    exportWidth: parseFloat(a.getAttribute("exportWidth")) || 0,
    exportHeight: parseFloat(a.getAttribute("exportHeight")) || 0,
    precompose: a.getAttribute("precompose") || '',
    media: [],
    audio: [],
    bookmarks: [],
    layers: []
  };
  for (let val3 of update(a)) val3.tagName === "media" ? obj23.media.push({
    uri: val3.getAttribute("uri") || '',
    type: val3.getAttribute("type") || '',
    filename: val3.getAttribute("filename") || '',
    title: val3.getAttribute("title") || '',
    duration: parseFloat(val3.getAttribute("duration")) || 0,
    width: parseFloat(val3.getAttribute("width")) || 0,
    height: parseFloat(val3.getAttribute("height")) || 0,
    orientation: parseFloat(val3.getAttribute("orientation")) || 0
  }) : val3.tagName === "audio" ? (obj23.audio.push({
    id: val3.getAttribute('id') || '',
    label: val3.getAttribute("label") || '',
    src: val3.getAttribute("src") || '',
    startTime: parseFloat(val3.getAttribute("startTime")) || 0,
    endTime: parseFloat(val3.getAttribute("endTime")) || 0,
    inTime: parseFloat(val3.getAttribute("inTime")) || 0,
    outTime: parseFloat(val3.getAttribute("outTime")) || 0
  }), obj23.layers.push(ref8(val3))) : val3.tagName === "bookmark" ? obj23.bookmarks.push(parseFloat(val3.getAttribute('t')) || 0) : Cs.has(val3.tagName) && obj23.layers.push(ref8(val3));
  return handle2(obj23), obj23;
}
var Cs = new Set(["shape", "embedScene", "group", "text", "nullobj", "camera", "audio", "drawing"]);
function process(a) {
  if (!a) return '';
  if (typeof a.outerHTML == "string") return a.outerHTML;
  let join3 = Object.entries(a.attributes || {}).map(([a2, a3]) => '\x20' + a2 + '=\x22' + String(a3).replace(/"/g, "&quot;") + '\x22').join(''),
    val3 = a.tagName || "node",
    join4 = (a.children || []).map(process).join(''),
    val4 = a.textContent ? a.textContent.trim() : '';
  return join4 || val4 ? '<' + val3 + join3 + '>' + join4 + val4 + '</' + val3 + '>' : '<' + val3 + join3 + " />";
}
function ref7(a, b) {
  let arr2 = [];
  if (!a || !a.layers) return arr2;
  for (let val3 of a.layers) {
    if (val3.tag !== "audio") continue;
    let val4 = Number(b) || 0;
    val4 < val3.startTime || val4 >= val3.endTime || arr2.push(val3);
  }
  return arr2;
}
function max(a, b) {
  if (!a || a.tag !== "audio") return 0;
  let val3 = Number(b) || 0;
  if (val3 < a.startTime || val3 >= a.endTime) return 0;
  let val4 = a.endTime - a.startTime,
    val5 = val4 > 0 ? Math.max(0, Math.min(1, (val3 - a.startTime) / val4)) : 0,
    res5 = build(a.gain, val5);
  return Math.max(0, Math.min(1, Number.isFinite(res5) ? res5 : 1));
}
function ref8(a) {
  let obj23 = {
    tag: a.tagName,
    id: a.getAttribute('id') || '',
    label: a.getAttribute("label") || '',
    startTime: parseFloat(a.getAttribute("startTime")) || 0,
    endTime: parseFloat(a.getAttribute("endTime")) || 0,
    inTime: parseFloat(a.getAttribute("inTime")) || 0,
    outTime: parseFloat(a.getAttribute("outTime")) || 0,
    src: a.getAttribute("src") || '',
    fillType: a.getAttribute("fillType") || '',
    fillImage: a.getAttribute("fillImage") || '',
    fillVideo: a.getAttribute("fillVideo") || '',
    mediaFillMode: a.getAttribute("mediaFillMode") || "fill",
    hidden: a.getAttribute("hidden") === "true",
    shapeType: (a.getAttribute('s') || '').trim(),
    cornerRadius: 0,
    shapeProps: {},
    strokes: [],
    fov: 0,
    parentId: a.getAttribute("parent") || '',
    parentLayer: null,
    blendMode: a.getAttribute("blending") || a.getAttribute("blendMode") || "normal",
    speed: parseFloat(a.getAttribute("speed")) || 1,
    gain: {
      value: [1],
      kfs: []
    },
    sourceXml: process(a),
    link: a.getAttribute("link") || '',
    fontSize: parseFloat(a.getAttribute("size")) || 18,
    font: a.getAttribute("font") || '',
    wrapWidth: parseFloat(a.getAttribute("wrapWidth")) || 0,
    align: a.getAttribute("align") || "center",
    textContent: '',
    transform: {
      location: {
        value: [0, 0, 0],
        kfs: []
      },
      scale: {
        value: [1, 1],
        kfs: []
      },
      rotation: {
        value: [0],
        kfs: []
      },
      opacity: {
        value: [1],
        kfs: []
      }
    },
    fillColor: [1, 1, 1, 1],
    gradient: null,
    path: null,
    pathStroke: null,
    shadow: null,
    size: {
      value: [100, 100],
      kfs: []
    },
    effects: [],
    children: [],
    scene: null
  };
  obj23.endTime <= obj23.startTime && (obj23.endTime = obj23.startTime + 1);
  for (let val3 of update(a)) switch (val3.tagName) {
    case "content":
      obj23.textContent = val3.textContent || '';
      break;
    case "transform":
      obj23.transform = ref6(val3);
      break;
    case "fillType":
      {
        let attr = val3.getAttribute("value");
        attr && (obj23.fillType = attr);
        let val4 = update(val3, "fillColor")[0];
        val4 && (obj23.fillColor = parseHexColor(val4.getAttribute("value")));
        break;
      }
    case "fillColor":
      obj23.fillColor = parseHexColor(val3.getAttribute("value"));
      break;
    case "gradient":
      obj23.gradient = build2(val3);
      break;
    case "path":
      obj23.path = obj3(val3);
      break;
    case "path-stroke":
      obj23.pathStroke = obj4(val3);
      break;
    case "shadow":
      obj23.shadow = render2(val3);
      break;
    case "border":
      {
        let val4 = update(val3, "color")[0],
          val5 = update(val3, "size")[0];
        obj23.border = {
          direction: val3.getAttribute("direction") || "outside",
          color: val4 ? parseHexColor(val4.getAttribute("value")) : [1, 1, 1, 1],
          size: parseFloat(val5 ? val5.getAttribute("value") : '') || 0
        };
        break;
      }
    case "effect":
      obj23.effects.push(obj6(val3));
      break;
    case "stroke":
      obj23.tag === "drawing" && obj23.strokes.push(obj8(val3));
      break;
    case "gain":
      obj23.gain = obj5(val3, 1, [1]);
      break;
    case "fov":
      {
        let res5 = parseFloat(val3.getAttribute("value"));
        Number.isFinite(res5) && res5 > 0 && (obj23.fov = res5);
        break;
      }
    case "property":
      {
        let attr = val3.getAttribute("name");
        if (attr === "size") obj23.size = obj5(val3, 2, [0, 0]);else {
          if (attr === "cornerRadius") obj23.cornerRadius = parseFloat(val3.getAttribute("value")) || 0;else {
            if (attr === "startAngle") obj23.startAngle = obj5(val3, 1, [0]);else {
              if (attr === "endAngle") obj23.endAngle = obj5(val3, 1, [360]);else {
                if (attr === "blendMode" || attr === "blending" || attr === "blend") {
                  let attr2 = val3.getAttribute("value");
                  attr2 && (obj23.blendMode = attr2);
                }
              }
            }
          }
        }
        attr && (obj23.shapeProps[attr] = obj7(val3));
        break;
      }
    case "scene":
      obj23.scene = handle(val3);
      break;
    default:
      obj23.tag === "group" && Cs.has(val3.tagName) && obj23.children.push(ref8(val3));
      break;
  }
  return obj23;
}
function get2(a) {
  let map = new Map(),
    fn8 = a2 => {
      for (let val3 of a2.layers || []) val3.id && map.set(val3.id, val3), fn8(val3), val3.scene && fn8(val3.scene);
    };
  fn8(a);
  let fn9 = a2 => {
    for (let val3 of a2.layers || []) {
      if (val3.parentId) {
        let get23 = map.get(val3.parentId);
        get23 && get23 !== val3 && (val3.parentLayer = get23);
      }
      fn9(val3), val3.scene && fn9(val3.scene);
    }
  };
  fn9(a);
  let arr2 = [...map.values()];
  for (let val3 of arr2) {
    let n = 0,
      val4 = val3.parentLayer;
    for (; val4 && n++ < 64;) {
      if (val4 === val3) {
        val3.parentLayer = null;
        break;
      }
      val4 = val4.parentLayer;
    }
  }
  return a.layerById = map, map;
}
function update2(a, b = '') {
  let parseFromString = new DOMParser().parseFromString(a, "text/xml");
  if (parseFromString.getElementsByTagName("parsererror").length) throw new Error(b + ": XML tidak valid.");
  let val3 = parseFromString.documentElement;
  if ((!val3 || val3.tagName !== "scene") && (val3 = parseFromString.getElementsByTagName("scene")[0]), !val3) throw new Error(b + ": tidak menemukan elemen <scene>.");
  let res5 = handle(val3);
  return get2(res5), res5.filename = b, res5;
}
function build3(a, b) {
  let val3 = a.endTime - a.startTime;
  return val3 <= 0 ? 0 : (b - a.startTime) / val3;
}
function handle2(a) {
  if (!a || !Array.isArray(a.media)) return a;
  let map = new Map();
  for (let val3 of a.media) for (let val4 of [val3.uri, val3.filename, val3.title]) val4 && map.set(val4, val3);
  let fn8 = a2 => {
    if (!(!a2 || !Array.isArray(a2.layers))) for (let val3 of a2.layers) {
      let val4 = val3.fillVideo || val3.fillImage || '',
        val5 = val4 ? map.get(val4) : null;
      val5 && (val3.mediaNativeWidth = val5.width || 0, val3.mediaNativeHeight = val5.height || 0, val3.mediaOrientation = ((Number(val5.orientation) || 0) % 360 + 360) % 360), val3.scene && fn8(val3.scene);
    }
  };
  return fn8(a), a;
}
function process2(a, b) {
  return !a || !a.children ? [] : Array.from(a.children).filter(a2 => !b || a2.tagName === b);
}
function compute2(a, b = '') {
  let parseFromString = new DOMParser().parseFromString(a, "text/xml");
  if (parseFromString.getElementsByTagName("parsererror").length) throw new Error(b + ": XML bentuk tidak valid.");
  let val3 = parseFromString.documentElement;
  if ((!val3 || val3.tagName !== "shape") && (val3 = parseFromString.getElementsByTagName("shape")[0]), !val3) throw new Error(b + ": tidak menemukan elemen <shape>.");
  let arr2 = [],
    val4 = process2(val3, "params")[0];
  if (val4) for (let val6 of process2(val4)) {
    let attr = val6.getAttribute('id');
    attr && arr2.push({
      id: attr,
      type: val6.tagName,
      defaultValue: val6.getAttribute("default")
    });
  }
  let val5 = process2(val3, "script")[0],
    str = '';
  return val5 && (str = (val5.textContent || '').replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '')), {
    id: val3.getAttribute('id') || '',
    filename: b,
    params: arr2,
    code: str
  };
}
function render3(a) {
  let val3 = a.defaultValue;
  if (a.type === "point" || a.type === "vec2" || a.type === "size" || a.type === "offset") {
    let items3 = String(val3 || "0,0").split(',').map(a2 => parseFloat(a2));
    return {
      x: Number.isFinite(items3[0]) ? items3[0] : 0,
      y: Number.isFinite(items3[1]) ? items3[1] : 0
    };
  }
  if (a.type === "switch" || a.type === "bool") return val3 === "true" || val3 === '1';
  if (a.type === "color") return {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  };
  let res5 = parseFloat(val3);
  return Number.isFinite(res5) ? res5 : 0;
}
function apply2(a, b, c) {
  let val3 = a.type;
  return val3 === "point" || val3 === "vec2" || val3 === "size" || val3 === "offset" ? ((!c || typeof c != "object" || c.x === void 0) && (c = {
    x: 0,
    y: 0
  }), c.x = b[0] || 0, c.y = b[1] || 0, c) : val3 === "color" ? ((!c || typeof c != "object" || c.r === void 0) && (c = {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  }), c.r = b[0] || 0, c.g = b[1] || 0, c.b = b[2] || 0, c.a = b[3] === void 0 ? 1 : b[3], c) : val3 === "switch" || val3 === "bool" ? !!b[0] : Number.isFinite(b[0]) ? b[0] : 0;
}
function obj10(a) {
  if (!a || !a.code) throw new Error("Bentuk " + (a && a.id) + ": tidak punya script getPath.");
  let res5 = new Function(a.code + "\n;return typeof getPath === 'function' ? getPath : null;")();
  if (typeof res5 != "function") throw new Error("Bentuk " + a.id + ": script tidak mendefinisikan getPath(params).");
  return {
    definition: a,
    getPath: res5
  };
}
function ref9(a, b, c) {
  let val3 = a.definition,
    val4 = b.mt || (b.mt = {}),
    val5 = val4.obj || (val4.obj = {}),
    val6 = val4.vec || (val4.vec = [0, 0, 0, 0]);
  for (let val7 of val3.params) {
    let val8 = b.shapeProps && b.shapeProps[val7.id];
    if (!val8) {
      val5[val7.id] === void 0 && (val5[val7.id] = render3(val7));
      continue;
    }
    let val9 = val8.channel ? ref3(val8.channel, c, val6) : val6;
    val5[val7.id] = apply2(val7, val9, val5[val7.id]);
  }
  return val5;
}
function ref10(a) {
  let arr2 = [];
  if (!a || !a.length) return arr2;
  let val3 = null,
    val4 = null,
    val5 = null,
    val6 = null,
    flag3 = false;
  for (let val7 of a) {
    if (!val7) continue;
    if (val7.closed) {
      if (flag3 && val5) {
        let val11 = val4 || val3,
          val12 = val6 || val5;
        (val11[0] !== val3[0] || val11[1] !== val3[1] || val12[0] !== val5[0] || val12[1] !== val5[1]) && arr2.push(['C', val11[0], val11[1], val12[0], val12[1], val5[0], val5[1]]), arr2.push(['Z']);
      }
      val3 = null, val4 = null, val5 = null, val6 = null, flag3 = false;
      continue;
    }
    let val8 = null,
      val9 = null,
      val10 = null;
    if (Array.isArray(val7) ? val8 = [val7[0], val7[1]] : (val7.p ? val8 = [val7.p[0], val7.p[1]] : val7.x !== void 0 && (val8 = [val7.x, val7.y]), val7.in && (val9 = [val7.in[0], val7.in[1]]), val7.out && (val10 = [val7.out[0], val7.out[1]])), !(!val8 || !Number.isFinite(val8[0]) || !Number.isFinite(val8[1]))) {
      if (!flag3) arr2.push(['M', val8[0], val8[1]]), flag3 = true, val5 = val8, val6 = val9;else {
        let val11 = val4 || val3,
          val12 = val9 || val8;
        val11[0] === val3[0] && val11[1] === val3[1] && val12[0] === val8[0] && val12[1] === val8[1] ? arr2.push(['L', val8[0], val8[1]]) : arr2.push(['C', val11[0], val11[1], val12[0], val12[1], val8[0], val8[1]]);
      }
      val3 = val8, val4 = val10;
    }
  }
  return arr2;
}
var Xn = [65, 77, 83, 72],
  fd = typeof TextEncoder < 'u' ? new TextEncoder() : null,
  Wi = typeof TextDecoder < 'u' ? new TextDecoder() : null,
  zn = new Uint32Array([1634760805, 857760878, 2036477234, 1797285236]),
  ec = new Uint32Array([2654435769, 2246822507, 3266489909, 668265263, 374761393, 3550635116, 4251993797, 3042594569]),
  _e = new Uint32Array(16),
  Bs = new Uint32Array(16),
  rn = new Uint8Array(64);
function handle3(a, b) {
  return (a << b | a >>> 32 - b) >>> 0;
}
function process3(a, b, c, d, arg) {
  a[b] = a[b] + a[c] >>> 0, a[arg] = handle3(a[arg] ^ a[b], 16), a[d] = a[d] + a[arg] >>> 0, a[c] = handle3(a[c] ^ a[d], 12), a[b] = a[b] + a[c] >>> 0, a[arg] = handle3(a[arg] ^ a[b], 8), a[d] = a[d] + a[arg] >>> 0, a[c] = handle3(a[c] ^ a[d], 7);
}
function compute3(a, b) {
  for (let n = 0; n < 16; n++) b[n] = a[n];
  for (let n = 0; n < 10; n++) process3(b, 0, 4, 8, 12), process3(b, 1, 5, 9, 13), process3(b, 2, 6, 10, 14), process3(b, 3, 7, 11, 15), process3(b, 0, 5, 10, 15), process3(b, 1, 6, 11, 12), process3(b, 2, 7, 8, 13), process3(b, 3, 4, 9, 14);
  for (let n = 0; n < 16; n++) b[n] = b[n] + a[n] >>> 0;
}
function ref11(a, b) {
  let uint8Array = new Uint8Array(a.length);
  _e[0] = zn[0], _e[1] = zn[1], _e[2] = zn[2], _e[3] = zn[3];
  for (let n = 0; n < 8; n++) _e[4 + n] = ec[n];
  _e[12] = 0, _e[13] = b >>> 0, _e[14] = 0, _e[15] = 0;
  for (let n = 0; n < a.length; n += 64) {
    compute3(_e, Bs);
    for (let n3 = 0; n3 < 16; n3++) {
      let val3 = Bs[n3];
      rn[n3 * 4] = val3 & 255, rn[n3 * 4 + 1] = val3 >>> 8 & 255, rn[n3 * 4 + 2] = val3 >>> 16 & 255, rn[n3 * 4 + 3] = val3 >>> 24 & 255;
    }
    let min = Math.min(64, a.length - n);
    for (let n3 = 0; n3 < min; n3++) uint8Array[n + n3] = a[n + n3] ^ rn[n3];
  }
  return uint8Array;
}
function apply3(a) {
  throw new Error("bentuk: " + a);
}
function get3(a) {
  Wi || apply3("TextDecoder tidak tersedia");
  let val3 = a instanceof Uint8Array ? a : new Uint8Array(a);
  val3.length < 8 && apply3("data bentuk terlalu pendek"), (val3[0] !== Xn[0] || val3[1] !== Xn[1] || val3[2] !== Xn[2] || val3[3] !== Xn[3]) && apply3("header bentuk tidak dikenal (bukan AMSH)");
  let dataView = new DataView(val3.buffer, val3.byteOffset, val3.byteLength),
    n = 4,
    getUint16 = dataView.getUint16(n, true);
  n += 2, getUint16 !== 1 && apply3("versi format bentuk " + getUint16 + " tidak didukung (butuh 1)"), n += 2;
  let getUint32 = dataView.getUint32(n, true);
  n += 4;
  let array = new Array(getUint32);
  for (let n3 = 0; n3 < getUint32; n3++) {
    let getUint322 = dataView.getUint32(n, true);
    n += 4, n + getUint322 > val3.length && apply3("tabel string bentuk terpotong"), array[n3] = Wi.decode(val3.subarray(n, n + getUint322)), n += getUint322;
  }
  let fn8 = a2 => {
      n + a2 > val3.length && apply3("data bentuk terpotong");
    },
    fn9 = a2 => a2 === 65535 ? null : array[a2],
    fn10 = () => {
      fn8(2);
      let getUint162 = dataView.getUint16(n, true);
      return n += 2, getUint162;
    },
    fn11 = () => {
      fn8(4);
      let getUint322 = dataView.getUint32(n, true);
      return n += 4, getUint322;
    },
    res5 = fn9(fn10()),
    res6 = fn9(fn10()),
    res7 = fn10(),
    array2 = new Array(res7);
  for (let n3 = 0; n3 < res7; n3++) array2[n3] = {
    id: fn9(fn10()),
    type: fn9(fn10()),
    defaultValue: fn9(fn10())
  };
  let res8 = fn11(),
    str = '';
  return res8 !== 4294967295 && (fn8(res8), str = Wi.decode(ref11(val3.subarray(n, n + res8), 0)), n += res8), {
    id: res5,
    filename: res6,
    params: array2,
    code: str
  };
}
var _s = ["distort", "color", "procedural", "blur", '3d', "transform", "drawing", "matte", "opacity", "repeat", "text", "other"],
  Ds = "am.exp.config",
  $t = Object.freeze({
    enabled: false,
    profiler: false,
    overdrawCapOn: false,
    overdrawCap: 0.1,
    categoryMode: "off",
    categorySet: [],
    invalidateTargets: false,
    domainBucket: '0',
    fragPrecision: "highp"
  }),
  Vi = [{
    key: "profiler",
    label: "Profiler (CPU + GPU timer)",
    kind: "bool",
    fidelity: "identical",
    hint: "Menambah overhead. Hasil lewat \"Salin profil\"."
  }, {
    key: "overdrawCapOn",
    label: "Batasi overdraw efek",
    kind: "bool",
    fidelity: "edges",
    hint: "Efek yang minta overdraw lebih besar diberi batas ini (dijepit, tidak ditolak)."
  }, {
    key: "overdrawCap",
    label: "Batas overdraw",
    kind: "num",
    min: 0,
    max: 0.5,
    step: 0.05,
    fidelity: "edges",
    hint: "0 = tanpa overdraw sama sekali; permukaan overscan ikut mengecil."
  }, {
    key: "categoryMode",
    label: "Filter kategori efek",
    kind: "select",
    options: ["off", "only", "skip"],
    fidelity: "visible",
    hint: "only = hanya kategori terpilih yang jalan; skip = kategori terpilih dilewati."
  }, {
    key: "invalidateTargets",
    label: "Invalidate framebuffer (GPU tile)",
    kind: "bool",
    fidelity: "identical",
    hint: "WebGL2 saja. Lewati pass yang bisa discard."
  }, {
    key: "domainBucket",
    label: "Bulatkan ukuran domain efek (px)",
    kind: "select",
    options: ['0', '16', '32', '64'],
    fidelity: "edges",
    hint: "Kurangi buat/buang tekstur per frame pada efek overdraw."
  }, {
    key: "fragPrecision",
    label: "Presisi fragment shader",
    kind: "select",
    options: ["highp", "mediump"],
    fidelity: "visible",
    hint: "mediump bisa bikin banding. Berlaku saat preset dimuat ulang."
  }],
  Os = {
    aman: {
      invalidateTargets: true,
      domainBucket: '64'
    },
    cepat: {
      invalidateTargets: true,
      domainBucket: '64',
      overdrawCapOn: true,
      overdrawCap: 0.1
    },
    ekstrem: {
      invalidateTargets: true,
      domainBucket: '64',
      overdrawCapOn: true,
      overdrawCap: 0,
      categoryMode: "skip",
      categorySet: ["blur"],
      fragPrecision: "mediump"
    },
    profil: {
      profiler: true
    }
  };
function ref12() {
  let obj23 = {
    ...$t,
    categorySet: []
  };
  try {
    if (typeof localStorage > 'u') return obj23;
    let getItem = localStorage.getItem(Ds);
    if (!getItem) return obj23;
    let parse = JSON.parse(getItem);
    if (parse && typeof parse == "object") {
      for (let val3 of Object.keys($t)) val3 in parse && (obj23[val3] = parse[val3]);
    }
  } catch {}
  return obj23;
}
function build4(a) {
  try {
    localStorage.setItem(Ds, JSON.stringify(a));
  } catch {}
}
function handle4(a) {
  if (!a || !a.enabled) return null;
  let arr2 = [],
    val3 = !!a.overdrawCapOn,
    val4 = val3 ? Math.max(0, Math.min(0.5, Number(a.overdrawCap))) : 1 / 0;
  val3 && Number.isFinite(val4) && arr2.push("overdraw<=" + val4);
  let val5 = a.categoryMode === "only" || a.categoryMode === "skip" ? a.categoryMode : "off",
    set = new Set(Array.isArray(a.categorySet) ? a.categorySet : []),
    val6 = val5 !== "off" && (val5 === "skip" ? set.size > 0 : true);
  val6 && arr2.push("kategori " + val5 + ':\x20' + ([...set].join(',') || "(kosong)"));
  let val7 = Number(a.domainBucket) || 0;
  val7 > 0 && arr2.push("bucket " + val7 + 'px'), a.invalidateTargets && arr2.push("invalidate");
  let val8 = a.fragPrecision === "mediump" ? "mediump" : "highp";
  return val8 === "mediump" && arr2.push("mediump"), a.profiler && arr2.push("profiler"), arr2.length ? Object.freeze({
    profiler: !!a.profiler,
    overdrawCap: val4,
    categoryMode: val6 ? val5 : "off",
    categorySet: set,
    invalidate: !!a.invalidateTargets,
    bucket: val7,
    fragPrecision: val8,
    active: arr2
  }) : null;
}
function process4(a, b) {
  if (b.categoryMode === "off") return true;
  let val3 = a && a.category || "other";
  return b.categoryMode === "only" ? b.categorySet.has(val3) : !b.categorySet.has(val3);
}
function compute4(a, b, c, d, arg, arg2) {
  if (!b || a.empty) return a;
  let ceil = Math.ceil(c + arg),
    ceil2 = Math.ceil(d + arg2),
    val3 = a.x + a.w,
    val4 = a.y + a.h,
    max5 = Math.max(val3, Math.min(a.x + Math.ceil(a.w / b) * b, ceil)),
    max6 = Math.max(val4, Math.min(a.y + Math.ceil(a.h / b) * b, ceil2));
  return a.w = max5 - a.x, a.h = max6 - a.y, a.origin[0] = a.x / c, a.origin[1] = (d - max6) / d, a.size[0] = a.w / c, a.size[1] = a.h / d, a;
}
var ic = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
function n2(a) {
  return 2;
}
var ji = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
function apply4(a, b, c) {
  let val3 = b[0] * c[0] + b[2] * c[1],
    val4 = b[1] * c[0] + b[3] * c[1],
    val5 = b[0] * c[2] + b[2] * c[3],
    val6 = b[1] * c[2] + b[3] * c[3],
    val7 = b[0] * c[4] + b[2] * c[5] + b[4],
    val8 = b[1] * c[4] + b[3] * c[5] + b[5];
  a[0] = val3, a[1] = val4, a[2] = val5, a[3] = val6, a[4] = val7, a[5] = val8;
}
var qi = [1, 1],
  Gn = [36064],
  we = new Float64Array([1, 0, 0, 1, 0, 0]),
  Xs = new Float64Array(6),
  vd = new Float64Array(6);
function get4() {
  let n = 192;
  try {
    let number = Number(globalThis.navigator && globalThis.navigator.deviceMemory);
    Number.isFinite(number) && number > 0 && (n = number <= 2 ? 128 : number <= 4 ? 192 : 256);
  } catch {}
  return n * 1048576;
}
function update3(a, b, c, d, arg, arg2 = 0, arg3 = 0, arg4 = 0) {
  let max5 = Math.max(0, Number.isFinite(arg2) ? arg2 : 0),
    val3 = b * (1 + max5 * 2) / 2,
    val4 = c * (1 + max5 * 2) / 2,
    val5 = a[0],
    val6 = a[1],
    val7 = a[2],
    val8 = a[3],
    val9 = a[4],
    val10 = a[5],
    val11 = 1 / 0,
    val12 = 1 / 0,
    val13 = -1 / 0,
    val14 = -1 / 0;
  for (let n = 0; n < 4; n++) {
    let val16 = n & 1 ? val3 : -val3,
      val17 = n & 2 ? val4 : -val4,
      val18 = val5 * val16 + val7 * val17 + val9,
      val19 = val6 * val16 + val8 * val17 + val10;
    val18 < val11 && (val11 = val18), val18 > val13 && (val13 = val18), val19 < val12 && (val12 = val19), val19 > val14 && (val14 = val19);
  }
  val11 = Math.max(Math.floor(val11), Math.floor(-arg3)), val12 = Math.max(Math.floor(val12), Math.floor(-arg4)), val13 = Math.min(Math.ceil(val13), Math.ceil(d + arg3)), val14 = Math.min(Math.ceil(val14), Math.ceil(arg + arg4));
  let val15 = !(val13 > val11 && val14 > val12);
  return val15 && (val13 = val11 + 1, val14 = val12 + 1), {
    x: val11,
    y: val12,
    w: val13 - val11,
    h: val14 - val12,
    empty: val15,
    origin: [val11 / d, (arg - val14) / arg],
    size: [(val13 - val11) / d, (val14 - val12) / arg]
  };
}
function build5(a, b, c, d, arg, arg2) {
  let val3 = b[0],
    val4 = b[1],
    val5 = b[2],
    val6 = b[3],
    val7 = b[4],
    val8 = b[5],
    val9 = val3 * c / arg,
    val10 = -val5 * d / arg,
    val11 = (-val3 * c / 2 + val5 * d / 2 + val7) / arg,
    val12 = -val4 * c / arg2,
    val13 = val6 * d / arg2,
    val14 = 1 - (-val4 * c / 2 + val6 * d / 2 + val8) / arg2,
    val15 = a.toScreen;
  val15[0] = val9, val15[1] = val10, val15[2] = 0, val15[3] = val11, val15[4] = val12, val15[5] = val13, val15[6] = 0, val15[7] = val14, val15[8] = 0, val15[9] = 0, val15[10] = 1, val15[11] = 0, val15[12] = 0, val15[13] = 0, val15[14] = 0, val15[15] = 1;
  let val16 = val9 * val13 - val10 * val12;
  Math.abs(val16) < 1e-12 && (val16 = val16 < 0 ? -1e-12 : 1e-12);
  let val17 = val13 / val16,
    val18 = -val12 / val16,
    val19 = -val10 / val16,
    val20 = val9 / val16,
    val21 = a.toLayer;
  val21[0] = val17, val21[1] = val19, val21[2] = 0, val21[3] = -(val17 * val11 + val19 * val14), val21[4] = val18, val21[5] = val20, val21[6] = 0, val21[7] = -(val18 * val11 + val20 * val14), val21[8] = 0, val21[9] = 0, val21[10] = 1, val21[11] = 0, val21[12] = 0, val21[13] = 0, val21[14] = 0, val21[15] = 1, a.sizePx[0] = c * Math.hypot(val3, val4), a.sizePx[1] = d * Math.hypot(val5, val6), a.sizeNorm[0] = Math.hypot(val9, val12), a.sizeNorm[1] = Math.hypot(val10, val13), a.centerPx[0] = val7, a.centerPx[1] = val8, a.centerNorm[0] = val7 / arg, a.centerNorm[1] = 1 - val8 / arg2, a.valid = true;
}
function handle5(a) {
  let round = Math.round(Math.max(0, Math.min(1, a[0] || 0)) * 255),
    round2 = Math.round(Math.max(0, Math.min(1, a[1] || 0)) * 255),
    round3 = Math.round(Math.max(0, Math.min(1, a[2] || 0)) * 255),
    val3 = a[3] === void 0 ? 1 : Math.max(0, Math.min(1, a[3]));
  return "rgba(" + round + ',' + round2 + ',' + round3 + ',' + val3.toFixed(3) + ')';
}
var zs = {
    normal: [1, 771],
    add: [1, 1],
    plus: [1, 1],
    'linear-dodge': [1, 1],
    screen: [1, 769],
    multiply: [774, 771],
    mask: [0, 770],
    'clipping-mask': [0, 770],
    'mask-fill': [1, 771],
    'mask-exclude': [0, 771],
    exclude: [0, 771],
    'dst-in': [0, 770],
    'dst-out': [0, 771]
  },
  Ws = ["vec3 blendRgb2hsv(vec3 c) {", "    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);", "    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));", "    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));", "    float d = q.x - min(q.w, q.y);", "    float e = 1.0e-10;", "    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);", '}', "vec3 blendHsv2rgb(vec3 c) {", "    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);", "    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);", "    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);", '}'].join('\x0a'),
  Vs = {
    'soft-overlay': "vec3 t = step(0.5, bot); vec3 result = t * (1. - (1.-bot) * (1.-(top-0.5))) + (1.-t) * (bot * (top+0.5));",
    'soft-light': "vec3 t = step(0.5, top); vec3 result = t * (1. - (1.-bot) * (1.-(top-0.5))) + (1.-t) * (bot * (top+0.5));",
    overlay: "vec3 t = step(0.5, bot); vec3 result = t * (1. - (1.-2.*(bot-0.5)) * (1.-top)) + (1.-t) * ((2.*bot) * top);",
    'hard-light': "vec3 t = step(0.5, top); vec3 result = t * (1. - (1.-bot) * (1.-2.*(top-0.5))) + (1.-t) * (bot * (2.*top));",
    'linear-light': "vec3 t = step(0.5, top); vec3 result = t * (bot + 2.*(top-0.5)) + (1.-t) * (bot + 2.*top - 1.);",
    'vivid-light': "vec3 t = step(0.5, top); vec3 result = t * (1. - (1.-bot) * (2.*(top-0.5))) + (1.-t) * (bot * (1.-2.*top));",
    'pin-light': "vec3 t = step(0.5, top); vec3 result = t * max(bot, 2.*(top-0.5)) + (1.-t) * min(bot, 2.*top);",
    darken: "vec3 result = min(top, bot);",
    lighten: "vec3 result = max(top, bot);",
    diff: "vec3 result = abs(bot - top);",
    difference: "vec3 result = abs(bot - top);",
    exclusion: "vec3 result = 0.5 - 2.*(bot-0.5)*(top-0.5);",
    'color-dodge': "vec3 result = bot / max(1. - top, 1e-4);",
    'color-burn': "vec3 result = 1. - (1.-bot) / max(top, 1e-4);",
    'linear-burn': "vec3 result = top + bot - 1.;",
    subtract: "vec3 result = bot - top;",
    divide: "vec3 result = bot / max(top, 1e-4);",
    'lighter-color': "vec3 lw = vec3(0.2126, 0.7152, 0.0722); vec3 result = length(lw * top) > length(lw * bot) ? top : bot;",
    'darker-color': "vec3 lw = vec3(0.2126, 0.7152, 0.0722); vec3 result = length(lw * top) > length(lw * bot) ? bot : top;",
    hue: {
      header: Ws,
      body: "vec3 result = blendHsv2rgb(vec3(blendRgb2hsv(top).r, blendRgb2hsv(bot).gb));"
    },
    saturation: {
      header: Ws,
      body: "vec3 botHsv = blendRgb2hsv(bot); vec3 result = blendHsv2rgb(vec3(botHsv.r, blendRgb2hsv(top).g, botHsv.b));"
    },
    color: "mat3 rgb2yuv = mat3(0.299, 0.587, 0.114, -0.14713, -0.28886, 0.436, 0.615, -0.51499, -0.10001); mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983, 1.0, -0.39465, -0.58060, 1.0, 2.03211, 0.0); vec3 result = vec3((bot * rgb2yuv).r, (top * rgb2yuv).gb) * yuv2rgb;",
    luminance: "mat3 rgb2yuv = mat3(0.299, 0.587, 0.114, -0.14713, -0.28886, 0.436, 0.615, -0.51499, -0.10001); mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983, 1.0, -0.39465, -0.58060, 1.0, 2.03211, 0.0); vec3 result = vec3((top * rgb2yuv).r, (bot * rgb2yuv).gb) * yuv2rgb;"
  };
function process5(a) {
  return typeof a != "string" || !a ? "normal" : a.trim().replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().replace(/[\s_]+/g, '-');
}
var rc = {
    spinner: "float",
    slider: "float",
    float: "float",
    switch: "bool",
    selector: "int",
    point: "vec2",
    xyz: "vec3",
    'hue-disc': "vec3",
    color: "vec4",
    orient: "mat4"
  },
  cc = {
    normal: "source-over",
    mask: "destination-in",
    'clipping-mask': "destination-in",
    'mask-fill': "source-over",
    'mask-exclude': "destination-out",
    exclude: "destination-out",
    multiply: "multiply",
    screen: "screen",
    add: "lighter",
    plus: "lighter",
    'linear-dodge': "lighter",
    overlay: "overlay",
    'soft-overlay': "overlay",
    'soft-light': "soft-light",
    'hard-light': "hard-light",
    'linear-light': "hard-light",
    'vivid-light': "hard-light",
    'pin-light': "hard-light",
    darken: "darken",
    lighten: "lighten",
    'lighter-color': "lighten",
    'darker-color': "darken",
    'color-dodge': "color-dodge",
    'color-burn': "color-burn",
    'linear-burn': "multiply",
    diff: "difference",
    difference: "difference",
    exclusion: "exclusion",
    hue: "hue",
    saturation: "saturation",
    color: "color",
    luminance: "luminosity"
  };
function obj11(a, b) {
  let max5 = Math.max(0, Number(a.inTime) || 0),
    val3 = Number(a.outTime) || 0,
    val4 = val3 > max5,
    val5 = Number.isFinite(b) && b > 0,
    val6 = val4 ? val3 : val5 ? b * 1000 : 1 / 0;
  return {
    startMs: max5,
    endMs: val6,
    spanMs: Math.max(1, a.endTime - a.startTime)
  };
}
function max2(a, b, c) {
  if (!(Number.isFinite(c) && c > 0)) return null;
  let {
      startMs: res5,
      endMs: res6,
      spanMs: res7
    } = obj11(a, c),
    val3 = res6 - res5;
  if (!(val3 > 1)) return res5 / 1000;
  let max5 = Math.max(0, b);
  max5 >= val3 && (max5 = res7 > val3 + 1 ? max5 % val3 : val3);
  let val4 = (res5 + max5) / 1000;
  return Math.max(0, Math.min(c - 0.001, val4));
}
function obj12(a) {
  let fn8 = a2 => Number(a2) > 0 ? Number(a2) : 0,
    val3 = fn8(a && a.width) || fn8(a && a.exportWidth) || 1080,
    val4 = fn8(a && a.height) || fn8(a && a.exportHeight) || 1920;
  return {
    w: val3,
    h: val4
  };
}
function get5(a) {
  let val3 = ((Number(a && a.mediaOrientation) || 0) % 360 + 360) % 360;
  return val3 === 90 || val3 === 180 || val3 === 270 ? val3 : 0;
}
function update4(a, b, c) {
  let res5 = get5(a);
  if (!res5) return 0;
  let val3 = Number(a && a.mediaNativeWidth) || 0,
    val4 = Number(a && a.mediaNativeHeight) || 0;
  return (res5 === 90 || res5 === 270) && val3 > 0 && val4 > 0 && val3 !== val4 && b === val3 && c === val4 ? 0 : (360 - res5) % 360;
}
function obj13(a, b, c, d, arg, arg2) {
  let val3 = a === 90 || a === 270,
    val4 = val3 ? c : b,
    val5 = val3 ? b : c,
    ref24 = d,
    arg3 = arg;
  if (arg2 !== "stretch") {
    let val6 = arg2 === "fit" ? Math.min(d / val4, arg / val5) : Math.max(d / val4, arg / val5);
    val6 > 0 && (ref24 = val4 * val6, arg3 = val5 * val6);
  }
  return {
    dw: val3 ? arg3 : ref24,
    dh: val3 ? ref24 : arg3
  };
}
function obj14(a, b, c, d, arg) {
  if (a === "stretch" || !(b > 0) || !(c > 0)) return {
    sx: 0,
    sy: 0,
    sw: b,
    sh: c
  };
  let val3 = a === "fit" ? Math.min(d / b, arg / c) : Math.max(d / b, arg / c);
  if (!(val3 > 0)) return {
    sx: 0,
    sy: 0,
    sw: b,
    sh: c
  };
  let min = Math.min(b, d / val3),
    min2 = Math.min(c, arg / val3);
  return {
    sx: (b - min) / 2,
    sy: (c - min2) / 2,
    sw: min,
    sh: min2
  };
}
function process6(a, b = 1500) {
  return !a || a.readyState >= 2 ? Promise.resolve() : new Promise(a2 => {
    let fn8 = () => {
        clearTimeout(res5), a.removeEventListener("loadedmetadata", fn8), a.removeEventListener("loadeddata", fn8), a.removeEventListener("canplay", fn8), a.removeEventListener("error", fn8), a2();
      },
      res5 = setTimeout(fn8, b);
    a.addEventListener("loadedmetadata", fn8, {
      once: true
    }), a.addEventListener("loadeddata", fn8, {
      once: true
    }), a.addEventListener("canplay", fn8, {
      once: true
    }), a.addEventListener("error", fn8, {
      once: true
    });
  });
}
function flag(a, b) {
  let val3 = a.seekable;
  if (!val3 || !val3.length) return true;
  for (let n = 0; n < val3.length; n++) if (b >= val3.start(n) - 0.05 && b <= val3.end(n) + 0.05) return true;
  return false;
}
function render4(a, b, c = 5000) {
  return a ? new Promise((a2, b2) => {
    let flag3 = false,
      n = 0,
      n3 = 0,
      n4 = 0,
      fn8 = () => {
        if (clearTimeout(n), clearTimeout(n4), a.removeEventListener("seeked", fn12), a.removeEventListener("loadeddata", fn13), n3 && typeof a.cancelVideoFrameCallback == "function") try {
          a.cancelVideoFrameCallback(n3);
        } catch {}
        n3 = 0;
      },
      fn9 = a3 => {
        flag3 || (flag3 = true, fn8(), b2(a3));
      },
      fn10 = (a3 = null) => {
        flag3 || (flag3 = true, fn8(), Number.isFinite(a3) && (a.Re = a3), a2());
      },
      fn11 = () => {
        if (!flag3 && !(a.readyState < 2)) {
          if (typeof a.requestVideoFrameCallback == "function") try {
            n3 = a.requestVideoFrameCallback((a3, b3) => {
              if (flag3) return;
              let val3 = b3 && Number.isFinite(b3.mediaTime) ? b3.mediaTime : NaN;
              fn10(val3);
            }), n4 = setTimeout(() => {
              a.readyState >= 2 && fn10();
            }, 100);
            return;
          } catch {}
          fn10();
        }
      },
      fn12 = () => {
        fn11();
      },
      fn13 = () => {
        Number.isFinite(a.currentTime) && Math.abs(a.currentTime - b) < 0.002 && fn11();
      };
    if (n = setTimeout(() => {
      fn9(new Error("Timeout menunggu frame video pada " + b.toFixed(3) + 's.'));
    }, c), Number.isFinite(a.currentTime) && Math.abs(a.currentTime - b) < 0.002 && a.readyState >= 2) {
      fn11();
      return;
    }
    if (Number.isFinite(a.currentTime) && Math.abs(a.currentTime - b) < 0.002) {
      a.addEventListener("loadeddata", fn13, {
        once: true
      }), a.readyState >= 2 && fn11();
      return;
    }
    a.addEventListener("seeked", fn12, {
      once: true
    });
    try {
      a.currentTime = b;
    } catch (val3) {
      fn9(val3);
    }
  }) : Promise.resolve();
}
var Lt = class {
    constructor(a, b = console.log, c = {}) {
      this.canvas = a, this.log = b;
      let fn8 = (a2, b2) => {
          if (typeof localStorage > 'u') return b2;
          try {
            let getItem = localStorage.getItem(a2);
            return getItem === null ? b2 : getItem === '1';
          } catch {
            return b2;
          }
        },
        fn9 = (a2, b2) => {
          if (typeof localStorage > 'u') return b2;
          try {
            let getItem = localStorage.getItem(a2);
            return getItem === null ? b2 : getItem;
          } catch {
            return b2;
          }
        },
        obj23 = {
          alpha: !(c.opaque !== void 0 ? c.opaque === true : fn8("am.engineOpaque", false)),
          antialias: fn8("am.engineAntialias", false),
          depth: false,
          stencil: false,
          preserveDrawingBuffer: true,
          powerPreference: fn9("am.enginePower", "high-performance")
        },
        val3 = c.forceWebGL1 === true;
      if (!val3 && typeof localStorage < 'u') try {
        val3 = localStorage.getItem("am.forceWebGL1") === '1';
      } catch {}
      if (this.forceWebGL1 = val3, this.gl2 = val3 ? null : a.getContext("webgl2", obj23) || null, this.gl = this.gl2 || a.getContext("webgl", obj23), !this.gl) throw new Error("WebGL tidak didukung di browser ini.");
      this.webglVersion = this.gl2 ? 2 : 1, this.log("[WEBGL] Backend: WebGL" + this.webglVersion + " (GLSL ES " + (this.webglVersion >= 2 ? "3.00" : "1.00") + ')'), this.scene = null, this.images = new Map(), this.programs = new Map(), this.failedEffects = new Set(), this.targets = new Map(), this.targetBudget = c.targetBudget || get4(), this.targetBytes = 0, this.R = 0, this.shapeDefs = new Map(), this.k = new Float64Array([1, 0, 0, 1, 0, 0]), this.G = false, this.ht = [0, 0, 0], this.ye = 0, this.u = null, this.i = null, this.W = {
        skipped: 0
      }, this.setExperimental(c.experimental !== void 0 ? handle4(c.experimental) : handle4(ref12())), this.effectsEnabled = true, this.debugMode = false, this.debugSelectedLayerId = null, this.debugCanvas = null, this.force2DSubScene = false, this.xe = new WeakMap(), this.ve = [0, 0, 0, 0], this.Ie = new Float32Array(16), this.l = {
        input: null,
        comp: null
      }, this.ke = new Map(), this.o = {
        toScreen: new Float32Array(16),
        toLayer: new Float32Array(16),
        sizePx: [0, 0],
        sizeNorm: [0, 0],
        centerPx: [0, 0],
        centerNorm: [0, 0],
        valid: false
      }, this.mediaScale = 1, this.videoDriftMs = 300, this.sizeScale = 2, this.autoSizeScale = 2, this.workHeight = 480, this.workWidth = 270, this.baseWidth = 270, this.baseHeight = 480, this.overscanMax = 0.5, this.overscan = 0, this.padX = 0, this.padY = 0, this.surfWidth = 270, this.surfHeight = 480, this.O = {
        origin: [0, 0],
        size: [1, 1]
      }, this.pt = new Float32Array(9), this.timeMs = 0, this.stats = {
        layers: 0,
        passes: 0,
        videoUploads: 0,
        videoReuses: 0,
        videoPasses: 0,
        videoAudioOnly: 0
      }, this.directVideoEnabled = true, this.videoTextures = new Map(), this.j = new WeakMap(), this.ie = new Set(), this.videoFramePending = false, this.videoFramesSeen = 0, this.Pe = false, this.gt = new Float32Array(9), this.customFonts = new Map(), this.Y = 0, this.mediaMode = "preview", this.mediaPlaying = false, this.mediaRate = 1, this.rasterCache = new Map(), this.ae = 0, this.Mn = "fx0:", this.I = new Float32Array(9), this.bt = new Float32Array(9), this._e = [], this.raster = document.createElement("canvas"), this.raster.width = this.workWidth, this.raster.height = this.workHeight, this.rasterCtx = this.raster.getContext('2d'), this.rasterCache.set(this.workWidth + 'x' + this.workHeight, {
        canvas: this.raster,
        ctx: this.rasterCtx
      }), this.P = null, this.Ee = null, this.yt();
    }
    get ["exp"]() {
      return this.u;
    }
    ["setExperimental"](a) {
      this.u = a || null, this.ye++, setDefaultPrecision(this.u && this.u.fragPrecision === "mediump" ? "mediump" : null), this.u && this.u.profiler ? this.i || (this.i = this.Be()) : this.i = null, this.W = {
        skipped: 0
      }, this.log && this.u && this.log("[EXP] Aktif: " + this.u.active.join(" | "));
    }
    ['Be']() {
      let val3 = this.gl;
      return {
        frames: 0,
        raster: 0,
        chain: 0,
        frame: 0,
        targetCreates: 0,
        passes: 0,
        ext: this.webglVersion === 2 && val3 ? val3.getExtension("EXT_disjoint_timer_query_webgl2") : null,
        pending: [],
        gpuByCat: {},
        gpuByEffect: {},
        gpuTotalNs: 0,
        gpuSamples: 0
      };
    }
    ["resetProfile"]() {
      this.i && (this.i = this.Be());
    }
    ["profileSummary"]() {
      let val3 = this.i;
      if (!val3 || !val3.frames) return null;
      let val4 = val3.frames,
        fn8 = a => Math.round(a * 100) / 100,
        obj23 = {},
        obj24 = {};
      for (let val5 of Object.keys(val3.gpuByCat)) obj23[val5] = {
        ms: fn8(val3.gpuByCat[val5].ns / 1000000 / val4),
        passes: val3.gpuByCat[val5].n
      };
      for (let val5 of Object.keys(val3.gpuByEffect)) obj24[val5] = {
        ms: fn8(val3.gpuByEffect[val5].ns / 1000000 / val4),
        passes: val3.gpuByEffect[val5].n
      };
      return {
        frames: val4,
        cpuMsPerFrame: {
          total: fn8(val3.frame / val4),
          raster: fn8(val3.raster / val4),
          chain: fn8(val3.chain / val4)
        },
        passesPerFrame: fn8(val3.passes / val4),
        targetCreatesPerFrame: fn8(val3.targetCreates / val4),
        gpuTimer: val3.ext ? "EXT_disjoint_timer_query_webgl2" : "unavailable",
        gpuEffectPassMsPerFrame: fn8(val3.gpuTotalNs / 1000000 / val4),
        gpuByCategory: obj23,
        gpuByEffect: obj24,
        surf: [this.surfWidth, this.surfHeight],
        overscan: this.overscan,
        targetMB: Math.round(this.targetBytes / 1048576),
        skippedEffectsPerFrame: fn8(this.W.skipped / val4),
        active: this.u ? this.u.active : []
      };
    }
    ['le']() {
      let val3 = this.i;
      if (!val3 || !val3.ext || val3.pending.length > 256) return null;
      let val4 = this.gl,
        createQuery = val4.createQuery();
      return val4.beginQuery(val3.ext.TIME_ELAPSED_EXT, createQuery), createQuery;
    }
    ['ue'](a, b) {
      let val3 = this.i;
      this.gl.endQuery(val3.ext.TIME_ELAPSED_EXT), val3.pending.push({
        q: a,
        cat: b && b.category || "other",
        id: b && b.id || '?'
      });
    }
    ['xt']() {
      let val3 = this.i;
      if (!val3 || !val3.ext || !val3.pending.length) return;
      let val4 = this.gl,
        getParameter = val4.getParameter(val3.ext.GPU_DISJOINT_EXT);
      for (; val3.pending.length;) {
        let val5 = val3.pending[0];
        if (!val4.getQueryParameter(val5.q, val4.QUERY_RESULT_AVAILABLE)) break;
        if (val3.pending.shift(), !getParameter) {
          let getQueryParameter = val4.getQueryParameter(val5.q, val4.QUERY_RESULT);
          val3.gpuTotalNs += getQueryParameter, val3.gpuSamples++;
          let val6 = val3.gpuByCat[val5.cat] || (val3.gpuByCat[val5.cat] = {
            ns: 0,
            n: 0
          });
          val6.ns += getQueryParameter, val6.n++;
          let val7 = val3.gpuByEffect[val5.id] || (val3.gpuByEffect[val5.id] = {
            ns: 0,
            n: 0
          });
          val7.ns += getQueryParameter, val7.n++;
        }
        val4.deleteQuery(val5.q);
      }
    }
    ['yt']() {
      let val3 = this.gl;
      this.positionBuffer = val3.createBuffer(), val3.bindBuffer(val3.ARRAY_BUFFER, this.positionBuffer), val3.bufferData(val3.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), val3.STATIC_DRAW), this.texCoordBuffer = val3.createBuffer(), val3.bindBuffer(val3.ARRAY_BUFFER, this.texCoordBuffer), val3.bufferData(val3.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), val3.STATIC_DRAW), this.placeholderTexture = val3.createTexture(), val3.bindTexture(val3.TEXTURE_2D, this.placeholderTexture), val3.texImage2D(val3.TEXTURE_2D, 0, val3.RGBA, 1, 1, 0, val3.RGBA, val3.UNSIGNED_BYTE, new Uint8Array([30, 30, 40, 255])), this.we(), this.blitProgram = this.K(this.de(), this.Ne()), this.blitUniforms = this.J(this.blitProgram), this.blitAttribs = this.Z(this.blitProgram), this.videoProgram = this.K(this.vt(), this.kt()), this.videoUniforms = this.J(this.videoProgram), this.videoAttribs = this.Z(this.videoProgram);
    }
    ['vt']() {
      return this.webglVersion >= 2 ? "#version 300 es\nprecision highp float;\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_texCoord;\nuniform mat3 u_transform;\nuniform vec2 u_sizePx;\nuniform vec4 u_uvRect;\nvoid main() {\n    vec2 local = a_position * u_sizePx * 0.5;\n    vec3 pos = u_transform * vec3(local, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = mix(u_uvRect.xy, u_uvRect.zw, a_texCoord);\n}\n" : "precision highp float;\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nvarying vec2 v_texCoord;\nuniform mat3 u_transform;\nuniform vec2 u_sizePx;\nuniform vec4 u_uvRect;\nvoid main() {\n    vec2 local = a_position * u_sizePx * 0.5;\n    vec3 pos = u_transform * vec3(local, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = mix(u_uvRect.xy, u_uvRect.zw, a_texCoord);\n}\n";
    }
    ['kt']() {
      return this.webglVersion >= 2 ? "#version 300 es\nprecision highp float;\nin vec2 v_texCoord;\nout vec4 acFragColor;\nuniform sampler2D u_image;\nvoid main() {\n    acFragColor = texture(u_image, v_texCoord);\n}\n" : "precision highp float;\nvarying vec2 v_texCoord;\nuniform sampler2D u_image;\nvoid main() {\n    gl_FragColor = texture2D(u_image, v_texCoord);\n}\n";
    }
    ['de']() {
      return this.webglVersion >= 2 ? "#version 300 es\nprecision highp float;\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_texCoord;\nuniform mat3 u_transform;\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n" : "precision highp float;\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nvarying vec2 v_texCoord;\nuniform mat3 u_transform;\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n";
    }
    ['Ne']() {
      return this.webglVersion >= 2 ? "#version 300 es\nprecision highp float;\nin vec2 v_texCoord;\nout vec4 acFragColor;\nuniform sampler2D u_image;\nuniform float u_alpha;\nvoid main() {\n    vec4 c = texture(u_image, v_texCoord);\n    // Tekstur premultiplied -> alpha ikut dikalikan ke rgb.\n    acFragColor = vec4(c.rgb * u_alpha, c.a * u_alpha);\n}\n" : "precision highp float;\nvarying vec2 v_texCoord;\nuniform sampler2D u_image;\nuniform float u_alpha;\nvoid main() {\n    vec4 c = texture2D(u_image, v_texCoord);\n    gl_FragColor = vec4(c.rgb * u_alpha, c.a * u_alpha);\n}\n";
    }
    ['we']() {
      let val3 = this.gl;
      val3.texParameteri(val3.TEXTURE_2D, val3.TEXTURE_WRAP_S, val3.CLAMP_TO_EDGE), val3.texParameteri(val3.TEXTURE_2D, val3.TEXTURE_WRAP_T, val3.CLAMP_TO_EDGE), val3.texParameteri(val3.TEXTURE_2D, val3.TEXTURE_MIN_FILTER, val3.LINEAR), val3.texParameteri(val3.TEXTURE_2D, val3.TEXTURE_MAG_FILTER, val3.LINEAR);
    }
    ['Ue'](a, b) {
      let val3 = this.gl,
        createShader = val3.createShader(a);
      if (val3.shaderSource(createShader, b), val3.compileShader(createShader), !val3.getShaderParameter(createShader, val3.COMPILE_STATUS)) {
        let getShaderInfoLog = val3.getShaderInfoLog(createShader);
        throw val3.deleteShader(createShader), new Error(getShaderInfoLog.split('\x0a')[0]);
      }
      return createShader;
    }
    ['K'](a, b) {
      let val3 = this.gl,
        ue = this.Ue(val3.VERTEX_SHADER, a),
        ue2 = this.Ue(val3.FRAGMENT_SHADER, b),
        createProgram = val3.createProgram();
      if (val3.attachShader(createProgram, ue), val3.attachShader(createProgram, ue2), val3.linkProgram(createProgram), val3.deleteShader(ue), val3.deleteShader(ue2), !val3.getProgramParameter(createProgram, val3.LINK_STATUS)) {
        let getProgramInfoLog = val3.getProgramInfoLog(createProgram);
        throw val3.deleteProgram(createProgram), new Error(getProgramInfoLog.split('\x0a')[0]);
      }
      return createProgram;
    }
    ['J'](a) {
      let val3 = this.gl,
        obj23 = {},
        getProgramParameter = val3.getProgramParameter(a, val3.ACTIVE_UNIFORMS);
      for (let n = 0; n < getProgramParameter; n++) {
        let getActiveUniform = val3.getActiveUniform(a, n);
        getActiveUniform && (obj23[getActiveUniform.name.replace(/\[0\]$/, '')] = val3.getUniformLocation(a, getActiveUniform.name));
      }
      return obj23;
    }
    ['Z'](a) {
      let val3 = this.gl;
      return {
        a_position: val3.getAttribLocation(a, "a_position"),
        a_texCoord: val3.getAttribLocation(a, "a_texCoord")
      };
    }
    ['E'](a) {
      let val3 = this.gl;
      a.a_position >= 0 && (val3.bindBuffer(val3.ARRAY_BUFFER, this.positionBuffer), val3.enableVertexAttribArray(a.a_position), val3.vertexAttribPointer(a.a_position, 2, val3.FLOAT, false, 0, 0)), a.a_texCoord >= 0 && (val3.bindBuffer(val3.ARRAY_BUFFER, this.texCoordBuffer), val3.enableVertexAttribArray(a.a_texCoord), val3.vertexAttribPointer(a.a_texCoord, 2, val3.FLOAT, false, 0, 0));
    }
    ['F'](a, b, c = '', d = false) {
      let val3 = c + a + 'x' + b,
        get23 = this.targets.get(val3);
      if (get23) return get23.lastFrame = this.R, d || (get23.wantB = true), get23;
      let val4 = this.gl;
      this.i && this.i.targetCreates++;
      let fn8 = () => {
          let createTexture = val4.createTexture();
          val4.bindTexture(val4.TEXTURE_2D, createTexture), val4.texImage2D(val4.TEXTURE_2D, 0, val4.RGBA, a, b, 0, val4.RGBA, val4.UNSIGNED_BYTE, null), this.we();
          let createFramebuffer = val4.createFramebuffer();
          return val4.bindFramebuffer(val4.FRAMEBUFFER, createFramebuffer), val4.framebufferTexture2D(val4.FRAMEBUFFER, val4.COLOR_ATTACHMENT0, val4.TEXTURE_2D, createTexture, 0), {
            tex: createTexture,
            fbo: createFramebuffer
          };
        },
        obj23 = {
          make: fn8,
          w: a,
          h: b,
          wantB: !d,
          lastFrame: this.R,
          a: fn8(),
          ee: null
        };
      return Object.defineProperty(obj23, 'b', {
        enumerable: true,
        configurable: true,
        get() {
          return this.ee || (this.ee = this.make(), this.Et()), this.ee;
        }
      }), obj23.Et = () => {
        let val5 = (1 + (obj23.ee ? 1 : 0)) * a * b * 4,
          val6 = obj23.wt;
        val6 && (val6.targetBytes += val5 - obj23.bytes), obj23.bytes = val5;
      }, obj23.wt = this, obj23.bytes = a * b * 4, val4.bindFramebuffer(val4.FRAMEBUFFER, null), this.targets.set(val3, obj23), this.targetBytes += obj23.bytes, this.targetBytes > this.targetBudget && this.De(), obj23;
    }
    ['De']() {
      if (this.targetBytes <= this.targetBudget) return;
      let val3 = this.gl,
        sort2 = [...this.targets.keys()].filter(a => this.targets.get(a).lastFrame !== this.R).sort((a, b) => this.targets.get(a).lastFrame - this.targets.get(b).lastFrame);
      for (let val4 of sort2) {
        if (this.targetBytes <= this.targetBudget) break;
        let get23 = this.targets.get(val4);
        for (let val5 of [get23.a, get23.ee]) val5 && (val3.deleteTexture(val5.tex), val3.deleteFramebuffer(val5.fbo));
        this.targets.delete(val4), this.targetBytes -= get23.bytes;
      }
    }
    ['Tt']() {
      let val3 = this.gl;
      for (let val4 of this.targets.values()) for (let val5 of [val4.a, val4.ee]) val5 && (val3.deleteTexture(val5.tex), val3.deleteFramebuffer(val5.fbo));
      this.targets.clear(), this.targetBytes = 0;
    }
    ["setScene"](a) {
      this.scene = a, this.autoSizeScale = n2(a), this.sizeScale = this.autoSizeScale, this.log("[SCENE] Satuan ukuran layer: x" + this.sizeScale + (this.sizeScale === 2 ? " (AM menyimpan size dalam satuan proxy 1/2)" : '')), this.setResolution(this.workHeight);
    }
    ["setResolution"](a) {
      this.workHeight = Math.max(180, Math.round(a)), this.workWidth = this.scene ? Math.max(2, Math.round(this.scene.width / this.scene.height * this.workHeight)) : this.workHeight, this.canvas.width = this.workWidth, this.canvas.height = this.workHeight, this.baseWidth = this.workWidth, this.baseHeight = this.workHeight, this.Oe(), this.log("[SCENE] Resolusi render: " + this.workWidth + 'x' + this.workHeight);
    }
    ['Oe']() {
      let max5 = Math.max(0, this.overscan || 0);
      this.padX = max5 > 0 ? Math.round(this.baseWidth * max5) : 0, this.padY = max5 > 0 ? Math.round(this.baseHeight * max5) : 0, this.surfWidth = this.baseWidth + 2 * this.padX, this.surfHeight = this.baseHeight + 2 * this.padY, this.raster.width = this.surfWidth, this.raster.height = this.surfHeight, this.targets && this.Tt(), this.rasterCache = new Map(), this.rasterCache.set(this.surfWidth + 'x' + this.surfHeight, {
        canvas: this.raster,
        ctx: this.rasterCtx
      }), this.O = {
        origin: [-this.padX / this.baseWidth, -this.padY / this.baseHeight],
        size: [this.surfWidth / this.baseWidth, this.surfHeight / this.baseHeight]
      }, this.P = null, this.Ee = null;
    }
    ['Mt']() {
      let val3 = this.scene,
        val4 = this.hiddenLayers ? this.hiddenLayers.size : 0;
      (this.He !== val3 || this.St !== val4 || this.At !== this.ye) && (this.He = val3, this.St = val4, this.At = this.ye, this.Ft = this.Ct(val3));
      let val5 = this.Ft;
      val5 !== this.overscan && (this.overscan = val5, this.Oe(), this.log("[SCENE] Overscan " + (val5 ? Math.round(val5 * 100) + '%' : "mati") + ": permukaan " + this.surfWidth + 'x' + this.surfHeight));
    }
    ['Ct'](a) {
      let n = 0;
      for (let val4 of a.layers) {
        if (this.hiddenLayers && this.hiddenLayers.has(val4.id)) continue;
        let oe2 = this.oe(val4);
        if (!(oe2 > 0)) continue;
        let fe2 = this.fe(val4, this.se(val4, a)),
          max5 = Math.max(fe2[0] / this.baseWidth, fe2[1] / this.baseHeight, 0.5);
        n = Math.max(n, oe2 * max5);
      }
      let val3 = this.u;
      return val3 && val3.overdrawCap < this.overscanMax ? Math.min(this.overscanMax, val3.overdrawCap, Math.ceil(n * 20) / 20) : Math.min(this.overscanMax, Math.ceil(n * 20) / 20);
    }
    ["setImages"](a) {
      this.images = a;
      let set = new Set();
      for (let val3 of a.values()) !val3 || val3.tagName !== "VIDEO" || (set.add(val3), this.attachVideoElement(val3));
      for (let val3 of [...this.ie]) set.has(val3) || this.detachVideoElement(val3);
      for (let [val3, val4] of [...this.videoTextures]) if (!set.has(val3)) {
        if (typeof this.gl.deleteTexture == "function") try {
          this.gl.deleteTexture(val4.tex);
        } catch {}
        this.videoTextures.delete(val3);
      }
    }
    ["attachVideoElement"](a) {
      if (!a || a.tagName !== "VIDEO" || (this.ie.add(a), typeof a.requestVideoFrameCallback != "function")) return;
      let get23 = this.j.get(a);
      get23 || (get23 = {
        active: true,
        id: 0
      }, this.j.set(a, get23)), get23.id || this.ze(a, get23);
    }
    ['ze'](a, b) {
      if (b.active) try {
        b.id = a.requestVideoFrameCallback((a2, b2) => {
          if (b.active) {
            if (b.id = 0, this.videoFramePending = true, this.videoFramesSeen++, !a.paused && b2 && Number.isFinite(b2.mediaTime)) {
              let val3 = a.Lt;
              if (Number.isFinite(val3) && b2.mediaTime > val3) {
                let val4 = b2.mediaTime - val3;
                if (val4 > 0.001 && val4 < 1) {
                  let val5 = a.Ve;
                  a.Ve = Number.isFinite(val5) && val5 > 0 ? Math.min(val5, val4) : val4;
                }
              }
              a.Lt = b2.mediaTime;
            }
            a.paused || this.ze(a, b);
          }
        });
      } catch {
        b.active = false, this.j.delete(a);
      }
    }
    ['Te'](a) {
      let get23 = this.j.get(a);
      if (get23) {
        if (typeof a.cancelVideoFrameCallback == "function" && get23.id) try {
          a.cancelVideoFrameCallback(get23.id);
        } catch {}
        get23.id = 0;
      }
    }
    ["detachVideoElement"](a) {
      this.ie.delete(a);
      let get23 = this.j.get(a);
      if (get23 && (get23.active = false, this.j.delete(a), typeof a.cancelVideoFrameCallback == "function" && get23.id)) try {
        a.cancelVideoFrameCallback(get23.id);
      } catch {}
    }
    ["consumeVideoFrame"]() {
      let val3 = this.videoFramePending;
      return this.videoFramePending = false, val3;
    }
    ["setMediaMode"](a) {
      this.mediaMode = a === "export" ? "export" : "preview";
    }
    ['Xe']() {
      let set = new Set();
      for (let val3 of this.images.values()) val3 && val3.tagName === "VIDEO" && set.add(val3);
      return set;
    }
    ['me'](a) {
      let val3 = a.fillVideo || a.fillImage;
      return this.images.get(val3) || a.fillVideo && this.images.get(a.fillVideo) || a.fillImage && this.images.get(a.fillImage) || void 0;
    }
    ['Ge'](a) {
      let set = new Set(),
        fn8 = (a2, b) => {
          if (!(!a2 || !a2.layers)) for (let val3 of a2.layers) {
            if (val3.tag === "embedScene" && val3.scene) {
              fn8(val3.scene, b - val3.startTime);
              continue;
            }
            if (val3.fillType !== "media") continue;
            let me2 = this.me(val3);
            if (!me2 || me2.tagName !== "VIDEO" || val3.hidden || val3.re || this.hiddenLayers && this.hiddenLayers.has(val3.id)) continue;
            let x = this.X(val3, b);
            x !== null && (build(val3.transform.opacity, x) <= 0.002 || this.We(val3, (b - val3.startTime) / 1000) <= 0.002 || set.add(me2));
          }
        };
      return fn8(this.scene, a), set;
    }
    ['$t'](a) {
      if (this.ie.size === 0) {
        this.stats.videoAudioOnly = 0;
        return;
      }
      let ge2 = this.Ge(a),
        n = 0;
      for (let val3 of this.ie) {
        if (ge2.has(val3)) {
          this.attachVideoElement(val3);
          continue;
        }
        this.Te(val3), n++;
      }
      this.stats.videoAudioOnly = n;
    }
    ["playMedia"](a = 1) {
      this.mediaPlaying = true, this.mediaRate = Math.max(0.0625, Math.min(16, Number(a) || 1));
      let ge2 = this.Ge(this.timeMs);
      for (let val3 of this.Xe()) {
        val3.je = null, val3.Re = void 0, ge2.has(val3) ? this.attachVideoElement(val3) : this.Te(val3);
        try {
          val3.playbackRate = this.mediaRate, val3.paused && val3.play().catch(() => {});
        } catch {}
      }
    }
    ["pauseMedia"]() {
      this.mediaPlaying = false;
      for (let val3 of this.Xe()) {
        this.Te(val3);
        try {
          val3.pause();
        } catch {}
      }
    }
    ['Rt'](a) {
      let arr2 = [],
        fn8 = (a2, b) => {
          if (!(!a2 || !a2.layers)) for (let val3 of a2.layers) {
            if (val3.hidden || val3.re || this.hiddenLayers && this.hiddenLayers.has(val3.id)) continue;
            let x = this.X(val3, b);
            if (x === null) continue;
            let val4 = b - val3.startTime;
            if (val3.tag === "embedScene" && val3.scene) {
              fn8(val3.scene, val4);
              continue;
            }
            if (val3.fillType !== "media") continue;
            let me2 = this.me(val3);
            if (!me2 || me2.tagName !== "VIDEO" || build(val3.transform.opacity, x) <= 0.002) continue;
            let res5 = max2(val3, val4, me2.duration);
            res5 !== null && arr2.push({
              layer: val3,
              video: me2,
              targetSec: res5
            });
          }
        };
      return fn8(this.scene, a), arr2;
    }
    ['It'](a, b) {
      let val3 = a.je;
      if (val3 == null) return false;
      if (Math.abs(b - val3) < 0.002) return true;
      if (b < val3) return false;
      let val4 = a.Re,
        val5 = a.Ve;
      return !Number.isFinite(val4) || !Number.isFinite(val5) || val5 <= 0 ? Math.abs(b - val3) < 0.004 : val4 > b + 0.000001 ? false : b < val4 + val5 - 0.002;
    }
    async ["prepareMedia"](a) {
      let rt2 = this.Rt(a);
      if (!rt2.length) return 0;
      let map = new Map();
      for (let {
        video: val3,
        targetSec: val4
      } of rt2) map.set(val3, val4);
      let n = 0;
      return await Promise.all([...map].map(async ([a2, a3]) => {
        await process6(a2), !(!a2 || a2.readyState < 2) && (this.It(a2, a3) || flag(a2, a3) && (n++, await render4(a2, a3), a2.je = a3));
      })), n;
    }
    async ["loadEffectLibrary"](a, b) {
      this.programs.clear(), this.failedEffects.clear(), this.He = null, this.xe = new WeakMap();
      let n = 0;
      for (let val3 of a) if (!this.programs.has(val3)) try {
        let val4 = await b(val3);
        this.programs.set(val3, {
          ...this.Pt(val4),
          definition: val4
        }), n++;
      } catch (val4) {
        this.failedEffects.add(val3), this.log("[SCENE] Efek " + val3 + " dilewati: " + String(val4.message).split('\x0a')[0]);
      }
      this.log("[SCENE] " + n + " program efek siap, " + this.failedEffects.size + " efek dilewati.");
    }
    async ["loadShapeLibrary"](a, b) {
      this.shapeDefs.clear();
      let n = 0;
      for (let val3 of a) if (!(!val3 || val3[0] !== '.') && !this.shapeDefs.has(val3)) try {
        let val4 = await b(val3);
        if (!val4) continue;
        this.shapeDefs.set(val3, obj10(val4)), n++;
      } catch (val4) {
        this.log("[SCENE] Bentuk " + val3 + " dilewati: " + String(val4.message).split('\x0a')[0]);
      }
      this.log("[SCENE] " + n + " bentuk bawaan siap.");
    }
    ['Pt'](a) {
      let val3 = a.shaders && a.shaders.length ? a.shaders : a.shader ? [a.shader] : [],
        val4 = a.script && a.script.code ? compileScriptEffect(a, this.log) : null;
      if (val3.length) {
        let obj23 = {
            webglVersion: this.webglVersion
          },
          map = new Map(),
          arr2 = [];
        for (let val5 of val3) {
          let res5 = String(val5.group);
          if (map.has(res5)) continue;
          let obj24 = {
            ...a,
            shader: val5
          };
          try {
            let res6 = buildVertexShaderSource(obj24, () => {}, obj23),
              res7 = buildFragmentShaderSource(obj24, () => {}, obj23),
              k = this.K(res6, res7);
            map.set(res5, {
              program: k,
              canDiscard: /\bdiscard\b/.test(res7),
              uniforms: this.J(k),
              attribs: this.Z(k),
              uniformNames: buildParamNameMap(obj24),
              definition: obj24
            }), arr2.push(res5);
          } catch (val6) {
            this.log("[SCENE] Shader group " + res5 + " dari " + a.id + " dilewati: " + String(val6.message).split('\x0a')[0]);
          }
        }
        if (!map.size) throw new Error("semua shader group gagal dikompilasi.");
        return {
          ...map.get(arr2[0]),
          programsByGroup: map,
          groupOrder: arr2,
          animator: val4
        };
      }
      if (val4) {
        let k = this.K(this.de(), this.Ne());
        return {
          program: k,
          uniforms: this.J(k),
          attribs: this.Z(k),
          uniformNames: new Map(),
          programsByGroup: null,
          groupOrder: [],
          animator: val4
        };
      }
      throw new Error("efek native (tanpa shader/script) belum bisa dipreview.");
    }
    ['_t'](a, b, c, d, arg, arg2, arg3, arg4) {
      if (!b) {
        a.fillStyle = "rgba(70,70,90,0.6)", a.fillRect(c, d, arg, arg2);
        return;
      }
      if (b.tagName === "VIDEO" && b.readyState < 2) return;
      let val3 = b.videoWidth || b.naturalWidth || b.width || 1,
        val4 = b.videoHeight || b.naturalHeight || b.height || 1,
        res5 = update4(arg4, val3, val4);
      if (res5) {
        let {
          dw: res7,
          dh: res8
        } = obj13(res5, val3, val4, arg, arg2, arg3);
        a.save(), a.beginPath(), a.rect(c, d, arg, arg2), a.clip(), a.translate(c + arg / 2, d + arg2 / 2), a.rotate(res5 * Math.PI / 180), a.drawImage(b, 0, 0, val3, val4, -res7 / 2, -res8 / 2, res7, res8), a.restore();
        return;
      }
      if (arg3 === "stretch") {
        a.drawImage(b, c, d, arg, arg2);
        return;
      }
      let res6 = obj14(arg3, val3, val4, arg, arg2);
      a.drawImage(b, res6.sx, res6.sy, res6.sw, res6.sh, c, d, arg, arg2);
    }
    ['Me'](a, b, c, d, arg) {
      let val3 = b.shapeType || ".rect",
        get23 = this.shapeDefs.get(val3);
      if (get23) {
        let val4 = b.he || 0,
          val5 = val4 > 0 ? (b.B || 0) / val4 : 0,
          val6 = null;
        try {
          val6 = get23.getPath(ref9(get23, b, val5));
        } catch {
          val6 = null;
        }
        if (val6 && val6.length) {
          let val7 = this.workHeight / (b.N || this.scene).height;
          this.$(a, ref10(val6), val7);
          return;
        }
      }
      if (a.beginPath(), val3 === ".circle" || val3 === ".ellipse") a.ellipse(0, 0, Math.max(0.5, c / 2), Math.max(0.5, d / 2), 0, 0, Math.PI * 2);else {
        if (val3 === ".pie") {
          let val4 = b.B !== void 0 ? b.B / Math.max(1, b.he || 1000) : 0,
            val5 = b.startAngle ? build(b.startAngle, val4) : 0,
            val6 = b.endAngle ? build(b.endAngle, val4) : 360,
            val7 = val5 * Math.PI / 180,
            val8 = val6 * Math.PI / 180,
            max5 = Math.max(0.5, c / 2),
            max6 = Math.max(0.5, d / 2);
          a.moveTo(0, 0), a.ellipse(0, 0, max5, max6, 0, val7, val8, false), a.closePath();
        } else {
          if (val3 === ".roundrect" && arg > 0.5) {
            let min = Math.min(arg, Math.min(c, d) / 2),
              val4 = -c / 2,
              val5 = -d / 2;
            a.moveTo(val4 + min, val5), a.lineTo(val4 + c - min, val5), a.arcTo(val4 + c, val5, val4 + c, val5 + min, min), a.lineTo(val4 + c, val5 + d - min), a.arcTo(val4 + c, val5 + d, val4 + c - min, val5 + d, min), a.lineTo(val4 + min, val5 + d), a.arcTo(val4, val5 + d, val4, val5 + d - min, min), a.lineTo(val4, val5 + min), a.arcTo(val4, val5, val4 + min, val5, min), a.closePath();
          } else a.rect(-c / 2, -d / 2, c, d);
        }
      }
    }
    ['fe'](a, b) {
      let val3 = this.workHeight / (a.N || this.scene).height;
      return qi[0] = Math.max(1, Math.round(b[0] * val3)), qi[1] = Math.max(1, Math.round(b[1] * val3)), qi;
    }
    ['Bt'](a, b) {
      let val3 = a + 'x' + b,
        get23 = this.rasterCache.get(val3);
      if (!get23) {
        let canvasEl = document.createElement("canvas");
        canvasEl.width = a, canvasEl.height = b, get23 = {
          canvas: canvasEl,
          ctx: canvasEl.getContext('2d')
        }, this.rasterCache.set(val3, get23);
      }
      return get23;
    }
    ['$'](a, b, c) {
      a.beginPath();
      for (let val3 of b) val3[0] === 'M' ? a.moveTo(val3[1] * c, val3[2] * c) : val3[0] === 'L' ? a.lineTo(val3[1] * c, val3[2] * c) : val3[0] === 'C' ? a.bezierCurveTo(val3[1] * c, val3[2] * c, val3[3] * c, val3[4] * c, val3[5] * c, val3[6] * c) : val3[0] === 'Z' && a.closePath();
    }
    ['Nt'](a, b, c) {
      let val3 = a.path.bounds,
        val4 = a.path.commands,
        max5 = Math.max(0.5, val3.w * c),
        max6 = Math.max(0.5, val3.h * c);
      if (b.save(), b.translate(-val3.cx * c, -val3.cy * c), this.Ut(a, b, val4, c), a.fillType === "media") this.Dt(a, b, val4, c, max5, max6);else {
        if (a.fillType !== "none") {
          let val7 = a.gradient;
          if (this.$(b, val4, c), a.fillType === "gradient" && val7) {
            let val8 = Math.max(0.001, val3.hx) * c,
              val9 = Math.max(0.001, val3.hy) * c,
              val10 = -val8 + (val7.start[0] || 0) * 2 * val8,
              val11 = -val9 + (val7.start[1] || 0) * 2 * val9,
              val12 = -val8 + (val7.end[0] === void 0 ? 1 : val7.end[0]) * 2 * val8,
              val13 = -val9 + (val7.end[1] === void 0 ? 0 : val7.end[1]) * 2 * val9,
              val14 = val7.type === "radial" ? b.createRadialGradient(val10, val11, 0, val10, val11, Math.max(0.001, Math.hypot(val12 - val10, val13 - val11))) : b.createLinearGradient(val10, val11, val12, val13);
            if (val7.stops && val7.stops.length > 0) {
              for (let val15 of val7.stops) val14.addColorStop(Math.max(0, Math.min(1, val15.t)), handle5(val15.color));
            } else val14.addColorStop(0, handle5(val7.startColor)), val14.addColorStop(1, handle5(val7.endColor));
            b.fillStyle = val14;
          } else b.fillStyle = handle5(a.fillColor);
          b.fill();
        }
      }
      let val5 = a.border;
      val5 && val5.size > 0 && this.qe(b, val4, c, val5.size, handle5(val5.color), val5.direction, "round", "round");
      let val6 = a.pathStroke;
      if (val6 && val6.enabled && val6.size > 0) {
        let val7 = val6.cap === "square" ? "square" : val6.cap === "butt" ? "butt" : "round";
        this.qe(b, val4, c, val6.size, handle5(val6.color), val6.direction, val7, "round");
      }
      b.restore();
    }
    ['Dt'](a, b, c, d, arg, arg2) {
      let me2 = this.me(a),
        flag3 = false;
      if (me2) {
        this.Ot(a, me2);
        let val3 = me2.videoWidth || me2.naturalWidth || me2.width || 0,
          val4 = me2.videoHeight || me2.naturalHeight || me2.height || 0;
        if (!(me2.tagName === "VIDEO" && me2.readyState < 2) && val3 > 0 && val4 > 0) {
          let res5 = update4(a, val3, val4),
            {
              dw: res6,
              dh: res7
            } = obj13(res5, val3, val4, arg, arg2, a.mediaFillMode);
          b.save(), this.$(b, c, d), b.clip(), res5 && b.rotate(res5 * Math.PI / 180), b.drawImage(me2, 0, 0, val3, val4, -res6 / 2, -res7 / 2, res6, res7), b.restore(), flag3 = true;
        }
      }
      flag3 || (b.save(), this.$(b, c, d), b.fillStyle = handle5(a.fillColor), b.fill(), b.restore());
    }
    ['Ot'](a, b) {
      if (!b || b.tagName !== "VIDEO" || this.mediaMode === "export") return;
      let val3 = a.B !== void 0 ? a.B : 0,
        res5 = max2(a, val3, b.duration);
      if (res5 !== null) {
        if (Math.abs(b.currentTime - res5) > (this.mediaPlaying ? 0.3 : 0.02)) try {
          b.currentTime = res5;
        } catch {}
        if (this.mediaPlaying && b.paused && b.readyState >= 2) try {
          b.play().catch(() => {});
        } catch {}
      }
    }
    ['Ut'](a, b, c, d) {
      let val3 = a.shadow;
      if (!val3 || !val3.enabled || !(val3.size > 0)) return;
      let ht2 = this.Ht(),
        val4 = b.getTransform ? b.getTransform() : null;
      ht2.setTransform(val4 ? val4.a : 1, val4 ? val4.b : 0, val4 ? val4.c : 0, val4 ? val4.d : 1, val4 ? val4.e : 0, val4 ? val4.f : 0);
      let val5 = val3.offset[0],
        val6 = val3.offset[1],
        val7 = val4 ? Math.abs(val4.a * val4.d - val4.b * val4.c) : 1,
        val8 = d * (Math.sqrt(val7) || 1);
      ht2.shadowColor = handle5(val3.color), ht2.shadowBlur = val3.size * val8, ht2.shadowOffsetX = val4 ? d * (val4.a * val5 + val4.c * val6) : val5 * d, ht2.shadowOffsetY = val4 ? d * (val4.b * val5 + val4.d * val6) : val6 * d, ht2.fillStyle = "#000", ht2.globalCompositeOperation = "source-over", this.$(ht2, c, d), ht2.fill(), ht2.shadowColor = "rgba(0,0,0,0)", ht2.shadowBlur = 0, ht2.shadowOffsetX = 0, ht2.shadowOffsetY = 0, ht2.globalCompositeOperation = "destination-out", this.$(ht2, c, d), ht2.fill(), ht2.globalCompositeOperation = "source-over", b.save(), b.setTransform(1, 0, 0, 1, 0, 0), b.drawImage(this.P, 0, 0), b.restore();
    }
    ['Ht']() {
      let val3 = this.raster.width,
        val4 = this.raster.height;
      return !this.P || this.P.width !== val3 || this.P.height !== val4 ? (this.P = document.createElement("canvas"), this.P.width = val3, this.P.height = val4, this.Ee = this.P.getContext('2d')) : this.P.width = val3, this.Ee;
    }
    ['qe'](a, b, c, d, arg, arg2, arg3, arg4) {
      let val3 = arg2 || "centered";
      a.save(), a.strokeStyle = arg, a.lineJoin = arg4 || "round", a.lineCap = arg3 || "round", val3 === "inside" ? (this.$(a, b, c), a.clip(), this.$(a, b, c), a.lineWidth = d * c * 2, a.stroke()) : val3 === "outside" ? (this.$(a, b, c), a.rect(-100000, -100000, 100000 * 2, 100000 * 2), a.clip("evenodd"), this.$(a, b, c), a.lineWidth = d * c * 2, a.stroke()) : (this.$(a, b, c), a.lineWidth = d * c, a.stroke()), a.restore();
    }
    ['Ye'](a, b, c) {
      a.moveTo(b[0][0] * c, b[0][1] * c);
      for (let n = 1; n < b.length; n++) a.lineTo(b[n][0] * c, b[n][1] * c);
    }
    ['zt'](a, b) {
      let val3 = this.workHeight / (b.N || this.scene).height,
        val4 = b.strokes || [];
      for (let val5 of val4) {
        let val6 = val5.points;
        if (!(!val6 || !val6.length)) {
          if (a.save(), val5.type === "fill") a.beginPath(), this.Ye(a, val6, val3), a.closePath(), a.fillStyle = handle5(val5.color), a.fill();else {
            if (val5.type === "brush") {
              let val7 = Math.max(0, val5.width) * val3,
                val8 = val6.length;
              a.beginPath();
              for (let n = 0; n < val8; n++) {
                let val9 = val6[n],
                  val10 = val6[n > 0 ? n - 1 : 0],
                  val11 = val6[n < val8 - 1 ? n + 1 : val8 - 1],
                  val12 = val11[0] - val10[0],
                  val13 = val11[1] - val10[1],
                  val14 = Math.hypot(val12, val13) || 1;
                val12 /= val14, val13 /= val14;
                let val15 = val7 * (Number.isFinite(val9[2]) ? val9[2] : 1) / 2,
                  val16 = val9[0] * val3,
                  val17 = val9[1] * val3;
                n === 0 ? a.moveTo(val16 - val13 * val15, val17 + val12 * val15) : a.lineTo(val16 - val13 * val15, val17 + val12 * val15);
              }
              for (let val9 = val8 - 1; val9 >= 0; val9--) {
                let val10 = val6[val9],
                  val11 = val6[val9 > 0 ? val9 - 1 : 0],
                  val12 = val6[val9 < val8 - 1 ? val9 + 1 : val8 - 1],
                  val13 = val12[0] - val11[0],
                  val14 = val12[1] - val11[1],
                  val15 = Math.hypot(val13, val14) || 1;
                val13 /= val15, val14 /= val15;
                let val16 = val7 * (Number.isFinite(val10[2]) ? val10[2] : 1) / 2;
                a.lineTo(val10[0] * val3 + val14 * val16, val10[1] * val3 - val13 * val16);
              }
              a.closePath(), a.fillStyle = handle5(val5.color), a.fill();
            } else a.beginPath(), this.Ye(a, val6, val3), a.strokeStyle = handle5(val5.color), a.lineWidth = Math.max(0.5, val5.width * val3), a.lineJoin = "round", a.lineCap = "round", a.stroke();
          }
          a.restore();
        }
      }
    }
    ["setMediaMode"](a) {
      this.mediaMode = a;
    }
    ['Vt'](a, b, c, d, arg, arg2) {
      if (!this.directVideoEnabled || this.mediaMode === "export" || get5(a) || this.Y > 0 || arg || !b || b.tagName !== "VIDEO" || b.readyState < 2) return null;
      let val3 = b.videoWidth,
        val4 = b.videoHeight;
      if (!(val3 > 0) || !(val4 > 0) || typeof arg2.getTransform != "function") return null;
      let res5 = obj14(a.mediaFillMode, val3, val4, c, d);
      if (!(res5.sw > 0) || !(res5.sh > 0)) return null;
      let val5;
      try {
        val5 = arg2.getTransform();
      } catch {
        return null;
      }
      if (!val5 || !Number.isFinite(val5.a) || !Number.isFinite(val5.b) || !Number.isFinite(val5.c) || !Number.isFinite(val5.d) || !Number.isFinite(val5.e) || !Number.isFinite(val5.f)) return null;
      let val6;
      try {
        val6 = this.Xt(b);
      } catch (val7) {
        return this.Ke(val7), null;
      }
      return val6 ? {
        video: b,
        tex: val6.tex,
        iw: val3,
        ih: val4,
        w: c,
        h: d,
        src: [res5.sx, res5.sy, res5.sw, res5.sh],
        m: [val5.a, val5.b, val5.c, val5.d, val5.e, val5.f]
      } : null;
    }
    ['Xt'](a) {
      let val3 = this.gl,
        val4 = a.videoWidth,
        val5 = a.videoHeight,
        gt2 = this.Gt(a),
        val6 = this.videoTextures.get(a) || {
          tex: val3.createTexture(),
          w: 0,
          h: 0,
          key: '',
          allocated: false
        };
      if (val6.key === gt2 && val6.w === val4 && val6.h === val5) return this.videoTextures.set(a, val6), this.stats.videoReuses++, val6;
      this.videoTextures.set(a, val6), val3.activeTexture(val3.TEXTURE0), val3.bindTexture(val3.TEXTURE_2D, val6.tex), val3.pixelStorei(val3.UNPACK_FLIP_Y_WEBGL, false), val3.pixelStorei(val3.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      try {
        val6.allocated && val6.w === val4 && val6.h === val5 ? val3.texSubImage2D(val3.TEXTURE_2D, 0, 0, 0, val3.RGBA, val3.UNSIGNED_BYTE, a) : val3.texImage2D(val3.TEXTURE_2D, 0, val3.RGBA, val3.RGBA, val3.UNSIGNED_BYTE, a);
      } finally {
        val3.pixelStorei(val3.UNPACK_FLIP_Y_WEBGL, false), val3.pixelStorei(val3.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      }
      return this.we(), val6.w = val4, val6.h = val5, val6.key = gt2, val6.allocated = true, this.stats.videoUploads++, val6;
    }
    ['Gt'](a) {
      let val3 = -1;
      if (typeof a.getVideoPlaybackQuality == "function") try {
        let getVideoPlaybackQuality = a.getVideoPlaybackQuality();
        getVideoPlaybackQuality && typeof getVideoPlaybackQuality.totalVideoFrames == "number" && (val3 = getVideoPlaybackQuality.totalVideoFrames);
      } catch {}
      val3 < 0 && typeof a.webkitDecodedFrameCount == "number" && (val3 = a.webkitDecodedFrameCount);
      let val4 = Number.isFinite(a.currentTime) ? a.currentTime : 0;
      return val3 + '@' + val4.toFixed(4) + '@' + a.videoWidth + 'x' + a.videoHeight;
    }
    ['Wt'](a, b, c, d, arg, arg2, arg3) {
      let val3 = this.gl,
        val4 = this.bt;
      val4[0] = b[0] * c / arg2, val4[1] = -b[1] * c / arg3, val4[2] = 0, val4[3] = -b[2] * d / arg2, val4[4] = b[3] * d / arg3, val4[5] = 0, val4[6] = 2 * b[4] / arg2 - 1, val4[7] = 1 - 2 * b[5] / arg3, val4[8] = 1, val3.bindFramebuffer(val3.FRAMEBUFFER, arg.fbo), val3.viewport(0, 0, arg2, arg3), val3.disable(val3.BLEND);
      let val5 = null;
      if (typeof val3.getParameter == "function" && val3.COLOR_CLEAR_VALUE !== void 0) try {
        val5 = val3.getParameter(val3.COLOR_CLEAR_VALUE);
      } catch {
        val5 = null;
      }
      val3.clearColor(0, 0, 0, 0), val3.clear(val3.COLOR_BUFFER_BIT), val5 && val3.clearColor(val5[0], val5[1], val5[2], val5[3]), val3.useProgram(this.blitProgram), this.E(this.blitAttribs), val3.activeTexture(val3.TEXTURE0), val3.bindTexture(val3.TEXTURE_2D, a), this.blitUniforms.u_image && val3.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && val3.uniform1f(this.blitUniforms.u_alpha, 1), this.blitUniforms.u_transform && val3.uniformMatrix3fv(this.blitUniforms.u_transform, false, val4), val3.drawArrays(val3.TRIANGLES, 0, 6);
    }
    ['jt']() {
      if (this.Qe !== void 0) return this.Qe;
      let val3 = this.webglVersion >= 2,
        val4 = val3 ? "#version 300 es\nprecision highp float;\nin vec2 v_texCoord;\nout vec4 acFragColor;\n" : "precision highp float;\nvarying vec2 v_texCoord;\n",
        val5 = val3 ? "acFragColor" : "gl_FragColor",
        val6 = val3 ? "texture" : "texture2D",
        val7 = val4 + ("\nuniform sampler2D u_image;\nuniform vec2 u_texel;\nuniform float u_mode;\nuniform float u_bw;\nuniform vec4 u_bc;\nuniform float u_sr;\nuniform vec2 u_so;\nuniform vec4 u_sc;\nuniform float u_useShadow;\nuniform float u_shOut;\nfloat A(vec2 uv) { return " + val6 + "(u_image, uv).a; }\nvoid main() {\n    vec4 c = " + val6 + "(u_image, v_texCoord);\n    vec4 res = c;\n    const float CS = 0.8660254;\n    const float SN = 0.5;\n    if (u_bw > 0.0) {\n        float rd = u_mode < 0.5 ? u_bw : (u_mode > 1.5 ? u_bw * 0.5 : 0.0);\n        float re = u_mode < 0.5 ? 0.0 : (u_mode > 1.5 ? u_bw * 0.5 : u_bw);\n        float dil = c.a;\n        float ero = c.a;\n        for (int i = 1; i <= 6; i++) {\n            float f = float(i) / 6.0;\n            float off = (i - (i / 2) * 2 == 1) ? 0.0 : 0.2617994;\n            vec2 d = vec2(cos(off), sin(off));\n            for (int j = 0; j < 12; j++) {\n                if (rd > 0.0) dil = max(dil, A(v_texCoord + d * (rd * f) * u_texel));\n                if (re > 0.0) ero = min(ero, A(v_texCoord + d * (re * f) * u_texel));\n                d = vec2(d.x * CS - d.y * SN, d.x * SN + d.y * CS);\n            }\n        }\n        float bA = u_mode < 0.5 ? dil : (u_mode < 1.5 ? c.a - ero : dil - ero);\n        bA = clamp(bA, 0.0, 1.0);\n        vec4 bl = vec4(u_bc.rgb * u_bc.a, u_bc.a) * bA;\n        if (u_mode < 0.5) res = res + bl * (1.0 - res.a);\n        else res = bl + res * (1.0 - bl.a);\n    }\n    if (u_useShadow > 0.5) {\n        vec2 base = v_texCoord - u_so;\n        float sig = max(u_sr * 0.5, 0.0001);\n        float acc = A(base) * 0.15;\n        float wsum = 0.15;\n        if (u_sr > 0.5) {\n            for (int i = 1; i <= 6; i++) {\n                float f = float(i) / 6.0;\n                float r = u_sr * f;\n                float wg = exp(-0.5 * (r * r) / (sig * sig)) * f;\n                float off = (i - (i / 2) * 2 == 1) ? 0.0 : 0.2617994;\n                vec2 d = vec2(cos(off), sin(off));\n                for (int j = 0; j < 12; j++) {\n                    acc += A(base + d * r * u_texel) * wg;\n                    wsum += wg;\n                    d = vec2(d.x * CS - d.y * SN, d.x * SN + d.y * CS);\n                }\n            }\n        } else {\n            acc = A(base);\n            wsum = 1.0;\n        }\n        float sA = acc / wsum;\n        if (u_shOut > 0.5) sA *= (1.0 - c.a);\n        vec4 sl = vec4(u_sc.rgb * u_sc.a, u_sc.a) * sA;\n        res = res + sl * (1.0 - res.a);\n    }\n    " + val5 + " = res;\n}\n"),
        val8 = null;
      try {
        let k = this.K(this.de(), val7);
        val8 = {
          program: k,
          uniforms: this.J(k),
          attribs: this.Z(k)
        };
      } catch (val9) {
        this.log("[SCENE] Program border/shadow gagal: " + String(val9.message).split('\x0a')[0]);
      }
      return this.Qe = val8, val8;
    }
    ['qt'](a, b, c, d, arg) {
      let val3 = a.border,
        val4 = a.shadow,
        val5 = !!(val3 && val3.size > 0 && val3.color && val3.color[3] > 0.001),
        val6 = !!(val4 && val4.enabled !== false && val4.color && val4.color[3] > 0.001 && (val4.size > 0 || val4.offset && (val4.offset[0] || val4.offset[1])));
      if (!val5 && !val6) return false;
      let jt2 = this.jt();
      if (!jt2) return false;
      let val7 = this.gl,
        val8 = b.m,
        val9 = this.workHeight / (a.N || this.scene).height,
        val10 = val9 * (Math.sqrt(Math.abs(val8[0] * val8[3] - val8[1] * val8[2])) || 1),
        val11 = val5 ? val3.size * val10 : 0,
        val12 = val6 ? val4.size * val10 : 0,
        n = 0,
        n3 = 0,
        n4 = 0;
      if (val6) {
        let val23 = val4.offset[0] || 0,
          val24 = val4.offset[1] || 0,
          val25 = val9 * (val8[0] * val23 + val8[2] * val24),
          val26 = val9 * (val8[1] * val23 + val8[3] * val24);
        n = val25 / d, n3 = -val26 / arg, n4 = Math.max(Math.abs(val25), Math.abs(val26));
      }
      let val13 = b.w / 2,
        val14 = b.h / 2,
        val15 = 1 / 0,
        val16 = 1 / 0,
        val17 = -1 / 0,
        val18 = -1 / 0;
      for (let n5 = 0; n5 < 4; n5++) {
        let val23 = n5 & 1 ? val13 : -val13,
          val24 = n5 & 2 ? val14 : -val14,
          val25 = val8[0] * val23 + val8[2] * val24 + val8[4],
          val26 = val8[1] * val23 + val8[3] * val24 + val8[5];
        val25 < val15 && (val15 = val25), val25 > val17 && (val17 = val25), val26 < val16 && (val16 = val26), val26 > val18 && (val18 = val26);
      }
      let val19 = val11 + val12 + n4 + 2,
        max5 = Math.max(0, Math.floor(val15 - val19)),
        min = Math.min(d, Math.ceil(val17 + val19)),
        max6 = Math.max(0, Math.floor(val16 - val19)),
        min2 = Math.min(arg, Math.ceil(val18 + val19));
      if (!(min > max5 && min2 > max6)) return false;
      let val20 = this.Yt || (this.Yt = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])),
        val21 = val5 ? val3.direction === "inside" ? 1 : val3.direction === "centered" || val3.direction === "center" ? 2 : 0 : 0,
        val22 = jt2.uniforms;
      return val7.enable(val7.SCISSOR_TEST), val7.scissor(max5, arg - min2, min - max5, min2 - max6), val7.disable(val7.BLEND), val7.bindFramebuffer(val7.FRAMEBUFFER, c.b.fbo), val7.viewport(0, 0, d, arg), val7.useProgram(jt2.program), this.E(jt2.attribs), val7.activeTexture(val7.TEXTURE0), val7.bindTexture(val7.TEXTURE_2D, c.a.tex), val22.u_image && val7.uniform1i(val22.u_image, 0), val22.u_transform && val7.uniformMatrix3fv(val22.u_transform, false, val20), val22.u_texel && val7.uniform2f(val22.u_texel, 1 / d, 1 / arg), val22.u_mode && val7.uniform1f(val22.u_mode, val21), val22.u_bw && val7.uniform1f(val22.u_bw, val11), val22.u_bc && val7.uniform4f(val22.u_bc, val5 ? val3.color[0] : 0, val5 ? val3.color[1] : 0, val5 ? val3.color[2] : 0, val5 ? val3.color[3] : 0), val22.u_useShadow && val7.uniform1f(val22.u_useShadow, val6 ? 1 : 0), val22.u_sr && val7.uniform1f(val22.u_sr, val12), val22.u_so && val7.uniform2f(val22.u_so, n, n3), val22.u_sc && val7.uniform4f(val22.u_sc, val6 ? val4.color[0] : 0, val6 ? val4.color[1] : 0, val6 ? val4.color[2] : 0, val6 ? val4.color[3] : 0), val22.u_shOut && val7.uniform1f(val22.u_shOut, val6 && val4.direction === "inside" ? 0 : 1), val7.drawArrays(val7.TRIANGLES, 0, 6), val7.bindFramebuffer(val7.FRAMEBUFFER, c.a.fbo), val7.useProgram(this.blitProgram), this.E(this.blitAttribs), val7.bindTexture(val7.TEXTURE_2D, c.b.tex), this.blitUniforms.u_image && val7.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && val7.uniform1f(this.blitUniforms.u_alpha, 1), this.blitUniforms.u_transform && val7.uniformMatrix3fv(this.blitUniforms.u_transform, false, val20), val7.drawArrays(val7.TRIANGLES, 0, 6), val7.disable(val7.SCISSOR_TEST), this.stats.passes += 2, true;
    }
    ['Kt'](a, b, c, d) {
      let val3 = this.gl,
        val4 = a.m,
        val5 = this.gt;
      val5[0] = 2 * val4[0] / c, val5[1] = -2 * val4[1] / d, val5[2] = 0, val5[3] = 2 * val4[2] / c, val5[4] = -2 * val4[3] / d, val5[5] = 0, val5[6] = 2 * val4[4] / c - 1, val5[7] = 1 - 2 * val4[5] / d, val5[8] = 1;
      let val6 = a.src,
        val7 = val6[0] / a.iw,
        val8 = val6[1] / a.ih,
        val9 = (val6[0] + val6[2]) / a.iw,
        val10 = (val6[1] + val6[3]) / a.ih;
      val3.bindFramebuffer(val3.FRAMEBUFFER, b.fbo), val3.viewport(0, 0, c, d), val3.disable(val3.BLEND);
      let val11 = null;
      if (typeof val3.getParameter == "function" && val3.COLOR_CLEAR_VALUE !== void 0) try {
        val11 = val3.getParameter(val3.COLOR_CLEAR_VALUE);
      } catch {
        val11 = null;
      }
      val3.clearColor(0, 0, 0, 0), val3.clear(val3.COLOR_BUFFER_BIT), val11 && val3.clearColor(val11[0], val11[1], val11[2], val11[3]), val3.useProgram(this.videoProgram), this.E(this.videoAttribs), val3.activeTexture(val3.TEXTURE0), val3.bindTexture(val3.TEXTURE_2D, a.tex);
      let val12 = this.videoUniforms;
      val12.u_image && val3.uniform1i(val12.u_image, 0), val12.u_sizePx && val3.uniform2f(val12.u_sizePx, a.w, a.h), val12.u_uvRect && val3.uniform4f(val12.u_uvRect, val7, val8, val9, val10), val12.u_transform && val3.uniformMatrix3fv(val12.u_transform, false, val5), val3.drawArrays(val3.TRIANGLES, 0, 6), a.video && this.stats.videoPasses++;
    }
    ['Qt'](a) {
      let val3 = this.rasterCtx;
      if (!val3 || !a || !a.video || !a.src || !a.m || a.video.readyState < 2) return;
      let val4 = a.m,
        val5 = a.src;
      val3.save(), val3.setTransform(val4[0], val4[1], val4[2], val4[3], val4[4], val4[5]), val3.globalAlpha = 1, val3.globalCompositeOperation = "source-over", val3.drawImage(a.video, val5[0], val5[1], val5[2], val5[3], -a.w / 2, -a.h / 2, a.w, a.h), val3.restore();
    }
    ['Ke'](a) {
      let val3 = a && a.message ? String(a.message) : String(a);
      if (a && (a.name === "SecurityError" || /security/i.test(val3))) {
        if (!this.directVideoEnabled) return;
        this.directVideoEnabled = false, this.log("[SCENE] Jalur tekstur video dimatikan (" + val3.split('\x0a')[0] + "). Kembali ke raster kanvas 2D.");
        return;
      }
      this.Pe || (this.Pe = true, this.log("[SCENE] Frame video dilewati ke jalur kanvas: " + val3.split('\x0a')[0]));
    }
    ['oe'](a) {
      if (a.Jt === this.R) return a.Zt;
      let n = 0;
      if (a.effects) {
        let val3 = this.u;
        for (let val4 of a.effects) {
          if (val4.disabled || val4.hidden === true || val4.hidden === "true") continue;
          let get23 = this.programs.get(val4.id),
            val5 = get23 && get23.definition;
          if (!val5 || !val5.overdraw || val3 && !process4(val5, val3)) continue;
          let val6 = Number.isFinite(val5.maxOverdraw) ? val5.maxOverdraw : 0;
          val3 && val6 > val3.overdrawCap && (val6 = val3.overdrawCap), val6 > n && (n = val6);
        }
      }
      return a.Jt = this.R, a.Zt = n, n;
    }
    ['Se'](a, b, c) {
      let fe2 = this.fe(a, b),
        val3 = fe2[0],
        val4 = fe2[1];
      if (a.tag === "embedScene" && a.scene && !this.force2DSubScene) {
        c.save(), c.beginPath(), c.rect(-val3 / 2, -val4 / 2, val3, val4), c.clip(), c.translate(-val3 / 2, -val4 / 2), c.scale(val3 / a.scene.width, val4 / a.scene.height), this.en(a.scene, c, a.scene.width, a.scene.height, a.B, a.he), c.restore();
        return;
      }
      let val5 = a.shapeType || ".rect",
        je2 = this.Je(a),
        val6 = (a.cornerRadius || 0) * (je2[0] > 0 ? val3 / je2[0] : 1),
        val7 = val5 !== ".rect" && val5 !== '';
      if (a.tag === "text") {
        c.save();
        let val13 = a.fillColor || [0, 0, 0, 1];
        c.fillStyle = handle5(val13);
        let val14 = this.workHeight / (a.N || this.scene).height,
          val15 = je2[1] > 0 && je2[1] !== 100 ? je2[1] / 18 : 1,
          max5 = Math.max(1, (a.fontSize || 18) * val14 * val15 * 2),
          str = "Roboto",
          str2 = "normal",
          str3 = "normal";
        if (a.font) {
          let replace = a.font.replace(/&amp;/g, '&'),
            match = replace.match(/name=([^&]+)/);
          if (replace.includes("googlefonts") && match) {
            if (str = decodeURIComponent(match[1]), typeof document < 'u' && typeof document.querySelector == "function" && !document.querySelector("link[data-font=\"" + str + '\x22]')) {
              let linkEl = document.createElement("link");
              linkEl.rel = "stylesheet", linkEl.dataset.font = str, linkEl.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(str) + ":wght@400;500;700&display=swap", document.head.appendChild(linkEl);
            }
          } else {
            if (replace.includes("imported?name=")) {
              let match2 = replace.match(/name=([^&]+)/);
              if (match2) {
                let res5 = decodeURIComponent(match2[1]),
                  replace2 = res5.replace(/\.[^/.]+$/, '');
                this.customFonts && (this.customFonts.has(replace2) || this.customFonts.has(res5)) ? str = this.customFonts.get(replace2) || this.customFonts.get(res5) : str = replace2;
              }
            } else replace.trim() && (this.customFonts && this.customFonts.has(replace.trim()) ? str = this.customFonts.get(replace.trim()) : str = replace);
          }
          if (replace.includes("weight=")) {
            let match2 = replace.match(/weight=([^&]+)/);
            match2 && (str2 = match2[1]);
          }
          replace.includes("italic=1") && (str3 = "italic");
        }
        c.font = str3 + '\x20' + str2 + '\x20' + max5 + "px \"" + str + "\", \"Roboto\", sans-serif", c.textAlign = a.align || "center", c.textBaseline = "middle";
        let parts = (a.textContent || '').split('\x0a'),
          val16 = max5 * 1.2,
          val17 = -(parts.length * val16) / 2 + val16 / 2,
          n = 0;
        a.align === "left" ? n = -val3 / 2 : a.align === "right" && (n = val3 / 2);
        for (let n3 = 0; n3 < parts.length; n3++) parts[n3] && c.fillText(parts[n3], n, val17 + n3 * val16);
        c.restore();
        return;
      }
      if (a.path) {
        this.Nt(a, c, this.workHeight / (a.N || this.scene).height);
        return;
      }
      if (a.tag === "drawing") {
        this.zt(c, a);
        return;
      }
      if (a.fillType === "media") {
        let me2 = this.me(a);
        if (me2 && me2.tagName === "VIDEO" && this.mediaMode !== "export") {
          let val13 = a.B !== void 0 ? a.B : 0,
            res5 = max2(a, val13, me2.duration);
          if (res5 !== null) {
            let val14 = (this.videoDriftMs || 300) / 1000;
            if (Math.abs(me2.currentTime - res5) > (this.mediaPlaying ? val14 : 0.02)) try {
              me2.currentTime = res5;
            } catch {}
            if (this.mediaPlaying && me2.paused && me2.readyState >= 2) try {
              me2.play().catch(() => {});
            } catch {}
          }
        }
        if (!me2) return;
        let vt2 = this.Vt(a, me2, val3, val4, val7, c);
        if (vt2) return vt2;
        c.save(), val7 && (this.Me(c, a, val3, val4, val6), c.clip()), this._t(c, me2, -val3 / 2, -val4 / 2, val3, val4, a.mediaFillMode, a), c.restore();
        return;
      }
      if (a.tag === "nullobj" || a.tag === "audio" || a.tag === "camera") return;
      let val8 = -val3 / 2 + (a.gradient && a.gradient.start[0] || 0) * val3,
        val9 = -val4 / 2 + (a.gradient && a.gradient.start[1] || 0) * val4,
        val10 = -val3 / 2 + (a.gradient && a.gradient.end[0] || 1) * val3,
        val11 = -val4 / 2 + (a.gradient && a.gradient.end[1] || 0) * val4;
      if (a.fillType !== "none") {
        if (a.fillType === "gradient" && a.gradient) {
          let val13 = a.gradient,
            val14;
          if (val13.type === "radial") {
            let val15 = (val13.start ? val13.start[0] : 0.5) * val3 - val3 / 2,
              val16 = (val13.start ? val13.start[1] : 0.5) * val4 - val4 / 2,
              val17 = (val13.end ? val13.end[0] : 0.5) * val3 - val3 / 2,
              val18 = (val13.end ? val13.end[1] : 0.5) * val4 - val4 / 2,
              max5 = Math.max(0.001, Math.hypot(val17 - val15, val18 - val16));
            val14 = c.createRadialGradient(val15, val16, 0, val15, val16, max5);
          } else val14 = c.createLinearGradient(val8, val9, val10, val11);
          if (val13.stops && val13.stops.length > 0) {
            for (let val15 of val13.stops) val14.addColorStop(Math.max(0, Math.min(1, val15.t)), handle5(val15.color));
          } else val14.addColorStop(0, handle5(val13.startColor)), val14.addColorStop(1, handle5(val13.endColor));
          c.fillStyle = val14;
        } else c.fillStyle = handle5(a.fillColor);
        c.save(), val7 ? (this.Me(c, a, val3, val4, val6), c.fill()) : c.fillRect(-val3 / 2, -val4 / 2, val3, val4), c.restore();
      }
      let val12 = a.border;
      if (val12 && val12.size > 0) {
        let val13 = this.workHeight / (a.N || this.scene).height;
        c.lineWidth = val12.size * val13, c.strokeStyle = handle5(val12.color), this.Me(c, a, val3, val4, val6), c.stroke();
      }
    }
    ['se'](a, b) {
      if (a.tn === this.R && a.nn === a.Ae) return a.an;
      let sn = this.sn(a, b);
      return a.tn = this.R, a.nn = a.Ae, a.an = sn, sn;
    }
    ['Je'](a) {
      return a.Fe && a.Ae === this.R ? a.Fe : a.size && a.size.value || [0, 0];
    }
    ['sn'](a, b) {
      if (a.tag === "embedScene" && a.scene) return [a.scene.width, a.scene.height];
      if (a.path) {
        let val5 = a.path.bounds;
        return [Math.max(1, val5.w), Math.max(1, val5.h)];
      }
      if (a.tag === "drawing") {
        let res5 = obj9(a);
        return [Math.max(1, res5.w), Math.max(1, res5.h)];
      }
      if (a.tag === "text" && a.wrapWidth > 0) {
        let val5 = (a.textContent || '').split('\x0a').length * (a.fontSize || 18) * 1.2;
        return [a.wrapWidth, Math.max(50, val5)];
      }
      let je2 = this.Je(a),
        val3 = this.sizeScale || 1,
        val4 = je2[0] > 0 && je2[1] > 0 ? [je2[0] * val3, je2[1] * val3] : [b.width, b.height];
      return this.mediaScale && this.mediaScale !== 1 && (val4 = [val4[0] * this.mediaScale, val4[1] * this.mediaScale]), val4;
    }
    ['rn'](a, b, c, d, arg) {
      if (!(c > 0) || !(d > 0)) return null;
      let val3 = this.gl,
        val4 = "sub" + this.ae + ':' + (a.id || "scene") + ':',
        val5 = this.F(c, d, val4, true).a,
        obj23 = {
          scene: this.scene,
          sceneTarget: this.sceneTarget,
          surfWidth: this.surfWidth,
          surfHeight: this.surfHeight,
          workWidth: this.workWidth,
          workHeight: this.workHeight,
          padX: this.padX,
          padY: this.padY,
          raster: this.raster,
          rasterCtx: this.rasterCtx,
          cameraActive: this.G,
          cameraMat: this.Ze ? this.Ze : this.Ze = new Float64Array(6),
          level: this.ae,
          subDepth: this.Y
        };
      for (let n = 0; n < 6; n++) obj23.cameraMat[n] = this.k[n];
      let bt2 = this.Bt(c, d);
      this.scene = b, this.sceneTarget = val5;
      let res5 = obj12(b),
        val6 = Math.min(c / res5.w, d / res5.h) || 0;
      this.surfWidth = c, this.surfHeight = d, this.workWidth = res5.w * val6, this.workHeight = res5.h * val6, this.padX = (c - this.workWidth) / 2, this.padY = (d - this.workHeight) / 2, this.raster = bt2.canvas, this.rasterCtx = bt2.ctx, this.ae = obj23.level + 1, this.Y = obj23.subDepth + 1;
      try {
        val3.bindFramebuffer(val3.FRAMEBUFFER, val5.fbo), val3.viewport(0, 0, c, d), val3.disable(val3.BLEND);
        let val7 = b.bgcolor || [0, 0, 0, 0];
        val3.clearColor(val7[0], val7[1], val7[2], val7[3]), val3.clear(val3.COLOR_BUFFER_BIT), this.et(arg);
        for (let val8 of b.layers || []) {
          if (val8.hidden || val8.re || this.hiddenLayers && this.hiddenLayers.has(val8.id)) continue;
          let x = this.X(val8, arg);
          x !== null && (this.stats.layers++, this.tt(val8, x, (arg - val8.startTime) / 1000));
        }
        return val5;
      } catch (val7) {
        return this.log("[SCENE] Sub-scene " + (a.id || '') + " gagal dirender ke tekstur: " + String(val7.message).split('\x0a')[0]), null;
      } finally {
        this.scene = obj23.scene, this.sceneTarget = obj23.sceneTarget, this.surfWidth = obj23.surfWidth, this.surfHeight = obj23.surfHeight, this.workWidth = obj23.workWidth, this.workHeight = obj23.workHeight, this.padX = obj23.padX, this.padY = obj23.padY, this.raster = obj23.raster, this.rasterCtx = obj23.rasterCtx, this.G = obj23.cameraActive;
        for (let n = 0; n < 6; n++) this.k[n] = obj23.cameraMat[n];
        this.ae = obj23.level, this.Y = obj23.subDepth;
      }
    }
    ['en'](a, b, c, d, arg, arg2) {
      let val3 = this.workWidth,
        val4 = this.workHeight;
      this.workWidth = c, this.workHeight = d, this.Y++, a.layers.forEach(a2 => {
        a2.N = a;
      }), b.save();
      try {
        for (let val5 of a.layers) {
          let val6 = arg !== void 0 ? arg : 0,
            x = this.X(val5, val6);
          if (x === null) continue;
          let te2 = this.te(val5, x, val6 / 1000);
          if (te2.alpha <= 0.002) continue;
          let se2 = this.se(val5, a),
            val7 = d / a.height;
          b.save(), b.globalAlpha = Math.max(0, Math.min(1, te2.alpha)), b.globalCompositeOperation = cc[process5(val5.blendMode)] || "source-over", this.Ce(b, val5, te2, val7, (val6 - val5.startTime) / 1000), val5.B = Math.max(0, val6 - val5.startTime), val5.he = val5.endTime - val5.startTime, this.Se(val5, se2, b), b.restore();
        }
        b.restore();
      } finally {
        this.Y--, this.workWidth = val3, this.workHeight = val4;
      }
    }
    ['nt'](a, b, c, d) {
      let val3 = this.gl;
      val3.bindTexture(val3.TEXTURE_2D, b.tex), val3.pixelStorei(val3.UNPACK_FLIP_Y_WEBGL, true), val3.pixelStorei(val3.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true), b.w === a.width && b.h === a.height ? val3.texSubImage2D(val3.TEXTURE_2D, 0, 0, 0, val3.RGBA, val3.UNSIGNED_BYTE, a) : val3.texImage2D(val3.TEXTURE_2D, 0, val3.RGBA, val3.RGBA, val3.UNSIGNED_BYTE, a), val3.pixelStorei(val3.UNPACK_FLIP_Y_WEBGL, false), val3.pixelStorei(val3.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false), val3.texParameteri(val3.TEXTURE_2D, val3.TEXTURE_WRAP_S, val3.CLAMP_TO_EDGE), val3.texParameteri(val3.TEXTURE_2D, val3.TEXTURE_WRAP_T, val3.CLAMP_TO_EDGE), val3.texParameteri(val3.TEXTURE_2D, val3.TEXTURE_MIN_FILTER, val3.LINEAR), val3.texParameteri(val3.TEXTURE_2D, val3.TEXTURE_MAG_FILTER, val3.LINEAR);
    }
    ['pe'](a, b, c, d, arg, arg2 = 1, arg3 = 1, arg4 = null, arg5 = null) {
      let val3 = this.gl,
        val4 = a.uniforms;
      c = this.workWidth, d = this.workHeight;
      let val5 = this.o.valid ? this.o : null,
        val6 = val5 ? val5.sizePx[0] : c,
        val7 = val5 ? val5.sizePx[1] : d;
      val4.acLayerSize && val3.uniform2f(val4.acLayerSize, val6, val7), val4.acScreenSize && val3.uniform2f(val4.acScreenSize, c, d), val4.acLayerCenter && val3.uniform2f(val4.acLayerCenter, val5 ? val5.centerPx[0] : c / 2, val5 ? val5.centerPx[1] : d / 2), val4.acLayerCenterNorm && val3.uniform2f(val4.acLayerCenterNorm, val5 ? val5.centerNorm[0] : 0.5, val5 ? val5.centerNorm[1] : 0.5), val4.acLayerSizeNorm && val3.uniform2f(val4.acLayerSizeNorm, val5 ? val5.sizeNorm[0] : 1, val5 ? val5.sizeNorm[1] : 1), val4.acLayerPivot && val3.uniform2f(val4.acLayerPivot, 0, 0), val4.acPreviewSize && val3.uniform2f(val4.acPreviewSize, c, d), val4.acProjectSize && val3.uniform2f(val4.acProjectSize, c, d), val4.acPass && val3.uniform1i(val4.acPass, arg3), val4.acTime && val3.uniform1f(val4.acTime, b), val4.acAngularVelocity && val3.uniform1f(val4.acAngularVelocity, arg ? arg.angle : 0), val4.acVelocity && val3.uniform2f(val4.acVelocity, arg ? arg.x * arg2 : 0, arg ? arg.y * arg2 : 0), val4.acScaleVelocity && val3.uniform1f(val4.acScaleVelocity, arg ? arg.scale : 0), val4.acShowGuides && val3.uniform1i(val4.acShowGuides, 0), val4.acLayerToScreen && val3.uniformMatrix4fv(val4.acLayerToScreen, false, val5 ? val5.toScreen : ji), val4.acScreenToLayer && val3.uniformMatrix4fv(val4.acScreenToLayer, false, val5 ? val5.toLayer : ji);
      let val8 = arg5 || this.O,
        val9 = arg4 || this.O;
      val4.acCompOrigin && val3.uniform2f(val4.acCompOrigin, this.O.origin[0], this.O.origin[1]), val4.acCompSize && val3.uniform2f(val4.acCompSize, this.O.size[0], this.O.size[1]), val4.acOutputOrigin && val3.uniform2f(val4.acOutputOrigin, val8.origin[0], val8.origin[1]), val4.acOutputSize && val3.uniform2f(val4.acOutputSize, val8.size[0], val8.size[1]), val4.acInputOrigin && val3.uniform2f(val4.acInputOrigin, val9.origin[0], val9.origin[1]), val4.acInputSize && val3.uniform2f(val4.acInputSize, val9.size[0], val9.size[1]);
    }
    ['Le'](a, b) {
      let val3 = b.xe || (b.xe = new WeakMap()),
        get23 = val3.get(a);
      if (get23) return get23;
      let arr2 = [];
      for (let val4 of b.definition.params) {
        let val5 = b.uniformNames.get(val4.id) || val4.id,
          find = a.params.find(a2 => a2.id === val4.id);
        if (val4.type === "texture") {
          arr2.push({
            id: val4.id,
            type: "texture",
            comp: val4.srcType === "comp",
            buffer: val4.srcType === "buffer",
            uniform: b.uniforms['u_' + val5 + "_texture"] || null,
            sizeUniform: b.uniforms['u_' + val5 + "_size"] || null
          });
          continue;
        }
        arr2.push({
          id: val4.id,
          type: val4.type,
          kind: rc[val4.type] || null,
          valueType: val4.valueType,
          loc: b.uniforms[val5] || null,
          channel: find ? find.channel : null,
          fallback: val4.defaultValue
        });
      }
      let obj23 = {
        entry: b,
        items: arr2
      };
      return val3.set(a, obj23), a.it = null, obj23;
    }
    ['ge'](a, b, c, d, arg, arg2, arg3, arg4) {
      let val3 = this.gl,
        val4 = this.Le(b, a).items,
        val5 = this.ve,
        n = 0;
      for (let val6 of val4) {
        if (val6.type === "texture") {
          let val11;
          val6.buffer && d.passBuffers && d.passBuffers.has(val6.id) ? val11 = d.passBuffers.get(val6.id) : val6.comp ? val11 = d.comp : val11 = d.input, val3.activeTexture(val3.TEXTURE0 + n), val3.bindTexture(val3.TEXTURE_2D, val11 || this.placeholderTexture), val6.uniform && val3.uniform1i(val6.uniform, n), val6.sizeUniform && (val6.comp ? val3.uniform2f(val6.sizeUniform, arg, arg2) : val3.uniform2f(val6.sizeUniform, arg3 || arg, arg4 || arg2)), n++;
          continue;
        }
        let val7 = val6.kind,
          val8 = val6.loc;
        if (!val8 || !val7) continue;
        let val9 = val6.channel ? ref3(val6.channel, c, val5) : val6.fallback,
          val10 = Array.isArray(val9) ? val9[0] : val9;
        val7 === "float" ? val3.uniform1f(val8, Number.isFinite(val10) ? val10 : 0) : val7 === "bool" ? val3.uniform1i(val8, val10 ? 1 : 0) : val7 === "int" ? val3.uniform1i(val8, Math.round(Number.isFinite(val10) ? val10 : 0)) : val7 === "vec2" ? val3.uniform2f(val8, val9[0] || 0, val9[1] || 0) : val7 === "vec3" ? val3.uniform3f(val8, val9[0] || 0, val9[1] || 0, val9[2] || 0) : val7 === "vec4" ? val3.uniform4f(val8, val9[0] || 0, val9[1] || 0, val9[2] || 0, val9[3] === void 0 ? 1 : val9[3]) : val7 === "mat4" && (val9.length === 16 ? (this.Ie.set(val9), val3.uniformMatrix4fv(val8, false, this.Ie)) : val3.uniformMatrix4fv(val8, false, ji));
      }
    }
    ['cn'](a, b, c, d, arg) {
      let val3 = this.gl;
      val3.bindFramebuffer(val3.FRAMEBUFFER, a.fbo), val3.bindTexture(val3.TEXTURE_2D, c.tex);
      let max5 = Math.max(0, b.x + this.padX),
        max6 = Math.max(0, arg - (b.y + this.padY + b.h));
      return val3.copyTexSubImage2D(val3.TEXTURE_2D, 0, 0, 0, max5, max6, b.w, b.h), c;
    }
    ['ln'](a, b, c, d) {
      let val3 = this.gl,
        val4 = this.F(c, d, "fx:placed:", true).a;
      val3.bindFramebuffer(val3.FRAMEBUFFER, val4.fbo), val3.viewport(0, 0, c, d), val3.disable(val3.BLEND), val3.clearColor(0, 0, 0, 0), val3.clear(val3.COLOR_BUFFER_BIT), val3.useProgram(this.blitProgram), this.E(this.blitAttribs);
      let val5 = b.w / c,
        val6 = b.h / d,
        val7 = b.x + this.padX,
        val8 = b.y + this.padY,
        val9 = (2 * val7 + b.w) / c - 1,
        val10 = 1 - (2 * val8 + b.h) / d;
      return this.I[0] = val5, this.I[1] = 0, this.I[2] = 0, this.I[3] = 0, this.I[4] = val6, this.I[5] = 0, this.I[6] = val9, this.I[7] = val10, this.I[8] = 1, val3.activeTexture(val3.TEXTURE0), val3.bindTexture(val3.TEXTURE_2D, a), this.blitUniforms.u_image && val3.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && val3.uniform1f(this.blitUniforms.u_alpha, 1), this.blitUniforms.u_transform && val3.uniformMatrix3fv(this.blitUniforms.u_transform, false, this.I), val3.drawArrays(val3.TRIANGLES, 0, 6), val4.tex;
    }
    ['un'](a, b, c, d, arg, arg2, arg3, arg4 = null) {
      let val3 = this.gl,
        val4 = this.u,
        val5 = this.i,
        val6 = !!arg4 && this.effectsEnabled && this.oe(a) > 0,
        f = this.F(d, arg),
        val7 = f.a.tex,
        val8 = f.b,
        val9 = this.scene && this.scene.height ? this.workHeight / this.scene.height : 1;
      if (arg3 && arg3.at) this.Wt(arg3.at, arg3.m, arg3.w, arg3.h, f.a, d, arg), this.qt(a, arg3, f, d, arg);else {
        if (arg3) try {
          this.Kt(arg3, f.a, d, arg);
        } catch (val15) {
          this.Ke(val15), this.Qt(arg3), this.nt(this.raster, f.a, d, arg);
        } else this.nt(this.raster, f.a, d, arg);
      }
      if (!val6) {
        let ref25 = val7;
        if (this.effectsEnabled) {
          val3.disable(val3.BLEND);
          for (let val15 of a.effects) {
            if (val15.disabled || val15.hidden === true || val15.hidden === "true") continue;
            let get23 = this.programs.get(val15.id);
            if (!get23 || !get23.programsByGroup) continue;
            let val16 = get23.definition;
            if (val4 && !process4(val16, val4)) {
              this.W.skipped++;
              continue;
            }
            let val17 = val16 && val16.passes || [],
              map = new Map(),
              val18 = val15.be == null ? [get23.groupOrder[0]] : val15.be;
            if (val17.length > 1) for (let n3 = 0; n3 < val17.length; n3++) {
              let val19 = val17[n3],
                val20 = val18[Math.min(n3, val18.length - 1)],
                get24 = get23.programsByGroup.get(String(val20));
              if (!get24) continue;
              let val21 = val19 && val19.target ? val19.target : null,
                val22 = val21 ? this.F(d, arg, "fx:buf:" + val21 + ':', true).a : val8;
              val3.bindFramebuffer(val3.FRAMEBUFFER, val22.fbo), val3.viewport(0, 0, d, arg), val4 && val4.invalidate && this.gl2 && !get24.canDiscard && val3.invalidateFramebuffer(val3.FRAMEBUFFER, Gn), val3.useProgram(get24.program), this.E(get24.attribs), this.pe(get24, c, d, arg, arg2, val9, n3), this.l.input = val7, this.l.comp = this.sceneTarget.tex, this.l.passBuffers = map, this.ge(get24, val15, b, this.l, this.workWidth, this.workHeight, this.o.valid ? this.o.sizePx[0] : this.workWidth, this.o.valid ? this.o.sizePx[1] : this.workHeight);
              let val23 = val5 ? this.le() : null;
              val3.drawArrays(val3.TRIANGLES, 0, 6), val23 && this.ue(val23, val16), val5 && val5.passes++, this.stats.passes++, val21 ? map.set(val21, val22.tex) : (val7 = val8.tex, val8 = val8 === f.a ? f.b : f.a);
            } else {
              let n3 = 0;
              for (let val19 of val18) {
                let get24 = get23.programsByGroup.get(String(val19));
                if (!get24) continue;
                let val20 = val17[n3],
                  val21 = val20 && val20.target ? val20.target : null,
                  val22 = val21 ? this.F(d, arg, "fx:buf:" + val21 + ':', true).a : val8;
                val3.bindFramebuffer(val3.FRAMEBUFFER, val22.fbo), val3.viewport(0, 0, d, arg), val4 && val4.invalidate && this.gl2 && !get24.canDiscard && val3.invalidateFramebuffer(val3.FRAMEBUFFER, Gn), val3.useProgram(get24.program), this.E(get24.attribs), this.pe(get24, c, d, arg, arg2, val9, n3), this.l.input = val7, this.l.comp = this.sceneTarget.tex, this.l.passBuffers = map, this.ge(get24, val15, b, this.l, this.workWidth, this.workHeight, this.o.valid ? this.o.sizePx[0] : this.workWidth, this.o.valid ? this.o.sizePx[1] : this.workHeight);
                let val23 = val5 ? this.le() : null;
                val3.drawArrays(val3.TRIANGLES, 0, 6), val23 && this.ue(val23, val16), val5 && val5.passes++, this.stats.passes++, n3++, val21 ? map.set(val21, val22.tex) : (val7 = val8.tex, val8 = val8 === f.a ? f.b : f.a);
              }
            }
          }
          ref25 = val7;
        }
        return {
          texture: ref25,
          domain: null,
          expanded: false
        };
      }
      let val10 = arg4.m,
        val11 = arg4.w,
        val12 = arg4.h;
      if (!(val11 > 0) || !(val12 > 0)) return {
        texture: val7,
        domain: null,
        expanded: false
      };
      let res5 = update3(val10, val11, val12, this.workWidth, this.workHeight, this.oe(a), this.padX, this.padY);
      if (res5.empty) return {
        texture: val7,
        domain: null,
        expanded: false
      };
      val4 && val4.bucket && compute4(res5, val4.bucket, this.workWidth, this.workHeight, this.padX, this.padY);
      let val13 = val4 && val4.overdrawCap < 0.5 ? val4.overdrawCap : 0.5,
        n = 0,
        val14 = this.F(res5.w, res5.h, "fx:src:", true).a;
      this.cn(f.a, res5, val14, d, arg), val7 = val14.tex;
      let ref24 = res5;
      val3.disable(val3.BLEND);
      for (let val15 of a.effects) {
        if (val15.disabled || val15.hidden === true || val15.hidden === "true") continue;
        let get23 = this.programs.get(val15.id);
        if (!get23 || !get23.programsByGroup) continue;
        let val16 = get23.definition;
        if (val4 && !process4(val16, val4)) {
          this.W.skipped++;
          continue;
        }
        let val17 = val16 && val16.overdraw && Number.isFinite(val16.maxOverdraw) ? Math.max(0, val16.maxOverdraw) : 0;
        val4 && val17 > val4.overdrawCap && (val17 = val4.overdrawCap);
        let max5 = Math.max(n, val17),
          max6 = Math.max(this.padX, this.workWidth * val13),
          max7 = Math.max(this.padY, this.workHeight * val13),
          res6 = update3(val10, val11, val12, this.workWidth, this.workHeight, max5, max6, max7);
        val4 && val4.bucket && compute4(res6, val4.bucket, this.workWidth, this.workHeight, max6, max7);
        let f2 = this.F(res6.w, res6.h, "fx:pass:"),
          val18 = val7 === f2.a.tex ? f2.b : f2.a,
          val19 = val16 && val16.passes || [],
          map = new Map(),
          val20 = val15.be == null ? [get23.groupOrder[0]] : val15.be,
          n3 = 0;
        if (val19.length > 1) for (let n4 = 0; n4 < val19.length; n4++) {
          let val21 = val19[n4],
            val22 = val20[Math.min(n4, val20.length - 1)],
            get24 = get23.programsByGroup.get(String(val22));
          if (!get24) continue;
          let val23 = val21 && val21.target ? val21.target : null,
            val24 = val23 ? this.F(res6.w, res6.h, "fx:buf:" + val23 + ':', true).a : val18;
          val3.bindFramebuffer(val3.FRAMEBUFFER, val24.fbo), val3.viewport(0, 0, res6.w, res6.h), val4 && val4.invalidate && this.gl2 && !get24.canDiscard && val3.invalidateFramebuffer(val3.FRAMEBUFFER, Gn), val3.useProgram(get24.program), this.E(get24.attribs), this.pe(get24, c, d, arg, arg2, val9, n4, ref24, res6), this.l.input = val7, this.l.comp = this.sceneTarget.tex, this.l.passBuffers = map, this.ge(get24, val15, b, this.l, this.workWidth, this.workHeight, this.o.valid ? this.o.sizePx[0] : this.workWidth, this.o.valid ? this.o.sizePx[1] : this.workHeight);
          let val25 = val5 ? this.le() : null;
          val3.drawArrays(val3.TRIANGLES, 0, 6), val25 && this.ue(val25, val16), val5 && val5.passes++, this.stats.passes++, val23 ? map.set(val23, val24.tex) : (val7 = val18.tex, ref24 = res6, val18 = val18 === f2.a ? f2.b : f2.a);
        } else {
          let n4 = 0;
          for (let val21 of val20) {
            let get24 = get23.programsByGroup.get(String(val21));
            if (!get24) continue;
            let val22 = val19[n4],
              val23 = val22 && val22.target ? val22.target : null,
              val24 = val23 ? this.F(res6.w, res6.h, "fx:buf:" + val23 + ':', true).a : val18;
            val3.bindFramebuffer(val3.FRAMEBUFFER, val24.fbo), val3.viewport(0, 0, res6.w, res6.h), val4 && val4.invalidate && this.gl2 && !get24.canDiscard && val3.invalidateFramebuffer(val3.FRAMEBUFFER, Gn), val3.useProgram(get24.program), this.E(get24.attribs), this.pe(get24, c, d, arg, arg2, val9, n4, ref24, res6), this.l.input = val7, this.l.comp = this.sceneTarget.tex, this.l.passBuffers = map, this.ge(get24, val15, b, this.l, this.workWidth, this.workHeight, this.o.valid ? this.o.sizePx[0] : this.workWidth, this.o.valid ? this.o.sizePx[1] : this.workHeight);
            let val25 = val5 ? this.le() : null;
            val3.drawArrays(val3.TRIANGLES, 0, 6), val25 && this.ue(val25, val16), val5 && val5.passes++, this.stats.passes++, n4++, val23 ? map.set(val23, val24.tex) : (val7 = val18.tex, ref24 = res6, val18 = val18 === f2.a ? f2.b : f2.a);
          }
        }
        n = max5;
      }
      return {
        texture: val7,
        domain: ref24,
        expanded: true
      };
    }
    ['dn'](a) {
      return zs[process5(a)] || zs.normal;
    }
    ['fn'](a) {
      if (this.ke.has(a)) return this.ke.get(a);
      let val3 = Vs[a],
        val4 = typeof val3 == "string" ? val3 : val3 ? val3.body : null,
        val5 = val3 && typeof val3 == "object" && val3.header || '',
        val6 = null;
      if (val4) {
        let val7 = this.webglVersion >= 2,
          val8 = val7 ? "#version 300 es\nprecision highp float;\nin vec2 v_texCoord;\nout vec4 acFragColor;\n" : "precision highp float;\nvarying vec2 v_texCoord;\n",
          val9 = val7 ? "acFragColor" : "gl_FragColor",
          val10 = val7 ? "texture" : "texture2D";
        try {
          let k = this.K(this.de(), val8 + (val5 ? val5 + '\x0a' : '') + "uniform sampler2D u_image;\nuniform sampler2D u_comp;\nvoid main() {\n vec4 texColor = " + val10 + "(u_image, v_texCoord);\n vec4 compColor = " + val10 + "(u_comp, v_texCoord);\n vec3 top = texColor.rgb;\n vec3 bot = compColor.rgb * texColor.a;\n" + val4 + '\x0a\x20' + val9 + " = vec4(result, texColor.a);\n}\n");
          val6 = {
            program: k,
            uniforms: this.J(k),
            attribs: this.Z(k)
          };
        } catch (val11) {
          this.log("[SCENE] Blend " + a + " gagal: " + String(val11.message).split('\x0a')[0]), val6 = null;
        }
      }
      return this.ke.set(a, val6), val6;
    }
    ['mn'](a, b, c, d) {
      let fn8 = this.fn(b);
      if (!fn8) return a;
      let val3 = this.gl,
        f = this.F(c, d, "blend:");
      return val3.bindFramebuffer(val3.FRAMEBUFFER, f.a.fbo), val3.viewport(0, 0, c, d), val3.disable(val3.BLEND), val3.useProgram(fn8.program), this.E(fn8.attribs), val3.activeTexture(val3.TEXTURE0), val3.bindTexture(val3.TEXTURE_2D, a), val3.activeTexture(val3.TEXTURE1), val3.bindTexture(val3.TEXTURE_2D, this.sceneTarget.tex), fn8.uniforms.u_image && val3.uniform1i(fn8.uniforms.u_image, 0), fn8.uniforms.u_comp && val3.uniform1i(fn8.uniforms.u_comp, 1), val3.drawArrays(val3.TRIANGLES, 0, 6), this.stats.passes++, val3.activeTexture(val3.TEXTURE0), f.a.tex;
    }
    ['te'](a, b, c) {
      let val3 = a.hn;
      if (!val3) {
        let res5 = makeTextState('');
        val3 = a.hn = {
          el: res5,
          loc: res5.transform.location,
          scale: res5.transform.scale,
          env: {
            time: 0,
            duration: 0,
            frame: 0,
            fps: 30,
            absTime: 0,
            inTime: 0,
            velocity: {
              x: 0,
              y: 0
            },
            scaleVelocity: 0,
            angularVelocity: 0
          },
          vel: {
            x: 0,
            y: 0,
            scale: 0,
            angle: 0
          },
          vec: [0, 0, 0, 0],
          size: [0, 0],
          pivot: {
            x: 0,
            y: 0
          },
          skew: {
            x: 0,
            y: 0
          }
        };
      }
      let val4 = val3.el,
        val5 = val3.vec;
      val4.transform.location !== val3.loc && (val4.transform.location = val3.loc), val4.transform.scale !== val3.scale && (val4.transform.scale = val3.scale), val4.transform.pivot !== val3.pivot && (val4.transform.pivot = val3.pivot), val4.transform.skew !== val3.skew && (val4.transform.skew = val3.skew), ref3(a.transform.location, b, val5), val3.loc.x = val5[0], val3.loc.y = val5[1], val3.loc.z = val5[2], ref3(a.transform.scale, b, val5), val3.scale.x = val5[0], val3.scale.y = val5[1], a.transform.pivot ? (ref3(a.transform.pivot, b, val5), val3.pivot.x = val5[0], val3.pivot.y = val5[1]) : (val3.pivot.x = 0, val3.pivot.y = 0), a.transform.skew ? (ref3(a.transform.skew, b, val5), val3.skew.x = val5[0], val3.skew.y = val5[1]) : (val3.skew.x = 0, val3.skew.y = 0), val4.alpha = build(a.transform.opacity, b), val4.transform.angle = build(a.transform.rotation, b), a.size ? (ref3(a.size, b, val3.size), a.Fe = val3.size) : a.Fe = null, a.Ae = this.R, val4.shaderGroups && (val4.shaderGroups = null);
      for (let val6 of a.effects) {
        let get23 = this.programs.get(val6.id);
        if (!(!get23 || !get23.animator) && !(this.u && !process4(get23.definition, this.u))) try {
          let pn2 = this.pn(get23, val6, b, c),
            val7 = val3.env,
            val8 = this.scene && this.scene.fps || 30;
          val7.time = b, val7.duration = (a.endTime - a.startTime) / 1000, val7.frame = Math.round(c * val8), val7.fps = val8, val7.absTime = c, val7.inTime = 0;
          let val9 = this.scene && this.scene.width || 1,
            val10 = this.scene && this.scene.height || 1;
          val7.velocity.x = val3.vel.x / val9, val7.velocity.y = val3.vel.y / val10, val7.scaleVelocity = val3.vel.scale, val7.angularVelocity = val3.vel.angle;
          let val11 = val4.transform.angle;
          if (get23.animator.animate(val7, val4, pn2), val6.ot === void 0 && (val6.ot = val6.params.some(a2 => a2.id === "rpm")), val6.ot && val4.transform.angle !== val11) {
            let gn2 = this.gn(get23, val6, "rpm", b);
            val4.transform.angle = val11 + gn2 * c;
          }
          val6.be = Array.isArray(val4.shaderGroups) ? val4.shaderGroups.map(String) : null, val4.shaderGroups = null;
        } catch (val7) {
          a.bn || (a.bn = true, this.log("[SCENE] Script " + val6.id + " gagal: " + val7.message));
        }
      }
      return this.yn(a, val3, val4.transform.angle, c), val4.xn = val3.vel, val4;
    }
    ['yn'](a, b, c, d) {
      let val3 = b.vel,
        val4 = a.vn || (a.vn = {
          t: NaN,
          x: 0,
          y: 0,
          sx: 0,
          a: 0
        }),
        val5 = a.startTime + d * 1000,
        val6 = 1000 / (this.scene && this.scene.fps || 30),
        val7 = val5 - val4.t;
      val4.t === val4.t && val7 >= val6 * 0.25 && val7 <= val6 * 4 ? (val3.x = b.loc.x - val4.x, val3.y = b.loc.y - val4.y, val3.scale = b.scale.x - val4.sx, val3.angle = c - val4.a) : (val3.x = 0, val3.y = 0, val3.scale = 0, val3.angle = 0), val4.t = val5, val4.x = b.loc.x, val4.y = b.loc.y, val4.sx = b.scale.x, val4.a = c;
    }
    ['gn'](a, b, c, d) {
      for (let val3 of this.Le(b, a).items) if (!(val3.id !== c || val3.type === "texture")) return val3.channel ? ref3(val3.channel, d, this.ve)[0] || 0 : val3.fallback;
      return 0;
    }
    ['pn'](a, b, c, d) {
      let val3 = this.Le(b, a).items,
        val4 = b.it || (b.it = {}),
        val5 = this.ve;
      if (a.st === void 0) {
        let val7 = a.definition && a.definition.script && a.definition.script.code || '';
        a.st = /env\s*\.\s*(time|absTime|duration)/.test(val7);
      }
      let val6 = !a.st;
      for (let val7 of val3) {
        let val8 = val7.type;
        if (val8 === "texture" || val8 === "tip") continue;
        let val9 = val7.channel ? ref3(val7.channel, c, val5) : val7.fallback,
          val10 = val4[val7.id];
        if (val8 === "point") (!val10 || typeof val10 != "object") && (val10 = val4[val7.id] = {
          x: 0,
          y: 0
        }), val10.x = val9[0], val10.y = val9[1];else {
          if (val8 === "xyz") (!val10 || typeof val10 != "object" || val10.z === void 0) && (val10 = val4[val7.id] = {
            x: 0,
            y: 0,
            z: 0
          }), val10.x = val9[0], val10.y = val9[1], val10.z = val9[2];else {
            if (val8 === "color") (!val10 || typeof val10 != "object") && (val10 = val4[val7.id] = {
              r: 0,
              g: 0,
              b: 0,
              a: 1
            }), val10.r = val9[0], val10.g = val9[1], val10.b = val9[2], val10.a = val9[3] === void 0 ? 1 : val9[3];else {
              if (val8 === "switch") val4[val7.id] = !!val9[0];else {
                let val11 = Array.isArray(val9) ? val9[0] : val9;
                val7.valueType === 'hz' && val6 && typeof d == "number" && (val11 = val11 * d), val4[val7.id] = val11;
              }
            }
          }
        }
      }
      return val4;
    }
    ['kn'](a, b) {
      let arr2 = [a],
        val3 = a.parentLayer,
        n = 0;
      for (; val3 && n++ < 16;) arr2.push(val3), val3 = val3.parentLayer;
      return arr2.reverse(), arr2.length === 1 ? null : arr2;
    }
    ['rt'](a, b) {
      let val3 = a.endTime - a.startTime;
      if (val3 <= 0) return 0;
      let val4 = (b - a.startTime) / val3;
      return val4 < 0 ? 0 : val4 > 1 ? 1 : val4;
    }
    ['X'](a, b) {
      if (b < a.startTime || b > a.endTime) return null;
      let val3 = a.endTime - a.startTime;
      return val3 > 0 ? (b - a.startTime) / val3 : 0;
    }
    ['tt'](a, b, c) {
      if (a.hidden || a.re) return;
      let val3 = this.scene,
        te2 = this.te(a, b, c);
      if (Math.max(0, Math.min(1, te2.alpha)) <= 0.002) return;
      let max5 = Math.max(0, Math.min(1, te2.alpha * this.We(a, c)));
      if (max5 <= 0.002) return;
      let se2 = this.se(a, val3),
        val4 = this.workHeight / val3.height,
        val5 = this.rasterCtx;
      val5.setTransform(1, 0, 0, 1, 0, 0);
      let val6 = this.surfWidth,
        val7 = this.surfHeight;
      val5.clearRect(0, 0, val6, val7), val5.globalCompositeOperation = "source-over", val5.globalAlpha = 1, val5.save(), (this.padX || this.padY) && val5.translate(this.padX, this.padY), this.G && (val5.translate(this.k[4], this.k[5]), val5.scale(this.k[0], this.k[3]));
      let en = this.En(this.ae);
      if (this.Ce(val5, a, te2, val4, c), this.G) apply4(en, this.k, we);else {
        for (let n = 0; n < 6; n++) en[n] = we[n];
      }
      a.N = val3, a.B = Math.max(0, c * 1000), a.he = a.endTime - a.startTime;
      let fe2 = this.fe(a, se2),
        val8 = fe2[0],
        val9 = fe2[1],
        val10 = this.oe(a) > 0 ? {
          m: [en[0], en[1], en[2], en[3], en[4], en[5]],
          w: val8,
          h: val9
        } : null;
      if (update3(en, val8, val9, this.workWidth, this.workHeight, this.oe(a), this.padX, this.padY).empty) {
        val5.restore();
        return;
      }
      let val11 = null;
      if (a.tag === "embedScene" && a.scene) {
        let round = Math.round(val8),
          round2 = Math.round(val9),
          max6 = Math.max(0, c * 1000),
          rn2 = this.rn(a, a.scene, round, round2, max6);
        if (rn2) {
          let val16 = this.wn || (this.wn = [0, 0, 0, 0, 0, 0]);
          val16[0] = en[0], val16[1] = en[1], val16[2] = en[2], val16[3] = en[3], val16[4] = en[4] + this.padX, val16[5] = en[5] + this.padY, val11 = {
            at: rn2.tex,
            m: val16,
            w: round,
            h: round2
          };
        } else this.Se(a, se2, val5);
      } else {
        let val16 = this.i ? performance.now() : 0;
        val11 = this.Se(a, se2, val5), this.i && (this.i.raster += performance.now() - val16);
      }
      build5(this.o, en, val8, val9, this.workWidth, this.workHeight), val5.restore();
      let val12 = this.i ? performance.now() : 0,
        un = this.un(a, b, c, val6, val7, te2.xn, val11, val10);
      this.i && (this.i.chain += performance.now() - val12);
      let val13 = un.texture;
      un.expanded && un.domain && (val13 = this.ln(val13, un.domain, val6, val7));
      let res5 = process5(a.blendMode),
        val14 = Vs[res5] ? res5 : null;
      val14 && (val13 = this.mn(val13, val14, val6, val7));
      let val15 = this.gl;
      val15.bindFramebuffer(val15.FRAMEBUFFER, this.sceneTarget.fbo), val15.viewport(0, 0, val6, val7), val15.enable(val15.BLEND);
      let dn = this.dn(val14 ? "normal" : a.blendMode);
      val15.blendFunc(dn[0], dn[1]), val15.useProgram(this.blitProgram), this.E(this.blitAttribs), val15.activeTexture(val15.TEXTURE0), val15.bindTexture(val15.TEXTURE_2D, val13), this.blitUniforms.u_image && val15.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && val15.uniform1f(this.blitUniforms.u_alpha, max5), this.blitUniforms.u_transform && val15.uniformMatrix3fv(this.blitUniforms.u_transform, false, ic), val15.drawArrays(val15.TRIANGLES, 0, 6), val15.disable(val15.BLEND);
    }
    ['Ce'](a, b, c, d, arg) {
      let kn2 = this.kn(b);
      if (!kn2) return this.ct(a, c, d, we), we;
      we[0] = 1, we[1] = 0, we[2] = 0, we[3] = 1, we[4] = 0, we[5] = 0;
      let val3 = b.startTime + arg * 1000;
      for (let val4 of kn2) {
        let val5 = val4 === b ? c : this.te(val4, this.rt(val4, val3), (val3 - val4.startTime) / 1000);
        this.ct(a, val5, d, Xs), apply4(we, we, Xs);
      }
      return we;
    }
    ['ct'](a, b, c, d) {
      let val3 = b.transform,
        val4 = val3.location.x * c,
        val5 = val3.location.y * c,
        val6 = val3.scale.x || 0.0001,
        val7 = val3.scale.y || 0.0001,
        val8 = val3.angle * Math.PI / 180,
        cos = Math.cos(val8),
        sin = Math.sin(val8),
        val9 = val3.skew && val3.skew.x || 0,
        val10 = val3.skew && val3.skew.y || 0,
        val11 = (val3.pivot && val3.pivot.x || 0) * c,
        val12 = (val3.pivot && val3.pivot.y || 0) * c;
      if (a.translate(val4, val5), val3.angle && a.rotate(val8), (val9 || val10) && a.transform(1, val10, val9, 1, 0, 0), a.scale(val6, val7), (val11 || val12) && a.translate(-val11, -val12), d) {
        let val13 = -val6 * val11 - val9 * val7 * val12,
          val14 = -val10 * val6 * val11 - val7 * val12;
        d[0] = cos * val6 - sin * val10 * val6, d[1] = sin * val6 + cos * val10 * val6, d[2] = cos * val9 * val7 - sin * val7, d[3] = sin * val9 * val7 + cos * val7, d[4] = val4 + cos * val13 - sin * val14, d[5] = val5 + sin * val13 + cos * val14;
      }
      return d;
    }
    ['We'](a, b) {
      let val3 = a.parentLayer,
        n = 1,
        n3 = 0;
      for (; val3 && n3++ < 16;) {
        let val4 = a.startTime + b * 1000,
          te2 = this.te(val3, this.rt(val3, val4), (val4 - val3.startTime) / 1000);
        n *= te2.alpha, val3 = val3.parentLayer;
      }
      return n;
    }
    ['En'](a) {
      let val3 = this._e[a];
      return val3 || (val3 = this._e[a] = new Float32Array(6)), val3;
    }
    ['et'](a) {
      let val3 = this.scene,
        res5 = ref5(val3, a);
      if (!res5) return this.G = false, false;
      let val4 = res5.camera,
        val5 = val4.endTime - val4.startTime,
        val6 = val5 > 0 ? (a - val4.startTime) / val5 : 0;
      val6 < 0 ? val6 = 0 : val6 > 1 && (val6 = 1);
      let res6 = ref3(val4.transform.location, val6, this.ht),
        val7 = val4.fov > 0 ? val4.fov : 60,
        max5 = Math.max(0.001, Math.abs(res6[2])),
        val8 = val3.height / 2 / Math.tan(val7 * Math.PI / 360) / max5,
        val9 = this.workHeight / val3.height;
      return this.k[0] = val8, this.k[1] = 0, this.k[2] = 0, this.k[3] = val8, this.k[4] = (val3.width / 2 - res6[0] * val8) * val9, this.k[5] = (val3.height / 2 - res6[1] * val8) * val9, this.G = true, true;
    }
    ["renderAt"](a) {
      if (!this.scene) return;
      let val3 = this.gl,
        val4 = this.i ? performance.now() : 0;
      this.i && this.xt(), this.R++, this.workWidth = this.baseWidth, this.workHeight = this.baseHeight, this.Mt(), this.timeMs = a, this.stats = {
        layers: 0,
        passes: 0,
        videoUploads: 0,
        videoReuses: 0,
        videoPasses: 0,
        videoAudioOnly: 0
      }, this.sceneTarget = this.F(this.surfWidth, this.surfHeight, "scene:", true).a, val3.bindFramebuffer(val3.FRAMEBUFFER, this.sceneTarget.fbo), val3.viewport(0, 0, this.surfWidth, this.surfHeight), val3.disable(val3.BLEND);
      let val5 = this.scene.bgcolor;
      val3.clearColor(val5[0], val5[1], val5[2], val5[3]), val3.clear(val3.COLOR_BUFFER_BIT), this.et(a);
      for (let val7 of this.scene.layers) {
        if (this.hiddenLayers && this.hiddenLayers.has(val7.id)) continue;
        let x = this.X(val7, a);
        x !== null && (this.stats.layers++, this.tt(val7, x, (a - val7.startTime) / 1000));
      }
      this.$t(a), this.De(), val3.bindFramebuffer(val3.FRAMEBUFFER, null), val3.viewport(0, 0, this.workWidth, this.workHeight), val3.disable(val3.BLEND), val3.useProgram(this.blitProgram), this.E(this.blitAttribs), val3.activeTexture(val3.TEXTURE0), val3.bindTexture(val3.TEXTURE_2D, this.sceneTarget.tex), this.blitUniforms.u_image && val3.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && val3.uniform1f(this.blitUniforms.u_alpha, 1);
      let val6 = this.pt;
      val6[0] = this.surfWidth / this.workWidth, val6[1] = 0, val6[2] = 0, val6[3] = 0, val6[4] = this.surfHeight / this.workHeight, val6[5] = 0, val6[6] = 0, val6[7] = 0, val6[8] = 1, this.blitUniforms.u_transform && val3.uniformMatrix3fv(this.blitUniforms.u_transform, false, val6), val3.drawArrays(val3.TRIANGLES, 0, 6), this.i && (this.i.frame += performance.now() - val4, this.i.frames++), this.debugMode && this.Tn(a);
    }
    ['Tn'](a) {
      if (!this.scene || !this.scene.layers) return;
      let val3 = this.debugCanvas;
      if (!val3 || !this.canvas.getBoundingClientRect) return;
      let getBoundingClientRect = (val3.parentElement || val3).getBoundingClientRect(),
        getBoundingClientRect2 = this.canvas.getBoundingClientRect();
      if (!getBoundingClientRect.width || !getBoundingClientRect2.width || !this.scene.height) return;
      let max5 = Math.max(1, Math.min(3, typeof window < 'u' && window.devicePixelRatio || 1)),
        round = Math.round(getBoundingClientRect.width * max5),
        round2 = Math.round(getBoundingClientRect.height * max5);
      (val3.width !== round || val3.height !== round2) && (val3.width = round, val3.height = round2);
      let ctx = val3.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0), ctx.clearRect(0, 0, val3.width, val3.height), ctx.save(), ctx.scale(max5, max5);
      let val4 = getBoundingClientRect2.height / this.scene.height;
      ctx.translate(getBoundingClientRect2.left - getBoundingClientRect.left, getBoundingClientRect2.top - getBoundingClientRect.top), ctx.save(), ctx.strokeStyle = "rgba(255,255,255,0.55)", ctx.lineWidth = 1, ctx.setLineDash([6, 4]), ctx.strokeRect(0, 0, getBoundingClientRect2.width, getBoundingClientRect2.height), ctx.restore();
      let fn8 = a2 => a2,
        fn9 = (a2, b) => {
          if (!(!a2 || !a2.layers)) for (let val5 of a2.layers) {
            if (val5.hidden || val5.re || this.hiddenLayers && this.hiddenLayers.has(val5.id)) continue;
            let val6 = a - b,
              x = this.X(val5, val6);
            if (x === null) continue;
            if (val5.tag === "embedScene" && val5.scene) {
              fn9(val5.scene, b + (val5.startTime || 0));
              continue;
            }
            let val7 = (val6 - val5.startTime) / 1000,
              te2 = this.te(val5, x, val7);
            if (Math.max(0, Math.min(1, te2.alpha)) <= 0.002) continue;
            ctx.save(), this.Ce(ctx, val5, te2, val4, val7);
            let se2 = this.se(val5, a2),
              val8 = se2[0] * val4,
              val9 = se2[1] * val4,
              val10 = this.debugSelectedLayerId != null && (val5.id === this.debugSelectedLayerId || String(val5.id) === String(this.debugSelectedLayerId));
            ctx.strokeStyle = val10 ? "#ff3333" : "#00ff44", ctx.lineWidth = fn8(val10 ? 2.5 : 1.2), ctx.beginPath(), ctx.rect(-val8 / 2, -val9 / 2, val8, val9), ctx.stroke(), ctx.restore();
          }
        };
      fn9(this.scene, 0), ctx.restore();
    }
  },
  Qi = null,
  hc = 6;
function apply5() {
  return Qi || (Qi = import("https://cdn.jsdelivr.net/npm/mediabunny@1.55.6/+esm")), Qi;
}
var Ji = class val3 {
    constructor({
      fps: a
    }, b) {
      this.mb = b, this.output = new b.Output({
        format: new b.Mp4OutputFormat(),
        target: new b.BufferTarget()
      }), this.fps = a, this.videoSource = null, this.audioSource = null, this.U = Promise.resolve(), this.ne = null, this.lt = 0, this.ut = 0, this.dt = 0, this.ft = 0;
    }
    static async ["create"]({
      fps: a
    }) {
      let val4 = await apply5();
      return new val3({
        fps: a
      }, val4);
    }
    ["addVideoTrack"]() {
      this.videoSource = new this.mb.EncodedVideoPacketSource("avc"), this.output.addVideoTrack(this.videoSource, {
        frameRate: this.fps
      });
    }
    ["addAudioTrack"]() {
      this.audioSource = new this.mb.EncodedAudioPacketSource("aac"), this.output.addAudioTrack(this.audioSource);
    }
    async ["start"]() {
      await this.output.start();
    }
    ["queueFrame"](a, b) {
      this.lt++, this.dt += a.byteLength;
      let fromEncodedChunk = this.mb.EncodedPacket.fromEncodedChunk(a);
      return this.U = this.U.then(() => this.videoSource.add(fromEncodedChunk, b)).catch(a2 => {
        this.ne || (this.ne = a2);
      }), this.U;
    }
    ["queueAudioPacket"](a, b) {
      this.ut++, this.ft += a.byteLength;
      let fromEncodedChunk = this.mb.EncodedPacket.fromEncodedChunk(a);
      return this.U = this.U.then(() => this.audioSource.add(fromEncodedChunk, b)).catch(a2 => {
        this.ne || (this.ne = a2);
      }), this.U;
    }
    get ["frameCount"]() {
      return this.lt;
    }
    get ["audioCount"]() {
      return this.ut;
    }
    get ["hasAudio"]() {
      return !!this.audioSource;
    }
    get ["byteLength"]() {
      return this.dt;
    }
    get ["audioByteLength"]() {
      return this.ft;
    }
    async ["drain"]() {
      if (await this.U, this.ne) throw this.ne;
    }
    ["cancel"]() {
      this.U = this.U.catch(() => {});
      try {
        if (this.output && typeof this.output.cancel == "function") return this.output.cancel();
      } catch {}
      return Promise.resolve();
    }
    async ["finish"]() {
      return await this.drain(), await this.output.finalize(), this.output.target.buffer;
    }
  },
  pc = [{
    id: "h264",
    codec: "avc1.640033"
  }, {
    id: "h264",
    codec: "avc1.64002A"
  }, {
    id: "h264",
    codec: "avc1.4D0028"
  }, {
    id: "h264",
    codec: "avc1.42E01F"
  }];
function obj15() {
  return {
    webcodecs: typeof globalThis.VideoEncoder == "function" && typeof globalThis.VideoFrame == "function",
    mediaRecorder: typeof globalThis.MediaRecorder == "function",
    audioEncoder: typeof globalThis.AudioEncoder == "function" && typeof globalThis.AudioData == "function" && typeof globalThis.OfflineAudioContext == "function"
  };
}
async function update5({
  width: a,
  height: a2,
  bitrate: a3,
  fps: a4
}) {
  for (let val3 of pc) {
    let obj23 = {
      codec: val3.codec,
      width: a,
      height: a2,
      bitrate: a3,
      framerate: a4,
      latencyMode: "realtime",
      hardwareAcceleration: "prefer-hardware",
      avc: {
        format: "avc"
      }
    };
    try {
      let val4 = await VideoEncoder.isConfigSupported(obj23);
      if (val4 && val4.supported) return {
        ...val3,
        config: obj23
      };
    } catch {}
  }
  return null;
}
async function obj16({
  sampleRate: a = Ft,
  bitrate: a2 = 128000,
  channels: a3 = 2
} = {}) {
  if (typeof globalThis.AudioEncoder != "function") return {
    ok: false,
    reason: "AudioEncoder tidak ada di browser ini"
  };
  let items3 = [a, 48000, 44100, 32000, 24000, 22050, 16000].filter((a4, b, c) => c.indexOf(a4) === b);
  for (let val3 of items3) for (let val4 of [a3, 2, 1].filter((a4, b, c) => c.indexOf(a4) === b)) {
    let obj23 = {
      codec: "mp4a.40.2",
      sampleRate: val3,
      numberOfChannels: val4,
      bitrate: Math.round(a2),
      aac: {
        format: "aac"
      }
    };
    try {
      let val5 = await AudioEncoder.isConfigSupported(obj23);
      if (val5 && val5.supported) return {
        ok: true,
        config: val5.config || obj23,
        sampleRate: val3,
        channels: val4
      };
    } catch {}
  }
  return {
    ok: false,
    reason: "AudioEncoder menolak AAC di semua kombinasi sample rate / channel"
  };
}
async function handle6({
  width: a = 0,
  height: a2 = 0,
  bitrate: a3 = 6000000,
  fps: a4 = 30,
  needAudio: a5 = false
} = {}) {
  let res5 = obj15(),
    obj23 = {
      mode: "none",
      video: {
        ok: false,
        codec: null,
        reason: ''
      },
      audio: {
        ok: !a5,
        needed: !!a5,
        reason: ''
      },
      reason: ''
    };
  if (res5.webcodecs) {
    let val3 = await update5({
      width: a,
      height: a2,
      bitrate: a3,
      fps: a4
    });
    val3 ? (obj23.mode = "webcodecs", obj23.video = {
      ok: true,
      codec: val3.id,
      config: val3.config
    }) : obj23.video = {
      ok: false,
      codec: null,
      reason: "tidak ada profil H.264 yang didukung encoder perangkat ini"
    };
  } else obj23.video = {
    ok: false,
    codec: null,
    reason: "WebCodecs (VideoEncoder/VideoFrame) tidak ada"
  };
  if (a5) {
    if (!res5.audioEncoder) obj23.audio = {
      ok: false,
      needed: true,
      reason: "WebCodecs audio (AudioEncoder/AudioData/OfflineAudioContext) tidak ada"
    };else {
      let val3 = await obj16({
        bitrate: 128000
      });
      obj23.audio = val3.ok ? {
        ok: true,
        needed: true,
        config: val3.config,
        sampleRate: val3.sampleRate,
        channels: val3.channels
      } : {
        ok: false,
        needed: true,
        reason: val3.reason
      };
    }
  }
  return obj23.audioRequestedButUnavailable = a5 && !obj23.audio.ok, obj23.video.ok ? obj23.mode = "webcodecs" : res5.mediaRecorder ? obj23.mode = "mediarecorder" : obj23.mode = "none", obj23.mode === "none" && (obj23.reason = obj23.video.reason || "tidak ada jalur ekspor video yang didukung browser ini"), obj23;
}
var jn = a => new Promise(a2 => setTimeout(a2, a)),
  Ft = 48000;
async function ref13(a, b, c = () => {}, {
  quick: d = false
} = {}) {
  let val3 = await fetch(b);
  if (!val3.ok) throw new Error("gagal memuat audio: HTTP " + val3.status);
  let val4 = await val3.arrayBuffer();
  c({
    phase: "audio",
    stage: "decode",
    bytes: val4.byteLength
  });
  {
    let uint8Array = new Uint8Array(val4.slice(0, 12)),
      join3 = Array.from(uint8Array).map(a2 => a2 >= 32 && a2 < 127 ? String.fromCharCode(a2) : '.').join('');
    c({
      phase: "audio",
      stage: "fallback",
      message: "sumber " + String(b).slice(-60) + " | " + (val3.headers.get("content-type") || '?') + " | " + val4.byteLength + " B | header \"" + join3 + '\x22'
    });
  }
  let val5;
  try {
    val5 = await a.decodeAudioData(val4.slice(0));
  } catch (val6) {
    c({
      phase: "audio",
      stage: "fallback",
      message: "decodeAudioData gagal, coba demux Mediabunny: " + String(val6 && val6.message || val6)
    });
    let val7 = await apply5(),
      val8 = await new val7.Input({
        source: new val7.BlobSource(new Blob([val4])),
        formats: val7.ALL_FORMATS
      }).getPrimaryAudioTrack();
    if (!val8) throw new Error("file ini tidak punya track audio");
    if (d) {
      if (typeof val8.canDecode == "function" && !(await val8.canDecode())) throw new Error("codec audio \"" + (val8.codec || '?') + "\" tidak didukung decoder perangkat ini (" + String(val6 && val6.message || val6) + ')');
      let val10 = new val7.AudioBufferSink(val8);
      for await (let val11 of val10.buffers()) if (val11 && val11.buffer) break;
      return null;
    }
    let val9 = new val7.AudioBufferSink(val8),
      arr2 = [],
      n = 0,
      n3 = 0,
      n4 = 0;
    for await (let val10 of val9.buffers()) {
      let val11 = val10.buffer;
      n3 || (n3 = val11.sampleRate, n4 = val11.numberOfChannels), arr2.push(val11), n += val11.length;
    }
    if (!n) throw new Error("track audio kosong");
    val5 = a.createBuffer(n4, n, n3);
    let n5 = 0;
    for (let val10 of arr2) {
      for (let n6 = 0; n6 < n4; n6++) val5.copyToChannel(val10.getChannelData(Math.min(n6, val10.numberOfChannels - 1)), n6, n5);
      n5 += val10.length;
    }
  }
  return val5;
}
var na = new Map(),
  ea = 0,
  gc = 96 * 1024 * 1024;
function compute5() {
  na.clear(), ea = 0;
}
async function ref14(a, {
  sampleRate: b = Ft,
  onProgress: b2 = () => {},
  isCancelled: b3 = () => false
} = {}) {
  let obj23 = {
      ok: [],
      failed: []
    },
    map = new Map(),
    items3 = (a || []).filter(a2 => a2 && a2.url);
  if (typeof globalThis.OfflineAudioContext != "function") {
    for (let val3 of items3) obj23.failed.push({
      url: val3.url,
      label: val3.label || "audio",
      reason: "OfflineAudioContext tidak ada di browser ini"
    });
    return obj23;
  }
  let offlineAudioContext = new OfflineAudioContext(2, 1, b),
    n = 0;
  for (let val3 of items3) {
    if (b3()) break;
    n++;
    let val4 = val3.label || "audio";
    if (map.has(val3.url)) {
      let get23 = map.get(val3.url);
      (get23.error ? obj23.failed : obj23.ok).push(get23.error ? {
        url: val3.url,
        label: val4,
        reason: get23.error
      } : {
        url: val3.url,
        label: val4
      });
      continue;
    }
    let now = performance.now(),
      fn8 = () => b2({
        phase: "audio",
        stage: "preflight",
        message: "Memeriksa audio " + n + '/' + items3.length + ':\x20' + val4 + '\x20(' + Math.round((performance.now() - now) / 1000) + " dtk)"
      });
    fn8();
    let res5 = setInterval(fn8, 1000);
    try {
      let val5 = await ref13(offlineAudioContext, val3.url, () => {}, {
        quick: true
      });
      if (val5) {
        let val6 = val5.length * val5.numberOfChannels * 4;
        ea + val6 <= gc && (na.set(val3.url, val5), ea += val6);
      }
      map.set(val3.url, {}), obj23.ok.push({
        url: val3.url,
        label: val4
      });
    } catch (val5) {
      let res6 = String(val5 && val5.message || val5);
      map.set(val3.url, {
        error: res6
      }), obj23.failed.push({
        url: val3.url,
        label: val4,
        reason: res6
      });
    } finally {
      clearInterval(res5);
    }
  }
  return obj23;
}
async function smoothstep({
  url: a,
  tracks: a3 = null,
  startMs: a4 = 0,
  endMs: a2,
  rate: a5 = 1,
  offsetMs: a6 = 0,
  inTimeMs: a7 = 0,
  sampleRate: a8 = Ft,
  channels: a9 = 2,
  onProgress: a10 = () => {}
}) {
  if (typeof globalThis.OfflineAudioContext != "function") throw new Error("OfflineAudioContext tidak ada di browser ini");
  let max5 = Math.max(0, (a2 - a4) / 1000),
    max6 = Math.max(1, Math.round(max5 * a8)),
    offlineAudioContext = new OfflineAudioContext(a9, max6, a8),
    fn8 = a11 => Math.max(0.0625, Math.min(4, Number(a11) || 1)),
    map = new Map(),
    fn9 = async a11 => {
      if (map.has(a11)) return map.get(a11);
      let val5 = na.get(a11) || (await ref13(offlineAudioContext, a11, a10));
      return map.set(a11, val5), val5;
    },
    fn10 = (a11, b) => {
      if (!a11 || !a11.length) return 1;
      if (b <= a11[0][0]) return a11[0][1];
      for (let n3 = 1; n3 < a11.length; n3++) if (b <= a11[n3][0]) {
        let [val5, val6] = a11[n3 - 1],
          [val7, val8] = a11[n3],
          val9 = val7 === val5 ? 0 : (b - val5) / (val7 - val5);
        return val6 + (val8 - val6) * val9;
      }
      return a11[a11.length - 1][1];
    },
    val3 = Array.isArray(a3) && a3.length ? a3 : [{
      url: a,
      rate: a5,
      offsetMs: a6,
      inTimeMs: a7,
      layerStartMs: 0,
      layerEndMs: a2,
      speed: 1
    }],
    n = 0,
    arr2 = [];
  for (let val5 of val3) {
    if (!val5 || !val5.url) continue;
    let val6;
    try {
      val6 = await fn9(val5.url);
    } catch (val14) {
      arr2.push(String(val14 && val14.message || val14)), a10({
        phase: "audio",
        stage: "skip",
        url: val5.url,
        message: "track dilewati: " + String(val14 && val14.message || val14)
      });
      continue;
    }
    let res5 = fn8((val5.speed || 1) * (val5.rate != null ? val5.rate : a5)),
      val7 = Number.isFinite(val5.layerStartMs) ? val5.layerStartMs : a4,
      val8 = Number.isFinite(val5.layerEndMs) ? val5.layerEndMs : a2,
      val9 = Number(val5.offsetMs != null ? val5.offsetMs : a6) || 0,
      max7 = Math.max(0, Number(val5.inTimeMs) || 0),
      max8 = Math.max(a4, val7),
      min = Math.min(a2, val8);
    if (min <= max8) continue;
    let max82 = max8,
      val10 = max7 + (max82 - val9 - val7) * res5;
    if (val10 < 0 && (max82 += -val10 / res5, val10 = 0), max82 >= min) continue;
    let val11 = (max82 - a4) / 1000,
      createBufferSource = offlineAudioContext.createBufferSource();
    createBufferSource.buffer = val6, createBufferSource.playbackRate.value = res5;
    let createGain = offlineAudioContext.createGain();
    createBufferSource.connect(createGain), createGain.connect(offlineAudioContext.destination);
    let val12 = Array.isArray(val5.gainPoints) && val5.gainPoints.length ? val5.gainPoints : [[0, 1], [1, 1]],
      val13 = val8 > val7 ? val8 - val7 : 1,
      n3 = 32;
    for (let n4 = 0; n4 <= n3; n4++) {
      let val14 = max82 + (min - max82) * (n4 / n3),
        min2 = Math.min(1, Math.max(0, (val14 - val7) / val13));
      createGain.gain.setValueAtTime(Math.max(0, Math.min(1, fn10(val12, min2))), val11 + (val14 - max82) / 1000);
    }
    createBufferSource.start(val11, val10 / 1000), createBufferSource.stop(val11 + (min - max82) / 1000 + 0.001), n++, a10({
      phase: "audio",
      stage: "info",
      message: "track " + String(val5.url).slice(-40) + ':\x20' + val6.duration.toFixed(2) + "s, " + val6.numberOfChannels + "ch, layer " + (val7 / 1000).toFixed(1) + '-' + (val8 / 1000).toFixed(1) + "s, mulai sumber " + (val10 / 1000).toFixed(2) + "s, speed " + res5 + ", gain@mulai " + fn10(val12, Math.min(1, Math.max(0, (max82 - val7) / val13))).toFixed(2)
    });
  }
  if (!n) throw new Error("tidak ada audio yang bisa dicampur" + (arr2.length ? ':\x20' + arr2[0] : " (semua track di luar rentang ekspor)"));
  a10({
    phase: "audio",
    stage: "render",
    frames: max6,
    decoded: map.size
  });
  let val4 = await offlineAudioContext.startRendering();
  {
    let n3 = 0;
    for (let n4 = 0; n4 < val4.numberOfChannels; n4++) {
      let getChannelData = val4.getChannelData(n4);
      for (let n5 = 0; n5 < getChannelData.length; n5 += 7) {
        let abs = Math.abs(getChannelData[n5]);
        abs > n3 && (n3 = abs);
      }
    }
    a10({
      phase: "audio",
      stage: "info",
      message: "hasil campuran: " + n + " track, puncak amplitudo " + n3.toFixed(3) + (n3 < 0.001 ? " (SENYAP)" : '')
    });
  }
  return val4;
}
async function obj17({
  url: a,
  tracks: a3 = null,
  startMs: a4 = 0,
  endMs: a2,
  rate: a5 = 1,
  offsetMs: a6 = 0,
  inTimeMs: a7 = 0,
  sampleRate: a8 = Ft,
  bitrate: a9 = 128000,
  onProgress: a10 = () => {}
}) {
  if (typeof globalThis.AudioEncoder != "function" || typeof globalThis.AudioData != "function") throw new Error("WebCodecs audio (AudioEncoder) tidak ada di browser ini");
  let n = 2,
    max5 = Math.max(0, (a2 - a4) / 1000),
    val3 = await smoothstep({
      url: a,
      tracks: a3,
      startMs: a4,
      endMs: a2,
      rate: a5,
      offsetMs: a6,
      inTimeMs: a7,
      sampleRate: a8,
      channels: n,
      onProgress: a10
    }),
    val4 = await obj16({
      sampleRate: a8,
      bitrate: a9,
      channels: n
    });
  if (!val4 || !val4.ok) throw new Error("AudioEncoder menolak AAC di semua kombinasi sample rate / channel.");
  let val5 = val4.sampleRate,
    val6 = val4.channels,
    ref24 = val3;
  if (val5 !== a8 || val6 !== n) {
    let offlineAudioContext = new OfflineAudioContext(val6, Math.round(max5 * val5), val5),
      createBufferSource = offlineAudioContext.createBufferSource();
    createBufferSource.buffer = val3, createBufferSource.connect(offlineAudioContext.destination), createBufferSource.start(0), ref24 = await offlineAudioContext.startRendering();
  }
  let ref25 = val5,
    ref26 = val6,
    arr2 = [],
    val7 = null,
    audioEncoder = new AudioEncoder({
      output: (a11, b) => {
        arr2.push({
          chunk: a11,
          metadata: b
        });
      },
      error: a11 => {
        val7 = a11;
      }
    });
  audioEncoder.configure(val4.config || {
    codec: "mp4a.40.2",
    sampleRate: ref25,
    numberOfChannels: ref26,
    bitrate: Math.round(a9),
    aac: {
      format: "aac"
    }
  });
  let max6 = Math.max(1024, Math.round(ref25 / 12)),
    arr3 = [];
  for (let n3 = 0; n3 < ref26; n3++) arr3.push(ref24.getChannelData(n3));
  try {
    for (let n3 = 0; n3 < ref24.length; n3 += max6) {
      if (val7) throw val7;
      let min = Math.min(max6, ref24.length - n3),
        float32Array = new Float32Array(min * ref26);
      for (let n4 = 0; n4 < ref26; n4++) float32Array.set(arr3[n4].subarray(n3, n3 + min), n4 * min);
      let audioData = new AudioData({
        format: "f32-planar",
        sampleRate: ref25,
        numberOfFrames: min,
        numberOfChannels: ref26,
        timestamp: Math.round(n3 / ref25 * 1000000),
        data: float32Array
      });
      for (audioEncoder.encode(audioData), audioData.close(); audioEncoder.encodeQueueSize > 32;) if (await jn(2), val7) throw val7;
      n3 / max6 % 25 === 0 && a10({
        phase: "audio",
        stage: "encode",
        frames: n3 + min,
        total: ref24.length,
        packets: arr2.length
      });
    }
    await audioEncoder.flush();
  } finally {
    try {
      audioEncoder.close();
    } catch {}
  }
  if (val7) throw val7;
  if (!arr2.length) throw new Error("encoder AAC tidak menghasilkan paket audio");
  return {
    packets: arr2,
    sampleRate: ref25,
    channels: ref26,
    seconds: max5
  };
}
function update6(a, b, c) {
  if (typeof document > 'u' || !document.createElement) return {
    canvas: c,
    ctx: null
  };
  let canvasEl = document.createElement("canvas");
  canvasEl.width = a, canvasEl.height = b;
  let ctx = canvasEl.getContext('2d');
  return !ctx || typeof ctx.drawImage != "function" ? {
    canvas: c,
    ctx: null
  } : {
    canvas: canvasEl,
    ctx: ctx
  };
}
function build6(a, b, c, d) {
  return a.ctx && a.ctx.drawImage(b, 0, 0, c, d), a.canvas;
}
function handle7(a) {
  return a ? a.cancelled || a.name === "AbortError" || a.name === "CancelledError" ? "cancelled" : a.audioFailure ? "audio" : a.codecFailure ? "codec" : a.muxFailure ? "mux" : a.ffmpegFailure ? "ffmpeg" : a.renderFailure ? "renderer" : "unknown" : "unknown";
}
function process7(a, {
  audioRequested: b = false
} = {}) {
  switch (handle7(a)) {
    case "audio":
    case "codec":
    case "mux":
      return true;
    default:
      return false;
  }
}
function ref15(a) {
  if (a && typeof a == "object" && !a.codecFailure && !a.audioFailure && !a.muxFailure) try {
    a.codecFailure = true;
  } catch {}
  return a;
}
async function render5({
  canvas: a,
  renderFrame: a2,
  prepareFrame: a4 = null,
  startMs: a5 = 0,
  endMs: a3,
  fps: a6 = 30,
  bitrate: a7 = 6000000,
  onProgress: a8 = () => {},
  isCancelled: a9 = () => false,
  keyFrameEverySec: a10 = 2,
  audio: a11 = null
}) {
  let val3 = a.width - a.width % 2,
    val4 = a.height - a.height % 2,
    val5 = 1000 / a6,
    max5 = Math.max(1, Math.round((a3 - a5) / val5) + 1),
    res5 = obj15(),
    res6 = update6(val3, val4, a),
    val6 = !!(a11 && (a11.url || Array.isArray(a11.tracks) && a11.tracks.length)),
    now = performance.now(),
    fn8 = a12 => a8({
      total: max5,
      elapsedMs: performance.now() - now,
      ...a12
    });
  if (!res5.webcodecs) {
    if (val6) throw new Error("Ekspor audio butuh WebCodecs (VideoEncoder + AudioEncoder). Browser ini tidak punya WebCodecs, dan mode MediaRecorder tidak bisa menyertakan audio. Pilih ekspor video saja, atau pakai browser yang mendukung WebCodecs.");
    fn8({
      phase: "prepare",
      stage: "fallback",
      message: "WebCodecs tidak ada: memakai MediaRecorder (real-time, tanpa audio)"
    });
    let val14 = await handle8({
      canvas: a,
      snapshot: res6,
      renderFrame: a2,
      startMs: a5,
      intervalMs: val5,
      totalFrames: max5,
      fps: a6,
      report: fn8,
      isCancelled: a9
    });
    return val14.status = val14.cancelled ? "cancelled" : "success", val14.audio = null, fn8({
      phase: "selesai",
      ...val14,
      bytes: val14.blob.size
    }), val14;
  }
  let val7 = await update5({
    width: val3,
    height: val4,
    bitrate: a7,
    fps: a6
  });
  if (!val7) {
    let error = new Error("Tidak ada codec video (H.264) yang didukung encoder browser ini.");
    throw error.codecFailure = true, error;
  }
  a8({
    phase: "mulai",
    total: max5,
    codec: val7.id,
    width: val3,
    height: val4,
    bitrate: a7,
    fps: a6
  });
  let val8 = null,
    val9 = null;
  if (val6) {
    fn8({
      phase: "audio",
      stage: "prepare"
    });
    try {
      val8 = await obj17({
        url: a11.url,
        tracks: a11.tracks || null,
        startMs: a5,
        endMs: a3,
        rate: a11.rate,
        offsetMs: a11.offsetMs,
        inTimeMs: a11.inTimeMs || 0,
        sampleRate: a11.sampleRate || Ft,
        bitrate: a11.bitrate || 128000,
        onProgress: a12 => fn8(a12)
      });
    } catch (val14) {
      fn8({
        phase: "audio",
        stage: "gagal",
        message: val14.message
      });
      let error = new Error("Ekspor dibatalkan: track audio diminta tapi gagal disiapkan (" + val14.message + ').');
      throw error.audioFailure = true, error;
    }
  }
  fn8({
    phase: "mux",
    stage: "open"
  });
  let val10 = await Ji.create({
    fps: a6
  });
  if (val10.addVideoTrack(), val8 && val10.addAudioTrack(), await val10.start(), val8) {
    for (let val14 of val8.packets) await val10.queueAudioPacket(val14.chunk, val14.metadata);
    val9 = {
      packets: val8.packets.length,
      sampleRate: val8.sampleRate,
      channels: val8.channels,
      seconds: val8.seconds,
      bytes: val10.audioByteLength
    }, fn8({
      phase: "audio",
      stage: 'ok',
      ...val9
    });
  }
  let val11 = null,
    map = new Map(),
    obj23 = {
      outputCount: 0,
      totalLatency: 0,
      minLatency: 1 / 0,
      maxLatency: 0,
      maxQueue: 0
    },
    videoEncoder = new VideoEncoder({
      output: (a12, b) => {
        let get23 = map.get(a12.timestamp);
        if (get23 !== void 0) {
          let val14 = performance.now() - get23;
          map.delete(a12.timestamp), obj23.outputCount++, obj23.totalLatency += val14, obj23.minLatency = Math.min(obj23.minLatency, val14), obj23.maxLatency = Math.max(obj23.maxLatency, val14);
        }
        val10.queueFrame(a12, b);
      },
      error: a12 => {
        val11 = a12;
      }
    });
  try {
    videoEncoder.configure(val7.config);
  } catch (val14) {
    try {
      videoEncoder.close();
    } catch {}
    let error = new Error("VideoEncoder menolak konfigurasi " + val7.id + '\x20' + val3 + 'x' + val4 + ':\x20' + val14.message);
    throw error.codecFailure = true, error;
  }
  let max6 = Math.max(1, Math.round(a6 * a10)),
    arr2 = [],
    val12 = 1 / 0,
    n = 0,
    flag3 = false,
    obj24 = {
      prepare: 0,
      render: 0,
      encode: 0,
      queue: 0
    };
  try {
    for (let n3 = 0; n3 < max5; n3++) {
      if (a9()) {
        flag3 = true;
        break;
      }
      if (val11) throw ref15(val11);
      let now2 = performance.now(),
        val14 = a5 + n3 * val5;
      a4 && (await a4(val14));
      let now3 = performance.now();
      a2(val14);
      let now4 = performance.now(),
        videoFrame = new VideoFrame(build6(res6, a, val3, val4), {
          timestamp: Math.round(n3 * val5 * 1000),
          duration: Math.round(val5 * 1000)
        });
      map.set(videoFrame.timestamp, performance.now()), videoEncoder.encode(videoFrame, {
        keyFrame: n3 % max6 === 0
      }), obj23.maxQueue = Math.max(obj23.maxQueue, videoEncoder.encodeQueueSize), videoFrame.close();
      let now5 = performance.now();
      for (; videoEncoder.encodeQueueSize > hc;) if (await jn(2), val11) throw ref15(val11);
      let now6 = performance.now();
      obj24.prepare += now3 - now2, obj24.render += now4 - now3, obj24.encode += now5 - now4, obj24.queue += now6 - now5;
      let val15 = performance.now() - now2;
      arr2.push(val15), arr2.length > 60 && arr2.shift(), val12 = Math.min(val12, val15), n = Math.max(n, val15);
      let val16 = arr2.reduce((a12, b) => a12 + b, 0) / arr2.length;
      fn8({
        phase: "render",
        frame: n3 + 1,
        msPerFrame: val15,
        avgMs: val16,
        minMs: val12,
        maxMs: n,
        renderFps: 1000 / val16,
        etaMs: val16 * (max5 - n3 - 1),
        encodedBytes: val10.byteLength
      }), await jn(0);
    }
    if (!flag3) {
      fn8({
        phase: "encode",
        stage: "flush",
        frame: val10.frameCount,
        encodedBytes: val10.byteLength
      });
      try {
        await videoEncoder.flush();
      } catch (val15) {
        throw ref15(val15);
      }
      let val14 = obj23.outputCount ? obj23.totalLatency / obj23.outputCount : 0;
      console.log("[VideoEncoder]", {
        outputCount: obj23.outputCount,
        avgLatencyMs: Math.round(val14 * 10) / 10,
        minLatencyMs: Math.round(obj23.minLatency * 10) / 10,
        maxLatencyMs: Math.round(obj23.maxLatency * 10) / 10,
        maxQueue: obj23.maxQueue
      });
    }
  } catch (val14) {
    try {
      val10.cancel();
    } catch {}
    throw val14;
  } finally {
    try {
      videoEncoder.close();
    } catch {}
  }
  if (flag3) {
    try {
      val10.cancel();
    } catch {}
    let obj26 = {
      status: "cancelled",
      cancelled: true,
      blob: null,
      codec: val7.id,
      width: val3,
      height: val4,
      fps: a6,
      frames: val10.frameCount,
      mode: "webcodecs",
      audio: null
    };
    return fn8({
      phase: "batal",
      ...obj26
    }), obj26;
  }
  fn8({
    phase: "finalize"
  });
  let val13;
  try {
    val13 = await val10.finish();
  } catch (val14) {
    let val15 = val14 && typeof val14 == "object" ? val14 : new Error(String(val14));
    throw val15.muxFailure = true, val15;
  }
  let obj25 = {
    status: "success",
    cancelled: false,
    blob: new Blob([val13], {
      type: "video/mp4"
    }),
    codec: val7.id,
    width: val3,
    height: val4,
    fps: a6,
    frames: val10.frameCount,
    mode: "webcodecs",
    bitrate: a7,
    audio: val9,
    audioError: null,
    profile: Object.fromEntries(Object.entries(obj24).map(([a12, a13]) => [a12, a13 / Math.max(1, val10.frameCount)]))
  };
  return fn8({
    phase: "selesai",
    ...obj25,
    bytes: obj25.blob.size
  }), obj25;
}
function obj18(a, b, c) {
  return {
    url: a.url,
    tracks: a.tracks || null,
    startMs: b,
    endMs: c,
    rate: a.rate,
    offsetMs: a.offsetMs,
    inTimeMs: a.inTimeMs || 0,
    sampleRate: a.sampleRate || Ft,
    channels: 2
  };
}
async function res2(a = {}) {
  let {
      onProgress: ref24 = () => {},
      isCancelled: ref25 = () => false,
      audio: ref26 = null,
      forceFFmpeg: ref27 = false,
      codec: ref28 = "h264"
    } = a,
    val3 = !!(ref26 && (ref26.url || Array.isArray(ref26.tracks) && ref26.tracks.length));
  if (ref27) console.warn("[Export] Falling back to FFmpeg WASM" + (val3 ? " (audio requested)" : '')), ref24({
    phase: "fallback",
    stage: "select",
    message: val3 ? "WebCodecs audio failed" : "WebCodecs video tidak dipakai"
  }), ref24({
    phase: "fallback",
    stage: "fallback-select",
    message: "Menggunakan FFmpeg WASM (software encode, bisa lambat) sebagai fallback audio/video."
  });else try {
    return await render5(a);
  } catch (val4) {
    let res5 = handle7(val4);
    if (res5 === "cancelled" || ref25() || !process7(val4, {
      audioRequested: val3
    })) throw val4;
    if (console.warn("[Export] WebCodecs " + (res5 === "audio" ? "audio" : "codec") + " failed: " + val4.message), console.warn("[Export] Falling back to FFmpeg WASM"), ref24({
      phase: "fallback",
      stage: "select",
      message: ((res5 === "audio" ? "WebCodecs audio failed" : "WebCodecs video codec failed") + ':\x20' + (val4.message || '')).trim()
    }), res5 === "audio" && val3) {
      let val5 = await update7(a);
      if (val5) return val5;
    }
    ref24({
      phase: "fallback",
      stage: "fallback-select",
      message: "Menggunakan FFmpeg WASM (software encode, bisa lambat) sebagai fallback audio/video."
    });
  }
  return exportFramesFFmpeg(a, {
    audioRequested: val3,
    codec: ref28
  });
}
async function update7(a) {
  let {
    onProgress: ref25 = () => {},
    isCancelled: ref26 = () => false,
    audio: ref27 = null,
    startMs: ref28 = 0,
    endMs: ref24
  } = a;
  ref25({
    phase: "fallback",
    stage: "hybrid",
    message: "Menyiapkan audio (mode cepat)…"
  });
  let val3;
  try {
    val3 = await smoothstep({
      ...obj18(ref27, ref28, ref24),
      onProgress: ref25
    });
  } catch (val5) {
    let error = new Error("Campuran audio gagal disiapkan: " + (val5 && val5.message || val5));
    throw error.audioFailure = true, error.cause = val5, error;
  }
  if (!val3 || !val3.length) {
    let error = new Error("Campuran audio kosong; ekspor dibatalkan supaya tidak menghasilkan video tanpa suara.");
    throw error.audioFailure = true, error;
  }
  ref25({
    phase: "fallback",
    stage: "hybrid",
    message: "Video WebCodecs + audio FFmpeg (mode cepat)."
  });
  let val4;
  try {
    val4 = await render5({
      ...a,
      audio: null,
      forceFFmpeg: void 0
    });
  } catch (val5) {
    if (ref26() || handle7(val5) === "cancelled" || handle7(val5) === "renderer") throw val5;
    return ref25({
      phase: "fallback",
      stage: "hybrid-fail",
      message: "Video WebCodecs tidak bisa: " + (val5 && val5.message || val5)
    }), null;
  }
  if (!val4) return null;
  if (val4.cancelled || val4.status === "cancelled") return val4;
  if (val4.status !== "success" || !val4.blob) return null;
  if (ref26()) return val4;
  try {
    let val5 = await import("./ffmpeg-export-v2.js"),
      uint8Array = new Uint8Array(await val4.blob.arrayBuffer()),
      val6 = await val5.muxVideoWithAudioFFmpeg({
        videoBytes: uint8Array,
        videoCodec: val4.codec,
        width: val4.width,
        height: val4.height,
        fps: val4.fps,
        frames: val4.frames,
        renderAudio: async () => val3,
        onProgress: ref25,
        isCancelled: ref26
      });
    return val6.profile = val4.profile, val6.bitrate = val4.bitrate, val6;
  } catch (val5) {
    if (val5 && val5.ffmpegFailure) throw val5;
    return ref25({
      phase: "fallback",
      stage: "hybrid-fail",
      message: "Mux audio FFmpeg gagal: " + (val5 && val5.message || val5)
    }), null;
  }
}
async function exportFramesFFmpeg(a, {
  audioRequested: b,
  codec: b2
}) {
  let {
    canvas: ref24,
    renderFrame: ref25,
    prepareFrame: ref27 = null,
    startMs: ref28 = 0,
    endMs: ref26,
    fps: ref29 = 30,
    bitrate: ref30 = 6000000,
    onProgress: ref31 = () => {},
    isCancelled: ref32 = () => false,
    audio: ref33 = null
  } = a;
  console.log("[Export] Loading FFmpeg WASM..."), ref31({
    phase: "fallback",
    stage: "ffmpeg-load",
    message: "Memuat FFmpeg WASM..."
  });
  let val3 = await import("./ffmpeg-export-v2.js"),
    val4 = ref24.width - ref24.width % 2,
    val5 = ref24.height - ref24.height % 2,
    res5 = update6(val4, val5, ref24);
  return val3.exportFramesFFmpeg({
    canvas: ref24,
    snapshot: res5,
    renderFrame: ref25,
    prepareFrame: ref27,
    startMs: ref28,
    endMs: ref26,
    fps: ref29,
    bitrate: ref30,
    codec: b2,
    audioRequested: b,
    renderAudio: b ? () => smoothstep({
      ...obj18(ref33, ref28, ref26),
      onProgress: ref31
    }) : null,
    onProgress: ref31,
    isCancelled: ref32
  });
}
async function handle8({
  canvas: a,
  snapshot: a2,
  renderFrame: a3,
  startMs: a4,
  intervalMs: a5,
  totalFrames: a6,
  fps: a7,
  report: a8,
  isCancelled: a9
}) {
  let val3 = a2 && a2.canvas && typeof a2.canvas.captureStream == "function" ? a2.canvas : a;
  if (typeof val3.captureStream != "function") throw new Error("Browser ini tidak mendukung WebCodecs maupun captureStream.");
  let captureStream = val3.captureStream(0),
    val4 = captureStream.getVideoTracks()[0],
    val5 = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find(a10 => MediaRecorder.isTypeSupported(a10)) || "video/webm",
    arr2 = [],
    mediaRecorder = new MediaRecorder(captureStream, {
      mimeType: val5,
      videoBitsPerSecond: 6000000
    });
  mediaRecorder.ondataavailable = a10 => {
    a10.data.size && arr2.push(a10.data);
  };
  let promise = new Promise(a10 => {
    mediaRecorder.onstop = a10;
  });
  mediaRecorder.start();
  let now = performance.now(),
    arr3 = [],
    n = 0;
  for (let n3 = 0; n3 < a6 && !a9(); n3++) {
    let now2 = performance.now();
    a3(a4 + n3 * a5), build6(a2, a, a.width, a.height), val4.requestFrame(), n++;
    let val6 = performance.now() - now2;
    arr3.push(val6), arr3.length > 60 && arr3.shift();
    let val7 = arr3.reduce((a10, b) => a10 + b, 0) / arr3.length;
    a8({
      phase: "render",
      frame: n3 + 1,
      msPerFrame: val6,
      avgMs: val7,
      minMs: Math.min(...arr3),
      maxMs: Math.max(...arr3),
      renderFps: 1000 / val7,
      etaMs: 0,
      encodedBytes: 0,
      realtime: true
    });
    let val8 = a5 - (performance.now() - now2);
    await jn(Math.max(0, val8));
  }
  mediaRecorder.stop(), await promise;
  let res5 = a9();
  if (res5) try {
    val4.stop();
  } catch {}
  let blob = new Blob(arr2, {
      type: "video/webm"
    }),
    obj23 = {
      status: res5 ? "cancelled" : "success",
      blob: blob,
      codec: val5,
      width: a.width,
      height: a.height,
      fps: a7,
      frames: n,
      mode: "mediarecorder",
      realtime: true,
      cancelled: res5,
      elapsedMs: performance.now() - now
    };
  return a8({
    phase: "selesai",
    ...obj23,
    bytes: blob.size
  }), obj23;
}
var xc = /^(?:am|amproj|amres|amv):/i,
  wc = /\.(mp4|webm|mov|m4v|ogv)$/i,
  Mc = /\.(mp3|m4a|aac|wav|ogg|opus)$/i;
function process8(a, b) {
  let toLowerCase = String(a || '').toLowerCase();
  if (toLowerCase.startsWith("video/")) return "video";
  if (toLowerCase.startsWith("image/")) return "image";
  if (toLowerCase.startsWith("audio/")) return "audio";
  if (toLowerCase && !toLowerCase.startsWith("application/octet-stream")) return '';
  let res5 = String(b || '');
  return wc.test(res5) ? "video" : /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(res5) ? "image" : Mc.test(res5) ? "audio" : '';
}
function compute6(a) {
  let trim = String(a || '').trim();
  if (!trim) return [];
  let set = new Set(),
    fn8 = a2 => {
      if (!a2) return;
      let toLowerCase = String(a2).toLowerCase();
      set.add(toLowerCase);
      try {
        set.add(decodeURIComponent(toLowerCase));
      } catch {}
    };
  fn8(trim);
  let replace = trim.replace(xc, '');
  fn8(replace);
  let val3 = replace.split(/[\\/]/).pop() || replace;
  return fn8(val3), fn8(val3.replace(/\.[^.]+$/, '')), [...set];
}
function arr(a, b) {
  let trim = String(b ?? '').trim();
  if (!trim) return [];
  let arr2 = [];
  for (let val3 of a || []) val3 && (val3.uri !== trim && val3.filename !== trim || (val3.filename && arr2.push(val3.filename), val3.uri && val3.uri !== trim && arr2.push(val3.uri)));
  return [...new Set(arr2)];
}
var Yn = class {
  constructor() {
    this.refs = [], this.byName = new Map(), this.alias = new Map();
  }
  ["add"](a) {
    let val3 = a && (a.url || a.src),
      val4 = a && (a.name || String(val3 || '').split('/').pop());
    if (!val3 || !val4) return false;
    let get23 = this.byName.get(val4);
    if (get23) return get23.url = val3, false;
    let res5 = process8(a.mime, val4),
      obj23 = {
        name: val4,
        url: val3,
        mime: String(a && a.mime || ''),
        kind: res5,
        isVideo: res5 === "video",
        isAudio: res5 === "audio"
      };
    this.refs.push(obj23), this.byName.set(val4, obj23);
    for (let val5 of compute6(val4)) this.alias.has(val5) || this.alias.set(val5, val4);
    return true;
  }
  ["list"]() {
    return this.refs;
  }
  ["has"](a) {
    return this.byName.has(String(a ?? ''));
  }
  ["byFileName"](a) {
    return this.byName.get(String(a ?? '')) || null;
  }
  ["find"](a) {
    let trim = String(a ?? '').trim();
    if (!trim) return null;
    let get23 = this.byName.get(trim);
    if (get23) return get23;
    for (let val3 of compute6(trim)) {
      let get24 = this.alias.get(val3);
      if (get24) return this.byName.get(get24) || null;
    }
    return null;
  }
  ["candidates"](a, b) {
    let val3 = b || new Set();
    return this.refs.filter(a2 => a2.kind === a && !val3.has(a2.name));
  }
  ["clear"]() {
    this.refs = [], this.byName.clear(), this.alias.clear();
  }
};
function apply6(a, b, c) {
  let find = a.find(b);
  if (find) return find;
  for (let val3 of arr(c, b)) {
    let find2 = a.find(val3);
    if (find2) return find2;
  }
  return null;
}
function get6(a, b, c = {}) {
  if (!b) return '';
  let val3 = c.mediaEntries || [],
    val4 = c.used || new Set(),
    val5 = apply6(a, b.uri, val3) || apply6(a, b.filename, val3);
  if (val5) return val5.name;
  let res5 = process8(b.type, b.filename || b.uri);
  if (!res5 || res5 === "audio") return '';
  let candidates = a.candidates(res5, val4);
  return candidates.length === 1 ? candidates[0].name : '';
}
var le = ref12(),
  Tn = document.documentElement.classList.contains("simple"),
  ya = "../preset/Beraksi.xml",
  vt = "../preset/Beraksi.mp3",
  Sn = "../preset/",
  co = vt,
  kt = vt,
  sa = vt.split('/').pop(),
  Me = [{
    name: "Beraksi.mp3",
    src: vt
  }],
  ye = new Map([["Beraksi.mp3", vt]]),
  fe = new Map(),
  oa = document.getElementById("log"),
  wi = document.getElementById("stage"),
  Ba = document.getElementById("subtitle"),
  Rt = document.getElementById("status"),
  Sc = document.getElementById("audioState"),
  Ac = document.getElementById("timeLabel"),
  Ee = document.getElementById("seek"),
  di = document.getElementById("play"),
  ai = document.getElementById("loopBtn"),
  gt = document.getElementById("scale"),
  Cc = document.getElementById("scaleLabel"),
  ra = document.getElementById("mediaRows"),
  ka = document.getElementById("quality"),
  Mi = document.getElementById("resLabel"),
  re = document.getElementById("view"),
  Re = document.getElementById("debugCanvas"),
  si = document.getElementById("sizeScale"),
  Gt = document.getElementById("fpsTarget"),
  Ti = document.getElementById("fpsCustom"),
  $c = document.getElementById("fpsCustomRow"),
  fn = document.getElementById("syncState"),
  jt = document.getElementById("rate"),
  Lc = document.getElementById("rateLabel"),
  Fc = document.getElementById("rateAuto"),
  tt = document.getElementById("pitchKeep"),
  lo = document.getElementById("offset"),
  Rc = document.getElementById("offsetLabel"),
  Po = document.getElementById("expRes"),
  uo = document.getElementById("expCodec"),
  Dt = document.getElementById("expFps"),
  Io = document.getElementById("expFpsCustom"),
  Pc = document.getElementById("expFpsCustomRow"),
  Si = document.getElementById("expBitrate"),
  Ze = document.getElementById("expStart"),
  Ea = document.getElementById("expCancel"),
  rt = document.getElementById("expBar"),
  Nt = document.getElementById("expStats"),
  mn = document.getElementById("expResult"),
  Ic = document.getElementById("autoQuality"),
  Ot = document.getElementById("fxToggle"),
  Bc = document.getElementById("perfLabel"),
  Bo = document.getElementById("impXml"),
  Nc = document.getElementById("impPhoto"),
  Ut = document.getElementById("impPick"),
  No = document.getElementById("impPickRow"),
  _c = document.getElementById("impReset"),
  Dc = document.getElementById("impState"),
  _o = document.getElementById("urlTiktok"),
  va = document.getElementById("urlTiktokGo"),
  Zn = document.getElementById("urlTiktokState"),
  xa = document.getElementById("urlAm"),
  wa = document.getElementById("urlAmGo"),
  Jn = document.getElementById("urlAmState"),
  nt = document.getElementById("urlAmPick"),
  fo = document.getElementById("urlAmPickRow"),
  Do = document.getElementById("urlDrive"),
  Ma = document.getElementById("urlDriveGo"),
  ei = document.getElementById("urlDriveState"),
  Na = document.getElementById("urlDriveAudio"),
  Ta = document.getElementById("urlDriveAudioGo"),
  ti = document.getElementById("urlDriveAudioState"),
  ni = document.getElementById("photoGallery"),
  Oc = document.getElementById("loopLabel"),
  Pt = (a, b = '') => "<svg class=\"i " + b + "\" aria-hidden=\"true\"><use href=\"#i-" + a + "\"/></svg>",
  ut = {
    play: Pt("play", 'sm'),
    pause: Pt("pause", 'sm'),
    upload: Pt("upload", 'sm'),
    eye: Pt("eye"),
    eyeOff: Pt("eyeoff")
  },
  Oo = [...document.querySelectorAll(".tab-btn")],
  Uc = ["proyek", "media", "audio", "layer", "ekspor"],
  Sa = Object.fromEntries(Uc.map(a => [a, document.getElementById("pane-" + a)])),
  Aa = document.getElementById("panes"),
  mo = document.getElementById("timelineDock"),
  ui = window.matchMedia("(min-width: 900px) and (min-height: 620px)"),
  Ca = "proyek";
function update8(a) {
  let val3 = Number(a.min) || 0,
    val4 = Number(a.max) || 100,
    val5 = (Number(a.value) - val3) / (val4 - val3 || 1) * 100;
  a.style.setProperty("--pct", Math.max(0, Math.min(100, val5)) + '%');
}
function _a(a) {
  Sa[a] || (a = "proyek"), a === "layer" && ui.matches && (a = "proyek"), Ca = a;
  for (let [val3, val4] of Object.entries(Sa)) val3 === "layer" && ui.matches || val4.classList.toggle("active", val3 === a);
  for (let val3 of Oo) {
    let val4 = val3.dataset.tab === a;
    val3.classList.toggle("active", val4), val3.setAttribute("aria-selected", val4 ? "true" : "false");
  }
  Aa.scrollTop = 0, a === "layer" && requestAnimationFrame(() => build13());
}
for (let val3 of Oo) val3.addEventListener("click", () => _a(val3.dataset.tab));
function build7() {
  let val3 = Sa.layer;
  ui.matches ? (val3.parentElement !== mo && mo.appendChild(val3), val3.classList.add("active"), Ca === "layer" && _a("proyek")) : (val3.parentElement !== Aa && Aa.appendChild(val3), val3.classList.toggle("active", Ca === "layer")), getPos(), requestAnimationFrame(() => {
    val && build13();
  });
}
var gn = [];
function handle9(a) {
  gn.push(a), gn.length > 400 && gn.shift(), oa.textContent = gn.join('\x0a'), oa.scrollTop = oa.scrollHeight;
}
document.getElementById("copyLogBtn")?.["addEventListener"]("click", async a => {
  let val3 = a.currentTarget,
    join3 = gn.join('\x0a'),
    flag3 = false;
  try {
    await navigator.clipboard.writeText(join3), flag3 = true;
  } catch {}
  if (!flag3) {
    let textareaEl = document.createElement("textarea");
    textareaEl.value = join3, textareaEl.style.position = "fixed", textareaEl.style.opacity = '0', document.body.appendChild(textareaEl), textareaEl.select();
    try {
      flag3 = document.execCommand("copy");
    } catch {
      flag3 = false;
    }
    textareaEl.remove();
  }
  let val4 = val3.textContent;
  val3.textContent = flag3 ? "Tersalin ✓" : "Gagal salin", setTimeout(() => {
    val3.textContent = val4;
  }, 1500);
});
var ho = document.getElementById("stageBusy"),
  fi = document.getElementById("busyLabel"),
  yn = document.getElementById("busyDetail"),
  $a = document.getElementById("busyDismiss"),
  ct = new Map(),
  ge = false,
  Oe = '',
  Ht = false,
  Ai = false,
  oi = 0;
function process9() {
  let arr2 = [...ct.values()];
  ge = arr2.length > 0;
  let val3 = ge || !!Oe;
  if (ho.hidden = !val3, ho.classList.toggle("error", !!Oe), Oe) fi.textContent = "Gagal", yn.textContent = Oe;else {
    if (arr2.length) {
      let val4 = arr2[arr2.length - 1];
      fi.textContent = val4.label;
      let items3 = arr2.slice(0, -1).map(a => '•\x20' + a.label + (a.detail ? ':\x20' + a.detail : ''));
      yn.textContent = [val4.detail, ...items3].filter(Boolean).join('\x0a');
    } else yn.textContent = '';
  }
  $a.hidden = !(Oe || ct.has("video")), $a.textContent = Oe ? "Tutup pesan" : "Putar tanpa menunggu", di.disabled = ge, di.title = ge ? "Tunggu loading selesai" : '', Ze.disabled = ge || se, Ee.disabled = ge, ge && flag2 && (Ht = true, handle24(false), handle9("[LOAD] Putar dihentikan karena masih ada proses loading.")), !ge && !Oe && Ht && val && (Ht = false, handle24(true));
}
function compute7(a, b) {
  ct.set(a, {
    label: b,
    detail: ''
  }), process9();
}
function render6(a, b, c = '') {
  let get23 = ct.get(a);
  get23 && (get23.label = b, get23.detail = c, ct.delete(a), ct.set(a, get23), process9());
}
function apply7(a) {
  ct.delete(a) && process9();
}
function get7(a) {
  Oe = String(a || "kesalahan tidak diketahui"), flag2 && handle24(false), process9();
}
$a.addEventListener("click", () => {
  if (Oe) {
    Oe = '', process9();
    return;
  }
  Ai = true;
  for (let val3 of ref20()) val3.readyState < 2 && Za.add(val3);
  Ht = true, apply7("video");
});
var Cn = () => new Promise(a => requestAnimationFrame(() => setTimeout(a, 0)));
async function update9(a, b, c) {
  compute7(a, b);
  try {
    return await Cn(), await c();
  } finally {
    apply7(a);
  }
}
function build8() {
  let val3 = val && val.audio && val.audio[0];
  return val3 && val3.inTime || 0;
}
function handle10() {
  let val3 = val && val.audio && val.audio[0];
  return val3 && val3.endTime > val3.startTime ? val3.endTime - val3.startTime : val ? val.totalTime : 0;
}
function max3(a) {
  let res5 = build8();
  return Math.max(0, res5 + (a - lt) * (Q || 1));
}
var ee = [],
  Xo = new Map();
function max4(a) {
  let val3 = a && Number.isFinite(a.speed) && a.speed > 0 ? a.speed : 1;
  return Math.max(0.0625, Math.min(4, val3 * (Q || 1)));
}
function render7() {
  if (!val) return null;
  let res5 = ref7(val, H);
  return res5.length ? res5[0] : null;
}
function apply8(a) {
  let res5 = render7();
  return res5 ? Math.max(0, build8() + (a - res5.startTime - lt) * max4(res5)) : max3(a);
}
function get8() {
  for (let val3 of ee) {
    try {
      val3.el.pause();
    } catch {}
    try {
      val3.el.removeAttribute("src"), val3.el.load();
    } catch {}
  }
  ee.length = 0, Xo.clear();
}
function update10() {
  if (!Me.length) return null;
  let fn8 = a => String(a.name || '').replace(/\.[^.]+$/, '').toLowerCase(),
    toLowerCase = String(val && val.filename || '').replace(/\.[^./\\]+$/, '').toLowerCase(),
    toLowerCase2 = String(val && val.title || '').toLowerCase();
  if (toLowerCase) {
    let find = Me.find(a => fn8(a) === toLowerCase);
    if (find) return find;
    let find2 = Me.find(a => fn8(a).length >= 3 && toLowerCase2.includes(fn8(a)));
    if (find2) return find2;
  }
  return Me.find(a => {
    let res5 = fn8(a);
    return res5.length >= 3 && toLowerCase2.includes(res5);
  }) || null;
}
function obj19(a) {
  let get23 = fe.get(a.id),
    val3 = (get23 ? ye.get(get23) : '') || process21(a.src);
  if (!val3) {
    let res5 = update10();
    res5 && (val3 = res5.src, handle9("[AUDIO] Sumber \"" + (a.src || "(kosong)") + "\" tidak ada di package; layer \"" + (a.label || a.id) + "\" memakai \"" + res5.name + '\x22.'));
  }
  let val4 = get23 || compute18(val3, a.src);
  return {
    url: val3,
    name: val4
  };
}
function handle11(a) {
  let get23 = Y.get(a),
    res5 = process11(get23 || a);
  if (res5) return {
    url: res5.src || res5.url,
    name: res5.name || get23 || a
  };
  let res6 = String(a || '');
  return res6 ? /^[a-z][a-z0-9+.-]*:/i.test(res6) ? {
    url: '',
    name: res6
  } : {
    url: Sn + encodeURIComponent(res6),
    name: res6
  } : {
    url: '',
    name: ''
  };
}
function ref16(a, b, c) {
  if (!a || !a.layers) return c;
  for (let val3 of a.layers) {
    if (val3.scene) {
      ref16(val3.scene, b + (val3.startTime || 0), c);
      continue;
    }
    if (val3.tag === "audio" || val3.fillType !== "media") continue;
    let val4 = val3.fillVideo || val3.fillImage;
    val4 && c.push({
      layer: val3,
      offsetMs: b,
      key: val4
    });
  }
  return c;
}
function ref17(a, b, c) {
  if (!a || !a.layers) return c;
  for (let val3 of a.layers) {
    if (val3.tag === "embedScene" && val3.scene) {
      ref17(val3.scene, b + (val3.startTime || 0), c);
      continue;
    }
    val3.tag === "audio" && c.push({
      layer: val3,
      offsetMs: b
    });
  }
  return c;
}
function render8() {
  if (get8(), !val) return 0;
  let res5 = ref17(val, 0, []);
  for (let n = 0; n < res5.length; n++) {
    let {
        layer: val3,
        offsetMs: val4
      } = res5[n],
      {
        url: res6,
        name: res7
      } = obj19(val3),
      val5 = val3.id || "audio-" + n;
    if (!res6) {
      handle9("[AUDIO] Layer \"" + (val3.label || val5) + "\" tidak punya sumber yang bisa diputar.");
      continue;
    }
    let audio = new Audio(res6);
    audio.preload = "auto", audio.loop = false;
    let obj23 = {
      id: val5,
      layer: val3,
      offsetMs: val4,
      el: audio,
      src: res6,
      label: res7 || val3.src,
      broken: false,
      ready: false,
      durationMs: 0
    };
    audio.addEventListener("error", () => {
      obj23.broken = true, handle9("[AUDIO] Gagal memuat \"" + obj23.label + '\x22' + (audio.error ? " kode " + audio.error.code : '') + "; layer ini senyap.");
    }), audio.addEventListener("loadedmetadata", () => {
      obj23.durationMs = Number.isFinite(audio.duration) ? audio.duration * 1000 : 0, obj23.ready = true;
    }), audio.load(), ee.push(obj23), Xo.set(val5, obj23);
  }
  return Go = ee.length > 0, handle9("[AUDIO] " + ee.length + " layer audio scene (" + res5.length + " ditemukan, timeline project independen)."), ee.length;
}
function apply9(a) {
  return !!(!a || a.hidden === true || a.hidden === "true" || a.re || val2 && val2.hiddenLayers && val2.hiddenLayers.has(a.id));
}
function obj20(a) {
  return {
    start: a.offsetMs + (a.layer.startTime || 0),
    end: a.offsetMs + (a.layer.endTime || 0)
  };
}
function update11(a, b) {
  let {
      start: res5
    } = obj20(a),
    res6 = max4(a.layer);
  return (a.layer.inTime || 0) + (b - lt - res5) * res6;
}
function build9(a, b, c) {
  let val3 = a.el;
  if (a.broken) return;
  let res5 = apply9(a.layer);
  if (val3.muted !== res5 && (val3.muted = res5), res5) {
    val3.paused || val3.pause(), val3.volume !== 0 && (val3.volume = 0), a.D = false;
    return;
  }
  let {
    start: res6,
    end: res7
  } = obj20(a);
  if (!(b >= res6 && b < res7)) {
    val3.paused || val3.pause(), a.D = false;
    return;
  }
  let res8 = max4(a.layer);
  Math.abs(val3.playbackRate - res8) > 0.0001 && (val3.playbackRate = res8), val3.preservesPitch !== void 0 && (val3.preservesPitch = tt ? tt.checked : true), "mozPreservesPitch" in val3 && (val3.mozPreservesPitch = val3.preservesPitch), "webkitPreservesPitch" in val3 && (val3.webkitPreservesPitch = val3.preservesPitch);
  let res9 = update11(a, b),
    val4 = a.durationMs || (Number.isFinite(val3.duration) ? val3.duration * 1000 : 0);
  if (res9 < 0 || val4 > 0 && res9 >= val4) {
    val3.volume !== 0 && (val3.volume = 0), val3.paused || val3.pause(), a.D = false;
    return;
  }
  let max5 = Math.max(0, Math.min(1, max(a.layer, b - a.offsetMs)));
  Math.abs(val3.volume - max5) > 0.001 && (val3.volume = max5);
  let val5 = res9 / 1000;
  if (flag2) {
    if (val3.paused && !a.D) {
      a.D = true;
      try {
        val3.currentTime = val5;
      } catch {}
      val3.play().then(() => {
        a.D = false;
      }).catch(() => {
        a.D = false;
      });
    } else {
      if (c && !a.D) try {
        val3.currentTime = val5;
      } catch {}
    }
  } else {
    if (a.D = false, c || Math.abs(val3.currentTime - val5) * 1000 > 10) try {
      val3.currentTime = val5;
    } catch {}
  }
}
function handle12({
  force: a = false
} = {}) {
  if (!val) return;
  for (let val3 of ee) build9(val3, H, a);
  if (handle20(H, a), ee.length || !D || qe) return;
  if (!Go) {
    D.volume = 1;
    return;
  }
  let res5 = render7();
  if (res5) {
    let res6 = max(res5, H);
    Math.abs(D.volume - res6) > 0.001 && (D.volume = res6);
    let res7 = max4(res5);
    Math.abs(D.playbackRate - res7) > 0.0001 && (D.playbackRate = res7), flag2 && D.paused && !qe && D.readyState >= 2 && (process10(), D.play().catch(() => {}));
  } else flag2 && !D.paused && D.pause();
}
function process10() {
  if (ee.length) {
    handle12({
      force: true
    });
    return;
  }
  !D || qe || (D.currentTime = apply8(H) / 1000);
}
function compute8(a, b) {
  Q = Math.min(1.5, Math.max(0.5, a)), jt.value = String(Q), update8(jt), Lc.textContent = Q.toFixed(3) + 'x', D && (D.playbackRate = Q, D.preservesPitch = tt.checked, "mozPreservesPitch" in D && (D.mozPreservesPitch = tt.checked), "webkitPreservesPitch" in D && (D.webkitPreservesPitch = tt.checked)), process10(), build19(H), V = true, render9(), b || handle9("[SYNC] Kecepatan audio " + Q.toFixed(3) + "x (pitch " + (tt.checked ? "dipertahankan" : "ikut turun") + ')');
}
function render9() {
  if (!val) return;
  let val3 = val.totalTime;
  if (ee.length) {
    let join3 = ee.map(a => (a.durationMs / 1000).toFixed(2) + 's').join(',\x20');
    fn.textContent = "sync: project " + (val3 / 1000).toFixed(2) + "s, " + ee.length + " layer audio (" + (join3 || "memuat") + ')', fn.style.color = "#8fd8a0";
    return;
  }
  let val4 = D && Number.isFinite(D.duration) ? D.duration * 1000 : 0,
    val5 = val4 ? val4 / val3 : 0;
  if (!val4) {
    fn.textContent = "sync: project " + (val3 / 1000).toFixed(2) + "s, durasi file belum terbaca";
    return;
  }
  let val6 = val4 / Q,
    val7 = Math.abs(val6 - val3) < 100;
  fn.textContent = val7 ? "sync: COCOK - file " + (val4 / 1000).toFixed(2) + "s @" + Q.toFixed(3) + "x = project " + (val3 / 1000).toFixed(2) + 's' : "sync: BEDA - file " + (val4 / 1000).toFixed(2) + "s vs project " + (val3 / 1000).toFixed(2) + "s, butuh " + val5.toFixed(3) + 'x', fn.style.color = val7 ? "#8fd8a0" : "#e8b96a";
}
function apply10() {
  if (Gt.value !== "custom") return Number(Gt.value) || 30;
  let number = Number(Ti.value);
  return !Number.isFinite(number) || number <= 0 ? 30 : Math.min(120, Math.max(1, number));
}
var val = null,
  val2 = null,
  D = null,
  po = 0,
  bt = false,
  Go = false,
  jo = [],
  xt = [],
  H = 0,
  ca = 0,
  go = null,
  Ge = 30,
  V = true,
  bo = 0,
  it = 0,
  yo = 0,
  It = [],
  flag2 = false,
  et = true,
  qe = false,
  Rn = false,
  ko = 0,
  la = "fps - | frame -",
  Eo = 0,
  se = false,
  De = false,
  Ve = null,
  ae = "idle",
  pt = '',
  Q = 1,
  lt = 0,
  qt = null,
  ke = [],
  Y = new Map(),
  at = new Map(),
  ce = [],
  Et = new Map(),
  Pe = new Yn(),
  hi = [],
  Je = [],
  Ha = [],
  Xt = [],
  pi = '',
  Kt = ya.split('/').pop(),
  Bt = -1,
  zt = null;
function get9(a) {
  ce = a, update12();
}
function update12() {
  Et.clear();
  for (let val3 of ce) Et.set(val3.name, val3);
  for (let val3 of Pe.list()) Et.set(val3.name, val3);
  let items3 = Pe.list().filter(a => a.kind).map(a => a.name);
  ke = [...new Set([...ce.map(a => a.name), ...items3])];
}
function build10(a) {
  if (!Array.isArray(a) || !a.length) return 0;
  let n = 0;
  for (let val3 of a) {
    let val4 = val3 || {};
    Pe.add(val4) && n++;
    let val5 = val4.name || String(val4.url || '').split('/').pop(),
      val6 = val5 ? Pe.byFileName(val5) : null;
    val6 && (val6.isVideo || val6.isAudio) && !ye.has(val6.name) && (Me.push({
      name: val6.name,
      src: val6.url
    }), ye.set(val6.name, val6.url));
  }
  return n && update12(), handle9("[API] " + n + " media package didaftarkan (" + Pe.list().length + " total)."), n;
}
function handle13() {
  for (let val3 of Pe.list()) {
    ye.delete(val3.name);
    let findIndex = Me.findIndex(a => a.name === val3.name);
    findIndex >= 0 && Me.splice(findIndex, 1);
  }
  Pe.clear(), update12();
}
function process11(a) {
  return a ? Et.get(a) || apply6(Pe, a, hi) : null;
}
function compute9() {
  hi = [];
  let fn8 = a => {
    for (let val3 of a.media || []) hi.push(val3);
    for (let val3 of a.layers || []) val3.scene && fn8(val3.scene);
  };
  val && fn8(val);
}
function render10(a) {
  let res5 = process11(a),
    val3 = res5 ? res5.src || res5.url : Sn + encodeURIComponent(a);
  if (at.has(val3)) return at.get(val3);
  if (/\.(mp4|webm|ogv|mov|m4v)$/i.test(a) || res5 && res5.isVideo) {
    let videoEl = document.createElement("video");
    return videoEl.src = val3, videoEl.muted = true, videoEl.loop = true, videoEl.playsInline = true, videoEl.preload = "auto", at.set(val3, videoEl), build16(), videoEl;
  }
  let image = new Image();
  return image.src = val3, at.set(val3, image), image;
}
function apply11(a) {
  let res5 = render10(a);
  return res5.tagName === "VIDEO" ? res5.readyState >= 1 ? Promise.resolve(res5) : new Promise(a2 => {
    res5.addEventListener("loadedmetadata", () => a2(res5), {
      once: true
    }), res5.addEventListener("error", () => a2(res5), {
      once: true
    });
  }) : res5.complete && res5.naturalWidth ? Promise.resolve(res5) : new Promise(a2 => {
    res5.addEventListener("load", () => a2(res5), {
      once: true
    }), res5.addEventListener("error", () => {
      handle9("[MEDIA] Gagal memuat " + a), a2(res5);
    }, {
      once: true
    });
  });
}
function get10() {
  let map = new Map();
  if (!val) return map;
  let fn8 = a => {
      if (!a) return '';
      let get23 = Y.get(a);
      if (get23) return get23;
      let res5 = process11(a);
      return res5 ? res5.name : '';
    },
    fn9 = a => {
      for (let val3 of a.media || []) {
        if ((val3.type || '').toLowerCase().startsWith("audio")) continue;
        let res5 = fn8(val3.uri);
        res5 && map.set(val3.uri, render10(res5));
      }
      for (let val3 of a.layers || []) {
        for (let val4 of [val3.fillVideo, val3.fillImage]) {
          if (!val4 || map.has(val4)) continue;
          let res5 = fn8(val4);
          res5 && map.set(val4, render10(res5));
        }
        val3.scene && fn9(val3.scene);
      }
    };
  return fn9(val), map;
}
function getPos() {
  let getBoundingClientRect = wi.getBoundingClientRect(),
    val3 = re.width / re.height,
    n = 20,
    max5 = Math.max(100, getBoundingClientRect.width - n),
    max6 = Math.max(100, getBoundingClientRect.height - n),
    val4 = max6 * val3;
  val4 > max5 && (val4 = max5, max6 = val4 / val3), re.style.width = Math.round(val4) + 'px', re.style.height = Math.round(max6) + 'px';
  try {
    V = true;
  } catch {}
}
window.addEventListener("resize", getPos), window.addEventListener("orientationchange", () => setTimeout(getPos, 150));
var Yc = /\.(mp4|webm|ogv|mov|m4v)$/i;
function build11(a, b) {
  return !!(b && b.isVideo) || Yc.test(a || '');
}
function handle14(a, b = "thumb", {
  preview: c = true
} = {}) {
  let val3 = a ? process11(a) : null,
    val4 = val3 ? val3.src || val3.url : '';
  if (!val4) {
    let divEl = document.createElement("div");
    return divEl.className = b + " thumb-empty", divEl.textContent = '?', divEl;
  }
  let val5;
  return build11(a, val3) ? (val5 = document.createElement("video"), val5.muted = true, val5.playsInline = true, val5.preload = "metadata", val5.src = val4.includes('#') ? val4 : val4 + "#t=0.1") : (val5 = document.createElement("img"), val5.alt = a, val5.loading = "lazy", val5.src = val4), val5.className = b, val5.title = a, c && val5.addEventListener("click", a2 => {
    a2.stopPropagation(), process12(a);
  }), val5;
}
function process12(a) {
  let res5 = process11(a);
  if (!res5) return;
  let val3 = res5.src || res5.url,
    lightboxBody = document.getElementById("lightboxBody");
  lightboxBody.innerHTML = '';
  let val4;
  build11(a, res5) ? (val4 = document.createElement("video"), val4.controls = true, val4.loop = true, val4.muted = true, val4.playsInline = true, val4.autoplay = true) : (val4 = document.createElement("img"), val4.alt = a), val4.src = val3, lightboxBody.appendChild(val4), document.getElementById("lightboxTitle").textContent = a, document.getElementById("lightbox").showModal();
}
function compute10() {
  ra.innerHTML = '';
  let slotCount = document.getElementById("slotCount"),
    items3 = val.media.filter(a => {
      let toLowerCase = (a.type || '').toLowerCase();
      return toLowerCase.startsWith("audio") ? false : toLowerCase.startsWith("image") || toLowerCase.startsWith("video") || !!a.uri;
    });
  if (slotCount && (slotCount.textContent = items3.length ? items3.length + " slot" : ''), Tn && bind14(items3), !items3.length) {
    ra.innerHTML = "<div class=\"empty\">Preset ini tidak memakai foto atau video.</div>";
    return;
  }
  items3.forEach((a, b) => {
    let startsWith = (a.type || '').toLowerCase().startsWith("video"),
      divEl = document.createElement("div");
    divEl.className = "slot";
    let divEl2 = document.createElement("div");
    divEl2.className = "thumb-holder";
    let fn8 = a2 => {
        divEl2.innerHTML = '', divEl2.appendChild(handle14(a2));
      },
      divEl3 = document.createElement("div");
    divEl3.className = "slot-body";
    let divEl4 = document.createElement("div");
    divEl4.className = "slot-title";
    let spanEl = document.createElement("span");
    spanEl.className = "badge" + (startsWith ? " video" : ''), spanEl.textContent = startsWith ? "Video" : "Gambar";
    let spanEl2 = document.createElement("span");
    spanEl2.textContent = "Slot " + (b + 1), divEl4.appendChild(spanEl), divEl4.appendChild(spanEl2);
    let divEl5 = document.createElement("div");
    divEl5.className = "slot-sub", divEl5.textContent = String(a.uri || '').split('/').pop(), divEl5.title = a.uri || '';
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "btn swap-btn", buttonEl.innerHTML = "<svg class=\"i sm\"><use href=\"#i-loop\"/></svg><span>Ganti media</span>";
    let val3 = Y.get(a.uri) || ke[0] || '',
      fn9 = async a2 => {
        val3 = a2, Y.set(a.uri, a2), fn8(a2), bind8(), await update9("media:pick", "Memuat " + a2 + '…', async () => {
          await apply11(a2), val2.setImages(get10()), V = true;
        });
      };
    Y.set(a.uri, val3), fn8(val3), buttonEl.addEventListener("click", () => bind(val3, fn9, "Ganti media — Slot " + (b + 1))), divEl3.appendChild(divEl4), divEl3.appendChild(divEl5), divEl3.appendChild(buttonEl), divEl.appendChild(divEl2), divEl.appendChild(divEl3), ra.appendChild(divEl);
  });
}
var vo = document.getElementById("mediaPickerDlg"),
  da = document.getElementById("mediaPickerGrid"),
  Zc = document.getElementById("mediaPickerTitle");
function bind(a, b, c) {
  c && (Zc.textContent = c), da.innerHTML = '', ke.length || (da.innerHTML = "<div class=\"empty\" style=\"grid-column:1/-1\">Belum ada foto/video. Impor dulu lewat \"Galeri media\".</div>");
  for (let val3 of ke) {
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "g-item pick-btn" + (val3 === a ? " g-current" : ''), buttonEl.appendChild(handle14(val3, "g-thumb", {
      preview: false
    }));
    let divEl = document.createElement("div");
    divEl.className = "g-meta", divEl.textContent = val3, divEl.title = val3, buttonEl.appendChild(divEl), buttonEl.addEventListener("click", () => {
      vo.close(), b(val3);
    }), da.appendChild(buttonEl);
  }
  vo.showModal();
}
function bind2() {
  let audioRows = document.getElementById("audioRows");
  if (!audioRows) return;
  audioRows.innerHTML = '';
  let arr2 = [];
  val && val.audio && val.audio.length ? val.audio.forEach((a, b) => {
    arr2.push({
      id: a.id || "audio-" + b,
      label: a.label || "Track Audio " + (b + 1),
      src: a.src,
      startTime: a.startTime,
      endTime: a.endTime,
      inTime: a.inTime || 0
    });
  }) : arr2.push({
    id: "main-audio",
    label: "Audio utama",
    src: kt,
    startTime: 0,
    endTime: val ? val.totalTime : 0
  }), arr2.forEach((a, b) => {
    let {
      url: res5,
      name: res6
    } = obj19(a);
    !fe.has(a.id) && res6 && fe.set(a.id, res6);
    let divEl = document.createElement("div");
    divEl.className = "track";
    let divEl2 = document.createElement("div");
    divEl2.className = "track-head";
    let spanEl = document.createElement("span");
    spanEl.className = "badge audio", spanEl.textContent = "Audio " + (b + 1);
    let strongEl = document.createElement("strong");
    strongEl.textContent = a.label, strongEl.title = a.label;
    let spanEl2 = document.createElement("span");
    spanEl2.className = "track-time", spanEl2.textContent = (a.startTime / 1000).toFixed(1) + "s - " + (a.endTime / 1000).toFixed(1) + 's', divEl2.appendChild(spanEl), divEl2.appendChild(strongEl), divEl2.appendChild(spanEl2);
    let selectEl = document.createElement("select");
    selectEl.setAttribute("aria-label", "File audio untuk track " + (b + 1));
    for (let val3 of Me) {
      let optionEl = document.createElement("option");
      optionEl.value = val3.name, optionEl.textContent = val3.name, selectEl.appendChild(optionEl);
    }
    selectEl.value = fe.get(a.id) || Me[0]?.["name"] || '', selectEl.addEventListener("change", () => {
      let val3 = selectEl.value;
      fe.set(a.id, val3), render8(), handle12({
        force: true
      }), handle9("[AUDIO] Layer Audio " + (b + 1) + " (\"" + a.label + "\") menggunakan: " + val3);
    });
    let labelEl = document.createElement("label");
    labelEl.className = "btn sm", labelEl.innerHTML = ut.upload + "<span>Unggah audio baru</span>";
    let inputEl = document.createElement("input");
    inputEl.type = "file", inputEl.accept = "audio/*,video/*", inputEl.hidden = true, inputEl.addEventListener("change", a2 => {
      let val3 = a2.target.files[0];
      a2.target.value = '', val3 && (fe.set(a.id, val3.name), handle22(val3), handle9("[AUDIO] Layer Audio " + (b + 1) + " (\"" + a.label + "\") diganti file: " + val3.name));
    }), labelEl.appendChild(inputEl), divEl.appendChild(divEl2), divEl.appendChild(selectEl), divEl.appendChild(labelEl), audioRows.appendChild(divEl);
  }), Tn && bind15(arr2);
}
var dt = 112,
  ht = {
    image: {
      bg: "#1f6f9f",
      text: "#a6e3ff"
    },
    video: {
      bg: "#2d5fb0",
      text: "#b7d0ff"
    },
    audio: {
      bg: "#2a7a4b",
      text: "#a8f0c8"
    },
    text: {
      bg: "#7245a3",
      text: "#e2c6ff"
    },
    shape: {
      bg: "#3d4f9a",
      text: "#c1ceff"
    },
    embedScene: {
      bg: "#8a6a1f",
      text: "#ffe2a0"
    },
    default: {
      bg: "#3a3f55",
      text: "#c9cde0"
    }
  };
function sort(a, b, c) {
  let max5 = Math.max(1, c - b),
    set = new Set(),
    fn8 = a2 => {
      if (!(!a2 || !Array.isArray(a2.kfs))) {
        for (let val4 of a2.kfs) Number.isFinite(val4.t) && set.add(Math.round(b + val4.t * max5));
      }
    },
    val3 = a.transform || {};
  fn8(val3.location), fn8(val3.scale), fn8(val3.rotation), fn8(val3.opacity), fn8(a.size), fn8(a.startAngle), fn8(a.endAngle);
  for (let val4 of a.effects || []) for (let val5 of val4.params || []) fn8(val5.channel);
  return [...set].sort((a2, b2) => a2 - b2);
}
function update13(a) {
  let fn8 = a2 => Math.max(0, Math.min(255, Math.round((Number(a2) || 0) * 255))).toString(16).padStart(2, '0');
  return '#' + fn8(a[0]) + fn8(a[1]) + fn8(a[2]) + (a[3] === void 0 ? 'ff' : fn8(a[3]));
}
function build12(a) {
  let val3 = a.fillVideo || a.fillImage || a.src || '';
  if (val3 && val2 && val2.images && val2.images.get) {
    let get23 = val2.images.get(val3);
    if (get23) return get23;
  }
  return val3 ? '' : a.tag === "text" ? "text" : get13(a) ? "group" : a.fillColor && a.fillColor.length >= 3 ? update13(a.fillColor) : '';
}
var gi = [],
  nl = 26,
  il = 24;
function handle15(a, b) {
  let val3 = a.getContext && a.getContext('2d');
  if (!val3) return;
  let val4 = a.width,
    val5 = a.height;
  if (val3.clearRect(0, 0, val4, val5), typeof b == "string" && b !== "text" && b !== "group" && b.charAt(0) === '#') {
    val3.fillStyle = b, val3.fillRect(0, 0, val4, val5), val3.strokeStyle = "rgba(255,255,255,.2)", val3.strokeRect(2.5, 2.5, val4 - 5, val5 - 5);
    return;
  }
  if (b === "text" || b === "group") {
    val3.fillStyle = "#1a1f2c", val3.fillRect(0, 0, val4, val5), val3.fillStyle = "#c8d0e8", val3.font = "bold 12px ui-sans-serif, system-ui", val3.textBaseline = "middle", val3.fillText(b === "text" ? 'T' : 'es', b === "text" ? 9 : 6, val5 / 2 + 1);
    return;
  }
  if (!b || typeof b != "object") {
    val3.fillStyle = "#12151d", val3.fillRect(0, 0, val4, val5);
    return;
  }
  let val6 = b.videoWidth || b.naturalWidth || b.width || 0,
    val7 = b.videoHeight || b.naturalHeight || b.height || 0;
  if (!val6 || !val7) {
    val3.fillStyle = "#12151d", val3.fillRect(0, 0, val4, val5);
    return;
  }
  let max5 = Math.max(val4 / val6, val5 / val7),
    val8 = val6 * max5,
    val9 = val7 * max5;
  try {
    val3.drawImage(b, (val4 - val8) / 2, (val5 - val9) / 2, val8, val9);
  } catch {
    val3.fillStyle = "#12151d", val3.fillRect(0, 0, val4, val5);
  }
}
function process13(a) {
  let toLowerCase = (a.fillType || '').toLowerCase(),
    toLowerCase2 = (a.tag || '').toLowerCase();
  return toLowerCase2 === "audio" || toLowerCase === "audio" ? ht.audio : toLowerCase === "image" || toLowerCase === "photo" ? ht.image : toLowerCase === "video" ? ht.video : toLowerCase2 === "text" ? ht.text : toLowerCase2 === "embedscene" ? ht.embedScene : toLowerCase2 === "shape" ? ht.shape : ht.default;
}
var je = 3,
  Bn = false,
  yt = null,
  ri = false,
  te = a => String(a).replace(/[&<>"']/g, a2 => ({
    '&': "&amp;",
    '<': "&lt;",
    '>': "&gt;",
    '\x22': "&quot;",
    '\x27': "&#39;"
  })[a2]),
  Nn = (a, b) => String(a.id || b);
function compute11() {
  return je / 100;
}
function getEl() {
  return document.getElementById("timeline-body");
}
function apply12(a) {
  return !!(val2 && val2.hiddenLayers && val2.hiddenLayers.has(a.id));
}
function get11(a, b) {
  je = Math.min(20, Math.max(0.2, a)), b && (Bn = true);
  let tlZoom = document.getElementById("tl-zoom");
  tlZoom.value = String(je), update8(tlZoom), document.getElementById("tl-zoom-label").textContent = je.toFixed(1) + 'x', val && bind4();
}
function update14() {
  let res5 = getEl();
  if (!val || !res5 || res5.clientWidth < 160) return false;
  let val3 = res5.clientWidth - dt - 6;
  return Bn = false, get11(val3 / Math.max(1, val.totalTime / 100), false), true;
}
function build13(a) {
  !val || !val2 || !Bn && update14() || (bind4(), a && _n());
}
function _n() {
  let res5 = getEl();
  if (!res5 || res5.clientWidth < 40) return;
  let val3 = dt + Math.round(H * compute11());
  (val3 < res5.scrollLeft + dt || val3 > res5.scrollLeft + res5.clientWidth - 16) && (res5.scrollLeft = Math.max(0, val3 - dt - 32));
}
function handle16() {
  let items3 = obj21().layers.map((a, b) => ({
    layer: a,
    key: Nn(a, b)
  })).filter(a => get13(a.layer)).map(a => a.key);
  if (!items3.length) return false;
  let some2 = items3.some(a => !Ie.has(a));
  return items3.forEach(a => {
    some2 ? Ie.add(a) : Ie.delete(a);
  }), bind4(), some2;
}
function process14(a) {
  let tlGroups = document.getElementById("tl-groups");
  if (!tlGroups) return;
  let items3 = (a || []).filter(get13);
  if (tlGroups.hidden = items3.length === 0, !items3.length) return;
  let every = items3.every((a2, b) => Ie.has(Nn(a2, (a || []).indexOf(a2))));
  tlGroups.textContent = every ? "Tutup Semua Grup" : "Buka Semua Grup", tlGroups.title = every ? "Kembali " + items3.length + " grup ke tampilan ringkas" : "Tampilkan isi " + items3.length + " grup sekaligus", tlGroups.classList.toggle('on', every);
}
function compute12() {
  let layerInfo = document.getElementById("layer-info");
  layerInfo && (layerInfo.innerHTML = "<div class=\"empty\">Ketuk blok layer untuk melihat detail dan preview medianya.</div>");
}
function render11(a) {
  if (val2) {
    val2.hiddenLayers || (val2.hiddenLayers = new Set()), val2.hiddenLayers.has(a.id) ? val2.hiddenLayers.delete(a.id) : val2.hiddenLayers.add(a.id);
    try {
      handle12();
    } catch {}
    bind4(), V = true;
  }
}
function apply13(a, b) {
  yt = Nn(a, b), val2 && (val2.debugSelectedLayerId = a ? a.id : null), document.querySelectorAll(".tl-block").forEach(a2 => a2.classList.toggle("tl-selected", a2.dataset.key === yt)), document.querySelectorAll(".tl-label").forEach(a2 => a2.classList.toggle("sel", a2.dataset.key === yt)), document.querySelectorAll(".st-row").forEach(a2 => a2.classList.toggle("st-sel", a2.dataset.key === yt)), bind6(a, b, a.ce || 0), V = true;
}
var be = [],
  kn = [];
function get12() {
  be = [...new Set(be.map(a => Math.round(Number(a) || 0)).filter(a => a >= 0))].sort((a, b) => a - b);
}
function update15() {
  be = (val && Array.isArray(val.bookmarks) ? val.bookmarks : []).slice(), get12();
}
function build14(a) {
  let val3 = a / 1000,
    floor = Math.floor(val3 / 60);
  return floor ? floor + ':' + String(Math.floor(val3 % 60)).padStart(2, '0') + '.' + String(Math.round(val3 % 1 * 100)).padStart(2, '0') : val3.toFixed(2) + 's';
}
function handle17() {
  if (!val) return false;
  let round = Math.round(H),
    findIndex = be.findIndex(a => Math.abs(a - round) < 60);
  return findIndex >= 0 ? be.splice(findIndex, 1) : be.push(round), get12(), bind3(), handle9(findIndex >= 0 ? "[BOOKMARK] Penanda " + build14(round) + " dihapus (" + be.length + " tersisa)." : "[BOOKMARK] Penanda " + build14(round) + " dibuat (" + be.length + " total)."), true;
}
function process15(a) {
  if (!val || !be.length) return false;
  let ref24 = be,
    val3 = null;
  return a > 0 ? val3 = ref24.find(a2 => a2 > H + 1) : val3 = [...ref24].reverse().find(a2 => a2 < H - 1), val3 == null ? false : (process22(val3), _n(), true);
}
function bind3() {
  let timelineRuler = document.getElementById("timeline-ruler");
  if (!timelineRuler) return;
  if (timelineRuler.querySelectorAll(".tl-bm-flag").forEach(a => a.remove()), !val) {
    kn = [];
    return;
  }
  let res5 = compute11();
  kn = [];
  for (let val3 of be) {
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "tl-bm-flag", buttonEl.style.left = dt + Math.round(val3 * res5) + 'px', buttonEl.dataset.time = build14(val3), buttonEl.dataset.ms = String(val3), buttonEl.title = "Ke " + build14(val3) + " - klik kanan untuk membuang penanda", buttonEl.setAttribute("aria-label", buttonEl.title), buttonEl.addEventListener("click", a => {
      a.stopPropagation(), process22(val3), _n();
    }), buttonEl.addEventListener("contextmenu", a => {
      a.preventDefault(), a.stopPropagation();
      let indexOf = be.indexOf(val3);
      indexOf >= 0 && be.splice(indexOf, 1), bind3(), handle9("[BOOKMARK] Penanda " + build14(val3) + " dihapus.");
    }), timelineRuler.appendChild(buttonEl), kn.push(buttonEl);
  }
  render12();
}
function render12() {
  for (let n = 0; n < kn.length; n++) {
    let val3 = be[n];
    kn[n].classList.toggle("active", val3 !== void 0 && Math.abs(val3 - H) < 60);
  }
}
var wo = 0;
function apply14(a) {
  if (!gi.length) return;
  let now = performance.now();
  if (!(!a && now - wo < 250)) {
    wo = now;
    for (let val3 of gi) val3.canvas.isConnected && handle15(val3.canvas, val3.source);
  }
}
function bind4() {
  let timelineTracks = document.getElementById("timeline-tracks"),
    timelineInner = document.getElementById("timeline-inner"),
    layersCount = document.getElementById("layers-count");
  if (!timelineTracks || !timelineInner) return;
  update16(), timelineTracks.innerHTML = '';
  let res5 = obj21(),
    val3 = res5.layers;
  if (!val3.length) {
    timelineTracks.innerHTML = "<div class=\"empty\">Scene ini tidak punya layer.</div>", layersCount && (layersCount.textContent = ''), compute12();
    return;
  }
  gi = [];
  let val4 = val.totalTime || 1;
  layersCount && (layersCount.textContent = val3.length + " layer" + (Te.length ? " (scene " + Te.length + ')' : '')), val2 && !val2.hiddenLayers && (val2.hiddenLayers = new Set());
  let res6 = compute11(),
    max5 = Math.max(160, Math.round(val4 * res6));
  timelineInner.style.width = dt + max5 + 'px';
  let reverse = [...val3].reverse(),
    val5 = null;
  function bind5(a, b, c, d) {
    let res7 = Nn(a, b),
      res8 = apply12(a),
      val6 = res7 === yt;
    val6 && (val5 = {
      layer: a,
      xmlIndex: b
    }), a.ce = d;
    let divEl = document.createElement("div");
    divEl.className = "tl-track" + (c > 0 ? " tl-sub-track" : '');
    divEl.__layer = a;
    let divEl2 = document.createElement("div");
    divEl2.className = "tl-label" + (res8 ? " tl-hidden" : '') + (val6 ? " sel" : '') + (c > 0 ? " tl-sub-label" : ''), divEl2.dataset.key = res7, divEl2.title = a.label || a.id || "Layer " + (b + 1), c > 0 && (divEl2.style.paddingLeft = c * 14 + 'px');
    let buttonEl = document.createElement("button");
    if (buttonEl.type = "button", buttonEl.className = "tl-eye" + (res8 ? " off" : ''), buttonEl.setAttribute("aria-label", res8 ? "Tampilkan layer" : "Sembunyikan layer"), buttonEl.innerHTML = res8 ? ut.eyeOff : ut.eye, buttonEl.addEventListener("click", a2 => {
      a2.stopPropagation(), render11(a);
    }), divEl2.appendChild(buttonEl), get13(a)) {
      let has = Ie.has(res7),
        buttonEl2 = document.createElement("button");
      buttonEl2.type = "button", buttonEl2.className = "tl-chev" + (has ? '' : " closed"), buttonEl2.textContent = has ? '▾' : '▸', buttonEl2.title = has ? "Tutup isi grup" : "Lihat isi grup", buttonEl2.setAttribute("aria-label", buttonEl2.title), buttonEl2.addEventListener("click", a2 => {
        a2.stopPropagation(), apply15(res7);
      }), divEl2.appendChild(buttonEl2);
    }
    let spanEl = document.createElement("span");
    spanEl.className = "tl-thumb", spanEl.title = "Lihat isi layer di posisi ini";
    let canvasEl = document.createElement("canvas");
    canvasEl.width = nl, canvasEl.height = il, spanEl.appendChild(canvasEl);
    let res9 = build12(a);
    handle15(canvasEl, res9), res9 && typeof res9 == "object" && (canvasEl.dataset.thumb = "live", gi.push({
      canvas: canvasEl,
      source: res9
    })), spanEl.addEventListener("click", a2 => {
      a2.stopPropagation(), apply13(a, b), process22(val7);
    }), divEl2.appendChild(spanEl);
    let spanEl2 = document.createElement("span");
    spanEl2.textContent = a.label || a.id || 'L' + (b + 1), divEl2.appendChild(spanEl2);
    let divEl3 = document.createElement("div");
    divEl3.className = "tl-canvas-area", divEl3.style.width = max5 + 'px';
    let val7 = d + (a.startTime || 0),
      val8 = d + (a.endTime || val4),
      max6 = Math.max(0, val8 - val7),
      round = Math.round(val7 * res6),
      max7 = Math.max(4, Math.round(max6 * res6)),
      res10 = process13(a),
      divEl4 = document.createElement("div");
    divEl4.className = "tl-block" + (res8 ? " tl-hidden-block" : '') + (val6 ? " tl-selected" : '') + (c > 0 ? " tl-sub-block" : ''), divEl4.dataset.key = res7;
    let val9 = c > 0 ? res10.bg + 'bb' : res10.bg;
    divEl4.style.cssText = "left:" + round + "px;width:" + max7 + "px;background:" + val9 + ";color:" + res10.text + ';';
    let setDrop = a2 => {
        if (!a2 || !a2.dataTransfer || ![...a2.dataTransfer.types].includes("Files")) return;
        a2.preventDefault(), a2.dataTransfer.dropEffect = "copy", divEl.classList.add("tl-drop");
      },
      clearDrop = () => divEl.classList.remove("tl-drop"),
      dropReplace = a2 => {
        clearDrop(), vn = 0, document.body.classList.remove("dragging");
        if (!a2 || !a2.dataTransfer) return;
        let files2 = [...(a2.dataTransfer.files || [])];
        if (!files2.length || a.fillType !== "media") return;
        let uri2 = a.fillVideo || a.fillImage,
          slot2 = (val.media || []).find(a3 => a3.uri === uri2);
        if (!slot2) return;
        a2.preventDefault(), a2.stopPropagation(), replaceMediaForLayer(a, files2[0]);
      };
    for (let el of [divEl, divEl2, divEl4, spanEl, canvasEl]) el.addEventListener("dragover", setDrop), el.addEventListener("dragleave", clearDrop), el.addEventListener("drop", dropReplace);
    let val10 = a.label || a.id || '';
    max7 > 28 ? divEl4.textContent = val10 : divEl4.title = val10;
    let res11 = sort(a, val7, val8),
      val11 = res11.length > 60 ? res11.filter((a2, b2) => b2 % Math.ceil(res11.length / 60) === 0) : res11;
    for (let val12 of val11) {
      let val13 = Math.round((val12 - d) * res6) - round;
      if (val13 < 0 || val13 > max7) continue;
      let iEl = document.createElement('i');
      iEl.className = "tl-kf" + (val12 <= val7 || val12 >= val8 ? " tl-kf-edge" : ''), iEl.style.left = val13 + 'px', divEl4.appendChild(iEl);
    }
    let dragBase0 = d,
      dragStart0 = a.startTime || 0,
      dragEnd0 = a.endTime != null ? a.endTime : (val.totalTime || 0),
      mkEdge = (cls, side) => {
        let edgeEl = document.createElement("i");
        edgeEl.className = "tl-edge " + cls;
        edgeEl.title = side === "r" ? "Geser akhir layer" : "Geser awal layer";
        edgeEl.addEventListener("click", ev2 => ev2.stopPropagation());
        edgeEl.addEventListener("pointerdown", ev2 => {
          if (ev2.button != null && ev2.button !== 0) return;
          ev2.preventDefault(), ev2.stopPropagation();
          try { edgeEl.setPointerCapture(ev2.pointerId); } catch {}
          let snapBefore = sceneSnapshot();
          let x0 = ev2.clientX, scale0 = compute11(), s0 = a.startTime || dragStart0,
            e0 = a.endTime != null ? a.endTime : dragEnd0, moved = false;
          let applyLive = () => {
            divEl4.style.left = Math.round((dragBase0 + (a.startTime || 0)) * scale0) + 'px';
            divEl4.style.width = Math.max(4, Math.round(((a.endTime || 0) - (a.startTime || 0)) * scale0)) + 'px';
          };
          let onMove = m => {
            let dx = (m.clientX - x0) / scale0;
            moved = Math.abs(m.clientX - x0) > 2;
            if (side === "r") a.endTime = Math.max(s0 + 100, Math.min(val.totalTime || 1e9, e0 + dx));
            else a.startTime = Math.max(0, Math.min(e0 - 100, s0 + dx));
            moved && applyLive();
          };
          let onUp = () => {
            window.removeEventListener("pointermove", onMove), window.removeEventListener("pointerup", onUp), window.removeEventListener("pointercancel", onUp);
            if (!moved) {
              a.startTime = s0, a.endTime = e0;
              return;
            }
            pushUndo(snapBefore);
            V = true;
            handle9("[EDIT] Layer \"" + (a.label || a.id) + "\" durasi " + Math.round(s0) + "→" + Math.round(e0) + " ms  (" + Math.round(a.startTime) + "–" + Math.round(a.endTime) + " ms)");
            bind4(), val2 && val2.renderAt(H);
          };
          window.addEventListener("pointermove", onMove), window.addEventListener("pointerup", onUp), window.addEventListener("pointercancel", onUp);
        }, { passive: false });
        return edgeEl;
      };
    divEl4.appendChild(mkEdge("tl-edge-l", "l")), divEl4.appendChild(mkEdge("tl-edge-r", "r"));
    divEl4.addEventListener("pointerdown", ev2 => {
      if (ev2.button != null && ev2.button !== 0) return;
      if (ev2.target && ev2.target.classList && ev2.target.classList.contains("tl-edge")) return;
      let snapT = sceneSnapshot(), x0 = ev2.clientX, scaleT = compute11(),
        s0 = a.startTime || 0, e0 = a.endTime != null ? a.endTime : (val.totalTime || 0), moved = false;
      const onMove = m => {
        let dx = m.clientX - x0;
        if (!moved && Math.abs(dx) < 5) return;
        moved = Math.abs(dx) >= 5;
        if (!moved) return;
        let dur = e0 - s0, total = val.totalTime || 0,
          ns = Math.max(0, Math.min(total - dur, s0 + dx / scaleT));
        a.startTime = ns, a.endTime = ns + dur;
        divEl4.style.left = Math.round((dragBase0 + ns) * scaleT) + "px";
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove), window.removeEventListener("pointerup", onUp);
        if (!moved) return;
        pushUndo(snapT), V = true;
        handle9("[EDIT] Layer \"" + (a.label || a.id) + "\" dipindah ke " + Math.round(a.startTime) + " ms");
        bind4(), val2 && val2.renderAt(H);
      };
      window.addEventListener("pointermove", onMove), window.addEventListener("pointerup", onUp);
    }, { passive: false });
    divEl2.addEventListener("pointerdown", ev2 => {
      if (ev2.button != null && ev2.button !== 0) return;
      if (ev2.target && ev2.target.closest && ev2.target.closest("button, .tl-thumb, .tl-edge")) return;
      let snapT = sceneSnapshot(), y0 = ev2.clientY, active = false;
      const onMove = m => {
        let dy = m.clientY - y0;
        if (!active && Math.abs(dy) < 7) return;
        if (!active) {
          active = true, divEl.classList.add("tl-reorder"), divEl.style.zIndex = "6";
        }
        divEl.style.transform = "translateY(" + dy + "px)";
      };
      const onUp = m => {
        window.removeEventListener("pointermove", onMove), window.removeEventListener("pointerup", onUp);
        divEl.classList.remove("tl-reorder"), divEl.style.transform = "", divEl.style.zIndex = "";
        if (!active) return;
        let arr = findParentArray(a);
        if (!arr || arr.length < 2) return;
        let rows = [...document.querySelectorAll(".tl-track")].filter(r => r.__layer && findParentArray(r.__layer) === arr && r !== divEl);
        if (!rows.length) return;
        let pos = 0;
        for (; pos < rows.length; pos++) {
          let rc = rows[pos].getBoundingClientRect();
          if (m.clientY < rc.top + rc.height / 2) break;
        }
        let domOrder = rows.map(r => r.__layer);
        domOrder.splice(pos, 0, a);
        let newArr = domOrder.slice().reverse().filter(l => arr.indexOf(l) >= 0);
        arr.forEach(l => {
          newArr.indexOf(l) < 0 && newArr.push(l);
        });
        if (newArr.length !== arr.length) return;
        let oldIdx = arr.indexOf(a), newIdx = newArr.indexOf(a);
        if (oldIdx === newIdx) return;
        pushUndo(snapT), arr.splice(0, arr.length, ...newArr), V = true;
        handle9("[EDIT] Layer \"" + (a.label || a.id) + "\" urutan " + (oldIdx + 1) + " → " + (newIdx + 1));
        bind4(), val2 && val2.renderAt(H);
      };
      window.addEventListener("pointermove", onMove), window.addEventListener("pointerup", onUp);
    }, { passive: false });
    res11.length && (divEl4.title = val10 + " - " + res11.length + " keyframe"), divEl4.addEventListener("click", () => apply13(a, b)), divEl2.addEventListener("click", () => {
      apply13(a, b), process22(val7);
    }), divEl3.appendChild(divEl4), divEl.appendChild(divEl2), divEl.appendChild(divEl3), timelineTracks.appendChild(divEl), get13(a) && Ie.has(res7) && [...a.scene.layers].reverse().forEach((a2, b2) => {
      let val12 = a.scene.layers.length - 1 - b2;
      bind5(a2, val12, c + 1, val7);
    });
  }
  reverse.forEach((a, b) => {
    let val6 = val3.length - 1 - b;
    bind5(a, val6, 0, res5.offsetMs);
  }), handle19(), bind3(), apply14(), val5 ? bind6(val5.layer, val5.xmlIndex) : compute12();
}
var Te = [],
  Ie = new Set();
function obj21() {
  if (!val) return {
    scene: null,
    layers: [],
    offsetMs: 0
  };
  let n = 0,
    val3 = val;
  for (let val4 of Te) if (n += val4.layer.startTime || 0, val3 = val4.layer.scene, !val3) break;
  return {
    scene: val3,
    layers: val3 && val3.layers || [],
    offsetMs: n
  };
}
function handle18() {
  bind4();
}
function join() {
  let arr2 = [val && val.title || "Proyek"];
  for (let val3 of Te) arr2.push(val3.layer.label || val3.layer.id || "Scene");
  return arr2.join(" › ");
}
function compute13(a) {
  !a || !a.scene || (a.scene.Sn = a.label || a.id || "Scene", Te.push({
    layer: a
  }), handle18());
}
function render13() {
  Te.length && (Te.pop(), handle18());
}
function apply15(a) {
  Ie.has(a) ? Ie.delete(a) : Ie.add(a), bind4();
}
function get13(a) {
  let val3 = a && a.scene;
  return (a.tag || '').toLowerCase() === "embedscene" && !!val3 && Array.isArray(val3.layers);
}
function update16() {
  let sceneTreeList = document.getElementById("scene-tree-list"),
    sceneTreeBreadcrumb = document.getElementById("scene-tree-breadcrumb"),
    sceneTreeUp = document.getElementById("scene-tree-up");
  if (!sceneTreeList || !sceneTreeBreadcrumb || !sceneTreeUp) return;
  sceneTreeBreadcrumb.textContent = join(), sceneTreeBreadcrumb.title = sceneTreeBreadcrumb.textContent, sceneTreeUp.style.display = Te.length ? '' : "none", sceneTreeUp.onclick = render13;
  let sceneTreePanel = document.getElementById("scene-tree-panel"),
    res5 = obj21(),
    val3 = Te.length > 0 || res5.layers.some(get13);
  if (sceneTreePanel && (sceneTreePanel.style.display = val3 ? '' : "none"), process14(res5.layers), sceneTreeList.innerHTML = '', !val) {
    sceneTreeList.innerHTML = "<div class=\"st-empty\">Belum ada scene.</div>";
    return;
  }
  if (!res5.layers.length) {
    sceneTreeList.innerHTML = "<div class=\"st-empty\">Scene ini tidak punya layer.</div>";
    return;
  }
  let val4 = res5.layers;
  [...val4].reverse().forEach((a, b) => bind5(sceneTreeList, a, res5.offsetMs, 0, val4.length - 1 - b));
}
function bind5(a, b, c, d, arg) {
  let res5 = Nn(b, arg),
    val3 = c + (b.startTime || 0);
  b.ce = c;
  let res6 = get13(b),
    res7 = apply12(b),
    has = Ie.has(res5),
    divEl = document.createElement("div");
  divEl.className = "st-row" + (d > 0 ? " st-sub-row" : '') + (res5 === yt ? " st-sel" : ''), divEl.dataset.key = res5;
  for (let n = 0; n < d; n++) {
    let divEl3 = document.createElement("div");
    divEl3.className = "st-indent-line", divEl.appendChild(divEl3);
  }
  let buttonEl = document.createElement("button");
  buttonEl.type = "button", buttonEl.className = "st-chevron" + (res6 ? has ? " open" : '' : " leaf"), buttonEl.textContent = '▶', res6 && (buttonEl.title = has ? "Tutup isi scene" : "Lihat isi scene", buttonEl.addEventListener("click", a2 => {
    a2.stopPropagation(), apply15(res5);
  })), divEl.appendChild(buttonEl);
  let divEl2 = document.createElement("div");
  divEl2.className = "st-icon", divEl2.style.background = process13(b).bg, divEl.appendChild(divEl2);
  let spanEl = document.createElement("span");
  spanEl.className = "st-name", spanEl.textContent = b.label || b.id || "Layer " + (arg + 1), spanEl.title = spanEl.textContent, divEl.appendChild(spanEl);
  let spanEl2 = document.createElement("span");
  if (spanEl2.className = "st-tag", spanEl2.textContent = res6 ? "Scene " + b.scene.layers.length : b.tag || b.fillType || '?', divEl.appendChild(spanEl2), res6) {
    let buttonEl3 = document.createElement("button");
    buttonEl3.type = "button", buttonEl3.className = "st-open-btn", buttonEl3.textContent = "Buka", buttonEl3.title = "Masuk ke scene ini", buttonEl3.addEventListener("click", a2 => {
      a2.stopPropagation(), compute13(b);
    }), divEl.appendChild(buttonEl3);
  }
  let buttonEl2 = document.createElement("button");
  if (buttonEl2.type = "button", buttonEl2.className = "st-eye" + (res7 ? '' : " on"), buttonEl2.title = res7 ? "Tampilkan layer" : "Sembunyikan layer", buttonEl2.innerHTML = res7 ? ut.eyeOff : ut.eye, buttonEl2.addEventListener("click", a2 => {
    a2.stopPropagation(), render11(b);
  }), divEl.appendChild(buttonEl2), divEl.addEventListener("click", () => {
    apply13(b, arg), process22(val3);
  }), a.appendChild(divEl), res6 && has) {
    let val4 = b.scene.layers;
    [...val4].reverse().forEach((a2, b2) => bind5(a, a2, val3, d + 1, val4.length - 1 - b2));
  }
}
function handle19() {
  let timelineRulerCanvas = document.getElementById("timeline-ruler-canvas");
  if (!timelineRulerCanvas || !val) return;
  let val3 = val.totalTime || 1,
    res5 = compute11(),
    max5 = Math.max(160, Math.round(val3 * res5)),
    min = Math.min(2, window.devicePixelRatio || 1);
  timelineRulerCanvas.width = Math.round(max5 * min), timelineRulerCanvas.height = Math.round(26 * min), timelineRulerCanvas.style.width = max5 + 'px';
  let ctx = timelineRulerCanvas.getContext('2d');
  ctx.setTransform(min, 0, 0, min, 0, 0), ctx.fillStyle = "#0f1117", ctx.fillRect(0, 0, max5, 26);
  let n = 30000;
  for (let val4 of [100, 200, 500, 1000, 2000, 5000, 10000, 30000]) if (val4 * res5 >= 48) {
    n = val4;
    break;
  }
  ctx.font = "10px ui-monospace, Menlo, monospace", ctx.textBaseline = "top";
  for (let n3 = 0; n3 <= val3; n3 += n) {
    let round = Math.round(n3 * res5);
    ctx.fillStyle = "#343b4d", ctx.fillRect(round, 16, 1, 10), ctx.fillStyle = "#8c93a7";
    let val4 = n3 >= 60000 ? Math.floor(n3 / 60000) + 'm' + String(Math.round(n3 % 60000 / 1000)).padStart(2, '0') + 's' : (n3 / 1000).toFixed(n < 1000 ? 1 : 0) + 's';
    ctx.fillText(val4, round + 3, 4);
  }
}
function process16() {
  if (!val) return;
  let tlPlayhead = document.getElementById("tl-playhead"),
    tlCap = document.getElementById("tl-cap"),
    res5 = getEl();
  if (!tlPlayhead || !tlCap || !res5) return;
  render12(), apply14();
  let val3 = dt + Math.round(H * compute11());
  tlPlayhead.style.left = val3 + 'px', tlCap.style.left = val3 + 'px', flag2 && !ri && _n();
}
function items(a) {
  return (a.effects || []).map(a2 => {
    let val3 = Vt.get(a2.id) || null;
    return {
      name: val3 && val3.name || a2.shortId || String(a2.id).split('.').pop(),
      state: a2.hidden ? "mati" : val2 && val2.failedEffects && val2.failedEffects.has(a2.id) ? "dilewati" : '',
      definition: val3,
      params: a2.params || []
    };
  });
}
function render14(a, b, c) {
  if (!a || !a.channel) return '';
  let val3 = b && b.params.find(a2 => a2.id === a.id),
    res5 = res(a.channel, c),
    val4 = a.dataType || val3 && val3.type || '',
    val5;
  return val4 === "color" ? val5 = '#' + res5.slice(0, 4).map(a2 => Math.round(Math.max(0, Math.min(255, a2 * 255))).toString(16).padStart(2, '0')).join('') : val4 === "bool" ? val5 = res5[0] >= 0.5 ? 'ya' : "tidak" : val5 = res5.filter(a2 => Number.isFinite(a2)).map(a2 => Math.abs(a2) >= 100 ? a2.toFixed(0) : a2.toFixed(2)).join(',\x20'), (val3 && val3.label ? val3.label : a.id) + '\x20' + val5;
}
var li = [],
  bn = null,
  Ya = 0;
function bind6(a, b, c = 0) {
  let layerInfo = document.getElementById("layer-info");
  if (!layerInfo || !val) return;
  li = [], bn = a, Ya = b;
  let res5 = obj21(),
    val3 = res5.scene && res5.scene.totalTime ? res5.scene.totalTime : val.totalTime || 1,
    val4 = a.startTime || 0,
    val5 = a.endTime || val3,
    res6 = process13(a),
    val6 = a.fillVideo || a.fillImage || '',
    val7 = val6 ? process11(Y.get(val6) || val6) : null,
    val8 = val6 && (Y.get(val6) || val7 && val7.name) || '',
    res7 = apply12(a),
    val9 = c > 0 || Te.length > 0,
    res8 = items(a),
    arr2 = [["Urutan", b + 1 + " dari " + res5.layers.length + (Te.length ? " (scene " + Te.length + ')' : '')], ["Jenis", a.tag || '-'], ["Isi", a.fillType || '-'], ["Mulai", (val4 / 1000).toFixed(2) + 's' + (val9 ? " (lokal)" : '')], ["Selesai", (val5 / 1000).toFixed(2) + 's' + (val9 ? " (lokal)" : '')], ["Durasi", ((val5 - val4) / 1000).toFixed(2) + 's'], ["Blend", a.blendMode && a.blendMode !== "normal" ? a.blendMode : "normal"]];
  if (a.shapeType && a.shapeType !== ".rect" && arr2.push(["Bentuk", a.shapeType]), a.tag === "text" && arr2.push(["Teks", (a.textContent || '').slice(0, 140) || '-']), (a.inTime || a.outTime) && arr2.push(["Potong sumber", (a.inTime || 0) / 1000 + "s - " + (a.outTime || 0) / 1000 + 's']), val6 && arr2.push([a.fillVideo ? "Video" : "Gambar", val8 || val6]), a.fillAudio && arr2.push(["Audio", a.fillAudio]), a.tag === "audio") {
    let slice = (a.src || '').replace(/^content:\/\/.*\//, '').replace(/^am:/, "am:").slice(0, 60);
    arr2.push(["Sumber audio", slice || '-']), (a.inTime || a.outTime) && arr2.push(["Potong audio", (a.inTime || 0) / 1000 + "s → " + (a.outTime || 0) / 1000 + 's']);
  }
  let val10 = null,
    flag3 = false;
  if (a.tag === "text") {
    let val13 = a.font || '';
    if (val13.includes("imported?name=")) {
      let match = val13.match(/name=([^&]+)/);
      match && (val10 = decodeURIComponent(match[1]).replace(/\.[^/.]+$/, ''), flag3 = val2 && val2.customFonts && (val2.customFonts.has(val10) || val2.customFonts.has(match[1])), arr2.push(["Font", '\x22' + val10 + '\x22\x20' + (flag3 ? "(Font kustom aktif)" : "(Font kustom — perlu diimport)")]));
    } else val13 && arr2.push(["Font", val13]);
  }
  let val11 = get13(a) ? "<div class=\"li-group\"><div class=\"li-group-head\"><span>Isi grup</span><b>" + a.scene.layers.length + " layer</b></div></div>" : '',
    val12 = res8.length ? "<div class=\"li-fx\">" + res8.map((a2, b2) => "\n              <div class=\"li-fx-item\" data-fx-idx=\"" + b2 + "\">\n                <div class=\"li-fx-name\">\n                  <label class=\"check\" style=\"margin:0;font-size:inherit;display:inline-flex;align-items:center;gap:4px\">\n                    <input type=\"checkbox\" class=\"fx-toggle-cb\" data-fx-i=\"" + b2 + '\x22\x20' + (a.effects[b2] && (a.effects[b2].disabled || a.effects[b2].hidden === true || a.effects[b2].hidden === "true") ? '' : "checked") + ">\n                    <span>" + te(a2.name) + "</span>\n                  </label>\n                  <span class=\"li-fx-state\" data-state=\"" + b2 + "\"></span>\n                </div>\n                " + (a2.params.length ? "<div class=\"li-fx-params\">" + a2.params.map((a3, b3) => "<span data-pi=\"" + b2 + ':' + b3 + "\"></span>").join(" · ") + "</div>" : '') + "\n              </div>").join('') + "</div>" : '';
  layerInfo.innerHTML = "\n        <div class=\"li-head\"><span class=\"li-dot\" style=\"background:" + res6.bg + "\"></span><strong>" + te(a.label || a.id || "Layer") + "</strong></div>\n        <div class=\"li-thumb\"></div>\n        <table class=\"li-table\">" + arr2.map(([a2, a3]) => "<tr><td>" + te(a2) + "</td><td>" + te(a3) + "</td></tr>").join('') + "</table>\n        " + val11 + "\n        " + val12 + "\n        <div class=\"li-actions\">\n            " + (compute21() ? "<button type=\"button\" class=\"btn sm primary\" data-act=\"addFx\">+ Tambah Efek</button>" : '') + "\n            <button type=\"button\" class=\"btn sm\" data-act=\"seek\">Ke awal layer</button>\n            <button type=\"button\" class=\"btn sm\" data-act=\"toggle\">" + (res7 ? "Tampilkan layer" : "Sembunyikan layer") + "</button>\n            " + (val6 ? "<button type=\"button\" class=\"btn sm\" data-act=\"replaceMedia\">Ganti media</button>" : '') + "\n            " + (compute21() ? "<button type=\"button\" class=\"btn sm\" data-act=\"viewXml\">Lihat XML</button>" : '') + "\n            " + (val10 ? "<button type=\"button\" class=\"btn sm primary\" data-act=\"uploadFont\" data-font=\"" + te(val10) + '\x22>' + (flag3 ? "Ganti Font" : "Import Font (.ttf/.otf)") + "</button>" : '') + "\n            " + (get13(a) ? "<button type=\"button\" class=\"btn sm\" data-act=\"open\">Buka grup</button>" : '') + "\n        </div>";
  let querySelector = layerInfo.querySelector("[data-act=\"addFx\"]");
  querySelector && querySelector.addEventListener("click", () => get14(a, b, c));
  let querySelector2 = layerInfo.querySelector(".li-thumb");
  val8 ? querySelector2.appendChild(handle14(val8, "thumb lg")) : querySelector2.remove(), layerInfo.querySelector("[data-act=\"seek\"]").addEventListener("click", () => process22(c + val4)), layerInfo.querySelector("[data-act=\"toggle\"]").addEventListener("click", () => render11(a));
  let querySelector3 = layerInfo.querySelector("[data-act=\"open\"]");
  querySelector3 && querySelector3.addEventListener("click", () => compute13(a));
  let querySelector4 = layerInfo.querySelector("[data-act=\"replaceMedia\"]");
  querySelector4 && querySelector4.addEventListener("click", () => {
    let val13 = Y.get(val6) || val6;
    bind(val13, a2 => {
      Y.set(val6, a2), val2 && val2.setImages(get10()), V = true, handle9("[MEDIA] Layer \"" + (a.label || a.id) + "\" memakai media \"" + a2 + '\x22.'), bind6(a, b, c);
    }, "Ganti media — " + (a.label || a.id || "layer"));
  });
  let querySelector5 = layerInfo.querySelector("[data-act=\"viewXml\"]");
  querySelector5 && querySelector5.addEventListener("click", () => {
    let layerXmlDlg = document.getElementById("layerXmlDlg"),
      layerXmlBody = document.getElementById("layerXmlBody"),
      layerXmlTitle = document.getElementById("layerXmlTitle");
    layerXmlTitle && (layerXmlTitle.textContent = "XML — " + (a.label || a.id || a.tag)), layerXmlBody && (layerXmlBody.textContent = a.sourceXml || "(sumber XML tidak tersedia)"), layerXmlDlg && layerXmlDlg.showModal && layerXmlDlg.showModal();
  }), layerInfo.querySelectorAll(".fx-toggle-cb").forEach(a2 => {
    a2.addEventListener("change", a3 => {
      let number = Number(a3.target.dataset.fxI);
      if (a.effects && a.effects[number]) {
        let val13 = !a3.target.checked;
        a.effects[number].disabled = val13, a.effects[number].hidden = val13, V = true, handle9("[DEBUG FX] Efek \"" + (res8[number] ? res8[number].name : number) + "\" pada layer \"" + a.id + '\x22\x20' + (val13 ? "DIMATIKAN" : "DIDAFTARKAN/DIAKTIFKAN") + '.'), typeof _t == "function" && _t(a);
      }
    });
  }), typeof _t == "function" && _t(a);
  let querySelector6 = layerInfo.querySelector("[data-act=\"uploadFont\"]");
  querySelector6 && querySelector6.addEventListener("click", () => {
    let val13 = querySelector6.dataset.font,
      inputEl = document.createElement("input");
    inputEl.type = "file", inputEl.accept = ".ttf,.otf,.woff,.woff2", inputEl.onchange = async a2 => {
      let val14 = a2.target.files[0];
      if (val14) try {
        await window.AM.loadFont(val13, val14), alert("Font \"" + val13 + "\" berhasil diupload dan dipakai."), bind6(a, b, c);
      } catch (val15) {
        console.error(val15), alert("Gagal mengupload font: " + val15.message);
      }
    }, inputEl.click();
  });
  for (let n = 0; n < res8.length; n++) {
    let val13 = res8[n],
      querySelector7 = layerInfo.querySelector("[data-state=\"" + n + '\x22]');
    querySelector7 && li.push({
      el: querySelector7,
      text: () => val13.state || (H - c >= val4 && H - c < val5 ? "aktif" : "luar waktu")
    });
    for (let n3 = 0; n3 < val13.params.length; n3++) {
      let querySelector8 = layerInfo.querySelector("[data-pi=\"" + n + ':' + n3 + '\x22]');
      querySelector8 && li.push({
        el: querySelector8,
        text: () => render14(val13.params[n3], val13.definition, build3(a, H - c))
      });
    }
  }
  update17();
}
async function get14(a, b, c) {
  let val3 = null;
  try {
    qt && (val3 = await qt);
  } catch {
    val3 = null;
  }
  if (!val3) try {
    val3 = await (await fetch("./effect-index.json")).json();
  } catch {
    handle9("[FX PICKER] Gagal memuat effect-index.json");
    return;
  }
  let divEl = document.createElement("div");
  divEl.className = "lightbox-bg", divEl.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;";
  let divEl2 = document.createElement("div");
  divEl2.style.cssText = "background:#1a1d24;border-radius:12px;width:100%;max-width:540px;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);";
  let divEl3 = document.createElement("div");
  divEl3.style.cssText = "padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;", divEl3.innerHTML = "<strong style=\"font-size:16px;color:#fff;\">Tambah Efek ke " + te(a.label || a.id) + "</strong><button type=\"button\" class=\"btn sm\" style=\"min-width:32px;\">✕</button>", divEl3.querySelector("button").onclick = () => divEl.remove();
  let divEl4 = document.createElement("div");
  divEl4.style.cssText = "padding:12px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;flex:1;";
  let entries = Object.entries(val3);
  for (let [val4, val5] of entries) {
    let divEl5 = document.createElement("div");
    divEl5.style.cssText = "background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px;display:flex;flex-direction:column;align-items:center;cursor:pointer;text-align:center;transition:background 0.15s;", divEl5.onmouseenter = () => divEl5.style.background = "rgba(255,255,255,0.12)", divEl5.onmouseleave = () => divEl5.style.background = "rgba(255,255,255,0.05)";
    let replace = val5.replace(/\.xml$/i, '').replace(/-/g, '_'),
      arr2 = ["./effect-thumb/" + replace + ".webp", "/effects/thumb/" + replace + ".webp", "./effect-thumb/" + replace + "_bg.webp", "/effects/thumb/" + replace + "_bg.webp"],
      n = 0,
      val6 = arr2[0],
      imgEl = document.createElement("img");
    imgEl.src = val6, imgEl.style.cssText = "width:64px;height:64px;object-fit:cover;border-radius:6px;background:#000;margin-bottom:6px;", imgEl.onerror = () => {
      n++, n < arr2.length ? imgEl.src = arr2[n] : imgEl.style.display = "none";
    };
    let spanEl = document.createElement("span");
    spanEl.style.cssText = "font-size:11px;color:#ddd;line-height:1.2;word-break:break-word;", spanEl.textContent = val4.split('.').pop(), divEl5.appendChild(imgEl), divEl5.appendChild(spanEl), divEl5.onclick = async () => {
      divEl.remove(), compute7('fx', "Menambahkan efek " + val4 + '…');
      try {
        a.effects || (a.effects = []);
        let obj23 = {
          id: val4,
          params: [],
          hidden: false,
          disabled: false
        };
        a.effects.push(obj23);
        let fn8 = a2 => get15(a2),
          set = new Set();
        ref18(val, set), await val2.loadEffectLibrary([...set], fn8);
        let val7 = val2.programs.get(val4)?.["definition"];
        val7 && val7.name && Vt.set(val4, val7), V = true, handle9("[FX] Efek \"" + val4 + "\" ditambahkan ke layer \"" + (a.label || a.id) + '\x22.'), bind6(a, b, c);
      } catch (val7) {
        handle9("[FX] Gagal menambah efek: " + val7.message), get7("Gagal menambah efek: " + val7.message);
      } finally {
        apply7('fx');
      }
    }, divEl4.appendChild(divEl5);
  }
  divEl2.appendChild(divEl3), divEl2.appendChild(divEl4), divEl.appendChild(divEl2), document.body.appendChild(divEl);
}
function update17() {
  for (let val3 of li) {
    let text = val3.text();
    text && val3.el.textContent !== text && (val3.el.textContent = text);
  }
}
function bind7() {
  let tlZoom = document.getElementById("tl-zoom");
  tlZoom.addEventListener("input", () => get11(Number(tlZoom.value), true)), document.getElementById("tl-zoom-in").addEventListener("click", () => get11(je * 1.5, true)), document.getElementById("tl-zoom-out").addEventListener("click", () => get11(je / 1.5, true)), document.getElementById("tl-fit").addEventListener("click", () => {
    Bn = false, build13();
  }), document.getElementById("tl-here").addEventListener("click", () => _n()), document.getElementById("tl-groups").addEventListener("click", () => handle16());
  let timelineInner = document.getElementById("timeline-inner"),
    timelineRuler = document.getElementById("timeline-ruler"),
    fn8 = a => (a.clientX - timelineInner.getBoundingClientRect().left - dt) / compute11();
  timelineInner.addEventListener("click", a => {
    if (!val || a.target.closest(".tl-block, .tl-label, .tl-eye, #timeline-ruler")) return;
    let res5 = fn8(a);
    res5 >= 0 && process22(res5);
  }), timelineRuler.addEventListener("pointerdown", a => {
    if (!(!val || a.target.closest(".tl-corner"))) {
      ri = true;
      try {
        timelineRuler.setPointerCapture(a.pointerId);
      } catch {}
      process22(Math.max(0, fn8(a)));
    }
  }), timelineRuler.addEventListener("pointermove", a => {
    ri && process22(Math.max(0, fn8(a)));
  });
  let fn9 = () => {
    ri = false;
  };
  timelineRuler.addEventListener("pointerup", fn9), timelineRuler.addEventListener("pointercancel", fn9), tlZoom.value = String(je), update8(tlZoom);
  let n = 0;
  window.addEventListener("resize", () => {
    clearTimeout(n), n = setTimeout(() => {
      val && build13();
    }, 180);
  });
}
function ref18(a, b) {
  for (let val3 of a.layers || []) {
    for (let val4 of val3.effects || []) b.add(val4.id);
    val3.scene && ref18(val3.scene, b);
  }
  return b;
}
function ref19(a, b) {
  for (let val3 of a.layers || []) val3.shapeType && val3.shapeType[0] === '.' && b.add(val3.shapeType), val3.scene && ref19(val3.scene, b);
  return b;
}
var ua = null;
function compute14() {
  return ua || (ua = fetch("./shape-index.json").then(a => a.json())), ua;
}
async function res3(a) {
  let val3 = await compute14(),
    val4 = val3[a] || val3[a.replace(/^\./, '')];
  if (!val4) throw new Error("file bentuk untuk " + a + " tidak ketemu");
  try {
    let val6 = await fetch("/api/shape-bin?id=" + encodeURIComponent(a));
    if (val6.ok) return get3(await val6.arrayBuffer());
  } catch {}
  try {
    let val6 = await fetch("/api/shape-xml?id=" + encodeURIComponent(a));
    if (val6.ok) return compute2(await val6.text(), val4);
  } catch {}
  let val5 = await fetch("../shapes/" + val4);
  if (!val5.ok) throw new Error("HTTP " + val5.status + " untuk " + val4);
  return compute2(await val5.text(), val4);
}
var Vt = new Map();
var badEffects = new Set();
async function apply16(a, b, c) {
  let ref24 = c;
  if (ref24 == null && le.enabled && le.categoryMode !== "off") try {
    let val3 = await fetch("/api/effect-xml?id=" + encodeURIComponent(b));
    if (val3.ok) {
      let val4 = await val3.text();
      /^\s*<(!doctype\s+html|html)/i.test(val4) || (ref24 = val4);
    }
  } catch {}
  if (!ref24) return;
  let exec = /<effect\b[^>]*\bcategory\s*=\s*"([^"]*)"/i.exec(ref24);
  a.category = exec ? exec[1].trim().toLowerCase() : "other";
}
async function get15(a) {
  if (badEffects.has(a)) throw new Error("file efek untuk " + a + " tidak ketemu");
  if (Vt.has(a)) return Vt.get(a);
  let res5 = String(a),
    val3 = null,
    val4 = null;
  try {
    let val5 = await fetch("/api/effect-bin?id=" + encodeURIComponent(a));
    val5.ok && (res5 = val5.headers.get("X-Effect-File") || res5, val3 = parseAmfxBinary(await val5.arrayBuffer()));
  } catch {}
  if (!val3) {
    let val5 = null;
    try {
      let val6 = await fetch("/api/effect-xml?id=" + encodeURIComponent(a));
      if (val6.ok) {
        res5 = val6.headers.get("X-Effect-File") || res5;
        let val7 = await val6.text();
        /^\s*<(!doctype\s+html|html)/i.test(val7) || (val5 = val7);
      }
    } catch {}
    if (val5 !== null) val3 = parseEffectXml(val5, res5), val4 = val5;else {
      let val6 = await qt,
        val7 = val6[a] || val6[a.split('.').pop()];
      if (!val7) {
        badEffects.add(a);
        throw new Error("file efek untuk " + a + " tidak ketemu");
      }
      res5 = val7;
      let val8 = await fetch("../effects/" + val7);
      if (!val8.ok) {
        badEffects.add(a);
        throw new Error("HTTP " + val8.status + " untuk " + val7);
      }
      let val9 = await val8.text();
      if (/^\s*<(!doctype\s+html|html)/i.test(val9)) {
        badEffects.add(a);
        throw new Error("server membalas HTML (bukan XML) untuk ../effects/" + val7);
      }
      val3 = parseEffectXml(val9, res5), val4 = val9;
    }
  }
  return val3 && val3.category === void 0 && (await apply16(val3, a, val4)), Vt.set(a, val3), val3;
}
async function items2() {
  try {
    let val3 = await fetch("/api/presets");
    if (val3.ok) {
      let items3 = ((await val3.json()).images || []).map(a => a.name);
      if (items3.length) return items3;
    }
  } catch {}
  return [...(await (await fetch(Sn)).text()).matchAll(/href="([^"]+\.(?:jpe?g|png|webp))"/gi)].map(a => decodeURIComponent(a[1])).filter(a => !a.includes('/') && !a.startsWith('.'));
}
async function build15() {
  let sort2 = [...new Set(await items2())].sort();
  return get9(sort2.map(a => ({
    name: a,
    src: Sn + encodeURIComponent(a)
  }))), ke;
}
function res4(a) {
  return get6(Pe, a, {
    mediaEntries: hi,
    used: new Set(Y.values())
  });
}
async function process17() {
  let arr2 = [],
    fn8 = a => {
      for (let val3 of a.media || []) {
        let toLowerCase = (val3.type || '').toLowerCase();
        toLowerCase.startsWith("audio") || (toLowerCase.startsWith("image") || toLowerCase.startsWith("video") || val3.uri) && arr2.push(val3);
      }
      for (let val3 of a.layers || []) val3.scene && fn8(val3.scene);
    };
  fn8(val), arr2.forEach((a, b) => {
    if (Y.has(a.uri)) return;
    let res5 = res4(a);
    Y.set(a.uri, res5 || ke[b % Math.max(1, ke.length)]);
  });
  let items3 = [...new Set(Y.values())].filter(Boolean);
  compute7("media", "Memuat media preset…");
  try {
    let n = 0;
    for (let val3 of items3) render6("media", "Memuat media preset…", n + '/' + items3.length + '\x20' + val3), await apply11(val3), n++;
  } finally {
    apply7("media");
  }
}
function compute15(a) {
  let val3 = val2 && val2.images ? val2.images.get(a) : null;
  if (val3 && val3.tagName === "VIDEO") return val3;
  let val4 = process11(Y.get(a) || a) || process11(a);
  if (!val4) return null;
  let val5 = new URL(val4.src || val4.url, location.href).href;
  for (let [, val6] of at) if (val6 && val6.tagName === "VIDEO" && val6.src === val5) return val6;
  return null;
}
function ref20() {
  let arr2 = [];
  if (!val2 || !val2.images) return arr2;
  for (let val3 of val2.images.values()) val3 && val3.tagName === "VIDEO" && arr2.push(val3);
  return arr2;
}
var Za = new WeakSet();
function apply17() {
  return Ai ? [] : ref20().filter(a => a.readyState < 2 && !Za.has(a));
}
async function updateClock(a, b = 45000) {
  let items3 = [...a].filter(a2 => a2.readyState < 2);
  if (!items3.length) return 0;
  let val3 = ++oi,
    fn8 = () => val3 === oi && !Ai,
    now = performance.now(),
    n = 0,
    fn9 = a2 => {
      fn8() && render6("video", "Menunggu video siap…", a2 + '/' + items3.length + " video");
    };
  compute7("video", "Menunggu video siap…"), fn9(n);
  try {
    await new Promise(a2 => {
      let flag3 = false,
        fn10 = () => {
          if (!flag3) {
            flag3 = true, clearInterval(res5);
            for (let val4 of items3) val4.removeEventListener("loadeddata", fn11), val4.removeEventListener("canplay", fn11), val4.removeEventListener("error", fn11);
            a2();
          }
        },
        fn11 = () => {
          if (!fn8()) {
            fn10();
            return;
          }
          n++, fn9(n), n >= items3.length && fn10();
        };
      for (let val4 of items3) val4.addEventListener("loadeddata", fn11, {
        once: true
      }), val4.addEventListener("canplay", fn11, {
        once: true
      }), val4.addEventListener("error", fn11, {
        once: true
      });
      let res5 = setInterval(() => {
        fn8() ? (items3.every(a3 => a3.readyState >= 2) || performance.now() - now > b) && fn10() : fn10();
      }, 300);
    });
    let n3 = 0;
    for (let val4 of items3) val4.readyState < 2 && (Za.add(val4), n3++);
    return n3 && handle9("[LOAD] " + n3 + " video belum siap setelah " + (b / 1000).toFixed(0) + "s; lanjut dengan apa adanya (bisa muncul frame hitam)."), items3.length - n3;
  } finally {
    val3 === oi && apply7("video");
  }
}
function update18() {
  oi++, apply7("video");
}
function build16() {
  let videoAudioMute = document.getElementById("videoAudioMute"),
    val3 = videoAudioMute ? videoAudioMute.checked : true,
    set = new Set(xt.map(a => compute15(a.key)).filter(Boolean));
  for (let [, val4] of at) !val4 || val4.tagName !== "VIDEO" || (val4.muted = !(set.has(val4) && val3));
}
function handle20(a, b = false) {
  if (!xt.length) return;
  let videoAudioMute = document.getElementById("videoAudioMute"),
    val3 = videoAudioMute ? videoAudioMute.checked : true,
    val4 = (val2 && val2.videoDriftMs || 300) / 1000,
    map = new Map();
  for (let val5 of xt) {
    let val6 = val5.el || (val5.el = compute15(val5.key));
    if (!val6 || val6.tagName !== "VIDEO") continue;
    let {
        start: res5,
        end: res6
      } = obj20(val5),
      val7 = val3 && a >= res5 && a < res6,
      get23 = map.get(val6);
    if (get23 || (get23 = {
      active: false,
      vol: 0,
      driver: null
    }, map.set(val6, get23)), !val7) continue;
    let val8 = res6 - res5,
      val9 = val8 > 0 ? Math.max(0, Math.min(1, (a - res5) / val8)) : 0,
      max5 = Math.max(0, Math.min(1, render15(val5.layer, val9)));
    (!get23.active || max5 > get23.vol) && (get23.vol = max5), get23.driver || (get23.driver = {
      entry: val5,
      start: res5
    }), get23.active = true;
  }
  for (let [val5, val6] of map) {
    let val7 = !val6.active || val6.vol <= 0;
    if (val5.muted !== val7 && (val5.muted = val7), Math.abs(val5.volume - val6.vol) > 0.001 && (val5.volume = val6.vol), !val6.active) {
      val5.volume !== 0 && (val5.volume = 0);
      continue;
    }
    if (val5.readyState >= 2 && Number.isFinite(val5.duration)) {
      let {
          entry: val8,
          start: val9
        } = val6.driver,
        res5 = max2(val8.layer, Math.max(0, a - val9), val5.duration);
      if (res5 !== null && (b || Math.abs(val5.currentTime - res5) > val4)) try {
        val5.currentTime = res5;
      } catch {}
      if (flag2 && val5.paused) try {
        val5.play().catch(() => {});
      } catch {}
    }
  }
}
function process18(a = "diag") {
  if (!xt.length) {
    handle9("[AUDIO][" + a + "] tidak ada layer video sumber suara");
    return;
  }
  let videoAudioMute = document.getElementById("videoAudioMute");
  handle9("[AUDIO][" + a + "] t=" + (H / 1000).toFixed(2) + "s, opsi \"Putar suara dari layer video\"=" + (videoAudioMute ? videoAudioMute.checked : "n/a"));
  for (let val3 of xt) {
    let val4 = val3.el || compute15(val3.key),
      {
        start: res5,
        end: res6
      } = obj20(val3),
      res7 = render15(val3.layer, 0.5);
    if (!val4) {
      handle9("[AUDIO][" + a + "] \"" + (val3.layer.label || val3.layer.id) + "\": ELEMEN VIDEO TIDAK KETEMU (key " + val3.key + ')');
      continue;
    }
    if (val4.tagName !== "VIDEO") {
      handle9("[AUDIO][" + a + "] \"" + (val3.layer.label || val3.layer.id) + "\": slot \"" + val3.key + "\" berisi " + val4.tagName + " (gambar), bukan video -> tidak ada suara");
      continue;
    }
    handle9("[AUDIO][" + a + "] \"" + (val3.layer.label || val3.layer.id) + "\" win " + (res5 / 1000).toFixed(1) + '-' + (res6 / 1000).toFixed(1) + "s, gain@0.5=" + res7.toFixed(2) + ", ready=" + val4.readyState + ", paused=" + val4.paused + ", muted=" + val4.muted + ", vol=" + val4.volume.toFixed(2) + ", t=" + val4.currentTime.toFixed(2) + ", dur=" + (Number.isFinite(val4.duration) ? val4.duration.toFixed(1) : '?'));
  }
}
function compute16(a) {
  let val3 = Y.get(a) || a,
    res5 = process11(val3);
  return !!res5 && build11(res5.name || val3, res5);
}
function render15(a, b) {
  if (!a || a.gain == null) return 1;
  let val3;
  try {
    val3 = res(a.gain, b);
  } catch {
    return 1;
  }
  let val4 = Array.isArray(val3) ? val3[0] : val3;
  return Number.isFinite(val4) ? Math.max(0, val4) : 1;
}
function obj22(a, b, c) {
  let arr2 = [];
  for (let n = 0; n <= 16; n++) {
    let val3 = n / 16;
    arr2.push([val3, render15(a, val3)]);
  }
  return {
    url: c,
    label: a.label || a.id || "layer audio",
    kind: "video",
    speed: a.speed || 1,
    inTimeMs: a.inTime || 0,
    layerStartMs: b + a.startTime,
    layerEndMs: b + a.endTime,
    offsetMs: lt,
    rate: Q,
    gainPoints: arr2
  };
}
function get16({
  intro: a,
  lines: a2,
  canPartial: a3
}) {
  let audioProblemDlg = document.getElementById("audioProblemDlg");
  if (!audioProblemDlg || typeof audioProblemDlg.showModal != "function") {
    let flag3 = true;
    try {
      flag3 = typeof confirm == "function" ? confirm(a + '\x0a\x0a' + a2.join('\x0a') + "\n\nLanjutkan ekspor TANPA audio?") : true;
    } catch {
      flag3 = true;
    }
    return Promise.resolve(flag3 ? "noaudio" : "cancel");
  }
  document.getElementById("audioProblemIntro").textContent = a, document.getElementById("audioProblemList").textContent = a2.join('\x0a');
  let audioProblemPartial = document.getElementById("audioProblemPartial");
  return audioProblemPartial.hidden = !a3, new Promise(a4 => {
    let flag3 = false,
      fn8 = a5 => {
        flag3 || (flag3 = true, audioProblemDlg.removeEventListener("close", fn9), audioProblemDlg.open && audioProblemDlg.close(), a4(a5));
      },
      fn9 = () => fn8("cancel");
    audioProblemDlg.addEventListener("close", fn9), audioProblemPartial.onclick = () => fn8("partial"), document.getElementById("audioProblemNoAudio").onclick = () => fn8("noaudio"), document.getElementById("audioProblemCancel").onclick = () => fn8("cancel"), audioProblemDlg.showModal();
  });
}
function update19() {
  if (!val) return null;
  let items3 = ref17(val, 0, []).map(({
      layer: a,
      offsetMs: a2
    }) => {
      if (apply9(a)) return null;
      let {
        url: res5
      } = obj19(a);
      return res5 ? obj22(a, a2, res5) : null;
    }).filter(Boolean),
    videoAudioMute = document.getElementById("videoAudioMute");
  if (videoAudioMute ? videoAudioMute.checked : true) for (let {
    layer: val3,
    offsetMs: val4,
    key: val5
  } of ref16(val, 0, [])) {
    if (!compute16(val5)) {
      handle9("[EXPORT][AUDIO] Lewati \"" + (val3.label || val3.id) + "\": slot media \"" + val5 + "\" belum berisi file video (terpasang: " + (Y.get(val5) || '-') + ').');
      continue;
    }
    let {
      url: res5
    } = handle11(val5);
    res5 && items3.push(obj22(val3, val4, res5));
  }
  return items3.length ? items3 : null;
}
function build17() {
  let val3 = val ? ref16(val, 0, []) : [];
  xt = val3;
  {
    let arr2 = [...new Set(val3.filter(a => !compute16(a.key)).map(a => a.key + " -> " + (Y.get(a.key) || '-')))];
    arr2.length && handle9("[AUDIO] PERHATIAN: " + arr2.length + " slot video belum berisi file video (diganti gambar contoh), jadi tidak ada suaranya. Tambahkan file mp4 aslinya di tab Media: " + arr2.join(" | "));
  }
  for (let val6 of xt) val6.el = compute15(val6.key);
  jo = [...new Set(val3.map(a => a.key))];
  let val4 = val ? ref17(val, 0, []) : [],
    val5 = val4.length > 0;
  if (bt = val3.length > 0, val5) {
    render18(), render8();
    let items3 = val4.map(({
      layer: a,
      offsetMs: a2
    }) => {
      let val6 = ((a2 + a.startTime) / 1000).toFixed(1) + '-' + ((a2 + a.endTime) / 1000).toFixed(1) + 's';
      return (a.label || a.id || "audio") + '\x20' + val6;
    });
    items3.length && handle9("[AUDIO] Layer audio: " + items3.join(',\x20'));
  } else get8(), bt && render18();
  if (bt) {
    let items3 = val3.map(({
      layer: a,
      offsetMs: a2
    }) => {
      let val6 = ((a2 + a.startTime) / 1000).toFixed(1) + '-' + ((a2 + a.endTime) / 1000).toFixed(1) + 's';
      return (a.label || a.id || a.fillVideo) + '\x20' + val6 + (a.hidden ? " (audio-only)" : '');
    });
    handle9("[AUDIO] Layer video sumber suara: " + items3.join(',\x20'));
  }
  return build16(), handle12({
    force: true
  }), bt;
}
async function handle21() {
  compute9(), await process17(), Te = [], Ie.clear(), handle9("[SCENE] \"" + val.title + '\x22\x20' + val.width + 'x' + val.height + '\x20' + (val.totalTime / 1000).toFixed(2) + "s @ " + val.fps + "fps"), update15(), handle9("[SCENE] " + val.layers.length + " layer, " + val.media.length + " media, " + val.audio.length + " audio, " + val.bookmarks.length + " bookmark"), Ba.textContent = val.title + " - " + val.layers.length + " layer - " + (val.totalTime / 1000).toFixed(1) + 's', val2.setScene(val), val2.setImages(get10());
  let arr2 = [...ref18(val, new Set())];
  handle9("[SCENE] " + arr2.length + " efek unik dipakai preset ini"), compute7('fx', "Menyiapkan efek shader…");
  try {
    let n = 0;
    await val2.loadEffectLibrary(arr2, async a => {
      let val3 = await get15(a);
      return n++, render6('fx', "Menyiapkan efek shader…", n + '/' + arr2.length + '\x20' + String(a).split('.').pop()), val3;
    });
  } finally {
    apply7('fx');
  }
  let arr3 = [...ref19(val, new Set())];
  if (arr3.length) {
    compute7("shape", "Menyiapkan bentuk bawaan…");
    try {
      let n = 0;
      await val2.loadShapeLibrary(arr3, async a => {
        let val3 = await res3(a);
        return n++, render6("shape", "Menyiapkan bentuk bawaan…", n + '/' + arr3.length + '\x20' + a), val3;
      });
    } finally {
      apply7("shape");
    }
  }
  if (compute10(), bind2(), bind8(), Tn) {
    handle29(false), ot = -1, bind16();
    let sTitle = document.getElementById("sTitle");
    sTitle && (sTitle.textContent = val.title || "Preset");
  }
  yt = null, build13(), build17(), update18(), Ai = false;
  let res5 = apply17();
  res5.length && updateClock(res5), Ee.max = String(Math.round(val.totalTime)), H > val.totalTime && (H = 0), Ee.value = String(Math.round(H)), update8(Ee), os = false, getPos(), await val2.prepareMedia(Math.min(H, val.totalTime)), val2.renderAt(Math.min(H, val.totalTime)), getPos(), Mi.textContent = val2.workWidth + 'x' + val2.workHeight + " (canvas " + re.width + 'x' + re.height + ')', si.value = "auto", V = true, process16(), typeof get21 == "function" && get21();
}
var bi = '',
  ft = '',
  wn = '';
function process19(a) {
  let arr2 = [];
  bi && arr2.push("preset: " + bi), ft && arr2.push("audio: " + ft), wn && arr2.push("foto: " + wn), val && arr2.push(val.layers.length + " layer, " + (val.totalTime / 1000).toFixed(1) + "s, " + val.width + 'x' + val.height), a && arr2.push(a), Dc.textContent = arr2.join('\x0a') || "pilih file .xml (boleh 2: preset + grup), audio (mp4 boleh), dan foto sendiri";
}
function compute17(a, b, c) {
  let replace = String(b).replace(/["<>]/g, '');
  return "<scene " + ("width=\"" + c.width + "\" height=\"" + c.height + "\" totalTime=\"" + c.totalTime + "\" fps=\"" + c.fps + "\" bgcolor=\"#00000000\" title=\"" + replace + '\x22') + '>' + a + "</scene>";
}
async function render16(a, b) {
  let arr2 = [];
  compute7("scene", "Menyusun scene…");
  try {
    await Cn();
    let val3,
      str = '';
    if (a >= 0 && Je[a]) {
      let val4 = Je[a];
      str = val4.name, val3 = update2(val4.text, val4.name), val3.title || (val3.title = val4.name.replace(/\.xml$/i, ''));
    } else {
      if (Bt >= 0 && Je[Bt]) {
        let val4 = Je[Bt];
        str = val4.name, val3 = update2(val4.text, val4.name), val3.title || (val3.title = val4.name.replace(/\.xml$/i, ''));
      } else str = Kt, val3 = update2(pi, Kt);
    }
    let n = 0;
    for (let val4 of Ha) if (val4.name !== str) try {
      let res5 = update2(compute17(val4.text, val4.name, val3), val4.name);
      val3.layers.push(...res5.layers);
      for (let val5 of res5.media) val3.media.some(a2 => a2.uri === val5.uri) || val3.media.push(val5);
      n += res5.layers.length;
    } catch (val5) {
      arr2.push(val4.name + ':\x20' + val5.message);
    }
    return handle24(false), val = val3, Bt = a >= 0 ? a : Bt, Y.clear(), fe.clear(), H = 0, build19(0), await handle21(), D && !qe && process10(), val2 && val2.renderAt(0), V = true, bi = '' + str + (Je.length > 1 ? " + " + (Je.length - 1) + " xml lain" : '') + (n ? " + " + n + " layer grup" : ''), process19(arr2.concat(b || []).join('\x0a')), handle9("[IMPORT] \"" + val.title + "\" dimuat: " + val.layers.length + " layer, " + val.media.length + " media, " + val.audio.length + " audio."), true;
  } catch (val3) {
    return process19("gagal memuat: " + val3.message), handle9("[IMPORT] Gagal: " + val3.message), get7("Gagal menyusun scene: " + val3.message), false;
  } finally {
    apply7("scene");
  }
}
async function apply18(a) {
  let arr2 = [...a];
  if (!arr2.length) return;
  compute7("read", "Membaca file XML…");
  let arr3 = [],
    arr4 = [],
    arr5 = [];
  try {
    await Cn();
    let n = 0;
    for (let val5 of arr2) {
      render6("read", "Membaca file XML…", ++n + '/' + arr2.length + '\x20' + val5.name);
      let str = '';
      try {
        str = await val5.text();
      } catch (val6) {
        arr5.push(val5.name + ':\x20' + val6.message);
        continue;
      }
      /<scene[\s>]/.test(str) ? arr3.push({
        name: val5.name,
        text: str
      }) : arr4.push({
        name: val5.name,
        text: str
      });
    }
  } finally {
    apply7("read");
  }
  if (!arr3.length && !arr4.length) {
    process19(arr5.join('\x0a') || "tidak ada XML yang bisa dibaca");
    return;
  }
  Je = arr3, Ha = arr4, Ut.innerHTML = '', arr3.forEach((a2, b) => {
    let optionEl = document.createElement("option");
    optionEl.value = String(b), optionEl.textContent = a2.name, Ut.appendChild(optionEl);
  }), No.style.display = arr3.length > 1 ? '' : "none";
  let val3 = -1,
    val4 = -1;
  arr3.forEach((a2, b) => {
    let val5 = (a2.text.match(/<shape /g) || []).length;
    val5 > val4 && (val4 = val5, val3 = b);
  }), val3 >= 0 && (Ut.value = String(val3)), handle9("[IMPORT] " + arr3.length + " preset + " + arr4.length + " grup XML dibaca."), await render16(val3, arr5);
}
async function get17(a) {
  let arr2 = [...a];
  if (arr2.length) {
    compute7("photo", "Menambah media ke galeri…"), await Cn();
    try {
      let arr3 = [],
        n = 0;
      for (let val3 of arr2) {
        if (n++, /^audio\//.test(val3.type) || /\.(mp3|wav|m4a|aac|ogg)$/i.test(val3.name)) {
          handle22(val3);
          continue;
        }
        let val4 = /^video\//.test(val3.type) || /\.(mp4|webm|ogv|mov|m4v)$/i.test(val3.name),
          val5 = val3.name || "media-" + n;
        for (; Et.has(val5) || Pe.has(val5);) val5 = n + '-' + val5;
        let obj23 = {
          name: val5,
          src: URL.createObjectURL(val3),
          isVideo: val4
        };
        arr3.push(obj23), Et.set(val5, obj23), Xt.push(obj23.src);
      }
      arr3.length && (get9(ce.concat(arr3)), wn = ce.length + " media tersedia (+" + arr3.length + " baru: " + arr3.map(a2 => a2.name).join(',\x20') + ')', process19(), compute10(), bind8(), handle9("[IMPORT] " + arr3.length + " media ditambahkan (total " + ce.length + " media di Galeri)."));
    } finally {
      apply7("photo");
    }
  }
}
async function update20(a, b) {
  let val3 = a.src;
  a.src = URL.createObjectURL(b), a.isVideo = /^video\//.test(b.type) || /\.(mp4|webm|ogv|mov|m4v)$/i.test(b.name), val3.startsWith("blob:") && (URL.revokeObjectURL(val3), Xt = Xt.filter(a2 => a2 !== val3)), Xt.push(a.src), at.delete(val3), await update9("media:replace", "Memuat " + a.name + '…', async () => {
    await apply11(a.name), val2.setImages(get10()), V = true, bind8(), compute10();
  }), wn = ce.length + " media tersedia (terakhir diganti: " + a.name + ')', process19(), handle9("[IMPORT] Media \"" + a.name + "\" diganti manual.");
}
function bind8() {
  if (!ni) return;
  ni.innerHTML = '';
  let galleryCount = document.getElementById("galleryCount"),
    items3 = Pe.list().filter(a => a.kind && !a.isAudio && !ce.some(a2 => a2.name === a.name)),
    arr2 = [...ce.map(a => ({
      ref: a,
      local: true
    })), ...items3.map(a => ({
      ref: a,
      local: false
    }))];
  if (galleryCount && (galleryCount.textContent = arr2.length ? arr2.length + " file" : ''), !arr2.length) {
    ni.innerHTML = "<div class=\"empty\" style=\"grid-column:1/-1\">Belum ada media. Ketuk tombol di atas untuk menambah foto atau video.</div>";
    return;
  }
  let set = new Set(Y.values());
  for (let {
    ref: val3,
    local: val4
  } of arr2) {
    let divEl = document.createElement("div");
    divEl.className = "g-item";
    let res5 = build11(val3.name, val3);
    divEl.appendChild(handle14(val3.name, "g-thumb"));
    let divEl2 = document.createElement("div");
    divEl2.className = "g-badges", res5 && (divEl2.innerHTML += "<span class=\"badge video\">Video</span>"), val4 || (divEl2.innerHTML += "<span class=\"badge\">Link</span>"), set.has(val3.name) && (divEl2.innerHTML += "<span class=\"badge used\">Dipakai</span>"), divEl2.children.length && divEl.appendChild(divEl2);
    let divEl3 = document.createElement("div");
    if (divEl3.className = "g-meta", divEl3.textContent = val3.name, divEl3.title = val3.name, divEl.appendChild(divEl3), val4) {
      let divEl4 = document.createElement("div");
      divEl4.className = "g-actions";
      let labelEl = document.createElement("label");
      labelEl.className = "btn sm", labelEl.innerHTML = ut.upload + "<span>Perbarui file</span>";
      let inputEl = document.createElement("input");
      inputEl.type = "file", inputEl.accept = "image/*,video/*", inputEl.hidden = true, inputEl.addEventListener("change", async a => {
        let val5 = a.target.files[0];
        a.target.value = '', val5 && (await update20(val3, val5).catch(a2 => handle9("[IMPORT] Gagal ganti media: " + a2.message)));
      }), labelEl.appendChild(inputEl), divEl4.appendChild(labelEl), divEl.appendChild(divEl4);
    }
    ni.appendChild(divEl);
  }
}
function handle22(a) {
  if (!a) return;
  let url = URL.createObjectURL(a);
  zt && URL.revokeObjectURL(zt), zt = url, ft = '' + a.name + (/^video\//.test(a.type) ? " (audio dari video)" : ''), ye.has(a.name) || (Me.push({
    name: a.name,
    src: url
  }), ye.set(a.name, url));
  let val3 = val ? ref17(val, 0, [])[0] : null;
  fe.set(val3 ? val3.layer.id || "audio-0" : "main-audio", a.name), val3 || ee.length ? (render8(), handle12({
    force: true
  })) : bind9(url, ft), bind2(), process19(), handle9("[IMPORT] Audio ditambahkan: " + a.name + '\x20(' + (a.type || "tipe tidak dikenal") + ').');
}
async function process20() {
  compute7("reset", "Kembali ke preset contoh…"), await Cn();
  try {
    handle24(false), Je = [], Ha = [], handle13(), Ut.innerHTML = '', No.style.display = "none", Bt = -1, bi = '', ft = '', wn = '';
    for (let val3 of Xt) URL.revokeObjectURL(val3);
    Xt = [], zt && (URL.revokeObjectURL(zt), zt = null), await build15(), Y.clear(), fe.clear(), val = update2(pi, Kt), await handle21(), bind9(co, co.split('/').pop()), bind8(), process19(), handle9("[IMPORT] Kembali ke preset contoh (foto + audio bawaan).");
  } finally {
    apply7("reset");
  }
}
async function ref21(a, b, c = null) {
  let params = new URLSearchParams(c || {});
  params.set("url", b);
  let val3 = await fetch(a + '?' + params.toString()),
    val4 = null;
  try {
    val4 = await val3.json();
  } catch {}
  if (!val3.ok) throw new Error(val4 && val4.error || "HTTP " + val3.status);
  return val4;
}
async function render17() {
  let trim = _o.value.trim();
  if (!trim) {
    Zn.textContent = "isi URL TikTok dulu";
    return;
  }
  va.disabled = true, Zn.textContent = "mengambil...";
  try {
    let val3 = (await ref21("/api/tiktok", trim)).media;
    Zn.textContent = val3, ft = "TikTok: " + trim, bind9(val3, "TikTok " + trim.split('/').pop()), process19(), handle9("[URL] Media TikTok didapat: " + val3);
  } catch (val3) {
    Zn.textContent = "gagal: " + val3.message, handle9("[URL] TikTok gagal: " + val3.message);
  } finally {
    va.disabled = false;
  }
}
async function apply19(a = null) {
  let trim = xa.value.trim();
  if (!trim) {
    Jn.textContent = "isi link Alight Motion dulu";
    return;
  }
  wa.disabled = true, Jn.textContent = "mengambil XML + media...", compute7("xml", "Mengambil XML + media dari link share…");
  try {
    let val3 = await ref21("/api/project-xml", trim, a ? {
        project: a
      } : null),
      val4 = val3.xml;
    render6("xml", "Mendaftarkan media package…", (val3.media || []).length + " file");
    let res5 = build10(val3.media);
    Array.isArray(val3.projects) && val3.projects.length > 1 ? (nt.innerHTML = '', val3.projects.forEach(a2 => {
      let optionEl = document.createElement("option");
      optionEl.value = a2.name, optionEl.textContent = a2.title || a2.name, a2.name === val3.xmlName && (optionEl.selected = true), nt.appendChild(optionEl);
    }), fo.style.display = '') : fo.style.display = "none", Jn.textContent = "XML " + val3.xmlName + '\x20(' + val4.length.toLocaleString("id-ID") + " karakter) + " + res5 + " media", handle9("[URL] XML \"" + val3.xmlName + "\" dari link Alight Motion didapat (" + val4.length + " karakter, " + res5 + " media)."), await apply18([new File([val4], val3.xmlName || "alight-url.xml", {
      type: "application/xml"
    })]);
  } catch (val3) {
    Jn.textContent = "gagal: " + val3.message, handle9("[URL] Alight Motion gagal: " + val3.message), get7("Gagal mengambil link Alight Motion: " + val3.message);
  } finally {
    wa.disabled = false, apply7("xml");
  }
}
async function get18() {
  let trim = Do.value.trim();
  if (!trim) {
    ei.textContent = "isi link Google Drive dulu";
    return;
  }
  Ma.disabled = true, ei.textContent = "mengambil XML dari Drive...", compute7("xml", "Mengambil XML dari Google Drive…");
  try {
    let val3 = await ref21("/api/drive-xml", trim),
      val4 = val3.xml;
    ei.textContent = "XML " + val3.name + '\x20(' + val4.length.toLocaleString("id-ID") + " karakter)", handle9("[DRIVE] XML \"" + val3.name + "\" dari Google Drive didapat (" + val4.length + " karakter)."), await apply18([new File([val4], val3.name || "drive.xml", {
      type: "application/xml"
    })]);
  } catch (val3) {
    ei.textContent = "gagal: " + val3.message, handle9("[DRIVE] gagal: " + val3.message), get7("Gagal mengambil XML dari Google Drive: " + val3.message);
  } finally {
    Ma.disabled = false, apply7("xml");
  }
}
function update21(a) {
  let res5 = String(a || ''),
    match = res5.match(/filename\*=UTF-8''([^;]+)/i),
    match2 = res5.match(/filename="?([^";]+)"?/i),
    val3 = match ? match[1] : match2 ? match2[1] : '';
  if (!val3) return '';
  try {
    return decodeURIComponent(val3).trim();
  } catch {
    return val3.trim();
  }
}
async function build18() {
  let trim = Na.value.trim();
  if (!trim) {
    ti.textContent = "isi link Google Drive dulu";
    return;
  }
  Ta.disabled = true, ti.textContent = "mengambil audio dari Drive...";
  try {
    let params = new URLSearchParams(trim ? {
        url: trim,
        kind: "audio",
        start: '0',
        end: '0'
      } : {}),
      val3 = await fetch("/api/drive-media?" + params.toString());
    if (!val3.ok) {
      let val6 = "HTTP " + val3.status;
      try {
        val6 = (await val3.json()).error || val6;
      } catch {}
      throw new Error(val6);
    }
    let val4 = update21(val3.headers.get("content-disposition")) || "audio dari Drive",
      val5 = "/api/drive-media?url=" + encodeURIComponent(trim) + "&kind=audio";
    ye.has(val4) || Me.push({
      name: val4,
      src: val5
    }), ye.set(val4, val5), fe.set(val && val.audio && val.audio[0] ? val.audio[0].id || "audio-0" : "main-audio", val4), ft = val4 + " (Google Drive)", ti.textContent = "audio " + val4 + " siap dimuat", handle9("[DRIVE] Audio \"" + val4 + "\" dari Google Drive dipakai sebagai track project."), bind9(val5, ft), bind2(), process19();
  } catch (val3) {
    ti.textContent = "gagal: " + val3.message, handle9("[DRIVE] audio gagal: " + val3.message), get7("Gagal mengambil audio dari Google Drive: " + val3.message);
  } finally {
    Ta.disabled = false;
  }
}
function handle23() {
  if (bt) {
    let join3 = jo.join(',\x20');
    return "audio: dari layer video" + (join3 ? '\x20(' + join3 + ')' : '') + " - Putar";
  }
  if (ee.length) {
    let val5 = ee.filter(a => !a.broken && !a.el.paused).length,
      val6 = ee.filter(a => a.broken).length,
      val7 = Q === 1 ? '' : " @ " + Q.toFixed(3) + 'x';
    return "audio: " + ee.length + " layer (" + val5 + " main" + (val6 ? ',\x20' + val6 + " gagal" : '') + ')' + val7 + (flag2 ? " - " + (H / 1000).toFixed(2) + 's' : " - siap");
  }
  if (!D) return "audio: belum dibuat";
  if (qe) return "audio: GAGAL dimuat" + (D.error ? " (kode " + D.error.code + ')' : '') + " - timeline jalan tanpa suara";
  let val3 = Q === 1 ? '' : " @ " + Q.toFixed(3) + 'x',
    val4 = Number.isFinite(D.duration) ? " / " + D.duration.toFixed(2) + 's' : '';
  return D.paused ? "audio: siap" + val4 + " (readyState " + D.readyState + ')' + val3 + " - tekan Putar" : "audio: main @ " + D.currentTime.toFixed(2) + 's' + val4 + " (readyState " + D.readyState + ')' + val3;
}
function process21(a) {
  let trim = String(a || '').trim();
  if (!trim) return '';
  if (ye.has(trim)) return ye.get(trim);
  let res5 = process11(trim);
  if (res5) {
    let val3 = res5.src || res5.url;
    return ye.has(res5.name) || (Me.push({
      name: res5.name,
      src: val3
    }), ye.set(res5.name, val3)), val3;
  }
  return /^[a-z][a-z0-9+.-]*:/i.test(trim) ? '' : Sn + encodeURIComponent(trim);
}
function compute18(a, b) {
  for (let [val3, val4] of ye) if (val4 === a) return val3;
  return b || String(a).split('/').pop();
}
function render18() {
  if (D) {
    try {
      D.pause();
    } catch {}
    D.removeAttribute("src");
    try {
      D.load();
    } catch {}
    D = null;
  }
  qe = false;
}
function bind9(a, b) {
  if (!a) {
    render18();
    return;
  }
  kt = a, sa = b || String(a).split('/').pop(), render18();
  let val3 = ++po;
  compute7("audio", "Memuat audio: " + sa);
  let audio = new Audio(a);
  audio.preload = "auto";
  let fn8 = () => {
    val3 === po && apply7("audio");
  };
  audio.addEventListener("loadeddata", fn8, {
    once: true
  }), audio.addEventListener("canplay", fn8, {
    once: true
  }), audio.addEventListener("error", fn8, {
    once: true
  }), setTimeout(fn8, 30000), audio.addEventListener("error", () => {
    D === audio && (fn8(), qe = true, handle9("[AUDIO] Gagal memuat \"" + sa + '\x22' + (audio.error ? " kode " + audio.error.code : '') + "; timeline jalan tanpa suara."));
  }), audio.addEventListener("canplaythrough", () => {
    D === audio && handle9("[AUDIO] Audio siap diputar.");
  }), audio.addEventListener("ended", () => {
    D === audio && (et || handle24(false));
  }), audio.addEventListener("loadedmetadata", () => {
    if (D !== audio) return;
    render9();
    let res5 = handle10(),
      val4 = audio.duration * 1000;
    if (!Number.isFinite(val4) || val4 <= 0) return;
    let val5 = val4 / res5;
    Math.abs(val4 - res5) > 100 ? (handle9("[SYNC] PERINGATAN: file audio " + (val4 / 1000).toFixed(2) + "s != audio project " + (res5 / 1000).toFixed(2) + "s (selisih " + ((val4 - res5) / 1000).toFixed(2) + "s)."), handle9("[SYNC] Beat tidak akan pernah pas kalau begini. Pakai audio asli dari AM, atau tekan tombol \"Cocokkan kecepatan audio ke project\" (kecepatan " + val5.toFixed(3) + "x).")) : handle9("[SYNC] Durasi audio cocok dengan project.");
  }), D = audio, D.load(), compute8(Q, true), process10(), render9(), handle9("[AUDIO] Sumber: " + new URL(a, location.href).href);
}
async function get19() {
  if (location.protocol === "file:") {
    handle9("Halaman ini harus dibuka lewat web server (bukan file://) karena fetch() diblokir. Jalankan \"npm start\" lalu buka http://localhost:3000/runtime/preset.html"), Ba.textContent = "Buka lewat http://, bukan file://";
    return;
  }
  compute7("boot", "Menyiapkan player…");
  try {
    let params = new URLSearchParams(location.search),
      val3 = params.get("alight") || params.get("url") || params.get("drive") || params.get("project") || params.get("xml") || params.get("preset");
    if (Tn && !val3) {
      val2 = new Lt(re, handle9), val2.effectsEnabled = Ot.checked, val2.debugCanvas = Re, Ge = apply10(), qt = fetch("./effect-index.json").then(a => a.json()), compute19(), handle29(true);
      return;
    }
    if (val3) {
      handle9("[BOOT] Deteksi query parameter (" + val3 + "), membatalkan muat default preset bawaan..."), val2 = new Lt(re, handle9), val2.effectsEnabled = Ot.checked, val2.debugCanvas = Re, Ge = apply10(), qt = fetch("./effect-index.json").then(a => a.json()), process19(), compute19();
      let val4 = /^https?:\/\//i.test(val3) || val3.length >= 25 && !val3.includes('.') ? val3 : "https://alight.link/" + val3;
      await window.AM.loadPreset(val4);
    } else await update22();
  } finally {
    apply7("boot");
  }
}
async function update22() {
  val2 = new Lt(re, handle9), val2.effectsEnabled = Ot.checked, val2.debugCanvas = Re, Ge = apply10(), qt = fetch("./effect-index.json").then(a => a.json()), pi = await (await fetch(ya)).text(), Kt = ya.split('/').pop(), val = update2(pi, Kt), await build15(), handle9("[MEDIA] " + ke.length + " gambar contoh di preset/: " + ke.join(',\x20')), bind8(), await handle21(), !ee.length && !bt && bind9(vt, vt.split('/').pop()), handle9("[SCENE] Siap. Tekan Putar. (" + val2.failedEffects.size + " efek dilewati)");
  let res5 = obj15();
  handle9("[EXPORT] WebCodecs: " + (res5.webcodecs ? "ada" : "TIDAK ada") + (res5.webcodecs ? '' : " -> ekspor pakai MediaRecorder real-time")), handle9("[EXPORT] Audio track (AAC): " + (res5.audioEncoder ? "siap" : "render audio lewat Mediabunny AAC")), Nt.textContent = res5.webcodecs ? "siap - ekspor MP4 H.264 + AAC" : "siap - browser ini tidak punya WebCodecs, fallback hanya WebM real-time", process19(), compute19();
}
var Il = 0,
  os = false;
function build19(a) {
  Il = a, os = false;
}
function handle24(a) {
  if (a && ge) {
    Ht = true, handle9("[LOAD] Tombol Putar masih terkunci sampai proses loading selesai.");
    return;
  }
  if (a && (!val || !val2)) {
    handle9("[LOAD] Player belum siap: scene/renderer belum selesai dibuat.");
    return;
  }
  if (a && apply17().length) {
    Ht = true, ct.has("video") || updateClock(apply17());
    return;
  }
  if (flag2 = a, a && setTimeout(() => {
    if (flag2) try {
      process18("play");
    } catch (val3) {
      handle9("[AUDIO][diag] error: " + (val3 && val3.message));
    }
  }, 900), wi.classList.toggle("is-playing", a), V = true, di.innerHTML = a ? ut.pause + "Jeda" : ut.play + "Putar", val2 && (a ? val2.playMedia(Q) : val2.pauseMedia()), !!val) {
    if (a) H >= val.totalTime - 5 && (H = 0), build19(H), handle12({
      force: true
    });else {
      for (let val3 of ee) try {
        val3.el.pause();
      } catch {}
      D && !qe && D.pause();
    }
  }
}
var To = 0;
async function process22(a) {
  if (!val || ge || (H = Math.max(0, Math.min(val.totalTime, a)), build19(H), handle12({
    force: true
  }), V = true, process16(), flag2 || !val2)) return;
  let val3 = ++To,
    val4 = await val2.prepareMedia(H);
  val3 !== To || flag2 || val4 && val2.renderAt(H);
}
function compute19(a) {
  let val3 = ca ? Math.min(100, a - ca) : 0;
  if (ca = a, flag2 && val && (os = false, Eo = 0, H += val3 * (Q || 1), H >= val.totalTime && (H = et ? H % val.totalTime : val.totalTime, build19(H), et ? handle12({
    force: true
  }) : handle24(false)), flag2 && handle12()), !Rn) {
    let res5 = String(Math.round(H));
    Ee.value !== res5 && (Ee.value = res5, update8(Ee));
  }
  let val4 = 1000 / Ge,
    val5 = !!(val2 && val2.videoFramePending);
  if (val2 && !se && !ge && (flag2 || V || val5) && a - bo >= val4 - 1) {
    bo = a, V = false, val2 && typeof val2.consumeVideoFrame == "function" && val2.consumeVideoFrame();
    let now = performance.now();
    try {
      val2.renderAt(H);
      let val7 = val2.stats.layers + " layer - " + val2.stats.passes + " pass" + (val2.stats.videoPasses ? " - " + val2.stats.videoPasses + " video (" + val2.stats.videoUploads + " upload)" : '') + (val2.stats.videoAudioOnly ? " - " + val2.stats.videoAudioOnly + " audio-only" : '');
      Rt.textContent !== val7 && (Rt.textContent = val7), Rt.style.color !== "rgb(143, 216, 160)" && (Rt.style.color = "#8fd8a0");
    } catch (val7) {
      val7.message !== go && (go = val7.message, handle9("[ERROR] Render: " + val7.message), get7("Render gagal: " + val7.message)), Rt.textContent = val7.message.slice(0, 60), Rt.style.color = "#ff8888", handle24(false);
    }
    let val6 = performance.now() - now;
    for (it = it ? it * 0.8 + val6 * 0.2 : val6, It.push(a); It.length && a - It[0] > 1000;) It.shift();
    la = "fps " + It.length + " (target " + Ge + ") | frame " + it.toFixed(0) + "ms | budget " + val4.toFixed(0) + 'ms', render19(a, val4);
  }
  if (a - ko >= 250) {
    ko = a;
    let val6 = val ? val.totalTime : 0;
    Ac.textContent = (H / 1000).toFixed(2) + "s / " + (val6 / 1000).toFixed(2) + 's', Sc.textContent = handle23(), Bc.textContent = flag2 ? la + " | drift " + Eo.toFixed(0) + 'ms' : la, update17();
  }
  (flag2 || V) && process16(), requestAnimationFrame(compute19);
}
var ma = [960, 640, 480, 360, 270];
function render19(a, b) {
  if (!Ic.checked || !val2 || a - yo < 2000 || it <= b * 1.25) return;
  let indexOf = ma.indexOf(val2.workHeight);
  if (indexOf < 0 || indexOf >= ma.length - 1) return;
  let val3 = ma[indexOf + 1];
  yo = a, it = 0, val2.setResolution(val3), ka.value = String(val3), Mi.textContent = val2.workWidth + 'x' + val2.workHeight + " (canvas " + re.width + 'x' + re.height + ')', getPos(), handle9("[PERF] Ngelag (frame " + it.toFixed(0) + "ms > budget " + b.toFixed(0) + "ms), kualitas diturunkan ke " + val3 + 'p.');
}
di.addEventListener("click", () => handle24(!flag2));
function apply20() {
  if (Dt.value !== "custom") return Number(Dt.value) || 30;
  let number = Number(Io.value);
  return !Number.isFinite(number) || number <= 0 ? 30 : Math.min(120, Math.max(1, number));
}
function get20() {
  return (uo ? uo.value : "h264") === "h265" ? "h265" : "h264";
}
var Pa = '';
function _l(a) {
  let max5 = Math.max(1, Math.round(Number(a) || 0)),
    val3 = val && val.height ? val.width / val.height : 1,
    arr2 = [],
    val4 = val2.gl;
  if (val4 && typeof val4.getParameter == "function") for (let val5 of ["MAX_TEXTURE_SIZE", "MAX_RENDERBUFFER_SIZE"]) {
    let val6 = val4[val5] !== void 0 ? val4.getParameter(val4[val5]) : 0;
    Number.isFinite(val6) && val6 > 0 && arr2.push(val6);
  }
  Pa = '';
  let fn8 = a2 => Math.round(a2 * Math.max(1, val3)),
    max52 = max5;
  if (arr2.length) {
    let min = Math.min(...arr2);
    fn8(max52) > min && (max52 = Math.max(180, Math.floor(min / Math.max(1, val3))), Pa = "GPU hanya mendukung sisi terpanjang " + min + 'px');
  }
  return max52 % 2 && (max52 -= 1), Math.max(180, max52);
}
function update23(a) {
  if (!Number.isFinite(a) || a < 0) return '-';
  let round = Math.round(a / 1000),
    floor = Math.floor(round / 60),
    val3 = round % 60;
  return floor ? floor + 'm\x20' + String(val3).padStart(2, '0') + 's' : val3 + 's';
}
var Dl = "▁▂▃▄▅▆▇█";
function join2(a) {
  if (!a.length) return '';
  let max5 = Math.max(...a),
    min = Math.min(...a),
    max6 = Math.max(1, max5 - min);
  return a.map(a2 => Dl[Math.min(7, Math.round((a2 - min) / max6 * 7))]).join('');
}
function handle25(a) {
  return a ? a < 1048576 ? (a / 1024).toFixed(0) + " KB" : (a / 1048576).toFixed(1) + " MB" : "0 MB";
}
function process23(a) {
  Nt.textContent = a;
}
async function compute20() {
  if (se || ge || !val2 || !val) return;
  se = true, De = false, ae = "running", pt = '', Ze.disabled = true, V = false, flag2 && handle24(false), D && !D.paused && D.pause(), mn.textContent = '', Ve && (URL.revokeObjectURL(Ve), Ve = null), compute7("export", "Mengekspor video…");
  let val3 = val2.workHeight,
    res5 = apply20(),
    val4 = Po.value,
    val5 = val && val.height ? val.width / val.height : 1,
    val6 = val5 < 1,
    val7 = val4 === "same" ? val3 : val6 ? Number(val4) / val5 : Number(val4),
    res6 = _l(val7);
  res6 !== val7 && handle9("[EXPORT] Resolusi diturunkan ke tinggi " + res6 + "px: " + Pa);
  let val8 = Number(Si.value) || 0.08,
    round = Math.round(res6 * val5),
    res7 = update19();
  handle9("[EXPORT][AUDIO] " + (res7 ? res7.length : 0) + " track suara dikumpulkan"), val2.exp && handle9("[EXPORT][EXP] EKSPERIMEN AKTIF: " + val2.exp.active.join(" | "));
  try {
    process18("export");
  } catch (val20) {
    handle9("[AUDIO][diag] error: " + (val20 && val20.message));
  }
  let val9 = !!res7 || !!D || !!kt;
  process23("memeriksa dukungan encoder perangkat…");
  let res8 = get20(),
    val10 = await handle6({
      width: round,
      height: res6,
      bitrate: 6000000,
      fps: res5,
      needAudio: val9,
      codec: res8
    });
  handle9("[EXPORT] Probe: mode=" + val10.mode + ", video.ok=" + val10.video.ok + (val10.video.reason ? '\x20(' + val10.video.reason + ')' : '') + ", audio.diminta=" + val9 + ", audio.ok=" + val10.audio.ok + (val10.audio.reason ? '\x20(' + val10.audio.reason + ')' : ''));
  let val11 = globalThis.AM_DISABLE_FFMPEG_FALLBACK !== true,
    flag3 = false,
    val12 = val9 && val10.audio.ok;
  if (res8 === "h265" && (handle9("[EXPORT] Codec H.265 dipilih: memakai FFmpeg WASM (fallback)."), flag3 = true), val10.mode === "none") {
    if (val11) handle9("[EXPORT] Tidak ada jalur ekspor primer (" + (val10.reason || "tidak didukung") + "); memakai FFmpeg WASM."), flag3 = true;else {
      let val20 = val10.reason || "perangkat ini tidak punya jalur ekspor yang didukung";
      handle9("[EXPORT] Tidak bisa mengekspor: " + val20), ae = "failed", pt = val20, process23("GAGAL: " + val20), get7("Ekspor tidak didukung di perangkat ini: " + val20), se = false, apply7("export"), Ze.disabled = false;
      return;
    }
  } else val10.mode !== "webcodecs" && val9 && val11 && (handle9("[EXPORT] WebCodecs tidak tersedia untuk audio; memakai FFmpeg WASM."), flag3 = true);
  if (val9 && !val10.audio.ok) {
    if (val11) handle9("[EXPORT] WebCodecs audio failed: " + (val10.audio.reason || "encoder audio tidak siap")), handle9("[EXPORT] Falling back to FFmpeg WASM"), val10.mode !== "webcodecs" && (flag3 = true), val12 = val9;else {
      let val20 = val10.audio.reason || "encoder audio tidak siap";
      if (handle9("[EXPORT] Audio diminta tapi tidak didukung: " + val20), !((await get16({
        intro: "Encoder audio (AAC) tidak didukung di perangkat ini. Video bisa tetap diekspor tanpa suara.",
        lines: [val20],
        canPartial: false
      })) === "noaudio")) {
        ae = "cancelled", pt = "dibatalkan user: audio tidak didukung", process23("dibatalkan: audio tidak didukung (" + val20 + ')'), handle9("[EXPORT] Dibatalkan user: audio tidak didukung."), se = false, apply7("export"), Ze.disabled = false;
        return;
      }
      val12 = false, process23("audio tidak didukung - ekspor tanpa audio");
    }
  }
  let ref24 = res7;
  if (val12) {
    process23("memeriksa file audio…");
    let val20 = res7 ? res7.map(a => ({
        url: a.url,
        label: a.label || "layer audio"
      })) : [{
        url: kt,
        label: "Audio project"
      }],
      obj23 = {
        ok: [],
        failed: []
      };
    try {
      obj23 = await ref14(val20, {
        sampleRate: 48000,
        onProgress: a => {
          a.message && process23(a.message);
        },
        isCancelled: () => De
      });
    } catch (val21) {
      handle9("[EXPORT][AUDIO] Preflight error (dilewati): " + (val21 && val21.message));
    }
    if (De) {
      ae = "cancelled", process23("dibatalkan saat memeriksa audio"), compute5(), se = false, apply7("export"), Ze.disabled = false;
      return;
    }
    if (obj23.failed.length) {
      let val21 = obj23.ok.length === 0;
      handle9("[EXPORT][AUDIO] Preflight: " + obj23.failed.length + " sumber gagal, " + obj23.ok.length + " ok");
      for (let val23 of obj23.failed) handle9("[EXPORT][AUDIO] Gagal: " + val23.label + ':\x20' + val23.reason);
      let val22 = await get16({
        intro: val21 ? "Semua sumber audio gagal di-decode di perangkat ini, jadi video akan tanpa suara kalau dilanjutkan. Belum ada frame yang dirender." : obj23.failed.length + " dari " + (obj23.failed.length + obj23.ok.length) + " sumber audio gagal di-decode. Belum ada frame yang dirender.",
        lines: obj23.failed.map(a => '•\x20' + a.label + ':\x20' + a.reason),
        canPartial: !val21
      });
      if (val22 === "cancel") {
        ae = "cancelled", pt = "dibatalkan user: audio gagal di-decode", process23("dibatalkan: audio gagal di-decode"), handle9("[EXPORT] Dibatalkan user: audio gagal di-decode."), compute5(), se = false, apply7("export"), Ze.disabled = false;
        return;
      }
      if (val22 === "noaudio" || val21) val12 = false, compute5(), process23("ekspor tanpa audio"), handle9("[EXPORT][AUDIO] User memilih ekspor tanpa audio.");else {
        let set = new Set(obj23.ok.map(a => a.url));
        ref24 = res7 && res7.filter(a => set.has(a.url)), handle9("[EXPORT][AUDIO] Lanjut dengan " + obj23.ok.length + " sumber; " + obj23.failed.length + " dilewati.");
      }
    }
  }
  handle9("[EXPORT] Mulai: " + round + 'x' + res6 + " @ " + res5 + "fps, codec " + res8.toUpperCase() + ", mode " + (flag3 ? "FFmpeg WASM (fallback)" : val10.mode === "webcodecs" ? "WebCodecs" : "MediaRecorder (real-time)")), val12 && Q !== 1 && handle9(tt.checked ? "[EXPORT] Kecepatan audio " + Q.toFixed(3) + "x: pitch di preview dipertahankan, tapi di file hasil ekspor ikut turun (belum ada time-stretch)." : "[EXPORT] Kecepatan audio " + Q.toFixed(3) + "x dipakai di track audio hasil ekspor."), val2.setResolution(res6), getPos();
  let val13 = val2.workWidth,
    val14 = val2.workHeight,
    min = Math.min(80000000, Math.round(val13 * val14 * res5 * val8)),
    val15 = (val.totalTime || 0) / 1000,
    max5 = Math.max(0, Number(document.getElementById("expStartSec")?.["value"]) || 0),
    number = Number(document.getElementById("expEndSec")?.["value"]),
    val16 = number >= val15 - 0.05 ? val15 : number,
    min2 = Math.min(val.totalTime, max5 * 1000),
    val17 = val16 <= 0 ? val.totalTime : Math.min(val.totalTime, Math.max(min2 + 100, val16 * 1000)),
    max6 = Math.max(100, val17 - min2),
    max7 = Math.max(1, Math.round(max6 / (1000 / res5)) + 1),
    arr2 = [];
  rt.value = 0, rt.max = max7;
  let now = performance.now(),
    val18 = val10.mode !== "webcodecs" && !flag3;
  val2.setMediaMode(val18 ? "preview" : "export");
  let val19 = val2.directVideoEnabled;
  val18 ? val2.playMedia(1) : val2.pauseMedia();
  try {
    let obj23 = {
        canvas: re,
        prepareFrame: val18 ? null : a => val2.prepareMedia(Math.min(a, val.totalTime)),
        renderFrame: a => val2.renderAt(Math.min(a, val.totalTime)),
        startMs: min2,
        endMs: val17,
        fps: res5,
        bitrate: min,
        codec: res8,
        forceFFmpeg: flag3,
        audio: val12 ? {
          tracks: ref24,
          url: ref24 ? '' : kt,
          rate: Q,
          offsetMs: lt,
          inTimeMs: build8(),
          sampleRate: (() => {
            let expAudioSr = document.getElementById("expAudioSr"),
              val23 = expAudioSr ? expAudioSr.value : "auto";
            return val23 === "auto" ? 44100 : Number(val23) || 44100;
          })(),
          bitrate: 128000
        } : null,
        isCancelled: () => De,
        onProgress: a => {
          let val23 = {
            prepare: "Menyiapkan proyek",
            assets: "Memuat aset",
            media: "Memuat media",
            mulai: "Mulai encoding",
            render: "Merender frame",
            encode: "Encoding video",
            audio: "Memproses audio",
            mux: "Menggabungkan (mux)",
            finalize: "Menyelesaikan file",
            fallback: "Fallback FFmpeg",
            selesai: "Selesai",
            batal: "Dibatalkan",
            gagal: "Gagal"
          }[a.phase] || a.phase;
          if (a.phase !== "render" && render6("export", "Mengekspor video…", val23), a.phase === "prepare" || a.phase === "mux" || a.phase === "finalize" || a.phase === "encode") {
            a.message && handle9("[EXPORT] " + val23 + ':\x20' + a.message), process23('' + val23 + (a.message ? " - " + a.message : ''));
            return;
          }
          if (a.phase === "fallback") {
            let val24 = a.message || (a.stage ? '(' + a.stage + ')' : '');
            render6("export", "Mengekspor video…", '' + val23 + (val24 ? " - " + val24 : '')), a.stage === "ffmpeg-core" || a.stage === "ffmpeg-wasm" || a.stage === "encode-progress" || handle9("[EXPORT] " + (val24 || val23)), process23('' + val23 + (val24 ? " - " + val24 : ''));
            return;
          }
          if (a.phase === "mulai") {
            render6("export", "Mengekspor video…", "codec " + a.codec.toUpperCase() + " | " + a.total + " frame"), process23("codec " + a.codec.toUpperCase() + " | " + a.width + 'x' + a.height + " | " + (a.bitrate / 1000000).toFixed(1) + " Mbps | " + a.total + " frame");
            return;
          }
          if (a.phase === "render") {
            render6("export", "Mengekspor video…", "frame " + a.frame + '/' + a.total + '\x20(' + (a.frame / a.total * 100).toFixed(0) + '%)'), arr2.push(a.msPerFrame), arr2.length > 48 && arr2.shift(), rt.value = a.frame;
            let val24 = a.avgMs * (a.total - a.frame),
              val25 = a.frame / a.total * 100;
            process23("frame " + a.frame + '/' + a.total + '\x20(' + val25.toFixed(1) + "%)  " + a.msPerFrame.toFixed(1) + " ms/frame  | total " + (a.elapsedMs / 1000).toFixed(1) + "s  (avg " + a.avgMs.toFixed(1) + ", min " + a.minMs.toFixed(1) + ", max " + a.maxMs.toFixed(1) + ")\nrender " + a.renderFps.toFixed(1) + " fps | " + handle25(a.encodedBytes) + " | ETA " + (a.realtime ? "real-time" : update23(val24)) + '\x0a' + join2(arr2));
            return;
          }
          if (a.phase === "audio") {
            render6("export", "Menyiapkan track audio (AAC)…", a.stage || ''), (a.stage === "skip" || a.stage === "fallback" || a.stage === "gagal" || a.stage === "info") && handle9("[EXPORT][AUDIO] " + a.stage + ':\x20' + (a.message || a.error || ''));
            let val24 = a.total ? '\x20(' + ((a.frames || 0) / a.total * 100).toFixed(0) + '%)' : '',
              val25 = {
                prepare: "menyiapkan audio",
                decode: "membaca file audio",
                render: "memotong audio di grid waktu project",
                encode: "encode AAC",
                ok: "audio siap",
                gagal: "audio GAGAL"
              }[a.stage] || a.stage;
            process23("audio: " + val25 + val24 + (a.packets ? "  | " + a.packets + " paket" : '') + (a.stage === 'ok' ? "  | " + a.channels + "ch " + a.sampleRate + "Hz, " + a.seconds.toFixed(2) + "s, " + handle25(a.bytes) : '') + (a.message ? '\x0a' + a.message : ''));
            return;
          }
        }
      },
      val20;
    try {
      val20 = await res2(obj23);
    } catch (val23) {
      let flag4 = false;
      if (val23.audioFailure && !De && (flag4 = (await get16({
        intro: "Audio gagal diproses di tengah ekspor. Video bisa diulang tanpa suara.",
        lines: [val23.message],
        canPartial: false
      })) === "noaudio"), flag4) handle9("[EXPORT] Audio gagal; user memilih lanjut tanpa audio."), val12 = false, process23("audio gagal - melanjutkan tanpa audio"), val20 = await res2({
        ...obj23,
        audio: null,
        forceFFmpeg: false
      });else throw val23;
    }
    let val21 = performance.now() - now,
      val22 = (val.title || "preset").replace(/[^\w.-]+/g, '_') + '-' + val14 + 'p' + res5 + "fps.mp4";
    if (De || val20.status === "cancelled" || val20.cancelled) ae = "cancelled", process23("dibatalkan di frame " + val20.frames + '\x20(' + update23(val21) + ')'), handle9("[EXPORT] Dibatalkan setelah " + val20.frames + " frame.");else {
      if (val20.status !== "success" || !val20.blob) throw new Error("Ekspor tidak selesai dengan benar (status: " + (val20.status || "tidak diketahui") + ').');
      {
        Ve = URL.createObjectURL(val20.blob);
        let linkEl = document.createElement('a');
        if (linkEl.href = Ve, linkEl.download = val22, linkEl.className = "btn primary block", linkEl.innerHTML = Pt("download", 'sm') + "<span></span>", linkEl.lastChild.textContent = "Unduh " + val22 + '\x20(' + handle25(val20.blob.size) + ')', mn.textContent = '', val20.audio) {
          let videoEl = document.createElement("video");
          videoEl.controls = true, videoEl.playsInline = true, videoEl.preload = "metadata", videoEl.load(), videoEl.addEventListener("loadedmetadata", () => {
            handle9("[PREVIEW] metadata: " + videoEl.videoWidth + 'x' + videoEl.videoHeight + ',\x20' + videoEl.duration.toFixed(2) + 's');
          }), videoEl.addEventListener("canplay", () => {
            handle9("[PREVIEW] canplay");
          }), videoEl.addEventListener("error", () => {
            let val24 = videoEl.error;
            handle9("[PREVIEW] ERROR code=" + val24?.["code"] + " message=" + (val24?.["message"] || '-'));
          }), videoEl.style.touchAction = "pan-y", videoEl.src = Ve;
          let divEl = document.createElement("div");
          divEl.className = "mono";
          let val23 = val20.codec === "h265" ? "H.265" : "H.264";
          divEl.textContent = "preview file hasil ekspor (MP4/" + val23 + " + AAC, " + val20.audio.channels + "ch " + val20.audio.sampleRate + "Hz)", mn.appendChild(videoEl), mn.appendChild(divEl);
        }
        mn.appendChild(linkEl), ae = "success", process23("selesai: " + val20.frames + " frame, " + handle25(val20.blob.size) + ',\x20' + update23(val21) + "\nfile: " + val20.width + 'x' + val20.height + " @ " + val20.fps + "fps, " + (val20.bitrate ? (val20.bitrate / 1000000).toFixed(1) + " Mbps" : '-') + " (diminta " + val13 + 'x' + val14 + ')' + (val20.profile ? "\nper frame: seek video " + val20.profile.prepare.toFixed(0) + " ms | render " + val20.profile.render.toFixed(0) + " | ambil+encode " + val20.profile.encode.toFixed(0) + " | antre " + val20.profile.queue.toFixed(0) : '') + ("\ntrack audio: " + (val20.audio ? "AAC " + val20.audio.channels + "ch " + val20.audio.sampleRate + 'Hz' : "tidak ada") + "\nrata-rata " + (val21 / val20.frames).toFixed(1) + " ms/frame (" + (val20.frames / (val21 / 1000)).toFixed(1) + " frame/detik saat ekspor)\n" + join2(arr2))), val20.profile && handle9("[EXPORT] Profil per frame (ms): " + JSON.stringify(val20.profile, (a, b) => typeof b == "number" ? Math.round(b) : b) + "; file " + val20.width + 'x' + val20.height), handle9("[EXPORT] Selesai: " + val20.frames + " frame, " + handle25(val20.blob.size) + ", codec " + val20.codec + ", mode " + val20.mode + ", audio " + (val20.audio ? "AAC" : "tidak ada") + ',\x20' + update23(val21) + '.');
      }
    }
  } catch (val20) {
    ae = De ? "cancelled" : "failed", pt = val20.message, val20.audioFailure ? (process23("GAGAL (audio): " + val20.message), handle9("[EXPORT] Audio gagal -> ekspor dibatalkan: " + val20.message), get7("Audio diminta, tetapi gagal diproses. Ekspor dibatalkan supaya tidak menghasilkan video tanpa suara.\n\n" + val20.message)) : De ? (process23("dibatalkan: " + val20.message), handle9("[EXPORT] Dibatalkan: " + val20.message)) : (process23("GAGAL: " + val20.message), handle9("[EXPORT] Gagal: " + val20.message), get7("Ekspor gagal: " + val20.message));
  } finally {
    compute5(), se = false, apply7("export"), Ze.disabled = false, val2.directVideoEnabled = val19, val2.setMediaMode("preview"), val2.pauseMedia(), val2.setResolution(val3), getPos(), V = true, Mi.textContent = val2.workWidth + 'x' + val2.workHeight + " (canvas " + re.width + 'x' + re.height + ')';
  }
}
Bo.addEventListener("change", a => {
  let arr2 = [...a.target.files];
  if (a.target.value = '', !val2) {
    handle9("[IMPORT] Harap tunggu renderer selesai diinisialisasi.");
    return;
  }
  apply18(arr2).catch(a2 => handle9("[IMPORT] " + a2.message));
}), Nc.addEventListener("change", a => {
  let arr2 = [...a.target.files];
  a.target.value = '', get17(arr2).catch(a2 => handle9("[IMPORT] " + a2.message));
}), Ut.addEventListener("change", () => {
  render16(Number(Ut.value), []).catch(a => handle9("[IMPORT] " + a.message));
}), _c.addEventListener("click", () => {
  process20().catch(a => handle9("[IMPORT] " + a.message));
}), va.addEventListener("click", () => render17()), wa.addEventListener("click", () => apply19()), nt.addEventListener("change", () => apply19(nt.value)), Ma.addEventListener("click", () => get18()), Do.addEventListener("keydown", a => {
  a.key === "Enter" && get18();
}), document.getElementById("tl-bm").addEventListener("click", () => handle17()), document.getElementById("tl-bm-next").addEventListener("click", () => process15(1)), document.getElementById("tl-bm-prev").addEventListener("click", () => process15(-1)), Ta.addEventListener("click", () => build18()), Na.addEventListener("keydown", a => {
  a.key === "Enter" && build18();
});
function render20(a, b) {
  if (!a) return;
  let val3 = a.getAttribute("data-default") ?? b;
  a.value = String(val3 ?? a.min), a.dispatchEvent(new Event("input", {
    bubbles: true
  }));
}
document.querySelectorAll(".range-reset[data-reset]").forEach(a => {
  a.addEventListener("click", () => render20(document.getElementById(a.dataset.reset), a.dataset.default));
}), document.getElementById("seekReset").addEventListener("click", () => {
  process22(0), handle24(false);
});
var Ul = document.getElementById("expBitrateLabel");
function apply21() {
  let val3 = Number(Si.value) || 0.08,
    val4 = val3 <= 0.05 ? "Burik Enteng" : val3 <= 0.1 ? "Hemat" : val3 <= 0.2 ? "Rendah" : val3 <= 0.35 ? "Sedang" : val3 <= 0.5 ? "Lumayan" : val3 <= 0.75 ? "Jernih" : val3 <= 1 ? "Makan Memory" : val3 <= 1.25 ? "Boros Memory" : val3 <= 1.5 ? "Ketinggian" : val3 <= 2 ? "Ekstrem" : "File Jumbo";
  Ul.textContent = val4 + '\x20(' + val3.toFixed(2) + '×)';
}
Si.addEventListener("input", apply21), apply21();
var me = document.getElementById("expStartSec"),
  he = document.getElementById("expEndSec"),
  Ao = document.getElementById("expStartSecLabel"),
  Co = document.getElementById("expEndSecLabel");
function get21() {
  if (!val) return;
  let val3 = val.totalTime / 1000;
  me && (me.max = val3, me.step = Math.max(0.01, val3 / 1000).toFixed(3)), he && (he.max = val3, he.step = Math.max(0.01, val3 / 1000).toFixed(3), he.value = val3), update24();
}
function update24() {
  let val3 = val && val.totalTime / 1000 || 0,
    val4 = Number(me?.["value"]) || 0,
    val5 = Number(he?.["value"]) || val3;
  Ao && (Ao.textContent = val4.toFixed(1) + '\x20s'), Co && (Co.textContent = val5 >= val3 - 0.05 ? "full" : val5.toFixed(1) + '\x20s'), me && update8(me), he && update8(he);
}
me?.["addEventListener"]("input", () => {
  he && Number(me.value) >= Number(he.value) && (me.value = Math.max(0, Number(he.value) - 0.1)), update24();
}), he?.["addEventListener"]("input", () => {
  me && Number(he.value) <= Number(me.value) && (he.value = Math.min(Number(me.max) || 100, Number(me.value) + 0.1)), update24();
}), document.getElementById("expStartReset")?.["addEventListener"]("click", () => {
  me && (me.value = 0, update24());
}), document.getElementById("expEndReset")?.["addEventListener"]("click", () => {
  let val3 = val && val.totalTime / 1000 || 100;
  he && (he.value = val3, update24());
});
function build20(a) {
  val && process22(Math.max(0, Math.min(val.totalTime, H + a)));
}
var Hl = [["Spasi", "putar / jeda"], ["<- / ->", "mundur / maju 1 frame (Shift 1 detik, Ctrl 10 detik)"], ["Home / End", "ke awal / akhir"], ["+ / -", "zoom timeline"], ['L', "loop"], ['F', "gulir timeline ke playhead"], ['R', "reset posisi ke 0"], ['M', "bisukan suara layer"], ['B', "pasang / buang penanda (bookmark) di posisi ini"], ["N / Shift+N", "lompat ke penanda berikutnya / sebelumnya"]];
{
  let shortcutRows = document.getElementById("shortcutRows");
  shortcutRows && (shortcutRows.innerHTML = Hl.map(([a, a2]) => "<tr><td><kbd>" + te(a) + "</kbd></td><td>" + te(a2) + "</td></tr>").join(''));
}
function handle26(a) {
  if (a.ctrlKey || a.metaKey || a.altKey) return;
  let val3 = a.target,
    val4 = val3 && val3.tagName;
  if (["INPUT", "SELECT", "TEXTAREA", "DIALOG", "BUTTON"].includes(val4) || val3 && val3.isContentEditable || se || !val) return;
  let val5 = 1000 / (val.fps || 30),
    val6 = a.shiftKey ? 1000 : a.ctrlKey || a.metaKey ? 10000 : val5;
  switch (a.key) {
    case '\x20':
    case "Spacebar":
      a.preventDefault(), handle24(!flag2);
      break;
    case "ArrowLeft":
      a.preventDefault(), handle24(false), build20(-val6);
      break;
    case "ArrowRight":
      a.preventDefault(), handle24(false), build20(val6);
      break;
    case "Home":
      a.preventDefault(), build20(-H);
      break;
    case "End":
      a.preventDefault(), process22(val.totalTime);
      break;
    case '+':
    case '=':
      a.preventDefault(), get11(je * 1.5, true);
      break;
    case '-':
    case '_':
      a.preventDefault(), get11(je / 1.5, true);
      break;
    case 'l':
    case 'L':
      a.preventDefault(), ai.click();
      break;
    case 'b':
    case 'B':
      handle17();
      break;
    case 'n':
    case 'N':
      process15(a.shiftKey ? -1 : 1);
      break;
    case 'f':
    case 'F':
      a.preventDefault(), Bn = false, build13(true);
      break;
    case 'r':
    case 'R':
      a.preventDefault(), handle24(false), process22(0);
      break;
    case 'm':
    case 'M':
      {
        let videoAudioMute = document.getElementById("videoAudioMute");
        videoAudioMute && (a.preventDefault(), videoAudioMute.checked = !videoAudioMute.checked, videoAudioMute.dispatchEvent(new Event("change", {
          bubbles: true
        })));
        break;
      }
    default:
      break;
  }
}
window.addEventListener("keydown", handle26), Ze.addEventListener("click", () => compute20()), Ea.addEventListener("click", () => {
  De = true;
}), Dt.addEventListener("change", () => {
  Pc.style.display = Dt.value === "custom" ? '' : "none", Dt.value === "custom" && (Io.value = String(apply20()));
}), jt.addEventListener("input", () => compute8(Number(jt.value), true)), jt.addEventListener("change", () => compute8(Number(jt.value), false)), tt.addEventListener("change", () => compute8(Q, false)), document.getElementById("videoAudioMute")?.["addEventListener"]("change", a => {
  build16(), handle9("[AUDIO] Suara video layer: " + (a.target.checked ? "Unmuted (suara video aktif)" : "Muted (di-bisu)") + (bt ? " - suara project tetap dari layer video" : ''));
}), Fc.addEventListener("click", () => {
  if (!D || !Number.isFinite(D.duration) || D.duration <= 0) {
    handle9("[SYNC] Durasi file audio belum terbaca; tunggu audio siap dulu.");
    return;
  }
  let res5 = handle10(),
    val3 = D.duration * 1000;
  compute8(val3 / res5, true), render9(), handle9("[SYNC] Dicocokkan: file " + (val3 / 1000).toFixed(2) + "s -> project " + (res5 / 1000).toFixed(2) + "s, kecepatan audio " + Q.toFixed(3) + 'x');
}), lo.addEventListener("input", () => {
  lt = Number(lo.value), Rc.textContent = '' + (lt > 0 ? '+' : '') + lt + " ms", process10(), build19(H), V = true;
}), document.getElementById("restart").addEventListener("click", () => {
  process22(0);
}), ai.addEventListener("click", () => {
  et = !et, ai.classList.toggle('on', et), ai.title = et ? "Ulangi otomatis: nyala" : "Ulangi otomatis: mati", Oc.textContent = et ? "Loop" : "Loop mati";
}), Ee.addEventListener("pointerdown", () => {
  Rn = true;
}), Ee.addEventListener("pointerup", () => {
  Rn = false;
}), Ee.addEventListener("pointercancel", () => {
  Rn = false;
}), window.addEventListener("pointerup", () => {
  Rn = false;
}), Ee.addEventListener("input", () => {
  process22(Number(Ee.value));
}), gt.addEventListener("input", () => {
  val2.mediaScale = Number(gt.value), Cc.textContent = Number(gt.value).toFixed(2) + 'x', V = true;
}), si.addEventListener("change", () => {
  val2.sizeScale = si.value === "auto" ? val2.autoSizeScale : Number(si.value), handle9("[SCENE] Ukuran kotak layer: x" + val2.sizeScale + (val2.sizeScale === 2 ? " -> size XML dikali 2, jadi layer yang size-nya setengah layar akan menutupi seluruh layar (efek tile/mirror jadi tidak kelihatan)." : " -> size XML dipakai apa adanya, jadi kotak layer setengah layar kalau size = setengah comp (efek tile/mirror kelihatan).") + " Kalau hasilnya tidak sama dengan AM, tukar pilihannya."), V = true;
}), document.getElementById("debugModeToggle")?.["addEventListener"]("change", a => {
  if (val2) {
    if (val2.debugMode = a.target.checked, !a.target.checked && Re) {
      let ctx = Re.getContext('2d');
      ctx && ctx.clearRect(0, 0, Re.width, Re.height);
    }
    V = true, handle9("[DEBUG] Mode Debug Visual: " + (val2.debugMode ? "AKTIF (border hijau/merah)" : "NONAKTIF"));
  }
});
function process24(a) {
  Ge = apply10(), Gt.value === "custom" && !a && (Ti.value = String(Ge)), it = 0, It.length = 0, handle9("[PERF] Target FPS: " + Ge + (Gt.value === "custom" ? " (custom)" : ''));
}
Gt.addEventListener("change", () => {
  $c.style.display = Gt.value === "custom" ? '' : "none", process24(false);
}), Ti.addEventListener("input", () => {
  Ge = apply10();
}), Ti.addEventListener("change", () => process24(true)), Ot.addEventListener("change", () => {
  val2.effectsEnabled = Ot.checked, handle9("[PERF] Rantai efek: " + (Ot.checked ? 'ON' : "OFF")), V = true;
});
var oe = document.getElementById("debugModeToggle");
{
  let debugModeToggle2 = document.getElementById("debugModeToggle2");
  debugModeToggle2 && oe && (debugModeToggle2.addEventListener("change", () => {
    oe.checked = debugModeToggle2.checked, oe.dispatchEvent(new Event("change"));
  }), oe.addEventListener("change", () => {
    debugModeToggle2.checked = oe.checked;
  }));
}
function compute21() {
  return !!(oe && oe.checked);
}
var st = document.getElementById("debugOverlay"),
  pn = document.getElementById("dbgContent");
document.getElementById("dbgCloseBtn")?.["addEventListener"]("click", () => {
  oe && (oe.checked = false), st && (st.style.display = "none");
});
function _t(a) {
  if (!oe || !oe.checked || !st || !pn) {
    st && (st.style.display = "none");
    return;
  }
  if (st.style.display = "block", !a || !val2) {
    pn.innerHTML = "<div>Pilih layer pada timeline untuk inspect efek & transform.</div>";
    return;
  }
  let val3, val4;
  try {
    let max5 = Math.max(0, H - (a.ce || 0)),
      x = val2.X(a, max5);
    val3 = val2.te(a, x ?? 0, max5 / 1000);
    let se2 = val2.se(a, a.N || val);
    val4 = val2.fe(a, se2);
  } catch (val12) {
    pn.innerHTML = "<div style=\"color:#ff8a8a;\">Gagal baca state layer: " + te(String(val12.message || val12)) + "</div>";
    return;
  }
  let val5 = val3.transform?.["location"] || {
      x: 0,
      y: 0
    },
    val6 = val3.transform?.["scale"] || {
      x: 1,
      y: 1
    },
    val7 = val3.transform?.["angle"] ?? 0,
    val8 = val3.alpha ?? 1,
    val9 = val4?.[0] ?? '?',
    val10 = val4?.[1] ?? '?',
    val11 = "<div style=\"border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:4px;\">\n        <strong style=\"color:var(--accent);\">" + te(a.label || a.id) + "</strong> (" + te(a.tag || "layer") + ")\n        <br><span style=\"color:#aaa;\">Ukuran Content:</span> " + val9 + 'x' + val10 + " px\n        <br><span style=\"color:#aaa;\">Opacity:</span> " + (val8 * 100).toFixed(0) + "%\n        <br><span style=\"color:#aaa;\">Posisi:</span> (" + val5.x.toFixed(1) + ',\x20' + val5.y.toFixed(1) + ") | Rotasi: " + val7.toFixed(1) + "°\n        <br><span style=\"color:#aaa;\">Skala:</span> (" + val6.x.toFixed(2) + ',\x20' + val6.y.toFixed(2) + ")\n    </div>";
  val11 += "<div style=\"font-weight:bold; margin-top:4px; color:#a793ff;\">Rantai Efek & Status:</div>", !a.effects || !a.effects.length ? val11 += "<div style=\"color:#888;\">(Layer ini tidak memiliki efek)</div>" : a.effects.forEach((a2, b) => {
    let get23 = Vt.get(a2.id),
      val12 = a2.disabled || a2.hidden === true || a2.hidden === "true",
      val13 = get23 && get23.name || a2.id;
    val11 += "<div style=\"background:rgba(255,255,255,0.06); padding:4px 6px; border-radius:4px; margin-top:2px; display:flex; justify-content:space-between; align-items:center;\">\n                <div>\n                    <span style=\"color:" + (val12 ? "#ff8a8a" : "#79dc98") + ";\">" + (val12 ? "OFF" : 'ON') + "</span>\n                    <strong>#" + (b + 1) + '\x20' + te(val13) + "</strong>\n                </div>\n                <button type=\"button\" class=\"btn sm dbg-fx-btn\" data-fx-idx=\"" + b + "\" style=\"min-height:22px; padding:0 6px; font-size:10px;\">" + (val12 ? "Aktifkan" : "Matikan") + "</button>\n            </div>";
  }), pn.innerHTML = val11, pn.querySelectorAll(".dbg-fx-btn").forEach(a2 => {
    a2.addEventListener("click", a3 => {
      let number = Number(a3.target.dataset.fxIdx);
      if (a.effects && a.effects[number]) {
        let val12 = a.effects[number].disabled || a.effects[number].hidden === true || a.effects[number].hidden === "true";
        a.effects[number].disabled = !val12, a.effects[number].hidden = !val12, V = true, _t(a), bind6(a, Ya || 0, a.ce || 0);
      }
    });
  });
}
oe?.["addEventListener"]("change", () => {
  if (handle9("[DEBUG] Mode Debug Visual & Inspector: " + (oe.checked ? 'ON' : "OFF")), val2 && (val2.debugMode = oe.checked), !oe.checked && Re) {
    let ctx = Re.getContext('2d');
    ctx && ctx.clearRect(0, 0, Re.width, Re.height);
  }
  V = true, bn ? (_t(bn), bind6(bn, Ya, bn.ce || 0)) : st && (st.style.display = oe.checked ? "block" : "none");
}), ka.addEventListener("change", () => {
  val2.setResolution(Number(ka.value)), Mi.textContent = val2.workWidth + 'x' + val2.workHeight + " (canvas " + re.width + 'x' + re.height + ')', getPos(), V = true;
});
var Lo = document.getElementById("engineHint"),
  pa = document.getElementById("engineRows"),
  rs = [{
    key: "directVideoEnabled",
    label: "Video lewat tekstur GPU",
    hint: "Mati = paksa kanvas 2D (fallback)",
    kind: "bool",
    def: true,
    get: a => a.directVideoEnabled,
    set: (a, b) => {
      a.directVideoEnabled = b;
    }
  }, {
    key: "force2DSubScene",
    label: "Paksa embedScene lewat kanvas 2D",
    kind: "bool",
    def: false,
    get: a => a.force2DSubScene,
    set: (a, b) => {
      a.force2DSubScene = b;
    }
  }, {
    key: "effectsEnabled",
    label: "Jalankan efek shader",
    kind: "bool",
    def: true,
    get: a => a.effectsEnabled,
    set: (a, b) => {
      a.effectsEnabled = b;
    }
  }, {
    key: "overscanMax",
    label: "Batas overscan efek",
    hint: "0-2; makin besar makin boros",
    kind: "num",
    min: 0,
    max: 2,
    step: 0.05,
    def: 0.5,
    get: a => a.overscanMax,
    set: (a, b) => {
      a.overscanMax = b;
    }
  }, {
    key: "mediaScale",
    label: "Skala media global",
    kind: "num",
    min: 0.1,
    max: 4,
    step: 0.05,
    def: 1,
    get: a => a.mediaScale,
    set: (a, b) => {
      a.mediaScale = b;
    }
  }, {
    key: "videoDriftMs",
    label: "Koreksi drift video (ms)",
    kind: "num",
    min: 10,
    max: 2000,
    step: 10,
    def: 300,
    get: a => a.videoDriftMs,
    set: (a, b) => {
      a.videoDriftMs = b;
    }
  }, {
    key: "targetBudgetMB",
    label: "Batas cache FBO (MB)",
    kind: "num",
    min: 32,
    max: 1024,
    step: 16,
    def: 192,
    get: a => Math.round((a.targetBudget || 0) / 1048576),
    set: (a, b) => {
      a.targetBudget = b * 1048576;
    }
  }, {
    key: "forceWebGL1",
    label: "Paksa WebGL1 (GLSL ES 1.00)",
    kind: "bool",
    store: "am.forceWebGL1",
    def: false,
    reload: true
  }, {
    key: "engineAntialias",
    label: "Antialias kanvas",
    kind: "bool",
    store: "am.engineAntialias",
    def: false,
    reload: true
  }, {
    key: "engineOpaque",
    label: "Kanvas opaque (tanpa alpha)",
    kind: "bool",
    store: "am.engineOpaque",
    def: false,
    reload: true
  }, {
    key: "enginePower",
    label: "Power preference GPU",
    kind: "select",
    store: "am.enginePower",
    options: ["high-performance", "low-power", "default"],
    def: "high-performance",
    reload: true
  }];
function render21(a) {
  try {
    return localStorage.getItem(a.store);
  } catch {
    return null;
  }
}
function apply22(a, b) {
  try {
    localStorage.setItem(a.store, b);
  } catch {}
}
function get22(a) {
  if (a.store) {
    let res5 = render21(a);
    return res5 === null ? a.def : a.kind === "bool" ? res5 === '1' : res5;
  }
  return val2 ? a.get(val2) : a.def;
}
function bind10() {
  if (pa) {
    pa.innerHTML = '';
    for (let val3 of rs) {
      let labelEl = document.createElement("label");
      labelEl.className = val3.kind === "bool" ? "check" : "field";
      let val4;
      if (val3.kind === "select") {
        val4 = document.createElement("select");
        for (let val5 of val3.options) {
          let optionEl = document.createElement("option");
          optionEl.value = val5, optionEl.textContent = val5, val4.appendChild(optionEl);
        }
      } else val4 = document.createElement("input"), val4.type = val3.kind === "bool" ? "checkbox" : "number", val3.kind === "num" && (val4.inputMode = "numeric", val4.min = String(val3.min), val4.max = String(val3.max), val4.step = String(val3.step));
      val4.id = "eng-" + val3.key;
      let spanEl = document.createElement("span");
      spanEl.innerHTML = "<b>" + te(val3.label) + (val3.reload ? " <small>(perlu muat ulang)</small>" : '') + "</b>" + (val3.hint ? "<small>" + te(val3.hint) + "</small>" : ''), val3.kind === "bool" && labelEl.appendChild(val4), labelEl.appendChild(spanEl), val3.kind !== "bool" && labelEl.appendChild(val4), val4.addEventListener("change", () => build21(val3, val4)), pa.appendChild(labelEl);
    }
  }
}
function build21(a, b) {
  if (a.store) {
    let val4 = a.kind === "bool" ? b.checked : null;
    apply22(a, a.kind === "bool" ? val4 ? '1' : '0' : b.value), handle9("[ENGINE] " + a.label + ':\x20' + (a.kind === "bool" ? val4 ? 'ON' : "OFF" : b.value) + (a.reload ? " (muat ulang halaman untuk menerapkan)" : ''));
    return;
  }
  if (!val2) return;
  let val3 = a.kind === "bool" ? b.checked : Number(b.value);
  a.kind === "num" && (Number.isFinite(val3) || (val3 = a.def), val3 = Math.max(a.min, Math.min(a.max, val3)), b.value = String(val3)), a.set(val2, val3), a.key === "mediaScale" && typeof gt < 'u' && gt && (gt.value = String(val3), update8(gt)), handle9("[ENGINE] " + a.label + ':\x20' + (a.kind === "bool" ? val3 ? 'ON' : "OFF" : val3)), handle27(), V = true;
}
function handle27() {
  !Lo || !val2 || (Lo.textContent = "WebGL" + val2.webglVersion + " - efek " + (val2.effectsEnabled ? 'ON' : "OFF") + " - video " + (val2.directVideoEnabled ? "tekstur GPU" : "kanvas 2D (fallback)") + " - embedScene " + (val2.force2DSubScene ? "kanvas 2D (fallback)" : "GPU") + " - overscan " + val2.overscanMax + " - media " + val2.mediaScale + "x - drift " + val2.videoDriftMs + "ms - cache FBO " + Math.round((val2.targetBudget || 0) / 1048576) + " MB" + (val2.exp ? " - EKSPERIMEN: " + val2.exp.active.length : ''));
}
function process25() {
  for (let val3 of rs) {
    let element = document.getElementById("eng-" + val3.key);
    if (!element) continue;
    let res5 = get22(val3);
    val3.kind === "bool" ? element.checked = !!res5 : element.value = String(res5);
  }
  handle27(), typeof build22 == "function" && build22();
}
document.getElementById("engineReset")?.["addEventListener"]("click", () => {
  for (let val3 of rs) val3.store ? apply22(val3, val3.kind === "bool" ? val3.def ? '1' : '0' : val3.def) : val2 && val3.set(val2, val3.def);
  process25(), handle9("[ENGINE] Konfigurasi renderer dikembalikan ke bawaan."), V = true;
});
var ga = document.getElementById("expRows"),
  ba = document.getElementById("expCats"),
  Fo = document.getElementById("expHint"),
  xi = document.getElementById("exp-enabled"),
  jl = {
    identical: "identik",
    edges: "beda di tepi",
    visible: "tampilan berubah"
  };
function compute22() {
  build4(le), val2 && val2.setExperimental(handle4(le)), V = true, render22(), handle27();
}
function render22() {
  if (!Fo) return;
  let val3 = val2 && val2.exp;
  Fo.textContent = val3 ? "EKSPERIMEN AKTIF: " + val3.active.join(" | ") + " - efek dilewati: " + (val2.W ? val2.W.skipped : 0) : "Eksperimen mati (perilaku normal)";
}
function bind11() {
  if (ga) {
    ga.innerHTML = '';
    for (let val3 of Vi) {
      let labelEl = document.createElement("label");
      labelEl.className = val3.kind === "bool" ? "check" : "field";
      let val4;
      if (val3.kind === "select") {
        val4 = document.createElement("select");
        for (let val5 of val3.options) {
          let optionEl = document.createElement("option");
          optionEl.value = val5, optionEl.textContent = val5, val4.appendChild(optionEl);
        }
      } else val4 = document.createElement("input"), val4.type = val3.kind === "bool" ? "checkbox" : "number", val3.kind === "num" && (val4.inputMode = "decimal", val4.min = String(val3.min), val4.max = String(val3.max), val4.step = String(val3.step));
      val4.id = "exp-" + val3.key;
      let spanEl = document.createElement("span");
      spanEl.innerHTML = "<b>" + te(val3.label) + " <small>[" + te(jl[val3.fidelity] || val3.fidelity) + "]</small></b>" + (val3.hint ? "<small>" + te(val3.hint) + "</small>" : ''), val3.kind === "bool" && labelEl.appendChild(val4), labelEl.appendChild(spanEl), val3.kind !== "bool" && labelEl.appendChild(val4), val4.addEventListener("change", () => {
        if (val3.kind === "bool") le[val3.key] = val4.checked;else {
          if (val3.kind === "num") {
            let number = Number(val4.value);
            Number.isFinite(number) || (number = $t[val3.key]), number = Math.max(val3.min, Math.min(val3.max, number)), val4.value = String(number), le[val3.key] = number;
          } else le[val3.key] = val4.value;
        }
        compute22();
      }), ga.appendChild(labelEl);
    }
  }
}
function ref22() {
  let obj23 = {};
  if (val2 && val2.programs) for (let val3 of val2.programs.values()) {
    let val4 = val3.definition && val3.definition.category || "other";
    obj23[val4] = (obj23[val4] || 0) + 1;
  }
  return obj23;
}
function bind12() {
  if (!ba) return;
  let res5 = ref22();
  ba.innerHTML = '';
  for (let val3 of _s) {
    let labelEl = document.createElement("label");
    labelEl.className = "check";
    let inputEl = document.createElement("input");
    inputEl.type = "checkbox", inputEl.id = "exp-cat-" + val3, inputEl.checked = le.categorySet.includes(val3), inputEl.addEventListener("change", () => {
      let set = new Set(le.categorySet);
      inputEl.checked ? set.add(val3) : set.delete(val3), le.categorySet = [...set], compute22();
    });
    let spanEl = document.createElement("span"),
      val4 = val3 === "matte" || val3 === "opacity" ? " <small>(ubah komposisi)</small>" : '';
    spanEl.innerHTML = "<b>" + te(val3) + '\x20(' + (res5[val3] || 0) + ")</b>" + val4, labelEl.appendChild(inputEl), labelEl.appendChild(spanEl), ba.appendChild(labelEl);
  }
}
function build22() {
  xi && (xi.checked = !!le.enabled);
  for (let val3 of Vi) {
    let element = document.getElementById("exp-" + val3.key);
    element && (val3.kind === "bool" ? element.checked = !!le[val3.key] : element.value = String(le[val3.key]));
  }
  bind12(), render22();
}
xi?.["addEventListener"]("change", () => {
  le.enabled = xi.checked, compute22();
});
for (let [val3, val4] of [["expPresetAman", "aman"], ["expPresetCepat", "cepat"], ["expPresetEkstrem", "ekstrem"], ["expPresetProfil", "profil"]]) document.getElementById(val3)?.["addEventListener"]("click", () => {
  let val5 = Os[val4];
  le = {
    ...$t,
    ...val5,
    categorySet: [...(val5.categorySet || [])],
    enabled: true
  }, build22(), compute22(), handle9("[EXP] Preset " + val4 + " diterapkan.");
});
document.getElementById("expReset")?.["addEventListener"]("click", () => {
  le = {
    ...$t,
    categorySet: []
  }, build22(), compute22(), handle9("[EXP] Eksperimen direset (mati).");
}), document.getElementById("expProfReset")?.["addEventListener"]("click", () => {
  val2 && val2.resetProfile(), handle9("[EXP] Profil direset.");
}), document.getElementById("expProfCopy")?.["addEventListener"]("click", async () => {
  let val3 = val2 ? val2.profileSummary() : null;
  if (!val3) {
    handle9("[EXP] Belum ada profil: aktifkan Profiler lalu putar/ekspor beberapa frame.");
    return;
  }
  let stringify = JSON.stringify(val3, null, 2);
  try {
    await navigator.clipboard.writeText(stringify), handle9("[EXP] Profil disalin ke clipboard.");
  } catch {
    handle9("[EXP] Clipboard ditolak, profil:\n" + stringify);
  }
}), bind10(), bind11(), build22(), bind7(), document.addEventListener("input", a => {
  a.target && a.target.type === "range" && update8(a.target);
}), document.querySelectorAll("input[type=range]").forEach(update8);
var vr = document.getElementById("settingsDlg");
function some(a) {
  return document.cookie.split(';\x20').some(a2 => a2.startsWith(a + '='));
}
function process26(a, b, c) {
  document.cookie = encodeURIComponent(a) + '=' + encodeURIComponent(b) + "; Max-Age=" + c + "; Path=/; SameSite=Lax";
}
function bind13() {
  let modeToggleBtn = document.getElementById("modeToggleBtn"),
    simpleHint = document.getElementById("simpleHint"),
    simpleHintClose = document.getElementById("simpleHintClose");
  if (!modeToggleBtn || !simpleHint || document.documentElement.classList.contains("simple")) return;
  let str = "am_simple_hint_seen",
    fn8 = () => {
      simpleHint.hidden = true, process26(str, '1', 3600 * 24 * 365);
    };
  some(str) || (simpleHint.hidden = false), simpleHintClose?.["addEventListener"]("click", a => {
    a.stopPropagation(), fn8();
  }), modeToggleBtn.addEventListener("click", () => {
    fn8(), build24(true);
  });
}
document.getElementById("openSettings").addEventListener("click", () => {
  process25(), vr.showModal();
}), bind13();
for (let val3 of document.querySelectorAll("dialog")) val3.addEventListener("click", a => {
  a.target === val3 && val3.close();
}), val3.querySelectorAll("[data-close]").forEach(a => a.addEventListener("click", () => val3.close()));
document.getElementById("lightbox").addEventListener("close", () => {
  document.getElementById("lightboxBody").innerHTML = '';
}), document.getElementById("hdrOpen").addEventListener("click", () => Bo.click()), wi.addEventListener("click", a => {
  a.target.closest("#stageBusy, .stage-btn") || handle24(!flag2);
}), document.getElementById("stageBtnSize").addEventListener("click", a => {
  a.stopPropagation(), document.body.classList.toggle("stage-big");
}), typeof ResizeObserver == "function" && new ResizeObserver(() => getPos()).observe(wi);
var vn = 0;
function replaceMediaForLayer(a, file2) {
  if (!a || !file2 || a.fillType !== "media") return;
  let uri2 = a.fillVideo || a.fillImage,
    slot2 = (val.media || []).find(a3 => a3.uri === uri2);
  if (!slot2) throw new Error("Slot media untuk layer \"" + (a.label || a.id) + "\" tidak ditemukan");
  let name2 = file2.name,
    url2 = URL.createObjectURL(file2),
    newUri2 = "am:user:" + Date.now() + ":" + Math.floor(Math.random() * 1e5),
    isVid2 = /\.(mp4|webm|ogv|mov|m4v)$/i.test(name2);
  Et.set(name2, {
    name: name2,
    src: url2
  }), ce.push(Et.get(name2)), ke.includes(name2) || ke.push(name2), Y.set(newUri2, name2), val.media.push({
    uri: newUri2,
    type: file2.type || (isVid2 ? "video/mp4" : "image/png"),
    filename: name2,
    title: name2,
    duration: 0,
    width: 0,
    height: 0,
    orientation: 0
  }), isVid2 ? (a.fillVideo = newUri2, a.fillImage = '') : (a.fillImage = newUri2, a.fillVideo = '');
  return apply11(name2).then(() => {
    val2.setImages(get10()), V = true, compute10(), bind8(), handle9("[REPLACE] Layer \"" + (a.label || a.id) + "\" diganti (khusus layer ini): " + name2);
    return true;
  }).catch(a3 => {
    handle9("[REPLACE] " + a3.message);
    return false;
  });
}
var ctxTarget = null,
  ctxMenu = null,
  ctxInput = null;
function closeLayerCtx() {
  ctxMenu && (ctxMenu.remove(), ctxMenu = null), ctxTarget = null;
}
function cloneLayerSafe(layer) {
  try {
    return structuredClone(layer);
  } catch (e) {
    return JSON.parse(JSON.stringify(layer));
  }
}
function splitLayerAt(layer) {
  const arr = findParentArray(layer);
  if (!arr) return handle9("[EDIT] split: urutan layer tidak ditemukan");
  const s = layer.startTime || 0,
    e = layer.endTime != null ? layer.endTime : (val.totalTime || 0),
    t = H;
  if (t <= s + 50 || t >= e - 50) return handle9("[EDIT] split: geser playhead dulu ke dalam layer (±50ms dari ujung)");
  const snap = sceneSnapshot(), copy = cloneLayerSafe(layer);
  copy.startTime = t, layer.endTime = t;
  const i = arr.indexOf(layer);
  i >= 0 && arr.splice(i + 1, 0, copy);
  pushUndo(snap), V = true;
  handle9("[EDIT] Split \"" + (layer.label || layer.id) + "\" di " + Math.round(t) + " ms");
  bind4(), val2 && val2.renderAt(H);
}
function duplicateLayer(layer) {
  const arr = findParentArray(layer);
  if (!arr) return;
  const snap = sceneSnapshot(), copy = cloneLayerSafe(layer);
  const i = arr.indexOf(layer);
  i >= 0 ? arr.splice(i + 1, 0, copy) : arr.push(copy);
  pushUndo(snap), V = true;
  handle9("[EDIT] Duplikat layer \"" + (layer.label || layer.id) + "\"");
  bind4(), val2 && val2.renderAt(H);
}
function deleteLayer(layer) {
  const arr = findParentArray(layer);
  if (!arr) return;
  const i = arr.indexOf(layer);
  if (i < 0) return;
  const snap = sceneSnapshot();
  arr.splice(i, 1), pushUndo(snap), V = true;
  handle9("[EDIT] Hapus layer \"" + (layer.label || layer.id) + "\"");
  bind4(), val2 && val2.renderAt(H);
}
function openLayerCtx(a, x2, y2) {
  closeLayerCtx(), ctxTarget = a;
  let menu = document.createElement("div");
  menu.className = "tl-ctx", menu.style.left = Math.max(4, Math.min(x2, innerWidth - 220)) + 'px', menu.style.top = Math.max(4, Math.min(y2, innerHeight - 220)) + 'px';
  const add = (label, fn) => {
    const b = document.createElement("button");
    b.type = "button", b.textContent = label;
    b.addEventListener("click", () => {
      closeLayerCtx();
      try { fn(); } catch (e) { handle9("[EDIT] " + e.message); }
    });
    menu.appendChild(b);
  };
  if (a.fillType === "media") add("Ganti foto/video…", () => {
    ctxInput || (ctxInput = document.createElement("input"), ctxInput.type = "file", ctxInput.accept = "image/*,video/*", ctxInput.classList.add("tl-ctx-input"), ctxInput.style.display = "none", ctxInput.addEventListener("change", () => {
      let f = ctxInput.files && ctxInput.files[0];
      if (f) replaceMediaForLayer(a, f).then(() => ctxInput.value = '');
    }), document.body.appendChild(ctxInput));
    ctxTarget = a, ctxInput.click();
  });
  add("Split di playhead", () => splitLayerAt(a));
  add("Duplikat layer", () => duplicateLayer(a));
  add("Hapus layer", () => deleteLayer(a));
  document.body.appendChild(menu), ctxMenu = menu, setTimeout(() => {
    let once = () => {
      closeLayerCtx(), window.removeEventListener("pointerdown", once), window.removeEventListener("scroll", once, true), window.removeEventListener("contextmenu", once);
    };
    window.addEventListener("pointerdown", once), window.addEventListener("scroll", once, true), window.addEventListener("contextmenu", once);
  }, 0);
}
(function injectFeatureStyles() {
  if (document.getElementById("om-feature-style")) return;
  const s = document.createElement("style");
  s.id = "om-feature-style";
  s.textContent = `
.tl-track.tl-drop { outline: 2px dashed var(--accent); outline-offset: -2px; border-radius: 8px; box-shadow: inset 0 0 0 999px rgba(31,200,238,.08); }
.tl-ctx { position: fixed; z-index: 9999; background: var(--card); border: 1px solid var(--line2); border-radius: 10px; padding: 4px; box-shadow: 0 8px 24px rgba(0,0,0,.5); min-width: 200px; }
.tl-ctx button { display: block; width: 100%; text-align: left; background: none; border: 0; color: var(--text); padding: 8px 10px; border-radius: 6px; cursor: pointer; font-size: 13px; }
.tl-ctx button:hover { background: var(--card2); color: var(--accent); }
.tl-edge { position: absolute; top: 0; bottom: 0; width: 9px; cursor: col-resize; touch-action: none; z-index: 3; }
.tl-edge-l { left: 0; }
.tl-edge-r { right: 0; }
.tl-edge:hover, .tl-edge:active { background: rgba(31,200,238,.4); }
.tl-track.tl-reorder { outline: 2px dashed var(--accent); outline-offset: -2px; opacity: .92; box-shadow: 0 6px 18px rgba(0,0,0,.45); }
.tl-block { cursor: move; touch-action: none; }
.tl-label { cursor: grab; touch-action: none; }
.tl-label:active { cursor: grabbing; }`;
  document.head.appendChild(s);
})();
(function bindTimelineWheelZoom() {
  const wrap = document.getElementById("timeline-wrap");
  if (!wrap || wrap.__zoomWheel) return;
  wrap.__zoomWheel = true;
  wrap.addEventListener("wheel", e => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    get11(je * (e.deltaY < 0 ? 1.25 : 0.8), true);
  }, { passive: false });
})();
window.addEventListener("dragenter", a => {
  a.dataTransfer && [...a.dataTransfer.types].includes("Files") && (vn++, document.body.classList.add("dragging"));
}), window.addEventListener("dragleave", () => {
  vn = Math.max(0, vn - 1), vn || document.body.classList.remove("dragging");
}), window.addEventListener("dragover", a => a.preventDefault()), window.addEventListener("drop", a => {
  a.preventDefault(), vn = 0, document.body.classList.remove("dragging");
  let arr2 = [...(a.dataTransfer && a.dataTransfer.files || [])];
  if (!arr2.length || !val2) return;
  let items3 = arr2.filter(a2 => /\.xml$/i.test(a2.name) || /xml/.test(a2.type)),
    items4 = arr2.filter(a2 => !items3.includes(a2));
  (async () => {
    items3.length && (await apply18(items3)), items4.length && (await get17(items4));
  })().catch(a2 => handle9("[IMPORT] " + a2.message));
}), function bindTracksCtx() {
  let tracksButton = document.getElementById("timeline-tracks");
  if (!tracksButton || tracksButton.__ctxBound) return;
  tracksButton.__ctxBound = true;
  tracksButton.addEventListener("contextmenu", a => {
    let trackEl2 = a.target && a.target.closest && a.target.closest(".tl-track"),
      layerEl2 = trackEl2 && trackEl2.__layer;
    if (!layerEl2) return;
    a.preventDefault(), a.stopPropagation(), openLayerCtx(layerEl2, a.clientX, a.clientY);
  });
}();
var undoStack = [], redoStack = [];
function sceneSnapshot() {
  if (!val) return null;
  try {
    return structuredClone(val);
  } catch (e) {
    try {
      return JSON.parse(JSON.stringify(val));
    } catch (e2) {
      return null;
    }
  }
}
function pushUndo(snap) {
  if (!snap) return;
  undoStack.push(snap), undoStack.length > 60 && undoStack.shift(), redoStack.length = 0;
}
function applySceneSnapshot(s) {
  if (!val || !s) return false;
  for (const k of Object.keys(val)) delete val[k];
  for (const k of Object.keys(s)) val[k] = s[k];
  try {
    val2 && val2.setScene(val);
  } catch {}
  try {
    val2 && val2.setImages(get10());
  } catch {}
  V = true;
  try {
    bind4(), compute10(), bind8();
  } catch {}
  try {
    val2 && val2.renderAt(H);
  } catch {}
  return true;
}
function findParentArray(layer) {
  if (!layer || !val) return null;
  if (val.layers && val.layers.indexOf(layer) >= 0) return val.layers;
  let found = null;
  const walk = scene => {
    if (found || !scene || !scene.layers) return;
    if (scene.layers.indexOf(layer) >= 0) {
      found = scene.layers;
      return;
    }
    for (const l of scene.layers) if (l.scene) walk(l.scene);
  };
  return walk(val), found;
}
function undoScene() {
  if (!undoStack.length) return handle9("[UNDO] tidak ada langkah untuk dibatalkan");
  const cur = sceneSnapshot(), prev = undoStack.pop();
  cur && redoStack.push(cur), applySceneSnapshot(prev), handle9("[UNDO] batalkan (" + undoStack.length + " tersisa)");
}
function redoScene() {
  if (!redoStack.length) return handle9("[REDO] tidak ada langkah untuk diulang");
  const cur = sceneSnapshot(), next = redoStack.pop();
  cur && undoStack.push(cur), applySceneSnapshot(next), handle9("[REDO] ulangi (" + redoStack.length + " tersisa)");
}
window.addEventListener("keydown", a => {
  if (!(a.ctrlKey || a.metaKey)) return;
  const k = (a.key || "").toLowerCase();
  if (k !== "z" && k !== "y") return;
  const tgt = a.target, tn = tgt && tgt.tagName;
  if (["INPUT", "SELECT", "TEXTAREA"].includes(tn) || tgt && tgt.isContentEditable) return;
  a.preventDefault(), (k === "y" || a.shiftKey) ? redoScene() : undoScene();
});
ui.addEventListener("change", build7), build7(), _a("proyek"), window.addEventListener("error", a => {
  !a || !a.message || (handle9("[ERROR] " + a.message), get7(a.message));
}), window.addEventListener("unhandledrejection", a => {
  let val3 = a && a.reason,
    val4 = val3 && val3.message ? val3.message : String(val3);
  handle9("[ERROR] " + val4), get7(val4);
}), window.AM = {
  async waitReady(a = 60000) {
    let now = Date.now();
    for (; ge;) {
      if (Date.now() - now > a) throw new Error("Timeout waiting for player idle");
      await new Promise(a2 => setTimeout(a2, 50));
    }
    return this.getState();
  },
  getState() {
    return {
      isBusy: !!ge,
      busyLabel: fi ? fi.textContent : '',
      busyDetail: yn ? yn.textContent : '',
      title: val ? val.title || Kt : '',
      width: val ? val.width : 0,
      height: val ? val.height : 0,
      durationMs: val ? val.totalTime : 0,
      fps: val && val.fps || 30,
      hasAudio: !!(D && !qe),
      exporting: !!se,
      availableProjects: this.getAvailableProjects()
    };
  },
  stopDefaultLoad() {
    if (typeof update18 == "function" && update18(), D) {
      try {
        D.pause();
      } catch {}
      D = null;
    }
    apply7("boot"), apply7("xml"), apply7("media"), apply7('fx'), apply7("video"), apply7("audio"), handle9("[AM] Default preset load cancelled for automation.");
  },
  async loadFont(a, b) {
    if (!a) throw new Error("Nama font tidak boleh kosong");
    let str = '';
    if (typeof b == "string") str = b;else {
      if (b instanceof File || b instanceof Blob) str = URL.createObjectURL(b);else throw new Error("Sumber font tidak valid");
    }
    let replace = a.replace(/\.[^/.]+$/, ''),
      fontFace = new FontFace(replace, "url(\"" + str + '\x22)');
    return await fontFace.load(), document.fonts.add(fontFace), val2 && (val2.customFonts.set(replace, replace), val2.customFonts.set(a, replace), V = true), handle9("[FONT] Font kustom \"" + replace + "\" berhasil dimuat."), {
      success: true,
      family: replace
    };
  },
  async loadPreset(a, b = null) {
    if (this.stopDefaultLoad(), await this.waitReady(), typeof a == "string") {
      let trim = a.trim();
      if (/\.xml$/i.test(trim) || trim.startsWith("blob:") || trim.startsWith("data:")) {
        let val3 = await fetch(trim);
        if (!val3.ok) throw new Error("HTTP " + val3.status + " fetching XML");
        let val4 = await val3.text(),
          file = new File([val4], "preset.xml", {
            type: "text/xml"
          });
        await apply18([file]);
      } else trim.includes("drive.google.com") || trim.includes("/api/drive-xml") || /^[a-zA-Z0-9_-]{25,50}$/.test(trim) ? await get18(trim) : (xa.value = trim, await apply19(b));
    } else {
      if (a instanceof File) await apply18([a]);else throw new Error("Invalid preset source: must be URL string or File object");
    }
    return await this.waitReady(), this.getState();
  },
  getAvailableProjects() {
    return !nt || nt.options.length === 0 ? [] : [...nt.options].map(a => ({
      name: a.value,
      title: a.textContent,
      selected: a.selected
    }));
  },
  async selectProject(a) {
    if (await this.waitReady(), !xa.value) throw new Error("Belum ada link Alight Motion yang dimuat");
    return nt.value = a, await apply19(a), await this.waitReady(), this.getState();
  },
  getMediaSlots() {
    return val ? (val.media || []).filter(a => {
      let toLowerCase = (a.type || '').toLowerCase();
      return toLowerCase.startsWith("audio") ? false : toLowerCase.startsWith("image") || toLowerCase.startsWith("video") || !!a.uri;
    }).map((a, b) => {
      let val3 = Y.get(a.uri) || ke && ke[0] || a.uri,
        val4 = at.get(val3) || (val2 && val2.images ? val2.images.get(val3) : null),
        str = '';
      if (val4) try {
        if (val4.tagName === "IMG" && val4.src) str = val4.src;else {
          if (val4.tagName === "VIDEO") {
            let canvasEl = document.createElement("canvas");
            canvasEl.width = val4.videoWidth || 160, canvasEl.height = val4.videoHeight || 90;
            let ctx = canvasEl.getContext('2d');
            ctx && val4.readyState >= 2 && (ctx.drawImage(val4, 0, 0, canvasEl.width, canvasEl.height), str = canvasEl.toDataURL("image/jpeg", 0.6));
          }
        }
      } catch {}
      let startsWith = (a.type || '').toLowerCase().startsWith("video");
      return {
        index: b,
        id: a.uri || "slot-" + b,
        name: val3,
        type: startsWith ? "video" : "image",
        previewUrl: str,
        isReplaceable: true
      };
    }) : [];
  },
  async applyMedia(a, b) {
    if (await this.waitReady(), !val) throw new Error("No scene loaded");
    let getMediaSlots = this.getMediaSlots(),
      val3 = null;
    if (typeof a == "number" ? val3 = getMediaSlots[a] : val3 = getMediaSlots.find(a2 => a2.id === a || a2.name === a), !val3) throw new Error("Slot media \"" + a + "\" tidak ditemukan");
    let val4 = null;
    if (b instanceof File) val4 = b;else {
      if (b instanceof Blob) val4 = new File([b], val3.name, {
        type: b.type || "image/png"
      });else {
        if (typeof b == "string") {
          if (b.startsWith("data:") || b.startsWith("blob:")) {
            let val5 = await (await fetch(b)).blob();
            val4 = new File([val5], val3.name, {
              type: val5.type || "image/png"
            });
          } else {
            let val5 = await fetch(b);
            if (!val5.ok) throw new Error("HTTP " + val5.status + " fetching media URL");
            let val6 = await val5.blob();
            val4 = new File([val6], val3.name, {
              type: val6.type || "image/png"
            });
          }
        }
      }
    }
    if (!val4) throw new Error("Invalid media input");
    let obj23 = {
      name: val4.name,
      src: URL.createObjectURL(val4)
    };
    return Et.set(val4.name, obj23), ce.push(obj23), ke.includes(val4.name) || ke.push(val4.name), Y.set(val3.id, val4.name), await update9("media:pick", "Memuat " + val4.name + '…', async () => {
      await apply11(val4.name), val2.setImages(get10()), V = true;
    }), compute10(), bind8(), await this.waitReady(), {
      success: true,
      slotId: val3.id
    };
  },
  async setAudio(a) {
    if (await this.waitReady(), typeof a == "string") {
      let trim = a.trim();
      trim.includes("tiktok.com") || trim.includes("/api/tiktok") ? (_o.value = trim, await render17()) : trim.includes("drive.google.com") || trim.includes("/api/drive-media") ? (Na.value = trim, await build18()) : bind9(trim, trim.split('/').pop());
    } else {
      if (a instanceof File || a instanceof Blob) {
        let url = URL.createObjectURL(a),
          val3 = a.name || "custom-audio.mp3";
        Me.push({
          name: val3,
          src: url
        }), ye.set(val3, url), bind9(url, val3);
      } else throw new Error("Invalid audio input");
    }
    return await this.waitReady(), {
      success: true,
      audioSrc: kt
    };
  },
  $e: [],
  onLog(a) {
    typeof a == "function" && this.$e.push(a);
  },
  getRenderProgress() {
    let obj23 = {
      status: ae,
      error: pt || null,
      statsText: Nt ? Nt.textContent : ''
    };
    if (!se) return {
      exporting: false,
      progressPct: ae === "success" ? 100 : 0,
      currentFrame: 0,
      totalFrames: 0,
      phase: ae === "idle" ? "idle" : ae,
      ...obj23
    };
    let val3 = Number(rt.max) || 1,
      val4 = Number(rt.value) || 0;
    return {
      exporting: true,
      phase: "running",
      progressPct: Math.min(100, Math.round(val4 / val3 * 100)),
      currentFrame: val4,
      totalFrames: val3,
      ...obj23
    };
  },
  async checkExportSupport(a = {}) {
    let val3 = a.resolution || 720,
      val4 = a.fps || 30,
      val5 = val && val.height ? val.width / val.height : 1,
      val6 = val5 < 1 ? Math.round(val3 / val5) : val3,
      round = Math.round(val6 * val5),
      val7 = a.needAudio !== void 0 ? !!a.needAudio : !!(ee.length > 0 || kt);
    return handle6({
      width: round,
      height: val6,
      bitrate: a.bitrate || 6000000,
      fps: val4,
      needAudio: val7
    });
  },
  cancelRender() {
    return se ? (De = true, Ea && Ea.click(), handle9("[AM] Rendering video dibatalkan via API window.AM.cancelRender()"), true) : false;
  },
  async renderVideo(a = {}) {
    if (await this.waitReady(), !val) throw new Error("No scene loaded");
    let val3 = a.resolution || 720,
      val4 = a.fps || 30,
      val5 = typeof a.quality == "number" ? Math.min(2, Math.max(0.04, a.quality)) : a.quality === "high" ? 0.12 : a.quality === "low" ? 0.04 : 0.08;
    Po.value = String(val3), Dt.value = String(val4), Si.value = String(val5);
    let val6 = typeof a.onProgress == "function" ? a.onProgress : null,
      res5 = compute20();
    for (; se;) {
      if (val6) try {
        val6(this.getRenderProgress());
      } catch {}
      await new Promise(a2 => setTimeout(a2, 100));
    }
    if (await res5, ae === "cancelled") throw new Error("Render video dibatalkan oleh pengguna/skrip");
    if (ae === "failed") throw new Error(pt || "Render video gagal");
    if (ae !== "success" || !Ve) throw new Error("Render video gagal: status " + ae);
    let val7 = await (await fetch(Ve)).blob(),
      reader = new FileReader(),
      promise = new Promise((a2, b) => {
        reader.onloadend = () => a2(reader.result), reader.onerror = b;
      });
    reader.readAsDataURL(val7);
    let val8 = await promise,
      obj23 = {
        success: true,
        durationSec: val.totalTime / 1000,
        blobUrl: Ve,
        base64: val8,
        sizeBytes: val7.size,
        type: val7.type
      };
    if (val6) try {
      val6({
        exporting: false,
        progressPct: 100,
        statsText: Nt ? Nt.textContent : ''
      });
    } catch {}
    return obj23;
  }
};
var ed = handle9;
handle9 = function (a) {
  if (ed(a), window.AM && Array.isArray(window.AM.$e)) {
    for (let val3 of window.AM.$e) try {
      val3(a);
    } catch {}
  }
};
var Ia = [],
  Ni = [],
  ot = -1;
function getEl2(a) {
  return document.getElementById(a);
}
function _i(a, b, c) {
  let inputEl = document.createElement("input");
  inputEl.type = "file", inputEl.accept = a, inputEl.multiple = !!b, inputEl.onchange = () => {
    let arr2 = [...inputEl.files];
    arr2.length && c(arr2);
  }, inputEl.click();
}
function apply23(a) {
  document.querySelectorAll("#sTabs .s-tab").forEach(a2 => a2.classList.toggle("active", a2.dataset.s === a));
  for (let val3 of ["media", "audio", "text"]) getEl2("sp-" + val3).hidden = val3 !== a;
}
function bind14(a) {
  Ia = a;
  let res5 = getEl2("sMediaStrip");
  if (res5) {
    if (res5.innerHTML = '', getEl2("sFillAll").hidden = a.length < 2, !a.length) {
      res5.innerHTML = "<div class=\"s-empty\">Preset ini tidak memakai foto atau video.</div>";
      return;
    }
    a.forEach((a2, b) => {
      let buttonEl = document.createElement("button");
      buttonEl.type = "button", buttonEl.className = "s-tile", buttonEl.setAttribute("aria-label", "Ganti media " + (b + 1));
      let val3 = Y.get(a2.uri) || ke[0] || '';
      buttonEl.appendChild(handle14(val3, "s-thumb", {
        preview: false
      }));
      let spanEl = document.createElement("span");
      spanEl.className = "s-num", spanEl.textContent = String(b + 1);
      let spanEl2 = document.createElement("span");
      spanEl2.className = "s-swap", spanEl2.innerHTML = "<svg class=\"i\"><use href=\"#i-upload\"/></svg>", buttonEl.appendChild(spanEl), buttonEl.appendChild(spanEl2), buttonEl.addEventListener("click", () => {
        _i("image/*,video/*", false, ([a3]) => build23(a2, a3).catch(a4 => handle9("[SIMPLE] " + a4.message)));
      }), res5.appendChild(buttonEl);
    });
  }
}
async function update25(a, b) {
  Y.set(a.uri, b), await apply11(b);
}
async function build23(a, b) {
  let val3 = ce.length;
  await get17([b]);
  let val4 = ce[ce.length - 1];
  !val4 || ce.length === val3 || (await update9("media:pick", "Memuat " + val4.name + '…', async () => {
    await update25(a, val4.name), val2.setImages(get10()), V = true;
  }), compute10(), bind8());
}
async function handle28(a) {
  let val3 = ce.length;
  await get17(a);
  let slice = ce.slice(val3);
  slice.length && (await update9("media:pick", "Memasang media…", async () => {
    for (let n = 0; n < Ia.length && n < slice.length; n++) await update25(Ia[n], slice[n].name);
    val2.setImages(get10()), V = true;
  }), compute10(), bind8());
}
function bind15(a) {
  let res5 = getEl2("sAudioList");
  if (res5) {
    if (res5.innerHTML = '', !a.length) {
      res5.innerHTML = "<div class=\"s-empty\" style=\"padding-left:14px\">Preset ini tidak punya audio.</div>";
      return;
    }
    a.forEach((a2, b) => {
      let divEl = document.createElement("div");
      divEl.className = "s-row";
      let val3 = fe.get(a2.id) || '';
      divEl.innerHTML = "<svg class=\"i\"><use href=\"#i-music\"/></svg>\n            <div class=\"s-row-body\">\n                <div class=\"s-row-title\"></div>\n                <div class=\"s-row-sub\"></div>\n            </div>", divEl.querySelector(".s-row-title").textContent = a.length > 1 ? "Audio " + (b + 1) : "Audio", divEl.querySelector(".s-row-sub").textContent = val3 || a2.label || '-';
      let buttonEl = document.createElement("button");
      buttonEl.type = "button", buttonEl.className = "btn sm", buttonEl.innerHTML = "<svg class=\"i sm\"><use href=\"#i-upload\"/></svg>Ganti", buttonEl.addEventListener("click", () => {
        _i("audio/*,video/*", false, ([a3]) => {
          let val4 = val ? ref17(val, 0, [])[0] : null,
            val5 = val4 ? val4.layer.id || "audio-0" : "main-audio",
            get23 = fe.get(val5);
          fe.set(a2.id, a3.name), handle22(a3), a2.id !== val5 && (get23 ? fe.set(val5, get23) : fe.delete(val5), render8(), handle12({
            force: true
          }), bind2()), handle9("[SIMPLE] Audio " + (b + 1) + " diganti: " + a3.name);
        });
      }), divEl.appendChild(buttonEl), res5.appendChild(divEl);
    });
  }
}
function compute23(a, b, c, d) {
  for (let val3 of a || []) {
    if (!val3) continue;
    if (String(val3.tag || '').toLowerCase() === "text") {
      let val4 = b + (val3.startTime || 0);
      c.push({
        layer: val3,
        start: val4,
        end: b + (Number(val3.endTime) || (val3.startTime || 0) + 1000)
      });
    } else {
      if (get13(val3)) {
        if (d.has(val3.scene)) continue;
        d.add(val3.scene), compute23(val3.scene.layers, b + (val3.startTime || 0), c, d);
      }
    }
  }
}
function bind16() {
  if (!val) return;
  let arr2 = [];
  compute23(val.layers, 0, arr2, new Set()), Ni = arr2, ot >= arr2.length && (ot = -1);
  let res5 = getEl2("sTextStrip");
  res5.innerHTML = '', arr2.length || (res5.innerHTML = "<div class=\"s-empty\">Preset ini tidak punya layer teks.</div>"), arr2.forEach((a, b) => {
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "s-chip" + (b === ot ? " on" : ''), buttonEl.textContent = String(a.layer.textContent || '').trim() || "(kosong)", buttonEl.addEventListener("click", () => apply24(b)), res5.appendChild(buttonEl);
  }), getEl2("sTextEditWrap").hidden = ot < 0, bind17();
}
function apply24(a) {
  let val3 = Ni[a];
  if (!val3) return;
  ot = a, [...getEl2("sTextStrip").children].forEach((a2, b) => a2.classList && a2.classList.toggle('on', b === a)), getEl2("sTextEditWrap").hidden = false, getEl2("sTextEdit").value = val3.layer.textContent || '';
  let max5 = Math.max(0, val3.end - val3.start);
  process22(val3.start + Math.min(800, max5 / 2));
}
function ref23() {
  let map = new Map();
  for (let val3 of Ni) {
    let val4 = val3.layer.font || '';
    if (!val4.includes("imported?name=")) continue;
    let match = val4.match(/name=([^&]+)/);
    if (!match) continue;
    let res5 = decodeURIComponent(match[1]);
    map.set(res5.replace(/\.[^/.]+$/, ''), res5);
  }
  return map;
}
function bind17() {
  let res5 = getEl2("sFontBox");
  if (!res5) return;
  res5.innerHTML = '';
  let res6 = ref23(),
    fn8 = (a, b) => !!(val2 && val2.customFonts && (val2.customFonts.has(a) || val2.customFonts.has(b))),
    fn9 = a => _i(".ttf,.otf,.woff,.woff2", false, async ([a2]) => {
      try {
        await window.AM.loadFont(a || a2.name, a2);
      } catch (val3) {
        alert("Gagal memuat font: " + val3.message);
      }
      bind17();
    });
  if (!res6.size) {
    let divEl = document.createElement("div");
    divEl.className = "s-row", divEl.innerHTML = "<svg class=\"i\"><use href=\"#i-type\"/></svg><div class=\"s-row-body\"><div class=\"s-row-title\">Font kustom</div><div class=\"s-row-sub\">Preset ini tidak meminta font impor</div></div>";
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "btn sm", buttonEl.innerHTML = "<svg class=\"i sm\"><use href=\"#i-upload\"/></svg>Import font", buttonEl.addEventListener("click", () => fn9(null)), divEl.appendChild(buttonEl), res5.appendChild(divEl);
    return;
  }
  for (let [val3, val4] of res6) {
    let res7 = fn8(val3, val4),
      divEl = document.createElement("div");
    divEl.className = "s-row", divEl.innerHTML = "<svg class=\"i\"><use href=\"#i-type\"/></svg><div class=\"s-row-body\"><div class=\"s-row-title\"></div><div class=\"s-row-sub\"></div></div>", divEl.querySelector(".s-row-title").textContent = val3, divEl.querySelector(".s-row-sub").textContent = res7 ? "Font aktif" : "Belum diimport";
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "btn sm" + (res7 ? '' : " primary"), buttonEl.innerHTML = "<svg class=\"i sm\"><use href=\"#i-upload\"/></svg>" + (res7 ? "Ganti font" : "Import font"), buttonEl.addEventListener("click", () => fn9(val3)), divEl.appendChild(buttonEl), res5.appendChild(divEl);
  }
}
function build24(a) {
  let url = new URL(location.href);
  a ? url.searchParams.set("mode", "simple") : url.searchParams.delete("mode"), location.href = url.toString();
}
function handle29(a) {
  let res5 = getEl2("sp-start");
  if (res5) {
    res5.hidden = !a;
    for (let val3 of ["sp-media", "sp-audio", "sp-text", "sTabs", "sTransport"]) {
      let res6 = getEl2(val3);
      res6 && (res6.hidden = !!a);
    }
    a ? (getEl2("sTitle").textContent = "Masukkan link Alight Motion", getEl2("sAlightError").hidden = true, getEl2("sAlightInput").focus({
      preventScroll: true
    })) : (getEl2("sTabs").hidden = false, getEl2("sTransport").hidden = false);
  }
}
async function process27() {
  let res5 = getEl2("sAlightInput"),
    res6 = getEl2("sAlightError"),
    val3 = res5 ? res5.value.trim() : '';
  if (!val3) {
    res6.textContent = "Masukkan link Alight Motion dulu.", res6.hidden = false;
    return;
  }
  res6.hidden = true;
  let res7 = getEl2("sAlightLoad");
  res7 && (res7.disabled = true);
  try {
    await window.AM.loadPreset(val3), handle29(false), apply23("media");
  } catch (val4) {
    res6.textContent = "Gagal membuka preset: " + val4.message, res6.hidden = false, handle9("[SIMPLE] " + val4.message);
  } finally {
    res7 && (res7.disabled = false);
  }
}
function updateClock2() {
  let val3 = document.documentElement,
    res5 = getEl2("sSeek"),
    res6 = getEl2("sPlay"),
    res7 = getEl2("sTime"),
    res8 = getEl2("sExportBtn"),
    res9 = getEl2("sExportTxt"),
    flag3 = false,
    val4 = null;
  document.querySelectorAll("#sTabs .s-tab").forEach(a => a.addEventListener("click", () => apply23(a.dataset.s))), getEl2("sModeBtn")?.["addEventListener"]("click", () => build24(false)), getEl2("sSettingsBtn")?.["addEventListener"]("click", () => {
    process25(), vr.showModal();
  }), getEl2("sAlightLoad")?.["addEventListener"]("click", process27), getEl2("sAlightInput")?.["addEventListener"]("keydown", a => {
    a.key === "Enter" && process27();
  }), res6.addEventListener("click", () => handle24(!flag2)), res5.addEventListener("pointerdown", () => {
    flag3 = true;
  }), window.addEventListener("pointerup", () => {
    flag3 = false;
  }), res5.addEventListener("input", () => {
    update8(res5), Ee.value = res5.value, Ee.dispatchEvent(new Event("input", {
      bubbles: true
    }));
  }), getEl2("sFillAll").addEventListener("click", () => {
    _i("image/*,video/*", true, a => fn8(a));
  });
  let fn8 = a => handle28(a).catch(a2 => handle9("[SIMPLE] " + a2.message));
  getEl2("sTextEdit").addEventListener("input", a => {
    let val5 = Ni[ot];
    if (!val5) return;
    val5.layer.textContent = a.target.value;
    let val6 = getEl2("sTextStrip").children[ot];
    val6 && (val6.textContent = a.target.value.trim() || "(kosong)"), V = true;
  });
  let fn9 = () => val3.classList.remove("s-export");
  res8.addEventListener("click", () => {
    let res10 = getEl2("expCodec"),
      res11 = getEl2("expAudioSr");
    if (res10 && (res10.value = "h264"), res11 && (res11.value = "auto"), !se) {
      let res12 = getEl2("expStartSec");
      res12 && (res12.value = '0'), typeof get21 == "function" && get21();
    }
    val3.classList.add("s-export");
  }), getEl2("sExportClose").addEventListener("click", fn9), getEl2("panes").addEventListener("click", a => {
    a.target === getEl2("panes") && fn9();
  }), setInterval(() => {
    if (val) {
      let round = Math.round(val.totalTime);
      res5.max !== String(round) && (res5.max = String(round)), flag3 || (res5.value = String(Math.round(H)), update8(res5));
      let fn10 = a => {
        let floor = Math.floor(a / 1000);
        return String(Math.floor(floor / 60)).padStart(2, '0') + ':' + String(floor % 60).padStart(2, '0');
      };
      res7.textContent = fn10(H) + " · " + fn10(val.totalTime);
    }
    val4 !== flag2 && (val4 = flag2, res6.innerHTML = "<svg class=\"i\"><use href=\"#i-" + (flag2 ? "pause" : "play") + "\"/></svg>");
    let val5 = se && rt.max ? Math.round(Number(rt.value) / Number(rt.max) * 100) : null,
      val6 = val5 === null ? "Ekspor" : val5 + '%';
    res9.textContent !== val6 && (res9.textContent = val6);
  }, 150);
}
Tn && updateClock2(), get19().catch(a => {
  handle9("[ERROR] " + a.message), Ba.textContent = "Gagal memuat preset", get7("Gagal memuat preset: " + a.message);
  let bootError = document.getElementById("bootError"),
    bootErrorText = document.getElementById("bootErrorText");
  bootError && bootErrorText && (bootErrorText.textContent = '\x0a' + (a.stack || a.message || String(a)), bootError.style.display = "block");
});