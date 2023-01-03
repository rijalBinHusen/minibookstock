import { useIdb } from "./localforage";

// 1ore would contain { lastId: value, total: value }
export async function summary(storeName) {
  const summaryDB = await useIdb("summary")
  // would return { }
  const lastUpdated = await summaryDB.getItem(storeName)
  //   to update summary
  const updateSummary = async (lastId) => {
    const record = { lastId, total: lastUpdated?.total ? lastUpdated?.total + 1 : 1}
    await summaryDB.setItem(storeName, record)
    return;
  };

  const getAllDataToBackup = async () => {
    // initiate idb
    const summarydb = await useIdb("summary");
    // get all data
    const allData = await summarydb.getItems();
    // return the result
    return { store: "summary", data: allData ? allData : null };
  };

  return { lastUpdated, updateSummary, getAllDataToBackup };
}
