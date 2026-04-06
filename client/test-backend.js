// Test script to verify backend functionality
require("dotenv").config();
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001/api';

async function testBackend() {
  console.log('Testing SurSadhana Backend...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✓ Health check:', healthData);

    // Test subscription plans (doesn't require auth)
    console.log('\n2. Testing subscription plans...');
    const plansResponse = await fetch(`${BASE_URL}/subscription/plans`);
    const plansData = await plansResponse.json();
    console.log('✓ Subscription plans:', plansData.plans?.length || 0, 'plans available');

    console.log('\n✅ Backend is running successfully!');
    console.log('Note: Authentication features require MongoDB connection.');

  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure the server is running: npm run server');
    console.log('2. Check if port 5000 is available');
    console.log('3. For full functionality, set up MongoDB connection');
  }
}

testBackend();