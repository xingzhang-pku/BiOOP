module OOP.Parser.ClassTable exposing (..)

import Parser exposing (..)
import OOP.Syntax exposing (..)
import OOP.Parser.Utils exposing (varName)
import OOP.Parser.Term exposing (term)
import OOP.Parser.Pattern exposing (pattern)
import OOP.Parser.WhiteSpaces exposing (mspaces)


parse : String -> Result (List DeadEnd) ClassTable
parse =
    run (clt |. end)


-- ClassTable
clt : Parser ClassTable
clt =
    succeed (\c cl spc -> ([spc], c::cl))
    |= classDef
    |= loop [] classList
    |= mspaces


classList : List ClassDef -> Parser (Step (List ClassDef) (List ClassDef))
classList revClasses =
    oneOf
    [ succeed (\c -> Loop (c :: revClasses))
        -- |. spaces
        |= classDef
    , succeed ()
        |> map (\_ -> Done (List.reverse revClasses))
    ]


-- Class Definition
classDef : Parser ClassDef
classDef = 
    oneOf
    [ backtrackable (succeed (\(spcs, self, father) fs ms spc6 ->
        (spcs ++ [spc6], ((self, father), fs, ms)))
        |= classDefHelper
        |= fields
        |= methods
        |. symbol "}"
        |= mspaces)
    
    , backtrackable (succeed (\(spcs, self, father) fs spc6 ->
        (spcs ++ [spc6], ((self, father), fs, ([],[]))))
        |= classDefHelper
        |= fields
        |. symbol "}"
        |= mspaces)

    , backtrackable (succeed (\(spcs, self, father) ms spc6 ->
        (spcs ++ [spc6], ((self, father), ([],[]), ms)))
        |= classDefHelper
        |= methods
        |. symbol "}"
        |= mspaces)

    , succeed (\(spcs, self, father) spc6 ->
        (spcs ++ [spc6], ((self, father), ([],[]), ([],[]))))
        |= classDefHelper
        |. symbol "}"
        |= mspaces
    ]


classDefHelper : Parser (List String, String, String)
classDefHelper =
    succeed (\spc1 self spc2 spc3 father spc4 spc5 ->
                ([spc1, spc2, spc3, spc4, spc5], self, father))
        |. symbol "Class"
        |= mspaces
        |= varName
        |= mspaces
        |. symbol "Extends"
        |= mspaces
        |= varName
        |= mspaces
        |. symbol "{"
        |= mspaces


-- Class Fields
fields : Parser Fields
fields = 
    succeed (\f spc1 spc2 typ spc3 fl spc4 -> ([spc4],([spc1, spc2, spc3], f, typ)::fl))
    |= varName
    |= mspaces
    |. symbol ":"
    |= mspaces
    |= typeName
    |= mspaces
    |= loop [] fieldList
    |. symbol ";"
    |= mspaces


fieldList : List (WS, String, String) -> Parser (Step (List (WS, String, String)) (List (WS, String, String)))
fieldList revFields =
    oneOf
    [ succeed (\spc1 f spc2 spc3 typ spc4 -> Loop (([spc1, spc2, spc3, spc4], f, typ) :: revFields))
        |. symbol ","
        |= mspaces
        |= varName
        |= mspaces
        |. symbol ":"
        |= mspaces
        |= typeName
        |= mspaces
    , succeed ()
        |> map (\_ -> Done (List.reverse revFields))
    ]


-- Class Methods
methods : Parser Methods
methods =
    succeed (\m ml -> ([], m::ml))
    |= method
    |= loop [] methodList

methodList : List Method -> Parser (Step (List Method) (List Method))
methodList revMethods =
    oneOf
    [ succeed (\f -> Loop (f :: revMethods))
        |= method
    , succeed ()
        |> map (\_ -> Done (List.reverse revMethods))
    ]


-- Method Definition
method : Parser Method
method =
    succeed (\name pat spc1 spc2 t spc3 spc4 -> 
            ([spc1,spc2,spc3,spc4], (name, pat, t)))
    |= varName
    |. symbol "("
    |= pattern
    |. symbol ")"
    |= mspaces
    |. symbol "{"
    |= mspaces
    |= term
    |. symbol "}"
    |= mspaces
    |. symbol ";"
    |= mspaces


typeName : Parser String
typeName =
    getChompedString (chompWhile isnotTypeDelimiter)


isnotTypeDelimiter : Char -> Bool
isnotTypeDelimiter c = 
    (c /= ',' && c /= ';')