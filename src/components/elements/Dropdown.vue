<template>
  <div class="dropdown dropdown-hover">
    <div tabindex="0" :class="className">
      {{ text }}
    </div>
    <ul
      tabindex="0"
      class="p-2 shadow menu dropdown-content bg-base-200 rounded-box w-30"
    >
      <li @click="op.method(op.value)" v-for="op in options" :key="op.value">
        <a>
          <font-awesome-icon v-if="op.icon" class="mr-1" :icon="op.icon" />
          {{ op.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  props: {
    text: {
      type: String,
      required: true,
    },
    success: Boolean,
    primary: Boolean,
    secondary: Boolean,
    accent: Boolean,
    ghost: Boolean,
    class: String,
    href: String,
    icon: String,
    outline: Boolean,
    small: Boolean,
    options: {
      required: true,
      type: Object,
    },
    // text="string" :options ="[{method: '', text: '', icon: '', value: ''}]" primary small
  },
  computed: {
    className() {
      let classList = ["btn", "m-1"];
      if (this.small) classList.push("btn-sm");
      if (this.primary) classList.push("btn-primary");
      if (this.secondary) classList.push("btn-secondary");
      if (this.accent) classList.push("btn-accent");
      if (this.ghost) classList.push("btn-ghost");
      if (this.outline) classList.push("btn-outline");
      if (this.success) classList.push("btn-success");
      if (this.class) classList.push(this.class.split(" "));

      return classList.join(" ");
    },
  },
};
</script>
