# blake3-napi

Fast BLAKE3 bindings for Node.js using [napi-rs](https://napi.rs) and the official [blake3](https://crates.io/crates/blake3) Rust crate.

## Benchmarks

Tested on **Ryzen 7 5800X**, Node.js v24.

| Size   | @noble/hashes | rust-wasm  | napi-rs     | napi-rayon   |
|--------|---------------|------------|-------------|--------------|
| 32 B   | 11 MB/s       | 81 MB/s    | 14 MB/s     | 14 MB/s      |
| 1 KB   | 60 MB/s       | 781 MB/s   | 323 MB/s    | 320 MB/s     |
| 64 KB  | 49 MB/s       | 2,004 MB/s | 4,921 MB/s  | 1,354 MB/s   |
| 1 MB   | 51 MB/s       | 1,893 MB/s | 5,888 MB/s  | 13,887 MB/s  |
| 10 MB  | 51 MB/s       | 1,812 MB/s | 5,860 MB/s  | 36,624 MB/s  |

> Use `hash` for inputs < 256KB, `hashRayon` for larger inputs.

## Usage

```bash
git clone https://github.com/UneBaguette/blake3-napi
cd blake3-napi
npm install
npm run build
```

```js
import { hash, hashRayon, keyedHash, deriveKey, Hasher } from './index.js'

// One-shot
hash(data)               // Uint8Array to Uint8Array (32 bytes)
hashRayon(data)          // multi-threaded, faster for large inputs

// Keyed hash (MAC)
keyedHash(data, key32)   // key must be 32 bytes

// Key derivation
deriveKey('my context', keyMaterial)

// Streaming
const h = new Hasher()
h.update(chunk1)
h.update(chunk2)
h.finalize()             // 32 bytes
```

## Building

Requires **Rust** and [napi-rs](https://napi.rs) CLI.

```bash
yarn build
yarn build:debug

# this is for tests and benchmarks
yarn test
yarn bench
```

## License

MIT
