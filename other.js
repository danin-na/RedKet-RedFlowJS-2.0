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