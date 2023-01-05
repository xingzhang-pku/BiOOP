module OOP.Printer.Pattern exposing (..)

import OOP.Syntax exposing (Pattern(..))
import Debug exposing (toString)

printPattern : Pattern -> String
printPattern p =
    case p of
        PVar [spc] s ->
            s ++ spc

        PCons ws p1 p2 ->
            case ws of
                [spc] ->
                    (printPattern p1) ++ "::" ++ spc ++ (printPattern p2)

                _ ->
                    "White Spaces Error : 03."
        
        PCons1 ws p1 p2 ->
            case ws of
                [spc] ->
                    (printPattern p1) ++ ":" ++ spc ++ (printPattern p2)

                _ ->
                    "White Spaces Error : 100."

        PNil [spc] ->
            "nil" ++ spc
            

        PList ws p1 p2 ->
            case ws of
                [spc1, spc2] ->
                    "[" ++ spc1 ++ (printPattern p1) ++ (printPattern p2) ++ "]" ++ spc2
                
                [spc] ->
                    "," ++ spc ++ (printPattern p1) ++ (printPattern p2)

                _ ->
                    "White Spaces Error : 04."

        PEmpList [spc1, spc2] ->
            "[" ++ spc1 ++ "]" ++ spc2
        
        PEmpList [] ->
            ""

        PInt [spc] n ->
            (toString n) ++ spc

        PFloat [spc] n ->
            (toString n) ++ spc

        PTrue [spc] ->
            "true" ++ spc

        PFalse [spc] ->
            "false" ++ spc

        PChar [spc] c ->
            "\'" ++ (String.fromChar c) ++ "\'" ++ spc

        PString [spc] s ->
            "\"" ++ s ++ "\"" ++ spc

        PBTuple [spc1, spc2, spc3] t1 t2 ->
            "(" ++ spc1 ++ (printPattern t1) ++ "," ++ spc2 ++ (printPattern t2) ++ ")" ++ spc3

        PTTuple [spc1, spc2, spc3, spc4] t1 t2 t3 ->
            "(" ++ spc1 ++ (printPattern t1) ++ "," ++ spc2 ++ (printPattern t2) ++ 
            "," ++ spc3 ++ (printPattern t3) ++ ")" ++ spc4

        PUnit [spc] ->
            "unit" ++ spc

        _ ->
            "Cannot Print : " ++ (toString p)