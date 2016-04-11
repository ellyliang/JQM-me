/*!
 * Z.js v0.1.0
 * @snandy 2014-05-31 12:09:51
 *
 */
/**
 * 拖拽插件
 *
 * 使用 Use
 *   Z.ui.Dragable(option)
 * 
 * 配置 Option
 *   elem:    // DOM元素
 *   handle:  // @string   鼠标按下开始拖动的元素
 *   canDrag: // @boolean  默认: true
 *   axis:    // @string   拖拽方向，默认: "xy"。x: 仅水平方向，y: 仅垂直方向
 *   area:    // @array    [minX,maxX,minY,maxY] 拖拽范围 默认任意拖动
 *   inwin:   // @boolean  仅在浏览器窗口内拖动
 *   cursor:  // @string   鼠标状态
 *   zIndex:  // @number   拖拽时zIndex值
 *   fixed:   // @boolean  出现滚动条时保持fixed 默认true
 * 
 * 方法 Method
 *   stopDrag   // 停止拖拽
 *   startDrag  // 开启拖拽
 *
 * 事件 Event 
 *   start  开始拖拽 
 *   drag   拖拽中
 *   end    拖拽结束
 *
 */

Z.declareUI('Dragdrop', function() {

var winObj = Z(window)
var docObj = Z(document)
var doc  = docObj[0] 
var ZF = Z.Function
var axisReg = /^xy$/

this.init = function(elem, option) {
    // 相关属性数据
    this.elem = Z.isElement(elem) ? elem : Z(elem)[0]

    this.reset(option)

    // 暂存配置对象
    this.dragObj.data('originData', Z.extend({}, option))

    // 鼠标mousedown
    var mousedown = ZF.bind(this.onMousedown, this)
    this.downObj.mousedown(function(ev) {
        mousedown(ev)
    })
}

this.reset = function(option) {
    this.handle = option.handle
    this.canDrag = option.canDrag !== false
    this.axis = option.axis || 'xy'
    this.area = option.area || []
    this.inwin = option.inwin || false
    this.cursor = option.cursor || 'move'
    this.zIndex = option.zIndex || ''
    this.dragObj = Z(this.elem)
    this.downObj = this.handle ? this.dragObj.find(this.handle) : this.dragObj
    // 设置鼠标状态
    this.downObj.css('cursor', this.cursor)
}

this.onMousedown = function(ev) {
    var dragElem = this.dragObj[0]
    // 模拟拖拽，需要设置为绝对定位
    this.dragObj.css('position', 'absolute')
    
    // 鼠标按下的时候计算下window的宽高，拖拽元素尺寸，不要再mousemove内计算
    var viewSize = Z.viewSize()
    this.dragElemWidth = Math.max(dragElem.offsetWidth, dragElem.clientWidth)
    this.dragElemHeight = Math.max(dragElem.offsetHeight, dragElem.clientHeight)
    this.dragElemMarginTop = parseInt(dragElem.style.marginTop, 10) || 0
    this.dragElemMarginLeft = parseInt(dragElem.style.marginLeft, 10) || 0

    // 仅在窗口可视范围内移动
    if (this.inwin) {
        var winX = viewSize.width - this.dragElemWidth
        var winY = viewSize.height - this.dragElemHeight
        this.area = [0, winX, 0, winY]
    }

    var mousemove = ZF.bind(this.onMousemove, this)
    this.mouseup = ZF.bind(this.onMouseup, this)
    this.mousemove = function(ev) {
        mousemove(ev)
    }

    if (window.captureEvents) { //标准DOM
        ev.stopPropagation()
        ev.preventDefault()
        winObj.blur(this.mouseup)
    } else if(dragElem.setCapture) { //IE
        dragElem.setCapture()
        ev.cancelBubble = true
        this.dragObj.on('losecapture', this.mouseup)
    }
    
    this.diffX = ev.clientX - dragElem.offsetLeft
    this.diffY = ev.clientY - dragElem.offsetTop

    // 开始拖拽
    docObj.mousemove(this.mousemove)
    docObj.mouseup(this.mouseup)

    // starg 事件
    this.fire('start')
}

this.onMousemove = function(ev) {
    var minX, maxX, minY, maxY    
    var moveX = ev.clientX - this.diffX
    var moveY = ev.clientY - this.diffY
    var dragObj = this.dragObj 
    var dragElem = dragObj[0]
    var area = this.area
    
    // 设置拖拽范围
    if (this.area) {
        minX = area[0]
        maxX = area[1]
        minY = area[2]
        maxY = area[3]
        moveX < minX && (moveX = minX) // left 最小值
        moveX > maxX && (moveX = maxX) // left 最大值
        moveY < minY && (moveY = minY) // top 最小值
        moveY > maxY && (moveY = maxY) // top 最大值
    }

    // 设置是否可拖拽，有时可能有取消元素拖拽行为的需求
    if (this.canDrag) {
        var axis = this.axis
        //设置位置，并修正margin
        moveX = moveX - this.dragElemMarginTop
        moveY = moveY - this.dragElemMarginLeft
        if (axis === 'x' || axisReg.test(axis)) {
            dragElem.style.left = moveX + 'px'
        }
        if (axis === 'y' || axisReg.test(axis)) {
            dragElem.style.top =  moveY + 'px'
        }
    }

    // drag 事件
    this.fire('drag', moveX, moveY)
}

this.onMouseup = function(ev) {
    var self = this
    var dragElem = this.dragObj[0]

    // 删除事件注册
    docObj.off('mousemove', this.mousemove)
    docObj.off('mouseup', this.mouseup)

    if (window.releaseEvents) { //标准DOM
        winObj.off('blur', this.mouseup)
    } else if (dargElem.releaseCapture) { //IE
        dragObj.off('losecapture', this.mouseup)
        dragElem.releaseCapture()
    }

    // end 事件
    this.fire('end')
}

this.stopDrag = function() {
    this.canDrag = false
}

this.startDrag = function() {
    this.canDrag = true
}

this.setAxis = function(xy) {
    this.axis = xy
}

})

