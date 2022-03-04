+++
title = "mac shell 扩展属性"
template = "page.html"
date = "2019-08-21"
updated = "2020-05-05"
+++


时常在 shell 中执行`ls -alh`命令时都能看到权限后面多了个`@`，查了资料才知道这是 mac 为显示文件所加入的属性，如：

```sh
drwxr-xr-x@  2 asins  staff    68B  7  4 10:23 semantic
```

`xattr semantic`   能显示文件所加入的属性，
com.apple.quarantine

要想删除可以这样，`xattr -d com.apple.quarantine semantic`。

