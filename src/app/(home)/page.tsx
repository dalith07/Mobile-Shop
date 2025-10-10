// "use client";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import SectionApplePage from "@/components/sectionHome/SectionApplePage";
// import SectionSamsung from "@/components/sectionHome/SectionSamsung";
// import { DOMAIN } from "@/lib/constants";
// import { ProductnWithImages } from "@/lib/utils";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// export default function Home() {
//   const [products, setProducts] = useState<ProductnWithImages>();

//   useEffect(() => {
//     async function fetchProduction() {
//       try {
//         const res = await axios.get(`${DOMAIN}/api/dashboard/production`);
//         console.log("Fetched products:", res.data);
//         setProducts(res.data)
//       } catch (error: any) {
//         toast.error(error?.response?.data?.message || "Failed to fetch products");
//       } finally {
//       }
//     }
//     fetchProduction();
//   }, []);

//   console.log("homee")

//   return (
//     <>
//       {/* SEARCH PRODUCT */}
//       <nav className="h-14 inset-x-0 z-[40] top-0 w-full  backdrop-blur-lg transition-all">
//         <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
//           <div className="flex gap-1 items-center justify-center mt-2">
//             <input type="search" placeholder="Search for products..." className="flex h-9 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-[500px] rounded-xl border" />
//           </div>
//         </div>
//       </nav>

//       {/* TITER WEB SITE */}
//       <div className="pt-4 px-6 md:mx-auto text-center flex  flex-col w-full items-center">
//         <p className="text-sm max-w-prose  text-muted-foreground">Phone Store, The Best Products In Tunisia</p>
//       </div>

//       {/* PRODUCTS APPLE */}
//       <SectionApplePage products={products} />

//       {/* PRODUCTS SAMSUNG */}
//       <SectionSamsung />
//     </>
//   );
// }


"use client";
import SectionApplePage from "@/components/sectionHome/SectionApplePage";
import SectionSamsung from "@/components/sectionHome/SectionSamsung";
// import { DOMAIN } from "@/lib/constants";
// import { ProductnWithImages } from "@/lib/utils";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

export default function Home() {
  // const [products, setProducts] = useState<ProductnWithImages[]>([]);

  // useEffect(() => {
  //   async function fetchProduction() {
  //     try {
  //       const res = await axios.get(`${DOMAIN}/api/dashboard/production`);
  //       console.log("Fetched products:", res.data);
  //       setProducts(res.data);
  //     } catch (error: any) {
  //       toast.error(error?.response?.data?.message || "Failed to fetch products");
  //     }
  //   }
  //   fetchProduction();
  // }, []);


  return (
    <>
      {/* SEARCH PRODUCT */}
      {/* <nav className="h-14 inset-x-0 z-[40] top-0 w-full backdrop-blur-lg transition-all">
        <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
          <div className="flex gap-1 items-center justify-center mt-2">
            <input
              type="search"
              placeholder="Search for products..."
              className="flex h-9 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-[500px] rounded-xl border"
            />
          </div>
        </div>
      </nav> */}

      {/* TITER WEB SITE */}
      <div className="pt-4 px-6 md:mx-auto text-center flex flex-col w-full items-center">
        <p className="text-sm max-w-prose text-muted-foreground">
          Phone Store, The Best Products In Tunisia
        </p>
      </div>

      {/* PRODUCTS APPLE */}
      <SectionApplePage />

      {/* PRODUCTS SAMSUNG */}
      <SectionSamsung />
    </>
  );
}