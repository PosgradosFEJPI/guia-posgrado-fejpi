/* Créditos, pagos y becas · Guía del Estudiante de Posgrado FEJPI */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const route=(parts,lbl)=>`<div class="siga"><span class="lbl">${lbl||"SIGA"}</span>${parts.map((p,i)=>i===parts.length-1?`<span class="last">${esc(p)}</span>`:`${esc(p)}<span class="sep">›</span>`).join("")}</div>`;
const IMG="/img/fin/";
const U={
 directa:"https://www.unisabana.edu.co/financiacion/financiacion-posgrados/financiacion-directa-posgrados",
 plataforma:"https://sigaacademico.unisabana.edu.co:8055/Ayudas/",
 siga:"https://sigaacademico.unisabana.edu.co/psp/CS90PRO/?&cmd=login&languageCd=ESP&",
 polNTD:"https://usabana.widen.net/s/6bbbfqnzhf/politicas-de-credito-no-te-detengas-tradicional-y-especial",
 polProy:"https://usabana.widen.net/s/7kmkvfzh5b/pol.-linea-credito-proyectate-v-9.0-01-may-26-2",
 insEsp:"https://usabana.widen.net/s/f2pzlz9dj5/instructivo_no_te_detengas_especial_version-1",
 insTrad:"https://usabana.widen.net/s/vmj6jmkwdw/instructivo_no_te_detengas_tradicional_version-1",
 insProy:"https://usabana.widen.net/s/6slk9j8frx/instructivo_credito_proyectate_version-1",
 poliza26:"https://usabana.widen.net/s/zshchk5vlv/instructivo-poliza-2026",
 poliza25:"https://usabana.widen.net/s/rwkgxzkpp9/instructivo-poliza-2025",
 formato:"https://usabana.widen.net/s/gfg9tlpwws/formato-poliza",
 legal:"https://usabana.widen.net/s/bw7x9wsbb6/instructivo-legalizacion-de-garantias-2021-2",
 parciales:"https://usabana.widen.net/s/b9j6r7hrnq/instructivo_pagos_parciales_ordenes_matricula_1",
 genSol:"https://view.genially.com/662aca571d54890014ddafff/presentation-instructivo-financiacion-directa",
 genPago:"https://view.genially.com/68004b4227308ea732f300de"
};

/* ---------- Líneas ---------- */
const L={
 esp:{n:"No Te Detengas Especial",short:"NTD Especial",tag:"Corto plazo · sin intereses corrientes",pol:U.polNTD,ins:U.insEsp,poliza:U.poliza26,opt:"CREDITO NO TE DETENGAS ESPECIAL",
  sum:"Pagas el 50 % de tu matrícula al menos 30 días antes de empezar clases y difieres el resto en cuotas mensuales fijas, sin intereses corrientes."},
 trad:{n:"No Te Detengas Tradicional",short:"NTD Tradicional",tag:"Corto plazo · hasta el 100 %",pol:U.polNTD,ins:U.insTrad,poliza:U.poliza26,opt:"CREDITO NO TE DETENGAS TRADICIONAL",
  sum:"Financias hasta el 100 % de tu matrícula y la pagas en cuotas mensuales fijas durante el semestre."},
 proy:{n:"Proyéctate",short:"Proyéctate",tag:"Mediano plazo · 50 % y 50 %",pol:U.polProy,ins:U.insProy,poliza:U.poliza25,opt:"CREDITO PROYECTATE",
  sum:"Financias hasta el 100 % de cada semestre. Pagas la mitad mientras estudias y la otra mitad, con los intereses, cuando terminas materias."}
};
const hotLine={esp:[0,27,97,9],trad:[0,37,97,9],proy:[0,62,97,9]};

