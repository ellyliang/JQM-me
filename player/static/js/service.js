//Data list Service
playerApp.factory('DataList', function() {
	var data = [
		{
			"id": 0,
			"artist": "Lene Marlin",
			"song" : "A Place Nearby",
			"album" : "《Playing My Game》",
			"songUrl" : "/static/music/A Place Nearby.mp3",
			"avatar" : "/static/img/lm.jpg"
		},
		{
			"id": 1,
			"artist": "David Archuleta",
			"song" : "Crush",
			"album" : "《David Archuleta》",
			"songUrl" : "/static/music/Crush.mp3",
			"avatar" : "/static/img/da.jpg"
		},
		{
			"id": 2,
			"artist": "Lucie Arnaz",
			"song" : "I still Believe In Love",
			"album" : "《They'Re Playing Our Song》",
			"songUrl" : "/static/music/I Still Believe In Love.mp3",
			"avatar" : "/static/img/la.jpg"
		},
		{
			"id": 3,
			"artist": "Jem",
			"song" : "It's Amazing",
			"album" : "《Sex And The City - Original Motion Picture Soundtrack》",
			"songUrl" : "/static/music/It'S Amazing.mp3",
			"avatar" : "/static/img/jem.jpg"
		},
		{
			"id": 4,
			"artist": "Jewel",
			"song" : "Stay Here Forever",
			"album" : "《Sweet And Wild》",
			"songUrl" : "/static/music/Stay Here Forever.mp3",
			"avatar" : "/static/img/jew.jpg"
		},
		{
			"id": 5,
			"artist": "Lenka",
			"song" : "The Show",
			"album" : "《#LOVE acoustic》",
			"songUrl" : "/static/music/The Show.mp3",
			"avatar" : "/static/img/lenka.jpg"
		},
		{
			"id": 6,
			"artist": "Tamas Wells",
			"song" : "Valder Fields",
			"album" : "《A Plea En Vendredi》",
			"songUrl" : "/static/music/Valder Fields.mp3",
			"avatar" : "/static/img/tw.jpg"
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
			//audio的url
			var url = $rootScope.data[index].songUrl;
			Audio.src = url;
			Audio.play();

			//让图片转动
			player.isPlay = true;

			//显示当前播放歌曲的信息
			DataBinding.dataBindFunc(index);

			//显示暂停按钮
			player.playing = true;
		},
		play: function(index) { //播放
			if(player.playing) {
				player.stop();
			}

			player.controllPlay(index);
		},
		stop: function() { //暂停
			if(player.playing) {
				Audio.pause();
			}

			//图片停止转动
			player.isPlay = false;

			//显示播放按钮
			player.playing = false;
		},
		prev: function() { //上一首歌
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

			player.controllPlay(player.active);
		},
		surplusBar: function() {
			if(!isNaN(Audio.duration)) {
				//音乐剩余时间
				var surplus = Audio.duration-Audio.currentTime;
				var surplusMin = parseInt(surplus/60);
				var surplusSecond = parseInt(surplus%60);
				if(surplusSecond < 10 ) {
					surplusSecond = '0'+surplusSecond;
				}

				player.playTime = '-' + surplusMin + ':' + surplusSecond;

				//播放进度条
				var progressValue = Audio.currentTime/Audio.duration*1000;
				player.surplusWidth = 'width:' + parseInt(progressValue) + 'px';
			}
		},
		bufferBar: function() {
			bufferTimer = $interval(function() {
				var bufferIndex = Audio.buffered.length;

				if (bufferIndex > 0 && Audio.buffered != undefined) {
					var bufferValue = Audio.buffered.end(bufferIndex-1)/Audio.duration*1000;
					player.bufferWidth = 'width:' + parseInt(bufferValue) + 'px';

					if (Math.abs(Audio.duration - Audio.buffered.end(bufferIndex-1)) <1) {
						player.bufferWidth = 'width: 1000px';
						clearInterval(bufferTimer);
					}
				}
			}, 1000);
		}

	};

	//播放时间
	Audio.addEventListener('timeupdate',function(){
		$rootScope.$apply(player.surplusBar());
	});

	//缓冲时间
	Audio.addEventListener('canplay', function() {
		$rootScope.$apply(player.bufferBar());
	});

	return player;
}]);
