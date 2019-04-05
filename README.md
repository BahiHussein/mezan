## MEZAN a light weight, tiny package for validating JS objects 


Installition 

```
npm install mezan
```

How to use 

```javascript 
const Mezan = require('mezan');

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
        type: String,
        /* length range*/ 
        length: {min: 1, max:2}
    },
    {
        path: 'email',
        label: 'User email address',
        required: true,
        type: String,
        length: {min:8, max:100},
        regex:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    {
        path: 'birth',
        label: 'user birth date',
        required: false,
        type: Number,
        /* the property must be a string and  can be parsed to date */
        canParse: 'date'

    },
    {
        path: 'gender',
        required: true,
        type: String,
        oneOf: ['male','female'],
        
    },
    {
        path: 'language',
        required: true,
        type: String,
        
    },
    {
        /* { info: {skills: ['master of cooking ','football player']} }*/
        path: 'info.skills',
        required: true,
        type: Array,
        
    },
    {
        path: 'shipping.country',
        label: 'shipping country',
        required: true,
        type: String,
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
        type: String,
        inclusive: ['shipping.country'],
    },
    {
        path: 'pick.location',
        label: 'product pick location',
        required: true,
        type: String,
        
        /* if pick.location exists paths in exclusive array should  not exists*/
        exclusive: ['shipping'],
        errors: {
            exclusive: '$prop either shipping address or pick location must be submitted'
        }
    }
];

const obj = {
    name: 'bahi',
    email: 'bahi.hussein@gmail.com',
    gender: 'male',
    birth: 1554112180214,
    language: 1,

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
```javascript 
[ 
    { 
        label: 'User name',
        path: 'name',
        error: 'User name has invalid length',
        on: 'length' 
    },

    { 
        label: 'language',
        path: 'language',
        error: 'language has invalid type',
        on: 'type' 
    },

    { 
        label: 'shipping country',
        path: 'shipping.country',
        error:'shipping country require the existance of shipping address and email',
        on: 'inclusive' 
    },
    
    { 
      label: 'product pick location',
        path: 'pick.location',
        error:'product pick location either shipping address or pick location must be submitted',
        on: 'exclusive' 
    } 
]

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

**items**  accepts {object} or {array} if a path is to array. item can be used to validated elements of array 

```
[{
        path: 'other',
        required: true,
        type: Array,
        length: {min: 3},
        /* is items is {object} each item must pass the validation test */
        items:{type:Number}
            
}]

[{
        path: 'other',
        required: true,
        type: Array,
        length: {min: 3},
        /* is items is {array} each item must pass on of the validations, in this case array items can be a number or string */
        items:[{type:Number}, {type:String}]
            
}]

```

with items property error comes with more elaborate details about the failing element 
```
{ label: 'other',
    path: 'other',
    error: 'on of the other items is invalid',
    on: 'items --> type',
    value:
     '12,foo,1,Fri Apr 05 2019 14:44:36 GMT+0200 (Eastern European Standard Time),flower --> Fri Apr 05 2019 14:44:36 GMT+0200 (Eastern European Standard Time)' 
}

/**
it shows that items  are failing because of type test 
and on the value the "-->" shows which element in failing 
*/


```

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

