'use strict';

import React from 'react';
import {Router, Route, Link} from 'react-router';
require('!style!css!sass!../sass/calendar.css');

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      months: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      date: new Date().getDate()
    };
    this.clickTriangleLeft = this.clickTriangleLeft.bind(this);
    this.clickTriangleRight = this.clickTriangleRight.bind(this);
  }

  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  calculateDays(year, month) {
    let days = this.state.months[month];
    if(month === 1 && this.isLeapYear(year)) {  // 2月比较特殊，非闰年28天，闰年29天
      days = 29;
    }

    return days;
  }

  getFirstDays(year, month) {
    let dt = new Date(year, month, 1),
        weekend = dt.getDay();

    return weekend;
  }

  clickTriangleLeft() {
    this.setState({
      'month': this.state.month-1,
      'date': new Date().getDate()
    }, () => {
      if(this.state.month < 0) {
        this.setState({
          'year': this.state.year-1,
          'month': 11
        });
      }
    });
  }

  clickTriangleRight() {
    this.setState({
      'month': this.state.month+1,
      'date': new Date().getDate()
    }, () => {
      if(this.state.month > 11) {
        this.setState({
          'year': this.state.year+1,
          'month': 0
        });
      }
    });
  }

  selectDays(day) {
    return() => {
      this.setState({'date': day});
    };
  }

  render() {
    let [dayArr, startDayArr, dayLiNode, startDayLiNode, calendarFirstDays, liStyle, date, formatDate] = [[], [], '', '', this.state.date, '', '', ''];

    date = (this.state.month < 9) ? ('0'+(this.state.month+1)) : (this.state.month+1);
    formatDate = this.state.year + '年' + date + '月' + this.state.date + '日';

    for(var i=0, len=this.calculateDays(this.state.year, this.state.month); i<len; i++) {
      dayArr.push(i+1);
    }
    for(var n=0, nlen=this.getFirstDays(this.state.year, this.state.month); n<nlen; n++) {
      startDayArr.push(n);
    }

    startDayLiNode = startDayArr.map((day, index) => {
      return <li key={index}></li>;
    });
    dayLiNode = dayArr.map((day, index) => {
      liStyle = (calendarFirstDays === day) ? 'current' : '';
      return <li className={liStyle} key={index} onClick={this.selectDays(day).bind(this)}>{day}</li>;
    });

    return (
      <div className="calendar">
        <div className="calendar-header">
          <p>
            <span className="icon-yz"></span>
            <span className="yz-years">{this.state.year}</span>
            <span>年</span>
            <span className="yz-months">{this.state.month+1}</span>
            <span>月</span>
          </p>
          <p className="triangle-left" onClick={this.clickTriangleLeft}></p>
          <p className="triangle-right" onClick={this.clickTriangleRight}></p>
        </div>

        <div>
          <div className="weekday">
            <ul>
              <li>日</li>
              <li>一</li>
              <li>二</li>
              <li>三</li>
              <li>四</li>
              <li>五</li>
              <li>六</li>
            </ul>
          </div>
          <div className="calendar-day">
            <ul className="yz-days">
              {startDayLiNode}
              {dayLiNode}
            </ul>
          </div>
        </div>

        <div className="calendarInput">
          <input type="text" name="calendar" readOnly="readOnly" value={formatDate}/>
        </div>

        <p className="calendarJQ"><a href="http://www.uselessblog.cn/JQM-me/calendar/">闲的慌，搞了个JQuery版本 &gt;&gt;</a></p>

        <article>
          <footer className="footer">powered by youzi.</footer>
        </article>
      </div>
    );
  }
}

export default Calendar;
