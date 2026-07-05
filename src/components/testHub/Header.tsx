'use client';

interface HeaderProps {
  email: string;
}

export default function Header({ email }: HeaderProps) {
  return (
    <div className="max-w-4xl mx-auto text-center mb-12">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="w-6 h-px bg-emerald-800" />

        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-emerald-800">
          Secure Examination Space
        </span>

        <div className="w-6 h-px bg-emerald-800" />
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-[#1a3c34] tracking-tight mb-4">
        Academic Assessment Core
      </h1>

      <p className="text-sm text-stone-600">
        Welcome to the Departmental Evaluation Portal.
      </p>

      <p className="mt-2 text-sm font-semibold text-emerald-700">
        {email}
      </p>
    </div>
  );
}