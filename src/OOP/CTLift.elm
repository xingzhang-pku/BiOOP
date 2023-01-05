module OOP.CTLift exposing (..)

import String exposing (..)
import Set exposing (member)
import Char exposing (isDigit)
import OOP.Utils exposing (exist)
import OOP.LangUtils exposing (appendCT)
import OOP.Syntax exposing (ClassTable, ClassDef, Method, Term(..), Invks)


type Tree
    = Leaf ClassDef
    | Tree ClassDef (List Tree)

ctLift : ClassTable -> ClassTable -> Invks -> (ClassTable, List String)
ctLift ct subClasses invks =
    let
        markedSubs =
            markSubclassing subClasses
        
        (ws, ct1) =
            appendCT ct markedSubs
        
        ct2 =
            modelTree ([], (("Object", ""), ([],[]), ([],[]))) ct1
            |> lift invks
        
        (ct3, delList) =
            reorder ct1 (flat ct2)
            |> sortOut
    in
        ((ws,ct3), delList)


markSubclassing : ClassTable -> ClassTable
markSubclassing (ws_ct, ct) =
    (ws_ct, List.map 
            (\(_, ((c,f), fs, (ws1, ms))) -> 
                (["S"], ((c,f), fs, (ws1, 
                                    List.map (\(ws2, m) ->
                                        ("Lift"::ws2,m)) 
                                    ms)))) 
            ct)


-- ***********
-- ** Model **
-- ***********
modelTree : ClassDef -> List ClassDef -> Tree
modelTree root ct =
    let
        childs =
            case root of
                (_, ((c,_), _, _)) ->
                    List.filter (\(_, ((_, f), _, _)) -> f == c) ct
    in
        if childs == [] then
            Leaf root
        else
            let
                subCTs =
                    List.map (\clsDef -> modelTree clsDef ct) childs
            in
                Tree root subCTs


-- **********
-- ** Lift **
-- **********
lift : Invks -> Tree -> Tree
lift invks tree =
    case tree of
        Leaf clsDef ->
            Leaf clsDef
        
        Tree root subTrees ->
            let
                subTrees1 =
                    List.map (\subTree -> lift invks subTree) subTrees
                
                liftMethods =
                    getLiftMethods root subTrees1 invks

                root_ =
                    handleParent root liftMethods
                
                subTrees2 =
                    handleSubTrees subTrees1 liftMethods
            in
                Tree root_ subTrees2


getLiftMethods : ClassDef -> List Tree -> Invks -> List Method
getLiftMethods par subTrees invks =
    let
        allCanLift =
            case par of
                (_, ((c, _), _, _)) ->
                    findAllMethodsCanLifted subTrees
                    |> List.filter (\(_, (m,_,_)) -> not (member (c,m) invks)) 
    in
        List.foldl (\subTree -> \canLift ->
            let
                methods =
                    getRootMs subTree
            in
                List.foldl (\m -> \canLift_ ->
                    handleEachMethod canLift_ m methods subTree invks
                ) canLift canLift
    
        ) allCanLift subTrees


findAllMethodsCanLifted : List Tree -> List Method
findAllMethodsCanLifted subTrees =
    List.foldl (\subTree -> \tol ->
        let
            methods =
                getRootMs subTree
        in
        List.foldl (\(ws, m) -> \tol_ ->
            case ws of
                "Lift" :: _ ->
                    insertToMT (ws,m) tol_

                _ ->
                    tol_
        ) tol methods
    ) [] subTrees


handleEachMethod : List Method -> Method -> List Method -> 
                    Tree -> Invks -> List Method
handleEachMethod  mt (ws1, (m1, p1, t1)) ms subTree invks =
    case ms of
        (ws2, (m2, p2, t2)) :: ms_ ->
            if m1 == m2 then
                case ws2 of
                    "Lift" :: _ ->
                        if p1 == p2 && t1 == t2 then
                            mt
                        else
                            delFromMT (ws1, (m1, p1, t1)) mt

                    _ ->
                        mt
            else
                handleEachMethod mt (ws1, (m1, p1, t1)) ms_ subTree invks

        [] ->
            if checkSubTree subTree m1 invks then
                mt
            else
                delFromMT (ws1, (m1, p1, t1)) mt


