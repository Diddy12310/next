<template>
	<div class="404">
		<v-container fluid class="text-center pt-0">
      <v-row>
        <v-col xs="12" cols="12" class="light-blue darken-3 py-12 elevation-5" style="z-index: 5;">
          <h1 class="display-3 font-weight-medium white--text">:/</h1>
        </v-col>
				<v-col xs="12" cols="12" class="blue-grey darken-3 elevation-5 py-4">
					<h3 class="mt-2 display-1 grey--text font-weight-light text-uppercase">Aw snap.</h3>
				</v-col>
      </v-row>
    </v-container>

		<div style="text-align: center;">
			<h3 class="headline font-weight-light" style="margin: 25px;">The requested resource was not found on the server.</h3>
			<v-btn @click="$root.switch = 'Home'" color="deep-purple">Go Home</v-btn>
    </div>
	</div>
</template>

<script>
export default {
	name: '404'
}
</script>

<style>

</style>
