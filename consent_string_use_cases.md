## Consent String Use cases

### Vendors

Vendors that receive a consent string encoded by a Consent Management Platform, on a webpage or in a mobile application, can decode the string and determine if they the user has given consent to their specific purpose and vendor IDs.

**Example:**

Assuming you are the vendor with ID 1 and want to check that the user has given consent to access her device (purpose 1) and personalize advertizing (purpose 2):

```javascript
const { ConsentString } = require('consent-string');

const consentData = new ConsentString('encoded base64 consent string received');

if (
  consentData.isVendorAllowed(1)
  && consentData.isPurposeAllowed(1)
  && consentData.isPurposeAllowed(2)
) {
  // The vendor ID and the purposes are all allowed
  // Process with your data collection / processing
} else {
  // Either the vendor or one of the purposes is not allowed by the user
  // Do not collect or process personal data
}
```

### Consent management platforms

CMPs can read a cookie, modify its content then update the cookie value with the correct encoding.

```javascript
const { ConsentString } = require('consent-string');

// Decode the base64-encoded consent string contained in the cookie
const consentData = new ConsentString(readCookieValue());

// Modify the consent data
consentData.setCmpId(1);
consentData.setConsentScreen(1);
consentData.setPurposeAllowed(12, true);

// Update the cookie value
writeCookieValue(consentData.getConsentString());
```

**Note:** CMPs need to manage the cookie operations (reading and writing) themselves.

