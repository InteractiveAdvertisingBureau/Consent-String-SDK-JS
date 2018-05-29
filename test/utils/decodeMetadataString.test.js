import { expect } from 'chai';
import jsdom from 'jsdom';
import { encodeConsentStringFactory } from '../../src/encode';
import ConsentFactory from '../../src/ConsentFactory';
import { decodeFromBase64Factory, encodeToBase64Factory } from '../../src/utils/bits';
import { decodeConsentStringFactory } from '../../src/decode';
import decodeMetadataStringFactory from '../../src/utils/decodeMetadataString';
import { vendorVersionMap } from '../../src/utils/definitions';
import vendorList from '../vendors.json';

const { JSDOM } = jsdom;

describe('Decode metadata', function () {
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

  const givenWindow = new JSDOM('<!DOCTYPE html><div id="hello">Hello world</div>').window;
  const encodeToBase64 = encodeToBase64Factory(givenWindow.btoa);
  const encodeConsentString = encodeConsentStringFactory(encodeToBase64);

  const decodeFromBase64 = decodeFromBase64Factory(givenWindow.atob);
  const decodeConsentString = decodeConsentStringFactory(decodeFromBase64);

  const consentFactory = new ConsentFactory({
    encoder: encodeConsentString,
    decoder: decodeConsentString,
  });

  const decodeMetadataString = decodeMetadataStringFactory(decodeConsentString)(vendorVersionMap);

  it('encodes the Metadata String as expected', function () {
    const consent = consentFactory.create({ vendorList });
    Object.assign(consent, consentData);
    expect(consent.getMetadataString()).to.equal(resultingMetadaString);
  });
  it('decodes the Metadata String as expected', function () {
    const result = decodeMetadataString(resultingMetadaString);
    expect(result.cmpId).to.equal(consentData.cmpId);
    expect(result.cmpVersion).to.equal(consentData.cmpVersion);
    expect(result.version).to.equal(consentData.version);
    expect(result.vendorListVersion).to.equal(consentData.vendorListVersion);
    expect(result.created).to.deep.equal(consentData.created);
    expect(result.lastUpdated).to.deep.equal(consentData.lastUpdated);
    expect(result.consentScreen).to.equal(consentData.consentScreen);
  });
});
