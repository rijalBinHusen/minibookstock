import { useIdb } from "../utils/localforage";
import { summaryIdb } from "../utils/summaryIdb";
import { ref } from "vue";
// table name
const table = "items";
// create an instance
const dbitems = await useIdb(table);
// get summary for this table
const summary = await summaryIdb(table);

import { generateId } from "../utils/GeneratorId";
// import { dayPlusOrMinus } from "../utils/dateFormat";

// const columns = "id, kd_item, nm_item, division, last_used, sort";
// const table = "master_items";

export const Master_items = ref([]);

export const createItem = async (kd_item, nm_item, division, last_used) => {
  // get last id
  const lastId = summary?.lastUpdated?.lastId;
  // generate next id
  const nextId = lastId ? generateId(lastId) : generateId("ITM22030000");
  // initiate new record
  const record = {
    id: nextId,
    kd_item,
    nm_item,
    division,
    last_used,
    // sort: LastRecord?.sort ? LastRecord?.sort + 1 : 1,
  };
  // insert into indexeddb
  await dbitems.setItem(nextId, { record });
  // update summary
  await summary.updateSummary(nextId);
  // push to state
  Master_items.value.unshift(record);

  return;
};

// export const gettingStartedRecord = async () => {
//   // dapatkan last used < 1 minggu
//   Master_items.value = await connection.select({
//     from: table,
//     where: {
//       last_used: {
//         ">=": dayPlusOrMinus(null, 7),
//       },
//     },
//   });
// };

// // export const removeVehicle = async (id) => {
// //   const res = await removeRecord(table, "id", id);
// //   if (res) {
// //     Master_items.value = Master_items.value.filter((veh) => veh.id !== id);
// //   }
// //   return;
// // };

// // export const
// export const getLastRecord = async () => {
//   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
//   return lastRec[0];
// };

// export const getItemById = async (id) => {
//   const res = await getRecordByCriteria(table, "id", id);
//   // console.log(res[0]);
//   return res[0]
//     ? res[0]
//     : {
//         kd_item: "Not found",
//         nm_item: "Not found",
//       };
// };

// export const updateItemById = async (id, keyValueToUpdate) => {
//   await updateRecordById(table, id, keyValueToUpdate);
//   Master_items.value = Master_items.value.map((item) => {
//     return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
//   });
//   return;
// };
