module OOP.Parser.Term exposing (..)

import Parser exposing (..)
import Parser.Extras exposing (..)
import Parser.Expression exposing (..)
import OOP.Syntax exposing (..)
import OOP.Parser.Pattern exposing (pattern)
import OOP.Parser.Utils exposing (..)
import OOP.Parser.WhiteSpaces exposing (mspaces)


parse : String -> Result (List DeadEnd) Term
parse =
    run (term |. end)


parseEquation : String -> Result (List DeadEnd) Term
parseEquation =
    run (equation |. end)


-- TInt
int_ : Parser Term
int_ =
    succeed (\n spc -> TInt [spc] n)
    |= number
        { int = Just identity
        , hex = Just identity
        , octal = Just identity
        , binary = Just identity
        , float = Nothing
        }
    |= mspaces


-- TFloat
float_ : Parser Term
float_ =
    succeed (\n spc -> TFloat [spc] n)
    |= number
        { int = Nothing
        , hex = Nothing
        , octal = Nothing
        , binary = Nothing
        , float = Just identity
        }
    |= mspaces


-- TTrue
true : Parser Term
true =
    succeed (\spc -> TTrue [spc])
        |. keyword "true"
        |= mspaces


-- TFalse
false : Parser Term
false =
    succeed (\spc -> TFalse [spc])
        |. keyword "false"
        |= mspaces


-- TChar


char : Parser Term
char =
    succeed (\c spc -> TChar [spc] c)
        |. symbol "\'"
        |= char_
        |. symbol "\'"
        |= mspaces


string : Parser Term
string =
    succeed (\s spc -> TString [spc] s)
        |. symbol "\""
        |= string_
        |. symbol "\""
        |= mspaces


-- TVar


var : Parser Term
var =
    succeed (\vn spc -> TVar [spc] vn)
    |= varName
    |= mspaces


-- TLam
abs : Parser Term
abs =
    succeed (\spc1 p spc2 t -> TLam [spc1, spc2] p t)
        |. symbol "\\"
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol "=>"
        |= mspaces
        |= lazy (\_ -> term)


-- TLet
let_ : Parser Term
let_ =
    succeed (\spc1 p spc2 t1 spc3 t2 -> TLet [spc1, spc2, spc3] p t1 t2)
        |. keyword "let"
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol "="
        |= mspaces
        |= lazy (\_ -> term)
        |. keyword "in"
        |= mspaces
        |= lazy (\_ -> term)


-- TLetrec
letrec : Parser Term
letrec =
    succeed (\spc1 p spc2 t1 spc3 t2 -> TLetrec [spc1, spc2, spc3] p t1 t2)
        |. keyword "letrec"
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol "="
        |= mspaces
        |= lazy (\_ -> term)
        |. keyword "in"
        |= mspaces
        |= lazy (\_ -> term)


-- TCase
caseToApp : Term -> Branch -> WS -> Term
caseToApp t b ws =
    TApp ws (TLam [] (PVar [] guardName) 
            (TCase [] (TVar [] guardName) b)) t


caseOf : Parser Term
caseOf =
    succeed (\spc1 t spc2 b -> caseToApp t b [spc1, spc2])
        |. keyword "case"
        |= mspaces
        |= lazy (\_ -> term)
        |. keyword "of"
        |= mspaces
        |= branch


-- If
iteToApp : Term -> Term -> Term  -> WS -> Term
iteToApp t1 t2 t3 ws =
    TApp ws
        (TLam [] (PVar [] guardName) 
            (TCase [] (TVar [] guardName) 
                ( BCom []
                    (BSin [] (PTrue [])  t2)
                    (BSin [] (PFalse []) t3)
                ))) t1


iteState : Parser Term
iteState =
    succeed (\spc1 t1 spc2 t2 spc3 t3 -> iteToApp t1 t2 t3 [spc1, spc2, spc3])
        |. keyword "if"
        |= mspaces
        |= lazy (\_ -> term)
        |. keyword "then"
        |= mspaces
        |= lazy (\_ -> term)
        |. keyword "else"
        |= mspaces
        |= lazy (\_ -> term)


-- TEmpList
empList : Parser Term
empList =
    succeed (\spc1 spc2 -> TEmpList [spc1, spc2])
        |. symbol "["
        |= mspaces
        |. symbol "]"
        |= mspaces


-- TNil
nil : Parser Term
nil =
    succeed (\spc -> TNil [spc])
        |. symbol "nil"
        |= mspaces


-- TCons
list : Parser Term
list =
    succeed (\spc1 t1 t2 spc2 -> TList [spc1, spc2] t1 t2)
        |. symbol "["
        |= mspaces
        |= lazy (\_ -> term)
        |= listloop
        |. symbol "]"
        |= mspaces


