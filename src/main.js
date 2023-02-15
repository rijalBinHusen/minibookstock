import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import store from "./store";
import {
  faDiceD6,
  faCog,
  faTruckMoving,
  faLayerGroup,
  faShoppingCart,
  faInfoCircle,
  faCloudUploadAlt,
  faTimesCircle,
  faBox,
  faNewspaper,
  faListOl,
  faTape,
  faScroll,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faDiceD6,
  faCog,
  faTruckMoving,
  faLayerGroup,
  faShoppingCart,
  faInfoCircle,
  faCloudUploadAlt,
  faTimesCircle,
  faBox,
  faNewspaper,
  faListOl,
  faTape,
  faScroll,
  faTag,
  faBook
);

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueDatePicker from "@vuepic/vue-datepicker";
import '@vuepic/vue-datepicker/dist/main.css'
import { faBook } from "@fortawesome/free-solid-svg-icons";

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon)
app.component('VueDatePicker', VueDatePicker)
app.use(store)
app.mount("#app");


