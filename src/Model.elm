module Model exposing(..)

import Syntax exposing (..)

type alias Code = String
type alias Output = String
type alias Path = List (HoleName, Int, String)
type Mode = Console | HTML

type alias Model =
    { code : Code
    , output : Output
    , holeBindings : HEnv
    , context : List Value
    , editContextItem : (Int, String)
    , path : Path
    , currentContext : HoleName
    , codeBackup : Code
    , hbBackup : HEnv
    , isOutputChange : Bool
    , mode: Mode
    }


type Msg 
    = SaveCode Code
    | OutputChange Output
    | ContextChange Int String
    | ChangeCurrentHole String
    | ChangePath (HoleName, Int, String)
    | Preview
    | Update
    | Revert
    | ClearHB


initModel : Model
initModel = { code = ""
            , output = ""
            , holeBindings = []
            , context = []
            , editContextItem = (-1, "")
            , path = []
            , currentContext = HOri -1
            , codeBackup = ""
            , hbBackup = []
            , isOutputChange = False
            , mode = Console
            }