import { useIdb } from "../utils/localforage"
import { summary } from "../utils/summaryIdb"
import { generateId } from "../utils/GeneratorId"

const store = "item_orders"

export const createItemOrder = async (item_id, order) => {
  const db = await useIdb(store)
    // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated ? generateId(summaryRecord?.lastUpdated?.lastId) : generateId("ITEM_ORDER_TR22030000");
  // initiate new record
  const record = {
    created: new Date().getTime(),
    id: nextId,
    item_id,
    order
  };
  console.log('create item order', record)
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // save to indexeddb
  await db.setItem(nextId, record);
  //  return next id
  return nextId;
}


export const removeItemOrderById = async (id) => {
    // initiate idb
    const db = await useIdb(store);
    // remove from indexeddb
    await db.removeItem(id);
    // return true
    return true;
  };

  export const getItemOrderById = async (id) => {
    // initiate idb
    const db = await useIdb(store);
    // find stock
    const findSalesOrder = await db.getItem(id);
    return findSalesOrder
      ? findSalesOrder
      : {
            id: "Not found",
            item_id: "Not found",
            order: "Not found",
        };
  };
  
  export const updateItemOrderById = async (id, keyValueToUpdate) => {
    // initiate idb
    const db = await useIdb(store);
    // update in idb
    await db.updateItem(id, keyValueToUpdate);
    // saveData();
    return true;
  };