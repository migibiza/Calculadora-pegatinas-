
import React, { useState, useEffect, useMemo } from 'react';
import { PricingData, QuoteLine } from './types';
import { INITIAL_DATA, Icons } from './constants';
import { calculatePrice } from './services/priceCalculator';

const App: React.FC = () => {
  const [data, setData] = useState<PricingData>(() => {
    const saved = localStorage.getItem('sticker_pricing_data');
    // Basic migration for changed key "troqueladas" to "corte en forma"
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.productos && parsed.productos.troqueladas) {
            parsed.productos["corte en forma"] = parsed.productos.troqueladas;
            parsed.productos["corte en forma"].cargoFijo = 15;
            delete parsed.productos.troqueladas;
            return parsed;
        }
    }
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminJson, setAdminJson] = useState(JSON.stringify(data, null, 2));

  // Selection State
  const [materialId, setMaterialId] = useState<string>('vinilo');
  const [variant, setVariant] = useState<string>('cuadradas');
  const [sizeId, setSizeId] = useState<string>('');
  const [customW, setCustomW] = useState<number>(50);
  const [customH, setCustomH] = useState<number>(50);
  const [quantity, setQuantity] = useState<number>(50);
  const [isCustomQty, setIsCustomQty] = useState(false);
  const [interpolateQty, setInterpolateQty] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [budget, setBudget] = useState<QuoteLine[]>([]);

  const productConfig = data.productos[variant];
  const standardSizes = productConfig?.tamanos || [];
  
  const minAllowedQty = materialId === 'vinilo' ? 25 : 50;

  // Business logic: filter standard quantities based on material and min/max rules
  const standardQtys = useMemo(() => {
    if (!standardSizes.length) return [];
    const firstSize = standardSizes[0];
    const baseQtys = Object.keys(firstSize.precios).map(Number);
    
    // Add 25 to standard selection if it's Vinyl
    if (materialId === 'vinilo' && !baseQtys.includes(25)) {
        baseQtys.push(25);
    }

    return baseQtys
      .filter(q => {
        if (q < minAllowedQty) return false;
        if (materialId === 'vinilo' && q > 1000) return false;
        return true;
      })
      .sort((a, b) => a - b);
  }, [standardSizes, materialId, minAllowedQty]);

  // Sync quantity with material constraints
  useEffect(() => {
    if (quantity < minAllowedQty) {
      setQuantity(minAllowedQty);
    }
    if (materialId === 'vinilo' && quantity > 1000) {
      setQuantity(1000);
      if (!isCustomQty && !standardQtys.includes(1000)) {
          setIsCustomQty(true);
      }
    }
  }, [materialId, quantity, standardQtys, minAllowedQty]);

  // Set initial size
  useEffect(() => {
    if (!sizeId && standardSizes.length > 0) {
      setSizeId(standardSizes[0].id);
    }
  }, [variant, standardSizes, sizeId]);

  const currentSize = standardSizes.find(s => s.id === sizeId);
  const activeW = sizeId === 'custom' ? customW : (currentSize?.w || 50);
  const activeH = sizeId === 'custom' ? customH : (currentSize?.h || 50);

  const result = useMemo(() => {
    return calculatePrice(data, materialId, variant, activeW, activeH, quantity, interpolateQty, isUrgent);
  }, [data, materialId, variant, activeW, activeH, quantity, interpolateQty, isUrgent]);

  const currentMaterial = data.config.materiales.find(m => m.id === materialId);

  const addToBudget = () => {
    const newLine: QuoteLine = {
      id: Math.random().toString(36).substr(2, 9),
      materialLabel: currentMaterial?.label || 'Material',
      variant: variant.toUpperCase(),
      sizeLabel: sizeId === 'custom' ? `${activeW}x${activeH}mm` : (currentSize?.label || ''),
      w: activeW,
      h: activeH,
      quantity,
      totalPrice: result.total,
      unitPrice: result.unit,
      isCustom: result.isCustomSize || result.isCustomQty,
      isUrgent: isUrgent
    };
    setBudget([...budget, newLine]);
  };

  const removeFromBudget = (id: string) => {
    setBudget(budget.filter(item => item.id !== id));
  };

  const handleSaveAdmin = () => {
    try {
      const parsed = JSON.parse(adminJson);
      setData(parsed);
      localStorage.setItem('sticker_pricing_data', JSON.stringify(parsed));
      setIsAdmin(false);
    } catch (e) {
      alert("Error en el formato JSON");
    }
  };

  const totalBudget = budget.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="min-h-screen pb-20 bg-gray-50/50">
      <style>{`
        @keyframes custom-blink {
          0%, 100% { opacity: 1; filter: brightness(1.2); }
          50% { opacity: 0.2; filter: brightness(0.8); }
        }
        .animate-custom-blink {
          animation: custom-blink 0.8s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-4 mb-10 no-print sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="logo.png" 
              alt="La tienda que IMPRIME" 
              className="h-16 sm:h-24 w-auto object-contain transition-transform hover:scale-105 duration-300 cursor-pointer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<h1 class="text-3xl font-black italic tracking-tighter">La tienda que <span class="bg-yellow-400 px-2 rounded-sm shadow-sm">IMPRIME</span></h1>';
              }}
            />
          </div>
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-gray-400 hover:text-indigo-600 transition-all p-3 rounded-full hover:bg-indigo-50 active:scale-90"
            title="Configuración de Administrador"
          >
            <Icons.Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 no-print">
        {/* Admin Overlay */}
        {isAdmin && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Modo Administrador</h2>
                  <p className="text-sm text-gray-500">Configuración global de tarifas y materiales.</p>
                </div>
                <button onClick={() => setIsAdmin(false)} className="text-gray-400 hover:text-red-500 text-3xl transition-colors">×</button>
              </div>
              <textarea 
                value={adminJson}
                onChange={(e) => setAdminJson(e.target.value)}
                className="w-full h-[50vh] font-mono text-xs p-6 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none shadow-inner"
              />
              <div className="flex justify-end gap-4 mt-8">
                <button onClick={() => setIsAdmin(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                <button onClick={handleSaveAdmin} className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">Guardar cambios</button>
              </div>
            </div>
          </div>
        )}

        {/* Left Column: Configuration */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Paso 1: Material */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-100">1</div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Selecciona el material</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.config.materiales.map((m) => {
                const IconComp = m.id === 'vinilo' ? Icons.Vinilo : Icons.Papel;
                const isSelected = materialId === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMaterialId(m.id)}
                    className={`flex items-center gap-5 p-6 rounded-3xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-indigo-600 bg-white text-indigo-700 shadow-xl shadow-indigo-100/50 scale-[1.02]' 
                        : 'border-white bg-white text-gray-500 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl ${isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}>
                      <IconComp className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-black text-base leading-none mb-1">{m.label.toUpperCase()}</p>
                      {m.multiplicador !== 1.0 && <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">AHORRA {Math.round((1 - m.multiplicador) * 100)}%</p>}
                      {m.id === 'vinilo' && <p className="text-[10px] text-indigo-400 mt-1 uppercase font-bold tracking-tighter">Mínimo 25 unidades</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Paso 2: Variante */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-100">2</div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Forma del Sticker</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {Object.keys(data.productos).map((key) => {
                const isSelected = variant === key;
                const iconKey = key.split(/[\s_-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') as keyof typeof Icons;
                const IconComp = Icons[iconKey] || Icons.Cuadradas;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setVariant(key);
                      setSizeId(''); 
                    }}
                    className={`flex flex-col items-center p-5 rounded-3xl border-2 transition-all ${
                      isSelected 
                        ? 'border-indigo-600 bg-white text-indigo-700 shadow-xl shadow-indigo-100/50 scale-[1.05]' 
                        : 'border-white bg-white text-gray-400 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className={`mb-3 transition-transform ${isSelected ? 'scale-110' : ''}`}>
                      <IconComp className={`w-10 h-10 ${isSelected ? 'text-indigo-600' : ''}`} />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                        {key === 'corte en forma' ? 'FORMA LIBRE' : key}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Paso 3: Tamaño */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-100">3</div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Dimensiones (mm)</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {standardSizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSizeId(s.id)}
                  className={`p-4 rounded-2xl border-2 text-sm font-black transition-all ${
                    sizeId === s.id
                      ? 'border-indigo-600 bg-white text-indigo-700 shadow-lg shadow-indigo-100'
                      : 'border-white bg-white text-gray-500 hover:border-gray-200 shadow-sm'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={() => setSizeId('custom')}
                className={`p-4 rounded-2xl border-2 text-sm font-black transition-all flex items-center justify-center gap-2 ${
                  sizeId === 'custom'
                    ? 'border-indigo-600 bg-white text-indigo-700 shadow-lg shadow-indigo-100'
                    : 'border-white bg-white text-gray-500 hover:border-gray-200 shadow-sm'
                }`}
              >
                <Icons.Rule className="w-5 h-5" /> A MEDIDA
              </button>
            </div>
            {sizeId === 'custom' && (
              <div className="bg-white border-2 border-dashed border-gray-200 p-8 rounded-[2rem] grid grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ancho total</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={customW} 
                      onChange={(e) => setCustomW(Number(e.target.value))}
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-black text-xl text-gray-800"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-300">mm</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Alto total</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={customH} 
                      onChange={(e) => setCustomH(Number(e.target.value))}
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-black text-xl text-gray-800"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-300">mm</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Paso 4: Cantidad */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-100">4</div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Cantidad</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              {standardQtys.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuantity(q);
                    setIsCustomQty(false);
                  }}
                  className={`p-4 rounded-2xl border-2 text-sm font-black transition-all ${
                    !isCustomQty && quantity === q
                      ? 'border-indigo-600 bg-white text-indigo-700 shadow-lg shadow-indigo-100'
                      : 'border-white bg-white text-gray-500 hover:border-gray-200 shadow-sm'
                  }`}
                >
                  {q}
                </button>
              ))}
              <button
                onClick={() => setIsCustomQty(true)}
                className={`p-4 rounded-2xl border-2 text-sm font-black transition-all ${
                  isCustomQty
                    ? 'border-indigo-600 bg-white text-indigo-700 shadow-lg shadow-indigo-100'
                    : 'border-white bg-white text-gray-500 hover:border-gray-200 shadow-sm'
                }`}
              >
                OTRA
              </button>
            </div>
            {isCustomQty && (
              <div className="bg-white border-2 border-indigo-50 p-8 rounded-[2rem] space-y-6 animate-in slide-in-from-top-4 duration-300">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Unidades deseadas</label>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                        Min: {minAllowedQty} {materialId === 'vinilo' ? '/ Max: 1000' : ''}
                    </span>
                  </div>
                  <input 
                    type="number" 
                    min={minAllowedQty}
                    max={materialId === 'vinilo' ? "1000" : undefined}
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-black text-3xl text-gray-800"
                  />
                </div>
                <div className="flex items-center justify-between p-5 bg-indigo-50/30 rounded-2xl border border-indigo-50">
                  <div className="flex items-center gap-3">
                    <Icons.Info className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-bold text-gray-600">Interpolar precio exacto</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={interpolateQty} onChange={(e) => setInterpolateQty(e.target.checked)} />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Result Card & Budget */}
        <div className="lg:col-span-5 space-y-8">
          <div className="sticky top-28 space-y-8">
            {/* Live Result Card */}
            <div className={`bg-white border-2 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden transition-all duration-300 ${isUrgent ? 'border-red-500 shadow-red-100' : 'border-gray-100'}`}>
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12">
                <Icons.Price className="w-48 h-48" />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${isUrgent ? 'bg-red-600' : 'bg-indigo-600'}`}></span>
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isUrgent ? 'text-red-600' : 'text-indigo-600'}`}>Precio Estimado</h3>
                    </div>
                    {isUrgent && (
                        <div className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full animate-custom-blink flex items-center gap-1 shadow-lg shadow-red-200">
                            <Icons.Flash className="w-3 h-3" /> LO NECESITO YA
                        </div>
                    )}
                </div>
                
                <div className="flex items-baseline gap-3 mb-3">
                  <span className={`text-7xl font-black tracking-tighter transition-colors ${isUrgent ? 'text-red-900' : 'text-gray-900'}`}>{result.total.toFixed(2)}</span>
                  <span className="text-3xl font-black text-gray-400">{data.moneda}</span>
                </div>
                <p className="text-gray-400 font-bold text-sm mb-8 flex items-center gap-2">
                    Unitario: <span className="text-gray-900 bg-gray-50 px-3 py-1 rounded-full">{result.unit.toFixed(3)} {data.moneda}</span>
                </p>

                {/* Urgency Toggle Section */}
                <div className={`mb-10 p-5 rounded-3xl border flex items-center justify-between group cursor-pointer transition-all active:scale-95 shadow-inner ${isUrgent ? 'bg-red-50 border-red-100' : 'bg-gray-50/80 border-gray-100 hover:bg-white'}`} onClick={() => setIsUrgent(!isUrgent)}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl transition-all ${isUrgent ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-110' : 'bg-white text-gray-400 border border-gray-100'}`}>
                            <Icons.Flash className="w-6 h-6" />
                        </div>
                        <div>
                            <p className={`text-xs font-black uppercase tracking-widest ${isUrgent ? 'text-red-600 animate-custom-blink' : 'text-gray-900'}`}>¿Lo necesitas ya?</p>
                            <p className={`text-[10px] font-bold ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>ENTREGA PRIORITARIA (+{Math.round(data.config.recargoUrgencia * 100)}%)</p>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all ${isUrgent ? 'bg-red-600 animate-custom-blink' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isUrgent ? 'right-1' : 'left-1'}`}></div>
                    </div>
                </div>

                {/* Notices */}
                <div className="space-y-3 mb-10">
                  <div className="bg-gray-50 text-gray-600 px-4 py-3 rounded-2xl text-[11px] font-black flex items-center gap-3 border border-gray-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      {materialId === 'vinilo' ? <Icons.Vinilo className="w-4 h-4 text-indigo-600" /> : <Icons.Papel className="w-4 h-4 text-indigo-600" />}
                    </div>
                    {currentMaterial?.label.toUpperCase()}
                  </div>
                  {result.hasVolumeDiscount && (
                     <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl text-[11px] font-black flex items-center gap-3 border border-green-100">
                        <Icons.Price className="w-5 h-5" /> -15% DESCUENTO VOLUMEN PAPEL
                     </div>
                  )}
                  {result.cargoFijo > 0 && (
                     <div className="bg-red-50 text-red-700 px-4 py-3 rounded-2xl text-[11px] font-black flex items-center gap-3 border border-red-100">
                        <Icons.CorteEnForma className="w-5 h-5 animate-pulse" /> +{result.cargoFijo}€ SUPLEMENTO CORTE ESPECIAL
                     </div>
                  )}
                  {result.isCustomSize && (
                    <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-2xl text-[11px] font-black flex items-center gap-3 border border-amber-100">
                      <Icons.Info className="w-5 h-5" /> TAMAÑO PERSONALIZADO (ÁREA)
                    </div>
                  )}
                </div>

                {/* Upsell */}
                {result.nextStep && !isUrgent && (
                  <div className="bg-indigo-600 p-6 rounded-3xl mb-10 shadow-xl shadow-indigo-100">
                    <p className="text-xs font-black text-indigo-100 mb-2 leading-tight uppercase tracking-widest flex items-center gap-2">
                      <span className="text-lg">✨</span> Super Oferta
                    </p>
                    <p className="text-sm text-white font-bold leading-relaxed">
                      Por solo <span className="bg-white/20 px-2 py-0.5 rounded-md">+{result.nextStep.diff.toFixed(2)}€</span> obtienes <span className="underline decoration-2 underline-offset-4">{result.nextStep.qty} stickers</span> en lugar de {quantity}.
                    </p>
                  </div>
                )}

                <button 
                  onClick={addToBudget}
                  className={`w-full py-5 text-white rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 group ${isUrgent ? 'bg-red-600 hover:bg-red-700 shadow-red-200 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                >
                  <Icons.Quantity className="w-6 h-6 group-hover:rotate-12 transition-transform" /> AÑADIR AL PRESUPUESTO
                </button>
              </div>
            </div>

            {/* Current Budget List */}
            {budget.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-lg animate-in fade-in zoom-in-95 duration-300">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Presupuesto Actual</h3>
                <div className="space-y-5 mb-8">
                  {budget.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group bg-gray-50/50 p-3 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                            {item.isUrgent && (
                                <div className="absolute -top-2 -left-2 bg-red-600 text-white p-1 rounded-lg animate-custom-blink z-10 shadow-sm">
                                    <Icons.Flash className="w-3 h-3" />
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase mb-0.5 tracking-tighter">{item.materialLabel}</p>
                                <p className="text-sm font-black text-gray-800 uppercase leading-none">{item.variant} · {item.quantity} uds</p>
                                <p className="text-[11px] text-gray-400 font-bold mt-1">{item.sizeLabel}</p>
                            </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-base font-black ${item.isUrgent ? 'text-red-600' : 'text-gray-900'}`}>{item.totalPrice.toFixed(2)}€</span>
                        <button onClick={() => removeFromBudget(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl">
                          <Icons.Delete className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-6 flex justify-between items-center mb-8">
                  <span className="font-black text-gray-300 uppercase tracking-widest text-xs">TOTAL ESTIMADO</span>
                  <span className="text-3xl font-black text-gray-900">{totalBudget.toFixed(2)}€</span>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                  <Icons.Download className="w-5 h-5" /> DESCARGAR PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Print Only View */}
      <div className="hidden print-only p-12 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-16">
          <div className="flex flex-col items-start gap-6">
             <img src="logo.png" alt="Logo" className="h-28 w-auto" />
             <div>
                <h1 className="text-3xl font-black mb-1 tracking-tighter">PRESUPUESTO ESTIMADO</h1>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Validez: 15 días · {new Date().toLocaleDateString()}</p>
             </div>
          </div>
          <div className="text-right">
            <p className="font-black text-xl uppercase tracking-widest mb-1">La tienda que IMPRIME</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Estudio de Impresión Premium</p>
            <div className="mt-4 text-[10px] text-gray-500 font-bold uppercase space-y-1">
                <p>Calle del Diseño, 42</p>
                <p>www.latiendaqueimprime.com</p>
                <p>hola@latiendaqueimprime.com</p>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse mb-16">
          <thead>
            <tr className="border-b-4 border-black text-left">
              <th className="py-5 font-black uppercase text-[10px] tracking-widest">Material</th>
              <th className="py-5 font-black uppercase text-[10px] tracking-widest">Variante</th>
              <th className="py-5 font-black uppercase text-[10px] tracking-widest">Dimensiones</th>
              <th className="py-5 font-black uppercase text-[10px] tracking-widest text-right">Uds.</th>
              <th className="py-5 font-black uppercase text-[10px] tracking-widest text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {budget.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-5 font-bold text-xs uppercase text-gray-600">
                    <div className="flex items-center gap-2">
                        {item.materialLabel}
                        {item.isUrgent && <span className="text-red-600 font-black text-[9px] border border-red-600 px-1 rounded-sm tracking-tighter">LO NECESITO YA</span>}
                    </div>
                </td>
                <td className="py-5 font-black uppercase text-sm">{item.variant}</td>
                <td className="py-5 text-xs text-gray-500 font-medium">{item.sizeLabel}</td>
                <td className="py-5 text-right font-bold">{item.quantity}</td>
                <td className={`py-5 text-right font-black text-lg ${item.isUrgent ? 'text-red-600' : ''}`}>{item.totalPrice.toFixed(2)}€</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-20">
          <div className="w-72 space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-gray-400">Base Imponible</span>
              <span>{(totalBudget / (1 + data.config.ivaPorDefecto)).toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-gray-400">IVA ({Math.round(data.config.ivaPorDefecto * 100)}%)</span>
              <span>{(totalBudget - (totalBudget / (1 + data.config.ivaPorDefecto))).toFixed(2)}€</span>
            </div>
            <div className="flex justify-between pt-6 border-t-4 border-black items-center">
              <span className="font-black text-2xl tracking-tighter uppercase">TOTAL</span>
              <span className="font-black text-4xl">{totalBudget.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t-2 border-gray-100">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-900">Condiciones Generales</h4>
          <p className="text-[9px] text-gray-400 font-bold leading-relaxed max-w-3xl uppercase tracking-wider">
            1. Precios calculados para archivos finales CMYK con 3mm de sangrado. 
            2. Cantidad mínima 50 unidades (25 para Vinilo Adhesivo). 
            3. Variantes de "Forma libre" incluyen suplemento técnico obligatorio. 
            4. Se aplica 15% descuento extra en papel para pedidos superiores a 200 uds. 
            5. Los pedidos urgentes (LO NECESITO YA) tienen prioridad absoluta de producción con un recargo del 40%.
            6. Este documento no constituye una factura definitiva, es una estimación de costes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
