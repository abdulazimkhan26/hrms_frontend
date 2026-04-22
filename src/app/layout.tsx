import type { Metadata } from "next";
import {Toaster} from "sonner";
import "./globals.css";
import AuthProvider from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "iK4HRMS",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
         <Toaster position="top-right" richColors /> 
         <AuthProvider> {/* ← richColors makes success green, error red */}
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}