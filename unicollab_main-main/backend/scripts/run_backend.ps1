if (!(Test-Path venv)) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

Write-Host "Activating virtual environment..."
$env:VIRTUAL_ENV = "$PWD\venv"
$env:PATH = "$PWD\venv\Scripts;$env:PATH"

Write-Host "Installing dependencies..."
.\venv\Scripts\pip.exe install -r requirements.txt supabase uvicorn fastapi

Write-Host "Starting FastAPI server..."
.\venv\Scripts\python.exe -c "import uvicorn; uvicorn.run('app.main:app', host='127.0.0.1', port=8000, reload=True)"
