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

  return { setItem, getItem };
};
