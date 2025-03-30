class Slider_01 extends HTMLElement
{
    // --------------------------------------------
    // -- Element - State -------------------------
    // --------------------------------------------

    #state = {
        anim: { opt: {}, loopBack: false, autoMode: false, autoTime: 0, autoTimeId: 0, slideStep: 0, tween: null },
        node: { mask: null, slide: null, nextBtn: null, prevBtn: null, currentSlide: 0, isConnected: false },
    }

    // --------------------------------------------
    // -- Lifecycle - Callbacks -------------------
    // --------------------------------------------

    constructor()
    {
        super()
    }

    static get observedAttributes ()
    {
        return ["anim-opt"]
    }

    attributeChangedCallback (n, o, v)
    {
        if (o !== v && this.#state.node.isConnected) {
            // -- Empty
        }
    }

    connectedCallback ()
    {
        this.#api.animationInit()
        this.#state.node.isConnected = true
    }

    disconnectedCallback ()
    {
        this.#api.memoryClear()
        this.#state.node.isConnected = false
    }

    // --------------------------------------------
    // -- Private - API ---------------------------
    // --------------------------------------------

    #api = {
        animationInit: () =>
        {
            this.#fn.elementGet()
            this.#fn.animationSet()
            this.#fn.observerSet()
            this.#fn.animationAuto()
        },

        memoryClear: () =>
        {
            this.#fn.memoryClear()
        },
    }

    // --------------------------------------------
    // -- Private - Helper ------------------------
    // --------------------------------------------
    #fn = {
        elementSet: () =>
        {
            // -- empty
        },

        elementGet: () =>
        {
            const node = this.#state.node

            node.mask = this.querySelector("[ref-mask]")
            node.slide = this.querySelectorAll("[ref-slide]")
            node.nextBtn = this.querySelector("[ref-next]")
            node.prevBtn = this.querySelector("[ref-prev]")
        },

        // TODO - finish it
        observerSet: () =>
        {
            const node = this.#state.node

            if (node.nextBtn) observeEvent(node.nextBtn, 'click', () => this.#fn.animationNext())
            // if (this.#como_prevBtn) observeEvent(this.#como_prevBtn, 'click', () => this.#prev())
            /*
        observeResize(this, () => this.#reset(), 500, this.#cacheResize)
        observeIntersect(this, (e) => (this.#inView = e.isIntersecting), this.#cacheInView)
        */
        },

        animationSet: () =>
        {
            const anim = this.#state.anim
            const node = this.#state.node

            const {
                loopBack = false,
                autoMode = false,
                autoTime = 0,
                slideStep = 0,
                ...userOpts
            } = fn.getAttr(this, "anim-opts", "json") || {}

            node.currentSlide = 0
            anim.loopBack = loopBack
            anim.autoMode = autoMode
            anim.autoTime = autoTime
            anim.slideStep = slideStep
            anim.opt = { duration: 0.5, ease: "none", ...userOpts }
        },

        // TODO : fix later
        animationAuto: (active) =>
        {
            const anim = this.#state.anim

            if (anim.autoMode && active) {
                this.#fn.animationNext()
                anim.autoTimeId = setTimeout(() => this.#fn.animationAuto(), anim.autoTime)
            }
        },

        animationNext: () =>
        {
            const anim = this.#state.anim
            const node = this.#state.node

            const newSlide = node.currentSlide - anim.slideStep
            if (newSlide >= 0) {
                node.currentSlide = newSlide
                this.#fn.animationRun()
            } else if (anim.loopBack) {
                node.currentSlide = node.slide.length - 1
                this.#fn.animationRun()
            }
        },

        animationRun: () =>
        {
            const anim = this.#state.anim
            const node = this.#state.node

            const offset =
                node.slide[node.currentSlide].getBoundingClientRect().left - node.mask.getBoundingClientRect().left

            anim.tween?.kill()
            anim.tween = gsap.timeline()
            anim.tween.to(node.mask, { x: -offset, ...anim.opt })
        },

        animationReset: () =>
        {
            const anim = this.#state.anim
            const node = this.#state.node

            const offset =
                node.slide[node.currentSlide].getBoundingClientRect().left - node.mask.getBoundingClientRect().left

            anim.tween?.kill()
            anim.tween = gsap.timeline()
            anim.tween.to(node.mask, { x: -offset, duration: 0, })
        },

        // TODO - finish it
        memoryClear: () =>
        {
            /*
            this.#cacheClick.forEach((cleanup) => cleanup())
    
            this.#cacheResize.forEach((cleanup) => cleanup())
    
            this.#cacheInView.forEach((cleanup) => cleanup())
    
            this.#gsapTween?.progress(0).kill()
    
            clearTimeout(this.#anim_autoTimeId)
            */
        },
    }

}
