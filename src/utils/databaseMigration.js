import { useIdb } from './localforage';
import {
  getStockThatAvailable,
  Stock_masters,
  changeAvailableStock,
} from '../composables/StockMaster';
import {
  loaderMessage,
  launchForm,
  closeModalOrDialog,
} from '../composables/launchForm';

const currentVersion = 1;

// function to migration to 1
async function migrationToV1() {
  // launch loader
  launchForm('Loader');
  // in this migration we're only need to get stock quantity > 1.
  // the stock available we're set as = stock?.quantity + stock?.allFinished - stock?.allTaken
  // that will handle by function changeavailable in stock master
  await getStockThatAvailable();
  // waiting for 3 second until the state complete
  await new Promise((res) => {
    setTimeout(() => {
      res();
    }, 3000);
  });

  for (let [index, stock] of Stock_masters.value.entries()) {
    // show messsage to loader
    loaderMessage(
      `Melakukan migrasi stock master ${index + 1} dari ${
        Stock_masters.value.length
      }`
    );

    await changeAvailableStock(stock?.id);
  }
}

class DatabaseVersion {
  #db = useIdb('database_version');
  #keyDocument = 'current_version';

  constructor() {
    this.currentDbVersion = currentVersion;
  }

  async setVersion(yourVersion) {
    await this.#db.setItem(this.#keyDocument, {
      id: this.#keyDocument,
      version: yourVersion,
    });
  }

  async getCurrentDatabaseVersion() {
    const ver = await this.#db.getItem(this.#keyDocument);
    return ver?.version;
  }
}

export async function CheckMigration() {
  const dbVersion = new DatabaseVersion();

  const nowVersion = await dbVersion.getCurrentDatabaseVersion();

  // noversion
  const nothing = isNaN(nowVersion);
  if (nothing || nowVersion < 1) {
    await migrationToV1();
    await dbVersion.setVersion(1);
    CheckMigration();
    return;
  }
  closeModalOrDialog();
}
