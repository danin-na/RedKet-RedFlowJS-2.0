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

        class Icon_01 extends HTMLElement
        {
            // -------------------- Attribute

            #rf = {
                svg: {
                    source: null,
                },
                tag: {
                    container: null,
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
                return ['rf-svg-source']
            }

            attributeChangedCallback (name, oldValue, newValue)
            {
                if (oldValue === newValue || !this.#rf.state.connected) return
                this.#render()
            }

            connectedCallback ()
            {
                this.#rf.state.connected = true
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
                this.#rf.svg.source = this.getAttribute('rf-svg-source')
                this.#rf.tag.container.innerHTML = decodeURIComponent(this.#rf.svg.source)
            }

            #clean ()
            {
                this.#rf.state.connected = false
                this.#rf.svg.source = null
                this.#rf.tag.container = null
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

        class Marquee_01 extends HTMLElement
        {
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
                if (o !== v && this.#st.life.isConnected) this.#_util_render()
            }

            connectedCallback ()
            {
                this.#st.life.isConnected = true
                this.#rf.ref.slider = this.querySelectorAll('[rf-ref-slider]')
                if (this.#rf.ref.slider.length == 1) {
                    this.appendChild(this.querySelector('[rf-ref-slider]').cloneNode(true))
                }
                this.#_util_render()
                // Add resize event listener
                this.#st.resize.handler = () => this.#_util_render()
                window.addEventListener('resize', this.#st.resize.handler)
            }

            disconnectedCallback ()
            {
                this.#_util_clear()
            }

            //---------------------- trigger ( util )

            #_util_render ()
            {
                // kill animation / but save animation position
                if (this.#st.life.tween) {
                    this.#st.life.tweenOld = this.#st.life.tween.progress()
                    this.#st.life.tween.progress(0).kill()
                    this.#st.life.tween = null
                }

                // gete latest data
                this.#rf.anim.ease = this.getAttribute('rf-anim-ease')
                this.#rf.anim.duration = parseFloat(this.getAttribute('rf-anim-duration'))
                this.#rf.anim.direction = this.getAttribute('rf-anim-direction')

                this.#rf.ref.slider = this.querySelectorAll('[rf-ref-slider]')

                const w = this.#rf.ref.slider[0].getBoundingClientRect().width

                // create new animation
                this.#st.life.tween = gsap.fromTo(
                    this.#rf.ref.slider,
                    { x: this.#rf.anim.direction === 'left' ? 0 : -w },
                    {
                        x: this.#rf.anim.direction === 'left' ? -w : 0,
                        duration: this.#rf.anim.duration,
                        ease: this.#rf.anim.ease,
                        repeat: -1,
                    }
                )

                // bring back animation position
                this.#st.life.tween.progress(this.#st.life.tweenOld)
            }

            #_util_clear ()
            {
                if (this.#st.life.tween) this.#st.life.tween.progress(0).kill()
                if (this.#st.resize.handler) window.removeEventListener('resize', this.#st.resize.handler)

                this.#st.life.tweenOld = null
                this.#st.life.tween = null
                this.#st.resize.handler = null
                this.#st.life.isConnected = null

                this.#rf.ref.slider = null
                this.#rf.anim.ease = null
                this.#rf.anim.duration = null
                this.#rf.anim.direction = null
            }

            //--------------------------------------------
            // ------------------------------------- STATE

            //---------------------- state ( private )

            #st = { life: { tween: null, tweenOld: null, isConnected: null }, resize: { handler: null } } // State

            //---------------------- state ( attribute )

            #rf = { anim: { ease: null, duration: null, direction: null }, ref: { slider: null } } // RedFlow

            //--------------------------------------------
            // --------------------------------------- API

            //---------------------- api (private)

            #_api_pause ()
            {
                if (this.#st.life.tween && this.#st.life.tween.isActive()) {
                    this.#st.life.tween.pause()
                }
            }

            #_api_resume ()
            {
                if (this.#st.life.tween && !this.#st.life.tween.isActive()) {
                    this.#st.life.tween.resume()
                }
            }

            #_api_remove ()
            {
                this.remove()
            }

            #_api_setSpeed (speedMultiplier)
            {
                if (this.#st.life.tween) {
                    this.#st.life.tween.timeScale(speedMultiplier)
                }
            }

            #_api_setDirection (direction)
            {
                this.setAttribute('rf-anim-direction', direction)
            }

            #_api_setEase (ease)
            {
                this.setAttribute('rf-anim-ease', ease)
            }

            #_api_restart ()
            {
                if (this.#st.life.tween) {
                    this.#st.life.tween.restart()
                }
            }

            #_api_stop ()
            {
                if (this.#st.life.tween) {
                    this.#st.life.tween.progress(0).pause()
                }
            }

            //---------------------- api (public)

            api (action, params)
            {
                switch (action) {
                    case 'remove':
                        this.#_api_remove()
                        break
                    case 'pause':
                        this.#_api_pause()
                        break
                    case 'resume':
                        this.#_api_resume()
                        break
                    case 'restart':
                        this.#_api_restart()
                        break
                    case 'setSpeed':
                        this.#_api_setSpeed(params.speedMultiplier)
                        break
                    case 'setDirection':
                        this.#_api_setDirection(params.direction)
                        break
                    case 'setEase':
                        this.#_api_setEase(params.ease)
                        break
                    case 'stop':
                        this.#_api_stop()
                        break
                    default:
                        console.warn('Invalid API action:', action)
                }
            }
        }

        return { Modal_01, Icon_01, Trigger_01, Marquee_01 }
    })()

    rf.lib.load(['gsap']).then(() =>
    {
        //customElements.define('redflow-modal-01', rf.component.Modal_01)
        //customElements.define('redflow-icon-01', rf.component.Icon_01)
        customElements.define('redflow-trigger-01', rf.component.Trigger_01)
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
