# SimpleScript

**SimpleScript** is a lightweight, beginner-friendly scripting language designed to make programming accessible, intuitive, and fun. Whether you're new to coding or looking for a clean language for quick prototyping, SimpleScript offers a powerful set of features with a simple and readable syntax.

---

## Why SimpleScript?

SimpleScript was created with the goal of making scripting easy to learn, easy to write, and easy to understand. It strips away the complexities of traditional programming languages, offering a clean and minimalistic syntax that gets out of your way so you can focus on logic and creativity.

It's perfect for:

- **Students** learning programming concepts
- **Educators** teaching control flow, logic, and scripting
- **Developers** looking for a fast way to prototype algorithms
- **Anyone** who wants to explore programming without boilerplate

---

## Features

SimpleScript includes everything you need to write functional and expressive code:

- **Clean and simple syntax**
- **Variable declaration** using `let`
- **Control structures**: `if`, `else`, `while`, `for`
- **Logical and comparison operators**: `and`, `or`, `==`, `!=`, `>`, `<`, etc.
- **Input/output support** with `input` and `print`
- **Built-in array operations**
- **Function declarations and calls**
- **Begin/End block scoping**
- **Whitespace-insensitive formatting**
- **Support for basic data types**: strings, numbers, booleans, arrays

---

## Code Example

```simplescript
let name = input("What's your name?")
print "Hello, " + name

let total = 0
for i = 1 to 5
  total = total + i
end
print "Total is: " + total

function greet(person)
  print "Hi, " + person + "!"
end

greet(name)
```

---

## Language Overview

### Keywords

SimpleScript includes a core set of keywords:

- `let` â€“ Declare a variable
- `print` â€“ Output text
- `input` â€“ Prompt for user input
- `if`, `else`, `then`, `end` â€“ Conditional statements
- `while`, `for`, `to`, `step` â€“ Looping constructs
- `function`, `return`, `call` â€“ Defining and using functions
- `begin`, `end` â€“ Define code blocks
- `and`, `or`, `not` â€“ Logical operators

### Data Types

- **Number**: e.g., `42`, `3.14`
- **String**: e.g., `"Hello"`
- **Boolean**: `true`, `false`
- **Array**: `[1, 2, 3]`
- **Null**: `null`

### Operators

- Arithmetic: `+`, `-`, `*`, `/`, `%`
- Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Logical: `and`, `or`, `not`
- Assignment: `=`

---

## Getting Started

You can run SimpleScript directly in your browserâ€”no installation required! Simply visit the [SimpleScript Webpage](#) and start writing code in the built-in editor.

The online interpreter will:

- Tokenize your code using a built-in lexer
- Parse and validate syntax using an internal parser
- Evaluate and execute using the SimpleScript interpreter

---

## File Structure

---

## Documentation

Full documentation is available in the `/docs` folder or at the [SimpleScript Docs Page](#). Topics include:

- All keywords with usage examples
- Data types and type conversion
- Built-in functions and custom function creation
- Array manipulation and loops
- Error handling and debugging tips

---

## Roadmap

Planned features for future versions:

- User-defined classes and objects
- File I/O support
- Better error messages with line numbers
- Extended standard library
- IDE integration and autocomplete

---

## Contributing

We welcome contributions of any kind!

- Submit bugs or feature requests via GitHub Issues
- Fork the project and create pull requests for new features
- Help write or improve documentation
- Share interesting SimpleScript programs with the community

---

## License

SimpleScript is open-source under the [MIT License](LICENSE).

---

Start scripting simplyâ€”start with **SimpleScript**
