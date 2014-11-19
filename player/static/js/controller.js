//player Controller
playerApp.controller('playerCtrls', ['$scope', 'DataList', 'DataBinding', 'Audio', 'Player', '$timeout', function($scope, DataList, DataBinding, Audio, Player, $timeout) {

	//默认绑定的数据
	DataBinding.dataBindFunc(0);

	//本应用重点部分：控制播放器
	$scope.player = Player;
	$scope.audio = Audio;
	$scope.player.active = 0;

	$scope.isSelected = function() {
		//给当前的li添加.icon-music
		$scope.player.active = this.$index; 
	
		//绑定数据
		DataBinding.dataBindFunc($scope.player.active);

		//播放当前的音频
		Player.play($scope.player.active);
	};
}]);