module Controller exposing (..)

import Model exposing (..)
import Syntax exposing (..)
import LangUtils exposing (..)
import Utils exposing (nth)
import Parser_ exposing (parse)
import Debug exposing (toString)
import UnEval exposing (uneval)
import Eval exposing (eval)


evalCodeToModel : Code -> HEnv -> Model
evalCodeToModel code henv =
    let 
        parseResult = 
            parse code 
    in
        case parseResult of
            Result.Ok e ->
                let 
                    (e_, _) =
                        processAfterParse e [] holeIDStart

                    (res1, _) =
                        eval henv [] e_ [(tempHoleCount, 0)]

                    res2 =
                        uneval henv [] e_ res1 holeAddedByUserStart
                    
                    (res3, _) =
                        eval res2.henv [] res2.expr [(tempHoleCount, 0)]
            
                    ((output, context), mode) =
                        case res3 of
                            VHtml _ _ _ _ ->
                                (print res3, HTML)
                            _ ->
                                (( Tuple.first <| print res3
                                , collectUniqueContext res3)
                                , Console)

                    cc =
                        nth 0 context

                    currentContext = 
                        case cc of 
                            Just (IndexedHole hn _) -> hn
                            _       -> HOri -1
                in
                    { code = code
                    , output = output
                    , holeBindings = res2.henv
                    , context = context
                    , editContextItem = (-1, "")
                    , path = []
                    , currentContext = currentContext
                    , codeBackup = code
                    , hbBackup = res2.henv
                    , isOutputChange = False
                    , mode = mode
                    }
            
            Result.Err info ->
                    {code = code
                    , output = toString info
                    , holeBindings = henv
                    , context = []
                    , editContextItem = (-1, "")
                    , path = []
                    , currentContext = HOri -1
                    , codeBackup = ""
                    , hbBackup = []
                    , isOutputChange = False
                    , mode = Console
                    }