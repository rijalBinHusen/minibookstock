import { ref } from "vue";
import {
  insertRecord,
  getRecordOrderByIdDescLimit,
  removeRecord,
  getRecordByCriteria,
  updateRecordById,
  connection,
} from "../utils/jsStore";
import { generateId } from "../utils/GeneratorId";
import { dayPlusOrMinus } from "../utils/dateFormat";

const columns = "id, kd_item, nm_item, division, last_used, sort";
const table = "master_items";

export const Master_items = ref([]);

export const createItem = async (kd_item, nm_item, division, last_used) => {
  const LastRecord = await getLastRecord();
  const nextId = LastRecord?.id
    ? generateId(LastRecord?.id)
    : generateId("VEH22030000");
  const record = {
    id: nextId,
    kd_item,
    nm_item,
    division,
    last_used,
    sort: LastRecord?.sort ? LastRecord?.sort + 1 : 1,
  };
  await insertRecord(table, record);

  Master_items.value.unshift(record);

  return;
};

export const gettingStartedRecord = async () => {
  // dapatkan last used < 1 minggu
  Master_items.value = await connection.select({
    from: table,
    where: {
      last_used: {
        ">=": dayPlusOrMinus(null, 7),
      },
    },
  });
};

// export const removeVehicle = async (id) => {
//   const res = await removeRecord(table, "id", id);
//   if (res) {
//     Master_items.value = Master_items.value.filter((veh) => veh.id !== id);
//   }
//   return;
// };

// export const
export const getLastRecord = async () => {
  const lastRec = await getRecordOrderByIdDescLimit(table, 1);
  return lastRec[0];
};

export const getItemById = async (id) => {
  const res = await getRecordByCriteria(table, "id", id);
  // console.log(res[0]);
  return res[0]
    ? res[0]
    : {
        kd_item: "Not found",
        nm_item: "Not found",
      };
};

export const updateItemById = async (id, keyValueToUpdate) => {
  await updateRecordById(table, id, keyValueToUpdate);
  Master_items.value = Master_items.value.map((item) => {
    return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
  });
  return;
};
