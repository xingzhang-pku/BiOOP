module HtmlParser exposing (..)

import List exposing (map, foldr)
import Syntax exposing (Value(..))
import Parser_ exposing (parseHoleName, findContext)
import Html.Parser exposing (run, Node(..), Attribute)
import String exposing (toList, trim, fromList, split, left, dropRight)

parseHtml : String -> List Value -> Value
parseHtml s context =
    let
        parseRes =
            run s
    in
    case parseRes of
        Result.Ok res ->
            case res of
                node :: [] ->
                    nodeToValue node context

                _ ->
                    VError "There cannot be two or more or 0 root nodes."

        Result.Err _ ->
            VError "Parse Html Error."


nodeToValue : Node -> List Value -> Value
nodeToValue node context =
        case node of
            Element s attrList childs ->
                case s of
                    "span" ->
                        case childs of
                            [Text c] ->
                                trim c |> toList |> stringToVCons context

                            _ ->
                                VError "Parse Hole Error: 01."
                    _ ->
                        let
                            vChilds =
                                parseChilds childs context
                        in
                        case attrList of
                            [] ->
                                VHtml s (VNil 0) (VNil 0) vChilds

                            ("style", pro) :: [] ->
                                VHtml s (pro    
                                            |> split ";"
                                            |> parseStyle context) 
                                    (VNil 0) vChilds
                            
                            ("style", pro) :: al ->
                                VHtml s (pro
                                        |> split ";"
                                        |> parseStyle context) 
                                    (parseOtherPro al context) vChilds

                            al -> 
                                VHtml s (VNil 0)
                                (parseOtherPro al context) vChilds

            Text s ->
                stringToVCons context <| toList s
            
            _ ->
                VError "An error occurred in the node constructor."


parseChilds : List Node -> List Value -> Value
parseChilds childs context =
    case childs of
        [] -> VNil 0

        c :: cds ->
            VCons 0 (nodeToValue c context) (parseChilds cds context)


parseStyle : List Value -> List String -> Value
parseStyle context pro =
    case pro of
        s :: ps ->
            if (trim s |> left 1) == "{" then
                s |> trim |> toList |> stringToVCons context
            else
                let
                    nameAndValue =
                        split ":" <| trim s

                    proItem =
                        case nameAndValue of
                            n :: val :: [] ->
                                VCons 0 (n |> trim |> toList |> stringToVCons context)
                                        (trim val 
                                        |> split " "
                                        |> map trim
                                        |> map toList 
                                        |> map (stringToVCons context)
                                        |> foldr (VCons 0) (VNil 0))

                            _ ->
                                VError "Parse Style Error."
                in
                case proItem of
                    VError _ ->
                        parseStyle context ps
                    
                    _ ->
                        VCons 0 proItem (parseStyle context ps)

        [] -> VNil 0


stringToVCons :  List Value -> List Char -> Value
stringToVCons context lc =
    case lc of
        [] ->
            VNil 1

        c :: cs ->
            case c of
                '{' ->
                    let
                        res =
                            parseHoleName <| dropRight 1 <|fromList cs
                    in
                    case res of
                        Result.Ok hn ->
                            findContext context hn
                        
                        Result.Err _ ->
                            VError "Parse Hole Error: 02."

                _ ->
                    VCons 1 (VChar c) (stringToVCons context cs)


parseOtherPro : List Attribute -> List Value -> Value
parseOtherPro al context =
    case al of
        ("contenteditable", _) :: al_ ->
            parseOtherPro al_ context

        (name, value) :: al_ ->
            if (trim name |> left 1) == "{" then
                let
                    proItem =
                        name |> trim |> toList |> stringToVCons context
                in
                    VCons 0 proItem (parseOtherPro al_ context)
            else
                let
                    proItem =
                        VCons 0 (name |> trim |> toList |> stringToVCons context)
                        (VCons 0 (value |> trim |> toList |> stringToVCons context)
                            (VNil 0))
                in
                    VCons 0 proItem (parseOtherPro al_ context)
        
        [] ->
            VNil 0