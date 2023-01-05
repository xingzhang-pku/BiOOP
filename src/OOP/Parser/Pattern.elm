module OOP.Parser.Pattern exposing (..)

import Parser exposing (..)
import OOP.Syntax exposing (..)
import Parser.Extras exposing (..)
import Parser.Expression exposing (..)
import OOP.Parser.Utils exposing (varName, char_, string_)
import OOP.Parser.WhiteSpaces exposing (mspaces)

-- Pattern
-- PVar
pvar : Parser Pattern
pvar =
    succeed (\vn spc -> PVar [spc] vn)
        |= varName
        |= mspaces


-- PCons
pList : Parser Pattern
pList =
    succeed (\spc1 p ps spc2 -> PList [spc1, spc2] p ps)
        |. symbol "["
        |= mspaces
        |= lazy (\_ -> pterm)
        |= pListloop
        |. symbol "]"
        |= mspaces


pListloop : Parser Pattern
pListloop =
    loop [] pListHelper |> (map ptermListToPList)


pListHelper : List (Pattern, WS) -> Parser (Step (List (Pattern, WS)) (List (Pattern, WS)))
pListHelper revPats =
    oneOf
    [ succeed (\spc p -> Loop ((p, [spc]) :: revPats))
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> pterm)
    , succeed ()
        |> map (\_ -> Done (List.reverse revPats))
    ]


ptermListToPList: List (Pattern,WS) -> Pattern
ptermListToPList ls =
    case ls of
        [] ->
            PEmpList []
        (p, ws) :: ps ->
            PList ws p (ptermListToPList ps)


-- PEmpList
pempList : Parser Pattern
pempList =
    succeed (\spc1 spc2 -> PEmpList [spc1, spc2])
        |. symbol "["
        |= mspaces
        |. symbol "]"
        |= mspaces


-- PNil
pnil : Parser Pattern
pnil =
    succeed (\spc -> PNil [spc])
        |. keyword "nil"
        |= mspaces


-- PInt
pint : Parser Pattern
pint =
    oneOf 
        [ succeed (\n spc -> PInt [spc] n)
            |= number
                { int = Just identity
                , hex = Just identity 
                , octal = Just identity
                , binary = Just identity 
                , float = Nothing
                }
            |= mspaces
        , succeed (\n spc -> PInt [spc] (negate n))
            |. symbol "-"
            |= int
            |= mspaces
        ]


-- PFloat
pfloat : Parser Pattern
pfloat =
    oneOf
        [ succeed (\n spc -> PFloat [spc] n)
            |= number
                { int = Nothing
                , hex = Nothing 
                , octal = Nothing
                , binary = Nothing 
                , float = Just identity
                }
            |= mspaces
        , succeed (\n spc -> PFloat [spc] (negate n))
            |. symbol "-"
            |= float
            |= mspaces
        ]


-- PTrue
ptrue : Parser Pattern
ptrue =
    succeed (\spc -> PTrue [spc])
        |. keyword "true"
        |= mspaces


-- PFalse
pfalse : Parser Pattern
pfalse =
    succeed (\spc -> PFalse [spc])
        |. keyword "false"
        |= mspaces


-- PChar
pchar : Parser Pattern
pchar =
    succeed (\c spc -> PChar [spc] c)
        |. symbol "\'"
        |= char_
        |. symbol "\'"
        |= mspaces


-- PString
pstring : Parser Pattern
pstring =
    succeed (\s spc -> s
                    |> PString [spc])
        |. symbol "\""
        |= string_
        |. symbol "\""
        |= mspaces


-- PBTuple
pbtuple : Parser Pattern
pbtuple =
    succeed (\spc1 p1 spc2 p2 spc3 -> PBTuple [spc1, spc2, spc3] p1 p2)
        |. symbol "("
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol ")"
        |= mspaces


-- PTTuple
pttuple : Parser Pattern
pttuple =
    succeed (\spc1 p1 spc2 p2 spc3 p3 spc4 -> PTTuple [spc1, spc2, spc3, spc4] p1 p2 p3)
        |. symbol "("
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol ")"
        |= mspaces


-- PUnit
punit : Parser Pattern
punit =
    succeed (\spc -> PUnit [spc])
    |. symbol "unit"
    |= mspaces


pterm : Parser Pattern
pterm =
    oneOf
    [ pvar
    , pnil
    , backtrackable pempList
    , lazy (\_ -> pList)
    , backtrackable pint
    , backtrackable pfloat
    , ptrue
    , pfalse
    , backtrackable pbtuple
    , pttuple
    , pstring
    , pchar
    , punit
    ]


pConsOp : OperatorTable Pattern
pConsOp = [[Infix (succeed (\spc -> PCons [spc])
                        |. symbol "::"
                        |= mspaces)
            AssocRight]
        , [Infix (succeed (\spc -> PCons1 [spc])
                        |. symbol ":"
                        |= mspaces)
            AssocRight]]


pattern : Parser Pattern
pattern = buildExpressionParser pConsOp (lazy (\_ -> pterm))