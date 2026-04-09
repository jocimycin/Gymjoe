interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-display font-bold uppercase tracking-widest text-[#6b6b6b]">
        {label}
      </label>
      <input
        className={`bg-[#141414] border ${error ? "border-[#f06060]" : "border-[#2a2a2a]"} rounded-xl px-4 py-3 text-[#f0ede8] text-sm placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#c8f060] transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#f06060]">{error}</p>}
    </div>
  );
}
