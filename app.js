
const taxConstants = {
    2022: {
        grundfreibetrag: 10347,
        grenze1: 10909,
        grenze2: 14926,
        grenze3: 58596,
        grenze4: 277825,
      },
      2023: {
        grundfreibetrag: 10908,
        grenze1: 10909,
        grenze2: 14926,
        grenze3: 58596,
        grenze4: 277825,
      },
      2024: {
        grundfreibetrag: 11604,
        grenze1: 11605,
        grenze2: 15499,
        grenze3: 62809,
        grenze4: 277825,
      },
      2025: {
        grundfreibetrag: 12096,
        grenze1: 11605,
        grenze2: 15499,
        grenze3: 62809,
        grenze4: 277825,
      },
      2026: {
        grundfreibetrag: 12096,
        grenze1: 12097,
        grenze2: 17443,
        grenze3: 68480,
        grenze4: 277825,
      },
  };
  

  function calculateZvE(input) {
    const constants = taxConstants[input.year];
    if (!constants) return null;
    return Math.max(0, input.income - constants.grundfreibetrag);
  }
  

  function calculateTax(input) {
    const constants = taxConstants[input.year];
    if (!constants) return null;
  
    const zvE = calculateZvE(input);
    if (zvE === null) return null;
  
    let tax = 0;
    let taxBracket = '';
  
    if (zvE <= 0) {
      taxBracket = 'Fall 1 - Unterhalb Grundfreibetrag';
    } else if (zvE <= constants.grenze2 - constants.grundfreibetrag) {
      const y = (zvE - (constants.grenze1 - constants.grundfreibetrag)) / 10000;
      tax = (1088.67 * y + 1400) * y;
      taxBracket = 'fall 2 - basicsteuersatz';
    } else if (zvE <= constants.grenze3 - constants.grundfreibetrag) {
      const z = (zvE - (constants.grenze2 - constants.grundfreibetrag)) / 10000;
      tax = (206.43 * z + 2397) * z + 869.32;
      taxBracket = 'fall 3 - zwischen Basic u. spitzensteuersatz';
    } else if (zvE <= constants.grenze4 - constants.grundfreibetrag) {
      tax = 0.42 * zvE - 9336.45;
      taxBracket = 'fall 4 - spitzensteuersatz';
    } else {
      tax = 0.45 * zvE - 17671.20;
      taxBracket = 'fall 5 - höchststeuersatz';
    }
  
    return {
      zvE: Math.round(zvE),
      tax: Math.round(tax),
      taxBracket,
    };
  }
  

  document.getElementById('taxForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
  
    const income = Number(document.getElementById('income').value);
    const year = Number(document.getElementById('year').value);
  
    const input = { income, year };
  
    const result = calculateTax(input);
    const resultDiv = document.getElementById('result');
  
    if (result && resultDiv) {
      resultDiv.innerHTML = `
      <h2>⚠️ Dein ESt ist folgend: ⚠️</h2>
      <p>🀙 zvE <h3>${result.zvE} € </h3></p>
      <p>🀚 steuer - von der Regierung auszurauben! <h3>${result.tax} € 🤬</h3></p>
      <p>🀛 Dein steuerfall <h3>${result.taxBracket}</h3></p>
      `;
    } else {
      if (resultDiv) {
        resultDiv.innerHTML = `<p style="color: red;">error! ${year} nicht verfügar! </p>`;
      }
    }
  });