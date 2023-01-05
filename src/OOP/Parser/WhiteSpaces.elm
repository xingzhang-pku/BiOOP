module OOP.Parser.WhiteSpaces exposing (..)

import Parser exposing (..)

mspaces : Parser String
mspaces =
    getChompedString (chompWhile isWhiteSpace)


isWhiteSpace : Char -> Bool
isWhiteSpace c =
    c == ' ' || c == '\n' || c == '\r'