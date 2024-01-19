export function generateId(lastId: string) {

  const currentDate = new Date();
  return generateIdWithCustomDate(lastId, currentDate);
}

export function generateIdWithCustomDate(lastId: string, yourDate: Date) {
  // ambil last id dari summary  // kalau tidak ada bikin baru
  let id = lastId.slice(0, -8);
  // masukkan increment
  // ambil 4 string e.g 0000 akan menjadi 0001
  let increment = Number(lastId.slice(-4)) + 1 + "";
  // 2022
  let fullYear = new Date().getFullYear() + "";
  // 5
  let weekNow = getWeekNumber(yourDate) + "";
  // 22
  let year = lastId.slice(id.length, id.length+2); //21
  // 05
  let week = lastId.slice(id.length + 2, id.length+4); //08
  //if the week same
  if (weekNow === week && year === fullYear.slice(-2)) {
    id += year + week;
  }
  //if the week not same
  else {
    // if the week 9 change to 09
    weekNow = Number(weekNow) < 10 ? "0" + weekNow : weekNow;
    id += fullYear.slice(-2) + weekNow;
    increment = "0";
  }
  //0000
  let result = id + "0000".slice(increment.length) + increment;

  return result;
}

function getWeekNumber(yourDate: Date) {
  
  // get the 1 january day
  var oneJan = new Date(yourDate.getFullYear(), 0, 1);
  // get the number of today (yourDate - oneJan) would be epoch number and divide 1 day epoch number
  var numberOfDays = Math.floor((yourDate.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  // get the number of day + 1 + number of days and divide 1 week ( 170 / 7)
  return Math.ceil((yourDate.getDay() + 1 + numberOfDays) / 7);
}
