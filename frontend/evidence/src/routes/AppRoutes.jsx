// src/routes/AppRoutes.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";
import LoginForm from "../components/LoginForm";
import Dashboard from "../components/Dashboard";
import ReceiptForm from "../components/ReceiptForm";
import ReceiptDisplay from "../components/ReceiptDisplay";
import RecentReceipts from "../components/RecentReceipts";
import RevenueChart from "../components/RevenueChart";
import ProtectedRoute from "../components/ProtectedRoute";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getReceipt } from "../api/receipts";
import MainLayout from "../components/MainLayout";
import Menu from "../components/Menu";
import Scan from "../components/Scan";
import Notes from "../components/Notes";
import ExpenseTracker from "../components/ExpenseTracker";
import Calculator from "../components/Calculator";
import Profile from "../components/Profile";
import Inventory from "../components/Inventory";

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
      <div className="text-center mt-10 text-blue-600">Loading receipt...</div>
    );
  return <ReceiptDisplay receipt={receipt} />;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-receipt"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ReceiptForm />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipts"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RecentReceipts />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipt/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ReceiptDisplayPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/revenue-chart"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RevenueChart />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Menu />
              </MainLayout>
            </ProtectedRoute>
          }
          />
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Scan />
              </MainLayout>
            </ProtectedRoute>
          }
          />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Notes />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Inventory />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expense-tracker"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExpenseTracker />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calculator"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Calculator />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}
