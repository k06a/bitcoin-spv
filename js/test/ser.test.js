/* global describe it */

import * as chai from 'chai';
import * as ser from '../src/ser';
import * as utils from '../src/utils';
import * as vectors from '../../testProofs.json';

const vectorObj = JSON.parse(JSON.stringify(vectors));
const { valid, validHeader } = vectorObj;

const { assert } = chai;

describe('ser', () => {
  it('can round-trip serialize SPV Proof', () => {
    const emptyDigest = new Uint8Array(32);
    valid.forEach((e) => {
      const proof = ser.deserializeSPVProof(e);

      // TODO: make more assertions and clean up this section
      assert.equal(proof.tx_id_le.length, 32);
      assert.isFalse(utils.typedArraysAreEqual(proof.tx_id_le, emptyDigest));
      assert.equal(proof.tx_id.length, 32);
      assert.isFalse(utils.typedArraysAreEqual(proof.tx_id, emptyDigest));

      // re-serialize and re-deserialize
      const jsonProofString = ser.serializeSPVProof(proof);
      const secondProof = ser.deserializeSPVProof(jsonProofString);

      // TODO: make more assertions and clean up this section
      assert.isTrue(utils.typedArraysAreEqual(
        proof.intermediate_nodes,
        secondProof.intermediate_nodes
      ));
      assert.isTrue(utils.typedArraysAreEqual(
        proof.tx_id,
        secondProof.tx_id
      ));
      assert.isTrue(utils.typedArraysAreEqual(
        proof.tx_id_le,
        secondProof.tx_id_le
      ));
    });
  });

  it('can round-trip serialize Bitcoin header', () => {
    const emptyDigest = new Uint8Array(32);
    validHeader.forEach((e) => {
      const header = ser.deserializeHeader(e);

      // TODO: make more assertions and clean up this section
      assert.equal(header.hash.length, 32);
      assert.isFalse(utils.typedArraysAreEqual(header.hash, emptyDigest));
      assert.equal(header.hash_le.length, 32);
      assert.isFalse(utils.typedArraysAreEqual(header.hash_le, emptyDigest));

      // re-serialize and re-deserialize
      const jsonHeaderString = ser.serializeHeader(header);
      const secondHeader = ser.deserializeHeader(jsonHeaderString);

      // TODO: make more assertions and clean up this section
      assert.isTrue(utils.typedArraysAreEqual(
        header.hash,
        secondHeader.hash
      ));
      assert.isTrue(utils.typedArraysAreEqual(
        header.hash_le,
        secondHeader.hash_le
      ));
      assert.isTrue(utils.typedArraysAreEqual(
        header.raw,
        secondHeader.raw
      ));
    });
  });

  it('errBadHexBytes', () => {
    try {
      ser.deserializeSPVProof(vectorObj.errBadHexBytes);
      assert(false, 'expected an error');
    } catch (e) {
      assert.include(e.message, 'Error deserializing hex, got non-hex byte:');
    }
  });

  it('errBadHexHash256', () => {
    try {
      ser.deserializeSPVProof(vectorObj.errBadHexHash256);
      assert(false, 'expected an error');
    } catch (e) {
      assert.include(e.message, 'Error deserializing hex, got non-hex byte:');
    }
  });

  it('errBadLenHash256', () => {
    try {
      ser.deserializeSPVProof(vectorObj.errBadLenHash256);
      assert(false, 'expected an error');
    } catch (e) {
      assert.include(e.message, 'Expected 32 bytes, got 31 bytes');
    }
  });

  it('errBadHexRawHeader', () => {
    try {
      ser.deserializeSPVProof(vectorObj.errBadHexRawHeader);
      assert(false, 'expected an error');
    } catch (e) {
      assert.include(e.message, 'Error deserializing hex, got non-hex byte:');
    }
  });

  it('errBadLenRawHeader', () => {
    try {
      ser.deserializeSPVProof(vectorObj.errBadLenRawHeader);
      assert(false, 'expected an error');
    } catch (e) {
      assert.include(e.message, 'Expected 80 bytes, got 79 bytes');
    }
  });

  it('errBadLenHash', () => {
    try {
      ser.deserializeSPVProof(vectorObj.errBadLenHash);
      assert(false, 'expected an error');
    } catch (e) {
      assert.include(e.message, 'Expected 32 bytes, got 31 bytes');
    }
  });
});
