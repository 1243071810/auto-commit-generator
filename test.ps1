# 测试 PowerShell SendKeys 功能
# 用于验证脚本是否能正常工作

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName Microsoft.VisualBasic

Write-Host "测试 PowerShell SendKeys 功能..."
Write-Host "请确保 VSCode 已打开并可见"

Start-Sleep -Seconds 2

# 查找 VSCode 窗口
$vscodeProcess = Get-Process | Where-Object { $_.MainWindowTitle -like '*Visual Studio Code*' } | Select-Object -First 1

if (-not $vscodeProcess) {
    Write-Error "未找到 VSCode 窗口，请先打开 VSCode"
    exit 1
}

Write-Host "找到 VSCode 窗口: $($vscodeProcess.MainWindowTitle)"

# 激活 VSCode 窗口
[Microsoft.VisualBasic.Interaction]::AppActivate($vscodeProcess.Id)
Start-Sleep -Milliseconds 500

Write-Host "VSCode 窗口已激活"

# 测试输入
Write-Host "将在 3 秒后测试输入..."
Start-Sleep -Seconds 3

# 输入测试文本
[System.Windows.Forms.SendKeys]::SendWait("Hello, this is a test!")
Write-Host "测试完成！请检查 VSCode 中是否出现了测试文本"
