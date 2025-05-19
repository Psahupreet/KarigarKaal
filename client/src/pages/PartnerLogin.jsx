import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PartnerLogin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      await axios.post("http://82.29.165.206:7001/api/partners/send-login-otp", { email }, { withCredentials: true });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      const res = await axios.post(
        "http://82.29.165.206:7001/api/partners/verify-login-otp",
        { email, otp },
        { withCredentials: true }
      );

      const { token, partner } = res.data;
      localStorage.setItem("partnerToken", token);

      if (partner.isApproved) {
  navigate("/partner-dashboard");
} else {
  setError("Your account is pending approval. We'll notify you once approved.");
}
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 sm:p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold">Partner Login</h2>
          <p className="opacity-90 mt-1 text-sm sm:text-base">
            {step === 1 ? "Enter your email to continue" : "Verify with OTP"}
          </p>
        </div>

        {/* Form Content */}
        <div className="p-5 sm:p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm sm:text-base"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md sm:rounded-lg transition duration-200 flex items-center justify-center text-sm sm:text-base ${isLoading ? 'opacity-75' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
{step === 2 && (
  <form onSubmit={verifyOtp} className="space-y-4">
    <div className="text-center mb-3 sm:mb-4">
      <p className="text-gray-600 text-sm sm:text-base">
        OTP sent to <span className="font-semibold">{email}</span>
      </p>
    </div>

    <div>
      <label htmlFor="otp" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
        Enter 6-digit OTP
      </label>
      <input
        id="otp"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="••••••"
        required
        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-center text-lg tracking-widest"
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          setOtp(value.slice(0, 6));
        }}
        value={otp}
        maxLength="6"
      />
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md sm:rounded-lg transition duration-200 flex items-center justify-center text-sm sm:text-base ${isLoading ? 'opacity-75' : ''}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying...
        </>
      ) : (
        "Login"
      )}
    </button>

    {/* ✅ Instructional Message */}
    <p className="text-gray-600 text-sm text-center mt-3">
      <span className="font-medium text-indigo-600">Note:</span> After login, please go to the{" "}
      <span className="font-semibold">Documents</span> page and upload your documents. 
      Once uploaded, we will verify them and contact you shortly.
    </p>

    <button
      type="button"
      onClick={() => {
        setStep(1);
        setError("");
      }}
      className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium transition mt-2"
    >
      ← Back to email entry
    </button>
  </form>
)}


          {/* Footer Links */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/partner-register")}
                className="text-indigo-600 hover:text-indigo-800 font-medium transition"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}