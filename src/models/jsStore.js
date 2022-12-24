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
