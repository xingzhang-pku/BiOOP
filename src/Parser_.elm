module Parser_ exposing (..)

import Set
import Parser exposing (..)
import Syntax exposing (..)
import Parser.Extras exposing (..)
import Parser.Expression exposing (..)
import LangUtils exposing (removeIndexFromVenv)


mSpaces : Parser String
mSpaces =
    getChompedString (chompWhile isWhiteSpace)


isWhiteSpace : Char -> Bool
isWhiteSpace c =
    c == ' ' || c == '\n' || c == '\r'


parse : String -> Result (List DeadEnd) Expr
parse =
    run (expr |. end)


html : Parser Expr
html =
    succeed (\n s1 e1 s2 e2 s3 e3 ->
            EHtml ([s1, s2, s3], defaultId) n e1 e2 e3)
    |. symbol "Html."
    |= varName
    |= mSpaces
    |= lazy (\_ -> aexpr)
    |= mSpaces
    |= lazy (\_ -> aexpr)
    |= mSpaces
    |= lazy (\_ -> aexpr)


int_ : Parser Expr
int_ =
    succeed (\n s-> EInt ([s], defaultId) n)
    |= number
        { int = Just identity
        , hex = Just identity
        , octal = Just identity
        , binary = Just identity
        , float = Nothing
        }
    |= mSpaces


float_ : Parser Expr
float_ =
    succeed (\n s -> EFloat ([s], defaultId) n)
    |= number
        { int = Nothing
        , hex = Nothing
        , octal = Nothing
        , binary = Nothing
        , float = Just identity
        }
    |= mSpaces


true : Parser Expr
true =
    succeed (\s -> ETrue ([s], defaultId))
        |. keyword "true"
        |= mSpaces


false : Parser Expr
false =
    succeed (\s -> EFalse ([s], defaultId))
        |. keyword "false"
        |= mSpaces


char_ : Parser Char
char_ = 
    map charhelper (getChompedString (chompIf (\_ -> True)))


charhelper : String -> Char
charhelper s =
    case (List.head (String.toList s)) of
        Just c -> c
        Nothing -> ' '


char : Parser Expr
char =
    succeed (\c s -> EChar ([s], defaultId) c)
        |. symbol "\'"
        |= char_
        |. symbol "\'"
        |= mSpaces


string_ : Parser String
string_ = 
    getChompedString (chompUntil "\"")


string : Parser Expr
string =
    succeed (\s ws -> s
                    |> String.toList
                    |> stringToExpr ([ws], esQuo))
        |. symbol "\""
        |= string_
        |. symbol "\""
        |= mSpaces


stringToExpr : WS -> List Char -> Expr
stringToExpr ws s =
    case s of
        [] -> 
            ENil ws
        
        c::cs ->
            ECons ws (EChar defaultWS c) (stringToExpr ([], esElm) cs)


varName : Parser String
varName =
    variable
    { start = Char.isLower
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
            ]
    }


var : Parser Expr
var =
    succeed (\v s -> EVar ([s], defaultId) v)
    |= varName
    |= mSpaces


abs : Parser Expr
abs =
    succeed (\s1 p s2 e-> 
            ELam ([s1, s2], defaultId) p e)
        |. symbol "\\"
        |= mSpaces
        |= lazy (\_ -> pattern)
        |. symbol "=>"
        |= mSpaces
        |= lazy (\_ -> expr)


let_ : Parser Expr
let_ =
    succeed (\s1 p s2 e1 s3 e2 -> 
            ELet ([s1, s2, s3], defaultId) p e1 e2)
        |. keyword "let"
        |= mSpaces
        |= lazy (\_ -> pattern)
        |. symbol "="
        |= mSpaces
        |= lazy (\_ -> expr)
        |. keyword "in"
        |= mSpaces
        |= lazy (\_ -> expr)


letrec : Parser Expr
letrec =
    succeed (\s1 p s2 e1 s3 e2 -> 
            ELetrec ([s1, s2, s3], defaultId) p e1 e2)
        |. keyword "letrec"
        |= mSpaces
        |= lazy (\_ -> pattern)
        |. symbol "="
        |= mSpaces
        |= lazy (\_ -> expr)
        |. keyword "in"
        |= mSpaces
        |= lazy (\_ -> expr)


