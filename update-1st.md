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
   - Mengedit *Tanggal*.
   - Mengedit *Shift*.
   - Mengedit *Type* .
   - Mengedit *Nama customer*.
   - Mengedit *Jumlah* produk yang dimuat.
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
- Backup database aplikasi agar dapat di import diaplikasi baru
  - Masuk aplikasi Montitoring FIFO
  - Masuk menu *Setting*, pada bilah sebelah kanan, klick form tarik-turun, pilih *bakcup database*.
  - Kemudian klick tombol *Backup data*
- Hapus aplikasi (Untuk google chrome)
  - Buka google Chrome.
  - Pilih *More* ![alt](https://lh3.googleusercontent.com/lj8iQ_V4mFOCNvLv_0Pgdh5G9kz-IbZHPvBjCmllTb9oQwZpKJnU5HXYZoXVMEfhs8M=w36-h36) Kemudian *More tools* lalu *Extensions*.
  - Selanjutnya pilih aplikasi yang ingin kita hapus, Tekan *hapus*.
  - Untuk mengkonfirmasi, Tekan *hapus* pada pop up yang muncul.
- Pasang aplikasi yang baru
  - Kita masih berada di menu *extensions*
  - Klick tombol *Load unpackaed*
  - Kemudian pilih *folder* dimana aplikasi baru kita diletakkan
  - Setelah selesai instalasi buka tab baru
  - Akan terbuka aplikasi baru.
- Import database
  - Tekan tombol tarik-turun pada sebelah kiri atas aplikasi
  - Masuk ke menu *setting*
  - Pada bilah sebelah kanan, klick pada pilihan tarik-turun.
  - Pilih *import database*
  - Klick *Choose file*, kemudian pilih file database yang telah kita backup sebelumnya.
  - Klick *mulai import*.
  - Selesai.

Cukup sampai disini dulu untuk pembaruan aplikasi kali ini, semoga dapat dengan mudah memahami, semoga kedamaian selalu dilimpahkan kepada kita semua.

![alt](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAIlUExURUdwTMlpA8N4HzN0+/KgFMqHLcl1F9CtXMefXKG3ycZvFRsynsV1H16B18VtEBIwwlOD2vGGBCln7cJnCNynMlx9x8ZoCA8qrTZ59MVnBkF25DVv7zBHpcJpDShk99uNM85vDUxgpld3wr6PXTd07slrCCI4mkJh0Rg3wFF1xtqCLc1yFfGJEbh/VDRLnfCZIRMqn8eOT916Eb6OY+ubLN+aRaOOfdqaPOuCE+GKK6ljDP/NOP/cMf6vFvurFfenFP/SNv+zGv/XM/+2IfSiEe6dEueUDeOOC9qCCNV1A/+7Kv/SMP/OMv/NLP/jM9+JCv/JMeHv2t/mj9l7BP/DMP+4Jo1QBOqZD/++Mf/HK//aLVuo/2Gx/2a6/4vj//Lvcf/dP2zE/4NJBVSd///rOWoyAkuT///QQ/7lTv/zSdFvAjqE+5ZZB37X//31WiVY8/7aTkSL/uPtmHjT/3pBAy5k/f/FNj55/+r026VmCH+hzv/AKevsgZxgCfCVBnM6A/2TA/T44f6hB/jiYR9K56+CHebfh6T1/+/ddceiLLeOJuaAAf7sQ+fmf/nrYv/SBGmU1hg81urFN/GwKOC5M/jWX0N+6aR0GPjMQfzFDPv87mArA5fr/+3WNNnnzdrll/TbNv+6CLJ0E/391+bPRDdw6vb3vohXDae+tciFGsnZo5axvMXWy/W4F/z1mrjMq4KJmf/dF9WWJF0mAc7Afpy20bHFy3HvTMsAAACmdFJOUwD/M/7+H2MDDBaIy0xFof/8/tDU/izi+enzb6yUuuqSzWL+SYfsrKzbZay17vp70+nP0WC+bJnu3bnx//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6Ft2HwAAAJ3ElEQVRYw6yYiVcaWRbGVUTEXeKSqNEYt5h966T7sCmgRlRCyxICbiEgLpUYImJrRAiKLYS2I6Do2Laaccu+dfffN/e+qkIkJpk5Z76Sw6u3/Pjuva+qhKSk/4/SvzXI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)
