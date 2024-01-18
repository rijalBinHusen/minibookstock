import { useIdb } from '../../utils/localforage';

const store = 'item_orders';

export const createItemOrder = async (item_id, order) => {
  const db = useIdb(store);
  // initiate new record
  const record = { item_id, order };
  // save to indexeddb
  const recordInserted = await db.createItem(record);
  //  return next id
  return recordInserted?.id;
};

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
        id: 'Not found',
        item_id: 'Not found',
        order: 'Not found',
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

export const getAllDataToBackup = async () => {
  // initiate db
  const outputdb = await useIdb(store);
  // get all data
  const allData = await outputdb.getItems();
  // return the result
  return { store, data: allData ? allData : null };
};

export const changeOrderValue = async (id, yourMinusOrPlusNumber) => {
  // get the record
  const record = await getItemOrderById(id);
  // decrement the order
  const resultOrder = record.order + yourMinusOrPlusNumber;
  // if order is 0
  if (resultOrder < 1) {
    // remove record
    await removeItemOrderById(id);
    return 0;
  }
  // else
  await updateItemOrderById(id, { order: resultOrder });
  // return result
  return resultOrder;
};
