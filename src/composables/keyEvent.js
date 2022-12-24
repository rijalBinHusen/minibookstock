import { closeModalOrDialog } from "./launchForm"

export const keyPress = function (e) {
    // the escape button
      if(e.keyCode == 27) {
        closeModalOrDialog()
      }
    }