"use client"

import { useState } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Camera, Share2, Download, ChevronLeft, ChevronRight, X, Play, MapPin, Filter } from "lucide-react"

type GalleryCategory = "all" | "church-life" | "sunday-school" | "events" | "heritage"

interface GalleryItem {
  id: number
  category: GalleryCategory
  title: string
  description: string
  image: string
  type: "image" | "video"
  date: string
}

export default function GalleryPage() {
  const [currentLang, setCurrentLang] = useState<"en" | "am">("en")
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>("all")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const content = {
    en: {
      hero: {
        title: "Gallery",
        subtitle: "Moments of faith, community, and celebration",
        description:
          "Explore our vibrant community through photos and videos that capture the spirit of our Sunday school and church life.",
      },
      categories: {
        all: "All",
        "church-life": "Church Life",
        "sunday-school": "Sunday School",
        events: "Events",
        heritage: "Heritage",
      },
      videos: {
        title: "Featured Videos",
        subtitle: "Watch our community in action",
      },
      campus: {
        title: "Church Campus",
        subtitle: "Explore our sacred spaces",
        description: "Take a virtual tour of our beautiful church campus and facilities.",
      },
      lightbox: {
        share: "Share",
        download: "Download",
        close: "Close",
        previous: "Previous",
        next: "Next",
      },
    },
    am: {
      hero: {
        title: "ምስሎች",
        subtitle: "የእምነት፣ የማህበረሰብ እና የበዓል ጊዜያት",
        description: "የሰንበት ት/ቤታችንን እና የቤተክርስቲያን ሕይወትን መንፈስ የሚይዙ ፎቶዎች እና ቪዲዮዎች በኩል ህያው ማህበረሰባችንን ያስሱ።",
      },
      categories: {
        all: "ሁሉም",
        "church-life": "የቤተክርስቲያን ሕይወት",
        "sunday-school": "ሰንበት ት/ቤት",
        events: "ዝግጅቶች",
        heritage: "ቅርስ",
      },
      videos: {
        title: "ተመራጭ ቪዲዮዎች",
        subtitle: "ማህበረሰባችንን በተግባር ይመልከቱ",
      },
      campus: {
        title: "የቤተክርስቲያን ግቢ",
        subtitle: "የእኛን ቅዱስ ቦታዎች ያስሱ",
        description: "የእኛን ውብ የቤተክርስቲያን ግቢ እና መገልገያዎች ምናባዊ ጉብኝት ያድርጉ።",
      },
      lightbox: {
        share: "አጋራ",
        download: "አውርድ",
        close: "ዝጋ",
        previous: "ቀዳሚ",
        next: "ቀጣይ",
      },
    },
  }

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      category: "sunday-school",
      title: "Sunday School Class in Session",
      description: "Children learning about Ethiopian Orthodox traditions",
      image: "/ethiopian-orthodox-sunday-school-children-learning.jpg",
      type: "image",
      date: "December 2024",
    },
    {
      id: 2,
      category: "events",
      title: "Christmas Celebration",
      description: "Annual Christmas program with traditional performances",
      image: "/ethiopian-orthodox-christmas-celebration.jpg",
      type: "image",
      date: "December 2024",
    },
    {
      id: 3,
      category: "church-life",
      title: "Prayer and Worship",
      description: "Community gathering for Sunday worship",
      image: "/ethiopian-orthodox-church-interior-with-candles.jpg",
      type: "image",
      date: "November 2024",
    },
    {
      id: 4,
      category: "events",
      title: "Community Service Day",
      description: "Volunteers helping families in need",
      image: "/ethiopian-community-service-volunteers-helping-fam.jpg",
      type: "image",
      date: "November 2024",
    },
    {
      id: 5,
      category: "heritage",
      title: "Teacher Training Session",
      description: "Preserving Orthodox teaching traditions",
      image: "/ethiopian-orthodox-teachers-in-training-session.jpg",
      type: "image",
      date: "October 2024",
    },
    {
      id: 6,
      category: "events",
      title: "Youth Retreat Activities",
      description: "Young people growing in faith together",
      image: "/ethiopian-orthodox-youth-group-retreat-activities.jpg",
      type: "image",
      date: "October 2024",
    },
  ]

  const videos = [
    {
      id: 1,
      title: "Sunday School Graduation Ceremony",
      description: "Celebrating our students' achievements",
      thumbnail: "/ethiopian-orthodox-sunday-school-children-learning.jpg",
      duration: "15:30",
    },
    {
      id: 2,
      title: "Traditional Ethiopian Orthodox Chanting",
      description: "Beautiful liturgical music from our community",
      thumbnail: "/ethiopian-orthodox-church-interior-with-candles.jpg",
      duration: "8:45",
    },
    {
      id: 3,
      title: "Community Outreach Highlights",
      description: "Making a difference in our neighborhood",
      thumbnail: "/ethiopian-community-service-volunteers-helping-fam.jpg",
      duration: "12:20",
    },
  ]

  const currentContent = content[currentLang]

  const filteredItems =
    selectedCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === selectedCategory)

  const categoryIcons = {
    all: Filter,
    "church-life": Camera,
    "sunday-school": Camera,
    events: Camera,
    heritage: Camera,
  }

  const handleImageClick = (id: number) => {
    setSelectedImage(id)
  }

  const handlePrevious = () => {
    if (selectedImage !== null) {
      const currentIndex = filteredItems.findIndex((item) => item.id === selectedImage)
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1
      setSelectedImage(filteredItems[prevIndex].id)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      const currentIndex = filteredItems.findIndex((item) => item.id === selectedImage)
      const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0
      setSelectedImage(filteredItems[nextIndex].id)
    }
  }

  const selectedItem = selectedImage ? filteredItems.find((item) => item.id === selectedImage) : null

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

        {/* Category Filter */}
        <section className="py-8 bg-muted">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(currentContent.categories).map(([key, label]) => {
                const IconComponent = categoryIcons[key as GalleryCategory]
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "default" : "outline"}
                    onClick={() => setSelectedCategory(key as GalleryCategory)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {label}
                  </Button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
                  onClick={() => handleImageClick(item.id)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-background/90">
                        {currentContent.categories[item.category]}
                      </Badge>
                    </div>
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-accent/90 rounded-full flex items-center justify-center">
                          <Play className="h-8 w-8 text-accent-foreground ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 font-space-grotesk">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Videos */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-space-grotesk text-balance">
                {currentContent.videos.title}
              </h2>
              <p className="text-xl text-muted-foreground">{currentContent.videos.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-accent/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-8 w-8 text-accent-foreground ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 font-space-grotesk">{video.title}</h3>
                    <p className="text-muted-foreground text-sm">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Church Campus Map */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-space-grotesk text-balance">
                {currentContent.campus.title}
              </h2>
              <p className="text-xl text-muted-foreground mb-4">{currentContent.campus.subtitle}</p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{currentContent.campus.description}</p>
            </div>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-2 font-space-grotesk">Interactive Campus Map</h3>
                  <p className="text-muted-foreground">Click to explore our church facilities</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Lightbox Modal */}
        {selectedItem && (
          <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
              <div className="relative w-full h-full bg-black">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                />

                {/* Navigation Controls */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Top Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold mb-2 font-space-grotesk">{selectedItem.title}</h3>
                  <p className="text-white/80 mb-2">{selectedItem.description}</p>
                  <p className="text-white/60 text-sm">{selectedItem.date}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>

      <Footer />
    </div>
  )
}
