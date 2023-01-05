
var enode = document.createElement("div");
enode.id = "editor"
document.getElementById("bi-preview").appendChild(enode);

var editor = ace.edit("editor");
editor.setFontSize("13px");
editor.session.setMode("ace/mode/elm");

app.ports.sendCode.subscribe(function(message) {
    editor.getSession().setValue(message[0], 0);
    if (message[1] == false)
        enode.style.setProperty('border', 'none')
    else
        enode.style.setProperty('border', '2px dashed red')
});

app.ports.setAceRed.subscribe(function() {
    enode.style.setProperty('border', '2px dashed red')
});

var runbtn = document.getElementById("run-program");
runbtn.onclick = function() {
    app.ports.receiveCode.send(editor.getSession().getDocument().getValue());
    enode.style.setProperty('border', 'none')
};