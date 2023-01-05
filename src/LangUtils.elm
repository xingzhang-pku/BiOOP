module LangUtils exposing (..)

import Utils exposing (..)
import Syntax exposing (..)
import Debug exposing (toString)

printAST : Expr -> String
printAST expr =
    case expr of
        EVar ([ws], _) s ->
            s ++ ws

        ELam ([ws1, ws2], _) p e ->
            "\\" ++ ws1 ++ (printPattern p) ++ "=>" ++ ws2 ++ (printAST e)

        ELam _ (PVar _ "$CASE$") e ->
            printAST e
        
        ELet ([ws1, ws2, ws3], _) p e1 e2 ->
            "let" ++ ws1 ++ (printPattern p) ++ "=" ++ ws2 ++
            (printAST e1) ++ "in" ++ ws3 ++ (printAST e2)
        
        ELetrec ([ws1, ws2, ws3], _) p e1 e2 ->
            "letrec" ++ ws1 ++ (printPattern p) ++ "=" ++ ws2 ++
            (printAST e1) ++ "in" ++ ws3 ++ (printAST e2)

        EApp ([ws1, ws2], 1) e1 e2 ->
            "case" ++ ws1 ++ (printAST e2) ++ "of" ++ ws2 ++ (printAST e1)

        EApp ([ws], 2) e1 e2 ->
            "if" ++ ws ++ (printAST e2) ++ (printAST e1)

        EApp _ e1 e2 ->
            (printAST e1) ++ (printAST e2)
        
        EInt ([ws], _) n ->
            (toString n) ++ ws
        
        EInt _ n ->
            (toString n) ++ " "
        
        EFloat ([ws], _) n ->
            (toString n) ++ ws

        EFloat _ n ->
            (toString n) ++ " "
        
        ETrue ([ws], _) ->
            "true" ++ ws
        
        ETrue _ ->
            "true "

        EFalse ([ws], _) ->
            "false" ++ ws

        EFalse _ ->
            "false "

        EChar ([ws], _) c ->
            "\'" ++ (String.fromChar c) ++ "\'" ++ ws

        EChar _ c ->
            "\'" ++ (String.fromChar c) ++ "\' "
        
        ECons (ls, kind) e1 e2 ->
            case (ls, kind) of
                ([ws1, ws2], 0) ->
                    "[" ++ ws1 ++ (printAST e1) ++
                    (printAST e2) ++ "]" ++ ws2
                
                ([ws], 1) ->
                    "," ++ ws ++ (printAST e1) ++ (printAST e2)
                
                (_, 1) ->
                    ", " ++ (printAST e1) ++ (printAST e2)
                
                ([ws], 2) ->
                    (printAST e1) ++ "::" ++ ws ++ (printAST e2)

                ([ws], 3) ->
                    case e1 of
                        EChar _ c ->
                            "\""++ (String.fromChar c) ++ (printAST e2) ++ "\"" ++ ws

                        _ -> "Print Error: 05."
                
                ([], 4) ->
                    case e1 of
                        EChar _ c ->
                            (String.fromChar c) ++ (printAST e2)

                        _ -> "Print Error: 06."

                _ ->
                    "Print Error: 04."

        ENil ([ws], 3) ->
            "\"\"" ++ ws
        
        ENil (_, 3) ->
            "\"\" "


        ENil ([ws1, ws2], _) ->
            "[" ++ ws1 ++ "]" ++ ws2

        ENil _ ->
            ""

        EHole ([ws], _) _ ->
            "_" ++ ws

        EHole _ _ ->
            "_"
        
        EBPrim ([ws], _) op e1 e2 ->
            let
                s1 =
                    printAST e1

                s2 =
                    printAST e2
                
                sop =
                    case op of
                        Add -> "+"
                        Sub -> "-"
                        Mul -> "*" 
                        Div -> "//"
                        DDiv -> "/"
                        Eq  -> "=="
                        Lt  -> "<"
                        Gt  -> ">"
                        Le  -> "<="
                        Ge  -> ">="
                        And -> "&&"
                        Or  -> "||"
                        Cat -> "++"
            in
                s1 ++ sop ++ ws ++ s2
            
        EUPrim ([ws], 0) op e ->
            let
                s =
                    printAST e
                
                sop =
                    case op of
                        Neg -> "-"
                        Not -> "!"
            in
                sop ++ ws ++ s

        ECase ([ws1, ws2], 1) _ (BCom _ (BSin _ _ e1) (BSin _ _ e2)) ->
            "then" ++ ws1 ++ (printAST e1) ++ "else" ++ ws2 ++ (printAST e2)

        ECase _ _ branch ->
            printBranch branch

        EFix _ e ->
            printAST e

        EParens ([ws1, ws2], _) e ->
            "(" ++ ws1 ++ (printAST e) ++ ")" ++ ws2

        EBTuple ([ws1, ws2, ws3], _) e1 e2 ->
            "(" ++ ws1 ++ (printAST e1) ++ "," ++ ws2 ++ (printAST e2) ++ ")" ++ ws3 

        ETTuple ([ws1, ws2, ws3, ws4], _) e1 e2 e3 ->
            "(" ++ ws1 ++ (printAST e1) ++ "," ++ ws2 ++ (printAST e2) ++
            "," ++ ws3 ++ (printAST e3) ++ ")" ++ ws4

        EHtml ([ws1, ws2, ws3], 0) s e1 e2 e3 ->
            "Html." ++ s ++ ws1 ++ (printAST e1) ++ (ws2) ++
            (printAST e2) ++ ws3 ++ (printAST e3)

        EToStr ([ws], 0) e ->
            "toString" ++ ws ++ (printAST e)

        EError info ->
            info
        
        _ -> "Print Error: 01."


