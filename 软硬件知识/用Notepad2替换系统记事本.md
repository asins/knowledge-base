
保存以下内容到Notepad2程序目录并命名为`run.bat`，然后执行：

```bat
@echo off
cd /d "%~dp0"
echo.
echo 正在绿化...
cd /d "%~dp0"
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\notepad.exe" /v "Debugger" /d "\"%~dp0Notepad2.exe\" /z" /f
cls
echo.
echo 绿化完毕
echo.
pause
```


