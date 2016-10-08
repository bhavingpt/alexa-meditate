// This code sample shows how to call and receive external rest service data, within your skill Lambda code.

// var https = require('https');

const quickMeditationSSML = "";

exports.handler = function( event, context ) {
    var say = "";
    var shouldEndSession = false;
    var sessionAttributes = {};

    if (event.session.attributes) {
        sessionAttributes = event.session.attributes;
    }

    if (event.request.type === "LaunchRequest") {
        say = "Welcome to your meditation session. First, how long do you want to meditate.";
        context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
    } else {
        var IntentName = event.request.intent.name;

        if (IntentName === "QuickStartMeditationIntent") {
            say = "Starting the quick meditation";
            shouldEndSession = true;
            // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
            context.succeed({sessionAttributes: sessionAttributes, response: buildResponse(quickMeditationSSML, shouldEndSession) });
        } 
        else if (IntentName === "StartMeditationIntent") {
            say = "Start Meditate Intent has been called"
            // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
        } 
        else if (IntentName === "AMAZON.StopIntent" || IntentName === "AMAZON.CancelIntent") {
            say = "You asked for " + sessionAttributes.requestList.toString() + ". Thanks for playing!";
            shouldEndSession = true;
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
        } 
        else if (IntentName === "AMAZON.HelpIntent" ) {
            say = "Just say the name of a U.S. State, such as Massachusetts or California."
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
        }
    }
};

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