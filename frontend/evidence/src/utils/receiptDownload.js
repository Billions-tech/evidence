import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Replace all QR code canvases in the clone with <img> elements.
 */
function replaceQrCanvasesWithImages(element, clone) {
  const canvases = element.querySelectorAll("canvas");
  const cloneCanvases = clone.querySelectorAll("canvas");
  canvases.forEach((canvas, i) => {
    const img = document.createElement("img");
    img.src = canvas.toDataURL();
    img.width = canvas.width;
    img.height = canvas.height;
    cloneCanvases[i].replaceWith(img);
  });
}

/**
 * Sanitize oklch colors in computed styles for all elements in the DOM.
 */
function sanitizeOklchColors(root) {
  if (!root) return;
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );
  let node = walker.currentNode || root;
  while (node) {
    const computed = window.getComputedStyle(node);
    if (
      (computed.color && computed.color.includes("oklch")) ||
      (computed.background && computed.background.includes("oklch")) ||
      (computed.backgroundColor && computed.backgroundColor.includes("oklch"))
    ) {
      node.style.setProperty("color", "#222", "important");
      node.style.setProperty("background", "#fff", "important");
      node.style.setProperty("background-color", "#fff", "important");
    }
    node = walker.nextNode();
  }
}

/**
 * Prepare a hidden clone for html2canvas
 */
function prepareForCapture(element) {
  if (!element) return { clone: null, restore: () => {} };

  const clone = element.cloneNode(true);
  replaceQrCanvasesWithImages(element, clone);

  // Make it invisible but renderable
  clone.style.position = "fixed";
  clone.style.top = "-9999px";
  clone.style.left = "-9999px";
  clone.style.opacity = "0";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "-1";

  document.body.appendChild(clone);

  return {
    clone,
    restore: () => {
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    },
  };
}

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
  const { clone, restore } = prepareForCapture(element);
  if (!clone) return;

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: "#fff",
      useCORS: true,
      onclone: (clonedDoc) => {
        const clonedRoot =
          clonedDoc.body.querySelector(`#${clone.id}`) ||
          clonedDoc.body.firstElementChild;
        sanitizeOklchColors(clonedRoot);
      },
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
        resolve();
      }, "image/png");
    });
  } finally {
    restore();
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
  const { clone, restore } = prepareForCapture(element);

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: "#fff",
      useCORS: true,
      onclone: (clonedDoc) => {
        const clonedRoot =
          clonedDoc.body.querySelector(`#${clone.id}`) ||
          clonedDoc.body.firstElementChild;
        sanitizeOklchColors(clonedRoot);
      },
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

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Receipt PDF",
          text: "Here’s your receipt",
        });
        return;
      } catch (err) {
        console.error("Share failed, falling back to download:", err);
      }
    }

    // Fallback: download
    const blobUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 100);
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
  const { clone, restore } = prepareForCapture(element);

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: "#fff",
      useCORS: true,
      onclone: (clonedDoc) => {
        const clonedRoot =
          clonedDoc.body.querySelector(`#${clone.id}`) ||
          clonedDoc.body.firstElementChild;
        sanitizeOklchColors(clonedRoot);
      },
    });

    await new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve();
        const file = new File([blob], fileName, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Receipt Image",
              text: "Here’s your receipt",
            });
            return resolve();
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
        resolve();
      }, "image/png");
    });
  } finally {
    restore();
  }
}
