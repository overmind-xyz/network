export function Currency({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {amount < 100 ? `${amount}¢` : `$${(amount / 100).toLocaleString()}`}
    </span>
  );
}
