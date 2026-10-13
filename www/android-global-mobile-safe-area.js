/* Detecta solamente Capacitor/localhost: no altera el sitio público en el navegador. */
(function(){
 try{
  /* El login conserva su composición original: las franjas se aplican después de autenticar. */
  var page=(location.pathname||'').split('/').pop().toLowerCase();
  if(page==='login.html'||page==='login-2.html')return;
  var c=window.Capacitor;
  var native=!!(c&&(
    (typeof c.isNativePlatform==='function'&&c.isNativePlatform())||
    (typeof c.getPlatform==='function'&&/^(android|ios)$/i.test(String(c.getPlatform())))
  ));
  var local=location.hostname==='localhost'&&/^https?:$/.test(location.protocol);
  if(!native&&!local)return;
  var activate=function(){
    if(!document.body)return;
    document.body.classList.add('ay-android-global-mobile');
    if(!document.getElementById('ayAndroidGlobalTopStrip')){
      var top=document.createElement('div');top.id='ayAndroidGlobalTopStrip';top.setAttribute('aria-hidden','true');
      document.body.insertBefore(top,document.body.firstChild);
    }
    if(!document.getElementById('ayAndroidGlobalBottomStrip')){
      var bottom=document.createElement('div');bottom.id='ayAndroidGlobalBottomStrip';bottom.setAttribute('aria-hidden','true');
      document.body.appendChild(bottom);
    }
  };
  if(document.body)activate();else document.addEventListener('DOMContentLoaded',activate,{once:true});
 }catch(e){}
})();
