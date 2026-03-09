import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AuthInput({
  label,
  type,
  placeholder,
  icon,
  required,
  value,
  onChange
}: Props) {

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (

    <div className="space-y-1.5">

      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="flex items-center border border-slate-200 rounded-xl px-3 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">

        {/* LEFT ICON */}
        <div className="text-slate-400 mr-2">
          {icon}
        </div>

        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className="flex-1 outline-none text-sm"
        />

        {/* PASSWORD TOGGLE */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}

      </div>

    </div>

  );
}