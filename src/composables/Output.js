import { ref } from 'vue';
// import { getItemById } from "./MasterItems";
import { ymdTime, ddmmyyyy } from '../utils/dateFormat';
// store name
export const store = 'output_transaction';
// import set parent function for stock master
import {
  getStockById,
  changeAvailableStock,
  changeQuantityStock,
} from './StockMaster';
// import item function
import { getItemById } from './MasterItems';
// import idb
import { useIdb } from '../utils/localforage';
import { useJurnalProdukKeluar } from './Setting_JurnalId';
import { subscribeConfirmDialog } from '../utils/launchForm';

// the state
export const Output_transaction = ref([]);

// what date to show
export const dateRecordToShow = ref(new Date());

/**
 *
  id string [pk]
  stock_master_ids string
  paper_id string
  tanggal date
  shift number
  diterima string
  type string
  diserahkan string
  catatan string
  isFinished boolean
 */

export const createOutput = async (
  tanggal,
  type,
  shift,
  nomor_so,
  stock_master_id,
  quantity,
  customer
) => {
  // initiate db
  const outputdb = useIdb(store);
  // initiate new record
  const record = {
    tanggal: ymdTime(tanggal),
    type,
    nomor_so,
    stock_master_id,
    shift,
    quantity: Number(quantity),
    isFinished: false,
    customer,
  };
  // get stock by id first
  const stock = await getStockById(stock_master_id);
  // if stock master is Exists
  // save to database if available >= quantity
  if (stock?.id && stock?.available >= quantity) {
    // insert to idb
    const recordInserted = await outputdb.createItem(record);
    // onsole.log('inserted', recordInserted)
    // map record
    const recordMapped = await outputTransactionMapped(recordInserted);
    // push to state
    Output_transaction.value.unshift(recordMapped);
    // change available stock
    await changeAvailableStock(stock_master_id);
    // return the record
    return recordInserted;
  }
  // if stock exists show alert
  if (stock?.itemId) {
    // get item of stock
    const itemInfo = await getItemById(stock?.itemId);
    // else alert
    subscribeConfirmDialog('alert', `Stock ${itemInfo?.nm_item} tidak cukup`);
  }
  return false;
};

// export const gettingStartedRecord = () => {
//   // dapatkan last used
//   if (!Output_transaction.value.length) {
//     const item = localStorage.getItem(store);
//     Output_transaction.value = item ? JSON.parse(item) : [];
//   }
//   return;
// };

export const getRecordByDate = async () => {
  // empty the state
  Output_transaction.value = [];
  // initiate db
  const outputdb = useIdb(store);
  // get record by date
  const records = await outputdb.getItemsByKeyValue(
    'tanggal',
    ymdTime(dateRecordToShow.value)
  );
  // map allRecord
  if (records) {
    for (const rec of records) {
      // map record
      const recordMapped = await outputTransactionMapped(rec);
      Output_transaction.value.unshift(recordMapped);
    }
  }
  //
  return;
};

export const removeOutputById = async (id) => {
  // remove from statate
  Output_transaction.value = Output_transaction.value.filter((rec) => {
    if (rec.id !== id) {
      return rec;
    }
  });
  // initiate db
  const outputdb = useIdb(store);
  // get record first
  const record = await outputdb.getItem(id);
  // saveData();
  await outputdb.removeItem(id);
  // change available stock
  await changeAvailableStock(record?.stock_master_id);
  //
  return;
};

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getOutputById = async (id) => {
  // initiate db
  const outputdb = useIdb(store);
  // onsole.log(res[0]);
  const findStock = await outputdb.getItem(id);
  return findStock
    ? findStock
    : {
        nomor_so: 'Not found',
        tanggal: 'Not found',
        shift: 'Not found',
        quantity: 'Not found',
        type: 'Not found',
      };
};

export const updateOutputById = async (id, keyValueToUpdate) => {
  // onsole.log('update output by id: ', id)
  // initiate db
  const outputdb = useIdb(store);
  // update in db
  const isUpdated = await outputdb.updateItem(id, keyValueToUpdate);
  // get record in db
  if (isUpdated) {
    const newRec = await outputdb.getItem(id);
    // find index on state
    const findIndexRec = Output_transaction.value.findIndex(
      (rec) => rec?.id === id
    );
    // update in state
    if (findIndexRec > -1) {
      // map new Rec
      const newRecMapped = await outputTransactionMapped(newRec);
      Output_transaction.value.splice(findIndexRec, 1, newRecMapped);
    }

    return true;
  }
  alert('Terjadi kesalahan, mohon refresh aplikasi');
  console.log('record not updated');
  return false;
};

export const outputTransactionMapped = async (doc) => {
  // const result = [];
  // // if the state null
  if (!doc) {
    return;
  }
  // get master stock
  const master = await getStockById(doc?.stock_master_id);
  // get item
  const item = await getItemById(master.item_id);
  // return mapped record
  return {
    id: doc?.id,
    tanggal: ddmmyyyy(doc?.tanggal, '-'),
    shift: doc?.shift,
    customer: doc?.customer,
    nomor_so: doc?.nomor_so,
    kd_item: item?.kd_item,
    nm_item: item?.nm_item,
    product_created: ddmmyyyy(master.product_created, '-'),
    quantity: doc?.quantity,
    isFinished: doc?.isFinished,
  };
};

