@echo off
REM 卸载第三方数据解析服务
echo 停止第三方数据解析服务
net stop jessieService
echo 开始第三方数据解析服务... 
%windir%\Microsoft.Net\Framework\v4.0.30319\InstallUtil /u D:\WorkSpace\WhimTech\Jessie\Code\MangoFramework\QuartzDemo\bin\Debug\quartzDemo.exe
