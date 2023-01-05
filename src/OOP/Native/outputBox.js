// var consoleOutput = document.getElementById("oop-textarea");
var output = document.getElementById("oop-output-div");
output.style.setProperty('z-index', '0');
output.style.setProperty('position','fixed');
var backup;

app.ports.replyOutput.subscribe(function(message) {
    // consoleOutput.value = message;
    var el = document.createElement('div');
    el.innerHTML = message;
    backup = el.innerHTML;

    $('#oop-output-div').html(message);
});

output.addEventListener("DOMSubtreeModified", function(evt) {
    var newOutput = output.innerHTML;
    if (newOutput !== "" && newOutput !== backup){
        app.ports.askOutput.send(output.innerHTML);
    }
}, false);

// const config = { attributes: true, childList: true, subtree: true };
// const callback = function(mutationsList, observer) {
//     var newOutput = output.innerHTML;
//     if (newOutput !== "" && newOutput !== backup){
//         app.ports.askOutput.send(output.innerHTML);
//     }
// };

// const observer = new MutationObserver(callback);
// observer.observe(output, config);