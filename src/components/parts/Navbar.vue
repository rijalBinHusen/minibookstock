<template>
    <div class="navbar mb-2 shadow-lg bg-base-200 text-base-content rounded-box">
  <div class="px-2 mx-2 navbar-start">
    <span class="text-lg font-bold">
            Book of stock
          </span>
  </div> 
  <div class="px-2 mx-2 navbar-center flex">
    <div class="flex items-stretch">
      <a v-for="nav in navs" :key="nav.title" @click="$emit('navbar', nav.name)" class="btn btn-ghost btn-sm rounded-btn uppercase">
              <span class="hidden md:block">
				{{ nav.title }}
			  </span>
        <font-awesome-icon class="m-2" :icon="nav.icon" />
      </a> 
    </div>
  </div> 
  <div class="navbar-end">
      <span class="btn btn-ghost btn-sm rounded-btn">
        Credit
        <font-awesome-icon class="ml-2" icon="info-circle" />
      </span>
  </div>
</div>

</template>

<script>
export default {
    name: "Navbar",
    props: {
        navs: {
            type: Object,
            required: true,
        }
    },
    emits: ['navbar'],
}
</script>