
```js
/**
 * var fn1 = function(a,b){console.log(a,b)};
 * var fn2 = function(a,b){console.log(a,b); return true};
 *
 * later(1000, fn1, 3, 5); //一秒后运行fn1，并将3,5做为参数传给fn1
 *
 * later('a', 1000, fn1);
 * later('a'); // 立刻停止'a'定时器
 * later('a', true); // 立刻执行fn1
 *
 * later('b', 1000, fn2); // fn2中返回值为true，则每隔1秒执行一次fn2
 * later('b', false); // 立刻停止'b'定时器
 */
var laterCache = {};
var later = function() {
    var sliceArgs = 3,
        args = arguments,
        data = {}, id = args[0],
        delay = args[1],
        callback = args[2]
 
    if (type(id) !== 'string') {
        sliceArgs--;
        id = 0;
        delay = args[0];
        callback = args[1];
    }
 
    if (id) {
        data = laterCache[id] || (laterCache[id] = {})
    }
 
    // 清除此ID原有延时事件
    if (data.id) {
        clearTimeout(data.id);
        delete data.id;
    }
 
    if (callback) {
        data.fn = function(noPollingLoop) {
            callback.apply(window, Array.prototype.slice.call(args, sliceArgs)) === true && !noPollingLoop ?actuallySetTimeout() : cleanUp();
        };
        actuallySetTimeout();
    } else if (data.fn) {
        delay === undefined ? cleanUp() : data.fn(delay === false);
        return true;
    } else {
        cleanUp();
    }
 
    function cleanUp() {
        if (id) {
            delete laterCache[id];
        }
    }
 
    function actuallySetTimeout() {
        data.id = setTimeout(function() {
            data.fn();
        }, delay);
    }
}
```