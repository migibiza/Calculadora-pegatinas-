
export interface PriceTable {
  [quantity: string]: number;
}

export interface SizeOption {
  id: string;
  label: string;
  w: number;
  h: number;
  precios: PriceTable;
}

export interface ProductConfig {
  unidadMedida: string;
  tamanos: SizeOption[];
  cargoFijo?: number;
  nota?: string;
}

export interface MaterialOption {
  id: string;
  label: string;
  multiplicador: number;
}

export interface AppConfig {
  recargoMaxSizeFueraRango: number;
  ivaPorDefecto: number;
  mostrarIva: boolean;
  materiales: MaterialOption[];
  recargoUrgencia: number;
}

export interface PricingData {
  moneda: string;
  productos: {
    [key: string]: ProductConfig;
  };
  config: AppConfig;
}

export interface QuoteLine {
  id: string;
  materialLabel: string;
  variant: string;
  sizeLabel: string;
  w: number;
  h: number;
  quantity: number;
  totalPrice: number;
  unitPrice: number;
  isCustom: boolean;
  isUrgent: boolean;
}
