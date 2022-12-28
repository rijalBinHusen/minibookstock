import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// import { getItemById } from "./MasterItems";
import { ymdTime } from "../utils/dateFormat";
// store name
const store = "incoming_transaction";
// generator id
import { generateId } from "../utils/GeneratorId";
// // import { dayPlusOrMinus } from "../utils/dateFormat";
// import set parent function for stock master
import { setStockParent } from "./StockMaster"

// the state
export const Incoming_transaction = ref([]);

const saveData = () => {
  const data = JSON.stringify(Incoming_transaction.value);
  localStorage.setItem(store, data);
};

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

export const createIncoming = async (stock_master_ids, paper_id, tanggal, shift, diterima, type, diserahkan, catatan) => {
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
    catatan
  };
  // // push to state
  Incoming_transaction.value.unshift(record);
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // // save tolocalstorage
  saveData();
  // set parent for each stock master
  setStockParent(stock_master_ids, nextId);

  return record;
};

export const gettingStartedRecord = () => {
  // dapatkan last used
  if (!Incoming_transaction.value.length) {
    const item = localStorage.getItem(store);
    Incoming_transaction.value = item ? JSON.parse(item) : [];
  }
  return;
};

export const removeIncomingById = async (id) => {
  Incoming_transaction.value = Incoming_transaction.value.filter((rec) => rec.id !== id);
  saveData();
  return;
};

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getIncomingById = (id) => {
  gettingStartedRecord();
  // console.log(res[0]);
  const findStock = Incoming_transaction.value.find((rec) => rec?.id == id);
  return findStock
    ? findStock
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

export const updateIncomingById = (id, keyValueToUpdate) => {
  Incoming_transaction.value = Incoming_transaction.value.map((item) => {
    return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
  });
  saveData();
  return;
};

// export const getStockWithoutParent = () => {
//   gettingStartedRecord();
//   const stock = Incoming_transaction.value.filter(
//     (stock) => !stock?.icoming_parent_id
//   );
//   return stock;
// };

// export const documentsMapper = (docs) => {
//   const res = docs.map((doc) => ({
//     id: doc?.id,
//     quantity: doc?.quantity,
//     item: getItemById(doc?.item_id)?.nm_item,
//     product_created: ddmmyyyy(doc?.product_created, "-"),
//   }));

//   return res;
// };