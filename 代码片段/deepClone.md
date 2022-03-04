+++
title = "deepClone"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

## 尝试拷贝
来源：https://github.com/davidmarkclements/rfdc

```js
/**
 * 对象的深度拷贝
 * 克隆所有JSON类型：Object Array Number String null
 * 附加支持：Date (复制) undefined (复制)
 */

export default function clone(o) {
  if (typeof o !== 'object' || o === null) return o;
  if (o instanceof Date) return new Date(o);
  if (Array.isArray(o)) return cloneArray(o, clone);
  const o2 = {};
  for (const k in o) {
    if (Object.hasOwnProperty.call(o, k) === false) continue;
    const cur = o[k];
    if (typeof cur !== 'object' || cur === null) {
      o2[k] = cur;
    } else if (cur instanceof Date) {
      o2[k] = new Date(cur);
    } else {
      o2[k] = clone(cur);
    }
  }
  return o2;
}

function cloneArray(a, fn) {
  const keys = Object.keys(a);
  const a2 = new Array(keys.length);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const cur = a[k];
    if (typeof cur !== 'object' || cur === null) {
      a2[k] = cur;
    } else if (cur instanceof Date) {
      a2[k] = new Date(cur);
    } else {
      a2[k] = fn(cur);
    }
  }
  return a2;
}
```

