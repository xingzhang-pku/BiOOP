module OOP.Objects.Update exposing (..)

import Utils exposing (nth)
import OOP.Utils exposing (replace)
import OOP.LangUtils exposing (..)
import Html.Attributes exposing (id)
import OOP.Objects.Templates exposing (..)
import OOP.Syntax exposing (Value(..), ClassTable, WS, State)

modifyClass : Value -> ObjectID -> ObjectID -> Class -> ClassTable -> State -> ((Bool, Value, ObjectID), State)
modifyClass objects iter id class classtb state =
    case objects of
        VNew c args ->
            if iter == id
            then
                let
                    args_ =
                        modifyArgs args class classtb
                in
                    ((True, VNew class args_, -1), state)
            else
                let
                    ((flag, v, iter_), state_) =
                        modifyClass args (iter + 1) id class classtb state
                in
                    ((flag, VNew c v, iter_), state_)

        VCons v1 v2 ->
            let
                ((flag1, v1_, iter1), state1) =
                    modifyClass v1 iter id class classtb state
            in
                if flag1 == True then
                    ((True, VCons v1_ v2, -1), state1)
                else
                    let
                        ((flag2, v2_, iter2), state2) =
                            modifyClass v2 iter1 id class classtb state1
                    in
                        if flag2 == True then
                            ((True, VCons v1 v2_, -1), state2)
                        else
                            ((False, VCons v1 v2, iter2), state2)

        VLoc n ->
            let
                res =
                    nth n state
            in
                case res of
                    Just val ->
                        let
                            ((flag, val_, iter_), state_) =
                                modifyClass val iter id class classtb state
                        in
                            if flag == True then
                                ((True, VLoc n, -1), replace n val_ state_)
                            else
                                ((False, VLoc n, iter_), state_)

                    Nothing ->
                        ((False, VError "No Such Variable : 06.", iter), state)
        
        VNil ->
            ((False, VNil, iter), state)

        VString s ->
            ((False, VString s, iter), state)
        
        _ ->
            ((False, VError "Not Within the Scope of Operation of Modifying class.", -1), state)


modifyArgs : Value -> Class -> ClassTable -> Value
modifyArgs args class classtb=
    let
        ori_len =
            vlength args

        new_fields =
            getFields class classtb

        new_len =
            List.length new_fields
    in
        if ori_len == new_len then
            args
        else if ori_len < new_len then
            let
                rest_fields =
                    List.drop ori_len new_fields
            in
                appendValueList args (iterFieldsRetDefault rest_fields)

        else
            vtake args new_len


deleteObject : Value -> ObjectID -> ObjectID -> State -> ((Bool, Value, ObjectID), State)
deleteObject objects iter id state =
    case objects of
        VNew c args ->
            let
                ((flag, args_, iter_), state_) =
                    deleteObject args (iter + 1) id state
            in
                ((flag, VNew c args_, iter_), state_)

        VCons v1 v2 ->
            case v1 of
                VNew _ _ ->
                    if iter == id then
                        ((True, v2, -1), state)
                    else
                        twoDeleteBranchMerge v1 v2 iter id state

                _ ->
                    twoDeleteBranchMerge v1 v2 iter id state

        VLoc n ->
            let
                res =
                    nth n state
            in
                case res of
                    Just val ->
                        let
                            ((flag, val_, iter_), state_) =
                                deleteObject val iter id state
                        in
                            if flag == True then
                                ((True, VLoc n, -1), replace n val_ state_)
                            else
                                ((False, VLoc n, iter_), state_)

                    Nothing ->
                        ((False, VError "No Such Variable : 07.", iter), state)

        VNil ->
            ((False, VNil, iter), state)

        VString s ->
            ((False, VString s, iter), state)
        
        _ ->
            ((False, VError "Not Within the Scope of Operation of Deleting Object.", -1), state)


twoDeleteBranchMerge : Value -> Value -> ObjectID -> ObjectID -> State -> ((Bool, Value, ObjectID), State)
twoDeleteBranchMerge v1 v2 iter id state =
    let
        ((flag1, v1_, iter1), state1) =
            deleteObject v1 iter id state
    in
        if flag1 == True then
            ((True, VCons v1_ v2, -1), state1)
        else
            let
                ((flag2, v2_, iter2), state2)=
                    deleteObject v2 iter1 id state1
            in
                if flag2 == True then
                    ((True, VCons v1 v2_, -1), state2)
                else
                    ((False, VCons v1 v2, iter2), state2)