printPattern : Pattern -> String
printPattern p =
    case p of
        PVar ([ws], _) s ->
            s ++ ws

        PCons (ls, kind) p1 p2 ->
            case (ls, kind) of
                ([ws1, ws2], 0) ->
                    "[" ++ ws1 ++ (printPattern p1) ++
                    (printPattern p2) ++ "]" ++ ws2
                
                ([ws], 1) ->
                    "," ++ ws ++ (printPattern p1) ++ (printPattern p2)
                
                ([ws], 2) ->
                    (printPattern p1) ++ "::" ++ ws ++ (printPattern p2)

                ([ws], 3) ->
                    case p1 of
                        PChar _ c ->
                            "\""++ (String.fromChar c) ++ (printPattern p2) ++ "\"" ++ ws

                        _ -> "Print Error: 08."
                
                ([], 4) ->
                    case p1 of
                        PChar _ c ->
                            (String.fromChar c) ++ (printPattern p2)

                        _ -> "Print Error: 09."

                _ ->
                    "Print Error: 02."
    
        PNil ([ws1, ws2], _) ->
            "[" ++ ws1 ++ "]" ++ ws2

        PNil ([ws], 3) ->
            "\"\"" ++ ws

        PNil (_, 3) ->
            "\"\" "

        PNil _ ->
            ""

        PInt ([ws], _) n ->
            (toString n) ++ ws
        
        PFloat ([ws], _) n ->
            (toString n) ++ ws
        
        PTrue ([ws], _) ->
            "true" ++ ws
        
        PFalse ([ws], _) ->
            "false" ++ ws

        PChar ([ws], _) c ->
            (String.fromChar c) ++ ws

        PBTuple ([ws1, ws2, ws3], _) p1 p2 ->
            "(" ++ ws1 ++ (printPattern p1) ++ "," ++ ws2 ++ (printPattern p2) ++ ")" ++ ws3 

        PTTuple ([ws1, ws2, ws3, ws4], _) p1 p2 p3 ->
            "(" ++ ws1 ++ (printPattern p1) ++ "," ++ ws2 ++ (printPattern p2) ++
            "," ++ ws3 ++ (printPattern p3) ++ ")" ++ ws4

        _ ->
            "Print Error: 03."


printBranch : Branch -> String
printBranch b =
    case b of
        BSin ([ws], _) p e ->
            (printPattern p) ++ "=>" ++ ws ++ (printAST e)

        BCom ([ws], _) b1 b2 ->
            (printBranch b1) ++ "|" ++ ws ++ (printBranch b2)

        _ ->
            "Print Error: 05."


processBeforePrint : Expr -> List String -> Int -> HEnv -> (Expr, Int, HEnv)
processBeforePrint expr env holeID henv =
    case expr of
        EHole ws (HOri u) ->
            (EHole ws (HOri u), holeID+1, changeHoleID henv u holeID)

        EVar ws s ->   
            (EVar ws s, holeID, henv)

        ELam ws pat body ->
            let 
                (body_, holeID_, henv_) =
                    processBeforePrint body env holeID henv
            in
                (ELam ws pat body_, holeID_, henv_)

        ELet ws pat e1 e2 ->
            let
                (e1_, holeID_, henv_) =
                    processBeforePrint e1 env holeID henv
                
                (e2_, holeID__, henv__) =
                    processBeforePrint e2 env holeID_ henv_
            in
                (ELet ws pat e1_ e2_, holeID__, henv__)

        ELetrec ws pat e1 e2 ->
            let

                (e1_, holeID_, henv_) =
                    processBeforePrint e1 env holeID henv
                
                (e2_, holeID__, henv__) =
                    processBeforePrint e2 env holeID_ henv_
            in
                (ELetrec ws pat e1_ e2_, holeID__, henv__)

        EApp ws e1 e2 ->
            let 
                (e1_, holeID_, henv_) = 
                    processBeforePrint e1 env holeID henv
            
                (e2_, holeID__, henv__) = 
                    processBeforePrint e2 env holeID_ henv_
            in
                (EApp ws e1_ e2_, holeID__, henv__)

        ECons ws e1 e2 ->
            let 
                (e1_, holeID_, henv_) = 
                    processBeforePrint e1 env holeID henv
            
                (e2_, holeID__, henv__) = 
                    processBeforePrint e2 env holeID_ henv_
            in
                (ECons ws e1_ e2_, holeID__, henv__)

        EBPrim ws op e1 e2 ->
            let 
                (e1_, holeID_, henv_) = 
                    processBeforePrint e1 env holeID henv
            
                (e2_, holeID__, henv__) = 
                    processBeforePrint e2 env holeID_ henv_
            in
                (EBPrim ws op e1_ e2_, holeID__, henv__)

        EUPrim ws op e ->
            let 
                (e_, holeID_, henv_) = 
                    processBeforePrint e env holeID henv
            in
                (EUPrim ws op e_, holeID_, henv_)

        ECase ws e branch ->
            let 
                (e_, holeID_, henv_) = 
                    processBeforePrint e env holeID henv
                
                (branch_, holeID__, henv__) = 
                    processBranchesBeforePrint branch env holeID_ henv_
            in
                (ECase ws e_ branch_, holeID__, henv__)
        
        EFix ws e ->
            let 
                (e_, holeID_, henv_) = 
                    processBeforePrint e env holeID henv
            in
                (EFix ws e_, holeID_, henv_)

        EParens ws e ->
            let 
                (e_, holeID_, henv_) = 
                    processBeforePrint e env holeID henv
            in
                (EParens ws e_, holeID_, henv_)

        EBTuple ws e1 e2 ->
            let 
                (e1_, holeID_, henv_) = 
                    processBeforePrint e1 env holeID henv
            
                (e2_, holeID__, henv__) = 
                    processBeforePrint e2 env holeID_ henv_
            in
                (EBTuple ws e1_ e2_, holeID__, henv__)

        ETTuple ws e1 e2 e3 ->
            let 
                (e1_, holeID1, henv1) = 
                    processBeforePrint e1 env holeID henv
            
                (e2_, holeID2, henv2) = 
                    processBeforePrint e2 env holeID1 henv1

                (e3_, holeID3, henv3) = 
                    processBeforePrint e3 env holeID2 henv2
            in
                (ETTuple ws e1_ e2_ e3_, holeID3, henv3)

        EHtml ws s e1 e2 e3 ->
            let 
                (e1_, holeID1, henv1) = 
                    processBeforePrint e1 env holeID henv
            
                (e2_, holeID2, henv2) = 
                    processBeforePrint e2 env holeID1 henv1

                (e3_, holeID3, henv3) = 
                    processBeforePrint e3 env holeID2 henv2
            in
                (EHtml ws s e1_ e2_ e3_, holeID3, henv3)

        EToStr ws e ->
            let
                (e_, holeID_, henv_) = 
                    processBeforePrint e env holeID henv
            in
                (EToStr ws e_, holeID_, henv_)

        _ ->
            (expr, holeID, henv)


