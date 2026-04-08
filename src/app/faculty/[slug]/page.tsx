import { botanyFaculty } from "@/lib/faculty";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const member = botanyFaculty.find((m) => m.slug === slug);
  
  if (!member) return { title: "Faculty Not Found" };

  const fullTitle = `${member.name} | ${member.designation} | Botany Department`;
  
  return {
    title: fullTitle,
    description: `${member.name} is a leading expert in ${member.specialization} at Dhakuakhana College (Autonomous). View academic qualifications and research interests.`,
    alternates: {
      canonical: `https://synap-seed.vercel.app/faculty/${member.slug}`,
    },
    openGraph: {
      title: fullTitle,
      description: member.bio,
      images: [member.imageUrl],
      type: 'profile',
    }
  };
}

export default async function FacultyProfile({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const member = botanyFaculty.find((m) => m.slug === slug);

  if (!member) notFound();

  // 1. PERSON SCHEMA (The "Secret Sauce" for Google)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": member.name,
    "jobTitle": member.designation,
    "affiliation": {
      "@type": "CollegeOrUniversity",
      "name": "Dhakuakhana College (Autonomous)"
    },
    "description": member.bio,
    "image": `https://yourdomain.com${member.imageUrl}`,
    "knowsAbout": [member.specialization, "Botany", "Plant Sciences"]
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 2. SEO BREADCRUMBS */}
      <nav className="max-w-4xl mx-auto px-6 pt-8 text-xs font-bold uppercase tracking-widest text-slate-400">
        <ul className="flex items-center gap-2">
          <li><a href="/" className="hover:text-emerald-600">Home</a></li>
          <li>/</li>
          <li><a href="/faculty" className="hover:text-emerald-600">Faculty</a></li>
          <li>/</li>
          <li className="text-emerald-600">{member.name}</li>
        </ul>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          <div className="w-full md:w-1/3">
            <div className="aspect-square relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-50">
              <Image 
                src={member.imageUrl} 
                alt={`Official portrait of ${member.name}, Botany Faculty at Dhakuakhana College`} 
                fill 
                priority // Tells Next.js to load this image instantly for SEO
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
              {member.name}
            </h1>
            <p className="text-emerald-600 font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-emerald-600"></span>
              {member.designation}
            </p>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 underline decoration-emerald-500 decoration-2 underline-offset-8">
                  Academic Background
                </h3>
                <p className="text-slate-700 leading-relaxed text-lg pt-2">
                  {member.bio}
                </p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">Credentials</h4>
                  <p className="text-slate-900 font-bold text-sm">{member.qualifications}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Expertise</h4>
                  <p className="text-slate-900 font-bold text-sm">{member.specialization}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}