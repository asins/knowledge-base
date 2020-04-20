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