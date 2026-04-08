// src/pages/auth/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import { Rocket, Users, Video, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { signup } = useAuth();
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
    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }
    if (!agreeTerms) {
      newErrors.terms = "يجب الموافقة على الشروط والأحكام";
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
      const result = signup(formData);
      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({ general: "فشل إنشاء الحساب. حاول مرة أخرى." });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: "+10K", label: "مستخدم", icon: Users },
    { value: "+50K", label: "اجتماع", icon: Video },
    { value: "99%", label: "وقت التشغيل", icon: Shield },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-light to-primary items-center justify-center p-12">
        <div className="text-center text-white max-w-lg">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Rocket className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-4">انضم إلى Matary</h2>
          <p className="text-xl text-white/80 leading-relaxed">
            ابدأ بتنظيم اجتماعاتك بكفاءة وتعاون مع فريقك بسلاسة
          </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              إنشاء حساب جديد
            </h1>
            <p className="text-gray-600">ابدأ مع حسابك المجاني</p>
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
              label="الاسم الكامل"
              type="text"
              name="name"
              placeholder="أدخل اسمك"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon="user"
            />

            <Input
              label="البريد الإلكتروني"
              type="email"
              name="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon="email"
            />

            <Input
              label="كلمة المرور"
              type="password"
              name="password"
              placeholder="أنشئ كلمة مرور"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon="password"
            />

            <Input
              label="تأكيد كلمة المرور"
              type="password"
              name="confirmPassword"
              placeholder="أعد إدخال كلمة المرور"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon="password"
            />

            {/* Terms Checkbox */}
            <div className="mb-6">
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: "" }));
                  }
                }}
              >
                <span className="text-gray-600 text-sm">
                  أوافق على{" "}
                  <Link
                    to="/terms"
                    className="text-primary hover:underline font-medium"
                  >
                    شروط الخدمة
                  </Link>{" "}
                  و{" "}
                  <Link
                    to="/privacy"
                    className="text-primary hover:underline font-medium"
                  >
                    سياسة الخصوصية
                  </Link>
                </span>
              </Checkbox>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1.5">{errors.terms}</p>
              )}
            </div>

            <Button type="submit" loading={loading} fullWidth>
              إنشاء حساب
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-8 text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
