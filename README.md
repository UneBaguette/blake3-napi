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

## Installation

```bash
git clone https://github.com/UneBaguette/blake3-napi
cd blake3-napi
yarn
yarn build
```

## Usage

```js
import { hash, hashRayon, keyedHash, deriveKey, Hasher } from './index.js'

const data = new TextEncoder().encode('hello world')
const key = new Uint8Array(32).fill(1)

// One-shot hashing
hash(data)
hashRayon(data) // use this for inputs larger than 256KB

// MAC and key derivation
keyedHash(data, key)
deriveKey('my context', key)

// Streaming
const h = new Hasher()
h.update(data.slice(0, 5))
h.update(data.slice(5))
h.finalize()
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

## Security

The underlying `blake3` Rust crate targets algorithmic constant time. The hashing itself happens entirely in native Rust, V8 never touches the data. However, the JavaScript call boundary introduces some non-determinism that is outside our control. For absolute security, use the `blake3` Rust crate directly in a Rust program.

## License

This project is licensed under the [MIT License](LICENSE).
