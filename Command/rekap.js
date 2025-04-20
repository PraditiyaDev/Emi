module.exports = async (ctx) => {
  const isAdmin = ctx.from.id == require('../config').ADMIN_ID;
  if (!isAdmin) return ctx.reply('Hanya admin yang bisa mengakses rekap.');

  const transaksi = [
    { kode: 'EMIX-001', jumlah: 10000 },
    { kode: 'EMIX-002', jumlah: 15000 },
    { kode: 'EMIX-003', jumlah: 25000 }
  ];

  const totalTransaksi = transaksi.length;
  const totalPemasukan = transaksi.reduce((acc, t) => acc + t.jumlah, 0);
  const listTransaksi = transaksi.map(t => `- ${t.kode} : Rp${t.jumlah}`).join('\n');

  ctx.reply(`Rekap Transaksi:\n\n${listTransaksi}\n\nTotal transaksi: ${totalTransaksi}\nTotal pemasukan: Rp${totalPemasukan}`);
};