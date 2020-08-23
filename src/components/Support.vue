<template>
  <div class="support">
    <v-dialog v-if="$root.user" v-model="$root.view.support" max-width="500" @click:outside="$root.view.support = false">
      <v-card>
				<v-card-title>
          <v-card-title class="text-h5 font-weight-medium ma-0 pa-0">SUPPORT</v-card-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="$root.view.support = false" class="dialog-close-btn">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>

        <v-card-text>
          <p>If you need assistance with Paradigm or have any questions, email <a href="mailto:paradigmdevelop@gmail.com">paradigmdevelop@gmail.com</a> or call or text (412) 427-0411.</p>
          <p>If there is a bug or any other sort of glitch, <a @click="$root.view.bug_report = true; $root.view.support = false">file a bug report</a>.</p>
          <p class="mb-0">Many issues can be temporarily solved by refreshing the page.</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Support'
}
</script>

<style scoped>

</style>