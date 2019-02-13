## 更新源

替换homebrew使用阿里云的源

### 替换brew.git:
```sh
cd "$(brew --repo)"
git remote set-url origin https://mirrors.aliyun.com/homebrew/brew.git
```

### 替换homebrew-core.git
```sh
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.aliyun.com/homebrew/homebrew-core.git
```

### 替换homebrew-bottles

`homebrew-bottles`是 Homebrew 二进制预编译包的镜像

```sh
# fish中在 ~/.config/fish/config.fish 中加入
set -x HOMEBREW_BOTTLE_DOMAIN https://mirrors.aliyun.com/homebrew/homebrew-bottles
source ~/.config/fish/config.fish


# zsh中
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc
```


### 应用生效
```sh
brew update
```

## 换回官方源

```bash
# 重置brew.git:
cd "$(brew --repo)"

# 重置homebrew-core.git:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://github.com/Homebrew/homebrew-core.git

# 在~/.zshrc 或 ~/.config/fish/config.fish中删除HOMEBREW_BOTTLE_DOMAIN设置
```



## 参数说明

### --prefix

