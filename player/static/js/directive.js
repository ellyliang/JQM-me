//Mode Dirctive（播放方式和音量控制）
playerApp.directive('musicMode', ['$timeout', '$document', function($timeout, $document) {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			player : '=',
			audio: '='
		},
		templateUrl: '/tpls/mode.html',
		link: function(scope, ele, attr) {

			var status = 'list'; //标识播放模式，默认为list

			scope.addActive = function(index) { //选中style
				ele.children('li').removeClass('active')
				ele.children('li').eq(index).addClass('active');
			};

			scope.addActive(0);

			scope.listPlay = function() { //列表循环
				status = 'list';
				console.log('list');
				scope.addActive(0);
			};

			scope.randomPlay = function() { //随机循环
				console.log('random');
				status = 'random';
				scope.addActive(1);
			};

			scope.repeatPlay = function() { // 单曲循环
				status = 'repeat';
				console.log('repeat');
				scope.addActive(2)
			};
			
			scope.audio.addEventListener('ended', function() {
				if(status == 'list') { //列表循环
					
					if(scope.player.active == (scope.player.musicLen - 1)) {
						scope.player.active = 0;
					} else {
						scope.player.active += 1;
					}

				} else if(status == 'random') { //随机播放
					var randomIndex = parseInt(scope.player.musicLen * Math.random());

					console.log('randomPlay' + randomIndex);
				
					if (randomIndex == scope.player.active) {//下一首和当前相同，跳到下一首
						randomIndex += 1;
					}

					scope.player.active = randomIndex;
				} else {
					console.log('repeat'); //单曲循环
				}

				scope.$apply(scope.player.controllPlay(scope.player.active));
			});

			//声音volume条显示或隐藏
			var volTime;
			scope.volShow = false;

			scope.showVol = function() {
				scope.volShow = true;
				clearTimeout(volTime);
			};

			scope.hideVol = function() {
				volTime = $timeout(function() {
					scope.volShow = false;
				}, 300);
			};

			//控制音量
			scope.volStyle = 'height: 64px';
			scope.audio.volume = 0.8;
			scope.adjustVolume = function(ev){ //调整音量
				var event = window.event || ev;
				var volumeY = $document[0].querySelector('.play-vol').getBoundingClientRect().bottom - event.clientY;
				scope.audio.volume = (volumeY/75).toFixed(2);
				scope.volStyle = "height:" + volumeY + 'px';
		 	};

		 	//声音是否播放
		 	scope.muted = true;
		 	scope.audioMuted = function() {
		 		if(scope.audio.muted == false) {
		 			scope.audio.muted = true;
		 			scope.muted = false;
		 		} else {
		 			scope.audio.muted = false;
		 			scope.muted = true;
		 		}
		 	};
		}

	}
}]);