/**
 * Decode the web-safe, base64-encoded metadata string
 * @param {string} encodedMetadata Web-safe, base64-encoded metadata string
 * @return {object} decoded metadata
 */
const decodeMetadataStringFactory = decoder => vendorVersionMap => (encodedMetadata) => {
  const decodedString = decoder(encodedMetadata);
  const metadata = {};
  vendorVersionMap[decodedString.version]
    .metadataFields.forEach((field) => {
      metadata[field] = decodedString[field];
    });
  return metadata;
};

export default decodeMetadataStringFactory;
