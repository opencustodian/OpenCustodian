const fs = require('fs');
const path = require('path');

// Simplified validator for OpenCustodian samples
// Validates structure and required fields

function validateAll() {
  const samplesDir = path.join(__dirname, '../generated-samples');
  
  if (!fs.existsSync(samplesDir)) {
    console.log('\n⚠️  No generated samples found. Run "npm run generate" first.\n');
    return;
  }

  console.log('\n✅ Validating OpenCustodian Test Samples\n');

  const samples = fs.readdirSync(samplesDir).filter(f => f.endsWith('.json')).sort();

  if (samples.length === 0) {
    console.log('No samples found in generated-samples directory.');
    return;
  }

  console.log(`Found ${samples.length} sample file(s):\n`);

  let successCount = 0;
  let failureCount = 0;

  // Validate each sample
  for (const sample of samples) {
    const samplePath = path.join(samplesDir, sample);
    
    try {
      const data = JSON.parse(fs.readFileSync(samplePath, 'utf8'));

      // Determine validation type based on filename
      if (sample.includes('envelope')) {
        if (validateEnvelope(data, sample)) {
          successCount++;
        } else {
          failureCount++;
        }
      } else if (sample.includes('proof-of-reserves')) {
        if (validateProofStructure(data, sample, 'proof-of-reserves')) {
          successCount++;
        } else {
          failureCount++;
        }
      } else if (sample.includes('proof-of-liabilities')) {
        if (validateProofStructure(data, sample, 'proof-of-liabilities')) {
          successCount++;
        } else {
          failureCount++;
        }
      }
    } catch (error) {
      console.log(`✗ Parse Error - ${sample}`);
      console.log(`  Error: ${error.message}`);
      failureCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${successCount} passed, ${failureCount} failed`);
  console.log('='.repeat(50) + '\n');

  if (failureCount > 0) {
    process.exit(1);
  }
}

function validateEnvelope(data, filename) {
  const required = ['metadata', 'payload', 'hashSignature'];
  const missing = required.filter(field => !(field in data));

  if (missing.length > 0) {
    console.log(`✗ Envelope Structure - ${filename}`);
    console.log(`  Missing fields: ${missing.join(', ')}`);
    return false;
  }

  // Validate metadata
  const meta = data.metadata;
  if (!meta.version || !meta.generatedAt || !meta.custodian) {
    console.log(`✗ Envelope Metadata - ${filename}`);
    console.log(`  Invalid metadata structure`);
    return false;
  }

  // Validate payload
  const payload = data.payload;
  if (!payload || payload.format !== 'OpenCustodian' || !Array.isArray(payload.proofObjects)) {
    console.log(`✗ Envelope Payload - ${filename}`);
    console.log(`  Invalid payload structure`);
    return false;
  }

  // Validate proofObjects is array
  if (payload.proofObjects.length === 0) {
    console.log(`✗ Envelope Structure - ${filename}`);
    console.log(`  proofObjects must be non-empty array`);
    return false;
  }

  // Validate each proof object
  for (let i = 0; i < payload.proofObjects.length; i++) {
    const proof = payload.proofObjects[i];
    if (!proof.metadata || !proof.metadata.type || !proof.payload) {
      console.log(`✗ Envelope Structure - ${filename}`);
      console.log(`  Invalid proof object structure at index ${i}`);
      return false;
    }
  }

  console.log(`✓ Envelope Structure - ${filename}`);
  return true;
}

function validateProofStructure(data, filename, proofType) {
  const requiredFields = {
    'proof-of-reserves': {
      payload: ['snapshotAt', 'holdings']
    },
    'proof-of-liabilities': {
      payload: ['snapshotAt', 'users', 'merkleRoot']
    }
  };

  if (!data.metadata || !data.payload) {
    console.log(`✗ ${proofType} Structure - ${filename}`);
    console.log(`  Missing metadata or payload`);
    return false;
  }

  const required = requiredFields[proofType].payload;
  const missing = required.filter(field => !(field in data.payload));

  if (missing.length > 0) {
    console.log(`✗ ${proofType} Payload - ${filename}`);
    console.log(`  Missing required fields: ${missing.join(', ')}`);
    return false;
  }

  // Verify metadata type matches
  if (data.metadata.type !== proofType) {
    console.log(`✗ ${proofType} Metadata - ${filename}`);
    console.log(`  Metadata type mismatch: expected "${proofType}", got "${data.metadata.type}"`);
    return false;
  }

  console.log(`✓ ${proofType} Structure - ${filename}`);
  return true;
}

validateAll();
