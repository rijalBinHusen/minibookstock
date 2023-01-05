import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// import { getItemById } from "./MasterItems";
import { ymdTime, ddmmyyyy } from "../utils/dateFormat";
// store name
const store = "output_transaction";
// generator id
import { generateId } from "../utils/GeneratorId";
// import set parent function for stock master
import { getStockById, changeAvailableStock, changeQuantityStock } from "./StockMaster";
// import item function
import { getItemById } from "./MasterItems";
// import idb
import { useIdb } from "../utils/localforage";

// the state
export const Output_transaction = ref([]);

// what date to show
export const dateRecordToShow = ref(new Date())

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
  // initiate db
  const outputdb = await useIdb(store)
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
    quantity: Number(quantity)
  };
  // // push to state
  Output_transaction.value.unshift(record);
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // // save tolocalstorage
  // saveData();
  await outputdb.setItem(nextId, record)
  // change available master stock
  await changeAvailableStock(stock_master_id, -Number(quantity))
  return record;
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
  // initiate db
  const outputdb = await useIdb(store)
  // get record by date
  Output_transaction.value = await outputdb.getItemsByKeyValue(
    "tanggal",
    ymdTime(dateRecordToShow.value)
  );
  // 
  return;
}

export const removeOutputById = async (id) => {
  // initiate db
  const outputdb = await useIdb(store)
  // remove from statate
  Output_transaction.value = Output_transaction.value.filter((rec) => {
        if(rec.id !== id) {
            return rec
        }
        // change available stock
        changeAvailableStock(rec?.stock_master_id, Number(rec?.quantity))
    }
  );
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
  const outputdb = await useIdb(store)
  // console.log(res[0]);
  const findStock = await outputdb.getItem(id)
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
  const outputdb = await useIdb(store)
  // update in state
  Output_transaction.value = Output_transaction.value.map((item) => {
    return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
  });
  // update in db
  outputdb.updateItem(id, keyValueToUpdate);
  return;
};

// export const getStockWithoutParent = () => {
//   gettingStartedRecord();
//   const stock = Output_transaction.value.filter(
//     (stock) => !stock?.icoming_parent_id
//   );
//   return stock;
// };

export const outputTransactionMapped = async () => {
  const result = []
  // if the state null
  if (!Output_transaction.value || !Output_transaction.value.length) {
    return result;
  }
  // Output_transaction.value.forEach((doc) => {
  for(const doc of Output_transaction.value) {

    // get master stock
    const master = await getStockById(doc?.stock_master_id)
    // get item
    const item = await getItemById(master.item_id)
    result.push ({
      id: doc?.id,
      tanggal: ddmmyyyy(doc?.tanggal, "-"),
      shift: doc?.shift,
      nomor_so: doc?.nomor_so,
      nm_item: item?.nm_item,
      product_created: ddmmyyyy(master.product_created, "-"),
      quantity: doc?.quantity,
      isFinished: doc?.isFinished
    })
  }
  // }
  // );
  return result
};

export const markAsFinished = async (id) => {
  // mark in state
  Output_transaction.value = Output_transaction.value.map((doc) => {
    if(doc?.id === id) {
      // update the quantity
      // changeAvailableStock(doc?.stock_master_id,)
      // mark as finished
      return { ...doc, isFinished: true}
    } 
    return doc
  });
  // get record
  const findRec = await getOutputById(id)
  // get stock master id
  const masterId = findRec?.stock_master_id
  // update quantity stock
  await changeQuantityStock(masterId, -Number(findRec?.quantity))
  // mark in db output as finished
  await updateOutputById(id, { isFinished: true })
}

export const getAllDataToBackup = async () => {
  // initiate db
  const outputdb = await useIdb(store)
  // get all data
  const allData = await outputdb.getItems(store)
  // return the result
  return { store, data: allData ? allData : null }
}

export const getTotalStockTaken = async (id_stock_master) => {
  // initiate db
  const outputdb = await useIdb(store)
  // get all Stock master that taken
  const allOutput = await outputdb.getItemsByKeyValue('stock_master_id', id_stock_master)
  // total all output
  let allTaken = 0
  // total output that finished = true
  let allFinished = 0;
  // loop all output
  if(allOutput && allOutput.length) {
    for(const out of allOutput) {
      //  if finished true
      if(out?.isFinished) {
        // increment is finished
        allFinished = allFinished + Number(out?.quantity)
      }
      // incremen all taken
      allTaken = allTaken + Number(out?.quantity)
    }
  }

  // will return 0 or > 0
  return { allTaken, allFinished}
}