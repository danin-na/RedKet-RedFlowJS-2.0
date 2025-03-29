class Marquee_01 extends HTMLElement
{
    // --------------------------------------------
    // -- Element - State -------------------------
    // --------------------------------------------


    #elmn_slide = null
    #anim_opt = {}
    #anim_frX = 0
    #anim_toX = 0
    #anim_tween = null
    #anim_Prog = 0
    #obsv_anim_intersect = []
    #node_isConnected = false

    // --------------------------------------------
    // -- Lifecycle - Callbacks -------------------
    // --------------------------------------------

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
        if (o !== v && this.#node_isConnected) {
            this.#anim_reset()
        }
    }

    connectedCallback ()
    {
        console.log(this)
        this.#api.A1()
        this.console.log('------------------')

        this.#anim_init()
        this.#node_isConnected = true
    }

    disconnectedCallback ()
    {
        this.#clear_leak()
        this.#node_isConnected = false
    }

    // --------------------------------------------
    // -- Public - API ----------------------------
    // --------------------------------------------

    // -- Empty

    // --------------------------------------------
    // -- Private - API ---------------------------
    // --------------------------------------------

    #anim_init ()
    {
        this.#_set_element()
        this.#_get_element()
        this.#_set_animation()
        this.#_run_animation()
        this.#_set_observer()
    }

    #anim_reset ()
    {
        this.#_set_animation()
        this.#_reset_animation()
        this.#_run_animation()
    }

    #clear_leak ()
    {
        this.#d.anim.tween?.progress(0).kill()
        this.#d.obsv.anim.intersect.forEach((cleanup) => cleanup())
        this.#d.elmn.slide = null
        this.#d.anim.opt = {}
        this.#d.anim.frX = 0
        this.#d.anim.toX = 0
        this.#d.anim.tween = null
        this.#d.anim.Prog = 0
        this.#d.obsv.anim.intersect = []
    }

    // --------------------------------------------
    // -- Private - Helper ------------------------
    // --------------------------------------------

    #_set_element ()
    {

        const _s = Array.from(this.querySelectorAll('[ref-slide]'))

        if (!_s.length) {
            throw new Error('No child ref "ref-slide"')
        }
        else {
            for (let i = 1; i < _s.length; i++) _s[i].remove()
            this.appendChild(_s[0].cloneNode(true))
        }

    }

    #_get_element ()
    {
        this.#elmn_slide = this.querySelectorAll('[ref-slider]')
    }

    #_set_observer ()
    {
        observeIntersect2(
            this,
            () => this.#_resume_animation(),
            () => this.#_pause_animation(),
            this.#obsv_anim_intersect,
            0
        )
    }

    #_set_animation ()
    {
        const _anim_deft = { duration: 10, ease: 'none', repeat: -1 }
        const _anim_user = getAttr(this, 'anim-opt', 'json') || {}
        const _anim_dir = _anim_user.direction || 'left'
        const _anim_width = this.#elmn_slide[0].getBoundingClientRect().width

        delete this.#anim_opt.direction

        this.#anim_frX = _anim_dir === 'left' ? 0 : -_anim_width
        this.#anim_toX = _anim_dir === 'left' ? -_anim_width : 0
        this.#anim_opt = { ..._anim_deft, ..._anim_user }
    }

    #_run_animation ()
    {
        this.#anim_Prog = this.#anim_Prog || 0
        this.#anim_tween = gsap.fromTo(
            this.#elmn_slide,
            { x: this.#anim_frX },
            { x: this.#anim_toX, ...this.#anim_opt }
        )
        this.#anim_tween.progress(this.#anim_Prog)
        this.#anim_Prog = 0
    }

    #_reset_animation ()
    {
        if (this.#anim_tween) {
            this.#anim_Prog = this.#anim_tween.progress()
            this.#anim_tween.progress(0).kill()
            this.#anim_tween = null
        }
    }

    #_pause_animation ()
    {
        this.#anim_tween.pause()
    }

    #_resume_animation ()
    {
        this.#anim_tween.resume()
    }
}