import { ref } from "vue";
import { useIdb } from "../../utils/localforage";

// store name
const store = "items";
const dbitems = useIdb(store);

export interface Item {
  id: string;
  kd_item: string;
  nm_item: string;
  division: string;
  last_used: number;
  age_item: number;
  sort_item: number;
}

type ItemUpdate = {
  [K in keyof Item]?:  Item[K];
}


// the state
export const Master_items = ref(<Item[]>[]);

export function Items () {

  async function createItem (kd_item: string, nm_item: string, division: string, last_used:number, age_item:number, sort_item: number): Promise<false|string|string[]> {
    
    const errorMessage = [];
    if(!Boolean(kd_item)) errorMessage.push("Kode item tidak boleh kosong");
    if(!Boolean(nm_item)) errorMessage.push("Nama item tidak boleh kosong");
    if(!Boolean(age_item)) errorMessage.push("Umur item tidak boleh kosong");

    if(errorMessage.length) return errorMessage
    
    // initiate new record
    const record = { kd_item, nm_item, division, last_used, age_item, sort_item };
    // save to indexeddb
    const recordInserted = await dbitems.createItem(record);
    
    if(recordInserted){
      // push to state
      Master_items.value.unshift({ id: recordInserted?.id, ...record });
      return recordInserted.id;
    }

    return false;
  };

  async function getAllMasterItems (): Promise<Item[]> {
    
    // get all item
    Master_items.value = await dbitems.getItems<Item>();
    
    return Master_items.value
  };

  async function getItemById (id: string): Promise<Item> {

    const findItemInState = Master_items.value.find((rec) => rec?.id === id);
    if (findItemInState?.id) return findItemInState;
    
    // get item
    const item = await dbitems.getItem<Item>(id) as Item | null;
    if(item?.id) {
        
      Master_items.value.push(item);
      return item
    }
    
    return { kd_item: "Not found", nm_item: "Not found", age_item: 0, division: "", id: "", last_used: 0, sort_item: 0};
  };

  async function updateItemById (id: string, keyValueToUpdate: ItemUpdate): Promise<boolean|string[]> {
    
    const errorMessage = [];
    const keyToUpdate = typeof keyValueToUpdate === 'object' ? Object.getOwnPropertyNames(keyValueToUpdate) : [];
    const isNothingToUpdate = keyToUpdate.length === 0;

    const isKdItemInvalid = keyToUpdate.includes("kd_item") && !Boolean(keyValueToUpdate.kd_item);
    const isNmItemInvalid = keyToUpdate.includes("nm_item") && !Boolean(keyValueToUpdate.nm_item);
    const isAgeItemInvalid = keyToUpdate.includes("age_item") && !Boolean(keyValueToUpdate.age_item);

    if(isKdItemInvalid || isNothingToUpdate) errorMessage.push("Kode item tidak boleh kosong");
    if(isNmItemInvalid || isNothingToUpdate) errorMessage.push("Nama item tidak boleh kosong");
    if(isAgeItemInvalid || isNothingToUpdate) errorMessage.push("Umur item tidak boleh kosong");
    
    if(errorMessage.length) return errorMessage;
    
    const indexItem = Master_items.value.findIndex((rec) => rec?.id === id);

    let itemToUpdate = <Item>{};
    
    if (indexItem > -1) {
      
      itemToUpdate = { ...Master_items.value[indexItem], ...keyValueToUpdate }
      Master_items.value.splice(indexItem, 1, itemToUpdate);
    }

    // find record in db
    else {

      const getItem = await getItemById(id);
      itemToUpdate = { ...getItem, ...keyValueToUpdate }
    }

    const isUpdated = await dbitems.updateItem(id, itemToUpdate)
    return isUpdated;
  };
  
  async function getItemByKdItem (kd_item: string): Promise<Item> {

    const findItem = Master_items.value.find((rec) => rec?.kd_item == kd_item);
    if (findItem?.id) return findItem;
    
  
    // get from db
    const getOne = await dbitems.findOneItemByKeyValue<Item>("kd_item", kd_item);
    return getOne?.id
      ? getOne
      : {
          kd_item: "Not found",
          nm_item: "Not found",
          age_item: 0,
          division: "",
          id: "",
          last_used: 0,
          sort_item: 0,
        };
  };
  
  return {
    createItem, getAllMasterItems, getItemById, updateItemById, getItemByKdItem
  }
}