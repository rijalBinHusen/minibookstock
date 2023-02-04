import localforage from 'localforage';

const logging = localforage.createInstance({
    name: 'my_report_stock',
    storeName: 'logs',
  });

let countOfLoggerAtATime = 0;

export const addLog = async (storeName, mode, key, value) => {
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
        value: value,
    });
    // return
    return;
};
