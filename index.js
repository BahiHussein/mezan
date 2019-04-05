/**
 * Mezan - Bahi Hussein
 */





module.exports = Mezan;


var defaults  = {
    marker: '$prop',
    errors: {
        required: '$prop is required',
        length: '$prop has invalid length',
        regex: '$prop has invalid format',
        type: '$prop invalid type',
        oneOf: '$prop invalid option',
        inclusive: '$prop dependent on ',
        exclusive: '$prop conflict with other',
        canParse: '$prop invalid parsing',
        items: 'on of the $prop items is invalid'
    }
}

/**
 * scenario 
 * required:true/false
 */
function Mezan(){

    this.defaults = defaults;

}

Mezan.prototype._isString = function (value) {
    return typeof value === 'string' || value instanceof String;
}
Mezan.prototype._isNumber  = function (value) {
    return typeof value === 'number' && isFinite(value);
}
Mezan.prototype._isArray = function (value) {
    return value && typeof value === 'object' && value.constructor === Array;
}
Mezan.prototype._isFunction = function (value) {
    return typeof value === 'function';
}
Mezan.prototype._isObject = function (value) {
    return value && typeof value === 'object' && value.constructor === Object;
}
Mezan.prototype._isNull = function (value) {
    return value === null;
}
Mezan.prototype._isUndefined = function (value) {
    return typeof value === 'undefined';
}
Mezan.prototype._isBoolean = function (value) {
    return typeof value === 'boolean';
}
Mezan.prototype._isRegExp = function (value) {
    return value && typeof value === 'object' && value.constructor === RegExp;
}
Mezan.prototype._isError = function (value) {
    return value instanceof Error && typeof value.message !== 'undefined';
}
Mezan.prototype._isDate = function (value) {
    return value instanceof Date;
}
Mezan.prototype._isSymbol = function (value) {
    return typeof value === 'symbol';
}

Mezan.prototype.getDeepValue = function(obj,path){
    for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
            var level = obj[path[i]];
            if(!level)return false;
            obj = level;
    };
    return obj;
};

Mezan.prototype.typeValidation = function(prop, scheme){
    var fn = this[`_is${scheme.type.name}`];
    if(!fn)return new Error(`${scheme.type.name} invalid type`);
    return this.vReturn(fn(prop));
}

Mezan.prototype.inclusiveValidation = function(prop, scheme, mto){
    for(var r = 0; r<scheme.inclusive.length; r++){
    var prop = this.getDeepValue(mto, scheme.inclusive[r]);
    if(!prop)return this.vReturn(false);
    }return this.vReturn(true);
}

Mezan.prototype.canParseValidation = function(prop, scheme){
    var result = true;
    switch(scheme.canParse){
        case 'date': 
            result = (new Date(prop) !== "Invalid Date") && !isNaN(new Date(prop));
            break;
        case 'int':
            result = (isNaN(parseInt(prop)))?false:true;
            break;
        case 'float': 
            result = ((isNaN(parseFloat(prop)))?false:true);
    }
    return this.vReturn(result);
}

Mezan.prototype.exclusiveValidation = function(prop, scheme, mto){
    for(var r = 0; r<scheme.exclusive.length; r++){
        var prop = this.getDeepValue(mto, scheme.exclusive[r]);
        if(prop)return this.vReturn(false);
    }return this.vReturn(true);
}

Mezan.prototype.oneOfValidation = function(prop, scheme){
    return this.vReturn((scheme.oneOf.includes(prop)))
}

Mezan.prototype.requiredValidation = function(prop, scheme){
return this.vReturn((!prop && scheme.required)?false:true);
}

Mezan.prototype.regexValidation = function(prop, scheme){
    return this.vReturn((new RegExp(scheme.regex).test(prop)))
}

Mezan.prototype.lengthValidation = function(prop, scheme){
    if(!this._isArray(prop))prop = prop.toString();
    if(typeof scheme.length === "number")return this.vReturn((prop.length==scheme.length));
    if(scheme.length.min && scheme.length.max) return this.vReturn((scheme.length.min <= prop.length && scheme.length.max >= prop.length));
    if(scheme.length.min) return this.vReturn((scheme.length.min <= prop.length));
    if(scheme.length.max) return this.vReturn((scheme.length.max >= prop.length));
}

/**
 * @param {Boolean} 
 * @param {Object} {value: on: }
 */
Mezan.prototype.vReturn = function(state, error){
    return {state:state, error: error};
}
Mezan.prototype.itemsValidation = function(prop, scheme, mto){

    /* supposed to be a singe object incase of array*/
    /* or multilbe object -- if its is array / match any will work */
    /* incase of object each much correspond with property */
    var itemScheme = scheme.items;
    //array or object 
    if(prop.constructor === Array) {
            var error; 
            /* loop over array items */
            if(this._isObject(itemScheme)){
                for(var i=0; i<prop.length; i++){
                    error = this.evalScheme(prop[i],itemScheme,mto);
                    if(error)return this.vReturn(false, error);
                    
                }return this.vReturn(true);
                
            } else if(this._isArray(itemScheme)){
                /* for each array item */
                for(var x=0; x<prop.length; x++){
                    var matched = false;
                   
                    /* loop over schemes */
                    for(var s=0; s<itemScheme.length; s++){
                        error = this.evalScheme(prop[x],itemScheme[s],mto);
                        if(!error){
                            matched = true;
                            /* the current prop item is valid - move to the next item in prop */ 
                            break;
                        } 
                    }
                    if(!matched)return this.vReturn(matched, error);
                }
                return this.vReturn(true);
                
            }
    } else {return this.vReturn(false)}
}


Mezan.prototype.createError = function(evalResult, scheme, config){
    var validation = evalResult.failedProp;
    if(!scheme.errors)scheme.errors ={};
    var errorObj = {
        label: scheme.label || scheme.path || '',
        path: scheme.path,
        error: scheme.errors[validation] || config.errors[validation] || this.defaults.errors[validation] || '',
        on: (evalResult.itemError)?`${validation} --> ${evalResult.itemError.failedProp}`:validation,
        value: (evalResult.itemError)?`${evalResult.failedValue} --> ${evalResult.itemError.failedValue}`:evalResult.failedValue
    }
    var marker = config.marker||this.defaults.marker;
    if(errorObj.error.includes(marker))errorObj.error = errorObj.error.replace(marker, errorObj.label);

    return errorObj;
}

 /**
 @param {any} property value to be validated
 @param {object} mto  main target object 
 @scheme {array} object for the object to be validated against 
 */

Mezan.prototype.evalScheme = function(prop, scheme, mto){
    var keys = Object.keys(scheme);
    for(var r=0; r<keys.length; r++){
        cKey = keys[r];
        if(!scheme.required && !prop) break;
        var fn = this[`${keys[r]}Validation`];
        if(fn){
            var result = this.exec(fn, prop, scheme, mto);
            if(!result.state)return {failedProp: keys[r], failedValue: prop, itemError: result.error};
        }
    }
    return null;
}

Mezan.prototype.exec = function(fn, prop, scheme, mto){
    if(!fn) return this.vReturn(false);
    return fn.bind(this)(prop, scheme, mto);
}

Mezan.prototype.validate = function(schemes, mto, config){
    if(!config)config=this.defaults;
    if(!config.errors)config.errors = this.defaults.errors;
    var errors = [];

    for (var i=0; i < schemes.length; i++){

        var scheme = schemes[i];
        var prop = this.getDeepValue(mto, scheme.path);

        var result = this.evalScheme(prop, scheme, mto); 
        if(result && result.failedProp)errors.push(this.createError(result,scheme, config));

    }
    return errors;
}
