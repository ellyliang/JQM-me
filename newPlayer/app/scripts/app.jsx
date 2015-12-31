'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link} from 'react-router';

require('!style!css!sass!../sass/app.scss');

import Index from './index.jsx';
import Music from './music.jsx';
import Summary from './summary.jsx';

render((
    <Router>
        <Route name="Index" path="/" component={Index}></Route>
        <Route name="Music" path="/music" component={Music}></Route>
        <Route name="Summary" path="/summary" component={Summary}></Route>
    </Router>
), document.querySelector('#index'));
