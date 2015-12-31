'use strict';

import React from 'react';
import {Router, Route, Link} from 'react-router';
import List from './data.jsx';

class MusicButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      song : List[0].url,
      isPlaying: 1,
      songIndex: 0,
      time: '0:00',
      isTimeupdate: 1
    };
  }

  _Play(audio) {
    this.setState({'isPlaying': 0}, () => {
      audio.play();
    });
  }
  _Pause(audio) {
    audio.pause();
    this.setState({'isPlaying': 1});
  }

  _Prev(songLen, cb) {
    this.setState({'songIndex': ++this.state.songIndex}, cb);
    if(this.state.songIndex > songLen) {
      this.setState({'songIndex': 0}, cb);
    }
  }

  _Next(songLen, cb) {
    this.setState({'songIndex': --this.state.songIndex}, cb);
    if(this.state.songIndex < 0) {
      this.setState({'songIndex': songLen}, cb);
    }
  }

  _currSong(index) {
    this.setState({'song': List[index].url});
  }

  _endedPlay(songLen, cb) {
    if(+this.state.songIndex === songLen) {
      this.setState({'songIndex': 0}, cb);
    } else {
      this.setState({'songIndex': ++this.state.songIndex}, cb);
    }
  }

  onPlayBtn() {
    let audioNode = this.refs.audio;
    if(this.state.isPlaying) {
      this._Play(audioNode);
    } else {
      this._Pause(audioNode);
    }
  }

  onNextBtn() {
    let [audioNode, songLen] = [this.refs.audio, List.length-1];
    this._Next(songLen, () => {
      this._currSong(this.state.songIndex);
      this._Play(audioNode);
    });
  }

  onPrevBtn() {
    let [audioNode, songLen] = [this.refs.audio, List.length-1];
    this._Prev(songLen, () => {
      this._currSong(this.state.songIndex);
      this._Play(audioNode);
    });
  }
  // 记住你所有的component的手动绑定的事件都在要willUnmout干掉(谢谢百灵鸟^_^)
  componentDidMount(prevProps, prevState, prevContext) {
    let [audioNode, songLen] = [this.refs.audio, List.length-1];

    audioNode.addEventListener('ended', () => {
      this._endedPlay(songLen, () => {
        this._currSong(this.state.songIndex);
        this._Play(audioNode);
      });
    }, false);

    let onTimeupdate = () => {
      let [remainTime, remainTimeMin, remainTimeSec, remainTimeInfo] = [];

      if(!isNaN(audioNode.duration)) {
        remainTime = audioNode.duration - audioNode.currentTime;
        remainTimeMin = parseInt(remainTime/60);
        remainTimeSec = parseInt(remainTime%60);

        if(remainTimeSec < 10) {
          remainTimeSec = '0'+remainTimeSec;
        }
        remainTimeInfo = remainTimeMin + ':' + remainTimeSec;
        this.setState({'time': remainTimeInfo});
      }
    };

    audioNode.addEventListener('timeupdate', onTimeupdate, false);

    this.cleanup = () => {
      audioNode.removeEventListener('timeupdate', onTimeupdate, false);
    };
  }

  componentWillUnmount () {
    this.cleanup();
  }

  render() {
    let [classString, defaultClass, playClass] = ['', 'iconMusic icon-pause', ' rotate'];
    if(!this.state.isPlaying) {
      classString = defaultClass + playClass;
    } else {
      classString = defaultClass;
    }

    return (
      <article className="musicContent">
        <header className="musicHeader">
          <audio ref="audio" src={this.state.song} />
          <span className="iconMusic icon-backward" onClick={this.onNextBtn.bind(this)}></span>
          <span className={classString} onClick={this.onPlayBtn.bind(this)}></span>
          <span className="iconMusic icon-forward" onClick={this.onPrevBtn.bind(this)}></span>
        </header>

        <MusicContent musicInfo={List} musicIndex={this.state.songIndex} timeInfo={this.state.time}/>
      </article>
    )
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
