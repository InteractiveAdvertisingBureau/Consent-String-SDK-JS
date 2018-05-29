import jsdom from 'jsdom';
import ConsentFactory from '../src/ConsentFactory';
import { decodeFromBase64Factory, encodeToBase64Factory } from '../src/utils/bits';
import { encodeConsentStringFactory } from '../src/encode';
import { decodeConsentStringFactory } from '../src/decode';

const { JSDOM } = jsdom;
const { expect } = require('chai');

const vendorList = require('./vendors.json');

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

  const givenWindow = new JSDOM('<!DOCTYPE html><div id="hello">Hello world</div>').window;
  const encodeToBase64 = encodeToBase64Factory(givenWindow.btoa);
  const encodeConsentString = encodeConsentStringFactory(encodeToBase64);

  const decodeFromBase64 = decodeFromBase64Factory(givenWindow.atob);
  const decodeConsentString = decodeConsentStringFactory(decodeFromBase64);

  const consentFactory = new ConsentFactory({
    encoder: encodeConsentString,
    decoder: decodeConsentString,
  });

  it('gives the same result when encoding then decoding data', function () {
    const consentString = consentFactory.create({ vendorList });
    Object.assign(consentString, consentData);
    expect(
      consentFactory.createFromEncodedBase64String({
        base64EncodedString: consentString.getConsentString(false),
      }),
    ).to.deep.include(consentData);
  });

  describe('vendorPermissions', function () {
    it('can manipulate one vendor permission without affecting the others', function () {
      const consentString = consentFactory.create({ vendorList });
      Object.assign(consentString, consentData);
      const allowedVendorsBefore = consentString.allowedVendorIds.slice();
      consentString.setVendorAllowed(2, false);
      expect(allowedVendorsBefore.length - 1).to.equal(consentString.allowedVendorIds.length);
    });
  });

  describe('purposePermissions', function () {
    it('can manipulate one purpose permission without affecting the others', function () {
      const consentString = consentFactory.create({ vendorList });
      Object.assign(consentString, consentData);
      const allowedPurposes = consentString.allowedPurposeIds.slice();
      consentString.setPurposeAllowed(1, false);
      expect(allowedPurposes.length - 1).to.equal(consentString.allowedPurposeIds.length);
    });

    it("shouldn't throw an error when calling isPurposeAllowed", function () {
      const consentString = consentFactory.create({ vendorList });
      Object.assign(consentString, consentData);
      consentString.setPurposeAllowed(1, true);
      expect(consentString.isPurposeAllowed(1)).to.be.true;
    });
  });

  describe('setGlobalVendorList', function () {
    it('throws an error if the provided vendor list does not respect the IAB format', function () {
      expect(() => (consentFactory.create())).to.throw;
      expect(() => (consentFactory.create({}))).to.throw;
      expect(() => (consentFactory.create({
        vendorList: {
          vendorListVersion: 1,
        },
      }))).to.throw;
      expect(() => (consentFactory.create({
        vendorList: {
          vendorListVersion: 1,
          purposes: [],
        },
      }))).to.throw;

      expect(() => (consentFactory.create({
        vendorList: {
          vendorListVersion: 1,
          vendors: [],
        },
      }))).to.throw;
      expect(() => (consentFactory.create({
        vendorList: {
          vendorListVersion: 1,
          purposes: {},
        },
      }))).to.throw;
      expect(() => (consentFactory.create({
        vendorList: {
          purposes: [],
          vendors: [],
        },
      }))).to.throw;
      expect(() => (consentFactory.create({
        vendorList: {
          version: 1,
          purposes: [],
          vendors: [],
        },
      }))).to.throw;
    });

    it('does not throw an error if the provided vendor list does respect the IAB format', function () {
      const consent = consentFactory.create({
        vendorList: {
          vendorListVersion: 1,
          purposes: [],
          vendors: [],
        },
      });
      expect(consent.vendorListVersion).to.equal(1);
    });

    it('sorts the vendor list by ID', function () {
      const consent = consentFactory.create({
        vendorList: {
          vendorListVersion: 1,
          purposes: [],
          vendors: [
            { id: 2 },
            { id: 1 },
          ],
        },
      });
      expect(consent.vendorList.vendors).to.deep.equal([
        { id: 1 },
        { id: 2 },
      ]);
    });
  });
});
