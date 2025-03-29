
class Slider_01 extends HTMLElement
{
    // --------------------------------------------
    // -- Element - State -------------------------
    // --------------------------------------------

    #comp_mask = null
    #comp_slides = null
    #comp_nextBtn = null
    #como_prevBtn = null

    #isConnected = false

    //--------------------------------------------
    // ----------------------- lifecycle callbacks

    constructor()
    {
        super()
    }

    static get observedAttributes ()
    {
        return ['loop-back', 'auto-mode', 'auto-time', 'slide-step']
    }

    attributeChangedCallback (n, o, v)
    {
        if (o !== v && this.#isConnected) {

        }
    }

    connectedCallback ()
    {
        this.#attr()
        this.#ref()
        this.#_comp_set_event()
        this.#auto()
        this.#isConnected = true
    }

    disconnectedCallback ()
    {
        this.#clearLeak()
    }

    // --------------------------------------------
    // -- Private - Helper ------------------------
    // --------------------------------------------

    #_comp_set_el ()
    {
        // -- empty
    }

    #_comp_get_el ()
    {
        this.#comp_mask = this.querySelector('[ref-mask]')
        this.#comp_slides = this.querySelectorAll('[ref-slide]')
        this.#comp_nextBtn = this.querySelector('[ref-next]')
        this.#como_prevBtn = this.querySelector('[ref-prev]')
    }

    #_comp_set_event ()
    {
        /*
        if (this.#comp_nextBtn) observeEvent(this.#comp_nextBtn, 'click', () => this.#_anim_next(), this.#cacheClick)
        if (this.#como_prevBtn) observeEvent(this.#como_prevBtn, 'click', () => this.#prev(), this.#cacheClick)
        observeResize(this, () => this.#reset(), 500, this.#cacheResize)
        observeIntersect(this, (e) => (this.#inView = e.isIntersecting), this.#cacheInView)
        */
    }

    #anim_opt
    #anim_loopBack
    #anim_autoMode
    #anim_autoTime
    #anim_slideStep
    #anim_autoTimeId

    #_anim_get_opt ()
    {
        const _anim_user = getAttr(this, 'anim-opts', 'json') || {}

        this.#anim_loopBack = _anim_user.loopBack || false
        this.#anim_autoMode = _anim_user.autoMode || false
        this.#anim_autoTime = _anim_user.autoTime || 0
        this.#anim_slideStep = _anim_user.slideStep || 0

        delete _anim_user.loopBack
        delete _anim_user.autoMode
        delete _anim_user.autoTime
        delete _anim_user.sideStep

        const _anim_deft = { duration: 0.5, ease: 'none' }
        this.#anim_opt = { ..._anim_deft, ..._anim_user }
    }





    #auto ()
    {
        if (this.#anim_autoMode && this.#inView) {
            this.#_anim_next()
        }
        this.#anim_autoTimeId = setTimeout(() => this.#auto(), this.#anim_autoTime)
    }

    #_anim_next ()
    {
        const newSlide = this.#currentSlide + this.#anim_slideStep
        if (newSlide <= this.#comp_slides.length - 1) {
            this.#currentSlide = newSlide
            this.#animate()
        } else if (this.#anim_loopBack) {
            this.#currentSlide = 0
            this.#animate()
        }
    }

    #prev ()
    {
        const newSlide = this.#currentSlide - this.#anim_slideStep
        if (newSlide >= 0) {
            this.#currentSlide = newSlide
            this.#animate()
        } else if (this.#anim_loopBack) {
            this.#currentSlide = this.#comp_slides.length - 1
            this.#animate()
        }
    }

    #anim_tween

    #_anim_run ()
    {
        const targetSlide = this.#comp_slides[this.#currentSlide]
        const containerRect = this.#comp_mask.getBoundingClientRect()
        const slideRect = targetSlide.getBoundingClientRect()
        const offset = slideRect.left - containerRect.left

        this.#anim_tween?.kill()
        this.#anim_tween = gsap.timeline()
        this.#anim_tween.to(this.#comp_mask, {
            x: -offset,
            duration: 0.5,
            ease: 'none',
        })
    }

    #reset ()
    {
        const targetSlide = this.#comp_slides[this.#currentSlide]
        const containerRect = this.#comp_mask.getBoundingClientRect()
        const slideRect = targetSlide.getBoundingClientRect()
        const offset = slideRect.left - containerRect.left

        this.#anim_tween?.kill()
        this.#anim_tween = gsap.timeline()
        this.#anim_tween.to(this.#comp_mask, {
            x: -offset,
            duration: 0,
        })
    }

    #clearLeak ()
    {
        this.#cacheClick.forEach((cleanup) => cleanup())

        this.#cacheResize.forEach((cleanup) => cleanup())

        this.#cacheInView.forEach((cleanup) => cleanup())

        this.#gsapTween?.progress(0).kill()

        clearTimeout(this.#anim_autoTimeId)
    }


    //--------------------------------------------
    // ------------------------------- Private API

    // -- Empty

    //--------------------------------------------
    // -------------------------------- Public API

    // -- Empty
}