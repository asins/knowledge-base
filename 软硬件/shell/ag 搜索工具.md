+++
title = "ag 搜索工具"
template = "page.html"
date = "2019-08-21"
updated = "2019-08-21"
+++


## 常用参数 

- `-i` 忽略大小写
- `-l` 只列出文件名
- `-g` 文件名匹配
- `—php` 只搜索php文件
- `--ignore-dir` 忽略目录

如：`ag --ignore-dir sitedata --php hx /www/static`



### 举例

### 显示在./app下文件内容有value_at字段的文件列表

```
ag value_at  -l ./app
```

