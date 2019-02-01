<template>
  <div class="notice">
    <div style="padding-top: 50px; width: 75%; margin: auto;">
      <span class="display-3 blue--text font-weight-thin">NOTICE</span>
			<v-divider style="margin: 25px 0px;"></v-divider>
      <h1 class="display-2 purple--text darken-1 font-weight-medium" style="margin-bottom: 25px;">This is beta software.</h1>
      <h2 class="headline font-weight-regular">There is no guarantee that this software will work.</h2>
      <h2 class="headline font-weight-regular">There is no guarantee that your data will be fully protected at all times.</h2>
      <h2 class="headline font-weight-regular">There is no guarantee that this software will exit the beta phase.</h2>
      <h2 class="headline font-weight-regular">There is no guarantee that customer service will be executed.</h2>
      <h2 class="headline font-weight-regular">There is no guarantee that our customers will be at the forefront of our decisions.</h2>
      <br><v-divider></v-divider><br>
      <h2 class="headline font-weight-regular">We reserve the right to terminate your account during the beta phase.</h2>
      <h2 class="headline font-weight-regular">We reserve the right to, without notice, search any linked account without cause at any time.</h2>
      <h2 class="headline font-weight-regular">We reserve the right to refuse account creation.</h2>
      <h2 class="headline font-weight-regular">We reserve the right to block or censor sent messages.</h2>
      <h2 class="headline font-weight-regular">We reserve the right to refuse customer service.</h2>
      <br><v-divider></v-divider><br>
    </div>
		<h2 class="display-1 font-weight-bold red--text"><b>If you do not accept these beta-specific terms, your account will be terminated.</b></h2>
    <br>
  </div>
</template>

<script>
export default {
    name: 'Notice',
    data() {
        return {

        }
    }
}
</script>

<style scoped>
div.notice {
	text-align: center;
}
</style>
