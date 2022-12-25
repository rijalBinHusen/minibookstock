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

  const getItems = (limit) => {
    const result = [];
    store
      .iterate(function (value, key, iterationNumber) {
        if (iterationNumber < limit) {
          result.push(value);
        } else {
          return [key, value];
        }
      })
      .then(function (result) {
        console.log("Iteration has completed, last iterated pair:");
        console.log(result);
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  };

  return { setItem, getItem, getItems };
};
