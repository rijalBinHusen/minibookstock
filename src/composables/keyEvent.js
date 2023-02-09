import { closeModalOrDialog } from './launchForm';

export const keyPress = function (e) {
  // the escape button
  if (e.keyCode == 27) {
    e.preventDefault();
    closeModalOrDialog();
  }
  // enter button pressed, it means true
  else if (e.keyCode == 13) {
    e.preventDefault();
    closeModalOrDialog(true);
  }
};

export const keyPressWoutEnter = function (e) {
  // the escape button
  if (e.keyCode == 27) {
    e.preventDefault();
    closeModalOrDialog();
  }
};
