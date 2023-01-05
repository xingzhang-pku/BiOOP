module OOP.Objects.O2HTranslator exposing (..)

import Utils exposing (nth)
import Debug exposing (toString)
import OOP.Utils exposing (findByName)
import OOP.Objects.Templates exposing (..)
import OOP.Parser.Value exposing (valueListToVCons)
import OOP.Syntax exposing (Value(..), Env, Term(..), Bop(..), State)
import OOP.LangUtils exposing (appendValueString, appendTermString)

object2Html : Value -> ObjectID -> EnvDict -> List (String, String, String) -> State -> (Value, ObjectID, EnvDict)
object2Html object id oenvDict userDefTemps state =
    case object of
        VNew class _ ->
            let
                res1 =
                    findTemplateByClass class <|
                        parseTemplates (templates ++ userDefTemps)
            in
                case res1 of
                    Just (objectPattern, htmlPattern) ->
                        let
                            res2 =
                                objectMatch object objectPattern (id + 1) oenvDict userDefTemps state
                        in
                            case res2 of
                                Just (henv, id_, (oenv, oenvDict_)) ->
                                    ( addObjectID (class ++ "-" ++ (toString id))
                                        <| htmlSubst henv htmlPattern id
                                    , id_
                                    , (id, oenv)::oenvDict_)

                                Nothing ->
                                    (VError "Object Match Error.", -1, [])

                    Nothing ->
                        let _ = Debug.log "class" class in
                        (VError "No Such Class : 01.", -1, [])
        
        _ ->
            (VError "Object To Html Error", -1, [])


objectMatch : Value -> ObjectPat -> ObjectID -> EnvDict -> List (String, String ,String) -> State -> Maybe (Env, ObjectID, (Env, EnvDict))
objectMatch object op id dict userDefTemps state =
    case (object, op) of
        (VNew vc vargs, TNew _ tc targs) ->
            if vc == tc then
                objectMatch vargs targs id dict userDefTemps state
            else
                Nothing

        (VCons v1 v2, TList _ t1 t2) ->
            case (v1, t1) of
                (VNew _ _, TVar _ s) ->
                    let
                        (v1_, id1, dict1) =
                            object2Html v1 id dict userDefTemps state
                    in
                    Maybe.map 
                        (\(henv_, id2, (oenv_, dict2)) -> 
                            ((s, v1_)::henv_, id2, ((s, v1)::oenv_, dict2)))
                        <| objectMatch v2 t2 id1 dict1 userDefTemps state
                
                (VLoc n, TVar _ s) ->
                    Maybe.andThen (\refVal ->
                        case refVal of
                            VCons _ _ ->
                                let
                                    (v1_, id1, dict1) =
                                        expandListAttr refVal id dict userDefTemps state
                                in
                                Maybe.map 
                                    (\(henv_, id2, (oenv_, dict2)) -> 
                                        ((s, v1_)::henv_, id2, ((s, VLoc n)::oenv_, dict2)))
                                    <| objectMatch v2 t2 id1 dict1 userDefTemps state
                            _ ->
                                Maybe.map 
                                    (\(henv_, id2, (oenv_, dict2)) -> 
                                        ((s, refVal)::henv_, id2, ((s, VLoc n)::oenv_, dict2)))
                                    <| objectMatch v2 t2 id dict userDefTemps state
                    ) (nth n state)

                (VCons _ _, TVar _ s) ->
                    let
                        (v1_, id1, dict1) =
                            expandListAttr v1 id dict userDefTemps state
                    in
                    Maybe.map 
                        (\(henv_, id2, (oenv_, dict2)) -> 
                            ((s, v1_)::henv_, id2, ((s, v1)::oenv_, dict2)))
                        <| objectMatch v2 t2 id1 dict1 userDefTemps state

                (_, TVar _ s) ->
                    Maybe.map 
                        (\(henv_, id2, (oenv_, dict2)) -> 
                            ((s, v1)::henv_, id2, ((s, v1)::oenv_, dict2)))
                        <| objectMatch v2 t2 id dict userDefTemps state
                
                _ ->
                    Nothing

        (VNil, TEmpList _) ->
            Just ([], id, ([], dict)) 

        _ ->
            Nothing


