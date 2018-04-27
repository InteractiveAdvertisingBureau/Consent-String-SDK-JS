// Type definitions for consent-string

export = ConsentString;

interface Purpose {
  id: number;
  name: string;
}

interface Vendor {
  id: number;
  name: string;
}

interface VendorList {
  version: number;
  origin: string;
  purposes: Purpose[];
  vendors: Vendor[];
}

declare class ConsentString {
  constructor(baseString?: string);

  private created: Date;
  private lastUpdated: Date;
  private version: number;
  private vendorList: VendorList;
  private vendorListVersion: number;
  private cmpId: number;
  private cmpVersion: number;
  private consentScreen: number;
  private consentLanguage: string;
  private allowedPurposeIds: number[];
  private allowedVendorIds: number[];

  public getConsentString(updateDate?:boolean): string;
  public getVersion(): number;
  public getVendorListVersion(): number;
  public setGlobalVendorList(vendorList: VendorList): void;
  public setCmpId(cmpId: number): void;
  public getCmpId(): number;
  public setCmpVersion(version: number): void;
  public getCmpVersion(): number;
  setConsentScreen(screenId: number): void;
  getConsentScreen(): number;
  setConsentLanguage(language: string): void;
  getConsentLanguage(): string;
  setPurposesAllowed(purposeIds: number[]): void;
  getPurposesAllowed(): number;
  setPurposeAllowed(purposeId: number, value: boolean): void;
  isPurposeAllowed(purposeId: number): boolean;
  setVendorsAllowed(vendorIds: number[]): void;
  getVendorsAllowed(): number[];
  setVendorAllowed(vendorId: number, value: boolean): void;
  isVendorAllowed(vendorId: number): boolean;
}
