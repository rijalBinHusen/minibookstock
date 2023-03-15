import { ref } from 'vue';
// item function
import { getItemById, getItemIdByKdItem, createItem } from './MasterItems';
import { loaderMessage } from '../utils/launchForm';
// date formatter
import {
  ddmmyyyy,
  ymdTime,
  getNextYearTime,
  time,
  dayPlusOrMinus,
  JSToExcelDate,
} from '../utils/dateFormat';
// store name
export const store = 'stock_master';
// incoming function
import { createIncoming, getIncomingById } from './Incoming';
// conver excel date to javascript date
import excelToJSDate from '../utils/ExcelDateToJs';
// import local forage
import { useIdb } from '../utils/localforage';
import { getTotalStockTaken } from './Output';
import { useJurnalProdukMasuk } from './Setting_JurnalId';

// the state
export const Stock_masters = ref([]);
/**
 * \
 *
  created datetime
  id string
  item_id string
  kd_produksi datetime
  product_created number
  icoming_parent_id string
  quantity number
  isTaken boolean
  available number
  available_end dateNumber
 */

export const createStock = async (
  item_id,
  kd_produksi,
  product_created,
  quantity,
  available_start
) => {
  // retrieve all available stock,
  // if we push new record without retrieve all stock first, the function wil never do the intruction
  // because the state is not null, even though the state just contain new record, not all stock
  await getStockThatAvailable();
  // initiate idb
  const stockdb = useIdb(store);
  // get last id
  // initiate new record
  const record = {
    item_id,
    kd_produksi,
    product_created,
    quantity: Number(quantity),
    available: Number(quantity),
    available_start,
    isTaken: false,
    available_end: getNextYearTime()
  };
  // save to indexeddb
  const insertedRecord = await stockdb.createItem(record);
  // map record
  const recordMaped = await documentsMapper(insertedRecord);
  // // push to state
  Stock_masters.value.unshift(recordMaped);

  return insertedRecord;
};

export const removeStockById = async (id) => {
  // initiate idb
  const stockdb = useIdb(store);
  // remove from state
  Stock_masters.value = Stock_masters.value.filter((rec) => rec.id !== id);
  // remove from idb
  await stockdb.removeItem(id);
  return;
};

export const getStockById = async (id) => {
  // initiate idb
  const stockdb = useIdb(store);
  //
  const findStock = await stockdb.getItem(id);
  return findStock
    ? findStock
    : {
        item_id: 0,
        kd_produksi: 0,
        product_created: 0,
        quantity: 0,
        available: 0,
      };
};

export const updateStockById = async (id, keyValueToUpdate) => {
  // initiate idb
  const stockdb = useIdb(store);
  // update database
  await stockdb.updateItem(id, keyValueToUpdate);
  // get new record
  const newRec = await stockdb.getItem(id);
  const findIndexRec = Stock_masters.value.findIndex((rec) => rec?.id === id);
  if (findIndexRec > -1) {
    // map new rec
    const newRecMapped = await documentsMapper(newRec);
    // update state
    Stock_masters.value.splice(findIndexRec, 1, newRecMapped);
  }
  //saveData();
  return;
};

export const documentsMapper = async (doc) => {
  // get item
  const item = await getItemById(doc?.item_id);
  return {
    ...doc,
    item_name: item?.nm_item,
    kd_item: item?.kd_item,
    product_created_format: ddmmyyyy(doc?.product_created, '-'),
  };
};

export const setStockParent = async (idsOfStock, icoming_parent_id) => {
  // update in db
  await updateStockById(idsOfStock, { icoming_parent_id });
};

export const itemThatAvailable = async () => {
  // get all item that available
  await getStockThatAvailable();
  // get item that available not null
  let isItemTaken = [];
  // result of item
  let result = [];
  for (const stock of Stock_masters.value) {
    if (stock?.available > 0 && !isItemTaken.includes(stock?.item_id)) {
      const item = await getItemById(stock?.item_id);
      isItemTaken.push(stock?.item_id);
      result.push({
        item_id: stock?.item_id,
        kd_item: item?.kd_item,
        nm_item: item?.nm_item,
      });
    }
  }
  return result;
};

