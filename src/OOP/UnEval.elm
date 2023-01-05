module OOP.UnEval exposing (..)

import Round
import List.Extra exposing (unconsLast, dropWhile)
import List exposing (..)
import OOP.Syntax exposing (..)
import OOP.Eval exposing (eval)
import OOP.Printer.Value exposing (printValue, printString)
import OOP.Printer.Term exposing (printTerm)
import OOP.LangUtils exposing (..)
import OOP.Utils exposing (updateValueInDict, findByName, replace)
import Utils exposing (nth)
import OOP.Parser.Value as Value
import Debug exposing (toString)


type alias Context =
    { env : Env
    , state : State
    , classtb : ClassTable
    }


type alias Res =
    { value : Value
    , state : State
    }


uneval : SubClsCnt -> Context -> Term -> Res -> (Context, Term, SubClsCnt)
uneval scc ctx term updates =
    case term of
        TInt ws _ ->
            case updates.value of
                VInt n -> 
                    ({ctx|state=updates.state,classtb=([],[])}, TInt ws n, scc)

                VFloat n ->
                    ({ctx|state=updates.state,classtb=([],[])}, TFloat ws n,scc)

                _ -> 
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)),scc)

        TFloat ws _ ->
            case updates.value of
                VInt n ->
                    ({ctx|state=updates.state,classtb=([],[])}, TFloat ws (toFloat n), scc)

                VFloat n ->
                    ({ctx|state=updates.state,classtb=([],[])}, TFloat ws n, scc)

                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TTrue ws ->
            case updates.value of
                VTrue ->
                    ({ctx|state=updates.state,classtb=([],[])}, TTrue ws, scc)
                
                VFalse ->
                    ({ctx|state=updates.state,classtb=([],[])}, TFalse ws, scc)
                
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TFalse ws->
            case updates.value of
                VTrue ->
                    ({ctx|state=updates.state,classtb=([],[])}, TTrue ws, scc)
                
                VFalse ->
                    ({ctx|state=updates.state,classtb=([],[])}, TFalse ws, scc)
                
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TChar ws _ ->
            case updates.value of
                VChar c ->
                    ({ctx|state=updates.state,classtb=([],[])}, TChar ws c, scc)
                
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TString ws _ ->
            case updates.value of
                VString s ->
                    
                    ({ctx|state=updates.state,classtb=([],[])}, TString ws s, scc)
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TVar ws s ->
            let
                env_ =
                    updateValueInDict s updates.value ctx.env
            in
                ({env=env_,state=updates.state,classtb=([],[])}, TVar ws s, scc)

        TLam ws _ _ ->
            case updates.value of
                VClosure p_ t_ env_ ->
                    ({env=env_,state=updates.state,classtb=([],[])}, TLam ws p_ t_, scc)

                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TApp ws t1 (TFix _ t2) ->
            let 
                (v1, state1, _) = 
                    eval ctx.env ctx.state ctx.classtb t1
            in
            case v1 of
                VClosure p tf envf ->
                    case p of
                        PVar _ s  ->
                            let
                                (ctx1, tf_, scc1) =
                                    uneval scc {ctx|env=((s, VFix t2)::envf),state=state1} tf updates
                            in
                            case tf_  of
                                TError info ->
                                    ({ctx|classtb=([],[])}, TError info, scc)
                                
                                _ ->
                                    let 
                                        ctx1_env =
                                            dropWhile (\(s1,_) -> s1 /= s) ctx1.env
                                            |> drop 1

                                        newUpdates_1 =
                                            {value=VClosure p tf_ (ctx1_env), state=ctx1.state}
                                        
                                        (ctx_, t1_, scc2) =
                                            uneval scc1 ctx t1 newUpdates_1

                                        newCT =
                                            appendCT ctx_.classtb ctx1.classtb
                                        
                                    in
                                    case t1_ of
                                        TError info ->
                                            ({ctx|classtb=([],[])}, TError info, scc2)
                                        
                                        _ -> -- Magic Code
                                            case (findByName s ctx1.env) of
                                                Just (VClosure fixP fixT fixEnv) -> 
                                                    let
                                                        newUpdates_2 =
                                                            {value=VClosure fixP fixT fixEnv,state=[]}
                                                        
                                                        (_, t2_, scc3) =
                                                            uneval scc2 ctx (TFix [] t2) newUpdates_2
                                                    in
                                                        ({ctx_|classtb=newCT}, TApp ws t1_ t2_, scc3)
                                    
                                                Just (VFix t2_) ->
                                                    ({ctx_|classtb=newCT}, TApp ws t1_ (TFix [] t2_), scc2)
                                                
                                                Just (VError info) ->
                                                    ({ctx_|classtb=newCT}, TError info, scc2)
                                                
                                                Just error ->
                                                    ({ctx|classtb=([],[])}, TError ("Fixpoint is Not a Function in Update : " ++ (printValue error)), scc2)
                                                
                                                Nothing ->
                                                    ({ctx|classtb=([],[])}, TError "No Such Variable : 04.", scc2)
                        
                        _ ->
                            ({ctx|classtb=([],[])}, TError "Pattern Error in Recursion : 01.", scc)

                _ ->
                    ({ctx|classtb=([],[])}, TError "Not Applicable : 02.", scc)

        TApp ws t1 t2 ->
            let 
                (v1, state1, _) = 
                    eval ctx.env ctx.state ctx.classtb t1 
            in
            case v1 of
                VClosure p tf envf ->
                    let 
                        (v2, state2, _) =
                            eval ctx.env state1 ctx.classtb t2
                        
                        envm =
                            match p v2

                        (ctx2_, tf_, scc1) =
                            uneval scc {env=(envm++envf),state=state2,classtb=ctx.classtb} tf updates 
                    in
                    case tf_ of
                        TError info ->
                            ({ctx|classtb=([],[])}, TError info, scc1)
                        
                        _ ->
                            let 
                                newUpdates_2 =
                                    {value = patternSubst ctx2_.env p, state=ctx2_.state}
                                
                                (ctx1_, t2_, scc2) =
                                    uneval scc1  {ctx|state=state1} t2 newUpdates_2
                            in
                            case t2_ of
                                TError info ->
                                    ({ctx|classtb=([],[])}, TError info, scc2)
                                
                                _ ->
                                    let
                                        newUpdates_1 =
                                            {value = VClosure p tf_ (drop (length envm) ctx2_.env),state=ctx1_.state}

                                        (ctx_, t1_, scc3) =
                                            uneval scc2 ctx t1 newUpdates_1
                                    in
                                    case t1_ of
                                        TError info ->
                                            ({ctx|classtb=([],[])}, TError info, scc3)
                                        
                                        _ ->
                                            let
                                                newCT =
                                                    appendCT ctx_.classtb ctx1_.classtb
                                                    |> appendCT ctx2_.classtb

                                                (newEnv, newCT_) =
                                                    mergeEnv ctx1_.env ctx_.env ctx.env newCT

                                            in
                                                ({env = newEnv
                                                , state = ctx_.state
                                                , classtb = newCT_
                                                }
                                                , TApp ws t1_ t2_
                                                , scc3
                                                )
                                        
                _ ->
                    ({ctx|classtb=([],[])}, TError "Not Appliable : 03.", scc)

        TLet ws p t1 t2 ->
            let
                (ctx_, term_, scc1) =
                    uneval scc ctx (TApp [] (TLam [] p t2) t1) updates
            in
            case term_ of
                TError info ->
                    ({ctx|classtb=([],[])}, TError info, scc1)

                TApp _ (TLam _ p_ t2_) t1_->
                    (ctx_, TLet ws p_ t1_ t2_, scc1)

                _ ->
                    ({ctx|classtb=([],[])}, TError ("Wrong Result When Updating Let Statement : "++(printTerm term_)), scc1)
        
        TLetrec ws p t1 t2 ->
            let
                (ctx_, term_, scc1) =
                    uneval scc ctx (TApp [] (TLam [] p t2) (TFix [] (TLam [] p t1))) updates
            in
            case term_ of
                TError info ->
                    ({ctx|classtb=([],[])}, TError info, scc1)

                TApp _ (TLam _ p_ t2_) (TFix _ (TLam _ _ t1_))->
                    (ctx_, TLetrec ws p_ t1_ t2_, scc1)

                _ ->
                    ({ctx|classtb=([],[])}, TError ("Wrong Result When Updating Letrec Statement : "++(printTerm term_)), scc1)

        TFix ws t ->
            let
                (ctx_, t_, scc1) =
                    uneval scc ctx (TApp [] t (TFix [] t)) updates

                newT =
                    case t_ of
                        TApp _ t1 (TFix _ t2) ->
                            if t2 /= t then t2 else t1
                        _ ->
                            TError ("Wrong Result When Updating Letrec Statement : "++(printTerm t_))
            in
                (ctx_, TFix ws newT, scc1)

        TCase ws1 (TVar ws2 s) branches ->
            let
                res = 
                    findByName s ctx.env 
            in
            case res of
                Just v ->
                    let
                        matchRes =
                            matchCase v branches

                        (ctx_, ti_, scc1) =
                            uneval scc {ctx|env=(matchRes.envm++ctx.env)} matchRes.ti updates
                    in
                    case ti_ of
                        TError info ->
                            ({ctx|classtb=([],[])}, TError info, scc1)

                        _ ->   
                            let 
                                branches_ =
                                    updateBranch branches matchRes.choice ti_
                                
                                len =
                                    length matchRes.envm

                                newV = matchRes.pi 
                                        |> patternSubst ctx_.env

                                env_ =
                                    ((s, newV) :: (drop (len + 1) ctx_.env))
                            in
                                ({ctx_|env=env_}, TCase ws1 (TVar ws2 s) branches_, scc1)
                
                Nothing ->
                    ({ctx|classtb=([],[])}, TError "No Such Variable : 03.", scc)

        TCons ws t1 t2 ->
            case updates.value of
                VCons v1 v2 ->
                    let
                        (_, state1, _) =
                            eval ctx.env ctx.state ctx.classtb t1

                        (ctx1_, t2_, scc1) =
                            uneval scc {ctx|state=state1} t2 {value=v2,state=updates.state}
                        
                        (ctx_, t1_, scc2) =
                            uneval scc1 ctx t1 {value=v1,state=ctx1_.state}
                        
                        newCT =
                            appendCT ctx1_.classtb ctx_.classtb

                        (newEnv, newCT_) =
                            mergeEnv ctx1_.env ctx_.env ctx.env newCT
                    in
                        ({env=newEnv,state=ctx_.state,classtb=newCT_}, TCons ws t1_ t2_, scc2)

                VNil ->
                    ({ctx|state=updates.state,classtb=([],[])}, TNil ws, scc)
                
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TList _ _ _ ->
            let
                (origin_val, _, _) =
                    eval ctx.env ctx.state ctx.classtb term

                (_, delta) =
                    diff origin_val updates.value
            in
                deltaUpdate term delta ctx updates.state scc

        TNil ws ->
            case updates.value of
                VNil ->
                    ({ctx|state=updates.state,classtb=([],[])}, TNil ws, scc)

                VCons _ _ ->
                    ({ctx|state=updates.state,classtb=([],[])}, valueToTerm updates.value ws, scc)

                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TEmpList _ ->
            let
                (origin_val, _, _) =
                    eval ctx.env ctx.state ctx.classtb term

                (_, delta) =
                    diff origin_val updates.value
            in
                deltaUpdate term delta ctx updates.state scc
        
        TTuple2 ws t1 t2 ->
            case updates.value of
                VTuple2 v1 v2 ->
                    let
                        (_, state1, _) =
                            eval ctx.env ctx.state ctx.classtb t1

                        (ctx1_, t2_, scc1) =
                            uneval scc {ctx|state=state1} t2 {value=v2,state=updates.state}

                        (ctx_, t1_, scc2) =
                            uneval scc1 ctx t1 {value=v1,state=ctx1_.state}

                        newCT =
                            appendCT ctx1_.classtb ctx_.classtb

                        (newEnv, newCT_) =
                            mergeEnv ctx1_.env ctx_.env ctx.env newCT
                    in
                        ({env=newEnv, state=ctx_.state, classtb=newCT_}, TTuple2 ws t1_ t2_, scc2)
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TTuple3 ws t1 t2 t3 ->
            case updates.value of
                VTuple3 v1 v2 v3 ->
                    let
                        (_, state1, _) =
                            eval ctx.env ctx.state ctx.classtb t1

                        (_, state2, _) =
                            eval ctx.env state1 ctx.classtb t2

                        (ctx2_, t3_, scc1) =
                            uneval scc {ctx|state=state2} t3 {value=v3,state=updates.state}

                        (ctx1_, t2_, scc2) =
                            uneval scc1 {ctx|state=state1} t2 {value=v2,state=ctx2_.state}

                        (ctx_, t1_, scc3) =
                            uneval scc2 ctx t1 {value=v1,state=ctx1_.state}

                        newCT =
                            appendCT ctx2_.classtb ctx1_.classtb
                            |> appendCT ctx_.classtb
                        
                        (newEnv1, newCT1) =
                            mergeEnv ctx1_.env ctx_.env ctx.env newCT

                        (newEnv2, newCT2) =
                            mergeEnv ctx2_.env newEnv1 ctx.env newCT1
                    in
                        ({env=newEnv2, state=ctx_.state, classtb=newCT2}, TTuple3 ws t1_ t2_ t3_, scc3)
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TBPrim ws op t1 t2 ->
            let
                logic_ =
                    logic scc ctx t1 t2 updates ws

                arith_ = 
                    arith scc ctx t1 t2 updates ws

                comp_ = 
                    comp scc ctx t1 t2 updates ws
            in
            case op of
                And -> logic_ And

                Or  -> logic_ Or
                
                Add -> arith_ Add

                Sub -> arith_ Sub

                Mul -> arith_ Mul

                Div -> arith_ Div

                RDiv -> arith_ RDiv

                Cat -> arith_ Cat
                
                _ -> comp_ op
        
        TUPrim ws op t ->
            unevalUnaryOperation ctx op t updates ws scc

        TParens ws t ->
            let
                (ctx_, t_, scc1) =
                    uneval scc ctx t updates
            in
                (ctx_, TParens ws t_, scc1)

        TRef ws t ->
            case updates.value of
                VLoc n ->
                    case (nth n updates.state) of
                        Just newV ->
                            case (unconsLast updates.state) of
                                Just (_, state1) ->
                                    let
                                        (ctx_, t_, scc1) =
                                            uneval scc ctx t {value=newV,state=state1}
                                    in
                                        (ctx_, TRef ws t_, scc1)

                                Nothing ->
                                    ({ctx|classtb=([],[])}, TError "Index Out of Range : 03.", scc)

                        Nothing ->
                            ({ctx|classtb=([],[])}, TError "Index Out Of Range : 04.", scc)

                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TDeRef ws t ->
            let
                (v1, _, _) =
                    eval ctx.env ctx.state ctx.classtb t
            in
            case v1 of
                VLoc n ->
                    case nth n ctx.state of
                        Just v2 ->
                            if v2 == updates.value then
                                let
                                    (ctx_, t_, scc1) =
                                        uneval scc ctx t {value=VLoc n,state=updates.state}
                                in
                                    (ctx_, TDeRef ws t_, scc1)
                            else
                                let
                                    newState =
                                        replace n updates.value updates.state                                    
                                    
                                    (ctx_, t_, scc1) =
                                        uneval scc ctx t {value=VLoc n,state=newState}
                                in
                                    (ctx_, TDeRef ws t_, scc1)

                        Nothing ->
                            ({ctx|classtb=([],[])}, TError "Error : 35.", scc)

                _ ->
                    ({ctx|classtb=([],[])}, TError "Error : 05.", scc)

        TAssign ws t1 t2 ->
            case updates.value of
                VUnit ->
                    let
                        (v1, state1, _) =
                            eval ctx.env ctx.state ctx.classtb t1
                        
                        (_, state2, _) =
                            eval ctx.env state1 ctx.classtb t2
                    in
                        case v1 of
                            VLoc n ->
                                case (nth n updates.state) of
                                    Just newV ->
                                        case (nth n state2) of
                                            Just oriV ->
                                                let
                                                    (ctx1_, t2_, scc1) =
                                                        uneval scc {ctx|state=state1} t2 {value=newV,state=replace n oriV updates.state}

                                                    (ctx_, t1_, scc2) =
                                                        uneval scc1 ctx t1 {value=VLoc n,state=ctx1_.state} 

                                                    (newEnv, newCT_) =
                                                        mergeEnv ctx1_.env ctx_.env ctx.env newCT
                                                    
                                                    newCT =
                                                        appendCT ctx1_.classtb ctx_.classtb
                                                in
                                                    ({env=newEnv, state=ctx_.state, classtb=newCT_}, TAssign ws t1_ t2_, scc2)

                                            Nothing ->
                                                ({ctx|classtb=([],[])}, TError "Index Out Of Range : 06.", scc)

                                    Nothing ->
                                        ({ctx|classtb=([],[])}, TError "Index Out Of Range : 07.", scc)

                            _ ->
                                ({ctx|classtb=([],[])}, TError "Error : 15.", scc)

                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)
        
        TUnit ws ->
            case updates.value of
                VUnit -> 
                    ({ctx|state=updates.state,classtb=([],[])}, TUnit ws, scc)
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TField ws t1 t2 ->
            case t2 of
                TVar _ f ->
                    let
                        (v1, _, _) =
                            eval ctx.env ctx.state ctx.classtb t1
                    in
                        case v1 of
                            VNew class args ->
                                let
                                    fields =
                                        getFields class ctx.classtb

                                    index =
                                        findFieldsIndex f (List.indexedMap Tuple.pair fields)

                                    args_ =
                                        vreplace index updates.value args
                                in
                                case args_ of
                                    VError info ->
                                        ({ctx|classtb=([],[])}, TError info, scc)
                                    
                                    _ ->
                                        let
                                            (ctx_, t1_, scc1) =
                                                uneval scc ctx t1 {value=VNew class args_,state=updates.state}
                                        in
                                            (ctx_, TField ws t1_ t2, scc1)

                            _ ->
                                ({ctx|classtb=([],[])}, TError "Not an Object : 03.", scc)

                _ ->
                    ({ctx|classtb=([],[])}, TError "Not a Variable : 03.", scc)

        TInvk ws t1 t2 ->
            case t2 of
                TVar _ m ->
                    let
                        (v1, _, _) =
                            eval ctx.env ctx.state ctx.classtb t1
                    in
                        case v1 of
                            VNew class _ ->
                                let
                                    res =
                                        findMethod m class ctx.classtb
                                in
                                    case res of
                                        Just _ ->
                                            case updates.value of
                                                VClosure _ t_ env_ ->
                                                    case env_ of
                                                        ("this", VNew c_ args)::_ ->
                                                            let
                                                                (newCT, subClass, scc1) =
                                                                    subclassing m c_ t_ ctx.classtb scc
                                                                
                                                                (ctx_, t1_, scc2) =
                                                                    uneval scc1 ctx t1 {value=VNew subClass args,state=updates.state}
                                                            in
                                                                ({ctx_|classtb=appendCT ctx_.classtb newCT}, TInvk ws t1_ t2, scc2)
                                                        _ ->
                                                            ({ctx|classtb=([],[])}, TError "Error : 06.", scc)

                                                _ ->
                                                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

                                        Nothing ->
                                            ({ctx|classtb=([],[])}, TError "No Such Method : 02.", scc)

                            _ -> ({ctx|classtb=([],[])}, TError "Not an Object : 04.", scc)

                _ -> ({ctx|classtb=([],[])}, TError "Not a Variable : 04.", scc)

        TNew ws _ args ->
            case updates.value of
                VNew class_ vargs_ ->
                    let
                        (ctx_, args_, scc1) =
                            uneval scc ctx args {value=vargs_,state=updates.state}
                    in
                        (ctx_, TNew ws class_ args_, scc1)

                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TError info ->
            ({ctx|classtb=([],[])}, TError info, scc)

        TSeq ws t1 t2 ->
            let
                (v1, state1, _) =
                    eval ctx.env ctx.state ctx.classtb t1
                
                (ctx1_, t2_, scc1) =
                    uneval scc {ctx|state=state1} t2 updates
                
                (ctx_, t1_, scc2) =
                    uneval scc1 ctx t1 {value=v1,state=ctx1_.state}

                (newEnv, newCT_) =
                    mergeEnv ctx1_.env ctx_.env ctx.env newCT

                newCT =
                    appendCT ctx1_.classtb ctx_.classtb
            in
                ({env=newEnv, state=ctx_.state, classtb=newCT_}, TSeq ws t1_ t2_, scc2)

        THtml ws s t1 t2 t3 ->
            case updates.value of
                VHtml _ v1 v2 v3 ->
                    let
                        (_, state1, _) =
                            eval ctx.env ctx.state ctx.classtb t1

                        (_, state2, _) =
                            eval ctx.env state1 ctx.classtb t2

                        (ctx2_, t3_, scc1) =
                            uneval scc {ctx|state=state2} t3 {value=v3,state=updates.state}

                        (ctx1_, t2_, scc2) =
                            uneval scc1 {ctx|state=state1} t2 {value=v2,state=ctx2_.state}

                        (ctx_, t1_, scc3) =
                            uneval scc2 ctx t1 {value=v1,state=ctx1_.state}

                        newCT =
                            appendCT ctx2_.classtb ctx1_.classtb
                            |> appendCT ctx_.classtb
                        
                        (newEnv1, newCT1) =
                            mergeEnv ctx1_.env ctx_.env ctx.env newCT

                        (newEnv2, newCT2) =
                            mergeEnv ctx2_.env newEnv1 ctx.env newCT1
                    in
                        ({env=newEnv2, state=ctx_.state, classtb=newCT2}, THtml ws s t1_ t2_ t3_, scc3)
                
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TToStr ws t ->
            case updates.value of
                VString _ ->
                    let
                        parseRes =
                            Value.parse (printString updates.value)
                    in
                    case parseRes of
                        Result.Ok newV ->
                            let
                                (ctx_, t_, scc1) =
                                    uneval scc ctx t {value=newV,state=updates.state}
                            in
                                (ctx_, TToStr ws t_, scc1)
                        
                        Result.Err info ->
                            ({ctx|classtb=([],[])}, TError (toString info), scc)

                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)

        TMap _ _ _ _ ->
            let
                (origin_val, _, _) =
                    eval ctx.env ctx.state ctx.classtb term
                
                (_, delta) =
                    diff origin_val updates.value
            in
                updateMap scc term delta ctx updates.state

        TLoc ws _ ->
            case updates.value of
                VLoc n_ ->
                    ({ctx|state=updates.state,classtb=([],[])}, TLoc ws n_, scc)
                
                _ ->
                    ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm term)), scc)
            
        _ -> ({ctx|classtb=([],[])}, TError ("Source Expression Error : "++(printTerm term)), scc)


