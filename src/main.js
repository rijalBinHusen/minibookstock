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
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faDiceD6,
  faCog,
  faTruckMoving,
  faLayerGroup,
  faShoppingCart,
  faInfoCircle
);

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .mount("#app");
