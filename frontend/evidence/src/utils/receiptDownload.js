import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import axios from "axios";

function prepareForExport(element) {
  // Temporarily override styles for clean export
  const original = {
    margin: element.style.margin,
    display: element.style.display,
    maxWidth: element.style.maxWidth,
  };
  element.style.margin = "0";
  element.style.display = "inline-block";
  element.style.maxWidth = "unset";
  return () => {
    element.style.margin = original.margin;
    element.style.display = original.display;
    element.style.maxWidth = original.maxWidth;
  };
}

// Replace QR code canvas with image for reliable capture
function replaceQrCanvasWithImage(element) {
  const canvases = element.querySelectorAll("canvas");
  canvases.forEach((canvas) => {
    // Only replace if it's a QR code (by size or class)
    if (canvas.width >= 80 && canvas.height >= 80) {
      const img = document.createElement("img");
      img.src = canvas.toDataURL();
      img.width = canvas.width;
      img.height = canvas.height;
      img.style.display = canvas.style.display;
      canvas.parentNode.replaceChild(img, canvas);
    }
  });
}

// Wait for all images and fonts in the element to load, and replace QR canvas
async function waitForResources(element) {
  replaceQrCanvasWithImage(element);
  // Wait for images
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map((img) =>
      img.complete && img.naturalHeight !== 0
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          })
    )
  );
  // Wait for fonts
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
}

/**
 * Share receipt as image (uses Web Share API if available, else downloads)
 */
export async function shareReceiptAsImage(
  elementId,
  fileName = "receipt.png",
  shareTitle = "Receipt Image",
  shareText = "Receipt",
  userId = null // Pass userId if available
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  await waitForResources(element);
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor: "#fff",
      width: element.offsetWidth,
      height: element.offsetHeight,
      style: {
        margin: "0",
        display: "inline-block",
        maxWidth: "unset",
      },
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
        // Log share activity
        if (userId) {
          axios.post("/api/activity", {
            userId,
            action: "share",
            details: fileName,
          });
        }
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
    // Log share activity (fallback)
    if (userId) {
      axios.post("/api/activity", {
        userId,
        action: "share",
        details: fileName,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * Download receipt as PDF (with share fallback)
 */
export async function downloadReceiptAsPDF(
  elementId,
  fileName = "receipt.pdf",
  userId = null // Pass userId if available
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  await waitForResources(element);
  const restore = prepareForExport(element);
  try {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor: "#fff",
      width,
      height,
      style: {
        margin: "0",
        display: "inline-block",
        maxWidth: "unset",
      },
    });
    const img = new window.Image();
    img.src = dataUrl;
    img.onload = function () {
      if (!img.width || !img.height) {
        alert(
          "Receipt image could not be captured. Please make sure the receipt is visible."
        );
        return;
      }
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [img.width, img.height],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
      pdf.save(fileName);
      // Log download activity
      if (userId) {
        axios.post("/api/activity", {
          userId,
          action: "download",
          details: fileName,
        });
      }
    };
    img.onerror = function (err) {
      alert("Error loading receipt image for PDF export.");
      console.error(err);
    };
  } catch (err) {
    alert("Error generating receipt PDF: " + (err?.message || err));
    console.error(err);
  } finally {
    restore();
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
  await waitForResources(element);
  const restore = prepareForExport(element);
  try {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor: "#fff",
      width,
      height,
      style: {
        margin: "0",
        display: "inline-block",
        maxWidth: "unset",
      },
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
  } finally {
    restore();
  }
}
