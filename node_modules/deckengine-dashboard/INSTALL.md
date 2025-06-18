# 🚀 Instalação Rápida - DeckEngine Dashboard

## ⚡ **Instalação Express**

### **🪟 Windows (3 opções)**

```cmd
# Opção 1: Script Batch (mais simples)
# Clique duplo no arquivo: install-windows.cmd
# OU no terminal:
install-windows.cmd

# Opção 2: Script Node.js cross-platform
npm install
npm run quick-start

# Opção 3: PowerShell nativo
npm install
npm run quick-start:windows
```

### **🐧 Linux/Mac**

```bash
# Script bash
npm install
npm run quick-start:linux

# OU cross-platform
npm install
npm run quick-start
```

**Dashboard estará disponível em: http://localhost:3001** 🎉

---

## 🎯 **Pré-requisitos**

- **Node.js 18+**
- **DeckEngine Server** rodando na porta 3000
- **Terminal** com permissões de execução

---

## 🔧 **Instalação Manual**

### 1. **Instalar Dependências**

```bash
npm install
```

### 2. **Configurar Variáveis**

```bash
# Windows
copy .env.example .env.local

# Linux/Mac
cp .env.example .env.local

# Editar configurações
nano .env.local
```

### 3. **Configuração Básica**

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_DEV_MODE=true
```

### 4. **Iniciar Dashboard**

```bash
npm run dev
```

---

## 🪟 **Windows - Métodos de Instalação**

### **📁 Método 1: Clique Duplo (Mais Fácil)**

1. **Clique duplo** no arquivo `install-windows.cmd`
2. **Aguarde** a instalação automática
3. **Siga** as instruções na tela
4. **Pronto!** Dashboard rodando em http://localhost:3001

### **⌨️ Método 2: Command Prompt**

```cmd
# Abra Command Prompt no diretório dashboard/
install-windows.cmd

# OU comando por comando:
npm install
node scripts/quick-start.js
npm run dev
```

### **🔧 Método 3: PowerShell**

```powershell
# PowerShell nativo
npm install
npm run quick-start:windows

# OU permitir execução e usar script
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\scripts\quick-start.ps1
```

---

## 🎮 **Primeiros Passos**

### **Após a instalação:**

1. **Acesse** http://localhost:3001
2. **Explore** as seções na sidebar esquerda
3. **Crie** seu primeiro pipeline no Pipeline Builder
4. **Configure** providers se necessário
5. **Monitore** execuções em tempo real

---

## 🔌 **Configuração de Providers (Opcional)**

### **Stripe (Pagamentos)**

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### **Clerk (Autenticação)**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### **Cloudinary (Mídia)**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789
```

**Configure via interface:** Dashboard → Providers → Selecione o provider

---

## 🎯 **Verificação da Instalação**

### **Testes Básicos:**

```bash
# Verificar se dashboard está respondendo
curl http://localhost:3001

# Verificar conexão com API
curl http://localhost:3000/api/system/health

# Verificar WebSocket (no navegador)
# Abra DevTools → Console → Deve mostrar "Connected to DeckEngine server"
```

---

## 🛠️ **Comandos Úteis**

### **Cross-Platform:**

```bash
npm run dev              # Servidor dev com hot reload
npm run build            # Build para produção
npm run start            # Servidor produção
npm run lint             # Verificar código
npm run quick-start      # Configuração rápida (qualquer OS)
npm run setup            # Configuração interativa
npm run reset            # Reset completo
```

### **Windows Específico:**

```cmd
# Instalação completa (clique duplo)
install-windows.cmd

# OU manual
npm install && node scripts/quick-start.js

# PowerShell específico
npm run quick-start:windows

# Limpar tudo
rmdir /s /q .next node_modules && del .env.local
```

---

## 🚨 **Problemas Comuns**

### **Windows:**

#### **'chmod' não é reconhecido**

```cmd
# ✅ SOLUÇÃO: Use o arquivo install-windows.cmd
install-windows.cmd

# OU script Node.js
npm run quick-start
```

#### **PowerShell Execution Policy**

```powershell
# ✅ SOLUÇÃO: Permitir temporariamente
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm run quick-start:windows
```

#### **Porta 3001 em uso**

```cmd
# ✅ SOLUÇÃO: Matar processo
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# OU usar porta diferente
npm run dev -- -p 3002
```

#### **Firewall/Antivírus**

```cmd
# ✅ SOLUÇÃO:
# - Permitir Node.js no Windows Defender
# - Adicionar pasta às exceções do antivírus
# - Verificar se porta 3001 está liberada
```

### **Universal:**

#### **Dashboard não conecta com API**

```bash
# ✅ Verificar se server está rodando na porta 3000
cd ../server && npm start

# ✅ Verificar variável NEXT_PUBLIC_API_URL
cat .env.local | grep API_URL
```

#### **WebSocket não conecta**

```bash
# ✅ Verificar variável NEXT_PUBLIC_WS_URL
# ✅ Verificar firewall/proxy
# ✅ Verificar se servidor suporta WebSocket
```

---

## 💡 **Dicas por Sistema**

### **Windows:**

- **Use** `install-windows.cmd` para máxima simplicidade
- **Command Prompt** ou **PowerShell** funcionam bem
- **Windows Terminal** oferece melhor experiência
- **Firewall** pode bloquear porta 3001

### **Linux/Mac:**

- **Bash/Zsh** são os terminais padrão
- **Permissões** podem ser necessárias para scripts
- **Use** `sudo` apenas se necessário

---

## 🎉 **Instalação Concluída!**

**Se chegou até aqui, o dashboard está funcionando!** 🚀

### **Próximos passos:**

1. **Explorar** Pipeline Builder (drag & drop)
2. **Testar** execução em tempo real
3. **Configurar** providers se necessário
4. **Criar** seus próprios pipelines

### **Recursos disponíveis:**

- 🎨 **Pipeline Builder Visual**
- ⚡ **Live Execution Monitor**
- 📊 **Analytics Dashboard**
- 👥 **User Management**
- 💳 **Billing System**
- 🔌 **Provider Configuration**

---

**🎮 Windows totalmente suportado! Dashboard funciona perfeitamente!** ✅

**Aproveite o DeckEngine Dashboard!** 🚀
