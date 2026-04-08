// src/components/common/Input.jsx
import { Input as AntInput } from "antd";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const iconMap = {
  email: <Mail className="w-5 h-5 text-gray-400" />,
  mail: <Mail className="w-5 h-5 text-gray-400" />,
  password: <Lock className="w-5 h-5 text-gray-400" />,
  lock: <Lock className="w-5 h-5 text-gray-400" />,
  user: <User className="w-5 h-5 text-gray-400" />,
  name: <User className="w-5 h-5 text-gray-400" />,
};

const Input = ({
  label,
  type = "text",
  error,
  icon,
  className = "",
  ...props
}) => {
  const prefixIcon = icon ? iconMap[icon] || null : null;

  const inputProps = {
    status: error ? "error" : undefined,
    prefix: prefixIcon,
    size: "large",
    className,
    ...props,
  };

  return (
    <div className="mb-5">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
      )}

      {type === "password" ? (
        <AntInput.Password
          {...inputProps}
          iconRender={(visible) =>
            visible ? (
              <Eye className="w-5 h-5 text-primary cursor-pointer" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400 cursor-pointer" />
            )
          }
        />
      ) : (
        <AntInput type={type} {...inputProps} />
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
