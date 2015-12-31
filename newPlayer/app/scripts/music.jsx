'use strict';

import React from 'react';
import {Router, Route, Link} from 'react-router';
import List from './data.jsx';

class MusicButton extends React.Component {
  constructor(props) {       // getInitialState is not used in ES6 classes. Instead assign this.state in the constructor
    super(props);            // 调用父类

    this.state = {
      index : 0,             // 播放索引
      music : List[0].url,   // 这个不这么玩的，我本来想做成接口，通过请求接口，返回数据，后续有时间再完善吧....
      flag : 1,              // 标识播放状态，当前状态为停止，否则播放
      time : '0.00'          // 播放时间
    };
  }
  // 播放&暂停音乐
  musicPlay() {
    let audio = this.refs.audio;  // 获取audio dom

    if(this.state.flag) {
      audio.play();               // audio api play
      this.setState({'flag': 0});
    } else {
      audio.pause();              // audio api pause
      this.setState({'flag': 1});
    }
  }
  // 播放前一首
  musicBackward() {
    this.musicPlayFunc((audio, musicLen) => {
      this.setState({'index': --this.state.index});
      if(this.state.index < 0) {
        this.setState({'index': musicLen});
      }
    });
  }
  // 播放前首
  musicForward() {
    this.musicPlayFunc((audio, musicLen) => {
      this.setState({'index': ++this.state.index});
      if(this.state.index > musicLen) {
        this.setState({'index': 0});
      }
    });
  }
  // 封装播放函数
  musicPlayFunc(callback) {
    let audio = this.refs.audio;
    let musicLen = List.length-1;

    if(callback) callback(audio, musicLen);

    setTimeout(() => {
      this.setState({'music': List[this.state.index].url});
      this.setState({'flag': 0}); // 执行播放动画
      audio.play();
    }, 0);
  }

  // 初始化渲染执行之后立刻调用一次
  componentDidMount() {
    let audio = this.refs.audio;

    // 循环播放
    audio.addEventListener('ended', () => { // audio api ended
      if(+this.state.index === (List.length-1)) {
        this.setState({'index': 0});
      } else {
        this.setState({'index': ++this.state.index});
      }

      setTimeout(() => {
        this.setState({'music': List[this.state.index].url});
        this.setState({'flag': 0}); // 执行播放动画
        audio.play();
      }, 0);
    }, false);


    // 剩余播放时间
    audio.addEventListener('timeupdate', () => {
      // remainTime    剩余时间
      // remainTimeMin 剩余分
      // remainTimeSec 剩余秒
      let [remainTime, remainTimeMin, remainTimeSec, remainTimeInfo] = [];

      // audio.duration    音乐总时间
      // audio.currentTime 音乐当前时间
      if(!isNaN(audio.duration)) {
        remainTime = audio.duration - audio.currentTime;
        remainTimeMin = parseInt(remainTime/60);  // 剩余分
        remainTimeSec = parseInt(remainTime%60);  // 剩余秒

        if(remainTimeSec < 10) {
          remainTimeSec = '0'+remainTimeSec;
        }
        remainTimeInfo = remainTimeMin + ':' + remainTimeSec;
        // this.setState({'time': remainTimeInfo});
      }
    });
  }
  // 记住你所有的component的手动绑定的事件都在要willUnmout干掉(谢谢百灵鸟^_^)
  componentWillUnmount () {
   let audio = this.refs.audio;
   audio.removeEventListener('timeupdate');
   audio.removeEventListener('ended');
  }

  render() {
    // 控制播放按钮的的动画效果，这里用了es6的解构来装了下逼....
    let [classString, defaultClass, playClass] = ['', 'iconMusic icon-pause', ' rotate'];
    if(!this.state.flag) {
      classString = defaultClass + playClass;
    } else {
      classString = defaultClass;
    }

    return (
      <article className="musicContent">
        <header className="musicHeader">
          <audio ref="audio" src={this.state.music} />
          <span className="iconMusic icon-backward" onClick={this.musicBackward.bind(this)}></span>
          <span className={classString} onClick={this.musicPlay.bind(this)}></span>
          <span className="iconMusic icon-forward" onClick={this.musicForward.bind(this)}></span>
        </header>

        <MusicContent musicInfo={List} musicIndex={this.state.index} timeInfo={this.state.time}/>
      </article>
    );
  }
}

class MusicContent extends React.Component {

  render() {
    let [musicCurr, musicListInfo] = [this.props.musicIndex, this.props.musicInfo];

    return (
      <article className="musicList">
        <p>-{this.props.timeInfo}</p>
        <p><i className="icon-music"></i> {musicListInfo[musicCurr].song}</p>
        <p><i className="icon-vynil"></i> {musicListInfo[musicCurr].album}</p>
      </article>
    );
  }
}

class Music extends React.Component {
  render() {
    return (
      <article className="music">
        <nav className="linkToDetail">
          <Link to="Summary">
            <div className="detailPeople guidePerson"></div>
          </Link>
        </nav>

        <MusicButton />

        <article>
          <footer className="footer">powered by elly.</footer>
        </article>
      </article>
    )
  }
}

export default Music
