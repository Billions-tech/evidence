import { useState, useEffect, useRef, useContext } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyReceipt } from "../api/receipts";
import { verifyUploadReceipt } from "../api/receipts";
import { FaCheckCircle, FaTimesCircle, FaQrcode } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

function Scan() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [verification, setVerification] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const qrRef = useRef(null);
  const { token } = useContext(AuthContext);

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
              const res = await verifyReceipt(decodedText, token);
              setVerification(res.data);
            } catch (err) {
              console.error(err);
              setVerification({
                valid: false,
                error:
                  "Receipt not found. Please check the QR code or upload the receipt for verification.",
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
  }, [token]);

  // Handle receipt upload
  async function handleUpload(e) {
    setUploading(true);
    setUploadError(null);
    setScanResult(null);
    setVerification(null);
    const file = e.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }
    try {
      const res = await verifyUploadReceipt(file, token);
      const data = res.data;
      if (data.valid) {
        setVerification(data);
        setScanResult(data.qrData || "");
      } else {
        setVerification({
          valid: false,
          error: data.error || "Receipt not found or invalid.",
        });
        setUploadError(data.error || "Receipt not found or invalid.");
      }
    } catch (err) {
      console.error(err);
      setUploadError(
        err.response?.data?.error || "Upload failed or server error."
      );
      setVerification({
        valid: false,
        error:
          err.response?.data?.error ||
          "Failed to process image or extract QR code.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-100 via-purple-100 to-white py-8 px-2">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-indigo-700 flex items-center justify-center gap-2">
          <FaQrcode className="inline-block text-indigo-400 text-3xl" />
          Scan Receipt QR Code
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center border border-indigo-100">
          <div
            id="qr-reader"
            ref={qrRef}
            className="rounded-xl overflow-hidden border border-indigo-200 bg-indigo-50 flex items-center justify-center"
            style={{ width: "100%", maxWidth: 420, height: 420 }}
          />
          {/* Receipt Upload */}
          <div className="w-full mt-6 flex flex-col items-center">
            <label className="block text-indigo-700 font-semibold mb-2">
              Or upload receipt to verify:
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full max-w-xs text-sm text-indigo-700 bg-indigo-50 rounded p-2 border border-indigo-200"
            />
            {uploadError && (
              <div className="mt-2 text-red-600 text-sm">{uploadError}</div>
            )}
          </div>
          {scanResult && (
            <div className="w-full mt-6 p-4 rounded-2xl shadow bg-gradient-to-br from-green-50 to-green-100 text-green-900 text-center animate-fade-in">
              <div className="font-semibold text-green-700 text-lg flex items-center justify-center gap-2">
                <FaQrcode className="inline-block text-green-400 text-xl" />
                QR Code Data
              </div>
              <pre className="whitespace-pre-wrap break-words text-xs bg-white/60 rounded p-2 mt-2 text-gray-700 max-h-32 overflow-auto">
                {scanResult}
              </pre>
              {verification && verification.valid && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 shadow flex flex-col items-center animate-fade-in">
                  <FaCheckCircle className="text-3xl text-green-500 mb-2 animate-bounce" />
                  <div className="font-bold text-lg mb-1">
                    Receipt Verified!
                  </div>
                  <div className="text-sm text-blue-700 mb-1">
                    Customer:{" "}
                    <span className="font-semibold">
                      {verification.receipt.customer}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 mb-1">
                    Date:{" "}
                    <span className="font-semibold">
                      {new Date(
                        verification.receipt.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-base font-bold text-green-700 mt-2">
                    Total: ₦
                    {verification.receipt.items?.reduce(
                      (sum, i) => sum + (i.total || 0),
                      0
                    )}
                  </div>
                </div>
              )}
              {verification && !verification.valid && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 text-red-900 shadow flex flex-col items-center animate-fade-in">
                  <FaTimesCircle className="text-3xl text-red-500 mb-2 animate-shake" />
                  <div className="font-bold text-lg mb-1">
                    Receipt Not Found or Invalid!
                  </div>
                  <div className="text-sm text-red-700">
                    {verification.error}
                  </div>
                </div>
              )}
            </div>
          )}
          {error && (
            <div className="w-full mt-6 p-4 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 text-red-800 text-center shadow animate-fade-in">
              {error}
            </div>
          )}
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(.4,0,.2,1) both; }
        @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.5s; }
      `}</style>
    </div>
  );
}

export default Scan;
