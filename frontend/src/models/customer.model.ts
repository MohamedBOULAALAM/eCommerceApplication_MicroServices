export interface Customer {
  id?: number;
  name: string;
  email: string;
  _links?: {
    self?: { href: string };
    customer?: { href: string };
  };
}

export interface CustomerPage {
  _embedded?: {
    customers?: Customer[];
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
  content?: Customer[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
}

