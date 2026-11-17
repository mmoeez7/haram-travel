export const TESTIMONIALS_PAGE_SIZE = 10;

export type Testimonial = {
  id: string;
  title: string;
  name: string;
  initial: string;
  text: string;
};

export type TestimonialsPage = {
  reviews: Testimonial[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
};
