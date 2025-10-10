import { DOMAIN } from "@/lib/constants";
import { ProductsWithAll } from "@/lib/utils";

// Get Products Based on pageNumber
// export async function getProducts(
//   pageNumber: string | undefined
// ): Promise<ProductsWithAll> {
//   const response = await fetch(
//     `${DOMAIN}/api/dashboard/products/${pageNumber}`,
//     {
//       cache: "no-store",
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed To Fetch Production");
//   }

//   const products = await response.json();
//   return produproductsction;
// }
export async function getProducts(
  pageNumber: string | undefined
): Promise<ProductsWithAll[]> {
  const response = await fetch(
    `${DOMAIN}/api/dashboard/products/${pageNumber}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed To Fetch Products");
  }

  const productions: ProductsWithAll[] = await response.json();
  console.log("suuuuuuuuuuu", productions);
  return productions;
}

// Get Products Count
export async function getProductsCount(): Promise<number> {
  const response = await fetch(`${DOMAIN}/api/dashboard/products/count`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Faild to get articles count ❌");
  }

  // Only return data if successful
  const { count } = (await response.json()) as { count: number };
  return count;
}

// Get Articles Based on searchText
export async function getProductsBasedOnSearch(
  searchText: string
): Promise<ProductsWithAll[]> {
  const response = await fetch(
    `${DOMAIN}/api/dashboard/products/search?searchText=${searchText}`
  );

  // Check response status first
  if (!response.ok) {
    throw new Error("Faild to fetch articles ❌");
  }

  // Only return data if successful
  return response.json();
}

// Get single article by id
export async function getSingleProducts(
  articleId: string
): Promise<ProductsWithAll> {
  const response = await fetch(
    `${DOMAIN}/api/dashboard/products/${articleId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return await response.json();
}
