
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const route=parts=>`<div class="siga"><span class="lbl">SIGA</span>${parts.map((p,i)=>i===parts.length-1?`<span class="last">${esc(p)}</span>`:`${esc(p)}<span class="sep">›</span>`).join("")}</div>`;

/* ---------- Índice ---------- */
const sections=$$("main > section");
$("#toc").innerHTML=sections.map(s=>`<li><a href="#${s.id}" data-id="${s.id}">${esc(s.dataset.title)}</a></li>`).join("");
$("#mtoc").innerHTML=sections.map(s=>`<a href="#${s.id}" data-id="${s.id}">${esc(s.dataset.title)}</a>`).join("");
function setActive(){
  let cur=sections[0].id; const y=window.scrollY+160;
  sections.forEach(s=>{if(s.offsetTop<=y)cur=s.id});
  $$("[data-id]").forEach(a=>a.classList.toggle("on",a.dataset.id===cur));
  const m=$(`#mtoc a[data-id="${cur}"]`); if(m&&m.dataset.vis!=="1"){$$("#mtoc a").forEach(a=>a.dataset.vis="");m.dataset.vis="1";const row=$("#mtoc");row.scrollTo({left:m.offsetLeft-16,behavior:"smooth"})}
  $("#toTop").hidden=window.scrollY<900;
  const h=document.documentElement.scrollHeight-innerHeight;$("#progress").style.transform=`scaleX(${h>0?Math.min(1,scrollY/h):0})`;
}
window.addEventListener("scroll",setActive,{passive:true}); setActive();
$("#toTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

/* ---------- Checklist ---------- */
const steps=[
 ["Revisa tu correo personal","Allí llegan tus credenciales institucionales después de pagar la matrícula.","#plataformas"],
 ["Entra al correo institucional y activa el doble factor","Desde ahora, toda comunicación oficial llega a ese correo.","#plataformas"],
 ["Ingresa a SIGA Académico","Con tu usuario corto y contraseña. Revisa tus datos y tu plan.","#plataformas"],
 ["Paga tu matrícula o legaliza tu crédito","Sin la matrícula pagada no puedes inscribir asignaturas.","#pagos"],
 ["Inscribe tus materias","Sigue los nueve pasos y verifica que todo quede en verde.","#inscripcion"],
 ["Descarga la App UniSabana y activa tu carné QR","Agrega tu foto para entrar al campus con reconocimiento facial.","#plataformas"],
 ["Conéctate al Wi-Fi \"Estudiantes\"","Usa tus credenciales institucionales.","#plataformas"],
 ["Instala Microsoft 365 y abre Teams","Tienes cinco licencias gratuitas.","#plataformas"],
 ["Lee las reglas clave del Reglamento","Nota mínima 3,5, asistencia del 75 % y plazos de trámites.","#reglamento"],
 ["Guarda los contactos y solicita tu asesor académico","Directorio de la Facultad y formulario de asesoría.","#contactos"]
];
const done=new Set(store.get("gp_checks2",[]));
const cl=$("#checklist");
cl.innerHTML=steps.map((s,i)=>`<li data-search="${esc(s[0]+" "+s[1])}"><input type="checkbox" id="chk${i}" ${done.has(i)?"checked":""}><label for="chk${i}"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></label><a class="go" href="${s[2]}" style="margin-left:auto">Ver cómo</a></li>`).join("");
const msgs=["Empieza por revisar tu correo personal.","Buen comienzo. Sigue con el siguiente paso.","Vas por buen camino.","Ya pasaste la mitad.","Casi terminas.","¡Listo! Ya tienes todo en orden."];
function upd(){
  $$("#checklist li").forEach((li,i)=>li.classList.toggle("done",done.has(i)));
  const n=done.size,t=steps.length,c=339.3;
  $("#ringFg").setAttribute("stroke-dashoffset",String(c-c*n/t));
  $("#ringTxt").textContent=`${n}/${t}`;
  $("#ringMsg").textContent=n===t?msgs[5]:n===0?msgs[0]:n<3?msgs[1]:n<5?msgs[2]:n<8?msgs[3]:msgs[4];
  store.set("gp_checks2",[...done]);
}
cl.addEventListener("change",e=>{const i=+e.target.id.replace("chk","");e.target.checked?done.add(i):done.delete(i);upd()});
$("#resetChecks").addEventListener("click",()=>{done.clear();$$("#checklist input").forEach(x=>x.checked=false);upd()});
upd();

/* ---------- Inscripción (stepper) ---------- */
const bar=u=>`<div class="bar"><i></i><i></i><i></i>${esc(u)}</div>`;
const ins=[
 {t:"Ingresa a SIGA",s:"Ingreso",d:"Antes de empezar, verifica que tu matrícula esté pagada (o tu crédito legalizado). Sin ese pago SIGA no te deja inscribir asignaturas. Luego abre SIGA Académico, escribe tu usuario corto en <b>ID Usuario</b> (1) y tu contraseña institucional en <b>Contraseña</b> (2), y haz clic en <b>Conectar</b> (3).",warn:"Sin el pago de la matrícula no puedes inscribir asignaturas.",img:["siga-login","Ingreso a SIGA Académico. ID Usuario, Contraseña y Conectar.",[[32.6,41.9,31.4,6.6,1],[32.6,56.4,31.4,6.6,2],[43.3,80.8,9.9,5.4,3]]],link:["Abrir SIGA","https://sigaacademico.unisabana.edu.co"]},
 {t:"Ve al Autoservicio",s:"Autoservicio",d:"En la página principal busca el bloque <b>Inscripción de Asignaturas</b> y haz clic en <b>Inscripción de Cursos</b>. Ahí se mantiene tu carrito de compras.",route:["Autoservicio","Inscripción de Asignaturas","Inscripción de Cursos"],img:["siga-inicio","Inicio de SIGA. Bloque Inscripción de Asignaturas, Inscripción de Cursos.",[[35.5,57.4,10.5,3.2,1]]]},
 {t:"Escribe el número de clase",s:"Número de clase",d:"En el carrito, en el campo <b>Introducción Nº Clase</b>, escribe el número de la clase que vas a inscribir y haz clic en <b>añadir</b>.",img:["siga-carrito","Carrito de compras en SIGA. Escribe el número de clase y haz clic en añadir.",[[2,71,24,10,1]]],m:`${bar("Carrito de Compras Inscripción")}<div class="body"><b>Añadir Clases a Carrito Compra</b><div class="field">Introducción Nº Clase <span class="inp">1066</span><span class="b hl">añadir</span></div></div>`},
 {t:"Confirma las preferencias",s:"Preferencias",d:"Verás los datos de la clase (sesión, horario, aula, profesor). Revísalos y haz clic en <b>Siguiente</b>. La clase quedará en tu carrito.",m:`${bar("Selección de Clases para Añadir")}<div class="body"><span>Estado: <span class="dot"></span> Abierta · Unidades 3,00</span><div class="field"><span class="inp" style="min-width:0">Cancelar</span><span class="b hl">Siguiente</span></div><span class="okmsg">✓ La clase se ha añadido a su carrito de compra.</span></div>`},
 {t:"Repite con cada asignatura",s:"Repetir",d:"Vuelve al paso 3 y añade una a una todas las clases de tu horario. Cada clase aparecerá en la tabla del carrito con su estado (círculo verde si está abierta)."},
 {t:"Selecciona y pulsa Inscripción",s:"Inscripción",d:"Marca la casilla de <b>todas</b> las clases del carrito y haz clic en el botón <b>Inscripción</b>.",m:`${bar("Carrito Compras")}<div class="body"><div class="tbl-wrap"><table><tr><th>Sel.</th><th>Clase</th><th>Unid.</th><th>Estado</th></tr><tr><td>☑</td><td>2186101</td><td>2,00</td><td><span class="dot"></span></td></tr><tr><td>☑</td><td>2186102</td><td>2,00</td><td><span class="dot"></span></td></tr><tr><td>☑</td><td>2186104</td><td>3,00</td><td><span class="dot"></span></td></tr></table></div><div class="field"><span class="inp" style="min-width:0">eliminar</span><span class="b hl">inscripción</span></div></div>`},
 {t:"Finalizar inscripción (primer clic)",s:"Primer clic",d:"En <b>Confirmación de Clases</b> revisa el listado y haz clic por primera vez en <b>Finalizar Inscripción</b>."},
 {t:"Marca solo la electiva y vuelve a finalizar",s:"Electiva y segundo clic",d:"Si tu plan incluye una <b>electiva</b>, marca la casilla de elección <b>únicamente en la electiva</b>. En las demás asignaturas no marques nada. Luego haz clic por segunda vez en <b>Finalizar Inscripción</b>.",warn:"Marcar la casilla en una asignatura que no es electiva puede dejarla mal registrada."},
 {t:"Verifica el resultado",s:"Verificar",d:"En <b>Consulta de Resultados</b> cada clase debe tener un visto verde. Si alguna muestra una X roja, no quedó inscrita. Desde aquí puedes ver <b>Mi horario de clases</b> o ir a <b>Realizar pago</b>.",m:`${bar("Introducción de Clases · Consulta de Resultados")}<div class="body"><div class="tbl-wrap"><table><tr><th>Clase</th><th>Mensaje</th><th>Estado</th></tr><tr><td>2186101</td><td>Correcto: esta clase ya se ha añadido a su horario.</td><td class="okmsg">✓</td></tr><tr><td>2186104</td><td>Correcto: esta clase ya se ha añadido a su horario.</td><td class="okmsg">✓</td></tr></table></div></div>`}
];
let cur=0; const seen=new Set([0]);
$("#stepList").innerHTML=ins.map((x,i)=>`<li><button type="button" role="tab" id="st${i}" aria-selected="${i===0}"><span>${esc(x.s)}</span></button></li>`).join("");
function renderStep(){
  const x=ins[cur];
  $$("#stepList button").forEach((b,i)=>{b.setAttribute("aria-selected",String(i===cur));b.classList.toggle("seen",seen.has(i)&&i!==cur)});
  $("#stepPanel").innerHTML=`<div class="step-head"><span class="num">${String(cur+1)}</span><div><span class="eyebrow">Paso ${cur+1} de ${ins.length}</span><h3>${esc(x.t)}</h3></div></div>
  <div class="step-bar" aria-hidden="true"><i style="width:${(cur+1)/ins.length*100}%"></i></div>
  <p>${x.d}</p>${x.route?route(x.route):""}${x.warn?`<div class="callout"><b>Ojo:</b> ${esc(x.warn)}</div>`:""}${x.img?`<figure class="shot"><button type="button" class="shot-btn" data-zoom="${x.img[0]}" data-cap="${esc(x.img[1])}" data-hot='${JSON.stringify(x.img[2])}' aria-label="Ampliar"><span class="shot-img"><img src="/img/fin/${x.img[0]}.webp?v=9"${window.FIN?window.FIN.wh(x.img[0]):""} alt="${esc(x.img[1])}" loading="lazy">${x.img[2].map(h=>`<i class="hot has-n${h[2]>80?" n-in":h[0]<7?" n-right":""}" data-n="${h[4]||1}" style="left:${h[0]}%;top:${h[1]}%;width:${h[2]}%;height:${h[3]}%"></i>`).join("")}</span></button><figcaption>${esc(x.img[1])}</figcaption></figure>`:x.m?`<div class="mock" aria-hidden="true">${x.m}</div>`:""}${x.link?`<div><a class="btn ghost" href="${x.link[1]}" target="_blank" rel="noopener">${esc(x.link[0])} ↗</a></div>`:""}
  <div class="nav"><button class="btn ghost" type="button" id="prevS" ${cur===0?"disabled":""}>← Anterior</button><button class="btn" type="button" id="nextS">${cur===ins.length-1?"Volver al inicio":"Siguiente →"}</button></div>`;
  $("#prevS").onclick=()=>{if(cur>0){cur--;seen.add(cur);renderStep()}};
  $("#nextS").onclick=()=>{cur=cur===ins.length-1?0:cur+1;seen.add(cur);renderStep()};
}
$("#stepList").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;cur=+b.id.slice(2);seen.add(cur);renderStep()});
renderStep();

