document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  
  // Platform & Mode Controls
  const btnIFood = document.getElementById('btnIFood');
  const btnComeCome = document.getElementById('btnComeCome');
  const btnModeReverso = document.getElementById('btnModeReverso');
  const btnModeDireto = document.getElementById('btnModeDireto');
  const modeDesc = document.getElementById('modeDesc');
  
  // Parameter Inputs
  const inputDesiredProfit = document.getElementById('inputDesiredProfit');
  const inputVitrinePriceInput = document.getElementById('inputVitrinePriceInput');
  const inputCOGS = document.getElementById('inputCOGS');
  const inputFixedCosts = document.getElementById('inputFixedCosts');
  const inputPlatformCommission = document.getElementById('inputPlatformCommission');
  const valPlatformCommission = document.getElementById('valPlatformCommission');
  const inputPlatformCashback = document.getElementById('inputPlatformCashback');
  const valPlatformCashback = document.getElementById('valPlatformCashback');
  const inputAnchorPrice = document.getElementById('inputAnchorPrice');
  
  // Payment Cards
  const paymentCards = document.querySelectorAll('.payment-card');
  
  // Dynamic Group Containers
  const groupReversoInput = document.getElementById('groupReversoInput');
  const groupDiretoInput = document.getElementById('groupDiretoInput');
  
  // Results Display
  const displaySuggestedPrice = document.getElementById('displaySuggestedPrice');
  const mainPriceLabel = document.getElementById('mainPriceLabel');
  const displayMarginPercent = document.getElementById('displayMarginPercent');
  const marginGaugeFill = document.getElementById('marginGaugeFill');
  const marginStatusBadge = document.getElementById('marginStatusBadge');
  const breakdownList = document.getElementById('breakdownList');
  
  // Psychological pricing elements
  const checkPsychological = document.getElementById('checkPsychological');
  const selectPsyTermination = document.getElementById('selectPsyTermination');
  const psyOptions = document.getElementById('psyOptions');
  
  // Expert Advice
  const expertAdviceBox = document.getElementById('expertAdviceBox');
  
  // Copy Button
  const btnCopyPrice = document.getElementById('btnCopyPrice');

  // iFood Presets Elements
  const ifoodPresetsGroup = document.getElementById('ifoodPresetsGroup');
  const presetIFoodBasic = document.getElementById('presetIFoodBasic');
  const presetIFoodDelivery = document.getElementById('presetIFoodDelivery');
  const presetIFoodCustom = document.getElementById('presetIFoodCustom');

  // ==========================================
  // APPLICATION STATE
  // ==========================================
  const activePaymentCard = document.querySelector('.payment-card.active');
  const initialPaymentRate = activePaymentCard ? (parseFloat(activePaymentCard.querySelector('.payment-rate-input').value) || 1.20) / 100 : 0.0120;
  const initialPaymentName = activePaymentCard ? activePaymentCard.querySelector('.payment-name').textContent : 'PIX';

  let state = {
    platform: 'comecome',       // 'ifood' or 'comecome'
    mode: 'reverso',         // 'reverso' or 'direto'
    desiredProfit: 15.00,    // R$
    vitrinePriceInput: 39.90, // R$ (For direct mode)
    cogs: 10.00,             // R$
    fixedCosts: 3.50,        // R$
    commissionRate: 0.20,    // % (0.20)
    cashbackRate: 0.00,      // % (0.00)
    paymentRate: initialPaymentRate,
    paymentName: initialPaymentName,
    anchorPrice: null,       // R$ or null
    psychologicalActive: true,
    psychologicalTermination: 90 // cents (.90)
  };

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  // Platform Selector
  btnIFood.addEventListener('click', () => setPlatform('ifood'));
  btnComeCome.addEventListener('click', () => setPlatform('comecome'));

  // Mode Selector
  btnModeReverso.addEventListener('click', () => setMode('reverso'));
  btnModeDireto.addEventListener('click', () => setMode('direto'));

  // Numerical Inputs and Sliders
  inputDesiredProfit.addEventListener('input', (e) => {
    state.desiredProfit = parseFloat(e.target.value) || 0;
    calculate();
  });

  inputVitrinePriceInput.addEventListener('input', (e) => {
    state.vitrinePriceInput = parseFloat(e.target.value) || 0;
    calculate();
  });

  inputCOGS.addEventListener('input', (e) => {
    state.cogs = parseFloat(e.target.value) || 0;
    calculate();
  });

  inputFixedCosts.addEventListener('input', (e) => {
    state.fixedCosts = parseFloat(e.target.value) || 0;
    calculate();
  });

  inputPlatformCommission.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) || 0;
    state.commissionRate = val / 100;
    valPlatformCommission.textContent = `${val}%`;
    calculate();
  });

  inputPlatformCashback.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) || 0;
    state.cashbackRate = val / 100;
    valPlatformCashback.textContent = `${val}%`;
    calculate();
  });

  inputAnchorPrice.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    state.anchorPrice = isNaN(val) || val <= 0 ? null : val;
    calculate();
  });

  // Payment Channels Grid Selection & Editable Rates
  paymentCards.forEach(card => {
    const rateInput = card.querySelector('.payment-rate-input');

    // Click selects the payment card
    card.addEventListener('click', (e) => {
      // If clicking directly on the input, prevent double calculation trigger
      if (e.target.tagName === 'INPUT') return;
      
      paymentCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const val = parseFloat(rateInput.value) || 0;
      state.paymentRate = val / 100;
      state.paymentName = card.querySelector('.payment-name').textContent;
      
      calculate();
    });

    // Input changes update the active rate
    rateInput.addEventListener('input', () => {
      if (!card.classList.contains('active')) {
        paymentCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      }
      
      const val = parseFloat(rateInput.value) || 0;
      state.paymentRate = val / 100;
      state.paymentName = card.querySelector('.payment-name').textContent;
      
      calculate();
    });
  });

  // Psychological Rounding Checkbox and Dropdown
  checkPsychological.addEventListener('change', (e) => {
    state.psychologicalActive = e.target.checked;
    if (state.psychologicalActive) {
      psyOptions.classList.remove('hidden');
    } else {
      psyOptions.classList.add('hidden');
    }
    calculate();
  });

  selectPsyTermination.addEventListener('change', (e) => {
    state.psychologicalTermination = parseInt(e.target.value);
    calculate();
  });

  // Copy price to clipboard button click listener
  if (btnCopyPrice) {
    btnCopyPrice.addEventListener('click', () => {
      // Extract numeric string or content
      const priceText = displaySuggestedPrice.textContent.replace('R$ ', '').trim();
      navigator.clipboard.writeText(priceText).then(() => {
        btnCopyPrice.classList.add('success');
        btnCopyPrice.innerHTML = '<i class="lucide-check"></i> <span>Copiado!</span>';
        if (window.lucide) {
          window.lucide.createIcons();
        }
        setTimeout(() => {
          btnCopyPrice.classList.remove('success');
          btnCopyPrice.innerHTML = '<i class="lucide-copy"></i> <span>Copiar Preço</span>';
          if (window.lucide) {
            window.lucide.createIcons();
          }
        }, 2000);
      }).catch(err => {
        console.error('Falha ao copiar preço: ', err);
      });
    });
  }

  // iFood Presets Listeners
  if (presetIFoodBasic) {
    presetIFoodBasic.addEventListener('click', () => {
      state.commissionRate = 0.12;
      inputPlatformCommission.value = 12;
      valPlatformCommission.textContent = '12%';
      presetIFoodBasic.classList.add('active');
      if (presetIFoodDelivery) presetIFoodDelivery.classList.remove('active');
      if (presetIFoodCustom) presetIFoodCustom.classList.remove('active');
      calculate();
    });
  }

  if (presetIFoodDelivery) {
    presetIFoodDelivery.addEventListener('click', () => {
      state.commissionRate = 0.23;
      inputPlatformCommission.value = 23;
      valPlatformCommission.textContent = '23%';
      presetIFoodDelivery.classList.add('active');
      if (presetIFoodBasic) presetIFoodBasic.classList.remove('active');
      if (presetIFoodCustom) presetIFoodCustom.classList.remove('active');
      calculate();
    });
  }

  if (presetIFoodCustom) {
    presetIFoodCustom.addEventListener('click', () => {
      presetIFoodCustom.classList.add('active');
      if (presetIFoodBasic) presetIFoodBasic.classList.remove('active');
      if (presetIFoodDelivery) presetIFoodDelivery.classList.remove('active');
    });
  }

  // Update slider input handler to toggle custom preset if relevant
  inputPlatformCommission.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) || 0;
    state.commissionRate = val / 100;
    valPlatformCommission.textContent = `${val}%`;
    
    if (state.platform === 'ifood') {
      if (val === 12) {
        if (presetIFoodBasic) presetIFoodBasic.classList.add('active');
        if (presetIFoodDelivery) presetIFoodDelivery.classList.remove('active');
        if (presetIFoodCustom) presetIFoodCustom.classList.remove('active');
      } else if (val === 23) {
        if (presetIFoodDelivery) presetIFoodDelivery.classList.add('active');
        if (presetIFoodBasic) presetIFoodBasic.classList.remove('active');
        if (presetIFoodCustom) presetIFoodCustom.classList.remove('active');
      } else {
        if (presetIFoodCustom) presetIFoodCustom.classList.add('active');
        if (presetIFoodBasic) presetIFoodBasic.classList.remove('active');
        if (presetIFoodDelivery) presetIFoodDelivery.classList.remove('active');
      }
    }
    calculate();
  });


  // ==========================================
  // HELPER ACTIONS
  // ==========================================

  function setPlatform(platform) {
    state.platform = platform;
    if (platform === 'ifood') {
      btnIFood.classList.add('active');
      btnComeCome.classList.remove('active');
      if (ifoodPresetsGroup) ifoodPresetsGroup.classList.remove('hidden');
      
      // Default to iFood Delivery preset (23%)
      state.commissionRate = 0.23;
      inputPlatformCommission.value = 23;
      valPlatformCommission.textContent = '23%';
      
      if (presetIFoodDelivery) presetIFoodDelivery.classList.add('active');
      if (presetIFoodBasic) presetIFoodBasic.classList.remove('active');
      if (presetIFoodCustom) presetIFoodCustom.classList.remove('active');
    } else {
      btnComeCome.classList.add('active');
      btnIFood.classList.remove('active');
      if (ifoodPresetsGroup) ifoodPresetsGroup.classList.add('hidden');
      
      // Default to Come Come preset (20%)
      state.commissionRate = 0.20;
      inputPlatformCommission.value = 20;
      valPlatformCommission.textContent = '20%';
    }
    calculate();
  }

  function setMode(mode) {
    state.mode = mode;
    if (mode === 'reverso') {
      btnModeReverso.classList.add('active');
      btnModeDireto.classList.remove('active');
      groupReversoInput.classList.remove('hidden');
      groupDiretoInput.classList.add('hidden');
      mainPriceLabel.textContent = 'Preço de Vitrine Sugerido';
      modeDesc.innerHTML = '<strong>Modo Reverso:</strong> Defina quanto quer lucrar limpo no bolso por venda e nós calculamos o preço ideal de vitrine.';
    } else {
      btnModeDireto.classList.add('active');
      btnModeReverso.classList.remove('active');
      groupReversoInput.classList.add('hidden');
      groupDiretoInput.classList.remove('hidden');
      mainPriceLabel.textContent = 'Preço de Vitrine Analisado';
      modeDesc.innerHTML = '<strong>Análise Direta:</strong> Insira o preço de vitrine atual e nós calculamos o lucro líquido e margem real obtidos.';
    }
    calculate();
  }

  // ==========================================
  // MATHEMATICAL LOGIC AND CALCULATIONS
  // ==========================================

  function calculate() {
    let rawVitrinePrice = 0;
    let finalVitrinePrice = 0;
    
    // Aditive factor divisor
    let divisor = 1 - (state.commissionRate + state.paymentRate + state.cashbackRate);
    let isFeasible = true;
    if (divisor <= 0.10) {
      divisor = 0.10; // Cap to prevent division by zero or extreme spikes
      isFeasible = false;
    }

    if (state.mode === 'reverso') {
      // MODO REVERSO Aditive Formula: Pv = (Profit + COGS + Fixed) / divisor
      rawVitrinePrice = (state.desiredProfit + state.cogs + state.fixedCosts) / divisor;
      
      if (state.psychologicalActive && isFeasible) {
        finalVitrinePrice = applyPsychologicalRounding(rawVitrinePrice);
      } else {
        finalVitrinePrice = Math.max(0, rawVitrinePrice);
      }
    } else {
      // MODO DIRETO: Price is directly defined by user
      finalVitrinePrice = state.vitrinePriceInput;
    }

    // Calculate aditive deductions based on the final vitrine price
    const platformCashbackVal = finalVitrinePrice * state.cashbackRate;
    const paymentFeeVal = finalVitrinePrice * state.paymentRate;
    const platformCommissionVal = finalVitrinePrice * state.commissionRate;
    const totalFees = platformCashbackVal + paymentFeeVal + platformCommissionVal;
    
    // Net profit
    let netProfit = finalVitrinePrice - totalFees - state.cogs - state.fixedCosts;
    if (netProfit < -999) netProfit = -999;
    
    // Margem de Contribuição %
    let marginPercent = 0;
    if (finalVitrinePrice > 0) {
      marginPercent = (netProfit / finalVitrinePrice) * 100;
    }

    // Update displays
    displaySuggestedPrice.textContent = formatCurrency(finalVitrinePrice);
    displayMarginPercent.textContent = `${marginPercent.toFixed(1)}%`;
    
    // Update Gauge
    updateMarginGauge(marginPercent);
    
    // Update Detailed Cascade Breakdown List
    updateBreakdownList(finalVitrinePrice, platformCommissionVal, platformCashbackVal, paymentFeeVal, netProfit);
    
    // Update Price Composition Stacked Bar
    updatePriceCompositionBar(finalVitrinePrice, netProfit, state.cogs, state.fixedCosts, totalFees);

    // Run Local Expert Heuristics
    generateExpertAdvice(finalVitrinePrice, netProfit, marginPercent);
  }

  // Update Price Composition Stacked Bar
  function updatePriceCompositionBar(vitrinePrice, netProfit, cogs, fixedCosts, totalFees) {
    const segmentProfit = document.getElementById('segmentProfit');
    const segmentCmv = document.getElementById('segmentCmv');
    const segmentFixed = document.getElementById('segmentFixed');
    const segmentFees = document.getElementById('segmentFees');

    const legendValueProfit = document.getElementById('legendValueProfit');
    const legendValueCmv = document.getElementById('legendValueCmv');
    const legendValueFixed = document.getElementById('legendValueFixed');
    const legendValueFees = document.getElementById('legendValueFees');

    // Treat negative profit as 0 for visual percentage representation
    const visualProfit = Math.max(0, netProfit);
    const totalParts = visualProfit + cogs + fixedCosts + totalFees;

    if (totalParts > 0 && vitrinePrice > 0) {
      const profitPct = (visualProfit / totalParts) * 100;
      const cogsPct = (cogs / totalParts) * 100;
      const fixedPct = (fixedCosts / totalParts) * 100;
      const feesPct = (totalFees / totalParts) * 100;

      if (segmentProfit) segmentProfit.style.width = `${profitPct}%`;
      if (segmentCmv) segmentCmv.style.width = `${cogsPct}%`;
      if (segmentFixed) segmentFixed.style.width = `${fixedPct}%`;
      if (segmentFees) segmentFees.style.width = `${feesPct}%`;

      // Set tooltips
      if (segmentProfit) segmentProfit.title = `Lucro: R$ ${formatCurrency(netProfit)} (${((netProfit/vitrinePrice)*100).toFixed(1)}%)`;
      if (segmentCmv) segmentCmv.title = `CMV: R$ ${formatCurrency(cogs)} (${((cogs/vitrinePrice)*100).toFixed(1)}%)`;
      if (segmentFixed) segmentFixed.title = `Custos Fixos: R$ ${formatCurrency(fixedCosts)} (${((fixedCosts/vitrinePrice)*100).toFixed(1)}%)`;
      if (segmentFees) segmentFees.title = `Taxas: R$ ${formatCurrency(totalFees)} (${((totalFees/vitrinePrice)*100).toFixed(1)}%)`;
    } else {
      if (segmentProfit) segmentProfit.style.width = '0%';
      if (segmentCmv) segmentCmv.style.width = '0%';
      if (segmentFixed) segmentFixed.style.width = '0%';
      if (segmentFees) segmentFees.style.width = '0%';
    }

    // Update legend values
    if (legendValueProfit) legendValueProfit.textContent = `R$ ${formatCurrency(netProfit)}`;
    if (legendValueCmv) legendValueCmv.textContent = `R$ ${formatCurrency(cogs)}`;
    if (legendValueFixed) legendValueFixed.textContent = `R$ ${formatCurrency(fixedCosts)}`;
    if (legendValueFees) legendValueFees.textContent = `R$ ${formatCurrency(totalFees)}`;
  }

  // Psychological pricing engine: round up to nearest xx.T
  function applyPsychologicalRounding(price) {
    if (price <= 0) return 0;
    
    const centsTarget = state.psychologicalTermination / 100; // e.g., 0.90
    const integerPart = Math.floor(price);
    const decimalPart = price - integerPart;
    
    let roundedPrice = 0;
    if (decimalPart <= centsTarget) {
      roundedPrice = integerPart + centsTarget;
    } else {
      roundedPrice = (integerPart + 1) + centsTarget;
    }
    
    // Ensure we don't return a price lower than raw calculation to protect margins
    if (roundedPrice < price) {
      roundedPrice += 1.00;
    }
    
    return roundedPrice;
  }

  function formatCurrency(val) {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Margin Health Gauge updater
  function updateMarginGauge(margin) {
    // Clean classes
    marginGaugeFill.className = 'gauge-fill';
    marginStatusBadge.className = 'gauge-status-badge';
    
    // Clip negative/exceeding margins for visual gauge fill
    const displayWidth = Math.max(0, Math.min(100, margin));
    marginGaugeFill.style.width = `${displayWidth}%`;

    if (margin >= 25) {
      marginGaugeFill.classList.add('healthy');
      marginStatusBadge.classList.add('success');
      marginStatusBadge.innerHTML = `<i class="lucide-check-circle-2"></i> Altamente Saudável`;
    } else if (margin >= 15) {
      marginGaugeFill.classList.add('warning');
      marginStatusBadge.classList.add('alert');
      marginStatusBadge.innerHTML = `<i class="lucide-alert-triangle"></i> Margem Estreita`;
    } else {
      marginGaugeFill.classList.add('danger');
      marginStatusBadge.classList.add('critical');
      marginStatusBadge.innerHTML = `<i class="lucide-x-circle"></i> Margem Crítica / Prejuízo`;
    }
  }

  // Detailed Cascade List Renderer
  function updateBreakdownList(vitrinePrice, commissionVal, cashbackVal, paymentFeeVal, netProfit) {
    let divisor = 1 - (state.commissionRate + state.paymentRate + state.cashbackRate);
    let isFeasible = divisor > 0.10;

    let html = `
      <div class="breakdown-item">
        <span class="item-label"><i class="lucide-tag"></i> Preço de Vitrine</span>
        <div class="item-val-group">
          <span class="item-percent">100%</span>
          <span class="item-price">R$ ${formatCurrency(vitrinePrice)}</span>
        </div>
      </div>
    `;

    if (state.cashbackRate > 0) {
      html += `
        <div class="breakdown-item">
          <span class="item-label"><i class="lucide-ticket"></i> Cashback / Cupons</span>
          <div class="item-val-group">
            <span class="item-percent">-${(state.cashbackRate * 100).toFixed(1)}%</span>
            <span class="item-price">R$ ${formatCurrency(cashbackVal)}</span>
          </div>
        </div>
      `;
    }

    html += `
      <div class="breakdown-item">
        <span class="item-label"><i class="lucide-banknote"></i> Tx. Financeira (${state.paymentName})</span>
        <div class="item-val-group">
          <span class="item-percent">-${(state.paymentRate * 100).toFixed(1)}%</span>
          <span class="item-price">R$ ${formatCurrency(paymentFeeVal)}</span>
        </div>
      </div>

      <div class="breakdown-item">
        <span class="item-label"><i class="lucide-store"></i> Comissão Plataforma</span>
        <div class="item-val-group">
          <span class="item-percent">-${(state.commissionRate * 100).toFixed(1)}%</span>
          <span class="item-price">R$ ${formatCurrency(commissionVal)}</span>
        </div>
      </div>

      <div class="breakdown-item">
        <span class="item-label"><i class="lucide-beef"></i> Custos de Insumo (CMV)</span>
        <div class="item-val-group">
          <span class="item-percent">${vitrinePrice > 0 ? ((state.cogs / vitrinePrice) * 100).toFixed(1) : 0}%</span>
          <span class="item-price">R$ ${formatCurrency(state.cogs)}</span>
        </div>
      </div>

      <div class="breakdown-item">
        <span class="item-label"><i class="lucide-box"></i> Embalagem e Fixos</span>
        <div class="item-val-group">
          <span class="item-percent">${vitrinePrice > 0 ? ((state.fixedCosts / vitrinePrice) * 100).toFixed(1) : 0}%</span>
          <span class="item-price">R$ ${formatCurrency(state.fixedCosts)}</span>
        </div>
      </div>
    `;

    // Feasibility Warning inside list if applicable
    if (!isFeasible) {
      html += `
        <div class="breakdown-item text-danger" style="padding: 0.5rem; background: rgba(239,68,68,0.1); border-radius: 6px; margin: 0.5rem 0;">
          <span class="item-label text-danger" style="font-weight: 700;"><i class="lucide-alert-octagon"></i> Taxas Altas Demais!</span>
          <span style="font-size: 0.75rem; text-align: right; color: var(--danger);">Calculadora operando com travas de segurança.</span>
        </div>
      `;
    }

    // Profit line
    html += `
      <div class="breakdown-item item-profit">
        <span class="item-label"><i class="lucide-wallet"></i> Lucro Líquido Real</span>
        <div class="item-val-group">
          <span class="item-percent" style="color: ${netProfit >= 0 ? 'var(--accent-light)' : 'var(--danger)'};">
            ${vitrinePrice > 0 ? ((netProfit / vitrinePrice) * 100).toFixed(1) : 0}%
          </span>
          <span class="item-price" style="color: ${netProfit >= 0 ? 'var(--accent)' : 'var(--danger)'};">
            R$ ${formatCurrency(netProfit)}
          </span>
        </div>
      </div>
    `;

    breakdownList.innerHTML = html;
  }

  // ==========================================
  // ECOM EXPERT ADVISOR - LOCAL HEURISTICS ENGINE
  // ==========================================

  function generateExpertAdvice(price, netProfit, margin) {
    let tips = [];
    
    // 1. Margin-based heuristics
    if (margin < 0) {
      tips.push({
        type: 'critical',
        text: `<strong>Operação com prejuízo!</strong> Você está pagando R$ ${formatCurrency(Math.abs(netProfit))} para vender. Aumente imediatamente o preço de vitrine ou reduza os custos.`
      });
    } else if (margin < 15) {
      tips.push({
        type: 'alert',
        text: `<strong>Margem perigosa (${margin.toFixed(1)}%):</strong> Evite fazer cupons ou campanhas de frete grátis co-participados, pois seu lucro será zerado.`
      });
    } else if (margin >= 25) {
      tips.push({
        type: 'success',
        text: `<strong>Excelente margem (${margin.toFixed(1)}%):</strong> Seu produto tem tração de lucro saudável. Ótimo momento para ativar cupons inteligentes de R$ 5 para ranquear seu cardápio.`
      });
    }

    // 2. COGS (CMV) heuristics
    const cogsPct = price > 0 ? (state.cogs / price) * 100 : 0;
    if (cogsPct > 40) {
      tips.push({
        type: 'info',
        text: `<strong>CMV Alto (${cogsPct.toFixed(1)}%):</strong> O ideal para delivery é manter o insumo abaixo de 30% a 35%. Estude reduzir frações de ingredientes ou negociar compras em lote.`
      });
    } else if (price > 0 && cogsPct < 22) {
      tips.push({
        type: 'success',
        text: `<strong>Excelente CMV (${cogsPct.toFixed(1)}%):</strong> Custo de insumo altamente competitivo. Isso lhe dá uma barreira defensiva contra oscilações de taxas.`
      });
    }

    // 3. Packaging & Fixed Costs
    const fixedPct = price > 0 ? (state.fixedCosts / price) * 100 : 0;
    if (fixedPct > 10) {
      tips.push({
        type: 'info',
        text: `<strong>Custo de Embalagem elevado (${fixedPct.toFixed(1)}%):</strong> Seus custos fixos estão consumindo uma fatia relevante do pedido. Tente criar combos para diluir esse custo.`
      });
    }

    // 4. Payment channel advices
    if (state.paymentName === 'PIX') {
      const creditRateInput = document.getElementById('payCredit').querySelector('.payment-rate-input');
      const creditRate = (parseFloat(creditRateInput.value) || 4.27) / 100;
      tips.push({
        type: 'success',
        text: `<strong>PIX ativo (${(state.paymentRate * 100).toFixed(1)}%):</strong> Melhor margem financeira possível. A economia em relação ao cartão de crédito é de R$ ${formatCurrency(price * (creditRate - state.paymentRate))} por pedido.`
      });
    }

    // 5. Anchor Price marketing heuristics
    if (state.anchorPrice) {
      if (state.anchorPrice <= price) {
        tips.push({
          type: 'info',
          text: `<strong>Ancoragem inativa:</strong> O preço anterior (De) deve ser maior que o preço final para criar o efeito promocional de desconto no cardápio do cliente.`
        });
      } else {
        const discountVal = ((state.anchorPrice - price) / state.anchorPrice) * 100;
        if (discountVal > 40) {
          tips.push({
            type: 'alert',
            text: `<strong>Desconto agressivo (${discountVal.toFixed(0)}% OFF):</strong> Descontos acima de 30% costumam parecer artificiais ou desesperados para o cliente. Use com cautela.`
          });
        } else if (discountVal >= 15 && discountVal <= 30) {
          tips.push({
            type: 'success',
            text: `<strong>Ancoragem no 'sweet spot' (${discountVal.toFixed(0)}% OFF):</strong> Esta faixa de desconto coopera perfeitamente com o algoritmo visual, impulsionando cliques.`
          });
        }
      }
    } else {
      tips.push({
        type: 'info',
        text: `<strong>Alavanque Vendas:</strong> Adicionar um preço âncora ("DE") ativa o gatilho mental de economia no cérebro do consumidor, aumentando cliques no cardápio em até 24%.`
      });
    }

    // Assemble list
    let adviceHtml = `<ul class="expert-tips-list">`;
    tips.forEach(t => {
      let classType = 'tip-info';
      if (t.type === 'critical') classType = 'tip-alert';
      if (t.type === 'alert') classType = 'tip-alert';
      if (t.type === 'success') classType = 'tip-success';
      
      adviceHtml += `<li class="${classType}">${t.text}</li>`;
    });
    adviceHtml += `</ul>`;
    
    expertAdviceBox.innerHTML = adviceHtml;
  }

  // ==========================================
  // INITIALIZATION RUN
  // ==========================================
  setPlatform('comecome');
  setMode('reverso');

});
