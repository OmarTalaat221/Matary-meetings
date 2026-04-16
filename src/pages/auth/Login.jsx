import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, message } from "antd";
import { Loader2, Mail, Lock, Stethoscope } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getHomePath } from "../../routes/routes-data";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        message.success(`Welcome, ${result.user.full_name}!`);
        const homePath = getHomePath(result.role);
        navigate(homePath, { replace: true });
      } else {
        setErrors({ general: result.error || "Invalid email or password" });
        message.error(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Something went wrong. Please try again." });
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-dvh flex flex-col landscape:flex-row lg:flex-row bg-white">
      {/* Form Side */}
      <div
        className="
          flex-1 flex items-center justify-center bg-white
          p-4 py-8
          landscape:p-4 landscape:py-4
          lg:p-8
        "
      >
        <div
          className="
            w-full
            max-w-sm landscape:max-w-md lg:max-w-md
          "
        >
          {/* Header */}
          <div className="text-center mb-6 landscape:mb-4 lg:mb-8">
            <div className="landscape:hidden lg:hidden inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/20">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>

            <h1
              className="
                font-bold text-gray-900
                text-2xl landscape:text-2xl lg:text-3xl
                mb-2 landscape:mb-1 lg:mb-2
              "
            >
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm landscape:text-sm lg:text-base">
              Sign in to continue to Matary
            </p>
          </div>

          {/* Error Alert */}
          {errors.general && (
            <div
              className="
                bg-red-50 border border-red-100 text-red-600 rounded-xl
                p-3 mb-6 text-sm
                landscape:p-2 landscape:mb-3 landscape:text-xs
                lg:p-4 lg:mb-6 lg:text-sm
              "
            >
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 landscape:space-y-2 lg:space-y-5"
          >
            {/* Email Field */}
            <div>
              <label
                className="
                  block font-semibold text-gray-700
                  text-sm mb-1.5
                  landscape:text-xs landscape:mb-0.5
                  lg:text-sm lg:mb-2
                "
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 landscape:h-4 landscape:w-4 lg:h-5 lg:w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  disabled={loading}
                  autoComplete="email"
                  className={`
                    w-full border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all
                    pl-11 pr-4 py-3 text-sm
                    landscape:pl-10 landscape:py-2 landscape:text-xs
                    lg:pl-12 lg:py-3.5 lg:text-base
                    ${errors.email ? "border-red-400" : "border-gray-200"}
                    ${loading ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
                  `}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs landscape:text-[10px] lg:text-sm text-red-500 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                className="
                  block font-semibold text-gray-700
                  text-sm mb-1.5
                  landscape:text-xs landscape:mb-0.5
                  lg:text-sm lg:mb-2
                "
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 landscape:h-4 landscape:w-4 lg:h-5 lg:w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  className={`
                    w-full border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all
                    pl-11 pr-4 py-3 text-sm
                    landscape:pl-10 landscape:py-2 landscape:text-xs
                    lg:pl-12 lg:py-3.5 lg:text-base
                    ${errors.password ? "border-red-400" : "border-gray-200"}
                    ${loading ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
                  `}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs landscape:text-[10px] lg:text-sm text-red-500 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-1">
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
                className="text-xs landscape:text-[10px] lg:text-sm"
              >
                <span className="text-gray-600 font-medium">Remember me</span>
              </Checkbox>
              <Link
                to="/forgot-password"
                className="text-primary text-xs landscape:text-[10px] lg:text-sm hover:text-primary-dark transition-colors font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl 
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center gap-2 shadow-lg shadow-primary/25
                h-11 text-sm mt-6
                landscape:h-10 landscape:text-xs landscape:mt-2
                lg:h-14 lg:text-base lg:mt-8
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p
            className="
              text-center text-gray-400
              text-xs mt-8
              landscape:text-[10px] landscape:mt-4
              lg:text-sm lg:mt-10
            "
          >
            © 2026 Matary. All rights reserved.
          </p>
        </div>
      </div>

      {/* Branding Side */}
      <div
        className="
          bg-primary-dark text-white
          flex items-center justify-center
          relative overflow-hidden
          p-8 py-12
          landscape:flex-1 landscape:p-6
          lg:flex-1 lg:p-12
          isolation-isolate
        "
        style={{ transform: "translateZ(0)" }}
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-48 h-48 landscape:w-64 landscape:h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-[80px] lg:blur-[120px]"
            style={{ transform: "translate3d(0,0,0)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 landscape:w-80 landscape:h-80 lg:w-[480px] lg:h-[480px] bg-white/10 rounded-full blur-[80px] lg:blur-[120px]"
            style={{ transform: "translate3d(0,0,0)" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div
            className="
              mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl
              w-36 p-4
              landscape:w-44 landscape:p-5 landscape:rounded-3xl
              lg:w-64 lg:p-8 lg:rounded-[2rem]
            "
            style={{
              WebkitBackdropFilter: "blur(12px)",
              transform: "translateZ(0)",
            }}
          >
            <img
              src="https://res.cloudinary.com/dp7jfs375/image/upload/v1773481084/Matary_basic_media_20250220_213011_0000.cdaa37d3f760260f3bda29df14569fe8_eblvca.svg"
              className="w-full h-auto drop-shadow-2xl"
              alt="Matary Logo"
            />
          </div>

          <div className="mt-8 landscape:mt-6 lg:mt-12">
            <h2 className="text-2xl landscape:text-2xl lg:text-4xl font-extrabold mb-3 lg:mb-6 tracking-tight">
              Matary Platform
            </h2>
            <p className="text-base landscape:text-base lg:text-xl text-white/80 leading-relaxed max-w-md mx-auto font-medium">
              Your complete platform for managing meetings, schedules, and team
              collaboration
            </p>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Login;
