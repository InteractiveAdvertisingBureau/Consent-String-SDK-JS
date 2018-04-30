const { expect } = require('chai');

const {
  encodeIntToBits,
  encodeBoolToBits,
  encodeDateToBits,
  encodeLetterToBits,
  encodeLanguageToBits,
  encodeToBase64,
  decodeBitsToInt,
  decodeBitsToDate,
  decodeBitsToBool,
  decodeBitsToLanguage,
  decodeBitsToLetter,
  decodeFromBase64,
} = require('../../src/utils/bits');

describe('bits', function () {
  describe('encodeIntToBits', function () {
    it('encodes an integer to a bit string', function () {
      const bitString = encodeIntToBits(123);
      expect(bitString).to.equal('1111011');
    });

    it('encodes an integer to a bit string with padding', function () {
      const bitString = encodeIntToBits(123, 12);
      expect(bitString).to.equal('000001111011');
    });
  });

  describe('encodeBoolToBits', function () {
    it('encodes a "true" boolean to a bit string', function () {
      const bitString = encodeBoolToBits(true);
      expect(bitString).to.equal('1');
    });
    it('encode a "false" boolean to a bit string', function () {
      const bitString = encodeBoolToBits(false);
      expect(bitString).to.equal('0');
    });
  });

  describe('encodeDateToBits', function () {
    it('encode a date to a bit string', function () {
      const date = new Date(1512661975200);
      const bitString = encodeDateToBits(date);
      expect(bitString).to.equal('1110000101100111011110011001101000');
    });
    it('encode a date to a bit string with padding', function () {
      const date = new Date(1512661975200);
      const bitString = encodeDateToBits(date, 36);
      expect(bitString).to.equal('001110000101100111011110011001101000');
    });
  });

  describe('encodeLetterToBits', function () {
    it('encodes a letter to a bit string', function () {
      expect(encodeLetterToBits('a')).to.equal('0');
      expect(encodeLetterToBits('K')).to.equal('1010');
      expect(encodeLetterToBits('z')).to.equal('11001');
    });

    it('encodes a letter to a bit string with padding', function () {
      expect(encodeLetterToBits('a', 6)).to.equal('000000');
      expect(encodeLetterToBits('K', 6)).to.equal('001010');
      expect(encodeLetterToBits('z', 6)).to.equal('011001');
    });
  });

  describe('encodeLanguageToBits', function () {
    it('encodes a language code to a bit string', function () {
      expect(encodeLanguageToBits('en', 12)).to.equal('000100001101');
      expect(encodeLanguageToBits('EN', 12)).to.equal('000100001101');
      expect(encodeLanguageToBits('fr', 12)).to.equal('000101010001');
      expect(encodeLanguageToBits('FR', 12)).to.equal('000101010001');
    });
  });

  describe('decodeBitsToInt', function () {
    it('decodes a bit string to original encoded value', function () {
      const bitString = encodeIntToBits(123);
      const decoded = decodeBitsToInt(bitString, 0, bitString.length);
      expect(decoded).to.equal(123);
    });
  });

  describe('decodeBitsToDate', function () {
    it('decodes a bit string to original encoded value', function () {
      const now = new Date('2018-07-15 PDT');
      const bitString = encodeDateToBits(now);
      const decoded = decodeBitsToDate(bitString, 0, bitString.length);
      expect(decoded.getTime()).to.equal(now.getTime());
    });
  });

  describe('decodeBitsToBool', function () {
    it('decodes a bit string to original encoded "true" value', function () {
      const bitString = encodeBoolToBits(true);
      const decoded = decodeBitsToBool(bitString, 0, bitString.length);
      expect(decoded).to.equal(true);
    });
    it('decodes a bit string to original encoded "false" value', function () {
      const bitString = encodeBoolToBits(false);
      const decoded = decodeBitsToBool(bitString, 0, bitString.length);
      expect(decoded).to.equal(false);
    });
  });

  describe('decodeBitsToLetter', function () {
    it('decodes a bit string to a letter', function () {
      expect(decodeBitsToLetter('000000'), 'a');
      expect(decodeBitsToLetter('001010'), 'k');
      expect(decodeBitsToLetter('011001'), 'z');
    });

    it('decodes a bit string to its original value', function () {
      const bitString = encodeLetterToBits('z', 6);
      const decoded = decodeBitsToLetter(bitString);
      expect(decoded).to.equal('z');
    });
  });

  describe('decodeBitsToLanguage', function () {
    it('decodes a bit string to a language code', function () {
      expect(decodeBitsToLanguage('000100001101', 0, 12)).to.equal('en');
      expect(decodeBitsToLanguage('000101010001', 0, 12)).to.equal('fr');
    });

    it('decodes a bit string to its original value', function () {
      const bitString = encodeLanguageToBits('en', 12);
      const decoded = decodeBitsToLanguage(bitString, 0, 12);
      expect(decoded).to.equal('en');
    });
  });

  it('fails to encode a version that does not exist', function () {
    const aDate = new Date('2018-07-15 PDT');

    const consentData = {
      version: 999,
      created: aDate,
      lastUpdated: aDate,
      cmpId: 1,
      vendorListVersion: 1,
    };

    expect(() => encodeToBase64(consentData)).to.throw;
  });

  it('fails to encode an invalid version', function () {
    const aDate = new Date('2018-07-15 PDT');

    const consentData = {
      version: 'hello',
      created: aDate,
      lastUpdated: aDate,
      cmpId: 1,
      vendorListVersion: 1,
    };

    expect(() => encodeToBase64(consentData)).to.throw;
  });

  it('fails to decode an invalid version', function () {
    const bitString = encodeIntToBits(999, 6);
    expect(() => decodeFromBase64(bitString)).to.throw;
  });

  it('encodes and decodes the vendor value with ranges back to original value', function () {
    const aDate = new Date('2018-07-15 PDT');

    const consentData = {
      version: 1,
      created: aDate,
      lastUpdated: aDate,
      cmpId: 1,
      cmpVersion: 2,
      consentScreen: 3,
      consentLanguage: 'en',
      vendorListVersion: 1,
      purposeIdBitString: '111000001010101010001101',
      maxVendorId: 5,
      isRange: true,
      defaultConsent: false,
      numEntries: 2,
      vendorRangeList: [
        {
          isRange: true,
          startVendorId: 2,
          endVendorId: 4,
        },
        {
          isRange: false,
          startVendorId: 1,
        },
      ],
    };

    const bitString = encodeToBase64(consentData);
    const decoded = decodeFromBase64(bitString);

    expect(decoded).to.deep.equal(consentData);
  });

  it('encodes and decodes the vendor value with range ranges back to original value', function () {
    const aDate = new Date('2018-07-15 PDT');

    const consentData = {
      version: 1,
      created: aDate,
      lastUpdated: aDate,
      cmpId: 1,
      cmpVersion: 2,
      consentScreen: 3,
      consentLanguage: 'en',
      vendorListVersion: 1,
      purposeIdBitString: '111000001010101010001101',
      maxVendorId: 5,
      isRange: true,
      defaultConsent: false,
      numEntries: 2,
      vendorRangeList: [
        {
          isRange: false,
          startVendorId: 2,
        },
        {
          isRange: false,
          startVendorId: 1,
        },
      ],
    };

    const bitString = encodeToBase64(consentData);
    const decoded = decodeFromBase64(bitString);

    expect(decoded).to.deep.equal(consentData);
  });

  it('encodes and decodes the vendor value without ranges back to original value', function () {
    const aDate = new Date('2018-07-15 PDT');

    const consentData = {
      version: 1,
      created: aDate,
      lastUpdated: aDate,
      cmpId: 1,
      cmpVersion: 2,
      consentScreen: 3,
      consentLanguage: 'en',
      vendorListVersion: 1,
      purposeIdBitString: '000000001010101010001100',
      maxVendorId: 5,
      isRange: false,
      vendorIdBitString: '10011',
    };

    const bitString = encodeToBase64(consentData);
    const decoded = decodeFromBase64(bitString);

    expect(decoded).to.deep.equal(consentData);
  });
});