/**
 * 页签组件
 *
 * 使用 Use
 *   Z.ui.Tab(elem, option)
 *   Z.ui.Tab('.single', {eventType: 'click'})
 *
 * 配置 Option
 *   elem            // DOM元素或CSS选择器
 *   eventType:      // 默认 "mouseover"，鼠标移动到上面时切换，可选 "click"
 *   currClass:      // 默认 "curr"
 *   autoPlay:       // 是否自动播放，默认false
 *   interval:       // 自动播放时间间隔
 *   attrName:       // tab的css属性选择器的key，默认为 data-ui
 *   tabNavVal:      // tab的css属性选择器的key，默认为 tab-nav
 *   tabConVal:      // tab content的css属性选择器的key，默认为 tab-content
 *   index:          // 指定当前的tab, autoPlay必须为true
 *
 * 方法 Method
 *   paly 播放
 *   stop 停止播放
 *
 * 事件 Event
 *   change 页签切换事件
 *
 */
Z.declareUI('Tab', function() {

var ZF = Z.Function

this.init = function(elem, option) {
    var option = option || {}
    // 内部状态变量
    this.elem = Z.isElement(elem) ? elem : Z(elem)[0]
    this.eventType = option.eventType || 'mouseover'
    this.currClass = option.currClass || 'curr'
    this.autoPlay = option.autoPlay || false
    this.interval = option.interval || 5000
    this.currIndex = option.currIndex || 0
    this.attrName = option.attrName || 'data-ui'
    this.tabNavVal = option.tabNavVal || 'tab-nav'
    this.tabConVal = option.tabConVal || 'tab-content'

    // DOM element
    var attrName = this.attrName
    var tabNavVal = this.tabNavVal
    var tabConVal = this.tabConVal

    var elemObj = this.elemObj = Z(this.elem)
    var navObj = this.navObj = elemObj.find('[' + attrName + '=' + tabNavVal + ']')
    var contentObj = this.contentObj = elemObj.find('[' + attrName + '=' + tabConVal + ']')

    if (navObj.length != contentObj.length) {
        throw new Error('navObj and contentObj length must be equal')
    }

    // tab长度
    this.length = navObj.length

    // 设置当前tab，默认为第一个
    if (this.currIndex) {
        navObj.removeClass(this.currClass)
        contentObj.hide()
        this.change(this.currIndex)
    }

    // 自动播放
    if (this.autoPlay) {
        this.play()
    }

    // 事件
    var self = this
    elemObj.delegate('[' + attrName + '=' + tabNavVal + ']', this.eventType, function(ev) {
        var index = navObj.index(this)
        self.change(index)
    })

}

this.change = function(index) {
    var navObj = this.navObj
    var contentObj = this.contentObj
    var currClass = this.currClass

    var nav = navObj.eq(index)
    var content = contentObj.eq(index)

    this._preNav = this._preNav ? this._preNav : nav
    this._preCon = this._preCon ? this._preCon : content

    // nav
    this._preNav.removeClass(currClass)
    nav.addClass(currClass)
    this._preNav = nav

    // content
    this._preCon.hide()
    content.show()
    this._preCon = content

    // 充值当前的索引
    this.currIndex = index

    // change事件
    this.fire('change', index)
}

this.play = function() {
    var self = this
    this.timer = setInterval(function() {
        // 递增顺序播放
        var index = self.currIndex + 1
        // 到达最后一个tab后，从第一个开始
        if (index === self.length) {
            index = 0
        }
        self.change(index)
    }, this.interval)
}

this.stop = function() {
    clearInterval(this.timer)
}


})

