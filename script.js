
class TransformProperties {
    constructor(E11, E22, G12, niu12) {
        this.E11 = E11;
        this.E22 = E22;
        this.G12 = G12;
        this.niu12 = niu12;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    getExx(thetaRad) {
        return 1 / (
            (Math.pow(Math.cos(thetaRad), 4) / this.E11) +
            (Math.pow(Math.sin(thetaRad), 4) / this.E22) +
            (0.25 * (1 / this.G12 - (2 * this.niu12) / this.E11)) * Math.pow(Math.sin(2 * thetaRad), 2)
        );
    }

    getEyy(thetaRad) {
        return 1 / (
            (Math.pow(Math.sin(thetaRad), 4) / this.E11) +
            (Math.pow(Math.cos(thetaRad), 4) / this.E22) +
            (0.25 * (1 / this.G12 - (2 * this.niu12) / this.E11)) * Math.pow(Math.sin(2 * thetaRad), 2)
        );
    }

    getGxy(thetaRad) {
        return 1 / (
            (1 / this.E11) + (2 * this.niu12 / this.E11) + (1 / this.E22) -
            (((1 / this.E11) + (2 * this.niu12 / this.E11) + (1 / this.E22) - (1 / this.G12)) * Math.pow(Math.cos(2 * thetaRad), 2))
        );
    }

    generateTable(thetaList) {
        let data = thetaList.map(theta => {
            let thetaRad = this.toRadians(theta);
            return {
                Theta: theta,
                Exx: this.getExx(thetaRad).toFixed(2),
                Eyy: this.getEyy(thetaRad).toFixed(2),
                Gxy: this.getGxy(thetaRad).toFixed(2)
            };
        });

        this.displayTable(data);
    }

    displayTable(data) {
        let tableHTML = `<table><tr><th>Theta (°)</th><th>Exx (MPa)</th><th>Eyy (MPa)</th><th>Gxy (MPa)</th></tr>`;
        data.forEach(row => {
            tableHTML += `<tr><td>${row.Theta}</td><td>${row.Exx}</td><td>${row.Eyy}</td><td>${row.Gxy}</td></tr>`;
        });
        tableHTML += `</table>`;
        document.getElementById("resultContainer").innerHTML = tableHTML;
    }
}

document.getElementById("inputForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const E11 = parseFloat(document.getElementById("E11").value);
    const E22 = parseFloat(document.getElementById("E22").value);
    const G12 = parseFloat(document.getElementById("G12").value);
    const niu12 = parseFloat(document.getElementById("niu12").value);
    const thetaList = document.getElementById("theta").value.split(",").map(Number);

    if (isNaN(E11) || isNaN(E22) || isNaN(G12) || isNaN(niu12) || thetaList.some(isNaN)) {
        alert("Please enter valid numbers!");
        return;
    }

    const material = new TransformProperties(E11, E22, G12, niu12);
    material.generateTable(thetaList);
});
