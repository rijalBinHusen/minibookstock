import localforage from "localforage";

export const useIdb = async (storeName) => {
  // create instance
  const store = localforage.createInstance({
    name: "my_report_stock",
    storeName,
  });

  const setItem = async (key, value) => {
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

  const removeItem = (key) => {
    return store.removeItem(key)
  }

  const findOneItemByKeyValue = (keySearch, valueSearch) => {
    let result = {};
    store.iterate(function(value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // console.log([key, value]);
        if(value[keySearch] == valueSearch) {
          // save to result
          result = value
          return
        }
    }).then(function() {
        // return result 
        return result;
    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
    });
  }

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
    const item = await getItem(key)
    // new item
    const newItem = { ...item, ...keyValueToUpdate }
    // then set item
    await setItem(key, newItem)
    return;
  }

  const getItemsByKeyValue = async (keySearch, valueSearch) => {
    let result = [];
    await store.iterate(function(value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // console.log([key, value]);
        if(value[keySearch] == valueSearch) {
          // save to result
          result.push(value)
        }
    }).then(function() {
        // return result 
        return result;
    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
    });
  }
  

  return { setItem, getItem, getItems, removeItem, findOneItemByKeyValue, getItemsLimit, updateItem, getItemsByKeyValue };
};
