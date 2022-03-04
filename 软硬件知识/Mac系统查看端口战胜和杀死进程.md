+++
title = "Mac系统查看端口战胜和杀死进程"
template = "page.html"
date = "2019-08-21"
updated = "2020-05-05"
+++


# Mac 系统查看端口占用和杀死进程

## 查看进程占用

方式一，使用`lsof`查询，显示的结果觉得不是太好查找
```sh
lsof -i tcp:8080
```

方式二：使用`nettop`，很容易看到结果，但不能结合 grep 是个遗憾
```sh
nettop -nm tcp
```

该命令会显示占用 8080 端口的进程，有其 pid , 可以通过 pid 关掉该进程

## 杀死进程

```sh
kill -9 pid
```