/* ---------- Comparador ---------- */
const CMP={cols:[["esp","No Te Detengas Especial"],["trad","No Te Detengas Tradicional"],["proy","Proyéctate"],["icetex","ICETEX Posgrado país"]],
 rows:[
 ["Tipo",["Corto plazo","Corto plazo","Mediano plazo","Largo plazo"]],
 ["Cuánto financia",["El saldo de la matrícula, después de pagar el 50 %","Hasta el 100 % de la matrícula","Hasta el 100 % de la matrícula de cada semestre","Hasta el valor total de la matrícula"]],
 ["Cómo pagas",["50 % al menos 30 días antes de clases y el resto en hasta 5 cuotas mensuales","De 1 a 6 cuotas mensuales durante el semestre","50 % en 1 a 6 cuotas durante el semestre. El otro 50 % y los intereses al terminar materias, en hasta el doble de meses que semestres financiados","40 % durante los estudios y 60 % después"]],
 ["Intereses",["Sin intereses corrientes","Con interés corriente","Con interés corriente. Los de época de estudios se capitalizan o se pagan en un solo pago","Los define ICETEX"]],
 ["Codeudor",["Puedes ser tu propio codeudor si certificas ingresos y no tienes reportes negativos. Si no, un codeudor de hasta 70 años","Igual que en Especial","Siempre. Hasta 2 codeudores, de máximo 65 años","Deudor solidario con estudio crediticio de ICETEX"]],
 ["Garantías",["Pagaré electrónico y póliza de seguro de vida","Pagaré electrónico y póliza de seguro de vida","Pagaré electrónico, póliza de seguro de vida semestral y formulario de asegurabilidad","Las que exija ICETEX"]],
 ["Renovación",["Nueva solicitud cada semestre","Nueva solicitud cada semestre","Renovación semestral con promedio acumulado de 3,8 o más","Renovación ante ICETEX"]],
 ["Dónde se solicita",["Plataforma de créditos","Plataforma de créditos","Plataforma de créditos","Portal de ICETEX"]]
]};
function renderCmp(){
  const t=$("#cmpTable");
  t.innerHTML=`<thead><tr><th scope="col"><span class="sr">Condición</span></th>${CMP.cols.map(c=>`<th scope="col">${c[0]==="icetex"?`<span class="cmp-h">${esc(c[1])}</span>`:`<button type="button" class="cmp-h" data-goline="${c[0]}">${esc(c[1])}</button>`}</th>`).join("")}</tr></thead><tbody>${CMP.rows.map(r=>`<tr><th scope="row">${esc(r[0])}</th>${r[1].map(v=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody>`;
}

/* ---------- Paso a paso ---------- */
const S=[
 {id:"politica",t:"Lee la política y el instructivo",s:"Política",
  d:l=>`<p>${esc(L[l].sum)}</p><p>Lee completa la <b>política de crédito</b> de tu línea. La debes <b>firmar tú y tu codeudor</b> (si lo tienes) porque es uno de los documentos que cargarás. Encuéntrala en la página de Financiación directa, botón <b>Instructivo y documentos</b>.</p>`,
  img:[{src:"web-credito",cap:"Página oficial de Financiación directa. Haz clic en Instructivo y documentos.",hot:[[59,79,18,10]]}],
  links:l=>[["Política de crédito",L[l].pol],["Instructivo oficial",L[l].ins],["Financiación directa",U.directa]]},
 {id:"pago50",only:["esp"],t:"Paga el 50 % de tu matrícula",s:"Pago del 50 %",
  d:()=>`<p>Para esta línea debes pagar <b>como mínimo el 50 % del valor de tu matrícula al menos 30 días antes del inicio de clases</b>. Guarda el soporte porque lo cargarás con tu solicitud. Tienes tres formas de hacerlo.</p><ul><li><b>En SIGA, con pago parcial.</b> Marca la orden de matrícula, elige <b>Pago Parcial</b>, escribe el valor y paga en línea.</li><li><b>En la Tesorería</b> del campus (edificio O).</li><li><b>En Bancolombia.</b> Transferencia a la cuenta de ahorros 20058996304 (NIT 860 075 558) a nombre de la Universidad de La Sabana, o por ventanilla con el convenio 507. En la referencia escribe tu ID de estudiante.</li></ul>`,
  route:["Menú Principal","Autoservicio","Finanzas del Campus","Realización de Pagos"],
  img:[{src:"parcial-3",cap:"Marca la orden, elige Pago Parcial, escribe el valor y haz clic en Pago en línea."}],
  links:()=>[["Instructivo de pagos parciales",U.parciales]]},
 {id:"poliza",t:"Compra y paga la póliza de seguro de vida",s:"Póliza",
  d:()=>`<p>La póliza de seguro de vida es <b>obligatoria</b> para legalizar el crédito. Genérala en SIGA así:</p><ol class="mini"><li>En <b>Finanzas del Alumnado</b> entra a <b>Compras varias</b>.</li><li>Busca <b>Póliza Seguro de Vida</b> del periodo que vas a financiar y en cantidad escribe <b>1</b>.</li><li>Baja hasta el final y haz clic en <b>Siguiente</b>.</li><li>Vuelve a <b>Finanzas del Alumnado</b>, entra a <b>Realización de Pagos</b> y paga en línea o descarga el recibo.</li></ol><p>También puedes pagarla por transferencia o ventanilla de Bancolombia (cuenta de ahorros 20058996304, convenio 507, con tu ID de estudiante como referencia). Guarda el soporte.</p>`,
  img:[{src:"siga-menu-creditos",cap:"Página de inicio de SIGA. En el bloque Finanzas del Alumnado están Compras Varias y Realización de Pagos.",hot:[[67.5,63.5,10,5.5],[67.5,71.5,13,5.5]]}],
  links:l=>[["Instructivo de la póliza",L[l].poliza],["Entrar a SIGA",U.siga]]},
 {id:"asegurabilidad",only:["proy"],t:"Diligencia el formulario de asegurabilidad",s:"Asegurabilidad",
  d:()=>`<p>Solo para Proyéctate. Descarga el formulario y diligencia <b>únicamente los campos resaltados</b>.</p><ul><li><b>Datos del asegurado principal.</b> Son tus datos como estudiante. Las fechas van en formato AA MM DD. En departamento escribe el código numérico (por ejemplo, Cundinamarca es 25).</li><li><b>Beneficiarios del seguro.</b> El beneficiario eres tú. No diligencies las columnas de parentesco ni de porcentaje.</li><li><b>Cuestionario de asegurabilidad.</b> Respóndelo completo.</li><li>Firma como en tu documento de identidad y escribe la fecha en que lo diligenciaste.</li></ul>`,
  img:[{src:"formulario-asegurabilidad",cap:"Formulario de asegurabilidad (MetLife). Diligencia solo los campos resaltados."}],
  links:()=>[["Descargar el formulario",U.formato]]},
 {id:"ingreso",t:"Entra a la plataforma de créditos",s:"Ingreso",
  d:()=>`<p>Ingresa a la plataforma de solicitudes de crédito con tu <b>usuario y contraseña de SIGA</b>. Si eres estudiante nuevo, al inscribirte recibes en tu correo unas credenciales temporales. Si tienes problemas para entrar, llama al 861 5555 ext. 34444.</p>`,
  img:[{src:"plataforma-login",cap:"Plataforma de créditos. Escribe usuario y contraseña y haz clic en Ingrese.",hot:[[32,66,32,15],[32,82,32,8]]}],
  links:()=>[["Abrir la plataforma de créditos",U.plataforma]]},
 {id:"datos",t:"Verifica tus datos",s:"Tus datos",
  d:()=>`<p>En <b>Información actual</b> revisa tu documento, nombre, correo, celular y dirección. Si cambiaste de tipo de documento, comunícate con Registro Académico y Contabilidad para actualizarlo antes de seguir.</p>`,
  img:[{src:"siga-listado",cap:"Listado de solicitudes. Revisa tu información actual.",hot:[[18,52,79,33]]}]},
 {id:"realizar",t:"Haz clic en Realizar solicitud",s:"Nueva solicitud",
  d:()=>`<p>Abajo, en <b>Listado de solicitudes</b>, haz clic en el botón verde <b>Realizar solicitud</b>.</p>`,
  img:[{src:"realizar-solicitud",cap:"Botón verde Realizar solicitud.",hot:[[1,56,21,36]]}]},
 {id:"personales",t:"Completa tus datos personales",s:"Datos personales",
  d:()=>`<p>Diligencia tus datos personales. Los campos marcados con asterisco (*) son obligatorios. Luego haz clic en <b>Siguiente</b>.</p>`,
  img:[{src:"form-datos",cap:"Paso 1 del formulario, Datos Personales.",hot:[[20,70,76,24],[83,94,10,6]]}]},
 {id:"credito",t:"Elige la línea, el periodo y el monto",s:"Crédito",
  d:l=>`<p>En <b>Tipo de crédito</b> elige <b>${esc(L[l].opt)}</b>. En <b>Periodo académico</b> elige el periodo que vas a financiar. En <b>Monto a financiar</b> escribe el valor total que vas a financiar según tu línea. Autoriza el uso de tus datos y haz clic en <b>Siguiente</b>.</p>${l==="esp"?`<p class="muted">En Especial, el monto es el saldo que te queda después de pagar el 50 %.</p>`:""}`,
  img:l=>[{src:"form-credito",cap:"Paso 2 del formulario, Crédito.",hot:[[22,51,25,9],[48,51,25,9],[74,51,25,9],[92,82,8,9]]},{src:"lista-lineas",cap:`Lista de líneas. Elige ${L[l].opt}.`,hot:[hotLine[l]]}]},
 {id:"formulario",t:"Completa el resto del formulario",s:"Formulario",
  d:l=>`<p>El formulario tiene siete pasos. Después de Crédito siguen <b>Información laboral, Información familiar, Referencias deudor, Información codeudores y Referencias codeudores</b>. Diligencia todo y en el paso 7 haz clic en <b>Terminar</b>.</p>${l==="proy"?`<div class="callout"><b>Proyéctate siempre exige codeudor.</b> Puedes registrar hasta dos. Cada uno debe tener máximo 65 años, residir y tener ingresos en Colombia, no tener reportes negativos en centrales de riesgo y contar con capacidad de endeudamiento. No puedes ser tu propio codeudor.</div>`:`<div class="callout blue"><b>¿Serás tu propio codeudor?</b> En No Te Detengas puedes postularte como tu codeudor si certificas ingresos. En ese caso, en <b>Datos codeudor</b> escribe de nuevo tu propia información. Si tendrás un codeudor, debe tener máximo 70 años, residir y tener ingresos en Colombia, no tener reportes negativos y contar con capacidad de endeudamiento.</div>`}`,
  img:[{src:"form-credito",cap:"Los siete pasos del formulario aparecen en la parte superior.",hot:[[20,24,79,19]]}]},
 {id:"documentos",t:"Carga los documentos",s:"Documentos",
  d:()=>`<p>Para cada documento haz clic en <b>Browse</b>, elige el archivo y luego haz clic en <b>Upload</b>. Los que dicen <b>(Documento requerido)</b> son obligatorios. Cuando subas todos, se habilita el botón <b>Terminar</b>.</p><ul><li>Carga cada documento en PDF, legible y completo.</li><li>Los documentos de identidad van por ambas caras.</li><li>No adjuntes nada en el campo <b>Plan de pagos</b>. Ese espacio es para Financiación Universitaria.</li></ul><p><a href="#docs" data-scroll="docs">Revisa la lista de documentos para tu caso ↓</a></p>`,
  img:[{src:"documentos",cap:"Listado de documentos. Browse para elegir el archivo, Upload para subirlo y Terminar al final.",hot:[[84,40.5,16,5.5],[88,89.5,10,6]]}]},
 {id:"tramite",t:"Confirma que quede EN TRÁMITE",s:"En trámite",
  d:()=>`<p>Al terminar verás el mensaje <b>Proceso exitoso</b>. En el listado de solicitudes tu crédito debe aparecer con el estado <b>EN TRÁMITE</b>. Desde ahora revisa el estado en esta plataforma y tu correo.</p><p><a href="#states" data-scroll="states">¿Qué significa cada estado? ↓</a></p>`,
  img:[{src:"en-tramite",cap:"La solicitud aparece con estado EN TRÁMITE.",hot:[[82,94,9,5.5],[44,15,54,12]]}]},
 {id:"pagare",t:"Firma el pagaré electrónico",s:"Pagaré",
  d:()=>`<p>Cuando tu crédito sea aprobado, recibirás un correo de <b>administrador@pagares.bvc.com.co</b> (Deceval). <b>Tú y tu codeudor</b> deben firmar cada uno el pagaré desmaterializado.</p><ol class="mini"><li>En el correo haz clic en <b>Portal firma</b>.</li><li>Escribe el texto del captcha y haz clic en <b>Autenticar Código OTP</b>.</li><li>En <b>Lista de Pagarés a Firmar</b> haz clic en la lupa de la columna <b>Detalle</b>.</li><li>Revisa el pagaré y haz clic en <b>Firmar</b>.</li><li>Crea una clave temporal que cumpla los criterios y haz clic en <b>Enviar No. Referencia</b>.</li><li>Escribe en <b>Código Referencia</b> el código que te llega por correo o mensaje de texto y haz clic en <b>Firmar</b>.</li><li>Recibirás la confirmación y una copia del pagaré en PDF. La clave del PDF es tu número de documento.</li></ol>`,
  img:[{src:"deceval-correo",cap:"1. Correo de Deceval. Haz clic en Portal firma.",hot:[[38,50,26,5]]},{src:"deceval-captcha",cap:"2. Escribe el captcha y autentica.",hot:[[61,71,21,7],[50,81,19,8]]},{src:"deceval-lista",cap:"3. Haz clic en la lupa de Detalle.",hot:[[89,70,7,14]]},{src:"deceval-firmar",cap:"4. Revisa el pagaré y haz clic en Firmar."},{src:"deceval-clave",cap:"5. Crea tu clave temporal y envía el número de referencia.",hot:[[31,47,29,20],[2,70.5,18,8]]},{src:"deceval-sms",cap:"6a. El código de referencia llega por correo o SMS."},{src:"deceval-codigo",cap:"6b. Escribe el código y haz clic en Firmar.",hot:[[18,36,33,8.5],[1,88,10,9]]},{src:"pagare-exitoso",cap:"7. Confirmación de firma exitosa."}],
  links:()=>[["Instructivo de legalización",U.legal]]},
 {id:"plan",t:"Consulta tu plan de pagos y paga tus cuotas",s:"Plan y pagos",
  d:()=>`<p>Cuando el crédito queda legalizado, Financiación Universitaria carga tu <b>plan de pagos</b>. Consúltalo y paga tus cuotas en SIGA. Las cuotas vencen el <b>día 5 de cada mes</b>.</p><ul><li><b>Plan de Pagos</b> muestra tus cuotas y fechas. Puedes imprimirlo.</li><li><b>Pagar Cuota</b> te deja pagar la cuota actual o un valor diferente, con PSE o tarjeta de crédito, o imprimir el recibo.</li><li><b>Histórico de Pagos</b> muestra los pagos que ya hiciste.</li></ul><p class="muted">Si tienes dificultades con el pago, escribe a cartera.financiacion@unisabana.edu.co.</p>`,
  route:["Menú Principal","Autoservicio","Créditos","Créditos Otorgados"],
  img:[{src:"siga-menu-creditos",cap:"Menú Principal, Autoservicio, Créditos, Créditos Otorgados.",hot:[[11,24.5,9,4.5],[25,28,8,4.5],[40,27.5,12,4.5]]},{src:"creditos-otorgados",cap:"Listado de créditos otorgados con Plan de Pagos, Pagar Cuota e Histórico.",hot:[[68,70,9,25],[77.5,70,8.5,25],[86,70,12,25]]},{src:"plan-pagos",cap:"Plan de pagos con tus cuotas y fechas límite."},{src:"pago-en-linea",cap:"Pagar Cuota. Selecciona la cuota y el medio de pago.",hot:[[3,34,22,6],[2,64,40,15]]}],
  links:()=>[["Instructivo interactivo de pago de cuotas",U.genPago]]}
];
const lineSteps=l=>S.filter(x=>!x.only||x.only.includes(l));
let line=store.get("gp_line","esp"); if(!L[line])line="esp";
let cs=0; const seenC=new Set([0]);
const figure=(im,i)=>`<figure class="shot" data-i="${i}"><button type="button" class="shot-btn" data-zoom="${im.src}" data-cap="${esc(im.cap)}" data-hot='${JSON.stringify(im.hot||[])}' aria-label="Ampliar: ${esc(im.cap)}"><span class="shot-img"><img src="${IMG+im.src}.webp" alt="${esc(im.cap)}" loading="lazy" decoding="async">${(im.hot||[]).map(h=>`<i class="hot" style="left:${h[0]}%;top:${h[1]}%;width:${h[2]}%;height:${h[3]}%"></i>`).join("")}</span></button><figcaption>${esc(im.cap)}</figcaption></figure>`;
function stepBody(x,l){
  const imgs=typeof x.img==="function"?x.img(l):(x.img||[]);
  const links=x.links?x.links(l):[];
  const gal=imgs.length>1?`<div class="gallery" data-n="${imgs.length}"><div class="g-track">${imgs.map(figure).join("")}</div><div class="g-nav"><button type="button" class="btn ghost sm" data-g="-1" aria-label="Imagen anterior">←</button><span class="g-count">1 / ${imgs.length}</span><button type="button" class="btn ghost sm" data-g="1" aria-label="Imagen siguiente">→</button></div></div>`:imgs.map(figure).join("");
  return `${x.d(l)}${x.route?route(x.route):""}${gal}${links.length?`<div class="linkrow">${links.map(a=>`<a href="${a[1]}" target="_blank" rel="noopener">${esc(a[0])} ↗</a>`).join("")}</div>`:""}`;
}
function renderLineTabs(){
  $("#lineTabs").innerHTML=Object.keys(L).map(k=>`<button type="button" role="tab" data-line="${k}" aria-selected="${k===line}"><b>${esc(L[k].n)}</b><small>${esc(L[k].tag)}</small></button>`).join("");
}
function renderCSteps(){
  const st=lineSteps(line); if(cs>=st.length)cs=st.length-1;
  $$("#lineTabs button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.line===line)));
  $("#cStepList").innerHTML=st.map((x,i)=>`<li><button type="button" role="tab" data-cs="${i}" aria-selected="${i===cs}" class="${seenC.has(i)&&i!==cs?"seen":""}"><span>${esc(x.s)}</span></button></li>`).join("");
  const x=st[cs];
  $("#cStepPanel").innerHTML=`<div class="step-head"><span class="num">${String(cs+1).padStart(2,"0")}</span><div><span class="eyebrow">${esc(L[line].short)} · Paso ${cs+1} de ${st.length}</span><h3>${esc(x.t)}</h3></div></div>
  <div class="step-bar" aria-hidden="true"><i style="width:${(cs+1)/st.length*100}%"></i></div>
  <div class="cbody">${stepBody(x,line)}</div>
  <div class="nav"><button class="btn ghost" type="button" data-cnav="-1" ${cs===0?"disabled":""}>← Anterior</button><button class="btn" type="button" data-cnav="1">${cs===st.length-1?"Volver al inicio":"Siguiente →"}</button></div>`;
}
function setLine(l,scroll){if(!L[l])return;line=l;store.set("gp_line",l);cs=0;seenC.clear();seenC.add(0);renderCSteps();renderDocs();if(scroll)$("#pasoapaso").scrollIntoView({behavior:"smooth",block:"start"})}
function goStep(l,i){line=l;cs=i;seenC.add(i);renderCSteps();const p=$("#cStepPanel");p.classList.remove("hl-flash");void p.offsetWidth;p.classList.add("hl-flash");return $("#pasoapaso")}

/* ---------- Recomendador ---------- */
const Q=[
 {k:"como",q:"¿Cómo prefieres pagar?",o:[["sem","Todo durante el semestre"],["mitad","Una parte mientras estudio y otra al terminar"]]},
 {k:"mitad",q:"¿Puedes pagar al menos la mitad de tu matrícula 30 días antes de empezar clases?",o:[["si","Sí"],["no","No"]],when:a=>a.como!=="mitad"},
 {k:"pre",q:"¿Estás pagando un crédito de pregrado de mediano o largo plazo (directo o ICETEX)?",o:[["no","No"],["mas","Sí, ya pagué la mitad o más"],["menos","Sí, he pagado menos de la mitad"]]},
 {k:"ing",q:"¿Tienes ingresos propios que puedas certificar?",o:[["si","Sí"],["no","No"]]}
];
let ans=store.get("gp_reco",{});
function recoResult(a){
  const out=[];let note=[];
  if(a.pre==="menos"){return{blocked:true,html:`<div class="reco-card bad"><span class="tag bad">Por ahora</span><h4>No puedes tomar un crédito directo para el posgrado</h4><p>Las políticas permiten un crédito de corto plazo solo cuando ya pagaste al menos el 50 % de tu crédito de pregrado de mediano o largo plazo. Mientras tanto, consulta las <a href="#creditos" data-scroll="externas">entidades externas</a> o escribe a solicitud.creditos@unisabana.edu.co.</p></div>`}}
  if(a.como==="mitad"&&a.pre!=="mas"){out.push(["proy","Te conviene si quieres pagar la mitad al terminar materias. Recuerda que exige codeudor y un promedio acumulado de 3,8 para renovar cada semestre."]);out.push(["icetex","Alternativa de largo plazo. Pagas el 40 % durante los estudios y el 60 % después. No se puede combinar con Proyéctate."])}
  else{
    if(a.como==="mitad"&&a.pre==="mas")note.push("Como tienes un crédito de pregrado vigente, solo puedes tomar una línea de corto plazo. Proyéctate no está disponible para ti por ahora.");
    if(a.como==="mitad"){out.push(["trad","Financias hasta el 100 % de tu matrícula en cuotas mensuales durante el semestre."]);out.push(["esp","Si puedes pagar la mitad 30 días antes de clases, difieres el resto sin intereses corrientes."])}
    else if(a.mitad==="si"){out.push(["esp","Pagas la mitad antes de clases y el resto en cuotas mensuales sin intereses corrientes."]);out.push(["trad","Alternativa si prefieres financiar más del 50 %."])}
    else{out.push(["trad","Financias hasta el 100 % de tu matrícula en cuotas mensuales durante el semestre."])}
  }
  const ntd=out.some(o=>o[0]==="esp"||o[0]==="trad");
  if(ntd)note.push(a.ing==="si"?"Como certificas ingresos, en No Te Detengas puedes postularte como tu propio codeudor, siempre que no tengas reportes negativos en centrales de riesgo.":"Necesitarás un codeudor (familiar o persona externa) de máximo 70 años, con ingresos y residencia en Colombia, sin reportes negativos y con capacidad de endeudamiento.");
  if(out.some(o=>o[0]==="proy"))note.push("En Proyéctate el codeudor es obligatorio. Puedes tener hasta dos, de máximo 65 años.");
  const card=(o,i)=>o[0]==="icetex"?`<div class="reco-card"><span class="tag blue">Otra opción</span><h4>ICETEX Posgrado país</h4><p>${esc(o[1])}</p><a class="btn ghost sm" href="https://www.unisabana.edu.co/financiacion/financiacion-posgrado-credito-icetex" target="_blank" rel="noopener">Ver ICETEX ↗</a></div>`:`<div class="reco-card${i===0?" top":""}"><span class="tag ${i===0?"red":"blue"}">${i===0?"Te recomendamos":"Otra opción"}</span><h4>${esc(L[o[0]].n)}</h4><p>${esc(o[1])}</p><button type="button" class="btn${i===0?"":" ghost"} sm" data-goline="${o[0]}">Ver paso a paso →</button></div>`;
  return{html:`<div class="reco-out">${out.map(card).join("")}</div>${note.length?`<div class="callout blue"><b>Sobre el codeudor y tu caso.</b><ul>${note.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></div>`:""}<p class="muted" style="font-size:.88rem">Esta es una orientación. La aprobación depende del estudio de crédito de Financiación Universitaria. También puedes acudir a Sufi o Crédito Fincomercio.</p>`};
}
function renderReco(){
  const qs=Q.filter(q=>!q.when||q.when(ans));
  const complete=qs.every(q=>ans[q.k]);
  $("#reco").innerHTML=`<div class="reco-qs">${qs.map((q,i)=>`<fieldset class="reco-q"><legend><span class="rq-n">${i+1}</span>${esc(q.q)}</legend><div class="reco-opts">${q.o.map(o=>`<button type="button" data-rk="${q.k}" data-rv="${o[0]}" aria-pressed="${ans[q.k]===o[0]}">${esc(o[1])}</button>`).join("")}</div></fieldset>`).join("")}${Object.keys(ans).length?`<button type="button" class="reset" data-rreset>Empezar de nuevo</button>`:""}</div>
  <div class="reco-res" aria-live="polite">${complete?recoResult(ans).html:`<div class="reco-wait"><svg><use href="#i-coin"/></svg><p>Responde las preguntas para ver tu recomendación.</p><small>${qs.filter(q=>ans[q.k]).length} de ${qs.length} respondidas</small></div>`}</div>`;
}

/* ---------- Estados ---------- */
const ST=[
 ["EN TRÁMITE","blue","Tu solicitud quedó radicada y espera revisión."],
 ["Estudio de crédito","blue","Financiación Universitaria revisa tu solicitud y tus documentos."],
 ["Devuelto","bad","Falta un documento o alguno tiene un error. Revisa la observación, corrige y vuelve a cargarlo."],
 ["Preaprobado","ok","Tu solicitud pasó el estudio. Sigue la legalización de garantías."],
 ["Pendiente pagaré","warn","Se está generando tu pagaré electrónico. Atento al correo de administrador@pagares.bvc.com.co."],
 ["Pendiente firma","warn","Falta que tú o tu codeudor firmen el pagaré en el portal de Deceval."],
 ["Crédito legalizado","ok","¡Listo! Financiación Universitaria carga tu plan de pagos en SIGA."],
 ["Deuda del ciclo anterior","bad","Tienes un saldo pendiente de un periodo anterior. Ponte al día para continuar."],
 ["Pendiente promedio","warn","La solicitud espera tu promedio académico (aplica a la renovación de Proyéctate)."]
];
function renderStates(){$("#states").innerHTML=ST.map((s,i)=>`<div class="state"><span class="st-n">${i+1}</span><span class="tag ${s[1]}">${esc(s[0])}</span><p>${esc(s[2])}</p></div>`).join("")}

/* ---------- Documentos ---------- */
let dwho=store.get("gp_dwho","otro"), dinc=store.get("gp_dinc","emp");
const dchk=new Set(store.get("gp_docs",[]));
function docList(){
  const d=[["id-est","Documento de identidad del estudiante, por ambas caras"],["politica","Política de crédito leída y firmada por ti"+(dwho==="otro"||line==="proy"?" y tu codeudor":"")],["poliza","Soporte de pago de la póliza de seguro de vida"]];
  if(line==="esp")d.push(["p50","Soporte de pago del 50 % de la matrícula"]);
  if(line==="proy")d.push(["aseg","Formulario de asegurabilidad diligenciado y firmado"]);
  const self=dwho==="yo"&&line!=="proy";
  const who=self?"tuyo":"del codeudor";
  if(!self)d.push(["id-cod","Documento de identidad del codeudor, por ambas caras"]);
  if(dinc==="emp")d.push(["lab","Certificación laboral original "+who+" con salario, tipo de contrato, antigüedad y cargo, de máximo 30 días"]);
  if(dinc==="ind")d.push(["cont","Certificado de ingresos "+who+" expedido por un contador público, de máximo 30 días"],["cont-id","Documento de identidad y tarjeta profesional del contador"]);
  if(dinc==="pen")d.push(["pen","Último recibo de pago de la pensión "+(self?"(tuyo)":"del codeudor")]);
  return d;
}
function renderDocs(){
  const box=$("#docs"); if(!box)return;
  const self=dwho==="yo"&&line!=="proy";
  const list=docList(); const done=list.filter(x=>dchk.has(line+":"+x[0])).length;
  box.innerHTML=`<div class="docs-ctl"><div><span class="lbl-s">Línea</span><div class="seg">${Object.keys(L).map(k=>`<button type="button" data-dline="${k}" aria-pressed="${k===line}">${esc(L[k].short)}</button>`).join("")}</div></div>
  <div><span class="lbl-s">¿Quién es el codeudor?</span><div class="seg"><button type="button" data-dwho="otro" aria-pressed="${!self}">Otra persona</button><button type="button" data-dwho="yo" aria-pressed="${self}" ${line==="proy"?"disabled title=\"Proyéctate siempre exige codeudor\"":""}>Yo mismo</button></div></div>
  <div><span class="lbl-s">${self?"Tus ingresos":"Ingresos del codeudor"}</span><div class="seg">${[["emp","Empleado"],["ind","Independiente"],["pen","Pensionado"]].map(o=>`<button type="button" data-dinc="${o[0]}" aria-pressed="${dinc===o[0]}">${o[1]}</button>`).join("")}</div></div></div>
  <ul class="checklist docs-list">${list.map((x,i)=>`<li class="${dchk.has(line+":"+x[0])?"done":""}"><input type="checkbox" id="dc-${x[0]}" data-dk="${x[0]}" ${dchk.has(line+":"+x[0])?"checked":""}><label for="dc-${x[0]}"><b>${esc(x[1])}</b></label></li>`).join("")}</ul>
  <div class="docs-foot"><span class="tag ${done===list.length?"ok":"blue"}">${done} de ${list.length} listos</span><span class="muted">${self?"Al ser tu propio codeudor, en el formulario repite tus datos en la parte Datos codeudor.":"Todos en PDF, legibles y completos."}</span></div>`;
}

/* ---------- Pagos ---------- */
const P=[
 {id:"linea",n:"En línea",sub:"PSE o tarjeta de crédito",body:`<p>Paga tu orden de matrícula u otro derecho pecuniario por la pasarela <b>PlacetoPay</b>, desde SIGA Académico.</p>${route(["Menú Principal","Autoservicio","Finanzas del Campus","Realización de Pagos"])}<ol class="mini"><li>Ingresa a SIGA con tu usuario y contraseña de estudiante.</li><li>Entra a <b>Realización de Pagos</b> y marca el ítem o cargo que vas a pagar.</li><li>Elige <b>Pago en línea</b> con un único medio (PSE o una tarjeta de crédito) o con varias tarjetas de crédito. También puedes elegir <b>Smart Pago</b> para recibir un enlace o código QR por correo, WhatsApp o mensaje de texto.</li><li>Haz clic en <b>Pago en línea</b>. La pasarela te pide tus datos y luego el medio de pago.</li></ol><div class="callout blue"><b>Antes de pagar, verifica.</b><ul><li>Que tu banco o tarjeta tenga habilitadas las transacciones en línea.</li><li>Que no hayas superado el tope diario de transacciones de tu banco.</li><li>Que tengas saldo o cupo suficiente.</li><li>Usa Chrome o Firefox.</li></ul></div>`,img:[{src:"parcial-4",cap:"Elige el medio de pago y haz clic en Pago en línea. Luego diligencia tus datos en PlacetoPay."},{src:"parcial-5",cap:"Selecciona tarjeta de crédito o PSE para terminar en tu banco."}]},
 {id:"parcial",n:"Pagos parciales",sub:"Abona por partes",body:`<p>Puedes abonar a tu orden de matrícula por partes. El sistema exige un valor mínimo por abono, que aparece en el instructivo oficial.</p>${route(["Menú Principal","Autoservicio","Finanzas del Campus","Realización de Pagos"])}<ol class="mini"><li>Ingresa a la ruta de Realización de Pagos.</li><li>Marca el concepto al que vas a abonar.</li><li>Elige <b>Pago Parcial</b>, escribe el valor, elige el medio de pago y haz clic en <b>Pago en línea</b>.</li><li>En PlacetoPay diligencia tus datos y haz clic en <b>Continuar</b>.</li><li>Elige el medio de pago y termina en la plataforma de tu banco o tarjeta.</li></ol>`,img:[{src:"parcial-1",cap:"1. Ruta en SIGA hasta Realización de Pagos."},{src:"parcial-2",cap:"2. Marca el concepto al que vas a abonar."},{src:"parcial-3",cap:"3. Elige Pago Parcial y escribe el valor."},{src:"parcial-4",cap:"4. Pago en línea y datos en PlacetoPay."},{src:"parcial-5",cap:"5. Elige tarjeta o PSE."}],link:["Instructivo de pagos parciales",U.parciales]},
 {id:"banco",n:"En el banco",sub:"Efectivo o cheque",body:`<p>Lleva <b>impresa</b> tu orden de matrícula o recibo de consignación. En las sucursales solo se recibe efectivo o cheque.</p><ul><li>Para posgrado puedes pagar en <b>Bancolombia</b> o en <b>Banco de Bogotá</b>.</li><li>El cheque va a nombre de la Universidad de La Sabana, por el valor exacto de la orden o por uno menor que completas en efectivo.</li><li>Solo se reciben cheques al día o con fecha de giro de máximo seis meses.</li></ul>`},
 {id:"campus",n:"En el campus",sub:"Caja de Tesorería",body:`<p>Ve a la <b>Caja de la Tesorería, edificio O</b>, con tu orden de matrícula o recibo impreso.</p><p>Se reciben tarjetas débito Visa o Maestro y tarjetas de crédito American Express, Visa, Visa Electron, Diners, Mastercard y Falabella vigente (con logo de Visa o Mastercard).</p>`},
 {id:"giro",n:"Giro internacional",sub:"Desde el exterior",body:`<p>Si vives en Colombia y necesitas hacer una transferencia internacional, debes enviarla desde una cuenta de compensación en el exterior a tu nombre. Si no tienes una, paga a la cuenta de ahorros Bancolombia 20435709027 a nombre de la Universidad de La Sabana y repórtalo a aplicacionpagos@unisabana.edu.co.</p><div class="kv"><div><span>Banco beneficiario</span><b>Bancolombia Panamá</b></div><div><span>Titular</span><b>Universidad de La Sabana</b></div><div><span>Número de cuenta</span><b>80100007562</b></div><div><span>Código SWIFT</span><b>COLOPAPA</b></div></div><ul><li>En el detalle del pago escribe tu ID de estudiante o número de factura, tu nombre y el concepto (matrícula o crédito).</li><li>Cada banco cobra su propia tarifa de envío, que asume quien hace el giro.</li><li>El giro tarda entre 4 y 5 días en llegar. Envía el soporte a aplicacionpagos@unisabana.edu.co para que lo apliquen.</li></ul><div class="contact"><span class="k">Correo</span><span class="v">aplicacionpagos@unisabana.edu.co</span><button class="copy" type="button" data-copy="aplicacionpagos@unisabana.edu.co">Copiar</button></div>`}
];
let pay=P[0].id;
const payHTML=p=>`<article class="card pay-card"><div class="pay-txt"><span class="eyebrow">${esc(p.sub)}</span><h3>${esc(p.n)}</h3>${p.body}${p.link?`<div class="linkrow"><a href="${p.link[1]}" target="_blank" rel="noopener">${esc(p.link[0])} ↗</a></div>`:""}</div>${p.img?`<div class="pay-img">${p.img.length>1?`<div class="gallery" data-n="${p.img.length}"><div class="g-track">${p.img.map(figure).join("")}</div><div class="g-nav"><button type="button" class="btn ghost sm" data-g="-1" aria-label="Imagen anterior">←</button><span class="g-count">1 / ${p.img.length}</span><button type="button" class="btn ghost sm" data-g="1" aria-label="Imagen siguiente">→</button></div></div>`:p.img.map(figure).join("")}</div>`:""}</article>`;
function renderPay(){
  $("#payTabs").innerHTML=P.map(p=>`<button type="button" role="tab" data-pay="${p.id}" aria-selected="${p.id===pay}"><b>${esc(p.n)}</b><small>${esc(p.sub)}</small></button>`).join("");
  $("#payPanel").innerHTML=payHTML(P.find(p=>p.id===pay));
}
const PF=[
 ["¿Qué es PlacetoPay?","Es la plataforma de pagos electrónicos que usa la Universidad para procesar en línea las transacciones con los medios de pago habilitados."],
 ["¿Es seguro pagar en línea?","Sí. La captura de los datos sensibles la hace PlacetoPay, que cumple la norma PCI DSS para pagos con tarjeta y usa certificado de seguridad SSL. En el navegador verás el nombre de la organización autenticada."],
 ["¿Puedo pagar cualquier día y a cualquier hora?","Sí. Los pagos en línea están disponibles los 7 días de la semana, las 24 horas."],
 ["¿Puedo cambiar la forma de pago?","Si aún no has terminado el pago, puedes volver al paso inicial y elegir otra. Una vez finalizado no es posible cambiarla."],
 ["¿Pagar en línea tiene algún costo?","No. Los pagos por PlacetoPay no tienen costos adicionales para quien paga."],
 ["Mi transacción no terminó, ¿qué hago?","Revisa si te llegó un correo de confirmación. Si no, comunícate con Service Desk al 861 5555 ext. 34444 o a service.desk@unisabana.edu.co para confirmar el estado."],
 ["No recibí el comprobante de pago, ¿qué hago?","Cada pago aprobado genera un comprobante en el correo que escribiste al pagar. Si no te llegó, pide el reenvío a Service Desk (861 5555 ext. 34444 o service.desk@unisabana.edu.co)."]
];

/* ---------- Becas ---------- */
const B=[
 {c:"ingreso",n:"Beca Excelencia Posgrados",who:"Admitidos nuevos a especialización o maestría con excelente desempeño en el pregrado y en su ejercicio profesional. Dirigida a Alumni Sabana y estudiantes interesados.",req:["Promedio acumulado de pregrado de 4,0 o más.","Trayectoria profesional mínima de dos años.","Ensayo motivacional excelente, evaluado por la Facultad.","Ser admitido al programa y obtener un resultado excelente en el proceso de la beca."],keep:"Para mantenerla debes tener un promedio académico mínimo de 4,20 cada semestre.",no:"No aplica a especializaciones médico quirúrgicas, programas en extensión, doctorados, doble programa ni homologación.",how:"Inscríbete en el formulario de la convocatoria del periodo.",links:[["Inscripción","https://posgrados.unisabana.edu.co/beca_excelencia_posgrados_2027-1"],["Ver condiciones","https://www.unisabana.edu.co/becas/posgrado/aspirantes/beca-excelencia-posgrados"]]},
 {c:"ingreso",n:"Beca Sabana (Talento)",who:"Participantes de la convocatoria de Beca Excelencia que no la ganaron y que, por sus méritos académicos y su situación, requieren una ayuda económica.",keep:"Se otorga en el primer semestre. La renovación depende de que cumplas todos los requisitos de continuidad.",how:"La Universidad la evalúa al cerrar el proceso de Beca Excelencia. Para más información, habla con el coordinador de promoción y admisión o con el director de tu programa.",links:[["Ver condiciones","https://www.unisabana.edu.co/becas/posgrado/aspirantes/beca-talento"]]},
 {c:"ingreso",n:"Descuento Pronto Pago",who:"Admitidos a especialización, maestría o doctorado que pagan la matrícula dentro de las fechas definidas por su programa.",keep:"Solo aplica al primer semestre.",no:"No es acumulable con otros descuentos o becas. No aplica a matrículas por créditos ni a especializaciones médico quirúrgicas.",how:"Consulta las fechas con el coordinador de promoción y admisión o con el gestor logístico de tu programa.",links:[["Ver condiciones","https://www.unisabana.edu.co/becas/posgrado/aspirantes/descuento-pronto-pago"]]},
 {c:"ingreso",n:"Descuento Alumno Meritorio en Pregrado",who:"Estudiantes que obtuvieron la mención de Alumno Meritorio en el pregrado de la Universidad de La Sabana.",keep:"Aplica para el primer semestre.",no:"No aplica a doctorados.",how:"Se solicita en SIGA.",links:[["Ver condiciones","https://www.unisabana.edu.co/becas/posgrado/descuentos-sabana"]]},
 {c:"vinculo",n:"Descuento Alumni Sabana",who:"Graduados de pregrado, posgrado o diplomados de la Universidad que estudian una especialización o maestría. El porcentaje es mayor para graduados de pregrado o posgrado.",keep:"Se otorga en cada ciclo lectivo. Si tu estado es finalizó materias, puede aplicarse en el primer ciclo mientras te gradúas. Si no obtienes el grado, no se renueva.",no:"No aplica a otros estados académicos distintos de graduado.",how:"Se solicita en SIGA.",links:[["Ver condiciones","https://www.unisabana.edu.co/becas/posgrado/descuentos-sabana"]]},
 {c:"vinculo",n:"Beca Sabana Familiar",who:"Esposos, padres e hijos o hermanos matriculados en pregrado o posgrado en el mismo ciclo lectivo.",keep:"Si uno de los beneficiarios paga su matrícula y el otro no, quien recibió el beneficio debe pagar el valor descontado.",how:"Se solicita en SIGA.",links:[["Ver condiciones","https://www.unisabana.edu.co/becas/posgrado/descuentos-sabana"]]},
 {c:"vinculo",n:"Descuento grupo de empleados de una misma empresa",who:"Dos o más funcionarios de una misma empresa (misma razón social y NIT, sin filiales) que cursan posgrados en el mismo ciclo lectivo.",keep:"El porcentaje depende del tamaño del grupo y no cambia si otro compañero se matricula después.",how:"Tú debes presentar la certificación de tus compañeros de la misma empresa. Se solicita en SIGA.",links:[["Ver condiciones","https://www.unisabana.edu.co/becas/posgrado/descuentos-sabana"]]},
 {c:"vinculo",n:"Becas Aliados (convenios)",who:"Miembros de entidades con convenio.",req:["Colegio Colombiano de Psicólogos, para programas de la Facultad de Psicología.","Sabana Empresarial, para funcionarios de empresas con convenio con la Asociación de Amigos de la Universidad (no aplica a doctorados).","Convocatorias del Gobierno Nacional, para programas de la Facultad de Educación.","Municipios de Sabana Centro (Cajicá, Funza, Sopó, Tenjo y Tocancipá), para empleados públicos u oficiales del municipio. Exige mantener un promedio acumulado de 4,0."],how:"La entidad certifica a sus beneficiarios. Consulta las condiciones de cada convenio.",links:[["Ver convenios","https://www.unisabana.edu.co/becas/posgrado/aspirantes/becas-convenio"]]},
 {c:"vinculo",n:"Becas Empleados",who:"Profesores de planta y de hora cátedra, empleados de la Universidad, INALDE, la Clínica y Fonsabana, y sus familiares.",how:"Se otorgan según las políticas de Desarrollo Humano.",links:[["Ver condiciones","https://www.unisabana.edu.co/becas/posgrado/becas-empleados"]]}
];
const BC=[["todas","Todas"],["ingreso","Al ingresar al programa"],["vinculo","Por tu vínculo o tu empresa"]];
let bf="todas";
const becaHTML=b=>`<article class="card beca" data-search="${esc("beca descuento "+b.n+" "+b.who+" "+(b.keep||"")+" "+(b.no||"")+" "+(b.req||[]).join(" "))}"><span class="tag ${b.c==="ingreso"?"red":"blue"}">${b.c==="ingreso"?"Al ingresar":"Por vínculo"}</span><h3>${esc(b.n)}</h3><p>${esc(b.who)}</p>${b.req?`<ul>${b.req.map(r=>`<li>${esc(r)}</li>`).join("")}</ul>`:""}${b.keep?`<p class="b-keep"><b>Duración.</b> ${esc(b.keep)}</p>`:""}${b.no?`<p class="b-no"><b>No aplica.</b> ${esc(b.no)}</p>`:""}<p class="b-how"><b>Cómo se solicita.</b> ${esc(b.how)}</p><div class="linkrow">${b.links.map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])} ↗</a>`).join("")}</div></article>`;
function renderBecas(){
  $("#becaFilter").innerHTML=BC.map(c=>`<button type="button" data-bf="${c[0]}" aria-pressed="${bf===c[0]}">${esc(c[1])}</button>`).join("");
  $$("#becaGrid .beca").forEach(el=>{el.hidden=!(bf==="todas"||el.dataset.c===bf)});
}

/* ---------- Ampliar imagen ---------- */
const lb=document.createElement("div");lb.className="lightbox";lb.hidden=true;lb.setAttribute("role","dialog");lb.setAttribute("aria-modal","true");lb.setAttribute("aria-label","Imagen ampliada");
lb.innerHTML=`<div class="lb-box"><button type="button" class="lb-x" aria-label="Cerrar">✕</button><div class="lb-img"></div><p class="lb-cap"></p></div>`;
document.body.appendChild(lb);
let lbLast=null;
function openLB(b){lbLast=b;const hot=JSON.parse(b.dataset.hot||"[]");$(".lb-img",lb).innerHTML=`<img src="${IMG+b.dataset.zoom}.webp" alt="">${hot.map(h=>`<i class="hot" style="left:${h[0]}%;top:${h[1]}%;width:${h[2]}%;height:${h[3]}%"></i>`).join("")}`;$(".lb-cap",lb).textContent=b.dataset.cap;lb.hidden=false;document.body.style.overflow="hidden";$(".lb-x",lb).focus()}
function closeLB(){if(lb.hidden)return;lb.hidden=true;document.body.style.overflow="";if(lbLast)lbLast.focus({preventScroll:true})}
lb.addEventListener("click",e=>{if(e.target===lb||e.target.closest(".lb-x"))closeLB()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLB()});

/* ---------- Eventos ---------- */
document.addEventListener("click",e=>{
  const t=e.target;
  let b;
  if((b=t.closest("[data-zoom]"))){openLB(b);return}
  if((b=t.closest("[data-g]"))){const g=b.closest(".gallery"),n=+g.dataset.n,tr=$(".g-track",g);let i=Math.round(tr.scrollLeft/tr.clientWidth)+(+b.dataset.g);i=(i+n)%n;tr.scrollTo({left:i*tr.clientWidth,behavior:"smooth"});return}
  if((b=t.closest("[data-line]"))){setLine(b.dataset.line);return}
  if((b=t.closest("[data-goline]"))){setLine(b.dataset.goline,true);return}
  if((b=t.closest("[data-cs]"))){cs=+b.dataset.cs;seenC.add(cs);renderCSteps();return}
  if((b=t.closest("[data-cnav]"))){const n=lineSteps(line).length;cs=+b.dataset.cnav>0?(cs===n-1?0:cs+1):Math.max(0,cs-1);seenC.add(cs);renderCSteps();$("#cStepPanel").scrollIntoView({behavior:"smooth",block:"nearest"});return}
  if((b=t.closest("[data-rk]"))){ans[b.dataset.rk]=b.dataset.rv;if(b.dataset.rk==="como"&&b.dataset.rv==="mitad")delete ans.mitad;store.set("gp_reco",ans);renderReco();return}
  if(t.closest("[data-rreset]")){ans={};store.set("gp_reco",ans);renderReco();return}
  if((b=t.closest("[data-dline]"))){setLine(b.dataset.dline);return}
  if((b=t.closest("[data-dwho]"))){dwho=b.dataset.dwho;store.set("gp_dwho",dwho);renderDocs();return}
  if((b=t.closest("[data-dinc]"))){dinc=b.dataset.dinc;store.set("gp_dinc",dinc);renderDocs();return}
  if((b=t.closest("[data-pay]"))){pay=b.dataset.pay;renderPay();return}
  if((b=t.closest("[data-bf]"))){bf=b.dataset.bf;renderBecas();return}
  if((b=t.closest("[data-scroll]"))){e.preventDefault();const id=b.dataset.scroll;const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});return}
});
document.addEventListener("change",e=>{const c=e.target.closest("[data-dk]");if(!c)return;const k=line+":"+c.dataset.dk;c.checked?dchk.add(k):dchk.delete(k);store.set("gp_docs",[...dchk]);renderDocs()});
document.addEventListener("scroll",e=>{const tr=e.target;if(!(tr instanceof Element)||!tr.classList.contains("g-track"))return;const g=tr.closest(".gallery");$(".g-count",g).textContent=`${Math.round(tr.scrollLeft/tr.clientWidth)+1} / ${g.dataset.n}`},true);

