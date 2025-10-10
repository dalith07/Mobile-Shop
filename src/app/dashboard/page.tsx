import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, ShoppingCart, MessageSquare, TrendingUp, TrendingDown } from "lucide-react"

export default function DashboardPage() {
    const stats = [
        {
            title: "Total Users",
            value: "2,847",
            change: "+12.5%",
            trend: "up",
            icon: Users,
        },
        {
            title: "Total Orders",
            value: "1,234",
            change: "+8.2%",
            trend: "up",
            icon: ShoppingCart,
        },
        {
            title: "Production Items",
            value: "456",
            change: "-2.1%",
            trend: "down",
            icon: BarChart3,
        },
        {
            title: "Messages",
            value: "89",
            change: "+15.3%",
            trend: "up",
            icon: MessageSquare,
        },
    ]

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-lg font-semibold">Dashboard Overview</h1>
            </header>

            <div className="flex-1 space-y-4 p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    {stat.trend === "up" ? (
                                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                    ) : (
                                        <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                                    )}
                                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                                    <span className="ml-1">from last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest updates from your dashboard</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">New order received</p>
                                    <p className="text-xs text-muted-foreground">Order #1234 - $299.99</p>
                                </div>
                                <Badge variant="secondary">2 min ago</Badge>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">User registered</p>
                                    <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                                </div>
                                <Badge variant="secondary">5 min ago</Badge>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Production update</p>
                                    <p className="text-xs text-muted-foreground">Item #456 status changed</p>
                                </div>
                                <Badge variant="secondary">10 min ago</Badge>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">New message</p>
                                    <p className="text-xs text-muted-foreground">Support ticket #789</p>
                                </div>
                                <Badge variant="secondary">15 min ago</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks and shortcuts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid gap-2">
                                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <p className="text-sm font-medium">Add New User</p>
                                    <p className="text-xs text-muted-foreground">Create a new user account</p>
                                </div>
                                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <p className="text-sm font-medium">Create Order</p>
                                    <p className="text-xs text-muted-foreground">Process a new order</p>
                                </div>
                                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <p className="text-sm font-medium">Update Production</p>
                                    <p className="text-xs text-muted-foreground">Modify production status</p>
                                </div>
                                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <p className="text-sm font-medium">View Messages</p>
                                    <p className="text-xs text-muted-foreground">Check recent messages</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
