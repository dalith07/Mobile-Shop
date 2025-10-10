import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const SectionSamsung = () => {
    return (
        <>
            <section className="bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8">
                <div className="w-[95%] mx-auto">
                    <div className="py-4">
                        <div className="md:flex md:items-center md:justify-between mb-4">
                            <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                                <h1 className="text-2xl font-bold sm:text-2xl">
                                    Samsung Phone
                                </h1>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Check out the latest samsung phone
                                </p>
                            </div>

                            <div className="text-center">
                                <Link
                                    href="/MarketPlace"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 animate-pulse"
                                >
                                    Store The collection
                                    <span aria-hidden="true">
                                        <MoveRight className="ml-1 w-5 h-5 font-medium inline-flex" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                        <div className=" w-full grid p-2 lg:grid-cols-4  md:grid-cols-2  sm:grid-cols-2 grid-cols-1 gap-y-4 gap-2 sm:gap-x-8   md:gap-y-10 lg:gap-x-4">
                            <div className="rounded-xl border text-card-foreground shadow bg-muted/100">
                                <div className="relative w-full h-full">
                                    <Image src={"/production/appel/iPhone_13_Pro_Apple.png"}
                                        alt="production"
                                        width="300"
                                        height="300"
                                        className=""
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border text-card-foreground shadow bg-muted/100">
                                <div className="relative w-full h-full">
                                    <Image src={"/production/appel/iPhone_13_Pro_Apple.png"} alt="production" width="300" height="300"
                                        className="" />
                                </div>
                            </div>

                            <div className="rounded-xl border text-card-foreground shadow bg-muted/100">
                                <div className="relative w-full h-full">
                                    <Image src={"/production/appel/iPhone_13_Pro_Apple.png"} alt="production" width="300" height="300"
                                        className="" />
                                </div>
                            </div>

                            <div className="rounded-xl border text-card-foreground shadow bg-muted/100">
                                <div className="relative w-full h-full">
                                    <Image src={"/production/appel/iPhone_13_Pro_Apple.png"} alt="production" width="300" height="300"
                                        className="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SectionSamsung
