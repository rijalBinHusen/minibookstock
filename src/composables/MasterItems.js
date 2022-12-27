import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// store name
const store = "items";
// generator id
import { generateId } from "../utils/GeneratorId";
// // import { dayPlusOrMinus } from "../utils/dateFormat";

// the state
export const Master_items = ref([]);

const saveData = () => {
  const data = JSON.stringify(Master_items.value);
  localStorage.setItem(store, data);
};

export const createItem = async (
  kd_item,
  nm_item,
  division,
  last_used,
  age_item
) => {
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId("ITM22030000");
  // initiate new record
  const record = {
    id: nextId,
    kd_item,
    nm_item,
    division,
    last_used,
    age_item,
    // sort: summaryRecord?.sort ? summaryRecord?.sort + 1 : 1,
  };
  // // push to state
  Master_items.value.unshift(record);
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // // save tolocalstorage
  saveData();

  return nextId;
};

export const gettingStartedRecord = () => {
  // dapatkan last used
  if (!Master_items.value.length) {
    const item = localStorage.getItem(store);
    Master_items.value = item ? JSON.parse(item) : [];
  }
  return;
};

// // // export const removeVehicle = async (id) => {
// // //   const res = await removeRecord(table, "id", id);
// // //   if (res) {
// // //     Master_items.value = Master_items.value.filter((veh) => veh.id !== id);
// // //   }
// // //   return;
// // // };

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getItemById = (id) => {
  gettingStartedRecord();
  // console.log(res[0]);
  const findItem = Master_items.value.find((rec) => rec?.id == id);
  return findItem
    ? findItem
    : {
        kd_item: "Not found",
        nm_item: "Not found",
      };
};

export const updateItemById = (id, keyValueToUpdate) => {
  Master_items.value = Master_items.value.map((item) => {
    return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
  });
  saveData();
  return;
};

export const getItemIdByKdItem = (kd_item) => {
  const findItem = Master_items.value.find((rec) => rec?.kd_item == kd_item);
  return findItem
    ? findItem
    : {
        kd_item: "Not found",
        nm_item: "Not found",
      };
};
