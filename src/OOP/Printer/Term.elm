module OOP.Printer.Term exposing (..)

import OOP.Syntax exposing (..)
import Debug exposing (toString)
import OOP.Printer.Pattern exposing (printPattern)
import OOP.LangUtils exposing (splitFuncDef)

printTerm : Term -> String
printTerm term =
    case term of
        TInt [spc] n ->
            (toString n) ++ spc

        TFloat [spc] n ->
            (toString n) ++ spc

        TTrue [spc] ->
            "true" ++ spc

        TFalse [spc] ->
            "false" ++ spc

        TChar [spc] c ->
            "\'" ++ (String.fromChar c) ++ "\'" ++ spc

        TString [spc] s ->
            "\"" ++ s ++ "\"" ++ spc

        TVar ws s ->
            case ws of
                [] ->
                    if s == "main" then
                        ""
                    else
                        "Print Var Error : 01."

                [spc] ->
                    s ++ spc
                
                _ ->
                    "Print Var Error : 02."

        TLam [spc1, spc2] p t ->
            "\\" ++ spc1 ++ (printPattern p) ++ "=>" ++ spc2 ++ (printTerm t)

        TApp ws t1 t2 ->
            case ws of
                -- TCase
                [spc1, spc2] ->
                    case t1 of
                        TLam [] (PVar [] "$CASE$") (TCase [] (TVar [] "$CASE$") b) ->
                            "case" ++ spc1 ++ (printTerm t2) ++ "of" ++ spc2 ++ (printBranch b)
                        
                        _ ->
                            "Print Term Error : 02."
                
                [spc1, spc2, spc3] ->
                    case t1 of
                        (TLam [] (PVar [] "$CASE$") 
                            (TCase [] (TVar [] "$CASE$") 
                                ( BCom []
                                    (BNSin [] _ (PTrue [])  t3)
                                    (BNSin [] _ (PFalse []) t4)
                                ))) ->
                                "if" ++ spc1 ++ (printTerm t2) ++ "then" ++ spc2 ++ (printTerm t3) ++ "else" ++ spc3 ++ (printTerm t4)
                        
                        _ ->
                            "Print Term Error : 03."

                [] ->
                    (printTerm t1) ++ (printTerm t2)

                _ ->
                    "White Spaces Error : 01."

        TLet ws p t1 t2 ->
            case ws of
                [spc1, spc2, spc3] -> 
                    "let" ++ spc1 ++ (printPattern p) ++ "=" ++ spc2 ++ (printTerm t1) ++ "in" ++ spc3 ++ (printTerm t2)
                
                [spc1, spc2] ->
                    -- Equation
                    let
                        (paramList, tFunc) = splitFuncDef [] t1
                    in
                    (printPattern p) ++ (printParamList paramList) ++ "=" ++ spc1 ++ (printTerm tFunc) ++ ";;" ++ spc2 ++ (printTerm t2)
                
                _ -> 
                    "White Spaces Error : 03."

        TLetrec [spc1, spc2, spc3] p t1 t2 ->
            "letrec" ++ spc1 ++ (printPattern p) ++ "=" ++ spc2 ++ (printTerm t1) ++ "in" ++ spc3 ++ (printTerm t2)
                
        TCons [spc] t1 t2 ->
            (printTerm t1) ++ "::" ++ spc ++ (printTerm t2)

        TList ws t1 t2 ->
            case ws of
                [spc1, spc2] ->
                    "[" ++ spc1 ++ (printTerm t1) ++ (printList t2) ++ "]" ++ spc2

                _ ->
                    "White Spaces Error : 02."

        TEmpList [spc1, spc2] ->
                "[" ++ spc1 ++ "]" ++ spc2
            
        TNil [spc] ->
            "nil" ++ spc

        TTuple2 [spc1, spc2, spc3] t1 t2 ->
            "(" ++ spc1 ++ (printTerm t1) ++ "," ++ spc2 ++ (printTerm t2) ++ ")" ++ spc3

        TTuple3 [spc1, spc2, spc3, spc4] t1 t2 t3 ->
            "(" ++ spc1 ++ (printTerm t1) ++ "," ++ spc2 ++ (printTerm t2) ++ 
            "," ++ spc3 ++ (printTerm t3) ++ ")" ++ spc4

        TBPrim [spc] op t1 t2 ->
            let
                sop =
                    case op of
                        Add -> "+"
                        Sub -> "-"
                        Mul -> "*" 
                        Div -> "/"
                        RDiv -> "//"
                        Eq  -> "=="
                        Lt  -> "<"
                        Gt  -> ">"
                        Le  -> "<="
                        Ge  -> ">="
                        And -> "&&"
                        Or  -> "||"
                        Cat -> "++"
            in
                (printTerm t1) ++ sop ++ spc ++ (printTerm t2)

        TUPrim [spc] op t ->
            let
                sop =
                    case op of
                        Neg -> "-"
                        Not -> "~"
            in
                sop ++ spc ++ (printTerm t)

        TParens [spc1, spc2] t ->
            "(" ++ spc1 ++ (printTerm t) ++ ")" ++ spc2

        TRef [spc] t ->
            "ref" ++ spc ++ (printTerm t)

        TDeRef [spc] t ->
            "!" ++ spc ++ (printTerm t)

        TAssign [spc] t1 t2 ->
            (printTerm t1) ++ ":=" ++ spc ++ (printTerm t2)

        TUnit [spc] ->
            "unit" ++ spc

        TField [] t (TVar _ f) ->
            (printTerm t) ++ "." ++ f

        TInvk [] t (TVar _ m) ->
            (printTerm t) ++ "->" ++ m

        TNew [spc1, spc2, spc3] cl args ->
            "new" ++ spc1 ++ cl ++ "(" ++ spc2 ++ (printTerm args) ++ ")" ++ spc3

        TSeq [spc] t1 t2 ->
            (printTerm t1) ++ ";" ++ spc ++ (printTerm t2)

        THtml [spc1, spc2, spc3] s t1 t2 t3 ->
            "Html." ++ s ++ spc1 ++ (printTerm t1) ++ spc2 ++
            (printTerm t2) ++ spc3 ++ (printTerm t3)

        TToStr [spc] t ->
            "toString" ++ spc ++ (printTerm t)

        TMap [spc1, spc2, spc3] d f ls ->
            "map_" ++ spc1 ++ (printTerm d) ++ spc2 ++ 
            (printTerm f) ++ spc3 ++ (printTerm ls)

        TLoc [spc] n ->
            "<" ++ (toString n) ++ ">" ++ spc

        _ -> 
            "Cannot Print : " ++ (toString term)


printBranch : Branch -> String
printBranch b =
    case b of
        BNSin [spc] _ p t ->
            (printPattern p) ++ "=>" ++ spc ++ (printTerm t)

        BCom [spc] b1 b2 ->
            (printBranch b1) ++ "|" ++ spc ++ (printBranch b2)

        _ ->
            "Print Branch Error : 01."


printList : Term -> String
printList ls =
    case ls of
        TEmpList _ ->
            ""
        
        TList [spc] t1 t2 ->
            "," ++ spc ++ (printTerm t1) ++ (printList t2)
        
        TList _ t1 t2 ->
            ", " ++ (printTerm t1) ++ (printList t2)

        _ ->
            "Error : 08."


printParamList : List Pattern -> String
printParamList pls =
    case pls of
        [] -> 
            ""

        p :: pls_ ->
            (printPattern p) ++ (printParamList pls_)
