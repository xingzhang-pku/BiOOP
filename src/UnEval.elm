module UnEval exposing (..)

import List exposing (..)
import Model exposing (..)
import Syntax exposing (..)
import LangUtils exposing (..)
import Utils exposing (nth)
import Eval exposing (eval)
import HtmlParser exposing (parseHtml)
import Parser_ exposing (parse, parseVal)
import String exposing (left)


updateCode : Model -> (HEnv, Code)
updateCode model =
    let
        pOutput =
            case model.mode of
                HTML ->
                    parseHtml model.output model.context
                
                Console ->
                    let
                        resOutput =
                            parseVal model.output model.context
                    in
                    case resOutput of
                        Result.Ok res -> res
                        Result.Err _ ->
                            VError "Parse Value Error."

        pCode =
            case parse model.codeBackup of
                Result.Ok res -> res
                Result.Err _ ->
                    EError "Parse Code Error."
    in
    case (pOutput, pCode) of  
    (VError _, _) ->
        ([], "Parse Output Error.")
    (_, EError _) ->
        ([], "Parse Code Error.")
    _ ->
        let
            (expr, _) = 
                processAfterParse pCode [] holeIDStart
            
            upRes = 
                uneval model.hbBackup [] expr pOutput holeAddedByUserStart

            (expr_, _, henv_) = 
                processBeforePrint upRes.expr [] holeIDStart upRes.henv
            newCode =
                printAST expr_
        in
            (henv_, newCode)


updateContext : Int -> String -> Model -> List Value
updateContext index newVal model =
    let
        res1 = 
            parseVal newVal [] 
    in
    case res1 of
        Result.Ok val ->
            updateValue index val model

        Result.Err _ ->
            if left 1 newVal == "<" then
                let
                    res2 =
                        parseHtml newVal []
                in
                case res2 of
                    VError _ ->
                        []
                    
                    val ->
                        updateValue index val model
            else
                []


updateValue : Int -> Value -> Model -> List Value
updateValue index val model =
    let 
        ccHoleName = 
            model.currentContext 
        
        res =
            findHole ccHoleName model.context
    in
    case res of
        Just (IndexedHole hn venv) ->
            let
                newVenv =
                    updateCurrentVenv index val model.path venv

                newCurrent =
                    IndexedHole hn newVenv
            in
                updateContextElem newCurrent model.context

        _ -> []


updateCurrentVenv : Int -> Value -> Path -> IndexedVEnv -> IndexedVEnv
updateCurrentVenv n val path venv =
    case path of
        (_, m, _)::pt ->
            let 
                res = 
                    nth m venv 
            in
            case res of
                Just (_, _, v) ->
                    case v of
                
                        (IndexedHole h1 venv1) ->
                            let 
                                venv2 = 
                                    updateCurrentVenv n val pt venv1 
                            in
                                updateNthElm m (IndexedHole h1 venv2) venv
                        
                        _ -> []
                
                Nothing -> []
        
        [] ->  
            updateNthElm n val venv


updateNthElm : Int -> Value -> IndexedVEnv -> IndexedVEnv
updateNthElm n v venv =
    case n of
        0 ->
            case venv of
                (id, s, _)::venv_ ->
                    (id, s, v)::venv_
                [] -> []
        _ ->
            case venv of
                val :: venv_ ->
                    val::(updateNthElm (n - 1) v venv_)
                [] -> []


updateContextElem : Value -> List Value -> List Value
updateContextElem v context =
    case v of
        IndexedHole hn venv ->
            case context of

                (IndexedHole hn_ venv_)::ct ->
                    if hn_ == hn
                    then (IndexedHole hn venv)::ct
                    else (IndexedHole hn_ venv_)::(updateContextElem v ct)
            
                _ -> []
        
        _ -> []


