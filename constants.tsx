
import React from 'react';
import { PricingData } from './types';

export const INITIAL_DATA: PricingData = {
  "moneda": "EUR",
  "productos": {
    "ovaladas": {
      "unidadMedida": "mm",
      "tamanos": [
        { "id": "oval_75x50", "label": "75×50", "w": 75, "h": 50,
          "precios": { "10": 16, "50": 56, "100": 68, "200": 88, "300": 106, "500": 142, "1000": 218, "2000": 348, "5000": 688, "10000": 1152 }
        },
        { "id": "oval_100x50", "label": "100×50", "w": 100, "h": 50,
          "precios": { "10": 16, "50": 59, "100": 71, "200": 91, "300": 109, "500": 152, "1000": 237, "2000": 385, "3000": 487, "5000": 832, "10000": 1370 }
        },
        { "id": "oval_125x75", "label": "125×75", "w": 125, "h": 75,
          "precios": { "10": 19, "50": 69, "100": 86, "200": 131, "300": 167, "500": 232, "1000": 378, "2000": 639, "5000": 1279, "10000": 2444 }
        },
        { "id": "oval_150x100", "label": "150×100", "w": 150, "h": 100,
          "precios": { "10": 22, "50": 83, "100": 113, "200": 190, "300": 248, "500": 312, "1000": 518, "2000": 811, "3000": 1091, "5000": 1931, "10000": 3978 }
        }
      ]
    },
    "cuadradas": {
      "unidadMedida": "mm",
      "tamanos": [
        { "id": "sq_50", "label": "50×50", "w": 50, "h": 50,
          "precios": { "50": 52, "100": 72, "200": 91, "300": 106, "500": 139, "1000": 178, "2000": 278, "3000": 365, "5000": 532, "10000": 880 }
        },
        { "id": "sq_75", "label": "75×75", "w": 75, "h": 75,
          "precios": { "50": 60, "100": 85, "200": 104, "300": 120, "500": 174, "1000": 227, "2000": 374, "3000": 464, "5000": 691, "10000": 1105 }
        },
        { "id": "sq_100", "label": "100×100", "w": 100, "h": 100,
          "precios": { "50": 71, "100": 94, "200": 131, "300": 177, "500": 241, "1000": 389, "2000": 648, "3000": 868, "5000": 1337, "10000": 2588 }
        },
        { "id": "sq_125", "label": "125×125", "w": 125, "h": 125,
          "precios": { "50": 83, "100": 115, "200": 172, "300": 225, "500": 320, "1000": 533, "2000": 906, "3000": 1242, "5000": 2005, "10000": 3987 }
        }
      ]
    },
    "redondas": {
      "unidadMedida": "mm",
      "tamanos": [
        { "id": "rd_50", "label": "Ø50", "w": 50, "h": 50,
          "precios": { "50": 52, "100": 72, "200": 91, "300": 106, "500": 139, "1000": 178, "2000": 278, "3000": 365, "5000": 532, "10000": 880 }
        },
        { "id": "rd_75", "label": "Ø75", "w": 75, "h": 75,
          "precios": { "50": 60, "100": 85, "200": 104, "300": 120, "500": 174, "1000": 227, "2000": 374, "3000": 464, "5000": 691, "10000": 1105 }
        },
        { "id": "rd_100", "label": "Ø100", "w": 100, "h": 100,
          "precios": { "50": 71, "100": 94, "200": 131, "300": 177, "500": 241, "1000": 389, "2000": 648, "3000": 868, "5000": 1337, "10000": 2588 }
        }
      ]
    },
    "rectangulares": {
      "unidadMedida": "mm",
      "tamanos": [
        { "id": "rc_50x25", "label": "50×25", "w": 50, "h": 25,
          "precios": { "50": 48, "100": 55, "200": 60, "300": 79, "500": 94, "1000": 153, "2000": 200, "3000": 260, "5000": 387, "10000": 601 }
        },
        { "id": "rc_75x50", "label": "75×50", "w": 75, "h": 50,
          "precios": { "50": 56, "100": 80, "200": 102, "300": 124, "500": 158, "1000": 242, "2000": 348, "3000": 467, "5000": 682, "10000": 1157 }
        }
      ]
    },
    "corte en forma": {
      "unidadMedida": "mm",
      "tamanos": [
        { "id": "trq_50", "label": "50×50", "w": 50, "h": 50,
          "precios": { "50": 54, "100": 66, "200": 85, "300": 105, "500": 136, "1000": 181, "2000": 308, "3000": 418, "5000": 620, "10000": 1080 }
        },
        { "id": "trq_75", "label": "75×75", "w": 75, "h": 75,
          "precios": { "50": 64, "100": 94, "200": 118, "300": 146, "500": 210, "1000": 300, "2000": 518, "3000": 746, "5000": 1106, "10000": 1882 }
        },
        { "id": "trq_100", "label": "100×100", "w": 100, "h": 100,
          "precios": { "50": 77, "100": 107, "200": 158, "300": 216, "500": 291, "1000": 481, "2000": 814, "3000": 1118, "5000": 1688, "10000": 2904 }
        },
        { "id": "trq_125", "label": "125×125", "w": 125, "h": 125,
          "precios": { "50": 93, "100": 134, "200": 202, "300": 286, "500": 411, "1000": 680, "2000": 1130, "3000": 1567, "5000": 2340, "10000": 4060 }
        }
      ],
      "cargoFijo": 15
    }
  },
  "config": {
    "recargoMaxSizeFueraRango": 0.15,
    "ivaPorDefecto": 0.21,
    "mostrarIva": true,
    "recargoUrgencia": 0.40,
    "materiales": [
      { "id": "vinilo", "label": "Vinilo Adhesivo", "multiplicador": 1.0 },
      { "id": "papel", "label": "Papel Adhesivo", "multiplicador": 0.5 }
    ]
  }
};

export const Icons = {
  Vinilo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Papel: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Ovaladas: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="12" rx="10" ry="6" />
    </svg>
  ),
  Cuadradas: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  ),
  Redondas: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  Rectangulares: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" ry="2" />
    </svg>
  ),
  CorteEnForma: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Rule: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
      <line x1="7" y1="7" x2="7" y2="12" />
      <line x1="12" y1="7" x2="12" y2="12" />
      <line x1="17" y1="7" x2="17" y2="12" />
    </svg>
  ),
  Quantity: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </svg>
  ),
  Price: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M17 12H7" />
    </svg>
  ),
  Info: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Download: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Delete: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Flash: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
};