Z.declareUI('Suggest', function() {

function create(tag, cls) {
    var el = document.createElement(tag)
    if (cls) {
        el.className = cls
    }
    return Z(el)
}

this.init = function(input, option) {
    this.input = Z(input)
    this.ulCls = option.ulCls || ''
    this.liCls = option.liCls || 'suggest-li'
    this.currCls = option.currCls || 'curr'
    this.url = option.url || ''
    this.data = option.data || []
    this.processData = option.processData || function(data) {return data}
    this.processLi = option.processLi || function(v1, v2) { return v1 }
    this.processVal = option.processVal || function(v1, v2) { return v1 }
    this.currLi = null

    var posi = this.input.offset()
    this.div = create('div', 'suggest-div').hide()
    this.div.css({
        position: 'absolute',
        top: posi.top + this.input[0].offsetHeight - 1,
        left: posi.left,
        width: this.input[0].offsetWidth - 2
    })
    this.ul = create('ul', option.ulCls)
    this.div.append(this.ul)
    Z(document.body).append(this.div)

    this.events()

    this.fire('init')
}

this.events = function() {
    this.input.on('keyup', {
        context: this, 
        handler: function(ev) {
            if (this.input.value === '') {
                this.hide()
            } else {
                this.onKeyup(ev)
            }
        }
    }).on('blur', {
        context: this, 
        handler: function() {
            this.hide()
        }
    })

    var self = this
    var currCls = self.currCls
    this.ul.delegate('li', 'mousedown', function() {
        var li = Z(this)
        self.input.val( li.attr('data-val') )
    }).delegate('li', 'mouseover', function() {
        var li = Z(this)
        li.addClass(currCls)
        self.currLi = li
    }).delegate('li', 'mouseout', function() {
        var li = Z(this)
        li.removeClass(currCls)
    })
}

this.hide = function() {
    this.div.hide()
    this.visible = false
    this.fire('hide')
}

this.show = function() {
    this.div.show()
    this.visible = true
    this.fire('show')
}

this.render = function() {
    var iVal = this.input.val()
    if (iVal === '') {
        this.hide()
        return
    }
    this.ul.empty()
    Z.each(this.data, function(it, i) {
        var li = create('li', this.liCls)
        var fVal = this.processVal(it, iVal)
        li.attr('data-val', fVal)
        li.html( this.processLi(it, iVal) )
        this.ul.append(li)
    }, this)
    this.visible = true
    this.show()
    this.fire('render')
}

this.specKeys = function(keyCode) {
    var ul = this.ul
    var lis = ul.find('li')
    var input = this.input
    var currLi = this.currLi
    var liCls = this.liCls
    var currCls = this.currCls

    switch (keyCode) {
        case 13: // Enter
            if (currLi) {
                input.val( currLi.attr('data-val') )
                this.hide()
            }
            return
        case 38: // 方向键上
            if (currLi == null) {
                this.currLi = lis.last()
                this.currLi.addClass(currCls)
                input.val( this.currLi.attr('data-val') )
            } else {
                if (this.currLi.prev().length) {
                    this.currLi.removeClass(currCls)
                    this.currLi = this.currLi.prev()
                    this.currLi.addClass(currCls)
                    input.val( this.currLi.attr('data-val') )
                } else {
                    this.currLi.removeClass(currCls)
                    this.currLi = null
                    input[0].focus()
                    input.val(this.finalValue)
                }
            }
            return
        case 40: // 方向键下
            if (currLi == null) {
                this.currLi = lis.first()
                this.currLi.addClass(currCls)
                input.val( this.currLi.attr('data-val') )
            } else {
                if (this.currLi.next().length) {
                    this.currLi.removeClass(currCls)
                    this.currLi = this.currLi.next()
                    this.currLi.addClass(currCls)
                    input.val( this.currLi.attr('data-val') )
                } else {
                    this.currLi.removeClass(currCls)
                    this.currLi = null
                    input[0].focus()
                    input.val(this.finalValue)
                }
            }
            return
        case 27: // ESC键
            this.hide();
            input.val(this.finalValue)
            return
    }
}

this.onKeyup = function(ev) {
    var self = this
    var input = this.input
    var keyCode = ev.keyCode
    if ( (keyCode === 13 || keyCode === 27 || keyCode ===38 || keyCode === 40) && this.visible) {
        this.specKeys(keyCode)
    } else {
        this.lis = []
        var val = input.val()
        if (this.finalValue !== val) {
            if (this.url) {
                Z.get(this.url, function(data) {
                    self.data = self.processData(data)
                    self.render()
                })
            } else {
                this.render()    
            }
            this.finalValue = val
        }
    }
}


})


