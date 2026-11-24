/* Créditos, pagos y becas · Guía del Estudiante de Posgrado FEJPI */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const route=(parts,lbl)=>`<div class="siga"><span class="lbl">${lbl||"SIGA"}</span>${parts.map((p,i)=>i===parts.length-1?`<span class="last">${esc(p)}</span>`:`${esc(p)}<span class="sep">›</span>`).join("")}</div>`;
const IMG="/img/fin/", IV="?v=8";
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
 ["Codeudor",["Siempre. Otra persona de máximo 70 años. No puedes ser tu propio codeudor","Siempre. Otra persona de máximo 70 años. No puedes ser tu propio codeudor","Siempre. Hasta 2 codeudores, de máximo 65 años. No puedes ser tu propio codeudor","Deudor solidario con estudio crediticio de ICETEX"]],
 ["Garantías",["Pagaré electrónico y póliza de seguro de vida","Pagaré electrónico y póliza de seguro de vida","Pagaré electrónico, póliza de seguro de vida semestral y formulario de asegurabilidad","Las que exija ICETEX"]],
 ["Renovación",["Nueva solicitud cada semestre","Nueva solicitud cada semestre","Renovación semestral con promedio acumulado de 3,8 o más","Renovación ante ICETEX"]],
 ["Dónde se solicita",["Plataforma de créditos","Plataforma de créditos","Plataforma de créditos","Portal de ICETEX"]]
]};
function renderCmp(){
  const t=$("#cmpTable");
  t.innerHTML=`<thead><tr><th scope="col"><span class="sr">Condición</span></th>${CMP.cols.map(c=>`<th scope="col">${c[0]==="icetex"?`<span class="cmp-h">${esc(c[1])}</span>`:`<button type="button" class="cmp-h" data-goline="${c[0]}">${esc(c[1])}</button>`}</th>`).join("")}</tr></thead><tbody>${CMP.rows.map(r=>`<tr><th scope="row">${esc(r[0])}</th>${r[1].map(v=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody>`;
}

/* ---------- Paso a paso ---------- */
const NOSELF=`<div class="callout warn-self" role="note"><b>Importante: no puedes ser tu propio codeudor.</b> El codeudor siempre debe ser otra persona (un familiar o una persona externa) que cumpla los requisitos. Si en el formulario registras tus propios datos como codeudor, la solicitud será devuelta.</div>`;
const PH=["Prepárate antes de solicitar","Solicita en la plataforma de créditos","Aprobación y firma del pagaré","Paga tus cuotas"];
const stepHot=x=>[[x-6,25,12,18,1]];
const S=[
 {id:"politica",ph:0,t:"Elige tu línea y lee la política de crédito",s:"Política de crédito",
  intro:l=>`<p>${esc(L[l].sum)}</p><p>Antes de cualquier trámite lee completa la <b>política de crédito</b> de tu línea. Allí están las condiciones, los plazos, los intereses y tus compromisos. La política es además uno de los documentos que vas a cargar, firmada por ti y por tu codeudor.</p>`,
  acts:()=>["Entra a la página de Financiación directa de posgrados.","Busca tu línea y haz clic en <b>Instructivo y documentos</b>.","Descarga la política, léela completa y fírmala."],
  img:[{src:"web-credito",cap:"Página oficial de Financiación directa. Botón Instructivo y documentos.",hot:[[63,82.5,14,8,2]]}],
  note:()=>`¿No sabes qué línea elegir? Revisa el comparador de líneas, justo debajo de este paso a paso.`,
  links:l=>[["Política de crédito",L[l].pol],["Instructivo oficial",L[l].ins],["Financiación directa",U.directa]]},
 {id:"pago50",ph:0,only:["esp"],t:"Paga el 50 % de tu matrícula",s:"Pago del 50 %",
  intro:()=>`<p>En No Te Detengas Especial debes pagar <b>como mínimo el 50 % del valor de tu matrícula al menos 30 días antes del inicio de clases</b>. El otro 50 % es el que vas a financiar. Guarda el soporte de pago porque lo cargarás en la solicitud.</p><p>La forma más rápida es el pago parcial en SIGA.</p>`,
  route:["Menú Principal","Autoservicio","Finanzas del Campus","Realización de Pagos"],
  acts:()=>["En la página de inicio de SIGA, bloque <b>Finanzas del Alumnado</b>, haz clic en <b>Realización de Pagos</b>.","Marca la casilla de tu <b>orden de matrícula</b>.","En <b>Pagos Parciales</b> elige <b>Pago Parcial</b> y escribe el valor que vas a pagar.","Elige el medio de pago (PSE o tarjeta de crédito) y haz clic en <b>Pago en línea</b>."],
  img:[{src:"siga-inicio",cap:"Inicio de SIGA. Finanzas del Alumnado, Realización de Pagos.",hot:[[69.5,48.8,10.5,3.2,1]]},{src:"siga-pagos-1",cap:"Marca la orden de matrícula. Abajo aparece Pagos Parciales.",hot:[[3.3,14.5,3,5,2],[1,69.5,44.5,25,3]]},{src:"siga-pagos-2",cap:"Pago Parcial, Valor a Pagar, medio de pago y Pago en línea.",hot:[[4,22.5,42,9.5,3],[3,57,42,33,4]]}],
  note:()=>`También puedes pagar en la Tesorería (edificio O) o en Bancolombia, cuenta de ahorros 20058996304, convenio 507, con tu ID de estudiante como referencia.`,
  links:()=>[["Instructivo de pagos parciales",U.parciales]]},
 {id:"poliza",ph:0,t:"Genera y paga la póliza de seguro de vida",s:"Póliza de vida",
  intro:()=>`<p>La póliza de seguro de vida es <b>obligatoria</b> para legalizar cualquier crédito directo. Se genera como una compra en SIGA y luego se paga.</p>`,
  acts:()=>["En la página de inicio de SIGA, bloque <b>Finanzas del Alumnado</b>, haz clic en <b>Compras Varias</b>.","Busca el artículo <b>POLIZA SEGURO VIDA</b> del ciclo lectivo que vas a financiar.","En <b>Cantidad</b> escribe <b>1</b>, baja hasta el final y haz clic en <b>Siguiente</b>.","Vuelve a <b>Finanzas del Alumnado</b>, entra a <b>Realización de Pagos</b> y paga la póliza en línea o descarga el recibo."],
  img:[{src:"siga-inicio",cap:"Inicio de SIGA. Compras Varias y Realización de Pagos.",hot:[[69.5,43.6,8.5,3.2,1],[69.5,48.8,10.5,3.2,4]]},{src:"siga-compras",cap:"Compras Varias. Artículo POLIZA SEGURO VIDA y campo Cantidad.",hot:[[2.5,76,18,7.5,2],[76.8,76,9.5,8,3]]}],
  note:()=>`También puedes pagarla por transferencia o ventanilla de Bancolombia (cuenta de ahorros 20058996304, convenio 507, con tu ID de estudiante). Guarda el soporte de pago.`,
  links:l=>[["Instructivo de la póliza",L[l].poliza],["Entrar a SIGA",U.siga]]},
 {id:"asegurabilidad",ph:0,only:["proy"],t:"Diligencia el formulario de asegurabilidad",s:"Asegurabilidad",
  intro:()=>`<p>Solo para Proyéctate. Descarga el formulario de MetLife y diligencia <b>únicamente los campos resaltados</b>.</p>`,
  acts:()=>["<b>Datos del asegurado principal.</b> Son tus datos como estudiante. Las fechas van en formato AA MM DD y en departamento escribe el código numérico (Cundinamarca es 25).","<b>Beneficiarios del seguro.</b> El beneficiario eres tú. No llenes las columnas de parentesco ni de porcentaje.","<b>Cuestionario de asegurabilidad.</b> Respóndelo completo.","Firma como en tu documento de identidad, escribe la fecha y guárdalo en PDF."],
  img:[{src:"formulario-asegurabilidad",cap:"Formulario de asegurabilidad con los campos que debes diligenciar."}],
  links:()=>[["Descargar el formulario",U.formato]]},
 {id:"reunir",ph:0,t:"Reúne tus documentos en PDF",s:"Documentos listos",
  intro:l=>`<p>Antes de entrar a la plataforma ten todos los documentos escaneados en <b>PDF</b>, legibles y completos. Los documentos de identidad van por ambas caras. Así no tendrás que interrumpir la solicitud.</p><ul><li>Documento de identidad del estudiante.</li><li>Política de crédito firmada.</li><li>Soporte de pago de la póliza.</li>${l==="esp"?"<li>Soporte de pago del 50 % de la matrícula.</li>":""}${l==="proy"?"<li>Formulario de asegurabilidad firmado.</li>":""}<li>Documentos del codeudor según si es empleado, independiente o pensionado. Recuerda que el codeudor debe ser otra persona.</li></ul>`,
  acts:()=>[],
  note:()=>`<a href="#docs" data-scroll="docs">Abre la lista de documentos para tu caso ↓</a> y marca cada uno cuando lo tengas.`},
 {id:"ingreso",ph:1,t:"Entra a la plataforma de créditos",s:"Ingreso",
  intro:()=>`<p>Las solicitudes se hacen en una plataforma aparte de SIGA, pero entras con el <b>mismo usuario y contraseña de SIGA</b>. Si eres estudiante nuevo, al inscribirte recibes en tu correo unas credenciales temporales.</p>`,
  acts:()=>["En la página de inicio de SIGA, bloque <b>Solicitud de créditos</b>, haz clic en <b>Formulario solicitud de créditos</b>. También puedes abrir la plataforma directamente.","Escribe tu usuario y tu contraseña.","Haz clic en <b>Ingrese</b>."],
  img:[{src:"siga-inicio",cap:"Inicio de SIGA. Formulario solicitud de créditos.",hot:[[68.6,30.2,17,4.2,1]]},{src:"plataforma-login",cap:"Plataforma de créditos. Usuario, contraseña e Ingrese.",hot:[[32.5,66,35,15,2],[32.5,83,35,6.5,3]]}],
  note:()=>`Si no puedes entrar, llama al 861 5555 ext. 34444 (Service Desk).`,
  links:()=>[["Abrir la plataforma de créditos",U.plataforma]]},
 {id:"datos",ph:1,t:"Verifica tus datos personales",s:"Tus datos",
  intro:()=>`<p>Al entrar verás el <b>Listado de solicitudes</b>. Arriba, en <b>Información actual</b>, aparecen tu documento, nombre, celular, correo y dirección.</p>`,
  acts:()=>["Revisa que tu información actual sea correcta."],
  img:[{src:"siga-listado",cap:"Listado de solicitudes. Información actual.",hot:[[18,52,79,33,1]]}],
  note:()=>`Si cambiaste de tipo de documento, comunícate con Registro Académico y Contabilidad para actualizarlo antes de seguir.`},
 {id:"realizar",ph:1,t:"Inicia una nueva solicitud",s:"Realizar solicitud",
  intro:()=>`<p>Más abajo, en la sección <b>Listado de solicitudes</b>, está el botón para crear tu solicitud.</p>`,
  acts:()=>["Haz clic en el botón verde <b>Realizar solicitud</b>."],
  img:[{src:"realizar-solicitud",cap:"Botón verde Realizar solicitud.",hot:[[1,56,21,36,1]]}],
  note:()=>`Se abre el <b>Formulario de solicitud</b>, que tiene siete pasos. Arriba verás en qué paso vas.`},
 {id:"f1",ph:1,t:"Formulario, paso 1 de 7 · Datos personales",s:"1 · Datos personales",
  intro:()=>`<p>Tus datos básicos ya aparecen cargados. Completa o corrige los demás.</p>`,
  acts:()=>["Revisa y diligencia celular, correo, estado civil, país, ciudad y dirección de residencia.","Haz clic en <b>Siguiente</b>."],
  img:[{src:"form-datos",cap:"Paso 1, Datos Personales.",hot:[[20,69,76,24,1],[89,95.5,7.5,4.5,2]]}],
  note:()=>`Los campos marcados con asterisco (*) son obligatorios. El botón Siguiente no avanza si falta alguno.`},
 {id:"f2",ph:1,t:"Formulario, paso 2 de 7 · Crédito",s:"2 · Crédito",
  intro:l=>`<p>Aquí eliges qué crédito solicitas, para qué periodo y por cuánto.</p>`,
  acts:l=>[`En <b>Tipo de crédito</b> abre la lista y elige <b>${esc(L[l].opt)}</b>.`,"En <b>Periodo académico</b> elige el periodo que vas a financiar.",`En <b>Monto a financiar</b> escribe el valor total que vas a financiar${l==="esp"?" (el saldo que queda después de tu pago del 50 %)":""}.`,"Marca <b>¿Autoriza el uso de sus datos?</b> y haz clic en <b>Siguiente</b>."],
  img:l=>[{src:"form-credito",cap:"Paso 2, Crédito.",hot:[[22,51,25,9,1],[48,51,25,9,2],[74,51,25,9,3],[92,82,8,9,4]]},{src:"lista-lineas",cap:`Lista de líneas. Elige ${L[l].opt}.`,hot:[hotLine[l].concat(1)]},{src:"lista-periodos",cap:"Lista de periodos académicos.",hot:[]}],
  note:()=>`Verifica muy bien la línea y el periodo. Si eliges una línea equivocada, la solicitud será devuelta.`},
 {id:"f3",ph:1,t:"Formulario, paso 3 de 7 · Información laboral",s:"3 · Laboral",
  intro:()=>`<p>Registra tu situación laboral como deudor. Si trabajas, incluye los datos de tu empleo actual y tus ingresos. Si eres independiente o pensionado, indícalo.</p>`,
  acts:()=>["Diligencia todos los campos obligatorios de información laboral.","Haz clic en <b>Siguiente</b>."],
  img:[{src:"form-credito",cap:"El paso 3 es Información Laboral.",hot:stepHot(49)}],
  note:()=>`Registra datos reales y actualizados. Financiación Universitaria los verifica durante el estudio de crédito.`},
 {id:"f4",ph:1,t:"Formulario, paso 4 de 7 · Información familiar",s:"4 · Familiar",
  intro:()=>`<p>Registra la información de tu núcleo familiar que te pide el formulario.</p>`,
  acts:()=>["Diligencia todos los campos obligatorios.","Haz clic en <b>Siguiente</b>."],
  img:[{src:"form-credito",cap:"El paso 4 es Información Familiar.",hot:stepHot(60)}]},
 {id:"f5",ph:1,t:"Formulario, paso 5 de 7 · Referencias del deudor",s:"5 · Referencias",
  intro:()=>`<p>Escribe las referencias que te pide el formulario. Son personas que te conocen y a las que Financiación Universitaria puede contactar.</p>`,
  acts:()=>["Registra los datos de contacto de tus referencias.","Haz clic en <b>Siguiente</b>."],
  img:[{src:"form-credito",cap:"El paso 5 es Referencias Deudor.",hot:stepHot(71)}],
  note:()=>`Avisa a tus referencias que pueden llamarlas.`},
 {id:"f6",ph:1,t:"Formulario, paso 6 de 7 · Información del codeudor",s:"6 · Codeudor",
  intro:l=>`<p>Registra los datos de tu codeudor. El codeudor es <b>obligatorio</b> en todas las líneas${l==="proy"?" y en Proyéctate puedes registrar hasta dos":""}.</p>${NOSELF}`,
  acts:()=>["Diligencia los datos personales, laborales y de ingresos del codeudor.","Haz clic en <b>Siguiente</b>."],
  img:[{src:"form-credito",cap:"El paso 6 es Información Codeudores.",hot:stepHot(82)}],
  note:l=>`El codeudor debe tener máximo ${l==="proy"?"65":"70"} años, residir y tener ingresos en Colombia, no tener reportes negativos en centrales de riesgo y tener capacidad de endeudamiento. El estudiante y el codeudor firman la política y el pagaré.`},
 {id:"f7",ph:1,t:"Formulario, paso 7 de 7 · Referencias del codeudor y Terminar",s:"7 · Terminar",
  intro:()=>`<p>Es el último paso del formulario.</p>`,
  acts:()=>["Registra las referencias del codeudor.","Haz clic en <b>Terminar</b>. El sistema te lleva a la carga de documentos."],
  img:[{src:"form-credito",cap:"El paso 7 es Referencias Codeudores.",hot:stepHot(93)}],
  note:()=>`Al hacer clic en Terminar todavía falta cargar los documentos. La solicitud no queda radicada hasta el siguiente paso.`},
 {id:"cargar",ph:1,t:"Carga los documentos",s:"Cargar documentos",
  intro:()=>`<p>Verás el <b>Listado de documentos</b>. Los que dicen <b>(Documento requerido)</b> son obligatorios. Cárgalos uno por uno.</p>`,
  acts:()=>["En cada documento usa los botones de la derecha. Haz clic en <b>Browse</b> para elegir el PDF y luego en <b>Upload</b> para subirlo. Si te equivocaste de archivo, usa <b>Remove</b>.","Repite con cada documento. Los que dicen (Documento requerido) son obligatorios.","Cuando todos los requeridos estén cargados se habilita <b>Terminar</b>. Haz clic allí."],
  img:[{src:"documentos",cap:"Listado de documentos. Botones Remove, Upload y Browse, y al final Terminar.",hot:[[79.5,40,20.5,6,1],[88,89.5,10,6,3]]}],
  note:()=>`No adjuntes nada en el campo <b>Plan de pagos</b>. Ese espacio es para Financiación Universitaria.`},
 {id:"tramite",ph:1,t:"Confirma que la solicitud quedó EN TRÁMITE",s:"En trámite",
  intro:()=>`<p>Si todo salió bien, verás el mensaje <b>Proceso exitoso</b> y volverás al listado de solicitudes.</p>`,
  acts:()=>["Verifica el mensaje Proceso exitoso.","Revisa que tu solicitud aparezca con el estado <b>EN TRÁMITE</b>."],
  img:[{src:"en-tramite",cap:"Proceso exitoso y solicitud EN TRÁMITE.",hot:[[44,15,54,12,1],[82,94,9,5.5,2]]}],
  note:()=>`Si no ves la solicitud EN TRÁMITE, no quedó radicada. Revisa que cargaste todos los documentos y que hiciste clic en Terminar.`},
 {id:"estados",ph:2,t:"Haz seguimiento al estudio de tu crédito",s:"Seguimiento",
  intro:()=>`<p>Entra a la plataforma de créditos y revisa el estado de tu solicitud. También te escribirán al correo.</p>${ST.slice(1,7).map(s=>`<div class="state-inline"><span class="tag ${s[1]}">${esc(s[0])}</span><span>${esc(s[2])}</span></div>`).join("")}`,
  acts:()=>[],
  note:()=>`Si queda <b>Devuelto</b>, lee la observación, corrige el documento o el dato y vuelve a cargarlo. <a href="#states" data-scroll="states">Ver todos los estados ↓</a>`},
 {id:"d1",ph:2,t:"Pagaré 1 · Abre el correo de Deceval",s:"Pagaré · correo",
  intro:()=>`<p>Cuando el crédito es preaprobado se genera un <b>pagaré electrónico</b>. Llega un correo de <b>administrador@pagares.bvc.com.co</b> al deudor y al codeudor registrados.</p>`,
  acts:()=>["Abre el correo y haz clic en <b>Portal firma</b>."],
  img:[{src:"deceval-correo",cap:"Correo de Deceval con el botón Portal firma.",hot:[[38,50,26,5,1]]}],
  note:()=>`<b>Tú y tu codeudor</b> deben hacer cada uno los pasos de firma, desde su propio correo.`,
  links:()=>[["Instructivo de legalización",U.legal]]},
 {id:"d2",ph:2,t:"Pagaré 2 · Autentícate en el portal",s:"Pagaré · ingreso",
  intro:()=>`<p>Se abre el <b>Portal Firma</b> de Deceval con tu código OTP ya cargado.</p>`,
  acts:()=>["Escribe los caracteres que muestra la imagen (captcha).","Haz clic en <b>Autenticar Código OTP</b>."],
  img:[{src:"deceval-captcha",cap:"Portal Firma. Captcha y Autenticar Código OTP.",hot:[[61,71,21,7,1],[50,81,19,8,2]]}]},
 {id:"d3",ph:2,t:"Pagaré 3 · Abre tu pagaré",s:"Pagaré · abrir",
  intro:()=>`<p>Verás la <b>Lista de Pagarés a Firmar</b>, con el estado Listo para firmar.</p>`,
  acts:()=>["Haz clic en la lupa de la columna <b>Detalle</b>."],
  img:[{src:"deceval-lista",cap:"Lista de pagarés. Lupa de Detalle.",hot:[[89,70,7,14,1]]}]},
 {id:"d4",ph:2,t:"Pagaré 4 · Revisa y firma",s:"Pagaré · firmar",
  intro:()=>`<p>Se muestra el pagaré completo y la carta de instrucciones. Léelos.</p>`,
  acts:()=>["Haz clic en <b>Firmar</b>."],
  img:[{src:"deceval-firmar",cap:"Pagaré y botón Firmar.",hot:[[37,92,11,7,1]]}]},
 {id:"d5",ph:2,t:"Pagaré 5 · Crea tu clave temporal",s:"Pagaré · clave",
  intro:()=>`<p>Crea una clave de un solo uso. A la derecha verás los criterios en verde cuando se cumplan. Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número, no puede ser tu número de identificación y no puede repetir un carácter más de 4 veces seguidas.</p>`,
  acts:()=>["Escribe la clave y confírmala.","Haz clic en <b>Enviar No. Referencia</b>."],
  img:[{src:"deceval-clave",cap:"Clave temporal y botón Enviar No. Referencia.",hot:[[37,46,30,22,1],[7.5,70.5,17,8,2]]}]},
 {id:"d6",ph:2,t:"Pagaré 6 · Escribe el código de referencia",s:"Pagaré · código",
  intro:()=>`<p>Te llega un <b>código de referencia</b> por mensaje de texto o al correo.</p>`,
  acts:()=>["Escribe el código en <b>Código Referencia</b>.","Haz clic en <b>Firmar</b>."],
  img:[{src:"deceval-codigo",cap:"Código Referencia y botón Firmar.",hot:[[18,36,33,8.5,1],[1,88,10,9,2]]},{src:"deceval-sms",cap:"Así llega el código de referencia."}]},
 {id:"d7",ph:2,t:"Pagaré 7 · Confirma la firma",s:"Pagaré · listo",
  intro:()=>`<p>Recibirás un correo de confirmación con una copia del pagaré en PDF. <b>La clave del PDF es tu número de documento.</b></p>`,
  acts:()=>["Verifica el correo Notificación pagaré exitosamente firmado.","Recuérdale a tu codeudor que también firme."],
  img:[{src:"pagare-exitoso",cap:"Correo de firma exitosa del pagaré."}],
  note:()=>`Cuando deudor y codeudor firman, el estado pasa a <b>Crédito legalizado</b>. Con el crédito legalizado ya puedes <a href="#inscripcion">inscribir tus asignaturas</a>.`},
 {id:"plan",ph:3,t:"Consulta tu plan de pagos",s:"Plan de pagos",
  intro:()=>`<p>Con el crédito legalizado, Financiación Universitaria carga tu <b>plan de pagos</b> en SIGA, con las cuotas y sus fechas límite.</p>`,
  route:["Menú Principal","Autoservicio","Créditos","Créditos Otorgados"],
  acts:()=>["En la página de inicio de SIGA, bloque <b>Finanzas del Alumnado</b>, haz clic en <b>Créditos Otorgados</b>.","En tu crédito haz clic en <b>Plan de Pagos</b>. Puedes imprimirlo."],
  img:[{src:"siga-inicio",cap:"Inicio de SIGA. Créditos Otorgados.",hot:[[71,58.8,9.5,3.4,1]]},{src:"siga-creditos",cap:"Créditos Otorgados. Plan de Pagos.",hot:[[66.8,56,8.7,38,2]]},{src:"plan-pagos",cap:"Plan de pagos con cuotas y fechas límite."}],
  links:()=>[["Instructivo interactivo de pago de cuotas",U.genPago]]},
 {id:"cuota",ph:3,t:"Paga tus cuotas cada mes",s:"Pagar cuota",
  intro:()=>`<p>Las cuotas vencen el <b>día 5 de cada mes</b> y empiezan el mes siguiente a tu solicitud.</p>`,
  acts:()=>["En <b>Créditos Otorgados</b> haz clic en <b>Pagar Cuota</b>.","Marca <b>Seleccionar para pago</b> o usa <b>Pagar valor diferente</b> si quieres abonar otro valor.","Elige el medio de pago (PSE, tarjeta de crédito o imprimir recibo) y termina el pago."],
  img:[{src:"siga-creditos",cap:"Créditos Otorgados. Pagar Cuota e Histórico de Pagos.",hot:[[75.8,56.5,8.6,10.5,1]]},{src:"pago-en-linea",cap:"Pagar Cuota. Selección y medio de pago.",hot:[[3,34,22,6,2],[2,64,40,15,3]]}],
  note:()=>`En <b>Histórico de Pagos</b> ves los pagos que ya hiciste. Si tienes dificultades para pagar, escribe a tiempo a cartera.financiacion@unisabana.edu.co.`}
];
const lineSteps=l=>S.filter(x=>!x.only||x.only.includes(l));
let line=store.get("gp_line","esp"); if(!L[line])line="esp";
let cs=0; const seenC=new Set([0]);
const hotHTML=h=>`<i class="hot${h[4]?" has-n":""}${h[2]>80?" n-in":h[0]<7?" n-right":""}" style="left:${h[0]}%;top:${h[1]}%;width:${h[2]}%;height:${h[3]}%"${h[4]?` data-n="${h[4]}"`:""}></i>`;
const figure=(im,i)=>`<figure class="shot" data-i="${i}"><button type="button" class="shot-btn" data-zoom="${im.src}" data-cap="${esc(im.cap)}" data-hot='${JSON.stringify(im.hot||[])}' aria-label="Ampliar: ${esc(im.cap)}"><span class="shot-img"><img src="${IMG+im.src}.webp${IV}" alt="${esc(im.cap)}" loading="lazy" decoding="async">${(im.hot||[]).map(hotHTML).join("")}</span><span class="zoom-hint" aria-hidden="true">Ampliar</span></button><figcaption>${esc(im.cap)}</figcaption></figure>`;
function stepBody(x,l){
  const imgs=typeof x.img==="function"?x.img(l):(x.img||[]);
  const links=x.links?x.links(l):[];
  const acts=x.acts?x.acts(l):[];
  const gal=imgs.length>1?`<div class="gallery" data-n="${imgs.length}"><div class="g-track">${imgs.map(figure).join("")}</div><div class="g-nav"><button type="button" class="btn ghost sm" data-g="-1" aria-label="Imagen anterior">←</button><span class="g-count">1 / ${imgs.length}</span><button type="button" class="btn ghost sm" data-g="1" aria-label="Imagen siguiente">→</button></div></div>`:imgs.map(figure).join("");
  const note=x.note?x.note(l):"";
  return `<div class="s-intro">${x.intro(l)}</div>${x.route?route(x.route):""}${acts.length?`<div class="acts-box"><span class="acts-h">Haz esto</span><ol class="acts">${acts.map((a,i)=>`<li><span class="an">${i+1}</span><span>${a}</span></li>`).join("")}</ol></div>`:""}${gal}${note?`<div class="callout blue s-note"><b>Ten en cuenta.</b> ${note}</div>`:""}${links.length?`<div class="linkrow">${links.map(a=>`<a href="${a[1]}" target="_blank" rel="noopener">${esc(a[0])} ↗</a>`).join("")}</div>`:""}`;
}
function renderLineTabs(){
  $("#lineTabs").innerHTML=Object.keys(L).map(k=>`<button type="button" role="tab" data-line="${k}" aria-selected="${k===line}"><b>${esc(L[k].n)}</b><small>${esc(L[k].tag)}</small></button>`).join("");
}
function renderCSteps(){
  const st=lineSteps(line); if(cs>=st.length)cs=st.length-1;
  $$("#lineTabs button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.line===line)));
  let last=-1;
  $("#cStepList").innerHTML=st.map((x,i)=>{const h=x.ph!==last?`<li class="ph-h" role="presentation"><span>Fase ${x.ph+1}</span>${esc(PH[x.ph])}</li>`:"";last=x.ph;return h+`<li><button type="button" role="tab" data-cs="${i}" aria-selected="${i===cs}" class="${seenC.has(i)&&i!==cs?"seen":""}"><em>${i+1}</em><span>${esc(x.s)}</span></button></li>`}).join("");
  const x=st[cs], nx=st[cs+1];
  $("#cStepPanel").innerHTML=`<div class="step-head"><span class="num">${String(cs+1).padStart(2,"0")}</span><div><span class="eyebrow">Fase ${x.ph+1} · ${esc(PH[x.ph])}</span><h3>${esc(x.t)}</h3><span class="s-meta">${esc(L[line].n)} · Paso ${cs+1} de ${st.length}</span></div></div>
  <div class="step-bar" aria-hidden="true"><i style="width:${(cs+1)/st.length*100}%"></i></div>
  <div class="cbody">${stepBody(x,line)}</div>
  <div class="nav"><button class="btn ghost" type="button" data-cnav="-1" ${cs===0?"disabled":""}>← Anterior</button><button class="btn" type="button" data-cnav="1">${nx?`Siguiente<span class="nx">: ${esc(nx.s)}</span> →`:"Volver al inicio ↺"}</button></div>`;
  const cur=$("#cStepList button[aria-selected=true]"); if(cur){const ol=$("#cStepList"); if(ol.scrollHeight>ol.clientHeight)ol.scrollTop=cur.offsetTop-ol.clientHeight/2}
}
function setLine(l,scroll){if(!L[l])return;line=l;store.set("gp_line",l);cs=0;seenC.clear();seenC.add(0);renderCSteps();renderDocs();if(scroll)$("#pasoapaso").scrollIntoView({behavior:"smooth",block:"start"})}
function goStep(l,i){line=l;cs=i;seenC.add(i);renderCSteps();const p=$("#cStepPanel");p.classList.remove("hl-flash");void p.offsetWidth;p.classList.add("hl-flash");return $("#pasoapaso")}

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
let dwho="otro", dinc=store.get("gp_dinc","emp");
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
  box.innerHTML=`${NOSELF}<div class="docs-ctl"><div><span class="lbl-s">Línea</span><div class="seg">${Object.keys(L).map(k=>`<button type="button" data-dline="${k}" aria-pressed="${k===line}">${esc(L[k].short)}</button>`).join("")}</div></div>
    <div><span class="lbl-s">${self?"Tus ingresos":"Ingresos del codeudor"}</span><div class="seg">${[["emp","Empleado"],["ind","Independiente"],["pen","Pensionado"]].map(o=>`<button type="button" data-dinc="${o[0]}" aria-pressed="${dinc===o[0]}">${o[1]}</button>`).join("")}</div></div></div>
  <ul class="checklist docs-list">${list.map((x,i)=>`<li class="${dchk.has(line+":"+x[0])?"done":""}"><input type="checkbox" id="dc-${x[0]}" data-dk="${x[0]}" ${dchk.has(line+":"+x[0])?"checked":""}><label for="dc-${x[0]}"><b>${esc(x[1])}</b></label></li>`).join("")}</ul>
  <div class="docs-foot"><span class="tag ${done===list.length?"ok":"blue"}">${done} de ${list.length} listos</span><span class="muted">Todos en PDF, legibles y completos.</span></div>`;
}

/* ---------- Pagos ---------- */
const P=[
 {id:"linea",n:"En línea",sub:"PSE o tarjeta de crédito",body:`<p>Paga tu orden de matrícula u otro derecho pecuniario por la pasarela <b>PlacetoPay</b>, desde SIGA Académico.</p>${route(["Menú Principal","Autoservicio","Finanzas del Campus","Realización de Pagos"])}<ol class="mini"><li>Ingresa a SIGA con tu usuario y contraseña de estudiante.</li><li>Entra a <b>Realización de Pagos</b> y marca el ítem o cargo que vas a pagar.</li><li>Elige <b>Pago en línea</b> con un único medio (PSE o una tarjeta de crédito) o con varias tarjetas de crédito. También puedes elegir <b>Smart Pago</b> para recibir un enlace o código QR por correo, WhatsApp o mensaje de texto.</li><li>Haz clic en <b>Pago en línea</b>. La pasarela te pide tus datos y luego el medio de pago.</li></ol><div class="callout blue"><b>Antes de pagar, verifica.</b><ul><li>Que tu banco o tarjeta tenga habilitadas las transacciones en línea.</li><li>Que no hayas superado el tope diario de transacciones de tu banco.</li><li>Que tengas saldo o cupo suficiente.</li><li>Usa Chrome o Firefox.</li></ul></div>`,img:[{src:"siga-inicio",cap:"Inicio de SIGA. En Finanzas del Alumnado haz clic en Realización de Pagos.",hot:[[68.5,52.3,10.0,3.4]]},{src:"siga-pagos-1",cap:"Marca la orden de matrícula o el cargo que vas a pagar.",hot:[[2.5,56.9,3.6,3.8]]},{src:"siga-pagos-2",cap:"Elige Pago Total o Parcial y el medio de pago, o usa Smart Pago.",hot:[[3.2,42.4,13.2,12.9],[2.9,73.4,36.1,10.8],[44.3,66.9,46.4,14.4]]},{src:"parcial-5",cap:"En PlacetoPay selecciona tarjeta de crédito o PSE para terminar en tu banco."}]},
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
const BHOW=`<article class="card pay-card beca-how" data-search="cómo solicitar beca SIGA solicitud becas ayudas económicas posgrado vencimiento orden matrícula 3 días"><div class="pay-txt"><span class="eyebrow">Paso a paso en SIGA</span><h3>Cómo solicitar una beca o descuento</h3><div class="callout"><b>Ojo con la fecha.</b> En posgrado, estudiantes nuevos y antiguos deben radicar la solicitud antes de la fecha de vencimiento de su orden de matrícula, como mínimo con 3 días de anticipación.</div><ol class="mini"><li>En la página de inicio de SIGA, bloque <b>Becas y Ayudas Económicas</b>, haz clic en <b>Sol. Becas y Ayudas Económicas</b>.</li><li>Lee las indicaciones de <b>Estudiantes de posgrado</b> y haz clic en <b>Ingresar Solicitud</b>.</li><li>En <b>Grado Académico</b> elige posgrado con la lupa y haz clic en <b>Aceptar</b>.</li><li>Elige la beca o el descuento, adjunta los soportes que te pidan y envía la solicitud.</li><li>Consulta el resultado en <b>Revisar Solicitudes</b>.</li></ol><p class="muted">Al enviar la solicitud aceptas los términos y condiciones de la beca y los compromisos que adquieres si te la aprueban.</p><div class="linkrow"><a href="https://usabana.widen.net/s/tdq2zrzmmh/instructivo-solicitud-de-becas-posgrado-1" target="_blank" rel="noopener">Instructivo de solicitud de becas de posgrado ↗</a></div></div><div class="pay-img"><div class="gallery" data-n="3"><div class="g-track">${[{src:"siga-inicio",cap:"Inicio de SIGA. Bloque Becas y Ayudas Económicas.",hot:[[69.5,74.6,18,3.2,1]]},{src:"siga-becas",cap:"Indicaciones para posgrado y botón Ingresar Solicitud.",hot:[[9,34.5,81,22,2],[11.5,89.5,27.5,6,3]]},{src:"siga-becas-form",cap:"Elige el grado académico y haz clic en Aceptar.",hot:[[35,74,8.5,6,4],[38.5,90.5,13.5,6.5,5]]}].map(figure).join("")}</div><div class="g-nav"><button type="button" class="btn ghost sm" data-g="-1" aria-label="Imagen anterior">←</button><span class="g-count">1 / 3</span><button type="button" class="btn ghost sm" data-g="1" aria-label="Imagen siguiente">→</button></div></div></div></article>`;
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
function openLB(b){lbLast=b;const hot=JSON.parse(b.dataset.hot||"[]");$(".lb-img",lb).innerHTML=`<img src="${IMG+b.dataset.zoom}.webp${IV}" alt="">${hot.map(hotHTML).join("")}`;$(".lb-cap",lb).textContent=b.dataset.cap;lb.hidden=false;document.body.style.overflow="hidden";$(".lb-x",lb).focus()}
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
  if((b=t.closest("[data-dline]"))){setLine(b.dataset.dline);return}
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
renderCmp();renderLineTabs();renderCSteps();renderStates();renderDocs();renderPay();
$("#payFaq").innerHTML=PF.map(f=>`<details class="acc" data-search="${esc("pago electrónico "+f[0]+" "+f[1])}"><summary>${esc(f[0])}</summary><div class="acc-body"><p>${esc(f[1])}</p></div></details>`).join("");
$("#becaGrid").innerHTML=B.map(becaHTML).join("");
$("#becaHow").innerHTML=BHOW;
$$("#becaGrid .beca").forEach((el,i)=>el.dataset.c=B[i].c);
renderBecas();

/* ---------- Índice de búsqueda para app.js ---------- */
const strip=h=>h.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
window.FIN={idx:[],print:printAll};
Object.keys(L).forEach(l=>lineSteps(l).forEach((x,i)=>{const txt=strip(x.intro(l)+" "+(x.acts?x.acts(l).join(" "):""));window.FIN.idx.push({sec:"Créditos y financiación",t:`${L[l].short} · Paso ${i+1}: ${x.t}`,txt,k:"credito financiacion "+L[l].n+" "+x.t+" "+txt,open:()=>goStep(l,i)})}));
P.forEach(p=>window.FIN.idx.push({sec:"Pagos de matrícula",t:"Pagar: "+p.n,txt:strip(p.body),k:"pago pagar matricula "+p.n+" "+p.sub+" "+strip(p.body),open:()=>{pay=p.id;renderPay();return $("#payTabs")}}));
window.FIN.printPrep=printAll;
})();