export const getAvailableDateByItem = async (item_id) => {
  // get all item that available
  await getStockThatAvailable();
  const result = [];
  Stock_masters.value.forEach((stock) => {
    // if availabel and item_id == item_id
    if (stock?.item_id == item_id && stock?.available > 0) {
      // product create as number
      const product_created_as_number =
        typeof stock?.product_created === 'string'
          ? new Date(stock?.product_created).getTime()
          : stock?.product_created;
      result.push({
        id: stock?.id,
        product_created:
          '#' +
          ddmmyyyy(product_created_as_number, '-') +
          ' | ' +
          stock?.kd_produksi,
        origin_product_created: product_created_as_number,
      });
    }
  });
  // sorting the result
  return result.sort(
    (a, b) => a['origin_product_created'] - b['origin_product_created']
  );
  // return result;
};

export const changeAvailableStock = async (id_stock) => {
  // initiate idb
  const stockdb = useIdb(store);
  // get the record
  const findRec = await stockdb.getItem(id_stock);
  // get all taken in output transaction
  const stockTaken = await getTotalStockTaken(id_stock);
  // full quantity (quantity now + stock all finished) - all taken in output
  const available = findRec?.quantity + stockTaken.allFinished - stockTaken.allTaken;
  // isTaken value
  const isTaken = Number(findRec?.quantity) != available;
  // if > 0
  if (available >= 0) {
    // new item
    const keyValueToUpdate = { available, isTaken };
    // save to database
    await updateStockById(id_stock, keyValueToUpdate);
    // return true
    return true;
  } else {
    // find item name
    const item = await getItemById(findRec.item_id);
    // show in alert message
    alert(
      `Item ${item.nm_item} tidak dapat dimasukkan karena ketersediaan stock kurang dari permintaan`
    );
    // false return
    return false;
  }
};

export const markStockAsTaken = async (id) => {
  await updateStockById(id, { isTaken: true });
};

export const getAllDataToBackup = async () => {
  // initiate idb
  const stockdb = useIdb(store);
  // get all data
  const allData = await stockdb.getItems();
  // return the result
  return { store, data: allData ? allData : null };
};

export const createStockAwal = async (
  kode_item,
  nama_item,
  umur_product,
  quantity,
  tanggal_produksi
) => {
  // convert excel date to javascript date
  const date = excelToJSDate(tanggal_produksi);
  // cari dulu itemnya sudah ada atau belum
  const isItemExists = await getItemIdByKdItem(kode_item);
  // jika ada langsung input ke master
  if (isItemExists?.id) {
    // create new stock
    const stock = await createStock(
      isItemExists.id,
      'stock awal',
      ymdTime(date),
      quantity
    );
    // create incoming record
    const incoming = await createIncoming(
      [stock.id],
      nama_item,
      ymdTime(),
      1,
      'stock awal',
      'stock awal',
      'stock awal',
      null
    );
    // set parent stock
    await setStockParent(stock.id, incoming.id);
  } else {
    // jika belum ada buat item baru
    // create new item, this will return only id
    const item = await createItem(
      kode_item,
      nama_item,
      null,
      ymdTime(),
      Number(umur_product)
    );
    // create new stock
    const stock = await createStock(item, 'stock awal', date, quantity);
    // create incoming record
    const incoming = await createIncoming(
      [stock.id],
      nama_item,
      ymdTime(),
      1,
      'stock awal',
      'stock awal',
      'stock awal',
      null
    );
    // set parent stock
    await setStockParent(stock.id, incoming.id);
  }
};

export const getSTockByIdInState = (idStock) => {
  return Stock_masters.value.find((rec) => rec?.id === idStock);
};

