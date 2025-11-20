# Certificate Generation Demo Guide

## Quick Demo Setup for Senior Management

### Step 1: Create Demo Enrollments
```bash
cd /home/julius/WTI/backend
node scripts/createDemoEnrollments.js
```

### Step 2: Generate Certificates
```bash
node scripts/createTestCertificates.js
```

### Step 3: View Certificates in UI
1. Login to WTI Dashboard as Admin
2. Navigate to **Certificate Management** → **Certificates** tab
3. You'll see all generated certificates with:
   - Download button (📥) - Downloads PDF to computer
   - Print button (🖨️) - Opens PDF for printing

### Step 4: Generate New Certificate via UI
1. Click **"Generate Certificate"** button (top right)
2. Select a completed enrollment from dropdown
3. Click **"Generate Certificate"**
4. Certificate appears in list instantly
5. Download or print immediately

### Test Certificates Available
The scripts create certificates for:
- Jane Doe - Customer Service Excellence  
- Jane Doe - Digital Marketing Fundamentals
- Jane Doe - Data Analysis with Excel
- Jane Doe - Professional Communication Skills

### Download Certificate via API (for testing)
```bash
# Generate auth token
TOKEN=$(cd /home/julius/WTI/backend && node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({ id: 1, email: 'admin@wti.com', role: 'Admin' }, 'your-super-secret-jwt-key-here', { expiresIn: '1h' }));")

# Download certificate (replace ID as needed)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/admin/certificates/2/download \
  -o certificate.pdf

# View certificate
xdg-open certificate.pdf  # Linux
open certificate.pdf      # Mac
```

### Certificate Features
✅ Professional A4 landscape format
✅ Single-page design
✅ Decorative borders and watermark
✅ Candidate name prominently displayed
✅ Course title and institution name
✅ Issue date and certificate number
✅ Dual signature sections
✅ Verification footer text

### Key Selling Points for Demo
1. **Automated** - Generated instantly when student completes program
2. **Professional** - High-quality PDF suitable for printing and framing
3. **Secure** - Unique certificate numbers and digital signatures
4. **Trackable** - Full audit trail of who, when, and what
5. **Printable** - One-click printing from browser
6. **Downloadable** - Students can download their own copies
7. **Verifiable** - Certificate number for authenticity checks

