## 一、读

始终是字符操作比正则匹配快。

```js
function getCookie(name, cookie) {
  if (!cookie) cookie = document.cookie;
  var setPos = cookie.indexOf(name + '=');
  var stopPos = cookie.indexOf(';', setPos);

  return !~setPos ? null : decodeURIComponent(cookie.substring(
    setPos, ~stopPos ? stopPos : undefined
  ).split('=')[1]);
}
```

测试可看：https://jsperf.com/cookie-parsing/17



## 二、写





----

## 三、完整实现库

```js
/*
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
function api(key, value, attributes) {
  // Write
  if (arguments.length > 1) {
    attributes = Object.assign({
      path: '/',
    }, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
    }

    // We're using "expires" because "max-age" is not supported by IE
    attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

    try {
      const result = JSON.stringify(value);
      if (/^[\{\[]/.test(result)) {
        value = result;
      }
    } catch (e) { }

    value = encodeURIComponent(String(value))
        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

    key = encodeURIComponent(String(key))
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[\(\)]/g, escape);

    let stringifiedAttributes = '';
    for (const attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue;
      }
      stringifiedAttributes += '; ' + attributeName;
      if (attributes[attributeName] === true) {
        continue;
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie = key + '=' + value + stringifiedAttributes);
  }

  // Read
  const jar = {};
  const decode = function(s) {
    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  };
  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all.
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  let i = 0;

  for (; i < cookies.length; i++) {
    const parts = cookies[i].split('=');
    let cookie = parts.slice(1).join('=');

    if (!this.json && cookie.charAt(0) === '"') {
      cookie = cookie.slice(1, -1);
    }

    try {
      const name = decode(parts[0]);
      cookie = decode(cookie);

      if (this.json) {
        try {
          cookie = JSON.parse(cookie);
        } catch (e) {}
      }

      jar[name] = cookie;

      if (key === name) {
        break;
      }
    } catch (e) {}
  }

  return key ? jar[key] : jar;
}

api.set = api;
api.get = function(key) {
  return api.call(api, key);
};
api.getJSON = function() {
  return api.apply({
    json: true,
  }, arguments);
};
api.remove = function(key, attributes) {
  api(key, '', Object.assign(attributes, {
    expires: -1,
  }));
};

export default api;

```

