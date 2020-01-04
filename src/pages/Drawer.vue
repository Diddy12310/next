<template>
	<div class="text-center">
		<v-container fluid class="pt-0">
      <v-row>
        <v-col sm="12" class="teal darken-3 py-12 elevation-5">
          <h1 class="display-3 font-weight-thin white--text">Drawer</h1>
        </v-col>
        <v-col sm="12">
          <p class="title font-weight-regular px-6 pt-6">A cloud-based, secure file hosting and storage service.</p>
          <v-btn color="teal darken-3" disabled>Coming Soon</v-btn>
        </v-col>
      </v-row>
    </v-container>
	</div>
</template>

<script>
import { db, storage } from '@/firebase'

export default {
  name: 'Drawer',
  data() {
    return {

    }
	},
	created() {

  }
}
</script>

<style scoped>

</style>
