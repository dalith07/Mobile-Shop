// Dto => data tranform object
export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
}

export interface CreateProfileDto {
  username?: string;
  email: string;
  imageUrl?: string; // <- optional
  phoneNumber?: string;
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  rols?: string;
  status?: string;
  country?: string;
}

export interface UpdateUsersDashboardDto {
  username?: string;
  email: string;
  imageUrl?: string;
  phoneNumber?: string;
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  rols?: string;
  status?: string;
  country?: string;
}

// export interface CreateProfileDashboardDto {
//   email: string;
//   imageUrl: string;
//   phoneNumber: string;
//   streetAddress: string;
//   city: string;
//   postalCode: string;
//   rols: string;
//   status: string;
//   country: string;
// }

export interface CreateProduction {
  title: string;
  price: number;
  discount: number;
  status: string;
  quantity: number;
  description: string;
  image: {
    imageUrl: string;
  }[];
}

export interface UpdateProduction {
  title: string;
  price: number;
  discount: number;
  status: string;
  quantity: number;
  description: string;
  categoryId: string;
  categoryName: string;
  modelName: string;
  modelId: string;
  image: { imageUrl: string }[];
}

export interface CreateProducts {
  title: string; // production title
  price: number;
  discount: number;
  status: string;
  quantity: number;
  description: string;
  categoryId: string;
  categoryName: string; // category name
  modelName: string; // category name
  modelId: string; // existing model ID
  image: { imageUrl: string }[]; // array of images
}

export interface CreateOrders {
  userId?: string;
  customerName: string;
  customerEmail: string;
  status: string;
  items: {
    id: string;
    title: string;
    description?: string;
    price: number;
    quantity: number;
    discount?: number;
    image?: string;
    category: string;
    model: string;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
}

export interface UpdateOrders {
  status: string;
}