export const changeQuantityStock = async (id_stock) => {
  // initiate idb
  const stockdb = useIdb(store);
  // get the record
  const findRec = await stockdb.getItem(id_stock);
  // get all output
  const quantityFinished = await getTotalStockTaken(id_stock)
  const quantityOrigin = findRec?.available + quantityFinished.allTaken
  // decrement or increment quantity
  const quantity = quantityOrigin - quantityFinished.allFinished;
  // available_end ate, if quantity 0 set to now, else next year
  const available_end = quantity == 0 ? time() : getNextYearTime();
  const keyValueToUpdate = { quantity, available_end };
  // update stock
  await updateStockById(id_stock, keyValueToUpdate);
  return;
};

export const getStockByIdForIncomingForm = async (id) => {
  // initiate idb
  const stockdb = useIdb(store);
  // get all output
  const allOutput = await getTotalStockTaken(id);
  // find stock
  const findStock = await stockdb.getItem(id);
  return findStock
    ? { ...findStock, quantity: findStock?.quantity + allOutput.allFinished }
    : {
        item_id: 'Not found',
        kd_produksi: 'Not found',
        product_created: 'Not found',
        quantity: 'Not found',
      };
};

export const getStockMasterByItemId = async (item_id) => {
  // initiate idb
  const stockdb = useIdb(store);
  // get data from db based on item id
  const allStock = await stockdb.getItemsByKeyValue('item_id', item_id);
  // return all stock
  return allStock;
};

const wasGetStockThatAvailable = ref(false);

export const getStockThatAvailable = async () => {
  //
  if (wasGetStockThatAvailable.value || Stock_masters.value.length) {
    return;
  }
  // show message to loader
  loaderMessage('Mendapatkan seluruh stock master');
  // mark variable as true
  wasGetStockThatAvailable.value = true;
  // empty state
  Stock_masters.value = [];
  // get stock that available from db
  // initiate idb
  const stockdb = useIdb(store);
  // stock that available
  const stockAvailable = await stockdb.getItemsByKeyGreaterThan('quantity', 0);
  for (const [index, stock] of stockAvailable.entries()) {
    // show message to lodaer
    loaderMessage(
      `Menerjemahkan menjadi stock master, ${index} dari ${stockAvailable.length} stock`
    );
    // map stock
    const stockMapped = await documentsMapper(stock);
    // push to state
    Stock_masters.value.unshift(stockMapped);
  }
  // return
  return;
};

export const mapStockForStockMaster = async () => {
  const result = [];
  // id: stock?.id,
  // kd_item: item?.kd_item,
  // nm_item: item?.nm_item,
  // kd_produksi: stock?.kd_produksi,
  // product_created: ddmmyyyy(stock?.product_created, '-'),
  // quantity: stock?.quantity,
  for (const stock of Stock_masters.value) {
    const item = await getItemById(stock?.item_id);
    result.push({
      id: stock?.id,
      kd_item: item?.kd_item,
      nm_item: item?.nm_item,
      kd_produksi: stock?.kd_produksi,
      product_created: ddmmyyyy(stock?.product_created, '-'),
      quantity: stock?.quantity,
      incoming_parent_id: stock?.icoming_parent_id,
    });
  }
  return result;
};

export const updateQuantity = async (id, yourNumberPlusOrMinus) => {
  // detecting if keyvalue has own property quantity, change the available too
  // get all output
  const getOutput = await getTotalStockTaken(id);
  // 1. Total Stock quantity = (quantity + total output isFinished=true )
  //  it means Now Quantity = quantity - total output isFinished=true
  const quantity = Number(yourNumberPlusOrMinus) - getOutput.allFinished;
  // 2. Total Stock available = (quantity + total output isFinished=true|false )
  // it means available = total quantity - total output isFinished=true|false
  const available = Number(yourNumberPlusOrMinus) - Number(getOutput.allTaken);
  // update with the available property
  await updateStockById(id, { quantity, available });
  // return
  return;
};

