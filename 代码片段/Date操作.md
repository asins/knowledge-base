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

