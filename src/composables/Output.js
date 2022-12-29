import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// import { getItemById } from "./MasterItems";
import { ymdTime, ddmmyyyy } from "../utils/dateFormat";
// store name
const store = "output_transaction";
// generator id
import { generateId } from "../utils/GeneratorId";
// import set parent function for stock master
import { setStockParent, getStockById, changeAvaliableStock } from "./StockMaster";
import { getItemById } from "./MasterItems";

// the state
export const Output_transaction = ref([]);

const saveData = () => {
  const data = JSON.stringify(Output_transaction.value);
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

export const createOutput = async (tanggal, type, shift, nomor_so, stock_master_id, quantity) => {
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId("OUTPUT_TR22030000");
  // initiate new record
  const record = {
    tanggal,
    type,
    id: nextId,
    nomor_so,
    stock_master_id,
    shift,
    quantity: Number(quantity)
  };
  // // push to state
  Output_transaction.value.unshift(record);
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // // save tolocalstorage
  saveData();
  // set parent for each stock master
  changeAvaliableStock(stock_master_id, -Number(quantity))
  return record;
};

export const gettingStartedRecord = () => {
  // dapatkan last used
  if (!Output_transaction.value.length) {
    const item = localStorage.getItem(store);
    Output_transaction.value = item ? JSON.parse(item) : [];
  }
  return;
};

export const removeOutputById = async (id) => {
  Output_transaction.value = Output_transaction.value.filter((rec) => {
        if(rec.id !== id) {
            return rec
        }
        changeAvaliableStock(rec?.stock_master_id, rec?.quantity)
    }
  );
  saveData();
  return;
};

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getOutputById = (id) => {
  gettingStartedRecord();
  // console.log(res[0]);
  const findStock = Output_transaction.value.find((rec) => rec?.id == id);
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

// export const updateIncomingById = (id, keyValueToUpdate) => {
//   Output_transaction.value = Output_transaction.value.map((item) => {
//     return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
//   });
//   saveData();
//   return;
// };

// export const getStockWithoutParent = () => {
//   gettingStartedRecord();
//   const stock = Output_transaction.value.filter(
//     (stock) => !stock?.icoming_parent_id
//   );
//   return stock;
// };

export const outputTransactionMapped = () => {
  gettingStartedRecord()
  const result = Output_transaction.value.map((doc) => {
    // get master stock
    const master = getStockById(doc?.stock_master_id)
    // get item
    const item = getItemById(master.item_id)
        return {
          id: doc?.id,
          tanggal: ddmmyyyy(doc?.tanggal, "-"),
          shift: doc?.shift,
          nomor_so: doc?.nomor_so,
          nm_item: item?.nm_item,
          product_created: ddmmyyyy(master.product_created, "-"),
          quantity: doc?.quantity,
        }
  }
  );
  return result.flat()
};
