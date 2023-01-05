module OOP.View exposing (..)

import Html exposing (Html)
import Html.Events as Events
import Html.Attributes as Attr
import Debug exposing (toString)
import OOP.Model exposing (Model, Msg(..))

view : Model -> Html Msg
view model =
        Html.div [ Attr.id "bi-preview" ]
            [ Html.div [Attr.id "menu-bar"] 
                [ Html.div [  Attr.class "title"
                            , Attr.style "width" "70px"]
                            [ Html.text "BiOOP" ]
                , Html.button [ Attr.id "oop-eval"
                                , Attr.class "btn" ]
                                [Html.text "Eval"]
                , Html.button [ Attr.id "oop-update"
                                , Attr.class "btn"
                                , Events.onClick Update]
                                [Html.text "Update"]
                , Html.button [ Attr.id "oop-revert"
                                , Attr.class "btn"
                                , Events.onClick Revert]
                                [Html.text "Revert"]
                , Html.button [ Attr.id "oop-structurize"
                                , Attr.class "btn"]
                                [Html.text "Structurize"]
                , Html.button [ Attr.id "oop-add"
                                , Attr.class "btn"]
                                [Html.text "Add One"]
                , Html.button [ Attr.id "oop-templates-show"
                                , Attr.class "btn"
                                , Events.onClick ChangeIsShowTemp]
                                [Html.text "Templates"]
                , Html.a [ Attr.id "oop-preclude"
                        ,  Attr.href "file:///Users/zhangxing/Desktop/bidirectional-preview/src/OOP/Preclude/preclude.txt"]
                        [Html.text "Preclude"]
                ]
            , Html.div [Attr.id "oop-output-div"]
                [ 
                    -- Html.textarea [Attr.id "oop-textarea"
                    --             ,Events.onInput OutputChange]
                    --             []
                ]
            , Html.div [  Attr.id "oop-templates"
                        , Attr.hidden model.isShowTemp
                        ] [  showTemplates <| model.templates
                            ,Html.button [Attr.class "btn"
                                        , Events.onClick AddOneTemplate] [Html.text "Add"]
                            ,Html.button [Attr.id "oop-templates-save"
                                        , Attr.class "btn"] [Html.text "Save"]
                            ]
            ]


showTemplates : List (String, String, String) -> Html Msg
showTemplates templates =
    Html.table [Attr.id "oop-template-table"] 
        (Html.thead [] [
            Html.th [] [Html.text "Number"],
            Html.th [] [Html.text "Class"],
            Html.th [] [Html.text "Object Template"],
            Html.th [] [Html.text "HTML Template"],
            Html.th [] [Html.text "Operation"]
        ] :: (List.indexedMap toTemplatesTableRow templates))


toTemplatesTableRow : Int -> (String, String, String) -> Html Msg
toTemplatesTableRow num (class, objectTemplate, htmlTemplate) =
    Html.tr [] [
        Html.td [] [Html.text (toString (num + 1))],
        Html.td [] [Html.textarea [Attr.value class] []],
        Html.td [] [Html.textarea [Attr.value objectTemplate] []],
        Html.td [] [Html.textarea [Attr.value htmlTemplate] []],
        Html.td [] [Html.button [Attr.class "btn"
                                ,Events.onClick (DeleteTemplate num)] [Html.text "Del"]]
    ]