+++
title = "Git用法记录"
template = "page.html"
date = "2019-08-21"
updated = "2020-05-05"
+++


## Git 用法

### 创建平台访问密钥

创建平台访问密钥后，使用者在 git 平台中的操作的身份验证都通过密钥完成，不会打断正常操作。

```bash
# 1. 先生成密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# 2. 一路回车生成的密钥 (~/.ssh/id_rsa.pub) 内容添加到 git 平台的 SSH Keys 中就完成了
```


### 修改 Git 配置

```bash
# windows 操作系统换行配置
git config --global core.autocrlf input

# 用户名、邮箱配置
git config user.name yourname --local
git config user.email yourname@xx.com --local
```

### 克隆代码库
```bash
git clone git@xx.com:aa/bb.git
```

### 查看分支
```bash
# 列出本地所有的分支
git branch

# 列出远程所有的分支
git branch -r
```

### 创建分支
```bash
# 基于本地分支创建
git branch [BRANCH_NAME]
git push origin [BRANCH_NAME]

# 基于远程分支创建
git branch [BRANCH_NAME] origin/master
```

### 绑定分支
```bash
# 绑定后操作就能省略` origin [branch]`，使用起来更加方便高效，当然如果有多个远程需要操作就不能省略了
git push -u origin [branch]
```

### 切换分支
```bash
# 切换到本地分支，如果本地分支不存在自动寻找远程分支
git checkout [BRANCH_NAME]
```

### 更新分支
1. 更新 master
```bash
git pull --rebase origin master
```

2. 解决 rebase 冲突。
```bash
git status
# 根据提示打开对应文件，搜索"<<<<<<<"字符，解决冲突后执行
git add -u
git rebase --continue
# 停止 pull 操作，回 pull rebase 之前的状态
git rebase --abort
```

### 提交代码
```bash
# 提交到本地版本库
git commit -m "commit message"

# 提交到远程 master
git push origin master
```

### 合并分支
1. 切换到 master。
```bash
git checkout master
```

2. 合并分支。
```bash
git merge --no-ff [BRANCH_NAME]
```

3. 解决 src 目录下的冲突。手动解决[教程](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/)，使用第三方工具解决冲突


```bash
# 解决本次合并的所有冲突
git mergetool

# 解决特定文件的冲突
git mergetool src/js/g.js
```

6. 重新构建 build、dist 目录下的所有冲突的文件。
```bash
ytpm [PATH]
```

5. 提交代码。
```bash
git add .
git commit -m "commit message"
```

### 恢复代码

* 放弃本地修改（废弃本地所有未提交的文件，和远程保持一致）
```bash
git reset --hard origin/master
```

* 恢复一个提交
```bash
git revert [COMMIT_ID]
```

* 恢复 merge
```bash
git revert -m 1 [MERGE_COMMIT_ID]
```

* 恢复到指定版本
```bash
git reset --hard [COMMIT_ID]
```


### 删除分支
```bash
# 删除本地分支
git branch -d [BRANCH_NAME]
# 删除远程分支
git push origin --delete [BRANCH_NAME]
```

### 查看变更记录
```bash
# 查看变更历史
git log --decorate --numstat [PATH]

# 查看某个提交记录
git show --name-only [COMMIT_ID]
```

### 对比文件

1. git 默认方式
```bash
# 对比工作区版本和暂存区版本
git diff -- [PATH]

# 对比暂存区版本和版本库版本
git diff --cached -- [PATH]

# 对比工作区版本和版本库版本 (HEAD)
git diff HEAD -- [PATH]

# 对比两个提交过的文件
git diff [COMMIT_ID_1] [COMMIT_ID_2] -- [PATH]

# 对比两个分支的文件
git diff develop master -- src/js/g.js
git diff develop:src/js/g.js master:src/js/g.js

# 查看其它分支上的文件
git show master:src/js/g.js
```
2. 外部比较工具完成比较

```bash
# 比较本次合并的所有修改（只与提交前的记录比较）
git difftool

# 比较指定文件的历史版本
git difftool [Git Hash] HEAD -- src/js/g.js
```

### 回退本地版本



如果你在本地做了错误提交，那么回退版本的方法很简单
先用下面命令找到要回退的版本的 commit id：

```bash
git reflog
```

接着回退版本：

```bash
git reset --hard Obfafd
```

0bfafd 就是你要回退的版本的 commit id 的前面几位

### 回退远程版本

如果你的错误提交已经推送到自己的远程分支了，那么就需要回滚远程分支了。
首先要回退本地分支：

```bash
git reflog
git reset --hard Obfafd
```

