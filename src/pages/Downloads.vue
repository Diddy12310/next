<template>
  <div>
    <v-toolbar dense color="purple darken-4">
      <v-toolbar-title>Downloads</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-text-field hide-details="auto" style="max-width: 500px;" color="white" label="Search..." class="mt-4" v-model="search"></v-text-field> -->
    </v-toolbar>

    <div class="scroll-container" :style="{ height: `calc(100vh - ${$root.music.open ? '192px' : '112px'})`, overflowY: 'auto' }">
      <v-container>
        <v-card max-width="750" class="ma-auto">
          <v-card-title class="py-2">
            <v-list-item class="pa-0">
              <v-list-item-avatar><v-img src="../assets/capture.png"></v-img></v-list-item-avatar>
              <v-list-item-title class="text-h5">Capture</v-list-item-title>
            </v-list-item>
          </v-card-title>

          <v-card-text>
            Capture is a lightweight and user-friendly screen capturing tool.
          </v-card-text>

          <v-card-actions>
            <v-btn icon color="grey darken-3" @click="window.open('https://github.com/Paradigm-Dev/capture')"><v-icon>mdi-github</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="window.open($root.config.downloads.capture.win)" color="blue accent-1" text><v-icon left>mdi-microsoft</v-icon>Windows</v-btn>
            <v-btn @click="window.open($root.config.downloads.capture.mac)" color="blue accent-1" text><v-icon left>mdi-apple</v-icon>macOS</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Downloads',
  data() {
    return {
      search: '',
      window
    }
  }
}
</script>

<style scoped>

</style>