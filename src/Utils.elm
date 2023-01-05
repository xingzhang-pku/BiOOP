module Utils exposing (..)

import List exposing (..)
import Maybe

findIndex : String -> List (Int, String) -> Int
findIndex s env =
    case env of

        (n, x) :: env_ ->
            if s == x then n else findIndex s env_

        [] -> -1


nth : Int -> List a -> Maybe a
nth n ls =
    case n of
        0 -> head ls
        _ -> 
            case (tail ls) of
                Just ls_ -> nth (n - 1) ls_
                _ -> Nothing


replace : Int -> a -> List a -> Maybe (List a)
replace n v l =
    case l of
        e::es -> 
            if n == 0
            then 
                Just (v::es)
            else
                Maybe.map (\res -> e::res) (replace (n - 1) v es)
        [] ->
            Nothing