uneval : HEnv -> VEnv -> Expr -> Value -> HTotal -> UnEvalRes
uneval henv venv expr newv htotal =
    case expr of
        EVar _ s ->
            case newv of
                VError info ->  
                    { henv = henv
                    , venv = venv
                    , expr = EError ("Variable Update Error: " ++ info)
                    , htotal = 0
                    }
                
                _ ->
                    { henv = henv
                    , venv = updateElmInVenv s newv venv
                    , expr = expr
                    , htotal = htotal
                    }

        ELam ws _ _ ->
            case newv of
                VClosure p_ e_ venv_ ->
                    { henv = henv
                    , venv = venv_
                    , expr = ELam ws p_ e_
                    , htotal = htotal
                    }
                
                _ ->
                    { henv = henv
                    , venv = venv
                    , expr = EError "Function Closure Update Error."
                    , htotal = 0
                    }

        ELet ws p e1 e2 ->
            let
                res =
                    uneval henv venv 
                        (EApp defaultWS (ELam defaultWS p e2) e1) newv htotal
            in
            case res.expr of
                EError info ->
                    { henv = []
                    , venv = []
                    , expr = EError info
                    , htotal = 0
                    }

                EApp _ (ELam _ p_ e2_) e1_->
                    { henv = res.henv
                    , venv = res.venv
                    , expr = ELet ws p_ e1_ e2_
                    , htotal = res.htotal
                    }

                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "ELet Update Error."
                    , htotal = 0
                    }

        ELetrec ws p e1 e2 ->
            let 
                res =
                    uneval henv venv 
                        (EApp ws (ELam defaultWS p e2) (EFix defaultWS (ELam defaultWS p e1))) newv htotal
            in
            case res.expr of
                EError info ->
                    { henv = []
                    , venv = []
                    , expr = EError info
                    , htotal = 0
                    }

                EApp _ (ELam _ p_ e2_) (EFix _ (ELam _ _ e1_))->
                    { henv = res.henv
                    , venv = res.venv
                    , expr = ELetrec ws p_ e1_ e2_
                    , htotal = res.htotal
                    }

                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "ELetrec Update Error."
                    , htotal = 0
                    }

        EApp ws e1 (EFix _ e2) ->
            let 
                (v1, _) = 
                    eval henv venv e1 [] 
            in
            case v1 of
                VClosure p ef venvf ->
                    case p of
                        PVar _ s  ->
                            let
                                res1 =
                                    uneval henv ((s, VFix e2)::venvf) ef newv htotal 
                            in
                            case res1.expr of
                                EError info ->
                                    { henv = []
                                    , venv = []
                                    , expr = EError info
                                    , htotal = 0
                                    }
                                
                                _ ->
                                    let 
                                        droplen =
                                            lengthUntil s res1.venv

                                        res1_venv =
                                            drop droplen res1.venv

                                        newv1 =
                                            VClosure p res1.expr (drop 1 res1_venv)
                                        
                                        res2 =
                                            uneval henv venv e1 newv1 res1.htotal
                                    in
                                    case res2.expr of
                                        EError info ->
                                            { henv = []
                                            , venv = []
                                            , expr = EError info
                                            , htotal = 0
                                            }
                                        
                                        _ ->
                                            case (head res1_venv) of
                                                Just (_, VClosure np ne nvenv) -> 
                                                    let
                                                        newv2 =
                                                            VClosure np ne nvenv
                                                        
                                                        res3 =
                                                            uneval henv venv (EFix defaultWS e2) newv2 res2.htotal
                                                        
                                                        newhenv =
                                                            mergeHEnv3 henv res3.henv res1.henv
                                                    in
                                                        { henv = newhenv
                                                        , venv = venv
                                                        , expr = EApp ws res2.expr res3.expr
                                                        , htotal = res3.htotal
                                                        }

                                                Just (_, VFix e21) ->
                                                    -- let
                                                    --     newhenv =
                                                    --         mergeHEnv3 henv res2.henv res1.henv
                                                    -- in
                                                        { henv = res1.henv
                                                        , venv = venv
                                                        , expr = EApp ws res2.expr (EFix defaultWS e21)
                                                        , htotal = res2.htotal
                                                        }
                                                
                                                Just (_, VError info) ->
                                                    { henv = []
                                                    , venv = []
                                                    , expr = EError info
                                                    , htotal = 0
                                                    }
                                                
                                                _       ->
                                                    { henv = []
                                                    , venv = []
                                                    , expr = EError "Recursion Update Error: 01"
                                                    , htotal = 0
                                                    }
                        
                        _ ->
                            { henv = henv
                            , venv = venv
                            , expr = EError "Recursion Update Error: 02"
                            , htotal = 0
                            }

                _ ->
                    { henv = henv
                    , venv = venv
                    , expr = EError "Recursion Update Error: 03"
                    , htotal = 0
                    }

        EApp ws e1 e2 ->
            let 
                (v1, _) = 
                    eval henv venv e1 [] 
            in
            case v1 of
                VClosure p ef venvf ->
                    let 
                        (v2, _) =
                            eval henv venv e2 []
                        
                        venvm =
                            match p v2

                        res1 =
                            uneval henv (venvm++venvf) ef newv htotal 
                    in
                    case res1.expr of
                        EError info ->
                            { henv = []
                            , venv = []
                            , expr = EError info
                            , htotal = 0
                            }
                        
                        _ ->
                            let 
                                newv1 =
                                    VClosure p res1.expr (drop (length venvm) res1.venv)
                                
                                res2 =
                                    uneval henv venv e1 newv1 res1.htotal
                            in
                            case res2.expr of
                                EError info ->
                                    { henv = []
                                    , venv = []
                                    , expr = EError info
                                    , htotal = 0
                                    }
                                
                                _ ->
                                    let
                                        newv2 =   
                                            patternSubst res1.venv p
                                        
                                        res3 =
                                            uneval henv venv e2 newv2 res2.htotal
                                    in
                                    case res3.expr of
                                        EError info ->
                                            { henv = []
                                            , venv = []
                                            , expr = EError info
                                            , htotal = 0
                                            } 
                                        
                                        _ ->
                                            let
                                                newvenv =
                                                    mergeVEnv res2.venv res3.venv venv

                                                newhenv =
                                                    mergeHEnv3 henv res3.henv res1.henv
                                            in
                                                { henv = newhenv
                                                , venv = newvenv
                                                , expr = EApp ws res2.expr res3.expr
                                                , htotal = res3.htotal
                                                }
                                        
                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "Application Update Error."
                    , htotal = 0
                    }

        EInt ws _ ->
            case newv of
                VInt n_ ->
                    { henv = henv
                    , venv = venv
                    , expr = EInt ws n_
                    , htotal = htotal
                    }
                
                VHole _ venv_ ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                    { henv = henv
                    , venv = newvenv
                    , expr = EHole ws (HOri htotal)
                    , htotal = htotal + 1
                    }
                
                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "Int Constant Update Error."
                    , htotal = 0
                    }

        EFloat ws _ ->
            case newv of
                VInt n_ ->
                    { henv = henv
                    , venv = venv
                    , expr = EFloat ws (toFloat n_)
                    , htotal = htotal
                    }

                VFloat n_ ->
                    { henv = henv
                    , venv = venv
                    , expr = EFloat ws n_
                    , htotal = htotal
                    }
                
                VHole _ venv_ ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                    { henv = henv
                    , venv = newvenv
                    , expr = EHole ws (HOri htotal)
                    , htotal = htotal + 1
                    }
                
                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "Float Constant Update Error."
                    , htotal = 0
                    }

        ETrue ws ->
            case newv of
                VTrue ->
                    { henv = henv
                    , venv = venv
                    , expr = ETrue ws
                    , htotal = htotal
                    }

                VFalse ->
                    { henv = henv
                    , venv = venv
                    , expr = EFalse ws
                    , htotal = htotal
                    }
                
                VHole _ venv_ ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                    { henv = henv
                    , venv = newvenv
                    , expr = EHole ws (HOri htotal)
                    , htotal = htotal + 1
                    }
                
                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "True Constant Update Error."
                    , htotal = 0
                    }

        EFalse ws ->
            case newv of
                VTrue ->
                    { henv = henv
                    , venv = venv
                    , expr = ETrue ws
                    , htotal = htotal
                    }

                VFalse ->
                    { henv = henv
                    , venv = venv
                    , expr = EFalse ws
                    , htotal = htotal
                    }

                VHole _ venv_ ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                    { henv = henv
                    , venv = newvenv
                    , expr = EHole ws (HOri htotal)
                    , htotal = htotal + 1
                    }

                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "False Constant Update Error."
                    , htotal = 0
                    }

        EChar ws _ ->
            case newv of
                VChar c_ ->
                    { henv = henv
                    , venv = venv
                    , expr = EChar ws c_
                    , htotal = htotal
                    }

                VHole _ venv_ ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                    { henv = henv
                    , venv = newvenv
                    , expr = EHole ws (HOri htotal)
                    , htotal = htotal + 1
                    }

                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "Char Constant Update Error."
                    , htotal = 0
                    }

        ECons ws e1 e2 ->
            case newv of
                VCons _ v1 v2 ->
                    let
                        res1 =
                            uneval henv venv e1 v1 htotal

                        res2 = 
                            uneval henv venv e2 v2 res1.htotal
                        
                        newvenv =
                            mergeVEnv res1.venv res2.venv venv

                        newhenv =
                            mergeHEnv3 henv res1.henv res2.henv
                    in
                        { henv = newhenv
                        , venv = newvenv
                        , expr = ECons ws res1.expr res2.expr
                        , htotal = res2.htotal
                        }

                VNil _ ->
                    { henv = henv
                    , venv = venv
                    , expr = ENil ws
                    , htotal = htotal
                    }

                VHole _ venv_ ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                    { henv = henv
                    , venv = newvenv
                    , expr = EHole ws (HOri htotal)
                    , htotal = htotal + 1
                    }

                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "List Update Error."
                    , htotal = 0
                    }

        EBTuple ws e1 e2 ->
            case newv of
                VBTuple v1 v2 ->
                    let
                        res1 =
                            uneval henv venv e1 v1 htotal

                        res2 = 
                            uneval henv venv e2 v2 res1.htotal
                        
                        newvenv =
                            mergeVEnv res1.venv res2.venv venv

                        newhenv =
                            mergeHEnv3 henv res1.henv res2.henv
                    in
                        { henv = newhenv
                        , venv = newvenv
                        , expr = EBTuple ws res1.expr res2.expr
                        , htotal = res2.htotal
                        }

                VHole hn venv_ ->
                    let
                        res1 =
                            uneval henv venv e1 (VHole hn venv_) htotal

                        res2 = 
                            uneval henv venv e2 (VHole hn venv_) res1.htotal
                        
                        newvenv =
                            mergeVEnv res1.venv res2.venv venv

                        newhenv =
                            mergeHEnv3 henv res1.henv res2.henv
                    in
                        { henv = newhenv
                        , venv = newvenv
                        , expr = EBTuple ws res1.expr res2.expr
                        , htotal = res2.htotal
                        }

                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "Tuple2 Update Error."
                    , htotal = 0
                    }
        
        ETTuple ws e1 e2 e3 ->
            case newv of
                VTTuple v1 v2 v3 ->
                    let
                        res1 =
                            uneval henv venv e1 v1 htotal

                        res2 = 
                            uneval henv venv e2 v2 res1.htotal

                        res3 = 
                            uneval henv venv e3 v3 res2.htotal
                        
                        newvenv =
                            mergeVEnv4 res1.venv res2.venv res3.venv venv

                        newhenv =
                            mergeHEnv4 henv res1.henv res2.henv res3.henv
                    in
                        { henv = newhenv
                        , venv = newvenv
                        , expr = ETTuple ws res1.expr res2.expr res3.expr
                        , htotal = res3.htotal
                        }

                VHole hn venv_ ->
                    let
                        res1 =
                            uneval henv venv e1 (VHole hn venv_) htotal

                        res2 = 
                            uneval henv venv e2 (VHole hn venv_) res1.htotal

                        res3 = 
                            uneval henv venv e3 (VHole hn venv_) res2.htotal
                        
                        newvenv =
                            mergeVEnv4 res1.venv res2.venv res3.venv venv

                        newhenv =
                            mergeHEnv4 henv res1.henv res2.henv res3.henv
                    in
                        { henv = newhenv
                        , venv = newvenv
                        , expr = ETTuple ws res1.expr res2.expr res3.expr
                        , htotal = res3.htotal
                        }

                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "Tuple3 Update Error."
                    , htotal = 0
                    }

        EHtml ws s e1 e2 e3 ->
            case newv of
                VHtml _ v1 v2 v3 ->
                    let
                        res1 =
                            uneval henv venv e1 v1 htotal

                        res2 = 
                            uneval henv venv e2 v2 res1.htotal

                        res3 = 
                            uneval henv venv e3 v3 res2.htotal
                        
                        newvenv =
                            mergeVEnv4 res1.venv res2.venv res3.venv venv

                        newhenv =
                            mergeHEnv4 henv res1.henv res2.henv res3.henv
                    in
                        { henv = newhenv
                        , venv = newvenv
                        , expr = EHtml ws s res1.expr res2.expr res3.expr
                        , htotal = res3.htotal
                        }

                _ -> let _ = newv in
                    { henv = []
                    , venv = []
                    , expr = EError "HTML Update Error."
                    , htotal = 0
                    }

        ENil ws ->
            case newv of
                VNil _ ->
                    { henv = henv
                    , venv = venv
                    , expr = ENil ws
                    , htotal = htotal
                    }
                
                VCons _ _ _ ->
                    let
                        (ne, htotal1) =
                            valueToExpr newv htotal
                        
                        newe =
                            case ne of
                                ECons _ e1 e2 ->
                                    case ws of
                                        ([_, ws2], 5) ->
                                            changeWsForList ([" "], eoElm) e2
                                                |> ECons ([" ", ws2], eoSquare) e1
                                        
                                        (_, 1) ->
                                            changeWsForList ([], eoElm) ne

                                        ([ws1], 3) ->
                                            changeWsForList ([" "], esElm) e2
                                                |> ECons ([ws1], esQuo) e1
                                                
                                        (_, 4) ->
                                            changeWsForList ([], esElm) ne

                                        _ ->
                                            EError "Nil Expr WS Error."
                                
                                _ ->
                                    EError "Value To Expr Error."
                    in                            
                        { henv = henv
                        , venv = venv
                        , expr = newe
                        , htotal = htotal1
                        }

                VHole _ venv_ ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                    { henv = henv
                    , venv = newvenv
                    , expr = EHole ws (HOri htotal)
                    , htotal = htotal + 1
                    }

                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "Nil List Update Error."
                    , htotal = 0
                    }

        EHole ws u ->
            let
                save =
                    case newv of
                        VInt _        -> newv
                        VFloat _      -> newv
                        VTrue         -> newv
                        VFalse        -> newv
                        VCons _ _ _   -> newv
                        VNil _        -> newv
                        VBTuple _ _   -> newv
                        VTTuple _ _ _ -> newv
                        _         -> VError ""
            in
            case save of
                VError _ ->
                    case newv of
                        VHole _ venv_ ->
                            let
                                newvenv =
                                    if venv_ == [] then venv else venv_
                            in
                            { henv = henv
                            , venv = newvenv
                            , expr = EHole ws u
                            , htotal = htotal
                            }

                        _ ->
                            { henv = []
                            , venv = []
                            , expr = EError "Hole Update Error."
                            , htotal = 0
                            }
                
                _ ->
                    { henv = insert (u, venv, save) henv
                    , venv = venv
                    , expr = EHole ws u
                    , htotal = htotal
                    }

        EFix ws e ->
            let
                res =
                    uneval henv venv (EApp defaultWS e (EFix defaultWS e)) newv htotal

                e_ =
                    case res.expr of
                        EApp _ e1 (EFix _ e2) ->
                            if e2 /= e then e2 else e1
                        _ ->
                            EError "Fix Update Error."
            in
                { henv = res.henv
                , venv = res.venv
                , expr = EFix ws e_
                , htotal = res.htotal
                }

        ECase ws1 (EVar ws2 s) branches ->
            let
                res = 
                    findVarByName s venv 
            in
            case (res, newv) of
                (Just (VHole _ _), VHole _ venv_) ->
                    { henv = henv
                    , venv = venv_
                    , expr = ECase ws1 (EVar ws2 s) branches
                    , htotal = htotal
                    }

                (Just v, _) ->
                    let
                        tryRes = 
                            case v of
                                VHole _ _ ->
                                    tryUneval v venv htotal branches newv henv
                                
                                _  ->
                                    let
                                        matchRes =
                                            matchCase v branches

                                        resi =
                                            uneval henv (matchRes.venvm++venv) matchRes.ei newv htotal
                                    in
                                    { ei     = resi.expr
                                    , venv   = resi.venv
                                    , henv   = resi.henv
                                    , htotal = resi.htotal
                                    , choice = matchRes.choice
                                    , pi     = matchRes.pi
                                    }
                    in
                    case tryRes.ei of
                        EError info ->
                            { henv = []
                            , venv = []
                            , expr = EError info
                            , htotal = 0
                            }

                        _ ->   
                            let 
                                branches_ =
                                    updateBranch branches tryRes.choice tryRes.ei
                                
                                len =
                                    length tryRes.venv - length venv

                                newv_ = tryRes.pi 
                                        |> patternSubst tryRes.venv 

                                venv_ =
                                    ((s, newv_) :: (drop (len + 1) tryRes.venv))
                            in
                                { henv = tryRes.henv
                                , venv = venv_
                                , expr = ECase ws1 (EVar ws2 s) branches_
                                , htotal = tryRes.htotal
                                }
                
                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "Case Expression Error."
                    , htotal = 0
                    }

        EUPrim ws op e ->
            let 
                (v, _) = 
                    eval henv venv e [] 
            in
            case op of
                Not ->
                    case v of
                        VHole _ _ ->
                            case newv of
                                VTrue ->
                                    let 
                                        res =
                                            uneval henv venv e VFalse htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Not res.expr
                                        , htotal = res.htotal
                                        }

                                VFalse ->
                                    let 
                                        res =
                                            uneval henv venv e VTrue htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Not res.expr
                                        , htotal = res.htotal
                                        }

                                VHole _ venv_ ->
                                    let
                                        newvenv =
                                            if venv_ == [] then venv else venv_
                                    in
                                        { henv = henv
                                        , venv = newvenv
                                        , expr = EUPrim ws Not e
                                        , htotal = htotal
                                        }

                                _ -> 
                                    { henv = []
                                    , venv = []
                                    , expr = EError "Unary Expression Error: 01"
                                    , htotal = 0
                                    }

                        VTrue ->
                            case newv of
                                VTrue ->
                                    let 
                                        res =
                                            uneval henv venv e VFalse htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Not res.expr
                                        , htotal = res.htotal
                                        }

                                VFalse ->
                                    { henv = henv
                                    , venv = venv
                                    , expr = EUPrim ws Not e
                                    , htotal = htotal
                                    }

                                VHole hn venv_ ->
                                    let 
                                        res =
                                            uneval henv venv e (VHole hn venv_) htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Not res.expr
                                        , htotal = res.htotal
                                        }

                                _ -> 
                                    { henv = []
                                    , venv = []
                                    , expr = EError "Unary Expression Error: 02"
                                    , htotal = 0
                                    }

                        VFalse ->
                            case newv of
                                VTrue ->
                                    { henv = henv
                                    , venv = venv
                                    , expr = EUPrim ws Not e
                                    , htotal = htotal
                                    }

                                VFalse ->
                                    let 
                                        res =
                                            uneval henv venv e VTrue htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Not res.expr
                                        , htotal = res.htotal
                                        }

                                VHole hn venv_ ->
                                    let 
                                        res =
                                            uneval henv venv e (VHole hn venv_) htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Not res.expr
                                        , htotal = res.htotal
                                        }

                                _ -> 
                                    { henv = []
                                    , venv = []
                                    , expr = EError "Unary Expression Error: 03"
                                    , htotal = 0
                                    }
                        
                        _ ->
                            { henv = []
                            , venv = []
                            , expr = EError "Unary Expression Error: 04"
                            , htotal = 0
                            }

                Neg ->
                    case v of
                        VHole _ _ ->
                            case newv of
                                VInt n ->
                                    let 
                                        res =
                                            uneval henv venv e (VInt (-n)) htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Neg res.expr
                                        , htotal = res.htotal
                                        }

                                VFloat n ->
                                    let 
                                        res =
                                            uneval henv venv e (VFloat (-n)) htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Neg res.expr
                                        , htotal = res.htotal
                                        }

                                VHole _ venv_ ->
                                    let
                                        newvenv =
                                            if venv_ == [] then venv else venv_
                                    in
                                        { henv = henv
                                        , venv = newvenv
                                        , expr = EUPrim ws Neg e
                                        , htotal = htotal
                                        }

                                _ -> 
                                    { henv = []
                                    , venv = []
                                    , expr = EError "Unary Expression Error: 05"
                                    , htotal = 0
                                    }

                        VInt n ->
                            case newv of
                                VInt n_ ->
                                    if n == (-n_) then 
                                        { henv = henv
                                        , venv = venv
                                        , expr = EUPrim ws Neg e
                                        , htotal = htotal
                                        }
                                    else
                                        let
                                            res =
                                                uneval henv venv e (VInt (-n_)) htotal
                                        in
                                            { henv = res.henv
                                            , venv = res.venv
                                            , expr = EUPrim ws Neg res.expr
                                            , htotal = res.htotal
                                            }

                                VHole hn venv_ ->
                                    let 
                                        res =
                                            uneval henv venv e (VHole hn venv_) htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Neg res.expr
                                        , htotal = res.htotal
                                        }

                                _ -> 
                                    { henv = []
                                    , venv = []
                                    , expr = EError "Unary Expression Error: 06"
                                    , htotal = 0
                                    }

                        VFloat n ->
                            case newv of
                                VInt n_ ->
                                    if n == toFloat (-n_) then 
                                        { henv = henv
                                        , venv = venv
                                        , expr = EUPrim ws Neg e
                                        , htotal = htotal
                                        }
                                    else
                                        let 
                                            res =
                                                uneval henv venv e (VFloat (toFloat (-n_))) htotal
                                        in
                                            { henv = res.henv
                                            , venv = res.venv
                                            , expr = EUPrim ws Neg res.expr
                                            , htotal = res.htotal
                                            }

                                VFloat n_ ->
                                    if n == (-n_) then 
                                        { henv = henv
                                        , venv = venv
                                        , expr = EUPrim ws Neg e
                                        , htotal = htotal
                                        }
                                    else
                                        let 
                                            res =
                                                uneval henv venv e (VFloat (-n_)) htotal
                                        in
                                            { henv = res.henv
                                            , venv = res.venv
                                            , expr = EUPrim ws Neg res.expr
                                            , htotal = res.htotal
                                            }

                                VHole hn venv_ ->
                                    let 
                                        res =
                                            uneval henv venv e (VHole hn venv_) htotal
                                    in
                                        { henv = res.henv
                                        , venv = res.venv
                                        , expr = EUPrim ws Neg res.expr
                                        , htotal = res.htotal
                                        }

                                _ -> 
                                    { henv = []
                                    , venv = []
                                    , expr = EError "Unary Expression Error: 07"
                                    , htotal = 0
                                    }

                        
                        _ ->
                            { henv = []
                            , venv = []
                            , expr = EError "Unary Expression Error: 08"
                            , htotal = 0
                            }

        EBPrim ws op e1 e2 ->
            let
                logic_ =
                    logic ws e1 e2 henv venv newv htotal

                arith_ = 
                    arith ws e1 e2 henv venv newv htotal

                comp_ = 
                    comp ws e1 e2 henv venv newv htotal
            in
            case op of
                And -> logic_ And
                Or  -> logic_ Or
                
                Add -> arith_ Add
                Sub -> arith_ Sub
                Mul -> arith_ Mul
                Div -> arith_ Div
                DDiv -> arith_ DDiv
                Cat -> arith_ Cat

                _ -> comp_ op

        EParens ws e ->
            let 
                res =
                    uneval henv venv e newv htotal
            in
                { henv = res.henv
                , venv = res.venv
                , expr = EParens ws res.expr
                , htotal = res.htotal
                }

        EToStr ws e ->
            case newv of
                VCons 1 _ _ ->
                    let
                        res1 =
                            parseVal (vconsToString newv) []
                    in
                    case res1 of
                        Result.Ok nv ->
                            let
                                res2 =
                                    uneval henv venv e nv htotal
                            in
                                { henv = res2.henv
                                , venv = res2.venv
                                , expr = EToStr ws res2.expr
                                , htotal = res2.htotal
                                }
                        
                        Result.Err _ ->
                            { henv = []
                            , venv = []
                            , expr = EError "Cannot update toString because of wrong newv."
                            , htotal = 0
                            }

                _ ->
                    { henv = []
                    , venv = []
                    , expr = EError "toString Update Error."
                    , htotal = 0
                    }

        _ ->
            { henv = []
            , venv = []
            , expr = EError "Source Expression Error."
            , htotal = 0
            }


