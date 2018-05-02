---
---
(function() {
    /* Angular */
    var app = angular.module('stat', ['ngRoute']);

    app.config([
        '$interpolateProvider', '$routeProvider', '$locationProvider',
        function($interpolateProvider, $routeProvider, $locationProvider) {
            $interpolateProvider.startSymbol('[[').endSymbol(']]');

            // TODO: Working with Jekyll
            // $locationProvider.html5Mode(true);
            // var root = '/reading-vimrc/stat/';
            var root = '/';
            $routeProvider
                .when(root, {
                    controller:'ParticipationRank',
                    templateUrl:'top.html'
                })
                .when(root + 'u/:name', {
                    controller:'UserCtrl',
                    templateUrl:'user.html'
                })
                .otherwise({
                    redirectTo: root
                });

        }
    ]);

    app.controller('UserCtrl', ['$scope', '$routeParams', '$http', '$location',
        function($scope, $routeParams, $http, $location) {
            $scope.name = $routeParams.name;
            $scope.count = 0;
            $scope.archives = [];
            $scope.first = null;
            $scope.last = null;
            $scope.current_streak = 0;
            $scope.longest_streak = 0;
            $scope.participated = [];
            $scope.note_participated = [];

            $scope.users = [];
            $scope.doUserSearch = function() {
                $location.path('/u/' + $scope.user_query);
            };

            $http({method: 'GET', url: "{{ site.github.url | replace: 'http://', '//' }}/json/archives.json"})
                .success(function(data, status, headers, config) {
                    Members.init(data);
                    $scope.users = Members.members;

                    // Add participation flag
                    $scope.archives = data.map(function(archive) {
                        archive.did_participate = (archive.members.indexOf($scope.name) > -1);
                        archive.archive_url = ARCHIVE_URL_TEMPLATE + (archive.id + '').lpad(3, '0') + '.html';
                        return archive;
                    });

                    $scope.participated = $scope.archives.filter(function(archive) {
                        return archive.did_participate;
                    });
                    $scope.not_participated = $scope.archives.filter(function(archive) {
                        return !archive.did_participate;
                    });
                    $scope.count = $scope.participated.length;
                    $scope.first = $scope.participated[0];
                    $scope.last = $scope.participated[$scope.participated.length - 1];

                    // Calculate current & longest streak
                    var bool_list_r = $scope.archives.map(function(archive) {
                        return archive.did_participate;
                    }).reverse();
                    var flag = { breaked: false };
                    var longest = 0;
                    var memo = 0;
                    for (var i in bool_list_r) {
                        if (bool_list_r[i]) { memo++; }
                        else {
                            // Update current
                            if (! flag.breaked) {
                                $scope.current_streak = memo;
                                flag.breaked = true;
                            }

                            // Update longest?
                            if (longest < memo) { longest = memo; }

                            memo = 0; // reset
                        }
                    }
                    $scope.longest_streak = Math.max(memo, longest);
                    if (! flag.breaked) { // for @thinca who hasn't break streak!
                        $scope.current_streak = memo;
                    }

                    // d3
                    draw_streak_graph($scope.archives);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error');
                });
        }
    ]);

    app.controller('ParticipationRank', ['$scope', '$http', function($scope, $http) {
        $scope.members = [];

        $http({method: 'GET', url: "{{ site.github.url | replace: 'http://', '//' }}/json/archives.json"})
            .success(function(data, status, headers, config) {
                Members.init(data);
                $scope.members = Members.members;
                $scope.members_with_count = Members.members_with_count;

                // d3
                draw_participation_charts(Members.raw);
             })
            .error(function(data, status, headers, config) {
                console.log('Error');
            });


    }]);

    // Model ...?
    var Members = {};
    Members.init = function(data) {
        this.raw = data;
        this.members_flat = data.map(function(d) { return d.members; })
                                .reduce(function(x, y) { return x.concat(y); });
        this.members = this.members_flat.filter(function(x, i, self) {
            return self.indexOf(x) === i;
        });

        this.members_with_count = this.members.map(function(mu) { // uniq member
            return {
                name: mu,
                count: Members.members_flat.filter(function(mf) { return mu === mf; }).length
            };
        }).sort(function(x, y) { return y.count - x.count; });

    };

    /* d3 */
    var ARCHIVE_URL_TEMPLATE = '/reading-vimrc/archive/';

    // Helper

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

    function draw_participation_charts(data) {
        var tooltip = d3.select('body').append('div')
                        .attr('class', 'js-stat-tooltip');

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear()
                  .range([0, width]).nice();

        var y = d3.scale.linear()
                  .range([height, 0]);

        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient('bottom');

        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient('left');

        var line = d3.svg.line()
                     .interpolate('basic')
                     .x(function(d) { return x(d.id); })
                     .y(function(d) { return y(get_members_len(d)); });

        // Draw svg field
        var svg = d3.select('#d3-vimrc-participants-stat')
                  .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        x.domain([0, d3.max(data, function(d) { return d.id; })]);
        y.domain([0, d3.max(data, function(d) { return get_members_len(d); })]);

        // Draw x axis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
          .append('text')
            .attr('y', 16)
            .attr('dy', '.71em')
            .attr('x', width + 10)
            .text('開催数')
            .style('text-anchor', 'end')
            ;

        // Draw y axis
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
          .append('text')
            .attr('y', 6)
            .attr('dy', '.71em')
            .attr('x', margin.left + 10)
            .style('text-anchor', 'middle')
            .text('参加者数(人)');

        // Draw line
        svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('fill', 'steelblue')
            .attr('d', line);

        // Draw dot on the line
        svg.selectAll('circle')
            .data(data).enter()
          .append('svg:a')
            .attr('xlink:href', function(d) {
                return ARCHIVE_URL_TEMPLATE + (d.id + '').lpad(3, '0') + '.html';
            })
          .append('svg:circle')
            .attr('class', 'circle')
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

        /* perfectscrollbar */
        $('#d3-vimrc-participants-stat').perfectScrollbar();
    }

    function draw_streak_graph(data) {
        var tooltip = d3.select('body').append('div')
                        .attr('class', 'js-stat-tooltip');

        var STREAK_ROW = 10

        var rect_style = {
            w: 15,
            h: 15,
            p: 5,
            marting_top: 30
        };
        rect_style.get_x = function(d, i) {
            var col = Math.ceil((i + 1) / STREAK_ROW);
            return margin.left + (rect_style.p + rect_style.w) * col;
        };
        rect_style.get_y = function(d, i) {
            var row = 1 + ((i) % STREAK_ROW);
            return margin.top + (rect_style.p + rect_style.h) * row;
        };
        rect_style.get_color = function(archive, i) {
            // return (archive.did_participate) ? '#3ac31a' : '#919992';
            return (archive.did_participate) ? '#6FF118' : '#999';
        };

        var margin = {top: 30, right: 50, bottom: 20, left: 30},
            // width = 640 - margin.left - margin.right,
            width = ( Math.ceil(data.length / STREAK_ROW) *
                      (rect_style.w + rect_style.p)
                    ) + 150 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var x = d3.scale.linear()
                  .range([0, width]).nice();

        var y = d3.scale.linear()
                  .range([height, 0]);

        // Draw svg field
        var svg = d3.select('#d3-participation-streak-graph')
                  .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    ;


        // Draw streak rect
        svg.selectAll('rect')
            .data(data).enter()
          .append('svg:a')
            .attr('xlink:href', function(d) {
                return ARCHIVE_URL_TEMPLATE + (d.id + '').lpad(3, '0') + '.html';
            })
          .append('svg:rect')
            .attr({
                x: function(d,i) { return rect_style.get_x(d,i); },
                y: function(d,i) { return rect_style.get_y(d,i); },
                width: rect_style.w,
                height: rect_style.h,
                fill: function(d,i) { return rect_style.get_color(d,i); }
            })
            .on('mouseover', function(d) {
                return tooltip.style('visibility', 'visible')
                    .text(
                        '第' + d.id + '回 ' +
                        d.author.name + ' ' +
                        formatDate(d.date)
                    )
                    .style({
                        top : (d3.event.pageY - 50) + 'px',
                        left: (d3.event.pageX - 100) + 'px'
                    })
                    ;
            })
            .on('mouseout', function(d) {
                return tooltip.style('visibility', 'hidden');
            })
            ;

        svg.selectAll('text')
           .data(data).enter()
         .append('g')
           .style({'font-size': '10px'})
         .append('svg:text')
           .attr({
               x: function(d, i) {
                   return rect_style.get_x(d,i);
               },
               y: margin.top ,
               dy: '.71em',
               fill: 'steelblue'
           })
           .text(function(d,i) {
               if (i % 20 === 0) return i;
               else return '';
           })
           .style('text-anchor', 'middle')
           ;


    }


})();
