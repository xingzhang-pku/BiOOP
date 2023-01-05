module OOP.LangUtils exposing (..)

import OOP.Syntax exposing (..)
import Debug exposing (toString)
import OOP.Subclassing exposing (..)
import OOP.Printer.Value exposing (printValue)
import OOP.Utils exposing (findByName, updateValueInDict)


processAfterParse : Term -> Term
processAfterParse term =
    case term of
        TLam ws p t ->
            let
                t_ =
                    processAfterParse t
            in
                TLam ws p t_
        
        TApp ws t1 t2 ->
            let
                t1_ =
                    processAfterParse t1
                
                t2_ =
                    processAfterParse t2
            in
                TApp ws t1_ t2_

        TLet ws p t1 t2 ->
            let
                t1_ =
                    processAfterParse t1
                
                t2_ =
                    processAfterParse t2
            in
                TLet ws p t1_ t2_

        TLetrec ws p t1 t2 ->
            let
                t1_ =
                    processAfterParse t1
                
                t2_ =
                    processAfterParse t2
            in
                TLetrec ws p t1_ t2_

        TFix ws t ->
            let
                t_ =
                    processAfterParse t
            in
                TFix ws t_
            
        TCase ws guard br ->
            let
                (br_, _) =
                    addIDToBranch br 0
            in
                TCase ws guard br_

        TCons ws t1 t2 ->
            let
                t1_ =
                    processAfterParse t1
                
                t2_ =
                    processAfterParse t2
            in
                TCons ws t1_ t2_

        TList ws t1 t2 ->
            let
                t1_ =
                    processAfterParse t1
                
                t2_ =
                    processAfterParse t2
            in
                TList ws t1_ t2_

        TTuple2 ws t1 t2 ->
            let
                t1_ =
                    processAfterParse t1
                
                t2_ =
                    processAfterParse t2
            in
                TTuple2 ws t1_ t2_
        
        TTuple3 ws t1 t2 t3 ->
            let
                t1_ =
                    processAfterParse t1
                
                t2_ =
                    processAfterParse t2

                t3_ =
                    processAfterParse t3
            in
                TTuple3 ws t1_ t2_ t3_

        TBPrim ws op t1 t2 ->
            let
                t1_ =
                    processAfterParse t1
                
                t2_ =
                    processAfterParse t2
            in
                TBPrim ws op t1_ t2_

        TUPrim ws op t ->
            let
                t_ =
                    processAfterParse t
            in
                TUPrim ws op t_

        TParens ws t ->
            let
                t_ =
                    processAfterParse t
            in
                TParens ws t_

        TRef ws t ->
            let
                t_ =
                    processAfterParse t
            in
                TRef ws t_

        TDeRef ws t ->
            let
                t_ =
                    processAfterParse t
            in
                TDeRef ws t_

        TAssign ws t1 t2 ->
            let
                t1_ =
                    processAfterParse t1
                
                t2_ =
                    processAfterParse t2
            in
                TAssign ws t1_ t2_

        TField ws t f ->
            let
                t_ =
                    processAfterParse t
            in
                TField ws t_ f

        TInvk ws t m ->
            let
                t_ =
                    processAfterParse t
            in
                TInvk ws t_ m

        TNew ws c t ->
            let
                t_ =
                    processAfterParse t
            in
                TNew ws c t_
        
        _ -> term


addIDToBranch : Branch -> ID -> (Branch, ID)
addIDToBranch br id =
    case br of
        BSin ws p t ->
            let
                t_ =
                    processAfterParse t
            in
            (BNSin ws id p t_, id+1)
        
        BCom ws b1 b2 ->
            let
                (b1_, id1) =
                    addIDToBranch b1 id
                
                (b2_, id2) =
                    addIDToBranch b2 id1
            in
                (BCom ws b1_ b2_, id2)
        
        _ -> (br, id)


