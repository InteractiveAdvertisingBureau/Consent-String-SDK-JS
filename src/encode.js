const {
  encodeToBase64,
  padRight,
} = require('./utils/bits');

/**
 * Encode a list of vendor IDs into bits
 *
 * @param {integer} maxVendorId Highest vendor ID in the vendor list
 * @param {integer[]} allowedVendorIds Vendors that the user has given consent to
 */
function encodeVendorIdsToBits(maxVendorId, allowedVendorIds = []) {
  let vendorString = '';

  for (let id = 1; id <= maxVendorId; id += 1) {
    vendorString += (allowedVendorIds.indexOf(id) !== -1 ? '1' : '0');
  }

  return padRight(vendorString, Math.max(0, maxVendorId - vendorString.length));
}

/**
 * Encode a list of purpose IDs into bits
 *
 * @param {*} purposes List of purposes from the vendor list
 * @param {*} allowedPurposeIds List of purpose IDs that the user has given consent to
 */
function encodePurposeIdsToBits(purposes, allowedPurposeIds = new Set()) {
  let maxPurposeId = 0;
  for (let i = 0; i < purposes.length; i += 1) {
    maxPurposeId = Math.max(maxPurposeId, purposes[i].id);
  }
  for (let i = 0; i < allowedPurposeIds.length; i += 1) {
    maxPurposeId = Math.max(maxPurposeId, allowedPurposeIds[i]);
  }

  let purposeString = '';
  for (let id = 1; id <= maxPurposeId; id += 1) {
    purposeString += (allowedPurposeIds.indexOf(id) !== -1 ? '1' : '0');
  }

  return purposeString;
}

/**
 * Convert a list of vendor IDs to ranges
 *
 * @param {object[]} vendors List of vendors from the vendor list (important: this list must to be sorted by ID)
 * @param {integer[]} allowedVendorIds List of vendor IDs that the user has given consent to
 */
function convertVendorsToRanges(vendors, allowedVendorIds) {
  let range = [];
  const ranges = [];

  const idsInList = vendors.map(vendor => vendor.id);

  for (let index = 0; index < vendors.length; index += 1) {
    const { id } = vendors[index];
    if (allowedVendorIds.indexOf(id) !== -1) {
      range.push(id);
    }

    // Do we need to close the current range?
    if (
      (
        allowedVendorIds.indexOf(id) === -1 // The vendor we are evaluating is not allowed
        || index === vendors.length - 1 // There is no more vendor to evaluate
        || idsInList.indexOf(id + 1) === -1 // There is no vendor after this one (ie there is a gap in the vendor IDs) ; we need to stop here to avoid including vendors that do not have consent
      )
      && range.length
    ) {
      const startVendorId = range.shift();
      const endVendorId = range.pop();

      range = [];

      ranges.push({
        isRange: typeof endVendorId === 'number',
        startVendorId,
        endVendorId,
      });
    }
  }

  return ranges;
}

/**
 * Get maxVendorId from the list of vendors and return that id
 *
 * @param {object} vendors
 */
function getMaxVendorId(vendors) {
  // Find the max vendor ID from the vendor list
  let maxVendorId = 0;

  vendors.forEach((vendor) => {
    if (vendor.id > maxVendorId) {
      maxVendorId = vendor.id;
    }
  });
  return maxVendorId;
}
/**
 * Encode consent data into a web-safe base64-encoded string
 *
 * @param {object} consentData Data to include in the string (see `utils/definitions.js` for the list of fields)
 */
function encodeConsentString(consentData) {
  let { maxVendorId } = consentData;
  const { vendorList = {}, allowedPurposeIds, allowedVendorIds } = consentData;
  const { vendors = [], purposes = [] } = vendorList;

  // if no maxVendorId is in the ConsentData, get it
  if (!maxVendorId) {
    maxVendorId = getMaxVendorId(vendors);
  }

  // Encode the data with and without ranges and return the smallest encoded payload
  const noRangesData = encodeToBase64({
    ...consentData,
    maxVendorId,
    purposeIdBitString: encodePurposeIdsToBits(purposes, allowedPurposeIds),
    isRange: false,
    vendorIdBitString: encodeVendorIdsToBits(maxVendorId, allowedVendorIds),
  });

  const vendorRangeList = convertVendorsToRanges(vendors, allowedVendorIds);

  const rangesData = encodeToBase64({
    ...consentData,
    maxVendorId,
    purposeIdBitString: encodePurposeIdsToBits(purposes, allowedPurposeIds),
    isRange: true,
    defaultConsent: false,
    numEntries: vendorRangeList.length,
    vendorRangeList,
  });

  return noRangesData.length < rangesData.length ? noRangesData : rangesData;
}

module.exports = {
  convertVendorsToRanges,
  encodeConsentString,
  getMaxVendorId,
  encodeVendorIdsToBits,
  encodePurposeIdsToBits,
};
