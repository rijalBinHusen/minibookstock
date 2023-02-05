import localforage from 'localforage';
import { addLog } from "./logging"
import { summary } from "./summaryIdb"
import { generateId } from "./GeneratorId"

export const useIdb = async (storeName) => {
  // create instance
  const store = localforage.createInstance({
    name: 'my_report_stock',
    storeName,
  });
  const createItem = async(value) => {
    // get summary
    const sum = await summary(storeName)
    // generateID
    const nextId = sum?.lastUpdated ? generateId(sum?.lastUpdated?.lastId) : generateId(storeName + "_22030000")
    // record to set
    const record = { ...value, id: nextId, created: new Date().getTime() }
    // record to logs 
    await addLog(storeName, 'create', nextId, record);
    // setItem
    await setItem(nextId, record)
    // update summary
    await sum.updateSummary(nextId)
    // return the whole record
    return record;
  }

  const setItem = async (key, value) => {
    await store.setItem(key, value);
    return;
  };

  const getItem = (key) => {
    return store.getItem(key);
  };

  const getItemsLimit = async (limit) => {
    const result = [];
    return store.iterate(function (value, key, iterationNumber) {
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

  const removeItem = async (key) => {
    addLog(storeName, 'remove', key, { id: key });
    await store.removeItem(key);
    return;
  };

  const findOneItemByKeyValue = (keySearch, valueSearch) => {
    // let result = {};
    return store.iterate(function (value, key, iterationNumber) {
      // Resulting key/value pair -- this callback
      // will be executed for every item in the
      // database.
      if (value[keySearch] == valueSearch) {
        // save to result
        return value;
      }
    });
  };

  const getItems = async () => {
    const result = [];
    return store
      .iterate(function (value, key, iterationNumber) {
        if (value && key) {
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

  const updateItem = async (key, keyValueToUpdate) => {
    // onsole.log('local forage update item', key)
    // get item first
    const item = await getItem(key);
    // new item
    const newItem = { ...item, ...keyValueToUpdate };
    // record to log
    const isNotDuplicate = await addLog(storeName, 'update', key, { ...keyValueToUpdate });
    // then set item
    if(isNotDuplicate) {
      await setItem(key, newItem);
      return true
    }
    // return
    return false;
  };

  const getItemsByKeyValue = async (keySearch, valueSearch) => {
    let result = [];
    return store
      .iterate(function (value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // onsole.log([key, value]);
        if (value[keySearch] == valueSearch) {
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

  const getItemsByKeyGreaterThan = async (keySearch, greaterThanValue) => {
    let result = [];
    return store
      .iterate(function (value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // onsole.log([key, value]);
        if (value[keySearch] > greaterThanValue) {
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

  const getItemByTwoKeyValue = async (
    key1Search,
    value1Search,
    key2Search,
    value2Search
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
    keySearch,
    greaterOrEqualThanValue,
    LowerOrEqualThanValue
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

  const getItemsThatValueIncludes = async (yourString) => {
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
  };
};
