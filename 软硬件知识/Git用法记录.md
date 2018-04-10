## Git用法
### 修改Git配置
```sh
# windows操作系统换行配置
git config --global core.autocrlf input

# 用户名、邮箱配置
git config user.name yourname --local
git config user.email yourname@xx.com --local
```

### 克隆代码库
```sh
git clone git@xx.com:aa/bb.git
```

### 查看分支
```sh
# 列出本地所有的分支
git branch

# 列出远程所有的分支
git branch -r
```

### 创建分支
```sh
# 基于本地分支创建
git branch [BRANCH_NAME]
git push origin [BRANCH_NAME]

# 基于远程分支创建
git branch [BRANCH_NAME] origin/master
```

### 绑定分支
```sh
# 绑定后操作就能省略` origin [branch]`，使用起来更加方便高效，当然如果有多个远程需要操作就不能省略了
git push -u origin [branch]
```

### 切换分支
```sh
# 切换到本地分支，如果本地分支不存在自动寻找远程分支
git checkout [BRANCH_NAME]
```

### 更新分支
1. 更新master
```sh
git pull --rebase origin master
```

2. 解决rebase冲突。
```sh
git status
# 根据提示打开对应文件，搜索"<<<<<<<"字符，解决冲突后执行
git add -u
git rebase --continue
# 停止pull操作，回pull rebase之前的状态
git rebase --abort
```

### 提交代码
```sh
# 提交到本地版本库
git commit -m "commit message"

# 提交到远程master
git push origin master
```

### 合并分支
1. 切换到master。
```sh
git checkout master
```

2. 合并分支。
```sh
git merge --no-ff [BRANCH_NAME]
```

3. 解决src目录下的冲突。手动解决[教程](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/)，使用第三方工具解决冲突


```sh
# 解决本次合并的所有冲突
git mergetool

# 解决特定文件的冲突
git mergetool src/js/g.js
```

6. 重新构建build、dist目录下的所有冲突的文件。
```sh
ytpm [PATH]
```

5. 提交代码。
```sh
git add .
git commit -m "commit message"
```

### 恢复代码

* 放弃本地修改（废弃本地所有未提交的文件，和远程保持一致）
```sh
git reset --hard origin/master
```

* 恢复一个提交
```sh
git revert [COMMIT_ID]
```

* 恢复merge
```sh
git revert -m 1 [MERGE_COMMIT_ID]
```

* 恢复到指定版本
```sh
git reset --hard [COMMIT_ID]
```


### 删除分支
```sh
# 删除本地分支
git branch -d [BRANCH_NAME]
# 删除远程分支
git push origin --delete [BRANCH_NAME]
```

### 查看变更记录
```sh
# 查看变更历史
git log --decorate --numstat [PATH]

# 查看某个提交记录
git show --name-only [COMMIT_ID]
```

### 对比文件

1. git默认方式
```sh
# 对比工作区版本和暂存区版本
git diff -- [PATH]

# 对比暂存区版本和版本库版本
git diff --cached -- [PATH]

# 对比工作区版本和版本库版本(HEAD)
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

```sh
# 比较本次合并的所有修改(只与提交前的记录比较)
git difftool

# 比较指定文件的历史版本
git difftool [Git Hash] HEAD -- src/js/g.js
```

## 常见问题

### 切换开发中的代码到其它分支

比如不小在在develop分支上进行开发，这时可按下面的方法解决

```sh
# 未提交时
git stash
git checkout [BRANCH_NAME]
git stash pop

# 已提交时
git log -1 # 记住COMMIT ID
git reset --hard origin/develop
git checkout [BRANCH_NAME]
git cherry-pick [COMMIT_ID]
```

### 错误marge的处理

如不小心将develop或基于develop创建的分支合并到master上时。

```sh
A--M---B  <---develop
        \
--C--G---J---P---Q  <---master
```

如上例，需要先确认好J这次错误提交点以及其之前、之后提交点的hash值，并**确保当前HEAD处于Q上**，接着执行：

```sh
git rebase -i -p --onto P G
```

执行完后需要手工解决之后每次提交出现的冲突，手工比较解决掉冲突后执行：

```sh
git add .   // 添加此次冲突修改
git rebase --continue
```

注意，上面的步骤可能会进行很多次，每次都是上面的方法；手工比较的方法可以参看外部比较工具的使用方式。

## 其它

### Beyond Compare比较工具配置

在`~/.gitconfig`文件中加入以下配置，使用的比较工具为Beyond Compare，大家可以自行下载；如果是win用户对应的路径需要相应的修改。

另外，Mac版的 Beyond Compare 4 还需要进行设置让其支持通过命令行的方式调用：点击`菜单 -> Install Commond Line Tools...`然后输入系统登录密码即可。

```sh
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
​### 常用git Alias

```sh
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

```sh
# 把master分支的代码发布到日常环境
git push origin master:daily/1.0.0

# 发布到线上环境
git push origin daily/1.3.105
git tag publish/1.3.105 # 版本号需与日常的一致
git push origin publish/1.3.105

# 合并远程Master
git fetch -p
git checkout master
git merge origin/master
```

发布后，可以到assets平台查看发布结果。
