来源：https://blog.csdn.net/Dreamligang/article/details/80981906

## 安装 asar工具包

```sh
npm install -g asar
```

 ## 解压 app.asar

进入到app.asar目录下执行当前命令。

- Windows系统文件路径：`C:\Program Files\StarUML\resources`
- MacOS系统文件路径：`/Applications/StarUML.app/Contents/Resources`

```sh
asar extract app.asar app
```



## 修改源代码

解压之后当前文件夹下有一个新的目录app，真正的验证license的代码在`app\src\engine\license-manager.js`，我们把的这两个方法替换掉。

```js
checkLicenseValidity () {
  this.validate().then(() => {
    setStatus(this, true)
  }, () => {
    //setStatus(this, false)
    // UnregisteredDialog.showDialog()
    setStatus(this, true)
  })
}

/**
 * Check the license key in server and store it as license.key file in local
 *
 * @param {string} licenseKey
 */
register (licenseKey) {
  return new Promise((resolve, reject) => {
    $.post(app.config.validation_url, {licenseKey: licenseKey})
      .done(data => {
      var file = path.join(app.getUserPath(), '/license.key')
      fs.writeFileSync(file, JSON.stringify(data, 2))
      licenseInfo = data
      setStatus(this, true)
      resolve(data)
    })
      .fail(err => {
      setStatus(this, true)
      //if (err.status === 499) { /* License key not exists */
      // reject('invalid')
      //} else {
      //  reject()
      //}
    })
  })
}
```

## 重新打包替换原来的app.asar

```bash
asar pack app app.asar
```



OK，现在就可以正常使用了。