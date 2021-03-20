export function formatValue(value) {
    if (value === 0) {
      return "R$ 0,00";
    }

    let decimalValue = (value / 100) * 1.0;
    const formatted = "R$ " + decimalValue.toString().replace('.', ',');
    return {stringValue: formatted, decimalValue};

  }

export function parseValue(value) {
    const parsed = parseFloat(value.slice(3).replace(',', ''));
    return parsed;
  }