@echo off
REM ��װ���������ݽ�������
echo ��ʼ��װ���������ݽ�������... 
%windir%\Microsoft.Net\Framework\v4.0.30319\InstallUtil D:\WorkSpace\WhimTech\Jessie\Code\MangoFramework\QuartzDemo\bin\Debug\quartzDemo.exe

pause

echo �������������ݽ�������
net start "demoService"

pause
