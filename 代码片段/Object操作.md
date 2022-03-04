+++
title = "Object操作"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

### 空对象检测

来源：https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/

```js
function isEmptyObject(value) {
  return !!value && // 👈 null and undefined check
    Object.keys(value).length === 0 && value.constructor === Object;
}

isEmptyObject(new String());   // false ✅
isEmptyObject(new Number());   // false ✅
isEmptyObject(new Boolean());  // false ✅
isEmptyObject(new Array());    // false ✅
isEmptyObject(new RegExp());   // false ✅
isEmptyObject(new Function()); // false ✅
isEmptyObject(new Date());     // false ✅
isEmptyObject(undefined);      // false ✅
isEmptyObject(null);           // false ✅
isEmptyObject({});             // true ✅
isEmptyObject(new Object());   // true ✅
```



## 确保多层对象链存在

```js
// a.b.c = 45  -->  {a: {b: {c: 45}}}
name.split('.').reduce((res, key, index, arr) => {
  const len = arr.length;
  if (index < len - 1) {
    if (!res.hasOwnProperty(key)) res[key] = {};
    res = res[key];
  } else if (index === len - 1) {
    res[arr[len - 1]] = parseValue(value);
  }
  return res;
}, attrs);
```



## 读取对象中的值

```js
/**
* 读取对象中的值
* @param {*} obj
* @param {*} key
*/
export function readObj(obj, key) {
  if (obj && key) {
    const keys = key.split('.');

    for (let i = 0, len = keys.length; i < len; i++) {
      obj = obj[keys[i]];
      if (!obj) {
        if (i === len - 1) {
          return obj;
        } else {
          return;
        }
      }
    }
  }
  return obj;
}
```



## 确保待设置的对象属性存在

```js
/**
 * 确保待设置的对象属性存在
 */
function setObj(obj: object, keyString: string, value: any) {
  const { hasOwnProperty, toString } = Object.prototype;
  keyString.split('.').reduce((res, key, index, arr) => {
    const len = arr.length - 1;
    if (index < len) {
      if (
        !hasOwnProperty.call(res, key)
        || toString.call(res[key]) !== '[object Object]') {
        res[key] = {};
      }
      res = res[key];
    } else if (index === len) {
      res[arr[len]] = parseValue(value);
    }
    return res;
  }, obj);

  return obj;
}

setObj({a: 2}, 'a.b.c', 45); // {a: {b: {c: 45}}}
```