vconsToString : Value -> String
vconsToString v =
    case v of
        VNil 1 ->
            ""
        
        VCons 1 (VChar c) v2 ->
            (String.fromChar c) ++ (vconsToString v2)

        _ ->
            "VCons To String Error."


logic : WS -> Expr -> Expr -> HEnv -> VEnv -> Value -> HTotal -> Bop -> UnEvalRes
logic ws e1 e2 henv venv newv htotal op =
    let
        (v1, _) =
            eval henv venv e1 []
        
        (v2, _) =
            eval henv venv e2 []

        (v, _) =
            eval henv venv (EBPrim ws op e1 e2) []
        
        (newv1, newv2) =
            case v of
                VTrue ->
                    case newv of
                        VTrue -> (v1, v2)

                        VFalse ->
                            case (v1, v2, op) of
                                (VTrue, VTrue, And) ->
                                    (VFalse, VTrue)
                                
                                (VTrue, VFalse, Or) ->
                                    (VFalse, VFalse)

                                (VFalse, VTrue, Or) ->
                                    (VFalse, VFalse)

                                _ ->
                                    (VError "", VError "")
                        -- Preferentially select the second operand to become hole
                        VHole hn venv_ ->
                            (v1, VHole hn venv_)
                        
                        _ ->
                            (VError "", VError "")
                
                VFalse ->
                    case newv of
                        VFalse -> (v1, v2)

                        VTrue ->
                            case (v1, v2, op) of
                                (VFalse, VFalse, Or) ->
                                    (VTrue, VFalse)

                                (VTrue, VFalse, And) ->
                                    (VTrue, VTrue)

                                (VFalse, VTrue, And) ->
                                    (VTrue, VTrue)

                                _ ->
                                    (VError "", VError "")
                        
                        VHole hn venv_ ->
                            (v1, (VHole hn venv_))

                        _ ->
                            (VError "", VError "")

                VHole _ _ ->
                    case ((v1, v2, newv), op) of
                        ((VHole _ _, VTrue, VTrue), And) ->
                            (VTrue, VTrue)

                        ((VTrue, VHole _ _, VTrue), And) ->
                            (VTrue, VTrue)

                        ((VHole _ _, VFalse, VFalse), Or) ->
                            (VFalse, VFalse)

                        ((VFalse, VHole _ _, VFalse), Or) ->
                            (VFalse, VFalse)

                        _ ->
                            (VError "", VError "")
                
                _ ->
                    (VError "", VError "")
    in
    case (newv1, newv2) of
        (VError _, VError _) ->
            { henv = []
            , venv = []
            , expr = EError "Missing Information or Logic Expression Error."
            , htotal = 0
            }

        _ ->
            checkChange henv venv htotal ws op e1 e2 v1 v2 newv1 newv2


