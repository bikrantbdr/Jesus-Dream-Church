import React from "react";
import { Shield, Book, Heart, Users, MapPin } from "lucide-react";

export const metadata = {
  title: "About | Jesus Dream",
  description: "Learn about our church's journey, mission, and leadership team.",
};

export default function AboutPage() {
  const leadershipTeam = [
    {
      name: "Pastor Aadarsh Rajbhandari",
      role: "Lead Pastor",
      bio: "Pastor Aadarsh is passionate about leading the Jesus Dream fellowship in Frankfurt. He is dedicated to sharing scripture and spreading the love of Christ in Nepali.",
      image: "/leaders/aadarsha.jpg",
    },
    {
      name: "Elder Khadga Magar",
      role: "Church Elder",
      bio: "Elder Khadga Magar serves our congregation through service coordination, spiritual mentorship, and fellowship support, ensuring everyone finds a spiritual home.",
      image: "/leaders/khadka.jpg",
    },
    {
      name: "Elder Lydia Lee Huileng",
      role: "Church Elder",
      bio: "Elder Lydia Lee Huileng is a devoted member of our congregation, serving faithfully in worship, fellowship, and community outreach within the Jesus Dream family.",
      image: "/leaders/lydia.jpg",
    },
  ];

  return (
    <div className="flex flex-col w-full animate-fade-in bg-background-primary pb-24">
      {/* ─── 1. HERO BANNER ─── */}
      <section className="bg-gradient-to-b from-white via-white to-secondary text-foreground py-24 sm:py-32 border-b border-border relative overflow-hidden">
        {/* Decorative dot pattern */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#F61416_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10 space-y-6">
          {/* Chip label */}
          <span className="inline-block text-primary font-bold text-[11px] uppercase tracking-[0.3em] bg-primary/5 border border-primary/15 px-5 py-2 rounded-full">
            Our Story & Beliefs
          </span>

          {/* Main heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight tracking-tight">
            Who We Are
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto font-light leading-relaxed">
            Get to know our leadership team, our core values, and our vision to see Frankfurt transformed by the hope of the Gospel.
          </p>
        </div>
      </section>

      {/* ─── 2. OUR JOURNEY ─── */}
      <section className="py-20 sm:py-24 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start">
          <div className="md:col-span-2 space-y-5">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-snug">
              Grace in the Heart of the City
            </h2>
            <div className="w-14 h-1 bg-primary rounded-full" />
            <p className="text-foreground/80 leading-[1.85] text-base font-light">
              Jesus Dream was established on <strong className="font-semibold text-black">September 10, 2017</strong>, starting as a small gathering of families meeting in a living room, united by a simple dream: to create a church community where people could ask real questions, explore faith genuinely, and experience authentic Christian fellowship in Frankfurt.
            </p>
            <p className="text-foreground/80 leading-[1.85] text-base font-light">
              Today, our church has grown into a diverse congregation, drawing inspiration from historical biblical truth while maintaining a warm, conversational, and welcoming environment for all believers.
            </p>
          </div>
          
          <div className="bg-secondary rounded-3xl p-7 border border-primary/15 space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-black flex items-center gap-2.5">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Location Details</span>
            </h3>
            <p className="text-foreground/75 font-light text-sm leading-relaxed">
              Our meeting hall is conveniently located in Frankfurt am Main.
            </p>
            <div className="space-y-1">
              <a 
                href="https://maps.google.com/?q=Eschersheimer+Landstra%C3%9Fe+46,+60322+Frankfurt+am+Main"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors group/address inline-block"
              >
                <p className="font-semibold text-black text-sm group-hover/address:text-primary transition-colors">Eschersheimer Landstraße 46</p>
                <p className="text-foreground/75 text-sm">60322 Frankfurt am Main <span className="inline-block text-[11px] text-primary opacity-75 group-hover/address:opacity-100 transition-all duration-300 ml-0.5">↗</span></p>
              </a>
            </div>
            <div className="pt-3 border-t border-border text-xs text-foreground/55 italic">
              Easily accessible via local public transit.
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2.5. MISSION & THEME SONG ─── */}
      <section className="py-20 sm:py-24 bg-background-primary border-t border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Mission & Goals (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.25em] block">
                Our Vision & Purpose
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-snug">
                Our Goals & Mission
              </h2>
              <div className="w-14 h-1 bg-primary rounded-full" />
              <div className="space-y-5 text-foreground/80 font-light leading-[1.85] text-base">
                <p className="font-serif text-black font-semibold text-lg sm:text-xl italic border-l-[3px] border-primary pl-5 leading-relaxed">
                  "We gather there and glorify God's name. We are evangelical denominational and we believe in the Triune God: God the Father, God the Son, and God the Holy Spirit."
                </p>
                <p>
                  Our core mission is to praise God in our native language, enabling believers to experience a profound physical, spiritual, and emotional connection in worship while grasping the Word of God in a deeper, more meaningful sense.
                </p>
                <p>
                  In an increasingly intercultural society, we recognize a critical need for our community. Many Nepalese living here may not fully connect with English or German services. Having a dedicated space to hear and study the scriptures in their mother tongue ensures a richer, more accessible spiritual growth.
                </p>
                <p>
                  Beyond our weekly fellowship, we aim to reach every Nepali-speaking soul with the love of Christ. We humbly invite the global Christian family to join us in prayer as we spread the life-changing Gospel of Jesus.
                </p>
              </div>
            </div>

            {/* Theme Song (5 cols) */}
            <div className="lg:col-span-5 bg-secondary rounded-3xl p-8 sm:p-10 border border-primary/15 shadow-sm space-y-6">
              <div className="text-center space-y-3">
                <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.2em] block">
                  Church Theme & Mission Song
                </span>
                <h3 className="font-serif text-2xl font-bold text-black">
                  यशुको सपना
                </h3>
                <div className="w-10 h-[2px] bg-primary/40 mx-auto rounded-full" />
              </div>

              <div className="text-center space-y-5 font-serif text-lg sm:text-xl text-black leading-relaxed italic select-none">
                <p>
                  " यशुको सपना बोकेर, <br />
                  जिवनको मिल्ले बुझेर  <br />
                  जानु छ टाडा क्षितिज भन्दा पर... "
                </p>
                <p>
                  " आशुमा हासो छर्नलाई, <br />
                  दुखमा शुख भर्नलाई... "
                </p>
              </div>

              <div className="text-center pt-3 border-t border-border">
                <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/45 font-sans font-semibold">
                  Carrying the Dream of Jesus
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. STATEMENT OF FAITH ─── */}
      <section className="bg-secondary py-20 sm:py-24 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.25em] block">
              Core Doctrines
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-snug">
              Statement of Faith
            </h2>
            <p className="text-sm sm:text-base text-foreground/65 font-light leading-relaxed">
              Our beliefs define who we are and anchor how we serve our church community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* The Bible */}
            <div className="bg-background-primary p-8 sm:p-10 rounded-3xl border border-border hover:border-primary/30 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 ease-out space-y-5 relative overflow-hidden group">
              <div className="absolute top-6 right-8 font-serif text-4xl font-extrabold text-primary/[0.08] group-hover:text-primary/20 select-none transition-colors duration-300">
                01
              </div>
              <div className="h-12 w-12 bg-primary/10 border border-primary/15 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm">
                <Book className="h-6 w-6" />
              </div>
              <div className="space-y-2.5">
                <h3 className="font-serif text-xl font-bold text-black tracking-wide">
                  The Bible
                </h3>
                <p className="text-sm sm:text-base text-foreground/70 leading-[1.8] font-light">
                  We believe the Scriptures (Old and New Testaments) are the inspired, reliable Word of God, serving as the ultimate guide for daily living, faith, and practice.
                </p>
              </div>
            </div>

            {/* One True God */}
            <div className="bg-background-primary p-8 sm:p-10 rounded-3xl border border-border hover:border-primary/30 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 ease-out space-y-5 relative overflow-hidden group">
              <div className="absolute top-6 right-8 font-serif text-4xl font-extrabold text-primary/[0.08] group-hover:text-primary/20 select-none transition-colors duration-300">
                02
              </div>
              <div className="h-12 w-12 bg-primary/10 border border-primary/15 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-2.5">
                <h3 className="font-serif text-xl font-bold text-black tracking-wide">
                  One True God
                </h3>
                <p className="text-sm sm:text-base text-foreground/70 leading-[1.8] font-light">
                  We believe in one eternal God, creator of all things, who exists in three persons: Father, Son (Jesus Christ), and Holy Spirit, filled with limitless grace and truth.
                </p>
              </div>
            </div>

            {/* Salvation by Grace */}
            <div className="bg-background-primary p-8 sm:p-10 rounded-3xl border border-border hover:border-primary/30 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 ease-out space-y-5 relative overflow-hidden group">
              <div className="absolute top-6 right-8 font-serif text-4xl font-extrabold text-primary/[0.08] group-hover:text-primary/20 select-none transition-colors duration-300">
                03
              </div>
              <div className="h-12 w-12 bg-primary/10 border border-primary/15 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm">
                <Heart className="h-6 w-6" />
              </div>
              <div className="space-y-2.5">
                <h3 className="font-serif text-xl font-bold text-black tracking-wide">
                  Salvation by Grace
                </h3>
                <p className="text-sm sm:text-base text-foreground/70 leading-[1.8] font-light">
                  We believe salvation is a free gift of God's grace, received through personal faith in Jesus Christ's life, death on the cross, and resurrection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. LEADERSHIP TEAM ─── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.25em] block">
              Meet the Staff
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-snug">
              Our Leadership
            </h2>
            <p className="text-sm sm:text-base text-foreground/65 font-light leading-relaxed">
              Meet the dedicated pastors and leaders serving the Jesus Dream family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {leadershipTeam.map((leader, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] flex flex-col h-full"
              >
                {/* Profile Photo Banner */}
                <div className="bg-black h-40 relative border-b border-primary/20">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover object-top opacity-35"
                  />
                  <div className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 z-10 h-[80px] w-[80px] rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Leadership content */}
                <div className="p-8 pt-14 flex-grow flex flex-col justify-between text-center space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-xl font-bold text-black">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.15em]">
                      {leader.role}
                    </p>
                  </div>
                  <p className="text-sm text-foreground/70 font-light leading-[1.8]">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
