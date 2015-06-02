// Code goes here
	// create the module and name it angularApp
	var angularApp = angular.module('angularApp', ['ngRoute']);

	// configure our routes
	angularApp.config(function($routeProvider) {
		$routeProvider

			// route for chart 1 page
			.when('/chart1', {
				templateUrl : 'pages/chart1.html',
				controller  : 'controller1'
			})

				// route for chart 2 page
			.when('/chart2', {
				templateUrl : 'pages/chart2.html',
				controller  : 'controller2'
			})

				// route for chart 3 page
			.when('/chart3', {
				templateUrl : 'pages/chart3.html',
				controller  : 'controller3'
			})
			
					// route for chart 4 page
			.when('/chart4', {
				templateUrl : 'pages/chart4.html',
				controller  : 'controller4'
			})

			.when('/chart5', {
				templateUrl : 'pages/chart5.html',
				controller  : 'controller5'
			})
			
			.otherwise({
			  redirectTo: '/chart1'
			});
	});

//------------------------------------------------------------------------------------


// Chart 1 - Bar Chart
angularApp.controller('controller1', function($scope,$http) {
		// create a message to display in our view
		$scope.message = 'Bar Chart';
		// $http.get('json/bar.json').success (function(data){
		// $scope.barData = data;
		// });
		$scope.barData = [
    {"name": "A", "count": 300},
    {"name": "B", "count": 150},
    {"name": "C", "count": 400},
    {"name": "D", "count": 300},
    {"name": "E", "count": 100},
    {"name": "F", "count": 200},
    {"name": "G", "count": 420},
    {"name": "H", "count": 320},
    {"name": "I", "count": 250},
    {"name": "J", "count": 210},
    {"name": "K", "count": 180}
];
	}).directive( 'dir1', [
  function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },

      link: barchart
    };

    function barchart(scope, element) {
      		 	var margin = {top: 20, right: 20, bottom: 30, left: 45},
				width = 480 - margin.left - margin.right,
				height = 360 - margin.top - margin.bottom;
				var svg = d3.select(element[0])
				.append("svg")
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				 
				var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
				var y = d3.scale.linear().range([height, 0]);
				 
				var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
				 
				var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(10);
				 
				//Render graph based on 'data'
				scope.render = function(data) {
				//Set our scale's domains
				x.domain(data.map(function(d) { return d.name; }));
				y.domain([0, d3.max(data, function(d) { return d.count; })]);
				//Redraw the axes
				svg.selectAll('g.axis').remove();
				//X axis
				svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);
				//Y axis
				svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Count");
				var bars = svg.selectAll(".bar").data(data);
				bars.enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x(d.name); })
				.attr("width", x.rangeBand());
				 
				//Animate bars
				bars
				.transition()
				.duration(1000)
				.attr('height', function(d) { return height - y(d.count); })
				.attr("y", function(d) { return y(d.count); })
				};
				 
				//Watch 'data' and run scope.render(newVal) whenever it changes
				//Use true for 'objectEquality' property so comparisons are done on equality and not reference
				scope.$watch('data', function(){
				scope.render(scope.data);
				}, true); 
      }
  }
]);

//------------------------------------------------------------------------------------------------------------



