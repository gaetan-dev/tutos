# Javascript
---
## Hoisting
En JavaScript, functions et variables sont hissée ("hoisted" est traduit en français par "hissage").

Le hissage est un comportement du Javascript qui déplace une déclaration au début du scope dans lequel il est déclaré (scope courant de la fonction ou dans le global scope).

Cela signifie qu'il est possible d'utiliser une fonction ou une variable avant qu'elle soit déclarée, ou avec d'autres mots : Une fonction ou variable peut-être déclarée après son utilisation.

```javascript
console.log(a) // ReferenceError: a is not defined
```

```javascript
console.log(a) // undefined
const a = 3
/* === */
let a
console.log(a) // undefined
a = 3
```

## L'objet Window
### Intéraction avec l'utilisateur
1. Alert

  ```javascript
  window.alert("hello world")
  ```
  
2. Prompt (alert avec un champs de réponse)

  ```javascript
  const response = window.prompt("What's your name?")
  console.log(response) // Gaetan
  ```
  
3. Confirm (alert avec un bouton "ok" et un bouton "annulé")

  ```javascript
  const response = window.confirm("Submit?")
  console.log(response) // true/false
  ```
  
### Timer
1. Timeout - exécute la fonction une seule fois après x millisecondes

  ```javascript
  window.setTimeout(function () {}, 1000)
  const id = window.setTimeout(function () {}, 1000) // stocke l'ID du timeout
  window.clearTimeout(id) // stop
  ```
  
2. Interval - exécute la fonction passée en paramètre toutes les x millisecondes (non bloquant)

  ```javascript
  window.setInterval(function () {}, 1000) // infini
  const id = window.setInterval(function () {}, 1000) // stocke l'ID de l'intervalle
  window.clearInterval(id) // stop
  ```

## DOM
### document
1. Sélection d'un élément

  * Récupérer un élément par id (old)
  ```javascript
  document.getElementById('id') // {}
  ```
  * Récupérer tous les éléments d'une classe (old)
  ```javascript
  document.getElementsByClassName('class') // [{}, ...]
  ```
  * Récupérer tous les éléments d'un tag (old)
  ```javascript
  document.getElementsByTagName('tag') // [{}, ...]
  ```
  * Récupérer un élément (le premier) (new)
  ```javascript
  document.querySelector('.class') // {}
  document.querySelector('#demo p') // {}
  document.querySelector('li:nth-child(3)') // {} le troisième élément de la liste
  ```
  * Récupérer tous les éléments (new)
  ```javascript
  document.querySelectorAll('p') // [{}, ...]
  document.querySelectorAll('.class') // [{}, ...]
  ```

2. Parcours du DOM

  * Parcourir le parent d'un élément
  ```javascript
  document.querySelector('li:nth-child(3)').parentNode
  document.querySelector('li:nth-child(3)').parentElement
  ```
  * Parcourir tous les noeuds d'un élément
  ```javascript
  document.querySelector('ul').childNodes // [] tous les noeuds (même les noeuds textes)
  document.querySelector('ul').childCount // int
  document.querySelector('ul').firstChild // {}
  ```
  * Parcourir les noeuds éléments d'un élément
  ```javascript
  document.querySelector('ul').children // [] seulement les noeuds qui sont des éléments
  document.querySelector('ul').childElementCount // int
  document.querySelector('ul').firstElementChild // {}
  ```
  * Parcourir l'élément précédent (même noeud)
  ```javascript
  document.querySelector('li:nth-child(3)').previousSibling
  document.querySelector('li:nth-child(3)').previousElementSibling
  ```
  * Parcourir l'élément suivant (même noeud)
  ```javascript
  document.querySelector('li:nth-child(3)').nextSibling
  document.querySelector('li:nth-child(3)').nextElementSibling
  ```
  * Parcourir tous les éléments du même noeud
  ```javascript
  document.querySelector('li:nth-child(3)').parentElement.children
  ```

3. Intéraction avec un élément

  * Modifier la classe d'un élément
  ```javascript
  document.querySelector('.paragraph').className // string
  document.querySelector('.paragraph').classList // array
  document.querySelector('.paragraph').className = "paragraph blue" // old
  document.querySelector('.paragraph').classList.remove('blue')     // new
  document.querySelector('.paragraph').classList.add('red')         // new
  document.querySelector('.paragraph').classList.toggle('red') // ajoute/enlève
  document.querySelector('.paragraph').classList.contains('red')  // bool
  ```
  * Modifier le css d'un élément
  ```javascript
  document.querySelector('.paragraph').style // {}
  document.querySelector('.paragraph').style.fontSize = "20px"
  ```
  * Modifier le contenu html d'un élément
  ```javascript
  document.querySelector('.paragraph').innerHTML // string
  document.querySelector('.paragraph').innerHTML = "<strong>hello world</strong>"
  ```
  * Modifier le contenu texte d'un élément
  ```javascript
  const demo = document.querySelector('#demo')
  if (demo.textContent) {
    demo.textContent = "Hello"
  } else {
    demo.innerText = "Hello"
  }
  ```
  * Créer un élément
  ```javascript
  var li = document.createElement('li')
  ```
  * Copier un élément
  ```javascript
  var copy1 = document.querySelector('li').cloneNode() // sans les enfants
  var copy2 = document.querySelector('li').cloneNode(true) // avec les enfants
  ```
  * Ajouter/Déplacer un élément
  ```javascript
  document.body.appendChild(document.createElement('li')) // ajoute
  document.body.appendChild(document.querySelector('li:nth-child(3)'))  // déplace
  ```
  * Remplacer un élément
  ```javascript
  document.body.replaceChild(newE, oldE)
  ```

