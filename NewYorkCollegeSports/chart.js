var $main_graphic = $('#main-graphic');
var $drop = $('#drop');
var $secondary_graphics = $('#secondary-graphics');
var $dropsports = $('#drop-sport');

var graphic_data;
var sports_data;
var graphic_aspect_width;
var graphic_aspect_height;
var mobile_threshold = 500; //720;
var pymChild = pym.Child();
var graphic_data_url = 'clean_sports.json';

var classify = function(str) {
        return str.toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    }
    //build dropdown list
function buildDrop() {
    //build the dropdown menu from college list
    var drop_down_label = d3.select('#drop').append('label')
        .attr('for', 'college-list')
        .text('Select a college.');
    var drop_down = d3.select('#drop').append('select')
        .attr('name', 'college-list')
        .attr('class', 'form-control')
        .attr('id', 'college-select');
    var options = drop_down.selectAll('option')
        .data(d3.keys(graphic_data).sort(function(a, b) {
            a = a.toLowerCase();
            b = b.toLowerCase();

            return a < b ? -1 : a > b ? 1 : 0;
        }))
        .enter().append('option');
    options.text(function(d) {
            return d;
        })
        .attr('value', function(d) {
            return d;
        })
        .attr('id', function(d){
          return classify(d);
        });
      var buffU = d3.select('#university-at-buffalo');
      buffU.attr('selected', 'selected');
};
//build sports database
function buildDropSport(sports) {
    //build the dropdown menu from college list
    var drop_down_label = d3.select('#drop-sport').append('label')
        .attr('for', 'sport-list')
        .text('Select a sport.');
    var drop_down = d3.select('#drop-sport').append('select')
        .attr('name', 'sport-list')
        .attr('class', 'form-control')
        .attr('id', 'sport-list');
    var options = drop_down.selectAll('option')
        .data(sports.sort(function(a, b) {
            a = a['sport'].toLowerCase();
            b = b['sport'].toLowerCase();

            return a < b ? -1 : a > b ? 1 : 0;
        }))
        .enter().append('option');

    options.text(function(d) {
            return d['sport'];
        })
        .attr('value', function(d) {
            return d['sport'];
        })
};

function formatXLabels(d) {
    var ccloc = d.indexOf('Community College');
    var restccLoc = 'Community College';
    var uloc = d.indexOf('University');
    var restuLoc = "University".length;
    var cloc = d.indexOf('College');
    var restcLoc = "College".length;
    var nyloc = d.indexOf('New York');
    var restnyLoc = "New York".length;
    var tfloc = d.indexOf('Track & Field');
    var resttfloc = 'Track & Field'.length;
    var combinloc = d.indexOf('Combined');
    var restcombinloc = 'Combined'.length;
    var boroloc = d.indexOf('Borough');
    var restboroloc = 'Borough'.length;
    if (ccloc != -1) {
        if (boroloc != -1){
          var labelSlice = d.slice(0, ccloc);
          var nonCC = labelSlice + 'C.C.'
          var cleanBoro = nonCC.indexOf('Borough');
          var boroSlice = nonCC.slice(0, cleanBoro);
          //return boroSlice + 'Boro.' + nonCC.slice(cleanBoro + restboroloc);
          return "CUNY Boro. of MHTN C.C."
        } else {
          var labelSlice = d.slice(0, ccloc);
          return labelSlice + 'C.C.'
      }
    } else if (uloc != -1) {
        if (nyloc != -1) {
            var labelSlice = d.slice(0, uloc);
            var nonU = labelSlice + 'U.' + d.slice((uloc + restuLoc))
            var cleanNY = nonU.indexOf('New York');
            var nySlice = nonU.slice(0, cleanNY);
            return nySlice + 'N.Y.' + nonU.slice((cleanNY + restnyLoc))
        } else {
            var labelSlice = d.slice(0, uloc);
            return labelSlice + 'U.' + d.slice((uloc + restuLoc))
        }
    } else if (cloc != -1) {
        if ((nyloc != -1)) {
            var labelSlice = d.slice(0, cloc);
            var nonCol = labelSlice + 'Coll.' + d.slice((cloc + restcLoc))
            var cleanNY = nonCol.indexOf('New York');
            var nySlice = nonCol.slice(0, cleanNY);
            return nySlice + 'N.Y.' + nonCol.slice((cleanNY + restnyLoc))
        } else {
            var labelSlice = d.slice(0, cloc);
            return labelSlice + 'Coll.' + d.slice((cloc + restcLoc))
        }
    } else if (nyloc != -1) {
        var labelSlice = d.slice(0, nyloc);
        return labelSlice + 'N.Y.' + d.slice((nyloc + restnyLoc))
    } else if (isMobile && (tfloc != -1)) {
        var labelSlice = d.slice(0, tfloc);
        return labelSlice + 'T&F' + d.slice((tfloc + resttfloc))
    } else if (combinloc != -1) {
        return 'All Track';
    } else {
        return d;
    }
}

