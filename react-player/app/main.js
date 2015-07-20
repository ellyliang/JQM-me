var React = require('react');
var Router = require('./Router');
var Music = require('./music');
var Data = require('./data');

/**
 * 首页
 */
var Index = React.createClass({
	render : function() {
		return (
			<div>
				<ImgBg />
				<article className="indexBg">
					<p className="indexMe">
						<img src="app/images/1.jpeg" alt="个人头像" />
						<span className="indexName">柚子音乐播放器</span>
					</p>
					<p className="indexBtn"><i className="icon-music"></i><a href="/#music">Come on &gt;&gt;</a></p>
				</article>
			</div>
		);
	}
});

var ImgBg = React.createClass({
	render : function() {
		return (
			<img id="imgBg" className="dim" src="/app/images/bg.jpg" alt="" />
		);
	}
}); 

//首页
Router.addRoute('index', function() {
	React.render(<Index />, document.body);
});
//音乐播放器
Router.addRoute('music', function() {
	React.render(<Music musicData={Data}  />, document.body);
});

Router.start();