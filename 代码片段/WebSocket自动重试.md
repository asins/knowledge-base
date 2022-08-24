

```typescript 
/**
 * 通过给定的URL初始化websocket，正常初始化websocket完成后返回一个promise resolve, 失败/超时时执行rejects。
 *
 * @param url 初始化的websocket网址
 * @param timeoutMs websocket的超时时间（以毫秒为单位）
 * @param numberOfRetries 初始化失败/超时后应该重试的次数，默认重试2次
 * @return {Promise}
 */
function initWebsocket(
  url: string,
  timeoutMs: number,
  numberOfRetries: number = 2,
): Promise<any> {
  timeoutMs = timeoutMs || 1500;
  let hasReturned = false;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!hasReturned) {
        websocket.close();
        const msg = `opening websocket timed out:${url}`;
        // console.info(`${msg}: ${ url}`);
        rejectInternal(new Error(msg));
      }
    }, timeoutMs);

    const rejectInternal = (e: any) => {
      if (numberOfRetries <= 0) {
        reject(new Error(`[reconnect end]: ${ e.message}`));
      } else if (!hasReturned) {
        hasReturned = true;
        // console.info(`retrying connection to websocket! url: ${ url }, remaining retries: ${ numberOfRetries - 1}`);
        initWebsocket(url, timeoutMs, numberOfRetries - 1).then(resolve, reject);
      }
    };

    const websocket = new WebSocket(url);
    websocket.onopen = function () {
      if (hasReturned) {
        websocket.close();
      } else {
        // console.info(`websocket to opened! url: ${ url}`);
        resolve(websocket);
      }
    };
    websocket.onclose = function (e: any) {
      // console.info(`websocket closed! url: ${ url}`);
      rejectInternal(e);
    };
    websocket.onerror = function (e: any) {
      // console.info(`websocket error! url: ${ url}`);
      rejectInternal(e);
    };
  })
    .then((res) => {
      hasReturned = true;
      return res;
    }, (e) => {
      hasReturned = true;
      throw e;
    });
}
```

