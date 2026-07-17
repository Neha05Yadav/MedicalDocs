type MediDocWordmarkProps = {
  className?: string;
  onDark?: boolean;
};

export function MediDocWordmark({ className, onDark = true }: MediDocWordmarkProps) {
  return (
    <span className={className} aria-label="MediDoc">
      <span aria-hidden="true" className={onDark ? "text-slate-50" : "text-slate-900"}>
        Medi
      </span>
      <span
        aria-hidden="true"
        className="bg-gradient-to-r from-[#159da6] to-[#23b7bd] bg-clip-text text-transparent"
      >
        Doc
      </span>
    </span>
  );
}
