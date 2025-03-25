/* -------------------------------------------------------------------------- */
/* --------------------------------- RedFlow -------------------------------- */
/* -------------------------------------------------------------------------- */
function RedFlow ()
{
    // ------------- RedFlow init

    RedFlow.instance = (() =>
    {
        if (RedFlow.instance) throw new Error("You can have only one instance of ⭕ RedFlow")

        const creditInfo = {
            commentTop:
                "⭕ RedFlow - Official Webflow Library by RedKet © 2025 RedKet.\n All rights reserved. Unauthorized copying, modification, or distribution is prohibited.\n Visit: www.RedKet.com | www.Red.Ket",
            commentBottom:
                "⭕ RedFlow | OFFICIAL WEBFLOW LIBRARY BY REDKET © 2025 REDKET | WWW.REDKET.COM | WWW.RED.KET",
            logMessage: `%cRed%cFlow%c - Official Webflow Library by %cRed%cKet%c\nCopyright © 2025 RedKet. All rights reserved.\nUnauthorized copying, modification, or distribution is prohibited.\nVisit: www.RedKet.com | www.Red.Ket`,
            logStyle: [
                "color:#c33; background:#000; font-weight:bold; padding:2px 4px; border-radius:3px;",
                "color:#dfdfdf; background:#000; font-weight:bold; padding:2px 4px; border-radius:3px;",
                "color:#aaa; background:#000; padding:2px 4px; border-radius:3px;",
                "color:#c33; background:#000; font-weight:bold; padding:2px 4px; border-radius:3px;",
                "color:#dfdfdf; background:#000; font-weight:bold; padding:2px 4px; border-radius:3px;",
                "color:#888; font-size:11px;",
            ],
        }
        document.body.prepend(document.createComment(creditInfo.commentTop))
        document.body.appendChild(document.createComment(creditInfo.commentBottom))
        console.log(creditInfo.logMessage, ...creditInfo.logStyle)

        return this
    })()

    const rf = {}

    // ------------- RedFlow lib

    rf.lib = (() =>
    {
        "use strict"

        const cdn = {
            gsap: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.1/gsap.min.js",
            jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
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
                const link = document.createElement("link")
                link.rel = "preload"
                link.href = url
                link.as = "script"
                document.head.appendChild(link)
            }
            cacheScript[url] = new Promise((resolve) =>
            {
                const script = document.createElement("script")
                script.src = url
                script.defer = true
                script.onload = () =>
                {
                    resolve()
                }
                script.onerror = () =>
                {
                    console.error(url, "Failed to load")
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
                if (lib.startsWith("http")) return loadScript(lib)
                console.error(lib, "Unknown library requested")
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

        // Utility: Debounce Function
        function debounce (fn, delay)
        {
            let timer
            return (...args) =>
            {
                clearTimeout(timer)
                timer = setTimeout(() => fn.apply(this, args), delay)
            }
        }

        function observe_Resize (element, callback, delay = 400)
        {
            const debouncedCallback = debounce(callback, delay)
            const observer = new ResizeObserver(debouncedCallback)
            observer.observe(element)
            return observer
        }

        function observe_Intersect (element, callback, threshold = 0)
        {
            const observer = new IntersectionObserver((entries) => entries.forEach((entry) => callback(entry)), {
                threshold,
            })
            observer.observe(element)
            return observer
        }

        // --------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------

        // -- ✅ Modal 01 -- ✨ Version 2.0

        class Modal_01 extends HTMLElement
        {
            //--------------------------------------------
            // --------------------------- Component State

            #st = {
                anim: { init: null, open: null, close: null }, // rf-data
                ref: { backdrop: null, container: null }, // rf-data
                life: { animation: null },
                node: { isConnected: null, },
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

        // -- ✅ Trigger 01 -- ✨ Version 2.0

        class Trigger_01 extends HTMLElement
        {
            //--------------------------------------------
            // --------------------------- Component State

            #st = {
                trigger: { event: null }, // rf-data
                target: { sync: null, api: null, }, // rf-data
                life: { events: null },
                node: { isConnected: null, },
            }

            //--------------------------------------------
            // ----------------------- lifecycle callbacks

            constructor()
            {
                super()
            }

            static get observedAttributes ()
            {
                return ['trigger-event', 'target-sync', 'target-api']
            }

            attributeChangedCallback ()
            {
                // -- Empty
            }

            connectedCallback ()
            {
                this.#do.getAttr()
                this.#do.trigger.init()
                this.#st.life.isConnected = true
            }

            disconnectedCallback ()
            {
                this.#do.clearLeak()
                this.#st.life.isConnected = false
            }

            // -------------------- Helper

            #do = {

                getAttr: () =>
                {
                    this.#st.trigger.event = this.getAttribute('trigger-event')
                        .split(',')
                        .map((v) => v.trim())
                    this.#st.target.sync = this.getAttribute('target-sync')
                        .split(',')
                        .map((v) => v.trim())
                    this.#st.target.api = this.getAttribute('target-api')
                        .split(',')
                        .map((v) => v.trim())
                },

                trigger: {

                    init: () =>
                    {
                        this.#st.trigger.event.forEach((event, i) =>
                        {
                            const targetElement = document.querySelector(`[sync-id="${this.#st.target.sync[i]}"]`)
                            const targetApi = () => targetElement?.api(this.#st.target.api[i])

                            this.addEventListener(event, targetApi)
                            this.#st.life.events.push({ event, targetApi })
                        })
                    },
                },

                clearLeak: () =>
                {
                    this.#st.life.events.forEach(({ event, targetApi }) => this.removeEventListener(event, targetApi))

                    this.#st.trigger.event = null
                    this.#st.target.sync = null
                    this.#st.target.api = null
                    this.#st.life.events = null
                }

            }

            //--------------------------------------------
            // -------------------------------- Public API

            // -- Empty

        }


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
                if (o !== v && this.#st.life.isConnected) {

                    // -- Icon Attribute

                    this.#fn.iconAttr()

                    // -- Icon Render

                    this.#fn.iconRender()
                }
            }

            connectedCallback ()
            {
                // -- Icon Attribute

                this.#fn.iconAttr()

                // -- Get rf-ref
                this.#rf.ref.container = this.querySelector("[rf-ref-container]")
                if (!this.#rf.ref.container) throw new Error('child ref "rf-ref-container" does not exist')

                // -- Icon Render

                this.#fn.iconRender()

                // -- Element is Connected, now ChangedCallback works

                this.#st.life.isConnected = true
            }

            disconnectedCallback ()
            {
                this.#fn.clearLeak()
            }

            //---------------------- trigger ( util )

            #fn = {
                iconAttr: () => { this.#rf.svg.source = this.getAttribute("rf-svg-source") },
                iconRender: () => { this.#rf.ref.container.innerHTML = decodeURIComponent(this.#rf.svg.source) },
                clearLeak: () =>
                {
                    this.#rf.svg.source = null
                    this.#rf.ref.container = null
                    this.#st.life.isConnected = null
                }
            }

            //--------------------------------------------
            // --------------------------------------- API

            //---------------------- api (private)

            // -- Empty

            //---------------------- api (public)

            // -- Empty

        }

        class Marquee_01 extends HTMLElement
        {
            //--------------------------------------------
            // ------------------------------------- STATE

            //---------------------- state ( private )

            #st = {
                life: { tween: null, tweenOld: null, isConnected: null },
                observe: { resize: null, intersecting: null, isIntersecting: null },
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
                return ["rf-anim-ease", "rf-anim-direction", "rf-anim-duration"]
            }

            attributeChangedCallback (n, o, v)
            {
                if (o !== v && this.#st.life.isConnected) {
                    // -- Animation Attribute

                    this.#fn.animAttr()

                    // -- Animation Render

                    this.#fn.animRender()

                    // -- If not intersected, Pause

                    if (!this.#st.observe.isIntersecting) this.#st.life.tween.pause()
                }
            }

            connectedCallback ()
            {
                // -- Animation Attribute

                this.#fn.animAttr()



                // -- Get rf-ref / If no tween DOM, Make Clone
                this.#rf.ref.slider = this.querySelectorAll("[rf-ref-slider]")

                if (!this.#rf.ref.slider || this.#rf.ref.slider.length === 0 || this.#rf.ref.slider.length > 2) {
                    throw new Error('child ref "rf-ref-slider" does not exist or there are too many')
                }

                if (this.#rf.ref.slider.length == 1) this.appendChild(this.#rf.ref.slider[0].cloneNode(true))

                // -- Animation Render

                this.#fn.animRender()

                // -- Observer : Resize - Debounce
                this.#st.observe.resize = observe_Resize(this, () =>
                {
                    this.#fn.animRender()
                    if (!this.#st.observe.isIntersecting) {
                        this.#st.life.tween.pause()
                    }
                })

                // -- Observer - Intersect Implement

                this.#st.observe.intersecting = observe_Intersect(this, (entry) =>
                {
                    this.#st.observe.isIntersecting = entry.isIntersecting
                    if (entry.isIntersecting && this.#st.life.tween && !this.#st.life.tween.isActive()) {
                        this.#st.life.tween.resume()
                    } else if (this.#st.life.tween && this.#st.life.tween.isActive()) {
                        this.#st.life.tween.pause()
                    }
                })

                // -- Element is Connected, now ChangedCallback works

                this.#st.life.isConnected = true
            }

            disconnectedCallback ()
            {
                this.#fn.clearLeak()
            }

            //---------------------- trigger ( utility )

            #fn = {
                animAttr: () =>
                {
                    // -- Get rf-anim
                    this.#rf.anim.ease = this.getAttribute("rf-anim-ease")
                    this.#rf.anim.duration = parseFloat(this.getAttribute("rf-anim-duration"))
                    this.#rf.anim.direction = this.getAttribute("rf-anim-direction")
                },

                animRender: () =>
                {
                    // -- kill animation / but save animation position

                    if (this.#st.life.tween) {
                        this.#st.life.tweenOld = this.#st.life.tween.progress()
                        this.#st.life.tween.progress(0).kill()
                        this.#st.life.tween = null
                    }

                    this.#rf.ref.slider = this.querySelectorAll("[rf-ref-slider]")
                    const w = this.#rf.ref.slider[0].getBoundingClientRect().width

                    // -- create new animation

                    this.#st.life.tween = gsap.fromTo(
                        this.#rf.ref.slider,
                        { x: this.#rf.anim.direction === "left" ? 0 : -w },
                        {
                            x: this.#rf.anim.direction === "left" ? -w : 0,
                            duration: this.#rf.anim.duration,
                            ease: this.#rf.anim.ease,
                            repeat: -1,
                        }
                    )

                    // -- bring back animation position

                    this.#st.life.tween.progress(this.#st.life.tweenOld)
                },

                clearLeak: () =>
                {
                    // -- Clear Memory Leak
                    if (this.#st.life.tween) this.#st.life.tween.progress(0).kill()

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
                    this.#st.life.tweenOld = null
                    this.#st.life.tween = null
                    this.#st.life.isConnected = null

                    this.#st.observe.resize = null
                    this.#st.observe.intersecting = null // optional
                    this.#st.observe.isIntersecting = null // optional

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
                    this.setAttribute("rf-anim-direction", direction)
                },

                setEase: (ease) =>
                {
                    this.setAttribute("rf-anim-ease", ease)
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
                    case "remove":
                        this.#api.remove()
                        break
                    case "pause":
                        this.#api.pause()
                        break
                    case "resume":
                        this.#api.resume()
                        break
                    case "restart":
                        this.#api.restart()
                        break
                    case "setSpeed":
                        this.#api.setSpeed(params.speedMultiplier)
                        break
                    case "setDirection":
                        this.#api.setDirection(params.direction)
                        break
                    case "setEase":
                        this.#api.setEase(params.ease)
                        break
                    case "stop":
                        this.#api.stop()
                        break
                    default:
                        console.warn("Invalid API action:", action)
                }
            }
        }

        return { Marquee_01, Icon_01, Trigger_01, Modal_01 }
    })()

    rf.lib.load(["gsap"]).then(() =>
    {
        customElements.define('redflow-modal-01', rf.component.Modal_01)
        customElements.define('redflow-trigger-01', rf.component.Trigger_01)
        customElements.define('redflow-icon-01', rf.component.Icon_01)
        customElements.define("redflow-marquee-01", rf.component.Marquee_01)
    })
}

document.addEventListener("DOMContentLoaded", () =>
{
    try {
        RedFlow()
    } catch (e) {
        console.warn("⭕ RedFlow Error :", e)
    }
})
