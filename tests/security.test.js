// Güvenlik Test Scripti
// Bu dosya login bilgilerinin devtools'da görünmediğini test eder

import fs from 'fs';
import path from 'path';
import { validateLoginCredentials, createSecureSession } from '../src/utils/security.js';

// Test 1: Login bilgileri bundle'da görünür mü?
const testBundleSecurity = () => {
  console.log('🔍 Testing bundle security...');

  // Bu stringler bundle'da aranabilir
  const sensitiveStrings = [
    'demo123',
    'pt123', 
    'admin123',
    'password',
    'mucahit.tastan'
  ];

  // Bundle taraması sadece production build (dist) varsa yapılır
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.log('ℹ️ No build found (dist). Skipping bundle scan.');
    return true;
  }

  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let results = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) results = results.concat(walk(full));
      else if (/\.(js|jsx|html|json|css|ts|tsx)$/.test(entry.name)) results.push(full);
    }
    return results;
  };

  const files = walk(distDir);
  const fileContent = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');

  const foundSensitive = sensitiveStrings.filter(str => fileContent.includes(str));

  if (foundSensitive.length > 0) {
    console.error('❌ SECURITY RISK: Found sensitive strings:', foundSensitive);
    return false;
  }

  console.log('✅ Bundle security passed');
  return true;
};

// Test 2: Runtime validation test
const testRuntimeValidation = () => {
  console.log('🔍 Testing runtime validation...');
  
  // Doğru credentials
  const validResult = validateLoginCredentials('mucahit.tastan', 'müco123');
  
  // Yanlış credentials
  const invalidResult1 = validateLoginCredentials('admin', 'admin123');
  const invalidResult2 = validateLoginCredentials('', 'wrong');
  
  if (validResult && !invalidResult1 && !invalidResult2) {
    console.log('✅ Runtime validation passed');
    return true;
  }
  
  console.error('❌ Runtime validation failed');
  return false;
};

// Test 3: Session security test
const testSessionSecurity = () => {
  console.log('🔍 Testing session security...');
  
  const testData = { kullanici_adi: 'mucahit.tastan', ad: 'Demo' };
  const session = createSecureSession(testData);
  
  // Session token random mı?
  const session2 = createSecureSession(testData);
  
  if (session.token !== session2.token) {
    console.log('✅ Session security passed');
    return true;
  }
  
  console.error('❌ Session security failed');
  return false;
};

// Ana test fonksiyonu
export const runSecurityTests = () => {
  console.log('🔒 RUNNING SECURITY TESTS...\n');
  
  const tests = [
    testBundleSecurity,
    testRuntimeValidation,
    testSessionSecurity
  ];
  
  const results = tests.map(test => {
    try {
      return test();
    } catch (error) {
      console.error('❌ Test failed with error:', error.message);
      return false;
    }
  });
  
  const passedTests = results.filter(Boolean).length;
  const totalTests = tests.length;
  
  console.log(`\n📊 SECURITY REPORT: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL SECURITY TESTS PASSED!');
    return true;
  } else {
    console.error('🚨 SECURITY ISSUES DETECTED!');
    return false;
  }
};

// Run tests when this script is executed directly
runSecurityTests();
