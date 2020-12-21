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