Z.declareUI('Calendar', function() {

var reDate = /^\d{4}\-\d{1,2}\-\d{1,2}$/
var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// 是否是闰年
function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}

/*
 * 根据年月计算天数
 */
function calculateDays(year, month) {
    var days = months[month]
    // 2月比较特殊，非闰年28天，闰年29天，如2008年2月为29天
    if ( 1 == month && isLeapYear(year) ) {
        days = 29
    }
    return days
}

function format(date, hasDay) {
    var arr, m, d, day

    if (Z.isString(date)) {
        arr = date.split('-')
        date = new Date(arr[0], arr[1]-1, arr[2])
    }

    var mm = date.getMonth()
    var dd = date.getDate()
    if (mm < 9) {
        m = '0' + (mm + 1)
    } else {
        m = mm + 1
    }
    if (dd < 10) {
        d = '0' + dd
    } else {
        d = dd
    }

    var str = date.getFullYear() + '-' + m + '-' + d
    if (hasDay) {
        day = week[date.getDay()]
        str += ' ' + day
    }

    return str
}

this.init = function(input, option) {
    option = option || {}
    this.x = option.x || 0
    this.y = option.y || 0
    this.hasDay = option.hasDay
    this.startDate  = option.startDate
    this.endDate    = option.endDate
    this.chosenDate = option.chosenDate

    this.dateCls = option.dateCls || 'day'
    this.chosenCls = option.chosenCls || 'chosen'
    this.dateOverCls = option.dateOverCls || 'over'
    this.prevHook  = option.prevHook || '.prev'
    this.nextHook  = option.nextHook || '.next'
    this.closeHook = option.closeHook || '.close'
    this.todayHook = option.todayHook || '.today'
    this.yearHook  = option.yearHook || '[data-cal=year]'
    this.monthHook = option.monthHook || '[data-cal=month]'

    this.currDate = new Date()
    this.input = Z(input)

    var self = this
    this.input.click(function(ev) {
        var input = Z(this)
        // 已经初始化过直接返回
        if ( input.data('hasDatepicker') ) return
        self.render()
    })
}

this.setPosi = function() {
    var posi = this.input.offset()
    var outerHeight = this.input.outerHeight()
    var left = (this.x ? this.x-0 : 0) + posi.left
    var top  = (this.y ? this.y-0 : 0) + posi.top + outerHeight
    this.div.css({
        position: 'absolute',
        left: left,
        top: top
    })
}

this.onBodyClick = function(ev) {
    var target = Z(ev.target)
    var datePicker = target.closest('.o-datepicker')
    if (!datePicker.length && target[0] != this.input[0]) {
        this.remove()
    }
}

this.template = function() {
    var div = Z.dom('<div class="o-datepicker ui-calendar"></div>')
    div = Z(div)
    var templ = '<table cellpadding="0" cellpadding="0" class="ui-calendar-table">' + 
                    '<thead>' +
                        '<tr><th class="prev"><i></i></th><th colspan="5" class="switch"><span data-cal="year"></span>年<span data-cal="month"></span>月</th><th class="next"><i></i></th></tr>' +
                        '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>' +
                    '</thead>' +
                    '<tbody></tbody>' +
                    '<tfoot></tfoot>' +
                 '</table>'

    div.append(templ)
    table = div.find('table')
    table.find('tfoot').append('<tr><td colspan="2"><span class="today">今天</span></td><td></td><td></td><td></td><td colspan="2"><span class="close">关闭</span></td></tr>')
    
    var tr = '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
    var arr = []
    for (var i = 0; i < 6; i++) {
        arr[i] = tr
    }
    table.find('tbody').append(arr.join(''))
    
    return div.append(table)
}

this.render = function() {
    var input = this.input
    var chosenDate = this.chosenDate

    var val = input.val()
    if ( val && reDate.test(val) ) {
        val = val.split('-')
        this.currDate = new Date(val[0], val[1] - 1, val[2])
    } else {
        if ( Z.isDate(chosenDate) ) {
            this.currDate = chosenDate
        } else {
            if ( reDate.test(chosenDate) ) {
                var arr = chosenDate.split('-')
                this.currDate = new Date(arr[0], arr[1]-1, arr[2])
            }
        }
    }
    currDate = this.currDate

    this.div = this.template()
    var table = this.table = this.div.find('table')
    var yearSpan  = table.find(this.yearHook)
    var monthSpan = table.find(this.monthHook)
    var cMonth = currDate.getMonth()
    var cYear  = currDate.getFullYear()
    if (cMonth == 11) {
        yearSpan.text(cYear)
        monthSpan.text(cMonth + 1)
    } else {
        yearSpan.text(cYear)
        monthSpan.text(cMonth + 1)
    }

    // 回填 '天'
    this.fillDate()
    // 添加事件
    this.events()
    // 标记input已经弹出了日期组件
    input.data('hasDatepicker', true)
    // 设置日期组件的位置
    this.setPosi()
    // 添加到body
    Z('body').append(this.div)
}

this.fillDate = function() {
    var currDate  = this.currDate
    var startDate = this.startDate
    var endDate   = this.endDate

    // fill td
    var table  = this.table
    var tds    = table.find('tbody').find('td').empty().removeClass()
    var cYear  = table.find(this.yearHook).text() - 0
    var cMonth = table.find(this.monthHook).text() - 1
    var qDate  = new Date(cYear, cMonth, 1)
    var rDate  = new Date()
    var aDay = qDate.getDay()
    var days = calculateDays(cYear, cMonth)

    // 填充数字，并高亮当前天
    for (var i = 0; i < days; i++) {
        var td = tds.eq(i + aDay)
        td.text(i + 1)
        // 年月日都一样就高亮显示
        if (i + 1 == currDate.getDate() && cMonth == currDate.getMonth() && cYear == currDate.getFullYear()) {
            td.addClass(this.chosenCls)
        }
    }

    var start = 0
    var end   = days
    var hasDate = true
    if ( startDate && reDate.test(startDate) ) {
        var arr   = startDate.split('-')
        var year  = arr[0] - 0
        var month = arr[1] - 1
        var day   = arr[2] - 1
        if (cYear == year && cMonth == month) {
            start = day
        }
        if (cYear < year || cMonth < month && cYear <= year) {
            hasDate = false
        }
    }

    if ( endDate && reDate.test(endDate) ) {
        var arr   = endDate.split('-')
        var year  = arr[0] - 0
        var month = arr[1] - 1
        var day   = arr[2] - 1
        if (cYear == year && cMonth == month) {
            end = day
        }
        if (cYear > year || cMonth > month && cYear == year) {
            hasDate = false
        }
    }

    if (hasDate) {
        for (var u = start; u < end; u++) {
            var td = tds.eq(u + aDay)
            td.addClass('day')
        }
    }

}

this.events = function() {
    var self = this
    var dateCls = '.' + this.dateCls
    var dateOverCls = this.dateOverCls

    this.div.delegate(dateCls, 'click', function(ev) {
        var td    = Z(this)
        var table = td.closest('table')
        var year  = table.find(self.yearHook).text()
        var month = table.find(self.monthHook).text() - 1
        var date  = td.text()
        self.currDate = new Date(year, month, date)
        self.remove()
        self.fire('select')

    }).delegate(dateCls, 'mouseover', function() {
        Z(this).addClass(dateOverCls)

    }).delegate(dateCls, 'mouseout', function() {
        Z(this).removeClass(dateOverCls)

    }).delegate(this.todayHook, 'click', function() {
        self.currDate = new Date()
        self.remove()
        self.fire('select')

    }).delegate(this.closeHook, 'click', function() {
        self.remove()
        self.fire('close')

    }).delegate(this.prevHook, 'click', function() {
        var span = Z(this)
        if (span.hasClass('disabled')) return false
        self.prevMonth()

    }).delegate(this.nextHook, 'click', function() {
        var span = Z(this)
        if (span.hasClass('disabled')) return false
        self.nextMonth()
           
    })

    Z(window).on('resize', {
        context: this,
        handler: this.setPosi
    })

    Z(document).on('click', {
        context: this,
        handler: this.onBodyClick
    })
}

this.nextMonth = function() {
    var year  = this.table.find(this.yearHook)
    var month = this.table.find(this.monthHook)
    var y  = year.text() - 0
    var m  = month.text() - 1

    switch (m) {
        case 11:
            year.text(y+1)
            month.text(1)
            break
        case 0:
            year.text(y)
            month.text(2)
            break
        default:
            m += 1
            year.text(y)
            month.text(m + 1)
            break
    }

    this.fillDate()
}

this.prevMonth = function() {
    var year  = this.table.find(this.yearHook)
    var month = this.table.find(this.monthHook)
    var y  = year.text() - 0
    var m  = month.text() - 1

    if (m == 0) {
        year.text(y-1)
        month.text(12)
    } else {
        year.text(y)
        month.text(m)
    }

    this.fillDate()
}

this.remove = function() {
    this.div.remove()
    this.input.val( format(this.currDate, this.hasDay) )
    this.input.data('hasDatepicker', false)
    Z(window).off('resize', this.setPosi)
    Z(document).off('click', this.onBodyClick)
}

})


