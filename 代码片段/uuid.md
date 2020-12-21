### 生成一串统一的标识的字符串
```js
function createUuid(len) {
  len = len || 6;
  var charList = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var rand = '';
  var listLength = charList.length;
  for (var i = 0; i < len; i++) {
    var index = parseInt(Math.random() * Math.pow(10, 6)) % listLength;
    rand += charList[index];
  }
  return +new Date + rand;
}
```



## 生成UUID

```js

/**
 * 生成一个第4版本的十六进制字符串作为统一标识符(UUID)。
 * 来源：https://github.com/LiosK/UUID.js/blob/master/src/uuid.core.js
 * returns：97d77572-2e2d-47ee-8f34-ea3a1aa60b
 */
export function generateUuid() {
  return `${
    _hexAligner(_getRandomInt(32), 8) // time_low
    }-${
    _hexAligner(_getRandomInt(16), 4) // time_mid
    }-${
    _hexAligner(0x4000 | _getRandomInt(12), 4) // time_hi_and_version
    }-${
    _hexAligner(0x8000 | _getRandomInt(14), 4) // clock_seq_hi_and_reserved clock_seq_low
    }-${
    _hexAligner(_getRandomInt(48), 12) // node
  }`;
}

/**
 * 返回一个无符号的x位随机整数。
 * @private
 * @param {number} x Unsigned integer ranging from 0 to 53, inclusive.
 * @returns {number} Unsigned x-bit random integer (0 <= f(x) < 2^x).
 */
function _getRandomInt(x) {
  if (x < 0 || x > 53) { return NaN; }
  const n = 0 | Math.random() * 0x40000000; // 1 << 30
  return x > 30 ? n + (0 | Math.random() * (1 << x - 30)) * 0x40000000 : n >>> 30 - x;
}

/**
 * 将整数转换为零填充的十六进制字符串。
 * @private
 * @param {number} num
 * @param {number} length
 * @returns {string}
 */
function _hexAligner(num, length) {
  let str = num.toString(16);
  let i = length - str.length;
  let z = '0';
  for (; i > 0; i >>>= 1, z += z) {
    if (i & 1) {
      str = z + str;
    }
  }
  return str;
}
```