changeHoleID : HEnv -> Int -> Int -> HEnv
changeHoleID henv old new =
    case henv of
        (HOri n, venv, v) :: hv ->
            if n == old then
                (HOri new, venv, v) :: (changeHoleID hv old new)
            else
                (HOri n, venv, v) :: (changeHoleID hv old new)
        
        _ ->
            []


processBranchesBeforePrint : Branch -> List String -> Int -> HEnv -> (Branch, Int, HEnv)
processBranchesBeforePrint b env holeID henv =
    case b of
        BNSin ws _ pat e ->
            let 
                (e_, holeID_, henv_) = 
                    processBeforePrint e env holeID  henv
            in
                (BSin ws pat e_, holeID_, henv_)

        BCom ws b1 b2 ->
            let 
                (b1_, holeID_, henv_) = 
                    processBranchesBeforePrint b1 env holeID henv

                (b2_, holeID__, henv__) = 
                    processBranchesBeforePrint b2 env holeID_ henv_
            in
                (BCom ws b1_ b2_, holeID__, henv__)

        BSin _ _ _ -> (b, holeID, henv)


processAfterParse : Expr -> List String -> Int -> (Expr, Int)
processAfterParse expr env holeID =
    case expr of

        EHole ws (HInter _) ->
            (EHole ws (HOri holeID), holeID+1)

        EVar ws s ->
            (EVar ws s, holeID)

        ELam ws pat body ->
            let 
                (body_, holeID_) = 
                    processAfterParse body env holeID 
            in
                (ELam ws pat body_, holeID_)

        ELet ws pat e1 e2 ->
            let
                (e1_, holeID_) =
                    processAfterParse e1 env holeID
                
                (e2_, holeID__) =
                    processAfterParse e2 env holeID_
            in
                (ELet ws pat e1_ e2_, holeID__)

        ELetrec ws pat e1 e2 ->
            let
                (e1_, holeID_) =
                    processAfterParse e1 env holeID
                
                (e2_, holeID__) =
                    processAfterParse e2 env holeID_
            in
                (ELetrec ws pat e1_ e2_, holeID__)

        EApp ws e1 e2 ->
            let 
                (e1_, holeID_) = 
                    processAfterParse e1 env holeID 

                (e2_, holeID__) = 
                    processAfterParse e2 env holeID_
            in
                (EApp ws e1_ e2_, holeID__)

        ECons ws e1 e2 ->
            let 
                (e1_, holeID_) = 
                    processAfterParse e1 env holeID 

                (e2_, holeID__) =
                    processAfterParse e2 env holeID_
            in
                (ECons ws e1_ e2_, holeID__)

        EBPrim ws op e1 e2 ->
            let 
                (e1_, holeID_) = 
                    processAfterParse e1 env holeID 

                (e2_, holeID__) = 
                    processAfterParse e2 env holeID_
            in
                (EBPrim ws op e1_ e2_, holeID__)

        EUPrim ws op e ->
            let 
                (e_, holeID_) = 
                    processAfterParse e env holeID 
            in
                (EUPrim ws op e_, holeID_)

        ECase ws e branch ->
            let 
                (e_, holeID_) = 
                    processAfterParse e env holeID 

                (branch_, _, holeID__) = 
                    numberBranches branch env 0 holeID_ 
            in
                (ECase ws e_ branch_, holeID__)
        
        EFix ws e ->
            let 
                (e_, holeID_) =
                    processAfterParse e env holeID
            in
                (EFix ws e_, holeID_)

        EParens ws e ->
            let 
                (e_, holeID_) = 
                    processAfterParse e env holeID 
            in
                (EParens ws e_, holeID_)

        EBTuple ws e1 e2 ->
            let 
                (e1_, holeID_) = 
                    processAfterParse e1 env holeID 
                
                (e2_, holeID__) = 
                    processAfterParse e2 env holeID_
            in
                (EBTuple ws e1_ e2_, holeID__)

        ETTuple ws e1 e2 e3 ->
            let 
                (e1_, holeID1) = 
                    processAfterParse e1 env holeID 

                (e2_, holeID2) = 
                    processAfterParse e2 env holeID1

                (e3_, holeID3) = 
                    processAfterParse e3 env holeID2
            in
                (ETTuple ws e1_ e2_ e3_, holeID3)

        EHtml ws s e1 e2 e3 ->
            let 
                (e1_, holeID1) = 
                    processAfterParse e1 env holeID 

                (e2_, holeID2) = 
                    processAfterParse e2 env holeID1

                (e3_, holeID3) = 
                    processAfterParse e3 env holeID2
            in
                (EHtml ws s e1_ e2_ e3_, holeID3)

        EToStr ws e ->
            let
                (e_, holeID_) =
                    processAfterParse e env holeID
            in
                (EToStr ws e_, holeID_)

        _ -> (expr, holeID)


