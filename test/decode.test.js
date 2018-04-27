const { expect } = require('chai');

const vendorList = require('./vendors.json');

const { decodeConsentString } = require('../src/decode');

describe('decode', function () {
  const aDate = new Date('2018-07-15 PDT');

  it('decodes the consent data from a base64-encoded string', function () {
    const consentData = decodeConsentString('BOQ7WlgOQ7WlgABACDENABwAAABJOACgACAAQABA');

    expect(consentData).to.deep.equal({
      version: 1,
      cmpId: 1,
      cmpVersion: 2,
      consentScreen: 3,
      consentLanguage: 'en',
      vendorListVersion: 1,
      maxVendorId: vendorList.vendors[vendorList.vendors.length - 1].id,
      created: aDate,
      lastUpdated: aDate,
      allowedPurposeIds: [1, 2],
      allowedVendorIds: [1, 2, 4],
    });
  });
});
