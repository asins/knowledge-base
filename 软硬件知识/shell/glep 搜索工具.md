```sh
grep -rnw '/path/to/somewhere/' -e 'pattern'
```

- `-r` 不仅匹配当前目录，还匹配其子目录
- `-n` 列出行并显示行号
- `-w` 匹配整个单词
- `-l` 仅列出符合匹配的文件，而不列出匹配的具体行
- `-e` is the pattern used during the search

除了这些，`--exclude`、`--include`、`--exclude-dir` 标志可用于高效搜索：

- 这只会搜索那些具有 `.c` 或 `.h` 扩展名的文件：

```sh
grep --include=\*.{c,h} -rnw '/path/to/somewhere/' -e "pattern"
```

- 这将排除搜索所有以 `.o` 扩展名结尾的文件：

```sh
grep --exclude=\*.o -rnw '/path/to/somewhere/' -e "pattern"
```

- 对于目录，可以使用`--exclude-dir` 参数排除一个或多个目录。例如，这将排除目录 `dir1/`、`dir2/` 以及所有与 *.dst/ 匹配的目录：

```sh
grep --exclude-dir={dir1,dir2,*.dst} -rnw '/path/to/somewhere/' -e "pattern"
```

有关更多选项，请检查 `man grep`。