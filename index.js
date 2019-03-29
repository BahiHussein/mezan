/**
 * Mezan - Bahi Hussein
 */

 module.exports = Mezan;

 var defaults  = {
    errors: {
       required: 'missing param',
       length: 'invalid length',
       regex: 'invalid regex',
       type: 'invalid type'
    },
    order: ['required','type']
}

 /**
  * scenario 
  * required:true/false
  */
 function Mezan(){

    this.defaults = defaults;
    /**
     * 
     */
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
     return (typeof prop === scheme.type);
 }

 Mezan.prototype.requiredValidation = function(prop, scheme){
    return (!prop && scheme.required)?false:true;
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
        error: config.errors[validation] || this.defaults.errors[validation] || ''
    }
 }

 Mezan.prototype.fixedOrder = function(order){
     var reqIndex = order.indexOf('required');
    if(reqIndex>-1)order.splice(reqIndex,1);
    order.splice(0,0,'required');
    
    return order;
 }

 

 Mezan.prototype.validate = function(schemes, obj, config){

    if(!config)config=this.defaults;
    if(!config.errors)config.errors = this.defaults.errors;
    if(!config.order)config.order = this.defaults.order;
    config.order = this.fixedOrder(config.order);

    var errors = [];
    for (var i=0; i < schemes.length; i++){
        var scheme = schemes[i];
        var prop = this.getDeepValue(obj, scheme.path);

        for(var o = 0; o<config.order.length; o++){
            var fn = this[`${config.order[o]}Validation`];
            if(fn && scheme[config.order[o]]){
                if(fn(prop, scheme)==false){
                    errors.push(this.createError(config.order[o],scheme, config));
                    break;
                }
            }
        }
        
    }
    return errors;
 }


