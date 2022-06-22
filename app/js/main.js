const topSliderItems = document.querySelectorAll('.top-slider__item')

topSliderItems.forEach(elem => elem.style.backgroundImage = elem.style.backgroundImage + ', linear-gradient(180deg, rgba(0, 0, 0, 0.2) -13.19%, rgba(0, 0, 0, 0.85) 94.01%)')

function slider(sliderContent) {
    const slider = document.querySelector(sliderContent)
    const sliderInner = slider.closest('[data-slider="wrapper"]')
    const parentBlock =   slider.closest('[data-slider="parent-block"]')
    sliderInner.style.transition = 'all .5s'
    let items = slider.children
    let width = window.getComputedStyle(items[0]).getPropertyValue('width')
    width = parseInt(width.substring(0, width.length-2))
    let margin = window.getComputedStyle(items[0]).getPropertyValue('margin-right')
    margin = parseInt(margin.substring(0,margin.length-2))
    sliderInner.style.left = -width-margin + 'px'
    const parent = slider.closest('[data-slider="inner"]')
    const btnRight = parentBlock.querySelector('[data-arrow="right"]')
    const btnLeft = parentBlock.querySelector('[data-arrow="left"]')
    let slideCounter = 1
    let sliderPos = -width-margin
    let currentSlide = 1
    let dots = []
    let isDots
    if (parentBlock.getAttribute('data-dots') === 'true'){
        isDots = true
    }
    if (isDots){
        const dotsInner = parentBlock.querySelector('[data-slider="dots-box"]')
        for (let i = 0; i < items.length; i++){
            const elem = document.createElement('button')
            elem.classList.add('top-slider__dot')
            elem.textContent = i+1
            if (items.length === i+1){
                elem.dataset.id = 0
            }
            else{
                elem.dataset.id = i+1
            }
            dots.push(elem)
            dotsInner.append(elem)
        }
        dots[0].classList.add('active')
        dots.forEach(elem => {
            elem.addEventListener('click', ()=> {
                let id = parseInt(elem.getAttribute('data-id'))
                // let insideSlide = currentSlide
                // if (insideSlide === 0){
                //     insideSlide = items.length
                // }
                if (id === 0 && currentSlide === items.length-1){
                    id = items.length
                }
                if (id === items.length-1 && currentSlide === 0){
                    id = -1
                }

                // else if (id !== 0 && currentSlide === 0){
                //     id = -id
                // }

                if (id > currentSlide){
                    let counter = Math.abs(id - currentSlide)
                    console.log('right')
                    moveRight(counter)
                }
                else if (id < currentSlide){
                    let counter = Math.abs(currentSlide - id)
                    console.log('left')
                    moveLeft(counter)
                }
                // if (id > insideSlide){
                //     let counter = Math.abs(id - insideSlide)
                //     console.log('right')
                //     moveRight(counter)
                // }
                // else if (id < insideSlide){
                //     let counter = Math.abs(insideSlide - id)
                //     console.log('left')
                //     moveLeft(counter)
                // }
            })
        })
    }
    function move(counter = 1) {
        if(slideCounter === -1){
            slideCounter = slideCounter + items.length
        }
        currentSlide = slideCounter % items.length
        setTimeout(()=> {
            slider.style.left = -sliderPos - (width + margin)*counter + 'px'
            items[(currentSlide+items.length-1)%items.length].style.order = '1'
            if (isDots){
                dots.forEach(elem => elem.classList.remove("active"))
                if (currentSlide === 0){
                    dots[dots.length-1].classList.add('active')
                }else{
                    dots[currentSlide-1].classList.add('active')
                }
            }
            for (let i = items.length-1; i > 0; i--){
                items[(currentSlide+i-1)%items.length].style.order = (i+2).toString()
            }
        }, 500)
    }
    function moveRight(counter=1){
        sliderPos = sliderPos - width - margin
        sliderInner.style.left = sliderPos + 'px'
        slideCounter += counter
        move(counter)
    }
    function moveLeft(counter=1){
        sliderPos = sliderPos + width + margin
        sliderInner.style.left = sliderPos + 'px'
        slideCounter -= counter
        move(counter)
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
}
slider('.top-slider__content')
