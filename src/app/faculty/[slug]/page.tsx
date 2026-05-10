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
  // Ensure the image URL is absolute for Google
  const absoluteImageUrl = `https://synap-seed.vercel.app${member.imageUrl}`;
  
  return {
    title: fullTitle,
    description: `${member.name} specializes in ${member.specialization} at Dhakuakhana College. Discover research publications, academic background, and botanical expertise.`,
    alternates: {
      canonical: `https://synap-seed.vercel.app/faculty/${member.slug}`,
    },
    openGraph: {
      title: fullTitle,
      description: member.bio,
      url: `https://synap-seed.vercel.app/faculty/${member.slug}`,
      siteName: "Dhakuakhana College Botany Department",
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `Portrait of ${member.name}, Botany Faculty`,
        },
      ],
      type: 'profile',
      firstName: member.name.split(' ')[0],
      lastName: member.name.split(' ').slice(1).join(' '),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      images: [absoluteImageUrl],
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

  // 1. ADVANCED PERSON SCHEMA (Crucial for beating the main college site)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": member.name,
      "givenName": member.name.split(' ')[0],
      "familyName": member.name.split(' ').slice(1).join(' '),
      "jobTitle": member.designation,
      "image": `https://synap-seed.vercel.app${member.imageUrl}`,
      "description": member.bio,
      "url": `https://synap-seed.vercel.app/faculty/${member.slug}`,
      "affiliation": {
        "@type": "CollegeOrUniversity",
        "name": "Dhakuakhana College (Autonomous)",
        "sameAs": "https://dhakuakhanacollege.ac.in" // Link to main site to show association
      },
      "knowsAbout": [
        member.specialization,
        "Botany",
        "Plant Taxonomy",
        "Assam Flora"
      ]
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* SEO Breadcrumbs with Microdata */}
      <nav className="max-w-4xl mx-auto px-6 pt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a itemProp="item" href="/"><span itemProp="name">Home</span></a>
            <meta itemProp="position" content="1" />
          </li>
          <li>/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a itemProp="item" href="/faculty"><span itemProp="name">Faculty</span></a>
            <meta itemProp="position" content="2" />
          </li>
          <li>/</li>
          <li className="text-emerald-600" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">{member.name}</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          {/* Image optimized for Google Image Search */}
          <div className="w-full md:w-1/3">
            <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-50">
              <Image 
                src={member.imageUrl} 
                alt={`Official Academic Portrait of ${member.name}, ${member.designation} at Dhakuakhana College`} 
                fill 
                priority 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 350px"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <header className="mb-8">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-2 tracking-tight">
                {member.name}
                </h1>
                <p className="text-emerald-600 font-bold text-xl flex items-center gap-2">
                <span className="w-6 h-[3px] bg-emerald-600"></span>
                {member.designation}
                </p>
            </header>
            
            <div className="space-y-10">
              <section aria-label="Professional Biography">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-3">
                   Academic Profile
                   <span className="flex-1 h-[1px] bg-slate-100"></span>
                </h3>
                <p className="text-slate-700 leading-relaxed text-lg italic">
                  "{member.bio}"
                </p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-3xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">Qualifications</h4>
                  <p className="text-slate-900 font-extrabold text-base">{member.qualifications}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Research Focus</h4>
                  <p className="text-slate-900 font-extrabold text-base">{member.specialization}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}