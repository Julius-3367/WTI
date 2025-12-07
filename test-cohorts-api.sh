#!/bin/bash

# Test cohorts API endpoint
echo "=== Testing Cohorts API ==="

# Login and get token
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@labourmobility.com", "password": "admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "ERROR: Failed to get token"
    echo "$LOGIN_RESPONSE" | jq '.'
    exit 1
fi

echo "✓ Login successful"

# Test cohorts endpoint
echo ""
echo "2. Fetching cohorts..."
COHORTS_RESPONSE=$(curl -s "http://localhost:5000/api/cohorts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$COHORTS_RESPONSE" | jq '.'

# Count cohorts
COHORT_COUNT=$(echo "$COHORTS_RESPONSE" | jq '.cohorts | length')
echo ""
echo "Total cohorts found: $COHORT_COUNT"
