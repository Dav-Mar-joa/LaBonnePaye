window.onload = function() {

const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    // Préremplir le champ de type 'date' avec la date actuelle
document.getElementById('date').value = today;

    var payementDu = [0, 0];

    // Récupérer les données depuis le serveur
    fetch('/total')
        .then(response => response.json())
        .then(data => {
            // Réinitialiser les montants avant de mettre à jour
            let totalLola = 0;
            let totalDavid = 0;

            // Parcourir les données récupérées
            data.forEach(item => {
                if (item._id === "Lola") {
                    totalLola = item.totalSomme;
                }
                if (item._id === "David") {
                    totalDavid = item.totalSomme;
                }
            });

            // Mettre à jour payementDu
            payementDu[0] = totalLola;
            payementDu[1] = totalDavid;

            // Log des résultats pour débogage
            console.log("Lola: ", payementDu[0], "David: ", payementDu[1]);

            // Mettre à jour l'affichage
            if (payementDu[0] > payementDu[1]) {
                var doitPayer = payementDu[0] - payementDu[1];
                document.getElementById('david').style.display = "block";
                document.getElementById('david').innerText = `David doit : ${doitPayer} €`;
                document.getElementById('lola').innerText = `Lola est zen !!`;
            } else if (payementDu[0] < payementDu[1]) {
                var doitPayer = payementDu[1] - payementDu[0];
                document.getElementById('david').style.display = "block";
                document.getElementById('lola').innerText = `Lola doit : ${doitPayer} €`;
                document.getElementById('david').innerText = `David est zen !!`;
            } else if (payementDu[0] === payementDu[1]) {
                document.getElementById('lola').innerText = `On est pas mal !!!`;
                document.getElementById('david').style.display = "none";
            }
        })
        .catch(error => console.error('Erreur:', error));

        fetch('/historique/david')
        .then(response => response.json())
        .then(data => {
            const historiqueContainer = document.getElementById('historique-lola');
            historiqueContainer.innerHTML = ''; // Effacer le contenu existant

            if (data.length === 0) {
                historiqueContainer.innerHTML = '';
            } else {
                data.forEach(entry => {
                    const entryElement = document.createElement('div');
                    entryElement.classList.add('historique-entry');
                    entryElement.innerHTML = `
                        <p>-------</p>
                        <p>${new Date(entry.date).toLocaleDateString()}</p>
                        <p> ${entry.description}</p>
                        <p>${entry.somme} €</p>
                    `;
                    historiqueContainer.appendChild(entryElement);
                });
            }
        })
        .catch(error => console.error('Erreur:', error)); 

        fetch('/historique/lola')
        .then(response => response.json())
        .then(data => {
            const historiqueContainer = document.getElementById('historique-david');
            historiqueContainer.innerHTML = ''; // Effacer le contenu existant

            if (data.length === 0) {
                historiqueContainer.innerHTML = '';
            } else {
                data.forEach(entry => {
                    const entryElement = document.createElement('div');
                    entryElement.classList.add('historique-entry');
                    entryElement.innerHTML = `
                        <p>-------</p>
                        <p>${new Date(entry.date).toLocaleDateString()}</p>
                        <p> ${entry.description}</p>
                        <p>${entry.somme} €</p>
                    `;
                    historiqueContainer.appendChild(entryElement);
                });
            }
        })
        .catch(error => console.error('Erreur:', error));  
        
        document.getElementById("toggle-historique").onclick = function() {
            const historiqueDiv = document.getElementById("container-historique");
            if (historiqueDiv.style.display === "none" || historiqueDiv.style.display === "") {
                historiqueDiv.style.display = "block"; // Afficher
                this.style.backgroundColor = "#00ffcc";
                this.style.color = "black";
            } else {
                historiqueDiv.style.display = "none"; // Cacher
                this.style.backgroundColor = "white";
                this.style.color = "black";
            }
        };
};
