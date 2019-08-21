## 新建Promise实例

```js
function deferPromise() {
  const deferred = {};
  const promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  deferred.promise = promise;
  return deferred;
}


// 使用时
function getLocalXXX() {
  const defer = deferPromise()
  sync((err, data) => {
    if(err) {
      defer.reject(err);
    } else {
      defer.resolve(data); 
    }
  });

  return defer.promise;
}
```

