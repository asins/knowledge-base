## String to RegExp 转义

```js
// 将字符串安全格式化为正则表达式的源码 
// https://github.com/slevithan/xregexp

/**
 * Escapes any regular expression metacharacters, for use when matching literal strings. The result can safely be used at any point within a regex that uses any flags.
 *
 * @memberOf XRegExp
 * @param {String} str String to escape.
 * @returns {String} String with regex metacharacters escaped.
 *
 * @example
 * XRegExp.escape('Escaped? <.>');
 * // -> 'Escaped\?\ <\.>'
 */
var escape = function(str) {
    return String(str).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
```

