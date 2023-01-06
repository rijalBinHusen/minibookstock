import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// item function
import { getItemById, getItemIdByKdItem, createItem, Master_items } from "./MasterItems";
// date formatter
import { ddmmyyyy, ymdTime, getNextYearTime, time } from "../utils/dateFormat";
// store name
const store = "stock_master";
// generator id
import { generateId } from "../utils/GeneratorId";
// incoming function
import { createIncoming, getIncomingById } from "./Incoming";
// conver excel date to javascript date
import excelToJSDate from "../utils/ExcelDateToJs";
// import local forage
import { useIdb } from "../utils/localforage";
import { getOutputByStockMasterId, getTotalStockTaken } from "./Output";
import { useJurnalProdukMasuk } from "./Setting_JurnalId";

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
  quantity
) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId("STOCK_MASTER22030000");
  // initiate new record
  const record = {
    created: new Date().getTime(),
    id: nextId,
    item_id,
    kd_produksi,
    product_created,
    quantity: Number(quantity),
    available: Number(quantity),
    available_start: ymdTime(),
  };
  // // push to state
  Stock_masters.value.unshift(record);
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // // save tolocalstorage
  // saveData();
  // save to indexeddb
  await stockdb.setItem(nextId, record);

  return record;
};

export const gettingStartedRecord = async () => {
  // dapatkan last used
  // if (!Stock_masters.value.length) {
    // initiate idb
    const stockdb = await useIdb(store);
    // get all items
    const item = await stockdb.getItems();
    // set state
    Stock_masters.value = item ? item : [];
  // }
  // return;
};

export const removeStockById = async (id) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // remove from state
  Stock_masters.value = Stock_masters.value.filter((rec) => rec.id !== id);
  // remove from idb
  await stockdb.removeItem(id);
  return;
};

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getStockById = async (id) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // console.log(res[0]);
  const findStock = await stockdb.getItem(id);
  return findStock
    ? findStock
    : {
        item_id: "Not found",
        kd_produksi: "Not found",
        product_created: "Not found",
        quantity: "Not found",
      };
};

export const updateStockById = async (id, keyValueToUpdate) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // detecting if keyvalue has own property quantity, change the available too
  if(keyValueToUpdate.hasOwnProperty('quantity')) {
    // get all output
    const getOutput = await getTotalStockTaken(id)
    // 1. Total Stock quantity = (quantity + total output isFinished=true )
    //  it means Now Quantity = quantity - total output isFinished=true
    const quantity = Number(keyValueToUpdate['quantity']) - getOutput.allFinished
    // 2. Total Stock available = (quantity + total output isFinished=true|false )
    // it means available = total quantity - total output isFinished=true|false
    const available = Number(keyValueToUpdate['quantity']) - Number(getOutput.allTaken)
    // update with the available property
    await stockdb.updateItem(id,  { ...keyValueToUpdate, quantity, available})
    return
  }
  // update database
  await stockdb.updateItem(id, keyValueToUpdate);
  //saveData();
  return;
};

export const getStockWithoutParent = () => {
  const stock = Stock_masters.value.filter(
    (stock) => !stock?.icoming_parent_id
  );
  return stock;
};

export const documentsMapper = async (docs) => {
  let result = [];
  for (const doc of docs) {
    result.push({
      id: doc?.id,
      quantity: doc?.quantity,
      item: await getItemById(doc?.item_id)?.nm_item,
      product_created: ddmmyyyy(doc?.product_created, "-"),
    });
  }

  return result;
};

export const setStockParent = async (idsOfStock, icoming_parent_id) => {
  // updaate state
  Stock_masters.value = Stock_masters.value.map((stock) => {
    if (idsOfStock.includes(stock?.id)) {
      return { ...stock, icoming_parent_id };
    }
    return stock;
  });
  // update in db
  await updateStockById(idsOfStock, { icoming_parent_id });
};

