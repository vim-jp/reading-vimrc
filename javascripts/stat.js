(function() {
    var data; // a global

    d3.json('/reading-vimrc/json/archives.json', function(error, json) {
        if (error) return console.warn(error);
        data = json;
        visualizeit();
    });

    // Helper
    function get_members_len(d) {
        return d.members.length;
    }

    function visualizeit() {
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear()
                  .range([0, width]).nice();

        var y = d3.scale.linear()
                  .range([height, 0]);

        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");

        var line = d3.svg.line()
                     .interpolate("basic")
                     .x(function(d) { return x(d.id); })
                     .y(function(d) { return y(get_members_len(d)); });

        // Draw svg field
        var svg = d3.select("body")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain([0, d3.max(data, function(d) { return d.id; })]);
        y.domain([0, d3.max(data, function(d) { return get_members_len(d); })]);

        // Draw x axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .append("text")
            .attr("y", 16)
            .attr("dy", ".71em")
            .attr("x", width + 10)
            .text("(id)")
            .style("text-anchor", "end")
            ;

        // Draw y axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("x", margin.left + 10)
            .style("text-anchor", "middle")
            .text("Participants");

        // Draw line
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "steelblue")
            .attr("d", line);

        // Draw dot on the line
        svg.selectAll("circle")
            .data(data).enter().append("svg:circle")
            .attr("class", "circle")
            .attr({
                cx: function(d) { return x(d.id); },
                cy: function(d) { return y(get_members_len(d)); },
                r: 3,
                fill: '#ffcc00'
            })
            .on('mouseover', function(d) {
                d3.select(this).attr({
                    'r': '8'
                });
            })
            .on('mouseout', function(d) {
                d3.select(this).attr({
                    'fill': '#ffcc00',
                    'r': '3'
                });
            })
            .on('click', function(d) {
                console.log(d);
            })
            ;

    }

})();
