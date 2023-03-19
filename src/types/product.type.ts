export interface Product {
  id?: number;
  name: string;
  image?: string;
  price: number;
  stock: number;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
  file?: any;
  file_obj?: URL | string;
}

export interface Sale {
  id?: number;
  name: string;
  image?: string;
  amount: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  file?: any;
  file_obj?: URL | string;
}
