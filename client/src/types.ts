export type RegionCode = 'IL' | 'FR' | 'US' | 'JP';

export const REGIONS: RegionCode[] = ['IL', 'FR', 'US', 'JP'];

export type TransactionStatus = 'Approved' | 'Rejected';

export interface TransactionResponse {
  id: string;
  region: RegionCode;
  submittedAtUtc: string;
  localTime: string;
  status: TransactionStatus;
}

export interface AuthResponse {
  token: string;
  email: string;
}
