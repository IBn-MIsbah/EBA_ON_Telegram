import { telegramBot } from "./bot.js";
import { setupStartCommand } from "./commands/start.command.js";
import { setupProductsCommand } from "./commands/products.command.js";
import { setupCartCommand } from "./commands/cart.command.js";
import { setupStatusCommand } from "./commands/status.command.js";
import { setupClearCommand } from "./commands/clear.command.js";
import { setupCallbackHandler } from "./handler/callback.handler.js";
import { setupContactHandler } from "./handler/contact.handler.js";

// Setup all commands
export function setupBot() {
  // Register commands
  setupStartCommand();
  setupProductsCommand();
  setupCartCommand();
  setupStatusCommand();
  setupClearCommand();

  // Register handlers
  setupContactHandler();
  setupCallbackHandler();

  // Setup bot commands menu
  setupBotCommands();
}

export const setupBotCommands = () => {
  telegramBot.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "products", description: "Browse available products" },
    { command: "cart", description: "View your cart" },
    { command: "status", description: "Check bot status" },
    { command: "clear", description: "Clear messages" },
  ]);
};

// Export bot instance
export { telegramBot };
