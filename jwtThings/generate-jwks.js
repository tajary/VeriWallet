const fs = require('fs');
const crypto = require('crypto');

function generateJWKSManual() {
  // Read public key
  const publicKey = fs.readFileSync('public.key', 'utf8');
  
  // Extract modulus (n) and exponent (e) from public key
  const key = crypto.createPublicKey(publicKey);
  const jwk = key.export({ format: 'jwk' });
  
  // Add additional properties
  jwk.kid = 'my-key-1';
  jwk.use = 'sig';
  jwk.alg = 'RS256';
  
  // Create JWKS
  const jwks = {
    keys: [jwk]
  };
  
  // Create directory if it doesn't exist
  if (!fs.existsSync('.well-known')) {
    fs.mkdirSync('.well-known', { recursive: true });
  }
  
  // Write to file
  fs.writeFileSync('./.well-known/jwks.json', JSON.stringify(jwks, null, 2));
  console.log('JWKS file created manually');
}

generateJWKSManual();
