const axios = require('axios');

async function testBrokerLogin() {
  try {
    console.log('🧪 Testing broker login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'broker@labourmobility.com',
      password: 'broker123'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.user.email);
    console.log('Role:', response.data.user.role.name);
    console.log('Token:', response.data.accessToken.substring(0, 50) + '...');
    
    // Test broker dashboard endpoint
    const token = response.data.accessToken;
    console.log('\n🧪 Testing broker dashboard endpoint...');
    
    const dashboardResponse = await axios.get('http://localhost:5000/api/broker/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Dashboard endpoint working!');
    console.log('Broker:', dashboardResponse.data.data.broker.name);
    console.log('Stats:', JSON.stringify(dashboardResponse.data.data.stats, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testBrokerLogin();
