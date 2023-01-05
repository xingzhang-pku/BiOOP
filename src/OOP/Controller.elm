module OOP.Controller exposing (..)

import String exposing (toInt)
import OOP.Preclude.Gui as Gui
import OOP.Eval exposing (eval)
import Debug exposing (toString)
import OOP.Model exposing (Model)
import OOP.UnEval exposing (uneval)
import OOP.Parser.Program as Program
import OOP.Objects.Update exposing (..)
import OOP.Objects.Templates exposing (..)
import OOP.Parser.Html exposing (parseHtml)
import OOP.Printer.Term exposing (printTerm)
import OOP.Preclude.Gui exposing (parsedGui)
import OOP.Printer.Value exposing (printValue)
import OOP.CTLift exposing (ctLift, delSubClasses)
import OOP.Objects.O2HTranslator exposing (object2Html)
import OOP.Objects.H2OTranslator exposing (html2Object)
import OOP.Printer.ClassTable exposing (printClassTable)
import OOP.LangUtils exposing (processAfterParse, appendCT)
import OOP.Preclude.Library exposing (assemble, parsedLibrary, library)
import OOP.Syntax exposing (OOP(..), Value(..), ClassTable, State, SubClsCnt)


evalCodeToModel : Model -> Model
evalCodeToModel model =
    if model.isOnlyObjects then
        evalOnlyObjects model
    else
        evalNotOnlyObjects model


evalOnlyObjects : Model -> Model
evalOnlyObjects model =
    let
        parseRes =
            Program.parse model.code
    in
        case parseRes of
            Result.Ok (WithCT classtb term) ->
                let
                    pTerm =
                        processAfterParse 
                        <| assemble parsedLibrary term

                    withGui =
                        Gui.assemble classtb

                    (objectVal, state, _) =
                        eval [] [] withGui pTerm

                    (htmlVal, _, envDict) =
                        object2Html objectVal 0 [] model.templates state

                    htmlOutput =
                        printValue htmlVal
                in
                    {model| 
                        objectsOutput = objectVal,
                        htmlOutput = htmlOutput,
                        state = state,
                        isConsistent = True,
                        envDict = envDict,
                        classTable = withGui}
            
            Result.Ok (NoCT term) ->
                let
                    pTerm =
                        processAfterParse 
                        <| assemble parsedLibrary term

                    (objectVal, state, _) =
                        eval [] [] parsedGui pTerm

                    (htmlVal, _, envDict) =
                        object2Html objectVal 0 [] [] state

                    htmlOutput =
                        printValue htmlVal
                in
                    {model| 
                        objectsOutput = objectVal,
                        htmlOutput = htmlOutput,
                        state = state,
                        isConsistent = True,
                        envDict = envDict,
                        classTable = parsedGui}

            Result.Err info ->
                {model| 
                    objectsOutput = VError "",
                    htmlOutput = toString info,
                    state = [],
                    isConsistent = False,
                    envDict = [],
                    classTable = ([],[])}


evalNotOnlyObjects : Model-> Model
evalNotOnlyObjects model =
    let
        parseRes =
            Program.parse model.code
    in
        case parseRes of
            Result.Ok (WithCT classtb term) ->
                let
                    pTerm =
                        processAfterParse 
                        <| assemble parsedLibrary term

                    withGui =
                        Gui.assemble classtb

                    (val, state, _) =
                        eval [] [] withGui pTerm

                    output =
                        printValue val
                in
                    {model| 
                            htmlOutput = output,
                            state = state,
                            isConsistent = True,
                            classTable = withGui}
            
            Result.Ok (NoCT term) ->
                let
                    pTerm =
                        processAfterParse 
                        <| assemble parsedLibrary term

                    (val, state, _) =
                        eval [] [] parsedGui pTerm

                    output =
                        printValue val
                in
                    {model| 
                            htmlOutput = output,
                            state = state,
                            isConsistent = True,
                            classTable = parsedGui}

            Result.Err info ->
                {model|
                    htmlOutput = toString info,
                    state = [],
                    classTable = ([],[])}


