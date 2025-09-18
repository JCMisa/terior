import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import confetti from "canvas-confetti";
import { ilike, sql } from "drizzle-orm";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const withErrorHandling = <T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>
) => {
  return async (...args: A): Promise<T> => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return errorMessage as unknown as T;
    }
  };
};

export const showConfetti = () => {
  const end = Date.now() + 3 * 1000; // 3 seconds
  const colors = [
    "#ffb399", // primary-300: soft peach
    "#ff8f66", // primary-400: vibrant orange
    "#ff6d3d", // primary-500: bold tangerine
    "#ffd4c8", // primary-200: light coral
    "#ffeae4", // primary-100: gentle blush
  ];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const doesTitleMatch = (rooms: any, searchQuery: string) =>
  ilike(
    sql`REPLACE(REPLACE(REPLACE(LOWER(${rooms.roomName}), '-', ''), '.', ''), ' ', '')`,
    `%${searchQuery.replace(/[-. ]/g, "").toLowerCase()}%`
  );

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const updateURLParams = (
  currentParams: URLSearchParams,
  updates: Record<string, string | null | undefined>,
  basePath: string = "/"
): string => {
  const params = new URLSearchParams(currentParams.toString());

  // Process each parameter update
  Object.entries(updates).forEach(([name, value]) => {
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
  });

  return `${basePath}?${params.toString()}`;
};
