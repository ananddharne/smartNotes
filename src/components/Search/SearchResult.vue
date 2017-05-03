<template>
  <li class="search__result"
      :id="`result_${note.id}`"
      :class="{ active: isActive }"
      @click="onResultSelect">

    <input v-if="renaming"
           :id="`search-result-editor-${note.id}`"
           v-model="note.name"
           @blur="onRenameBlur"
           @keyup.esc="onRenameBlur"
           @keyup.enter="onRenameSave"
           v-focus
           class="search__result__editor"
           type="text">

    <template v-if="!(renaming)">
      <span class="search__result__name">
            <span v-html="name"></span>
            <span v-show="note.body.length > 0"
                  class="search__result__description"> 
                  – {{ note.body }}
            </span>
      </span>
      
      <span class="search__result__time">
            {{ note.date_modified | prettyDate }}
      </span>
    </template>
  </li>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import keyboard from 'keyboardjs'

import { utilsMixin } from '../../mixins'

export default {
  name: 'search-result',

  props: ['note', 'isActive', 'renaming'],
  
  mixins: [utilsMixin],

  data: () => ({
    oldName: null,
    isRenamed: false
  }),

  created () {
    this.setUpHotKeys()
  },

  computed: {
    ...mapGetters([
      'query',
      'activeNote'
    ]),

    name () {
      if (this.query.length > 0) {
        const regexString = this.query.replace(/\s/g, '|')
        const re = new RegExp(regexString, 'gi')
        return this.note.name
                   .replace(/\n$/g, '\n\n')
                   .replace(re, '<mark>$&</mark>')
      }
      return this.note.name
    }
  },

  methods: {
    ...mapActions([
      'UPDATE_NOTE'
    ]),
    ...mapMutations([
      'SET_RESULT_INDEX',
      'SET_RENAMING_ID'
    ]),

    setUpHotKeys () {
      keyboard.bind('alt + ctrl + r', () => {
        if (this.activeNote) {
          this.onRenameFocus()
        }
      })
    },

    onResultSelect () {
      this.$emit('onResultSelect', this.note)
    },

    onRenameFocus () {
      this.oldName = this.note.name
      this.SET_RENAMING_ID(this.activeNote.id)
      this.$nextTick(() => {
        const id = `#search-result-editor-${this.activeNote.id}`
        this.focusElement(id)
      })
    },

    onRenameBlur () {
      if (this.oldName != null && this.name !== this.oldName && !this.isRenamed) {
        this.note.name = this.oldName
      }
      this.isRenamed = false

      this.SET_RENAMING_ID(null)
      this.$emit('onRenameBlur')
    },

    onRenameSave () {
      this.UPDATE_NOTE()
      this.oldName = null
      this.isRenamed = true
      this.SET_RESULT_INDEX(0)
      this.onRenameBlur()
    }
  }

}
</script>