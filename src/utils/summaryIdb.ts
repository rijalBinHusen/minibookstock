import * as localforage from 'localforage';

interface lastUpdate {
  id: string,
  lastId: string,
  total: number,
}

interface summary {
  lastUpdate: lastUpdate,
  updateSummary: Function;
}

const summaryDB = localforage.createInstance({
    name: 'my_report_stock',
    storeName: 'summary',
  });

// 1ore would contain { lastId: value, total: value }
export async function summary(storeName: string):Promise<summary> {
  // would return { }
  const lastUpdate: lastUpdate = await summaryDB.getItem(storeName) as lastUpdate
  // to update summary
  const updateSummary = async (lastId: string) => {
    const record: lastUpdate = { id: storeName, lastId, total: lastUpdate?.total ? lastUpdate?.total + 1 : 1}
    await summaryDB.setItem(storeName, record)
    return;
  };

  return { lastUpdate, updateSummary };
}
