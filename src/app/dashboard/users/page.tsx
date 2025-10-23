import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, UserCheck, UserX, Crown } from "lucide-react"
import { User } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FaClipboardUser } from "react-icons/fa6"
import DeleteUsersButton from "./DeleteUsersButton"

export default async function UsersPage() {
    let userss: User[] = [];
    try {
        userss = await prisma.user.findMany({ include: { profile: true } });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return (
            <div>
                Error: Unable to fetch users. Please check your database connection.
            </div>
        );
    }

    const users = userss.map((user) => ({
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role || "User",
        status: user.status || "Inactive",
        joinDate: user.createdAt?.toISOString().split("T")[0] || "N/A",
        lastLogin: user.updatedAt?.toISOString().replace("T", " ").slice(0, 16) || "N/A",
    }))

    const totalUsers = userss.length;
    const activeUsers = userss.filter(u => u.status === "Active").length;
    const inactiveUsers = userss.filter(u => u.status === "Inactive").length;
    const adminUsers = userss.filter(u => u.role === "Admin").length;

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "Admin":
                return <Crown className="h-4 w-4 text-yellow-500" />
            case "Manager":
                return <UserCheck className="h-4 w-4 text-blue-500" />
            default:
                return <Users className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
            case "Inactive":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "Admin":
                return <Badge variant="destructive">{role}</Badge>
            case "Manager":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{role}</Badge>
            case "User":
                return <Badge variant="secondary">{role}</Badge>
            default:
                return <Badge variant="outline">{role}</Badge>
        }
    }

    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Count users created this month
    const usersThisMonth = userss.filter(u => new Date(u.createdAt) >= oneMonthAgo).length;

    // Count users created before that
    const usersLastMonth = userss.filter(u => {
        const created = new Date(u.createdAt);
        return created < oneMonthAgo && created >= new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth() - 1);
    }).length;

    // Growth formula
    const growthPercentage =
        usersLastMonth === 0
            ? 100
            : Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100);


    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-lg font-semibold">User Management</h1>
                <div className="ml-auto">
                    <Link href={"/dashboard/users/new"}>
                        <Button className="text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="flex-1 space-y-4 p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>

                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {/* <div className="text-2xl font-bold">2,847</div> */}
                            <div className="text-2xl font-bold">{totalUsers}</div>
                            {/* <p className="text-xs text-muted-foreground">+12% from last month</p> */}

                            <p className="text-xs text-muted-foreground">
                                {typeof growthPercentage === "string"
                                    ? `${growthPercentage}% from last month`
                                    : `${growthPercentage >= 0 ? "+" : ""}${growthPercentage}% from last month`}
                            </p>


                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {/* <div className="text-2xl font-bold">2,543</div> */}
                            <div className="text-2xl font-bold">{activeUsers}</div>
                            <p className="text-xs text-muted-foreground">89% of total</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                            <UserX className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {/* <div className="text-2xl font-bold">304</div> */}
                            <div className="text-2xl font-bold">{inactiveUsers}</div>
                            <p className="text-xs text-muted-foreground">11% of total</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Admins</CardTitle>
                            <Crown className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            {/* <div className="text-2xl font-bold">12</div> */}
                            <div className="text-2xl font-bold">{adminUsers}</div>
                            <p className="text-xs text-muted-foreground">0.4% of total</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage user accounts and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="md:block hidden">Join Date</TableHead>
                                    {/* <TableHead>Last Login</TableHead> */}
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`${user.name?.charAt(0) || "/login_light_mode.jpeg"}`} alt="avatar" />                                                    <AvatarFallback className="uppercase">{user.name?.charAt(0)}</AvatarFallback>
                                                    {/* <AvatarImage src={profiles.map.apply(c => c.images)} /> */}
                                                </Avatar>
                                                <div className="flex items-center gap-2">
                                                    {getRoleIcon(user.role)}
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                                        <TableCell className="md:block hidden">{user.joinDate}</TableCell>
                                        {/* <TableCell>{user.lastLogin}</TableCell> */}
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {/* PROFILE SETTING BUTTON */}
                                                <Link href={`/dashboard/users/${user.id}`} >
                                                    <Button variant="outline" size="sm" className="hover:text-green-500" >
                                                        <FaClipboardUser className="w-8 h-8" />
                                                    </Button>
                                                </Link>

                                                {/* DLETE USERS BUTTON */}
                                                <DeleteUsersButton UsersId={user.id} />
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
