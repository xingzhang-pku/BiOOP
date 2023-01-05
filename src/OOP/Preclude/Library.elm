module OOP.Preclude.Library exposing (..)

import Debug exposing (toString)
import OOP.Syntax exposing (Term(..))
import OOP.Parser.Term exposing (parseEquation)
import OOP.Syntax exposing (Pattern(..))

library : String
library = """abs x =
    if x < 0 then -x else x 
;;
drop = 
    letrec drop_ =
        \\err =>
            \\n =>
                \\ls =>
                    case n of
                        0 => ls
                        |x => case ls of
                            [] => err
                            | y::ys => drop_ err (x-1) ys 
    in 
        drop_
;;
filter =
    letrec filter_ =
        \\f =>
            \\ls =>
                case ls of
                    [] => []
                    | x::xs =>
                        if f x then
                            x :: (filter_ f xs)
                        else
                            filter_ f xs
    in 
        filter_
;;
flip f x y=
    f y x
;;
foldl =
    letrec foldl_ =
        \\f =>
            \\start =>
                \\ls =>
                    case ls of
                        [] => start
                        | x :: xs =>
                            foldl_ f (f start x) xs
    in 
        foldl_
;;
foldr =
    letrec foldr_ =
        \\f =>
            \\start =>
                \\ls =>
                    case ls of
                        [] => start
                        | x :: xs =>
                            f x (foldr_ f start xs)
    in 
        foldr_
;;
fst (a, b) =
    a
;;
head err ls =
    case ls of
        [] => err
        | x::xs => x
;;
identity x =
    x
;;
indexedMap_ =
    letrec indexedMap__ =
        \\iter =>
            \\f =>
                \\ls =>
                    case ls of
                        [] => []
                        | x::xs =>
                            (f iter x)::(indexedMap__ (iter+1) f xs)
    in 
        indexedMap__
;;
indexedMap = 
    indexedMap_ 0
;;
length =
    letrec length_ =
        \\ls =>
            case ls of
                [] => 0
                | x::xs => 1 + (length_ xs)
    in
        length_
;;
map =
    letrec map__ =
        \\f =>
            \\ls =>
                case ls of
                    [] => []
                    | x :: xs => (f x) :: (map__ f xs)
    in
        map__
;;
max x y =
    if x >= y then x else y
;;
min x y =
    if x < y then x else y
;;
mod a b =
    a - (a // b) * b
;;
nth = 
    letrec nth_ =
        \\n =>
            \\ls =>
                case n of
                    0 => (case ls of
                            [] => "Err 01"
                            | x::xs => x)
                    | a =>
                        case ls of
                        [] => "Err 02"
                        | x::xs => nth_ (n-1) xs
    in
        nth_
;;
partition =
    letrec partition_ =
        \\p =>
            \\ls =>
                case ls of
                    [] => ([], [])
                    | x :: xs =>
                        let 
                            (trueSet, falseSet) =
                                partition_ p xs
                        in
                        if p x then
                            (x :: trueSet, falseSet)
                        else
                            (trueSet, x :: falseSet)
    in
        partition_
;;
range =
    letrec range_ =
        \\i =>
            \\j =>
                if i < j then
                    i :: (range_ (i + 1) j)
                else
                    []
    in
        range_
;;
repeat =
    letrec repeat_ =
        \\n =>
            \\x =>
                case n of
                    0 => []
                    | n1 => x :: (repeat_ (n1-1) x)
    in
        repeat_
;;
reverse =
    letrec reverse_ =
        \\ls =>
            case ls of
                [] => []
                | x :: xs => (reverse_ xs)++[x]
    in
        reverse_
;;
singleton x =
    [x]
;;
snd (a, b) =
    b
;;
tail err ls =
    case ls of
        [] => err
        | x::xs => xs
;;
take = 
    letrec take_ =
        \\err =>
            \\n =>
                \\ls =>
                    case n of
                        0 => []
                        |x => case ls of
                            [] => err
                            | y::ys => y::(take_ err (x-1) ys)
    in
        take_
;;
unzip = 
    letrec unzip_ =
        \\ls =>
            case ls of
                [] => ([], [])
                |(a, b)::xs =>
                    let (l1, l2) = unzip_ xs in
                        (a::l1, b::l2)
    in
        unzip_
;;
zip =
    letrec zip_ =
        \\l1 =>
            \\l2 =>
                case (l1, l2) of
                    (x1::xs1, x2::xs2) => (x1, x2) :: (zip_ xs1 xs2)
                    |(x1::xs1, []) => []
                    |([], x2::xs2) => []
                    |([], []) => []
    in
        zip_
;;
zipWith =
    letrec zipWith_ =
        \\f =>
            \\l1 =>
                \\l2 =>
                    case (l1, l2) of
                        (x1::xs1, x2::xs2) => (f x1 x2) :: (zipWith f xs1 xs2)
                        |(x1::xs1, []) => []
                        |([], x2::xs2) => []
                        |([], []) => []
    in
        zipWith_
;;"""


parsedLibrary : Term
parsedLibrary =
    case parseEquation library of
        Result.Ok pre -> 
            pre

        Result.Err info ->
            TError (toString info)


assemble : Term -> Term -> Term
assemble pre term =
    case pre of
        TLet ws p t1 t2 ->
            case t2 of
                TUnit _ -> 
                    TLet ws p t1 term
                
                TVar _ _ -> 
                    TLet ws p t1 term
                
                _ -> 
                    TLet ws p t1 (assemble t2 term)
        
        TLetrec ws p t1 t2 ->
            case t2 of
                TUnit _ -> 
                    TLetrec ws p t1 term
                
                _ -> 
                    TLetrec ws p t1 (assemble t2 term)

        TError info ->
            TError info
        
        _ ->
            TError "Preclude Error."