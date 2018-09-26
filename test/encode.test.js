const { expect } = require('chai');

const vendorList = require('./vendors.json');

const {
  convertVendorsToRanges,
  encodeConsentString,
  getMaxVendorId,
  encodeVendorIdsToBits,
  encodePurposeIdsToBits,
} = require('../src/encode');

describe('convertVendorsToRanges', function () {
  it('converts a list of vendors to a full range', function () {
    expect(convertVendorsToRanges(
      [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ],
      [1, 2, 3, 4, 5],
    )).to.deep.equal([
      { isRange: true, startVendorId: 1, endVendorId: 5 },
    ]);
  });

  it('converts a list of vendors to a multiple ranges as needed', function () {
    expect(convertVendorsToRanges(
      [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ],
      [1, 2, 3, 5],
    )).to.deep.equal([
      { isRange: true, startVendorId: 1, endVendorId: 3 },
      { isRange: false, startVendorId: 5, endVendorId: undefined },
    ]);
  });

  it('ignores missing vendors when creating ranges', function () {
    expect(convertVendorsToRanges(
      [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 7 },
      ],
      [1, 2, 3, 7],
    )).to.deep.equal([
      { isRange: true, startVendorId: 1, endVendorId: 3 },
      { isRange: false, startVendorId: 7, endVendorId: undefined },
    ]);

    expect(convertVendorsToRanges(
      [
        { id: 1 },
        { id: 3 },
        { id: 7 },
      ],
      [1, 3, 7],
    )).to.deep.equal([
      { isRange: false, startVendorId: 1, endVendorId: undefined },
      { isRange: false, startVendorId: 3, endVendorId: undefined },
      { isRange: false, startVendorId: 7, endVendorId: undefined },
    ]);
  });
});

describe('encode', function () {
  const aDate = new Date('2018-07-15 PDT');

  it('encodes the consent data into a base64-encoded string', function () {
    const consentData = {
      version: 1,
      cmpId: 1,
      cmpVersion: 2,
      consentScreen: 3,
      consentLanguage: 'en',
      created: aDate,
      lastUpdated: aDate,
      allowedPurposeIds: [1, 2],
      allowedVendorIds: [1, 2, 4],
      vendorList,
      vendorListVersion: vendorList.vendorListVersion,
    };

    const encodedString = encodeConsentString(consentData);
    expect(encodedString).to.equal('BOQ7WlgOQ7WlgABACDENAOwAAAAHCADAACAAQAAQ');
  });
});

describe('maxVendorId', function () {
  it('gets the max vendor id from the vendorList.vendors', function () {
    const maxVendorId = getMaxVendorId(vendorList.vendors);

    expect(maxVendorId).to.equal(112);
  });
});

describe('encodeVendorIdsToBits', function () {
  it('encodes vendor id values to bits and turns on the one I tell it to', function () {
    const setBit = 5;
    const maxVendorId = getMaxVendorId(vendorList.vendors);
    const bitString = encodeVendorIdsToBits(maxVendorId, [setBit]);

    expect(bitString.length).to.equal(112);
    for (let i = 0; i < maxVendorId; i += 1) {
      if (i === (setBit - 1)) {
        expect(bitString[i]).to.equal('1');
      } else {
        expect(bitString[i]).to.equal('0');
      }
    }
  });
  it('encodes vendor id values to bits and turns on the two I tell it to', function () {
    const setBit1 = 5;
    const setBit2 = 9;
    const maxVendorId = getMaxVendorId(vendorList.vendors);
    const bitString = encodeVendorIdsToBits(maxVendorId, [setBit1, setBit2]);

    expect(bitString.length).to.equal(112);
    for (let i = 0; i < maxVendorId; i += 1) {
      if (i === (setBit1 - 1) || i === (setBit2 - 1)) {
        expect(bitString[i]).to.equal('1');
      } else {
        expect(bitString[i]).to.equal('0');
      }
    }
  });
});

describe('encodePurposeIdsToBits', function () {
  it('encodes purpose id values to bits and turns on the one I tell it to', function () {
    const setBit = 4;
    const purposes = vendorList.purposes;
    const bitString = encodePurposeIdsToBits(purposes, [setBit]);

    expect(bitString.length).to.equal(purposes.length);
    for (let i = 0; i < purposes.length; i += 1) {
      if (i === (setBit - 1)) {
        expect(bitString[i]).to.equal('1');
      } else {
        expect(bitString[i]).to.equal('0');
      }
    }
  });
  it('encodes purpose id values to bits and turns on the two I tell it to', function () {
    const setBit1 = 2;
    const setBit2 = 4;
    const purposes = vendorList.purposes;
    const bitString = encodePurposeIdsToBits(purposes, [setBit1, setBit2]);

    expect(bitString.length).to.equal(purposes.length);
    for (let i = 0; i < purposes.length; i += 1) {
      if (i === (setBit1 - 1) || i === (setBit2 - 1)) {
        expect(bitString[i]).to.equal('1');
      } else {
        expect(bitString[i]).to.equal('0');
      }
    }
  });
});

