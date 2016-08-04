@echo off
REM 安装第三方数据解析服务
echo 开始安装第三方数据解析服务... 
%windir%\Microsoft.Net\Framework\v4.0.30319\InstallUtil D:\WorkSpace\WhimTech\Jessie\Code\MangoFramework\QuartzDemo\bin\Debug\quartzDemo.exe

pause

echo 启动第三方数据解析服务
net start "demoService"

pause
