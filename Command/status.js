module.exports = async (ctx) => {
  const text = ctx.message.text;
  const parts = text.split(' ');
  const kode = parts[1];

  if (!kode) return ctx.reply('Format: /status KODE_TRANSAKSI');

  ctx.reply(`Status transaksi ${kode}:\nDiproses oleh admin. Mohon tunggu.`);
};