## Evènements
### Event Listener [MDN](https://developer.mozilla.org/en-US/docs/Web/Events)
Dans le cas d'un listener "this" aura la valeur de l'élément sur lequel a été greffé l'élément.

1. Click

  ```javascript
  var p = document.querySelector('p')
  p.addEventListener('click', function () {})
  /* Remove */
  const onClick = function () {}
  p.addEventListener('click', onClick)
  p.removeEventListener('click', OnClick)
  ```
  
2. Mouseover

  ```javascript
  p.addEventListener('mouseover', function () {})
  /*   Remove   */
  /* Idem Click */
  ```
  
3. Mouseout

  ```javascript
  p.addEventListener('mouseout', function () {})
  /*   Remove   */
  /* Idem Click */
  ```
  
4. Change (appelle l'évènement une fois le champs quitté)

  ```javascript
  p.addEventListener('change', function () {})
  /*   Remove   */
  /* Idem Click */
  ```
  
4. Submit (soumettre un formulaire)

  ```javascript
  documet.querySelector('#form').addEventListener('submit', function () {})
  /*   Remove   */
  /* Idem Click */
  ```

### Intéraction avec un évènement
1. Cible de l'évènement dans l'arbre du DOM

  ```javascript
  p.addEventListener('click', function (e) {
    const target = e.target || e.srcElement // srcElement => IE
  })  // cible l'élément le plus loin dans l'arbre du DOM attaché à l'évènement
  p.addEventListener('click', function (e) {
    const target = e.currentTarget // non supporté par IE
  })  // cible le premièr élément l'arbre du DOM attaché à l'évènement
  ```
  
2. Arrêter la propagation de l'évènement dans l'arbre du DOM

  ```javascript
  p.addEventListener('click', function (e) {
    if (e.stopPropagation)
      e.stopPropagation()
  })
  ```
  
3. Annuler l'action de l'évènement

  ```javascript
  p.addEventListener('click', function (e) {
    if (e.preventDefault)
      e.preventDefault()
  }) // annule l'évènement s'il est annulable, sans stopper sa propagation
  ```

## Prototype
### Première approche
1. Getter

  ```javascript
  obj.__proto__ // not official
  Object.getPrototypeOf(obj) // official
  ```
  
2. Setter

  ```javascript
  var proto = {
    func1: function () {},
    func2: function () {}
  }
  obj.__proto__ = proto // not official
  obj = Object.create(proto) // official
  ```

### Constucteur (anté ES2015)
```javascript
var Obj = function (var1, var2) {
  this.var1 = var1
  this.var2 = var2
}
Obj.prototype.func1 = function () {}

var obj = new Obj(var1, var2)
obj.prototype == obj.__proto__ // true

obj.prototype.funct2 = function () {} // override le proto
Obj.prototype.funct2() // undefined
```

## AJAX
1. Initialisation

  ```javascript
  var xhr = new XMLHttpRequest()
  
  /* Pour les anciens navigateurs IE */
  
  var getHttpRequest = function () {
    var xhr = false;
  
    if (window.XMLHttpRequest) { // Mozilla, Safari,...
        xhr = new XMLHttpRequest();
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/xml');
        }
    }
    else if (window.ActiveXObject) { // IE
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
        }
    }
  
    if (!xhr) {
        alert('Abandon :( Impossible de créer une instance XMLHTTP');
        return false;
    }
  
    return xhr;
  }
  
  var xhr = getHttpRequest()
  ```

2. Appel d'une page

  ```javascript
  xhr.open('GET', url, true) // Method, URL, async
  xhr.send()
  ```

3. Traitement du résultat (asynchrone)

  ```javascript
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        /* ... */
      }
    }
  }
  ```

### POST
```javascript
xhr.open('POST', url, true)
/* IE 8 - 9 */
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
xhr.send('country=France&city=Paris')
```
#### FormData
```javascript
/* Autres navigateurs */
var data = new FormData()
data.append('country', 'France')
data.append('city', 'Paris')
xhr.send(data)
```

### JSON (http://jsonplaceholder.typicode.com)
1. Parsing
```javascript
var result = JSON.parse(xhr.responseText);
```

### Exemple
#### Formulaire
```javascript
var form = document.querySelector('#form')
form.addEventListener('submit', function (e) {
  e.preventDefault()
  var xhr = getHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.onreadystatechange === 4) {
      if (xhr.status === 200) {
        /* ... */
      }
    }
  }
})
var data = new FormData(form) // accepte le html (ne pas oublié de mettre un name au champs)
xhr.send(data)
```
