import store from '../store/index';

export const launchForm = (nameForm, idRecord) => {
    store.commit("form", { form: nameForm, document: idRecord }); 
    // we need to wait until the element rendered, then we call the id
    setTimeout(() => {
        window.location.href = "#my-modal"
    }, 100)
}

export const subscribeConfirmDialog = async (type, messageToShow) => {
    // type = alert || confirm
    // message = the message to show in dialog

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
            // this to open dialog
            // we need to wait until the element rendered, then we call the id
            setTimeout(() => {
                window.location.href = "#modal-confirm"
            }, 100)
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

export const closeModalOrDialog = () => {
    // set state modal empty
    store.commit("confirmPayload", false);
    store.commit('form', false);
    // close modal
    window.location.href = "#"
}