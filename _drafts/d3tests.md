<script src="http://d3js.org/d3.v4.min.js" charset="utf-8"></script>
<script type = "text/javascript" src = "../../versor.js/versor.js"></script>
<script type = "text/javascript" src = "../../versor.js/space/C2.js"></script>

<style type = "text/css">

svg {
	background-color: rgba(1, 0, 0, 0.2);
}

circle {
	stroke: #000;
	fill-opacity: .001;
	stroke-opacity: .5;
	stroke-width: 0.5;
}

.point {
	stroke: #000;
	stroke-opacity: .5;
	stroke-width: 0.5;
	fill-opacity: 1;
	fill: #17f;
}

</style>

<script>

	var w = 300;
	var h = 300;
	var scale = 1;



	var svg = d3.select("body").append("svg:svg")
		.attr("width", w)
		.attr("height", h);

	var g = svg.append("svg:g")
			.attr("transform", "translate("+(w/2)+", "+(h/2)+") scale("+scale+", "+(-scale)+")");

	function canvasToWorld(p) {
		return [
			(p[0]-w/2)/scale,
			(p[1]-h/2)/-scale,
		];
	}

	function circleRadius(c) {
		return Math.sqrt(Math.abs(C2.Ro.size(c, true)));
	}

	function circleX(c) {
		return C2.Ro.cen(c)[0];
	}

	function circleY(c) {
		return C2.Ro.cen(c)[1];
	}

	// draw a C2 circle in an SVG using D3
	function updateCircles(sel) {
		sel.datum( function(d){ 
			d.val = C2.Ro.circle(d.x, d.y, d.r); 
			return d; 
		} )
		return sel.attr("r", function(d){ return d.r; })
			.attr("cx", function(d){ return d.x; } )//function(d){ return d.x; })
			.attr("cy", function(d){ return d.y; } )//function(d){ return d.y; })
	}

	function updateCircle(d) {
		console.log("update")
		d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d3.eventy);
	}

	var ori = C2.Ro.circle(0,0,3);
	var ca = C2.Ro.circle(10,0,10);
	var cb = C2.Ro.circle(0,20,20);

//	ca.x = circleX(ca)
//	ca.y = circleY(ca)
//	cb.x = circleX(cb)
//	cb.y = circleY(cb)

	var circles = [ 
		{val: ori, x: 0, y: 0},
		{val: ca, r: circleRadius(ca), x: circleX(ca), y: circleY(ca)}, 
		{val: cb, r: circleRadius(cb), x: circleX(cb), y: circleY(cb)} ];
	
	var pair = C2.undual(ca.op(cb));
	var points = C2.Ro.split(pair);

	var drag = d3.drag()
				 .on("start", function(d){ console.log(d3.event.x, d3.event.y)})
				 .on("drag",  function(d){ console.log(d3.event.x, d3.event.y)})//updateCircle)

				 // function(d){ 
				 // 			 console.log(d3.event.x, d3.event.y)
				 // 			 d.x = d3.eventX;
				 // 			 d.y = d3.eventY;
				 // 			 updateCircles(d3.select(this))
				 //  			})


	var sel = g.selectAll(".elements")
		.data(circles)
		.enter().append("svg:circle")
		.attr("class", "elements")
		.call( drag )
	updateCircles(sel)


	var pg = g.selectAll(".pair").data(points)
		.enter().append("svg:circle")
		.attr("class", "point")
		.attr("cx", function(p){ return p[0]})
		.attr("cy", function(p){ return p[1]})
		.attr("r",3)



</script>