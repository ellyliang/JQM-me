var carousel = require('../index.js');

//所有的数据
var list = [{
	img: "images/1.png"
},
{
	img: "images/2.png"
},
{
	img: "images/3.png"
},
{
	img: "images/4.png"
},
{
	img: "images/5.png",
},
{
	img: "images/6.png",
},
{	
	img: "images/7.png",
},
{	
	img: "images/8.png",
}
];

new carousel({
	dom: document.getElementById('jCarousel'),
	data: list
});