listloop : Parser Term
listloop =
    loop [] listHelper |> (map exprListToTList)


listHelper : List (Term, WS) -> Parser (Step (List (Term, WS)) (List (Term, WS)))
listHelper  revTerms =
    oneOf
    [ succeed (\spc t -> Loop ((t, [spc]) :: revTerms))
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> term)
    , succeed ()
        |> map (\_ -> Done (List.reverse revTerms))
    ]


exprListToTList : List (Term, WS) -> Term
exprListToTList ls =
    case ls of
        [] ->
            TEmpList []
        (t, ws) :: ts ->
            TList ws t (exprListToTList ts)


cons : Parser (Term -> Term -> Term)
cons =
    succeed (\spc -> TCons [spc])
        |. symbol "::"
        |= mspaces


-- TTuple2
btuple : Parser Term
btuple =
    succeed (\spc1 t1 spc2 t2 spc3 -> TTuple2 [spc1, spc2, spc3] t1 t2)
        |. symbol "("
        |= mspaces
        |= lazy (\_ -> term)
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> term)
        |. symbol ")"
        |= mspaces


-- TTuple3
ttuple : Parser Term
ttuple =
    succeed (\spc1 t1 spc2 t2 spc3 t3 spc4 -> TTuple3 [spc1, spc2, spc3, spc4] t1 t2 t3 )
        |. symbol "("
        |= mspaces
        |= lazy (\_ -> term)
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> term)
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> term)
        |. symbol ")"
        |= mspaces


parens_ : Parser Term
parens_ =
    succeed (\spc1 t spc2 -> TParens [spc1, spc2] t)
        |. symbol "("
        |= mspaces
        |= lazy (\_ -> term)
        |. symbol ")"
        |= mspaces


-- TRef
ref : Parser Term
ref =
    succeed (\spc t -> TRef [spc] t)
        |. keyword "ref"
        |= mspaces
        |= lazy (\_ -> term)


-- TDeRef
deref : Parser Term
deref =
    succeed (\spc t -> TDeRef [spc] t)
        |. symbol "!"
        |= mspaces
        |= lazy (\_ -> term)


-- TAssign
assign : Parser (Term -> Term -> Term)
assign =
    succeed (\spc -> TAssign [spc])
    |. symbol ":="
    |= mspaces


-- TUnit
unit : Parser Term
unit =
    succeed (\spc -> TUnit [spc])
    |. keyword "unit"
    |= mspaces


-- TField
field : Parser (Term -> Term -> Term)
field = succeed (TField [])
        |. symbol "."


-- TInvk
invk : Parser (Term -> Term -> Term)
invk =
    succeed (TInvk [])
    |. symbol "->"


-- TNew
new : Parser Term
new =
    succeed (\spc1 cl spc2 t spc3 -> TNew [spc1, spc2, spc3] cl t)
    |. keyword "new"
    |= mspaces
    |= varName
    |. symbol "("
    |= mspaces
    |= lazy (\_ -> term)
    |. symbol ")"
    |= mspaces


-- THtml
html : Parser Term
html =
    succeed (\n s1 t1 s2 t2 s3 t3 ->
            THtml [s1, s2, s3] n t1 t2 t3)
    |. symbol "Html."
    |= varName
    |= mspaces
    |= lazy (\_ -> aexpr)
    |= mspaces
    |= lazy (\_ -> aexpr)
    |= mspaces
    |= lazy (\_ -> aexpr)


-- TToStr
tostr : Parser Term
tostr =
    succeed (\s t -> TToStr [s] t)
        |. keyword "toString"
        |= mspaces
        |= lazy (\_ -> term)


-- TMap
tmap : Parser Term
tmap =
    succeed (\s1 d s2 f s3 ls -> TMap [s1, s2, s3] d f ls)
        |. keyword "map_"
        |= mspaces
        |= lazy (\_ -> aexpr)
        |= mspaces
        |= lazy (\_ -> aexpr)
        |= mspaces
        |= lazy (\_ -> aexpr)


-- TLoc
tloc : Parser Term
tloc =
    succeed (\n s -> TLoc [s] n)
        |. symbol "<"
        |= number
            { int = Just identity
            , hex = Nothing
            , octal = Nothing
            , binary = Nothing
            , float = Nothing
            }
        |. symbol ">"
        |= mspaces


-- No Applications & Operations
aexpr : Parser Term
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
    , backtrackable var
    , lazy (\_ -> abs)
    , lazy (\_ -> let_)
    , lazy (\_ -> letrec)
    , caseOf
    , backtrackable nil
    , backtrackable list
    , char
    , string
    , ref
    , deref
    , unit
    , new
    , html
    , tostr
    , tmap
    , backtrackable tloc
    , backtrackable empList
    ]


