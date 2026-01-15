# Script PowerShell para reemplazar console.log y console.error con LoggerService
# Este script actualiza automáticamente los componentes restantes

$componentsToUpdate = @(
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\clientes\components\cliente-form\cliente-form.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\clientes\components\cliente-editar\cliente-editar.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\clientes\components\cliente-view\cliente-view.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\prestamos\components\prestamos-crear\prestamos-crear.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\prestamos\components\prestamos-crear-agro\prestamos-crear.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\prestamos\components\prestamos-editar\prestamos-editar.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\prestamos\components\prestamos-editar-agro\prestamos-editar.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\prestamos\components\prestamos-lista\prestamos-lista.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\prestamos\components\prestamos-view\prestamos-view.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\prestamos\components\prestamos-view-agro\prestamos-view.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\pagos\components\pagos-lista\pagos-lista.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\pages\components\header\header.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\login\login-two\login-two.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\login\logout-button\logout-button.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\home\components\home\home.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\movimientos\components\movimiento-lista\movimiento-lista.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\vista-cliente\components\vista-cliente-one\vista-cliente-one.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\vista-cliente\components\cliente-prestamo-view\cliente-prestamo-view.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\admin\components\usuarios-lista\usuarios-lista.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\reports\components\report-button.component\report-button.component.component.ts",
    "c:\Users\guilo\Desktop\controlprendario-frontend\src\app\reports\components\report-maquina.component\report-button.component.component.ts"
)

function Update-ComponentWithLogger {
    param (
        [string]$filePath
    )
    
    if (-not (Test-Path $filePath)) {
        Write-Host "Archivo no encontrado: $filePath" -ForegroundColor Yellow
        return
    }
    
    $content = Get-Content $filePath -Raw
    $modified = $false
    
    # 1. Agregar import de LoggerService si no existe
    if ($content -notmatch "import.*LoggerService") {
        # Encontrar la última línea de imports
        $lines = $content -split "`r?`n"
        $lastImportIndex = -1
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "^import ") {
                $lastImportIndex = $i
            }
        }
        
        if ($lastImportIndex -ge 0) {
            $importStatement = "import { LoggerService } from '../../../core/services/logger.service';"
            # Ajustar la ruta según la profundidad del archivo
            $depth = ($filePath -split "\\").Count - ($filePath -split "src\\app\\").Count
            $relativePath = "../" * ($depth - 1) + "core/services/logger.service"
            $importStatement = "import { LoggerService } from '$relativePath';"
            
            $lines = $lines[0..$lastImportIndex] + $importStatement + $lines[($lastImportIndex + 1)..($lines.Count - 1)]
            $content = $lines -join "`r`n"
            $modified = $true
        }
    }
    
    # 2. Inyectar LoggerService en el constructor si no existe
    if ($content -match "constructor\s*\(" -and $content -notmatch "private logger: LoggerService") {
        # Buscar el constructor y agregar logger
        $content = $content -replace "(constructor\s*\([^)]*)", '$1, private logger: LoggerService'
        # Limpiar si quedó una coma al inicio
        $content = $content -replace "constructor\s*\(\s*,", "constructor("
        $modified = $true
    }
    
    # 3. Reemplazar console.log con this.logger.log
    if ($content -match "console\.log") {
        $content = $content -replace "console\.log\(", "this.logger.log("
        $modified = $true
    }
    
    # 4. Reemplazar console.error con this.logger.error
    if ($content -match "console\.error") {
        $content = $content -replace "console\.error\(", "this.logger.error("
        $modified = $true
    }
    
    # 5. Reemplazar console.warn con this.logger.warn
    if ($content -match "console\.warn") {
        $content = $content -replace "console\.warn\(", "this.logger.warn("
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "✓ Actualizado: $filePath" -ForegroundColor Green
    } else {
        Write-Host "- Sin cambios: $filePath" -ForegroundColor Gray
    }
}

Write-Host "`n=== Iniciando actualización de componentes ===" -ForegroundColor Cyan
Write-Host "Total de archivos a procesar: $($componentsToUpdate.Count)`n" -ForegroundColor Cyan

foreach ($file in $componentsToUpdate) {
    Update-ComponentWithLogger -filePath $file
}

Write-Host "`n=== Actualización completada ===" -ForegroundColor Cyan
Write-Host "`nVerificando archivos restantes con console.log..." -ForegroundColor Yellow

# Buscar archivos que aún tengan console.log o console.error
$remainingFiles = Get-ChildItem -Path "c:\Users\guilo\Desktop\controlprendario-frontend\src\app" -Recurse -Filter "*.ts" | 
    Where-Object { (Get-Content $_.FullName -Raw) -match "console\.(log|error|warn)" }

if ($remainingFiles.Count -gt 0) {
    Write-Host "`nArchivos que aún contienen console statements:" -ForegroundColor Yellow
    $remainingFiles | ForEach-Object { Write-Host "  - $($_.FullName)" }
} else {
    Write-Host "`n✓ ¡Todos los console statements han sido reemplazados!" -ForegroundColor Green
}