// Chart 2 - Line Chart
angularApp.controller('controller2', ['$scope','$interval', function($scope, $interval, $http) {
		// create a message to display in our view
		$scope.message = 'Line Chart';
		$scope.salesData=[
         {hour: 1,sales: 54},
         {hour: 2,sales: 66},
         {hour: 3,sales: 77},
         {hour: 4,sales: 70},
         {hour: 5,sales: 60},
         {hour: 6,sales: 63},
         {hour: 7,sales: 55},
         {hour: 8,sales: 47},
         {hour: 9,sales: 55},
         {hour: 10,sales: 30}
     ];

    $interval(function(){
        var hour=$scope.salesData.length+1;
        var sales= Math.round(Math.random() * 100);
        $scope.salesData.push({hour: hour, sales:sales});
    }, 1000, 10);
}]).directive('dir2', function($window){
		return{
		  restrict:'EA',
      template:"<svg width='850' height='200'></svg>",
       link: function(scope, elem, attrs){
     	   var salesDataToPlot=scope.salesData;
           var padding = 20;
           var pathClass="path";
           var xScale, yScale, xAxisGen, yAxisGen, lineFun;

           var d3 = $window.d3;
           var rawSvg=elem.find('svg');
           var svg = d3.select(rawSvg[0]);

           function setChartParameters(){

               xScale = d3.scale.linear()
                   .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length-1].hour])
                   .range([padding + 5, rawSvg.attr("width") - padding]);

               yScale = d3.scale.linear()
                   .domain([0, d3.max(salesDataToPlot, function (d) {
                       return d.sales;
                   })])
                   .range([rawSvg.attr("height") - padding, 0]);

               xAxisGen = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .ticks(salesDataToPlot.length - 1);

               yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(5);

               lineFun = d3.svg.line()
                   .x(function (d) {
                       return xScale(d.hour);
                   })
                   .y(function (d) {
                       return yScale(d.sales);
                   })
                   .interpolate("basis");
           }
         
         function drawLineChart() {

               setChartParameters();

               svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0,180)")
                   .call(xAxisGen);

               svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(20,0)")
                   .call(yAxisGen);

               svg.append("svg:path")
                   .attr({
                       d: lineFun(salesDataToPlot),
                       "stroke": "blue",
                       "stroke-width": 2,
                       "fill": "none",
                       "class": pathClass
                   });
           }

           drawLineChart();
       }
   };
});

//-------------------------------------------------------------------------------------------------------

// Chart 3 - Pie Chart
angular.module('angularApp').controller('controller3', function($scope) {
  $scope.message = "Pie Chart";
  }).directive('dir3', function ($parse) {
     return {
      restrict: 'E',
      scope: {
        values: '='
      },
      link: function (scope, element, attrs) {
      var w = 400;
var h = 400;
var r = h/2;
var color = d3.scale.category20c();

var data = [{ "age": "One",  "population": 5 }, 
          { "age": "Two", "population": 2 }, 
          { "age": "Three", "population": 9 }, 
          { "age": "Four", "population": 7 }, 
          { "age": "Five", "population": 4 }, 
          { "age": "Six", "population": 3  }, 
          { "age": "Seven", "population": 9 } ];


var vis = d3.select('#pie-chart').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
var pie = d3.layout.pie().value(function(d){return d.population;});

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
arcs.append("svg:path")
    .attr("fill", function(d, i){
        return color(i);
    })
    .attr("d", function (d) {
        // log the result of the arc generator to show how cool it is :)
        console.log(arc(d));
        return arc(d);
    });

// add the text
arcs.append("svg:text").attr("transform", function(d){
      d.innerRadius = 0;
      d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    return data[i].age;}
    );
      }
    }
   });

//-------------------------------------------------------------------------------------------------------
// Chart 4 - Horizontal Bar Chart
angular.module('angularApp').controller('controller4', function($scope) {
		// create a message to display in our view
		$scope.message = 'Horizontal Bar Chart';
		$scope.myData = [10,20,30,40,60,50,80,90];
		
	}).directive('dir4', function ($parse) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     var directiveDefinitionObject = {
         //We restrict its use to an element
         restrict: 'E',
         //this is important, we don't want to overwrite our directive declaration
         //in the HTML mark-up
         replace: false,
         //our data source would be an array passed thru chart-data attribute
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {
           //in D3, any selection[0] contains the group
           //selection[0][0] is the DOM node
           var chart = d3.select(element[0]);
           //to our original directive markup bars-chart
           //we add a div with out chart stling and bind each
           //data entry to the chart
            chart.append("div").attr("class", "chart")
             .selectAll('div')
             .data(scope.data).enter().append("div")
             .transition().ease("elastic")
             .style("width", function(d) { return d + "%"; })
             .text(function(d) { return d + "%"; });
           //setting it's width based on the data value (d) 
           //and text all with a smooth transition
         } 
      };
      return directiveDefinitionObject;
   });
