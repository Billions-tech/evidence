import { useState, useEffect, useParams, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getReceipt } from "../api/receipts";
import ReceiptDisplay from "./ReceiptDisplay";

function ReceiptDisplayPage() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReceipt() {
      try {
        const res = await getReceipt(id, token);
        setReceipt(res.data);
      } catch {
        setReceipt(null);
      } finally {
        setLoading(false);
      }
    }
    fetchReceipt();
  }, [id, token]);

  if (loading)
    return (
      <div className="text-center mt-10 p-2 text-blue-600">Loading receipt...</div>
    );
  return <ReceiptDisplay receipt={receipt} />;
}

export default ReceiptDisplayPage;
