'use babel';

import SchemaInformationCollapserView from './schema-information-collapser-view';
import { CompositeDisposable } from 'atom';

export default {

  schemaInformationCollapserView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.schemaInformationCollapserView = new SchemaInformationCollapserView(state.schemaInformationCollapserViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.schemaInformationCollapserView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'schema-information-collapser:toggle': () => this.toggle()
    }));
    this.subscriptions.add(atom.workspace.observeTextEditors(this.onFileOpen));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.schemaInformationCollapserView.destroy();
  },

  serialize() {
    return {
      schemaInformationCollapserViewState: this.schemaInformationCollapserView.serialize()
    };
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show()
    );
  },

  onFileOpen(editor) {
    if (editor.lineTextForBufferRow(0) == "# == Schema Information") {
      let timer = setInterval(() => {
        if (editor.isFoldableAtBufferRow(0)) {
          editor.foldBufferRow(0);
          clearInterval(timer);
          console.log('Folded!');
        } else {
          console.log('Noop');
        }

      }, 100);
    }
  }

};
