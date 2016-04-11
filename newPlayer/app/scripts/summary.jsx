'use strict';

import React from 'react';
import Markdown2HTML from 'react-markdown-to-html';
require('!style!css!sass!../sass/markdown.css');

class Summary extends React.Component {
  render() {
    return (
      <div className="markdown-body summaryContent">
        <Markdown2HTML src="app/article/2015sumary.md" />
      </div>
    );
  }
}

export default Summary;
