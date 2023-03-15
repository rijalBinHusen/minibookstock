import * as localforage from 'localforage';

const logging = localforage.createInstance({
  name: 'my_report_stock',
  storeName: 'logs',
});

let countOfLoggerAtATime = 0;
let oldKey = null;
let timeE = 0;
let modeE = null;

export const addLog = async (storeName: string, mode: string, key: string, value: object): Promise<boolean> => {
  try {
    // create new date time first
    const dtime = new Date().getTime();
    if (oldKey == key && dtime - timeE < 100 && modeE == mode) {
      throw `multiple triggered key(mode: ${mode}, key : ${key}, Value: ${value}`;
    }
    // onsole.log('first: ', 'mode: ', mode, 'key: ', key, 'Value: ', value)
    timeE = dtime;
    oldKey = key;
    modeE = mode;
    // increment count
    countOfLoggerAtATime = countOfLoggerAtATime + 1;
    // id logger
    const idLog = dtime + countOfLoggerAtATime + '';
    // record to log
    await logging.setItem(idLog, {
      id: idLog,
      mode,
      time: new Date().toLocaleString(),
      store: storeName,
      idRecord: key,
      value: value,
    });
    await new Promise((res) =>
      setTimeout((): void => res('') , 110)
    );
    return true;
  } catch (err) {
    alert('Terjadi kesalahan pada sistem');
    console.log(err);
    return false;
  }
};
