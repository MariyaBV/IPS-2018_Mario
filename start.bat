@ECHO OFF
set SRVPATH=C:\dev-project\nginx
start /D%SRVPATH% nginx.exe

C:/dev-project/RunHiddenConsole.exe C:/dev-project/php7/php-cgi.exe -b 127.0.0.1:9999 -c C:/dev-project/php7/php.ini