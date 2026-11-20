export const VIDEO_REVIEWS_PAGE_SIZE = 10;

export type PublicVideoReview = {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  cta: string;
};

export type VideoReviewsPage = {
  reviews: PublicVideoReview[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
};
