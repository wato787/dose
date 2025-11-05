import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/PasswordInput"
import { useSignUp } from "./useSignUp"

export const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")

  const passwordsMatch = password === confirmPassword && password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasMinLength = password.length >= 8

  const {mutate:signup,isPending,error} = useSignUp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordsMatch) return

    signup({
      name,
      email,
      password,
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground text-balance">アカウント作成</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">お名前</Label>
            <Input
              id="name"
              type="text"
              placeholder="山田太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Password Checklist */}
            <div className="space-y-1 mt-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    hasMinLength ? "bg-primary" : "bg-muted"
                  }`}
                >
                  {hasMinLength && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="text-xs text-muted-foreground">8文字以上</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    hasUpperCase ? "bg-primary" : "bg-muted"
                  }`}
                >
                  {hasUpperCase && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="text-xs text-muted-foreground">大文字を含む</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    hasNumber ? "bg-primary" : "bg-muted"
                  }`}
                >
                  {hasNumber && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="text-xs text-muted-foreground">数字を含む</span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード確認</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={confirmPassword && !passwordsMatch ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {confirmPassword && !passwordsMatch && <p className="text-xs text-destructive">パスワードが一致しません</p>}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error.message}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" disabled={isPending || !passwordsMatch} className="w-full mt-6">
            {isPending ? "アカウント作成中..." : "サインアップ"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-background text-muted-foreground">または</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            既にアカウントをお持ちですか？{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary/90 transition-colors">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
