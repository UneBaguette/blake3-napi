#![deny(clippy::all)]

use napi_derive::napi;

#[napi]
pub fn hash(data: &[u8]) -> Vec<u8> {
    blake3::hash(data).as_bytes().to_vec()
}

#[napi]
pub fn hash_rayon(data: &[u8]) -> Vec<u8> {
    let mut hasher = blake3::Hasher::new();
    hasher.update_rayon(data);

    hasher.finalize().as_bytes().to_vec()
}

#[napi]
pub fn hash_xof(data: &[u8], out_len: u32) -> Vec<u8> {
    let mut out = vec![0u8; out_len as usize];
    blake3::Hasher::new()
        .update(data)
        .finalize_xof()
        .fill(&mut out);

    out
}

#[napi]
pub fn keyed_hash(data: &[u8], key: &[u8]) -> napi::Result<Vec<u8>> {
    let key: &[u8; 32] = key
        .try_into()
        .map_err(|_| napi::Error::from_reason("key must be exactly 32 bytes"))?;

    Ok(blake3::keyed_hash(key, data).as_bytes().to_vec())
}

#[napi]
pub fn derive_key(context: String, key_material: &[u8]) -> Vec<u8> {
    blake3::derive_key(&context, key_material).to_vec()
}

#[napi]
pub struct Hasher(blake3::Hasher);

#[napi]
impl Hasher {
    #[napi(constructor)]
    pub fn new() -> Self {
        Hasher(blake3::Hasher::new())
    }

    #[napi(factory)]
    pub fn new_keyed(key: &[u8]) -> napi::Result<Self> {
        let key: &[u8; 32] = key
            .try_into()
            .map_err(|_| napi::Error::from_reason("key must be exactly 32 bytes"))?;

        Ok(Hasher(blake3::Hasher::new_keyed(key)))
    }

    #[napi]
    pub fn update(&mut self, data: &[u8]) {
        self.0.update(data);
    }

    #[napi]
    pub fn update_rayon(&mut self, data: &[u8]) {
        self.0.update_rayon(data);
    }

    #[napi]
    pub fn finalize(&self) -> Vec<u8> {
        self.0.finalize().as_bytes().to_vec()
    }

    #[napi]
    pub fn finalize_xof(&self, out_len: u32) -> Vec<u8> {
        let mut out = vec![0u8; out_len as usize];
        self.0.finalize_xof().fill(&mut out);

        out
    }

    #[napi]
    pub fn reset(&mut self) {
        self.0.reset();
    }
}