match : Pattern -> Value -> Env
match pat val =
    case (pat, val) of

        ((PString _ s1), (VString s2)) ->
            if s1 == s2 then [] else [("ERROR", VError "Match Failed.")]

        ((PCons _ p1 p2), (VCons v1 v2)) ->
            matchHelper p1 p2 v1 v2
        
        ((PCons1 _ p1 p2), (VString s)) ->
            case String.uncons s of
                Just (c, cs) ->
                    matchHelper p1 p2 (VChar c) (VString cs)
                Nothing ->
                    [("ERROR", VError "Match Failed.")]

        ((PList _ p1 p2), (VCons v1 v2)) ->
            matchHelper p1 p2 v1 v2

        ((PBTuple _ p1 p2), (VTuple2 v1 v2)) ->
            matchHelper p1 p2 v1 v2
        
        ((PTTuple _ p1 p2 p3), (VTuple3 v1 v2 v3)) ->
            let
                res1 = 
                    match p1 v1

                res2 =
                    match p2 v2

                res3 =
                    match p3 v3
            in
            if  res1 == [("ERROR", VError "Match Failed.")] ||
                res2 == [("ERROR", VError "Match Failed.")] ||
                res3 == [("ERROR", VError "Match Failed.")]
            then 
                [("ERROR", VError "Match Failed.")]
            else
                res1++res2++res3

        ((PInt _ n1), (VInt n2)) ->
            if n1 == n2 then [] else [("ERROR", VError "Match Failed.")]

        ((PFloat _ n1), (VFloat n2)) ->
            if n1 == n2 then [] else [("ERROR", VError "Match Failed.")]

        (PTrue _,  VTrue)     -> []
        (PFalse _, VFalse)    -> []

        (PChar _ c1, VChar c2) ->
            if c1 == c2 then [] else [("ERROR", VError "Match Failed.")]
        
        (PNil _, VNil)       -> []
        (PEmpList _, VNil)   -> []

        (PVar _ s, v) -> [(s, v)]

        _ -> [("ERROR", VError "Match Failed.")]


matchHelper : Pattern -> Pattern -> Value -> Value -> Env
matchHelper p1 p2 v1 v2 =
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


matchCase : Value -> Branch -> MatchCaseRes
matchCase v b =
    case b of
        BNSin _ n p t ->
            { envm  = match p v
            , choice = n
            , ti = t
            , pi = p
            }

        BCom _ b1 b2 ->
            let 
                res = 
                    matchCase v b1 
            in
                case res.envm of
                    [(_, VError _)] ->
                        matchCase v b2
                    
                    _ -> res
        
        _ ->
            { envm  = []
            , choice = 0
            , ti = TError "Match Case Error : 01."
            , pi = PError
            }


-- Ignore spaces here for convenience
findClass : String -> ClassTable -> Maybe ClassDef
findClass class classtb =
    let
        (_, classtb_)=
            classtb
    in
        case classtb_ of
            (_,((c,f),fs,ms)) :: cds ->
                if c == class
                then 
                    Just ([], ((c,f),fs,ms))
                else
                    findClass class ([], cds)
                    
            _ -> Nothing


getFields : String -> ClassTable -> List (WS, String, String)
getFields class classtb =
    let
        res = 
            findClass class classtb
    in
        case res of
            Just (_, ((_,f),(_, fs),_)) ->
                if f == "Object"
                then
                    fs
                else
                    (getFields f classtb) ++ fs
            Nothing ->
                []


findIndexValueList : Int -> Value -> Maybe Value
findIndexValueList id val =
    case val of
        VCons v vs ->
            if id == 0
            then
                Just v
            else
                findIndexValueList (id - 1) vs
        VNil ->
            Nothing

        _ ->
            Just (VError "Args is Not a List : 01.")


findIndexMethods : String -> Methods -> Maybe Method
findIndexMethods m methods =
    let
        (_, ms) = methods
    in
    case ms of
        (ws, (m_, p, t)) :: ms_ ->
            if m == m_
            then
                Just (ws, (m, p, t))
            else
                findIndexMethods m ([], ms_)

        [] ->
            Nothing


findMethod : String -> String -> ClassTable -> Maybe (String, Method)
findMethod m c classtb =
    let
        res =
            findClass c classtb
    in
        case res of
            Just (_, ((_, f),_,ms)) ->
                if f == "Object"
                then
                    Maybe.map (\a -> (c, a)) (findIndexMethods m ms)
                else
                    case (findIndexMethods m ms) of
                        Just mthd ->
                            Just (c, mthd)

                        Nothing ->
                            findMethod m f classtb
            _ -> Nothing