logic : SubClsCnt -> Context -> Term -> Term -> Res -> WS -> Bop -> (Context, Term, SubClsCnt)
logic scc ctx t1 t2 updates ws op =
    let
        (v1, state1, _) =
            eval ctx.env ctx.state ctx.classtb t1
        
        (v2, _, _) =
            eval ctx.env state1 ctx.classtb t2

        (vo, _, _) =
            eval ctx.env ctx.state ctx.classtb (TBPrim [] op t1 t2)
        
        (newV_1, newV_2) =
            case vo of
                VTrue ->
                    case updates.value of
                        VTrue -> (v1, v2)

                        VFalse ->
                            case (v1, v2, op) of
                                -- Heuristic, only modify t1
                                (VTrue, VTrue, And) ->
                                    (VFalse, VTrue)
                                
                                (VTrue, VTrue, Or) ->
                                    (VFalse, VFalse)

                                (VTrue, VFalse, Or) ->
                                    (VFalse, VFalse)

                                (VFalse, VTrue, Or) ->
                                    (VFalse, VFalse)

                                _ ->
                                    (VError "", VError "")
                        
                        _ ->
                            (VError "", VError "")
                
                VFalse ->
                    case updates.value of
                        VFalse -> (v1, v2)

                        VTrue ->
                            case (v1, v2, op) of
                                -- Heuristic, only modify t1
                                (VFalse, VFalse, Or) ->
                                    (VTrue, VFalse)

                                (VFalse, VFalse, And) ->
                                    (VTrue, VTrue)

                                (VTrue, VFalse, And) ->
                                    (VTrue, VTrue)

                                (VFalse, VTrue, And) ->
                                    (VTrue, VTrue)

                                _ ->
                                    (VError "", VError "")

                        _ ->
                            (VError "", VError "")
                
                _ ->
                    (VError "", VError "")
    in
    case (newV_1, newV_2) of
        (VError _, VError _) ->
            ({ctx|classtb=([],[])}, TError ("Wrong Logic Expression : "++(printTerm (TBPrim ws op t1 t2))), scc)

        _ ->
            operationUpdate ctx op t1 t2 updates newV_1 newV_2 ws scc


