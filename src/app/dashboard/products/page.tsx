/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Package, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { DOMAIN } from "@/lib/constants"
import axios from "axios"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductsWithAll } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
export default function ProductionPage() {
    const [production, setProduction] = useState<ProductsWithAll[]>([])
    const [statusFilter, setStatusFilter] = useState<string>("all")

    useEffect(() => {
        async function fetchProduction() {
            try {
                const res = await axios.get(`${DOMAIN}/api/dashboard/products`)
                setProduction(res.data.data)
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "Failed to fetch production")
            }
        }
        fetchProduction()
    }, [])

    // Map production to display items
    const productionItems = production.map((product) => ({
        id: product.id,
        name: product.title,
        price: product.price,
        discount: product.discount,
        description: product.description,
        status: product.status,
        quantity: product.quantity,
        startDate: product.createdAt, // Replace with actual date if available
        expectedCompletion: "2024-01-25", // Replace with actual date if available
    }))

    // Filter and sort production items
    const filteredItems = productionItems
        .filter((item) => statusFilter === "all" ? true : item.status === statusFilter)
        .sort((a, b) => {
            if (statusFilter !== "all") {
                if (a.status === statusFilter && b.status !== statusFilter) return -1
                if (a.status !== statusFilter && b.status === statusFilter) return 1
            }
            return 0
        })

    // Calculate stats
    const totalFiltered = filteredItems.length
    const inProgressCount = filteredItems.filter(item => item.status === "In Progress").length
    const completedCount = filteredItems.filter(item => item.status === "Completed").length
    const pendingCount = filteredItems.filter(item => item.status === "Pending").length

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Completed": return <CheckCircle className="h-4 w-4 text-green-500" />
            case "In Progress": return <Clock className="h-4 w-4 text-blue-500" />
            case "Pending": return <AlertCircle className="h-4 w-4 text-yellow-500" />
            default: return <Package className="h-4 w-4" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Completed": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
            case "In Progress": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
            case "Pending": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
            default: return <Badge variant="secondary">{status}</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear()
        return `${year}-${month}-${day}`
    }


    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-sm md:text-lg font-semibold">Production Management</h1>

                <div className="ml-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue
                                placeholder="Filter by status"
                                className="text-xl md:text-sm"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-xl md:text-sm">
                                All Status
                            </SelectItem>
                            <SelectItem value="In Progress" className="text-xl md:text-sm">
                                In Progress
                            </SelectItem>
                            <SelectItem value="Completed" className="text-xl md:text-sm">
                                Completed
                            </SelectItem>
                            <SelectItem value="Pending" className="text-xl md:text-sm">
                                Pending
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                <div className="ml-auto">
                    <Link href={"/dashboard/products/new"}>
                        <Button className="text-white text-[12px]">
                            <Plus className="h-4 w-4 md:mr-2 m-0" />
                            <span className="md:block hidden">Create Production</span>
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="flex-1 space-y-4 p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalFiltered}</div>
                            <p className="text-xs text-muted-foreground">
                                {`${totalFiltered} items${statusFilter !== "all" ? ` (${statusFilter})` : ""}`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{inProgressCount}</div>
                            <p className="text-xs text-muted-foreground">{`${inProgressCount} of ${totalFiltered}`}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedCount}</div>
                            <p className="text-xs text-muted-foreground">{`${completedCount} of ${totalFiltered}`}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingCount}</div>
                            <p className="text-xs text-muted-foreground">{`${pendingCount} of ${totalFiltered}`}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Production Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Production Items</CardTitle>
                        <CardDescription>Manage your production pipeline and track progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>Expected Completion</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <ScrollArea className="max-h-[400px] w-full rounded-md border">
                                    {filteredItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(item.status)}
                                                    {item.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{formatDate(item.startDate.toString())}</TableCell>
                                            <TableCell>{item.expectedCompletion}</TableCell>
                                            <TableCell>
                                                <Link href={`/dashboard/products/${item.id}`}>
                                                    <Button variant="outline" size="sm">Edit</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </ScrollArea>

                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
