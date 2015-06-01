var playerApp = angular.module('playerApp', ['ngRoute']);
//player Controller
playerApp.controller('playerCtrls', ['$scope', 'DataList', 'DataBinding', 'Audio', 'Player', '$timeout', function($scope, DataList, DataBinding, Audio, Player, $timeout) {

	DataBinding.dataBindFunc(0);//默认绑定的数据

	//本应用重点部分：控制播放器
	$scope.player = Player;
	$scope.audio = Audio;
	$scope.player.active = 0;

	$scope.player.controllPlay($scope.player.active);
	$scope.player.playerSrc($scope.player.active);

	$scope.isSelected = function() {
		$scope.player.active = this.$index; //给当前的li添加.icon-music
		DataBinding.dataBindFunc($scope.player.active);//绑定数据
		$scope.player.controllPlay($scope.player.active); //播放当前的音频
	};
}]);
//Data list Service
playerApp.factory('DataList', function() {
	var data = [
		{
			"id": 0,
			"artist": "Lene Marlin",
			"song" : "A Place Nearby",
			"album" : "《Playing My Game》",
			"songUrl" : "static/music/A Place Nearby.mp3",
			"avatar" : "static/img/lm.jpg"
		},
		{
			"id": 1,
			"artist": "David Archuleta",
			"song" : "Crush",
			"album" : "《David Archuleta》",
			"songUrl" : "static/music/Crush.mp3",
			"avatar" : "static/img/da.jpg"
		},
		{
			"id": 2,
			"artist": "Lucie Arnaz",
			"song" : "I still Believe In Love",
			"album" : "《They'Re Playing Our Song》",
			"songUrl" : "static/music/I Still Believe In Love.mp3",
			"avatar" : "static/img/la.jpg"
		},
		{
			"id": 3,
			"artist": "Jem",
			"song" : "It's Amazing",
			"album" : "《Sex And The City - Original Motion Picture Soundtrack》",
			"songUrl" : "static/music/It'S Amazing.mp3",
			"avatar" : "static/img/jem.jpg"
		},
		{
			"id": 4,
			"artist": "Jewel",
			"song" : "Stay Here Forever",
			"album" : "《Sweet And Wild》",
			"songUrl" : "static/music/Stay Here Forever.mp3",
			"avatar" : "static/img/jew.jpg"
		},
		{
			"id": 5,
			"artist": "Lenka",
			"song" : "The Show",
			"album" : "《#LOVE acoustic》",
			"songUrl" : "static/music/The Show.mp3",
			"avatar" : "static/img/lenka.jpg"
		},
		{
			"id": 6,
			"artist": "Tamas Wells",
			"song" : "Valder Fields",
			"album" : "《A Plea En Vendredi》",
			"songUrl" : "static/music/Valder Fields.mp3",
			"avatar" : "static/img/tw.jpg"
		}
	]; 

	return data;
});

//Binding Data Service
playerApp.factory('DataBinding', ['$rootScope', 'DataList', function($rootScope, DataList) {
	$rootScope.datas = DataList;

	var dataObj = {
		dataBindFunc: function(index) {
			$rootScope.avatar = $rootScope.datas[index].avatar;
			$rootScope.artist = $rootScope.datas[index].artist;
			$rootScope.song = $rootScope.datas[index].song;
			$rootScope.album = $rootScope.datas[index].album;
		}
	};

	return dataObj;
}]);

//Audio Service
playerApp.factory('Audio', ['$document', function($document) {
	var audio = $document[0].createElement('audio');

	return audio;
}]);

