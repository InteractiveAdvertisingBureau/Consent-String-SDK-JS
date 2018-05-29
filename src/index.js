/* jslint browser: true */
/* global window */
import { decodeFromBase64Factory, encodeToBase64Factory } from './utils/bits';
import { decodeConsentStringFactory } from './decode';
import { encodeConsentStringFactory } from './encode';
import ConsentFactory from './ConsentFactory';
import { vendorVersionMap } from './utils/definitions';
import decodeMetadataStringFactory from './utils/decodeMetadataString';

//  Build Graph dependencies

const encodeToBase64 = encodeToBase64Factory(window.btoa);
const decodeFromBase64 = decodeFromBase64Factory(window.atob);
const decodeConsentString = decodeConsentStringFactory(decodeFromBase64);
const encodeConsentString = encodeConsentStringFactory(encodeToBase64);
const consentFactory = new ConsentFactory({
  encoder: encodeConsentString,
  decoder: decodeConsentString,
});

const decodeMetadataString = decodeMetadataStringFactory(decodeConsentString)(vendorVersionMap);

export {
  consentFactory,
  decodeMetadataString,
};
