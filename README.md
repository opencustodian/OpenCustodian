# OpenCustodian

**An open standard for exchanges and custodians to declare Proof of Reserves, Proof of Liabilities, and User Information in a standardized, machine-readable format.**

OpenCustodian enables applications, APIs, and AI agents to automatically understand and interact with exchange reserve data without requiring custom integrations for each platform.

Repository: https://github.com/opencustodian/OpenCustodian

---

## Project Structure

OpenCustodian is organized into two main components:

### 🔷 **OpenCustodian Core** (Stable)

The core standard consists of two foundational schemas that define the container and proof object structure:

- **[envelope.schema.json](envelope/v0.0.1/envelope.schema.json)** - The outermost container that wraps all proof objects
- **[proofObjects.schema.json](proofObjects/v.0.0.1/proofObjects.schema.json)** - The structure for individual proof objects

These core schemas are **stable** and define the fundamental architecture of OpenCustodian. They provide:
- Metadata structure for custodian identification
- Proof object array container
- Hash signature mechanism for data integrity
- Extensible framework for any proof type

### 🚧 **OpenCustodian Formats** (Experimental/Draft)

The [formats/](formats/) directory contains **experimental and draft** format specifications:

- **OCF1** - Proof-of-Reserves formats
- **OCF2** - Proof-of-Liabilities formats  
- **OCF3** - User Information formats (planned)

**⚠️ Important:** These formats are provided as **examples** to demonstrate how proof formats can be designed within the OpenCustodian framework. They are **not finalized** and are intended for collaborative development with the community.

See [formats/README.md](formats/README.md) for details on the experimental format specifications.

---

## Quick Start

### Understanding the Standard

1. Read [SPECIFICATION.md](SPECIFICATION.md) for the complete vision and philosophy
2. Review [envelope.schema.json](envelope/v0.0.1/envelope.schema.json) to understand the container structure
3. Review [proofObjects.schema.json](proofObjects/v.0.0.1/proofObjects.schema.json) to understand proof object structure
4. Explore [formats/](formats/) to see example format implementations

Note: The current project philosophy and evolving technical notes are tracked in [SPECIFICATION.md](SPECIFICATION.md).

### Using the Standard

`hashSignature.contentHash` is required; `hashSignature.custodianSignature` is optional.

```json
{
  "$schema": "https://raw.githubusercontent.com/opencustodian/OpenCustodian/main/envelope/v0.0.1/envelope.schema.json",
  "metadata": {
    "version": "0.0.1",
    "generatedAt": "2026-02-23T12:00:00Z",
    "custodian": {
      "name": "Example Exchange",
      "custodianId": "example.exchange"
    }
  },
  "payload": {
    "format": "OpenCustodian",
    "proofObjects": [
      {
        "metadata": {
          "type": "proof-of-reserves",
          "format": "custom-or-ocf-format",
          "version": "0.0.1"
        },
        "payload": {
          /* Your proof data here */
        }
      }
    ]
  },
  "hashSignature": {
    "contentHash": {
      "algorithm": "SHA-256",
      "value": "..."
    },
    "custodianSignature": {
      "algorithm": "Ed25519",
      "value": "..."
    }
  }
}
```

### Validation & Testing

```bash
# Generate sample data
node tests/scripts/generate-samples.js

# Validate samples
node tests/scripts/validate-samples.js

# (Optional) run both in sequence
node tests/scripts/generate-samples.js && node tests/scripts/validate-samples.js
```

---

## Architecture

### Core Components

```
OpenCustodian/
├── envelope/
│   └── v0.0.1/
│       ├── envelope.schema.json          # 🔷 CORE: Outermost container
│       └── examples/
│           └── envelope.sample.json
├── proofObjects/
│   └── v.0.0.1/
│       ├── proofObjects.schema.json      # 🔷 CORE: Proof object structure
│       └── examples/
│           └── proofObjects.sample.json
├── formats/                      # 🚧 EXPERIMENTAL: Format examples
│   ├── common-definitions.schema.json
│   ├── proof-of-reserves/
│   ├── proof-of-liabilities/
│   └── user-info/
├── SPECIFICATION.md              # Project philosophy & evolving notes
└── tests/                        # Validation & testing
```

### Separation of Concerns

**Core Standard** (envelope + proof objects):
- Defines the **container and structure**
- Provides cryptographic integrity mechanisms
- Enables **any proof format** to be wrapped and validated
- Stable and ready for implementation

**Format Specifications** (formats/):
- Specific proof data structures
- Domain-specific schemas (reserves, liabilities, user info)
- **Under collaborative development**
- Can evolve independently from core

---

## Key Features

✅ **Machine-readable** - Fully JSON Schema validated  
✅ **Composable** - Multiple proof types in one envelope  
✅ **Cryptographically verifiable** - SHA-256 hashes + optional signatures  
✅ **Network-agnostic** - Works with any blockchain or asset type  
✅ **Extensible** - Add new proof formats without breaking existing ones  
✅ **External data support** - Reference CSV, JSON, YAML datasets with hash verification  

---

## Use Cases

### Immediate (Core Standard)
- **Standard Container** - Wrap any proof data in a standardized envelope
- **Data Integrity** - Cryptographically verify proof object contents
- **Multi-Proof Documents** - Combine reserves, liabilities, and user data in one file
- **Format Flexibility** - Use any proof format (custom or community-designed)

### With OCF Formats (When Finalized)
- **Automated Exchange Audits** - Verify reserve adequacy with standard tooling
- **Regulatory Compliance** - Submit standardized proofs to regulators
- **Solvency Verification** - Validate reserves against liabilities
- **Cross-Exchange Analysis** - Compare exchanges using consistent metrics

---

## Status

| Component | Status | Version |
|-----------|--------|---------|
| **Core: envelope.schema.json** | ✅ **Stable** | 0.0.1 |
| **Core: proofObjects.schema.json** | ✅ **Stable** | 0.0.1 |
| **Formats: OCF1 (Reserves)** | 🚧 **Draft** | DRAFT |
| **Formats: OCF2 (Liabilities)** | 🚧 **Draft** | DRAFT |
| **Formats: OCF3 (User Info)** | 📋 **Planned** | - |

---

## Documentation

- **[SPECIFICATION.md](SPECIFICATION.md)** - Project philosophy and technical notes
- **[formats/README.md](formats/README.md)** - Experimental format specifications
- **[envelope/v0.0.1/examples/envelope.sample.json](envelope/v0.0.1/examples/envelope.sample.json)** - Example envelope document
- **[proofObjects/v.0.0.1/examples/proofObjects.sample.json](proofObjects/v.0.0.1/examples/proofObjects.sample.json)** - Example proof object
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community standards
- **[SECURITY.md](SECURITY.md)** - Security reporting policy

---

## Contributing

OpenCustodian is designed as an open standard for the industry. We welcome:

- **Core Standard Feedback** - Help refine the envelope and proof object schemas
- **Format Collaboration** - Join the discussion on standardizing proof formats
- **Implementation Examples** - Share how you've implemented OpenCustodian
- **Tooling & Libraries** - Build parsers, validators, and integrations

---

## Vision

**The vision: exchanges speak OpenCustodian, and anything built to understand OpenCustodian just works.**

OpenCustodian aims to be the HTTP of exchange transparency - a universal standard that enables interoperability without custom integration for every platform.

---

## License

[CC0 1.0 Universal](LICENSE)

