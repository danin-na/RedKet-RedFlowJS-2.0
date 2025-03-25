/* -------------------------------------------------------------------------- */
/* --------------------------------- RedFlow -------------------------------- */
/* -------------------------------------------------------------------------- */
function RedFlow ()
{
    // ------------- RedFlow init

    RedFlow.instance = (() =>
    {
        if (RedFlow.instance) throw new Error('You can have only one instance of RedFlow')

        const creditInfo = {
            commentTop:
                '⭕ RedFlow - Official Webflow Library by RedKet © 2025 RedKet.\n All rights reserved. Unauthorized copying, modification, or distribution is prohibited.\n Visit: www.RedKet.com | www.Red.Ket',
            commentBottom: '⭕ RedFlow | OFFICIAL WEBFLOW LIBRARY BY REDKET © 2025 REDKET | WWW.REDKET.COM | WWW.RED.KET',
            logMessage: `%cRed%cFlow%c - Official Webflow Library by %cRed%cKet%c\nCopyright © 2025 RedKet. All rights reserved.\nUnauthorized copying, modification, or distribution is prohibited.\nVisit: www.RedKet.com | www.Red.Ket`,
            logStyle: [
                'color:#c33; background:#000; font-weight:bold; padding:2px 4px; border-radius:3px;',
                'color:#dfdfdf; background:#000; font-weight:bold; padding:2px 4px; border-radius:3px;',
                'color:#aaa; background:#000; padding:2px 4px; border-radius:3px;',
                'color:#c33; background:#000; font-weight:bold; padding:2px 4px; border-radius:3px;',
                'color:#dfdfdf; background:#000; font-weight:bold; padding:2px 4px; border-radius:3px;',
                'color:#888; font-size:11px;',
            ],
        }
        document.body.prepend(document.createComment(creditInfo.commentTop))
        document.body.appendChild(document.createComment(creditInfo.commentBottom))
        console.log(creditInfo.logMessage, ...creditInfo.logStyle)

        return this
    })()

    const rf = {}

    // ------------- RedFlow log

    rf.log = (() =>
    {
        'use strict'

        function error (context, message)
        {
            console.error(`💢 ERROR → ⭕ RedFlow → ${context} →`, message)
        }

        function success (context, message)
        {
            console.log(`✅ SUCCESS → ⭕ RedFlow → ${context} →`, message)
        }

        function info (context, message)
        {
            console.info(`❔ INFO → ⭕ RedFlow → ${context} →`, message)
        }

        function warn (context, message)
        {
            console.warn(`⚠️ WARN → ⭕ RedFlow → ${context} →`, message)
        }

        function debug (context, message)
        {
            console.debug(`🐞 DEBUG → ⭕ RedFlow → ${context} →`, message)
        }

        // ------------------------------ Public API

        return { error, success, info, warn, debug }
    })()

    // ------------- RedFlow lib

    rf.lib = (() =>
    {
        'use strict'

        const cdn = {
            gsap: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.1/gsap.min.js',
            jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
        }

        const cacheScript = {}

        function loadScript (url)
        {
            if (cacheScript[url]) return cacheScript[url]
            if (document.querySelector(`script[src="${url}"]`)) {
                cacheScript[url] = Promise.resolve()
                return cacheScript[url]
            }
            if (!document.querySelector(`link[rel="preload"][href="${url}"]`)) {
                const link = document.createElement('link')
                link.rel = 'preload'
                link.href = url
                link.as = 'script'
                document.head.appendChild(link)
            }
            cacheScript[url] = new Promise((resolve) =>
            {
                const script = document.createElement('script')
                script.src = url
                script.defer = true
                script.onload = () =>
                {
                    rf.log.success(url, 'Loaded')
                    resolve()
                }
                script.onerror = () =>
                {
                    rf.log.error(url, 'Failed to load')
                    resolve()
                }
                document.head.appendChild(script)
            })
            return cacheScript[url]
        }

        function load (libs)
        {
            const promises = libs.map((lib) =>
            {
                if (cdn[lib]) return loadScript(cdn[lib])
                if (lib.startsWith('http')) return loadScript(lib)
                rf.log.warn(lib, 'Unknown library requested')
                return Promise.resolve()
            })
            return Promise.all(promises)
        }

        // ------------------------------ Public API

        return { load }
    })()

    // ------------- RedFlow component

    rf.component = (() =>
    {
        class Modal_01 extends HTMLElement
        {
            // -------------------- Attribute

            #rf = {
                anim: {
                    init: null,
                    open: null,
                    close: null,
                },
                tag: {
                    backdrop: null,
                    container: null,
                },
                state: {
                    animation: null,
                    connected: false,
                },
            }

            // -------------------- Trigger

            constructor()
            {
                super()
            }

            static get observedAttributes ()
            {
                return ['rf-anim-init', 'rf-anim-open', 'rf-anim-close']
            }

            attributeChangedCallback (name, oldValue, newValue)
            {
                if (oldValue === newValue || !this.#rf.state.connected) return
                this.#render()
            }

            connectedCallback ()
            {
                this.#rf.state.connected = true
                this.#rf.tag.backdrop = this.querySelector('[rf-tag-backdrop]')
                this.#rf.tag.container = this.querySelector('[rf-tag-container]')
                this.#render()
            }

            disconnectedCallback ()
            {
                this.#clean()
            }

            // -------------------- util

            #render ()
            {
                this.#rf.anim.init = JSON.parse(this.getAttribute('rf-anim-init'))
                this.#rf.anim.open = JSON.parse(this.getAttribute('rf-anim-open'))
                this.#rf.anim.close = JSON.parse(this.getAttribute('rf-anim-close'))
                gsap.set(this.#rf.tag.backdrop, this.#rf.anim.init)
                gsap.set(this.#rf.tag.container, this.#rf.anim.init)
            }

            #clean ()
            {
                this.#rf.state.connected = false
                this.#rf.state.animation?.kill()
                gsap.killTweensOf(this.#rf.tag.backdrop)
                gsap.killTweensOf(this.#rf.tag.container)
                this.#rf.anim.init = null
                this.#rf.anim.open = null
                this.#rf.anim.close = null
                this.#rf.tag.backdrop = null
                this.#rf.tag.container = null
                this.#rf.state.animation = null
            }

            // -------------------- Private API

            #open ()
            {
                this.#rf.state.animation?.kill()
                this.#rf.state.animation = gsap.timeline()
                this.#rf.state.animation
                    .set(this.#rf.tag.container, this.#rf.anim.init)
                    .to(this.#rf.tag.container, this.#rf.anim.open)
            }

            #close ()
            {
                this.#rf.state.animation?.kill()
                this.#rf.state.animation = gsap.timeline()
                this.#rf.state.animation.to(this.#rf.tag.container, this.#rf.anim.close)
            }

            #destroy ()
            {
                this.remove()
            }

            // -------------------- Public API

            api (action)
            {
                switch (action) {
                    case 'open':
                        this.#open()
                        break
                    case 'close':
                        this.#close()
                        break
                    case 'destroy':
                        this.#destroy()
                        break
                    default:
                        break
                }
            }
        }

        class Trigger_01 extends HTMLElement
        {
            // -------------------- Attribute
            #rf = {
                event: {
                    type: [],
                    holder: [], // to perevent memory leak
                },
                target: {
                    sync: [],
                    api: [],
                },
                state: {
                    connected: false,
                },
            }

            // -------------------- Trigger

            constructor()
            {
                super()
            }

            static get observedAttributes ()
            {
                return ['rf-event-type', 'rf-target-sync', 'rf-target-api']
            }

            attributeChangedCallback (name, oldValue, newValue)
            {
                if (oldValue === newValue || !this.#rf.state.connected) return
                this.#render()
            }

            connectedCallback ()
            {
                this.#rf.state.connected = true
                this.#render()
            }

            disconnectedCallback ()
            {
                this.#clean()
            }

            // -------------------- Helper

            #render ()
            {
                // We need this part because if
                // attributeChangedCallback() calls render() we get memory leak
                // so we want to make sure to remove old EventListener
                if (this.#rf.event.holder.length > 0) {
                    this.#rf.event.holder.forEach(({ e, h }) =>
                    {
                        this.removeEventListener(e, h)
                    })
                    this.#rf.event.holder = []
                }

                this.#rf.event.type = this.getAttribute('rf-event-type')
                    .split(',')
                    .map((v) => v.trim())
                this.#rf.target.sync = this.getAttribute('rf-target-sync')
                    .split(',')
                    .map((v) => v.trim())
                this.#rf.target.api = this.getAttribute('rf-target-api')
                    .split(',')
                    .map((v) => v.trim())

                this.#rf.event.type.forEach((ev, i) =>
                {
                    const listener = () =>
                        document.querySelector(`[rf-sync="${this.#rf.target.sync[i]}"]`).api(this.#rf.target.api[i])
                    this.addEventListener(ev, listener)

                    // a list to hold all events added
                    // so we can remove fro memory leaks
                    this.#rf.event.holder.push({ e: ev, h: listener })
                })
            }

            #clean ()
            {
                this.#rf.state.connected = false
                this.#rf.event.holder.forEach(({ e, h }) =>
                {
                    this.removeEventListener(e, h)
                })
                this.#rf.event.type = []
                this.#rf.event.holder = []
                this.#rf.target.sync = []
                this.#rf.target.api = []
            }

            // -------------------- Private API

            #destroy ()
            {
                this.remove()
            }

            // -------------------- Public API

            api (action)
            {
                switch (action) {
                    case 'destroy':
                        this.#destroy()
                        break
                    default:
                        break
                }
            }
        }

        /*
        class Icon_01 extends HTMLElement
        {
            //--------------------------------------------
            // ------------------------------------- STATE

            //---------------------- state ( private )

            #st = { life: { isConnected: null } }

            //---------------------- api (private)

            #rf = { svg: { source: null }, ref: { container: null } } // RedFlow

            //--------------------------------------------
            // ----------------------------------- TRIGGER

            //---------------------- trigger ( callback )

            constructor()
            {
                super()
            }

            static get observedAttributes ()
            {
                return ["rf-svg-source"]
            }

            attributeChangedCallback (n, o, v)
            {
                if (o !== v && this.#st.life.isConnected) this.#util.getAttr();
                this.#util.renderComp()
            }

            connectedCallback ()
            {
                // -- Ref Checker

                this.#rf.tag.container = this.querySelector("[rf-ref-container]")
                if (!this.#rf.tag.container) throw new Error('child ref "rf-ref-container" does not exist')

                // -- Render

                this.#util.getAttr();
                this.#util.renderComp()
                this.#rf.state.connected = true
            }

            disconnectedCallback ()
            {
                this.#u_clear()
            }

            //---------------------- trigger ( util )

            #u_render ()
            {
                this.#rf.svg.source = this.getAttribute("rf-svg-source")
                this.#rf.tag.container.innerHTML = decodeURIComponent(this.#rf.svg.source)
            }

            #u_clear ()
            {
                this.#rf.state.connected = false
                this.#rf.svg.source = null
                this.#rf.tag.container = null
            }

            //--------------------------------------------
            // --------------------------------------- API

            //---------------------- api (private)

            #destroy ()
            {
                this.remove()
            }

            //---------------------- api (public)

            api (action)
            {
                switch (action) {
                    case "destroy":
                        this.#destroy()
                        break
                    default:
                        break
                }
            }
        }
*/
        class Marquee_01 extends HTMLElement
        {
            //--------------------------------------------
            // ------------------------------------- STATE

            //---------------------- state ( private )

            #st = {
                life: { tween: null, tweenOld: null, isConnected: null },
                observ: { resize: null, intersecting: null, isIntersecting: false },
                w: null,
            }

            //---------------------- state ( attribute )

            #rf = { anim: { ease: null, duration: null, direction: null }, ref: { slider: null } } // RedFlow

            //--------------------------------------------
            // ----------------------------------- TRIGGER

            //---------------------- trigger ( callback )

            constructor()
            {
                super()
            }

            static get observedAttributes ()
            {
                return ['rf-anim-ease', 'rf-anim-direction', 'rf-anim-duration']
            }

            attributeChangedCallback (n, o, v)
            {
                if (o !== v && this.#st.life.isConnected) {
                    this.#util.animAttr()
                    this.#util.animRender()
                    if (!this.#st.observ.isIntersecting) {
                        console.log('🟨 Debounce')
                        this.#st.life.tween.pause()
                    }
                }
            }

            connectedCallback ()
            {
                // -- Get Attribute
                this.#util.animAttr()

                // -- Ref Checker
                if (!this.#rf.ref.slider || this.#rf.ref.slider.length === 0 || this.#rf.ref.slider.length > 2) {
                    throw new Error('child ref "rf-ref-slider" does not exist or there are too many')
                }

                if (this.#rf.ref.slider.length == 1) this.appendChild(this.#rf.ref.slider[0].cloneNode(true))

                this.#util.animRender()

                const debounce = (fn, delay) =>
                {
                    let timer
                    return function (...args)
                    {
                        clearTimeout(timer)
                        timer = setTimeout(() => fn.apply(this, args), delay)
                    }
                }

                const debouncedRender = debounce(() =>
                {
                    this.#util.animRender()
                    if (!this.#st.observ.isIntersecting) {
                        console.log('🟨 Debounce')
                        this.#st.life.tween.pause()
                    }
                }, 1000)

                this.#st.observ.resize = new ResizeObserver(() =>
                {
                    console.log('🟥 Resize')
                    debouncedRender()
                })

                this.#st.observ.resize.observe(this)

                this.#st.observ.intersecting = new IntersectionObserver(
                    (entries) =>
                    {
                        console.log('🟩 Observed')
                        entries.forEach((entry) =>
                        {
                            this.#st.observ.isIntersecting = entry.isIntersecting
                            if (entry.isIntersecting) {
                                console.log('ENTER', this.#st.life.tween.isActive())

                                if (this.#st.life.tween && !this.#st.life.tween.isActive()) {
                                    this.#st.life.tween.resume()
                                    console.log('---- Changed to:', this.#st.life.tween.isActive())
                                }
                            } else {
                                console.log('exit', this.#st.life.tween.isActive())
                                if (this.#st.life.tween && this.#st.life.tween.isActive()) {
                                    this.#st.life.tween.pause()
                                    console.log('---- Changed to:', this.#st.life.tween.isActive())
                                    console.log('-------------------------------------------')
                                }
                            }
                        })
                    },
                    { threshold: 0.1 }
                )
                this.#st.observ.intersecting.observe(this)

                this.#st.life.isConnected = true
            }

            disconnectedCallback ()
            {
                this.#util.clearLeak()
            }

            //---------------------- trigger ( utility )

            #util = {
                animAttr: () =>
                {
                    console.log('✨ animAttr')
                    // -- Get rf-anim
                    this.#rf.anim.ease = this.getAttribute('rf-anim-ease')
                    this.#rf.anim.duration = parseFloat(this.getAttribute('rf-anim-duration'))
                    this.#rf.anim.direction = this.getAttribute('rf-anim-direction')

                    // -- Get rf-ref
                    this.#rf.ref.slider = this.querySelectorAll('[rf-ref-slider]')
                },

                animRender: () =>
                {
                    console.log('🔥 animRender')
                    // -- kill animation / but save animation position
                    if (this.#st.life.tween) {
                        this.#st.life.tweenOld = this.#st.life.tween.progress()
                        this.#st.life.tween.progress(0).kill()
                        this.#st.life.tween = null
                    }

                    this.#rf.ref.slider = this.querySelectorAll('[rf-ref-slider]')
                    this.#st.w = this.#rf.ref.slider[0].getBoundingClientRect().width

                    // -- create new animation
                    this.#st.life.tween = gsap.fromTo(
                        this.#rf.ref.slider,
                        { x: this.#rf.anim.direction === 'left' ? 0 : -this.#st.w },
                        {
                            x: this.#rf.anim.direction === 'left' ? -this.#st.w : 0,
                            duration: this.#rf.anim.duration,
                            ease: this.#rf.anim.ease,
                            repeat: -1,
                        }
                    )

                    // -- bring back animation position
                },

                clearLeak: () =>
                {
                    // -- Clear Memory Leak
                    if (this.#st.life.tween) this.#st.life.tween.progress(0).kill()

                    // ALL CAPS: REMOVED RESIZE OBSERVER CODE ON DISCONNECT
                    if (this.#st.observ.resize) {
                        this.#st.observ.resize.disconnect()
                        this.#st.observ.resize = null
                    }

                    // ALL CAPS: REMOVED INTERSECTION OBSERVER CODE ON DISCONNECT
                    if (this.#st.observ.intersecting) {
                        this.#st.observ.intersecting.disconnect()
                        this.#st.observ.intersecting = null
                    }

                    // -- Null-ing Attribute
                    this.#st.life.tweenOld = null
                    this.#st.life.tween = null
                    this.#st.life.isConnected = null

                    this.#rf.ref.slider = null
                    this.#rf.anim.ease = null // optional
                    this.#rf.anim.duration = null // optional
                    this.#rf.anim.direction = null // optional
                },
            }

            //--------------------------------------------
            // --------------------------------------- API

            //---------------------- api (private)

            #api = {
                pause: () =>
                {
                    if (this.#st.life.tween && this.#st.life.tween.isActive()) {
                        this.#st.life.tween.pause()
                    }
                },

                resume: () =>
                {
                    if (this.#st.life.tween && !this.#st.life.tween.isActive()) {
                        this.#st.life.tween.resume()
                    }
                },

                remove: () =>
                {
                    this.remove()
                },

                setSpeed: (speedMultiplier) =>
                {
                    if (this.#st.life.tween) {
                        this.#st.life.tween.timeScale(speedMultiplier)
                    }
                },

                setDirection: (direction) =>
                {
                    this.setAttribute('rf-anim-direction', direction)
                },

                setEase: (ease) =>
                {
                    this.setAttribute('rf-anim-ease', ease)
                },

                restart: () =>
                {
                    if (this.#st.life.tween) {
                        this.#st.life.tween.restart()
                    }
                },

                stop: () =>
                {
                    if (this.#st.life.tween) {
                        this.#st.life.tween.progress(0).pause()
                    }
                },
            }

            //---------------------- api (public)

            api (action, params)
            {
                switch (action) {
                    case 'remove':
                        this.#api.remove()
                        break
                    case 'pause':
                        this.#api.pause()
                        break
                    case 'resume':
                        this.#api.resume()
                        break
                    case 'restart':
                        this.#api.restart()
                        break
                    case 'setSpeed':
                        this.#api.setSpeed(params.speedMultiplier)
                        break
                    case 'setDirection':
                        this.#api.setDirection(params.direction)
                        break
                    case 'setEase':
                        this.#api.setEase(params.ease)
                        break
                    case 'stop':
                        this.#api.stop()
                        break
                    default:
                        console.warn('Invalid API action:', action)
                }
            }
        }

        return { Marquee_01 }
    })()

    rf.lib.load(['gsap']).then(() =>
    {
        //customElements.define('redflow-modal-01', rf.component.Modal_01)

        //customElements.define('redflow-trigger-01', rf.component.Trigger_01)
        //customElements.define('redflow-icon-01', rf.component.Icon_01)
        customElements.define('redflow-marquee-01', rf.component.Marquee_01)
    })
}

document.addEventListener('DOMContentLoaded', () =>
{
    try {
        const instance1 = RedFlow()
        //const instance2 = RedFlow()
    } catch (e) {
        console.warn('sssss', e)
    }
})
