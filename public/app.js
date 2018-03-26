$.getJSON("/reviews", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#reviews").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><a href='" + data[i].link + "'>Link</a>" + "<h5>" + data[i].summary + "</h5></p>");
    }
});

$(document).on("click", "p", function() {
    $("#comments").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/reviews/" + thisId
    })

    .then(function(data) {
        console.log(data);
        
        $("#comments").append("<h2>" + data.title + "</h2>");
        
        $("#comments").append("<input id='titleinput' name='title' >");
        $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#comments").append("<button data-id='" + data._id + "'id='savecomment'>Save Comment</button");

        if (data.comments) {
            $('#titleinput').val(data.comments.title);
            $('#bodyinput').val(data.comments.body);
        }
    });
});


$(document).on("click", "#savecomment", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/reviews/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })

    .then(function(data) {
        console.log(data);
        $("#comments").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});