"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LogOut,
  ChevronUp,
  Blocks,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "@/app/auth/signout/actions"

const mainNav = [
  {
    title: "Home",
    url: "/protected/home",
    icon: Blocks,
  },
]




interface AppSidebarProps {
  email: string
  name: string
  avatarUrl: string
  plan: string
}

export function AppSidebar({ email, name, avatarUrl, plan }: AppSidebarProps) {
  const pathname = usePathname()
  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/")
  }

  const displayName = name || email
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : email ? email.substring(0, 2).toUpperCase() : "??"

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/protected/home">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-12"
                  >
                    <polygon points="16,4 27,10 16,16 5,10" fill="#8EC5FF" />
                    <polygon points="5,10 16,16 16,28 5,22" fill="#4490F0" />
                    <polygon
                      points="27,10 16,16 16,28 27,22"
                      fill="#2566C5"
                    />
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Build This Now</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Ship in 48h
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>



      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-400 to-purple-300 text-xs font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {displayName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground capitalize">
                      {plan} plan
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/protected/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <form action={signOut} className="w-full">
                    <button type="submit" className="flex w-full items-center gap-2">
                      <LogOut className="size-4" />
                      <span>Log out</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