nil : Parser Expr
nil =
    succeed (\s1 s2 ->
            ENil ([s1, s2], eoAddFromEmp))
        |. symbol "["
        |= mSpaces
        |. symbol "]"
        |= mSpaces


caseToApp : Expr -> Branch -> WS -> Expr
caseToApp e b ws =
    EApp ws
        (ELam defaultWS (PVar defaultWS caseN) 
            (ECase defaultWS (EVar defaultWS caseN) b)) e


caseOf : Parser Expr
caseOf =
    succeed (\s1 e s2 b ->
            caseToApp e b ([s1, s2], caseId))
        |. keyword "case"
        |= mSpaces
        |= lazy (\_ -> expr)
        |. keyword "of"
        |= mSpaces
        |= branch


iteToApp : Expr -> Expr -> Expr -> String -> List String -> Expr
iteToApp e1 e2 e3 s1 wsList=
    EApp ([s1], ifId)
        (ELam defaultWS (PVar defaultWS caseN) 
            (ECase (wsList,1) (EVar defaultWS caseN) 
                ( BCom defaultWS
                    (BSin defaultWS (PTrue defaultWS) e2)
                    (BSin defaultWS (PFalse defaultWS) e3)
                ))) e1


iteState : Parser Expr
iteState =
    succeed (\s1 e1 s2 e2 s3 e3 ->
            iteToApp e1 e2 e3 s1 [s2, s3])
        |. keyword "if"
        |= mSpaces
        |= lazy (\_ -> expr)
        |. keyword "then"
        |= mSpaces
        |= lazy (\_ -> expr)
        |. keyword "else"
        |= mSpaces
        |= lazy (\_ -> expr)


sinBranch : Parser Branch
sinBranch = 
    succeed (\p s e ->
            BSin ([s], defaultId) p e)
        |= lazy (\_ -> pattern)
        |. symbol "=>"
        |= mSpaces
        |= lazy (\_ -> expr)


branchOp : OperatorTable Branch
branchOp = [[Infix ( succeed (\s -> BCom ([s], defaultId))
                        |. symbol "|"
                        |= mSpaces
                    ) 
            AssocRight]]


branch : Parser Branch
branch = buildExpressionParser branchOp sinBranch


hole : Parser Expr
hole =
    succeed (\s -> EHole ([s], defaultId) (HInter 0))
        |. keyword "_"
        |= mSpaces


parens_ : Parser Expr
parens_ =
    succeed (\s1 e s2 -> EParens ([s1, s2], defaultId) e)
        |. symbol "("
        |= mSpaces
        |= lazy (\_ -> expr)
        |. symbol ")"
        |= mSpaces


btuple : Parser Expr
btuple =
    succeed (\s1 e1 s2 e2 s3 ->
                EBTuple ([s1, s2, s3], defaultId) e1 e2)
        |. symbol "("
        |= mSpaces
        |= lazy (\_ -> expr)
        |. symbol ","
        |= mSpaces
        |= lazy (\_ -> expr)
        |. symbol ")"
        |= mSpaces


ttuple : Parser Expr
ttuple =
    succeed (\s1 e1 s2 e2 s3 e3 s4 ->
                ETTuple ([s1, s2, s3, s4], defaultId) e1 e2 e3)
        |. symbol "("
        |= mSpaces
        |= lazy (\_ -> expr)
        |. symbol ","
        |= mSpaces
        |= lazy (\_ -> expr)
        |. symbol ","
        |= mSpaces
        |= lazy (\_ -> expr)
        |. symbol ")"
        |= mSpaces


tostr : Parser Expr
tostr =
    succeed (\s e -> EToStr ([s], defaultId) e)
        |. keyword "toString"
        |= mSpaces
        |= lazy (\_ -> expr)


aexpr : Parser Expr
aexpr =
    oneOf
    [ iteState
    , backtrackable parens_
    , backtrackable btuple
    , ttuple
    , true
    , false
    , backtrackable int_
    , backtrackable float_
    , var
    , lazy (\_ -> abs)
    , lazy (\_ -> let_)
    , lazy (\_ -> letrec)
    , caseOf
    , hole
    , backtrackable nil
    , list
    , string
    , char
    , html
    , tostr
    ]


