const { ADMIN_ID } = require('../config');
const { Markup } = require('telegraf');

const pendingTransfers = new Map(); // session sementara

module.exports = {
  handleUserTransfer: async (ctx) => {
    if (!ctx.message.photo) return ctx.reply('Kirim bukti transfer berupa gambar.');

    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name;

    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const caption = ctx.message.caption || 'Tanpa catatan';

    pendingTransfers.set(userId, { userId, fileId, caption });

    await ctx.reply('Bukti transfer kamu sedang dikirim ke admin. Mohon tunggu.');

    // Kirim ke admin
    await ctx.telegram.sendPhoto(ADMIN_ID, fileId, {
      caption: `Bukti transfer dari @${username} (${userId})\nCatatan: ${caption}`,
      reply_markup: Markup.inlineKeyboard([
        [Markup.button.callback('✅ Approve', `approve_${userId}`), Markup.button.callback('❌ Reject', `reject_${userId}`)]
      ])
    });
  },

  handleAdminAction: async (ctx) => {
    const data = ctx.callbackQuery.data;
    const [action, userId] = data.split('_');

    if (!pendingTransfers.has(Number(userId))) {
      return ctx.reply('Data transaksi tidak ditemukan atau sudah diproses.');
    }

    const user = pendingTransfers.get(Number(userId));
    if (action === 'approve') {
      await ctx.telegram.sendMessage(userId, '✅ Bukti pembayaran kamu berhasil diverifikasi. Website kamu akan segera diproses.');
      await ctx.editMessageCaption({ caption: '✅ Diterima oleh admin.' });
    } else if (action === 'reject') {
      await ctx.telegram.sendMessage(userId, '❌ Bukti pembayaran kamu ditolak. Mohon cek kembali dan kirim ulang.');
      await ctx.editMessageCaption({ caption: '❌ Ditolak oleh admin.' });
    }

    pendingTransfers.delete(Number(userId));
    ctx.answerCbQuery();
  }
};