checkSubTree : Tree -> String -> Invks -> Bool
checkSubTree tree m invks =
    case tree of
        Leaf (_, ((c, _), _, (_, ms))) ->
            if checkHasMethod ms m || not (member (c, m) invks) then
                True
            else
                False
        Tree (_, ((c, _), _, (_, ms))) subTrees ->
            if checkHasMethod ms m then
                True
            else if not (member (c, m) invks) then
                List.all (\subTree -> checkSubTree subTree m invks) subTrees
            else
                False
            


checkHasMethod : List Method -> String -> Bool
checkHasMethod ms m =
    case ms of
        (_, (m1, _, _)) :: ms_ ->
            if m == m1 then
                True
            else
                checkHasMethod ms_ m
        
        [] ->
            False


handleParent : ClassDef -> List Method -> ClassDef
handleParent (ws1, ((c,f), fs, (ws2, ms))) mt =
    let
        ms_ =
            List.foldl (\m -> \methods -> 
                checkAndInsertToMS m methods
            ) ms mt
    in
        (ws1, ((c,f), fs, (ws2, ms_)))


handleSubTrees : List Tree -> List Method -> List Tree
handleSubTrees subTrees mt =
    List.map (\subTree ->
        case subTree of
            Leaf (ws1, ((c,f), fs, (ws2, ms))) ->
                Leaf (ws1, ((c,f), fs, (ws2, handleMS ms mt)))

            Tree (ws1, ((c,f), fs, (ws2, ms))) subTs ->
                Tree (ws1, ((c,f), fs, (ws2, handleMS ms mt))) subTs
    ) subTrees


handleMS : List Method -> List Method -> List Method
handleMS ms mt =
    case ms of
        m :: ms_ ->
            if exist m mt then
                handleMS ms_ mt
            else
                m :: (handleMS ms_ mt)
            
        [] ->
            []


delFromMT : Method -> List Method -> List Method
delFromMT (ws1, m1) mt =
    case mt of
        (ws2, m2) :: mt_ ->
            if m1 == m2 then
                mt_
            else
                (ws2, m2) :: (delFromMT (ws1, m1) mt_)
        
        [] -> []


insertToMT : Method -> List Method -> List Method
insertToMT (ws1, (m1, p1, t1)) mt =
    case mt of
        (ws2, (m2, p2, t2)) :: mt_ ->
            if m1 == m2 && p1 == p2 then
                mt
            else
                (ws2, (m2, p2, t2)) :: 
                (insertToMT (ws1, (m1, p1, t1)) mt_)
        
        [] ->
            [(ws1, (m1, p1, t1))]


checkAndInsertToMS : Method -> List Method -> List Method
checkAndInsertToMS (ws1, (m1, p1, t1)) ms =
    case ms of
        (ws2, (m2, p2, t2)) :: ms_ ->
            if m1 == m2 then
                (ws2, (m2, p1, t1)) :: ms_
            else
                (ws2, (m2, p2, t2)) :: 
                (checkAndInsertToMS (ws1, (m1, p1, t1)) ms_)
        
        [] ->
            [(ws1, (m1, p1, t1))]


-- *************
-- ** Reorder **
-- *************
reorder : List ClassDef -> List ClassDef -> List ClassDef
reorder ori new =
    List.map (\c -> 
        case findClass c new of
            Just c_ -> c_

            Nothing -> (["Del"], (("",""),([],[]),([],[])))
    ) ori


flat : Tree -> List ClassDef
flat tree =
    case tree of
        Leaf clsDef ->
            [clsDef]
        
        Tree root subTrees ->
            root :: (List.foldl (\subTree -> \tol ->
                flat subTree ++ tol
            ) [] subTrees)


