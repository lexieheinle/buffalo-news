$(window).load(function() {
    var pymChild = new pym.Child();
    var qsRegex;
    var buttonFilter;
    var $quicksearch = $('#quicksearch');
    var $container = $('#database')
    var timeout;

//https://docs.google.com/spreadsheets/d/1VrLoFrZl24laA1ZWa6TjJySCZVqeZVGR85qjyBDkg1M/pubhtml
    var public_spreadsheet_url = '1VrLoFrZl24laA1ZWa6TjJySCZVqeZVGR85qjyBDkg1M';


    var timestampdata = "https://spreadsheets.google.com/feeds/cells/" + public_spreadsheet_url + "/2/public/full?alt=json"

    // Call the Google Spreadsheet as a regular JSON to get latest timestamp which is not included in Tabletop.js


    $.ajax({
        url: timestampdata,
        dataType: "jsonp",
        success: function(data) {
            // Get timestamp and parse it to readable format


            var date = data.feed.updated.$t

            var MM = {
                Jan: "Jan.",
                Feb: "Feb.",
                Mar: "March",
                Apr: "April",
                May: "May",
                Jun: "June",
                Jul: "July",
                Aug: "Aug.",
                Sep: "Sept.",
                Oct: "Oct.",
                Nov: "Nov.",
                Dec: "Dec."
            }

            var formatdate = String(new Date(date)).replace(
                /\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):[^(]+\(([A-Z]{3})\)/,
                function($0, $1, $2, $3, $4, $5, $6) {
                    return MM[$1] + " " + $2 + ", " + $3 + " at " + $4 % 12 + ":" + $5 + (+$4 > 12 ? "PM" : "AM") + " " + $6
                }
            )


            $('.updated').append('<p><small class="text-muted">Last updated ' + formatdate + '</small></p>')
        },
    });



    // Tabletop initialization

    Tabletop.init({
        key: public_spreadsheet_url,
        callback: getTable,
        simpleSheet: true
    })

    // Function that fetches the Google Spreadsheet


    function getTable(data, tabletop) {

        var sheetname = tabletop.foundSheetNames[0];
        var sheetnamecontrol = tabletop.foundSheetNames[1];

        // Get title of datasheet

        var title = sheetname;
        $("h2").append(title)

        // Get credits and explainer from "Control spreadsheet"

        $.each(tabletop.sheets(sheetnamecontrol).all(), function(i, v) {

            var explainer = v.explainer
            var credits = v.credits
            $(".credit").append('<small class="text-muted">' + credits + '</small>')
            $(".explainer").append(explainer)
        });

        var result = [];
        var count = 1;


        $.each(tabletop.sheets(sheetname).all(), function(i, v) {
            function dateIt(date) {
                var total = 0;
                var dateList = date.split(' ');
                if (dateList[0] == 'August') {
                  total += 8
                }
                dateList[1] = dateList[1].replace(',', '');
                total += parseInt(dateList[1])
                var last = dateList.pop()
                var newList = dateList.slice(0,3);
                var hours = parseInt(last.slice(0,2));
                if (last.search('PM') != -1) {
                  hours += 12;
                  total += (60 * hours);
                } else {
                  total += (60 * hours);
                }
                var minutes = parseInt(last.slice(3,5));
                total += minutes;
                return total;
            }

            if (v.reject != 'y' && v.tweettext.search('RT') == -1 && v.tweettext[0] != '@') {
              $container.append('<div data-date="' + dateIt(v.tweetdate) + '"class="element-item" data-category="' + v.filtercategory + '">' + v['tweetembed'] + '</div>')
            }

            // Gets all unique filtercategory values and puts them into an array
            if ($.inArray(v.filtercategory, result) == -1 && v.filtercategory != '') {

                result.push(v.filtercategory);

                // Creates the filter buttons

                $('#filter').append('<button id="' + v.filtercategory + '" class="btn btn-secondary" data-value="choice' + count++ + '">' + v.filtercategory + '</button>')

            }

        });

        // imagesLoaded waits until all images are loaded before firing
        $container.imagesLoaded(function() {

            // Sorts them into responsive square layout using isotope.js

            $container.isotope({
                itemSelector: '.element-item',
                layoutMode: 'masonry',
                // so that isotope will filter both search and filter results
                filter:
                function() {
                    var $this = $(this);

                    var buttonResult = buttonFilter ? $this.is(buttonFilter) : true;

                    return buttonResult;

                },
                getSortData: {
                    startDate: '[data-date] parseInt',
                },
                sortBy: 'startDate',
                sortAscending: false
            });

            pymChild.sendHeight();
        });



        // debounce so filtering doesn't happen every millisecond
        function debounce(fn, threshold) {

            return function debounced() {
                if (timeout) {
                    clearTimeout(timeout);
                }

                function delayed() {
                    fn();
                    timeout = null;
                }
                timeout = setTimeout(delayed, threshold || 100);
            }
        }

        // Adds a click function to all buttons in the group
        $('.btn-group').each(function(i, buttonGroup) {
            var $buttonGroup = $(buttonGroup);
            var allbuttonids = $("button").attr('id');
            $buttonGroup.on('click', 'button', function() {

                // Changes to .is-checked class when clicked

                $buttonGroup.find('.active').removeClass('active');
                $(this).addClass('active');

                // Gets all values that matches the clicked button's data value

                buttonFilter = $(this).attr('id');
                textFilter = $(this).text();

                function getitems() {
                  var name = $(this).attr('data-category');
                  //find('.category').text();

                  if (textFilter != "Show All") {
                      return name.match(textFilter);

                  } else {
                      return "*";
                  }

                }

                buttonFilter = getitems || buttonFilter;

                $container.isotope();
                $container.isotope('updateSortData').isotope();
                pymChild.sendHeight();

            });
        });
        pymChild.sendHeight();
        $container.isotope();

    };
    setTimeout(function(){ $('#allbuttons').click() }, 3000);
    window.onresize = pymChild.sendHeight();
});
