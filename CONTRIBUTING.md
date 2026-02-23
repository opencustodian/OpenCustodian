# Contributing to OpenCustodian

Thank you for your interest in contributing to OpenCustodian! This open standard thrives on community collaboration and input from various stakeholders in the cryptocurrency custody ecosystem.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Submission Guidelines](#submission-guidelines)
- [Schema Development Guidelines](#schema-development-guidelines)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Issues

- **Bug Reports**: Found an error in a schema? Please submit a detailed bug report.
- **Feature Requests**: Have ideas for new proof formats or improvements? We'd love to hear them!
- **Security Issues**: Please refer to our [Security Policy](SECURITY.md) for reporting security vulnerabilities.

### Suggesting Format Enhancements

The experimental formats (OCF1, OCF2, OCF3) are designed for collaborative development:

1. Open an issue to discuss your proposed enhancement
2. Explain the use case and benefits
3. Provide examples if possible
4. Engage with community feedback

### Contributing Code

We welcome contributions including:

- New proof format specifications
- Schema improvements and refinements
- Documentation enhancements
- Example implementations
- Test cases and validation scripts

## Development Process

### 1. Fork and Clone

```bash
git fork <repository-url>
git clone <your-fork-url>
cd schemas
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Make Your Changes

- Follow the [Schema Development Guidelines](#schema-development-guidelines)
- Ensure JSON schemas are valid
- Add examples demonstrating your changes
- Update documentation as needed

### 4. Test Your Changes

```bash
# Install dependencies
npm install

# Validate schemas
npm run validate

# Generate test samples
npm run generate-samples

# Run validation tests
npm run test
```

### 5. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -m "Add OCF1.4 ERC-20 token holding format"
# or
git commit -m "Fix: Correct field validation in OCF2.1 schema"
```

### 6. Submit a Pull Request

See [Pull Request Guidelines](#pull-request-guidelines) below.

## Submission Guidelines

### Pull Request Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Reference Issues**: Link to related issues using `#issue-number`
- **Breaking Changes**: Clearly mark any breaking changes
- **Testing**: Describe how you tested your changes

#### PR Checklist

- [ ] Schema changes are valid JSON Schema (Draft 7 or later)
- [ ] Examples provided for new or modified schemas
- [ ] Documentation updated to reflect changes
- [ ] Tests pass (`npm run test`)
- [ ] CHANGELOG.md updated (for significant changes)
- [ ] No breaking changes to core schemas (envelope, proofObjects) without discussion

### Issue Guidelines

When creating an issue, please include:

- **Clear Title**: Summarize the issue in one line
- **Description**: Detailed explanation of the issue or proposal
- **Use Case**: Explain why this matters
- **Examples**: Provide concrete examples when applicable
- **Environment**: If reporting a bug, include relevant environment details

## Schema Development Guidelines

### Core Principles

1. **Stability**: Core schemas (envelope, proofObjects) should remain stable
2. **Extensibility**: Design formats to be extensible for future needs
3. **Clarity**: Use clear, self-documenting property names
4. **Validation**: Provide comprehensive validation rules
5. **Examples**: Always include working examples

### JSON Schema Best Practices

- Use JSON Schema Draft 7 or later
- Include `$schema`, `$id`, `title`, and `description` in all schemas
- Provide descriptions for all properties
- Use appropriate validation keywords (`type`, `format`, `pattern`, etc.)
- Define required fields explicitly
- Use `additionalProperties: false` where appropriate for strict validation
- Reference common definitions from `common-definitions.schema.json`

### File Naming Conventions

- Schema files: `ocf[N].[version]-[description].schema.json`
- Example files: `[description].sample.json` or `[description].example.json`
- Documentation: Clear, descriptive names in kebab-case

### Format Versioning

When proposing changes to experimental formats:

- **Minor changes**: Clarifications, additional optional fields, documentation
- **Major changes**: Breaking changes, removal of fields, modified validation rules
- Discuss versioning strategy with maintainers for significant changes

### Documentation

All schema changes should include:

- Updated schema description fields
- Updated README.md in the relevant directory
- Example files demonstrating new features
- Comments explaining complex validation logic

## Review Process

1. **Submission**: Submit your pull request
2. **Initial Review**: Maintainers will review within 1-2 weeks
3. **Discussion**: Engage with feedback and make requested changes
4. **Community Input**: Major changes may require community discussion period
5. **Approval**: Once approved, your contribution will be merged
6. **Release**: Changes will be included in the next appropriate release

## Community

- **Discussions**: Use GitHub Discussions for questions and ideas
- **Issues**: Use GitHub Issues for bugs and formal proposals
- **Pull Requests**: Use PRs for concrete contributions

## Recognition

All contributors will be recognized in our project documentation. Significant contributions will be highlighted in release notes.

## Questions?

If you have questions about contributing, please:

1. Check existing documentation and issues
2. Open a discussion thread
3. Reach out to maintainers

Thank you for helping make OpenCustodian better! 🙏
