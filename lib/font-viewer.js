"use babel"
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import path from "path"
import fs from "fs-plus"
import { File, CompositeDisposable } from "atom"
import {NewMemoryFace} from "freetype2"

// Editor model for a font file
export default class FontViewer {
  static initClass() {
    atom.deserializers.add(this)
  }

  static deserialize({ filePath }) {
    if (fs.isFileSync(filePath)) {
      return new FontViewer(filePath)
    } else {
      console.warn(`Could not deserialize font viewer for path '${filePath}' because that file no longer exists`)
    }
  }

  constructor(filePath) {
    this.file = new File(filePath)
    this.subscriptions = new CompositeDisposable()
  }

  serialize() {
    return { filePath: this.getPath(), deserializer: this.constructor.name }
  }

  getViewClass() {
    return require("./font-viewer-view")
  }

  destroy() {
    this.subscriptions.dispose()
  }

  // Retrieves the filename of the open file.
  //
  // This is `'untitled'` if the file is new and not saved to the disk.
  //
  // Returns a {String}.
  getTitle() {
    const filePath = this.getPath()
    if (filePath) {
      return path.basename(filePath)
    } else {
      return "untitled"
    }
  }

  // Retrieves the URI of the font file.
  //
  // Returns a {String}.
  getUri() {
    return this.getPath()
  }

  // Retrieves the absolute path to the font file.
  //
  // Returns a {String} path.
  getPath() {
    return this.file.getPath()
  }

  getAvailableCharacters(callback) {
    return fs.readFile(this.getPath(), function (err, buffer) {
      const chars = []
      const face = NewMemoryFace(buffer, 0);

      let char = face.getFirstChar()
      while (char && char.glyphIndex !== 0) {
        chars.push(char.charCode)
        char = face.getNextChar(char.charCode)
      }

      return callback(chars)
    })
  }

  // Compares two {FontViewer}s to determine equality.
  //
  // Equality is based on the condition that the two URIs are the same.
  //
  // Returns a {Boolean}.
  isEqual(other) {
    return other instanceof FontViewer && this.getUri() === other.getUri()
  }
}

FontViewer.initClass()
