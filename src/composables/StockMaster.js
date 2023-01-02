import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// item function
import { getItemById, getItemIdByKdItem, createItem } from "./MasterItems";
// date formatter
import { ddmmyyyy, ymdTime } from "../utils/dateFormat";
// store name
const store = "stock_master";
// generator id
import { generateId } from "../utils/GeneratorId";
// incoming function
import { createIncoming } from "./Incoming"
// conver excel date to javascript date
import excelToJSDate from "../utils/ExcelDateToJs"


// the state
export const Stock_masters = ref([]);

const saveData = () => {
  const data = JSON.stringify(Stock_masters.value);
  localStorage.setItem(store, data);
};

/**
 * 
  id string
  item_id string
  kd_produksi datetime
  product_created number
  quantity number
  available number
  icoming_parent_id
 */

export const createStock = async (
  item_id,
  kd_produksi,
  product_created,
  quantity
) => {
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId("STOCK_MASTER22030000");
  // initiate new record
  const record = {
    id: nextId,
    item_id,
    kd_produksi,
    product_created,
    quantity: Number(quantity),
    available: quantity,
  };
  // // push to state
  Stock_masters.value.unshift(record);
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // // save tolocalstorage
  saveData();

  return record;
};

export const gettingStartedRecord = () => {
  // dapatkan last used
  if (!Stock_masters.value.length) {
    const item = localStorage.getItem(store);
    Stock_masters.value = item ? JSON.parse(item) : [];
  }
  return;
};

export const removeStockById = async (id) => {
  Stock_masters.value = Stock_masters.value.filter((rec) => rec.id !== id);
  saveData();
  return;
};

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getStockById = (id) => {
  gettingStartedRecord();
  // console.log(res[0]);
  const findStock = Stock_masters.value.find((rec) => rec?.id == id);
  return findStock
    ? findStock
    : {
        item_id: "Not found",
        kd_produksi: "Not found",
        product_created: "Not found",
        quantity: "Not found",
      };
};

export const updateStockById = (id, keyValueToUpdate) => {
  Stock_masters.value = Stock_masters.value.map((item) => {
    return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
  });
  saveData();
  return;
};

export const getStockWithoutParent = () => {
  gettingStartedRecord();
  const stock = Stock_masters.value.filter(
    (stock) => !stock?.icoming_parent_id
  );
  return stock;
};

export const documentsMapper = (docs) => {
  const res = docs.map((doc) => ({
    id: doc?.id,
    quantity: doc?.quantity,
    item: getItemById(doc?.item_id)?.nm_item,
    product_created: ddmmyyyy(doc?.product_created, "-"),
  }));

  return res;
};

export const setStockParent = (idsOfStock, icoming_parent_id) => {
  Stock_masters.value = Stock_masters.value.map((stock) => {
    if(idsOfStock.includes(stock?.id)) {
      return { ...stock, icoming_parent_id}
    }
    return stock
  })
  saveData()
}

export const itemThatAvailable = () => {
  gettingStartedRecord();
  // record item that was taken
  let isItemTaken = []
  // result of item
  let result = []
  Stock_masters.value.forEach((stock) => {
    if(stock?.available > 0 && !isItemTaken.includes(stock?.item_id)) {
      const item = getItemById(stock?.item_id)
      isItemTaken.push(stock?.item_id)
      result.push({
        item_id: stock?.item_id,
        kd_item: item?.kd_item,
        nm_item: item?.nm_item,
      })
    }
  })
  return result;
}

export const getAvailableDateByItem = (item_id) => {
  const result = []
  Stock_masters.value.forEach((stock) => {
    if(stock?.item_id == item_id && stock?.available > 0) {
      result.push({
        id: stock?.id,
        product_created: "kode " + stock?.kd_produksi+ " * Tanggal produk "+ ddmmyyyy(stock?.product_created, "-")
      })
    }
  })
  return result;
}

export const changeAvaliableStock = (id_stock, yourNumberPlusOrMinus) => {
  Stock_masters.value = Stock_masters.value.map((stock) => {
    if(stock?.id == id_stock) {
      // if available not equal to quantity, mark stock as taken
      if(Number(stock?.quantity) != Number(stock?.available) + Number(yourNumberPlusOrMinus)) {
        return { 
            ...stock, 
            available: Number(stock?.available) + Number(yourNumberPlusOrMinus),
            isTaken: true
          }
      }
      // else
      return { 
        ...stock, 
        available: Number(stock?.available) + Number(yourNumberPlusOrMinus),
        isTaken: false
      }
    } 
    return stock
  })
  saveData()
}


// export const changeQuantityStock = (id_stock, yourNumberPlusOrMinus) => {
//   Stock_masters.value = Stock_masters.value.map((stock) => {
//     if(stock?.id == id_stock) {
//       return { ...stock, quantity: Number(stock?.available) + Number(yourNumberPlusOrMinus)}
//     } 
//     return stock
//   })
//   saveData()
// }

export const markStockAsTaken = (id) => {
  updateStockById(id, { isTaken: true })
}


export const getAllDataToBackup = () => {
  // get all data
  const allData = localStorage.getItem(store)
  // return the result
  return { store, data: allData ? JSON.parse(allData) : null }
}

export const createStockAwal = async (kode_item, nama_item, umur_product, quantity, tanggal_produksi) => {
  // convert excel date to javascript date
  const date = excelToJSDate(tanggal_produksi)
  // cari dulu itemnya sudah ada atau belum
  const isItemExists = getItemIdByKdItem(kode_item)
  // jika ada langsung input ke master
  if(isItemExists?.id) {
    // create new stock
    const stock = await createStock(isItemExists.id, 'stock awal', date, quantity)
    // create incoming record
    const incoming = await createIncoming([stock.id], 'stock awal', ymdTime(), 1, 'stock awal', 'stock awal', 'stock awal', null)
    // set parent stock
    setStockParent(stock.id, incoming.id)
  } else {
    // jika belum ada buat item baru
    // create new item, this will return only id
    const item = await createItem(kode_item, nama_item, null, ymdTime(), Number(umur_product))
    // create new stock
    const stock = await createStock(item, 'stock awal', date, quantity)
    // create incoming record
    const incoming = await createIncoming([stock.id], 'stock awal', ymdTime(), 1, 'stock awal', 'stock awal', 'stock awal', null)
    // set parent stock
    setStockParent(stock.id, incoming.id)
  }
}