arith : SubClsCnt -> Context -> Term -> Term -> Res -> WS -> Bop -> (Context, Term, SubClsCnt)
arith scc ctx t1 t2 updates ws op =
    let
        (v1, state1, _) =
            eval ctx.env ctx.state ctx.classtb t1
        
        (v2, _, _) =
            eval ctx.env state1 ctx.classtb t2
    in
    case updates.value of
        VInt n ->
            let
                (newV_1, newV_2) =
                    case (v1, v2) of
                        (VFloat n1, _) ->
                            case op of
                                Add -> (VFloat n1, VFloat (Round.roundNumCom 2 <| (toFloat n) - n1))

                                Sub -> (VFloat n1, VFloat (Round.roundNumCom 2 <| n1 - (toFloat n)))

                                Mul -> (VFloat n1, VFloat (Round.roundNumCom 2 <| (toFloat n) / n1))

                                Div -> (VFloat n1, VFloat (Round.roundNumCom 2 <| n1 / (toFloat n)))

                                _   -> (VError "", VError "")
                        
                        (_, VFloat n2) ->
                            case op of
                                Add -> (VFloat (Round.roundNumCom 2 <| (toFloat n) - n2), VFloat n2)

                                Sub -> (VFloat (Round.roundNumCom 2 <| (toFloat n) + n2), VFloat n2)

                                Mul -> (VFloat (Round.roundNumCom 2 <| (toFloat n) / n2), VFloat n2)

                                Div -> (VFloat (Round.roundNumCom 2 <| (toFloat n) * n2), VFloat n2)

                                _   -> (VError "", VError "")
                        
                        (VInt n1, VInt n2) ->
                            case op of
                                Add -> (VInt n1, VInt (n - n1))

                                Sub -> (VInt n1, VInt (n1 - n))

                                Mul ->
                                    if (n1 * n2) == n then
                                        (VInt n1, VInt n2)
                                    else if (modBy n1 n == 0) then
                                        (VInt n1, VInt (n // n1))
                                    else
                                        (VInt n1, VFloat (Round.roundNumCom 2 <| (toFloat n) / (toFloat n1)))

                                Div ->
                                    if (n1 // n2) == n && modBy n2 n1 == 0 then
                                        (VInt n1, VInt n2)
                                    else if (modBy n n1 == 0) then
                                        (VInt n1, VInt (n1 // n))
                                    else
                                        (VInt n1, VFloat ((toFloat n1) / (toFloat n)))

                                RDiv ->
                                    if (n1 // n2) == n then
                                        (VInt n1, VInt n2)
                                    else
                                        (VInt n1, VInt (n1 // n))

                                _   -> (VError "", VError "")
                        
                        _ -> (VError "", VError "")
            in
            case (newV_1, newV_2) of
                (VError _, VError _) ->
                    ({ctx|classtb=([],[])}, TError ("Wrong Arith Expression : "++(printTerm (TBPrim ws op t1 t2))), scc)

                _ ->
                    operationUpdate ctx op t1 t2 updates newV_1 newV_2 ws scc

        VFloat n ->
            let
                (newV_1, newV_2) =
                    case (v1, v2) of
                        
                        (VFloat n1, _) ->
                            case op of
                                Add -> (VFloat n1, VFloat (Round.roundNumCom 2 <| n - n1))

                                Sub -> (VFloat n1, VFloat (Round.roundNumCom 2 <| n1 - n))

                                Mul -> (VFloat n1, VFloat (Round.roundNumCom 2 <| n / n1))

                                Div -> (VFloat n1, VFloat (Round.roundNumCom 2 <| n1 / n))

                                _   -> (VError "", VError "")
                        
                        (_, VFloat n2) ->
                            case op of
                                Add -> (VFloat (Round.roundNumCom 2 <| n - n2), VFloat n2)

                                Sub -> (VFloat (Round.roundNumCom 2 <| n + n2), VFloat n2)

                                Mul -> (VFloat (Round.roundNumCom 2 <| n / n2), VFloat n2)

                                Div -> (VFloat (Round.roundNumCom 2 <| n * n2), VFloat n2)

                                _   -> (VError "", VError "")

                        (VInt n1, VInt n2) ->
                            case op of
                                Add -> (VInt n1, VFloat (Round.roundNumCom 2 <| n - (toFloat n1)))

                                Sub -> (VInt n1, VFloat (Round.roundNumCom 2 <| (toFloat n1) - n))

                                Mul ->
                                    if (toFloat <| n1 * n2) == n then
                                        (VInt n1, VInt n2)
                                    else
                                        (VInt n1, VFloat (Round.roundNumCom 2 <| n / (toFloat n1)))

                                Div ->
                                    if ((toFloat n1) / (toFloat n2)) == n then
                                        (VInt n1, VInt n2)
                                    else
                                        (VInt n1, VFloat ((toFloat n1) / n))

                                RDiv ->
                                    if (toFloat <| n1 // n2) == n then
                                        (VInt n1, VInt n2)
                                    else
                                        (VInt n1, VInt (truncate <| (toFloat n1) / n))

                                _   -> (VError "", VError "")
                        
                        _ -> (VError "", VError "")
            in
            case (newV_1, newV_2) of
                (VError _, VError _) ->
                    ({ctx|classtb=([],[])}, TError ("Wrong Arith Expression : "++(printTerm (TBPrim ws op t1 t2))), scc)

                _ ->
                    operationUpdate ctx op t1 t2 updates newV_1 newV_2 ws scc

        VCons _ _ ->
            if op == Cat then
                let
                    (newV_1, newV_2) =
                        vsplit updates.value ((vlength updates.value) - (vlength v2))
                in
                    operationUpdate ctx op t1 t2 updates newV_1 newV_2 ws scc
            else
                ({ctx|classtb=([],[])}, TError "Operator Error : 11.", scc)

        VNil ->
            if op == Cat then
                operationUpdate ctx op t1 t2 updates VNil VNil ws scc
            else
                ({ctx|classtb=([],[])}, TError "Operator Error : 12.", scc)

        VString s ->
            if op == Cat then
                let
                    newV_2 =
                        VString (String.right (vlength v2) s)
                    newV_1 =
                        VString (String.left ((vlength updates.value) - (vlength v2)) s)
                in
                    operationUpdate ctx op t1 t2 updates newV_1 newV_2 ws scc
            else
                ({ctx|classtb=([],[])}, TError "Operator Error : 16.", scc)

        _ -> 
            ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm (TBPrim ws op t1 t2))), scc)


comp : SubClsCnt -> Context -> Term -> Term -> Res -> WS -> Bop -> (Context, Term, SubClsCnt)
comp scc ctx t1 t2 updates ws op =
    let
        (v1, _, _) =
            eval ctx.env ctx.state ctx.classtb t1
    in
    case updates.value of
        VTrue ->
            case op of
                Eq ->
                    operationUpdate ctx op t1 t2 updates v1 v1 ws scc

                _ ->
                    let
                        (vo, _, _) =
                            eval ctx.env ctx.state ctx.classtb (TBPrim [] op t1 t2)
                        
                        newTerm =
                            case vo of
                                VTrue -> TBPrim ws op t1 t2
                                VFalse ->
                                    case op of
                                        Lt -> TBPrim ws Ge t1 t2
                                        Gt -> TBPrim ws Le t1 t2
                                        Le -> TBPrim ws Gt t1 t2
                                        Ge -> TBPrim ws Lt t1 t2
                                        _  ->
                                            TError ""
                                _ ->
                                    TError ("Error : 01.")
                    in
                        ({ctx|state=updates.state,classtb=([],[])}, newTerm, scc)

        VFalse ->
            let
                (vo, _, _) =
                    eval ctx.env ctx.state ctx.classtb (TBPrim [] op t1 t2)
                
                newTerm =
                    case vo of
                        VFalse -> TBPrim ws op t1 t2
                        VTrue ->
                            case op of
                                Lt -> TBPrim ws Ge t1 t2
                                Gt -> TBPrim ws Le t1 t2
                                Le -> TBPrim ws Gt t1 t2
                                Ge -> TBPrim ws Lt t1 t2
                                Eq -> TError ("Cannot Infer : "++(printValue updates.value)++"->"++(printTerm (TBPrim ws op t1 t2)))
                                _  -> TError ""
                        _ ->
                            TError ("Error : 02.")
            in
                ({ctx|state=updates.state,classtb=([],[])}, newTerm, scc)

        _ ->
            ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm (TBPrim ws op t1 t2))), scc)


operationUpdate : Context -> Bop -> Term -> Term -> Res -> Value -> Value -> WS -> SubClsCnt -> (Context, Term, SubClsCnt)
operationUpdate ctx op t1 t2 updates newV_1 newV_2 ws scc =
    let
        (_, state1, _) =
            eval ctx.env ctx.state ctx.classtb t1
        
        (ctx1_, t2_, scc1) =
            uneval scc {ctx|state=state1} t2 {value=newV_2,state=updates.state}

        (ctx_, t1_, scc2) =
            uneval scc1 ctx t1 {value=newV_1, state=ctx1_.state}
        
        (newEnv, newCT_) =
            mergeEnv ctx_.env ctx1_.env ctx.env newCT

        newCT =
            appendCT ctx1_.classtb ctx_.classtb
    in
        ({env=newEnv, state=ctx_.state, classtb=newCT_}, TBPrim ws op t1_ t2_, scc2)


unevalUnaryOperation : Context -> Uop -> Term -> Res -> WS -> SubClsCnt -> (Context, Term, SubClsCnt)
unevalUnaryOperation ctx op t updates ws scc =
    let 
        (v, _, _) = 
            eval ctx.env ctx.state ctx.classtb t
    in
    case op of
        Not ->
            case v of
                VTrue ->
                    case updates.value of
                        VTrue ->
                            let
                                (ctx_, t_, scc1) =
                                    uneval scc ctx t {value=VFalse,state=updates.state}
                            in
                                (ctx_, TUPrim ws op t_, scc1)

                        VFalse ->
                            ({ctx|state=updates.state,classtb=([],[])}, TUPrim ws op t, scc)

                        _ -> 
                            ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm (TUPrim ws op t))), scc)

                VFalse ->
                    case updates.value of
                        VTrue ->
                            ({ctx|state=updates.state,classtb=([],[])}, TUPrim ws op t, scc)

                        VFalse ->
                            let
                                (ctx_, t_, scc1) =
                                    uneval scc ctx t {value=VTrue,state=updates.state}
                            in
                                (ctx_, TUPrim ws op t_, scc1)

                        _ -> 
                            ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm (TUPrim ws op t))), scc)
                
                _ ->
                    ({ctx|classtb=([],[])}, TError "Error : 03.", scc)

        Neg ->
            case v of
                VInt n ->
                    case updates.value of
                        VInt n_ ->
                            if n == (-n_) then 
                                ({ctx|state=updates.state,classtb=([],[])}, TUPrim ws op t, scc)
                            else
                                let
                                    (ctx_, t_, scc1) =
                                        uneval scc ctx t {value=VInt (-n_),state=updates.state}
                                in
                                    (ctx_, TUPrim ws op t_, scc1)

                        VFloat n_ ->
                            if (toFloat n) == -n_ then 
                                ({ctx|state=updates.state,classtb=([],[])}, TUPrim ws op t, scc)
                            else
                                let
                                    (ctx_, t_, scc1) =
                                        uneval scc ctx t {value=VFloat (-n_),state=updates.state}
                                in
                                    (ctx_, TUPrim ws op t_, scc1)

                        _ -> 
                            ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm (TUPrim ws op t))), scc)

                VFloat n ->
                    case updates.value of
                        VInt n_ ->
                            if n == toFloat (-n_) then 
                                ({ctx|state=updates.state,classtb=([],[])}, TUPrim ws op t, scc)
                            else
                                let
                                    (ctx_, t_, scc1) =
                                        uneval scc ctx t {value=VFloat (toFloat (-n_)),state=updates.state}
                                in
                                    (ctx_, TUPrim ws op t_, scc1)

                        VFloat n_ ->
                            if n == (-n_) then 
                                ({ctx|state=updates.state,classtb=([],[])}, TUPrim ws op t, scc)
                            else
                                let
                                    (ctx_, t_, scc1) =
                                        uneval scc ctx t {value=VFloat (-n_),state=updates.state}
                                in
                                    (ctx_, TUPrim ws op t_, scc1)

                        _ -> 
                            ({ctx|classtb=([],[])}, TError ("Update Error : "++(printValue updates.value)++"->"++(printTerm (TUPrim ws op t))), scc)

                
                _ ->
                    ({ctx|classtb=([],[])}, TError "Error : 04.", scc)


