#!/bin/bash

# Script de prueba para los endpoints Kanban
# Asegúrate de que el servidor esté corriendo en http://localhost:3010

BASE_URL="http://localhost:3010"

echo "🧪 Testing Kanban Endpoints"
echo "============================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para hacer requests y mostrar resultados
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: ${description}${NC}"
    echo "Request: $method $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X $method "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE/d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Status: $http_code${NC}"
    elif [ "$http_code" -ge 400 ] && [ "$http_code" -lt 500 ]; then
        echo -e "${YELLOW}⚠ Status: $http_code (Expected for error tests)${NC}"
    else
        echo -e "${RED}✗ Status: $http_code${NC}"
    fi
    
    echo "Response:"
    echo "$body" | jq . 2>/dev/null || echo "$body"
    echo ""
    echo "---"
    echo ""
}

# 1. GET /positions/:id/candidates - Caso exitoso
test_endpoint "GET" "/positions/1/candidates" "" "GET candidates for position 1"

# 2. GET /positions/:id/candidates - Posición que no existe
test_endpoint "GET" "/positions/999/candidates" "" "GET candidates for non-existent position (should 404)"

# 3. GET /positions/:id/candidates - ID inválido
test_endpoint "GET" "/positions/abc/candidates" "" "GET candidates with invalid ID (should 400)"

# 4. PUT /candidates/:id/stage - Actualización exitosa
# Usamos candidate2 que solo tiene 1 application en position1 (interviewFlow1) donde existe "Initial Screening"
test_endpoint "PUT" "/candidates/2/stage" '{"stage": "Initial Screening"}' "PUT update candidate stage (success - candidate2 to Initial Screening)"

# 5. PUT /candidates/:id/stage - Actualización exitosa con Manager Interview
# candidate2 está en position1 (interviewFlow1) donde SÍ existe "Manager Interview"
test_endpoint "PUT" "/candidates/2/stage" '{"stage": "Manager Interview"}' "PUT update to Manager Interview (success)"

# 6. PUT /candidates/:id/stage - Stage faltante
test_endpoint "PUT" "/candidates/1/stage" '{}' "PUT update without stage (should 400)"

# 7. PUT /candidates/:id/stage - Stage vacío
test_endpoint "PUT" "/candidates/1/stage" '{"stage": ""}' "PUT update with empty stage (should 400)"

# 8. PUT /candidates/:id/stage - Candidato que no existe
test_endpoint "PUT" "/candidates/999/stage" '{"stage": "Technical Interview"}' "PUT update for non-existent candidate (should 404)"

# 9. PUT /candidates/:id/stage - Stage que no existe
test_endpoint "PUT" "/candidates/2/stage" '{"stage": "Non-existent Stage"}' "PUT update with non-existent stage (should 404)"

echo "✅ Tests completados!"
echo ""
echo "Nota: Algunos tests esperan códigos 400/404, esto es normal."
