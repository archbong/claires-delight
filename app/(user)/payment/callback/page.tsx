"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cartStore";

// Custom SVG Icons
const CheckCircleIcon = () => (
  <svg
    className="w-12 h-12 text-green-600"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const XCircleIcon = () => (
  <svg
    className="w-12 h-12 text-red-600"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const LoaderIcon = () => (
  <svg
    className="w-4 h-4 animate-spin text-gray-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const status = searchParams.get("status");
    const transactionId = searchParams.get("transaction_id");
    const reference = searchParams.get("reference");

    // Log for debugging/analytics
    console.log("Payment callback received:", { status, transactionId, reference });

    const redirectTimer = setTimeout(() => {
      if (status === "successful") {
        clearCart();

  // allow state to flush
        setTimeout(() => {
            router.push("/shop-spices");
        }, 50);
      } else {
        router.replace("/payment-failed");
      }
    }, 2500);

    // Countdown for better UX
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [router, searchParams]);

  const status = searchParams.get("status");
  const isSuccess = status === "successful";
  const errorMessage = searchParams.get("error") || searchParams.get("message");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Status Banner */}
        <div className={`p-6 text-center ${
          isSuccess ? "bg-green-50" : "bg-red-50"
        }`}>
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircleIcon />
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircleIcon />
              </div>
            )}
          </div>
          
          <h1 className={`text-2xl font-bold mb-2 ${
            isSuccess ? "text-green-900" : "text-red-900"
          }`}>
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h1>
          
          <p className={`text-sm ${
            isSuccess ? "text-green-700" : "text-red-700"
          }`}>
            {isSuccess 
              ? "Your transaction has been processed successfully" 
              : errorMessage || "There was an issue processing your payment"}
          </p>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-4">
          {isSuccess && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Transaction Details
              </h3>
              {searchParams.get("transaction_id") && (
                <div className="text-sm text-gray-600 break-all">
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {searchParams.get("transaction_id")}
                </div>
              )}
              {searchParams.get("amount") && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Amount:</span>{" "}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: searchParams.get("currency") || 'USD'
                  }).format(Number(searchParams.get("amount")))}
                </div>
              )}
            </div>
          )}

          {/* Loading/Redirect Status */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <LoaderIcon />
              <span className="text-sm">
                Redirecting you in {countdown} second{countdown !== 1 ? "s" : ""}...
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  isSuccess ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              />
            </div>

            <button
              onClick={() => router.replace(isSuccess ? "/shop-spices" : "/payment-failed")}
              className="text-sm text-blue-600 hover:text-blue-700 underline transition-colors"
            >
              Click here if not redirected automatically
            </button>
          </div>

          {/* Help Section */}
          {!isSuccess && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Need help?{" "}
                <a href="/support" className="text-blue-600 hover:underline">
                  Contact Support
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}