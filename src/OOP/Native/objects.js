var isStructured = false;
const objects = document.getElementsByClassName("Object");

var structbtn = document.getElementById("oop-structurize");
structbtn.onclick = function() {
    isStructured = !isStructured;

    if (isStructured) {
        structbtn.style.backgroundColor = "rgb(115,168,118)";
        for (let i = 0; i < objects.length; i++) {

            var object = objects[i];

            (function(o){
                o.style.position = "relative";
                o.style.display = "inline-block";

                // Right-click Menu
                var menu = document.createElement('div');

                menu.setAttribute("class", "objectMenu");

                // Type
                var classLabel = document.createElement('p');
                const splitRes = o.id.split("-");
                const className = splitRes[0];
                const objectID = splitRes[1];
                classLabel.innerText = "Type: " + className;

                // Modify Class
                var modifyClassBtn = document.createElement('div');
                modifyClassBtn.innerText = "Modify Type";
                modifyClassBtn.style = "display: inline-block; position: relative;";

                // Class List
                var modifyClassList = document.createElement('div');
                modifyClassList.setAttribute("class", "classMenu");
                modifyClassList.id = o.id + "-classlist";

                modifyClassBtn.appendChild(modifyClassList);

                modifyClassBtn.onmousedown = function(e) {
                    if (!e) e = window.event;
                    if (!(e.target.id == modifyClassList.id || 
                        $(e.target).parents(modifyClassList.id).length > 0)) {
                        modifyClassList.style.display = "none";
                    }
                    if (e.button == 2) {
                        app.ports.askModifiableClassList.send(o.id);
                        modifyClassList.style.display = "block";
                    }
                }
                
                // Delete Object
                var deleteObjectBtn = document.createElement('p');
                deleteObjectBtn.innerText = "Delete";

                deleteObjectBtn.onmousedown = function(e) {
                    if (!e) e = window.event;
                    app.ports.askDeleteObject.send(parseInt(objectID));
                    isStructured = false;
                    structbtn.style.backgroundColor = "#99CC66";
                } 

                menu.appendChild(classLabel);
                menu.appendChild(modifyClassBtn);
                menu.appendChild(deleteObjectBtn);

                o.appendChild(menu);

                o.oncontextmenu = function (e) {
                    e.preventDefault();
                };

                o.onmousedown = function(e) {
                    if (!e) e = window.event;
                    if (!(e.target.id == o.id ||
                        $(e.target).parents(o.id).length > 0)) {
                        menu.style.display = "none";
                    }
                    if (e.button == 2) {
                        menu.style.display = "block";
                    }
                    stopPropagation();
                };
            })(object);
        }
    } else {
        structbtn.style.backgroundColor = "#99CC66";
        for (let i = 0; i < objects.length; i++) {

            var object = objects[i];

            (function(o){
                o.onmousedown = function(e) {
                    if (!e) e = window.event;
                };
            })(object);
        }
    }
};

function stopPropagation(e) {
    e = e || window.event;
    if(e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

app.ports.replyModifiableClassList.subscribe(function(message) {
    var classList = document.getElementById(message[0] + '-classlist');
    classList.innerHTML = "";
    for (const cls of message[1]) {
        var clsLabel = document.createElement('p');
        clsLabel.innerText = cls;
        (function(lab) {
            lab.onmousedown = function(e) {
                if (!e) e = window.event;
                app.ports.askModifyClass.send(cls + "-" + (message[0].split("-")[1]));
                isStructured = false;
                structbtn.style.backgroundColor = "#99CC66";
            }
        })(clsLabel)
        classList.appendChild(clsLabel);
    }
});

var isDisplayAdd = false;
const addElm = document.getElementsByClassName("Add");

var addOne = document.getElementById("oop-add");

addOne.onclick = function() {
    isDisplayAdd = !isDisplayAdd;
    if (isDisplayAdd) {
        addOne.style.backgroundColor = "rgb(115,168,118)";
        for (const each of addElm) {
            (function(elm){
                var addBtn = document.createElement('span');
                addBtn.textContent = "+";
                addBtn.style.color = "red";
                if (elm.classList.contains("Object")) {
                    elm.appendChild(addBtn);
                    addBtn.onmousedown = function(e) {
                        if (!e) e = window.event;
                        const objectID = parseInt(elm.id.split("-")[1]);
                        app.ports.askAddObjectAfterObject.send(objectID);
                        isDisplayAdd = false;
                        addOne.style.backgroundColor = "#99CC66";
                    };
                } else {
                    elmFirstChild = elm.firstChild;
                    elmFirstChild.insertBefore(addBtn, elmFirstChild.firstChild);
                    addBtn.onmousedown = function(e) {
                        if (!e) e = window.event;
                        app.ports.askAddObjectAtBegin.send(elm.id);
                        isDisplayAdd = false;
                        addOne.style.backgroundColor = "#99CC66";
                    };
                    
                }
            })(each)
        }
    } else {
        addOne.style.backgroundColor = "#99CC66";
        for (const elm of addElm) {
            if (elm.classList.contains("Object")) {
                elm.removeChild(elm.lastChild);
            } else {
                elmFirstChild = elm.firstChild;
                elmFirstChild.removeChild(elmFirstChild.firstChild);
            }
        }
    }
}