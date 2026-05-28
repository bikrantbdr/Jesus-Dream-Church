"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEventAction, deleteEventAction } from "@/app/actions/events";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { 
  Calendar, 
  Upload, 
  Trash2, 
  Video, 
  Image as ImageIcon, 
  Plus, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  X, 
  Play, 
  Wifi, 
  WifiOff 
} from "lucide-react";

type Media = {
  id: string;
  url: string;
  type: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  media: Media[];
};

type EventFeedProps = {
  initialEvents: Event[];
  isAdmin: boolean;
};

export default function EventFeed({ initialEvents, isAdmin }: EventFeedProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Real-time status indicators
  const [isConnected, setIsConnected] = useState(false);
  const [liveBannerText, setLiveBannerText] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States related to carousel have been refactored inside the modular EventCard component.

  // 1. Establish SSE stream for live auto-updates
  useEffect(() => {
    const eventSource = new EventSource("/api/events/live");

    eventSource.addEventListener("connected", () => {
      setIsConnected(true);
      setError(null);
    });

    eventSource.addEventListener("ping", () => {
      setIsConnected(true);
    });

    eventSource.addEventListener("update", (e) => {
      try {
        const payload = JSON.parse(e.data);
        
        // Show absolute real-time banner update
        setLiveBannerText(payload.message || "New event upload detected! Feed refreshed.");
        
        // Instant Next.js Server Components dynamic data re-fetch (flawless dynamic syncing!)
        router.refresh();

        // Clear the live notification banner after 5 seconds
        setTimeout(() => {
          setLiveBannerText(null);
        }, 5000);
      } catch (err) {
        console.error("Failed to parse SSE payload", err);
      }
    });

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [router]);

  // 2. Generate file previews on selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Revoke old object URLs to prevent memory leaks
    previews.forEach((p) => URL.revokeObjectURL(p.url));

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
      name: file.name,
    }));

    setSelectedFiles(files);
    setPreviews(newPreviews);
  };

  const removeSelectedFile = (index: number) => {
    URL.revokeObjectURL(previews[index].url);
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  // 3. Submit Admin Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !description || !date) {
      setError("Please fill in all standard fields (Title, Description, and Date).");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);

    selectedFiles.forEach((file) => {
      formData.append("media", file);
    });

    startTransition(async () => {
      const result = await createEventAction(formData);
      if (result.success) {
        setSuccess("Event posted successfully and broadcasted in real-time!");
        
        // Reset states
        setTitle("");
        setDescription("");
        setDate("");
        setSelectedFiles([]);
        setPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setTimeout(() => setSuccess(null), 4000);
      } else {
        setError(result.error || "Failed to create event.");
      }
    });
  };

  // 4. Delete Event Action
  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event? This action will cascade delete all associated media files permanently!")) return;

    startTransition(async () => {
      const result = await deleteEventAction(id);
      if (result.success) {
        setSuccess("Event deleted successfully.");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to delete event.");
      }
    });
  };

  return (
    <div className="space-y-12">
      {/* 1. Live SSE Update Notification Banner */}
      {liveBannerText && (
        <div className="bg-terracotta text-white px-6 py-4 rounded-2xl shadow-lg shadow-terracotta/10 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-bold tracking-wide uppercase">{liveBannerText}</span>
          </div>
          <button onClick={() => setLiveBannerText(null)} className="cursor-pointer hover:text-white/80">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. ADMIN PANEL OVERLAY */}
      {isAdmin && (
        <Card className="border-2 border-dashed border-terracotta/40 bg-background-primary shadow-lg rounded-3xl overflow-hidden animate-fade-in">
          <div className="bg-deep-teal text-white px-6 py-4 flex items-center justify-between border-b border-terracotta/20">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-terracotta" />
              <h2 className="font-serif text-lg font-bold">Admin Panel: Post Service Event</h2>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-background-secondary bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Uploader Dashboard
            </span>
          </div>

          <CardContent className="pt-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 text-xs px-4 py-3 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs px-4 py-3 rounded-lg border border-green-200">
                <Sparkles className="h-4 w-4 animate-bounce" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-teal-black/75">Event Title</label>
                  <Input 
                    placeholder="e.g. Sunday Service Fellowship" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isPending}
                    className="bg-white border-background-secondary rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-teal-black/75">Event Date</label>
                  <Input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isPending}
                    className="bg-white border-background-secondary rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-teal-black/75">Description & Testimony</label>
                <Textarea 
                  placeholder="Share a short recap, scriptures discussed, or brief testimonies from this service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                  rows={3}
                  className="bg-white border-background-secondary rounded-lg resize-none"
                />
              </div>

              {/* MEDIA FILE SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-teal-black/75">Upload Media (Photos & Videos)</label>
                
                {/* Drag / Drop Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-background-secondary hover:border-terracotta/40 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/50"
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    disabled={isPending}
                    className="hidden"
                  />
                  <Upload className="h-8 w-8 mx-auto text-teal-black/55 mb-2 hover:scale-105 transition-transform" />
                  <p className="text-xs font-semibold text-teal-black">Click to Browse Images & Videos</p>
                  <p className="text-[10px] text-teal-black/60 mt-1">Supports JPEG, PNG, MP4, MOV (Multiple Selection)</p>
                </div>

                {/* Previews Grid */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative rounded-xl overflow-hidden border border-background-secondary h-24 group shadow-sm bg-black">
                        {preview.type === "VIDEO" ? (
                          <div className="h-full w-full flex items-center justify-center text-white relative">
                            <video src={preview.url} className="h-full w-full object-cover opacity-60" />
                            <Video className="h-6 w-6 absolute" />
                          </div>
                        ) : (
                          <img src={preview.url} alt="preview" className="h-full w-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 hover:bg-terracotta hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Creator */}
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-terracotta hover:bg-terracotta-hover text-white font-bold uppercase tracking-wider py-5 rounded-lg w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Media & Uploading...</span>
                  </>
                ) : (
                  <>
                    <span>Post Service Recap</span>
                    <Plus className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 3. EVENT STREAM TIMELINE */}
      <div className="space-y-8">
        {initialEvents.length === 0 ? (
          <div className="text-center py-16 bg-white/50 border border-background-secondary rounded-3xl">
            <ImageIcon className="h-12 w-12 mx-auto text-teal-black/40 mb-3" />
            <h3 className="font-serif text-lg font-bold text-teal-black">No Events Posted Yet</h3>
            <p className="text-xs text-teal-black/60 max-w-sm mx-auto mt-1 leading-relaxed">
              We will share photos, videos, and testimony summaries here after our upcoming church events! Check back soon.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 md:pl-10 border-l border-deep-teal/10 space-y-12">
            {initialEvents.map((event) => (
              <EventCard 
                key={event.id}
                event={event}
                isAdmin={isAdmin}
                isPending={isPending}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MODULAR EVENT CARD WITH SELF-CONTAINED STATE
// ==========================================
type EventCardProps = {
  event: Event;
  isAdmin: boolean;
  isPending: boolean;
  onDelete: (id: string) => void;
};

function EventCard({ event, isAdmin, isPending, onDelete }: EventCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Sync active slide index with Embla Carousel events with proper cleanup
  useEffect(() => {
    if (!api) return;
    
    // Set the initial index cleanly to match start position
    setActiveSlideIndex(api.selectedScrollSnap());
    
    const handleSelect = () => {
      setActiveSlideIndex(api.selectedScrollSnap());
    };
    
    api.on("select", handleSelect);
    
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Synchronize Embla Carousel scroll position dynamically on initialization
  useEffect(() => {
    if (!api || !isGalleryOpen) return;
    // Force the Embla instance to jump directly to the target slide index instantly
    api.scrollTo(carouselStartIndex, true);
  }, [api, carouselStartIndex, isGalleryOpen]);

  // Pause all videos that are NOT on the active slide
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isGalleryOpen) return;
    // Small delay to let React re-render with updated activeSlideIndex
    const timeout = setTimeout(() => {
      const container = carouselContainerRef.current;
      if (!container) return;
      const slides = container.querySelectorAll('[data-slot="carousel-item"]');
      slides.forEach((slide, idx) => {
        const videos = slide.querySelectorAll("video");
        videos.forEach((video) => {
          if (idx !== activeSlideIndex) {
            video.pause();
            video.currentTime = 0;
          }
        });
      });
    }, 50);
    return () => clearTimeout(timeout);
  }, [activeSlideIndex, isGalleryOpen]);

  const eventDate = new Date(event.date);

  return (
    <div className="relative group animate-fade-in">
      {/* Timeline Node (Interactive dot indicator centered relative to padding) */}
      <div className="absolute -left-[32px] md:-left-[48px] top-6 z-10">
        <div className="relative flex h-4 w-4">
          <div className="absolute -inset-1.5 rounded-full bg-terracotta/10 animate-ping group-hover:bg-terracotta/25 transition-all duration-300" />
          <div className="relative rounded-full h-4 w-4 bg-white border-[3.5px] border-terracotta shadow-md group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      {/* Elegant Floating Card */}
      <Card className="border border-border/80 bg-white/70 backdrop-blur-sm shadow-sm rounded-3xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/5 border border-terracotta/10 text-xs font-bold text-terracotta uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {eventDate.toLocaleDateString("en-US", { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <CardTitle className="font-serif text-2xl font-bold text-deep-teal pt-1 tracking-wide">
              {event.title}
            </CardTitle>
          </div>

          {isAdmin && (
            <button
              onClick={() => onDelete(event.id)}
              disabled={isPending}
              className="cursor-pointer hover:bg-red-50 hover:text-red-600 border border-border text-teal-black/40 p-2.5 rounded-full transition-colors self-start shadow-sm"
              title="Delete Event Recap"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Testimony Content */}
          <p className="text-teal-black/85 leading-relaxed font-light text-sm whitespace-pre-line">
            {event.description}
          </p>

          {/* Associated Media Grid (Sleek layout with +X remaining overlay) */}
          {event.media && event.media.length > 0 && (
            <div className={`grid gap-4 ${
              event.media.length === 1 
                ? "grid-cols-1" 
                : event.media.length === 2 
                  ? "grid-cols-2" 
                  : "grid-cols-3"
            }`}>
              {event.media.slice(0, 3).map((mediaItem, index) => {
                const isLastVisible = index === 2 && event.media.length > 3;
                const remainingCount = event.media.length - 2;

                return (
                  <div 
                    key={mediaItem.id} 
                    onClick={() => {
                      setCarouselStartIndex(index);
                      setActiveSlideIndex(index);
                      setIsGalleryOpen(true);
                    }}
                    className="relative rounded-2xl overflow-hidden border border-border/80 shadow-sm h-48 sm:h-56 bg-teal-black/5 group cursor-pointer"
                  >
                    {mediaItem.type === "VIDEO" ? (
                      <div className="h-full w-full relative flex items-center justify-center bg-black/90">
                        <video 
                          src={mediaItem.url} 
                          className="h-full w-full object-cover opacity-70 group-hover:scale-[1.02] transition-transform duration-500" 
                          muted
                          playsInline
                          loop
                          preload="metadata"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="h-11 w-11 rounded-full bg-white/90 text-deep-teal flex items-center justify-center shadow-lg group-hover:bg-terracotta group-hover:text-white group-hover:scale-105 transition-all duration-300">
                            <Play className="h-4 w-4 fill-current ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-3 left-3 bg-black/60 text-white rounded-full p-1.5 flex items-center justify-center">
                          <Video className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full relative overflow-hidden">
                        <img 
                          src={mediaItem.url} 
                          alt={event.title} 
                          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      </div>
                    )}

                    {/* +X Over remaining count overlay */}
                    {isLastVisible && (
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2.5px] flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/75">
                        <span className="font-serif text-3xl font-extrabold tracking-wider">
                          +{remainingCount}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-white/90">
                          More Media
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SELF-CONTAINED CAROUSEL MEDIA DIALOG (SHADCN COMPONENTS) */}
      <Dialog 
        open={isGalleryOpen} 
        onOpenChange={(open) => { 
          setIsGalleryOpen(open);
          if (!open) {
            setCarouselStartIndex(0);
            setActiveSlideIndex(0);
            setApi(undefined);
          }
        }}
      >
        <DialogContent className="max-w-5xl md:max-w-6xl w-[95vw] p-6 bg-black/95 border-none text-white shadow-2xl flex flex-col items-center justify-center max-h-[95vh] rounded-3xl">
          {isGalleryOpen && (
            <div className="relative w-full flex flex-col items-center space-y-4">
              <div className="text-center w-full px-12 pb-2">
                <span className="text-terracotta font-bold text-[10px] uppercase tracking-widest">
                  Event Media Gallery
                </span>
                <h3 className="font-serif text-lg font-bold text-white truncate max-w-lg mx-auto">
                  {event.title}
                </h3>
              </div>

              {/* Shadcn Carousel Component (Enlarged with dynamic mounting key to ensure correct start positions) */}
              <div ref={carouselContainerRef} className="w-full px-12 relative flex items-center justify-center">
                <Carousel 
                  key={`${event.id}-${carouselStartIndex}`}
                  opts={{ startIndex: carouselStartIndex }} 
                  setApi={setApi}
                  className="w-full max-w-4xl md:max-w-5xl"
                >
                  <CarouselContent>
                    {event.media.map((mediaItem, idx) => {
                      const isActive = activeSlideIndex === idx;

                      return (
                        <CarouselItem key={mediaItem.id} className="flex items-center justify-center h-[65vh] sm:h-[72vh] overflow-hidden">
                          {mediaItem.type === "VIDEO" ? (
                            <div className="w-full h-full flex items-center justify-center p-2">
                              {isActive ? (
                                <video 
                                  src={mediaItem.url} 
                                  className="max-w-full max-h-[62vh] sm:max-h-[68vh] rounded-2xl shadow-2xl border border-white/10" 
                                  controls 
                                  autoPlay
                                  playsInline 
                                  preload="auto"
                                />
                              ) : (
                                <div className="max-w-full max-h-[62vh] sm:max-h-[68vh] w-full h-full rounded-2xl bg-black/80 border border-white/10 flex flex-col items-center justify-center gap-3">
                                  <Play className="h-12 w-12 text-white/50" />
                                  <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">Video</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-2">
                              <img 
                                src={mediaItem.url} 
                                alt={`Slide ${idx + 1}`} 
                                className="max-w-full max-h-[62vh] sm:max-h-[68vh] rounded-2xl object-contain shadow-2xl border border-white/10" 
                              />
                            </div>
                          )}
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  
                  {/* Shadcn Navigation Controls (Responsive floating offsets) */}
                  {event.media.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2 sm:-left-12 bg-black/60 hover:bg-terracotta text-white border-white/10 hover:border-transparent transition-colors" />
                      <CarouselNext className="right-2 sm:-right-12 bg-black/60 hover:bg-terracotta text-white border-white/10 hover:border-transparent transition-colors" />
                    </>
                  )}
                </Carousel>
              </div>

              {/* Gallery Counter */}
              <div className="text-xs text-white/50 font-light font-sans tracking-widest pt-2">
                Drag to swipe • {event.media.length} items total
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
