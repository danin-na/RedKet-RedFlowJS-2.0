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

            observeResize (element, callback, delay = 400, cache)
            {
                const debouncedCallback = debounce(callback, delay)
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
                    this.#state.node.slide = this.querySelectorAll('[ref-slider]')
                },

                observerSet: () =>
                {
                    fn.observeIntersect(
                        this,
                        () => this.#fn.animationResume(),
                        () => this.#fn.animationPause(),
                        this.#state.anim.obsv.intersect,
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
