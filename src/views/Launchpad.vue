<template>
	<BlankSpace app="Launchpad" message="Development has been temporarily discontinued."/>
</template>

<script>
import BlankSpace from '@/components/BlankSpace'

export default {
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