//Player Service
playerApp.factory('Player', ['$rootScope', '$interval' ,'Audio', 'DataList', 'DataBinding', function($rootScope, $interval, Audio, DataList, DataBinding) {
	$rootScope.data = DataList;

	var player = {
		musicLen: '7',
		controllPlay: function(index) {
			player.playerSrc(index);
			player.play();//播放
			player.isPlay = true;//让图片转动
			DataBinding.dataBindFunc(index);//显示当前播放歌曲的信息
			player.playing = true;//显示暂停按钮
		},
		playerSrc: function(index) { //Audio的url
			var url = $rootScope.data[index].songUrl;
			Audio.src = url;
		},
		play: function(index) { //播放
			if(player.playing) {
				player.stop();
			}

			Audio.play(); //h5 audio api
			player.isPlay = true; //图片转动
			player.playing = true; //显示暂停按钮
		},
		stop: function() { //暂停
			if(player.playing) {
				Audio.pause();
			}

			player.isPlay = false; //图片停止转动
			player.playing = false;//显示播放按钮
		},
		prev: function(index) { //上一首歌
			console.log('prev:' + player.active);

			if(player.active == 0) { //如果是第一首音乐
				player.active = player.musicLen - 1;  //播放最后一首 	
			} else {
				player.active -= 1; //否则递减
			}

			player.controllPlay(player.active);
		},
		next: function(index) { //下一首歌
			console.log('next:' + player.active);

			if(player.active == (player.musicLen - 1)) {
				player.active = 0;
			} else {
				player.active += 1;
			}

			player.controllPlay(player.active); //播放显示的数据
		}
	};

	return player;
}]);

//Mode Dirctive（播放方式和音量控制）
playerApp.directive('musicMode', ['$timeout', '$document', function($timeout, $document) {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			player : '=',
			audio: '='
		},
		templateUrl: 'tpls/mode.html',
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

//播放音乐进度条
playerApp.directive('progressBar', ['$document', '$interval', '$rootScope', function($document, $interval, $rootScope) {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			player: '=',
			audio: '='
		},
		templateUrl: 'tpls/progress.html',
		link: function(scope, rootScope, ele, attr) {
			console.log($rootScope);
			scope.surplusBar = function() { //音乐剩余时间
				if(!isNaN(scope.audio.duration)) {
					
					var surplus = scope.audio.duration-scope.audio.currentTime;
					var surplusMin = parseInt(surplus/60);
					var surplusSecond = parseInt(surplus%60);
					if(surplusSecond < 10 ) {
						surplusSecond = '0'+surplusSecond;
					}

					scope.playTime = '-' + surplusMin + ':' + surplusSecond;

					//播放进度条
					var progressValue = scope.audio.currentTime/scope.audio.duration*1000;
					scope.surplusWidth = 'width:' + parseInt(progressValue) + 'px';
				}
			};

			scope.bufferBar = function() { //缓冲进度条
				bufferTimer = $interval(function() {
					var bufferIndex = scope.audio.buffered.length;

					if (bufferIndex > 0 && scope.audio.buffered != undefined) {
						var bufferValue = scope.audio.buffered.end(bufferIndex-1)/scope.audio.duration*1000;
						scope.bufferWidth = 'width:' + parseInt(bufferValue) + 'px';

						if (Math.abs(scope.audio.duration - scope.audio.buffered.end(bufferIndex-1)) <1) {
							scope.bufferWidth = 'width: 1000px';
							clearInterval(bufferTimer);
						}
					}
				}, 1000);
			};

			scope.adjustPorgress = function(ev) { //播放进度条
				var event = window.event || ev;
				var progressX = event.clientX - $document[0].querySelector('.progress-bar').getBoundingClientRect().left;
				scope.audio.currentTime = parseInt(progressX/1000*scope.audio.duration);
				scope.audio.removeEventListener('canplay', scope.bufferBar);
			}

			//播放时间
			scope.audio.addEventListener('timeupdate',function(){
				scope.$apply(scope.surplusBar());
			});

			//缓冲时间
			scope.audio.addEventListener('canplay', function() {
				scope.$apply(scope.bufferBar());
			});
		}
	}
}]);
playerApp.config(function($routeProvider) {
	$routeProvider.when('/player', {
		templateUrl: 'index.html',
		controller: 'playerCtrls'
	}).otherwise({
		redirectTo: '/player'
	});
});