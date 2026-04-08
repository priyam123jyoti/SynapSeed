import { Metadata } from "next";
import FacultyCard from "../../components/faculty/FacultyCard";
import { botanyFaculty } from "../../lib/faculty";
import Navbar from "../../components/layout/Navbar"
import { Microscope, Leaf, Library, MicroscopeIcon } from "lucide-react"; // Assuming you use lucide-react

export const metadata: Metadata = {
  title: "Faculty | Dept. of Botany | Dhakuakhana College",
  description: "Official faculty directory of the Botany Department, Dhakuakhana College (Autonomous). Expert educators specializing in Plant Sciences, Taxonomy, and Phytopathology.",
  keywords: ["Dhakuakhana College Botany", "Rabin B Pegu", "Rakesh Kalita", "Botany Faculty Assam"],
};

export default function FacultyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Department of Botany, Dhakuakhana College (Autonomous)",
    "employee": botanyFaculty.map(member => ({
      "@type": "Person",
      "name": member.name,
      "jobTitle": member.designation,
    }))
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
        <Navbar/>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- HERO SECTION --- */}
      <header className="relative bg-emerald-950 py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Department of Botany
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Our <span className="text-emerald-400">Academic</span> Faculty
          </h1>
          <p className="max-w-2xl mx-auto text-emerald-100/70 text-lg font-light leading-relaxed">
            Leading the exploration of plant life and biodiversity through 
            dedicated research and excellence in teaching at Dhakuakhana College.
          </p>
        </div>
      </header>

      {/* --- FACULTY GRID --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 pb-24">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {botanyFaculty.map((member) => (
            <FacultyCard key={member.id} member={member} />
          ))}
        </section>

        {/* --- DEPARTMENTAL ECOSYSTEM SECTION (Replacement for AI Card) --- */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Departmental Ecosystem</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <Leaf size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Regional Herbarium</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                A vast collection of preserved plant specimens focusing on the unique flora of Upper Assam.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <Microscope size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Research Labs</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Equipped with modern diagnostic tools for Microbiology and Plant Pathology studies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <Library size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Digital Resources</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Access to e-journals, neural mindmaps, and specialized botanical databases.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <MicroscopeIcon size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Field Taxonomy</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Regular field visits to the Brahmaputra basin for real-world specimen identification.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      {/* Footer Info */}
      <footer className="bg-white border-t border-slate-100 py-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Department of Botany • Dhakuakhana College Autonomous
      </footer>
    </main>
  );
}