numberBranches : Branch -> List String -> Int -> Int -> (Branch, Int, Int)
numberBranches b env n holeID =
    case b of
        BSin ws pat e ->           
            let 
                (e_, holeID_) = 
                    processAfterParse e env holeID 
            in
                (BNSin ws n pat e_, n+1, holeID_)

        BCom ws b1 b2 ->
            let 
                (b1_, n1, holeID_) = 
                    numberBranches b1 env n holeID 

                (b2_, n2, holeID__) = 
                    numberBranches b2 env n1 holeID_
            in
                (BCom ws b1_ b2_, n2, holeID__)

        BNSin _ _ _ _ -> (b, n, holeID)


match : Pattern -> Value -> VEnv
match pat val =
    case (pat, val) of
        ((PCons _ p1 p2), (VHole u env)) ->
            let 
                res1 = 
                    match p1 (VHole (HField u (HId 1)) env)
                
                res2 =
                    match p2 (VHole (HField u (HId 2)) env)
            in
            if res1 == [("ERROR", VError "Match Failed.")] ||
                res2 == [("ERROR", VError "Match Failed.")]
            then 
                [("ERROR", VError "Match Failed.")]
            else
                res1++res2

        ((PBTuple _ p1 p2), (VHole u env)) ->
            let 
                res1 = 
                    match p1 (VHole (HField u (HId 1)) env)
                
                res2 =
                    match p2 (VHole (HField u (HId 2)) env)
            in
            if res1 == [("ERROR", VError "Match Failed.")] ||
                res2 == [("ERROR", VError "Match Failed.")]
            then 
                [("ERROR", VError "Match Failed.")]
            else
                res1++res2

        ((PTTuple _ p1 p2 p3), (VHole u env)) ->
            let 
                res1 = 
                    match p1 (VHole (HField u (HId 1)) env)
                
                res2 =
                    match p2 (VHole (HField u (HId 2)) env)

                res3 =
                    match p3 (VHole (HField u (HId 3)) env)
            in
            if res1 == [("ERROR", VError "Match Failed.")] ||
                res2 == [("ERROR", VError "Match Failed.")] ||
                res2 == [("ERROR", VError "Match Failed.")]
            then 
                [("ERROR", VError "Match Failed.")]
            else
                res1++res2++res3

        ((PCons _ p1 p2), (VCons _ v vs)) ->
            let
                res1 = 
                    match p1 v

                res2 =
                    match p2 vs
            in
            if res1 == [("ERROR", VError "Match Failed.")] ||
                res2 == [("ERROR", VError "Match Failed.")]
            then 
                [("ERROR", VError "Match Failed.")]
            else
                res1++res2

        ((PBTuple _ p1 p2), (VBTuple v1 v2)) ->
            let
                res1 = 
                    match p1 v1

                res2 =
                    match p2 v2
            in
            if res1 == [("ERROR", VError "Match Failed.")] ||
                res2 == [("ERROR", VError "Match Failed.")]
            then 
                [("ERROR", VError "Match Failed.")]
            else
                res1++res2
        
        ((PTTuple _ p1 p2 p3), (VTTuple v1 v2 v3)) ->
            let
                res1 = 
                    match p1 v1

                res2 =
                    match p2 v2

                res3 =
                    match p3 v3
            in
            if res1 == [("ERROR", VError "Match Failed.")] ||
                res2 == [("ERROR", VError "Match Failed.")] ||
                res3 == [("ERROR", VError "Match Failed.")]
            then 
                [("ERROR", VError "Match Failed.")]
            else
                res1++res2++res3

        ((PInt _ n1), (VInt n2)) ->
            if n1 == n2 then [] else [("ERROR", VError "Match Failed.")]
        ((PInt _ _), VHole _ _) -> []

        ((PFloat _ n1), (VFloat n2)) ->
            if n1 == n2 then [] else [("ERROR", VError "Match Failed.")]
        ((PFloat _ _), VHole _ _) -> []

        (PTrue _,  VTrue)     -> []
        (PTrue _, VHole _ _)  -> []
        (PFalse _, VFalse)    -> []
        (PFalse _, VHole _ _) -> []

        (PChar _ c1, VChar c2) ->
            if c1 == c2 then [] else [("ERROR", VError "Match Failed.")]
        (PChar _ _, VHole _ _) -> []
        
        (PNil _, VNil _)    -> []
        (PNil _, VHole _ _) -> []

        (PVar _ s, v) -> [(s, v)]

        _ -> [("ERROR", VError "Match Failed.")]


