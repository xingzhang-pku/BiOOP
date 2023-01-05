module OOP.Eval exposing (..)

import OOP.Syntax exposing(..)
import OOP.Utils exposing (..)
import OOP.LangUtils exposing (..)
import Utils exposing (nth)
import OOP.Printer.Value exposing (printValue)
import Set exposing (insert, empty, union)
import Round
import List
import Tuple

eval : Env -> State -> ClassTable -> Term -> (Value, State, Invks)
eval env state classtb term =
    case term of

        TInt _ n -> (VInt n, state, empty)

        TFloat _ n -> (VFloat n, state, empty)

        TTrue _ -> (VTrue, state, empty)

        TFalse _ -> (VFalse, state, empty)

        TChar _ c -> (VChar c, state, empty)

        TString _ s ->
            (VString s, state, empty)

        TVar _ s ->
            case findByName s env of
                Nothing -> (VError "No Such Variable : 01", [], empty)

                Just v -> 
                    case v of
                        -- TODO: FIX
                        VFix t -> eval env state classtb (TFix [] t)
                        _ -> (v, state, empty)

        TLam _ p t -> (VClosure p t env, state, empty)

        TApp _ t1 t2 ->
            case eval env state classtb t1 of

                (VClosure p tf envf, state1, invks1) ->
                    case t2 of
                        TFix _ t -> 
                            case p of
                                PVar _ s -> eval ((s, VFix t)::envf) state1 classtb  tf 
                                _      -> (VError "Recursion Error : 01.", [], empty)
                        _ ->  
                            let 
                                (v2, state2, invks2) =
                                    eval env state1 classtb t2
                                
                                envm =
                                    match p v2
                            in
                            case envm of
                                [(_, VError info)] -> (VError info, [], empty)
                                _             -> 
                                    let

                                        (v, state3, invks3) =
                                            eval (envm++envf) state2 classtb tf
                                    in
                                        (v, state3, union invks1 invks2 |> union invks3)

                _ -> (VError "Not Applicable : 01.", [], empty)

        TLet _ p t1 t2 ->
            eval env state classtb (TApp [] (TLam [] p t2) t1)

        TLetrec _ p t1 t2 ->
            eval env state classtb 
                (TApp [] (TLam [] p t2) (TFix [] (TLam [] p t1)))

        TFix _ t ->
            eval env state classtb (TApp [] t (TFix [] t))

        TCase _ (TVar _ s) branch ->
            case findByName s env of
                Just v ->
                    let
                        res = 
                            matchCase v branch 
                    in
                    case res.envm of
                        [(_, VError info)] -> (VError info, [], empty)
                        _ -> eval (res.envm++env) state classtb res.ti
                
                Nothing ->
                    (VError "No Such Variable : 02", [], empty)
        
        TCons _ t1 t2 ->
            let 
                (v1, state1, invks1) =
                    eval env state classtb t1

                (v2, state2, invks2) =
                    eval env state1 classtb t2
            in
                (VCons v1 v2, state2, union invks1 invks2)

        TList _ t1 t2 ->
            let 
                (v1, state1, invks1) =
                    eval env state classtb t1

                (v2, state2, invks2) =
                    eval env state1 classtb t2
            in
                (VCons v1 v2, state2, union invks1 invks2)

        TNil _ -> (VNil, state, empty)

        TEmpList _ -> (VNil, state, empty)

        TTuple2 _ t1 t2 ->
            let 
                (v1, state1, invks1) =
                    eval env state classtb t1

                (v2, state2, invks2) =
                    eval env state1 classtb t2
            in
                (VTuple2 v1 v2, state2, union invks1 invks2)

        TTuple3 _ t1 t2 t3 ->
            let 
                (v1, state1, invks1) =
                    eval env state classtb t1

                (v2, state2, invks2) =
                    eval env state1 classtb t2

                (v3, state3, invks3) =
                    eval env state2 classtb t3
            in
                (VTuple3 v1 v2 v3, state3, union invks1 invks2 |> union invks3)

        TBPrim _ op t1 t2 ->
            let 
                (v1, state1, invks1) = 
                    eval env state classtb t1 

                (v2, state2, invks2) = 
                    eval env state1 classtb t2
                
                invks =
                    union invks1 invks2
            in
                case v1 of
                    VInt n1 ->
                        case v2 of
                            VInt n2 -> 
                                (intOp op n1 n2, state2, invks)
                            
                            VFloat n2 ->
                                (floatOp op (toFloat n1) n2, state2, invks)
                            
                            _ -> (VError "Operand Error : 01.", [], empty)

                    VFloat n1 ->
                        case v2 of
                            VInt n2   -> 
                                (floatOp op n1 (toFloat n2), state2, invks)

                            VFloat n2 -> 
                                (floatOp op n1 n2, state2, invks)
                            
                            _         -> (VError "Operand Error : 02.", [], empty)

                    VTrue ->
                        case v2 of
                            VTrue ->
                                case op of
                                And -> (VTrue, state2, invks)
                                Or  -> (VTrue, state2, invks)
                                _   -> (VError "Operator Error : 03.", [], empty)
                            
                            VFalse ->
                                case op of
                                    And -> (VFalse, state2, invks)
                                    Or  -> (VTrue, state2, invks)
                                    _   -> (VError "Operator Error: 04.", [], empty)

                            _ -> (VError "Operand Error : 03.", [], empty)

                    VFalse ->
                        case v2 of
                            VTrue ->
                                case op of
                                    And -> (VFalse, state2, invks)
                                    Or  -> (VTrue, state2, invks)
                                    _   -> (VError "Operator Error : 05.", [], empty)
                            
                            VFalse ->
                                case op of
                                    And -> (VFalse, state2, invks)
                                    Or  -> (VFalse, state2, invks)
                                    _   -> (VError "Operator Error : 06.", [], empty)

                            _ ->
                                (VError "Operand Error : 04.", [], empty)

                    VCons _ _ ->
                        case v2 of
                            VCons _ _ ->
                                if op == Cat then
                                    (appendValueList v1 v2, state2, invks)
                                else if op == Eq then
                                    (if v1 == v2 then VTrue else VFalse, state2, invks)
                                else
                                    (VError "Operator Error : 07.", [], empty)
                            
                            VNil ->
                                if op == Cat then
                                    (appendValueList v1 v2, state2, invks)
                                else if op == Eq then
                                    (VFalse, state2, invks)
                                else
                                    (VError "Operator Error : 08.", [], empty)
                            _ ->
                                (VError "Operand Error : 05.", [], empty)

                    VNil ->
                        case v2 of
                            VCons _ _ ->
                                if op == Cat then
                                    (appendValueList v1 v2, state2, invks)
                                else if op == Eq then
                                    (VFalse, state2, invks)
                                else
                                    (VError "Operator Error : 09.", [], empty)
                            
                            VNil ->
                                if op == Cat then
                                    (VNil, state2, invks)
                                else if op == Eq then
                                    (VTrue, state2, invks)
                                else
                                    (VError "Operator Error : 10.", [], empty)
                            
                            _ ->
                                (VError "Operand Error : 07.", [], empty)

                    VChar c1 ->
                        case v2 of
                            VChar c2 ->
                                if op == Eq then 
                                    (if c1 == c2 then VTrue else VFalse, state2, invks)
                                else
                                    (VError "Operator Error : 18", [], empty)
                                
                            _ -> (VError "Oprand Error : 14", [], empty)
                    
                    VString s1 ->
                        case v2 of
                            VString s2 ->
                                if op == Cat then
                                    (VString (s1 ++ s2), state2, invks)
                                else if op == Eq then
                                    (if v1 == v2 then VTrue else VFalse, state2, invks)
                                else
                                    (VError "Operator Error : 12.", [], empty)

                            _ ->
                                (VError "Operand Error : 12.", [], empty)

                    _ ->
                        (VError "Operand Error : 08.", [], empty)

        TUPrim _ op t ->
            case op of
                Neg ->
                    let 
                        (v, state1, invks1) =
                            eval env state classtb t 
                    in
                        case v of
                            VInt n    ->
                                (VInt (0-n), state1, invks1)

                            VFloat n  ->
                                (VFloat (0-n), state1, invks1)

                            _         ->
                                (VError "Operand Error : 09.", [], empty)
                Not ->
                    let 
                        (v, state1, invks1) =
                            eval env state classtb t 
                    in
                    case v of
                        VTrue     ->
                            (VFalse, state1, invks1)
                        
                        VFalse    ->
                            (VTrue, state1, invks1)
    
                        _         ->
                            (VError "Operand Error : 10.", [], empty)

        TParens _ t ->
            eval env state classtb t

        TRef _ t ->
            let
                (v, state1, invks1) =
                    eval env state classtb t
            in
                (VLoc (List.length state1), state1++[v], invks1)

        TDeRef _ t ->
            let
                (v, state1, invks1) =
                    eval env state classtb t
            in
                case v of
                    VLoc n ->
                        case nth n state of
                            Just val ->
                                (val, state1, invks1)
                            
                            Nothing ->
                                (VError "Index Out Of Range : 01.", [], empty)

                    _ -> (VError "Not a Reference : 01.", [], empty)
                
        TAssign _ t1 t2 ->
            let
                (v1, state1, invks1) =
                    eval env state classtb t1
                
                (v2, state2, invks2) =
                    eval env state1 classtb t2
            in
                case v1 of
                    VLoc n ->
                        (VUnit, replace n v2 state2, union invks1 invks2)


                    _ -> (VError "Not a Reference : 02.", [], empty)

        TUnit _ -> (VUnit, state, empty)

        TField _ t1 t2 ->
            case t2 of
                TVar _ f ->
                    let
                        (v1, state1, invks1) =
                            eval env state classtb t1
                    in
                        case v1 of
                        VNew class args ->
                            let
                                fields =
                                    getFields class classtb

                                index =
                                    findFieldsIndex f (List.indexedMap Tuple.pair fields)

                                val =
                                    findIndexValueList index args
                            in
                                case val of
                                    Just v -> (v, state1, invks1)

                                    Nothing -> (VError "No Such Field : 01.", [], empty)

                        _ -> (VError "Not an Object : 01.", [], empty)

                _ -> (VError "Not a Variable : 01.", [], empty)

        TInvk _ t1 t2 ->
            case t2 of
                TVar _ m ->
                    let
                        (v1, state1, invks1) =
                            eval env state classtb t1
                    in
                        case v1 of
                            VNew class _ ->
                                let
                                    res =
                                        findMethod m class classtb
                                in
                                    case res of
                                        Just (_, (_, (_, p,t))) ->
                                            ( VClosure p t (("this",v1)::env), state1
                                            , insert (class, m) invks1)

                                        Nothing ->
                                            (VError "No Such Method : 01.", [], empty)

                            _ -> (VError "Not an Object : 02.", [], empty)

                _ ->
                    (VError "Not a Variable : 02.", [], empty)

        TNew _ class ts ->
            let
                (vs, state1, invks1) =
                    eval env state classtb ts
            in
                (VNew class vs, state1, invks1)

        TError info -> (VError info, [], empty)

        TSeq _ t1 t2 ->
            let
                (_, state1, invks1) =
                    eval env state classtb t1

                (v2, state2, invks2) =
                    eval env state1 classtb t2
            in
                (v2, state2, union invks1 invks2)

        -- TLoc _ n -> (VLoc n, state)

        THtml _ s t1 t2 t3 ->
            let 
                (v1, state1, invks1) = 
                    eval env state classtb t1 

                (v2, state2, invks2) = 
                    eval env state1 classtb t2

                (v3, state3, invks3) = 
                    eval env state2 classtb t3
            in
                (VHtml s v1 v2 v3, state3, union invks1 invks2 |> union invks3)

        TToStr _ t ->
            let
                (v, state1, invks1) =
                    eval env state classtb t
            in
                (v |> printValue |> VString, state1, invks1)

        TMap _ _ f ls ->
            let
                (v1, state1, invks1) =
                    eval env state classtb f

                (v2, state2, invks2) =
                    eval env state1 classtb ls
                
                (v3, state3, invks3) =
                    vmap v1 v2 state2 classtb
            in
                (v3, state3, union invks1 invks2 |> union invks3)

        TLoc _ n ->
            (VLoc n, state, empty)
        
        _ -> (VError "No Such Term : 01.", [], empty)


