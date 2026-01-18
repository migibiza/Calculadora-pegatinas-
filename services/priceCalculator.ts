
import { PricingData, SizeOption } from '../types';

/**
 * Linearly interpolates between two points.
 */
const interpolate = (x: number, x0: number, x1: number, y0: number, y1: number) => {
  if (x1 === x0) return y0;
  return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
};

export const calculatePrice = (
  data: PricingData,
  materialId: string,
  variant: string,
  width: number,
  height: number,
  quantity: number,
  interpolateQty: boolean = false,
  isUrgent: boolean = false
): { 
  total: number; 
  unit: number; 
  nextStep?: { qty: number; total: number; diff: number }; 
  isCustomSize: boolean; 
  isCustomQty: boolean; 
  cargoFijo: number;
  hasVolumeDiscount: boolean;
} => {
  const product = data.productos[variant];
  if (!product) return { total: 0, unit: 0, isCustomSize: false, isCustomQty: false, cargoFijo: 0, hasVolumeDiscount: false };

  const material = data.config.materiales.find(m => m.id === materialId) || data.config.materiales[0];
  const baseMaterialMultiplier = material.multiplicador;
  const cargoFijo = product.cargoFijo || 0;

  // REGLAS DE NEGOCIO: Enforce quantity bounds
  const minQty = materialId === 'vinilo' ? 25 : 50;
  let effectiveQty = Math.max(minQty, quantity);
  if (materialId === 'vinilo') {
    effectiveQty = Math.min(1000, effectiveQty);
  }

  // REGLA DE DESCUENTO POR VOLUMEN (PAPEL > 200 uds)
  let hasVolumeDiscount = false;
  let finalMaterialMultiplier = baseMaterialMultiplier;
  if (materialId === 'papel' && effectiveQty > 200) {
    finalMaterialMultiplier = baseMaterialMultiplier * 0.85; // -15% adicional
    hasVolumeDiscount = true;
  }

  const area = width * height;
  
  // 1. Determine base price using size interpolation
  const sortedSizes = [...product.tamanos].sort((a, b) => (a.w * a.h) - (b.w * b.h));
  const minSize = sortedSizes[0];
  const maxSize = sortedSizes[sortedSizes.length - 1];

  let standardSizeRef: { w: number; h: number; precios: { [q: string]: number } }[] = [];
  let isCustomSize = true;

  const exactSize = sortedSizes.find(s => s.w === width && s.h === height);
  if (exactSize) {
    standardSizeRef = [exactSize];
    isCustomSize = false;
  } else if (area <= (minSize.w * minSize.h)) {
    standardSizeRef = [minSize];
  } else if (area >= (maxSize.w * maxSize.h)) {
    standardSizeRef = [maxSize];
  } else {
    const upper = sortedSizes.find(s => (s.w * s.h) >= area)!;
    const lower = [...sortedSizes].reverse().find(s => (s.w * s.h) <= area)!;
    standardSizeRef = [lower, upper];
  }

  const getQtyPrice = (size: SizeOption | typeof minSize, qty: number): number => {
    const originalQtys = Object.keys(size.precios).map(Number).sort((a, b) => a - b);
    
    // CREACIÓN DE TRAMO VIRTUAL PARA VINILO 25 UDS (-30%)
    const virtualPrices: { [q: number]: number } = { ...size.precios };
    if (materialId === 'vinilo') {
      const priceAt50 = size.precios[50] || size.precios[originalQtys.find(q => q >= 50) || originalQtys[0]];
      virtualPrices[25] = priceAt50 * 0.7; // 30% de descuento sobre el precio de 50
    }

    const qtys = Object.keys(virtualPrices).map(Number).sort((a, b) => a - b);
    const exactQty = virtualPrices[qty];
    
    if (exactQty !== undefined) return exactQty;

    if (qty <= qtys[0]) return virtualPrices[qtys[0]];
    if (qty >= qtys[qtys.length - 1]) return virtualPrices[qtys[qtys.length - 1]];

    const upperQty = qtys.find(q => q > qty)!;
    const lowerQty = [...qtys].reverse().find(q => q < qty)!;

    if (interpolateQty) {
      return interpolate(qty, lowerQty, upperQty, virtualPrices[lowerQty], virtualPrices[upperQty]);
    } else {
      return virtualPrices[upperQty];
    }
  };

  let finalPrice = 0;
  if (standardSizeRef.length === 1) {
    finalPrice = getQtyPrice(standardSizeRef[0] as SizeOption, effectiveQty);
  } else {
    const p1 = getQtyPrice(standardSizeRef[0] as SizeOption, effectiveQty);
    const p2 = getQtyPrice(standardSizeRef[1] as SizeOption, effectiveQty);
    const a1 = standardSizeRef[0].w * standardSizeRef[0].h;
    const a2 = standardSizeRef[1].w * standardSizeRef[1].h;
    finalPrice = interpolate(area, a1, a2, p1, p2);
  }

  const maxArea = maxSize.w * maxSize.h;
  if (area > maxArea) {
    const ratio = area / maxArea;
    finalPrice = finalPrice * ratio * (1 + data.config.recargoMaxSizeFueraRango);
  }

  // Aplicar multiplicador de material (con descuento si aplica) y luego añadir cargo fijo de corte
  finalPrice = (finalPrice * finalMaterialMultiplier) + cargoFijo;

  // RECARGO DE URGENCIA
  if (isUrgent) {
    finalPrice = finalPrice * (1 + (data.config.recargoUrgencia || 0.40));
  }

  // Next step calculation (Upsell)
  let nextStep;
  const standardQtysForUpsell = Object.keys(minSize.precios)
    .map(Number)
    .filter(q => {
        const mq = materialId === 'vinilo' ? 25 : 50;
        if (q < mq) return false;
        if (materialId === 'vinilo' && q > 1000) return false;
        return true;
    })
    .sort((a, b) => a - b);
    
  const currentStepIdx = standardQtysForUpsell.findIndex(q => q > effectiveQty);
  if (currentStepIdx !== -1) {
    const nextQty = standardQtysForUpsell[currentStepIdx];
    const nextPriceData = calculatePrice(data, materialId, variant, width, height, nextQty, false, isUrgent);
    nextStep = {
      qty: nextQty,
      total: nextPriceData.total,
      diff: nextPriceData.total - finalPrice
    };
  }

  const isCustomQty = !Object.keys(minSize.precios).includes(effectiveQty.toString()) && effectiveQty !== 25;

  return {
    total: finalPrice,
    unit: finalPrice / effectiveQty,
    nextStep,
    isCustomSize,
    isCustomQty,
    cargoFijo,
    hasVolumeDiscount
  };
};
