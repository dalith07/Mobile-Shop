import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MessageSquare, Mail, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function MessagesPage() {
    const messages = [
        {
            id: "MSG-001",
            sender: "John Doe",
            email: "john.doe@example.com",
            subject: "Product inquiry",
            status: "Unread",
            priority: "High",
            timestamp: "2024-01-25 10:30 AM",
            preview: "I'm interested in your premium package and would like to know more about...",
        },
        {
            id: "MSG-002",
            sender: "Jane Smith",
            email: "jane.smith@example.com",
            subject: "Support request",
            status: "Read",
            priority: "Medium",
            timestamp: "2024-01-25 09:15 AM",
            preview: "I'm having trouble accessing my dashboard. Could you please help me...",
        },
        {
            id: "MSG-003",
            sender: "Bob Johnson",
            email: "bob.johnson@example.com",
            subject: "Feature request",
            status: "Replied",
            priority: "Low",
            timestamp: "2024-01-24 02:45 PM",
            preview: "Would it be possible to add a dark mode option to the application...",
        },
        {
            id: "MSG-004",
            sender: "Alice Brown",
            email: "alice.brown@example.com",
            subject: "Bug report",
            status: "Unread",
            priority: "High",
            timestamp: "2024-01-24 11:20 AM",
            preview: "I found a bug in the order processing system. When I try to...",
        },
    ]

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Unread":
                return <Mail className="h-4 w-4 text-blue-500" />
            case "Read":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "Replied":
                return <MessageSquare className="h-4 w-4 text-purple-500" />
            default:
                return <Clock className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Unread":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
            case "Read":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
            case "Replied":
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{status}</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "High":
                return <Badge variant="destructive">{priority}</Badge>
            case "Medium":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{priority}</Badge>
            case "Low":
                return <Badge variant="outline">{priority}</Badge>
            default:
                return <Badge variant="secondary">{priority}</Badge>
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-lg font-semibold">Message Center</h1>
                <div className="ml-auto">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Compose
                    </Button>
                </div>
            </header>

            <div className="flex-1 space-y-4 p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">89</div>
                            <p className="text-xs text-muted-foreground">+15% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unread</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">23</div>
                            <p className="text-xs text-muted-foreground">26% of total</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">9% of total</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Replied</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45</div>
                            <p className="text-xs text-muted-foreground">51% of total</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Messages Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>Manage customer inquiries and support requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sender</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Preview</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {messages.map((message) => (
                                    <TableRow key={message.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${message.sender.charAt(0)}`} />
                                                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(message.status)}
                                                        <span className="font-medium">{message.sender}</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{message.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{message.subject}</TableCell>
                                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                                        <TableCell>{getPriorityBadge(message.priority)}</TableCell>
                                        <TableCell>{message.timestamp}</TableCell>
                                        <TableCell className="max-w-xs">
                                            <p className="text-sm text-muted-foreground truncate">{message.preview}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    Reply
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    Archive
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
