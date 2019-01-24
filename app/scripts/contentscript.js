// https://crx.dam.io/ext/gphjopenfpnlnffmhhhhdiecgdcopmhk.html
// add extension id to window
const isBrowser = typeof chrome != "undefined" && !!chrome.storage
// var script = document.createElement('script');
// const extension_id = isBrowser ? chrome.i18n.getMessage("@@extension_id") : null;
// script.innerHTML = `extension_id = "${extension_id}"`;
// (document.head || document.documentElement).appendChild(script)

import $ from 'jquery'
import Utils from './helpers/utils'
import MatriculaHelper from './helpers/matricula'

// CSS imports
import "element-ui/lib/theme-chalk/index.css"

let matricula_url

if (process.env.NODE_ENV == 'production') {
  matricula_url = [
    'matricula.ufabc.edu.br/matricula',
    'ufabc-matricula.cdd.naoseiprogramar.com.br/snapshot',
  ]
} else {
   matricula_url = [
    'matricula.ufabc.edu.br/matricula',
    'ufabc-matricula.cdd.naoseiprogramar.com.br/snapshot',
    'ufabc-matricula.cdd.naoseiprogramar.com.br/snapshot/backup.html',
    'ufabc-matricula-test.cdd.naoseiprogramar.com.br/snapshot',
    'ufabc-matricula-test.cdd.naoseiprogramar.com.br/snapshot/backup.html',
    'locahost:8011/snapshot',
    'locahost:8011/snapshot/backup.html',
    'matriculas.felipecoder.com/snapshot',
    'matriculas.felipecoder.com/snapshot/backup.html',
  ]
}

if(!isBrowser) {
  console.log('Not running on browser!')
  load()
} else {
  window.addEventListener('load', load)
}

async function load() {
  const currentUrl = document.location.href;

  // add cross-domain local storage
  Utils.injectScript('scripts/lib/xdLocalStorage.min.js')
  Utils.injectIframe('pages/iframe.html')
  Utils.injectScript('scripts/lib/init.js')

  require('./portal/portal')

  if(matricula_url.some(url => currentUrl.indexOf(url) != -1)) {
    // update teachers locally
    setTimeout(async () => {
      const lastUpdate = await Utils.storage.getItem('ufabc-extension-last')
      MatriculaHelper.updateProfessors(lastUpdate).then(r => console.log(r))

      // this is the main vue app
      // i.e, where all the filters live
      const anchor = document.createElement('div')
      anchor.setAttribute('id', 'app')
      $('#meio').prepend(anchor)

      //inject styles
      Utils.injectStyle('styles/main.css')

      //inject face
      Utils.injectScript('scripts/helpers/face.js')

      // manda as informacoes para o servidor
      MatriculaHelper.sendAlunoData()
      
      // load vue app modal
      const modal = document.createElement('div')
      modal.setAttribute('id', 'modal')
      modal.setAttribute('data-app', true);
      document.body.append(modal)

      // load vue app help
      const help = document.createElement('div')
      help.setAttribute('id', 'help')
      help.setAttribute('data-app', true);
      document.body.append(help)

      // inject Vue app
      Utils.injectScript('scripts/main.js')
    }, 1500)
  }
}