print : Value -> (String, List Value)
print v  =
    case v of
        VInt n           -> (toString n, [])
        VFloat n         -> (toString n, [])
        VTrue            -> ("true", [])
        VFalse           -> ("false", [])
        VChar c          -> ("\'"++(String.fromChar c)++"\'", [])
        VNil 0           -> ("[]", [])
        VNil 1           -> ("\"\"", [])
        VNil _           -> ("Print Value Error: 04.", [])
        VCons 0 v1 v2    -> ("[ " ++ (printList v1 v2), [])

        VCons 1 v1 v2    -> 
            case v1 of
                VChar c ->
                    ("\"" ++  (String.fromChar c) ++ (printString v2), [])
                
                _ ->
                    ("Print Value Error: 02.", [])
        
        VCons _ _ _      -> ("Print Value Error: 01.", [])
        VHole hn _       -> ("{ "++(printHoleName hn)++" }", [])
        IndexedHole hn _ -> ("{ "++(printHoleName hn)++" }", [])
        VError info    -> (info, [])
        VClosure _ _ _ -> ("<fn>", [])
        VFix _         -> ("<fix>", [])
        VBTuple v1 v2    -> 
            let
                (str1, _) =
                    print v1
                
                (str2, _) =
                    print v2
            in
            ("( "++str1++", "++str2++" )", [])
        VTTuple v1 v2 v3 ->
            let
                (str1, _) =
                    print v1
                
                (str2, _) =
                    print v2

                (str3, _) =
                    print v3
            in
            ("( "++str1++", "++str2++", "++str3++" )", [])
        VHtml s v1 v2 v3 -> printHTML s v1 v2 v3


printHoleName : HoleName -> String
printHoleName hn =
    case hn of
        HField hn_ (HId n) -> (printHoleName hn_)++"·"++(toString n)
        HInst hn_ n        -> (printHoleName hn_)++"_"++(toString n)
        HInter n           -> "*"++(toString n)
        HOri n             -> toString n 
        _                  -> "Print HoleName Error."


printList : Value -> Value -> String
printList v vs =
    case vs of
        VNil 0->
            (Tuple.first <| print v)++" ]"

        VCons _ v1 v2 -> 
            (Tuple.first <| print v)++", "++(printList v1 v2)

        _ -> ""

printString : Value -> String
printString v =
    case v of
        VNil 1 ->
            "\""
        
        VCons _ (VChar c) v2 ->
            (String.fromChar c) ++ (printString v2)

        _ ->
            "Print Value Error: 03."


collectUniqueContext : Value -> List Value
collectUniqueContext val =
    unique (collectContext val)


collectContext : Value -> List Value
collectContext val =
    case val of
        VCons _ v1 v2 -> 
            collectContext v1 ++ collectContext v2

        VBTuple v1 v2 -> 
            collectContext v1 ++ collectContext v2

        VTTuple v1 v2 v3 -> 
            collectContext v1 ++ collectContext v2 ++ collectContext v3
        
        VHole hn venv ->
            let 
                venv_ = 
                    addIndexToVenv 0 venv 
            in
                [IndexedHole hn venv_]

        _ -> []


addIndexToVenv : Int -> List (String, Value) -> List (Int, String, Value)
addIndexToVenv  n venv =
    case venv of
        (s, v)::vs ->
            case v of
                VHole hn venv1 ->
                    let 
                        venv2 = 
                            addIndexToVenv 0 venv1
                    in
                        (n, s, IndexedHole hn venv2)::(addIndexToVenv (n+1) vs)
                _ -> (n, s, v)::(addIndexToVenv (n+1) vs)
        [] -> []


elemInContext : Value -> List Value -> Bool
elemInContext v context =
    case v of
        IndexedHole hn _ ->
            case context of
                (IndexedHole hn_ _)::ct ->
                    if hn == hn_
                    then True
                    else elemInContext v ct
                _ -> False
        _ -> False


unique : List Value -> List Value
unique context =
    case context of
        [] -> []

        v::vs ->
            let 
                rest = unique vs 
            in
            if elemInContext v rest then
                rest
            else
                v::rest


findHole : HoleName -> List Value -> Maybe Value
findHole u context =
    case context of

        (IndexedHole hn venv)::ct ->
            if hn == u
            then Just (IndexedHole hn venv)
            else findHole u ct
        
        _ -> Nothing


updateElmInVenv : String -> Value -> VEnv -> VEnv
updateElmInVenv s v venv =
    case venv of
        [] -> []

        (s1, v1) :: vv ->
            if s1 == s then
                (s1, v) :: vv
            else
                (s1, v1) :: (updateElmInVenv s v vv)


mergeVEnv : VEnv -> VEnv -> VEnv -> VEnv
mergeVEnv venv1 venv2 venv3 =

    case (venv1, venv2, venv3) of

        ((s1, v1)::env1, (s2, v2)::env2, (_, v3)::env3) ->
            case (v1, v3) of
                (VClosure _ b1 _, VFix (ELam _ _ (ELam _ _ b2))) ->
                    if (b1 /= b2) 
                    then (s1, v1) :: mergeVEnv env1 env2 env3
                    else (s2, v2) :: mergeVEnv env1 env2 env3

                _ ->
                    if (v1 /= v3) 
                    then (s1, v1) :: mergeVEnv env1 env2 env3
                    else (s2, v2) :: mergeVEnv env1 env2 env3
        
        _ -> []


