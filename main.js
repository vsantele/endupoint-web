import './index.css'
import createFile from './createFile'
import { toast } from 'tailwind-toast'
import { registerSW } from 'virtual:pwa-register'

let csv, loadFiles, dlBtn, classe, sexe, distance, nom

window.onload = function () {
  csv = document.getElementById('csv')
  loadFiles = document.getElementById('loadFile')
  dlBtn = document.getElementById('dlBtn')
  classe = document.getElementById('classe')
  sexe = document.getElementById('sexe')
  distance = document.getElementById('distance')
  nom = document.getElementById('name')

  csv.onchange = handleFiles
  loadFiles.onclick = () => {
    csv.click()
  }
  dlBtn.onclick = process

  registerSW({
    onOfflineReady () {
      toast().success('Page disponible hors connexion', 'Vous pouvez revenir ici sans connexion internet').as('pill').from('bottom', 'center').show()
    }
  })
}

function saveFile (name, file) {
  download(file, name)
  classe.value = ''
  sexe.value = ''
  distance.value = ''
  nom.value = ''
  csv.value = ''
  dlBtn.disabled = true
}

function download (file, name) {
  const blob = new window.Blob([file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const element = document.createElement('a')
  const url = URL.createObjectURL(blob)
  element.setAttribute('href', url)
  element.setAttribute('download', name)
  element.style.visibility = 'hidden'
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

async function process (e) {
  e.preventDefault()
  try {
    const cla = classe.value
    const type = sexe.value.slice(0, 1).toUpperCase()
    const long = distance.value
    const name = (nom.value ?? 'fichier') + '.xlsx'
    if (isNaN(parseInt(long))) {
      toast().warning('Erreur:', "La distance n'est pas un nombre valide").show()
    }
    if (cla && type && long) {
      const file = csv.files[0]
      const reader = new window.FileReader()
      reader.onload = async () => {
        const data = reader.result
        const result = await createFile(name, data, cla, type, long)
        saveFile(name, result)
      }
      reader.readAsText(file)
    } else {
      toast().danger('Erreur', "Manque d'informations (classe, sexe, distance)").show()
    }
  } catch (e) {
    console.error('read text')
    console.error(e)
    toast().danger('Erreur:', "besoin d'un fichier .csv").show()
  }
}

const handleFiles = async () => {
  const files = csv.files
  if (files && files.length > 0) {
    const file = files[0]
    const name = file.name
    const cla = name.match(/^\d{1}/) === null ? '' : name.match(/^\d{1}/)[0]
    const type = name.match(/f|g/) === null ? '' : name.match(/f|g/)[0].toUpperCase()
    const long = name.match(/(\d+m)/) === null ? '' : name.match(/(\d+m)/)[0].substring(0, name.match(/(\d+m)/)[0].length - 1)
    classe.value = cla
    sexe.value = type
    distance.value = long
    nom.value = name.slice(0, name.length - 4)
    dlBtn.disabled = false
  }
}
