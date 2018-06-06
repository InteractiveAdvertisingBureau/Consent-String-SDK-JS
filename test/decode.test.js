const { expect } = require('chai');

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
      maxVendorId: 1171,
      created: aDate,
      lastUpdated: aDate,
      allowedPurposeIds: [1, 2],
      allowedVendorIds: [1, 2, 4],
    });
  });

  it('decodes the consent data from another base64-encoded string', function () {
    // those two consents represent the same data, but with a different encoding:
    // DefaultConsent of Range = true
    const consentData = decodeConsentString('BOOMzbgOOQww_AtABAFRAb-AAAsvPA2AAKACwAF4ANgAgABTADAAGMAM8AagBrgDoAOoAdwA8gB7gEMAQ4AiQBFgCPAEkAJQASwAmABQwClAKaAVYBWQCwALIAWoAuIBdAF2AL8AYgAx4BkgGUAMyAZwBngDUAGsANiAbQBvgDkgHMAc4A6QB2QDuAO-AeQB5wD3APiAfQB-gEBAIHAQUBDICHAIgAROAioCLQEZsvI');
    // DefaultConsent of Range = false
    const consentData2 = decodeConsentString('BOOMzbgOOQww_AtABAFRAb-AAAsvOA3gACAAkABgArgBaAF0AMAA1gBuAH8AQQBSgCoAL8AYQBigDIAM0AaABpgDYAOYAdgA8AB6gD4AQoAiABFQCMAI6ASABIgCTAEqAJeATIBQQCiAKSAU4BVQCtAK-AWYBaQC2ALcAXMAvAC-gGAAYcAxQDGAGQAMsAZsA0ADTAGqANcAbMA4ADjAHKAOiAdQB1gDtgHgAeMA9AD2AHzAP4BAACBAEEAIbAREBEgCKQEXARhZeYA');

    const toCompareWith = {
      created: new Date("2018-05-23T07:58:14.400Z"),
      lastUpdated: new Date("2018-05-24T12:47:40.700Z"),
      version: 1,
      vendorListVersion: 27,
      cmpId: 45,
      cmpVersion: 1,
      consentScreen: 0,
      consentLanguage: 'fr',
      allowedPurposeIds: [ 1, 2, 3, 4, 5 ],
      allowedVendorIds: [ 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 45, 46, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58, 59, 60, 61, 62, 63, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 97, 98, 100, 101, 102, 104, 105, 108, 109, 110, 111, 112, 113, 114, 115, 118, 120, 122, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 136, 138, 140, 141, 142, 144, 145, 147, 149, 151, 153, 154, 155, 156, 157, 158, 159, 160, 162, 163, 164, 167, 168, 169, 170, 173, 174, 175, 179, 180, 182, 183, 185, 188, 189, 190, 192, 193, 194, 195, 197, 198, 200, 203, 205, 208, 209, 210, 211, 213, 215, 217, 224, 225, 226, 227, 229, 232, 234, 235, 237, 240, 241, 244, 245, 246, 249, 254, 255, 256, 258, 260, 269, 273, 274, 276, 279, 280, 45811 ],
      maxVendorId: 45811
    };
    expect(consentData).to.deep.equal(toCompareWith);
    expect(consentData2).to.deep.equal(toCompareWith);
  });
});
