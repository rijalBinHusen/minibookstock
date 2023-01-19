## Pembaruan 18 January 2023
<!-- omit in toc -->
- [Pembaruan 18 January 2023](#pembaruan-18-january-2023)
    - [Penampakan aplikasi setelah diperbaharui](#penampakan-aplikasi-setelah-diperbaharui)
  - [Apa saja yang baru](#apa-saja-yang-baru)
  - [Apa itu stock master](#apa-itu-stock-master)
  - [Apa itu summary stock](#apa-itu-summary-stock)
  - [Apa itu transaksi](#apa-itu-transaksi)
  - [Apa itu sales orders](#apa-itu-sales-orders)
  - [Apa itu slow moving](#apa-itu-slow-moving)
  - [Bagaimana cara memperbaharui aplikasi](#bagaimana-cara-memperbaharui-aplikasi)

#### Penampakan aplikasi setelah diperbaharui

![New update available](images/update_20230118%2014.46.png)

### Apa saja yang baru
Terdapat beberapa perubahan yang langsung dapat terlihat ketika membuka aplikasi dan beberapa perubahan yang hanya bisa terlihat setelah aplikasi digunakan.

Berikut daftar perubahan yang didapatkan pada pembaruan kali ini:

1. Pengurangan menu navigasi pada bagian atas

   Seperti terlihat pada [gambar](#penampakan-aplikasi-setelah-diperbaharui) menu navigasi dibagian atas hanya terdapat dua tombol yaitu **PRODUK MASUK** dan **PRODUK KELUAR**, hal ini dikeranakan banyak tambahan menu pada pembaharuan kali ini, tidak memungkin untuk meletakkan semua menua navigasi pada bagian atas, kami memutuskan untuk hanya menampilkan menu yang sering digunakan dibagian atas navigasi, sedangkan menu yang jarang digunakan kami letakkan pada kotak tarik turun.
2. Tombol dan kotak tarik turun

   Tombol tarik turun berada di sebelah kiri yang memiliki ikon 3 baris berjajar ke arah bawah, jika tombol tersebut diklick maka akan memunculkan kotak tarik turun, dan terlihatlah beberapa menu baru yang kami tambahkan pada pembaharuan kali ini dan menu lama yang kami letakkan pada kotak tarik turun

3. Menu baru
   - Stock master
   - Summary stock
   - Transaksi
   - Sales orders
   - Slow moving
4.  Edit produk masuk
    - Merubah kode produksi
    - Merubah tanggal produksi

5. Menambahkan produk keluar
   - Terdapat tambahan input form baru yaitu customer.
   - Mengedit item yang telah ditambahkan pada daftar produk item
   - Mengambil sales order dari daftar yang telah diimport
   - Mengambil item produk yang dimuat secara otomatis berdasarkan sales order

6. Edit produk keluar
   - Merubah *Tanggal*.
   - Merubah *Shift*.
   - Merubah *Type* .
   - Merubah *Nama customer*.
   - Merubah *Jumlah* produk yang dimuat.
7. Update **Produk keluar** dengan cepat tanpa ada jeda.


### Apa itu stock master
Stock master adalah menu yang berisi daftar seluruh stock yang ada digudang meliputi *Nama item, tanggal produk, dan quantity produk* yang berguna untuk memantau stock yang tersedia saat ini, pengguna dapat meng-ekspor data yang ditampilkan dalam bentuk excel sehingga dapat digunakan untuk berbagai kepentingan.
### Apa itu summary stock
Summary stock adalah versi lebih sederhana dari [stock master](#apa-itu-stock-master), menu ini hanya berisi *Nama item, dan quantity*, namun jika pengguna ingin melihat detail dari quantity terdiri dari tanggal produk berapa saja, pengguna dapat menekan tombol **detail** pada tabel, pengguna juga dapat meng-ekspor data yang ditampilkan dalam bentuk excel sehingga dapat digunakan untuk berbagai kepentingan.

### Apa itu transaksi
Transaksi merupakan sebuah halaman yang digunakan untuk melihat pergerakan produk pada tanggal dan shift tertentu, pengguna perlu mengisikan tanggal dan shift terlebih dahulu untuk dapat melihat transaksi produk yang berlangsung, pengguna dapat meng-ekspor data yang ditampilkan dalam bentuk excel sehingga dapat digunakan untuk berbagai kepentingan.

### Apa itu sales orders
Sales order adalah menu yang hanya dapat diisi dengan cara meng-impor file excel dengan format tertentu,

setelah file excel selesai dimpor maka seluruh data yang ada di file excel yang memenuhi kriteria yang telah kami tetapkan akan dimasukkan kedalam database dan akan ditampilkan pada tabel.

Daftar sales order yang diimpor akan muncul dan dapat dipanggil ketika pengguna mengisi form *sales order* pada saat menambahkan **produk keluar**, yang kemudian daftar produk akan dimasukkan secara otomatis berdasarkan sales order yang telah dipilih.

Adapaun kriteria sales order yang akan dimasukkan ke database adalah sebagai berikut:
1. Tanggal sales order <= 14 hari
2. Sales order memiliki item yang sesuai dengan yang ada didatabase


### Apa itu slow moving
Slow moving adalah menu yang menyaring seluruh produk yang ada digudang yang berusia > 14 hari, pengguna dapat meng-ekspor data yang ditampilkan dalam bentuk excel sehingga dapat digunakan untuk berbagai kepentingan.

### Bagaimana cara memperbaharui aplikasi
1. Backup database aplikasi agar dapat di import diaplikasi baru
  - Masuk aplikasi Monitoring FIFO
  - Masuk menu *Setting*, pada bilah sebelah kanan, klick form tarik-turun, pilih *bakcup database*.
  - Kemudian klick tombol *Backup data*
2. Hapus aplikasi (Untuk google chrome)
  - Pilih *More* ![alt](https://lh3.googleusercontent.com/lj8iQ_V4mFOCNvLv_0Pgdh5G9kz-IbZHPvBjCmllTb9oQwZpKJnU5HXYZoXVMEfhs8M=w36-h36) Kemudian *More tools* lalu *Extensions*.
  - Selanjutnya pilih aplikasi yang ingin kita hapus, Tekan *hapus*.
  - Untuk mengkonfirmasi, Tekan *hapus* pada pop up yang muncul.
3. Pasang aplikasi yang baru
  - Kita masih berada di menu *extensions*
  - Klick tombol *Load unpackaed*
  - Kemudian pilih *folder* dimana aplikasi baru kita diletakkan
  - Setelah selesai instalasi buka tab baru
  - Akan terbuka aplikasi baru.
4. Import database
  - Tekan tombol tarik-turun pada sebelah kiri atas aplikasi
  - Masuk ke menu *setting*
  - Pada bilah sebelah kanan, klick pada pilihan tarik-turun.
  - Pilih *import database*
  - Klick *Choose file*, kemudian pilih file database yang telah kita backup sebelumnya.
  - Klick *mulai import*.
  - Selesai.

Cukup sampai disini dulu untuk pembaruan aplikasi kali ini, semoga dapat dengan mudah memahami, semoga kedamaian selalu dilimpahkan kepada kita semua.
