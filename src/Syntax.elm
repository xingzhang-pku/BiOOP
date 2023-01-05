module Syntax exposing (..)

type alias Info = String

type alias WS =
    (List String, Int)

defaultWS : WS
defaultWS = ([], 0)
defaultId : number
defaultId = 0

-- VCons: 
vsId : number
vsId = 1    -- String
voId : number
voId = 0    -- Other

-- ECons:
-- ENil like elm
eoSquare : number
eoSquare = 0
eoElm : number
eoElm = 1
eoCons : number
eoCons = 2
esQuo : number
esQuo = 3
esElm : number
esElm = 4

-- Single ENil
eoAddFromEmp : number
eoAddFromEmp = 5

-- Single PNil
poNil : number
poNil = 6

-- PCons
poSquare : number
poSquare = 0
poElm : number
poElm = 1
poCons : number
poCons = 2
psQuo : number
psQuo = 3
psElm : number
psElm = 4

-- Case & If
caseN : String
caseN = "$CASE$"
caseId : number
caseId = 1
ifId : number
ifId = 2

type Expr
    = EParens WS Expr
    | EVar WS String
    | ELam WS Pattern Expr
    | ELet WS Pattern Expr Expr
    | ELetrec WS Pattern Expr Expr
    | EApp WS Expr Expr
    | EInt WS Int
    | EFloat WS Float
    | ETrue WS
    | EFalse WS
    | EChar WS Char
    | ECons WS Expr Expr
    | ENil WS
    | EHole WS HoleName
    | EBPrim WS Bop Expr Expr
    | EUPrim WS Uop Expr
    | ECase WS Expr Branch
    | EFix WS Expr
    | EBTuple WS Expr Expr
    | ETTuple WS Expr Expr Expr
    | EHtml WS String Expr Expr Expr
    | EToStr WS Expr
    | EError Info

type Bop = Add | Sub | Mul | Div | Eq | Lt | Gt | Le | Ge | And | Or | Cat | DDiv
type Uop = Not | Neg

type Branch
    = BSin WS Pattern Expr
    | BNSin WS Int Pattern Expr
    | BCom WS Branch Branch

type Value
    = VInt Int
    | VFloat Float
    | VTrue
    | VFalse
    | VChar Char
    | VCons Int Value Value
    | VNil Int
    | VHole HoleName VEnv
    | IndexedHole HoleName (List (Int, String, Value))
    | VFix Expr
    | VClosure Pattern Expr VEnv
    | VBTuple Value Value
    | VTTuple Value Value Value 
    | VHtml String Value Value Value
    | VError Info

type HoleName
    = HOri Int
    | HInter Int
    | HField HoleName HoleName
    | HId Int
    | HInst HoleName Int

type alias VEnv = List (String, Value)

type alias IndexedVEnv = List (Int, String, Value)

type alias HEnv = List (HoleName, VEnv, Value)

type Pattern
    = PVar WS String
    | PCons WS Pattern Pattern
    | PNil WS
    | PInt WS Int
    | PFloat WS Float
    | PTrue WS
    | PFalse WS
    | PChar WS Char
    | PBTuple WS Pattern Pattern
    | PTTuple WS Pattern Pattern Pattern

type alias HTotal = Int

type alias UnEvalRes = 
    { henv : HEnv
    , venv : VEnv
    , expr : Expr
    , htotal : Int
    }

type alias TryUnevalRes =
    { ei     : Expr
    , venv   : VEnv
    , henv   : HEnv
    , htotal : HTotal
    , choice : Int
    , pi     : Pattern
    }

type alias MatchCaseRes =
    { venvm : VEnv
    , choice: Int
    , ei : Expr
    , pi : Pattern
    }

-- HOri ID start from 1
-- HOri 0 represent total number of temp Holes
tempHoleCount : HoleName
tempHoleCount = HInter 0
holeIDStart : Int
holeIDStart = 1
holeAddedByUserStart : Int
holeAddedByUserStart = 100