arith : WS -> Expr -> Expr -> HEnv -> VEnv -> Value -> HTotal -> Bop -> UnEvalRes
arith ws e1 e2 henv venv newv htotal op =
    let
        (v1, _) =
            eval henv venv e1 []
        
        (v2, _) =
            eval henv venv e2 []
    in
    case newv of
        VHole _ venv_ ->
            case v1 of
                VHole _ _ ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                    { henv = henv
                    , venv = newvenv
                    , expr = EBPrim ws op e1 e2
                    , htotal = htotal
                    }
                
                _ ->
                    case v2 of
                        VHole _ _ ->
                            let
                                newvenv =
                                    if venv_ == [] then venv else venv_
                            in
                            { henv = henv
                            , venv = newvenv
                            , expr = EBPrim ws op e1 e2
                            , htotal = htotal
                            }
                        
                        _ ->
                            let
                                res =
                                    uneval henv venv e2 newv htotal
                            in
                                { henv = res.henv
                                , venv = res.venv
                                , expr = EBPrim ws op e1 res.expr
                                , htotal = res.htotal
                                }
        
        VInt n ->
            let
                (newv1, newv2) =
                    case (v1, v2) of
                        (VHole _ _, VHole _ _) -> 
                            case op of
                                Add -> (VInt n, VInt 0)
                                Sub -> (VInt n, VInt 0)
                                Mul -> (VInt n, VInt 1)
                                Div -> (VInt n, VInt 1)
                                DDiv -> (VInt n, VInt 1)
                                _   -> (VError "", VError "")

                        (VInt n1, VHole _ _)   ->
                            case op of
                                Add -> (VInt n1, VInt (n - n1))
                                Sub -> (VInt n1, VInt (n1 - n))
                                Mul -> (VInt n1, VFloat ((toFloat n) / (toFloat n1)))
                                Div -> (VInt n1, VInt (n1 // n))
                                DDiv -> (VInt n1, VFloat ((toFloat n1) / (toFloat n)))
                                _   -> (VError "", VError "")

                        (VHole _ _, VInt n2)   ->
                            case op of
                                Add -> (VInt (n - n2), VInt n2)
                                Sub -> (VInt (n + n2), VInt n2)
                                Mul -> (VFloat ((toFloat n) / (toFloat n2)), VInt n2)
                                Div -> (VInt (n * n2), VInt n2)
                                DDiv -> (VInt (n * n2), VInt n2)
                                _   -> (VError "", VError "")

                        (VFloat n1, _) ->
                            case op of
                                Add -> (VFloat n1, VFloat ((toFloat n) - n1))
                                Sub -> (VFloat n1, VFloat (n1 - (toFloat n)))
                                Mul -> (VFloat n1, VFloat ((toFloat n) / n1))
                                Div -> (VFloat n1, VFloat (n1 / (toFloat n)))
                                DDiv -> (VFloat n1, VFloat (n1 / (toFloat n)))
                                _   -> (VError "", VError "")
                        
                        (_, VFloat n2) ->
                            case op of
                                Add -> (VFloat ((toFloat n) - n2), VFloat n2)
                                Sub -> (VFloat ((toFloat n) + n2), VFloat n2)
                                Mul -> (VFloat ((toFloat n) / n2), VFloat n2)
                                Div -> (VFloat ((toFloat n) * n2), VFloat n2)
                                DDiv -> (VFloat ((toFloat n) * n2), VFloat n2)
                                _   -> (VError "", VError "")
                        
                        (VInt n1, VInt n2) ->
                            case op of
                                Add -> (VInt n1, VInt (n - n1))
                                Sub -> (VInt n1, VInt (n1 - n))
                                Mul ->
                                    if (n1 * n2) == n then
                                        (VInt n1, VInt n2)
                                    else
                                        (VInt n1, VInt (n // n1))
                                Div ->
                                    if (n1 // n2) == n then
                                        (VInt n1, VInt n2)
                                    else
                                        (VInt n1, VInt (n1 // n))
                                DDiv ->
                                    if (n1 // n2) == n then
                                        (VInt n1, VInt n2)
                                    else
                                        (VInt n1, VInt (n1 // n))
                                _   -> (VError "", VError "")
                        
                        _ -> (VError "", VError "")
            in
            case (newv1, newv2) of
                (VError _, VError _) ->
                    { henv = []
                    , venv = []
                    , expr = EError "Missing Information or Operands Type Error: 01."
                    , htotal = 0
                    }
                
                _ ->
                    checkChange henv venv htotal ws op e1 e2 v1 v2 newv1 newv2

        VFloat n ->
            let
                (newv1, newv2) =
                    case (v1, v2) of
                        (VHole _ _, VHole _ _) ->
                            case op of
                                Add -> (VFloat n, VFloat 0)
                                Sub -> (VFloat n, VFloat 0)
                                Mul -> (VFloat n, VFloat 1)
                                Div -> (VFloat n, VFloat 1)
                                DDiv -> (VFloat n, VFloat 1)
                                _   -> (VError "", VError "")
                        
                        (VInt n1, VHole _ _) ->
                            case op of
                                Add -> (VInt n1, VFloat (n - (toFloat n1)))
                                Sub -> (VInt n1, VFloat ((toFloat n1) - n))
                                Mul -> (VInt n1, VFloat (n / (toFloat n1)))
                                Div -> (VInt n1, VInt (n1 // (round n)))
                                DDiv -> (VInt n1, VFloat ((toFloat n1) / n))
                                _   -> (VError "", VError "")
                        
                        (VHole _ _, VInt n2)   ->
                            case op of
                                Add -> (VFloat (n - (toFloat n2)), VInt n2)
                                Sub -> (VFloat (n + (toFloat n2)), VInt n2)
                                Mul -> (VFloat (n / (toFloat n2)), VInt n2)
                                Div -> (VInt ((round n) * n2), VInt n2)
                                DDiv -> (VFloat (n * (toFloat n2)), VInt n2)
                                _   -> (VError "", VError "")
                        
                        (VFloat n1, _) ->
                            case op of
                                Add -> (VFloat n1, VFloat (n - n1))
                                Sub -> (VFloat n1, VFloat (n1 - n))
                                Mul -> (VFloat n1, VFloat (n / n1))
                                Div -> (VFloat n1, VFloat (n1 / n))
                                DDiv -> (VFloat n1, VFloat (n1 / n))
                                _   -> (VError "", VError "")
                        
                        (_, VFloat n2) ->
                            case op of
                                Add -> (VFloat (n - n2), VFloat n2)
                                Sub -> (VFloat (n + n2), VFloat n2)
                                Mul -> (VFloat (n / n2), VFloat n2)
                                Div -> (VFloat (n * n2), VFloat n2)
                                DDiv -> (VFloat (n * n2), VFloat n2)
                                _   -> (VError "", VError "")

                        (VInt n1, VInt _) ->
                            case op of
                                DDiv -> (VInt n1, VInt (Basics.round ((toFloat n1) / n)))
                                _   -> (VError "", VError "")
                        
                        _ -> (VError "", VError "")
            in
            case (newv1, newv2) of
                (VError _, VError _) ->
                    { henv = []
                    , venv = []
                    , expr = EError "Missing Informatin or Operands Type Error: 02."
                    , htotal = 0
                    }
                
                _ ->
                    checkChange henv venv htotal ws op e1 e2 v1 v2 newv1 newv2

        VCons _ _ _ ->
            if op == Cat then
                let
                    (newv1, newv2) =
                        deAppend newv (vlength v1)
                in
                    checkChange henv venv htotal ws op e1 e2 v1 v2 newv1 newv2

            else
                { henv = []
                , venv = []
                , expr = EError "Arith Expression Modified Value Type Error: 01."
                , htotal = 0
                }

        VNil _ ->
            if op == Cat then
                checkChange henv venv htotal ws op e1 e2 v1 v2 newv newv
            else
                { henv = []
                , venv = []
                , expr = EError "Arith Expression Modified Value Type Error: 02."
                , htotal = 0
                }

        _ -> 
            { henv = []
            , venv = []
            , expr = EError "Arith Expression Modified Value Type Error: 03."
            , htotal = 0
            }


comp : WS -> Expr -> Expr -> HEnv -> VEnv -> Value -> HTotal -> Bop -> UnEvalRes
comp ws e1 e2 henv venv newv htotal op =
    let
        (v1, _) =
            eval henv venv e1 []
        
        (v2, _) =
            eval henv venv e2 []
    in
    case newv of
        VTrue ->
            case op of
                Eq ->
                    let 
                        (newv1, newv2) =
                            case (v1, v2) of
                                (VInt n1, VHole _ _)   -> (VInt n1, VInt n1)
                                (VHole _ _, VInt n2)   -> (VInt n2, VInt n2)
                                (VFloat n1, VHole _ _) -> (VFloat n1, VFloat n1)
                                (VHole _ _, VFloat n2) -> (VFloat n2, VFloat n2)
                                (VTrue, VHole _ _)  -> (VTrue, VTrue)
                                (VHole _ _, VTrue)  -> (VTrue, VTrue)
                                (VFalse, VHole _ _) -> (VFalse, VFalse)
                                (VHole _ _, VFalse) -> (VFalse, VFalse)
                                _ -> (VError "", VError "")
                    in
                    case (newv1, newv2) of
                        (VError _, VError _) ->
                            { henv = []
                            , venv = []
                            , expr = EError "Missing Information, Cannot Infer: 01."
                            , htotal = 0
                            }
                        _ ->
                            checkChange henv venv htotal ws op e1 e2 v1 v2 newv1 newv2

                _ ->
                    let
                        (res, _) =
                            eval henv venv (EBPrim ws op e1 e2) [] 
                        
                        newe =
                            case res of
                                VTrue -> EBPrim ws op e1 e2
                                VFalse ->
                                    case op of
                                        Lt -> EBPrim ws Ge e1 e2
                                        Gt -> EBPrim ws Le e1 e2
                                        Le -> EBPrim ws Gt e1 e2
                                        Ge -> EBPrim ws Lt e1 e2
                                        _  ->
                                            EError "Comparison Expression Modified Type Error: 01."
                                _ ->
                                    EError "Missing Information, Cannot Infer: 02."
                    in
                        { henv = henv
                        , venv = venv
                        , expr = newe
                        , htotal = htotal
                        } 

        VFalse ->
            let
                (res, _) =
                    eval henv venv (EBPrim ws op e1 e2) [] 
                
                newe =
                    case res of
                        VFalse -> EBPrim ws op e1 e2
                        VTrue ->
                            case op of
                                Lt -> EBPrim ws Ge e1 e2
                                Gt -> EBPrim ws Le e1 e2
                                Le -> EBPrim ws Gt e1 e2
                                Ge -> EBPrim ws Lt e1 e2
                                Eq -> EError "Missing Information, Cannot Infer: 03."
                                _  -> EError "Comparison Expression Modified Type Error: 02."
                        _ ->
                            EError "Missing Information, Cannot Infer: 04."
            in
                { henv = henv
                , venv = venv
                , expr = newe
                , htotal = htotal
                } 

        VHole hn venv_ ->
            case (v1, v2) of
                (VHole _ _, _) ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                        { henv = henv
                        , venv = newvenv
                        , expr = EBPrim ws op e1 e2
                        , htotal = htotal
                        } 
                
                (_, VHole _ _) ->
                    let
                        newvenv =
                            if venv_ == [] then venv else venv_
                    in
                        { henv = henv
                        , venv = newvenv
                        , expr = EBPrim ws op e1 e2
                        , htotal = htotal
                        } 

                (_, _) ->
                    let 
                        res =
                            uneval henv venv e2 (VHole hn venv_) htotal
                    in
                        { henv = res.henv
                        , venv = res.venv
                        , expr = EBPrim ws op e1 res.expr
                        , htotal = res.htotal
                        }

        _ ->
            { henv = []
            , venv = []
            , expr = EError "Comparison Expression Modified Type Error: 03."
            , htotal = 0
            }


tryUneval : Value -> VEnv -> HTotal -> Branch -> Value -> HEnv -> TryUnevalRes
tryUneval v venv htotal b newv henv =    
    case b of
        BNSin _ n pi ei ->
            let
                venvm =
                    match pi v

                res = 
                    uneval henv (venvm++venv) ei newv htotal
            in
            case res.expr of
                EError info -> 
                    { ei = EError info
                    , venv = []
                    , henv = []
                    , htotal = 0
                    , choice = 0
                    , pi = PNil defaultWS
                    }

                _      ->
                    { ei = res.expr
                    , venv = res.venv
                    , henv = res.henv
                    , htotal = res.htotal
                    , choice = n
                    , pi = pi
                    }

        BCom _ b1 b2 ->
            let
                res =
                    tryUneval v venv htotal b1 newv henv
            in
            case res.ei of
                EError _ ->
                    tryUneval v venv htotal b2 newv henv

                _ -> res

        _ ->
            { ei = EError "Try Uneval Error."
            , venv = []
            , henv = []
            , htotal = 0
            , choice = 0
            , pi = PNil defaultWS
            }


checkChange : HEnv -> VEnv -> HTotal -> WS -> Bop -> 
            Expr -> Expr -> Value -> Value -> Value -> Value -> UnEvalRes
checkChange henv venv htotal ws op e1 e2 v1 v2 newv1 newv2 =
    if newv1 == v1 && newv2 == v2 then
        { henv = henv
        , venv = venv
        , expr = EBPrim ws op e1 e2
        , htotal = htotal
        }
    else if newv1 == v1 then
        let
            res2 =
                uneval henv venv e2 newv2 htotal
        in
            { henv = res2.henv
            , venv = res2.venv
            , expr = EBPrim ws op e1 res2.expr
            , htotal = res2.htotal
            }
    else if newv2 == v2 then
        let
            res1 =
                uneval henv venv e1 newv1 htotal
        in
            { henv = res1.henv
            , venv = res1.venv
            , expr = EBPrim ws op res1.expr e2
            , htotal = res1.htotal
            }
    else
        let
            res1 =
                uneval henv venv e1 newv1 htotal

            res2 = 
                uneval henv venv e2 newv2 res1.htotal

            newvenv =
                mergeVEnv res1.venv res2.venv venv

            newhenv =
                mergeHEnv3 henv res1.henv res2.henv
        in
            { henv = newhenv
            , venv = newvenv
            , expr = EBPrim ws op res1.expr res2.expr
            , htotal = res2.htotal
            }