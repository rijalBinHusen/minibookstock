import workerInjector from "jsstore/dist/worker_injector";
import { Connection } from "jsstore";

export const connection = new Connection();

connection.addPlugin(workerInjector);

// vehicles
// id, nodo, noso, register, start, finished, plat_no, customer

const tbl_vechicles = {
  name: "vehicles",
  columns: {
    id: { primaryKey: true, dataType: "string", notNull: true },
    no_do: { dataType: "string", notNull: true },
    no_so: { dataType: "string", notNull: true },
    register: { dataType: "number", notNull: true },
    start: { dataType: "number", notNull: true },
    finished: { dataType: "number", notNull: true },
    plat_no: { dataType: "string", notNull: true },
    customer: { dataType: "string", notNull: true },
  },
};

const database = {
  name: "my_report_stock",
  tables: [tbl_vechicles],
};

export const isDbCreated = await connection.initDb(database);

connection.logStatus = true;

export const insertRecord = async (table, record) => {
  const numberOfInserted = await connection.insert({
    into: table,
    values: [record],
    validation: false,
  });
  // return either success or false
  return numberOfInserted > 0 ? true : false;
};

export const getRecordOrderByIdDescLimit = async (table, limit) => {
  const result = await connection.select({
    from: table,
    order: {
      by: "id",
      type: "desc",
    },
    limit,
  });
  return result;
};

export const removeRecord = async (table, whereColumn, equalToCritera) => {
  const rowsDeleted = await connection.remove({
    from: table,
    where: { [whereColumn]: equalToCritera },
  });
  return rowsDeleted;
};

export const getRecordByCriteria = async (
  table,
  whereColumn,
  equalToCritera
) => {
  const results = await connection.select({
    from: table,
    where: {
      [whereColumn]: equalToCritera,
    },
  });
  //results will contains no of rows deleted.
  return results;
};

export const updateRecordById = async (tableName, id, keyValueToUpdate) => {
  var noOfRowsUpdated = await connection.update({
    in: tableName,
    set: keyValueToUpdate,
    where: { id },
  });
  return noOfRowsUpdated > 0 ? true : false;
};
