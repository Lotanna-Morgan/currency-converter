//import idb from 'idb';

const loadCurrencyList = () => {
    const select1 = document.getElementById("select1");
    const select2 = document.getElementById("select2");

    fetch('https://free.currencyconverterapi.com/api/v5/countries').then( res => res.json() ).then( data => {
        const currencyList = data.results;

        for(let currency in currencyList) {
            const option = document.createElement('option');
            option.value = currencyList[currency].currencyId;
            option.innerText = `${currencyList[currency].currencyName} (${currencyList[currency].currencyId}) / ${currencyList[currency].currencySymbol}`;

            select1.appendChild(option);
            select2.appendChild( option.cloneNode(true) );
        }
    } ).catch( err => console.log(err) );
}

document.addEventListener( "DOMContentLoaded", event => {
    loadCurrencyList();
} );