import { closeModalOrDialog } from "./launchForm";

export const keyPress = function (e) {
  // the escape button
  if (e.keyCode == 27) {
    closeModalOrDialog();
  }
  // enter button pressed, it means true
  else if (e.keyCode == 13) {
    closeModalOrDialog(true);
  }
};

export const keyPressWoutEnter = function (e) {
  // the escape button
  if (e.keyCode == 27) {
    closeModalOrDialog();
  }
};