deltaUpdate : Term -> List DiffOp -> Context -> State -> SubClsCnt -> (Context, Term, SubClsCnt)
deltaUpdate term delta ctx newState scc =
    case term of
        TList ws t1 t2 ->
            case delta of
                Keep _ :: resDelta ->
                    let
                        (v1, state1, _) =
                            eval ctx.env ctx.state ctx.classtb t1

                        (ctx1_, t2_, scc1) =
                            deltaUpdate t2 resDelta {ctx|state=state1} newState scc

                        -- in case there is an assignment in t1
                        (ctx_, t1_, scc2) =
                            uneval scc1 ctx t1 {value=v1, state=ctx1_.state}

                        (newEnv, newCT_) =
                            mergeEnv ctx_.env ctx1_.env ctx.env newCT

                        newCT =
                            appendCT ctx_.classtb ctx1_.classtb
                    in
                        ({ctx_|env=newEnv,classtb=newCT_}, TList ws t1_ t2_, scc2)
                
                Delete :: resDelta ->
                    let
                        (v1, state1, _) =
                            eval ctx.env ctx.state ctx.classtb t1
                    
                        -- Deleting t1 means also deleting the side effects in t1
                        (ctx1_, t2_, scc1) =
                            deltaUpdate t2 resDelta {ctx|state=state1} newState scc

                        (ctx_, _, scc2) = 
                            uneval scc1 ctx t1 {value=v1, state=ctx1_.state}
                    in
                        case t2_ of
                            TList _  t ts ->
                                ({ctx1_|state=ctx_.state,classtb=([],[])}, TList ws t ts, scc2)
                            
                            TEmpList _ ->
                                ({ctx1_|state=ctx_.state,classtb=([],[])}, TEmpList ws, scc2)
                        
                            _ ->
                                ({ctx|classtb=([],[])}, TError "Error : 31.", scc2)
                
                Insert v :: resDelta ->
                    let
                        (ctx_, term_, scc1) =
                            deltaUpdate term resDelta ctx newState scc

                        t_ =
                            case v of
                                VCons _ _ ->
                                    valueToTerm v ["", ""]

                                _ ->
                                    valueToTerm v [""]
                    in
                        (ctx_, TList ws t_ term_, scc1)
                
                Update v :: resDelta ->
                    let
                        (_, state1, _) =
                            eval ctx.env ctx.state ctx.classtb t1

                        (ctx1_, t2_, scc1) =
                            deltaUpdate t2 resDelta {ctx|state=state1} newState scc

                        (ctx_, t1_, scc2) =
                            uneval scc1 ctx t1 {value=v, state=ctx1_.state}
                        
                        (newEnv, newCT_) =
                            mergeEnv ctx_.env ctx1_.env ctx.env newCT

                        newCT =
                            appendCT ctx_.classtb ctx1_.classtb
                    in
                        ({ctx_|env=newEnv, classtb=newCT_}, TList ws t1_ t2_, scc2)

                [] ->
                    ({ctx|classtb=([],[])}, TError "Diff Solve Error : 01.", scc)

        TEmpList ws ->
            case delta of
                (Insert v) :: resDelta ->
                    let
                        (ctx_, term_, scc1) =
                            deltaUpdate term resDelta ctx newState scc

                        t_ =
                            case v of
                                VCons _ _ ->
                                    valueToTerm v ["", ""]

                                _ ->
                                    valueToTerm v [""]               
                    in
                        (ctx_, TList ws t_ term_, scc1)

                [] ->
                    ({ctx|state=newState,classtb=([],[])}, TEmpList ws, scc)
                
                _ ->
                    ({ctx|classtb=([],[])}, TError "Diff Solve Error : 02.", scc)

        _ ->
            ({ctx|classtb=([],[])}, TError "Delta Update is only available for lists and strings.", scc)


