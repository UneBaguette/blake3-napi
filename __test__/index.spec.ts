import test from 'ava'
import { hash, hashXof, keyedHash, deriveKey, Hasher } from '../index.js'

// Known test vectors from the blake3 spec
const ZERO_INPUT = new Uint8Array(0)
const HELLO = new TextEncoder().encode('hello world')

test('hash returns 32 bytes', (t) => {
  const result = hash(ZERO_INPUT)
  t.is(result.length, 32)
})

test('hash is deterministic', (t) => {
  t.deepEqual(hash(HELLO), hash(HELLO))
})

test('different inputs produce different hashes', (t) => {
  const a = hash(new Uint8Array([1]))
  const b = hash(new Uint8Array([2]))
  t.notDeepEqual(a, b)
})

test('hashXof returns requested length', (t) => {
  t.is(hashXof(HELLO, 64).length, 64)
  t.is(hashXof(HELLO, 16).length, 16)
})

test('keyedHash requires 32 byte key', (t) => {
  const key = new Uint8Array(32).fill(1)
  const result = keyedHash(HELLO, key)
  t.is(result.length, 32)
})

test('keyedHash throws on wrong key size', (t) => {
  const badKey = new Uint8Array(16)
  t.throws(() => keyedHash(HELLO, badKey))
})

test('deriveKey returns 32 bytes', (t) => {
  const result = deriveKey('test context', HELLO)
  t.is(result.length, 32)
})

test('streaming matches one-shot', (t) => {
  const hasher = new Hasher()
  hasher.update(HELLO.slice(0, 5))
  hasher.update(HELLO.slice(5))
  t.deepEqual(hasher.finalize(), hash(HELLO))
})

test('hasher reset works', (t) => {
  const hasher = new Hasher()
  hasher.update(HELLO)
  hasher.reset()
  hasher.update(HELLO)
  t.deepEqual(hasher.finalize(), hash(HELLO))
})
