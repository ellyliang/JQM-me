var React = require('react');

/**
 * 音乐播放器
 */
var Music = React.createClass({
	getInitialState : function() {
		return {
			index : 0,
			surplusTime : '0:00'
		};
	},
	handleParentCount : function(count, time) {  //回调，为了获取子元素中的变量（chidren -> parent -> children）-> (<MusicButton /> -> <Music /> -> <List />)
		this.setState({index : count});
		if(time) {
			var timeSecond = time.split(':')[1];
			if(+timeSecond > 0) {
				this.setState({surplusTime : time});
			}
		}
	},
	render : function() {
		return (
			<article className="music">
				<article className="musicContent">
					<MusicButton data={this.props.musicData} handleChildCount={this.handleParentCount} />
					<List data={this.props.musicData} index={this.state.index} time={this.state.surplusTime} />
					<Footer />
				</article>
			</article>
		);
	}
});

var Audio = React.createClass({
	render : function() {
		return (
			<audio src={this.props.data.songUrl}/>
		);
	}	
});

var MusicButton = React.createClass({
	getInitialState : function() {
		return {
			isPlay : true,
			count : 0
		}
	},
	musicPlay : function () { //播放与停止
		var audio = React.findDOMNode(this.refs.audio);
		if(this.state.isPlay) {
			audio.play();
			this.setState({isPlay: false});
		} else {
			audio.pause();
			this.setState({isPlay: true});
		}
	},
	getBackWardMusic : function() {  //上一首
		if(this.state.count) {
			this.setState({count: --this.state.count});
		} else {
			this.setState({count: 2});
		}
		this.musicLoad();
	},
	getForwardMusic : function() { //下一首
		if(this.state.count < (this.props.data.length-1)) {
			this.setState({count: ++this.state.count});
		} else {
			this.setState({count: 0});
		}
		
		this.musicLoad();
	},
	musicLoad : function() {
		var audio = React.findDOMNode(this.refs.audio);
		var that = this;
		setTimeout(function() {
			that.props.handleChildCount(that.state.count); //回调
			audio.load();
			audio.play();
		}, 0);
		this.setState({isPlay: false});
	},
	componentDidMount: function() {  /*componentDidMount初始化渲染执行之后立刻调用一次，仅客户端有效*/
		var audio = React.findDOMNode(this.refs.audio);
		var that = this;
		audio.addEventListener('ended', function() { //循环播放
			if(that.state.count === (that.props.data.length-1)) {
				that.setState({count: 0});
			} else {
				that.setState({count: ++that.state.count});
			}
			that.musicLoad();
		}, false);

		audio.addEventListener('timeupdate', function() { //剩余时间
			if(!isNaN(audio.duration)) {
				var surplus = audio.duration - audio.currentTime;
				var surplusMin = parseInt(surplus/60);
				var surplusSecond = parseInt(surplus%60);
				if(surplusSecond < 10) {
					surplusSecond = '0'+surplusSecond;
				}

				var surplusTime = surplusMin + ':' + surplusSecond;
				that.props.handleChildCount(that.state.count, surplusTime); //回调
			}
		}, false);
	},
	render : function() {
		var classString = 'iconMusic icon-pause';
		if(this.state.isPlay) {
			classString = 'iconMusic icon-pause';
		} else {
			classString += ' rotate';
		}

		return (
			<header className="musicHeader">
				<Audio ref="audio" data={this.props.data[this.state.count]}/>
				<span onClick={this.getBackWardMusic} className="iconMusic icon-backward"></span>
				<span onClick={this.musicPlay} className={classString}></span>
				<span onClick={this.getForwardMusic} className="iconMusic icon-forward"></span>
			</header>
		);
	}
});

var List = React.createClass({
	render : function() {
		return (
			<article className="musicList">
				<p>-{this.props.time}</p>
				<p><i className="icon-music"></i> {this.props.data[this.props.index].song}</p>
				<p><i className="icon-vynil"></i> {this.props.data[this.props.index].album}</p>
			</article>
		);
	}
});

var Footer = React.createClass({
	render : function() {
		return (
			<article>
				<footer className="footer"><p>点击中间按钮即可播放～</p>Powered by elly.</footer>
			</article>
		);
	}
});

module.exports = Music;