valueToTerm : Value -> WS -> Term
valueToTerm v ws =
    case v of
        VInt n -> TInt ws n

        VFloat n -> TFloat ws n

        VTrue -> TTrue ws

        VFalse -> TFalse ws

        VChar c -> TChar ws c

        VString s ->
            TString ws s

        VCons v1 v2 ->
            case ws of
                [_] ->
                    let
                        t1 =
                            valueToTerm v1 [""]

                        t2 =
                            valueToTerm v2 [" "]
                    in
                        TCons ws t1 t2

                [_, _] ->
                    valueToListTerm v ws

                _ ->
                    TError "Error : 34."

        VNil -> TNil ws

        VTuple2 v1 v2 ->
            let
                t1 =
                    valueToTerm v1 [""]

                t2 =
                    valueToTerm v2 [""]
            in
                TTuple2 ws t1 t2

        VTuple3 v1 v2 v3 ->
            let
                t1 =
                    valueToTerm v1 [""]

                t2 =
                    valueToTerm v2 [""]
                
                t3 =
                    valueToTerm v3 [""]
            in
                TTuple3 ws t1 t2 t3

        VLoc n -> TLoc ws n

        VUnit -> TUnit ws

        VNew class arg ->
            let
                t =
                    valueToTerm arg ["",""]
            in
                TNew [" ", "", ""] class t

        _ ->
            TError ("Can Not Transfer Value: "++(printValue v)++" To Expression.")

    
valueToListTerm : Value -> WS -> Term
valueToListTerm v ws =
    case v of
        VCons v1 v2 ->
            let
                t1 =
                    valueToTerm v1 [""]
                
                t2 =
                    valueToListTerm v2 [" "]
            in
                TList ws t1 t2

        VNil ->
            TEmpList []

        _ ->
            TError "Error : 33."


patternSubst : Env -> Pattern -> Value
patternSubst env p = 
    case p of
        PVar _ s ->
            case findByName s env of
                Just val ->
                    val
                
                Nothing  ->
                    VError "Pattern Substitution Error: No Such Variable."
        
        PCons _ p1 p2 ->
                VCons (patternSubst env p1) (patternSubst env p2)
        
        PCons1 _ p1 p2 ->
            case (patternSubst env p1, patternSubst env p2) of
                (VChar c, VString s) ->
                    VString (String.cons c s)
                
                _ ->
                    VError "Error : 999"

        PNil _ -> VNil

        PList _ p1 p2 ->
                VCons (patternSubst env p1) (patternSubst env p2)
            
        PEmpList _ -> VNil

        PInt _ n     -> VInt n

        PFloat _ n   -> VFloat n

        PTrue _     -> VTrue

        PFalse _     -> VFalse

        PString _ s -> VString s

        PChar _ c -> VChar c

        PBTuple _ p1 p2 ->
            VTuple2 (patternSubst env p1) (patternSubst env p2)

        PTTuple _ p1 p2 p3 ->
            VTuple3 (patternSubst env p1) 
                    (patternSubst env p2)
                    (patternSubst env p3)
    
        PUnit _ -> VUnit

        PError -> VError "Error : 07."


mergeEnv : Env -> Env -> Env -> ClassTable -> (Env, ClassTable)
mergeEnv env1 env2 ori_env ct =

    case (env1, env2, ori_env) of

        
        ((s1, v1)::env1_, (s2, v2)::env2_, (_, v3)::ori_env_) ->
            let
                (env_, ct_) =
                    mergeEnv env1_ env2_ ori_env_ ct
            in
            case (v1, v3) of
                (VClosure _ t1 _, VFix (TLam _ _ (TLam _ _ t2))) ->
                    if (t1 /= t2) 
                    then ((s1, v1) :: env_, ct_)
                    else ((s2, v2) :: env_, ct_)

                _ ->
                    let
                        (v_, ct__) =
                            threeMerge v3 v1 v2 ct_

                    in
                        ((s1, v_) :: env_, ct__)
        
        _ ->
            ([], ct)


appendCT : ClassTable -> ClassTable -> ClassTable
appendCT (ws, ls1) (_, ls2) =
    (ws, ls1 ++ ls2)


-- mergeClassTable : ClassTable -> ClassTable -> ClassTable -> ClassTable -> ClassTable
-- mergeClassTable classtb1 classtb2 classtb3 classtbo =
--     let
--         (_, ct1) = classtb1

--         (_, ct2) = classtb2

--         (_, ct3) = classtb3

--         (ws_tb, cto) = classtbo
--     in
--     case (ct1, ct2, (ct3, cto)) of

--         ((_, ((c,f),fields,ls1))::ct1_, (_, (_,_,ls2))::ct2_, ((_, (_,_,ls3))::ct3_,(ws_cd, (_,_,lso))::cto_)) ->
--             let
--                 res =
--                     Tuple.second <| mergeClassTable ([],ct1_) ([],ct2_) ([],ct3_) ([],cto_)
--             in
--             (ws_tb, (ws_cd, ((c,f),fields,(mergeMethods ls1 ls2 ls3 lso))) :: res)

