"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Key } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function ChangePasswordCard() {
    const router = useRouter()
    const { t, language } = useLanguage()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            alert(language === "am" ? "አዲሶቹ የይለፍ ቃላት አይዛመዱም!" : "New passwords do not match!")
            return
        }

        if (newPassword.length < 6) {
            alert(language === "am" ? "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት" : "Password must be at least 6 characters")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            })

            const data = await res.json()

            if (res.ok) {
                alert(language === "am" ? "የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል! እባክዎ እንደገና ይግቡ።" : "Password changed successfully! Please log in again.")
                router.push("/api/auth/signout")
            } else {
                alert(data.error || (language === "am" ? "የይለፍ ቃል መቀየር አልተሳካም" : "Failed to change password"))
            }
        } catch (error) {
            console.error(error)
            alert(language === "am" ? "የይለፍ ቃል ሲቀየር ስህተት አጋጥሟል" : "Error changing password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-[#C5A880]/15 hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0B1B3D] dark:text-[#C5A880]">
                    <Key className="h-5 w-5 text-[#C5A880]" />
                    {t("common.changePassword")}
                </CardTitle>
                <CardDescription>{t("changePassword.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current">{t("changePassword.current")}</Label>
                        <Input
                            id="current"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new">{t("changePassword.new")}</Label>
                            <Input
                                id="new"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">{t("changePassword.confirm")}</Label>
                            <Input
                                id="confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-[#0B1B3D] hover:bg-[#122754] text-white dark:bg-[#C5A880] dark:hover:bg-[#b59871] dark:text-[#0B1B3D] transition hover:scale-[1.01]" disabled={loading}>
                        {loading ? t("changePassword.updating") : t("changePassword.update")}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