export const itemThatAvailable = async () => {
  // get all item firsst
  await gettingStartedRecord();
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

export const getAvailableDateByItem = (item_id) => {
  const result = [];
  Stock_masters.value.forEach((stock) => {
    // if availabel and item_id == item_id
    if (stock?.item_id == item_id && stock?.available > 0) {
      result.push({
        id: stock?.id,
        product_created:
          "#" +
          ddmmyyyy(stock?.product_created, "-") +
          " | " +
          stock?.kd_produksi
      });
    }
  });
  return result;
};

export const changeAvailableStock = async (id_stock, yourNumberPlusOrMinus) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // get the record
  const findRec = await stockdb.getItem(id_stock);
  // isTaken value
  const isTaken =
    Number(findRec?.quantity) !=
    Number(findRec?.available) + Number(yourNumberPlusOrMinus)
      ? true
      : false;

  // set new Available, check is that >= 0
  const available = Number(findRec?.available) + Number(yourNumberPlusOrMinus) >= 0 ? Number(findRec?.available) + Number(yourNumberPlusOrMinus) : false
  // if > 0
  if(available !== false) {
    // new item
    const keyValueToUpdate = { available, isTaken };
    // save to database
    await updateStockById(id_stock, keyValueToUpdate)
    // return true
    return true;
  } else {
    // find item name
    const item = await getItemById(findRec.item_id)
    // show in alert message
    alert(`Item ${item.nm_item} tidak dapat dimasukkan karena ketersediaan stock kurang dari permintaan`)
    // false return
    return false
  }
};

export const markStockAsTaken = async (id) => {
  await updateStockById(id, { isTaken: true });
};

export const getAllDataToBackup = async () => {
  // initiate idb
  const stockdb = await useIdb(store);
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
      "stock awal",
      ymdTime(date),
      quantity
    );
    // create incoming record
    const incoming = await createIncoming(
      [stock.id],
      "stock awal",
      ymdTime(),
      1,
      "stock awal",
      "stock awal",
      "stock awal",
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
    const stock = await createStock(item, "stock awal", date, quantity);
    // create incoming record
    const incoming = await createIncoming(
      [stock.id],
      "stock awal",
      ymdTime(),
      1,
      "stock awal",
      "stock awal",
      "stock awal",
      null
    );
    // set parent stock
    await setStockParent(stock.id, incoming.id);
  }
};

export const getSTockByIdInState = (idStock) => {
  return Stock_masters.value.find((rec) => rec?.id === idStock)
}


export const changeQuantityStock = async (id_stock, yourNumberPlusOrMinus) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // get the record
  const findRec = await stockdb.getItem(id_stock);
  // decrement or increment quantity
  const quantity = findRec?.quantity + yourNumberPlusOrMinus
  // available_end ate, if quantity 0 set to now, else next year
  const keyValueToUpdate = { 
    quantity, 
    available_end: quantity == 0 ? time() : getNextYearTime(),
  };
  // saveData()
  await stockdb.updateItem(id_stock, keyValueToUpdate)
  return;
};


export const getStockByIdForIncomingForm = async (id) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // get all output
  const allOutput = await getTotalStockTaken(id)
  // console.log(res[0]);
  const findStock = await stockdb.getItem(id);
  return findStock
    ? { ...findStock, quantity: (findStock?.quantity + allOutput.allFinished)}
    : {
        item_id: "Not found",
        kd_produksi: "Not found",
        product_created: "Not found",
        quantity: "Not found",
      };
};

export const getStockMasterByItemId = async (item_id) => {
  // we will use jurnal produk masuk
  const { getJurnalProdukMasukById } = useJurnalProdukMasuk()
  // initiate idb
  const stockdb = await useIdb(store);
  // get item name
  const item = await getItemById(item_id)
  // vairable thatt will contain result
  let result = []
  // get data from db based on item id
  const allStock = await stockdb.getItemsByKeyValue('item_id', item_id)
  // loop all stock to map it
  for( const stock of allStock) {
    // get incoming information
    const incomingInfo = await getIncomingById(stock?.icoming_parent_id);
    // get incoming type info
    const type = await getJurnalProdukMasukById(incomingInfo.type)
    // push result
    // get stock that has ben out
    const allOutputFinished = await getTotalStockTaken(stock.id)
    result.push({
      tanggal: ddmmyyyy(incomingInfo.tanggal, "-"),
      shift: incomingInfo.shift,
      type: "Stock Masuk",
      nama_item: item.nm_item,
      keterangan: type.nama_jurnal,
      tanggal_produksi: ddmmyyyy(stock.product_created, '-'),
      quantity: stock?.quantity + allOutputFinished.allFinished,
    })
    // get output based on stock master id
    const allOutput = await getOutputByStockMasterId(stock.id)
    // concat with result
    if(allOutput.length) {
      result = result.concat(allOutput)
    }
  }
  return result
}