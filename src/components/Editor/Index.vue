<template>
  <div class="editor">
    
    <template v-if="activeNote">
      <editor-highlight :body="activeNote.body">
      </editor-highlight>
      <textarea
        id="editor-textarea"
        class="editor__textarea" 
        v-model="activeNote.body"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
        placeholder="Description of the note..." 
        rows="12">
      </textarea>
       <!-- <vue-editor v-model="content"></vue-editor> -->
    </template>    
    
    <div
      class="editor__placeholder"
      v-else>
      No Note Selected
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import keyboard from 'keyboardjs'

import { utilsMixin } from '../../mixins'
import EditorHighlight from './EditorHighlight.vue'


export default {
  name: 'editor',
  
  mixins: [utilsMixin],

  props: ['isPreview'],
 
  components: {
    EditorHighlight,
  },
  data() {
    return {
       content: '<h1>Some initial content</h1>'
    }
  },

  created () {
    if (!this.isPreview) {
      this.setUpHotKeys()
    }
  },

  beforeDestroy () {
    keyboard.reset()
  },

  computed: {
    ...mapGetters([
      'activeNote',
      'query',
      'editingId'
     ])
  },

  methods: {
    ...mapActions([
      'UPDATE_NOTE'
    ]),
    ...mapMutations([
      'SET_RESULT_INDEX',
      'SET_EDITING_ID'
    ]),

    setUpHotKeys () {
      keyboard.bind('tab', (e) => {
        e.preventDefault()
        if (this.activeNote) {
          this.onEditorFocus()
        }
      })
    },

    onEditorFocus () {
      const id = '#editor-textarea'
      this.focusElement(id)
    },
    
    onInput () {
      this.UPDATE_NOTE(this.activeNote)

      if (this.activeNote.id != this.editingId)
        this.SET_RESULT_INDEX(0)
    },

    onFocus () {
      if (this.activeNote.id != this.editingId)
        this.SET_EDITING_ID(this.activeNote.id)
    },

    onBlur () {
      this.SET_EDITING_ID(null)
    },
    htmlChanged (e) {
     this.html = e
   }
  }

}
</script>
