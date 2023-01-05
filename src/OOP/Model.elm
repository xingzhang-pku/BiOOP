module OOP.Model exposing (..)

import OOP.Syntax exposing (..)
import OOP.Objects.Templates exposing (EnvDict, ObjectID, Class)

type alias Model =
    { code : String
    , codeBackup : String
    , objectsOutput : Value
    , htmlOutput : String
    , state : State
    , isConsistent : Bool
    , isOnlyObjects : Bool
    , envDict : EnvDict
    , classTable : ClassTable
    , templates : List (String, String, String)
    , isShowTemp : Bool
    }


type Msg 
    = SaveCode String
    | OutputChange String
    | ModifyClass String
    | DeleteObject ObjectID
    | AddAfterObject ObjectID
    | AddAtBegin String
    | FindModifiableClassList Class
    | DeleteTemplate Int
    | SaveTemplates (List String)
    | ChangeIsShowTemp
    | AddOneTemplate
    | Update
    | Revert


initModel : Model
initModel = { code = ""
            , codeBackup = ""
            , objectsOutput = VError ""
            , htmlOutput = ""
            , state = []
            , isConsistent = True
            , isOnlyObjects = True
            , envDict = []
            , classTable = ([],[])
            , templates = []
            , isShowTemp = True
            }