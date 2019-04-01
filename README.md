## MEZAN a light weight, tiny package for validating JS objects 


Installition 

```
npm install mezan
```

How to use 

```javascript 
const Mezan = require('./index');

let mezan = new Mezan();

const rules = [
    /* it is required to have a string name property with specific min and max length */
    {
        /* property path */
        path: 'name',
        /* property label - returned back on the error object 
        if it is not valid */
        label: 'User name',
        /* required - error throwen if now existing */
        required: true,
        /* type - string,number,boolean,object,array */
        type: 'string',
        /* length range*/ 
        length: {min: 10, max:20}
    },
    {
        path: 'email',
        label: 'User email address',
        required: true,
        type: 'string',
        length: {min:8, max:100},
        regex:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    {
        path: 'birth',
        label: 'user birth date',
        required: false,
        type:'number',
        /* the property must be a string and  can be parsed to date */
        canParse: 'date'

    },
    {
        path: 'gender',
        required: true,
        type: 'string',
        oneOf: ['male','female'],
        
    },
    {
        /* { info: {skills: ['master of cooking ','football player']} }*/
        path: 'info.skills',
        required: true,
        type: 'array',
        
    },
    {
        path: 'shipping.country',
        label: 'shipping country',
        required: true,
        type: 'string',
        /* if object has path 'shipping.country'
         must have the pathes in the inclusive array */
        inclusive: ['shipping.address','email'],
        errors: {
            required: `$prop is required for a product to be shipped`,
            inclusive: '$prop require the existance of shipping address and email'
        }

    },
    {
        path: 'shipping.address',
        label: 'shipping address',
        type: 'string',
        inclusive: ['shipping.country'],
    },
    {
        path: 'pick.location',
        label: 'product pick location',
        required: true,
        type: 'string',
        
        /* if pick.location exists paths in exclusive array should  not exists*/
        exclusive: ['shipping'],
        errors: {
            exclusive: '$prop either shipping address or pick location must be submitted'
        }
    }
];

const obj = {
    name: 'bahi hussein',
    email: 'bahi.hussein@gmail.com',
    gender: 'male',
    birth: 1554112180214,

    pick: {
        location: 'Area 32, Zone 43'
    },

    info: {
        skills: ['coding','eating', 'sleeping']
    },

    shipping: {
        country: 'Egypt'
    }
};


let config = {
    errors: {
        required:'$prop is required',
        type: '$prop has invalid type'
    }
}

let results = mezan.validate(rules, obj, config);

console.log(results);
```


## methods 
**validate**
@param [string] array of objects containing the validation scheme for each property 
@param [object] the object to be validated
@param [object] optional configuration object, check config properties 

## validation properties 
properties are validated in order. **required** property should be added at first to avoid validation of un-existing property.

**required** boolean
**length** number or object {min: number, max: number}
**type** string|number|boolean|object|array
**oneOf** check if property values is one of the given array values ['male','female']
**canParse** check if value can be parsed to int|float|date
**regex** test property value using regexp
**inclusive** array of property paths ['user.name', 'user.age'] that are required to exists if this path exists. example: by adding inclusive:['user.name', 'user.age'] to path 'user', it means that if user path exists the inclusive paths must exists too. 
**exclusive** array of property paths the must not exists on the existance of the current path 

**error** for adding a custom error for this specific scheme overriding config error and default errors

## config properties 

```javascript

var config = {
    errors: {
        required:'$prop is required',
        type: '$prop has invalid type'
    }
}

```
**errors** custom errors to be showing according to the responding property 

$prop will be replace by the scheme label Or path Or '', depending on the avalibility 

