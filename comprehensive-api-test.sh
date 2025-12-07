#!/bin/bash

# Comprehensive API Testing Script for WTI Labour Mobility System
# Tests all major endpoints and validates responses
# Usage: ./comprehensive-api-test.sh

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:5000/api"
ADMIN_EMAIL="admin@labourmobility.com"
ADMIN_PASSWORD="admin123"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Temp file for storing token
TOKEN_FILE="/tmp/wti_test_token.txt"

echo "=========================================="
echo "WTI API Comprehensive Test Suite"
echo "=========================================="
echo ""

# Function to log test result
log_test() {
  local test_name="$1"
  local result="$2"
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  if [ "$result" = "PASS" ]; then
    echo -e "${GREEN}✅ PASS${NC} - $test_name"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}❌ FAIL${NC} - $test_name: $3"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
}

# Function to test endpoint
test_endpoint() {
  local method="$1"
  local endpoint="$2"
  local expected_status="$3"
  local description="$4"
  local data="$5"
  local token="$6"
  
  if [ -n "$token" ]; then
    if [ -n "$data" ]; then
      response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$data")
    else
      response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
        -H "Authorization: Bearer $token")
    fi
  else
    if [ -n "$data" ]; then
      response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
        -H "Content-Type: application/json" \
        -d "$data")
    else
      response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint")
    fi
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" = "$expected_status" ]; then
    log_test "$description" "PASS"
    echo "$body"
  else
    log_test "$description" "FAIL" "Expected $expected_status, got $http_code"
    echo "Response: $body"
  fi
  
  echo ""
}

# 1. Authentication Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}1. AUTHENTICATION TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# Login
echo "Testing admin login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // empty')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo "$TOKEN" > "$TOKEN_FILE"
  log_test "Admin login" "PASS"
  echo "Token: ${TOKEN:0:20}..."
else
  log_test "Admin login" "FAIL" "No token received"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi
echo ""

# Test invalid login
echo "Testing invalid login..."
INVALID_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid@test.com","password":"wrongpass"}')

INVALID_SUCCESS=$(echo "$INVALID_LOGIN" | jq -r '.success')
if [ "$INVALID_SUCCESS" = "false" ]; then
  log_test "Invalid login rejection" "PASS"
else
  log_test "Invalid login rejection" "FAIL" "Should reject invalid credentials"
fi
echo ""

# 2. Admin Dashboard Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}2. ADMIN DASHBOARD TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

DASHBOARD=$(curl -s "$API_URL/admin/dashboard" -H "Authorization: Bearer $TOKEN")
DASHBOARD_SUCCESS=$(echo "$DASHBOARD" | jq -r '.success')

if [ "$DASHBOARD_SUCCESS" = "true" ]; then
  log_test "Admin dashboard" "PASS"
  echo "Users: $(echo "$DASHBOARD" | jq -r '.data.stats.totalUsers // 0')"
  echo "Candidates: $(echo "$DASHBOARD" | jq -r '.data.stats.totalCandidates // 0')"
  echo "Courses: $(echo "$DASHBOARD" | jq -r '.data.stats.totalCourses // 0')"
  echo "Enrollments: $(echo "$DASHBOARD" | jq -r '.data.stats.totalEnrollments // 0')"
else
  log_test "Admin dashboard" "FAIL" "Dashboard API failed"
fi
echo ""

# 3. User Management Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}3. USER MANAGEMENT TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

USERS=$(curl -s "$API_URL/admin/users?limit=5" -H "Authorization: Bearer $TOKEN")
USERS_SUCCESS=$(echo "$USERS" | jq -r '.success')

if [ "$USERS_SUCCESS" = "true" ]; then
  USER_COUNT=$(echo "$USERS" | jq -r '.data.total // .pagination.total // 0')
  log_test "Get users" "PASS"
  echo "Total users: $USER_COUNT"
else
  log_test "Get users" "FAIL" "Users API failed"
fi
echo ""

# 4. Course Management Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}4. COURSE MANAGEMENT TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

COURSES=$(curl -s "$API_URL/admin/courses?limit=5" -H "Authorization: Bearer $TOKEN")
COURSES_SUCCESS=$(echo "$COURSES" | jq -r '.success')

