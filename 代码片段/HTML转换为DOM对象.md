---
title: "HTML转换为DOM对象"
date: "2019-08-21"
lastmod: "2019-08-21"
---

# 将String转换为HTML DOM对象

### 方法一： 使用`Range.createContextualFragment()`

```js
/**
 * createContextualFragment ie9不支持，所以需要加fixed
 * Range对象从IE9+支持，所以IE8不可用
 */
function create(html){
	document.createRange().createContextualFragment(html)
}

// shim ie9 createContextualFragment
var RP = Range.prototype;
var RPdoc = document.implementation.createHTMLDocument('');
var RPrange = RPdoc.createRange();
var RPbody = RPdoc.body;
if (!RP.createContextualFragment) {
    RP.createContextualFragment = function (html) {
        RPbody.innerHTML = html;
        RPrange.selectNodeContents(RPbody);
        return RPrange.extractContents();
    };
}
```

