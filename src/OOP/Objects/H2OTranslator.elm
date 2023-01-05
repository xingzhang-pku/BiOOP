module OOP.Objects.H2OTranslator exposing (..)

import OOP.Objects.Templates exposing (..)
import OOP.Printer.Value exposing (printString)
import OOP.Objects.ThreeMerge exposing (mergeEnv, mergeState)
import OOP.Utils exposing (updateValueInDict, findByName, replace)
import OOP.Syntax exposing (Value(..), Term(..), Env, Bop(..), State)

-- <Flag-1>
--     Object
--     id : Class-ObjectID
--     class : Object Add
-- <Flag-2>
--     List
--     id : List-FieldID-ObjectID
--     class : Add

type alias IDInfo =
    { flag : Int
    , class : String
    , objectID : Int
    , fieldID : Int
    }

html2Object : Value -> EnvDict -> List (String, String, String) -> State -> (Value, State)
html2Object html dict userDefTemps ostate=
    case html of
        VHtml _ _ attr _ ->
            let
                res =
                    findIDAttr attr
            in
            case res of
                Just str ->
                    let
                        info =
                            parseToIDInfo str

                        class =
                            case info.flag of
                                1 ->
                                    info.class

                                _ ->
                                    "Error"
                    in
                    case class of
                        "Error" ->
                            (VError "Not an Object : 06.", ostate)

                        _ ->
                            let
                                res1 =
                                    findTemplateByClass class <| 
                                        parseTemplates (templates ++ userDefTemps)

                                res4 =
                                    findObjectEnv dict info.objectID
                            in
                            case (res1, res4) of
                                (Just (objectPattern, htmlPattern), Just oenv) ->
                                    let
                                        res2 =
                                            delOstLayer html    
                                    in
                                    case res2 of
                                        Just html_ ->
                                            let
                                                res3 =
                                                    htmlMatch html_ htmlPattern oenv dict userDefTemps ostate
                                            in
                                            case res3 of
                                                Result.Ok (env, state) ->
                                                    (objectSubst env objectPattern, state)

                                                Result.Err err ->
                                                    (VError err, ostate)

                                        Nothing ->
                                            (VError "Error : 23.", ostate)
                                
                                _ ->
                                    (VError "No Such Class or No Such Object.", ostate)

                Nothing ->
                    (VError "Not an Object : 05.", ostate)
        
        _ ->
            (VError "Html To Object Error : 01.", ostate)


htmlMatch : Value -> HtmlPat -> Env -> EnvDict -> List (String, String, String) -> State -> Result String (Env, State)
htmlMatch html hp oenv dict userDefTemps state =
    case (html, hp) of
        (VHtml vlab vstyle vattr vchilds, THtml _ tlab tstyle tattr tchilds) ->
            if tlab /= vlab && tlab /= "objectlist"
            then
                Result.Err "Html Match Error : 01."
            else if tlab /= "objectlist"
            then
                let
                    res1 =
                        htmlMatch vstyle tstyle oenv dict userDefTemps state

                    res2 =
                        htmlMatch vattr tattr oenv dict userDefTemps state

                    res3 =
                        htmlMatch vchilds tchilds oenv dict userDefTemps state
                in
                    case (res1, res2, res3) of
                        (Result.Ok (env1, state1), Result.Ok (env2, state2), Result.Ok (env3, state3)) ->
                            Result.andThen (\state_ ->
                                Result.andThen (\state__ ->
                                    Result.Ok ((mergeEnv env3 
                                        (mergeEnv env2 env1 oenv) oenv), state__)
                                ) (mergeState state3 state_ state)
                            ) (mergeState state2 state1 state) 
                        
                        _ ->
                            Result.Err "Html Match Error : 02."
            else
                htmlMatch vchilds tchilds oenv dict userDefTemps state

        (VCons _ _, TVar _ s) ->
            let
                res =
                    foldObjectList html dict userDefTemps state
            in
                case res of
                    (VCons v1 v2, state_) ->
                        -- The outer object, the higher the priority of state modification.
                        checkVarIsRef s oenv state_ (VCons v1 v2)
                    
                    _ ->
                        Result.Err "Html Match Error : 03."
        
        (_, TVar _ s) ->
            let
                res =
                    html2Object html dict userDefTemps state
            in
            case res of
                (VError _, _) ->
                    checkVarIsRef s oenv state html

                (VNew c args, state_) ->
                    checkVarIsRef s oenv state_ (VNew c args)

                _->
                    Result.Err "Html Match Error : 04."

        (VCons v1 v2, TCons _ t1 t2) ->
            twoMatchMerge (v1, v2) (t1, t2) oenv dict userDefTemps state

        (VCons v1 v2, TList _ t1 t2) ->
            twoMatchMerge (v1, v2) (t1, t2) oenv dict userDefTemps state

        (VString _, TBPrim _ Cat _ _) ->
            Result.Ok (oenv, state)
        
        (VString s1, TString _ s2) ->
            if s1 == s2 then
                Result.Ok (oenv, state)
            else
                Result.Err "Html Match Error : 06."

        (VNil, TNil _) ->
            Result.Ok (oenv, state)

        (VNil, TEmpList _) ->
            Result.Ok (oenv, state)

        _ ->
            Result.Err "Html Match Error : 07."


