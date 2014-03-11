{ScrollView} = require 'atom'

# View that renders a {FontViewer}.
module.exports =
class FontViewerView extends ScrollView
  @content: ->
    @div class: 'font-viewer', tabindex: -1, =>
      @style outlet: 'style'
      @div class: 'font-container', outlet: 'container', =>
        @div class: 'font-preview', 'ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\nabcdefghijklm\nnopqrstuvwxyz\n1234567890'

  initialize: (fontViewer) ->
    super

    @style.append "@font-face { font-family: \"#{fontViewer.getUri()}\"; src: url('#{fontViewer.getUri()}'); }"
    @container.css 'font-family': "\"#{fontViewer.getUri()}\""

    @command 'font-viewer:zoom-in', => @zoomIn()
    @command 'font-viewer:zoom-out', => @zoomOut()
    @command 'font-viewer:reset-zoom', => @resetZoom()

  # Zooms the font preview out by 10%.
  zoomOut: ->
    @adjustSize(0.9)

  # Zooms the font preview in by 10%.
  zoomIn: ->
    @adjustSize(1.1)

  # Zooms the font preview to its normal size.
  resetZoom: ->
    return unless @isVisible()

    @container.css 'font-size': ''

  # Adjust the size of the font preview by the given multiplying factor.
  #
  # factor - A {Number} to multiply against the current size.
  adjustSize: (factor) ->
    return unless @isVisible()

    @container.css 'font-size': "#{parseInt(@container.css('font-size'), 10) * factor}px"
