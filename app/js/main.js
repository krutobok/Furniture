


const topSliderItems = document.querySelectorAll('.top-slider__item')

const menuBtn = document.querySelector('.header__mobile-menu')
const menu = document.querySelector('.header__menu-list')
const menuRight = document.querySelector('.header__right')
const menuInner = document.querySelector('.header__inner')

menuBtn.addEventListener('click', menuFunction)

function menuFunction() {
    menu.classList.toggle('active')
    menuRight.classList.toggle('active')
    menuBtn.classList.toggle('active')
}
function menuResize(){
    if (document.documentElement.clientWidth < 641){
        menuRight.appendChild(menu)
    }
    else{
        menuInner.appendChild(menu)
    }
}
menuResize()



function check_webp_feature(feature, callback) {
    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    };
    var img = new Image();
    img.onload = function () {
        var result = (img.width > 0) && (img.height > 0);
        callback(feature, result);
    };
    img.onerror = function () {
        callback(feature, false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
}

// example usage
check_webp_feature('lossy', function (feature, isSupported) {
    if (isSupported) {
        topSliderItems.forEach(elem => elem.style.backgroundImage =
            elem.style.backgroundImage + ', linear-gradient(180deg, rgba(0, 0, 0, 0.2) -13.19%, rgba(0, 0, 0, 0.85) 94.01%)')
    }
    else{
        topSliderItems.forEach(elem => {
            let bg = elem.style.backgroundImage.toString()
            bg = bg.slice(0, -6)+'jpg")'
            elem.style.backgroundImage =
                bg + ', linear-gradient(180deg, rgba(0, 0, 0, 0.2) -13.19%, rgba(0, 0, 0, 0.85) 94.01%)'
        })
    }
});




function slider(sliderContent) {
    const slider = document.querySelector(sliderContent)
    const sliderInner = slider.closest('[data-slider="wrapper"]')
    const parentBlock =   slider.closest('[data-slider="parent-block"]')
    sliderInner.style.transition = 'left .5s'
    let items = slider.children
    let width = window.getComputedStyle(items[0]).getPropertyValue('width')
    width = parseInt(width.substring(0, width.length-2))
    let margin = window.getComputedStyle(items[0]).getPropertyValue('margin-right')
    margin = parseInt(margin.substring(0,margin.length-2))
    const parent = slider.closest('[data-slider="inner"]')
    const btnRight = parentBlock.querySelector('[data-arrow="right"]')
    const btnLeft = parentBlock.querySelector('[data-arrow="left"]')
    let animSlider
    if (parentBlock.hasAttribute('data-anim')){
        if(parentBlock.getAttribute('data-anim') === 'true'){
            animSlider = document.querySelector('.top-slider__btn-box')
        }
    }
    let slideCounter = 1
    let sliderPos
    let currentSlide = 1
    let dots = []
    let isDots
    let isCenterMode
    let currentRight
    let currentLeft
    let interval
    let isAutoplay
    let time
    let centerSliderCounter = 0
    if (parentBlock.hasAttribute('data-dots')){
        if (parentBlock.getAttribute('data-dots') === 'true'){
            isDots = true
        }
    }
    else{
        isDots = false
    }
    if (parentBlock.hasAttribute('data-center-mode')){
        if (parentBlock.getAttribute('data-center-mode') === 'true'){
            isCenterMode = true
            for (let i = 0; i < document.documentElement.clientWidth/width; i++){
                centerSliderCounter++
            }
            sliderPos = -(width*centerSliderCounter-((document.documentElement.clientWidth-width)/2))
            slider.style.left = -sliderPos + (-2*width + (((document.documentElement.clientWidth-width)/2))) + 'px'
            sliderInner.style.left = -(width*centerSliderCounter-((document.documentElement.clientWidth-width)/2)) + 'px'
        }
    }
    else{
        isCenterMode = false
        sliderPos = -width-margin
        sliderInner.style.left = -width-margin + 'px'
    }

    if (parentBlock.hasAttribute('data-autoplay')){
        isAutoplay = true
        time = parseFloat(parentBlock.getAttribute('data-autoplay'))
    }
    if (isDots){
        const dotsInner = parentBlock.querySelector('[data-slider="dots-box"]')
        for (let i = 0; i < items.length; i++){
            const elem = document.createElement('button')
            elem.classList.add('dot')
            elem.textContent = i+1
            elem.dataset.id = i+1
            dots.push(elem)
            dotsInner.append(elem)
        }
        dots[0].classList.add('active')
        dots.forEach(elem => {
            elem.addEventListener('click', ()=> {
                let id = parseInt(elem.getAttribute('data-id'))
                if (id > currentSlide){
                    currentRight = Math.abs(id - currentSlide)
                    moveRight()
                }
                else if (id < currentSlide){
                    currentLeft = Math.abs(currentSlide - id)
                    moveLeft()
                }

            })
        })
    }


    function move() {
        if (isAutoplay){
            animSlider.classList.remove('active')
            clearInterval(interval)
            interval = null
        }
        if(slideCounter === -1){
            slideCounter = slideCounter + items.length
        }
        currentSlide = slideCounter % items.length
        if (currentSlide === 0){
            currentSlide = items.length
        }
        if (isCenterMode){
            for (let i = 0; i < items.length; i++){
                items[i].classList.remove('active')
            }
        }
        setTimeout(()=> {
            items[(currentSlide+items.length-1)%items.length].style.order = '1'
            for (let i = items.length - 1; i > 0; i--){
                items[(currentSlide+i-1)%items.length].style.order = (i+2).toString()
            }
            if (isCenterMode){
                slider.style.left = -sliderPos + (-2*width + (((document.documentElement.clientWidth-width)/2))) + 'px'
                for (let i = 0; i < items.length; i++){
                    if (items[i].style.order === '4'){
                        items[i].classList.add('active')
                    }
                }
            }
            else{
                slider.style.left = -sliderPos - (width + margin) + 'px'
            }
            if (isDots){
                dots.forEach(elem => elem.classList.remove("active"))
                dots[currentSlide-1].classList.add('active')
            }
            if (currentLeft > 0){
                currentLeft--
                if (currentLeft > 0){
                    moveLeft()
                }
            }
            if (currentRight > 0){
                currentRight--
                if (currentRight > 0){
                    moveRight()
                }
            }
            if (isAutoplay){
                if (interval === null){
                    interval = setInterval(moveRight, time*1000)
                    animSlider.classList.add('active')
                }
            }
        }, 500)
    }
    function moveRight(){
        sliderPos = sliderPos - (width + margin)
        sliderInner.style.left = sliderPos + 'px'
        slideCounter += 1
        move()
    }
    function moveLeft(){
        sliderPos = sliderPos + (width + margin)
        sliderInner.style.left = sliderPos + 'px'
        slideCounter -= 1
        move()
    }
    btnRight.addEventListener('click', ()=> {
        moveRight()
    })
    btnLeft.addEventListener('click', ()=> {
        moveLeft()
    })
    let pos
    parent.addEventListener('touchstart', function() {
        pos = 0
    })
    parent.addEventListener('touchmove', function(e) {
        let touchLocation = e.targetTouches[0];
        if (pos === 0){
            pos = touchLocation.pageX
        }
        let posEnd
        parent.ontouchend = () => {
            posEnd = touchLocation.pageX
            if (pos > posEnd){
                moveRight()
            }
            if (pos < posEnd){
                moveLeft()
            }
        }
    })
    parent.onmousedown = e =>{
        let pos = e.pageX
        let posEnd
        parent.onmouseup = (e) => {
            posEnd = e.pageX
            if (pos > posEnd){
                moveRight()
            }
            if (pos < posEnd){
                moveLeft()
            }
        }
    }
    if (isAutoplay){
        interval = setInterval(moveRight, time*1000)
        animSlider.classList.add('active')
    }
}


const modalsBtn = [].slice.call(document.querySelectorAll('button[data-modal="modal"]'))
const modalWindow = document.querySelector('.modal')
const modalInner = document.querySelector('.modal__inner')
const form = document.querySelector('.modal__form')
const modalBg = document.querySelector('.modal__bg')
const modalBtnClose = document.querySelector('.btn__modal--close')
// const modalBtnSubmit = document.querySelector('.modal__btn')
const modalTitle = document.querySelector('.modal__title')
const modalTextarea = document.querySelector('.modal__textarea')
const modalCheckbox = document.querySelector('.modal__checkbox')
const modalText = document.querySelector('.modal__text ')
const input1 = document.querySelector('.modal__input--1')
const input2 = document.querySelector('.modal__input--2')
function modal(){
    form.addEventListener('submit', onSubmit);
    modalsBtn.forEach(btn => {
        btn.addEventListener('click', function modalOpen() {
            modalWindow.classList.add('active')
            form.classList.remove('close')
            modalBtnClose.classList.remove('thanked')
            modalInner.classList.remove('thanked')
            if (btn.getAttribute('data-modal-num') === '1'){
                modalTitle.textContent = 'Хочете отримати подарунок?'
                modalText.textContent = 'Заповніть форму,  і ми звяжемося та розповімо про умови акції'
                modalTextarea.classList.remove('active')
            }
            else if (btn.getAttribute('data-modal-num') === '2'){
                modalTitle.textContent = 'Поговоримо?'
                modalText.textContent = 'Заповніть форму, і ми звяжемося та обговоримо з вами усі деталі'
                modalTextarea.classList.add('active')
                modalTextarea.setAttribute('placeholder', 'Тема')
            }
            else if (btn.getAttribute('data-modal-num') === '3'){
                modalTitle.textContent = 'Хочете стати нашим партнером?'
                modalText.textContent = 'Заповніть форму, і ми звяжемося та обговоримо з вами усі деталі'
                modalTextarea.classList.add('active')
                modalTextarea.setAttribute('placeholder', 'Коротко про себе')
            }
        })
    })
    function close(){
        input1.value = ''
        input2.value = ''
        modalWindow.classList.remove('active')
        input1.classList.remove('invalid')
        input2.classList.remove('invalid')
        modalTextarea.value = ''
    }
    modalBg.addEventListener('click', function () {
        close()
    })
    modalBtnClose.addEventListener('click', function () {
        close()
    })
    input1.addEventListener('input', ()=> input1.classList.remove('invalid'))
    input2.addEventListener('input', ()=> input2.classList.remove('invalid'))
    modalCheckbox.addEventListener('change', ()=>{modalCheckbox.closest('label').classList.remove('invalid')})
    function onSubmit(event) {
        event.preventDefault();
        let counter = 3
        const inputValue1 = input1.value
        const inputValue2 = input2.value
        if (inputValue2 === ''){
            input2.classList.add('invalid')
            counter--
        }
        if (inputValue1 === ''){
            input1.classList.add('invalid')
            counter--
        }
        if (!modalCheckbox.checked){
            modalCheckbox.closest('label').classList.add('invalid')
            counter--
        }
        if (counter >= 3){
            thank()
        }
    }
    function thank() {
        form.classList.add('close')
        modalInner.classList.add('thanked')
        modalBtnClose.classList.add('thanked')
        modalTitle.textContent = 'Дякуюємо!'
        modalText.textContent = 'Ваша заявка успішно відправилена'
    }
}
modal()

const forms = [].slice.call(document.querySelectorAll('form[data-form="thank"]'))





function formThank() {
    forms.forEach(form => {
        form.addEventListener('submit', onSubmit);
        const button = form.querySelector('button[type="submit"]')
        button.addEventListener('click',()=> {
            const input = [].slice.call(form.querySelectorAll('input'))
            let inputCounter = 0
            input.forEach(elem => {
                elem.addEventListener('input', ()=> elem.classList.remove('invalid'))
                if (elem.value === '' && elem.getAttribute('type') !== 'file'){
                    elem.classList.add('invalid')
                }
                else if(elem.value === '' && elem.getAttribute('type') === 'file'){
                    elem.closest('label').classList.add('invalid')
                    elem.addEventListener('change', ()=>{
                        elem.closest('label').classList.remove('invalid')
                    })

                }
                else  if (elem.getAttribute('type') === 'checkbox'){
                    if (elem.checked){
                        inputCounter++
                    }
                    else{
                        elem.closest('label').classList.add('invalid')
                        elem.addEventListener('change', ()=>{
                            elem.closest('label').classList.remove('invalid')
                        })
                    }
                }
                else  if (elem.value !== '' && elem.getAttribute('type') !== 'checkbox'){
                    inputCounter++
                }
            })
            if (inputCounter >= input.length){
                const changeElem = form.closest('div[data-form="change"]')
                changeElem.classList.add('active')
                const parent = form.closest('div[data-form="parent"]')
                const thank = parent.querySelector('div[data-form="thank"]')
                thank.classList.add('active')
                changeElem.classList.remove('resend')
                thank.classList.remove('resend')
                const resendBtn = thank.querySelector('button[data-form="resend"]')
                resendBtn.addEventListener('click', ()=>{
                    changeElem.classList.remove('active')
                    changeElem.classList.add('resend')
                    thank.classList.add('resend')
                    thank.classList.remove('active')
                })
            }
        })
    })
    function onSubmit(event) {
        event.preventDefault();
    }
}
formThank()


const benefitsAnimation = document.querySelector('.benefits__anim')
const benefitsItems = benefitsAnimation.querySelectorAll('.benefits__item')
let cords
let itemsHeight = []
let itemsCords = []
function benefitsPrev() {
    cords = getCoords(benefitsAnimation)
    itemsHeight = []
    itemsCords = []
    benefitsItems.forEach(elem => {
        itemsHeight.push(elem.offsetHeight)
    })
    for (let l = 0; l < benefitsItems.length; l++) {
        let plusCords = 0
        for (let i = 0; i <= l; i++) {
            plusCords += itemsHeight[i]
        }
        itemsCords.push(plusCords + cords.top)
    }
}

if (document.documentElement.clientWidth > 839){
    benefitsPrev()
    benefitsAnimation.addEventListener('mousemove', benefits)
    benefitsAnimation.addEventListener('mouseout', benefitsMouseout)
}
else {
    benefitsAnimation.removeEventListener('mousemove', benefits)
    benefitsAnimation.removeEventListener('mouseout', benefitsMouseout)
}
function benefitsMouseout() {
    benefitsItems.forEach(elem => {
        elem.querySelector('.benefits__img').classList.remove('active')
        elem.classList.remove('active')
    })
}



function benefits(event) {
    let benefitsItemActive
    for (let i = 0; i<itemsCords.length; i++){
        if (Math.floor(itemsCords[i]+60) > Math.floor(event.pageY)){
            benefitsItemActive = benefitsItems[i].querySelector('.benefits__img')
            benefitsItems.forEach(elem => {
                elem.querySelector('.benefits__img').classList.remove('active')
                elem.classList.remove('active')
            })
            benefitsItemActive.style.transition = 'height .3s'
            benefitsItems[i].classList.add('active')
            benefitsItemActive.classList.add('active')
            break
        }
        else if (Math.floor(itemsCords[i] + 120) > Math.floor(event.pageY) && itemsCords.length-1 === i){
            benefitsItemActive = benefitsItems[i].querySelector('.benefits__img')
            benefitsItems.forEach(elem => {
                elem.querySelector('.benefits__img').classList.remove('active')
                elem.classList.remove('active')
            })
            benefitsItems[i].classList.add('active')
            benefitsItemActive.classList.add('active')
            benefitsItemActive.style.transition = 'height .05s'
        }
    }
    benefitsItemActive.style.top = event.pageY - cords.top -120 + 'px'
    benefitsItemActive.style.left = event.pageX -170 + 'px'
}

function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

const anchors = [].slice.call(document.querySelectorAll('a[href*="#"]')),
    animationTime = 500,
    framesCount = 120;

anchors.forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault();

        let coordY = document.querySelector(item.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset;
        let coordY2 = (coordY-window.pageYOffset)
        let scroller = setInterval(function() {
            let scrollBy = (Math.abs(coordY2) / framesCount);
            if (coordY2>0){
                if(scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
                    window.scrollBy(0, scrollBy);
                } else {
                    window.scrollTo(0, coordY);
                    clearInterval(scroller);
                }
            }
            else if (coordY2<0){
                if(scrollBy < window.pageYOffset - coordY) {
                    window.scrollBy(0, -scrollBy);
                } else {
                    window.scrollTo(0, coordY);
                    clearInterval(scroller);
                }
            }
            else if (coordY2){
                clearInterval(scroller);
            }
        }, animationTime / framesCount);
    });
});


const scrollItems = document.querySelectorAll('.animate');

const scrollAnimation = () => {
    let windowCenter = window.innerHeight + window.scrollY;
    scrollItems.forEach(el => {
        let scrollOffset = getCoords(el).top + (el.offsetHeight / 2);
        if (windowCenter-el.offsetHeight >= scrollOffset) {
            if (windowCenter-window.innerHeight < scrollOffset){
                el.classList.add('animation-active');
            }
        }
    });
};


scrollAnimation();
window.addEventListener('scroll', () => {
    scrollAnimation();
});



slider('.top-slider__content')
slider('.in-work-slider__content')
slider('.partners-slider__content')

window.addEventListener('resize',  ()=> {
    menuResize()
    if (document.documentElement.clientWidth > 839){
        benefitsPrev()
        benefitsAnimation.addEventListener('mousemove', benefits)
        benefitsAnimation.addEventListener('mouseout', benefitsMouseout)
    }
    else {
        benefitsAnimation.removeEventListener('mousemove', benefits)
        benefitsAnimation.removeEventListener('mouseout', benefitsMouseout)
    }
});