twoMatchMerge : (Value, Value) -> (HtmlPat, HtmlPat) -> Env -> EnvDict -> 
                    List (String, String, String) -> State -> Result String (Env, State)
twoMatchMerge (v1, v2) (t1, t2) oenv dict userDefTemps state =
    let
        res1 =
            htmlMatch v1 t1 oenv dict userDefTemps state

        res2 =
            htmlMatch v2 t2 oenv dict userDefTemps state
    in
        case (res1, res2) of
            (Result.Ok (env1, state1), Result.Ok (env2, state2)) ->
                Result.andThen (\mergedState ->
                    Result.Ok (mergeEnv env1 env2 oenv, mergedState)
                ) (mergeState state1 state2 state)

            _ ->
                Result.Err "Html Match Error : 05."


foldObjectList : Value -> EnvDict -> List (String, String, String) -> State -> (Value, State)
foldObjectList ls dict userDefTemps state =
    case ls of
        VCons v1 v2 ->
            let
                res =
                    html2Object v1 dict userDefTemps state
            in
                case res of
                    (VError _, _) ->
                        let
                            (v2_, state2) =
                                foldObjectList v2 dict userDefTemps state
                        in
                            (VCons v1 v2_, state2)

                    -- The later the object, the higher the priority of state modification.
                    (VNew c args, state_) ->
                        let
                            (v2_, state2) =
                                foldObjectList v2 dict userDefTemps state_
                        in
                            (VCons (VNew c args) v2_, state2 )

                    _ ->
                        (VError "Error : 24.", state)

        VNil ->
            (VNil, state)

        _ ->
            (VError "Error : 23.", state)


objectSubst : Env -> ObjectPat -> Value
objectSubst env op =
    case op of
        TNew _ class args ->
            let
                args_ =
                    objectSubst env args
            in
                VNew class args_

        TList _ t1 t2 ->
            let
                v1 =
                    objectSubst env t1

                v2 =
                    objectSubst env t2
            in
                VCons v1 v2
        
        TEmpList _ ->
            VNil

        TVar _ s ->
            case findByName s env of
                Just v ->
                    v

                Nothing ->
                    VError "Object Substitution Error : No Such Variable."

        _ ->
            VError "Template uses disallowed syntax : 02."


findIDAttr : Value -> Maybe String
findIDAttr attr =
    case attr of
        VCons v1 v2 ->
            case v1 of
                VCons v11 (VCons v12 VNil) ->
                    if v11 == VString "id"
                    then
                        Just (printString v12)
                    else
                        findIDAttr v2
                _ ->
                    findIDAttr v2

        _ ->
            Nothing


parseToIDInfo : String -> IDInfo
parseToIDInfo str =
    let
        splitRes =
            String.split "-" str
    in
        case splitRes of
            class :: objectID :: [] ->
                case String.toInt objectID of
                    Just id ->
                        { flag = 1
                        , class = class
                        , objectID = id
                        , fieldID = -1
                        }
                    
                    Nothing ->
                        { flag = 0
                        , class = "Object ID Error : 01."
                        , objectID = -1
                        , fieldID = -1
                        }
            
            "List" :: fieldID :: objectID :: [] ->
                case (String.toInt fieldID, String.toInt objectID) of
                    (Just fid, Just oid) ->
                        { flag = 2
                        , class = ""
                        , objectID = oid
                        , fieldID = fid
                        }

                    _ ->
                        { flag = 0
                        , class = "Object ID or Field ID Error."
                        , objectID = -1
                        , fieldID = -1
                        }

            _ ->
                { flag = 0
                , class = "Wrong ID Form : 01."
                , objectID = -1
                , fieldID = -1
                }


delOstLayer : Value -> Maybe Value
delOstLayer html =
    case html of
        VHtml _ _ _ (VCons child VNil) ->
            Just child
        
        VHtml _ _ _ (VCons child (VCons _ VNil)) ->
            Just child

        _ ->
            Nothing


equalVStrAndTStr : Value -> Term -> Bool
equalVStrAndTStr vstr tstr =
    case (vstr, tstr) of
        (VString s1, TString _ s2) ->
            if s1 == s2 then
                True
            else 
                False
        
        _ ->
            False


findObjectEnv : EnvDict -> ObjectID -> Maybe Env
findObjectEnv dict id =
    case dict of
        (id1, env1) :: res ->
            if id == id1 then
                Just env1
            else
                findObjectEnv res id

        [] ->
            Nothing


checkVarIsRef : String -> Env -> State -> Value -> Result String (Env, State)
checkVarIsRef s oenv state res =
    let
        findVarRes = 
            findByName s oenv
    in
    case findVarRes of
        Just val ->
            case val of
                VLoc n ->
                    Result.Ok (oenv, replace n res state)
                
                _ ->
                    Result.Ok (updateValueInDict s res oenv, state)

        Nothing ->
            Result.Err "No Such Variable : 05."