/* ---------- Trámites ---------- */
const G=["Trámites","Petición de Trámites"];
const who={cf:"Comisión de Facultad",dp:"Dirección de Programa",de:"Dirección de Estudiantes de la Facultad",ea:"Coordinación de Éxito Académico"};
const T=[
 {id:"recuperatoria",n:"Evaluación recuperatoria",when:"Si tu nota definitiva en una asignatura quedó entre 3,0 y 3,4.",r:[...G,"SOLICITUD EVALUACIÓN RECUPERATORIA"],w:"cf",tags:[["warn","Con costo"],["blue","En el mismo periodo"]],
  f:[["Solicita por SIGA","Argumenta y adjunta soportes."],["La Comisión de Facultad estudia","Según tu historial académico y disciplinario."],["Recibes respuesta","Por el sistema."],["Si se aprueba, pagas","Se genera el recibo de derechos, que pagas en la fecha establecida."]],
  k:["Se puede aprobar o rechazar.","La nota de la recuperatoria es la definitiva. Con 3,5 o más apruebas. Si no, repites la asignatura.","Debe pedirse dentro del periodo en que cursaste la asignatura."]},
 {id:"supletorio",n:"Examen supletorio",when:"Si no pudiste presentar una evaluación parcial o final por una situación grave o imprevista.",r:[...G,"SOLICITUD SUPLETORIO"],w:"cf",tags:[["bad","3 días calendario"],["warn","Con costo"]],
  f:[["Solicita por SIGA","Argumenta y adjunta soportes según el caso."],["La Comisión de Facultad estudia","Según tu historial académico y disciplinario."],["Recibes respuesta","Por el sistema."],["Si se aprueba, pagas","Se genera el recibo de derechos del supletorio."]],
  k:["Plazo: dentro de los 3 días calendario siguientes a la fecha de la evaluación.","Solo por causa justificada y sin haber superado el 25 % de inasistencias.","Se puede aprobar o rechazar."]},
 {id:"aplazamiento",n:"Aplazamiento de asignaturas",when:"Si quieres aplazar una asignatura que estás cursando. Solo antes de transcurrido el 25 % de la misma.",r:[...G,"APLAZAMIENTO DE ASIGNATURAS"],w:"dp",tags:[["bad","Antes del 25 %"],["ok","Sin costo al cursarla"]],
  f:[["Solicita por SIGA","Argumenta y adjunta soportes."],["La Dirección de Programa estudia","Según tu historial académico."],["Recibes respuesta","Por el sistema."],["Si se aprueba","La asignatura sale de tu horario."]],
  k:["Solo puedes aplazar una asignatura en todo tu plan de estudios.","Sigue asistiendo hasta que te confirmen la aprobación.","Cuando la curses, no pagas sus créditos."]},
 {id:"cancelacion",n:"Cancelación de asignaturas",when:"Si quieres cancelar una asignatura que estás cursando, antes de haber cursado el 25 % y siempre que no la estés repitiendo.",r:[...G,"SOLICITUD CANCELACIÓN ASIGNATURAS"],w:"dp",tags:[["bad","Antes del 25 %"],["warn","Pagas al cursarla"]],
  f:[["Solicita por SIGA","Argumenta y adjunta soportes según el caso."],["La Dirección de Programa estudia","Según tu historial académico."],["Recibes respuesta","Por el sistema."],["Si se aprueba","La asignatura sale de tu horario."]],
  k:["Sigue asistiendo hasta que te confirmen la aprobación.","Cuando la vuelvas a cursar, pagas sus créditos.","Se puede aprobar o rechazar."]},
 {id:"reserva",n:"Reserva de cupo",imgH:"Así se ve el paso 6 en SIGA",img:{src:"tr-devol",cap:"Finanzas del Alumnado › Sol. Devoluciones y Acumulados. 1 Ingresar Solicitud. 2 Revisar Solicitudes.",hot:[[24.5,89,25.9,2.9,1],[53.9,89,26.9,2.9,2]]},when:"Si eres estudiante antiguo y debes aplazar tus estudios el siguiente semestre. La reserva es por máximo un año.",r:[...G,"SOLICITUD RESERVA DE CUPO"],w:"dp",tags:[["blue","Máximo 1 año"]],
  f:[["Solicita por SIGA","Argumenta y adjunta soportes."],["La Dirección de Programa estudia","Según tu historial académico y disciplinario."],["Atiende los paz y salvos","Consulta la solicitud en SIGA hasta que todas las unidades los den."],["Recibes respuesta","Por el sistema."],["Si ya pagaste el semestre","Indica en el trámite si pides devolución o acumulado. Te adjuntan un memorando para Financiación Universitaria."],["Envía el memorando","Por SIGA, en Finanzas del Alumnado › Sol. Devoluciones y Acumulados."]],
  k:["Ruta del paso 6 en la página de inicio de SIGA: Finanzas del Alumnado › Sol. Devoluciones y Acumulados. Adjunta documentos escaneados (no fotografías) en .pdf, .doc, .docx, .jpg o .gif de máximo 10 MB.","Financiación Universitaria decide si aplica el acumulado o la devolución y su porcentaje.","Se puede aprobar o rechazar."]},
 {id:"cancelsem",n:"Cancelación de semestre y reserva de cupo",when:"Si debes cancelar el semestre en curso por una circunstancia grave o imprevista y vas a volver dentro del año siguiente.",r:[...G,"CANCELACIÓN DE SEMESTRE Y RESERVA DE CUPO"],w:"de",tags:[["blue","Regreso en máximo 1 año"]],
  f:[["Solicita por SIGA","Argumenta y adjunta soportes según el caso."],["Atiende los paz y salvos","Consulta la solicitud en SIGA hasta que finalicen."],["Recibes la decisión","La Dirección de Estudiantes de la Facultad aprueba o rechaza y te notifica por el sistema."]],
  k:["Puedes pedir devolución o acumulado de la matrícula en SIGA, Finanzas del Alumnado › Sol. Devoluciones y Acumulados. Financiación Universitaria decide si aplica y el porcentaje.","Para volver (en no más de un año) debes hacer el trámite de reintegro.","Recuerda: si dejas de asistir sin hacer este trámite, tus asignaturas se califican con 0,0."]},
 {id:"reintegro",n:"Reintegro",when:"Si quieres retomar tus estudios después de uno o máximo dos semestres de haber reservado cupo.",r:[...G,"SOLICITUD REINTEGRO"],w:"dp",tags:[["warn","Con costo"]],
  f:[["Solicita por SIGA","Indica el ciclo en que te reintegras y adjunta soportes."],["La Dirección de Programa estudia","Según tu historial académico."],["Recibes respuesta","Por el sistema."],["Si se aprueba, pagas","Se genera el recibo de derechos de reintegro."],["Recibo de matrícula","Confirmado el pago, se genera tu recibo de matrícula."]],
  k:["Se puede aprobar o rechazar.","El reintegro queda sujeto al plan de estudios vigente."]},
 {id:"homologacion",n:"Homologación de asignaturas",when:"Si eres graduado de un posgrado de esta u otra universidad y quieres homologar asignaturas de tu plan de estudios.",r:[...G,"SOLICITUD CONVALIDACIONES"],w:"dp",tags:[["blue","Máximo 50 % del plan"],["ok","Interna sin costo"],["warn","Externa con costo"]],
  f:[["Solicita por SIGA","Argumenta y adjunta soportes."],["La Dirección de Programa estudia","Según los soportes presentados."],["Recibes respuesta","Por el sistema."],["Si se aprueba","No cursas esas asignaturas."]],
  k:["Adjunta los contenidos programáticos y las notas del posgrado cursado.","Indica con claridad qué asignaturas quieres homologar.","Se homologa como máximo el 50 % de las asignaturas del plan.","Si la homologación es interna (asignaturas cursadas en la Universidad de La Sabana), no se cobra. Si es externa (asignaturas cursadas en otra universidad), sí tiene un costo."]},
 {id:"prueba",n:"Periodo de prueba",when:"Si tu promedio acumulado quedó por debajo de 3,5 y quieres continuar el siguiente semestre.",r:[...G,"SOLICITUD PERIODO DE PRUEBA"],w:"cf",tags:[["warn","Promedio menor a 3,5"]],
  f:[["Solicita por SIGA","Argumenta y adjunta soportes."],["La Comisión de Facultad estudia","Según tu historial académico y disciplinario."],["Recibes respuesta","Por el sistema, o la Facultad te cita para entregártela."]],
  k:["Está atento a tu correo y celular.","Se puede aprobar o rechazar."]},
 {id:"creditos",n:"Matrícula por créditos",when:"Si te faltan créditos obligatorios o electivos, si no puedes tomar matrícula completa por un motivo justificado, o si estás en periodo de prueba y debes cursar menos créditos.",mail:true,w:"ea",tags:[["blue","Por correo"]],
  f:[["Escribe a la Facultad","A posgradosfacultad.derecho@unisabana.edu.co, argumentando y con soportes."],["Recibes respuesta","Por el mismo medio."],["Si se aprueba","Registro Académico ajusta tu carga y Financiación Universitaria emite el recibo ajustado."]],
  k:["Antes de solicitarla, asesórate con la Coordinación de Éxito Académico sobre tu ubicación semestral, número de créditos y viabilidad del trámite."]}
];
const GUIA={"recuperatoria": "2doxzmtnps/web/Evaluacio%CC%81n%20Recuperatoria.png?v=476f69a9-5e0a-45e2-adbc-378afabf8d39", "supletorio": "lqo4zlgbal/web/Exa%CC%81men%20supletorio.png?v=9ec3258a-6765-4b1a-9d22-624312053059", "aplazamiento": "cjcgrrwuml/web/Aplazamiento%20de%20asignaturas.png?v=1c7d54ef-f222-47c3-8d95-66fe8faeba71", "cancelacion": "hborsas5oe/web/Cancelacio%CC%81n%20de%20asignaturas.png?v=d47933eb-aeb2-415f-9e6d-20de6af70ee8", "reserva": "pt4tipmkku/web/Reserva%20de%20cupo.png?v=b7b1db81-3ca0-47a0-b5a1-d8c7adfb814b", "cancelsem": "o0e3zwdrgn/web/Cancelacio%CC%81n%20de%20semestre%20y%20reserva%20de%20cupo.png?v=6932de16-9502-477f-a066-b8e53cd188c4", "reintegro": "7dmplkt66x/web/Reintegro.png?v=075247de-f099-46a9-a73f-e390ad0c0d93", "homologacion": "f0frng9d10/web/Homologacio%CC%81n%20de%20asignaturas.png?v=fe301e3d-031a-4637-bbeb-2f769f5422da", "prueba": "pzmkofrlz2/web/Peri%CC%81odo%20de%20prueba.png?v=41ce7e61-ea18-442b-86f1-68e08265c7a0", "creditos": "e5irg12vij/web/Matri%CC%81cula%20por%20cre%CC%81ditos.png?v=72b3a82b-3857-4e5e-90ec-cc9ee66fcaa1"};

