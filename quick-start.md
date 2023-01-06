## Bagaimana cara menggunakan aplikasi ini?

Aplikasi ini bisa digunakan sebagai extenstion browser

### Untuk browser chrome :
1. Klik *menu* (3 titik) kemudian masuk ke *More Tools* kemudian pilih *extensions*
![masuk menu extensions](/images/1-masuk-extensions-menu.png)
2. Aktfkan *developer mode*, klick pada bagian *load upacked*, akan muncul window untuk memilih folder.
![aktifkan mode developer](/images/2-mini-book-stock.png)
4. Pilih folder dimana aplikasi ini diletakkan, kali ini folder sudah diletakkan di folder D:/
![Pick folder](/images/2-pick-folder.png)
5. Buka tab baru, kemudian aplikasi ini akan otomatis tampil.
![new tab](/images/3-new-tab.png)

## Import database starter
Pada pertama kali aplikasi ini buka, database masih dalam kondisi kosong.

Didalam folder aplikasi terdapat nama file dengan nama *data-starter.json* yang berisi daftar nama jurnal untuk produk masuk dan produk keluar.

Untuk mengimport *data-starter.json* kedalam aplikasi bisa dilakukan dengan cara :

1. Klick **Setting**
2. Pada bilah sebelah kanan terdapat dropdown, pilih **import data base**
![Pick data starter](/images/2-pick-data-starter.png)
3. Klick *choose file* kemudian masukkan file *data-starter.json* kemudian klick open
![Pick file](/images/2-pick-file-data-starter.png)
4. klick **mulai import** untuk mengimport *data starter* kedalam database aplikasi
![Start import](/images/2-mulai-import.png)
5. Akan muncul loading yang menandakan proses import ke database, setelah tampilan loading selesai berarti proses import ke database sudah selesai


## Import stock awal dengan file excel
Untuk mengisi item dan stock awal bisa dilakukan di aplikasi langsung, tetapi jika dilakukan diaplikasi kita haru input item dan produk masuk satu persatu.

Untuk dapat melakukan import item dan sekaligus quntity item dapat dilakukan dengan cara mengisinya di file excel :

1. Klick **Setting**
2. Pada bilah sebelah kanan pilih **Import stock awal**
![Setting > stock awal](/images/3-import-stock-awal.png)
3. Klick **Download contoh format** maka akan file excel akan otomatis ter unduh.
![Start import](/images/3-download-format-stock-awal.png)
4. Buka file *Contoh format stock awal.xls*  tersebut, kemudian isikan informasi yang diperlukan sesuai dengan format yang telah ditentukan
![Start import](/images/3-input-item.png)
5. Setelah selesai, masuk ke aplikasi dimenu *import stock awal tadi*, kemudian pilih *choose file*, pilih file excel yang sudah di entry data.
![Start import](/images/3-pick-file.png)
6. Setelah memilih file excel kemudian klick **Mulai import**
![Start import](/images/3-mulai-import.png)
7. Akan muncul loading yang menandakan proses import ke database, setelah tampilan loading selesai berarti proses import ke database sudah selesai
8. Untuk memastikan data yang difile excel sudah ter input, cek pada menu **Master item**
![Start import](/images/3-cek-master-item.png)
9. Bisa juga dengan melakukan cek pada menu produk masuk
![Start import](/images/3-cek-incoming.png)

## Selesai!
Setelah melakukan langkah langkah diatas, yang perlu dilakukan selanjutnya sama seperti biasanya,

 jika terdapat produk masuk gudang , tambahkan di menu **Produk masuk**, 
 
 jika terdapat produk keluar gudang, tambahkan di menu **Produk keluar**