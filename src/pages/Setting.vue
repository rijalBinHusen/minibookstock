<template>
  <div class="border-r-2 p-6 min-h-full flex gap-2">
    <!-- <component :is="activeComponent"></component> -->
    <ListGroup />
    <Importer @form="$emit('form', $event)" />
  </div>
</template>

<script>
import ListGroup from "../components/parts/ListGroup.vue";
import Importer from "../components/parts/Importer.vue";

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