/* ---------- Radicar un trámite en SIGA ---------- */
const RS=[
 {s:"Petición de Trámites",t:"Ingresa a SIGA y entra a Petición de Trámites",intro:"Abre sigaacademico.unisabana.edu.co. Entras con tus credenciales institucionales.",acts:["Escribe tu usuario corto en <b>ID Usuario</b>.","Escribe tu contraseña institucional en <b>Contraseña</b>.","Haz clic en <b>Conectar</b>.","En la página de inicio, busca el bloque <b>Trámites</b> y haz clic en <b>Petición de Trámites</b>."],img:[{src:"siga-login",cap:"Ingreso a SIGA Académico. ID Usuario, Contraseña y Conectar.",hot:[[32.6,41.9,31.4,6.6,1],[32.6,56.4,31.4,6.6,2],[43.3,80.8,9.9,5.4,3]]},{src:"siga-inicio",cap:"Inicio de SIGA. Bloque Trámites, Petición de Trámites.",hot:[[35.6,40.6,10.2,2.6,4]]}]},
 {s:"Grado y programa",t:"Elige tu grado y tu programa",intro:"Se abre la pantalla <b>Trámite de Solicitudes</b>. La institución y el ciclo lectivo se llenan solos.",acts:["En <b>Grado Académico</b> elige <b>Posgrado</b>.","En <b>Programa Académico</b> elige tu programa.","Haz clic en la lupa del campo <b>Trámite</b> para ver la lista de trámites."],img:[{src:"tr-form",cap:"Trámite de Solicitudes. Grado académico, programa y lupa de Trámite.",hot:[[23,31.1,27.3,2.7,1],[23,34.2,27.3,2.7,2],[23,40.7,11.2,2.7,3]]}]},
 {s:"Busca el trámite",t:"Busca y elige el trámite",intro:"Se abre la ventana <b>Consultar Trámite</b> con los trámites disponibles para tu programa. La lista puede ser distinta a la de la imagen.",acts:["Si la lista es larga, cambia <b>Buscar por</b> a Descripción, escribe el comienzo del nombre (por ejemplo, SOLICITUD REINTEGRO) y haz clic en <b>Consultar</b>.","Haz clic en el código del trámite que necesitas. Usa el nombre exacto que aparece en esta guía."],img:[{src:"tr-lista",cap:"Consultar Trámite. Búsqueda y lista de trámites (ejemplo).",hot:[[20.7,4.4,63.1,3,1],[0.9,35.4,78.6,2.5,2]]}]},
 {s:"Lee los requisitos",t:"Revisa el trámite y lee sus requisitos",intro:"Al elegir el trámite, SIGA muestra su nombre y los requisitos. El ejemplo es un reintegro. Cada trámite tiene sus propios requisitos.",acts:["Confirma que el nombre que aparece junto al código es el trámite que quieres.","Lee completos los <b>Requisitos para el trámite seleccionado</b>. Ahí se explica qué debes adjuntar y si tiene costo.","Si aparece <b>Información Adicional</b>, complétala (por ejemplo, el ciclo en que te reintegras o la asignatura del supletorio)."],img:[{src:"tr-requisitos",cap:"Trámite elegido, requisitos e información adicional (ejemplo de reintegro).",hot:[[23,40.7,30.6,2.7,1],[3.5,50.2,56.5,30.5,2],[3.5,82.4,60,5.5,3]]}]},
 {s:"Argumenta y adjunta",t:"Argumenta, adjunta soportes y genera la solicitud",intro:"Antes de enviar, ten tus soportes escaneados en PDF. Una solicitud sin argumentos o sin soportes puede ser rechazada.",acts:["Completa la información adicional si el trámite la pide.","En <b>Detalle Trámite</b> explica con claridad qué pides y por qué.","Haz clic en <b>Añadir Anexo</b> para subir cada soporte. Con el botón <b>+</b> agregas otra fila para más archivos.","Revisa todo y haz clic en <b>Generar Solicitud</b>."],img:[{src:"tr-enviar",cap:"Información adicional, detalle, anexos y Generar Solicitud.",hot:[[4.2,56.3,57,3.4,1],[4.2,63.8,57.9,14.7,2],[64.6,87.9,11.2,2.9,3],[5.9,93.6,16,3.2,4]]}]},
 {s:"Seguimiento",t:"Haz seguimiento al estado",intro:"La respuesta llega por el sistema. Revisa el estado en la página de inicio de SIGA, bloque <b>Trámites</b> › <b>Consulta de Trámites</b>.",acts:["Escribe <b>Fecha Inicial</b> y <b>Fecha Final</b> (mes/día/año). Son obligatorias. Si las dejas vacías, SIGA muestra un error.","Haz clic en <b>Consultar</b>.","Revisa la columna <b>Estado</b>. Por ejemplo, EN TRÁMITE, APROBADA, RECHAZADA o FINALIZADO."],img:[{src:"tr-consulta",cap:"Consulta de Trámites. Fechas, Consultar y estado de cada solicitud.",hot:[[26.5,46.8,35,2.7,1],[53.4,56.3,12.2,2.7,2],[51.7,62.5,14.4,37.5,3]]}]}
];
let rc=0; const rseen=new Set([0]);
const rList=$("#rStepList"), rPanel=$("#rStepPanel");
if(rList&&rPanel){
 rList.innerHTML=RS.map((x,i)=>`<li><button type="button" role="tab" data-rs="${i}" aria-selected="${i===0}"><span>${esc(x.s)}</span></button></li>`).join("");
 const renderR=()=>{const x=RS[rc],nx=RS[rc+1];
  $$("#rStepList button").forEach((b,i)=>{b.setAttribute("aria-selected",String(i===rc));b.classList.toggle("seen",rseen.has(i)&&i!==rc)});
  rPanel.innerHTML=`<div class="step-head"><span class="num">${rc+1}</span><div><span class="eyebrow">Paso ${rc+1} de ${RS.length}</span><h3>${esc(x.t)}</h3></div></div>
  <div class="step-bar" aria-hidden="true"><i style="width:${(rc+1)/RS.length*100}%"></i></div>
  <div class="cbody"><p>${x.intro}</p><div class="acts-box"><ol class="acts">${x.acts.map((a,i)=>`<li><span class="an">${i+1}</span><span>${a}</span></li>`).join("")}</ol></div>${window.FIN?x.img.map((im,i)=>window.FIN.figure(im,i)).join(""):""}</div>
  <div class="nav"><button class="btn ghost" type="button" data-rnav="-1" ${rc===0?"disabled":""}>← Anterior</button><button class="btn" type="button" data-rnav="1">${nx?`Siguiente: ${esc(nx.s)} →`:"Volver al inicio ↺"}</button></div>`;};
 document.addEventListener("click",e=>{const b=e.target.closest("[data-rs],[data-rnav]");if(!b)return;
  if(b.dataset.rs!==undefined)rc=+b.dataset.rs;else rc=+b.dataset.rnav>0?(rc===RS.length-1?0:rc+1):Math.max(0,rc-1);
  rseen.add(rc);renderR();if(b.dataset.rnav!==undefined)rPanel.scrollIntoView({behavior:"smooth",block:"nearest"});});
 renderR();
}
const tabs=$("#tramTabs");
tabs.innerHTML=T.map((t,i)=>`<button type="button" role="tab" id="tt-${t.id}" aria-selected="${i===0}">${esc(t.n)}</button>`).join("");
const whoIcon=`<svg><use href="#i-people"/></svg>`;
function tramHTML(t,withId){
  return `<article class="tram"${withId?' id="tram-card"':''}>
   <div class="tram-top"><div style="min-width:0;flex:1 1 380px"><span class="eyebrow">Trámite</span><h3>${esc(t.n)}</h3><p class="when">${esc(t.when)}</p></div><div class="meta">${t.tags.map(g=>`<span class="tag ${g[0]}">${esc(g[1])}</span>`).join("")}${withId?`<button class="btn ghost sm" type="button" data-link="tramite-${t.id}"><svg><use href="#i-link"/></svg>Copiar enlace</button>`:""}</div></div>
   ${t.mail?`<div class="siga"><span class="lbl">CORREO</span><span class="last">posgradosfacultad.derecho@unisabana.edu.co</span></div>`:route(t.r)}
   <ol class="flow">${t.f.map((s,i)=>`<li><b>${esc(s[0])}</b><span>${esc(s[1])}${i===0&&!t.mail?` <a href="#radicar">Ver cómo ↑</a>`:""}</span></li>`).join("")}</ol>
   ${t.img&&window.FIN?`<div class="tram-shot"><p class="tram-shot-h">${esc(t.imgH||"Así se ve en SIGA")}</p>${window.FIN.figure(t.img,0)}</div>`:""}
   <div class="tram-foot"><div class="callout"><b>Ten en cuenta</b><ul>${t.k.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
   <div class="card" style="display:grid;gap:10px;align-content:start"><div class="who">${whoIcon}<span>Decide: <b>${who[t.w]}</b></span></div>
   ${GUIA[t.id]?`<a href="https://usabana.widen.net/content/${GUIA[t.id]}" target="_blank" rel="noopener">Guía oficial de este trámite ↗</a>`:""}
   <span class="muted" style="font-size:.88rem">¿Dudas? Escribe a la Coordinación de Éxito Académico.</span>
   <div class="contact"><span class="k">Correo</span><span class="v">posgradosfacultad.derecho@unisabana.edu.co</span><button class="copy" type="button" data-copy="posgradosfacultad.derecho@unisabana.edu.co">Copiar</button></div></div></div>
  </article>`;
}
function renderTram(id,flash,push){
  const t=T.find(x=>x.id===id)||T[0];
  $$("#tramTabs button").forEach(b=>b.setAttribute("aria-selected",String(b.id==="tt-"+t.id)));
  $("#tramPanel").innerHTML=tramHTML(t,true);
  if(push){try{history.replaceState(null,"","#tramite-"+t.id)}catch(e){}}
  if(flash){const c=$("#tram-card");c.classList.remove("hl-flash");void c.offsetWidth;c.classList.add("hl-flash")}
}
tabs.addEventListener("click",e=>{const b=e.target.closest("button");if(b)renderTram(b.id.slice(3),false,true)});
renderTram(T[0].id);