--         _ -> ([], [])


mergeMethods : Methods -> Methods -> Methods -> Methods -> Methods
mergeMethods methods1 methods2 methods3 methodso =
    let
        (_, ls1) = methods1

        (_, ls2) = methods2

        (_, ls3) = methods3

        (ws_ms, lso) = methodso
    in
    case (ls1, ls2, (ls3, lso)) of

        ((_, (s,p,t1))::ls1_, (_, (_,_,t2))::ls2_, ((_, (_,_,t3))::ls3_, (ws_m, (_,_,to))::lso_)) ->
            let
                res =
                    Tuple.second <| mergeMethods ([],ls1_) ([],ls2_) ([],ls3_) ([],lso_)
            in
            if (t1 /= to) then 
                (ws_ms, (ws_m,(s,p,t1)) :: res)
            else if (t2 /= to) then
                (ws_ms, (ws_m,(s,p,t2)) :: res)
            else
                (ws_ms, (ws_m,(s,p,t3)) :: res)

        _ -> ([],[])


updateBranch : Branch -> Int -> Term -> Branch
updateBranch branch choice t =
    case branch of
        BNSin ws n p term ->
            if choice == n
            then BNSin ws n p t
            else BNSin ws n p term

        BCom ws b1 b2 ->
            BCom ws (updateBranch b1 choice t) (updateBranch b2 choice t)
        
        b -> b


vlength : Value -> Int
vlength v =
    case v of
        VNil ->
            0

        VCons _ vs ->
            1 + (vlength vs)

        VString s ->
            String.length s
        
        _ ->
            -99


vtake : Value -> Int -> Value
vtake v n =
    case v of
        VNil ->
            VNil
        
        VCons v1 vs ->
            if n == 0 then
                VNil
            else
                VCons v1 (vtake vs (n - 1))

        VString s ->
            VString (String.left n s)

        _ ->
            VError "The Take function cannot be used on values other than lists and strings."


vsplit : Value -> Int -> (Value, Value)
vsplit nl n1 =
    case (nl, n1) of
        (VCons _ _, 0) ->
            (VNil, nl)
        
        (VCons v1 vs, _) ->
            let
                (l1, l2) =
                    vsplit vs (n1 - 1)
            in
                (VCons v1 l1, l2)

        (VNil, _) ->
            (VNil, VNil)

        _ ->
            ( VError "New Value for Updating Concat Type Error"
            , VError "")


vreplace : Int -> Value -> Value -> Value
vreplace index v ls =
    case ls of
        VNil ->
            VNil

        VCons v1 v2 ->
            if index == 0 then
                VCons v v2
            else
                VCons v1 (vreplace (index - 1) v v2)

        _ ->
            VError "Args is Not a List : 02."


subclassing : String -> String -> Term -> ClassTable -> SubClsCnt -> (ClassTable, String, SubClsCnt)
subclassing m class t_ classtb scc =
    let
            res1 =
                findMethod m class classtb

            res2 =
                findByName class scc 
    in
        case (res1, classtb, res2) of
            (Just (_, (ws_mt, (_, p, t))), (ws_tb, _), Just cnt) ->
                if eqT t t_ then
                    (([],[]), class, scc)
                else
                    (   ( ws_tb
                        , [([], ((class ++ (toString cnt), class), ([],[]), ([],[(ws_mt,(m, p, t_))])))]
                        )
                    ,   class ++ (toString cnt)
                    ,   updateValueInDict class (cnt + 1) scc
                    )

            (_, _, _) ->
                (([], []), class, scc)


-- replaceClassMethods : String -> String -> Term -> ClassTable -> ClassTable
-- replaceClassMethods class m t_ classtable =
--     let
--         (ws_tb, classtb) = classtable
--     in
--     case classtb of
--         (ws_cd, ((c,f),fs,ms)) :: cds ->
--             if c == class
--             then 
--                 (ws_tb, (ws_cd, ((c,f),fs,replaceMethods m t_ ms)) :: cds)
--             else
--                 (ws_tb, (ws_cd, ((c,f),fs,ms)) :: (Tuple.second <| replaceClassMethods class m t_ ([], cds)))

--         [] -> ([], [])


