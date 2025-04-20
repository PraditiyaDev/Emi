const { Telegraf, session } = require('telegraf');
const fs = require('fs');
const path = require('path');
const { TOKEN, ADMIN_ID } = require('./config');  // Pastikan token bot dan admin_id sudah benar
const bot = new Telegraf(TOKEN);

bot.use(session());  // Menyimpan session per user

// Memuat semua command secara dinamis dari folder 'commands'
const commandsDir = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsDir);
const commands = {};
commandFiles.forEach(file => {
  const cmdName = file.replace('.js', '');
  commands[cmdName] = require(`./commands/${file}`);
});

// Menangani perintah mulai
bot.start((ctx) => commands.menu(ctx));

// Menangani berbagai perintah yang diminta oleh pengguna
bot.command('menu', (ctx) => commands.menu(ctx));
bot.command('perpanjang', (ctx) => commands.perpanjang(ctx));
bot.command('buatWeb', (ctx) => commands.buatWeb(ctx));
bot.command('status', (ctx) => commands.status(ctx));
bot.command('rekap', (ctx) => commands.rekap(ctx));

// Menangani callback query (approve/reject pembayaran)
bot.on('callback_query', (ctx) => {
  const data = ctx.callbackQuery.data;
  if (data.startsWith('approve_') || data.startsWith('reject_')) {
    const { handleAdminAction } = require('./commands/handleTransfer');
    handleAdminAction(ctx);
  }
});

// Menangani foto yang dikirim oleh user (untuk bukti transfer)
bot.on('photo', (ctx) => {
  const { handleUserTransfer } = require('./commands/handleTransfer');
  handleUserTransfer(ctx);
});

bot.launch();  // Meluncurkan bot
console.log('Bot Emix aktif dan berjalan...');