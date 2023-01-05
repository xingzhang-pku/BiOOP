var outputArea = document.getElementById("output-area");
var output;
var consoleArea = document.getElementById("console-output");

app.ports.sendOutput.subscribe(function(message) {
    var el = document.createElement('div');
    el.innerHTML = message;
    output = el.innerHTML;

    outputArea.innerHTML = message;
});

outputArea.addEventListener("DOMSubtreeModified", function(evt) {
    var newOutput = outputArea.innerHTML;
    if (newOutput !== "" && newOutput !== output){
        app.ports.receiveOutput.send(outputArea.innerHTML);
    }
}, false);

app.ports.setConsoleVisible.subscribe(function(message) {
    outputArea.innerHTML = "";
    consoleArea.value = message;
    outputArea.appendChild(consoleArea);
});