Z.declareUI('CalendarTwo', function() {
//
var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
var reDate = /^\d{4}\-\d{1,2}\-\d{1,2}$/

function format(date, hasDay) {
    var arr, m, d, day

    if (Z.isString(date)) {
        arr = date.split('-')
        date = new Date(arr[0], arr[1]-1, arr[2])
    }

    var mm = date.getMonth()
    var dd = date.getDate()
    if (mm < 9) {
        m = '0' + (mm + 1)
    } else {
        m = mm + 1
    }
    if (dd < 10) {
        d = '0' + dd
    } else {
        d = dd
    }

    var str = date.getFullYear() + '-' + m + '-' + d
    if (hasDay) {
        day = week[date.getDay()]
        str += ' ' + day
    }

    return str
}

function template() {
    var templ = '<table cellpadding="0" cellpadding="0" class="datepicker">' + 
                    '<thead>' +
                        '<tr class="controls"><th colspan="7"><span class="prevMonth"><s></s></span><span class="currDate"><span class="currYs"></span>年<span class="currMo"></span>月</span></th></tr>' +
                        '<tr class="days"><th class="org sun">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="org sat">六</th></tr>' +
                    '</thead>' +
                    '<tbody></tbody>' +
                    '<tfoot><tr><td colspan="7"></td></tr></tfoot>' +
                 '</table>'

    var table1 = Z.dom(templ)[0]
    table1 = Z(table1)
    table1.find('tfoot').find('td').append('<span class="today">今天</span>')

    var table2 = Z.dom(templ)[0]
    table2 = Z(table2)
    table2.find('.prevMonth').replaceClass('prevMonth', 'nextMonth')
    table2.find('tfoot').find('td').append('<span class="close">关闭</span>')
    
    var tr = '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
    var arr = []
    for (var i = 0; i < 6; i++) {
        arr[i] = tr
    }
    table1.find('tbody').append(arr.join(''))
    table2.find('tbody').append(arr.join(''))


    var div = Z.dom('<div class="o-datepicker"></div>')
    div = Z(div)
    return div.append(table1).append(table2)
}

this.init = function(input, option) {
    option = option || {}
    this.x = option.x || 0
    this.y = option.y || 0
    this.hasDay = option.hasDay
    this.startDate  = option.startDate
    this.endDate    = option.endDate
    this.chosenDate = option.chosenDate

    this.currDate = new Date()
    this.input = Z(input)

    var self = this
    this.input.click(function(ev) {
        var input = Z(this)
        // 已经初始化过直接返回
        if ( input.data('hasDatepicker') ) return
        self.render()
    })

}

this.setPosi = function() {
    var posi = this.input.offset()
    var outerHeight = this.input.outerHeight()
    var left = (this.x ? this.x-0 : 0) + posi.left
    var top  = (this.y ? this.y-0 : 0) + posi.top + outerHeight
    this.div.css({
        position: 'absolute',
        left: left,
        top: top
    })
}

this.onBodyClick = function(ev) {
    var target = Z(ev.target)
    if (!target.closest('.datepicker').length && target[0] != this.input[0]) {
        this.remove()
    }
}

this.remove = function() {
    this.div.remove()
    this.input.val( format(this.currDate, this.hasDay) )
    this.input.data('hasDatepicker', false)
    Z(window).off('resize', this.setPosi)
    Z(document).off('click', this.onBodyClick)
}

this.events = function() {
    var self = this
    this.div.delegate('.date', 'click', function(ev) {
        var td    = Z(this)
        var table = td.closest('table')
        var year  = table.find('.currYs').text()
        var month = table.find('.currMo').text() - 1
        var date  = td.text()
        self.currDate = new Date(year, month, date)
        self.remove()
        self.fire('select')

    }).delegate('.date', 'mouseover', function() {
        Z(this).addClass('over')

    }).delegate('.date', 'mouseout', function() {
        Z(this).removeClass('over')  

    }).delegate('.today', 'click', function() {
        self.currDate = new Date()
        self.remove()
        self.fire('select')  

    }).delegate('.close', 'click', function() {
        self.remove()
        self.fire('close')

    }).delegate('.prevMonth', 'click', function() {
        var span = Z(this)
        if (span.hasClass('disabled')) return false
        self.prevMonth()

    }).delegate('.nextMonth', 'click', function() {
        var span = Z(this)
        if (span.hasClass('disabled')) return false
        self.nextMonth()     
           
    })

    Z(window).on('resize', {
        context: this,
        handler: this.setPosi
    })

    Z(document).on('click', {
        context: this,
        handler: this.onBodyClick
    })
}

this.render = function() {
    var input = this.input
    var chosenDate = this.chosenDate

    var val = input.val()
    if ( val && reDate.test(val) ) {
        val = val.split('-')
        this.currDate = new Date(val[0], val[1] - 1, val[2])
    } else {
        if ( Z.isDate(chosenDate) ) {
            this.currDate = chosenDate
        } else {
            if ( reDate.test(chosenDate) ) {
                var arr = chosenDate.split('-')
                this.currDate = new Date(arr[0], arr[1]-1, arr[2])
            }
        }
    }
    var currDate = this.currDate

    this.div = template()

    var tables = this.div.find('table')
    var table1 = this.table1 = tables.first()
    var table2 = this.table2 = tables.last()
    var cYear  = currDate.getFullYear()
    var cMonth = currDate.getMonth()
    if (cMonth == 11) {
        table1.find('.currYs').text(cYear)
        table1.find('.currMo').text(cMonth + 1)
        table2.find('.currYs').text(cYear + 1)
        table2.find('.currMo').text(1)
    } else {
        table1.find('.currYs').text(cYear)
        table1.find('.currMo').text(cMonth + 1)
        table2.find('.currYs').text(cYear)
        table2.find('.currMo').text(cMonth + 2)
    }

    // 回填 '天'
    this.fillDate()
    // 添加事件
    this.events()
    // 标记input已经弹出了日期组件
    input.data('hasDatepicker', true)
    // 设置日期组件的位置
    this.setPosi()
    // 添加到body
    Z('body').append(this.div)
}

this.nextMonth = function() {
    var year1  = this.table1.find('.currYs')
    var year2  = this.table2.find('.currYs')
    var month1 = this.table1.find('.currMo')
    var month2 = this.table2.find('.currMo')
    var y1  = year1.text() - 0
    var y2  = year2.text() - 0
    var m1 = month1.text() - 1
    var m2 = month2.text() - 1

    switch (m2) {
        case 11:
            year1.text(y1)
            month1.text(12)
            year2.text(y1 + 1)
            month2.text(1)
            break
        case 0:
            year1.text(y2)
            month1.text(1)
            year2.text(y2)
            month2.text(2)
            break
        default:
            m1 += 1
            month1.text(m1 + 1)
            month2.text(m1 + 2)
            year1.text(y1)
            year2.text(y1)
            break
    }

    this.fillDate()
}

this.prevMonth = function() {
    var year1  = this.table1.find('.currYs')
    var year2  = this.table2.find('.currYs')
    var month1 = this.table1.find('.currMo')
    var month2 = this.table2.find('.currMo')
    var y1  = year1.text() - 0
    var y2  = year2.text() - 0
    var m1 = month1.text() - 1
    var m2 = month2.text() - 1

    switch (m1) {
        case 11:
            year1.text(y1)
            month1.text(11)
            year2.text(y1)
            month2.text(12)
            break
        case 0:
            year1.text(y1 - 1)
            month1.text(12)
            year2.text(y1)
            month2.text(1)
            break
        default:
            year1.text(y1)
            year2.text(y1)
            m1 -= 1
            month1.text(m1 + 1)
            month2.text(m1 + 2)
            break
    }

    this.fillDate()
}

this.fillDate = function() {
    var currDate  = this.currDate
    var startDate = this.startDate
    var endDate   = this.endDate

    this.div.find('table').each(function(el, i) {
        var table  = Z(el)
        var tds    = table.find('tbody').find('td').empty().removeClass()
        var cYear  = table.find('.currYs').text() - 0
        var cMonth = table.find('.currMo').text() - 1
        var qDate  = new Date(cYear, cMonth, 1)
        var rDate  = new Date()
        var aDay = qDate.getDay()
        var start = 0
        var hasDate = true
        var days = months[cMonth]
        
        // 2月比较特殊，非闰年28天，闰年29天，如2008年2月为29天
        if ( 1 == cMonth && ((cYear % 4 == 0 && cYear % 100 != 0) || cYear % 400 == 0) ) {
            days = 29
        }

        // 填充数字，并高亮当前天
        for (var i = 0; i < days; i++) {
            var td = tds.eq(i + aDay)
            td.text(i + 1)
            // 年月日都一样就高亮显示
            if (i + 1 == currDate.getDate() && cMonth == currDate.getMonth() && cYear == currDate.getFullYear()) {
                td.addClass('chosen')
            }
        }

        if ( startDate && reDate.test(startDate) ) {
            var arr   = startDate.split('-')
            var year  = arr[0] - 0
            var month = arr[1] - 1
            var day   = arr[2] - 1
            if (cMonth == month && cYear == year) {
                start = day
            }
            if (cYear < year || cMonth < month && cYear <= year) {
                hasDate = false
            }                
        }

        if ( endDate && reDate.test(endDate) ) {
            var arr   = endDate.split('-')
            var year  = arr[0] - 0
            var month = arr[1] - 1
            if (cYear > year || cMonth > month && cYear == year) {
                hasDate = false
            }
        }

        if (hasDate) {
            for (var u = start; u < days; u++) {
                var td = tds.eq(u + aDay)
                td.addClass('date')
            }
        }

    })
}


})


