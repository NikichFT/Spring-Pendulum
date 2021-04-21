let mass = document.querySelector('#m');
let rate = document.querySelector('#k');
let x0 = document.querySelector('#x0');
let freq = document.querySelector('#w0');
let time = document.querySelector('#time');
let numVibrations = document.querySelector('#total-V');
let x = document.querySelector('#x');
let ball = document.querySelector('.ball');
let spring = document.querySelector('#spring');
let play = document.querySelector('.play-button');
let stop = document.querySelector('.stop-button');

let state = {
    mass: null,
    rate: null,
    x0: null,
    w0: null,
    t: null,
    numVibrations: null,
    x: null,
    T: null
}

//входные параметры
const arrMass = [0.5, 0.6, 0.7, 0.8, 0.9, 1];
const arrRate = [5, 6, 7, 8, 9];
const arrX0 = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

document.addEventListener("DOMContentLoaded", insertMassOption(arrMass));
document.addEventListener("DOMContentLoaded", insertRateOption(arrRate));
document.addEventListener("DOMContentLoaded", insertX0Option(arrX0));
document.addEventListener("DOMContentLoaded", cyclicFreq());

//по изменению параметров очистить, изменить характеристики и выполнить изменение графич. отображения
mass.addEventListener("change", ()=>{
    refreshProps()
    ball.style.height = `${+50 + +state.mass * 20}px`
    ball.style.width = `${+50 + +state.mass * 20}px`
});
rate.addEventListener("change", refreshProps);
x0.addEventListener("change", ()=> {
    state.x0 = x0.value
    ball.style.transform = `translateY(${x0.value}px)`
    spring.style.height = `${+400 + +x0.value}px`
    spring.style.backgroundSize = `45px ${+400 + +x0.value}px`
    clearCharacts()
})

//слушатели на кнопки запуск/стоп
play.addEventListener("click", playAnimation)
stop.addEventListener("click", stopAnimation)

//Отображение данных по умолчанию (после первого рендера страницы)
function insertMassOption(option) {
    option.forEach((item)=>{
        let newOption = document.createElement('OPTION');
        newOption.setAttribute('value', item)
        let text = document.createTextNode(`${item} kg`)
        newOption.appendChild(text)
        if (item === 0.5) {
            state.mass = item
            newOption.setAttribute('selected', 'selected')
            ball.style.height = `${+50 + +item * 10}px`
            ball.style.width = `${+50 + +item * 10}px`
        }
        mass.appendChild(newOption)
})}

function insertRateOption(option) {
    option.forEach((item)=>{
        let newOption = document.createElement('OPTION');
        newOption.setAttribute('value', item)
        let text = document.createTextNode(`${item} N/м`)
        newOption.appendChild(text)
        if (item === 5) {
            state.rate = item
            newOption.setAttribute('selected', 'selected')
        }
        rate.appendChild(newOption)
})}

function insertX0Option(option) {
    option.forEach((item)=>{
        let newOption = document.createElement('OPTION');
        newOption.setAttribute('value', item)
        let text = document.createTextNode(`${item} cm`)
        newOption.appendChild(text)
        if (item === 10) {
            state.x0 = item
            newOption.setAttribute('selected', 'selected');
            ball.style.transform = `translateY(${item}px)`
            spring.style.height = `${+400 + +item}px`
            spring.style.backgroundSize = `45px ${+400 + +item}px`
        }
        x0.appendChild(newOption)
})}

//пересчет характеристик
function refreshProps(){
    cyclicFreq();
    clearCharacts()
}

//запуск анимации
function playAnimation(){
    activateStopButton();
    disableParams();
    clearCharacts();
    calcT();
    timeFreq();
    timeSec();
}

//остановка анимации
function stopAnimation(){
    activatePlayButton()
    clearInterval(intervalID);
    clearInterval(intervalID2);
    enableParams()
}

//смена кнопки запуска/стоп
function activatePlayButton(){
    stop.style.display = 'none';
    play.style.display = 'block';
}
function activateStopButton(){
    stop.style.display = 'block';
    play.style.display = 'none';
}

//деактивация/активация селектов
function disableParams(){
    mass.disabled = true;
    rate.disabled = true;
    x0.disabled = true;
}

function enableParams(){
    mass.disabled = false;
    rate.disabled = false;
    x0.disabled = false;
}

//Очистка параметров
function clearCharacts(){
    state.t = null;
    state.numVibrations = null;
    state.x = null;
    time.innerHTML = state.t;
    x.innerHTML = state.x
    numVibrations.innerHTML = state.numVibrations
}

//Определяет и устанавливает период колебаний
function calcT(){
    state.T = Math.PI * Math.sqrt(mass.value / rate.value) * 1000;
    console.log(rate.value);
    spring.style.transition = `all ease-in-out ${state.T/1000}s`;
    ball.style.transition = `all ease-in-out ${state.T/1000}s`
}

//•	циклическая частота собственных колебаний 
function cyclicFreq() {
    let w0 = Math.sqrt(rate.value / mass.value)
    state.w0 = w0;
    state.rate = rate.value;
    state.mass = mass.value;
    freq.innerHTML = w0
}

//•	время колебаний 
let intervalID;
function timeFreq(){
    state.numVibrations = 0;
    intervalID = setInterval(() => {
        if (state.x0 > 0) {
            calcX();
        } if (state.x0 == 0) {clearInterval(intervalID), clearInterval(intervalID2), enableParams(), activatePlayButton()}
    } , 1000);
}

//Счетчик секунд
let intervalID2;
function timeSec(){
    let t = 0;
    time.innerHTML = t + ' s'
    intervalID2 = setInterval(() => {
        if (state.x0 > 0) {
            t++;
            state.t = t;
            time.innerHTML = t + ' s';
        } if (state.x0 == 0) {clearInterval(intervalID), clearInterval(intervalID2), enableParams(), activatePlayButton()}
    }, 1000)
}

//•	количество полных колебаний 
function calcN(){
    state.numVibrations = (state.t / state.T)*1000/2;
    numVibrations.innerHTML = Math.round(state.numVibrations)
}

//•	координата x
function calcX(){
    let xCoord = state.x0*Math.cos(state.w0*state.t)
    calcN()
    if (Math.abs(xCoord) > Math.abs(state.x) && state.x !== null) {
        clearInterval(intervalID);
        clearInterval(intervalID2)
        xCoord = 0;
        enableParams()
        activatePlayButton()
    }
    if (state.x0 === 0) {
        clearInterval(intervalID);
        clearInterval(intervalID2);
        xCoord = 0;
    }
    x.innerHTML = xCoord;
    state.x = xCoord;
    ball.style.transform = `translateY(${xCoord}px)`;
    spring.style.height = `${+400 + +xCoord}px`
    spring.style.backgroundSize = `45px ${+400 + +xCoord}px`
}