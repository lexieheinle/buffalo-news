var $graphic = $('#graphic');
var graphic_data_url = 'school_data.csv';
var $drop = $('#drop');
var graphic_data;
var seriesData;
var graphic_aspect_width = 16;
var graphic_aspect_height = 9;
var mobile_threshold = 500; //720;
var hoverColor = '#336B87'; //'#123e4e' navy blue;
var lineColor = "#DCDCDC";
var parsedDate = d3.time.format("%Y").parse;
var $mobile_response = $('#mobile_response');
var pymChild = null;
var line2013 = [];

//Removes each popover on either hover or selecting a different option
function removePopovers() {
    $('.popover').each(function() {
        $(this).remove();
    });
    $mobile_response.empty();
    //since the mobile response is gone update the height of the iFrame
    pymChild.sendHeight();
}

//Based on the width show either the mobile response paragraph or the typical popover.
function showPopover(element, info, width) {
    removePopovers();
    if (width <= mobile_threshold) {
        var mobile_popup = d3.select("#mobile_response")
          .insert("p",":first-child").html('<strong>' + info.name + '</strong><br />' + popoverInfo[info.name])
          .style('height', "150px");
        pymChild.sendHeight();
    } else {
        $(element).popover({
            title: info.name,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html: true,
            content: function() {
                return popoverInfo[info.name];
            }
        });
        $(element).popover('show')
    }
}

//Info for the popover content
var popoverInfo = {
  "Bennett High School":	"Fifty-seven percent of graduates enrolled in college during the Say Yes era, up from 51 percent the three years prior.",
  "Buffalo Academy for Visual and Performing Arts": "The percentage of college-bound seniors is on the rise, but data for 2015 was incomplete.",
  "Burgard High School": "Twenty-six graduates enrolled in college in 2010; the number was twice that in 2015.",
  "City Honors School": "The city's premier high school sends as much as 94 percent of its graduates to college. City Honors had its best track record during the Say Yes era.",
  "East High School": "Just a quarter of graduates enrolled in college in 2012 compared with 57 percent a year later when Say Yes began.",
  "Emerson School of Hospitality": "Popular culinary school saw some of the biggest gains; 60 percent of its students headed to college during the Say Yes era, up from 44 percent three years prior.",
  "Frederick Law Olmsted": "Second only to City Honors in the percentage of graduates who head to college.",
  "Hutchinson Central Technical High School": "One-fifth of all city graduates enrolling in college come from this high school. ",
  "International Preparatory School at Grover": "The graduating classes were small, but nearly three-quarters of graduates moved on to college since Say Yes began.",
  "Lafayette High School": "During the Say Yes era, a little more than half of the graduates enrolled in college, up from 43 percent the three years prior.",
  "Leonardo daVinci High School": "Located on the D'Youville campus, DaVinci has the highest percentage of students enrolling in private colleges.",
  "Math Science Technology Preparatory School": "This school sent the fewest graduates to college during the Say Yes era.",
  "McKinley High School": "Near the top in both number of students sent to college and gains made since Say Yes began.",
  "Middle Early College High School": "The school's long partnership with Erie Community College explains the 95 percent of graduates who move on to a two-year school.",
  "Riverside Institute of Technology": "Seventy-one percent of graduates enrolled in college last fall, compared with just 35 percent six years ago.",
  "South Park High School": "The only school that didn't send at least half of its graduates to college during the Say Yes era.",
  "All Buffalo schools": "Sixty-seven percent of graduates enrolled in college last fall.",
}

