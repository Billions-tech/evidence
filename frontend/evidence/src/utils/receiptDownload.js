// Exported share function for use in ReceiptDisplay.jsx
export async function shareReceiptAsImage(
  elementId,
  fileName = "receipt.png",
  shareTitle = "Receipt Image",
  shareText = "Receipt"
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const { clone, restore } = prepareForCapture(element);
  if (!clone) return;
  document.body.appendChild(clone);
  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: "#fff",
      useCORS: true,
    });
    await new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve();
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: shareTitle,
              text: shareText,
            });
            return resolve();
          } catch (err) {
            alert("Share failed: " + err.message);
            return resolve();
          }
        } else {
          alert("Web Share API not supported on this device.");
          return resolve();
        }
      }, "image/png");
    });
  } finally {
    restore();
    document.body.removeChild(clone);
  }
}
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Prepare a clone for html2canvas: force safe background, remove unsupported colors, and inline SVGs (for QR code)
function prepareForCapture(element) {
  if (!element) return { clone: null, restore: () => {} };
  const clone = element.cloneNode(true);
  // Replace QR code canvas with PNG image in the clone
  const canvases = element.querySelectorAll("canvas");
  const cloneCanvases = clone.querySelectorAll("canvas");
  canvases.forEach((canvas, i) => {
    const img = document.createElement("img");
    img.src = canvas.toDataURL();
    img.width = canvas.width;
    img.height = canvas.height;
    cloneCanvases[i].replaceWith(img);
  });
  // Recursively force all descendants to safe background/text color
  function forceSafeColors(node) {
    if (node.nodeType === 1) {
      node.style.background = "#fff";
      node.style.backgroundColor = "#fff";
      node.style.color = "#222";
      Array.from(node.children).forEach(forceSafeColors);
    }
  }
  forceSafeColors(clone);
  return {
    clone,
    restore: () => {},
  };
}

export async function downloadReceiptAsPDF(
  elementId,
  fileName = "receipt.pdf"
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const { clone } = prepareForCapture(element);
  document.body.appendChild(clone);
  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: "#fff",
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    const pdfBlob = pdf.output("blob");
    const file = new File([pdfBlob], fileName, { type: "application/pdf" });
    // Try native share first
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Receipt PDF",
        text: "Here’s your receipt",
      });
    } else {
      // Fallback: open in new tab for mobile Safari / others
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, "_blank");
      URL.revokeObjectURL(blobUrl);
    }
  } finally {
    document.body.removeChild(clone);
  }
}

export async function downloadReceiptAsImage(
  elementId,
  fileName = "receipt.png"
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const { clone } = prepareForCapture(element);
  document.body.appendChild(clone);
  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: "#fff",
      useCORS: true,
    });
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve();
        const file = new File([blob], fileName, { type: "image/png" });
        // Try native share
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Receipt Image",
            text: "Here’s your receipt",
          });
        } else {
          // Fallback: open image in new tab
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, "_blank");
          URL.revokeObjectURL(blobUrl);
        }
        resolve();
      }, "image/png");
    });
  } finally {
    document.body.removeChild(clone);
  }
}
