/**
 * Mezan - Bahi Hussein
 */

 module.exports = Mezan;

 var defaults  = {
    errors: {
       required: 'missing param',
       length: 'invalid length',
       regex: 'invalid regex',
       type: 'invalid type',
       oneOf: 'invalid option',
       inclusive: 'missing dependences',
       exclusive: 'existing conflict',
       canParse: 'invalid parsing'
    }
}

 /**
  * scenario 
  * required:true/false
  */
 function Mezan(){

    this.defaults = defaults;

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
     return (prop.constructor.name.toLowerCase() === scheme.type.toLowerCase());
 }

 Mezan.prototype.inclusiveValidation = function(prop, scheme, obj){
     for(var r = 0; r<scheme.inclusive.length; r++){
        var prop = this.getDeepValue(obj, scheme.inclusive[r]);
        if(!prop)return false;
     }return true;
 }

 Mezan.prototype.canParseValidation = function(prop, scheme){
        var result = true;
        switch(scheme.canParse){
            case 'date': 
                result = (isNaN(Date.parse(prop)))?false:true;
                break;
            case 'int':
                result = (isNaN(parseInt(prop)))?false:true;
                break;
            case 'float': 
                result = ((isNaN(parseFloat(prop)))?false:true);
        }
        return result;
 }

 Mezan.prototype.exclusiveValidation = function(prop, scheme, obj){
    for(var r = 0; r<scheme.exclusive.length; r++){
        var prop = this.getDeepValue(obj, scheme.exclusive[r]);
        if(prop)return false;
     }return true;
 }

 Mezan.prototype.oneOfValidation = function(prop, scheme){
     return (scheme.oneOf.includes(prop))
 }

 Mezan.prototype.requiredValidation = function(prop, scheme){
    return (!prop && scheme.required)?false:true;
 }

 Mezan.prototype.regexValidation = function(prop, scheme){
     return (new RegExp(scheme.regex).test(prop))
 }

 Mezan.prototype.lengthValidation = function(prop, scheme){
     prop = prop.toString();
     if(typeof scheme.length == "number")return (prop.length==scheme.length);
     if(scheme.length.min && scheme.length.max) return (scheme.length.min <= prop.length && scheme.length.max >= prop.length);
     if(scheme.length.min) return (scheme.length.min <= prop.length);
     if(scheme.length.max) return (scheme.length.max >= prop.length);
}

 Mezan.prototype.createError = function(validation, scheme, config){
     return {
        label: scheme.label || scheme.path || '',
        path: scheme.path,
        error: config.errors[validation] || this.defaults.errors[validation] || '',
        on:JSON.stringify(scheme[validation])
    }
 }


 Mezan.prototype.validate = function(schemes, obj, config){

    if(!config)config=this.defaults;
    if(!config.errors)config.errors = this.defaults.errors;

    var errors = [];
    for (var i=0; i < schemes.length; i++){
        var scheme = schemes[i];
        var prop = this.getDeepValue(obj, scheme.path);

        var keys = Object.keys(scheme);

        for(var r=0; r<keys.length; r++){
            var fn = this[`${keys[r]}Validation`];
            if(fn){
                if(fn.bind(this)(prop, scheme, obj)==false){
                    errors.push(this.createError(keys[r],scheme, config));
                    break;
                }
            }
        }
        
        
    }
    return errors;
 }


