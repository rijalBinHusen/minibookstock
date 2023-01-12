import { useIdb } from "../utils/localforage";
import { summary } from "../utils/summaryIdb";
import { generateId } from "../utils/GeneratorId";
import { time } from "../utils/dateFormat";
import { ref } from "vue";

const store = "sales_orders";

// state
export const sales_orders = ref([]);

export const createSalesOrder = async (tanggal_so, nomor_so, customer) => {
  const db = await useIdb(store);
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId("SO_22030000");
  // initiate new record
  const record = {
    created: new Date().getTime(),
    id: nextId,
    tanggal_so,
    nomor_so,
    customer,
    imported: time(),
    childItemsOrder: [],
  };
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // save to indexeddb
  await db.setItem(nextId, record);
  // push to state
  sales_orders.value.push(record);
  //  return next id
  return nextId;
};

export const removeSalesOrderById = async (id) => {
  // initiate idb
  const db = await useIdb(store);
  // remove from indexeddb
  await db.removeItem(id);
  // renew state
  sales_orders.value = sales_orders.value.filter((val) => val.id !== id);
  // return true
  return true;
};

export const getSalesOrderById = async (id) => {
  // initiate idb
  const db = await useIdb(store);
  // find stock
  const findSalesOrder = await db.getItem(id);
  return findSalesOrder
    ? findSalesOrder
    : {
        tanggal_so: "Not found",
        nomor_so: "Not found",
        customer: "Not found",
      };
};

export const updateSalesOrderById = async (id, keyValueToUpdate) => {
  // initiate idb
  const db = await useIdb(store);
  // update in idb
  await db.updateItem(id, keyValueToUpdate);
  // update state
  sales_orders.value = sales_orders.value.map((rec) => {
    return rec?.id === id ? { ...rec, ...keyValueToUpdate } : rec;
  });
  // saveData();
  return true;
};

export const addChildItemsOrder = async (idSO, itemOrderId) => {
  // initiate idb
  const db = await useIdb(store);
  // get record first
  const record = await db.getItem(idSO);
  // push new itemOrderId
  record.childItemsOrder.push(itemOrderId);
  // update state
  sales_orders.value = sales_orders.value.map((rec) => {
    return rec?.id === idSO ? record : rec;
  });
  // update in db
  await db.setItem(idSO, record);
};

export const getSalesOrderIdByNomorSO = async (nomor_so) => {
  // initiate idb
  const db = await useIdb(store);
  // get db by nomor so
  const isRecordExist = await db.findOneItemByKeyValue("nomor_so", nomor_so);
  // return result
  return isRecordExist?.id;
};

export const getSalesOrder = async () => {
  if (!sales_orders.value.length) {
    // sales order == 0
    const db = await useIdb(store);
    // get all sales order
    const allSalesOrder = await db.getItems();
    // state
    sales_orders.value = allSalesOrder;
    // return
    return;
  }
  // initiate idb
};

export const getAllDataToBackup = async () => {
  // initiate db
  const outputdb = await useIdb(store);
  // get all data
  const allData = await outputdb.getItems();
  // return the result
  return { store, data: allData ? allData : null };
};

export const removeChildItemsOrder = async (idSOrder, itemOrderId) => {
  // get the record first
  const record = await getSalesOrderById(idSOrder);
  // if record not found
  if(!record?.id) {
    return;
  }
  // new  childItemsOrder
  let newChildItemsOrder = [];
  // if the childItemsOrder contain item orderId, remove it
  if (record.childItemsOrder.includes(itemOrderId)) {
    newChildItemsOrder = record.childItemsOrder.filter(
      (child) => child != itemOrderId
    );
  }
  // if newChildItemsOrder.length, update the record
  if (newChildItemsOrder.length) {
    await updateSalesOrderById(idSOrder, {
      childItemsOrder: newChildItemsOrder,
    });
  }
  // else, childItemsOrder.length === 0, remove sales order
  else {
    await removeSalesOrderById(idSOrder);
  }
  return;
};
