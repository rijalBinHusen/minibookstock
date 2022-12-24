import { ref } from "vue";
import { connection } from "../models/jsStore";
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
  await connection.insert({
    into: table,
    values: [record],
    validation: false,
  });

  Vehicles.value.push(record);

  return;
};

export const gettingStartedRecord = async () => {
  Vehicles.value = await connection.select({
    from: table,
    order: {
      by: "id",
      type: "desc",
    },
    limit: 50,
  });
};

export const removeVehicle = async (id) => {
  await connection.remove({
    from: table,
    where: { id },
  });
  Vehicles.value = Vehicles.value.filter((veh) => veh.id !== id);
  return;
};

export const getLastId = async () => {
  const lastRec = await connection.select({
    from: table,
    order: {
      by: "id",
      type: "desc",
    },
    limit: 1,
  });
  return lastRec[0]?.id;
};
