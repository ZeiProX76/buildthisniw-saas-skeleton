"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import {
  User,
  Mail,
  Camera,
  LogOut,
  Pencil,
  Check,
  X,
  Shield,
  FileText,
  ExternalLink,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { signOut } from "@/app/auth/signout/actions"
import { createClient } from "@/lib/supabase/client"
import {
  MOTIVATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  INTEREST_OPTIONS,
  AVATAR_ACCEPT,
} from "@/features/onboarding/constants"
import { compressAvatarImage } from "@/features/_shared/utils"
import { updateNameAction, saveAvatarAction } from "@/features/onboarding/actions"

interface ProfilePageProps {
  initialData: {
    email: string
    name: string
    avatarUrl: string
    plan: string
  }
  profile: {
    full_name: string | null
    avatar_url: string | null
    preference_motivation: string | null
    preference_experience: string | null
    preference_interest: string | null
    onboarding_completed: boolean
    google_name: string | null
  }
}

export function ProfilePage({ initialData, profile }: ProfilePageProps) {
  const router = useRouter()

  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState("")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateNameMutation = useMutation({
    mutationFn: async (name: string) => {
      const [error, data] = await updateNameAction({ fullName: name })
      if (error) throw error
      return data
    },
    onSuccess: async () => {
      setIsEditingName(false)
      const supabase = createClient()
      await supabase.auth.refreshSession()
      router.refresh()
    },
  })

  const saveAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const [error, data] = await saveAvatarAction({ avatarUrl })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      router.refresh()
    },
  })

  const displayName = profile.full_name || initialData.name || initialData.email
  const avatarUrl = profile.avatar_url || initialData.avatarUrl
  const initials = (profile.full_name || initialData.name)
    ? (profile.full_name || initialData.name)
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : initialData.email
      ? initialData.email.substring(0, 2).toUpperCase()
      : "??"

  const motivationLabel = MOTIVATION_OPTIONS.find(
    (o) => o.value === profile.preference_motivation
  )
  const experienceLabel = EXPERIENCE_OPTIONS.find(
    (o) => o.value === profile.preference_experience
  )
  const interestLabel = INTEREST_OPTIONS.find(
    (o) => o.value === profile.preference_interest
  )

  const handleStartEditName = () => {
    setEditName(profile.full_name || initialData.name || "")
    setIsEditingName(true)
  }

  const handleSaveName = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = editName.trim()
    if (!trimmed) return
    updateNameMutation.mutate(trimmed)
  }

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError(null)
    setIsUploadingAvatar(true)

    try {
      // Compress to WebP 512x512 ~500KB
      const result = await compressAvatarImage(file)
      if (!result.success) {
        setAvatarError(result.error)
        setIsUploadingAvatar(false)
        return
      }
      const compressed = result.file

      const supabase = createClient()
      const { data, error: claimsError } = await supabase.auth.getClaims()
      if (claimsError || !data?.claims?.sub) throw new Error("Not authenticated")

      const userId = data.claims.sub as string
      const fileName = `${userId}/avatar.webp`
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressed, { upsert: true, contentType: "image/webp" })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName)

      await saveAvatarMutation.mutateAsync(publicUrl)
      await supabase.auth.refreshSession()
      router.refresh()
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : "Failed to upload avatar"
      )
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Profile</h1>

      {/* Avatar + Name header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="relative group">
          <Avatar className="size-20 rounded-full ring-2 ring-border">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="rounded-full bg-gradient-to-br from-violet-400 to-purple-300 text-lg font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
            aria-label="Change avatar"
          >
            {isUploadingAvatar ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <Camera className="size-5 text-white" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={AVATAR_ACCEPT}
            onChange={handleAvatarChange}
            className="hidden"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 flex-1">
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-lg font-semibold h-9"
                autoFocus
                disabled={updateNameMutation.isPending}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="shrink-0 size-8"
                disabled={
                  updateNameMutation.isPending || !editName.trim()
                }
              >
                <Check className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="shrink-0 size-8"
                onClick={() => setIsEditingName(false)}
                disabled={updateNameMutation.isPending}
              >
                <X className="size-4" />
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold truncate">{displayName}</h2>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 size-7"
                onClick={handleStartEditName}
              >
                <Pencil className="size-3.5" />
              </Button>
            </div>
          )}
          <p className="text-sm text-muted-foreground capitalize mt-0.5">
            {initialData.plan} plan
          </p>
        </div>
      </div>

      {avatarError && (
        <p className="text-sm text-destructive mb-4">{avatarError}</p>
      )}

      {/* Account info */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Account
        </h3>
        <div className="flex items-center gap-3">
          <Mail className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm">{initialData.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <User className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm">
            {profile.full_name || initialData.name || "No name set"}
          </span>
        </div>
      </div>

      {/* Preferences */}
      {(motivationLabel || experienceLabel || interestLabel) && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 mt-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Preferences
          </h3>
          {motivationLabel && (
            <div className="flex items-center gap-3">
              <span className="text-base shrink-0">{motivationLabel.icon}</span>
              <div>
                <p className="text-xs text-muted-foreground">Motivation</p>
                <p className="text-sm">{motivationLabel.label}</p>
              </div>
            </div>
          )}
          {experienceLabel && (
            <div className="flex items-center gap-3">
              <span className="text-base shrink-0">{experienceLabel.icon}</span>
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm">{experienceLabel.label}</p>
              </div>
            </div>
          )}
          {interestLabel && (
            <div className="flex items-center gap-3">
              <span className="text-base shrink-0">{interestLabel.icon}</span>
              <div>
                <p className="text-xs text-muted-foreground">Interest</p>
                <p className="text-sm">{interestLabel.label}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legal links */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3 mt-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Legal
        </h3>
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-sm hover:text-foreground text-muted-foreground transition-colors"
        >
          <FileText className="size-4 shrink-0" />
          <span>Terms of Service</span>
          <ExternalLink className="size-3 ml-auto" />
        </a>
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-sm hover:text-foreground text-muted-foreground transition-colors"
        >
          <Shield className="size-4 shrink-0" />
          <span>Privacy Policy</span>
          <ExternalLink className="size-3 ml-auto" />
        </a>
      </div>

      {/* Logout */}
      <Separator className="my-6" />

      <form action={signOut}>
        <Button
          type="submit"
          variant="outline"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </Button>
      </form>
    </div>
  )
}
