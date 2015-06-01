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