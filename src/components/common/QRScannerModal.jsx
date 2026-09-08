import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { verifyCertificatePublic } from '../../services/storageService';

// Pulls the certificate identifier out of whatever a real QR code encodes —
// either a bare id/seal-tag/serial, or the full qrVerificationUrl
// ("/certificate/CERT-2026-001" or "https://host/certificate/CERT-2026-001").
function extractIdentifier(decodedText) {
  const trimmed = decodedText.trim();
  const match = trimmed.match(/\/certificate\/([^/?#]+)/i);
  return match ? decodeURIComponent(match[1]) : trimmed;
}

export default function QRScannerModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  // idle -> requesting -> scanning -> checking -> found | notfound | camera-error
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [foundCert, setFoundCert] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [manualChecking, setManualChecking] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const lastScanAtRef = useRef(0);
  const closingRef = useRef(false);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const lookup = useCallback(
    async (rawText) => {
      const identifier = extractIdentifier(rawText);
      if (!identifier) return;
      setStatus('checking');
      try {
        const certificate = await verifyCertificatePublic(identifier);
        if (closingRef.current) return;
        setFoundCert(certificate);
        setStatus('found');
        setTimeout(() => {
          if (closingRef.current) return;
          onClose();
          navigate(`/certificate/${certificate.id}`);
        }, 1000);
      } catch (error) {
        if (closingRef.current) return;
        setErrorMessage(error.message || 'No certificate found for this code.');
        setStatus('notfound');
      }
    },
    [navigate, onClose]
  );

  const decodeLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(decodeLoop);
      return;
    }

    // Throttle actual decode work to ~8/sec — jsQR on every frame is wasteful.
    const now = performance.now();
    if (now - lastScanAtRef.current < 120) {
      rafRef.current = requestAnimationFrame(decodeLoop);
      return;
    }
    lastScanAtRef.current = now;

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, width, height);

    let imageData;
    try {
      imageData = ctx.getImageData(0, 0, width, height);
    } catch {
      rafRef.current = requestAnimationFrame(decodeLoop);
      return;
    }

    const result = jsQR(imageData.data, width, height);
    if (result && result.data) {
      stopCamera();
      lookup(result.data);
      return;
    }

    rafRef.current = requestAnimationFrame(decodeLoop);
  }, [lookup, stopCamera]);

  const startCamera = useCallback(async () => {
    setStatus('requesting');
    setErrorMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (closingRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('scanning');
      rafRef.current = requestAnimationFrame(decodeLoop);
    } catch (error) {
      if (closingRef.current) return;
      setErrorMessage(
        error.name === 'NotAllowedError'
          ? 'Camera access was denied. Allow camera permission, or enter the code below.'
          : 'No camera available on this device. Enter the code below instead.'
      );
      setStatus('camera-error');
    }
  }, [decodeLoop]);

  useEffect(() => {
    if (isOpen) {
      closingRef.current = false;
      setFoundCert(null);
      setManualCode('');
      startCamera();
    } else {
      closingRef.current = true;
      stopCamera();
    }
    return () => {
      closingRef.current = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setManualChecking(true);
    await lookup(manualCode.trim());
    setManualChecking(false);
  };

  const handleClose = () => {
    closingRef.current = true;
    stopCamera();
    onClose();
  };

  const handleRescan = () => {
    setErrorMessage('');
    setFoundCert(null);
    startCamera();
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1070 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg bg-dark text-white">
          <div className="modal-header border-secondary py-2 px-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-qr-code-scan text-warning fs-5"></i>
              <h6 className="modal-title fw-bold mb-0">Legal Metrology QR Code Scanner</h6>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4 text-center">
            {/* Viewfinder — real camera feed underneath, decorative scan overlay on top */}
            <div className="qr-scanner-viewfinder mx-auto position-relative mb-3">
              <video ref={videoRef} muted playsInline className="qr-scanner-video" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {status !== 'scanning' && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3 text-white-50" style={{ background: 'rgba(15,23,42,0.92)' }}>
                  {status === 'requesting' && (
                    <>
                      <div className="spinner-border text-warning mb-2" role="status"></div>
                      <small>Requesting camera access…</small>
                    </>
                  )}
                  {status === 'checking' && (
                    <>
                      <div className="spinner-border text-warning mb-2" role="status"></div>
                      <small>Checking National Legal Metrology Registry…</small>
                    </>
                  )}
                  {status === 'found' && (
                    <>
                      <i className="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
                      <small>Verified! Opening certificate…</small>
                    </>
                  )}
                  {(status === 'camera-error' || status === 'notfound' || status === 'idle') && (
                    <>
                      <i className="bi bi-camera-video-off fs-1 mb-2 text-warning opacity-75"></i>
                      <small>{status === 'notfound' ? 'Not found' : 'Camera unavailable'}</small>
                    </>
                  )}
                </div>
              )}

              {status === 'scanning' && <div className="qr-scanner-laser"></div>}
              <div className="viewfinder-corner top-left"></div>
              <div className="viewfinder-corner top-right"></div>
              <div className="viewfinder-corner bottom-left"></div>
              <div className="viewfinder-corner bottom-right"></div>
            </div>

            {status === 'scanning' && (
              <p className="small text-white-50 mb-3">Point the camera at the Stamping Seal QR Code on the instrument.</p>
            )}

            {foundCert && status === 'found' && (
              <div className="alert alert-success d-flex align-items-center justify-content-center gap-2 py-2 mb-3">
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <div>
                  <strong>QR Code Verified!</strong>
                  <div className="small">Redirecting to official certificate {foundCert.id}...</div>
                </div>
              </div>
            )}

            {(errorMessage || status === 'notfound' || status === 'camera-error') && (
              <div className="alert alert-warning py-2 small mb-3">
                {errorMessage}
                {status === 'notfound' && (
                  <div className="mt-2">
                    <button type="button" className="btn btn-sm btn-outline-dark" onClick={handleRescan}>
                      <i className="bi bi-arrow-repeat me-1"></i> Scan Again
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="border-top border-secondary pt-3 mt-2 text-start">
              <label className="small text-secondary fw-semibold mb-2 text-uppercase d-block">
                Or enter the Certificate No. / Stamping Tag manually
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  placeholder="e.g. LM-DL-2026-4359"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
                <button type="submit" className="btn btn-warning btn-sm fw-bold" disabled={manualChecking || !manualCode.trim()}>
                  {manualChecking ? 'Checking…' : 'Verify'}
                </button>
              </div>
            </form>
          </div>

          <div className="modal-footer border-secondary py-2 px-3">
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
