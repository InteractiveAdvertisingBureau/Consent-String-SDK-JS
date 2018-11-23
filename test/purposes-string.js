const { expect } = require('chai');

const { PurposesString } = require('../src/purposes-string');

describe('PurposesString', function () {
  const aDate = new Date("2018-11-22T13:05:29.600Z");

  const purposeData = {
    cookieVersion: 1,
    created: aDate,
    lastUpdated: aDate,
    cmpId: 1,
    vendorListVersion: 121,
    publisherPurposeVersion: 1,
    standardPurposeIdBitString: "111110000000000000000000",
    numCustomPurposes: 2,
    customPurposeIdBitString: "11"
  };

  const pusposesCookie = 'BOXoqAAOXoqAAABB5AB-AAACwA';

  it('cookie value should return expected object', function () {
    const consentString = new PurposesString(pusposesCookie);

    expect(consentString).to.deep.include(purposeData);
  });
});
