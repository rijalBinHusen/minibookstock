import store from '../store/index';

export const launchForm = (nameForm, idRecord) => {
    window.location.href = "#my-modal"
    store.commit("form", { form: nameForm, document: idRecord }); 
}

export const subscribeConfirmDialog = async (type, messageToShow) => {
    // type = alert || confirm
    // message = the message to show in dialog

    // this to open dialog
    window.location.href = "#modal-confirm"
    let unsubscribe;
    // create a promise to waiting the update process, and listen to the tunnel message
    const prom = new Promise(resolve => {
            // luncurkan dialog
            store.commit("confirmPayload", {
                type,
                message: messageToShow || "Apakah anda yakin akan mengahapusnya?"
            });
            // subscribe untuk tanggkap confirm dialog apakah yes atau tidak
            unsubscribe = store.subscribe(mutation => {
                // if the confirmation button clicked whatever yes or no
                if(mutation?.type == 'tunnelMessage') {
                    // resolve the messaage, true or false
                    resolve(mutation?.payload)
                }
            })
        })
        // jika oke kirim pesan
    return prom.then((res) => {
        // un activated subscribe function
        unsubscribe()
        // close modal
        window.location.href = "#"
        // return message, either true or false
        return res
    })
}