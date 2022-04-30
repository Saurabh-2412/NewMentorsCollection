Survey.StylesManager.applyTheme("modern");
var surveyJSON = {
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "text",
                    "name": "BookedByName",
                    "title": "Name",
                    "isRequired": true
                },
                {
                    "type": "text",
                    "name": "BookedByEmail",
                    "title": "Email-ID",
                    "isRequired": true
                },
                {
                    "type": "dropdown",
                    "name": "MentorName",
                    "title": "Mentors",
                    "isRequired": true,
                    "choices":[
                        "item1"
                    ]
                },
                {
                    "type": "dropdown",
                    "name": "SlotTiming",
                    "title": "AvailableSlot",
                    "isRequired": true,
                    "choices": [
                        "item1"
                    ]
                },
                {
                    "type": "text",
                    "name": "Status",
                    "visible": false,
                    "title": "Status",
                    "value":"B"
                }
            ]
        }
    ]
}

var settings = {
    "url": "https://apim.quickwork.co/TeamQuickWork/mentorsTracker/1/mentors",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Apikey": "z6x1wjiUjISqKA0OgaOYBrcx9m9wKV5g",
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({})
};

$.ajax(settings).done(function (response) {
    survey.getQuestionByName("MentorName").choices = response.mentors;
});


/*var id;
$(function(){
    $.ajax({
        url: "https://apim.quickwork.co/TeamQuickWork/mentorsTracker/1/mentorsTracker",
        type: "GET",
        headers:{'Apikey': 'z6x1wjiUjISqKA0OgaOYBrcx9m9wKV5g'},
        success: function(data) {
            var mentorsList = [];
            var slotsList = [];
            //populating first dropdown
            data.result.map((mentor) => {
                mentorsList.push(mentor.MentorName);
                var newFilteredList = mentorsList.filter((value, index) => (//removinf duplications
                    mentorsList.indexOf(value) === index
                ));
                var $mentors_drop=$("#sq_102i");
                $mentors_drop.html('');
                $mentors_drop.append("<option value='select'>select</option>");
                newFilteredList.map((filteredName) =>{
                    $mentors_drop.append("<option value='"+ filteredName +"'>"+ filteredName +"</option>");
                })
            })

            $(document).ready(function() {
                //getting value of first dropdown
                $(document).on("change", "select[id^='sq_102i']", function() {
                    var selectedMentor = $(this).val();
                    slotsList = [];
                    $("#sq_103i").html('');
                    $("#sq_103i").append("<option value='select'>select</option>");
                    //getting slots for selected mentor
                    data.result.map((mentorAvailableSlot) => {
                        if(mentorAvailableSlot.MentorName === selectedMentor){
                            slotsList.push(mentorAvailableSlot.SlotTiming);
                        }
                    })
                    slotsList.map((Timing) => {
                        var $TimeSlots_drop=$("#sq_103i");
                        $TimeSlots_drop.append("<option value='"+ Timing +"'>"+ Timing +"</option>");
                    })
                    $(document).on("change", "select[id^='sq_103i']", function() {
                        var selectedSlot = $(this).val();
                        data.result.map((item) => {
                            if(item.MentorName === selectedMentor && item.SlotTiming === selectedSlot){
                                id = item.ID;
                            }
                        })
                    })
                })
            });
        }
    });
})*/

function sendDataToServer(survey) {
    console.log(survey.data);
    //send Ajax request to your web server.
    //var newObject = {...survey.data,"ID":id};
    //Object.assign(survey.data,newObject);
    alert("The results are:" + JSON.stringify(survey.data));
    $.ajax({
        url: "https://apim.quickwork.co/TeamQuickWork/mentorsTracker/1/BookMySlot",
        data: JSON.stringify(survey.data),
        contentType: 'application/json; charset=utf-8',
        type: "POST",
        headers:{'Apikey': 'z6x1wjiUjISqKA0OgaOYBrcx9m9wKV5g'},
        success: function(data) {
            alert(data.status);
        }
    });
}

var survey = new Survey.Model(surveyJSON);
$("#surveyContainer").Survey({
    model: survey,
    onComplete: sendDataToServer
});

survey.onValueChanged.add(function (sender, options) {
    var newMentorName = survey.getQuestionByName("MentorName").value;
    
    var selectedMentorName = {"MentorName": newMentorName};
    
    var slotSettings = {
        "url": "https://apim.quickwork.co/TeamQuickWork/mentorsTracker/1/MentorsSlots",
        "method": "POST",
        "headers": {
        "Apikey": "z6x1wjiUjISqKA0OgaOYBrcx9m9wKV5g",
        "Content-Type": "application/json"
        },
        "data": JSON.stringify(selectedMentorName)
    };

    $.ajax(slotSettings).done(function(response) {
        survey.getQuestionByName("SlotTiming").choices = response.newMentorsSlotList;
    });
})
