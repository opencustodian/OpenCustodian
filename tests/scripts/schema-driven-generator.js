const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');

/**
 * SchemaResolver: Loads and resolves JSON schemas with $ref support
 */
class SchemaResolver {
  constructor() {
    this.cache = {};
    this.schemaRoot = path.join(__dirname, '../../formats');
  }

  /**
   * Map OpenCustodian URLs to local file paths
   */
  resolveUrl(url) {
    if (url === 'https://raw.githubusercontent.com/opencustodian/OpenCustodian/main/formats/common-definitions.schema.json') {
      return path.join(this.schemaRoot, 'common-definitions.schema.json');
    }

    if (url.startsWith('https://raw.githubusercontent.com/opencustodian/OpenCustodian/main/formats/')) {
      const relative = url.replace('https://raw.githubusercontent.com/opencustodian/OpenCustodian/main/formats/', '');
      return path.join(this.schemaRoot, relative);
    }

    if (url.startsWith('https://github.com/opencustodian/OpenCustodian/tree/main/formats/')) {
      const relative = url.replace('https://github.com/opencustodian/OpenCustodian/tree/main/formats/', '');
      return path.join(this.schemaRoot, relative);
    }

    if (url.startsWith('https://github.com/opencustodian/OpenCustodian/blob/main/formats/')) {
      const relative = url.replace('https://github.com/opencustodian/OpenCustodian/blob/main/formats/', '');
      return path.join(this.schemaRoot, relative);
    }

    if (url === 'https://github.com/opencustodian/schemas/formats/common-definitions.schema.json') {
      return path.join(this.schemaRoot, 'common-definitions.schema.json');
    }

    if (url.startsWith('https://github.com/opencustodian/schemas/formats/')) {
      const relative = url.replace('https://github.com/opencustodian/schemas/formats/', '');
      return path.join(this.schemaRoot, relative);
    }

    // Legacy URL support (backwards compatibility)
    if (url === 'https://opencustodian.org/schemas/common-definitions-0.1.json') {
      return path.join(this.schemaRoot, 'common-definitions.schema.json');
    }

    if (url.startsWith('https://opencustodian.org/formats/')) {
      const relative = url.replace('https://opencustodian.org/formats/', '');
      return path.join(this.schemaRoot, relative.replace(/\.json$/, '.schema.json'));
    }

    if (url.startsWith('https://opencustodian.org/standards/')) {
      const relative = url.replace('https://opencustodian.org/standards/', '');
      return path.join(this.schemaRoot, relative.replace(/\.json$/, '.schema.json'));
    }

    return url;
  }

  /**
   * Load a schema from disk, with caching
   */
  loadSchema(urlOrPath) {
    const filePath = this.resolveUrl(urlOrPath);
    
    if (this.cache[filePath]) {
      return this.cache[filePath];
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const schema = JSON.parse(content);
      this.cache[filePath] = schema;
      return schema;
    } catch (error) {
      throw new Error(`Failed to load schema from ${filePath}: ${error.message}`);
    }
  }

  /**
   * Resolve a $ref pointer within a schema
   */
  resolveRef(ref, baseSchema, basePath) {
    // Handle external refs (with URL)
    if (ref.startsWith('http')) {
      const [url, pointer] = ref.split('#');
      const schema = this.loadSchema(url);
      return this.resolvePointer(schema, pointer);
    }

    // Handle internal refs (within same file)
    if (ref.startsWith('#')) {
      return this.resolvePointer(baseSchema, ref.substring(1));
    }

    throw new Error(`Cannot resolve ref: ${ref}`);
  }

  /**
   * Resolve a JSON pointer path (e.g., /$defs/snapshotAt)
   */
  resolvePointer(schema, pointer) {
    if (!pointer) return schema;

    const parts = pointer.split('/').filter(p => p);
    let current = schema;

    for (const part of parts) {
      if (current == null) {
        throw new Error(`Invalid pointer path: ${pointer}`);
      }
      current = current[part];
    }

    return current;
  }

  /**
   * Fully resolve a schema, following all $refs
   */
  resolve(schema, seenRefs = new Set()) {
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    if (Array.isArray(schema)) {
      return schema.map(item => this.resolve(item, seenRefs));
    }

    // Handle $ref
    if (schema.$ref) {
      const ref = schema.$ref;
      if (seenRefs.has(ref)) {
        return schema; // Avoid infinite recursion
      }
      seenRefs.add(ref);

      const resolved = this.resolveRef(ref, schema, null);
      return this.resolve(resolved, seenRefs);
    }

    // Recursively resolve nested objects
    const result = {};
    for (const [key, value] of Object.entries(schema)) {
      result[key] = this.resolve(value, seenRefs);
    }

    return result;
  }
}

/**
 * DataGenerator: Generates sample data based on JSON schema definitions
 */