updateMap : SubClsCnt -> Term -> List DiffOp -> Context -> State -> (Context, Term, SubClsCnt)
updateMap scc term delta ctx newState =
    case term of
        TMap ws d f ls ->
            let
                (v1, state1, _) =
                    eval ctx.env ctx.state ctx.classtb f

                (v2, _, _) =
                    eval ctx.env state1 ctx.classtb ls
            in
            case v2 of
                VCons _ _ ->
                    let
                        (ctx_, t_, scc1) =
                            updateMapHelper v1 v2 delta ctx newState state1 f ls d scc
                    in
                        (ctx_, TMap ws d f t_, scc1)

                VNil ->
                    let
                        (ctx_, t_, scc1) =
                            updateMapHelper v1 v2 delta ctx newState state1 f ls d scc
                    in
                        (ctx_, TMap ws d f t_, scc1)

                _ ->
                    ({ctx|classtb=([],[])}, TError "The third argument to map_ must be a list : 02.", scc)

        _ ->
            ({ctx|classtb=([],[])}, TError "Error : 26.", scc)


updateMapHelper : Value -> Value -> List DiffOp -> Context -> State -> State ->
                    Term -> Term -> Term -> SubClsCnt -> (Context, Term, SubClsCnt)
updateMapHelper v1 v2 delta ctx newState state1 f ls d scc =
    let
        (v2_, scc1) =
            updateMap_ f v2 delta ctx d newState scc

        (ctx1_, ls_, scc2) =
            uneval scc1 {ctx|state=state1} ls {value=v2_, state=newState}

        (ctx_, _, scc3) =
            uneval scc2 ctx f {value=v1, state=ctx1_.state}

        (newEnv, newCT_) =
            mergeEnv ctx1_.env ctx_.env ctx.env newCT

        newCT =
            appendCT ctx1_.classtb ctx_.classtb
    in
        ({ctx_|env=newEnv, classtb=newCT_}, ls_, scc3)