Z.declareUI('Dialog', function() {

function template() {
    var dlg = '<div class="thickbox">' +
                '<div class="thickwrap">' +
                  '<div class="thicktitle"><span></span></div>' +
                  '<div class="thickcon"></div>' +
                  '<a class="thickclose" href="javascript:;">×</a>' +
                '</div>' +
              '</div>'
    var mask = '<div class="thickdiv"></div>'
    var iframe = '<iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" class="thickframe"></iframe>'

    dlg = Z( Z.dom(dlg) )
    mask = Z( Z.dom(mask) )
    iframe = Z( Z.dom(iframe) )
    return [dlg, mask, iframe]
}

this.init = function(option) {
    this.width = option.width || 200
    this.height = option.height || 100
    this.autoReposi = option.autoReposi || false
    this.dragdrop = option.dragdrop || true

    this.title = option.title || '提示'
    this.content = function() {
        if (option.content) {
            if (Z.isFunction(option.content)) {
                return option.content()
            } else {
                return option.content
            }
        } else {
            return ''
        }
    }()

    var arr = template()
    this.div = arr[0]
    this.mask = arr[1]
    this.iframe = arr[2]

    Z('body').append(arr[0])
    Z('body').append(arr[1])
    Z('body').append(arr[2])

    this.setRect(this.width, this.height)
    this.setTitle(this.title)
    this.setContent(this.content)
    this.setPosi()
    this.events()

    if (this.dragdrop) {
        Z.ui.Dragdrop(this.div[0], {inwin: true, handle: '.thicktitle'})
    }
    this.fire('init')
}

this.setTitle = function(title) {
    this.div.find('.thicktitle').html(title)
}

this.setContent = function(content) {
    this.div.find('.thickcon').html(content)
}

this.setRect = function(width, height) {
    this.div.find('.thickwrap').css({
        width: width + 'px',
        height: height + 'px'
    })
}

this.setPosi = function() {
    var obj = Z.winSize()
    var top = (obj.height-50)/2 - this.div[0].clientHeight/2
    var left = obj.width/2 - this.div[0].clientWidth/2
    if (Z.ie6) {
        top += document.documentElement.scrollTop
    }
    this.div.css({
        top: top,
        left: left
    })
}

this.events = function() {
    var self = this
    this.div.delegate('.thickclose', 'click', function() {
        self.remove()
    })

    if (this.autoReposi) {
        Z(window).on('resize', {
            context: this,
            handler: this.setPosi
        })
    }

    if (Z.ie6) {
        this.div.css('position', 'absolute')
        Z(window).on('scroll', {
            context: this,
            handler: this.setPosi
        })
    } else {
        this.div.css('position', 'fixed')
    }
}

this.remove = this.close = function() {
    this.div.remove()
    this.mask.remove()
    this.iframe.remove()
    Z(window).off('resize', this.setPosi)
    Z(window).off('scroll', this.setPosi)
    this.fire('close')
}


})

