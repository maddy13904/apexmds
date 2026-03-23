interface AvatarProps {
  name?: string;
  size?: number;
}

export default function Avatar({ name = "Student", size = 40 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold"
    >
      {initials}
    </div>
  );
}