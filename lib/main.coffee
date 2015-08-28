path = require 'path'
_ = require 'underscore-plus'
FontViewer = require './font-viewer'

module.exports =
  activate: ->
    @openerDisposable = atom.workspace.addOpener(openURI)

  deactivate: ->
    @openerDisposable.dispose()

# Files with these extensions will be opened as fonts
fontExtensions = ['.otf', '.ttf', '.woff']
openURI = (uriToOpen) ->
  uriExtension = path.extname(uriToOpen).toLowerCase()
  if _.include(fontExtensions, uriExtension)
    new FontViewer(uriToOpen)
