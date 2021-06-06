const source = document.getElementById('source');
const targeted = document.getElementById('targeted');
const targetedSymbol = document.getElementById('targetedSymbol');
const sourceSymbol = document.getElementById('sourceSymbol');
const sourceCurrency = document.getElementById('sourceCurrency');
const targetedCurrency = document.getElementById('targetedCurrency');
const button = document.querySelector('.switch');

const API_KEY='0637eda0a8cf0f37de7f1f255eaba1fe';
const API_URL = `http://data.fixer.io/api/latest?access_key=${API_KEY}`

// get and set local storage
const Store = {
    set: (key, data) => {
        if (data === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(data));
        }
    },

    get: (key) => {
        const data = localStorage.getItem(key);
        if (!data) return undefined;
        return JSON.parse(data);
    },
};

window.onload = () => {
    source.value = Store.get("sourceValue");
    targeted.value = Store.get("targetedValue");
    targetedCurrency.value = Store.get("targetedCurrency") || "EUR";
    sourceCurrency.value = Store.get("sourceCurrency") || "USD";
    sourceSymbol.innerHTML = Store.get("sourceSymbol") || "$";
    targetedSymbol.innerHTML = Store.get("targetedSymbol") || "€";
}

const persistSource = () => {
    Store.set("sourceCurrency",sourceCurrency.value);
    Store.set("sourceSymbol",sourceSymbol.innerHTML);
    Store.set("sourceValue",source.value);
}

const persistTarget = () => {
    Store.set("targetedCurrency",targetedCurrency.value);
    Store.set("targetedSymbol",targetedSymbol.innerHTML);
    Store.set("targetedValue",targeted.value);
}

const convert = (rates) => {
    targeted.value = (source.value * rates[sourceCurrency.value] / rates[targetedCurrency.value]).toFixed(2);
}

const selectOnChange = (symbolSelector,event,rates) =>{
    symbolSelector.innerHTML =  event.target.options[event.target.selectedIndex].dataset.symbol;
    convert(rates);
    if(symbolSelector === sourceSymbol) {
        persistSource();
    } else {
        persistTarget();
    }
}


const currency = () => {
    fetch(API_URL).then((response)=> {
        return response.json();
    }).then((resp) => {
        const rates = resp.rates;

        source.addEventListener('keyup',() => {
            const converted = (source.value * rates[targetedCurrency.value] / rates[sourceCurrency.value]).toFixed(2);
            targeted.value = converted;
            Store.set("sourceValue",source.value);
            Store.set("targetedValue",converted);
        });

        sourceCurrency.addEventListener('change',(event) => selectOnChange(sourceSymbol,event,rates));
        targetedCurrency.addEventListener('change',(event) => selectOnChange(targetedSymbol,event,rates));

    }).catch(warn => console.warn(warn));
}

const swap = () => {
    [
        targetedCurrency.value,
        sourceCurrency.value,
        targetedSymbol.innerHTML,
        sourceSymbol.innerHTML,
        source.value,
        targeted.value
    ] = [
        sourceCurrency.value,
        targetedCurrency.value,
        sourceSymbol.innerHTML,
        targetedSymbol.innerHTML,
        targeted.value,
        source.value
    ]
    persistSource();
    persistTarget();
}


button.addEventListener('click', swap);
currency();

