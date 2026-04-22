"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);  // ← step 1: email, step 2: otp + new pw
  const [form, setForm] = useState({ token: "", newPassword: "", confirmPassword: "" });

  const handleEmailSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.msg);
        setStep(2);  // ← move to step 2
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: form.token,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.msg);
        router.push("/dashboard/home");  // ← go back to login
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">

        {/* Step 1 - Email */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
            <p className="text-center text-gray-500 text-sm mb-4">
              Enter your email and we'll send you a reset OTP
            </p>
            <form className="space-y-4" onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </form>
          </>
        )}

        {/* Step 2 - OTP + New Password */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
            <p className="text-center text-gray-500 text-sm mb-4">
              Enter the OTP sent to {email}
            </p>
            <form className="space-y-4" onSubmit={handleResetSubmit}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={form.token}
                onChange={(e) => setForm({ ...form, token: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              {/* Back button */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-500 text-sm hover:underline"
              >
                Back
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}