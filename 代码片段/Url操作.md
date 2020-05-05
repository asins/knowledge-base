---
title: "Url操作"
date: "2019-08-21"
lastmod: "2019-08-21"
---

# JS Url 操作

## 从URL中获取domain

```js
/**
 * 获取domain
 * @param {String} url 页面url，不传则取当前页面location.hostname值
 *      url支持 https://xx.com/oo http://xx.com/oo //oo.xx.com/oo  o-o.xx.com/oo 
 * @param {Number} sublevel 需要提取域名以.分隔的段数
 */
function getDomain(url, sublevel){
	if(url){
		url = /^(?:(?:https?:)?\/\/)?([\w-.]+)/i.exec(url);
	}
	url = (url && url[1]) ||  window.location.hostname;
	var domainArr = url.split('.');
	sublevel = Math.min(domainArr.length, Math.abs(parseInt(sublevel)) || 2);
	return domainArr.slice(-sublevel).join('.');
}
```

## URL简单转换（不支持多层对象）

### url -> Obj

注意这个方法不支持URL中带[]的对像传参

```js
/**
 * 获取URL参数对象
 * g.com?&a=1&a=2&b=3+1#a=4 => {a: [1,2,4], b: '3 1'}
 *
 * 注意：不支持URL中带[]的对象列
 */
export function params(url) {
    url = url || location.search || location.href;
    const params = {};
    const reg = /([^\s&?#=\/]+)=([^\s&?#=]+)/g;
    while (reg.exec(url)) {
        const key = decodeURIComponent(RegExp.$1);
        const val = decodeURIComponent(RegExp.$2.replace('+', '%20'));
        if (params[key] === undefined) {
            params[key] = val;
        } else if (isArray(params[key])) {
            params[key].push(val);
        } else {
            params[key] = [ params[key], val ];
        }
    }
    return params;
}
```

### Obj -> Url

```js
/*
 * 序列化param字符串
 * {a: [1,2,4], b: '3 1'} => a=1&a=2&a=4&b=3%201
 * 注意：不支持多级对象传入
 */
export function stringify(params = {}, ignoreArr = []) {
    const arr = [];
    for (const key in params) {
        let val = params[key];
        if (ignoreArr.indexOf(key) === -1 && val !== '' && val != null) {
            if (!Array.isArray(val)) val = [ val ];
            val.forEach(function(val) {
                arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
            });
        }
    }

    return arr.join('&');
}
```

## URL完整转换（支持多层对象）

### Url -> Obj

```js

```



### Obj -> Url

```js
/*
 * Object序列化为String
 * 支持多级数组及对象 b[]=2&b[]=4
 */
function stringify(a) {
    const s = [];

    function add(key, valueOrFunction) {
        const value = isFunction(valueOrFunction) ?
            valueOrFunction() :
            valueOrFunction;

        if (value != '' && value != null) {
            s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
    }

    for (const prefix in a) {
        buildParams(prefix, a[ prefix ], add);
    }

    return s.join('&');
}
const rbracket = /\[\]$/;
function buildParams(prefix, obj, add) {
    if (isArray(obj)) {
        obj.forEach((v, i) => {
            if (rbracket.test(prefix)) {
                add(prefix, v);
            } else {
                buildParams(prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']', v, add);
            }
        });
    } else if (type(obj) === 'object') {
        for (const name in obj) {
            buildParams(prefix + '[' + name + ']', obj[ name ], add);
        }
    } else {
        add(prefix, obj);
    }
}

// Demo：
var obj = {a:1, b:[2, null, '', {d:4, i:function(){return 5;}}], c: {e:6, f: [7, 8], g: {h:9}}};
decodeURIComponent(stringify(obj)); // a=1&b[]=2&b[3][d]=4&b[3][dd]=5&c[e]=6&c[f][]=7&c[f][]=8&c[g][h]=9
```