mergeVEnv4 : VEnv -> VEnv -> VEnv -> VEnv -> VEnv
mergeVEnv4 venv1 venv2 venv3 venv4 =

    case ((venv1, venv2, venv3), venv4) of

        (((s1, v1)::env1, (s2, v2)::env2, (s3, v3)::env3), (_, v4)::env4) ->
            case (v1, v4) of
                (VClosure _ b1 _, VFix (ELam _ _ (ELam _ _ b2))) ->
                    if (b1 /= b2) 
                    then (s1, v1) :: mergeVEnv4 env1 env2 env3 env4
                    else (s2, v2) :: mergeVEnv4 env1 env2 env3 env4
                _ ->
                    if (v1 /= v4) then
                        (s1, v1) :: mergeVEnv4 env1 env2 env3 env4
                    else
                        case (v2, v4) of
                            (VClosure _ b1 _, VFix (ELam _ _ (ELam _ _ b2))) ->
                                if (b1 /= b2) 
                                then (s2, v2) :: mergeVEnv4 env1 env2 env3 env4
                                else (s3, v3) :: mergeVEnv4 env1 env2 env3 env4
                            _ ->
                                if (v2 /= v4) then
                                    (s2, v2) :: mergeVEnv4 env1 env2 env3 env4
                                else
                                    (s3, v3):: mergeVEnv4 env1 env2 env3 env4

        _ -> []


getElem : HoleName -> VEnv -> HEnv -> (Value, HEnv)
getElem hn venv henv =
    case henv of
        (hn1, venv1, v1)::henv1 ->
            if hn == hn1 && venv == venv1 then
                (v1, henv1)
            else
                let
                    (resv, reshenv) =
                        getElem hn venv henv1
                in
                (resv, (hn1, venv1, v1)::reshenv)
        
        
        _ -> (VError "", [])


elemIn : HoleName -> VEnv -> HEnv -> Bool
elemIn hn venv henv =
    case henv of
        (hn1, venv1, _)::henv_ ->
            if hn == hn1 && venv == venv1 then
                True
            else
                elemIn hn venv henv_
        
        _ -> False


union : HEnv -> HEnv -> HEnv
union henv1 henv2 =
    case henv2 of
        (hn2, venv2, v2)::henv2_ ->
            if elemIn hn2 venv2 henv1 then
                union henv1 henv2_
            else
                (hn2, venv2, v2)::(union henv1 henv2_)

        _ -> henv1


mergeHEnv3 : HEnv -> HEnv -> HEnv -> HEnv
mergeHEnv3 henv henv1 henv2 =
    case henv of
        (hn, venv, v) :: henv_ ->
            let
                (v1, henv1_) =
                    getElem hn venv henv1

                (v2, henv2_) =
                    getElem hn venv henv2

                newE1 =
                    (hn, venv, v1)

                newE2 =
                    (hn, venv, v2)

                resMerge = 
                    mergeHEnv3 henv_ henv1_ henv2_
            in
            case v1 of
                VError _ ->
                    newE2 :: resMerge
                _ ->
                    if v1 /= v then
                        newE1 :: resMerge
                    else 
                        newE2 :: resMerge

        [] -> union henv1 henv2


mergeHEnv4 : HEnv -> HEnv -> HEnv -> HEnv -> HEnv
mergeHEnv4 henv henv1 henv2 henv3 =
    case henv of
        (hn, venv, v) :: henv_ ->
            let
                (v1, henv1_) =
                    getElem hn venv henv1

                (v2, henv2_) =
                    getElem hn venv henv2

                (v3, henv3_) =
                    getElem hn venv henv3

                newE1 =
                    (hn, venv, v1)

                newE2 =
                    (hn, venv, v2)

                newE3 =
                    (hn, venv, v3)

                resMerge = 
                    mergeHEnv4 henv_ henv1_ henv2_ henv3_
            in
            case v1 of
                VError _ ->
                    newE2 :: resMerge
                _ ->
                    if v1 /= v then
                        newE1 :: resMerge
                    else if v2 /= v then
                        newE2 :: resMerge
                    else
                        newE3 :: resMerge

        [] -> union (union henv1 henv2) henv3


patternSubst : VEnv -> Pattern -> Value
patternSubst env p = 
    case p of
        PVar _ s ->
            case findVarByName s env of
                Just val ->
                    val
                
                Nothing  ->
                    VError "Pattern Substitution Error: 01."
        
        PCons (_, id) p1 p2 ->
            if id == psQuo || id == psElm then
                VCons vsId (patternSubst env p1) (patternSubst env p2)
            else
                VCons voId (patternSubst env p1) (patternSubst env p2)

        PBTuple _ p1 p2 ->
            VBTuple (patternSubst env p1) (patternSubst env p2)

        PTTuple _ p1 p2 p3 ->
            VTTuple (patternSubst env p1) 
                    (patternSubst env p2)
                    (patternSubst env p3)
        
        PNil (_, id) -> 
            if id == 3 || id == 4 then
                VNil 1
            else
                VNil 0

        PInt _ n     -> VInt n
        PFloat _ n   -> VFloat n
        PTrue _      -> VTrue
        PFalse _     -> VFalse
        PChar _ c    -> VChar c


