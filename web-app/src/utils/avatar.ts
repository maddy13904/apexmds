export function generateAvatar(name: string) {
  const seed = name || "student";
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}