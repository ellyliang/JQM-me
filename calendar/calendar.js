/**
 * @author: 柚子
 * @date: 2016-04-09
 * @description: 纯属练习写日历组件
 */

var YzCalendar = function(options) {
	if(!options) options = {};
	return function(options) {
		var self = this,
			today = new Date(),
			currentYear = today.getFullYear(),
			currentMonth = today.getMonth(),
			currentDate = today.getDate();

		this.dom = options.dom;					// 控制的节点	
		this.inputDom = options.inputDom;		// 展示时间的节点

		// 是否为闰年
		var _isLeapYear = function(year) {
			return (year % 4 == 0 && year % 100 !== 0) || (year % 400 === 0);
		};

		// 根据年月计算天
		var _months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var _calculateDays = function(year, month) {
			var days = _months[month];
			if(month === 1 && _isLeapYear(year)) {	// 2月比较特殊，非闰年28天，闰年29天
				days = 29;
			}

			return days;
		};

		// 某年某月的第一天是星期几
		var _getFirstDays = function(year, month) {
			var dt = new Date(year, month, 1),
				weekend = dt.getDay();

			return weekend;
		};

		// 格式化日期
		this.format = function(day) {
			var date = '',
				formatMonth = '';
			if(currentMonth < 10) {
				formatMonth = '0' + currentMonth;
			}
			date = currentYear + '年' + (+formatMonth+1) + '月' + day + '日'; 

			return date;
		};

		// 渲染
		this.render = function(year, month, day) {
			var dayLi = '',
				monthFirsDays = _getFirstDays(year, month);
			for(var m=0, mLen=monthFirsDays; m<mLen; m++) {
				dayLi += '<li></li>';
			}
			for(var i=0, len=_calculateDays(year, month); i<len; i++) {
				dayLi += '<li>'+ (i+1) +'</li>';
			}

			self.dom.find('.yz-days').html(dayLi);
			self.dom.find('.yz-days li:eq('+ (day-1+monthFirsDays) +')').addClass('current');
			self.dom.find('.yz-months').html(month+1);
			self.dom.find('.yz-years').html(year);
		};

		// 默认
		this.init = (function() {
			self.render(currentYear, currentMonth, currentDate);
			self.inputDom.val(self.format(currentDate));
		})();

		// 上一年跟下一年处理
		var clickTriangle = function() {
			if(currentMonth < 0) {
				currentYear --;
				currentMonth = 11;
			}
			if(currentMonth > 11) {
				currentYear ++;
				currentMonth = 0;
			}

			self.render(currentYear, currentMonth, currentDate);
			self.inputDom.val(self.format(currentDate));
		};

		// 事件
		this.events = (function() {
			// 上一年
			$('.triangle-left').click(function() {
				currentMonth --;
				clickTriangle();
			});
			// 下一年
			$('.triangle-right').click(function() {
				currentMonth ++;
				clickTriangle();
			});
			// 选择DAY
			$('.yz-days').on('click', 'li', function() {
				var day = $(this).html();
				if(day === '') return;
				$(this).addClass('current').siblings().removeClass('current');
				self.inputDom.val(self.format(day));
			});
		})();
	}
};
var yzcalendar = new YzCalendar;

$(function() {
	yzcalendar({
		dom : $('#jYzCalendar'),
		inputDom : $('#jYzInput')
	});
});