import store from '../store/index';

export const launchForm = (nameForm, idRecord) => {
    window.location.href = "#my-modal"
    store.commit("form", { form: nameForm, document: idRecord }); 
}