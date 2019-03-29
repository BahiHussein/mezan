const Mezan = require('./index');

const scenario = [
    {
        path: 'ip',
        label: 'ip address',
        required: true,
        type: 'string',
        length: {min: 10, max:20}
    },
    {
        path: 'email',
        label: 'email address',
        required: false,
        type: 'string',
        length: {min:1,max:10}
    },
    {
        path: 'salary.amount',
        label: 'paied salary',
        required: true,
        type:'number',

    }
]

const obj = {
    ip: 123,
    email: 'ba',
    salary:{
        amount: 20
    }
}

let mezan = new Mezan();

let config = {
    errors: {
        require:'missing value ya wad '
    },
    order: ['type','length','range']
}

let results = mezan.validate(scenario, obj,config);

console.log(results);