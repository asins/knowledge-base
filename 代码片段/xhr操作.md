+++
title = "xhr操作"
template = "page.html"
date = "2019-08-21"
updated = "2019-08-21"
+++


## Headers操作

```js
// XMLHttpRequest Header解析
function parseHeaders(headers) {
    const result = {};
    headers = String(headers).trim().split('\n');
    headers.forEach(row => {
        const index = row.indexOf(':');
        const key = row.slice(0, index).trim().toLowerCase();
        const value = row.slice(index + 1).trim();
        const result_key = result[key];
        if (result_key === undefined) {
            result[key] = value;
        } else if (isArray(result_key)) {
            result_key.push(value);
        } else {
            result[key] = [ result_key, value ];
        }
    });

    return result;
}
```

### 简单的ajax操作文件

 [ajax.js](./assets/ajax.js) 