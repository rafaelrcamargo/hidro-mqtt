//Status Nivel

let statusNivel = () => {
    let nivLabel = document.querySelector("p.pNivel");
    if (actNivMsg == 1) {
        nivLabel.innerHTML = "Cuidado! Nivel de água baixo";
        nivLabel.style.color = "#F25D50";
    } else {
        nivLabel.innerHTML = "Tudo certo! Nivel de água normal";
        nivLabel.style.color = "#268C79";
    }
};

//Status Bomba

let statusBomba = () => {
    let nivBomba = document.querySelector("p.pBomba");
    if (actBombMsg == 1) {
        nivBomba.innerHTML = "Bomba Ligada";
        nivBomba.style.color = "#268C79";
    } else {
        nivBomba.innerHTML = "Bomba Desligada";
        nivBomba.style.color = "#F25D50";
    }
};
