import Excel from 'exceljs'

// const oldVitesseList = new Map()
// oldVitesseList.set('3G', {min: 2.25, max: 12})
// oldVitesseList.set('4G', {min: 2.75, max: 12.5})
// oldVitesseList.set('5G', {min: 3.15, max: 13})
// oldVitesseList.set('6G', {min: 3.15, max: 13})
// oldVitesseList.set('F',  {min: 2.22, max: 11})

const newVitesseList = new Map()
newVitesseList.set('F', { min: 2.25, max: 12.00 })
newVitesseList.set('3G', { min: 2.75, max: 12.50 })
newVitesseList.set('4G', { min: 3.25, max: 13.00 })
newVitesseList.set('5G', { min: 3.75, max: 13.50 })
newVitesseList.set('6G', { min: 3.75, max: 13.50 })

const Cellules = {
  vitesseMin: 'brut!$F$2',
  vitesseMax: 'brut!$F$3',
  pointsMin: 'brut!$G$2',
  pointsMax: 'brut!$G$3',
  distance: 'brut!$E$2'
}

function HMStoSecs (hms) {
  const arr = hms.split(':')
  return parseInt(arr[0], 10) * 3600 + parseInt(arr[1], 10) * 60 + parseInt(arr[2], 10)
}

async function createFile (filename, donnees, classe, type, long) {
  const vitesseList = newVitesseList
  const titre = filename
  classe = classe || filename.match(/^\d{1}/)[0]
  type = type || (filename.match(/f|g/) === null ? 'f'.toUpperCase() : filename.match(/f|g/)[0].toUpperCase())
  long = long || filename.match(/(\d+m)/)[0].substring(0, long.length - 1)
  long = parseInt(long)
  const vitesse = type === 'F' ? vitesseList.get('F') : vitesseList.get(classe + type)
  const wb = new Excel.Workbook()
  const ws = wb.addWorksheet('Résultat')
  ws.columns = [{
    key: 'id',
    width: 10
  },
  {
    key: 'note',
    width: 10,
    style: {
      numFmt: '0.00'
    }
  },
  {
    key: 'kh',
    width: 10,
    style: {
      numFmt: '0.00'
    }
  },
  {
    key: 'tour',
    width: 10
  },
  {
    key: 'total',
    width: 10,
    style: {
      numFmt: 'hh:mm:ss'
    }
  },
  {
    key: 'moyTour',
    width: 12,
    style: {
      numFmt: 'mm:ss'
    }
  }
  ]
  ws.mergeCells('A1:F1')
  ws.getCell('A1').value = titre
  ws.getCell('A1').font = {
    bold: true,
    underline: 'single'
  }
  ws.getCell('A1').alignment = {
    vertical: 'center',
    horizontal: 'center'
  }
  ws.getRow(2).values = ['Numero', 'Points', 'Km/h', 'Nb Tours', 'Total', 'Temps/Tours']
  const brut = wb.addWorksheet('brut')
  brut.columns = [{
    key: 'id',
    width: 10
  },
  {
    key: 'tour',
    width: 10
  },
  {
    key: 'temps',
    width: 10
  },
  {
    key: 'diff',
    width: 12
  }
  ]
  brut.getRow(1).values = ['Id', 'Tour', 'Temps', 'Différence', 'Distance', 'Vitesse', 'Points']
  brut.getRow(2).values = ['', '', '', '', long, vitesse.min, 0.5]
  brut.getRow(3).values = ['', '', '', '', '', vitesse.max, 20]
  const dataRaw = donnees.toString().split('\n')

  const data = []
  for (let i = 1; i < dataRaw.length - 1; i++) {
    const arr = dataRaw[i].split(';')
    const time = String(arr[1]).substring(0, 8)
    const id = parseInt(arr[0], 10)
    const info = {
      id,
      time: HMStoSecs(time)
    }
    data.push(info)
  }
  data.sort((a, b) => a.id - b.id)
  const last = data[data.length - 1].id
  const tri = new Map()
  data.forEach(row => {
    if (tri.has(row.id)) {
      const old = tri.get(row.id)
      old.tours.push(row)
      if (row.time > old.last.time) old.last = row
      tri.set(row.id, old)
    } else {
      const info = {
        id: row.id,
        tours: [row],
        last: row
      }
      tri.set(row.id, info)
    }
  })
  const resultat = new Map()
  for (let i = 1; i <= last; i++) {
    if (tri.has(i)) {
      const v = tri.get(i)
      const nbTour = v.tours.length
      const secTot = v.last.time
      ws.addRow()
      const lastRowInfo = ws.rowCount
      const formula = `((C${lastRowInfo}-${Cellules.vitesseMin})*(${Cellules.pointsMax}-${Cellules.pointsMin})/(${Cellules.vitesseMax}-${Cellules.vitesseMin})+${Cellules.pointsMin})`
      const info = {
        id: { formula: v.id },
        note: { formula: formula, result: undefined },
        kh: { formula: Cellules.distance + '*D' + lastRowInfo + '/(E' + lastRowInfo + '*86400)*3.6' },
        tour: nbTour,
        total: { formula: secTot + '/86400' },
        moyTour: { formula: `E${lastRowInfo}/D${lastRowInfo}`, result: undefined }
      }
      resultat.set(v.id, info)
      ws.getRow(lastRowInfo).values = info
      brut.addRow()
      const lastRow = brut.rowCount
      brut.mergeCells(lastRow, 1, lastRow, 3)
      brut.getCell(lastRow, 1).value = 'Eleve: ' + v.id
      const triEle = v.tours.sort((a, b) => a.time - b.time)
      triEle.forEach((row, i) => {
        const date = new Date(null)
        date.setSeconds(row.time)
        brut.addRow({
          tour: i + 1,
          temps: date.toISOString().substr(14, 5),
          diff: i > 0 ? getDiff(row.time, triEle[i - 1].time) : ''
        })
      })
    } else {
      ws.addRow({ id: i, note: 'ABSENT', kh: 'ABSENT', tour: 'ABSENT', total: 'ABSENT', moyTour: 'ABSENT' })
    }
  }
  return wb.xlsx.writeBuffer()
}

function getDiff (cur, prev) {
  const date = new Date(null)
  const diff = cur - prev
  date.setSeconds(diff)
  return date.toISOString().substr(14, 5)
}

export default createFile
