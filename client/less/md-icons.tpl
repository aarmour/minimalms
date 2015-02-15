//
// <%= generatedWarning %>
//
// Material Design Icons
//
// To use, create an inline element with the appropriate classes:
//
// <span class="md-icon md-icon-search"></span>
//
// See http://google.github.io/material-design-icons/ for a live preview of
// available icons.

// Import the fonts
@font-face {
  font-family: 'Material Design Icons';
  src: url('@{icon-font-path}@{icon-font-name}.eot');
  src: url('@{icon-font-path}@{icon-font-name}.eot?#iefix') format('embedded-opentype'),
       url('@{icon-font-path}@{icon-font-name}.woff2') format('woff2'),
       url('@{icon-font-path}@{icon-font-name}.woff') format('woff'),
       url('@{icon-font-path}@{icon-font-name}.ttf') format('truetype'),
       url('@{icon-font-path}@{icon-font-name}.svg#@{icon-font-svg-id}') format('svg');
}

// Base class
.md-icon {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Material Design Icons';
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// Icons
<% _.forEach(glyphs, function (glyph) { %>.md-icon-<%= glyph.name.replace(/_[0-9]{2}px$/, '').replace('ic_', '').replace(/_/g, '-') %> { &:before { content: "\<%= glyph.codepoint.toString(16) %>"; } }<%= '\n' %><% }); %>
