export interface User {
  email: string;
  name?: string;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  priceMinorUnits: number;
  currencyCode: string; // ISO 4217 currency code
  beds: number;
  baths: number;
  sqft: number;
  type: 'For Sale' | 'For Rent';
  description: string;
  imageUrls: string[];
  neighborhood: string;
  verified: boolean;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
}