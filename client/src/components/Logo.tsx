export function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="SHVA"
      className={`h-10 w-auto select-none ${className}`}
      draggable={false}
    />
  );
}
