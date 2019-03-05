<template>
  <div class="support">

  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
	methods: {
		track() {
			this.$ga.page(this.$router)
		}
	}
}
</script>

<style scoped>

</style>
