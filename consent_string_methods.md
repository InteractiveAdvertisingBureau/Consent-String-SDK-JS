## Consent String Methods

#### constructor
Constructs new object

```javascript
// @param str is the web-safe base64 encoded consent string or null (no parameter) 
constructor( str = null )
```
---

#### getConsentString()
Gets the consent string either new one created or one passed in on construction.
```javascript
// @return web-safe base64 encoded consent string
getConsentString()
```

---

#### getLastUpdated()
Gets the `Date` of last updated
```javascript
// @return Date
getLastUpdated()
```

---

#### setLastUpdated(date)
Sets the `Date` of last updated
```javascript
setLastUpdated(new Date());
```

---

#### getCreatedDate()
Gets the `Date` created
```javascript
// @return Date
getCreatedDate()
```

---

#### setCreatedDate(date)
Sets the `Date` created
```javascript
setCreatedDate(new Date());
```

___

#### getMaxVendorId()
Gets the maxVendorId from the vendor list. 
```javascript
// @return number 
getMaxVendorId()
```
---
#### getParsedVendorConsents()
Gets the binary string format of the vendor consents.  1 being has consent 0 being no consent.
```javascript
// @return string (binary) 
getParsedVendorConsents()
```
---
#### getParsedPurposeConsents()
Gets the binary string format of the purpose consents.  1 being has consent 0 being no consent.
```javascript
// @return string (binary) 
getParsedPurposeConsents()
```
---
#### getMetadataString()
Gets the metadata string as defined in the response to the getVendorConsents method (ie binary string that includes only header information like consent string version, timestamps, cmp ID, etc. but no purposes/consents information).

```javascript
// @return web-safe base64 encoded metadata string 
getMetadataString()
```
---

#### ConsentString.decodeMetadataString() (Static Method)
Decodes the metadata string.

```javascript
// @return object with metadata fields 
ConsentString.decodeMetadataString(encodedMetadataString)
```
---
#### getVersion()
The version number in which this consent string specification adheres to

```javascript
// @return integer version number of consent string specification 
getVersion()
```

---
#### getVendorListVersion()
Returns either the vendor list version set by `setGlobalVendorList` or whatever was previously set as the consent string when the object was created

```javascript
// @return integer version number of vendor list version 
getVendorListVersion()
```
---
#### setGlobalVendorList( gvlObject )
Sets the global vendor list object.  Generally this would be the parsed JSON that comes from the IAB hosted Global Vendor List.

```javascript
// @param gvlObject is the parsed JSON that conforms to the IAB EU TCF Vendor List Specification
setGlobalVendorList( gvlObject )
```
---
#### getGlobalVendorList()
Gets the global vendor list object.

```javascript
// @param gvlObject is the parsed JSON that conforms to the IAB EU TCF Vendor List Specification
getGlobalVendorList();
```
---
#### setCmpId( cmpId )
Sets CMP ID number that is assigned to your CMP from the IAB EU.  A unique ID will be assigned to each Consent Manager Provider

```javascript
// @param cmpId the id for the cmp setting the consent string values.
setCmpId( cmpId )
```
---
#### getCmpId()
Get the ID of the CMP from the consent string

```javascript
// @return CMP id
getCmpId()
```
---
#### setCmpVersion( version )
Sets the version of the CMP code that created or updated the consent string

```javascript
// @param version - CMP version
setCmpVersion( version )
```
---
#### getCmpVersion()
The version of the CMP code that created or updated the consent string

```javascript
// @return version CMP version
getCmpVersion()
```
---
#### setConsentScreen( screenId )
Sets the consent screen id.  The screen number is CMP and CMP Version specific, and is for logging proof of consent

```javascript
// @param screenId id for the screen in which the consent values were confirmed
setConsentScreen( screenId )
```
---
#### getConsentScreen()
The screen number is CMP and CmpVersion specific, and is for logging proof of consent

```javascript
// @return screenId id for the screen in which the consent values were confirmed
getConsentScreen()
```
---
#### setConsentLanguage( language ) 
Sets consent language. Two-letter ISO639-1 language code that CMP asked for consent in

```javascript
// @param language two character ISO639-1 language code
setConsentLanguage( language )
```
---
#### getConsentLanguage()
gets consent language. Two-letter ISO639-1 language code that CMP asked for consent in

```javascript
// @return language two character ISO639-1 language code
getConsentLanguage()
```
---
#### setPurposesAllowed( purposeIdArray)
Sets the allowed purposes as an array of purpose ids

```javascript
// @param purposeIdArray variable length array of integers setting which purposes are allowed.  If the id is in the array it’s allowed.
setPurposesAllowed( purposeIdArray)
```
---
#### getPurposesAllowed()
Gets an array of purposes allowed either set by `setPurposesAllowed` or whatever was previously set by the initializing consent string

```javascript
// @return variable length array of integers setting which purposes are allowed.  If the id is in the array it’s allowed.
getPurposesAllowed()
```
---
#### setPurposeAllowed( purposeId, value )
Sets a single purpose by id and boolean value

```javascript
// @param purposeId the purpose id
// @param value the boolean value to set it to true for allowed false for not allowed
setPurposeAllowed( purposeId, value )
```
---
#### isPurposeAllowed( purposeId ) 
Gets a single purpose by id and returns boolean value

```javascript
// @param purposeId the purpose id
// @return boolean value true for allowed false for not allowed
isPurposeAllowed( purposeId )
```
---
#### setVendorAllowed( vendorId, valueBool ) 
Sets consent value for a vendor id

```javascript
// @param vendorId - vendor id to set consent value for
// @param value - the boolean value to set the consent to 
setVendorAllowed( vendorId, valueBool )
```
---
#### isVendorAllowed( vendorId ) 
For determining if the vendor consent value bit is turned on or off for a particular vendor id.

```javascript
// @param vendorId vendor id to see if consent is allowed for
// @return boolean value of consent for that vendor id

isVendorAllowed( vendorId )
```
