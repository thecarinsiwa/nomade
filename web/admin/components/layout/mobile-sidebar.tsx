"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UserCircle,
  MapPin,
  CreditCard,
  Shield,
  FileText,
  Key,
  Gift,
  Coins,
  Award,
  Receipt,
  Tag,
  Building,
  Plane,
  Car,
  Ship,
  Activity,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  History,
  DollarSign,
  RotateCcw,
  Star,
  Map,
  Bell,
  Headphones,
  Settings,
  Globe,
  Languages,
  BarChart3,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface MenuItem {
  title: string
  href?: string
  icon: React.ElementType
  children?: MenuItem[]
}

const menuSections: MenuItem[] = [
  {
    title: "Users & Authentication",
    icon: Users,
    children: [
      { title: "Users", href: "/users", icon: Users },
      { title: "Profiles", href: "/users/profiles", icon: UserCircle },
      { title: "Addresses", href: "/users/addresses", icon: MapPin },
      { title: "Payment Methods", href: "/users/payment-methods", icon: CreditCard },
      { title: "Sessions", href: "/users/sessions", icon: Shield },
      { title: "Security Logs", href: "/users/security-logs", icon: FileText },
    ],
  },
  {
    title: "Loyalty (OneKey)",
    icon: Gift,
    children: [
      { title: "Accounts", href: "/loyalty/accounts", icon: Key },
      { title: "Points", href: "/loyalty/points", icon: Coins },
      { title: "Rewards", href: "/loyalty/rewards", icon: Award },
      { title: "Loyalty Transactions", href: "/loyalty/transactions", icon: Receipt },
      { title: "Promotions", href: "/loyalty/promotions", icon: Tag },
    ],
  },
  {
    title: "Travel Products",
    icon: Package,
    children: [
      { title: "Accommodations", href: "/products/accommodations", icon: Building },
      { title: "Flights", href: "/products/flights", icon: Plane },
      { title: "Car Rentals", href: "/products/car-rentals", icon: Car },
      { title: "Cruises", href: "/products/cruises", icon: Ship },
      { title: "Activities", href: "/products/activities", icon: Activity },
      { title: "Packages", href: "/products/packages", icon: Package },
    ],
  },
  {
    title: "Bookings",
    icon: Calendar,
    children: [
      { title: "All Bookings", href: "/bookings", icon: Calendar },
      { title: "Booking Status", href: "/bookings/status", icon: CheckCircle },
      { title: "Cancellations", href: "/bookings/cancellations", icon: XCircle },
      { title: "History", href: "/bookings/history", icon: History },
    ],
  },
  {
    title: "Payments",
    icon: DollarSign,
    children: [
      { title: "Transactions", href: "/payments/transactions", icon: DollarSign },
      { title: "Refunds", href: "/payments/refunds", icon: RotateCcw },
    ],
  },
  {
    title: "Content & Customer Care",
    icon: Headphones,
    children: [
      { title: "Reviews", href: "/content/reviews", icon: Star },
      { title: "Destinations", href: "/content/destinations", icon: Map },
      { title: "Notifications", href: "/content/notifications", icon: Bell },
      { title: "Support Tickets", href: "/content/support", icon: Headphones },
    ],
  },
  {
    title: "System & Analytics",
    icon: Settings,
    children: [
      { title: "System Config", href: "/system/config", icon: Settings },
      { title: "Currencies", href: "/system/currencies", icon: DollarSign },
      { title: "Languages", href: "/system/languages", icon: Languages },
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
]

interface MobileSidebarItemProps {
  item: MenuItem
  pathname: string
  level?: number
  onLinkClick?: () => void
}

function MobileSidebarItem({ item, pathname, level = 0, onLinkClick }: MobileSidebarItemProps) {
  const [isOpen, setIsOpen] = useState(
    item.children?.some((child) => pathname.startsWith(child.href || "")) || false
  )

  const hasChildren = item.children && item.children.length > 0
  const Icon = item.icon
  const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between font-normal",
              level > 0 && "pl-8",
              isActive && "bg-accent"
            )}
          >
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.children.map((child) => (
            <MobileSidebarItem
              key={child.title}
              item={child}
              pathname={pathname}
              level={level + 1}
              onLinkClick={onLinkClick}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Link href={item.href || "#"} onClick={onLinkClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start font-normal",
          level > 0 && "pl-8",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        {item.title}
      </Button>
    </Link>
  )
}

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <Link href="/dashboard" onClick={() => onOpenChange(false)}>
            <Button
              variant={pathname === "/dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <div className="pt-4 space-y-1">
            {menuSections.map((section) => (
              <MobileSidebarItem
                key={section.title}
                item={section}
                pathname={pathname}
                onLinkClick={() => onOpenChange(false)}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

