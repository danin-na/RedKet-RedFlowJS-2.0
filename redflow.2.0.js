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

    class Modal_ab02 extends HTMLElement
    {
        //
        #anim_open_x = 100
        #anim_open_y = 0
        #anim_open_duration = 0.1
        #anim_open_ease = 'slow(0.7,0.7,false)'
        //
        #anim_close_x = 0
        #anim_close_y = 0
        #anim_close_duration = 0.2
        #anim_close_ease = 'slow(0.7,0.7,false)'
        //
        // api
        #api_code_to_open = this.getAttribute('data-rf-api-code-to-open') ?? ''
        #api_code_to_close = this.getAttribute('data-rf-api-code-to-close') ?? ''

        constructor()
        {
            super()

            this.#anim_open_x = parseFloat(this.getAttribute('anim_open_x') ?? this.#anim_open_x)
            this.#anim_open_y = parseFloat(this.getAttribute('anim_open_y') ?? this.#anim_open_y)
            this.#anim_open_duration = parseFloat(this.getAttribute('anim_open_duration') ?? this.#anim_open_duration)
            this.#anim_open_ease = this.getAttribute('anim_open_ease') ?? this.#anim_open_ease

            this.#anim_close_x = parseFloat(this.getAttribute('anim_close_x') ?? this.#anim_close_x)
            this.#anim_close_y = parseFloat(this.getAttribute('anim_close_y') ?? this.#anim_close_y)
            this.#anim_close_duration = parseFloat(this.getAttribute('anim_close_duration') ?? this.#anim_close_duration)
            this.#anim_close_ease = this.getAttribute('anim_close_ease') ?? this.#anim_close_ease

            gsap.set(this, { autoAlpha: 1, y: this.#anim_close_y, x: this.#anim_close_x })

            console.log('api open', this.#api_code_to_open)
            console.log('api close', this.#api_code_to_close)
        }

        connectedCallback () { }

        disconnectedCallback () { }

        handleTrigger (key)
        {
            console.log('🔥')
            if (key === this.#api_code_to_open) {
                console.log('🟥')
                this.open()
            } else if (key === this.#api_code_to_close) {
                console.log('🟨')
                this.close()
            }
        }

        open ()
        {
            gsap.to(this, {
                autoAlpha: 1,
                y: this.#anim_open_y,
                x: this.#anim_open_x,
                ease: this.#anim_open_ease,
                duration: this.#anim_open_duration,
            })
        }

        close ()
        {
            gsap.to(this, {
                autoAlpha: 0,
                y: this.#anim_close_y,
                x: this.#anim_close_x,
                ease: this.#anim_close_ease,
                duration: this.#anim_close_duration,
            })
        }
    }

    const modal = document.getElementById('myModal')

    rf.lib.load(['gsap']).then(() =>
    {
        customElements.define('redflow-modal', Modal_ab02)

        document.getElementById('openBtn').addEventListener('click', function ()
        {
            const key = this.getAttribute('data-sync')
            const targetElement = document.querySelector(`[data-rf-api-code-to-open="${key}"]`)
            console.log(targetElement)

            if (targetElement && typeof targetElement.handleTrigger === 'function') {
                targetElement.handleTrigger(key)
            } else {
                console.warn('Target element not found or handleTrigger is not a function.')
            }
        })

        document.getElementById('openBtnHover').addEventListener('mouseenter', function ()
        {
            const key = this.getAttribute('data-sync')
            const targetElement = document.querySelector(`[data-rf-api-code-to-open="${key}"]`)
            console.log(targetElement)

            if (targetElement && typeof targetElement.handleTrigger === 'function') {
                targetElement.handleTrigger(key)
            } else {
                console.warn('Target element not found or handleTrigger is not a function.')
            }
        })

        document.getElementById('closeBtn').addEventListener('click', function ()
        {
            const key = this.getAttribute('data-sync')
            const targetElement = document.querySelector(`[data-rf-api-code-to-close="${key}"]`)
            console.log(targetElement)

            if (targetElement && typeof targetElement.handleTrigger === 'function') {
                targetElement.handleTrigger(key)
            } else {
                console.warn('Target element not found or handleTrigger is not a function.')
            }
        })

        document.getElementById('closeBtnHover').addEventListener('mouseenter', function ()
        {
            const key = this.getAttribute('data-sync')
            const targetElement = document.querySelector(`[data-rf-api-code-to-close="${key}"]`)
            console.log(targetElement)

            if (targetElement && typeof targetElement.handleTrigger === 'function') {
                targetElement.handleTrigger(key)
            } else {
                console.warn('Target element not found or handleTrigger is not a function.')
            }
        })
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