/* ---------- Asistente ¿Qué hago si…? ---------- */
const S=[
 ["Saqué entre 3,0 y 3,4 en una asignatura","recuperatoria","Puedes pedir una evaluación recuperatoria. Hazlo por SIGA dentro del mismo periodo académico. Tiene un costo y su nota será la definitiva."],
 ["Saqué menos de 3,0 en una asignatura",null,"Con una nota definitiva entre 0,0 y 2,9 debes volver a cursar la asignatura. No hay recuperatoria en ese rango. Habla con la Coordinación de Éxito Académico para planear tu siguiente periodo.",[["Ver escala de notas","#reglamento"]]],
 ["No pude presentar un examen por una situación grave","supletorio","Solicita un examen supletorio por SIGA. Tienes solo 3 días calendario desde la fecha de la evaluación y no debes superar el 25 % de inasistencias."],
 ["No estoy de acuerdo con una nota",null,"Presenta una revisión (reclamo) por escrito en SIGA, con justificación, dentro de los 3 días calendario siguientes a la publicación de la nota. La segunda calificación será la definitiva.",[["Reglas de evaluación","#reglamento"]]],
 ["Quiero dejar una asignatura que estoy cursando","aplazamiento","Tienes dos caminos y ambos deben pedirse antes del 25 % de la asignatura. El aplazamiento solo se usa una vez en todo el plan, pero no pagas los créditos al cursarla. La cancelación se puede usar más veces, pero sí pagas los créditos después.",[["Comparar ambos","#reglamento"]],"cancelacion"],
 ["Necesito parar el próximo semestre","reserva","Pide reserva de cupo por SIGA. La reserva dura máximo un año y luego debes pedir reintegro."],
 ["Debo retirarme del semestre que estoy cursando","cancelsem","Pide cancelación de semestre y reserva de cupo. No dejes de asistir sin hacer el trámite, porque tus asignaturas quedarían en 0,0."],
 ["Reservé cupo y quiero volver","reintegro","Pide el reintegro por SIGA indicando el ciclo en que regresas. Si se aprueba, pagas los derechos de reintegro y luego se genera tu recibo de matrícula."],
 ["Ya cursé materias en otro posgrado","homologacion","Pide la homologación por SIGA con contenidos programáticos y notas. Se puede homologar hasta el 50 % del plan. Si es interna no se cobra. Si es externa, sí tiene un costo."],
 ["Mi promedio acumulado bajó de 3,5","prueba","Perdiste el derecho de permanencia, pero puedes pedir un periodo de prueba por SIGA. La Comisión de Facultad decide."],
 ["No puedo tomar la carga completa de créditos","creditos","Solicita matrícula por créditos por correo a la Facultad. Antes, asesórate con la Coordinación de Éxito Académico."],
 ["Necesito financiar mi matrícula",null,"Compara las líneas de crédito y sigue el paso a paso de la solicitud, con las pantallas de la plataforma oficial. Hazlo con tiempo, porque sin la matrícula pagada o el crédito legalizado no puedes inscribir asignaturas.",[["Paso a paso del crédito","#pasoapaso"],["Cómo pagar la matrícula","#pagos"]]],
 ["No sé cómo inscribir mis materias",null,"Primero verifica que tu matrícula esté pagada, porque sin ese pago no puedes inscribir asignaturas. Luego sigue la guía de inscripción paso a paso con los números de clase que deseas inscribir (4 dígitos).",[["Ir a la guía","#inscripcion"],["Cómo pagar","#pagos"]]],
 ["No me deja inscribir materias",null,"La causa más común es que la matrícula no está pagada o el crédito aún no está legalizado. Revisa tu orden de matrícula en SIGA y, si ya pagaste, escribe a la Coordinación de Éxito Académico.",[["Cómo pagar","#pagos"],["Estado de mi crédito","#states"]]]
];
$("#situations").innerHTML=S.map((s,i)=>`<button type="button" aria-pressed="${i===0}" data-i="${i}">${esc(s[0])}</button>`).join("");
function renderAns(i){
  const s=S[i]; $$("#situations button").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.i===i)));
  const t=s[1]?T.find(x=>x.id===s[1]):null, t2=s[4]?T.find(x=>x.id===s[4]):null;
  let acts="";
  if(t)acts+=`<button class="btn" type="button" data-open="${t.id}">Ver trámite: ${esc(t.n)}</button>`;
  if(t2)acts+=`<button class="btn" type="button" data-open="${t2.id}">Ver trámite: ${esc(t2.n)}</button>`;
  (s[3]||[]).forEach(a=>acts+=`<a class="btn ghost" href="${a[1]}">${esc(a[0])}</a>`);
  $("#answer").innerHTML=`<span class="eyebrow">Te recomendamos</span><h4>${t?esc(t.n):"Qué debes hacer"}</h4><p>${esc(s[2])}</p>${t&&!t.mail?route(t.r):""}<div class="actions">${acts}</div>`;
}
$("#situations").addEventListener("click",e=>{const b=e.target.closest("button");if(b)renderAns(+b.dataset.i)});
$("#answer").addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(!b)return;renderTram(b.dataset.open,true,true);$("#tramTabs").scrollIntoView({behavior:"smooth",block:"start"})});
renderAns(0);
document.addEventListener("click",e=>{const a=e.target.closest("a[data-tram]");if(!a)return;e.preventDefault();renderTram(a.dataset.tram,true);$("#tramTabs").scrollIntoView({behavior:"smooth",block:"start"})});

