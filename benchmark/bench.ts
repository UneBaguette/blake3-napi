import { Bench } from 'tinybench'
import { hash, hashRayon } from '../index.js'

function makeData(bytes: number) {
  const buf = new Uint8Array(bytes)
  for (let offset = 0; offset < bytes; offset += 65536) {
    crypto.getRandomValues(buf.subarray(offset, offset + 65536))
  }
  return buf
}

const data1kb = makeData(1024)
const data1mb = makeData(1024 * 1024)
const data10mb = makeData(10 * 1024 * 1024)

const b = new Bench({ time: 2000 })

b.add('hash 1KB', () => {
  hash(data1kb)
})
b.add('hash 1MB', () => {
  hash(data1mb)
})
b.add('hashRayon 1MB', () => {
  hashRayon(data1mb)
})
b.add('hashRayon 10MB', () => {
  hashRayon(data10mb)
})

await b.run()
console.table(b.table())
