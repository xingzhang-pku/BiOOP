# Bidirectional Preview

This is a direct manipulating programming system for incomplete programs.

## Tool Instructions
### Initial Incomplete Programs
1. In the editor on the left, write a program based on the syntax mentioned in the paper

   - Hole: `_` (underscore)
   - Lambda Expression: `\x=>x+1`
   - Function Call: `(\x=>x) 3`
   - List Construction: `1::2::[]` (or, `[1,2]`)
   - Tuple: `(1,2)`
   - Let-Binding: `let a = 1 in a`
   - Letrec-Binding: `letrec f = ... in ...`
   - If Conditional: `If x==y then ... else ...`
   - Case Expression: `case x==y of true=>...|false=>...|...`
2. Click "Eval" Button to see the output

### Direct Manipulate on Output/Context
1. Modify the text in the **Output** window
2. Modify the values in the **Context** window

    - Click hole values to jump to its closure
3. Click **Uneval and Preview** Button
    - To see the preview of the code changes
    - Click **Revert Code** to revert to the original code
4. Click **Uneval and Update** Button
    - Make sure the updated code and cannot retract

### Others
**Clear Hole-Bindings** Button: To clear the bindings of holes in the programs

## Code Structure
- **ace** the source code of [ace editor](https://ace.c9.io/)
- **elm.json** configuration file
- **examples** some example source programs
- **index.html** tool entrance
- **src** main code
  - *Native* interact with Javascript
- **style** css of web page

## Usage
- git clone
- click index.html

## Develop
- elm make src/Main.elm --output=elm.js
