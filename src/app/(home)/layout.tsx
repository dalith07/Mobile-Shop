import type React from "react"
import NavBarHeader from "@/components/NavBarHeader"
import { cookies } from "next/headers"
import { verifyTokenFroPage } from "@/lib/verifyToken"
import Footer from "@/components/Footer"
import { OrdersProvider } from "@/lib/orders_context"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const token = (await cookies()).get("jwtToken")?.value || "";
    const payload = verifyTokenFroPage(token);

    return (
        <>
            <NavBarHeader payload={payload!} />
            <OrdersProvider>
                {children}
            </OrdersProvider>

            <Footer />
        </>

    )
}


