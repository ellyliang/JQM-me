$ ->
	$('#J-instro').fullpage
		sectionsColor: ['#fff', '#fff', '#fff']
		anchors: ['page0', 'page1', 'page2', 'page3']
		css3: true
		menu: '#menu'
		scrollingSpeed: 1000

	if navigator.userAgent.match(/IEMobile\/10\.0/) 
	   	msViewportStyle = document.createElement('style')
	    msViewportStyle.appendChild(
	    	document.createTextNode('@-ms-viewport{width:auto!important}'))
	    document.getElementsByTagName('head')[0].appendChild(msViewportStyle)
	
	setTimeout (
		->
	    	document.body.scrollTop = 1
	    	document.body.scrollTop = 0

	  	100
	)
