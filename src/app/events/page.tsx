import React from "react";
import Link from "next/link";
import { getAdminSession, anyAdminExists } from "../actions/auth";
import { getEvents } from "../actions/events";
import EventFeed from "@/components/EventFeed";
import { Calendar, UserCheck, ShieldAlert, Sparkles, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Service Recap & Events | Jesus Dream",
  description: "Browse photos, videos, testimonies, and updates from recent church services, outreach programs, and fellowship events.",
};

export default async function EventsPage() {
  const [username, adminExists, events] = await Promise.all([
    getAdminSession(),
    anyAdminExists(),
    getEvents(),
  ]);

  const isAdmin = username !== null;

  return (
    <div className="flex flex-col w-full animate-fade-in bg-background-primary pb-20">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-white via-white to-secondary text-foreground py-20 sm:py-24 lg:py-28 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#F61416_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="inline-block text-primary font-bold text-xs uppercase tracking-[0.25em] bg-primary/5 border border-primary/15 px-4 py-1.5 rounded-full">
            Active Fellowship Feed
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Service Recaps & Media
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            Relive our latest services and browse shared pictures and videos of our fellowship, baptisms, and outreaches in Frankfurt.
          </p>
        </div>
      </section>

      {/* Main Events Feed & Admin Setup Guide */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Developer Guide: Displayed ONLY if no administrators exist in the SQLite/PostgreSQL Database yet */}
        {!adminExists && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-4 shadow-sm animate-pulse">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-serif text-lg font-bold text-amber-800">
                  Initial Setup: No Admin Found
                </h3>
                <p className="text-xs text-amber-700 leading-relaxed mt-1 font-light">
                  To test uploader features (posting recaps, images, and videos), you must configure a secure administrator account first. We have set up a private hidden signup route for you.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between flex-wrap gap-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-100/50 px-3 py-1 rounded-full">
                Developer Environment Info
              </span>
              <Link
                href="/admin/secret-setup-page"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm shadow-amber-600/10 cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                <span>Initialize Admin Portal</span>
              </Link>
            </div>
          </div>
        )}

        {/* If logged in as admin, show custom admin state indicator */}
        {isAdmin && (
          <div className="mb-8 p-4 bg-red-50/80 border border-primary/20 rounded-3xl flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-primary rounded-full flex items-center justify-center text-white shadow-sm">
                <Sparkles className="h-4 w-4 text-white animate-spin" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-primary">Authorized Admin Active</h4>
                <p className="text-[10px] text-foreground/70">You are logged in as <span className="font-bold text-black">{username}</span>. You can now delete posts or upload new service recaps instantly.</p>
              </div>
            </div>
            <Link
              href="/"
              className="bg-black hover:bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* Core Live Updated Event Feed */}
        <EventFeed initialEvents={events} isAdmin={isAdmin} />
      </section>
    </div>
  );
}