/* ---------- Directorio ---------- */
const D=[
 {t:"Facultad de Estudios Jurídicos, Políticos e Internacionales",u:"Posgrados · Dirección de Estudiantes",c:[["Correo","posgradosfacultad.derecho@unisabana.edu.co",1],["Correo","posfacderecho@unisabana.edu.co",1]],q:"facultad posgrados correo dirección estudiantes"},
 {t:"Coordinación de Éxito Académico",u:"Trámites, créditos, permanencia y asesoría",c:[["Celular","323 305 2257",1],["Correo","posgradosfacultad.derecho@unisabana.edu.co",1]],q:"éxito académico coordinación trámites asesoría celular"},
 {t:"Gestión logística",u:"Apoyo logístico de los programas",c:[["Sonia Ramírez","310 249 4107",1]],q:"gestora logística Sonia Ramírez celular"},
 {t:"Atención general Universidad",u:"Contact center y canales generales",c:[["Teléfono","(601) 861 5555 · 861 6666"],["WhatsApp","+57 320 516 4838",1]],q:"contact center teléfono whatsapp universidad"},
 {t:"Registro Académico",u:"Edificio O, módulo 26 · L a V 8:00 a. m. a 5:00 p. m.",c:[["Certificados","Ext. 33316"],["Correo","registro.academico@unisabana.edu.co",1]],q:"registro académico certificados correo"},
 {t:"Tecnología (Service Desk)",u:"Edificio E1, piso 1",c:[["Teléfono","861 5555 ext. 34444"],["Correo","service.desk@unisabana.edu.co",1]],q:"tecnología service desk soporte"},
 {t:"Bienestar y Experiencia del Estudiante",u:"Deportes, cultura, salud y más",c:[["Teléfono","861 5555 ext. 20251"],["Centro Médico","861 5555 ext. 20222 · Sábados de 8:00 a. m. a 2:00 p. m."],["Correo","experiencia.bienestar@unisabana.edu.co",1]],q:"bienestar centro médico salud"},
 {t:"Biblioteca",u:"Octavio Arizmendi Posada",c:[["WhatsApp","310 221 2065",1]],q:"biblioteca whatsapp"},
 {t:"ILFARUS",u:"Asesoría personal y familiar",c:[["Teléfono","861 5555 ext. 43200"],["Celular","315 307 9039",1],["Correo","consultorio.asesoria@unisabana.edu.co",1]],q:"ilfarus familia asesoría"}
];
$("#dir").innerHTML=D.map(d=>`<article class="card" data-search="${esc(d.t+" "+d.u+" "+d.q+" "+d.c.map(c=>c[1]).join(" "))}"><h3>${esc(d.t)}</h3><p class="unit">${esc(d.u)}</p>${d.c.map(c=>`<div class="contact"><span class="k">${esc(c[0])}</span><span class="v">${esc(c[1])}</span>${c[2]?`<button class="copy" type="button" data-copy="${esc(c[1].replace(/^\+57 /,"").replace(/\s/g,c[1].includes("@")?"":""))}">Copiar</button>`:""}</div>`).join("")}</article>`).join("");