htmlSubst : Env -> HtmlPat -> ObjectID -> Value
htmlSubst env hp id =
    case hp of
        THtml _ s style otherAttr childs ->
            let
                res1 =
                    htmlSubst env style id
                
                (s_, res2) =
                    case s of
                        "objectlist" ->
                            let
                                otherAttr_ =
                                    extentListIDObjectID otherAttr id
                            in
                                ("div", htmlSubst env otherAttr_ id)

                        _ ->
                            (s, htmlSubst env otherAttr id)

                res3 =
                    htmlSubst env childs id

            in
                VHtml s_ res1 res2 res3

        TVar _ s ->
            case findByName s env of
                Just v ->
                    v

                Nothing ->
                    VError "HTML Substitution Error : No Such Variable."

        TChar _ c ->
            VChar c
        
        TBPrim _ Cat t1 t2 ->
            let
                (res1, res2) =
                    twoSubstMerge env t1 t2 id
            in
                appendValueString res1 res2

        TCons _ t1 t2 ->
            let
                (res1, res2) =
                    twoSubstMerge env t1 t2 id
            in
                VCons res1 res2

        TList _ t1 t2 ->
            let
                (res1, res2) =
                    twoSubstMerge env t1 t2 id
            in
                VCons res1 res2
        
        TString _ s ->
            VString s

        TNil _ ->
            VNil

        TEmpList _ ->
            VNil
            
        _ ->
            VError "Template uses disallowed syntax : 01."


twoSubstMerge : Env -> HtmlPat -> HtmlPat -> ObjectID -> (Value, Value)
twoSubstMerge env t1 t2 id =
    (htmlSubst env t1 id, htmlSubst env t2 id)


expandListAttr : Value -> ObjectID -> EnvDict -> List (String, String, String) -> State -> (Value, ObjectID, EnvDict)
expandListAttr ls id dict userDefTemps state =
    case ls of
        VCons v1 v2 ->
            case v1 of
                VNew _ _ ->
                    let
                        (v1_, id1, dict1) =
                            object2Html v1 id dict userDefTemps state
                        
                        (v2_, id2, dict2) =
                            expandListAttr v2 id1 dict1 userDefTemps state
                    in
                        (VCons (addListTag v1_) v2_, id2, dict2)
                
                _ ->
                    let
                        (v2_, id2, dict2) =
                            expandListAttr v2 id dict userDefTemps state
                    in
                        (VCons v1 v2_, id2, dict2)

        VNil ->
            (VNil, id, dict)

        _ ->
            (VError "Expand can only be used on List.", -1, [])


extentListIDObjectID : Term -> Int -> Term
extentListIDObjectID attr id =
    case attr of
        -- objectlist uses format ["id", "List-n"], not "id" :: "List-n" :: nil
        TList ws1 (TList ws2 t1 (TList ws3 t2 (TEmpList ws4))) (TEmpList ws5) ->
            let
                t2_ =
                    "-" ++ (toString id)
                    |> TString []
                    |> appendTermString t2
            in
                TList ws1 (TList ws2 t1 (TList ws3 t2_ (TEmpList ws4))) 
                    (TList [] 
                        (TList [] (TString [] "class")
                                (TList [] (TString [] "Add")
                                    (TEmpList [])))
                    (TEmpList ws5))
        
        _ ->
            TError "Error : 22." 


addListTag : Value -> Value
addListTag object =
    case object of
        VHtml s style otherAttr childs ->
            VHtml s style (addListClass otherAttr) childs

        _ ->
            VError "Only add tags for HTML : 02."


addListClass : Value -> Value
addListClass attr =
    case attr of
            VCons id (VCons (VCons class (VCons val VNil)) VNil) ->
                VCons id (VCons (VCons class (VCons
                    (appendValueString val (VString " Add"))
                VNil)) VNil)
            
            _ ->
                VError "Error : 19."


addObjectID : String -> Value -> Value
addObjectID id object =
    VHtml "div" VNil
        (valueListToVCons
        <| [ (valueListToVCons [VString "id",
                                VString id])
            ,(valueListToVCons [VString "class",
                                VString "Object"])])
        (VCons object VNil)