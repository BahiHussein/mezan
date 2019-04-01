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

let results = mezan.validate(rules, obj,config);

console.log(results);