class Modal_01 extends HTMLElement
{
    //--------------------------------------------
    // --------------------------- Component State

    // -- Data Attr
    #animInit
    #animOpen
    #animClose
    #syncGroup

    // -- Ref Html
    #backdrop
    #container
    #closeBtn
    #triggerBtn

    // -- Cache Array
    #cacheClick

    // -- Anim State
    #gsapContainer
    #gsapBackdrop

    // -- Node State
    #isOpen
    #isConnected

    //--------------------------------------------
    // ----------------------- lifecycle callbacks

    constructor()
    {
        super()
        this.#nulling()
        this.setAttribute('role', 'dialog')
        this.setAttribute('aria-label', 'Modal Menu Navigation')
    }

    static get observedAttributes ()
    {
        return ['sync-group', 'anim-init', 'anim-open', 'anim-close']
    }

    attributeChangedCallback (n, o, v)
    {
        if (o !== v && this.#isConnected) {
            this.#attr()
        }
    }

    connectedCallback ()
    {
        this.#attr()
        this.#ref()
        this.#init()
        this.#isConnected = true
    }

    disconnectedCallback ()
    {
        this.#clearLeak()
    }

    //--------------------------------------------
    // -------------------------  Utilities Helper

    #attr ()
    {
        this.#syncGroup = getAttr(this, 'sync-group', 'string')
        this.#animInit = getAttr(this, 'anim-init', 'json')
        this.#animOpen = getAttr(this, 'anim-open', 'json')
        this.#animClose = getAttr(this, 'anim-close', 'json')
    }

    #ref ()
    {
        this.#closeBtn = this.querySelector('[ref-close]')
        this.#triggerBtn = this.querySelector('[ref-trigger]')
        this.#backdrop = this.querySelector('[ref-backdrop]')
        this.#container = this.querySelector('[ref-container]')
    }

    #init ()
    {
        observeEvent(this.#triggerBtn, 'click', () => this.#open(), this.#cacheClick)
        observeEvent(this.#closeBtn, 'click', () => this.#close(), this.#cacheClick)

        if (this.#backdrop) {
            this.#gsapBackdrop = gsap.timeline()
            this.#gsapBackdrop = gsap.set(this.#backdrop, { display: 'none', autoAlpha: 0 })
        }

        this.#gsapContainer = gsap.timeline()
        this.#gsapContainer.set(this.#container, { display: 'none' }).set(this.#container, this.#animInit)
    }

    #open ()
    {
        if (this.#isOpen) {
            this.#close()
            return
        }

        const friends = document.querySelectorAll(`[sync-group='${this.#syncGroup}']`)
        friends.forEach((element) =>
        {
            element.api('close')
        })

        this.#animateOpen()
    }

    #close ()
    {
        this.#animateClose()
    }

    #animateOpen ()
    {
        if (this.#backdrop) {
            this.#gsapBackdrop?.kill()
            this.#gsapBackdrop = gsap.timeline()
            this.#gsapBackdrop.set(this.#backdrop, {
                display: 'block',
                autoAlpha: 1,
                duration: 0.3,
                ease: 'back.out(1.7)',
            })
        }

        this.#gsapContainer.kill()
        this.#gsapContainer = gsap.timeline()
        this.#gsapContainer
            .set(this.#container, { display: 'block' })
            .set(this.#container, this.#animInit)
            .to(this.#container, this.#animOpen)
        this.#isOpen = true
    }

    #animateClose ()
    {
        if (this.#backdrop) {
            this.#gsapBackdrop?.kill()
            this.#gsapBackdrop = gsap.timeline()
            this.#gsapBackdrop.set(this.#backdrop, {
                display: 'block',
                autoAlpha: 0,
                duration: 0.3,
                ease: 'back.in(1.7)',
            })
        }

        this.#gsapContainer.kill()
        this.#gsapContainer = gsap.timeline()
        this.#gsapContainer.to(this.#container, this.#animClose).set(this.#container, { display: 'none' })
        this.#isOpen = false
    }

    #clearLeak ()
    {
        this.#cacheClick.forEach((cleanup) => cleanup())

        this.#gsapBackdrop?.progress(0).kill()
        this.#gsapContainer.progress(0).kill()

        this.#nulling()
    }

    #nulling ()
    {
        // -- Data Attr
        this.#animInit = null
        this.#animOpen = null
        this.#animClose = null
        this.#syncGroup = ''

        // -- Ref Html
        this.#backdrop = null
        this.#container = null
        this.#closeBtn = null
        this.#triggerBtn = null

        // -- Cache Array
        this.#cacheClick = []

        // -- Anim State
        this.#gsapBackdrop = 0
        this.#gsapContainer = 0

        // -- Node State
        this.#isOpen = null
        this.#isConnected = null
    }
    //--------------------------------------------
    // ------------------------------- Private API

    #apiOpen ()
    {
        this.#open()
    }

    #apiClose ()
    {
        this.#close()
    }

    //--------------------------------------------
    // -------------------------------- Public API

    api (action)
    {
        switch (action) {
            case 'open':
                this.#apiOpen()
                break
            case 'close':
                this.#apiClose()
                break
            default:
                console.error('Invalid API action:', action)
        }
    }
}