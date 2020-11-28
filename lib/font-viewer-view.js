/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let FontViewerView;
const _ = require('underscore-plus');
const path = require('path');
const {$, ScrollView} = require('atom-space-pen-views-plus');
const {Emitter, CompositeDisposable} = require('atom');

// View that renders a {FontViewer}.
module.exports =
(FontViewerView = class FontViewerView extends ScrollView {
  static content() {
    return this.div({class: 'font-viewer', tabindex: -1}, () => {
      this.style({outlet: 'style'});
      return this.div({class: 'font-container', outlet: 'container'});
    });
  }

  initialize(fontViewer) {
    this.fontViewer = fontViewer;
    super.initialize(...arguments);
    return this.emitter = new Emitter;
  }

  attached() {
    this.disposables = new CompositeDisposable;

    this.disposables.add(atom.commands.add(this.element, {
      'font-viewer:zoom-in': () => this.zoomIn(),
      'font-viewer:zoom-out': () => this.zoomOut(),
      'font-viewer:reset-zoom': () => this.resetZoom()
    }
    )
    );

    const {
      container
    } = this;
    this.fontViewer.getAvailableCharacters(availableCharacters => _.each(availableCharacters, c => container.append(`<div class=\"font-glyph\">&#x${c.toString(16)};<div class=\"font-glyph-id\">U+${c.toString(16)}</div></div>`)));

    this.style.append(`@font-face { font-family: \"${this.fontViewer.getUri()}\"; src: url('${this.fontViewer.getUri()}'); }`);
    return this.container.css({'font-family': `\"${this.fontViewer.getUri()}\"`});
  }

  detached() {
    return this.disposables.dispose();
  }

  // Zooms the font preview out by 10%.
  zoomOut() {
    return this.adjustSize(0.9);
  }

  // Zooms the font preview in by 10%.
  zoomIn() {
    return this.adjustSize(1.1);
  }

  // Zooms the font preview to its normal size.
  resetZoom() {
    if (!this.isVisible()) { return; }

    return this.container.css({'font-size': ''});
  }

  // Adjust the size of the font preview by the given multiplying factor.
  //
  // factor - A {Number} to multiply against the current size.
  adjustSize(factor) {
    if (!this.isVisible()) { return; }

    return this.container.css({'font-size': `${parseInt(this.container.css('font-size'), 10) * factor}px`});
  }
});