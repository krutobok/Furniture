const topSliderItems = document.querySelectorAll('.top-slider__item')

topSliderItems.forEach(elem => elem.style.backgroundImage = elem.style.backgroundImage + ', linear-gradient(180deg, rgba(0, 0, 0, 0.2) -13.19%, rgba(0, 0, 0, 0.85) 94.01%)')

function slider(sliderContent) {
    const slider = document.querySelector(sliderContent)
    const sliderInner = slider.closest('[data-slider="wrapper"]')
    const parentBlock =   slider.closest('[data-slider="parent-block"]')
    sliderInner.style.transition = 'left .5s'
    let items = slider.children
    console.log(items)
    let width = window.getComputedStyle(items[0]).getPropertyValue('width')
    width = parseInt(width.substring(0, width.length-2))
    let margin = window.getComputedStyle(items[0]).getPropertyValue('margin-right')
    margin = parseInt(margin.substring(0,margin.length-2))
    sliderInner.style.left = -width-margin + 'px'
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
    let sliderPos = -width-margin
    let currentSlide = 1
    let dots = []
    let isDots
    let currentRight
    let currentLeft
    let interval
    let isAutoplay
    let time
    if (parentBlock.getAttribute('data-dots') === 'true'){
        isDots = true
    }
    else{
        isDots = false
    }
    if (parentBlock.hasAttribute('data-autoplay')){
        isAutoplay = true
        time = parseFloat(parentBlock.getAttribute('data-autoplay'))
    }
    if (isDots){
        const dotsInner = parentBlock.querySelector('[data-slider="dots-box"]')
        for (let i = 0; i < items.length; i++){
            const elem = document.createElement('button')
            elem.classList.add('top-slider__dot')
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
        setTimeout(()=> {
            items[(currentSlide+items.length-1)%items.length].style.order = '1'
            for (let i = items.length - 1; i > 0; i--){
                items[(currentSlide+i-1)%items.length].style.order = (i+2).toString()
            }
            slider.style.left = -sliderPos - (width + margin) + 'px'
            if (isDots){
                dots.forEach(elem => elem.classList.remove("active"))
                dots[currentSlide-1].classList.add('active')
            }

            console.log('cur' + currentSlide)
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
        console.log(pos)
        parent.ontouchend = () => {
            posEnd = touchLocation.pageX
            console.log(posEnd)
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
const modalBtnSubmit = document.querySelector('.modal__btn')
const modalTitle = document.querySelector('.modal__title')
const modalTextarea = document.querySelector('.modal__textarea')
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
    function onSubmit(event) {
        event.preventDefault();
        const inputValue1 = input1.value
        const inputValue2 = input2.value
        if (inputValue1 !== '' && inputValue2 !== ''){
            thank()
        }
        else if (inputValue1 !== '' && inputValue2 === ''){
            input2.classList.add('invalid')
        }
        else if (inputValue1 === '' && inputValue2 !== ''){
            input1.classList.add('invalid')
        }
        else if (inputValue1 === '' && inputValue2 === ''){
            input1.classList.add('invalid')
            input2.classList.add('invalid')
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

const formBtn = [].slice.call(document.querySelectorAll('form[data-form="thank"]'))


function formThank() {

}



slider('.top-slider__content')
slider('.partners-slider__content')
