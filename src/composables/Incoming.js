import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// import { getItemById } from "./MasterItems";
import { ymdTime, ddmmyyyy } from "../utils/dateFormat";
// store name
const store = "incoming_transaction";
// generator id
import { generateId } from "../utils/GeneratorId";
// import set parent function for stock master
import { setStockParent, getStockById } from "./StockMaster";
// master item function
import { getItemById } from "./MasterItems";
// import localforage function
import { useIdb } from "../utils/localforage";

// the state
export const Incoming_transaction = ref([]);

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
 */

export const createIncoming = async (
  stock_master_ids,
  paper_id,
  tanggal,
  shift,
  diterima,
  type,
  diserahkan,
  catatan
) => {
  // initiate idb
  const incomedb = await useIdb(store);
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId("INCOMING_TR22030000");
  // initiate new record
  const record = {
    id: nextId,
    stock_master_ids,
    paper_id,
    tanggal: ymdTime(tanggal),
    shift,
    diterima,
    type,
    diserahkan,
    catatan,
  };
  // // push to state
  Incoming_transaction.value.unshift(record);
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // // save tolocalstorage
  // saveData();
  // save to indexeddb
  await incomedb.setItem(nextId, record);
  // set parent for each stock master
  stock_master_ids.forEach((stockId) => {
    setStockParent(stockId, nextId);
  });
  // return the whole record
  return record;
};

export const gettingStartedRecord = async () => {
  // dapatkan last used
  if (!Incoming_transaction.value.length) {
    // initiate idb
    const incomedb = await useIdb(store);
    // get all item
    const item = await incomedb.getItems();
    Incoming_transaction.value = item ? item : [];
  }
  return;
};

export const removeIncomingById = async (id) => {
  // initiate idb
  const incomedb = await useIdb(store);
  // remove from state
  Incoming_transaction.value = Incoming_transaction.value.filter(
    (rec) => rec.id !== id
  );
  // saveData();
  // remove from indexeddb
  await incomedb.removeItem(id);
  return;
};

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getIncomingById = async (id) => {
  // initiate idb
  const incomedb = await useIdb(store);
  // find stock
  const findIncome = await incomedb.getItem(id);
  return findIncome
    ? findIncome
    : {
        paper_id: "Not found",
        tanggal: "Not found",
        shift: "Not found",
        diterima: "Not found",
        type: "Not found",
        diserahkan: "Not found",
        catatan: "Not found",
      };
};

export const updateIncomingById = async (id, keyValueToUpdate) => {
  // initiate idb
  const incomedb = await useIdb(store);
  // update the state
  Incoming_transaction.value = Incoming_transaction.value.map((item) => {
    return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
  });
  // update in idb
  incomedb.updateItem(id, keyValueToUpdate);
  // saveData();
  return;
};

// export const getStockWithoutParent = () => {
//   gettingStartedRecord();
//   const stock = Incoming_transaction.value.filter(
//     (stock) => !stock?.icoming_parent_id
//   );
//   return stock;
// };

export const incomingTransactionMapped = async () => {
  const result = [];
  // if the state null
  if (!Incoming_transaction.value || !Incoming_transaction.value.length) {
    return result;
  }
  // map all state
  for (const income of Incoming_transaction.value) {
    // map stock master by stock master ids
    for (const id of income?.stock_master_ids) {
      // get stock master by id
      const stockMaster = await getStockById(id);
      // get nm_item from based on stockMaster.item_id
      const item = await getItemById(stockMaster?.item_id);
      result.push({
        id: income?.id,
        tanggal: ddmmyyyy(income?.tanggal, "-"),
        shift: income?.shift,
        paper_id: income?.paper_id,
        nm_item: item?.nm_item,
        quantity: stockMaster?.quantity,
        available: stockMaster?.available,
        product_created: ddmmyyyy(stockMaster?.product_created, "-"),
      });
    }
  }
  return result;
};

export const getAllDataToBackup = async () => {
  // initiate idb
  const incomedb = await useIdb(store);
  // get all data
  const allData = await incomedb.getItems();
  // return the result
  return { store, data: allData ? allData : null };
};

export const getRecordByDate = async () => {
  // initiate idb
  const incomedb = await useIdb(store);
  // get income by date
  Incoming_transaction.value = await incomedb.getItemsByKeyValue(
    "tanggal",
    ymdTime(dateRecordToShow.value)
  );
  // return
  return;
}