"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, DollarSign, BookOpen, User, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function ParentDashboard() {
  const [currentLang, setCurrentLang] = useState<"en" | "am">("en")

  const content = {
    en: {
      title: "Parent Dashboard",
      subtitle: "Welcome back! Here's what's happening with your child's education.",
      tabs: {
        overview: "Overview",
        attendance: "Attendance",
        resources: "Resources",
        payments: "Payments",
      },
      overview: {
        childName: "Meron Tadesse",
        class: "Sunday School",
        teacher: "Teacher Almaz",
        nextClass: "Next Class: Sunday, 9:00 AM",
        stats: {
          attendance: "Attendance Rate",
          assignments: "Completed Assignments",
          participation: "Participation Score",
        },
      },
      attendance: {
        title: "Attendance Record",
        present: "Present",
        absent: "Absent",
        excused: "Excused",
        recent: "Recent Attendance",
      },
      resources: {
        title: "Learning Resources",
        homework: "Homework Assignments",
        materials: "Study Materials",
        announcements: "Class Announcements",
      },
      payments: {
        title: "Payment Information",
        balance: "Current Balance",
        history: "Payment History",
        makePayment: "Make Payment",
      },
    },
    am: {
      title: "የወላጅ ዳሽቦርድ",
      subtitle: "እንኳን ደህና መጡ! በልጅዎ ትምህርት ላይ የሚከሰተው ነገር ይህ ነው።",
      tabs: {
        overview: "አጠቃላይ እይታ",
        attendance: "ተገኝነት",
        resources: "ሀብቶች",
        payments: "ክፍያዎች",
      },
      overview: {
        childName: "መሮን ታደሰ",
        class: "ክፍል 5 - ሰንበት ት/ቤት",
        teacher: "መምህር አልማዝ",
        nextClass: "ቀጣይ ክፍል፡ እሁድ፣ 9:00 ጠዋት",
        stats: {
          attendance: "የተገኝነት መጠን",
          assignments: "የተጠናቀቁ ተግባራት",
          participation: "የተሳትፎ ነጥብ",
        },
      },
      attendance: {
        title: "የተገኝነት መዝገብ",
        present: "ተገኝቷል",
        absent: "ተቀርቷል",
        excused: "ተሰናብቷል",
        recent: "የቅርብ ጊዜ ተገኝነት",
      },
      resources: {
        title: "የትምህርት ሀብቶች",
        homework: "የቤት ስራ ተግባራት",
        materials: "የጥናት ቁሳቁሶች",
        announcements: "የክፍል ማስታወቂያዎች",
      },
      payments: {
        title: "የክፍያ መረጃ",
        balance: "አሁን ያለ ቀሪ",
        history: "የክፍያ ታሪክ",
        makePayment: "ክፍያ ያድርጉ",
      },
    },
  }

  const currentContent = content[currentLang]

  const attendanceData = [
    { date: "Dec 8, 2024", status: "present" },
    { date: "Dec 1, 2024", status: "present" },
    { date: "Nov 24, 2024", status: "absent" },
    { date: "Nov 17, 2024", status: "present" },
    { date: "Nov 10, 2024", status: "present" },
  ]

  const resources = [
    {
      title: "Ethiopian Orthodox History - Chapter 3",
      type: "homework",
      dueDate: "Dec 15, 2024",
      status: "pending",
    },
    {
      title: "Traditional Songs Practice",
      type: "materials",
      dueDate: "Dec 12, 2024",
      status: "completed",
    },
    {
      title: "Christmas Program Preparation",
      type: "announcements",
      dueDate: "Dec 10, 2024",
      status: "new",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2 font-space-grotesk">{currentContent.title}</h1>
            <p className="text-muted-foreground">{currentContent.subtitle}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {currentContent.overview.stats.attendance}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">92%</div>
                <Progress value={92} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {currentContent.overview.stats.assignments}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">8/10</div>
                <Progress value={80} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {currentContent.overview.stats.participation}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">95%</div>
                <Progress value={95} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {currentContent.payments.balance}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">$0.00</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Paid Up
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{currentContent.tabs.overview}</TabsTrigger>
              <TabsTrigger value="attendance">{currentContent.tabs.attendance}</TabsTrigger>
              <TabsTrigger value="resources">{currentContent.tabs.resources}</TabsTrigger>
              <TabsTrigger value="payments">{currentContent.tabs.payments}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Student Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Student Name</p>
                      <p className="font-semibold">{currentContent.overview.childName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-semibold">{currentContent.overview.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teacher</p>
                      <p className="font-semibold">{currentContent.overview.teacher}</p>
                    </div>
                    <div className="flex items-center gap-2 text-accent">
                      <Clock className="h-4 w-4" />
                      <p className="text-sm font-medium">{currentContent.overview.nextClass}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {currentContent.attendance.recent}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {attendanceData.slice(0, 5).map((record, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{record.date}</span>
                          <Badge
                            variant={record.status === "present" ? "default" : "secondary"}
                            className={
                              record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {record.status === "present"
                              ? currentContent.attendance.present
                              : currentContent.attendance.absent}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.attendance.title}</CardTitle>
                  <CardDescription>Complete attendance history for the current academic year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attendanceData.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {record.status === "present" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-medium">{record.date}</span>
                        </div>
                        <Badge
                          variant={record.status === "present" ? "default" : "secondary"}
                          className={
                            record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {record.status === "present"
                            ? currentContent.attendance.present
                            : currentContent.attendance.absent}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.resources.title}</CardTitle>
                  <CardDescription>Access homework, study materials, and class announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-sm text-muted-foreground">Due: {resource.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={resource.status === "completed" ? "default" : "secondary"}
                            className={
                              resource.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : resource.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }
                          >
                            {resource.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      {currentContent.payments.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">$0.00</div>
                      <p className="text-green-800">All payments are up to date!</p>
                    </div>
                    <Button className="w-full">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {currentContent.payments.makePayment}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{currentContent.payments.history}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Registration Fee</p>
                          <p className="text-sm text-muted-foreground">Nov 1, 2024</p>
                        </div>
                        <span className="font-semibold text-green-600">$50.00</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Materials Fee</p>
                          <p className="text-sm text-muted-foreground">Sep 15, 2024</p>
                        </div>
                        <span className="font-semibold text-green-600">$25.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer currentLang={currentLang} />
    </div>
  )
}
