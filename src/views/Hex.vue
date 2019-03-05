<template>
	<blank-space app="Hex" message="But, if David would hurry up, we could release it!"/>
</template>

<script>
import BlankSpace from '@/components/BlankSpace'

export default {
  name: 'Hex',
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

<style>

</style>
