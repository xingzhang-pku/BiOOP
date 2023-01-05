module OOP.Subclassing exposing (..)

import String exposing (..)
import Char exposing (isDigit)
import OOP.Syntax exposing (..)

-- Not Consider Closures
threeMerge : Value -> Value -> Value -> ClassTable -> (Value, ClassTable)
threeMerge oV v1 v2 ct =
    case (oV, v1, v2) of

        (VCons o1 o2, VCons v11 v12, VCons v21 v22) ->
            let
                (v1_, ct1) =
                    threeMerge o1 v11 v21 ct
                
                (v2_, ct2) =
                    threeMerge o2 v12 v22 ct1
            in
                (VCons v1_ v2_, ct2)

        (VTuple2 o1 o2, VTuple2 v11 v12, VTuple2 v21 v22) ->
            let
                (v1_, ct1) =
                    threeMerge o1 v11 v21 ct
                
                (v2_, ct2) =
                    threeMerge o2 v12 v22 ct1
            in
                (VTuple2 v1_ v2_, ct2)

        (VTuple3 o1 o2 o3, VTuple3 v11 v12 v13, VTuple3 v21 v22 v23) ->
            let
                (v1_, ct1) =
                    threeMerge o1 v11 v21 ct
                
                (v2_, ct2) =
                    threeMerge o2 v12 v22 ct1
                
                (v3_, ct3) =
                    threeMerge o3 v13 v23 ct2
            in
                (VTuple3 v1_ v2_ v3_, ct3) 

        (VNew oc oarg, VNew c1 arg1, VNew c2 arg2) ->
            let
                (arg, ct1) =
                    threeMerge oarg arg1 arg2 ct
            in
                if c1 /= oc then
                    if isNewSubCls c1 && isNewSubCls c2 then
                        (VNew c1 arg, mergeNewSubCls ct1 c1 c2)
                    else 
                        (VNew c1 arg, ct1)
                else
                    (VNew c2 arg, ct1)

        (VHtml ol o1 o2 o3, VHtml l1 v11 v12 v13, VHtml l2 v21 v22 v23) ->
            let
                label =
                    if l1 /= ol then l1 else l2

                (v1_, ct1) =
                    threeMerge o1 v11 v21 ct
                
                (v2_, ct2) =
                    threeMerge o2 v12 v22 ct1

                (v3_, ct3) =
                    threeMerge o3 v13 v23 ct2
            in
                (VHtml label v1_ v2_ v3_, ct3)
        
        _ ->
            if v1 /= oV then
                (v1, ct)
            else
                (v2, ct)


isNewSubCls : String -> Bool
isNewSubCls c =
    case uncons <| right 1 c of
        Just (char, _) ->
            if isDigit char then
                True
            else
                False
        Nothing ->
            False


mergeNewSubCls : ClassTable -> String -> String -> ClassTable
mergeNewSubCls (ws, ct) c1 c2 =
    (ws, addMSAndDelCls c1 c2 ct (findMethods c2 ct) False False)


findMethods : String -> List ClassDef -> List Method
findMethods c ct =
    case ct of
        (_, ((c1, _), _, (_, ms))) :: ct_ ->
            if c == c1 then
                ms
            else
                findMethods c ct_
            
        [] ->
            []


addMSAndDelCls : String -> String -> List ClassDef -> List Method -> 
                Bool -> Bool -> List ClassDef
addMSAndDelCls c1 c2 ct ms f1 f2  =
    case ct of
        (ws_cls, ((c3, f), fs, (ws_ms, ms3))) :: ct_ ->
            if c1 == c3 then
                if f2 then
                    (ws_cls, ((c1, f), fs, (ws_ms, ms3 ++ ms))) :: ct_
                else
                    (ws_cls, ((c1, f), fs, (ws_ms, ms3 ++ ms))) :: 
                    (addMSAndDelCls c1 c2 ct_ ms True False)
            else if c2 == c3 then
                if f1 then
                    ct_
                else
                    addMSAndDelCls c1 c2 ct_ ms False True
            else
                (ws_cls, ((c3, f), fs, (ws_ms, ms3))) :: (addMSAndDelCls c1 c2 ct_ ms f1 f2)
        
        [] ->
            []