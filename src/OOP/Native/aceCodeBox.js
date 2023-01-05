
var enode = document.createElement("div");
enode.id = "oop-editor";
enode.style.setProperty('z-index', '0');
enode.style.setProperty('position','fixed');
document.getElementById("bi-preview").appendChild(enode);

var editor = ace.edit("oop-editor");
editor.setFontSize("15px");
editor.session.setMode("ace/mode/elm");

var runbtn = document.getElementById("oop-eval");
runbtn.onclick = function() {
    app.ports.askCode.send(editor.getSession().getDocument().getValue());
    enode.style.setProperty('border', 'none');
};

app.ports.replyCode.subscribe(function(message) {
    editor.getSession().setValue(message[0], 0);
    if (message[1] == true)
        enode.style.setProperty('border', 'none')
    else
        enode.style.setProperty('border', '2px dashed red')
});

app.ports.setCodeRed.subscribe(function() {
    enode.style.setProperty('border', '2px dashed red')
});