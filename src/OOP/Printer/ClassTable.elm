module OOP.Printer.ClassTable exposing (..)

import OOP.Syntax exposing (..)
import OOP.Printer.Term exposing (printTerm)
import OOP.Printer.Pattern exposing (printPattern)

printClassTable : ClassTable -> String
printClassTable classTable =
    case classTable of
        ([spc], classDefList) ->
            (printClassDefList classDefList) ++ spc

        ([], _) ->
            ""
        
        _ ->
            "Error : 13."


printClassDefList : List ClassDef -> String
printClassDefList classDefList =
    case classDefList of
        classDef :: classDefList_ ->
            (printClassDef classDef) ++ (printClassDefList classDefList_)
        
        [] ->
            ""


printClassDef : ClassDef -> String
printClassDef classDef =
    case classDef of
        ([spc1, spc2, spc3, spc4, spc5, spc6], ((self, father), fs,ms)) ->
            case (fs, ms) of
                (([spc7], fs_), ([], ms_)) ->
                    "Class" ++ spc1 ++ self ++ spc2 ++ "Extends" ++ spc3 ++
                    father ++ spc4 ++ "{" ++ spc5 ++ (printFields fs_) ++ ";" ++
                    spc7 ++ (printMethods ms_) ++  "}" ++ spc6
                
                (([], []), ([], ms_)) ->
                    "Class" ++ spc1 ++ self ++ spc2 ++ "Extends" ++ spc3 ++
                    father ++ spc4 ++ "{" ++ spc5 ++ (printMethods ms_) ++ "}" ++ spc6

                _ ->
                    "Error : 09."
        
        (["S"], ((self, father), _,([],ms))) ->
            "Class" ++ " " ++ self ++ " " ++ "Extends " ++ father ++ " {\n" ++
            (printMethods ms) ++ "}\n"

        (["Del"], (("",""),([],[]),([],[]))) -> ""

        _ ->
            "Error : 10."


printFields : List (WS, String, String) -> String
printFields fields =
    case fields of
        ([spc1, spc2, spc3], f, typ) :: fs ->
            f ++ spc1 ++ ":" ++ spc2 ++ typ ++ spc3 ++ (printFields fs)

        ([spc1, spc2, spc3, spc4], f, typ) :: fs ->
            "," ++ spc1 ++ f ++ spc2 ++ ":" ++ spc3 ++ typ ++ spc4 ++ (printFields fs)

        [] ->
            ""
        _ ->
            "Error : 11."


printMethods : List Method -> String
printMethods methods =
    case methods of
        ("Lift"::_, (m,p,t)) :: methods_ ->
            m ++ "(" ++ (printPattern p) ++ ") { " ++ (printTerm t) ++
            " };\n" ++ (printMethods methods_)
        
        ([spc1, spc2, spc3, spc4], (m, p, t)) :: methods_ ->
            m ++ "(" ++ (printPattern p) ++ ")" ++ spc1 ++ "{" ++ spc2 ++ 
            (printTerm t) ++ "}" ++ spc3 ++ ";" ++ spc4 ++ (printMethods methods_)

        [] ->
            ""

        _ ->
            "Error : 12."