# JS Number操作

### 数字三位分隔

```js
'11222333444555'.match(/\d+?(?=(\d{3})*$)/g); // ["11", " 222", "333 ", "444", "555"]
'12345.123'.replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,'); // "12,345.123"
```



### 超int型的最大值相加

```js
function add(a, b){
  var SPLITE_LENGTH = 3;
  var aL = String(a), bL = String(b);
  var resout = '', c = 0;
  while(aL !== '0' || bL !== '0'){
    var aR = aL.slice(-SPLITE_LENGTH), bR = bL.slice(-SPLITE_LENGTH);
    var t = String(parseInt(aR) + parseInt(bR) + c);
    resout = t.slice(-SPLITE_LENGTH) + resout; // 字符拼接
    c = parseInt(t.slice(0, -SPLITE_LENGTH) || '0');
    aL = aL.slice(0, -SPLITE_LENGTH) || '0';
    bL = bL.slice(0, -SPLITE_LENGTH) || '0';
  }
  if(c){
    resout = String(c) + resout;
  }
  return resout;
}
console.log(add(123151541512315150, 48154546104815460));
```

### 为数字加上单位：万或亿

```js
/**
 * 为数字加上单位：万或亿
 *
 * 例如：
 *      1000.01 => 1000.01
 *      10000 => 1万
 *      99000 => 9.9万
 *      566000 => 56.6万
 *      5660000 => 566万
 *      44440000 => 4444万
 *      11111000 => 1111.1万
 *      444400000 => 4.44亿
 *      40000000,00000000,00000000 => 4000万亿亿
 *      4,00000000,00000000,00000000 => 4亿亿亿
 *
 * @param {number} number 输入数字.
 * @param {number} decimalDigit 小数点后最多位数，默认为2
 * @return {string} 加上单位后的数字
 */
const addChineseUnit = (function() {
  const getDigit = function(integer) {
    let digit = 0;
    while (integer >= 1) {
      digit++;
      integer = integer / 10;
    }
    digit--;
    return digit;
  };
  const addWan = function(integer, number, mutiple, decimalDigit) {
    const digit = getDigit(integer);
    if (digit > 3) {
      let remainder = digit % 8;
      if (remainder >= 5) {   // ‘十万’、‘百万’、‘千万’显示为‘万’
        remainder = 4;
      }
      return Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) / Math.pow(10, decimalDigit) + '万';
    }
    return Math.round(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit);

  };

  return function(number, decimalDigit) {
    decimalDigit = decimalDigit == null ? 2 : decimalDigit;
    const integer = Math.floor(number);
    const digit = getDigit(integer);
          // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
    const unit = [];
    if (digit > 3) {
      const multiple = Math.floor(digit / 8);
      if (multiple >= 1) {
        const tmp = Math.round(integer / Math.pow(10, 8 * multiple));
        unit.push(addWan(tmp, number, 8 * multiple, decimalDigit));
        for (let i = 0; i < multiple; i++) {
          unit.push('亿');
        }
        return unit.join('');
      }
      return addWan(integer, number, 0, decimalDigit);

    }
    return number;

  };
})();
```