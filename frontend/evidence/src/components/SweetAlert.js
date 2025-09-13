// src/components/SweetAlert.js
import Swal from "sweetalert2";

export function showSuccess(message) {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonColor: "#2563eb",
  });
}

export function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#dc2626",
  });
}

export function showInfo(message) {
  Swal.fire({
    icon: "info",
    title: "Info",
    text: message,
    confirmButtonColor: "#2563eb",
  });
}
