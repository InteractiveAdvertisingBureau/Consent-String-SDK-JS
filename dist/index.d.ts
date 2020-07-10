// Type definitions for consent-string

export interface Purpose {
  id: number;
  name: string;
  description: string;
}

export interface Feature {
  id: number;
  name: string;
  description: string;
}

export interface Vendor {
  deletedDate?: string;
  id: number;
  featureIds: number[];
  legIntPurposeIds: number[];
  name: string;
  policyUrl: string;
  purposeIds: number[];
}

export interface VendorList {
  features: Feature[];
  purposes: Purpose[];
  vendorListVersion: number;
  vendors: Vendor[];
}

export class ConsentString {
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
  public setConsentScreen(screenId: number): void;
  public getConsentScreen(): number;
  public setConsentLanguage(language: string): void;
  public getConsentLanguage(): string;
  public setPurposesAllowed(purposeIds: number[]): void;
  public getPurposesAllowed(): number[];
  public setPurposeAllowed(purposeId: number, value: boolean): void;
  public isPurposeAllowed(purposeId: number): boolean;
  public setVendorsAllowed(vendorIds: number[]): void;
  public getVendorsAllowed(): number[];
  public setVendorAllowed(vendorId: number, value: boolean): void;
  public isVendorAllowed(vendorId: number): boolean;
}

export function decodeConsentString(consentString: string): ConsentString;

export function encodeConsentString(consentData: ConsentString): string;
