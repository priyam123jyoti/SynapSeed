"use client";

import React, { useState, useEffect } from 'react';

const COUNTRIES = [
  { name: "Afghanistan", code: "+93", iso: "AF", length: 9, startsWith: [7] },
  { name: "Albania", code: "+355", iso: "AL", length: 9, startsWith: [6] },
  { name: "Algeria", code: "+213", iso: "DZ", length: 9, startsWith: [5, 6, 7] },
  { name: "Andorra", code: "+376", iso: "AD", length: 6, startsWith: [] },
  { name: "Angola", code: "+244", iso: "AO", length: 9, startsWith: [9] },
  { name: "Argentina", code: "+54", iso: "AR", length: 10, startsWith: [9] },
  { name: "Armenia", code: "+374", iso: "AM", length: 8, startsWith: [] },
  { name: "Australia", code: "+61", iso: "AU", length: 9, startsWith: [4] },
  { name: "Austria", code: "+43", iso: "AT", length: 10, startsWith: [6] },
  { name: "Azerbaijan", code: "+994", iso: "AZ", length: 9, startsWith: [5, 7] },
  { name: "Bahamas", code: "+1", iso: "BS", length: 10, startsWith: [] },
  { name: "Bahrain", code: "+973", iso: "BH", length: 8, startsWith: [3] },
  { name: "Bangladesh", code: "+880", iso: "BD", length: 10, startsWith: [1] },
  { name: "Barbados", code: "+1", iso: "BB", length: 10, startsWith: [] },
  { name: "Belarus", code: "+375", iso: "BY", length: 9, startsWith: [2, 3, 4] },
  { name: "Belgium", code: "+32", iso: "BE", length: 9, startsWith: [4] },
  { name: "Belize", code: "+501", iso: "BZ", length: 7, startsWith: [6] },
  { name: "Benin", code: "+229", iso: "BJ", length: 8, startsWith: [] },
  { name: "Bhutan", code: "+975", iso: "BT", length: 8, startsWith: [1, 7] },
  { name: "Bolivia", code: "+591", iso: "BO", length: 8, startsWith: [6, 7] },
  { name: "Bosnia and Herzegovina", code: "+387", iso: "BA", length: 8, startsWith: [6] },
  { name: "Botswana", code: "+267", iso: "BW", length: 8, startsWith: [7] },
  { name: "Brazil", code: "+55", iso: "BR", length: 11, startsWith: [9] },
  { name: "Brunei", code: "+673", iso: "BN", length: 7, startsWith: [7, 8] },
  { name: "Bulgaria", code: "+359", iso: "BG", length: 9, startsWith: [8, 9] },
  { name: "Burkina Faso", code: "+226", iso: "BF", length: 8, startsWith: [] },
  { name: "Cambodia", code: "+855", iso: "KH", length: 9, startsWith: [1, 6, 7, 8, 9] },
  { name: "Cameroon", code: "+237", iso: "CM", length: 9, startsWith: [6] },
  { name: "Canada", code: "+1", iso: "CA", length: 10, startsWith: [] },
  { name: "Chile", code: "+56", iso: "CL", length: 9, startsWith: [9] },
  { name: "China", code: "+86", iso: "CN", length: 11, startsWith: [1] },
  { name: "Colombia", code: "+57", iso: "CO", length: 10, startsWith: [3] },
  { name: "Costa Rica", code: "+506", iso: "CR", length: 8, startsWith: [5, 6, 7, 8] },
  { name: "Croatia", code: "+385", iso: "HR", length: 9, startsWith: [9] },
  { name: "Cuba", code: "+53", iso: "CU", length: 8, startsWith: [5] },
  { name: "Cyprus", code: "+357", iso: "CY", length: 8, startsWith: [9] },
  { name: "Czech Republic", code: "+420", iso: "CZ", length: 9, startsWith: [] },
  { name: "Denmark", code: "+45", iso: "DK", length: 8, startsWith: [2, 3, 4, 5, 6, 7, 8, 9] },
  { name: "Dominican Republic", code: "+1", iso: "DO", length: 10, startsWith: [] },
  { name: "Ecuador", code: "+593", iso: "EC", length: 9, startsWith: [9] },
  { name: "Egypt", code: "+20", iso: "EG", length: 10, startsWith: [1] },
  { name: "Estonia", code: "+372", iso: "EE", length: 8, startsWith: [5, 8] },
  { name: "Ethiopia", code: "+251", iso: "ET", length: 9, startsWith: [9] },
  { name: "Fiji", code: "+679", iso: "FJ", length: 7, startsWith: [7, 8, 9] },
  { name: "Finland", code: "+358", iso: "FI", length: 9, startsWith: [4, 5] },
  { name: "France", code: "+33", iso: "FR", length: 9, startsWith: [6, 7] },
  { name: "Georgia", code: "+995", iso: "GE", length: 9, startsWith: [5, 7] },
  { name: "Germany", code: "+49", iso: "DE", length: 11, startsWith: [1] },
  { name: "Ghana", code: "+233", iso: "GH", length: 9, startsWith: [2, 5] },
  { name: "Greece", code: "+30", iso: "GR", length: 10, startsWith: [6] },
  { name: "Guatemala", code: "+502", iso: "GT", length: 8, startsWith: [3, 4, 5] },
  { name: "Guyana", code: "+592", iso: "GY", length: 7, startsWith: [6] },
  { name: "Haiti", code: "+509", iso: "HT", length: 8, startsWith: [3, 4] },
  { name: "Honduras", code: "+504", iso: "HN", length: 8, startsWith: [3, 7, 8, 9] },
  { name: "Hong Kong", code: "+852", iso: "HK", length: 8, startsWith: [4, 5, 6, 7, 8, 9] },
  { name: "Hungary", code: "+36", iso: "HU", length: 9, startsWith: [2, 3, 7] },
  { name: "Iceland", code: "+354", iso: "IS", length: 7, startsWith: [6, 7, 8] },
  { name: "India", code: "+91", iso: "IN", length: 10, startsWith: [6, 7, 8, 9] },
  { name: "Indonesia", code: "+62", iso: "ID", length: 11, startsWith: [8] },
  { name: "Iran", code: "+98", iso: "IR", length: 10, startsWith: [9] },
  { name: "Iraq", code: "+964", iso: "IQ", length: 10, startsWith: [7] },
  { name: "Ireland", code: "+353", iso: "IE", length: 9, startsWith: [8] },
  { name: "Israel", code: "+972", iso: "IL", length: 9, startsWith: [5] },
  { name: "Italy", code: "+39", iso: "IT", length: 10, startsWith: [3] },
  { name: "Jamaica", code: "+1", iso: "JM", length: 10, startsWith: [] },
  { name: "Japan", code: "+81", iso: "JP", length: 10, startsWith: [7, 8, 9] },
  { name: "Jordan", code: "+962", iso: "JO", length: 9, startsWith: [7] },
  { name: "Kazakhstan", code: "+7", iso: "KZ", length: 10, startsWith: [7] },
  { name: "Kenya", code: "+254", iso: "KE", length: 9, startsWith: [7, 1] },
  { name: "Kuwait", code: "+965", iso: "KW", length: 8, startsWith: [5, 6, 9] },
  { name: "Kyrgyzstan", code: "+996", iso: "KG", length: 9, startsWith: [5, 7] },
  { name: "Laos", code: "+856", iso: "LA", length: 10, startsWith: [2] },
  { name: "Latvia", code: "+371", iso: "LV", length: 8, startsWith: [2] },
  { name: "Lebanon", code: "+961", iso: "LB", length: 8, startsWith: [3, 7, 8] },
  { name: "Libya", code: "+218", iso: "LY", length: 9, startsWith: [9] },
  { name: "Lithuania", code: "+370", iso: "LT", length: 8, startsWith: [6] },
  { name: "Luxembourg", code: "+352", iso: "LU", length: 9, startsWith: [6] },
  { name: "Malaysia", code: "+60", iso: "MY", length: 10, startsWith: [1] },
  { name: "Maldives", code: "+960", iso: "MV", length: 7, startsWith: [7, 9] },
  { name: "Malta", code: "+356", iso: "MT", length: 8, startsWith: [7, 9] },
  { name: "Mexico", code: "+52", iso: "MX", length: 10, startsWith: [] },
  { name: "Moldova", code: "+373", iso: "MD", length: 8, startsWith: [6, 7] },
  { name: "Monaco", code: "+377", iso: "MC", length: 8, startsWith: [6] },
  { name: "Mongolia", code: "+976", iso: "MN", length: 8, startsWith: [8, 9] },
  { name: "Montenegro", code: "+382", iso: "ME", length: 8, startsWith: [6] },
  { name: "Morocco", code: "+212", iso: "MA", length: 9, startsWith: [6, 7] },
  { name: "Nepal", code: "+977", iso: "NP", length: 10, startsWith: [9] },
  { name: "Netherlands", code: "+31", iso: "NL", length: 9, startsWith: [6] },
  { name: "New Zealand", code: "+64", iso: "NZ", length: 9, startsWith: [2] },
  { name: "Nigeria", code: "+234", iso: "NG", length: 10, startsWith: [7, 8, 9] },
  { name: "Norway", code: "+47", iso: "NO", length: 8, startsWith: [4, 9] },
  { name: "Oman", code: "+968", iso: "OM", length: 8, startsWith: [9, 7] },
  { name: "Pakistan", code: "+92", iso: "PK", length: 10, startsWith: [3] },
  { name: "Panama", code: "+507", iso: "PA", length: 8, startsWith: [6] },
  { name: "Paraguay", code: "+595", iso: "PY", length: 9, startsWith: [9] },
  { name: "Peru", code: "+51", iso: "PE", length: 9, startsWith: [9] },
  { name: "Philippines", code: "+63", iso: "PH", length: 10, startsWith: [9] },
  { name: "Poland", code: "+48", iso: "PL", length: 9, startsWith: [4, 5, 6, 7, 8] },
  { name: "Portugal", code: "+351", iso: "PT", length: 9, startsWith: [9] },
  { name: "Qatar", code: "+974", iso: "QA", length: 8, startsWith: [3, 5, 6, 7] }
].sort((a, b) => a.name.localeCompare(b.name));

