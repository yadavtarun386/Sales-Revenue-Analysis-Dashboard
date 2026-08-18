export const formatINR = (value, compact = false) => {
  if (value === null || value === undefined || isNaN(value)) return '₹0';
  const val = Number(value);
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  if (compact) {
    if (absVal >= 10000000) {
      return `${isNegative ? '-' : ''}₹${(absVal / 10000000).toFixed(2)}Cr`;
    }
    if (absVal >= 100000) {
      return `${isNegative ? '-' : ''}₹${(absVal / 100000).toFixed(2)}L`;
    }
    if (absVal >= 1000) {
      return `${isNegative ? '-' : ''}₹${(absVal / 1000).toFixed(1)}K`;
    }
    return `${isNegative ? '-' : ''}₹${absVal.toFixed(0)}`;
  }

  if (absVal >= 10000000) {
    return `${isNegative ? '-' : ''}₹${(absVal / 10000000).toFixed(2)} Crore`;
  }
  if (absVal >= 100000) {
    return `${isNegative ? '-' : ''}₹${(absVal / 100000).toFixed(2)} Lakh`;
  }

  return `${isNegative ? '-' : ''}₹${absVal.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`;
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return Number(value).toLocaleString('en-IN');
};

export const formatPercent = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  const num = Number(value);
  const prefix = num > 0 ? '+' : '';
  return `${prefix}${num.toFixed(1)}%`;
};
