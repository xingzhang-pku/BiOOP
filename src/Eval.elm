module Eval exposing (..)

import Model exposing (..)
import Syntax exposing (..)
import LangUtils exposing (..)
import Round


eval :  HEnv -> VEnv -> Expr -> List (HoleName, Int) -> (Value, List (HoleName, Int))
eval henv venv expr count =
    case expr of

        EVar _ s ->
            case findVarByName s venv of
                Just v ->
                    case v of
                        VFix e -> eval henv venv (EFix defaultWS e) count
                        val    -> (val, count)

                Nothing -> (VError "Variable Error: 01", [])

        ELam _ p e ->
            (VClosure p e venv, count)

        ELet _ p e1 e2 ->
            eval henv venv (EApp defaultWS (ELam defaultWS p e2) e1) count

        ELetrec _ p e1 e2 ->
            eval henv venv 
                (EApp defaultWS (ELam defaultWS p e2) (EFix defaultWS (ELam defaultWS p e1))) count

        EApp _ e1 e2 ->
            case eval henv venv e1 count of

                (VClosure p ef venvf, count1) ->
                    case e2 of
                        EFix _ e -> 
                            case p of
                                PVar _ s -> eval henv ((s, VFix e)::venvf) ef count1
                                _      -> (VError "Recursion Error: 01", [])
                        _ ->  
                            let 
                                (v2, count2) =
                                    eval henv venv e2 count1 
                                
                                venvm =
                                    match p v2
                            in
                            case venvm of
                                [(_, VError info)] -> (VError info, [])
                                _             -> eval henv (venvm++venvf) ef count2

                _ -> (VError "Function Error: 01", [])

        EInt _ n ->
            (VInt n, count)

        EFloat _ n ->
            (VFloat n, count)
        
        ETrue _ -> (VTrue, count)
        EFalse _ -> (VFalse, count)

        EChar _ c -> (VChar c, count)

        ECons (_, id) e1 e2 ->
            let 
                (v1, count1) =
                    eval henv venv e1 count 

                (v2, count2) =
                    eval henv venv e2 count1
            in
            case v2 of
                VHole _ _ ->
                    let 
                        c = 
                            findCount tempHoleCount count 
                    in
                        (VHole (HInter (c+1)) venv, (tempHoleCount, c+1)::count)
                _ ->
                    if id == esQuo || id == esElm then
                        (VCons vsId v1 v2, count2)
                    else
                        (VCons voId v1 v2, count2)

        EBTuple _ e1 e2 ->
            let 
                (v1, count1) =
                    eval henv venv e1 count 
                
                (v2, count2) =
                    eval henv venv e2 count1
            in
                (VBTuple v1 v2, count2)

        ETTuple _ e1 e2 e3 ->
            let 
                (v1, count1) =
                    eval henv venv e1 count 
                
                (v2, count2) =
                    eval henv venv e2 count1
                
                (v3, count3) =
                    eval henv venv e3 count2
            in
                (VTTuple v1 v2 v3, count3)
        
        ENil (_, id) ->
            if id == 3 || id == 4 then
                (VNil 1, count)
            else (VNil 0, count)

        EHole _ u ->
            let 
                v =
                    findValue u venv henv 
            in
                case v of
                    Nothing -> 
                        let 
                            n = 
                                findCount u count 
                        in
                            case n of
                                0 -> (VHole (HInst u 1) venv, (u, 1)::count)
                                _ -> (VHole (HInst u (n+1)) venv, (u, n+1)::count)
                    Just val  -> (val, count)

        EUPrim _ op e ->
            case op of
                Neg ->
                    let 
                        (v, count1) =
                            eval henv venv e count 
                    in
                        case v of
                            VInt n    ->
                                (VInt (0-n), count1)
                            VFloat n  ->
                                (VFloat (0-n), count1)
                            VHole _ _ ->
                                let 
                                    n = 
                                        findCount tempHoleCount count1 
                                in
                                    (VHole (HInter (n+1)) venv, (tempHoleCount, n+1)::count1)
                            _         ->
                                (VError "Arithmetic Error: 01", [])
                Not ->
                    let 
                        (v, count1) =
                            eval henv venv e count 
                    in
                    case v of
                        VTrue     ->
                            (VFalse, count1)
                        VFalse    ->
                            (VTrue, count1)
                        VHole _ _ ->
                            let 
                                n =
                                    findCount tempHoleCount count1 
                            in
                                (VHole (HInter (n+1)) venv, (tempHoleCount, n+1)::count1)
                        _         ->
                            (VError "Logical Operation Error: 01", [])

        EBPrim _ op e1 e2 ->
            let 
                (v1, count1) = 
                    eval henv venv e1 count 

                (v2, count2) = 
                    eval henv venv e2 count1
            in
                case v1 of
                    VInt n1 ->
                        case v2 of
                            VInt n2 -> 
                                case op of
                                    Add -> (VInt (n1 + n2), count2)
                                    Sub -> (VInt (n1 - n2), count2)
                                    Mul -> (VInt (n1 * n2), count2)
                                    Div -> (VInt (n1 // n2), count2)
                                    DDiv -> (VFloat (Round.roundNumCom 2 
                                                    <| ((toFloat n1) / (toFloat n2))), count2)
                                    Eq -> (boolOp (n1 == n2), count2)
                                    Lt -> (boolOp (n1 < n2), count2)
                                    Gt -> (boolOp (n1 > n2), count2)
                                    Le -> (boolOp (n1 <= n2), count2)
                                    Ge -> (boolOp (n1 >= n2), count2)
                                    _  -> 
                                        (VError "Logical Operation Error: 02", [])
                            
                            VFloat n2 ->
                                (floatOp op (toFloat n1) n2, count2)
                            
                            VHole _ _ ->
                                let 
                                    n =
                                        findCount tempHoleCount count2
                                in
                                    (VHole (HInter (n+1)) venv, (tempHoleCount, n+1)::count2)
                            
                            _         ->
                                (VError "Operand Error: 01", [])

                    VFloat n1 ->
                        case v2 of
                            VInt n2   -> 
                                (floatOp op n1 (toFloat n2), count2)

                            VFloat n2 -> 
                                (floatOp op n1 n2, count2)
                            
                            VHole _ _ ->
                                let 
                                    n =
                                        findCount tempHoleCount count2
                                in
                                    (VHole (HInter (n+1)) venv, (tempHoleCount, n+1)::count2)
                            
                            _         -> 
                                (VError "Operand Error: 02", [])

                    VTrue ->
                        case v2 of
                            VTrue ->
                                case op of
                                And -> (VTrue, count2)
                                Or  -> (VTrue, count2)
                                _   -> (VError "Arithmetic Error: 02", [])
                            
                            VFalse ->
                                case op of
                                    And -> (VFalse, count2)
                                    Or  -> (VTrue, count2)
                                    _   -> (VError "Arithmetic Error: 03", [])
                            
                            VHole _ _ ->
                                let 
                                    n =
                                        findCount tempHoleCount count2
                                in
                                    (VHole (HInter (n+1)) venv, (tempHoleCount, n+1)::count2)

                            _ ->
                                (VError "Operand Error: 03", [])

                    VFalse ->
                        case v2 of
                            VTrue ->
                                case op of
                                    And -> (VFalse, count2)
                                    Or  -> (VTrue, count2)
                                    _   -> (VError "Arithmetic Error: 04", [])
                            
                            VFalse ->
                                case op of
                                    And -> (VFalse, count2)
                                    Or  -> (VFalse, count2)
                                    _   -> (VError "Arithmetic Error: 05", [])
                            
                            VHole _ _ ->
                                let 
                                    n =
                                        findCount tempHoleCount count2 
                                in
                                    (VHole (HInter (n+1)) venv, (tempHoleCount, n+1)::count2)

                            _ ->
                                (VError "Operand Error: 04", [])

                    VCons _ _ _ ->
                        case v2 of
                            VCons _ _ _ ->
                                if op == Cat then
                                    (append v1 v2, count2)
                                else
                                    (VError "Operand Error: 06", [])
                            
                            VNil _ ->
                                (append v1 v2, count2)

                            VHole _ _ ->
                                let 
                                    n =
                                        findCount tempHoleCount count2 
                                in
                                    (VHole (HInter (n+1)) venv, (tempHoleCount, n+1)::count2)
                            
                            _ ->
                                (VError "Operand Error: 07", [])

                    VNil _ ->
                        case v2 of
                            VCons _ _ _ ->
                                if op == Cat then
                                    (append v1 v2, count2)
                                else
                                    (VError "Operand Error: 08", [])
                            
                            VNil _ ->
                                (append v1 v2, count2)

                            VHole _ _ ->
                                let 
                                    n =
                                        findCount tempHoleCount count2 
                                in
                                    (VHole (HInter (n+1)) venv, (tempHoleCount, n+1)::count2)
                            
                            _ ->
                                (VError "Operand Error: 09", [])


                    VHole _ _ ->
                        let 
                            n = 
                                findCount tempHoleCount count1
                        in
                            (VHole (HInter (n+1)) venv, (tempHoleCount, n+1)::count1)

                    _ ->
                        (VError "Operand Error: 05", [])

        ECase _ (EVar _ s) branch ->
            case findVarByName s venv of
                Just v ->
                    case v of
                        VHole _ _ ->
                            let 
                                c = 
                                    findCount tempHoleCount count 
                            in
                                (VHole (HInter (c+1)) venv, (tempHoleCount, c+1)::count)
                        
                        val       ->  
                            let 
                                res = 
                                    matchCase val branch 
                            in
                            case res.venvm of
                                [(_, VError info)] -> (VError info, [])
                                _ -> eval henv (res.venvm++venv) res.ei count
                
                Nothing ->
                    (VError "Variable Error: 02", [])

        EFix _ e ->
            eval henv venv (EApp defaultWS e (EFix defaultWS e)) count

        EParens _ e ->
            eval henv venv e count

        EHtml _ s e1 e2 e3 ->
            let 
                (v1, count1) = 
                    eval henv venv e1 count 

                (v2, count2) = 
                    eval henv venv e2 count1

                (v3, count3) = 
                    eval henv venv e3 count2
            in
                (VHtml s v1 v2 v3, count3)

        EToStr _ e ->
            let
                (v1, count1) =
                    eval henv venv e count

                sv =
                    print v1 |> Tuple.first
            in
                (String.toList sv |> stringToVCons, count1)
            

        EError info ->
            (VError info, [])

        _ ->
            (VError "Something Wrong!", [])


stringToVCons :  List Char -> Value
stringToVCons lc =
    case lc of
        [] ->
            VNil 1

        c :: cs ->
            VCons 1 (VChar c) (stringToVCons cs)


floatOp : Bop -> Float -> Float -> Value
floatOp op n1 n2 =
    case op of
        Add -> VFloat (n1 + n2)
        Sub -> VFloat (n1 - n2)
        Mul -> VFloat (n1 * n2)
        Div -> VFloat (n1 / n2)
        DDiv -> VFloat (n1 / n2)
        Eq -> boolOp (n1 == n2)
        Lt -> boolOp (n1 < n2)
        Gt -> boolOp (n1 > n2)
        Le -> boolOp (n1 <= n2)
        Ge -> boolOp (n1 >= n2)
        _  -> VError "Logical Operation Error: 03"


boolOp : Bool -> Value
boolOp p =
    if p then VTrue else VFalse


findValue : HoleName -> VEnv -> List (HoleName, VEnv, Value) -> Maybe Value
findValue u venv henv =
    case henv of

        [] -> Nothing

        (u_, venv_, v_)::ls ->
            if u_ == u && venv_ == venv
            then Just v_
            else findValue u venv ls


findCount : HoleName -> List (HoleName, Int) -> Int
findCount hn count =
    case count of
        (HInter 0, n)::_ -> n
        (hn_, n)::ct ->
            if hn == hn_
            then n
            else findCount hn ct
        [] -> 0