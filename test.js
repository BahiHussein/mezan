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
        length: {min:2, max:100},
        regex:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    {
        path: 'salary.amount',
        label: 'paied salary',
        required: true,
        type:'string',
        canParse: 'date'

    },
    {
        path: 'luc.list',
        type: 'array',
        inclusive: ['luc','email','eeee'],
        required: true
    },
    {
        path: 'gender',
        type: 'string',
        oneOf: ['male','female'],
        require: true,
        exclusive: ['email']

    }
]

const obj = {
    ip: '12asdasdasdasd3',
    email: 'bahi.hussein@gmail.com',
    salary:{
        amount: '2012'
    },
    luc: {
        list: []
    },
    gender: 'male'
}

let mezan = new Mezan();

let config = {
    errors: {
        require:'missing value ya wad '
    }
}

let results = mezan.validate(scenario, obj,config);

console.log(results);