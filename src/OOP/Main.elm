port module OOP.Main exposing (..)

import OOP.View
import Html exposing (Html)
import Browser exposing (..)
import OOP.Utils exposing (delete)
import OOP.Controller exposing (..)
import OOP.Parser.Term exposing (html)
import OOP.Model exposing (Model, Msg(..),initModel)

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init _ = (initModel, Cmd.none)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SaveCode newCode ->
            let
                newModel =
                    evalCodeToModel {model|code=newCode, codeBackup=newCode}
            in
                ( newModel
                , replyOutput newModel.htmlOutput)

        OutputChange newOutput -> 
            ( {model | htmlOutput = newOutput
            , isConsistent = False}, setCodeRed ())
        
        Update -> 
            let
                newModel =
                    updateCode model
            in
                ( newModel
                , replyCode (newModel.code, True))

        Revert ->
            ( {model|code = model.codeBackup}
            , replyCode (model.codeBackup, model.isConsistent))

        ModifyClass objectInfo ->
            let
                ((objects_, html, envDict), state) =
                    ctrlModifyClass objectInfo model 
            in
            ({model | objectsOutput = objects_
                    , htmlOutput = html
                    , envDict = envDict
                    , state = state }, replyOutput html)

        DeleteObject objectID ->
            let
                ((objects_, html, envDict), state) =
                    ctrlDeleteObject objectID model
            in
            ({model | objectsOutput = objects_
                    , htmlOutput = html
                    , envDict = envDict
                    , state = state }, replyOutput html)

        AddAfterObject objectID ->
            let
                ((objects_, html, envDict), state) =
                    ctrlAddAfterObject objectID model
            in
            ({model | objectsOutput = objects_
                    , htmlOutput = html
                    , envDict = envDict
                    , state = state }, replyOutput html)

        AddAtBegin info ->
            let
                ((objects_, html, envDict), state) =
                    ctrlAddAtBegin info model
            in
            ({model | objectsOutput = objects_
                    , htmlOutput = html
                    , envDict = envDict
                    , state = state }, replyOutput html)

        FindModifiableClassList objectInfo ->
            let
                ret =
                    ctrlFindModifiableClassList objectInfo model.classTable
            in
                (model, replyModifiableClassList ret)

        ChangeIsShowTemp ->
            ({model|isShowTemp = not model.isShowTemp}, Cmd.none)

        AddOneTemplate ->
            ({model|templates = model.templates ++ [("", "", "")]}, Cmd.none)

        DeleteTemplate n ->
            ({model|templates = delete n model.templates}, Cmd.none)

        SaveTemplates table ->
            ({model|templates = listToTemplates table}, Cmd.none)


view : Model -> Html Msg
view = OOP.View.view


port askCode : (String -> msg) -> Sub msg
port askOutput : (String -> msg) -> Sub msg
port replyCode : (String, Bool) -> Cmd msg
port replyOutput : String -> Cmd msg
port setCodeRed : () -> Cmd msg
port askModifiableClassList : (String -> msg) -> Sub msg
port replyModifiableClassList : (String, List String) -> Cmd msg
port askModifyClass : (String -> msg) -> Sub msg
port askDeleteObject : (Int -> msg) -> Sub msg
port askAddObjectAfterObject : (Int -> msg) -> Sub msg
port askAddObjectAtBegin : (String -> msg) -> Sub msg
port askTemplatesSave : (List String -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ askCode SaveCode
        , askOutput OutputChange
        , askModifyClass ModifyClass
        , askDeleteObject DeleteObject
        , askAddObjectAfterObject AddAfterObject
        , askAddObjectAtBegin AddAtBegin
        , askModifiableClassList FindModifiableClassList
        , askTemplatesSave SaveTemplates
        ]