interface PhoneInputProps {
  onChange: (fullNumber: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

export default function PhoneInput({ onChange, onValidityChange }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.iso === 'IN') || COUNTRIES[0]);
  const [number, setNumber] = useState('');
  const [msg, setMsg] = useState({ text: 'Required for account security', isError: false });

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= (selectedCountry.length + 1)) setNumber(val);
  };

  useEffect(() => {
    const isValid = validate(number);
    onValidityChange(isValid);
    onChange(`${selectedCountry.code}${number}`);
  }, [number, selectedCountry]);

  const validate = (val: string) => {
    if (!val) {
      setMsg({ text: 'Phone number is required', isError: false });
      return false;
    }
    if (selectedCountry.iso === 'IN') {
      const firstDigit = parseInt(val[0]);
      if (!selectedCountry.startsWith.includes(firstDigit)) {
        setMsg({ text: 'Indian numbers usually start with 6, 7, 8, or 9', isError: true });
        return false;
      }
      if (val.length !== selectedCountry.length) {
        setMsg({ text: `Enter exactly ${selectedCountry.length} digits`, isError: true });
        return false;
      }
    } else if (val.length < 7) {
      setMsg({ text: 'Number too short', isError: true });
      return false;
    }

    setMsg({ text: `Valid ${selectedCountry.name} number`, isError: false });
    return true;
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Phone Number</label>
      <div className="flex gap-2">
        <select 
          className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold w-1/3"
          onChange={(e) => setSelectedCountry(COUNTRIES[parseInt(e.target.value)])}
          defaultValue={COUNTRIES.findIndex(c => c.iso === 'IN')}
        >
          {COUNTRIES.map((c, index) => (
            <option key={c.iso} value={index}>{c.iso} ({c.code})</option>
          ))}
        </select>
        <input 
          type="tel" value={number} onChange={handleNumberChange} placeholder="00000 00000"
          className={`flex-1 p-4 bg-slate-50 border rounded-2xl outline-none transition-all ${msg.isError && number ? 'border-red-300' : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/20'}`}
        />
      </div>
      <p className={`text-[11px] font-bold px-1 uppercase tracking-tight ${msg.isError && number ? 'text-red-500' : 'text-slate-400'}`}>
        {msg.text}
      </p>
    </div>
  );
}