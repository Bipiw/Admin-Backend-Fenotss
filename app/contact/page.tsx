"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MapPin, Clock, Send, Users, UserPlus, Heart, CheckCircle, AlertCircle } from "lucide-react"

interface ContactForm {
  name: string
  email: string
  phone: string
  language: string
  topic: string
  message: string
}

export default function ContactPage() {
  const [currentLang, setCurrentLang] = useState<"en" | "am">("en")
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    language: "",
    topic: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const content = {
    en: {
      hero: {
        title: "Contact Us",
        subtitle: "We're here to help and answer your questions",
        description: "Reach out to our community and discover how you can be part of our spiritual family.",
        phone: "+251 94 424 7165",
      },
      form: {
        title: "Send Us a Message",
        subtitle: "We'd love to hear from you",
        fields: {
          name: "Full Name",
          email: "Email Address",
          phone: "Phone Number",
          language: "Preferred Language",
          topic: "Topic",
          message: "Your Message",
        },
        languages: {
          english: "English",
          amharic: "Amharic",
          both: "Both Languages",
        },
        topics: {
          general: "General Inquiry",
          volunteer: "Volunteer Opportunities",
          register: "Student Registration",
          donate: "Donations",
          events: "Events & Programs",
        },
        submit: "Send Message",
        submitting: "Sending...",
        success: "Message sent successfully! We'll get back to you soon.",
        error: "Failed to send message. Please try again or call us directly.",
      },
      contact: {
        title: "Get in Touch",
        address: {
          title: "Visit Us",
          line1: "Buraayu D/Selam Medhanie Alem Cathedral",
          line2: "Fnote Selam Sunday School",
          line3: "Buraayu, Oromia, Ethiopia",
        },
        phone: {
          title: "Call Us",
          number: "+251 94 424 7165",
          description: "Available during office hours",
        },
        email: {
          title: "Email Us",
          address: "info@fnotesalam.org",
          description: "We respond within 24 hours",
        },
      },
      schedule: {
        title: "Schedule & Hours",
        subtitle: "When to find us",
        sunday: {
          title: "Sunday School",
          time: "9:00 AM - 12:00 PM",
          description: "Regular Sunday school classes for all ages",
        },
        office: {
          title: "Office Hours",
          time: "Monday - Friday: 9:00 AM - 5:00 PM",
          description: "Administrative and registration services",
        },
        worship: {
          title: "Sunday Worship",
          time: "7:00 AM - 11:00 AM",
          description: "Main Sunday worship service",
        },
      },
      quickLinks: {
        title: "Quick Actions",
        volunteer: {
          title: "Become a Volunteer",
          description: "Join our team of dedicated teachers and helpers",
          button: "Learn More",
        },
        register: {
          title: "Register Your Child",
          description: "Enroll your child in our Sunday school program",
          button: "Start Registration",
        },
        donate: {
          title: "Support Our Mission",
          description: "Help us continue our educational and community work",
          button: "Donate Now",
        },
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "What age groups do you serve?",
            answer:
              "We serve children from ages 3 to 18, with age-appropriate classes and activities for each group. We also have programs for adults and families.",
          },
          {
            question: "Do you provide instruction in Amharic?",
            answer:
              "Yes, we offer bilingual instruction in both English and Amharic to help preserve our Ethiopian Orthodox heritage while ensuring accessibility for all students.",
          },
          {
            question: "What safety measures do you have in place?",
            answer:
              "We have comprehensive child safeguarding policies, background checks for all staff and volunteers, and maintain safe ratios of adults to children in all activities.",
          },
          {
            question: "How can I volunteer or become a teacher?",
            answer:
              "We welcome volunteers! Contact us to learn about our training programs and volunteer opportunities. We provide comprehensive training for all new teachers.",
          },
          {
            question: "Is there a registration fee?",
            answer:
              "We strive to keep our programs accessible to all families. Contact us to discuss registration and any financial assistance that may be available.",
          },
        ],
      },
      map: {
        title: "Find Us",
        description: "Located in the heart of Buraayu, our church is easily accessible by public transportation.",
        directions: "Get Directions",
      },
    },
    am: {
      hero: {
        title: "ያግኙን",
        subtitle: "ለመርዳት እና ጥያቄዎችዎን ለመመለስ እዚህ ነን",
        description: "ማህበረሰባችንን ያግኙ እና የመንፈሳዊ ቤተሰባችን አካል እንዴት መሆን እንደሚችሉ ያግኙ።",
        phone: "+251 94 424 7165",
      },
      form: {
        title: "መልዕክት ይላኩልን",
        subtitle: "ከእርስዎ መስማት እንወዳለን",
        fields: {
          name: "ሙሉ ስም",
          email: "የኢሜል አድራሻ",
          phone: "የስልክ ቁጥር",
          language: "የሚመረጥ ቋንቋ",
          topic: "ርዕስ",
          message: "መልዕክትዎ",
        },
        languages: {
          english: "እንግሊዝኛ",
          amharic: "አማርኛ",
          both: "ሁለቱም ቋንቋዎች",
        },
        topics: {
          general: "አጠቃላይ ጥያቄ",
          volunteer: "የበጎ ፈቃደኝነት እድሎች",
          register: "የተማሪ ምዝገባ",
          donate: "ልገሳዎች",
          events: "ዝግጅቶች እና ፕሮግራሞች",
        },
        submit: "መልዕክት ላክ",
        submitting: "እየላከ...",
        success: "መልዕክት በተሳካ ሁኔታ ተልኳል! በቅርቡ እናገኝዎታለን።",
        error: "መልዕክት መላክ አልተሳካም። እባክዎ እንደገና ይሞክሩ ወይም በቀጥታ ይደውሉልን።",
      },
      contact: {
        title: "ተገናኙ",
        address: {
          title: "ይጎብኙን",
          line1: "የቡራዩ ደ/ሰላም መድኃኔዓለም ካቴድራል",
          line2: "ፍኖተ ሰላም ሰንበት ት/ቤት",
          line3: "ቡራዩ፣ ኦሮሚያ፣ ኢትዮጵያ",
        },
        phone: {
          title: "ይደውሉልን",
          number: "+251 94 424 7165",
          description: "በቢሮ ሰዓት ውስጥ ይገኛል",
        },
        email: {
          title: "ኢሜል ይላኩልን",
          address: "info@fnotesalam.org",
          description: "በ24 ሰዓት ውስጥ እንመልሳለን",
        },
      },
      schedule: {
        title: "መርሐግብር እና ሰዓቶች",
        subtitle: "መቼ እንደሚያገኙን",
        sunday: {
          title: "ሰንበት ት/ቤት",
          time: "9:00 ጠዋት - 12:00 ከሰዓት",
          description: "ለሁሉም ዕድሜ መደበኛ የሰንበት ት/ቤት ክፍሎች",
        },
        office: {
          title: "የቢሮ ሰዓቶች",
          time: "ሰኞ - አርብ፡ 9:00 ጠዋት - 5:00 ከሰዓት",
          description: "አስተዳደራዊ እና የምዝገባ አገልግሎቶች",
        },
        worship: {
          title: "የሰንበት አምልኮ",
          time: "7:00 ጠዋት - 11:00 ጠዋት",
          description: "ዋና የሰንበት አምልኮ አገልግሎት",
        },
      },
      quickLinks: {
        title: "ፈጣን እርምጃዎች",
        volunteer: {
          title: "በጎ ፈቃደኛ ይሁኑ",
          description: "የቁርጠኛ መምህራን እና ረዳቶች ቡድናችንን ይቀላቀሉ",
          button: "የበለጠ ይወቁ",
        },
        register: {
          title: "ልጅዎን ያስመዝግቡ",
          description: "ልጅዎን በሰንበት ት/ቤት ፕሮግራማችን ያስመዝግቡ",
          button: "ምዝገባ ይጀምሩ",
        },
        donate: {
          title: "ተልዕኮአችንን ይደግፉ",
          description: "የትምህርት እና የማህበረሰብ ስራችንን እንድንቀጥል ይርዱን",
          button: "አሁን ይለግሱ",
        },
      },
      faq: {
        title: "በተደጋጋሚ የሚጠየቁ ጥያቄዎች",
        items: [
          {
            question: "ምን ዓይነት የእድሜ ቡድኖችን ታገለግላላችሁ?",
            answer:
              "ከ3 እስከ 18 ዓመት ልጆችን እናገለግላለን፣ ለእያንዳንዱ ቡድን ለእድሜ ተስማሚ ክፍሎች እና እንቅስቃሴዎች አሉን። ለአዋቂዎች እና ቤተሰቦችም ፕሮግራሞች አሉን።",
          },
          {
            question: "በአማርኛ ትምህርት ትሰጣላችሁ?",
            answer:
              "አዎ፣ የኢትዮጵያ ኦርቶዶክስ ቅርሳችንን ለመጠበቅ እና ለሁሉም ተማሪዎች ተደራሽነትን ለማረጋገጥ በእንግሊዝኛ እና በአማርኛ ባለሁለት ቋንቋ ትምህርት እንሰጣለን።",
          },
          {
            question: "ምን ዓይነት የደህንነት እርምጃዎች አላችሁ?",
            answer:
              "ሰፊ የልጆች ጥበቃ ፖሊሲዎች፣ ለሁሉም ሰራተኞች እና በጎ ፈቃደኞች የጀርባ ፍተሻ፣ እና በሁሉም እንቅስቃሴዎች ውስጥ የአዋቂዎች ለልጆች ደህንነቱ የተጠበቀ ሬሾ እንይዛለን።",
          },
          {
            question: "እንዴት በጎ ፈቃደኛ መሆን ወይም መምህር መሆን እችላለሁ?",
            answer: "በጎ ፈቃደኞችን እንቀበላለን! ስለ ስልጠና ፕሮግራሞቻችን እና የበጎ ፈቃደኝነት እድሎች ለመወቅ ያግኙን። ለሁሉም አዲስ መምህራን ሰፊ ስልጠና እንሰጣለን።",
          },
          {
            question: "የምዝገባ ክፍያ አለ?",
            answer: "ፕሮግራሞቻችን ለሁሉም ቤተሰቦች ተደራሽ እንዲሆኑ እንጥራለን። ስለ ምዝገባ እና ሊኖር የሚችል የገንዘብ እርዳታ ለመወያየት ያግኙን።",
          },
        ],
      },
      map: {
        title: "ያግኙን",
        description: "በቡራዩ መሃል የምትገኝ ቤተክርስቲያናችን በህዝብ ማመላለሻ በቀላሉ ተደራሽ ነች።",
        directions: "አቅጣጫ ያግኙ",
      },
    },
  }

  const currentContent = content[currentLang]

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success/error randomly for demo
      if (Math.random() > 0.2) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          phone: "",
          language: "",
          topic: "",
          message: "",
        })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              {currentContent.hero.description}
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Phone className="h-6 w-6 text-accent" />
              <a href={`tel:${currentContent.hero.phone}`} className="hover:text-accent transition-colors">
                {currentContent.hero.phone}
              </a>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-16 font-space-grotesk text-balance">
              {currentContent.contact.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-space-grotesk">{currentContent.contact.address.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-muted-foreground">
                    <p>{currentContent.contact.address.line1}</p>
                    <p>{currentContent.contact.address.line2}</p>
                    <p>{currentContent.contact.address.line3}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-space-grotesk">{currentContent.contact.phone.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`tel:${currentContent.contact.phone.number}`}
                    className="text-lg font-semibold text-primary hover:text-accent transition-colors block mb-2"
                  >
                    {currentContent.contact.phone.number}
                  </a>
                  <p className="text-muted-foreground text-sm">{currentContent.contact.phone.description}</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-space-grotesk">{currentContent.contact.email.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`mailto:${currentContent.contact.email.address}`}
                    className="text-lg font-semibold text-primary hover:text-accent transition-colors block mb-2"
                  >
                    {currentContent.contact.email.address}
                  </a>
                  <p className="text-muted-foreground text-sm">{currentContent.contact.email.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form and Schedule */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-space-grotesk">{currentContent.form.title}</CardTitle>
                  <CardDescription className="text-base">{currentContent.form.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{currentContent.form.fields.name}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{currentContent.form.fields.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{currentContent.form.fields.phone}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">{currentContent.form.fields.language}</Label>
                        <Select
                          value={formData.language}
                          onValueChange={(value) => handleInputChange("language", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">{currentContent.form.languages.english}</SelectItem>
                            <SelectItem value="amharic">{currentContent.form.languages.amharic}</SelectItem>
                            <SelectItem value="both">{currentContent.form.languages.both}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">{currentContent.form.fields.topic}</Label>
                      <Select value={formData.topic} onValueChange={(value) => handleInputChange("topic", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">{currentContent.form.topics.general}</SelectItem>
                          <SelectItem value="volunteer">{currentContent.form.topics.volunteer}</SelectItem>
                          <SelectItem value="register">{currentContent.form.topics.register}</SelectItem>
                          <SelectItem value="donate">{currentContent.form.topics.donate}</SelectItem>
                          <SelectItem value="events">{currentContent.form.topics.events}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{currentContent.form.fields.message}</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                      />
                    </div>

                    {submitStatus === "success" && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                        <p className="text-sm">{currentContent.form.success}</p>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm">{currentContent.form.error}</p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          {currentContent.form.submitting}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {currentContent.form.submit}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Schedule */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-space-grotesk">{currentContent.schedule.title}</CardTitle>
                    <CardDescription className="text-base">{currentContent.schedule.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg font-space-grotesk">
                          {currentContent.schedule.sunday.title}
                        </h4>
                        <p className="text-accent font-medium">{currentContent.schedule.sunday.time}</p>
                        <p className="text-muted-foreground text-sm">{currentContent.schedule.sunday.description}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg font-space-grotesk">
                          {currentContent.schedule.office.title}
                        </h4>
                        <p className="text-accent font-medium">{currentContent.schedule.office.time}</p>
                        <p className="text-muted-foreground text-sm">{currentContent.schedule.office.description}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg font-space-grotesk">
                          {currentContent.schedule.worship.title}
                        </h4>
                        <p className="text-accent font-medium">{currentContent.schedule.worship.time}</p>
                        <p className="text-muted-foreground text-sm">{currentContent.schedule.worship.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-16 font-space-grotesk text-balance">
              {currentContent.quickLinks.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-space-grotesk">
                    {currentContent.quickLinks.volunteer.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    {currentContent.quickLinks.volunteer.description}
                  </CardDescription>
                  <Button className="w-full">{currentContent.quickLinks.volunteer.button}</Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-space-grotesk">
                    {currentContent.quickLinks.register.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    {currentContent.quickLinks.register.description}
                  </CardDescription>
                  <Button className="w-full">{currentContent.quickLinks.register.button}</Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-space-grotesk">{currentContent.quickLinks.donate.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    {currentContent.quickLinks.donate.description}
                  </CardDescription>
                  <Button className="w-full">{currentContent.quickLinks.donate.button}</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-16 font-space-grotesk text-balance">
              {currentContent.faq.title}
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {currentContent.faq.items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Map */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-space-grotesk text-balance">
                {currentContent.map.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{currentContent.map.description}</p>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                {currentContent.map.directions}
              </Button>
            </div>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-2 font-space-grotesk">Interactive Map</h3>
                  <p className="text-muted-foreground">Buraayu D/Selam Medhanie Alem Cathedral</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
