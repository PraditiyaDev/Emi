const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  await ctx.reply('Pilih menu layanan Emix Store:', Markup.inlineKeyboard([
    [Markup.button.callback('🧾 Perpanjang Website', 'perpanjang')],
    [Markup.button.callback('🆕 Buat Website Baru', 'buatweb')],
    [Markup.button.callback('📦 Cek Status Transaksi', 'status')],
    [Markup.button.callback('📊 Rekap Transaksi (Admin)', 'rekap')]
  ]));
};