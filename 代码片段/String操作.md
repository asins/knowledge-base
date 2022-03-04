+++
title = "String操作"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

### 随机生成一串字符

```js
const randomFuncLists = {
  lower: () => { // 小写字母
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  },
  upper: () => { // 大写字母
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  },
  number: () => { // 数字
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
  },
  symbol: () => { // 特殊字符
    // const symbols = '~!@#$%^&*()_+{}":?><;.,';
    const symbols = '!@#$%&*_+":;.';
    return symbols[Math.floor(Math.random() * symbols.length)];
  },
};

/**
 * 随机生成一串字符
 * @param {number} length 待生成的字符串长度
 * @param {Object} length 待生成的字符串长度
 */
function randomString(length = 10, config = {}) {
  let generatedPassword = '';
  config = Object.assign({ lower: true, upper: true, number: true, symbol: true }, config);
  const typesArr = Object.keys(config).filter(key => config[key]);

  for (let i = 0; i < length; i++) {
    generatedPassword += typesArr.map(type => randomFuncLists[type]()).join('');
  }
  return generatedPassword.slice(0, length);
}

randomString(); // 允许生成
```

