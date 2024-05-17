export class customBarGraph extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ["timeSpent", "averageTimeSpent"];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[attribute] = Number(newValue);
            this.updateBarGraph();
        }
    }

    connectedCallback() {
        this.timeSpent = Number(this.getAttribute('timeSpent')) || 0;
        this.averageTimeSpent = Number(this.getAttribute('averageTimeSpent')) || 0;

        this.shadowRoot.innerHTML = /*html*/`
        <style>
            .bargraph {
                width: 400px;
                height: 200px;
                background: #efefef;
                border: 1px solid #ccc;
                display: flex;
                justify-content: center;
                align-items: left;
                border-radius: 10px;
                flex-direction: column;
                margin: 10px;
                padding: 10px;  
            }

            .timeSpent {
                width: 0px;
                height: 30px;
                background: #006791;
                display: flex;
                justify-content: center;
                align-items: center;
                color: blue;
                font-size: 1.5em;
                margin-bottom: 10px;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
            .timeSpentText {
                margin-bottom: 10px;
            }

            .averageTimeSpent {
                width: 0px;
                height: 30px;
                background: #05BFAD;
                display: flex;
                justify-content: center;
                align-items: center;
                color: darkblue;
                font-size: 1.5em;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
            .averageTimeSpentText {
                margin-bottom: 10px;
            }

            .user-icon {
                width: 50px;
                height: 50px;
                margin-bottom: 10px;
            }

            .average-users-icon {
                width: 50px;
                height: 50px;
                margin-bottom: 10px;
            }
        </style>
        <div class="bargraph">
            <img class="user-icon" src="/webComponentsTuriscool/customBarGraph/assets/user-svgrepo-com.svg" alt="user icon">
            <div class="timeSpent"></div>
            <img class="average-users-icon" src="/webComponentsTuriscool/customBarGraph/assets/users-group-svgrepo-com.svg" alt="users group icon">
            <div class="averageTimeSpent"></div>
        </div>
        `;
        this.updateBarGraph();
    }

    updateBarGraph() {
        const timeSpent = this.timeSpent;
        const averageTimeSpent = this.averageTimeSpent;
        const timeSpentElement = this.shadowRoot.querySelector('.timeSpent');
        const averageTimeSpentElement = this.shadowRoot.querySelector('.averageTimeSpent');

        timeSpentElement.style.width = `${timeSpent}px`;
        averageTimeSpentElement.style.width = `${averageTimeSpent}px`;
    }
}

window.customElements.define('custom-bar-graph', customBarGraph);