export const getSlowMovingItems = async () => {
  // get all item that available
  await getStockThatAvailable();
  // 14 day before
  const day14Before = dayPlusOrMinus(false, -14);
  // use jurnal produk masuk
  const { getJurnalProdukMasukById } = useJurnalProdukMasuk();
  // filter
  const result = [];
  // looping it
  for (let [index, stock] of Stock_masters.value.entries()) {
    loaderMessage(
      `Menerjemahkan menjadi slow moving ${index} dari ${Stock_masters.value.length}`
    );
    if (time(stock?.product_created) <= day14Before) {
      // incoming details
      const incomingDetails = await getIncomingById(stock?.icoming_parent_id);
      // jurnal type
      const jurnalInfo = await getJurnalProdukMasukById(incomingDetails?.type);
      // push to result
      result.push({
        ...stock,
        tanggal_transfer: JSToExcelDate(incomingDetails.tanggal),
        asal_produk: jurnalInfo.nama_jurnal,
      });
    }
  }
  // return result;
  return result;
};

export const getSummaryStockMaster = async () => {
  // incoming type
  const { getJurnalProdukMasukById } = useJurnalProdukMasuk();
  // get all available item first
  await getStockThatAvailable();
  // variable that wuold contain result
  let result = [];
  // loop the state
  for (let [index, stock] of Stock_masters.value.entries()) {
    // show message to loader
    loaderMessage(
      `Menerjemahkan menjadi summary stock, ${index} dari ${Stock_masters.value.length} stock`
    );
    // get incoming details
    const incomingDetails = await getIncomingById(stock?.icoming_parent_id);
    // get incoming type info
    const incomingType = await getJurnalProdukMasukById(incomingDetails.type);
    // find index by kd_item in result variable is that exists
    let findIndex = result.findIndex((res) => res?.kd_item == stock.kd_item);
    // if exists, add total_quantity, details, product_dates
    if (findIndex > -1) {
      // total_quantity,
      // result[1].total_quantity = 300 + 700
      result[findIndex].total_quantity =
        result[findIndex].total_quantity + stock?.quantity;
      // details, 300 ctn ( Masuk gudang 27-Jan-2022 Nomor dokumen 03938 Transfer dari produksi)
      result[findIndex].details =
        result[findIndex].details +
        '\r\n' +
        stock?.quantity +
        ` Masuk ${ddmmyyyy(incomingDetails.tanggal, '-')}, Dokumen ${
          incomingDetails?.paper_id
        }`;
      // product_dates, | 300=27-01-23
      result[findIndex].product_dates =
        result[findIndex].product_dates +
        '\r\n' +
        stock?.quantity +
        `=(${stock?.product_created_format} #${incomingType.nama_jurnal})`;
    } else {
      // push to result variable
      // <!-- kd_item, item_name, total_quantity, details, product_dates -->
      result.push({
        kd_item: stock?.kd_item,
        item_name: stock?.item_name,
        total_quantity: stock?.quantity,
        details:
          stock?.quantity +
          ` Masuk ${ddmmyyyy(incomingDetails.tanggal, '-')}, Dokumen ${
            incomingDetails?.paper_id
          }`,
        product_dates:
          stock?.quantity +
          `=(${stock?.product_created_format} #${incomingType.nama_jurnal})`,
      });
    }
  }
  return result;
};

export class StockToOutput {
  #localStock = [];
  constructor() {
    // if state null
    if (!Stock_masters.value.length) {
      alert(
        'Stock belum tersedia, silahkan mengunjungi stock master untuk mengambil data dari database'
      );
      return false;
    }
    this.#localStock = JSON.parse(JSON.stringify(Stock_masters.value));
  }

  itemThatAvailable() {
    // get item that available not null
    let isItemTaken = [];
    // result of item
    let result = [];
    for (const stock of this.#localStock) {
      if (stock?.available > 0 && !isItemTaken.includes(stock?.item_id)) {
        isItemTaken.push(stock?.item_id);
        result.push({
          item_id: stock?.item_id,
          kd_item: stock?.kd_item,
          nm_item: stock?.item_name,
        });
      }
    }
    return result;
  }

