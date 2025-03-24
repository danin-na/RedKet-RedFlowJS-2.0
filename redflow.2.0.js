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
            // -------------------- Variables

            #rf = { anim: { ease: null, duration: null, direction: null }, ref: { slider: null } } // RedFlow Component data-rf-attr

            #st = { life: { gsapTween: null, gsapTweenOld: null, isConnected: null, sliderCloned: null } } // State

            // -------------------- Trigger

            constructor()
            {
                super()
            }

            static get observedAttributes ()
            {
                return ['rf-anim-ease', 'rf-anim-direction', 'rf-anim-duration']
            }

            attributeChangedCallback (name, oldValue, newValue)
            {
                if (oldValue === newValue || !this.#st.life.isConnected) return
                this.#f_util.render()
            }

            connectedCallback ()
            {
                this.#st.life.isConnected = true
                if (!this.#st.life.sliderCloned) {
                    this.appendChild(this.querySelector('[rf-ref-slider]').cloneNode(true))
                    this.#st.life.sliderCloned = true
                }
                this.#rf.ref.slider = this.querySelectorAll('[rf-ref-slider]')
                this.#f_util.render()
            }

            disconnectedCallback ()
            {
                this.#f_util.clear()
            }

            // -------------------- Utility

            #f_util = {
                render: () =>
                {
                    // kill animation / but save animation position
                    if (this.#st.life.gsapTween) {
                        this.#st.life.gsapTweenOld = this.#st.life.gsapTween.progress()
                        this.#st.life.gsapTween.progress(0).kill()
                        this.#st.life.gsapTween = null
                    }

                    // gete latest data
                    this.#rf.anim.ease = this.getAttribute('rf-anim-ease')
                    this.#rf.anim.duration = parseFloat(this.getAttribute('rf-anim-duration'))
                    this.#rf.anim.direction = this.getAttribute('rf-anim-direction')

                    // create new animation
                    this.#st.life.gsapTween = gsap.fromTo(
                        this.#rf.ref.slider,
                        { x: this.#rf.anim.direction === 'left' ? 0 : -this.#rf.ref.slider[0].getBoundingClientRect().width },
                        {
                            x: this.#rf.anim.direction === 'left' ? -this.#rf.ref.slider[0].getBoundingClientRect().width : 0,
                            duration: this.#rf.anim.duration,
                            ease: this.#rf.anim.ease,
                            repeat: -1,
                        }
                    )

                    // bring back animation position
                    this.#st.life.gsapTween.progress(this.#st.life.gsapTweenOld)
                },

                clear: () =>
                {
                    this.#st.life.isConnected = false
                    if (this.#st.life.gsapTween) {
                        this.#st.life.gsapTween.progress(0).kill()
                        this.#st.life.gsapTween = null
                    }
                    this.#rf.ref.slider = null
                },
            }

            // -------------------- Private API

            #f_api = {
                destroy: () =>
                {
                    this.remove()
                },
            }
            // -------------------- Public API

            api (action)
            {
                switch (action) {
                    case 'destroy':
                        this.#f_api.destroy()
                        break
                    default:
                        break
                }
            }
        }

        return { Modal_01, Icon_01, Trigger_01, Marquee_01 }
    })()

    rf.lib.load(['gsap']).then(() =>
    {

        //customElements.define('redflow-modal-01', rf.component.Modal_01)
        //customElements.define('redflow-icon-01', rf.component.Icon_01)
        //customElements.define('redflow-trigger-01', rf.component.Trigger_01)
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