//Begin actual chart defintion
function drawGraphic(container_width) {
    if (container_width == undefined || isNaN(container_width)) {
        container_width = 600;
    }
    //When the figure resizes we need to empty all elements to be redrawn at the new width
    $drop.empty();
    $mobile_response.empty();
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };
    var width = container_width - margin.left - margin.right;
    var height = Math.ceil((width * graphic_aspect_height) / graphic_aspect_width) - margin.top - margin.bottom;
    var num_ticks = 5;
    $graphic.empty();
    //build dropdown list
    var drop_down_label = d3.select('#drop').append('label')
        .attr('for', 'school-list')
        .text('Select a high school.');
    var drop_down = d3.select('#drop').append('select')
        .attr('name', 'school-list')
        .attr('class', 'form-control');
    var options = drop_down.selectAll('option')
        .data(seriesData)
        .enter().append('option');
    options.text(function(d) {
            return d.name;
        })
        .attr('value', function(d) {
            var slug = d.name.replace(/ /g, '');
            return slug;
        });
    //Function which selects the correct line given the dropdown
    function highlight_line() {
        var selectedIndex = d3.event.target.selectedIndex;
        var selectedDOMElement = d3.event.target.children[selectedIndex].value;
        var lineId = "path#" + selectedDOMElement;
        var highlight = d3.select(lineId)
            .style("stroke-width", function() {
                if (width <= mobile_threshold) {
                    return "3px";
                } else {
                    return "6px";
                };
            })
            .style("stroke", hoverColor);
        var lineData = d3.select(lineId).data()
        showPopover(lineId, lineData[0], width)
        var otherlines = $('.line').not(lineId);
        //select all the rest of the lines, except the one you are hovering on and drop their opacity
        d3.selectAll(otherlines)
            .style("opacity", function() {
                if (width <= mobile_threshold) {
                    return 0.7;
                } else {
                    return 0.5;
                }
            });
    }
    //Function which is the opposite of the highlight_line
    function unhighlight() {
        var selectedDOMElement = d3.event.target.children[selected[0]].value;
        var lineId = "path#" + selectedDOMElement;
        if (selectedDOMElement != "All Buffalo schools") {
            d3.select(lineId)
                .style("stroke-width", function() {
                    if (width <= mobile_threshold) {
                        return "1.5px";
                    } else {
                        return "2.5px";
                    };
                })
                .style("stroke", lineColor);
        } else {
            d3.select(lineId)
                .style("stroke-width", function() {
                    if (width <= mobile_threshold) {
                        return "3px";
                    } else {
                        return "6px";
                    }
                })
                .style("stroke", "#000000");
        }
        var otherlines = $('.line').not(lineId);
        d3.selectAll(otherlines)
            .style("opacity", 1);
        removePopovers();

    }
    //Created an array to keep track of which line is selected so the program can unhighlight the correct ones
    var selected = [];
    d3.select("#drop").on("change", function() {
        if (selected.length < 1) {
            highlight_line();
            selected.push(d3.event.target.selectedIndex);
        } else {
            unhighlight();
            selected.shift();
            highlight_line();
            selected.push(d3.event.target.selectedIndex);
        }
    });
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    var y = d3.scale.linear()
        .rangeRound([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(function(d, i) {
            if (width <= mobile_threshold) {
                var fmt = d3.time.format('%y');
                return '\u2019' + fmt(parsedDate(d));
            } else {
                var fmt = d3.time.format("%Y");
                return fmt(parsedDate(d));
            }
        });
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(num_ticks)
        .tickFormat(d3.format("0%"));
    var line = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) {
            return x(d.label) + x.rangeBand() / 2;
        })
        .y(function(d) {
            return y(d.value);
        })
        //make lines gap if value is the default 0
        .defined(function(d) {
            return d.value != 0;
        });

    var svg = d3.select('#graphic').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(graphic_data.map(function(d) {
        return d.Year;
    }));

    y.domain([
        d3.min(seriesData, function(c) {
            return d3.min(c.values, function(d) {
                return d.value;
            });
        }),
        d3.max(seriesData, function(c) {
            return d3.max(c.values, function(d) {
                return d.value;
            });
        })
    ]);

    var series = svg.selectAll(".series")
        .data(seriesData)
        .enter().append("g")
        .attr("class", "series");
    series.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
            return line(d.values);
        })
        .style("stroke", function(d) {
            if (d.name == 'All Buffalo schools') {
                return "#000000";
            } else {
                return lineColor;
            }
        })
        .style("stroke-width", function(d) {
            if (d.name == 'All Buffalo schools') {
                if (width <= mobile_threshold) {
                    return "3px";
                } else {
                    return "6px";
                };
            } else {
                if (width <= mobile_threshold) {
                    return "1.5px";
                } else {
                    return "2.5px";
                };
            }
        })
        //add an id to each line so that the dropdown can grab it
        .attr("id", function(d) {
            var slug = d.name.replace(/ /g, "");
            return slug;
        })
        .style("fill", "none")
        .on("mouseover", function(d) {
            d3.select(this) //on mouseover of each line, give it a nice thick stroke
                .style("stroke-width", function() {
                    if (width <= mobile_threshold) {
                        return "3px";
                    } else {
                        return "6px";
                    };
                })
                .style("stroke", hoverColor);
            var info = d;
            showPopover(this, info, width);
            var otherlines = $('.line').not(this); //select all the rest of the lines, except the one you are hovering on and drop their opacity
            d3.selectAll(otherlines)
                .style("opacity", function() {
                    if (width <= mobile_threshold) {
                        return 0.7;
                    } else {
                        return 0.5;
                    }
                });
        })
        .on("mouseout", function(d) { //undo everything on the mouseout
            if (d.name != "All Buffalo schools") {
                d3.select(this)
                    .style("stroke-width", function() {
                        if (width <= mobile_threshold) {
                            return "1.5px";
                        } else {
                            return "2.5px";
                        };
                    })
                    .style("stroke", lineColor);
            } else {
                d3.select(this)
                    .style("stroke-width", function() {
                        if (width <= mobile_threshold) {
                            return "3px";
                        } else {
                            return "6px";
                        }
                    })
                    .style("stroke", "#000000");
            }

            var otherlines = $('.line').not(this);
            d3.selectAll(otherlines)
                .style("opacity", 1);
            removePopovers();
        });
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", function() {
            if (width <= mobile_threshold) {
                return "rotate(0)"
            } else {
                return "rotate(-90)"
            }
        })
        .attr("y", function() {
            if (width <= mobile_threshold) {
                return -19
            } else {
                return 6
            }
        })
        .attr("dy", ".71em")
        .style("text-anchor", function() {
            if (width <= mobile_threshold) {
                return "beginning"
            } else {
                return "end"
            }
        })
        .text("Percent of college-bound seniors");


}

$(window).load(function() {
    if (Modernizr.svg) {
        //if svg is supported, draw dynamic chart
        d3.csv(graphic_data_url, function(error, data) {
            graphic_data = data;
            var labelVar = 'Year';
            var varNames = d3.keys(graphic_data[0])
                .filter(function(key) {
                    return key !== labelVar;
                });

            seriesData = varNames.map(function(name) {
                return {
                    name: name,
                    values: graphic_data.map(function(d) {
                        return {
                            name: name,
                            label: d[labelVar],
                            value: +d[name]
                        };
                    })
                };
            });
            pymChild = new pym.Child({
                renderCallback: drawGraphic
            });
        });
    }
});