updateMap_ : Term -> Value -> List DiffOp -> Context -> Term -> State -> SubClsCnt -> (Value, SubClsCnt)
updateMap_ f v delta ctx default newState scc =
    case v of
        VCons _ v2 ->
            case delta of
                (Keep v_) :: resDelta ->
                    let
                        (v2_, scc1) =
                            updateMap_ f v2 resDelta ctx default newState scc
                        
                        (_, res, scc2) =
                            uneval scc1 ctx (TApp [] f default) {value=v_,state=newState}
                    in
                        case res of
                            TApp _ _ default_ ->
                                let
                                    (v1_, _, _) =
                                        eval [] [] ([],[]) default_
                                in
                                    (VCons v1_ v2_, scc2)

                            _ ->
                                (VError "Error : 32.", scc2)
                
                Delete :: resDelta ->
                    updateMap_ f v2 resDelta ctx default newState scc
                
                (Insert v_) :: resDelta ->
                    let
                        (v2_, scc1) =
                            updateMap_ f v resDelta ctx default newState scc

                        (_, res, scc2) =
                            uneval scc1 ctx (TApp [] f default) {value=v_,state=newState}
                    in
                        case res of
                            TApp _ _ default_ ->
                                let
                                    (v1_, _, _) =
                                        eval [] [] ([],[]) default_
                                in
                                    (VCons v1_ v2_, scc2)

                            _ ->
                                (VError "Error : 28.", scc2)
                
                (Update v_) :: resDelta ->
                    let
                        (v2_, scc1) =
                            updateMap_ f v2 resDelta ctx default newState scc

                        (_, res, scc2) =
                            uneval scc1 ctx (TApp [] f default) {value=v_,state=newState}
                    in
                        case res of
                            TApp _ _ default_ ->
                                let
                                    (v1_, _, _) =
                                        eval [] [] ([],[]) default_
                                in
                                    (VCons v1_ v2_, scc2)

                            _ ->
                                (VError "Error : 29.", scc2)

                [] ->
                    (VError "Diff Solve Error : 05.", scc)

        VNil ->
            case delta of
                (Insert v_) :: resDelta ->
                        let
                            (v2_, scc1) =
                                updateMap_ f VNil resDelta ctx default newState scc

                            (_, res, scc2) =
                                uneval scc1 ctx (TApp [] f default) {value=v_,state=newState}
                        in
                            case res of
                                TApp _ _ default_ ->
                                    let
                                        (v1_, _, _) =
                                            eval [] [] ([],[]) default_
                                    in
                                        (VCons v1_ v2_, scc2)

                                _ ->
                                    (VError "Error : 30.", scc2)

                [] ->
                    (VNil, scc)
                
                _ ->
                    (VError "Diff Solve Error : 06.", scc)

        _ ->
            (VError "Error : 27.", scc)