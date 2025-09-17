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
 * This is called in the html2canvas onclone hook.
 */
function sanitizeOklchColors(root) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
  let node = walker.currentNode || root;
  while (node) {
    const computed = window.getComputedStyle(node);
    if (
      (computed.color && computed.color.includes("oklch")) ||
      (computed.background && computed.background.includes("oklch")) ||
      (computed.backgroundColor && computed.backgroundColor.includes("oklch"))
    ) {
      node.style.setProperty('color', '#222', 'important');
      node.style.setProperty('background', '#fff', 'important');
      node.style.setProperty('background-color', '#fff', 'important');
    }
    node = walker.nextNode();
  }
}

/**
 * Prepare a clone for html2canvas: replace QR canvases with <img>
 */
function prepareForCapture(element) {
  if (!element) return { clone: null, restore: () => {} };
  const clone = element.cloneNode(true);
  replaceQrCanvasesWithImages(element, clone);
  return {
    clone,
    restore: () => {},
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
  document.body.appendChild(clone);
  try {
    await new Promise((resolve) => {
      html2canvas(clone, {
        backgroundColor: "#fff",
        useCORS: true,
        onclone: (clonedDoc) => {
          const clonedRoot = clonedDoc.body.querySelector(`#${clone.id}`) || clonedDoc.body.firstElementChild;
          sanitizeOklchColors(clonedRoot);
        },
      }).then((canvas) => {
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
              // If share fails, fallback to download
            }
          }
          // Fallback: download using anchor click
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
    });
  } finally {
    restore();
    document.body.removeChild(clone);
  }
}

/**
 * Download receipt as PDF (uses jsPDF, html2canvas, and color sanitization)
 */
export async function downloadReceiptAsPDF(
  elementId,
  fileName = "receipt.pdf"
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const { clone } = prepareForCapture(element);
  document.body.appendChild(clone);
  try {
    await new Promise((resolve) => {
      html2canvas(clone, {
        backgroundColor: "#fff",
        useCORS: true,
        onclone: (clonedDoc) => {
          const clonedRoot = clonedDoc.body.querySelector(`#${clone.id}`) || clonedDoc.body.firstElementChild;
          sanitizeOklchColors(clonedRoot);
        },
      }).then(async (canvas) => {
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
          try {
            await navigator.share({
              files: [file],
              title: "Receipt PDF",
              text: "Here’s your receipt",
            });
            return resolve();
          } catch (err) {
            console.error("Share failed, falling back to download:", err);
            // If share fails, fallback to download
          }
        }
        // Fallback: download using anchor click
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
        resolve();
      });
    });
  } finally {
    document.body.removeChild(clone);
  }
}

/**
 * Download receipt as image (uses Web Share API if available, else downloads)
 */
export async function downloadReceiptAsImage(
  elementId,
  fileName = "receipt.png"
) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const { clone } = prepareForCapture(element);
  document.body.appendChild(clone);
  try {
    await new Promise((resolve) => {
      html2canvas(clone, {
        backgroundColor: "#fff",
        useCORS: true,
        onclone: (clonedDoc) => {
          const clonedRoot = clonedDoc.body.querySelector(`#${clone.id}`) || clonedDoc.body.firstElementChild;
          sanitizeOklchColors(clonedRoot);
        },
      }).then((canvas) => {
        canvas.toBlob(async (blob) => {
          if (!blob) return resolve();
          const file = new File([blob], fileName, { type: "image/png" });
          // Try native share
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: "Receipt Image",
                text: "Here’s your receipt",
              });
              return resolve();
            } catch (err) {
              console.error(err)
              // If share fails, fallback to download
            }
          }
          // Fallback: download using anchor click
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
    });
  } finally {
    document.body.removeChild(clone);
  }
}
