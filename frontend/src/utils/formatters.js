export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatPercentage = (val) => {
  if (val === undefined || val === null) return '0%';
  return `${(val * 100).toFixed(1)}%`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getRiskBadgeColor = (risk) => {
  switch (risk?.toLowerCase()) {
    case 'low':
      return { bg: 'rgba(30, 122, 70, 0.12)', text: '#1E7A46', border: '#B7E3C3' };
    case 'moderate':
      return { bg: 'rgba(201, 162, 75, 0.15)', text: '#B88219', border: '#F2DFB3' };
    case 'high':
      return { bg: 'rgba(179, 56, 44, 0.12)', text: '#B3382C', border: '#F0C2BC' };
    default:
      return { bg: '#E2E8F0', text: '#475569', border: '#CBD5E1' };
  }
};
