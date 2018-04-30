const { expect } = require('chai');

const vendorList = require('./vendors.json');

const { encodeConsentString } = require('../src/encode');

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
    expect(encodedString).to.equal('BOQ7WlgOQ7WlgABACDENABwAAABJOACgACAAQABA');
  });
});