/* ---------- FAQ ---------- */
const F=[
 ["¿Cuándo recibo mi usuario y contraseña?","Cuando legalizas tu situación financiera o pagas la orden de matrícula. Llegan al correo personal que registraste en la admisión."],
 ["¿Puedo inscribir materias sin haber pagado la matrícula?","No. En posgrado debes tener la orden de matrícula pagada (o tu crédito legalizado) antes de inscribir asignaturas. Paga o solicita tu crédito con tiempo."],
 ["¿Dónde consulto mis notas?","En la página de inicio de SIGA Académico, bloque Información Académica › Mis Notas Parciales. Tus notas finales y tu promedio están en el bloque Historia Académica (Mis Notas Definitivas y Estado, Promedio y Semestre)."],
 ["¿Cuál es la nota para aprobar?","3,5 sobre 5,0. Entre 3,0 y 3,4 puedes pedir evaluación recuperatoria. Por debajo de 3,0 repites la asignatura."],
 ["¿Cuántas faltas puedo tener?","Debes asistir como mínimo al 75 % de las sesiones de cada asignatura. Si no, la nota es 0,0. Para pedir supletorio no puedes haber superado el 25 % de inasistencias."],
 ["¿Cómo entro al campus?","Con el código QR de tu carné digital en la App UniSabana. Si agregas tu foto al perfil, también puedes entrar con reconocimiento facial."],
 ["¿Cómo me conecto al Wi-Fi?","Conéctate a la red \"Estudiantes\" con tu usuario corto y contraseña institucional."],
 ["Me retiré de una asignatura, ¿me devuelven el dinero?","Depende del trámite. Si cancelas, pagarás los créditos al cursarla. Si aplazas (una sola vez en el plan), no. La devolución o acumulado de la matrícula aplica según la semana: 90 % o 100 % acumulado en la primera semana, 70 % o 100 % acumulado en la segunda, y nada desde la tercera."],
 ["¿Qué pasa si dejo de ir a clases sin avisar?","Si suspendes tus estudios sin hacer reserva de cupo, todas tus asignaturas inscritas se califican con 0,0. Haz siempre el trámite de cancelación de semestre o de reserva de cupo."],
 ["¿Quién me puede orientar si no sé qué trámite hacer?","La Coordinación de Éxito Académico de la Facultad: posgradosfacultad.derecho@unisabana.edu.co o 323 305 2257. También puedes solicitar un asesor académico con el formulario de la sección Acompañamiento."],
 ["¿Tengo que pagar Microsoft Office?","No. Tienes cinco licencias gratuitas de Microsoft 365, que incluyen Teams."],
 ["¿Cómo solicito un crédito para pagar mi matrícula?","En la plataforma de créditos, que es distinta a SIGA Académico (sigaacademico.unisabana.edu.co:8055/Ayudas), con tu mismo usuario de SIGA. Antes lee la política, paga la póliza de seguro de vida y prepara los documentos. En la sección Créditos y financiación tienes el paso a paso con capturas."],
 ["¿Qué diferencia hay entre No Te Detengas Especial, Tradicional y Proyéctate?","Especial exige pagar el 50 % antes de clases y difiere el resto sin intereses corrientes. Tradicional financia hasta el 100 % en cuotas durante el semestre. Proyéctate es de mediano plazo, pagas la mitad mientras estudias y la otra mitad al terminar materias. Todas exigen un codeudor distinto a ti."],
 ["¿Puedo ser mi propio codeudor?","No. En ninguna línea de crédito directo puedes ser tu propio codeudor. El codeudor siempre debe ser otra persona (familiar o externa) que resida y tenga ingresos en Colombia, no tenga reportes negativos y tenga capacidad de endeudamiento."],
 ["¿Puedo pagar la matrícula por partes?","Sí. En SIGA, en Realización de Pagos, elige Pago Parcial. El sistema exige un valor mínimo por abono."],
 ["¿Qué becas hay para posgrado?","Beca Excelencia, Beca Sabana (Talento), Pronto Pago, descuentos Alumni, Familiar, grupo de empleados y Alumno Meritorio, becas por convenio y becas para empleados. Revisa la sección Becas y descuentos."],
 ["¿Necesito certificar inglés?","Depende de tu programa. Consulta con tu director de programa si tu plan tiene requisito de inglés. Para conocer los cursos de idiomas y sus beneficios, consulta directamente con el Centro Internacional de Lenguas."]
];
$("#faqList").innerHTML=F.map(f=>`<details class="acc" data-search="${esc(f[0]+" "+f[1])}"><summary>${esc(f[0])}</summary><div class="acc-body"><p>${esc(f[1])}</p></div></details>`).join("");

