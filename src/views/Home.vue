<template>
	<div class="index">
		<div class="home">
			<img src="@/assets/plogo.png" alt="" style="position: relative; text-align: center; margin: auto; padding-top: 30vh;">
			<h2 class="display-3 font-weight-thin text-uppercase">Paradigm</h2>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
	text-align: center;
	height: calc(100vh - 64px);
	background: url('./../assets/home_bg.jpg');
	background-attachment: fixed;
	background-position: center;
	background-repeat: no-repeat;
	width: 100%;
	background-size: cover;
}

h1 {
  text-align: center;
}
</style>