flip : (a -> b -> c) -> b -> a -> c
flip f x y = f y x

term : Parser Expr
term =
    let
        foldl1 f (x, xs) =
            List.foldl (flip f) x xs
    in
        succeed (foldl1 (EApp defaultWS))
            |=  some (lazy <| \_ -> aexpr)


bopParser : String -> Bop -> Parser (Expr -> Expr -> Expr)
bopParser s op =
    succeed (\ws -> EBPrim ([ws], defaultId) op)
        |. symbol s
        |= mSpaces


uopParser : String -> Uop -> Parser (Expr -> Expr)
uopParser s op =
    succeed (\ws -> EUPrim ([ws], defaultId) op)
        |. symbol s
        |= mSpaces


list : Parser Expr
list =
    succeed (\s1 e1 es s2 ->
        ECons ([s1, s2], eoSquare) e1 es)
        |. symbol "["
        |= mSpaces
        |= lazy (\_ -> expr)
        |= listloop
        |. symbol "]"
        |= mSpaces


listloop : Parser Expr
listloop =
    loop [] listHelper |> (map exprListToECons)


listHelper : List (Expr, WS) -> Parser (Step (List (Expr, WS)) (List (Expr, WS)))
listHelper  revExprs =
    oneOf
    [ succeed (\s e -> Loop ((e, ([s], eoElm)) :: revExprs))
        |. symbol ","
        |= mSpaces
        |= lazy (\_ -> expr)
    , succeed ()
        |> map (\_ -> Done (List.reverse revExprs))
    ]


exprListToECons : List (Expr, WS) -> Expr
exprListToECons ls =
    case ls of
        [] ->
            ENil ([], eoElm)
        (e, s) :: es ->
            ECons s e (exprListToECons es)


cons : Parser (Expr -> Expr -> Expr)
cons =
    succeed (\s -> ECons ([s], eoCons))
        |. symbol "::"
        |= mSpaces


operators : OperatorTable Expr
operators =
    [ [Prefix (uopParser "-" Neg)]
    , [Prefix (uopParser "!" Not)]
    , [Infix cons AssocRight]
    , [Infix (bopParser "*" Mul) AssocLeft, Infix (bopParser "//" Div) AssocLeft]
    , [Infix (backtrackable (bopParser "+" Add)) AssocLeft, Infix (bopParser "-" Sub) AssocLeft]
    , [Infix (backtrackable (bopParser "/" DDiv)) AssocLeft]
    , [Infix (bopParser "++" Cat) AssocLeft]
    , [ Infix (backtrackable (bopParser "<" Lt)) AssocNone
    , Infix (backtrackable (bopParser ">" Gt)) AssocNone]
    , [Infix (bopParser "<=" Le) AssocNone
    , Infix (bopParser ">=" Ge) AssocNone]
    
    , [Infix (bopParser "==" Eq) AssocNone]
    , [Infix (bopParser "&&" And) AssocLeft]
    , [Infix (bopParser "||" Or) AssocLeft]
    ]


expr : Parser Expr
expr =
    buildExpressionParser operators (lazy <| \_ -> term)


pvar : Parser Pattern
pvar =
    succeed (\v s -> PVar ([s], defaultId) v)
        |= varName
        |= mSpaces


pnil : Parser Pattern
pnil =
    succeed (\s1 s2 ->
            PNil ([s1, s2], poNil))
        |. symbol "["
        |= mSpaces
        |. symbol "]"
        |= mSpaces


pint : Parser Pattern
pint =
    oneOf 
        [ succeed (\n s -> PInt ([s], defaultId) n)
            |= number
                { int = Just identity
                , hex = Just identity 
                , octal = Just identity
                , binary = Just identity 
                , float = Nothing
                }
            |= mSpaces
        , succeed (\n s -> PInt ([s], defaultId) (negate n))
            |. symbol "-"
            |= int
            |= mSpaces
        ]


