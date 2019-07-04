<template>
  <div>
    <v-toolbar color="red darken-4" dense>
      <v-toolbar-title class="hidden-sm-and-down">Show</v-toolbar-title>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <!-- <input class="hidden-sm-and-down doc-title" type="text" v-model="data.title" placeholder="Untitled document">
      <input class="hidden-md-and-up" style="text-align: left;" type="text" v-model="data.title" placeholder="Untitled document"> -->
      <v-spacer></v-spacer>
      <!-- <v-btn @click="newDocument()" icon><v-icon>mdi-file-document-box-plus</v-icon></v-btn>
      <v-btn @click="$notify('Function not implemented')" icon><v-icon>mdi-printer</v-icon></v-btn>
      <v-btn @click="open_dialog = true" icon><v-icon>mdi-folder-open</v-icon></v-btn>
      <v-btn @click="saveDocument()" icon><v-icon>mdi-content-save</v-icon></v-btn> -->
    </v-toolbar>

    <v-toolbar color="red darken-2" dense>
      <!-- <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon><v-icon>mdi-format-text-variant</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item @click="data.blocks.push({ type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left' }, index: data.blocks.length })">
            <v-list-item-title><v-icon>mdi-format-paragraph</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'header1', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left' }, index: data.blocks.length, size: 1 })">
            <v-list-item-title><v-icon>mdi-format-header-1</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'header2', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left' }, index: data.blocks.length, size: 2 })">
            <v-list-item-title><v-icon>mdi-format-header-2</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'header3', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left' }, index: data.blocks.length, size: 3 })">
            <v-list-item-title><v-icon>mdi-format-header-3</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'header4', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left' }, index: data.blocks.length, size: 4 })">
            <v-list-item-title><v-icon>mdi-format-header-4</v-icon></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon><v-icon>mdi-menu</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item @click="data.blocks.push({ type: 'nl', list: ['', '', ''], index: data.blocks.length })">
            <v-list-item-title><v-icon>mdi-menu</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'ul', list: ['', '', ''], index: data.blocks.length })">
            <v-list-item-title><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'ol', list: ['', '', ''], index: data.blocks.length })">
            <v-list-item-title><v-icon>mdi-format-list-numbered</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'cl', list: ['', '', ''], index: data.blocks.length })">
            <v-list-item-title><v-icon>mdi-format-list-checkbox</v-icon></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon @click="data.blocks.push({ type: 'image', src: '', alt: '', src_saved: false, index: data.blocks.length })"><v-icon>mdi-image</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'divider', index: data.blocks.length })"><v-icon>mdi-minus</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'code', index: data.blocks.length })"><v-icon>mdi-code-tags</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'embed', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-web</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'html', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-language-html5</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'quote', content: '', author: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-format-quote-close</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'icon', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-star</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'gap', index: data.blocks.length })"><v-icon>mdi-arrow-expand-vertical</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-btn-toggle multiple v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'" style="background-color: #1976D2;">
        <v-btn icon @click="data.blocks[current_block.index].format.b = !data.blocks[current_block.index].format.b" v-model="data.blocks[current_block.index].format.b">
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>
        <v-btn icon @click="data.blocks[current_block.index].format.i = !data.blocks[current_block.index].format.i" v-model="data.blocks[current_block.index].format.i">
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>
        <v-btn icon @click="data.blocks[current_block.index].format.ul = !data.blocks[current_block.index].format.ul" v-model="data.blocks[current_block.index].format.ul">
          <v-icon>mdi-format-underline</v-icon>
        </v-btn>
        <v-btn icon @click="data.blocks[current_block.index].format.ol = !data.blocks[current_block.index].format.ol" v-model="data.blocks[current_block.index].format.ol">
          <v-icon>mdi-format-overline</v-icon>
        </v-btn>
        <v-btn icon @click="data.blocks[current_block.index].format.str = !data.blocks[current_block.index].format.str" v-model="data.blocks[current_block.index].format.str">
          <v-icon>mdi-format-strikethrough</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle v-model="data.blocks[current_block.index].format.align" mandatory v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'" style="background-color: #1976D2;">
        <v-btn value="left">
          <v-icon>mdi-format-align-left</v-icon>
        </v-btn>
        <v-btn value="center">
          <v-icon>mdi-format-align-center</v-icon>
        </v-btn>
        <v-btn value="right">
          <v-icon>mdi-format-align-right</v-icon>
        </v-btn>
      </v-btn-toggle> -->

      <v-spacer></v-spacer>
      <p class="doc-title">Unavailable</p>
      <v-spacer></v-spacer>
    </v-toolbar>

    <!-- <v-dialog v-model="open_dialog" max-width="500">
      <v-card>
        <v-card-title>
          <h4>Open file</h4>
        </v-card-title>

        <v-card-text>
          <input id="file-uploader" type="file" name="file" accept="application/json">
        </v-card-text>

        <v-card-actions>
          <v-btn text color="accent" @click="openDocument()">Open</v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="open_dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container id="editor" @click.self="current_block = {}">
      <v-layout v-for="(block, index) in data.blocks" :key="index" @click="current_block = block" class="block" align-center justify-center>
        <v-flex xs11 class="text" v-if="block.type == 'text'">
          <textarea style="width: 100%;" :class="{ 'body-1': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align }" type="text" v-model="block.content" placeholder="Paragraph"></textarea>
        </v-flex>

        <v-flex xs11 class="header1" v-if="block.type == 'header1'">
          <textarea style="width: 100%;" :class="{ 'display-1': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align }" type="text" v-model="block.content" placeholder="Header"></textarea>
        </v-flex>

        <v-flex xs11 class="header2" v-if="block.type == 'header2'">
          <textarea style="width: 100%;" :class="{ 'display-2': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align }" type="text" v-model="block.content" placeholder="Header"></textarea>
        </v-flex>

        <v-flex xs11 class="header3" v-if="block.type == 'header3'">
          <textarea style="width: 100%;" :class="{ 'display-3': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align }" type="text" v-model="block.content" placeholder="Header"></textarea>
        </v-flex>

        <v-flex xs11 class="header4" v-if="block.type == 'header4'">
          <textarea style="width: 100%;" :class="{ 'display-4': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align }" type="text" v-model="block.content" placeholder="Header"></textarea>
        </v-flex>

        <v-flex xs11 class="quote" v-if="block.type == 'quote'">
          <div v-if="!block.src_saved">
            <input type="text" v-model="block.content" placeholder="Content" style="width: 500px; margin-right: 14px;">
            <input type="text" v-model="block.author" placeholder="Author" style="width: 250px; margin-right: 14px;">
            <v-btn text color="accent" @click="block.src_saved = true" v-if="block.content">Save</v-btn>
          </div>
          <blockquote class="blockquote" v-if="block.src_saved" style="width: 100%;">{{ block.content }}</blockquote>
          <p class="subtitle-1" v-if="block.src_saved" style="text-align: right; margin-right: 100px;">— {{ block.author }}</p>
        </v-flex>

        <v-flex xs11 class="image" v-if="block.type == 'image'">
          <div v-if="!block.src_saved">
            <input type="text" v-model="block.src" placeholder="URL" style="width: 500px; margin-right: 14px;">
            <input type="text" v-model="block.alt" placeholder="Caption" style="width: 250px; margin-right: 14px;">
            <v-btn text color="accent" @click="block.src_saved = true" v-if="block.src">Save</v-btn>
          </div>
          <img v-if="block.src_saved" :src="block.src" :alt="block.alt" style="max-width: 1000px; margin: auto;">
          <p v-if="block.src_saved" class="caption" style="text-align: right; margin-right: 100px;">{{ block.alt }}</p>
        </v-flex>

        <v-flex xs11 class="icon" v-if="block.type == 'icon'">
          <div v-if="!block.src_saved">
            <input type="text" v-model="block.src" placeholder="Icon title from materialdesignicons.com" style="width: 500px; margin-right: 14px;">
            <v-btn text color="accent" @click="block.src_saved = true" v-if="block.src">Save</v-btn>
          </div>
          <v-icon v-if="block.src_saved">mdi-{{ block.src }}</v-icon>
        </v-flex>

        <v-flex xs11 class="nl" v-if="block.type == 'nl'">
          <ul class="mb-3" style="list-style-type: none;">
            <li v-for="(item, index) in block.list" :key="index">
              <input type="text" v-model="block.list[index]" placeholder="List item">
            </li>
          </ul>
        </v-flex>

        <v-flex xs11 class="ul" v-if="block.type == 'ul'">
          <ul class="mb-3">
            <li v-for="(item, index) in block.list" :key="index">
              <input type="text" v-model="block.list[index]" placeholder="List item">
            </li>
          </ul>
        </v-flex>

        <v-flex xs11 class="ol" v-if="block.type == 'ol'">
          <ol class="mb-3">
            <li v-for="(item, index) in block.list" :key="index">
              <input type="text" v-model="block.list[index]" placeholder="List item">
            </li>
          </ol>
        </v-flex>

        <v-flex xs11 class="embed" v-if="block.type == 'embed'">
          <div v-if="!block.src_saved">
            <input type="text" v-model="block.src" placeholder="URL" style="width: 750px; margin-right: 14px;">
            <v-btn text color="accent" @click="block.src_saved = true" v-if="block.src">Save</v-btn>
          </div>
          <embed v-if="block.src_saved" :src="block.src" style="width: 100%;">
        </v-flex>

        <v-flex xs11 class="html" v-if="block.type == 'html'">
          <div v-if="!block.src_saved">
            <textarea type="text" v-model="block.src" placeholder="URL" style="width: 750px; margin-right: 14px;"></textarea>
            <v-btn text color="accent" @click="block.src_saved = true" v-if="block.src">Save</v-btn>
          </div>
          <iframe v-if="block.src_saved" :srcdoc="block.src" style="width: 100%;"></iframe>
        </v-flex>

        <v-flex xs11 class="divider" v-if="block.type == 'divider'">
          <v-divider style="margin-top: 13px;"></v-divider>
        </v-flex>

        <v-flex xs11 class="gap" v-if="block.type == 'gap'">
          <div style="height: 45px;"></div>
        </v-flex>

        <v-flex xs11 class="code" v-if="block.type == 'code'">
          <kbd><input type="text" v-model="block.content" placeholder="Code snippet"></kbd>
        </v-flex>

        <v-flex xs1 style="text-align: center;">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon color="grey darken-2"><v-icon>mdi-dots-vertical</v-icon></v-btn>
            </template>
            <v-list>
              <v-list-item @click="moveUp(block, index)">
                <v-list-item-title><v-icon>mdi-chevron-up</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="deleteBlock(block.index)" color="red">
                <v-list-item-title><v-icon>mdi-delete</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="moveDown(block, index)">
                <v-list-item-title><v-icon>mdi-chevron-down</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="addListItem(index)" v-if="block.type == 'ul' || block.type == 'ol'">
                <v-list-item-title><v-icon>mdi-plus</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="removeListItem(index)" v-if="block.type == 'ul' || block.type == 'ol'">
                <v-list-item-title><v-icon>mdi-minus</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="block.src_saved = false" v-if="(block.type == 'image' || 'embed') && block.src_saved">
                <v-list-item-title><v-icon>mdi-pencil</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="block.size += 1, block.type = 'header' + block.size" v-if="block.type == 'header1' || block.type == 'header2' || block.type == 'header3'">
                <v-list-item-title><v-icon>mdi-format-font-size-increase</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="block.size -= 1, block.type = 'header' + block.size" v-if="block.type == 'header2' || block.type == 'header3' || block.type == 'header4'">
                <v-list-item-title><v-icon>mdi-format-font-size-decrease</v-icon></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-flex>
      </v-layout>
    </v-container> -->
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import printJS from 'print-js'

