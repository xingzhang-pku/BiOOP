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
var $author$project$OOP$Syntax$VError = function (a) {
	return {$: 'VError', a: a};
};
var $author$project$OOP$Model$initModel = {
	classTable: _Utils_Tuple2(_List_Nil, _List_Nil),
	code: '',
	codeBackup: '',
	envDict: _List_Nil,
	htmlOutput: '',
	isConsistent: true,
	isOnlyObjects: true,
	isShowTemp: true,
	objectsOutput: $author$project$OOP$Syntax$VError(''),
	state: _List_Nil,
	templates: _List_Nil
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$OOP$Main$init = function (_v0) {
	return _Utils_Tuple2($author$project$OOP$Model$initModel, $elm$core$Platform$Cmd$none);
};
var $author$project$OOP$Model$AddAfterObject = function (a) {
	return {$: 'AddAfterObject', a: a};
};
var $author$project$OOP$Model$AddAtBegin = function (a) {
	return {$: 'AddAtBegin', a: a};
};
var $author$project$OOP$Model$DeleteObject = function (a) {
	return {$: 'DeleteObject', a: a};
};
var $author$project$OOP$Model$FindModifiableClassList = function (a) {
	return {$: 'FindModifiableClassList', a: a};
};
var $author$project$OOP$Model$ModifyClass = function (a) {
	return {$: 'ModifyClass', a: a};
};
var $author$project$OOP$Model$OutputChange = function (a) {
	return {$: 'OutputChange', a: a};
};
var $author$project$OOP$Model$SaveCode = function (a) {
	return {$: 'SaveCode', a: a};
};
var $author$project$OOP$Model$SaveTemplates = function (a) {
	return {$: 'SaveTemplates', a: a};
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$OOP$Main$askAddObjectAfterObject = _Platform_incomingPort('askAddObjectAfterObject', $elm$json$Json$Decode$int);
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$OOP$Main$askAddObjectAtBegin = _Platform_incomingPort('askAddObjectAtBegin', $elm$json$Json$Decode$string);
var $author$project$OOP$Main$askCode = _Platform_incomingPort('askCode', $elm$json$Json$Decode$string);
var $author$project$OOP$Main$askDeleteObject = _Platform_incomingPort('askDeleteObject', $elm$json$Json$Decode$int);
var $author$project$OOP$Main$askModifiableClassList = _Platform_incomingPort('askModifiableClassList', $elm$json$Json$Decode$string);
var $author$project$OOP$Main$askModifyClass = _Platform_incomingPort('askModifyClass', $elm$json$Json$Decode$string);
var $author$project$OOP$Main$askOutput = _Platform_incomingPort('askOutput', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$OOP$Main$askTemplatesSave = _Platform_incomingPort(
	'askTemplatesSave',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string));
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$OOP$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$OOP$Main$askCode($author$project$OOP$Model$SaveCode),
				$author$project$OOP$Main$askOutput($author$project$OOP$Model$OutputChange),
				$author$project$OOP$Main$askModifyClass($author$project$OOP$Model$ModifyClass),
				$author$project$OOP$Main$askDeleteObject($author$project$OOP$Model$DeleteObject),
				$author$project$OOP$Main$askAddObjectAfterObject($author$project$OOP$Model$AddAfterObject),
				$author$project$OOP$Main$askAddObjectAtBegin($author$project$OOP$Model$AddAtBegin),
				$author$project$OOP$Main$askModifiableClassList($author$project$OOP$Model$FindModifiableClassList),
				$author$project$OOP$Main$askTemplatesSave($author$project$OOP$Model$SaveTemplates)
			]));
};
var $author$project$OOP$Syntax$VCons = F2(
	function (a, b) {
		return {$: 'VCons', a: a, b: b};
	});
var $author$project$OOP$Syntax$VLoc = function (a) {
	return {$: 'VLoc', a: a};
};
var $author$project$OOP$Syntax$VNew = F2(
	function (a, b) {
		return {$: 'VNew', a: a, b: b};
	});
var $author$project$OOP$Syntax$VNil = {$: 'VNil'};
var $author$project$OOP$Syntax$VString = function (a) {
	return {$: 'VString', a: a};
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
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
var $author$project$OOP$Utils$replace = F3(
	function (n, v, ls) {
		if (!ls.b) {
			return _List_Nil;
		} else {
			var x = ls.a;
			var xs = ls.b;
			return (!n) ? A2($elm$core$List$cons, v, xs) : A2(
				$elm$core$List$cons,
				x,
				A3($author$project$OOP$Utils$replace, n - 1, v, xs));
		}
	});
var $author$project$OOP$Objects$Update$addObjectAfterObject = F4(
	function (objects, iter, id, state) {
		switch (objects.$) {
			case 'VNew':
				var c = objects.a;
				var args = objects.b;
				var _v5 = A4($author$project$OOP$Objects$Update$addObjectAfterObject, args, iter + 1, id, state);
				var _v6 = _v5.a;
				var flag = _v6.a;
				var args_ = _v6.b;
				var iter_ = _v6.c;
				var state_ = _v5.b;
				return _Utils_Tuple2(
					_Utils_Tuple3(
						flag,
						A2($author$project$OOP$Syntax$VNew, c, args_),
						iter_),
					state_);
			case 'VCons':
				var v1 = objects.a;
				var v2 = objects.b;
				if (v1.$ === 'VNew') {
					return _Utils_eq(iter, id) ? _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							A2(
								$author$project$OOP$Syntax$VCons,
								v1,
								A2($author$project$OOP$Syntax$VCons, v1, v2)),
							-1),
						state) : A5($author$project$OOP$Objects$Update$twoAddingBranchMerge, v1, v2, iter, id, state);
				} else {
					return A5($author$project$OOP$Objects$Update$twoAddingBranchMerge, v1, v2, iter, id, state);
				}
			case 'VLoc':
				var n = objects.a;
				var res = A2($author$project$Utils$nth, n, state);
				if (res.$ === 'Just') {
					var val = res.a;
					var _v9 = A4($author$project$OOP$Objects$Update$addObjectAfterObject, val, iter, id, state);
					var _v10 = _v9.a;
					var flag = _v10.a;
					var val_ = _v10.b;
					var iter_ = _v10.c;
					var state_ = _v9.b;
					return flag ? _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							$author$project$OOP$Syntax$VLoc(n),
							-1),
						A3($author$project$OOP$Utils$replace, n, val_, state_)) : _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							$author$project$OOP$Syntax$VLoc(n),
							iter_),
						state_);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							$author$project$OOP$Syntax$VError('No Such Variable : 08.'),
							iter),
						state);
				}
			case 'VNil':
				return _Utils_Tuple2(
					_Utils_Tuple3(false, $author$project$OOP$Syntax$VNil, iter),
					state);
			case 'VString':
				var s = objects.a;
				return _Utils_Tuple2(
					_Utils_Tuple3(
						false,
						$author$project$OOP$Syntax$VString(s),
						iter),
					state);
			default:
				return _Utils_Tuple2(
					_Utils_Tuple3(
						false,
						$author$project$OOP$Syntax$VError('Not Within the Scope of Operation of Adding Object : 01.'),
						-1),
					state);
		}
	});
var $author$project$OOP$Objects$Update$twoAddingBranchMerge = F5(
	function (v1, v2, iter, id, state) {
		var _v0 = A4($author$project$OOP$Objects$Update$addObjectAfterObject, v1, iter, id, state);
		var _v1 = _v0.a;
		var flag1 = _v1.a;
		var v1_ = _v1.b;
		var iter1 = _v1.c;
		var state1 = _v0.b;
		if (flag1) {
			return _Utils_Tuple2(
				_Utils_Tuple3(
					true,
					A2($author$project$OOP$Syntax$VCons, v1_, v2),
					-1),
				state1);
		} else {
			var _v2 = A4($author$project$OOP$Objects$Update$addObjectAfterObject, v2, iter1, id, state1);
			var _v3 = _v2.a;
			var flag2 = _v3.a;
			var v2_ = _v3.b;
			var iter2 = _v3.c;
			var state2 = _v2.b;
			return flag2 ? _Utils_Tuple2(
				_Utils_Tuple3(
					true,
					A2($author$project$OOP$Syntax$VCons, v1, v2_),
					-1),
				state2) : _Utils_Tuple2(
				_Utils_Tuple3(
					false,
					A2($author$project$OOP$Syntax$VCons, v1, v2),
					iter2),
				state2);
		}
	});
var $author$project$OOP$Syntax$VHtml = F4(
	function (a, b, c, d) {
		return {$: 'VHtml', a: a, b: b, c: c, d: d};
	});
var $author$project$OOP$LangUtils$appendValueString = F2(
	function (l1, l2) {
		var _v0 = _Utils_Tuple2(l1, l2);
		if ((_v0.a.$ === 'VString') && (_v0.b.$ === 'VString')) {
			var s1 = _v0.a.a;
			var s2 = _v0.b.a;
			return $author$project$OOP$Syntax$VString(
				_Utils_ap(s1, s2));
		} else {
			return $author$project$OOP$Syntax$VError('Error : 777.');
		}
	});
var $author$project$OOP$Objects$O2HTranslator$addListClass = function (attr) {
	if ((((((attr.$ === 'VCons') && (attr.b.$ === 'VCons')) && (attr.b.a.$ === 'VCons')) && (attr.b.a.b.$ === 'VCons')) && (attr.b.a.b.b.$ === 'VNil')) && (attr.b.b.$ === 'VNil')) {
		var id = attr.a;
		var _v1 = attr.b;
		var _v2 = _v1.a;
		var _class = _v2.a;
		var _v3 = _v2.b;
		var val = _v3.a;
		var _v4 = _v3.b;
		var _v5 = _v1.b;
		return A2(
			$author$project$OOP$Syntax$VCons,
			id,
			A2(
				$author$project$OOP$Syntax$VCons,
				A2(
					$author$project$OOP$Syntax$VCons,
					_class,
					A2(
						$author$project$OOP$Syntax$VCons,
						A2(
							$author$project$OOP$LangUtils$appendValueString,
							val,
							$author$project$OOP$Syntax$VString(' Add')),
						$author$project$OOP$Syntax$VNil)),
				$author$project$OOP$Syntax$VNil));
	} else {
		return $author$project$OOP$Syntax$VError('Error : 19.');
	}
};
var $author$project$OOP$Objects$O2HTranslator$addListTag = function (object) {
	if (object.$ === 'VHtml') {
		var s = object.a;
		var style = object.b;
		var otherAttr = object.c;
		var childs = object.d;
		return A4(
			$author$project$OOP$Syntax$VHtml,
			s,
			style,
			$author$project$OOP$Objects$O2HTranslator$addListClass(otherAttr),
			childs);
	} else {
		return $author$project$OOP$Syntax$VError('Only add tags for HTML : 02.');
	}
};
var $author$project$OOP$Parser$Value$valueListToVCons = function (ls) {
	if (!ls.b) {
		return $author$project$OOP$Syntax$VNil;
	} else {
		var v = ls.a;
		var vs = ls.b;
		return A2(
			$author$project$OOP$Syntax$VCons,
			v,
			$author$project$OOP$Parser$Value$valueListToVCons(vs));
	}
};
var $author$project$OOP$Objects$O2HTranslator$addObjectID = F2(
	function (id, object) {
		return A4(
			$author$project$OOP$Syntax$VHtml,
			'div',
			$author$project$OOP$Syntax$VNil,
			$author$project$OOP$Parser$Value$valueListToVCons(
				_List_fromArray(
					[
						$author$project$OOP$Parser$Value$valueListToVCons(
						_List_fromArray(
							[
								$author$project$OOP$Syntax$VString('id'),
								$author$project$OOP$Syntax$VString(id)
							])),
						$author$project$OOP$Parser$Value$valueListToVCons(
						_List_fromArray(
							[
								$author$project$OOP$Syntax$VString('class'),
								$author$project$OOP$Syntax$VString('Object')
							]))
					])),
			A2($author$project$OOP$Syntax$VCons, object, $author$project$OOP$Syntax$VNil));
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$OOP$Objects$Templates$findTemplateByClass = F2(
	function (_class, temps) {
		findTemplateByClass:
		while (true) {
			if (temps.b) {
				var temp = temps.a;
				var rest = temps.b;
				if (_Utils_eq(temp._class, _class)) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(temp.oPat, temp.hPat));
				} else {
					var $temp$class = _class,
						$temp$temps = rest;
					_class = $temp$class;
					temps = $temp$temps;
					continue findTemplateByClass;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$OOP$Syntax$VChar = function (a) {
	return {$: 'VChar', a: a};
};
var $author$project$OOP$Syntax$TEmpList = function (a) {
	return {$: 'TEmpList', a: a};
};
var $author$project$OOP$Syntax$TError = function (a) {
	return {$: 'TError', a: a};
};
var $author$project$OOP$Syntax$TList = F3(
	function (a, b, c) {
		return {$: 'TList', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$TString = F2(
	function (a, b) {
		return {$: 'TString', a: a, b: b};
	});
var $author$project$OOP$LangUtils$appendTermString = F2(
	function (l1, l2) {
		var _v0 = _Utils_Tuple2(l1, l2);
		if ((_v0.a.$ === 'TString') && (_v0.b.$ === 'TString')) {
			var _v1 = _v0.a;
			var ws = _v1.a;
			var s1 = _v1.b;
			var _v2 = _v0.b;
			var s2 = _v2.b;
			return A2(
				$author$project$OOP$Syntax$TString,
				ws,
				_Utils_ap(s1, s2));
		} else {
			return $author$project$OOP$Syntax$TError('Error : 666.');
		}
	});
var $elm$core$Debug$toString = _Debug_toString;
var $author$project$OOP$Objects$O2HTranslator$extentListIDObjectID = F2(
	function (attr, id) {
		if (((((attr.$ === 'TList') && (attr.b.$ === 'TList')) && (attr.b.c.$ === 'TList')) && (attr.b.c.c.$ === 'TEmpList')) && (attr.c.$ === 'TEmpList')) {
			var ws1 = attr.a;
			var _v1 = attr.b;
			var ws2 = _v1.a;
			var t1 = _v1.b;
			var _v2 = _v1.c;
			var ws3 = _v2.a;
			var t2 = _v2.b;
			var ws4 = _v2.c.a;
			var ws5 = attr.c.a;
			var t2_ = A2(
				$author$project$OOP$LangUtils$appendTermString,
				t2,
				A2(
					$author$project$OOP$Syntax$TString,
					_List_Nil,
					'-' + $elm$core$Debug$toString(id)));
			return A3(
				$author$project$OOP$Syntax$TList,
				ws1,
				A3(
					$author$project$OOP$Syntax$TList,
					ws2,
					t1,
					A3(
						$author$project$OOP$Syntax$TList,
						ws3,
						t2_,
						$author$project$OOP$Syntax$TEmpList(ws4))),
				A3(
					$author$project$OOP$Syntax$TList,
					_List_Nil,
					A3(
						$author$project$OOP$Syntax$TList,
						_List_Nil,
						A2($author$project$OOP$Syntax$TString, _List_Nil, 'class'),
						A3(
							$author$project$OOP$Syntax$TList,
							_List_Nil,
							A2($author$project$OOP$Syntax$TString, _List_Nil, 'Add'),
							$author$project$OOP$Syntax$TEmpList(_List_Nil))),
					$author$project$OOP$Syntax$TEmpList(ws5)));
		} else {
			return $author$project$OOP$Syntax$TError('Error : 22.');
		}
	});
var $author$project$OOP$Utils$findByName = F2(
	function (s, ls) {
		findByName:
		while (true) {
			if (!ls.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v1 = ls.a;
				var s1 = _v1.a;
				var v1 = _v1.b;
				var ls_ = ls.b;
				if (_Utils_eq(s1, s)) {
					return $elm$core$Maybe$Just(v1);
				} else {
					var $temp$s = s,
						$temp$ls = ls_;
					s = $temp$s;
					ls = $temp$ls;
					continue findByName;
				}
			}
		}
	});
var $author$project$OOP$Objects$O2HTranslator$htmlSubst = F3(
	function (env, hp, id) {
		_v0$9:
		while (true) {
			switch (hp.$) {
				case 'THtml':
					var s = hp.b;
					var style = hp.c;
					var otherAttr = hp.d;
					var childs = hp.e;
					var res3 = A3($author$project$OOP$Objects$O2HTranslator$htmlSubst, env, childs, id);
					var res1 = A3($author$project$OOP$Objects$O2HTranslator$htmlSubst, env, style, id);
					var _v1 = function () {
						if (s === 'objectlist') {
							var otherAttr_ = A2($author$project$OOP$Objects$O2HTranslator$extentListIDObjectID, otherAttr, id);
							return _Utils_Tuple2(
								'div',
								A3($author$project$OOP$Objects$O2HTranslator$htmlSubst, env, otherAttr_, id));
						} else {
							return _Utils_Tuple2(
								s,
								A3($author$project$OOP$Objects$O2HTranslator$htmlSubst, env, otherAttr, id));
						}
					}();
					var s_ = _v1.a;
					var res2 = _v1.b;
					return A4($author$project$OOP$Syntax$VHtml, s_, res1, res2, res3);
				case 'TVar':
					var s = hp.b;
					var _v3 = A2($author$project$OOP$Utils$findByName, s, env);
					if (_v3.$ === 'Just') {
						var v = _v3.a;
						return v;
					} else {
						return $author$project$OOP$Syntax$VError('HTML Substitution Error : No Such Variable.');
					}
				case 'TChar':
					var c = hp.b;
					return $author$project$OOP$Syntax$VChar(c);
				case 'TBPrim':
					if (hp.b.$ === 'Cat') {
						var _v4 = hp.b;
						var t1 = hp.c;
						var t2 = hp.d;
						var _v5 = A4($author$project$OOP$Objects$O2HTranslator$twoSubstMerge, env, t1, t2, id);
						var res1 = _v5.a;
						var res2 = _v5.b;
						return A2($author$project$OOP$LangUtils$appendValueString, res1, res2);
					} else {
						break _v0$9;
					}
				case 'TCons':
					var t1 = hp.b;
					var t2 = hp.c;
					var _v6 = A4($author$project$OOP$Objects$O2HTranslator$twoSubstMerge, env, t1, t2, id);
					var res1 = _v6.a;
					var res2 = _v6.b;
					return A2($author$project$OOP$Syntax$VCons, res1, res2);
				case 'TList':
					var t1 = hp.b;
					var t2 = hp.c;
					var _v7 = A4($author$project$OOP$Objects$O2HTranslator$twoSubstMerge, env, t1, t2, id);
					var res1 = _v7.a;
					var res2 = _v7.b;
					return A2($author$project$OOP$Syntax$VCons, res1, res2);
				case 'TString':
					var s = hp.b;
					return $author$project$OOP$Syntax$VString(s);
				case 'TNil':
					return $author$project$OOP$Syntax$VNil;
				case 'TEmpList':
					return $author$project$OOP$Syntax$VNil;
				default:
					break _v0$9;
			}
		}
		return $author$project$OOP$Syntax$VError('Template uses disallowed syntax : 01.');
	});
var $author$project$OOP$Objects$O2HTranslator$twoSubstMerge = F4(
	function (env, t1, t2, id) {
		return _Utils_Tuple2(
			A3($author$project$OOP$Objects$O2HTranslator$htmlSubst, env, t1, id),
			A3($author$project$OOP$Objects$O2HTranslator$htmlSubst, env, t2, id));
	});
var $elm$core$Debug$log = _Debug_log;
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
var $author$project$OOP$Syntax$BSin = F3(
	function (a, b, c) {
		return {$: 'BSin', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $author$project$OOP$Syntax$TApp = F3(
	function (a, b, c) {
		return {$: 'TApp', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$TDeRef = F2(
	function (a, b) {
		return {$: 'TDeRef', a: a, b: b};
	});
var $author$project$OOP$Syntax$THtml = F5(
	function (a, b, c, d, e) {
		return {$: 'THtml', a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$OOP$Syntax$TLam = F3(
	function (a, b, c) {
		return {$: 'TLam', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$TLet = F4(
	function (a, b, c, d) {
		return {$: 'TLet', a: a, b: b, c: c, d: d};
	});
var $author$project$OOP$Syntax$TLetrec = F4(
	function (a, b, c, d) {
		return {$: 'TLetrec', a: a, b: b, c: c, d: d};
	});
var $author$project$OOP$Syntax$TMap = F4(
	function (a, b, c, d) {
		return {$: 'TMap', a: a, b: b, c: c, d: d};
	});
var $author$project$OOP$Syntax$TNew = F3(
	function (a, b, c) {
		return {$: 'TNew', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$TParens = F2(
	function (a, b) {
		return {$: 'TParens', a: a, b: b};
	});
var $author$project$OOP$Syntax$TRef = F2(
	function (a, b) {
		return {$: 'TRef', a: a, b: b};
	});
var $author$project$OOP$Syntax$TToStr = F2(
	function (a, b) {
		return {$: 'TToStr', a: a, b: b};
	});
var $author$project$OOP$Syntax$TTuple2 = F3(
	function (a, b, c) {
		return {$: 'TTuple2', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$TTuple3 = F4(
	function (a, b, c, d) {
		return {$: 'TTuple3', a: a, b: b, c: c, d: d};
	});
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
var $author$project$OOP$Syntax$BCom = F3(
	function (a, b, c) {
		return {$: 'BCom', a: a, b: b, c: c};
	});
var $Punie$elm_parser_extras$Parser$Expression$Infix = F2(
	function (a, b) {
		return {$: 'Infix', a: a, b: b};
	});
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
var $author$project$OOP$Parser$WhiteSpaces$isWhiteSpace = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr(' ')) || (_Utils_eq(
		c,
		_Utils_chr('\n')) || _Utils_eq(
		c,
		_Utils_chr('\r')));
};
var $author$project$OOP$Parser$WhiteSpaces$mspaces = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompWhile($author$project$OOP$Parser$WhiteSpaces$isWhiteSpace));
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
var $author$project$OOP$Parser$Term$branchOp = _List_fromArray(
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
						function (spc) {
							return $author$project$OOP$Syntax$BCom(
								_List_fromArray(
									[spc]));
						}),
					$elm$parser$Parser$symbol('|')),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
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
var $author$project$OOP$Syntax$PVar = F2(
	function (a, b) {
		return {$: 'PVar', a: a, b: b};
	});
var $author$project$OOP$Syntax$TCase = F3(
	function (a, b, c) {
		return {$: 'TCase', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$TVar = F2(
	function (a, b) {
		return {$: 'TVar', a: a, b: b};
	});
var $author$project$OOP$Syntax$guardName = '$CASE$';
var $author$project$OOP$Parser$Term$caseToApp = F3(
	function (t, b, ws) {
		return A3(
			$author$project$OOP$Syntax$TApp,
			ws,
			A3(
				$author$project$OOP$Syntax$TLam,
				_List_Nil,
				A2($author$project$OOP$Syntax$PVar, _List_Nil, $author$project$OOP$Syntax$guardName),
				A3(
					$author$project$OOP$Syntax$TCase,
					_List_Nil,
					A2($author$project$OOP$Syntax$TVar, _List_Nil, $author$project$OOP$Syntax$guardName),
					b)),
			t);
	});
var $author$project$OOP$Syntax$TChar = F2(
	function (a, b) {
		return {$: 'TChar', a: a, b: b};
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$OOP$Parser$Utils$charhelper = function (s) {
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
var $author$project$OOP$Parser$Utils$char_ = A2(
	$elm$parser$Parser$map,
	$author$project$OOP$Parser$Utils$charhelper,
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompIf(
			function (_v0) {
				return true;
			})));
var $author$project$OOP$Parser$Term$char = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (c, spc) {
						return A2(
							$author$project$OOP$Syntax$TChar,
							_List_fromArray(
								[spc]),
							c);
					})),
			$elm$parser$Parser$symbol('\'')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$Utils$char_,
			$elm$parser$Parser$symbol('\''))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$Term$empList = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (spc1, spc2) {
						return $author$project$OOP$Syntax$TEmpList(
							_List_fromArray(
								[spc1, spc2]));
					})),
			$elm$parser$Parser$symbol('[')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$WhiteSpaces$mspaces,
			$elm$parser$Parser$symbol(']'))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$Term$exprListToTList = function (ls) {
	if (!ls.b) {
		return $author$project$OOP$Syntax$TEmpList(_List_Nil);
	} else {
		var _v1 = ls.a;
		var t = _v1.a;
		var ws = _v1.b;
		var ts = ls.b;
		return A3(
			$author$project$OOP$Syntax$TList,
			ws,
			t,
			$author$project$OOP$Parser$Term$exprListToTList(ts));
	}
};
var $author$project$OOP$Syntax$TFalse = function (a) {
	return {$: 'TFalse', a: a};
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
var $author$project$OOP$Parser$Term$false = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$TFalse(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('false')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$Term$flip = F3(
	function (f, x, y) {
		return A2(f, y, x);
	});
var $author$project$OOP$Syntax$TFloat = F2(
	function (a, b) {
		return {$: 'TFloat', a: a, b: b};
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
var $elm$core$String$toFloat = _String_toFloat;
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
var $author$project$OOP$Parser$Term$float_ = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (n, spc) {
					return A2(
						$author$project$OOP$Syntax$TFloat,
						_List_fromArray(
							[spc]),
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
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$TInt = F2(
	function (a, b) {
		return {$: 'TInt', a: a, b: b};
	});
var $author$project$OOP$Parser$Term$int_ = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (n, spc) {
					return A2(
						$author$project$OOP$Syntax$TInt,
						_List_fromArray(
							[spc]),
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
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$PFalse = function (a) {
	return {$: 'PFalse', a: a};
};
var $author$project$OOP$Syntax$PTrue = function (a) {
	return {$: 'PTrue', a: a};
};
var $author$project$OOP$Parser$Term$iteToApp = F4(
	function (t1, t2, t3, ws) {
		return A3(
			$author$project$OOP$Syntax$TApp,
			ws,
			A3(
				$author$project$OOP$Syntax$TLam,
				_List_Nil,
				A2($author$project$OOP$Syntax$PVar, _List_Nil, $author$project$OOP$Syntax$guardName),
				A3(
					$author$project$OOP$Syntax$TCase,
					_List_Nil,
					A2($author$project$OOP$Syntax$TVar, _List_Nil, $author$project$OOP$Syntax$guardName),
					A3(
						$author$project$OOP$Syntax$BCom,
						_List_Nil,
						A3(
							$author$project$OOP$Syntax$BSin,
							_List_Nil,
							$author$project$OOP$Syntax$PTrue(_List_Nil),
							t2),
						A3(
							$author$project$OOP$Syntax$BSin,
							_List_Nil,
							$author$project$OOP$Syntax$PFalse(_List_Nil),
							t3)))),
			t1);
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
var $author$project$OOP$Syntax$TNil = function (a) {
	return {$: 'TNil', a: a};
};
var $author$project$OOP$Parser$Term$nil = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$TNil(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$symbol('nil')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$Add = {$: 'Add'};
var $author$project$OOP$Syntax$And = {$: 'And'};
var $Punie$elm_parser_extras$Parser$Expression$AssocLeft = {$: 'AssocLeft'};
var $Punie$elm_parser_extras$Parser$Expression$AssocNone = {$: 'AssocNone'};
var $author$project$OOP$Syntax$Cat = {$: 'Cat'};
var $author$project$OOP$Syntax$Div = {$: 'Div'};
var $author$project$OOP$Syntax$Eq = {$: 'Eq'};
var $author$project$OOP$Syntax$Ge = {$: 'Ge'};
var $author$project$OOP$Syntax$Gt = {$: 'Gt'};
var $author$project$OOP$Syntax$Le = {$: 'Le'};
var $author$project$OOP$Syntax$Lt = {$: 'Lt'};
var $author$project$OOP$Syntax$Mul = {$: 'Mul'};
var $author$project$OOP$Syntax$Neg = {$: 'Neg'};
var $author$project$OOP$Syntax$Not = {$: 'Not'};
var $author$project$OOP$Syntax$Or = {$: 'Or'};
var $Punie$elm_parser_extras$Parser$Expression$Prefix = function (a) {
	return {$: 'Prefix', a: a};
};
var $author$project$OOP$Syntax$RDiv = {$: 'RDiv'};
var $author$project$OOP$Syntax$Sub = {$: 'Sub'};
var $author$project$OOP$Syntax$TAssign = F3(
	function (a, b, c) {
		return {$: 'TAssign', a: a, b: b, c: c};
	});
var $author$project$OOP$Parser$Term$assign = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$TAssign(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$symbol(':=')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$TBPrim = F4(
	function (a, b, c, d) {
		return {$: 'TBPrim', a: a, b: b, c: c, d: d};
	});
var $author$project$OOP$Parser$Term$bopParser = F2(
	function (s, op) {
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (spc) {
						return A2(
							$author$project$OOP$Syntax$TBPrim,
							_List_fromArray(
								[spc]),
							op);
					}),
				$elm$parser$Parser$symbol(s)),
			$author$project$OOP$Parser$WhiteSpaces$mspaces);
	});
var $author$project$OOP$Syntax$TCons = F3(
	function (a, b, c) {
		return {$: 'TCons', a: a, b: b, c: c};
	});
var $author$project$OOP$Parser$Term$cons = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$TCons(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$symbol('::')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$TField = F3(
	function (a, b, c) {
		return {$: 'TField', a: a, b: b, c: c};
	});
var $author$project$OOP$Parser$Term$field = A2(
	$elm$parser$Parser$ignorer,
	$elm$parser$Parser$succeed(
		$author$project$OOP$Syntax$TField(_List_Nil)),
	$elm$parser$Parser$symbol('.'));
var $author$project$OOP$Syntax$TInvk = F3(
	function (a, b, c) {
		return {$: 'TInvk', a: a, b: b, c: c};
	});
var $author$project$OOP$Parser$Term$invk = A2(
	$elm$parser$Parser$ignorer,
	$elm$parser$Parser$succeed(
		$author$project$OOP$Syntax$TInvk(_List_Nil)),
	$elm$parser$Parser$symbol('->'));
var $author$project$OOP$Syntax$TSeq = F3(
	function (a, b, c) {
		return {$: 'TSeq', a: a, b: b, c: c};
	});
var $author$project$OOP$Parser$Term$seq = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$TSeq(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$symbol(';')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$TUPrim = F3(
	function (a, b, c) {
		return {$: 'TUPrim', a: a, b: b, c: c};
	});
var $author$project$OOP$Parser$Term$uopParser = F2(
	function (s, op) {
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (spc) {
						return A2(
							$author$project$OOP$Syntax$TUPrim,
							_List_fromArray(
								[spc]),
							op);
					}),
				$elm$parser$Parser$symbol(s)),
			$author$project$OOP$Parser$WhiteSpaces$mspaces);
	});
var $author$project$OOP$Parser$Term$operators = _List_fromArray(
	[
		_List_fromArray(
		[
			$Punie$elm_parser_extras$Parser$Expression$Prefix(
			A2($author$project$OOP$Parser$Term$uopParser, '-', $author$project$OOP$Syntax$Neg))
		]),
		_List_fromArray(
		[
			$Punie$elm_parser_extras$Parser$Expression$Prefix(
			A2($author$project$OOP$Parser$Term$uopParser, '~', $author$project$OOP$Syntax$Not))
		]),
		_List_fromArray(
		[
			A2($Punie$elm_parser_extras$Parser$Expression$Infix, $author$project$OOP$Parser$Term$cons, $Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2($Punie$elm_parser_extras$Parser$Expression$Infix, $author$project$OOP$Parser$Term$field, $Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2($Punie$elm_parser_extras$Parser$Expression$Infix, $author$project$OOP$Parser$Term$invk, $Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$OOP$Parser$Term$bopParser, '*', $author$project$OOP$Syntax$Mul),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$OOP$Parser$Term$bopParser, '//', $author$project$OOP$Syntax$RDiv),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$OOP$Parser$Term$bopParser, '+', $author$project$OOP$Syntax$Add)),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$OOP$Parser$Term$bopParser, '-', $author$project$OOP$Syntax$Sub),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$OOP$Parser$Term$bopParser, '/', $author$project$OOP$Syntax$Div)),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$OOP$Parser$Term$bopParser, '++', $author$project$OOP$Syntax$Cat),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$OOP$Parser$Term$bopParser, '<', $author$project$OOP$Syntax$Lt)),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$OOP$Parser$Term$bopParser, '>', $author$project$OOP$Syntax$Gt)),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$OOP$Parser$Term$bopParser, '<=', $author$project$OOP$Syntax$Le),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$OOP$Parser$Term$bopParser, '>=', $author$project$OOP$Syntax$Ge),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$OOP$Parser$Term$bopParser, '==', $author$project$OOP$Syntax$Eq),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$OOP$Parser$Term$bopParser, '&&', $author$project$OOP$Syntax$And),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$OOP$Parser$Term$bopParser, '||', $author$project$OOP$Syntax$Or),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2($Punie$elm_parser_extras$Parser$Expression$Infix, $author$project$OOP$Parser$Term$assign, $Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Term$seq),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		])
	]);
var $author$project$OOP$Syntax$PBTuple = F3(
	function (a, b, c) {
		return {$: 'PBTuple', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$PList = F3(
	function (a, b, c) {
		return {$: 'PList', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$PTTuple = F4(
	function (a, b, c, d) {
		return {$: 'PTTuple', a: a, b: b, c: c, d: d};
	});
var $author$project$OOP$Syntax$PCons = F3(
	function (a, b, c) {
		return {$: 'PCons', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$PCons1 = F3(
	function (a, b, c) {
		return {$: 'PCons1', a: a, b: b, c: c};
	});
var $author$project$OOP$Parser$Pattern$pConsOp = _List_fromArray(
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
						function (spc) {
							return $author$project$OOP$Syntax$PCons(
								_List_fromArray(
									[spc]));
						}),
					$elm$parser$Parser$symbol('::')),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						function (spc) {
							return $author$project$OOP$Syntax$PCons1(
								_List_fromArray(
									[spc]));
						}),
					$elm$parser$Parser$symbol(':')),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		])
	]);
var $author$project$OOP$Syntax$PChar = F2(
	function (a, b) {
		return {$: 'PChar', a: a, b: b};
	});
var $author$project$OOP$Parser$Pattern$pchar = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (c, spc) {
						return A2(
							$author$project$OOP$Syntax$PChar,
							_List_fromArray(
								[spc]),
							c);
					})),
			$elm$parser$Parser$symbol('\'')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$Utils$char_,
			$elm$parser$Parser$symbol('\''))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$PEmpList = function (a) {
	return {$: 'PEmpList', a: a};
};
var $author$project$OOP$Parser$Pattern$pempList = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (spc1, spc2) {
						return $author$project$OOP$Syntax$PEmpList(
							_List_fromArray(
								[spc1, spc2]));
					})),
			$elm$parser$Parser$symbol('[')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$WhiteSpaces$mspaces,
			$elm$parser$Parser$symbol(']'))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$Pattern$pfalse = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$PFalse(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('false')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$PFloat = F2(
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
var $author$project$OOP$Parser$Pattern$pfloat = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (n, spc) {
							return A2(
								$author$project$OOP$Syntax$PFloat,
								_List_fromArray(
									[spc]),
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
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (n, spc) {
								return A2(
									$author$project$OOP$Syntax$PFloat,
									_List_fromArray(
										[spc]),
									-n);
							})),
					$elm$parser$Parser$symbol('-')),
				$elm$parser$Parser$float),
			$author$project$OOP$Parser$WhiteSpaces$mspaces)
		]));
var $author$project$OOP$Syntax$PInt = F2(
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
var $author$project$OOP$Parser$Pattern$pint = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (n, spc) {
							return A2(
								$author$project$OOP$Syntax$PInt,
								_List_fromArray(
									[spc]),
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
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (n, spc) {
								return A2(
									$author$project$OOP$Syntax$PInt,
									_List_fromArray(
										[spc]),
									-n);
							})),
					$elm$parser$Parser$symbol('-')),
				$elm$parser$Parser$int),
			$author$project$OOP$Parser$WhiteSpaces$mspaces)
		]));
var $author$project$OOP$Syntax$PNil = function (a) {
	return {$: 'PNil', a: a};
};
var $author$project$OOP$Parser$Pattern$pnil = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$PNil(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('nil')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$PString = F2(
	function (a, b) {
		return {$: 'PString', a: a, b: b};
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
var $author$project$OOP$Parser$Utils$string_ = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompUntil('\"'));
var $author$project$OOP$Parser$Pattern$pstring = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (s, spc) {
						return A2(
							$author$project$OOP$Syntax$PString,
							_List_fromArray(
								[spc]),
							s);
					})),
			$elm$parser$Parser$symbol('\"')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$Utils$string_,
			$elm$parser$Parser$symbol('\"'))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$Pattern$ptermListToPList = function (ls) {
	if (!ls.b) {
		return $author$project$OOP$Syntax$PEmpList(_List_Nil);
	} else {
		var _v1 = ls.a;
		var p = _v1.a;
		var ws = _v1.b;
		var ps = ls.b;
		return A3(
			$author$project$OOP$Syntax$PList,
			ws,
			p,
			$author$project$OOP$Parser$Pattern$ptermListToPList(ps));
	}
};
var $author$project$OOP$Parser$Pattern$ptrue = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$PTrue(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('true')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$PUnit = function (a) {
	return {$: 'PUnit', a: a};
};
var $author$project$OOP$Parser$Pattern$punit = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$PUnit(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$symbol('unit')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
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
var $author$project$OOP$Parser$Utils$varName = $elm$parser$Parser$variable(
	{
		inner: function (c) {
			return $elm$core$Char$isAlphaNum(c) || _Utils_eq(
				c,
				_Utils_chr('_'));
		},
		reserved: $elm$core$Set$fromList(
			_List_fromArray(
				['if', 'then', 'else', 'let', 'in', 'case', 'of', 'letrec', 'nil', 'true', 'false', 'toString', 'ref', 'unit', 'new', 'Html', 'map_'])),
		start: $elm$core$Char$isAlpha
	});
var $author$project$OOP$Parser$Pattern$pvar = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (vn, spc) {
					return A2(
						$author$project$OOP$Syntax$PVar,
						_List_fromArray(
							[spc]),
						vn);
				})),
		$author$project$OOP$Parser$Utils$varName),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$Pattern$pListHelper = function (revPats) {
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
								function (spc, p) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												p,
												_List_fromArray(
													[spc])),
											revPats));
								})),
						$elm$parser$Parser$symbol(',')),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				$elm$parser$Parser$lazy(
					function (_v7) {
						return $author$project$OOP$Parser$Pattern$cyclic$pterm();
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
function $author$project$OOP$Parser$Pattern$cyclic$pList() {
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
								function (spc1, p, ps, spc2) {
									return A3(
										$author$project$OOP$Syntax$PList,
										_List_fromArray(
											[spc1, spc2]),
										p,
										ps);
								})),
						$elm$parser$Parser$symbol('[')),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				$elm$parser$Parser$lazy(
					function (_v9) {
						return $author$project$OOP$Parser$Pattern$cyclic$pterm();
					})),
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$OOP$Parser$Pattern$cyclic$pListloop(),
				$elm$parser$Parser$symbol(']'))),
		$author$project$OOP$Parser$WhiteSpaces$mspaces);
}
function $author$project$OOP$Parser$Pattern$cyclic$pListloop() {
	return A2(
		$elm$parser$Parser$map,
		$author$project$OOP$Parser$Pattern$ptermListToPList,
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$OOP$Parser$Pattern$pListHelper));
}
function $author$project$OOP$Parser$Pattern$cyclic$pattern() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$OOP$Parser$Pattern$pConsOp,
		$elm$parser$Parser$lazy(
			function (_v6) {
				return $author$project$OOP$Parser$Pattern$cyclic$pterm();
			}));
}
function $author$project$OOP$Parser$Pattern$cyclic$pterm() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$author$project$OOP$Parser$Pattern$pvar,
				$author$project$OOP$Parser$Pattern$pnil,
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Pattern$pempList),
				$elm$parser$Parser$lazy(
				function (_v5) {
					return $author$project$OOP$Parser$Pattern$cyclic$pList();
				}),
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Pattern$pint),
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Pattern$pfloat),
				$author$project$OOP$Parser$Pattern$ptrue,
				$author$project$OOP$Parser$Pattern$pfalse,
				$elm$parser$Parser$backtrackable(
				$author$project$OOP$Parser$Pattern$cyclic$pbtuple()),
				$author$project$OOP$Parser$Pattern$cyclic$pttuple(),
				$author$project$OOP$Parser$Pattern$pstring,
				$author$project$OOP$Parser$Pattern$pchar,
				$author$project$OOP$Parser$Pattern$punit
			]));
}
function $author$project$OOP$Parser$Pattern$cyclic$pbtuple() {
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
									function (spc1, p1, spc2, p2, spc3) {
										return A3(
											$author$project$OOP$Syntax$PBTuple,
											_List_fromArray(
												[spc1, spc2, spc3]),
											p1,
											p2);
									})),
							$elm$parser$Parser$symbol('(')),
						$author$project$OOP$Parser$WhiteSpaces$mspaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v3) {
								return $author$project$OOP$Parser$Pattern$cyclic$pattern();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v4) {
						return $author$project$OOP$Parser$Pattern$cyclic$pattern();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$OOP$Parser$WhiteSpaces$mspaces);
}
function $author$project$OOP$Parser$Pattern$cyclic$pttuple() {
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
											function (spc1, p1, spc2, p2, spc3, p3, spc4) {
												return A4(
													$author$project$OOP$Syntax$PTTuple,
													_List_fromArray(
														[spc1, spc2, spc3, spc4]),
													p1,
													p2,
													p3);
											})),
									$elm$parser$Parser$symbol('(')),
								$author$project$OOP$Parser$WhiteSpaces$mspaces),
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$lazy(
									function (_v0) {
										return $author$project$OOP$Parser$Pattern$cyclic$pattern();
									}),
								$elm$parser$Parser$symbol(','))),
						$author$project$OOP$Parser$WhiteSpaces$mspaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v1) {
								return $author$project$OOP$Parser$Pattern$cyclic$pattern();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v2) {
						return $author$project$OOP$Parser$Pattern$cyclic$pattern();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$OOP$Parser$WhiteSpaces$mspaces);
}
try {
	var $author$project$OOP$Parser$Pattern$pList = $author$project$OOP$Parser$Pattern$cyclic$pList();
	$author$project$OOP$Parser$Pattern$cyclic$pList = function () {
		return $author$project$OOP$Parser$Pattern$pList;
	};
	var $author$project$OOP$Parser$Pattern$pListloop = $author$project$OOP$Parser$Pattern$cyclic$pListloop();
	$author$project$OOP$Parser$Pattern$cyclic$pListloop = function () {
		return $author$project$OOP$Parser$Pattern$pListloop;
	};
	var $author$project$OOP$Parser$Pattern$pattern = $author$project$OOP$Parser$Pattern$cyclic$pattern();
	$author$project$OOP$Parser$Pattern$cyclic$pattern = function () {
		return $author$project$OOP$Parser$Pattern$pattern;
	};
	var $author$project$OOP$Parser$Pattern$pterm = $author$project$OOP$Parser$Pattern$cyclic$pterm();
	$author$project$OOP$Parser$Pattern$cyclic$pterm = function () {
		return $author$project$OOP$Parser$Pattern$pterm;
	};
	var $author$project$OOP$Parser$Pattern$pbtuple = $author$project$OOP$Parser$Pattern$cyclic$pbtuple();
	$author$project$OOP$Parser$Pattern$cyclic$pbtuple = function () {
		return $author$project$OOP$Parser$Pattern$pbtuple;
	};
	var $author$project$OOP$Parser$Pattern$pttuple = $author$project$OOP$Parser$Pattern$cyclic$pttuple();
	$author$project$OOP$Parser$Pattern$cyclic$pttuple = function () {
		return $author$project$OOP$Parser$Pattern$pttuple;
	};
} catch ($) {
	throw 'Some top-level definitions from `OOP.Parser.Pattern` are causing infinite recursion:\n\n  ┌─────┐\n  │    pList\n  │     ↓\n  │    pListloop\n  │     ↓\n  │    pListHelper\n  │     ↓\n  │    pattern\n  │     ↓\n  │    pterm\n  │     ↓\n  │    pbtuple\n  │     ↓\n  │    pttuple\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
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
var $author$project$OOP$Parser$Term$string = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (s, spc) {
						return A2(
							$author$project$OOP$Syntax$TString,
							_List_fromArray(
								[spc]),
							s);
					})),
			$elm$parser$Parser$symbol('\"')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$Utils$string_,
			$elm$parser$Parser$symbol('\"'))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$TLoc = F2(
	function (a, b) {
		return {$: 'TLoc', a: a, b: b};
	});
var $author$project$OOP$Parser$Term$tloc = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (n, s) {
						return A2(
							$author$project$OOP$Syntax$TLoc,
							_List_fromArray(
								[s]),
							n);
					})),
			$elm$parser$Parser$symbol('<')),
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$number(
				{
					binary: $elm$core$Maybe$Nothing,
					_float: $elm$core$Maybe$Nothing,
					hex: $elm$core$Maybe$Nothing,
					_int: $elm$core$Maybe$Just($elm$core$Basics$identity),
					octal: $elm$core$Maybe$Nothing
				}),
			$elm$parser$Parser$symbol('>'))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$TTrue = function (a) {
	return {$: 'TTrue', a: a};
};
var $author$project$OOP$Parser$Term$true = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$TTrue(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('true')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Syntax$TUnit = function (a) {
	return {$: 'TUnit', a: a};
};
var $author$project$OOP$Parser$Term$unit = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$OOP$Syntax$TUnit(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('unit')),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$Term$var = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (vn, spc) {
					return A2(
						$author$project$OOP$Syntax$TVar,
						_List_fromArray(
							[spc]),
						vn);
				})),
		$author$project$OOP$Parser$Utils$varName),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$Term$listHelper = function (revTerms) {
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
								function (spc, t) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												t,
												_List_fromArray(
													[spc])),
											revTerms));
								})),
						$elm$parser$Parser$symbol(',')),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				$elm$parser$Parser$lazy(
					function (_v15) {
						return $author$project$OOP$Parser$Term$cyclic$term();
					})),
				A2(
				$elm$parser$Parser$map,
				function (_v16) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revTerms));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
function $author$project$OOP$Parser$Term$cyclic$abs() {
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
								function (spc1, p, spc2, t) {
									return A3(
										$author$project$OOP$Syntax$TLam,
										_List_fromArray(
											[spc1, spc2]),
										p,
										t);
								})),
						$elm$parser$Parser$symbol('\\')),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v37) {
							return $author$project$OOP$Parser$Pattern$pattern;
						}),
					$elm$parser$Parser$symbol('=>'))),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v38) {
				return $author$project$OOP$Parser$Term$cyclic$term();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$aexpr() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$author$project$OOP$Parser$Term$cyclic$iteState(),
				$elm$parser$Parser$backtrackable(
				$author$project$OOP$Parser$Term$cyclic$parens_()),
				$elm$parser$Parser$backtrackable(
				$author$project$OOP$Parser$Term$cyclic$btuple()),
				$author$project$OOP$Parser$Term$cyclic$ttuple(),
				$author$project$OOP$Parser$Term$true,
				$author$project$OOP$Parser$Term$false,
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Term$int_),
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Term$float_),
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Term$var),
				$elm$parser$Parser$lazy(
				function (_v34) {
					return $author$project$OOP$Parser$Term$cyclic$abs();
				}),
				$elm$parser$Parser$lazy(
				function (_v35) {
					return $author$project$OOP$Parser$Term$cyclic$let_();
				}),
				$elm$parser$Parser$lazy(
				function (_v36) {
					return $author$project$OOP$Parser$Term$cyclic$letrec();
				}),
				$author$project$OOP$Parser$Term$cyclic$caseOf(),
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Term$nil),
				$elm$parser$Parser$backtrackable(
				$author$project$OOP$Parser$Term$cyclic$list()),
				$author$project$OOP$Parser$Term$char,
				$author$project$OOP$Parser$Term$string,
				$author$project$OOP$Parser$Term$cyclic$ref(),
				$author$project$OOP$Parser$Term$cyclic$deref(),
				$author$project$OOP$Parser$Term$unit,
				$author$project$OOP$Parser$Term$cyclic$new(),
				$author$project$OOP$Parser$Term$cyclic$html(),
				$author$project$OOP$Parser$Term$cyclic$tostr(),
				$author$project$OOP$Parser$Term$cyclic$tmap(),
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Term$tloc),
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Term$empList)
			]));
}
function $author$project$OOP$Parser$Term$cyclic$caseOf() {
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
								function (spc1, t, spc2, b) {
									return A3(
										$author$project$OOP$Parser$Term$caseToApp,
										t,
										b,
										_List_fromArray(
											[spc1, spc2]));
								})),
						$elm$parser$Parser$keyword('case')),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v33) {
							return $author$project$OOP$Parser$Term$cyclic$term();
						}),
					$elm$parser$Parser$keyword('of'))),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$author$project$OOP$Parser$Term$cyclic$branch());
}
function $author$project$OOP$Parser$Term$cyclic$branch() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$OOP$Parser$Term$branchOp,
		$author$project$OOP$Parser$Term$cyclic$sinBranch());
}
function $author$project$OOP$Parser$Term$cyclic$btuple() {
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
									function (spc1, t1, spc2, t2, spc3) {
										return A3(
											$author$project$OOP$Syntax$TTuple2,
											_List_fromArray(
												[spc1, spc2, spc3]),
											t1,
											t2);
									})),
							$elm$parser$Parser$symbol('(')),
						$author$project$OOP$Parser$WhiteSpaces$mspaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v31) {
								return $author$project$OOP$Parser$Term$cyclic$term();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v32) {
						return $author$project$OOP$Parser$Term$cyclic$term();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$OOP$Parser$WhiteSpaces$mspaces);
}
function $author$project$OOP$Parser$Term$cyclic$deref() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (spc, t) {
							return A2(
								$author$project$OOP$Syntax$TDeRef,
								_List_fromArray(
									[spc]),
								t);
						})),
				$elm$parser$Parser$symbol('!')),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v30) {
				return $author$project$OOP$Parser$Term$cyclic$term();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$html() {
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
											function (n, s1, t1, s2, t2, s3, t3) {
												return A5(
													$author$project$OOP$Syntax$THtml,
													_List_fromArray(
														[s1, s2, s3]),
													n,
													t1,
													t2,
													t3);
											})),
									$elm$parser$Parser$symbol('Html.')),
								$author$project$OOP$Parser$Utils$varName),
							$author$project$OOP$Parser$WhiteSpaces$mspaces),
						$elm$parser$Parser$lazy(
							function (_v27) {
								return $author$project$OOP$Parser$Term$cyclic$aexpr();
							})),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				$elm$parser$Parser$lazy(
					function (_v28) {
						return $author$project$OOP$Parser$Term$cyclic$aexpr();
					})),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v29) {
				return $author$project$OOP$Parser$Term$cyclic$aexpr();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$iteState() {
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
										function (spc1, t1, spc2, t2, spc3, t3) {
											return A4(
												$author$project$OOP$Parser$Term$iteToApp,
												t1,
												t2,
												t3,
												_List_fromArray(
													[spc1, spc2, spc3]));
										})),
								$elm$parser$Parser$keyword('if')),
							$author$project$OOP$Parser$WhiteSpaces$mspaces),
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$lazy(
								function (_v24) {
									return $author$project$OOP$Parser$Term$cyclic$term();
								}),
							$elm$parser$Parser$keyword('then'))),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v25) {
							return $author$project$OOP$Parser$Term$cyclic$term();
						}),
					$elm$parser$Parser$keyword('else'))),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v26) {
				return $author$project$OOP$Parser$Term$cyclic$term();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$let_() {
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
										function (spc1, p, spc2, t1, spc3, t2) {
											return A4(
												$author$project$OOP$Syntax$TLet,
												_List_fromArray(
													[spc1, spc2, spc3]),
												p,
												t1,
												t2);
										})),
								$elm$parser$Parser$keyword('let')),
							$author$project$OOP$Parser$WhiteSpaces$mspaces),
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$lazy(
								function (_v21) {
									return $author$project$OOP$Parser$Pattern$pattern;
								}),
							$elm$parser$Parser$symbol('='))),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v22) {
							return $author$project$OOP$Parser$Term$cyclic$term();
						}),
					$elm$parser$Parser$keyword('in'))),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v23) {
				return $author$project$OOP$Parser$Term$cyclic$term();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$letrec() {
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
										function (spc1, p, spc2, t1, spc3, t2) {
											return A4(
												$author$project$OOP$Syntax$TLetrec,
												_List_fromArray(
													[spc1, spc2, spc3]),
												p,
												t1,
												t2);
										})),
								$elm$parser$Parser$keyword('letrec')),
							$author$project$OOP$Parser$WhiteSpaces$mspaces),
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$lazy(
								function (_v18) {
									return $author$project$OOP$Parser$Pattern$pattern;
								}),
							$elm$parser$Parser$symbol('='))),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v19) {
							return $author$project$OOP$Parser$Term$cyclic$term();
						}),
					$elm$parser$Parser$keyword('in'))),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v20) {
				return $author$project$OOP$Parser$Term$cyclic$term();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$list() {
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
								function (spc1, t1, t2, spc2) {
									return A3(
										$author$project$OOP$Syntax$TList,
										_List_fromArray(
											[spc1, spc2]),
										t1,
										t2);
								})),
						$elm$parser$Parser$symbol('[')),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				$elm$parser$Parser$lazy(
					function (_v17) {
						return $author$project$OOP$Parser$Term$cyclic$term();
					})),
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$OOP$Parser$Term$cyclic$listloop(),
				$elm$parser$Parser$symbol(']'))),
		$author$project$OOP$Parser$WhiteSpaces$mspaces);
}
function $author$project$OOP$Parser$Term$cyclic$listloop() {
	return A2(
		$elm$parser$Parser$map,
		$author$project$OOP$Parser$Term$exprListToTList,
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$OOP$Parser$Term$listHelper));
}
function $author$project$OOP$Parser$Term$cyclic$new() {
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
									function (spc1, cl, spc2, t, spc3) {
										return A3(
											$author$project$OOP$Syntax$TNew,
											_List_fromArray(
												[spc1, spc2, spc3]),
											cl,
											t);
									})),
							$elm$parser$Parser$keyword('new')),
						$author$project$OOP$Parser$WhiteSpaces$mspaces),
					A2(
						$elm$parser$Parser$ignorer,
						$author$project$OOP$Parser$Utils$varName,
						$elm$parser$Parser$symbol('('))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v14) {
						return $author$project$OOP$Parser$Term$cyclic$term();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$OOP$Parser$WhiteSpaces$mspaces);
}
function $author$project$OOP$Parser$Term$cyclic$parens_() {
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
							function (spc1, t, spc2) {
								return A2(
									$author$project$OOP$Syntax$TParens,
									_List_fromArray(
										[spc1, spc2]),
									t);
							})),
					$elm$parser$Parser$symbol('(')),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v13) {
						return $author$project$OOP$Parser$Term$cyclic$term();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$OOP$Parser$WhiteSpaces$mspaces);
}
function $author$project$OOP$Parser$Term$cyclic$ref() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (spc, t) {
							return A2(
								$author$project$OOP$Syntax$TRef,
								_List_fromArray(
									[spc]),
								t);
						})),
				$elm$parser$Parser$keyword('ref')),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v12) {
				return $author$project$OOP$Parser$Term$cyclic$term();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$sinBranch() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F3(
						function (p, spc, t) {
							return A3(
								$author$project$OOP$Syntax$BSin,
								_List_fromArray(
									[spc]),
								p,
								t);
						})),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v10) {
							return $author$project$OOP$Parser$Pattern$pattern;
						}),
					$elm$parser$Parser$symbol('=>'))),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v11) {
				return $author$project$OOP$Parser$Term$cyclic$term();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$term() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$OOP$Parser$Term$operators,
		$elm$parser$Parser$lazy(
			function (_v9) {
				return $author$project$OOP$Parser$Term$cyclic$term_app();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$term_app() {
	var foldl1 = F2(
		function (f, _v8) {
			var x = _v8.a;
			var xs = _v8.b;
			return A3(
				$elm$core$List$foldl,
				$author$project$OOP$Parser$Term$flip(f),
				x,
				xs);
		});
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			foldl1(
				$author$project$OOP$Syntax$TApp(_List_Nil))),
		$Punie$elm_parser_extras$Parser$Extras$some(
			$elm$parser$Parser$lazy(
				function (_v7) {
					return $author$project$OOP$Parser$Term$cyclic$aexpr();
				})));
}
function $author$project$OOP$Parser$Term$cyclic$tmap() {
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
										function (s1, d, s2, f, s3, ls) {
											return A4(
												$author$project$OOP$Syntax$TMap,
												_List_fromArray(
													[s1, s2, s3]),
												d,
												f,
												ls);
										})),
								$elm$parser$Parser$keyword('map_')),
							$author$project$OOP$Parser$WhiteSpaces$mspaces),
						$elm$parser$Parser$lazy(
							function (_v4) {
								return $author$project$OOP$Parser$Term$cyclic$aexpr();
							})),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				$elm$parser$Parser$lazy(
					function (_v5) {
						return $author$project$OOP$Parser$Term$cyclic$aexpr();
					})),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v6) {
				return $author$project$OOP$Parser$Term$cyclic$aexpr();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$tostr() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (s, t) {
							return A2(
								$author$project$OOP$Syntax$TToStr,
								_List_fromArray(
									[s]),
								t);
						})),
				$elm$parser$Parser$keyword('toString')),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		$elm$parser$Parser$lazy(
			function (_v3) {
				return $author$project$OOP$Parser$Term$cyclic$term();
			}));
}
function $author$project$OOP$Parser$Term$cyclic$ttuple() {
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
											function (spc1, t1, spc2, t2, spc3, t3, spc4) {
												return A4(
													$author$project$OOP$Syntax$TTuple3,
													_List_fromArray(
														[spc1, spc2, spc3, spc4]),
													t1,
													t2,
													t3);
											})),
									$elm$parser$Parser$symbol('(')),
								$author$project$OOP$Parser$WhiteSpaces$mspaces),
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$lazy(
									function (_v0) {
										return $author$project$OOP$Parser$Term$cyclic$term();
									}),
								$elm$parser$Parser$symbol(','))),
						$author$project$OOP$Parser$WhiteSpaces$mspaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v1) {
								return $author$project$OOP$Parser$Term$cyclic$term();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v2) {
						return $author$project$OOP$Parser$Term$cyclic$term();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$OOP$Parser$WhiteSpaces$mspaces);
}
try {
	var $author$project$OOP$Parser$Term$abs = $author$project$OOP$Parser$Term$cyclic$abs();
	$author$project$OOP$Parser$Term$cyclic$abs = function () {
		return $author$project$OOP$Parser$Term$abs;
	};
	var $author$project$OOP$Parser$Term$aexpr = $author$project$OOP$Parser$Term$cyclic$aexpr();
	$author$project$OOP$Parser$Term$cyclic$aexpr = function () {
		return $author$project$OOP$Parser$Term$aexpr;
	};
	var $author$project$OOP$Parser$Term$caseOf = $author$project$OOP$Parser$Term$cyclic$caseOf();
	$author$project$OOP$Parser$Term$cyclic$caseOf = function () {
		return $author$project$OOP$Parser$Term$caseOf;
	};
	var $author$project$OOP$Parser$Term$branch = $author$project$OOP$Parser$Term$cyclic$branch();
	$author$project$OOP$Parser$Term$cyclic$branch = function () {
		return $author$project$OOP$Parser$Term$branch;
	};
	var $author$project$OOP$Parser$Term$btuple = $author$project$OOP$Parser$Term$cyclic$btuple();
	$author$project$OOP$Parser$Term$cyclic$btuple = function () {
		return $author$project$OOP$Parser$Term$btuple;
	};
	var $author$project$OOP$Parser$Term$deref = $author$project$OOP$Parser$Term$cyclic$deref();
	$author$project$OOP$Parser$Term$cyclic$deref = function () {
		return $author$project$OOP$Parser$Term$deref;
	};
	var $author$project$OOP$Parser$Term$html = $author$project$OOP$Parser$Term$cyclic$html();
	$author$project$OOP$Parser$Term$cyclic$html = function () {
		return $author$project$OOP$Parser$Term$html;
	};
	var $author$project$OOP$Parser$Term$iteState = $author$project$OOP$Parser$Term$cyclic$iteState();
	$author$project$OOP$Parser$Term$cyclic$iteState = function () {
		return $author$project$OOP$Parser$Term$iteState;
	};
	var $author$project$OOP$Parser$Term$let_ = $author$project$OOP$Parser$Term$cyclic$let_();
	$author$project$OOP$Parser$Term$cyclic$let_ = function () {
		return $author$project$OOP$Parser$Term$let_;
	};
	var $author$project$OOP$Parser$Term$letrec = $author$project$OOP$Parser$Term$cyclic$letrec();
	$author$project$OOP$Parser$Term$cyclic$letrec = function () {
		return $author$project$OOP$Parser$Term$letrec;
	};
	var $author$project$OOP$Parser$Term$list = $author$project$OOP$Parser$Term$cyclic$list();
	$author$project$OOP$Parser$Term$cyclic$list = function () {
		return $author$project$OOP$Parser$Term$list;
	};
	var $author$project$OOP$Parser$Term$listloop = $author$project$OOP$Parser$Term$cyclic$listloop();
	$author$project$OOP$Parser$Term$cyclic$listloop = function () {
		return $author$project$OOP$Parser$Term$listloop;
	};
	var $author$project$OOP$Parser$Term$new = $author$project$OOP$Parser$Term$cyclic$new();
	$author$project$OOP$Parser$Term$cyclic$new = function () {
		return $author$project$OOP$Parser$Term$new;
	};
	var $author$project$OOP$Parser$Term$parens_ = $author$project$OOP$Parser$Term$cyclic$parens_();
	$author$project$OOP$Parser$Term$cyclic$parens_ = function () {
		return $author$project$OOP$Parser$Term$parens_;
	};
	var $author$project$OOP$Parser$Term$ref = $author$project$OOP$Parser$Term$cyclic$ref();
	$author$project$OOP$Parser$Term$cyclic$ref = function () {
		return $author$project$OOP$Parser$Term$ref;
	};
	var $author$project$OOP$Parser$Term$sinBranch = $author$project$OOP$Parser$Term$cyclic$sinBranch();
	$author$project$OOP$Parser$Term$cyclic$sinBranch = function () {
		return $author$project$OOP$Parser$Term$sinBranch;
	};
	var $author$project$OOP$Parser$Term$term = $author$project$OOP$Parser$Term$cyclic$term();
	$author$project$OOP$Parser$Term$cyclic$term = function () {
		return $author$project$OOP$Parser$Term$term;
	};
	var $author$project$OOP$Parser$Term$term_app = $author$project$OOP$Parser$Term$cyclic$term_app();
	$author$project$OOP$Parser$Term$cyclic$term_app = function () {
		return $author$project$OOP$Parser$Term$term_app;
	};
	var $author$project$OOP$Parser$Term$tmap = $author$project$OOP$Parser$Term$cyclic$tmap();
	$author$project$OOP$Parser$Term$cyclic$tmap = function () {
		return $author$project$OOP$Parser$Term$tmap;
	};
	var $author$project$OOP$Parser$Term$tostr = $author$project$OOP$Parser$Term$cyclic$tostr();
	$author$project$OOP$Parser$Term$cyclic$tostr = function () {
		return $author$project$OOP$Parser$Term$tostr;
	};
	var $author$project$OOP$Parser$Term$ttuple = $author$project$OOP$Parser$Term$cyclic$ttuple();
	$author$project$OOP$Parser$Term$cyclic$ttuple = function () {
		return $author$project$OOP$Parser$Term$ttuple;
	};
} catch ($) {
	throw 'Some top-level definitions from `OOP.Parser.Term` are causing infinite recursion:\n\n  ┌─────┐\n  │    abs\n  │     ↓\n  │    aexpr\n  │     ↓\n  │    caseOf\n  │     ↓\n  │    branch\n  │     ↓\n  │    btuple\n  │     ↓\n  │    deref\n  │     ↓\n  │    html\n  │     ↓\n  │    iteState\n  │     ↓\n  │    let_\n  │     ↓\n  │    letrec\n  │     ↓\n  │    list\n  │     ↓\n  │    listloop\n  │     ↓\n  │    listHelper\n  │     ↓\n  │    new\n  │     ↓\n  │    parens_\n  │     ↓\n  │    ref\n  │     ↓\n  │    sinBranch\n  │     ↓\n  │    term\n  │     ↓\n  │    term_app\n  │     ↓\n  │    tmap\n  │     ↓\n  │    tostr\n  │     ↓\n  │    ttuple\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$OOP$Parser$Term$parse = $elm$parser$Parser$run(
	A2($elm$parser$Parser$ignorer, $author$project$OOP$Parser$Term$term, $elm$parser$Parser$end));
var $author$project$OOP$Objects$Templates$parseTemplates = function (tplt) {
	if (tplt.b) {
		var _v1 = tplt.a;
		var cl = _v1.a;
		var op = _v1.b;
		var hp = _v1.c;
		var rest = tplt.b;
		var res2 = $author$project$OOP$Parser$Term$parse(hp);
		var res1 = $author$project$OOP$Parser$Term$parse(op);
		var _v2 = _Utils_Tuple2(res1, res2);
		_v2$1:
		while (true) {
			if (_v2.a.$ === 'Ok') {
				if (_v2.b.$ === 'Ok') {
					var objectPat = _v2.a.a;
					var htmlPat = _v2.b.a;
					return A2(
						$elm$core$List$cons,
						{_class: cl, hPat: htmlPat, oPat: objectPat},
						$author$project$OOP$Objects$Templates$parseTemplates(rest));
				} else {
					break _v2$1;
				}
			} else {
				if (_v2.b.$ === 'Err') {
					break _v2$1;
				} else {
					var info = _v2.a.a;
					return _List_fromArray(
						[
							{
							_class: cl,
							hPat: $author$project$OOP$Syntax$TError(''),
							oPat: $author$project$OOP$Syntax$TError(
								$elm$core$Debug$toString(info))
						}
						]);
				}
			}
		}
		var info = _v2.b.a;
		return _List_fromArray(
			[
				{
				_class: cl,
				hPat: $author$project$OOP$Syntax$TError(
					$elm$core$Debug$toString(info)),
				oPat: $author$project$OOP$Syntax$TError('')
			}
			]);
	} else {
		return _List_Nil;
	}
};
var $author$project$OOP$Objects$Templates$templates = _List_fromArray(
	[
		_Utils_Tuple3('JFrame', 'new JFrame([height, width, title, members, containers])', 'Html.div   [ ["height", height]\n                        , ["width", width]\n                        , ["margin", "auto"]\n                        , ["border-style", "solid"]\n                        , ["border-width", "medium"]\n                        , ["border-color", "rgb(85, 154, 243)"]\n                        , ["position", "relative"]\n                        , ["background-color", "rgb(214, 214, 214)"]] \n                        [] \n                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]\n                                    , ["height", "25px"]] \n                                    [] \n                                    [title]\n                        , Html.div [] [] members\n                        , Html.div [] [] containers]'),
		_Utils_Tuple3('JLabel', 'new JLabel([height, width, bgcolor, left, top, text])', 'Html.div   [ ["height", height]\n                        , ["width", width]\n                        , ["background-color", bgcolor]\n                        , ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["text-align", "left"]]\n                        []\n                        [text]'),
		_Utils_Tuple3('JButton', 'new JButton([left, top, height, width, hint, id, onclick])', 'Html.div   [ ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["position", "absolute"]]\n                        []\n                        [ Html.button [["height", height]\n                        , ["width", width]] [["id", id], ["onclick", onclick]] [hint]]\n                        '),
		_Utils_Tuple3('JDialog', 'new JDialog([title, hint, id])', 'Html.div   [ ["height", "150px"]\n                        , ["width", "200px"]\n                        , ["margin", "auto auto auto auto"]\n                        , ["border-style", "solid"]\n                        , ["border-width", "medium"]\n                        , ["border-color", "rgb(85, 154, 243)"]\n                        , ["position", "relative"]\n                        , ["background-color", "rgb(214, 214, 214)"]] \n                        [ ["id", id]\n                        , ["hidden", ""]]\n                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]\n                                    , ["height", "25px"]] \n                                    [] \n                                    [title]\n                        , Html.div [] [["id", id ++ "hint"]] [hint]\n                        , Html.button [] [["id", id ++ "btn"]] ["Ok"]\n                        , Html.script [] [] ["document.getElementById(\'" ++ id \n                            ++ "btn\').addEventListener(\'click\', function(){"\n                            ++ "document.getElementById(\'" ++ id ++ "\').setAttribute(\'hidden\', true);})"\n                        ]]'),
		_Utils_Tuple3('JTextField', 'new JTextField([left, top, text])', 'Html.div   [ ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["border", "1px solid black"]\n                        , ["width", "200px"]\n                        , ["text-align", "left"]\n                        , ["background-color", "white"]]\n                        []\n                        [text]'),
		_Utils_Tuple3('JTextArea', 'new JTextArea([left, top, width, height, bgcolor, textcolor, id, text])', 'Html.div   [ ["margin", left ++  " auto " ++ top ++ " auto"]\n                        , ["width", width]\n                        , ["height", height]\n                        , ["background-color", bgcolor]\n                        , ["color", textcolor]\n                        , ["text-align", "left"]]\n                        [["id", id]]\n                        [text]'),
		_Utils_Tuple3('JRadioButton', 'new JRadioButton([name, hint, value])', 'Html.div [] [] [ Html.input [] [ ["type", "radio"]\n                                            , ["name", name]\n                                            , ["value", value]\n                                            , ["id", name ++ hint]] []\n                            , hint\n                            ]'),
		_Utils_Tuple3('JMenuItem', 'new JMenuItem([title])', 'Html.div [["border-bottom", "2px solid lightgray"]\n                        , ["width", "100px"]\n                        , ["padding", "5px 10px"]] [] \n                    [title]'),
		_Utils_Tuple3('JMenu', 'new JMenu([title, id, items])', 'Html.div [] [] \n            [ Html.div [] [["id", id]] \n                [ Html.span [] [] [title]\n                , Html.objectlist [] [["id", "List-1"]]\n                    [Html.div [] [["id", id ++ "items"]] items]\n                ]\n            , Html.style [] [] \n                ["#" ++ id ++ " {\n                    width: 100px;\n                    cursor: pointer;\n                    padding: 5px 10px;\n                    position: relative;\n                    border-radius: 2.5px;\n                    display: inline-block;\n                    background-color: white;\n                    border-bottom: 2px solid lightgray;\n                }\n                #" ++ id ++ "items {\n                    z-index: 99;\n                    width: 120px;\n                    display: none;\n                    cursor: pointer;\n                    position: absolute;\n                    border-radius: 4px;\n                    background-color: white;\n                    border-top: 2px solid lightgray;\n                    border-left: 2px solid lightgray;\n                    border-right: 2px solid lightgray;\n                }\n                #" ++ id ++ ":hover #" ++ id ++ "items {\n                    display:block;\n                }"]\n            ]'),
		_Utils_Tuple3('JMenuBar', 'new JMenuBar([menu])', 'Html.div [["display", "flex"]] [] menu'),
		_Utils_Tuple3('MyCalculator', 'new MyCalculator([height, width, title, members, containers, displayLabel])', 'Html.div   [ ["height", height]\n                        , ["width", width]\n                        , ["margin", "auto auto auto auto"]\n                        , ["border-style", "solid"]\n                        , ["border-width", "medium"]\n                        , ["border-color", "rgb(85, 154, 243)"]\n                        , ["position", "relative"]\n                        , ["background-color", "rgb(214, 214, 214)"]] \n                        [] \n                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]\n                                    , ["height", "25px"]] \n                                    [] \n                                    [title]\n                        , Html.div [] [] [displayLabel]\n                        , Html.div [] [] members\n                        , Html.div [] [] containers]'),
		_Utils_Tuple3('DisplayLabel', 'new DisplayLabel([height, width, bgColor, left, top, text, id, memval, op])', 'Html.div   [ ["height", height]\n                        , ["width", width]\n                        , ["background-color", bgColor]\n                        , ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]]\n                        [ ["id", id]\n                        , ["memval", memval]\n                        , ["op", op]]\n                        [text]'),
		_Utils_Tuple3('DigitBtn', 'new DigitBtn([left, top, height, width, hint, id, onClick])', 'Html.div   [ ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["position", "absolute"]]\n                        []\n                        [ Html.button [["height", height],\n                                    ["width", width]] \n                                    [["id", id]] \n                                    [hint]\n                        , Html.script [] [] \n                            [ "document.getElementById(\'" ++ id ++ "\').addEventListener(\n                                \'click\', function(){ \n                                    dl = document.getElementById(\'label\');\n                                    if(dl.innerHTML == \'\'){\n                                        dl.innerHTML = \'" ++ hint ++ "\';\n                                    }else{\n                                        dl.innerHTML = dl.innerHTML + \'" ++ hint ++ "\';\n                                    }\n                                }\n                            )"]]'),
		_Utils_Tuple3('OpBtn', 'new OpBtn([left, top, height, width, hint, id, onClick])', 'Html.div   [ ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["position", "absolute"]]\n                        []\n                        [ Html.button [["height", height], \n                                    ["width", width]] \n                                    [["id", id]] \n                                    [hint]\n                        , Html.script [] [] \n                            ["document.getElementById(\'" ++ id ++ "\').addEventListener(\n                                \'click\', function(){\n                                    dl = document.getElementById(\'label\');\n                                    oprand = dl.innerHTML;\n                                    op = \'" ++ hint ++ "\';\n                                    if(op == \'1/X\'){\n                                        dl.innerHTML = (1 / parseFloat(oprand));\n                                    }else if(op == \'sqrt\'){\n                                        dl.innerHTML = (Math.sqrt(parseFloat(oprand)));\n                                    }else if(dl.getAttribute(\'memval\') == \'.0\'){\n                                            dl.setAttribute(\'memval\', dl.innerHTML);\n                                            dl.setAttribute(\'op\', \'" ++ hint ++ "\');\n                                            dl.innerHTML = \'\';\n                                    }else if(op == \'=\'){\n                                        op = dl.getAttribute(\'op\');\n                                        if(oprand == \'\'){\n                                            dl.innerHTML = dl.getAttribute(\'memval\');\n                                        }else{\n                                            oprand = parseFloat(oprand);\n                                            memval = parseFloat(dl.getAttribute(\'memval\'));\n                                            switch(op){\n                                                case \'+\': res = memval + oprand;break;\n                                                case \'-\': res = memval - oprand;break;\n                                                case \'*\': res = memval * oprand;break;\n                                                case \'/\': res = memval / oprand;break;\n                                                case \'%\': res = (parseInt(dl.getAttribute(\'memval\'))) % (parseInt(dl.innerHTML));break;\n                                                default: res = \'no such operation\';\n                                            }\n                                            dl.innerHTML = res;\n                                            dl.setAttribute(\'memval\', \'.0\');\n                                            dl.setAttribute(\'op\', \'?\');\n                                        }\n                                    }else{\n                                        dl.innerHTML = \'invalid operation\';\n                                    }\n                                }\n                            )"]]'),
		_Utils_Tuple3('SpecBtn', 'new SpecBtn([left, top, height, width, hint, id, onClick])', 'Html.div   [ ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["position", "absolute"]]\n                        []\n                        [ Html.button [["height", height],\n                                    ["width", width]] \n                                    [["id", id]] \n                                    [hint]\n                        , Html.script [] [] \n                            ["document.getElementById(\'" ++ id ++ "\').addEventListener(\n                                \'click\', function(){ \n                                    dl = document.getElementById(\'label\');\n                                    hint = \'" ++ hint ++ "\';\n                                    if(hint == \'Backspc\'){\n                                        str = dl.innerHTML;\n                                        str = str.substring(0, str.length - 1);\n                                        dl.innerHTML = str;\n                                    }\n                                    else if(hint == \'C\'){\n                                        dl.innerHTML = \'\';\n                                        dl.setAttribute(\'memval\', \'.0\');\n                                        dl.setAttribute(\'op\', \'?\');\n                                    }\n                                    else if(hint == \'CE\'){\n                                        dl.innerHTML = \'\';\n                                    }\n                                }\n                            )"]]'),
		_Utils_Tuple3('MyTd', 'new MyTd([color, content])', 'Html.div   [ ["border-bottom", "1px solid blue"]\n                        , ["border-right", "1px solid blue"]\n                        , ["background-color", color]\n                        , ["width", "149px"]\n                        ] \n                        [] \n                        [content]'),
		_Utils_Tuple3('MyTr', 'new MyTr([cols])', 'Html.div [["display", "flex"]] [] cols'),
		_Utils_Tuple3('MyTh', 'new MyTh([color, content])', 'Html.div   [ ["border-bottom", "1px solid blue"]\n                        , ["border-right", "1px solid blue"]\n                        , ["background-color", color]\n                        , ["width", "149px"]\n                        , ["font-weight", "bold"]\n                        ] \n                        [] \n                        [content]'),
		_Utils_Tuple3('MyTable', 'new MyTable([color, rows])', 'Html.div   [ ["border", "1px solid black"]\n                        , ["background-color", "white"]\n                        , ["height", "400px"]\n                        , ["width", "600px"]] \n                        []\n                        rows'),
		_Utils_Tuple3('Folder', 'new Folder([bgcolor, textcolor, left, height, width, name])', 'Html.div   [ ["background-color", bgcolor]\n                        , ["margin-left", left]\n                        , ["height", height]\n                        , ["width", width]\n                        , ["color", textcolor]\n                        , ["text-align", "left"]] \n                        []\n                        [name]'),
		_Utils_Tuple3('MyFileExplorer', 'new MyFileExplorer([height, width, title, members, containers, folders, files])', 'Html.div   [ ["height", height]\n                        , ["width", width]\n                        , ["margin", "auto auto auto auto"]\n                        , ["border-style", "solid"]\n                        , ["border-width", "medium"]\n                        , ["border-color", "rgb(85, 154, 243)"]\n                        , ["position", "relative"]\n                        , ["background-color", "rgb(214, 214, 214)"]] \n                        [] \n                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]\n                                    , ["height", "25px"]] \n                                    []\n                                    [title]\n                        , Html.div [["display", "flex"]] [] \n                                    [ Html.div [["width", "100px"]\n                                                , ["background-color", "white"]] \n                                                [] \n                                                folders\n                                    , files]]'),
		_Utils_Tuple3('MyMenuItem', 'new MyMenuItem([title, id, onclick])', 'Html.div [["border-bottom", "2px solid lightgray"]\n                        , ["width", "100px"]\n                        , ["padding", "5px 10px"]] \n                        [["id", id]] \n                    [ Html.div [] [] [title]\n                    , Html.script [] [] \n                        ["document.getElementById(\'" ++ id ++ "\').addEventListener(\n                            \'click\', (ev)=>{\n                                " ++ onclick ++ "\n                            }\n                        )"]]'),
		_Utils_Tuple3('ColorChooser', 'new ColorChooser([title, hint, id, destid, destattr])', 'Html.div   [ ["height", "150px"]\n                        , ["width", "200px"]\n                        , ["margin", "auto auto auto auto"]\n                        , ["border-style", "solid"]\n                        , ["border-width", "medium"]\n                        , ["border-color", "rgb(85, 154, 243)"]\n                        , ["position", "relative"]\n                        , ["background-color", "rgb(214, 214, 214)"]] \n                        [ ["id", id]\n                        , ["hidden", ""]]\n                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]\n                                    , ["height", "25px"]] \n                                    [] \n                                    [title]\n                        , Html.div [] [["id", id ++ "hint"]] [hint]\n                        , Html.input [] [["type", "color"], ["id", id ++ "color"]] []\n                        , Html.button [] [["id", id ++ "btn"]] ["Ok"]\n                        , Html.script [] [] \n                            ["document.getElementById(\'" ++ id ++ "btn\').addEventListener(\n                                \'click\', function(){\n                                    document.getElementById(\'" ++ destid ++ "\').style." ++ destattr ++ " = \n                                        document.getElementById(\'" ++ id ++ "color\').value;\n                                    document.getElementById(\'" ++ id ++ "\').setAttribute(\'hidden\', true);\n                                }\n                            )"]]'),
		_Utils_Tuple3('Page', 'new Page([height, width, title, members, containers, menuBar, id, display])', 'Html.div   [ ["height", height]\n                        , ["width", width]\n                        , ["margin", "auto auto auto auto"]\n                        , ["border-style", "solid"]\n                        , ["border-width", "medium"]\n                        , ["border-color", "rgb(85, 154, 243)"]\n                        , ["position", "relative"]\n                        , ["display", display]] \n                        [ ["id", id]] \n                        [ Html.div  [ ["height", "25px"]\n                                    , ["text-align", "left"]] \n                                    [] \n                                    [title]\n                        , Html.div [["display", "flex"]] [] \n                                    [ menuBar\n                                    , Html.div [["position", "relative"]] [] members]\n                        , Html.div [] [] containers]'),
		_Utils_Tuple3('AppProg', 'new AppProg([pages])', 'Html.div [] [] pages'),
		_Utils_Tuple3('VerticalMenuBar', 'new VerticalMenuBar([menu, color])', 'Html.div [ ["background-color", color]\n                        , ["width", "100px"]\n                        , ["height", "480px"]] [] menu'),
		_Utils_Tuple3('MyButton', 'new MyButton([left, top, height, width, hint, color, id, onclick])', 'Html.div   [["background-color", color]\n                        ,["height", "50px"]]\n                        [["id", id]]\n                        [ Html.div [] [] [hint]\n                        , Html.script [] [] \n                        ["document.getElementById(\'" ++ id ++ "\').addEventListener("\n                            ++ "\'click\', (ev)=>{" \n                            ++ onclick \n                            ++ "})"]]'),
		_Utils_Tuple3('ProgressBar', 'new ProgressBar([hint, left])', 'Html.div [["display", "flex"], \n                        ["margin-left", "5px"], \n                        ["margin-top", "5px"]] \n                        [] \n                        [ Html.div [] [] [hint]\n                        , Html.div [["height", "20px"], \n                                    ["width", "300px"], \n                                    ["background-color", "grey"], \n                                    ["margin-left", left]] [] []]'),
		_Utils_Tuple3('ActiveBtn', 'new ActiveBtn([left, top, height, width, hint])', 'Html.div   [ ["margin-left", left]\n                        , ["height", height]\n                        , ["width", width]\n                        , ["border", "1px solid rgb(45,228,70)"]\n                        , ["color", "rgb(45,228,70)"]] [] [hint]'),
		_Utils_Tuple3('NActiveBtn', 'new NActiveBtn([left, top, height, width, hint])', 'Html.div   [ ["margin-left", left]\n                        , ["height", height]\n                        , ["width", width]\n                        , ["border", "1px solid rgb(218,218,218)"]\n                        , ["color", "rgb(218,218,218)"]] [] [hint]'),
		_Utils_Tuple3('BtnBar', 'new BtnBar([btns, top])', 'Html.div [["display", "flex"], ["margin-top", top]] [] btns'),
		_Utils_Tuple3('LabelPage', 'new LabelPage([defaultoption, option, height, content])', 'Html.div [["display", "flex"]] []  \n                    [ Html.div  [ ["background-color", "black"]\n                                , ["height", height]\n                                , ["width", "100px"]] [] \n                                [ Html.div  [ ["height", "50px"]\n                                            , ["background-color", "rgb(45,228,70)"]\n                                            , ["color", "white"]] \n                                            [] \n                                            [defaultoption]\n                                , Html.div  [ ["height", "50px"]\n                                            , ["background-color", "rgb(43,205,65)"]\n                                            , ["color", "white"]] \n                                            [] \n                                            [option]]\n                    , Html.div [] [] content]'),
		_Utils_Tuple3('InputLabel', 'new InputLabel([hint, left, text])', 'Html.div [["display", "flex"]\n                    ,  ["margin-left", "5px"]\n                    ,  ["margin-top", "5px"]] \n                    [] \n                    [ Html.div [["width", "80px"]] \n                    [] \n                    [hint]\n                    , Html.div [["height", "20px"], \n                                ["width", "300px"], \n                                ["border", "1px solid grey"], \n                                ["margin-left", left]] \n                                [] \n                                [text]]'),
		_Utils_Tuple3('DBTd', 'new DBTd([width, text])', 'Html.div [["border", "1px solid rgb(212,212,212)"]\n                    ,  ["width", width]] \n                    [] \n                    [text]'),
		_Utils_Tuple3('DBTh', 'new DBTh([width, text])', 'Html.div [["border", "1px solid black"]\n                    ,  ["width", width]] \n                    [] \n                    [text]'),
		_Utils_Tuple3('DBTr', 'new DBTr([content])', 'Html.div [["display", "flex"]\n                    ,  ["background-color", "white"]] \n                    [] \n                    content'),
		_Utils_Tuple3('DBTable', 'new DBTable([data, height])', 'Html.div [["background-color", "rgb(212,212,212)"]\n                    ,  ["height", height]\n                    ,  ["margin-top", "10px"]] \n                    [] \n                    data'),
		_Utils_Tuple3('CheckBtn', 'new CheckBtn([hint])', 'Html.div [["display", "flex"]] \n                        [] \n                        [ Html.input [] [["type", "checkbox"]] []\n                        , Html.div [["margin-left", "10px"]] [] [hint]]'),
		_Utils_Tuple3('PuzzleBtn', 'new PuzzleBtn([left, top, height, width, hint, id, onclick])', 'Html.div   [ ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["position", "absolute"]]\n                        []\n                        [ Html.button [["height", height],  \n                                    ["width", width]] \n                                    [["id", id], \n                                    ["onclick", onclick]] \n                                    [hint]]'),
		_Utils_Tuple3('MyQuestion', 'new MyQuestion([question, options, name, answer, hidden])', 'Html.div   [["margin-top", "10px"]\n                        , ["visibility", hidden]] \n                        [ ["id", name]\n                        , ["answer", answer]] \n                        [ Html.div [] [] [question]\n                        , Html.div [["display", "flex"]] [] options]'),
		_Utils_Tuple3('OnlineTest', 'new OnlineTest([height, width, title, members, containers, questions, next, check, hidden])', 'Html.div   [ ["height", height]\n                        , ["width", width]\n                        , ["margin", "auto auto auto auto"]\n                        , ["border-style", "solid"]\n                        , ["border-width", "medium"]\n                        , ["border-color", "rgb(85, 154, 243)"]\n                        , ["position", "relative"]\n                        , ["background-color", "rgb(214, 214, 214)"]] \n                        [] \n                        [ Html.script [] [] \n                            ["cur = 0;document.getElementById(\'q0\').style.visibility=\'visible\';"]\n                        , Html.div  [ ["background-color", "rgb(85, 154, 243)"]\n                                    , ["height", "25px"]] \n                                    [] \n                                    [title]\n                        , Html.div [] [] questions\n                        , Html.div [] [] [next]\n                        , Html.div [["visibility", hidden]] [["id", "checkbtn"]] [check]\n                        , Html.div [] [] containers]'),
		_Utils_Tuple3('ImgBtn', 'new ImgBtn([left, top, height, width, hint, id, onclick, imgsrc, tag])', 'Html.div   [ ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["position", "absolute"]]\n                        []\n                        [ Html.button   [ ["height", height]\n                                        , ["width", width]\n                                        , ["background", imgsrc]] \n                                        [ ["id", id]\n                                        , ["tag", tag]\n                                        , ["onclick", onclick]] []\n                        ]'),
		_Utils_Tuple3('Image', 'new Image([left, top, height, width, hint, src])', 'Html.div   [ ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["display", "flex"]\n                        , ["position", "absolute"]]\n                        []\n                        [ Html.div [] [] [hint]\n                        , Html.div  [ ["height", height]\n                                    , ["width", width]\n                                    , ["background", src]] \n                                    [] []]'),
		_Utils_Tuple3('TTTBtn', 'new TTTBtn([left, top, height, width, hint, id, onclick, tag, bg])', 'Html.div   [ ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["position", "absolute"]\n                        , ["background", bg]]\n                        []\n                        [ Html.button   [ ["height", height]\n                                        , ["width", width]] \n                                        [ ["id", id]\n                                        , ["tag", tag]\n                                        , ["onclick", onclick]] []]'),
		_Utils_Tuple3('MyLabel', 'new MyLabel([height, width, bgcolor, left, top, text, id, content])', 'Html.div   [ ["height", height]\n                        , ["width", width]\n                        , ["background-color", bgcolor]\n                        , ["margin-left", left]\n                        , ["margin-right", "auto"]\n                        , ["margin-top", top]\n                        , ["margin-bottom", "auto"]\n                        , ["display", "flex"]]\n                        []\n                        [ Html.div [["text-align", "left"]] [] [text]\n                        , Html.div [["text-align", "left"]] [["id", id]] [content]]'),
		_Utils_Tuple3('WordCounter', 'new WordCounter([height, width, title, members, containers, lb1, lb2, ta, btns])', 'Html.div   [ ["height", height]\n                        , ["width", width]\n                        , ["margin", "auto auto auto auto"]\n                        , ["border-style", "solid"]\n                        , ["border-width", "medium"]\n                        , ["border-color", "rgb(85, 154, 243)"]\n                        , ["position", "relative"]\n                        , ["background-color", "rgb(214, 214, 214)"]] \n                        [] \n                        [ Html.div  [ ["background-color", "rgb(85, 154, 243)"]\n                                    , ["height", "25px"]] \n                                    [] \n                                    [title]\n                        , Html.div [] []    [ lb1, lb2, ta\n                                            , Html.div [["position", "relative"]] [] btns]\n                        , Html.div [] [] containers]')
	]);
var $author$project$OOP$Objects$O2HTranslator$expandListAttr = F5(
	function (ls, id, dict, userDefTemps, state) {
		switch (ls.$) {
			case 'VCons':
				var v1 = ls.a;
				var v2 = ls.b;
				if (v1.$ === 'VNew') {
					var _v36 = A5($author$project$OOP$Objects$O2HTranslator$object2Html, v1, id, dict, userDefTemps, state);
					var v1_ = _v36.a;
					var id1 = _v36.b;
					var dict1 = _v36.c;
					var _v37 = A5($author$project$OOP$Objects$O2HTranslator$expandListAttr, v2, id1, dict1, userDefTemps, state);
					var v2_ = _v37.a;
					var id2 = _v37.b;
					var dict2 = _v37.c;
					return _Utils_Tuple3(
						A2(
							$author$project$OOP$Syntax$VCons,
							$author$project$OOP$Objects$O2HTranslator$addListTag(v1_),
							v2_),
						id2,
						dict2);
				} else {
					var _v38 = A5($author$project$OOP$Objects$O2HTranslator$expandListAttr, v2, id, dict, userDefTemps, state);
					var v2_ = _v38.a;
					var id2 = _v38.b;
					var dict2 = _v38.c;
					return _Utils_Tuple3(
						A2($author$project$OOP$Syntax$VCons, v1, v2_),
						id2,
						dict2);
				}
			case 'VNil':
				return _Utils_Tuple3($author$project$OOP$Syntax$VNil, id, dict);
			default:
				return _Utils_Tuple3(
					$author$project$OOP$Syntax$VError('Expand can only be used on List.'),
					-1,
					_List_Nil);
		}
	});
var $author$project$OOP$Objects$O2HTranslator$object2Html = F5(
	function (object, id, oenvDict, userDefTemps, state) {
		if (object.$ === 'VNew') {
			var _class = object.a;
			var res1 = A2(
				$author$project$OOP$Objects$Templates$findTemplateByClass,
				_class,
				$author$project$OOP$Objects$Templates$parseTemplates(
					_Utils_ap($author$project$OOP$Objects$Templates$templates, userDefTemps)));
			if (res1.$ === 'Just') {
				var _v29 = res1.a;
				var objectPattern = _v29.a;
				var htmlPattern = _v29.b;
				var res2 = A6($author$project$OOP$Objects$O2HTranslator$objectMatch, object, objectPattern, id + 1, oenvDict, userDefTemps, state);
				if (res2.$ === 'Just') {
					var _v31 = res2.a;
					var henv = _v31.a;
					var id_ = _v31.b;
					var _v32 = _v31.c;
					var oenv = _v32.a;
					var oenvDict_ = _v32.b;
					return _Utils_Tuple3(
						A2(
							$author$project$OOP$Objects$O2HTranslator$addObjectID,
							_class + ('-' + $elm$core$Debug$toString(id)),
							A3($author$project$OOP$Objects$O2HTranslator$htmlSubst, henv, htmlPattern, id)),
						id_,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(id, oenv),
							oenvDict_));
				} else {
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VError('Object Match Error.'),
						-1,
						_List_Nil);
				}
			} else {
				var _v33 = A2($elm$core$Debug$log, 'class', _class);
				return _Utils_Tuple3(
					$author$project$OOP$Syntax$VError('No Such Class : 01.'),
					-1,
					_List_Nil);
			}
		} else {
			return _Utils_Tuple3(
				$author$project$OOP$Syntax$VError('Object To Html Error'),
				-1,
				_List_Nil);
		}
	});
var $author$project$OOP$Objects$O2HTranslator$objectMatch = F6(
	function (object, op, id, dict, userDefTemps, state) {
		objectMatch:
		while (true) {
			var _v0 = _Utils_Tuple2(object, op);
			_v0$3:
			while (true) {
				switch (_v0.a.$) {
					case 'VNew':
						if (_v0.b.$ === 'TNew') {
							var _v1 = _v0.a;
							var vc = _v1.a;
							var vargs = _v1.b;
							var _v2 = _v0.b;
							var tc = _v2.b;
							var targs = _v2.c;
							if (_Utils_eq(vc, tc)) {
								var $temp$object = vargs,
									$temp$op = targs,
									$temp$id = id,
									$temp$dict = dict,
									$temp$userDefTemps = userDefTemps,
									$temp$state = state;
								object = $temp$object;
								op = $temp$op;
								id = $temp$id;
								dict = $temp$dict;
								userDefTemps = $temp$userDefTemps;
								state = $temp$state;
								continue objectMatch;
							} else {
								return $elm$core$Maybe$Nothing;
							}
						} else {
							break _v0$3;
						}
					case 'VCons':
						if (_v0.b.$ === 'TList') {
							var _v3 = _v0.a;
							var v1 = _v3.a;
							var v2 = _v3.b;
							var _v4 = _v0.b;
							var t1 = _v4.b;
							var t2 = _v4.c;
							var _v5 = _Utils_Tuple2(v1, t1);
							if (_v5.b.$ === 'TVar') {
								switch (_v5.a.$) {
									case 'VNew':
										var _v6 = _v5.a;
										var _v7 = _v5.b;
										var s = _v7.b;
										var _v8 = A5($author$project$OOP$Objects$O2HTranslator$object2Html, v1, id, dict, userDefTemps, state);
										var v1_ = _v8.a;
										var id1 = _v8.b;
										var dict1 = _v8.c;
										return A2(
											$elm$core$Maybe$map,
											function (_v9) {
												var henv_ = _v9.a;
												var id2 = _v9.b;
												var _v10 = _v9.c;
												var oenv_ = _v10.a;
												var dict2 = _v10.b;
												return _Utils_Tuple3(
													A2(
														$elm$core$List$cons,
														_Utils_Tuple2(s, v1_),
														henv_),
													id2,
													_Utils_Tuple2(
														A2(
															$elm$core$List$cons,
															_Utils_Tuple2(s, v1),
															oenv_),
														dict2));
											},
											A6($author$project$OOP$Objects$O2HTranslator$objectMatch, v2, t2, id1, dict1, userDefTemps, state));
									case 'VLoc':
										var n = _v5.a.a;
										var _v11 = _v5.b;
										var s = _v11.b;
										return A2(
											$elm$core$Maybe$andThen,
											function (refVal) {
												if (refVal.$ === 'VCons') {
													var _v13 = A5($author$project$OOP$Objects$O2HTranslator$expandListAttr, refVal, id, dict, userDefTemps, state);
													var v1_ = _v13.a;
													var id1 = _v13.b;
													var dict1 = _v13.c;
													return A2(
														$elm$core$Maybe$map,
														function (_v14) {
															var henv_ = _v14.a;
															var id2 = _v14.b;
															var _v15 = _v14.c;
															var oenv_ = _v15.a;
															var dict2 = _v15.b;
															return _Utils_Tuple3(
																A2(
																	$elm$core$List$cons,
																	_Utils_Tuple2(s, v1_),
																	henv_),
																id2,
																_Utils_Tuple2(
																	A2(
																		$elm$core$List$cons,
																		_Utils_Tuple2(
																			s,
																			$author$project$OOP$Syntax$VLoc(n)),
																		oenv_),
																	dict2));
														},
														A6($author$project$OOP$Objects$O2HTranslator$objectMatch, v2, t2, id1, dict1, userDefTemps, state));
												} else {
													return A2(
														$elm$core$Maybe$map,
														function (_v16) {
															var henv_ = _v16.a;
															var id2 = _v16.b;
															var _v17 = _v16.c;
															var oenv_ = _v17.a;
															var dict2 = _v17.b;
															return _Utils_Tuple3(
																A2(
																	$elm$core$List$cons,
																	_Utils_Tuple2(s, refVal),
																	henv_),
																id2,
																_Utils_Tuple2(
																	A2(
																		$elm$core$List$cons,
																		_Utils_Tuple2(
																			s,
																			$author$project$OOP$Syntax$VLoc(n)),
																		oenv_),
																	dict2));
														},
														A6($author$project$OOP$Objects$O2HTranslator$objectMatch, v2, t2, id, dict, userDefTemps, state));
												}
											},
											A2($author$project$Utils$nth, n, state));
									case 'VCons':
										var _v18 = _v5.a;
										var _v19 = _v5.b;
										var s = _v19.b;
										var _v20 = A5($author$project$OOP$Objects$O2HTranslator$expandListAttr, v1, id, dict, userDefTemps, state);
										var v1_ = _v20.a;
										var id1 = _v20.b;
										var dict1 = _v20.c;
										return A2(
											$elm$core$Maybe$map,
											function (_v21) {
												var henv_ = _v21.a;
												var id2 = _v21.b;
												var _v22 = _v21.c;
												var oenv_ = _v22.a;
												var dict2 = _v22.b;
												return _Utils_Tuple3(
													A2(
														$elm$core$List$cons,
														_Utils_Tuple2(s, v1_),
														henv_),
													id2,
													_Utils_Tuple2(
														A2(
															$elm$core$List$cons,
															_Utils_Tuple2(s, v1),
															oenv_),
														dict2));
											},
											A6($author$project$OOP$Objects$O2HTranslator$objectMatch, v2, t2, id1, dict1, userDefTemps, state));
									default:
										var _v23 = _v5.b;
										var s = _v23.b;
										return A2(
											$elm$core$Maybe$map,
											function (_v24) {
												var henv_ = _v24.a;
												var id2 = _v24.b;
												var _v25 = _v24.c;
												var oenv_ = _v25.a;
												var dict2 = _v25.b;
												return _Utils_Tuple3(
													A2(
														$elm$core$List$cons,
														_Utils_Tuple2(s, v1),
														henv_),
													id2,
													_Utils_Tuple2(
														A2(
															$elm$core$List$cons,
															_Utils_Tuple2(s, v1),
															oenv_),
														dict2));
											},
											A6($author$project$OOP$Objects$O2HTranslator$objectMatch, v2, t2, id, dict, userDefTemps, state));
								}
							} else {
								return $elm$core$Maybe$Nothing;
							}
						} else {
							break _v0$3;
						}
					case 'VNil':
						if (_v0.b.$ === 'TEmpList') {
							var _v26 = _v0.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple3(
									_List_Nil,
									id,
									_Utils_Tuple2(_List_Nil, dict)));
						} else {
							break _v0$3;
						}
					default:
						break _v0$3;
				}
			}
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $author$project$OOP$Printer$Value$printString = function (t) {
	if (t.$ === 'VString') {
		var s = t.a;
		return s;
	} else {
		return 'Print String Error : 01.';
	}
};
var $author$project$OOP$Printer$Value$printOtherPro = function (pro) {
	if (((pro.$ === 'VCons') && (pro.b.$ === 'VCons')) && (pro.b.b.$ === 'VNil')) {
		var n = pro.a;
		var _v1 = pro.b;
		var v = _v1.a;
		var _v2 = _v1.b;
		return $author$project$OOP$Printer$Value$printString(n) + ('=\"' + ($author$project$OOP$Printer$Value$printString(v) + '\" '));
	} else {
		return 'Print Other Property Error.';
	}
};
var $author$project$OOP$Printer$Value$printAttr = function (attr) {
	switch (attr.$) {
		case 'VCons':
			if (attr.b.$ === 'VNil') {
				var x = attr.a;
				var _v1 = attr.b;
				return $author$project$OOP$Printer$Value$printOtherPro(x);
			} else {
				var x = attr.a;
				var xs = attr.b;
				return $author$project$OOP$Printer$Value$printOtherPro(x) + (' ' + $author$project$OOP$Printer$Value$printAttr(xs));
			}
		case 'VNil':
			return '';
		default:
			return 'Print Attributions Error.';
	}
};
var $author$project$OOP$Printer$Value$printProValues = function (ls) {
	if (ls.$ === 'VCons') {
		if (ls.b.$ === 'VNil') {
			var x = ls.a;
			var _v1 = ls.b;
			return $author$project$OOP$Printer$Value$printString(x) + '; ';
		} else {
			var x = ls.a;
			var xs = ls.b;
			return $author$project$OOP$Printer$Value$printString(x) + (' ' + $author$project$OOP$Printer$Value$printProValues(xs));
		}
	} else {
		return 'Print Property Values Error.';
	}
};
var $author$project$OOP$Printer$Value$printProperty = function (pro) {
	if (pro.$ === 'VCons') {
		var s = pro.a;
		var xs = pro.b;
		var value = $author$project$OOP$Printer$Value$printProValues(xs);
		var name = $author$project$OOP$Printer$Value$printString(s);
		return name + (': ' + value);
	} else {
		return 'Print Property Error.';
	}
};
var $author$project$OOP$Printer$Value$printStyle = function (style) {
	if (style.$ === 'VCons') {
		if (style.b.$ === 'VNil') {
			var x = style.a;
			var _v1 = style.b;
			return $author$project$OOP$Printer$Value$printProperty(x);
		} else {
			var x = style.a;
			var xs = style.b;
			var str2 = $author$project$OOP$Printer$Value$printStyle(xs);
			var str1 = $author$project$OOP$Printer$Value$printProperty(x);
			return _Utils_ap(str1, str2);
		}
	} else {
		return 'Print Style Error.';
	}
};
var $author$project$OOP$Printer$Value$printChilds = function (childs) {
	switch (childs.$) {
		case 'VNil':
			return '';
		case 'VCons':
			var c = childs.a;
			var cs = childs.b;
			switch (c.$) {
				case 'VHtml':
					return _Utils_ap(
						$author$project$OOP$Printer$Value$printValue(c),
						$author$project$OOP$Printer$Value$printChilds(cs));
				case 'VString':
					return _Utils_ap(
						$author$project$OOP$Printer$Value$printString(c),
						$author$project$OOP$Printer$Value$printChilds(cs));
				default:
					return 'Child Type Error.';
			}
		default:
			return 'Print Childs Error.';
	}
};
var $author$project$OOP$Printer$Value$printHTML = F4(
	function (nodeName, style, attr, childs) {
		if (nodeName === 'br') {
			return '<br>';
		} else {
			var strStyle = $author$project$OOP$Printer$Value$printStyle(style);
			var strChilds = $author$project$OOP$Printer$Value$printChilds(childs);
			var strAttr = $author$project$OOP$Printer$Value$printAttr(attr);
			var formatStyle = function () {
				if (style.$ === 'VNil') {
					return '';
				} else {
					return ' style=\"' + (strStyle + '\"');
				}
			}();
			return (nodeName === 'input') ? ('<' + (nodeName + (formatStyle + (' ' + ('contenteditable=\"true\" ' + (strAttr + '/>')))))) : ('<' + (nodeName + (formatStyle + (' ' + ('contenteditable=\"true\" ' + (strAttr + ('>' + (strChilds + ('</' + (nodeName + '>'))))))))));
		}
	});
var $author$project$OOP$Printer$Value$printList = F2(
	function (v, vs) {
		switch (vs.$) {
			case 'VNil':
				return $author$project$OOP$Printer$Value$printValue(v);
			case 'VCons':
				var v1 = vs.a;
				var v2 = vs.b;
				return $author$project$OOP$Printer$Value$printValue(v) + (', ' + A2($author$project$OOP$Printer$Value$printList, v1, v2));
			default:
				var _v2 = A2($elm$core$Debug$log, 'vs', vs);
				return 'Print List Error.';
		}
	});
var $author$project$OOP$Printer$Value$printValue = function (v) {
	switch (v.$) {
		case 'VInt':
			var n = v.a;
			return $elm$core$Debug$toString(n);
		case 'VFloat':
			var n = v.a;
			return $elm$core$Debug$toString(n);
		case 'VTrue':
			return 'true';
		case 'VFalse':
			return 'false';
		case 'VChar':
			var c = v.a;
			return '\'' + ($elm$core$String$fromChar(c) + '\'');
		case 'VString':
			var s = v.a;
			return '\"' + (s + '\"');
		case 'VCons':
			var v1 = v.a;
			var v2 = v.b;
			return '[' + (A2($author$project$OOP$Printer$Value$printList, v1, v2) + ']');
		case 'VNil':
			return '[]';
		case 'VClosure':
			return '<fn>';
		case 'VFix':
			return '<fix>';
		case 'VTuple2':
			var v1 = v.a;
			var v2 = v.b;
			return '( ' + ($author$project$OOP$Printer$Value$printValue(v1) + (', ' + ($author$project$OOP$Printer$Value$printValue(v2) + ' )')));
		case 'VTuple3':
			var v1 = v.a;
			var v2 = v.b;
			var v3 = v.c;
			return '( ' + ($author$project$OOP$Printer$Value$printValue(v1) + (', ' + ($author$project$OOP$Printer$Value$printValue(v2) + (', ' + ($author$project$OOP$Printer$Value$printValue(v3) + ' )')))));
		case 'VLoc':
			var n = v.a;
			return '<' + ($elm$core$Debug$toString(n) + '>');
		case 'VUnit':
			return '_';
		case 'VNew':
			var s = v.a;
			var arg = v.b;
			return 'new ' + (s + ('(' + ($author$project$OOP$Printer$Value$printValue(arg) + ')')));
		case 'VHtml':
			var s = v.a;
			var v1 = v.b;
			var v2 = v.c;
			var v3 = v.d;
			return A4($author$project$OOP$Printer$Value$printHTML, s, v1, v2, v3);
		default:
			var info = v.a;
			return info;
	}
};
var $author$project$OOP$Controller$ctrlHelper = F4(
	function (flag, objects_, templates, state) {
		if (flag) {
			var _v0 = A5($author$project$OOP$Objects$O2HTranslator$object2Html, objects_, 0, _List_Nil, templates, state);
			var val = _v0.a;
			var envDict = _v0.c;
			return _Utils_Tuple3(
				objects_,
				$author$project$OOP$Printer$Value$printValue(val),
				envDict);
		} else {
			return _Utils_Tuple3(
				$author$project$OOP$Syntax$VError('Error : 25.'),
				'',
				_List_Nil);
		}
	});
var $author$project$OOP$Controller$ctrlAddAfterObject = F2(
	function (objectID, model) {
		var _v0 = A4($author$project$OOP$Objects$Update$addObjectAfterObject, model.objectsOutput, 0, objectID, model.state);
		var _v1 = _v0.a;
		var flag = _v1.a;
		var objects_ = _v1.b;
		var state_ = _v0.b;
		return _Utils_Tuple2(
			A4($author$project$OOP$Controller$ctrlHelper, flag, objects_, model.templates, state_),
			state_);
	});
var $author$project$OOP$LangUtils$findClass = F2(
	function (_class, classtb) {
		findClass:
		while (true) {
			var _v0 = classtb;
			var classtb_ = _v0.b;
			if (classtb_.b) {
				var _v2 = classtb_.a;
				var _v3 = _v2.b;
				var _v4 = _v3.a;
				var c = _v4.a;
				var f = _v4.b;
				var fs = _v3.b;
				var ms = _v3.c;
				var cds = classtb_.b;
				if (_Utils_eq(c, _class)) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							_List_Nil,
							_Utils_Tuple3(
								_Utils_Tuple2(c, f),
								fs,
								ms)));
				} else {
					var $temp$class = _class,
						$temp$classtb = _Utils_Tuple2(_List_Nil, cds);
					_class = $temp$class;
					classtb = $temp$classtb;
					continue findClass;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$OOP$LangUtils$getFields = F2(
	function (_class, classtb) {
		var res = A2($author$project$OOP$LangUtils$findClass, _class, classtb);
		if (res.$ === 'Just') {
			var _v1 = res.a;
			var _v2 = _v1.b;
			var _v3 = _v2.a;
			var f = _v3.b;
			var _v4 = _v2.b;
			var fs = _v4.b;
			return (f === 'Object') ? fs : _Utils_ap(
				A2($author$project$OOP$LangUtils$getFields, f, classtb),
				fs);
		} else {
			return _List_Nil;
		}
	});
var $author$project$OOP$Syntax$VFloat = function (a) {
	return {$: 'VFloat', a: a};
};
var $author$project$OOP$Syntax$VInt = function (a) {
	return {$: 'VInt', a: a};
};
var $author$project$OOP$Syntax$VTrue = {$: 'VTrue'};
var $author$project$OOP$Objects$Update$iterFieldsRetDefault = function (fields) {
	if (fields.b) {
		var _v1 = fields.a;
		var typ = _v1.c;
		var rest = fields.b;
		var v = function () {
			switch (typ) {
				case 'String':
					return $author$project$OOP$Syntax$VString('Unknown');
				case 'Int':
					return $author$project$OOP$Syntax$VInt(0);
				case 'Float':
					return $author$project$OOP$Syntax$VFloat(0);
				case 'Bool':
					return $author$project$OOP$Syntax$VTrue;
				default:
					return (A3($elm$core$String$slice, 0, 4, typ) === 'List') ? $author$project$OOP$Syntax$VNil : ((A3($elm$core$String$slice, 0, 3, typ) === 'Ref') ? $author$project$OOP$Syntax$VLoc(0) : $author$project$OOP$Syntax$VError('Wrong Field Type, No Default Value.'));
			}
		}();
		return A2(
			$author$project$OOP$Syntax$VCons,
			v,
			$author$project$OOP$Objects$Update$iterFieldsRetDefault(rest));
	} else {
		return $author$project$OOP$Syntax$VNil;
	}
};
var $author$project$OOP$Objects$Update$defaultObject = F2(
	function (_class, classtb) {
		var fields = A2($author$project$OOP$LangUtils$getFields, _class, classtb);
		return A2(
			$author$project$OOP$Syntax$VNew,
			_class,
			$author$project$OOP$Objects$Update$iterFieldsRetDefault(fields));
	});
var $author$project$OOP$Objects$Update$addObjectInArgs = F6(
	function (args, iter, fid, _class, classtb, state) {
		switch (args.$) {
			case 'VCons':
				var v1 = args.a;
				var v2 = args.b;
				if (_Utils_eq(iter, fid)) {
					switch (v1.$) {
						case 'VCons':
							return _Utils_Tuple2(
								A2(
									$author$project$OOP$Syntax$VCons,
									A2(
										$author$project$OOP$Syntax$VCons,
										A2($author$project$OOP$Objects$Update$defaultObject, _class, classtb),
										v1),
									v2),
								state);
						case 'VNil':
							return _Utils_Tuple2(
								A2(
									$author$project$OOP$Syntax$VCons,
									A2(
										$author$project$OOP$Syntax$VCons,
										A2($author$project$OOP$Objects$Update$defaultObject, _class, classtb),
										v1),
									v2),
								state);
						case 'VLoc':
							var n = v1.a;
							var res = A2($author$project$Utils$nth, n, state);
							if (res.$ === 'Just') {
								var val = res.a;
								return _Utils_Tuple2(
									A2($author$project$OOP$Syntax$VCons, v1, v2),
									A3(
										$author$project$OOP$Utils$replace,
										n,
										A2(
											$author$project$OOP$Syntax$VCons,
											A2($author$project$OOP$Objects$Update$defaultObject, _class, classtb),
											val),
										state));
							} else {
								return _Utils_Tuple2(
									$author$project$OOP$Syntax$VError('No Such Variable : 09.'),
									state);
							}
						default:
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VError('Objects cannot be added to non-list arguments.'),
								state);
					}
				} else {
					var _v3 = A6($author$project$OOP$Objects$Update$addObjectInArgs, v2, iter + 1, fid, _class, classtb, state);
					var v2_ = _v3.a;
					var state_ = _v3.b;
					return _Utils_Tuple2(
						A2($author$project$OOP$Syntax$VCons, v1, v2_),
						state_);
				}
			case 'VNil':
				return _Utils_Tuple2($author$project$OOP$Syntax$VNil, state);
			default:
				return _Utils_Tuple2(
					$author$project$OOP$Syntax$VError('Args is Not a List : 03.'),
					state);
		}
	});
var $author$project$OOP$Objects$Update$findTypeInFields = F3(
	function (iter, id, fields) {
		findTypeInFields:
		while (true) {
			if (fields.b) {
				var _v1 = fields.a;
				var typ = _v1.c;
				var rest = fields.b;
				if (_Utils_eq(iter, id)) {
					var _v2 = A2($elm$core$String$split, '<', typ);
					_v2$2:
					while (true) {
						if (_v2.b && _v2.b.b) {
							if (!_v2.b.b.b) {
								if (_v2.a === 'List') {
									var _v3 = _v2.b;
									var typ_ = _v3.a;
									return A3(
										$elm$core$String$slice,
										0,
										$elm$core$String$length(typ_) - 1,
										typ_);
								} else {
									break _v2$2;
								}
							} else {
								if (((_v2.a === 'Ref') && (_v2.b.a === 'List')) && (!_v2.b.b.b.b)) {
									var _v4 = _v2.b;
									var _v5 = _v4.b;
									var typ_ = _v5.a;
									return A3(
										$elm$core$String$slice,
										0,
										$elm$core$String$length(typ_) - 2,
										typ_);
								} else {
									break _v2$2;
								}
							}
						} else {
							break _v2$2;
						}
					}
					return 'Error';
				} else {
					var $temp$iter = iter + 1,
						$temp$id = id,
						$temp$fields = rest;
					iter = $temp$iter;
					id = $temp$id;
					fields = $temp$fields;
					continue findTypeInFields;
				}
			} else {
				return 'Error';
			}
		}
	});
var $author$project$OOP$Objects$Update$addObjectAtBegin = F6(
	function (objects, iter, oid, fid, classtb, state) {
		switch (objects.$) {
			case 'VNew':
				var c = objects.a;
				var args = objects.b;
				if (_Utils_eq(iter, oid)) {
					var fields = A2($author$project$OOP$LangUtils$getFields, c, classtb);
					var _class = A3($author$project$OOP$Objects$Update$findTypeInFields, 0, fid, fields);
					if (_class === 'Error') {
						return _Utils_Tuple2(
							_Utils_Tuple3(
								false,
								$author$project$OOP$Syntax$VError('The field to be added is not a list type.'),
								-1),
							state);
					} else {
						var _v2 = A6($author$project$OOP$Objects$Update$addObjectInArgs, args, 0, fid, _class, classtb, state);
						var args_ = _v2.a;
						var state_ = _v2.b;
						return _Utils_Tuple2(
							_Utils_Tuple3(
								true,
								A2($author$project$OOP$Syntax$VNew, c, args_),
								-1),
							state_);
					}
				} else {
					var _v3 = A6($author$project$OOP$Objects$Update$addObjectAtBegin, args, iter + 1, oid, fid, classtb, state);
					var _v4 = _v3.a;
					var flag = _v4.a;
					var args_ = _v4.b;
					var iter_ = _v4.c;
					var state_ = _v3.b;
					return _Utils_Tuple2(
						_Utils_Tuple3(
							flag,
							A2($author$project$OOP$Syntax$VNew, c, args_),
							iter_),
						state_);
				}
			case 'VCons':
				var v1 = objects.a;
				var v2 = objects.b;
				var _v5 = A6($author$project$OOP$Objects$Update$addObjectAtBegin, v1, iter, oid, fid, classtb, state);
				var _v6 = _v5.a;
				var flag1 = _v6.a;
				var v1_ = _v6.b;
				var iter1 = _v6.c;
				var state1 = _v5.b;
				if (flag1) {
					return _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							A2($author$project$OOP$Syntax$VCons, v1_, v2),
							-1),
						state1);
				} else {
					var _v7 = A6($author$project$OOP$Objects$Update$addObjectAtBegin, v2, iter1, oid, fid, classtb, state1);
					var _v8 = _v7.a;
					var flag2 = _v8.a;
					var v2_ = _v8.b;
					var iter2 = _v8.c;
					var state2 = _v7.b;
					return flag2 ? _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							A2($author$project$OOP$Syntax$VCons, v1, v2_),
							-1),
						state2) : _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							A2($author$project$OOP$Syntax$VCons, v1, v2),
							iter2),
						state2);
				}
			case 'VLoc':
				var n = objects.a;
				var res = A2($author$project$Utils$nth, n, state);
				if (res.$ === 'Just') {
					var val = res.a;
					var _v10 = A6($author$project$OOP$Objects$Update$addObjectAtBegin, val, iter, oid, fid, classtb, state);
					var _v11 = _v10.a;
					var flag = _v11.a;
					var val_ = _v11.b;
					var iter_ = _v11.c;
					var state_ = _v10.b;
					return flag ? _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							$author$project$OOP$Syntax$VLoc(n),
							-1),
						A3($author$project$OOP$Utils$replace, n, val_, state_)) : _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							$author$project$OOP$Syntax$VLoc(n),
							iter_),
						state_);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							$author$project$OOP$Syntax$VError('No Such Variable : 08.'),
							iter),
						state);
				}
			case 'VNil':
				return _Utils_Tuple2(
					_Utils_Tuple3(false, $author$project$OOP$Syntax$VNil, iter),
					state);
			case 'VString':
				var s = objects.a;
				return _Utils_Tuple2(
					_Utils_Tuple3(
						false,
						$author$project$OOP$Syntax$VString(s),
						iter),
					state);
			default:
				return _Utils_Tuple2(
					_Utils_Tuple3(
						false,
						$author$project$OOP$Syntax$VError('Not Within the Scope of Operation of Adding Object : 02.'),
						-1),
					state);
		}
	});
var $author$project$OOP$Controller$ctrlAddAtBegin = F2(
	function (info, model) {
		var _v0 = function () {
			var _v1 = A2($elm$core$String$split, '-', info);
			if ((((_v1.b && (_v1.a === 'List')) && _v1.b.b) && _v1.b.b.b) && (!_v1.b.b.b.b)) {
				var _v2 = _v1.b;
				var fid = _v2.a;
				var _v3 = _v2.b;
				var oid = _v3.a;
				return _Utils_Tuple2(oid, fid);
			} else {
				return _Utils_Tuple2('Error : 21.', '');
			}
		}();
		var id1 = _v0.a;
		var id2 = _v0.b;
		var _v4 = _Utils_Tuple2(
			$elm$core$String$toInt(id1),
			$elm$core$String$toInt(id2));
		if ((_v4.a.$ === 'Just') && (_v4.b.$ === 'Just')) {
			var objectID = _v4.a.a;
			var fieldID = _v4.b.a;
			var _v5 = A6($author$project$OOP$Objects$Update$addObjectAtBegin, model.objectsOutput, 0, objectID, fieldID, model.classTable, model.state);
			var _v6 = _v5.a;
			var flag = _v6.a;
			var objects_ = _v6.b;
			var state_ = _v5.b;
			return _Utils_Tuple2(
				A4($author$project$OOP$Controller$ctrlHelper, flag, objects_, model.templates, state_),
				state_);
		} else {
			return _Utils_Tuple2(
				_Utils_Tuple3(
					$author$project$OOP$Syntax$VError('Error : 24.'),
					'',
					_List_Nil),
				model.state);
		}
	});
var $author$project$OOP$Objects$Update$deleteObject = F4(
	function (objects, iter, id, state) {
		switch (objects.$) {
			case 'VNew':
				var c = objects.a;
				var args = objects.b;
				var _v5 = A4($author$project$OOP$Objects$Update$deleteObject, args, iter + 1, id, state);
				var _v6 = _v5.a;
				var flag = _v6.a;
				var args_ = _v6.b;
				var iter_ = _v6.c;
				var state_ = _v5.b;
				return _Utils_Tuple2(
					_Utils_Tuple3(
						flag,
						A2($author$project$OOP$Syntax$VNew, c, args_),
						iter_),
					state_);
			case 'VCons':
				var v1 = objects.a;
				var v2 = objects.b;
				if (v1.$ === 'VNew') {
					return _Utils_eq(iter, id) ? _Utils_Tuple2(
						_Utils_Tuple3(true, v2, -1),
						state) : A5($author$project$OOP$Objects$Update$twoDeleteBranchMerge, v1, v2, iter, id, state);
				} else {
					return A5($author$project$OOP$Objects$Update$twoDeleteBranchMerge, v1, v2, iter, id, state);
				}
			case 'VLoc':
				var n = objects.a;
				var res = A2($author$project$Utils$nth, n, state);
				if (res.$ === 'Just') {
					var val = res.a;
					var _v9 = A4($author$project$OOP$Objects$Update$deleteObject, val, iter, id, state);
					var _v10 = _v9.a;
					var flag = _v10.a;
					var val_ = _v10.b;
					var iter_ = _v10.c;
					var state_ = _v9.b;
					return flag ? _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							$author$project$OOP$Syntax$VLoc(n),
							-1),
						A3($author$project$OOP$Utils$replace, n, val_, state_)) : _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							$author$project$OOP$Syntax$VLoc(n),
							iter_),
						state_);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							$author$project$OOP$Syntax$VError('No Such Variable : 07.'),
							iter),
						state);
				}
			case 'VNil':
				return _Utils_Tuple2(
					_Utils_Tuple3(false, $author$project$OOP$Syntax$VNil, iter),
					state);
			case 'VString':
				var s = objects.a;
				return _Utils_Tuple2(
					_Utils_Tuple3(
						false,
						$author$project$OOP$Syntax$VString(s),
						iter),
					state);
			default:
				return _Utils_Tuple2(
					_Utils_Tuple3(
						false,
						$author$project$OOP$Syntax$VError('Not Within the Scope of Operation of Deleting Object.'),
						-1),
					state);
		}
	});
var $author$project$OOP$Objects$Update$twoDeleteBranchMerge = F5(
	function (v1, v2, iter, id, state) {
		var _v0 = A4($author$project$OOP$Objects$Update$deleteObject, v1, iter, id, state);
		var _v1 = _v0.a;
		var flag1 = _v1.a;
		var v1_ = _v1.b;
		var iter1 = _v1.c;
		var state1 = _v0.b;
		if (flag1) {
			return _Utils_Tuple2(
				_Utils_Tuple3(
					true,
					A2($author$project$OOP$Syntax$VCons, v1_, v2),
					-1),
				state1);
		} else {
			var _v2 = A4($author$project$OOP$Objects$Update$deleteObject, v2, iter1, id, state1);
			var _v3 = _v2.a;
			var flag2 = _v3.a;
			var v2_ = _v3.b;
			var iter2 = _v3.c;
			var state2 = _v2.b;
			return flag2 ? _Utils_Tuple2(
				_Utils_Tuple3(
					true,
					A2($author$project$OOP$Syntax$VCons, v1, v2_),
					-1),
				state2) : _Utils_Tuple2(
				_Utils_Tuple3(
					false,
					A2($author$project$OOP$Syntax$VCons, v1, v2),
					iter2),
				state2);
		}
	});
var $author$project$OOP$Controller$ctrlDeleteObject = F2(
	function (objectID, model) {
		var _v0 = A4($author$project$OOP$Objects$Update$deleteObject, model.objectsOutput, 0, objectID, model.state);
		var _v1 = _v0.a;
		var flag = _v1.a;
		var objects_ = _v1.b;
		var state_ = _v0.b;
		return _Utils_Tuple2(
			A4($author$project$OOP$Controller$ctrlHelper, flag, objects_, model.templates, state_),
			state_);
	});
var $author$project$OOP$Objects$Update$findAncestorClasses = F2(
	function (_class, classtb) {
		var res = A2($author$project$OOP$LangUtils$findClass, _class, classtb);
		return A2(
			$elm$core$Maybe$andThen,
			function (_v0) {
				var _v1 = _v0.b;
				var _v2 = _v1.a;
				var father = _v2.b;
				return (father === 'Object') ? $elm$core$Maybe$Just(
					_List_fromArray(
						[father])) : A2(
					$elm$core$Maybe$map,
					function (ls) {
						return A2($elm$core$List$cons, father, ls);
					},
					A2($author$project$OOP$Objects$Update$findAncestorClasses, father, classtb));
			},
			res);
	});
var $author$project$OOP$Controller$ctrlFindModifiableClassList = F2(
	function (objectInfo, classtb) {
		var _v0 = A2($elm$core$String$split, '-', objectInfo);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var _class = _v0.a;
			var _v1 = _v0.b;
			var _v2 = A2($author$project$OOP$Objects$Update$findAncestorClasses, _class, classtb);
			if (_v2.$ === 'Just') {
				var ls = _v2.a;
				return _Utils_Tuple2(objectInfo, ls);
			} else {
				return _Utils_Tuple2(objectInfo, _List_Nil);
			}
		} else {
			return _Utils_Tuple2(objectInfo, _List_Nil);
		}
	});
var $author$project$OOP$LangUtils$appendValueList = F2(
	function (l1, l2) {
		switch (l1.$) {
			case 'VNil':
				return l2;
			case 'VCons':
				var v1 = l1.a;
				var vs1 = l1.b;
				return A2(
					$author$project$OOP$Syntax$VCons,
					v1,
					A2($author$project$OOP$LangUtils$appendValueList, vs1, l2));
			default:
				return $author$project$OOP$Syntax$VError('Operand Error : 06.');
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
var $author$project$OOP$LangUtils$vlength = function (v) {
	switch (v.$) {
		case 'VNil':
			return 0;
		case 'VCons':
			var vs = v.b;
			return 1 + $author$project$OOP$LangUtils$vlength(vs);
		case 'VString':
			var s = v.a;
			return $elm$core$String$length(s);
		default:
			return -99;
	}
};
var $author$project$OOP$LangUtils$vtake = F2(
	function (v, n) {
		switch (v.$) {
			case 'VNil':
				return $author$project$OOP$Syntax$VNil;
			case 'VCons':
				var v1 = v.a;
				var vs = v.b;
				return (!n) ? $author$project$OOP$Syntax$VNil : A2(
					$author$project$OOP$Syntax$VCons,
					v1,
					A2($author$project$OOP$LangUtils$vtake, vs, n - 1));
			case 'VString':
				var s = v.a;
				return $author$project$OOP$Syntax$VString(
					A2($elm$core$String$left, n, s));
			default:
				return $author$project$OOP$Syntax$VError('The Take function cannot be used on values other than lists and strings.');
		}
	});
var $author$project$OOP$Objects$Update$modifyArgs = F3(
	function (args, _class, classtb) {
		var ori_len = $author$project$OOP$LangUtils$vlength(args);
		var new_fields = A2($author$project$OOP$LangUtils$getFields, _class, classtb);
		var new_len = $elm$core$List$length(new_fields);
		if (_Utils_eq(ori_len, new_len)) {
			return args;
		} else {
			if (_Utils_cmp(ori_len, new_len) < 0) {
				var rest_fields = A2($elm$core$List$drop, ori_len, new_fields);
				return A2(
					$author$project$OOP$LangUtils$appendValueList,
					args,
					$author$project$OOP$Objects$Update$iterFieldsRetDefault(rest_fields));
			} else {
				return A2($author$project$OOP$LangUtils$vtake, args, new_len);
			}
		}
	});
var $author$project$OOP$Objects$Update$modifyClass = F6(
	function (objects, iter, id, _class, classtb, state) {
		switch (objects.$) {
			case 'VNew':
				var c = objects.a;
				var args = objects.b;
				if (_Utils_eq(iter, id)) {
					var args_ = A3($author$project$OOP$Objects$Update$modifyArgs, args, _class, classtb);
					return _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							A2($author$project$OOP$Syntax$VNew, _class, args_),
							-1),
						state);
				} else {
					var _v1 = A6($author$project$OOP$Objects$Update$modifyClass, args, iter + 1, id, _class, classtb, state);
					var _v2 = _v1.a;
					var flag = _v2.a;
					var v = _v2.b;
					var iter_ = _v2.c;
					var state_ = _v1.b;
					return _Utils_Tuple2(
						_Utils_Tuple3(
							flag,
							A2($author$project$OOP$Syntax$VNew, c, v),
							iter_),
						state_);
				}
			case 'VCons':
				var v1 = objects.a;
				var v2 = objects.b;
				var _v3 = A6($author$project$OOP$Objects$Update$modifyClass, v1, iter, id, _class, classtb, state);
				var _v4 = _v3.a;
				var flag1 = _v4.a;
				var v1_ = _v4.b;
				var iter1 = _v4.c;
				var state1 = _v3.b;
				if (flag1) {
					return _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							A2($author$project$OOP$Syntax$VCons, v1_, v2),
							-1),
						state1);
				} else {
					var _v5 = A6($author$project$OOP$Objects$Update$modifyClass, v2, iter1, id, _class, classtb, state1);
					var _v6 = _v5.a;
					var flag2 = _v6.a;
					var v2_ = _v6.b;
					var iter2 = _v6.c;
					var state2 = _v5.b;
					return flag2 ? _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							A2($author$project$OOP$Syntax$VCons, v1, v2_),
							-1),
						state2) : _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							A2($author$project$OOP$Syntax$VCons, v1, v2),
							iter2),
						state2);
				}
			case 'VLoc':
				var n = objects.a;
				var res = A2($author$project$Utils$nth, n, state);
				if (res.$ === 'Just') {
					var val = res.a;
					var _v8 = A6($author$project$OOP$Objects$Update$modifyClass, val, iter, id, _class, classtb, state);
					var _v9 = _v8.a;
					var flag = _v9.a;
					var val_ = _v9.b;
					var iter_ = _v9.c;
					var state_ = _v8.b;
					return flag ? _Utils_Tuple2(
						_Utils_Tuple3(
							true,
							$author$project$OOP$Syntax$VLoc(n),
							-1),
						A3($author$project$OOP$Utils$replace, n, val_, state_)) : _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							$author$project$OOP$Syntax$VLoc(n),
							iter_),
						state_);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple3(
							false,
							$author$project$OOP$Syntax$VError('No Such Variable : 06.'),
							iter),
						state);
				}
			case 'VNil':
				return _Utils_Tuple2(
					_Utils_Tuple3(false, $author$project$OOP$Syntax$VNil, iter),
					state);
			case 'VString':
				var s = objects.a;
				return _Utils_Tuple2(
					_Utils_Tuple3(
						false,
						$author$project$OOP$Syntax$VString(s),
						iter),
					state);
			default:
				return _Utils_Tuple2(
					_Utils_Tuple3(
						false,
						$author$project$OOP$Syntax$VError('Not Within the Scope of Operation of Modifying class.'),
						-1),
					state);
		}
	});
var $author$project$OOP$Controller$ctrlModifyClass = F2(
	function (objectInfo, model) {
		var _v0 = function () {
			var _v1 = A2($elm$core$String$split, '-', objectInfo);
			if ((_v1.b && _v1.b.b) && (!_v1.b.b.b)) {
				var c = _v1.a;
				var _v2 = _v1.b;
				var id = _v2.a;
				return _Utils_Tuple2(c, id);
			} else {
				return _Utils_Tuple2('Error : 20.', '');
			}
		}();
		var _class = _v0.a;
		var objectID = _v0.b;
		var _v3 = function () {
			var _v5 = $elm$core$String$toInt(objectID);
			if (_v5.$ === 'Just') {
				var objectID_ = _v5.a;
				return A6($author$project$OOP$Objects$Update$modifyClass, model.objectsOutput, 0, objectID_, _class, model.classTable, model.state);
			} else {
				return _Utils_Tuple2(
					_Utils_Tuple3(
						false,
						$author$project$OOP$Syntax$VError('Object ID Erro : 02.'),
						-1),
					model.state);
			}
		}();
		var _v4 = _v3.a;
		var flag = _v4.a;
		var objects_ = _v4.b;
		var state_ = _v3.b;
		return _Utils_Tuple2(
			A4($author$project$OOP$Controller$ctrlHelper, flag, objects_, model.templates, state_),
			state_);
	});
var $author$project$OOP$Utils$delete = F2(
	function (n, ls) {
		if (ls.b) {
			var v = ls.a;
			var res = ls.b;
			return (!n) ? res : A2(
				$elm$core$List$cons,
				v,
				A2($author$project$OOP$Utils$delete, n - 1, res));
		} else {
			return _List_Nil;
		}
	});
var $author$project$OOP$Preclude$Gui$guiLibrary = '\n    ';
var $author$project$OOP$Parser$ClassTable$classDefHelper = A2(
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
										function (spc1, self, spc2, spc3, father, spc4, spc5) {
											return _Utils_Tuple3(
												_List_fromArray(
													[spc1, spc2, spc3, spc4, spc5]),
												self,
												father);
										})),
								$elm$parser$Parser$symbol('Class')),
							$author$project$OOP$Parser$WhiteSpaces$mspaces),
						$author$project$OOP$Parser$Utils$varName),
					A2(
						$elm$parser$Parser$ignorer,
						$author$project$OOP$Parser$WhiteSpaces$mspaces,
						$elm$parser$Parser$symbol('Extends'))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			$author$project$OOP$Parser$Utils$varName),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$WhiteSpaces$mspaces,
			$elm$parser$Parser$symbol('{'))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$OOP$Parser$ClassTable$isnotTypeDelimiter = function (c) {
	return (!_Utils_eq(
		c,
		_Utils_chr(','))) && (!_Utils_eq(
		c,
		_Utils_chr(';')));
};
var $author$project$OOP$Parser$ClassTable$typeName = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompWhile($author$project$OOP$Parser$ClassTable$isnotTypeDelimiter));
var $author$project$OOP$Parser$ClassTable$fieldList = function (revFields) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
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
											F6(
												function (spc1, f, spc2, spc3, typ, spc4) {
													return $elm$parser$Parser$Loop(
														A2(
															$elm$core$List$cons,
															_Utils_Tuple3(
																_List_fromArray(
																	[spc1, spc2, spc3, spc4]),
																f,
																typ),
															revFields));
												})),
										$elm$parser$Parser$symbol(',')),
									$author$project$OOP$Parser$WhiteSpaces$mspaces),
								$author$project$OOP$Parser$Utils$varName),
							A2(
								$elm$parser$Parser$ignorer,
								$author$project$OOP$Parser$WhiteSpaces$mspaces,
								$elm$parser$Parser$symbol(':'))),
						$author$project$OOP$Parser$WhiteSpaces$mspaces),
					$author$project$OOP$Parser$ClassTable$typeName),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
				A2(
				$elm$parser$Parser$map,
				function (_v0) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revFields));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
var $author$project$OOP$Parser$ClassTable$fields = A2(
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
							$elm$parser$Parser$succeed(
								F7(
									function (f, spc1, spc2, typ, spc3, fl, spc4) {
										return _Utils_Tuple2(
											_List_fromArray(
												[spc4]),
											A2(
												$elm$core$List$cons,
												_Utils_Tuple3(
													_List_fromArray(
														[spc1, spc2, spc3]),
													f,
													typ),
												fl));
									})),
							$author$project$OOP$Parser$Utils$varName),
						A2(
							$elm$parser$Parser$ignorer,
							$author$project$OOP$Parser$WhiteSpaces$mspaces,
							$elm$parser$Parser$symbol(':'))),
					$author$project$OOP$Parser$WhiteSpaces$mspaces),
				$author$project$OOP$Parser$ClassTable$typeName),
			$author$project$OOP$Parser$WhiteSpaces$mspaces),
		A2(
			$elm$parser$Parser$ignorer,
			A2($elm$parser$Parser$loop, _List_Nil, $author$project$OOP$Parser$ClassTable$fieldList),
			$elm$parser$Parser$symbol(';'))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$ClassTable$method = A2(
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
							$elm$parser$Parser$succeed(
								F7(
									function (name, pat, spc1, spc2, t, spc3, spc4) {
										return _Utils_Tuple2(
											_List_fromArray(
												[spc1, spc2, spc3, spc4]),
											_Utils_Tuple3(name, pat, t));
									})),
							A2(
								$elm$parser$Parser$ignorer,
								$author$project$OOP$Parser$Utils$varName,
								$elm$parser$Parser$symbol('('))),
						A2(
							$elm$parser$Parser$ignorer,
							$author$project$OOP$Parser$Pattern$pattern,
							$elm$parser$Parser$symbol(')'))),
					A2(
						$elm$parser$Parser$ignorer,
						$author$project$OOP$Parser$WhiteSpaces$mspaces,
						$elm$parser$Parser$symbol('{'))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$OOP$Parser$Term$term,
				$elm$parser$Parser$symbol('}'))),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$WhiteSpaces$mspaces,
			$elm$parser$Parser$symbol(';'))),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$ClassTable$methodList = function (revMethods) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					function (f) {
						return $elm$parser$Parser$Loop(
							A2($elm$core$List$cons, f, revMethods));
					}),
				$author$project$OOP$Parser$ClassTable$method),
				A2(
				$elm$parser$Parser$map,
				function (_v0) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revMethods));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
var $author$project$OOP$Parser$ClassTable$methods = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (m, ml) {
					return _Utils_Tuple2(
						_List_Nil,
						A2($elm$core$List$cons, m, ml));
				})),
		$author$project$OOP$Parser$ClassTable$method),
	A2($elm$parser$Parser$loop, _List_Nil, $author$project$OOP$Parser$ClassTable$methodList));
var $author$project$OOP$Parser$ClassTable$classDef = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$backtrackable(
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed(
								F4(
									function (_v0, fs, ms, spc6) {
										var spcs = _v0.a;
										var self = _v0.b;
										var father = _v0.c;
										return _Utils_Tuple2(
											_Utils_ap(
												spcs,
												_List_fromArray(
													[spc6])),
											_Utils_Tuple3(
												_Utils_Tuple2(self, father),
												fs,
												ms));
									})),
							$author$project$OOP$Parser$ClassTable$classDefHelper),
						$author$project$OOP$Parser$ClassTable$fields),
					A2(
						$elm$parser$Parser$ignorer,
						$author$project$OOP$Parser$ClassTable$methods,
						$elm$parser$Parser$symbol('}'))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces)),
			$elm$parser$Parser$backtrackable(
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed(
							F3(
								function (_v1, fs, spc6) {
									var spcs = _v1.a;
									var self = _v1.b;
									var father = _v1.c;
									return _Utils_Tuple2(
										_Utils_ap(
											spcs,
											_List_fromArray(
												[spc6])),
										_Utils_Tuple3(
											_Utils_Tuple2(self, father),
											fs,
											_Utils_Tuple2(_List_Nil, _List_Nil)));
								})),
						$author$project$OOP$Parser$ClassTable$classDefHelper),
					A2(
						$elm$parser$Parser$ignorer,
						$author$project$OOP$Parser$ClassTable$fields,
						$elm$parser$Parser$symbol('}'))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces)),
			$elm$parser$Parser$backtrackable(
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed(
							F3(
								function (_v2, ms, spc6) {
									var spcs = _v2.a;
									var self = _v2.b;
									var father = _v2.c;
									return _Utils_Tuple2(
										_Utils_ap(
											spcs,
											_List_fromArray(
												[spc6])),
										_Utils_Tuple3(
											_Utils_Tuple2(self, father),
											_Utils_Tuple2(_List_Nil, _List_Nil),
											ms));
								})),
						$author$project$OOP$Parser$ClassTable$classDefHelper),
					A2(
						$elm$parser$Parser$ignorer,
						$author$project$OOP$Parser$ClassTable$methods,
						$elm$parser$Parser$symbol('}'))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces)),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (_v3, spc6) {
							var spcs = _v3.a;
							var self = _v3.b;
							var father = _v3.c;
							return _Utils_Tuple2(
								_Utils_ap(
									spcs,
									_List_fromArray(
										[spc6])),
								_Utils_Tuple3(
									_Utils_Tuple2(self, father),
									_Utils_Tuple2(_List_Nil, _List_Nil),
									_Utils_Tuple2(_List_Nil, _List_Nil)));
						})),
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$OOP$Parser$ClassTable$classDefHelper,
					$elm$parser$Parser$symbol('}'))),
			$author$project$OOP$Parser$WhiteSpaces$mspaces)
		]));
var $author$project$OOP$Parser$ClassTable$classList = function (revClasses) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					function (c) {
						return $elm$parser$Parser$Loop(
							A2($elm$core$List$cons, c, revClasses));
					}),
				$author$project$OOP$Parser$ClassTable$classDef),
				A2(
				$elm$parser$Parser$map,
				function (_v0) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revClasses));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
var $author$project$OOP$Parser$ClassTable$clt = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed(
				F3(
					function (c, cl, spc) {
						return _Utils_Tuple2(
							_List_fromArray(
								[spc]),
							A2($elm$core$List$cons, c, cl));
					})),
			$author$project$OOP$Parser$ClassTable$classDef),
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$OOP$Parser$ClassTable$classList)),
	$author$project$OOP$Parser$WhiteSpaces$mspaces);
var $author$project$OOP$Parser$ClassTable$parse = $elm$parser$Parser$run(
	A2($elm$parser$Parser$ignorer, $author$project$OOP$Parser$ClassTable$clt, $elm$parser$Parser$end));
var $author$project$OOP$Preclude$Gui$parsedGui = function () {
	var _v0 = $author$project$OOP$Parser$ClassTable$parse($author$project$OOP$Preclude$Gui$guiLibrary);
	if (_v0.$ === 'Ok') {
		var clt = _v0.a;
		return clt;
	} else {
		return _Utils_Tuple2(_List_Nil, _List_Nil);
	}
}();
var $author$project$OOP$Preclude$Gui$assemble = function (_v0) {
	var ws = _v0.a;
	var ls1 = _v0.b;
	var _v1 = $author$project$OOP$Preclude$Gui$parsedGui;
	var ls2 = _v1.b;
	return _Utils_Tuple2(
		ws,
		_Utils_ap(ls2, ls1));
};
var $author$project$OOP$Preclude$Library$assemble = F2(
	function (pre, term) {
		switch (pre.$) {
			case 'TLet':
				var ws = pre.a;
				var p = pre.b;
				var t1 = pre.c;
				var t2 = pre.d;
				switch (t2.$) {
					case 'TUnit':
						return A4($author$project$OOP$Syntax$TLet, ws, p, t1, term);
					case 'TVar':
						return A4($author$project$OOP$Syntax$TLet, ws, p, t1, term);
					default:
						return A4(
							$author$project$OOP$Syntax$TLet,
							ws,
							p,
							t1,
							A2($author$project$OOP$Preclude$Library$assemble, t2, term));
				}
			case 'TLetrec':
				var ws = pre.a;
				var p = pre.b;
				var t1 = pre.c;
				var t2 = pre.d;
				if (t2.$ === 'TUnit') {
					return A4($author$project$OOP$Syntax$TLetrec, ws, p, t1, term);
				} else {
					return A4(
						$author$project$OOP$Syntax$TLetrec,
						ws,
						p,
						t1,
						A2($author$project$OOP$Preclude$Library$assemble, t2, term));
				}
			case 'TError':
				var info = pre.a;
				return $author$project$OOP$Syntax$TError(info);
			default:
				return $author$project$OOP$Syntax$TError('Preclude Error.');
		}
	});
var $author$project$OOP$Syntax$TFix = F2(
	function (a, b) {
		return {$: 'TFix', a: a, b: b};
	});
var $author$project$OOP$Syntax$VClosure = F3(
	function (a, b, c) {
		return {$: 'VClosure', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$VFalse = {$: 'VFalse'};
var $author$project$OOP$Syntax$VFix = function (a) {
	return {$: 'VFix', a: a};
};
var $author$project$OOP$Syntax$VTuple2 = F2(
	function (a, b) {
		return {$: 'VTuple2', a: a, b: b};
	});
var $author$project$OOP$Syntax$VTuple3 = F3(
	function (a, b, c) {
		return {$: 'VTuple3', a: a, b: b, c: c};
	});
var $author$project$OOP$Syntax$VUnit = {$: 'VUnit'};
var $author$project$OOP$LangUtils$findFieldsIndex = F2(
	function (s, env) {
		findFieldsIndex:
		while (true) {
			if (env.b) {
				var _v1 = env.a;
				var n = _v1.a;
				var _v2 = _v1.b;
				var x = _v2.b;
				var env_ = env.b;
				if (_Utils_eq(s, x)) {
					return n;
				} else {
					var $temp$s = s,
						$temp$env = env_;
					s = $temp$s;
					env = $temp$env;
					continue findFieldsIndex;
				}
			} else {
				return -1;
			}
		}
	});
var $author$project$OOP$LangUtils$findIndexValueList = F2(
	function (id, val) {
		findIndexValueList:
		while (true) {
			switch (val.$) {
				case 'VCons':
					var v = val.a;
					var vs = val.b;
					if (!id) {
						return $elm$core$Maybe$Just(v);
					} else {
						var $temp$id = id - 1,
							$temp$val = vs;
						id = $temp$id;
						val = $temp$val;
						continue findIndexValueList;
					}
				case 'VNil':
					return $elm$core$Maybe$Nothing;
				default:
					return $elm$core$Maybe$Just(
						$author$project$OOP$Syntax$VError('Args is Not a List : 01.'));
			}
		}
	});
var $author$project$OOP$LangUtils$findIndexMethods = F2(
	function (m, methods) {
		findIndexMethods:
		while (true) {
			var _v0 = methods;
			var ms = _v0.b;
			if (ms.b) {
				var _v2 = ms.a;
				var ws = _v2.a;
				var _v3 = _v2.b;
				var m_ = _v3.a;
				var p = _v3.b;
				var t = _v3.c;
				var ms_ = ms.b;
				if (_Utils_eq(m, m_)) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							ws,
							_Utils_Tuple3(m, p, t)));
				} else {
					var $temp$m = m,
						$temp$methods = _Utils_Tuple2(_List_Nil, ms_);
					m = $temp$m;
					methods = $temp$methods;
					continue findIndexMethods;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$OOP$LangUtils$findMethod = F3(
	function (m, c, classtb) {
		findMethod:
		while (true) {
			var res = A2($author$project$OOP$LangUtils$findClass, c, classtb);
			if (res.$ === 'Just') {
				var _v1 = res.a;
				var _v2 = _v1.b;
				var _v3 = _v2.a;
				var f = _v3.b;
				var ms = _v2.c;
				if (f === 'Object') {
					return A2(
						$elm$core$Maybe$map,
						function (a) {
							return _Utils_Tuple2(c, a);
						},
						A2($author$project$OOP$LangUtils$findIndexMethods, m, ms));
				} else {
					var _v4 = A2($author$project$OOP$LangUtils$findIndexMethods, m, ms);
					if (_v4.$ === 'Just') {
						var mthd = _v4.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(c, mthd));
					} else {
						var $temp$m = m,
							$temp$c = f,
							$temp$classtb = classtb;
						m = $temp$m;
						c = $temp$c;
						classtb = $temp$classtb;
						continue findMethod;
					}
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$OOP$Eval$boolOp = function (p) {
	return p ? $author$project$OOP$Syntax$VTrue : $author$project$OOP$Syntax$VFalse;
};
var $elm$core$Basics$ge = _Utils_ge;
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
var $author$project$OOP$Eval$floatOp = F3(
	function (op, n1, n2) {
		switch (op.$) {
			case 'Add':
				return $author$project$OOP$Syntax$VFloat(
					A2($myrho$elm_round$Round$roundNumCom, 2, n1 + n2));
			case 'Sub':
				return $author$project$OOP$Syntax$VFloat(
					A2($myrho$elm_round$Round$roundNumCom, 2, n1 - n2));
			case 'Mul':
				return $author$project$OOP$Syntax$VFloat(
					A2($myrho$elm_round$Round$roundNumCom, 2, n1 * n2));
			case 'Div':
				return $author$project$OOP$Syntax$VFloat(
					A2($myrho$elm_round$Round$roundNumCom, 2, n1 / n2));
			case 'Eq':
				return $author$project$OOP$Eval$boolOp(
					_Utils_eq(n1, n2));
			case 'Lt':
				return $author$project$OOP$Eval$boolOp(
					_Utils_cmp(n1, n2) < 0);
			case 'Gt':
				return $author$project$OOP$Eval$boolOp(
					_Utils_cmp(n1, n2) > 0);
			case 'Le':
				return $author$project$OOP$Eval$boolOp(
					_Utils_cmp(n1, n2) < 1);
			case 'Ge':
				return $author$project$OOP$Eval$boolOp(
					_Utils_cmp(n1, n2) > -1);
			default:
				return $author$project$OOP$Syntax$VError('Operator Error : 02.');
		}
	});
var $author$project$OOP$Eval$intOp = F3(
	function (op, n1, n2) {
		switch (op.$) {
			case 'Add':
				return $author$project$OOP$Syntax$VInt(n1 + n2);
			case 'Sub':
				return $author$project$OOP$Syntax$VInt(n1 - n2);
			case 'Mul':
				return $author$project$OOP$Syntax$VInt(n1 * n2);
			case 'Div':
				return $author$project$OOP$Syntax$VFloat(
					A2($myrho$elm_round$Round$roundNumCom, 2, n1 / n2));
			case 'RDiv':
				return $author$project$OOP$Syntax$VInt((n1 / n2) | 0);
			case 'Eq':
				return $author$project$OOP$Eval$boolOp(
					_Utils_eq(n1, n2));
			case 'Lt':
				return $author$project$OOP$Eval$boolOp(
					_Utils_cmp(n1, n2) < 0);
			case 'Gt':
				return $author$project$OOP$Eval$boolOp(
					_Utils_cmp(n1, n2) > 0);
			case 'Le':
				return $author$project$OOP$Eval$boolOp(
					_Utils_cmp(n1, n2) < 1);
			case 'Ge':
				return $author$project$OOP$Eval$boolOp(
					_Utils_cmp(n1, n2) > -1);
			default:
				return $author$project$OOP$Syntax$VError('Operator Error : 01.');
		}
	});
var $author$project$OOP$LangUtils$match = F2(
	function (pat, val) {
		var _v0 = _Utils_Tuple2(pat, val);
		_v0$14:
		while (true) {
			switch (_v0.a.$) {
				case 'PString':
					if (_v0.b.$ === 'VString') {
						var _v1 = _v0.a;
						var s1 = _v1.b;
						var s2 = _v0.b.a;
						return _Utils_eq(s1, s2) ? _List_Nil : _List_fromArray(
							[
								_Utils_Tuple2(
								'ERROR',
								$author$project$OOP$Syntax$VError('Match Failed.'))
							]);
					} else {
						break _v0$14;
					}
				case 'PCons':
					if (_v0.b.$ === 'VCons') {
						var _v2 = _v0.a;
						var p1 = _v2.b;
						var p2 = _v2.c;
						var _v3 = _v0.b;
						var v1 = _v3.a;
						var v2 = _v3.b;
						return A4($author$project$OOP$LangUtils$matchHelper, p1, p2, v1, v2);
					} else {
						break _v0$14;
					}
				case 'PCons1':
					if (_v0.b.$ === 'VString') {
						var _v4 = _v0.a;
						var p1 = _v4.b;
						var p2 = _v4.c;
						var s = _v0.b.a;
						var _v5 = $elm$core$String$uncons(s);
						if (_v5.$ === 'Just') {
							var _v6 = _v5.a;
							var c = _v6.a;
							var cs = _v6.b;
							return A4(
								$author$project$OOP$LangUtils$matchHelper,
								p1,
								p2,
								$author$project$OOP$Syntax$VChar(c),
								$author$project$OOP$Syntax$VString(cs));
						} else {
							return _List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$OOP$Syntax$VError('Match Failed.'))
								]);
						}
					} else {
						break _v0$14;
					}
				case 'PList':
					if (_v0.b.$ === 'VCons') {
						var _v7 = _v0.a;
						var p1 = _v7.b;
						var p2 = _v7.c;
						var _v8 = _v0.b;
						var v1 = _v8.a;
						var v2 = _v8.b;
						return A4($author$project$OOP$LangUtils$matchHelper, p1, p2, v1, v2);
					} else {
						break _v0$14;
					}
				case 'PBTuple':
					if (_v0.b.$ === 'VTuple2') {
						var _v9 = _v0.a;
						var p1 = _v9.b;
						var p2 = _v9.c;
						var _v10 = _v0.b;
						var v1 = _v10.a;
						var v2 = _v10.b;
						return A4($author$project$OOP$LangUtils$matchHelper, p1, p2, v1, v2);
					} else {
						break _v0$14;
					}
				case 'PTTuple':
					if (_v0.b.$ === 'VTuple3') {
						var _v11 = _v0.a;
						var p1 = _v11.b;
						var p2 = _v11.c;
						var p3 = _v11.d;
						var _v12 = _v0.b;
						var v1 = _v12.a;
						var v2 = _v12.b;
						var v3 = _v12.c;
						var res3 = A2($author$project$OOP$LangUtils$match, p3, v3);
						var res2 = A2($author$project$OOP$LangUtils$match, p2, v2);
						var res1 = A2($author$project$OOP$LangUtils$match, p1, v1);
						return (_Utils_eq(
							res1,
							_List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$OOP$Syntax$VError('Match Failed.'))
								])) || (_Utils_eq(
							res2,
							_List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$OOP$Syntax$VError('Match Failed.'))
								])) || _Utils_eq(
							res3,
							_List_fromArray(
								[
									_Utils_Tuple2(
									'ERROR',
									$author$project$OOP$Syntax$VError('Match Failed.'))
								])))) ? _List_fromArray(
							[
								_Utils_Tuple2(
								'ERROR',
								$author$project$OOP$Syntax$VError('Match Failed.'))
							]) : _Utils_ap(
							res1,
							_Utils_ap(res2, res3));
					} else {
						break _v0$14;
					}
				case 'PInt':
					if (_v0.b.$ === 'VInt') {
						var _v13 = _v0.a;
						var n1 = _v13.b;
						var n2 = _v0.b.a;
						return _Utils_eq(n1, n2) ? _List_Nil : _List_fromArray(
							[
								_Utils_Tuple2(
								'ERROR',
								$author$project$OOP$Syntax$VError('Match Failed.'))
							]);
					} else {
						break _v0$14;
					}
				case 'PFloat':
					if (_v0.b.$ === 'VFloat') {
						var _v14 = _v0.a;
						var n1 = _v14.b;
						var n2 = _v0.b.a;
						return _Utils_eq(n1, n2) ? _List_Nil : _List_fromArray(
							[
								_Utils_Tuple2(
								'ERROR',
								$author$project$OOP$Syntax$VError('Match Failed.'))
							]);
					} else {
						break _v0$14;
					}
				case 'PTrue':
					if (_v0.b.$ === 'VTrue') {
						var _v15 = _v0.b;
						return _List_Nil;
					} else {
						break _v0$14;
					}
				case 'PFalse':
					if (_v0.b.$ === 'VFalse') {
						var _v16 = _v0.b;
						return _List_Nil;
					} else {
						break _v0$14;
					}
				case 'PChar':
					if (_v0.b.$ === 'VChar') {
						var _v17 = _v0.a;
						var c1 = _v17.b;
						var c2 = _v0.b.a;
						return _Utils_eq(c1, c2) ? _List_Nil : _List_fromArray(
							[
								_Utils_Tuple2(
								'ERROR',
								$author$project$OOP$Syntax$VError('Match Failed.'))
							]);
					} else {
						break _v0$14;
					}
				case 'PNil':
					if (_v0.b.$ === 'VNil') {
						var _v18 = _v0.b;
						return _List_Nil;
					} else {
						break _v0$14;
					}
				case 'PEmpList':
					if (_v0.b.$ === 'VNil') {
						var _v19 = _v0.b;
						return _List_Nil;
					} else {
						break _v0$14;
					}
				case 'PVar':
					var _v20 = _v0.a;
					var s = _v20.b;
					var v = _v0.b;
					return _List_fromArray(
						[
							_Utils_Tuple2(s, v)
						]);
				default:
					break _v0$14;
			}
		}
		return _List_fromArray(
			[
				_Utils_Tuple2(
				'ERROR',
				$author$project$OOP$Syntax$VError('Match Failed.'))
			]);
	});
var $author$project$OOP$LangUtils$matchHelper = F4(
	function (p1, p2, v1, v2) {
		var res2 = A2($author$project$OOP$LangUtils$match, p2, v2);
		var res1 = A2($author$project$OOP$LangUtils$match, p1, v1);
		return (_Utils_eq(
			res1,
			_List_fromArray(
				[
					_Utils_Tuple2(
					'ERROR',
					$author$project$OOP$Syntax$VError('Match Failed.'))
				])) || _Utils_eq(
			res2,
			_List_fromArray(
				[
					_Utils_Tuple2(
					'ERROR',
					$author$project$OOP$Syntax$VError('Match Failed.'))
				]))) ? _List_fromArray(
			[
				_Utils_Tuple2(
				'ERROR',
				$author$project$OOP$Syntax$VError('Match Failed.'))
			]) : _Utils_ap(res1, res2);
	});
var $author$project$OOP$Syntax$PError = {$: 'PError'};
var $author$project$OOP$LangUtils$matchCase = F2(
	function (v, b) {
		matchCase:
		while (true) {
			switch (b.$) {
				case 'BNSin':
					var n = b.b;
					var p = b.c;
					var t = b.d;
					return {
						choice: n,
						envm: A2($author$project$OOP$LangUtils$match, p, v),
						pi: p,
						ti: t
					};
				case 'BCom':
					var b1 = b.b;
					var b2 = b.c;
					var res = A2($author$project$OOP$LangUtils$matchCase, v, b1);
					var _v1 = res.envm;
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
						envm: _List_Nil,
						pi: $author$project$OOP$Syntax$PError,
						ti: $author$project$OOP$Syntax$TError('Match Case Error : 01.')
					};
			}
		}
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0.a;
		var dict2 = _v1.a;
		return $elm$core$Set$Set_elm_builtin(
			A2($elm$core$Dict$union, dict1, dict2));
	});
var $author$project$OOP$Eval$eval = F4(
	function (env, state, classtb, term) {
		_eval:
		while (true) {
			switch (term.$) {
				case 'TInt':
					var n = term.b;
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VInt(n),
						state,
						$elm$core$Set$empty);
				case 'TFloat':
					var n = term.b;
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VFloat(n),
						state,
						$elm$core$Set$empty);
				case 'TTrue':
					return _Utils_Tuple3($author$project$OOP$Syntax$VTrue, state, $elm$core$Set$empty);
				case 'TFalse':
					return _Utils_Tuple3($author$project$OOP$Syntax$VFalse, state, $elm$core$Set$empty);
				case 'TChar':
					var c = term.b;
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VChar(c),
						state,
						$elm$core$Set$empty);
				case 'TString':
					var s = term.b;
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VString(s),
						state,
						$elm$core$Set$empty);
				case 'TVar':
					var s = term.b;
					var _v7 = A2($author$project$OOP$Utils$findByName, s, env);
					if (_v7.$ === 'Nothing') {
						return _Utils_Tuple3(
							$author$project$OOP$Syntax$VError('No Such Variable : 01'),
							_List_Nil,
							$elm$core$Set$empty);
					} else {
						var v = _v7.a;
						if (v.$ === 'VFix') {
							var t = v.a;
							var $temp$env = env,
								$temp$state = state,
								$temp$classtb = classtb,
								$temp$term = A2($author$project$OOP$Syntax$TFix, _List_Nil, t);
							env = $temp$env;
							state = $temp$state;
							classtb = $temp$classtb;
							term = $temp$term;
							continue _eval;
						} else {
							return _Utils_Tuple3(v, state, $elm$core$Set$empty);
						}
					}
				case 'TLam':
					var p = term.b;
					var t = term.c;
					return _Utils_Tuple3(
						A3($author$project$OOP$Syntax$VClosure, p, t, env),
						state,
						$elm$core$Set$empty);
				case 'TApp':
					var t1 = term.b;
					var t2 = term.c;
					var _v9 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
					if (_v9.a.$ === 'VClosure') {
						var _v10 = _v9.a;
						var p = _v10.a;
						var tf = _v10.b;
						var envf = _v10.c;
						var state1 = _v9.b;
						var invks1 = _v9.c;
						if (t2.$ === 'TFix') {
							var t = t2.b;
							if (p.$ === 'PVar') {
								var s = p.b;
								var $temp$env = A2(
									$elm$core$List$cons,
									_Utils_Tuple2(
										s,
										$author$project$OOP$Syntax$VFix(t)),
									envf),
									$temp$state = state1,
									$temp$classtb = classtb,
									$temp$term = tf;
								env = $temp$env;
								state = $temp$state;
								classtb = $temp$classtb;
								term = $temp$term;
								continue _eval;
							} else {
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VError('Recursion Error : 01.'),
									_List_Nil,
									$elm$core$Set$empty);
							}
						} else {
							var _v13 = A4($author$project$OOP$Eval$eval, env, state1, classtb, t2);
							var v2 = _v13.a;
							var state2 = _v13.b;
							var invks2 = _v13.c;
							var envm = A2($author$project$OOP$LangUtils$match, p, v2);
							if ((envm.b && (envm.a.b.$ === 'VError')) && (!envm.b.b)) {
								var _v15 = envm.a;
								var info = _v15.b.a;
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VError(info),
									_List_Nil,
									$elm$core$Set$empty);
							} else {
								var _v16 = A4(
									$author$project$OOP$Eval$eval,
									_Utils_ap(envm, envf),
									state2,
									classtb,
									tf);
								var v = _v16.a;
								var state3 = _v16.b;
								var invks3 = _v16.c;
								return _Utils_Tuple3(
									v,
									state3,
									A2(
										$elm$core$Set$union,
										invks3,
										A2($elm$core$Set$union, invks1, invks2)));
							}
						}
					} else {
						return _Utils_Tuple3(
							$author$project$OOP$Syntax$VError('Not Applicable : 01.'),
							_List_Nil,
							$elm$core$Set$empty);
					}
				case 'TLet':
					var p = term.b;
					var t1 = term.c;
					var t2 = term.d;
					var $temp$env = env,
						$temp$state = state,
						$temp$classtb = classtb,
						$temp$term = A3(
						$author$project$OOP$Syntax$TApp,
						_List_Nil,
						A3($author$project$OOP$Syntax$TLam, _List_Nil, p, t2),
						t1);
					env = $temp$env;
					state = $temp$state;
					classtb = $temp$classtb;
					term = $temp$term;
					continue _eval;
				case 'TLetrec':
					var p = term.b;
					var t1 = term.c;
					var t2 = term.d;
					var $temp$env = env,
						$temp$state = state,
						$temp$classtb = classtb,
						$temp$term = A3(
						$author$project$OOP$Syntax$TApp,
						_List_Nil,
						A3($author$project$OOP$Syntax$TLam, _List_Nil, p, t2),
						A2(
							$author$project$OOP$Syntax$TFix,
							_List_Nil,
							A3($author$project$OOP$Syntax$TLam, _List_Nil, p, t1)));
					env = $temp$env;
					state = $temp$state;
					classtb = $temp$classtb;
					term = $temp$term;
					continue _eval;
				case 'TFix':
					var t = term.b;
					var $temp$env = env,
						$temp$state = state,
						$temp$classtb = classtb,
						$temp$term = A3(
						$author$project$OOP$Syntax$TApp,
						_List_Nil,
						t,
						A2($author$project$OOP$Syntax$TFix, _List_Nil, t));
					env = $temp$env;
					state = $temp$state;
					classtb = $temp$classtb;
					term = $temp$term;
					continue _eval;
				case 'TCase':
					if (term.b.$ === 'TVar') {
						var _v17 = term.b;
						var s = _v17.b;
						var branch = term.c;
						var _v18 = A2($author$project$OOP$Utils$findByName, s, env);
						if (_v18.$ === 'Just') {
							var v = _v18.a;
							var res = A2($author$project$OOP$LangUtils$matchCase, v, branch);
							var _v19 = res.envm;
							if ((_v19.b && (_v19.a.b.$ === 'VError')) && (!_v19.b.b)) {
								var _v20 = _v19.a;
								var info = _v20.b.a;
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VError(info),
									_List_Nil,
									$elm$core$Set$empty);
							} else {
								var $temp$env = _Utils_ap(res.envm, env),
									$temp$state = state,
									$temp$classtb = classtb,
									$temp$term = res.ti;
								env = $temp$env;
								state = $temp$state;
								classtb = $temp$classtb;
								term = $temp$term;
								continue _eval;
							}
						} else {
							return _Utils_Tuple3(
								$author$project$OOP$Syntax$VError('No Such Variable : 02'),
								_List_Nil,
								$elm$core$Set$empty);
						}
					} else {
						return _Utils_Tuple3(
							$author$project$OOP$Syntax$VError('No Such Term : 01.'),
							_List_Nil,
							$elm$core$Set$empty);
					}
				case 'TCons':
					var t1 = term.b;
					var t2 = term.c;
					var _v21 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
					var v1 = _v21.a;
					var state1 = _v21.b;
					var invks1 = _v21.c;
					var _v22 = A4($author$project$OOP$Eval$eval, env, state1, classtb, t2);
					var v2 = _v22.a;
					var state2 = _v22.b;
					var invks2 = _v22.c;
					return _Utils_Tuple3(
						A2($author$project$OOP$Syntax$VCons, v1, v2),
						state2,
						A2($elm$core$Set$union, invks1, invks2));
				case 'TList':
					var t1 = term.b;
					var t2 = term.c;
					var _v23 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
					var v1 = _v23.a;
					var state1 = _v23.b;
					var invks1 = _v23.c;
					var _v24 = A4($author$project$OOP$Eval$eval, env, state1, classtb, t2);
					var v2 = _v24.a;
					var state2 = _v24.b;
					var invks2 = _v24.c;
					return _Utils_Tuple3(
						A2($author$project$OOP$Syntax$VCons, v1, v2),
						state2,
						A2($elm$core$Set$union, invks1, invks2));
				case 'TNil':
					return _Utils_Tuple3($author$project$OOP$Syntax$VNil, state, $elm$core$Set$empty);
				case 'TEmpList':
					return _Utils_Tuple3($author$project$OOP$Syntax$VNil, state, $elm$core$Set$empty);
				case 'TTuple2':
					var t1 = term.b;
					var t2 = term.c;
					var _v25 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
					var v1 = _v25.a;
					var state1 = _v25.b;
					var invks1 = _v25.c;
					var _v26 = A4($author$project$OOP$Eval$eval, env, state1, classtb, t2);
					var v2 = _v26.a;
					var state2 = _v26.b;
					var invks2 = _v26.c;
					return _Utils_Tuple3(
						A2($author$project$OOP$Syntax$VTuple2, v1, v2),
						state2,
						A2($elm$core$Set$union, invks1, invks2));
				case 'TTuple3':
					var t1 = term.b;
					var t2 = term.c;
					var t3 = term.d;
					var _v27 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
					var v1 = _v27.a;
					var state1 = _v27.b;
					var invks1 = _v27.c;
					var _v28 = A4($author$project$OOP$Eval$eval, env, state1, classtb, t2);
					var v2 = _v28.a;
					var state2 = _v28.b;
					var invks2 = _v28.c;
					var _v29 = A4($author$project$OOP$Eval$eval, env, state2, classtb, t3);
					var v3 = _v29.a;
					var state3 = _v29.b;
					var invks3 = _v29.c;
					return _Utils_Tuple3(
						A3($author$project$OOP$Syntax$VTuple3, v1, v2, v3),
						state3,
						A2(
							$elm$core$Set$union,
							invks3,
							A2($elm$core$Set$union, invks1, invks2)));
				case 'TBPrim':
					var op = term.b;
					var t1 = term.c;
					var t2 = term.d;
					var _v30 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
					var v1 = _v30.a;
					var state1 = _v30.b;
					var invks1 = _v30.c;
					var _v31 = A4($author$project$OOP$Eval$eval, env, state1, classtb, t2);
					var v2 = _v31.a;
					var state2 = _v31.b;
					var invks2 = _v31.c;
					var invks = A2($elm$core$Set$union, invks1, invks2);
					switch (v1.$) {
						case 'VInt':
							var n1 = v1.a;
							switch (v2.$) {
								case 'VInt':
									var n2 = v2.a;
									return _Utils_Tuple3(
										A3($author$project$OOP$Eval$intOp, op, n1, n2),
										state2,
										invks);
								case 'VFloat':
									var n2 = v2.a;
									return _Utils_Tuple3(
										A3($author$project$OOP$Eval$floatOp, op, n1, n2),
										state2,
										invks);
								default:
									return _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operand Error : 01.'),
										_List_Nil,
										$elm$core$Set$empty);
							}
						case 'VFloat':
							var n1 = v1.a;
							switch (v2.$) {
								case 'VInt':
									var n2 = v2.a;
									return _Utils_Tuple3(
										A3($author$project$OOP$Eval$floatOp, op, n1, n2),
										state2,
										invks);
								case 'VFloat':
									var n2 = v2.a;
									return _Utils_Tuple3(
										A3($author$project$OOP$Eval$floatOp, op, n1, n2),
										state2,
										invks);
								default:
									return _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operand Error : 02.'),
										_List_Nil,
										$elm$core$Set$empty);
							}
						case 'VTrue':
							switch (v2.$) {
								case 'VTrue':
									switch (op.$) {
										case 'And':
											return _Utils_Tuple3($author$project$OOP$Syntax$VTrue, state2, invks);
										case 'Or':
											return _Utils_Tuple3($author$project$OOP$Syntax$VTrue, state2, invks);
										default:
											return _Utils_Tuple3(
												$author$project$OOP$Syntax$VError('Operator Error : 03.'),
												_List_Nil,
												$elm$core$Set$empty);
									}
								case 'VFalse':
									switch (op.$) {
										case 'And':
											return _Utils_Tuple3($author$project$OOP$Syntax$VFalse, state2, invks);
										case 'Or':
											return _Utils_Tuple3($author$project$OOP$Syntax$VTrue, state2, invks);
										default:
											return _Utils_Tuple3(
												$author$project$OOP$Syntax$VError('Operator Error: 04.'),
												_List_Nil,
												$elm$core$Set$empty);
									}
								default:
									return _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operand Error : 03.'),
										_List_Nil,
										$elm$core$Set$empty);
							}
						case 'VFalse':
							switch (v2.$) {
								case 'VTrue':
									switch (op.$) {
										case 'And':
											return _Utils_Tuple3($author$project$OOP$Syntax$VFalse, state2, invks);
										case 'Or':
											return _Utils_Tuple3($author$project$OOP$Syntax$VTrue, state2, invks);
										default:
											return _Utils_Tuple3(
												$author$project$OOP$Syntax$VError('Operator Error : 05.'),
												_List_Nil,
												$elm$core$Set$empty);
									}
								case 'VFalse':
									switch (op.$) {
										case 'And':
											return _Utils_Tuple3($author$project$OOP$Syntax$VFalse, state2, invks);
										case 'Or':
											return _Utils_Tuple3($author$project$OOP$Syntax$VFalse, state2, invks);
										default:
											return _Utils_Tuple3(
												$author$project$OOP$Syntax$VError('Operator Error : 06.'),
												_List_Nil,
												$elm$core$Set$empty);
									}
								default:
									return _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operand Error : 04.'),
										_List_Nil,
										$elm$core$Set$empty);
							}
						case 'VCons':
							switch (v2.$) {
								case 'VCons':
									return _Utils_eq(op, $author$project$OOP$Syntax$Cat) ? _Utils_Tuple3(
										A2($author$project$OOP$LangUtils$appendValueList, v1, v2),
										state2,
										invks) : (_Utils_eq(op, $author$project$OOP$Syntax$Eq) ? _Utils_Tuple3(
										_Utils_eq(v1, v2) ? $author$project$OOP$Syntax$VTrue : $author$project$OOP$Syntax$VFalse,
										state2,
										invks) : _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operator Error : 07.'),
										_List_Nil,
										$elm$core$Set$empty));
								case 'VNil':
									return _Utils_eq(op, $author$project$OOP$Syntax$Cat) ? _Utils_Tuple3(
										A2($author$project$OOP$LangUtils$appendValueList, v1, v2),
										state2,
										invks) : (_Utils_eq(op, $author$project$OOP$Syntax$Eq) ? _Utils_Tuple3($author$project$OOP$Syntax$VFalse, state2, invks) : _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operator Error : 08.'),
										_List_Nil,
										$elm$core$Set$empty));
								default:
									return _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operand Error : 05.'),
										_List_Nil,
										$elm$core$Set$empty);
							}
						case 'VNil':
							switch (v2.$) {
								case 'VCons':
									return _Utils_eq(op, $author$project$OOP$Syntax$Cat) ? _Utils_Tuple3(
										A2($author$project$OOP$LangUtils$appendValueList, v1, v2),
										state2,
										invks) : (_Utils_eq(op, $author$project$OOP$Syntax$Eq) ? _Utils_Tuple3($author$project$OOP$Syntax$VFalse, state2, invks) : _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operator Error : 09.'),
										_List_Nil,
										$elm$core$Set$empty));
								case 'VNil':
									return _Utils_eq(op, $author$project$OOP$Syntax$Cat) ? _Utils_Tuple3($author$project$OOP$Syntax$VNil, state2, invks) : (_Utils_eq(op, $author$project$OOP$Syntax$Eq) ? _Utils_Tuple3($author$project$OOP$Syntax$VTrue, state2, invks) : _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operator Error : 10.'),
										_List_Nil,
										$elm$core$Set$empty));
								default:
									return _Utils_Tuple3(
										$author$project$OOP$Syntax$VError('Operand Error : 07.'),
										_List_Nil,
										$elm$core$Set$empty);
							}
						case 'VChar':
							var c1 = v1.a;
							if (v2.$ === 'VChar') {
								var c2 = v2.a;
								return _Utils_eq(op, $author$project$OOP$Syntax$Eq) ? _Utils_Tuple3(
									_Utils_eq(c1, c2) ? $author$project$OOP$Syntax$VTrue : $author$project$OOP$Syntax$VFalse,
									state2,
									invks) : _Utils_Tuple3(
									$author$project$OOP$Syntax$VError('Operator Error : 18'),
									_List_Nil,
									$elm$core$Set$empty);
							} else {
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VError('Oprand Error : 14'),
									_List_Nil,
									$elm$core$Set$empty);
							}
						case 'VString':
							var s1 = v1.a;
							if (v2.$ === 'VString') {
								var s2 = v2.a;
								return _Utils_eq(op, $author$project$OOP$Syntax$Cat) ? _Utils_Tuple3(
									$author$project$OOP$Syntax$VString(
										_Utils_ap(s1, s2)),
									state2,
									invks) : (_Utils_eq(op, $author$project$OOP$Syntax$Eq) ? _Utils_Tuple3(
									_Utils_eq(v1, v2) ? $author$project$OOP$Syntax$VTrue : $author$project$OOP$Syntax$VFalse,
									state2,
									invks) : _Utils_Tuple3(
									$author$project$OOP$Syntax$VError('Operator Error : 12.'),
									_List_Nil,
									$elm$core$Set$empty));
							} else {
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VError('Operand Error : 12.'),
									_List_Nil,
									$elm$core$Set$empty);
							}
						default:
							return _Utils_Tuple3(
								$author$project$OOP$Syntax$VError('Operand Error : 08.'),
								_List_Nil,
								$elm$core$Set$empty);
					}
				case 'TUPrim':
					var op = term.b;
					var t = term.c;
					if (op.$ === 'Neg') {
						var _v46 = A4($author$project$OOP$Eval$eval, env, state, classtb, t);
						var v = _v46.a;
						var state1 = _v46.b;
						var invks1 = _v46.c;
						switch (v.$) {
							case 'VInt':
								var n = v.a;
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VInt(0 - n),
									state1,
									invks1);
							case 'VFloat':
								var n = v.a;
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VFloat(0 - n),
									state1,
									invks1);
							default:
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VError('Operand Error : 09.'),
									_List_Nil,
									$elm$core$Set$empty);
						}
					} else {
						var _v48 = A4($author$project$OOP$Eval$eval, env, state, classtb, t);
						var v = _v48.a;
						var state1 = _v48.b;
						var invks1 = _v48.c;
						switch (v.$) {
							case 'VTrue':
								return _Utils_Tuple3($author$project$OOP$Syntax$VFalse, state1, invks1);
							case 'VFalse':
								return _Utils_Tuple3($author$project$OOP$Syntax$VTrue, state1, invks1);
							default:
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VError('Operand Error : 10.'),
									_List_Nil,
									$elm$core$Set$empty);
						}
					}
				case 'TParens':
					var t = term.b;
					var $temp$env = env,
						$temp$state = state,
						$temp$classtb = classtb,
						$temp$term = t;
					env = $temp$env;
					state = $temp$state;
					classtb = $temp$classtb;
					term = $temp$term;
					continue _eval;
				case 'TRef':
					var t = term.b;
					var _v50 = A4($author$project$OOP$Eval$eval, env, state, classtb, t);
					var v = _v50.a;
					var state1 = _v50.b;
					var invks1 = _v50.c;
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VLoc(
							$elm$core$List$length(state1)),
						_Utils_ap(
							state1,
							_List_fromArray(
								[v])),
						invks1);
				case 'TDeRef':
					var t = term.b;
					var _v51 = A4($author$project$OOP$Eval$eval, env, state, classtb, t);
					var v = _v51.a;
					var state1 = _v51.b;
					var invks1 = _v51.c;
					if (v.$ === 'VLoc') {
						var n = v.a;
						var _v53 = A2($author$project$Utils$nth, n, state);
						if (_v53.$ === 'Just') {
							var val = _v53.a;
							return _Utils_Tuple3(val, state1, invks1);
						} else {
							return _Utils_Tuple3(
								$author$project$OOP$Syntax$VError('Index Out Of Range : 01.'),
								_List_Nil,
								$elm$core$Set$empty);
						}
					} else {
						return _Utils_Tuple3(
							$author$project$OOP$Syntax$VError('Not a Reference : 01.'),
							_List_Nil,
							$elm$core$Set$empty);
					}
				case 'TAssign':
					var t1 = term.b;
					var t2 = term.c;
					var _v54 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
					var v1 = _v54.a;
					var state1 = _v54.b;
					var invks1 = _v54.c;
					var _v55 = A4($author$project$OOP$Eval$eval, env, state1, classtb, t2);
					var v2 = _v55.a;
					var state2 = _v55.b;
					var invks2 = _v55.c;
					if (v1.$ === 'VLoc') {
						var n = v1.a;
						return _Utils_Tuple3(
							$author$project$OOP$Syntax$VUnit,
							A3($author$project$OOP$Utils$replace, n, v2, state2),
							A2($elm$core$Set$union, invks1, invks2));
					} else {
						return _Utils_Tuple3(
							$author$project$OOP$Syntax$VError('Not a Reference : 02.'),
							_List_Nil,
							$elm$core$Set$empty);
					}
				case 'TUnit':
					return _Utils_Tuple3($author$project$OOP$Syntax$VUnit, state, $elm$core$Set$empty);
				case 'TField':
					var t1 = term.b;
					var t2 = term.c;
					if (t2.$ === 'TVar') {
						var f = t2.b;
						var _v58 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
						var v1 = _v58.a;
						var state1 = _v58.b;
						var invks1 = _v58.c;
						if (v1.$ === 'VNew') {
							var _class = v1.a;
							var args = v1.b;
							var fields = A2($author$project$OOP$LangUtils$getFields, _class, classtb);
							var index = A2(
								$author$project$OOP$LangUtils$findFieldsIndex,
								f,
								A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, fields));
							var val = A2($author$project$OOP$LangUtils$findIndexValueList, index, args);
							if (val.$ === 'Just') {
								var v = val.a;
								return _Utils_Tuple3(v, state1, invks1);
							} else {
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VError('No Such Field : 01.'),
									_List_Nil,
									$elm$core$Set$empty);
							}
						} else {
							return _Utils_Tuple3(
								$author$project$OOP$Syntax$VError('Not an Object : 01.'),
								_List_Nil,
								$elm$core$Set$empty);
						}
					} else {
						return _Utils_Tuple3(
							$author$project$OOP$Syntax$VError('Not a Variable : 01.'),
							_List_Nil,
							$elm$core$Set$empty);
					}
				case 'TInvk':
					var t1 = term.b;
					var t2 = term.c;
					if (t2.$ === 'TVar') {
						var m = t2.b;
						var _v62 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
						var v1 = _v62.a;
						var state1 = _v62.b;
						var invks1 = _v62.c;
						if (v1.$ === 'VNew') {
							var _class = v1.a;
							var res = A3($author$project$OOP$LangUtils$findMethod, m, _class, classtb);
							if (res.$ === 'Just') {
								var _v65 = res.a;
								var _v66 = _v65.b;
								var _v67 = _v66.b;
								var p = _v67.b;
								var t = _v67.c;
								return _Utils_Tuple3(
									A3(
										$author$project$OOP$Syntax$VClosure,
										p,
										t,
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2('this', v1),
											env)),
									state1,
									A2(
										$elm$core$Set$insert,
										_Utils_Tuple2(_class, m),
										invks1));
							} else {
								return _Utils_Tuple3(
									$author$project$OOP$Syntax$VError('No Such Method : 01.'),
									_List_Nil,
									$elm$core$Set$empty);
							}
						} else {
							return _Utils_Tuple3(
								$author$project$OOP$Syntax$VError('Not an Object : 02.'),
								_List_Nil,
								$elm$core$Set$empty);
						}
					} else {
						return _Utils_Tuple3(
							$author$project$OOP$Syntax$VError('Not a Variable : 02.'),
							_List_Nil,
							$elm$core$Set$empty);
					}
				case 'TNew':
					var _class = term.b;
					var ts = term.c;
					var _v68 = A4($author$project$OOP$Eval$eval, env, state, classtb, ts);
					var vs = _v68.a;
					var state1 = _v68.b;
					var invks1 = _v68.c;
					return _Utils_Tuple3(
						A2($author$project$OOP$Syntax$VNew, _class, vs),
						state1,
						invks1);
				case 'TError':
					var info = term.a;
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VError(info),
						_List_Nil,
						$elm$core$Set$empty);
				case 'TSeq':
					var t1 = term.b;
					var t2 = term.c;
					var _v69 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
					var state1 = _v69.b;
					var invks1 = _v69.c;
					var _v70 = A4($author$project$OOP$Eval$eval, env, state1, classtb, t2);
					var v2 = _v70.a;
					var state2 = _v70.b;
					var invks2 = _v70.c;
					return _Utils_Tuple3(
						v2,
						state2,
						A2($elm$core$Set$union, invks1, invks2));
				case 'THtml':
					var s = term.b;
					var t1 = term.c;
					var t2 = term.d;
					var t3 = term.e;
					var _v71 = A4($author$project$OOP$Eval$eval, env, state, classtb, t1);
					var v1 = _v71.a;
					var state1 = _v71.b;
					var invks1 = _v71.c;
					var _v72 = A4($author$project$OOP$Eval$eval, env, state1, classtb, t2);
					var v2 = _v72.a;
					var state2 = _v72.b;
					var invks2 = _v72.c;
					var _v73 = A4($author$project$OOP$Eval$eval, env, state2, classtb, t3);
					var v3 = _v73.a;
					var state3 = _v73.b;
					var invks3 = _v73.c;
					return _Utils_Tuple3(
						A4($author$project$OOP$Syntax$VHtml, s, v1, v2, v3),
						state3,
						A2(
							$elm$core$Set$union,
							invks3,
							A2($elm$core$Set$union, invks1, invks2)));
				case 'TToStr':
					var t = term.b;
					var _v74 = A4($author$project$OOP$Eval$eval, env, state, classtb, t);
					var v = _v74.a;
					var state1 = _v74.b;
					var invks1 = _v74.c;
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VString(
							$author$project$OOP$Printer$Value$printValue(v)),
						state1,
						invks1);
				case 'TMap':
					var f = term.c;
					var ls = term.d;
					var _v75 = A4($author$project$OOP$Eval$eval, env, state, classtb, f);
					var v1 = _v75.a;
					var state1 = _v75.b;
					var invks1 = _v75.c;
					var _v76 = A4($author$project$OOP$Eval$eval, env, state1, classtb, ls);
					var v2 = _v76.a;
					var state2 = _v76.b;
					var invks2 = _v76.c;
					var _v77 = A4($author$project$OOP$Eval$vmap, v1, v2, state2, classtb);
					var v3 = _v77.a;
					var state3 = _v77.b;
					var invks3 = _v77.c;
					return _Utils_Tuple3(
						v3,
						state3,
						A2(
							$elm$core$Set$union,
							invks3,
							A2($elm$core$Set$union, invks1, invks2)));
				default:
					var n = term.b;
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VLoc(n),
						state,
						$elm$core$Set$empty);
			}
		}
	});
var $author$project$OOP$Eval$vmap = F4(
	function (v1, v2, state, classtb) {
		if (v1.$ === 'VClosure') {
			var p = v1.a;
			var t = v1.b;
			var envf = v1.c;
			switch (v2.$) {
				case 'VCons':
					var v21 = v2.a;
					var v22 = v2.b;
					var envm = A2($author$project$OOP$LangUtils$match, p, v21);
					if ((envm.b && (envm.a.b.$ === 'VError')) && (!envm.b.b)) {
						var _v3 = envm.a;
						var info = _v3.b.a;
						return _Utils_Tuple3(
							$author$project$OOP$Syntax$VError(info),
							_List_Nil,
							$elm$core$Set$empty);
					} else {
						var _v4 = A4(
							$author$project$OOP$Eval$eval,
							_Utils_ap(envm, envf),
							state,
							classtb,
							t);
						var v21_ = _v4.a;
						var state1 = _v4.b;
						var invks1 = _v4.c;
						var _v5 = A4($author$project$OOP$Eval$vmap, v1, v22, state1, classtb);
						var v22_ = _v5.a;
						var state2 = _v5.b;
						var invks2 = _v5.c;
						return _Utils_Tuple3(
							A2($author$project$OOP$Syntax$VCons, v21_, v22_),
							state2,
							A2($elm$core$Set$union, invks1, invks2));
					}
				case 'VNil':
					return _Utils_Tuple3($author$project$OOP$Syntax$VNil, state, $elm$core$Set$empty);
				default:
					return _Utils_Tuple3(
						$author$project$OOP$Syntax$VError('The third argument to map_ must be a list : 01.'),
						_List_Nil,
						$elm$core$Set$empty);
			}
		} else {
			return _Utils_Tuple3(
				$author$project$OOP$Syntax$VError('The second argument to map_ must be a function : 01.'),
				_List_Nil,
				$elm$core$Set$empty);
		}
	});
var $author$project$OOP$Syntax$NoCT = function (a) {
	return {$: 'NoCT', a: a};
};
var $author$project$OOP$Syntax$WithCT = F2(
	function (a, b) {
		return {$: 'WithCT', a: a, b: b};
	});
var $author$project$OOP$Parser$Term$getFuncDef = F2(
	function (params, t) {
		if (!params.b) {
			return t;
		} else {
			var p = params.a;
			var ps = params.b;
			return A3(
				$author$project$OOP$Syntax$TLam,
				_List_Nil,
				p,
				A2($author$project$OOP$Parser$Term$getFuncDef, ps, t));
		}
	});
var $author$project$OOP$Parser$Term$paramHelper = function (revTerms) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					function (p) {
						return $elm$parser$Parser$Loop(
							A2($elm$core$List$cons, p, revTerms));
					}),
				$author$project$OOP$Parser$Pattern$pattern),
				A2(
				$elm$parser$Parser$map,
				function (_v0) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revTerms));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
var $author$project$OOP$Parser$Term$paramLoop = A2($elm$parser$Parser$loop, _List_Nil, $author$project$OOP$Parser$Term$paramHelper);
var $author$project$OOP$Parser$Term$equationHelper = function (revTerms) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
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
								$elm$parser$Parser$succeed(
									F5(
										function (p, params, spc1, t, spc2) {
											return $elm$parser$Parser$Loop(
												A2(
													$elm$core$List$cons,
													_Utils_Tuple3(
														p,
														A2($author$project$OOP$Parser$Term$getFuncDef, params, t),
														_List_fromArray(
															[spc1, spc2])),
													revTerms));
										})),
								$author$project$OOP$Parser$Pattern$pattern),
							A2(
								$elm$parser$Parser$ignorer,
								$author$project$OOP$Parser$Term$paramLoop,
								$elm$parser$Parser$symbol('='))),
						$author$project$OOP$Parser$WhiteSpaces$mspaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v0) {
								return $author$project$OOP$Parser$Term$term;
							}),
						$elm$parser$Parser$symbol(';;'))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
				A2(
				$elm$parser$Parser$map,
				function (_v1) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revTerms));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
var $author$project$OOP$Parser$Term$exprListToTLet = function (ls) {
	if (!ls.b) {
		return A2($author$project$OOP$Syntax$TVar, _List_Nil, 'main');
	} else {
		var _v1 = ls.a;
		var p = _v1.a;
		var t = _v1.b;
		var ws = _v1.c;
		var ts = ls.b;
		return A4(
			$author$project$OOP$Syntax$TLet,
			ws,
			p,
			t,
			$author$project$OOP$Parser$Term$exprListToTLet(ts));
	}
};
var $author$project$OOP$Parser$Term$equationLoop = A2(
	$elm$parser$Parser$map,
	$author$project$OOP$Parser$Term$exprListToTLet,
	A2($elm$parser$Parser$loop, _List_Nil, $author$project$OOP$Parser$Term$equationHelper));
var $author$project$OOP$Parser$Term$equation = A2(
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
						$elm$parser$Parser$succeed(
							F6(
								function (p, params, spc1, t1, spc2, t2) {
									return A4(
										$author$project$OOP$Syntax$TLet,
										_List_fromArray(
											[spc1, spc2]),
										p,
										A2($author$project$OOP$Parser$Term$getFuncDef, params, t1),
										t2);
								})),
						$author$project$OOP$Parser$Pattern$pattern),
					A2(
						$elm$parser$Parser$ignorer,
						$author$project$OOP$Parser$Term$paramLoop,
						$elm$parser$Parser$symbol('='))),
				$author$project$OOP$Parser$WhiteSpaces$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v0) {
						return $author$project$OOP$Parser$Term$term;
					}),
				$elm$parser$Parser$symbol(';;'))),
		$author$project$OOP$Parser$WhiteSpaces$mspaces),
	$author$project$OOP$Parser$Term$equationLoop);
var $author$project$OOP$Parser$Program$oop = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed($author$project$OOP$Syntax$WithCT),
				$author$project$OOP$Parser$ClassTable$clt),
			$author$project$OOP$Parser$Term$equation),
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($author$project$OOP$Syntax$NoCT),
			$author$project$OOP$Parser$Term$equation)
		]));
var $author$project$OOP$Parser$Program$parse = $elm$parser$Parser$run(
	A2($elm$parser$Parser$ignorer, $author$project$OOP$Parser$Program$oop, $elm$parser$Parser$end));
var $author$project$OOP$Preclude$Library$library = 'abs x =\n    if x < 0 then -x else x \n;;\ndrop = \n    letrec drop_ =\n        \\err =>\n            \\n =>\n                \\ls =>\n                    case n of\n                        0 => ls\n                        |x => case ls of\n                            [] => err\n                            | y::ys => drop_ err (x-1) ys \n    in \n        drop_\n;;\nfilter =\n    letrec filter_ =\n        \\f =>\n            \\ls =>\n                case ls of\n                    [] => []\n                    | x::xs =>\n                        if f x then\n                            x :: (filter_ f xs)\n                        else\n                            filter_ f xs\n    in \n        filter_\n;;\nflip f x y=\n    f y x\n;;\nfoldl =\n    letrec foldl_ =\n        \\f =>\n            \\start =>\n                \\ls =>\n                    case ls of\n                        [] => start\n                        | x :: xs =>\n                            foldl_ f (f start x) xs\n    in \n        foldl_\n;;\nfoldr =\n    letrec foldr_ =\n        \\f =>\n            \\start =>\n                \\ls =>\n                    case ls of\n                        [] => start\n                        | x :: xs =>\n                            f x (foldr_ f start xs)\n    in \n        foldr_\n;;\nfst (a, b) =\n    a\n;;\nhead err ls =\n    case ls of\n        [] => err\n        | x::xs => x\n;;\nidentity x =\n    x\n;;\nindexedMap_ =\n    letrec indexedMap__ =\n        \\iter =>\n            \\f =>\n                \\ls =>\n                    case ls of\n                        [] => []\n                        | x::xs =>\n                            (f iter x)::(indexedMap__ (iter+1) f xs)\n    in \n        indexedMap__\n;;\nindexedMap = \n    indexedMap_ 0\n;;\nlength =\n    letrec length_ =\n        \\ls =>\n            case ls of\n                [] => 0\n                | x::xs => 1 + (length_ xs)\n    in\n        length_\n;;\nmap =\n    letrec map__ =\n        \\f =>\n            \\ls =>\n                case ls of\n                    [] => []\n                    | x :: xs => (f x) :: (map__ f xs)\n    in\n        map__\n;;\nmax x y =\n    if x >= y then x else y\n;;\nmin x y =\n    if x < y then x else y\n;;\nmod a b =\n    a - (a // b) * b\n;;\nnth = \n    letrec nth_ =\n        \\n =>\n            \\ls =>\n                case n of\n                    0 => (case ls of\n                            [] => "Err 01"\n                            | x::xs => x)\n                    | a =>\n                        case ls of\n                        [] => "Err 02"\n                        | x::xs => nth_ (n-1) xs\n    in\n        nth_\n;;\npartition =\n    letrec partition_ =\n        \\p =>\n            \\ls =>\n                case ls of\n                    [] => ([], [])\n                    | x :: xs =>\n                        let \n                            (trueSet, falseSet) =\n                                partition_ p xs\n                        in\n                        if p x then\n                            (x :: trueSet, falseSet)\n                        else\n                            (trueSet, x :: falseSet)\n    in\n        partition_\n;;\nrange =\n    letrec range_ =\n        \\i =>\n            \\j =>\n                if i < j then\n                    i :: (range_ (i + 1) j)\n                else\n                    []\n    in\n        range_\n;;\nrepeat =\n    letrec repeat_ =\n        \\n =>\n            \\x =>\n                case n of\n                    0 => []\n                    | n1 => x :: (repeat_ (n1-1) x)\n    in\n        repeat_\n;;\nreverse =\n    letrec reverse_ =\n        \\ls =>\n            case ls of\n                [] => []\n                | x :: xs => (reverse_ xs)++[x]\n    in\n        reverse_\n;;\nsingleton x =\n    [x]\n;;\nsnd (a, b) =\n    b\n;;\ntail err ls =\n    case ls of\n        [] => err\n        | x::xs => xs\n;;\ntake = \n    letrec take_ =\n        \\err =>\n            \\n =>\n                \\ls =>\n                    case n of\n                        0 => []\n                        |x => case ls of\n                            [] => err\n                            | y::ys => y::(take_ err (x-1) ys)\n    in\n        take_\n;;\nunzip = \n    letrec unzip_ =\n        \\ls =>\n            case ls of\n                [] => ([], [])\n                |(a, b)::xs =>\n                    let (l1, l2) = unzip_ xs in\n                        (a::l1, b::l2)\n    in\n        unzip_\n;;\nzip =\n    letrec zip_ =\n        \\l1 =>\n            \\l2 =>\n                case (l1, l2) of\n                    (x1::xs1, x2::xs2) => (x1, x2) :: (zip_ xs1 xs2)\n                    |(x1::xs1, []) => []\n                    |([], x2::xs2) => []\n                    |([], []) => []\n    in\n        zip_\n;;\nzipWith =\n    letrec zipWith_ =\n        \\f =>\n            \\l1 =>\n                \\l2 =>\n                    case (l1, l2) of\n                        (x1::xs1, x2::xs2) => (f x1 x2) :: (zipWith f xs1 xs2)\n                        |(x1::xs1, []) => []\n                        |([], x2::xs2) => []\n                        |([], []) => []\n    in\n        zipWith_\n;;';
var $author$project$OOP$Parser$Term$parseEquation = $elm$parser$Parser$run(
	A2($elm$parser$Parser$ignorer, $author$project$OOP$Parser$Term$equation, $elm$parser$Parser$end));
var $author$project$OOP$Preclude$Library$parsedLibrary = function () {
	var _v0 = $author$project$OOP$Parser$Term$parseEquation($author$project$OOP$Preclude$Library$library);
	if (_v0.$ === 'Ok') {
		var pre = _v0.a;
		return pre;
	} else {
		var info = _v0.a;
		return $author$project$OOP$Syntax$TError(
			$elm$core$Debug$toString(info));
	}
}();
var $author$project$OOP$Syntax$BNSin = F4(
	function (a, b, c, d) {
		return {$: 'BNSin', a: a, b: b, c: c, d: d};
	});
var $author$project$OOP$LangUtils$addIDToBranch = F2(
	function (br, id) {
		switch (br.$) {
			case 'BSin':
				var ws = br.a;
				var p = br.b;
				var t = br.c;
				var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
				return _Utils_Tuple2(
					A4($author$project$OOP$Syntax$BNSin, ws, id, p, t_),
					id + 1);
			case 'BCom':
				var ws = br.a;
				var b1 = br.b;
				var b2 = br.c;
				var _v3 = A2($author$project$OOP$LangUtils$addIDToBranch, b1, id);
				var b1_ = _v3.a;
				var id1 = _v3.b;
				var _v4 = A2($author$project$OOP$LangUtils$addIDToBranch, b2, id1);
				var b2_ = _v4.a;
				var id2 = _v4.b;
				return _Utils_Tuple2(
					A3($author$project$OOP$Syntax$BCom, ws, b1_, b2_),
					id2);
			default:
				return _Utils_Tuple2(br, id);
		}
	});
var $author$project$OOP$LangUtils$processAfterParse = function (term) {
	switch (term.$) {
		case 'TLam':
			var ws = term.a;
			var p = term.b;
			var t = term.c;
			var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
			return A3($author$project$OOP$Syntax$TLam, ws, p, t_);
		case 'TApp':
			var ws = term.a;
			var t1 = term.b;
			var t2 = term.c;
			var t2_ = $author$project$OOP$LangUtils$processAfterParse(t2);
			var t1_ = $author$project$OOP$LangUtils$processAfterParse(t1);
			return A3($author$project$OOP$Syntax$TApp, ws, t1_, t2_);
		case 'TLet':
			var ws = term.a;
			var p = term.b;
			var t1 = term.c;
			var t2 = term.d;
			var t2_ = $author$project$OOP$LangUtils$processAfterParse(t2);
			var t1_ = $author$project$OOP$LangUtils$processAfterParse(t1);
			return A4($author$project$OOP$Syntax$TLet, ws, p, t1_, t2_);
		case 'TLetrec':
			var ws = term.a;
			var p = term.b;
			var t1 = term.c;
			var t2 = term.d;
			var t2_ = $author$project$OOP$LangUtils$processAfterParse(t2);
			var t1_ = $author$project$OOP$LangUtils$processAfterParse(t1);
			return A4($author$project$OOP$Syntax$TLetrec, ws, p, t1_, t2_);
		case 'TFix':
			var ws = term.a;
			var t = term.b;
			var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
			return A2($author$project$OOP$Syntax$TFix, ws, t_);
		case 'TCase':
			var ws = term.a;
			var guard = term.b;
			var br = term.c;
			var _v1 = A2($author$project$OOP$LangUtils$addIDToBranch, br, 0);
			var br_ = _v1.a;
			return A3($author$project$OOP$Syntax$TCase, ws, guard, br_);
		case 'TCons':
			var ws = term.a;
			var t1 = term.b;
			var t2 = term.c;
			var t2_ = $author$project$OOP$LangUtils$processAfterParse(t2);
			var t1_ = $author$project$OOP$LangUtils$processAfterParse(t1);
			return A3($author$project$OOP$Syntax$TCons, ws, t1_, t2_);
		case 'TList':
			var ws = term.a;
			var t1 = term.b;
			var t2 = term.c;
			var t2_ = $author$project$OOP$LangUtils$processAfterParse(t2);
			var t1_ = $author$project$OOP$LangUtils$processAfterParse(t1);
			return A3($author$project$OOP$Syntax$TList, ws, t1_, t2_);
		case 'TTuple2':
			var ws = term.a;
			var t1 = term.b;
			var t2 = term.c;
			var t2_ = $author$project$OOP$LangUtils$processAfterParse(t2);
			var t1_ = $author$project$OOP$LangUtils$processAfterParse(t1);
			return A3($author$project$OOP$Syntax$TTuple2, ws, t1_, t2_);
		case 'TTuple3':
			var ws = term.a;
			var t1 = term.b;
			var t2 = term.c;
			var t3 = term.d;
			var t3_ = $author$project$OOP$LangUtils$processAfterParse(t3);
			var t2_ = $author$project$OOP$LangUtils$processAfterParse(t2);
			var t1_ = $author$project$OOP$LangUtils$processAfterParse(t1);
			return A4($author$project$OOP$Syntax$TTuple3, ws, t1_, t2_, t3_);
		case 'TBPrim':
			var ws = term.a;
			var op = term.b;
			var t1 = term.c;
			var t2 = term.d;
			var t2_ = $author$project$OOP$LangUtils$processAfterParse(t2);
			var t1_ = $author$project$OOP$LangUtils$processAfterParse(t1);
			return A4($author$project$OOP$Syntax$TBPrim, ws, op, t1_, t2_);
		case 'TUPrim':
			var ws = term.a;
			var op = term.b;
			var t = term.c;
			var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
			return A3($author$project$OOP$Syntax$TUPrim, ws, op, t_);
		case 'TParens':
			var ws = term.a;
			var t = term.b;
			var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
			return A2($author$project$OOP$Syntax$TParens, ws, t_);
		case 'TRef':
			var ws = term.a;
			var t = term.b;
			var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
			return A2($author$project$OOP$Syntax$TRef, ws, t_);
		case 'TDeRef':
			var ws = term.a;
			var t = term.b;
			var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
			return A2($author$project$OOP$Syntax$TDeRef, ws, t_);
		case 'TAssign':
			var ws = term.a;
			var t1 = term.b;
			var t2 = term.c;
			var t2_ = $author$project$OOP$LangUtils$processAfterParse(t2);
			var t1_ = $author$project$OOP$LangUtils$processAfterParse(t1);
			return A3($author$project$OOP$Syntax$TAssign, ws, t1_, t2_);
		case 'TField':
			var ws = term.a;
			var t = term.b;
			var f = term.c;
			var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
			return A3($author$project$OOP$Syntax$TField, ws, t_, f);
		case 'TInvk':
			var ws = term.a;
			var t = term.b;
			var m = term.c;
			var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
			return A3($author$project$OOP$Syntax$TInvk, ws, t_, m);
		case 'TNew':
			var ws = term.a;
			var c = term.b;
			var t = term.c;
			var t_ = $author$project$OOP$LangUtils$processAfterParse(t);
			return A3($author$project$OOP$Syntax$TNew, ws, c, t_);
		default:
			return term;
	}
};
var $author$project$OOP$Controller$evalNotOnlyObjects = function (model) {
	var parseRes = $author$project$OOP$Parser$Program$parse(model.code);
	if (parseRes.$ === 'Ok') {
		if (parseRes.a.$ === 'WithCT') {
			var _v1 = parseRes.a;
			var classtb = _v1.a;
			var term = _v1.b;
			var withGui = $author$project$OOP$Preclude$Gui$assemble(classtb);
			var pTerm = $author$project$OOP$LangUtils$processAfterParse(
				A2($author$project$OOP$Preclude$Library$assemble, $author$project$OOP$Preclude$Library$parsedLibrary, term));
			var _v2 = A4($author$project$OOP$Eval$eval, _List_Nil, _List_Nil, withGui, pTerm);
			var val = _v2.a;
			var state = _v2.b;
			var output = $author$project$OOP$Printer$Value$printValue(val);
			return _Utils_update(
				model,
				{classTable: withGui, htmlOutput: output, isConsistent: true, state: state});
		} else {
			var term = parseRes.a.a;
			var pTerm = $author$project$OOP$LangUtils$processAfterParse(
				A2($author$project$OOP$Preclude$Library$assemble, $author$project$OOP$Preclude$Library$parsedLibrary, term));
			var _v3 = A4($author$project$OOP$Eval$eval, _List_Nil, _List_Nil, $author$project$OOP$Preclude$Gui$parsedGui, pTerm);
			var val = _v3.a;
			var state = _v3.b;
			var output = $author$project$OOP$Printer$Value$printValue(val);
			return _Utils_update(
				model,
				{classTable: $author$project$OOP$Preclude$Gui$parsedGui, htmlOutput: output, isConsistent: true, state: state});
		}
	} else {
		var info = parseRes.a;
		return _Utils_update(
			model,
			{
				classTable: _Utils_Tuple2(_List_Nil, _List_Nil),
				htmlOutput: $elm$core$Debug$toString(info),
				state: _List_Nil
			});
	}
};
var $author$project$OOP$Controller$evalOnlyObjects = function (model) {
	var parseRes = $author$project$OOP$Parser$Program$parse(model.code);
	if (parseRes.$ === 'Ok') {
		if (parseRes.a.$ === 'WithCT') {
			var _v1 = parseRes.a;
			var classtb = _v1.a;
			var term = _v1.b;
			var withGui = $author$project$OOP$Preclude$Gui$assemble(classtb);
			var pTerm = $author$project$OOP$LangUtils$processAfterParse(
				A2($author$project$OOP$Preclude$Library$assemble, $author$project$OOP$Preclude$Library$parsedLibrary, term));
			var _v2 = A4($author$project$OOP$Eval$eval, _List_Nil, _List_Nil, withGui, pTerm);
			var objectVal = _v2.a;
			var state = _v2.b;
			var _v3 = A5($author$project$OOP$Objects$O2HTranslator$object2Html, objectVal, 0, _List_Nil, model.templates, state);
			var htmlVal = _v3.a;
			var envDict = _v3.c;
			var htmlOutput = $author$project$OOP$Printer$Value$printValue(htmlVal);
			return _Utils_update(
				model,
				{classTable: withGui, envDict: envDict, htmlOutput: htmlOutput, isConsistent: true, objectsOutput: objectVal, state: state});
		} else {
			var term = parseRes.a.a;
			var pTerm = $author$project$OOP$LangUtils$processAfterParse(
				A2($author$project$OOP$Preclude$Library$assemble, $author$project$OOP$Preclude$Library$parsedLibrary, term));
			var _v4 = A4($author$project$OOP$Eval$eval, _List_Nil, _List_Nil, $author$project$OOP$Preclude$Gui$parsedGui, pTerm);
			var objectVal = _v4.a;
			var state = _v4.b;
			var _v5 = A5($author$project$OOP$Objects$O2HTranslator$object2Html, objectVal, 0, _List_Nil, _List_Nil, state);
			var htmlVal = _v5.a;
			var envDict = _v5.c;
			var htmlOutput = $author$project$OOP$Printer$Value$printValue(htmlVal);
			return _Utils_update(
				model,
				{classTable: $author$project$OOP$Preclude$Gui$parsedGui, envDict: envDict, htmlOutput: htmlOutput, isConsistent: true, objectsOutput: objectVal, state: state});
		}
	} else {
		var info = parseRes.a;
		return _Utils_update(
			model,
			{
				classTable: _Utils_Tuple2(_List_Nil, _List_Nil),
				envDict: _List_Nil,
				htmlOutput: $elm$core$Debug$toString(info),
				isConsistent: false,
				objectsOutput: $author$project$OOP$Syntax$VError(''),
				state: _List_Nil
			});
	}
};
var $author$project$OOP$Controller$evalCodeToModel = function (model) {
	return model.isOnlyObjects ? $author$project$OOP$Controller$evalOnlyObjects(model) : $author$project$OOP$Controller$evalNotOnlyObjects(model);
};
var $author$project$OOP$Controller$listToTemplates = function (ls) {
	if (ls.b) {
		if (ls.b.b && ls.b.b.b) {
			var _class = ls.a;
			var _v1 = ls.b;
			var op = _v1.a;
			var _v2 = _v1.b;
			var hp = _v2.a;
			var res = _v2.b;
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple3(_class, op, hp),
				$author$project$OOP$Controller$listToTemplates(res));
		} else {
			return _List_fromArray(
				[
					_Utils_Tuple3('Error : 30.', '', '')
				]);
		}
	} else {
		return _List_Nil;
	}
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
var $author$project$OOP$Main$replyCode = _Platform_outgoingPort(
	'replyCode',
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
var $author$project$OOP$Main$replyModifiableClassList = _Platform_outgoingPort(
	'replyModifiableClassList',
	function ($) {
		var a = $.a;
		var b = $.b;
		return A2(
			$elm$json$Json$Encode$list,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$json$Json$Encode$string(a),
					$elm$json$Json$Encode$list($elm$json$Json$Encode$string)(b)
				]));
	});
var $author$project$OOP$Main$replyOutput = _Platform_outgoingPort('replyOutput', $elm$json$Json$Encode$string);
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$OOP$Main$setCodeRed = _Platform_outgoingPort(
	'setCodeRed',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$OOP$LangUtils$appendCT = F2(
	function (_v0, _v1) {
		var ws = _v0.a;
		var ls1 = _v0.b;
		var ls2 = _v1.b;
		return _Utils_Tuple2(
			ws,
			_Utils_ap(ls1, ls2));
	});
var $author$project$OOP$CTLift$flat = function (tree) {
	if (tree.$ === 'Leaf') {
		var clsDef = tree.a;
		return _List_fromArray(
			[clsDef]);
	} else {
		var root = tree.a;
		var subTrees = tree.b;
		return A2(
			$elm$core$List$cons,
			root,
			A3(
				$elm$core$List$foldl,
				function (subTree) {
					return function (tol) {
						return _Utils_ap(
							$author$project$OOP$CTLift$flat(subTree),
							tol);
					};
				},
				_List_Nil,
				subTrees));
	}
};
var $author$project$OOP$CTLift$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $author$project$OOP$CTLift$Tree = F2(
	function (a, b) {
		return {$: 'Tree', a: a, b: b};
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$OOP$CTLift$getRootMs = function (tree) {
	if (tree.$ === 'Leaf') {
		var _v1 = tree.a;
		var _v2 = _v1.b;
		var _v3 = _v2.c;
		var ms = _v3.b;
		return ms;
	} else {
		var _v4 = tree.a;
		var _v5 = _v4.b;
		var _v6 = _v5.c;
		var ms = _v6.b;
		return ms;
	}
};
var $author$project$OOP$CTLift$insertToMT = F2(
	function (_v0, mt) {
		var ws1 = _v0.a;
		var _v1 = _v0.b;
		var m1 = _v1.a;
		var p1 = _v1.b;
		var t1 = _v1.c;
		if (mt.b) {
			var _v3 = mt.a;
			var ws2 = _v3.a;
			var _v4 = _v3.b;
			var m2 = _v4.a;
			var p2 = _v4.b;
			var t2 = _v4.c;
			var mt_ = mt.b;
			return (_Utils_eq(m1, m2) && _Utils_eq(p1, p2)) ? mt : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					ws2,
					_Utils_Tuple3(m2, p2, t2)),
				A2(
					$author$project$OOP$CTLift$insertToMT,
					_Utils_Tuple2(
						ws1,
						_Utils_Tuple3(m1, p1, t1)),
					mt_));
		} else {
			return _List_fromArray(
				[
					_Utils_Tuple2(
					ws1,
					_Utils_Tuple3(m1, p1, t1))
				]);
		}
	});
var $author$project$OOP$CTLift$findAllMethodsCanLifted = function (subTrees) {
	return A3(
		$elm$core$List$foldl,
		function (subTree) {
			return function (tol) {
				var methods = $author$project$OOP$CTLift$getRootMs(subTree);
				return A3(
					$elm$core$List$foldl,
					function (_v0) {
						var ws = _v0.a;
						var m = _v0.b;
						return function (tol_) {
							if (ws.b && (ws.a === 'Lift')) {
								return A2(
									$author$project$OOP$CTLift$insertToMT,
									_Utils_Tuple2(ws, m),
									tol_);
							} else {
								return tol_;
							}
						};
					},
					tol,
					methods);
			};
		},
		_List_Nil,
		subTrees);
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$OOP$CTLift$checkHasMethod = F2(
	function (ms, m) {
		checkHasMethod:
		while (true) {
			if (ms.b) {
				var _v1 = ms.a;
				var _v2 = _v1.b;
				var m1 = _v2.a;
				var ms_ = ms.b;
				if (_Utils_eq(m, m1)) {
					return true;
				} else {
					var $temp$ms = ms_,
						$temp$m = m;
					ms = $temp$ms;
					m = $temp$m;
					continue checkHasMethod;
				}
			} else {
				return false;
			}
		}
	});
var $author$project$OOP$CTLift$checkSubTree = F3(
	function (tree, m, invks) {
		if (tree.$ === 'Leaf') {
			var _v1 = tree.a;
			var _v2 = _v1.b;
			var _v3 = _v2.a;
			var c = _v3.a;
			var _v4 = _v2.c;
			var ms = _v4.b;
			return (A2($author$project$OOP$CTLift$checkHasMethod, ms, m) || (!A2(
				$elm$core$Set$member,
				_Utils_Tuple2(c, m),
				invks))) ? true : false;
		} else {
			var _v5 = tree.a;
			var _v6 = _v5.b;
			var _v7 = _v6.a;
			var c = _v7.a;
			var _v8 = _v6.c;
			var ms = _v8.b;
			var subTrees = tree.b;
			return A2($author$project$OOP$CTLift$checkHasMethod, ms, m) ? true : ((!A2(
				$elm$core$Set$member,
				_Utils_Tuple2(c, m),
				invks)) ? A2(
				$elm$core$List$all,
				function (subTree) {
					return A3($author$project$OOP$CTLift$checkSubTree, subTree, m, invks);
				},
				subTrees) : false);
		}
	});
var $author$project$OOP$CTLift$delFromMT = F2(
	function (_v0, mt) {
		var ws1 = _v0.a;
		var m1 = _v0.b;
		if (mt.b) {
			var _v2 = mt.a;
			var ws2 = _v2.a;
			var m2 = _v2.b;
			var mt_ = mt.b;
			return _Utils_eq(m1, m2) ? mt_ : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(ws2, m2),
				A2(
					$author$project$OOP$CTLift$delFromMT,
					_Utils_Tuple2(ws1, m1),
					mt_));
		} else {
			return _List_Nil;
		}
	});
var $author$project$OOP$CTLift$handleEachMethod = F5(
	function (mt, _v0, ms, subTree, invks) {
		handleEachMethod:
		while (true) {
			var ws1 = _v0.a;
			var _v1 = _v0.b;
			var m1 = _v1.a;
			var p1 = _v1.b;
			var t1 = _v1.c;
			if (ms.b) {
				var _v3 = ms.a;
				var ws2 = _v3.a;
				var _v4 = _v3.b;
				var m2 = _v4.a;
				var p2 = _v4.b;
				var t2 = _v4.c;
				var ms_ = ms.b;
				if (_Utils_eq(m1, m2)) {
					if (ws2.b && (ws2.a === 'Lift')) {
						return (_Utils_eq(p1, p2) && _Utils_eq(t1, t2)) ? mt : A2(
							$author$project$OOP$CTLift$delFromMT,
							_Utils_Tuple2(
								ws1,
								_Utils_Tuple3(m1, p1, t1)),
							mt);
					} else {
						return mt;
					}
				} else {
					var $temp$mt = mt,
						$temp$_v0 = _Utils_Tuple2(
						ws1,
						_Utils_Tuple3(m1, p1, t1)),
						$temp$ms = ms_,
						$temp$subTree = subTree,
						$temp$invks = invks;
					mt = $temp$mt;
					_v0 = $temp$_v0;
					ms = $temp$ms;
					subTree = $temp$subTree;
					invks = $temp$invks;
					continue handleEachMethod;
				}
			} else {
				return A3($author$project$OOP$CTLift$checkSubTree, subTree, m1, invks) ? mt : A2(
					$author$project$OOP$CTLift$delFromMT,
					_Utils_Tuple2(
						ws1,
						_Utils_Tuple3(m1, p1, t1)),
					mt);
			}
		}
	});
var $author$project$OOP$CTLift$getLiftMethods = F3(
	function (par, subTrees, invks) {
		var allCanLift = function () {
			var _v1 = par.b;
			var _v2 = _v1.a;
			var c = _v2.a;
			return A2(
				$elm$core$List$filter,
				function (_v3) {
					var _v4 = _v3.b;
					var m = _v4.a;
					return !A2(
						$elm$core$Set$member,
						_Utils_Tuple2(c, m),
						invks);
				},
				$author$project$OOP$CTLift$findAllMethodsCanLifted(subTrees));
		}();
		return A3(
			$elm$core$List$foldl,
			function (subTree) {
				return function (canLift) {
					var methods = $author$project$OOP$CTLift$getRootMs(subTree);
					return A3(
						$elm$core$List$foldl,
						function (m) {
							return function (canLift_) {
								return A5($author$project$OOP$CTLift$handleEachMethod, canLift_, m, methods, subTree, invks);
							};
						},
						canLift,
						canLift);
				};
			},
			allCanLift,
			subTrees);
	});
var $author$project$OOP$CTLift$checkAndInsertToMS = F2(
	function (_v0, ms) {
		var ws1 = _v0.a;
		var _v1 = _v0.b;
		var m1 = _v1.a;
		var p1 = _v1.b;
		var t1 = _v1.c;
		if (ms.b) {
			var _v3 = ms.a;
			var ws2 = _v3.a;
			var _v4 = _v3.b;
			var m2 = _v4.a;
			var p2 = _v4.b;
			var t2 = _v4.c;
			var ms_ = ms.b;
			return _Utils_eq(m1, m2) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					ws2,
					_Utils_Tuple3(m2, p1, t1)),
				ms_) : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					ws2,
					_Utils_Tuple3(m2, p2, t2)),
				A2(
					$author$project$OOP$CTLift$checkAndInsertToMS,
					_Utils_Tuple2(
						ws1,
						_Utils_Tuple3(m1, p1, t1)),
					ms_));
		} else {
			return _List_fromArray(
				[
					_Utils_Tuple2(
					ws1,
					_Utils_Tuple3(m1, p1, t1))
				]);
		}
	});
var $author$project$OOP$CTLift$handleParent = F2(
	function (_v0, mt) {
		var ws1 = _v0.a;
		var _v1 = _v0.b;
		var _v2 = _v1.a;
		var c = _v2.a;
		var f = _v2.b;
		var fs = _v1.b;
		var _v3 = _v1.c;
		var ws2 = _v3.a;
		var ms = _v3.b;
		var ms_ = A3(
			$elm$core$List$foldl,
			function (m) {
				return function (methods) {
					return A2($author$project$OOP$CTLift$checkAndInsertToMS, m, methods);
				};
			},
			ms,
			mt);
		return _Utils_Tuple2(
			ws1,
			_Utils_Tuple3(
				_Utils_Tuple2(c, f),
				fs,
				_Utils_Tuple2(ws2, ms_)));
	});
var $author$project$OOP$Utils$exist = F2(
	function (a, ls) {
		exist:
		while (true) {
			if (ls.b) {
				var x = ls.a;
				var xs = ls.b;
				if (_Utils_eq(a, x)) {
					return true;
				} else {
					var $temp$a = a,
						$temp$ls = xs;
					a = $temp$a;
					ls = $temp$ls;
					continue exist;
				}
			} else {
				return false;
			}
		}
	});
var $author$project$OOP$CTLift$handleMS = F2(
	function (ms, mt) {
		handleMS:
		while (true) {
			if (ms.b) {
				var m = ms.a;
				var ms_ = ms.b;
				if (A2($author$project$OOP$Utils$exist, m, mt)) {
					var $temp$ms = ms_,
						$temp$mt = mt;
					ms = $temp$ms;
					mt = $temp$mt;
					continue handleMS;
				} else {
					return A2(
						$elm$core$List$cons,
						m,
						A2($author$project$OOP$CTLift$handleMS, ms_, mt));
				}
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$OOP$CTLift$handleSubTrees = F2(
	function (subTrees, mt) {
		return A2(
			$elm$core$List$map,
			function (subTree) {
				if (subTree.$ === 'Leaf') {
					var _v1 = subTree.a;
					var ws1 = _v1.a;
					var _v2 = _v1.b;
					var _v3 = _v2.a;
					var c = _v3.a;
					var f = _v3.b;
					var fs = _v2.b;
					var _v4 = _v2.c;
					var ws2 = _v4.a;
					var ms = _v4.b;
					return $author$project$OOP$CTLift$Leaf(
						_Utils_Tuple2(
							ws1,
							_Utils_Tuple3(
								_Utils_Tuple2(c, f),
								fs,
								_Utils_Tuple2(
									ws2,
									A2($author$project$OOP$CTLift$handleMS, ms, mt)))));
				} else {
					var _v5 = subTree.a;
					var ws1 = _v5.a;
					var _v6 = _v5.b;
					var _v7 = _v6.a;
					var c = _v7.a;
					var f = _v7.b;
					var fs = _v6.b;
					var _v8 = _v6.c;
					var ws2 = _v8.a;
					var ms = _v8.b;
					var subTs = subTree.b;
					return A2(
						$author$project$OOP$CTLift$Tree,
						_Utils_Tuple2(
							ws1,
							_Utils_Tuple3(
								_Utils_Tuple2(c, f),
								fs,
								_Utils_Tuple2(
									ws2,
									A2($author$project$OOP$CTLift$handleMS, ms, mt)))),
						subTs);
				}
			},
			subTrees);
	});
var $author$project$OOP$CTLift$lift = F2(
	function (invks, tree) {
		if (tree.$ === 'Leaf') {
			var clsDef = tree.a;
			return $author$project$OOP$CTLift$Leaf(clsDef);
		} else {
			var root = tree.a;
			var subTrees = tree.b;
			var subTrees1 = A2(
				$elm$core$List$map,
				function (subTree) {
					return A2($author$project$OOP$CTLift$lift, invks, subTree);
				},
				subTrees);
			var liftMethods = A3($author$project$OOP$CTLift$getLiftMethods, root, subTrees1, invks);
			var root_ = A2($author$project$OOP$CTLift$handleParent, root, liftMethods);
			var subTrees2 = A2($author$project$OOP$CTLift$handleSubTrees, subTrees1, liftMethods);
			return A2($author$project$OOP$CTLift$Tree, root_, subTrees2);
		}
	});
var $author$project$OOP$CTLift$markSubclassing = function (_v0) {
	var ws_ct = _v0.a;
	var ct = _v0.b;
	return _Utils_Tuple2(
		ws_ct,
		A2(
			$elm$core$List$map,
			function (_v1) {
				var _v2 = _v1.b;
				var _v3 = _v2.a;
				var c = _v3.a;
				var f = _v3.b;
				var fs = _v2.b;
				var _v4 = _v2.c;
				var ws1 = _v4.a;
				var ms = _v4.b;
				return _Utils_Tuple2(
					_List_fromArray(
						['S']),
					_Utils_Tuple3(
						_Utils_Tuple2(c, f),
						fs,
						_Utils_Tuple2(
							ws1,
							A2(
								$elm$core$List$map,
								function (_v5) {
									var ws2 = _v5.a;
									var m = _v5.b;
									return _Utils_Tuple2(
										A2($elm$core$List$cons, 'Lift', ws2),
										m);
								},
								ms))));
			},
			ct));
};
var $author$project$OOP$CTLift$modelTree = F2(
	function (root, ct) {
		var childs = function () {
			var _v1 = root.b;
			var _v2 = _v1.a;
			var c = _v2.a;
			return A2(
				$elm$core$List$filter,
				function (_v3) {
					var _v4 = _v3.b;
					var _v5 = _v4.a;
					var f = _v5.b;
					return _Utils_eq(f, c);
				},
				ct);
		}();
		if (_Utils_eq(childs, _List_Nil)) {
			return $author$project$OOP$CTLift$Leaf(root);
		} else {
			var subCTs = A2(
				$elm$core$List$map,
				function (clsDef) {
					return A2($author$project$OOP$CTLift$modelTree, clsDef, ct);
				},
				childs);
			return A2($author$project$OOP$CTLift$Tree, root, subCTs);
		}
	});
var $author$project$OOP$CTLift$getClsName = function (_v0) {
	var _v1 = _v0.b;
	var _v2 = _v1.a;
	var c = _v2.a;
	return c;
};
var $author$project$OOP$CTLift$findClass = F2(
	function (c1, ls) {
		findClass:
		while (true) {
			if (ls.b) {
				var c2 = ls.a;
				var ls_ = ls.b;
				if (_Utils_eq(
					$author$project$OOP$CTLift$getClsName(c1),
					$author$project$OOP$CTLift$getClsName(c2))) {
					return $elm$core$Maybe$Just(c2);
				} else {
					var $temp$c1 = c1,
						$temp$ls = ls_;
					c1 = $temp$c1;
					ls = $temp$ls;
					continue findClass;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$OOP$CTLift$reorder = F2(
	function (ori, _new) {
		return A2(
			$elm$core$List$map,
			function (c) {
				var _v0 = A2($author$project$OOP$CTLift$findClass, c, _new);
				if (_v0.$ === 'Just') {
					var c_ = _v0.a;
					return c_;
				} else {
					return _Utils_Tuple2(
						_List_fromArray(
							['Del']),
						_Utils_Tuple3(
							_Utils_Tuple2('', ''),
							_Utils_Tuple2(_List_Nil, _List_Nil),
							_Utils_Tuple2(_List_Nil, _List_Nil)));
				}
			},
			ori);
	});
var $author$project$OOP$CTLift$sortOut = function (classes) {
	if (classes.b) {
		var _v1 = classes.a;
		var ws1 = _v1.a;
		var _v2 = _v1.b;
		var _v3 = _v2.a;
		var c = _v3.a;
		var f = _v3.b;
		var fs = _v2.b;
		var _v4 = _v2.c;
		var ws2 = _v4.a;
		var ms = _v4.b;
		var classes_ = classes.b;
		var _v5 = $author$project$OOP$CTLift$sortOut(classes_);
		var res1 = _v5.a;
		var res2 = _v5.b;
		return (_Utils_eq(
			ws1,
			_List_fromArray(
				['S'])) && _Utils_eq(ms, _List_Nil)) ? _Utils_Tuple2(
			res1,
			A2($elm$core$List$cons, c, res2)) : _Utils_Tuple2(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					ws1,
					_Utils_Tuple3(
						_Utils_Tuple2(c, f),
						fs,
						_Utils_Tuple2(ws2, ms))),
				res1),
			res2);
	} else {
		return _Utils_Tuple2(_List_Nil, _List_Nil);
	}
};
var $author$project$OOP$CTLift$ctLift = F3(
	function (ct, subClasses, invks) {
		var markedSubs = $author$project$OOP$CTLift$markSubclassing(subClasses);
		var _v0 = A2($author$project$OOP$LangUtils$appendCT, ct, markedSubs);
		var ws = _v0.a;
		var ct1 = _v0.b;
		var ct2 = A2(
			$author$project$OOP$CTLift$lift,
			invks,
			A2(
				$author$project$OOP$CTLift$modelTree,
				_Utils_Tuple2(
					_List_Nil,
					_Utils_Tuple3(
						_Utils_Tuple2('Object', ''),
						_Utils_Tuple2(_List_Nil, _List_Nil),
						_Utils_Tuple2(_List_Nil, _List_Nil))),
				ct1));
		var _v1 = $author$project$OOP$CTLift$sortOut(
			A2(
				$author$project$OOP$CTLift$reorder,
				ct1,
				$author$project$OOP$CTLift$flat(ct2)));
		var ct3 = _v1.a;
		var delList = _v1.b;
		return _Utils_Tuple2(
			_Utils_Tuple2(ws, ct3),
			delList);
	});
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $author$project$OOP$CTLift$delTailNum = function (c) {
	delTailNum:
	while (true) {
		var _v0 = $elm$core$String$uncons(
			A2($elm$core$String$right, 1, c));
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var _char = _v1.a;
			if ($elm$core$Char$isDigit(_char)) {
				var $temp$c = A2($elm$core$String$dropRight, 1, c);
				c = $temp$c;
				continue delTailNum;
			} else {
				return c;
			}
		} else {
			return c;
		}
	}
};
var $author$project$OOP$CTLift$delSubClasses = F2(
	function (delList, term) {
		_v0$21:
		while (true) {
			switch (term.$) {
				case 'TLam':
					var ws = term.a;
					var p = term.b;
					var t = term.c;
					return A3(
						$author$project$OOP$Syntax$TLam,
						ws,
						p,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t));
				case 'TApp':
					var ws = term.a;
					var t1 = term.b;
					var t2 = term.c;
					return A3(
						$author$project$OOP$Syntax$TApp,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2));
				case 'TLet':
					var ws = term.a;
					var p = term.b;
					var t1 = term.c;
					var t2 = term.d;
					return A4(
						$author$project$OOP$Syntax$TLet,
						ws,
						p,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2));
				case 'TLetrec':
					var ws = term.a;
					var p = term.b;
					var t1 = term.c;
					var t2 = term.d;
					return A4(
						$author$project$OOP$Syntax$TLetrec,
						ws,
						p,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2));
				case 'TCons':
					var ws = term.a;
					var t1 = term.b;
					var t2 = term.c;
					return A3(
						$author$project$OOP$Syntax$TCons,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2));
				case 'TList':
					var ws = term.a;
					var t1 = term.b;
					var t2 = term.c;
					return A3(
						$author$project$OOP$Syntax$TList,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2));
				case 'TTuple2':
					var ws = term.a;
					var t1 = term.b;
					var t2 = term.c;
					return A3(
						$author$project$OOP$Syntax$TTuple2,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2));
				case 'TTuple3':
					var ws = term.a;
					var t1 = term.b;
					var t2 = term.c;
					var t3 = term.d;
					return A4(
						$author$project$OOP$Syntax$TTuple3,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t3));
				case 'TBPrim':
					var ws = term.a;
					var op = term.b;
					var t1 = term.c;
					var t2 = term.d;
					return A4(
						$author$project$OOP$Syntax$TBPrim,
						ws,
						op,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2));
				case 'TUPrim':
					var ws = term.a;
					var op = term.b;
					var t = term.c;
					return A3(
						$author$project$OOP$Syntax$TUPrim,
						ws,
						op,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t));
				case 'TParens':
					var ws = term.a;
					var t = term.b;
					return A2(
						$author$project$OOP$Syntax$TParens,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t));
				case 'TRef':
					var ws = term.a;
					var t = term.b;
					return A2(
						$author$project$OOP$Syntax$TRef,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t));
				case 'TDeRef':
					var ws = term.a;
					var t = term.b;
					return A2(
						$author$project$OOP$Syntax$TDeRef,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t));
				case 'TAssign':
					var ws = term.a;
					var t1 = term.b;
					var t2 = term.c;
					return A3(
						$author$project$OOP$Syntax$TAssign,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2));
				case 'TField':
					if (term.c.$ === 'TVar') {
						var ws1 = term.a;
						var t = term.b;
						var _v1 = term.c;
						var ws2 = _v1.a;
						var f = _v1.b;
						return A3(
							$author$project$OOP$Syntax$TField,
							ws1,
							A2($author$project$OOP$CTLift$delSubClasses, delList, t),
							A2($author$project$OOP$Syntax$TVar, ws2, f));
					} else {
						break _v0$21;
					}
				case 'TInvk':
					if (term.c.$ === 'TVar') {
						var ws1 = term.a;
						var t = term.b;
						var _v2 = term.c;
						var ws2 = _v2.a;
						var m = _v2.b;
						return A3(
							$author$project$OOP$Syntax$TInvk,
							ws1,
							A2($author$project$OOP$CTLift$delSubClasses, delList, t),
							A2($author$project$OOP$Syntax$TVar, ws2, m));
					} else {
						break _v0$21;
					}
				case 'TNew':
					var ws = term.a;
					var cl = term.b;
					var args = term.c;
					return A2($author$project$OOP$Utils$exist, cl, delList) ? A3(
						$author$project$OOP$Syntax$TNew,
						ws,
						$author$project$OOP$CTLift$delTailNum(cl),
						A2($author$project$OOP$CTLift$delSubClasses, delList, args)) : term;
				case 'TSeq':
					var ws = term.a;
					var t1 = term.b;
					var t2 = term.c;
					return A3(
						$author$project$OOP$Syntax$TSeq,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2));
				case 'THtml':
					var ws = term.a;
					var s = term.b;
					var t1 = term.c;
					var t2 = term.d;
					var t3 = term.e;
					return A5(
						$author$project$OOP$Syntax$THtml,
						ws,
						s,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t1),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t2),
						A2($author$project$OOP$CTLift$delSubClasses, delList, t3));
				case 'TToStr':
					var ws = term.a;
					var t = term.b;
					return A2(
						$author$project$OOP$Syntax$TToStr,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, t));
				case 'TMap':
					var ws = term.a;
					var d = term.b;
					var f = term.c;
					var ls = term.d;
					return A4(
						$author$project$OOP$Syntax$TMap,
						ws,
						A2($author$project$OOP$CTLift$delSubClasses, delList, d),
						A2($author$project$OOP$CTLift$delSubClasses, delList, f),
						A2($author$project$OOP$CTLift$delSubClasses, delList, ls));
				default:
					break _v0$21;
			}
		}
		return term;
	});
var $author$project$OOP$Controller$genCnt = function (_v0) {
	var ctb = _v0.b;
	return A2(
		$elm$core$List$map,
		function (_v1) {
			var _v2 = _v1.b;
			var _v3 = _v2.a;
			var c = _v3.a;
			return _Utils_Tuple2(c, 0);
		},
		ctb);
};
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$OOP$Utils$updateValueInDict = F3(
	function (s, v, dict) {
		if (!dict.b) {
			return _List_Nil;
		} else {
			var _v1 = dict.a;
			var s1 = _v1.a;
			var v1 = _v1.b;
			var dict_ = dict.b;
			return _Utils_eq(s1, s) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(s1, v),
				dict_) : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(s1, v1),
				A3($author$project$OOP$Utils$updateValueInDict, s, v, dict_));
		}
	});
var $author$project$OOP$Objects$H2OTranslator$checkVarIsRef = F4(
	function (s, oenv, state, res) {
		var findVarRes = A2($author$project$OOP$Utils$findByName, s, oenv);
		if (findVarRes.$ === 'Just') {
			var val = findVarRes.a;
			if (val.$ === 'VLoc') {
				var n = val.a;
				return $elm$core$Result$Ok(
					_Utils_Tuple2(
						oenv,
						A3($author$project$OOP$Utils$replace, n, res, state)));
			} else {
				return $elm$core$Result$Ok(
					_Utils_Tuple2(
						A3($author$project$OOP$Utils$updateValueInDict, s, res, oenv),
						state));
			}
		} else {
			return $elm$core$Result$Err('No Such Variable : 05.');
		}
	});
var $author$project$OOP$Objects$H2OTranslator$delOstLayer = function (html) {
	_v0$2:
	while (true) {
		if ((html.$ === 'VHtml') && (html.d.$ === 'VCons')) {
			switch (html.d.b.$) {
				case 'VNil':
					var _v1 = html.d;
					var child = _v1.a;
					var _v2 = _v1.b;
					return $elm$core$Maybe$Just(child);
				case 'VCons':
					if (html.d.b.b.$ === 'VNil') {
						var _v3 = html.d;
						var child = _v3.a;
						var _v4 = _v3.b;
						var _v5 = _v4.b;
						return $elm$core$Maybe$Just(child);
					} else {
						break _v0$2;
					}
				default:
					break _v0$2;
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$OOP$Objects$H2OTranslator$findIDAttr = function (attr) {
	findIDAttr:
	while (true) {
		if (attr.$ === 'VCons') {
			var v1 = attr.a;
			var v2 = attr.b;
			if (((v1.$ === 'VCons') && (v1.b.$ === 'VCons')) && (v1.b.b.$ === 'VNil')) {
				var v11 = v1.a;
				var _v2 = v1.b;
				var v12 = _v2.a;
				var _v3 = _v2.b;
				if (_Utils_eq(
					v11,
					$author$project$OOP$Syntax$VString('id'))) {
					return $elm$core$Maybe$Just(
						$author$project$OOP$Printer$Value$printString(v12));
				} else {
					var $temp$attr = v2;
					attr = $temp$attr;
					continue findIDAttr;
				}
			} else {
				var $temp$attr = v2;
				attr = $temp$attr;
				continue findIDAttr;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	}
};
var $author$project$OOP$Objects$H2OTranslator$findObjectEnv = F2(
	function (dict, id) {
		findObjectEnv:
		while (true) {
			if (dict.b) {
				var _v1 = dict.a;
				var id1 = _v1.a;
				var env1 = _v1.b;
				var res = dict.b;
				if (_Utils_eq(id, id1)) {
					return $elm$core$Maybe$Just(env1);
				} else {
					var $temp$dict = res,
						$temp$id = id;
					dict = $temp$dict;
					id = $temp$id;
					continue findObjectEnv;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$OOP$Objects$ThreeMerge$threeMerge = F3(
	function (oV, v1, v2) {
		var _v0 = _Utils_Tuple3(oV, v1, v2);
		_v0$5:
		while (true) {
			switch (_v0.a.$) {
				case 'VCons':
					if ((_v0.b.$ === 'VCons') && (_v0.c.$ === 'VCons')) {
						var _v1 = _v0.a;
						var o1 = _v1.a;
						var o2 = _v1.b;
						var _v2 = _v0.b;
						var v11 = _v2.a;
						var v12 = _v2.b;
						var _v3 = _v0.c;
						var v21 = _v3.a;
						var v22 = _v3.b;
						return A2(
							$author$project$OOP$Syntax$VCons,
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o1, v11, v21),
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o2, v12, v22));
					} else {
						break _v0$5;
					}
				case 'VTuple2':
					if ((_v0.b.$ === 'VTuple2') && (_v0.c.$ === 'VTuple2')) {
						var _v4 = _v0.a;
						var o1 = _v4.a;
						var o2 = _v4.b;
						var _v5 = _v0.b;
						var v11 = _v5.a;
						var v12 = _v5.b;
						var _v6 = _v0.c;
						var v21 = _v6.a;
						var v22 = _v6.b;
						return A2(
							$author$project$OOP$Syntax$VTuple2,
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o1, v11, v21),
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o2, v12, v22));
					} else {
						break _v0$5;
					}
				case 'VTuple3':
					if ((_v0.b.$ === 'VTuple3') && (_v0.c.$ === 'VTuple3')) {
						var _v7 = _v0.a;
						var o1 = _v7.a;
						var o2 = _v7.b;
						var o3 = _v7.c;
						var _v8 = _v0.b;
						var v11 = _v8.a;
						var v12 = _v8.b;
						var v13 = _v8.c;
						var _v9 = _v0.c;
						var v21 = _v9.a;
						var v22 = _v9.b;
						var v23 = _v9.c;
						return A3(
							$author$project$OOP$Syntax$VTuple3,
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o1, v11, v21),
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o2, v12, v22),
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o3, v13, v23));
					} else {
						break _v0$5;
					}
				case 'VNew':
					if ((_v0.b.$ === 'VNew') && (_v0.c.$ === 'VNew')) {
						var _v10 = _v0.a;
						var oc = _v10.a;
						var oarg = _v10.b;
						var _v11 = _v0.b;
						var c1 = _v11.a;
						var arg1 = _v11.b;
						var _v12 = _v0.c;
						var c2 = _v12.a;
						var arg2 = _v12.b;
						var arg = A3($author$project$OOP$Objects$ThreeMerge$threeMerge, oarg, arg1, arg2);
						return (!_Utils_eq(c1, oc)) ? A2($author$project$OOP$Syntax$VNew, c1, arg) : A2($author$project$OOP$Syntax$VNew, c2, arg);
					} else {
						break _v0$5;
					}
				case 'VHtml':
					if ((_v0.b.$ === 'VHtml') && (_v0.c.$ === 'VHtml')) {
						var _v13 = _v0.a;
						var ol = _v13.a;
						var o1 = _v13.b;
						var o2 = _v13.c;
						var o3 = _v13.d;
						var _v14 = _v0.b;
						var l1 = _v14.a;
						var v11 = _v14.b;
						var v12 = _v14.c;
						var v13 = _v14.d;
						var _v15 = _v0.c;
						var l2 = _v15.a;
						var v21 = _v15.b;
						var v22 = _v15.c;
						var v23 = _v15.d;
						var label = (!_Utils_eq(l1, ol)) ? l1 : l2;
						return A4(
							$author$project$OOP$Syntax$VHtml,
							label,
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o1, v11, v21),
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o2, v12, v22),
							A3($author$project$OOP$Objects$ThreeMerge$threeMerge, o3, v13, v23));
					} else {
						break _v0$5;
					}
				default:
					break _v0$5;
			}
		}
		return (!_Utils_eq(v1, oV)) ? v1 : v2;
	});
var $author$project$OOP$Objects$ThreeMerge$mergeEnv = F3(
	function (env1, env2, ori_env) {
		var _v0 = _Utils_Tuple3(env1, env2, ori_env);
		if ((_v0.a.b && _v0.b.b) && _v0.c.b) {
			var _v1 = _v0.a;
			var _v2 = _v1.a;
			var s1 = _v2.a;
			var v1 = _v2.b;
			var env1_ = _v1.b;
			var _v3 = _v0.b;
			var _v4 = _v3.a;
			var v2 = _v4.b;
			var env2_ = _v3.b;
			var _v5 = _v0.c;
			var _v6 = _v5.a;
			var v3 = _v6.b;
			var ori_env_ = _v5.b;
			var v_ = A3($author$project$OOP$Objects$ThreeMerge$threeMerge, v3, v1, v2);
			var env_ = A3($author$project$OOP$Objects$ThreeMerge$mergeEnv, env1_, env2_, ori_env_);
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(s1, v_),
				env_);
		} else {
			return _List_Nil;
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
var $author$project$OOP$Objects$ThreeMerge$mergeState = F3(
	function (state1, state2, state) {
		if ((!_Utils_eq(
			$elm$core$List$length(state1),
			$elm$core$List$length(state))) || (!_Utils_eq(
			$elm$core$List$length(state2),
			$elm$core$List$length(state)))) {
			return $elm$core$Result$Err('Merge State Error : 01.');
		} else {
			var _v0 = _Utils_Tuple3(state1, state2, state);
			_v0$2:
			while (true) {
				if (_v0.a.b) {
					if (_v0.b.b && _v0.c.b) {
						var _v1 = _v0.a;
						var v1 = _v1.a;
						var st1 = _v1.b;
						var _v2 = _v0.b;
						var v2 = _v2.a;
						var st2 = _v2.b;
						var _v3 = _v0.c;
						var v = _v3.a;
						var st = _v3.b;
						return A2(
							$elm$core$Result$map,
							function (res) {
								return A2(
									$elm$core$List$cons,
									A3($author$project$OOP$Objects$ThreeMerge$threeMerge, v, v1, v2),
									res);
							},
							A3($author$project$OOP$Objects$ThreeMerge$mergeState, st1, st2, st));
					} else {
						break _v0$2;
					}
				} else {
					if ((!_v0.b.b) && (!_v0.c.b)) {
						return $elm$core$Result$Ok(_List_Nil);
					} else {
						break _v0$2;
					}
				}
			}
			return $elm$core$Result$Err('Merge State Error : 02.');
		}
	});
var $author$project$OOP$Objects$H2OTranslator$objectSubst = F2(
	function (env, op) {
		switch (op.$) {
			case 'TNew':
				var _class = op.b;
				var args = op.c;
				var args_ = A2($author$project$OOP$Objects$H2OTranslator$objectSubst, env, args);
				return A2($author$project$OOP$Syntax$VNew, _class, args_);
			case 'TList':
				var t1 = op.b;
				var t2 = op.c;
				var v2 = A2($author$project$OOP$Objects$H2OTranslator$objectSubst, env, t2);
				var v1 = A2($author$project$OOP$Objects$H2OTranslator$objectSubst, env, t1);
				return A2($author$project$OOP$Syntax$VCons, v1, v2);
			case 'TEmpList':
				return $author$project$OOP$Syntax$VNil;
			case 'TVar':
				var s = op.b;
				var _v1 = A2($author$project$OOP$Utils$findByName, s, env);
				if (_v1.$ === 'Just') {
					var v = _v1.a;
					return v;
				} else {
					return $author$project$OOP$Syntax$VError('Object Substitution Error : No Such Variable.');
				}
			default:
				return $author$project$OOP$Syntax$VError('Template uses disallowed syntax : 02.');
		}
	});
var $author$project$OOP$Objects$H2OTranslator$parseToIDInfo = function (str) {
	var splitRes = A2($elm$core$String$split, '-', str);
	_v0$2:
	while (true) {
		if (splitRes.b && splitRes.b.b) {
			if (!splitRes.b.b.b) {
				var _class = splitRes.a;
				var _v1 = splitRes.b;
				var objectID = _v1.a;
				var _v2 = $elm$core$String$toInt(objectID);
				if (_v2.$ === 'Just') {
					var id = _v2.a;
					return {_class: _class, fieldID: -1, flag: 1, objectID: id};
				} else {
					return {_class: 'Object ID Error : 01.', fieldID: -1, flag: 0, objectID: -1};
				}
			} else {
				if ((splitRes.a === 'List') && (!splitRes.b.b.b.b)) {
					var _v3 = splitRes.b;
					var fieldID = _v3.a;
					var _v4 = _v3.b;
					var objectID = _v4.a;
					var _v5 = _Utils_Tuple2(
						$elm$core$String$toInt(fieldID),
						$elm$core$String$toInt(objectID));
					if ((_v5.a.$ === 'Just') && (_v5.b.$ === 'Just')) {
						var fid = _v5.a.a;
						var oid = _v5.b.a;
						return {_class: '', fieldID: fid, flag: 2, objectID: oid};
					} else {
						return {_class: 'Object ID or Field ID Error.', fieldID: -1, flag: 0, objectID: -1};
					}
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return {_class: 'Wrong ID Form : 01.', fieldID: -1, flag: 0, objectID: -1};
};
var $author$project$OOP$Objects$H2OTranslator$foldObjectList = F4(
	function (ls, dict, userDefTemps, state) {
		switch (ls.$) {
			case 'VCons':
				var v1 = ls.a;
				var v2 = ls.b;
				var res = A4($author$project$OOP$Objects$H2OTranslator$html2Object, v1, dict, userDefTemps, state);
				switch (res.a.$) {
					case 'VError':
						var _v39 = A4($author$project$OOP$Objects$H2OTranslator$foldObjectList, v2, dict, userDefTemps, state);
						var v2_ = _v39.a;
						var state2 = _v39.b;
						return _Utils_Tuple2(
							A2($author$project$OOP$Syntax$VCons, v1, v2_),
							state2);
					case 'VNew':
						var _v40 = res.a;
						var c = _v40.a;
						var args = _v40.b;
						var state_ = res.b;
						var _v41 = A4($author$project$OOP$Objects$H2OTranslator$foldObjectList, v2, dict, userDefTemps, state_);
						var v2_ = _v41.a;
						var state2 = _v41.b;
						return _Utils_Tuple2(
							A2(
								$author$project$OOP$Syntax$VCons,
								A2($author$project$OOP$Syntax$VNew, c, args),
								v2_),
							state2);
					default:
						return _Utils_Tuple2(
							$author$project$OOP$Syntax$VError('Error : 24.'),
							state);
				}
			case 'VNil':
				return _Utils_Tuple2($author$project$OOP$Syntax$VNil, state);
			default:
				return _Utils_Tuple2(
					$author$project$OOP$Syntax$VError('Error : 23.'),
					state);
		}
	});
var $author$project$OOP$Objects$H2OTranslator$html2Object = F4(
	function (html, dict, userDefTemps, ostate) {
		if (html.$ === 'VHtml') {
			var attr = html.c;
			var res = $author$project$OOP$Objects$H2OTranslator$findIDAttr(attr);
			if (res.$ === 'Just') {
				var str = res.a;
				var info = $author$project$OOP$Objects$H2OTranslator$parseToIDInfo(str);
				var _class = function () {
					var _v36 = info.flag;
					if (_v36 === 1) {
						return info._class;
					} else {
						return 'Error';
					}
				}();
				if (_class === 'Error') {
					return _Utils_Tuple2(
						$author$project$OOP$Syntax$VError('Not an Object : 06.'),
						ostate);
				} else {
					var res4 = A2($author$project$OOP$Objects$H2OTranslator$findObjectEnv, dict, info.objectID);
					var res1 = A2(
						$author$project$OOP$Objects$Templates$findTemplateByClass,
						_class,
						$author$project$OOP$Objects$Templates$parseTemplates(
							_Utils_ap($author$project$OOP$Objects$Templates$templates, userDefTemps)));
					var _v31 = _Utils_Tuple2(res1, res4);
					if ((_v31.a.$ === 'Just') && (_v31.b.$ === 'Just')) {
						var _v32 = _v31.a.a;
						var objectPattern = _v32.a;
						var htmlPattern = _v32.b;
						var oenv = _v31.b.a;
						var res2 = $author$project$OOP$Objects$H2OTranslator$delOstLayer(html);
						if (res2.$ === 'Just') {
							var html_ = res2.a;
							var res3 = A6($author$project$OOP$Objects$H2OTranslator$htmlMatch, html_, htmlPattern, oenv, dict, userDefTemps, ostate);
							if (res3.$ === 'Ok') {
								var _v35 = res3.a;
								var env = _v35.a;
								var state = _v35.b;
								return _Utils_Tuple2(
									A2($author$project$OOP$Objects$H2OTranslator$objectSubst, env, objectPattern),
									state);
							} else {
								var err = res3.a;
								return _Utils_Tuple2(
									$author$project$OOP$Syntax$VError(err),
									ostate);
							}
						} else {
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VError('Error : 23.'),
								ostate);
						}
					} else {
						return _Utils_Tuple2(
							$author$project$OOP$Syntax$VError('No Such Class or No Such Object.'),
							ostate);
					}
				}
			} else {
				return _Utils_Tuple2(
					$author$project$OOP$Syntax$VError('Not an Object : 05.'),
					ostate);
			}
		} else {
			return _Utils_Tuple2(
				$author$project$OOP$Syntax$VError('Html To Object Error : 01.'),
				ostate);
		}
	});
var $author$project$OOP$Objects$H2OTranslator$htmlMatch = F6(
	function (html, hp, oenv, dict, userDefTemps, state) {
		htmlMatch:
		while (true) {
			var _v5 = _Utils_Tuple2(html, hp);
			_v5$9:
			while (true) {
				switch (_v5.b.$) {
					case 'THtml':
						if (_v5.a.$ === 'VHtml') {
							var _v6 = _v5.a;
							var vlab = _v6.a;
							var vstyle = _v6.b;
							var vattr = _v6.c;
							var vchilds = _v6.d;
							var _v7 = _v5.b;
							var tlab = _v7.b;
							var tstyle = _v7.c;
							var tattr = _v7.d;
							var tchilds = _v7.e;
							if ((!_Utils_eq(tlab, vlab)) && (tlab !== 'objectlist')) {
								return $elm$core$Result$Err('Html Match Error : 01.');
							} else {
								if (tlab !== 'objectlist') {
									var res3 = A6($author$project$OOP$Objects$H2OTranslator$htmlMatch, vchilds, tchilds, oenv, dict, userDefTemps, state);
									var res2 = A6($author$project$OOP$Objects$H2OTranslator$htmlMatch, vattr, tattr, oenv, dict, userDefTemps, state);
									var res1 = A6($author$project$OOP$Objects$H2OTranslator$htmlMatch, vstyle, tstyle, oenv, dict, userDefTemps, state);
									var _v8 = _Utils_Tuple3(res1, res2, res3);
									if (((_v8.a.$ === 'Ok') && (_v8.b.$ === 'Ok')) && (_v8.c.$ === 'Ok')) {
										var _v9 = _v8.a.a;
										var env1 = _v9.a;
										var state1 = _v9.b;
										var _v10 = _v8.b.a;
										var env2 = _v10.a;
										var state2 = _v10.b;
										var _v11 = _v8.c.a;
										var env3 = _v11.a;
										var state3 = _v11.b;
										return A2(
											$elm$core$Result$andThen,
											function (state_) {
												return A2(
													$elm$core$Result$andThen,
													function (state__) {
														return $elm$core$Result$Ok(
															_Utils_Tuple2(
																A3(
																	$author$project$OOP$Objects$ThreeMerge$mergeEnv,
																	env3,
																	A3($author$project$OOP$Objects$ThreeMerge$mergeEnv, env2, env1, oenv),
																	oenv),
																state__));
													},
													A3($author$project$OOP$Objects$ThreeMerge$mergeState, state3, state_, state));
											},
											A3($author$project$OOP$Objects$ThreeMerge$mergeState, state2, state1, state));
									} else {
										return $elm$core$Result$Err('Html Match Error : 02.');
									}
								} else {
									var $temp$html = vchilds,
										$temp$hp = tchilds,
										$temp$oenv = oenv,
										$temp$dict = dict,
										$temp$userDefTemps = userDefTemps,
										$temp$state = state;
									html = $temp$html;
									hp = $temp$hp;
									oenv = $temp$oenv;
									dict = $temp$dict;
									userDefTemps = $temp$userDefTemps;
									state = $temp$state;
									continue htmlMatch;
								}
							}
						} else {
							break _v5$9;
						}
					case 'TVar':
						if (_v5.a.$ === 'VCons') {
							var _v12 = _v5.a;
							var _v13 = _v5.b;
							var s = _v13.b;
							var res = A4($author$project$OOP$Objects$H2OTranslator$foldObjectList, html, dict, userDefTemps, state);
							if (res.a.$ === 'VCons') {
								var _v15 = res.a;
								var v1 = _v15.a;
								var v2 = _v15.b;
								var state_ = res.b;
								return A4(
									$author$project$OOP$Objects$H2OTranslator$checkVarIsRef,
									s,
									oenv,
									state_,
									A2($author$project$OOP$Syntax$VCons, v1, v2));
							} else {
								return $elm$core$Result$Err('Html Match Error : 03.');
							}
						} else {
							var _v16 = _v5.b;
							var s = _v16.b;
							var res = A4($author$project$OOP$Objects$H2OTranslator$html2Object, html, dict, userDefTemps, state);
							switch (res.a.$) {
								case 'VError':
									return A4($author$project$OOP$Objects$H2OTranslator$checkVarIsRef, s, oenv, state, html);
								case 'VNew':
									var _v18 = res.a;
									var c = _v18.a;
									var args = _v18.b;
									var state_ = res.b;
									return A4(
										$author$project$OOP$Objects$H2OTranslator$checkVarIsRef,
										s,
										oenv,
										state_,
										A2($author$project$OOP$Syntax$VNew, c, args));
								default:
									return $elm$core$Result$Err('Html Match Error : 04.');
							}
						}
					case 'TCons':
						if (_v5.a.$ === 'VCons') {
							var _v19 = _v5.a;
							var v1 = _v19.a;
							var v2 = _v19.b;
							var _v20 = _v5.b;
							var t1 = _v20.b;
							var t2 = _v20.c;
							return A6(
								$author$project$OOP$Objects$H2OTranslator$twoMatchMerge,
								_Utils_Tuple2(v1, v2),
								_Utils_Tuple2(t1, t2),
								oenv,
								dict,
								userDefTemps,
								state);
						} else {
							break _v5$9;
						}
					case 'TList':
						if (_v5.a.$ === 'VCons') {
							var _v21 = _v5.a;
							var v1 = _v21.a;
							var v2 = _v21.b;
							var _v22 = _v5.b;
							var t1 = _v22.b;
							var t2 = _v22.c;
							return A6(
								$author$project$OOP$Objects$H2OTranslator$twoMatchMerge,
								_Utils_Tuple2(v1, v2),
								_Utils_Tuple2(t1, t2),
								oenv,
								dict,
								userDefTemps,
								state);
						} else {
							break _v5$9;
						}
					case 'TBPrim':
						if ((_v5.a.$ === 'VString') && (_v5.b.b.$ === 'Cat')) {
							var _v23 = _v5.b;
							var _v24 = _v23.b;
							return $elm$core$Result$Ok(
								_Utils_Tuple2(oenv, state));
						} else {
							break _v5$9;
						}
					case 'TString':
						if (_v5.a.$ === 'VString') {
							var s1 = _v5.a.a;
							var _v25 = _v5.b;
							var s2 = _v25.b;
							return _Utils_eq(s1, s2) ? $elm$core$Result$Ok(
								_Utils_Tuple2(oenv, state)) : $elm$core$Result$Err('Html Match Error : 06.');
						} else {
							break _v5$9;
						}
					case 'TNil':
						if (_v5.a.$ === 'VNil') {
							var _v26 = _v5.a;
							return $elm$core$Result$Ok(
								_Utils_Tuple2(oenv, state));
						} else {
							break _v5$9;
						}
					case 'TEmpList':
						if (_v5.a.$ === 'VNil') {
							var _v27 = _v5.a;
							return $elm$core$Result$Ok(
								_Utils_Tuple2(oenv, state));
						} else {
							break _v5$9;
						}
					default:
						break _v5$9;
				}
			}
			return $elm$core$Result$Err('Html Match Error : 07.');
		}
	});
var $author$project$OOP$Objects$H2OTranslator$twoMatchMerge = F6(
	function (_v0, _v1, oenv, dict, userDefTemps, state) {
		var v1 = _v0.a;
		var v2 = _v0.b;
		var t1 = _v1.a;
		var t2 = _v1.b;
		var res2 = A6($author$project$OOP$Objects$H2OTranslator$htmlMatch, v2, t2, oenv, dict, userDefTemps, state);
		var res1 = A6($author$project$OOP$Objects$H2OTranslator$htmlMatch, v1, t1, oenv, dict, userDefTemps, state);
		var _v2 = _Utils_Tuple2(res1, res2);
		if ((_v2.a.$ === 'Ok') && (_v2.b.$ === 'Ok')) {
			var _v3 = _v2.a.a;
			var env1 = _v3.a;
			var state1 = _v3.b;
			var _v4 = _v2.b.a;
			var env2 = _v4.a;
			var state2 = _v4.b;
			return A2(
				$elm$core$Result$andThen,
				function (mergedState) {
					return $elm$core$Result$Ok(
						_Utils_Tuple2(
							A3($author$project$OOP$Objects$ThreeMerge$mergeEnv, env1, env2, oenv),
							mergedState));
				},
				A3($author$project$OOP$Objects$ThreeMerge$mergeState, state1, state2, state));
		} else {
			return $elm$core$Result$Err('Html Match Error : 05.');
		}
	});
var $elm$core$String$trim = _String_trim;
var $author$project$OOP$Parser$Html$parseOtherPro = function (al) {
	parseOtherPro:
	while (true) {
		if (al.b) {
			if (al.a.a === 'contenteditable') {
				var _v1 = al.a;
				var al_ = al.b;
				var $temp$al = al_;
				al = $temp$al;
				continue parseOtherPro;
			} else {
				var _v2 = al.a;
				var name = _v2.a;
				var value = _v2.b;
				var al_ = al.b;
				var proItem = A2(
					$author$project$OOP$Syntax$VCons,
					$author$project$OOP$Syntax$VString(
						$elm$core$String$trim(name)),
					A2(
						$author$project$OOP$Syntax$VCons,
						$author$project$OOP$Syntax$VString(
							$elm$core$String$trim(value)),
						$author$project$OOP$Syntax$VNil));
				return A2(
					$author$project$OOP$Syntax$VCons,
					proItem,
					$author$project$OOP$Parser$Html$parseOtherPro(al_));
			}
		} else {
			return $author$project$OOP$Syntax$VNil;
		}
	}
};
var $author$project$OOP$Parser$Html$parseStyle = function (pro) {
	parseStyle:
	while (true) {
		if (pro.b) {
			var s = pro.a;
			var ps = pro.b;
			var nameAndValue = A2(
				$elm$core$String$split,
				':',
				$elm$core$String$trim(s));
			var proItem = function () {
				if ((nameAndValue.b && nameAndValue.b.b) && (!nameAndValue.b.b.b)) {
					var n = nameAndValue.a;
					var _v3 = nameAndValue.b;
					var val = _v3.a;
					return A2(
						$author$project$OOP$Syntax$VCons,
						$author$project$OOP$Syntax$VString(
							$elm$core$String$trim(n)),
						A2(
							$author$project$OOP$Syntax$VCons,
							$author$project$OOP$Syntax$VString(
								$elm$core$String$trim(val)),
							$author$project$OOP$Syntax$VNil));
				} else {
					return $author$project$OOP$Syntax$VError('Parse Style Error.');
				}
			}();
			if (proItem.$ === 'VError') {
				var $temp$pro = ps;
				pro = $temp$pro;
				continue parseStyle;
			} else {
				return A2(
					$author$project$OOP$Syntax$VCons,
					proItem,
					$author$project$OOP$Parser$Html$parseStyle(ps));
			}
		} else {
			return $author$project$OOP$Syntax$VNil;
		}
	}
};
var $author$project$OOP$Parser$Html$nodeToValue = function (node) {
	switch (node.$) {
		case 'Element':
			var s = node.a;
			var attrList = node.b;
			var childs = node.c;
			var vChilds = $author$project$OOP$Parser$Html$parseChilds(childs);
			if (s === 'script') {
				return A4($author$project$OOP$Syntax$VHtml, s, $author$project$OOP$Syntax$VNil, $author$project$OOP$Syntax$VNil, vChilds);
			} else {
				if (!attrList.b) {
					return A4($author$project$OOP$Syntax$VHtml, s, $author$project$OOP$Syntax$VNil, $author$project$OOP$Syntax$VNil, vChilds);
				} else {
					if (attrList.a.a === 'style') {
						if (!attrList.b.b) {
							var _v3 = attrList.a;
							var pro = _v3.b;
							return A4(
								$author$project$OOP$Syntax$VHtml,
								s,
								$author$project$OOP$Parser$Html$parseStyle(
									A2($elm$core$String$split, ';', pro)),
								$author$project$OOP$Syntax$VNil,
								vChilds);
						} else {
							var _v4 = attrList.a;
							var pro = _v4.b;
							var al = attrList.b;
							return A4(
								$author$project$OOP$Syntax$VHtml,
								s,
								$author$project$OOP$Parser$Html$parseStyle(
									A2($elm$core$String$split, ';', pro)),
								$author$project$OOP$Parser$Html$parseOtherPro(al),
								vChilds);
						}
					} else {
						var al = attrList;
						return A4(
							$author$project$OOP$Syntax$VHtml,
							s,
							$author$project$OOP$Syntax$VNil,
							$author$project$OOP$Parser$Html$parseOtherPro(al),
							vChilds);
					}
				}
			}
		case 'Text':
			var s = node.a;
			return $author$project$OOP$Syntax$VString(s);
		default:
			return $author$project$OOP$Syntax$VError('An error occurred in the node constructor.');
	}
};
var $author$project$OOP$Parser$Html$parseChilds = function (childs) {
	if (!childs.b) {
		return $author$project$OOP$Syntax$VNil;
	} else {
		var c = childs.a;
		var cds = childs.b;
		return A2(
			$author$project$OOP$Syntax$VCons,
			$author$project$OOP$Parser$Html$nodeToValue(c),
			$author$project$OOP$Parser$Html$parseChilds(cds));
	}
};
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
var $author$project$OOP$Parser$Html$parseHtml = function (s) {
	var parseRes = $hecrj$html_parser$Html$Parser$run(s);
	if (parseRes.$ === 'Ok') {
		var res = parseRes.a;
		if (res.b && (!res.b.b)) {
			var node = res.a;
			return $elm$core$Result$Ok(
				$author$project$OOP$Parser$Html$nodeToValue(node));
		} else {
			return $elm$core$Result$Err('There can only be 1 node here.');
		}
	} else {
		var info = parseRes.a;
		return $elm$core$Result$Err(
			$elm$core$Debug$toString(info));
	}
};
var $author$project$OOP$Printer$ClassTable$printFields = function (fields) {
	_v0$3:
	while (true) {
		if (fields.b) {
			if ((fields.a.a.b && fields.a.a.b.b) && fields.a.a.b.b.b) {
				if (!fields.a.a.b.b.b.b) {
					var _v1 = fields.a;
					var _v2 = _v1.a;
					var spc1 = _v2.a;
					var _v3 = _v2.b;
					var spc2 = _v3.a;
					var _v4 = _v3.b;
					var spc3 = _v4.a;
					var f = _v1.b;
					var typ = _v1.c;
					var fs = fields.b;
					return f + (spc1 + (':' + (spc2 + (typ + (spc3 + $author$project$OOP$Printer$ClassTable$printFields(fs))))));
				} else {
					if (!fields.a.a.b.b.b.b.b) {
						var _v5 = fields.a;
						var _v6 = _v5.a;
						var spc1 = _v6.a;
						var _v7 = _v6.b;
						var spc2 = _v7.a;
						var _v8 = _v7.b;
						var spc3 = _v8.a;
						var _v9 = _v8.b;
						var spc4 = _v9.a;
						var f = _v5.b;
						var typ = _v5.c;
						var fs = fields.b;
						return ',' + (spc1 + (f + (spc2 + (':' + (spc3 + (typ + (spc4 + $author$project$OOP$Printer$ClassTable$printFields(fs))))))));
					} else {
						break _v0$3;
					}
				}
			} else {
				break _v0$3;
			}
		} else {
			return '';
		}
	}
	return 'Error : 11.';
};
var $author$project$OOP$Printer$Pattern$printPattern = function (p) {
	_v0$16:
	while (true) {
		switch (p.$) {
			case 'PVar':
				if (p.a.b && (!p.a.b.b)) {
					var _v1 = p.a;
					var spc = _v1.a;
					var s = p.b;
					return _Utils_ap(s, spc);
				} else {
					break _v0$16;
				}
			case 'PCons':
				var ws = p.a;
				var p1 = p.b;
				var p2 = p.c;
				if (ws.b && (!ws.b.b)) {
					var spc = ws.a;
					return $author$project$OOP$Printer$Pattern$printPattern(p1) + ('::' + (spc + $author$project$OOP$Printer$Pattern$printPattern(p2)));
				} else {
					return 'White Spaces Error : 03.';
				}
			case 'PCons1':
				var ws = p.a;
				var p1 = p.b;
				var p2 = p.c;
				if (ws.b && (!ws.b.b)) {
					var spc = ws.a;
					return $author$project$OOP$Printer$Pattern$printPattern(p1) + (':' + (spc + $author$project$OOP$Printer$Pattern$printPattern(p2)));
				} else {
					return 'White Spaces Error : 100.';
				}
			case 'PNil':
				if (p.a.b && (!p.a.b.b)) {
					var _v4 = p.a;
					var spc = _v4.a;
					return 'nil' + spc;
				} else {
					break _v0$16;
				}
			case 'PList':
				var ws = p.a;
				var p1 = p.b;
				var p2 = p.c;
				_v5$2:
				while (true) {
					if (ws.b) {
						if (ws.b.b) {
							if (!ws.b.b.b) {
								var spc1 = ws.a;
								var _v6 = ws.b;
								var spc2 = _v6.a;
								return '[' + (spc1 + ($author$project$OOP$Printer$Pattern$printPattern(p1) + ($author$project$OOP$Printer$Pattern$printPattern(p2) + (']' + spc2))));
							} else {
								break _v5$2;
							}
						} else {
							var spc = ws.a;
							return ',' + (spc + ($author$project$OOP$Printer$Pattern$printPattern(p1) + $author$project$OOP$Printer$Pattern$printPattern(p2)));
						}
					} else {
						break _v5$2;
					}
				}
				return 'White Spaces Error : 04.';
			case 'PEmpList':
				if (p.a.b) {
					if (p.a.b.b && (!p.a.b.b.b)) {
						var _v7 = p.a;
						var spc1 = _v7.a;
						var _v8 = _v7.b;
						var spc2 = _v8.a;
						return '[' + (spc1 + (']' + spc2));
					} else {
						break _v0$16;
					}
				} else {
					return '';
				}
			case 'PInt':
				if (p.a.b && (!p.a.b.b)) {
					var _v9 = p.a;
					var spc = _v9.a;
					var n = p.b;
					return _Utils_ap(
						$elm$core$Debug$toString(n),
						spc);
				} else {
					break _v0$16;
				}
			case 'PFloat':
				if (p.a.b && (!p.a.b.b)) {
					var _v10 = p.a;
					var spc = _v10.a;
					var n = p.b;
					return _Utils_ap(
						$elm$core$Debug$toString(n),
						spc);
				} else {
					break _v0$16;
				}
			case 'PTrue':
				if (p.a.b && (!p.a.b.b)) {
					var _v11 = p.a;
					var spc = _v11.a;
					return 'true' + spc;
				} else {
					break _v0$16;
				}
			case 'PFalse':
				if (p.a.b && (!p.a.b.b)) {
					var _v12 = p.a;
					var spc = _v12.a;
					return 'false' + spc;
				} else {
					break _v0$16;
				}
			case 'PChar':
				if (p.a.b && (!p.a.b.b)) {
					var _v13 = p.a;
					var spc = _v13.a;
					var c = p.b;
					return '\'' + ($elm$core$String$fromChar(c) + ('\'' + spc));
				} else {
					break _v0$16;
				}
			case 'PString':
				if (p.a.b && (!p.a.b.b)) {
					var _v14 = p.a;
					var spc = _v14.a;
					var s = p.b;
					return '\"' + (s + ('\"' + spc));
				} else {
					break _v0$16;
				}
			case 'PBTuple':
				if (((p.a.b && p.a.b.b) && p.a.b.b.b) && (!p.a.b.b.b.b)) {
					var _v15 = p.a;
					var spc1 = _v15.a;
					var _v16 = _v15.b;
					var spc2 = _v16.a;
					var _v17 = _v16.b;
					var spc3 = _v17.a;
					var t1 = p.b;
					var t2 = p.c;
					return '(' + (spc1 + ($author$project$OOP$Printer$Pattern$printPattern(t1) + (',' + (spc2 + ($author$project$OOP$Printer$Pattern$printPattern(t2) + (')' + spc3))))));
				} else {
					break _v0$16;
				}
			case 'PTTuple':
				if ((((p.a.b && p.a.b.b) && p.a.b.b.b) && p.a.b.b.b.b) && (!p.a.b.b.b.b.b)) {
					var _v18 = p.a;
					var spc1 = _v18.a;
					var _v19 = _v18.b;
					var spc2 = _v19.a;
					var _v20 = _v19.b;
					var spc3 = _v20.a;
					var _v21 = _v20.b;
					var spc4 = _v21.a;
					var t1 = p.b;
					var t2 = p.c;
					var t3 = p.d;
					return '(' + (spc1 + ($author$project$OOP$Printer$Pattern$printPattern(t1) + (',' + (spc2 + ($author$project$OOP$Printer$Pattern$printPattern(t2) + (',' + (spc3 + ($author$project$OOP$Printer$Pattern$printPattern(t3) + (')' + spc4)))))))));
				} else {
					break _v0$16;
				}
			case 'PUnit':
				if (p.a.b && (!p.a.b.b)) {
					var _v22 = p.a;
					var spc = _v22.a;
					return 'unit' + spc;
				} else {
					break _v0$16;
				}
			default:
				break _v0$16;
		}
	}
	return 'Cannot Print : ' + $elm$core$Debug$toString(p);
};
var $author$project$OOP$Printer$Term$printParamList = function (pls) {
	if (!pls.b) {
		return '';
	} else {
		var p = pls.a;
		var pls_ = pls.b;
		return _Utils_ap(
			$author$project$OOP$Printer$Pattern$printPattern(p),
			$author$project$OOP$Printer$Term$printParamList(pls_));
	}
};
var $author$project$OOP$LangUtils$splitFuncDef = F2(
	function (params, t) {
		splitFuncDef:
		while (true) {
			if ((t.$ === 'TLam') && (!t.a.b)) {
				var p = t.b;
				var t_ = t.c;
				var $temp$params = A2($elm$core$List$cons, p, params),
					$temp$t = t_;
				params = $temp$params;
				t = $temp$t;
				continue splitFuncDef;
			} else {
				return _Utils_Tuple2(
					$elm$core$List$reverse(params),
					t);
			}
		}
	});
var $author$project$OOP$Printer$Term$printBranch = function (b) {
	_v72$2:
	while (true) {
		switch (b.$) {
			case 'BNSin':
				if (b.a.b && (!b.a.b.b)) {
					var _v73 = b.a;
					var spc = _v73.a;
					var p = b.c;
					var t = b.d;
					return $author$project$OOP$Printer$Pattern$printPattern(p) + ('=>' + (spc + $author$project$OOP$Printer$Term$printTerm(t)));
				} else {
					break _v72$2;
				}
			case 'BCom':
				if (b.a.b && (!b.a.b.b)) {
					var _v74 = b.a;
					var spc = _v74.a;
					var b1 = b.b;
					var b2 = b.c;
					return $author$project$OOP$Printer$Term$printBranch(b1) + ('|' + (spc + $author$project$OOP$Printer$Term$printBranch(b2)));
				} else {
					break _v72$2;
				}
			default:
				break _v72$2;
		}
	}
	return 'Print Branch Error : 01.';
};
var $author$project$OOP$Printer$Term$printList = function (ls) {
	switch (ls.$) {
		case 'TEmpList':
			return '';
		case 'TList':
			if (ls.a.b && (!ls.a.b.b)) {
				var _v71 = ls.a;
				var spc = _v71.a;
				var t1 = ls.b;
				var t2 = ls.c;
				return ',' + (spc + ($author$project$OOP$Printer$Term$printTerm(t1) + $author$project$OOP$Printer$Term$printList(t2)));
			} else {
				var t1 = ls.b;
				var t2 = ls.c;
				return ', ' + ($author$project$OOP$Printer$Term$printTerm(t1) + $author$project$OOP$Printer$Term$printList(t2));
			}
		default:
			return 'Error : 08.';
	}
};
var $author$project$OOP$Printer$Term$printTerm = function (term) {
	_v0$32:
	while (true) {
		switch (term.$) {
			case 'TInt':
				if (term.a.b && (!term.a.b.b)) {
					var _v1 = term.a;
					var spc = _v1.a;
					var n = term.b;
					return _Utils_ap(
						$elm$core$Debug$toString(n),
						spc);
				} else {
					break _v0$32;
				}
			case 'TFloat':
				if (term.a.b && (!term.a.b.b)) {
					var _v2 = term.a;
					var spc = _v2.a;
					var n = term.b;
					return _Utils_ap(
						$elm$core$Debug$toString(n),
						spc);
				} else {
					break _v0$32;
				}
			case 'TTrue':
				if (term.a.b && (!term.a.b.b)) {
					var _v3 = term.a;
					var spc = _v3.a;
					return 'true' + spc;
				} else {
					break _v0$32;
				}
			case 'TFalse':
				if (term.a.b && (!term.a.b.b)) {
					var _v4 = term.a;
					var spc = _v4.a;
					return 'false' + spc;
				} else {
					break _v0$32;
				}
			case 'TChar':
				if (term.a.b && (!term.a.b.b)) {
					var _v5 = term.a;
					var spc = _v5.a;
					var c = term.b;
					return '\'' + ($elm$core$String$fromChar(c) + ('\'' + spc));
				} else {
					break _v0$32;
				}
			case 'TString':
				if (term.a.b && (!term.a.b.b)) {
					var _v6 = term.a;
					var spc = _v6.a;
					var s = term.b;
					return '\"' + (s + ('\"' + spc));
				} else {
					break _v0$32;
				}
			case 'TVar':
				var ws = term.a;
				var s = term.b;
				if (!ws.b) {
					return (s === 'main') ? '' : 'Print Var Error : 01.';
				} else {
					if (!ws.b.b) {
						var spc = ws.a;
						return _Utils_ap(s, spc);
					} else {
						return 'Print Var Error : 02.';
					}
				}
			case 'TLam':
				if ((term.a.b && term.a.b.b) && (!term.a.b.b.b)) {
					var _v8 = term.a;
					var spc1 = _v8.a;
					var _v9 = _v8.b;
					var spc2 = _v9.a;
					var p = term.b;
					var t = term.c;
					return '\\' + (spc1 + ($author$project$OOP$Printer$Pattern$printPattern(p) + ('=>' + (spc2 + $author$project$OOP$Printer$Term$printTerm(t)))));
				} else {
					break _v0$32;
				}
			case 'TApp':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				_v10$3:
				while (true) {
					if (ws.b) {
						if (ws.b.b) {
							if (!ws.b.b.b) {
								var spc1 = ws.a;
								var _v11 = ws.b;
								var spc2 = _v11.a;
								if ((((((((((t1.$ === 'TLam') && (!t1.a.b)) && (t1.b.$ === 'PVar')) && (!t1.b.a.b)) && (t1.b.b === '$CASE$')) && (t1.c.$ === 'TCase')) && (!t1.c.a.b)) && (t1.c.b.$ === 'TVar')) && (!t1.c.b.a.b)) && (t1.c.b.b === '$CASE$')) {
									var _v13 = t1.b;
									var _v14 = t1.c;
									var _v15 = _v14.b;
									var b = _v14.c;
									return 'case' + (spc1 + ($author$project$OOP$Printer$Term$printTerm(t2) + ('of' + (spc2 + $author$project$OOP$Printer$Term$printBranch(b)))));
								} else {
									return 'Print Term Error : 02.';
								}
							} else {
								if (!ws.b.b.b.b) {
									var spc1 = ws.a;
									var _v16 = ws.b;
									var spc2 = _v16.a;
									var _v17 = _v16.b;
									var spc3 = _v17.a;
									if ((((((((((((((((((((t1.$ === 'TLam') && (!t1.a.b)) && (t1.b.$ === 'PVar')) && (!t1.b.a.b)) && (t1.b.b === '$CASE$')) && (t1.c.$ === 'TCase')) && (!t1.c.a.b)) && (t1.c.b.$ === 'TVar')) && (!t1.c.b.a.b)) && (t1.c.b.b === '$CASE$')) && (t1.c.c.$ === 'BCom')) && (!t1.c.c.a.b)) && (t1.c.c.b.$ === 'BNSin')) && (!t1.c.c.b.a.b)) && (t1.c.c.b.c.$ === 'PTrue')) && (!t1.c.c.b.c.a.b)) && (t1.c.c.c.$ === 'BNSin')) && (!t1.c.c.c.a.b)) && (t1.c.c.c.c.$ === 'PFalse')) && (!t1.c.c.c.c.a.b)) {
										var _v19 = t1.b;
										var _v20 = t1.c;
										var _v21 = _v20.b;
										var _v22 = _v20.c;
										var _v23 = _v22.b;
										var t3 = _v23.d;
										var _v24 = _v22.c;
										var t4 = _v24.d;
										return 'if' + (spc1 + ($author$project$OOP$Printer$Term$printTerm(t2) + ('then' + (spc2 + ($author$project$OOP$Printer$Term$printTerm(t3) + ('else' + (spc3 + $author$project$OOP$Printer$Term$printTerm(t4))))))));
									} else {
										return 'Print Term Error : 03.';
									}
								} else {
									break _v10$3;
								}
							}
						} else {
							break _v10$3;
						}
					} else {
						return _Utils_ap(
							$author$project$OOP$Printer$Term$printTerm(t1),
							$author$project$OOP$Printer$Term$printTerm(t2));
					}
				}
				return 'White Spaces Error : 01.';
			case 'TLet':
				var ws = term.a;
				var p = term.b;
				var t1 = term.c;
				var t2 = term.d;
				_v25$2:
				while (true) {
					if (ws.b && ws.b.b) {
						if (ws.b.b.b) {
							if (!ws.b.b.b.b) {
								var spc1 = ws.a;
								var _v26 = ws.b;
								var spc2 = _v26.a;
								var _v27 = _v26.b;
								var spc3 = _v27.a;
								return 'let' + (spc1 + ($author$project$OOP$Printer$Pattern$printPattern(p) + ('=' + (spc2 + ($author$project$OOP$Printer$Term$printTerm(t1) + ('in' + (spc3 + $author$project$OOP$Printer$Term$printTerm(t2))))))));
							} else {
								break _v25$2;
							}
						} else {
							var spc1 = ws.a;
							var _v28 = ws.b;
							var spc2 = _v28.a;
							var _v29 = A2($author$project$OOP$LangUtils$splitFuncDef, _List_Nil, t1);
							var paramList = _v29.a;
							var tFunc = _v29.b;
							return $author$project$OOP$Printer$Pattern$printPattern(p) + ($author$project$OOP$Printer$Term$printParamList(paramList) + ('=' + (spc1 + ($author$project$OOP$Printer$Term$printTerm(tFunc) + (';;' + (spc2 + $author$project$OOP$Printer$Term$printTerm(t2)))))));
						}
					} else {
						break _v25$2;
					}
				}
				return 'White Spaces Error : 03.';
			case 'TLetrec':
				if (((term.a.b && term.a.b.b) && term.a.b.b.b) && (!term.a.b.b.b.b)) {
					var _v30 = term.a;
					var spc1 = _v30.a;
					var _v31 = _v30.b;
					var spc2 = _v31.a;
					var _v32 = _v31.b;
					var spc3 = _v32.a;
					var p = term.b;
					var t1 = term.c;
					var t2 = term.d;
					return 'letrec' + (spc1 + ($author$project$OOP$Printer$Pattern$printPattern(p) + ('=' + (spc2 + ($author$project$OOP$Printer$Term$printTerm(t1) + ('in' + (spc3 + $author$project$OOP$Printer$Term$printTerm(t2))))))));
				} else {
					break _v0$32;
				}
			case 'TCons':
				if (term.a.b && (!term.a.b.b)) {
					var _v33 = term.a;
					var spc = _v33.a;
					var t1 = term.b;
					var t2 = term.c;
					return $author$project$OOP$Printer$Term$printTerm(t1) + ('::' + (spc + $author$project$OOP$Printer$Term$printTerm(t2)));
				} else {
					break _v0$32;
				}
			case 'TList':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				if ((ws.b && ws.b.b) && (!ws.b.b.b)) {
					var spc1 = ws.a;
					var _v35 = ws.b;
					var spc2 = _v35.a;
					return '[' + (spc1 + ($author$project$OOP$Printer$Term$printTerm(t1) + ($author$project$OOP$Printer$Term$printList(t2) + (']' + spc2))));
				} else {
					return 'White Spaces Error : 02.';
				}
			case 'TEmpList':
				if ((term.a.b && term.a.b.b) && (!term.a.b.b.b)) {
					var _v36 = term.a;
					var spc1 = _v36.a;
					var _v37 = _v36.b;
					var spc2 = _v37.a;
					return '[' + (spc1 + (']' + spc2));
				} else {
					break _v0$32;
				}
			case 'TNil':
				if (term.a.b && (!term.a.b.b)) {
					var _v38 = term.a;
					var spc = _v38.a;
					return 'nil' + spc;
				} else {
					break _v0$32;
				}
			case 'TTuple2':
				if (((term.a.b && term.a.b.b) && term.a.b.b.b) && (!term.a.b.b.b.b)) {
					var _v39 = term.a;
					var spc1 = _v39.a;
					var _v40 = _v39.b;
					var spc2 = _v40.a;
					var _v41 = _v40.b;
					var spc3 = _v41.a;
					var t1 = term.b;
					var t2 = term.c;
					return '(' + (spc1 + ($author$project$OOP$Printer$Term$printTerm(t1) + (',' + (spc2 + ($author$project$OOP$Printer$Term$printTerm(t2) + (')' + spc3))))));
				} else {
					break _v0$32;
				}
			case 'TTuple3':
				if ((((term.a.b && term.a.b.b) && term.a.b.b.b) && term.a.b.b.b.b) && (!term.a.b.b.b.b.b)) {
					var _v42 = term.a;
					var spc1 = _v42.a;
					var _v43 = _v42.b;
					var spc2 = _v43.a;
					var _v44 = _v43.b;
					var spc3 = _v44.a;
					var _v45 = _v44.b;
					var spc4 = _v45.a;
					var t1 = term.b;
					var t2 = term.c;
					var t3 = term.d;
					return '(' + (spc1 + ($author$project$OOP$Printer$Term$printTerm(t1) + (',' + (spc2 + ($author$project$OOP$Printer$Term$printTerm(t2) + (',' + (spc3 + ($author$project$OOP$Printer$Term$printTerm(t3) + (')' + spc4)))))))));
				} else {
					break _v0$32;
				}
			case 'TBPrim':
				if (term.a.b && (!term.a.b.b)) {
					var _v46 = term.a;
					var spc = _v46.a;
					var op = term.b;
					var t1 = term.c;
					var t2 = term.d;
					var sop = function () {
						switch (op.$) {
							case 'Add':
								return '+';
							case 'Sub':
								return '-';
							case 'Mul':
								return '*';
							case 'Div':
								return '/';
							case 'RDiv':
								return '//';
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
					return _Utils_ap(
						$author$project$OOP$Printer$Term$printTerm(t1),
						_Utils_ap(
							sop,
							_Utils_ap(
								spc,
								$author$project$OOP$Printer$Term$printTerm(t2))));
				} else {
					break _v0$32;
				}
			case 'TUPrim':
				if (term.a.b && (!term.a.b.b)) {
					var _v48 = term.a;
					var spc = _v48.a;
					var op = term.b;
					var t = term.c;
					var sop = function () {
						if (op.$ === 'Neg') {
							return '-';
						} else {
							return '~';
						}
					}();
					return _Utils_ap(
						sop,
						_Utils_ap(
							spc,
							$author$project$OOP$Printer$Term$printTerm(t)));
				} else {
					break _v0$32;
				}
			case 'TParens':
				if ((term.a.b && term.a.b.b) && (!term.a.b.b.b)) {
					var _v50 = term.a;
					var spc1 = _v50.a;
					var _v51 = _v50.b;
					var spc2 = _v51.a;
					var t = term.b;
					return '(' + (spc1 + ($author$project$OOP$Printer$Term$printTerm(t) + (')' + spc2)));
				} else {
					break _v0$32;
				}
			case 'TRef':
				if (term.a.b && (!term.a.b.b)) {
					var _v52 = term.a;
					var spc = _v52.a;
					var t = term.b;
					return 'ref' + (spc + $author$project$OOP$Printer$Term$printTerm(t));
				} else {
					break _v0$32;
				}
			case 'TDeRef':
				if (term.a.b && (!term.a.b.b)) {
					var _v53 = term.a;
					var spc = _v53.a;
					var t = term.b;
					return '!' + (spc + $author$project$OOP$Printer$Term$printTerm(t));
				} else {
					break _v0$32;
				}
			case 'TAssign':
				if (term.a.b && (!term.a.b.b)) {
					var _v54 = term.a;
					var spc = _v54.a;
					var t1 = term.b;
					var t2 = term.c;
					return $author$project$OOP$Printer$Term$printTerm(t1) + (':=' + (spc + $author$project$OOP$Printer$Term$printTerm(t2)));
				} else {
					break _v0$32;
				}
			case 'TUnit':
				if (term.a.b && (!term.a.b.b)) {
					var _v55 = term.a;
					var spc = _v55.a;
					return 'unit' + spc;
				} else {
					break _v0$32;
				}
			case 'TField':
				if ((!term.a.b) && (term.c.$ === 'TVar')) {
					var t = term.b;
					var _v56 = term.c;
					var f = _v56.b;
					return $author$project$OOP$Printer$Term$printTerm(t) + ('.' + f);
				} else {
					break _v0$32;
				}
			case 'TInvk':
				if ((!term.a.b) && (term.c.$ === 'TVar')) {
					var t = term.b;
					var _v57 = term.c;
					var m = _v57.b;
					return $author$project$OOP$Printer$Term$printTerm(t) + ('->' + m);
				} else {
					break _v0$32;
				}
			case 'TNew':
				if (((term.a.b && term.a.b.b) && term.a.b.b.b) && (!term.a.b.b.b.b)) {
					var _v58 = term.a;
					var spc1 = _v58.a;
					var _v59 = _v58.b;
					var spc2 = _v59.a;
					var _v60 = _v59.b;
					var spc3 = _v60.a;
					var cl = term.b;
					var args = term.c;
					return 'new' + (spc1 + (cl + ('(' + (spc2 + ($author$project$OOP$Printer$Term$printTerm(args) + (')' + spc3))))));
				} else {
					break _v0$32;
				}
			case 'TSeq':
				if (term.a.b && (!term.a.b.b)) {
					var _v61 = term.a;
					var spc = _v61.a;
					var t1 = term.b;
					var t2 = term.c;
					return $author$project$OOP$Printer$Term$printTerm(t1) + (';' + (spc + $author$project$OOP$Printer$Term$printTerm(t2)));
				} else {
					break _v0$32;
				}
			case 'THtml':
				if (((term.a.b && term.a.b.b) && term.a.b.b.b) && (!term.a.b.b.b.b)) {
					var _v62 = term.a;
					var spc1 = _v62.a;
					var _v63 = _v62.b;
					var spc2 = _v63.a;
					var _v64 = _v63.b;
					var spc3 = _v64.a;
					var s = term.b;
					var t1 = term.c;
					var t2 = term.d;
					var t3 = term.e;
					return 'Html.' + (s + (spc1 + ($author$project$OOP$Printer$Term$printTerm(t1) + (spc2 + ($author$project$OOP$Printer$Term$printTerm(t2) + (spc3 + $author$project$OOP$Printer$Term$printTerm(t3)))))));
				} else {
					break _v0$32;
				}
			case 'TToStr':
				if (term.a.b && (!term.a.b.b)) {
					var _v65 = term.a;
					var spc = _v65.a;
					var t = term.b;
					return 'toString' + (spc + $author$project$OOP$Printer$Term$printTerm(t));
				} else {
					break _v0$32;
				}
			case 'TMap':
				if (((term.a.b && term.a.b.b) && term.a.b.b.b) && (!term.a.b.b.b.b)) {
					var _v66 = term.a;
					var spc1 = _v66.a;
					var _v67 = _v66.b;
					var spc2 = _v67.a;
					var _v68 = _v67.b;
					var spc3 = _v68.a;
					var d = term.b;
					var f = term.c;
					var ls = term.d;
					return 'map_' + (spc1 + ($author$project$OOP$Printer$Term$printTerm(d) + (spc2 + ($author$project$OOP$Printer$Term$printTerm(f) + (spc3 + $author$project$OOP$Printer$Term$printTerm(ls))))));
				} else {
					break _v0$32;
				}
			case 'TLoc':
				if (term.a.b && (!term.a.b.b)) {
					var _v69 = term.a;
					var spc = _v69.a;
					var n = term.b;
					return '<' + ($elm$core$Debug$toString(n) + ('>' + spc));
				} else {
					break _v0$32;
				}
			default:
				break _v0$32;
		}
	}
	return 'Cannot Print : ' + $elm$core$Debug$toString(term);
};
var $author$project$OOP$Printer$ClassTable$printMethods = function (methods) {
	_v0$3:
	while (true) {
		if (methods.b) {
			if (methods.a.a.b) {
				if (methods.a.a.a === 'Lift') {
					var _v1 = methods.a;
					var _v2 = _v1.a;
					var _v3 = _v1.b;
					var m = _v3.a;
					var p = _v3.b;
					var t = _v3.c;
					var methods_ = methods.b;
					return m + ('(' + ($author$project$OOP$Printer$Pattern$printPattern(p) + (') { ' + ($author$project$OOP$Printer$Term$printTerm(t) + (' };\n' + $author$project$OOP$Printer$ClassTable$printMethods(methods_))))));
				} else {
					if (((methods.a.a.b.b && methods.a.a.b.b.b) && methods.a.a.b.b.b.b) && (!methods.a.a.b.b.b.b.b)) {
						var _v4 = methods.a;
						var _v5 = _v4.a;
						var spc1 = _v5.a;
						var _v6 = _v5.b;
						var spc2 = _v6.a;
						var _v7 = _v6.b;
						var spc3 = _v7.a;
						var _v8 = _v7.b;
						var spc4 = _v8.a;
						var _v9 = _v4.b;
						var m = _v9.a;
						var p = _v9.b;
						var t = _v9.c;
						var methods_ = methods.b;
						return m + ('(' + ($author$project$OOP$Printer$Pattern$printPattern(p) + (')' + (spc1 + ('{' + (spc2 + ($author$project$OOP$Printer$Term$printTerm(t) + ('}' + (spc3 + (';' + (spc4 + $author$project$OOP$Printer$ClassTable$printMethods(methods_))))))))))));
					} else {
						break _v0$3;
					}
				}
			} else {
				break _v0$3;
			}
		} else {
			return '';
		}
	}
	return 'Error : 12.';
};
var $author$project$OOP$Printer$ClassTable$printClassDef = function (classDef) {
	_v0$3:
	while (true) {
		if (classDef.a.b) {
			if (classDef.a.b.b) {
				if ((((classDef.a.b.b.b && classDef.a.b.b.b.b) && classDef.a.b.b.b.b.b) && classDef.a.b.b.b.b.b.b) && (!classDef.a.b.b.b.b.b.b.b)) {
					var _v1 = classDef.a;
					var spc1 = _v1.a;
					var _v2 = _v1.b;
					var spc2 = _v2.a;
					var _v3 = _v2.b;
					var spc3 = _v3.a;
					var _v4 = _v3.b;
					var spc4 = _v4.a;
					var _v5 = _v4.b;
					var spc5 = _v5.a;
					var _v6 = _v5.b;
					var spc6 = _v6.a;
					var _v7 = classDef.b;
					var _v8 = _v7.a;
					var self = _v8.a;
					var father = _v8.b;
					var fs = _v7.b;
					var ms = _v7.c;
					var _v9 = _Utils_Tuple2(fs, ms);
					_v9$2:
					while (true) {
						if (_v9.a.a.b) {
							if ((!_v9.a.a.b.b) && (!_v9.b.a.b)) {
								var _v10 = _v9.a;
								var _v11 = _v10.a;
								var spc7 = _v11.a;
								var fs_ = _v10.b;
								var _v12 = _v9.b;
								var ms_ = _v12.b;
								return 'Class' + (spc1 + (self + (spc2 + ('Extends' + (spc3 + (father + (spc4 + ('{' + (spc5 + ($author$project$OOP$Printer$ClassTable$printFields(fs_) + (';' + (spc7 + ($author$project$OOP$Printer$ClassTable$printMethods(ms_) + ('}' + spc6))))))))))))));
							} else {
								break _v9$2;
							}
						} else {
							if ((!_v9.a.b.b) && (!_v9.b.a.b)) {
								var _v13 = _v9.a;
								var _v14 = _v9.b;
								var ms_ = _v14.b;
								return 'Class' + (spc1 + (self + (spc2 + ('Extends' + (spc3 + (father + (spc4 + ('{' + (spc5 + ($author$project$OOP$Printer$ClassTable$printMethods(ms_) + ('}' + spc6)))))))))));
							} else {
								break _v9$2;
							}
						}
					}
					return 'Error : 09.';
				} else {
					break _v0$3;
				}
			} else {
				if (!classDef.b.c.a.b) {
					switch (classDef.a.a) {
						case 'S':
							var _v15 = classDef.a;
							var _v16 = classDef.b;
							var _v17 = _v16.a;
							var self = _v17.a;
							var father = _v17.b;
							var _v18 = _v16.c;
							var ms = _v18.b;
							return 'Class' + (' ' + (self + (' ' + ('Extends ' + (father + (' {\n' + ($author$project$OOP$Printer$ClassTable$printMethods(ms) + '}\n')))))));
						case 'Del':
							if (((((classDef.b.a.a === '') && (classDef.b.a.b === '')) && (!classDef.b.b.a.b)) && (!classDef.b.b.b.b)) && (!classDef.b.c.b.b)) {
								var _v19 = classDef.a;
								var _v20 = classDef.b;
								var _v21 = _v20.a;
								var _v22 = _v20.b;
								var _v23 = _v20.c;
								return '';
							} else {
								break _v0$3;
							}
						default:
							break _v0$3;
					}
				} else {
					break _v0$3;
				}
			}
		} else {
			break _v0$3;
		}
	}
	return 'Error : 10.';
};
var $author$project$OOP$Printer$ClassTable$printClassDefList = function (classDefList) {
	if (classDefList.b) {
		var classDef = classDefList.a;
		var classDefList_ = classDefList.b;
		return _Utils_ap(
			$author$project$OOP$Printer$ClassTable$printClassDef(classDef),
			$author$project$OOP$Printer$ClassTable$printClassDefList(classDefList_));
	} else {
		return '';
	}
};
var $author$project$OOP$Printer$ClassTable$printClassTable = function (classTable) {
	if (classTable.a.b) {
		if (!classTable.a.b.b) {
			var _v1 = classTable.a;
			var spc = _v1.a;
			var classDefList = classTable.b;
			return _Utils_ap(
				$author$project$OOP$Printer$ClassTable$printClassDefList(classDefList),
				spc);
		} else {
			return 'Error : 13.';
		}
	} else {
		return '';
	}
};
var $author$project$OOP$Syntax$Delete = {$: 'Delete'};
var $author$project$OOP$Syntax$Keep = function (a) {
	return {$: 'Keep', a: a};
};
var $author$project$OOP$Syntax$Insert = function (a) {
	return {$: 'Insert', a: a};
};
var $author$project$OOP$Syntax$Update = function (a) {
	return {$: 'Update', a: a};
};
var $author$project$OOP$LangUtils$compareSubSeq = F4(
	function (v, _v0, _v1, _v2) {
		var n1 = _v0.a;
		var ls1 = _v0.b;
		var n2 = _v1.a;
		var ls2 = _v1.b;
		var n3 = _v2.a;
		var ls3 = _v2.b;
		return ((_Utils_cmp(n1, n2) < 1) && (_Utils_cmp(n1, n3) < 1)) ? _Utils_Tuple2(
			n1 + 1,
			A2(
				$elm$core$List$cons,
				$author$project$OOP$Syntax$Update(v),
				ls1)) : ((_Utils_cmp(n2, n3) < 1) ? _Utils_Tuple2(
			n2 + 1,
			A2(
				$elm$core$List$cons,
				$author$project$OOP$Syntax$Insert(v),
				ls2)) : _Utils_Tuple2(
			n3 + 1,
			A2($elm$core$List$cons, $author$project$OOP$Syntax$Delete, ls3)));
	});
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$OOP$LangUtils$turnToInsert = function (v) {
	switch (v.$) {
		case 'VNil':
			return _List_Nil;
		case 'VCons':
			var v1 = v.a;
			var v2 = v.b;
			return A2(
				$elm$core$List$cons,
				$author$project$OOP$Syntax$Insert(v1),
				$author$project$OOP$LangUtils$turnToInsert(v2));
		default:
			return _List_Nil;
	}
};
var $author$project$OOP$LangUtils$diff = F2(
	function (v1, v2) {
		switch (v1.$) {
			case 'VNil':
				return _Utils_Tuple2(
					$author$project$OOP$LangUtils$vlength(v2),
					$author$project$OOP$LangUtils$turnToInsert(v2));
			case 'VCons':
				var v11 = v1.a;
				var v12 = v1.b;
				switch (v2.$) {
					case 'VNil':
						return _Utils_Tuple2(
							$author$project$OOP$LangUtils$vlength(v1),
							A2(
								$elm$core$List$repeat,
								$author$project$OOP$LangUtils$vlength(v1),
								$author$project$OOP$Syntax$Delete));
					case 'VCons':
						var v21 = v2.a;
						var v22 = v2.b;
						if (_Utils_eq(v11, v21)) {
							var _v2 = A2($author$project$OOP$LangUtils$diff, v12, v22);
							var n = _v2.a;
							var opList = _v2.b;
							return _Utils_Tuple2(
								n,
								A2(
									$elm$core$List$cons,
									$author$project$OOP$Syntax$Keep(v11),
									opList));
						} else {
							return A4(
								$author$project$OOP$LangUtils$compareSubSeq,
								v21,
								A2($author$project$OOP$LangUtils$diff, v12, v22),
								A2($author$project$OOP$LangUtils$diff, v1, v22),
								A2($author$project$OOP$LangUtils$diff, v12, v2));
						}
					default:
						return _Utils_Tuple2(-99, _List_Nil);
				}
			default:
				return _Utils_Tuple2(0, _List_Nil);
		}
	});
var $elm_community$list_extra$List$Extra$dropWhile = F2(
	function (predicate, list) {
		dropWhile:
		while (true) {
			if (!list.b) {
				return _List_Nil;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					var $temp$predicate = predicate,
						$temp$list = xs;
					predicate = $temp$predicate;
					list = $temp$list;
					continue dropWhile;
				} else {
					return list;
				}
			}
		}
	});
var $author$project$OOP$Subclassing$isNewSubCls = function (c) {
	var _v0 = $elm$core$String$uncons(
		A2($elm$core$String$right, 1, c));
	if (_v0.$ === 'Just') {
		var _v1 = _v0.a;
		var _char = _v1.a;
		return $elm$core$Char$isDigit(_char) ? true : false;
	} else {
		return false;
	}
};
var $author$project$OOP$Subclassing$addMSAndDelCls = F6(
	function (c1, c2, ct, ms, f1, f2) {
		addMSAndDelCls:
		while (true) {
			if (ct.b) {
				var _v1 = ct.a;
				var ws_cls = _v1.a;
				var _v2 = _v1.b;
				var _v3 = _v2.a;
				var c3 = _v3.a;
				var f = _v3.b;
				var fs = _v2.b;
				var _v4 = _v2.c;
				var ws_ms = _v4.a;
				var ms3 = _v4.b;
				var ct_ = ct.b;
				if (_Utils_eq(c1, c3)) {
					return f2 ? A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							ws_cls,
							_Utils_Tuple3(
								_Utils_Tuple2(c1, f),
								fs,
								_Utils_Tuple2(
									ws_ms,
									_Utils_ap(ms3, ms)))),
						ct_) : A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							ws_cls,
							_Utils_Tuple3(
								_Utils_Tuple2(c1, f),
								fs,
								_Utils_Tuple2(
									ws_ms,
									_Utils_ap(ms3, ms)))),
						A6($author$project$OOP$Subclassing$addMSAndDelCls, c1, c2, ct_, ms, true, false));
				} else {
					if (_Utils_eq(c2, c3)) {
						if (f1) {
							return ct_;
						} else {
							var $temp$c1 = c1,
								$temp$c2 = c2,
								$temp$ct = ct_,
								$temp$ms = ms,
								$temp$f1 = false,
								$temp$f2 = true;
							c1 = $temp$c1;
							c2 = $temp$c2;
							ct = $temp$ct;
							ms = $temp$ms;
							f1 = $temp$f1;
							f2 = $temp$f2;
							continue addMSAndDelCls;
						}
					} else {
						return A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								ws_cls,
								_Utils_Tuple3(
									_Utils_Tuple2(c3, f),
									fs,
									_Utils_Tuple2(ws_ms, ms3))),
							A6($author$project$OOP$Subclassing$addMSAndDelCls, c1, c2, ct_, ms, f1, f2));
					}
				}
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$OOP$Subclassing$findMethods = F2(
	function (c, ct) {
		findMethods:
		while (true) {
			if (ct.b) {
				var _v1 = ct.a;
				var _v2 = _v1.b;
				var _v3 = _v2.a;
				var c1 = _v3.a;
				var _v4 = _v2.c;
				var ms = _v4.b;
				var ct_ = ct.b;
				if (_Utils_eq(c, c1)) {
					return ms;
				} else {
					var $temp$c = c,
						$temp$ct = ct_;
					c = $temp$c;
					ct = $temp$ct;
					continue findMethods;
				}
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$OOP$Subclassing$mergeNewSubCls = F3(
	function (_v0, c1, c2) {
		var ws = _v0.a;
		var ct = _v0.b;
		return _Utils_Tuple2(
			ws,
			A6(
				$author$project$OOP$Subclassing$addMSAndDelCls,
				c1,
				c2,
				ct,
				A2($author$project$OOP$Subclassing$findMethods, c2, ct),
				false,
				false));
	});
var $author$project$OOP$Subclassing$threeMerge = F4(
	function (oV, v1, v2, ct) {
		var _v0 = _Utils_Tuple3(oV, v1, v2);
		_v0$5:
		while (true) {
			switch (_v0.a.$) {
				case 'VCons':
					if ((_v0.b.$ === 'VCons') && (_v0.c.$ === 'VCons')) {
						var _v1 = _v0.a;
						var o1 = _v1.a;
						var o2 = _v1.b;
						var _v2 = _v0.b;
						var v11 = _v2.a;
						var v12 = _v2.b;
						var _v3 = _v0.c;
						var v21 = _v3.a;
						var v22 = _v3.b;
						var _v4 = A4($author$project$OOP$Subclassing$threeMerge, o1, v11, v21, ct);
						var v1_ = _v4.a;
						var ct1 = _v4.b;
						var _v5 = A4($author$project$OOP$Subclassing$threeMerge, o2, v12, v22, ct1);
						var v2_ = _v5.a;
						var ct2 = _v5.b;
						return _Utils_Tuple2(
							A2($author$project$OOP$Syntax$VCons, v1_, v2_),
							ct2);
					} else {
						break _v0$5;
					}
				case 'VTuple2':
					if ((_v0.b.$ === 'VTuple2') && (_v0.c.$ === 'VTuple2')) {
						var _v6 = _v0.a;
						var o1 = _v6.a;
						var o2 = _v6.b;
						var _v7 = _v0.b;
						var v11 = _v7.a;
						var v12 = _v7.b;
						var _v8 = _v0.c;
						var v21 = _v8.a;
						var v22 = _v8.b;
						var _v9 = A4($author$project$OOP$Subclassing$threeMerge, o1, v11, v21, ct);
						var v1_ = _v9.a;
						var ct1 = _v9.b;
						var _v10 = A4($author$project$OOP$Subclassing$threeMerge, o2, v12, v22, ct1);
						var v2_ = _v10.a;
						var ct2 = _v10.b;
						return _Utils_Tuple2(
							A2($author$project$OOP$Syntax$VTuple2, v1_, v2_),
							ct2);
					} else {
						break _v0$5;
					}
				case 'VTuple3':
					if ((_v0.b.$ === 'VTuple3') && (_v0.c.$ === 'VTuple3')) {
						var _v11 = _v0.a;
						var o1 = _v11.a;
						var o2 = _v11.b;
						var o3 = _v11.c;
						var _v12 = _v0.b;
						var v11 = _v12.a;
						var v12 = _v12.b;
						var v13 = _v12.c;
						var _v13 = _v0.c;
						var v21 = _v13.a;
						var v22 = _v13.b;
						var v23 = _v13.c;
						var _v14 = A4($author$project$OOP$Subclassing$threeMerge, o1, v11, v21, ct);
						var v1_ = _v14.a;
						var ct1 = _v14.b;
						var _v15 = A4($author$project$OOP$Subclassing$threeMerge, o2, v12, v22, ct1);
						var v2_ = _v15.a;
						var ct2 = _v15.b;
						var _v16 = A4($author$project$OOP$Subclassing$threeMerge, o3, v13, v23, ct2);
						var v3_ = _v16.a;
						var ct3 = _v16.b;
						return _Utils_Tuple2(
							A3($author$project$OOP$Syntax$VTuple3, v1_, v2_, v3_),
							ct3);
					} else {
						break _v0$5;
					}
				case 'VNew':
					if ((_v0.b.$ === 'VNew') && (_v0.c.$ === 'VNew')) {
						var _v17 = _v0.a;
						var oc = _v17.a;
						var oarg = _v17.b;
						var _v18 = _v0.b;
						var c1 = _v18.a;
						var arg1 = _v18.b;
						var _v19 = _v0.c;
						var c2 = _v19.a;
						var arg2 = _v19.b;
						var _v20 = A4($author$project$OOP$Subclassing$threeMerge, oarg, arg1, arg2, ct);
						var arg = _v20.a;
						var ct1 = _v20.b;
						return (!_Utils_eq(c1, oc)) ? (($author$project$OOP$Subclassing$isNewSubCls(c1) && $author$project$OOP$Subclassing$isNewSubCls(c2)) ? _Utils_Tuple2(
							A2($author$project$OOP$Syntax$VNew, c1, arg),
							A3($author$project$OOP$Subclassing$mergeNewSubCls, ct1, c1, c2)) : _Utils_Tuple2(
							A2($author$project$OOP$Syntax$VNew, c1, arg),
							ct1)) : _Utils_Tuple2(
							A2($author$project$OOP$Syntax$VNew, c2, arg),
							ct1);
					} else {
						break _v0$5;
					}
				case 'VHtml':
					if ((_v0.b.$ === 'VHtml') && (_v0.c.$ === 'VHtml')) {
						var _v21 = _v0.a;
						var ol = _v21.a;
						var o1 = _v21.b;
						var o2 = _v21.c;
						var o3 = _v21.d;
						var _v22 = _v0.b;
						var l1 = _v22.a;
						var v11 = _v22.b;
						var v12 = _v22.c;
						var v13 = _v22.d;
						var _v23 = _v0.c;
						var l2 = _v23.a;
						var v21 = _v23.b;
						var v22 = _v23.c;
						var v23 = _v23.d;
						var label = (!_Utils_eq(l1, ol)) ? l1 : l2;
						var _v24 = A4($author$project$OOP$Subclassing$threeMerge, o1, v11, v21, ct);
						var v1_ = _v24.a;
						var ct1 = _v24.b;
						var _v25 = A4($author$project$OOP$Subclassing$threeMerge, o2, v12, v22, ct1);
						var v2_ = _v25.a;
						var ct2 = _v25.b;
						var _v26 = A4($author$project$OOP$Subclassing$threeMerge, o3, v13, v23, ct2);
						var v3_ = _v26.a;
						var ct3 = _v26.b;
						return _Utils_Tuple2(
							A4($author$project$OOP$Syntax$VHtml, label, v1_, v2_, v3_),
							ct3);
					} else {
						break _v0$5;
					}
				default:
					break _v0$5;
			}
		}
		return (!_Utils_eq(v1, oV)) ? _Utils_Tuple2(v1, ct) : _Utils_Tuple2(v2, ct);
	});
var $author$project$OOP$LangUtils$mergeEnv = F4(
	function (env1, env2, ori_env, ct) {
		var _v0 = _Utils_Tuple3(env1, env2, ori_env);
		if ((_v0.a.b && _v0.b.b) && _v0.c.b) {
			var _v1 = _v0.a;
			var _v2 = _v1.a;
			var s1 = _v2.a;
			var v1 = _v2.b;
			var env1_ = _v1.b;
			var _v3 = _v0.b;
			var _v4 = _v3.a;
			var s2 = _v4.a;
			var v2 = _v4.b;
			var env2_ = _v3.b;
			var _v5 = _v0.c;
			var _v6 = _v5.a;
			var v3 = _v6.b;
			var ori_env_ = _v5.b;
			var _v7 = A4($author$project$OOP$LangUtils$mergeEnv, env1_, env2_, ori_env_, ct);
			var env_ = _v7.a;
			var ct_ = _v7.b;
			var _v8 = _Utils_Tuple2(v1, v3);
			if ((((_v8.a.$ === 'VClosure') && (_v8.b.$ === 'VFix')) && (_v8.b.a.$ === 'TLam')) && (_v8.b.a.c.$ === 'TLam')) {
				var _v9 = _v8.a;
				var t1 = _v9.b;
				var _v10 = _v8.b.a;
				var _v11 = _v10.c;
				var t2 = _v11.c;
				return (!_Utils_eq(t1, t2)) ? _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(s1, v1),
						env_),
					ct_) : _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(s2, v2),
						env_),
					ct_);
			} else {
				var _v12 = A4($author$project$OOP$Subclassing$threeMerge, v3, v1, v2, ct_);
				var v_ = _v12.a;
				var ct__ = _v12.b;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(s1, v_),
						env_),
					ct__);
			}
		} else {
			return _Utils_Tuple2(_List_Nil, ct);
		}
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$OOP$Parser$Value$char = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (c) {
				return $author$project$OOP$Syntax$VChar(c);
			}),
		$elm$parser$Parser$symbol('\'')),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$Utils$char_,
			$elm$parser$Parser$symbol('\'')),
		$elm$parser$Parser$spaces));
var $author$project$OOP$Parser$Value$false = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$OOP$Syntax$VFalse),
		$elm$parser$Parser$keyword('false')),
	$elm$parser$Parser$spaces);
var $author$project$OOP$Parser$Value$float_ = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($author$project$OOP$Syntax$VFloat),
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
						return $author$project$OOP$Syntax$VFloat(-n);
					}),
				$elm$parser$Parser$symbol('-')),
			A2($elm$parser$Parser$ignorer, $elm$parser$Parser$float, $elm$parser$Parser$spaces))
		]));
var $author$project$OOP$Parser$Value$int_ = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($author$project$OOP$Syntax$VInt),
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
						return $author$project$OOP$Syntax$VInt(-n);
					}),
				$elm$parser$Parser$symbol('-')),
			A2($elm$parser$Parser$ignorer, $elm$parser$Parser$int, $elm$parser$Parser$spaces))
		]));
var $author$project$OOP$Parser$Value$loc = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($author$project$OOP$Syntax$VLoc),
			$elm$parser$Parser$symbol('<')),
		$elm$parser$Parser$spaces),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$number(
					{
						binary: $elm$core$Maybe$Nothing,
						_float: $elm$core$Maybe$Nothing,
						hex: $elm$core$Maybe$Nothing,
						_int: $elm$core$Maybe$Just($elm$core$Basics$identity),
						octal: $elm$core$Maybe$Nothing
					}),
				$elm$parser$Parser$spaces),
			$elm$parser$Parser$symbol('>')),
		$elm$parser$Parser$spaces));
var $author$project$OOP$Parser$Value$nil = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($author$project$OOP$Syntax$VNil),
				$elm$parser$Parser$symbol('[')),
			$elm$parser$Parser$spaces),
		$elm$parser$Parser$symbol(']')),
	$elm$parser$Parser$spaces);
var $author$project$OOP$Parser$Value$string = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (s) {
				return $author$project$OOP$Syntax$VString(s);
			}),
		$elm$parser$Parser$symbol('\"')),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$OOP$Parser$Utils$string_,
			$elm$parser$Parser$symbol('\"')),
		$elm$parser$Parser$spaces));
var $author$project$OOP$Parser$Value$true = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$OOP$Syntax$VTrue),
		$elm$parser$Parser$keyword('true')),
	$elm$parser$Parser$spaces);
var $author$project$OOP$Parser$Value$unit = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$OOP$Syntax$VUnit),
		$elm$parser$Parser$symbol('_')),
	$elm$parser$Parser$spaces);
var $author$project$OOP$Parser$Value$listHelper = function (revValues) {
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
					function (_v7) {
						return $author$project$OOP$Parser$Value$cyclic$value();
					})),
				A2(
				$elm$parser$Parser$map,
				function (_v8) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revValues));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
function $author$project$OOP$Parser$Value$cyclic$list() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$OOP$Syntax$VCons),
					$elm$parser$Parser$symbol('[')),
				$elm$parser$Parser$spaces),
			$elm$parser$Parser$lazy(
				function (_v9) {
					return $author$project$OOP$Parser$Value$cyclic$value();
				})),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$OOP$Parser$Value$cyclic$listloop(),
				$elm$parser$Parser$symbol(']')),
			$elm$parser$Parser$spaces));
}
function $author$project$OOP$Parser$Value$cyclic$listloop() {
	return A2(
		$elm$parser$Parser$map,
		$author$project$OOP$Parser$Value$valueListToVCons,
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$OOP$Parser$Value$listHelper));
}
function $author$project$OOP$Parser$Value$cyclic$value() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Value$int_),
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Value$float_),
				$author$project$OOP$Parser$Value$true,
				$author$project$OOP$Parser$Value$false,
				$author$project$OOP$Parser$Value$char,
				$author$project$OOP$Parser$Value$string,
				$elm$parser$Parser$backtrackable($author$project$OOP$Parser$Value$nil),
				$elm$parser$Parser$lazy(
				function (_v6) {
					return $author$project$OOP$Parser$Value$cyclic$list();
				}),
				$elm$parser$Parser$backtrackable(
				$author$project$OOP$Parser$Value$cyclic$tuple2()),
				$author$project$OOP$Parser$Value$cyclic$tuple3(),
				$author$project$OOP$Parser$Value$loc,
				$author$project$OOP$Parser$Value$unit,
				$author$project$OOP$Parser$Value$cyclic$new()
			]));
}
function $author$project$OOP$Parser$Value$cyclic$new() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$OOP$Syntax$VNew),
					$elm$parser$Parser$keyword('new')),
				$elm$parser$Parser$spaces),
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$OOP$Parser$Utils$varName,
				$elm$parser$Parser$symbol('('))),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v5) {
						return $author$project$OOP$Parser$Value$cyclic$value();
					}),
				$elm$parser$Parser$symbol(')')),
			$elm$parser$Parser$spaces));
}
function $author$project$OOP$Parser$Value$cyclic$tuple2() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$OOP$Syntax$VTuple2),
					$elm$parser$Parser$symbol('(')),
				$elm$parser$Parser$spaces),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v3) {
							return $author$project$OOP$Parser$Value$cyclic$value();
						}),
					$elm$parser$Parser$symbol(',')),
				$elm$parser$Parser$spaces)),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v4) {
						return $author$project$OOP$Parser$Value$cyclic$value();
					}),
				$elm$parser$Parser$symbol(')')),
			$elm$parser$Parser$spaces));
}
function $author$project$OOP$Parser$Value$cyclic$tuple3() {
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
						$elm$parser$Parser$succeed($author$project$OOP$Syntax$VTuple3),
						$elm$parser$Parser$symbol('(')),
					$elm$parser$Parser$spaces),
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v0) {
								return $author$project$OOP$Parser$Value$cyclic$value();
							}),
						$elm$parser$Parser$symbol(',')),
					$elm$parser$Parser$spaces)),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v1) {
							return $author$project$OOP$Parser$Value$cyclic$value();
						}),
					$elm$parser$Parser$symbol(',')),
				$elm$parser$Parser$spaces)),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v2) {
						return $author$project$OOP$Parser$Value$cyclic$value();
					}),
				$elm$parser$Parser$symbol(')')),
			$elm$parser$Parser$spaces));
}
try {
	var $author$project$OOP$Parser$Value$list = $author$project$OOP$Parser$Value$cyclic$list();
	$author$project$OOP$Parser$Value$cyclic$list = function () {
		return $author$project$OOP$Parser$Value$list;
	};
	var $author$project$OOP$Parser$Value$listloop = $author$project$OOP$Parser$Value$cyclic$listloop();
	$author$project$OOP$Parser$Value$cyclic$listloop = function () {
		return $author$project$OOP$Parser$Value$listloop;
	};
	var $author$project$OOP$Parser$Value$value = $author$project$OOP$Parser$Value$cyclic$value();
	$author$project$OOP$Parser$Value$cyclic$value = function () {
		return $author$project$OOP$Parser$Value$value;
	};
	var $author$project$OOP$Parser$Value$new = $author$project$OOP$Parser$Value$cyclic$new();
	$author$project$OOP$Parser$Value$cyclic$new = function () {
		return $author$project$OOP$Parser$Value$new;
	};
	var $author$project$OOP$Parser$Value$tuple2 = $author$project$OOP$Parser$Value$cyclic$tuple2();
	$author$project$OOP$Parser$Value$cyclic$tuple2 = function () {
		return $author$project$OOP$Parser$Value$tuple2;
	};
	var $author$project$OOP$Parser$Value$tuple3 = $author$project$OOP$Parser$Value$cyclic$tuple3();
	$author$project$OOP$Parser$Value$cyclic$tuple3 = function () {
		return $author$project$OOP$Parser$Value$tuple3;
	};
} catch ($) {
	throw 'Some top-level definitions from `OOP.Parser.Value` are causing infinite recursion:\n\n  ┌─────┐\n  │    list\n  │     ↓\n  │    listloop\n  │     ↓\n  │    listHelper\n  │     ↓\n  │    value\n  │     ↓\n  │    new\n  │     ↓\n  │    tuple2\n  │     ↓\n  │    tuple3\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$OOP$Parser$Value$parse = function (s) {
	return A2(
		$elm$parser$Parser$run,
		A2($elm$parser$Parser$ignorer, $author$project$OOP$Parser$Value$value, $elm$parser$Parser$end),
		s);
};
var $author$project$OOP$LangUtils$patternSubst = F2(
	function (env, p) {
		switch (p.$) {
			case 'PVar':
				var s = p.b;
				var _v1 = A2($author$project$OOP$Utils$findByName, s, env);
				if (_v1.$ === 'Just') {
					var val = _v1.a;
					return val;
				} else {
					return $author$project$OOP$Syntax$VError('Pattern Substitution Error: No Such Variable.');
				}
			case 'PCons':
				var p1 = p.b;
				var p2 = p.c;
				return A2(
					$author$project$OOP$Syntax$VCons,
					A2($author$project$OOP$LangUtils$patternSubst, env, p1),
					A2($author$project$OOP$LangUtils$patternSubst, env, p2));
			case 'PCons1':
				var p1 = p.b;
				var p2 = p.c;
				var _v2 = _Utils_Tuple2(
					A2($author$project$OOP$LangUtils$patternSubst, env, p1),
					A2($author$project$OOP$LangUtils$patternSubst, env, p2));
				if ((_v2.a.$ === 'VChar') && (_v2.b.$ === 'VString')) {
					var c = _v2.a.a;
					var s = _v2.b.a;
					return $author$project$OOP$Syntax$VString(
						A2($elm$core$String$cons, c, s));
				} else {
					return $author$project$OOP$Syntax$VError('Error : 999');
				}
			case 'PNil':
				return $author$project$OOP$Syntax$VNil;
			case 'PList':
				var p1 = p.b;
				var p2 = p.c;
				return A2(
					$author$project$OOP$Syntax$VCons,
					A2($author$project$OOP$LangUtils$patternSubst, env, p1),
					A2($author$project$OOP$LangUtils$patternSubst, env, p2));
			case 'PEmpList':
				return $author$project$OOP$Syntax$VNil;
			case 'PInt':
				var n = p.b;
				return $author$project$OOP$Syntax$VInt(n);
			case 'PFloat':
				var n = p.b;
				return $author$project$OOP$Syntax$VFloat(n);
			case 'PTrue':
				return $author$project$OOP$Syntax$VTrue;
			case 'PFalse':
				return $author$project$OOP$Syntax$VFalse;
			case 'PString':
				var s = p.b;
				return $author$project$OOP$Syntax$VString(s);
			case 'PChar':
				var c = p.b;
				return $author$project$OOP$Syntax$VChar(c);
			case 'PBTuple':
				var p1 = p.b;
				var p2 = p.c;
				return A2(
					$author$project$OOP$Syntax$VTuple2,
					A2($author$project$OOP$LangUtils$patternSubst, env, p1),
					A2($author$project$OOP$LangUtils$patternSubst, env, p2));
			case 'PTTuple':
				var p1 = p.b;
				var p2 = p.c;
				var p3 = p.d;
				return A3(
					$author$project$OOP$Syntax$VTuple3,
					A2($author$project$OOP$LangUtils$patternSubst, env, p1),
					A2($author$project$OOP$LangUtils$patternSubst, env, p2),
					A2($author$project$OOP$LangUtils$patternSubst, env, p3));
			case 'PUnit':
				return $author$project$OOP$Syntax$VUnit;
			default:
				return $author$project$OOP$Syntax$VError('Error : 07.');
		}
	});
var $author$project$OOP$LangUtils$eqP = F2(
	function (pat1, pat2) {
		var _v0 = _Utils_Tuple2(pat1, pat2);
		_v0$15:
		while (true) {
			switch (_v0.a.$) {
				case 'PVar':
					if (_v0.b.$ === 'PVar') {
						var _v1 = _v0.a;
						var s1 = _v1.b;
						var _v2 = _v0.b;
						var s2 = _v2.b;
						return _Utils_eq(s1, s2);
					} else {
						break _v0$15;
					}
				case 'PCons':
					if (_v0.b.$ === 'PCons') {
						var _v3 = _v0.a;
						var p11 = _v3.b;
						var p12 = _v3.c;
						var _v4 = _v0.b;
						var p21 = _v4.b;
						var p22 = _v4.c;
						return A2($author$project$OOP$LangUtils$eqP, p11, p21) && A2($author$project$OOP$LangUtils$eqP, p12, p22);
					} else {
						break _v0$15;
					}
				case 'PCons1':
					if (_v0.b.$ === 'PCons1') {
						var _v5 = _v0.a;
						var p11 = _v5.b;
						var p12 = _v5.c;
						var _v6 = _v0.b;
						var p21 = _v6.b;
						var p22 = _v6.c;
						return A2($author$project$OOP$LangUtils$eqP, p11, p21) && A2($author$project$OOP$LangUtils$eqP, p12, p22);
					} else {
						break _v0$15;
					}
				case 'PList':
					if (_v0.b.$ === 'PList') {
						var _v7 = _v0.a;
						var p11 = _v7.b;
						var p12 = _v7.c;
						var _v8 = _v0.b;
						var p21 = _v8.b;
						var p22 = _v8.c;
						return A2($author$project$OOP$LangUtils$eqP, p11, p21) && A2($author$project$OOP$LangUtils$eqP, p12, p22);
					} else {
						break _v0$15;
					}
				case 'PNil':
					if (_v0.b.$ === 'PNil') {
						return true;
					} else {
						break _v0$15;
					}
				case 'PEmpList':
					if (_v0.b.$ === 'PEmpList') {
						return true;
					} else {
						break _v0$15;
					}
				case 'PInt':
					if (_v0.b.$ === 'PInt') {
						var _v9 = _v0.a;
						var n1 = _v9.b;
						var _v10 = _v0.b;
						var n2 = _v10.b;
						return _Utils_eq(n1, n2);
					} else {
						break _v0$15;
					}
				case 'PFloat':
					if (_v0.b.$ === 'PFloat') {
						var _v11 = _v0.a;
						var n1 = _v11.b;
						var _v12 = _v0.b;
						var n2 = _v12.b;
						return _Utils_eq(n1, n2);
					} else {
						break _v0$15;
					}
				case 'PTrue':
					if (_v0.b.$ === 'PTrue') {
						return true;
					} else {
						break _v0$15;
					}
				case 'PFalse':
					if (_v0.b.$ === 'PFalse') {
						return true;
					} else {
						break _v0$15;
					}
				case 'PString':
					if (_v0.b.$ === 'PString') {
						var _v13 = _v0.a;
						var s1 = _v13.b;
						var _v14 = _v0.b;
						var s2 = _v14.b;
						return _Utils_eq(s1, s2);
					} else {
						break _v0$15;
					}
				case 'PChar':
					if (_v0.b.$ === 'PChar') {
						var _v15 = _v0.a;
						var c1 = _v15.b;
						var _v16 = _v0.b;
						var c2 = _v16.b;
						return _Utils_eq(c1, c2);
					} else {
						break _v0$15;
					}
				case 'PBTuple':
					if (_v0.b.$ === 'PBTuple') {
						var _v17 = _v0.a;
						var p11 = _v17.b;
						var p12 = _v17.c;
						var _v18 = _v0.b;
						var p21 = _v18.b;
						var p22 = _v18.c;
						return A2($author$project$OOP$LangUtils$eqP, p11, p21) && A2($author$project$OOP$LangUtils$eqP, p12, p22);
					} else {
						break _v0$15;
					}
				case 'PTTuple':
					if (_v0.b.$ === 'PTTuple') {
						var _v19 = _v0.a;
						var p11 = _v19.b;
						var p12 = _v19.c;
						var p13 = _v19.d;
						var _v20 = _v0.b;
						var p21 = _v20.b;
						var p22 = _v20.c;
						var p23 = _v20.d;
						return A2($author$project$OOP$LangUtils$eqP, p11, p21) && (A2($author$project$OOP$LangUtils$eqP, p12, p22) && A2($author$project$OOP$LangUtils$eqP, p13, p23));
					} else {
						break _v0$15;
					}
				case 'PUnit':
					if (_v0.b.$ === 'PUnit') {
						return true;
					} else {
						break _v0$15;
					}
				default:
					break _v0$15;
			}
		}
		return false;
	});
var $author$project$OOP$LangUtils$eqB = F2(
	function (b1, b2) {
		var _v53 = _Utils_Tuple2(b1, b2);
		_v53$3:
		while (true) {
			switch (_v53.a.$) {
				case 'BSin':
					if (_v53.b.$ === 'BSin') {
						var _v54 = _v53.a;
						var p1 = _v54.b;
						var t1 = _v54.c;
						var _v55 = _v53.b;
						var p2 = _v55.b;
						var t2 = _v55.c;
						return A2($author$project$OOP$LangUtils$eqP, p1, p2) && A2($author$project$OOP$LangUtils$eqT, t1, t2);
					} else {
						break _v53$3;
					}
				case 'BNSin':
					if (_v53.b.$ === 'BNSin') {
						var _v56 = _v53.a;
						var id1 = _v56.b;
						var p1 = _v56.c;
						var t1 = _v56.d;
						var _v57 = _v53.b;
						var id2 = _v57.b;
						var p2 = _v57.c;
						var t2 = _v57.d;
						return _Utils_eq(id1, id2) && (A2($author$project$OOP$LangUtils$eqP, p1, p2) && A2($author$project$OOP$LangUtils$eqT, t1, t2));
					} else {
						break _v53$3;
					}
				default:
					if (_v53.b.$ === 'BCom') {
						var _v58 = _v53.a;
						var b11 = _v58.b;
						var b12 = _v58.c;
						var _v59 = _v53.b;
						var b21 = _v59.b;
						var b22 = _v59.c;
						return A2($author$project$OOP$LangUtils$eqB, b11, b21) && A2($author$project$OOP$LangUtils$eqB, b12, b22);
					} else {
						break _v53$3;
					}
			}
		}
		return false;
	});
var $author$project$OOP$LangUtils$eqT = F2(
	function (term1, term2) {
		eqT:
		while (true) {
			var _v0 = _Utils_Tuple2(term1, term2);
			_v0$31:
			while (true) {
				switch (_v0.a.$) {
					case 'TInt':
						if (_v0.b.$ === 'TInt') {
							var _v1 = _v0.a;
							var n1 = _v1.b;
							var _v2 = _v0.b;
							var n2 = _v2.b;
							return _Utils_eq(n1, n2);
						} else {
							break _v0$31;
						}
					case 'TFloat':
						if (_v0.b.$ === 'TFloat') {
							var _v3 = _v0.a;
							var n1 = _v3.b;
							var _v4 = _v0.b;
							var n2 = _v4.b;
							return _Utils_eq(n1, n2);
						} else {
							break _v0$31;
						}
					case 'TTrue':
						if (_v0.b.$ === 'TTrue') {
							return true;
						} else {
							break _v0$31;
						}
					case 'TFalse':
						if (_v0.b.$ === 'TFalse') {
							return true;
						} else {
							break _v0$31;
						}
					case 'TChar':
						if (_v0.b.$ === 'TChar') {
							var _v5 = _v0.a;
							var c1 = _v5.b;
							var _v6 = _v0.b;
							var c2 = _v6.b;
							return _Utils_eq(c1, c2);
						} else {
							break _v0$31;
						}
					case 'TString':
						if (_v0.b.$ === 'TString') {
							var _v7 = _v0.a;
							var s1 = _v7.b;
							var _v8 = _v0.b;
							var s2 = _v8.b;
							return _Utils_eq(s1, s2);
						} else {
							break _v0$31;
						}
					case 'TVar':
						if (_v0.b.$ === 'TVar') {
							var _v9 = _v0.a;
							var s1 = _v9.b;
							var _v10 = _v0.b;
							var s2 = _v10.b;
							return _Utils_eq(s1, s2);
						} else {
							break _v0$31;
						}
					case 'TLam':
						if (_v0.b.$ === 'TLam') {
							var _v11 = _v0.a;
							var p1 = _v11.b;
							var t1 = _v11.c;
							var _v12 = _v0.b;
							var p2 = _v12.b;
							var t2 = _v12.c;
							return A2($author$project$OOP$LangUtils$eqP, p1, p2) && A2($author$project$OOP$LangUtils$eqT, t1, t2);
						} else {
							break _v0$31;
						}
					case 'TApp':
						if (_v0.b.$ === 'TApp') {
							var _v13 = _v0.a;
							var t11 = _v13.b;
							var t12 = _v13.c;
							var _v14 = _v0.b;
							var t21 = _v14.b;
							var t22 = _v14.c;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22);
						} else {
							break _v0$31;
						}
					case 'TLet':
						if (_v0.b.$ === 'TLet') {
							var _v15 = _v0.a;
							var p1 = _v15.b;
							var t11 = _v15.c;
							var t12 = _v15.d;
							var _v16 = _v0.b;
							var p2 = _v16.b;
							var t21 = _v16.c;
							var t22 = _v16.d;
							return A2($author$project$OOP$LangUtils$eqP, p1, p2) && (A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22));
						} else {
							break _v0$31;
						}
					case 'TCase':
						if (_v0.b.$ === 'TCase') {
							var _v17 = _v0.a;
							var t1 = _v17.b;
							var b1 = _v17.c;
							var _v18 = _v0.b;
							var t2 = _v18.b;
							var b2 = _v18.c;
							return A2($author$project$OOP$LangUtils$eqT, t1, t2) && A2($author$project$OOP$LangUtils$eqB, b1, b2);
						} else {
							break _v0$31;
						}
					case 'TCons':
						if (_v0.b.$ === 'TCons') {
							var _v19 = _v0.a;
							var t11 = _v19.b;
							var t12 = _v19.c;
							var _v20 = _v0.b;
							var t21 = _v20.b;
							var t22 = _v20.c;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22);
						} else {
							break _v0$31;
						}
					case 'TList':
						if (_v0.b.$ === 'TList') {
							var _v21 = _v0.a;
							var t11 = _v21.b;
							var t12 = _v21.c;
							var _v22 = _v0.b;
							var t21 = _v22.b;
							var t22 = _v22.c;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22);
						} else {
							break _v0$31;
						}
					case 'TNil':
						if (_v0.b.$ === 'TNil') {
							return true;
						} else {
							break _v0$31;
						}
					case 'TEmpList':
						if (_v0.b.$ === 'TEmpList') {
							return true;
						} else {
							break _v0$31;
						}
					case 'TTuple2':
						if (_v0.b.$ === 'TTuple2') {
							var _v23 = _v0.a;
							var t11 = _v23.b;
							var t12 = _v23.c;
							var _v24 = _v0.b;
							var t21 = _v24.b;
							var t22 = _v24.c;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22);
						} else {
							break _v0$31;
						}
					case 'TTuple3':
						if (_v0.b.$ === 'TTuple3') {
							var _v25 = _v0.a;
							var t11 = _v25.b;
							var t12 = _v25.c;
							var t13 = _v25.d;
							var _v26 = _v0.b;
							var t21 = _v26.b;
							var t22 = _v26.c;
							var t23 = _v26.d;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && (A2($author$project$OOP$LangUtils$eqT, t12, t22) && A2($author$project$OOP$LangUtils$eqT, t13, t23));
						} else {
							break _v0$31;
						}
					case 'TBPrim':
						if (_v0.b.$ === 'TBPrim') {
							var _v27 = _v0.a;
							var op1 = _v27.b;
							var t11 = _v27.c;
							var t12 = _v27.d;
							var _v28 = _v0.b;
							var op2 = _v28.b;
							var t21 = _v28.c;
							var t22 = _v28.d;
							return _Utils_eq(op1, op2) && (A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22));
						} else {
							break _v0$31;
						}
					case 'TUPrim':
						if (_v0.b.$ === 'TUPrim') {
							var _v29 = _v0.a;
							var op1 = _v29.b;
							var t1 = _v29.c;
							var _v30 = _v0.b;
							var op2 = _v30.b;
							var t2 = _v30.c;
							return _Utils_eq(op1, op2) && A2($author$project$OOP$LangUtils$eqT, t1, t2);
						} else {
							break _v0$31;
						}
					case 'TParens':
						if (_v0.b.$ === 'TParens') {
							var _v31 = _v0.a;
							var t1 = _v31.b;
							var _v32 = _v0.b;
							var t2 = _v32.b;
							var $temp$term1 = t1,
								$temp$term2 = t2;
							term1 = $temp$term1;
							term2 = $temp$term2;
							continue eqT;
						} else {
							break _v0$31;
						}
					case 'TRef':
						if (_v0.b.$ === 'TRef') {
							var _v33 = _v0.a;
							var t1 = _v33.b;
							var _v34 = _v0.b;
							var t2 = _v34.b;
							var $temp$term1 = t1,
								$temp$term2 = t2;
							term1 = $temp$term1;
							term2 = $temp$term2;
							continue eqT;
						} else {
							break _v0$31;
						}
					case 'TDeRef':
						if (_v0.b.$ === 'TDeRef') {
							var _v35 = _v0.a;
							var t1 = _v35.b;
							var _v36 = _v0.b;
							var t2 = _v36.b;
							var $temp$term1 = t1,
								$temp$term2 = t2;
							term1 = $temp$term1;
							term2 = $temp$term2;
							continue eqT;
						} else {
							break _v0$31;
						}
					case 'TAssign':
						if (_v0.b.$ === 'TAssign') {
							var _v37 = _v0.a;
							var t11 = _v37.b;
							var t12 = _v37.c;
							var _v38 = _v0.b;
							var t21 = _v38.b;
							var t22 = _v38.c;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22);
						} else {
							break _v0$31;
						}
					case 'TUnit':
						if (_v0.b.$ === 'TUnit') {
							return true;
						} else {
							break _v0$31;
						}
					case 'TField':
						if (_v0.b.$ === 'TField') {
							var _v39 = _v0.a;
							var t11 = _v39.b;
							var t12 = _v39.c;
							var _v40 = _v0.b;
							var t21 = _v40.b;
							var t22 = _v40.c;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22);
						} else {
							break _v0$31;
						}
					case 'TInvk':
						if (_v0.b.$ === 'TInvk') {
							var _v41 = _v0.a;
							var t11 = _v41.b;
							var t12 = _v41.c;
							var _v42 = _v0.b;
							var t21 = _v42.b;
							var t22 = _v42.c;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22);
						} else {
							break _v0$31;
						}
					case 'TNew':
						if (_v0.b.$ === 'TNew') {
							var _v43 = _v0.a;
							var s1 = _v43.b;
							var t1 = _v43.c;
							var _v44 = _v0.b;
							var s2 = _v44.b;
							var t2 = _v44.c;
							return _Utils_eq(s1, s2) && A2($author$project$OOP$LangUtils$eqT, t1, t2);
						} else {
							break _v0$31;
						}
					case 'TSeq':
						if (_v0.b.$ === 'TSeq') {
							var _v45 = _v0.a;
							var t11 = _v45.b;
							var t12 = _v45.c;
							var _v46 = _v0.b;
							var t21 = _v46.b;
							var t22 = _v46.c;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && A2($author$project$OOP$LangUtils$eqT, t12, t22);
						} else {
							break _v0$31;
						}
					case 'THtml':
						if (_v0.b.$ === 'THtml') {
							var _v47 = _v0.a;
							var s1 = _v47.b;
							var t11 = _v47.c;
							var t12 = _v47.d;
							var t13 = _v47.e;
							var _v48 = _v0.b;
							var s2 = _v48.b;
							var t21 = _v48.c;
							var t22 = _v48.d;
							var t23 = _v48.e;
							return _Utils_eq(s1, s2) && (A2($author$project$OOP$LangUtils$eqT, t11, t21) && (A2($author$project$OOP$LangUtils$eqT, t12, t22) && A2($author$project$OOP$LangUtils$eqT, t13, t23)));
						} else {
							break _v0$31;
						}
					case 'TToStr':
						if (_v0.b.$ === 'TToStr') {
							var _v49 = _v0.a;
							var t1 = _v49.b;
							var _v50 = _v0.b;
							var t2 = _v50.b;
							var $temp$term1 = t1,
								$temp$term2 = t2;
							term1 = $temp$term1;
							term2 = $temp$term2;
							continue eqT;
						} else {
							break _v0$31;
						}
					case 'TMap':
						if (_v0.b.$ === 'TMap') {
							var _v51 = _v0.a;
							var t11 = _v51.b;
							var t12 = _v51.c;
							var t13 = _v51.d;
							var _v52 = _v0.b;
							var t21 = _v52.b;
							var t22 = _v52.c;
							var t23 = _v52.d;
							return A2($author$project$OOP$LangUtils$eqT, t11, t21) && (A2($author$project$OOP$LangUtils$eqT, t12, t22) && A2($author$project$OOP$LangUtils$eqT, t13, t23));
						} else {
							break _v0$31;
						}
					default:
						break _v0$31;
				}
			}
			return false;
		}
	});
var $author$project$OOP$LangUtils$subclassing = F5(
	function (m, _class, t_, classtb, scc) {
		var res2 = A2($author$project$OOP$Utils$findByName, _class, scc);
		var res1 = A3($author$project$OOP$LangUtils$findMethod, m, _class, classtb);
		var _v0 = _Utils_Tuple3(res1, classtb, res2);
		if ((_v0.a.$ === 'Just') && (_v0.c.$ === 'Just')) {
			var _v1 = _v0.a.a;
			var _v2 = _v1.b;
			var ws_mt = _v2.a;
			var _v3 = _v2.b;
			var p = _v3.b;
			var t = _v3.c;
			var _v4 = _v0.b;
			var ws_tb = _v4.a;
			var cnt = _v0.c.a;
			return A2($author$project$OOP$LangUtils$eqT, t, t_) ? _Utils_Tuple3(
				_Utils_Tuple2(_List_Nil, _List_Nil),
				_class,
				scc) : _Utils_Tuple3(
				_Utils_Tuple2(
					ws_tb,
					_List_fromArray(
						[
							_Utils_Tuple2(
							_List_Nil,
							_Utils_Tuple3(
								_Utils_Tuple2(
									_Utils_ap(
										_class,
										$elm$core$Debug$toString(cnt)),
									_class),
								_Utils_Tuple2(_List_Nil, _List_Nil),
								_Utils_Tuple2(
									_List_Nil,
									_List_fromArray(
										[
											_Utils_Tuple2(
											ws_mt,
											_Utils_Tuple3(m, p, t_))
										]))))
						])),
				_Utils_ap(
					_class,
					$elm$core$Debug$toString(cnt)),
				A3($author$project$OOP$Utils$updateValueInDict, _class, cnt + 1, scc));
		} else {
			return _Utils_Tuple3(
				_Utils_Tuple2(_List_Nil, _List_Nil),
				_class,
				scc);
		}
	});
var $elm$core$Basics$truncate = _Basics_truncate;
var $elm_community$list_extra$List$Extra$unconsLast = function (list) {
	var _v0 = $elm$core$List$reverse(list);
	if (!_v0.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var last_ = _v0.a;
		var rest = _v0.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(
				last_,
				$elm$core$List$reverse(rest)));
	}
};
var $author$project$OOP$LangUtils$updateBranch = F3(
	function (branch, choice, t) {
		switch (branch.$) {
			case 'BNSin':
				var ws = branch.a;
				var n = branch.b;
				var p = branch.c;
				var term = branch.d;
				return _Utils_eq(choice, n) ? A4($author$project$OOP$Syntax$BNSin, ws, n, p, t) : A4($author$project$OOP$Syntax$BNSin, ws, n, p, term);
			case 'BCom':
				var ws = branch.a;
				var b1 = branch.b;
				var b2 = branch.c;
				return A3(
					$author$project$OOP$Syntax$BCom,
					ws,
					A3($author$project$OOP$LangUtils$updateBranch, b1, choice, t),
					A3($author$project$OOP$LangUtils$updateBranch, b2, choice, t));
			default:
				var b = branch;
				return b;
		}
	});
var $author$project$OOP$LangUtils$valueToListTerm = F2(
	function (v, ws) {
		switch (v.$) {
			case 'VCons':
				var v1 = v.a;
				var v2 = v.b;
				var t2 = A2(
					$author$project$OOP$LangUtils$valueToListTerm,
					v2,
					_List_fromArray(
						[' ']));
				var t1 = A2(
					$author$project$OOP$LangUtils$valueToTerm,
					v1,
					_List_fromArray(
						['']));
				return A3($author$project$OOP$Syntax$TList, ws, t1, t2);
			case 'VNil':
				return $author$project$OOP$Syntax$TEmpList(_List_Nil);
			default:
				return $author$project$OOP$Syntax$TError('Error : 33.');
		}
	});
var $author$project$OOP$LangUtils$valueToTerm = F2(
	function (v, ws) {
		switch (v.$) {
			case 'VInt':
				var n = v.a;
				return A2($author$project$OOP$Syntax$TInt, ws, n);
			case 'VFloat':
				var n = v.a;
				return A2($author$project$OOP$Syntax$TFloat, ws, n);
			case 'VTrue':
				return $author$project$OOP$Syntax$TTrue(ws);
			case 'VFalse':
				return $author$project$OOP$Syntax$TFalse(ws);
			case 'VChar':
				var c = v.a;
				return A2($author$project$OOP$Syntax$TChar, ws, c);
			case 'VString':
				var s = v.a;
				return A2($author$project$OOP$Syntax$TString, ws, s);
			case 'VCons':
				var v1 = v.a;
				var v2 = v.b;
				_v1$2:
				while (true) {
					if (ws.b) {
						if (!ws.b.b) {
							var t2 = A2(
								$author$project$OOP$LangUtils$valueToTerm,
								v2,
								_List_fromArray(
									[' ']));
							var t1 = A2(
								$author$project$OOP$LangUtils$valueToTerm,
								v1,
								_List_fromArray(
									['']));
							return A3($author$project$OOP$Syntax$TCons, ws, t1, t2);
						} else {
							if (!ws.b.b.b) {
								var _v2 = ws.b;
								return A2($author$project$OOP$LangUtils$valueToListTerm, v, ws);
							} else {
								break _v1$2;
							}
						}
					} else {
						break _v1$2;
					}
				}
				return $author$project$OOP$Syntax$TError('Error : 34.');
			case 'VNil':
				return $author$project$OOP$Syntax$TNil(ws);
			case 'VTuple2':
				var v1 = v.a;
				var v2 = v.b;
				var t2 = A2(
					$author$project$OOP$LangUtils$valueToTerm,
					v2,
					_List_fromArray(
						['']));
				var t1 = A2(
					$author$project$OOP$LangUtils$valueToTerm,
					v1,
					_List_fromArray(
						['']));
				return A3($author$project$OOP$Syntax$TTuple2, ws, t1, t2);
			case 'VTuple3':
				var v1 = v.a;
				var v2 = v.b;
				var v3 = v.c;
				var t3 = A2(
					$author$project$OOP$LangUtils$valueToTerm,
					v3,
					_List_fromArray(
						['']));
				var t2 = A2(
					$author$project$OOP$LangUtils$valueToTerm,
					v2,
					_List_fromArray(
						['']));
				var t1 = A2(
					$author$project$OOP$LangUtils$valueToTerm,
					v1,
					_List_fromArray(
						['']));
				return A4($author$project$OOP$Syntax$TTuple3, ws, t1, t2, t3);
			case 'VLoc':
				var n = v.a;
				return A2($author$project$OOP$Syntax$TLoc, ws, n);
			case 'VUnit':
				return $author$project$OOP$Syntax$TUnit(ws);
			case 'VNew':
				var _class = v.a;
				var arg = v.b;
				var t = A2(
					$author$project$OOP$LangUtils$valueToTerm,
					arg,
					_List_fromArray(
						['', '']));
				return A3(
					$author$project$OOP$Syntax$TNew,
					_List_fromArray(
						[' ', '', '']),
					_class,
					t);
			default:
				return $author$project$OOP$Syntax$TError(
					'Can Not Transfer Value: ' + ($author$project$OOP$Printer$Value$printValue(v) + ' To Expression.'));
		}
	});
var $author$project$OOP$LangUtils$vreplace = F3(
	function (index, v, ls) {
		switch (ls.$) {
			case 'VNil':
				return $author$project$OOP$Syntax$VNil;
			case 'VCons':
				var v1 = ls.a;
				var v2 = ls.b;
				return (!index) ? A2($author$project$OOP$Syntax$VCons, v, v2) : A2(
					$author$project$OOP$Syntax$VCons,
					v1,
					A3($author$project$OOP$LangUtils$vreplace, index - 1, v, v2));
			default:
				return $author$project$OOP$Syntax$VError('Args is Not a List : 02.');
		}
	});
var $author$project$OOP$LangUtils$vsplit = F2(
	function (nl, n1) {
		var _v0 = _Utils_Tuple2(nl, n1);
		switch (_v0.a.$) {
			case 'VCons':
				if (!_v0.b) {
					var _v1 = _v0.a;
					return _Utils_Tuple2($author$project$OOP$Syntax$VNil, nl);
				} else {
					var _v2 = _v0.a;
					var v1 = _v2.a;
					var vs = _v2.b;
					var _v3 = A2($author$project$OOP$LangUtils$vsplit, vs, n1 - 1);
					var l1 = _v3.a;
					var l2 = _v3.b;
					return _Utils_Tuple2(
						A2($author$project$OOP$Syntax$VCons, v1, l1),
						l2);
				}
			case 'VNil':
				var _v4 = _v0.a;
				return _Utils_Tuple2($author$project$OOP$Syntax$VNil, $author$project$OOP$Syntax$VNil);
			default:
				return _Utils_Tuple2(
					$author$project$OOP$Syntax$VError('New Value for Updating Concat Type Error'),
					$author$project$OOP$Syntax$VError(''));
		}
	});
var $author$project$OOP$UnEval$arith = F7(
	function (scc, ctx, t1, t2, updates, ws, op) {
		var _v236 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
		var v1 = _v236.a;
		var state1 = _v236.b;
		var _v237 = A4($author$project$OOP$Eval$eval, ctx.env, state1, ctx.classtb, t2);
		var v2 = _v237.a;
		var _v238 = updates.value;
		switch (_v238.$) {
			case 'VInt':
				var n = _v238.a;
				var _v239 = function () {
					var _v240 = _Utils_Tuple2(v1, v2);
					_v240$1:
					while (true) {
						_v240$3:
						while (true) {
							switch (_v240.a.$) {
								case 'VFloat':
									var n1 = _v240.a.a;
									switch (op.$) {
										case 'Add':
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VFloat(n1),
												$author$project$OOP$Syntax$VFloat(
													A2($myrho$elm_round$Round$roundNumCom, 2, n - n1)));
										case 'Sub':
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VFloat(n1),
												$author$project$OOP$Syntax$VFloat(
													A2($myrho$elm_round$Round$roundNumCom, 2, n1 - n)));
										case 'Mul':
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VFloat(n1),
												$author$project$OOP$Syntax$VFloat(
													A2($myrho$elm_round$Round$roundNumCom, 2, n / n1)));
										case 'Div':
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VFloat(n1),
												$author$project$OOP$Syntax$VFloat(
													A2($myrho$elm_round$Round$roundNumCom, 2, n1 / n)));
										default:
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VError(''),
												$author$project$OOP$Syntax$VError(''));
									}
								case 'VInt':
									switch (_v240.b.$) {
										case 'VFloat':
											break _v240$1;
										case 'VInt':
											var n1 = _v240.a.a;
											var n2 = _v240.b.a;
											switch (op.$) {
												case 'Add':
													return _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt(n - n1));
												case 'Sub':
													return _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt(n1 - n));
												case 'Mul':
													return _Utils_eq(n1 * n2, n) ? _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt(n2)) : ((!A2($elm$core$Basics$modBy, n1, n)) ? _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt((n / n1) | 0)) : _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VFloat(
															A2($myrho$elm_round$Round$roundNumCom, 2, n / n1))));
												case 'Div':
													return (_Utils_eq((n1 / n2) | 0, n) && (!A2($elm$core$Basics$modBy, n2, n1))) ? _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt(n2)) : ((!A2($elm$core$Basics$modBy, n, n1)) ? _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt((n1 / n) | 0)) : _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VFloat(n1 / n)));
												case 'RDiv':
													return _Utils_eq((n1 / n2) | 0, n) ? _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt(n2)) : _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt((n1 / n) | 0));
												default:
													return _Utils_Tuple2(
														$author$project$OOP$Syntax$VError(''),
														$author$project$OOP$Syntax$VError(''));
											}
										default:
											break _v240$3;
									}
								default:
									if (_v240.b.$ === 'VFloat') {
										break _v240$1;
									} else {
										break _v240$3;
									}
							}
						}
						return _Utils_Tuple2(
							$author$project$OOP$Syntax$VError(''),
							$author$project$OOP$Syntax$VError(''));
					}
					var n2 = _v240.b.a;
					switch (op.$) {
						case 'Add':
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VFloat(
									A2($myrho$elm_round$Round$roundNumCom, 2, n - n2)),
								$author$project$OOP$Syntax$VFloat(n2));
						case 'Sub':
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VFloat(
									A2($myrho$elm_round$Round$roundNumCom, 2, n + n2)),
								$author$project$OOP$Syntax$VFloat(n2));
						case 'Mul':
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VFloat(
									A2($myrho$elm_round$Round$roundNumCom, 2, n / n2)),
								$author$project$OOP$Syntax$VFloat(n2));
						case 'Div':
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VFloat(
									A2($myrho$elm_round$Round$roundNumCom, 2, n * n2)),
								$author$project$OOP$Syntax$VFloat(n2));
						default:
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VError(''),
								$author$project$OOP$Syntax$VError(''));
					}
				}();
				var newV_1 = _v239.a;
				var newV_2 = _v239.b;
				var _v244 = _Utils_Tuple2(newV_1, newV_2);
				if ((_v244.a.$ === 'VError') && (_v244.b.$ === 'VError')) {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Wrong Arith Expression : ' + $author$project$OOP$Printer$Term$printTerm(
								A4($author$project$OOP$Syntax$TBPrim, ws, op, t1, t2))),
						scc);
				} else {
					return A9($author$project$OOP$UnEval$operationUpdate, ctx, op, t1, t2, updates, newV_1, newV_2, ws, scc);
				}
			case 'VFloat':
				var n = _v238.a;
				var _v245 = function () {
					var _v246 = _Utils_Tuple2(v1, v2);
					_v246$1:
					while (true) {
						_v246$3:
						while (true) {
							switch (_v246.a.$) {
								case 'VFloat':
									var n1 = _v246.a.a;
									switch (op.$) {
										case 'Add':
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VFloat(n1),
												$author$project$OOP$Syntax$VFloat(
													A2($myrho$elm_round$Round$roundNumCom, 2, n - n1)));
										case 'Sub':
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VFloat(n1),
												$author$project$OOP$Syntax$VFloat(
													A2($myrho$elm_round$Round$roundNumCom, 2, n1 - n)));
										case 'Mul':
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VFloat(n1),
												$author$project$OOP$Syntax$VFloat(
													A2($myrho$elm_round$Round$roundNumCom, 2, n / n1)));
										case 'Div':
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VFloat(n1),
												$author$project$OOP$Syntax$VFloat(
													A2($myrho$elm_round$Round$roundNumCom, 2, n1 / n)));
										default:
											return _Utils_Tuple2(
												$author$project$OOP$Syntax$VError(''),
												$author$project$OOP$Syntax$VError(''));
									}
								case 'VInt':
									switch (_v246.b.$) {
										case 'VFloat':
											break _v246$1;
										case 'VInt':
											var n1 = _v246.a.a;
											var n2 = _v246.b.a;
											switch (op.$) {
												case 'Add':
													return _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VFloat(
															A2($myrho$elm_round$Round$roundNumCom, 2, n - n1)));
												case 'Sub':
													return _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VFloat(
															A2($myrho$elm_round$Round$roundNumCom, 2, n1 - n)));
												case 'Mul':
													return _Utils_eq(n1 * n2, n) ? _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt(n2)) : _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VFloat(
															A2($myrho$elm_round$Round$roundNumCom, 2, n / n1)));
												case 'Div':
													return _Utils_eq(n1 / n2, n) ? _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt(n2)) : _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VFloat(n1 / n));
												case 'RDiv':
													return _Utils_eq((n1 / n2) | 0, n) ? _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt(n2)) : _Utils_Tuple2(
														$author$project$OOP$Syntax$VInt(n1),
														$author$project$OOP$Syntax$VInt((n1 / n) | 0));
												default:
													return _Utils_Tuple2(
														$author$project$OOP$Syntax$VError(''),
														$author$project$OOP$Syntax$VError(''));
											}
										default:
											break _v246$3;
									}
								default:
									if (_v246.b.$ === 'VFloat') {
										break _v246$1;
									} else {
										break _v246$3;
									}
							}
						}
						return _Utils_Tuple2(
							$author$project$OOP$Syntax$VError(''),
							$author$project$OOP$Syntax$VError(''));
					}
					var n2 = _v246.b.a;
					switch (op.$) {
						case 'Add':
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VFloat(
									A2($myrho$elm_round$Round$roundNumCom, 2, n - n2)),
								$author$project$OOP$Syntax$VFloat(n2));
						case 'Sub':
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VFloat(
									A2($myrho$elm_round$Round$roundNumCom, 2, n + n2)),
								$author$project$OOP$Syntax$VFloat(n2));
						case 'Mul':
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VFloat(
									A2($myrho$elm_round$Round$roundNumCom, 2, n / n2)),
								$author$project$OOP$Syntax$VFloat(n2));
						case 'Div':
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VFloat(
									A2($myrho$elm_round$Round$roundNumCom, 2, n * n2)),
								$author$project$OOP$Syntax$VFloat(n2));
						default:
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VError(''),
								$author$project$OOP$Syntax$VError(''));
					}
				}();
				var newV_1 = _v245.a;
				var newV_2 = _v245.b;
				var _v250 = _Utils_Tuple2(newV_1, newV_2);
				if ((_v250.a.$ === 'VError') && (_v250.b.$ === 'VError')) {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Wrong Arith Expression : ' + $author$project$OOP$Printer$Term$printTerm(
								A4($author$project$OOP$Syntax$TBPrim, ws, op, t1, t2))),
						scc);
				} else {
					return A9($author$project$OOP$UnEval$operationUpdate, ctx, op, t1, t2, updates, newV_1, newV_2, ws, scc);
				}
			case 'VCons':
				if (_Utils_eq(op, $author$project$OOP$Syntax$Cat)) {
					var _v251 = A2(
						$author$project$OOP$LangUtils$vsplit,
						updates.value,
						$author$project$OOP$LangUtils$vlength(updates.value) - $author$project$OOP$LangUtils$vlength(v2));
					var newV_1 = _v251.a;
					var newV_2 = _v251.b;
					return A9($author$project$OOP$UnEval$operationUpdate, ctx, op, t1, t2, updates, newV_1, newV_2, ws, scc);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError('Operator Error : 11.'),
						scc);
				}
			case 'VNil':
				return _Utils_eq(op, $author$project$OOP$Syntax$Cat) ? A9($author$project$OOP$UnEval$operationUpdate, ctx, op, t1, t2, updates, $author$project$OOP$Syntax$VNil, $author$project$OOP$Syntax$VNil, ws, scc) : _Utils_Tuple3(
					_Utils_update(
						ctx,
						{
							classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
						}),
					$author$project$OOP$Syntax$TError('Operator Error : 12.'),
					scc);
			case 'VString':
				var s = _v238.a;
				if (_Utils_eq(op, $author$project$OOP$Syntax$Cat)) {
					var newV_2 = $author$project$OOP$Syntax$VString(
						A2(
							$elm$core$String$right,
							$author$project$OOP$LangUtils$vlength(v2),
							s));
					var newV_1 = $author$project$OOP$Syntax$VString(
						A2(
							$elm$core$String$left,
							$author$project$OOP$LangUtils$vlength(updates.value) - $author$project$OOP$LangUtils$vlength(v2),
							s));
					return A9($author$project$OOP$UnEval$operationUpdate, ctx, op, t1, t2, updates, newV_1, newV_2, ws, scc);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError('Operator Error : 16.'),
						scc);
				}
			default:
				return _Utils_Tuple3(
					_Utils_update(
						ctx,
						{
							classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
						}),
					$author$project$OOP$Syntax$TError(
						'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(
							A4($author$project$OOP$Syntax$TBPrim, ws, op, t1, t2))))),
					scc);
		}
	});
var $author$project$OOP$UnEval$comp = F7(
	function (scc, ctx, t1, t2, updates, ws, op) {
		var _v227 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
		var v1 = _v227.a;
		var _v228 = updates.value;
		switch (_v228.$) {
			case 'VTrue':
				if (op.$ === 'Eq') {
					return A9($author$project$OOP$UnEval$operationUpdate, ctx, op, t1, t2, updates, v1, v1, ws, scc);
				} else {
					var _v230 = A4(
						$author$project$OOP$Eval$eval,
						ctx.env,
						ctx.state,
						ctx.classtb,
						A4($author$project$OOP$Syntax$TBPrim, _List_Nil, op, t1, t2));
					var vo = _v230.a;
					var newTerm = function () {
						switch (vo.$) {
							case 'VTrue':
								return A4($author$project$OOP$Syntax$TBPrim, ws, op, t1, t2);
							case 'VFalse':
								switch (op.$) {
									case 'Lt':
										return A4($author$project$OOP$Syntax$TBPrim, ws, $author$project$OOP$Syntax$Ge, t1, t2);
									case 'Gt':
										return A4($author$project$OOP$Syntax$TBPrim, ws, $author$project$OOP$Syntax$Le, t1, t2);
									case 'Le':
										return A4($author$project$OOP$Syntax$TBPrim, ws, $author$project$OOP$Syntax$Gt, t1, t2);
									case 'Ge':
										return A4($author$project$OOP$Syntax$TBPrim, ws, $author$project$OOP$Syntax$Lt, t1, t2);
									default:
										return $author$project$OOP$Syntax$TError('');
								}
							default:
								return $author$project$OOP$Syntax$TError('Error : 01.');
						}
					}();
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
								state: updates.state
							}),
						newTerm,
						scc);
				}
			case 'VFalse':
				var _v233 = A4(
					$author$project$OOP$Eval$eval,
					ctx.env,
					ctx.state,
					ctx.classtb,
					A4($author$project$OOP$Syntax$TBPrim, _List_Nil, op, t1, t2));
				var vo = _v233.a;
				var newTerm = function () {
					switch (vo.$) {
						case 'VFalse':
							return A4($author$project$OOP$Syntax$TBPrim, ws, op, t1, t2);
						case 'VTrue':
							switch (op.$) {
								case 'Lt':
									return A4($author$project$OOP$Syntax$TBPrim, ws, $author$project$OOP$Syntax$Ge, t1, t2);
								case 'Gt':
									return A4($author$project$OOP$Syntax$TBPrim, ws, $author$project$OOP$Syntax$Le, t1, t2);
								case 'Le':
									return A4($author$project$OOP$Syntax$TBPrim, ws, $author$project$OOP$Syntax$Gt, t1, t2);
								case 'Ge':
									return A4($author$project$OOP$Syntax$TBPrim, ws, $author$project$OOP$Syntax$Lt, t1, t2);
								case 'Eq':
									return $author$project$OOP$Syntax$TError(
										'Cannot Infer : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(
											A4($author$project$OOP$Syntax$TBPrim, ws, op, t1, t2)))));
								default:
									return $author$project$OOP$Syntax$TError('');
							}
						default:
							return $author$project$OOP$Syntax$TError('Error : 02.');
					}
				}();
				return _Utils_Tuple3(
					_Utils_update(
						ctx,
						{
							classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
							state: updates.state
						}),
					newTerm,
					scc);
			default:
				return _Utils_Tuple3(
					_Utils_update(
						ctx,
						{
							classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
						}),
					$author$project$OOP$Syntax$TError(
						'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(
							A4($author$project$OOP$Syntax$TBPrim, ws, op, t1, t2))))),
					scc);
		}
	});
var $author$project$OOP$UnEval$deltaUpdate = F5(
	function (term, delta, ctx, newState, scc) {
		switch (term.$) {
			case 'TList':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				if (delta.b) {
					switch (delta.a.$) {
						case 'Keep':
							var resDelta = delta.b;
							var _v209 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
							var v1 = _v209.a;
							var state1 = _v209.b;
							var _v210 = A5(
								$author$project$OOP$UnEval$deltaUpdate,
								t2,
								resDelta,
								_Utils_update(
									ctx,
									{state: state1}),
								newState,
								scc);
							var ctx1_ = _v210.a;
							var t2_ = _v210.b;
							var scc1 = _v210.c;
							var _v211 = A4(
								$author$project$OOP$UnEval$uneval,
								scc1,
								ctx,
								t1,
								{state: ctx1_.state, value: v1});
							var ctx_ = _v211.a;
							var t1_ = _v211.b;
							var scc2 = _v211.c;
							var newCT = A2($author$project$OOP$LangUtils$appendCT, ctx_.classtb, ctx1_.classtb);
							var _v212 = A4($author$project$OOP$LangUtils$mergeEnv, ctx_.env, ctx1_.env, ctx.env, newCT);
							var newEnv = _v212.a;
							var newCT_ = _v212.b;
							return _Utils_Tuple3(
								_Utils_update(
									ctx_,
									{classtb: newCT_, env: newEnv}),
								A3($author$project$OOP$Syntax$TList, ws, t1_, t2_),
								scc2);
						case 'Delete':
							var _v213 = delta.a;
							var resDelta = delta.b;
							var _v214 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
							var v1 = _v214.a;
							var state1 = _v214.b;
							var _v215 = A5(
								$author$project$OOP$UnEval$deltaUpdate,
								t2,
								resDelta,
								_Utils_update(
									ctx,
									{state: state1}),
								newState,
								scc);
							var ctx1_ = _v215.a;
							var t2_ = _v215.b;
							var scc1 = _v215.c;
							var _v216 = A4(
								$author$project$OOP$UnEval$uneval,
								scc1,
								ctx,
								t1,
								{state: ctx1_.state, value: v1});
							var ctx_ = _v216.a;
							var scc2 = _v216.c;
							switch (t2_.$) {
								case 'TList':
									var t = t2_.b;
									var ts = t2_.c;
									return _Utils_Tuple3(
										_Utils_update(
											ctx1_,
											{
												classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
												state: ctx_.state
											}),
										A3($author$project$OOP$Syntax$TList, ws, t, ts),
										scc2);
								case 'TEmpList':
									return _Utils_Tuple3(
										_Utils_update(
											ctx1_,
											{
												classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
												state: ctx_.state
											}),
										$author$project$OOP$Syntax$TEmpList(ws),
										scc2);
								default:
									return _Utils_Tuple3(
										_Utils_update(
											ctx,
											{
												classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
											}),
										$author$project$OOP$Syntax$TError('Error : 31.'),
										scc2);
							}
						case 'Insert':
							var v = delta.a.a;
							var resDelta = delta.b;
							var t_ = function () {
								if (v.$ === 'VCons') {
									return A2(
										$author$project$OOP$LangUtils$valueToTerm,
										v,
										_List_fromArray(
											['', '']));
								} else {
									return A2(
										$author$project$OOP$LangUtils$valueToTerm,
										v,
										_List_fromArray(
											['']));
								}
							}();
							var _v218 = A5($author$project$OOP$UnEval$deltaUpdate, term, resDelta, ctx, newState, scc);
							var ctx_ = _v218.a;
							var term_ = _v218.b;
							var scc1 = _v218.c;
							return _Utils_Tuple3(
								ctx_,
								A3($author$project$OOP$Syntax$TList, ws, t_, term_),
								scc1);
						default:
							var v = delta.a.a;
							var resDelta = delta.b;
							var _v220 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
							var state1 = _v220.b;
							var _v221 = A5(
								$author$project$OOP$UnEval$deltaUpdate,
								t2,
								resDelta,
								_Utils_update(
									ctx,
									{state: state1}),
								newState,
								scc);
							var ctx1_ = _v221.a;
							var t2_ = _v221.b;
							var scc1 = _v221.c;
							var _v222 = A4(
								$author$project$OOP$UnEval$uneval,
								scc1,
								ctx,
								t1,
								{state: ctx1_.state, value: v});
							var ctx_ = _v222.a;
							var t1_ = _v222.b;
							var scc2 = _v222.c;
							var newCT = A2($author$project$OOP$LangUtils$appendCT, ctx_.classtb, ctx1_.classtb);
							var _v223 = A4($author$project$OOP$LangUtils$mergeEnv, ctx_.env, ctx1_.env, ctx.env, newCT);
							var newEnv = _v223.a;
							var newCT_ = _v223.b;
							return _Utils_Tuple3(
								_Utils_update(
									ctx_,
									{classtb: newCT_, env: newEnv}),
								A3($author$project$OOP$Syntax$TList, ws, t1_, t2_),
								scc2);
					}
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError('Diff Solve Error : 01.'),
						scc);
				}
			case 'TEmpList':
				var ws = term.a;
				if (delta.b) {
					if (delta.a.$ === 'Insert') {
						var v = delta.a.a;
						var resDelta = delta.b;
						var t_ = function () {
							if (v.$ === 'VCons') {
								return A2(
									$author$project$OOP$LangUtils$valueToTerm,
									v,
									_List_fromArray(
										['', '']));
							} else {
								return A2(
									$author$project$OOP$LangUtils$valueToTerm,
									v,
									_List_fromArray(
										['']));
							}
						}();
						var _v225 = A5($author$project$OOP$UnEval$deltaUpdate, term, resDelta, ctx, newState, scc);
						var ctx_ = _v225.a;
						var term_ = _v225.b;
						var scc1 = _v225.c;
						return _Utils_Tuple3(
							ctx_,
							A3($author$project$OOP$Syntax$TList, ws, t_, term_),
							scc1);
					} else {
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError('Diff Solve Error : 02.'),
							scc);
					}
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
								state: newState
							}),
						$author$project$OOP$Syntax$TEmpList(ws),
						scc);
				}
			default:
				return _Utils_Tuple3(
					_Utils_update(
						ctx,
						{
							classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
						}),
					$author$project$OOP$Syntax$TError('Delta Update is only available for lists and strings.'),
					scc);
		}
	});
var $author$project$OOP$UnEval$logic = F7(
	function (scc, ctx, t1, t2, updates, ws, op) {
		var _v173 = A4(
			$author$project$OOP$Eval$eval,
			ctx.env,
			ctx.state,
			ctx.classtb,
			A4($author$project$OOP$Syntax$TBPrim, _List_Nil, op, t1, t2));
		var vo = _v173.a;
		var _v174 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
		var v1 = _v174.a;
		var state1 = _v174.b;
		var _v175 = A4($author$project$OOP$Eval$eval, ctx.env, state1, ctx.classtb, t2);
		var v2 = _v175.a;
		var _v176 = function () {
			switch (vo.$) {
				case 'VTrue':
					var _v178 = updates.value;
					switch (_v178.$) {
						case 'VTrue':
							return _Utils_Tuple2(v1, v2);
						case 'VFalse':
							var _v179 = _Utils_Tuple3(v1, v2, op);
							_v179$4:
							while (true) {
								switch (_v179.a.$) {
									case 'VTrue':
										switch (_v179.b.$) {
											case 'VTrue':
												switch (_v179.c.$) {
													case 'And':
														var _v180 = _v179.a;
														var _v181 = _v179.b;
														var _v182 = _v179.c;
														return _Utils_Tuple2($author$project$OOP$Syntax$VFalse, $author$project$OOP$Syntax$VTrue);
													case 'Or':
														var _v183 = _v179.a;
														var _v184 = _v179.b;
														var _v185 = _v179.c;
														return _Utils_Tuple2($author$project$OOP$Syntax$VFalse, $author$project$OOP$Syntax$VFalse);
													default:
														break _v179$4;
												}
											case 'VFalse':
												if (_v179.c.$ === 'Or') {
													var _v186 = _v179.a;
													var _v187 = _v179.b;
													var _v188 = _v179.c;
													return _Utils_Tuple2($author$project$OOP$Syntax$VFalse, $author$project$OOP$Syntax$VFalse);
												} else {
													break _v179$4;
												}
											default:
												break _v179$4;
										}
									case 'VFalse':
										if ((_v179.b.$ === 'VTrue') && (_v179.c.$ === 'Or')) {
											var _v189 = _v179.a;
											var _v190 = _v179.b;
											var _v191 = _v179.c;
											return _Utils_Tuple2($author$project$OOP$Syntax$VFalse, $author$project$OOP$Syntax$VFalse);
										} else {
											break _v179$4;
										}
									default:
										break _v179$4;
								}
							}
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VError(''),
								$author$project$OOP$Syntax$VError(''));
						default:
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VError(''),
								$author$project$OOP$Syntax$VError(''));
					}
				case 'VFalse':
					var _v192 = updates.value;
					switch (_v192.$) {
						case 'VFalse':
							return _Utils_Tuple2(v1, v2);
						case 'VTrue':
							var _v193 = _Utils_Tuple3(v1, v2, op);
							_v193$4:
							while (true) {
								switch (_v193.a.$) {
									case 'VTrue':
										if ((_v193.b.$ === 'VFalse') && (_v193.c.$ === 'And')) {
											var _v200 = _v193.a;
											var _v201 = _v193.b;
											var _v202 = _v193.c;
											return _Utils_Tuple2($author$project$OOP$Syntax$VTrue, $author$project$OOP$Syntax$VTrue);
										} else {
											break _v193$4;
										}
									case 'VFalse':
										switch (_v193.b.$) {
											case 'VFalse':
												switch (_v193.c.$) {
													case 'Or':
														var _v194 = _v193.a;
														var _v195 = _v193.b;
														var _v196 = _v193.c;
														return _Utils_Tuple2($author$project$OOP$Syntax$VTrue, $author$project$OOP$Syntax$VFalse);
													case 'And':
														var _v197 = _v193.a;
														var _v198 = _v193.b;
														var _v199 = _v193.c;
														return _Utils_Tuple2($author$project$OOP$Syntax$VTrue, $author$project$OOP$Syntax$VTrue);
													default:
														break _v193$4;
												}
											case 'VTrue':
												if (_v193.c.$ === 'And') {
													var _v203 = _v193.a;
													var _v204 = _v193.b;
													var _v205 = _v193.c;
													return _Utils_Tuple2($author$project$OOP$Syntax$VTrue, $author$project$OOP$Syntax$VTrue);
												} else {
													break _v193$4;
												}
											default:
												break _v193$4;
										}
									default:
										break _v193$4;
								}
							}
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VError(''),
								$author$project$OOP$Syntax$VError(''));
						default:
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VError(''),
								$author$project$OOP$Syntax$VError(''));
					}
				default:
					return _Utils_Tuple2(
						$author$project$OOP$Syntax$VError(''),
						$author$project$OOP$Syntax$VError(''));
			}
		}();
		var newV_1 = _v176.a;
		var newV_2 = _v176.b;
		var _v206 = _Utils_Tuple2(newV_1, newV_2);
		if ((_v206.a.$ === 'VError') && (_v206.b.$ === 'VError')) {
			return _Utils_Tuple3(
				_Utils_update(
					ctx,
					{
						classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
					}),
				$author$project$OOP$Syntax$TError(
					'Wrong Logic Expression : ' + $author$project$OOP$Printer$Term$printTerm(
						A4($author$project$OOP$Syntax$TBPrim, ws, op, t1, t2))),
				scc);
		} else {
			return A9($author$project$OOP$UnEval$operationUpdate, ctx, op, t1, t2, updates, newV_1, newV_2, ws, scc);
		}
	});
var $author$project$OOP$UnEval$operationUpdate = F9(
	function (ctx, op, t1, t2, updates, newV_1, newV_2, ws, scc) {
		var _v169 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
		var state1 = _v169.b;
		var _v170 = A4(
			$author$project$OOP$UnEval$uneval,
			scc,
			_Utils_update(
				ctx,
				{state: state1}),
			t2,
			{state: updates.state, value: newV_2});
		var ctx1_ = _v170.a;
		var t2_ = _v170.b;
		var scc1 = _v170.c;
		var _v171 = A4(
			$author$project$OOP$UnEval$uneval,
			scc1,
			ctx,
			t1,
			{state: ctx1_.state, value: newV_1});
		var ctx_ = _v171.a;
		var t1_ = _v171.b;
		var scc2 = _v171.c;
		var newCT = A2($author$project$OOP$LangUtils$appendCT, ctx1_.classtb, ctx_.classtb);
		var _v172 = A4($author$project$OOP$LangUtils$mergeEnv, ctx_.env, ctx1_.env, ctx.env, newCT);
		var newEnv = _v172.a;
		var newCT_ = _v172.b;
		return _Utils_Tuple3(
			{classtb: newCT_, env: newEnv, state: ctx_.state},
			A4($author$project$OOP$Syntax$TBPrim, ws, op, t1_, t2_),
			scc2);
	});
var $author$project$OOP$UnEval$uneval = F4(
	function (scc, ctx, term, updates) {
		switch (term.$) {
			case 'TInt':
				var ws = term.a;
				var _v45 = updates.value;
				switch (_v45.$) {
					case 'VInt':
						var n = _v45.a;
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							A2($author$project$OOP$Syntax$TInt, ws, n),
							scc);
					case 'VFloat':
						var n = _v45.a;
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							A2($author$project$OOP$Syntax$TFloat, ws, n),
							scc);
					default:
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError(
								'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
							scc);
				}
			case 'TFloat':
				var ws = term.a;
				var _v46 = updates.value;
				switch (_v46.$) {
					case 'VInt':
						var n = _v46.a;
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							A2($author$project$OOP$Syntax$TFloat, ws, n),
							scc);
					case 'VFloat':
						var n = _v46.a;
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							A2($author$project$OOP$Syntax$TFloat, ws, n),
							scc);
					default:
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError(
								'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
							scc);
				}
			case 'TTrue':
				var ws = term.a;
				var _v47 = updates.value;
				switch (_v47.$) {
					case 'VTrue':
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							$author$project$OOP$Syntax$TTrue(ws),
							scc);
					case 'VFalse':
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							$author$project$OOP$Syntax$TFalse(ws),
							scc);
					default:
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError(
								'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
							scc);
				}
			case 'TFalse':
				var ws = term.a;
				var _v48 = updates.value;
				switch (_v48.$) {
					case 'VTrue':
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							$author$project$OOP$Syntax$TTrue(ws),
							scc);
					case 'VFalse':
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							$author$project$OOP$Syntax$TFalse(ws),
							scc);
					default:
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError(
								'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
							scc);
				}
			case 'TChar':
				var ws = term.a;
				var _v49 = updates.value;
				if (_v49.$ === 'VChar') {
					var c = _v49.a;
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
								state: updates.state
							}),
						A2($author$project$OOP$Syntax$TChar, ws, c),
						scc);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TString':
				var ws = term.a;
				var _v50 = updates.value;
				if (_v50.$ === 'VString') {
					var s = _v50.a;
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
								state: updates.state
							}),
						A2($author$project$OOP$Syntax$TString, ws, s),
						scc);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TVar':
				var ws = term.a;
				var s = term.b;
				var env_ = A3($author$project$OOP$Utils$updateValueInDict, s, updates.value, ctx.env);
				return _Utils_Tuple3(
					{
						classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
						env: env_,
						state: updates.state
					},
					A2($author$project$OOP$Syntax$TVar, ws, s),
					scc);
			case 'TLam':
				var ws = term.a;
				var _v51 = updates.value;
				if (_v51.$ === 'VClosure') {
					var p_ = _v51.a;
					var t_ = _v51.b;
					var env_ = _v51.c;
					return _Utils_Tuple3(
						{
							classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
							env: env_,
							state: updates.state
						},
						A3($author$project$OOP$Syntax$TLam, ws, p_, t_),
						scc);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TApp':
				if (term.c.$ === 'TFix') {
					var ws = term.a;
					var t1 = term.b;
					var _v52 = term.c;
					var t2 = _v52.b;
					var _v53 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
					var v1 = _v53.a;
					var state1 = _v53.b;
					if (v1.$ === 'VClosure') {
						var p = v1.a;
						var tf = v1.b;
						var envf = v1.c;
						if (p.$ === 'PVar') {
							var s = p.b;
							var _v56 = A4(
								$author$project$OOP$UnEval$uneval,
								scc,
								_Utils_update(
									ctx,
									{
										env: A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												s,
												$author$project$OOP$Syntax$VFix(t2)),
											envf),
										state: state1
									}),
								tf,
								updates);
							var ctx1 = _v56.a;
							var tf_ = _v56.b;
							var scc1 = _v56.c;
							if (tf_.$ === 'TError') {
								var info = tf_.a;
								return _Utils_Tuple3(
									_Utils_update(
										ctx,
										{
											classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
										}),
									$author$project$OOP$Syntax$TError(info),
									scc);
							} else {
								var ctx1_env = A2(
									$elm$core$List$drop,
									1,
									A2(
										$elm_community$list_extra$List$Extra$dropWhile,
										function (_v63) {
											var s1 = _v63.a;
											return !_Utils_eq(s1, s);
										},
										ctx1.env));
								var newUpdates_1 = {
									state: ctx1.state,
									value: A3($author$project$OOP$Syntax$VClosure, p, tf_, ctx1_env)
								};
								var _v58 = A4($author$project$OOP$UnEval$uneval, scc1, ctx, t1, newUpdates_1);
								var ctx_ = _v58.a;
								var t1_ = _v58.b;
								var scc2 = _v58.c;
								var newCT = A2($author$project$OOP$LangUtils$appendCT, ctx_.classtb, ctx1.classtb);
								if (t1_.$ === 'TError') {
									var info = t1_.a;
									return _Utils_Tuple3(
										_Utils_update(
											ctx,
											{
												classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
											}),
										$author$project$OOP$Syntax$TError(info),
										scc2);
								} else {
									var _v60 = A2($author$project$OOP$Utils$findByName, s, ctx1.env);
									if (_v60.$ === 'Just') {
										switch (_v60.a.$) {
											case 'VClosure':
												var _v61 = _v60.a;
												var fixP = _v61.a;
												var fixT = _v61.b;
												var fixEnv = _v61.c;
												var newUpdates_2 = {
													state: _List_Nil,
													value: A3($author$project$OOP$Syntax$VClosure, fixP, fixT, fixEnv)
												};
												var _v62 = A4(
													$author$project$OOP$UnEval$uneval,
													scc2,
													ctx,
													A2($author$project$OOP$Syntax$TFix, _List_Nil, t2),
													newUpdates_2);
												var t2_ = _v62.b;
												var scc3 = _v62.c;
												return _Utils_Tuple3(
													_Utils_update(
														ctx_,
														{classtb: newCT}),
													A3($author$project$OOP$Syntax$TApp, ws, t1_, t2_),
													scc3);
											case 'VFix':
												var t2_ = _v60.a.a;
												return _Utils_Tuple3(
													_Utils_update(
														ctx_,
														{classtb: newCT}),
													A3(
														$author$project$OOP$Syntax$TApp,
														ws,
														t1_,
														A2($author$project$OOP$Syntax$TFix, _List_Nil, t2_)),
													scc2);
											case 'VError':
												var info = _v60.a.a;
												return _Utils_Tuple3(
													_Utils_update(
														ctx_,
														{classtb: newCT}),
													$author$project$OOP$Syntax$TError(info),
													scc2);
											default:
												var error = _v60.a;
												return _Utils_Tuple3(
													_Utils_update(
														ctx,
														{
															classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
														}),
													$author$project$OOP$Syntax$TError(
														'Fixpoint is Not a Function in Update : ' + $author$project$OOP$Printer$Value$printValue(error)),
													scc2);
										}
									} else {
										return _Utils_Tuple3(
											_Utils_update(
												ctx,
												{
													classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
												}),
											$author$project$OOP$Syntax$TError('No Such Variable : 04.'),
											scc2);
									}
								}
							}
						} else {
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError('Pattern Error in Recursion : 01.'),
								scc);
						}
					} else {
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError('Not Applicable : 02.'),
							scc);
					}
				} else {
					var ws = term.a;
					var t1 = term.b;
					var t2 = term.c;
					var _v64 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
					var v1 = _v64.a;
					var state1 = _v64.b;
					if (v1.$ === 'VClosure') {
						var p = v1.a;
						var tf = v1.b;
						var envf = v1.c;
						var _v66 = A4($author$project$OOP$Eval$eval, ctx.env, state1, ctx.classtb, t2);
						var v2 = _v66.a;
						var state2 = _v66.b;
						var envm = A2($author$project$OOP$LangUtils$match, p, v2);
						var _v67 = A4(
							$author$project$OOP$UnEval$uneval,
							scc,
							{
								classtb: ctx.classtb,
								env: _Utils_ap(envm, envf),
								state: state2
							},
							tf,
							updates);
						var ctx2_ = _v67.a;
						var tf_ = _v67.b;
						var scc1 = _v67.c;
						if (tf_.$ === 'TError') {
							var info = tf_.a;
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError(info),
								scc1);
						} else {
							var newUpdates_2 = {
								state: ctx2_.state,
								value: A2($author$project$OOP$LangUtils$patternSubst, ctx2_.env, p)
							};
							var _v69 = A4(
								$author$project$OOP$UnEval$uneval,
								scc1,
								_Utils_update(
									ctx,
									{state: state1}),
								t2,
								newUpdates_2);
							var ctx1_ = _v69.a;
							var t2_ = _v69.b;
							var scc2 = _v69.c;
							if (t2_.$ === 'TError') {
								var info = t2_.a;
								return _Utils_Tuple3(
									_Utils_update(
										ctx,
										{
											classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
										}),
									$author$project$OOP$Syntax$TError(info),
									scc2);
							} else {
								var newUpdates_1 = {
									state: ctx1_.state,
									value: A3(
										$author$project$OOP$Syntax$VClosure,
										p,
										tf_,
										A2(
											$elm$core$List$drop,
											$elm$core$List$length(envm),
											ctx2_.env))
								};
								var _v71 = A4($author$project$OOP$UnEval$uneval, scc2, ctx, t1, newUpdates_1);
								var ctx_ = _v71.a;
								var t1_ = _v71.b;
								var scc3 = _v71.c;
								if (t1_.$ === 'TError') {
									var info = t1_.a;
									return _Utils_Tuple3(
										_Utils_update(
											ctx,
											{
												classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
											}),
										$author$project$OOP$Syntax$TError(info),
										scc3);
								} else {
									var newCT = A2(
										$author$project$OOP$LangUtils$appendCT,
										ctx2_.classtb,
										A2($author$project$OOP$LangUtils$appendCT, ctx_.classtb, ctx1_.classtb));
									var _v73 = A4($author$project$OOP$LangUtils$mergeEnv, ctx1_.env, ctx_.env, ctx.env, newCT);
									var newEnv = _v73.a;
									var newCT_ = _v73.b;
									return _Utils_Tuple3(
										{classtb: newCT_, env: newEnv, state: ctx_.state},
										A3($author$project$OOP$Syntax$TApp, ws, t1_, t2_),
										scc3);
								}
							}
						}
					} else {
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError('Not Appliable : 03.'),
							scc);
					}
				}
			case 'TLet':
				var ws = term.a;
				var p = term.b;
				var t1 = term.c;
				var t2 = term.d;
				var _v74 = A4(
					$author$project$OOP$UnEval$uneval,
					scc,
					ctx,
					A3(
						$author$project$OOP$Syntax$TApp,
						_List_Nil,
						A3($author$project$OOP$Syntax$TLam, _List_Nil, p, t2),
						t1),
					updates);
				var ctx_ = _v74.a;
				var term_ = _v74.b;
				var scc1 = _v74.c;
				_v75$2:
				while (true) {
					switch (term_.$) {
						case 'TError':
							var info = term_.a;
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError(info),
								scc1);
						case 'TApp':
							if (term_.b.$ === 'TLam') {
								var _v76 = term_.b;
								var p_ = _v76.b;
								var t2_ = _v76.c;
								var t1_ = term_.c;
								return _Utils_Tuple3(
									ctx_,
									A4($author$project$OOP$Syntax$TLet, ws, p_, t1_, t2_),
									scc1);
							} else {
								break _v75$2;
							}
						default:
							break _v75$2;
					}
				}
				return _Utils_Tuple3(
					_Utils_update(
						ctx,
						{
							classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
						}),
					$author$project$OOP$Syntax$TError(
						'Wrong Result When Updating Let Statement : ' + $author$project$OOP$Printer$Term$printTerm(term_)),
					scc1);
			case 'TLetrec':
				var ws = term.a;
				var p = term.b;
				var t1 = term.c;
				var t2 = term.d;
				var _v77 = A4(
					$author$project$OOP$UnEval$uneval,
					scc,
					ctx,
					A3(
						$author$project$OOP$Syntax$TApp,
						_List_Nil,
						A3($author$project$OOP$Syntax$TLam, _List_Nil, p, t2),
						A2(
							$author$project$OOP$Syntax$TFix,
							_List_Nil,
							A3($author$project$OOP$Syntax$TLam, _List_Nil, p, t1))),
					updates);
				var ctx_ = _v77.a;
				var term_ = _v77.b;
				var scc1 = _v77.c;
				_v78$2:
				while (true) {
					switch (term_.$) {
						case 'TError':
							var info = term_.a;
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError(info),
								scc1);
						case 'TApp':
							if (((term_.b.$ === 'TLam') && (term_.c.$ === 'TFix')) && (term_.c.b.$ === 'TLam')) {
								var _v79 = term_.b;
								var p_ = _v79.b;
								var t2_ = _v79.c;
								var _v80 = term_.c;
								var _v81 = _v80.b;
								var t1_ = _v81.c;
								return _Utils_Tuple3(
									ctx_,
									A4($author$project$OOP$Syntax$TLetrec, ws, p_, t1_, t2_),
									scc1);
							} else {
								break _v78$2;
							}
						default:
							break _v78$2;
					}
				}
				return _Utils_Tuple3(
					_Utils_update(
						ctx,
						{
							classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
						}),
					$author$project$OOP$Syntax$TError(
						'Wrong Result When Updating Letrec Statement : ' + $author$project$OOP$Printer$Term$printTerm(term_)),
					scc1);
			case 'TFix':
				var ws = term.a;
				var t = term.b;
				var _v82 = A4(
					$author$project$OOP$UnEval$uneval,
					scc,
					ctx,
					A3(
						$author$project$OOP$Syntax$TApp,
						_List_Nil,
						t,
						A2($author$project$OOP$Syntax$TFix, _List_Nil, t)),
					updates);
				var ctx_ = _v82.a;
				var t_ = _v82.b;
				var scc1 = _v82.c;
				var newT = function () {
					if ((t_.$ === 'TApp') && (t_.c.$ === 'TFix')) {
						var t1 = t_.b;
						var _v84 = t_.c;
						var t2 = _v84.b;
						return (!_Utils_eq(t2, t)) ? t2 : t1;
					} else {
						return $author$project$OOP$Syntax$TError(
							'Wrong Result When Updating Letrec Statement : ' + $author$project$OOP$Printer$Term$printTerm(t_));
					}
				}();
				return _Utils_Tuple3(
					ctx_,
					A2($author$project$OOP$Syntax$TFix, ws, newT),
					scc1);
			case 'TCase':
				if (term.b.$ === 'TVar') {
					var ws1 = term.a;
					var _v85 = term.b;
					var ws2 = _v85.a;
					var s = _v85.b;
					var branches = term.c;
					var res = A2($author$project$OOP$Utils$findByName, s, ctx.env);
					if (res.$ === 'Just') {
						var v = res.a;
						var matchRes = A2($author$project$OOP$LangUtils$matchCase, v, branches);
						var _v87 = A4(
							$author$project$OOP$UnEval$uneval,
							scc,
							_Utils_update(
								ctx,
								{
									env: _Utils_ap(matchRes.envm, ctx.env)
								}),
							matchRes.ti,
							updates);
						var ctx_ = _v87.a;
						var ti_ = _v87.b;
						var scc1 = _v87.c;
						if (ti_.$ === 'TError') {
							var info = ti_.a;
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError(info),
								scc1);
						} else {
							var newV = A2($author$project$OOP$LangUtils$patternSubst, ctx_.env, matchRes.pi);
							var len = $elm$core$List$length(matchRes.envm);
							var env_ = A2(
								$elm$core$List$cons,
								_Utils_Tuple2(s, newV),
								A2($elm$core$List$drop, len + 1, ctx_.env));
							var branches_ = A3($author$project$OOP$LangUtils$updateBranch, branches, matchRes.choice, ti_);
							return _Utils_Tuple3(
								_Utils_update(
									ctx_,
									{env: env_}),
								A3(
									$author$project$OOP$Syntax$TCase,
									ws1,
									A2($author$project$OOP$Syntax$TVar, ws2, s),
									branches_),
								scc1);
						}
					} else {
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError('No Such Variable : 03.'),
							scc);
					}
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Source Expression Error : ' + $author$project$OOP$Printer$Term$printTerm(term)),
						scc);
				}
			case 'TCons':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				var _v89 = updates.value;
				switch (_v89.$) {
					case 'VCons':
						var v1 = _v89.a;
						var v2 = _v89.b;
						var _v90 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
						var state1 = _v90.b;
						var _v91 = A4(
							$author$project$OOP$UnEval$uneval,
							scc,
							_Utils_update(
								ctx,
								{state: state1}),
							t2,
							{state: updates.state, value: v2});
						var ctx1_ = _v91.a;
						var t2_ = _v91.b;
						var scc1 = _v91.c;
						var _v92 = A4(
							$author$project$OOP$UnEval$uneval,
							scc1,
							ctx,
							t1,
							{state: ctx1_.state, value: v1});
						var ctx_ = _v92.a;
						var t1_ = _v92.b;
						var scc2 = _v92.c;
						var newCT = A2($author$project$OOP$LangUtils$appendCT, ctx1_.classtb, ctx_.classtb);
						var _v93 = A4($author$project$OOP$LangUtils$mergeEnv, ctx1_.env, ctx_.env, ctx.env, newCT);
						var newEnv = _v93.a;
						var newCT_ = _v93.b;
						return _Utils_Tuple3(
							{classtb: newCT_, env: newEnv, state: ctx_.state},
							A3($author$project$OOP$Syntax$TCons, ws, t1_, t2_),
							scc2);
					case 'VNil':
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							$author$project$OOP$Syntax$TNil(ws),
							scc);
					default:
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError(
								'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
							scc);
				}
			case 'TList':
				var _v94 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, term);
				var origin_val = _v94.a;
				var _v95 = A2($author$project$OOP$LangUtils$diff, origin_val, updates.value);
				var delta = _v95.b;
				return A5($author$project$OOP$UnEval$deltaUpdate, term, delta, ctx, updates.state, scc);
			case 'TNil':
				var ws = term.a;
				var _v96 = updates.value;
				switch (_v96.$) {
					case 'VNil':
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							$author$project$OOP$Syntax$TNil(ws),
							scc);
					case 'VCons':
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
									state: updates.state
								}),
							A2($author$project$OOP$LangUtils$valueToTerm, updates.value, ws),
							scc);
					default:
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError(
								'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
							scc);
				}
			case 'TEmpList':
				var _v97 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, term);
				var origin_val = _v97.a;
				var _v98 = A2($author$project$OOP$LangUtils$diff, origin_val, updates.value);
				var delta = _v98.b;
				return A5($author$project$OOP$UnEval$deltaUpdate, term, delta, ctx, updates.state, scc);
			case 'TTuple2':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				var _v99 = updates.value;
				if (_v99.$ === 'VTuple2') {
					var v1 = _v99.a;
					var v2 = _v99.b;
					var _v100 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
					var state1 = _v100.b;
					var _v101 = A4(
						$author$project$OOP$UnEval$uneval,
						scc,
						_Utils_update(
							ctx,
							{state: state1}),
						t2,
						{state: updates.state, value: v2});
					var ctx1_ = _v101.a;
					var t2_ = _v101.b;
					var scc1 = _v101.c;
					var _v102 = A4(
						$author$project$OOP$UnEval$uneval,
						scc1,
						ctx,
						t1,
						{state: ctx1_.state, value: v1});
					var ctx_ = _v102.a;
					var t1_ = _v102.b;
					var scc2 = _v102.c;
					var newCT = A2($author$project$OOP$LangUtils$appendCT, ctx1_.classtb, ctx_.classtb);
					var _v103 = A4($author$project$OOP$LangUtils$mergeEnv, ctx1_.env, ctx_.env, ctx.env, newCT);
					var newEnv = _v103.a;
					var newCT_ = _v103.b;
					return _Utils_Tuple3(
						{classtb: newCT_, env: newEnv, state: ctx_.state},
						A3($author$project$OOP$Syntax$TTuple2, ws, t1_, t2_),
						scc2);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TTuple3':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				var t3 = term.d;
				var _v104 = updates.value;
				if (_v104.$ === 'VTuple3') {
					var v1 = _v104.a;
					var v2 = _v104.b;
					var v3 = _v104.c;
					var _v105 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
					var state1 = _v105.b;
					var _v106 = A4($author$project$OOP$Eval$eval, ctx.env, state1, ctx.classtb, t2);
					var state2 = _v106.b;
					var _v107 = A4(
						$author$project$OOP$UnEval$uneval,
						scc,
						_Utils_update(
							ctx,
							{state: state2}),
						t3,
						{state: updates.state, value: v3});
					var ctx2_ = _v107.a;
					var t3_ = _v107.b;
					var scc1 = _v107.c;
					var _v108 = A4(
						$author$project$OOP$UnEval$uneval,
						scc1,
						_Utils_update(
							ctx,
							{state: state1}),
						t2,
						{state: ctx2_.state, value: v2});
					var ctx1_ = _v108.a;
					var t2_ = _v108.b;
					var scc2 = _v108.c;
					var _v109 = A4(
						$author$project$OOP$UnEval$uneval,
						scc2,
						ctx,
						t1,
						{state: ctx1_.state, value: v1});
					var ctx_ = _v109.a;
					var t1_ = _v109.b;
					var scc3 = _v109.c;
					var newCT = A2(
						$author$project$OOP$LangUtils$appendCT,
						ctx_.classtb,
						A2($author$project$OOP$LangUtils$appendCT, ctx2_.classtb, ctx1_.classtb));
					var _v110 = A4($author$project$OOP$LangUtils$mergeEnv, ctx1_.env, ctx_.env, ctx.env, newCT);
					var newEnv1 = _v110.a;
					var newCT1 = _v110.b;
					var _v111 = A4($author$project$OOP$LangUtils$mergeEnv, ctx2_.env, newEnv1, ctx.env, newCT1);
					var newEnv2 = _v111.a;
					var newCT2 = _v111.b;
					return _Utils_Tuple3(
						{classtb: newCT2, env: newEnv2, state: ctx_.state},
						A4($author$project$OOP$Syntax$TTuple3, ws, t1_, t2_, t3_),
						scc3);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TBPrim':
				var ws = term.a;
				var op = term.b;
				var t1 = term.c;
				var t2 = term.d;
				var logic_ = A6($author$project$OOP$UnEval$logic, scc, ctx, t1, t2, updates, ws);
				var comp_ = A6($author$project$OOP$UnEval$comp, scc, ctx, t1, t2, updates, ws);
				var arith_ = A6($author$project$OOP$UnEval$arith, scc, ctx, t1, t2, updates, ws);
				switch (op.$) {
					case 'And':
						return logic_($author$project$OOP$Syntax$And);
					case 'Or':
						return logic_($author$project$OOP$Syntax$Or);
					case 'Add':
						return arith_($author$project$OOP$Syntax$Add);
					case 'Sub':
						return arith_($author$project$OOP$Syntax$Sub);
					case 'Mul':
						return arith_($author$project$OOP$Syntax$Mul);
					case 'Div':
						return arith_($author$project$OOP$Syntax$Div);
					case 'RDiv':
						return arith_($author$project$OOP$Syntax$RDiv);
					case 'Cat':
						return arith_($author$project$OOP$Syntax$Cat);
					default:
						return comp_(op);
				}
			case 'TUPrim':
				var ws = term.a;
				var op = term.b;
				var t = term.c;
				return A6($author$project$OOP$UnEval$unevalUnaryOperation, ctx, op, t, updates, ws, scc);
			case 'TParens':
				var ws = term.a;
				var t = term.b;
				var _v113 = A4($author$project$OOP$UnEval$uneval, scc, ctx, t, updates);
				var ctx_ = _v113.a;
				var t_ = _v113.b;
				var scc1 = _v113.c;
				return _Utils_Tuple3(
					ctx_,
					A2($author$project$OOP$Syntax$TParens, ws, t_),
					scc1);
			case 'TRef':
				var ws = term.a;
				var t = term.b;
				var _v114 = updates.value;
				if (_v114.$ === 'VLoc') {
					var n = _v114.a;
					var _v115 = A2($author$project$Utils$nth, n, updates.state);
					if (_v115.$ === 'Just') {
						var newV = _v115.a;
						var _v116 = $elm_community$list_extra$List$Extra$unconsLast(updates.state);
						if (_v116.$ === 'Just') {
							var _v117 = _v116.a;
							var state1 = _v117.b;
							var _v118 = A4(
								$author$project$OOP$UnEval$uneval,
								scc,
								ctx,
								t,
								{state: state1, value: newV});
							var ctx_ = _v118.a;
							var t_ = _v118.b;
							var scc1 = _v118.c;
							return _Utils_Tuple3(
								ctx_,
								A2($author$project$OOP$Syntax$TRef, ws, t_),
								scc1);
						} else {
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError('Index Out of Range : 03.'),
								scc);
						}
					} else {
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError('Index Out Of Range : 04.'),
							scc);
					}
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TDeRef':
				var ws = term.a;
				var t = term.b;
				var _v119 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t);
				var v1 = _v119.a;
				if (v1.$ === 'VLoc') {
					var n = v1.a;
					var _v121 = A2($author$project$Utils$nth, n, ctx.state);
					if (_v121.$ === 'Just') {
						var v2 = _v121.a;
						if (_Utils_eq(v2, updates.value)) {
							var _v122 = A4(
								$author$project$OOP$UnEval$uneval,
								scc,
								ctx,
								t,
								{
									state: updates.state,
									value: $author$project$OOP$Syntax$VLoc(n)
								});
							var ctx_ = _v122.a;
							var t_ = _v122.b;
							var scc1 = _v122.c;
							return _Utils_Tuple3(
								ctx_,
								A2($author$project$OOP$Syntax$TDeRef, ws, t_),
								scc1);
						} else {
							var newState = A3($author$project$OOP$Utils$replace, n, updates.value, updates.state);
							var _v123 = A4(
								$author$project$OOP$UnEval$uneval,
								scc,
								ctx,
								t,
								{
									state: newState,
									value: $author$project$OOP$Syntax$VLoc(n)
								});
							var ctx_ = _v123.a;
							var t_ = _v123.b;
							var scc1 = _v123.c;
							return _Utils_Tuple3(
								ctx_,
								A2($author$project$OOP$Syntax$TDeRef, ws, t_),
								scc1);
						}
					} else {
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError('Error : 35.'),
							scc);
					}
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError('Error : 05.'),
						scc);
				}
			case 'TAssign':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				var _v124 = updates.value;
				if (_v124.$ === 'VUnit') {
					var _v125 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
					var v1 = _v125.a;
					var state1 = _v125.b;
					var _v126 = A4($author$project$OOP$Eval$eval, ctx.env, state1, ctx.classtb, t2);
					var state2 = _v126.b;
					if (v1.$ === 'VLoc') {
						var n = v1.a;
						var _v128 = A2($author$project$Utils$nth, n, updates.state);
						if (_v128.$ === 'Just') {
							var newV = _v128.a;
							var _v129 = A2($author$project$Utils$nth, n, state2);
							if (_v129.$ === 'Just') {
								var oriV = _v129.a;
								var _v130 = A4(
									$author$project$OOP$UnEval$uneval,
									scc,
									_Utils_update(
										ctx,
										{state: state1}),
									t2,
									{
										state: A3($author$project$OOP$Utils$replace, n, oriV, updates.state),
										value: newV
									});
								var ctx1_ = _v130.a;
								var t2_ = _v130.b;
								var scc1 = _v130.c;
								var _v131 = A4(
									$author$project$OOP$UnEval$uneval,
									scc1,
									ctx,
									t1,
									{
										state: ctx1_.state,
										value: $author$project$OOP$Syntax$VLoc(n)
									});
								var ctx_ = _v131.a;
								var t1_ = _v131.b;
								var scc2 = _v131.c;
								var newCT = A2($author$project$OOP$LangUtils$appendCT, ctx1_.classtb, ctx_.classtb);
								var _v132 = A4($author$project$OOP$LangUtils$mergeEnv, ctx1_.env, ctx_.env, ctx.env, newCT);
								var newEnv = _v132.a;
								var newCT_ = _v132.b;
								return _Utils_Tuple3(
									{classtb: newCT_, env: newEnv, state: ctx_.state},
									A3($author$project$OOP$Syntax$TAssign, ws, t1_, t2_),
									scc2);
							} else {
								return _Utils_Tuple3(
									_Utils_update(
										ctx,
										{
											classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
										}),
									$author$project$OOP$Syntax$TError('Index Out Of Range : 06.'),
									scc);
							}
						} else {
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError('Index Out Of Range : 07.'),
								scc);
						}
					} else {
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError('Error : 15.'),
							scc);
					}
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TUnit':
				var ws = term.a;
				var _v133 = updates.value;
				if (_v133.$ === 'VUnit') {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
								state: updates.state
							}),
						$author$project$OOP$Syntax$TUnit(ws),
						scc);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TField':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				if (t2.$ === 'TVar') {
					var f = t2.b;
					var _v135 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
					var v1 = _v135.a;
					if (v1.$ === 'VNew') {
						var _class = v1.a;
						var args = v1.b;
						var fields = A2($author$project$OOP$LangUtils$getFields, _class, ctx.classtb);
						var index = A2(
							$author$project$OOP$LangUtils$findFieldsIndex,
							f,
							A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, fields));
						var args_ = A3($author$project$OOP$LangUtils$vreplace, index, updates.value, args);
						if (args_.$ === 'VError') {
							var info = args_.a;
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError(info),
								scc);
						} else {
							var _v138 = A4(
								$author$project$OOP$UnEval$uneval,
								scc,
								ctx,
								t1,
								{
									state: updates.state,
									value: A2($author$project$OOP$Syntax$VNew, _class, args_)
								});
							var ctx_ = _v138.a;
							var t1_ = _v138.b;
							var scc1 = _v138.c;
							return _Utils_Tuple3(
								ctx_,
								A3($author$project$OOP$Syntax$TField, ws, t1_, t2),
								scc1);
						}
					} else {
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError('Not an Object : 03.'),
							scc);
					}
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError('Not a Variable : 03.'),
						scc);
				}
			case 'TInvk':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				if (t2.$ === 'TVar') {
					var m = t2.b;
					var _v140 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
					var v1 = _v140.a;
					if (v1.$ === 'VNew') {
						var _class = v1.a;
						var res = A3($author$project$OOP$LangUtils$findMethod, m, _class, ctx.classtb);
						if (res.$ === 'Just') {
							var _v143 = updates.value;
							if (_v143.$ === 'VClosure') {
								var t_ = _v143.b;
								var env_ = _v143.c;
								if ((env_.b && (env_.a.a === 'this')) && (env_.a.b.$ === 'VNew')) {
									var _v145 = env_.a;
									var _v146 = _v145.b;
									var c_ = _v146.a;
									var args = _v146.b;
									var _v147 = A5($author$project$OOP$LangUtils$subclassing, m, c_, t_, ctx.classtb, scc);
									var newCT = _v147.a;
									var subClass = _v147.b;
									var scc1 = _v147.c;
									var _v148 = A4(
										$author$project$OOP$UnEval$uneval,
										scc1,
										ctx,
										t1,
										{
											state: updates.state,
											value: A2($author$project$OOP$Syntax$VNew, subClass, args)
										});
									var ctx_ = _v148.a;
									var t1_ = _v148.b;
									var scc2 = _v148.c;
									return _Utils_Tuple3(
										_Utils_update(
											ctx_,
											{
												classtb: A2($author$project$OOP$LangUtils$appendCT, ctx_.classtb, newCT)
											}),
										A3($author$project$OOP$Syntax$TInvk, ws, t1_, t2),
										scc2);
								} else {
									return _Utils_Tuple3(
										_Utils_update(
											ctx,
											{
												classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
											}),
										$author$project$OOP$Syntax$TError('Error : 06.'),
										scc);
								}
							} else {
								return _Utils_Tuple3(
									_Utils_update(
										ctx,
										{
											classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
										}),
									$author$project$OOP$Syntax$TError(
										'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
									scc);
							}
						} else {
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError('No Such Method : 02.'),
								scc);
						}
					} else {
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError('Not an Object : 04.'),
							scc);
					}
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError('Not a Variable : 04.'),
						scc);
				}
			case 'TNew':
				var ws = term.a;
				var args = term.c;
				var _v149 = updates.value;
				if (_v149.$ === 'VNew') {
					var class_ = _v149.a;
					var vargs_ = _v149.b;
					var _v150 = A4(
						$author$project$OOP$UnEval$uneval,
						scc,
						ctx,
						args,
						{state: updates.state, value: vargs_});
					var ctx_ = _v150.a;
					var args_ = _v150.b;
					var scc1 = _v150.c;
					return _Utils_Tuple3(
						ctx_,
						A3($author$project$OOP$Syntax$TNew, ws, class_, args_),
						scc1);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TError':
				var info = term.a;
				return _Utils_Tuple3(
					_Utils_update(
						ctx,
						{
							classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
						}),
					$author$project$OOP$Syntax$TError(info),
					scc);
			case 'TSeq':
				var ws = term.a;
				var t1 = term.b;
				var t2 = term.c;
				var _v151 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
				var v1 = _v151.a;
				var state1 = _v151.b;
				var _v152 = A4(
					$author$project$OOP$UnEval$uneval,
					scc,
					_Utils_update(
						ctx,
						{state: state1}),
					t2,
					updates);
				var ctx1_ = _v152.a;
				var t2_ = _v152.b;
				var scc1 = _v152.c;
				var _v153 = A4(
					$author$project$OOP$UnEval$uneval,
					scc1,
					ctx,
					t1,
					{state: ctx1_.state, value: v1});
				var ctx_ = _v153.a;
				var t1_ = _v153.b;
				var scc2 = _v153.c;
				var newCT = A2($author$project$OOP$LangUtils$appendCT, ctx1_.classtb, ctx_.classtb);
				var _v154 = A4($author$project$OOP$LangUtils$mergeEnv, ctx1_.env, ctx_.env, ctx.env, newCT);
				var newEnv = _v154.a;
				var newCT_ = _v154.b;
				return _Utils_Tuple3(
					{classtb: newCT_, env: newEnv, state: ctx_.state},
					A3($author$project$OOP$Syntax$TSeq, ws, t1_, t2_),
					scc2);
			case 'THtml':
				var ws = term.a;
				var s = term.b;
				var t1 = term.c;
				var t2 = term.d;
				var t3 = term.e;
				var _v155 = updates.value;
				if (_v155.$ === 'VHtml') {
					var v1 = _v155.b;
					var v2 = _v155.c;
					var v3 = _v155.d;
					var _v156 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t1);
					var state1 = _v156.b;
					var _v157 = A4($author$project$OOP$Eval$eval, ctx.env, state1, ctx.classtb, t2);
					var state2 = _v157.b;
					var _v158 = A4(
						$author$project$OOP$UnEval$uneval,
						scc,
						_Utils_update(
							ctx,
							{state: state2}),
						t3,
						{state: updates.state, value: v3});
					var ctx2_ = _v158.a;
					var t3_ = _v158.b;
					var scc1 = _v158.c;
					var _v159 = A4(
						$author$project$OOP$UnEval$uneval,
						scc1,
						_Utils_update(
							ctx,
							{state: state1}),
						t2,
						{state: ctx2_.state, value: v2});
					var ctx1_ = _v159.a;
					var t2_ = _v159.b;
					var scc2 = _v159.c;
					var _v160 = A4(
						$author$project$OOP$UnEval$uneval,
						scc2,
						ctx,
						t1,
						{state: ctx1_.state, value: v1});
					var ctx_ = _v160.a;
					var t1_ = _v160.b;
					var scc3 = _v160.c;
					var newCT = A2(
						$author$project$OOP$LangUtils$appendCT,
						ctx_.classtb,
						A2($author$project$OOP$LangUtils$appendCT, ctx2_.classtb, ctx1_.classtb));
					var _v161 = A4($author$project$OOP$LangUtils$mergeEnv, ctx1_.env, ctx_.env, ctx.env, newCT);
					var newEnv1 = _v161.a;
					var newCT1 = _v161.b;
					var _v162 = A4($author$project$OOP$LangUtils$mergeEnv, ctx2_.env, newEnv1, ctx.env, newCT1);
					var newEnv2 = _v162.a;
					var newCT2 = _v162.b;
					return _Utils_Tuple3(
						{classtb: newCT2, env: newEnv2, state: ctx_.state},
						A5($author$project$OOP$Syntax$THtml, ws, s, t1_, t2_, t3_),
						scc3);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TToStr':
				var ws = term.a;
				var t = term.b;
				var _v163 = updates.value;
				if (_v163.$ === 'VString') {
					var parseRes = $author$project$OOP$Parser$Value$parse(
						$author$project$OOP$Printer$Value$printString(updates.value));
					if (parseRes.$ === 'Ok') {
						var newV = parseRes.a;
						var _v165 = A4(
							$author$project$OOP$UnEval$uneval,
							scc,
							ctx,
							t,
							{state: updates.state, value: newV});
						var ctx_ = _v165.a;
						var t_ = _v165.b;
						var scc1 = _v165.c;
						return _Utils_Tuple3(
							ctx_,
							A2($author$project$OOP$Syntax$TToStr, ws, t_),
							scc1);
					} else {
						var info = parseRes.a;
						return _Utils_Tuple3(
							_Utils_update(
								ctx,
								{
									classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
								}),
							$author$project$OOP$Syntax$TError(
								$elm$core$Debug$toString(info)),
							scc);
					}
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
			case 'TMap':
				var _v166 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, term);
				var origin_val = _v166.a;
				var _v167 = A2($author$project$OOP$LangUtils$diff, origin_val, updates.value);
				var delta = _v167.b;
				return A5($author$project$OOP$UnEval$updateMap, scc, term, delta, ctx, updates.state);
			default:
				var ws = term.a;
				var _v168 = updates.value;
				if (_v168.$ === 'VLoc') {
					var n_ = _v168.a;
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
								state: updates.state
							}),
						A2($author$project$OOP$Syntax$TLoc, ws, n_),
						scc);
				} else {
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError(
							'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(term)))),
						scc);
				}
		}
	});
var $author$project$OOP$UnEval$unevalUnaryOperation = F6(
	function (ctx, op, t, updates, ws, scc) {
		var _v30 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, t);
		var v = _v30.a;
		if (op.$ === 'Not') {
			switch (v.$) {
				case 'VTrue':
					var _v33 = updates.value;
					switch (_v33.$) {
						case 'VTrue':
							var _v34 = A4(
								$author$project$OOP$UnEval$uneval,
								scc,
								ctx,
								t,
								{state: updates.state, value: $author$project$OOP$Syntax$VFalse});
							var ctx_ = _v34.a;
							var t_ = _v34.b;
							var scc1 = _v34.c;
							return _Utils_Tuple3(
								ctx_,
								A3($author$project$OOP$Syntax$TUPrim, ws, op, t_),
								scc1);
						case 'VFalse':
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
										state: updates.state
									}),
								A3($author$project$OOP$Syntax$TUPrim, ws, op, t),
								scc);
						default:
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError(
									'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(
										A3($author$project$OOP$Syntax$TUPrim, ws, op, t))))),
								scc);
					}
				case 'VFalse':
					var _v35 = updates.value;
					switch (_v35.$) {
						case 'VTrue':
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
										state: updates.state
									}),
								A3($author$project$OOP$Syntax$TUPrim, ws, op, t),
								scc);
						case 'VFalse':
							var _v36 = A4(
								$author$project$OOP$UnEval$uneval,
								scc,
								ctx,
								t,
								{state: updates.state, value: $author$project$OOP$Syntax$VTrue});
							var ctx_ = _v36.a;
							var t_ = _v36.b;
							var scc1 = _v36.c;
							return _Utils_Tuple3(
								ctx_,
								A3($author$project$OOP$Syntax$TUPrim, ws, op, t_),
								scc1);
						default:
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError(
									'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(
										A3($author$project$OOP$Syntax$TUPrim, ws, op, t))))),
								scc);
					}
				default:
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError('Error : 03.'),
						scc);
			}
		} else {
			switch (v.$) {
				case 'VInt':
					var n = v.a;
					var _v38 = updates.value;
					switch (_v38.$) {
						case 'VInt':
							var n_ = _v38.a;
							if (_Utils_eq(n, -n_)) {
								return _Utils_Tuple3(
									_Utils_update(
										ctx,
										{
											classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
											state: updates.state
										}),
									A3($author$project$OOP$Syntax$TUPrim, ws, op, t),
									scc);
							} else {
								var _v39 = A4(
									$author$project$OOP$UnEval$uneval,
									scc,
									ctx,
									t,
									{
										state: updates.state,
										value: $author$project$OOP$Syntax$VInt(-n_)
									});
								var ctx_ = _v39.a;
								var t_ = _v39.b;
								var scc1 = _v39.c;
								return _Utils_Tuple3(
									ctx_,
									A3($author$project$OOP$Syntax$TUPrim, ws, op, t_),
									scc1);
							}
						case 'VFloat':
							var n_ = _v38.a;
							if (_Utils_eq(n, -n_)) {
								return _Utils_Tuple3(
									_Utils_update(
										ctx,
										{
											classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
											state: updates.state
										}),
									A3($author$project$OOP$Syntax$TUPrim, ws, op, t),
									scc);
							} else {
								var _v40 = A4(
									$author$project$OOP$UnEval$uneval,
									scc,
									ctx,
									t,
									{
										state: updates.state,
										value: $author$project$OOP$Syntax$VFloat(-n_)
									});
								var ctx_ = _v40.a;
								var t_ = _v40.b;
								var scc1 = _v40.c;
								return _Utils_Tuple3(
									ctx_,
									A3($author$project$OOP$Syntax$TUPrim, ws, op, t_),
									scc1);
							}
						default:
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError(
									'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(
										A3($author$project$OOP$Syntax$TUPrim, ws, op, t))))),
								scc);
					}
				case 'VFloat':
					var n = v.a;
					var _v41 = updates.value;
					switch (_v41.$) {
						case 'VInt':
							var n_ = _v41.a;
							if (_Utils_eq(n, -n_)) {
								return _Utils_Tuple3(
									_Utils_update(
										ctx,
										{
											classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
											state: updates.state
										}),
									A3($author$project$OOP$Syntax$TUPrim, ws, op, t),
									scc);
							} else {
								var _v42 = A4(
									$author$project$OOP$UnEval$uneval,
									scc,
									ctx,
									t,
									{
										state: updates.state,
										value: $author$project$OOP$Syntax$VFloat(-n_)
									});
								var ctx_ = _v42.a;
								var t_ = _v42.b;
								var scc1 = _v42.c;
								return _Utils_Tuple3(
									ctx_,
									A3($author$project$OOP$Syntax$TUPrim, ws, op, t_),
									scc1);
							}
						case 'VFloat':
							var n_ = _v41.a;
							if (_Utils_eq(n, -n_)) {
								return _Utils_Tuple3(
									_Utils_update(
										ctx,
										{
											classtb: _Utils_Tuple2(_List_Nil, _List_Nil),
											state: updates.state
										}),
									A3($author$project$OOP$Syntax$TUPrim, ws, op, t),
									scc);
							} else {
								var _v43 = A4(
									$author$project$OOP$UnEval$uneval,
									scc,
									ctx,
									t,
									{
										state: updates.state,
										value: $author$project$OOP$Syntax$VFloat(-n_)
									});
								var ctx_ = _v43.a;
								var t_ = _v43.b;
								var scc1 = _v43.c;
								return _Utils_Tuple3(
									ctx_,
									A3($author$project$OOP$Syntax$TUPrim, ws, op, t_),
									scc1);
							}
						default:
							return _Utils_Tuple3(
								_Utils_update(
									ctx,
									{
										classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
									}),
								$author$project$OOP$Syntax$TError(
									'Update Error : ' + ($author$project$OOP$Printer$Value$printValue(updates.value) + ('->' + $author$project$OOP$Printer$Term$printTerm(
										A3($author$project$OOP$Syntax$TUPrim, ws, op, t))))),
								scc);
					}
				default:
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError('Error : 04.'),
						scc);
			}
		}
	});
var $author$project$OOP$UnEval$updateMap = F5(
	function (scc, term, delta, ctx, newState) {
		if (term.$ === 'TMap') {
			var ws = term.a;
			var d = term.b;
			var f = term.c;
			var ls = term.d;
			var _v25 = A4($author$project$OOP$Eval$eval, ctx.env, ctx.state, ctx.classtb, f);
			var v1 = _v25.a;
			var state1 = _v25.b;
			var _v26 = A4($author$project$OOP$Eval$eval, ctx.env, state1, ctx.classtb, ls);
			var v2 = _v26.a;
			switch (v2.$) {
				case 'VCons':
					var _v28 = $author$project$OOP$UnEval$updateMapHelper(v1)(v2)(delta)(ctx)(newState)(state1)(f)(ls)(d)(scc);
					var ctx_ = _v28.a;
					var t_ = _v28.b;
					var scc1 = _v28.c;
					return _Utils_Tuple3(
						ctx_,
						A4($author$project$OOP$Syntax$TMap, ws, d, f, t_),
						scc1);
				case 'VNil':
					var _v29 = $author$project$OOP$UnEval$updateMapHelper(v1)(v2)(delta)(ctx)(newState)(state1)(f)(ls)(d)(scc);
					var ctx_ = _v29.a;
					var t_ = _v29.b;
					var scc1 = _v29.c;
					return _Utils_Tuple3(
						ctx_,
						A4($author$project$OOP$Syntax$TMap, ws, d, f, t_),
						scc1);
				default:
					return _Utils_Tuple3(
						_Utils_update(
							ctx,
							{
								classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
							}),
						$author$project$OOP$Syntax$TError('The third argument to map_ must be a list : 02.'),
						scc);
			}
		} else {
			return _Utils_Tuple3(
				_Utils_update(
					ctx,
					{
						classtb: _Utils_Tuple2(_List_Nil, _List_Nil)
					}),
				$author$project$OOP$Syntax$TError('Error : 26.'),
				scc);
		}
	});
var $author$project$OOP$UnEval$updateMapHelper = function (v1) {
	return function (v2) {
		return function (delta) {
			return function (ctx) {
				return function (newState) {
					return function (state1) {
						return function (f) {
							return function (ls) {
								return function (d) {
									return function (scc) {
										var _v20 = A7($author$project$OOP$UnEval$updateMap_, f, v2, delta, ctx, d, newState, scc);
										var v2_ = _v20.a;
										var scc1 = _v20.b;
										var _v21 = A4(
											$author$project$OOP$UnEval$uneval,
											scc1,
											_Utils_update(
												ctx,
												{state: state1}),
											ls,
											{state: newState, value: v2_});
										var ctx1_ = _v21.a;
										var ls_ = _v21.b;
										var scc2 = _v21.c;
										var _v22 = A4(
											$author$project$OOP$UnEval$uneval,
											scc2,
											ctx,
											f,
											{state: ctx1_.state, value: v1});
										var ctx_ = _v22.a;
										var scc3 = _v22.c;
										var newCT = A2($author$project$OOP$LangUtils$appendCT, ctx1_.classtb, ctx_.classtb);
										var _v23 = A4($author$project$OOP$LangUtils$mergeEnv, ctx1_.env, ctx_.env, ctx.env, newCT);
										var newEnv = _v23.a;
										var newCT_ = _v23.b;
										return _Utils_Tuple3(
											_Utils_update(
												ctx_,
												{classtb: newCT_, env: newEnv}),
											ls_,
											scc3);
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
var $author$project$OOP$UnEval$updateMap_ = F7(
	function (f, v, delta, ctx, _default, newState, scc) {
		updateMap_:
		while (true) {
			switch (v.$) {
				case 'VCons':
					var v2 = v.b;
					if (delta.b) {
						switch (delta.a.$) {
							case 'Keep':
								var v_ = delta.a.a;
								var resDelta = delta.b;
								var _v2 = A7($author$project$OOP$UnEval$updateMap_, f, v2, resDelta, ctx, _default, newState, scc);
								var v2_ = _v2.a;
								var scc1 = _v2.b;
								var _v3 = A4(
									$author$project$OOP$UnEval$uneval,
									scc1,
									ctx,
									A3($author$project$OOP$Syntax$TApp, _List_Nil, f, _default),
									{state: newState, value: v_});
								var res = _v3.b;
								var scc2 = _v3.c;
								if (res.$ === 'TApp') {
									var default_ = res.c;
									var _v5 = A4(
										$author$project$OOP$Eval$eval,
										_List_Nil,
										_List_Nil,
										_Utils_Tuple2(_List_Nil, _List_Nil),
										default_);
									var v1_ = _v5.a;
									return _Utils_Tuple2(
										A2($author$project$OOP$Syntax$VCons, v1_, v2_),
										scc2);
								} else {
									return _Utils_Tuple2(
										$author$project$OOP$Syntax$VError('Error : 32.'),
										scc2);
								}
							case 'Delete':
								var _v6 = delta.a;
								var resDelta = delta.b;
								var $temp$f = f,
									$temp$v = v2,
									$temp$delta = resDelta,
									$temp$ctx = ctx,
									$temp$default = _default,
									$temp$newState = newState,
									$temp$scc = scc;
								f = $temp$f;
								v = $temp$v;
								delta = $temp$delta;
								ctx = $temp$ctx;
								_default = $temp$default;
								newState = $temp$newState;
								scc = $temp$scc;
								continue updateMap_;
							case 'Insert':
								var v_ = delta.a.a;
								var resDelta = delta.b;
								var _v7 = A7($author$project$OOP$UnEval$updateMap_, f, v, resDelta, ctx, _default, newState, scc);
								var v2_ = _v7.a;
								var scc1 = _v7.b;
								var _v8 = A4(
									$author$project$OOP$UnEval$uneval,
									scc1,
									ctx,
									A3($author$project$OOP$Syntax$TApp, _List_Nil, f, _default),
									{state: newState, value: v_});
								var res = _v8.b;
								var scc2 = _v8.c;
								if (res.$ === 'TApp') {
									var default_ = res.c;
									var _v10 = A4(
										$author$project$OOP$Eval$eval,
										_List_Nil,
										_List_Nil,
										_Utils_Tuple2(_List_Nil, _List_Nil),
										default_);
									var v1_ = _v10.a;
									return _Utils_Tuple2(
										A2($author$project$OOP$Syntax$VCons, v1_, v2_),
										scc2);
								} else {
									return _Utils_Tuple2(
										$author$project$OOP$Syntax$VError('Error : 28.'),
										scc2);
								}
							default:
								var v_ = delta.a.a;
								var resDelta = delta.b;
								var _v11 = A7($author$project$OOP$UnEval$updateMap_, f, v2, resDelta, ctx, _default, newState, scc);
								var v2_ = _v11.a;
								var scc1 = _v11.b;
								var _v12 = A4(
									$author$project$OOP$UnEval$uneval,
									scc1,
									ctx,
									A3($author$project$OOP$Syntax$TApp, _List_Nil, f, _default),
									{state: newState, value: v_});
								var res = _v12.b;
								var scc2 = _v12.c;
								if (res.$ === 'TApp') {
									var default_ = res.c;
									var _v14 = A4(
										$author$project$OOP$Eval$eval,
										_List_Nil,
										_List_Nil,
										_Utils_Tuple2(_List_Nil, _List_Nil),
										default_);
									var v1_ = _v14.a;
									return _Utils_Tuple2(
										A2($author$project$OOP$Syntax$VCons, v1_, v2_),
										scc2);
								} else {
									return _Utils_Tuple2(
										$author$project$OOP$Syntax$VError('Error : 29.'),
										scc2);
								}
						}
					} else {
						return _Utils_Tuple2(
							$author$project$OOP$Syntax$VError('Diff Solve Error : 05.'),
							scc);
					}
				case 'VNil':
					if (delta.b) {
						if (delta.a.$ === 'Insert') {
							var v_ = delta.a.a;
							var resDelta = delta.b;
							var _v16 = A7($author$project$OOP$UnEval$updateMap_, f, $author$project$OOP$Syntax$VNil, resDelta, ctx, _default, newState, scc);
							var v2_ = _v16.a;
							var scc1 = _v16.b;
							var _v17 = A4(
								$author$project$OOP$UnEval$uneval,
								scc1,
								ctx,
								A3($author$project$OOP$Syntax$TApp, _List_Nil, f, _default),
								{state: newState, value: v_});
							var res = _v17.b;
							var scc2 = _v17.c;
							if (res.$ === 'TApp') {
								var default_ = res.c;
								var _v19 = A4(
									$author$project$OOP$Eval$eval,
									_List_Nil,
									_List_Nil,
									_Utils_Tuple2(_List_Nil, _List_Nil),
									default_);
								var v1_ = _v19.a;
								return _Utils_Tuple2(
									A2($author$project$OOP$Syntax$VCons, v1_, v2_),
									scc2);
							} else {
								return _Utils_Tuple2(
									$author$project$OOP$Syntax$VError('Error : 30.'),
									scc2);
							}
						} else {
							return _Utils_Tuple2(
								$author$project$OOP$Syntax$VError('Diff Solve Error : 06.'),
								scc);
						}
					} else {
						return _Utils_Tuple2($author$project$OOP$Syntax$VNil, scc);
					}
				default:
					return _Utils_Tuple2(
						$author$project$OOP$Syntax$VError('Error : 27.'),
						scc);
			}
		}
	});
var $author$project$OOP$Controller$updateCode = function (model) {
	var parseValueRes = $author$project$OOP$Parser$Html$parseHtml(model.htmlOutput);
	var parseProgramRes = $author$project$OOP$Parser$Program$parse(model.code);
	var outputRes = function () {
		if (model.isOnlyObjects) {
			if (parseValueRes.$ === 'Ok') {
				var html = parseValueRes.a;
				var _v9 = A4($author$project$OOP$Objects$H2OTranslator$html2Object, html, model.envDict, model.templates, model.state);
				if (_v9.a.$ === 'VError') {
					var info = _v9.a.a;
					return $elm$core$Result$Err(info);
				} else {
					var objects = _v9.a;
					var state_ = _v9.b;
					return $elm$core$Result$Ok(
						_Utils_Tuple2(objects, state_));
				}
			} else {
				var info = parseValueRes.a;
				return $elm$core$Result$Err(
					$elm$core$Debug$toString(info));
			}
		} else {
			return A2(
				$elm$core$Result$map,
				function (val) {
					return _Utils_Tuple2(val, model.state);
				},
				parseValueRes);
		}
	}();
	var _v0 = _Utils_Tuple2(parseProgramRes, outputRes);
	if (_v0.a.$ === 'Ok') {
		if (_v0.b.$ === 'Ok') {
			if (_v0.a.a.$ === 'WithCT') {
				var _v1 = _v0.a.a;
				var classtb = _v1.a;
				var term = _v1.b;
				var _v2 = _v0.b.a;
				var output = _v2.a;
				var newState = _v2.b;
				var subClsCnt = $author$project$OOP$Controller$genCnt(classtb);
				var pTerm = $author$project$OOP$LangUtils$processAfterParse(
					A2($author$project$OOP$Preclude$Library$assemble, $author$project$OOP$Preclude$Library$parsedLibrary, term));
				var _v3 = A4(
					$author$project$OOP$UnEval$uneval,
					subClsCnt,
					{classtb: classtb, env: _List_Nil, state: _List_Nil},
					pTerm,
					{state: newState, value: output});
				var ctx_ = _v3.a;
				var term_ = _v3.b;
				var _v4 = A4(
					$author$project$OOP$Eval$eval,
					_List_Nil,
					_List_Nil,
					A2($author$project$OOP$LangUtils$appendCT, classtb, ctx_.classtb),
					term_);
				var invks = _v4.c;
				var _v5 = A3($author$project$OOP$CTLift$ctLift, classtb, ctx_.classtb, invks);
				var liftedCT = _v5.a;
				var delList = _v5.b;
				var newTerm = $author$project$OOP$Printer$Term$printTerm(
					A2($author$project$OOP$CTLift$delSubClasses, delList, term_));
				var termDelPreclude = A2(
					$elm$core$String$dropLeft,
					$elm$core$String$length($author$project$OOP$Preclude$Library$library),
					newTerm);
				var classTable = $author$project$OOP$Printer$ClassTable$printClassTable(liftedCT);
				return _Utils_update(
					model,
					{
						classTable: ctx_.classtb,
						code: _Utils_ap(classTable, termDelPreclude)
					});
			} else {
				var term = _v0.a.a.a;
				var _v6 = _v0.b.a;
				var output = _v6.a;
				var newState = _v6.b;
				var subClsCnt = $author$project$OOP$Controller$genCnt($author$project$OOP$Preclude$Gui$parsedGui);
				var pTerm = $author$project$OOP$LangUtils$processAfterParse(
					A2($author$project$OOP$Preclude$Library$assemble, $author$project$OOP$Preclude$Library$parsedLibrary, term));
				var _v7 = A4(
					$author$project$OOP$UnEval$uneval,
					subClsCnt,
					{classtb: $author$project$OOP$Preclude$Gui$parsedGui, env: _List_Nil, state: _List_Nil},
					pTerm,
					{state: newState, value: output});
				var term_ = _v7.b;
				var newTerm = $author$project$OOP$Printer$Term$printTerm(term_);
				var termDelPreclude = A2(
					$elm$core$String$dropLeft,
					$elm$core$String$length($author$project$OOP$Preclude$Library$library),
					newTerm);
				return _Utils_update(
					model,
					{code: termDelPreclude});
			}
		} else {
			var info = _v0.b.a;
			return _Utils_update(
				model,
				{htmlOutput: info});
		}
	} else {
		if (_v0.b.$ === 'Ok') {
			var info = _v0.a.a;
			return _Utils_update(
				model,
				{
					code: $elm$core$Debug$toString(info)
				});
		} else {
			var info1 = _v0.a.a;
			var info2 = _v0.b.a;
			return _Utils_update(
				model,
				{
					code: $elm$core$Debug$toString(info1) + ('\n' + info2)
				});
		}
	}
};
var $author$project$OOP$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SaveCode':
				var newCode = msg.a;
				var newModel = $author$project$OOP$Controller$evalCodeToModel(
					_Utils_update(
						model,
						{code: newCode, codeBackup: newCode}));
				return _Utils_Tuple2(
					newModel,
					$author$project$OOP$Main$replyOutput(newModel.htmlOutput));
			case 'OutputChange':
				var newOutput = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{htmlOutput: newOutput, isConsistent: false}),
					$author$project$OOP$Main$setCodeRed(_Utils_Tuple0));
			case 'Update':
				var newModel = $author$project$OOP$Controller$updateCode(model);
				return _Utils_Tuple2(
					newModel,
					$author$project$OOP$Main$replyCode(
						_Utils_Tuple2(newModel.code, true)));
			case 'Revert':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{code: model.codeBackup}),
					$author$project$OOP$Main$replyCode(
						_Utils_Tuple2(model.codeBackup, model.isConsistent)));
			case 'ModifyClass':
				var objectInfo = msg.a;
				var _v1 = A2($author$project$OOP$Controller$ctrlModifyClass, objectInfo, model);
				var _v2 = _v1.a;
				var objects_ = _v2.a;
				var html = _v2.b;
				var envDict = _v2.c;
				var state = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{envDict: envDict, htmlOutput: html, objectsOutput: objects_, state: state}),
					$author$project$OOP$Main$replyOutput(html));
			case 'DeleteObject':
				var objectID = msg.a;
				var _v3 = A2($author$project$OOP$Controller$ctrlDeleteObject, objectID, model);
				var _v4 = _v3.a;
				var objects_ = _v4.a;
				var html = _v4.b;
				var envDict = _v4.c;
				var state = _v3.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{envDict: envDict, htmlOutput: html, objectsOutput: objects_, state: state}),
					$author$project$OOP$Main$replyOutput(html));
			case 'AddAfterObject':
				var objectID = msg.a;
				var _v5 = A2($author$project$OOP$Controller$ctrlAddAfterObject, objectID, model);
				var _v6 = _v5.a;
				var objects_ = _v6.a;
				var html = _v6.b;
				var envDict = _v6.c;
				var state = _v5.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{envDict: envDict, htmlOutput: html, objectsOutput: objects_, state: state}),
					$author$project$OOP$Main$replyOutput(html));
			case 'AddAtBegin':
				var info = msg.a;
				var _v7 = A2($author$project$OOP$Controller$ctrlAddAtBegin, info, model);
				var _v8 = _v7.a;
				var objects_ = _v8.a;
				var html = _v8.b;
				var envDict = _v8.c;
				var state = _v7.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{envDict: envDict, htmlOutput: html, objectsOutput: objects_, state: state}),
					$author$project$OOP$Main$replyOutput(html));
			case 'FindModifiableClassList':
				var objectInfo = msg.a;
				var ret = A2($author$project$OOP$Controller$ctrlFindModifiableClassList, objectInfo, model.classTable);
				return _Utils_Tuple2(
					model,
					$author$project$OOP$Main$replyModifiableClassList(ret));
			case 'ChangeIsShowTemp':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isShowTemp: !model.isShowTemp}),
					$elm$core$Platform$Cmd$none);
			case 'AddOneTemplate':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							templates: _Utils_ap(
								model.templates,
								_List_fromArray(
									[
										_Utils_Tuple3('', '', '')
									]))
						}),
					$elm$core$Platform$Cmd$none);
			case 'DeleteTemplate':
				var n = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							templates: A2($author$project$OOP$Utils$delete, n, model.templates)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var table = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							templates: $author$project$OOP$Controller$listToTemplates(table)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$OOP$Model$AddOneTemplate = {$: 'AddOneTemplate'};
var $author$project$OOP$Model$ChangeIsShowTemp = {$: 'ChangeIsShowTemp'};
var $author$project$OOP$Model$Revert = {$: 'Revert'};
var $author$project$OOP$Model$Update = {$: 'Update'};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$hidden = $elm$html$Html$Attributes$boolProperty('hidden');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
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
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $author$project$OOP$Model$DeleteTemplate = function (a) {
	return {$: 'DeleteTemplate', a: a};
};
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$OOP$View$toTemplatesTableRow = F2(
	function (num, _v0) {
		var _class = _v0.a;
		var objectTemplate = _v0.b;
		var htmlTemplate = _v0.c;
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$Debug$toString(num + 1))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$textarea,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(_class)
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$textarea,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(objectTemplate)
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$textarea,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(htmlTemplate)
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn'),
									$elm$html$Html$Events$onClick(
									$author$project$OOP$Model$DeleteTemplate(num))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Del')
								]))
						]))
				]));
	});
var $author$project$OOP$View$showTemplates = function (templates) {
	return A2(
		$elm$html$Html$table,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('oop-template-table')
			]),
		A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$thead,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$th,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Number')
							])),
						A2(
						$elm$html$Html$th,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Class')
							])),
						A2(
						$elm$html$Html$th,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Object Template')
							])),
						A2(
						$elm$html$Html$th,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('HTML Template')
							])),
						A2(
						$elm$html$Html$th,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Operation')
							]))
					])),
			A2($elm$core$List$indexedMap, $author$project$OOP$View$toTemplatesTableRow, templates)));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$OOP$View$view = function (model) {
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
								$elm$html$Html$Attributes$class('title'),
								A2($elm$html$Html$Attributes$style, 'width', '70px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('BiOOP')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('oop-eval'),
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
								$elm$html$Html$Attributes$id('oop-update'),
								$elm$html$Html$Attributes$class('btn'),
								$elm$html$Html$Events$onClick($author$project$OOP$Model$Update)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Update')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('oop-revert'),
								$elm$html$Html$Attributes$class('btn'),
								$elm$html$Html$Events$onClick($author$project$OOP$Model$Revert)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Revert')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('oop-structurize'),
								$elm$html$Html$Attributes$class('btn')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Structurize')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('oop-add'),
								$elm$html$Html$Attributes$class('btn')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Add One')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('oop-templates-show'),
								$elm$html$Html$Attributes$class('btn'),
								$elm$html$Html$Events$onClick($author$project$OOP$Model$ChangeIsShowTemp)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Templates')
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('oop-preclude'),
								$elm$html$Html$Attributes$href('file:///Users/zhangxing/Desktop/bidirectional-preview/src/OOP/Preclude/preclude.txt')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Preclude')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('oop-output-div')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('oop-templates'),
						$elm$html$Html$Attributes$hidden(model.isShowTemp)
					]),
				_List_fromArray(
					[
						$author$project$OOP$View$showTemplates(model.templates),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn'),
								$elm$html$Html$Events$onClick($author$project$OOP$Model$AddOneTemplate)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Add')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('oop-templates-save'),
								$elm$html$Html$Attributes$class('btn')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Save')
							]))
					]))
			]));
};
var $author$project$OOP$Main$view = $author$project$OOP$View$view;
var $author$project$OOP$Main$main = $elm$browser$Browser$element(
	{init: $author$project$OOP$Main$init, subscriptions: $author$project$OOP$Main$subscriptions, update: $author$project$OOP$Main$update, view: $author$project$OOP$Main$view});
_Platform_export({'OOP':{'Main':{'init':$author$project$OOP$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}}});}(this));