pfloat : Parser Pattern
pfloat =
    oneOf
        [ succeed (\n s -> PFloat ([s], defaultId) n)
            |= number
                { int = Nothing
                , hex = Nothing 
                , octal = Nothing
                , binary = Nothing 
                , float = Just identity
                }
            |= mSpaces
        , succeed (\n s -> PFloat ([s], defaultId) (negate n))
            |. symbol "-"
            |= float
            |= mSpaces
        ]


ptrue : Parser Pattern
ptrue =
    succeed (\s -> PTrue ([s], defaultId))
        |. keyword "true"
        |= mSpaces


pfalse : Parser Pattern
pfalse =
    succeed (\s -> PFalse ([s], defaultId))
        |. keyword "false"
        |= mSpaces


pchar : Parser Pattern
pchar =
    succeed (\c s -> PChar ([s], defaultId) c)
        |. symbol "\'"
        |= char_
        |. symbol "\'"
        |= mSpaces


pstring : Parser Pattern
pstring =
    succeed (\s ws -> s
                    |> String.toList
                    |> stringToPattern ([ws], psQuo))
        |. symbol "\""
        |= string_
        |. symbol "\""
        |= mSpaces


stringToPattern : WS -> List Char -> Pattern
stringToPattern ws s =
    case s of
        [] -> 
            PNil ws
        
        c::cs ->
            PCons ws (PChar defaultWS c) (stringToPattern ([],psElm) cs)


pList : Parser Pattern
pList =
    succeed (\s1 p ps s2->
            PCons ([s1, s2], poSquare) p ps)
        |. symbol "["
        |= mSpaces
        |= lazy (\_ -> pterm)
        |= pListloop
        |. symbol "]"
        |= mSpaces


pListloop : Parser Pattern
pListloop =
    loop [] pListHelper |> (map ptermListToPCons)


pListHelper : List (Pattern, WS) -> Parser (Step (List (Pattern, WS)) (List (Pattern, WS)))
pListHelper revPats =
    oneOf
    [ succeed (\s p -> Loop ((p, ([s], poElm)) :: revPats))
        |. symbol ","
        |= mSpaces
        |= lazy (\_ -> pterm)
    , succeed ()
        |> map (\_ -> Done (List.reverse revPats))
    ]


ptermListToPCons : List (Pattern, WS) -> Pattern
ptermListToPCons ls =
    case ls of
        [] ->
            PNil ([], poElm)
        (p, s) :: ps ->
            PCons s p (ptermListToPCons ps)


pbtuple : Parser Pattern
pbtuple =
    succeed (\s1 p1 s2 p2 s3 ->
                PBTuple ([s1, s2, s3], defaultId) p1 p2)
        |. symbol "("
        |= mSpaces
        |= lazy (\_ -> pattern)
        |. symbol ","
        |= mSpaces
        |= lazy (\_ -> pattern)
        |. symbol ")"
        |= mSpaces


pttuple : Parser Pattern
pttuple =
    succeed (\s1 p1 s2 p2 s3 p3 s4 ->
                PTTuple ([s1, s2, s3, s4], defaultId) p1 p2 p3)
        |. symbol "("
        |= mSpaces
        |= lazy (\_ -> pattern)
        |. symbol ","
        |= mSpaces
        |= lazy (\_ -> pattern)
        |. symbol ","
        |= mSpaces
        |= lazy (\_ -> pattern)
        |. symbol ")"
        |= mSpaces


pterm : Parser Pattern
pterm =
    oneOf
    [ pvar
    , backtrackable pnil
    , lazy (\_ -> pList)
    , backtrackable pint
    , backtrackable pfloat
    , ptrue
    , pfalse
    , backtrackable pbtuple
    , pttuple
    , pstring
    , pchar
    ]


pConsOp : OperatorTable Pattern
pConsOp = [[Infix ( succeed (\s -> PCons ([s], poCons))
                        |. symbol "::"
                        |= mSpaces) 
            AssocRight]]


pattern : Parser Pattern
pattern = buildExpressionParser pConsOp (lazy (\_ -> pterm))


parseVal : String -> List Value -> Result (List DeadEnd) Value
parseVal s context =
    run (value context |. end) s


