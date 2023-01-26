import localforage from 'localforage';

export const useIdb = async (storeName) => {
  // create instance
  const store = localforage.createInstance({
    name: 'my_report_stock',
    storeName,
  });

  const logging = localforage.createInstance({
    name: 'my_report_stock',
    storeName: 'logs',
  });

  let countOfLoggerAtATime = 0;

  const addLog = async (mode, key, value) => {
    // create new date time first
    const dtime = new Date().getTime();
    // increment count
    countOfLoggerAtATime = countOfLoggerAtATime + 1;
    // id logger
    const idLog = dtime + countOfLoggerAtATime + '';
    // record to log
    await logging.setItem(idLog, {
      mode,
      time: dtime,
      store: storeName,
      idRecord: key,
      value: JSON.stringify(value),
    });
  };

  const setItem = async (key, value) => {
    await addLog('set', key, value);
    await store.setItem(key, value);
    return;
  };

  const getItem = (key) => {
    return store.getItem(key);
  };

  const getItemsLimit = async (limit) => {
    const result = [];
    return store
      .iterate(function (value, key, iterationNumber) {
        if (iterationNumber < limit && value && key) {
          result.push(value);
        }
        // return result;
      })
      .then(function () {
        // console.log("Iteration has completed, last iterated pair:");
        return result;
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  };

  const removeItem = async (key) => {
    addLog('remove', key, false);
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
        // console.log("Iteration has completed, last iterated pair:");
        return result;
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  };

  const updateItem = async (key, keyValueToUpdate) => {
    // get item first
    const item = await getItem(key);
    // new item
    const newItem = { ...item, ...keyValueToUpdate };
    // then set item
    await setItem(key, newItem);
    return;
  };

  const getItemsByKeyValue = async (keySearch, valueSearch) => {
    let result = [];
    return store
      .iterate(function (value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // console.log([key, value]);
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
        // console.log([key, value]);
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
        // console.log([key, value]);
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
        // console.log([key, value]);
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
  };
};