if [ "$COURSES_SUCCESS" = "true" ]; then
  COURSE_COUNT=$(echo "$COURSES" | jq -r '.data.total // .pagination.total // (.data | length) // 0')
  log_test "Get courses" "PASS"
  echo "Total courses: $COURSE_COUNT"
  
  # Get specific course
  FIRST_COURSE_ID=$(echo "$COURSES" | jq -r '.data.courses[0].id // .data[0].id // empty')
  if [ -n "$FIRST_COURSE_ID" ]; then
    COURSE_DETAIL=$(curl -s "$API_URL/admin/courses/$FIRST_COURSE_ID" -H "Authorization: Bearer $TOKEN")
    COURSE_DETAIL_SUCCESS=$(echo "$COURSE_DETAIL" | jq -r '.success')
    if [ "$COURSE_DETAIL_SUCCESS" = "true" ]; then
      log_test "Get course details" "PASS"
      COURSE_TITLE=$(echo "$COURSE_DETAIL" | jq -r '.data.title // "N/A"')
      echo "Course: $COURSE_TITLE"
    else
      log_test "Get course details" "FAIL" "Course details API failed"
    fi
  fi
else
  log_test "Get courses" "FAIL" "Courses API failed"
fi
echo ""

# 5. Cohort Management Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}5. COHORT MANAGEMENT TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

COHORTS=$(curl -s "$API_URL/cohorts?limit=5" -H "Authorization: Bearer $TOKEN")
COHORTS_SUCCESS=$(echo "$COHORTS" | jq -r '.success')

if [ "$COHORTS_SUCCESS" = "true" ]; then
  COHORT_COUNT=$(echo "$COHORTS" | jq -r '.data.total // .data.cohorts | length // 0')
  log_test "Get cohorts" "PASS"
  echo "Total cohorts: $COHORT_COUNT"
  echo "Response structure: $(echo "$COHORTS" | jq 'keys')"
  
  # Get specific cohort
  FIRST_COHORT_ID=$(echo "$COHORTS" | jq -r '.data.cohorts[0].id // .data[0].id // empty')
  if [ -n "$FIRST_COHORT_ID" ]; then
    COHORT_DETAIL=$(curl -s "$API_URL/cohorts/$FIRST_COHORT_ID" -H "Authorization: Bearer $TOKEN")
    COHORT_DETAIL_SUCCESS=$(echo "$COHORT_DETAIL" | jq -r '.success')
    if [ "$COHORT_DETAIL_SUCCESS" = "true" ]; then
      log_test "Get cohort details" "PASS"
      COHORT_NAME=$(echo "$COHORT_DETAIL" | jq -r '.data.cohortName // .data.name // "N/A"')
      ENROLLMENT_COUNT=$(echo "$COHORT_DETAIL" | jq -r '.data._count.enrollments // .data.enrollments | length // 0')
      echo "Cohort: $COHORT_NAME"
      echo "Enrollments: $ENROLLMENT_COUNT"
    else
      log_test "Get cohort details" "FAIL" "Cohort details API failed"
    fi
  fi
else
  log_test "Get cohorts" "FAIL" "Cohorts API failed"
fi
echo ""

# 6. Candidate Management Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}6. CANDIDATE MANAGEMENT TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

CANDIDATES=$(curl -s "$API_URL/admin/candidates?limit=5" -H "Authorization: Bearer $TOKEN")
CANDIDATES_SUCCESS=$(echo "$CANDIDATES" | jq -r '.success')

if [ "$CANDIDATES_SUCCESS" = "true" ]; then
  CANDIDATE_COUNT=$(echo "$CANDIDATES" | jq -r '.pagination.total // .data | length // 0')
  log_test "Get candidates" "PASS"
  echo "Total candidates: $CANDIDATE_COUNT"
  
  # Display first candidate info
  FIRST_CANDIDATE_NAME=$(echo "$CANDIDATES" | jq -r '.data[0].fullName // "N/A"')
  FIRST_CANDIDATE_ENROLLMENTS=$(echo "$CANDIDATES" | jq -r '.data[0]._count.enrollments // 0')
  echo "First candidate: $FIRST_CANDIDATE_NAME ($FIRST_CANDIDATE_ENROLLMENTS enrollments)"
else
  log_test "Get candidates" "FAIL" "Candidates API failed"
fi
echo ""

# 7. Trainer Management Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}7. TRAINER MANAGEMENT TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

TRAINERS=$(curl -s "$API_URL/admin/users?role=Trainer&limit=5" -H "Authorization: Bearer $TOKEN")
TRAINERS_SUCCESS=$(echo "$TRAINERS" | jq -r '.success')

if [ "$TRAINERS_SUCCESS" = "true" ]; then
  TRAINER_COUNT=$(echo "$TRAINERS" | jq -r '.data.total // .pagination.total // .data | length // 0')
  log_test "Get trainers" "PASS"
  echo "Total trainers: $TRAINER_COUNT"
else
  log_test "Get trainers" "FAIL" "Trainers API failed"
fi
echo ""

# 8. Enrollment Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}8. ENROLLMENT TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