/* ---------- Copiar ---------- */
document.addEventListener("click",async e=>{
  const b=e.target.closest(".copy");if(!b)return;
  const v=b.dataset.copy;
  try{await navigator.clipboard.writeText(v);b.textContent="Copiado";b.classList.add("ok");toast("Copiado: "+v)}
  catch(err){const s=b.previousElementSibling;if(s){const r=document.createRange();r.selectNodeContents(s);const sel=getSelection();sel.removeAllRanges();sel.addRange(r)}b.textContent="Seleccionado"}
  setTimeout(()=>{b.textContent="Copiar";b.classList.remove("ok")},1800);
});

/* ---------- Buscador ---------- */
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const idx=[];
function sectionOf(el){const s=el.closest("main > section");return s?s.dataset.title:""}
function titleOf(el){const h=el.querySelector("h3,h4,summary,b,.n");return h?h.textContent.trim():""}
$$("[data-search]").forEach(el=>{
  if(!el.id)el.id="s-"+Math.random().toString(36).slice(2,8);
  idx.push({el,sec:sectionOf(el),t:titleOf(el)||el.dataset.search.split(" ").slice(0,4).join(" "),txt:el.textContent.replace(/\s+/g," ").trim(),k:norm(el.dataset.search+" "+el.textContent)});
});
T.forEach(t=>idx.push({tram:t.id,sec:"Trámites",t:t.n,txt:t.when,k:norm(t.n+" "+t.when+" "+(t.r||[]).join(" ")+" "+t.f.map(x=>x.join(" ")).join(" ")+" "+t.k.join(" "))}));
if(window.FIN)window.FIN.idx.forEach(o=>idx.push(Object.assign({},o,{k:norm(o.k)})));
ins.forEach((x,i)=>idx.push({step:i,sec:"Inscripción de materias",t:`Paso ${i+1}: ${x.t}`,txt:x.d.replace(/<[^>]+>/g,""),k:norm("inscripción inscribir cursos materias "+x.t+" "+x.d)}));

