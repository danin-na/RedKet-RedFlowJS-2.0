class Modal_01 extends HTMLElement
{
    //--------------------------------------------
    // --------------------------- Component State

    #st = {
        anim: { init: null, open: null, close: null }, // rf-data
        ref: { backdrop: null, container: null }, // rf-data
        node: { isConnected: null, },
        life: { animation: null }
    }

    //--------------------------------------------
    // ----------------------- lifecycle callbacks

    constructor()
    {
        super()
    }

    static get observedAttributes ()
    {
        return ['anim-init', 'anim-open', 'anim-close']
    }

    attributeChangedCallback (n, o, v)
    {
        // -- Empty
    }

    connectedCallback ()
    {
        this.#do.getAttr()

        this.#do.modal.init()

        this.#st.life.isConnected = true
    }

    disconnectedCallback ()
    {
        this.#do.clearLeak()
        this.#st.life.isConnected = false
    }

    //--------------------------------------------
    // -------------------------- Private Utilizes

    #do = {

        getAttr: () =>
        {
            this.#st.anim.init = JSON.parse(this.getAttribute('anim-init'))
            this.#st.anim.open = JSON.parse(this.getAttribute('anim-open'))
            this.#st.anim.close = JSON.parse(this.getAttribute('anim-close'))
        },

        modal: {

            init: () =>
            {
                this.#st.ref.backdrop = this.querySelector('[ref-backdrop]')
                if (this.#st.ref.backdrop) gsap.set(this.#st.ref.backdrop, this.#st.anim.init)

                this.#st.ref.container = this.querySelector('[ref-container]')
                if (this.#st.ref.container) gsap.set(this.#st.ref.container, this.#st.anim.init)
            },

            open: () =>
            {
                this.#st.life.animation?.kill()
                this.#st.life.animation = gsap.timeline()
                this.#st.life.animation
                    .set(this.#st.ref.container, this.#st.anim.init)
                    .to(this.#st.ref.container, this.#st.anim.open)
            },

            close: () =>
            {
                this.#st.life.animation?.kill()
                this.#st.life.animation = gsap.timeline()
                this.#st.life.animation.to(this.#st.ref.container, this.#st.anim.close)
            },
        },

        clearLeak: () =>
        {
            gsap.killTweensOf(this.#st.ref.backdrop)
            gsap.killTweensOf(this.#st.ref.container)

            this.#st.life.animation?.kill()

            this.#st.anim.init = null
            this.#st.anim.open = null
            this.#st.anim.close = null

            this.#st.ref.backdrop = null
            this.#st.ref.container = null

            this.#st.life.animation = null
        },

        api: {

            open: () =>
            {
                this.#do.modal.open()
            },

            close: () =>
            {
                this.#do.modal.close()
            }

        }
    }

    //--------------------------------------------
    // -------------------------------- Public API

    api (action)
    {
        switch (action) {
            case 'open':
                this.#do.api.open()
                break
            case 'close':
                this.#do.api.close()
                break
            default:
                console.warn("Invalid API action:", action)
        }
    }
}