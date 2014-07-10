(function() {
    var ARCHIVE_URL_TEMPLATE = '/reading-vimrc/archive/';

    var data; // a global

    d3.json('/reading-vimrc/json/archives.json', function(error, json) {
        if (error) return console.warn(error);
        data = json;

        // D3
        visualizeit();

        // Caluculate stat
        showStat(data);

    });

    // Helper
    var tooltip = d3.select("body").append("div")
                    .attr("class", "js-stat-tooltip");

    function get_members_len(d) { return d.members.length; }

    function formatDate(data_str) {
        // data_str: %Y-%m-%d %H:%M
        // return:   %Y/%m/%d
        var parsedDate = d3.time.format('%Y-%m-%d %H:%M').parse(data_str);
        return d3.time.format('%Y/%m/%d')(parsedDate);
    }

    String.prototype.lpad = function(length, padString) {
        var str = this;
        while (str.length < length)
            str = padString + str;
        return str;
    };

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
        var svg = d3.select("#d3-vimrc-participants-stat")
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
            .text("開催数")
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
            .text("参加者数(人)");

        // Draw line
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "steelblue")
            .attr("d", line);

        // Draw dot on the line
        svg.selectAll("circle")
            .data(data).enter()
          .append("svg:a")
            .attr("xlink:href", function(d) {
                return ARCHIVE_URL_TEMPLATE + (d.id + '').lpad(3, '0') + '.html';
            })
          .append("svg:circle")
            .attr("class", "circle")
            .attr({
                cx: function(d) { return x(d.id); },
                cy: function(d) { return y(get_members_len(d)); },
                r: 3,
                fill: '#ffcc00'
            })
            .on('mouseover', function(d) {
                d3.select(this).attr({ 'r': '8' });
                return tooltip.style('visibility', 'visible')
                    .text(
                        '第' + d.id + '回 ' +
                        d.author.name + ' ' +
                        get_members_len(d) + '名 ' +
                        formatDate(d.date)
                    )
                    .style({
                        top : (d3.event.pageY - 80) + 'px',
                        left: (d3.event.pageX - 100) + 'px'
                    })
                    ;
            })
            .on('mouseout', function(d) {
                d3.select(this).attr({
                    'fill': '#ffcc00',
                    'r': '3'
                });
                return tooltip.style('visibility', 'hidden');
            })
            ;

    }

    function showStat(data) {
        var members_flat = data.map(function(d) { return d.members; })
                               .reduce(function(x, y) { return x.concat(y); });
        var members_uniq = members_flat.filter(function(x, i, self) {
            return self.indexOf(x) === i;
        });
        var members_with_count = members_uniq.map(function(mu) {
            return {
                name: mu,
                count: members_flat.filter(function(mf) {
                    return mu === mf;
                }).length
            };
        }).sort(function(x, y) {
            return y.count - x.count;
        });

        // TODO: write to the dom
        for (var i=0; i < 15; ++i) {
            console.log(members_with_count[i]);
        }
    }

})();
