// -- ✅ Trigger 01 -- ✨ Version 2.0

class Trigger_01 extends HTMLElement
{
    //--------------------------------------------
    // --------------------------- Component State

    #st = {
        trigger: { event: null }, // rf-data
        target: { sync: null, api: null, }, // rf-data
        node: { isConnected: null, },
        life: { events: null }
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
                // -- Hint :

                this.#st.trigger.event.forEach((event, i) =>
                {
                    const targetElement = document.querySelector(`[sync-id="${this.#st.target.sync[i]}"]`)
                    const targetApi = () => targetElement?.api(this.#st.target.api[i])

                    this.addEventListener(event, targetApi)
                    this.#st.life.eventCache.push({ event, targetApi })
                })
            },

        },


        clearLeak: () =>
        {
            this.#st.life.eventCache.forEach(({ trigger, fire }) => this.removeEventListener(trigger, fire))

            this.#st.trigger.event = []
            this.#rf.target.sync = []
            this.#rf.target.api = []
        }

    }

    //--------------------------------------------
    // -------------------------------- Public API

    // -- Empty

}