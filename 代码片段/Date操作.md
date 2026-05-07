+++
title = "Date操作"
template = "page.html"
date = "2019-08-21"
updated = "2020-05-05"
+++


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
export function format(date, fmt = 'yyyy-MM-dd', opt = {}) {
  return fmt.replace(/([yMdhmsSqe])\1*/g, ($0, $1) => {
    let str;
    switch ($1) {
      case 'y': str = date.getFullYear(); break; // 年份
      case 'M': str = date.getMonth() + 1; break; // 月份
      case 'd': str = date.getDate(); break; // 日
      case 'h': str = date.getHours(); break; // 小时
      case 'm': str = date.getMinutes(); break; // 分
      case 's': str = date.getSeconds(); break; // 秒
      case 'S': str = date.getMilliseconds(); break; // 毫秒
      case 'q': str = Math.floor(date.getMonth() / 3); break; // 季度（0-3）
      case 'e': str = date.getDay(); break; // 星期（0-6）
    }

    const extend = opt[$1];
    if (extend) {
      return typeof extend === 'function' ? extend(str, $0) : extend[str];
    } else {
      const len = Math.max(String(str).length, $0.length);
      return (`00${str}`).slice(-len);
    }
  });
}
```



### 改为TS的版本

```typescript
/**
 * 格式化日期
 * @param date 日期对象
 * @param fmt 日期格式(y年M月d天h时m分s秒)，默认为'yyyy-MM-dd'
 * @param opt 其它设置项
 *   - isUTC 是否收集UTC的时间信息
 * @return 返回format后的字符串
 * @example
 *   const d = new Date(2017, 8, 27, 15, 9, 12, 345);
 *   console.log(formatDate(d, 'yyyy-MM-d/q hh:mm:ss.S, e')); // 2017-09-27/No.3 15:09:12.345, 3
 *   console.log(formatDate(d, 'M/d/yy')); // 9/27/17
 *   console.log(formatDate(d, 'yyyy-MM-dd hh:mm:ss.S')); // 2017-09-27 15:09:12.345
 */
export function formatDate(
  date: Date,
  fmt: string = 'yyyy-MM-dd',
  opt: FormatDateOption = {}
): string {
  const fnPrefix = opt.isUTC === true ? 'UTC' : ''

  return fmt.replace(/([yMdhmsSqe])\1*/g, (match, $1): string => {
    let str: string | number = ''

    switch ($1) {
      case 'y': // 年份
        str = date[`get${fnPrefix}FullYear`]()
        break
      case 'M': // 月份
        str = date[`get${fnPrefix}Month`]() + 1
        break
      case 'd': // 日
        str = date[`get${fnPrefix}Date`]()
        break
      case 'h': // 小时
        str = date[`get${fnPrefix}Hours`]()
        break
      case 'm': // 分
        str = date[`get${fnPrefix}Minutes`]()
        break
      case 's': // 秒
        str = date[`get${fnPrefix}Seconds`]()
        break
      case 'S': // 毫秒
        str = date[`get${fnPrefix}Milliseconds`]()
        break
      case 'q': // 季度（0-3）
        str = Math.floor(date[`get${fnPrefix}Month`]() / 3)
        break
      case 'e': // 星期（0-6）
        str = date[`get${fnPrefix}Day`]()
        break
    }

    const len = Math.max(String(str).length, match.length)
    return `00${str}`.slice(-len)
  })
}

export interface FormatDateOption {
  /** 是否收集UTC的时间信息 */
  isUTC?: boolean
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

## 友好时间显示（支持过去、未来）

```typescript
import { ONE_SECOND } from '@/config';
import { isString } from '@theroyalwhee0/istype';

/**
 * 提示距离当天零点过去了多少时间
 * @param {Number|Date} start 开始时间
 * @param {Number|Date} end 结束时间
 * @param {String} format 大于25天后显示的样式
 */
export function release(start: number | string | Date, end?: number | string | Date) {
  if (start === undefined) {
    start = new Date();
  } else {
    start = new Date(isString(start) ? parseInt(start, 10) : start);
  }
  if (end === undefined) {
    end = new Date();
  } else {
    end = new Date(isString(end) ? parseInt(end, 10) : end);
  }

  const minute = 60; // 一分钟秒数
  const hour = minute * 60; // 一小时秒数
  const day = hour * 24; // 一天秒数

  const endZero = new Date(end);
  endZero.setHours(0, 0, 0, 0); // 凌晨时间
  const diff = (+end - +start) / ONE_SECOND;
  const diffZero = (+end - +endZero) / ONE_SECOND;

  if (diff < -(diffZero + day * 2)) {
    return `${-Math.floor(diff / day)}天前`;
  } else if (diff < -(diffZero + day)) {
    return '前天';
  } else if (diff < -diffZero) {
    return '昨天';
  } else if (diff < -hour) {
    return `${-Math.floor(diff / hour)}小时前`;
  } else if (diff < -minute) {
    return `${-Math.floor(diff / minute)}分钟前`;
  } else if (diff <= minute) {
    return '刚刚';
  } else if (diff <= hour) {
    return `${Math.floor(diff / minute)}分钟后`;
  } else if (diff <= diffZero) {
    return `${Math.floor(diff / hour)}小时后`;
  } else if (diff <= diffZero + day) {
    return '明天';
  } else if (diff <= diffZero + day * 2) {
    return '后天';
  } else {
    return `${Math.floor(diff / day)}天后`;
  }
}
```



## 常用时间计算

```typescript
/**
 * 只显示日期不显示时间
 */
export function formatShortDate(date) {
  return formatDate(date, DATE_FORMAT);
}

/**
 * 清除时间内的时 分 秒 毫秒信息
 * @param {Date, Number} date 要格式化的时间
 */
export function normalizeDate(date: Date | number): Date {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  return tempDate;
}

/**
 * 计算指定月份第一天星期几
 * @param {number} year 年份
 * @param {number} month  月份
 */
export function getFirstDayOfWeek(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1)).getDay();
}

/**
 * 计算指定月份共多少天
 * @param {number} year 年份
 * @param {number} month  月份
 */
export function getThisMonthDays(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 两日期间隔的 年、月、日数
 */
export function intervalDate(startTime: Date | number, endTime: Date | number) {
  startTime = normalizeDate(startTime);
  endTime = normalizeDate(endTime);

  const startYear = startTime.getFullYear();
  const endYear = endTime.getFullYear();

  const startMonth = startYear * 12 + startTime.getMonth();
  const endMonth = endYear * 12 + endTime.getMonth();

  return {
    year: endYear - startYear,
    month: endMonth - startMonth,
    day: (endTime.getTime() - startTime.getTime()) / ONE_DAY,
  };
}
```