value : List Value -> Parser Value
value context =
    oneOf
    [ backtrackable vInt
    , backtrackable vFloat
    , vTrue
    , vFalse
    , backtrackable vNil
    , lazy (\_ -> (vList context))
    , vHole context
    , backtrackable (vBtuple context)
    , vTtuple context
    , vChar
    , vString
    ]


vBtuple : List Value -> Parser Value
vBtuple context =
    succeed VBTuple
        |. symbol "("
        |. spaces
        |= lazy (\_ -> value context)
        |. symbol ","
        |. spaces
        |= lazy (\_ -> value context)
        |. symbol ")"
        |. spaces


vTtuple : List Value -> Parser Value
vTtuple context =
    succeed VTTuple
        |. symbol "("
        |. spaces
        |= lazy (\_ -> value context)
        |. symbol ","
        |. spaces
        |= lazy (\_ -> value context)
        |. symbol ","
        |. spaces
        |= lazy (\_ -> value context)
        |. symbol ")"
        |. spaces


vList : List Value -> Parser Value
vList context =
    succeed (VCons voId)
        |. symbol "["
        |. spaces
        |= lazy (\_ -> value context)
        |= vListloop context
        |. symbol "]"
        |. spaces


vListloop : List Value -> Parser Value
vListloop context =
    vListHelper context 
    |> loop []
    |> (map valueListToVCons)


vListHelper : List Value -> List Value -> Parser (Step (List Value) (List Value))
vListHelper context revValues =
    oneOf
    [ succeed (\e -> Loop (e :: revValues))
        |. symbol ","
        |. spaces
        |= lazy (\_ -> value context)
    , succeed ()
        |> map (\_ -> Done (List.reverse revValues))
    ]


valueListToVCons : List Value -> Value
valueListToVCons ls =
    case ls of
        [] ->
            VNil voId
        v :: vs ->
            VCons voId v (valueListToVCons vs)


vNil : Parser Value
vNil =
    succeed (VNil voId)
        |. symbol "["
        |. spaces
        |. symbol "]"
        |. spaces


vInt : Parser Value
vInt =
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


vFloat : Parser Value
vFloat =
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


vTrue : Parser Value
vTrue =
    succeed VTrue
        |. keyword "true"
        |. spaces


vFalse : Parser Value
vFalse =
    succeed VFalse
        |. keyword "false"
        |. spaces


vChar : Parser Value
vChar =
    succeed (\c -> VChar  c)
        |. symbol "\'"
        |= char_
        |. symbol "\'"
        |. spaces


vString : Parser Value
vString =
    succeed (\s -> s
                    |> String.toList
                    |> stringToValue)
        |. symbol "\""
        |= string_
        |. symbol "\""
        |. spaces


stringToValue : List Char -> Value
stringToValue s =
    case s of
        [] -> 
            VNil vsId
        
        c::cs ->
            VCons vsId (VChar c) (stringToValue cs)


findContext : List Value -> HoleName -> Value
findContext context hn =
    case context of
        [] -> VHole hn []

        (IndexedHole hn_ venv) :: ct ->
            if hn_ == hn
            then (VHole hn (removeIndexFromVenv venv))
            else findContext ct hn

        _ -> VError "Impossible"


vHole : List Value -> Parser Value
vHole context =
    succeed (findContext context)
        |. symbol "{"
        |. spaces
        |= holename 
        |. spaces
        |. symbol "}"
        |.spaces


parseHoleName : String -> Result (List DeadEnd) HoleName
parseHoleName s =
    run (holename |. end) s


hterm : Parser HoleName
hterm =
    oneOf
    [ backtrackable hinst
    , hinter
    , hid
    ]


hinter : Parser HoleName
hinter =
    succeed HInter
        |. symbol "*"
        |. spaces
        |= int


hid : Parser HoleName
hid =
    succeed HId
        |= int


hinst : Parser HoleName
hinst =
    succeed (\n1 n2 -> HInst (HOri n1) n2)
        |= int
        |. spaces
        |. symbol "_"
        |. spaces
        |= int


hfieldOp : OperatorTable HoleName
hfieldOp = [[Infix (succeed HField
                        |. symbol "·"
                        |. spaces)
            AssocLeft]]


holename : Parser HoleName
holename = buildExpressionParser hfieldOp hterm