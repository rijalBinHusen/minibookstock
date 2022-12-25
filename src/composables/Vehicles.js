import { ref } from "vue";
import {
  insertRecord,
  getRecordOrderByIdDescLimit,
  removeRecord,
  getRecordByCriteria,
  updateRecordById,
} from "../models/jsStore";
import { generateId } from "../models/GeneratorId";

const columns =
  "id, nomor_do, nomor_so, plat_nomor, customer, register, start, finished";
const table = "vehicles";

export const Vehicles = ref([]);

export const createVehicle = async (
  nomor_do,
  nomor_so,
  plat_nomor,
  customer,
  register,
  start,
  finished
) => {
  const lastId = await getLastId();
  const nextId = lastId ? generateId(lastId) : generateId("VEH22030000");
  const record = {
    id: nextId,
    nomor_do,
    nomor_so,
    register,
    start,
    finished,
    plat_nomor,
    customer,
  };
  await insertRecord(table, record);

  Vehicles.value.unshift(record);

  return;
};

export const gettingStartedRecord = async () => {
  Vehicles.value = await getRecordOrderByIdDescLimit(table, 50);
};

export const removeVehicle = async (id) => {
  const res = await removeRecord(table, "id", id);
  if (res) {
    Vehicles.value = Vehicles.value.filter((veh) => veh.id !== id);
  }
  return;
};

// export const
export const getLastId = async () => {
  const lastRec = await getRecordOrderByIdDescLimit(table, 1);
  return lastRec[0]?.id;
};

export const getVehicleById = async (id) => {
  const res = await getRecordByCriteria(table, "id", id);
  // console.log(res[0]);
  return res[0]
    ? res[0]
    : {
        nomor_do: "Not found",
        nomor_so: "Not found",
        plat_nomor: "Not found",
        customer: "Not found",
        register: "Not found",
        start: "Not found",
        finished: "Not found",
      };
};

export const updateVehicleById = async (id, keyValueToUpdate) => {
  await updateRecordById(table, id, keyValueToUpdate);
  Vehicles.value = Vehicles.value.map((veh) => {
    return veh?.id == id ? { ...veh, ...keyValueToUpdate } : veh;
  });
  return;
};
