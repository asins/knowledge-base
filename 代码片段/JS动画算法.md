+++
title = "JS动画算法"
template = "page.html"
date = "2019-08-21"
updated = "2019-08-21"
+++


## 缓动小算法

用一个简单的公式表示就是：`A = A + (B - A) / 2`，翻译一下就是：我下一秒的位置 = 现在位置 + 现在和初恋之间距离的一半。

运动用的定时器可以使用`requestAnimationFrame`，对于不支持的浏览器，可以使用下面的兼容代码：

```js
// requestAnimationFrame的兼容处理
if (!window.requestAnimationFrame) {
    requestAnimationFrame = function(fn) {
        setTimeout(fn, 17);
    };	
}
```
整理成通用方法

```js
/**
 * 缓动动画算法
 * @param {Number} start 起始位置
 * @param {Number} end 目标位置
 * @param {Number} rate 缓动速率
 * @param {Function} 变化的位置回调，会传入`value`、`isEnding`两参数。
 *   @param {Number} value 当前位置
 *   @param {Boolean} isEnding 是否动画结束了
 */
function easeOut(start, end, rate, callback) {
  end = end || 0;
  rate = rate || 2;
  
  if( start == end || typeof start != 'number') {
    return;
  }
  
  var step = function() {
    start = start + (end - start) / rate;
    if(Math.abs(end - start) < 1) {
      callback(end, true);
      return;
    }
    callback(start, false);
    return requestAnimationFrame(step);
  };
  return step();
}
```

简单使用：

```js
// 回到页面顶部
var doc = document.documentElement || document.body;
easeOut(doc.scrollTop, end, 2, function(value) {
  doc.scrollTop = value;
});

// 回到指定高度
var doc = document.documentElement || document.body;
easeOut(doc.scrollTop, 500, 4, function(value) {
  doc.scrollTop = value;
});
```

## Tween算法库

[Tween Github](https://github.com/zhangxinxu/Tween)

