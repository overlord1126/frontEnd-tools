
var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //*正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){//*
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}
//swiper(obj)
//	obj{
//		el:父级
//		dir: 方向
//	}
function swiper(paraObj){
	var el = paraObj.el,
		scroll = el.children[0],
		dir = paraObj.dir || "y",
		isShowBar = paraObj.isShowBar || false,
		downFn = paraObj.downFn,
		moveFn = paraObj.moveFn,
		upFn = paraObj.upFn,
		callIn = paraObj.callIn,
		endFn = paraObj.endFn,
		startPos = {},//手指按下的初始位置
		startStatus = {},//手指按下的元素初始状态
		F = paraObj.F||0.3,//拉力系数
		transformDir = {
			x: "translateX",
			y: "translateY"
		},
		isFirst = true,
		isDir = {
			x: false,
			y: false
		},
		lastPoint = {},
		lastTime = 0,
		minTranslate = {};
	var speed = 0;
	css( scroll,"translateX",0 );
	css( scroll,"translateY",0 );
	
//	初始化的时候,根据isShowBar的状态插入滚动条
	if( isShowBar ){
		var bar = document.createElement("div");
		bar.style.cssText = "position:absolute;background-color:#000;opacity: 0;border-radius: 3px;transition: .3s opacity;";
		if( dir === "x" ){//横向滚动
			bar.style.cssText += "left:0;bottom:0;height: 6px;";
		}else{
			bar.style.cssText += "right:0;top:0;width: 6px;";
		}
		setWH();
		css( bar,transformDir[dir],0 );
		el.appendChild( bar );
		
	}
	function setWH(){
		if( dir === "x" ){//横向
			bar.scale = el.clientWidth / scroll.offsetWidth;
			bar.style.width = el.clientWidth * bar.scale + "px";
		}else{
			bar.scale = el.clientHeight / scroll.offsetHeight;
			bar.style.height = el.clientHeight * bar.scale + "px";
		}
	}
	
	
	el.addEventListener("touchstart",function(e){
		
		//透明度 1 滚动条
		var pos = e.changedTouches[0];
		startPos = {
			x: pos.pageX,
			y: pos.pageY
		};
		startStatus = {
			x: css( scroll,"translateX" ),
			y: css( scroll,"translateY" )
		};
		isFirst = true;
		isDir = {
			x: false,
			y: false
		};
		lastPoint = {
			x: pos.pageX,
			y: pos.pageY
		};
		cancelAnimationFrame( scroll.timer );
		lastTime = new Date().getTime();
		speed = 0;
		minTranslate = {
			x: el.clientWidth - scroll.offsetWidth,
			y: el.clientHeight - scroll.offsetHeight
		}
		
		if( isShowBar ){
			css( bar,"opacity",1 );
			setWH();
			css( bar,transformDir[dir], -css(scroll,transformDir[dir])*bar.scale);
		}
		
		typeof downFn === "function" && downFn();
	})
	el.addEventListener("touchmove",function(e){
		var pos = e.changedTouches[0];
		var dis = {
			x: pos.pageX - startPos.x,
			y: pos.pageY - startPos.y
		}
		var target = {
			x: startStatus.x + dis.x,
			y: startStatus.y + dis.y
		}
		
		var disDiff = {//每次手指移动的距离差
			x: pos.pageX - lastPoint.x,
			y: pos.pageY - lastPoint.y
		}
		var now = new Date().getTime();
		var timeDiff = now - lastTime;//每次手指移动的时间差
//		console.log( disDiff[dir],timeDiff );
		speed = disDiff[dir]/timeDiff;
		
		lastPoint = {
			x: pos.pageX,
			y: pos.pageY
		}
		lastTime = now;
		if( isFirst ){
			if( Math.abs( dis.x ) - Math.abs( dis.y ) > 5 ){
				isDir.x = true;
				isFirst = false;
			}else if( Math.abs( dis.y ) - Math.abs( dis.x ) > 5 ){
				isDir.y = true;
				isFirst = false;
			}
		}
		
		if( target[dir] > 0 ){
			target[dir] *= F; 
		}else if( target[dir] < minTranslate[dir] ){
			var excess = target[dir]-minTranslate[dir];//超出部分
			target[dir] = excess*F+minTranslate[dir];
		}
		
		if( isShowBar ){
			css( bar,transformDir[dir], -css(scroll,transformDir[dir])*bar.scale);
		}
		isDir[dir] && css( scroll,transformDir[dir],target[dir] );
		isDir[dir] && typeof moveFn === "function" && moveFn();
	})
	el.addEventListener("touchend",function(e){
		
//		speed = 50;
//		console.log( speed );
		var nowStatus = css( scroll,transformDir[dir] )
		var moveTarget = nowStatus + speed*30 //由惯性运动到的目标点
		var type = "easeOutStrong";
//		console.log( nowStatus );
		if( moveTarget > 0 ){
			moveTarget = 0;
			type = "backOut";
		}else if( moveTarget < minTranslate[dir] ){
			moveTarget = minTranslate[dir];
			type = "backOut";
		}
		var time = parseInt(Math.abs( moveTarget - nowStatus )/5);
//		console.log( time,speed );
		
//		由 move 完成惯性运动
		((time === 0)&& bar)  && css( bar,"opacity",0 );
		(time !==0) &&  move( {
			el: scroll,
			target: {
				[transformDir[dir]]: moveTarget
			},
			time: time,
			type: type,
			callIn: function(){//惯性运动结束的时候,执行结束的回调,让滚动条消失
				if( isShowBar ){
					css( bar,transformDir[dir], -css(scroll,transformDir[dir])*bar.scale);
				}
				typeof callIn === "function" && callIn();
			},
//			callBack: endFn
			callBack: function(){
				if( isShowBar ){
					css( bar,"opacity",0);
				}
				typeof endFn === "function" && endFn();
//				endFn();
			}
		} )
		typeof upFn === "function" && upFn();
	})
}


