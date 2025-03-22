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

    class Modal_01 extends HTMLElement 
    {
        #sync = ''

        #tag_container = null
        #tag_backdrop = null

        #config_open_x = 0
        #config_open_y = 20
        #config_open_duration = 0.2
        #config_open_ease = 'slow(0.7,0.7,false)'

        #config_close_x = 0
        #config_close_y = 0
        #config_close_duration = 0.2
        #config_close_ease = 'slow(0.7,0.7,false)'

        constructor()
        {
            super()

            const e = this

            e.#sync = e.getAttribute('rf-sync') || null

            e.#config_open_x = parseFloat(e.getAttribute('rf-config-open-x')) || e.#config_open_x
            e.#config_open_y = parseFloat(e.getAttribute('rf-config-open-y')) || e.#config_open_y
            e.#config_open_ease = e.getAttribute('rf-config-open-ease') || 'slow(0.7,0.7,false)'
            e.#config_open_duration = parseFloat(e.getAttribute('rf-config-open-duration')) || e.#config_open_duration

            e.#config_close_x = parseFloat(e.getAttribute('rf-config-close-x')) || e.#config_close_x
            e.#config_close_y = parseFloat(e.getAttribute('rf-config-close-y')) || e.#config_close_y
            e.#config_close_ease = e.getAttribute('rf-config-close-ease') || 'slow(0.7,0.7,false)'
            e.#config_close_duration = parseFloat(e.getAttribute('rf-config-close-duration')) || e.#config_close_duration

            e.#tag_container = e.querySelector('[data-rf-tag-container]')
            e.#tag_backdrop = e.querySelector('[data-rf-tag-backdrop]')

            e.#render()
        }

        static get observedAttributes ()
        {
            return ['rf-config-open-x', 'rf-config-open-y', 'rf-config-open-duration', 'rf-config-open-ease']
        }

        connectedCallback () { }

        disconnectedCallback () { }

        #render ()
        {
            const e = this

            gsap.set(e.#tag_container, { autoAlpha: 0, y: e.#config_close_y, x: e.#config_close_x })
            gsap.set(e.#tag_backdrop, { autoAlpha: 0, y: e.#config_close_y, x: e.#config_close_x })
        }

        #open ()
        {
            const e = this

            gsap.to(e.#tag_container, {
                autoAlpha: 1,
                y: e.#config_open_y,
                x: e.#config_open_x,
                ease: e.#config_open_ease,
                duration: e.#config_open_duration,
            })
        }

        #close ()
        {
            const e = this

            gsap.to(e.#tag_container, {
                autoAlpha: 0,
                y: e.#config_close_y,
                x: e.#config_close_x,
                ease: e.#config_close_ease,
                duration: e.#config_close_duration,
            })
        }

        #destroy () { }

        api (key)
        {
            switch (key) {
                case 'open':
                    this.#open()
                    console.log('open')
                    break
                case 'close':
                    this.#close()
                    console.log('close')
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
        // Private properties
        #event_Type = ['click']
        #target_api = 'open'
        #target_sync = null

        constructor()
        {
            super()
            const e = this

            const eventsAttr = e.getAttribute('rf-event-type')
            e.#event_Type = eventsAttr
                ? eventsAttr.split(',').map(ev => ev.trim()).filter(Boolean)
                : e.#event_Type

            e.#target_api = e.getAttribute('rf-api-type') || e.#target_api
            e.#target_sync = e.getAttribute('rf-sync-get') || null

            e.#event_Type.forEach(eventType =>
            {
                e.addEventListener(eventType, () =>
                {
                    document.querySelector(`[rf-sync="${e.#target_sync}"]`).api(e.#target_api)
                })
            })
        }

        connectedCallback () { }

        disconnectedCallback () { }

        // Optional public API method for manual triggering
        api (command)
        {
            if (command === 'trigger') {
                document.querySelector(`[rf-sync="${this.#target_sync}"]`).api(this.#target_api)
            }
        }
    }




    rf.lib.load(['gsap']).then(() =>
    {
        customElements.define('redflow-modal-01', Modal_01)
        customElements.define('redflow-trigger-01', Trigger_01)
    })
}

try {
    const instance1 = RedFlow()
    //const instance2 = RedFlow()
} catch (e) {
    console.warn(e)
}

/*
const rf = {}



// ------------------------------- Lib Helpers


class Marquee_01 extends HTMLElement
{
    // Private fields
    #tween = null
    #tweenProg = null

    #slider = null
    #resizeHandler = null

    #componentLoaded = false

    static get observedAttributes ()
    {
        console.log("0 - new Attr")
        return ["ease", "direction", "duration"]
    }

    constructor()
    {
        super()
        console.log("1 - constructor")
        this.#resizeHandler = () => this.#render()
    }

    attributeChangedCallback ()
    {
        if (!this.#componentLoaded) return console.log("2 - attributeChangedCallback Failed")

        console.log("++++")
        this.#render()
    }

    connectedCallback ()
    {
        rf.lib.load(["gsap"]).then(() =>
        {
            console.log("3 - constructor GSAP Loaded")
            console.log("4 - connectedCallback")

            this.#slider = this.querySelector("[data-rf-items]")
            this.appendChild(this.#slider.cloneNode(true))

            this.#componentLoaded = true

            this.#render()
            window.addEventListener("resize", this.#resizeHandler)
        })
    }

    disconnectedCallback ()
    {
        console.log("----")
        window.removeEventListener("resize", this.#resizeHandler)

        if (this.#tween) {
            this.#tween.progress(0).kill()
            this.#tween = null
        }
    }

    #render ()
    {
        console.log("5 - render")
        if (this.#tween) {
            this.#tweenProg = this.#tween.progress()
            this.#tween.progress(0).kill()
        }

        const sliders = this.querySelectorAll("[data-rf-items]")

        const ease = this.getAttribute("ease") || "none"
        const duration = parseFloat(this.getAttribute("duration")) || 30
        const direction = this.getAttribute("direction") || "left"

        const width = sliders[0].getBoundingClientRect().width
        const xFrom = direction === "left" ? 0 : -width
        const xTo = direction === "left" ? -width : 0

        this.#tween = gsap.fromTo(
            sliders,
            { x: xFrom },
            {
                x: xTo,
                duration,
                ease,
                repeat: -1,
            }
        )

        this.#tween.progress(this.#tweenProg)
    }
}

class Icon_01 extends HTMLElement
{
    #svgSource = null

    constructor()
    {
        super()
    }

    connectedCallback ()
    {
        this.#render()
    }

    #render ()
    {
        this.#svgSource = this.getAttribute("svgSource")
        this.innerHTML = decodeURIComponent(this.#svgSource)
    }
}

customElements.define("redflow-marquee-a", Marquee_01)
customElements.define("redflow-icon-a", Icon_01)

*/
