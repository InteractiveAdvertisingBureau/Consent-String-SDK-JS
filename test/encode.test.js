const { expect } = require('chai');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const vendorList = require('./vendors.json');

const {
  convertVendorsToRanges,
  encodeConsentStringFactory,
} = require('../src/encode');
const { encodeToBase64Factory } = require('../src/utils/bits');

const givenWindow = new JSDOM('<!DOCTYPE html><div id="hello">Hello world</div>').window;
const encodeToBase64 = encodeToBase64Factory(givenWindow.btoa);
const encodeConsentString = encodeConsentStringFactory(encodeToBase64);

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
