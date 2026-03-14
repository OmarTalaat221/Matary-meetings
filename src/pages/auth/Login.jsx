import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { getHomePath } from "../../routes/routes-data";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = login(formData);

      if (result.success) {
        // Navigate to home based on role
        const homePath = getHomePath(result.role);
        navigate(homePath);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue to Matary</p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-2">
              Demo Credentials:
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Admin:</strong> admin@matary.com
              </p>
              <p>
                <strong>Doctor:</strong> doctor@hospital.com
              </p>
              <p>
                <strong>Password:</strong> any 6+ characters
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon="password"
            />

            <div className="flex items-center justify-between mb-6">
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="text-gray-600"
              >
                Remember me
              </Checkbox>
              <Link
                to="/forgot-password"
                className="text-primary text-sm hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} fullWidth>
              Sign In
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-primary-dark items-center justify-center p-12 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="text-center text-white max-w-lg relative z-10">
          <div className="w-64 mx-auto mb-8 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
            <img
              src="https://res.cloudinary.com/dp7jfs375/image/upload/v1773481084/Matary_basic_media_20250220_213011_0000.cdaa37d3f760260f3bda29df14569fe8_eblvca.svg"
              className="w-full h-auto"
              alt="Matary Logo"
            />
          </div>

          <h2 className="text-2xl font-bold mb-4">Matary Platform</h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Your complete platform for managing meetings, schedules, and team
            collaboration
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
