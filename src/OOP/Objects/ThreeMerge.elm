module OOP.Objects.ThreeMerge exposing (..)

import List exposing (length)
import OOP.Syntax exposing (..)

mergeState : State -> State -> State -> Result String State
mergeState state1 state2 state =
    if length state1 /= length state || length state2 /= length state then
        Result.Err "Merge State Error : 01."
    else
        case (state1, state2, state) of
            (v1::st1, v2::st2, v::st) ->
                Result.map (\res -> (threeMerge v v1 v2)::res) (mergeState st1 st2 st)

            ([], [], []) ->
                Result.Ok []

            _ ->
                Result.Err "Merge State Error : 02."


mergeEnv : Env -> Env -> Env -> Env
mergeEnv env1 env2 ori_env =

    case (env1, env2, ori_env) of
        ((s1, v1)::env1_, (_, v2)::env2_, (_, v3)::ori_env_) ->
            let
                env_ =
                    mergeEnv env1_ env2_ ori_env_

                v_ =
                    threeMerge v3 v1 v2
            in
                (s1, v_) :: env_
        
        _ ->
            []


threeMerge : Value -> Value -> Value -> Value
threeMerge oV v1 v2 =
    case (oV, v1, v2) of
        (VCons o1 o2, VCons v11 v12, VCons v21 v22) ->
            VCons (threeMerge o1 v11 v21) (threeMerge o2 v12 v22)

        (VTuple2 o1 o2, VTuple2 v11 v12, VTuple2 v21 v22) ->
            VTuple2 (threeMerge o1 v11 v21) (threeMerge o2 v12 v22)

        (VTuple3 o1 o2 o3, VTuple3 v11 v12 v13, VTuple3 v21 v22 v23) ->
            VTuple3 (threeMerge o1 v11 v21) (threeMerge o2 v12 v22)
            <| threeMerge o3 v13 v23

        (VNew oc oarg, VNew c1 arg1, VNew c2 arg2) ->
            let
                arg =
                    threeMerge oarg arg1 arg2
            in
                if c1 /= oc then
                    VNew c1 arg
                else
                    VNew c2 arg

        (VHtml ol o1 o2 o3, VHtml l1 v11 v12 v13, VHtml l2 v21 v22 v23) ->
            let
                label =
                    if l1 /= ol then l1 else l2
            in
                VHtml label (threeMerge o1 v11 v21) (threeMerge o2 v12 v22)
            <| threeMerge o3 v13 v23
        
        _ ->
            if v1 /= oV then
                v1
            else
                v2