-- Application
flip : (a -> b -> c) -> b -> a -> c
flip f x y = f y x


term_app : Parser Term
term_app =
    let
        foldl1 f (x, xs) =
            List.foldl (flip f) x xs
    in
        succeed (foldl1 (TApp []))
            |=  some (lazy <| \_ -> aexpr)


-- Operations
bopParser : String -> Bop -> Parser (Term -> Term -> Term)
bopParser s op =
    succeed (\spc -> TBPrim [spc] op)
        |. symbol s
        |= mspaces


uopParser : String -> Uop -> Parser (Term -> Term)
uopParser s op =
    succeed (\spc -> TUPrim [spc] op)
        |. symbol s
        |= mspaces


seq : Parser (Term -> Term -> Term)
seq =
    succeed (\spc -> TSeq [spc])
    |. symbol ";"
    |= mspaces


operators : OperatorTable Term
operators =
    [ [Prefix (uopParser "-" Neg)]
    , [Prefix (uopParser "~" Not)]

    , [Infix cons AssocRight]
    , [Infix field AssocLeft]
    , [Infix invk AssocLeft]
    , [Infix (bopParser "*" Mul) AssocLeft, Infix (bopParser "//" RDiv) AssocLeft]
    , [Infix (backtrackable (bopParser "+" Add)) AssocLeft, Infix (bopParser "-" Sub) AssocLeft]
    , [Infix (backtrackable (bopParser "/" Div)) AssocLeft]
    , [Infix (bopParser "++" Cat) AssocLeft]
    , [Infix (backtrackable (bopParser "<" Lt)) AssocNone
    , Infix (backtrackable (bopParser ">" Gt)) AssocNone]
    , [Infix (bopParser "<=" Le) AssocNone
    , Infix (bopParser ">=" Ge) AssocNone]

    , [Infix (bopParser "==" Eq) AssocNone]
    , [Infix (bopParser "&&" And) AssocLeft]
    , [Infix (bopParser "||" Or) AssocLeft]

    , [Infix assign AssocRight]
    , [Infix (backtrackable seq) AssocRight]
    ]


-- Term
term : Parser Term
term =
    buildExpressionParser operators (lazy <| \_ -> term_app)


-- Branch
sinBranch : Parser Branch
sinBranch = 
    succeed (\p spc t -> BSin [spc] p t)
        |= lazy (\_ -> pattern)
        |. symbol "=>"
        |= mspaces
        |= lazy (\_ -> term)


branchOp : OperatorTable Branch
branchOp = [[Infix ( succeed (\spc -> BCom [spc])
                        |. symbol "|"
                        |= mspaces
                    ) 
            AssocRight]]


branch : Parser Branch
branch = buildExpressionParser branchOp sinBranch


equation : Parser Term
equation = 
    succeed (\p params spc1 t1 spc2 t2 -> TLet [spc1, spc2] p (getFuncDef params t1) t2)
        |= pattern
        |= paramLoop
        |. symbol "="
        |= mspaces
        |= lazy (\_ -> term)
        |. symbol ";;"
        |= mspaces
        |= equationLoop


getFuncDef : List Pattern -> Term -> Term
getFuncDef params t =
    case params of
        [] -> t
        p :: ps -> 
            TLam [] p (getFuncDef ps t)


paramLoop : Parser (List Pattern)
paramLoop =
    loop [] paramHelper


paramHelper : List Pattern -> Parser (Step (List Pattern) (List Pattern))
paramHelper revTerms =
    oneOf
    [ succeed (\p -> Loop (p :: revTerms))
        |= pattern
    , succeed ()
        |> map (\_ -> Done (List.reverse revTerms))
    ]


equationLoop : Parser Term
equationLoop = 
    loop [] equationHelper |> (map exprListToTLet)


equationHelper : List (Pattern, Term, WS) -> Parser (Step (List (Pattern, Term, WS)) (List (Pattern, Term, WS)))
equationHelper revTerms = 
    oneOf
    [ succeed (\p params spc1 t spc2 -> Loop ((p, (getFuncDef params t), [spc1, spc2]) :: revTerms))
        |= pattern
        |= paramLoop
        |. symbol "="
        |= mspaces
        |= lazy (\_ -> term)
        |. symbol ";;"
        |= mspaces
    , succeed ()
        |> map (\_ -> Done (List.reverse revTerms))
    ]


exprListToTLet : List (Pattern, Term, WS) -> Term
exprListToTLet ls =
    case ls of
        [] -> TVar [] "main"
        (p, t, ws) :: ts ->
            TLet ws p t (exprListToTLet ts)