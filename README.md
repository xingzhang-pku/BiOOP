# BiOOP

This is a direct manipulation programming system for object oriented programs.

## Tool Instructions
### Syntax
1. Class Declarations
   ```
   Class JFrame Extends Container {
       title:Ref<String>, 
       members:Ref<List<JComponent>>;

       setMembers(members){
           this.members:=members
       };
       setTitle(title){
           this.title:=title ++ ">"
       };
    }
    ```
2. Data Structures
- String: "abc"
- Tuple: `(1,2)`
- List: `[1,2,...,n]` (or, `1::2::[]`)

3. Arithmetic Expressions
- Binary Operator: `* / // + - ++ < > <= >= == && ||`
- Unary Operator: `- ~`

4. Sequence `s1;s2`
5. Conditions
- If Statement: `If t1 then t2 else t3`
- Case Statement:
```
case ls of
   [] => []
   | x :: xs => xs
```
6. References
- Reference Creations: ref 3
- Dereferences: !r
- Assignments: t1:=t2
7. Statements `var = term ;;`
8. Objects
- Field Access: `t.f`
- Method Invocation: `(object->method) args`
- Object Creations: `new Class([args])`

### Example
```
Class JComponent Extends Object {}

Class JMenuItem Extends JComponent {
    title:Ref<String>;

    setTitle(title){
        this.title:=title++"!!!"
    };
}

Class JMenu Extends JMenuItem {
    id:String, 
    items:List<JMenuItem>;
}

item1 = new JMenuItem([ref "Item1"]);;
item2 = new JMenuItem([ref "Item2"]);;
menu = new JMenu([ref "Menu", "menu-id", [item1, item2]]);;

main =
    (item1->setTitle) "Menu-Item";
    (menu->setTitle) "Test Menu";
    menu;;
```


### Direct Manipulations on Output (#TODO)
1. Value Manipulations: Directly manipulating the text in the Output window or using the Develop Tool of the browser.
2. Stucture Manipulations:
   - Modify Types
   - Adding Objects
   - Deleting Objects

## Usage
- git clone
- click oop-index.html

## Develop
- elm make src/OOP/Main.elm --output=oop-elm.js
