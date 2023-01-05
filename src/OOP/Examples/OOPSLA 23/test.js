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
				console.log("unevalStart");
				var unevalStart = new Date().getTime();
				var _v3 = A4(
					$author$project$OOP$UnEval$uneval,
					subClsCnt,
					{classtb: classtb, env: _List_Nil, state: _List_Nil},
					pTerm,
					{state: newState, value: output});
				var unevalEnd = new Date().getTime();
				console.log("unevalEnd");
				console.log((unevalEnd - unevalStart) + "ms");
				var ctx_ = _v3.a;
				var term_ = _v3.b;
				console.log("ctliftStart");
				var ctliftStart = new Date().getTime();
				var _v4 = A4(
					$author$project$OOP$Eval$eval,
					_List_Nil,
					_List_Nil,
					A2($author$project$OOP$LangUtils$appendCT, classtb, ctx_.classtb),
					term_);
				var invks = _v4.c;
				var _v5 = A3($author$project$OOP$CTLift$ctLift, classtb, ctx_.classtb, invks);
				var ctliftEnd = new Date().getTime();
				console.log("ctliftEnd");
				console.log((ctliftEnd - ctliftStart) + "ms");
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
				console.log('evalCodeToModelStart');
				var evalCodeToModelStart = new Date().getTime();
				var newModel = $author$project$OOP$Controller$evalCodeToModel(
					_Utils_update(
						model,
						{code: newCode, codeBackup: newCode}));
				var evalCodeToModelEnd = new Date().getTime();
				console.log('evalCodeToModelEnd');
				console.log((evalCodeToModelEnd - evalCodeToModelStart) + "ms");
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
				console.log('updateCodeStart');
				var updateStart = new Date().getTime();
				var newModel = $author$project$OOP$Controller$updateCode(model);
				var updateEnd = new Date().getTime();
				console.log('updateCodeEnd');
				console.log((updateEnd - updateStart) + "ms");
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