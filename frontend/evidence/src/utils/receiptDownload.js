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
  // Clone node
  const clone = element.cloneNode(true);
  // Replace QR code canvas with PNG image in the clone
  const canvases = element.querySelectorAll("canvas");
  const cloneCanvases = clone.querySelectorAll("canvas");
  console.log(
    "[receiptDownload] Canvases found:",
    Array.from(canvases).map((c) => ({
      width: c.width,
      height: c.height,
      outerHTML: c.outerHTML.slice(0, 100),
    }))
  );
  canvases.forEach((canvas, i) => {
    const img = document.createElement("img");
    img.src = canvas.toDataURL();
    img.width = canvas.width;
    img.height = canvas.height;
    cloneCanvases[i].replaceWith(img);
    console.log(
      `[receiptDownload] Canvas at index ${i} replaced with image (${canvas.width}x${canvas.height}).`
    );
  });
  // Save original style
  const original = {
    background: clone.style.background,
    backgroundColor: clone.style.backgroundColor,
    color: clone.style.color,
  };
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
    restore: () => {
      clone.style.background = original.background;
      clone.style.backgroundColor = original.backgroundColor;
      clone.style.color = original.color;
    },
  };
}

export async function downloadReceiptAsPDF(
  elementId,
  fileName = "receipt.pdf"
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
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(fileName);
  } finally {
    restore();
    document.body.removeChild(clone);
  }
}

export async function downloadReceiptAsImage(
  elementId,
  fileName = "receipt.png"
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
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    restore();
    document.body.removeChild(clone);
  }
}
