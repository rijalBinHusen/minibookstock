import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// item function
import {
  getItemById,
  getItemIdByKdItem,
  createItem,
  Master_items,
} from "./MasterItems";
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
  // map record
  const recordMaped = await documentsMapper(record);
  // // push to state
  Stock_masters.value.unshift(recordMaped);
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // save to indexeddb
  await stockdb.setItem(nextId, record);

  return record;
};

export const gettingStartedRecord = async () => {
  // empty state
  Stock_masters.value = [];
  // initiate idb
  const stockdb = await useIdb(store);
  // get all items
  const stocks = await stockdb.getItems();
  // set state
  for (const stock of stocks) {
    // map stock
    const stockMapped = await documentsMapper(stock);
    // push to state
    Stock_masters.value.unshift(stockMapped);
  }
  // }
  // return;
  wasGetStockThatAvailable.value = false;
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
  // update database
  await stockdb.updateItem(id, keyValueToUpdate);
  // get new record
  const newRec = await stockdb.getItem(id);
  // map new rec
  const newRecMapped = await documentsMapper(newRec);
  // update state
  Stock_masters.value = Stock_masters.value.map((rec) =>
    rec?.id === id ? newRecMapped : rec
  );
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
    product_created_format: ddmmyyyy(doc?.product_created, "-"),
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
  console.log("stockmaster before get", Stock_masters.value);
  // get all item that available
  await getStockThatAvailable();
  console.log("stockmaster after get", Stock_masters.value);
  const result = [];
  Stock_masters.value.forEach((stock) => {
    // if availabel and item_id == item_id
    if (stock?.item_id == item_id && stock?.available > 0) {
      // product create as number
      const product_created_as_number =
        typeof stock?.product_created === "string"
          ? new Date(stock?.product_created).getTime()
          : stock?.product_created;
      result.push({
        id: stock?.id,
        product_created:
          "#" +
          ddmmyyyy(product_created_as_number, "-") +
          " | " +
          stock?.kd_produksi,
        origin_product_created: product_created_as_number,
      });
    }
  });
  // sorting the result
  return result.sort(
    (a, b) => a["origin_product_created"] - b["origin_product_created"]
  );
  // return result;
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
  const available =
    Number(findRec?.available) + Number(yourNumberPlusOrMinus) >= 0
      ? Number(findRec?.available) + Number(yourNumberPlusOrMinus)
      : false;
  // if > 0
  if (available !== false) {
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
      nama_item,
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
      nama_item,
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
  return Stock_masters.value.find((rec) => rec?.id === idStock);
};

export const changeQuantityStock = async (id_stock, yourNumberPlusOrMinus) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // get the record
  const findRec = await stockdb.getItem(id_stock);
  // decrement or increment quantity
  const quantity = findRec?.quantity + yourNumberPlusOrMinus;
  // available_end ate, if quantity 0 set to now, else next year
  const keyValueToUpdate = {
    quantity,
    available_end: quantity == 0 ? time() : getNextYearTime(),
  };
  // update stock
  await updateStockById(id_stock, keyValueToUpdate);
  return;
};

export const getStockByIdForIncomingForm = async (id) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // get all output
  const allOutput = await getTotalStockTaken(id);
  // console.log(res[0]);
  const findStock = await stockdb.getItem(id);
  return findStock
    ? { ...findStock, quantity: findStock?.quantity + allOutput.allFinished }
    : {
        item_id: "Not found",
        kd_produksi: "Not found",
        product_created: "Not found",
        quantity: "Not found",
      };
};

export const getStockMasterByItemId = async (item_id) => {
  // initiate idb
  const stockdb = await useIdb(store);
  // get data from db based on item id
  const allStock = await stockdb.getItemsByKeyValue("item_id", item_id);
  // return all stock
  return allStock;
};

const wasGetStockThatAvailable = ref(false);

export const getStockThatAvailable = async () => {
  if (wasGetStockThatAvailable.value && Stock_masters.value.length) {
    return;
  }
  // mark variable as true
  wasGetStockThatAvailable.value = true;
  // empty state
  Stock_masters.value = [];
  // get stock that available from db
  // initiate idb
  const stockdb = await useIdb(store);
  // stock that available
  const stockAvailable = await stockdb.getItemsByKeyGreaterThan("quantity", 0);
  for (const stock of stockAvailable) {
    // map stock
    const stockMapped = await documentsMapper(stock);
    // push to state
    Stock_masters.value.unshift(stockMapped);
  }
  console.log("get item thata available, state contain", Stock_masters.value);
  // return it
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
      product_created: ddmmyyyy(stock?.product_created, "-"),
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
