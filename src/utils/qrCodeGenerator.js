/**
 * QR Code Generator Utility
 * Generates QR code for quiz short URLs using QR server API
 * No additional dependencies needed - uses external QR service
 */

export function generateQRCodeURL(quizId, baseURL = window.location.origin) {
  const shortURL = `${baseURL}/quiz/${quizId}`;
  // Using QR Server API (free, no auth needed)
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shortURL)}`;
  return { shortURL, qrCodeURL };
}

export function downloadQRCode(quizId, quizTitle) {
  const { qrCodeURL } = generateQRCodeURL(quizId);
  const link = document.createElement('a');
  link.href = qrCodeURL;
  link.download = `${quizTitle}-${quizId}-qr.png`;
  link.click();
}
