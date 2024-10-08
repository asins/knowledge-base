+++
title = "Uint8Array使用"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

```ts
/** 字符串转Uint8Array */
export function stringToUint8Array(bStr: string) {
  const len = bStr.length;
  const u8Array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8Array[i] = bStr.charCodeAt(i);
  }
  return u8Array;
}

/** Uint8Array转字符串 */
export function uint8ArrayToString(u8Array: Uint8Array) {
  const len = u8Array.length;
  let bStr = '';
  for (let i = 0; i < len; i++) {
    bStr += String.fromCharCode(u8Array[i]);
  }
  return bStr;
}


/**
 * Converts a JS string to a UTF-8 "byte" array.
 * @see https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
 * @param {string} str 16-bit unicode string.
 * @return {!Array<number>} UTF-8 byte array.
 */
export function textToByteArray(str: string) {
  // TODO(user): Use native implementations if/when available
  const out: number[] = [];
  let pNum = 0;
  for (let index = 0; index < str.length; index++) {
    let cCode = str.charCodeAt(index);
    if (cCode < 128) {
      out[pNum++] = cCode;
    } else if (cCode < 2048) {
      out[pNum++] = (cCode >> 6) | 192;
      out[pNum++] = (cCode & 63) | 128;
    } else if (
      ((cCode & 0xFC00) === 0xD800) && (index + 1) < str.length &&
      ((str.charCodeAt(index + 1) & 0xFC00) === 0xDC00)) {
      // Surrogate Pair
      cCode = 0x10000 + ((cCode & 0x03FF) << 10) + (str.charCodeAt(++index) & 0x03FF);
      out[pNum++] = (cCode >> 18) | 240;
      out[pNum++] = ((cCode >> 12) & 63) | 128;
      out[pNum++] = ((cCode >> 6) & 63) | 128;
      out[pNum++] = (cCode & 63) | 128;
    } else {
      out[pNum++] = (cCode >> 12) | 224;
      out[pNum++] = ((cCode >> 6) & 63) | 128;
      out[pNum++] = (cCode & 63) | 128;
    }
  }
  return out;
}

/**
 * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
 * @see https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
 * @param {Uint8Array|Array<number>} bytes UTF-8 byte array.
 * @return {string} 16-bit Unicode string.
 */
export function byteArrayToText(bytes: Uint8Array | number[]) {
  // TODO(user): Use native implementations if/when available
  const out: string[] = [];
  let pos = 0;
  let cNum = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[cNum++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++];
      out[cNum++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      // Surrogate Pair
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      const c4 = bytes[pos++];
      const uNum: number = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
        0x10000;
      out[cNum++] = String.fromCharCode(0xD800 + (uNum >> 10));
      out[cNum++] = String.fromCharCode(0xDC00 + (uNum & 1023));
    } else {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      out[cNum++] =
        String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join('');
}

function array2Uint8Array(arr: number[]) {
  return Uint8Array.from(arr);
}
function uint8Array2Array(arr: Uint8Array) {
  return Array.from(arr);
}

// const byteArray = textToByteArray(JSON.stringify({a: 222}));
// const uint: Uint8Array = Uint8Array.from(byteArray)
// const msgStr = byteArrayToText(uint); // Output: '{"a":222}'
```



## Uint8Array <-->String转换

来源于：https://github.com/protobufjs/protobuf.js/blob/master/lib/utf8/index.js

```js
/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
function utf8_read(buffer, start, end) {
    if (end - start < 1) {
        return "";
    }

    var str = "";
    for (var i = start; i < end;) {
        var t = buffer[i++];
        if (t <= 0x7F) {
            str += String.fromCharCode(t);
        } else if (t >= 0xC0 && t < 0xE0) {
            str += String.fromCharCode((t & 0x1F) << 6 | buffer[i++] & 0x3F);
        } else if (t >= 0xE0 && t < 0xF0) {
            str += String.fromCharCode((t & 0xF) << 12 | (buffer[i++] & 0x3F) << 6 | buffer[i++] & 0x3F);
        } else if (t >= 0xF0) {
            var t2 = ((t & 7) << 18 | (buffer[i++] & 0x3F) << 12 | (buffer[i++] & 0x3F) << 6 | buffer[i++] & 0x3F) - 0x10000;
            str += String.fromCharCode(0xD800 + (t2 >> 10));
            str += String.fromCharCode(0xDC00 + (t2 & 0x3FF));
        }
    }

    return str;
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};

// import * as utf8 from '@protobufjs/utf8';
function stringToUint8Array(text: string): Uint8Array {
  const l = utf8_length(text);
  const b = new Uint8Array(l);
  utf8_write(text, b, 0);
  return b;
}
function uint8ArrayToString(bytes: Uint8Array): string {
  return utf8_read(bytes, 0, bytes.length);
}

// Example：
// uint8ArrayToString(new Uint8Array([50,72,226,130,130,32,43,32,79,226,130,130,32,226,135,140,32,50,72,226,130,130,79])); // output: 2H₂ + O₂ ⇌ 2H₂O
// uint8ArrayToString(new Uint8Array([240,159,154,133])); // output: 🚅
```



## Uint8Array转16进制字符

```js
function hexdump_buffer(a) {
  const mg = new Uint8Array(a);
  let hex = '';
  let str = '';
  let last_zeros = 0;
  const resultStr = [];
  for (let i = 0; i < mg.length; i++) {
    const h = Number(mg[i]).toString(16);
    if (h.length === 1) {
      hex += '0';
    }
    hex += `${h} `;

    if (mg[i] === 10 || mg[i] === 13 || mg[i] === 8) {
      str += '.';
    } else {
      str += String.fromCharCode(mg[i]);
    }

    if ((i % 16 === 15) || (i === (mg.length - 1))) {
      while (i % 16 !== 15) {
        hex += '   ';
        i++;
      }

      if (last_zeros === 0) {
        resultStr.push(`${hex} | ${str}`);
      }

      if (hex === '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ') {
        if (last_zeros === 1) {
          resultStr.push('.');
          last_zeros++;
        } else if (last_zeros === 0) {
          last_zeros++;
        }
      } else {
        last_zeros = 0;
      }

      hex = str = '';
    }
  }
  console.log(resultStr.join('\n'));
}
let sample = new Uint8Array([
255,241,80,128,42,191,252,33,26,206,156,1,244,0,0,144,
176,212,88,72,147,81,16,9,64,0,92,137,36,137,45,19]);
// 输出
// ff f1 50 80 2a bf fc 21 1a ce 9c 01 f4 00 00 90  | ÿñP*¿ü!Îô  
// b0 d4 58 48 93 51 10 09 40 00 5c 89 24 89 2d 13  | °ÔXHQ	@ \$-
```