紧接着强制推送到远程分支：

```bash
git push -f
```

> **注意：本地分支回滚后，版本将落后远程分支，必须使用强制推送覆盖远程分支，否则无法推送到远程分支**

## 提交规范


git 每次提交需要标识当前所做修改的类型，以开源社区通用加前缀的做法区分。

- feat: 新功能
- fix:  修复 bug
- docs: 修改文档
- style:  修改代码格式，不影响代码逻辑
- refactor:  重构代码，理论上不影响现有功能
- pref:  提升性能
- test:  增加修改测试用例
- chore:  修改工具相关（包括但不限于文档 代码生成等）
- deps:  升级依赖
- WIP: 功能开发进行中

## 常见问题

### 切换开发中的代码到其它分支

比如不小心在 develop 分支上进行开发，这时可按下面的方法解决

```bash
# 未提交时
git stash
git checkout [BRANCH_NAME]
git stash pop

# 已提交时
git log -1 # 记住 COMMIT ID
git reset --hard origin/develop
git checkout [BRANCH_NAME]
git cherry-pick [COMMIT_ID]
```

### 错误 marge 的处理

如不小心将 develop 或基于 develop 创建的分支合并到 master 上时。

```bash
A--M---B  <---develop
        \
--C--G---J---P---Q  <---master
```

如上例，需要先确认好 J 这次错误提交点以及其之前、之后提交点的 hash 值，并**确保当前 HEAD 处于 Q 上**，接着执行：

```bash
git rebase -i -p --onto P G
```

执行完后需要手工解决之后每次提交出现的冲突，手工比较解决掉冲突后执行：

```bash
git add .   // 添加此次冲突修改
git rebase --continue
```

注意，上面的步骤可能会进行很多次，每次都是上面的方法；手工比较的方法可以参看外部比较工具的使用方式。

### 修改提交记录中用户信息

如果只有一条记录那直接使用下面的命令就可以修改过来：

```sh
git commit --amend --author="asins <name@mail.com>"
```

如果记录比较多就得使用下面的方式了：

```sh
git filter-branch --env-filter '
  # 如果 Git 用户名等于老的 Git 邮箱 wrong@example.com
  WRONG_EMAIL="wrong@example.com"
  NEW_NAME="New Name Value"
  NEW_EMAIL="correct@example.com"
  
  if [ "$GIT_COMMITTER_EMAIL" = "$WRONG_EMAIL" ]
  then
      export GIT_COMMITTER_NAME="$NEW_NAME"
      export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
  fi
  if [ "$GIT_AUTHOR_EMAIL" = "$WRONG_EMAIL" ]
  then
      export GIT_AUTHOR_NAME="$NEW_NAME"
      export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
  fi
' --tag-name-filter cat -- --all 
# --tag-name-filter cat -- --branches --tags
```



## 其它

### Beyond Compare 比较工具配置

在`~/.gitconfig`文件中加入以下配置，使用的比较工具为 Beyond Compare，大家可以自行下载；如果是 win 用户对应的路径需要相应的修改。

另外，Mac 版的 Beyond Compare 4 还需要进行设置让其支持通过命令行的方式调用：点击`菜单 -> Install Commond Line Tools...`然后输入系统登录密码即可。

```bash
[merge]
tool = bcomp
[mergetool]
prompt = false
keepBackup = false
[mergetool "bcomp"]
trustExitCode = true
cmd = "/usr/local/bin/bcomp" "$LOCAL" "$REMOTE" "$BASE" "$MERGED"
[diff]
tool = bcomp
[difftool]
prompt = false
[difftool "bcomp"]
trustExitCode = true
cmd = "/usr/local/bin/bcomp" "$LOCAL" "$REMOTE"
```
### 常用 git Alias

```bash
[alias]
st = status --short --branch
pu = pull --rebase
ca = commit --amend
ci = commit -a -v
br = branch
bv = branch -vv
co = checkout
cb = checkout -b
df = diff
un = reset --hard HEAD
uh = reset --hard HEAD^
ll = log --pretty=format:"%C(yellow)%h%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --numstat
ld = log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph
ls = log --pretty=format:"%C(green)%h\\ %C(yellow)[%ad]%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=relative
```

### 发布到各环境

```bash
# 把 master 分支的代码发布到日常环境
git push origin master:daily/1.0.0

# 发布到线上环境
git push origin master:daily/1.3.105
git tag publish/1.3.105 # 版本号需与日常的一致
git push origin publish/1.3.105
```

发布后，可以到 assets 平台查看发布结果。



### 合并远程 Master
```sh
git fetch -p
git checkout master
git merge origin/master
```