addObjectAfterObject : Value -> ObjectID -> ObjectID -> State -> ((Bool, Value, ObjectID), State)
addObjectAfterObject objects iter id state =
    case objects of
        VNew c args ->
            let
                ((flag, args_, iter_), state_) =
                    addObjectAfterObject args (iter + 1) id state
            in
                ((flag, VNew c args_, iter_), state_)

        VCons v1 v2 ->
            case v1 of
                VNew _ _ ->
                    if iter == id then
                        ((True, VCons v1 (VCons v1 v2), -1), state)
                    else
                        twoAddingBranchMerge v1 v2 iter id state

                _ ->
                    twoAddingBranchMerge v1 v2 iter id state

        VLoc n ->
            let
                res =
                    nth n state
            in
                case res of
                    Just val ->
                        let
                            ((flag, val_, iter_), state_) =
                                addObjectAfterObject val iter id state
                        in
                            if flag == True then
                                ((True, VLoc n, -1), replace n val_ state_)
                            else
                                ((False, VLoc n, iter_), state_)

                    Nothing ->
                        ((False, VError "No Such Variable : 08.", iter), state)

        VNil ->
            ((False, VNil, iter), state)

        VString s ->
            ((False, VString s, iter), state)
        
        _ ->
            ((False, VError "Not Within the Scope of Operation of Adding Object : 01.", -1), state)


twoAddingBranchMerge : Value -> Value -> ObjectID -> ObjectID -> State -> ((Bool, Value, ObjectID), State)
twoAddingBranchMerge v1 v2 iter id state =
    let
        ((flag1, v1_, iter1), state1) =
            addObjectAfterObject v1 iter id state
    in
        if flag1 == True then
            ((True, VCons v1_ v2, -1), state1)
        else
            let
                ((flag2, v2_, iter2), state2) =
                    addObjectAfterObject v2 iter1 id state1
            in
                if flag2 == True then
                    ((True, VCons v1 v2_, -1), state2)
                else
                    ((False, VCons v1 v2, iter2), state2)


addObjectAtBegin : Value -> ObjectID -> ObjectID -> FieldID -> ClassTable -> State -> ((Bool, Value, ObjectID), State)
addObjectAtBegin objects iter oid fid classtb state =
    case objects of
        VNew c args ->
            if iter == oid
            then
                let
                    fields =
                        getFields c classtb

                    class =
                        findTypeInFields 0 fid fields
                in
                    case class of
                        "Error" ->
                            ((False, VError "The field to be added is not a list type.", -1), state)

                        _ ->
                            let
                                (args_, state_) =
                                    addObjectInArgs args 0 fid class classtb state
                            in
                                ((True, VNew c args_, -1), state_)
            else
                let
                    ((flag, args_, iter_), state_) =
                        addObjectAtBegin args (iter + 1) oid fid classtb state
                in
                    ((flag, VNew c args_, iter_), state_)


        VCons v1 v2 ->
            let
                ((flag1, v1_, iter1), state1) =
                    addObjectAtBegin v1 iter oid fid classtb state
            in
                if flag1 == True then
                    ((True, VCons v1_ v2, -1), state1)
                else
                    let
                        ((flag2, v2_, iter2), state2) =
                            addObjectAtBegin v2 iter1 oid fid classtb state1
                    in
                        if flag2 == True then
                            ((True, VCons v1 v2_, -1), state2)
                        else
                            ((False, VCons v1 v2, iter2), state2)
        
        VLoc n ->
            let
                res =
                    nth n state
            in
                case res of
                    Just val ->
                        let
                            ((flag, val_, iter_), state_) =
                                addObjectAtBegin val iter oid fid classtb state
                        in
                            if flag == True then
                                ((True, VLoc n, -1), replace n val_ state_)
                            else
                                ((False, VLoc n, iter_), state_)

                    Nothing ->
                        ((False, VError "No Such Variable : 08.", iter), state)
        

        VNil ->
            ((False, VNil, iter), state)

        VString s ->
            ((False, VString s, iter), state)
        
        _ ->
            ((False, VError "Not Within the Scope of Operation of Adding Object : 02.", -1), state)


