export interface ProductBrowsingState {
  currentIndex: number;
  productIds: string[];
  messageId?: number;
}

export interface CallbackData {
  action: string;
  params: string[];
}
