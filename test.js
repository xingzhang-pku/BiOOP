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
			console.log("evalStart");
			var evalStart = new Date().getTime();
			var _v2 = A4($author$project$OOP$Eval$eval, _List_Nil, _List_Nil, withGui, pTerm);
			var evalEnd = new Date().getTime();
			console.log("evalEnd");
			console.log((evalEnd - evalStart) + "ms");
			var objectVal = _v2.a;
			var state = _v2.b;
			console.log("o2hStart");
			var o2hStart = new Date().getTime();
			var _v3 = A5($author$project$OOP$Objects$O2HTranslator$object2Html, objectVal, 0, _List_Nil, model.templates, state);
			var o2hEnd = new Date().getTime();
			console.log("o2hEnd");
			console.log((o2hEnd - o2hStart) + "ms");
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

var $author$project$OOP$Controller$updateCode = function (model) {
	var parseValueRes = $author$project$OOP$Parser$Html$parseHtml(model.htmlOutput);
	var parseProgramRes = $author$project$OOP$Parser$Program$parse(model.code);
	var outputRes = function () {
		if (model.isOnlyObjects) {
			if (parseValueRes.$ === 'Ok') {
				var html = parseValueRes.a;
				console.log("h2oStart");
				var h2oStart = new Date().getTime();
				var _v7 = A4($author$project$OOP$Objects$H2OTranslator$html2Object, html, model.envDict, model.templates, model.state);
				var h2oEnd = new Date().getTime();
				console.log("h2oEnd");
				console.log((h2oEnd - h2oStart) + "ms");
				if (_v7.a.$ === 'VError') {
					var info = _v7.a.a;
					return $elm$core$Result$Err(info);
				} else {
					var objects = _v7.a;
					var state_ = _v7.b;
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
				var withGui = $author$project$OOP$Preclude$Gui$assemble(classtb);
				var pTerm = $author$project$OOP$LangUtils$processAfterParse(
					A2($author$project$OOP$Preclude$Library$assemble, $author$project$OOP$Preclude$Library$parsedLibrary, term));
				console.log("unevalStart");
				var unevalStart = new Date().getTime();
				var _v3 = A3(
					$author$project$OOP$UnEval$uneval,
					{classtb: withGui, env: _List_Nil, state: _List_Nil},
					pTerm,
					{state: newState, value: output});
				var unevalEnd = new Date().getTime();
				console.log("unevalEnd");
				console.log((unevalEnd - unevalStart) + "ms");
				var ctx_ = _v3.a;
				var term_ = _v3.b;
				var classTable = $author$project$OOP$Printer$ClassTable$printClassTable(
					$author$project$OOP$Preclude$Gui$split(ctx_.classtb));
				var newTerm = $author$project$OOP$Printer$Term$printTerm(term_);
				var termDelPreclude = A2(
					$elm$core$String$dropLeft,
					$elm$core$String$length($author$project$OOP$Preclude$Library$library),
					newTerm);
				return _Utils_update(
					model,
					{
						classTable: ctx_.classtb,
						code: _Utils_ap(classTable, termDelPreclude)
					});
			} else {
				var term = _v0.a.a.a;
				var _v4 = _v0.b.a;
				var output = _v4.a;
				var newState = _v4.b;
				var pTerm = $author$project$OOP$LangUtils$processAfterParse(
					A2($author$project$OOP$Preclude$Library$assemble, $author$project$OOP$Preclude$Library$parsedLibrary, term));
				var _v5 = A3(
					$author$project$OOP$UnEval$uneval,
					{classtb: $author$project$OOP$Preclude$Gui$parsedGui, env: _List_Nil, state: _List_Nil},
					pTerm,
					{state: newState, value: output});
				var term_ = _v5.b;
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