import localforage from 'localforage';

const summaryDB = localforage.createInstance({
    name: 'my_report_stock',
    storeName: 'summary',
  });

// 1ore would contain { lastId: value, total: value }
export async function summary(storeName) {
  // would return { }
  const lastUpdated = await summaryDB.getItem(storeName)
  // to update summary
  const updateSummary = async (lastId) => {
    const record = { id: storeName, lastId, total: lastUpdated?.total ? lastUpdated?.total + 1 : 1}
    await summaryDB.setItem(storeName, record)
    return;
  };

  return { lastUpdated, updateSummary };
}
