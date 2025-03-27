/* -------------------------------------------------------------------------- */
/* --------------------------------- RedFlow -------------------------------- */
/* -------------------------------------------------------------------------- */
function RedFlow ()
{
    // ------------- RedFlow init

    RedFlow.instance = (() =>
    {
        if (RedFlow.instance) throw new Error('You can have only one instance of ⭕ RedFlow')

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
                    resolve()
                }
                script.onerror = () =>
                {
                    console.error(url, 'Failed to load')
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
                console.error(lib, 'Unknown library requested')
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

        function getAttr (el, attrName, expectedType)
        {
            // Validate that el is a valid DOM element
            if (!el || typeof el.getAttribute !== 'function') {
                throw new Error('Invalid element provided')
            }

            // Validate that attrName is a non-empty string
            if (typeof attrName !== 'string' || attrName.trim() === '') {
                throw new Error('Attribute name must be a non-empty string')
            }

            const attrValue = el.getAttribute(attrName)
            if (attrValue === null) return null

            let trimmed = attrValue.trim()
            if (trimmed === '') return trimmed // Return empty string if no content

            // If expectedType is provided, try to coerce the value accordingly
            if (expectedType) {
                switch (expectedType.toLowerCase()) {
                    case 'json':
                    case 'object':
                        // If it looks like JSON, try parsing it
                        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                            try {
                                return JSON.parse(trimmed)
                            } catch (err) {
                                console.warn('Failed to parse JSON:', trimmed)
                                return null
                            }
                        }
                        // Fall back if not a valid JSON string
                        return null
                    case 'boolean':
                        // Explicitly convert to boolean (false unless it's one of these truthy strings)
                        return ['true', 'yes', 'on'].includes(trimmed.toLowerCase())
                    case 'number':
                        // Use regex to ensure it's a proper number before conversion
                        if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
                            return Number(trimmed)
                        }
                        return NaN // or throw an error / return a default value
                    case 'string':
                        // Always return as a string
                        return trimmed
                    default:
                        // If unknown type, you might want to throw an error or simply return the trimmed value
                        console.warn(`Unsupported expected type: ${expectedType}`)
                        return trimmed
                }
            }

            // Fallback to auto-conversion logic if no expectedType is provided

            const lower = trimmed.toLowerCase()

            // Convert boolean-like strings to booleans
            if (['true', 'yes', 'on'].includes(lower)) {
                return true
            } else if (['false', 'no', 'off'].includes(lower)) {
                return false
            }

            // Use regex to check if the entire string is a valid number
            if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
                return Number(trimmed)
            }

            // If the string looks like JSON, try parsing it
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                try {
                    return JSON.parse(trimmed)
                } catch (err) {
                    console.warn('Failed to parse JSON:', trimmed)
                }
            }

            // Otherwise, return the trimmed string
            return trimmed
        }

        function debounce (fn, delay)
        {
            let timer
            return (...args) =>
            {
                clearTimeout(timer)
                timer = setTimeout(() => fn.apply(this, args), delay)
            }
        }

        function observeEvent (element, eventType, callback, cache)
        {
            element.addEventListener(eventType, callback)
            const cleanup = () => element.removeEventListener(eventType, callback)
            if (cache) {
                cache.push(cleanup)
            }
            return cleanup
        }

        function observeResize (element, callback, delay = 400, cache)
        {
            const debouncedCallback = debounce(callback, delay)
            const observer = new ResizeObserver(debouncedCallback)
            observer.observe(element)
            const cleanup = () => observer.disconnect()
            if (cache) {
                cache.push(cleanup)
            }
            return cleanup
        }

        function observeIntersect (element, callback, threshold = 0, cache)
        {
            const observer = new IntersectionObserver((entries) => entries.forEach((entry) => callback(entry)), {
                threshold,
            })
            observer.observe(element)
            const cleanup = () => observer.disconnect()
            if (cache) {
                cache.push(cleanup)
            }
            return cleanup
        }

        // --------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------

        /*
   
    	

        class Trigger_01 extends HTMLElement {
            //--------------------------------------------
            // --------------------------- Component State

            #st = {
                trigger: { event: [] }, // rf-data
                target: { sync: [], api: [] }, // rf-data
                life: { events: [] },
                node: { isConnected: null },
            }

            //--------------------------------------------
            // ----------------------- lifecycle callbacks

            constructor() {
                super()
            }

            static get observedAttributes() {
                return ['trigger-event', 'target-sync', 'target-api']
            }

            attributeChangedCallback() {
                // -- Empty
            }

            connectedCallback() {
                this.#do.getAttr()
                this.#do.trigger.init()
                this.#st.life.isConnected = true
            }

            disconnectedCallback() {
                this.#do.clearLeak()
                this.#st.life.isConnected = false
            }

            // -------------------- Helper

            #do = {
                getAttr: () => {
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
                    init: () => {
                        this.#st.trigger.event.forEach((event, i) => {
                            const targetElement = document.querySelector(`[sync-id="${this.#st.target.sync[i]}"]`)
                            const targetApi = () => targetElement?.api(this.#st.target.api[i])

                            this.addEventListener(event, targetApi)
                            this.#st.life.events.push({ event, targetApi })
                        })
                    },
                },

                clearLeak: () => {
                    this.#st.life.events.forEach(({ event, targetApi }) => this.removeEventListener(event, targetApi))

                    this.#st.trigger.event = []
                    this.#st.target.sync = []
                    this.#st.target.api = []
                    this.#st.life.events = []
                },
            }

            //--------------------------------------------
            // -------------------------------- Public API

            // -- Empty
        }

        class Icon_01 extends HTMLElement {
            //--------------------------------------------
            // ------------------------------------- STATE

            //---------------------- state ( private )

            #st = { life: { isConnected: null } }

            //---------------------- api (private)

            #rf = { svg: { source: null }, ref: { container: null } } // RedFlow

            //--------------------------------------------
            // ----------------------------------- TRIGGER

            //---------------------- trigger ( callback )

            constructor() {
                super()
            }

            static get observedAttributes() {
                return ['rf-svg-source']
            }

            attributeChangedCallback(n, o, v) {
                if (o !== v && this.#st.life.isConnected) {
                    // -- Icon Attribute

                    this.#fn.iconAttr()

                    // -- Icon Render

                    this.#fn.iconRender()
                }
            }

            connectedCallback() {
                // -- Icon Attribute

                this.#fn.iconAttr()

                // -- Get rf-ref
                this.#rf.ref.container = this.querySelector('[rf-ref-container]')
                if (!this.#rf.ref.container) throw new Error('child ref "rf-ref-container" does not exist')

                // -- Icon Render

                this.#fn.iconRender()

                // -- Element is Connected, now ChangedCallback works

                this.#st.life.isConnected = true
            }

            disconnectedCallback() {
                this.#fn.clearLeak()
            }

            //---------------------- trigger ( util )

            #fn = {
                iconAttr: () => {
                    this.#rf.svg.source = this.getAttribute('rf-svg-source')
                },
                iconRender: () => {
                    this.#rf.ref.container.innerHTML = decodeURIComponent(this.#rf.svg.source)
                },
                clearLeak: () => {
                    this.#rf.svg.source = null
                    this.#rf.ref.container = null
                    this.#st.life.isConnected = null
                },
            }

            //--------------------------------------------
            // --------------------------------------- API

            //---------------------- api (private)

            // -- Empty

            //---------------------- api (public)

            // -- Empty
        }

        class Marquee_01 extends HTMLElement {
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

            constructor() {
                super()
            }

            static get observedAttributes() {
                return ['rf-anim-ease', 'rf-anim-direction', 'rf-anim-duration']
            }

            attributeChangedCallback(n, o, v) {
                if (o !== v && this.#st.life.isConnected) {
                    // -- Animation Attribute

                    this.#fn.animAttr()

                    // -- Animation Render

                    this.#fn.animRender()

                    // -- If not intersected, Pause

                    if (!this.#st.observe.isIntersecting) this.#st.life.tween.pause()
                }
            }

            connectedCallback() {
                // -- Animation Attribute

                this.#fn.animAttr()

                // -- Get rf-ref / If no tween DOM, Make Clone
                this.#rf.ref.slider = this.querySelectorAll('[rf-ref-slider]')

                if (!this.#rf.ref.slider || this.#rf.ref.slider.length === 0 || this.#rf.ref.slider.length > 2) {
                    throw new Error('child ref "rf-ref-slider" does not exist or there are too many')
                }

                if (this.#rf.ref.slider.length == 1) this.appendChild(this.#rf.ref.slider[0].cloneNode(true))

                // -- Animation Render

                this.#fn.animRender()

                // -- Observer : Resize - Debounce
                this.#st.observe.resize = observe_Resize(this, () => {
                    this.#fn.animRender()
                    if (!this.#st.observe.isIntersecting) {
                        this.#st.life.tween.pause()
                    }
                })

                // -- Observer - Intersect Implement

                this.#st.observe.intersecting = observe_Intersect(this, (entry) => {
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

            disconnectedCallback() {
                this.#fn.clearLeak()
            }

            //---------------------- trigger ( utility )

            #fn = {
                animAttr: () => {
                    // -- Get rf-anim
                    this.#rf.anim.ease = this.getAttribute('rf-anim-ease')
                    this.#rf.anim.duration = parseFloat(this.getAttribute('rf-anim-duration'))
                    this.#rf.anim.direction = this.getAttribute('rf-anim-direction')
                },

                animRender: () => {
                    // -- kill animation / but save animation position

                    if (this.#st.life.tween) {
                        this.#st.life.tweenOld = this.#st.life.tween.progress()
                        this.#st.life.tween.progress(0).kill()
                        this.#st.life.tween = null
                    }

                    this.#rf.ref.slider = this.querySelectorAll('[rf-ref-slider]')
                    const w = this.#rf.ref.slider[0].getBoundingClientRect().width

                    // -- create new animation

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

                    // -- bring back animation position

                    this.#st.life.tween.progress(this.#st.life.tweenOld)
                },

                clearLeak: () => {
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
                pause: () => {
                    if (this.#st.life.tween && this.#st.life.tween.isActive()) {
                        this.#st.life.tween.pause()
                    }
                },

                resume: () => {
                    if (this.#st.life.tween && !this.#st.life.tween.isActive()) {
                        this.#st.life.tween.resume()
                    }
                },

                remove: () => {
                    this.remove()
                },

                setSpeed: (speedMultiplier) => {
                    if (this.#st.life.tween) {
                        this.#st.life.tween.timeScale(speedMultiplier)
                    }
                },

                setDirection: (direction) => {
                    this.setAttribute('rf-anim-direction', direction)
                },

                setEase: (ease) => {
                    this.setAttribute('rf-anim-ease', ease)
                },

                restart: () => {
                    if (this.#st.life.tween) {
                        this.#st.life.tween.restart()
                    }
                },

                stop: () => {
                    if (this.#st.life.tween) {
                        this.#st.life.tween.progress(0).pause()
                    }
                },
            }

            //---------------------- api (public)

            api(action, params) {
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
        */

        // -- ✅ Modal 01 -- ✨ Version 2.0

        class Modal_01 extends HTMLElement
        {
            //--------------------------------------------
            // --------------------------- Component State

            // -- Data RF
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
            #gsapTween
            // -- Node State
            #isOpen
            #isConnected

            //--------------------------------------------
            // ----------------------- lifecycle callbacks

            constructor()
            {
                super()
                // -- Data RF
                this.#nulling()
                // -- Aria Accessbility
                this.setAttribute('role', 'region')
                this.setAttribute('aria-label', 'Modal Menu Navigation')
            }

            static get observedAttributes ()
            {
                return ['sync-group', 'anim-init', 'anim-open', 'anim-close']
            }

            attributeChangedCallback (n, o, v)
            {
                if (o !== v && this.#isConnected) {
                    return
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

                //TODO fix the backdrop
                //if (this.#st.ref.backdrop) gsap.set(this.#backdrop, this.#st.anim.init)

                this.#gsapTween = gsap.timeline()
                this.#gsapTween.set(this.#container, { display: 'none' }).set(this.#container, this.#animInit)
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
                this.#gsapTween?.kill()
                this.#gsapTween = gsap.timeline()
                this.#gsapTween
                    .set(this.#container, { display: 'block' })
                    .set(this.#container, this.#animInit)
                    .to(this.#container, this.#animOpen)
                this.#isOpen = true
            }

            #animateClose ()
            {
                this.#gsapTween?.kill()
                this.#gsapTween = gsap.timeline()
                this.#gsapTween.to(this.#container, this.#animClose).set(this.#container, { display: 'none' })
                this.#isOpen = false
            }

            #clearLeak ()
            {
                this.#cacheClick.forEach((cleanup) => cleanup())

                gsap.killTweensOf(this.#backdrop)
                gsap.killTweensOf(this.#container)

                this.#gsapTween?.kill()

                this.#nulling()
            }

            #nulling ()
            {
                this.#animInit = null
                this.#animOpen = null
                this.#animClose = null
                this.#syncGroup = null
                // -- Ref Html
                this.#backdrop = null
                this.#container = null
                this.#closeBtn = null
                this.#triggerBtn = null
                // -- Cache Array
                this.#cacheClick = []
                // -- Anim State
                this.#gsapTween = 0
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

        // -- ✅ Slider 01 -- ✨ Version 2.0

        class Slider_01 extends HTMLElement
        {
            //--------------------------------------------
            // --------------------------- Component State

            // -- Data RF
            #loopBack
            #autoMode
            #autoTime
            #slideStep
            // -- Ref Html
            #mask
            #slides
            #nextBtn
            #prevBtn
            // -- Cache Array
            #cacheClick
            #cacheResize
            #cacheInView
            // -- Node State
            #inView
            #isConnected
            #gsapTween
            #autoTimeId
            #currentSlide

            //--------------------------------------------
            // ----------------------- lifecycle callbacks

            constructor()
            {
                super()

                this.#cacheClick = []
                this.#cacheResize = []
                this.#cacheInView = []

                this.#inView = false
                this.#isConnected = false
                this.#gsapTween = 0
                this.#autoTimeId = 0
                this.#currentSlide = 0

                this.setAttribute('role', 'region')
                this.setAttribute('aria-label', 'Image Slider')
            }

            static get observedAttributes ()
            {
                return ['loop-back', 'auto-mode', 'auto-time', 'slide-step']
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
                this.#auto()
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
                this.#loopBack = getAttr(this, 'loop-back', 'boolean')
                this.#autoMode = getAttr(this, 'auto-mode', 'boolean')
                this.#autoTime = getAttr(this, 'auto-time', 'number')
                this.#slideStep = getAttr(this, 'slide-step', 'number')
            }

            #ref ()
            {
                this.#mask = this.querySelector('[ref-mask]')
                this.#slides = this.querySelectorAll('[ref-slide]')
                this.#nextBtn = this.querySelector('[ref-next]')
                this.#prevBtn = this.querySelector('[ref-prev]')
            }

            #init ()
            {
                if (this.#nextBtn) observeEvent(this.#nextBtn, 'click', () => this.#next(), this.#cacheClick)
                if (this.#prevBtn) observeEvent(this.#prevBtn, 'click', () => this.#prev(), this.#cacheClick)
                observeResize(this, () => this.#reset(), 500, this.#cacheResize)
                observeIntersect(this, (e) => (this.#inView = e.isIntersecting), this.#cacheInView)
            }

            #auto ()
            {
                if (this.#autoMode && this.#inView) {
                    this.#next()
                }
                this.#autoTimeId = setTimeout(() => this.#auto(), this.#autoTime)
            }

            #next ()
            {
                const newSlide = this.#currentSlide + this.#slideStep
                if (newSlide <= this.#slides.length - 1) {
                    this.#currentSlide = newSlide
                    this.#animate()
                } else if (this.#loopBack) {
                    this.#currentSlide = 0
                    this.#animate()
                }
            }

            #prev ()
            {
                const newSlide = this.#currentSlide - this.#slideStep
                if (newSlide >= 0) {
                    this.#currentSlide = newSlide
                    this.#animate()
                } else if (this.#loopBack) {
                    this.#currentSlide = this.#slides.length - 1
                    this.#animate()
                }
            }

            #animate ()
            {
                const targetSlide = this.#slides[this.#currentSlide]
                const containerRect = this.#mask.getBoundingClientRect()
                const slideRect = targetSlide.getBoundingClientRect()
                const offset = slideRect.left - containerRect.left

                this.#gsapTween = gsap.to(this.#mask, {
                    x: -offset,
                    duration: 0.5,
                    ease: 'none',
                })
            }

            #reset ()
            {
                if (this.#gsapTween) {
                    this.#gsapTween.progress(0).kill()
                }

                const targetSlide = this.#slides[this.#currentSlide]
                const containerRect = this.#mask.getBoundingClientRect()
                const slideRect = targetSlide.getBoundingClientRect()
                const offset = slideRect.left - containerRect.left

                gsap.to(this.#mask, {
                    x: -offset,
                    duration: 0,
                })
            }

            #clearLeak ()
            {
                this.#cacheClick.forEach((cleanup) => cleanup())

                this.#cacheResize.forEach((cleanup) => cleanup())

                this.#cacheInView.forEach((cleanup) => cleanup())

                //TODO make sure these is somewhere you do ' this.#gsapTween?.kill() '

                clearTimeout(this.#autoTimeId)

                this.#cacheClick = []
                this.#cacheResize = []
                this.#cacheInView = []

                this.#inView = false
                this.#isConnected = false
                this.#gsapTween = 0
                this.#currentSlide = 0
            }

            //--------------------------------------------
            // ------------------------------- Private API

            // -- Empty

            //--------------------------------------------
            // -------------------------------- Public API

            // -- Empty
        }

        return { Slider_01, Modal_01 }
    })()

    rf.lib.load(['gsap']).then(() =>
    {
        //customElements.define('redflow-trigger-01', rf.component.Trigger_01)
        //customElements.define('redflow-icon-01', rf.component.Icon_01)
        //customElements.define('redflow-marquee-01', rf.component.Marquee_01)
        customElements.define('redflow-modal-01', rf.component.Modal_01)
        customElements.define('reflow-slider-01', rf.component.Slider_01)
    })
}

document.addEventListener('DOMContentLoaded', () =>
{
    try {
        RedFlow()
    } catch (e) {
        console.warn('⭕ RedFlow Error :', e)
    }
})
