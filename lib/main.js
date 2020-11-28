/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const _ = require('underscore-plus');
const FontViewer = require('./font-viewer');

module.exports = {
  activate() {
    return this.openerDisposable = atom.workspace.addOpener(openURI);
  },

  deactivate() {
    return this.openerDisposable.dispose();
  }
};

// Files with these extensions will be opened as fonts
const fontExtensions = ['.otf', '.ttf', '.woff'];
var openURI = function(uriToOpen) {
  const uriExtension = path.extname(uriToOpen).toLowerCase();
  if (_.include(fontExtensions, uriExtension)) {
    return new FontViewer(uriToOpen);
  }
};
