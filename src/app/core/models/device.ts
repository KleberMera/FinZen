export interface Device {
  id?: number;
  userId?: string;
  os: string;
  browser: string;
  isMobile: boolean;
  userAgent: string;
  brand: string;
  model: string;
  status: string;
}
