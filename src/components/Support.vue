<template>
  <div>
    <v-card>
      <v-card-title>
				<h3 class="headline mb-0">Support</h3>
        <v-spacer></v-spacer>
        <v-btn icon @click="$root.support_dialog = false" class="dialog-close-btn">
					<v-icon>mdi-close</v-icon>
				</v-btn>
      </v-card-title>
      <v-card-text>
        You can contact our support anytime at <a href="mailto:paradigmdevelop@gmail.com" class="white--text">paradigmdevelop@gmail.com</a>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Support',
}
</script>

<style scoped>

</style>
