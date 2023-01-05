module OOP.Parser.Value exposing (..)

import Parser exposing (..)
import OOP.Syntax exposing (Value(..))
import OOP.Parser.Utils exposing (char_, string_, varName)


parse : String -> Result (List DeadEnd) Value
parse s =
    run (value |. end) s


value : Parser Value
value =
    oneOf
    [ backtrackable int_
    , backtrackable float_
    , true
    , false
    , char
    , string
    , backtrackable nil
    , lazy (\_ -> list)
    , backtrackable tuple2
    , tuple3
    , loc
    , unit
    , new
    ]


int_ : Parser Value
int_ =
    oneOf
        [ succeed VInt
            |= number
                { int = Just identity
                , hex = Just identity
                , octal = Just identity
                , binary = Just identity
                , float = Nothing
                }
            |. spaces
        , succeed (\n -> VInt (negate n)) 
            |. symbol "-"
            |= int
            |. spaces
        ]


float_ : Parser Value
float_ =
    oneOf
        [ succeed VFloat
            |= number
                { int = Nothing
                , hex = Nothing
                , octal = Nothing
                , binary = Nothing
                , float = Just identity
                }
            |. spaces
        , succeed (\n -> VFloat (negate n))
            |. symbol "-"
            |= float
            |. spaces
        ]


true : Parser Value
true =
    succeed VTrue
        |. keyword "true"
        |. spaces


false : Parser Value
false =
    succeed VFalse
        |. keyword "false"
        |. spaces


char : Parser Value
char =
    succeed (\c -> VChar c)
        |. symbol "\'"
        |= char_
        |. symbol "\'"
        |. spaces


string : Parser Value
string =
    succeed (\s -> VString s)
        |. symbol "\""
        |= string_
        |. symbol "\""
        |.spaces


list : Parser Value
list =
    succeed VCons
        |. symbol "["
        |. spaces
        |= lazy (\_ -> value)
        |= listloop
        |. symbol "]"
        |. spaces


listloop : Parser Value
listloop =
    listHelper
    |> loop []
    |> (map valueListToVCons)


listHelper : List Value -> Parser (Step (List Value) (List Value))
listHelper revValues =
    oneOf
    [ succeed (\e -> Loop (e :: revValues))
        |. symbol ","
        |. spaces
        |= lazy (\_ -> value)
    , succeed ()
        |> map (\_ -> Done (List.reverse revValues))
    ]


valueListToVCons : List Value -> Value
valueListToVCons ls =
    case ls of
        [] ->
            VNil

        v :: vs ->
            VCons v (valueListToVCons vs)


nil : Parser Value
nil =
    succeed VNil
        |. symbol "["
        |. spaces
        |. symbol "]"
        |. spaces


tuple2 : Parser Value
tuple2 =
    succeed VTuple2
        |. symbol "("
        |. spaces
        |= lazy (\_ -> value)
        |. symbol ","
        |. spaces
        |= lazy (\_ -> value)
        |. symbol ")"
        |. spaces


tuple3 : Parser Value
tuple3 =
    succeed VTuple3
        |. symbol "("
        |. spaces
        |= lazy (\_ -> value)
        |. symbol ","
        |. spaces
        |= lazy (\_ -> value)
        |. symbol ","
        |. spaces
        |= lazy (\_ -> value)
        |. symbol ")"
        |. spaces


loc : Parser Value
loc =
    succeed VLoc
    |. symbol "<"
    |. spaces
    |= number   
            { int = Just identity
            , hex = Nothing
            , octal = Nothing
            , binary = Nothing
            , float = Nothing
            }
    |. spaces
    |. symbol ">"
    |. spaces


unit : Parser Value
unit =
    succeed VUnit
    |. symbol "_"
    |. spaces


new : Parser Value
new =
    succeed VNew
    |. keyword "new"
    |. spaces
    |= varName
    |. symbol "("
    |= lazy (\_ -> value)
    |. symbol ")"
    |. spaces