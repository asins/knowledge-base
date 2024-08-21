+++
title = "Boolean操作"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

## 字符转Bool

```js
/*
 * Converts a string to a bool.
 *
 * This conversion will:
 *
 *  - match 'true', 'on', or '1' as true.
 *  - ignore all white-space padding
 *  - ignore capitalization (case).
 *
 * '  tRue  ','ON', and '  1  ' will all evaluate as true.
 *
 */
String.prototype.bool = function strToBool(s)
{
    // will match one and only one of the string 'true','1', or 'on' rerardless
    // of capitalization and regardless off surrounding white-space.
    //
    regex=/^\s*(true|1|on|yes)\s*$/i
    return regex.test(s);
}
// alert("true".bool());

/**
 * 字符的true/FALSE 转为boolean类型，其它字符原样返回
 * @param str {string} 待转为boolean的字符串
 * @param faceBool {boolean} 如果str非有效boolean的字符串时是否强制返回bool结果。不指定则强制返回boolean的值
 * @example
 *   stringToBool('true', false); // true
 *   stringToBool('true', false); // true
 *   stringToBool('abc', false); // 'abc'
 *   stringToBool('abc'); // false
 *   stringToBool('abc', true); // false
 */
function stringToBool(str: string, faceBool?: boolean): string | boolean {
  const val = str.toLowerCase();
  if ((val === 'true' || val === 'false')) {
    return val === 'true';
  }
  return faceBool === false ? val : false;
}
```

上面的代码因为是直接加在String原型链上的，所以对传入值没有考虑其它类型，完整的判断（没有使用正则是为了有更高的性能）：

```js 
function isTrue(value){
  if (typeof(value) === 'string'){
    value = value.trim().toLowerCase();
  }
  switch(value){
    case true:
    case "true":
    case 1:
    case "1":
    case "on":
    case "yes":
      return true;
    default: 
      return false;
  }
}
```



### 转换值是boolean、number、JSONstring的字符串的数据类型

```js
// 转换值是boolean、number、JSONstring的字符串的数据类型
function parseValue(value) {
  if (typeof value === 'string') {
    const valueNumber = Number(value);
    if (!Number.isNaN(valueNumber) && value.trim() !== '') {
      value = valueNumber;
    } else if (value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
      value = value.toLowerCase() === 'true';
    } else if (value[0] === '{' && value[value.length - 1] === '}') {
      try { value = JSON.parse(value); } catch (e) { /* do something */ }
    }
  }

  return value;
}

parseValue('{"a": 345}'); // {a: 345}
parseValue('false'); // false
parseValue('345'); // 345
```

