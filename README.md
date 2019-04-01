## MEZAN a light weight, tiny package for validating JS objects 


Installition 

```
npm install mezan
```

How to use 

```javascript 
const mezan = require('mezan'); 

/* descriping how the object the we will validate must look like */

const rules = [
    /* it is required to have a string name property with specific min and max length */
    {
        /* property path */
        path: 'name',
        /* property label - returned back on the error object 
        if it is not valid */
        label: 'User Email',
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
        path: 'age',
        label: 'user age',
        required: false,
        type:'string',
        /* the property must be a string and  can be parsed to date */
        canParse: 'date'

    },
    {
        path: 'gender',
        type: 'string',
        oneOf: ['male','female'],
        require: true
    },
    {
        /* { info: {skills: ['master of cooking ','football player']} }*/
        path: 'info.skills',
        type: 'array',
        required: false
    },
    {
        path: 'shipping.country',
        type: 'string'
        /* if object has path 'shipping.country'
         must have the pathes in the inclusive array */
        inclusive: ['shipping.address','email'],

    },
    {
        path: 'shipping.address',
        type: 'string'
        inclusive: ['shipping.country'],
    },
    {
        path: 'pick.location',
        type: 'string',
        oneOf: ['male','female'],
        require: true,
        /* if pick.location exists paths in exclusive array should  not exists*/
        exclusive: ['shipping']
    }
]
```
