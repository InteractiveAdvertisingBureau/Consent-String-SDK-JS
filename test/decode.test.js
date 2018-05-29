const { expect } = require('chai');
const jsdom = require('jsdom');
const { decodeFromBase64Factory } = require('../src/utils/bits');
const { decodeConsentStringFactory } = require('../src/decode');

const { JSDOM } = jsdom;

describe('decode', function () {
  const aDate = new Date('2018-07-15 PDT');
  const givenWindow = new JSDOM('<!DOCTYPE html><div id="hello">Hello world</div>').window;
  const decodeFromBase64 = decodeFromBase64Factory(givenWindow.atob);
  const decodeConsentString = decodeConsentStringFactory(decodeFromBase64);

  it('decodes the consent data from a base64-encoded string', function () {
    const consentData = decodeConsentString('BOQ7WlgOQ7WlgABACDENABwAAABJOACgACAAQABA');

    expect(consentData).to.deep.equal({
      version: 1,
      cmpId: 1,
      cmpVersion: 2,
      consentScreen: 3,
      consentLanguage: 'en',
      vendorListVersion: 1,
      maxVendorId: 1171,
      created: aDate,
      lastUpdated: aDate,
      allowedPurposeIds: [1, 2],
      allowedVendorIds: [1, 2, 4],
    });
  });
});
