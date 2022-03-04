+++
title = "Chrome"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

开一个忽略ssl证书、orign跨域情况的浏览器：

```sh
open -n /Applications/Google\ Chrome.app/ --args --disable-web-security --user-data-dir=/Users/sk/MyChromeDevUserData/ --test-type --ignore-certificate-errors
```

