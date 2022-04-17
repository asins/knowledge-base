+++
title = "uuid"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"

+++

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
const ONE_BITWISE_30 = 0x40000000;

/**
 * 生成一个第4版本的十六进制字符串作为统一标识符(UUID)。
 * 来源：https://github.com/LiosK/UUID.js/blob/master/src/uuid.core.js
 */
export function generateUuid() {
  return `${hexAligner(getRandomInt(32), 8) // time_low
  }-${hexAligner(getRandomInt(16), 4) // time_mid
  }-${hexAligner(0x4000 | getRandomInt(12), 4) // time_hi_and_version
  }-${hexAligner(0x8000 | getRandomInt(14), 4) // clock_seq_hi_and_reserved clock_seq_low
  }-${hexAligner(getRandomInt(48), 12) // node
  }`;
}

/**
 * 返回一个无符号的x位随机整数。
 * @private
 * @param {number} x Unsigned integer ranging from 0 to 53, inclusive.
 * @returns {number} Unsigned x-bit random integer (0 <= f(x) < 2^x).
 */
export function getRandomInt(x) {
  if (x < 0 || x > 53) { return NaN; }
  const n = 0 | Math.random() * ONE_BITWISE_30; // 1 << 30
  return x > 30 ? n + (0 | Math.random() * (1 << x - 30)) * ONE_BITWISE_30 : n >>> 30 - x;
}

/**
 * 将整数转换为零填充的十六进制字符串。
 * @private
 * @param {number} num
 * @param {number} length
 * @returns {string}
 */
export function hexAligner(num, length) {
  let str = num.toString(16);
  let i = length - str.length;
  let z = '0';
  if (i < 0) return str.slice(0, length);

  for (; i > 0; i >>>= 1, z += z) {
    if (i & 1) {
      str = `${z}${str}`;
    }
  }
  return str;
}
```

## 生成一个密码

可以分别指定大小写字母、数字、特殊字符的数量，以及总密码长度

```js
const randomFuncLists = {
  lower: () => { // 小写字母
    return _fromCC(Math.floor(Math.random() * 26) + 97);
  },
  upper: () => { // 大写字母
    return _fromCC(Math.floor(Math.random() * 26) + 65);
  },
  number: () => { // 数字
    return _fromCC(Math.floor(Math.random() * 10) + 48);
  },
  symbol: () => { // 特殊字符
    // const symbols = '~!@#$%^&*()_+{}":?><;.,';
    const symbols = '!@#$%&*_+":;.';
    return symbols[Math.floor(Math.random() * symbols.length)];
  },
};

// 随机生成一串字符
export function randomString(length = 10, config = {}) {
  let generatedPassword = '';
  config = Object.assign({ lower: true, upper: true, number: true, symbol: true }, config);
  const typesArr = Object.keys(config).filter(key => config[key]);

  for (let i = 0; i < length; i++) {
    generatedPassword += typesArr.map(type => randomFuncLists[type]()).join('');
  }
  return generatedPassword.slice(0, length);
}
```

