module View exposing (..)

import Html exposing (Html)
import Html.Attributes as Attr
import Html.Events as Events
import Utils exposing (nth)
import Debug exposing (toString)
import Model exposing (Msg(..), Model, Path, Mode(..))
import LangUtils exposing (printHoleName, print, findHole)
import Syntax exposing (Value(..), IndexedVEnv, HEnv, VEnv, caseN)


view : Model -> Html Msg
view model =
    Html.div [ Attr.id "bi-preview" ]
            [ Html.div [Attr.id "menu-bar"]
                        [ Html.div [ Attr.class "title" ]
                                    [ Html.text "Bidirectional Preview" ]
                        , Html.button [ Attr.id "run-program"
                                    , Attr.class "btn" ]
                                    [Html.text "Eval"]
                        , Html.button [ Attr.class "btn uneval" 
                                    , Events.onClick Preview]
                                    [Html.text "Uneval and Preview"]
                        , Html.button [ Attr.class "btn uneval"
                                    , Events.onClick Update]
                                    [Html.text "Uneval and Update"]
                        , Html.button [ Attr.class "btn uneval" 
                                    , Events.onClick Revert]
                                    [Html.text "Revert Code"]
                        , Html.button [ Attr.class "btn uneval" 
                                    , Events.onClick ClearHB]
                                    [Html.text "Clear Hole-Bindings"]
                        ]
            , Html.div  [ Attr.id "hole-bindings"
                        , Attr.style "overflow-y" "scroll"
                        ]
                        [ Html.div [Attr.class "area-title"]
                                [Html.text "HOLE BINDINGS"]
                        , Html.table [Attr.id "hb-table"]
                                    ([ Html.th [Attr.class "hole-name"] [Html.text "Hole Name"]
                                    , Html.th [] [Html.text "Context"]
                                    , Html.th [Attr.class "hole-value"] [Html.text "Value"]
                                    ] ++
                                    displayHB model.holeBindings)
                        ]
            , Html.div [Attr.id "output"]
                        [ Html.div [Attr.class "area-title"]
                                [Html.text "OUTPUT"]
                        , Html.div [Attr.id "output-area"]
                                    [Html.textarea [  Attr.id "console-output"
                                                    , Events.onInput OutputChange ]
                                                    []]
                        ]
            , Html.div  [ Attr.id "context"
                        , Attr.style "overflow-y" "scroll"
                        ]
                        [ Html.div  [ Attr.class "area-title"
                                    , Attr.style "cursor" "default"
                                    , Events.onClick (model.currentContext 
                                                        |> printHoleName
                                                        |> changeSelectedHole)
                                    ]
                                [ Html.text "CONTEXT"
                                , Html.select [ Attr.id "select-hole"
                                                , Events.onInput changeSelectedHole]
                                                (contextToOptions model.context)
                                ]
                        , Html.table [Attr.id "hb-table"]
                                    (displayContextViaPath model)
                        ]
            , Html.div [Attr.id "path"]
                        [ Html.div [Attr.class "area-title"]
                                [Html.text "WHICH IS THE OUTPUT"]
                        , Html.text (displayPath model.path)
                        ]
            ]


contextToOptions : List Value -> List (Html Msg)
contextToOptions context =
    case context of
        [] -> []

        (IndexedHole hn _)::ct ->
            (Html.option [Attr.value (printHoleName hn)] [Html.text (printHoleName hn)]) ::
            contextToOptions ct

        _::ct -> contextToOptions ct


changeSelectedHole : String -> Msg
changeSelectedHole selected = ChangeCurrentHole selected


displayContextViaPath : Model -> List (Html Msg)
displayContextViaPath model =
    let 
        res = 
            findHole model.currentContext model.context 
    in
    case res of
        Just (IndexedHole _ venv) ->
            let 
                holeContext = 
                    findContextViaPath model.path venv
            in
                displayContext model holeContext
        _ -> []


findContextViaPath : Path -> IndexedVEnv -> IndexedVEnv
findContextViaPath path venv = 
    case path of
        (_, m, _)::pt ->
            let 
                res = nth m venv 
            in
            case res of
                Just (_, _, val) ->
                    case val of
                        (IndexedHole _ venv1) ->
                            findContextViaPath pt venv1
                        
                        _ -> []
                
                Nothing -> []
        [] -> venv


printEditItem : Int -> Value -> (Int, String) -> String
printEditItem n1 v1 (n2, s2) =
    if n2 == -1 || n1 /= n2 then
        Tuple.first <| print v1
    else
        s2


displayContext : Model -> IndexedVEnv -> List (Html Msg)
displayContext model holeContext =
    case holeContext of
        [] -> []

        (n, s, v)::hc ->
            if s /= caseN
            then
                case v of

                    IndexedHole hn _ ->
                        (Html.tr [ Attr.style "cursor" "pointer"] 
                                [ Html.td []
                                        [ Html.span [Events.onClick (ChangePath (hn, n, s))] 
                                                    [Html.text (s++" : ")]
                                        , Html.input [ Attr.class "context-item"
                                                    , Attr.value (printEditItem n v model.editContextItem)
                                                    , Events.onInput (ContextChange n)
                                                    ][]
                                        ]
                                ])::displayContext model hc
                    
                    VClosure _ _ _ ->
                        (Html.tr [ Attr.style "cursor" "default" ]
                                [ Html.td [] 
                                        [ Html.text (s++" : "++(Tuple.first <| print v))]
                                ])::displayContext model hc

                    VFix _ ->
                        (Html.tr [ Attr.style "cursor" "default" ]
                                [ Html.td [] 
                                        [ Html.text (s++" : "++(Tuple.first <| print v))]
                                ])::displayContext model hc
                    
                    _ ->
                        (Html.tr [ Attr.style "cursor" "default" ] 
                                [ Html.td [] 
                                        [ Html.text (s++" : ")
                                        , Html.input [ Attr.class "context-item"
                                                    , Attr.value (printEditItem n v model.editContextItem)
                                                    , Events.onInput (ContextChange n)
                                                    ][]
                                        ]
                                ])::displayContext model hc
            else
                displayContext model hc


displayPath : Path -> String
displayPath path =
    case path of
        [] -> ""

        (hn, index, var) ::[] ->
            "{ "++(printHoleName hn)++" }"++" · "++var++" ("++(toString index)++")"

        (hn, index, var) ::step::pt ->
            "{ "++(printHoleName hn)++" }"++" · "++var++" ("++(toString index)++") >> "++
            (displayPath (step::pt))


displayHB : HEnv -> List (Html Msg)
displayHB henv =
    case henv of
        [] -> []

        (hn, venv, v)::hv ->
            (Html.tr [] 
                    [ Html.td [Attr.class "hole-name"] [Html.text (printHoleName hn)]
                    , Html.td [] [Html.text (displayHoleContext venv)]
                    , Html.td [Attr.class "hole-value"] [Html.text (Tuple.first <| print v)]
                    ]) :: (displayHB hv)

    
displayHoleContext : VEnv -> String
displayHoleContext venv =
    case venv of
        [] -> ""

        (s, v)::[] ->
            if s == caseN then
                ""
            else
                s ++ ": " ++ (Tuple.first <| print v)

        (s, v)::vv ->
            if s == caseN then
                displayHoleContext vv
            else
                s ++ ": " ++ (Tuple.first <| print v) ++ " , " ++
                (displayHoleContext vv)