class DataGenerator {
  constructor(schemaResolver) {
    this.resolver = schemaResolver;
    this.assetSymbols = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'XRP'];
    this.networks = ['bitcoin', 'ethereum', 'polygon', 'arbitrum', 'optimism', 'solana'];
  }

  /**
   * Generate sample data for a field based on its schema
   */
  generateForField(fieldSchema, fieldName) {
    if (!fieldSchema) {
      return null;
    }

    // Resolve any remaining $refs
    if (fieldSchema.$ref) {
      const resolved = this.resolver.resolve(fieldSchema);
      return this.generateForField(resolved, fieldName);
    }

    const type = fieldSchema.type;
    const pattern = fieldSchema.pattern;
    const description = fieldSchema.description || '';

    // Pattern-based generation (highest priority)
    if (pattern) {
      return this.generateByPattern(pattern, fieldName);
    }

    // Type-based generation
    switch (type) {
      case 'string':
        return this.generateString(fieldSchema, fieldName);
      case 'integer':
        return this.generateInteger(fieldSchema);
      case 'number':
        return this.generateNumber(fieldSchema);
      case 'boolean':
        return faker.datatype.boolean();
      case 'object':
        return this.generateObject(fieldSchema);
      case 'array':
        return this.generateArray(fieldSchema);
      default:
        return null;
    }
  }

  /**
   * Generate string value
   */
  generateString(schema, fieldName = '') {
    const description = (schema.description || '').toLowerCase();
    const minLength = schema.minLength || 1;
    const maxLength = schema.maxLength || 50;

    // Field-name-based heuristics
    if (fieldName.includes('userId') || description.includes('user')) {
      return faker.string.uuid();
    }
    if (fieldName.includes('address') || description.includes('address')) {
      return faker.finance.ethereumAddress();
    }
    if (fieldName.includes('symbol') || description.includes('symbol')) {
      return faker.helpers.arrayElement(this.assetSymbols);
    }
    if (fieldName.includes('network') || description.includes('network')) {
      return faker.helpers.arrayElement(this.networks);
    }
    if (fieldName.includes('Timestamp') || fieldName.includes('At')) {
      return new Date().toISOString();
    }
    if (fieldName.includes('hash') || fieldName.includes('merkle') || fieldName.includes('root')) {
      return crypto.randomBytes(32).toString('hex');
    }
    if (fieldName.includes('name') || fieldName.includes('custodian')) {
      return faker.company.name();
    }

    // Default string generation
    return faker.word.words({ count: { min: 1, max: 3 } }).join(' ').substring(0, maxLength);
  }

  /**
   * Generate integer value
   */
  generateInteger(schema) {
    const min = schema.minimum ?? 0;
    const max = schema.maximum ?? min + 1000000;
    return faker.number.int({ min, max });
  }

  /**
   * Generate number value
   */
  generateNumber(schema) {
    const min = schema.minimum ?? 0;
    const max = schema.maximum ?? min + 1000;
    return faker.number.float({ min, max, precision: 0.01 });
  }

  /**
   * Generate value by regex pattern
   */
  generateByPattern(pattern, fieldName = '') {
    // ISO8601 timestamp with timezone
    if (pattern.includes('\\d{4}-\\d{2}-\\d{2}T')) {
      return new Date().toISOString();
    }

    // Hex pattern (for merkle roots, hashes)
    if (pattern === '^[A-Fa-f0-9]{64}$') {
      return crypto.randomBytes(32).toString('hex');
    }

    // Decimal number pattern
    if (pattern === '^-?(0|[1-9]\\d*)(?:\\.\\d+)?$') {
      return String(faker.number.int({ min: 0, max: 1000000 }));
    }

    // Generic: return a reasonable default
    return faker.word.word();
  }

  /**
   * Generate object value
   */
  generateObject(schema) {
    const properties = schema.properties || {};
    const required = schema.required || [];
    const result = {};

    for (const [key, fieldSchema] of Object.entries(properties)) {
      if (required.includes(key)) {
        result[key] = this.generateForField(fieldSchema, key);
      }
    }

    return result;
  }

  /**
   * Generate array value
   */
  generateArray(schema, count = 1) {
    const itemSchema = schema.items;
    if (!itemSchema) {
      return [];
    }

    const minItems = schema.minItems ?? count;
    const length = schema.minItems ?? minItems;

    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(this.generateForField(itemSchema, `${schema.title || 'item'}[${i}]`));
    }
    return result;
  }
}

/**
 * SampleDataGenerator: Main orchestrator for generating complete sample documents
 */
class SampleDataGenerator {
  constructor() {
    this.resolver = new SchemaResolver();
    this.dataGenerator = new DataGenerator(this.resolver);
  }

