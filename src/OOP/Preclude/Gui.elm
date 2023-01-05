module OOP.Preclude.Gui exposing (..)

import OOP.Syntax exposing (ClassTable)
import OOP.Parser.ClassTable exposing (parse)

guiLibrary : String
guiLibrary =
    """
    """


parsedGui : ClassTable
parsedGui =
    case parse guiLibrary of
        Result.Ok clt -> 
            clt
        
        Result.Err _ ->
            ([], [])


guiLen : Int
guiLen =
    let
        (_, ls) =
            parsedGui
    in
        List.length ls


assemble : ClassTable -> ClassTable
assemble (ws, ls1)  =
    let 
        (_, ls2) =
            parsedGui
    in
        (ws, ls2 ++ ls1)


split : ClassTable -> ClassTable
split (ws, clt) =
    (ws, List.drop guiLen clt)