-- replaceMethods : String -> Term -> Methods -> Methods
-- replaceMethods m t_ methods =
--     let
--         (ws_ms, ms) = methods
--     in
--     case ms of
--         (ws_m, (m_, p, t)) :: ms_ ->
--             if m == m_
--             then
--                 (ws_ms, (ws_m, (m_, p, t_)) :: ms_)
--             else
--                 (ws_ms, (ws_m, (m_, p, t)) :: (Tuple.second <| replaceMethods m t_ ([], ms_)))

--         [] ->
--             ([], [])


findFieldsIndex : String -> List (Int, (WS, String, String)) -> Int
findFieldsIndex s env =
    case env of

        (n, (_, x, _)) :: env_ ->
            if s == x then n else findFieldsIndex s env_

        [] -> -1


appendTermString : Term -> Term -> Term
appendTermString l1 l2 =
    case (l1, l2) of
        (TString ws s1, TString _ s2) ->
            TString ws (s1 ++ s2)
        _ ->
            TError "Error : 666."


appendValueList : Value -> Value -> Value
appendValueList l1 l2 =
    case l1 of
        VNil -> l2

        VCons v1 vs1 ->
            VCons v1 (appendValueList vs1 l2)

        _ ->
            VError "Operand Error : 06."


appendValueString : Value -> Value -> Value
appendValueString l1 l2 =
    case (l1, l2) of
        (VString s1, VString s2) ->
            VString (s1 ++ s2)
        _ ->
            VError "Error : 777."


printEnv : Env -> String
printEnv env =
    case env of
        (s, v) :: env_ ->
            if (printValue v) == "<fn>" || (printValue v) == "<fix>" then
                (printEnv env_)
            else
                s ++ ": " ++ (printValue v) ++ ";   " ++ (printEnv env_)
        
        [] ->
            "\n"


printState : State -> String
printState state =
    case state of
        v :: rest ->
            (printValue v) ++ ",  " ++ (printState rest)
        
        [] ->
            ""


diff : Value -> Value -> (Int, List DiffOp)
diff v1 v2 =
    case v1 of
        VNil -> 
            (vlength v2, turnToInsert v2)

        VCons v11 v12 ->
            case v2 of
                VNil ->
                    (vlength v1, List.repeat (vlength v1) Delete)

                VCons v21 v22 ->
                    if v11 == v21 then
                        let
                            (n, opList) =
                                diff v12 v22
                        in
                            (n, Keep v11 :: opList)
                    else
                        compareSubSeq v21 (diff v12 v22) (diff v1 v22) (diff v12 v2)

                _ ->
                    (-99, [])

        _ ->
            (0, [])


turnToInsert : Value -> List DiffOp
turnToInsert v =
    case v of
        VNil -> 
            []

        VCons v1 v2 ->
            (Insert v1) :: turnToInsert v2

        _ ->
            []


compareSubSeq : Value -> (Int, List DiffOp) -> (Int, List DiffOp) -> (Int, List DiffOp) -> (Int, List DiffOp)
compareSubSeq v (n1, ls1) (n2, ls2) (n3, ls3) =
    if n1 <= n2 && n1 <= n3 then
        (n1 + 1, (Update v) :: ls1)
    else if n2 <= n3 then
        (n2 + 1, (Insert v) :: ls2)
    else
        (n3 + 1, Delete :: ls3)


splitFuncDef : List Pattern -> Term -> (List Pattern, Term)
splitFuncDef params t =
    case t of
        TLam [] p t_ ->
            splitFuncDef (p :: params) t_

        _ -> (List.reverse params, t)


