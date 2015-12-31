'use strict';

import React from 'react';
import {Router, Route, Link} from 'react-router';

class Index extends React.Component {
  render() {
    return (
      <div>
        <img id="imgBg" className="dim" src="http://7xkinp.com1.z0.glb.clouddn.com/bg.png" alt="" />
        <article className="indexBg">
          <p className="indexMe">
            <img src="http://7xkinp.com1.z0.glb.clouddn.com/1.jpeg" alt="个人头像" />
            <span className="indexName">2015柚子总结</span>
          </p>
          <p className="indexBtn">
            <i className="icon-music"></i>
            <Link to="Music">Just relax ~Click Me!!</Link>
          </p>

          <footer className="footer">powered by youzi.</footer>
        </article>
      </div>
    )
  }
}

export default Index
