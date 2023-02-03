import { summary } from '../utils/summaryIdb';
import { ref } from 'vue';
// store name
const store = 'items';
// generator id
import { generateId } from '../utils/GeneratorId';
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
  const dbitems = await useIdb(store);
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId('ITM22030000');
  // initiate new record
  const record = {
    created: new Date().getTime(),
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
  // saveData();

  // save to indexeddb
  await dbitems.setItem(nextId, record);

  return nextId;
};

export const gettingStartedRecord = async () => {
  if (!Master_items.value.length) {
    // using idb function
    const dbitems = await useIdb(store);
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
  const dbitems = await useIdb(store);
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
  const dbitems = await useIdb(store);
  // update data in db
  await dbitems.updateItem(id, keyValueToUpdate);
  // update state
  Master_items.value = Master_items.value.map((item) => {
    return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
  });
  // saveData();
  return;
};

export const getItemIdByKdItem = async (kd_item) => {
  // using idb function
  const dbitems = await useIdb(store);
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
  const dbitems = await useIdb(store);
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
