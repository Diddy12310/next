<template>
	<blank-space app="Drawer" message="It is next in line for development."/>
</template>

<script>
import BlankSpace from '@/components/BlankSpace'

export default {
  name: 'Drawer',
  data() {
    return {

    }
	},
	components: {
		BlankSpace
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
