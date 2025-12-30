export const formatImageUrl = (imageUrl?: string): string | undefined => {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    if (imageUrl.includes("localhost") && process.env.PUBLIC_URL) {
      const urlPath = imageUrl.split(":5000")[1] || "";
      return `${process.env.PUBLIC_URL.replace(/\/$/, "")}${urlPath}`;
    }
    return imageUrl;
  }
  if (imageUrl.startsWith("/public") || imageUrl.startsWith("public")) {
    const baseUrl = process.env.PUBLIC_URL || `http://localhost:5000`;
    const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${baseUrl.replace(/\/$/, "")}${cleanPath}`;
  }
  return imageUrl;
};

export interface ProductBrowsingState {
  currentIndex: number;
  productIds: string[];
  messageId?: number;
}

export const productBrowsingStates = new Map<number, ProductBrowsingState>();
