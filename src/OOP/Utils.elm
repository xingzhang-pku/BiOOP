module OOP.Utils exposing (..)

import OOP.Syntax exposing (..)


exist : a -> List a -> Bool
exist a ls =
    case ls of
        x :: xs ->
            if a == x then
                True
            else
                exist a xs

        [] ->
            False


findByName : String -> List (String, a) -> Maybe a
findByName s ls =
    case ls of
        [] -> Nothing

        (s1, v1) :: ls_ ->
            if s1 == s then
                Just v1
            else
                findByName s ls_


updateValueInDict : String -> a -> List (String, a) -> List (String, a)
updateValueInDict s v dict =
    case dict of
        [] -> []

        (s1, v1) :: dict_->
            if s1 == s then
                (s1, v) :: dict_
            else
                (s1, v1) :: (updateValueInDict s v dict_)

    
replace : Int -> a -> List a -> List a
replace n v ls =
    case ls of
        [] -> []

        x::xs ->
            if n==0 then
                v::xs
            else
                x::(replace (n - 1) v xs)


delete : Int -> List a -> List a
delete n ls =
    case ls of
        v :: res ->
            if n == 0  then
                res
            else
                v :: (delete (n - 1) res)

        [] ->
            []