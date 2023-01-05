module OOP.Parser.Utils exposing (..)

import Set
import Parser exposing (..)


varName : Parser String
varName =
    variable
    { start = Char.isAlpha
    , inner = \c -> Char.isAlphaNum c || c == '_'
    , reserved = Set.fromList <|
            [ "if"
            , "then"
            , "else"
            , "let"
            , "in"
            , "case"
            , "of"
            , "letrec"
            , "nil"
            , "true"
            , "false"
            , "toString"
            , "ref"
            , "unit"
            , "new"
            , "Html"
            , "map_"
            ]
    }


char_ : Parser Char
char_ = 
    map charhelper (getChompedString (chompIf (\_ -> True)))


charhelper : String -> Char
charhelper s =
    case (List.head (String.toList s)) of
        Just c -> c
        Nothing -> ' '


string_ : Parser String
string_ = 
    getChompedString (chompUntil "\"")