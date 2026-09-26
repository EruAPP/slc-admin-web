/**
 * Mengecek apakah pengisian jurnal masuk kategori Terlambat.
 * Aturan: Jurnal dianggap TERLAMBAT jika diisi setelah tanggal jadwal mengajar
 * atau melewati pukul 23:59 pada hari jadwal mengajar tersebut.
 */
export function checkIsLateSubmission(
  scheduleDateStr,
  submissionTimestamp = new Date(),
) {
  if (!scheduleDateStr) return false;

  const schedDate = new Date(scheduleDateStr);
  schedDate.setHours(23, 59, 59, 999);

  const fillDate = new Date(submissionTimestamp);
  return fillDate > schedDate;
}
