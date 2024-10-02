window.onload = function() {

var payementDu=[0,0]
fetch('/total')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        // Mise à jour de l'affichage pour chaque nom
        if (item._id === "Lola") {
            payementDu[0]=item.totalSomme
            console.log(item.totalSomme)
        }
        if (item._id === "David") {
            payementDu[1]=item.totalSomme
            console.log(item.totalSomme)
        }
        if(payementDu[0] > payementDu[1]) {
            var doitPayer = payementDu[0] - payementDu[1];
            document.getElementById('david').innerText = `David doit : ${doitPayer} €`;
            document.getElementById('lola').innerText = `Lola est zen !! `;
        } else if(payementDu[0] < payementDu[1]) {
            var doitPayer = payementDu[1] - payementDu[0];
            document.getElementById('lola').innerText = `Lola doit : ${doitPayer} €`;
            document.getElementById('david').innerText = `David est zen !!`;
        } else if(payementDu[0] === payementDu[1]) { 
            // document.getElementById('david').innerText = ` `;
            document.getElementById('lola').innerText = `On est pas mal !!! `;
        }
      });
    })
    .catch(error => console.error('Erreur:', error));

    

}