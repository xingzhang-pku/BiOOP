module OOP.Parser.Program exposing (..)

import Parser exposing (..)
import OOP.Syntax exposing (..)
import OOP.Parser.ClassTable exposing (clt)
import OOP.Parser.Term exposing (equation)

parse : String -> Result (List DeadEnd) OOP
parse =
    run (oop |. end)


oop : Parser OOP
oop = 
    oneOf 
    [ succeed WithCT
        |= clt
        |= equation
    , succeed NoCT
        |= equation
    ]