findClass : ClassDef -> List ClassDef -> Maybe ClassDef
findClass c1 ls =
    case ls of
        c2 :: ls_ ->
            if getClsName c1 == getClsName c2 then
                Just c2
            else
                findClass c1 ls_

        [] ->
            Nothing


-- ***********
-- ** Utils **
-- ***********
getRootMs : Tree -> List Method
getRootMs tree =
    case tree of
        Leaf (_, (_, _, (_, ms))) -> ms
        
        Tree (_, (_, _, (_, ms))) _ -> ms


getClsName : ClassDef -> String
getClsName (_, ((c, _), _, _)) = c


-- ***********************
-- ** Delete SubClasses **
-- ***********************
delSubClasses : List String -> Term -> Term
delSubClasses delList term =
    case term of
        TLam ws p t ->
            TLam ws p 
            <| delSubClasses delList t

        TApp ws t1 t2 ->
            TApp ws (delSubClasses delList t1)
            <| delSubClasses delList t2

        TLet ws p t1 t2 ->
            TLet ws p (delSubClasses delList t1)
            <| delSubClasses delList t2

        TLetrec ws p t1 t2 ->
            TLetrec ws p (delSubClasses delList t1)
            <| delSubClasses delList t2
                
        TCons ws t1 t2 ->
            TCons ws (delSubClasses delList t1)
            <| delSubClasses delList t2

        TList ws t1 t2 ->
            TList ws (delSubClasses delList t1)
            <| delSubClasses delList t2

        TTuple2 ws t1 t2 ->
            TTuple2 ws (delSubClasses delList t1)
            <| delSubClasses delList t2

        TTuple3 ws t1 t2 t3 ->
            TTuple3 ws (delSubClasses delList t1) 
            (delSubClasses delList t2)
            (delSubClasses delList t3)

        TBPrim ws op t1 t2 ->
            TBPrim ws op (delSubClasses delList t1)
            <| delSubClasses delList t2

        TUPrim ws op t ->
            TUPrim ws op
            <| delSubClasses delList t

        TParens ws t ->
            TParens ws
            <| delSubClasses delList t

        TRef ws t ->
            TRef ws
            <| delSubClasses delList t

        TDeRef ws t ->
            TDeRef ws
            <| delSubClasses delList t

        TAssign ws t1 t2 ->
            TAssign ws (delSubClasses delList t1)
            <| delSubClasses delList t2

        TField ws1 t (TVar ws2 f) ->
            TField ws1 (delSubClasses delList t)
            <| (TVar ws2 f)

        TInvk ws1 t (TVar ws2 m) ->
            TInvk ws1 (delSubClasses delList t)
            <| (TVar ws2 m)

        TNew ws cl args ->
            if exist cl delList then
                TNew ws (delTailNum cl)
                <| delSubClasses delList args
            else
                term

        TSeq ws t1 t2 ->
            TSeq ws (delSubClasses delList t1)
            <| delSubClasses delList t2

        THtml ws s t1 t2 t3 ->
            THtml ws s (delSubClasses delList t1) 
            (delSubClasses delList t2)
            (delSubClasses delList t3)

        TToStr ws t ->
            TToStr ws
            <| delSubClasses delList t

        TMap ws d f ls ->
            TMap ws (delSubClasses delList d)
            (delSubClasses delList f)
            (delSubClasses delList ls)

        _ -> 
            term


delTailNum : String -> String
delTailNum c =
    case uncons <| right 1 c of
        Just (char, _) ->
            if isDigit char then
                delTailNum (dropRight 1 c)
            else
                c
        Nothing ->
            c


-- **************
-- ** Sort Out **
-- **************
sortOut : List ClassDef -> (List ClassDef, List String)
sortOut classes =
    case classes of
        (ws1, ((c,f), fs, (ws2, ms))) :: classes_ ->
            let
                (res1, res2) =
                    sortOut classes_
            in
            if ws1 == ["S"] && ms == [] then
                (res1, c :: res2)
            else
                ((ws1, ((c,f), fs, (ws2, ms))) :: res1, res2)

        [] ->
            ([], [])