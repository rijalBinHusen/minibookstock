import * as localforage from 'localforage';
import { addLog } from './logging';
import { summary } from './summaryIdb';
import { generateId } from './GeneratorId';

export const useIdb = (storeName: string) => {
  // create instance
  const store = localforage.createInstance({
    name: 'my_report_stock',
    storeName,
  });
  const createItem = async (value: object) => {
    // get summary
    const sum = await summary(storeName);
    // generateID
    const nextId = sum?.lastUpdate && sum?.lastUpdate?.lastId
      ? generateId(sum?.lastUpdate?.lastId)
      : generateId(storeName + '_22030000');

    // record to set
    const record = { ...value, id: nextId, created: new Date().getTime() };
    try {
      // record to logs
      const isLogWrited = await addLog(storeName, 'create', nextId, record);
      if (isLogWrited) {
        // setItem
        await setItem(nextId, record);
        // update summary
        await sum.updateSummary(nextId);
      }
      return record;
    } catch (err) {
      alert('Terjadi kesalahan ketika memasukkan data');
      console.log(err);
      return false;
    }
  };

  const setItem = async (key: string, value: object) => {
    return store.setItem(key, value);
  };

  const getItem = <T>(key: string): Promise<T> => {
    return store.getItem(key);
  };

  const getItemsLimit = async (limit: number) => {
    const result = [];
    return store
      .iterate(function (value, key, iterationNumber) {
        if (iterationNumber < limit && value && key) {
          result.push(value);
        }
        // return result;
      })
      .then(function () {
        // onsole.log("Iteration has completed, last iterated pair:");
        return result;
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  };

  const removeItem = async (key: string) => {
    addLog(storeName, 'remove', key, { id: key });
    await store.removeItem(key);
    return;
  };

  const findOneItemByKeyValue = <T>(keySearch: string, valueSearch: string): Promise<T> => {
    // let result = {};
    return store.iterate(function (value:T) {
      // Resulting key/value pair -- this callback
      // will be executed for every item in the database.
      if (value[keySearch] == valueSearch) return value;
    });
  };

  const getItems = async <T>(): Promise<T[]> => {
    const result = <T[]>[];
    await store.iterate(function (value: T, key) {
        
        if (value && key) result.push(value);
      })
      .then(function () {
        // onsole.log("Iteration has completed, last iterated pair:");
        // return result;
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
    return result;
  };

  const updateItem = async (key: string, keyValueToUpdate: object): Promise<boolean> => {
    // onsole.log('local forage update item', key)
    try {
      // get item first
      const item = await getItem(key) as object | null;

      if(!item) throw 'Record tidak ditemukan!';

      const newItem = { ...item, ...keyValueToUpdate };
      // record to log
      const isNotDuplicate = await addLog(storeName, 'update', key, { ...keyValueToUpdate });
      // then set item
      if (isNotDuplicate) await setItem(key, newItem);
    
      return true;

    } 
    
    catch (err) {
      alert('Terjadi kesalahan ketika update data')
      console.error(err);
      return false;
    }
  };

  const getItemsByKeyValue = async <T>(keySearch: string, valueSearch: string | number): Promise<T[]> => {
    let result = <T[]>[];
    await store.iterate(function (value:T, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // onsole.log([key, value]);
        if (value[keySearch] == valueSearch) {
          // save to result
          result.push(value);
        }
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });

      return result;
  };

  const getItemsByKeyGreaterThan = async <T>(keySearch: string, greaterThanValue: string | number): Promise<T[]> => {
    let result = <T[]>[];

    store.iterate(function (value: T, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // onsole.log([key, value]);
        if (value[keySearch] > greaterThanValue) {
          // save to result
          result.push(value);
        }
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });

      return result;
  };

  const getItemsByKeyThatValueLowerAndEqualThan = async <T>(keySearch: string, LowerThanValue: string | number): Promise<T[]> => {
    let result = <T[]>[];

    store.iterate(function (value: T, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // onsole.log([key, value]);
        if (value[keySearch] <= LowerThanValue) {
          // save to result
          result.push(value);
        }
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });

      return result;
  };

  const getItemByTwoKeyValue = async (
    key1Search : string,
    value1Search: string | number,
    key2Search: string,
    value2Search: string | number
  ) => {
    let result = [];
    return store
      .iterate(function (value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // onsole.log([key, value]);
        if (
          value[key1Search] == value1Search &&
          value[key2Search] == value2Search
        ) {
          // save to result
          result.push(value);
        }
      })
      .then(function () {
        // return result
        return result;
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  };

  const getItemsByKeyGreaterOrEqualThanAndLowerOrEqualThan = async (
    keySearch: string,
    greaterOrEqualThanValue: number,
    LowerOrEqualThanValue: number
  ) => {
    let result = [];
    return store
      .iterate(function (value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // onsole.log([key, value]);
        if (
          value[keySearch] >= greaterOrEqualThanValue &&
          value[keySearch] <= LowerOrEqualThanValue
        ) {
          // save to result
          result.push(value);
        }
      })
      .then(function () {
        // return result
        return result;
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  };

  const getItemsThatValueIncludes = async (yourString: object) => {
    const result = [];
    return store
      .iterate(function (value, key, iterationNumber) {
        if (Object.values(value).includes(yourString)) {
          result.push(value);
        }
        // return result;
      })
      .then(function () {
        // onsole.log("Iteration has completed, last iterated pair:");
        return result;
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  };

  const getItemsGreatEqualLowEqual = async <T>(key1: string, greaterValue1: string | number, key2: string, lowerValue2: string | number): Promise<T[]> => {
   
    let result = <T[]>[];
    store.iterate(function (value: T) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // onsole.log([key, value]);
        const isCondition = value[key1] >= greaterValue1 && value[key2] <= lowerValue2
        if (isCondition) {
          // save to result
          result.push(value);
        }
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });

    return result;
  }

  return {
    setItem,
    getItem,
    getItems,
    removeItem,
    findOneItemByKeyValue,
    getItemsLimit,
    updateItem,
    getItemsByKeyValue,
    getItemsByKeyGreaterThan,
    getItemByTwoKeyValue,
    getItemsByKeyGreaterOrEqualThanAndLowerOrEqualThan,
    getItemsThatValueIncludes,
    createItem,
    getItemsGreatEqualLowEqual,
    getItemsByKeyThatValueLowerAndEqualThan
  };
};
