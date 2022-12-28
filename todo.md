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
      - [v] Luncurkan form edit
      - [v] Kirim juga id document yang akan diedit
      - [v] Ketika form tampil, dapatkan id dokument yang akan di edit
      - [v] isi form sesuai dengan record incoming form
      - [v] lemparkan stock master child ke component pick item, dan isParentEditMode
      - [v] dikomponen pick item, deteksi apakah parent mode edit atau tidak
      - [v] jika parent edit mode ambil props stock child dari parent
      - [v] dapatkan semua stock child parent dengan get stock by id
      - [v] tampilkan semua stock master ditabel
      - [ ] edit record on incoming form
      - [ ] update record
    - [ ] buat fungsi untuk hapus
