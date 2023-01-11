import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// import { getItemById } from "./MasterItems";
import { ymdTime, ddmmyyyy } from "../utils/dateFormat";
// store name
const store = "output_transaction";
// generator id
import { generateId } from "../utils/GeneratorId";
// import set parent function for stock master
import {
  getStockById,
  changeAvailableStock,
  changeQuantityStock,
} from "./StockMaster";
// import item function
import { getItemById } from "./MasterItems";
// import idb
import { useIdb } from "../utils/localforage";
import { useJurnalProdukKeluar } from "./Setting_JurnalId";

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
  const outputdb = await useIdb(store);
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId("OUTPUT_TR22030000");
  // initiate new record
  const record = {
    created: new Date().getTime(),
    tanggal: ymdTime(tanggal),
    type,
    id: nextId,
    nomor_so,
    stock_master_id,
    shift,
    quantity: Number(quantity),
    isFinished: false,
    customer,
  };
  // change available master stock, do something when available
  const isAvailable = await changeAvailableStock(
    stock_master_id,
    -Number(quantity)
  );
  // // save to database if isAvailable true
  if (isAvailable) {
    await outputdb.setItem(nextId, record);
    // map record
    const recordMapped = await outputTransactionMapped(record);
    // push to state
    Output_transaction.value.unshift(recordMapped);
    // update summary
    await summaryRecord.updateSummary(nextId);
    // return the record
    return record;
  }
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
  const outputdb = await useIdb(store);
  // get record by date
  const records = await outputdb.getItemsByKeyValue(
    "tanggal",
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
  // initiate db
  const outputdb = await useIdb(store);
  // remove from statate
  Output_transaction.value = Output_transaction.value.filter((rec) => {
    if (rec.id !== id) {
      return rec;
    }
  });
  // get record first
  const record = await outputdb.getItem(id);
  // change available stock
  await changeAvailableStock(record?.stock_master_id, Number(record?.quantity));
  // saveData();
  await outputdb.removeItem(id);
  return;
};

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getOutputById = async (id) => {
  // initiate db
  const outputdb = await useIdb(store);
  // console.log(res[0]);
  const findStock = await outputdb.getItem(id);
  return findStock
    ? findStock
    : {
        nomor_so: "Not found",
        tanggal: "Not found",
        shift: "Not found",
        quantity: "Not found",
        type: "Not found",
      };
};

export const updateOutputById = async (id, keyValueToUpdate) => {
  // initiate db
  const outputdb = await useIdb(store);
  // update in db
  await outputdb.updateItem(id, keyValueToUpdate);
  // get record in db
  const newRec = await outputdb.getItem(id);
  // map new Rec
  const newRecMapped = await outputTransactionMapped(newRec);
  // update in state
  Output_transaction.value = Output_transaction.value.map((item) => {
    return item?.id == id ? newRecMapped : item;
  });
  return;
};

// export const getStockWithoutParent = () => {
//   gettingStartedRecord();
//   const stock = Output_transaction.value.filter(
//     (stock) => !stock?.icoming_parent_id
//   );
//   return stock;
// };

export const outputTransactionMapped = async (doc) => {
  // const result = [];
  // // if the state null
  if (!doc) {
    return result;
  }
  // Output_transaction.value.forEach((doc) => {
  // for (const doc of Output_transaction.value) {
  // get master stock
  const master = await getStockById(doc?.stock_master_id);
  // get item
  const item = await getItemById(master.item_id);
  // return mapped record
  return {
    id: doc?.id,
    tanggal: ddmmyyyy(doc?.tanggal, "-"),
    shift: doc?.shift,
    nomor_so: doc?.nomor_so,
    nm_item: item?.nm_item,
    product_created: ddmmyyyy(master.product_created, "-"),
    quantity: doc?.quantity,
    isFinished: doc?.isFinished,
  };
  // }
  // }
  // );
};

export const markAsFinished = async (id) => {
  // mark in state
  Output_transaction.value = Output_transaction.value.map((doc) => {
    if (doc?.id === id) {
      // update the quantity
      // changeAvailableStock(doc?.stock_master_id,)
      // mark as finished
      return { ...doc, isFinished: true };
    }
    return doc;
  });
  // get record
  const findRec = await getOutputById(id);
  // get stock master id
  const masterId = findRec?.stock_master_id;
  // update quantity stock
  await changeQuantityStock(masterId, -Number(findRec?.quantity));
  // mark in db output as finished
  await updateOutputById(id, { isFinished: true });
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
  const outputdb = await useIdb(store);
  // get all Stock master that taken
  const allOutput = await outputdb.getItemsByKeyValue(
    "stock_master_id",
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
  const outputdb = await useIdb(store);
  // get record by date
  const records = await outputdb.getItemsByKeyValue("isFinished", false);

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
  const outputdb = await useIdb(store);
  // get record by date
  const allOutput = await outputdb.getItemsByKeyValue(
    "stock_master_id",
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
        tanggal: ddmmyyyy(outStock.tanggal, "-"),
        nomor_dokumen: outStock.nomor_so,
        shift: outStock.shift,
        mutasi: "Keluar",
        kode_item: item.kd_item,
        nama_item: item.nm_item,
        type: outputInfo.nama_jurnal,
        tanggal_produk: ddmmyyyy(stockInfo.product_created, "-"),
        quantity: outStock?.quantity,
      });
    }
  }
  return result;
};

export const markAsUnFinished = async (id) => {
  // mark in state
  Output_transaction.value = Output_transaction.value.map((doc) => {
    if (doc?.id === id) {
      // update the quantity
      // changeAvailableStock(doc?.stock_master_id,)
      // mark as finished
      return { ...doc, isFinished: false };
    }
    return doc;
  });
  // get record
  const findRec = await getOutputById(id);
  // get stock master id
  const masterId = findRec?.stock_master_id;
  // update quantity stock
  await changeQuantityStock(masterId, Number(findRec?.quantity));
  // mark in db output as finished
  await updateOutputById(id, { isFinished: false });
};

export const changeQuantityOutput = async (id, yourNumberNewQuantity) => {
  // get the original output
  const origin = await getOutputById(id);
  // compare to new current output (that we're gonna update it)
  // origin - new number | 1000 - 5000 = -4000 (available -4000)
  // origin - new number | 1000 - 500 = +500 (available +500)
  const differentQuantity = Number(origin?.quantity) - Number(yourNumberNewQuantity);
  // update output
  await updateOutputById(id, { quantity: yourNumberNewQuantity });
  // change available stock
  await changeAvailableStock(origin.stock_master_id, differentQuantity);
  return;
};
