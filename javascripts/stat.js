(function() {
    var data; // a global

    d3.json('/reading-vimrc/json/archives.json', function(error, json) {
        if (error) return console.warn(error);
        data = json;
        visualizeit();
    });

    function visualizeit() {
        var margin = {top: 20, right: 5, bottom: 30, left: 45},
            width  = 1080 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var xScale = d3.scale.ordinal()
                       .rangeRoundBands([0, width], 0.1, 1);

        var yScale = d3.scale.linear()
                       .range([height, 0]);

        var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom");

        var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left");

        // draw svg field
        var svg = d3.select('#d3-vimrc-barchart')
                    .append('svg')
                    .attr({
                        width: width + margin.left + margin.right,
                        height: height + margin.top + margin.bottom
                    })
                    .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        xScale.domain(data.map(function(d) { return d.id; }));
        yScale.domain([0, d3.max(data, function(d) { return get_members_len(d); })]);

        // draw axis
        svg.append("g")
            .attr("class", "x axis")
            .attr('fill', '#f8f8f8')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .attr('fill', '#f8f8f8')
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("fill", "#f8f8f8")
            .style({
                "text-anchor": "end",
            })
            .text("Participants");


        var bar_style = {
            padding : 2,
            color: 'steelblue',
            color_hover: 'orange'
        };

        // Draw bars
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr({
                class: 'bar',
                fill: bar_style.color
            })
            .attr({
                x: function(d) { return xScale(d.id); },
                y: function(d) { return height - get_bar_h(d); },
                width: xScale.rangeBand(),
                height: function(d) { return get_bar_h(d); }
            })
            .on('mouseover', function(d) {
                d3.select(this).attr('fill', bar_style.color_hover);
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('fill', bar_style.color);
            })
            ;
            

        // Helper
        function get_bar_h(d) {
            var body_height = height - margin.top - margin.bottom;
            var max_members = d3.max(
                data, function(d) { return get_members_len(d);}
            );
            return (body_height / max_members) * get_members_len(d);
        }

        function get_members_len(d) {
            return d.members.length;
        }
    }


})();
