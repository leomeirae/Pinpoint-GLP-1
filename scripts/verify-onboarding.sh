#!/bin/bash

# Script de Verificação do Onboarding com Vídeo
# Execute: bash scripts/verify-onboarding.sh

echo "🎬 Verificando implementação do Onboarding com Vídeo..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de checks
PASSED=0
FAILED=0

# Função para verificar
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((FAILED++))
    fi
}

# 1. Verificar se vídeo existe
echo "📁 Verificando arquivos..."
if [ -f "assets/videos/onboarding.mp4" ]; then
    SIZE=$(du -h assets/videos/onboarding.mp4 | cut -f1)
    check 0 "Vídeo encontrado (${SIZE})"
else
    check 1 "Vídeo não encontrado em assets/videos/"
fi

# 2. Verificar se welcome.tsx existe
if [ -f "app/(auth)/welcome.tsx" ]; then
    check 0 "Tela welcome.tsx criada"
else
    check 1 "Arquivo welcome.tsx não encontrado"
fi

# 3. Verificar se expo-av está instalado
if grep -q '"expo-av"' package.json; then
    check 0 "expo-av instalado no package.json"
else
    check 1 "expo-av não encontrado no package.json"
fi

# 4. Verificar se plugin expo-av está no app.json
if grep -q '"expo-av"' app.json; then
    check 0 "Plugin expo-av configurado no app.json"
else
    check 1 "Plugin expo-av não encontrado no app.json"
fi

# 5. Verificar se route welcome está no _layout.tsx
if grep -q 'name="welcome"' "app/(auth)/_layout.tsx"; then
    check 0 "Rota welcome configurada no auth layout"
else
    check 1 "Rota welcome não encontrada no _layout.tsx"
fi

# 6. Verificar se index.tsx redireciona para welcome
if grep -q "/(auth)/welcome" "app/index.tsx"; then
    check 0 "index.tsx redireciona para welcome"
else
    check 1 "Redirecionamento para welcome não encontrado"
fi

# 7. Verificar imports do expo-av
if grep -q "from 'expo-av'" "app/(auth)/welcome.tsx"; then
    check 0 "Imports do expo-av corretos"
else
    check 1 "Imports do expo-av não encontrados"
fi

# 8. Verificar configuração de áudio
if grep -q "Audio.setAudioModeAsync" "app/(auth)/welcome.tsx"; then
    check 0 "Configuração de áudio iOS implementada"
else
    check 1 "Configuração de áudio não encontrada"
fi

# 9. Verificar se useShotsyColors está importado
if grep -q "useShotsyColors" "app/(auth)/welcome.tsx"; then
    check 0 "Hook useShotsyColors importado"
else
    check 1 "Hook useShotsyColors não encontrado"
fi

# 10. Verificar se há erros de TypeScript no welcome.tsx
echo ""
echo "🔍 Verificando TypeScript..."
TSC_OUTPUT=$(npx tsc --noEmit 2>&1 | grep "welcome.tsx")
if [ -z "$TSC_OUTPUT" ]; then
    check 0 "Sem erros de TypeScript no welcome.tsx"
else
    check 1 "Erros de TypeScript encontrados:"
    echo "$TSC_OUTPUT"
fi

# Resumo
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "📊 Resumo: ${GREEN}${PASSED} checks passaram${NC} | ${RED}${FAILED} falharam${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Tudo pronto!${NC} Execute:"
    echo ""
    echo "  npx expo start --clear"
    echo ""
    echo "Depois pressione 'i' para iOS ou 'a' para Android"
    echo ""
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Alguns checks falharam. Revise a implementação.${NC}"
    echo ""
    exit 1
fi
