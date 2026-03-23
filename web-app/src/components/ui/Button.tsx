export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button"
}: any) {

  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition";

  const variants: any = {

    primary:
      "bg-blue-700 text-white hover:bg-slate-800",

    secondary:
      "border border-slate-300 text-slate-700 hover:bg-slate-100",

    danger:
      "bg-red-600 text-white hover:bg-red-700"

  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}