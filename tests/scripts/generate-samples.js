// Schema-driven sample generator - imports and runs the new implementation
const { SampleDataGenerator } = require('./schema-driven-generator');

// Run if this is the main module
if (require.main === module) {
  const generator = new SampleDataGenerator();
  generator.generateAllSamples();
}
