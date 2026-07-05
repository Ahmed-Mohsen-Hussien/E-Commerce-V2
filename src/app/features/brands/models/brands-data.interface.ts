export interface BrandsDataResponse {
  results: number;
  metadata: Metadata;
  data: BrandsData[];
}

export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
}

export interface BrandsData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
