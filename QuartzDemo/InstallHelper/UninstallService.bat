@echo off
REM ж�ص��������ݽ�������
echo ֹͣ���������ݽ�������
net stop jessieService
echo ��ʼ���������ݽ�������... 
%windir%\Microsoft.Net\Framework\v4.0.30319\InstallUtil /u D:\WorkSpace\WhimTech\Jessie\Code\MangoFramework\QuartzDemo\bin\Debug\quartzDemo.exe
