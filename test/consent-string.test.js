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
    maxVendorId: Math.max(...vendorList.vendors.map(vendor => vendor.id)),
    created: aDate,
    lastUpdated: aDate,
    allowedPurposeIds: [1, 2],
    allowedVendorIds: [1, 2, 4],
  };

  const resultingMetadaString = 'BOQ7WlgOQ7WlgABACDAAABAAAAAAAA';

  it('gives the same result when encoding then decoding data', function () {
    const consentString = new ConsentString();
    consentString.setGlobalVendorList(vendorList);

    Object.assign(consentString, consentData);

    expect(new ConsentString(consentString.getConsentString(false))).to.deep.include(consentData);
  });

  it('gets the max vendor id as expected', function () {
    const consentString = new ConsentString();
    consentString.setGlobalVendorList(vendorList);
    Object.assign(consentString, consentData);
    expect(consentString.getMaxVendorId()).to.equal(112);
  });

  it('Should decode without having a vendorlist and return the string I set', function () {
    const encoded = 'BOhs9bQOjjnLQAXABBENCfeAAAApmABgAYADoA';
    expect(() => {
      const consentString = new ConsentString(encoded);
      expect(consentString.isPurposeAllowed(2)).to.be.true;
      expect(consentString.isVendorAllowed(12)).to.be.true;
      expect(consentString.isVendorAllowed(11)).to.be.false;
      expect(consentString.getConsentString(false)).to.equal(encoded);
    }).not.to.throw();
  });

  it('gets the parsed vendor consents', function () {
    const consentString = new ConsentString();
    consentString.setGlobalVendorList(vendorList);
    Object.assign(consentString, consentData);

    const parsedVendors = consentString.getParsedVendorConsents();
    expect(parsedVendors.length).to.equal(112);
    for (let i = 0; i < consentString.getMaxVendorId(); i += 1) {
      if (consentData.allowedVendorIds.includes(i + 1)) {
        expect(parsedVendors[i]).to.equal('1');
      } else {
        expect(parsedVendors[i]).to.equal('0');
      }
    }
  });

  it('gets the parsed purpose consents', function () {
    const consentString = new ConsentString();
    consentString.setGlobalVendorList(vendorList);
    Object.assign(consentString, consentData);

    const parsedPurposes = consentString.getParsedPurposeConsents();
    expect(parsedPurposes.length).to.equal(vendorList.purposes.length);
    for (let i = 0; i < vendorList.purposes.length; i += 1) {
      if (consentData.allowedPurposeIds.includes(i + 1)) {
        expect(parsedPurposes[i]).to.equal('1');
      } else {
        expect(parsedPurposes[i]).to.equal('0');
      }
    }
  });

  it('encodes the Metadata String as expected', function () {
    const consentString = new ConsentString();
    consentString.setGlobalVendorList(vendorList);
    Object.assign(consentString, consentData);
    expect(consentString.getMetadataString()).to.equal(resultingMetadaString);
  });

  it('decodes the Metadata String as expected', function () {
    const result = ConsentString.decodeMetadataString(resultingMetadaString);
    expect(result.cmpId).to.equal(consentData.cmpId);
    expect(result.cmpVersion).to.equal(consentData.cmpVersion);
    expect(result.version).to.equal(consentData.version);
    expect(result.vendorListVersion).to.equal(consentData.vendorListVersion);
    expect(result.created).to.deep.equal(consentData.created);
    expect(result.lastUpdated).to.deep.equal(consentData.lastUpdated);
    expect(result.consentScreen).to.equal(consentData.consentScreen);
  });

  describe('vendorPermissions', function () {
    it('can manipulate one vendor permission without affecting the others', function () {
      const consentString = new ConsentString();
      consentString.setGlobalVendorList(vendorList);
      Object.assign(consentString, consentData);

      const allowedVendorsBefore = consentString.allowedVendorIds.slice();

      consentString.setVendorAllowed(2, false);

      expect(allowedVendorsBefore.length - 1).to.equal(consentString.allowedVendorIds.length);
    });
  });

  describe('purposePermissions', function () {
    it('can manipulate one purpose permission without affecting the others', function () {
      const consentString = new ConsentString();
      consentString.setGlobalVendorList(vendorList);
      Object.assign(consentString, consentData);

      const allowedPurposes = consentString.allowedPurposeIds.slice();

      consentString.setPurposeAllowed(1, false);

      expect(allowedPurposes.length - 1).to.equal(consentString.allowedPurposeIds.length);
    });

    it("shouldn't throw an error when calling isPurposeAllowed", function () {
      const consentString = new ConsentString();
      consentString.setGlobalVendorList(vendorList);
      Object.assign(consentString, consentData);

      consentString.setPurposeAllowed(1, true);

      expect(consentString.isPurposeAllowed(1)).to.be.true;
    });
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

    it('sorts the vendor list by ID', function () {
      const consent = new ConsentString();

      consent.setGlobalVendorList({
        vendorListVersion: 1,
        purposes: [],
        vendors: [
          { id: 2 },
          { id: 1 },
        ],
      });

      expect(consent.getGlobalVendorList().vendors).to.deep.equal([
        { id: 1 },
        { id: 2 },
      ]);
    });
  });

  it('two object do not share the same cache', function () {
    const consentString1 = new ConsentString();
    consentString1.setGlobalVendorList(vendorList);
    Object.assign(consentString1, consentData);
    consentString1.setCreated(new Date('2018-07-10 PDT'));

    const consentString2 = new ConsentString();
    consentString2.setGlobalVendorList(vendorList);
    Object.assign(consentString2, consentData);
    consentString1.setCreated(new Date('2018-07-12 PDT'));

    expect(consentString1.getConsentString(false))
      .to
      .not
      .equal(consentString2.getConsentString(false));
  });
});
