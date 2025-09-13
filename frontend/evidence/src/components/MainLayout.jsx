// src/components/MainLayout.jsx
import FooterNav from "./FooterNav";
import Header from "./Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <Header />
      {/* Outline/Main Content */}
      <main className="flex-1 pb-20 px-2 md:px-0">
        {children}
      </main>
      {/* Footer Navigation */}
      <FooterNav />
    </div>
  );
}
