"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, BookOpen, Heart, Phone, ArrowRight, Star, Quote, Clock, Sparkles, Zap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const { language, t } = useLanguage()
  const [stats, setStats] = useState({
    students: 0,
    years: 0,
    teachers: 0,
    families: 0,
  })

  // Animated counter effect
  useEffect(() => {
    const targetStats = { students: 250, years: 15, teachers: 18, families: 180 }
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        students: Math.floor(targetStats.students * progress),
        years: Math.floor(targetStats.years * progress),
        teachers: Math.floor(targetStats.teachers * progress),
        families: Math.floor(targetStats.families * progress),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setStats(targetStats)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const content = {
    en: {
      hero: {
        title: "Welcome to Fnote Selam Sunday School",
        subtitle: "Growing in faith, wisdom, and service",
        description:
          "Join our vibrant community where children and families grow together in the love of Christ through Ethiopian Orthodox traditions and modern learning.",
        joinButton: "Join Our Community",
        learnButton: "Learn More",
      },
      stats: {
        students: "Active Students",
        years: "Years of Service",
        teachers: "Dedicated Teachers",
        families: "Families Served",
      },
      services: {
        title: "What We Offer",
        subtitle: "Comprehensive spiritual education for all ages",
        items: [
          {
            title: "Sunday Classes",
            description: "Age-appropriate Bible study and Ethiopian Orthodox teachings every Sunday morning.",
            icon: BookOpen,
          },
          {
            title: "Youth Ministry",
            description: "Engaging programs for teenagers focusing on faith, fellowship, and community service.",
            icon: Users,
          },
          {
            title: "Family Outreach",
            description: "Supporting families in their spiritual journey with counseling and community events.",
            icon: Heart,
          },
          {
            title: "Cultural Heritage",
            description: "Preserving and teaching Ethiopian Orthodox traditions, language, and customs.",
            icon: Star,
          },
        ],
      },
      events: {
        title: "Upcoming Events",
        subtitle: "Join us for these special occasions",
        items: [
          {
            date: "Dec 15, 2024",
            title: "Christmas Celebration",
            description: "Special Christmas program with traditional songs and performances.",
            time: "2:00 PM",
          },
          {
            date: "Dec 22, 2024",
            title: "Year-End Graduation",
            description: "Celebrating our students' achievements and progress this year.",
            time: "10:00 AM",
          },
          {
            date: "Jan 7, 2025",
            title: "Ethiopian Christmas (Genna)",
            description: "Traditional Ethiopian Christmas celebration with the community.",
            time: "9:00 AM",
          },
        ],
      },
      testimonials: {
        title: "What Families Say",
        items: [
          {
            name: "Almaz Tadesse",
            role: "Parent",
            quote:
              "My children have grown so much in their faith and understanding of our traditions. The teachers are wonderful and caring.",
            rating: 5,
          },
          {
            name: "Dawit Bekele",
            role: "Former Student",
            quote:
              "The Sunday school shaped my character and gave me a strong foundation in faith that I carry with me today.",
            rating: 5,
          },
          {
            name: "Hanna Girma",
            role: "Parent",
            quote:
              "A welcoming community where our family feels at home. The bilingual approach helps preserve our heritage.",
            rating: 5,
          },
        ],
      },
      cta: {
        title: "Ready to Join Our Community?",
        description: "Take the first step in your family's spiritual journey with us.",
        button: "Contact Us Today",
        phone: "Call +251 94 424 7165",
      },
    },
    am: {
      hero: {
        title: "ወደ ፍኖተ ሰላም ሰንበት ት/ቤት እንኳን በደህና መጡ",
        subtitle: "የእምነት እውቀት እና አገልግሎት ማሻሻያ",
        description: "ልጆች እና ቤተሰቦች በኢትዮጵያ ኦርቶዶክስ ወጎች እና ዘመናዊ ትምህርት በክርስቶስ ፍቅር አብረው የሚያድጉበት ህያው ማህበረሰባችንን ይቀላቀሉ።",
        joinButton: "ማህበረሰባችንን ይቀላቀሉ",
        learnButton: "የበለጠ ይወቁ",
      },
      stats: {
        students: "ንቁ ተማሪዎች",
        years: "የአገልግሎት ዓመታት",
        teachers: "ቁርጠኛ መምህራን",
        families: "የተሰጣቸው ቤተሰቦች",
      },
      services: {
        title: "የምናቀርባቸው አገልግሎቶች",
        subtitle: "ለሁሉም ዕድሜ ያለው ሰፊ መንፈሳዊ ትምህርት",
        items: [
          {
            title: "የሰንበት ክፍሎች",
            description: "በእያንዳንዱ እሁድ ጠዋት ለእድሜ ተስማሚ የመጽሐፍ ቅዱስ ጥናት እና የኢትዮጵያ ኦርቶዶክስ ትምህርቶች።",
            icon: BookOpen,
          },
          {
            title: "የወጣቶች አገልግሎት",
            description: "በእምነት፣ በወዳጅነት እና በማህበረሰብ አገልግሎት ላይ ያተኮሩ ለወጣቶች አሳታፊ ፕሮግራሞች።",
            icon: Users,
          },
          {
            title: "የቤተሰብ ድጋፍ",
            description: "ቤተሰቦችን በመንፈሳዊ ጉዞአቸው በምክር እና በማህበረሰብ ዝግጅቶች መደገፍ።",
            icon: Heart,
          },
          {
            title: "የባህል ቅርስ",
            description: "የኢትዮጵያ ኦርቶዶክስ ወጎች፣ ቋንቋ እና ባህሎች መጠበቅ እና ማስተማር።",
            icon: Star,
          },
        ],
      },
      events: {
        title: "የሚመጡ ዝግጅቶች",
        subtitle: "በእነዚህ ልዩ አጋጣሚዎች ይቀላቀሉን",
        items: [
          {
            date: "ታህሳስ 15፣ 2024",
            title: "የገና በዓል",
            description: "በባህላዊ ዘፈኖች እና ትርኢቶች ልዩ የገና ፕሮግራም።",
            time: "2:00 ከሰዓት",
          },
          {
            date: "ታህሳስ 22፣ 2024",
            title: "የዓመት መጨረሻ ምረቃ",
            description: "በዚህ ዓመት የተማሪዎቻችንን ስኬቶች እና እድገት ማክበር።",
            time: "10:00 ጠዋት",
          },
          {
            date: "ጥር 7፣ 2025",
            title: "የኢትዮጵያ ገና (ገና)",
            description: "ከማህበረሰቡ ጋር ባህላዊ የኢትዮጵያ ገና በዓል።",
            time: "9:00 ጠዋት",
          },
        ],
      },
      testimonials: {
        title: "ቤተሰቦች የሚሉት",
        items: [
          {
            name: "አልማዝ ታደሰ",
            role: "ወላጅ",
            quote: "ልጆቼ በእምነታቸው እና በወጎችችን ግንዛቤ በጣም አድገዋል። መምህራኑ ድንቅ እና አሳቢ ናቸው።",
            rating: 5,
          },
          {
            name: "ዳዊት በቀለ",
            role: "የቀድሞ ተማሪ",
            quote: "የሰንበት ት/ቤቱ ባህሪዬን ቀርጾ ዛሬም የምሸከመውን ጠንካራ የእምነት መሰረት ሰጠኝ።",
            rating: 5,
          },
          {
            name: "ሐና ግርማ",
            role: "ወላጅ",
            quote: "ቤተሰባችን እንደ ቤት የሚሰማበት አቀባባይ ማህበረሰብ። ባለሁለት ቋንቋ አቀራረቡ ቅርሳችንን ለመጠበቅ ይረዳል።",
            rating: 5,
          },
        ],
      },
      cta: {
        title: "ማህበረሰባችንን ለመቀላቀል ዝግጁ ነዎት?",
        description: "ከእኛ ጋር በቤተሰብዎ መንፈሳዊ ጉዞ የመጀመሪያውን እርምጃ ይውሰዱ።",
        button: "ዛሬ ያግኙን",
        phone: "ይደውሉ +251 94 424 7165",
      },
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0 bg-primary">
            <Image
              src="/images/church-hero.png"
              alt="Buraayu D/Selam Medhanie Alem Cathedral"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105 opacity-20"
              priority
            />
          </div>

          <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/30 rounded-full animate-float blur-sm"></div>
          <div className="absolute bottom-32 right-16 w-16 h-16 bg-white/20 rounded-full animate-bounce-gentle blur-sm"></div>
          <div className="absolute top-1/3 right-20 w-12 h-12 bg-secondary/40 rounded-full animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/30 rounded-full animate-float blur-sm"></div>

          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="p-4 bg-white/10 glass-effect rounded-full animate-pulse-glow">
              <Image src="/images/church-logo.png" alt="Church Logo" width={80} height={80} className="rounded-full" />
            </div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
            <div className="animate-fade-in-up">
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 bg-white/10 glass-effect px-6 py-3 rounded-full mb-6 animate-scale-in">
                  <Sparkles className="h-6 w-6 text-secondary animate-pulse" />
                  <span className="text-secondary font-bold text-lg">Sunday School</span>
                  <Sparkles className="h-6 w-6 text-secondary animate-pulse" />
                </div>
              </div>

              <h1
                className={`text-6xl md:text-8xl font-bold mb-8 font-space-grotesk text-balance leading-tight drop-shadow-2xl text-white ${language === "am" ? "font-ethiopic" : ""}`}
              >
                {currentContent.hero.title}
              </h1>

              <div className="relative mb-8">
                <p
                  className={`text-3xl md:text-4xl mb-2 text-secondary font-bold tracking-wide drop-shadow-lg ${language === "am" ? "font-ethiopic" : ""}`}
                >
                  {currentContent.hero.subtitle}
                </p>
                <div className="w-32 h-1 bg-secondary mx-auto rounded-full animate-pulse-glow"></div>
              </div>

              <p
                className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-white leading-relaxed drop-shadow-lg ${language === "am" ? "font-ethiopic" : ""}`}
              >
                {currentContent.hero.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-primary text-xl px-12 py-6 transform hover:scale-105 transition-all duration-300 shadow-gold animate-pulse-glow font-bold"
                >
                  <Zap className="mr-3 h-7 w-7" />
                  {currentContent.hero.joinButton}
                  <ArrowRight className="ml-3 h-7 w-7" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-3 border-secondary text-secondary hover:bg-secondary hover:text-primary text-xl px-12 py-6 bg-primary/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 font-bold"
                >
                  {currentContent.hero.learnButton}
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div
                className="w-3 h-3 bg-secondary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </section>

        <ScrollReveal>
          <section className="py-24 bg-gradient-to-br from-secondary/10 to-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                  { value: stats.students, label: currentContent.stats.students, icon: Users },
                  { value: stats.years, label: currentContent.stats.years, icon: Calendar },
                  { value: stats.teachers, label: currentContent.stats.teachers, icon: BookOpen },
                  { value: stats.families, label: currentContent.stats.families, icon: Heart },
                ].map((stat, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <Card className="text-center group hover:shadow-brand transition-all duration-500 border-2 border-transparent hover:border-secondary/30 bg-white hover:-translate-y-3 animate-scale-in">
                      <CardContent className="p-6 md:p-8">
                        <div className="w-20 h-20 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-brand">
                          <stat.icon className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-5xl md:text-7xl font-bold text-primary mb-4 font-space-grotesk group-hover:text-secondary transition-colors duration-300">
                          {stat.value}+
                        </div>
                        <p
                          className={`text-muted-foreground font-semibold text-sm md:text-base ${language === "am" ? "font-ethiopic" : ""}`}
                        >
                          {stat.label}
                        </p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 bg-secondary/10 px-6 py-3 rounded-full mb-8">
                  <Sparkles className="h-6 w-6 text-secondary" />
                  <span className="text-secondary font-bold text-lg">Our Services</span>
                </div>
                <h2
                  className={`text-5xl md:text-7xl font-bold text-primary mb-8 font-space-grotesk text-balance ${language === "am" ? "font-ethiopic" : ""}`}
                >
                  {currentContent.services.title}
                </h2>
                <p
                  className={`text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto ${language === "am" ? "font-ethiopic" : ""}`}
                >
                  {currentContent.services.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentContent.services.items.map((service, index) => (
                  <ScrollReveal key={index} delay={index * 150}>
                    <Card className="text-center hover:shadow-brand transition-all duration-500 border-2 border-transparent hover:border-secondary/20 group hover:-translate-y-4 bg-gradient-to-br from-white to-secondary/5">
                      <CardHeader className="pb-4">
                        <div className="w-24 h-24 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-brand">
                          <service.icon className="h-12 w-12 text-white" />
                        </div>
                        <CardTitle
                          className={`text-xl md:text-2xl font-space-grotesk text-primary group-hover:text-secondary transition-colors duration-300 ${language === "am" ? "font-ethiopic" : ""}`}
                        >
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription
                          className={`text-base md:text-lg leading-relaxed text-muted-foreground ${language === "am" ? "font-ethiopic" : ""}`}
                        >
                          {service.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-8">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-primary font-bold text-lg">Upcoming Events</span>
              </div>
              <h2
                className={`text-5xl md:text-7xl font-bold text-primary mb-8 font-space-grotesk text-balance ${language === "am" ? "font-ethiopic" : ""}`}
              >
                {currentContent.events.title}
              </h2>
              <p className={`text-xl md:text-2xl text-muted-foreground ${language === "am" ? "font-ethiopic" : ""}`}>
                {currentContent.events.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {currentContent.events.items.map((event, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <Card className="hover:shadow-gold transition-all duration-500 group hover:-translate-y-2 bg-white border-2 border-transparent hover:border-secondary/20">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 gradient-brand rounded-lg">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <Badge className="bg-secondary text-primary px-4 py-2 text-sm font-bold">{event.date}</Badge>
                      </div>
                      <CardTitle
                        className={`text-xl md:text-2xl font-space-grotesk text-primary group-hover:text-secondary transition-colors duration-300 ${language === "am" ? "font-ethiopic" : ""}`}
                      >
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription
                        className={`text-base md:text-lg mb-6 leading-relaxed ${language === "am" ? "font-ethiopic" : ""}`}
                      >
                        {event.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <ScrollReveal>
          <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 bg-secondary/10 px-6 py-3 rounded-full mb-8">
                  <Quote className="h-6 w-6 text-secondary" />
                  <span className="text-secondary font-bold text-lg">Testimonials</span>
                </div>
                <h2
                  className={`text-5xl md:text-7xl font-bold text-primary mb-8 font-space-grotesk text-balance ${language === "am" ? "font-ethiopic" : ""}`}
                >
                  {currentContent.testimonials.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {currentContent.testimonials.items.map((testimonial, index) => (
                  <ScrollReveal key={index} delay={index * 150}>
                    <Card className="relative hover:shadow-brand transition-all duration-500 group hover:-translate-y-2 bg-gradient-to-br from-white to-secondary/5 border-2 border-transparent hover:border-secondary/20">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 gradient-brand rounded-full">
                            <Quote className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <blockquote
                          className={`text-base md:text-lg mb-8 leading-relaxed italic text-muted-foreground ${language === "am" ? "font-ethiopic" : ""}`}
                        >
                          "{testimonial.quote}"
                        </blockquote>
                        <div className="border-t pt-4">
                          <div className={`font-bold text-primary text-lg ${language === "am" ? "font-ethiopic" : ""}`}>
                            {testimonial.name}
                          </div>
                          <div className={`text-sm text-muted-foreground ${language === "am" ? "font-ethiopic" : ""}`}>
                            {testimonial.role}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="py-24 gradient-brand text-white relative overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float blur-sm"></div>
            <div className="absolute bottom-16 right-16 w-24 h-24 bg-secondary/30 rounded-full animate-bounce-gentle blur-sm"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/20 rounded-full animate-pulse blur-sm"></div>

            <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
              <div className="mb-8">
                <div className="p-6 bg-white/10 glass-effect rounded-full inline-flex animate-pulse-glow">
                  <Heart className="h-16 w-16 text-secondary" />
                </div>
              </div>
              <h2
                className={`text-5xl md:text-7xl font-bold mb-10 font-space-grotesk text-balance ${language === "am" ? "font-ethiopic" : ""}`}
              >
                {currentContent.cta.title}
              </h2>
              <p
                className={`text-xl md:text-2xl mb-12 text-white/95 max-w-3xl mx-auto leading-relaxed ${language === "am" ? "font-ethiopic" : ""}`}
              >
                {currentContent.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-primary text-xl px-12 py-6 transform hover:scale-105 transition-all duration-300 shadow-gold animate-pulse-glow font-bold"
                >
                  <Sparkles className="mr-3 h-7 w-7" />
                  {currentContent.cta.button}
                  <ArrowRight className="ml-3 h-7 w-7" />
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-3 border-secondary text-secondary hover:bg-secondary hover:text-primary text-xl px-12 py-6 bg-primary/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 font-bold"
                >
                  <a href="tel:+251944247165">
                    <Phone className="mr-3 h-7 w-7" />
                    {currentContent.cta.phone}
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  )
}
