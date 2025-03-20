// REDFLOW 1.0

/* -------------------------------------------------------------------------- */
/* --------------------------------- RedFlow -------------------------------- */
/* -------------------------------------------------------------------------- */

const RedFlow = (() =>
{
    const rf = {}
    rf.log = {}
    rf.lib = {}
    rf.API = {}

    /* -------------------------------------------------------------------------- */
    /*                                   helpers                                  */
    /* -------------------------------------------------------------------------- */

    // ------------------------------- Log Helpers

    rf.log = (() =>
    {
        'use strict'

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

        let cacheCredit = false

        // ------------------------------- Internal API

        function credit ()
        {
            if (cacheCredit) return
            document.body.prepend(document.createComment(creditInfo.commentTop))
            document.body.appendChild(document.createComment(creditInfo.commentBottom))
            console.log(creditInfo.logMessage, ...creditInfo.logStyle)
            cacheCredit = true
        }

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

        return { credit, error, success, info, warn, debug }
    })()

    // ------------------------------- Lib Helpers

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

        // ------------------------------ Internal API

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

        return { load }
    })()

    /* -------------------------------------------------------------------------- */
    /*                                  Libraries                                 */
    /* -------------------------------------------------------------------------- */

    // ------------------------------- Components

    rf._comp = (() =>
    {
        class Marquee_01
        {
            #e = {}

            constructor(config = { tag: {}, opt: {} })
            {
                this.#e = {
                    tag: {
                        self: config.tag.self,
                        slider: config.tag.slider,
                    },
                    opt: {
                        ease: config.opt.ease || 'none',
                        duration: config.opt.duration || 30,
                        direction: config.opt.direction || 'left',
                    },
                    anim: {
                        tween: null,
                        prog: 0,
                        delay: 200,
                    },
                }
            }

            #render ()
            {

                if (this.#e.anim.tween) {
                    this.#e.anim.prog = this.#e.anim.tween.progress()
                    this.#e.anim.tween.progress(0).kill()
                }

                var items = this.#e.tag.self.querySelectorAll('[rf-component-self-selector]')
                var width = parseInt(getComputedStyle(items[0]).width, 10)
                var xFrom, xTo

                if (this.#e.opt.direction === 'left') {
                    xFrom = 0
                    xTo = -width
                } else {
                    xFrom = -width
                    xTo = 0
                }

                // Assign the gsap animation to animation
                this.#e.anim.tween = gsap.fromTo(
                    items,
                    { x: xFrom },
                    {
                        x: xTo,
                        duration: this.#e.opt.duration,
                        ease: this.#e.opt.ease,
                        repeat: -1,
                    }
                )

                this.#e.anim.tween.progress(this.#e.anim.prog)
            }

            Create ()
            {
                rf.lib.load(['gsap', 'jquery']).then(() =>
                {
                    this.#e.tag.slider.setAttribute('rf-component-self-selector', '')
                    this.#e.tag.self.append(this.#e.tag.slider.cloneNode(true))
                    this.#render()
                })
            }

            Reload ()
            {
                this.#render()
            }
        }

        return { Marquee_01 }
    })()

    // ------------------------------- workers

    rf._work = (() => { })()

    /* -------------------------------------------------------------------------- */
    /* ------------------------ Exposed RF API (Component) ---------------------- */
    /* -------------------------------------------------------------------------- */

    // ------------------------------ APIs

    rf.API.Component = (() =>
    {
        function Marquee_01 ({ id, opt })
        {
            const instances = []
            document.querySelectorAll(`[${id.self}]`).forEach((el) =>
            {
                instances.push(
                    new rf._comp.Marquee_01({
                        tag: {
                            self: el,
                            slider: el.querySelector(`[${id.slider}]`),
                        },
                        opt: {
                            ease: el.getAttribute(`${opt.ease}`),
                            duration: parseFloat(el.getAttribute(`${opt.duration}`)),
                            direction: el.getAttribute(`${opt.direction}`),
                        },
                    })
                )
            })
            return {
                create ()
                {
                    instances.forEach((i) => i.Create())
                },
                reload ()
                {
                    instances.forEach((i) => i.Reload())
                },
            }
        }

        return { Marquee_01 }
    })()

    // ------------------------------ RedFlow

    rf.log.credit()
    rf.log.success('Components Library', 'is running')

    // ------------------------------ External API

    return { Component: rf.API.Component }
})()

document.addEventListener('DOMContentLoaded', () =>
{
    const M1 = new RedFlow.Component.Marquee_01({
        id: {
            self: 'rf-component-e-id-self="marquee_01"',
            slider: 'rf-component-e-id-slider',
        },
        opt: {
            ease: 'rf-component-e-opt-ease',
            duration: 'rf-component-e-opt-duration',
            direction: 'rf-component-e-opt-direction',
        },
    })

    M1.create()

    window.addEventListener('resize', () =>
    {
        M1.reload()
    })
})
