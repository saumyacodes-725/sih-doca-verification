// Statutory fee schedule, mirrored from the frontend's calculateFee() in
// ApplyVerificationPage.jsx. Kept here too so the amount actually charged
// through the payment gateway is computed server-side from the instrument
// record, never trusted from the client request body.
export function calculateFee(instrument) {
  if (!instrument) {
    return { total: 800, verification: 600, seal: 100, portal: 100 };
  }
  if (instrument.type?.includes('Weighbridge')) {
    return { total: 4500, verification: 4000, seal: 300, portal: 200 };
  }
  if (instrument.accuracyClass?.includes('Class I')) {
    return { total: 2000, verification: 1700, seal: 200, portal: 100 };
  }
  if (instrument.category?.includes('Petroleum')) {
    return { total: 2500, verification: 2200, seal: 200, portal: 100 };
  }
  return { total: 800, verification: 600, seal: 100, portal: 100 };
}

export function formatRupees(amount) {
  return `₹ ${amount.toLocaleString('en-IN')}`;
}