Z.declareUI('Scroll', function() {

function template() {

}

this.init = function(div, option) {
    this.step = option.step
    this.width = option.width
    this.height = option.height
    this.evtType = option.evtType || 'click'
    this.visibleNum = option.visibleNum || 1

    this.autoPlay = option.autoPlay || true
    this.autoPlayTime = option.autoPlayTime || '2000'

    var btnNext = option.btnNext || '.btnNext'
    var btnPrev = option.btnPrev || '.btnPrev'
    this.btnNext = Z.isString(btnNext) ? Z(btnNext) : btnNext
    this.btnPrev = Z.isString(btnPrev) ? Z(btnPrev) : btnPrev

    this.div = Z.isString(div) ? Z(div) : div
    this.ul = this.div.find('ul')
    this.lis = this.div.find('li')
    this.total = Math.ceil((this.lis.length - this.visibleNum) / this.step) + 1

    this.events()

    if (this.autoPlay) {
        this.play()
    }

}

this.animate = function() {
    
}

this.play = function() {
    var div = this.div
    var ul = div.find('ul')
    var liWidth = ul.find('li').innerWidth()
    var length = this.visibleNum * liWidth
    
    clearInterval(this.timer)
    this.timer = setInterval(function() {
        var left = parseInt(ul.css('left'), 10)
        // ul.css({
        //     // left: -length+left
        // })
        animate(ul[0], {left: -length+left}, 0.4, 'lin')
    }, this.autoPlayTime)
}

this.events = function() {

}

})
103.245.222.133