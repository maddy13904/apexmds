export default function Input(props: any) {
  return (
    <input
      {...props}
      className="
      w-full
      border border-slate-300
      rounded-md
      px-3 py-2
      text-sm
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      "
    />
  );
}