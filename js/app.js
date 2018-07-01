import idb from 'idb';

const baseURL = 'https://free.currencyconverterapi.com';
const countriesURLExtention = '/api/v5/countries';
const convertURLExtention = '/api/v5/convert?q=';

const loadCurrencyList = () => {
  const select1 = document.getElementById('select1');
  const select2 = document.getElementById('select2');

  fetch('https://free.currencyconverterapi.com/api/v5/countries').then(res => res.json()).then(data => {
    const currencyList = data.results;
    
    for(let currency in currencyList) {
      let option = document.createElement('option');
      option.value = `${currencyList[currency].currencyId}`;
      if(!currencyList[currency].currencySymbol) {
        option.innerText = `${currencyList[currency].currencyName} (${currencyList[currency].currencyId})`;
      }else {
        option.innerText = `${currencyList[currency].currencyName} (${currencyList[currency].currencyId}) / ${currencyList[currency].currencySymbol}`;
      }
      select1.appendChild(option);
      select2.appendChild(option.cloneNode(true));

      dbPromise.then( db => {
        if(!db) return;

        var tx = db.transaction('keyval', 'readwrite');
        var store = tx.objectStore('keyval');

        store.put(currencyList);
      })
    }
  }).catch(err => {
    alert('There was an error loading full page content due to inadequate internet connection.');
    console.log(err);
  });
}

document.addEventListener( "DOMContentLoaded", event => {
  loadCurrencyList();
  openDataBase();
  IndexController.registerServiceWorker();
  const convert = document.getElementById('convert');
  convert.addEventListener("click", () => convertCurrencies());

});



const fetchCurrencies = () => {

}

const convertCurrencies = () => {
  const amount = document.getElementById('fromAmount').value;
  const select1 = document.getElementById('select1');
  const fromCurrency = select1.options[select1.selectedIndex].value;
  const select2 = document.getElementById('select2');
  const toCurrency = select2.options[select2.selectedIndex].value;
  const callback = result => {
    document.getElementById('to').innerHTML = `${result} ${toCurrency}`;
    /*console.log(result);*/
  }

  const query = `${fromCurrency}_${toCurrency}`;
  const url = `${baseURL}${convertURLExtention}${query}&compact=ultra`;
  console.log(query);

  fetch(url).then(res => res.json()).then(data => {
    const rate = data[query];
    calculateValue(rate, amount, query, callback);
  })
}

const calculateValue = (rate, amount, query, callback) => {
  let [fromCurrency, toCurrency] = query.split('_');

  const value = rate * amount;
  callback(Math.round(value));
}

function openDataBase() {
  if(!navigator.serviceWorker) {
    console.log('No service worker, and so, no indexedDB!');
    return Promise.resolve();
  }

  const dbPromise = idb.open('currency-converter', 1, function(upgradeDb) {
    var currencyStore = upgradeDb.createObjectStore('keyval', {keyPath: 'currencyId'});
  });
}

class IndexController {
  static registerServiceWorker() {
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('Service worker has been registered successfully with scope: ', registration.scope);
      if (!navigator.serviceWorker.controller) {
        return;
      }

      if (registration.waiting) {
        IndexController.updateReady(registration.waiting);
        return;
      }

      if (registration.installing) {
        IndexController.trackInstalling(registration.installing);
        return;
      }

      registration.addEventListener('updatefound', () => {
        IndexController.trackInstalling(registration.installing);
      });

      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    });
  }

  static trackInstalling(worker) {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        IndexController.updateReady(worker);
      }
    });
  }

  static updateReady(worker) {
    IndexController.showAlert('New version available');
    
    refreshButton = document.getElementById('refresh');
    dismissButton = document.getElementById('dismiss');

    refreshButton.addEventListener('click', () => worker.postMessage({ action: 'skipWaiting' }));
    dismissButton.addEventListener('click', () => alert.style.display = 'none');
  }

  // update-only notification alert
  static showAlert(message) {
    alert.style.display = 'flex';
    const alertMessage = document.getElementById('alert-message');
    alertMessage.innerText = message;
  }
}