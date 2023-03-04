import { ref } from "vue";
// store name
const store = "items";
import { useIdb } from "../utils/localforage";
const dbitems = useIdb(store);

// the state
export const Master_items = ref([]);

export const createItem = async (
  kd_item,
  nm_item,
  division,
  last_used,
  age_item
) => {
  // initiate new record
  const record = { kd_item, nm_item, division, last_used, age_item };
  // save to indexeddb
  const recordInserted = await dbitems.createItem(record);
  // push to state
  Master_items.value.unshift(
    new Item(
      recordInserted?.id,
      kd_item,
      nm_item,
      division,
      last_used,
      age_item
    )
  );

  return recordInserted?.id;
};

export const gettingStartedRecord = async () => {
  if (!Master_items.value.length) {
    // get all item
    const items = await dbitems.getItemsLimit(199);
    // dapatkan last used
    Master_items.value = items.map(
      (rec) =>
        new Item(
          rec?.id,
          rec?.kd_item,
          rec?.nm_item,
          rec?.division,
          rec?.last_used,
          rec?.age_item
        )
    );
  }
  return;
};

export const getItemById = async (id) => {
  const findItemInState = Master_items.value.find((rec) => rec?.id === id);

  if (findItemInState) {
    return findItemInState;
  }
  // get item
  const item = await dbitems.getItem(id);

  const itemToClass = new Item(
    item?.id,
    rec?.kd_item,
    rec?.nm_item,
    rec?.division,
    rec?.last_used,
    rec?.age_item
  );

  Master_items.value.push(itemToClass);

  return item
    ? itemToClass
    : {
        kd_item: "Not found",
        nm_item: "Not found",
      };
};

export const updateItemById = async (
  id,
  kdItem,
  nmItem,
  division,
  lastUsed,
  ageItem
) => {
  const findRecordInState = Master_items.value.find((rec) => rec?.id === id);

  if (findRecordInState) {
    await findRecordInState.updateItemValue(
      kdItem,
      nmItem,
      division,
      lastUsed,
      ageItem
    );
    return;
  }
  // find record in db
  const record = await getItemById(id);

  await record.updateItemValue(kdItem, nmItem, division, lastUsed, ageItem);
  return;
};

export const getItemIdByKdItem = async (kd_item) => {
  const findItem = Master_items.value.find((rec) => rec?.kd_item == kd_item);
  if (findItem) {
    return findItem;
  }

  // get from db
  const getOne = await dbitems.findOneItemByKeyValue("kd_item", kd_item);
  return getOne
    ? getOne
    : {
        kd_item: "Not found",
        nm_item: "Not found",
      };
};

class Item {
  #db = useIdb(store);

  constructor(id, kd_item, nm_item, division, last_used, age_item) {
    this.id = id;
    this.kd_item = kd_item;
    this.nm_item = nm_item;
    this.division = division;
    this.last_used = last_used;
    this.age_item = age_item;
  }

  async updateItemValue(kd_item, nm_item, division, last_used, age_item) {
    // key value to update
    let keyValueToUpdate = {};
    // condition for kd_item
    if (kd_item && this.kd_item != kd_item) {
      this.kd_item = kd_item;
      keyValueToUpdate = { ...keyValueToUpdate, kd_item };
    }
    // condition for nm_item
    if (nm_item && this.nm_item != nm_item) {
      this.nm_item = nm_item;
      keyValueToUpdate = { ...keyValueToUpdate, nm_item };
    }
    // condition for division
    if (division && this.division != division) {
      this.division = division;
      keyValueToUpdate = { ...keyValueToUpdate, division };
    }
    // condition for last_used
    if (last_used && this.last_used != last_used) {
      this.last_used = last_used;
      keyValueToUpdate = { ...keyValueToUpdate, last_used };
    }
    // condition for age_item
    if (age_item && this.age_item != age_item) {
      this.age_item = age_item;
      keyValueToUpdate = { ...keyValueToUpdate, age_item };
    }
    // update on db
    await this.#db.updateItem(this.id, keyValueToUpdate);
  }
}
