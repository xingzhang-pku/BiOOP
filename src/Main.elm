port module Main exposing (..)

import View
import Browser exposing (..)
import Html exposing (Html)
import Model exposing (Msg(..), Model, Mode(..))
import Syntax exposing (HoleName(..), Value(..))
import String exposing (left)
import Parser_ exposing (parseHoleName)
import Controller exposing (evalCodeToModel)
import UnEval exposing (updateContext, updateCode)

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init _ = (Model.initModel, Cmd.none)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SaveCode newCode ->
            let
                newModel =
                    evalCodeToModel newCode model.holeBindings

                cmd =
                    if newModel.mode == HTML then
                        sendOutput newModel.output
                    else
                        setConsoleVisible newModel.output
            in
            (newModel, cmd)

        OutputChange newOutput ->
            let
                (nop, flag, cmd) = 
                    if  model.mode == Console && left 9 newOutput == "<textarea" 
                    then
                        (model.output, False, Cmd.none)
                    else
                        (newOutput, True, setAceRed ())
            in
            ({model | output = nop
                    , isOutputChange = flag}, cmd)

        ContextChange index newVal ->
            let 
                context =
                    updateContext index newVal model

            in
            case context of
                [] ->
                    ({model | editContextItem = (index, newVal) 
                            , isOutputChange = True }, setAceRed ())
                _ ->
                    ({model | context = context
                            , isOutputChange = True
                            , editContextItem = (-1, "") }, setAceRed ())
        
        ChangeCurrentHole selected ->
            ({model | currentContext = 
                        case (parseHoleName selected) of
                            Result.Ok hn -> hn
                            Result.Err _ -> HOri -1
                    , path = []
            }, Cmd.none)

        ChangePath (holename, index, varname) ->
            ({ model | path = model.path++[(holename, index, varname)]
            }, Cmd.none)

        Preview ->
            let
                (newHB, newCode) =
                    updateCode model

            in
            ({model | code = newCode
                    , holeBindings = newHB
            }, sendCode (newCode, False))

        Update ->
            let
                (newHB, newCode) =
                    updateCode model
            in
            ({model | code         = newCode
                    , codeBackup   = newCode
                    , holeBindings = newHB
                    , hbBackup     = newHB
                    , isOutputChange = False
            }, sendCode (newCode, False))


        Revert ->
            ({model | code = model.codeBackup
                    , holeBindings = model.hbBackup
            }, sendCode (model.codeBackup, model.isOutputChange))

        ClearHB ->
            ({model | holeBindings = []}, Cmd.none)


view : Model -> Html Msg
view = View.view


port sendCode : (String, Bool) -> Cmd msg
port sendOutput : String -> Cmd msg
port setAceRed : () -> Cmd msg
port setConsoleVisible : String -> Cmd msg
port receiveCode : (String -> msg) -> Sub msg
port receiveOutput : (String -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ receiveCode SaveCode
        , receiveOutput OutputChange
        ]