function formatYLabels(d) {
    var conversion = d3.format(".2s")(d);
    if (isMobile) {
        if (conversion == 0.0) {
            return 0;
        } else {
            return d3.format(".2s")(d);
        }
    } else {
      if (conversion == 0.0) {
          return 0;
        } else {
        return d3.format(".2s")(d);
        }
    }
}


function drawMain(college_slug, container_width) {
    //Draws the main overview chart
    if (isMobile) {
        var margin = {
            top: 20,
            right: 19,
            bottom: 105,
            left: 36
        };
    } else {
        var margin = {
            top: 20,
            right: 20,
            bottom: 120,
            left: 50
        };
    }
    var width = container_width - margin.left - margin.right;
    var height = Math.ceil((width * graphic_aspect_height) / graphic_aspect_width) - margin.top - margin.bottom;
    var college_title = d3.select('#main-graphic').append("h2")
        .text(college_slug)
    var description = d3.select('#main-graphic').append("p")
        .text("Located in " + graphic_data[college_slug]['city'] + ", this " + graphic_data[college_slug]['college_type'].toLowerCase() + " school is in the " + graphic_data[college_slug]['division'] + " and has " + d3.format("0,000")(graphic_data[college_slug]['enrollment_total']) + " students.")

    function findMin() {
        //Find the minimum exp_per_ athlete amount for the college
        var mini = 0;
        for (sport in graphic_data[college_slug]['sports']) {
            if (graphic_data[college_slug]['sports'][sport]['exp_per_female'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_male'] != null) {
                if (Math.min(graphic_data[college_slug]['sports'][sport]['exp_per_male'], graphic_data[college_slug]['sports'][sport]['exp_per_female']) < mini) {
                    mini = Math.min(graphic_data[college_slug]['sports'][sport]['exp_per_male'], graphic_data[college_slug]['sports'][sport]['exp_per_female'])
                }
            } else if (graphic_data[college_slug]['sports'][sport]['exp_per_female'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_female'] < mini) {
                mini = graphic_data[college_slug]['sports'][sport]['exp_per_female']
            } else if (graphic_data[college_slug]['sports'][sport]['exp_per_male'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_male'] < mini) {
                mini = graphic_data[college_slug]['sports'][sport]['exp_per_male']
            }
        }
        return mini;
    };

    function findMax() {
        //Find the maximum exp_per_ athlete amount for the college
        var maxi = 0;
        for (sport in graphic_data[college_slug]['sports']) {
            if (graphic_data[college_slug]['sports'][sport]['exp_per_female'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_male'] != null) {
                if (Math.max(graphic_data[college_slug]['sports'][sport]['exp_per_male'], graphic_data[college_slug]['sports'][sport]['exp_per_female']) > maxi) {
                    maxi = Math.max(graphic_data[college_slug]['sports'][sport]['exp_per_male'], graphic_data[college_slug]['sports'][sport]['exp_per_female'])
                }
            } else if (graphic_data[college_slug]['sports'][sport]['exp_per_female'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_female'] > maxi) {
                maxi = graphic_data[college_slug]['sports'][sport]['exp_per_female']
            } else if (graphic_data[college_slug]['sports'][sport]['exp_per_male'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_male'] > maxi) {
                maxi = graphic_data[college_slug]['sports'][sport]['exp_per_male']
            }
        }
        return maxi;
    };

    /*
      Scales
    */
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(d3.keys(graphic_data[college_slug]['sports']).sort(function(a, b) {
            a = a.toLowerCase();
            b = b.toLowerCase();

            return a < b ? -1 : a > b ? 1 : 0;
        }));
    var y = d3.scale.linear()
        .range([height, 0])
        .domain([findMin(), findMax()]);
    /*
      Axis
    */
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatXLabels);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatYLabels);

    if (isMobile) {
        yAxis.ticks(6);
    } else {
        yAxis.ticks(13);
    };
    //Get the sport data in a list for the bars
    var sportsDict = graphic_data[college_slug]['sports'];
    var sportsList = [];
    for (var sport in sportsDict) {
        sportsList.push({
            'sport': sport,
            'sportsInfo': sportsDict[sport]
        })
    }
    /*
      svg
    */
    var svg = d3.select("#main-graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + x.rangeBand() / 4 + "," + height + ")")
        .call(xAxis)
        .selectAll('text')
        .attr("transform", function() {
            if (sportsList.length < 3) {
                return "translate(0, 0)"
            } else if (isMobile && (sportsList.length > 15)) {
                return "rotate(-75) translate(-7, -13)"
            } else {
                return "rotate(-45)"
            }
        })
        .style("text-anchor", function() {
            if (sportsList.length < 3) {
                return "beginning"
            } else {
                return "end"
            }
        })
        .style("font-size", function() {
            if (isMobile && (sportsList.length > 15)) {
                return "11px"
            } else {
                return "12px"
            }
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", function() {
            if (isMobile) {
                return "translate(0,0)"
            } else {
                return "rotate(-90)"
            }
        })
        .attr("y", function() {
            if (isMobile) {
                return -20
            } else {
                return 4
            }
        })
        .attr("dy", ".71em")
        .style("text-anchor", function() {
            if (isMobile) {
                return "beginning"
            } else {
                return "end"
            }
        })
        .text("$ per athlete");
    /*
      bars
    */
    var male_bars = svg.append("g")
        .attr("class", "male bars")
        .attr("transform", "translate(" + (x.rangeBand() / 4) + ", 0)");
    male_bars.selectAll("rect")
        .data(sportsList)
        .enter().append("rect")
        .attr("class", "male bar")
        .attr("fill", "#29606b")
        .attr("x", function(d) {
            return x(d.sport);
        })
        .attr("width", x.rangeBand() / 2)
        .attr("y", function(d) {
            if (d['sportsInfo']['exp_per_male'] == null) {
                return 0;
            } else {
                return y(d['sportsInfo']['exp_per_male']);
            }
        })
        .attr("height", function(d) {
            if (d['sportsInfo']['exp_per_male'] == null) {
                return 0;
            } else {
                return (height - y(d['sportsInfo']['exp_per_male']));
            }
        })
        .attr("transform", function(d) {
            if (d['sportsInfo']['exp_per_female'] == null) {
                return "translate(" + (x.rangeBand() / 4) + ", 0)"
            } else {
                return "translate(0,0)"
            }
        });
    var female_bars = svg.append("g")
        .attr("class", "female bars")
        .attr("transform", "translate(" + (x.rangeBand() / 4) + ", 0)")
    female_bars.selectAll("rect")
        .data(sportsList)
        .enter().append("rect")
        .attr("class", "female bar")
        .attr("x", function(d) {
            return x(d.sport);
        })
        .attr("fill", "#f98c60")
        .attr("width", x.rangeBand() / 2)
        .attr("transform", function(d) {
            if (d['sportsInfo']['exp_per_male'] == null) {
                return "translate(" + (x.rangeBand() / 4) + ", 0)"
            } else {
                return "translate(" + (x.rangeBand() / 2) + ", 0)"
            }
        })
        .attr("y", function(d) {
            if (d['sportsInfo']['exp_per_female'] == null) {
                return 0
            } else {
                return y(d['sportsInfo']['exp_per_female']);
            }
        })
        .attr("height", function(d) {
            if (d['sportsInfo']['exp_per_female'] == null) {
                return 0;
            } else {
                return (height - y(d['sportsInfo']['exp_per_female']));
            }
        });
    buildDropSport(sportsList);
    pymChild.sendHeight();

}

function drawSportChart(chosen_college, sport, container_width) {
    //Build the individual sports charts given a sport
    if (isMobile) {
        var margin = {
            top: 20,
            right: 20,
            bottom: 150,
            left: 45
        };
    } else {
        var margin = {
            top: 20,
            right: 20,
            bottom: 175,
            left: 70
        };
    }
    if (isMobile) {
        graphic_aspect_width = 6;
        graphic_aspect_height = 10;
    } else {
        graphic_aspect_width = 5;
        graphic_aspect_height = 5;
    }
    var width = container_width - margin.left - margin.right;
    var height = Math.ceil((width * graphic_aspect_height) / graphic_aspect_width) - margin.top - margin.bottom;
    var college_title = d3.select('#secondary-graphics').append("h3")
        .text(sport)
    var sportsLen = sports_data[sport].length;
    var cleaner_sport = [];
    for (i = 0; i < sportsLen; i++) {
        if (graphic_data[chosen_college]['college_type'] != 'Public, 2-year') {
            if (graphic_data[sports_data[sport][i]]['division'] == graphic_data[chosen_college]['division']) {
                cleaner_sport.push(sports_data[sport][i]);
            }
        } else if (graphic_data[sports_data[sport][i]]['cc_classification'] == graphic_data[chosen_college]['cc_classification']) {
          cleaner_sport.push(sports_data[sport][i]);
        }
    }
    /*
      Find min &amp; max
    */
    function findMin() {
        //find the smallest amount per college's team
        var mini = 0;
        var collegeLen = cleaner_sport.length;
        for (i = 0; i < collegeLen; i++) {
            var college_slug = cleaner_sport[i];
            if (graphic_data[college_slug]['sports'][sport]['exp_per_female_team'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_male_team'] != null) {
                if (Math.min(graphic_data[college_slug]['sports'][sport]['exp_per_male_team'], graphic_data[college_slug]['sports'][sport]['exp_per_female_team']) < mini) {
                    mini = Math.min(graphic_data[college_slug]['sports'][sport]['exp_per_male_team'], graphic_data[college_slug]['sports'][sport]['exp_per_female_team'])
                }
            } else if (graphic_data[college_slug]['sports'][sport]['exp_per_female_team'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_female_team'] < mini) {
                mini = graphic_data[college_slug]['sports'][sport]['exp_per_female_team']
            } else if (graphic_data[college_slug]['sports'][sport]['exp_per_male_team'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_male_team'] < mini) {
                mini = graphic_data[college_slug]['sports'][sport]['exp_per_male_team']
            }
        }
        return mini;
    };

    function findMax() {
        //find the largest amount per college's team
        var maxi = 0;
        var collegeLen = cleaner_sport.length;
        for (i = 0; i < collegeLen; i++) {
            var college_slug = cleaner_sport[i];
            if (graphic_data[college_slug]['sports'][sport]['exp_per_female_team'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_male_team'] != null) {
                if (Math.max(graphic_data[college_slug]['sports'][sport]['exp_per_male_team'], graphic_data[college_slug]['sports'][sport]['exp_per_female_team']) > maxi) {
                    maxi = Math.max(graphic_data[college_slug]['sports'][sport]['exp_per_male_team'], graphic_data[college_slug]['sports'][sport]['exp_per_female_team'])
                }
            } else if (graphic_data[college_slug]['sports'][sport]['exp_per_female_team'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_female_team'] > maxi) {
                maxi = graphic_data[college_slug]['sports'][sport]['exp_per_female_team']
            } else if (graphic_data[college_slug]['sports'][sport]['exp_per_male_team'] != null && graphic_data[college_slug]['sports'][sport]['exp_per_male_team'] > maxi) {
                maxi = graphic_data[college_slug]['sports'][sport]['exp_per_male_team']
            }
        }
        return maxi;
    };
    /*
      Scales
    */
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(cleaner_sport.sort(function(a, b) {
            a = a.toLowerCase();
            b = b.toLowerCase();

            return a < b ? -1 : a > b ? 1 : 0;
        }));
    var y = d3.scale.linear()
        .range([height, 0])
        .domain([findMin(), findMax()]);
    /*
      Axis
    */
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatXLabels);
    if (isMobile) {
        xAxis.ticks(6);
    } else {
        xAxis.ticks(13);
    };

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatYLabels);

    if (isMobile) {
        yAxis.ticks(6);
    } else {
        yAxis.ticks(13);
    };
    /*
      svg
    */
    var svg = d3.select("#secondary-graphics").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + x.rangeBand() / 4 + "," + height + ")")
        .call(xAxis)
        .selectAll('text')
        .attr("transform", function() {
            if (cleaner_sport.length < 3) {
                return "translate(0, 0)"
            } else if (isMobile && (cleaner_sport.length > 15)) {
                return "rotate(-75) translate(-5, -10)"
            } else {
                return "rotate(-45)"
            }
        })
        .style("text-anchor", function() {
            if (cleaner_sport.length < 3) {
                return "beginning"
            } else {
                return "end"
            }
        })
        .style("font-size", function() {
            if (isMobile && (cleaner_sport.length > 15)) {
                return "11px"
            } else {
                return "12px"
            }
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", function() {
            if (isMobile) {
                return "translate(0,0)"
            } else {
                return "rotate(-90)"
            }
        })
        .attr("y", function() {
            if (isMobile) {
                return -20
            } else {
                return 4
            }
        })
        .attr("dy", ".71em")
        .style("text-anchor", function() {
            if (isMobile) {
                return "beginning"
            } else {
                return "end"
            }
        })
        .text("$ per athletic team");
    //Get the college data in a list for the bars
    var collegesList = [];
    var sportsLen = cleaner_sport.length;
    for (i = 0; i < sportsLen; i++) {
        collegesList.push({
            'college': cleaner_sport[i],
            'sportsInfo': graphic_data[cleaner_sport[i]]['sports'][sport]
        })
    }
    /*
      bars
    */
    var male_bars = svg.append("g")
        .attr("class", "male bars")
        .attr("transform", "translate(" + (x.rangeBand() / 4) + ", 0)");
    male_bars.selectAll("rect")
        .data(collegesList)
        .enter().append("rect")
        .attr("class", "male bar")
        .attr("fill", "#29606b")
        .attr("x", function(d) {
            return x(d.college);
        })
        .attr("width", x.rangeBand() / 2)
        .attr("y", function(d) {
            if (d['sportsInfo']['exp_per_male_team'] == null) {
                return 0;
            } else {
                return y(d['sportsInfo']['exp_per_male_team']);
            }
        })
        .attr("height", function(d) {
            if (d['sportsInfo']['exp_per_male_team'] == null) {
                return 0;
            } else {
                return (height - y(d['sportsInfo']['exp_per_male_team']));
            }
        })
        .attr("transform", function(d) {
            if (d['sportsInfo']['exp_per_female_team'] == null) {
                return "translate(" + (x.rangeBand() / 4) + ", 0)"
            } else {
                return "translate(0,0)"
            }
        });
    var female_bars = svg.append("g")
        .attr("class", "female bars")
        .attr("transform", "translate(" + (x.rangeBand() / 4) + ", 0)")
    female_bars.selectAll("rect")
        .data(collegesList)
        .enter().append("rect")
        .attr("class", "female bar")
        .attr("x", function(d) {
            return x(d.college);
        })
        .attr("fill", "#f98c60")
        .attr("width", x.rangeBand() / 2)
        .attr("transform", function(d) {
            if (d['sportsInfo']['exp_per_male_team'] == null) {
                return "translate(" + (x.rangeBand() / 4) + ", 0)"
            } else {
                return "translate(" + (x.rangeBand() / 2) + ", 0)"
            }
        })
        .attr("y", function(d) {
            if (d['sportsInfo']['exp_per_female_team'] == null) {
                return 0
            } else {
                return y(d['sportsInfo']['exp_per_female_team']);
            }
        })
        .attr("height", function(d) {
            if (d['sportsInfo']['exp_per_female_team'] == null) {
                return 0;
            } else {
                return (height - y(d['sportsInfo']['exp_per_female_team']));
            }
        });

    pymChild.sendHeight();
}

//Begin actual chart defintion
function drawGraphic(container_width) {
    if (container_width == undefined || isNaN(container_width)) {
        container_width = 600;
    }
    if (container_width <= mobile_threshold) {
        isMobile = true;
    } else {
        isMobile = false;
    }
    removeCollege();
    //When the figure resizes we need to empty all elements to be redrawn at the new width
    var margin = {
        top: 20,
        right: 20,
        bottom: 175,
        left: 70
    };
    if (isMobile) {
        graphic_aspect_width = 6;
        graphic_aspect_height = 7;
    } else {
        graphic_aspect_width = 5;
        graphic_aspect_height = 5;
    }
    var width = container_width - margin.left - margin.right;
    var height = Math.ceil((width * graphic_aspect_height) / graphic_aspect_width) - margin.top - margin.bottom;
    var num_ticks = 30;
    var college_selection = d3.select("#college-select").node().value;
    drawMain(college_selection, container_width);


    //Created an array to keep track of which line is selected so the program can unhighlight the correct ones

    d3.select("#drop").on("change", function() {
        removeCollege();
        college_change();
    });
    d3.select("#drop-sport").on("change", function() {
        removeSport();
        sport_change();
    });
    //Function which selects the correct line given the dropdown
    function college_change() {
        var selectedIndex = d3.event.target.selectedIndex;
        var selectedDOMElement = d3.event.target.children[selectedIndex].value;
        drawMain(selectedDOMElement, container_width);
    }

    function removeCollege() {
        $secondary_graphics.empty();
        $main_graphic.empty();
        $dropsports.empty();
    }

    function sport_change() {
        var selectedIndex = d3.event.target.selectedIndex;
        var selectedDOMElement = d3.event.target.children[selectedIndex].value
        var college_selection = d3.select("#college-select").node().value;
        drawSportChart(college_selection, selectedDOMElement, container_width)
    }

    function removeSport() {
        $secondary_graphics.empty();
    }

}

$(window).load(function() {
    if (Modernizr.svg) {
        //if svg is supported, draw dynamic chart
        d3.json(graphic_data_url, function(error, data) {
            graphic_data = data;
            buildDrop();
            d3.json('sports.json', function(error, data) {
                sports_data = data;
                pymChild = new pym.Child({
                    renderCallback: drawGraphic
                })
            })
        })
    }
});
