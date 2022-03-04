+++
title = "promise"
template = "page.html"
date = "2019-08-21"
updated = "2019-08-21"
+++


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



### Promise Above

````js
var abortController = null;


// if ( abortController ) {
//   abortController.abort();

//   abortController = null;
//   target.innerText = 'Calculate';

//   return;
// }

abortController = new AbortController();

calculate(abortController.signal)
  .then((result) => {
  console.log('then', result );
})
  .then(() => {
  console.log('then2');
})
  .catch((e) => {
  console.log(e, ' catch  WHY DID YOU DO THAT?!!');
  throw e;
})
  .then(() => {
  console.log('then3');
})
  .finally(() => {
  abortController = null;
  console.log('finally');
});


function calculate( abortSignal ) {
  return new Promise( ( resolve, reject ) => {
    const error = new Error( 'Calculation aborted by user', 'AbortError' );

    if ( abortSignal.aborted ) {
      return reject( error );
    }

    const timeout = setTimeout( ()=> {
      resolve( 1 );
    }, 5000 );

    abortSignal.addEventListener( 'abort', () => {
      clearTimeout( timeout );
      reject( error );
    } );
  });
}
````