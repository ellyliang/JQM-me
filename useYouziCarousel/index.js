var carousel = require('youzi_carousel');

//所有的数据
var list = [{
	img: "http://7xkinp.com1.z0.glb.clouddn.com/1.png"
},
{
	img: "http://7xkinp.com1.z0.glb.clouddn.com/2.png"
},
{
	img: "http://7xkinp.com1.z0.glb.clouddn.com/3.png"
},
{
	img: "http://7xkinp.com1.z0.glb.clouddn.com/4.png"
},
{
	img: "http://7xkinp.com1.z0.glb.clouddn.com/5.png",
},
{
	img: "http://7xkinp.com1.z0.glb.clouddn.com/6.png",
},
{	
	img: "http://7xkinp.com1.z0.glb.clouddn.com/7.png",
},
{	
	img: "http://7xkinp.com1.z0.glb.clouddn.com/8.png",
}
];

new carousel({
	dom: document.getElementById('jCarousel'),
	data: list
});
