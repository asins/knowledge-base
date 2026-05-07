## 删除旧版本

```bash
→ which npm
/usr/local/bin/npm
→ readlink -f $(which npm)
/usr/local/lib/node_modules/npm

# 相应的删除命令
rm /usr/local/bin/npm
rm -rf /usr/local/lib/node_modules/npm
```



## npm无法使用

可能是NodeJs升级后默认开启了 strict-ssl功能导致的

```bash
npm config set strict-ssl=false
```

