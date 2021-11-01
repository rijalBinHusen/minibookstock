<template>
  <div class="border-r-2 p-6 min-h-full flex gap-2">
    <!-- <component :is="activeComponent"></component> -->
    <ListGroup />
    <Importer />
  </div>
</template>

<script>
import ListGroup from "./parts/ListGroup.vue";
import Importer from "./parts/Importer.vue";

export default {
  name: "Setting",
  data() {
    return {};
  },
  components: {
    ListGroup,
    Importer,
  },
};
</script>