updateCode : Model -> Model
updateCode model =
    let
        parseValueRes =
            parseHtml model.htmlOutput

        outputRes =
            if model.isOnlyObjects then
                case parseValueRes of
                    Result.Ok html ->
                        case html2Object html model.envDict model.templates model.state of
                            (VError info, _) ->
                                Result.Err info
                            
                            (objects, state_) ->
                                Result.Ok (objects, state_)

                    Result.Err info ->
                        Result.Err (toString info)
            else
                Result.map (\val -> (val, model.state)) parseValueRes

        parseProgramRes =
            Program.parse model.code
    in
        case (parseProgramRes, outputRes) of
            (Result.Ok (WithCT classtb term), Result.Ok (output, newState)) ->
                let
                    pTerm =
                        processAfterParse 
                        <| assemble parsedLibrary term

                    -- withGui =
                    --     Gui.assemble classtb

                    subClsCnt =
                        genCnt classtb
                    
                    (ctx_, term_, _) =
                        uneval subClsCnt {env = [], state = [], classtb = classtb} pTerm 
                        <| {value = output, state = newState}

                    -- classTable =
                    --     printClassTable (Gui.split ctx_.classtb)

                    (_, _, invks) =
                        eval [] [] (appendCT classtb ctx_.classtb) term_

                    (liftedCT, delList) =
                        ctLift classtb ctx_.classtb invks
                    
                    classTable =
                        printClassTable liftedCT

                    newTerm =
                        printTerm (delSubClasses delList term_)

                    termDelPreclude =
                        String.dropLeft (String.length library) newTerm
                in
                    { model | code = classTable ++ termDelPreclude
                            , classTable = ctx_.classtb }
            
            (Result.Ok (NoCT term), Result.Ok (output, newState)) ->
                let
                    pTerm =
                        processAfterParse 
                        <| assemble parsedLibrary term
                    
                    subClsCnt =
                        genCnt parsedGui
                    
                    (_, term_, _) =
                        uneval subClsCnt {env = [], state = [], classtb = parsedGui} pTerm 
                        <| {value = output, state = newState}

                    newTerm =
                        printTerm term_

                    termDelPreclude =
                        String.dropLeft (String.length library) newTerm
                in
                    { model | code = termDelPreclude }

            (Result.Err info, Result.Ok _)->
                { model | code = toString info }

            (Result.Ok _, Result.Err info)->
                { model | htmlOutput = info }

            (Result.Err info1, Result.Err info2)->
                { model | code = (toString info1) ++ "\n" ++ info2 }


ctrlModifyClass : String -> Model -> ((Value, String, EnvDict), State)
ctrlModifyClass objectInfo model =
    let
        (class, objectID) = 
            case String.split "-" objectInfo of
                c :: id ::[] ->
                    (c, id)
                
                _ ->
                    ("Error : 20.", "")
        
        ((flag, objects_, _), state_) =
            case toInt objectID of
                Just objectID_ ->
                    modifyClass model.objectsOutput 0 objectID_ class model.classTable model.state

                Nothing ->
                    ((False, VError "Object ID Erro : 02.", -1), model.state)
    in
        (ctrlHelper flag objects_ model.templates state_, state_)
        


ctrlDeleteObject : ObjectID -> Model -> ((Value, String, EnvDict), State)
ctrlDeleteObject objectID model =
    let
        ((flag, objects_, _), state_) =
            deleteObject model.objectsOutput 0 objectID model.state
    in
        (ctrlHelper flag objects_ model.templates state_, state_)


ctrlAddAfterObject : ObjectID -> Model -> ((Value, String, EnvDict), State)
ctrlAddAfterObject objectID model =
    let
        ((flag, objects_, _), state_) =
            addObjectAfterObject model.objectsOutput 0 objectID model.state
    in
        (ctrlHelper flag objects_ model.templates state_, state_)


ctrlAddAtBegin : String -> Model -> ((Value, String, EnvDict), State)
ctrlAddAtBegin info model =
    let
        (id1, id2) = 
            case String.split "-" info of
                "List" :: fid :: oid ::[] ->
                    (oid, fid)
                
                _ ->
                    ("Error : 21.", "")
    in
        case (toInt id1, toInt id2) of
            (Just objectID, Just fieldID) ->
                let
                    ((flag, objects_, _), state_) =
                        addObjectAtBegin model.objectsOutput 0 objectID fieldID model.classTable model.state
                in
                    (ctrlHelper flag objects_ model.templates state_, state_)
                
            _ ->
                ((VError "Error : 24.", "", []), model.state)


ctrlHelper : Bool -> Value -> List (String, String, String) -> State -> (Value, String, EnvDict)
ctrlHelper flag objects_ templates state =
    if flag 
        then
            let
                (val, _, envDict) =
                    object2Html objects_ 0 [] templates state
            in
                (objects_, printValue val, envDict)
        else
            (VError "Error : 25.", "", [])


ctrlFindModifiableClassList : String -> ClassTable -> (String, List Class)
ctrlFindModifiableClassList objectInfo classtb =
    case String.split "-" objectInfo of
        class :: _ :: [] ->
            case findAncestorClasses class classtb of
                Just ls ->
                    (objectInfo, ls)
                
                Nothing ->
                    (objectInfo, [])

        _ ->
            (objectInfo, [])


listToTemplates : List String -> List (String, String, String)
listToTemplates ls =
    case ls of
        class::op::hp::res ->
            (class, op, hp) :: (listToTemplates res)

        [] ->
            []

        _ ->
            [("Error : 30.", "", "")]


genCnt : ClassTable -> SubClsCnt
genCnt (_, ctb) =
    List.map (\(_, ((c, _), _ ,_)) -> (c, 0)) ctb