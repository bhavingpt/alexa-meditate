// This code sample shows how to call and receive external rest service data, within your skill Lambda code.

// var https = require('https');

var quickMeditationSSML = '<speak>Let\'s begin. Before starting, sit comfortably or lie down. Close your eyes and focus on keeping your mind blank.<break time="3s"/>Take a deep breath in through your nose. Hold it... <break time ="2s"/>Now breath out. Good. Pay attention to the sensations you\'re feeling.<break time = "2s"/> Let\'s start with your lower body. I want you to stretch out your legs and point your toes. Squeeze your muscles and imagine them tensing up. Keep your eyes closed.<break time = "2s"/> Now, move to your torso and arms. Feel your muscles tightening and squeeze. Imagine your hands are holding lemons and try to squeeze them as much as you can. Keep your body tightened as much as possible.<break time = "3s"/> Finally, move to your head. Tighten your neck muscles and pull your shoulders to your ears. Wrinkle up your face, nose, eyes, and mouth. Notice how tight your whole body feels. Inhale...<break time = "3s"/>And exhale, relaxing every muscle in your body. Imagine your arms are spaghetti noodles. Let them hang at your side. Relax your toes and your stomach. Notice how good you feel, how relaxed and calm.<break time = "2s"/> Take deep breaths in and out. Feel the sensations of relaxation. When you are ready, you can slowly open your eyes.<break time = "2s"/> Thank you for taking the time from your busy schedule to destress yourself. See you next time!</speak>';



exports.handler = function( event, context ) {
    var say = "";
    var shouldEndSession = false;
    var sessionAttributes = {};

    if (event.session.attributes) {
        sessionAttributes = event.session.attributes;
    }

    if (event.request.type === "LaunchRequest") {
        say = "Welcome to your meditation session.";
        context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
    } else {
        var IntentName = event.request.intent.name;

        if (IntentName === "QuickStartMeditationIntent") {
            shouldEndSession = true;
            context.succeed({sessionAttributes: sessionAttributes, response: buildResponse(quickMeditationSSML, shouldEndSession) });
        }
        else if (IntentName === "StartMeditationIntent") {
            say = "How many minutes would you like to meditate for?";
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
        }
        else if (IntentName === "AddLengthIntent") {
            var time = event.request.intent.slots.Length.value;
            sessionAttributes["time"] = time;
            say = "Do you want breathing meditation or music meditation?";
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
        }
        else if (IntentName === "AddMeditationIntent") {
            var type = event.request.intent.slots.Meditation.value;
            sessionAttributes.type = type;
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
        }
        else if (IntentName === "AMAZON.StopIntent" || IntentName === "AMAZON.CancelIntent") {
            say = "You asked for " + sessionAttributes.requestList.toString() + ". Thanks for playing!";
            shouldEndSession = true;
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
        }
        else if (IntentName === "AMAZON.HelpIntent" ) {
            say = "Just chill out, dude."
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
        }
    }

    function beginMeditation(){
        if(sessionAttributes["time"] !== null && sessionAttributes["length"] !== null) {
            shouldEndSession = true;
            if(type == "breathing"){
                say = breathingConstructor(time);
                context.succeed({sessionAttributes: sessionAttributes, response: buildResponse(say, shouldEndSession) });
            }
            else{ //music
                //todo music ssml
            }
        }
        else{
            shouldEndSession = true;
            say = "Broken: " + sessionAttributes.time + ", " + sessionAttributes.length;
            context.succeed({sessionAttributes: sessionAttributes, response: buildResponse(say, shouldEndSession) });
        }
    }
};



function breathingConstructor(min){
    var say = "";
    var iterations = 6 * min;
    var counter = 0;
    while (counter < iterations) {
        say += '<speak>Inhale. <break time="4s"/> Exhale. <break time="4s"/></speak>';
    }
    return say;
}

function buildResponse(ssmlValue, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: ssmlValue
        },
        reprompt: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>Please try again.</speak>"
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildSpeechletResponse(say, shouldEndSession) {
    return buildResponse("<speak>" + say + "</speak>", shouldEndSession);
}
