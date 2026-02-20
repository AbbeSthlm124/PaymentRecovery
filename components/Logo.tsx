export default function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="PaymentRecovery"
      width={240}
      height={50}
      className={`h-10 w-auto ${className}`}
    />
  );
}
