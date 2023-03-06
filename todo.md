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
diserahkan string - [x] dapatkan semua data incoming - [x] mapping data incoming - [x] tampilkan ditabel - [x] buat fungsi untuk edit - [x] Luncurkan form edit - [x] Kirim juga id document yang akan diedit - [x] Ketika form tampil, dapatkan id dokument yang akan di edit - [x] isi form sesuai dengan record incoming form - [x] lemparkan stock master child ke component pick item, dan isParentEditMode - [x] dikomponen pick item, deteksi apakah parent mode edit atau tidak - [x] jika parent edit mode ambil props stock child dari parent - [x] dapatkan semua stock child parent dengan get stock by id - [x] tampilkan semua stock master ditabel - [x] edit record on incoming form - [x] update record - [ ] buat fungsi untuk hapus

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
    - [x] tanggal date
    - [x] shift number
    - [x] vehicle_id string (Sementara nomor SO Saja)
    - [x] stock_master string
      - [x] User pilih item dulu
      - [x] pilih expired date berapa refer to stock master
      - masukkan quantity
    - [x] quantity number
  - [ ] hal hal yang perlu dilakukan setelah insert document
    - [x] update available stock master
- [ ] Read document
  - [ ] hal hal yang perlu ditampilkan
    - [ ] tanggal date
    - [ ] shift number
    - [ ] vehicle_id string (Sementara nomor SO Saja)
    - [ ] nama item string
    - [ ] product_created
    - [ ] quantity number
- [ ] Update document
  - [ ] hal hal yang perlu di update
    - [ ] tanggal date
    - [ ] shift number
    - [ ] vehicle_id string (Sementara nomor SO Saja)
    - [ ] stock_master string
    - [ ] keterangan string
    - [ ] quantity number
  - [ ] hal hal yang perlu dilakukan setelah update document
    - [ ] update available stock master
- [ ] Delete document
  - [ ] hal hal yang perlu dilakukan setelah delete document
    - [ ] update available stock master

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
  - Ketentuan
    1.  Total Stock available = (quantity + total output isFinished=true|false )
    2.  Total Stock quantity = (quantity + total output isFinished=true )
    3.  Stock quantity Tidak boleh < total output that isFinished=true (apllied)
- Membuat item output dapat diedit sehingga user tidak perlu menghapus item jika terjadi ketidak sesuaian

[ ] Menambahkan tombol close pada confirm dialog

📖 Catatan Rilis :

✅ Versi 0 
    - Master item
    - Produk masuk
    - Produk keluar

✅ Versi 1
    - Stock master
    - Summary stock
    - Transaksi
    - Sales orders
    - Slow moving

    ✅ Versi 1.1
        - Perbaikan kesalahan pada stock master
  
 - Versi 2
    ✅ Menu buku stock (+ perbaikan pada id record )
  
    ✅ Versi 2.0.1
        ✅ Menandai beberapa produk keluar selesai muat.
          ✅ Memilih tangal (sekarang/kemarin) selesai muat.
          ✅ Memilih shift (1/2/3/4) selesai muat.
          link : https://github.com/rijalBinHusen/minibookstock/blob/master/update-2nd.md
  
    🙏 Versi 2.0.2
        - Auto compare saldo akhir laporan harian (excel) dengan saldo aplikasi
        - Auto compare transaksi dengan manual buku stock (excel).
        - Unduh hasil perbandingan aplikasi dengan Excel.

    🙏 Versi 2.0.3
        - Menambahkan nomor urut pada master item.
        - Menampilkan urutan item pada buku stock sesuai nomor yang di atur dimaster item.
    
    🙏 Versi 2.1 
        - Quantity produk masuk dapat diklick 
          untuk memunculkan daftar transaksi
    
    🙏 Versi 2.2 
        - Quantity produk keluar dapat diklik 
          untuk memunculkan daftar transaksi

🙏 Versi 3
    - Migrasi produk keluar,
      Dari per item menjadi per kendaraan.
    
    🙏 Versi 3.1 
      - Checkbox untuk produk selesai muat
      - Tombol *Muat lagi* jika ada produk belum muat
    
    🙏 Versi 3.2
      - Memisahkan kendaraan register, muat, dan selesai
    
    🙏 Versi 3.3
      - Quantity coret DO pada produk
      - Menu khusus menampilkan produk coret DO
    
    🙏 Versi 3.4
      - Quantity muat harian pada produk
  
🙏 Versi 4
    - Menu loading dock
    
    🙏 Versi 4.1
      - Menghubungkan loading dock ke kendaraan

🙏 Versi 5
    - Menu daftar tally checker
    
    🙏 Versi 5.1
      - Form nama tally pada produk keluar

