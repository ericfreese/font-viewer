path = require 'path'
fs = require 'fs-plus'
freetype = require 'freetype2'

# Editor model for a font file
module.exports =
class FontViewer
  atom.deserializers.add(this)

  @deserialize: ({filePath}) ->
    if fs.isFileSync(filePath)
      new FontViewer(filePath)
    else
      console.warn "Could not deserialize font viewer for path '#{filePath}' because that file no longer exists"

  constructor: (@filePath) ->

  serialize: ->
    {@filePath, deserializer: @constructor.name}

  getViewClass: ->
    require './font-viewer-view'

  # Retrieves the filename of the open file.
  #
  # Returns a {String}.
  getTitle: ->
    path.basename(@filePath)

  # Retrieves the URI of the font file.
  #
  # Returns a {String}.
  getUri: ->
    @filePath

  # Retrieves the absolute path to the font file.
  #
  # Returns a {String} path.
  getPath: ->
    @filePath

  getFontData: (callback) ->
    fs.readFile @getPath(), (err, buffer) ->
      callback(freetype.parse(buffer))

  # Compares two {FontViewer}s to determine equality.
  #
  # Equality is based on the condition that the two URIs are the same.
  #
  # Returns a {Boolean}.
  isEqual: (other) ->
    other instanceof FontViewer and @getUri() is other.getUri()
