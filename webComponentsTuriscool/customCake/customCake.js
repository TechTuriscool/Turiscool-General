export class customCake extends HTMLElement {
    constructor() {
        super();
        // Inicializamos 'completed' correctamente.
        this.totalUnits = 13;
        this.unitsCompleted = 10;
        this.completed = Math.trunc((this.unitsCompleted / this.totalUnits) * 100)
        this.attachShadow({ mode: 'open' }); // Usamos Shadow DOM para encapsulamiento
    }

    static get observedAttributes() {
        return ["completed, totalUnits, unitsCompleted"];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (attribute) {
                case "completed":
                    this.completed = newValue;
                    this.updatePieChart(); // Actualiza el gráfico cuando cambia el valor.
                    break;
                case "totalUnits":
                    this.totalUnits = newValue;
                    break;
                case "unitsCompleted":
                    this.unitsCompleted = newValue;
                    break;

            }
        }
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = /*html*/`
        <style>
.piechart-body {
    width: 400px;
    height: 400px;
    margin:10px;
    border-radius: 10px;
    background: #efefef;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    border: 1px solid #ccc;
}

        .piechart {
            display:flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 300px; 
            height: 300px; 
            border-radius: 50%;
            background: conic-gradient(
                #006791 0deg, #05BFAD var(--deg, 0deg),  /* Rojo hasta el ángulo definido por 'completed' */
                #F3F8FF var(--deg, 0deg), lightgray 360deg  /* Gris para el resto del círculo */
            );
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
        }

        h3 {
            width: 100%;
            margin: 10px;
            text-align: left;

        }
    </style>
    <div class = "piechart-body">
    <div class="piechart">
    </div>
    
    <h3>Completadas: ${this.unitsCompleted}</h3>
    <h3>Total de unidades: ${this.totalUnits}</h3>
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
