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

        const fn = {
            getAttr (el, attrName, expectedType)
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
            },

            debounce (fn, delay)
            {
                let timer
                return (...args) =>
                {
                    clearTimeout(timer)
                    timer = setTimeout(() => fn.apply(this, args), delay)
                }
            },

            observeEvent (element, eventType, callback, cache)
            {
                element.addEventListener(eventType, callback)
                const cleanup = () => element.removeEventListener(eventType, callback)
                if (cache) {
                    cache.push(cleanup)
                }
                return cleanup
            },

            observeResize (element, callback, cache, delay = 400)
            {
                const debouncedCallback = fn.debounce(callback, delay)
                const observer = new ResizeObserver(debouncedCallback)
                observer.observe(element)
                const cleanup = () => observer.disconnect()
                if (cache) {
                    cache.push(cleanup)
                }
                return cleanup
            },

            observeIntersect (element, onIntersect, onNotIntersect, cache, threshold = 0)
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
            },
        }

        class Modal_01 extends HTMLElement
        {
            // --------------------------------------------
            // -- Element - State -------------------------
            // --------------------------------------------

            #state = {
                sync: { selfId: '', groupId: '' },
                node: { back: null, item: null, open: null, close: null },
                anim: { optInit: [], optOpen: [], optClose: [] },
                stat: { isOpen: false, isConnected: false },
                tween: { item: null, back: null },
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
                    const { anim, node, tween } = this.#state;

                    if (node.back) {
                        tween.back?.kill()
                        tween.back = gsap.timeline()
                        tween.back = gsap.set(node.back, { display: 'none', autoAlpha: 0 })
                    }
                    if (node.item) {
                        tween.item?.kill()
                        tween.item = gsap.timeline()
                        tween.item.set(node.item, { ...anim.optInit })
                    }
                },

                animationOpen: () =>
                {
                    const { sync, anim, node, stat, tween } = this.#state;

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
                        tween.back?.kill()
                        tween.back = gsap.timeline()
                        tween.back.set(node.back, { display: 'block', autoAlpha: 1, duration: 0.2, ease: 'none' })
                    }
                    if (node.item) {
                        tween.item?.kill()
                        tween.item = gsap.timeline()
                        tween.item.set(node.item, { ...anim.optInit }).to(node.item, { ...anim.optOpen })
                        stat.isOpen = true
                    }
                },

                animationClose: () =>
                {
                    const { anim, node, stat, tween } = this.#state

                    if (node.back) {
                        tween.back?.kill()
                        tween.back = gsap.timeline()
                        tween.back.set(node.back, { display: 'none', autoAlpha: 0, duration: 0.2, ease: 'none' })
                    }
                    if (node.item) {
                        tween.item?.kill()
                        tween.item = gsap.timeline()
                        tween.item.set(node.item, { ...anim.optClose }).to(node.item, { ...anim.optInit })
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
                    const { sync, anim, node, stat, tween, cache } = this.#state

                    cache.animClick.forEach((cleanup) => cleanup())

                    tween.back?.progress(0).kill()
                    tween.item?.progress(0).kill()

                    sync.selfId = '', sync.groupId = ''
                    anim.optInit = [], anim.optOpen = [], anim.optClose = []
                    node.back = null, node.item = null, node.open = null, node.close = null
                    tween.back = null, tween.item = null
                    stat.isOpen = false
                    cache.animClick = []
                }
            }
        }

        // -- ✅ Slider 01 -- ✨ Version 2.0

        class Slider_01 extends HTMLElement
        {
            // --------------------------------------------
            // -- Element - State -------------------------
            // --------------------------------------------

            #state = {
                anim: {
                    opt: {},
                    loopBack: false,
                    autoMode: false,
                    autoTime: 0,
                    autoPause: null,
                    slideStep: 0,
                    tween: null,
                },
                node: {
                    mask: null,
                    slide: null,
                    nextBtn: null,
                    prevBtn: null,
                    currentSlide: 0,
                    isConnected: false,
                },
                cache: {
                    animClick: [],
                    animItersect: [],
                    animResize: [],
                    autoTimeId: 0,
                },
            }

            // --------------------------------------------
            // -- Lifecycle - Callbacks -------------------
            // --------------------------------------------

            constructor()
            {
                super()
            }

            static get observedAttributes ()
            {
                return ['anim-opt']
            }

            attributeChangedCallback (n, o, v)
            {
                if (o !== v && this.#state.node.isConnected) {
                    // -- Empty
                }
            }

            connectedCallback ()
            {
                this.#api.animationInit()
                this.#state.node.isConnected = true
            }

            disconnectedCallback ()
            {
                this.#api.memoryClear()
                this.#state.node.isConnected = false
            }

            // --------------------------------------------
            // -- Private - API ---------------------------
            // --------------------------------------------

            #api = {
                animationInit: () =>
                {
                    this.#fn.elementGet()
                    this.#fn.animationSet()
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
                    // -- empty
                },

                elementGet: () =>
                {
                    const node = this.#state.node
                    node.mask = this.querySelector('[ref-mask]')
                    node.slide = this.querySelectorAll('[ref-slide]')
                    node.nextBtn = this.querySelector('[ref-next]')
                    node.prevBtn = this.querySelector('[ref-prev]')
                },

                observerSet: () =>
                {
                    const node = this.#state.node
                    const cache = this.#state.cache
                    if (node.nextBtn) fn.observeEvent(node.nextBtn, 'click', () => this.#fn.animationNext())
                    if (node.prevBtn) fn.observeEvent(node.prevBtn, 'click', () => this.#fn.animationPrev(), cache.animClick)
                    fn.observeIntersect(
                        this,
                        () => this.#fn.animationAutoResume(),
                        () => this.#fn.animationAutoPause(),
                        cache.animItersect
                    )
                    fn.observeResize(this, () => this.#fn.animationReset(), cache.animResize, 500)
                },

                animationSet: () =>
                {
                    const anim = this.#state.anim
                    const {
                        loopBack = true,
                        autoMode = true,
                        autoTime = 5000,
                        slideStep = 1,
                        ...userOpts
                    } = fn.getAttr(this, 'anim-opts', 'json') || {}
                    anim.loopBack = loopBack
                    anim.autoMode = autoMode
                    anim.autoTime = autoTime
                    anim.slideStep = slideStep
                    anim.opt = { duration: 0.5, ease: 'none', ...userOpts }
                },

                animationAuto: () =>
                {
                    const anim = this.#state.anim
                    const cache = this.#state.cache
                    clearTimeout(cache.autoTimeId)
                    if (anim.autoMode && !anim.autoPause) {
                        this.#fn.animationNext()
                        cache.autoTimeId = setTimeout(() => this.#fn.animationAuto(), anim.autoTime)
                    }
                },

                animationAutoPause: () =>
                {
                    const anim = this.#state.anim
                    const cache = this.#state.cache
                    anim.autoPause = true
                    clearTimeout(cache.autoTimeId)
                },

                animationAutoResume: () =>
                {
                    const anim = this.#state.anim
                    anim.autoPause = false
                    this.#fn.animationAuto()
                },

                animationNext: () =>
                {
                    const anim = this.#state.anim
                    const node = this.#state.node

                    const newSlide = node.currentSlide + anim.slideStep
                    if (newSlide <= node.slide.length - 1) {
                        node.currentSlide = newSlide
                        this.#fn.animationRun()
                    } else if (anim.loopBack) {
                        node.currentSlide = 0
                        this.#fn.animationRun()
                    }
                },

                animationPrev: () =>
                {
                    const anim = this.#state.anim
                    const node = this.#state.node

                    const newSlide = node.currentSlide - anim.slideStep
                    if (newSlide >= 0) {
                        node.currentSlide = newSlide
                        this.#fn.animationRun()
                    } else if (anim.loopBack) {
                        node.currentSlide = node.slide.length - 1
                        this.#fn.animationRun()
                    }
                },

                animationRun: () =>
                {
                    const anim = this.#state.anim
                    const node = this.#state.node

                    const offset =
                        node.slide[node.currentSlide].getBoundingClientRect().left - node.mask.getBoundingClientRect().left

                    anim.tween?.kill()
                    anim.tween = gsap.timeline()
                    anim.tween.to(node.mask, { x: -offset, ...anim.opt })
                },

                animationReset: () =>
                {
                    const anim = this.#state.anim
                    const node = this.#state.node

                    const offset =
                        node.slide[node.currentSlide].getBoundingClientRect().left - node.mask.getBoundingClientRect().left

                    anim.tween?.kill()
                    anim.tween = gsap.timeline()
                    anim.tween.to(node.mask, { x: -offset, duration: 0 })
                },

                memoryClear: () =>
                {
                    const anim = this.#state.anim
                    const node = this.#state.node
                    const cache = this.#state.cache

                    cache.animClick.forEach((cleanup) => cleanup())
                    cache.animItersect.forEach((cleanup) => cleanup())
                    cache.animResize.forEach((cleanup) => cleanup())
                    clearTimeout(cache.autoTimeId)
                    anim.tween?.progress(0).kill()

                    anim.opt = []
                    anim.loopBack = false
                    anim.autoMode = false
                    anim.autoPause = false
                    anim.autoTime = 0
                    anim.slideStep = 0
                    anim.tween = null
                    node.mask = null
                    node.slide = null
                    node.nextBtn = null
                    node.prevBtn = null
                    node.currentSlide = 0
                },
            }
        }

        // -- ✅ Modal 01 -- ✨ Version 2.0

        class Marquee_01 extends HTMLElement
        {
            // --------------------------------------------
            // -- Element - State -------------------------
            // --------------------------------------------

            #state = {
                anim: { opt: {}, frX: 0, toX: 0, tween: null, prog: 0, obsv: { intersect: [] } },
                node: { slide: null, isConnected: false },
            }

            // --------------------------------------------
            // -- Lifecycle - Callbacks -------------------
            // --------------------------------------------

            constructor()
            {
                super()
            }

            static get observedAttributes ()
            {
                return ['anim-opt']
            }

            attributeChangedCallback (n, o, v)
            {
                if (o !== v && this.#state.node.isConnected) {
                    this.#api.animationReload()
                }
            }

            connectedCallback ()
            {
                this.#api.animationInit()
                this.#state.node.isConnected = true
            }

            disconnectedCallback ()
            {
                this.#api.memoryClear()
                this.#state.node.isConnected = false
            }

            // --------------------------------------------
            // -- Public - API ----------------------------
            // --------------------------------------------

            // -- Empty

            // --------------------------------------------
            // -- Private - API ---------------------------
            // --------------------------------------------

            #api = {
                animationInit: () =>
                {
                    this.#fn.elementSet()
                    this.#fn.elementGet()
                    this.#fn.animationSet()
                    this.#fn.animationRun()
                    this.#fn.observerSet()
                },

                animationReload: () =>
                {
                    this.#fn.animationSet()
                    this.#fn.animationReset()
                    this.#fn.animationRun()
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
                    const slide = Array.from(this.querySelectorAll('[ref-slider]'))
                    for (let i = 1; i < slide.length; i++) slide[i].remove()
                    this.appendChild(slide[0].cloneNode(true))
                },

                elementGet: () =>
                {
                    const node = this.#state.node

                    node.slide = this.querySelectorAll('[ref-slider]')
                },

                observerSet: () =>
                {
                    const anim = this.#state.anim

                    fn.observeIntersect(
                        this,
                        () => this.#fn.animationResume(),
                        () => this.#fn.animationPause(),
                        anim.obsv.intersect,
                        0
                    )
                },

                animationSet: () =>
                {
                    const anim = this.#state.anim
                    const node = this.#state.node

                    const { direction = 'left', ...userOpts } = fn.getAttr(this, 'anim-opt', 'json') || {}
                    const width = node.slide[0].getBoundingClientRect().width

                    anim.frX = direction === 'left' ? 0 : -width
                    anim.toX = direction === 'left' ? -width : 0
                    anim.opt = { duration: 10, ease: 'none', repeat: -1, ...userOpts }
                },

                animationRun: () =>
                {
                    const anim = this.#state.anim
                    const node = this.#state.node

                    anim.tween = gsap.fromTo(node.slide, { x: anim.frX }, { x: anim.toX, ...anim.opt })
                    anim.tween.progress(anim.prog || 0)
                    anim.prog = 0
                },

                animationReset: () =>
                {
                    const anim = this.#state.anim

                    if (anim.tween) {
                        anim.prog = anim.tween.progress()
                        anim.tween.progress(0).kill()
                        anim.tween = null
                    }
                },

                animationPause: () =>
                {
                    const anim = this.#state.anim

                    anim.tween.pause()
                },

                animationResume: () =>
                {
                    const anim = this.#state.anim

                    anim.tween.resume()
                },

                memoryClear: () =>
                {
                    const anim = this.#state.anim
                    const node = this.#state.node

                    anim.tween?.progress(0).kill()
                    anim.obsv.intersect.forEach((cleanup) => cleanup())

                    anim.opt = {}
                    anim.frX = 0
                    anim.toX = 0
                    anim.tween = null
                    anim.prog = 0
                    anim.obsv.intersect = []
                    node.slide = null
                },
            }
        }

        return { Marquee_01, Slider_01, Modal_01 }
    })()

    rf.lib.load(['gsap']).then(() =>
    {
        //customElements.define('redflow-icon-01', rf.component.Icon_01)
        customElements.define('redflow-marquee-01', rf.component.Marquee_01)
        customElements.define('redflow-modal-01', rf.component.Modal_01)
        customElements.define('redflow-slider-01', rf.component.Slider_01)
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
