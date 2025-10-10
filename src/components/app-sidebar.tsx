"use client"

import type * as React from "react"
import { Package, Users, ShoppingCart, MessageSquare, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                    icon: BarChart3,
                },
            ],
        },
        {
            title: "Management",
            url: "#",
            items: [
                {
                    title: "Products",
                    url: "/dashboard/products",
                    icon: Package,
                },
                {
                    title: "Users",
                    url: "/dashboard/users",
                    icon: Users,
                },
                {
                    title: "Orders",
                    url: "/dashboard/orders",
                    icon: ShoppingCart,
                },
                {
                    title: "Messages",
                    url: "/dashboard/messages",
                    icon: MessageSquare,
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            items: [
                {
                    title: "General",
                    url: "/dashboard/settings",
                    icon: Settings,
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <div className="h-8 w-8 bg-primary rounded-lg"></div>
                    <span className="text-lg font-semibold">Dashboard</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