boolOp : Bool -> Value
boolOp p =
    if p then VTrue else VFalse


intOp : Bop -> Int -> Int -> Value
intOp op n1 n2 =
    case op of
        -- Arith
        Add -> VInt (n1 + n2)
        Sub -> VInt (n1 - n2)
        Mul -> VInt (n1 * n2)
        Div -> VFloat (Round.roundNumCom 2 
                        <| ((toFloat n1) / (toFloat n2)))
        RDiv -> VInt (n1 // n2)
        -- Logic
        Eq -> boolOp (n1 == n2)
        Lt -> boolOp (n1 < n2)
        Gt -> boolOp (n1 > n2)
        Le -> boolOp (n1 <= n2)
        Ge -> boolOp (n1 >= n2)
        _  -> 
            VError "Operator Error : 01."


floatOp : Bop -> Float -> Float -> Value
floatOp op n1 n2 =
    case op of
        Add -> VFloat (Round.roundNumCom 2 <| n1 + n2)
        Sub -> VFloat (Round.roundNumCom 2 <| n1 - n2)
        Mul -> VFloat (Round.roundNumCom 2 <| n1 * n2)
        Div -> VFloat (Round.roundNumCom 2 <| n1 / n2)
        Eq -> boolOp (n1 == n2)
        Lt -> boolOp (n1 < n2)
        Gt -> boolOp (n1 > n2)
        Le -> boolOp (n1 <= n2)
        Ge -> boolOp (n1 >= n2)
        _  -> VError "Operator Error : 02."


vmap : Value -> Value -> State -> ClassTable -> (Value, State, Invks)
vmap v1 v2 state classtb =
    case v1 of
        VClosure p t envf ->
            case v2 of
                VCons v21 v22 ->
                    let 
                        envm =
                            match p v21
                    in
                    case envm of
                        [(_, VError info)] -> (VError info, [], empty)
                        _             ->
                            let
                                (v21_, state1, invks1) =
                                    eval (envm++envf) state classtb t
                                
                                (v22_, state2, invks2) =
                                    vmap v1 v22 state1 classtb
                            in
                                (VCons v21_ v22_, state2, union invks1 invks2)

                VNil ->
                    (VNil, state, empty)

                _ ->
                    (VError "The third argument to map_ must be a list : 01.", [], empty)

        _ ->
            (VError "The second argument to map_ must be a function : 01.", [], empty)