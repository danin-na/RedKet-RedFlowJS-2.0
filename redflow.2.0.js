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

        function observeIntersect2 (element, onIntersect, onNotIntersect, cache, threshold = 0)
        {
            const observer = new IntersectionObserver(
                (entries) =>
                {
                    entries.forEach((entry) =>
                    {
                        if (entry.isIntersecting) {
                            onIntersect(entry)
                        } else {
                            onNotIntersect(entry)
                        }
                    })
                },
                { threshold }
            )

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

 
        */

        // -- ✅ Modal 01 -- ✨ Version 2.0

        class Marquee_01 extends HTMLElement
        {
            // --------------------------------------------
            // -- Element - State -------------------------
            // --------------------------------------------



            #isConnected = false

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
                if (o !== v && this.#isConnected) {
                    this.#anim_reset()
                }
            }

            connectedCallback ()
            {
                this.#anim_init()
                this.#isConnected = true
            }

            disconnectedCallback ()
            {
                this.#anim_clear()
                this.#isConnected = false
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
                this.#_comp_set_el()
                this.#_comp_set_ev()
                this.#_comp_get_el()
                this.#_anim_get_opt()
                this.#_anim_run()
            }

            #anim_reset ()
            {
                this.#_anim_get_opt()
                this.#_anim_reset()
                this.#_anim_run()
            }

            #anim_clear ()
            {
                this.#anim_tween?.progress(0).kill()
                this.#anim_cache_intersect.forEach((cleanup) => cleanup())

                this.#comp_slide = null
                this.#anim_opt = {}
                this.#anim_frX = 0
                this.#anim_toX = 0
                this.#anim_tween = null
                this.#anim_tweenProg = 0
                this.#anim_cache_intersect = []
            }

            // --------------------------------------------
            // -- Private - Helper ------------------------
            // --------------------------------------------

            #comp_slide = null

            #anim_opt = {}
            #anim_frX = 0
            #anim_toX = 0
            #anim_tween = null
            #anim_tweenProg = 0
            #anim_cache_intersect = []

            #_comp_set_el ()
            {
                const sliders = Array.from(this.querySelectorAll('[ref-slider]'))

                if (!sliders.length) throw new Error('No child ref "ref-slider"')

                for (let i = 1; i < sliders.length; i++) sliders[i].remove()

                this.appendChild(sliders[0].cloneNode(true))
            }

            #_comp_get_el ()
            {
                this.#comp_slide = this.querySelectorAll('[ref-slider]')
            }

            #_comp_set_ev ()
            {
                observeIntersect2(
                    this,
                    () => this.#_anim_resume(),
                    () => this.#_anim_pause(),
                    this.#anim_cache_intersect,
                    0
                )
            }

            #_anim_get_opt ()
            {
                const _anim_deft = { duration: 10, ease: 'none', repeat: -1 }
                const _anim_user = getAttr(this, 'anim-opt', 'json') || {}
                const _direction = _anim_user.direction || 'left'
                const _width = this.#comp_slide[0].getBoundingClientRect().width

                delete this.#anim_opt.direction

                this.#anim_frX = _direction === 'left' ? 0 : -_width
                this.#anim_toX = _direction === 'left' ? -_width : 0
                this.#anim_opt = { ..._anim_deft, ..._anim_user }
            }

            #_anim_run ()
            {
                this.#anim_tweenProg = this.#anim_tweenProg || 0
                this.#anim_tween = gsap.fromTo(
                    this.#comp_slide,
                    { x: this.#anim_frX },
                    { x: this.#anim_toX, ...this.#anim_opt }
                )
                this.#anim_tween.progress(this.#anim_tweenProg)
                this.#anim_tweenProg = 0
            }

            #_anim_reset ()
            {
                if (this.#anim_tween) {
                    this.#anim_tweenProg = this.#anim_tween.progress()
                    this.#anim_tween.progress(0).kill()
                    this.#anim_tween = null
                }
            }

            #_anim_pause ()
            {
                this.#anim_tween.pause()
            }

            #_anim_resume ()
            {
                this.#anim_tween.resume()
            }
        }



        return { Marquee_01 }
    })()

    rf.lib.load(['gsap']).then(() =>
    {
        //customElements.define('redflow-trigger-01', rf.component.Trigger_01)
        //customElements.define('redflow-icon-01', rf.component.Icon_01)
        customElements.define('redflow-marquee-01', rf.component.Marquee_01)
        //customElements.define('redflow-modal-01', rf.component.Modal_01)
        //customElements.define('redflow-slider-01', rf.component.Slider_01)
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