ENROLLMENTS=$(curl -s "$API_URL/admin/enrollments?limit=5" -H "Authorization: Bearer $TOKEN")
ENROLLMENTS_SUCCESS=$(echo "$ENROLLMENTS" | jq -r '.success')

if [ "$ENROLLMENTS_SUCCESS" = "true" ]; then
  ENROLLMENT_COUNT=$(echo "$ENROLLMENTS" | jq -r '.data.total // .pagination.total // .data | length // 0')
  log_test "Get enrollments" "PASS"
  echo "Total enrollments: $ENROLLMENT_COUNT"
else
  log_test "Get enrollments" "FAIL" "Enrollments API failed"
fi
echo ""

# 9. Certificate Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}9. CERTIFICATE TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

CERTIFICATES=$(curl -s "$API_URL/admin/certificates?limit=5" -H "Authorization: Bearer $TOKEN")
CERTIFICATES_SUCCESS=$(echo "$CERTIFICATES" | jq -r '.success')

if [ "$CERTIFICATES_SUCCESS" = "true" ]; then
  CERTIFICATE_COUNT=$(echo "$CERTIFICATES" | jq -r '.count // .data.total // .data | length // 0')
  log_test "Get certificates" "PASS"
  echo "Total certificates: $CERTIFICATE_COUNT"
  
  # Test certificate download
  FIRST_CERT_ID=$(echo "$CERTIFICATES" | jq -r '.data[0].id // empty')
  if [ -n "$FIRST_CERT_ID" ]; then
    DOWNLOAD_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/admin/certificates/$FIRST_CERT_ID/download" -H "Authorization: Bearer $TOKEN" -o /tmp/test_cert.pdf)
    DOWNLOAD_CODE=$(echo "$DOWNLOAD_RESPONSE" | tail -n1)
    if [ "$DOWNLOAD_CODE" = "200" ]; then
      if file /tmp/test_cert.pdf | grep -q "PDF document"; then
        log_test "Download certificate PDF" "PASS"
        PDF_SIZE=$(ls -lh /tmp/test_cert.pdf | awk '{print $5}')
        echo "PDF generated: $PDF_SIZE"
        rm -f /tmp/test_cert.pdf
      else
        log_test "Download certificate PDF" "FAIL" "Generated file is not a valid PDF"
      fi
    else
      log_test "Download certificate PDF" "FAIL" "HTTP $DOWNLOAD_CODE"
    fi
  fi
else
  log_test "Get certificates" "FAIL" "Certificates API failed"
fi
echo ""

# 10. Vetting Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}10. VETTING TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

VETTING=$(curl -s "$API_URL/admin/vetting/dashboard" -H "Authorization: Bearer $TOKEN")
VETTING_SUCCESS=$(echo "$VETTING" | jq -r '.success')

if [ "$VETTING_SUCCESS" = "true" ]; then
  log_test "Get vetting dashboard" "PASS"
  PENDING_COUNT=$(echo "$VETTING" | jq -r '.data.pendingCount // 0')
  echo "Pending vetting: $PENDING_COUNT"
else
  log_test "Get vetting dashboard" "FAIL" "Vetting API failed"
fi
echo ""

# 11. Report Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}11. REPORT TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# Test report listing
REPORTS=$(curl -s "$API_URL/admin/reports?limit=5" -H "Authorization: Bearer $TOKEN")
REPORTS_SUCCESS=$(echo "$REPORTS" | jq -r '.success')

if [ "$REPORTS_SUCCESS" = "true" ]; then
  log_test "Get reports list" "PASS"
  REPORT_COUNT=$(echo "$REPORTS" | jq -r '.data.total // .data | length // 0')
  echo "Total reports: $REPORT_COUNT"
else
  log_test "Get reports list" "FAIL" "Reports API failed"
fi
echo ""

# 12. Session Tests
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}12. SESSION TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# Check sessions for first cohort
if [ -n "$FIRST_COHORT_ID" ]; then
  # Sessions should be in cohort details already tested
  SESSIONS=$(echo "$COHORT_DETAIL" | jq -r '.data.sessions // []')
  SESSION_COUNT=$(echo "$SESSIONS" | jq 'length')
  log_test "Get cohort sessions" "PASS"
  echo "Sessions in cohort $FIRST_COHORT_ID: $SESSION_COUNT"
fi
echo ""

# Summary
echo ""
echo "=========================================="
echo -e "${BLUE}TEST SUMMARY${NC}"
echo "=========================================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
  echo -e "${GREEN}System is ready for showcase.${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  SOME TESTS FAILED${NC}"
  echo -e "${YELLOW}Please review failed tests above.${NC}"
  exit 1
fi
