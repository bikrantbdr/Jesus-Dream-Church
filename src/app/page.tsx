import Link from "next/link";
import { ArrowRight, Heart, Users, Compass, Calendar, BookOpen, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-white to-secondary text-deep-teal py-24 lg:py-32 overflow-hidden border-b border-border">
        {/* Subtle dynamic background gradient lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C26747_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="inline-block text-terracotta font-bold text-xs uppercase tracking-[0.25em] bg-secondary border border-border px-4 py-1.5 rounded-full">
              Welcome to Jesus Dream
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-[1.15] text-deep-teal">
              Where faith finds a <span className="text-terracotta">warm home</span> and grace is shared.
            </h1>
            <p className="text-lg sm:text-xl text-teal-black/85 leading-relaxed font-light">
              Join us this Sunday to experience fellowship, dynamic worship, and a community centered on Jesus Christ in the heart of Frankfurt.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="bg-terracotta hover:bg-terracotta-hover text-white px-8 py-4 rounded-full font-bold tracking-wide uppercase transition-all duration-300 shadow-lg shadow-terracotta/20 flex items-center gap-2 hover:scale-[1.03]"
              >
                <span>Explore Events</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="bg-transparent hover:bg-secondary/50 text-deep-teal border-2 border-border hover:border-deep-teal/40 px-8 py-4 rounded-full font-bold tracking-wide uppercase transition-all duration-300 flex items-center gap-2"
              >
                <span>Who We Are</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATEMENT SCRIPTURE VERSE SECTION */}
      <section className="bg-secondary/40 py-12 sm:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          {/* Nepalese Verse */}
          <p className="font-serif text-2xl sm:text-3xl font-normal leading-relaxed text-deep-teal italic tracking-wide">
            "हे सबै थाकेका र बोझले दबिएका हो, मकहाँ आओ, म तिमीहरूलाई विश्राम दिनेछु।"
          </p>
          {/* English Verse */}
          <p className="font-serif text-lg sm:text-xl font-light leading-relaxed text-teal-black/75 italic">
            "Come to me, all of you who are weary and loaded down with burdens, and I will give you rest."
          </p>
          {/* Verse Reference */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="w-8 h-[1px] bg-terracotta" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
              मत्ती ११:२८ / Matt. 11:28
            </span>
            <span className="w-8 h-[1px] bg-terracotta" />
          </div>
        </div>
      </section>

      {/* 2. WELCOME BANNER (CREAM / SAND OVERLAP) */}
      <section className="bg-background-primary py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div className="space-y-6">
              <span className="text-terracotta font-semibold text-sm uppercase tracking-widest block">
                Grace is our Foundation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal-black leading-tight">
                A diverse community united in hope, growth, and love.
              </h2>
              <div className="w-16 h-1 bg-terracotta rounded" />
              <p className="text-teal-black/85 leading-relaxed text-md font-light">
                We gather here to glorify God's name together. We are an evangelical denominational fellowship, united by our faith in the Triune God: God the Father, God the Son, and God the Holy Spirit.
              </p>
              <p className="text-teal-black/85 leading-relaxed text-md font-light">
                Jesus Dream is a vibrant congregation representing people from all walks of life. Whether you are searching for answers, seeking a fresh spiritual start, or looking for a church family in Frankfurt, our doors and hearts are open to you.
              </p>
              <p className="text-teal-black/85 leading-relaxed text-md font-light">
                We believe in genuine connections over checklists, deep spiritual growth over surface-level routines, and taking active steps of kindness to serve our city.
              </p>
            </div>

            {/* Right graphical representation card */}
            <div className="bg-background-secondary rounded-3xl p-8 border border-terracotta/10 shadow-lg space-y-6">
              <h3 className="font-serif text-2xl font-bold text-teal-black">
                Join Us This Sunday
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-deep-teal p-3 rounded-2xl text-white mt-1">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-black">Worship Service</h4>
                    <p className="text-sm text-teal-black/75">Sundays from 12:00 PM to 2:00 PM</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-deep-teal p-3 rounded-2xl text-white mt-1">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-black">Fellowship Cafe</h4>
                    <p className="text-sm text-teal-black/75">After service, join us for snacks and coffee to talk with everyone.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-teal-black/10">
                <Link
                  href="/about"
                  className="text-terracotta font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:text-terracotta-hover transition-colors"
                >
                  <span>Learn what to expect</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE CORE PILLARS (DEEP TEAL INTERSECTION) */}
      <section className="bg-background-secondary py-16 sm:py-24 border-y border-terracotta/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-terracotta font-semibold text-sm uppercase tracking-widest block">
              Our Pillars
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal-black">
              How we grow together
            </h2>
            <p className="text-teal-black/75 text-sm">
              We anchor our church community in three key pillars of expression, ensuring everyone has space to worship, connect, and serve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-background-primary p-8 rounded-3xl border border-terracotta/5 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-5">
              <div className="h-12 w-12 rounded-2xl bg-deep-teal/10 flex items-center justify-center text-deep-teal">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-teal-black">Worship Heartily</h3>
              <p className="text-sm text-teal-black/80 leading-relaxed">
                Coming together in energetic corporate praise and silent reflective adoration, anchoring our spirits weekly in God's timeless presence.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-background-primary p-8 rounded-3xl border border-terracotta/5 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-5">
              <div className="h-12 w-12 rounded-2xl bg-deep-teal/10 flex items-center justify-center text-deep-teal">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-teal-black">Connect Deeply</h3>
              <p className="text-sm text-teal-black/80 leading-relaxed">
                Going beyond Sunday handshakes through intimate midweek home groups, shared meals, family retreats, and intentional discipleship.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-background-primary p-8 rounded-3xl border border-terracotta/5 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-5">
              <div className="h-12 w-12 rounded-2xl bg-deep-teal/10 flex items-center justify-center text-deep-teal">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-teal-black">Serve Passionately</h3>
              <p className="text-sm text-teal-black/80 leading-relaxed">
                Reaching outward into the neighborhoods of Frankfurt, providing food relief, organizing street cleanups, and demonstrating love in action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC EVENT HIGHLIGHT CTA */}
      <section className="bg-secondary text-deep-teal py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-deep-teal">
            See the church life in action
          </h2>
          <p className="text-teal-black/80 max-w-xl mx-auto text-md leading-relaxed font-light">
            Browse media uploads (pictures and videos) shared from our recent services, outreach projects, and group events!
          </p>
          <div className="pt-2">
            <Link
              href="/events"
              className="inline-flex bg-terracotta hover:bg-terracotta-hover text-white px-8 py-3.5 rounded-full font-bold tracking-wide uppercase transition-all duration-300 shadow-lg shadow-terracotta/20 items-center gap-2 hover:scale-[1.03]"
            >
              <span>View Active Event Board</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
