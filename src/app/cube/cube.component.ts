import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit {
  // La vitesse horizontale du cube
  velocity = 0;
  // L'accélération horizontale du cube
  acceleration = 0;
  // La position horizontale du cube
  position = 0;

  // La position verticale du cube
  verticalPosition = window.innerHeight - 500;
  // La vitesse verticale du cube
  verticalVelocity = 0;
  // L'accélération verticale du cube
  verticalAcceleration = 0;
  // La gravité
  gravity = -0.3;
  // Le sol
  ground = window.innerHeight - 500;

  // La position du rectangle rouge
  redRectanglePosition = 200;

  // Fonction pour détecter quand une touche est enfoncée
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Si la flèche gauche est enfoncée, déplacer le cube vers la gauche
    if (event.key === 'ArrowLeft') {
      this.acceleration = -0.3;
    }
    // Si la flèche droite est enfoncée, déplacer le cube vers la droite
    else if (event.key === 'ArrowRight') {
      this.acceleration = 0.3;
    }
    // Si la touche espace est enfoncée et que le cube est sur le sol, faire sauter le cube
    else if (event.key === 'ArrowUp' && this.verticalPosition === this.ground) {
      this.verticalAcceleration = 15;
    }
    // Si l'utilisateur presse la flèche directionnelle "haut" et que le cube est devant le rectangle rouge, affichez une alerte
    if (event.key === 'ArrowUp' && this.isCubeInFrontOfRedRectangle()) {
      alert("Le cube noir est devant le rectangle rouge !");
    }
  }

  // Fonction pour détecter quand une touche est relâchée
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // Si les flèches gauche ou droite sont relâchées, arrêter le mouvement horizontal du cube
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      this.acceleration = 0;
    }

    // Si la touche espace est relâchée, réinitialiser l'accélération verticale
    if (event.key === 'ArrowUp') {
      this.verticalAcceleration = 0;
    }
  }

  ngOnInit() {
    // La vitesse maximale du cube
    const maxSpeed = 5;

    // Mettre à jour la position du cube toutes les 10 millisecondes
    setInterval(() => {
      // Si l'accélération horizontale est nulle et que la vitesse horizontale n'est pas nulle, définir une valeur négative pour l'accélération horizontale pour que la vitesse diminue jusqu'à être nulle
      if (this.acceleration === 0 && this.velocity !== 0) {
        this.acceleration = -Math.sign(this.velocity) * 0.25;
      }

      // Seuil de vitesse pour arrêter complètement le cube
      if (Math.abs(this.velocity) == 0 && Math.abs(this.acceleration) <= 0.25) {
        this.velocity = 0;
        this.acceleration = 0;
      }
      // Mettre à jour la vitesse horizontale en utilisant la formule de la vitesse : v = v0 + at
      this.velocity += this.acceleration;

      // Si la vitesse horizontale dépasse la vitesse maximale définie, la définir sur la vitesse maximale
      if (this.velocity > maxSpeed) {
        this.velocity = maxSpeed;
      } else if (this.velocity < -maxSpeed) {
        this.velocity = -maxSpeed;
      }

      // Mettre à jour la position horizontale en utilisant la formule de la position : x = x0 + vt
      this.position += this.velocity;

      // Si la vitesse horizontale est proche de zéro, la définir sur zéro
      if (this.velocity < 0.20 && this.velocity > -0.20) {
        this.velocity = 0;
      }

      // Définir des limites pour la position horizontale du cube pour empêcher le cube de sortir de la zone d'affichage
      if (this.position < 0) {
        this.position = 0;
        this.velocity = 0;
      } else if (this.position > window.innerWidth - 50) {
        this.position = window.innerWidth - 50;
        this.velocity = 0;
      }

      // Mettre à jour la vitesse verticale en utilisant la formule de la vitesse : v = v0 + at
      this.verticalVelocity += this.verticalAcceleration + this.gravity;

      // Mettre à jour la position verticale en utilisant la formule de la position : y = y0 + vt
      this.verticalPosition += this.verticalVelocity;

      // Si le cube touche le sol, réinitialiser la vitesse verticale et la position verticale
      if (this.verticalPosition < this.ground) {
        this.verticalPosition = this.ground;
        this.verticalVelocity = 0;
      } else {
        // Si le cube est en l'air, appliquer la gravité
        this.verticalAcceleration = this.gravity;
      }
    }, 10);
  }

  isCubeInFrontOfRedRectangle() {
    // Largeur du cube noir
    const cubeWidth = 50;
    // Largeur du rectangle rouge
    const redRectangleWidth = 50;
    // Longueur du rectangle rouge
    const redRectangleHeight = 100;

    // Vérifiez si la position du cube noir plus sa largeur (c'est-à-dire le bord droit du cube) est supérieure à la position du rectangle rouge (c'est-à-dire le bord gauche du rectangle)
    // ET vérifiez si la position du cube noir (c'est-à-dire le bord gauche du cube) est inférieure à la position du rectangle rouge plus sa largeur (c'est-à-dire le bord droit du rectangle)
    // Si les deux conditions sont remplies, cela signifie que le cube noir et le rectangle rouge se chevauchent horizontalement, donc le cube est "devant" le rectangle rouge
    return (
      this.position + cubeWidth > this.redRectanglePosition &&
      this.position < this.redRectanglePosition + redRectangleWidth &&
      this.verticalPosition < this.ground + redRectangleHeight
    );
  }
}
