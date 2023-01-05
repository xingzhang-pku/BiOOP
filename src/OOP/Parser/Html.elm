module OOP.Parser.Html exposing (..)

import Debug exposing (toString)
import OOP.Syntax exposing (Value(..))
import String exposing (trim, split)
import Html.Parser exposing (run, Node(..), Attribute)


parseHtml : String -> Result String Value
parseHtml s =
    let
        parseRes =
            run s
    in
    case parseRes of
        Result.Ok res ->
            case res of
                node :: [] ->
                    Ok <| nodeToValue node

                _ ->
                    Err "There can only be 1 node here."

        Result.Err info ->
            Err (toString info)


nodeToValue : Node -> Value
nodeToValue node =
        case node of
            Element s attrList childs ->
                let
                    vChilds =
                        parseChilds childs
                in
                    if s == "script" then
                        VHtml s VNil VNil vChilds
                    else
                        case attrList of
                            [] ->
                                VHtml s VNil VNil vChilds

                            ("style", pro) :: [] ->
                                VHtml s (pro    
                                            |> split ";"
                                            |> parseStyle) 
                                    VNil vChilds
                            
                            ("style", pro) :: al ->
                                VHtml s (pro
                                        |> split ";"
                                        |> parseStyle) 
                                    (parseOtherPro al) vChilds

                            al -> 
                                VHtml s VNil
                                (parseOtherPro al) vChilds

            Text s ->
                VString s
            
            _ ->
                VError "An error occurred in the node constructor."


parseChilds : List Node -> Value
parseChilds childs =
    case childs of
        [] -> VNil

        c :: cds ->
            VCons (nodeToValue c) (parseChilds cds)


parseStyle : List String -> Value
parseStyle pro =
    case pro of
        s :: ps ->
            let
                nameAndValue =
                    split ":" <| trim s

                proItem =
                    case nameAndValue of
                        n :: val :: [] ->
                            VCons (n |> trim |> VString)
                                    (VCons (trim val |> VString) VNil)

                        _ ->
                            VError "Parse Style Error."
            in
            case proItem of
                VError _ ->
                    parseStyle ps
                
                _ ->
                    VCons proItem (parseStyle ps)

        [] -> VNil


parseOtherPro : List Attribute -> Value
parseOtherPro al =
    case al of
        ("contenteditable", _) :: al_ ->
            parseOtherPro al_

        (name, value) :: al_ ->
            let
                proItem =
                    VCons (name |> trim |> VString)
                    (VCons (value |> trim |> VString)
                        VNil)
            in
                VCons proItem (parseOtherPro al_)
        
        [] ->
            VNil