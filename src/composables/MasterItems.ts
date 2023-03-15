import { ref } from "vue";
// store name
const store = "items";
import { useIdb } from "../utils/localforage";
const dbitems = useIdb(store);
const isGetAllItem = ref(<boolean>false)

interface Item {
  id: string;
  kd_item: string;
  nm_item: string;
  division: string;
  last_used: number;
  age_item: number;
  sort_item: number;
}

// the state
export const Master_items = ref(<ItemClass[]>[]);

export const createItem = async (kd_item: string, nm_item: string, division: string, last_used:number, age_item:number, sort_item: number) => {
  // initiate new record
  const record = { kd_item, nm_item, division, last_used, age_item, sort_item };
  // save to indexeddb
  const recordInserted = await dbitems.createItem(record);
  // push to state
  Master_items.value.unshift(
    new ItemClass(
      recordInserted?.id,
      kd_item,
      nm_item,
      division,
      last_used,
      age_item,
      sort_item
    )
  );

  return recordInserted?.id;
};

export const gettingStartedRecord = async () => {
  if (!Master_items.value.length || !isGetAllItem.value) {
    // get all item
    const items = <Item[]> await dbitems.items();
    // dapatkan last used
    Master_items.value = items.map(
      (rec) =>
        new ItemClass(
          rec?.id,
          rec?.kd_item,
          rec?.nm_item,
          rec?.division,
          rec?.last_used,
          rec?.age_item,
          rec?.sort_item
        )
    );
    isGetAllItem.value = true
  }
  return;
};

export const getItemById = async (id: string) => {
  const findItemInState = Master_items.value.find((rec) => rec?.id === id);

  if (findItemInState) {
    return findItemInState;
  }
  // get item
  const item = await dbitems.getItem(id);

  const itemToClass = new ItemClass(
    item?.id,
    item?.kd_item,
    item?.nm_item,
    item?.division,
    item?.last_used,
    item?.age_item,
    item?.sort_item
  );

  Master_items.value.push(itemToClass);

  return item
    ? itemToClass
    : {
        kd_item: "Not found",
        nm_item: "Not found",
      };
};

export const updateItemById = async (id: string, kdItem: string, nmItem: string, division: string, lastUsed: number, ageItem: number, sort_item: number) => {
  const findRecordInState = Master_items.value.find((rec) => rec?.id === id);

  if (findRecordInState) {
    await findRecordInState.updateItemValue(
      kdItem,
      nmItem,
      division,
      lastUsed,
      ageItem,
      sort_item
    );
    return;
  }
  // find record in db
  const record = await getItemById(id) as Item;
  const recordClass = new ItemClass(
    record?.id,
    record?.kd_item,
    record?.nm_item,
    record?.division,
    record?.last_used,
    record?.age_item,
    record?.sort_item
  );

  await recordClass.updateItemValue(kdItem, nmItem, division, lastUsed, ageItem, sort_item);
  return;
};

export const getItemIdByKdItem = async (kd_item: string) => {
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

class ItemClass {
  id: string;
  kd_item: string;
  nm_item: string;
  division: string;
  last_used: number;
  age_item: number;
  sort_item: number;

  constructor(id: string, kd_item: string, nm_item: string, division: string, last_used: number, age_item: number, sort_item: number) {
    this.id = id;
    this.kd_item = kd_item;
    this.nm_item = nm_item;
    this.division = division;
    this.last_used = last_used;
    this.age_item = age_item;
    this.sort_item = sort_item;
  }

  async updateItemValue(kd_item: string, nm_item: string, division: string, last_used: number, age_item: number, sort_item:number ) {
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
    if (sort_item && this.sort_item != sort_item) {
      this.sort_item = sort_item;
      keyValueToUpdate = { ...keyValueToUpdate, sort_item };
    }
    // update on db
    await dbitems.updateItem(this.id, keyValueToUpdate);
  }
}