addObjectInArgs : Value -> FieldID -> FieldID -> Class -> ClassTable -> State -> (Value, State)
addObjectInArgs args iter fid class classtb state =
    case args of
        VCons v1 v2 ->
            if iter == fid
            then
                case v1 of
                    VCons _ _ ->
                        (VCons (VCons (defaultObject class classtb) v1) v2, state)

                    VNil ->
                        (VCons (VCons (defaultObject class classtb) v1) v2, state)

                    VLoc n ->
                        let
                            res =
                                nth n state
                        in
                            case res of
                                Just val ->
                                    (VCons v1 v2, replace n (VCons (defaultObject class classtb) val) state)

                                Nothing ->
                                    (VError "No Such Variable : 09.", state)

                    _ ->
                        (VError "Objects cannot be added to non-list arguments.", state)
            else
                let
                    (v2_, state_) =
                        addObjectInArgs v2 (iter + 1) fid class classtb state
                in
                (VCons v1 v2_, state_)

        VNil ->
            (VNil, state)

        _ ->
            (VError "Args is Not a List : 03.", state)


defaultObject : Class -> ClassTable -> Value
defaultObject class classtb =
    let
        fields =
            getFields class classtb
    in
        VNew class (iterFieldsRetDefault fields)
        

iterFieldsRetDefault : List (WS, String, String) -> Value
iterFieldsRetDefault fields =
    case fields of
        (_, _, typ) :: rest ->
            let
                v =
                    case typ of
                        "String" ->
                            VString "Unknown"
                        
                        "Int" ->
                            VInt 0

                        "Float" ->
                            VFloat 0
                        
                        "Bool" ->
                            VTrue

                        _ ->
                            if String.slice 0 4 typ == "List" then
                                VNil
                            -- It is unreasonable to temporarily think that the default value of the reference is VLoc 0,
                            -- but it is hoped that the user will not have such a class modification.
                            else if String.slice 0 3 typ == "Ref" then
                                VLoc 0
                            else
                                VError "Wrong Field Type, No Default Value."
            in
                VCons v (iterFieldsRetDefault rest)

        [] ->
            VNil


findTypeInFields : FieldID -> FieldID -> List (WS, String, String) -> String
findTypeInFields iter id fields =
    case fields of
        (_, _, typ) :: rest ->
            if iter == id
            then
                case String.split "<" typ of
                    "List" :: typ_ :: [] ->
                        String.slice 0 ((String.length typ_) - 1) typ_
                    
                    "Ref" :: "List" :: typ_ :: [] ->
                        String.slice 0 ((String.length typ_) - 2) typ_
                    
                    _ ->
                        "Error"
            else
                findTypeInFields (iter + 1) id rest

        [] ->
            "Error"


findAncestorClasses : Class -> ClassTable -> Maybe (List Class)
findAncestorClasses class classtb =
    let
        res =
            findClass class classtb
    in
        Maybe.andThen (\(_, ((_, father), _, _)) ->
            if father == "Object"
            then
                Just [father]
            else
                Maybe.map (\ls -> father :: ls) (findAncestorClasses father classtb)
        ) res


findDescendantClasses : Class -> ClassTable -> List Class
findDescendantClasses class classtb =
    let
        res =
            findSonClass class classtb
    in
        if res == [] then
            []
        else
            iterClassList res classtb


iterClassList : List Class -> ClassTable -> List Class
iterClassList classList classtb =
    case classList of
        son :: rest ->
            let
                res1 =
                    findDescendantClasses son classtb

                res2 =
                    iterClassList rest classtb
            in
                (son :: res1) ++ res2

        [] ->
            []


findSonClass : Class -> ClassTable -> List Class
findSonClass class classtb =
    let
        (_, classtb_)=
            classtb
    in
        case classtb_ of
            (_,((c,f),_,_)) :: cds ->
                if f == class
                then
                    c :: (findSonClass class ([], cds))
                else
                    findSonClass class ([], cds)
                    
            [] ->
                []