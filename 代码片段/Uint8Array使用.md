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

