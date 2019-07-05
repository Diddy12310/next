<template>
  <div>
    <v-toolbar color="blue darken-4" dense>
      <v-toolbar-title class="hidden-sm-and-down">Write</v-toolbar-title>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <input class="hidden-sm-and-down doc-title" type="text" v-model="data.title" placeholder="Untitled document">
      <input class="hidden-md-and-up" style="text-align: left;" type="text" v-model="data.title" placeholder="Untitled document">
      <v-spacer></v-spacer>
      <v-btn @click="newDocument()" icon class="hidden-sm-and-down"><v-icon>mdi-file-document-box-plus</v-icon></v-btn>
      <v-btn @click="$notify('Function not implemented')" icon class="hidden-sm-and-down"><v-icon>mdi-printer</v-icon></v-btn>
      <v-btn @click="open_dialog = true" icon class="hidden-sm-and-down"><v-icon>mdi-folder-open</v-icon></v-btn>
      <v-btn @click="saveDocument()" icon class="hidden-sm-and-down"><v-icon>mdi-content-save</v-icon></v-btn>
      <v-menu offset-y class="hidden-md-and-up">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="hidden-md-and-up"><v-icon>mdi-menu</v-icon></v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="saveDocument()">
            <v-list-item-title><v-icon>mdi-content-save</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="open_dialog = true">
            <v-list-item-title><v-icon>mdi-folder-open</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="newDocument()">
            <v-list-item-title><v-icon>mdi-file-document-box-plus</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="$notify('Function not implemented')">
            <v-list-item-title><v-icon>mdi-printer</v-icon></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-toolbar color="blue darken-2" dense>

      <!-- Mobile add menu -->
      <v-menu offset-y :close-on-content-click="false" class="hidden-md-and-up">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="hidden-md-and-up"><v-icon>mdi-plus</v-icon></v-btn>
        </template>
        <v-list dense>
          <v-menu offset-x>
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on" icon class="hidden-md-and-up"><v-icon>mdi-format-text-variant</v-icon></v-list-item>
            </template>
            <v-list dense>
              <v-list-item @click="data.blocks.push({ type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, rows: 3 })">
                <v-list-item-title><v-icon>mdi-format-paragraph</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'header1', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 1, rows: 1 })">
                <v-list-item-title><v-icon>mdi-format-header-1</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'header2', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 2, rows: 1 })">
                <v-list-item-title><v-icon>mdi-format-header-2</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'header3', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 3, rows: 1 })">
                <v-list-item-title><v-icon>mdi-format-header-3</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="data.blocks.push({ type: 'header4', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 4, rows: 1 })">
                <v-list-item-title><v-icon>mdi-format-header-4</v-icon></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu offset-x>
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on" icon class="hidden-md-and-up"><v-icon>mdi-menu</v-icon></v-list-item>
            </template>
            <v-list dense>
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
          <v-list-item icon @click="data.blocks.push({ type: 'image', src: '', alt: '', src_saved: false, index: data.blocks.length })"><v-icon>mdi-image</v-icon></v-list-item>
          <v-list-item icon @click="data.blocks.push({ type: 'divider', index: data.blocks.length })"><v-icon>mdi-minus</v-icon></v-list-item>
          <v-list-item icon @click="data.blocks.push({ type: 'code', index: data.blocks.length })"><v-icon>mdi-code-tags</v-icon></v-list-item>
          <v-list-item icon @click="data.blocks.push({ type: 'embed', src: '', src_saved: '', index: data.blocks.length, size: 100 })"><v-icon>mdi-web</v-icon></v-list-item>
          <v-list-item icon @click="data.blocks.push({ type: 'html', src: '', src_saved: '', index: data.blocks.length, size: 100 })"><v-icon>mdi-language-html5</v-icon></v-list-item>
          <v-list-item icon @click="data.blocks.push({ type: 'quote', content: '', author: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-format-quote-close</v-icon></v-list-item>
          <v-list-item icon @click="data.blocks.push({ type: 'icon', src: '', src_saved: '', index: data.blocks.length })"><v-icon>mdi-star</v-icon></v-list-item>
          <v-list-item icon @click="data.blocks.push({ type: 'gap', index: data.blocks.length })"><v-icon>mdi-arrow-expand-vertical</v-icon></v-list-item>
        </v-list>
      </v-menu>


      <!-- Desktop toolbar -->
      <v-menu offset-y class="hidden-sm-and-down">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="hidden-sm-and-down"><v-icon>mdi-format-text-variant</v-icon></v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="data.blocks.push({ type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, rows: 3 })">
            <v-list-item-title><v-icon>mdi-format-paragraph</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'header1', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 1, rows: 1 })">
            <v-list-item-title><v-icon>mdi-format-header-1</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'header2', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 2, rows: 1 })">
            <v-list-item-title><v-icon>mdi-format-header-2</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'header3', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 3, rows: 1 })">
            <v-list-item-title><v-icon>mdi-format-header-3</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks.push({ type: 'header4', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: data.blocks.length, size: 4, rows: 1 })">
            <v-list-item-title><v-icon>mdi-format-header-4</v-icon></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y class="hidden-sm-and-down">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="hidden-sm-and-down"><v-icon>mdi-menu</v-icon></v-btn>
        </template>
        <v-list dense>
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
      <v-btn icon @click="data.blocks.push({ type: 'image', src: '', alt: '', src_saved: false, index: data.blocks.length })" class="hidden-sm-and-down"><v-icon>mdi-image</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'divider', index: data.blocks.length })" class="hidden-sm-and-down"><v-icon>mdi-minus</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'code', index: data.blocks.length })" class="hidden-sm-and-down"><v-icon>mdi-code-tags</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'embed', src: '', src_saved: '', index: data.blocks.length })" class="hidden-sm-and-down"><v-icon>mdi-web</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'html', src: '', src_saved: '', index: data.blocks.length })" class="hidden-sm-and-down"><v-icon>mdi-language-html5</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'quote', content: '', author: '', src_saved: '', index: data.blocks.length })" class="hidden-sm-and-down"><v-icon>mdi-format-quote-close</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'icon', src: '', src_saved: '', index: data.blocks.length })" class="hidden-sm-and-down"><v-icon>mdi-star</v-icon></v-btn>
      <v-btn icon @click="data.blocks.push({ type: 'gap', index: data.blocks.length })" class="hidden-sm-and-down"><v-icon>mdi-arrow-expand-vertical</v-icon></v-btn>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <div class="hidden-sm-and-down" v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'">
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
      </div>
      <v-menu class="hidden-sm-and-down" offset-y v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'">
        <template v-slot:activator="{ on }">
          <v-btn class="hidden-sm-and-down" v-on="on" icon v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'"><v-icon>mdi-format-align-{{ data.blocks[current_block.index].format.align }}</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item-group v-model="data.blocks[current_block.index].format.align">
            <v-list-item value="left">
              <v-list-item-title><v-icon>mdi-format-align-left</v-icon></v-list-item-title>
            </v-list-item>

            <v-list-item value="center">
              <v-list-item-title><v-icon>mdi-format-align-center</v-icon></v-list-item-title>
            </v-list-item>

            <v-list-item value="right">
              <v-list-item-title><v-icon>mdi-format-align-right</v-icon></v-list-item-title>
            </v-list-item>
          </v-list-item-group>

          <v-list-item-group v-model="data.blocks[current_block.index].format.just">
            <v-list-item value="top">
              <v-list-item-title><v-icon>mdi-format-align-top</v-icon></v-list-item-title>
            </v-list-item>

            <v-list-item value="middle">
              <v-list-item-title><v-icon>mdi-format-align-middle</v-icon></v-list-item-title>
            </v-list-item>

            <v-list-item value="bottom">
              <v-list-item-title><v-icon>mdi-format-align-bottom</v-icon></v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-menu offset-y class="hidden-sm-and-down" v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="hidden-sm-and-down" v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'"><v-icon>mdi-format-font</v-icon></v-btn>
        </template>
        <v-list dense>
          <v-list-item-group  v-model="data.blocks[current_block.index].format.font">
            <v-list-item value="Roboto">
              <v-list-item-title style="font-family: 'Roboto'"><v-list-item-title>Aa</v-list-item-title></v-list-item-title>
            </v-list-item>

            <v-list-item value="Roboto Slab">
              <v-list-item-title style="font-family: 'Roboto Slab'"><v-list-item-title>Aa</v-list-item-title></v-list-item-title>
            </v-list-item>

            <v-list-item value="Roboto Mono">
              <v-list-item-title style="font-family: 'Roboto Mono'"><v-list-item-title>Aa</v-list-item-title></v-list-item-title>
            </v-list-item>

            <v-list-item value="Roboto Condensed">
              <v-list-item-title style="font-family: 'Roboto Condensed'"><v-list-item-title>Aa</v-list-item-title></v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-menu :close-on-content-click="false" offset-y class="hidden-sm-and-down" v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'">
        <template v-slot:activator="{ on }">
          <v-btn :style="{ 'color': data.blocks[current_block.index].format.color }" v-on="on" icon class="hidden-sm-and-down" v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'"><v-icon>mdi-format-color-fill</v-icon></v-btn>
        </template>
        <v-color-picker show-swatches mode="hexa" style="background-color: #2E2E2E;" v-model="data.blocks[current_block.index].format.color"></v-color-picker>
      </v-menu>




      <!-- Mobile format -->
      <v-spacer class="hidden-md-and-up"></v-spacer>
      <v-menu :close-on-content-click="false" offset-y class="hidden-md-and-up" v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="hidden-md-and-up"><v-icon>mdi-format-paint</v-icon></v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="data.blocks[current_block.index].format.b = !data.blocks[current_block.index].format.b"  v-model="data.blocks[current_block.index].format.b">
            <v-list-item-title><v-icon>mdi-format-bold</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks[current_block.index].format.i = !data.blocks[current_block.index].format.i"  v-model="data.blocks[current_block.index].format.i">
            <v-list-item-title><v-icon>mdi-format-italic</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks[current_block.index].format.ul = !data.blocks[current_block.index].format.ul"  v-model="data.blocks[current_block.index].format.ul">
            <v-list-item-title><v-icon>mdi-format-underline</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks[current_block.index].format.ol = !data.blocks[current_block.index].format.ol"  v-model="data.blocks[current_block.index].format.ol">
            <v-list-item-title><v-icon>mdi-format-overline</v-icon></v-list-item-title>
          </v-list-item>

          <v-list-item @click="data.blocks[current_block.index].format.str = !data.blocks[current_block.index].format.str"  v-model="data.blocks[current_block.index].format.str">
            <v-list-item-title><v-icon>mdi-format-strikethrough</v-icon></v-list-item-title>
          </v-list-item>

          <v-menu class="hidden-md-and-up" offset-x left v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'">
            <template v-slot:activator="{ on }">
              <v-list-item class="hidden-md-and-up" v-on="on" icon v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'"><v-icon>mdi-format-align-{{ data.blocks[current_block.index].format.align }}</v-icon></v-list-item>
            </template>
            <v-list dense>
              <v-list-item-group v-model="data.blocks[current_block.index].format.align">
                <v-list-item value="left">
                  <v-list-item-title><v-icon>mdi-format-align-left</v-icon></v-list-item-title>
                </v-list-item>

                <v-list-item value="center">
                  <v-list-item-title><v-icon>mdi-format-align-center</v-icon></v-list-item-title>
                </v-list-item>

                <v-list-item value="right">
                  <v-list-item-title><v-icon>mdi-format-align-right</v-icon></v-list-item-title>
                </v-list-item>
              </v-list-item-group>

              <v-list-item-group v-model="data.blocks[current_block.index].format.just">
                <v-list-item value="top">
                  <v-list-item-title><v-icon>mdi-format-align-top</v-icon></v-list-item-title>
                </v-list-item>

                <v-list-item value="middle">
                  <v-list-item-title><v-icon>mdi-format-align-middle</v-icon></v-list-item-title>
                </v-list-item>

                <v-list-item value="bottom">
                  <v-list-item-title><v-icon>mdi-format-align-bottom</v-icon></v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>

          <v-menu offset-x left class="hidden-md-and-up">
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on" icon class="hidden-md-and-up"><v-icon>mdi-format-font</v-icon></v-list-item>
            </template>
            <v-list dense>
              <v-list-item-group v-model="data.blocks[current_block.index].format.font">
                <v-list-item value="Roboto">
                  <v-list-item-title style="font-family: 'Roboto'"><v-list-item-title>Aa</v-list-item-title></v-list-item-title>
                </v-list-item>

                <v-list-item value="Roboto Slab">
                  <v-list-item-title style="font-family: 'Roboto Slab'"><v-list-item-title>Aa</v-list-item-title></v-list-item-title>
                </v-list-item>

                <v-list-item value="Roboto Mono">
                  <v-list-item-title style="font-family: 'Roboto Mono'"><v-list-item-title>Aa</v-list-item-title></v-list-item-title>
                </v-list-item>

                <v-list-item value="Roboto Condensed">
                  <v-list-item-title style="font-family: 'Roboto Condensed'"><v-list-item-title>Aa</v-list-item-title></v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
          <v-menu :close-on-content-click="false" offset-x class="hidden-md-and-up" v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'">
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on" icon class="hidden-md-and-up" v-if="current_block.type == 'text' || current_block.type == 'header1' || current_block.type == 'header2' || current_block.type == 'header3' || current_block.type == 'header4'"><v-icon :style="{ 'color': data.blocks[current_block.index].format.color }">mdi-format-color-fill</v-icon></v-list-item>
            </template>
            <v-color-picker show-swatches mode="hexa" style="background-color: #2E2E2E;" v-model="data.blocks[current_block.index].format.color"></v-color-picker>
          </v-menu>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-dialog v-model="open_dialog" max-width="500">
      <v-card>
        <v-card-title>
          <span>Open a Document</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="open_dialog = false" class="dialog-close-btn">
            <v-icon>close</v-icon>
          </v-btn>
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

    <v-container id="editor" @click.self="current_block = {}" @mouseover.self="current_hover_block_index = null">
      <v-layout v-for="(block, index) in data.blocks" :key="index" @click="current_block = block" class="block" align-center justify-center @mouseover="current_hover_block_index = block.index">
        <v-flex xs11 class="text" v-if="block.type == 'text'">
          <textarea :rows="block.rows" style="width: 100%;" :class="{ 'body-1': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Paragraph"></textarea>
        </v-flex>

        <v-flex xs11 class="header1" v-if="block.type == 'header1'">
          <textarea :rows="block.rows" style="width: 100%;" :class="{ 'display-1': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
        </v-flex>

        <v-flex xs11 class="header2" v-if="block.type == 'header2'">
          <textarea :rows="block.rows" style="width: 100%;" :class="{ 'display-2': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
        </v-flex>

        <v-flex xs11 class="header3" v-if="block.type == 'header3'">
          <textarea :rows="block.rows" style="width: 100%;" :class="{ 'display-3': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
        </v-flex>

        <v-flex xs11 class="header4" v-if="block.type == 'header4'">
          <textarea :rows="block.rows" style="width: 100%;" :class="{ 'display-4': true, 'font-weight-bold': block.format.b, 'font-italic': block.format.i, 'font-underline': block.format.ul, 'font-strikethrough': block.format.str, 'font-overline': block.format.ol }" :style="{ 'text-align': block.format.align, 'font-family': block.format.font + '!important', 'color': block.format.color, 'vertical-align': block.format.just }" type="text" v-model="block.content" placeholder="Header"></textarea>
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
          <embed v-if="block.src_saved" :src="block.src" :style="{ 'width': '100%', 'height': block.size + 'px' }">
        </v-flex>

        <v-flex xs11 class="html" v-if="block.type == 'html'">
          <div v-if="!block.src_saved">
            <textarea type="text" v-model="block.src" placeholder="Source" style="width: 750px; margin-right: 14px;"></textarea>
            <v-btn text color="accent" @click="block.src_saved = true" v-if="block.src">Save</v-btn>
          </div>
          <iframe v-if="block.src_saved" :srcdoc="block.src" style="width: 100%;"></iframe>
        </v-flex>

        <v-flex xs11 :class="{ 'divider': block.index != current_hover_block_index, 'divider-hover': block.index == current_hover_block_index }" v-if="block.type == 'divider'">
          <v-divider></v-divider>
        </v-flex>

        <v-flex xs11 class="gap" v-if="block.type == 'gap'">
          <div style="height: 45px;"></div>
        </v-flex>

        <v-flex xs11 class="code" v-if="block.type == 'code'">
          <kbd><input type="text" v-model="block.content" placeholder="Code snippet"></kbd>
        </v-flex>

        <v-flex xs1 style="text-align: center;">
          <v-menu offset-y v-if="current_hover_block_index == block.index" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon color="grey darken-2" v-if="current_hover_block_index == block.index"><v-icon>mdi-dots-vertical</v-icon></v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="moveUp(block, index)">
                <v-list-item-title><v-icon>mdi-chevron-up</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="deleteBlock(block.index)" color="red">
                <v-list-item-title><v-icon>mdi-delete</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="moveDown(block, index)">
                <v-list-item-title><v-icon>mdi-chevron-down</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="addListItem(index)" v-if="block.type == 'ul' || block.type == 'ol' || block.type == 'nl'">
                <v-list-item-title><v-icon>mdi-plus</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="removeListItem(index)" v-if="block.type == 'ul' || block.type == 'ol' || block.type == 'nl'">
                <v-list-item-title><v-icon>mdi-minus</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="block.src_saved = false" v-if="(block.type == 'image' || 'embed') && block.src_saved">
                <v-list-item-title><v-icon>mdi-pencil</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="block.size += 1" v-if="block.type == 'header1' || block.type == 'header2' || block.type == 'header3'">
                <v-list-item-title><v-icon>mdi-format-font-size-increase</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="block.size -= 1" v-if="block.type == 'header2' || block.type == 'header3' || block.type == 'header4'">
                <v-list-item-title><v-icon>mdi-format-font-size-decrease</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="block.rows += 1" v-if="block.type == 'header1' || block.type == 'header2' || block.type == 'header3' || block.type == 'header4' || block.type == 'text'">
                <v-list-item-title><v-icon>mdi-plus</v-icon></v-list-item-title>
              </v-list-item>

              <v-list-item @click="block.rows -= 1" v-if="block.type == 'header1' || block.type == 'header2' || block.type == 'header3' || block.type == 'header4' || block.type == 'text'">
                <v-list-item-title><v-icon>mdi-minus</v-icon></v-list-item-title>
              </v-list-item>

              <v-menu offset-x left v-if="block.type == 'embed' || block.type == 'html'" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-list-item v-if="block.type == 'embed' || block.type == 'html'" v-on="on" icon><v-icon>mdi-resize</v-icon></v-list-item>
                </template>
                <v-list dense>
                  <v-slider max="750" style="max-width: 500px; min-width: 200px; padding: 20px 40px 0px 40px;" v-model="data.blocks[current_block.index].size"></v-slider>
                </v-list>
              </v-menu>
            </v-list>
          </v-menu>
        </v-flex>
      </v-layout>
    </v-container>
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
          { type: 'header1', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 0, size: 0, rows: 1 },
          { type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 1, rows: 3 }
        ],
        author: this.$root.username
      },
      current_block: {},
      current_hover_block_index: null
    }
  },
  methods: {
    newDocument() {
      this.data = {
        title: '',
        blocks: [
          { type: 'header1', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 0, size: 0, rows: 1 },
          { type: 'text', content: '', format: { b: false, i: false, ul: false, str: false, ol: false, align: 'left', font: 'Roboto', color: '#FFFFFF', just: 'top' }, index: 1, rows: 3 }
        ],
        author: this.$root.username
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
        if (block.index >= index) block.index -= 1
      })
      this.current_block = {}
    }
  }
}
</script>

<style scoped>
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

* {
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
  padding: 14px;
  border-radius: 6px;
}

.block:hover {
  background-color: #343434;
}

.v-menu__content {
  background-color: #424242;
}

.v-menu--inline {
  display: none !important;
}

.divider {
  position: relative;
  top: +18px;
  bottom: +18px;
  height: 36px;
}

.divider-hover {
  position: relative;
  top: 0px;
  bottom: +18px;
}

textarea {
  resize: none;
}
</style>