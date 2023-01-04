[x] rekap stock master yang telah diinput

[x] kirim ke parent

[x]simpan sebagai incoming transaksi
datanya kek gini { id, tanggal, stock_master_ids: disini child stock nya}

[x] di stock master juga nyimpan nama parentnya
datanya kek gini { id, item_id, incoming_transaction_id: disini id parentnya }

<!-- 28 Desember 2022 -->
## Menampilkan incoming transaksi
value yang perlu ditampilkan:
  tanggal date(perlu dikonversi)
  shift number
  diterima string
  type string (perlu dikonversi)
  diserahkan string
    - [x] dapatkan semua data incoming
    - [x] mapping data incoming
    - [x] tampilkan ditabel
    - [x] buat fungsi untuk edit
      - [x] Luncurkan form edit
      - [x] Kirim juga id document yang akan diedit
      - [x] Ketika form tampil, dapatkan id dokument yang akan di edit
      - [x] isi form sesuai dengan record incoming form
      - [x] lemparkan stock master child ke component pick item, dan isParentEditMode
      - [x] dikomponen pick item, deteksi apakah parent mode edit atau tidak
      - [x] jika parent edit mode ambil props stock child dari parent
      - [x] dapatkan semua stock child parent dengan get stock by id
      - [x] tampilkan semua stock master ditabel
      - [x] edit record on incoming form
      - [x] update record
    - [ ] buat fungsi untuk hapus

<!-- 29 desember 2022 -->
## Ubah tampilan incoming product
  - [x] hal hal yang perlu ditampilkan
    - [x] tanggal
    - [x] shift
    - [x] paper_id
    - [x] nm_item
    - [x] quanitity
    - [x] available

## CRUD transaksi pengeluaran
- [ ] Create document
  - [x] hal hal yang perlu di insert
    - [x]  tanggal date
    - [x]  shift number
    - [x]  vehicle_id string (Sementara nomor SO Saja)
    - [x]  stock_master string
      - [x] User pilih item dulu
      - [x] pilih expired date berapa refer to stock master
      - masukkan quantity
    - [x]  quantity number
  - [ ]  hal hal yang perlu dilakukan setelah insert document
    - [x]  update available stock master
- [ ]  Read document
  - [ ]  hal hal yang perlu ditampilkan
    - [ ]  tanggal date
    - [ ]  shift number
    - [ ]  vehicle_id string (Sementara nomor SO Saja)
    - [ ]  nama item string
    - [ ]  product_created
    - [ ]  quantity number
- [ ]  Update document
  - [ ]  hal hal yang perlu di update
    - [ ]  tanggal date
    - [ ]  shift number
    - [ ]  vehicle_id string (Sementara nomor SO Saja)
    - [ ]  stock_master string
    - [ ]  keterangan string
    - [ ]  quantity number
  - [ ]  hal hal yang perlu dilakukan setelah update document
    - [ ]  update available stock master
- [ ]  Delete document
  - [ ]  hal hal yang perlu dilakukan setelah delete document
    - [ ]  update available stock master

# 2 January 2023

- [x] Membuat fungsi untuk mengubah row excel menjadi object

parameter yang dibutuhkan fungsi
```javascript
{ key: 'Judul key object', value: ' Nama kolom di excelnya' }
```

# 4 January 2023
- [x] Menampilkan incoming berdasarkan record incoming, bukan semua item yang masuk
  - hal hal yang perlu ditampilkan
  - [x] tanggal
  - [x] shift
  - [x] type
  - [x] paper_id
- [x] Membuat item incoming bisa diubah meskipun item sudah ditandai isTaken, selama quantity nya tidak kurang dari yang diambil di output stock
- [x] Membuat quantity stock berukarang setelah ditandai item sudah dimuat
- [x] Menampilkan item quantity incoming seluruhnya (termasuk yang sudah taken)
  -  Ketentuan
     1. Total Stock available = (quantity + total output isFinished=true|false )
     2. Total Stock quantity = (quantity + total output isFinished=true )
     3. Stock quantity Tidak boleh < total output that isFinished=true (apllied)
- Membuat item output dapat diedit sehingga user tidak perlu menghapus item jika terjadi ketidak sesuaian