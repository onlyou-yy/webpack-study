import "./index.css";
import $ from 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
require("./a")
(()=>{
    console.log('aaaa');
})()

class Person{
    constructor(){
        this.name='jack'
    }
}

function * gen(){
    yield 1;
}

console.log("$",$);