/* ---------- Imprimir ---------- */
function printAll(){
  $("#printSteps").innerHTML=Object.keys(L).map(l=>`<h3 class="p-line">Paso a paso · ${esc(L[l].n)}</h3>`+lineSteps(l).map((x,i)=>`<div class="p-step"><h4>${i+1}. ${esc(x.t)}</h4>${stepBody(x,l)}</div>`).join("")).join("");
  $("#printPays").innerHTML=P.map(p=>payHTML(p)).join("");
}
window.addEventListener("beforeprint",printAll);

/* ---------- Inicio ---------- */
renderCmp();renderLineTabs();renderCSteps();renderReco();renderStates();renderDocs();renderPay();
$("#payFaq").innerHTML=PF.map(f=>`<details class="acc" data-search="${esc("pago electrónico "+f[0]+" "+f[1])}"><summary>${esc(f[0])}</summary><div class="acc-body"><p>${esc(f[1])}</p></div></details>`).join("");
$("#becaGrid").innerHTML=B.map(becaHTML).join("");
$$("#becaGrid .beca").forEach((el,i)=>el.dataset.c=B[i].c);
renderBecas();

/* ---------- Índice de búsqueda para app.js ---------- */
const strip=h=>h.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
window.FIN={idx:[],print:printAll};
Object.keys(L).forEach(l=>lineSteps(l).forEach((x,i)=>{const txt=strip(x.d(l));window.FIN.idx.push({sec:"Créditos y financiación",t:`${L[l].short} · Paso ${i+1}: ${x.t}`,txt,k:"credito financiacion "+L[l].n+" "+x.t+" "+txt,open:()=>goStep(l,i)})}));
P.forEach(p=>window.FIN.idx.push({sec:"Pagos de matrícula",t:"Pagar: "+p.n,txt:strip(p.body),k:"pago pagar matricula "+p.n+" "+p.sub+" "+strip(p.body),open:()=>{pay=p.id;renderPay();return $("#payTabs")}}));
window.FIN.printPrep=printAll;
})();
