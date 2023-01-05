module OOP.Objects.Templates exposing (..)

import Debug exposing (toString)
import OOP.Parser.Term exposing (parse)
import OOP.Syntax exposing (Term(..), Env)

type alias Class = String
type alias ObjectPat = Term
type alias HtmlPat = Term
type alias ObjectID = Int
type alias FieldID = Int
type alias EnvDict = List (ObjectID, Env)

type alias Template =
    { class : String
    , oPat : ObjectPat
    , hPat : HtmlPat
    }

type alias Templates = List Template


-- When writing a script, cannot add any attributes.
-- Because the parser for html in Elm will parse strange results.
templates : List (String, String, String)
templates = 
    [   
        ( "JFrame"
        , "new JFrame([height, width, title, members, containers])"
        , """Html.div   [ ["height", height]
                        , ["width", width]
                        , ["margin", "auto"]
                        , ["border-style", "solid"]
                        , ["border-width", "medium"]
                        , ["border-color", "rgb(85, 154, 243)"]
                        , ["position", "relative"]
                        , ["background-color", "rgb(214, 214, 214)"]] 
                        [] 
                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]
                                    , ["height", "25px"]] 
                                    [] 
                                    [title]
                        , Html.div [] [] members
                        , Html.div [] [] containers]"""),

        ( "JLabel"
        , "new JLabel([height, width, bgcolor, left, top, text])"
        , """Html.div   [ ["height", height]
                        , ["width", width]
                        , ["background-color", bgcolor]
                        , ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["text-align", "left"]]
                        []
                        [text]"""),

        ( "JButton"
        , "new JButton([left, top, height, width, hint, id, onclick])"
        , """Html.div   [ ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["position", "absolute"]]
                        []
                        [ Html.button [["height", height]
                        , ["width", width]] [["id", id], ["onclick", onclick]] [hint]]
                        """),
        
        ( "JDialog"
        , "new JDialog([title, hint, id])"
        , """Html.div   [ ["height", "150px"]
                        , ["width", "200px"]
                        , ["margin", "auto auto auto auto"]
                        , ["border-style", "solid"]
                        , ["border-width", "medium"]
                        , ["border-color", "rgb(85, 154, 243)"]
                        , ["position", "relative"]
                        , ["background-color", "rgb(214, 214, 214)"]] 
                        [ ["id", id]
                        , ["hidden", ""]]
                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]
                                    , ["height", "25px"]] 
                                    [] 
                                    [title]
                        , Html.div [] [["id", id ++ "hint"]] [hint]
                        , Html.button [] [["id", id ++ "btn"]] ["Ok"]
                        , Html.script [] [] ["document.getElementById('" ++ id 
                            ++ "btn').addEventListener('click', function(){"
                            ++ "document.getElementById('" ++ id ++ "').setAttribute('hidden', true);})"
                        ]]"""),
        
        ( "JTextField"
        , "new JTextField([left, top, text])"
        , """Html.div   [ ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["border", "1px solid black"]
                        , ["width", "200px"]
                        , ["text-align", "left"]
                        , ["background-color", "white"]]
                        []
                        [text]"""),

        ( "JTextArea"
        , "new JTextArea([left, top, width, height, bgcolor, textcolor, id, text])"
        , """Html.div   [ ["margin", left ++  " auto " ++ top ++ " auto"]
                        , ["width", width]
                        , ["height", height]
                        , ["background-color", bgcolor]
                        , ["color", textcolor]
                        , ["text-align", "left"]]
                        [["id", id]]
                        [text]"""),

        ( "JRadioButton"
        , "new JRadioButton([name, hint, value])"
        , """Html.div [] [] [ Html.input [] [ ["type", "radio"]
                                            , ["name", name]
                                            , ["value", value]
                                            , ["id", name ++ hint]] []
                            , hint
                            ]"""),

        ( "JMenuItem"
        , "new JMenuItem([title])"
        , """Html.div [["border-bottom", "2px solid lightgray"]
                        , ["width", "100px"]
                        , ["padding", "5px 10px"]] [] 
                    [title]"""),
        
        ( "JMenu"
        , "new JMenu([title, id, items])"
        , """Html.div [] [] 
            [ Html.div [] [["id", id]] 
                [ Html.span [] [] [title]
                , Html.objectlist [] [["id", "List-1"]]
                    [Html.div [] [["id", id ++ "items"]] items]
                ]
            , Html.style [] [] 
                ["#" ++ id ++ " {
                    width: 100px;
                    cursor: pointer;
                    padding: 5px 10px;
                    position: relative;
                    border-radius: 2.5px;
                    display: inline-block;
                    background-color: white;
                    border-bottom: 2px solid lightgray;
                }
                #" ++ id ++ "items {
                    z-index: 99;
                    width: 120px;
                    display: none;
                    cursor: pointer;
                    position: absolute;
                    border-radius: 4px;
                    background-color: white;
                    border-top: 2px solid lightgray;
                    border-left: 2px solid lightgray;
                    border-right: 2px solid lightgray;
                }
                #" ++ id ++ ":hover #" ++ id ++ "items {
                    display:block;
                }"]
            ]"""),

        ( "JMenuBar"
        , "new JMenuBar([menu])"
        , """Html.div [["display", "flex"]] [] menu"""),

        ( "MyCalculator"
        , "new MyCalculator([height, width, title, members, containers, displayLabel])"
        , """Html.div   [ ["height", height]
                        , ["width", width]
                        , ["margin", "auto auto auto auto"]
                        , ["border-style", "solid"]
                        , ["border-width", "medium"]
                        , ["border-color", "rgb(85, 154, 243)"]
                        , ["position", "relative"]
                        , ["background-color", "rgb(214, 214, 214)"]] 
                        [] 
                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]
                                    , ["height", "25px"]] 
                                    [] 
                                    [title]
                        , Html.div [] [] [displayLabel]
                        , Html.div [] [] members
                        , Html.div [] [] containers]"""),

        ( "DisplayLabel"
        , "new DisplayLabel([height, width, bgColor, left, top, text, id, memval, op])"
        , """Html.div   [ ["height", height]
                        , ["width", width]
                        , ["background-color", bgColor]
                        , ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]]
                        [ ["id", id]
                        , ["memval", memval]
                        , ["op", op]]
                        [text]"""),

        ( "DigitBtn"
        , "new DigitBtn([left, top, height, width, hint, id, onClick])"
        , """Html.div   [ ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["position", "absolute"]]
                        []
                        [ Html.button [["height", height],
                                    ["width", width]] 
                                    [["id", id]] 
                                    [hint]
                        , Html.script [] [] 
                            [ "document.getElementById('" ++ id ++ "').addEventListener(
                                'click', function(){ 
                                    dl = document.getElementById('label');
                                    if(dl.innerHTML == ''){
                                        dl.innerHTML = '" ++ hint ++ "';
                                    }else{
                                        dl.innerHTML = dl.innerHTML + '" ++ hint ++ "';
                                    }
                                }
                            )"]]"""),

        ( "OpBtn"
        , "new OpBtn([left, top, height, width, hint, id, onClick])"
        , """Html.div   [ ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["position", "absolute"]]
                        []
                        [ Html.button [["height", height], 
                                    ["width", width]] 
                                    [["id", id]] 
                                    [hint]
                        , Html.script [] [] 
                            ["document.getElementById('" ++ id ++ "').addEventListener(
                                'click', function(){
                                    dl = document.getElementById('label');
                                    oprand = dl.innerHTML;
                                    op = '" ++ hint ++ "';
                                    if(op == '1/X'){
                                        dl.innerHTML = (1 / parseFloat(oprand));
                                    }else if(op == 'sqrt'){
                                        dl.innerHTML = (Math.sqrt(parseFloat(oprand)));
                                    }else if(dl.getAttribute('memval') == '.0'){
                                            dl.setAttribute('memval', dl.innerHTML);
                                            dl.setAttribute('op', '" ++ hint ++ "');
                                            dl.innerHTML = '';
                                    }else if(op == '='){
                                        op = dl.getAttribute('op');
                                        if(oprand == ''){
                                            dl.innerHTML = dl.getAttribute('memval');
                                        }else{
                                            oprand = parseFloat(oprand);
                                            memval = parseFloat(dl.getAttribute('memval'));
                                            switch(op){
                                                case '+': res = memval + oprand;break;
                                                case '-': res = memval - oprand;break;
                                                case '*': res = memval * oprand;break;
                                                case '/': res = memval / oprand;break;
                                                case '%': res = (parseInt(dl.getAttribute('memval'))) % (parseInt(dl.innerHTML));break;
                                                default: res = 'no such operation';
                                            }
                                            dl.innerHTML = res;
                                            dl.setAttribute('memval', '.0');
                                            dl.setAttribute('op', '?');
                                        }
                                    }else{
                                        dl.innerHTML = 'invalid operation';
                                    }
                                }
                            )"]]"""),

        ( "SpecBtn"
        , "new SpecBtn([left, top, height, width, hint, id, onClick])"
        , """Html.div   [ ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["position", "absolute"]]
                        []
                        [ Html.button [["height", height],
                                    ["width", width]] 
                                    [["id", id]] 
                                    [hint]
                        , Html.script [] [] 
                            ["document.getElementById('" ++ id ++ "').addEventListener(
                                'click', function(){ 
                                    dl = document.getElementById('label');
                                    hint = '" ++ hint ++ "';
                                    if(hint == 'Backspc'){
                                        str = dl.innerHTML;
                                        str = str.substring(0, str.length - 1);
                                        dl.innerHTML = str;
                                    }
                                    else if(hint == 'C'){
                                        dl.innerHTML = '';
                                        dl.setAttribute('memval', '.0');
                                        dl.setAttribute('op', '?');
                                    }
                                    else if(hint == 'CE'){
                                        dl.innerHTML = '';
                                    }
                                }
                            )"]]"""),
        
        ( "MyTd"
        , "new MyTd([color, content])"
        , """Html.div   [ ["border-bottom", "1px solid blue"]
                        , ["border-right", "1px solid blue"]
                        , ["background-color", color]
                        , ["width", "149px"]
                        ] 
                        [] 
                        [content]"""),

        ( "MyTr"
        , "new MyTr([cols])"
        , """Html.div [["display", "flex"]] [] cols"""),

        ( "MyTh"
        , "new MyTh([color, content])"
        , """Html.div   [ ["border-bottom", "1px solid blue"]
                        , ["border-right", "1px solid blue"]
                        , ["background-color", color]
                        , ["width", "149px"]
                        , ["font-weight", "bold"]
                        ] 
                        [] 
                        [content]"""),

        ( "MyTable"
        , "new MyTable([color, rows])"
        , """Html.div   [ ["border", "1px solid black"]
                        , ["background-color", "white"]
                        , ["height", "400px"]
                        , ["width", "600px"]] 
                        []
                        rows"""),

        ( "Folder"
        , "new Folder([bgcolor, textcolor, left, height, width, name])"
        , """Html.div   [ ["background-color", bgcolor]
                        , ["margin-left", left]
                        , ["height", height]
                        , ["width", width]
                        , ["color", textcolor]
                        , ["text-align", "left"]] 
                        []
                        [name]"""),

        ( "MyFileExplorer"
        , "new MyFileExplorer([height, width, title, members, containers, folders, files])"
        , """Html.div   [ ["height", height]
                        , ["width", width]
                        , ["margin", "auto auto auto auto"]
                        , ["border-style", "solid"]
                        , ["border-width", "medium"]
                        , ["border-color", "rgb(85, 154, 243)"]
                        , ["position", "relative"]
                        , ["background-color", "rgb(214, 214, 214)"]] 
                        [] 
                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]
                                    , ["height", "25px"]] 
                                    []
                                    [title]
                        , Html.div [["display", "flex"]] [] 
                                    [ Html.div [["width", "100px"]
                                                , ["background-color", "white"]] 
                                                [] 
                                                folders
                                    , files]]"""),

        ( "MyMenuItem"
        , "new MyMenuItem([title, id, onclick])"
        , """Html.div [["border-bottom", "2px solid lightgray"]
                        , ["width", "100px"]
                        , ["padding", "5px 10px"]] 
                        [["id", id]] 
                    [ Html.div [] [] [title]
                    , Html.script [] [] 
                        ["document.getElementById('" ++ id ++ "').addEventListener(
                            'click', (ev)=>{
                                " ++ onclick ++ "
                            }
                        )"]]"""),

        ( "ColorChooser"
        , "new ColorChooser([title, hint, id, destid, destattr])"
        , """Html.div   [ ["height", "150px"]
                        , ["width", "200px"]
                        , ["margin", "auto auto auto auto"]
                        , ["border-style", "solid"]
                        , ["border-width", "medium"]
                        , ["border-color", "rgb(85, 154, 243)"]
                        , ["position", "relative"]
                        , ["background-color", "rgb(214, 214, 214)"]] 
                        [ ["id", id]
                        , ["hidden", ""]]
                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]
                                    , ["height", "25px"]] 
                                    [] 
                                    [title]
                        , Html.div [] [["id", id ++ "hint"]] [hint]
                        , Html.input [] [["type", "color"], ["id", id ++ "color"]] []
                        , Html.button [] [["id", id ++ "btn"]] ["Ok"]
                        , Html.script [] [] 
                            ["document.getElementById('" ++ id ++ "btn').addEventListener(
                                'click', function(){
                                    document.getElementById('" ++ destid ++ "').style." ++ destattr ++ " = 
                                        document.getElementById('" ++ id ++ "color').value;
                                    document.getElementById('" ++ id ++ "').setAttribute('hidden', true);
                                }
                            )"]]"""),
        
        ( "Page"
        , "new Page([height, width, title, members, containers, menuBar, id, display])"
        , """Html.div   [ ["height", height]
                        , ["width", width]
                        , ["margin", "auto auto auto auto"]
                        , ["border-style", "solid"]
                        , ["border-width", "medium"]
                        , ["border-color", "rgb(85, 154, 243)"]
                        , ["position", "relative"]
                        , ["display", display]] 
                        [ ["id", id]] 
                        [ Html.div  [ ["height", "25px"]
                                    , ["text-align", "left"]] 
                                    [] 
                                    [title]
                        , Html.div [["display", "flex"]] [] 
                                    [ menuBar
                                    , Html.div [["position", "relative"]] [] members]
                        , Html.div [] [] containers]"""),

        ( "AppProg"
        , "new AppProg([pages])"
        , """Html.div [] [] pages"""),

        ( "VerticalMenuBar"
        , "new VerticalMenuBar([menu, color])"
        , """Html.div [ ["background-color", color]
                        , ["width", "100px"]
                        , ["height", "480px"]] [] menu"""),

        ( "MyButton"
        , "new MyButton([left, top, height, width, hint, color, id, onclick])"
        , """Html.div   [["background-color", color]
                        ,["height", "50px"]]
                        [["id", id]]
                        [ Html.div [] [] [hint]
                        , Html.script [] [] 
                        ["document.getElementById('" ++ id ++ "').addEventListener("
                            ++ "'click', (ev)=>{" 
                            ++ onclick 
                            ++ "})"]]"""),

        ( "ProgressBar"
        , "new ProgressBar([hint, left])"
        , """Html.div [["display", "flex"], 
                        ["margin-left", "5px"], 
                        ["margin-top", "5px"]] 
                        [] 
                        [ Html.div [] [] [hint]
                        , Html.div [["height", "20px"], 
                                    ["width", "300px"], 
                                    ["background-color", "grey"], 
                                    ["margin-left", left]] [] []]"""),

        ( "ActiveBtn"
        , "new ActiveBtn([left, top, height, width, hint])"
        , """Html.div   [ ["margin-left", left]
                        , ["height", height]
                        , ["width", width]
                        , ["border", "1px solid rgb(45,228,70)"]
                        , ["color", "rgb(45,228,70)"]] [] [hint]"""),

        ( "NActiveBtn"
        , "new NActiveBtn([left, top, height, width, hint])"
        , """Html.div   [ ["margin-left", left]
                        , ["height", height]
                        , ["width", width]
                        , ["border", "1px solid rgb(218,218,218)"]
                        , ["color", "rgb(218,218,218)"]] [] [hint]"""),                

        ( "BtnBar"
        , "new BtnBar([btns, top])"
        , """Html.div [["display", "flex"], ["margin-top", top]] [] btns"""),

        ( "LabelPage"
        , "new LabelPage([defaultoption, option, height, content])"
        , """Html.div [["display", "flex"]] []  
                    [ Html.div  [ ["background-color", "black"]
                                , ["height", height]
                                , ["width", "100px"]] [] 
                                [ Html.div  [ ["height", "50px"]
                                            , ["background-color", "rgb(45,228,70)"]
                                            , ["color", "white"]] 
                                            [] 
                                            [defaultoption]
                                , Html.div  [ ["height", "50px"]
                                            , ["background-color", "rgb(43,205,65)"]
                                            , ["color", "white"]] 
                                            [] 
                                            [option]]
                    , Html.div [] [] content]"""),

        ( "InputLabel"
        , "new InputLabel([hint, left, text])"
        , """Html.div [["display", "flex"]
                    ,  ["margin-left", "5px"]
                    ,  ["margin-top", "5px"]] 
                    [] 
                    [ Html.div [["width", "80px"]] 
                    [] 
                    [hint]
                    , Html.div [["height", "20px"], 
                                ["width", "300px"], 
                                ["border", "1px solid grey"], 
                                ["margin-left", left]] 
                                [] 
                                [text]]"""),

        ( "DBTd"
        , "new DBTd([width, text])"
        , """Html.div [["border", "1px solid rgb(212,212,212)"]
                    ,  ["width", width]] 
                    [] 
                    [text]"""),

        ( "DBTh"
        , "new DBTh([width, text])"
        , """Html.div [["border", "1px solid black"]
                    ,  ["width", width]] 
                    [] 
                    [text]"""),

        ( "DBTr"
        , "new DBTr([content])"
        , """Html.div [["display", "flex"]
                    ,  ["background-color", "white"]] 
                    [] 
                    content"""),

        ( "DBTable"
        , "new DBTable([data, height])"
        , """Html.div [["background-color", "rgb(212,212,212)"]
                    ,  ["height", height]
                    ,  ["margin-top", "10px"]] 
                    [] 
                    data"""),

        ( "CheckBtn"
        , "new CheckBtn([hint])"
        , """Html.div [["display", "flex"]] 
                        [] 
                        [ Html.input [] [["type", "checkbox"]] []
                        , Html.div [["margin-left", "10px"]] [] [hint]]"""),
        
        ( "PuzzleBtn"
        , "new PuzzleBtn([left, top, height, width, hint, id, onclick])"
        , """Html.div   [ ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["position", "absolute"]]
                        []
                        [ Html.button [["height", height],  
                                    ["width", width]] 
                                    [["id", id], 
                                    ["onclick", onclick]] 
                                    [hint]]"""),
        
        ( "MyQuestion"
        , "new MyQuestion([question, options, name, answer, hidden])"
        , """Html.div   [["margin-top", "10px"]
                        , ["visibility", hidden]] 
                        [ ["id", name]
                        , ["answer", answer]] 
                        [ Html.div [] [] [question]
                        , Html.div [["display", "flex"]] [] options]"""),
        
        ( "OnlineTest"
        , "new OnlineTest([height, width, title, members, containers, questions, next, check, hidden])"
        , """Html.div   [ ["height", height]
                        , ["width", width]
                        , ["margin", "auto auto auto auto"]
                        , ["border-style", "solid"]
                        , ["border-width", "medium"]
                        , ["border-color", "rgb(85, 154, 243)"]
                        , ["position", "relative"]
                        , ["background-color", "rgb(214, 214, 214)"]] 
                        [] 
                        [ Html.script [] [] 
                            ["cur = 0;document.getElementById('q0').style.visibility='visible';"]
                        , Html.div  [ ["background-color", "rgb(85, 154, 243)"]
                                    , ["height", "25px"]] 
                                    [] 
                                    [title]
                        , Html.div [] [] questions
                        , Html.div [] [] [next]
                        , Html.div [["visibility", hidden]] [["id", "checkbtn"]] [check]
                        , Html.div [] [] containers]"""),

        ( "ImgBtn"
        , "new ImgBtn([left, top, height, width, hint, id, onclick, imgsrc, tag])"
        , """Html.div   [ ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["position", "absolute"]]
                        []
                        [ Html.button   [ ["height", height]
                                        , ["width", width]
                                        , ["background", imgsrc]] 
                                        [ ["id", id]
                                        , ["tag", tag]
                                        , ["onclick", onclick]] []
                        ]"""),
        
        ( "Image"
        , "new Image([left, top, height, width, hint, src])"
        , """Html.div   [ ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["display", "flex"]
                        , ["position", "absolute"]]
                        []
                        [ Html.div [] [] [hint]
                        , Html.div  [ ["height", height]
                                    , ["width", width]
                                    , ["background", src]] 
                                    [] []]"""),
        
        ( "TTTBtn"
        , "new TTTBtn([left, top, height, width, hint, id, onclick, tag, bg])"
        , """Html.div   [ ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["position", "absolute"]
                        , ["background", bg]]
                        []
                        [ Html.button   [ ["height", height]
                                        , ["width", width]] 
                                        [ ["id", id]
                                        , ["tag", tag]
                                        , ["onclick", onclick]] []]"""),
        
        ( "MyLabel"
        , "new MyLabel([height, width, bgcolor, left, top, text, id, content])"
        , """Html.div   [ ["height", height]
                        , ["width", width]
                        , ["background-color", bgcolor]
                        , ["margin-left", left]
                        , ["margin-right", "auto"]
                        , ["margin-top", top]
                        , ["margin-bottom", "auto"]
                        , ["display", "flex"]]
                        []
                        [ Html.div [["text-align", "left"]] [] [text]
                        , Html.div [["text-align", "left"]] [["id", id]] [content]]"""),


        ( "WordCounter"
        , "new WordCounter([height, width, title, members, containers, lb1, lb2, ta, btns])"
        , """Html.div   [ ["height", height]
                        , ["width", width]
                        , ["margin", "auto auto auto auto"]
                        , ["border-style", "solid"]
                        , ["border-width", "medium"]
                        , ["border-color", "rgb(85, 154, 243)"]
                        , ["position", "relative"]
                        , ["background-color", "rgb(214, 214, 214)"]] 
                        [] 
                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]
                                    , ["height", "25px"]] 
                                    [] 
                                    [title]
                        , Html.div [] []    [ lb1, lb2, ta
                                            , Html.div [["position", "relative"]] [] btns]
                        , Html.div [] [] containers]""")
    ]


parseTemplates : List (String, String, String) -> Templates
parseTemplates tplt =
    case tplt of
        (cl, op, hp) :: rest ->
            let
                res1 =
                    parse op

                res2 =
                    parse hp
            in
                case (res1, res2) of
                    (Result.Ok objectPat, Result.Ok htmlPat) ->
                        {class=cl, oPat=objectPat, hPat=htmlPat} :: (parseTemplates rest)

                    (_, Result.Err info) ->
                        [{class=cl, oPat=TError "", hPat=TError (toString info)}]
                    
                    (Result.Err info, _) ->
                        [{class=cl, oPat=TError (toString info), hPat=TError ""}]

        [] ->
            []


findTemplateByClass : String -> Templates -> Maybe (ObjectPat, HtmlPat)
findTemplateByClass class temps =
    case temps of
        temp :: rest ->
            if temp.class == class then
                Just (temp.oPat, temp.hPat)
            else
                findTemplateByClass class rest

        [] -> Nothing