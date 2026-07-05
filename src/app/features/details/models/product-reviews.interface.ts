export interface ProductReviewsResponse {
  results: number;
  metadata: Metadata;
  data: Review[];
}

export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
}
