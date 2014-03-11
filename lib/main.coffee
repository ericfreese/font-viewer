path = require 'path'
_ = require 'underscore-plus'
FontViewer = require './font-viewer'

module.exports =
  activate: ->
    atom.workspace.registerOpener(openUri)

  deactivate: ->
    atom.workspace.unregisterOpener(openUri)

# Files with these extensions will be opened as fonts
fontExtensions = ['.otf', '.ttf', '.woff']
openUri = (uriToOpen) ->
  uriExtension = path.extname(uriToOpen).toLowerCase()
  if _.include(fontExtensions, uriExtension)
    new FontViewer(uriToOpen)
