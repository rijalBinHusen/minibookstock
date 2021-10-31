<template>
  <div class="border-r-2 p-6 min-h-full">
    <!-- <component :is="activeComponent"></component> -->
    <ListGroup />
  </div>
</template>

<script>
import ListGroup from "./parts/ListGroup.vue";

export default {
  name: "Setting",
  data() {
    return {};
  },
  components: {
    ListGroup,
  },
};
</script>