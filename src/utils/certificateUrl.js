// Builds the absolute, scannable URL for a certificate's QR code.
// Certificates store `qrVerificationUrl` as either a relative path
// (`/certificate/CERT-...`, the current backend behavior) or, for older
// demo/seed data, a full URL. Resolving against `window.location.origin`
// means the same code produces a working QR on localhost during dev and on
// whatever domain the app is actually deployed to — never hardcoded.
export function getCertificateQrUrl(cert) {
  const path = cert?.qrVerificationUrl || `/certificate/${cert?.id ?? ''}`;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}
