"use babel"
import { each } from "underscore-plus"
import { ScrollView } from "atom-space-pen-views-plus"
import { Emitter, CompositeDisposable } from "atom"

// View that renders a {FontViewer}.
export default class FontViewerView extends ScrollView {
  static content() {
    this.div({ class: "font-viewer", tabindex: -1 }, () => {
      this.style({ outlet: "style" })
      this.div({ class: "font-container", outlet: "container" })
    })
  }

  initialize(fontViewer) {
    this.fontViewer = fontViewer
    super.initialize(...arguments)
    this.emitter = new Emitter()
  }

  attached() {
    this.disposables = new CompositeDisposable()

    this.disposables.add(
      atom.commands.add(this.element, {
        "font-viewer:zoom-in": () => this.zoomIn(),
        "font-viewer:zoom-out": () => this.zoomOut(),
        "font-viewer:reset-zoom": () => this.resetZoom(),
      })
    )

    const { container } = this
    this.fontViewer.getAvailableCharacters((availableCharacters) =>
      each(availableCharacters, (c) => {
        const cString = c.toString(16)
        container.append(
          `<div class="font-glyph">&#x${cString};<div class="font-glyph-id">U+${cString}</div></div>`
        )
      })
    )

    // load font in the view
    const fontViewerURI = this.fontViewer.getUri()
    this.style.append(`
      @font-face {
        font-family: "${fontViewerURI}";
        src: url("${fontViewerURI}");
      }`)
    this.container.css({ "font-family": `"${fontViewerURI}"` })
  }

  detached() {
    this.disposables.dispose()
  }

  // Zooms the font preview out by 10%.
  zoomOut() {
    this.adjustSize(0.9)
  }

  // Zooms the font preview in by 10%.
  zoomIn() {
    this.adjustSize(1.1)
  }

  // Zooms the font preview to its normal size.
  resetZoom() {
    if (!this.isVisible()) {
      return
    }

    this.container.css({ "font-size": "" })
  }

  // Adjust the size of the font preview by the given multiplying factor.
  //
  // factor - A {Number} to multiply against the current size.
  adjustSize(factor) {
    if (!this.isVisible()) {
      return
    }

    this.container.css({ "font-size": `${parseInt(this.container.css("font-size"), 10) * factor}px` })
  }
}
