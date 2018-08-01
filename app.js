//TO DO:



$(document).ready(function() {
    var APIKey = "34a08de94c4f43289ccb389b947ebf13";
    var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + APIKey;
    var startYear = "";
    var endYear = "";

    $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        var query = $("#searchTerm").val().replace(' ','+').trim();
        var results = $("#numOfRecords").val();

        if ($("#startYear").val()) {
            startYear = $("#startYear").val() + "0101"; //'0101 added for January 01 of whatever year the user chooses'
        }

        if ($("#endYear").val()) {
            endYear = $("#endYear").val() + "0101";
        }

        if (endYear != "") {                                //endYear is specified
            if (startYear != "") {                          //startYear is specified && endYear is specified
                nytSearch(query,results,startYear,endYear);
            }
            else {
                nytSearch(query,results,"20100101",endYear);
            }
        }
        else if (startYear != "") {                         //startYear is specified && endYear is not specified
            nytSearch(query,results,startYear,"20180101");
        }
        else {                                              //startYear && endYear are not specified
            nytSearch(query,results,"20100101","20190101");
        }

    });

    $("#clearBtn").on("click", function() {
        $("#searchForm")[0].reset();
        $("#topArticles").empty();
        startYear = "";
        endYear = "";
    });


    function nytSearch(query,numOfResults,startYear,endYear) {

        $.ajax({
            url:queryURLBase + "&q=" + query + "&begin_date=" + startYear + "&end_date=" + endYear,
            method:"GET",
        }).done(function (NYTResults) {
            console.log(queryURLBase + "&q=" + query);
            var data = NYTResults.response.docs;
            // console.log(data);
            for (var i = 0; i < numOfResults; i++){
                var counter = i + 1;

                // Store needed data in variables
                var title = data[i].headline.main;
                var author = data[i].byline.original;
                var dateWritten = data[i].pub_date;
                dateWritten = dateFormat(dateWritten.substring(0,dateWritten.indexOf('T')));
                var snippet = data[i].snippet;
                var articleLink = data[i].web_url;

                // Construct HTML elements to populate Top Articles sections
                var resultWell = $("<div>").attr('class','well well-lg');
                var num = $("<h3 class='listing label label-default'>").text(counter);
                var headline_title = $("<a>").attr('href',articleLink);
                headline_title.append($("<h3 class='listing'>").text(title));
                var subHeadline_author = $("<h4>").text(author);
                var subHeadline_date = $("<h5 class='sublisting'>").text(dateWritten);
                var subHeadline_snippet = $("<h6 class='snippet'>").text(snippet);

                resultWell.append(num);
                resultWell.append(headline_title);
                resultWell.append(subHeadline_author);
                subHeadline_author.append(subHeadline_date);
                resultWell.append(subHeadline_snippet);
                $("#topArticles").append(resultWell);

            }
        });

    }


    function dateFormat(date) {

        var months = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                    ];

        //Date will come in as YYYY-MM-DD
        var newDate = date.split('-');

        //convert date strings in array to integers
        for (var i = 0; i < newDate.length; i++) {
            newDate[i] = parseInt(newDate[i]);
        }

        //match DD with appropriate month
        for (i = 0; i < months.length; i++) {
                if (newDate[1] === parseInt(i+1) ) {
                    newDate[1] = months[i];
                }
        }
        newDate = newDate[1] + " " + newDate[2] + ", " + newDate[0];
        return newDate;
    }
});
