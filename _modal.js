class Modal_01 extends HTMLElement
{
    // --------------------------------------------
    // -- Element - State -------------------------
    // --------------------------------------------

    #state = {
        sync: { selfId: '', groupId: '' },
        node: { back: null, item: null, open: null, close: null },
        anim: { optInit: [], optOpen: [], optClose: [] },
        gsap: { tweenItem: null, tweenBack: null },
        stat: { isOpen: false, isConnected: false },
        cache: { animClick: [] },
    }

    //--------------------------------------------
    // ----------------------- lifecycle callbacks

    constructor()
    {
        super()
    }

    static get observedAttributes ()
    {
        return ['sync-selfid', 'sync-groupid', 'anim-optinit', 'anim-optopen', 'anim-optclose']
    }

    attributeChangedCallback (n, o, v)
    {
        if (o !== v && this.#state.stat.isConnected) {
            // -- Empty
        }
    }

    connectedCallback ()
    {
        this.#api.animationInit()
        this.#state.stat.isConnected = true
    }

    disconnectedCallback ()
    {
        this.#api.memoryClear()
        this.#state.stat.isConnected = false
    }

    // --------------------------------------------
    // -- Public - API ----------------------------
    // --------------------------------------------

    api (callback)
    {
        switch (callback) {
            case 'close':
                console.log('close')
                this.#fn.animationClose();
                break;

            default:
                console.warn(`Unhandled callback: ${callback}`);
        }
    }


    // --------------------------------------------
    // -- Private - API ---------------------------
    // --------------------------------------------

    #api = {
        animationInit: () =>
        {
            this.#fn.elementSet()
            this.#fn.animationSet()
            this.#fn.animationRun()
            this.#fn.observerSet()
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
            const { sync, node, } = this.#state;

            sync.selfId = fn.getAttr(this, 'sync-selfid', 'string') || {}
            sync.groupId = fn.getAttr(this, 'sync-groupid', 'string') || {}
            node.back = this.querySelector(`[node-back="${sync.selfId}"]`)
            node.item = this.querySelector(`[node-item="${sync.selfId}"]`)
            node.open = this.querySelector(`[node-open="${sync.selfId}"]`)
            node.close = this.querySelector(`[node-close="${sync.selfId}"]`)
        },

        animationSet: () =>
        {
            const { anim, } = this.#state;

            const { ...userOptsInit } = fn.getAttr(this, 'anim-optinit', 'json') || {}
            const { ...userOptsOpen } = fn.getAttr(this, 'anim-optopen', 'json') || {}
            const { ...userOptsClose } = fn.getAttr(this, 'anim-optclose', 'json') || {}
            anim.optInit = { display: 'none', autoAlpha: 0, ...userOptsInit }
            anim.optOpen = { display: 'block', autoAlpha: 1, ...userOptsOpen }
            anim.optClose = { autoAlpha: 0, ...userOptsClose }
        },

        animationRun: () =>
        {
            const { anim, node, gsap } = this.#state;

            if (node.back) {
                gsap.tweenBack?.kill()
                gsap.tweenBack = gsap.timeline()
                gsap.tweenBack = gsap.set(node.back, { display: 'none', autoAlpha: 0 })
            }
            if (node.item) {
                gsap.tweenItem?.kill()
                gsap.tweenItem = gsap.timeline()
                gsap.tweenItem.set(node.item, { ...anim.optInit })
            }
        },

        animationOpen: () =>
        {
            const { sync, anim, node, stat, gsap } = this.#state;

            if (stat.isOpen) {
                this.#fn.animationClose()
                return
            }

            const friends = document.querySelectorAll(`[sync-groupid='${sync.groupId}']`)
            friends.forEach((element) =>
            {
                element.api('close')
            })

            if (node.back) {
                gsap.tweenBack?.kill()
                gsap.tweenBack = gsap.timeline()
                gsap.tweenBack.set(node.back, { display: 'block', autoAlpha: 1, duration: 0.2, ease: 'none' })
            }
            if (node.item) {
                gsap.tweenItem?.kill()
                gsap.tweenItem = gsap.timeline()
                gsap.tweenItem.set(node.item, { ...anim.optInit }).to(node.item, { ...anim.optOpen })
                stat.isOpen = true
            }
        },

        animationClose: () =>
        {
            const { anim, node, stat, gsap } = this.#state

            if (node.back) {
                gsap.tweenBack?.kill()
                gsap.tweenBack = gsap.timeline()
                gsap.tweenBack.set(node.back, { display: 'none', autoAlpha: 0, duration: 0.2, ease: 'none' })
            }
            if (node.item) {
                gsap.tweenItem?.kill()
                gsap.tweenItem = gsap.timeline()
                gsap.tweenItem.set(node.item, { ...anim.optClose }).to(node.item, { ...anim.optInit })
                stat.isOpen = false
            }
        },

        observerSet: () =>
        {
            const { node, cache } = this.#state

            fn.observeEvent(node.open, 'click', () => this.#fn.animationOpen(), cache.animClick)
            fn.observeEvent(node.close, 'click', () => this.#fn.animationClose(), cache.animClick)
        },

        memoryClear: () =>
        {
            const { sync, anim, node, stat, gsap, cache } = this.#state

            cache.animClick.forEach((cleanup) => cleanup())

            gsap.tweenBack?.progress(0).kill()
            gsap.tweenItem?.progress(0).kill()

            sync.selfId = '', sync.groupId = ''
            anim.optInit = [], anim.optOpen = [], anim.optClose = []
            node.back = null, node.item = null, node.open = null, node.close = null
            gsap.tweenBack = null, gsap.tweenItem = null
            stat.isOpen = false
            cache.animClick = []
        }
    }
}