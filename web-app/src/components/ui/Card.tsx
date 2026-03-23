export default function Card({ children }: any) {
  return (
    <div
      className="
      bg-white
      border border-slate-200
      rounded-xl
      p-6
      shadow-sm
      hover:shadow-md
      transition
      "
    >
      {children}
    </div>
  );
}