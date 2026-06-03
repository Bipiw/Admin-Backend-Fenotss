"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, LogIn, User, AlertCircle, CheckCircle } from "lucide-react"

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginPage() {
  const [currentLang, setCurrentLang] = useState<"en" | "am">("en")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState<"idle" | "success" | "error">("idle")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
    rememberMe: false,
  })

  const content = {
    en: {
      hero: {
        title: "Welcome Back",
        subtitle: "Sign in to your account",
        description: "Access your personalized dashboard and stay connected with our community.",
      },
      form: {
        title: "Sign In",
        email: "Email Address",
        password: "Password",
        role: "Account Type",
        rememberMe: "Remember me",
        signIn: "Sign In",
        signingIn: "Signing in...",
        forgotPassword: "Forgot your password?",
        noAccount: "Don't have an account?",
        createAccount: "Contact us to create one",
      },
      roles: {
        MEMBER: "Member Portal",
        EDUCATION: "Education Portal",
        FINANCE: "Finance Portal",
        MEMBERS_AFFAIRS: "Members Affairs Portal",
        SUPER_ADMIN: "Administrator Portal",
      },
      roleDescriptions: {
        MEMBER: "Access personal records and resources",
        EDUCATION: "Manage academic records and classes",
        FINANCE: "Manage transactions and financial records",
        MEMBERS_AFFAIRS: "Manage attendance and member services",
        SUPER_ADMIN: "Full system administration access",
      },
      socialLogin: {
        title: "Or continue with",
        google: "Continue with Google",
        facebook: "Continue with Facebook",
      },
      forgotPassword: {
        title: "Reset Password",
        description: "Enter your email address and we'll send you a link to reset your password.",
        email: "Email Address",
        send: "Send Reset Link",
        backToLogin: "Back to Sign In",
        success: "Password reset link sent to your email.",
      },
      errors: {
        invalidCredentials: "Invalid email or password. Please try again.",
        networkError: "Network error. Please check your connection and try again.",
        accountLocked: "Account temporarily locked. Please contact support.",
      },
      success: {
        loginSuccess: "Login successful! Redirecting to your dashboard...",
      },
    },
    am: {
      hero: {
        title: "እንኳን ደህና መጡ",
        subtitle: "ወደ መለያዎ ይግቡ",
        description: "የተበጀ ዳሽቦርድዎን ያግኙ እና ከማህበረሰባችን ጋር ተገናኙ።",
      },
      form: {
        title: "ግባ",
        email: "የኢሜል አድራሻ",
        password: "የይለፍ ቃል",
        role: "የመለያ አይነት",
        rememberMe: "አስታውሰኝ",
        signIn: "ግባ",
        signingIn: "እየገባ...",
        forgotPassword: "የይለፍ ቃልዎን ረሱት?",
        noAccount: "መለያ የለዎትም?",
        createAccount: "አንድ ለመፍጠር ያግኙን",
      },
      roles: {
        MEMBER: "የወላጅ/ተማሪ ፖርታል",
        EDUCATION: "የትምህርት ክፍል",
        FINANCE: "የፋይናንስ ክፍል",
        MEMBERS_AFFAIRS: "የአባላት ጉዳይ",
        SUPER_ADMIN: "የአስተዳዳሪ ፖርታል",
      },
      roleDescriptions: {
        MEMBER: "መረጃዎችን እና መርጃዎችን ይመልከቱ",
        EDUCATION: "የትምህርት መዝገቦችን ያስተዳድሩ",
        FINANCE: "የፋይናንስ መዝገቦችን ያስተዳድሩ",
        MEMBERS_AFFAIRS: "ተገኝነትን እና የአባላት አገልግሎቶችን ያስተዳድሩ",
        SUPER_ADMIN: "ሙሉ የስርዓት አስተዳደር መዳረሻ",
      },
      socialLogin: {
        title: "ወይም ይቀጥሉ በ",
        google: "በGoogle ይቀጥሉ",
        facebook: "በFacebook ይቀጥሉ",
      },
      forgotPassword: {
        title: "የይለፍ ቃል ዳግም አስጀምር",
        description: "የኢሜል አድራሻዎን ያስገቡ እና የይለፍ ቃልዎን ዳግም ለማስጀመር አገናኝ እንልክልዎታለን።",
        email: "የኢሜል አድራሻ",
        send: "የዳግም ማስጀመሪያ አገናኝ ላክ",
        backToLogin: "ወደ መግቢያ ተመለስ",
        success: "የይለፍ ቃል ዳግም ማስጀመሪያ አገናኝ ወደ ኢሜልዎ ተልኳል።",
      },
      errors: {
        invalidCredentials: "ልክ ያልሆነ ኢሜል ወይም የይለፍ ቃል። እባክዎ እንደገና ይሞክሩ።",
        networkError: "የአውታረ መረብ ስህተት። ግንኙነትዎን ይፈትሹ እና እንደገና ይሞክሩ።",
        accountLocked: "መለያ ለጊዜው ተዘግቷል። እባክዎ ድጋፍን ያግኙ።",
      },
      success: {
        loginSuccess: "መግቢያ ተሳክቷል! ወደ ዳሽቦርድዎ እየተዛወረ...",
      },
    },
  }

  const currentContent = content[currentLang]



  const handleInputChange = (field: keyof LoginForm, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginStatus("idle")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        setLoginStatus("error")
        setIsLoading(false)
      } else {
        setLoginStatus("success")
        // Redirect to dashboard router, which will handle role-based routing
        window.location.href = "/dashboard"
      }
    } catch (error) {
      setLoginStatus("error")
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setLoginStatus("success")
      setTimeout(() => {
        setShowForgotPassword(false)
        setLoginStatus("idle")
      }, 2000)
    } catch (error) {
      setLoginStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would redirect to OAuth provider
    console.log(`Social login with ${provider}`)
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-space-grotesk">{currentContent.forgotPassword.title}</CardTitle>
              <CardDescription className="text-base">{currentContent.forgotPassword.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">{currentContent.forgotPassword.email}</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                {loginStatus === "success" && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {currentContent.forgotPassword.success}
                    </AlertDescription>
                  </Alert>
                )}

                {loginStatus === "error" && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{currentContent.errors.networkError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? currentContent.form.signingIn : currentContent.forgotPassword.send}
                  </Button>

                  <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgotPassword(false)}>
                    {currentContent.forgotPassword.backToLogin}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-200px)]">
          {/* Left Side - Hero */}
          <div className="relative bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-8">
            <div className="absolute inset-0 opacity-20">
              <Image src="/images/church-hero.png" alt="Church Background" fill className="object-cover" />
            </div>
            <div className="relative z-10 text-center text-white max-w-md">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-accent" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk text-balance">
                {currentContent.hero.title}
              </h1>
              <p className="text-xl mb-4 text-accent font-medium">{currentContent.hero.subtitle}</p>
              <p className="text-white/90 leading-relaxed">{currentContent.hero.description}</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center p-8">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-space-grotesk">{currentContent.form.title}</CardTitle>
                <CardDescription className="text-base">{currentContent.hero.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">{currentContent.form.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">{currentContent.form.password}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      {currentContent.form.rememberMe}
                    </Label>
                  </div>

                  {/* Status Messages */}
                  {loginStatus === "success" && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {currentContent.success.loginSuccess}
                      </AlertDescription>
                    </Alert>
                  )}

                  {loginStatus === "error" && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {currentContent.errors.invalidCredentials}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        {currentContent.form.signingIn}
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        {currentContent.form.signIn}
                      </>
                    )}
                  </Button>

                  {/* Forgot Password */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      {currentContent.form.forgotPassword}
                    </Button>
                  </div>
                </form>

                {/* Social Login */}
                <div className="mt-6">
                  <Separator className="my-4" />
                  <p className="text-center text-sm text-muted-foreground mb-4">{currentContent.socialLogin.title}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => handleSocialLogin("google")} className="w-full">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" onClick={() => handleSocialLogin("facebook")} className="w-full">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>

                {/* Create Account */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {currentContent.form.noAccount}{" "}
                    <Link href="/contact" className="text-accent hover:underline font-medium">
                      {currentContent.form.createAccount}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
