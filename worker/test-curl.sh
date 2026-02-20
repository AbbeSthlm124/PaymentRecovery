#!/bin/bash
# Test Worker connectivity (run after deploying)

WORKER_URL="https://sparkling-king-60e0.abbe-stockholm1.workers.dev/submit"
ORIGIN="http://localhost:3000"

echo "1. OPTIONS preflight:"
curl -s -X OPTIONS "$WORKER_URL" \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -D - -o /dev/null

echo ""
echo "2. Simple test (test=1):"
curl -s -X POST "${WORKER_URL}?test=1" -H "Origin: $ORIGIN"

echo ""
echo ""
echo "3. Full POST:"
curl -s -X POST "$WORKER_URL" \
  -H "Origin: $ORIGIN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hi","website":""}'
