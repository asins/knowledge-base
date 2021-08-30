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
 *   var d = new Date(2017, 8, 27, 15, 9, 12, 345);
 *   console.log(format(d, 'yyyy-MM-d/q hh:mm:ss.S, e')); // 2017-09-27/No.3 15:09:12.345, 3
 *   console.log(format(d, 'M/d/yy')); // 9/27/17
 *   console.log(format(d, 'yyyy-MM-dd hh:mm:ss.S')); // 2017-09-27 15:09:12.345

 *   var t = format(d, 'yyyy年M月dd日 e (第q季)', {
 *   e: (val, pattern) => {return (pattern.length > 1 ? '星期': '周') + '日一二三四五六'[val];},
 *   q: '一二三四',
 *   });
 *   console.log(t); // 2017年9月27日 周三 (第四季)
 */
function format(date, fmt = 'yyyy-MM-dd', opt = {}) {
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/');
  }

  date = date === undefined ? new Date() : new Date(date);

  return fmt.replace(new RegExp(/([yMdhmsSqe])\1*/, 'g'), ($0, $1) => {
    if (!$1) $1 = $0;

    let str;
    switch ($1) {
      case 'y': str = date.getFullYear(); break; // 年份
      case 'M': str = date.getMonth() + 1; break; // 月份
      case 'd': str = date.getDate(); break; // 日
      case 'h': str = date.getHours(); break; // 小时
      case 'm': str = date.getMinutes(); break; // 分
      case 's': str = date.getSeconds(); break; // 秒
      case 'S': str = date.getMilliseconds(); break; // 毫秒
      case 'q': str = Math.floor((date.getMonth() + 3) / 3); break; // 季度
      case 'e': str = date.getDay(); break; // 星期（0-6）
      default: str = $0;
    }

    const extend = opt[$1];
    if (extend) {
      return typeof extend === 'function' ? extend(str, $0) : extend[str];
    } else {
      return (`00${str}`).substr(-$0.length);
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



## 过去时间友好提示

```typescript
/**
 * 提示距离当天零点过去了多少时间
 * @param {Number|Date} start 开始时间
 * @param {Number|Date} end 结束时间
 * @param {String} format 大于25天后显示的样式
 */
const oneDaySer = 24 * 60 * 60; // 一天的秒数
export function release(start, end?, format = 'YYYY年MM月DD日') {
  if (isNumeric(start)) {
    start = new Date(parseInt(start, 10));
  }
  if (isNumeric(end)) {
    end = new Date(parseInt(end, 10));
  }
  if (start === undefined) { start = new Date(); }
  if (end === undefined) { end = new Date(); }

  const endZero = new Date(end);
  endZero.setHours(0, 0, 0, 0); // 凌晨时间
  const diff = (+end - +start) / 1000;
  const diffZero = (+end - +endZero) / 1000;
  if (diff <= 60) {
    return '刚刚';
  } else if (diff <= 60 * 60) {
    return `${Math.floor(diff / 60)}分钟前`;
  } else if (diff <= diffZero) {
    return `${Math.floor(diff / 3600)}小时前`;
  } else if (diff <= diffZero + oneDaySer) {
    return '昨天';
  } else if (diff <= diffZero + oneDaySer * 2) {
    return '前天';
  } else if (diff <= diffZero + oneDaySer * 25) {
    return `${Math.floor(diff / oneDaySer)}天前`;
  }
  return formatDate(format, start);
}
```