matchCase : Value -> Branch -> MatchCaseRes
matchCase v b =
    case b of
        BNSin _ n p e ->
            { venvm  = match p v
            , choice = n
            , ei = e
            , pi = p
            }

        BCom _ b1 b2 ->
            let 
                res = 
                    matchCase v b1 
            in
                case res.venvm of
                    [(_, VError _)] ->
                        matchCase v b2
                    
                    _ -> res
        
        _ ->
            { venvm  = []
            , choice = 0
            , ei = EError "Match Case Error."
            , pi = PNil defaultWS
            }


updateBranch : Branch -> Int -> Expr -> Branch
updateBranch branch choice e =
    case branch of
        BNSin ws n p expr ->
            if choice == n
            then BNSin ws n p e
            else BNSin ws n p expr

        BCom ws b1 b2 ->
            BCom ws (updateBranch b1 choice e) (updateBranch b2 choice e)
        
        b -> b


valueToExpr : Value -> HTotal -> (Expr, HTotal)
valueToExpr v htotal =
    case v of
        VNil id ->
            case id of
                0 ->
                    (ENil defaultWS, htotal)

                1 ->
                    (ENil defaultWS, htotal)
                
                _ ->
                    (EError "VNil Error", 0)
        VInt n ->
            (EInt defaultWS n, htotal)

        VFloat n ->
            (EFloat defaultWS n, htotal)

        VTrue ->
            (ETrue defaultWS, htotal)

        VFalse ->
            (EFalse defaultWS, htotal)

        VChar c ->
            (EChar defaultWS c, htotal)

        VCons _ v1 v2 ->
            let
                (e1, htotal1) =
                    valueToExpr v1 htotal

                (e2, htotal2) =
                    valueToExpr v2 htotal1
            in
                (ECons defaultWS e1 e2, htotal2)

        VBTuple v1 v2 ->
            let
                (e1, htotal1) =
                    valueToExpr v1 htotal

                (e2, htotal2) =
                    valueToExpr v2 htotal1
            in
                (EBTuple defaultWS e1 e2, htotal2)

        VTTuple v1 v2 v3 ->
            let
                (e1, htotal1) =
                    valueToExpr v1 htotal

                (e2, htotal2) =
                    valueToExpr v2 htotal1

                (e3, htotal3) =
                    valueToExpr v3 htotal2
            in
                (ETTuple defaultWS e1 e2 e3, htotal3)

        VHole _ _ ->
            (EHole defaultWS (HOri htotal), htotal+1)

        _ ->
            (EError ("Can Not Transfer Value: "++(toString v)++" To Expression.")
            , htotal)


insert : (HoleName, VEnv, Value) -> HEnv -> HEnv
insert (u, venv, v) henv =
    case henv of
        [] -> [(u, venv, v)]

        (u1, venv1, v1)::hv ->
            if u1 == u && venv1 == venv
            then (u1, venv1, v)::hv
            else (u1, venv1, v1)::(insert (u, venv, v) hv)


removeIndex : List Value -> List Value
removeIndex context =
    case context of

        (IndexedHole hn venv)::ct ->
            let 
                venv1 = 
                    removeIndexFromVenv venv 
            in
                (VHole hn venv1)::(removeIndex ct)
        
        _ -> []


removeIndexFromVenv : IndexedVEnv -> VEnv
removeIndexFromVenv venv =
    case venv of
        (_, s, v)::vs -> 
            case v of
                IndexedHole hn venv1 ->
                    let 
                        venv2 =
                            removeIndexFromVenv venv1 
                    in
                        (s, VHole hn venv2)::(removeIndexFromVenv vs)
                _ -> (s, v)::(removeIndexFromVenv vs)
        _ -> []


findVarByName : String -> VEnv -> Maybe Value
findVarByName s venv =
    case venv of
        [] -> Nothing

        (s1, v1) :: vv ->
            if s1 == s then
                Just v1
            else
                findVarByName s vv


append : Value -> Value -> Value
append l1 l2 =
    case l1 of
        VNil _ ->
            l2

        VCons id1 v1 vs1 ->
            VCons id1 v1 (append vs1 l2)

        _ ->
            VError "List Concat Error."


vlength : Value -> Int
vlength v =
    case v of
        VNil _ ->
            0

        VCons _ _ vs ->
            1 + (vlength vs)
        
        _ ->
            -1


deAppend : Value -> Int -> (Value, Value)
deAppend nl n1 =
    case (nl, n1) of
        (VCons nid _ _, 0) ->
            (VNil nid, nl)
        
        (VCons nid v1 vs, _) ->
            let
                (l1, l2) =
                    deAppend vs (n1 - 1)
            in
                (VCons nid v1 l1, l2)

        (VNil nid, _) ->
            (VNil nid, VNil nid)
        
        _ ->
            ( VError "New Value for Updating Concat Type Error"
            , VError "")


changeWsForList : WS -> Expr -> Expr
changeWsForList ws expr =
    case expr of
        ENil _ ->
            ENil ws

        ECons _ e1 e2 ->
            ECons ws e1 e2

        _ ->
            EError "Impossible!"


lengthUntil : String -> VEnv -> Int
lengthUntil s venv =
    case venv of
        [] -> -1

        (s1, _) :: vv ->
            if s == s1 then
                0
            else
                1 + (lengthUntil s vv)


