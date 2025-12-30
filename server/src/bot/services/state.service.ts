import { ProductBrowsingState } from "../types/index.js";

export const productBrowsingStates = new Map<number, ProductBrowsingState>();

export class StateService {
  static getState(chatId: number): ProductBrowsingState | undefined {
    return productBrowsingStates.get(chatId);
  }

  static setState(chatId: number, state: ProductBrowsingState) {
    productBrowsingStates.set(chatId, state);
  }

  static updateState(chatId: number, updates: Partial<ProductBrowsingState>) {
    const state = this.getState(chatId);
    if (state) {
      productBrowsingStates.set(chatId, { ...state, ...updates });
    }
  }

  static clearState(chatId: number) {
    productBrowsingStates.delete(chatId);
  }
}
