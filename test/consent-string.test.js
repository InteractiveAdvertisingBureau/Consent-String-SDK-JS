const { expect } = require('chai');

const vendorList = require('./vendors.json');

const { ConsentString } = require('../src/consent-string');

describe('ConsentString', function () {
  const aDate = new Date('2018-07-15 PDT');

  const consentData = {
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
  };

  it('gives the same result when decoding then encoding data with no changes', function () {
    const encodedConsentString = 'BOQ7WlgOQ7WlgABACDENABwAAABJOACgACAAQABA';
    const consentString = new ConsentString(encodedConsentString);
    consentString.setGlobalVendorList(vendorList);
    expect(consentString.getConsentString(false)).to.equal(encodedConsentString);
  });

  it('gives the same result when encoding then decoding data', function () {
    const consentString = new ConsentString();
    consentString.setGlobalVendorList(vendorList);
    Object.assign(consentString, consentData);

    expect(new ConsentString(consentString.getConsentString(false))).to.deep.include(consentData);
  });

  describe('setGlobalVendorList', function () {
    it('throws an error if the provided vendor list does not respect the IAB format', function () {
      expect(() => (new ConsentString()).setGlobalVendorList()).to.throw;
      expect(() => (new ConsentString()).setGlobalVendorList({})).to.throw;
      expect(() => (new ConsentString()).setGlobalVendorList({
        vendorListVersion: 1,
      })).to.throw;
      expect(() => (new ConsentString()).setGlobalVendorList({
        vendorListVersion: 1,
        purposes: [],
      })).to.throw;
      expect(() => (new ConsentString()).setGlobalVendorList({
        vendorListVersion: 1,
        vendors: [],
      })).to.throw;
      expect(() => (new ConsentString()).setGlobalVendorList({
        vendorListVersion: 1,
        purposes: {},
      })).to.throw;
      expect(() => (new ConsentString()).setGlobalVendorList({
        purposes: [],
        vendors: [],
      })).to.throw;
      expect(() => (new ConsentString()).setGlobalVendorList({
        version: 1,
        purposes: [],
        vendors: [],
      })).to.throw;
    });

    it('does not throw an error if the provided vendor list does respect the IAB format', function () {
      const consent = new ConsentString();

      expect(consent.setGlobalVendorList({
        vendorListVersion: 1,
        purposes: [],
        vendors: [],
      })).to.be.undefined;

      expect(consent.vendorListVersion).to.equal(1);
    });
  });
});
