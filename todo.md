[v] rekap stock master yang telah diinput

[v] kirim ke parent

[v]simpan sebagai incoming transaksi
datanya kek gini { id, tanggal, stock_master_ids: disini child stock nya}

[v] di stock master juga nyimpan nama parentnya
datanya kek gini { id, item_id, incoming_transaction_id: disini id parentnya }

<!-- 28 Desember 2022 -->
## Menampilkan incoming transaksi
value yang perlu ditampilkan:
  tanggal date(perlu dikonversi)
  shift number
  diterima string
  type string (perlu dikonversi)
  diserahkan string
    - [v] dapatkan semua data incoming
    - [v] mapping data incoming
    - [v] tampilkan ditabel
    - [ ] buat fungsi untuk edit
    - [ ] buat fungsi untuk hapus
