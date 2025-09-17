import jsPDF from "jspdf";
import { toPng } from "html-to-image";

/**
 * Share receipt as image (uses Web Share API if available, else downloads)
 */
export async function shareReceiptAsImage(
  elementId,
  fileName = "receipt.png",
  shareTitle = "Receipt Image",
  shareText = "Receipt"
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const { clone } = prepareForCapture(element);
  try {
    const dataUrl = await toPng(clone, {
      cacheBust: true,
      backgroundColor: "#fff",
    });
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], fileName, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: shareText,
        });
        return;
      } catch (err) {
        console.error("Share failed, falling back to download:", err);
      }
    }
    // Fallback: download
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Download receipt as PDF (with share fallback)
 */
export async function downloadReceiptAsPDF(
  elementId,
  fileName = "receipt.pdf"
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const { clone } = prepareForCapture(element);
  try {
    const dataUrl = await toPng(clone, {
      cacheBust: true,
      backgroundColor: "#fff",
    });
    const img = new window.Image();
    img.src = dataUrl;
    img.onload = function () {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [img.width, img.height],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
      pdf.save(fileName);
    };
    img.onerror = function (err) {
      console.error(err);
    };
  } catch (err) {
    console.error(err);
  }
}

/**
 * Download receipt as image (with share fallback)
 */
export async function downloadReceiptAsImage(
  elementId,
  fileName = "receipt.png"
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const { clone } = prepareForCapture(element);
  try {
    const dataUrl = await toPng(clone, {
      cacheBust: true,
      backgroundColor: "#fff",
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Prepare a hidden clone for html2canvas
 */
function prepareForCapture(element) {
  return { clone: element, restore: () => {} };
}
