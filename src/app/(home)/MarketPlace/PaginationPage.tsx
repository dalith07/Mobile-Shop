import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PaginationProps {
    pages: number;
    pageNumber: number;
    route: string;
}

const PaginationPage = async ({ pages, pageNumber, route }: PaginationProps) => {

    const pagesArray: number[] = [];
    for (let i = 1; i <= pages; i++) pagesArray.push(i); // 3 => [1,2,3]
    console.log("pages", pages);
    console.log("pageNumber", pageNumber);
    console.log("route", route);

    const prev = pageNumber - 1;
    const next = pageNumber + 1;

    return (
        <div>
            <div className="mt-8">
                <nav className="mx-auto flex w-full justify-center">
                    <ul className="flex flex-row items-center gap-1">
                        <li>
                            <Link href={`${route}?pageNumber=${prev}`} className="inline-flex items-center justify-center 
                        rounded-md text-sm font-medium transition-colors 
                        hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-1 
                        pl-2.5 opacity-50 cursor-not-allowed">
                                <ChevronLeft />
                                <span>Previous</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="#" className="inline-flex items-center justify-center 
                rounded-md text-sm font-medium transition-colors disabled:opacity-50 border 
                border-input bg-background shadow-sm hover:bg-accent 
                hover:text-accent-foreground h-9 w-9">{0}</Link>
                        </li>

                        <li>
                            <Link href={`${route}?pageNumber=${next}`} className="inline-flex items-center justify-center
                rounded-md text-sm font-medium transition-colors  hover:bg-accent 
                hover:text-accent-foreground h-9 px-4 py-2 gap-1 pr-2.5 opacity-50 
                cursor-not-allowed">
                                <span>next</span>
                                <ChevronRight />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default PaginationPage
