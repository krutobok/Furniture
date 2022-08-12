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
slider('.top-slider__content')
slider('.partners-slider__content')
