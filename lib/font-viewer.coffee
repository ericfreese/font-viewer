path = require 'path'
fs = require 'fs-plus'
{File, CompositeDisposable} = require 'atom'
ft = require 'freetype2'

# Editor model for a font file
module.exports =
class FontViewer
  atom.deserializers.add(this)

  @deserialize: ({filePath}) ->
    if fs.isFileSync(filePath)
      new FontViewer(filePath)
    else
      console.warn "Could not deserialize font viewer for path '#{filePath}' because that file no longer exists"

  constructor: (filePath) ->
    @file = new File(filePath)
    @subscriptions = new CompositeDisposable()

  serialize: ->
    {filePath: @getPath(), deserializer: @constructor.name}

  getViewClass: ->
    require './font-viewer-view'

  destroy: ->
    @subscriptions.dispose()

  # Retrieves the filename of the open file.
  #
  # This is `'untitled'` if the file is new and not saved to the disk.
  #
  # Returns a {String}.
  getTitle: ->
    if filePath = @getPath()
      path.basename(filePath)
    else
      'untitled'

  # Retrieves the URI of the font file.
  #
  # Returns a {String}.
  getUri: -> @getPath()

  # Retrieves the absolute path to the font file.
  #
  # Returns a {String} path.
  getPath: -> @file.getPath()

  getAvailableCharacters: (callback) ->
    fs.readFile @getPath(), (err, buffer) ->
      chars = []
      gindex = {}
      face = {}
      ft.New_Memory_Face(buffer, 0, face);
      face = face.face
      charcode = ft.Get_First_Char(face, gindex)

      while gindex.gindex != 0
        chars.push(charcode);
        charcode = ft.Get_Next_Char(face, charcode, gindex);

      callback(chars)

  # Compares two {FontViewer}s to determine equality.
  #
  # Equality is based on the condition that the two URIs are the same.
  #
  # Returns a {Boolean}.
  isEqual: (other) ->
    other instanceof FontViewer and @getUri() is other.getUri()
