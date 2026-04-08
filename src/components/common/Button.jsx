import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  size = "md",
  loading = false,
  fullWidth = false,
  className = "",
  onClick,
  ...props
}) => {
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    accent: "bg-accent hover:bg-red-600 text-white",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent",
    ghost: "text-primary hover:bg-primary/10 bg-transparent",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  const sizes = {
    sm: "py-1.5 px-3 text-xs landscape:py-1 landscape:px-2 landscape:text-[10px] lg:py-2 lg:px-4 lg:text-sm",
    md: "py-2 px-4 text-sm landscape:py-1.5 landscape:px-3 landscape:text-xs lg:py-3 lg:px-6 lg:text-base",
    lg: "py-2.5 px-5 text-base landscape:py-2 landscape:px-4 landscape:text-sm lg:py-4 lg:px-8 lg:text-lg",
  };

  const handleClick = (e) => {
    if (loading || props.disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      onClick={handleClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-semibold rounded-lg
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        inline-flex items-center justify-center gap-2
        cursor-pointer
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2
          className="
            animate-spin
            w-4 h-4 landscape:w-3 landscape:h-3 lg:w-5 lg:h-5
          "
        />
      )}
      {children}
    </button>
  );
};

export default Button;
