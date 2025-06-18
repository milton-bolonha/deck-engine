# 🪟 Instalação Windows - DeckEngine Dashboard

## ⚡ **Solução Rápida para Windows**

O comando que você tentou (`npm run quick-start`) usa comandos Linux que não funcionam no Windows. Aqui estão as soluções:

### **💡 Opção 1: Script Node.js (Recomendado)**

```cmd
# Funciona em qualquer sistema (Windows, Linux, Mac)
npm run quick-start:node
```

### **💡 Opção 2: Script PowerShell Nativo**

```powershell
# PowerShell específico para Windows
npm run quick-start:windows
```

### **💡 Opção 3: Manual (Sempre funciona)**

```cmd
# Passo a passo manual
npm install
node scripts/quick-start.js
```

---

## 🔧 **Instalação Passo a Passo (Windows)**

### **1. Verificar Pré-requisitos**

```cmd
# Verificar Node.js
node --version
# Deve ser 18.0.0 ou superior

# Verificar se DeckEngine server está rodando
# Abrir navegador em: http://localhost:3000/api/system/health
```

### **2. Instalar Dependências**

```cmd
npm install
```

### **3. Configurar Ambiente**

```cmd
# Copiar arquivo de configuração
copy .env.example .env.local

# OU criar manualmente:
echo NEXT_PUBLIC_API_URL=http://localhost:3000 > .env.local
echo NEXT_PUBLIC_WS_URL=ws://localhost:3000 >> .env.local
echo NODE_ENV=development >> .env.local
echo NEXT_PUBLIC_DEV_MODE=true >> .env.local
```

### **4. Criar Estrutura**

```cmd
# Criar diretórios necessários
mkdir components\ui components\layout components\forms
mkdir containers contexts utils data
```

### **5. Iniciar Dashboard**

```cmd
npm run dev
```

**Pronto! Dashboard estará em: http://localhost:3001** 🎉

---

## 🪟 **Comandos Windows Específicos**

```cmd
# Instalar tudo + configurar (Node.js cross-platform)
npm install && node scripts/quick-start.js

# Instalar com PowerShell nativo
npm install && powershell -ExecutionPolicy Bypass -File scripts/quick-start.ps1

# Limpar tudo e recomeçar
rmdir /s /q .next node_modules && del .env.local && npm install

# Verificar se está funcionando
curl http://localhost:3001
```

---

## 🔧 **Comandos PowerShell (Alternativa)**

```powershell
# No PowerShell
npm install
.\scripts\quick-start.ps1

# OU com permissões
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\quick-start.ps1
```

---

## 🚨 **Problemas Comuns Windows**

### **Erro: 'chmod' não é reconhecido**

```cmd
# ✅ SOLUÇÃO: Use o script Node.js
npm run quick-start:node

# OU manualmente
node scripts/quick-start.js
```

### **Erro: Execution Policy**

```powershell
# ✅ SOLUÇÃO: Mudar policy temporariamente
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm run quick-start:windows
```

### **Erro: Porta 3001 em uso**

```cmd
# ✅ SOLUÇÃO: Matar processo
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# OU usar porta diferente
npm run dev -- -p 3002
```

### **Erro: Firewall bloqueia**

```cmd
# ✅ SOLUÇÃO: Permitir Node.js no firewall
# Windows Defender → Permitir app → Adicionar Node.js
```

### **Erro: Antivírus**

```cmd
# ✅ SOLUÇÃO: Adicionar pasta à exceção
# Adicionar C:\Users\<user>\Documents\pipesnow às exceções do antivírus
```

---

## 💡 **Dicas Windows**

### **Terminais Recomendados:**

- **PowerShell** (recomendado)
- **Command Prompt** (cmd)
- **Windows Terminal** (melhor experiência)
- **Git Bash** (para comandos Unix-like)

### **Variáveis de Ambiente:**

```cmd
# Ver todas as variáveis
set

# Definir variável temporária
set NODE_ENV=development

# Definir permanente
setx NODE_ENV development
```

### **Portas e Rede:**

```cmd
# Ver portas em uso
netstat -an | findstr :3001

# Testar conectividade
telnet localhost 3001
```

---

## 🎯 **Próximos Passos**

Após a instalação com sucesso:

1. **Abrir** http://localhost:3001
2. **Explorar** Pipeline Builder
3. **Configurar** providers se necessário
4. **Testar** criação de pipelines

---

## 🆘 **Suporte**

Se ainda tiver problemas:

1. **Verifique** se Node.js 18+ está instalado
2. **Certifique-se** que DeckEngine server está rodando na porta 3000
3. **Use** `node scripts/quick-start.js` diretamente
4. **Verifique** firewall e antivírus

---

**🎮 Windows compatível! O dashboard funciona perfeitamente no Windows!** ✅