//paraObj(obj) 
//	obj:{
//		el: ,
//		target: {
//			width : 300,
//			translateX : 200,
//			...
//		},
//		time: 60 次数,
//		type: 运动类型,
//		callBack: 完成后回调,
//		callIn: 进行时回调
//	}


function move( paraObj ){
	var el = paraObj.el,
		target = paraObj.target,
		d = paraObj.time,
		callBack = paraObj.callBack,
		callIn = paraObj.callIn,
		type = paraObj.type || "linear",
		t = 0,
		b = {},
		c = {};
	el.timer = 0;
	var flag = 0;
	for( var s in target ){
		b[s] = css( el,s );
		c[s] = target[s] - b[s];
		flag = Math.max( Math.abs( c[s] ),flag );
	}
//	console.log( b,c );
	if( flag === 0 ){
		typeof callBack === "function" && callBack();
		return ;
	}
	
	cancelAnimationFrame( el.timer );
	el.timer = requestAnimationFrame( go );
	function go(){
		t++;
		if( t > d ){
			typeof callBack === "function" && callBack();
		}else{
			for( var s in c ){
				var val = Tween[type](t,b[s],c[s],d);
				css( el,s,val );
			}
			el.timer = requestAnimationFrame( go );
			typeof callIn === "function" && callIn();
		}
	}
}

if( !window.requestAnimationFrame ){
	window.requestAnimationFrame = function( fn ){
		return setTimeout( fn,16.7 );
	}
}

if( !window.cancelAnimationFrame ){
	window.cancelAnimationFrame = function(id){
		clearTimeout( id );
	}
}

function css( obj,attr,val ) {
	var TRANSFORMARR = [
		"rotateX",
		"rotateY",
		"rotateZ",
		"skewX",
		"skewY",
		"scaleX",
		"scaleY",
		"translateX",
		"translateY",
		"translateZ"
	];
	
	for (var i = 0; i < TRANSFORMARR.length; i++) {
		if( attr === TRANSFORMARR[i] ){
			return transFormFn ( obj,attr,val );
		}
	}
	if( typeof val === "undefined" ){//获取
		return parseFloat(getComputedStyle( obj )[attr]);
	}else{//设置
		if( attr === "opacity" ){
			obj.style.opacity = val;
		}else{
			obj.style[attr] = val+"px";
		}
	}
}

function transFormFn ( obj,attr,val ) {
	if( !obj.tf ){
		obj.tf = {};
	}
	if( typeof val === "undefined" ){//获取
		return obj.tf[attr];
	}else{//设置
		obj.tf[attr] = val;
		var str = "";
		for( var s in obj.tf ){
			switch ( s ){
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					str += s+ "("+ obj.tf[s] +"deg) ";
					break;
				case "scaleX":
				case "scaleY":
					str += s+ "("+ obj.tf[s] +") ";
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
					str += s+ "("+ obj.tf[s] +"px) ";
					break;
			}
		}
		obj.style.transform = str;
	}
	
}