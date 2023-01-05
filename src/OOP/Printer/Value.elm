module OOP.Printer.Value exposing (..)

import OOP.Syntax exposing (Value(..))
import Debug exposing (toString)
import String

printValue : Value -> String
printValue v  =
    case v of
        VInt n           -> toString n
        VFloat n         -> toString n
        VTrue            -> "true"
        VFalse           -> "false"
        VChar c          -> "\'"++(String.fromChar c)++"\'"
        VString s      -> "\"" ++ s ++ "\""
        VCons v1 v2    -> "[" ++ (printList v1 v2) ++ "]"
        VNil           -> "[]"
        VClosure _ _ _ -> "<fn>"
        VFix _         -> "<fix>"
        VTuple2 v1 v2  ->
            "( "++(printValue v1)++", "++(printValue v2)++" )"
        VTuple3 v1 v2 v3->
            "( "++(printValue v1)++", "++(printValue v2)++", "++(printValue v3)++" )"
        VLoc n          -> "<"++(toString n)++">"
        VUnit           -> "_"
        VNew s arg      -> "new "++s++"("++(printValue arg)++")"
        VHtml s v1 v2 v3 -> printHTML s v1 v2 v3
        VError info    -> info


printList : Value -> Value -> String
printList v vs =
    case vs of
        VNil->
            printValue v

        VCons v1 v2 -> 
            (printValue v)++", "++(printList v1 v2)

        _ ->
            let _ = Debug.log "vs" vs in
            "Print List Error."


printHTML : String -> Value -> Value -> Value -> String
printHTML nodeName style attr childs =
    if nodeName == "br" then
        "<br>"
    else
        let
            strStyle =
                printStyle style
            
            formatStyle =
                case style of
                    VNil ->
                        ""
                    _ ->
                        " style=\"" ++ strStyle ++ "\""

            strAttr =
                printAttr attr

            strChilds =
                printChilds childs
        in
            if nodeName == "input" then
                "<" ++ nodeName ++ formatStyle ++ " " ++
                "contenteditable=\"true\" " ++ strAttr ++ "/>"
            else
                "<" ++ nodeName ++ formatStyle ++ " " ++
                "contenteditable=\"true\" " ++ strAttr ++ ">" 
                ++ strChilds ++ "</" ++ nodeName ++ ">"


printStyle : Value -> String
printStyle style =
    case style of
        VCons x VNil ->
            printProperty x

        VCons x xs ->
            let
                str1 =
                    printProperty x

                str2 =
                    printStyle xs
            in
                str1 ++ str2
                    
        _ ->
            "Print Style Error."


printProperty : Value -> String
printProperty pro =
    case pro of
        VCons s xs ->
            let
                name =
                    printString s

                value =
                    printProValues xs
            in
                name ++ ": " ++ value

        _ ->
            "Print Property Error."


printProValues : Value -> String
printProValues ls =
    case ls of
        VCons x VNil ->
            (printString x) ++ "; "
            
        
        VCons x xs ->
            (printString x) ++ " " ++ (printProValues xs)
        
        _ ->
            "Print Property Values Error."


printAttr : Value -> String
printAttr attr =
    case attr of
        VCons x VNil ->
            printOtherPro x

        VCons x xs ->
            (printOtherPro x) ++ " " ++ (printAttr xs)

        VNil ->
            ""
        
        _ ->
            "Print Attributions Error."


printOtherPro : Value -> String
printOtherPro pro =
    case pro of
        VCons n (VCons v VNil) ->
                (printString n) ++ "=\"" ++ (printString v) ++ "\" "

        _ ->
            "Print Other Property Error."


printChilds : Value -> String
printChilds childs =
    case childs of
        VNil ->
            ""

        VCons c cs ->
            case c of
                VHtml _ _ _ _ ->
                    (printValue c) ++ (printChilds cs)

                VString  _ ->
                    (printString c) ++ (printChilds cs)

                _ ->
                    "Child Type Error."
        
        _ ->
            "Print Childs Error."


printString : Value-> String
printString t =
    case t of
        VString s ->
            s

        _ ->
            "Print String Error : 01."