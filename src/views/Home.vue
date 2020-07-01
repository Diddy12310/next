<template>
	<div class="index">
		<div class="home">
			<img src="@/assets/plogo.png" alt="" style="position: relative; text-align: center; margin: auto; margin-top: 30vh; height: 150px; width: 150px;">
			<h2 class="text-h2 font-weight-thin text-uppercase">Paradigm</h2>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Home',
	created() {
		this.$root.view.corona = true
	},
	beforeDestroy() {
		this.$root.view.corona = false
	}
}
</script>

<style scoped>
.home {
	text-align: center;
	height: calc(100vh - 64px);
	background: url('./../assets/home.jpg');
	/* background-attachment: fixed; */
	background-position: center;
	background-repeat: no-repeat;
	width: 100%;
	background-size: cover;
}

h1 {
  text-align: center;
}
</style>