function snippet(txt,terms){const n=norm(txt);let p=-1;for(const t of terms){p=n.indexOf(t);if(p>=0)break}const st=Math.max(0,p-40);let s=(st>0?"…":"")+txt.slice(st,st+130)+(txt.length>st+130?"…":"");let h=esc(s);terms.forEach(t=>{if(t.length<2)return;const re=new RegExp("("+t.split("").map(c=>c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("[\\u0300-\\u036f]?")+")","ig");h=h.replace(re,"<mark>$1</mark>")});return h}
function runSearch(input,res){
  const v=norm(input.value.trim());
  if(v.length<2){return []}
  const terms=v.split(/\s+/).filter(Boolean);
  const hits=idx.map(o=>{let sc=0;for(const t of terms){if(!o.k.includes(t))return null;sc+=norm(o.t).includes(t)?3:1}return{o,sc}}).filter(Boolean).sort((a,b)=>b.sc-a.sc).slice(0,12);
  res.innerHTML=hits.length?hits.map((h,i)=>`<a href="#" data-h="${i}" role="option"><span class="r-sec">${esc(h.o.sec)}</span><span class="r-t">${esc(h.o.t)}</span><span class="r-x">${snippet(h.o.txt,terms)}</span></a>`).join(""):`<div class="empty">No encontramos "${esc(input.value)}". Prueba con otra palabra o revisa las preguntas frecuentes.</div>`;
  return hits;
}
function go(h){
  closePalette(); $("#results").hidden=true;
  let target;
  if(h.open){target=h.open()}
  else if(h.tram){renderTram(h.tram,true,true);target=$("#tramTabs")}
  else if(h.step!=null){cur=h.step;seen.add(cur);renderStep();target=$("#inscripcion")}
  else{target=h.el;const d=target.closest("details");if(d)d.open=true;if(target.tagName==="DETAILS")target.open=true}
  target.scrollIntoView({behavior:"smooth",block:"start"});
  const fl=h.open?target:h.tram?$("#tram-card"):h.step!=null?$("#stepPanel"):target;
  fl.classList.remove("hl-flash");void fl.offsetWidth;fl.classList.add("hl-flash");
}
function wire(input,res,opts){
  let hits=[],sel=-1;
  const show=()=>{hits=runSearch(input,res);sel=-1;if(opts.inline){res.hidden=input.value.trim().length<2;input.setAttribute("aria-expanded",String(!res.hidden))}else if(input.value.trim().length<2){res.innerHTML=opts.hint}};
  input.addEventListener("input",show);
  input.addEventListener("focus",()=>{if(input.value.trim().length>1)show()});
  input.addEventListener("keydown",e=>{
    const as=$$("a[data-h]",res);
    if(e.key==="ArrowDown"&&as.length){e.preventDefault();sel=(sel+1)%as.length}
    else if(e.key==="ArrowUp"&&as.length){e.preventDefault();sel=(sel-1+as.length)%as.length}
    else if(e.key==="Enter"){e.preventDefault();if(hits.length)go(hits[Math.max(sel,0)].o);return}
    else if(e.key==="Escape"){if(opts.inline)res.hidden=true;else closePalette();return}
    as.forEach((a,i)=>a.classList.toggle("sel",i===sel));
    const s2=as[sel];if(s2)s2.scrollIntoView({block:"nearest"});
  });
  res.addEventListener("click",e=>{const a=e.target.closest("a[data-h]");if(!a)return;e.preventDefault();go(hits[+a.dataset.h].o)});
  return show;
}
const q=$("#q"),res=$("#results");
const showInline=wire(q,res,{inline:true});
document.addEventListener("click",e=>{if(!e.target.closest("#searchBox"))res.hidden=true});
$$(".chip[data-q]").forEach(c=>c.addEventListener("click",()=>{q.value=c.dataset.q;q.focus();showInline()}));

/* ---------- Paleta de búsqueda (Ctrl K) ---------- */
const pal=$("#palette"),pq=$("#pq"),pres=$("#presults");
const popular=["solicitar crédito","pagar matrícula","beca","supletorio","notas","cancelar asignatura","wifi","asesor"];
const hint=`<div class="hint">Búsquedas frecuentes:</div>`+popular.map(p=>`<a href="#" data-pop="${p}"><span class="r-t">${p}</span></a>`).join("");
const showPal=wire(pq,pres,{inline:false,hint});
pres.addEventListener("click",e=>{const a=e.target.closest("[data-pop]");if(!a)return;e.preventDefault();pq.value=a.dataset.pop;showPal();pq.focus()});
let lastFocus=null;
function openPalette(){lastFocus=document.activeElement;pal.hidden=false;document.body.style.overflow="hidden";pq.value="";pres.innerHTML=hint;setTimeout(()=>pq.focus(),20)}
function closePalette(){if(pal.hidden)return;pal.hidden=true;document.body.style.overflow="";if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true})}
pal.addEventListener("click",e=>{if(e.target===pal)closePalette()});
document.addEventListener("keydown",e=>{
  const typing=/INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if((e.key==="k"||e.key==="K")&&(e.ctrlKey||e.metaKey)){e.preventDefault();pal.hidden?openPalette():closePalette()}
  else if(e.key==="/"&&!typing){e.preventDefault();openPalette()}
  else if(e.key==="Escape"&&!pal.hidden){closePalette()}
});
if(/Mac|iPhone|iPad/.test(navigator.platform||""))$$(".search-trigger kbd").forEach(k=>k.textContent="⌘ K");

/* ---------- Avisos ---------- */
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2200)}
async function copyText(v,msg){try{await navigator.clipboard.writeText(v);toast(msg)}catch(e){toast("No se pudo copiar. Copia la dirección de la barra del navegador.")}}

/* ---------- Tema claro / oscuro ---------- */
const root=document.documentElement;
function isDark(){const a=root.getAttribute("data-theme");return a?a==="dark":matchMedia("(prefers-color-scheme: dark)").matches}
function toggleTheme(){const next=isDark()?"light":"dark";root.setAttribute("data-theme",next);try{localStorage.setItem("gp_theme",next)}catch(e){}toast(next==="dark"?"Modo oscuro activado":"Modo claro activado")}

/* ---------- Imprimir / PDF ---------- */
let openedForPrint=[];
function preparePrint(){
  $("#printTrams").innerHTML=`<h3 style="margin:8px 0 12px">Todos los trámites</h3>`+T.map(t=>tramHTML(t,false)).join("");
  const pr=$("#printRad"); if(pr&&window.FIN) pr.innerHTML=RS.map((x,i)=>`<div class="p-step"><h4>${i+1}. ${esc(x.t)}</h4><p>${x.intro}</p><div class="acts-box"><ol class="acts">${x.acts.map((a,j)=>`<li><span class="an">${j+1}</span><span>${a}</span></li>`).join("")}</ol></div>${x.img.map((im,j)=>window.FIN.figure(im,j)).join("")}</div>`).join("");
  if(window.FIN&&window.FIN.printPrep) window.FIN.printPrep();
  $$("img[loading=lazy]").forEach(i=>i.loading="eager");
  openedForPrint=$$("details.acc:not([open])");openedForPrint.forEach(d=>d.open=true);
}
async function printNow(){
  preparePrint(); toast("Preparando el PDF con todas las imágenes…");
  const imgs=$$("img").filter(i=>!i.complete);
  await Promise.race([Promise.all(imgs.map(i=>new Promise(r=>{i.addEventListener("load",r,{once:true});i.addEventListener("error",r,{once:true})}))),new Promise(r=>setTimeout(r,8000))]);
  window.print();
}
function restorePrint(){openedForPrint.forEach(d=>d.open=false);openedForPrint=[]}
window.addEventListener("beforeprint",preparePrint);
window.addEventListener("afterprint",restorePrint);

/* ---------- Compartir ---------- */
async function shareGuide(){
  const data={title:"Guía del Estudiante de Posgrado",text:"Todo lo que se dijo en la inducción de posgrado, en un solo lugar.",url:location.origin+location.pathname};
  if(navigator.share){try{await navigator.share(data);return}catch(e){if(e&&e.name==="AbortError")return}}
  copyText(data.url,"Enlace de la guía copiado");
}

/* ---------- Acciones ---------- */
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-action]");
  if(a){const act=a.dataset.action;
    if(act==="palette")openPalette();
    else if(act==="theme")toggleTheme();
    else if(act==="print"){printNow()}
    else if(act==="share")shareGuide();
    return}
  const l=e.target.closest("[data-link]");
  if(l){copyText(location.origin+location.pathname+"#"+l.dataset.link,"Enlace copiado");return}
  const tg=e.target.closest("[data-toggle-all]");
  if(tg){const box=tg.closest("section")||document;const ds=$$("details.acc",box);const open=ds.some(d=>!d.open);ds.forEach(d=>d.open=open);tg.textContent=open?(tg.dataset.toggleAll==="faq"?"Cerrar todas":"Cerrar todos"):(tg.dataset.toggleAll==="faq"?"Abrir todas":"Abrir todos")}
});

/* ---------- Enlace por sección ---------- */
$$("main > section").forEach(s=>{const h=$(".sec-head",s);if(!h)return;const b=document.createElement("button");b.type="button";b.className="btn ghost sm share-sec";b.dataset.link=s.id;b.innerHTML='<svg><use href="#i-link"/></svg>Copiar enlace a esta sección';h.appendChild(b)});

/* ---------- Enlaces directos (#tramite-…) ---------- */
function fromHash(){
  const h=decodeURIComponent(location.hash.slice(1));
  if(h.startsWith("tramite-")){const id=h.slice(8);if(T.some(t=>t.id===id)){renderTram(id,true);setTimeout(()=>$("#tramTabs").scrollIntoView({block:"start"}),60)}}
}
window.addEventListener("hashchange",fromHash);fromHash();

/* ---------- Sin conexión ---------- */
if("serviceWorker" in navigator&&location.protocol==="https:"){window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}))}
})();
