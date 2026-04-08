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
    <div className="min-h-screen flex flex-col landscape:flex-row lg:flex-row">
      {/* Form Side */}
      <div
        className="
          flex-1 flex items-center justify-center bg-white
          p-4 py-6
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
          <div className="text-center mb-4 landscape:mb-4 lg:mb-8">
            <div className="landscape:hidden lg:hidden inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-3">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>

            <h1
              className="
                font-bold text-gray-800
                text-xl landscape:text-2xl lg:text-3xl
                mb-1 landscape:mb-1 lg:mb-2
              "
            >
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm landscape:text-sm lg:text-base">
              Sign in to continue to Matary
            </p>
          </div>

          {/* Error Alert */}
          {errors.general && (
            <div
              className="
                bg-red-50 border border-red-200 text-red-600 rounded-lg
                p-3 mb-4 text-sm
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
            className="space-y-3 landscape:space-y-2 lg:space-y-4"
          >
            {/* Email Field */}
            <div>
              <label
                className="
                  block font-medium text-gray-700
                  text-sm mb-1.5
                  landscape:text-xs landscape:mb-1
                  lg:text-sm lg:mb-2
                "
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 landscape:h-3.5 landscape:w-3.5 lg:h-5 lg:w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  autoComplete="email"
                  className={`
                    w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors
                    pl-9 pr-4 py-2.5 text-sm
                    landscape:pl-8 landscape:py-2 landscape:text-xs
                    lg:pl-10 lg:py-3 lg:text-base
                    ${errors.email ? "border-red-500" : "border-gray-300"}
                    ${loading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
                  `}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs landscape:text-[10px] lg:text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                className="
                  block font-medium text-gray-700
                  text-sm mb-1.5
                  landscape:text-xs landscape:mb-1
                  lg:text-sm lg:mb-2
                "
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 landscape:h-3.5 landscape:w-3.5 lg:h-5 lg:w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                  className={`
                    w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors
                    pl-9 pr-4 py-2.5 text-sm
                    landscape:pl-8 landscape:py-2 landscape:text-xs
                    lg:pl-10 lg:py-3 lg:text-base
                    ${errors.password ? "border-red-500" : "border-gray-300"}
                    ${loading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
                  `}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs landscape:text-[10px] lg:text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
                className="text-xs landscape:text-[10px] lg:text-sm"
              >
                <span className="text-gray-600 text-xs landscape:text-[10px] lg:text-sm">
                  Remember me
                </span>
              </Checkbox>
              <Link
                to="/forgot-password"
                className="text-primary text-xs landscape:text-[10px] lg:text-sm hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-primary hover:bg-primary-dark text-white font-medium rounded-lg 
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center gap-2
                h-10 text-sm mt-4
                landscape:h-9 landscape:text-xs landscape:mt-2
                lg:h-12 lg:text-base lg:mt-6
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 landscape:w-3.5 landscape:h-3.5 lg:w-5 lg:h-5 animate-spin" />
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
              text-center text-gray-500
              text-xs mt-4
              landscape:text-[10px] landscape:mt-3
              lg:text-sm lg:mt-6
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
          p-4 
          landscape:flex-1 landscape:p-6
          lg:flex-1 lg:p-12
        "
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 landscape:w-48 landscape:h-48 lg:w-72 lg:h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 landscape:w-56 landscape:h-56 lg:w-96 lg:h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div
            className="
              mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl
              w-32 p-3
              landscape:w-40 landscape:p-4 landscape:rounded-3xl
              lg:w-56 lg:p-6 lg:rounded-3xl
            "
          >
            <img
              src="https://res.cloudinary.com/dp7jfs375/image/upload/v1773481084/Matary_basic_media_20250220_213011_0000.cdaa37d3f760260f3bda29df14569fe8_eblvca.svg"
              className="w-full h-auto"
              alt="Matary Logo"
            />
          </div>

          <div className="hidden landscape:block lg:block mt-4 landscape:mt-6 lg:mt-8">
            <h2 className="text-lg landscape:text-xl lg:text-2xl font-bold mb-2 lg:mb-4">
              Matary Platform
            </h2>
            <p className="text-sm landscape:text-base lg:text-lg text-white/80 leading-relaxed max-w-md">
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
