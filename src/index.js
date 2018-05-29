/* jslint browser: true */
/* global window */
import { decodeFromBase64Factory, encodeToBase64Factory } from './utils/bits';
import { decodeConsentStringFactory } from './decode';
import { encodeConsentStringFactory } from './encode';
import ConsentFactory from './ConsentFactory';

//  Build Graph dependencies

const encodeToBase64 = encodeToBase64Factory(window.btoa);
const decodeFromBase64 = decodeFromBase64Factory(window.atob);
const decodeConsentString = decodeConsentStringFactory(decodeFromBase64);
const encodeConsentString = encodeConsentStringFactory(encodeToBase64);
const consentFactoryInstance = new ConsentFactory({
  encoder: encodeConsentString,
  decoder: decodeConsentString,
});

export default consentFactoryInstance;
