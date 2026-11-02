export const ADMIN_PAGE_SIZE = 10;

export type AdminPaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function parseAdminPage(searchParams: URLSearchParams): number | null {
  const raw = searchParams.get("page");
  if (raw === null || raw === "") return null;
  const page = Number.parseInt(raw, 10);
  if (!Number.isFinite(page) || page < 1) return 1;
  return page;
}

export function parseAdminPageSize(searchParams: URLSearchParams): number {
  const raw = searchParams.get("limit");
  if (raw === null || raw === "") return ADMIN_PAGE_SIZE;
  const limit = Number.parseInt(raw, 10);
  if (!Number.isFinite(limit) || limit < 1) return ADMIN_PAGE_SIZE;
  return Math.min(limit, 50);
}

export function buildPaginationMeta(
  total: number,
  page: number,
  pageSize: number
): AdminPaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    page: Math.min(page, totalPages),
    pageSize,
    total,
    totalPages,
  };
}
