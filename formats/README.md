# OpenCustodian Formats (OCF)

## ⚠️ Experimental / Draft Status

**This directory contains EXPERIMENTAL and DRAFT format specifications.**

These formats are provided as **examples and reference implementations** to demonstrate how proof formats can be designed within the OpenCustodian framework. They are **NOT finalized standards** and should be considered starting points for collaborative development.

---

## Purpose

The formats in this directory serve to:

1. **Demonstrate** how the OpenCustodian Core (envelope + proof objects) can be used
2. **Provide examples** of JSON Schema-based proof format design
3. **Invite collaboration** on standardizing industry-wide proof formats
4. **Show patterns** for common use cases (reserves, liabilities, user data)

---

## Current Formats

### OCF1 - Proof-of-Reserves (Draft)

Location: [proof-of-reserves/](proof-of-reserves/)

**Status:** 🚧 Experimental Draft

Demonstrates how exchanges can declare asset holdings:

- **[ocf1-field-registry.schema.json](proof-of-reserves/ocf1-field-registry.schema.json)** - Common field definitions
- **[ocf1.1-holding.schema.json](proof-of-reserves/ocf1.1-holding.schema.json)** - Address-level holdings format
- **[ocf1.2-btc-utxo.schema.json](proof-of-reserves/ocf1.2-btc-utxo.schema.json)** - Bitcoin UTXO-specific reserves
- **[ocf1.3-token-ledger.schema.json](proof-of-reserves/ocf1.3-token-ledger.schema.json)** - Token holdings format

**Key Features:**
- Multi-chain/network support
- External dataset integration (CSV, JSON, YAML)
- Arbitrary precision for monetary amounts
- Block height snapshots
- Third-party custodian tracking

---

### OCF2 - Proof-of-Liabilities (Draft)

Location: [proof-of-liabilities/](proof-of-liabilities/)

**Status:** 🚧 Experimental Draft

Demonstrates how exchanges can declare and prove liabilities to users:

- **[ocf2-field-registry.schema.json](proof-of-liabilities/ocf2-field-registry.schema.json)** - Common field definitions
- **[ocf2.1-merkle-tree.schema.json](proof-of-liabilities/ocf2.1-merkle-tree.schema.json)** - Merkle tree proof format

**Key Features:**
- Merkle tree commitments for privacy-preserving verification
- Liability type breakdown (user-balances, rewards, lending, etc.)
- External dataset integration
- User verification capability
- Asset-level summaries

---

### OCF3 - User Information (Planned)

Location: [user-info/](user-info/)

**Status:** 📋 Planned

Framework for standardized user account and balance data.

---

## Design Principles

All example formats follow these principles:

1. **JSON Schema Based** - Strict validation using JSON Schema Draft 7 / 2020-12
2. **Field Registries** - Reusable field definitions to ensure consistency
3. **Format Flexibility** - Support for inline data and external datasets
4. **Arbitrary Precision** - Monetary amounts as strings to avoid floating-point errors
5. **Network Agnostic** - Work with any blockchain or asset type
6. **Hash Verification** - External data references include cryptographic hashes
7. **Composable** - Can combine multiple proof types in one envelope

---

## Shared Components

### Common Definitions

**[common-definitions.schema.json](common-definitions.schema.json)**

Shared type definitions used across all proof formats:
- Field selectors for external data mapping
- URI patterns
- Hash algorithms
- Common data structures

This enables consistency and reusability across proof types.

---

## Important Notes

### Not Production-Ready

⚠️ **These formats are NOT recommended for production use** without community review and consensus.

### Collaboration Needed

These formats are **starting points** for industry collaboration. They should be:
- Reviewed by exchange operators
- Validated by auditors and regulators
- Tested with real-world data
- Refined based on implementation experience
- Standardized through community consensus

### Format Versioning

Each format includes:
- An `OCF` field indicating the format number (e.g., "1", "1.1", "2.1")
- A `version` field for the schema version (e.g., "1.0.0")

This allows formats to evolve independently while maintaining compatibility.

---

## Using These Formats

### As Reference

Use these schemas as **reference examples** when designing your own proof formats:

```json
{
  "$schema": "https://raw.githubusercontent.com/opencustodian/OpenCustodian/main/proofObjects/v.0.0.1/proofObjects.schema.json",
  "metadata": {
    "type": "proof-of-reserves",
    "format": "custom-format-name",
    "version": "0.0.1"
  },
  "payload": {
    /* Your custom proof structure */
  }
}
```

### As Starting Point

Fork and modify these schemas for your specific needs, then propose standardization to the community.

### In Testing

Use for development, testing, and prototyping OpenCustodian integrations.

---

## Proposed Workflow for Standardization

1. **Draft** - Initial format design (current stage)
2. **Community Review** - Gather feedback from exchanges, auditors, regulators
3. **Implementation Testing** - Real-world pilot implementations
4. **Refinement** - Iterate based on feedback and testing
5. **Standardization** - Community consensus and formal adoption
6. **Maintenance** - Versioned updates as needs evolve

---

## Contributing to Formats

We welcome contributions to evolve these formats:

1. **Feedback** - Share your thoughts on the current designs
2. **Use Cases** - Describe requirements we haven't covered
3. **Implementations** - Try using these formats and report issues
4. **Alternative Designs** - Propose different approaches
5. **Domain Expertise** - Share knowledge from accounting, auditing, or regulatory perspectives

---

## Questions to Consider

As we collaborate on standardizing these formats, consider:

- **Completeness** - Do they cover all necessary proof scenarios?
- **Practicality** - Can exchanges actually implement these?
- **Auditability** - Do they provide sufficient information for auditors?
- **Privacy** - Do they balance transparency with user privacy?
- **Efficiency** - Can they handle real-world data volumes?
- **Extensibility** - Can they evolve with new asset types and chains?

---

## Format Status Table

| Format | Purpose | Status | OCF Version | Schema Version |
|--------|---------|--------|-------------|----------------|
| OCF1 - Proof-of-Reserves | Asset holdings | 🚧 Draft | 1 | DRAFT |
| OCF1.1 - Holdings | Address-level holdings | 🚧 Draft | 1.1 | DRAFT |
| OCF1.2 - BTC UTXO | Bitcoin UTXO reserves | 🚧 Draft | 1.2 | DRAFT |
| OCF1.3 - Token Ledger | Token holdings | 🚧 Draft | 1.3 | DRAFT |
| OCF2 - Proof-of-Liabilities | User liabilities | 🚧 Draft | 2 | DRAFT |
| OCF2.1 - Merkle Tree | Merkle tree proofs | 🚧 Draft | 2.1 | DRAFT |
| OCF3 - User Information | User balance data | 📋 Planned | - | - |

---

## Next Steps

To move these formats from "draft" to "standard":

1. **Publish** the OpenCustodian Core standard
2. **Gather feedback** from potential implementers
3. **Form working groups** for each format category
4. **Pilot implementations** with willing exchanges
5. **Iterate** based on real-world experience
6. **Standardize** through community consensus

---

## Contact & Discussion

[To be determined - GitHub Discussions, Discord, mailing list, etc.]

---

**Remember:** The OpenCustodian Core (envelope + proof objects) is stable. These formats are where we collaborate and innovate together.

