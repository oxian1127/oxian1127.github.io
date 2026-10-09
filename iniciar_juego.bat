@echo off
title Codigo Cero - El Rescate de Ciudad Algoritmia
echo ============================================================
echo   INICIANDO CODIGO CERO: EL RESCATE DE CIUDAD ALGORITMIA
echo ============================================================
echo.
echo Abriendo navegador en http://localhost:8080 ...
start "" "http://localhost:8080"
echo.
echo Iniciando servidor web local en el puerto 8080...
echo (Manten esta ventana abierta mientras juegues)
echo.
python -m http.server 8080
pause
