export class customCake extends HTMLElement {
    constructor() {
        super();
        // Inicializamos 'completed' correctamente.
        this.completed = 45;
        this.attachShadow({ mode: 'open' }); // Usamos Shadow DOM para encapsulamiento
    }

    static get observedAttributes() {
        return ["completed"];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (attribute) {
                case "completed":
                    this.completed = newValue;
                    this.updatePieChart(); // Actualiza el gráfico cuando cambia el valor.
                    break;
            }
        }
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = /*html*/`
        <style>
        .piechart {
            display:flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 200px; 
            height: 200px; 
            border-radius: 50%;
            background: conic-gradient(
                #006791 0deg, #05BFAD var(--deg, 0deg),  /* Rojo hasta el ángulo definido por 'completed' */
                #F3F8FF var(--deg, 0deg), lightgray 360deg  /* Gris para el resto del círculo */
            );
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
        }
    </style>
    <div class="piechart">
    <h3>Completado: ${this.completed}%</h3>
    </div>
        `;
        this.updatePieChart(); // Inicializa la visualización correcta del gráfico.
    }

    updatePieChart() {
        const degrees = (this.completed / 100) * 360;
        const pieChart = this.shadowRoot.querySelector('.piechart');
        if (pieChart) {
            pieChart.style.setProperty('--deg', `${degrees}deg`); // Actualiza la variable CSS.
        }
    }
}

window.customElements.define('custom-cake', customCake);
