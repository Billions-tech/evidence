// src/components/ReceiptDisplay.jsx
import { QRCodeSVG } from "qrcode.react";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaShareAlt,
  FaPrint,
  FaDownload,
  FaFilePdf,
  FaBuilding,
} from "react-icons/fa";
import {
  downloadReceiptAsPDF,
  downloadReceiptAsImage,
} from "../utils/receiptDownload";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ReceiptDisplay({ receipt }) {
  const { user } = useContext(AuthContext);
  if (!receipt || typeof receipt !== "object") {
    return (
      <div className="mt-8 mx-auto max-w-md p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-indigo-50 via-purple-100 to-white border border-indigo-200 text-gray-900 text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          No Receipt Found
        </h2>
        <div className="text-gray-500">
          The requested receipt could not be loaded or does not exist.
        </div>
      </div>
    );
  }
  // Calculate overall total
  const items = Array.isArray(receipt.items) ? receipt.items : [];
  const overallTotal = items.reduce(
    (sum, i) => sum + (parseFloat(i.total) || 0),
    0
  );
  const qrData = JSON.stringify({
    id: receipt.id || "-",
    customer: receipt.customer || "-",
    total: overallTotal,
    date: receipt.createdAt || "-",
  });

  // Print handler
  // Print only the receipt div (no header/buttons)
  const handlePrint = () => {
    const receiptNode = document.getElementById("receipt-display");
    if (!receiptNode) return;
    // Clone node to ensure QR SVG is present
    const clone = receiptNode.cloneNode(true);
    // Inline all SVGs (for QR code)
    const svgs = receiptNode.querySelectorAll("svg");
    const cloneSvgs = clone.querySelectorAll("svg");
    svgs.forEach((svg, i) => {
      cloneSvgs[i].outerHTML = svg.outerHTML;
    });
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { background: #fff; color: #222; }
          </style>
        </head>
        <body>${clone.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Download as PDF
  const handleDownloadPDF = async () => {
    await downloadReceiptAsPDF(
      "receipt-display",
      `receipt_${receipt.id || Date.now()}.pdf`
    );
  };

  // Download as Image
  const handleDownloadImage = async () => {
    await downloadReceiptAsImage(
      "receipt-display",
      `receipt_${receipt.id || Date.now()}.png`
    );
  };

  // Share handler
  const handleShare = async () => {
    const shareData = {
      title: "Receipt",
      text: `Receipt for ${receipt.customer}\nAmount: ₦${
        receipt.amount
      }\nDate: ${formatDate(receipt.createdAt)}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        alert("Share failed: " + err.message);
      }
    } else {
      alert("Web Share API not supported on this device.");
    }
  };

  // Date formatting helper
  function formatDate(date) {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  }

  return (
    <>
      {/* Action Buttons - outside receipt */}
      <div className="flex gap-3 justify-center mb-4">
        <button
          title="Share"
          onClick={handleShare}
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-3 rounded-full shadow"
        >
          <FaShareAlt />
        </button>
        <button
          title="Print"
          onClick={handlePrint}
          className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-3 rounded-full shadow"
        >
          <FaPrint />
        </button>
        <button
          title="Download as PDF"
          onClick={handleDownloadPDF}
          className="bg-red-100 hover:bg-red-200 text-red-700 p-3 rounded-full shadow"
        >
          <FaFilePdf />
        </button>
        <button
          title="Download as Image"
          onClick={handleDownloadImage}
          className="bg-green-100 hover:bg-green-200 text-green-700 p-3 rounded-full shadow"
        >
          <FaDownload />
        </button>
      </div>
      <div
        id="receipt-display"
        className="mx-auto max-w-md p-8 rounded-2xl shadow-2xl bg-white border border-indigo-200 text-gray-900 print:bg-white print:shadow-none print:border-none"
      >
        {/* Business Info */}
        <div className="flex items-center justify-center mx-auto gap-5 mb-4">
          {user?.logo ? (
            <img
              src={user.logo}
              alt="Logo"
              className="w-16 h-16 rounded-full border-4 border-indigo-400 bg-white object-cover"
            />
          ) : (
            <FaBuilding className="w-16 h-16 text-indigo-400 bg-white rounded-full p-2" />
          )}
          <div className="text-center">
            <div className="text-xl font-bold text-indigo-700">
              {user?.businessName || user?.name}
            </div>
            {user?.slogan && (
              <div className="text-indigo-400 italic text-sm">
                {user.slogan}
              </div>
            )}
          </div>
        </div>
        {/* Receipt Header */}
        <div className="flex justify-between mx-auto items-center mb-4">
          <h2 className="font-bold tracking-wide mx-auto text-indigo-700">
            Receipt
          </h2>
        </div>
        {/* QR Code */}
        <div className="mb-6 flex flex-col items-center justify-center">
          <QRCodeCanvas
            value={qrData}
            size={100}
            className="mx-auto text-black"
          />
          <div className="text-xs text-gray-500 mt-2">
            Scan for authenticity
          </div>
        </div>
        {/* Receipt Details */}
        <div className="space-y-2 text-lg">
          <div>
            <span className="font-semibold text-indigo-600">Customer:</span>{" "}
            {receipt.customer}
          </div>
          <div>
            <span className="font-semibold text-purple-600">Date:</span>{" "}
            {formatDate(receipt.createdAt)}
          </div>
          {/* Items Table */}
          <div className="mt-4">
            <table className="w-full text-sm border border-indigo-200 rounded-lg overflow-hidden">
              <thead className="bg-indigo-100 text-indigo-700">
                <tr>
                  <th className="py-2 px-2 text-left">Item</th>
                  <th className="py-2 px-2 text-left">Unit</th>
                  <th className="py-2 px-2 text-left">Price</th>
                  <th className="py-2 px-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((itm, idx) => (
                  <tr key={idx} className="border-t border-indigo-100">
                    <td className="py-2 px-2">{itm.item}</td>
                    <td className="py-2 px-2">{itm.unit}</td>
                    <td className="py-2 px-2">₦{itm.price}</td>
                    <td className="py-2 px-2 font-bold">₦{itm.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-right text-lg font-bold text-green-700">
            Total: ₦{overallTotal}
          </div>
          <div className="mt-4">
            <span className="font-semibold text-yellow-600">🙌:</span>{" "}
            {receipt.footerMsg ||
              user?.defaultFooterMsg ||
              "Thank you for your patronage!"}
          </div>
        </div>
        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-gray-400 print:hidden">
          Powered by Billions Technologies
        </div>
      </div>
    </>
  );
}