export const markAsFinished = async (id) => {
  // onsole.log(' mark as finished ',id)
  // get record
  const findRec = await getOutputById(id);
  // get stock master id
  const masterId = findRec?.stock_master_id;
  // mark in db output as finished
  await updateOutputById(id, { isFinished: true });
  // update quantity stock
  await changeQuantityStock(masterId);
  return;
};

export const getAllDataToBackup = async () => {
  // initiate db
  const outputdb = await useIdb(store);
  // get all data
  const allData = await outputdb.getItems(store);
  // return the result
  return { store, data: allData ? allData : null };
};

export const getTotalStockTaken = async (id_stock_master) => {
  // initiate db
  const outputdb = useIdb(store);
  // get all Stock master that taken
  const allOutput = await outputdb.getItemsByKeyValue(
    'stock_master_id',
    id_stock_master
  );
  // total all output
  let allTaken = 0;
  // total output that finished = true
  let allFinished = 0;
  // loop all output
  if (allOutput && allOutput.length) {
    for (const out of allOutput) {
      //  if finished true
      if (out?.isFinished) {
        // increment is finished
        allFinished = allFinished + Number(out?.quantity);
      }
      // incremen all taken
      allTaken = allTaken + Number(out?.quantity);
    }
  }

  // will return 0 or > 0
  return { allTaken, allFinished };
};

export const getRecordIsFinishedFalse = async () => {
  // empty the state
  Output_transaction.value = [];
  // initiate db
  const outputdb = useIdb(store);
  // get record by date
  const records = await outputdb.getItemsByKeyValue('isFinished', false);

  // map allRecord
  if (records) {
    for (const rec of records) {
      // map record
      const recordMapped = await outputTransactionMapped(rec);
      Output_transaction.value.unshift(recordMapped);
    }
  }
  //
  return;
};

export const getOutputByStockMasterId = async (stock_master_id) => {
  // use jurnal output
  const { getJurnalProdukKeluarById } = useJurnalProdukKeluar();
  // variable that will contain result
  const result = [];
  // initiate db
  const outputdb = useIdb(store);
  // get record by date
  const allOutput = await outputdb.getItemsByKeyValue(
    'stock_master_id',
    stock_master_id
  );
  /**
   *
   id string [pk]
   stock_master_ids string
   paper_id string
   tanggal date
   shift number
   diterima string
   type string
   diserahkan string
   catatan string
   isFinished boolean
   */
  // loop all output for map it
  for (const outStock of allOutput) {
    // if record finished
    if (outStock?.isFinished) {
      // get type jurnal
      const outputInfo = await getJurnalProdukKeluarById(outStock?.type);
      // get stock master info to get item id
      const stockInfo = await getStockById(outStock.stock_master_id);
      // get item info
      const item = await getItemById(stockInfo.item_id);
      result.push({
        unix_time: outStock.tanggal,
        stock_id: stock_master_id,
        tanggal_transaksi: ddmmyyyy(outStock.tanggal, '-'),
        nomor_dokumen: outStock.nomor_so,
        shift: outStock.shift,
        mutasi: 'Keluar',
        kode_item: item.kd_item,
        nama_item: item.nm_item,
        type: outputInfo.nama_jurnal,
        tanggal_produk: ddmmyyyy(stockInfo.product_created, '-'),
        quantity: outStock?.quantity,
      });
    }
  }
  return result;
};

export const markAsUnFinished = async (id) => {
  // get record
  const findRec = await getOutputById(id);
  // get stock master id
  const masterId = findRec?.stock_master_id;
  // mark in db output as finished
  await updateOutputById(id, { isFinished: false });
  // update quantity stock
  await changeQuantityStock(masterId);
  return;
};

export const changeQuantityOutput = async (id, yourNumberNewQuantity) => {
  try {
    // get the original output
    const origin = await getOutputById(id);
    // get stock details
    const stock = await getStockById(origin?.stock_master_id);
    // check available stock
    // if available >= quantity update output
    // total available stock
    const totalAvailable = origin?.quantity + stock?.available;
    if (totalAvailable >= yourNumberNewQuantity) {
      // update output
      await updateOutputById(id, { quantity: yourNumberNewQuantity });
      // change available stock
      await changeAvailableStock(origin.stock_master_id);
      return;
    }
    // show on modal element
    subscribeConfirmDialog(
      'alert',
      `${stock?.itemName} kurang dari ketersediaan!`
    );
    // error exection
    throw 'Stock tidak cukup';
  } catch (err) {
    alert('Terjadi kesalahan:', err);
    console.log(err);
  }
};

export const getOutputByDateByShift = async (date, shift) => {
  // initiate db
  const outputdb = useIdb(store);
  // get record by date
  const records = await outputdb.getItemByTwoKeyValue(
    'tanggal',
    ymdTime(date),
    'shift',
    shift
  );
  // result
  const result = [];
  // map allRecord
  if (records) {
    for (const rec of records) {
      // map record
      // just get record that isFinished == true
      if (rec?.isFinished) {
        const recordMapped = await outputTransactionMapped(rec);
        result.push(recordMapped);
      }
    }
  }
  return result;
};
