// Generated by CoffeeScript 1.3.3

/*
"Skeuocard" -- A Skeuomorphic Credit-Card Input Enhancement
@description Skeuocard is a skeuomorphic credit card input plugin, supporting 
             progressive enhancement. It renders a credit-card input which 
             behaves similarly to a physical credit card.
@author Ken Keiter <ken@kenkeiter.com>
@updated 2013-07-25
@website http://kenkeiter.com/
@exports [window.Skeuocard]

# TODO:
* Add full set of events.
* Get basics working in IE8/9, older versions of FF/Chrome
* Add classes to card indicating validation state
* Pull list of accepted cards from <select>; update selected value upon
  product change. Allow accepted cards to be overridden in options.
*/


(function() {
  var Skeuocard,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Skeuocard = (function() {

    function Skeuocard(el, opts) {
      if (opts == null) {
        opts = {};
      }
      this.el = {
        container: $(el)
      };
      this._underlyingFormEls = {};
      this._inputViews = {};
      this.product = null;
      this.issuer = null;
      opts.debug || (opts.debug = false);
      opts.cardNumberPlaceholderChar || (opts.cardNumberPlaceholderChar = "X");
      opts.typeInputSelector || (opts.typeInputSelector = '[name="cc_type"]');
      opts.numberInputSelector || (opts.numberInputSelector = '[name="cc_number"]');
      opts.expInputSelector || (opts.expInputSelector = '[name="cc_exp"]');
      opts.nameInputSelector || (opts.nameInputSelector = '[name="cc_name"]');
      opts.cvcInputSelector || (opts.cvcInputSelector = '[name="cc_cvc"]');
      opts.frontFlipTabHeader || (opts.frontFlipTabHeader = 'Looks good.');
      opts.frontFlipTabBody || (opts.frontFlipTabBody = 'Click here to fill in the back...');
      opts.backFlipTabHeader || (opts.backFlipTabHeader = "Back");
      opts.backFlipTabBody || (opts.backFlipTabBody = "Forget to fill something in on the front? " + "Click here to turn the card over.");
      opts.flipTabFrontEl || (opts.flipTabFrontEl = $("<div class=\"flip-tab front\"><h1>" + ("" + opts.frontFlipTabHeader + "</h1>") + ("<p>" + opts.frontFlipTabBody + "</p></div>")));
      opts.flipTabBackEl || (opts.flipTabBackEl = $("<div class=\"flip-tab back\"><h1>" + ("" + opts.backFlipTabHeader + "</h1>") + ("<p>" + opts.backFlipTabBody + "</p></div>")));
      opts.currentDate || (opts.currentDate = new Date());
      opts.genericPlaceholder || (opts.genericPlaceholder = "XXXX XXXX XXXX XXXX");
      this.options = opts;
      this._conformDOM();
      this._createInputs();
      this._bindEvents();
      this.render();
    }

    Skeuocard.prototype._conformDOM = function() {
      var _this = this;
      this.el.container.addClass("js");
      this.el.container.find("> :not(input,select,textarea)").remove();
      this.el.container.find("> input,select,textarea").hide();
      this._underlyingFormEls = {
        type: this.el.container.find(this.options.typeInputSelector),
        number: this.el.container.find(this.options.numberInputSelector),
        exp: this.el.container.find(this.options.expInputSelector),
        name: this.el.container.find(this.options.nameInputSelector),
        cvc: this.el.container.find(this.options.cvcInputSelector)
      };
      this._underlyingFormEls.number.bind("change", function(e) {
        _this._inputViews.number.setValue(_this._getUnderlyingValue('number'));
        return _this.render();
      });
      this._underlyingFormEls.exp.bind("change", function(e) {
        _this._inputViews.exp.setValue(_this._getUnderlyingValue('exp'));
        return _this.render();
      });
      this._underlyingFormEls.name.bind("change", function(e) {
        _this._inputViews.exp.setValue(_this._getUnderlyingValue('name'));
        return _this.render();
      });
      this._underlyingFormEls.cvc.bind("change", function(e) {
        _this._inputViews.exp.setValue(_this._getUnderlyingValue('cvc'));
        return _this.render();
      });
      this.el.surfaceFront = $("<div>").attr({
        "class": "face front"
      });
      this.el.surfaceBack = $("<div>").attr({
        "class": "face back"
      });
      this.el.cardBody = $("<div>").attr({
        "class": "card-body"
      });
      this.el.container.addClass("skeuocard");
      this.el.surfaceFront.appendTo(this.el.cardBody);
      this.el.surfaceBack.appendTo(this.el.cardBody);
      this.el.cardBody.appendTo(this.el.container);
      return this.el.container;
    };

    Skeuocard.prototype._createInputs = function() {
      var _this = this;
      this._inputViews.number = new this.SegmentedCardNumberInputView();
      this._inputViews.exp = new this.ExpirationInputView();
      this._inputViews.name = new this.TextInputView({
        "class": "cc-name",
        required: true,
        placeholder: "YOUR NAME"
      });
      this._inputViews.cvc = new this.TextInputView({
        "class": "cc-cvc",
        required: true,
        placeholder: "XXX"
      });
      this._inputViews.number.el.addClass('cc-number');
      this._inputViews.number.el.appendTo(this.el.surfaceFront);
      this._inputViews.name.el.appendTo(this.el.surfaceFront);
      this._inputViews.exp.el.addClass('cc-exp');
      this._inputViews.exp.el.appendTo(this.el.surfaceFront);
      this._inputViews.cvc.el.appendTo(this.el.surfaceBack);
      this._inputViews.number.bind("keyup", function(e, input) {
        _this._setUnderlyingValue('number', input.value);
        return _this.render();
      });
      this._inputViews.exp.bind("keyup", function(e, input) {
        _this._setUnderlyingValue('exp', input.value);
        return _this.render();
      });
      this._inputViews.name.bind("keyup", function(e) {
        _this._setUnderlyingValue('name', $(e.target).val());
        return _this.render();
      });
      this._inputViews.cvc.bind("keyup", function(e) {
        _this._setUnderlyingValue('cvc', $(e.target).val());
        return _this.render();
      });
      this.el.flipTabFront = this.options.flipTabFrontEl;
      this.el.flipTabBack = this.options.flipTabBackEl;
      this.el.surfaceFront.prepend(this.el.flipTabFront);
      this.el.surfaceBack.prepend(this.el.flipTabBack);
      this.el.flipTabFront.click(function() {
        return _this.flip();
      });
      return this.el.flipTabBack.click(function() {
        return _this.flip();
      });
    };

    Skeuocard.prototype._bindEvents = function() {
      var _this = this;
      this.el.container.bind("productchanged", function(e) {
        return _this.updateLayout();
      });
      return this.el.container.bind("issuerchanged", function(e) {
        return _this.updateLayout();
      });
    };

    Skeuocard.prototype._log = function() {
      var msg;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if ((typeof console !== "undefined" && console !== null ? console.log : void 0) && !!this.options.debug) {
        if (this.options.debug != null) {
          return console.log.apply(console, ["[skeuocard]"].concat(__slice.call(msg)));
        }
      }
    };

    Skeuocard.prototype.render = function() {
      var matchedIssuer, matchedProduct, number,
        _this = this;
      number = this._getUnderlyingValue('number');
      if (this.product !== (matchedProduct = this.getProductForNumber(number))) {
        this._log("Changing product:", matchedProduct);
        this.el.container.removeClass(function(index, css) {
          return (css.match(/\bproduct-\S+/g) || []).join(' ');
        });
        if (matchedProduct !== void 0) {
          this.el.container.addClass("product-" + matchedProduct.companyShortname);
          this._inputViews.number.reconfigure({
            groupings: matchedProduct.cardNumberGrouping,
            placeholderChar: this.options.cardNumberPlaceholderChar
          });
          this._inputViews.exp.show();
          this._inputViews.name.show();
          this._inputViews.exp.reconfigure({
            pattern: matchedProduct.expirationFormat
          });
        } else {
          this._inputViews.exp.clear();
          this._inputViews.cvc.clear();
          this._inputViews.exp.hide();
          this._inputViews.name.hide();
          this._inputViews.number.reconfigure({
            groupings: [this.options.genericPlaceholder.length],
            placeholder: this.options.genericPlaceholder
          });
        }
        this.product = matchedProduct;
      }
      if (this.issuer !== (matchedIssuer = this.getIssuerForNumber(number))) {
        this._log("Changing issuer:", matchedIssuer);
        this.el.container.removeClass(function(index, css) {
          return (css.match(/\bissuer-\S+/g) || []).join(' ');
        });
        if (matchedIssuer !== void 0) {
          this.el.container.addClass("issuer-" + matchedIssuer.issuerShortname);
        }
        this.issuer = matchedIssuer;
      }
      if (this.frontIsValid()) {
        this._log("Front face is now valid.");
        return this.el.flipTabFront.show();
      } else {
        return this.el.flipTabFront.hide();
      }
    };

    Skeuocard.prototype.frontIsValid = function() {
      var cardValid, expValid, nameValid;
      cardValid = this.isValidLuhn(this._inputViews.number.value) && (this._inputViews.number.maxLength() === this._inputViews.number.value.length);
      expValid = this._inputViews.exp.date && ((this._inputViews.exp.date.getFullYear() === this.options.currentDate.getFullYear() && this._inputViews.exp.date.getMonth() >= this.options.currentDate.getMonth()) || this._inputViews.exp.date.getFullYear() > this.options.currentDate.getFullYear());
      nameValid = this._inputViews.name.el.val().length > 0;
      return cardValid && expValid && nameValid;
    };

    Skeuocard.prototype.isValid = function() {
      var fieldName, valid, view, _ref;
      valid = true;
      _ref = this._inputViews;
      for (fieldName in _ref) {
        view = _ref[fieldName];
        valid &= view.isValid();
        console.log("" + fieldName + " is valid?", view.isValid());
      }
      return valid;
    };

    Skeuocard.prototype._getUnderlyingValue = function(field) {
      return this._underlyingFormEls[field].val();
    };

    Skeuocard.prototype._setUnderlyingValue = function(field, newValue) {
      return this._underlyingFormEls[field].val(newValue);
    };

    Skeuocard.prototype.flip = function() {
      return this.el.cardBody.toggleClass('flip');
    };

    Skeuocard.prototype.getProductForNumber = function(num) {
      var d, m, matcher, parts;
      for (m in CCProducts) {
        d = CCProducts[m];
        parts = m.split('/');
        matcher = new RegExp(parts[1], parts[2]);
        if (matcher.test(num)) {
          return d;
        }
      }
      return void 0;
    };

    Skeuocard.prototype.getIssuerForNumber = function(num) {
      var d, m, matcher, parts;
      for (m in CCIssuers) {
        d = CCIssuers[m];
        parts = m.split('/');
        matcher = new RegExp(parts[1], parts[2]);
        if (matcher.test(num)) {
          return d;
        }
      }
      return void 0;
    };

    Skeuocard.prototype.isValidLuhn = function(identifier) {
      var alt, i, num, sum, _i, _ref;
      sum = 0;
      alt = false;
      for (i = _i = _ref = identifier.length - 1; _i >= 0; i = _i += -1) {
        num = parseInt(identifier.charAt(i), 10);
        if (isNaN(num)) {
          return false;
        }
        if (alt) {
          num *= 2;
          if (num > 9) {
            num = (num % 10) + 1;
          }
        }
        alt = !alt;
        sum += num;
      }
      return sum % 10 === 0;
    };

    return Skeuocard;

  })();

  Skeuocard.prototype.TextInputView = (function() {

    function TextInputView() {}

    TextInputView.prototype.bind = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).bind.apply(_ref, args);
    };

    TextInputView.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).trigger.apply(_ref, args);
    };

    TextInputView.prototype._getFieldCaretPosition = function(el) {
      var input, sel, selLength;
      input = el.get(0);
      if (input.selectionEnd != null) {
        return input.selectionEnd;
      } else if (document.selection) {
        input.focus();
        sel = document.selection.createRange();
        selLength = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return selLength;
      }
    };

    TextInputView.prototype._setFieldCaretPosition = function(el, pos) {
      var input, range;
      input = el.get(0);
      if (input.createTextRange != null) {
        range = input.createTextRange();
        range.move("character", pos);
        return range.select();
      } else if (input.selectionStart != null) {
        input.focus();
        return input.setSelectionRange(pos, pos);
      }
    };

    TextInputView.prototype.show = function() {
      return this.el.show();
    };

    TextInputView.prototype.hide = function() {
      return this.el.hide();
    };

    TextInputView.prototype._zeroPadNumber = function(num, places) {
      var zero;
      zero = places - num.toString().length + 1;
      return Array(zero).join("0") + num;
    };

    return TextInputView;

  })();

  Skeuocard.prototype.SegmentedCardNumberInputView = (function(_super) {

    __extends(SegmentedCardNumberInputView, _super);

    function SegmentedCardNumberInputView(opts) {
      var _this = this;
      if (opts == null) {
        opts = {};
      }
      opts.value || (opts.value = "");
      opts.groupings || (opts.groupings = [19]);
      opts.placeholderChar || (opts.placeholderChar = "X");
      this.options = opts;
      this.value = this.options.value;
      this.el = $("<fieldset>");
      this.el.delegate("input", "keydown", function(e) {
        return _this._onGroupKeyDown(e);
      });
      this.el.delegate("input", "keyup", function(e) {
        return _this._onGroupKeyUp(e);
      });
      this.groupEls = $();
    }

    SegmentedCardNumberInputView.prototype._onGroupKeyDown = function(e) {
      var arrowKeys, groupCaretPos, groupEl, groupMaxLength, _ref;
      e.stopPropagation();
      groupEl = $(e.currentTarget);
      arrowKeys = [37, 38, 39, 40];
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      if (e.which === 8 && groupCaretPos === 0 && !$.isEmptyObject(groupEl.prev())) {
        groupEl.prev().focus();
      }
      if (_ref = e.which, __indexOf.call(arrowKeys, _ref) >= 0) {
        switch (e.which) {
          case 37:
            if (groupCaretPos === 0 && !$.isEmptyObject(groupEl.prev())) {
              return groupEl.prev().focus();
            }
            break;
          case 39:
            if (groupCaretPos === groupMaxLength && !$.isEmptyObject(groupEl.next())) {
              return groupEl.next().focus();
            }
            break;
          case 38:
            if (!$.isEmptyObject(groupEl.prev())) {
              return groupEl.prev().focus();
            }
            break;
          case 40:
            if (!$.isEmptyObject(groupEl.next())) {
              return groupEl.next().focus();
            }
        }
      }
    };

    SegmentedCardNumberInputView.prototype._onGroupKeyUp = function(e) {
      var groupCaretPos, groupEl, groupMaxLength, groupValLength, newValue, pattern, specialKeys, _ref, _ref1;
      e.stopPropagation();
      specialKeys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 144, 145, 224];
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      if (_ref = e.which, __indexOf.call(specialKeys, _ref) < 0) {
        groupValLength = groupEl.val().length;
        pattern = new RegExp('[^0-9]+', 'g');
        groupEl.val(groupEl.val().replace(pattern, ''));
        if (groupEl.val().length < groupValLength) {
          this._setFieldCaretPosition(groupEl, groupCaretPos - 1);
        } else {
          this._setFieldCaretPosition(groupEl, groupCaretPos);
        }
      }
      if ((_ref1 = e.which, __indexOf.call(specialKeys, _ref1) < 0) && groupEl.val().length === groupMaxLength && !$.isEmptyObject(groupEl.next()) && this._getFieldCaretPosition(groupEl) === groupMaxLength) {
        groupEl.next().focus();
      }
      newValue = "";
      this.groupEls.each(function() {
        return newValue += $(this).val();
      });
      this.value = newValue;
      this.trigger("keyup", [this]);
      return false;
    };

    SegmentedCardNumberInputView.prototype.setGroupings = function(groupings) {
      var caretPos, groupEl, groupLength, _i, _len, _startLength;
      caretPos = this._caretPosition();
      this.el.empty();
      _startLength = 0;
      for (_i = 0, _len = groupings.length; _i < _len; _i++) {
        groupLength = groupings[_i];
        groupEl = $("<input>").attr({
          type: 'text',
          size: groupLength,
          maxlength: groupLength,
          required: true,
          "class": "group" + groupLength
        });
        if (this.value.length > _startLength) {
          groupEl.val(this.value.substr(_startLength, groupLength));
          _startLength += groupLength;
        }
        this.el.append(groupEl);
      }
      this.options.groupings = groupings;
      this.groupEls = this.el.find("input");
      this._caretTo(caretPos);
      if (this.options.placeholderChar !== void 0) {
        this.setPlaceholderChar(this.options.placeholderChar);
      }
      if (this.options.placeholder !== void 0) {
        return this.setPlaceholder(this.options.placeholder);
      }
    };

    SegmentedCardNumberInputView.prototype.setPlaceholderChar = function(ch) {
      this.groupEls.each(function() {
        var el;
        el = $(this);
        return el.attr('placeholder', new Array(parseInt(el.attr('maxlength')) + 1).join(ch));
      });
      this.options.placeholder = void 0;
      return this.options.placeholderChar = ch;
    };

    SegmentedCardNumberInputView.prototype.setPlaceholder = function(str) {
      this.groupEls.each(function() {
        return $(this).attr('placeholder', str);
      });
      this.options.placeholderChar = void 0;
      return this.options.placeholder = str;
    };

    SegmentedCardNumberInputView.prototype.setValue = function(newValue) {
      var lastPos;
      console.log('setting value', newValue);
      lastPos = 0;
      this.groupEls.each(function() {
        var el, len;
        el = $(this);
        len = parseInt(el.attr('maxlength'));
        el.val(newValue.substr(lastPos, len));
        return lastPos += len;
      });
      return this.value = newValue;
    };

    SegmentedCardNumberInputView.prototype.getValue = function() {
      return this.value;
    };

    SegmentedCardNumberInputView.prototype.reconfigure = function(changes) {
      if (changes == null) {
        changes = {};
      }
      if (changes.groupings != null) {
        this.setGroupings(changes.groupings);
      }
      if (changes.placeholderChar != null) {
        this.setPlaceholderChar(changes.placeholderChar);
      }
      if (changes.placeholder != null) {
        this.setPlaceholder(changes.placeholder);
      }
      if (changes.value != null) {
        return this.setValue(changes.value);
      }
    };

    SegmentedCardNumberInputView.prototype._caretTo = function(index) {
      var inputEl, inputElIndex, pos,
        _this = this;
      pos = 0;
      inputEl = void 0;
      inputElIndex = 0;
      this.groupEls.each(function(i, e) {
        var el, elLength;
        el = $(e);
        elLength = parseInt(el.attr('maxlength'));
        if (index <= elLength + pos && index >= pos) {
          inputEl = el;
          inputElIndex = index - pos;
        }
        return pos += elLength;
      });
      return this._setFieldCaretPosition(inputEl, inputElIndex);
    };

    SegmentedCardNumberInputView.prototype._caretPosition = function() {
      var finalPos, iPos,
        _this = this;
      iPos = 0;
      finalPos = 0;
      this.groupEls.each(function(i, e) {
        var el;
        el = $(e);
        if (el.is(':focus')) {
          finalPos = iPos + _this._getFieldCaretPosition(el);
        }
        return iPos += parseInt(el.attr('maxlength'));
      });
      return finalPos;
    };

    SegmentedCardNumberInputView.prototype.maxLength = function() {
      return this.options.groupings.reduce(function(a, b) {
        return a + b;
      });
    };

    return SegmentedCardNumberInputView;

  })(Skeuocard.prototype.TextInputView);

  Skeuocard.prototype.ExpirationInputView = (function(_super) {

    __extends(ExpirationInputView, _super);

    function ExpirationInputView(opts) {
      var _this = this;
      if (opts == null) {
        opts = {};
      }
      opts.dateFormatter || (opts.dateFormatter = function(date) {
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      });
      opts.dateParser || (opts.dateParser = function(value) {
        var dateParts;
        dateParts = value.split('-');
        return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      });
      opts.pattern || (opts.pattern = "MM/YY");
      this.options = opts;
      this.date = void 0;
      this.value = void 0;
      this.el = $("<fieldset>");
      this.el.delegate("input", "keydown", function(e) {
        return _this._onKeyDown(e);
      });
      this.el.delegate("input", "keyup", function(e) {
        return _this._onKeyUp(e);
      });
    }

    ExpirationInputView.prototype._getFieldCaretPosition = function(el) {
      var input, sel, selLength;
      input = el.get(0);
      if (input.selectionEnd != null) {
        return input.selectionEnd;
      } else if (document.selection) {
        input.focus();
        sel = document.selection.createRange();
        selLength = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return selLength;
      }
    };

    ExpirationInputView.prototype._setFieldCaretPosition = function(el, pos) {
      var input, range;
      input = el.get(0);
      if (input.createTextRange != null) {
        range = input.createTextRange();
        range.move("character", pos);
        return range.select();
      } else if (input.selectionStart != null) {
        input.focus();
        return input.setSelectionRange(pos, pos);
      }
    };

    ExpirationInputView.prototype.setPattern = function(pattern) {
      var char, groupings, i, patternParts, _currentLength, _i, _len;
      groupings = [];
      patternParts = pattern.split('');
      _currentLength = 0;
      for (i = _i = 0, _len = patternParts.length; _i < _len; i = ++_i) {
        char = patternParts[i];
        _currentLength++;
        if (patternParts[i + 1] !== char) {
          groupings.push([_currentLength, char]);
          _currentLength = 0;
        }
      }
      this.options.groupings = groupings;
      return this._setGroupings(this.options.groupings);
    };

    ExpirationInputView.prototype._setGroupings = function(groupings) {
      var fieldChars, group, groupChar, groupLength, input, sep, _i, _len, _startLength;
      fieldChars = ['D', 'M', 'Y'];
      this.el.empty();
      _startLength = 0;
      for (_i = 0, _len = groupings.length; _i < _len; _i++) {
        group = groupings[_i];
        groupLength = group[0];
        groupChar = group[1];
        if (__indexOf.call(fieldChars, groupChar) >= 0) {
          input = $('<input>').attr({
            type: 'text',
            placeholder: new Array(groupLength + 1).join(groupChar),
            maxlength: groupLength,
            required: true,
            'data-fieldtype': groupChar,
            "class": 'cc-exp-field-' + groupChar.toLowerCase() + ' group' + groupLength
          });
          this.el.append(input);
        } else {
          sep = $('<span>').attr({
            "class": 'separator'
          });
          sep.html(new Array(groupLength + 1).join(groupChar));
          this.el.append(sep);
        }
      }
      this.groupEls = this.el.find('input');
      if (this.date != null) {
        return this._updateFieldValues();
      }
    };

    ExpirationInputView.prototype._updateFieldValues = function() {
      var currentDate,
        _this = this;
      currentDate = this.date;
      if (!this.groupEls) {
        return;
      }
      return this.groupEls.each(function() {
        var el, groupLength, year;
        el = $(_this);
        groupLength = parseInt(el.attr('maxlength'));
        switch (el.attr('data-fieldtype')) {
          case 'M':
            return el.val(_this._zeroPadNumber(currentDate.getMonth() + 1, groupLength));
          case 'D':
            return el.val(_this._zeroPadNumber(currentDate.getDate(), groupLength));
          case 'Y':
            year = groupLength >= 4 ? currentDate.getFullYear() : currentDate.getFullYear().toString().substr(2, 4);
            return el.val(year);
        }
      });
    };

    ExpirationInputView.prototype.clear = function() {
      this.value = "";
      this.date = null;
      return this._updateFieldValues();
    };

    ExpirationInputView.prototype.setDate = function(newDate) {
      this.date = newDate;
      return this._updateFieldValues();
    };

    ExpirationInputView.prototype.setValue = function(newValue) {
      return this.setDate(this.options.dateParser(newValue));
    };

    ExpirationInputView.prototype.getDate = function() {
      return this.date;
    };

    ExpirationInputView.prototype.getValue = function() {
      return this.value;
    };

    ExpirationInputView.prototype.reconfigure = function(opts) {
      if (opts.pattern != null) {
        this.setPattern(opts.pattern);
      }
      if (opts.value != null) {
        return this.setValue(opts.value);
      }
    };

    ExpirationInputView.prototype._onKeyDown = function(e) {
      var groupCaretPos, groupEl, groupMaxLength, nextInputEl, prevInputEl, _ref;
      e.stopPropagation();
      groupEl = $(e.currentTarget);
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      prevInputEl = groupEl.prevAll('input').first();
      nextInputEl = groupEl.nextAll('input').first();
      if (e.which === 8 && groupCaretPos === 0 && !$.isEmptyObject(prevInputEl)) {
        prevInputEl.focus();
      }
      if ((_ref = e.which) === 37 || _ref === 38 || _ref === 39 || _ref === 40) {
        switch (e.which) {
          case 37:
            if (groupCaretPos === 0 && !$.isEmptyObject(prevInputEl)) {
              return prevInputEl.focus();
            }
            break;
          case 39:
            if (groupCaretPos === groupMaxLength && !$.isEmptyObject(nextInputEl)) {
              return nextInputEl.focus();
            }
            break;
          case 38:
            if (!$.isEmptyObject(groupEl.prev('input'))) {
              return prevInputEl.focus();
            }
            break;
          case 40:
            if (!$.isEmptyObject(groupEl.next('input'))) {
              return nextInputEl.focus();
            }
        }
      }
    };

    ExpirationInputView.prototype._onKeyUp = function(e) {
      var arrowKeys, dateObj, day, groupCaretPos, groupEl, groupMaxLength, groupValLength, month, nextInputEl, pattern, specialKeys, year, _ref, _ref1;
      e.stopPropagation();
      specialKeys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 144, 145, 224];
      arrowKeys = [37, 38, 39, 40];
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      if (_ref = e.which, __indexOf.call(specialKeys, _ref) < 0) {
        groupValLength = groupEl.val().length;
        pattern = new RegExp('[^0-9]+', 'g');
        groupEl.val(groupEl.val().replace(pattern, ''));
        if (groupEl.val().length < groupValLength) {
          this._setFieldCaretPosition(groupEl, groupCaretPos - 1);
        } else {
          this._setFieldCaretPosition(groupEl, groupCaretPos);
        }
      }
      nextInputEl = groupEl.nextAll('input').first();
      if ((_ref1 = e.which, __indexOf.call(specialKeys, _ref1) < 0) && groupEl.val().length === groupMaxLength && !$.isEmptyObject(nextInputEl) && this._getFieldCaretPosition(groupEl) === groupMaxLength) {
        nextInputEl.focus();
      }
      day = parseInt(this.el.find('.cc-exp-field-d').val()) || 1;
      month = parseInt(this.el.find('.cc-exp-field-m').val());
      year = parseInt(this.el.find('.cc-exp-field-y').val());
      if (month === 0 || year === 0) {
        this.value = "";
        this.date = null;
      } else {
        if (year < 2000) {
          year += 2000;
        }
        dateObj = new Date(year, month - 1, day);
        this.value = this.options.dateFormatter(dateObj);
        this.date = dateObj;
      }
      this.trigger("keyup", [this]);
      return false;
    };

    ExpirationInputView.prototype._inputGroupEls = function() {
      return this.el.find("input");
    };

    return ExpirationInputView;

  })(Skeuocard.prototype.TextInputView);

  Skeuocard.prototype.TextInputView = (function(_super) {

    __extends(TextInputView, _super);

    function TextInputView(opts) {
      this.el = $("<input>").attr($.extend({
        type: 'text'
      }, opts));
    }

    TextInputView.prototype.clear = function() {
      return this.el.val("");
    };

    return TextInputView;

  })(Skeuocard.prototype.TextInputView);

  window.Skeuocard = Skeuocard;

}).call(this);