export default {
  name: 'Write',
  data() {
    return {
      open_dialog: false,
      data: {
        title: '',
        blocks: [
          { type: 'header1', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left' }, index: 0, size: 0 },
          { type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left' }, index: 1 }
        ]
      },
      current_block: {}
    }
  },
  methods: {
    newDocument() {
      this.data = {
        title: '',
        blocks: [
          { type: 'header1', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left' }, index: 0, size: 0 },
          { type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left' }, index: 1 }
        ]
      }
    },
    openDocument() {
      var files = document.getElementById('file-uploader').files

      var reader = new FileReader()

      reader.onload = e => { 
        this.data = JSON.parse(e.target.result)
      }

      reader.readAsText(files.item(0))

      this.open_dialog = false
    },
    saveDocument() {
      if (this.data.title) {
        var data = JSON.stringify(this.data)
        var file = new File([ data ], this.data.title + '.json', { type: 'application/json' })
        saveAs(file)
      } else {
        this.$notify('Name your document')
      }
    },
    printDocument() {
      printJS('editor', 'html')
    },
    moveUp(block, currentIndex) {
      this.data.blocks.splice(currentIndex, 1)
      this.data.blocks.splice(currentIndex - 1, 0, block)
      this.data.blocks[currentIndex - 1].index -= 1
      this.data.blocks[currentIndex].index += 1
    },
    moveDown(block, currentIndex) {
      this.data.blocks.splice(currentIndex, 1)
      this.data.blocks.splice(currentIndex + 1, 0, block)
      this.data.blocks[currentIndex + 1].index += 1
      this.data.blocks[currentIndex].index -= 1
    },
    addListItem(index) {
      this.data.blocks[index].list.push([''])
    },
    removeListItem(index) {
      this.data.blocks[index].list.pop()
    },
    deleteBlock(index) {
      this.data.blocks.splice(index, 1)
      this.data.blocks.forEach(block => {
        block.index -= 1
      })
      this.current_block = {}
    }
  }
}
</script>

<style scoped>
.v-toolbar {
  flex: none !important;
}

div#editor {
  margin-top: 16px;
}

.font-underline {
  text-decoration: underline;
}

.font-strikethrough {
  text-decoration: line-through;
}

.font-overline {
  text-decoration: overline;
}

html {
  outline: none;
}

.v-btn-toggle > .v-btn.v-btn {
  border-style: none !important;
  border-radius: 48px !important;
}

iframe {
  border: none !important;
}

.doc-title {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
	text-align: center;
}

.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background: none !important;
}

.block {
  padding: 8px;
}

.block:hover {
  background-color: #424242;
  border-radius: 10px;
}
</style>