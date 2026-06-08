"use client"

import { useState } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, BookOpen, Users, Star, Download, Calendar, Target, Eye } from "lucide-react"

export default function AboutPage() {
  const [currentLang, setCurrentLang] = useState<"en" | "am">("en")
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const content = {
    en: {
      hero: {
        title: "About Fnote Selam Sunday School",
        subtitle: "Our Story, Mission, and Community",
        description:
          "Discover the rich history and vibrant community that makes our Sunday school a beacon of faith and learning in Buraayu.",
      },
      mission: {
        title: "Our Mission & Vision",
        mission: {
          title: "Mission",
          text: "To provide comprehensive spiritual education rooted in Ethiopian Orthodox traditions while nurturing young minds to become faithful servants of God and responsible members of society.",
        },
        vision: {
          title: "Vision",
          text: "To be a leading center of Orthodox Christian education that preserves our heritage while preparing students for modern challenges through faith, wisdom, and service.",
        },
      },
      history: {
        title: "Our Journey Through Time",
        subtitle: "Milestones in our spiritual and educational mission",
        timeline: [
          {
            year: 2009,
            title: "Foundation",
            description: "Fnote Selam Sunday School was established with 25 students and 3 dedicated teachers.",
            details:
              "Started in a small classroom with the vision of providing quality Orthodox Christian education to children in Buraayu.",
          },
          {
            year: 2012,
            title: "First Expansion",
            description: "Expanded to serve 75 students with additional age-appropriate classes.",
            details:
              "Added separate classes for different age groups and introduced structured curriculum based on Orthodox teachings.",
          },
          {
            year: 2015,
            title: "Community Outreach",
            description: "Launched family outreach programs and community service initiatives.",
            details:
              "Extended our mission beyond Sunday classes to include family counseling and community development programs.",
          },
          {
            year: 2018,
            title: "Cultural Heritage Program",
            description: "Introduced comprehensive Ethiopian Orthodox cultural preservation programs.",
            details:
              "Added traditional music, language classes, and cultural celebrations to preserve our rich heritage.",
          },
          {
            year: 2021,
            title: "Digital Integration",
            description: "Adapted to modern learning with digital resources and online classes.",
            details:
              "Successfully transitioned to hybrid learning during challenging times while maintaining our community bonds.",
          },
          {
            year: 2024,
            title: "Current Growth",
            description: "Now serving 250+ students with 18 dedicated teachers and expanding facilities.",
            details:
              "Continuing to grow while maintaining our commitment to quality Orthodox Christian education and community service.",
          },
        ],
      },
      leadership: {
        title: "Our Leadership & Teachers",
        subtitle: "Dedicated servants committed to spiritual education",
        members: [
          {
            name: "Abune Petros Tadesse",
            role: "Spiritual Director",
            bio: "Leading our spiritual mission with 20+ years of Orthodox ministry experience.",
            image: "/placeholder-gj8j8.png",
          },
          {
            name: "Almaz Bekele",
            role: "Head Teacher",
            bio: "Educational coordinator with expertise in child development and Orthodox pedagogy.",
            image: "/placeholder-454bv.png",
          },
          {
            name: "Dawit Girma",
            role: "Youth Ministry Leader",
            bio: "Passionate about engaging young people in faith and community service.",
            image: "/placeholder-5beyq.png",
          },
          {
            name: "Hanna Wolde",
            role: "Cultural Heritage Coordinator",
            bio: "Preserving and teaching Ethiopian Orthodox traditions and customs.",
            image: "/placeholder-2k1jz.png",
          },
          {
            name: "Tekle Mariam",
            role: "Community Outreach Director",
            bio: "Connecting families and strengthening our community bonds.",
            image: "/placeholder-wgxv5.png",
          },
          {
            name: "Meron Assefa",
            role: "Children's Ministry Coordinator",
            bio: "Specialized in early childhood spiritual development and education.",
            image: "/placeholder-hu2lm.png",
          },
        ],
      },
      philosophy: {
        title: "Our Educational Philosophy",
        subtitle: "Core values that guide our teaching and community life",
        values: [
          {
            title: "Faith-Centered Learning",
            description: "All education is grounded in Orthodox Christian faith and biblical principles.",
            icon: Heart,
          },
          {
            title: "Cultural Preservation",
            description: "Maintaining and celebrating our rich Ethiopian Orthodox heritage and traditions.",
            icon: Star,
          },
          {
            title: "Community Service",
            description: "Teaching students to serve others and contribute positively to society.",
            icon: Users,
          },
          {
            title: "Holistic Development",
            description: "Nurturing spiritual, intellectual, emotional, and social growth in every child.",
            icon: BookOpen,
          },
        ],
      },
      downloads: {
        title: "Resources & Downloads",
        subtitle: "Important documents and information for families",
        items: [
          {
            title: "Class Schedule 2024-2025",
            description: "Complete schedule of all Sunday school classes and activities",
            type: "PDF",
          },
          {
            title: "Registration Form",
            description: "New student registration and enrollment information",
            type: "PDF",
          },
          {
            title: "Child Safeguarding Policy",
            description: "Our commitment to child protection and safety measures",
            type: "PDF",
          },
          {
            title: "Parent Handbook",
            description: "Comprehensive guide for parents and guardians",
            type: "PDF",
          },
        ],
      },
    },
    am: {
      hero: {
        title: "ስለ ፍኖተ ሰላም ሰንበት ት/ቤት",
        subtitle: "የእኛ ታሪክ፣ ተልዕኮ እና ማህበረሰብ",
        description: "የሰንበት ት/ቤታችንን በቡራዩ ውስጥ የእምነት እና የትምህርት መብራት የሚያደርገውን ሀብታም ታሪክ እና ህያው ማህበረሰብ ያግኙ።",
      },
      mission: {
        title: "የእኛ ተልዕኮ እና ራዕይ",
        mission: {
          title: "ተልዕኮ",
          text: "በኢትዮጵያ ኦርቶዶክስ ወጎች ላይ የተመሰረተ ሰፊ መንፈሳዊ ትምህርት መስጠት እና ወጣት አእምሮዎችን የእግዚአብሔር ታማኝ አገልጋዮች እና የማህበረሰቡ ተጠያቂ አባላት እንዲሆኑ ማሳደግ።",
        },
        vision: {
          title: "ራዕይ",
          text: "ቅርሳችንን እየጠበቅን ተማሪዎችን በእምነት፣ በጥበብ እና በአገልግሎት ለዘመናዊ ፈተናዎች የሚያዘጋጅ የኦርቶዶክስ ክርስቲያን ትምህርት መሪ ማዕከል መሆን።",
        },
      },
      history: {
        title: "በጊዜ ውስጥ የእኛ ጉዞ",
        subtitle: "በመንፈሳዊ እና በትምህርታዊ ተልዕኮአችን ውስጥ ያሉ ወሳኝ ክስተቶች",
        timeline: [
          {
            year: 2009,
            title: "መመስረት",
            description: "ፍኖተ ሰላም ሰንበት ት/ቤት በ25 ተማሪዎች እና 3 ቁርጠኛ መምህራን ተመሰረተ።",
            details: "በቡራዩ ውስጥ ላሉ ልጆች ጥራት ያለው ኦርቶዶክስ ክርስቲያን ትምህርት የመስጠት ራዕይ ይዞ በትንሽ ክፍል ተጀመረ።",
          },
          {
            year: 2012,
            title: "የመጀመሪያ መስፋፋት",
            description: "ተጨማሪ ለእድሜ ተስማሚ ክፍሎች ከ75 ተማሪዎች ጋር አገልግሎት ለመስጠት ተስፋፋ።",
            details: "ለተለያዩ የእድሜ ቡድኖች የተለያዩ ክፍሎች ተጨመሩ እና በኦርቶዶክስ ትምህርቅች ላይ የተመሰረተ የተዋቀረ ሥርዓተ ትምህርት ተጀመረ።",
          },
          {
            year: 2015,
            title: "የማህበረሰብ ድጋፍ",
            description: "የቤተሰብ ድጋፍ ፕሮግራሞች እና የማህበረሰብ አገልግሎት ተነሳሽነቶች ተጀመሩ።",
            details: "ተልዕኮአችንን ከሰንበት ክፍሎች በላይ ወደ የቤተሰብ ምክር እና የማህበረሰብ ልማት ፕሮግራሞች አስፋፋን።",
          },
          {
            year: 2018,
            title: "የባህል ቅርስ ፕሮግራም",
            description: "ሰፊ የኢትዮጵያ ኦርቶዶክስ ባህል ጥበቃ ፕሮግራሞች ተጀመሩ।",
            details: "ሀብታም ቅርሳችንን ለመጠበቅ ባህላዊ ሙዚቃ፣ የቋንቋ ክፍሎች እና ባህላዊ በዓላት ተጨመሩ።",
          },
          {
            year: 2021,
            title: "ዲጂታል ውህደት",
            description: "ከዲጂታል ሀብቶች እና የመስመር ላይ ክፍሎች ጋር ለዘመናዊ ትምህርት ተላመደ።",
            details: "የማህበረሰብ ትስስራችንን እየጠበቅን በፈታኝ ጊዜያት ወደ ድቅል ትምህርት በተሳካ ሁኔታ ተሸጋገረ።",
          },
          {
            year: 2024,
            title: "አሁን ያለው እድገት",
            description: "አሁን ከ250+ ተማሪዎች ጋር በ18 ቁርጠኛ መምህራን እና እየሰፋ ያሉ መገልገያዎች አገልግሎት እየሰጠ ነው።",
            details: "ለጥራት ኦርቶዶክስ ክርስቲያን ትምህርት እና የማህበረሰብ አገልግሎት ያለንን ቁርጠኝነት እየጠበቅን መበለጸግ እንቀጥላለን።",
          },
        ],
      },
      leadership: {
        title: "የእኛ አመራር እና መምህራን",
        subtitle: "ለመንፈሳዊ ትምህርት የተሰጡ ቁርጠኛ አገልጋዮች",
        members: [
          {
            name: "አቡነ ጴጥሮስ ታደሰ",
            role: "መንፈሳዊ ዳይሬክተር",
            bio: "ከ20+ ዓመታት የኦርቶዶክስ አገልግሎት ልምድ ጋር የመንፈሳዊ ተልዕኮአችንን መሪነት።",
            image: "/placeholder-gj8j8.png",
          },
          {
            name: "አልማዝ በቀለ",
            role: "ዋና መምህር",
            bio: "በልጆች እድገት እና በኦርቶዶክስ ትምህርት ላይ ልዩ እውቀት ያላት የትምህርት አስተባባሪ።",
            image: "/placeholder-454bv.png",
          },
          {
            name: "ዳዊት ግርማ",
            role: "የወጣቶች አገልግሎት መሪ",
            bio: "ወጣቶችን በእምነት እና በማህበረሰብ አገልግሎት ለማሳተፍ ቁርጠኛ።",
            image: "/placeholder-5beyq.png",
          },
          {
            name: "ሐና ወልደ",
            role: "የባህል ቅርስ አስተባባሪ",
            bio: "የኢትዮጵያ ኦርቶዶክስ ወጎች እና ባህሎች መጠበቅ እና ማስተማር።",
            image: "/placeholder-2k1jz.png",
          },
          {
            name: "ተክለ ማርያም",
            role: "የማህበረሰብ ድጋፍ ዳይሬክተር",
            bio: "ቤተሰቦችን ማገናኘት እና የማህበረሰብ ትስስራችንን ማጠናከር።",
            image: "/placeholder-wgxv5.png",
          },
          {
            name: "መሮን አሰፋ",
            role: "የልጆች አገልግሎት አስተባባሪ",
            bio: "በቅድመ ሕፃናት መንፈሳዊ እድገት እና ትምህርት ላይ ልዩ እውቀት።",
            image: "/placeholder-hu2lm.png",
          },
        ],
      },
      philosophy: {
        title: "የእኛ የትምህርት ፍልስፍና",
        subtitle: "ትምህርታችንን እና የማህበረሰብ ሕይወታችንን የሚመሩ ዋና እሴቶች",
        values: [
          {
            title: "በእምነት ላይ የተመሰረተ ትምህርት",
            description: "ሁሉም ትምህርት በኦርቶዶክስ ክርስቲያን እምነት እና በመጽሐፍ ቅዱስ መርሆዎች ላይ የተመሰረተ ነው።",
            icon: Heart,
          },
          {
            title: "የባህል ጥበቃ",
            description: "ሀብታም የኢትዮጵያ ኦርቶዶክስ ቅርስ እና ወጎቻችንን መጠበቅ እና ማክበር።",
            icon: Star,
          },
          {
            title: "የማህበረሰብ አገልግሎት",
            description: "ተማሪዎች ሌሎችን እንዲያገለግሉ እና ለማህበረሰቡ አወንታዊ አስተዋፅኦ እንዲያደርጉ ማስተማር።",
            icon: Users,
          },
          {
            title: "አጠቃላይ እድገት",
            description: "በእያንዳንዱ ልጅ ውስጥ መንፈሳዊ፣ አእምሯዊ፣ ስሜታዊ እና ማህበራዊ እድገትን ማሳደግ።",
            icon: BookOpen,
          },
        ],
      },
      downloads: {
        title: "ሀብቶች እና ማውረጃዎች",
        subtitle: "ለቤተሰቦች አስፈላጊ ሰነዶች እና መረጃዎች",
        items: [
          {
            title: "የክፍል መርሐግብር 2024-2025",
            description: "የሁሉም የሰንበት ት/ቤት ክፍሎች እና እንቅስቃሴዎች ሙሉ መርሐግብር",
            type: "PDF",
          },
          {
            title: "የምዝገባ ቅጽ",
            description: "የአዲስ ተማሪ ምዝገባ እና የመመዝገቢያ መረጃ",
            type: "PDF",
          },
          {
            title: "የልጆች ጥበቃ ፖሊሲ",
            description: "ለልጆች ጥበቃ እና ደህንነት እርምጃዎች ያለን ቁርጠኝነት",
            type: "PDF",
          },
          {
            title: "የወላጆች መመሪያ",
            description: "ለወላጆች እና አሳዳጊዎች ሰፊ መመሪያ",
            type: "PDF",
          },
        ],
      },
    },
  }

  const currentContent = content[currentLang]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-space-grotesk text-balance">
              {currentContent.hero.title}
            </h1>
            <p className="text-xl text-accent mb-4 font-medium">{currentContent.hero.subtitle}</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {currentContent.hero.description}
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-16 font-space-grotesk text-balance">
              {currentContent.mission.title}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="border-2 hover:border-accent/20 transition-colors">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl font-space-grotesk">{currentContent.mission.mission.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {currentContent.mission.mission.text}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent/20 transition-colors">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <Eye className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl font-space-grotesk">{currentContent.mission.vision.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {currentContent.mission.vision.text}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-space-grotesk text-balance">
                {currentContent.history.title}
              </h2>
              <p className="text-xl text-muted-foreground">{currentContent.history.subtitle}</p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-accent/20 h-full hidden lg:block" />

              <div className="space-y-12">
                {currentContent.history.timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    {/* Content Card */}
                    <div className="flex-1 max-w-md">
                      <Card
                        className={`cursor-pointer transition-all duration-300 ${selectedYear === item.year ? "border-accent shadow-lg" : "hover:shadow-md"}`}
                        onClick={() => setSelectedYear(selectedYear === item.year ? null : item.year)}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-accent text-accent-foreground">{item.year}</Badge>
                            <Calendar className="h-5 w-5 text-accent" />
                          </div>
                          <CardTitle className="text-xl font-space-grotesk">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base leading-relaxed mb-4">
                            {item.description}
                          </CardDescription>
                          {selectedYear === item.year && (
                            <div className="mt-4 p-4 bg-accent/5 rounded-lg border-l-4 border-accent">
                              <p className="text-sm text-muted-foreground leading-relaxed">{item.details}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timeline dot */}
                    <div className="hidden lg:flex w-4 h-4 bg-accent rounded-full border-4 border-background shadow-lg z-10" />

                    {/* Spacer for alternating layout */}
                    <div className="flex-1 max-w-md hidden lg:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-space-grotesk text-balance">
                {currentContent.leadership.title}
              </h2>
              <p className="text-xl text-muted-foreground">{currentContent.leadership.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentContent.leadership.members.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <CardTitle className="text-xl font-space-grotesk">{member.name}</CardTitle>
                    <Badge variant="secondary" className="w-fit mx-auto">
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{member.bio}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-space-grotesk text-balance">
                {currentContent.philosophy.title}
              </h2>
              <p className="text-xl text-muted-foreground">{currentContent.philosophy.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentContent.philosophy.values.map((value, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-accent/20"
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="text-lg font-space-grotesk">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Downloads */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-space-grotesk text-balance">
                {currentContent.downloads.title}
              </h2>
              <p className="text-xl text-muted-foreground">{currentContent.downloads.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentContent.downloads.items.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Download className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-space-grotesk">{item.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
