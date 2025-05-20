import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiMail, FiLock, FiArrowLeft } from "react-icons/fi";

export default function PartnerRegister() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    password: "", 
    category: "", 
    otp: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      await axios.post("http://localhost:8080/api/partners/register", form, { 
        withCredentials: true 
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      await axios.post("http://localhost:8080/api/partners/verify", {
        email: form.email,
        otp: form.otp,
      }, { withCredentials: true });

      navigate("/partner-login", { 
        state: { 
          message: "✅ Account verified successfully! Please login." 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || "OTP Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Join as a Partner</h2>
              <p className="opacity-90 mt-1 text-sm sm:text-base">
                {step === 1 ? "Create your partner account" : "Verify your email"}
              </p>
            </div>
            {step === 2 && (
              <button 
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
                aria-label="Go back"
              >
                <FiArrowLeft size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>
                            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Category
                </label>
                <select
                  id="category"
                  required
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Driver">Driver</option>
                  <option value="Beautician">Beautician</option>
                  <option value="AC Technician">AC Technician</option>
                  <option value="Cook">Cook</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Painter">Painter</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    required
                    pattern="[6-9]{1}[0-9]{9}"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength="6"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
                  isLoading ? 'opacity-75' : 'hover:bg-indigo-700'
                }`}
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
                  "Get Verification OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  We've sent a 6-digit OTP to <span className="font-semibold">{form.email}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Check your spam folder if you don't see it
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  placeholder="123456"
                  required
                  maxLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-center text-lg tracking-widest font-mono"
                  onChange={(e) => setForm({ ...form, otp: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
                  isLoading ? 'opacity-75' : 'hover:bg-green-700'
                }`}
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
                  "Verify Account"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {step === 1 ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/partner-login")}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    Login here
                  </button>
                </>
              ) : (
                <>
                  Didn't receive OTP?{" "}
                  <button
                    onClick={handleBack}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}