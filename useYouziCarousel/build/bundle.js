/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var carousel = __webpack_require__(2);

	//所有的数据
	var list = [{
		img: "images/1.png"
	},
	{
		img: "images/2.png"
	},
	{
		img: "images/3.png"
	},
	{
		img: "images/4.png"
	},
	{
		img: "images/5.png",
	},
	{
		img: "images/6.png",
	},
	{	
		img: "images/7.png",
	},
	{	
		img: "images/8.png",
	}
	];

	new carousel({
		dom: document.getElementById('jCarousel'),
		data: list
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Carousel = function(opts) {
		this.dom = opts.dom;
		this.data = opts.data;

		this.init();
		this.renderDom();
		this.bindDom();
	};

	Carousel.prototype.init = function() {
		// 算出窗口的长宽比
		this.radio = window.innerHeight/window.innerWidth;
		// 移动的宽度
		this.scaleW = window.innerWidth;
		// 当前图片的索引
		this.idx = 0;
	};

	Carousel.prototype.renderDom = function() {
		var dom = this.dom,
			data = this.data,
			len = data.length,
			scale = this.scaleW,
			self = this;
		// 创建UL
		this.outer = document.createElement('ul');
		this.outer.className = 'ui-carousel-wrapper';

		for(var i=0; i<len; i++) {
			var item = data[i];
			if(item) {
				// 创建LI
				var li = document.createElement('li');
				li.className += 'ui-carousel-item';
				li.style.width = scale + 'px';
				li.style.height = window.innerHeight + 'px';
				li.style.webkitTransform = 'translate3d('+(i*scale)+'px, 0, 0)';
				// 处理图片
				// if(opts.height/opts.width > self.radio) {	// y形图片
					li.innerHTML = '<img class="ui-carousel-img" src="'+ item.img +'" />';
				// } else {									// x形图片
					// li.innerHTML = '<img src="'+ opts.img +'" style="width:'+ window.innerWidth +'px"/>';
				// }
				self.outer.appendChild(li);
			}
		}

		this.outer.style.width = scale + 'px';
		this.outer.style.height = window.innerHeight + 'px';
		dom.appendChild(this.outer);		
	};

	Carousel.prototype.bindDom = function() {
		var self = this,
			scale = this.scaleW,
			outer = self.outer,
			data = self.data.length;

		var startHandler = function(event) {
			self.startX = event.touches[0].pageX;
			self.offsetX = 0;
			self.startTime = new Date() * 1;
		};
		var moveHandler = function(event) {
			event.preventDefault();
			self.offsetX = event.touches[0].pageX - self.startX;
			var lis = outer.getElementsByTagName('li');
			var i = self.idx - 1;
			var m = i + 3;
			for(i; i<m; i++) {
				lis[i] && (lis[i].style.webkitTransform = 'translate3d('+ ((i-self.idx) * scale + self.offsetX) +'px, 0, 0)');
			}
		};
		var endHandler = function() {
			var boundary = scale/6;
			var endTime = new Date() * 1;
			var lis = outer.getElementsByTagName('li');

			if(endTime - self.startTime > 800) {
				if(self.offsetX >= boundary) {
					self.go('-1');
				} else if(self.offsetX < -boundary) {
					self.go('1');
				} else {
					self.go('0');
				}
			} else {
				if(self.offsetX > 50) {
					self.go('-1');
				} else if(self.offsetX < -50) {
					self.go('1');
				} else {
					self.go('0');
				}
			}
		};

		outer.addEventListener('touchstart', startHandler);
		outer.addEventListener('touchmove', moveHandler);
		outer.addEventListener('touchend', endHandler);
	};

	Carousel.prototype.go = function(n) {
		var idx = this.idx,
			cidx,
			lis = this.outer.getElementsByTagName('li'),
			length = lis.length;

		if(typeof n == 'number') {
			cidx = idx;
		} else if(typeof n == 'string') {
			cidx = idx + n * 1;
		}

		if(cidx > length - 1) {
			cidx = length - 1;
		} else if(cidx < 0) {
			cidx = 0;
		}

		this.idx = cidx;

		lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
		lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
		lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

		lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
		lis[cidx-1] && (lis[cidx-1].style.webkitTransform = 'translate3d(-'+ this.scaleW +'px, 0, 0)');
		lis[cidx+1] && (lis[cidx+1].style.webkitTransform = 'translate3d('+ this.scaleW +'px, 0, 0)'); 
	};

	// Carousel.prototype.getImgWh = function(img, callback) {
	// 	var image = new Image(),
	// 		imgOpts = {};
	// 	imgOpts.img = img;
	// 	image.onload = function() {
	// 		imgOpts.width = image.width;
	// 		imgOpts.height = image.height;

	// 		callback && callback(imgOpts);
	// 	};
	// 	image.src = img;
	// };

	module.exports = Carousel;


/***/ }
/******/ ]);