printHTML : String -> Value -> Value -> Value -> (String, List Value)
printHTML nodeName style attr childs =
    let

        (ststr, stctx) =
            printStyle style
        
        st =
            case style of
                VHole _ _ ->
                    "Print Style Error: 01."

                VNil 0 ->
                    ""
                _ ->
                    " style=\"" ++ ststr ++ "\""

        (at, atctx) =
            printAttr attr

        (cd, cdctx) =
            printChilds childs
    in
        ("<" ++ nodeName ++ st ++" " ++
        "contenteditable=\"true\" " ++ at ++ ">" ++ cd ++
        "</" ++ nodeName ++ ">", stctx ++ atctx ++ cdctx)


printStyle : Value -> (String, List Value)
printStyle style =
    case style of
        VCons 0 x (VNil 0) ->
            printProperty x

        VCons 0 x xs ->
            let
                (str1, ctx1) =
                    printProperty x

                (str2, ctx2) =
                    printStyle xs
            in
                (str1 ++ str2, ctx1 ++ ctx2)

        VHole hn venv ->
            let 
                venv_ = 
                    addIndexToVenv 0 venv 
            in
                ("{"++(printHoleName hn)++"}", [IndexedHole hn venv_])
                    
        _ ->
            ("Print Style Error: 02.", [])


printProperty : Value -> (String, List Value)
printProperty p =
    case p of
        VCons 0 s xs ->
            let
                (str1, _) =
                    printStrNoQuoOrHole s

                (str2, ctx2) =
                    printProValues xs
            in
                (str1 ++ ": " ++ str2, ctx2)

        VHole hn venv ->
            let 
                venv_ = 
                    addIndexToVenv 0 venv 
            in
                ("{"++(printHoleName hn)++"}", [IndexedHole hn venv_])

        _ ->
            ("Print Property Error.", [])


printStrNoQuoOrHole : Value -> (String, List Value)
printStrNoQuoOrHole s =
    case s of
        VHole hn venv ->
            let 
                venv_ = 
                    addIndexToVenv 0 venv 
            in
                ("{"++(printHoleName hn)++"}", [IndexedHole hn venv_])

        VCons 1 (VChar c) cs ->
            let
                (res, _) =
                    printStrNoQuoOrHole cs
            in
            ((String.fromChar c) ++ res, [])

        VNil 1 ->
            ("", [])

        _ ->
            ("Print String Without Quotation Marks Error.", [])


printProValues : Value -> (String, List Value)
printProValues ls =
    case ls of
        VCons 0 x (VNil 0) ->
            let
                (str, ctx) =
                    printStrNoQuoOrHole x
            in
                (str ++ "; ", ctx)
        
        VCons 0 x xs ->
            let
                (str1, ctx1) =
                    printStrNoQuoOrHole x

                (str2, ctx2) =
                    printProValues xs
            in
            (str1 ++ " " ++ str2, ctx1 ++ ctx2)
        
        _ ->
            ("Print Property Values Error.", [])


printAttr: Value -> (String, List Value)
printAttr attr =
    case attr of
        VCons 0 x (VNil 0) ->
            (printOtherPro x)

        VCons 0 x xs ->
            let
                (str1, ctx1) =
                    printOtherPro x

                (str2, ctx2) =
                    printAttr xs
            in
                (str1 ++ " " ++ str2, ctx1 ++ ctx2)

        VNil 0 ->
            ("", [])
        
        _ ->
            ("Print Attributions Error.", [])


printOtherPro : Value -> (String, List Value)
printOtherPro p =
    case p of
        VCons 0 n (VCons 0 v (VNil 0)) ->
            let
                (str1, _) =
                    printStrNoQuoOrHole n

                (str2, ctx2) =
                    printStrNoQuoOrHole v 
            in
                (str1 ++ "=\"" ++ str2 ++ "\" ", ctx2)

        VHole hn venv ->
            let 
                venv_ = 
                    addIndexToVenv 0 venv 
            in
                ("{"++(printHoleName hn)++"}", [IndexedHole hn venv_])

        _ ->
            ("Print Property Error.", [])


printChilds : Value -> (String, List Value)
printChilds childs =
    case childs of
        VNil 0 ->
            ("", [])

        VCons 0 c cs ->
            case c of
                VHtml _ _ _ _ ->
                    let
                        (str1, ctx1) =
                            print c

                        (str2, ctx2) =
                            printChilds cs
                    in
                        (str1 ++ str2, ctx1 ++ ctx2)

                VHole hn venv ->
                    let 
                        venv_ = 
                            addIndexToVenv 0 venv

                        hole =
                            "<span style=\"border: 1px solid purple; padding: 2px; margin: 1px;\">{" ++
                            (printHoleName hn) ++ "}</span>"

                        (str2, ctx2) =
                            printChilds cs
                    in
                        (hole ++ str2, (IndexedHole hn venv_)::ctx2)

                VCons 1 _ _ ->
                    let
                        (str1, ctx1) =
                            printStrNoQuoOrHole c

                        (str2, ctx2) =
                            printChilds cs
                    in
                        (str1 ++ str2, ctx1 ++ ctx2)

                VNil 1 ->
                    let
                        (str2, ctx2) =
                            printChilds cs
                    in
                        (str2, ctx2)

                _ ->
                    ("Child Type Error.", [])
        
        _ ->
            ("Print Childs Error.", [])