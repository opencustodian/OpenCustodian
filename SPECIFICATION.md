# Envelope Specification v0.1

## Properties

### `includes`
Declares which data is included in this envelope.

Example:
```json
{
  "proofOfReserves": { "status": "present" },
  "proofOfLiabilities": { "status": "absent" },
  "userInfo": { "status": "present" }
}
