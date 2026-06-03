"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, Filter, Play, Mail, ArrowRight, BookOpen, Megaphone, Users } from "lucide-react"

type NewsCategory = "all" | "announcements" | "sermons" | "events" | "community"

export default function NewsPage() {
  const [currentLang, setCurrentLang] = useState<"en" | "am">("en")
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("all")
  const [email, setEmail] = useState("")

  const content = {
    en: {
      hero: {
        title: "News & Updates",
        subtitle: "Stay connected with our community",
        description:
          "Discover the latest news, announcements, sermons, and community events from Fnote Selam Sunday School.",
      },
      categories: {
        all: "All",
        announcements: "Announcements",
        sermons: "Sermons",
        events: "Events",
        community: "Community",
      },
      featured: {
        title: "Featured Sermon",
        subtitle: "Latest spiritual teaching from our community",
        sermon: {
          title: "Walking in Faith: Lessons from Ethiopian Orthodox Tradition",
          speaker: "Abune Petros Tadesse",
          date: "December 8, 2024",
          duration: "45 minutes",
          description:
            "A powerful message about strengthening our faith through the rich traditions of Ethiopian Orthodox Christianity, exploring how ancient wisdom guides modern living.",
        },
      },
      newsletter: {
        title: "Stay Updated",
        subtitle: "Subscribe to our newsletter",
        description: "Get the latest news, events, and spiritual insights delivered to your inbox.",
        placeholder: "Enter your email address",
        button: "Subscribe Now",
      },
      news: [
        {
          id: 1,
          category: "announcements",
          title: "New Sunday School Year Registration Open",
          excerpt:
            "Registration for the 2024-2025 Sunday School year is now open. Join our growing community of faith and learning.",
          date: "December 10, 2024",
          author: "Almaz Bekele",
          readTime: "3 min read",
          image: "/ethiopian-orthodox-sunday-school-children-learning.jpg",
        },
        {
          id: 2,
          category: "events",
          title: "Christmas Celebration Program",
          excerpt:
            "Join us for our annual Christmas celebration featuring traditional Ethiopian Orthodox songs, performances, and community fellowship.",
          date: "December 9, 2024",
          author: "Dawit Girma",
          readTime: "2 min read",
          image: "/ethiopian-orthodox-christmas-celebration.jpg",
        },
        {
          id: 3,
          category: "sermons",
          title: "The Light of Christ in Our Daily Lives",
          excerpt:
            "Exploring how the teachings of Christ illuminate our path in modern times, drawing from Ethiopian Orthodox spiritual traditions.",
          date: "December 7, 2024",
          author: "Abune Petros Tadesse",
          readTime: "5 min read",
          image: "/ethiopian-orthodox-church-interior-with-candles.jpg",
        },
        {
          id: 4,
          category: "community",
          title: "Community Outreach Success Story",
          excerpt:
            "Our recent community service initiative helped 50 families in need, demonstrating the power of faith in action.",
          date: "December 5, 2024",
          author: "Tekle Mariam",
          readTime: "4 min read",
          image: "/ethiopian-community-service-volunteers-helping-fam.jpg",
        },
        {
          id: 5,
          category: "announcements",
          title: "New Teacher Training Program Launched",
          excerpt:
            "We're expanding our teaching capacity with a comprehensive training program for new Sunday School instructors.",
          date: "December 3, 2024",
          author: "Hanna Wolde",
          readTime: "3 min read",
          image: "/ethiopian-orthodox-teachers-in-training-session.jpg",
        },
        {
          id: 6,
          category: "events",
          title: "Youth Ministry Winter Retreat",
          excerpt:
            "Our youth will gather for a special winter retreat focusing on spiritual growth and community building.",
          date: "December 1, 2024",
          author: "Meron Assefa",
          readTime: "2 min read",
          image: "/ethiopian-orthodox-youth-group-retreat-activities.jpg",
        },
      ],
    },
    am: {
      hero: {
        title: "ዜናዎች እና ዝማኔዎች",
        subtitle: "ከማህበረሰባችን ጋር ተገናኙ",
        description: "ከፍኖተ ሰላም ሰንበት ት/ቤት የቅርብ ጊዜ ዜናዎች፣ ማስታወቂያዎች፣ ስብከቶች እና የማህበረሰብ ዝግጅቶች ያግኙ።",
      },
      categories: {
        all: "ሁሉም",
        announcements: "ማስታወቂያዎች",
        sermons: "ስብከቶች",
        events: "ዝግጅቶች",
        community: "ማህበረሰብ",
      },
      featured: {
        title: "ተመራጭ ስብከት",
        subtitle: "ከማህበረሰባችን የቅርብ ጊዜ መንፈሳዊ ትምህርት",
        sermon: {
          title: "በእምነት መራመድ፡ ከኢትዮጵያ ኦርቶዶክስ ወግ ትምህርቶች",
          speaker: "አቡነ ጴጥሮስ ታደሰ",
          date: "ታህሳስ 8፣ 2024",
          duration: "45 ደቂቃዎች",
          description:
            "በኢትዮጵያ ኦርቶዶክስ ክርስትና ሀብታም ወጎች እምነታችንን ስለማጠናከር ኃይለኛ መልዕክት፣ የጥንት ጥበብ ዘመናዊ ሕይወትን እንዴት እንደሚመራ መመርመር።",
        },
      },
      newsletter: {
        title: "ዝማኔ ያግኙ",
        subtitle: "ለዜና መልዕክታችን ይመዝገቡ",
        description: "የቅርብ ጊዜ ዜናዎች፣ ዝግጅቶች እና መንፈሳዊ ግንዛቤዎች ወደ ኢሜልዎ እንዲደርሱ ያድርጉ።",
        placeholder: "የኢሜል አድራሻዎን ያስገቡ",
        button: "አሁን ይመዝገቡ",
      },
      news: [
        {
          id: 1,
          category: "announcements",
          title: "የአዲስ ሰንበት ት/ቤት ዓመት ምዝገባ ተከፈተ",
          excerpt: "ለ2024-2025 የሰንበት ት/ቤት ዓመት ምዝገባ አሁን ተከፍቷል። እያደገ ያለውን የእምነት እና የትምህርት ማህበረሰባችንን ይቀላቀሉ።",
          date: "ታህሳስ 10፣ 2024",
          author: "አልማዝ በቀለ",
          readTime: "3 ደቂቃ ንባብ",
          image: "/ethiopian-orthodox-sunday-school-children-learning.jpg",
        },
        {
          id: 2,
          category: "events",
          title: "የገና በዓል ፕሮግራም",
          excerpt: "ባህላዊ የኢትዮጵያ ኦርቶዶክስ ዘፈኖች፣ ትርኢቶች እና የማህበረሰብ ወዳጅነት ያለው ዓመታዊ የገና በዓላችን ይቀላቀሉን።",
          date: "ታህሳስ 9፣ 2024",
          author: "ዳዊት ግርማ",
          readTime: "2 ደቂቃ ንባብ",
          image: "/ethiopian-orthodox-christmas-celebration.jpg",
        },
        {
          id: 3,
          category: "sermons",
          title: "በዕለታዊ ሕይወታችን ውስጥ የክርስቶስ ብርሃን",
          excerpt: "የክርስቶስ ትምህርቶች በዘመናዊ ጊዜ መንገዳችንን እንዴት እንደሚያበሩ፣ ከኢትዮጵያ ኦርቶዶክስ መንፈሳዊ ወጎች መመርመር።",
          date: "ታህሳስ 7፣ 2024",
          author: "አቡነ ጴጥሮስ ታደሰ",
          readTime: "5 ደቂቃ ንባብ",
          image: "/ethiopian-orthodox-church-interior-with-candles.jpg",
        },
        {
          id: 4,
          category: "community",
          title: "የማህበረሰብ ድጋፍ የስኬት ታሪክ",
          excerpt: "የቅርብ ጊዜ የማህበረሰብ አገልግሎት ተነሳሽነታችን 50 ቤተሰቦችን በፍላጎት ረድቷል፣ የእምነትን ኃይል በተግባር አሳይቷል።",
          date: "ታህሳስ 5፣ 2024",
          author: "ተክለ ማርያም",
          readTime: "4 ደቂቃ ንባብ",
          image: "/ethiopian-community-service-volunteers-helping-fam.jpg",
        },
        {
          id: 5,
          category: "announcements",
          title: "አዲስ የመምህር ስልጠና ፕሮግራም ተጀመረ",
          excerpt: "ለአዲስ የሰንበት ት/ቤት አስተማሪዎች ሰፊ ስልጠና ፕሮግራም በማዘጋጀት የማስተማር አቅማችንን እያስፋፋን ነው።",
          date: "ታህሳስ 3፣ 2024",
          author: "ሐና ወልደ",
          readTime: "3 ደቂቃ ንባብ",
          image: "/ethiopian-orthodox-teachers-in-training-session.jpg",
        },
        {
          id: 6,
          category: "events",
          title: "የወጣቶች አገልግሎት የክረምት ማፈግፈግ",
          excerpt: "ወጣቶቻችን በመንፈሳዊ እድገት እና በማህበረሰብ ግንባታ ላይ ያተኮረ ልዩ የክረምት ማፈግፈግ ይሰበሰባሉ።",
          date: "ታህሳስ 1፣ 2024",
          author: "መሮን አሰፋ",
          readTime: "2 ደቂቃ ንባብ",
          image: "/ethiopian-orthodox-youth-group-retreat-activities.jpg",
        },
      ],
    },
  }

  const currentContent = content[currentLang]

  const categoryIcons = {
    all: Filter,
    announcements: Megaphone,
    sermons: BookOpen,
    events: Calendar,
    community: Users,
  }

  const filteredNews =
    selectedCategory === "all"
      ? currentContent.news
      : currentContent.news.filter((item) => item.category === selectedCategory)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentLang={currentLang} onLanguageChange={setCurrentLang} />

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

        {/* Featured Sermon */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-space-grotesk text-balance">
                {currentContent.featured.title}
              </h2>
              <p className="text-xl text-muted-foreground">{currentContent.featured.subtitle}</p>
            </div>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center relative">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-20 h-20"
                >
                  <Play className="h-8 w-8 ml-1" />
                </Button>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentContent.featured.sermon.duration}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-space-grotesk text-balance">
                  {currentContent.featured.sermon.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {currentContent.featured.sermon.speaker}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {currentContent.featured.sermon.date}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {currentContent.featured.sermon.description}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* News Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {Object.entries(currentContent.categories).map(([key, label]) => {
                const IconComponent = categoryIcons[key as NewsCategory]
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "default" : "outline"}
                    onClick={() => setSelectedCategory(key as NewsCategory)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {label}
                  </Button>
                )
              })}
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article) => (
                <Card
                  key={article.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {currentContent.categories[article.category as NewsCategory]}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-space-grotesk text-balance group-hover:text-accent transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed mb-4">{article.excerpt}</CardDescription>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {article.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk text-balance">
              {currentContent.newsletter.title}
            </h2>
            <p className="text-xl mb-2 text-accent font-medium">{currentContent.newsletter.subtitle}</p>
            <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              {currentContent.newsletter.description}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={currentContent.newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap">
                {currentContent.newsletter.button}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer currentLang={currentLang} />
    </div>
  )
}
