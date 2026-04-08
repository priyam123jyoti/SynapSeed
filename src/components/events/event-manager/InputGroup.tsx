interface InputGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  textarea?: boolean;
  rows?: number;
  maxLength?: number;
}

export function InputGroup({ label, value, onChange, placeholder, textarea, rows = 3, maxLength }: InputGroupProps) {
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        {/* Counter logic - only displays if maxLength is provided */}
        {maxLength && (
          <span className={`text-[9px] font-bold ${value.length >= maxLength ? 'text-red-500' : 'text-slate-400'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {textarea ? (
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))} 
          rows={rows} 
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
          placeholder={placeholder} 
        />
      ) : (
        <input 
          value={value} 
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))} 
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}