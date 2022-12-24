import { ref } from "vue";
import { connection } from "./jsStore";
import { generateId } from "./GeneratorId";

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

  await connection.insert({
    into: table,
    values: [
      {
        id: nextId,
        nomor_do,
        nomor_so,
        register,
        start,
        finished,
        plat_nomor,
        customer,
      },
    ],
  });

  return nextId;
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
