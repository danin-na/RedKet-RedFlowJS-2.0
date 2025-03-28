class Marquee_01 extends HTMLElement
{
    //--------------------------------------------
    // --------------------------- Component State

    // -- Data Attr
    #animPlay

    // -- Ref Html
    #slider

    // -- Cache Array
    #cacheClick
    #cacheResize
    #cacheInView

    // -- Anim State
    #gsapTween
    #gsapTweenProg


    // -- Node State
    #inView
    #isConnected

    //--------------------------------------------
    // ----------------------- lifecycle callbacks

    constructor()
    {
        super()
    }

    static get observedAttributes ()
    {
        return ['anim-play']
    }

    attributeChangedCallback (n, o, v)
    {
        if (o !== v && this.#isConnected) {
            // -- Animation Attribute

            this.#fn.animAttr()

            // -- Animation Render

            this.#fn.animRender()

            // -- If not intersected, Pause

            if (!this.#st.observe.isIntersecting) this.#gsapTween.pause()
        }
    }

    connectedCallback ()
    {
        this.#attr()
        this.#ref()
        this.#init()

        this.#fn.animRender()

        /*
        this.#st.observe.resize = observe_Resize(this, () =>
        {
            this.#fn.animRender()
            if (!this.#st.observe.isIntersecting) {
                this.#gsapTween.pause()
            }
        })

        // -- Observer - Intersect Implement

        this.#st.observe.intersecting = observe_Intersect(this, (entry) =>
        {
            this.#st.observe.isIntersecting = entry.isIntersecting
            if (entry.isIntersecting && this.#gsapTween && !this.#gsapTween.isActive()) {
                this.#gsapTween.resume()
            } else if (this.#gsapTween && this.#gsapTween.isActive()) {
                this.#gsapTween.pause()
            }
        })

        */
        // -- Element is Connected, now ChangedCallback works

        this.#isConnected = true
    }

    disconnectedCallback ()
    {
        this.#fn.clearLeak()
    }

    //--------------------------------------------
    // -------------------------  Utilities Helper

    #attr ()
    {
        this.#animPlay = this.getAttribute('anim-play')
    }

    #ref ()
    {
        this.#slider = this.querySelectorAll('[ref-slider]')
    }

    #init ()
    {
        if (!this.#slider || this.#slider.length === 0 || this.#slider.length > 2) {
            throw new error('child ref "rf-ref-slider" does not exist or there are too many')
        }

        if (this.#slider.length == 1) this.appendChild(this.#slider[0].cloneNode(true))
    }

    play ()
    {
        // -- kill animation / but save animation position

        if (this.#gsapTween) {
            this.#gsapTweenProg = this.#gsapTween.progress()
            this.#gsapTween.progress(0).kill()
            this.#gsapTween = null
        }

        this.slider = this.querySelectorAll('[ref-slider]')
        const w = this.#slider[0].getBoundingClientRect().width

        //TODO Create timeline

        this.#gsapTween = gsap.fromTo(
            this.#slider,
            { x: this.#rf.anim.direction === 'left' ? 0 : -w },
            {
                x: this.#rf.anim.direction === 'left' ? -w : 0,
                duration: this.#rf.anim.duration,
                ease: this.#rf.anim.ease,
                repeat: -1,
            }
        )

        this.#gsapTween.progress(this.#gsapTweenProg)
    }

    #pause ()
    {
        this.#gsapTween.pause()
    }

    #resume ()
    {
        this.#gsapTween.resume()
    }

    clearLeak ()
    {
        // -- Clear Memory Leak
        if (this.#gsapTween) this.#gsapTween.progress(0).kill()

        /*
    // Disconnect ResizeObserver
    if (this.#st.observe.resize) {
        this.#st.observe.resize.disconnect()
        this.#st.observe.resize = null
    }

    // Disconnect IntersectionObserver
    if (this.#st.observe.intersecting) {
        this.#st.observe.intersecting.disconnect()
        this.#st.observe.intersecting = null
    }

    // -- Null-ing Attribute
    this.#gsapTweenProg = null
    this.#gsapTween = null
    this.#st.life.isConnected = null

    this.#st.observe.resize = null
    this.#st.observe.intersecting = null // optional
    this.#st.observe.isIntersecting = null // optional

    this.#slider = null
    this.#rf.anim.ease = null // optional
    this.#rf.anim.duration = null // optional
    this.#rf.anim.direction = null // optional
    */
    }

    #nulling () { }

    //--------------------------------------------
    // ------------------------------- Private API

    // -- Empty

    //--------------------------------------------
    // -------------------------------- Public API

    // -- Empty
}