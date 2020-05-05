---
title: "Mac中brew使用及配置"
date: "2019-08-21"
lastmod: "2020-05-05"
---

## 更新源

替换 homebrew 使用阿里云的源

### 替换 brew.git:
```sh
cd "$(brew --repo)"
git remote set-url origin https://mirrors.aliyun.com/homebrew/brew.git
```

### 替换 homebrew-core.git
```sh
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.aliyun.com/homebrew/homebrew-core.git
```

### 替换 homebrew-bottles

`homebrew-bottles`是 Homebrew 二进制预编译包的镜像

```sh
# fish 中在 ~/.config/fish/config.fish 中加入
set -x HOMEBREW_BOTTLE_DOMAIN https://mirrors.aliyun.com/homebrew/homebrew-bottles
source ~/.config/fish/config.fish


# zsh 中
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc
```


### 应用生效
```sh
brew update
```

## 换回官方源

```bash
# 重置 brew.git:
cd "$(brew --repo)"

# 重置 homebrew-core.git:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://github.com/Homebrew/homebrew-core.git

# 在~/.zshrc 或 ~/.config/fish/config.fish 中删除 HOMEBREW_BOTTLE_DOMAIN 设置
```



## 参数说明

### --prefix

