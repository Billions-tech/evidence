import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyReceipt } from "../api/receipts";

function Scan() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [verification, setVerification] = useState(null);
  const qrRef = useRef(null);

  useEffect(() => {
    let html5Qr;
    if (qrRef.current) {
      html5Qr = new Html5Qrcode(qrRef.current.id);
      html5Qr
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            setScanResult(decodedText);
            setError(null);
            html5Qr.stop();
            // Verify with backend
            try {
              const res = await verifyReceipt(decodedText);
              setVerification(res.data);
            } catch (err) {
              console.error(err);
              setVerification({
                valid: false,
                error: "Verification failed or receipt not found",
              });
            }
          },
          (err) => {
            console.error(err);
            setError("Camera error or permission denied");
          }
        )
        .catch(
          (err) =>
            console.error(err) || setError("Camera error or permission denied")
        );
    }
    return () => {
      if (html5Qr) {
        try {
          if (html5Qr.isScanning) {
            html5Qr.stop();
          }
        } catch (err) {
          // Prevent crash if scanner is not running
          console.warn("Scanner stop error:", err);
        }
      }
    };
  }, []);

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-200">
        Scan Receipt QR Code
      </h2>
      <div className="bg-white/10 rounded-xl p-6 shadow-lg flex flex-col items-center">
        <div id="qr-reader" ref={qrRef} style={{ width: 320, height: 320 }} />
        {scanResult && (
          <div className="mt-6 p-4 bg-green-100 rounded text-green-800 text-center">
            <div className="font-bold">QR Code Data:</div>
            <pre className="whitespace-pre-wrap break-words">{scanResult}</pre>
            {verification && verification.valid && (
              <div className="mt-4 p-3 bg-blue-100 rounded text-blue-800">
                <div className="font-bold">Receipt Verified!</div>
                <div>Customer: {verification.receipt.customer}</div>
                <div>
                  Date:{" "}
                  {new Date(verification.receipt.createdAt).toLocaleString()}
                </div>
                <div>
                  Total: ₦
                  {verification.receipt.items?.reduce(
                    (sum, i) => sum + (i.total || 0),
                    0
                  )}
                </div>
              </div>
            )}
            {verification && !verification.valid && (
              <div className="mt-4 p-3 bg-red-100 rounded text-red-800">
                <div className="font-bold">Receipt Not Found or Invalid!</div>
                <div>{verification.error}</div>
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-100 rounded text-red-800 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Scan;
