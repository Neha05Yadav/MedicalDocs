import { MediDocMark } from "./MediDocMark";
import { MediDocWordmark } from "./MediDocWordmark";

type MediDocBrandProps = {
  className?: string;
  onDark?: boolean;
  compact?: boolean;
};

export function MediDocBrand({ className = "", onDark = true, compact = false }: MediDocBrandProps) {
  return (
    <span className={`inline-flex items-center ${compact ? "gap-2.5" : "gap-3.5"} ${className}`}>
      <MediDocMark className={compact ? "h-10 w-11" : "h-14 w-[3.9rem]"} title="MediDoc" />
      <span>
        <MediDocWordmark
          onDark={onDark}
          className={`${compact ? "text-xl" : "text-[1.8rem]"} font-extrabold leading-none tracking-[-0.055em]`}
        />
      </span>
    </span>
  );
}
