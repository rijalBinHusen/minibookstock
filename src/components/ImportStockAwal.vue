<template>
  <div>
    <div class="form-control mt-10">
      <label>
        <span class="label-text">Import data</span>
      </label>
      <div class="relative">
        <input
          type="file"
          placeholder="Import data"
          class="w-full pr-16 input input-primary"
          ref="inputFile"
          accept=".xls, xlsx, ods"
        />
        <button
          class="absolute top-0 right-0 rounded-l-none btn btn-primary"
          @click="handleImport"
        >
          Mulai import
        </button>
      </div>
    </div>
    <!-- Button to download excel format to import stock starter -->
    <div>
      <button
        class="rounded btn btn-primary btn-sm mt-11"
        @click="handleFormat"
      >
        Download contoh format
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  launchForm,
  closeModalOrDialog,
  loaderMessage,
} from '../composables/launchForm';
import exportXLS from '../utils/ExportToXls';
import readExcel from '../utils/ReadExcel';
import { createStockAwal } from '../composables/StockMaster';

// ref for input type file
const inputFile = ref();
// function to read file as text
const handleImport = async () => {
  // if form is null
  if (!inputFile.value.files[0]) {
    return;
  }
  // launch the loader
  launchForm('Loader', false);
  // get the first file on input element
  const file = inputFile.value.files[0];
  // read file and conver to array
  const result = await readExcel(file);
  // send to start import
  startImport(result);
};

const startImport = async (excelObject) => {
  // set the sheetname, is the first sheet
  let sheetName = excelObject['sheetNames'][0];
  // get all row in the sheet
  let sheet = excelObject['sheets'][sheetName];
  // get the ref of column, it contain the begin and the last column row, e.g A1:F300
  let infoRow = sheet['!ref'].split(':');
  // get length of row, this will return 300
  let lengthRow = +infoRow[1].match(/\d+/)[0];
  // console.log(sheet)
  for (let i = 2; i <= lengthRow; i++) {
    // sent message loader to show
    loaderMessage(`Memasukkan stock awal ${i} dari ${lengthRow}`);
    const kode_item = sheet['A' + i] ? sheet['A' + i].v : false;
    const nama_item = sheet['B' + i] ? sheet['B' + i].v : false;
    const quantity = sheet['C' + i] ? sheet['C' + i].v : false;
    const umur_product = sheet['D' + i] ? sheet['D' + i].v : false;
    const tanggal_produksi = sheet['E' + i] ? sheet['E' + i].v : false;
    if (sheet['A' + i]) {
      await createStockAwal(
        kode_item,
        nama_item,
        umur_product,
        quantity,
        tanggal_produksi
      );
    }
  }
  // close the loader
  closeModalOrDialog(false).then(() => {
    // refresh browser
    window.location.reload();
  });
};

const handleFormat = () => {
  // format
  const form = [
    {
      kode_item: 'KODEITEM',
      nama_item: 'NAMA ITEM',
      quantity: 100,
      'umur_produk (Bulan)': 7,
      tanggal_produksi: '2022/03/23',
    },
  ];
  // export as excel and save file as xls
  exportXLS(form, 'Contoh format stock awal');
};
</script>
