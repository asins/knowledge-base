时常在shell中执行`ls -alh`命令时都能看到权限后面多了个`@`，查了资料才知道这是mac为显示文件所加入的属性，如：

```sh
drwxr-xr-x@  2 asins  staff    68B  7  4 10:23 semantic
```

`xattr semantic`   能显示文件所加入的属性，
com.apple.quarantine

要想删除可以这样，`xattr -d com.apple.quarantine semantic`。

