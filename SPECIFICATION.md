# OpenCustodian Specification (Core) v0.0.1

Repository: https://github.com/opencustodian/OpenCustodian

This document defines the **core OpenCustodian structures**:

- Envelope object (top-level container)
- Proof object (individual proof unit)

It is aligned with the current schema files in this repository:

- `envelope/v0.0.1/envelope.schema.json`
- `proofObjects/v.0.0.1/proofObjects.schema.json`

---

## 1) Scope

The core specification standardizes **how proof data is wrapped and identified**, not the internal structure of each proof format payload.

- The envelope defines document-level metadata and integrity fields.
- Each proof object identifies its proof type/format/version and carries a payload.
- Format-specific payload validation is delegated to format schemas (for example under `formats/`).

---

## 2) Envelope Object

Schema location:

- `envelope/v0.0.1/envelope.schema.json`

### Required top-level fields

| Field | Type | Required | Description |
|---|---|---|---|
| `metadata` | object | Yes | Envelope identity and generation metadata |
| `proofObjects` | array | Yes | Array of proof objects |
| `hashSignature` | object | Yes | Hash commitment and optional signature |

Additional top-level fields are not allowed (`additionalProperties: false`).

### Optional top-level fields

- `$schema` (uri-reference)
- `$comment` (string)

### `metadata` object

| Field | Type | Required | Rule |
|---|---|---|---|
| `format` | string | Yes | Must be constant `OpenCustodian` |
| `version` | string | Yes | Semver-like pattern `major.minor` or `major.minor.patch` |
| `generatedAt` | string | Yes | ISO-8601 timestamp |
| `custodian` | object | Yes | Custodian identity block |

`custodian` fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Human-readable custodian name |
| `custodianId` | string | Yes | Stable identifier (e.g., domain/URN) |

### `proofObjects` array

- Each item references the proof object schema.
- Current schema does **not** enforce a minimum item count.

### `hashSignature` object

| Field | Type | Required | Description |
|---|---|---|---|
| `contentHash` | object | Yes | Hash commitment over content |
| `custodianSignature` | object | No | Optional custodian signature |

`contentHash`:

| Field | Type | Required | Rule |
|---|---|---|---|
| `algorithm` | string | Yes | Must be `SHA-256` |
| `value` | string | Yes | Lowercase 64-char hex |

`custodianSignature` (optional):

| Field | Type | Required | Rule |
|---|---|---|---|
| `algorithm` | string | Yes (if object present) | Must be `Ed25519` |
| `value` | string | Yes (if object present) | Signature value |

---

## 3) Proof Object

Schema location:

- `proofObjects/v.0.0.1/proofObjects.schema.json`

### Required fields

| Field | Type | Required | Description |
|---|---|---|---|
| `metadata` | object | Yes | Proof identifier metadata |
| `payload` | object | Yes | Proof payload |

Additional top-level fields are not allowed (`additionalProperties: false`).

### Optional fields

- `$schema` (uri-reference)
- `$comment` (string)

### `metadata` object

| Field | Type | Required | Rule |
|---|---|---|---|
| `type` | string | Yes | One of: `proof-of-reserves`, `proof-of-liabilities`, `user-info` |
| `format` | string | Yes | Format identifier name |
| `version` | string | Yes | Semver-like pattern `major.minor` or `major.minor.patch` |
| `externalDataSources` | object | No | External-file declaration block |

### `externalDataSources` object (optional)

| Field | Type | Required | Rule |
|---|---|---|---|
| `$external` | boolean | Yes | Must be `true` |
| `files` | array | Yes | At least 1 external file reference |

Each `files` item references:

- `formats/common-definitions.schema.json#/$defs/externalFileReference`

### `payload` object

- Always required.
- Structure is format-defined (open object in core schema).
- Must **not** include a top-level `$external` key (reserved through schema `not` rule).

---

## 4) File Structure (Current Repository)

Core schema and example locations:

```text
envelope/
  v0.0.1/
    envelope.schema.json
    examples/
      envelope.sample.json

proofObjects/
  v.0.0.1/
    proofObjects.schema.json
    examples/
      proofObjects.sample.json
```

Format examples and reusable definitions:

```text
formats/
  common-definitions.schema.json
  proof-of-reserves/
  proof-of-liabilities/
  user-info/
```

---

## 5) Validation Guidance

- Validate envelope documents against `envelope/v0.0.1/envelope.schema.json`.
- Validate standalone proof objects against `proofObjects/v.0.0.1/proofObjects.schema.json`.
- If using format-specific payloads, additionally validate payload semantics against corresponding format schemas under `formats/`.

Repository scripts:

- `tests/scripts/generate-samples.js`
- `tests/scripts/validate-samples.js`

---

## 6) Minimal Envelope Example

```json
{
  "metadata": {
    "format": "OpenCustodian",
    "version": "0.0.1",
    "generatedAt": "2026-01-01T00:00:00Z",
    "custodian": {
      "name": "Example Custodian",
      "custodianId": "example.custodian"
    }
  },
  "proofObjects": [],
  "hashSignature": {
    "contentHash": {
      "algorithm": "SHA-256",
      "value": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    }
  }
}
```

---

## 7) Versioning Notes

- This document describes **core v0.0.1**.
- Future core versions should be added under new versioned directories while keeping prior versions available for compatibility.
- Experimental format schemas in `formats/` may evolve independently of the core envelope/proof-object contract.
