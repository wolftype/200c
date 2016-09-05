<script src="http://d3js.org/d3.v4.min.js" charset="utf-8"></script>

<style type = "text/css">

</style>

<script>

	var w = 300;
	var h = 300;
	var scale = 1;

	var svg = d3.select("body").append("svg:svg")
		.attr("width", w)
		.attr("height", h);

	svg.append("rect")
	    .attr("width","100%")
	    .attr("height","100%")
	    .attr("fill", "rgba(255,0,0,.2)")

</script>