"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"

export function UserNav() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-full">
          <Avatar className="h-12 w-12 border-2 border-primary transition-all hover:border-primary/70">
            <AvatarImage 
              src={session.user.image || ""} 
              alt={session.user.name || ""} 
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-lg font-semibold">
              {session.user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2 p-2">
            <p className="text-base font-medium leading-none">{session.user.name}</p>
            <p className="text-sm leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="text-red-600 focus:text-red-600 cursor-pointer p-3"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 