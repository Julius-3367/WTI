/**
 * Test script to update candidate profile
 * Run with: node test-profile-update.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// You'll need to get a valid token first by logging in
// Replace this with your actual JWT token
const TOKEN = 'YOUR_JWT_TOKEN_HERE';

async function testProfileUpdate() {
  console.log('🧪 Testing Candidate Profile Update...\n');

  try {
    // Step 1: Get current profile
    console.log('📋 Step 1: Fetching current profile...');
    const profileResponse = await axios.get(`${API_URL}/candidate/profile`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    console.log('✅ Current Profile:');
    console.log('   Name:', profileResponse.data.data.user.firstName, profileResponse.data.data.user.lastName);
    console.log('   Email:', profileResponse.data.data.user.email);
    console.log('   Phone:', profileResponse.data.data.user.phone);
    console.log('   Nationality:', profileResponse.data.data.nationality || 'Not set');
    console.log('   City:', profileResponse.data.data.city || 'Not set');
    console.log('');

    // Step 2: Update profile
    console.log('📝 Step 2: Updating profile...');
    const updateData = {
      firstName: 'Updated',
      lastName: 'TestName',
      phone: '+1234567890',
      nationality: 'Test Country',
      city: 'Test City',
      address: '123 Test Street',
      dateOfBirth: '1990-01-01',
    };

    const updateResponse = await axios.put(
      `${API_URL}/candidate/profile`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Profile Updated Successfully!');
    console.log('   Updated Name:', updateResponse.data.data.user.firstName, updateResponse.data.data.user.lastName);
    console.log('   Updated Phone:', updateResponse.data.data.user.phone);
    console.log('   Updated Nationality:', updateResponse.data.data.nationality);
    console.log('   Updated City:', updateResponse.data.data.city);
    console.log('');

    // Step 3: Verify the changes
    console.log('🔍 Step 3: Verifying changes...');
    const verifyResponse = await axios.get(`${API_URL}/candidate/profile`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    console.log('✅ Verified Profile:');
    console.log('   Name:', verifyResponse.data.data.user.firstName, verifyResponse.data.data.user.lastName);
    console.log('   Phone:', verifyResponse.data.data.user.phone);
    console.log('   Nationality:', verifyResponse.data.data.nationality);
    console.log('   City:', verifyResponse.data.data.city);
    console.log('');

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message || error.response.data);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}

// Helper function to get a token by logging in
async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

// Main execution
(async () => {
  // If TOKEN is not set, try to login
  if (TOKEN === 'YOUR_JWT_TOKEN_HERE') {
    console.log('⚠️  No token provided. Please either:');
    console.log('   1. Set TOKEN in the script, OR');
    console.log('   2. Provide login credentials\n');

    // Example: Uncomment and set your credentials
    // const email = 'candidate@example.com';
    // const password = 'your_password';
    // const token = await login(email, password);
    // console.log('✅ Logged in! Token:', token.substring(0, 20) + '...\n');

    console.log('📝 To get a token:');
    console.log('   1. Open your browser');
    console.log('   2. Login to the application');
    console.log('   3. Open DevTools (F12) → Console');
    console.log('   4. Type: localStorage.getItem("token")');
    console.log('   5. Copy the token and paste it in this script\n');
    process.exit(0);
  }

  await testProfileUpdate();
})();
