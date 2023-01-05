(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Model$Console = {$: 'Console'};
var $author$project$Syntax$HOri = function (a) {
	return {$: 'HOri', a: a};
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Model$initModel = {
	code: '',
	codeBackup: '',
	context: _List_Nil,
	currentContext: $author$project$Syntax$HOri(-1),
	editContextItem: _Utils_Tuple2(-1, ''),
	hbBackup: _List_Nil,
	holeBindings: _List_Nil,
	isOutputChange: false,
	mode: $author$project$Model$Console,
	output: '',
	path: _List_Nil
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2($author$project$Model$initModel, $elm$core$Platform$Cmd$none);
};
var $author$project$Model$OutputChange = function (a) {
	return {$: 'OutputChange', a: a};
};
var $author$project$Model$SaveCode = function (a) {
	return {$: 'SaveCode', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$receiveCode = _Platform_incomingPort('receiveCode', $elm$json$Json$Decode$string);
var $author$project$Main$receiveOutput = _Platform_incomingPort('receiveOutput', $elm$json$Json$Decode$string);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$receiveCode($author$project$Model$SaveCode),
				$author$project$Main$receiveOutput($author$project$Model$OutputChange)
			]));
};
var $author$project$Model$HTML = {$: 'HTML'};
var $author$project$Syntax$IndexedHole = F2(
	function (a, b) {
		return {$: 'IndexedHole', a: a, b: b};
	});
var $author$project$LangUtils$addIndexToVenv = F2(
	function (n, venv) {
		if (venv.b) {
			var _v1 = venv.a;
			var s = _v1.a;
			var v = _v1.b;
			var vs = venv.b;
			if (v.$ === 'VHole') {
				var hn = v.a;
				var venv1 = v.b;
				var venv2 = A2($author$project$LangUtils$addIndexToVenv, 0, venv1);
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple3(
						n,
						s,
						A2($author$project$Syntax$IndexedHole, hn, venv2)),
					A2($author$project$LangUtils$addIndexToVenv, n + 1, vs));
			} else {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple3(n, s, v),
					A2($author$project$LangUtils$addIndexToVenv, n + 1, vs));
			}
		} else {
			return _List_Nil;
		}
	});
var $author$project$LangUtils$collectContext = function (val) {
	switch (val.$) {
		case 'VCons':
			var v1 = val.b;
			var v2 = val.c;
			return _Utils_ap(
				$author$project$LangUtils$collectContext(v1),
				$author$project$LangUtils$collectContext(v2));
		case 'VBTuple':
			var v1 = val.a;
			var v2 = val.b;
			return _Utils_ap(
				$author$project$LangUtils$collectContext(v1),
				$author$project$LangUtils$collectContext(v2));
		case 'VTTuple':
			var v1 = val.a;
			var v2 = val.b;
			var v3 = val.c;
			return _Utils_ap(
				$author$project$LangUtils$collectContext(v1),
				_Utils_ap(
					$author$project$LangUtils$collectContext(v2),
					$author$project$LangUtils$collectContext(v3)));
		case 'VHole':
			var hn = val.a;
			var venv = val.b;
			var venv_ = A2($author$project$LangUtils$addIndexToVenv, 0, venv);
			return _List_fromArray(
				[
					A2($author$project$Syntax$IndexedHole, hn, venv_)
				]);
		default:
			return _List_Nil;
	}
};
var $author$project$LangUtils$elemInContext = F2(
	function (v, context) {
		elemInContext:
		while (true) {
			if (v.$ === 'IndexedHole') {
				var hn = v.a;
				if (context.b && (context.a.$ === 'IndexedHole')) {
					var _v2 = context.a;
					var hn_ = _v2.a;
					var ct = context.b;
					if (_Utils_eq(hn, hn_)) {
						return true;
					} else {
						var $temp$v = v,
							$temp$context = ct;
						v = $temp$v;
						context = $temp$context;
						continue elemInContext;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	});
var $author$project$LangUtils$unique = function (context) {
	if (!context.b) {
		return _List_Nil;
	} else {
		var v = context.a;
		var vs = context.b;
		var rest = $author$project$LangUtils$unique(vs);
		return A2($author$project$LangUtils$elemInContext, v, rest) ? rest : A2($elm$core$List$cons, v, rest);
	}
};
var $author$project$LangUtils$collectUniqueContext = function (val) {
	return $author$project$LangUtils$unique(
		$author$project$LangUtils$collectContext(val));
};
var $author$project$Syntax$Cat = {$: 'Cat'};
var $author$project$Syntax$EApp = F3(
	function (a, b, c) {
		return {$: 'EApp', a: a, b: b, c: c};
	});
var $author$project$Syntax$EFix = F2(
	function (a, b) {
		return {$: 'EFix', a: a, b: b};
	});
var $author$project$Syntax$ELam = F3(
	function (a, b, c) {
		return {$: 'ELam', a: a, b: b, c: c};
	});
var $author$project$Syntax$HInst = F2(
	function (a, b) {
		return {$: 'HInst', a: a, b: b};
	});
var $author$project$Syntax$HInter = function (a) {
	return {$: 'HInter', a: a};
};
var $author$project$Syntax$VBTuple = F2(
	function (a, b) {
		return {$: 'VBTuple', a: a, b: b};
	});
var $author$project$Syntax$VChar = function (a) {
	return {$: 'VChar', a: a};
};
var $author$project$Syntax$VClosure = F3(
	function (a, b, c) {
		return {$: 'VClosure', a: a, b: b, c: c};
	});
var $author$project$Syntax$VCons = F3(
	function (a, b, c) {
		return {$: 'VCons', a: a, b: b, c: c};
	});
var $author$project$Syntax$VError = function (a) {
	return {$: 'VError', a: a};
};
var $author$project$Syntax$VFalse = {$: 'VFalse'};
var $author$project$Syntax$VFix = function (a) {
	return {$: 'VFix', a: a};
};
var $author$project$Syntax$VFloat = function (a) {
	return {$: 'VFloat', a: a};
};
var $author$project$Syntax$VHole = F2(
	function (a, b) {
		return {$: 'VHole', a: a, b: b};
	});
var $author$project$Syntax$VHtml = F4(
	function (a, b, c, d) {
		return {$: 'VHtml', a: a, b: b, c: c, d: d};
	});
var $author$project$Syntax$VInt = function (a) {
	return {$: 'VInt', a: a};
};
var $author$project$Syntax$VNil = function (a) {
	return {$: 'VNil', a: a};
};
var $author$project$Syntax$VTTuple = F3(
	function (a, b, c) {
		return {$: 'VTTuple', a: a, b: b, c: c};
	});
var $author$project$Syntax$VTrue = {$: 'VTrue'};
var $author$project$LangUtils$append = F2(
	function (l1, l2) {
		switch (l1.$) {
			case 'VNil':
				return l2;
			case 'VCons':
				var id1 = l1.a;
				var v1 = l1.b;
				var vs1 = l1.c;
				return A3(
					$author$project$Syntax$VCons,
					id1,
					v1,
					A2($author$project$LangUtils$append, vs1, l2));
			default:
				return $author$project$Syntax$VError('List Concat Error.');
		}
	});
var $author$project$Eval$boolOp = function (p) {
	return p ? $author$project$Syntax$VTrue : $author$project$Syntax$VFalse;
};
var $author$project$Syntax$defaultWS = _Utils_Tuple2(_List_Nil, 0);
var $author$project$Syntax$esElm = 4;
var $author$project$Syntax$esQuo = 3;
var $author$project$Eval$findCount = F2(
	function (hn, count) {
		findCount:
		while (true) {
			if (count.b) {
				if ((count.a.a.$ === 'HInter') && (!count.a.a.a)) {
					var _v1 = count.a;
					var n = _v1.b;
					return n;
				} else {
					var _v2 = count.a;
					var hn_ = _v2.a;
					var n = _v2.b;
					var ct = count.b;
					if (_Utils_eq(hn, hn_)) {
						return n;
					} else {
						var $temp$hn = hn,
							$temp$count = ct;
						hn = $temp$hn;
						count = $temp$count;
						continue findCount;
					}
				}
			} else {
				return 0;
			}
		}
	});
var $author$project$Eval$findValue = F3(
	function (u, venv, henv) {
		findValue:
		while (true) {
			if (!henv.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v1 = henv.a;
				var u_ = _v1.a;
				var venv_ = _v1.b;
				var v_ = _v1.c;
				var ls = henv.b;
				if (_Utils_eq(u_, u) && _Utils_eq(venv_, venv)) {
					return $elm$core$Maybe$Just(v_);
				} else {
					var $temp$u = u,
						$temp$venv = venv,
						$temp$henv = ls;
					u = $temp$u;
					venv = $temp$venv;
					henv = $temp$henv;
					continue findValue;
				}
			}
		}
	});
var $author$project$LangUtils$findVarByName = F2(
	function (s, venv) {
		findVarByName:
		while (true) {
			if (!venv.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v1 = venv.a;
				var s1 = _v1.a;
				var v1 = _v1.b;
				var vv = venv.b;
				if (_Utils_eq(s1, s)) {
					return $elm$core$Maybe$Just(v1);
				} else {
					var $temp$s = s,
						$temp$venv = vv;
					s = $temp$s;
					venv = $temp$venv;
					continue findVarByName;
				}
			}
		}
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Eval$floatOp = F3(
	function (op, n1, n2) {
		switch (op.$) {
			case 'Add':
				return $author$project$Syntax$VFloat(n1 + n2);
			case 'Sub':
				return $author$project$Syntax$VFloat(n1 - n2);
			case 'Mul':
				return $author$project$Syntax$VFloat(n1 * n2);
			case 'Div':
				return $author$project$Syntax$VFloat(n1 / n2);
			case 'DDiv':
				return $author$project$Syntax$VFloat(n1 / n2);
			case 'Eq':
				return $author$project$Eval$boolOp(
					_Utils_eq(n1, n2));
			case 'Lt':
				return $author$project$Eval$boolOp(
					_Utils_cmp(n1, n2) < 0);
			case 'Gt':
				return $author$project$Eval$boolOp(
					_Utils_cmp(n1, n2) > 0);
			case 'Le':
				return $author$project$Eval$boolOp(
					_Utils_cmp(n1, n2) < 1);
			case 'Ge':
				return $author$project$Eval$boolOp(
					_Utils_cmp(n1, n2) > -1);
			default:
				return $author$project$Syntax$VError('Logical Operation Error: 03');
		}
	});
var $author$project$Syntax$HField = F2(
	function (a, b) {
		return {$: 'HField', a: a, b: b};
	});
var $author$project$Syntax$HId = function (a) {
	return {$: 'HId', a: a};
};
var $author$project$LangUtils$match = F2(
	function (pat, val) {
		var _v0 = _Utils_Tuple2(pat, val);
		_v0$19:
		while (true) {
			switch (_v0.a.$) {
				case 'PCons':
					switch (_v0.b.$) {
						case 'VHole':
							var _v1 = _v0.a;
							var p1 = _v1.b;
							var p2 = _v1.c;
							var _v2 = _v0.b;
							var u = _v2.a;
							var env = _v2.b;
							var res2 = A2(
								$author$project$LangUtils$match,
								p2,
								A2(
									$author$project$Syntax$VHole,
									A2(
										$author$project$Syntax$HField,
										u,
										$author$project$Syntax$HId(2)),
									env));
							var res1 = A2(
								$author$project$LangUtils$match,
								p1,
								A2(
									$author$project$Syntax$VHole,
									A2(
										$author$project$Syntax$HField,
										u,
										$author$project$Syntax$HId(1)),
									env));
							return (_Utils_eq(
								res1,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])) || _Utils_eq(
								res2,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									]))) ? _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$Syntax$VError('Match Failed.'))
								]) : _Utils_ap(res1, res2);
						case 'VCons':
							var _v7 = _v0.a;
							var p1 = _v7.b;
							var p2 = _v7.c;
							var _v8 = _v0.b;
							var v = _v8.b;
							var vs = _v8.c;
							var res2 = A2($author$project$LangUtils$match, p2, vs);
							var res1 = A2($author$project$LangUtils$match, p1, v);
							return (_Utils_eq(
								res1,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])) || _Utils_eq(
								res2,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									]))) ? _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$Syntax$VError('Match Failed.'))
								]) : _Utils_ap(res1, res2);
						default:
							break _v0$19;
					}
				case 'PBTuple':
					switch (_v0.b.$) {
						case 'VHole':
							var _v3 = _v0.a;
							var p1 = _v3.b;
							var p2 = _v3.c;
							var _v4 = _v0.b;
							var u = _v4.a;
							var env = _v4.b;
							var res2 = A2(
								$author$project$LangUtils$match,
								p2,
								A2(
									$author$project$Syntax$VHole,
									A2(
										$author$project$Syntax$HField,
										u,
										$author$project$Syntax$HId(2)),
									env));
							var res1 = A2(
								$author$project$LangUtils$match,
								p1,
								A2(
									$author$project$Syntax$VHole,
									A2(
										$author$project$Syntax$HField,
										u,
										$author$project$Syntax$HId(1)),
									env));
							return (_Utils_eq(
								res1,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])) || _Utils_eq(
								res2,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									]))) ? _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$Syntax$VError('Match Failed.'))
								]) : _Utils_ap(res1, res2);
						case 'VBTuple':
							var _v9 = _v0.a;
							var p1 = _v9.b;
							var p2 = _v9.c;
							var _v10 = _v0.b;
							var v1 = _v10.a;
							var v2 = _v10.b;
							var res2 = A2($author$project$LangUtils$match, p2, v2);
							var res1 = A2($author$project$LangUtils$match, p1, v1);
							return (_Utils_eq(
								res1,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])) || _Utils_eq(
								res2,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									]))) ? _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$Syntax$VError('Match Failed.'))
								]) : _Utils_ap(res1, res2);
						default:
							break _v0$19;
					}
				case 'PTTuple':
					switch (_v0.b.$) {
						case 'VHole':
							var _v5 = _v0.a;
							var p1 = _v5.b;
							var p2 = _v5.c;
							var p3 = _v5.d;
							var _v6 = _v0.b;
							var u = _v6.a;
							var env = _v6.b;
							var res3 = A2(
								$author$project$LangUtils$match,
								p3,
								A2(
									$author$project$Syntax$VHole,
									A2(
										$author$project$Syntax$HField,
										u,
										$author$project$Syntax$HId(3)),
									env));
							var res2 = A2(
								$author$project$LangUtils$match,
								p2,
								A2(
									$author$project$Syntax$VHole,
									A2(
										$author$project$Syntax$HField,
										u,
										$author$project$Syntax$HId(2)),
									env));
							var res1 = A2(
								$author$project$LangUtils$match,
								p1,
								A2(
									$author$project$Syntax$VHole,
									A2(
										$author$project$Syntax$HField,
										u,
										$author$project$Syntax$HId(1)),
									env));
							return (_Utils_eq(
								res1,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])) || (_Utils_eq(
								res2,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])) || _Utils_eq(
								res2,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])))) ? _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$Syntax$VError('Match Failed.'))
								]) : _Utils_ap(
								res1,
								_Utils_ap(res2, res3));
						case 'VTTuple':
							var _v11 = _v0.a;
							var p1 = _v11.b;
							var p2 = _v11.c;
							var p3 = _v11.d;
							var _v12 = _v0.b;
							var v1 = _v12.a;
							var v2 = _v12.b;
							var v3 = _v12.c;
							var res3 = A2($author$project$LangUtils$match, p3, v3);
							var res2 = A2($author$project$LangUtils$match, p2, v2);
							var res1 = A2($author$project$LangUtils$match, p1, v1);
							return (_Utils_eq(
								res1,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])) || (_Utils_eq(
								res2,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])) || _Utils_eq(
								res3,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ERROR',
										$author$project$Syntax$VError('Match Failed.'))
									])))) ? _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$Syntax$VError('Match Failed.'))
								]) : _Utils_ap(
								res1,
								_Utils_ap(res2, res3));
						default:
							break _v0$19;
					}
				case 'PInt':
					switch (_v0.b.$) {
						case 'VInt':
							var _v13 = _v0.a;
							var n1 = _v13.b;
							var n2 = _v0.b.a;
							return _Utils_eq(n1, n2) ? _List_Nil : _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$Syntax$VError('Match Failed.'))
								]);
						case 'VHole':
							var _v14 = _v0.a;
							var _v15 = _v0.b;
							return _List_Nil;
						default:
							break _v0$19;
					}
				case 'PFloat':
					switch (_v0.b.$) {
						case 'VFloat':
							var _v16 = _v0.a;
							var n1 = _v16.b;
							var n2 = _v0.b.a;
							return _Utils_eq(n1, n2) ? _List_Nil : _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$Syntax$VError('Match Failed.'))
								]);
						case 'VHole':
							var _v17 = _v0.a;
							var _v18 = _v0.b;
							return _List_Nil;
						default:
							break _v0$19;
					}
				case 'PTrue':
					switch (_v0.b.$) {
						case 'VTrue':
							var _v19 = _v0.b;
							return _List_Nil;
						case 'VHole':
							var _v20 = _v0.b;
							return _List_Nil;
						default:
							break _v0$19;
					}
				case 'PFalse':
					switch (_v0.b.$) {
						case 'VFalse':
							var _v21 = _v0.b;
							return _List_Nil;
						case 'VHole':
							var _v22 = _v0.b;
							return _List_Nil;
						default:
							break _v0$19;
					}
				case 'PChar':
					switch (_v0.b.$) {
						case 'VChar':
							var _v23 = _v0.a;
							var c1 = _v23.b;
							var c2 = _v0.b.a;
							return _Utils_eq(c1, c2) ? _List_Nil : _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$Syntax$VError('Match Failed.'))
								]);
						case 'VHole':
							var _v24 = _v0.a;
							var _v25 = _v0.b;
							return _List_Nil;
						default:
							break _v0$19;
					}
				case 'PNil':
					switch (_v0.b.$) {
						case 'VNil':
							return _List_Nil;
						case 'VHole':
							var _v26 = _v0.b;
							return _List_Nil;
						default:
							break _v0$19;
					}
				default:
					var _v27 = _v0.a;
					var s = _v27.b;
					var v = _v0.b;
					return _List_fromArray(
						[
							_Utils_Tuple2(s, v)
						]);
			}
		}
		return _List_fromArray(
			[
				_Utils_Tuple2(
				'ERROR',
				$author$project$Syntax$VError('Match Failed.'))
			]);
	});
var $author$project$Syntax$EError = function (a) {
	return {$: 'EError', a: a};
};
var $author$project$Syntax$PNil = function (a) {
	return {$: 'PNil', a: a};
};
var $author$project$LangUtils$matchCase = F2(
	function (v, b) {
		matchCase:
		while (true) {
			switch (b.$) {
				case 'BNSin':
					var n = b.b;
					var p = b.c;
					var e = b.d;
					return {
						choice: n,
						ei: e,
						pi: p,
						venvm: A2($author$project$LangUtils$match, p, v)
					};
				case 'BCom':
					var b1 = b.b;
					var b2 = b.c;
					var res = A2($author$project$LangUtils$matchCase, v, b1);
					var _v1 = res.venvm;
					if ((_v1.b && (_v1.a.b.$ === 'VError')) && (!_v1.b.b)) {
						var _v2 = _v1.a;
						var $temp$v = v,
							$temp$b = b2;
						v = $temp$v;
						b = $temp$b;
						continue matchCase;
					} else {
						return res;
					}
				default:
					return {
						choice: 0,
						ei: $author$project$Syntax$EError('Match Case Error.'),
						pi: $author$project$Syntax$PNil($author$project$Syntax$defaultWS),
						venvm: _List_Nil
					};
			}
		}
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Debug$toString = _Debug_toString;
var $author$project$LangUtils$printHoleName = function (hn) {
	_v0$4:
	while (true) {
		switch (hn.$) {
			case 'HField':
				if (hn.b.$ === 'HId') {
					var hn_ = hn.a;
					var n = hn.b.a;
					return $author$project$LangUtils$printHoleName(hn_) + ('·' + $elm$core$Debug$toString(n));
				} else {
					break _v0$4;
				}
			case 'HInst':
				var hn_ = hn.a;
				var n = hn.b;
				return $author$project$LangUtils$printHoleName(hn_) + ('_' + $elm$core$Debug$toString(n));
			case 'HInter':
				var n = hn.a;
				return '*' + $elm$core$Debug$toString(n);
			case 'HOri':
				var n = hn.a;
				return $elm$core$Debug$toString(n);
			default:
				break _v0$4;
		}
	}
	return 'Print HoleName Error.';
};
var $author$project$LangUtils$printStrNoQuoOrHole = function (s) {
	_v0$3:
	while (true) {
		switch (s.$) {
			case 'VHole':
				var hn = s.a;
				var venv = s.b;
				var venv_ = A2($author$project$LangUtils$addIndexToVenv, 0, venv);
				return _Utils_Tuple2(
					'{' + ($author$project$LangUtils$printHoleName(hn) + '}'),
					_List_fromArray(
						[
							A2($author$project$Syntax$IndexedHole, hn, venv_)
						]));
			case 'VCons':
				if ((s.a === 1) && (s.b.$ === 'VChar')) {
					var c = s.b.a;
					var cs = s.c;
					var _v1 = $author$project$LangUtils$printStrNoQuoOrHole(cs);
					var res = _v1.a;
					return _Utils_Tuple2(
						_Utils_ap(
							$elm$core$String$fromChar(c),
							res),
						_List_Nil);
				} else {
					break _v0$3;
				}
			case 'VNil':
				if (s.a === 1) {
					return _Utils_Tuple2('', _List_Nil);
				} else {
					break _v0$3;
				}
			default:
				break _v0$3;
		}
	}
	return _Utils_Tuple2('Print String Without Quotation Marks Error.', _List_Nil);
};
var $author$project$LangUtils$printOtherPro = function (p) {
	_v0$2:
	while (true) {
		switch (p.$) {
			case 'VCons':
				if (((((!p.a) && (p.c.$ === 'VCons')) && (!p.c.a)) && (p.c.c.$ === 'VNil')) && (!p.c.c.a)) {
					var n = p.b;
					var _v1 = p.c;
					var v = _v1.b;
					var _v2 = $author$project$LangUtils$printStrNoQuoOrHole(n);
					var str1 = _v2.a;
					var _v3 = $author$project$LangUtils$printStrNoQuoOrHole(v);
					var str2 = _v3.a;
					var ctx2 = _v3.b;
					return _Utils_Tuple2(str1 + ('=\"' + (str2 + '\" ')), ctx2);
				} else {
					break _v0$2;
				}
			case 'VHole':
				var hn = p.a;
				var venv = p.b;
				var venv_ = A2($author$project$LangUtils$addIndexToVenv, 0, venv);
				return _Utils_Tuple2(
					'{' + ($author$project$LangUtils$printHoleName(hn) + '}'),
					_List_fromArray(
						[
							A2($author$project$Syntax$IndexedHole, hn, venv_)
						]));
			default:
				break _v0$2;
		}
	}
	return _Utils_Tuple2('Print Property Error.', _List_Nil);
};
var $author$project$LangUtils$printAttr = function (attr) {
	_v0$3:
	while (true) {
		switch (attr.$) {
			case 'VCons':
				if (!attr.a) {
					if ((attr.c.$ === 'VNil') && (!attr.c.a)) {
						var x = attr.b;
						return $author$project$LangUtils$printOtherPro(x);
					} else {
						var x = attr.b;
						var xs = attr.c;
						var _v1 = $author$project$LangUtils$printAttr(xs);
						var str2 = _v1.a;
						var ctx2 = _v1.b;
						var _v2 = $author$project$LangUtils$printOtherPro(x);
						var str1 = _v2.a;
						var ctx1 = _v2.b;
						return _Utils_Tuple2(
							str1 + (' ' + str2),
							_Utils_ap(ctx1, ctx2));
					}
				} else {
					break _v0$3;
				}
			case 'VNil':
				if (!attr.a) {
					return _Utils_Tuple2('', _List_Nil);
				} else {
					break _v0$3;
				}
			default:
				break _v0$3;
		}
	}
	return _Utils_Tuple2('Print Attributions Error.', _List_Nil);
};
var $author$project$LangUtils$printString = function (v) {
	_v0$2:
	while (true) {
		switch (v.$) {
			case 'VNil':
				if (v.a === 1) {
					return '\"';
				} else {
					break _v0$2;
				}
			case 'VCons':
				if (v.b.$ === 'VChar') {
					var c = v.b.a;
					var v2 = v.c;
					return _Utils_ap(
						$elm$core$String$fromChar(c),
						$author$project$LangUtils$printString(v2));
				} else {
					break _v0$2;
				}
			default:
				break _v0$2;
		}
	}
	return 'Print Value Error: 03.';
};
var $author$project$LangUtils$printProValues = function (ls) {
	if ((ls.$ === 'VCons') && (!ls.a)) {
		if ((ls.c.$ === 'VNil') && (!ls.c.a)) {
			var x = ls.b;
			var _v1 = $author$project$LangUtils$printStrNoQuoOrHole(x);
			var str = _v1.a;
			var ctx = _v1.b;
			return _Utils_Tuple2(str + '; ', ctx);
		} else {
			var x = ls.b;
			var xs = ls.c;
			var _v2 = $author$project$LangUtils$printProValues(xs);
			var str2 = _v2.a;
			var ctx2 = _v2.b;
			var _v3 = $author$project$LangUtils$printStrNoQuoOrHole(x);
			var str1 = _v3.a;
			var ctx1 = _v3.b;
			return _Utils_Tuple2(
				str1 + (' ' + str2),
				_Utils_ap(ctx1, ctx2));
		}
	} else {
		return _Utils_Tuple2('Print Property Values Error.', _List_Nil);
	}
};
var $author$project$LangUtils$printProperty = function (p) {
	_v0$2:
	while (true) {
		switch (p.$) {
			case 'VCons':
				if (!p.a) {
					var s = p.b;
					var xs = p.c;
					var _v1 = $author$project$LangUtils$printStrNoQuoOrHole(s);
					var str1 = _v1.a;
					var _v2 = $author$project$LangUtils$printProValues(xs);
					var str2 = _v2.a;
					var ctx2 = _v2.b;
					return _Utils_Tuple2(str1 + (': ' + str2), ctx2);
				} else {
					break _v0$2;
				}
			case 'VHole':
				var hn = p.a;
				var venv = p.b;
				var venv_ = A2($author$project$LangUtils$addIndexToVenv, 0, venv);
				return _Utils_Tuple2(
					'{' + ($author$project$LangUtils$printHoleName(hn) + '}'),
					_List_fromArray(
						[
							A2($author$project$Syntax$IndexedHole, hn, venv_)
						]));
			default:
				break _v0$2;
		}
	}
	return _Utils_Tuple2('Print Property Error.', _List_Nil);
};
var $author$project$LangUtils$printStyle = function (style) {
	_v0$3:
	while (true) {
		switch (style.$) {
			case 'VCons':
				if (!style.a) {
					if ((style.c.$ === 'VNil') && (!style.c.a)) {
						var x = style.b;
						return $author$project$LangUtils$printProperty(x);
					} else {
						var x = style.b;
						var xs = style.c;
						var _v1 = $author$project$LangUtils$printStyle(xs);
						var str2 = _v1.a;
						var ctx2 = _v1.b;
						var _v2 = $author$project$LangUtils$printProperty(x);
						var str1 = _v2.a;
						var ctx1 = _v2.b;
						return _Utils_Tuple2(
							_Utils_ap(str1, str2),
							_Utils_ap(ctx1, ctx2));
					}
				} else {
					break _v0$3;
				}
			case 'VHole':
				var hn = style.a;
				var venv = style.b;
				var venv_ = A2($author$project$LangUtils$addIndexToVenv, 0, venv);
				return _Utils_Tuple2(
					'{' + ($author$project$LangUtils$printHoleName(hn) + '}'),
					_List_fromArray(
						[
							A2($author$project$Syntax$IndexedHole, hn, venv_)
						]));
			default:
				break _v0$3;
		}
	}
	return _Utils_Tuple2('Print Style Error: 02.', _List_Nil);
};
var $author$project$LangUtils$print = function (v) {
	switch (v.$) {
		case 'VInt':
			var n = v.a;
			return _Utils_Tuple2(
				$elm$core$Debug$toString(n),
				_List_Nil);
		case 'VFloat':
			var n = v.a;
			return _Utils_Tuple2(
				$elm$core$Debug$toString(n),
				_List_Nil);
		case 'VTrue':
			return _Utils_Tuple2('true', _List_Nil);
		case 'VFalse':
			return _Utils_Tuple2('false', _List_Nil);
		case 'VChar':
			var c = v.a;
			return _Utils_Tuple2(
				'\'' + ($elm$core$String$fromChar(c) + '\''),
				_List_Nil);
		case 'VNil':
			switch (v.a) {
				case 0:
					return _Utils_Tuple2('[]', _List_Nil);
				case 1:
					return _Utils_Tuple2('\"\"', _List_Nil);
				default:
					return _Utils_Tuple2('Print Value Error: 04.', _List_Nil);
			}
		case 'VCons':
			switch (v.a) {
				case 0:
					var v1 = v.b;
					var v2 = v.c;
					return _Utils_Tuple2(
						'[ ' + A2($author$project$LangUtils$printList, v1, v2),
						_List_Nil);
				case 1:
					var v1 = v.b;
					var v2 = v.c;
					if (v1.$ === 'VChar') {
						var c = v1.a;
						return _Utils_Tuple2(
							'\"' + ($elm$core$String$fromChar(c) + $author$project$LangUtils$printString(v2)),
							_List_Nil);
					} else {
						return _Utils_Tuple2('Print Value Error: 02.', _List_Nil);
					}
				default:
					return _Utils_Tuple2('Print Value Error: 01.', _List_Nil);
			}
		case 'VHole':
			var hn = v.a;
			return _Utils_Tuple2(
				'{ ' + ($author$project$LangUtils$printHoleName(hn) + ' }'),
				_List_Nil);
		case 'IndexedHole':
			var hn = v.a;
			return _Utils_Tuple2(
				'{ ' + ($author$project$LangUtils$printHoleName(hn) + ' }'),
				_List_Nil);
		case 'VError':
			var info = v.a;
			return _Utils_Tuple2(info, _List_Nil);
		case 'VClosure':
			return _Utils_Tuple2('<fn>', _List_Nil);
		case 'VFix':
			return _Utils_Tuple2('<fix>', _List_Nil);
		case 'VBTuple':
			var v1 = v.a;
			var v2 = v.b;
			var _v15 = $author$project$LangUtils$print(v2);
			var str2 = _v15.a;
			var _v16 = $author$project$LangUtils$print(v1);
			var str1 = _v16.a;
			return _Utils_Tuple2('( ' + (str1 + (', ' + (str2 + ' )'))), _List_Nil);
		case 'VTTuple':
			var v1 = v.a;
			var v2 = v.b;
			var v3 = v.c;
			var _v17 = $author$project$LangUtils$print(v3);
			var str3 = _v17.a;
			var _v18 = $author$project$LangUtils$print(v2);
			var str2 = _v18.a;
			var _v19 = $author$project$LangUtils$print(v1);
			var str1 = _v19.a;
			return _Utils_Tuple2('( ' + (str1 + (', ' + (str2 + (', ' + (str3 + ' )'))))), _List_Nil);
		default:
			var s = v.a;
			var v1 = v.b;
			var v2 = v.c;
			var v3 = v.d;
			return A4($author$project$LangUtils$printHTML, s, v1, v2, v3);
	}
};
var $author$project$LangUtils$printChilds = function (childs) {
	_v5$2:
	while (true) {
		switch (childs.$) {
			case 'VNil':
				if (!childs.a) {
					return _Utils_Tuple2('', _List_Nil);
				} else {
					break _v5$2;
				}
			case 'VCons':
				if (!childs.a) {
					var c = childs.b;
					var cs = childs.c;
					_v6$4:
					while (true) {
						switch (c.$) {
							case 'VHtml':
								var _v7 = $author$project$LangUtils$printChilds(cs);
								var str2 = _v7.a;
								var ctx2 = _v7.b;
								var _v8 = $author$project$LangUtils$print(c);
								var str1 = _v8.a;
								var ctx1 = _v8.b;
								return _Utils_Tuple2(
									_Utils_ap(str1, str2),
									_Utils_ap(ctx1, ctx2));
							case 'VHole':
								var hn = c.a;
								var venv = c.b;
								var venv_ = A2($author$project$LangUtils$addIndexToVenv, 0, venv);
								var hole = '<span style=\"border: 1px solid purple; padding: 2px; margin: 1px;\">{' + ($author$project$LangUtils$printHoleName(hn) + '}</span>');
								var _v9 = $author$project$LangUtils$printChilds(cs);
								var str2 = _v9.a;
								var ctx2 = _v9.b;
								return _Utils_Tuple2(
									_Utils_ap(hole, str2),
									A2(
										$elm$core$List$cons,
										A2($author$project$Syntax$IndexedHole, hn, venv_),
										ctx2));
							case 'VCons':
								if (c.a === 1) {
									var _v10 = $author$project$LangUtils$printChilds(cs);
									var str2 = _v10.a;
									var ctx2 = _v10.b;
									var _v11 = $author$project$LangUtils$printStrNoQuoOrHole(c);
									var str1 = _v11.a;
									var ctx1 = _v11.b;
									return _Utils_Tuple2(
										_Utils_ap(str1, str2),
										_Utils_ap(ctx1, ctx2));
								} else {
									break _v6$4;
								}
							case 'VNil':
								if (c.a === 1) {
									var _v12 = $author$project$LangUtils$printChilds(cs);
									var str2 = _v12.a;
									var ctx2 = _v12.b;
									return _Utils_Tuple2(str2, ctx2);
								} else {
									break _v6$4;
								}
							default:
								break _v6$4;
						}
					}
					return _Utils_Tuple2('Child Type Error.', _List_Nil);
				} else {
					break _v5$2;
				}
			default:
				break _v5$2;
		}
	}
	return _Utils_Tuple2('Print Childs Error.', _List_Nil);
};
var $author$project$LangUtils$printHTML = F4(
	function (nodeName, style, attr, childs) {
		var _v1 = $author$project$LangUtils$printStyle(style);
		var ststr = _v1.a;
		var stctx = _v1.b;
		var st = function () {
			_v4$2:
			while (true) {
				switch (style.$) {
					case 'VHole':
						return 'Print Style Error: 01.';
					case 'VNil':
						if (!style.a) {
							return '';
						} else {
							break _v4$2;
						}
					default:
						break _v4$2;
				}
			}
			return ' style=\"' + (ststr + '\"');
		}();
		var _v2 = $author$project$LangUtils$printChilds(childs);
		var cd = _v2.a;
		var cdctx = _v2.b;
		var _v3 = $author$project$LangUtils$printAttr(attr);
		var at = _v3.a;
		var atctx = _v3.b;
		return _Utils_Tuple2(
			'<' + (nodeName + (st + (' ' + ('contenteditable=\"true\" ' + (at + ('>' + (cd + ('</' + (nodeName + '>'))))))))),
			_Utils_ap(
				stctx,
				_Utils_ap(atctx, cdctx)));
	});
var $author$project$LangUtils$printList = F2(
	function (v, vs) {
		_v0$2:
		while (true) {
			switch (vs.$) {
				case 'VNil':
					if (!vs.a) {
						return $author$project$LangUtils$print(v).a + ' ]';
					} else {
						break _v0$2;
					}
				case 'VCons':
					var v1 = vs.b;
					var v2 = vs.c;
					return $author$project$LangUtils$print(v).a + (', ' + A2($author$project$LangUtils$printList, v1, v2));
				default:
					break _v0$2;
			}
		}
		return '';
	});
var $elm$core$String$toFloat = _String_toFloat;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $myrho$elm_round$Round$funNum = F3(
	function (fun, s, fl) {
		return A2(
			$elm$core$Maybe$withDefault,
			0 / 0,
			$elm$core$String$toFloat(
				A2(fun, s, fl)));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			$elm$core$List$any,
			function (c) {
				return (!_Utils_eq(
					c,
					_Utils_chr('0'))) && (!_Utils_eq(
					c,
					_Utils_chr('.')));
			},
			$elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Char$fromCode = _Char_fromCode;
var $myrho$elm_round$Round$increaseNum = function (_v0) {
	var head = _v0.a;
	var tail = _v0.b;
	if (_Utils_eq(
		head,
		_Utils_chr('9'))) {
		var _v1 = $elm$core$String$uncons(tail);
		if (_v1.$ === 'Nothing') {
			return '01';
		} else {
			var headtail = _v1.a;
			return A2(
				$elm$core$String$cons,
				_Utils_chr('0'),
				$myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = $elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			$elm$core$String$cons,
			$elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$String$reverse = _String_reverse;
var $myrho$elm_round$Round$splitComma = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if (_v0.b) {
		if (_v0.b.b) {
			var before = _v0.a;
			var _v1 = _v0.b;
			var after = _v1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _v0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $myrho$elm_round$Round$toDecimal = function (fl) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(
			$elm$core$Basics$abs(fl)));
	if (_v0.b) {
		if (_v0.b.b) {
			var num = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var e = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(
					A2($elm$core$String$startsWith, '+', exp) ? A2($elm$core$String$dropLeft, 1, exp) : exp));
			var _v2 = $myrho$elm_round$Round$splitComma(num);
			var before = _v2.a;
			var after = _v2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				$elm$core$Maybe$withDefault,
				'0',
				A2(
					$elm$core$Maybe$map,
					function (_v3) {
						var a = _v3.a;
						var b = _v3.b;
						return a + ('.' + b);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$String$fromChar),
						$elm$core$String$uncons(
							_Utils_ap(
								A2(
									$elm$core$String$repeat,
									$elm$core$Basics$abs(e),
									'0'),
								total))))) : A3(
				$elm$core$String$padRight,
				e + 1,
				_Utils_chr('0'),
				total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _v0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var $myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if ($elm$core$Basics$isInfinite(fl) || $elm$core$Basics$isNaN(fl)) {
			return $elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _v0 = $myrho$elm_round$Round$splitComma(
				$myrho$elm_round$Round$toDecimal(
					$elm$core$Basics$abs(fl)));
			var before = _v0.a;
			var after = _v0.b;
			var r = $elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2($elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					$elm$core$String$padRight,
					r,
					_Utils_chr('0'),
					_Utils_ap(before, after)));
			var totalLen = $elm$core$String$length(normalized);
			var roundDigitIndex = A2($elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3($elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3($elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? $elm$core$String$reverse(
				A2(
					$elm$core$Maybe$withDefault,
					'1',
					A2(
						$elm$core$Maybe$map,
						$myrho$elm_round$Round$increaseNum,
						$elm$core$String$uncons(
							$elm$core$String$reverse(remains))))) : remains;
			var numLen = $elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					$elm$core$String$repeat,
					$elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				$elm$core$String$length(after)) < 0) ? (A3($elm$core$String$slice, 0, numLen - s, num) + ('.' + A3($elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3(
					$elm$core$String$padRight,
					s,
					_Utils_chr('0'),
					after))));
			return A2($myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var $myrho$elm_round$Round$roundCom = $myrho$elm_round$Round$roundFun(
	F2(
		function (_v0, _int) {
			return 53 <= $elm$core$Char$toCode(
				A2(
					$elm$core$Maybe$withDefault,
					_Utils_chr('0'),
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$first,
						$elm$core$String$uncons(_int))));
		}));
var $myrho$elm_round$Round$roundNumCom = $myrho$elm_round$Round$funNum($myrho$elm_round$Round$roundCom);
var $author$project$Eval$stringToVCons = function (lc) {
	if (!lc.b) {
		return $author$project$Syntax$VNil(1);
	} else {
		var c = lc.a;
		var cs = lc.b;
		return A3(
			$author$project$Syntax$VCons,
			1,
			$author$project$Syntax$VChar(c),
			$author$project$Eval$stringToVCons(cs));
	}
};
var $author$project$Syntax$tempHoleCount = $author$project$Syntax$HInter(0);
var $author$project$Syntax$voId = 0;
var $author$project$Syntax$vsId = 1;
var $author$project$Eval$eval = F4(
	function (henv, venv, expr, count) {
		_eval:
		while (true) {
			switch (expr.$) {
				case 'EVar':
					var s = expr.b;
					var _v1 = A2($author$project$LangUtils$findVarByName, s, venv);
					if (_v1.$ === 'Just') {
						var v = _v1.a;
						if (v.$ === 'VFix') {
							var e = v.a;
							var $temp$henv = henv,
								$temp$venv = venv,
								$temp$expr = A2($author$project$Syntax$EFix, $author$project$Syntax$defaultWS, e),
								$temp$count = count;
							henv = $temp$henv;
							venv = $temp$venv;
							expr = $temp$expr;
							count = $temp$count;
							continue _eval;
						} else {
							var val = v;
							return _Utils_Tuple2(val, count);
						}
					} else {
						return _Utils_Tuple2(
							$author$project$Syntax$VError('Variable Error: 01'),
							_List_Nil);
					}
				case 'ELam':
					var p = expr.b;
					var e = expr.c;
					return _Utils_Tuple2(
						A3($author$project$Syntax$VClosure, p, e, venv),
						count);
				case 'ELet':
					var p = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var $temp$henv = henv,
						$temp$venv = venv,
						$temp$expr = A3(
						$author$project$Syntax$EApp,
						$author$project$Syntax$defaultWS,
						A3($author$project$Syntax$ELam, $author$project$Syntax$defaultWS, p, e2),
						e1),
						$temp$count = count;
					henv = $temp$henv;
					venv = $temp$venv;
					expr = $temp$expr;
					count = $temp$count;
					continue _eval;
				case 'ELetrec':
					var p = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var $temp$henv = henv,
						$temp$venv = venv,
						$temp$expr = A3(
						$author$project$Syntax$EApp,
						$author$project$Syntax$defaultWS,
						A3($author$project$Syntax$ELam, $author$project$Syntax$defaultWS, p, e2),
						A2(
							$author$project$Syntax$EFix,
							$author$project$Syntax$defaultWS,
							A3($author$project$Syntax$ELam, $author$project$Syntax$defaultWS, p, e1))),
						$temp$count = count;
					henv = $temp$henv;
					venv = $temp$venv;
					expr = $temp$expr;
					count = $temp$count;
					continue _eval;
				case 'EApp':
					var e1 = expr.b;
					var e2 = expr.c;
					var _v3 = A4($author$project$Eval$eval, henv, venv, e1, count);
					if (_v3.a.$ === 'VClosure') {
						var _v4 = _v3.a;
						var p = _v4.a;
						var ef = _v4.b;
						var venvf = _v4.c;
						var count1 = _v3.b;
						if (e2.$ === 'EFix') {
							var e = e2.b;
							if (p.$ === 'PVar') {
								var s = p.b;
								var $temp$henv = henv,
									$temp$venv = A2(
									$elm$core$List$cons,
									_Utils_Tuple2(
										s,
										$author$project$Syntax$VFix(e)),
									venvf),
									$temp$expr = ef,
									$temp$count = count1;
								henv = $temp$henv;
								venv = $temp$venv;
								expr = $temp$expr;
								count = $temp$count;
								continue _eval;
							} else {
								return _Utils_Tuple2(
									$author$project$Syntax$VError('Recursion Error: 01'),
									_List_Nil);
							}
						} else {
							var _v7 = A4($author$project$Eval$eval, henv, venv, e2, count1);
							var v2 = _v7.a;
							var count2 = _v7.b;
							var venvm = A2($author$project$LangUtils$match, p, v2);
							if ((venvm.b && (venvm.a.b.$ === 'VError')) && (!venvm.b.b)) {
								var _v9 = venvm.a;
								var info = _v9.b.a;
								return _Utils_Tuple2(
									$author$project$Syntax$VError(info),
									_List_Nil);
							} else {
								var $temp$henv = henv,
									$temp$venv = _Utils_ap(venvm, venvf),
									$temp$expr = ef,
									$temp$count = count2;
								henv = $temp$henv;
								venv = $temp$venv;
								expr = $temp$expr;
								count = $temp$count;
								continue _eval;
							}
						}
					} else {
						return _Utils_Tuple2(
							$author$project$Syntax$VError('Function Error: 01'),
							_List_Nil);
					}
				case 'EInt':
					var n = expr.b;
					return _Utils_Tuple2(
						$author$project$Syntax$VInt(n),
						count);
				case 'EFloat':
					var n = expr.b;
					return _Utils_Tuple2(
						$author$project$Syntax$VFloat(n),
						count);
				case 'ETrue':
					return _Utils_Tuple2($author$project$Syntax$VTrue, count);
				case 'EFalse':
					return _Utils_Tuple2($author$project$Syntax$VFalse, count);
				case 'EChar':
					var c = expr.b;
					return _Utils_Tuple2(
						$author$project$Syntax$VChar(c),
						count);
				case 'ECons':
					var _v10 = expr.a;
					var id = _v10.b;
					var e1 = expr.b;
					var e2 = expr.c;
					var _v11 = A4($author$project$Eval$eval, henv, venv, e1, count);
					var v1 = _v11.a;
					var count1 = _v11.b;
					var _v12 = A4($author$project$Eval$eval, henv, venv, e2, count1);
					var v2 = _v12.a;
					var count2 = _v12.b;
					if (v2.$ === 'VHole') {
						var c = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count);
						return _Utils_Tuple2(
							A2(
								$author$project$Syntax$VHole,
								$author$project$Syntax$HInter(c + 1),
								venv),
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2($author$project$Syntax$tempHoleCount, c + 1),
								count));
					} else {
						return (_Utils_eq(id, $author$project$Syntax$esQuo) || _Utils_eq(id, $author$project$Syntax$esElm)) ? _Utils_Tuple2(
							A3($author$project$Syntax$VCons, $author$project$Syntax$vsId, v1, v2),
							count2) : _Utils_Tuple2(
							A3($author$project$Syntax$VCons, $author$project$Syntax$voId, v1, v2),
							count2);
					}
				case 'EBTuple':
					var e1 = expr.b;
					var e2 = expr.c;
					var _v14 = A4($author$project$Eval$eval, henv, venv, e1, count);
					var v1 = _v14.a;
					var count1 = _v14.b;
					var _v15 = A4($author$project$Eval$eval, henv, venv, e2, count1);
					var v2 = _v15.a;
					var count2 = _v15.b;
					return _Utils_Tuple2(
						A2($author$project$Syntax$VBTuple, v1, v2),
						count2);
				case 'ETTuple':
					var e1 = expr.b;
					var e2 = expr.c;
					var e3 = expr.d;
					var _v16 = A4($author$project$Eval$eval, henv, venv, e1, count);
					var v1 = _v16.a;
					var count1 = _v16.b;
					var _v17 = A4($author$project$Eval$eval, henv, venv, e2, count1);
					var v2 = _v17.a;
					var count2 = _v17.b;
					var _v18 = A4($author$project$Eval$eval, henv, venv, e3, count2);
					var v3 = _v18.a;
					var count3 = _v18.b;
					return _Utils_Tuple2(
						A3($author$project$Syntax$VTTuple, v1, v2, v3),
						count3);
				case 'ENil':
					var _v19 = expr.a;
					var id = _v19.b;
					return ((id === 3) || (id === 4)) ? _Utils_Tuple2(
						$author$project$Syntax$VNil(1),
						count) : _Utils_Tuple2(
						$author$project$Syntax$VNil(0),
						count);
				case 'EHole':
					var u = expr.b;
					var v = A3($author$project$Eval$findValue, u, venv, henv);
					if (v.$ === 'Nothing') {
						var n = A2($author$project$Eval$findCount, u, count);
						if (!n) {
							return _Utils_Tuple2(
								A2(
									$author$project$Syntax$VHole,
									A2($author$project$Syntax$HInst, u, 1),
									venv),
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2(u, 1),
									count));
						} else {
							return _Utils_Tuple2(
								A2(
									$author$project$Syntax$VHole,
									A2($author$project$Syntax$HInst, u, n + 1),
									venv),
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2(u, n + 1),
									count));
						}
					} else {
						var val = v.a;
						return _Utils_Tuple2(val, count);
					}
				case 'EUPrim':
					var op = expr.b;
					var e = expr.c;
					if (op.$ === 'Neg') {
						var _v23 = A4($author$project$Eval$eval, henv, venv, e, count);
						var v = _v23.a;
						var count1 = _v23.b;
						switch (v.$) {
							case 'VInt':
								var n = v.a;
								return _Utils_Tuple2(
									$author$project$Syntax$VInt(0 - n),
									count1);
							case 'VFloat':
								var n = v.a;
								return _Utils_Tuple2(
									$author$project$Syntax$VFloat(0 - n),
									count1);
							case 'VHole':
								var n = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count1);
								return _Utils_Tuple2(
									A2(
										$author$project$Syntax$VHole,
										$author$project$Syntax$HInter(n + 1),
										venv),
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2($author$project$Syntax$tempHoleCount, n + 1),
										count1));
							default:
								return _Utils_Tuple2(
									$author$project$Syntax$VError('Arithmetic Error: 01'),
									_List_Nil);
						}
					} else {
						var _v25 = A4($author$project$Eval$eval, henv, venv, e, count);
						var v = _v25.a;
						var count1 = _v25.b;
						switch (v.$) {
							case 'VTrue':
								return _Utils_Tuple2($author$project$Syntax$VFalse, count1);
							case 'VFalse':
								return _Utils_Tuple2($author$project$Syntax$VTrue, count1);
							case 'VHole':
								var n = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count1);
								return _Utils_Tuple2(
									A2(
										$author$project$Syntax$VHole,
										$author$project$Syntax$HInter(n + 1),
										venv),
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2($author$project$Syntax$tempHoleCount, n + 1),
										count1));
							default:
								return _Utils_Tuple2(
									$author$project$Syntax$VError('Logical Operation Error: 01'),
									_List_Nil);
						}
					}
				case 'EBPrim':
					var op = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var _v27 = A4($author$project$Eval$eval, henv, venv, e1, count);
					var v1 = _v27.a;
					var count1 = _v27.b;
					var _v28 = A4($author$project$Eval$eval, henv, venv, e2, count1);
					var v2 = _v28.a;
					var count2 = _v28.b;
					switch (v1.$) {
						case 'VInt':
							var n1 = v1.a;
							switch (v2.$) {
								case 'VInt':
									var n2 = v2.a;
									switch (op.$) {
										case 'Add':
											return _Utils_Tuple2(
												$author$project$Syntax$VInt(n1 + n2),
												count2);
										case 'Sub':
											return _Utils_Tuple2(
												$author$project$Syntax$VInt(n1 - n2),
												count2);
										case 'Mul':
											return _Utils_Tuple2(
												$author$project$Syntax$VInt(n1 * n2),
												count2);
										case 'Div':
											return _Utils_Tuple2(
												$author$project$Syntax$VInt((n1 / n2) | 0),
												count2);
										case 'DDiv':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(
													A2($myrho$elm_round$Round$roundNumCom, 2, n1 / n2)),
												count2);
										case 'Eq':
											return _Utils_Tuple2(
												$author$project$Eval$boolOp(
													_Utils_eq(n1, n2)),
												count2);
										case 'Lt':
											return _Utils_Tuple2(
												$author$project$Eval$boolOp(
													_Utils_cmp(n1, n2) < 0),
												count2);
										case 'Gt':
											return _Utils_Tuple2(
												$author$project$Eval$boolOp(
													_Utils_cmp(n1, n2) > 0),
												count2);
										case 'Le':
											return _Utils_Tuple2(
												$author$project$Eval$boolOp(
													_Utils_cmp(n1, n2) < 1),
												count2);
										case 'Ge':
											return _Utils_Tuple2(
												$author$project$Eval$boolOp(
													_Utils_cmp(n1, n2) > -1),
												count2);
										default:
											return _Utils_Tuple2(
												$author$project$Syntax$VError('Logical Operation Error: 02'),
												_List_Nil);
									}
								case 'VFloat':
									var n2 = v2.a;
									return _Utils_Tuple2(
										A3($author$project$Eval$floatOp, op, n1, n2),
										count2);
								case 'VHole':
									var n = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count2);
									return _Utils_Tuple2(
										A2(
											$author$project$Syntax$VHole,
											$author$project$Syntax$HInter(n + 1),
											venv),
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2($author$project$Syntax$tempHoleCount, n + 1),
											count2));
								default:
									return _Utils_Tuple2(
										$author$project$Syntax$VError('Operand Error: 01'),
										_List_Nil);
							}
						case 'VFloat':
							var n1 = v1.a;
							switch (v2.$) {
								case 'VInt':
									var n2 = v2.a;
									return _Utils_Tuple2(
										A3($author$project$Eval$floatOp, op, n1, n2),
										count2);
								case 'VFloat':
									var n2 = v2.a;
									return _Utils_Tuple2(
										A3($author$project$Eval$floatOp, op, n1, n2),
										count2);
								case 'VHole':
									var n = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count2);
									return _Utils_Tuple2(
										A2(
											$author$project$Syntax$VHole,
											$author$project$Syntax$HInter(n + 1),
											venv),
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2($author$project$Syntax$tempHoleCount, n + 1),
											count2));
								default:
									return _Utils_Tuple2(
										$author$project$Syntax$VError('Operand Error: 02'),
										_List_Nil);
							}
						case 'VTrue':
							switch (v2.$) {
								case 'VTrue':
									switch (op.$) {
										case 'And':
											return _Utils_Tuple2($author$project$Syntax$VTrue, count2);
										case 'Or':
											return _Utils_Tuple2($author$project$Syntax$VTrue, count2);
										default:
											return _Utils_Tuple2(
												$author$project$Syntax$VError('Arithmetic Error: 02'),
												_List_Nil);
									}
								case 'VFalse':
									switch (op.$) {
										case 'And':
											return _Utils_Tuple2($author$project$Syntax$VFalse, count2);
										case 'Or':
											return _Utils_Tuple2($author$project$Syntax$VTrue, count2);
										default:
											return _Utils_Tuple2(
												$author$project$Syntax$VError('Arithmetic Error: 03'),
												_List_Nil);
									}
								case 'VHole':
									var n = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count2);
									return _Utils_Tuple2(
										A2(
											$author$project$Syntax$VHole,
											$author$project$Syntax$HInter(n + 1),
											venv),
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2($author$project$Syntax$tempHoleCount, n + 1),
											count2));
								default:
									return _Utils_Tuple2(
										$author$project$Syntax$VError('Operand Error: 03'),
										_List_Nil);
							}
						case 'VFalse':
							switch (v2.$) {
								case 'VTrue':
									switch (op.$) {
										case 'And':
											return _Utils_Tuple2($author$project$Syntax$VFalse, count2);
										case 'Or':
											return _Utils_Tuple2($author$project$Syntax$VTrue, count2);
										default:
											return _Utils_Tuple2(
												$author$project$Syntax$VError('Arithmetic Error: 04'),
												_List_Nil);
									}
								case 'VFalse':
									switch (op.$) {
										case 'And':
											return _Utils_Tuple2($author$project$Syntax$VFalse, count2);
										case 'Or':
											return _Utils_Tuple2($author$project$Syntax$VFalse, count2);
										default:
											return _Utils_Tuple2(
												$author$project$Syntax$VError('Arithmetic Error: 05'),
												_List_Nil);
									}
								case 'VHole':
									var n = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count2);
									return _Utils_Tuple2(
										A2(
											$author$project$Syntax$VHole,
											$author$project$Syntax$HInter(n + 1),
											venv),
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2($author$project$Syntax$tempHoleCount, n + 1),
											count2));
								default:
									return _Utils_Tuple2(
										$author$project$Syntax$VError('Operand Error: 04'),
										_List_Nil);
							}
						case 'VCons':
							switch (v2.$) {
								case 'VCons':
									return _Utils_eq(op, $author$project$Syntax$Cat) ? _Utils_Tuple2(
										A2($author$project$LangUtils$append, v1, v2),
										count2) : _Utils_Tuple2(
										$author$project$Syntax$VError('Operand Error: 06'),
										_List_Nil);
								case 'VNil':
									return _Utils_Tuple2(
										A2($author$project$LangUtils$append, v1, v2),
										count2);
								case 'VHole':
									var n = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count2);
									return _Utils_Tuple2(
										A2(
											$author$project$Syntax$VHole,
											$author$project$Syntax$HInter(n + 1),
											venv),
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2($author$project$Syntax$tempHoleCount, n + 1),
											count2));
								default:
									return _Utils_Tuple2(
										$author$project$Syntax$VError('Operand Error: 07'),
										_List_Nil);
							}
						case 'VNil':
							switch (v2.$) {
								case 'VCons':
									return _Utils_eq(op, $author$project$Syntax$Cat) ? _Utils_Tuple2(
										A2($author$project$LangUtils$append, v1, v2),
										count2) : _Utils_Tuple2(
										$author$project$Syntax$VError('Operand Error: 08'),
										_List_Nil);
								case 'VNil':
									return _Utils_Tuple2(
										A2($author$project$LangUtils$append, v1, v2),
										count2);
								case 'VHole':
									var n = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count2);
									return _Utils_Tuple2(
										A2(
											$author$project$Syntax$VHole,
											$author$project$Syntax$HInter(n + 1),
											venv),
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2($author$project$Syntax$tempHoleCount, n + 1),
											count2));
								default:
									return _Utils_Tuple2(
										$author$project$Syntax$VError('Operand Error: 09'),
										_List_Nil);
							}
						case 'VHole':
							var n = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count1);
							return _Utils_Tuple2(
								A2(
									$author$project$Syntax$VHole,
									$author$project$Syntax$HInter(n + 1),
									venv),
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2($author$project$Syntax$tempHoleCount, n + 1),
									count1));
						default:
							return _Utils_Tuple2(
								$author$project$Syntax$VError('Operand Error: 05'),
								_List_Nil);
					}
				case 'ECase':
					if (expr.b.$ === 'EVar') {
						var _v41 = expr.b;
						var s = _v41.b;
						var branch = expr.c;
						var _v42 = A2($author$project$LangUtils$findVarByName, s, venv);
						if (_v42.$ === 'Just') {
							var v = _v42.a;
							if (v.$ === 'VHole') {
								var c = A2($author$project$Eval$findCount, $author$project$Syntax$tempHoleCount, count);
								return _Utils_Tuple2(
									A2(
										$author$project$Syntax$VHole,
										$author$project$Syntax$HInter(c + 1),
										venv),
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2($author$project$Syntax$tempHoleCount, c + 1),
										count));
							} else {
								var val = v;
								var res = A2($author$project$LangUtils$matchCase, val, branch);
								var _v44 = res.venvm;
								if ((_v44.b && (_v44.a.b.$ === 'VError')) && (!_v44.b.b)) {
									var _v45 = _v44.a;
									var info = _v45.b.a;
									return _Utils_Tuple2(
										$author$project$Syntax$VError(info),
										_List_Nil);
								} else {
									var $temp$henv = henv,
										$temp$venv = _Utils_ap(res.venvm, venv),
										$temp$expr = res.ei,
										$temp$count = count;
									henv = $temp$henv;
									venv = $temp$venv;
									expr = $temp$expr;
									count = $temp$count;
									continue _eval;
								}
							}
						} else {
							return _Utils_Tuple2(
								$author$project$Syntax$VError('Variable Error: 02'),
								_List_Nil);
						}
					} else {
						return _Utils_Tuple2(
							$author$project$Syntax$VError('Something Wrong!'),
							_List_Nil);
					}
				case 'EFix':
					var e = expr.b;
					var $temp$henv = henv,
						$temp$venv = venv,
						$temp$expr = A3(
						$author$project$Syntax$EApp,
						$author$project$Syntax$defaultWS,
						e,
						A2($author$project$Syntax$EFix, $author$project$Syntax$defaultWS, e)),
						$temp$count = count;
					henv = $temp$henv;
					venv = $temp$venv;
					expr = $temp$expr;
					count = $temp$count;
					continue _eval;
				case 'EParens':
					var e = expr.b;
					var $temp$henv = henv,
						$temp$venv = venv,
						$temp$expr = e,
						$temp$count = count;
					henv = $temp$henv;
					venv = $temp$venv;
					expr = $temp$expr;
					count = $temp$count;
					continue _eval;
				case 'EHtml':
					var s = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var e3 = expr.e;
					var _v46 = A4($author$project$Eval$eval, henv, venv, e1, count);
					var v1 = _v46.a;
					var count1 = _v46.b;
					var _v47 = A4($author$project$Eval$eval, henv, venv, e2, count1);
					var v2 = _v47.a;
					var count2 = _v47.b;
					var _v48 = A4($author$project$Eval$eval, henv, venv, e3, count2);
					var v3 = _v48.a;
					var count3 = _v48.b;
					return _Utils_Tuple2(
						A4($author$project$Syntax$VHtml, s, v1, v2, v3),
						count3);
				case 'EToStr':
					var e = expr.b;
					var _v49 = A4($author$project$Eval$eval, henv, venv, e, count);
					var v1 = _v49.a;
					var count1 = _v49.b;
					var sv = $author$project$LangUtils$print(v1).a;
					return _Utils_Tuple2(
						$author$project$Eval$stringToVCons(
							$elm$core$String$toList(sv)),
						count1);
				default:
					var info = expr.a;
					return _Utils_Tuple2(
						$author$project$Syntax$VError(info),
						_List_Nil);
			}
		}
	});
var $author$project$Syntax$holeAddedByUserStart = 100;
var $author$project$Syntax$holeIDStart = 1;
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Utils$nth = F2(
	function (n, ls) {
		nth:
		while (true) {
			if (!n) {
				return $elm$core$List$head(ls);
			} else {
				var _v1 = $elm$core$List$tail(ls);
				if (_v1.$ === 'Just') {
					var ls_ = _v1.a;
					var $temp$n = n - 1,
						$temp$ls = ls_;
					n = $temp$n;
					ls = $temp$ls;
					continue nth;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$parser$Parser$ExpectingEnd = {$: 'ExpectingEnd'};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return _Utils_eq(
				$elm$core$String$length(s.src),
				s.offset) ? A3($elm$parser$Parser$Advanced$Good, false, _Utils_Tuple0, s) : A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $author$project$Syntax$BSin = F3(
	function (a, b, c) {
		return {$: 'BSin', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Done = function (a) {
	return {$: 'Done', a: a};
};
var $author$project$Syntax$EBTuple = F3(
	function (a, b, c) {
		return {$: 'EBTuple', a: a, b: b, c: c};
	});
var $author$project$Syntax$ECons = F3(
	function (a, b, c) {
		return {$: 'ECons', a: a, b: b, c: c};
	});
var $author$project$Syntax$EHtml = F5(
	function (a, b, c, d, e) {
		return {$: 'EHtml', a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Syntax$ELet = F4(
	function (a, b, c, d) {
		return {$: 'ELet', a: a, b: b, c: c, d: d};
	});
var $author$project$Syntax$ELetrec = F4(
	function (a, b, c, d) {
		return {$: 'ELetrec', a: a, b: b, c: c, d: d};
	});
var $author$project$Syntax$EParens = F2(
	function (a, b) {
		return {$: 'EParens', a: a, b: b};
	});
var $author$project$Syntax$ETTuple = F4(
	function (a, b, c, d) {
		return {$: 'ETTuple', a: a, b: b, c: c, d: d};
	});
var $author$project$Syntax$EToStr = F2(
	function (a, b) {
		return {$: 'EToStr', a: a, b: b};
	});
var $elm$parser$Parser$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0.a;
	return $elm$parser$Parser$Advanced$Parser(
		function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Bad') {
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, false, x);
			} else {
				var a = _v1.b;
				var s1 = _v1.c;
				return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
			}
		});
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $Punie$elm_parser_extras$Parser$Expression$AssocRight = {$: 'AssocRight'};
var $author$project$Syntax$BCom = F3(
	function (a, b, c) {
		return {$: 'BCom', a: a, b: b, c: c};
	});
var $Punie$elm_parser_extras$Parser$Expression$Infix = F2(
	function (a, b) {
		return {$: 'Infix', a: a, b: b};
	});
var $author$project$Syntax$defaultId = 0;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						A2(
							func,
							A3($elm$core$String$slice, s0.offset, s1.offset, s0.src),
							a),
						s1);
				}
			});
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $author$project$Parser_$isWhiteSpace = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr(' ')) || (_Utils_eq(
		c,
		_Utils_chr('\n')) || _Utils_eq(
		c,
		_Utils_chr('\r')));
};
var $author$project$Parser_$mSpaces = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompWhile($author$project$Parser_$isWhiteSpace));
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$not = _Basics_not;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $author$project$Parser_$branchOp = _List_fromArray(
	[
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						function (s) {
							return $author$project$Syntax$BCom(
								_Utils_Tuple2(
									_List_fromArray(
										[s]),
									$author$project$Syntax$defaultId));
						}),
					$elm$parser$Parser$symbol('|')),
				$author$project$Parser_$mSpaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		])
	]);
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parseA(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					var _v2 = callback(a);
					var parseB = _v2.a;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
					}
				}
			});
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $Punie$elm_parser_extras$Parser$Expression$initOps = {lassoc: _List_Nil, nassoc: _List_Nil, postfix: _List_Nil, prefix: _List_Nil, rassoc: _List_Nil};
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$parser$Parser$Problem = function (a) {
	return {$: 'Problem', a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $Punie$elm_parser_extras$Parser$Expression$splitOp = F2(
	function (operator, ops) {
		var rassoc = ops.rassoc;
		var lassoc = ops.lassoc;
		var nassoc = ops.nassoc;
		var prefix = ops.prefix;
		var postfix = ops.postfix;
		switch (operator.$) {
			case 'Infix':
				switch (operator.b.$) {
					case 'AssocNone':
						var op = operator.a;
						var _v1 = operator.b;
						return _Utils_update(
							ops,
							{
								nassoc: A2($elm$core$List$cons, op, ops.nassoc)
							});
					case 'AssocLeft':
						var op = operator.a;
						var _v2 = operator.b;
						return _Utils_update(
							ops,
							{
								lassoc: A2($elm$core$List$cons, op, ops.lassoc)
							});
					default:
						var op = operator.a;
						var _v3 = operator.b;
						return _Utils_update(
							ops,
							{
								rassoc: A2($elm$core$List$cons, op, ops.rassoc)
							});
				}
			case 'Prefix':
				var op = operator.a;
				return _Utils_update(
					ops,
					{
						prefix: A2($elm$core$List$cons, op, ops.prefix)
					});
			default:
				var op = operator.a;
				return _Utils_update(
					ops,
					{
						postfix: A2($elm$core$List$cons, op, ops.postfix)
					});
		}
	});
var $Punie$elm_parser_extras$Parser$Expression$makeParser = F2(
	function (ops, term) {
		var ambiguous = F2(
			function (assoc, op) {
				return $elm$parser$Parser$backtrackable(
					A2(
						$elm$parser$Parser$andThen,
						function (_v3) {
							return $elm$parser$Parser$problem('ambiguous use of a ' + (assoc + ' associative operator'));
						},
						op));
			});
		var _v0 = A3($elm$core$List$foldr, $Punie$elm_parser_extras$Parser$Expression$splitOp, $Punie$elm_parser_extras$Parser$Expression$initOps, ops);
		var rassoc = _v0.rassoc;
		var lassoc = _v0.lassoc;
		var nassoc = _v0.nassoc;
		var prefix = _v0.prefix;
		var postfix = _v0.postfix;
		var lassocOp = $elm$parser$Parser$oneOf(lassoc);
		var ambiguousLeft = A2(ambiguous, 'left', lassocOp);
		var nassocOp = $elm$parser$Parser$oneOf(nassoc);
		var ambiguousNon = A2(ambiguous, 'non', nassocOp);
		var postfixOp = $elm$parser$Parser$oneOf(postfix);
		var postfixP = $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					postfixOp,
					$elm$parser$Parser$succeed($elm$core$Basics$identity)
				]));
		var prefixOp = $elm$parser$Parser$oneOf(prefix);
		var prefixP = $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					prefixOp,
					$elm$parser$Parser$succeed($elm$core$Basics$identity)
				]));
		var termP = A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					$elm$parser$Parser$succeed(
						F3(
							function (pre, x, post) {
								return post(
									pre(x));
							})),
					prefixP),
				term),
			postfixP);
		var rassocOp = $elm$parser$Parser$oneOf(rassoc);
		var ambiguousRight = A2(ambiguous, 'right', rassocOp);
		var lassocP = function (x) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$andThen,
						function (_v2) {
							var f = _v2.a;
							var y = _v2.b;
							return lassocP1(
								A2(f, x, y));
						},
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								$elm$parser$Parser$succeed($elm$core$Tuple$pair),
								lassocOp),
							termP)),
						ambiguousRight,
						ambiguousNon
					]));
		};
		var lassocP1 = function (x) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						lassocP(x),
						$elm$parser$Parser$succeed(x)
					]));
		};
		var nassocP = function (x) {
			return A2(
				$elm$parser$Parser$andThen,
				function (_v1) {
					var f = _v1.a;
					var y = _v1.b;
					return $elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								ambiguousRight,
								ambiguousLeft,
								ambiguousNon,
								$elm$parser$Parser$succeed(
								A2(f, x, y))
							]));
				},
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed($elm$core$Tuple$pair),
						nassocOp),
					termP));
		};
		var rassocP = function (x) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed(
								F2(
									function (f, y) {
										return A2(f, x, y);
									})),
							rassocOp),
						A2($elm$parser$Parser$andThen, rassocP1, termP)),
						ambiguousLeft,
						ambiguousNon
					]));
		};
		var rassocP1 = function (x) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						rassocP(x),
						$elm$parser$Parser$succeed(x)
					]));
		};
		return A2(
			$elm$parser$Parser$andThen,
			function (x) {
				return $elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							rassocP(x),
							lassocP(x),
							nassocP(x),
							$elm$parser$Parser$succeed(x)
						]));
			},
			termP);
	});
var $Punie$elm_parser_extras$Parser$Expression$buildExpressionParser = F2(
	function (operators, simpleExpr) {
		return A3($elm$core$List$foldl, $Punie$elm_parser_extras$Parser$Expression$makeParser, simpleExpr, operators);
	});
var $author$project$Syntax$caseId = 1;
var $author$project$Syntax$ECase = F3(
	function (a, b, c) {
		return {$: 'ECase', a: a, b: b, c: c};
	});
var $author$project$Syntax$EVar = F2(
	function (a, b) {
		return {$: 'EVar', a: a, b: b};
	});
var $author$project$Syntax$PVar = F2(
	function (a, b) {
		return {$: 'PVar', a: a, b: b};
	});
var $author$project$Syntax$caseN = '$CASE$';
var $author$project$Parser_$caseToApp = F3(
	function (e, b, ws) {
		return A3(
			$author$project$Syntax$EApp,
			ws,
			A3(
				$author$project$Syntax$ELam,
				$author$project$Syntax$defaultWS,
				A2($author$project$Syntax$PVar, $author$project$Syntax$defaultWS, $author$project$Syntax$caseN),
				A3(
					$author$project$Syntax$ECase,
					$author$project$Syntax$defaultWS,
					A2($author$project$Syntax$EVar, $author$project$Syntax$defaultWS, $author$project$Syntax$caseN),
					b)),
			e);
	});
var $author$project$Syntax$EChar = F2(
	function (a, b) {
		return {$: 'EChar', a: a, b: b};
	});
var $author$project$Parser_$charhelper = function (s) {
	var _v0 = $elm$core$List$head(
		$elm$core$String$toList(s));
	if (_v0.$ === 'Just') {
		var c = _v0.a;
		return c;
	} else {
		return _Utils_chr(' ');
	}
};
var $elm$parser$Parser$UnexpectedChar = {$: 'UnexpectedChar'};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.offset, s.src);
				return _Utils_eq(newOffset, -1) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: 1, context: s.context, indent: s.indent, offset: s.offset + 1, row: s.row + 1, src: s.src}) : A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: s.col + 1, context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src}));
			});
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						func(a),
						s1);
				} else {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				}
			});
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $author$project$Parser_$char_ = A2(
	$elm$parser$Parser$map,
	$author$project$Parser_$charhelper,
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompIf(
			function (_v0) {
				return true;
			})));
var $author$project$Parser_$char = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (c, s) {
						return A2(
							$author$project$Syntax$EChar,
							_Utils_Tuple2(
								_List_fromArray(
									[s]),
								$author$project$Syntax$defaultId),
							c);
					})),
			$elm$parser$Parser$symbol('\'')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser_$char_,
			$elm$parser$Parser$symbol('\''))),
	$author$project$Parser_$mSpaces);
var $author$project$Syntax$eoElm = 1;
var $author$project$Syntax$eoSquare = 0;
var $author$project$Syntax$ENil = function (a) {
	return {$: 'ENil', a: a};
};
var $author$project$Parser_$exprListToECons = function (ls) {
	if (!ls.b) {
		return $author$project$Syntax$ENil(
			_Utils_Tuple2(_List_Nil, $author$project$Syntax$eoElm));
	} else {
		var _v1 = ls.a;
		var e = _v1.a;
		var s = _v1.b;
		var es = ls.b;
		return A3(
			$author$project$Syntax$ECons,
			s,
			e,
			$author$project$Parser_$exprListToECons(es));
	}
};
var $author$project$Syntax$EFalse = function (a) {
	return {$: 'EFalse', a: a};
};
var $elm$parser$Parser$ExpectingKeyword = function (a) {
	return {$: 'ExpectingKeyword', a: a};
};
var $elm$parser$Parser$Advanced$keyword = function (_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(kwd);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, kwd, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return (_Utils_eq(newOffset, -1) || (0 <= A3(
				$elm$parser$Parser$Advanced$isSubChar,
				function (c) {
					return $elm$core$Char$isAlphaNum(c) || _Utils_eq(
						c,
						_Utils_chr('_'));
				},
				newOffset,
				s.src))) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$keyword = function (kwd) {
	return $elm$parser$Parser$Advanced$keyword(
		A2(
			$elm$parser$Parser$Advanced$Token,
			kwd,
			$elm$parser$Parser$ExpectingKeyword(kwd)));
};
var $author$project$Parser_$false = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (s) {
				return $author$project$Syntax$EFalse(
					_Utils_Tuple2(
						_List_fromArray(
							[s]),
						$author$project$Syntax$defaultId));
			}),
		$elm$parser$Parser$keyword('false')),
	$author$project$Parser_$mSpaces);
var $author$project$Parser_$flip = F3(
	function (f, x, y) {
		return A2(f, y, x);
	});
var $author$project$Syntax$EFloat = F2(
	function (a, b) {
		return {$: 'EFloat', a: a, b: b};
	});
var $elm$parser$Parser$ExpectingBinary = {$: 'ExpectingBinary'};
var $elm$parser$Parser$ExpectingFloat = {$: 'ExpectingFloat'};
var $elm$parser$Parser$ExpectingHex = {$: 'ExpectingHex'};
var $elm$parser$Parser$ExpectingInt = {$: 'ExpectingInt'};
var $elm$parser$Parser$ExpectingNumber = {$: 'ExpectingNumber'};
var $elm$parser$Parser$ExpectingOctal = {$: 'ExpectingOctal'};
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (maybe.$ === 'Just') {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {col: s.col + (newOffset - s.offset), context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src};
	});
var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var $elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			$elm$parser$Parser$Advanced$consumeExp,
			A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var $elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _v0, s) {
		var endOffset = _v0.a;
		var n = _v0.b;
		if (handler.$ === 'Err') {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.offset, startOffset) < 0,
				A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.src);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.row, s.col - (floatOffset + s.offset), invalid, s.context));
		} else {
			if (_Utils_eq(s.offset, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.offset, intPair, s);
				} else {
					if (floatSettings.$ === 'Err') {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.offset, floatOffset, s.src));
						if (_v1.$ === 'Nothing') {
							return A2(
								$elm$parser$Parser$Advanced$Bad,
								true,
								A2($elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _v1.a;
							return A3(
								$elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$number = function (c) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.offset, s.src)) {
				var zeroOffset = s.offset + 1;
				var baseOffset = zeroOffset + 1;
				return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.hex,
					baseOffset,
					A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.src),
					s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.octal,
					baseOffset,
					A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.src),
					s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.binary,
					baseOffset,
					A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.src),
					s) : A6(
					$elm$parser$Parser$Advanced$finalizeFloat,
					c.invalid,
					c.expecting,
					c._int,
					c._float,
					_Utils_Tuple2(zeroOffset, 0),
					s)));
			} else {
				return A6(
					$elm$parser$Parser$Advanced$finalizeFloat,
					c.invalid,
					c.expecting,
					c._int,
					c._float,
					A3($elm$parser$Parser$Advanced$consumeBase, 10, s.offset, s.src),
					s);
			}
		});
};
var $elm$parser$Parser$number = function (i) {
	return $elm$parser$Parser$Advanced$number(
		{
			binary: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingBinary, i.binary),
			expecting: $elm$parser$Parser$ExpectingNumber,
			_float: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingFloat, i._float),
			hex: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingHex, i.hex),
			_int: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingInt, i._int),
			invalid: $elm$parser$Parser$ExpectingNumber,
			octal: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingOctal, i.octal)
		});
};
var $author$project$Parser_$float_ = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (n, s) {
					return A2(
						$author$project$Syntax$EFloat,
						_Utils_Tuple2(
							_List_fromArray(
								[s]),
							$author$project$Syntax$defaultId),
						n);
				})),
		$elm$parser$Parser$number(
			{
				binary: $elm$core$Maybe$Nothing,
				_float: $elm$core$Maybe$Just($elm$core$Basics$identity),
				hex: $elm$core$Maybe$Nothing,
				_int: $elm$core$Maybe$Nothing,
				octal: $elm$core$Maybe$Nothing
			})),
	$author$project$Parser_$mSpaces);
var $author$project$Syntax$EHole = F2(
	function (a, b) {
		return {$: 'EHole', a: a, b: b};
	});
var $author$project$Parser_$hole = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (s) {
				return A2(
					$author$project$Syntax$EHole,
					_Utils_Tuple2(
						_List_fromArray(
							[s]),
						$author$project$Syntax$defaultId),
					$author$project$Syntax$HInter(0));
			}),
		$elm$parser$Parser$keyword('_')),
	$author$project$Parser_$mSpaces);
var $author$project$Syntax$EInt = F2(
	function (a, b) {
		return {$: 'EInt', a: a, b: b};
	});
var $author$project$Parser_$int_ = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (n, s) {
					return A2(
						$author$project$Syntax$EInt,
						_Utils_Tuple2(
							_List_fromArray(
								[s]),
							$author$project$Syntax$defaultId),
						n);
				})),
		$elm$parser$Parser$number(
			{
				binary: $elm$core$Maybe$Just($elm$core$Basics$identity),
				_float: $elm$core$Maybe$Nothing,
				hex: $elm$core$Maybe$Just($elm$core$Basics$identity),
				_int: $elm$core$Maybe$Just($elm$core$Basics$identity),
				octal: $elm$core$Maybe$Just($elm$core$Basics$identity)
			})),
	$author$project$Parser_$mSpaces);
var $author$project$Syntax$PFalse = function (a) {
	return {$: 'PFalse', a: a};
};
var $author$project$Syntax$PTrue = function (a) {
	return {$: 'PTrue', a: a};
};
var $author$project$Syntax$ifId = 2;
var $author$project$Parser_$iteToApp = F5(
	function (e1, e2, e3, s1, wsList) {
		return A3(
			$author$project$Syntax$EApp,
			_Utils_Tuple2(
				_List_fromArray(
					[s1]),
				$author$project$Syntax$ifId),
			A3(
				$author$project$Syntax$ELam,
				$author$project$Syntax$defaultWS,
				A2($author$project$Syntax$PVar, $author$project$Syntax$defaultWS, $author$project$Syntax$caseN),
				A3(
					$author$project$Syntax$ECase,
					_Utils_Tuple2(wsList, 1),
					A2($author$project$Syntax$EVar, $author$project$Syntax$defaultWS, $author$project$Syntax$caseN),
					A3(
						$author$project$Syntax$BCom,
						$author$project$Syntax$defaultWS,
						A3(
							$author$project$Syntax$BSin,
							$author$project$Syntax$defaultWS,
							$author$project$Syntax$PTrue($author$project$Syntax$defaultWS),
							e2),
						A3(
							$author$project$Syntax$BSin,
							$author$project$Syntax$defaultWS,
							$author$project$Syntax$PFalse($author$project$Syntax$defaultWS),
							e3)))),
			e1);
	});
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v0 = thunk(_Utils_Tuple0);
			var parse = _v0.a;
			return parse(s);
		});
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0.a;
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (step.$ === 'Loop') {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
			});
	});
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (step.$ === 'Loop') {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $author$project$Syntax$eoAddFromEmp = 5;
var $author$project$Parser_$nil = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (s1, s2) {
						return $author$project$Syntax$ENil(
							_Utils_Tuple2(
								_List_fromArray(
									[s1, s2]),
								$author$project$Syntax$eoAddFromEmp));
					})),
			$elm$parser$Parser$symbol('[')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser_$mSpaces,
			$elm$parser$Parser$symbol(']'))),
	$author$project$Parser_$mSpaces);
var $author$project$Syntax$Add = {$: 'Add'};
var $author$project$Syntax$And = {$: 'And'};
var $Punie$elm_parser_extras$Parser$Expression$AssocLeft = {$: 'AssocLeft'};
var $Punie$elm_parser_extras$Parser$Expression$AssocNone = {$: 'AssocNone'};
var $author$project$Syntax$DDiv = {$: 'DDiv'};
var $author$project$Syntax$Div = {$: 'Div'};
var $author$project$Syntax$Eq = {$: 'Eq'};
var $author$project$Syntax$Ge = {$: 'Ge'};
var $author$project$Syntax$Gt = {$: 'Gt'};
var $author$project$Syntax$Le = {$: 'Le'};
var $author$project$Syntax$Lt = {$: 'Lt'};
var $author$project$Syntax$Mul = {$: 'Mul'};
var $author$project$Syntax$Neg = {$: 'Neg'};
var $author$project$Syntax$Not = {$: 'Not'};
var $author$project$Syntax$Or = {$: 'Or'};
var $Punie$elm_parser_extras$Parser$Expression$Prefix = function (a) {
	return {$: 'Prefix', a: a};
};
var $author$project$Syntax$Sub = {$: 'Sub'};
var $author$project$Syntax$EBPrim = F4(
	function (a, b, c, d) {
		return {$: 'EBPrim', a: a, b: b, c: c, d: d};
	});
var $author$project$Parser_$bopParser = F2(
	function (s, op) {
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (ws) {
						return A2(
							$author$project$Syntax$EBPrim,
							_Utils_Tuple2(
								_List_fromArray(
									[ws]),
								$author$project$Syntax$defaultId),
							op);
					}),
				$elm$parser$Parser$symbol(s)),
			$author$project$Parser_$mSpaces);
	});
var $author$project$Syntax$eoCons = 2;
var $author$project$Parser_$cons = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (s) {
				return $author$project$Syntax$ECons(
					_Utils_Tuple2(
						_List_fromArray(
							[s]),
						$author$project$Syntax$eoCons));
			}),
		$elm$parser$Parser$symbol('::')),
	$author$project$Parser_$mSpaces);
var $author$project$Syntax$EUPrim = F3(
	function (a, b, c) {
		return {$: 'EUPrim', a: a, b: b, c: c};
	});
var $author$project$Parser_$uopParser = F2(
	function (s, op) {
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (ws) {
						return A2(
							$author$project$Syntax$EUPrim,
							_Utils_Tuple2(
								_List_fromArray(
									[ws]),
								$author$project$Syntax$defaultId),
							op);
					}),
				$elm$parser$Parser$symbol(s)),
			$author$project$Parser_$mSpaces);
	});
var $author$project$Parser_$operators = _List_fromArray(
	[
		_List_fromArray(
		[
			$Punie$elm_parser_extras$Parser$Expression$Prefix(
			A2($author$project$Parser_$uopParser, '-', $author$project$Syntax$Neg))
		]),
		_List_fromArray(
		[
			$Punie$elm_parser_extras$Parser$Expression$Prefix(
			A2($author$project$Parser_$uopParser, '!', $author$project$Syntax$Not))
		]),
		_List_fromArray(
		[
			A2($Punie$elm_parser_extras$Parser$Expression$Infix, $author$project$Parser_$cons, $Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser_$bopParser, '*', $author$project$Syntax$Mul),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser_$bopParser, '//', $author$project$Syntax$Div),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$Parser_$bopParser, '+', $author$project$Syntax$Add)),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser_$bopParser, '-', $author$project$Syntax$Sub),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$Parser_$bopParser, '/', $author$project$Syntax$DDiv)),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser_$bopParser, '++', $author$project$Syntax$Cat),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$Parser_$bopParser, '<', $author$project$Syntax$Lt)),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$Parser_$bopParser, '>', $author$project$Syntax$Gt)),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser_$bopParser, '<=', $author$project$Syntax$Le),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser_$bopParser, '>=', $author$project$Syntax$Ge),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser_$bopParser, '==', $author$project$Syntax$Eq),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser_$bopParser, '&&', $author$project$Syntax$And),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser_$bopParser, '||', $author$project$Syntax$Or),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		])
	]);
var $author$project$Syntax$PBTuple = F3(
	function (a, b, c) {
		return {$: 'PBTuple', a: a, b: b, c: c};
	});
var $author$project$Syntax$PCons = F3(
	function (a, b, c) {
		return {$: 'PCons', a: a, b: b, c: c};
	});
var $author$project$Syntax$PTTuple = F4(
	function (a, b, c, d) {
		return {$: 'PTTuple', a: a, b: b, c: c, d: d};
	});
var $author$project$Syntax$poCons = 2;
var $author$project$Parser_$pConsOp = _List_fromArray(
	[
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						function (s) {
							return $author$project$Syntax$PCons(
								_Utils_Tuple2(
									_List_fromArray(
										[s]),
									$author$project$Syntax$poCons));
						}),
					$elm$parser$Parser$symbol('::')),
				$author$project$Parser_$mSpaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		])
	]);
var $author$project$Syntax$PChar = F2(
	function (a, b) {
		return {$: 'PChar', a: a, b: b};
	});
var $author$project$Parser_$pchar = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (c, s) {
						return A2(
							$author$project$Syntax$PChar,
							_Utils_Tuple2(
								_List_fromArray(
									[s]),
								$author$project$Syntax$defaultId),
							c);
					})),
			$elm$parser$Parser$symbol('\'')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser_$char_,
			$elm$parser$Parser$symbol('\''))),
	$author$project$Parser_$mSpaces);
var $author$project$Parser_$pfalse = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (s) {
				return $author$project$Syntax$PFalse(
					_Utils_Tuple2(
						_List_fromArray(
							[s]),
						$author$project$Syntax$defaultId));
			}),
		$elm$parser$Parser$keyword('false')),
	$author$project$Parser_$mSpaces);
var $author$project$Syntax$PFloat = F2(
	function (a, b) {
		return {$: 'PFloat', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$float = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				binary: $elm$core$Result$Err(invalid),
				expecting: expecting,
				_float: $elm$core$Result$Ok($elm$core$Basics$identity),
				hex: $elm$core$Result$Err(invalid),
				_int: $elm$core$Result$Ok($elm$core$Basics$toFloat),
				invalid: invalid,
				octal: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$float = A2($elm$parser$Parser$Advanced$float, $elm$parser$Parser$ExpectingFloat, $elm$parser$Parser$ExpectingFloat);
var $author$project$Parser_$pfloat = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (n, s) {
							return A2(
								$author$project$Syntax$PFloat,
								_Utils_Tuple2(
									_List_fromArray(
										[s]),
									$author$project$Syntax$defaultId),
								n);
						})),
				$elm$parser$Parser$number(
					{
						binary: $elm$core$Maybe$Nothing,
						_float: $elm$core$Maybe$Just($elm$core$Basics$identity),
						hex: $elm$core$Maybe$Nothing,
						_int: $elm$core$Maybe$Nothing,
						octal: $elm$core$Maybe$Nothing
					})),
			$author$project$Parser_$mSpaces),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (n, s) {
								return A2(
									$author$project$Syntax$PFloat,
									_Utils_Tuple2(
										_List_fromArray(
											[s]),
										$author$project$Syntax$defaultId),
									-n);
							})),
					$elm$parser$Parser$symbol('-')),
				$elm$parser$Parser$float),
			$author$project$Parser_$mSpaces)
		]));
var $author$project$Syntax$PInt = F2(
	function (a, b) {
		return {$: 'PInt', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				binary: $elm$core$Result$Err(invalid),
				expecting: expecting,
				_float: $elm$core$Result$Err(invalid),
				hex: $elm$core$Result$Err(invalid),
				_int: $elm$core$Result$Ok($elm$core$Basics$identity),
				invalid: invalid,
				octal: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
var $author$project$Parser_$pint = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (n, s) {
							return A2(
								$author$project$Syntax$PInt,
								_Utils_Tuple2(
									_List_fromArray(
										[s]),
									$author$project$Syntax$defaultId),
								n);
						})),
				$elm$parser$Parser$number(
					{
						binary: $elm$core$Maybe$Just($elm$core$Basics$identity),
						_float: $elm$core$Maybe$Nothing,
						hex: $elm$core$Maybe$Just($elm$core$Basics$identity),
						_int: $elm$core$Maybe$Just($elm$core$Basics$identity),
						octal: $elm$core$Maybe$Just($elm$core$Basics$identity)
					})),
			$author$project$Parser_$mSpaces),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (n, s) {
								return A2(
									$author$project$Syntax$PInt,
									_Utils_Tuple2(
										_List_fromArray(
											[s]),
										$author$project$Syntax$defaultId),
									-n);
							})),
					$elm$parser$Parser$symbol('-')),
				$elm$parser$Parser$int),
			$author$project$Parser_$mSpaces)
		]));
var $author$project$Syntax$poNil = 6;
var $author$project$Parser_$pnil = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (s1, s2) {
						return $author$project$Syntax$PNil(
							_Utils_Tuple2(
								_List_fromArray(
									[s1, s2]),
								$author$project$Syntax$poNil));
					})),
			$elm$parser$Parser$symbol('[')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser_$mSpaces,
			$elm$parser$Parser$symbol(']'))),
	$author$project$Parser_$mSpaces);
var $author$project$Syntax$poElm = 1;
var $author$project$Syntax$poSquare = 0;
var $author$project$Syntax$psQuo = 3;
var $author$project$Syntax$psElm = 4;
var $author$project$Parser_$stringToPattern = F2(
	function (ws, s) {
		if (!s.b) {
			return $author$project$Syntax$PNil(ws);
		} else {
			var c = s.a;
			var cs = s.b;
			return A3(
				$author$project$Syntax$PCons,
				ws,
				A2($author$project$Syntax$PChar, $author$project$Syntax$defaultWS, c),
				A2(
					$author$project$Parser_$stringToPattern,
					_Utils_Tuple2(_List_Nil, $author$project$Syntax$psElm),
					cs));
		}
	});
var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $elm$parser$Parser$Advanced$chompUntil = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.context)) : A3(
				$elm$parser$Parser$Advanced$Good,
				_Utils_cmp(s.offset, newOffset) < 0,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 'Expecting', a: a};
};
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$chompUntil = function (str) {
	return $elm$parser$Parser$Advanced$chompUntil(
		$elm$parser$Parser$toToken(str));
};
var $author$project$Parser_$string_ = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompUntil('\"'));
var $author$project$Parser_$pstring = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (s, ws) {
						return A2(
							$author$project$Parser_$stringToPattern,
							_Utils_Tuple2(
								_List_fromArray(
									[ws]),
								$author$project$Syntax$psQuo),
							$elm$core$String$toList(s));
					})),
			$elm$parser$Parser$symbol('\"')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser_$string_,
			$elm$parser$Parser$symbol('\"'))),
	$author$project$Parser_$mSpaces);
var $author$project$Parser_$ptermListToPCons = function (ls) {
	if (!ls.b) {
		return $author$project$Syntax$PNil(
			_Utils_Tuple2(_List_Nil, $author$project$Syntax$poElm));
	} else {
		var _v1 = ls.a;
		var p = _v1.a;
		var s = _v1.b;
		var ps = ls.b;
		return A3(
			$author$project$Syntax$PCons,
			s,
			p,
			$author$project$Parser_$ptermListToPCons(ps));
	}
};
var $author$project$Parser_$ptrue = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (s) {
				return $author$project$Syntax$PTrue(
					_Utils_Tuple2(
						_List_fromArray(
							[s]),
						$author$project$Syntax$defaultId));
			}),
		$elm$parser$Parser$keyword('true')),
	$author$project$Parser_$mSpaces);
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$parser$Parser$ExpectingVariable = {$: 'ExpectingVariable'};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$parser$Parser$Advanced$varHelp = F7(
	function (isGood, offset, row, col, src, indent, context) {
		varHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, src);
			if (_Utils_eq(newOffset, -1)) {
				return {col: col, context: context, indent: indent, offset: offset, row: row, src: src};
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$variable = function (i) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var firstOffset = A3($elm$parser$Parser$Advanced$isSubChar, i.start, s.offset, s.src);
			if (_Utils_eq(firstOffset, -1)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, i.expecting));
			} else {
				var s1 = _Utils_eq(firstOffset, -2) ? A7($elm$parser$Parser$Advanced$varHelp, i.inner, s.offset + 1, s.row + 1, 1, s.src, s.indent, s.context) : A7($elm$parser$Parser$Advanced$varHelp, i.inner, firstOffset, s.row, s.col + 1, s.src, s.indent, s.context);
				var name = A3($elm$core$String$slice, s.offset, s1.offset, s.src);
				return A2($elm$core$Set$member, name, i.reserved) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, i.expecting)) : A3($elm$parser$Parser$Advanced$Good, true, name, s1);
			}
		});
};
var $elm$parser$Parser$variable = function (i) {
	return $elm$parser$Parser$Advanced$variable(
		{expecting: $elm$parser$Parser$ExpectingVariable, inner: i.inner, reserved: i.reserved, start: i.start});
};
var $author$project$Parser_$varName = $elm$parser$Parser$variable(
	{
		inner: function (c) {
			return $elm$core$Char$isAlphaNum(c) || _Utils_eq(
				c,
				_Utils_chr('_'));
		},
		reserved: $elm$core$Set$fromList(
			_List_fromArray(
				['if', 'then', 'else', 'let', 'in', 'case', 'of', 'letrec', 'nil', 'true', 'false', 'toString'])),
		start: $elm$core$Char$isLower
	});
var $author$project$Parser_$pvar = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (v, s) {
					return A2(
						$author$project$Syntax$PVar,
						_Utils_Tuple2(
							_List_fromArray(
								[s]),
							$author$project$Syntax$defaultId),
						v);
				})),
		$author$project$Parser_$varName),
	$author$project$Parser_$mSpaces);
var $author$project$Parser_$pListHelper = function (revPats) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F2(
								function (s, p) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												p,
												_Utils_Tuple2(
													_List_fromArray(
														[s]),
													$author$project$Syntax$poElm)),
											revPats));
								})),
						$elm$parser$Parser$symbol(',')),
					$author$project$Parser_$mSpaces),
				$elm$parser$Parser$lazy(
					function (_v7) {
						return $author$project$Parser_$cyclic$pterm();
					})),
				A2(
				$elm$parser$Parser$map,
				function (_v8) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revPats));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
function $author$project$Parser_$cyclic$pList() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F4(
								function (s1, p, ps, s2) {
									return A3(
										$author$project$Syntax$PCons,
										_Utils_Tuple2(
											_List_fromArray(
												[s1, s2]),
											$author$project$Syntax$poSquare),
										p,
										ps);
								})),
						$elm$parser$Parser$symbol('[')),
					$author$project$Parser_$mSpaces),
				$elm$parser$Parser$lazy(
					function (_v9) {
						return $author$project$Parser_$cyclic$pterm();
					})),
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$Parser_$cyclic$pListloop(),
				$elm$parser$Parser$symbol(']'))),
		$author$project$Parser_$mSpaces);
}
function $author$project$Parser_$cyclic$pListloop() {
	return A2(
		$elm$parser$Parser$map,
		$author$project$Parser_$ptermListToPCons,
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$Parser_$pListHelper));
}
function $author$project$Parser_$cyclic$pattern() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$Parser_$pConsOp,
		$elm$parser$Parser$lazy(
			function (_v6) {
				return $author$project$Parser_$cyclic$pterm();
			}));
}
function $author$project$Parser_$cyclic$pterm() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$author$project$Parser_$pvar,
				$elm$parser$Parser$backtrackable($author$project$Parser_$pnil),
				$elm$parser$Parser$lazy(
				function (_v5) {
					return $author$project$Parser_$cyclic$pList();
				}),
				$elm$parser$Parser$backtrackable($author$project$Parser_$pint),
				$elm$parser$Parser$backtrackable($author$project$Parser_$pfloat),
				$author$project$Parser_$ptrue,
				$author$project$Parser_$pfalse,
				$elm$parser$Parser$backtrackable(
				$author$project$Parser_$cyclic$pbtuple()),
				$author$project$Parser_$cyclic$pttuple(),
				$author$project$Parser_$pstring,
				$author$project$Parser_$pchar
			]));
}
function $author$project$Parser_$cyclic$pbtuple() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(
								F5(
									function (s1, p1, s2, p2, s3) {
										return A3(
											$author$project$Syntax$PBTuple,
											_Utils_Tuple2(
												_List_fromArray(
													[s1, s2, s3]),
												$author$project$Syntax$defaultId),
											p1,
											p2);
									})),
							$elm$parser$Parser$symbol('(')),
						$author$project$Parser_$mSpaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v3) {
								return $author$project$Parser_$cyclic$pattern();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$Parser_$mSpaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v4) {
						return $author$project$Parser_$cyclic$pattern();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$Parser_$mSpaces);
}
function $author$project$Parser_$cyclic$pttuple() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$ignorer,
									$elm$parser$Parser$succeed(
										F7(
											function (s1, p1, s2, p2, s3, p3, s4) {
												return A4(
													$author$project$Syntax$PTTuple,
													_Utils_Tuple2(
														_List_fromArray(
															[s1, s2, s3, s4]),
														$author$project$Syntax$defaultId),
													p1,
													p2,
													p3);
											})),
									$elm$parser$Parser$symbol('(')),
								$author$project$Parser_$mSpaces),
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$lazy(
									function (_v0) {
										return $author$project$Parser_$cyclic$pattern();
									}),
								$elm$parser$Parser$symbol(','))),
						$author$project$Parser_$mSpaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v1) {
								return $author$project$Parser_$cyclic$pattern();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$Parser_$mSpaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v2) {
						return $author$project$Parser_$cyclic$pattern();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$Parser_$mSpaces);
}
try {
	var $author$project$Parser_$pList = $author$project$Parser_$cyclic$pList();
	$author$project$Parser_$cyclic$pList = function () {
		return $author$project$Parser_$pList;
	};
	var $author$project$Parser_$pListloop = $author$project$Parser_$cyclic$pListloop();
	$author$project$Parser_$cyclic$pListloop = function () {
		return $author$project$Parser_$pListloop;
	};
	var $author$project$Parser_$pattern = $author$project$Parser_$cyclic$pattern();
	$author$project$Parser_$cyclic$pattern = function () {
		return $author$project$Parser_$pattern;
	};
	var $author$project$Parser_$pterm = $author$project$Parser_$cyclic$pterm();
	$author$project$Parser_$cyclic$pterm = function () {
		return $author$project$Parser_$pterm;
	};
	var $author$project$Parser_$pbtuple = $author$project$Parser_$cyclic$pbtuple();
	$author$project$Parser_$cyclic$pbtuple = function () {
		return $author$project$Parser_$pbtuple;
	};
	var $author$project$Parser_$pttuple = $author$project$Parser_$cyclic$pttuple();
	$author$project$Parser_$cyclic$pttuple = function () {
		return $author$project$Parser_$pttuple;
	};
} catch ($) {
	throw 'Some top-level definitions from `Parser_` are causing infinite recursion:\n\n  ┌─────┐\n  │    pList\n  │     ↓\n  │    pListloop\n  │     ↓\n  │    pListHelper\n  │     ↓\n  │    pattern\n  │     ↓\n  │    pterm\n  │     ↓\n  │    pbtuple\n  │     ↓\n  │    pttuple\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return _Utils_eq(
			c,
			_Utils_chr(' ')) || (_Utils_eq(
			c,
			_Utils_chr('\n')) || _Utils_eq(
			c,
			_Utils_chr('\r')));
	});
var $elm$parser$Parser$spaces = $elm$parser$Parser$Advanced$spaces;
var $Punie$elm_parser_extras$Parser$Extras$manyHelp = F2(
	function (p, vs) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					$elm$parser$Parser$succeed(
						function (v) {
							return $elm$parser$Parser$Loop(
								A2($elm$core$List$cons, v, vs));
						}),
					A2($elm$parser$Parser$ignorer, p, $elm$parser$Parser$spaces)),
					A2(
					$elm$parser$Parser$map,
					function (_v0) {
						return $elm$parser$Parser$Done(
							$elm$core$List$reverse(vs));
					},
					$elm$parser$Parser$succeed(_Utils_Tuple0))
				]));
	});
var $Punie$elm_parser_extras$Parser$Extras$many = function (p) {
	return A2(
		$elm$parser$Parser$loop,
		_List_Nil,
		$Punie$elm_parser_extras$Parser$Extras$manyHelp(p));
};
var $Punie$elm_parser_extras$Parser$Extras$some = function (p) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Tuple$pair),
			A2($elm$parser$Parser$ignorer, p, $elm$parser$Parser$spaces)),
		$Punie$elm_parser_extras$Parser$Extras$many(p));
};
var $author$project$Parser_$stringToExpr = F2(
	function (ws, s) {
		if (!s.b) {
			return $author$project$Syntax$ENil(ws);
		} else {
			var c = s.a;
			var cs = s.b;
			return A3(
				$author$project$Syntax$ECons,
				ws,
				A2($author$project$Syntax$EChar, $author$project$Syntax$defaultWS, c),
				A2(
					$author$project$Parser_$stringToExpr,
					_Utils_Tuple2(_List_Nil, $author$project$Syntax$esElm),
					cs));
		}
	});
var $author$project$Parser_$string = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (s, ws) {
						return A2(
							$author$project$Parser_$stringToExpr,
							_Utils_Tuple2(
								_List_fromArray(
									[ws]),
								$author$project$Syntax$esQuo),
							$elm$core$String$toList(s));
					})),
			$elm$parser$Parser$symbol('\"')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser_$string_,
			$elm$parser$Parser$symbol('\"'))),
	$author$project$Parser_$mSpaces);
var $author$project$Syntax$ETrue = function (a) {
	return {$: 'ETrue', a: a};
};
var $author$project$Parser_$true = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (s) {
				return $author$project$Syntax$ETrue(
					_Utils_Tuple2(
						_List_fromArray(
							[s]),
						$author$project$Syntax$defaultId));
			}),
		$elm$parser$Parser$keyword('true')),
	$author$project$Parser_$mSpaces);
var $author$project$Parser_$var = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (v, s) {
					return A2(
						$author$project$Syntax$EVar,
						_Utils_Tuple2(
							_List_fromArray(
								[s]),
							$author$project$Syntax$defaultId),
						v);
				})),
		$author$project$Parser_$varName),
	$author$project$Parser_$mSpaces);
var $author$project$Parser_$listHelper = function (revExprs) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F2(
								function (s, e) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												e,
												_Utils_Tuple2(
													_List_fromArray(
														[s]),
													$author$project$Syntax$eoElm)),
											revExprs));
								})),
						$elm$parser$Parser$symbol(',')),
					$author$project$Parser_$mSpaces),
				$elm$parser$Parser$lazy(
					function (_v9) {
						return $author$project$Parser_$cyclic$expr();
					})),
				A2(
				$elm$parser$Parser$map,
				function (_v10) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revExprs));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
function $author$project$Parser_$cyclic$abs() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F4(
								function (s1, p, s2, e) {
									return A3(
										$author$project$Syntax$ELam,
										_Utils_Tuple2(
											_List_fromArray(
												[s1, s2]),
											$author$project$Syntax$defaultId),
										p,
										e);
								})),
						$elm$parser$Parser$symbol('\\')),
					$author$project$Parser_$mSpaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v31) {
							return $author$project$Parser_$pattern;
						}),
					$elm$parser$Parser$symbol('=>'))),
			$author$project$Parser_$mSpaces),
		$elm$parser$Parser$lazy(
			function (_v32) {
				return $author$project$Parser_$cyclic$expr();
			}));
}
function $author$project$Parser_$cyclic$aexpr() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$author$project$Parser_$cyclic$iteState(),
				$elm$parser$Parser$backtrackable(
				$author$project$Parser_$cyclic$parens_()),
				$elm$parser$Parser$backtrackable(
				$author$project$Parser_$cyclic$btuple()),
				$author$project$Parser_$cyclic$ttuple(),
				$author$project$Parser_$true,
				$author$project$Parser_$false,
				$elm$parser$Parser$backtrackable($author$project$Parser_$int_),
				$elm$parser$Parser$backtrackable($author$project$Parser_$float_),
				$author$project$Parser_$var,
				$elm$parser$Parser$lazy(
				function (_v28) {
					return $author$project$Parser_$cyclic$abs();
				}),
				$elm$parser$Parser$lazy(
				function (_v29) {
					return $author$project$Parser_$cyclic$let_();
				}),
				$elm$parser$Parser$lazy(
				function (_v30) {
					return $author$project$Parser_$cyclic$letrec();
				}),
				$author$project$Parser_$cyclic$caseOf(),
				$author$project$Parser_$hole,
				$elm$parser$Parser$backtrackable($author$project$Parser_$nil),
				$author$project$Parser_$cyclic$list(),
				$author$project$Parser_$string,
				$author$project$Parser_$char,
				$author$project$Parser_$cyclic$html(),
				$author$project$Parser_$cyclic$tostr()
			]));
}
function $author$project$Parser_$cyclic$caseOf() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F4(
								function (s1, e, s2, b) {
									return A3(
										$author$project$Parser_$caseToApp,
										e,
										b,
										_Utils_Tuple2(
											_List_fromArray(
												[s1, s2]),
											$author$project$Syntax$caseId));
								})),
						$elm$parser$Parser$keyword('case')),
					$author$project$Parser_$mSpaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v27) {
							return $author$project$Parser_$cyclic$expr();
						}),
					$elm$parser$Parser$keyword('of'))),
			$author$project$Parser_$mSpaces),
		$author$project$Parser_$cyclic$branch());
}
function $author$project$Parser_$cyclic$branch() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$Parser_$branchOp,
		$author$project$Parser_$cyclic$sinBranch());
}
function $author$project$Parser_$cyclic$btuple() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(
								F5(
									function (s1, e1, s2, e2, s3) {
										return A3(
											$author$project$Syntax$EBTuple,
											_Utils_Tuple2(
												_List_fromArray(
													[s1, s2, s3]),
												$author$project$Syntax$defaultId),
											e1,
											e2);
									})),
							$elm$parser$Parser$symbol('(')),
						$author$project$Parser_$mSpaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v25) {
								return $author$project$Parser_$cyclic$expr();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$Parser_$mSpaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v26) {
						return $author$project$Parser_$cyclic$expr();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$Parser_$mSpaces);
}
function $author$project$Parser_$cyclic$expr() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$Parser_$operators,
		$elm$parser$Parser$lazy(
			function (_v24) {
				return $author$project$Parser_$cyclic$term();
			}));
}
function $author$project$Parser_$cyclic$html() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$ignorer,
									$elm$parser$Parser$succeed(
										F7(
											function (n, s1, e1, s2, e2, s3, e3) {
												return A5(
													$author$project$Syntax$EHtml,
													_Utils_Tuple2(
														_List_fromArray(
															[s1, s2, s3]),
														$author$project$Syntax$defaultId),
													n,
													e1,
													e2,
													e3);
											})),
									$elm$parser$Parser$symbol('Html.')),
								$author$project$Parser_$varName),
							$author$project$Parser_$mSpaces),
						$elm$parser$Parser$lazy(
							function (_v21) {
								return $author$project$Parser_$cyclic$aexpr();
							})),
					$author$project$Parser_$mSpaces),
				$elm$parser$Parser$lazy(
					function (_v22) {
						return $author$project$Parser_$cyclic$aexpr();
					})),
			$author$project$Parser_$mSpaces),
		$elm$parser$Parser$lazy(
			function (_v23) {
				return $author$project$Parser_$cyclic$aexpr();
			}));
}
function $author$project$Parser_$cyclic$iteState() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed(
									F6(
										function (s1, e1, s2, e2, s3, e3) {
											return A5(
												$author$project$Parser_$iteToApp,
												e1,
												e2,
												e3,
												s1,
												_List_fromArray(
													[s2, s3]));
										})),
								$elm$parser$Parser$keyword('if')),
							$author$project$Parser_$mSpaces),
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$lazy(
								function (_v18) {
									return $author$project$Parser_$cyclic$expr();
								}),
							$elm$parser$Parser$keyword('then'))),
					$author$project$Parser_$mSpaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v19) {
							return $author$project$Parser_$cyclic$expr();
						}),
					$elm$parser$Parser$keyword('else'))),
			$author$project$Parser_$mSpaces),
		$elm$parser$Parser$lazy(
			function (_v20) {
				return $author$project$Parser_$cyclic$expr();
			}));
}
function $author$project$Parser_$cyclic$let_() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed(
									F6(
										function (s1, p, s2, e1, s3, e2) {
											return A4(
												$author$project$Syntax$ELet,
												_Utils_Tuple2(
													_List_fromArray(
														[s1, s2, s3]),
													$author$project$Syntax$defaultId),
												p,
												e1,
												e2);
										})),
								$elm$parser$Parser$keyword('let')),
							$author$project$Parser_$mSpaces),
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$lazy(
								function (_v15) {
									return $author$project$Parser_$pattern;
								}),
							$elm$parser$Parser$symbol('='))),
					$author$project$Parser_$mSpaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v16) {
							return $author$project$Parser_$cyclic$expr();
						}),
					$elm$parser$Parser$keyword('in'))),
			$author$project$Parser_$mSpaces),
		$elm$parser$Parser$lazy(
			function (_v17) {
				return $author$project$Parser_$cyclic$expr();
			}));
}
function $author$project$Parser_$cyclic$letrec() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed(
									F6(
										function (s1, p, s2, e1, s3, e2) {
											return A4(
												$author$project$Syntax$ELetrec,
												_Utils_Tuple2(
													_List_fromArray(
														[s1, s2, s3]),
													$author$project$Syntax$defaultId),
												p,
												e1,
												e2);
										})),
								$elm$parser$Parser$keyword('letrec')),
							$author$project$Parser_$mSpaces),
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$lazy(
								function (_v12) {
									return $author$project$Parser_$pattern;
								}),
							$elm$parser$Parser$symbol('='))),
					$author$project$Parser_$mSpaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v13) {
							return $author$project$Parser_$cyclic$expr();
						}),
					$elm$parser$Parser$keyword('in'))),
			$author$project$Parser_$mSpaces),
		$elm$parser$Parser$lazy(
			function (_v14) {
				return $author$project$Parser_$cyclic$expr();
			}));
}
function $author$project$Parser_$cyclic$list() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F4(
								function (s1, e1, es, s2) {
									return A3(
										$author$project$Syntax$ECons,
										_Utils_Tuple2(
											_List_fromArray(
												[s1, s2]),
											$author$project$Syntax$eoSquare),
										e1,
										es);
								})),
						$elm$parser$Parser$symbol('[')),
					$author$project$Parser_$mSpaces),
				$elm$parser$Parser$lazy(
					function (_v11) {
						return $author$project$Parser_$cyclic$expr();
					})),
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$Parser_$cyclic$listloop(),
				$elm$parser$Parser$symbol(']'))),
		$author$project$Parser_$mSpaces);
}
function $author$project$Parser_$cyclic$listloop() {
	return A2(
		$elm$parser$Parser$map,
		$author$project$Parser_$exprListToECons,
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$Parser_$listHelper));
}
function $author$project$Parser_$cyclic$parens_() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F3(
							function (s1, e, s2) {
								return A2(
									$author$project$Syntax$EParens,
									_Utils_Tuple2(
										_List_fromArray(
											[s1, s2]),
										$author$project$Syntax$defaultId),
									e);
							})),
					$elm$parser$Parser$symbol('(')),
				$author$project$Parser_$mSpaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v8) {
						return $author$project$Parser_$cyclic$expr();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$Parser_$mSpaces);
}
function $author$project$Parser_$cyclic$sinBranch() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F3(
						function (p, s, e) {
							return A3(
								$author$project$Syntax$BSin,
								_Utils_Tuple2(
									_List_fromArray(
										[s]),
									$author$project$Syntax$defaultId),
								p,
								e);
						})),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v6) {
							return $author$project$Parser_$pattern;
						}),
					$elm$parser$Parser$symbol('=>'))),
			$author$project$Parser_$mSpaces),
		$elm$parser$Parser$lazy(
			function (_v7) {
				return $author$project$Parser_$cyclic$expr();
			}));
}
function $author$project$Parser_$cyclic$term() {
	var foldl1 = F2(
		function (f, _v5) {
			var x = _v5.a;
			var xs = _v5.b;
			return A3(
				$elm$core$List$foldl,
				$author$project$Parser_$flip(f),
				x,
				xs);
		});
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			foldl1(
				$author$project$Syntax$EApp($author$project$Syntax$defaultWS))),
		$Punie$elm_parser_extras$Parser$Extras$some(
			$elm$parser$Parser$lazy(
				function (_v4) {
					return $author$project$Parser_$cyclic$aexpr();
				})));
}
function $author$project$Parser_$cyclic$tostr() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (s, e) {
							return A2(
								$author$project$Syntax$EToStr,
								_Utils_Tuple2(
									_List_fromArray(
										[s]),
									$author$project$Syntax$defaultId),
								e);
						})),
				$elm$parser$Parser$keyword('toString')),
			$author$project$Parser_$mSpaces),
		$elm$parser$Parser$lazy(
			function (_v3) {
				return $author$project$Parser_$cyclic$expr();
			}));
}
function $author$project$Parser_$cyclic$ttuple() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$ignorer,
									$elm$parser$Parser$succeed(
										F7(
											function (s1, e1, s2, e2, s3, e3, s4) {
												return A4(
													$author$project$Syntax$ETTuple,
													_Utils_Tuple2(
														_List_fromArray(
															[s1, s2, s3, s4]),
														$author$project$Syntax$defaultId),
													e1,
													e2,
													e3);
											})),
									$elm$parser$Parser$symbol('(')),
								$author$project$Parser_$mSpaces),
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$lazy(
									function (_v0) {
										return $author$project$Parser_$cyclic$expr();
									}),
								$elm$parser$Parser$symbol(','))),
						$author$project$Parser_$mSpaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v1) {
								return $author$project$Parser_$cyclic$expr();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$Parser_$mSpaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v2) {
						return $author$project$Parser_$cyclic$expr();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$Parser_$mSpaces);
}
try {
	var $author$project$Parser_$abs = $author$project$Parser_$cyclic$abs();
	$author$project$Parser_$cyclic$abs = function () {
		return $author$project$Parser_$abs;
	};
	var $author$project$Parser_$aexpr = $author$project$Parser_$cyclic$aexpr();
	$author$project$Parser_$cyclic$aexpr = function () {
		return $author$project$Parser_$aexpr;
	};
	var $author$project$Parser_$caseOf = $author$project$Parser_$cyclic$caseOf();
	$author$project$Parser_$cyclic$caseOf = function () {
		return $author$project$Parser_$caseOf;
	};
	var $author$project$Parser_$branch = $author$project$Parser_$cyclic$branch();
	$author$project$Parser_$cyclic$branch = function () {
		return $author$project$Parser_$branch;
	};
	var $author$project$Parser_$btuple = $author$project$Parser_$cyclic$btuple();
	$author$project$Parser_$cyclic$btuple = function () {
		return $author$project$Parser_$btuple;
	};
	var $author$project$Parser_$expr = $author$project$Parser_$cyclic$expr();
	$author$project$Parser_$cyclic$expr = function () {
		return $author$project$Parser_$expr;
	};
	var $author$project$Parser_$html = $author$project$Parser_$cyclic$html();
	$author$project$Parser_$cyclic$html = function () {
		return $author$project$Parser_$html;
	};
	var $author$project$Parser_$iteState = $author$project$Parser_$cyclic$iteState();
	$author$project$Parser_$cyclic$iteState = function () {
		return $author$project$Parser_$iteState;
	};
	var $author$project$Parser_$let_ = $author$project$Parser_$cyclic$let_();
	$author$project$Parser_$cyclic$let_ = function () {
		return $author$project$Parser_$let_;
	};
	var $author$project$Parser_$letrec = $author$project$Parser_$cyclic$letrec();
	$author$project$Parser_$cyclic$letrec = function () {
		return $author$project$Parser_$letrec;
	};
	var $author$project$Parser_$list = $author$project$Parser_$cyclic$list();
	$author$project$Parser_$cyclic$list = function () {
		return $author$project$Parser_$list;
	};
	var $author$project$Parser_$listloop = $author$project$Parser_$cyclic$listloop();
	$author$project$Parser_$cyclic$listloop = function () {
		return $author$project$Parser_$listloop;
	};
	var $author$project$Parser_$parens_ = $author$project$Parser_$cyclic$parens_();
	$author$project$Parser_$cyclic$parens_ = function () {
		return $author$project$Parser_$parens_;
	};
	var $author$project$Parser_$sinBranch = $author$project$Parser_$cyclic$sinBranch();
	$author$project$Parser_$cyclic$sinBranch = function () {
		return $author$project$Parser_$sinBranch;
	};
	var $author$project$Parser_$term = $author$project$Parser_$cyclic$term();
	$author$project$Parser_$cyclic$term = function () {
		return $author$project$Parser_$term;
	};
	var $author$project$Parser_$tostr = $author$project$Parser_$cyclic$tostr();
	$author$project$Parser_$cyclic$tostr = function () {
		return $author$project$Parser_$tostr;
	};
	var $author$project$Parser_$ttuple = $author$project$Parser_$cyclic$ttuple();
	$author$project$Parser_$cyclic$ttuple = function () {
		return $author$project$Parser_$ttuple;
	};
} catch ($) {
	throw 'Some top-level definitions from `Parser_` are causing infinite recursion:\n\n  ┌─────┐\n  │    abs\n  │     ↓\n  │    aexpr\n  │     ↓\n  │    caseOf\n  │     ↓\n  │    branch\n  │     ↓\n  │    btuple\n  │     ↓\n  │    expr\n  │     ↓\n  │    html\n  │     ↓\n  │    iteState\n  │     ↓\n  │    let_\n  │     ↓\n  │    letrec\n  │     ↓\n  │    list\n  │     ↓\n  │    listloop\n  │     ↓\n  │    listHelper\n  │     ↓\n  │    parens_\n  │     ↓\n  │    sinBranch\n  │     ↓\n  │    term\n  │     ↓\n  │    tostr\n  │     ↓\n  │    ttuple\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $author$project$Parser_$parse = $elm$parser$Parser$run(
	A2($elm$parser$Parser$ignorer, $author$project$Parser_$expr, $elm$parser$Parser$end));
var $author$project$Syntax$BNSin = F4(
	function (a, b, c, d) {
		return {$: 'BNSin', a: a, b: b, c: c, d: d};
	});
var $author$project$LangUtils$numberBranches = F4(
	function (b, env, n, holeID) {
		switch (b.$) {
			case 'BSin':
				var ws = b.a;
				var pat = b.b;
				var e = b.c;
				var _v27 = A3($author$project$LangUtils$processAfterParse, e, env, holeID);
				var e_ = _v27.a;
				var holeID_ = _v27.b;
				return _Utils_Tuple3(
					A4($author$project$Syntax$BNSin, ws, n, pat, e_),
					n + 1,
					holeID_);
			case 'BCom':
				var ws = b.a;
				var b1 = b.b;
				var b2 = b.c;
				var _v28 = A4($author$project$LangUtils$numberBranches, b1, env, n, holeID);
				var b1_ = _v28.a;
				var n1 = _v28.b;
				var holeID_ = _v28.c;
				var _v29 = A4($author$project$LangUtils$numberBranches, b2, env, n1, holeID_);
				var b2_ = _v29.a;
				var n2 = _v29.b;
				var holeID__ = _v29.c;
				return _Utils_Tuple3(
					A3($author$project$Syntax$BCom, ws, b1_, b2_),
					n2,
					holeID__);
			default:
				return _Utils_Tuple3(b, n, holeID);
		}
	});
var $author$project$LangUtils$processAfterParse = F3(
	function (expr, env, holeID) {
		_v0$16:
		while (true) {
			switch (expr.$) {
				case 'EHole':
					if (expr.b.$ === 'HInter') {
						var ws = expr.a;
						return _Utils_Tuple2(
							A2(
								$author$project$Syntax$EHole,
								ws,
								$author$project$Syntax$HOri(holeID)),
							holeID + 1);
					} else {
						break _v0$16;
					}
				case 'EVar':
					var ws = expr.a;
					var s = expr.b;
					return _Utils_Tuple2(
						A2($author$project$Syntax$EVar, ws, s),
						holeID);
				case 'ELam':
					var ws = expr.a;
					var pat = expr.b;
					var body = expr.c;
					var _v1 = A3($author$project$LangUtils$processAfterParse, body, env, holeID);
					var body_ = _v1.a;
					var holeID_ = _v1.b;
					return _Utils_Tuple2(
						A3($author$project$Syntax$ELam, ws, pat, body_),
						holeID_);
				case 'ELet':
					var ws = expr.a;
					var pat = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var _v2 = A3($author$project$LangUtils$processAfterParse, e1, env, holeID);
					var e1_ = _v2.a;
					var holeID_ = _v2.b;
					var _v3 = A3($author$project$LangUtils$processAfterParse, e2, env, holeID_);
					var e2_ = _v3.a;
					var holeID__ = _v3.b;
					return _Utils_Tuple2(
						A4($author$project$Syntax$ELet, ws, pat, e1_, e2_),
						holeID__);
				case 'ELetrec':
					var ws = expr.a;
					var pat = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var _v4 = A3($author$project$LangUtils$processAfterParse, e1, env, holeID);
					var e1_ = _v4.a;
					var holeID_ = _v4.b;
					var _v5 = A3($author$project$LangUtils$processAfterParse, e2, env, holeID_);
					var e2_ = _v5.a;
					var holeID__ = _v5.b;
					return _Utils_Tuple2(
						A4($author$project$Syntax$ELetrec, ws, pat, e1_, e2_),
						holeID__);
				case 'EApp':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					var _v6 = A3($author$project$LangUtils$processAfterParse, e1, env, holeID);
					var e1_ = _v6.a;
					var holeID_ = _v6.b;
					var _v7 = A3($author$project$LangUtils$processAfterParse, e2, env, holeID_);
					var e2_ = _v7.a;
					var holeID__ = _v7.b;
					return _Utils_Tuple2(
						A3($author$project$Syntax$EApp, ws, e1_, e2_),
						holeID__);
				case 'ECons':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					var _v8 = A3($author$project$LangUtils$processAfterParse, e1, env, holeID);
					var e1_ = _v8.a;
					var holeID_ = _v8.b;
					var _v9 = A3($author$project$LangUtils$processAfterParse, e2, env, holeID_);
					var e2_ = _v9.a;
					var holeID__ = _v9.b;
					return _Utils_Tuple2(
						A3($author$project$Syntax$ECons, ws, e1_, e2_),
						holeID__);
				case 'EBPrim':
					var ws = expr.a;
					var op = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var _v10 = A3($author$project$LangUtils$processAfterParse, e1, env, holeID);
					var e1_ = _v10.a;
					var holeID_ = _v10.b;
					var _v11 = A3($author$project$LangUtils$processAfterParse, e2, env, holeID_);
					var e2_ = _v11.a;
					var holeID__ = _v11.b;
					return _Utils_Tuple2(
						A4($author$project$Syntax$EBPrim, ws, op, e1_, e2_),
						holeID__);
				case 'EUPrim':
					var ws = expr.a;
					var op = expr.b;
					var e = expr.c;
					var _v12 = A3($author$project$LangUtils$processAfterParse, e, env, holeID);
					var e_ = _v12.a;
					var holeID_ = _v12.b;
					return _Utils_Tuple2(
						A3($author$project$Syntax$EUPrim, ws, op, e_),
						holeID_);
				case 'ECase':
					var ws = expr.a;
					var e = expr.b;
					var branch = expr.c;
					var _v13 = A3($author$project$LangUtils$processAfterParse, e, env, holeID);
					var e_ = _v13.a;
					var holeID_ = _v13.b;
					var _v14 = A4($author$project$LangUtils$numberBranches, branch, env, 0, holeID_);
					var branch_ = _v14.a;
					var holeID__ = _v14.c;
					return _Utils_Tuple2(
						A3($author$project$Syntax$ECase, ws, e_, branch_),
						holeID__);
				case 'EFix':
					var ws = expr.a;
					var e = expr.b;
					var _v15 = A3($author$project$LangUtils$processAfterParse, e, env, holeID);
					var e_ = _v15.a;
					var holeID_ = _v15.b;
					return _Utils_Tuple2(
						A2($author$project$Syntax$EFix, ws, e_),
						holeID_);
				case 'EParens':
					var ws = expr.a;
					var e = expr.b;
					var _v16 = A3($author$project$LangUtils$processAfterParse, e, env, holeID);
					var e_ = _v16.a;
					var holeID_ = _v16.b;
					return _Utils_Tuple2(
						A2($author$project$Syntax$EParens, ws, e_),
						holeID_);
				case 'EBTuple':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					var _v17 = A3($author$project$LangUtils$processAfterParse, e1, env, holeID);
					var e1_ = _v17.a;
					var holeID_ = _v17.b;
					var _v18 = A3($author$project$LangUtils$processAfterParse, e2, env, holeID_);
					var e2_ = _v18.a;
					var holeID__ = _v18.b;
					return _Utils_Tuple2(
						A3($author$project$Syntax$EBTuple, ws, e1_, e2_),
						holeID__);
				case 'ETTuple':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					var e3 = expr.d;
					var _v19 = A3($author$project$LangUtils$processAfterParse, e1, env, holeID);
					var e1_ = _v19.a;
					var holeID1 = _v19.b;
					var _v20 = A3($author$project$LangUtils$processAfterParse, e2, env, holeID1);
					var e2_ = _v20.a;
					var holeID2 = _v20.b;
					var _v21 = A3($author$project$LangUtils$processAfterParse, e3, env, holeID2);
					var e3_ = _v21.a;
					var holeID3 = _v21.b;
					return _Utils_Tuple2(
						A4($author$project$Syntax$ETTuple, ws, e1_, e2_, e3_),
						holeID3);
				case 'EHtml':
					var ws = expr.a;
					var s = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var e3 = expr.e;
					var _v22 = A3($author$project$LangUtils$processAfterParse, e1, env, holeID);
					var e1_ = _v22.a;
					var holeID1 = _v22.b;
					var _v23 = A3($author$project$LangUtils$processAfterParse, e2, env, holeID1);
					var e2_ = _v23.a;
					var holeID2 = _v23.b;
					var _v24 = A3($author$project$LangUtils$processAfterParse, e3, env, holeID2);
					var e3_ = _v24.a;
					var holeID3 = _v24.b;
					return _Utils_Tuple2(
						A5($author$project$Syntax$EHtml, ws, s, e1_, e2_, e3_),
						holeID3);
				case 'EToStr':
					var ws = expr.a;
					var e = expr.b;
					var _v25 = A3($author$project$LangUtils$processAfterParse, e, env, holeID);
					var e_ = _v25.a;
					var holeID_ = _v25.b;
					return _Utils_Tuple2(
						A2($author$project$Syntax$EToStr, ws, e_),
						holeID_);
				default:
					break _v0$16;
			}
		}
		return _Utils_Tuple2(expr, holeID);
	});
var $author$project$LangUtils$changeWsForList = F2(
	function (ws, expr) {
		switch (expr.$) {
			case 'ENil':
				return $author$project$Syntax$ENil(ws);
			case 'ECons':
				var e1 = expr.b;
				var e2 = expr.c;
				return A3($author$project$Syntax$ECons, ws, e1, e2);
			default:
				return $author$project$Syntax$EError('Impossible!');
		}
	});
var $author$project$LangUtils$deAppend = F2(
	function (nl, n1) {
		var _v0 = _Utils_Tuple2(nl, n1);
		switch (_v0.a.$) {
			case 'VCons':
				if (!_v0.b) {
					var _v1 = _v0.a;
					var nid = _v1.a;
					return _Utils_Tuple2(
						$author$project$Syntax$VNil(nid),
						nl);
				} else {
					var _v2 = _v0.a;
					var nid = _v2.a;
					var v1 = _v2.b;
					var vs = _v2.c;
					var _v3 = A2($author$project$LangUtils$deAppend, vs, n1 - 1);
					var l1 = _v3.a;
					var l2 = _v3.b;
					return _Utils_Tuple2(
						A3($author$project$Syntax$VCons, nid, v1, l1),
						l2);
				}
			case 'VNil':
				var nid = _v0.a.a;
				return _Utils_Tuple2(
					$author$project$Syntax$VNil(nid),
					$author$project$Syntax$VNil(nid));
			default:
				return _Utils_Tuple2(
					$author$project$Syntax$VError('New Value for Updating Concat Type Error'),
					$author$project$Syntax$VError(''));
		}
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$LangUtils$insert = F2(
	function (_v0, henv) {
		var u = _v0.a;
		var venv = _v0.b;
		var v = _v0.c;
		if (!henv.b) {
			return _List_fromArray(
				[
					_Utils_Tuple3(u, venv, v)
				]);
		} else {
			var _v2 = henv.a;
			var u1 = _v2.a;
			var venv1 = _v2.b;
			var v1 = _v2.c;
			var hv = henv.b;
			return (_Utils_eq(u1, u) && _Utils_eq(venv1, venv)) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple3(u1, venv1, v),
				hv) : A2(
				$elm$core$List$cons,
				_Utils_Tuple3(u1, venv1, v1),
				A2(
					$author$project$LangUtils$insert,
					_Utils_Tuple3(u, venv, v),
					hv));
		}
	});
var $author$project$LangUtils$lengthUntil = F2(
	function (s, venv) {
		if (!venv.b) {
			return -1;
		} else {
			var _v1 = venv.a;
			var s1 = _v1.a;
			var vv = venv.b;
			return _Utils_eq(s, s1) ? 0 : (1 + A2($author$project$LangUtils$lengthUntil, s, vv));
		}
	});
var $author$project$LangUtils$getElem = F3(
	function (hn, venv, henv) {
		if (henv.b) {
			var _v1 = henv.a;
			var hn1 = _v1.a;
			var venv1 = _v1.b;
			var v1 = _v1.c;
			var henv1 = henv.b;
			if (_Utils_eq(hn, hn1) && _Utils_eq(venv, venv1)) {
				return _Utils_Tuple2(v1, henv1);
			} else {
				var _v2 = A3($author$project$LangUtils$getElem, hn, venv, henv1);
				var resv = _v2.a;
				var reshenv = _v2.b;
				return _Utils_Tuple2(
					resv,
					A2(
						$elm$core$List$cons,
						_Utils_Tuple3(hn1, venv1, v1),
						reshenv));
			}
		} else {
			return _Utils_Tuple2(
				$author$project$Syntax$VError(''),
				_List_Nil);
		}
	});
var $author$project$LangUtils$elemIn = F3(
	function (hn, venv, henv) {
		elemIn:
		while (true) {
			if (henv.b) {
				var _v1 = henv.a;
				var hn1 = _v1.a;
				var venv1 = _v1.b;
				var henv_ = henv.b;
				if (_Utils_eq(hn, hn1) && _Utils_eq(venv, venv1)) {
					return true;
				} else {
					var $temp$hn = hn,
						$temp$venv = venv,
						$temp$henv = henv_;
					hn = $temp$hn;
					venv = $temp$venv;
					henv = $temp$henv;
					continue elemIn;
				}
			} else {
				return false;
			}
		}
	});
var $author$project$LangUtils$union = F2(
	function (henv1, henv2) {
		union:
		while (true) {
			if (henv2.b) {
				var _v1 = henv2.a;
				var hn2 = _v1.a;
				var venv2 = _v1.b;
				var v2 = _v1.c;
				var henv2_ = henv2.b;
				if (A3($author$project$LangUtils$elemIn, hn2, venv2, henv1)) {
					var $temp$henv1 = henv1,
						$temp$henv2 = henv2_;
					henv1 = $temp$henv1;
					henv2 = $temp$henv2;
					continue union;
				} else {
					return A2(
						$elm$core$List$cons,
						_Utils_Tuple3(hn2, venv2, v2),
						A2($author$project$LangUtils$union, henv1, henv2_));
				}
			} else {
				return henv1;
			}
		}
	});
var $author$project$LangUtils$mergeHEnv3 = F3(
	function (henv, henv1, henv2) {
		if (henv.b) {
			var _v1 = henv.a;
			var hn = _v1.a;
			var venv = _v1.b;
			var v = _v1.c;
			var henv_ = henv.b;
			var _v2 = A3($author$project$LangUtils$getElem, hn, venv, henv2);
			var v2 = _v2.a;
			var henv2_ = _v2.b;
			var newE2 = _Utils_Tuple3(hn, venv, v2);
			var _v3 = A3($author$project$LangUtils$getElem, hn, venv, henv1);
			var v1 = _v3.a;
			var henv1_ = _v3.b;
			var resMerge = A3($author$project$LangUtils$mergeHEnv3, henv_, henv1_, henv2_);
			var newE1 = _Utils_Tuple3(hn, venv, v1);
			if (v1.$ === 'VError') {
				return A2($elm$core$List$cons, newE2, resMerge);
			} else {
				return (!_Utils_eq(v1, v)) ? A2($elm$core$List$cons, newE1, resMerge) : A2($elm$core$List$cons, newE2, resMerge);
			}
		} else {
			return A2($author$project$LangUtils$union, henv1, henv2);
		}
	});
var $author$project$LangUtils$mergeHEnv4 = F4(
	function (henv, henv1, henv2, henv3) {
		if (henv.b) {
			var _v1 = henv.a;
			var hn = _v1.a;
			var venv = _v1.b;
			var v = _v1.c;
			var henv_ = henv.b;
			var _v2 = A3($author$project$LangUtils$getElem, hn, venv, henv3);
			var v3 = _v2.a;
			var henv3_ = _v2.b;
			var newE3 = _Utils_Tuple3(hn, venv, v3);
			var _v3 = A3($author$project$LangUtils$getElem, hn, venv, henv2);
			var v2 = _v3.a;
			var henv2_ = _v3.b;
			var newE2 = _Utils_Tuple3(hn, venv, v2);
			var _v4 = A3($author$project$LangUtils$getElem, hn, venv, henv1);
			var v1 = _v4.a;
			var henv1_ = _v4.b;
			var resMerge = A4($author$project$LangUtils$mergeHEnv4, henv_, henv1_, henv2_, henv3_);
			var newE1 = _Utils_Tuple3(hn, venv, v1);
			if (v1.$ === 'VError') {
				return A2($elm$core$List$cons, newE2, resMerge);
			} else {
				return (!_Utils_eq(v1, v)) ? A2($elm$core$List$cons, newE1, resMerge) : ((!_Utils_eq(v2, v)) ? A2($elm$core$List$cons, newE2, resMerge) : A2($elm$core$List$cons, newE3, resMerge));
			}
		} else {
			return A2(
				$author$project$LangUtils$union,
				A2($author$project$LangUtils$union, henv1, henv2),
				henv3);
		}
	});
var $author$project$LangUtils$mergeVEnv = F3(
	function (venv1, venv2, venv3) {
		var _v0 = _Utils_Tuple3(venv1, venv2, venv3);
		if ((_v0.a.b && _v0.b.b) && _v0.c.b) {
			var _v1 = _v0.a;
			var _v2 = _v1.a;
			var s1 = _v2.a;
			var v1 = _v2.b;
			var env1 = _v1.b;
			var _v3 = _v0.b;
			var _v4 = _v3.a;
			var s2 = _v4.a;
			var v2 = _v4.b;
			var env2 = _v3.b;
			var _v5 = _v0.c;
			var _v6 = _v5.a;
			var v3 = _v6.b;
			var env3 = _v5.b;
			var _v7 = _Utils_Tuple2(v1, v3);
			if ((((_v7.a.$ === 'VClosure') && (_v7.b.$ === 'VFix')) && (_v7.b.a.$ === 'ELam')) && (_v7.b.a.c.$ === 'ELam')) {
				var _v8 = _v7.a;
				var b1 = _v8.b;
				var _v9 = _v7.b.a;
				var _v10 = _v9.c;
				var b2 = _v10.c;
				return (!_Utils_eq(b1, b2)) ? A2(
					$elm$core$List$cons,
					_Utils_Tuple2(s1, v1),
					A3($author$project$LangUtils$mergeVEnv, env1, env2, env3)) : A2(
					$elm$core$List$cons,
					_Utils_Tuple2(s2, v2),
					A3($author$project$LangUtils$mergeVEnv, env1, env2, env3));
			} else {
				return (!_Utils_eq(v1, v3)) ? A2(
					$elm$core$List$cons,
					_Utils_Tuple2(s1, v1),
					A3($author$project$LangUtils$mergeVEnv, env1, env2, env3)) : A2(
					$elm$core$List$cons,
					_Utils_Tuple2(s2, v2),
					A3($author$project$LangUtils$mergeVEnv, env1, env2, env3));
			}
		} else {
			return _List_Nil;
		}
	});
var $author$project$LangUtils$mergeVEnv4 = F4(
	function (venv1, venv2, venv3, venv4) {
		var _v0 = _Utils_Tuple2(
			_Utils_Tuple3(venv1, venv2, venv3),
			venv4);
		if (((_v0.a.a.b && _v0.a.b.b) && _v0.a.c.b) && _v0.b.b) {
			var _v1 = _v0.a;
			var _v2 = _v1.a;
			var _v3 = _v2.a;
			var s1 = _v3.a;
			var v1 = _v3.b;
			var env1 = _v2.b;
			var _v4 = _v1.b;
			var _v5 = _v4.a;
			var s2 = _v5.a;
			var v2 = _v5.b;
			var env2 = _v4.b;
			var _v6 = _v1.c;
			var _v7 = _v6.a;
			var s3 = _v7.a;
			var v3 = _v7.b;
			var env3 = _v6.b;
			var _v8 = _v0.b;
			var _v9 = _v8.a;
			var v4 = _v9.b;
			var env4 = _v8.b;
			var _v10 = _Utils_Tuple2(v1, v4);
			if ((((_v10.a.$ === 'VClosure') && (_v10.b.$ === 'VFix')) && (_v10.b.a.$ === 'ELam')) && (_v10.b.a.c.$ === 'ELam')) {
				var _v11 = _v10.a;
				var b1 = _v11.b;
				var _v12 = _v10.b.a;
				var _v13 = _v12.c;
				var b2 = _v13.c;
				return (!_Utils_eq(b1, b2)) ? A2(
					$elm$core$List$cons,
					_Utils_Tuple2(s1, v1),
					A4($author$project$LangUtils$mergeVEnv4, env1, env2, env3, env4)) : A2(
					$elm$core$List$cons,
					_Utils_Tuple2(s2, v2),
					A4($author$project$LangUtils$mergeVEnv4, env1, env2, env3, env4));
			} else {
				if (!_Utils_eq(v1, v4)) {
					return A2(
						$elm$core$List$cons,
						_Utils_Tuple2(s1, v1),
						A4($author$project$LangUtils$mergeVEnv4, env1, env2, env3, env4));
				} else {
					var _v14 = _Utils_Tuple2(v2, v4);
					if ((((_v14.a.$ === 'VClosure') && (_v14.b.$ === 'VFix')) && (_v14.b.a.$ === 'ELam')) && (_v14.b.a.c.$ === 'ELam')) {
						var _v15 = _v14.a;
						var b1 = _v15.b;
						var _v16 = _v14.b.a;
						var _v17 = _v16.c;
						var b2 = _v17.c;
						return (!_Utils_eq(b1, b2)) ? A2(
							$elm$core$List$cons,
							_Utils_Tuple2(s2, v2),
							A4($author$project$LangUtils$mergeVEnv4, env1, env2, env3, env4)) : A2(
							$elm$core$List$cons,
							_Utils_Tuple2(s3, v3),
							A4($author$project$LangUtils$mergeVEnv4, env1, env2, env3, env4));
					} else {
						return (!_Utils_eq(v2, v4)) ? A2(
							$elm$core$List$cons,
							_Utils_Tuple2(s2, v2),
							A4($author$project$LangUtils$mergeVEnv4, env1, env2, env3, env4)) : A2(
							$elm$core$List$cons,
							_Utils_Tuple2(s3, v3),
							A4($author$project$LangUtils$mergeVEnv4, env1, env2, env3, env4));
					}
				}
			}
		} else {
			return _List_Nil;
		}
	});
var $author$project$Parser_$vChar = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (c) {
				return $author$project$Syntax$VChar(c);
			}),
		$elm$parser$Parser$symbol('\'')),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser_$char_,
			$elm$parser$Parser$symbol('\'')),
		$elm$parser$Parser$spaces));
var $author$project$Parser_$vFalse = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Syntax$VFalse),
		$elm$parser$Parser$keyword('false')),
	$elm$parser$Parser$spaces);
var $author$project$Parser_$vFloat = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($author$project$Syntax$VFloat),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$number(
					{
						binary: $elm$core$Maybe$Nothing,
						_float: $elm$core$Maybe$Just($elm$core$Basics$identity),
						hex: $elm$core$Maybe$Nothing,
						_int: $elm$core$Maybe$Nothing,
						octal: $elm$core$Maybe$Nothing
					}),
				$elm$parser$Parser$spaces)),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (n) {
						return $author$project$Syntax$VFloat(-n);
					}),
				$elm$parser$Parser$symbol('-')),
			A2($elm$parser$Parser$ignorer, $elm$parser$Parser$float, $elm$parser$Parser$spaces))
		]));
var $author$project$LangUtils$removeIndexFromVenv = function (venv) {
	if (venv.b) {
		var _v1 = venv.a;
		var s = _v1.b;
		var v = _v1.c;
		var vs = venv.b;
		if (v.$ === 'IndexedHole') {
			var hn = v.a;
			var venv1 = v.b;
			var venv2 = $author$project$LangUtils$removeIndexFromVenv(venv1);
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					s,
					A2($author$project$Syntax$VHole, hn, venv2)),
				$author$project$LangUtils$removeIndexFromVenv(vs));
		} else {
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(s, v),
				$author$project$LangUtils$removeIndexFromVenv(vs));
		}
	} else {
		return _List_Nil;
	}
};
var $author$project$Parser_$findContext = F2(
	function (context, hn) {
		findContext:
		while (true) {
			if (!context.b) {
				return A2($author$project$Syntax$VHole, hn, _List_Nil);
			} else {
				if (context.a.$ === 'IndexedHole') {
					var _v1 = context.a;
					var hn_ = _v1.a;
					var venv = _v1.b;
					var ct = context.b;
					if (_Utils_eq(hn_, hn)) {
						return A2(
							$author$project$Syntax$VHole,
							hn,
							$author$project$LangUtils$removeIndexFromVenv(venv));
					} else {
						var $temp$context = ct,
							$temp$hn = hn;
						context = $temp$context;
						hn = $temp$hn;
						continue findContext;
					}
				} else {
					return $author$project$Syntax$VError('Impossible');
				}
			}
		}
	});
var $author$project$Parser_$hfieldOp = _List_fromArray(
	[
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Syntax$HField),
					$elm$parser$Parser$symbol('·')),
				$elm$parser$Parser$spaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		])
	]);
var $author$project$Parser_$hid = A2(
	$elm$parser$Parser$keeper,
	$elm$parser$Parser$succeed($author$project$Syntax$HId),
	$elm$parser$Parser$int);
var $author$project$Parser_$hinst = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (n1, n2) {
					return A2(
						$author$project$Syntax$HInst,
						$author$project$Syntax$HOri(n1),
						n2);
				})),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2($elm$parser$Parser$ignorer, $elm$parser$Parser$int, $elm$parser$Parser$spaces),
				$elm$parser$Parser$symbol('_')),
			$elm$parser$Parser$spaces)),
	$elm$parser$Parser$int);
var $author$project$Parser_$hinter = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($author$project$Syntax$HInter),
			$elm$parser$Parser$symbol('*')),
		$elm$parser$Parser$spaces),
	$elm$parser$Parser$int);
var $author$project$Parser_$hterm = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$backtrackable($author$project$Parser_$hinst),
			$author$project$Parser_$hinter,
			$author$project$Parser_$hid
		]));
var $author$project$Parser_$holename = A2($Punie$elm_parser_extras$Parser$Expression$buildExpressionParser, $author$project$Parser_$hfieldOp, $author$project$Parser_$hterm);
var $author$project$Parser_$vHole = function (context) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					$author$project$Parser_$findContext(context)),
				$elm$parser$Parser$symbol('{')),
			$elm$parser$Parser$spaces),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2($elm$parser$Parser$ignorer, $author$project$Parser_$holename, $elm$parser$Parser$spaces),
				$elm$parser$Parser$symbol('}')),
			$elm$parser$Parser$spaces));
};
var $author$project$Parser_$vInt = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($author$project$Syntax$VInt),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$number(
					{
						binary: $elm$core$Maybe$Just($elm$core$Basics$identity),
						_float: $elm$core$Maybe$Nothing,
						hex: $elm$core$Maybe$Just($elm$core$Basics$identity),
						_int: $elm$core$Maybe$Just($elm$core$Basics$identity),
						octal: $elm$core$Maybe$Just($elm$core$Basics$identity)
					}),
				$elm$parser$Parser$spaces)),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (n) {
						return $author$project$Syntax$VInt(-n);
					}),
				$elm$parser$Parser$symbol('-')),
			A2($elm$parser$Parser$ignorer, $elm$parser$Parser$int, $elm$parser$Parser$spaces))
		]));
var $author$project$Parser_$vNil = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					$author$project$Syntax$VNil($author$project$Syntax$voId)),
				$elm$parser$Parser$symbol('[')),
			$elm$parser$Parser$spaces),
		$elm$parser$Parser$symbol(']')),
	$elm$parser$Parser$spaces);
var $author$project$Parser_$stringToValue = function (s) {
	if (!s.b) {
		return $author$project$Syntax$VNil($author$project$Syntax$vsId);
	} else {
		var c = s.a;
		var cs = s.b;
		return A3(
			$author$project$Syntax$VCons,
			$author$project$Syntax$vsId,
			$author$project$Syntax$VChar(c),
			$author$project$Parser_$stringToValue(cs));
	}
};
var $author$project$Parser_$vString = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (s) {
				return $author$project$Parser_$stringToValue(
					$elm$core$String$toList(s));
			}),
		$elm$parser$Parser$symbol('\"')),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser_$string_,
			$elm$parser$Parser$symbol('\"')),
		$elm$parser$Parser$spaces));
var $author$project$Parser_$vTrue = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Syntax$VTrue),
		$elm$parser$Parser$keyword('true')),
	$elm$parser$Parser$spaces);
var $author$project$Parser_$valueListToVCons = function (ls) {
	if (!ls.b) {
		return $author$project$Syntax$VNil($author$project$Syntax$voId);
	} else {
		var v = ls.a;
		var vs = ls.b;
		return A3(
			$author$project$Syntax$VCons,
			$author$project$Syntax$voId,
			v,
			$author$project$Parser_$valueListToVCons(vs));
	}
};
var $author$project$Parser_$vBtuple = function (context) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Syntax$VBTuple),
					$elm$parser$Parser$symbol('(')),
				$elm$parser$Parser$spaces),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v7) {
							return $author$project$Parser_$value(context);
						}),
					$elm$parser$Parser$symbol(',')),
				$elm$parser$Parser$spaces)),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v8) {
						return $author$project$Parser_$value(context);
					}),
				$elm$parser$Parser$symbol(')')),
			$elm$parser$Parser$spaces));
};
var $author$project$Parser_$vList = function (context) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						$author$project$Syntax$VCons($author$project$Syntax$voId)),
					$elm$parser$Parser$symbol('[')),
				$elm$parser$Parser$spaces),
			$elm$parser$Parser$lazy(
				function (_v6) {
					return $author$project$Parser_$value(context);
				})),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$Parser_$vListloop(context),
				$elm$parser$Parser$symbol(']')),
			$elm$parser$Parser$spaces));
};
var $author$project$Parser_$vListHelper = F2(
	function (context, revValues) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(
								function (e) {
									return $elm$parser$Parser$Loop(
										A2($elm$core$List$cons, e, revValues));
								}),
							$elm$parser$Parser$symbol(',')),
						$elm$parser$Parser$spaces),
					$elm$parser$Parser$lazy(
						function (_v4) {
							return $author$project$Parser_$value(context);
						})),
					A2(
					$elm$parser$Parser$map,
					function (_v5) {
						return $elm$parser$Parser$Done(
							$elm$core$List$reverse(revValues));
					},
					$elm$parser$Parser$succeed(_Utils_Tuple0))
				]));
	});
var $author$project$Parser_$vListloop = function (context) {
	return A2(
		$elm$parser$Parser$map,
		$author$project$Parser_$valueListToVCons,
		A2(
			$elm$parser$Parser$loop,
			_List_Nil,
			$author$project$Parser_$vListHelper(context)));
};
var $author$project$Parser_$vTtuple = function (context) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($author$project$Syntax$VTTuple),
						$elm$parser$Parser$symbol('(')),
					$elm$parser$Parser$spaces),
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v1) {
								return $author$project$Parser_$value(context);
							}),
						$elm$parser$Parser$symbol(',')),
					$elm$parser$Parser$spaces)),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v2) {
							return $author$project$Parser_$value(context);
						}),
					$elm$parser$Parser$symbol(',')),
				$elm$parser$Parser$spaces)),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v3) {
						return $author$project$Parser_$value(context);
					}),
				$elm$parser$Parser$symbol(')')),
			$elm$parser$Parser$spaces));
};
var $author$project$Parser_$value = function (context) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$elm$parser$Parser$backtrackable($author$project$Parser_$vInt),
				$elm$parser$Parser$backtrackable($author$project$Parser_$vFloat),
				$author$project$Parser_$vTrue,
				$author$project$Parser_$vFalse,
				$elm$parser$Parser$backtrackable($author$project$Parser_$vNil),
				$elm$parser$Parser$lazy(
				function (_v0) {
					return $author$project$Parser_$vList(context);
				}),
				$author$project$Parser_$vHole(context),
				$elm$parser$Parser$backtrackable(
				$author$project$Parser_$vBtuple(context)),
				$author$project$Parser_$vTtuple(context),
				$author$project$Parser_$vChar,
				$author$project$Parser_$vString
			]));
};
var $author$project$Parser_$parseVal = F2(
	function (s, context) {
		return A2(
			$elm$parser$Parser$run,
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$Parser_$value(context),
				$elm$parser$Parser$end),
			s);
	});
var $author$project$LangUtils$patternSubst = F2(
	function (env, p) {
		switch (p.$) {
			case 'PVar':
				var s = p.b;
				var _v1 = A2($author$project$LangUtils$findVarByName, s, env);
				if (_v1.$ === 'Just') {
					var val = _v1.a;
					return val;
				} else {
					return $author$project$Syntax$VError('Pattern Substitution Error: 01.');
				}
			case 'PCons':
				var _v2 = p.a;
				var id = _v2.b;
				var p1 = p.b;
				var p2 = p.c;
				return (_Utils_eq(id, $author$project$Syntax$psQuo) || _Utils_eq(id, $author$project$Syntax$psElm)) ? A3(
					$author$project$Syntax$VCons,
					$author$project$Syntax$vsId,
					A2($author$project$LangUtils$patternSubst, env, p1),
					A2($author$project$LangUtils$patternSubst, env, p2)) : A3(
					$author$project$Syntax$VCons,
					$author$project$Syntax$voId,
					A2($author$project$LangUtils$patternSubst, env, p1),
					A2($author$project$LangUtils$patternSubst, env, p2));
			case 'PBTuple':
				var p1 = p.b;
				var p2 = p.c;
				return A2(
					$author$project$Syntax$VBTuple,
					A2($author$project$LangUtils$patternSubst, env, p1),
					A2($author$project$LangUtils$patternSubst, env, p2));
			case 'PTTuple':
				var p1 = p.b;
				var p2 = p.c;
				var p3 = p.d;
				return A3(
					$author$project$Syntax$VTTuple,
					A2($author$project$LangUtils$patternSubst, env, p1),
					A2($author$project$LangUtils$patternSubst, env, p2),
					A2($author$project$LangUtils$patternSubst, env, p3));
			case 'PNil':
				var _v3 = p.a;
				var id = _v3.b;
				return ((id === 3) || (id === 4)) ? $author$project$Syntax$VNil(1) : $author$project$Syntax$VNil(0);
			case 'PInt':
				var n = p.b;
				return $author$project$Syntax$VInt(n);
			case 'PFloat':
				var n = p.b;
				return $author$project$Syntax$VFloat(n);
			case 'PTrue':
				return $author$project$Syntax$VTrue;
			case 'PFalse':
				return $author$project$Syntax$VFalse;
			default:
				var c = p.b;
				return $author$project$Syntax$VChar(c);
		}
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$LangUtils$updateBranch = F3(
	function (branch, choice, e) {
		switch (branch.$) {
			case 'BNSin':
				var ws = branch.a;
				var n = branch.b;
				var p = branch.c;
				var expr = branch.d;
				return _Utils_eq(choice, n) ? A4($author$project$Syntax$BNSin, ws, n, p, e) : A4($author$project$Syntax$BNSin, ws, n, p, expr);
			case 'BCom':
				var ws = branch.a;
				var b1 = branch.b;
				var b2 = branch.c;
				return A3(
					$author$project$Syntax$BCom,
					ws,
					A3($author$project$LangUtils$updateBranch, b1, choice, e),
					A3($author$project$LangUtils$updateBranch, b2, choice, e));
			default:
				var b = branch;
				return b;
		}
	});
var $author$project$LangUtils$updateElmInVenv = F3(
	function (s, v, venv) {
		if (!venv.b) {
			return _List_Nil;
		} else {
			var _v1 = venv.a;
			var s1 = _v1.a;
			var v1 = _v1.b;
			var vv = venv.b;
			return _Utils_eq(s1, s) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(s1, v),
				vv) : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(s1, v1),
				A3($author$project$LangUtils$updateElmInVenv, s, v, vv));
		}
	});
var $author$project$LangUtils$valueToExpr = F2(
	function (v, htotal) {
		switch (v.$) {
			case 'VNil':
				var id = v.a;
				switch (id) {
					case 0:
						return _Utils_Tuple2(
							$author$project$Syntax$ENil($author$project$Syntax$defaultWS),
							htotal);
					case 1:
						return _Utils_Tuple2(
							$author$project$Syntax$ENil($author$project$Syntax$defaultWS),
							htotal);
					default:
						return _Utils_Tuple2(
							$author$project$Syntax$EError('VNil Error'),
							0);
				}
			case 'VInt':
				var n = v.a;
				return _Utils_Tuple2(
					A2($author$project$Syntax$EInt, $author$project$Syntax$defaultWS, n),
					htotal);
			case 'VFloat':
				var n = v.a;
				return _Utils_Tuple2(
					A2($author$project$Syntax$EFloat, $author$project$Syntax$defaultWS, n),
					htotal);
			case 'VTrue':
				return _Utils_Tuple2(
					$author$project$Syntax$ETrue($author$project$Syntax$defaultWS),
					htotal);
			case 'VFalse':
				return _Utils_Tuple2(
					$author$project$Syntax$EFalse($author$project$Syntax$defaultWS),
					htotal);
			case 'VChar':
				var c = v.a;
				return _Utils_Tuple2(
					A2($author$project$Syntax$EChar, $author$project$Syntax$defaultWS, c),
					htotal);
			case 'VCons':
				var v1 = v.b;
				var v2 = v.c;
				var _v2 = A2($author$project$LangUtils$valueToExpr, v1, htotal);
				var e1 = _v2.a;
				var htotal1 = _v2.b;
				var _v3 = A2($author$project$LangUtils$valueToExpr, v2, htotal1);
				var e2 = _v3.a;
				var htotal2 = _v3.b;
				return _Utils_Tuple2(
					A3($author$project$Syntax$ECons, $author$project$Syntax$defaultWS, e1, e2),
					htotal2);
			case 'VBTuple':
				var v1 = v.a;
				var v2 = v.b;
				var _v4 = A2($author$project$LangUtils$valueToExpr, v1, htotal);
				var e1 = _v4.a;
				var htotal1 = _v4.b;
				var _v5 = A2($author$project$LangUtils$valueToExpr, v2, htotal1);
				var e2 = _v5.a;
				var htotal2 = _v5.b;
				return _Utils_Tuple2(
					A3($author$project$Syntax$EBTuple, $author$project$Syntax$defaultWS, e1, e2),
					htotal2);
			case 'VTTuple':
				var v1 = v.a;
				var v2 = v.b;
				var v3 = v.c;
				var _v6 = A2($author$project$LangUtils$valueToExpr, v1, htotal);
				var e1 = _v6.a;
				var htotal1 = _v6.b;
				var _v7 = A2($author$project$LangUtils$valueToExpr, v2, htotal1);
				var e2 = _v7.a;
				var htotal2 = _v7.b;
				var _v8 = A2($author$project$LangUtils$valueToExpr, v3, htotal2);
				var e3 = _v8.a;
				var htotal3 = _v8.b;
				return _Utils_Tuple2(
					A4($author$project$Syntax$ETTuple, $author$project$Syntax$defaultWS, e1, e2, e3),
					htotal3);
			case 'VHole':
				return _Utils_Tuple2(
					A2(
						$author$project$Syntax$EHole,
						$author$project$Syntax$defaultWS,
						$author$project$Syntax$HOri(htotal)),
					htotal + 1);
			default:
				return _Utils_Tuple2(
					$author$project$Syntax$EError(
						'Can Not Transfer Value: ' + ($elm$core$Debug$toString(v) + ' To Expression.')),
					htotal);
		}
	});
var $author$project$UnEval$vconsToString = function (v) {
	_v0$2:
	while (true) {
		switch (v.$) {
			case 'VNil':
				if (v.a === 1) {
					return '';
				} else {
					break _v0$2;
				}
			case 'VCons':
				if ((v.a === 1) && (v.b.$ === 'VChar')) {
					var c = v.b.a;
					var v2 = v.c;
					return _Utils_ap(
						$elm$core$String$fromChar(c),
						$author$project$UnEval$vconsToString(v2));
				} else {
					break _v0$2;
				}
			default:
				break _v0$2;
		}
	}
	return 'VCons To String Error.';
};
var $author$project$LangUtils$vlength = function (v) {
	switch (v.$) {
		case 'VNil':
			return 0;
		case 'VCons':
			var vs = v.c;
			return 1 + $author$project$LangUtils$vlength(vs);
		default:
			return -1;
	}
};
var $author$project$UnEval$arith = F8(
	function (ws, e1, e2, henv, venv, newv, htotal, op) {
		var _v147 = A4($author$project$Eval$eval, henv, venv, e2, _List_Nil);
		var v2 = _v147.a;
		var _v148 = A4($author$project$Eval$eval, henv, venv, e1, _List_Nil);
		var v1 = _v148.a;
		switch (newv.$) {
			case 'VHole':
				var venv_ = newv.b;
				if (v1.$ === 'VHole') {
					var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
					return {
						expr: A4($author$project$Syntax$EBPrim, ws, op, e1, e2),
						henv: henv,
						htotal: htotal,
						venv: newvenv
					};
				} else {
					if (v2.$ === 'VHole') {
						var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
						return {
							expr: A4($author$project$Syntax$EBPrim, ws, op, e1, e2),
							henv: henv,
							htotal: htotal,
							venv: newvenv
						};
					} else {
						var res = A5($author$project$UnEval$uneval, henv, venv, e2, newv, htotal);
						return {
							expr: A4($author$project$Syntax$EBPrim, ws, op, e1, res.expr),
							henv: res.henv,
							htotal: res.htotal,
							venv: res.venv
						};
					}
				}
			case 'VInt':
				var n = newv.a;
				var _v152 = function () {
					var _v153 = _Utils_Tuple2(v1, v2);
					_v153$4:
					while (true) {
						_v153$6:
						while (true) {
							switch (_v153.a.$) {
								case 'VHole':
									switch (_v153.b.$) {
										case 'VHole':
											var _v154 = _v153.a;
											var _v155 = _v153.b;
											switch (op.$) {
												case 'Add':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n),
														$author$project$Syntax$VInt(0));
												case 'Sub':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n),
														$author$project$Syntax$VInt(0));
												case 'Mul':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n),
														$author$project$Syntax$VInt(1));
												case 'Div':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n),
														$author$project$Syntax$VInt(1));
												case 'DDiv':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n),
														$author$project$Syntax$VInt(1));
												default:
													return _Utils_Tuple2(
														$author$project$Syntax$VError(''),
														$author$project$Syntax$VError(''));
											}
										case 'VInt':
											var _v159 = _v153.a;
											var n2 = _v153.b.a;
											switch (op.$) {
												case 'Add':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n - n2),
														$author$project$Syntax$VInt(n2));
												case 'Sub':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n + n2),
														$author$project$Syntax$VInt(n2));
												case 'Mul':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n / n2),
														$author$project$Syntax$VInt(n2));
												case 'Div':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n * n2),
														$author$project$Syntax$VInt(n2));
												case 'DDiv':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n * n2),
														$author$project$Syntax$VInt(n2));
												default:
													return _Utils_Tuple2(
														$author$project$Syntax$VError(''),
														$author$project$Syntax$VError(''));
											}
										case 'VFloat':
											break _v153$4;
										default:
											break _v153$6;
									}
								case 'VFloat':
									var n1 = _v153.a.a;
									switch (op.$) {
										case 'Add':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n - n1));
										case 'Sub':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n1 - n));
										case 'Mul':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n / n1));
										case 'Div':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n1 / n));
										case 'DDiv':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n1 / n));
										default:
											return _Utils_Tuple2(
												$author$project$Syntax$VError(''),
												$author$project$Syntax$VError(''));
									}
								case 'VInt':
									switch (_v153.b.$) {
										case 'VHole':
											var n1 = _v153.a.a;
											var _v157 = _v153.b;
											switch (op.$) {
												case 'Add':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt(n - n1));
												case 'Sub':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt(n1 - n));
												case 'Mul':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VFloat(n / n1));
												case 'Div':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt((n1 / n) | 0));
												case 'DDiv':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VFloat(n1 / n));
												default:
													return _Utils_Tuple2(
														$author$project$Syntax$VError(''),
														$author$project$Syntax$VError(''));
											}
										case 'VFloat':
											break _v153$4;
										case 'VInt':
											var n1 = _v153.a.a;
											var n2 = _v153.b.a;
											switch (op.$) {
												case 'Add':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt(n - n1));
												case 'Sub':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt(n1 - n));
												case 'Mul':
													return _Utils_eq(n1 * n2, n) ? _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt(n2)) : _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt((n / n1) | 0));
												case 'Div':
													return _Utils_eq((n1 / n2) | 0, n) ? _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt(n2)) : _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt((n1 / n) | 0));
												case 'DDiv':
													return _Utils_eq((n1 / n2) | 0, n) ? _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt(n2)) : _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt((n1 / n) | 0));
												default:
													return _Utils_Tuple2(
														$author$project$Syntax$VError(''),
														$author$project$Syntax$VError(''));
											}
										default:
											break _v153$6;
									}
								default:
									if (_v153.b.$ === 'VFloat') {
										break _v153$4;
									} else {
										break _v153$6;
									}
							}
						}
						return _Utils_Tuple2(
							$author$project$Syntax$VError(''),
							$author$project$Syntax$VError(''));
					}
					var n2 = _v153.b.a;
					switch (op.$) {
						case 'Add':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n - n2),
								$author$project$Syntax$VFloat(n2));
						case 'Sub':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n + n2),
								$author$project$Syntax$VFloat(n2));
						case 'Mul':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n / n2),
								$author$project$Syntax$VFloat(n2));
						case 'Div':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n * n2),
								$author$project$Syntax$VFloat(n2));
						case 'DDiv':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n * n2),
								$author$project$Syntax$VFloat(n2));
						default:
							return _Utils_Tuple2(
								$author$project$Syntax$VError(''),
								$author$project$Syntax$VError(''));
					}
				}();
				var newv1 = _v152.a;
				var newv2 = _v152.b;
				var _v164 = _Utils_Tuple2(newv1, newv2);
				if ((_v164.a.$ === 'VError') && (_v164.b.$ === 'VError')) {
					return {
						expr: $author$project$Syntax$EError('Missing Information or Operands Type Error: 01.'),
						henv: _List_Nil,
						htotal: 0,
						venv: _List_Nil
					};
				} else {
					return $author$project$UnEval$checkChange(henv)(venv)(htotal)(ws)(op)(e1)(e2)(v1)(v2)(newv1)(newv2);
				}
			case 'VFloat':
				var n = newv.a;
				var _v165 = function () {
					var _v166 = _Utils_Tuple2(v1, v2);
					_v166$4:
					while (true) {
						_v166$6:
						while (true) {
							switch (_v166.a.$) {
								case 'VHole':
									switch (_v166.b.$) {
										case 'VHole':
											var _v167 = _v166.a;
											var _v168 = _v166.b;
											switch (op.$) {
												case 'Add':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n),
														$author$project$Syntax$VFloat(0));
												case 'Sub':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n),
														$author$project$Syntax$VFloat(0));
												case 'Mul':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n),
														$author$project$Syntax$VFloat(1));
												case 'Div':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n),
														$author$project$Syntax$VFloat(1));
												case 'DDiv':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n),
														$author$project$Syntax$VFloat(1));
												default:
													return _Utils_Tuple2(
														$author$project$Syntax$VError(''),
														$author$project$Syntax$VError(''));
											}
										case 'VInt':
											var _v172 = _v166.a;
											var n2 = _v166.b.a;
											switch (op.$) {
												case 'Add':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n - n2),
														$author$project$Syntax$VInt(n2));
												case 'Sub':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n + n2),
														$author$project$Syntax$VInt(n2));
												case 'Mul':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n / n2),
														$author$project$Syntax$VInt(n2));
												case 'Div':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(
															$elm$core$Basics$round(n) * n2),
														$author$project$Syntax$VInt(n2));
												case 'DDiv':
													return _Utils_Tuple2(
														$author$project$Syntax$VFloat(n * n2),
														$author$project$Syntax$VInt(n2));
												default:
													return _Utils_Tuple2(
														$author$project$Syntax$VError(''),
														$author$project$Syntax$VError(''));
											}
										case 'VFloat':
											break _v166$4;
										default:
											break _v166$6;
									}
								case 'VFloat':
									var n1 = _v166.a.a;
									switch (op.$) {
										case 'Add':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n - n1));
										case 'Sub':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n1 - n));
										case 'Mul':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n / n1));
										case 'Div':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n1 / n));
										case 'DDiv':
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n1),
												$author$project$Syntax$VFloat(n1 / n));
										default:
											return _Utils_Tuple2(
												$author$project$Syntax$VError(''),
												$author$project$Syntax$VError(''));
									}
								case 'VInt':
									switch (_v166.b.$) {
										case 'VHole':
											var n1 = _v166.a.a;
											var _v170 = _v166.b;
											switch (op.$) {
												case 'Add':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VFloat(n - n1));
												case 'Sub':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VFloat(n1 - n));
												case 'Mul':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VFloat(n / n1));
												case 'Div':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VInt(
															(n1 / $elm$core$Basics$round(n)) | 0));
												case 'DDiv':
													return _Utils_Tuple2(
														$author$project$Syntax$VInt(n1),
														$author$project$Syntax$VFloat(n1 / n));
												default:
													return _Utils_Tuple2(
														$author$project$Syntax$VError(''),
														$author$project$Syntax$VError(''));
											}
										case 'VFloat':
											break _v166$4;
										case 'VInt':
											var n1 = _v166.a.a;
											if (op.$ === 'DDiv') {
												return _Utils_Tuple2(
													$author$project$Syntax$VInt(n1),
													$author$project$Syntax$VInt(
														$elm$core$Basics$round(n1 / n)));
											} else {
												return _Utils_Tuple2(
													$author$project$Syntax$VError(''),
													$author$project$Syntax$VError(''));
											}
										default:
											break _v166$6;
									}
								default:
									if (_v166.b.$ === 'VFloat') {
										break _v166$4;
									} else {
										break _v166$6;
									}
							}
						}
						return _Utils_Tuple2(
							$author$project$Syntax$VError(''),
							$author$project$Syntax$VError(''));
					}
					var n2 = _v166.b.a;
					switch (op.$) {
						case 'Add':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n - n2),
								$author$project$Syntax$VFloat(n2));
						case 'Sub':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n + n2),
								$author$project$Syntax$VFloat(n2));
						case 'Mul':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n / n2),
								$author$project$Syntax$VFloat(n2));
						case 'Div':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n * n2),
								$author$project$Syntax$VFloat(n2));
						case 'DDiv':
							return _Utils_Tuple2(
								$author$project$Syntax$VFloat(n * n2),
								$author$project$Syntax$VFloat(n2));
						default:
							return _Utils_Tuple2(
								$author$project$Syntax$VError(''),
								$author$project$Syntax$VError(''));
					}
				}();
				var newv1 = _v165.a;
				var newv2 = _v165.b;
				var _v177 = _Utils_Tuple2(newv1, newv2);
				if ((_v177.a.$ === 'VError') && (_v177.b.$ === 'VError')) {
					return {
						expr: $author$project$Syntax$EError('Missing Informatin or Operands Type Error: 02.'),
						henv: _List_Nil,
						htotal: 0,
						venv: _List_Nil
					};
				} else {
					return $author$project$UnEval$checkChange(henv)(venv)(htotal)(ws)(op)(e1)(e2)(v1)(v2)(newv1)(newv2);
				}
			case 'VCons':
				if (_Utils_eq(op, $author$project$Syntax$Cat)) {
					var _v178 = A2(
						$author$project$LangUtils$deAppend,
						newv,
						$author$project$LangUtils$vlength(v1));
					var newv1 = _v178.a;
					var newv2 = _v178.b;
					return $author$project$UnEval$checkChange(henv)(venv)(htotal)(ws)(op)(e1)(e2)(v1)(v2)(newv1)(newv2);
				} else {
					return {
						expr: $author$project$Syntax$EError('Arith Expression Modified Value Type Error: 01.'),
						henv: _List_Nil,
						htotal: 0,
						venv: _List_Nil
					};
				}
			case 'VNil':
				return _Utils_eq(op, $author$project$Syntax$Cat) ? $author$project$UnEval$checkChange(henv)(venv)(htotal)(ws)(op)(e1)(e2)(v1)(v2)(newv)(newv) : {
					expr: $author$project$Syntax$EError('Arith Expression Modified Value Type Error: 02.'),
					henv: _List_Nil,
					htotal: 0,
					venv: _List_Nil
				};
			default:
				return {
					expr: $author$project$Syntax$EError('Arith Expression Modified Value Type Error: 03.'),
					henv: _List_Nil,
					htotal: 0,
					venv: _List_Nil
				};
		}
	});
var $author$project$UnEval$checkChange = function (henv) {
	return function (venv) {
		return function (htotal) {
			return function (ws) {
				return function (op) {
					return function (e1) {
						return function (e2) {
							return function (v1) {
								return function (v2) {
									return function (newv1) {
										return function (newv2) {
											if (_Utils_eq(newv1, v1) && _Utils_eq(newv2, v2)) {
												return {
													expr: A4($author$project$Syntax$EBPrim, ws, op, e1, e2),
													henv: henv,
													htotal: htotal,
													venv: venv
												};
											} else {
												if (_Utils_eq(newv1, v1)) {
													var res2 = A5($author$project$UnEval$uneval, henv, venv, e2, newv2, htotal);
													return {
														expr: A4($author$project$Syntax$EBPrim, ws, op, e1, res2.expr),
														henv: res2.henv,
														htotal: res2.htotal,
														venv: res2.venv
													};
												} else {
													if (_Utils_eq(newv2, v2)) {
														var res1 = A5($author$project$UnEval$uneval, henv, venv, e1, newv1, htotal);
														return {
															expr: A4($author$project$Syntax$EBPrim, ws, op, res1.expr, e2),
															henv: res1.henv,
															htotal: res1.htotal,
															venv: res1.venv
														};
													} else {
														var res1 = A5($author$project$UnEval$uneval, henv, venv, e1, newv1, htotal);
														var res2 = A5($author$project$UnEval$uneval, henv, venv, e2, newv2, res1.htotal);
														var newvenv = A3($author$project$LangUtils$mergeVEnv, res1.venv, res2.venv, venv);
														var newhenv = A3($author$project$LangUtils$mergeHEnv3, henv, res1.henv, res2.henv);
														return {
															expr: A4($author$project$Syntax$EBPrim, ws, op, res1.expr, res2.expr),
															henv: newhenv,
															htotal: res2.htotal,
															venv: newvenv
														};
													}
												}
											}
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$UnEval$comp = F8(
	function (ws, e1, e2, henv, venv, newv, htotal, op) {
		var _v119 = A4($author$project$Eval$eval, henv, venv, e2, _List_Nil);
		var v2 = _v119.a;
		var _v120 = A4($author$project$Eval$eval, henv, venv, e1, _List_Nil);
		var v1 = _v120.a;
		switch (newv.$) {
			case 'VTrue':
				if (op.$ === 'Eq') {
					var _v123 = function () {
						var _v124 = _Utils_Tuple2(v1, v2);
						_v124$8:
						while (true) {
							switch (_v124.a.$) {
								case 'VInt':
									if (_v124.b.$ === 'VHole') {
										var n1 = _v124.a.a;
										var _v125 = _v124.b;
										return _Utils_Tuple2(
											$author$project$Syntax$VInt(n1),
											$author$project$Syntax$VInt(n1));
									} else {
										break _v124$8;
									}
								case 'VFloat':
									if (_v124.b.$ === 'VHole') {
										var n1 = _v124.a.a;
										var _v127 = _v124.b;
										return _Utils_Tuple2(
											$author$project$Syntax$VFloat(n1),
											$author$project$Syntax$VFloat(n1));
									} else {
										break _v124$8;
									}
								case 'VTrue':
									if (_v124.b.$ === 'VHole') {
										var _v129 = _v124.a;
										var _v130 = _v124.b;
										return _Utils_Tuple2($author$project$Syntax$VTrue, $author$project$Syntax$VTrue);
									} else {
										break _v124$8;
									}
								case 'VFalse':
									if (_v124.b.$ === 'VHole') {
										var _v133 = _v124.a;
										var _v134 = _v124.b;
										return _Utils_Tuple2($author$project$Syntax$VFalse, $author$project$Syntax$VFalse);
									} else {
										break _v124$8;
									}
								case 'VHole':
									switch (_v124.b.$) {
										case 'VInt':
											var _v126 = _v124.a;
											var n2 = _v124.b.a;
											return _Utils_Tuple2(
												$author$project$Syntax$VInt(n2),
												$author$project$Syntax$VInt(n2));
										case 'VFloat':
											var _v128 = _v124.a;
											var n2 = _v124.b.a;
											return _Utils_Tuple2(
												$author$project$Syntax$VFloat(n2),
												$author$project$Syntax$VFloat(n2));
										case 'VTrue':
											var _v131 = _v124.a;
											var _v132 = _v124.b;
											return _Utils_Tuple2($author$project$Syntax$VTrue, $author$project$Syntax$VTrue);
										case 'VFalse':
											var _v135 = _v124.a;
											var _v136 = _v124.b;
											return _Utils_Tuple2($author$project$Syntax$VFalse, $author$project$Syntax$VFalse);
										default:
											break _v124$8;
									}
								default:
									break _v124$8;
							}
						}
						return _Utils_Tuple2(
							$author$project$Syntax$VError(''),
							$author$project$Syntax$VError(''));
					}();
					var newv1 = _v123.a;
					var newv2 = _v123.b;
					var _v137 = _Utils_Tuple2(newv1, newv2);
					if ((_v137.a.$ === 'VError') && (_v137.b.$ === 'VError')) {
						return {
							expr: $author$project$Syntax$EError('Missing Information, Cannot Infer: 01.'),
							henv: _List_Nil,
							htotal: 0,
							venv: _List_Nil
						};
					} else {
						return $author$project$UnEval$checkChange(henv)(venv)(htotal)(ws)(op)(e1)(e2)(v1)(v2)(newv1)(newv2);
					}
				} else {
					var _v138 = A4(
						$author$project$Eval$eval,
						henv,
						venv,
						A4($author$project$Syntax$EBPrim, ws, op, e1, e2),
						_List_Nil);
					var res = _v138.a;
					var newe = function () {
						switch (res.$) {
							case 'VTrue':
								return A4($author$project$Syntax$EBPrim, ws, op, e1, e2);
							case 'VFalse':
								switch (op.$) {
									case 'Lt':
										return A4($author$project$Syntax$EBPrim, ws, $author$project$Syntax$Ge, e1, e2);
									case 'Gt':
										return A4($author$project$Syntax$EBPrim, ws, $author$project$Syntax$Le, e1, e2);
									case 'Le':
										return A4($author$project$Syntax$EBPrim, ws, $author$project$Syntax$Gt, e1, e2);
									case 'Ge':
										return A4($author$project$Syntax$EBPrim, ws, $author$project$Syntax$Lt, e1, e2);
									default:
										return $author$project$Syntax$EError('Comparison Expression Modified Type Error: 01.');
								}
							default:
								return $author$project$Syntax$EError('Missing Information, Cannot Infer: 02.');
						}
					}();
					return {expr: newe, henv: henv, htotal: htotal, venv: venv};
				}
			case 'VFalse':
				var _v141 = A4(
					$author$project$Eval$eval,
					henv,
					venv,
					A4($author$project$Syntax$EBPrim, ws, op, e1, e2),
					_List_Nil);
				var res = _v141.a;
				var newe = function () {
					switch (res.$) {
						case 'VFalse':
							return A4($author$project$Syntax$EBPrim, ws, op, e1, e2);
						case 'VTrue':
							switch (op.$) {
								case 'Lt':
									return A4($author$project$Syntax$EBPrim, ws, $author$project$Syntax$Ge, e1, e2);
								case 'Gt':
									return A4($author$project$Syntax$EBPrim, ws, $author$project$Syntax$Le, e1, e2);
								case 'Le':
									return A4($author$project$Syntax$EBPrim, ws, $author$project$Syntax$Gt, e1, e2);
								case 'Ge':
									return A4($author$project$Syntax$EBPrim, ws, $author$project$Syntax$Lt, e1, e2);
								case 'Eq':
									return $author$project$Syntax$EError('Missing Information, Cannot Infer: 03.');
								default:
									return $author$project$Syntax$EError('Comparison Expression Modified Type Error: 02.');
							}
						default:
							return $author$project$Syntax$EError('Missing Information, Cannot Infer: 04.');
					}
				}();
				return {expr: newe, henv: henv, htotal: htotal, venv: venv};
			case 'VHole':
				var hn = newv.a;
				var venv_ = newv.b;
				var _v144 = _Utils_Tuple2(v1, v2);
				if (_v144.a.$ === 'VHole') {
					var _v145 = _v144.a;
					var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
					return {
						expr: A4($author$project$Syntax$EBPrim, ws, op, e1, e2),
						henv: henv,
						htotal: htotal,
						venv: newvenv
					};
				} else {
					if (_v144.b.$ === 'VHole') {
						var _v146 = _v144.b;
						var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
						return {
							expr: A4($author$project$Syntax$EBPrim, ws, op, e1, e2),
							henv: henv,
							htotal: htotal,
							venv: newvenv
						};
					} else {
						var res = A5(
							$author$project$UnEval$uneval,
							henv,
							venv,
							e2,
							A2($author$project$Syntax$VHole, hn, venv_),
							htotal);
						return {
							expr: A4($author$project$Syntax$EBPrim, ws, op, e1, res.expr),
							henv: res.henv,
							htotal: res.htotal,
							venv: res.venv
						};
					}
				}
			default:
				return {
					expr: $author$project$Syntax$EError('Comparison Expression Modified Type Error: 03.'),
					henv: _List_Nil,
					htotal: 0,
					venv: _List_Nil
				};
		}
	});
var $author$project$UnEval$logic = F8(
	function (ws, e1, e2, henv, venv, newv, htotal, op) {
		var _v70 = A4($author$project$Eval$eval, henv, venv, e2, _List_Nil);
		var v2 = _v70.a;
		var _v71 = A4($author$project$Eval$eval, henv, venv, e1, _List_Nil);
		var v1 = _v71.a;
		var _v72 = A4(
			$author$project$Eval$eval,
			henv,
			venv,
			A4($author$project$Syntax$EBPrim, ws, op, e1, e2),
			_List_Nil);
		var v = _v72.a;
		var _v73 = function () {
			switch (v.$) {
				case 'VTrue':
					switch (newv.$) {
						case 'VTrue':
							return _Utils_Tuple2(v1, v2);
						case 'VFalse':
							var _v76 = _Utils_Tuple3(v1, v2, op);
							_v76$3:
							while (true) {
								switch (_v76.a.$) {
									case 'VTrue':
										switch (_v76.b.$) {
											case 'VTrue':
												if (_v76.c.$ === 'And') {
													var _v77 = _v76.a;
													var _v78 = _v76.b;
													var _v79 = _v76.c;
													return _Utils_Tuple2($author$project$Syntax$VFalse, $author$project$Syntax$VTrue);
												} else {
													break _v76$3;
												}
											case 'VFalse':
												if (_v76.c.$ === 'Or') {
													var _v80 = _v76.a;
													var _v81 = _v76.b;
													var _v82 = _v76.c;
													return _Utils_Tuple2($author$project$Syntax$VFalse, $author$project$Syntax$VFalse);
												} else {
													break _v76$3;
												}
											default:
												break _v76$3;
										}
									case 'VFalse':
										if ((_v76.b.$ === 'VTrue') && (_v76.c.$ === 'Or')) {
											var _v83 = _v76.a;
											var _v84 = _v76.b;
											var _v85 = _v76.c;
											return _Utils_Tuple2($author$project$Syntax$VFalse, $author$project$Syntax$VFalse);
										} else {
											break _v76$3;
										}
									default:
										break _v76$3;
								}
							}
							return _Utils_Tuple2(
								$author$project$Syntax$VError(''),
								$author$project$Syntax$VError(''));
						case 'VHole':
							var hn = newv.a;
							var venv_ = newv.b;
							return _Utils_Tuple2(
								v1,
								A2($author$project$Syntax$VHole, hn, venv_));
						default:
							return _Utils_Tuple2(
								$author$project$Syntax$VError(''),
								$author$project$Syntax$VError(''));
					}
				case 'VFalse':
					switch (newv.$) {
						case 'VFalse':
							return _Utils_Tuple2(v1, v2);
						case 'VTrue':
							var _v87 = _Utils_Tuple3(v1, v2, op);
							_v87$3:
							while (true) {
								switch (_v87.a.$) {
									case 'VTrue':
										if ((_v87.b.$ === 'VFalse') && (_v87.c.$ === 'And')) {
											var _v91 = _v87.a;
											var _v92 = _v87.b;
											var _v93 = _v87.c;
											return _Utils_Tuple2($author$project$Syntax$VTrue, $author$project$Syntax$VTrue);
										} else {
											break _v87$3;
										}
									case 'VFalse':
										switch (_v87.b.$) {
											case 'VFalse':
												if (_v87.c.$ === 'Or') {
													var _v88 = _v87.a;
													var _v89 = _v87.b;
													var _v90 = _v87.c;
													return _Utils_Tuple2($author$project$Syntax$VTrue, $author$project$Syntax$VFalse);
												} else {
													break _v87$3;
												}
											case 'VTrue':
												if (_v87.c.$ === 'And') {
													var _v94 = _v87.a;
													var _v95 = _v87.b;
													var _v96 = _v87.c;
													return _Utils_Tuple2($author$project$Syntax$VTrue, $author$project$Syntax$VTrue);
												} else {
													break _v87$3;
												}
											default:
												break _v87$3;
										}
									default:
										break _v87$3;
								}
							}
							return _Utils_Tuple2(
								$author$project$Syntax$VError(''),
								$author$project$Syntax$VError(''));
						case 'VHole':
							var hn = newv.a;
							var venv_ = newv.b;
							return _Utils_Tuple2(
								v1,
								A2($author$project$Syntax$VHole, hn, venv_));
						default:
							return _Utils_Tuple2(
								$author$project$Syntax$VError(''),
								$author$project$Syntax$VError(''));
					}
				case 'VHole':
					var _v97 = _Utils_Tuple2(
						_Utils_Tuple3(v1, v2, newv),
						op);
					_v97$4:
					while (true) {
						switch (_v97.a.c.$) {
							case 'VTrue':
								if (_v97.b.$ === 'And') {
									switch (_v97.a.a.$) {
										case 'VHole':
											if (_v97.a.b.$ === 'VTrue') {
												var _v98 = _v97.a;
												var _v99 = _v98.a;
												var _v100 = _v98.b;
												var _v101 = _v98.c;
												var _v102 = _v97.b;
												return _Utils_Tuple2($author$project$Syntax$VTrue, $author$project$Syntax$VTrue);
											} else {
												break _v97$4;
											}
										case 'VTrue':
											if (_v97.a.b.$ === 'VHole') {
												var _v103 = _v97.a;
												var _v104 = _v103.a;
												var _v105 = _v103.b;
												var _v106 = _v103.c;
												var _v107 = _v97.b;
												return _Utils_Tuple2($author$project$Syntax$VTrue, $author$project$Syntax$VTrue);
											} else {
												break _v97$4;
											}
										default:
											break _v97$4;
									}
								} else {
									break _v97$4;
								}
							case 'VFalse':
								if (_v97.b.$ === 'Or') {
									switch (_v97.a.a.$) {
										case 'VHole':
											if (_v97.a.b.$ === 'VFalse') {
												var _v108 = _v97.a;
												var _v109 = _v108.a;
												var _v110 = _v108.b;
												var _v111 = _v108.c;
												var _v112 = _v97.b;
												return _Utils_Tuple2($author$project$Syntax$VFalse, $author$project$Syntax$VFalse);
											} else {
												break _v97$4;
											}
										case 'VFalse':
											if (_v97.a.b.$ === 'VHole') {
												var _v113 = _v97.a;
												var _v114 = _v113.a;
												var _v115 = _v113.b;
												var _v116 = _v113.c;
												var _v117 = _v97.b;
												return _Utils_Tuple2($author$project$Syntax$VFalse, $author$project$Syntax$VFalse);
											} else {
												break _v97$4;
											}
										default:
											break _v97$4;
									}
								} else {
									break _v97$4;
								}
							default:
								break _v97$4;
						}
					}
					return _Utils_Tuple2(
						$author$project$Syntax$VError(''),
						$author$project$Syntax$VError(''));
				default:
					return _Utils_Tuple2(
						$author$project$Syntax$VError(''),
						$author$project$Syntax$VError(''));
			}
		}();
		var newv1 = _v73.a;
		var newv2 = _v73.b;
		var _v118 = _Utils_Tuple2(newv1, newv2);
		if ((_v118.a.$ === 'VError') && (_v118.b.$ === 'VError')) {
			return {
				expr: $author$project$Syntax$EError('Missing Information or Logic Expression Error.'),
				henv: _List_Nil,
				htotal: 0,
				venv: _List_Nil
			};
		} else {
			return $author$project$UnEval$checkChange(henv)(venv)(htotal)(ws)(op)(e1)(e2)(v1)(v2)(newv1)(newv2);
		}
	});
var $author$project$UnEval$tryUneval = F6(
	function (v, venv, htotal, b, newv, henv) {
		tryUneval:
		while (true) {
			switch (b.$) {
				case 'BNSin':
					var n = b.b;
					var pi = b.c;
					var ei = b.d;
					var venvm = A2($author$project$LangUtils$match, pi, v);
					var res = A5(
						$author$project$UnEval$uneval,
						henv,
						_Utils_ap(venvm, venv),
						ei,
						newv,
						htotal);
					var _v68 = res.expr;
					if (_v68.$ === 'EError') {
						var info = _v68.a;
						return {
							choice: 0,
							ei: $author$project$Syntax$EError(info),
							henv: _List_Nil,
							htotal: 0,
							pi: $author$project$Syntax$PNil($author$project$Syntax$defaultWS),
							venv: _List_Nil
						};
					} else {
						return {choice: n, ei: res.expr, henv: res.henv, htotal: res.htotal, pi: pi, venv: res.venv};
					}
				case 'BCom':
					var b1 = b.b;
					var b2 = b.c;
					var res = A6($author$project$UnEval$tryUneval, v, venv, htotal, b1, newv, henv);
					var _v69 = res.ei;
					if (_v69.$ === 'EError') {
						var $temp$v = v,
							$temp$venv = venv,
							$temp$htotal = htotal,
							$temp$b = b2,
							$temp$newv = newv,
							$temp$henv = henv;
						v = $temp$v;
						venv = $temp$venv;
						htotal = $temp$htotal;
						b = $temp$b;
						newv = $temp$newv;
						henv = $temp$henv;
						continue tryUneval;
					} else {
						return res;
					}
				default:
					return {
						choice: 0,
						ei: $author$project$Syntax$EError('Try Uneval Error.'),
						henv: _List_Nil,
						htotal: 0,
						pi: $author$project$Syntax$PNil($author$project$Syntax$defaultWS),
						venv: _List_Nil
					};
			}
		}
	});
var $author$project$UnEval$uneval = F5(
	function (henv, venv, expr, newv, htotal) {
		_v0$23:
		while (true) {
			switch (expr.$) {
				case 'EVar':
					var s = expr.b;
					if (newv.$ === 'VError') {
						var info = newv.a;
						return {
							expr: $author$project$Syntax$EError('Variable Update Error: ' + info),
							henv: henv,
							htotal: 0,
							venv: venv
						};
					} else {
						return {
							expr: expr,
							henv: henv,
							htotal: htotal,
							venv: A3($author$project$LangUtils$updateElmInVenv, s, newv, venv)
						};
					}
				case 'ELam':
					var ws = expr.a;
					if (newv.$ === 'VClosure') {
						var p_ = newv.a;
						var e_ = newv.b;
						var venv_ = newv.c;
						return {
							expr: A3($author$project$Syntax$ELam, ws, p_, e_),
							henv: henv,
							htotal: htotal,
							venv: venv_
						};
					} else {
						return {
							expr: $author$project$Syntax$EError('Function Closure Update Error.'),
							henv: henv,
							htotal: 0,
							venv: venv
						};
					}
				case 'ELet':
					var ws = expr.a;
					var p = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var res = A5(
						$author$project$UnEval$uneval,
						henv,
						venv,
						A3(
							$author$project$Syntax$EApp,
							$author$project$Syntax$defaultWS,
							A3($author$project$Syntax$ELam, $author$project$Syntax$defaultWS, p, e2),
							e1),
						newv,
						htotal);
					var _v3 = res.expr;
					_v3$2:
					while (true) {
						switch (_v3.$) {
							case 'EError':
								var info = _v3.a;
								return {
									expr: $author$project$Syntax$EError(info),
									henv: _List_Nil,
									htotal: 0,
									venv: _List_Nil
								};
							case 'EApp':
								if (_v3.b.$ === 'ELam') {
									var _v4 = _v3.b;
									var p_ = _v4.b;
									var e2_ = _v4.c;
									var e1_ = _v3.c;
									return {
										expr: A4($author$project$Syntax$ELet, ws, p_, e1_, e2_),
										henv: res.henv,
										htotal: res.htotal,
										venv: res.venv
									};
								} else {
									break _v3$2;
								}
							default:
								break _v3$2;
						}
					}
					return {
						expr: $author$project$Syntax$EError('ELet Update Error.'),
						henv: _List_Nil,
						htotal: 0,
						venv: _List_Nil
					};
				case 'ELetrec':
					var ws = expr.a;
					var p = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var res = A5(
						$author$project$UnEval$uneval,
						henv,
						venv,
						A3(
							$author$project$Syntax$EApp,
							ws,
							A3($author$project$Syntax$ELam, $author$project$Syntax$defaultWS, p, e2),
							A2(
								$author$project$Syntax$EFix,
								$author$project$Syntax$defaultWS,
								A3($author$project$Syntax$ELam, $author$project$Syntax$defaultWS, p, e1))),
						newv,
						htotal);
					var _v5 = res.expr;
					_v5$2:
					while (true) {
						switch (_v5.$) {
							case 'EError':
								var info = _v5.a;
								return {
									expr: $author$project$Syntax$EError(info),
									henv: _List_Nil,
									htotal: 0,
									venv: _List_Nil
								};
							case 'EApp':
								if (((_v5.b.$ === 'ELam') && (_v5.c.$ === 'EFix')) && (_v5.c.b.$ === 'ELam')) {
									var _v6 = _v5.b;
									var p_ = _v6.b;
									var e2_ = _v6.c;
									var _v7 = _v5.c;
									var _v8 = _v7.b;
									var e1_ = _v8.c;
									return {
										expr: A4($author$project$Syntax$ELetrec, ws, p_, e1_, e2_),
										henv: res.henv,
										htotal: res.htotal,
										venv: res.venv
									};
								} else {
									break _v5$2;
								}
							default:
								break _v5$2;
						}
					}
					return {
						expr: $author$project$Syntax$EError('ELetrec Update Error.'),
						henv: _List_Nil,
						htotal: 0,
						venv: _List_Nil
					};
				case 'EApp':
					if (expr.c.$ === 'EFix') {
						var ws = expr.a;
						var e1 = expr.b;
						var _v9 = expr.c;
						var e2 = _v9.b;
						var _v10 = A4($author$project$Eval$eval, henv, venv, e1, _List_Nil);
						var v1 = _v10.a;
						if (v1.$ === 'VClosure') {
							var p = v1.a;
							var ef = v1.b;
							var venvf = v1.c;
							if (p.$ === 'PVar') {
								var s = p.b;
								var res1 = A5(
									$author$project$UnEval$uneval,
									henv,
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(
											s,
											$author$project$Syntax$VFix(e2)),
										venvf),
									ef,
									newv,
									htotal);
								var _v13 = res1.expr;
								if (_v13.$ === 'EError') {
									var info = _v13.a;
									return {
										expr: $author$project$Syntax$EError(info),
										henv: _List_Nil,
										htotal: 0,
										venv: _List_Nil
									};
								} else {
									var droplen = A2($author$project$LangUtils$lengthUntil, s, res1.venv);
									var res1_venv = A2($elm$core$List$drop, droplen, res1.venv);
									var newv1 = A3(
										$author$project$Syntax$VClosure,
										p,
										res1.expr,
										A2($elm$core$List$drop, 1, res1_venv));
									var res2 = A5($author$project$UnEval$uneval, henv, venv, e1, newv1, res1.htotal);
									var _v14 = res2.expr;
									if (_v14.$ === 'EError') {
										var info = _v14.a;
										return {
											expr: $author$project$Syntax$EError(info),
											henv: _List_Nil,
											htotal: 0,
											venv: _List_Nil
										};
									} else {
										var _v15 = $elm$core$List$head(res1_venv);
										_v15$3:
										while (true) {
											if (_v15.$ === 'Just') {
												switch (_v15.a.b.$) {
													case 'VClosure':
														var _v16 = _v15.a;
														var _v17 = _v16.b;
														var np = _v17.a;
														var ne = _v17.b;
														var nvenv = _v17.c;
														var newv2 = A3($author$project$Syntax$VClosure, np, ne, nvenv);
														var res3 = A5(
															$author$project$UnEval$uneval,
															henv,
															venv,
															A2($author$project$Syntax$EFix, $author$project$Syntax$defaultWS, e2),
															newv2,
															res2.htotal);
														var newhenv = A3($author$project$LangUtils$mergeHEnv3, henv, res3.henv, res1.henv);
														return {
															expr: A3($author$project$Syntax$EApp, ws, res2.expr, res3.expr),
															henv: newhenv,
															htotal: res3.htotal,
															venv: venv
														};
													case 'VFix':
														var _v18 = _v15.a;
														var e21 = _v18.b.a;
														return {
															expr: A3(
																$author$project$Syntax$EApp,
																ws,
																res2.expr,
																A2($author$project$Syntax$EFix, $author$project$Syntax$defaultWS, e21)),
															henv: res1.henv,
															htotal: res2.htotal,
															venv: venv
														};
													case 'VError':
														var _v19 = _v15.a;
														var info = _v19.b.a;
														return {
															expr: $author$project$Syntax$EError(info),
															henv: _List_Nil,
															htotal: 0,
															venv: _List_Nil
														};
													default:
														break _v15$3;
												}
											} else {
												break _v15$3;
											}
										}
										return {
											expr: $author$project$Syntax$EError('Recursion Update Error: 01'),
											henv: _List_Nil,
											htotal: 0,
											venv: _List_Nil
										};
									}
								}
							} else {
								return {
									expr: $author$project$Syntax$EError('Recursion Update Error: 02'),
									henv: henv,
									htotal: 0,
									venv: venv
								};
							}
						} else {
							return {
								expr: $author$project$Syntax$EError('Recursion Update Error: 03'),
								henv: henv,
								htotal: 0,
								venv: venv
							};
						}
					} else {
						var ws = expr.a;
						var e1 = expr.b;
						var e2 = expr.c;
						var _v20 = A4($author$project$Eval$eval, henv, venv, e1, _List_Nil);
						var v1 = _v20.a;
						if (v1.$ === 'VClosure') {
							var p = v1.a;
							var ef = v1.b;
							var venvf = v1.c;
							var _v22 = A4($author$project$Eval$eval, henv, venv, e2, _List_Nil);
							var v2 = _v22.a;
							var venvm = A2($author$project$LangUtils$match, p, v2);
							var res1 = A5(
								$author$project$UnEval$uneval,
								henv,
								_Utils_ap(venvm, venvf),
								ef,
								newv,
								htotal);
							var _v23 = res1.expr;
							if (_v23.$ === 'EError') {
								var info = _v23.a;
								return {
									expr: $author$project$Syntax$EError(info),
									henv: _List_Nil,
									htotal: 0,
									venv: _List_Nil
								};
							} else {
								var newv1 = A3(
									$author$project$Syntax$VClosure,
									p,
									res1.expr,
									A2(
										$elm$core$List$drop,
										$elm$core$List$length(venvm),
										res1.venv));
								var res2 = A5($author$project$UnEval$uneval, henv, venv, e1, newv1, res1.htotal);
								var _v24 = res2.expr;
								if (_v24.$ === 'EError') {
									var info = _v24.a;
									return {
										expr: $author$project$Syntax$EError(info),
										henv: _List_Nil,
										htotal: 0,
										venv: _List_Nil
									};
								} else {
									var newv2 = A2($author$project$LangUtils$patternSubst, res1.venv, p);
									var res3 = A5($author$project$UnEval$uneval, henv, venv, e2, newv2, res2.htotal);
									var _v25 = res3.expr;
									if (_v25.$ === 'EError') {
										var info = _v25.a;
										return {
											expr: $author$project$Syntax$EError(info),
											henv: _List_Nil,
											htotal: 0,
											venv: _List_Nil
										};
									} else {
										var newvenv = A3($author$project$LangUtils$mergeVEnv, res2.venv, res3.venv, venv);
										var newhenv = A3($author$project$LangUtils$mergeHEnv3, henv, res3.henv, res1.henv);
										return {
											expr: A3($author$project$Syntax$EApp, ws, res2.expr, res3.expr),
											henv: newhenv,
											htotal: res3.htotal,
											venv: newvenv
										};
									}
								}
							}
						} else {
							return {
								expr: $author$project$Syntax$EError('Application Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
						}
					}
				case 'EInt':
					var ws = expr.a;
					switch (newv.$) {
						case 'VInt':
							var n_ = newv.a;
							return {
								expr: A2($author$project$Syntax$EInt, ws, n_),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VHole':
							var venv_ = newv.b;
							var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
							return {
								expr: A2(
									$author$project$Syntax$EHole,
									ws,
									$author$project$Syntax$HOri(htotal)),
								henv: henv,
								htotal: htotal + 1,
								venv: newvenv
							};
						default:
							return {
								expr: $author$project$Syntax$EError('Int Constant Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
					}
				case 'EFloat':
					var ws = expr.a;
					switch (newv.$) {
						case 'VInt':
							var n_ = newv.a;
							return {
								expr: A2($author$project$Syntax$EFloat, ws, n_),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VFloat':
							var n_ = newv.a;
							return {
								expr: A2($author$project$Syntax$EFloat, ws, n_),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VHole':
							var venv_ = newv.b;
							var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
							return {
								expr: A2(
									$author$project$Syntax$EHole,
									ws,
									$author$project$Syntax$HOri(htotal)),
								henv: henv,
								htotal: htotal + 1,
								venv: newvenv
							};
						default:
							return {
								expr: $author$project$Syntax$EError('Float Constant Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
					}
				case 'ETrue':
					var ws = expr.a;
					switch (newv.$) {
						case 'VTrue':
							return {
								expr: $author$project$Syntax$ETrue(ws),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VFalse':
							return {
								expr: $author$project$Syntax$EFalse(ws),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VHole':
							var venv_ = newv.b;
							var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
							return {
								expr: A2(
									$author$project$Syntax$EHole,
									ws,
									$author$project$Syntax$HOri(htotal)),
								henv: henv,
								htotal: htotal + 1,
								venv: newvenv
							};
						default:
							return {
								expr: $author$project$Syntax$EError('True Constant Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
					}
				case 'EFalse':
					var ws = expr.a;
					switch (newv.$) {
						case 'VTrue':
							return {
								expr: $author$project$Syntax$ETrue(ws),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VFalse':
							return {
								expr: $author$project$Syntax$EFalse(ws),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VHole':
							var venv_ = newv.b;
							var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
							return {
								expr: A2(
									$author$project$Syntax$EHole,
									ws,
									$author$project$Syntax$HOri(htotal)),
								henv: henv,
								htotal: htotal + 1,
								venv: newvenv
							};
						default:
							return {
								expr: $author$project$Syntax$EError('False Constant Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
					}
				case 'EChar':
					var ws = expr.a;
					switch (newv.$) {
						case 'VChar':
							var c_ = newv.a;
							return {
								expr: A2($author$project$Syntax$EChar, ws, c_),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VHole':
							var venv_ = newv.b;
							var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
							return {
								expr: A2(
									$author$project$Syntax$EHole,
									ws,
									$author$project$Syntax$HOri(htotal)),
								henv: henv,
								htotal: htotal + 1,
								venv: newvenv
							};
						default:
							return {
								expr: $author$project$Syntax$EError('Char Constant Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
					}
				case 'ECons':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					switch (newv.$) {
						case 'VCons':
							var v1 = newv.b;
							var v2 = newv.c;
							var res1 = A5($author$project$UnEval$uneval, henv, venv, e1, v1, htotal);
							var res2 = A5($author$project$UnEval$uneval, henv, venv, e2, v2, res1.htotal);
							var newvenv = A3($author$project$LangUtils$mergeVEnv, res1.venv, res2.venv, venv);
							var newhenv = A3($author$project$LangUtils$mergeHEnv3, henv, res1.henv, res2.henv);
							return {
								expr: A3($author$project$Syntax$ECons, ws, res1.expr, res2.expr),
								henv: newhenv,
								htotal: res2.htotal,
								venv: newvenv
							};
						case 'VNil':
							return {
								expr: $author$project$Syntax$ENil(ws),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VHole':
							var venv_ = newv.b;
							var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
							return {
								expr: A2(
									$author$project$Syntax$EHole,
									ws,
									$author$project$Syntax$HOri(htotal)),
								henv: henv,
								htotal: htotal + 1,
								venv: newvenv
							};
						default:
							return {
								expr: $author$project$Syntax$EError('List Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
					}
				case 'EBTuple':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					switch (newv.$) {
						case 'VBTuple':
							var v1 = newv.a;
							var v2 = newv.b;
							var res1 = A5($author$project$UnEval$uneval, henv, venv, e1, v1, htotal);
							var res2 = A5($author$project$UnEval$uneval, henv, venv, e2, v2, res1.htotal);
							var newvenv = A3($author$project$LangUtils$mergeVEnv, res1.venv, res2.venv, venv);
							var newhenv = A3($author$project$LangUtils$mergeHEnv3, henv, res1.henv, res2.henv);
							return {
								expr: A3($author$project$Syntax$EBTuple, ws, res1.expr, res2.expr),
								henv: newhenv,
								htotal: res2.htotal,
								venv: newvenv
							};
						case 'VHole':
							var hn = newv.a;
							var venv_ = newv.b;
							var res1 = A5(
								$author$project$UnEval$uneval,
								henv,
								venv,
								e1,
								A2($author$project$Syntax$VHole, hn, venv_),
								htotal);
							var res2 = A5(
								$author$project$UnEval$uneval,
								henv,
								venv,
								e2,
								A2($author$project$Syntax$VHole, hn, venv_),
								res1.htotal);
							var newvenv = A3($author$project$LangUtils$mergeVEnv, res1.venv, res2.venv, venv);
							var newhenv = A3($author$project$LangUtils$mergeHEnv3, henv, res1.henv, res2.henv);
							return {
								expr: A3($author$project$Syntax$EBTuple, ws, res1.expr, res2.expr),
								henv: newhenv,
								htotal: res2.htotal,
								venv: newvenv
							};
						default:
							return {
								expr: $author$project$Syntax$EError('Tuple2 Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
					}
				case 'ETTuple':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					var e3 = expr.d;
					switch (newv.$) {
						case 'VTTuple':
							var v1 = newv.a;
							var v2 = newv.b;
							var v3 = newv.c;
							var res1 = A5($author$project$UnEval$uneval, henv, venv, e1, v1, htotal);
							var res2 = A5($author$project$UnEval$uneval, henv, venv, e2, v2, res1.htotal);
							var res3 = A5($author$project$UnEval$uneval, henv, venv, e3, v3, res2.htotal);
							var newvenv = A4($author$project$LangUtils$mergeVEnv4, res1.venv, res2.venv, res3.venv, venv);
							var newhenv = A4($author$project$LangUtils$mergeHEnv4, henv, res1.henv, res2.henv, res3.henv);
							return {
								expr: A4($author$project$Syntax$ETTuple, ws, res1.expr, res2.expr, res3.expr),
								henv: newhenv,
								htotal: res3.htotal,
								venv: newvenv
							};
						case 'VHole':
							var hn = newv.a;
							var venv_ = newv.b;
							var res1 = A5(
								$author$project$UnEval$uneval,
								henv,
								venv,
								e1,
								A2($author$project$Syntax$VHole, hn, venv_),
								htotal);
							var res2 = A5(
								$author$project$UnEval$uneval,
								henv,
								venv,
								e2,
								A2($author$project$Syntax$VHole, hn, venv_),
								res1.htotal);
							var res3 = A5(
								$author$project$UnEval$uneval,
								henv,
								venv,
								e3,
								A2($author$project$Syntax$VHole, hn, venv_),
								res2.htotal);
							var newvenv = A4($author$project$LangUtils$mergeVEnv4, res1.venv, res2.venv, res3.venv, venv);
							var newhenv = A4($author$project$LangUtils$mergeHEnv4, henv, res1.henv, res2.henv, res3.henv);
							return {
								expr: A4($author$project$Syntax$ETTuple, ws, res1.expr, res2.expr, res3.expr),
								henv: newhenv,
								htotal: res3.htotal,
								venv: newvenv
							};
						default:
							return {
								expr: $author$project$Syntax$EError('Tuple3 Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
					}
				case 'EHtml':
					var ws = expr.a;
					var s = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var e3 = expr.e;
					if (newv.$ === 'VHtml') {
						var v1 = newv.b;
						var v2 = newv.c;
						var v3 = newv.d;
						var res1 = A5($author$project$UnEval$uneval, henv, venv, e1, v1, htotal);
						var res2 = A5($author$project$UnEval$uneval, henv, venv, e2, v2, res1.htotal);
						var res3 = A5($author$project$UnEval$uneval, henv, venv, e3, v3, res2.htotal);
						var newvenv = A4($author$project$LangUtils$mergeVEnv4, res1.venv, res2.venv, res3.venv, venv);
						var newhenv = A4($author$project$LangUtils$mergeHEnv4, henv, res1.henv, res2.henv, res3.henv);
						return {
							expr: A5($author$project$Syntax$EHtml, ws, s, res1.expr, res2.expr, res3.expr),
							henv: newhenv,
							htotal: res3.htotal,
							venv: newvenv
						};
					} else {
						var _v35 = newv;
						return {
							expr: $author$project$Syntax$EError('HTML Update Error.'),
							henv: _List_Nil,
							htotal: 0,
							venv: _List_Nil
						};
					}
				case 'ENil':
					var ws = expr.a;
					switch (newv.$) {
						case 'VNil':
							return {
								expr: $author$project$Syntax$ENil(ws),
								henv: henv,
								htotal: htotal,
								venv: venv
							};
						case 'VCons':
							var _v37 = A2($author$project$LangUtils$valueToExpr, newv, htotal);
							var ne = _v37.a;
							var htotal1 = _v37.b;
							var newe = function () {
								if (ne.$ === 'ECons') {
									var e1 = ne.b;
									var e2 = ne.c;
									_v39$4:
									while (true) {
										switch (ws.b) {
											case 5:
												if ((ws.a.b && ws.a.b.b) && (!ws.a.b.b.b)) {
													var _v40 = ws.a;
													var _v41 = _v40.b;
													var ws2 = _v41.a;
													return A3(
														$author$project$Syntax$ECons,
														_Utils_Tuple2(
															_List_fromArray(
																[' ', ws2]),
															$author$project$Syntax$eoSquare),
														e1,
														A2(
															$author$project$LangUtils$changeWsForList,
															_Utils_Tuple2(
																_List_fromArray(
																	[' ']),
																$author$project$Syntax$eoElm),
															e2));
												} else {
													break _v39$4;
												}
											case 1:
												return A2(
													$author$project$LangUtils$changeWsForList,
													_Utils_Tuple2(_List_Nil, $author$project$Syntax$eoElm),
													ne);
											case 3:
												if (ws.a.b && (!ws.a.b.b)) {
													var _v42 = ws.a;
													var ws1 = _v42.a;
													return A3(
														$author$project$Syntax$ECons,
														_Utils_Tuple2(
															_List_fromArray(
																[ws1]),
															$author$project$Syntax$esQuo),
														e1,
														A2(
															$author$project$LangUtils$changeWsForList,
															_Utils_Tuple2(
																_List_fromArray(
																	[' ']),
																$author$project$Syntax$esElm),
															e2));
												} else {
													break _v39$4;
												}
											case 4:
												return A2(
													$author$project$LangUtils$changeWsForList,
													_Utils_Tuple2(_List_Nil, $author$project$Syntax$esElm),
													ne);
											default:
												break _v39$4;
										}
									}
									return $author$project$Syntax$EError('Nil Expr WS Error.');
								} else {
									return $author$project$Syntax$EError('Value To Expr Error.');
								}
							}();
							return {expr: newe, henv: henv, htotal: htotal1, venv: venv};
						case 'VHole':
							var venv_ = newv.b;
							var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
							return {
								expr: A2(
									$author$project$Syntax$EHole,
									ws,
									$author$project$Syntax$HOri(htotal)),
								henv: henv,
								htotal: htotal + 1,
								venv: newvenv
							};
						default:
							return {
								expr: $author$project$Syntax$EError('Nil List Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
					}
				case 'EHole':
					var ws = expr.a;
					var u = expr.b;
					var save = function () {
						switch (newv.$) {
							case 'VInt':
								return newv;
							case 'VFloat':
								return newv;
							case 'VTrue':
								return newv;
							case 'VFalse':
								return newv;
							case 'VCons':
								return newv;
							case 'VNil':
								return newv;
							case 'VBTuple':
								return newv;
							case 'VTTuple':
								return newv;
							default:
								return $author$project$Syntax$VError('');
						}
					}();
					if (save.$ === 'VError') {
						if (newv.$ === 'VHole') {
							var venv_ = newv.b;
							var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
							return {
								expr: A2($author$project$Syntax$EHole, ws, u),
								henv: henv,
								htotal: htotal,
								venv: newvenv
							};
						} else {
							return {
								expr: $author$project$Syntax$EError('Hole Update Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
						}
					} else {
						return {
							expr: A2($author$project$Syntax$EHole, ws, u),
							henv: A2(
								$author$project$LangUtils$insert,
								_Utils_Tuple3(u, venv, save),
								henv),
							htotal: htotal,
							venv: venv
						};
					}
				case 'EFix':
					var ws = expr.a;
					var e = expr.b;
					var res = A5(
						$author$project$UnEval$uneval,
						henv,
						venv,
						A3(
							$author$project$Syntax$EApp,
							$author$project$Syntax$defaultWS,
							e,
							A2($author$project$Syntax$EFix, $author$project$Syntax$defaultWS, e)),
						newv,
						htotal);
					var e_ = function () {
						var _v46 = res.expr;
						if ((_v46.$ === 'EApp') && (_v46.c.$ === 'EFix')) {
							var e1 = _v46.b;
							var _v47 = _v46.c;
							var e2 = _v47.b;
							return (!_Utils_eq(e2, e)) ? e2 : e1;
						} else {
							return $author$project$Syntax$EError('Fix Update Error.');
						}
					}();
					return {
						expr: A2($author$project$Syntax$EFix, ws, e_),
						henv: res.henv,
						htotal: res.htotal,
						venv: res.venv
					};
				case 'ECase':
					if (expr.b.$ === 'EVar') {
						var ws1 = expr.a;
						var _v48 = expr.b;
						var ws2 = _v48.a;
						var s = _v48.b;
						var branches = expr.c;
						var res = A2($author$project$LangUtils$findVarByName, s, venv);
						var _v49 = _Utils_Tuple2(res, newv);
						if (_v49.a.$ === 'Just') {
							if ((_v49.a.a.$ === 'VHole') && (_v49.b.$ === 'VHole')) {
								var _v50 = _v49.a.a;
								var _v51 = _v49.b;
								var venv_ = _v51.b;
								return {
									expr: A3(
										$author$project$Syntax$ECase,
										ws1,
										A2($author$project$Syntax$EVar, ws2, s),
										branches),
									henv: henv,
									htotal: htotal,
									venv: venv_
								};
							} else {
								var v = _v49.a.a;
								var tryRes = function () {
									if (v.$ === 'VHole') {
										return A6($author$project$UnEval$tryUneval, v, venv, htotal, branches, newv, henv);
									} else {
										var matchRes = A2($author$project$LangUtils$matchCase, v, branches);
										var resi = A5(
											$author$project$UnEval$uneval,
											henv,
											_Utils_ap(matchRes.venvm, venv),
											matchRes.ei,
											newv,
											htotal);
										return {choice: matchRes.choice, ei: resi.expr, henv: resi.henv, htotal: resi.htotal, pi: matchRes.pi, venv: resi.venv};
									}
								}();
								var _v52 = tryRes.ei;
								if (_v52.$ === 'EError') {
									var info = _v52.a;
									return {
										expr: $author$project$Syntax$EError(info),
										henv: _List_Nil,
										htotal: 0,
										venv: _List_Nil
									};
								} else {
									var newv_ = A2($author$project$LangUtils$patternSubst, tryRes.venv, tryRes.pi);
									var len = $elm$core$List$length(tryRes.venv) - $elm$core$List$length(venv);
									var venv_ = A2(
										$elm$core$List$cons,
										_Utils_Tuple2(s, newv_),
										A2($elm$core$List$drop, len + 1, tryRes.venv));
									var branches_ = A3($author$project$LangUtils$updateBranch, branches, tryRes.choice, tryRes.ei);
									return {
										expr: A3(
											$author$project$Syntax$ECase,
											ws1,
											A2($author$project$Syntax$EVar, ws2, s),
											branches_),
										henv: tryRes.henv,
										htotal: tryRes.htotal,
										venv: venv_
									};
								}
							}
						} else {
							return {
								expr: $author$project$Syntax$EError('Case Expression Error.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
						}
					} else {
						break _v0$23;
					}
				case 'EUPrim':
					var ws = expr.a;
					var op = expr.b;
					var e = expr.c;
					var _v54 = A4($author$project$Eval$eval, henv, venv, e, _List_Nil);
					var v = _v54.a;
					if (op.$ === 'Not') {
						switch (v.$) {
							case 'VHole':
								switch (newv.$) {
									case 'VTrue':
										var res = A5($author$project$UnEval$uneval, henv, venv, e, $author$project$Syntax$VFalse, htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Not, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									case 'VFalse':
										var res = A5($author$project$UnEval$uneval, henv, venv, e, $author$project$Syntax$VTrue, htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Not, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									case 'VHole':
										var venv_ = newv.b;
										var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Not, e),
											henv: henv,
											htotal: htotal,
											venv: newvenv
										};
									default:
										return {
											expr: $author$project$Syntax$EError('Unary Expression Error: 01'),
											henv: _List_Nil,
											htotal: 0,
											venv: _List_Nil
										};
								}
							case 'VTrue':
								switch (newv.$) {
									case 'VTrue':
										var res = A5($author$project$UnEval$uneval, henv, venv, e, $author$project$Syntax$VFalse, htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Not, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									case 'VFalse':
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Not, e),
											henv: henv,
											htotal: htotal,
											venv: venv
										};
									case 'VHole':
										var hn = newv.a;
										var venv_ = newv.b;
										var res = A5(
											$author$project$UnEval$uneval,
											henv,
											venv,
											e,
											A2($author$project$Syntax$VHole, hn, venv_),
											htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Not, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									default:
										return {
											expr: $author$project$Syntax$EError('Unary Expression Error: 02'),
											henv: _List_Nil,
											htotal: 0,
											venv: _List_Nil
										};
								}
							case 'VFalse':
								switch (newv.$) {
									case 'VTrue':
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Not, e),
											henv: henv,
											htotal: htotal,
											venv: venv
										};
									case 'VFalse':
										var res = A5($author$project$UnEval$uneval, henv, venv, e, $author$project$Syntax$VTrue, htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Not, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									case 'VHole':
										var hn = newv.a;
										var venv_ = newv.b;
										var res = A5(
											$author$project$UnEval$uneval,
											henv,
											venv,
											e,
											A2($author$project$Syntax$VHole, hn, venv_),
											htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Not, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									default:
										return {
											expr: $author$project$Syntax$EError('Unary Expression Error: 03'),
											henv: _List_Nil,
											htotal: 0,
											venv: _List_Nil
										};
								}
							default:
								return {
									expr: $author$project$Syntax$EError('Unary Expression Error: 04'),
									henv: _List_Nil,
									htotal: 0,
									venv: _List_Nil
								};
						}
					} else {
						switch (v.$) {
							case 'VHole':
								switch (newv.$) {
									case 'VInt':
										var n = newv.a;
										var res = A5(
											$author$project$UnEval$uneval,
											henv,
											venv,
											e,
											$author$project$Syntax$VInt(-n),
											htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									case 'VFloat':
										var n = newv.a;
										var res = A5(
											$author$project$UnEval$uneval,
											henv,
											venv,
											e,
											$author$project$Syntax$VFloat(-n),
											htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									case 'VHole':
										var venv_ = newv.b;
										var newvenv = _Utils_eq(venv_, _List_Nil) ? venv : venv_;
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, e),
											henv: henv,
											htotal: htotal,
											venv: newvenv
										};
									default:
										return {
											expr: $author$project$Syntax$EError('Unary Expression Error: 05'),
											henv: _List_Nil,
											htotal: 0,
											venv: _List_Nil
										};
								}
							case 'VInt':
								var n = v.a;
								switch (newv.$) {
									case 'VInt':
										var n_ = newv.a;
										if (_Utils_eq(n, -n_)) {
											return {
												expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, e),
												henv: henv,
												htotal: htotal,
												venv: venv
											};
										} else {
											var res = A5(
												$author$project$UnEval$uneval,
												henv,
												venv,
												e,
												$author$project$Syntax$VInt(-n_),
												htotal);
											return {
												expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, res.expr),
												henv: res.henv,
												htotal: res.htotal,
												venv: res.venv
											};
										}
									case 'VHole':
										var hn = newv.a;
										var venv_ = newv.b;
										var res = A5(
											$author$project$UnEval$uneval,
											henv,
											venv,
											e,
											A2($author$project$Syntax$VHole, hn, venv_),
											htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									default:
										return {
											expr: $author$project$Syntax$EError('Unary Expression Error: 06'),
											henv: _List_Nil,
											htotal: 0,
											venv: _List_Nil
										};
								}
							case 'VFloat':
								var n = v.a;
								switch (newv.$) {
									case 'VInt':
										var n_ = newv.a;
										if (_Utils_eq(n, -n_)) {
											return {
												expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, e),
												henv: henv,
												htotal: htotal,
												venv: venv
											};
										} else {
											var res = A5(
												$author$project$UnEval$uneval,
												henv,
												venv,
												e,
												$author$project$Syntax$VFloat(-n_),
												htotal);
											return {
												expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, res.expr),
												henv: res.henv,
												htotal: res.htotal,
												venv: res.venv
											};
										}
									case 'VFloat':
										var n_ = newv.a;
										if (_Utils_eq(n, -n_)) {
											return {
												expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, e),
												henv: henv,
												htotal: htotal,
												venv: venv
											};
										} else {
											var res = A5(
												$author$project$UnEval$uneval,
												henv,
												venv,
												e,
												$author$project$Syntax$VFloat(-n_),
												htotal);
											return {
												expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, res.expr),
												henv: res.henv,
												htotal: res.htotal,
												venv: res.venv
											};
										}
									case 'VHole':
										var hn = newv.a;
										var venv_ = newv.b;
										var res = A5(
											$author$project$UnEval$uneval,
											henv,
											venv,
											e,
											A2($author$project$Syntax$VHole, hn, venv_),
											htotal);
										return {
											expr: A3($author$project$Syntax$EUPrim, ws, $author$project$Syntax$Neg, res.expr),
											henv: res.henv,
											htotal: res.htotal,
											venv: res.venv
										};
									default:
										return {
											expr: $author$project$Syntax$EError('Unary Expression Error: 07'),
											henv: _List_Nil,
											htotal: 0,
											venv: _List_Nil
										};
								}
							default:
								return {
									expr: $author$project$Syntax$EError('Unary Expression Error: 08'),
									henv: _List_Nil,
									htotal: 0,
									venv: _List_Nil
								};
						}
					}
				case 'EBPrim':
					var ws = expr.a;
					var op = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var logic_ = A7($author$project$UnEval$logic, ws, e1, e2, henv, venv, newv, htotal);
					var comp_ = A7($author$project$UnEval$comp, ws, e1, e2, henv, venv, newv, htotal);
					var arith_ = A7($author$project$UnEval$arith, ws, e1, e2, henv, venv, newv, htotal);
					switch (op.$) {
						case 'And':
							return logic_($author$project$Syntax$And);
						case 'Or':
							return logic_($author$project$Syntax$Or);
						case 'Add':
							return arith_($author$project$Syntax$Add);
						case 'Sub':
							return arith_($author$project$Syntax$Sub);
						case 'Mul':
							return arith_($author$project$Syntax$Mul);
						case 'Div':
							return arith_($author$project$Syntax$Div);
						case 'DDiv':
							return arith_($author$project$Syntax$DDiv);
						case 'Cat':
							return arith_($author$project$Syntax$Cat);
						default:
							return comp_(op);
					}
				case 'EParens':
					var ws = expr.a;
					var e = expr.b;
					var res = A5($author$project$UnEval$uneval, henv, venv, e, newv, htotal);
					return {
						expr: A2($author$project$Syntax$EParens, ws, res.expr),
						henv: res.henv,
						htotal: res.htotal,
						venv: res.venv
					};
				case 'EToStr':
					var ws = expr.a;
					var e = expr.b;
					if ((newv.$ === 'VCons') && (newv.a === 1)) {
						var res1 = A2(
							$author$project$Parser_$parseVal,
							$author$project$UnEval$vconsToString(newv),
							_List_Nil);
						if (res1.$ === 'Ok') {
							var nv = res1.a;
							var res2 = A5($author$project$UnEval$uneval, henv, venv, e, nv, htotal);
							return {
								expr: A2($author$project$Syntax$EToStr, ws, res2.expr),
								henv: res2.henv,
								htotal: res2.htotal,
								venv: res2.venv
							};
						} else {
							return {
								expr: $author$project$Syntax$EError('Cannot update toString because of wrong newv.'),
								henv: _List_Nil,
								htotal: 0,
								venv: _List_Nil
							};
						}
					} else {
						return {
							expr: $author$project$Syntax$EError('toString Update Error.'),
							henv: _List_Nil,
							htotal: 0,
							venv: _List_Nil
						};
					}
				default:
					break _v0$23;
			}
		}
		return {
			expr: $author$project$Syntax$EError('Source Expression Error.'),
			henv: _List_Nil,
			htotal: 0,
			venv: _List_Nil
		};
	});
var $author$project$Controller$evalCodeToModel = F2(
	function (code, henv) {
		var parseResult = $author$project$Parser_$parse(code);
		if (parseResult.$ === 'Ok') {
			var e = parseResult.a;
			var _v1 = A3($author$project$LangUtils$processAfterParse, e, _List_Nil, $author$project$Syntax$holeIDStart);
			var e_ = _v1.a;
			var _v2 = A4(
				$author$project$Eval$eval,
				henv,
				_List_Nil,
				e_,
				_List_fromArray(
					[
						_Utils_Tuple2($author$project$Syntax$tempHoleCount, 0)
					]));
			var res1 = _v2.a;
			var res2 = A5($author$project$UnEval$uneval, henv, _List_Nil, e_, res1, $author$project$Syntax$holeAddedByUserStart);
			var _v3 = A4(
				$author$project$Eval$eval,
				res2.henv,
				_List_Nil,
				res2.expr,
				_List_fromArray(
					[
						_Utils_Tuple2($author$project$Syntax$tempHoleCount, 0)
					]));
			var res3 = _v3.a;
			var _v4 = function () {
				if (res3.$ === 'VHtml') {
					return _Utils_Tuple2(
						$author$project$LangUtils$print(res3),
						$author$project$Model$HTML);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(
							$author$project$LangUtils$print(res3).a,
							$author$project$LangUtils$collectUniqueContext(res3)),
						$author$project$Model$Console);
				}
			}();
			var _v5 = _v4.a;
			var output = _v5.a;
			var context = _v5.b;
			var mode = _v4.b;
			var cc = A2($author$project$Utils$nth, 0, context);
			var currentContext = function () {
				if ((cc.$ === 'Just') && (cc.a.$ === 'IndexedHole')) {
					var _v8 = cc.a;
					var hn = _v8.a;
					return hn;
				} else {
					return $author$project$Syntax$HOri(-1);
				}
			}();
			return {
				code: code,
				codeBackup: code,
				context: context,
				currentContext: currentContext,
				editContextItem: _Utils_Tuple2(-1, ''),
				hbBackup: res2.henv,
				holeBindings: res2.henv,
				isOutputChange: false,
				mode: mode,
				output: output,
				path: _List_Nil
			};
		} else {
			var info = parseResult.a;
			return {
				code: code,
				codeBackup: '',
				context: _List_Nil,
				currentContext: $author$project$Syntax$HOri(-1),
				editContextItem: _Utils_Tuple2(-1, ''),
				hbBackup: _List_Nil,
				holeBindings: henv,
				isOutputChange: false,
				mode: $author$project$Model$Console,
				output: $elm$core$Debug$toString(info),
				path: _List_Nil
			};
		}
	});
var $author$project$Parser_$parseHoleName = function (s) {
	return A2(
		$elm$parser$Parser$run,
		A2($elm$parser$Parser$ignorer, $author$project$Parser_$holename, $elm$parser$Parser$end),
		s);
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$sendCode = _Platform_outgoingPort(
	'sendCode',
	function ($) {
		var a = $.a;
		var b = $.b;
		return A2(
			$elm$json$Json$Encode$list,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$json$Json$Encode$string(a),
					$elm$json$Json$Encode$bool(b)
				]));
	});
var $author$project$Main$sendOutput = _Platform_outgoingPort('sendOutput', $elm$json$Json$Encode$string);
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$setAceRed = _Platform_outgoingPort(
	'setAceRed',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$setConsoleVisible = _Platform_outgoingPort('setConsoleVisible', $elm$json$Json$Encode$string);
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$fromList = _String_fromList;
var $author$project$HtmlParser$stringToVCons = F2(
	function (context, lc) {
		if (!lc.b) {
			return $author$project$Syntax$VNil(1);
		} else {
			var c = lc.a;
			var cs = lc.b;
			if ('{' === c.valueOf()) {
				var res = $author$project$Parser_$parseHoleName(
					A2(
						$elm$core$String$dropRight,
						1,
						$elm$core$String$fromList(cs)));
				if (res.$ === 'Ok') {
					var hn = res.a;
					return A2($author$project$Parser_$findContext, context, hn);
				} else {
					return $author$project$Syntax$VError('Parse Hole Error: 02.');
				}
			} else {
				return A3(
					$author$project$Syntax$VCons,
					1,
					$author$project$Syntax$VChar(c),
					A2($author$project$HtmlParser$stringToVCons, context, cs));
			}
		}
	});
var $elm$core$String$trim = _String_trim;
var $author$project$HtmlParser$parseOtherPro = F2(
	function (al, context) {
		parseOtherPro:
		while (true) {
			if (al.b) {
				if (al.a.a === 'contenteditable') {
					var _v1 = al.a;
					var al_ = al.b;
					var $temp$al = al_,
						$temp$context = context;
					al = $temp$al;
					context = $temp$context;
					continue parseOtherPro;
				} else {
					var _v2 = al.a;
					var name = _v2.a;
					var value = _v2.b;
					var al_ = al.b;
					if (A2(
						$elm$core$String$left,
						1,
						$elm$core$String$trim(name)) === '{') {
						var proItem = A2(
							$author$project$HtmlParser$stringToVCons,
							context,
							$elm$core$String$toList(
								$elm$core$String$trim(name)));
						return A3(
							$author$project$Syntax$VCons,
							0,
							proItem,
							A2($author$project$HtmlParser$parseOtherPro, al_, context));
					} else {
						var proItem = A3(
							$author$project$Syntax$VCons,
							0,
							A2(
								$author$project$HtmlParser$stringToVCons,
								context,
								$elm$core$String$toList(
									$elm$core$String$trim(name))),
							A3(
								$author$project$Syntax$VCons,
								0,
								A2(
									$author$project$HtmlParser$stringToVCons,
									context,
									$elm$core$String$toList(
										$elm$core$String$trim(value))),
								$author$project$Syntax$VNil(0)));
						return A3(
							$author$project$Syntax$VCons,
							0,
							proItem,
							A2($author$project$HtmlParser$parseOtherPro, al_, context));
					}
				}
			} else {
				return $author$project$Syntax$VNil(0);
			}
		}
	});
var $author$project$HtmlParser$parseStyle = F2(
	function (context, pro) {
		parseStyle:
		while (true) {
			if (pro.b) {
				var s = pro.a;
				var ps = pro.b;
				if (A2(
					$elm$core$String$left,
					1,
					$elm$core$String$trim(s)) === '{') {
					return A2(
						$author$project$HtmlParser$stringToVCons,
						context,
						$elm$core$String$toList(
							$elm$core$String$trim(s)));
				} else {
					var nameAndValue = A2(
						$elm$core$String$split,
						':',
						$elm$core$String$trim(s));
					var proItem = function () {
						if ((nameAndValue.b && nameAndValue.b.b) && (!nameAndValue.b.b.b)) {
							var n = nameAndValue.a;
							var _v3 = nameAndValue.b;
							var val = _v3.a;
							return A3(
								$author$project$Syntax$VCons,
								0,
								A2(
									$author$project$HtmlParser$stringToVCons,
									context,
									$elm$core$String$toList(
										$elm$core$String$trim(n))),
								A3(
									$elm$core$List$foldr,
									$author$project$Syntax$VCons(0),
									$author$project$Syntax$VNil(0),
									A2(
										$elm$core$List$map,
										$author$project$HtmlParser$stringToVCons(context),
										A2(
											$elm$core$List$map,
											$elm$core$String$toList,
											A2(
												$elm$core$List$map,
												$elm$core$String$trim,
												A2(
													$elm$core$String$split,
													' ',
													$elm$core$String$trim(val)))))));
						} else {
							return $author$project$Syntax$VError('Parse Style Error.');
						}
					}();
					if (proItem.$ === 'VError') {
						var $temp$context = context,
							$temp$pro = ps;
						context = $temp$context;
						pro = $temp$pro;
						continue parseStyle;
					} else {
						return A3(
							$author$project$Syntax$VCons,
							0,
							proItem,
							A2($author$project$HtmlParser$parseStyle, context, ps));
					}
				}
			} else {
				return $author$project$Syntax$VNil(0);
			}
		}
	});
var $author$project$HtmlParser$nodeToValue = F2(
	function (node, context) {
		switch (node.$) {
			case 'Element':
				var s = node.a;
				var attrList = node.b;
				var childs = node.c;
				if (s === 'span') {
					if ((childs.b && (childs.a.$ === 'Text')) && (!childs.b.b)) {
						var c = childs.a.a;
						return A2(
							$author$project$HtmlParser$stringToVCons,
							context,
							$elm$core$String$toList(
								$elm$core$String$trim(c)));
					} else {
						return $author$project$Syntax$VError('Parse Hole Error: 01.');
					}
				} else {
					var vChilds = A2($author$project$HtmlParser$parseChilds, childs, context);
					if (!attrList.b) {
						return A4(
							$author$project$Syntax$VHtml,
							s,
							$author$project$Syntax$VNil(0),
							$author$project$Syntax$VNil(0),
							vChilds);
					} else {
						if (attrList.a.a === 'style') {
							if (!attrList.b.b) {
								var _v5 = attrList.a;
								var pro = _v5.b;
								return A4(
									$author$project$Syntax$VHtml,
									s,
									A2(
										$author$project$HtmlParser$parseStyle,
										context,
										A2($elm$core$String$split, ';', pro)),
									$author$project$Syntax$VNil(0),
									vChilds);
							} else {
								var _v6 = attrList.a;
								var pro = _v6.b;
								var al = attrList.b;
								return A4(
									$author$project$Syntax$VHtml,
									s,
									A2(
										$author$project$HtmlParser$parseStyle,
										context,
										A2($elm$core$String$split, ';', pro)),
									A2($author$project$HtmlParser$parseOtherPro, al, context),
									vChilds);
							}
						} else {
							var al = attrList;
							return A4(
								$author$project$Syntax$VHtml,
								s,
								$author$project$Syntax$VNil(0),
								A2($author$project$HtmlParser$parseOtherPro, al, context),
								vChilds);
						}
					}
				}
			case 'Text':
				var s = node.a;
				return A2(
					$author$project$HtmlParser$stringToVCons,
					context,
					$elm$core$String$toList(s));
			default:
				return $author$project$Syntax$VError('An error occurred in the node constructor.');
		}
	});
var $author$project$HtmlParser$parseChilds = F2(
	function (childs, context) {
		if (!childs.b) {
			return $author$project$Syntax$VNil(0);
		} else {
			var c = childs.a;
			var cds = childs.b;
			return A3(
				$author$project$Syntax$VCons,
				0,
				A2($author$project$HtmlParser$nodeToValue, c, context),
				A2($author$project$HtmlParser$parseChilds, cds, context));
		}
	});
var $hecrj$html_parser$Html$Parser$Element = F3(
	function (a, b, c) {
		return {$: 'Element', a: a, b: b, c: c};
	});
var $hecrj$html_parser$Html$Parser$chompOneOrMore = function (fn) {
	return A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$chompIf(fn),
		$elm$parser$Parser$chompWhile(fn));
};
var $hecrj$html_parser$Html$Parser$isSpaceCharacter = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr(' ')) || (_Utils_eq(
		c,
		_Utils_chr('\t')) || (_Utils_eq(
		c,
		_Utils_chr('\n')) || (_Utils_eq(
		c,
		_Utils_chr('\u000D')) || (_Utils_eq(
		c,
		_Utils_chr('\u000C')) || _Utils_eq(
		c,
		_Utils_chr('\u00A0'))))));
};
var $elm$core$String$toLower = _String_toLower;
var $hecrj$html_parser$Html$Parser$closingTag = function (name) {
	var chompName = A2(
		$elm$parser$Parser$andThen,
		function (closingName) {
			return _Utils_eq(
				$elm$core$String$toLower(closingName),
				name) ? $elm$parser$Parser$succeed(_Utils_Tuple0) : $elm$parser$Parser$problem('closing tag does not match opening tag: ' + name);
		},
		$elm$parser$Parser$getChompedString(
			$hecrj$html_parser$Html$Parser$chompOneOrMore(
				function (c) {
					return (!$hecrj$html_parser$Html$Parser$isSpaceCharacter(c)) && (!_Utils_eq(
						c,
						_Utils_chr('>')));
				})));
	return A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq(
							_Utils_chr('<'))),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq(
							_Utils_chr('/')))),
				chompName),
			$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq(
				_Utils_chr('>'))));
};
var $hecrj$html_parser$Html$Parser$Comment = function (a) {
	return {$: 'Comment', a: a};
};
var $elm$parser$Parser$token = function (str) {
	return $elm$parser$Parser$Advanced$token(
		$elm$parser$Parser$toToken(str));
};
var $hecrj$html_parser$Html$Parser$commentString = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$token('<!')),
		$elm$parser$Parser$token('--')),
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$getChompedString(
			$elm$parser$Parser$chompUntil('-->')),
		$elm$parser$Parser$token('-->')));
var $hecrj$html_parser$Html$Parser$comment = A2($elm$parser$Parser$map, $hecrj$html_parser$Html$Parser$Comment, $hecrj$html_parser$Html$Parser$commentString);
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $hecrj$html_parser$Html$Parser$voidElements = _List_fromArray(
	['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
var $hecrj$html_parser$Html$Parser$isVoidElement = function (name) {
	return A2($elm$core$List$member, name, $hecrj$html_parser$Html$Parser$voidElements);
};
var $hecrj$html_parser$Html$Parser$many = function (parser_) {
	return A2(
		$elm$parser$Parser$loop,
		_List_Nil,
		function (list) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$map,
						function (_new) {
							return $elm$parser$Parser$Loop(
								A2($elm$core$List$cons, _new, list));
						},
						parser_),
						$elm$parser$Parser$succeed(
						$elm$parser$Parser$Done(
							$elm$core$List$reverse(list)))
					]));
		});
};
var $hecrj$html_parser$Html$Parser$isTagAttributeCharacter = function (c) {
	return (!$hecrj$html_parser$Html$Parser$isSpaceCharacter(c)) && ((!_Utils_eq(
		c,
		_Utils_chr('\"'))) && ((!_Utils_eq(
		c,
		_Utils_chr('\''))) && ((!_Utils_eq(
		c,
		_Utils_chr('>'))) && ((!_Utils_eq(
		c,
		_Utils_chr('/'))) && (!_Utils_eq(
		c,
		_Utils_chr('=')))))));
};
var $hecrj$html_parser$Html$Parser$tagAttributeName = A2(
	$elm$parser$Parser$map,
	$elm$core$String$toLower,
	$elm$parser$Parser$getChompedString(
		$hecrj$html_parser$Html$Parser$chompOneOrMore($hecrj$html_parser$Html$Parser$isTagAttributeCharacter)));
var $hecrj$html_parser$Html$Parser$chompSemicolon = $elm$parser$Parser$chompIf(
	$elm$core$Basics$eq(
		_Utils_chr(';')));
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $hecrj$html_parser$Html$Parser$NamedCharacterReferences$dict = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('Aacute', 'Á'),
			_Utils_Tuple2('aacute', 'á'),
			_Utils_Tuple2('Abreve', 'Ă'),
			_Utils_Tuple2('abreve', 'ă'),
			_Utils_Tuple2('ac', '∾'),
			_Utils_Tuple2('acd', '∿'),
			_Utils_Tuple2('acE', '∾̳'),
			_Utils_Tuple2('Acirc', 'Â'),
			_Utils_Tuple2('acirc', 'â'),
			_Utils_Tuple2('acute', '´'),
			_Utils_Tuple2('Acy', 'А'),
			_Utils_Tuple2('acy', 'а'),
			_Utils_Tuple2('AElig', 'Æ'),
			_Utils_Tuple2('aelig', 'æ'),
			_Utils_Tuple2('af', '\u2061'),
			_Utils_Tuple2('Afr', '\uD835\uDD04'),
			_Utils_Tuple2('afr', '\uD835\uDD1E'),
			_Utils_Tuple2('Agrave', 'À'),
			_Utils_Tuple2('agrave', 'à'),
			_Utils_Tuple2('alefsym', 'ℵ'),
			_Utils_Tuple2('aleph', 'ℵ'),
			_Utils_Tuple2('Alpha', 'Α'),
			_Utils_Tuple2('alpha', 'α'),
			_Utils_Tuple2('Amacr', 'Ā'),
			_Utils_Tuple2('amacr', 'ā'),
			_Utils_Tuple2('amalg', '⨿'),
			_Utils_Tuple2('amp', '&'),
			_Utils_Tuple2('AMP', '&'),
			_Utils_Tuple2('andand', '⩕'),
			_Utils_Tuple2('And', '⩓'),
			_Utils_Tuple2('and', '∧'),
			_Utils_Tuple2('andd', '⩜'),
			_Utils_Tuple2('andslope', '⩘'),
			_Utils_Tuple2('andv', '⩚'),
			_Utils_Tuple2('ang', '∠'),
			_Utils_Tuple2('ange', '⦤'),
			_Utils_Tuple2('angle', '∠'),
			_Utils_Tuple2('angmsdaa', '⦨'),
			_Utils_Tuple2('angmsdab', '⦩'),
			_Utils_Tuple2('angmsdac', '⦪'),
			_Utils_Tuple2('angmsdad', '⦫'),
			_Utils_Tuple2('angmsdae', '⦬'),
			_Utils_Tuple2('angmsdaf', '⦭'),
			_Utils_Tuple2('angmsdag', '⦮'),
			_Utils_Tuple2('angmsdah', '⦯'),
			_Utils_Tuple2('angmsd', '∡'),
			_Utils_Tuple2('angrt', '∟'),
			_Utils_Tuple2('angrtvb', '⊾'),
			_Utils_Tuple2('angrtvbd', '⦝'),
			_Utils_Tuple2('angsph', '∢'),
			_Utils_Tuple2('angst', 'Å'),
			_Utils_Tuple2('angzarr', '⍼'),
			_Utils_Tuple2('Aogon', 'Ą'),
			_Utils_Tuple2('aogon', 'ą'),
			_Utils_Tuple2('Aopf', '\uD835\uDD38'),
			_Utils_Tuple2('aopf', '\uD835\uDD52'),
			_Utils_Tuple2('apacir', '⩯'),
			_Utils_Tuple2('ap', '≈'),
			_Utils_Tuple2('apE', '⩰'),
			_Utils_Tuple2('ape', '≊'),
			_Utils_Tuple2('apid', '≋'),
			_Utils_Tuple2('apos', '\''),
			_Utils_Tuple2('ApplyFunction', '\u2061'),
			_Utils_Tuple2('approx', '≈'),
			_Utils_Tuple2('approxeq', '≊'),
			_Utils_Tuple2('Aring', 'Å'),
			_Utils_Tuple2('aring', 'å'),
			_Utils_Tuple2('Ascr', '\uD835\uDC9C'),
			_Utils_Tuple2('ascr', '\uD835\uDCB6'),
			_Utils_Tuple2('Assign', '≔'),
			_Utils_Tuple2('ast', '*'),
			_Utils_Tuple2('asymp', '≈'),
			_Utils_Tuple2('asympeq', '≍'),
			_Utils_Tuple2('Atilde', 'Ã'),
			_Utils_Tuple2('atilde', 'ã'),
			_Utils_Tuple2('Auml', 'Ä'),
			_Utils_Tuple2('auml', 'ä'),
			_Utils_Tuple2('awconint', '∳'),
			_Utils_Tuple2('awint', '⨑'),
			_Utils_Tuple2('backcong', '≌'),
			_Utils_Tuple2('backepsilon', '϶'),
			_Utils_Tuple2('backprime', '‵'),
			_Utils_Tuple2('backsim', '∽'),
			_Utils_Tuple2('backsimeq', '⋍'),
			_Utils_Tuple2('Backslash', '∖'),
			_Utils_Tuple2('Barv', '⫧'),
			_Utils_Tuple2('barvee', '⊽'),
			_Utils_Tuple2('barwed', '⌅'),
			_Utils_Tuple2('Barwed', '⌆'),
			_Utils_Tuple2('barwedge', '⌅'),
			_Utils_Tuple2('bbrk', '⎵'),
			_Utils_Tuple2('bbrktbrk', '⎶'),
			_Utils_Tuple2('bcong', '≌'),
			_Utils_Tuple2('Bcy', 'Б'),
			_Utils_Tuple2('bcy', 'б'),
			_Utils_Tuple2('bdquo', '„'),
			_Utils_Tuple2('becaus', '∵'),
			_Utils_Tuple2('because', '∵'),
			_Utils_Tuple2('Because', '∵'),
			_Utils_Tuple2('bemptyv', '⦰'),
			_Utils_Tuple2('bepsi', '϶'),
			_Utils_Tuple2('bernou', 'ℬ'),
			_Utils_Tuple2('Bernoullis', 'ℬ'),
			_Utils_Tuple2('Beta', 'Β'),
			_Utils_Tuple2('beta', 'β'),
			_Utils_Tuple2('beth', 'ℶ'),
			_Utils_Tuple2('between', '≬'),
			_Utils_Tuple2('Bfr', '\uD835\uDD05'),
			_Utils_Tuple2('bfr', '\uD835\uDD1F'),
			_Utils_Tuple2('bigcap', '⋂'),
			_Utils_Tuple2('bigcirc', '◯'),
			_Utils_Tuple2('bigcup', '⋃'),
			_Utils_Tuple2('bigodot', '⨀'),
			_Utils_Tuple2('bigoplus', '⨁'),
			_Utils_Tuple2('bigotimes', '⨂'),
			_Utils_Tuple2('bigsqcup', '⨆'),
			_Utils_Tuple2('bigstar', '★'),
			_Utils_Tuple2('bigtriangledown', '▽'),
			_Utils_Tuple2('bigtriangleup', '△'),
			_Utils_Tuple2('biguplus', '⨄'),
			_Utils_Tuple2('bigvee', '⋁'),
			_Utils_Tuple2('bigwedge', '⋀'),
			_Utils_Tuple2('bkarow', '⤍'),
			_Utils_Tuple2('blacklozenge', '⧫'),
			_Utils_Tuple2('blacksquare', '▪'),
			_Utils_Tuple2('blacktriangle', '▴'),
			_Utils_Tuple2('blacktriangledown', '▾'),
			_Utils_Tuple2('blacktriangleleft', '◂'),
			_Utils_Tuple2('blacktriangleright', '▸'),
			_Utils_Tuple2('blank', '␣'),
			_Utils_Tuple2('blk12', '▒'),
			_Utils_Tuple2('blk14', '░'),
			_Utils_Tuple2('blk34', '▓'),
			_Utils_Tuple2('block', '█'),
			_Utils_Tuple2('bne', '=⃥'),
			_Utils_Tuple2('bnequiv', '≡⃥'),
			_Utils_Tuple2('bNot', '⫭'),
			_Utils_Tuple2('bnot', '⌐'),
			_Utils_Tuple2('Bopf', '\uD835\uDD39'),
			_Utils_Tuple2('bopf', '\uD835\uDD53'),
			_Utils_Tuple2('bot', '⊥'),
			_Utils_Tuple2('bottom', '⊥'),
			_Utils_Tuple2('bowtie', '⋈'),
			_Utils_Tuple2('boxbox', '⧉'),
			_Utils_Tuple2('boxdl', '┐'),
			_Utils_Tuple2('boxdL', '╕'),
			_Utils_Tuple2('boxDl', '╖'),
			_Utils_Tuple2('boxDL', '╗'),
			_Utils_Tuple2('boxdr', '┌'),
			_Utils_Tuple2('boxdR', '╒'),
			_Utils_Tuple2('boxDr', '╓'),
			_Utils_Tuple2('boxDR', '╔'),
			_Utils_Tuple2('boxh', '─'),
			_Utils_Tuple2('boxH', '═'),
			_Utils_Tuple2('boxhd', '┬'),
			_Utils_Tuple2('boxHd', '╤'),
			_Utils_Tuple2('boxhD', '╥'),
			_Utils_Tuple2('boxHD', '╦'),
			_Utils_Tuple2('boxhu', '┴'),
			_Utils_Tuple2('boxHu', '╧'),
			_Utils_Tuple2('boxhU', '╨'),
			_Utils_Tuple2('boxHU', '╩'),
			_Utils_Tuple2('boxminus', '⊟'),
			_Utils_Tuple2('boxplus', '⊞'),
			_Utils_Tuple2('boxtimes', '⊠'),
			_Utils_Tuple2('boxul', '┘'),
			_Utils_Tuple2('boxuL', '╛'),
			_Utils_Tuple2('boxUl', '╜'),
			_Utils_Tuple2('boxUL', '╝'),
			_Utils_Tuple2('boxur', '└'),
			_Utils_Tuple2('boxuR', '╘'),
			_Utils_Tuple2('boxUr', '╙'),
			_Utils_Tuple2('boxUR', '╚'),
			_Utils_Tuple2('boxv', '│'),
			_Utils_Tuple2('boxV', '║'),
			_Utils_Tuple2('boxvh', '┼'),
			_Utils_Tuple2('boxvH', '╪'),
			_Utils_Tuple2('boxVh', '╫'),
			_Utils_Tuple2('boxVH', '╬'),
			_Utils_Tuple2('boxvl', '┤'),
			_Utils_Tuple2('boxvL', '╡'),
			_Utils_Tuple2('boxVl', '╢'),
			_Utils_Tuple2('boxVL', '╣'),
			_Utils_Tuple2('boxvr', '├'),
			_Utils_Tuple2('boxvR', '╞'),
			_Utils_Tuple2('boxVr', '╟'),
			_Utils_Tuple2('boxVR', '╠'),
			_Utils_Tuple2('bprime', '‵'),
			_Utils_Tuple2('breve', '˘'),
			_Utils_Tuple2('Breve', '˘'),
			_Utils_Tuple2('brvbar', '¦'),
			_Utils_Tuple2('bscr', '\uD835\uDCB7'),
			_Utils_Tuple2('Bscr', 'ℬ'),
			_Utils_Tuple2('bsemi', '⁏'),
			_Utils_Tuple2('bsim', '∽'),
			_Utils_Tuple2('bsime', '⋍'),
			_Utils_Tuple2('bsolb', '⧅'),
			_Utils_Tuple2('bsol', '\\'),
			_Utils_Tuple2('bsolhsub', '⟈'),
			_Utils_Tuple2('bull', '•'),
			_Utils_Tuple2('bullet', '•'),
			_Utils_Tuple2('bump', '≎'),
			_Utils_Tuple2('bumpE', '⪮'),
			_Utils_Tuple2('bumpe', '≏'),
			_Utils_Tuple2('Bumpeq', '≎'),
			_Utils_Tuple2('bumpeq', '≏'),
			_Utils_Tuple2('Cacute', 'Ć'),
			_Utils_Tuple2('cacute', 'ć'),
			_Utils_Tuple2('capand', '⩄'),
			_Utils_Tuple2('capbrcup', '⩉'),
			_Utils_Tuple2('capcap', '⩋'),
			_Utils_Tuple2('cap', '∩'),
			_Utils_Tuple2('Cap', '⋒'),
			_Utils_Tuple2('capcup', '⩇'),
			_Utils_Tuple2('capdot', '⩀'),
			_Utils_Tuple2('CapitalDifferentialD', 'ⅅ'),
			_Utils_Tuple2('caps', '∩︀'),
			_Utils_Tuple2('caret', '⁁'),
			_Utils_Tuple2('caron', 'ˇ'),
			_Utils_Tuple2('Cayleys', 'ℭ'),
			_Utils_Tuple2('ccaps', '⩍'),
			_Utils_Tuple2('Ccaron', 'Č'),
			_Utils_Tuple2('ccaron', 'č'),
			_Utils_Tuple2('Ccedil', 'Ç'),
			_Utils_Tuple2('ccedil', 'ç'),
			_Utils_Tuple2('Ccirc', 'Ĉ'),
			_Utils_Tuple2('ccirc', 'ĉ'),
			_Utils_Tuple2('Cconint', '∰'),
			_Utils_Tuple2('ccups', '⩌'),
			_Utils_Tuple2('ccupssm', '⩐'),
			_Utils_Tuple2('Cdot', 'Ċ'),
			_Utils_Tuple2('cdot', 'ċ'),
			_Utils_Tuple2('cedil', '¸'),
			_Utils_Tuple2('Cedilla', '¸'),
			_Utils_Tuple2('cemptyv', '⦲'),
			_Utils_Tuple2('cent', '¢'),
			_Utils_Tuple2('centerdot', '·'),
			_Utils_Tuple2('CenterDot', '·'),
			_Utils_Tuple2('cfr', '\uD835\uDD20'),
			_Utils_Tuple2('Cfr', 'ℭ'),
			_Utils_Tuple2('CHcy', 'Ч'),
			_Utils_Tuple2('chcy', 'ч'),
			_Utils_Tuple2('check', '✓'),
			_Utils_Tuple2('checkmark', '✓'),
			_Utils_Tuple2('Chi', 'Χ'),
			_Utils_Tuple2('chi', 'χ'),
			_Utils_Tuple2('circ', 'ˆ'),
			_Utils_Tuple2('circeq', '≗'),
			_Utils_Tuple2('circlearrowleft', '↺'),
			_Utils_Tuple2('circlearrowright', '↻'),
			_Utils_Tuple2('circledast', '⊛'),
			_Utils_Tuple2('circledcirc', '⊚'),
			_Utils_Tuple2('circleddash', '⊝'),
			_Utils_Tuple2('CircleDot', '⊙'),
			_Utils_Tuple2('circledR', '®'),
			_Utils_Tuple2('circledS', 'Ⓢ'),
			_Utils_Tuple2('CircleMinus', '⊖'),
			_Utils_Tuple2('CirclePlus', '⊕'),
			_Utils_Tuple2('CircleTimes', '⊗'),
			_Utils_Tuple2('cir', '○'),
			_Utils_Tuple2('cirE', '⧃'),
			_Utils_Tuple2('cire', '≗'),
			_Utils_Tuple2('cirfnint', '⨐'),
			_Utils_Tuple2('cirmid', '⫯'),
			_Utils_Tuple2('cirscir', '⧂'),
			_Utils_Tuple2('ClockwiseContourIntegral', '∲'),
			_Utils_Tuple2('CloseCurlyDoubleQuote', '”'),
			_Utils_Tuple2('CloseCurlyQuote', '’'),
			_Utils_Tuple2('clubs', '♣'),
			_Utils_Tuple2('clubsuit', '♣'),
			_Utils_Tuple2('colon', ':'),
			_Utils_Tuple2('Colon', '∷'),
			_Utils_Tuple2('Colone', '⩴'),
			_Utils_Tuple2('colone', '≔'),
			_Utils_Tuple2('coloneq', '≔'),
			_Utils_Tuple2('comma', ','),
			_Utils_Tuple2('commat', '@'),
			_Utils_Tuple2('comp', '∁'),
			_Utils_Tuple2('compfn', '∘'),
			_Utils_Tuple2('complement', '∁'),
			_Utils_Tuple2('complexes', 'ℂ'),
			_Utils_Tuple2('cong', '≅'),
			_Utils_Tuple2('congdot', '⩭'),
			_Utils_Tuple2('Congruent', '≡'),
			_Utils_Tuple2('conint', '∮'),
			_Utils_Tuple2('Conint', '∯'),
			_Utils_Tuple2('ContourIntegral', '∮'),
			_Utils_Tuple2('copf', '\uD835\uDD54'),
			_Utils_Tuple2('Copf', 'ℂ'),
			_Utils_Tuple2('coprod', '∐'),
			_Utils_Tuple2('Coproduct', '∐'),
			_Utils_Tuple2('copy', '©'),
			_Utils_Tuple2('COPY', '©'),
			_Utils_Tuple2('copysr', '℗'),
			_Utils_Tuple2('CounterClockwiseContourIntegral', '∳'),
			_Utils_Tuple2('crarr', '↵'),
			_Utils_Tuple2('cross', '✗'),
			_Utils_Tuple2('Cross', '⨯'),
			_Utils_Tuple2('Cscr', '\uD835\uDC9E'),
			_Utils_Tuple2('cscr', '\uD835\uDCB8'),
			_Utils_Tuple2('csub', '⫏'),
			_Utils_Tuple2('csube', '⫑'),
			_Utils_Tuple2('csup', '⫐'),
			_Utils_Tuple2('csupe', '⫒'),
			_Utils_Tuple2('ctdot', '⋯'),
			_Utils_Tuple2('cudarrl', '⤸'),
			_Utils_Tuple2('cudarrr', '⤵'),
			_Utils_Tuple2('cuepr', '⋞'),
			_Utils_Tuple2('cuesc', '⋟'),
			_Utils_Tuple2('cularr', '↶'),
			_Utils_Tuple2('cularrp', '⤽'),
			_Utils_Tuple2('cupbrcap', '⩈'),
			_Utils_Tuple2('cupcap', '⩆'),
			_Utils_Tuple2('CupCap', '≍'),
			_Utils_Tuple2('cup', '∪'),
			_Utils_Tuple2('Cup', '⋓'),
			_Utils_Tuple2('cupcup', '⩊'),
			_Utils_Tuple2('cupdot', '⊍'),
			_Utils_Tuple2('cupor', '⩅'),
			_Utils_Tuple2('cups', '∪︀'),
			_Utils_Tuple2('curarr', '↷'),
			_Utils_Tuple2('curarrm', '⤼'),
			_Utils_Tuple2('curlyeqprec', '⋞'),
			_Utils_Tuple2('curlyeqsucc', '⋟'),
			_Utils_Tuple2('curlyvee', '⋎'),
			_Utils_Tuple2('curlywedge', '⋏'),
			_Utils_Tuple2('curren', '¤'),
			_Utils_Tuple2('curvearrowleft', '↶'),
			_Utils_Tuple2('curvearrowright', '↷'),
			_Utils_Tuple2('cuvee', '⋎'),
			_Utils_Tuple2('cuwed', '⋏'),
			_Utils_Tuple2('cwconint', '∲'),
			_Utils_Tuple2('cwint', '∱'),
			_Utils_Tuple2('cylcty', '⌭'),
			_Utils_Tuple2('dagger', '†'),
			_Utils_Tuple2('Dagger', '‡'),
			_Utils_Tuple2('daleth', 'ℸ'),
			_Utils_Tuple2('darr', '↓'),
			_Utils_Tuple2('Darr', '↡'),
			_Utils_Tuple2('dArr', '⇓'),
			_Utils_Tuple2('dash', '‐'),
			_Utils_Tuple2('Dashv', '⫤'),
			_Utils_Tuple2('dashv', '⊣'),
			_Utils_Tuple2('dbkarow', '⤏'),
			_Utils_Tuple2('dblac', '˝'),
			_Utils_Tuple2('Dcaron', 'Ď'),
			_Utils_Tuple2('dcaron', 'ď'),
			_Utils_Tuple2('Dcy', 'Д'),
			_Utils_Tuple2('dcy', 'д'),
			_Utils_Tuple2('ddagger', '‡'),
			_Utils_Tuple2('ddarr', '⇊'),
			_Utils_Tuple2('DD', 'ⅅ'),
			_Utils_Tuple2('dd', 'ⅆ'),
			_Utils_Tuple2('DDotrahd', '⤑'),
			_Utils_Tuple2('ddotseq', '⩷'),
			_Utils_Tuple2('deg', '°'),
			_Utils_Tuple2('Del', '∇'),
			_Utils_Tuple2('Delta', 'Δ'),
			_Utils_Tuple2('delta', 'δ'),
			_Utils_Tuple2('demptyv', '⦱'),
			_Utils_Tuple2('dfisht', '⥿'),
			_Utils_Tuple2('Dfr', '\uD835\uDD07'),
			_Utils_Tuple2('dfr', '\uD835\uDD21'),
			_Utils_Tuple2('dHar', '⥥'),
			_Utils_Tuple2('dharl', '⇃'),
			_Utils_Tuple2('dharr', '⇂'),
			_Utils_Tuple2('DiacriticalAcute', '´'),
			_Utils_Tuple2('DiacriticalDot', '˙'),
			_Utils_Tuple2('DiacriticalDoubleAcute', '˝'),
			_Utils_Tuple2('DiacriticalGrave', '`'),
			_Utils_Tuple2('DiacriticalTilde', '˜'),
			_Utils_Tuple2('diam', '⋄'),
			_Utils_Tuple2('diamond', '⋄'),
			_Utils_Tuple2('Diamond', '⋄'),
			_Utils_Tuple2('diamondsuit', '♦'),
			_Utils_Tuple2('diams', '♦'),
			_Utils_Tuple2('die', '¨'),
			_Utils_Tuple2('DifferentialD', 'ⅆ'),
			_Utils_Tuple2('digamma', 'ϝ'),
			_Utils_Tuple2('disin', '⋲'),
			_Utils_Tuple2('div', '÷'),
			_Utils_Tuple2('divide', '÷'),
			_Utils_Tuple2('divideontimes', '⋇'),
			_Utils_Tuple2('divonx', '⋇'),
			_Utils_Tuple2('DJcy', 'Ђ'),
			_Utils_Tuple2('djcy', 'ђ'),
			_Utils_Tuple2('dlcorn', '⌞'),
			_Utils_Tuple2('dlcrop', '⌍'),
			_Utils_Tuple2('dollar', '$'),
			_Utils_Tuple2('Dopf', '\uD835\uDD3B'),
			_Utils_Tuple2('dopf', '\uD835\uDD55'),
			_Utils_Tuple2('Dot', '¨'),
			_Utils_Tuple2('dot', '˙'),
			_Utils_Tuple2('DotDot', '⃜'),
			_Utils_Tuple2('doteq', '≐'),
			_Utils_Tuple2('doteqdot', '≑'),
			_Utils_Tuple2('DotEqual', '≐'),
			_Utils_Tuple2('dotminus', '∸'),
			_Utils_Tuple2('dotplus', '∔'),
			_Utils_Tuple2('dotsquare', '⊡'),
			_Utils_Tuple2('doublebarwedge', '⌆'),
			_Utils_Tuple2('DoubleContourIntegral', '∯'),
			_Utils_Tuple2('DoubleDot', '¨'),
			_Utils_Tuple2('DoubleDownArrow', '⇓'),
			_Utils_Tuple2('DoubleLeftArrow', '⇐'),
			_Utils_Tuple2('DoubleLeftRightArrow', '⇔'),
			_Utils_Tuple2('DoubleLeftTee', '⫤'),
			_Utils_Tuple2('DoubleLongLeftArrow', '⟸'),
			_Utils_Tuple2('DoubleLongLeftRightArrow', '⟺'),
			_Utils_Tuple2('DoubleLongRightArrow', '⟹'),
			_Utils_Tuple2('DoubleRightArrow', '⇒'),
			_Utils_Tuple2('DoubleRightTee', '⊨'),
			_Utils_Tuple2('DoubleUpArrow', '⇑'),
			_Utils_Tuple2('DoubleUpDownArrow', '⇕'),
			_Utils_Tuple2('DoubleVerticalBar', '∥'),
			_Utils_Tuple2('DownArrowBar', '⤓'),
			_Utils_Tuple2('downarrow', '↓'),
			_Utils_Tuple2('DownArrow', '↓'),
			_Utils_Tuple2('Downarrow', '⇓'),
			_Utils_Tuple2('DownArrowUpArrow', '⇵'),
			_Utils_Tuple2('DownBreve', '̑'),
			_Utils_Tuple2('downdownarrows', '⇊'),
			_Utils_Tuple2('downharpoonleft', '⇃'),
			_Utils_Tuple2('downharpoonright', '⇂'),
			_Utils_Tuple2('DownLeftRightVector', '⥐'),
			_Utils_Tuple2('DownLeftTeeVector', '⥞'),
			_Utils_Tuple2('DownLeftVectorBar', '⥖'),
			_Utils_Tuple2('DownLeftVector', '↽'),
			_Utils_Tuple2('DownRightTeeVector', '⥟'),
			_Utils_Tuple2('DownRightVectorBar', '⥗'),
			_Utils_Tuple2('DownRightVector', '⇁'),
			_Utils_Tuple2('DownTeeArrow', '↧'),
			_Utils_Tuple2('DownTee', '⊤'),
			_Utils_Tuple2('drbkarow', '⤐'),
			_Utils_Tuple2('drcorn', '⌟'),
			_Utils_Tuple2('drcrop', '⌌'),
			_Utils_Tuple2('Dscr', '\uD835\uDC9F'),
			_Utils_Tuple2('dscr', '\uD835\uDCB9'),
			_Utils_Tuple2('DScy', 'Ѕ'),
			_Utils_Tuple2('dscy', 'ѕ'),
			_Utils_Tuple2('dsol', '⧶'),
			_Utils_Tuple2('Dstrok', 'Đ'),
			_Utils_Tuple2('dstrok', 'đ'),
			_Utils_Tuple2('dtdot', '⋱'),
			_Utils_Tuple2('dtri', '▿'),
			_Utils_Tuple2('dtrif', '▾'),
			_Utils_Tuple2('duarr', '⇵'),
			_Utils_Tuple2('duhar', '⥯'),
			_Utils_Tuple2('dwangle', '⦦'),
			_Utils_Tuple2('DZcy', 'Џ'),
			_Utils_Tuple2('dzcy', 'џ'),
			_Utils_Tuple2('dzigrarr', '⟿'),
			_Utils_Tuple2('Eacute', 'É'),
			_Utils_Tuple2('eacute', 'é'),
			_Utils_Tuple2('easter', '⩮'),
			_Utils_Tuple2('Ecaron', 'Ě'),
			_Utils_Tuple2('ecaron', 'ě'),
			_Utils_Tuple2('Ecirc', 'Ê'),
			_Utils_Tuple2('ecirc', 'ê'),
			_Utils_Tuple2('ecir', '≖'),
			_Utils_Tuple2('ecolon', '≕'),
			_Utils_Tuple2('Ecy', 'Э'),
			_Utils_Tuple2('ecy', 'э'),
			_Utils_Tuple2('eDDot', '⩷'),
			_Utils_Tuple2('Edot', 'Ė'),
			_Utils_Tuple2('edot', 'ė'),
			_Utils_Tuple2('eDot', '≑'),
			_Utils_Tuple2('ee', 'ⅇ'),
			_Utils_Tuple2('efDot', '≒'),
			_Utils_Tuple2('Efr', '\uD835\uDD08'),
			_Utils_Tuple2('efr', '\uD835\uDD22'),
			_Utils_Tuple2('eg', '⪚'),
			_Utils_Tuple2('Egrave', 'È'),
			_Utils_Tuple2('egrave', 'è'),
			_Utils_Tuple2('egs', '⪖'),
			_Utils_Tuple2('egsdot', '⪘'),
			_Utils_Tuple2('el', '⪙'),
			_Utils_Tuple2('Element', '∈'),
			_Utils_Tuple2('elinters', '⏧'),
			_Utils_Tuple2('ell', 'ℓ'),
			_Utils_Tuple2('els', '⪕'),
			_Utils_Tuple2('elsdot', '⪗'),
			_Utils_Tuple2('Emacr', 'Ē'),
			_Utils_Tuple2('emacr', 'ē'),
			_Utils_Tuple2('empty', '∅'),
			_Utils_Tuple2('emptyset', '∅'),
			_Utils_Tuple2('EmptySmallSquare', '◻'),
			_Utils_Tuple2('emptyv', '∅'),
			_Utils_Tuple2('EmptyVerySmallSquare', '▫'),
			_Utils_Tuple2('emsp13', '\u2004'),
			_Utils_Tuple2('emsp14', '\u2005'),
			_Utils_Tuple2('emsp', '\u2003'),
			_Utils_Tuple2('ENG', 'Ŋ'),
			_Utils_Tuple2('eng', 'ŋ'),
			_Utils_Tuple2('ensp', '\u2002'),
			_Utils_Tuple2('Eogon', 'Ę'),
			_Utils_Tuple2('eogon', 'ę'),
			_Utils_Tuple2('Eopf', '\uD835\uDD3C'),
			_Utils_Tuple2('eopf', '\uD835\uDD56'),
			_Utils_Tuple2('epar', '⋕'),
			_Utils_Tuple2('eparsl', '⧣'),
			_Utils_Tuple2('eplus', '⩱'),
			_Utils_Tuple2('epsi', 'ε'),
			_Utils_Tuple2('Epsilon', 'Ε'),
			_Utils_Tuple2('epsilon', 'ε'),
			_Utils_Tuple2('epsiv', 'ϵ'),
			_Utils_Tuple2('eqcirc', '≖'),
			_Utils_Tuple2('eqcolon', '≕'),
			_Utils_Tuple2('eqsim', '≂'),
			_Utils_Tuple2('eqslantgtr', '⪖'),
			_Utils_Tuple2('eqslantless', '⪕'),
			_Utils_Tuple2('Equal', '⩵'),
			_Utils_Tuple2('equals', '='),
			_Utils_Tuple2('EqualTilde', '≂'),
			_Utils_Tuple2('equest', '≟'),
			_Utils_Tuple2('Equilibrium', '⇌'),
			_Utils_Tuple2('equiv', '≡'),
			_Utils_Tuple2('equivDD', '⩸'),
			_Utils_Tuple2('eqvparsl', '⧥'),
			_Utils_Tuple2('erarr', '⥱'),
			_Utils_Tuple2('erDot', '≓'),
			_Utils_Tuple2('escr', 'ℯ'),
			_Utils_Tuple2('Escr', 'ℰ'),
			_Utils_Tuple2('esdot', '≐'),
			_Utils_Tuple2('Esim', '⩳'),
			_Utils_Tuple2('esim', '≂'),
			_Utils_Tuple2('Eta', 'Η'),
			_Utils_Tuple2('eta', 'η'),
			_Utils_Tuple2('ETH', 'Ð'),
			_Utils_Tuple2('eth', 'ð'),
			_Utils_Tuple2('Euml', 'Ë'),
			_Utils_Tuple2('euml', 'ë'),
			_Utils_Tuple2('euro', '€'),
			_Utils_Tuple2('excl', '!'),
			_Utils_Tuple2('exist', '∃'),
			_Utils_Tuple2('Exists', '∃'),
			_Utils_Tuple2('expectation', 'ℰ'),
			_Utils_Tuple2('exponentiale', 'ⅇ'),
			_Utils_Tuple2('ExponentialE', 'ⅇ'),
			_Utils_Tuple2('fallingdotseq', '≒'),
			_Utils_Tuple2('Fcy', 'Ф'),
			_Utils_Tuple2('fcy', 'ф'),
			_Utils_Tuple2('female', '♀'),
			_Utils_Tuple2('ffilig', 'ﬃ'),
			_Utils_Tuple2('fflig', 'ﬀ'),
			_Utils_Tuple2('ffllig', 'ﬄ'),
			_Utils_Tuple2('Ffr', '\uD835\uDD09'),
			_Utils_Tuple2('ffr', '\uD835\uDD23'),
			_Utils_Tuple2('filig', 'ﬁ'),
			_Utils_Tuple2('FilledSmallSquare', '◼'),
			_Utils_Tuple2('FilledVerySmallSquare', '▪'),
			_Utils_Tuple2('fjlig', 'fj'),
			_Utils_Tuple2('flat', '♭'),
			_Utils_Tuple2('fllig', 'ﬂ'),
			_Utils_Tuple2('fltns', '▱'),
			_Utils_Tuple2('fnof', 'ƒ'),
			_Utils_Tuple2('Fopf', '\uD835\uDD3D'),
			_Utils_Tuple2('fopf', '\uD835\uDD57'),
			_Utils_Tuple2('forall', '∀'),
			_Utils_Tuple2('ForAll', '∀'),
			_Utils_Tuple2('fork', '⋔'),
			_Utils_Tuple2('forkv', '⫙'),
			_Utils_Tuple2('Fouriertrf', 'ℱ'),
			_Utils_Tuple2('fpartint', '⨍'),
			_Utils_Tuple2('frac12', '½'),
			_Utils_Tuple2('frac13', '⅓'),
			_Utils_Tuple2('frac14', '¼'),
			_Utils_Tuple2('frac15', '⅕'),
			_Utils_Tuple2('frac16', '⅙'),
			_Utils_Tuple2('frac18', '⅛'),
			_Utils_Tuple2('frac23', '⅔'),
			_Utils_Tuple2('frac25', '⅖'),
			_Utils_Tuple2('frac34', '¾'),
			_Utils_Tuple2('frac35', '⅗'),
			_Utils_Tuple2('frac38', '⅜'),
			_Utils_Tuple2('frac45', '⅘'),
			_Utils_Tuple2('frac56', '⅚'),
			_Utils_Tuple2('frac58', '⅝'),
			_Utils_Tuple2('frac78', '⅞'),
			_Utils_Tuple2('frasl', '⁄'),
			_Utils_Tuple2('frown', '⌢'),
			_Utils_Tuple2('fscr', '\uD835\uDCBB'),
			_Utils_Tuple2('Fscr', 'ℱ'),
			_Utils_Tuple2('gacute', 'ǵ'),
			_Utils_Tuple2('Gamma', 'Γ'),
			_Utils_Tuple2('gamma', 'γ'),
			_Utils_Tuple2('Gammad', 'Ϝ'),
			_Utils_Tuple2('gammad', 'ϝ'),
			_Utils_Tuple2('gap', '⪆'),
			_Utils_Tuple2('Gbreve', 'Ğ'),
			_Utils_Tuple2('gbreve', 'ğ'),
			_Utils_Tuple2('Gcedil', 'Ģ'),
			_Utils_Tuple2('Gcirc', 'Ĝ'),
			_Utils_Tuple2('gcirc', 'ĝ'),
			_Utils_Tuple2('Gcy', 'Г'),
			_Utils_Tuple2('gcy', 'г'),
			_Utils_Tuple2('Gdot', 'Ġ'),
			_Utils_Tuple2('gdot', 'ġ'),
			_Utils_Tuple2('ge', '≥'),
			_Utils_Tuple2('gE', '≧'),
			_Utils_Tuple2('gEl', '⪌'),
			_Utils_Tuple2('gel', '⋛'),
			_Utils_Tuple2('geq', '≥'),
			_Utils_Tuple2('geqq', '≧'),
			_Utils_Tuple2('geqslant', '⩾'),
			_Utils_Tuple2('gescc', '⪩'),
			_Utils_Tuple2('ges', '⩾'),
			_Utils_Tuple2('gesdot', '⪀'),
			_Utils_Tuple2('gesdoto', '⪂'),
			_Utils_Tuple2('gesdotol', '⪄'),
			_Utils_Tuple2('gesl', '⋛︀'),
			_Utils_Tuple2('gesles', '⪔'),
			_Utils_Tuple2('Gfr', '\uD835\uDD0A'),
			_Utils_Tuple2('gfr', '\uD835\uDD24'),
			_Utils_Tuple2('gg', '≫'),
			_Utils_Tuple2('Gg', '⋙'),
			_Utils_Tuple2('ggg', '⋙'),
			_Utils_Tuple2('gimel', 'ℷ'),
			_Utils_Tuple2('GJcy', 'Ѓ'),
			_Utils_Tuple2('gjcy', 'ѓ'),
			_Utils_Tuple2('gla', '⪥'),
			_Utils_Tuple2('gl', '≷'),
			_Utils_Tuple2('glE', '⪒'),
			_Utils_Tuple2('glj', '⪤'),
			_Utils_Tuple2('gnap', '⪊'),
			_Utils_Tuple2('gnapprox', '⪊'),
			_Utils_Tuple2('gne', '⪈'),
			_Utils_Tuple2('gnE', '≩'),
			_Utils_Tuple2('gneq', '⪈'),
			_Utils_Tuple2('gneqq', '≩'),
			_Utils_Tuple2('gnsim', '⋧'),
			_Utils_Tuple2('Gopf', '\uD835\uDD3E'),
			_Utils_Tuple2('gopf', '\uD835\uDD58'),
			_Utils_Tuple2('grave', '`'),
			_Utils_Tuple2('GreaterEqual', '≥'),
			_Utils_Tuple2('GreaterEqualLess', '⋛'),
			_Utils_Tuple2('GreaterFullEqual', '≧'),
			_Utils_Tuple2('GreaterGreater', '⪢'),
			_Utils_Tuple2('GreaterLess', '≷'),
			_Utils_Tuple2('GreaterSlantEqual', '⩾'),
			_Utils_Tuple2('GreaterTilde', '≳'),
			_Utils_Tuple2('Gscr', '\uD835\uDCA2'),
			_Utils_Tuple2('gscr', 'ℊ'),
			_Utils_Tuple2('gsim', '≳'),
			_Utils_Tuple2('gsime', '⪎'),
			_Utils_Tuple2('gsiml', '⪐'),
			_Utils_Tuple2('gtcc', '⪧'),
			_Utils_Tuple2('gtcir', '⩺'),
			_Utils_Tuple2('gt', '>'),
			_Utils_Tuple2('GT', '>'),
			_Utils_Tuple2('Gt', '≫'),
			_Utils_Tuple2('gtdot', '⋗'),
			_Utils_Tuple2('gtlPar', '⦕'),
			_Utils_Tuple2('gtquest', '⩼'),
			_Utils_Tuple2('gtrapprox', '⪆'),
			_Utils_Tuple2('gtrarr', '⥸'),
			_Utils_Tuple2('gtrdot', '⋗'),
			_Utils_Tuple2('gtreqless', '⋛'),
			_Utils_Tuple2('gtreqqless', '⪌'),
			_Utils_Tuple2('gtrless', '≷'),
			_Utils_Tuple2('gtrsim', '≳'),
			_Utils_Tuple2('gvertneqq', '≩︀'),
			_Utils_Tuple2('gvnE', '≩︀'),
			_Utils_Tuple2('Hacek', 'ˇ'),
			_Utils_Tuple2('hairsp', '\u200A'),
			_Utils_Tuple2('half', '½'),
			_Utils_Tuple2('hamilt', 'ℋ'),
			_Utils_Tuple2('HARDcy', 'Ъ'),
			_Utils_Tuple2('hardcy', 'ъ'),
			_Utils_Tuple2('harrcir', '⥈'),
			_Utils_Tuple2('harr', '↔'),
			_Utils_Tuple2('hArr', '⇔'),
			_Utils_Tuple2('harrw', '↭'),
			_Utils_Tuple2('Hat', '^'),
			_Utils_Tuple2('hbar', 'ℏ'),
			_Utils_Tuple2('Hcirc', 'Ĥ'),
			_Utils_Tuple2('hcirc', 'ĥ'),
			_Utils_Tuple2('hearts', '♥'),
			_Utils_Tuple2('heartsuit', '♥'),
			_Utils_Tuple2('hellip', '…'),
			_Utils_Tuple2('hercon', '⊹'),
			_Utils_Tuple2('hfr', '\uD835\uDD25'),
			_Utils_Tuple2('Hfr', 'ℌ'),
			_Utils_Tuple2('HilbertSpace', 'ℋ'),
			_Utils_Tuple2('hksearow', '⤥'),
			_Utils_Tuple2('hkswarow', '⤦'),
			_Utils_Tuple2('hoarr', '⇿'),
			_Utils_Tuple2('homtht', '∻'),
			_Utils_Tuple2('hookleftarrow', '↩'),
			_Utils_Tuple2('hookrightarrow', '↪'),
			_Utils_Tuple2('hopf', '\uD835\uDD59'),
			_Utils_Tuple2('Hopf', 'ℍ'),
			_Utils_Tuple2('horbar', '―'),
			_Utils_Tuple2('HorizontalLine', '─'),
			_Utils_Tuple2('hscr', '\uD835\uDCBD'),
			_Utils_Tuple2('Hscr', 'ℋ'),
			_Utils_Tuple2('hslash', 'ℏ'),
			_Utils_Tuple2('Hstrok', 'Ħ'),
			_Utils_Tuple2('hstrok', 'ħ'),
			_Utils_Tuple2('HumpDownHump', '≎'),
			_Utils_Tuple2('HumpEqual', '≏'),
			_Utils_Tuple2('hybull', '⁃'),
			_Utils_Tuple2('hyphen', '‐'),
			_Utils_Tuple2('Iacute', 'Í'),
			_Utils_Tuple2('iacute', 'í'),
			_Utils_Tuple2('ic', '\u2063'),
			_Utils_Tuple2('Icirc', 'Î'),
			_Utils_Tuple2('icirc', 'î'),
			_Utils_Tuple2('Icy', 'И'),
			_Utils_Tuple2('icy', 'и'),
			_Utils_Tuple2('Idot', 'İ'),
			_Utils_Tuple2('IEcy', 'Е'),
			_Utils_Tuple2('iecy', 'е'),
			_Utils_Tuple2('iexcl', '¡'),
			_Utils_Tuple2('iff', '⇔'),
			_Utils_Tuple2('ifr', '\uD835\uDD26'),
			_Utils_Tuple2('Ifr', 'ℑ'),
			_Utils_Tuple2('Igrave', 'Ì'),
			_Utils_Tuple2('igrave', 'ì'),
			_Utils_Tuple2('ii', 'ⅈ'),
			_Utils_Tuple2('iiiint', '⨌'),
			_Utils_Tuple2('iiint', '∭'),
			_Utils_Tuple2('iinfin', '⧜'),
			_Utils_Tuple2('iiota', '℩'),
			_Utils_Tuple2('IJlig', 'Ĳ'),
			_Utils_Tuple2('ijlig', 'ĳ'),
			_Utils_Tuple2('Imacr', 'Ī'),
			_Utils_Tuple2('imacr', 'ī'),
			_Utils_Tuple2('image', 'ℑ'),
			_Utils_Tuple2('ImaginaryI', 'ⅈ'),
			_Utils_Tuple2('imagline', 'ℐ'),
			_Utils_Tuple2('imagpart', 'ℑ'),
			_Utils_Tuple2('imath', 'ı'),
			_Utils_Tuple2('Im', 'ℑ'),
			_Utils_Tuple2('imof', '⊷'),
			_Utils_Tuple2('imped', 'Ƶ'),
			_Utils_Tuple2('Implies', '⇒'),
			_Utils_Tuple2('incare', '℅'),
			_Utils_Tuple2('in', '∈'),
			_Utils_Tuple2('infin', '∞'),
			_Utils_Tuple2('infintie', '⧝'),
			_Utils_Tuple2('inodot', 'ı'),
			_Utils_Tuple2('intcal', '⊺'),
			_Utils_Tuple2('int', '∫'),
			_Utils_Tuple2('Int', '∬'),
			_Utils_Tuple2('integers', 'ℤ'),
			_Utils_Tuple2('Integral', '∫'),
			_Utils_Tuple2('intercal', '⊺'),
			_Utils_Tuple2('Intersection', '⋂'),
			_Utils_Tuple2('intlarhk', '⨗'),
			_Utils_Tuple2('intprod', '⨼'),
			_Utils_Tuple2('InvisibleComma', '\u2063'),
			_Utils_Tuple2('InvisibleTimes', '\u2062'),
			_Utils_Tuple2('IOcy', 'Ё'),
			_Utils_Tuple2('iocy', 'ё'),
			_Utils_Tuple2('Iogon', 'Į'),
			_Utils_Tuple2('iogon', 'į'),
			_Utils_Tuple2('Iopf', '\uD835\uDD40'),
			_Utils_Tuple2('iopf', '\uD835\uDD5A'),
			_Utils_Tuple2('Iota', 'Ι'),
			_Utils_Tuple2('iota', 'ι'),
			_Utils_Tuple2('iprod', '⨼'),
			_Utils_Tuple2('iquest', '¿'),
			_Utils_Tuple2('iscr', '\uD835\uDCBE'),
			_Utils_Tuple2('Iscr', 'ℐ'),
			_Utils_Tuple2('isin', '∈'),
			_Utils_Tuple2('isindot', '⋵'),
			_Utils_Tuple2('isinE', '⋹'),
			_Utils_Tuple2('isins', '⋴'),
			_Utils_Tuple2('isinsv', '⋳'),
			_Utils_Tuple2('isinv', '∈'),
			_Utils_Tuple2('it', '\u2062'),
			_Utils_Tuple2('Itilde', 'Ĩ'),
			_Utils_Tuple2('itilde', 'ĩ'),
			_Utils_Tuple2('Iukcy', 'І'),
			_Utils_Tuple2('iukcy', 'і'),
			_Utils_Tuple2('Iuml', 'Ï'),
			_Utils_Tuple2('iuml', 'ï'),
			_Utils_Tuple2('Jcirc', 'Ĵ'),
			_Utils_Tuple2('jcirc', 'ĵ'),
			_Utils_Tuple2('Jcy', 'Й'),
			_Utils_Tuple2('jcy', 'й'),
			_Utils_Tuple2('Jfr', '\uD835\uDD0D'),
			_Utils_Tuple2('jfr', '\uD835\uDD27'),
			_Utils_Tuple2('jmath', 'ȷ'),
			_Utils_Tuple2('Jopf', '\uD835\uDD41'),
			_Utils_Tuple2('jopf', '\uD835\uDD5B'),
			_Utils_Tuple2('Jscr', '\uD835\uDCA5'),
			_Utils_Tuple2('jscr', '\uD835\uDCBF'),
			_Utils_Tuple2('Jsercy', 'Ј'),
			_Utils_Tuple2('jsercy', 'ј'),
			_Utils_Tuple2('Jukcy', 'Є'),
			_Utils_Tuple2('jukcy', 'є'),
			_Utils_Tuple2('Kappa', 'Κ'),
			_Utils_Tuple2('kappa', 'κ'),
			_Utils_Tuple2('kappav', 'ϰ'),
			_Utils_Tuple2('Kcedil', 'Ķ'),
			_Utils_Tuple2('kcedil', 'ķ'),
			_Utils_Tuple2('Kcy', 'К'),
			_Utils_Tuple2('kcy', 'к'),
			_Utils_Tuple2('Kfr', '\uD835\uDD0E'),
			_Utils_Tuple2('kfr', '\uD835\uDD28'),
			_Utils_Tuple2('kgreen', 'ĸ'),
			_Utils_Tuple2('KHcy', 'Х'),
			_Utils_Tuple2('khcy', 'х'),
			_Utils_Tuple2('KJcy', 'Ќ'),
			_Utils_Tuple2('kjcy', 'ќ'),
			_Utils_Tuple2('Kopf', '\uD835\uDD42'),
			_Utils_Tuple2('kopf', '\uD835\uDD5C'),
			_Utils_Tuple2('Kscr', '\uD835\uDCA6'),
			_Utils_Tuple2('kscr', '\uD835\uDCC0'),
			_Utils_Tuple2('lAarr', '⇚'),
			_Utils_Tuple2('Lacute', 'Ĺ'),
			_Utils_Tuple2('lacute', 'ĺ'),
			_Utils_Tuple2('laemptyv', '⦴'),
			_Utils_Tuple2('lagran', 'ℒ'),
			_Utils_Tuple2('Lambda', 'Λ'),
			_Utils_Tuple2('lambda', 'λ'),
			_Utils_Tuple2('lang', '⟨'),
			_Utils_Tuple2('Lang', '⟪'),
			_Utils_Tuple2('langd', '⦑'),
			_Utils_Tuple2('langle', '⟨'),
			_Utils_Tuple2('lap', '⪅'),
			_Utils_Tuple2('Laplacetrf', 'ℒ'),
			_Utils_Tuple2('laquo', '«'),
			_Utils_Tuple2('larrb', '⇤'),
			_Utils_Tuple2('larrbfs', '⤟'),
			_Utils_Tuple2('larr', '←'),
			_Utils_Tuple2('Larr', '↞'),
			_Utils_Tuple2('lArr', '⇐'),
			_Utils_Tuple2('larrfs', '⤝'),
			_Utils_Tuple2('larrhk', '↩'),
			_Utils_Tuple2('larrlp', '↫'),
			_Utils_Tuple2('larrpl', '⤹'),
			_Utils_Tuple2('larrsim', '⥳'),
			_Utils_Tuple2('larrtl', '↢'),
			_Utils_Tuple2('latail', '⤙'),
			_Utils_Tuple2('lAtail', '⤛'),
			_Utils_Tuple2('lat', '⪫'),
			_Utils_Tuple2('late', '⪭'),
			_Utils_Tuple2('lates', '⪭︀'),
			_Utils_Tuple2('lbarr', '⤌'),
			_Utils_Tuple2('lBarr', '⤎'),
			_Utils_Tuple2('lbbrk', '❲'),
			_Utils_Tuple2('lbrace', '{'),
			_Utils_Tuple2('lbrack', '['),
			_Utils_Tuple2('lbrke', '⦋'),
			_Utils_Tuple2('lbrksld', '⦏'),
			_Utils_Tuple2('lbrkslu', '⦍'),
			_Utils_Tuple2('Lcaron', 'Ľ'),
			_Utils_Tuple2('lcaron', 'ľ'),
			_Utils_Tuple2('Lcedil', 'Ļ'),
			_Utils_Tuple2('lcedil', 'ļ'),
			_Utils_Tuple2('lceil', '⌈'),
			_Utils_Tuple2('lcub', '{'),
			_Utils_Tuple2('Lcy', 'Л'),
			_Utils_Tuple2('lcy', 'л'),
			_Utils_Tuple2('ldca', '⤶'),
			_Utils_Tuple2('ldquo', '“'),
			_Utils_Tuple2('ldquor', '„'),
			_Utils_Tuple2('ldrdhar', '⥧'),
			_Utils_Tuple2('ldrushar', '⥋'),
			_Utils_Tuple2('ldsh', '↲'),
			_Utils_Tuple2('le', '≤'),
			_Utils_Tuple2('lE', '≦'),
			_Utils_Tuple2('LeftAngleBracket', '⟨'),
			_Utils_Tuple2('LeftArrowBar', '⇤'),
			_Utils_Tuple2('leftarrow', '←'),
			_Utils_Tuple2('LeftArrow', '←'),
			_Utils_Tuple2('Leftarrow', '⇐'),
			_Utils_Tuple2('LeftArrowRightArrow', '⇆'),
			_Utils_Tuple2('leftarrowtail', '↢'),
			_Utils_Tuple2('LeftCeiling', '⌈'),
			_Utils_Tuple2('LeftDoubleBracket', '⟦'),
			_Utils_Tuple2('LeftDownTeeVector', '⥡'),
			_Utils_Tuple2('LeftDownVectorBar', '⥙'),
			_Utils_Tuple2('LeftDownVector', '⇃'),
			_Utils_Tuple2('LeftFloor', '⌊'),
			_Utils_Tuple2('leftharpoondown', '↽'),
			_Utils_Tuple2('leftharpoonup', '↼'),
			_Utils_Tuple2('leftleftarrows', '⇇'),
			_Utils_Tuple2('leftrightarrow', '↔'),
			_Utils_Tuple2('LeftRightArrow', '↔'),
			_Utils_Tuple2('Leftrightarrow', '⇔'),
			_Utils_Tuple2('leftrightarrows', '⇆'),
			_Utils_Tuple2('leftrightharpoons', '⇋'),
			_Utils_Tuple2('leftrightsquigarrow', '↭'),
			_Utils_Tuple2('LeftRightVector', '⥎'),
			_Utils_Tuple2('LeftTeeArrow', '↤'),
			_Utils_Tuple2('LeftTee', '⊣'),
			_Utils_Tuple2('LeftTeeVector', '⥚'),
			_Utils_Tuple2('leftthreetimes', '⋋'),
			_Utils_Tuple2('LeftTriangleBar', '⧏'),
			_Utils_Tuple2('LeftTriangle', '⊲'),
			_Utils_Tuple2('LeftTriangleEqual', '⊴'),
			_Utils_Tuple2('LeftUpDownVector', '⥑'),
			_Utils_Tuple2('LeftUpTeeVector', '⥠'),
			_Utils_Tuple2('LeftUpVectorBar', '⥘'),
			_Utils_Tuple2('LeftUpVector', '↿'),
			_Utils_Tuple2('LeftVectorBar', '⥒'),
			_Utils_Tuple2('LeftVector', '↼'),
			_Utils_Tuple2('lEg', '⪋'),
			_Utils_Tuple2('leg', '⋚'),
			_Utils_Tuple2('leq', '≤'),
			_Utils_Tuple2('leqq', '≦'),
			_Utils_Tuple2('leqslant', '⩽'),
			_Utils_Tuple2('lescc', '⪨'),
			_Utils_Tuple2('les', '⩽'),
			_Utils_Tuple2('lesdot', '⩿'),
			_Utils_Tuple2('lesdoto', '⪁'),
			_Utils_Tuple2('lesdotor', '⪃'),
			_Utils_Tuple2('lesg', '⋚︀'),
			_Utils_Tuple2('lesges', '⪓'),
			_Utils_Tuple2('lessapprox', '⪅'),
			_Utils_Tuple2('lessdot', '⋖'),
			_Utils_Tuple2('lesseqgtr', '⋚'),
			_Utils_Tuple2('lesseqqgtr', '⪋'),
			_Utils_Tuple2('LessEqualGreater', '⋚'),
			_Utils_Tuple2('LessFullEqual', '≦'),
			_Utils_Tuple2('LessGreater', '≶'),
			_Utils_Tuple2('lessgtr', '≶'),
			_Utils_Tuple2('LessLess', '⪡'),
			_Utils_Tuple2('lesssim', '≲'),
			_Utils_Tuple2('LessSlantEqual', '⩽'),
			_Utils_Tuple2('LessTilde', '≲'),
			_Utils_Tuple2('lfisht', '⥼'),
			_Utils_Tuple2('lfloor', '⌊'),
			_Utils_Tuple2('Lfr', '\uD835\uDD0F'),
			_Utils_Tuple2('lfr', '\uD835\uDD29'),
			_Utils_Tuple2('lg', '≶'),
			_Utils_Tuple2('lgE', '⪑'),
			_Utils_Tuple2('lHar', '⥢'),
			_Utils_Tuple2('lhard', '↽'),
			_Utils_Tuple2('lharu', '↼'),
			_Utils_Tuple2('lharul', '⥪'),
			_Utils_Tuple2('lhblk', '▄'),
			_Utils_Tuple2('LJcy', 'Љ'),
			_Utils_Tuple2('ljcy', 'љ'),
			_Utils_Tuple2('llarr', '⇇'),
			_Utils_Tuple2('ll', '≪'),
			_Utils_Tuple2('Ll', '⋘'),
			_Utils_Tuple2('llcorner', '⌞'),
			_Utils_Tuple2('Lleftarrow', '⇚'),
			_Utils_Tuple2('llhard', '⥫'),
			_Utils_Tuple2('lltri', '◺'),
			_Utils_Tuple2('Lmidot', 'Ŀ'),
			_Utils_Tuple2('lmidot', 'ŀ'),
			_Utils_Tuple2('lmoustache', '⎰'),
			_Utils_Tuple2('lmoust', '⎰'),
			_Utils_Tuple2('lnap', '⪉'),
			_Utils_Tuple2('lnapprox', '⪉'),
			_Utils_Tuple2('lne', '⪇'),
			_Utils_Tuple2('lnE', '≨'),
			_Utils_Tuple2('lneq', '⪇'),
			_Utils_Tuple2('lneqq', '≨'),
			_Utils_Tuple2('lnsim', '⋦'),
			_Utils_Tuple2('loang', '⟬'),
			_Utils_Tuple2('loarr', '⇽'),
			_Utils_Tuple2('lobrk', '⟦'),
			_Utils_Tuple2('longleftarrow', '⟵'),
			_Utils_Tuple2('LongLeftArrow', '⟵'),
			_Utils_Tuple2('Longleftarrow', '⟸'),
			_Utils_Tuple2('longleftrightarrow', '⟷'),
			_Utils_Tuple2('LongLeftRightArrow', '⟷'),
			_Utils_Tuple2('Longleftrightarrow', '⟺'),
			_Utils_Tuple2('longmapsto', '⟼'),
			_Utils_Tuple2('longrightarrow', '⟶'),
			_Utils_Tuple2('LongRightArrow', '⟶'),
			_Utils_Tuple2('Longrightarrow', '⟹'),
			_Utils_Tuple2('looparrowleft', '↫'),
			_Utils_Tuple2('looparrowright', '↬'),
			_Utils_Tuple2('lopar', '⦅'),
			_Utils_Tuple2('Lopf', '\uD835\uDD43'),
			_Utils_Tuple2('lopf', '\uD835\uDD5D'),
			_Utils_Tuple2('loplus', '⨭'),
			_Utils_Tuple2('lotimes', '⨴'),
			_Utils_Tuple2('lowast', '∗'),
			_Utils_Tuple2('lowbar', '_'),
			_Utils_Tuple2('LowerLeftArrow', '↙'),
			_Utils_Tuple2('LowerRightArrow', '↘'),
			_Utils_Tuple2('loz', '◊'),
			_Utils_Tuple2('lozenge', '◊'),
			_Utils_Tuple2('lozf', '⧫'),
			_Utils_Tuple2('lpar', '('),
			_Utils_Tuple2('lparlt', '⦓'),
			_Utils_Tuple2('lrarr', '⇆'),
			_Utils_Tuple2('lrcorner', '⌟'),
			_Utils_Tuple2('lrhar', '⇋'),
			_Utils_Tuple2('lrhard', '⥭'),
			_Utils_Tuple2('lrm', '\u200E'),
			_Utils_Tuple2('lrtri', '⊿'),
			_Utils_Tuple2('lsaquo', '‹'),
			_Utils_Tuple2('lscr', '\uD835\uDCC1'),
			_Utils_Tuple2('Lscr', 'ℒ'),
			_Utils_Tuple2('lsh', '↰'),
			_Utils_Tuple2('Lsh', '↰'),
			_Utils_Tuple2('lsim', '≲'),
			_Utils_Tuple2('lsime', '⪍'),
			_Utils_Tuple2('lsimg', '⪏'),
			_Utils_Tuple2('lsqb', '['),
			_Utils_Tuple2('lsquo', '‘'),
			_Utils_Tuple2('lsquor', '‚'),
			_Utils_Tuple2('Lstrok', 'Ł'),
			_Utils_Tuple2('lstrok', 'ł'),
			_Utils_Tuple2('ltcc', '⪦'),
			_Utils_Tuple2('ltcir', '⩹'),
			_Utils_Tuple2('lt', '<'),
			_Utils_Tuple2('LT', '<'),
			_Utils_Tuple2('Lt', '≪'),
			_Utils_Tuple2('ltdot', '⋖'),
			_Utils_Tuple2('lthree', '⋋'),
			_Utils_Tuple2('ltimes', '⋉'),
			_Utils_Tuple2('ltlarr', '⥶'),
			_Utils_Tuple2('ltquest', '⩻'),
			_Utils_Tuple2('ltri', '◃'),
			_Utils_Tuple2('ltrie', '⊴'),
			_Utils_Tuple2('ltrif', '◂'),
			_Utils_Tuple2('ltrPar', '⦖'),
			_Utils_Tuple2('lurdshar', '⥊'),
			_Utils_Tuple2('luruhar', '⥦'),
			_Utils_Tuple2('lvertneqq', '≨︀'),
			_Utils_Tuple2('lvnE', '≨︀'),
			_Utils_Tuple2('macr', '¯'),
			_Utils_Tuple2('male', '♂'),
			_Utils_Tuple2('malt', '✠'),
			_Utils_Tuple2('maltese', '✠'),
			_Utils_Tuple2('Map', '⤅'),
			_Utils_Tuple2('map', '↦'),
			_Utils_Tuple2('mapsto', '↦'),
			_Utils_Tuple2('mapstodown', '↧'),
			_Utils_Tuple2('mapstoleft', '↤'),
			_Utils_Tuple2('mapstoup', '↥'),
			_Utils_Tuple2('marker', '▮'),
			_Utils_Tuple2('mcomma', '⨩'),
			_Utils_Tuple2('Mcy', 'М'),
			_Utils_Tuple2('mcy', 'м'),
			_Utils_Tuple2('mdash', '—'),
			_Utils_Tuple2('mDDot', '∺'),
			_Utils_Tuple2('measuredangle', '∡'),
			_Utils_Tuple2('MediumSpace', '\u205F'),
			_Utils_Tuple2('Mellintrf', 'ℳ'),
			_Utils_Tuple2('Mfr', '\uD835\uDD10'),
			_Utils_Tuple2('mfr', '\uD835\uDD2A'),
			_Utils_Tuple2('mho', '℧'),
			_Utils_Tuple2('micro', 'µ'),
			_Utils_Tuple2('midast', '*'),
			_Utils_Tuple2('midcir', '⫰'),
			_Utils_Tuple2('mid', '∣'),
			_Utils_Tuple2('middot', '·'),
			_Utils_Tuple2('minusb', '⊟'),
			_Utils_Tuple2('minus', '−'),
			_Utils_Tuple2('minusd', '∸'),
			_Utils_Tuple2('minusdu', '⨪'),
			_Utils_Tuple2('MinusPlus', '∓'),
			_Utils_Tuple2('mlcp', '⫛'),
			_Utils_Tuple2('mldr', '…'),
			_Utils_Tuple2('mnplus', '∓'),
			_Utils_Tuple2('models', '⊧'),
			_Utils_Tuple2('Mopf', '\uD835\uDD44'),
			_Utils_Tuple2('mopf', '\uD835\uDD5E'),
			_Utils_Tuple2('mp', '∓'),
			_Utils_Tuple2('mscr', '\uD835\uDCC2'),
			_Utils_Tuple2('Mscr', 'ℳ'),
			_Utils_Tuple2('mstpos', '∾'),
			_Utils_Tuple2('Mu', 'Μ'),
			_Utils_Tuple2('mu', 'μ'),
			_Utils_Tuple2('multimap', '⊸'),
			_Utils_Tuple2('mumap', '⊸'),
			_Utils_Tuple2('nabla', '∇'),
			_Utils_Tuple2('Nacute', 'Ń'),
			_Utils_Tuple2('nacute', 'ń'),
			_Utils_Tuple2('nang', '∠⃒'),
			_Utils_Tuple2('nap', '≉'),
			_Utils_Tuple2('napE', '⩰̸'),
			_Utils_Tuple2('napid', '≋̸'),
			_Utils_Tuple2('napos', 'ŉ'),
			_Utils_Tuple2('napprox', '≉'),
			_Utils_Tuple2('natural', '♮'),
			_Utils_Tuple2('naturals', 'ℕ'),
			_Utils_Tuple2('natur', '♮'),
			_Utils_Tuple2('nbsp', '\u00A0'),
			_Utils_Tuple2('nbump', '≎̸'),
			_Utils_Tuple2('nbumpe', '≏̸'),
			_Utils_Tuple2('ncap', '⩃'),
			_Utils_Tuple2('Ncaron', 'Ň'),
			_Utils_Tuple2('ncaron', 'ň'),
			_Utils_Tuple2('Ncedil', 'Ņ'),
			_Utils_Tuple2('ncedil', 'ņ'),
			_Utils_Tuple2('ncong', '≇'),
			_Utils_Tuple2('ncongdot', '⩭̸'),
			_Utils_Tuple2('ncup', '⩂'),
			_Utils_Tuple2('Ncy', 'Н'),
			_Utils_Tuple2('ncy', 'н'),
			_Utils_Tuple2('ndash', '–'),
			_Utils_Tuple2('nearhk', '⤤'),
			_Utils_Tuple2('nearr', '↗'),
			_Utils_Tuple2('neArr', '⇗'),
			_Utils_Tuple2('nearrow', '↗'),
			_Utils_Tuple2('ne', '≠'),
			_Utils_Tuple2('nedot', '≐̸'),
			_Utils_Tuple2('NegativeMediumSpace', '\u200B'),
			_Utils_Tuple2('NegativeThickSpace', '\u200B'),
			_Utils_Tuple2('NegativeThinSpace', '\u200B'),
			_Utils_Tuple2('NegativeVeryThinSpace', '\u200B'),
			_Utils_Tuple2('nequiv', '≢'),
			_Utils_Tuple2('nesear', '⤨'),
			_Utils_Tuple2('nesim', '≂̸'),
			_Utils_Tuple2('NestedGreaterGreater', '≫'),
			_Utils_Tuple2('NestedLessLess', '≪'),
			_Utils_Tuple2('NewLine', '\n'),
			_Utils_Tuple2('nexist', '∄'),
			_Utils_Tuple2('nexists', '∄'),
			_Utils_Tuple2('Nfr', '\uD835\uDD11'),
			_Utils_Tuple2('nfr', '\uD835\uDD2B'),
			_Utils_Tuple2('ngE', '≧̸'),
			_Utils_Tuple2('nge', '≱'),
			_Utils_Tuple2('ngeq', '≱'),
			_Utils_Tuple2('ngeqq', '≧̸'),
			_Utils_Tuple2('ngeqslant', '⩾̸'),
			_Utils_Tuple2('nges', '⩾̸'),
			_Utils_Tuple2('nGg', '⋙̸'),
			_Utils_Tuple2('ngsim', '≵'),
			_Utils_Tuple2('nGt', '≫⃒'),
			_Utils_Tuple2('ngt', '≯'),
			_Utils_Tuple2('ngtr', '≯'),
			_Utils_Tuple2('nGtv', '≫̸'),
			_Utils_Tuple2('nharr', '↮'),
			_Utils_Tuple2('nhArr', '⇎'),
			_Utils_Tuple2('nhpar', '⫲'),
			_Utils_Tuple2('ni', '∋'),
			_Utils_Tuple2('nis', '⋼'),
			_Utils_Tuple2('nisd', '⋺'),
			_Utils_Tuple2('niv', '∋'),
			_Utils_Tuple2('NJcy', 'Њ'),
			_Utils_Tuple2('njcy', 'њ'),
			_Utils_Tuple2('nlarr', '↚'),
			_Utils_Tuple2('nlArr', '⇍'),
			_Utils_Tuple2('nldr', '‥'),
			_Utils_Tuple2('nlE', '≦̸'),
			_Utils_Tuple2('nle', '≰'),
			_Utils_Tuple2('nleftarrow', '↚'),
			_Utils_Tuple2('nLeftarrow', '⇍'),
			_Utils_Tuple2('nleftrightarrow', '↮'),
			_Utils_Tuple2('nLeftrightarrow', '⇎'),
			_Utils_Tuple2('nleq', '≰'),
			_Utils_Tuple2('nleqq', '≦̸'),
			_Utils_Tuple2('nleqslant', '⩽̸'),
			_Utils_Tuple2('nles', '⩽̸'),
			_Utils_Tuple2('nless', '≮'),
			_Utils_Tuple2('nLl', '⋘̸'),
			_Utils_Tuple2('nlsim', '≴'),
			_Utils_Tuple2('nLt', '≪⃒'),
			_Utils_Tuple2('nlt', '≮'),
			_Utils_Tuple2('nltri', '⋪'),
			_Utils_Tuple2('nltrie', '⋬'),
			_Utils_Tuple2('nLtv', '≪̸'),
			_Utils_Tuple2('nmid', '∤'),
			_Utils_Tuple2('NoBreak', '\u2060'),
			_Utils_Tuple2('NonBreakingSpace', '\u00A0'),
			_Utils_Tuple2('nopf', '\uD835\uDD5F'),
			_Utils_Tuple2('Nopf', 'ℕ'),
			_Utils_Tuple2('Not', '⫬'),
			_Utils_Tuple2('not', '¬'),
			_Utils_Tuple2('NotCongruent', '≢'),
			_Utils_Tuple2('NotCupCap', '≭'),
			_Utils_Tuple2('NotDoubleVerticalBar', '∦'),
			_Utils_Tuple2('NotElement', '∉'),
			_Utils_Tuple2('NotEqual', '≠'),
			_Utils_Tuple2('NotEqualTilde', '≂̸'),
			_Utils_Tuple2('NotExists', '∄'),
			_Utils_Tuple2('NotGreater', '≯'),
			_Utils_Tuple2('NotGreaterEqual', '≱'),
			_Utils_Tuple2('NotGreaterFullEqual', '≧̸'),
			_Utils_Tuple2('NotGreaterGreater', '≫̸'),
			_Utils_Tuple2('NotGreaterLess', '≹'),
			_Utils_Tuple2('NotGreaterSlantEqual', '⩾̸'),
			_Utils_Tuple2('NotGreaterTilde', '≵'),
			_Utils_Tuple2('NotHumpDownHump', '≎̸'),
			_Utils_Tuple2('NotHumpEqual', '≏̸'),
			_Utils_Tuple2('notin', '∉'),
			_Utils_Tuple2('notindot', '⋵̸'),
			_Utils_Tuple2('notinE', '⋹̸'),
			_Utils_Tuple2('notinva', '∉'),
			_Utils_Tuple2('notinvb', '⋷'),
			_Utils_Tuple2('notinvc', '⋶'),
			_Utils_Tuple2('NotLeftTriangleBar', '⧏̸'),
			_Utils_Tuple2('NotLeftTriangle', '⋪'),
			_Utils_Tuple2('NotLeftTriangleEqual', '⋬'),
			_Utils_Tuple2('NotLess', '≮'),
			_Utils_Tuple2('NotLessEqual', '≰'),
			_Utils_Tuple2('NotLessGreater', '≸'),
			_Utils_Tuple2('NotLessLess', '≪̸'),
			_Utils_Tuple2('NotLessSlantEqual', '⩽̸'),
			_Utils_Tuple2('NotLessTilde', '≴'),
			_Utils_Tuple2('NotNestedGreaterGreater', '⪢̸'),
			_Utils_Tuple2('NotNestedLessLess', '⪡̸'),
			_Utils_Tuple2('notni', '∌'),
			_Utils_Tuple2('notniva', '∌'),
			_Utils_Tuple2('notnivb', '⋾'),
			_Utils_Tuple2('notnivc', '⋽'),
			_Utils_Tuple2('NotPrecedes', '⊀'),
			_Utils_Tuple2('NotPrecedesEqual', '⪯̸'),
			_Utils_Tuple2('NotPrecedesSlantEqual', '⋠'),
			_Utils_Tuple2('NotReverseElement', '∌'),
			_Utils_Tuple2('NotRightTriangleBar', '⧐̸'),
			_Utils_Tuple2('NotRightTriangle', '⋫'),
			_Utils_Tuple2('NotRightTriangleEqual', '⋭'),
			_Utils_Tuple2('NotSquareSubset', '⊏̸'),
			_Utils_Tuple2('NotSquareSubsetEqual', '⋢'),
			_Utils_Tuple2('NotSquareSuperset', '⊐̸'),
			_Utils_Tuple2('NotSquareSupersetEqual', '⋣'),
			_Utils_Tuple2('NotSubset', '⊂⃒'),
			_Utils_Tuple2('NotSubsetEqual', '⊈'),
			_Utils_Tuple2('NotSucceeds', '⊁'),
			_Utils_Tuple2('NotSucceedsEqual', '⪰̸'),
			_Utils_Tuple2('NotSucceedsSlantEqual', '⋡'),
			_Utils_Tuple2('NotSucceedsTilde', '≿̸'),
			_Utils_Tuple2('NotSuperset', '⊃⃒'),
			_Utils_Tuple2('NotSupersetEqual', '⊉'),
			_Utils_Tuple2('NotTilde', '≁'),
			_Utils_Tuple2('NotTildeEqual', '≄'),
			_Utils_Tuple2('NotTildeFullEqual', '≇'),
			_Utils_Tuple2('NotTildeTilde', '≉'),
			_Utils_Tuple2('NotVerticalBar', '∤'),
			_Utils_Tuple2('nparallel', '∦'),
			_Utils_Tuple2('npar', '∦'),
			_Utils_Tuple2('nparsl', '⫽⃥'),
			_Utils_Tuple2('npart', '∂̸'),
			_Utils_Tuple2('npolint', '⨔'),
			_Utils_Tuple2('npr', '⊀'),
			_Utils_Tuple2('nprcue', '⋠'),
			_Utils_Tuple2('nprec', '⊀'),
			_Utils_Tuple2('npreceq', '⪯̸'),
			_Utils_Tuple2('npre', '⪯̸'),
			_Utils_Tuple2('nrarrc', '⤳̸'),
			_Utils_Tuple2('nrarr', '↛'),
			_Utils_Tuple2('nrArr', '⇏'),
			_Utils_Tuple2('nrarrw', '↝̸'),
			_Utils_Tuple2('nrightarrow', '↛'),
			_Utils_Tuple2('nRightarrow', '⇏'),
			_Utils_Tuple2('nrtri', '⋫'),
			_Utils_Tuple2('nrtrie', '⋭'),
			_Utils_Tuple2('nsc', '⊁'),
			_Utils_Tuple2('nsccue', '⋡'),
			_Utils_Tuple2('nsce', '⪰̸'),
			_Utils_Tuple2('Nscr', '\uD835\uDCA9'),
			_Utils_Tuple2('nscr', '\uD835\uDCC3'),
			_Utils_Tuple2('nshortmid', '∤'),
			_Utils_Tuple2('nshortparallel', '∦'),
			_Utils_Tuple2('nsim', '≁'),
			_Utils_Tuple2('nsime', '≄'),
			_Utils_Tuple2('nsimeq', '≄'),
			_Utils_Tuple2('nsmid', '∤'),
			_Utils_Tuple2('nspar', '∦'),
			_Utils_Tuple2('nsqsube', '⋢'),
			_Utils_Tuple2('nsqsupe', '⋣'),
			_Utils_Tuple2('nsub', '⊄'),
			_Utils_Tuple2('nsubE', '⫅̸'),
			_Utils_Tuple2('nsube', '⊈'),
			_Utils_Tuple2('nsubset', '⊂⃒'),
			_Utils_Tuple2('nsubseteq', '⊈'),
			_Utils_Tuple2('nsubseteqq', '⫅̸'),
			_Utils_Tuple2('nsucc', '⊁'),
			_Utils_Tuple2('nsucceq', '⪰̸'),
			_Utils_Tuple2('nsup', '⊅'),
			_Utils_Tuple2('nsupE', '⫆̸'),
			_Utils_Tuple2('nsupe', '⊉'),
			_Utils_Tuple2('nsupset', '⊃⃒'),
			_Utils_Tuple2('nsupseteq', '⊉'),
			_Utils_Tuple2('nsupseteqq', '⫆̸'),
			_Utils_Tuple2('ntgl', '≹'),
			_Utils_Tuple2('Ntilde', 'Ñ'),
			_Utils_Tuple2('ntilde', 'ñ'),
			_Utils_Tuple2('ntlg', '≸'),
			_Utils_Tuple2('ntriangleleft', '⋪'),
			_Utils_Tuple2('ntrianglelefteq', '⋬'),
			_Utils_Tuple2('ntriangleright', '⋫'),
			_Utils_Tuple2('ntrianglerighteq', '⋭'),
			_Utils_Tuple2('Nu', 'Ν'),
			_Utils_Tuple2('nu', 'ν'),
			_Utils_Tuple2('num', '#'),
			_Utils_Tuple2('numero', '№'),
			_Utils_Tuple2('numsp', '\u2007'),
			_Utils_Tuple2('nvap', '≍⃒'),
			_Utils_Tuple2('nvdash', '⊬'),
			_Utils_Tuple2('nvDash', '⊭'),
			_Utils_Tuple2('nVdash', '⊮'),
			_Utils_Tuple2('nVDash', '⊯'),
			_Utils_Tuple2('nvge', '≥⃒'),
			_Utils_Tuple2('nvgt', '>⃒'),
			_Utils_Tuple2('nvHarr', '⤄'),
			_Utils_Tuple2('nvinfin', '⧞'),
			_Utils_Tuple2('nvlArr', '⤂'),
			_Utils_Tuple2('nvle', '≤⃒'),
			_Utils_Tuple2('nvlt', '<⃒'),
			_Utils_Tuple2('nvltrie', '⊴⃒'),
			_Utils_Tuple2('nvrArr', '⤃'),
			_Utils_Tuple2('nvrtrie', '⊵⃒'),
			_Utils_Tuple2('nvsim', '∼⃒'),
			_Utils_Tuple2('nwarhk', '⤣'),
			_Utils_Tuple2('nwarr', '↖'),
			_Utils_Tuple2('nwArr', '⇖'),
			_Utils_Tuple2('nwarrow', '↖'),
			_Utils_Tuple2('nwnear', '⤧'),
			_Utils_Tuple2('Oacute', 'Ó'),
			_Utils_Tuple2('oacute', 'ó'),
			_Utils_Tuple2('oast', '⊛'),
			_Utils_Tuple2('Ocirc', 'Ô'),
			_Utils_Tuple2('ocirc', 'ô'),
			_Utils_Tuple2('ocir', '⊚'),
			_Utils_Tuple2('Ocy', 'О'),
			_Utils_Tuple2('ocy', 'о'),
			_Utils_Tuple2('odash', '⊝'),
			_Utils_Tuple2('Odblac', 'Ő'),
			_Utils_Tuple2('odblac', 'ő'),
			_Utils_Tuple2('odiv', '⨸'),
			_Utils_Tuple2('odot', '⊙'),
			_Utils_Tuple2('odsold', '⦼'),
			_Utils_Tuple2('OElig', 'Œ'),
			_Utils_Tuple2('oelig', 'œ'),
			_Utils_Tuple2('ofcir', '⦿'),
			_Utils_Tuple2('Ofr', '\uD835\uDD12'),
			_Utils_Tuple2('ofr', '\uD835\uDD2C'),
			_Utils_Tuple2('ogon', '˛'),
			_Utils_Tuple2('Ograve', 'Ò'),
			_Utils_Tuple2('ograve', 'ò'),
			_Utils_Tuple2('ogt', '⧁'),
			_Utils_Tuple2('ohbar', '⦵'),
			_Utils_Tuple2('ohm', 'Ω'),
			_Utils_Tuple2('oint', '∮'),
			_Utils_Tuple2('olarr', '↺'),
			_Utils_Tuple2('olcir', '⦾'),
			_Utils_Tuple2('olcross', '⦻'),
			_Utils_Tuple2('oline', '‾'),
			_Utils_Tuple2('olt', '⧀'),
			_Utils_Tuple2('Omacr', 'Ō'),
			_Utils_Tuple2('omacr', 'ō'),
			_Utils_Tuple2('Omega', 'Ω'),
			_Utils_Tuple2('omega', 'ω'),
			_Utils_Tuple2('Omicron', 'Ο'),
			_Utils_Tuple2('omicron', 'ο'),
			_Utils_Tuple2('omid', '⦶'),
			_Utils_Tuple2('ominus', '⊖'),
			_Utils_Tuple2('Oopf', '\uD835\uDD46'),
			_Utils_Tuple2('oopf', '\uD835\uDD60'),
			_Utils_Tuple2('opar', '⦷'),
			_Utils_Tuple2('OpenCurlyDoubleQuote', '“'),
			_Utils_Tuple2('OpenCurlyQuote', '‘'),
			_Utils_Tuple2('operp', '⦹'),
			_Utils_Tuple2('oplus', '⊕'),
			_Utils_Tuple2('orarr', '↻'),
			_Utils_Tuple2('Or', '⩔'),
			_Utils_Tuple2('or', '∨'),
			_Utils_Tuple2('ord', '⩝'),
			_Utils_Tuple2('order', 'ℴ'),
			_Utils_Tuple2('orderof', 'ℴ'),
			_Utils_Tuple2('ordf', 'ª'),
			_Utils_Tuple2('ordm', 'º'),
			_Utils_Tuple2('origof', '⊶'),
			_Utils_Tuple2('oror', '⩖'),
			_Utils_Tuple2('orslope', '⩗'),
			_Utils_Tuple2('orv', '⩛'),
			_Utils_Tuple2('oS', 'Ⓢ'),
			_Utils_Tuple2('Oscr', '\uD835\uDCAA'),
			_Utils_Tuple2('oscr', 'ℴ'),
			_Utils_Tuple2('Oslash', 'Ø'),
			_Utils_Tuple2('oslash', 'ø'),
			_Utils_Tuple2('osol', '⊘'),
			_Utils_Tuple2('Otilde', 'Õ'),
			_Utils_Tuple2('otilde', 'õ'),
			_Utils_Tuple2('otimesas', '⨶'),
			_Utils_Tuple2('Otimes', '⨷'),
			_Utils_Tuple2('otimes', '⊗'),
			_Utils_Tuple2('Ouml', 'Ö'),
			_Utils_Tuple2('ouml', 'ö'),
			_Utils_Tuple2('ovbar', '⌽'),
			_Utils_Tuple2('OverBar', '‾'),
			_Utils_Tuple2('OverBrace', '⏞'),
			_Utils_Tuple2('OverBracket', '⎴'),
			_Utils_Tuple2('OverParenthesis', '⏜'),
			_Utils_Tuple2('para', '¶'),
			_Utils_Tuple2('parallel', '∥'),
			_Utils_Tuple2('par', '∥'),
			_Utils_Tuple2('parsim', '⫳'),
			_Utils_Tuple2('parsl', '⫽'),
			_Utils_Tuple2('part', '∂'),
			_Utils_Tuple2('PartialD', '∂'),
			_Utils_Tuple2('Pcy', 'П'),
			_Utils_Tuple2('pcy', 'п'),
			_Utils_Tuple2('percnt', '%'),
			_Utils_Tuple2('period', '.'),
			_Utils_Tuple2('permil', '‰'),
			_Utils_Tuple2('perp', '⊥'),
			_Utils_Tuple2('pertenk', '‱'),
			_Utils_Tuple2('Pfr', '\uD835\uDD13'),
			_Utils_Tuple2('pfr', '\uD835\uDD2D'),
			_Utils_Tuple2('Phi', 'Φ'),
			_Utils_Tuple2('phi', 'φ'),
			_Utils_Tuple2('phiv', 'ϕ'),
			_Utils_Tuple2('phmmat', 'ℳ'),
			_Utils_Tuple2('phone', '☎'),
			_Utils_Tuple2('Pi', 'Π'),
			_Utils_Tuple2('pi', 'π'),
			_Utils_Tuple2('pitchfork', '⋔'),
			_Utils_Tuple2('piv', 'ϖ'),
			_Utils_Tuple2('planck', 'ℏ'),
			_Utils_Tuple2('planckh', 'ℎ'),
			_Utils_Tuple2('plankv', 'ℏ'),
			_Utils_Tuple2('plusacir', '⨣'),
			_Utils_Tuple2('plusb', '⊞'),
			_Utils_Tuple2('pluscir', '⨢'),
			_Utils_Tuple2('plus', '+'),
			_Utils_Tuple2('plusdo', '∔'),
			_Utils_Tuple2('plusdu', '⨥'),
			_Utils_Tuple2('pluse', '⩲'),
			_Utils_Tuple2('PlusMinus', '±'),
			_Utils_Tuple2('plusmn', '±'),
			_Utils_Tuple2('plussim', '⨦'),
			_Utils_Tuple2('plustwo', '⨧'),
			_Utils_Tuple2('pm', '±'),
			_Utils_Tuple2('Poincareplane', 'ℌ'),
			_Utils_Tuple2('pointint', '⨕'),
			_Utils_Tuple2('popf', '\uD835\uDD61'),
			_Utils_Tuple2('Popf', 'ℙ'),
			_Utils_Tuple2('pound', '£'),
			_Utils_Tuple2('prap', '⪷'),
			_Utils_Tuple2('Pr', '⪻'),
			_Utils_Tuple2('pr', '≺'),
			_Utils_Tuple2('prcue', '≼'),
			_Utils_Tuple2('precapprox', '⪷'),
			_Utils_Tuple2('prec', '≺'),
			_Utils_Tuple2('preccurlyeq', '≼'),
			_Utils_Tuple2('Precedes', '≺'),
			_Utils_Tuple2('PrecedesEqual', '⪯'),
			_Utils_Tuple2('PrecedesSlantEqual', '≼'),
			_Utils_Tuple2('PrecedesTilde', '≾'),
			_Utils_Tuple2('preceq', '⪯'),
			_Utils_Tuple2('precnapprox', '⪹'),
			_Utils_Tuple2('precneqq', '⪵'),
			_Utils_Tuple2('precnsim', '⋨'),
			_Utils_Tuple2('pre', '⪯'),
			_Utils_Tuple2('prE', '⪳'),
			_Utils_Tuple2('precsim', '≾'),
			_Utils_Tuple2('prime', '′'),
			_Utils_Tuple2('Prime', '″'),
			_Utils_Tuple2('primes', 'ℙ'),
			_Utils_Tuple2('prnap', '⪹'),
			_Utils_Tuple2('prnE', '⪵'),
			_Utils_Tuple2('prnsim', '⋨'),
			_Utils_Tuple2('prod', '∏'),
			_Utils_Tuple2('Product', '∏'),
			_Utils_Tuple2('profalar', '⌮'),
			_Utils_Tuple2('profline', '⌒'),
			_Utils_Tuple2('profsurf', '⌓'),
			_Utils_Tuple2('prop', '∝'),
			_Utils_Tuple2('Proportional', '∝'),
			_Utils_Tuple2('Proportion', '∷'),
			_Utils_Tuple2('propto', '∝'),
			_Utils_Tuple2('prsim', '≾'),
			_Utils_Tuple2('prurel', '⊰'),
			_Utils_Tuple2('Pscr', '\uD835\uDCAB'),
			_Utils_Tuple2('pscr', '\uD835\uDCC5'),
			_Utils_Tuple2('Psi', 'Ψ'),
			_Utils_Tuple2('psi', 'ψ'),
			_Utils_Tuple2('puncsp', '\u2008'),
			_Utils_Tuple2('Qfr', '\uD835\uDD14'),
			_Utils_Tuple2('qfr', '\uD835\uDD2E'),
			_Utils_Tuple2('qint', '⨌'),
			_Utils_Tuple2('qopf', '\uD835\uDD62'),
			_Utils_Tuple2('Qopf', 'ℚ'),
			_Utils_Tuple2('qprime', '⁗'),
			_Utils_Tuple2('Qscr', '\uD835\uDCAC'),
			_Utils_Tuple2('qscr', '\uD835\uDCC6'),
			_Utils_Tuple2('quaternions', 'ℍ'),
			_Utils_Tuple2('quatint', '⨖'),
			_Utils_Tuple2('quest', '?'),
			_Utils_Tuple2('questeq', '≟'),
			_Utils_Tuple2('quot', '\"'),
			_Utils_Tuple2('QUOT', '\"'),
			_Utils_Tuple2('rAarr', '⇛'),
			_Utils_Tuple2('race', '∽̱'),
			_Utils_Tuple2('Racute', 'Ŕ'),
			_Utils_Tuple2('racute', 'ŕ'),
			_Utils_Tuple2('radic', '√'),
			_Utils_Tuple2('raemptyv', '⦳'),
			_Utils_Tuple2('rang', '⟩'),
			_Utils_Tuple2('Rang', '⟫'),
			_Utils_Tuple2('rangd', '⦒'),
			_Utils_Tuple2('range', '⦥'),
			_Utils_Tuple2('rangle', '⟩'),
			_Utils_Tuple2('raquo', '»'),
			_Utils_Tuple2('rarrap', '⥵'),
			_Utils_Tuple2('rarrb', '⇥'),
			_Utils_Tuple2('rarrbfs', '⤠'),
			_Utils_Tuple2('rarrc', '⤳'),
			_Utils_Tuple2('rarr', '→'),
			_Utils_Tuple2('Rarr', '↠'),
			_Utils_Tuple2('rArr', '⇒'),
			_Utils_Tuple2('rarrfs', '⤞'),
			_Utils_Tuple2('rarrhk', '↪'),
			_Utils_Tuple2('rarrlp', '↬'),
			_Utils_Tuple2('rarrpl', '⥅'),
			_Utils_Tuple2('rarrsim', '⥴'),
			_Utils_Tuple2('Rarrtl', '⤖'),
			_Utils_Tuple2('rarrtl', '↣'),
			_Utils_Tuple2('rarrw', '↝'),
			_Utils_Tuple2('ratail', '⤚'),
			_Utils_Tuple2('rAtail', '⤜'),
			_Utils_Tuple2('ratio', '∶'),
			_Utils_Tuple2('rationals', 'ℚ'),
			_Utils_Tuple2('rbarr', '⤍'),
			_Utils_Tuple2('rBarr', '⤏'),
			_Utils_Tuple2('RBarr', '⤐'),
			_Utils_Tuple2('rbbrk', '❳'),
			_Utils_Tuple2('rbrace', '}'),
			_Utils_Tuple2('rbrack', ']'),
			_Utils_Tuple2('rbrke', '⦌'),
			_Utils_Tuple2('rbrksld', '⦎'),
			_Utils_Tuple2('rbrkslu', '⦐'),
			_Utils_Tuple2('Rcaron', 'Ř'),
			_Utils_Tuple2('rcaron', 'ř'),
			_Utils_Tuple2('Rcedil', 'Ŗ'),
			_Utils_Tuple2('rcedil', 'ŗ'),
			_Utils_Tuple2('rceil', '⌉'),
			_Utils_Tuple2('rcub', '}'),
			_Utils_Tuple2('Rcy', 'Р'),
			_Utils_Tuple2('rcy', 'р'),
			_Utils_Tuple2('rdca', '⤷'),
			_Utils_Tuple2('rdldhar', '⥩'),
			_Utils_Tuple2('rdquo', '”'),
			_Utils_Tuple2('rdquor', '”'),
			_Utils_Tuple2('rdsh', '↳'),
			_Utils_Tuple2('real', 'ℜ'),
			_Utils_Tuple2('realine', 'ℛ'),
			_Utils_Tuple2('realpart', 'ℜ'),
			_Utils_Tuple2('reals', 'ℝ'),
			_Utils_Tuple2('Re', 'ℜ'),
			_Utils_Tuple2('rect', '▭'),
			_Utils_Tuple2('reg', '®'),
			_Utils_Tuple2('REG', '®'),
			_Utils_Tuple2('ReverseElement', '∋'),
			_Utils_Tuple2('ReverseEquilibrium', '⇋'),
			_Utils_Tuple2('ReverseUpEquilibrium', '⥯'),
			_Utils_Tuple2('rfisht', '⥽'),
			_Utils_Tuple2('rfloor', '⌋'),
			_Utils_Tuple2('rfr', '\uD835\uDD2F'),
			_Utils_Tuple2('Rfr', 'ℜ'),
			_Utils_Tuple2('rHar', '⥤'),
			_Utils_Tuple2('rhard', '⇁'),
			_Utils_Tuple2('rharu', '⇀'),
			_Utils_Tuple2('rharul', '⥬'),
			_Utils_Tuple2('Rho', 'Ρ'),
			_Utils_Tuple2('rho', 'ρ'),
			_Utils_Tuple2('rhov', 'ϱ'),
			_Utils_Tuple2('RightAngleBracket', '⟩'),
			_Utils_Tuple2('RightArrowBar', '⇥'),
			_Utils_Tuple2('rightarrow', '→'),
			_Utils_Tuple2('RightArrow', '→'),
			_Utils_Tuple2('Rightarrow', '⇒'),
			_Utils_Tuple2('RightArrowLeftArrow', '⇄'),
			_Utils_Tuple2('rightarrowtail', '↣'),
			_Utils_Tuple2('RightCeiling', '⌉'),
			_Utils_Tuple2('RightDoubleBracket', '⟧'),
			_Utils_Tuple2('RightDownTeeVector', '⥝'),
			_Utils_Tuple2('RightDownVectorBar', '⥕'),
			_Utils_Tuple2('RightDownVector', '⇂'),
			_Utils_Tuple2('RightFloor', '⌋'),
			_Utils_Tuple2('rightharpoondown', '⇁'),
			_Utils_Tuple2('rightharpoonup', '⇀'),
			_Utils_Tuple2('rightleftarrows', '⇄'),
			_Utils_Tuple2('rightleftharpoons', '⇌'),
			_Utils_Tuple2('rightrightarrows', '⇉'),
			_Utils_Tuple2('rightsquigarrow', '↝'),
			_Utils_Tuple2('RightTeeArrow', '↦'),
			_Utils_Tuple2('RightTee', '⊢'),
			_Utils_Tuple2('RightTeeVector', '⥛'),
			_Utils_Tuple2('rightthreetimes', '⋌'),
			_Utils_Tuple2('RightTriangleBar', '⧐'),
			_Utils_Tuple2('RightTriangle', '⊳'),
			_Utils_Tuple2('RightTriangleEqual', '⊵'),
			_Utils_Tuple2('RightUpDownVector', '⥏'),
			_Utils_Tuple2('RightUpTeeVector', '⥜'),
			_Utils_Tuple2('RightUpVectorBar', '⥔'),
			_Utils_Tuple2('RightUpVector', '↾'),
			_Utils_Tuple2('RightVectorBar', '⥓'),
			_Utils_Tuple2('RightVector', '⇀'),
			_Utils_Tuple2('ring', '˚'),
			_Utils_Tuple2('risingdotseq', '≓'),
			_Utils_Tuple2('rlarr', '⇄'),
			_Utils_Tuple2('rlhar', '⇌'),
			_Utils_Tuple2('rlm', '\u200F'),
			_Utils_Tuple2('rmoustache', '⎱'),
			_Utils_Tuple2('rmoust', '⎱'),
			_Utils_Tuple2('rnmid', '⫮'),
			_Utils_Tuple2('roang', '⟭'),
			_Utils_Tuple2('roarr', '⇾'),
			_Utils_Tuple2('robrk', '⟧'),
			_Utils_Tuple2('ropar', '⦆'),
			_Utils_Tuple2('ropf', '\uD835\uDD63'),
			_Utils_Tuple2('Ropf', 'ℝ'),
			_Utils_Tuple2('roplus', '⨮'),
			_Utils_Tuple2('rotimes', '⨵'),
			_Utils_Tuple2('RoundImplies', '⥰'),
			_Utils_Tuple2('rpar', ')'),
			_Utils_Tuple2('rpargt', '⦔'),
			_Utils_Tuple2('rppolint', '⨒'),
			_Utils_Tuple2('rrarr', '⇉'),
			_Utils_Tuple2('Rrightarrow', '⇛'),
			_Utils_Tuple2('rsaquo', '›'),
			_Utils_Tuple2('rscr', '\uD835\uDCC7'),
			_Utils_Tuple2('Rscr', 'ℛ'),
			_Utils_Tuple2('rsh', '↱'),
			_Utils_Tuple2('Rsh', '↱'),
			_Utils_Tuple2('rsqb', ']'),
			_Utils_Tuple2('rsquo', '’'),
			_Utils_Tuple2('rsquor', '’'),
			_Utils_Tuple2('rthree', '⋌'),
			_Utils_Tuple2('rtimes', '⋊'),
			_Utils_Tuple2('rtri', '▹'),
			_Utils_Tuple2('rtrie', '⊵'),
			_Utils_Tuple2('rtrif', '▸'),
			_Utils_Tuple2('rtriltri', '⧎'),
			_Utils_Tuple2('RuleDelayed', '⧴'),
			_Utils_Tuple2('ruluhar', '⥨'),
			_Utils_Tuple2('rx', '℞'),
			_Utils_Tuple2('Sacute', 'Ś'),
			_Utils_Tuple2('sacute', 'ś'),
			_Utils_Tuple2('sbquo', '‚'),
			_Utils_Tuple2('scap', '⪸'),
			_Utils_Tuple2('Scaron', 'Š'),
			_Utils_Tuple2('scaron', 'š'),
			_Utils_Tuple2('Sc', '⪼'),
			_Utils_Tuple2('sc', '≻'),
			_Utils_Tuple2('sccue', '≽'),
			_Utils_Tuple2('sce', '⪰'),
			_Utils_Tuple2('scE', '⪴'),
			_Utils_Tuple2('Scedil', 'Ş'),
			_Utils_Tuple2('scedil', 'ş'),
			_Utils_Tuple2('Scirc', 'Ŝ'),
			_Utils_Tuple2('scirc', 'ŝ'),
			_Utils_Tuple2('scnap', '⪺'),
			_Utils_Tuple2('scnE', '⪶'),
			_Utils_Tuple2('scnsim', '⋩'),
			_Utils_Tuple2('scpolint', '⨓'),
			_Utils_Tuple2('scsim', '≿'),
			_Utils_Tuple2('Scy', 'С'),
			_Utils_Tuple2('scy', 'с'),
			_Utils_Tuple2('sdotb', '⊡'),
			_Utils_Tuple2('sdot', '⋅'),
			_Utils_Tuple2('sdote', '⩦'),
			_Utils_Tuple2('searhk', '⤥'),
			_Utils_Tuple2('searr', '↘'),
			_Utils_Tuple2('seArr', '⇘'),
			_Utils_Tuple2('searrow', '↘'),
			_Utils_Tuple2('sect', '§'),
			_Utils_Tuple2('semi', ';'),
			_Utils_Tuple2('seswar', '⤩'),
			_Utils_Tuple2('setminus', '∖'),
			_Utils_Tuple2('setmn', '∖'),
			_Utils_Tuple2('sext', '✶'),
			_Utils_Tuple2('Sfr', '\uD835\uDD16'),
			_Utils_Tuple2('sfr', '\uD835\uDD30'),
			_Utils_Tuple2('sfrown', '⌢'),
			_Utils_Tuple2('sharp', '♯'),
			_Utils_Tuple2('SHCHcy', 'Щ'),
			_Utils_Tuple2('shchcy', 'щ'),
			_Utils_Tuple2('SHcy', 'Ш'),
			_Utils_Tuple2('shcy', 'ш'),
			_Utils_Tuple2('ShortDownArrow', '↓'),
			_Utils_Tuple2('ShortLeftArrow', '←'),
			_Utils_Tuple2('shortmid', '∣'),
			_Utils_Tuple2('shortparallel', '∥'),
			_Utils_Tuple2('ShortRightArrow', '→'),
			_Utils_Tuple2('ShortUpArrow', '↑'),
			_Utils_Tuple2('shy', '\u00AD'),
			_Utils_Tuple2('Sigma', 'Σ'),
			_Utils_Tuple2('sigma', 'σ'),
			_Utils_Tuple2('sigmaf', 'ς'),
			_Utils_Tuple2('sigmav', 'ς'),
			_Utils_Tuple2('sim', '∼'),
			_Utils_Tuple2('simdot', '⩪'),
			_Utils_Tuple2('sime', '≃'),
			_Utils_Tuple2('simeq', '≃'),
			_Utils_Tuple2('simg', '⪞'),
			_Utils_Tuple2('simgE', '⪠'),
			_Utils_Tuple2('siml', '⪝'),
			_Utils_Tuple2('simlE', '⪟'),
			_Utils_Tuple2('simne', '≆'),
			_Utils_Tuple2('simplus', '⨤'),
			_Utils_Tuple2('simrarr', '⥲'),
			_Utils_Tuple2('slarr', '←'),
			_Utils_Tuple2('SmallCircle', '∘'),
			_Utils_Tuple2('smallsetminus', '∖'),
			_Utils_Tuple2('smashp', '⨳'),
			_Utils_Tuple2('smeparsl', '⧤'),
			_Utils_Tuple2('smid', '∣'),
			_Utils_Tuple2('smile', '⌣'),
			_Utils_Tuple2('smt', '⪪'),
			_Utils_Tuple2('smte', '⪬'),
			_Utils_Tuple2('smtes', '⪬︀'),
			_Utils_Tuple2('SOFTcy', 'Ь'),
			_Utils_Tuple2('softcy', 'ь'),
			_Utils_Tuple2('solbar', '⌿'),
			_Utils_Tuple2('solb', '⧄'),
			_Utils_Tuple2('sol', '/'),
			_Utils_Tuple2('Sopf', '\uD835\uDD4A'),
			_Utils_Tuple2('sopf', '\uD835\uDD64'),
			_Utils_Tuple2('spades', '♠'),
			_Utils_Tuple2('spadesuit', '♠'),
			_Utils_Tuple2('spar', '∥'),
			_Utils_Tuple2('sqcap', '⊓'),
			_Utils_Tuple2('sqcaps', '⊓︀'),
			_Utils_Tuple2('sqcup', '⊔'),
			_Utils_Tuple2('sqcups', '⊔︀'),
			_Utils_Tuple2('Sqrt', '√'),
			_Utils_Tuple2('sqsub', '⊏'),
			_Utils_Tuple2('sqsube', '⊑'),
			_Utils_Tuple2('sqsubset', '⊏'),
			_Utils_Tuple2('sqsubseteq', '⊑'),
			_Utils_Tuple2('sqsup', '⊐'),
			_Utils_Tuple2('sqsupe', '⊒'),
			_Utils_Tuple2('sqsupset', '⊐'),
			_Utils_Tuple2('sqsupseteq', '⊒'),
			_Utils_Tuple2('square', '□'),
			_Utils_Tuple2('Square', '□'),
			_Utils_Tuple2('SquareIntersection', '⊓'),
			_Utils_Tuple2('SquareSubset', '⊏'),
			_Utils_Tuple2('SquareSubsetEqual', '⊑'),
			_Utils_Tuple2('SquareSuperset', '⊐'),
			_Utils_Tuple2('SquareSupersetEqual', '⊒'),
			_Utils_Tuple2('SquareUnion', '⊔'),
			_Utils_Tuple2('squarf', '▪'),
			_Utils_Tuple2('squ', '□'),
			_Utils_Tuple2('squf', '▪'),
			_Utils_Tuple2('srarr', '→'),
			_Utils_Tuple2('Sscr', '\uD835\uDCAE'),
			_Utils_Tuple2('sscr', '\uD835\uDCC8'),
			_Utils_Tuple2('ssetmn', '∖'),
			_Utils_Tuple2('ssmile', '⌣'),
			_Utils_Tuple2('sstarf', '⋆'),
			_Utils_Tuple2('Star', '⋆'),
			_Utils_Tuple2('star', '☆'),
			_Utils_Tuple2('starf', '★'),
			_Utils_Tuple2('straightepsilon', 'ϵ'),
			_Utils_Tuple2('straightphi', 'ϕ'),
			_Utils_Tuple2('strns', '¯'),
			_Utils_Tuple2('sub', '⊂'),
			_Utils_Tuple2('Sub', '⋐'),
			_Utils_Tuple2('subdot', '⪽'),
			_Utils_Tuple2('subE', '⫅'),
			_Utils_Tuple2('sube', '⊆'),
			_Utils_Tuple2('subedot', '⫃'),
			_Utils_Tuple2('submult', '⫁'),
			_Utils_Tuple2('subnE', '⫋'),
			_Utils_Tuple2('subne', '⊊'),
			_Utils_Tuple2('subplus', '⪿'),
			_Utils_Tuple2('subrarr', '⥹'),
			_Utils_Tuple2('subset', '⊂'),
			_Utils_Tuple2('Subset', '⋐'),
			_Utils_Tuple2('subseteq', '⊆'),
			_Utils_Tuple2('subseteqq', '⫅'),
			_Utils_Tuple2('SubsetEqual', '⊆'),
			_Utils_Tuple2('subsetneq', '⊊'),
			_Utils_Tuple2('subsetneqq', '⫋'),
			_Utils_Tuple2('subsim', '⫇'),
			_Utils_Tuple2('subsub', '⫕'),
			_Utils_Tuple2('subsup', '⫓'),
			_Utils_Tuple2('succapprox', '⪸'),
			_Utils_Tuple2('succ', '≻'),
			_Utils_Tuple2('succcurlyeq', '≽'),
			_Utils_Tuple2('Succeeds', '≻'),
			_Utils_Tuple2('SucceedsEqual', '⪰'),
			_Utils_Tuple2('SucceedsSlantEqual', '≽'),
			_Utils_Tuple2('SucceedsTilde', '≿'),
			_Utils_Tuple2('succeq', '⪰'),
			_Utils_Tuple2('succnapprox', '⪺'),
			_Utils_Tuple2('succneqq', '⪶'),
			_Utils_Tuple2('succnsim', '⋩'),
			_Utils_Tuple2('succsim', '≿'),
			_Utils_Tuple2('SuchThat', '∋'),
			_Utils_Tuple2('sum', '∑'),
			_Utils_Tuple2('Sum', '∑'),
			_Utils_Tuple2('sung', '♪'),
			_Utils_Tuple2('sup1', '¹'),
			_Utils_Tuple2('sup2', '²'),
			_Utils_Tuple2('sup3', '³'),
			_Utils_Tuple2('sup', '⊃'),
			_Utils_Tuple2('Sup', '⋑'),
			_Utils_Tuple2('supdot', '⪾'),
			_Utils_Tuple2('supdsub', '⫘'),
			_Utils_Tuple2('supE', '⫆'),
			_Utils_Tuple2('supe', '⊇'),
			_Utils_Tuple2('supedot', '⫄'),
			_Utils_Tuple2('Superset', '⊃'),
			_Utils_Tuple2('SupersetEqual', '⊇'),
			_Utils_Tuple2('suphsol', '⟉'),
			_Utils_Tuple2('suphsub', '⫗'),
			_Utils_Tuple2('suplarr', '⥻'),
			_Utils_Tuple2('supmult', '⫂'),
			_Utils_Tuple2('supnE', '⫌'),
			_Utils_Tuple2('supne', '⊋'),
			_Utils_Tuple2('supplus', '⫀'),
			_Utils_Tuple2('supset', '⊃'),
			_Utils_Tuple2('Supset', '⋑'),
			_Utils_Tuple2('supseteq', '⊇'),
			_Utils_Tuple2('supseteqq', '⫆'),
			_Utils_Tuple2('supsetneq', '⊋'),
			_Utils_Tuple2('supsetneqq', '⫌'),
			_Utils_Tuple2('supsim', '⫈'),
			_Utils_Tuple2('supsub', '⫔'),
			_Utils_Tuple2('supsup', '⫖'),
			_Utils_Tuple2('swarhk', '⤦'),
			_Utils_Tuple2('swarr', '↙'),
			_Utils_Tuple2('swArr', '⇙'),
			_Utils_Tuple2('swarrow', '↙'),
			_Utils_Tuple2('swnwar', '⤪'),
			_Utils_Tuple2('szlig', 'ß'),
			_Utils_Tuple2('Tab', '\t'),
			_Utils_Tuple2('target', '⌖'),
			_Utils_Tuple2('Tau', 'Τ'),
			_Utils_Tuple2('tau', 'τ'),
			_Utils_Tuple2('tbrk', '⎴'),
			_Utils_Tuple2('Tcaron', 'Ť'),
			_Utils_Tuple2('tcaron', 'ť'),
			_Utils_Tuple2('Tcedil', 'Ţ'),
			_Utils_Tuple2('tcedil', 'ţ'),
			_Utils_Tuple2('Tcy', 'Т'),
			_Utils_Tuple2('tcy', 'т'),
			_Utils_Tuple2('tdot', '⃛'),
			_Utils_Tuple2('telrec', '⌕'),
			_Utils_Tuple2('Tfr', '\uD835\uDD17'),
			_Utils_Tuple2('tfr', '\uD835\uDD31'),
			_Utils_Tuple2('there4', '∴'),
			_Utils_Tuple2('therefore', '∴'),
			_Utils_Tuple2('Therefore', '∴'),
			_Utils_Tuple2('Theta', 'Θ'),
			_Utils_Tuple2('theta', 'θ'),
			_Utils_Tuple2('thetasym', 'ϑ'),
			_Utils_Tuple2('thetav', 'ϑ'),
			_Utils_Tuple2('thickapprox', '≈'),
			_Utils_Tuple2('thicksim', '∼'),
			_Utils_Tuple2('ThickSpace', '\u205F\u200A'),
			_Utils_Tuple2('ThinSpace', '\u2009'),
			_Utils_Tuple2('thinsp', '\u2009'),
			_Utils_Tuple2('thkap', '≈'),
			_Utils_Tuple2('thksim', '∼'),
			_Utils_Tuple2('THORN', 'Þ'),
			_Utils_Tuple2('thorn', 'þ'),
			_Utils_Tuple2('tilde', '˜'),
			_Utils_Tuple2('Tilde', '∼'),
			_Utils_Tuple2('TildeEqual', '≃'),
			_Utils_Tuple2('TildeFullEqual', '≅'),
			_Utils_Tuple2('TildeTilde', '≈'),
			_Utils_Tuple2('timesbar', '⨱'),
			_Utils_Tuple2('timesb', '⊠'),
			_Utils_Tuple2('times', '×'),
			_Utils_Tuple2('timesd', '⨰'),
			_Utils_Tuple2('tint', '∭'),
			_Utils_Tuple2('toea', '⤨'),
			_Utils_Tuple2('topbot', '⌶'),
			_Utils_Tuple2('topcir', '⫱'),
			_Utils_Tuple2('top', '⊤'),
			_Utils_Tuple2('Topf', '\uD835\uDD4B'),
			_Utils_Tuple2('topf', '\uD835\uDD65'),
			_Utils_Tuple2('topfork', '⫚'),
			_Utils_Tuple2('tosa', '⤩'),
			_Utils_Tuple2('tprime', '‴'),
			_Utils_Tuple2('trade', '™'),
			_Utils_Tuple2('TRADE', '™'),
			_Utils_Tuple2('triangle', '▵'),
			_Utils_Tuple2('triangledown', '▿'),
			_Utils_Tuple2('triangleleft', '◃'),
			_Utils_Tuple2('trianglelefteq', '⊴'),
			_Utils_Tuple2('triangleq', '≜'),
			_Utils_Tuple2('triangleright', '▹'),
			_Utils_Tuple2('trianglerighteq', '⊵'),
			_Utils_Tuple2('tridot', '◬'),
			_Utils_Tuple2('trie', '≜'),
			_Utils_Tuple2('triminus', '⨺'),
			_Utils_Tuple2('TripleDot', '⃛'),
			_Utils_Tuple2('triplus', '⨹'),
			_Utils_Tuple2('trisb', '⧍'),
			_Utils_Tuple2('tritime', '⨻'),
			_Utils_Tuple2('trpezium', '⏢'),
			_Utils_Tuple2('Tscr', '\uD835\uDCAF'),
			_Utils_Tuple2('tscr', '\uD835\uDCC9'),
			_Utils_Tuple2('TScy', 'Ц'),
			_Utils_Tuple2('tscy', 'ц'),
			_Utils_Tuple2('TSHcy', 'Ћ'),
			_Utils_Tuple2('tshcy', 'ћ'),
			_Utils_Tuple2('Tstrok', 'Ŧ'),
			_Utils_Tuple2('tstrok', 'ŧ'),
			_Utils_Tuple2('twixt', '≬'),
			_Utils_Tuple2('twoheadleftarrow', '↞'),
			_Utils_Tuple2('twoheadrightarrow', '↠'),
			_Utils_Tuple2('Uacute', 'Ú'),
			_Utils_Tuple2('uacute', 'ú'),
			_Utils_Tuple2('uarr', '↑'),
			_Utils_Tuple2('Uarr', '↟'),
			_Utils_Tuple2('uArr', '⇑'),
			_Utils_Tuple2('Uarrocir', '⥉'),
			_Utils_Tuple2('Ubrcy', 'Ў'),
			_Utils_Tuple2('ubrcy', 'ў'),
			_Utils_Tuple2('Ubreve', 'Ŭ'),
			_Utils_Tuple2('ubreve', 'ŭ'),
			_Utils_Tuple2('Ucirc', 'Û'),
			_Utils_Tuple2('ucirc', 'û'),
			_Utils_Tuple2('Ucy', 'У'),
			_Utils_Tuple2('ucy', 'у'),
			_Utils_Tuple2('udarr', '⇅'),
			_Utils_Tuple2('Udblac', 'Ű'),
			_Utils_Tuple2('udblac', 'ű'),
			_Utils_Tuple2('udhar', '⥮'),
			_Utils_Tuple2('ufisht', '⥾'),
			_Utils_Tuple2('Ufr', '\uD835\uDD18'),
			_Utils_Tuple2('ufr', '\uD835\uDD32'),
			_Utils_Tuple2('Ugrave', 'Ù'),
			_Utils_Tuple2('ugrave', 'ù'),
			_Utils_Tuple2('uHar', '⥣'),
			_Utils_Tuple2('uharl', '↿'),
			_Utils_Tuple2('uharr', '↾'),
			_Utils_Tuple2('uhblk', '▀'),
			_Utils_Tuple2('ulcorn', '⌜'),
			_Utils_Tuple2('ulcorner', '⌜'),
			_Utils_Tuple2('ulcrop', '⌏'),
			_Utils_Tuple2('ultri', '◸'),
			_Utils_Tuple2('Umacr', 'Ū'),
			_Utils_Tuple2('umacr', 'ū'),
			_Utils_Tuple2('uml', '¨'),
			_Utils_Tuple2('UnderBar', '_'),
			_Utils_Tuple2('UnderBrace', '⏟'),
			_Utils_Tuple2('UnderBracket', '⎵'),
			_Utils_Tuple2('UnderParenthesis', '⏝'),
			_Utils_Tuple2('Union', '⋃'),
			_Utils_Tuple2('UnionPlus', '⊎'),
			_Utils_Tuple2('Uogon', 'Ų'),
			_Utils_Tuple2('uogon', 'ų'),
			_Utils_Tuple2('Uopf', '\uD835\uDD4C'),
			_Utils_Tuple2('uopf', '\uD835\uDD66'),
			_Utils_Tuple2('UpArrowBar', '⤒'),
			_Utils_Tuple2('uparrow', '↑'),
			_Utils_Tuple2('UpArrow', '↑'),
			_Utils_Tuple2('Uparrow', '⇑'),
			_Utils_Tuple2('UpArrowDownArrow', '⇅'),
			_Utils_Tuple2('updownarrow', '↕'),
			_Utils_Tuple2('UpDownArrow', '↕'),
			_Utils_Tuple2('Updownarrow', '⇕'),
			_Utils_Tuple2('UpEquilibrium', '⥮'),
			_Utils_Tuple2('upharpoonleft', '↿'),
			_Utils_Tuple2('upharpoonright', '↾'),
			_Utils_Tuple2('uplus', '⊎'),
			_Utils_Tuple2('UpperLeftArrow', '↖'),
			_Utils_Tuple2('UpperRightArrow', '↗'),
			_Utils_Tuple2('upsi', 'υ'),
			_Utils_Tuple2('Upsi', 'ϒ'),
			_Utils_Tuple2('upsih', 'ϒ'),
			_Utils_Tuple2('Upsilon', 'Υ'),
			_Utils_Tuple2('upsilon', 'υ'),
			_Utils_Tuple2('UpTeeArrow', '↥'),
			_Utils_Tuple2('UpTee', '⊥'),
			_Utils_Tuple2('upuparrows', '⇈'),
			_Utils_Tuple2('urcorn', '⌝'),
			_Utils_Tuple2('urcorner', '⌝'),
			_Utils_Tuple2('urcrop', '⌎'),
			_Utils_Tuple2('Uring', 'Ů'),
			_Utils_Tuple2('uring', 'ů'),
			_Utils_Tuple2('urtri', '◹'),
			_Utils_Tuple2('Uscr', '\uD835\uDCB0'),
			_Utils_Tuple2('uscr', '\uD835\uDCCA'),
			_Utils_Tuple2('utdot', '⋰'),
			_Utils_Tuple2('Utilde', 'Ũ'),
			_Utils_Tuple2('utilde', 'ũ'),
			_Utils_Tuple2('utri', '▵'),
			_Utils_Tuple2('utrif', '▴'),
			_Utils_Tuple2('uuarr', '⇈'),
			_Utils_Tuple2('Uuml', 'Ü'),
			_Utils_Tuple2('uuml', 'ü'),
			_Utils_Tuple2('uwangle', '⦧'),
			_Utils_Tuple2('vangrt', '⦜'),
			_Utils_Tuple2('varepsilon', 'ϵ'),
			_Utils_Tuple2('varkappa', 'ϰ'),
			_Utils_Tuple2('varnothing', '∅'),
			_Utils_Tuple2('varphi', 'ϕ'),
			_Utils_Tuple2('varpi', 'ϖ'),
			_Utils_Tuple2('varpropto', '∝'),
			_Utils_Tuple2('varr', '↕'),
			_Utils_Tuple2('vArr', '⇕'),
			_Utils_Tuple2('varrho', 'ϱ'),
			_Utils_Tuple2('varsigma', 'ς'),
			_Utils_Tuple2('varsubsetneq', '⊊︀'),
			_Utils_Tuple2('varsubsetneqq', '⫋︀'),
			_Utils_Tuple2('varsupsetneq', '⊋︀'),
			_Utils_Tuple2('varsupsetneqq', '⫌︀'),
			_Utils_Tuple2('vartheta', 'ϑ'),
			_Utils_Tuple2('vartriangleleft', '⊲'),
			_Utils_Tuple2('vartriangleright', '⊳'),
			_Utils_Tuple2('vBar', '⫨'),
			_Utils_Tuple2('Vbar', '⫫'),
			_Utils_Tuple2('vBarv', '⫩'),
			_Utils_Tuple2('Vcy', 'В'),
			_Utils_Tuple2('vcy', 'в'),
			_Utils_Tuple2('vdash', '⊢'),
			_Utils_Tuple2('vDash', '⊨'),
			_Utils_Tuple2('Vdash', '⊩'),
			_Utils_Tuple2('VDash', '⊫'),
			_Utils_Tuple2('Vdashl', '⫦'),
			_Utils_Tuple2('veebar', '⊻'),
			_Utils_Tuple2('vee', '∨'),
			_Utils_Tuple2('Vee', '⋁'),
			_Utils_Tuple2('veeeq', '≚'),
			_Utils_Tuple2('vellip', '⋮'),
			_Utils_Tuple2('verbar', '|'),
			_Utils_Tuple2('Verbar', '‖'),
			_Utils_Tuple2('vert', '|'),
			_Utils_Tuple2('Vert', '‖'),
			_Utils_Tuple2('VerticalBar', '∣'),
			_Utils_Tuple2('VerticalLine', '|'),
			_Utils_Tuple2('VerticalSeparator', '❘'),
			_Utils_Tuple2('VerticalTilde', '≀'),
			_Utils_Tuple2('VeryThinSpace', '\u200A'),
			_Utils_Tuple2('Vfr', '\uD835\uDD19'),
			_Utils_Tuple2('vfr', '\uD835\uDD33'),
			_Utils_Tuple2('vltri', '⊲'),
			_Utils_Tuple2('vnsub', '⊂⃒'),
			_Utils_Tuple2('vnsup', '⊃⃒'),
			_Utils_Tuple2('Vopf', '\uD835\uDD4D'),
			_Utils_Tuple2('vopf', '\uD835\uDD67'),
			_Utils_Tuple2('vprop', '∝'),
			_Utils_Tuple2('vrtri', '⊳'),
			_Utils_Tuple2('Vscr', '\uD835\uDCB1'),
			_Utils_Tuple2('vscr', '\uD835\uDCCB'),
			_Utils_Tuple2('vsubnE', '⫋︀'),
			_Utils_Tuple2('vsubne', '⊊︀'),
			_Utils_Tuple2('vsupnE', '⫌︀'),
			_Utils_Tuple2('vsupne', '⊋︀'),
			_Utils_Tuple2('Vvdash', '⊪'),
			_Utils_Tuple2('vzigzag', '⦚'),
			_Utils_Tuple2('Wcirc', 'Ŵ'),
			_Utils_Tuple2('wcirc', 'ŵ'),
			_Utils_Tuple2('wedbar', '⩟'),
			_Utils_Tuple2('wedge', '∧'),
			_Utils_Tuple2('Wedge', '⋀'),
			_Utils_Tuple2('wedgeq', '≙'),
			_Utils_Tuple2('weierp', '℘'),
			_Utils_Tuple2('Wfr', '\uD835\uDD1A'),
			_Utils_Tuple2('wfr', '\uD835\uDD34'),
			_Utils_Tuple2('Wopf', '\uD835\uDD4E'),
			_Utils_Tuple2('wopf', '\uD835\uDD68'),
			_Utils_Tuple2('wp', '℘'),
			_Utils_Tuple2('wr', '≀'),
			_Utils_Tuple2('wreath', '≀'),
			_Utils_Tuple2('Wscr', '\uD835\uDCB2'),
			_Utils_Tuple2('wscr', '\uD835\uDCCC'),
			_Utils_Tuple2('xcap', '⋂'),
			_Utils_Tuple2('xcirc', '◯'),
			_Utils_Tuple2('xcup', '⋃'),
			_Utils_Tuple2('xdtri', '▽'),
			_Utils_Tuple2('Xfr', '\uD835\uDD1B'),
			_Utils_Tuple2('xfr', '\uD835\uDD35'),
			_Utils_Tuple2('xharr', '⟷'),
			_Utils_Tuple2('xhArr', '⟺'),
			_Utils_Tuple2('Xi', 'Ξ'),
			_Utils_Tuple2('xi', 'ξ'),
			_Utils_Tuple2('xlarr', '⟵'),
			_Utils_Tuple2('xlArr', '⟸'),
			_Utils_Tuple2('xmap', '⟼'),
			_Utils_Tuple2('xnis', '⋻'),
			_Utils_Tuple2('xodot', '⨀'),
			_Utils_Tuple2('Xopf', '\uD835\uDD4F'),
			_Utils_Tuple2('xopf', '\uD835\uDD69'),
			_Utils_Tuple2('xoplus', '⨁'),
			_Utils_Tuple2('xotime', '⨂'),
			_Utils_Tuple2('xrarr', '⟶'),
			_Utils_Tuple2('xrArr', '⟹'),
			_Utils_Tuple2('Xscr', '\uD835\uDCB3'),
			_Utils_Tuple2('xscr', '\uD835\uDCCD'),
			_Utils_Tuple2('xsqcup', '⨆'),
			_Utils_Tuple2('xuplus', '⨄'),
			_Utils_Tuple2('xutri', '△'),
			_Utils_Tuple2('xvee', '⋁'),
			_Utils_Tuple2('xwedge', '⋀'),
			_Utils_Tuple2('Yacute', 'Ý'),
			_Utils_Tuple2('yacute', 'ý'),
			_Utils_Tuple2('YAcy', 'Я'),
			_Utils_Tuple2('yacy', 'я'),
			_Utils_Tuple2('Ycirc', 'Ŷ'),
			_Utils_Tuple2('ycirc', 'ŷ'),
			_Utils_Tuple2('Ycy', 'Ы'),
			_Utils_Tuple2('ycy', 'ы'),
			_Utils_Tuple2('yen', '¥'),
			_Utils_Tuple2('Yfr', '\uD835\uDD1C'),
			_Utils_Tuple2('yfr', '\uD835\uDD36'),
			_Utils_Tuple2('YIcy', 'Ї'),
			_Utils_Tuple2('yicy', 'ї'),
			_Utils_Tuple2('Yopf', '\uD835\uDD50'),
			_Utils_Tuple2('yopf', '\uD835\uDD6A'),
			_Utils_Tuple2('Yscr', '\uD835\uDCB4'),
			_Utils_Tuple2('yscr', '\uD835\uDCCE'),
			_Utils_Tuple2('YUcy', 'Ю'),
			_Utils_Tuple2('yucy', 'ю'),
			_Utils_Tuple2('yuml', 'ÿ'),
			_Utils_Tuple2('Yuml', 'Ÿ'),
			_Utils_Tuple2('Zacute', 'Ź'),
			_Utils_Tuple2('zacute', 'ź'),
			_Utils_Tuple2('Zcaron', 'Ž'),
			_Utils_Tuple2('zcaron', 'ž'),
			_Utils_Tuple2('Zcy', 'З'),
			_Utils_Tuple2('zcy', 'з'),
			_Utils_Tuple2('Zdot', 'Ż'),
			_Utils_Tuple2('zdot', 'ż'),
			_Utils_Tuple2('zeetrf', 'ℨ'),
			_Utils_Tuple2('ZeroWidthSpace', '\u200B'),
			_Utils_Tuple2('Zeta', 'Ζ'),
			_Utils_Tuple2('zeta', 'ζ'),
			_Utils_Tuple2('zfr', '\uD835\uDD37'),
			_Utils_Tuple2('Zfr', 'ℨ'),
			_Utils_Tuple2('ZHcy', 'Ж'),
			_Utils_Tuple2('zhcy', 'ж'),
			_Utils_Tuple2('zigrarr', '⇝'),
			_Utils_Tuple2('zopf', '\uD835\uDD6B'),
			_Utils_Tuple2('Zopf', 'ℤ'),
			_Utils_Tuple2('Zscr', '\uD835\uDCB5'),
			_Utils_Tuple2('zscr', '\uD835\uDCCF'),
			_Utils_Tuple2('zwj', '\u200D'),
			_Utils_Tuple2('zwnj', '\u200C')
		]));
var $hecrj$html_parser$Html$Parser$namedCharacterReference = A2(
	$elm$parser$Parser$map,
	function (reference) {
		return A2(
			$elm$core$Maybe$withDefault,
			'&' + (reference + ';'),
			A2($elm$core$Dict$get, reference, $hecrj$html_parser$Html$Parser$NamedCharacterReferences$dict));
	},
	$elm$parser$Parser$getChompedString(
		$hecrj$html_parser$Html$Parser$chompOneOrMore($elm$core$Char$isAlpha)));
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char.valueOf()) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$core$Char$isHexDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return ((48 <= code) && (code <= 57)) || (((65 <= code) && (code <= 70)) || ((97 <= code) && (code <= 102)));
};
var $hecrj$html_parser$Html$Parser$hexadecimal = A2(
	$elm$parser$Parser$andThen,
	function (hex) {
		var _v0 = $rtfeldman$elm_hex$Hex$fromString(
			$elm$core$String$toLower(hex));
		if (_v0.$ === 'Ok') {
			var value = _v0.a;
			return $elm$parser$Parser$succeed(value);
		} else {
			var error = _v0.a;
			return $elm$parser$Parser$problem(error);
		}
	},
	$elm$parser$Parser$getChompedString(
		$hecrj$html_parser$Html$Parser$chompOneOrMore($elm$core$Char$isHexDigit)));
var $hecrj$html_parser$Html$Parser$numericCharacterReference = function () {
	var codepoint = $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$chompIf(
						function (c) {
							return _Utils_eq(
								c,
								_Utils_chr('x')) || _Utils_eq(
								c,
								_Utils_chr('X'));
						})),
				$hecrj$html_parser$Html$Parser$hexadecimal),
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$chompWhile(
						$elm$core$Basics$eq(
							_Utils_chr('0')))),
				$elm$parser$Parser$int)
			]));
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$chompIf(
				$elm$core$Basics$eq(
					_Utils_chr('#')))),
		A2(
			$elm$parser$Parser$map,
			A2($elm$core$Basics$composeR, $elm$core$Char$fromCode, $elm$core$String$fromChar),
			codepoint));
}();
var $hecrj$html_parser$Html$Parser$characterReference = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq(
				_Utils_chr('&')))),
	$elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$backtrackable($hecrj$html_parser$Html$Parser$namedCharacterReference),
				$hecrj$html_parser$Html$Parser$chompSemicolon),
				A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$backtrackable($hecrj$html_parser$Html$Parser$numericCharacterReference),
				$hecrj$html_parser$Html$Parser$chompSemicolon),
				$elm$parser$Parser$succeed('&')
			])));
var $hecrj$html_parser$Html$Parser$tagAttributeQuotedValue = function (quote) {
	var isQuotedValueChar = function (c) {
		return (!_Utils_eq(c, quote)) && (!_Utils_eq(
			c,
			_Utils_chr('&')));
	};
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$chompIf(
				$elm$core$Basics$eq(quote))),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$map,
				$elm$core$String$join(''),
				$hecrj$html_parser$Html$Parser$many(
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$getChompedString(
								$hecrj$html_parser$Html$Parser$chompOneOrMore(isQuotedValueChar)),
								$hecrj$html_parser$Html$Parser$characterReference
							])))),
			$elm$parser$Parser$chompIf(
				$elm$core$Basics$eq(quote))));
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $hecrj$html_parser$Html$Parser$oneOrMore = F2(
	function (type_, parser_) {
		return A2(
			$elm$parser$Parser$loop,
			_List_Nil,
			function (list) {
				return $elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$map,
							function (_new) {
								return $elm$parser$Parser$Loop(
									A2($elm$core$List$cons, _new, list));
							},
							parser_),
							$elm$core$List$isEmpty(list) ? $elm$parser$Parser$problem('expecting at least one ' + type_) : $elm$parser$Parser$succeed(
							$elm$parser$Parser$Done(
								$elm$core$List$reverse(list)))
						]));
			});
	});
var $hecrj$html_parser$Html$Parser$tagAttributeUnquotedValue = function () {
	var isUnquotedValueChar = function (c) {
		return (!$hecrj$html_parser$Html$Parser$isSpaceCharacter(c)) && ((!_Utils_eq(
			c,
			_Utils_chr('\"'))) && ((!_Utils_eq(
			c,
			_Utils_chr('\''))) && ((!_Utils_eq(
			c,
			_Utils_chr('='))) && ((!_Utils_eq(
			c,
			_Utils_chr('<'))) && ((!_Utils_eq(
			c,
			_Utils_chr('>'))) && ((!_Utils_eq(
			c,
			_Utils_chr('`'))) && (!_Utils_eq(
			c,
			_Utils_chr('&')))))))));
	};
	return A2(
		$elm$parser$Parser$map,
		$elm$core$String$join(''),
		A2(
			$hecrj$html_parser$Html$Parser$oneOrMore,
			'attribute value',
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$getChompedString(
						$hecrj$html_parser$Html$Parser$chompOneOrMore(isUnquotedValueChar)),
						$hecrj$html_parser$Html$Parser$characterReference
					]))));
}();
var $hecrj$html_parser$Html$Parser$tagAttributeValue = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq(
							_Utils_chr('=')))),
				$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$hecrj$html_parser$Html$Parser$tagAttributeUnquotedValue,
						$hecrj$html_parser$Html$Parser$tagAttributeQuotedValue(
						_Utils_chr('\"')),
						$hecrj$html_parser$Html$Parser$tagAttributeQuotedValue(
						_Utils_chr('\''))
					]))),
			$elm$parser$Parser$succeed('')
		]));
var $hecrj$html_parser$Html$Parser$tagAttribute = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Tuple$pair),
		A2(
			$elm$parser$Parser$ignorer,
			$hecrj$html_parser$Html$Parser$tagAttributeName,
			$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter))),
	A2(
		$elm$parser$Parser$ignorer,
		$hecrj$html_parser$Html$Parser$tagAttributeValue,
		$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)));
var $hecrj$html_parser$Html$Parser$tagAttributes = $hecrj$html_parser$Html$Parser$many($hecrj$html_parser$Html$Parser$tagAttribute);
var $hecrj$html_parser$Html$Parser$tagName = A2(
	$elm$parser$Parser$map,
	$elm$core$String$toLower,
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$chompIf($elm$core$Char$isAlphaNum),
			$elm$parser$Parser$chompWhile(
				function (c) {
					return $elm$core$Char$isAlphaNum(c) || _Utils_eq(
						c,
						_Utils_chr('-'));
				}))));
var $hecrj$html_parser$Html$Parser$Text = function (a) {
	return {$: 'Text', a: a};
};
var $hecrj$html_parser$Html$Parser$text = A2(
	$elm$parser$Parser$map,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$String$join(''),
		$hecrj$html_parser$Html$Parser$Text),
	A2(
		$hecrj$html_parser$Html$Parser$oneOrMore,
		'text element',
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$getChompedString(
					$hecrj$html_parser$Html$Parser$chompOneOrMore(
						function (c) {
							return (!_Utils_eq(
								c,
								_Utils_chr('<'))) && (!_Utils_eq(
								c,
								_Utils_chr('&')));
						})),
					$hecrj$html_parser$Html$Parser$characterReference
				]))));
function $hecrj$html_parser$Html$Parser$cyclic$node() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$hecrj$html_parser$Html$Parser$text,
				$hecrj$html_parser$Html$Parser$comment,
				$hecrj$html_parser$Html$Parser$cyclic$element()
			]));
}
function $hecrj$html_parser$Html$Parser$cyclic$element() {
	return A2(
		$elm$parser$Parser$andThen,
		function (_v0) {
			var name = _v0.a;
			var attributes = _v0.b;
			return $hecrj$html_parser$Html$Parser$isVoidElement(name) ? A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A3($hecrj$html_parser$Html$Parser$Element, name, attributes, _List_Nil)),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$chompIf(
								$elm$core$Basics$eq(
									_Utils_chr('/'))),
								$elm$parser$Parser$succeed(_Utils_Tuple0)
							]))),
				$elm$parser$Parser$chompIf(
					$elm$core$Basics$eq(
						_Utils_chr('>')))) : A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A2($hecrj$html_parser$Html$Parser$Element, name, attributes)),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq(
							_Utils_chr('>')))),
				A2(
					$elm$parser$Parser$ignorer,
					$hecrj$html_parser$Html$Parser$many(
						$elm$parser$Parser$backtrackable(
							$hecrj$html_parser$Html$Parser$cyclic$node())),
					$hecrj$html_parser$Html$Parser$closingTag(name)));
		},
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Tuple$pair),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq(
							_Utils_chr('<')))),
				A2(
					$elm$parser$Parser$ignorer,
					$hecrj$html_parser$Html$Parser$tagName,
					$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter))),
			$hecrj$html_parser$Html$Parser$tagAttributes));
}
try {
	var $hecrj$html_parser$Html$Parser$node = $hecrj$html_parser$Html$Parser$cyclic$node();
	$hecrj$html_parser$Html$Parser$cyclic$node = function () {
		return $hecrj$html_parser$Html$Parser$node;
	};
	var $hecrj$html_parser$Html$Parser$element = $hecrj$html_parser$Html$Parser$cyclic$element();
	$hecrj$html_parser$Html$Parser$cyclic$element = function () {
		return $hecrj$html_parser$Html$Parser$element;
	};
} catch ($) {
	throw 'Some top-level definitions from `Html.Parser` are causing infinite recursion:\n\n  ┌─────┐\n  │    node\n  │     ↓\n  │    element\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $hecrj$html_parser$Html$Parser$run = function (str) {
	return $elm$core$String$isEmpty(str) ? $elm$core$Result$Ok(_List_Nil) : A2(
		$elm$parser$Parser$run,
		A2($hecrj$html_parser$Html$Parser$oneOrMore, 'node', $hecrj$html_parser$Html$Parser$node),
		str);
};
var $author$project$HtmlParser$parseHtml = F2(
	function (s, context) {
		var parseRes = $hecrj$html_parser$Html$Parser$run(s);
		if (parseRes.$ === 'Ok') {
			var res = parseRes.a;
			if (res.b && (!res.b.b)) {
				var node = res.a;
				return A2($author$project$HtmlParser$nodeToValue, node, context);
			} else {
				return $author$project$Syntax$VError('There cannot be two or more or 0 root nodes.');
			}
		} else {
			return $author$project$Syntax$VError('Parse Html Error.');
		}
	});
var $author$project$LangUtils$printPattern = function (p) {
	_v0$4:
	while (true) {
		_v0$5:
		while (true) {
			_v0$13:
			while (true) {
				switch (p.$) {
					case 'PVar':
						if (p.a.a.b && (!p.a.a.b.b)) {
							var _v1 = p.a;
							var _v2 = _v1.a;
							var ws = _v2.a;
							var s = p.b;
							return _Utils_ap(s, ws);
						} else {
							break _v0$13;
						}
					case 'PCons':
						var _v3 = p.a;
						var ls = _v3.a;
						var kind = _v3.b;
						var p1 = p.b;
						var p2 = p.c;
						var _v4 = _Utils_Tuple2(ls, kind);
						_v4$5:
						while (true) {
							if (_v4.a.b) {
								if (_v4.a.b.b) {
									if ((!_v4.a.b.b.b) && (!_v4.b)) {
										var _v5 = _v4.a;
										var ws1 = _v5.a;
										var _v6 = _v5.b;
										var ws2 = _v6.a;
										return '[' + (ws1 + ($author$project$LangUtils$printPattern(p1) + ($author$project$LangUtils$printPattern(p2) + (']' + ws2))));
									} else {
										break _v4$5;
									}
								} else {
									switch (_v4.b) {
										case 1:
											var _v7 = _v4.a;
											var ws = _v7.a;
											return ',' + (ws + ($author$project$LangUtils$printPattern(p1) + $author$project$LangUtils$printPattern(p2)));
										case 2:
											var _v8 = _v4.a;
											var ws = _v8.a;
											return $author$project$LangUtils$printPattern(p1) + ('::' + (ws + $author$project$LangUtils$printPattern(p2)));
										case 3:
											var _v9 = _v4.a;
											var ws = _v9.a;
											if (p1.$ === 'PChar') {
												var c = p1.b;
												return '\"' + ($elm$core$String$fromChar(c) + ($author$project$LangUtils$printPattern(p2) + ('\"' + ws)));
											} else {
												return 'Print Error: 08.';
											}
										default:
											break _v4$5;
									}
								}
							} else {
								if (_v4.b === 4) {
									if (p1.$ === 'PChar') {
										var c = p1.b;
										return _Utils_ap(
											$elm$core$String$fromChar(c),
											$author$project$LangUtils$printPattern(p2));
									} else {
										return 'Print Error: 09.';
									}
								} else {
									break _v4$5;
								}
							}
						}
						return 'Print Error: 02.';
					case 'PNil':
						if (p.a.a.b) {
							if (p.a.a.b.b) {
								if (!p.a.a.b.b.b) {
									var _v12 = p.a;
									var _v13 = _v12.a;
									var ws1 = _v13.a;
									var _v14 = _v13.b;
									var ws2 = _v14.a;
									return '[' + (ws1 + (']' + ws2));
								} else {
									if (p.a.b === 3) {
										break _v0$4;
									} else {
										break _v0$5;
									}
								}
							} else {
								if (p.a.b === 3) {
									var _v15 = p.a;
									var _v16 = _v15.a;
									var ws = _v16.a;
									return '\"\"' + ws;
								} else {
									break _v0$5;
								}
							}
						} else {
							if (p.a.b === 3) {
								break _v0$4;
							} else {
								break _v0$5;
							}
						}
					case 'PInt':
						if (p.a.a.b && (!p.a.a.b.b)) {
							var _v18 = p.a;
							var _v19 = _v18.a;
							var ws = _v19.a;
							var n = p.b;
							return _Utils_ap(
								$elm$core$Debug$toString(n),
								ws);
						} else {
							break _v0$13;
						}
					case 'PFloat':
						if (p.a.a.b && (!p.a.a.b.b)) {
							var _v20 = p.a;
							var _v21 = _v20.a;
							var ws = _v21.a;
							var n = p.b;
							return _Utils_ap(
								$elm$core$Debug$toString(n),
								ws);
						} else {
							break _v0$13;
						}
					case 'PTrue':
						if (p.a.a.b && (!p.a.a.b.b)) {
							var _v22 = p.a;
							var _v23 = _v22.a;
							var ws = _v23.a;
							return 'true' + ws;
						} else {
							break _v0$13;
						}
					case 'PFalse':
						if (p.a.a.b && (!p.a.a.b.b)) {
							var _v24 = p.a;
							var _v25 = _v24.a;
							var ws = _v25.a;
							return 'false' + ws;
						} else {
							break _v0$13;
						}
					case 'PChar':
						if (p.a.a.b && (!p.a.a.b.b)) {
							var _v26 = p.a;
							var _v27 = _v26.a;
							var ws = _v27.a;
							var c = p.b;
							return _Utils_ap(
								$elm$core$String$fromChar(c),
								ws);
						} else {
							break _v0$13;
						}
					case 'PBTuple':
						if (((p.a.a.b && p.a.a.b.b) && p.a.a.b.b.b) && (!p.a.a.b.b.b.b)) {
							var _v28 = p.a;
							var _v29 = _v28.a;
							var ws1 = _v29.a;
							var _v30 = _v29.b;
							var ws2 = _v30.a;
							var _v31 = _v30.b;
							var ws3 = _v31.a;
							var p1 = p.b;
							var p2 = p.c;
							return '(' + (ws1 + ($author$project$LangUtils$printPattern(p1) + (',' + (ws2 + ($author$project$LangUtils$printPattern(p2) + (')' + ws3))))));
						} else {
							break _v0$13;
						}
					default:
						if ((((p.a.a.b && p.a.a.b.b) && p.a.a.b.b.b) && p.a.a.b.b.b.b) && (!p.a.a.b.b.b.b.b)) {
							var _v32 = p.a;
							var _v33 = _v32.a;
							var ws1 = _v33.a;
							var _v34 = _v33.b;
							var ws2 = _v34.a;
							var _v35 = _v34.b;
							var ws3 = _v35.a;
							var _v36 = _v35.b;
							var ws4 = _v36.a;
							var p1 = p.b;
							var p2 = p.c;
							var p3 = p.d;
							return '(' + (ws1 + ($author$project$LangUtils$printPattern(p1) + (',' + (ws2 + ($author$project$LangUtils$printPattern(p2) + (',' + (ws3 + ($author$project$LangUtils$printPattern(p3) + (')' + ws4)))))))));
						} else {
							break _v0$13;
						}
				}
			}
			return 'Print Error: 03.';
		}
		return '';
	}
	var _v17 = p.a;
	return '\"\" ';
};
var $author$project$LangUtils$printAST = function (expr) {
	printAST:
	while (true) {
		_v5$7:
		while (true) {
			_v5$20:
			while (true) {
				_v5$22:
				while (true) {
					_v5$36:
					while (true) {
						switch (expr.$) {
							case 'EVar':
								if (expr.a.a.b && (!expr.a.a.b.b)) {
									var _v6 = expr.a;
									var _v7 = _v6.a;
									var ws = _v7.a;
									var s = expr.b;
									return _Utils_ap(s, ws);
								} else {
									break _v5$36;
								}
							case 'ELam':
								if ((expr.a.a.b && expr.a.a.b.b) && (!expr.a.a.b.b.b)) {
									var _v8 = expr.a;
									var _v9 = _v8.a;
									var ws1 = _v9.a;
									var _v10 = _v9.b;
									var ws2 = _v10.a;
									var p = expr.b;
									var e = expr.c;
									return '\\' + (ws1 + ($author$project$LangUtils$printPattern(p) + ('=>' + (ws2 + $author$project$LangUtils$printAST(e)))));
								} else {
									if ((expr.b.$ === 'PVar') && (expr.b.b === '$CASE$')) {
										var _v11 = expr.b;
										var e = expr.c;
										var $temp$expr = e;
										expr = $temp$expr;
										continue printAST;
									} else {
										break _v5$36;
									}
								}
							case 'ELet':
								if (((expr.a.a.b && expr.a.a.b.b) && expr.a.a.b.b.b) && (!expr.a.a.b.b.b.b)) {
									var _v12 = expr.a;
									var _v13 = _v12.a;
									var ws1 = _v13.a;
									var _v14 = _v13.b;
									var ws2 = _v14.a;
									var _v15 = _v14.b;
									var ws3 = _v15.a;
									var p = expr.b;
									var e1 = expr.c;
									var e2 = expr.d;
									return 'let' + (ws1 + ($author$project$LangUtils$printPattern(p) + ('=' + (ws2 + ($author$project$LangUtils$printAST(e1) + ('in' + (ws3 + $author$project$LangUtils$printAST(e2))))))));
								} else {
									break _v5$36;
								}
							case 'ELetrec':
								if (((expr.a.a.b && expr.a.a.b.b) && expr.a.a.b.b.b) && (!expr.a.a.b.b.b.b)) {
									var _v16 = expr.a;
									var _v17 = _v16.a;
									var ws1 = _v17.a;
									var _v18 = _v17.b;
									var ws2 = _v18.a;
									var _v19 = _v18.b;
									var ws3 = _v19.a;
									var p = expr.b;
									var e1 = expr.c;
									var e2 = expr.d;
									return 'letrec' + (ws1 + ($author$project$LangUtils$printPattern(p) + ('=' + (ws2 + ($author$project$LangUtils$printAST(e1) + ('in' + (ws3 + $author$project$LangUtils$printAST(e2))))))));
								} else {
									break _v5$36;
								}
							case 'EApp':
								if (expr.a.a.b) {
									if (expr.a.a.b.b) {
										if ((!expr.a.a.b.b.b) && (expr.a.b === 1)) {
											var _v20 = expr.a;
											var _v21 = _v20.a;
											var ws1 = _v21.a;
											var _v22 = _v21.b;
											var ws2 = _v22.a;
											var e1 = expr.b;
											var e2 = expr.c;
											return 'case' + (ws1 + ($author$project$LangUtils$printAST(e2) + ('of' + (ws2 + $author$project$LangUtils$printAST(e1)))));
										} else {
											break _v5$7;
										}
									} else {
										if (expr.a.b === 2) {
											var _v23 = expr.a;
											var _v24 = _v23.a;
											var ws = _v24.a;
											var e1 = expr.b;
											var e2 = expr.c;
											return 'if' + (ws + ($author$project$LangUtils$printAST(e2) + $author$project$LangUtils$printAST(e1)));
										} else {
											break _v5$7;
										}
									}
								} else {
									break _v5$7;
								}
							case 'EInt':
								if (expr.a.a.b && (!expr.a.a.b.b)) {
									var _v25 = expr.a;
									var _v26 = _v25.a;
									var ws = _v26.a;
									var n = expr.b;
									return _Utils_ap(
										$elm$core$Debug$toString(n),
										ws);
								} else {
									var n = expr.b;
									return $elm$core$Debug$toString(n) + ' ';
								}
							case 'EFloat':
								if (expr.a.a.b && (!expr.a.a.b.b)) {
									var _v27 = expr.a;
									var _v28 = _v27.a;
									var ws = _v28.a;
									var n = expr.b;
									return _Utils_ap(
										$elm$core$Debug$toString(n),
										ws);
								} else {
									var n = expr.b;
									return $elm$core$Debug$toString(n) + ' ';
								}
							case 'ETrue':
								if (expr.a.a.b && (!expr.a.a.b.b)) {
									var _v29 = expr.a;
									var _v30 = _v29.a;
									var ws = _v30.a;
									return 'true' + ws;
								} else {
									return 'true ';
								}
							case 'EFalse':
								if (expr.a.a.b && (!expr.a.a.b.b)) {
									var _v31 = expr.a;
									var _v32 = _v31.a;
									var ws = _v32.a;
									return 'false' + ws;
								} else {
									return 'false ';
								}
							case 'EChar':
								if (expr.a.a.b && (!expr.a.a.b.b)) {
									var _v33 = expr.a;
									var _v34 = _v33.a;
									var ws = _v34.a;
									var c = expr.b;
									return '\'' + ($elm$core$String$fromChar(c) + ('\'' + ws));
								} else {
									var c = expr.b;
									return '\'' + ($elm$core$String$fromChar(c) + '\' ');
								}
							case 'ECons':
								var _v35 = expr.a;
								var ls = _v35.a;
								var kind = _v35.b;
								var e1 = expr.b;
								var e2 = expr.c;
								var _v36 = _Utils_Tuple2(ls, kind);
								_v36$6:
								while (true) {
									switch (_v36.b) {
										case 0:
											if ((_v36.a.b && _v36.a.b.b) && (!_v36.a.b.b.b)) {
												var _v37 = _v36.a;
												var ws1 = _v37.a;
												var _v38 = _v37.b;
												var ws2 = _v38.a;
												return '[' + (ws1 + ($author$project$LangUtils$printAST(e1) + ($author$project$LangUtils$printAST(e2) + (']' + ws2))));
											} else {
												break _v36$6;
											}
										case 1:
											if (_v36.a.b && (!_v36.a.b.b)) {
												var _v39 = _v36.a;
												var ws = _v39.a;
												return ',' + (ws + ($author$project$LangUtils$printAST(e1) + $author$project$LangUtils$printAST(e2)));
											} else {
												return ', ' + ($author$project$LangUtils$printAST(e1) + $author$project$LangUtils$printAST(e2));
											}
										case 2:
											if (_v36.a.b && (!_v36.a.b.b)) {
												var _v40 = _v36.a;
												var ws = _v40.a;
												return $author$project$LangUtils$printAST(e1) + ('::' + (ws + $author$project$LangUtils$printAST(e2)));
											} else {
												break _v36$6;
											}
										case 3:
											if (_v36.a.b && (!_v36.a.b.b)) {
												var _v41 = _v36.a;
												var ws = _v41.a;
												if (e1.$ === 'EChar') {
													var c = e1.b;
													return '\"' + ($elm$core$String$fromChar(c) + ($author$project$LangUtils$printAST(e2) + ('\"' + ws)));
												} else {
													return 'Print Error: 05.';
												}
											} else {
												break _v36$6;
											}
										case 4:
											if (!_v36.a.b) {
												if (e1.$ === 'EChar') {
													var c = e1.b;
													return _Utils_ap(
														$elm$core$String$fromChar(c),
														$author$project$LangUtils$printAST(e2));
												} else {
													return 'Print Error: 06.';
												}
											} else {
												break _v36$6;
											}
										default:
											break _v36$6;
									}
								}
								return 'Print Error: 04.';
							case 'ENil':
								if (expr.a.a.b) {
									if (!expr.a.a.b.b) {
										if (expr.a.b === 3) {
											var _v44 = expr.a;
											var _v45 = _v44.a;
											var ws = _v45.a;
											return '\"\"' + ws;
										} else {
											break _v5$22;
										}
									} else {
										if (expr.a.b === 3) {
											break _v5$20;
										} else {
											if (!expr.a.a.b.b.b) {
												var _v47 = expr.a;
												var _v48 = _v47.a;
												var ws1 = _v48.a;
												var _v49 = _v48.b;
												var ws2 = _v49.a;
												return '[' + (ws1 + (']' + ws2));
											} else {
												break _v5$22;
											}
										}
									}
								} else {
									if (expr.a.b === 3) {
										break _v5$20;
									} else {
										break _v5$22;
									}
								}
							case 'EHole':
								if (expr.a.a.b && (!expr.a.a.b.b)) {
									var _v50 = expr.a;
									var _v51 = _v50.a;
									var ws = _v51.a;
									return '_' + ws;
								} else {
									return '_';
								}
							case 'EBPrim':
								if (expr.a.a.b && (!expr.a.a.b.b)) {
									var _v52 = expr.a;
									var _v53 = _v52.a;
									var ws = _v53.a;
									var op = expr.b;
									var e1 = expr.c;
									var e2 = expr.d;
									var sop = function () {
										switch (op.$) {
											case 'Add':
												return '+';
											case 'Sub':
												return '-';
											case 'Mul':
												return '*';
											case 'Div':
												return '//';
											case 'DDiv':
												return '/';
											case 'Eq':
												return '==';
											case 'Lt':
												return '<';
											case 'Gt':
												return '>';
											case 'Le':
												return '<=';
											case 'Ge':
												return '>=';
											case 'And':
												return '&&';
											case 'Or':
												return '||';
											default:
												return '++';
										}
									}();
									var s2 = $author$project$LangUtils$printAST(e2);
									var s1 = $author$project$LangUtils$printAST(e1);
									return _Utils_ap(
										s1,
										_Utils_ap(
											sop,
											_Utils_ap(ws, s2)));
								} else {
									break _v5$36;
								}
							case 'EUPrim':
								if ((expr.a.a.b && (!expr.a.a.b.b)) && (!expr.a.b)) {
									var _v55 = expr.a;
									var _v56 = _v55.a;
									var ws = _v56.a;
									var op = expr.b;
									var e = expr.c;
									var sop = function () {
										if (op.$ === 'Neg') {
											return '-';
										} else {
											return '!';
										}
									}();
									var s = $author$project$LangUtils$printAST(e);
									return _Utils_ap(
										sop,
										_Utils_ap(ws, s));
								} else {
									break _v5$36;
								}
							case 'ECase':
								if ((((((expr.a.a.b && expr.a.a.b.b) && (!expr.a.a.b.b.b)) && (expr.a.b === 1)) && (expr.c.$ === 'BCom')) && (expr.c.b.$ === 'BSin')) && (expr.c.c.$ === 'BSin')) {
									var _v58 = expr.a;
									var _v59 = _v58.a;
									var ws1 = _v59.a;
									var _v60 = _v59.b;
									var ws2 = _v60.a;
									var _v61 = expr.c;
									var _v62 = _v61.b;
									var e1 = _v62.c;
									var _v63 = _v61.c;
									var e2 = _v63.c;
									return 'then' + (ws1 + ($author$project$LangUtils$printAST(e1) + ('else' + (ws2 + $author$project$LangUtils$printAST(e2)))));
								} else {
									var branch = expr.c;
									return $author$project$LangUtils$printBranch(branch);
								}
							case 'EFix':
								var e = expr.b;
								var $temp$expr = e;
								expr = $temp$expr;
								continue printAST;
							case 'EParens':
								if ((expr.a.a.b && expr.a.a.b.b) && (!expr.a.a.b.b.b)) {
									var _v64 = expr.a;
									var _v65 = _v64.a;
									var ws1 = _v65.a;
									var _v66 = _v65.b;
									var ws2 = _v66.a;
									var e = expr.b;
									return '(' + (ws1 + ($author$project$LangUtils$printAST(e) + (')' + ws2)));
								} else {
									break _v5$36;
								}
							case 'EBTuple':
								if (((expr.a.a.b && expr.a.a.b.b) && expr.a.a.b.b.b) && (!expr.a.a.b.b.b.b)) {
									var _v67 = expr.a;
									var _v68 = _v67.a;
									var ws1 = _v68.a;
									var _v69 = _v68.b;
									var ws2 = _v69.a;
									var _v70 = _v69.b;
									var ws3 = _v70.a;
									var e1 = expr.b;
									var e2 = expr.c;
									return '(' + (ws1 + ($author$project$LangUtils$printAST(e1) + (',' + (ws2 + ($author$project$LangUtils$printAST(e2) + (')' + ws3))))));
								} else {
									break _v5$36;
								}
							case 'ETTuple':
								if ((((expr.a.a.b && expr.a.a.b.b) && expr.a.a.b.b.b) && expr.a.a.b.b.b.b) && (!expr.a.a.b.b.b.b.b)) {
									var _v71 = expr.a;
									var _v72 = _v71.a;
									var ws1 = _v72.a;
									var _v73 = _v72.b;
									var ws2 = _v73.a;
									var _v74 = _v73.b;
									var ws3 = _v74.a;
									var _v75 = _v74.b;
									var ws4 = _v75.a;
									var e1 = expr.b;
									var e2 = expr.c;
									var e3 = expr.d;
									return '(' + (ws1 + ($author$project$LangUtils$printAST(e1) + (',' + (ws2 + ($author$project$LangUtils$printAST(e2) + (',' + (ws3 + ($author$project$LangUtils$printAST(e3) + (')' + ws4)))))))));
								} else {
									break _v5$36;
								}
							case 'EHtml':
								if ((((expr.a.a.b && expr.a.a.b.b) && expr.a.a.b.b.b) && (!expr.a.a.b.b.b.b)) && (!expr.a.b)) {
									var _v76 = expr.a;
									var _v77 = _v76.a;
									var ws1 = _v77.a;
									var _v78 = _v77.b;
									var ws2 = _v78.a;
									var _v79 = _v78.b;
									var ws3 = _v79.a;
									var s = expr.b;
									var e1 = expr.c;
									var e2 = expr.d;
									var e3 = expr.e;
									return 'Html.' + (s + (ws1 + ($author$project$LangUtils$printAST(e1) + (ws2 + ($author$project$LangUtils$printAST(e2) + (ws3 + $author$project$LangUtils$printAST(e3)))))));
								} else {
									break _v5$36;
								}
							case 'EToStr':
								if ((expr.a.a.b && (!expr.a.a.b.b)) && (!expr.a.b)) {
									var _v80 = expr.a;
									var _v81 = _v80.a;
									var ws = _v81.a;
									var e = expr.b;
									return 'toString' + (ws + $author$project$LangUtils$printAST(e));
								} else {
									break _v5$36;
								}
							default:
								var info = expr.a;
								return info;
						}
					}
					return 'Print Error: 01.';
				}
				return '';
			}
			var _v46 = expr.a;
			return '\"\" ';
		}
		var e1 = expr.b;
		var e2 = expr.c;
		return _Utils_ap(
			$author$project$LangUtils$printAST(e1),
			$author$project$LangUtils$printAST(e2));
	}
};
var $author$project$LangUtils$printBranch = function (b) {
	_v0$2:
	while (true) {
		switch (b.$) {
			case 'BSin':
				if (b.a.a.b && (!b.a.a.b.b)) {
					var _v1 = b.a;
					var _v2 = _v1.a;
					var ws = _v2.a;
					var p = b.b;
					var e = b.c;
					return $author$project$LangUtils$printPattern(p) + ('=>' + (ws + $author$project$LangUtils$printAST(e)));
				} else {
					break _v0$2;
				}
			case 'BCom':
				if (b.a.a.b && (!b.a.a.b.b)) {
					var _v3 = b.a;
					var _v4 = _v3.a;
					var ws = _v4.a;
					var b1 = b.b;
					var b2 = b.c;
					return $author$project$LangUtils$printBranch(b1) + ('|' + (ws + $author$project$LangUtils$printBranch(b2)));
				} else {
					break _v0$2;
				}
			default:
				break _v0$2;
		}
	}
	return 'Print Error: 05.';
};
var $author$project$LangUtils$changeHoleID = F3(
	function (henv, old, _new) {
		if (henv.b && (henv.a.a.$ === 'HOri')) {
			var _v1 = henv.a;
			var n = _v1.a.a;
			var venv = _v1.b;
			var v = _v1.c;
			var hv = henv.b;
			return _Utils_eq(n, old) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple3(
					$author$project$Syntax$HOri(_new),
					venv,
					v),
				A3($author$project$LangUtils$changeHoleID, hv, old, _new)) : A2(
				$elm$core$List$cons,
				_Utils_Tuple3(
					$author$project$Syntax$HOri(n),
					venv,
					v),
				A3($author$project$LangUtils$changeHoleID, hv, old, _new));
		} else {
			return _List_Nil;
		}
	});
var $author$project$LangUtils$processBeforePrint = F4(
	function (expr, env, holeID, henv) {
		_v4$16:
		while (true) {
			switch (expr.$) {
				case 'EHole':
					if (expr.b.$ === 'HOri') {
						var ws = expr.a;
						var u = expr.b.a;
						return _Utils_Tuple3(
							A2(
								$author$project$Syntax$EHole,
								ws,
								$author$project$Syntax$HOri(u)),
							holeID + 1,
							A3($author$project$LangUtils$changeHoleID, henv, u, holeID));
					} else {
						break _v4$16;
					}
				case 'EVar':
					var ws = expr.a;
					var s = expr.b;
					return _Utils_Tuple3(
						A2($author$project$Syntax$EVar, ws, s),
						holeID,
						henv);
				case 'ELam':
					var ws = expr.a;
					var pat = expr.b;
					var body = expr.c;
					var _v5 = A4($author$project$LangUtils$processBeforePrint, body, env, holeID, henv);
					var body_ = _v5.a;
					var holeID_ = _v5.b;
					var henv_ = _v5.c;
					return _Utils_Tuple3(
						A3($author$project$Syntax$ELam, ws, pat, body_),
						holeID_,
						henv_);
				case 'ELet':
					var ws = expr.a;
					var pat = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var _v6 = A4($author$project$LangUtils$processBeforePrint, e1, env, holeID, henv);
					var e1_ = _v6.a;
					var holeID_ = _v6.b;
					var henv_ = _v6.c;
					var _v7 = A4($author$project$LangUtils$processBeforePrint, e2, env, holeID_, henv_);
					var e2_ = _v7.a;
					var holeID__ = _v7.b;
					var henv__ = _v7.c;
					return _Utils_Tuple3(
						A4($author$project$Syntax$ELet, ws, pat, e1_, e2_),
						holeID__,
						henv__);
				case 'ELetrec':
					var ws = expr.a;
					var pat = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var _v8 = A4($author$project$LangUtils$processBeforePrint, e1, env, holeID, henv);
					var e1_ = _v8.a;
					var holeID_ = _v8.b;
					var henv_ = _v8.c;
					var _v9 = A4($author$project$LangUtils$processBeforePrint, e2, env, holeID_, henv_);
					var e2_ = _v9.a;
					var holeID__ = _v9.b;
					var henv__ = _v9.c;
					return _Utils_Tuple3(
						A4($author$project$Syntax$ELetrec, ws, pat, e1_, e2_),
						holeID__,
						henv__);
				case 'EApp':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					var _v10 = A4($author$project$LangUtils$processBeforePrint, e1, env, holeID, henv);
					var e1_ = _v10.a;
					var holeID_ = _v10.b;
					var henv_ = _v10.c;
					var _v11 = A4($author$project$LangUtils$processBeforePrint, e2, env, holeID_, henv_);
					var e2_ = _v11.a;
					var holeID__ = _v11.b;
					var henv__ = _v11.c;
					return _Utils_Tuple3(
						A3($author$project$Syntax$EApp, ws, e1_, e2_),
						holeID__,
						henv__);
				case 'ECons':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					var _v12 = A4($author$project$LangUtils$processBeforePrint, e1, env, holeID, henv);
					var e1_ = _v12.a;
					var holeID_ = _v12.b;
					var henv_ = _v12.c;
					var _v13 = A4($author$project$LangUtils$processBeforePrint, e2, env, holeID_, henv_);
					var e2_ = _v13.a;
					var holeID__ = _v13.b;
					var henv__ = _v13.c;
					return _Utils_Tuple3(
						A3($author$project$Syntax$ECons, ws, e1_, e2_),
						holeID__,
						henv__);
				case 'EBPrim':
					var ws = expr.a;
					var op = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var _v14 = A4($author$project$LangUtils$processBeforePrint, e1, env, holeID, henv);
					var e1_ = _v14.a;
					var holeID_ = _v14.b;
					var henv_ = _v14.c;
					var _v15 = A4($author$project$LangUtils$processBeforePrint, e2, env, holeID_, henv_);
					var e2_ = _v15.a;
					var holeID__ = _v15.b;
					var henv__ = _v15.c;
					return _Utils_Tuple3(
						A4($author$project$Syntax$EBPrim, ws, op, e1_, e2_),
						holeID__,
						henv__);
				case 'EUPrim':
					var ws = expr.a;
					var op = expr.b;
					var e = expr.c;
					var _v16 = A4($author$project$LangUtils$processBeforePrint, e, env, holeID, henv);
					var e_ = _v16.a;
					var holeID_ = _v16.b;
					var henv_ = _v16.c;
					return _Utils_Tuple3(
						A3($author$project$Syntax$EUPrim, ws, op, e_),
						holeID_,
						henv_);
				case 'ECase':
					var ws = expr.a;
					var e = expr.b;
					var branch = expr.c;
					var _v17 = A4($author$project$LangUtils$processBeforePrint, e, env, holeID, henv);
					var e_ = _v17.a;
					var holeID_ = _v17.b;
					var henv_ = _v17.c;
					var _v18 = A4($author$project$LangUtils$processBranchesBeforePrint, branch, env, holeID_, henv_);
					var branch_ = _v18.a;
					var holeID__ = _v18.b;
					var henv__ = _v18.c;
					return _Utils_Tuple3(
						A3($author$project$Syntax$ECase, ws, e_, branch_),
						holeID__,
						henv__);
				case 'EFix':
					var ws = expr.a;
					var e = expr.b;
					var _v19 = A4($author$project$LangUtils$processBeforePrint, e, env, holeID, henv);
					var e_ = _v19.a;
					var holeID_ = _v19.b;
					var henv_ = _v19.c;
					return _Utils_Tuple3(
						A2($author$project$Syntax$EFix, ws, e_),
						holeID_,
						henv_);
				case 'EParens':
					var ws = expr.a;
					var e = expr.b;
					var _v20 = A4($author$project$LangUtils$processBeforePrint, e, env, holeID, henv);
					var e_ = _v20.a;
					var holeID_ = _v20.b;
					var henv_ = _v20.c;
					return _Utils_Tuple3(
						A2($author$project$Syntax$EParens, ws, e_),
						holeID_,
						henv_);
				case 'EBTuple':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					var _v21 = A4($author$project$LangUtils$processBeforePrint, e1, env, holeID, henv);
					var e1_ = _v21.a;
					var holeID_ = _v21.b;
					var henv_ = _v21.c;
					var _v22 = A4($author$project$LangUtils$processBeforePrint, e2, env, holeID_, henv_);
					var e2_ = _v22.a;
					var holeID__ = _v22.b;
					var henv__ = _v22.c;
					return _Utils_Tuple3(
						A3($author$project$Syntax$EBTuple, ws, e1_, e2_),
						holeID__,
						henv__);
				case 'ETTuple':
					var ws = expr.a;
					var e1 = expr.b;
					var e2 = expr.c;
					var e3 = expr.d;
					var _v23 = A4($author$project$LangUtils$processBeforePrint, e1, env, holeID, henv);
					var e1_ = _v23.a;
					var holeID1 = _v23.b;
					var henv1 = _v23.c;
					var _v24 = A4($author$project$LangUtils$processBeforePrint, e2, env, holeID1, henv1);
					var e2_ = _v24.a;
					var holeID2 = _v24.b;
					var henv2 = _v24.c;
					var _v25 = A4($author$project$LangUtils$processBeforePrint, e3, env, holeID2, henv2);
					var e3_ = _v25.a;
					var holeID3 = _v25.b;
					var henv3 = _v25.c;
					return _Utils_Tuple3(
						A4($author$project$Syntax$ETTuple, ws, e1_, e2_, e3_),
						holeID3,
						henv3);
				case 'EHtml':
					var ws = expr.a;
					var s = expr.b;
					var e1 = expr.c;
					var e2 = expr.d;
					var e3 = expr.e;
					var _v26 = A4($author$project$LangUtils$processBeforePrint, e1, env, holeID, henv);
					var e1_ = _v26.a;
					var holeID1 = _v26.b;
					var henv1 = _v26.c;
					var _v27 = A4($author$project$LangUtils$processBeforePrint, e2, env, holeID1, henv1);
					var e2_ = _v27.a;
					var holeID2 = _v27.b;
					var henv2 = _v27.c;
					var _v28 = A4($author$project$LangUtils$processBeforePrint, e3, env, holeID2, henv2);
					var e3_ = _v28.a;
					var holeID3 = _v28.b;
					var henv3 = _v28.c;
					return _Utils_Tuple3(
						A5($author$project$Syntax$EHtml, ws, s, e1_, e2_, e3_),
						holeID3,
						henv3);
				case 'EToStr':
					var ws = expr.a;
					var e = expr.b;
					var _v29 = A4($author$project$LangUtils$processBeforePrint, e, env, holeID, henv);
					var e_ = _v29.a;
					var holeID_ = _v29.b;
					var henv_ = _v29.c;
					return _Utils_Tuple3(
						A2($author$project$Syntax$EToStr, ws, e_),
						holeID_,
						henv_);
				default:
					break _v4$16;
			}
		}
		return _Utils_Tuple3(expr, holeID, henv);
	});
var $author$project$LangUtils$processBranchesBeforePrint = F4(
	function (b, env, holeID, henv) {
		switch (b.$) {
			case 'BNSin':
				var ws = b.a;
				var pat = b.c;
				var e = b.d;
				var _v1 = A4($author$project$LangUtils$processBeforePrint, e, env, holeID, henv);
				var e_ = _v1.a;
				var holeID_ = _v1.b;
				var henv_ = _v1.c;
				return _Utils_Tuple3(
					A3($author$project$Syntax$BSin, ws, pat, e_),
					holeID_,
					henv_);
			case 'BCom':
				var ws = b.a;
				var b1 = b.b;
				var b2 = b.c;
				var _v2 = A4($author$project$LangUtils$processBranchesBeforePrint, b1, env, holeID, henv);
				var b1_ = _v2.a;
				var holeID_ = _v2.b;
				var henv_ = _v2.c;
				var _v3 = A4($author$project$LangUtils$processBranchesBeforePrint, b2, env, holeID_, henv_);
				var b2_ = _v3.a;
				var holeID__ = _v3.b;
				var henv__ = _v3.c;
				return _Utils_Tuple3(
					A3($author$project$Syntax$BCom, ws, b1_, b2_),
					holeID__,
					henv__);
			default:
				return _Utils_Tuple3(b, holeID, henv);
		}
	});
var $author$project$UnEval$updateCode = function (model) {
	var pOutput = function () {
		var _v4 = model.mode;
		if (_v4.$ === 'HTML') {
			return A2($author$project$HtmlParser$parseHtml, model.output, model.context);
		} else {
			var resOutput = A2($author$project$Parser_$parseVal, model.output, model.context);
			if (resOutput.$ === 'Ok') {
				var res = resOutput.a;
				return res;
			} else {
				return $author$project$Syntax$VError('Parse Value Error.');
			}
		}
	}();
	var pCode = function () {
		var _v3 = $author$project$Parser_$parse(model.codeBackup);
		if (_v3.$ === 'Ok') {
			var res = _v3.a;
			return res;
		} else {
			return $author$project$Syntax$EError('Parse Code Error.');
		}
	}();
	var _v0 = _Utils_Tuple2(pOutput, pCode);
	if (_v0.a.$ === 'VError') {
		return _Utils_Tuple2(_List_Nil, 'Parse Output Error.');
	} else {
		if (_v0.b.$ === 'EError') {
			return _Utils_Tuple2(_List_Nil, 'Parse Code Error.');
		} else {
			var _v1 = A3($author$project$LangUtils$processAfterParse, pCode, _List_Nil, $author$project$Syntax$holeIDStart);
			var expr = _v1.a;
			var upRes = A5($author$project$UnEval$uneval, model.hbBackup, _List_Nil, expr, pOutput, $author$project$Syntax$holeAddedByUserStart);
			var _v2 = A4($author$project$LangUtils$processBeforePrint, upRes.expr, _List_Nil, $author$project$Syntax$holeIDStart, upRes.henv);
			var expr_ = _v2.a;
			var henv_ = _v2.c;
			var newCode = $author$project$LangUtils$printAST(expr_);
			return _Utils_Tuple2(henv_, newCode);
		}
	}
};
var $author$project$LangUtils$findHole = F2(
	function (u, context) {
		findHole:
		while (true) {
			if (context.b && (context.a.$ === 'IndexedHole')) {
				var _v1 = context.a;
				var hn = _v1.a;
				var venv = _v1.b;
				var ct = context.b;
				if (_Utils_eq(hn, u)) {
					return $elm$core$Maybe$Just(
						A2($author$project$Syntax$IndexedHole, hn, venv));
				} else {
					var $temp$u = u,
						$temp$context = ct;
					u = $temp$u;
					context = $temp$context;
					continue findHole;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$UnEval$updateContextElem = F2(
	function (v, context) {
		if (v.$ === 'IndexedHole') {
			var hn = v.a;
			var venv = v.b;
			if (context.b && (context.a.$ === 'IndexedHole')) {
				var _v2 = context.a;
				var hn_ = _v2.a;
				var venv_ = _v2.b;
				var ct = context.b;
				return _Utils_eq(hn_, hn) ? A2(
					$elm$core$List$cons,
					A2($author$project$Syntax$IndexedHole, hn, venv),
					ct) : A2(
					$elm$core$List$cons,
					A2($author$project$Syntax$IndexedHole, hn_, venv_),
					A2($author$project$UnEval$updateContextElem, v, ct));
			} else {
				return _List_Nil;
			}
		} else {
			return _List_Nil;
		}
	});
var $author$project$UnEval$updateNthElm = F3(
	function (n, v, venv) {
		if (!n) {
			if (venv.b) {
				var _v2 = venv.a;
				var id = _v2.a;
				var s = _v2.b;
				var venv_ = venv.b;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple3(id, s, v),
					venv_);
			} else {
				return _List_Nil;
			}
		} else {
			if (venv.b) {
				var val = venv.a;
				var venv_ = venv.b;
				return A2(
					$elm$core$List$cons,
					val,
					A3($author$project$UnEval$updateNthElm, n - 1, v, venv_));
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$UnEval$updateCurrentVenv = F4(
	function (n, val, path, venv) {
		if (path.b) {
			var _v1 = path.a;
			var m = _v1.b;
			var pt = path.b;
			var res = A2($author$project$Utils$nth, m, venv);
			if (res.$ === 'Just') {
				var _v3 = res.a;
				var v = _v3.c;
				if (v.$ === 'IndexedHole') {
					var h1 = v.a;
					var venv1 = v.b;
					var venv2 = A4($author$project$UnEval$updateCurrentVenv, n, val, pt, venv1);
					return A3(
						$author$project$UnEval$updateNthElm,
						m,
						A2($author$project$Syntax$IndexedHole, h1, venv2),
						venv);
				} else {
					return _List_Nil;
				}
			} else {
				return _List_Nil;
			}
		} else {
			return A3($author$project$UnEval$updateNthElm, n, val, venv);
		}
	});
var $author$project$UnEval$updateValue = F3(
	function (index, val, model) {
		var ccHoleName = model.currentContext;
		var res = A2($author$project$LangUtils$findHole, ccHoleName, model.context);
		if ((res.$ === 'Just') && (res.a.$ === 'IndexedHole')) {
			var _v1 = res.a;
			var hn = _v1.a;
			var venv = _v1.b;
			var newVenv = A4($author$project$UnEval$updateCurrentVenv, index, val, model.path, venv);
			var newCurrent = A2($author$project$Syntax$IndexedHole, hn, newVenv);
			return A2($author$project$UnEval$updateContextElem, newCurrent, model.context);
		} else {
			return _List_Nil;
		}
	});
var $author$project$UnEval$updateContext = F3(
	function (index, newVal, model) {
		var res1 = A2($author$project$Parser_$parseVal, newVal, _List_Nil);
		if (res1.$ === 'Ok') {
			var val = res1.a;
			return A3($author$project$UnEval$updateValue, index, val, model);
		} else {
			if (A2($elm$core$String$left, 1, newVal) === '<') {
				var res2 = A2($author$project$HtmlParser$parseHtml, newVal, _List_Nil);
				if (res2.$ === 'VError') {
					return _List_Nil;
				} else {
					var val = res2;
					return A3($author$project$UnEval$updateValue, index, val, model);
				}
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SaveCode':
				var newCode = msg.a;
				var newModel = A2($author$project$Controller$evalCodeToModel, newCode, model.holeBindings);
				var cmd = _Utils_eq(newModel.mode, $author$project$Model$HTML) ? $author$project$Main$sendOutput(newModel.output) : $author$project$Main$setConsoleVisible(newModel.output);
				return _Utils_Tuple2(newModel, cmd);
			case 'OutputChange':
				var newOutput = msg.a;
				var _v1 = (_Utils_eq(model.mode, $author$project$Model$Console) && (A2($elm$core$String$left, 9, newOutput) === '<textarea')) ? _Utils_Tuple3(model.output, false, $elm$core$Platform$Cmd$none) : _Utils_Tuple3(
					newOutput,
					true,
					$author$project$Main$setAceRed(_Utils_Tuple0));
				var nop = _v1.a;
				var flag = _v1.b;
				var cmd = _v1.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isOutputChange: flag, output: nop}),
					cmd);
			case 'ContextChange':
				var index = msg.a;
				var newVal = msg.b;
				var context = A3($author$project$UnEval$updateContext, index, newVal, model);
				if (!context.b) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								editContextItem: _Utils_Tuple2(index, newVal),
								isOutputChange: true
							}),
						$author$project$Main$setAceRed(_Utils_Tuple0));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								context: context,
								editContextItem: _Utils_Tuple2(-1, ''),
								isOutputChange: true
							}),
						$author$project$Main$setAceRed(_Utils_Tuple0));
				}
			case 'ChangeCurrentHole':
				var selected = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							currentContext: function () {
								var _v3 = $author$project$Parser_$parseHoleName(selected);
								if (_v3.$ === 'Ok') {
									var hn = _v3.a;
									return hn;
								} else {
									return $author$project$Syntax$HOri(-1);
								}
							}(),
							path: _List_Nil
						}),
					$elm$core$Platform$Cmd$none);
			case 'ChangePath':
				var _v4 = msg.a;
				var holename = _v4.a;
				var index = _v4.b;
				var varname = _v4.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							path: _Utils_ap(
								model.path,
								_List_fromArray(
									[
										_Utils_Tuple3(holename, index, varname)
									]))
						}),
					$elm$core$Platform$Cmd$none);
			case 'Preview':
				var _v5 = $author$project$UnEval$updateCode(model);
				var newHB = _v5.a;
				var newCode = _v5.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{code: newCode, holeBindings: newHB}),
					$author$project$Main$sendCode(
						_Utils_Tuple2(newCode, false)));
			case 'Update':
				var _v6 = $author$project$UnEval$updateCode(model);
				var newHB = _v6.a;
				var newCode = _v6.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{code: newCode, codeBackup: newCode, hbBackup: newHB, holeBindings: newHB, isOutputChange: false}),
					$author$project$Main$sendCode(
						_Utils_Tuple2(newCode, false)));
			case 'Revert':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{code: model.codeBackup, holeBindings: model.hbBackup}),
					$author$project$Main$sendCode(
						_Utils_Tuple2(model.codeBackup, model.isOutputChange)));
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{holeBindings: _List_Nil}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Model$ClearHB = {$: 'ClearHB'};
var $author$project$Model$Preview = {$: 'Preview'};
var $author$project$Model$Revert = {$: 'Revert'};
var $author$project$Model$Update = {$: 'Update'};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Model$ChangeCurrentHole = function (a) {
	return {$: 'ChangeCurrentHole', a: a};
};
var $author$project$View$changeSelectedHole = function (selected) {
	return $author$project$Model$ChangeCurrentHole(selected);
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$View$contextToOptions = function (context) {
	contextToOptions:
	while (true) {
		if (!context.b) {
			return _List_Nil;
		} else {
			if (context.a.$ === 'IndexedHole') {
				var _v1 = context.a;
				var hn = _v1.a;
				var ct = context.b;
				return A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$LangUtils$printHoleName(hn))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$LangUtils$printHoleName(hn))
							])),
					$author$project$View$contextToOptions(ct));
			} else {
				var ct = context.b;
				var $temp$context = ct;
				context = $temp$context;
				continue contextToOptions;
			}
		}
	}
};
var $author$project$Model$ChangePath = function (a) {
	return {$: 'ChangePath', a: a};
};
var $author$project$Model$ContextChange = F2(
	function (a, b) {
		return {$: 'ContextChange', a: a, b: b};
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $author$project$View$printEditItem = F3(
	function (n1, v1, _v0) {
		var n2 = _v0.a;
		var s2 = _v0.b;
		return (_Utils_eq(n2, -1) || (!_Utils_eq(n1, n2))) ? $author$project$LangUtils$print(v1).a : s2;
	});
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$View$displayContext = F2(
	function (model, holeContext) {
		displayContext:
		while (true) {
			if (!holeContext.b) {
				return _List_Nil;
			} else {
				var _v1 = holeContext.a;
				var n = _v1.a;
				var s = _v1.b;
				var v = _v1.c;
				var hc = holeContext.b;
				if (!_Utils_eq(s, $author$project$Syntax$caseN)) {
					switch (v.$) {
						case 'IndexedHole':
							var hn = v.a;
							return A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$tr,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick(
															$author$project$Model$ChangePath(
																_Utils_Tuple3(hn, n, s)))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(s + ' : ')
														])),
													A2(
													$elm$html$Html$input,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('context-item'),
															$elm$html$Html$Attributes$value(
															A3($author$project$View$printEditItem, n, v, model.editContextItem)),
															$elm$html$Html$Events$onInput(
															$author$project$Model$ContextChange(n))
														]),
													_List_Nil)
												]))
										])),
								A2($author$project$View$displayContext, model, hc));
						case 'VClosure':
							return A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$tr,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'cursor', 'default')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													s + (' : ' + $author$project$LangUtils$print(v).a))
												]))
										])),
								A2($author$project$View$displayContext, model, hc));
						case 'VFix':
							return A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$tr,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'cursor', 'default')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													s + (' : ' + $author$project$LangUtils$print(v).a))
												]))
										])),
								A2($author$project$View$displayContext, model, hc));
						default:
							return A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$tr,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'cursor', 'default')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(s + ' : '),
													A2(
													$elm$html$Html$input,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('context-item'),
															$elm$html$Html$Attributes$value(
															A3($author$project$View$printEditItem, n, v, model.editContextItem)),
															$elm$html$Html$Events$onInput(
															$author$project$Model$ContextChange(n))
														]),
													_List_Nil)
												]))
										])),
								A2($author$project$View$displayContext, model, hc));
					}
				} else {
					var $temp$model = model,
						$temp$holeContext = hc;
					model = $temp$model;
					holeContext = $temp$holeContext;
					continue displayContext;
				}
			}
		}
	});
var $author$project$View$findContextViaPath = F2(
	function (path, venv) {
		findContextViaPath:
		while (true) {
			if (path.b) {
				var _v1 = path.a;
				var m = _v1.b;
				var pt = path.b;
				var res = A2($author$project$Utils$nth, m, venv);
				if (res.$ === 'Just') {
					var _v3 = res.a;
					var val = _v3.c;
					if (val.$ === 'IndexedHole') {
						var venv1 = val.b;
						var $temp$path = pt,
							$temp$venv = venv1;
						path = $temp$path;
						venv = $temp$venv;
						continue findContextViaPath;
					} else {
						return _List_Nil;
					}
				} else {
					return _List_Nil;
				}
			} else {
				return venv;
			}
		}
	});
var $author$project$View$displayContextViaPath = function (model) {
	var res = A2($author$project$LangUtils$findHole, model.currentContext, model.context);
	if ((res.$ === 'Just') && (res.a.$ === 'IndexedHole')) {
		var _v1 = res.a;
		var venv = _v1.b;
		var holeContext = A2($author$project$View$findContextViaPath, model.path, venv);
		return A2($author$project$View$displayContext, model, holeContext);
	} else {
		return _List_Nil;
	}
};
var $author$project$View$displayHoleContext = function (venv) {
	displayHoleContext:
	while (true) {
		if (!venv.b) {
			return '';
		} else {
			if (!venv.b.b) {
				var _v1 = venv.a;
				var s = _v1.a;
				var v = _v1.b;
				return _Utils_eq(s, $author$project$Syntax$caseN) ? '' : (s + (': ' + $author$project$LangUtils$print(v).a));
			} else {
				var _v2 = venv.a;
				var s = _v2.a;
				var v = _v2.b;
				var vv = venv.b;
				if (_Utils_eq(s, $author$project$Syntax$caseN)) {
					var $temp$venv = vv;
					venv = $temp$venv;
					continue displayHoleContext;
				} else {
					return s + (': ' + ($author$project$LangUtils$print(v).a + (' , ' + $author$project$View$displayHoleContext(vv))));
				}
			}
		}
	}
};
var $author$project$View$displayHB = function (henv) {
	if (!henv.b) {
		return _List_Nil;
	} else {
		var _v1 = henv.a;
		var hn = _v1.a;
		var venv = _v1.b;
		var v = _v1.c;
		var hv = henv.b;
		return A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$tr,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$td,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('hole-name')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$LangUtils$printHoleName(hn))
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$View$displayHoleContext(venv))
							])),
						A2(
						$elm$html$Html$td,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('hole-value')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$LangUtils$print(v).a)
							]))
					])),
			$author$project$View$displayHB(hv));
	}
};
var $author$project$View$displayPath = function (path) {
	if (!path.b) {
		return '';
	} else {
		if (!path.b.b) {
			var _v1 = path.a;
			var hn = _v1.a;
			var index = _v1.b;
			var _var = _v1.c;
			return '{ ' + ($author$project$LangUtils$printHoleName(hn) + (' }' + (' · ' + (_var + (' (' + ($elm$core$Debug$toString(index) + ')'))))));
		} else {
			var _v2 = path.a;
			var hn = _v2.a;
			var index = _v2.b;
			var _var = _v2.c;
			var _v3 = path.b;
			var step = _v3.a;
			var pt = _v3.b;
			return '{ ' + ($author$project$LangUtils$printHoleName(hn) + (' }' + (' · ' + (_var + (' (' + ($elm$core$Debug$toString(index) + (') >> ' + $author$project$View$displayPath(
				A2($elm$core$List$cons, step, pt)))))))));
		}
	}
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $elm$html$Html$th = _VirtualDom_node('th');
var $author$project$View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('bi-preview')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('menu-bar')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Bidirectional Preview')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('run-program'),
								$elm$html$Html$Attributes$class('btn')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Eval')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn uneval'),
								$elm$html$Html$Events$onClick($author$project$Model$Preview)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Uneval and Preview')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn uneval'),
								$elm$html$Html$Events$onClick($author$project$Model$Update)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Uneval and Update')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn uneval'),
								$elm$html$Html$Events$onClick($author$project$Model$Revert)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Revert Code')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn uneval'),
								$elm$html$Html$Events$onClick($author$project$Model$ClearHB)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Clear Hole-Bindings')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('hole-bindings'),
						A2($elm$html$Html$Attributes$style, 'overflow-y', 'scroll')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('area-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('HOLE BINDINGS')
							])),
						A2(
						$elm$html$Html$table,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('hb-table')
							]),
						_Utils_ap(
							_List_fromArray(
								[
									A2(
									$elm$html$Html$th,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hole-name')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Hole Name')
										])),
									A2(
									$elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Context')
										])),
									A2(
									$elm$html$Html$th,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hole-value')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Value')
										]))
								]),
							$author$project$View$displayHB(model.holeBindings)))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('output')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('area-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('OUTPUT')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('output-area')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$textarea,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('console-output'),
										$elm$html$Html$Events$onInput($author$project$Model$OutputChange)
									]),
								_List_Nil)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('context'),
						A2($elm$html$Html$Attributes$style, 'overflow-y', 'scroll')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('area-title'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'default'),
								$elm$html$Html$Events$onClick(
								$author$project$View$changeSelectedHole(
									$author$project$LangUtils$printHoleName(model.currentContext)))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('CONTEXT'),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('select-hole'),
										$elm$html$Html$Events$onInput($author$project$View$changeSelectedHole)
									]),
								$author$project$View$contextToOptions(model.context))
							])),
						A2(
						$elm$html$Html$table,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('hb-table')
							]),
						$author$project$View$displayContextViaPath(model))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('path')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('area-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('WHICH IS THE OUTPUT')
							])),
						$elm$html$Html$text(
						$author$project$View$displayPath(model.path))
					]))
			]));
};
var $author$project$Main$view = $author$project$View$view;
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));