  getAvailableDateByItem(item_id) {
    const result = [];
    this.#localStock.forEach((stock) => {
      // if availabel and item_id == item_id
      if (stock?.item_id == item_id && stock?.available > 0) {
        // product create as number
        const product_created_as_number =
          typeof stock?.product_created === 'string'
            ? new Date(stock?.product_created).getTime()
            : stock?.product_created;
        result.push({
          id: stock?.id,
          product_created:
            '#' +
            ddmmyyyy(product_created_as_number, '-') +
            ' | ' +
            stock?.kd_produksi,
          origin_product_created: product_created_as_number,
        });
      }
    });
    // sorting the result
    return result.sort(
      (a, b) => a['origin_product_created'] - b['origin_product_created']
    );
    // return result;
  }

  getAvailableStock(stockId) {
    const findStock = this.#localStock.find((rec) => rec?.id == stockId);

    return findStock?.available;
  }

  pickAvailableStock(stockId, yourNumber) {
    // console.log('your number to pick', yourNumber);
    // find index record first
    const indexRecord = this.#localStock.findIndex(
      (rec) => rec?.id === stockId
    );
    if (indexRecord > -1) {
      // get the record by index
      const record = this.#localStock[indexRecord];
      // initiate new available stock
      const newAvailableStock = record?.available - yourNumber;
      // if new available >= 0 update state
      if (newAvailableStock >= 0) {
        this.#localStock[indexRecord] = {
          ...record,
          available: newAvailableStock,
        };
        return true;
      }
      alert('Ketersediaan stock tidak cukup');
      return false;
    }
    alert('Stock tidak ditemukan');
    return false;
  }

  isAvailablePickedByNumber(stockId, yourNumber) {
    // find index record first
    const indexRecord = this.#localStock.findIndex(
      (rec) => rec?.id === stockId
    );
    if (indexRecord > -1) {
      // get the record by index
      const record = { ...this.#localStock[indexRecord] };
      // initiate new available stock
      const newAvailableStock = record?.available - yourNumber;
      // if new available >= 0
      if (newAvailableStock >= 0) {
        return true;
      }
      alert('Ketersediaan stock tidak cukup');
      return false;
    }
    alert('Stock tidak ditemukan');
    return false;
  }

  pickStockByItemAndQty(item_id, yourQuantity) {
    // console.log('your quantity: ', yourQuantity)
    const dateAvailable = this.getAvailableDateByItem(item_id);
    // console.log('date available: ', dateAvailable);
    const result = [];
    let quantityLeft = yourQuantity;
    if(dateAvailable.length) {
      dateAvailable.forEach((stock) => {
        if (quantityLeft > 0) {
          // get available first
          const available = this.getAvailableStock(stock.id);
          // onsole.log('available stock', available);
          // new available
          // available - yourQuantity (50 - 100)
          const availableAfterPick = available - quantityLeft;
          // quantity
          const quantityOutput =
            availableAfterPick >= 0 ? quantityLeft : available;
          // set quantity left
          quantityLeft = quantityLeft - quantityOutput;
          // onsole.log('quantity left: ', quantityLeft);
          result.push({ stock_master_id: stock?.id, quantity: quantityOutput });
          // decrement avaialable
          this.pickAvailableStock(stock?.id, quantityOutput)
          // console.log(this.getAvailableStock(stock?.id))
        }
      });
      if (quantityLeft > 0) {
        // get item name
        const itemDetails = this.#localStock.find(
          (rec) => rec?.item_id == item_id
        );
        // show on modal element
        alert(`Stock ${itemDetails?.item_name} kurang dari ketersediaan!`);
      }
    } else {
      alert('Item tidak ditemukan')
      return;
    }
    return result;
  }
}

export const getStockForBookStock = async (date) => {
  const db = useIdb(store)
  const stock = await db.getItemsGreatEqualLowEqual('available_end', date, 'available_start', date)
  return stock
}