  /**
   * Generate a complete proof-of-reserves sample
   */
  generateProofOfReserves() {
    // Manually build holdings records based on schema structure
    const records = [];
    for (let i = 0; i < 5; i++) {
      records.push({
        assetSymbol: faker.helpers.arrayElement(this.dataGenerator.assetSymbols),
        network: faker.helpers.arrayElement(this.dataGenerator.networks),
        address: faker.finance.ethereumAddress(),
        balance: String(faker.number.int({ min: 100, max: 1000000 })),
        blockHeight: faker.number.int({ min: 800000, max: 900000 })
      });
    }

    const payload = {
      snapshotAt: new Date().toISOString(),
      holdings: {
        format: 'inline',
        records
      },
      notes: `Proof of reserves generated on ${new Date().toISOString()}`
    };

    return {
      $schema: 'https://github.com/opencustodian/schemas/proofObjects.schema.json',
      metadata: {
        type: 'proof-of-reserves',
        format: 'proof-of-reserves',
        version: 'DRAFT'
      },
      payload
    };
  }

  /**
   * Generate a complete proof-of-liabilities sample
   */
  generateProofOfLiabilities() {
    // Manually build user records based on schema structure
    const assetSymbols = this.dataGenerator.assetSymbols;
    const records = [];
    
    for (let i = 0; i < 5; i++) {
      const balances = {};
      assetSymbols.forEach(symbol => {
        balances[symbol] = String(faker.number.int({ min: 0, max: 100000 }));
      });

      records.push({
        userId: faker.string.uuid(),
        balances
      });
    }

    const liabilityBreakdown = {};
    assetSymbols.forEach(symbol => {
      liabilityBreakdown[`${symbol}-balance`] = String(faker.number.int({ min: 100000, max: 10000000 }));
    });

    const payload = {
      snapshotAt: new Date().toISOString(),
      liabilityBreakdown,
      users: {
        format: 'inline',
        records
      },
      merkleRoot: crypto.randomBytes(32).toString('hex'),
      userCount: faker.number.int({ min: 100, max: 10000 }),
      notes: `Proof of liabilities generated on ${new Date().toISOString()}`
    };

    return {
      $schema: 'https://github.com/opencustodian/schemas/proofObjects.schema.json',
      metadata: {
        type: 'proof-of-liabilities',
        format: 'proof-of-liabilities',
        version: 'DRAFT'
      },
      payload
    };
  }

  /**
   * Generate a complete envelope wrapping both proofs
   */
  generateEnvelope(proofObjects) {
    const contentHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(proofObjects))
      .digest('hex');

    return {
      $schema: 'https://github.com/opencustodian/schemas/envelope.schema.json',
      metadata: {
        format: 'OpenCustodian',
        version: '0.0.1',
        generatedAt: new Date().toISOString(),
        custodian: {
          name: faker.company.name(),
          custodianId: faker.string.uuid()
        }
      },
      proofObjects,
      hashSignature: {
        contentHash: {
          algorithm: 'SHA-256',
          value: contentHash
        },
        custodianSignature: {
          algorithm: 'Ed25519',
          value: crypto.randomBytes(64).toString('hex')
        }
      }
    };
  }

  /**
   * Get timestamped folder name
   */
  getTimestampedFolder() {
    const now = new Date();
    const iso = now.toISOString().replace(/[:.]/g, '-').split('.')[0];
    return iso;
  }

  /**
   * Generate all sample files in a timestamped folder
   */
  generateAllSamples() {
    const baseOutputDir = path.join(__dirname, '../generated-samples');
    const timestampedFolder = this.getTimestampedFolder();
    const outputDir = path.join(baseOutputDir, timestampedFolder);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('\n📦 Generating Schema-Driven OpenCustodian Test Samples...\n');

    try {
      // Generate Envelope with both PoR and PoL
      const proofObjects = [
        this.generateProofOfReserves(),
        this.generateProofOfLiabilities()
      ];
      const envelope = this.generateEnvelope(proofObjects);
      const envelopePath = path.join(outputDir, 'envelope.json');
      fs.writeFileSync(envelopePath, JSON.stringify(envelope, null, 2));
      console.log(`✓ Envelope: ${path.basename(envelopePath)}`);

      // Generate standalone PoR
      const porProof = this.generateProofOfReserves();
      const porPath = path.join(outputDir, 'proof-of-reserves.json');
      fs.writeFileSync(porPath, JSON.stringify(porProof, null, 2));
      console.log(`✓ Proof-of-Reserves: ${path.basename(porPath)}`);

      // Generate standalone PoL
      const polProof = this.generateProofOfLiabilities();
      const polPath = path.join(outputDir, 'proof-of-liabilities.json');
      fs.writeFileSync(polPath, JSON.stringify(polProof, null, 2));
      console.log(`✓ Proof-of-Liabilities: ${path.basename(polPath)}`);

      console.log(`\n✨ All samples generated in: ${outputDir}\n`);
      console.log('Run "npm run validate" to test the generated samples');

    } catch (error) {
      console.error('❌ Error generating samples:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// Run if this is the main module
if (require.main === module) {
  const generator = new SampleDataGenerator();
  generator.generateAllSamples();
}

module.exports = { SampleDataGenerator, SchemaResolver, DataGenerator };
