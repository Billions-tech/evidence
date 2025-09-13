// src/components/WelcomeAlert.jsx
import Swal from "sweetalert2";
import { useEffect } from "react";

export default function WelcomeAlert() {
  useEffect(() => {
    Swal.fire({
      title: "Welcome!",
      text: "Welcome to the Receipt Generator & Sales Tracker!",
      icon: "info",
      confirmButtonText: "Continue",
    });
  }, []);
  return null;
}