eqT : Term -> Term -> Bool
eqT term1 term2 =
    case (term1, term2) of
        (TInt _ n1, TInt _ n2) ->
            n1 == n2
        
        (TFloat _ n1, TFloat _ n2) ->
            n1 == n2
        
        (TTrue _, TTrue _) -> True
        (TFalse _, TFalse _) -> True
    
        (TChar _ c1, TChar _ c2) ->
            c1 == c2
        
        (TString _ s1, TString _ s2) ->
            s1 == s2

        (TVar _ s1, TVar _ s2) ->
            s1 == s2
        
        (TLam _ p1 t1, TLam _ p2 t2) ->
            eqP p1 p2 && eqT t1 t2

        (TApp _ t11 t12, TApp _ t21 t22) ->
            eqT t11 t21 && eqT t12 t22

        (TLet _ p1 t11 t12, TLet _ p2 t21 t22) ->
            eqP p1 p2 && eqT t11 t21 && eqT t12 t22
        
        (TCase _ t1 b1, TCase _ t2 b2) ->
            eqT t1 t2 && eqB b1 b2

        (TCons _ t11 t12, TCons _ t21 t22) ->
            eqT t11 t21 && eqT t12 t22
        
        (TList _ t11 t12, TList _ t21 t22) ->
            eqT t11 t21 && eqT t12 t22

        (TNil _, TNil _) -> True
        (TEmpList _, TEmpList _) -> True

        (TTuple2 _ t11 t12, TTuple2 _ t21 t22) ->
            eqT t11 t21 && eqT t12 t22
        
        (TTuple3 _ t11 t12 t13, TTuple3 _ t21 t22 t23) ->
            eqT t11 t21 && eqT t12 t22 && eqT t13 t23
        
        (TBPrim _ op1 t11 t12, TBPrim _ op2 t21 t22) ->
            op1 == op2 && eqT t11 t21 && eqT t12 t22

        (TUPrim _ op1 t1, TUPrim _ op2 t2) ->
            op1 == op2 && eqT t1 t2
        
        (TParens _ t1, TParens _ t2) ->
            eqT t1 t2
        
        (TRef _ t1, TRef _ t2) ->
            eqT t1 t2
        
        (TDeRef _ t1, TDeRef _ t2) ->
            eqT t1 t2
        
        (TAssign _ t11 t12, TAssign _ t21 t22) ->
            eqT t11 t21 && eqT t12 t22
        
        (TUnit _, TUnit _) -> True
    
        (TField _ t11 t12, TField _ t21 t22) ->
            eqT t11 t21 && eqT t12 t22

        (TInvk _ t11 t12, TInvk _ t21 t22) ->
            eqT t11 t21 && eqT t12 t22

        (TNew _ s1 t1, TNew _ s2 t2) ->
            s1 == s2 && eqT t1 t2
        
        (TSeq _ t11 t12, TSeq _ t21 t22) ->
            eqT t11 t21 && eqT t12 t22

        (THtml _ s1 t11 t12 t13, THtml _ s2 t21 t22 t23) ->
            s1 == s2 && eqT t11 t21 && eqT t12 t22 && eqT t13 t23

        (TToStr _ t1, TToStr _ t2) ->
            eqT t1 t2
        
        (TMap _ t11 t12 t13, TMap _ t21 t22 t23) ->
            eqT t11 t21 && eqT t12 t22 && eqT t13 t23

        _ -> False


eqP : Pattern -> Pattern -> Bool
eqP pat1 pat2 =
    case (pat1, pat2) of
        (PVar _ s1, PVar _ s2) ->
            s1 == s2
        
        (PCons _ p11 p12, PCons _ p21 p22) ->
            eqP p11 p21 && eqP p12 p22
        
        (PCons1 _ p11 p12, PCons1 _ p21 p22) ->
            eqP p11 p21 && eqP p12 p22
        
        (PList _ p11 p12, PList _ p21 p22) ->
            eqP p11 p21 && eqP p12 p22

        (PNil _, PNil _) -> True
        (PEmpList _, PEmpList _) -> True
    
        (PInt _ n1, PInt _ n2) ->
            n1 == n2

        (PFloat _ n1, PFloat _ n2) ->
            n1 == n2

        (PTrue _, PTrue _) -> True
        (PFalse _, PFalse _) -> True
        
        (PString _ s1, PString _ s2) ->
            s1 == s2

        (PChar _ c1, PChar _ c2) ->
            c1 == c2
        
        (PBTuple _ p11 p12, PBTuple _ p21 p22) ->
            eqP p11 p21 && eqP p12 p22
        
        (PTTuple _ p11 p12 p13, PTTuple _ p21 p22 p23) ->
            eqP p11 p21 && eqP p12 p22 && eqP p13 p23
        
        (PUnit _, PUnit _) -> True
    
        _ -> False


eqB : Branch -> Branch -> Bool
eqB b1 b2 =
    case (b1, b2) of
        (BSin _ p1 t1, BSin _ p2 t2) ->
            eqP p1 p2 && eqT t1 t2
        
        (BNSin _ id1 p1 t1, BNSin _ id2 p2 t2) ->
            id1 == id2 && eqP p1 p2 && eqT t1 t2
        
        (BCom _ b11 b12, BCom _ b21 b22) ->
            eqB b11 b21 && eqB b12 b22

        _ -> False