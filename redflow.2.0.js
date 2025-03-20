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
        "use strict"

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
                    rf.log.success(url, "Loaded")
                    resolve()
                }
                script.onerror = () =>
                {
                    rf.log.error(url, "Failed to load")
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
                if (lib.startsWith("http")) return loadScript(lib)
                rf.log.warn(lib, "Unknown library requested")
                return Promise.resolve()
            })
            return Promise.all(promises)
        }

        return { load }
    })()

    // ------------------------------ RedFlow

    rf.log.credit()
    rf.log.success("Components Library", "is running")

    /* -------------------------------------------------------------------------- */
    /*                                  Libraries                                 */
    /* -------------------------------------------------------------------------- */

    class Marquee_01 extends HTMLElement
    {
        // Private fields
        #tween = null
        #tweenProg = null

        #slider = null
        #resizeHandler = null

        #dependencyLoaded = false
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
            if (!this.#componentLoaded) return console.log('2 - attributeChangedCallback Failed')

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

                this.#dependencyLoaded = true
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

    customElements.define("redflow-marquee-a", Marquee_01)
})()
