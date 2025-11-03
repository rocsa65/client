@echo off
echo Building MyFinance Client Docker Image...

REM Build the Docker image
docker build -t myfinance-client:latest .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo To run the container:
    echo   docker run -p 3000:80 myfinance-client:latest
    echo.
    echo To run with docker-compose:
    echo   docker-compose up
    echo.
    echo To run development version:
    echo   docker-compose --profile dev up frontend-dev
) else (
    echo.
    echo ❌ Build failed!
    exit /b 1
)