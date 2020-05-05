---
title: "Date操作"
date: "2019-08-21"
lastmod: "2020-05-05"
---

# JS Date操作

### 格式化Date对象为String

```js
/**
 * 格式化日期
 * @method format
 * @static
 * @param {Date} date 日期对象
 * @param {string} pattern 日期格式(y年M月d天h时m分s秒)，默认为'yyyy-MM-dd'
 * @return {string}  返回format后的字符串
 * @example
 var d = new Date(2017, 8, 27, 15, 9, 12, 345);
 console.log(format(d, 'yyyy-MM-d/q hh:mm:ss.S, e')); // 2017-09-27/No.3 15:09:12.345, 3
 console.log(format(d, 'M/d/yy')); // 9/27/17
 console.log(format(d, 'yyyy-MM-dd hh:mm:ss.S')); // 2017-09-27 15:09:12.345

 var t = format(d, 'yyyy年M月dd日 e (第q季)', {
 e: (val, pattern) => {return (pattern.length > 1 ? '星期': '周') + '日一二三四五六'[val];},
 q: '一二三四',
 });
 console.log(t); // 2017年9月27日 周三 (第四季)
 */
function format(date, fmt = 'yyyy-MM-dd', opt = {}) {
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/');
  }

  date = date === undefined ? new Date() : new Date(date);

  var o = {
    y: date.getFullYear(), // 年份
    M: date.getMonth() + 1, //月份
    d: date.getDate(), //日
    h: date.getHours(), //小时
    m: date.getMinutes(), //分
    s: date.getSeconds(), //秒
    S: date.getMilliseconds(), //毫秒
    q: Math.floor((date.getMonth() + 3) / 3), //季度
    e: date.getDay(), // 星期（0-6）
  };

  return fmt.replace(new RegExp(/([yMdhmsSqe])\1*/, 'g'), function($0, $1) {
    if (!$1) $1 = $0;

    const extend = opt[$1];
    if (extend) {
      return typeof extend === 'function' ?
        extend(o[$1], $0) :
      extend[o[$1]];
    } else {
      return $0.length === 1 ?
        o[$1] :
      ('0' + o[$1]).substr(-$0.length);
    }
  });
}
```



### 改为TS的版本

```typescript
type Formatter = (val: number, pattern: string) => string;

type Formatters = { [ token: string ]: Formatter; };
type FormattersNumber = { [ token: string ]: number; };

/**
 * 格式化日期
 * @method format
 * @static
 * @param {Date} date 日期对象
 * @param {string} pattern 日期格式(y年M月d天h时m分s秒)，默认为'yyyy-MM-dd'
 * @return {string}  返回format后的字符串
 * @example
 var d = new Date(2017, 8, 27, 15, 9, 12, 345);
 console.log(format(d, 'yyyy-MM-d/q hh:mm:ss.S, e')); // 2017-09-27/No.3 15:09:12.345, 3
 console.log(format(d, 'M/d/yy')); // 9/27/17
 console.log(format(d, 'yyyy-MM-dd hh:mm:ss.S')); // 2017-09-27 15:09:12.345

 var t = format(d, 'yyyy年M月dd日 e (第q季)', {
 e: (val, pattern) => {return (pattern.length > 1 ? '星期': '周') + '日一二三四五六'[val];},
 q: '一二三四',
 });
 console.log(t); // 2017年9月27日 周三 (第四季)
 */
function formatDate(date: Date | null, fmt = 'yyyy-MM-dd', opt: Formatters = {}) {
  // if (typeof date === 'string') {
  //   date = date.replace(/-/g, '/');
  // }

  date = date === null ? new Date() : new Date(date);

  const formatters = {
    y: date.getFullYear(), // 年份
    M: date.getMonth() + 1, //月份
    d: date.getDate(), //日
    h: date.getHours(), //小时
    m: date.getMinutes(), //分
    s: date.getSeconds(), //秒
    S: date.getMilliseconds(), //毫秒
    q: Math.floor((date.getMonth() + 3) / 3), //季度
    e: date.getDay(), // 星期（0-6）
  } as FormattersNumber;

  return fmt.replace(
    new RegExp(/([yMdhmsSqe])\1*/, 'g')
    ,function($0: string, $1: string) {
      if (!$1) $1 = $0;

      const extend = opt[$1];
      if (extend) {
        return typeof extend === 'function'
          ? extend(formatters[$1], $0)
          : extend[formatters[$1]];
      } else {
        return $0.length === 1
          ? formatters[$1]
          : ('0' + formatters[$1]).substr(-$0.length);
      }
    }
  );
}

```





```js
type Formatter = (date: Date) => string;

type Formatters = { [ token: string ]: Formatter; };

/**
 * Formatters are based on moment tokens. They receives a
 * Date and returns it's format.
 */
const formatters: Formatters = {
  'DD':   (date) => zero(date.getDate(), 2),
  'D':    (date) => date.getDate() + '',
  'MM':   (date) => zero(date.getMonth() + 1, 2),
  'M':    (date) => (date.getMonth() + 1) + '',
  'YYYY': (date) => zero(date.getFullYear(), 4),
  'YY':   (date) => (date.getFullYear() + '').substr(-2, 2),
  'HH':   (date) => zero(date.getHours(), 2),
  'H':    (date) => date.getHours() + '',
  'mm':   (date) => zero(date.getMinutes(), 2),
  'm':    (date) => date.getMinutes() + '',
  'ss':   (date) => zero(date.getSeconds(), 2),
  's':    (date) => date.getSeconds() + '',
};

/**
 * Add '0' pads to number value.
 */
function zero (value: number, length: number): string {
  let string = value + '';
  while (string.length < length)
    string = '0' + string;
  return string;
}

/**
 * Creates a matcher using formatters tokens and escape strategy.
 */
function createMatcher (): RegExp {
  const ESCAPE = '\\[[^\\[\\]]*\\]';
  const matchers = Object.keys(formatters).concat(ESCAPE);
  return new RegExp(matchers.join('|'), 'g');
}

/**
 * It replaces format tokens for corresponding Date formats.
 * @example ```js
 * format(new Date(), 'DD/MM/YYYY hh:mm:ss')
 * ```
 * @param date A Date instace.
 * @param format A string with tokens based on moment.
 */
function format (date: Date, format: string) {
  return format.replace(matcher, (token: string) => {
    if (formatters.hasOwnProperty(token))
      return formatters[token](date);
    return token.replace(/\[|\]/g, '');
  });
}
```

