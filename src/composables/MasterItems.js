import { ref } from 'vue';
// store name
export const store = 'items';
// // import { dayPlusOrMinus } from "../utils/dateFormat";
import { useIdb } from '../utils/localforage';

// the state
export const Master_items = ref([]);

export const createItem = async (
  kd_item,
  nm_item,
  division,
  last_used,
  age_item
) => {
  const dbitems = useIdb(store);
  // initiate new record
  // sort: summaryRecord?.sort ? summaryRecord?.sort + 1 : 1,
  const record = { kd_item, nm_item, division, last_used, age_item };
  // save to indexeddb
  const recordInserted = await dbitems.createItem(record);
  // push to state
  Master_items.value.unshift(recordInserted);

  return recordInserted?.id;
};

export const gettingStartedRecord = async () => {
  if (!Master_items.value.length) {
    // using idb function
    const dbitems = useIdb(store);
    // get all item
    const rec = await dbitems.getItemsLimit(199);
    // console.log(rec);
    // dapatkan last used
    // const item = localStorage.getItem(store);
    Master_items.value = rec ? rec : [];
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

export const getItemById = async (id) => {
  // using idb function
  const dbitems = useIdb(store);
  // console.log(res[0]);
  // const findItem = Master_items.value.find((rec) => rec?.id == id);
  // get item
  const item = await dbitems.getItem(id);

  return item
    ? item
    : {
        kd_item: 'Not found',
        nm_item: 'Not found',
      };
};

export const updateItemById = async (id, keyValueToUpdate) => {
  // using idb function
  const dbitems = useIdb(store);
  // update data in db
  await dbitems.updateItem(id, keyValueToUpdate);
  const findIndexRec = Master_items.value.findIndex((rec) => rec?.id === id);
  // update state
  if (findIndexRec > -1) {
    const record = Master_items.value[findIndexRec];
    Master_items.value.splice(findIndexRec, 1, {
      ...record,
      ...keyValueToUpdate,
    });
  }
  return;
};

export const getItemIdByKdItem = async (kd_item) => {
  // using idb function
  const dbitems = useIdb(store);
  // const findItem = Master_items.value.find((rec) => rec?.kd_item == kd_item);
  // get from db
  const getOne = await dbitems.findOneItemByKeyValue('kd_item', kd_item);
  return getOne
    ? getOne
    : {
        kd_item: 'Not found',
        nm_item: 'Not found',
      };
};

export const getAllDataToBackup = async () => {
  // using idb function
  const dbitems = useIdb(store);
  // get all data
  // const allData = localStorage.getItem(store)
  const allData = await dbitems.getItems();
  // return the result
  return { store, data: allData ? allData : null };
};

export const getItemByIdInState = (id_item) => {
  return Master_items.value.find((item) => item?.id === id_item);
};

class Item {
  constructor(id, kd_item, nm_item, division, last_used, age_item) {
    this.id = id;
    this.kd_item = kd_item;
    this.nm_item = nm_item;
    this.division = division;
    this.last_used = last_used;
    this.age_item = age_item;
  }

  item_id() {
    return this.id;
  }

  nm_item() {
    return this.nm_item;
  }

  async updateItem(kd_item, nm_item, division, last_used, age_item) {
    // key value to update
    let keyValueToUpdate = {};
    // condition for kd_item
    if (kd_item) {
      this.kd_item = kd_item;
      keyValueToUpdate = { ...keyValueToUpdate, kd_item };
    }
    // condition for nm_item
    if (nm_item) {
      this.nm_item = nm_item;
      keyValueToUpdate = { ...keyValueToUpdate, nm_item };
    }
    // condition for division
    if (division) {
      this.division = division;
      keyValueToUpdate = { ...keyValueToUpdate, division };
    }
    // condition for last_used
    if (last_used) {
      this.last_used = last_used;
      keyValueToUpdate = { ...keyValueToUpdate, last_used };
    }
    // condition for age_item
    if (age_item) {
      this.age_item = age_item;
      keyValueToUpdate = { ...keyValueToUpdate, age_item };
    }
    await updateItemById(this.id, keyValueToUpdate);
  }
}
