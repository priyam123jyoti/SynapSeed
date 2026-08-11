'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PaperCard, PaperItem } from '@/components/catalog/PaperCard';
import { PaperFilters } from '@/components/catalog/PaperFilters';

const WHATSAPP_NUMBER = '917637968060';
const ADMIN_EMAIL = 'dihingiapriyamjyoti@gmail.com';

// Helper to convert numbers (1, 2, 3) to ordinal strings (1st, 2nd, 3rd)
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
}

export default function PaperCatalogPage() {
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Filter states
  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');

  async function fetchMarketplaceData() {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setCurrentUserEmail(user.email.toLowerCase().trim());
      }

      const resCatalog = await fetch('/api/papers/catalog-list');
      if (resCatalog.ok) {
        const catalogData = await resCatalog.json();
        setPapers(catalogData);
      }
    } catch (e) {
      console.error('Error fetching catalog data:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const handleRequestPaper = (paper: PaperItem) => {
    const message =
      `Hello! I would like to buy the following question paper:\n\n` +
      `*Course:* ${paper.course_title} (${paper.course_code})\n` +
      `*Course Type:* ${paper.course_type || 'N/A'}\n` +
      `*Stream:* ${paper.stream || 'N/A'}\n` +
      `*Institution:* ${paper.college_name}\n` +
      `*Program & Sem:* ${paper.program} - Sem ${paper.semester}\n` +
      `*Department:* ${paper.department}\n` +
      `*Year:* ${paper.year}\n` +
      `*Paper ID:* ${paper.id}\n\n` +
      `Please share the UPI QR Code for ₹5.00 payment.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const handleImageError = (paperId: string) => {
    setImageErrors((prev) => ({ ...prev, [paperId]: true }));
  };

  // Multi-Token Search & Filter Logic
  const filteredPapers = papers.filter((paper) => {
    // Build comprehensive search text including all aliases and fields
    const semNumber = paper.semester;
    const semOrdinal = getOrdinalSuffix(semNumber);

    const searchableText = [
      paper.course_title,
      paper.course_code,
      paper.department,
      paper.college_name,
      paper.program,
      paper.stream || '',
      paper.course_type || '',
      paper.exam_type,
      paper.year.toString(),
      `sem ${semNumber}`,
      `semester ${semNumber}`,
      semOrdinal,
      `${semOrdinal} sem`,
      `${semOrdinal} semester`,
    ]
      .join(' ')
      .toLowerCase();

    // Split search input into tokens (e.g., "2024", "botany", "2nd", "sem")
    const searchTokens = search.toLowerCase().trim().split(/\s+/).filter(Boolean);

    // Ensure EVERY search term matches somewhere in the paper data
    const matchesSearch = searchTokens.every((token) => searchableText.includes(token));

    // College Name Filter (Typeable string matching)
    const matchesCollege =
      collegeFilter.trim() === '' ||
      paper.college_name.toLowerCase().includes(collegeFilter.toLowerCase().trim());

    // Dropdown Filters
    const matchesProgram = programFilter === '' || paper.program === programFilter;
    const matchesSemester = semFilter === '' || paper.semester.toString() === semFilter;

    return matchesSearch && matchesCollege && matchesProgram && matchesSemester;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-xs font-bold uppercase tracking-widest text-slate-500 gap-2">
        <Loader2 className="animate-spin text-slate-900" size={20} /> Loading Marketplace Catalog...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Marketplace Header Banner */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight">Question Paper Catalog</h1>
            <p className="text-xs text-slate-400 font-bold">
              All Question Papers Fixed at ₹5.00 • Instant Delivery via WhatsApp & QR Payment
            </p>
          </div>
          {currentUserEmail === ADMIN_EMAIL && (
            <div className="flex items-center gap-1.5 bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck size={16} /> Admin Controls Active
            </div>
          )}
        </div>

        {/* Filters Component */}
        <PaperFilters
          search={search}
          setSearch={setSearch}
          collegeFilter={collegeFilter}
          setCollegeFilter={setCollegeFilter}
          programFilter={programFilter}
          setProgramFilter={setProgramFilter}
          semFilter={semFilter}
          setSemFilter={setSemFilter}
        />

        {/* Catalog Grid */}
        {filteredPapers.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
            No papers found matching the specified parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                currentUserEmail={currentUserEmail}
                adminEmail={ADMIN_EMAIL}
                isImageFailed={!!imageErrors[paper.id]}
                onImageError={handleImageError}
                onRequestPaper={handleRequestPaper}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}