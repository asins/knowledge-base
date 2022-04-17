+++
title = "Array操作"
template = "page.html"
date = "2020-02-24"
updated = "2020-04-14"

+++

### 创建每项值自增长的数组

```typescript
function createAutoIncrementArray(len) {
  return Array.apply(null, {
    length: len
  }).map((_x, i) => i + 1);
}
```



### 对Array分组

```js
const result = Array.apply(null, {
  length: Math.ceil(data.length / groupByNum)
}).map((x, i) => {
  return data.slice(i * groupByNum, (i + 1) * groupByNum);
});
```

代码中`Array.apply(null, {length: 5})` length 为特殊字段，意思是生成一个长度为5的数组，由于没赋值，所以都是`undefined`, 如果要赋值，可以这样：
```js
console.log(Array.apply(null, {0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', length:5})); //["a", "b", "c", "d", "e"]
```

现在ES6基本普及，利用`Array.from`方法能具有更好的可读性，改进发下：

```js
function arraySplit(list, limitLen) {
  return Array.from(Array(Math.ceil(list.length / limitLen)), (_, i) => {
      return list.slice(i * limitLen, (i + 1) * limitLen);
    });
}

// out: [[2, 3, 4], [5, 6, 7], [8]]
arraySplit([2, 3, 4, 5, 6, 7, 8], 3);
```

使用`reduce` 方法来实现也是挺简单，运算复杂度都只有n：

```js
function arraySplit(list, limitLen) {
  return list.reduce((res, item, i) => {
    const key = parseInt(i / limitLen);
    if(!res[key]) res[key] = [];
    res[key].push(item);
    return res;
  }, []);
}
```



### 类Array对象转为Array

```js
/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
export function toArray(obj) {
  return Array.prototype.slice.call(obj, 0);
}
```

### 按key对数组中的对象做过虑，sort存在则同时按key排序

```typescript
/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1,n:'a'},{id:2},{id:1,n:'b'}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1,n:'a'},{id:2}]
 */
export function uniqueArray(src, key, sort?: boolean) {
  let results = [];
  const values = [];
  let i = 0;

  while (i < src.length) {
    const val = key ? src[i][key] : src[i];
    if (inArray(values, val) < 0) {
      results.push(src[i]);
    }
    values[i] = val;
    i++;
  }

  if (sort) {
    if (!key) {
      results = results.sort();
    } else {
      results = results.sort((a, b) => {
        return a[key] - b[key];
      });
    }
  }

  return results;
}
```

### 在一个数组中查找一个对象
```typescript
/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
export function inArray(src, find, findByKey?) {
    if (src.indexOf && !findByKey) {
    return src.indexOf(find);
    } else {
    let i = 0;
    while (i < src.length) {
      if ((findByKey && src[i][findByKey] === find) || (!findByKey && src[i] === find)) {
        return i;
      }
      i++;
    }
    return -1;
    }
}
```