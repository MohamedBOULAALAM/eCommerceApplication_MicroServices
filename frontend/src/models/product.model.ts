export interface Product {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  _links?: {
    self?: { href: string };
    product?: { href: string };
  };
}

export interface ProductPage {
  _embedded?: {
    products?: Product[];
  };
  _links?: {
    self?: { href: string };
    profile?: { href: string };
    search?: { href: string };
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  content?: Product[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
}

