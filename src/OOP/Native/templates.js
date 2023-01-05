var saveBtn = document.getElementById('oop-templates-save');

saveBtn.onclick = function() {
    tableData = getTableContent('oop-template-table');
    app.ports.askTemplatesSave.send(tableData);
}

function getTableContent(id){
    var mytable = document.getElementById(id);
    var iter = 0;
    var data = [];
    for(var i=0,rows=mytable.rows.length; i<rows; i++){
        for(var j=1,cells=mytable.rows[i].cells.length; j<cells-1; j++){
            if(!data[i]){
                data[i] = new Array();
            }
            data[iter] = mytable.rows[i].cells[j].firstChild.value;
            iter++;
        }
    }
    return data;
}