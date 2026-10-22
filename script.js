
const data={
passado:{title:'Margem esquerda · Campos desbravados',subtitle:'Reconhecer o que já foi construído.',tabs:{'Memória das práticas':[
'As experiências anteriores são nosso ponto de partida; portanto, não é um território a ser esquecido.',
'É preciso reconhecer os instrumentos e estratégias que já produziram aprendizagens e inovação na prática docente.',
'É possível que alguns cursistas entendam as implementações apenas como avaliações; e outros como estratégia que orienta as intervenções.'
],'Pergunta reflexiva':[
'Quantos roteiros foram necessários para o convencimento de que o GE Formadores seria o cenário necessário para a formação continuada?',
'O que é necessário preservar das experiências anteriores?'
],'Práticas validadas':[
'O relato das práticas transformou reflexões em novas práticas.',
'Os cursistas destacaram protagonismo e engajamento; e a possibilidade de replicar em outras turmas.'
]}},
ponte:{title:'Ponte · A unidade',subtitle:'Construir sentido entre a experiência acumulada e a inovação.',tabs:{'O que nos conecta':[
'Comunicação e escuta ativa, critérios claros e compromisso com a aprendizagem.',
'A mediação do formador ajuda o cursista a nomear evidências, compreender escolhas e projetar melhorias.'
],'Perguntas de mediação':[
'O que aconteceu durante a prática que merece ser destacado?',
'O que essa experiência nos faz perceber sobre a aprendizagem dos estudantes?',
'Quais são os maiores desafios da mentoria?',
'As mentorias estão proporcionando a autonomia do cursista?'
],'Feedback propositivo':[
'O tempo dedicado a responder cursistas nas jornadas anteriores, agora pode e deve ser feito durante a mentoria.',
'Já surgiu alguma situação que foi direcionada para ser esclarecida durante a mentoria?',
'Recordando o fluxo da mentoria [acolher, situar, investigar, refletir e encaminhar]: Um ajuste que pode ser experimentado na próxima mentoria?'
]}},
futuro:{title:'Margem direita · Campos a explorar',subtitle:'Transformar reflexões em próximos passos viáveis.',tabs:{'Práticas em consolidação':[
'Os cursistas estão conseguindo perceber o que devem manter, replicar ou adaptar?',
'Que tal explorar mais a Roda de Conversa? (O cursista antes de iniciar a sua fala, comentar a apresentação anterior: se já fez algo semelhante; tentou e não deu certo; se gostou e vai testar/utilizar)'
],'Perguntas sobre resultados':[
'Qual evidência compartilhada na roda de conversa revela impacto direto com os estudantes?',
'As práticas aplicadas/testadas/validadas que foram compartilhadas possibilitam a replicação entre os professores?'
],'Percepções confirmadas':[
'Ao relatar os professores perceberam protagonismo e participação dos alunos.',
'A homologia de processos foi relevante: vivenciar uma metodologia antes de compartilhar com os pares.',
'Houve relatos que os alunos experimentaram surpresa, curiosidade e superação de situações de intolerância religiosa.'
]}}
};
const dlg=document.querySelector('#panel'), title=document.querySelector('#panelTitle'),sub=document.querySelector('#panelSubtitle'),tabs=document.querySelector('#tabs'),content=document.querySelector('#panelContent'), editor=document.querySelector('#editor'),note=document.querySelector('#note'),saved=document.querySelector('#saved');let current='',currentTab='';const key=k=>'ponte-feedback-2026:'+k;
let selectedStatement=null;let itemPosition=0,viewAll=false;
const statementKey=(area,tab,index)=>{const legacyTab=area==='futuro'&&tab==='Perguntas sobre resultados'?'Perguntas de futuro':area==='futuro'&&tab==='Percepções confirmadas'?'Percepções já levantadas':tab;return key('frase:'+area+':'+legacyTab+':'+(area==='futuro'&&tab==='Práticas em consolidação'?'v4:':'')+index);};
function openArea(area){dlg.classList.remove('special-wide');current=area;let d=data[area];title.textContent=d.title;sub.textContent=d.subtitle;editor.hidden=false;tabs.innerHTML='';Object.keys(d.tabs).forEach(name=>{let b=document.createElement('button');b.textContent=name;b.onclick=()=>showTab(name);tabs.appendChild(b)});selectedStatement=null;viewAll=false;itemPosition=0;showTab(Object.keys(d.tabs)[0]);saved.textContent='';dlg.showModal();scheduleFitText()}
function showTab(name,keepPosition=false){document.querySelector('#presentControls').hidden=false;currentTab=name;selectedStatement=null;if(!keepPosition)itemPosition=0;[...tabs.children].forEach(x=>x.classList.toggle('active',x.textContent===name));content.innerHTML='';data[current].tabs[name].forEach((t,i)=>{const storage=statementKey(current,name,i);const div=document.createElement('div');div.className='item pickable';div.tabIndex=0;div.setAttribute('role','checkbox');div.setAttribute('aria-checked','false');const marker=document.createElement('span');marker.className='mark';const cb=document.createElement('input');cb.type='checkbox';cb.tabIndex=-1;cb.setAttribute('aria-label','Selecionar frase '+(i+1));const num=document.createElement('span');num.className='number';num.textContent=String(i+1).padStart(2,'0');marker.append(cb,num);const statement=document.createElement('span');statement.className='statement';const body=document.createElement('span');body.textContent=t;statement.append(body);/* Comentários permanecem armazenados, mas não aparecem junto ao texto oficial. */div.append(marker,statement);const select=()=>{selectedStatement={area:current,tab:name,index:i};content.querySelectorAll('.pickable').forEach(node=>{const on=node===div;node.classList.toggle('selected',on);node.setAttribute('aria-checked',String(on));node.querySelector('input').checked=on});note.value=localStorage.getItem(storage)||'';document.querySelector('#selectedNote').textContent='Frase '+String(i+1).padStart(2,'0')+' selecionada · '+name;saved.textContent='';};div.onclick=select;div.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}};content.append(div)});refreshPresentation();note.value='';note.disabled=false;note.placeholder='Selecione o marcador numerado de uma frase para comentar.';document.querySelector('#selectedNote').textContent='Selecione uma frase para associar seu comentário.';}


// Ajusta automaticamente o texto ao espaço real disponível, sem recortar enunciados.
let fitPending=false;
function scheduleFitText(){
 if(fitPending)return;
 fitPending=true;
 requestAnimationFrame(()=>{fitPending=false;fitPresentationText();});
}
function fitPresentationText(){
 if(!dlg.open || !content.classList.contains('single-view'))return;
 const row=content.querySelector('.pickable:not([hidden])');
 if(!row)return;
 const statement=row.querySelector('.statement');
 const body=statement?.firstElementChild;
 if(!body)return;
 const width=statement.getBoundingClientRect().width;
 if(width<80)return;
 const availableHeight=Math.max(180,Math.min(window.innerHeight*0.53,480));
 const desiredMaximum=Math.min(58,Math.max(28,window.innerWidth*.035));
 const smallest=16;
 // Estima uma fonte para a altura útil da tela, preservando espaço para controles.
 function fits(size){
   statement.style.setProperty('--responsive-statement-size',size+'px');
   return statement.getBoundingClientRect().height<=availableHeight-14;
 }
 let lo=smallest,hi=desiredMaximum;
 for(let k=0;k<14;k++){
   const mid=(lo+hi)/2;
   if(fits(mid))lo=mid;else hi=mid;
 }
 statement.style.setProperty('--responsive-statement-size',lo.toFixed(1)+'px');
 // Em textos excepcionalmente longos, o cartão cresce e a caixa mantém seu conteúdo.
}
window.addEventListener('resize',scheduleFitText);
document.addEventListener('fullscreenchange',scheduleFitText);

function refreshPresentation(){
 const rows=[...content.querySelectorAll('.pickable')];
 if(!rows.length){document.querySelector('#presentControls').hidden=true;return;}
 itemPosition=Math.max(0,Math.min(itemPosition,rows.length-1));
 rows.forEach((el,i)=>{el.hidden=!viewAll&&i!==itemPosition;});
 content.classList.toggle('single-view',!viewAll);
 content.dataset.count=String(rows.length);
 scheduleFitText();
 document.querySelector('#presentCounter').textContent=viewAll?'Exibindo '+rows.length+' tópicos':'Tópico '+String(itemPosition+1).padStart(2,'0')+' / '+String(rows.length).padStart(2,'0');
 document.querySelector('#prevItem').disabled=!viewAll && itemPosition===0 && Object.keys(data[current]?.tabs||{})[0]===currentTab;
 document.querySelector('#nextItem').disabled=!viewAll && itemPosition===rows.length-1 && Object.keys(data[current]?.tabs||{}).at(-1)===currentTab;
 document.querySelector('#toggleList').textContent=viewAll?'◉ Um por vez':'☷ Ver todos';
}
function moveItem(delta){
 if(!data[current])return;
 const keys=Object.keys(data[current].tabs);let next=itemPosition+delta;
 const amount=data[current].tabs[currentTab].length;
 if(next>=amount){const idx=keys.indexOf(currentTab);if(idx<keys.length-1){showTab(keys[idx+1]);return;}next=amount-1;}
 if(next<0){const idx=keys.indexOf(currentTab);if(idx>0){showTab(keys[idx-1]);itemPosition=data[current].tabs[currentTab].length-1;}else itemPosition=0;}
 else itemPosition=next;
 refreshPresentation();
}
document.querySelector('#prevItem').onclick=()=>moveItem(-1);
document.querySelector('#nextItem').onclick=()=>moveItem(1);
document.querySelector('#toggleList').onclick=()=>{viewAll=!viewAll;refreshPresentation()};
document.querySelector('#fullscreenBtn').onclick=()=>{if(document.fullscreenElement){document.exitFullscreen?.();}else{document.documentElement.requestFullscreen?.();}};
document.addEventListener('keydown',event=>{
 if(!dlg.open||!data[current]||viewAll||event.altKey||event.ctrlKey||event.metaKey)return;
 if(event.target.closest('textarea, input, [contenteditable="true"]'))return;
 if(event.key==='ArrowRight'||event.key==='ArrowDown'||event.key==='PageDown'){event.preventDefault();moveItem(1)}
 if(event.key==='ArrowLeft'||event.key==='ArrowUp'||event.key==='PageUp'){event.preventDefault();moveItem(-1)}
});

document.querySelectorAll('[data-area]').forEach(el=>el.onclick=()=>openArea(el.dataset.area));document.querySelector('#close').onclick=()=>dlg.close();
const saveButton=document.querySelector('#save');
saveButton.onclick=()=>{if(selectedStatement){const {area,tab,index}=selectedStatement;const k=statementKey(area,tab,index);if(note.value.trim())localStorage.setItem(k,note.value.trim());else localStorage.removeItem(k);showTab(tab,true);const line=content.querySelectorAll('.pickable')[index];if(line)line.click();saved.textContent='Comentário da frase '+String(index+1).padStart(2,'0')+' salvo neste dispositivo.';}else if(current){localStorage.setItem(key(current),note.value);saved.textContent='Comentário salvo neste navegador.';}else saved.textContent='Selecione uma frase.';};
function special(heading,subtitle,html,id){current=id;selectedStatement=null;title.textContent=heading;sub.textContent=subtitle;tabs.innerHTML='';document.querySelector('#presentControls').hidden=true;content.innerHTML=html;editor.hidden=(id==='comparacao'||id==='sintese'||id==='guia');dlg.classList.toggle('special-wide',id==='comparacao'||id==='sintese'||id==='guia');note.disabled=false;note.placeholder='Registre aqui os comentários do formador...';document.querySelector('#selectedNote').textContent='Registro geral desta seção.';note.value=localStorage.getItem(key(id))||'';saved.textContent='';dlg.showModal()}
document.querySelector('#guide').onclick=()=>special('Como explorar a paisagem','Um roteiro de facilitação em três movimentos.','<div class="guide-v15"><div class="item"><strong>1. Recordar:</strong> abra a margem esquerda e reconheça experiências, instrumentos e aprendizagens construídas.</div><div class="item"><strong>2. Mediar:</strong> abra a ponte e escolha uma pergunta de reflexão.</div><div class="item"><strong>3. Projetar:</strong> vá para a margem direita e veja as conquistas já alcançadas e as possibilidades de evolução.</div></div>','guia');
document.querySelector('#overview').onclick=()=>special('Duas experiências, O mesmo propósito','A aprendizagem e a promoção dos estudantes',`<div class="compare compare-v13"><div class="item"><strong>O que preservar</strong><p>Os instrumentos que foram úteis; as experiências validadas; os critérios e conhecimentos que confirmaram a assertividade da própria prática ou que redirecionaram a prática docente; o engajamento dos alunos e os vínculos criados.</p></div><div class="item"><strong>O que fortalecer</strong><p>Escuta, feedback orientador, análise das evidências e planejamento de ajustes necessários; esses são todos elementos que acontecem durante a mentoria.</p></div></div><div class="item bridge-v13"><strong>A função da ponte:</strong><p>Criar as condições de continuidade entre o que já funcionava e o que merece ser aperfeiçoado.</p></div>`,'comparacao');
const microFields=[['preservar','preservar'],['aperfeicoar','aperfeiçoar'],['observar','observar']];
function saveMicro(){for(const [id] of microFields){const field=document.getElementById('micro-'+id);if(field)localStorage.setItem(key('micro:'+id),field.value);}const status=document.getElementById('microStatus');if(status)status.textContent='Micro-meta salva neste navegador e incluída na exportação Word.';}
function showMicro(){special('Síntese coletiva · Nosso compromisso','Registre uma micro meta para dar continuidade e êxito nos trabalhos.',`<div class="item micro-card"><h3>Minha micro-meta para a próxima mentoria</h3><div class="micro-fields"><label>Pretendo preservar <input id="micro-preservar" aria-label="Pretendo preservar" placeholder="Escreva o que preservar"></label><label>aperfeiçoar <input id="micro-aperfeicoar" aria-label="Pretendo aperfeiçoar" placeholder="Escreva o que aperfeiçoar"></label><label>e observar <input id="micro-observar" aria-label="Pretendo observar" placeholder="Escreva o que observar"></label></div><p class="micro-ending">na próxima mentoria.</p><button id="microSave" class="save" type="button">Salvar micro-meta</button><p class="saved" id="microStatus" aria-live="polite"></p></div><div class="item quote-v13">“Um bom registro na agenda ou portfólio potencializa o planejamento e o êxito na prática Docente”</div>`,'sintese');for(const [id] of microFields){const field=document.getElementById('micro-'+id);field.value=localStorage.getItem(key('micro:'+id))||'';field.addEventListener('input',()=>localStorage.setItem(key('micro:'+id),field.value));}document.getElementById('microSave').onclick=saveMicro;}
document.querySelector('#consolidate').onclick=showMicro;
/* V8 — Exportação DOCX nativa, offline, sem bibliotecas externas. */
function xmlEscape(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
function paragraph(value,type='body'){
 const text=xmlEscape(value), size=type==='cover'?40:type==='section'?30:type==='sub'?25:type==='comment'?22:23;
 const white=type==='cover'||type==='section';
 const navy=type==='cover'||type==='section';
 const bg=navy?'<w:shd w:val="clear" w:color="auto" w:fill="102A3B"/>':'';
 const psp=type==='cover'?'260':type==='section'?'230':type==='sub'?'170':'95';
 const padding=navy?'<w:ind w:left="180" w:right="160"/>':'';
 const bold=type==='body'?'':'<w:b/>';
 const before=type==='section'?'260':type==='sub'?'160':'60';
 return '<w:p><w:pPr><w:spacing w:before="'+before+'" w:after="'+psp+'" w:line="315" w:lineRule="auto"/>'+bg+padding+'</w:pPr><w:r><w:rPr>'+bold+'<w:color w:val="'+(white?'FFFFFF':type==='sub'?'17364B':type==='comment'?'225970':'283A48')+'"/><w:sz w:val="'+size+'"/><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/></w:rPr><w:t xml:space="preserve">'+text+'</w:t></w:r></w:p>';
}
function wordXml(){
 const names={passado:'CAMPOS DESBRAVADOS',ponte:'PONTE - A UNIDADE',futuro:'CAMPOS A EXPLORAR',guia:'ROTEIRO',comparacao:'INTEGRAÇÃO DA JORNADA II e III.',sintese:'SÍNTESE COLETIVA'};
 let body=paragraph('A PONTE DA FORMAÇÃO CONTINUADA','cover')+paragraph('Relatório de comentários do formador','sub');
 body+=paragraph('Tópicos e observações registrados durante a formação.','body');
 Object.entries(names).forEach(([k,label])=>{
  let parts='';
  if(data[k]){
   Object.entries(data[k].tabs).forEach(([tab,lines])=>{
    parts+=paragraph(tab,'sub');
    lines.forEach((line,i)=>{
     parts+=paragraph(String(i+1).padStart(2,'0')+'.  '+line,'body');
     const comment=localStorage.getItem(statementKey(k,tab,i));
     if(comment) parts+=paragraph('Comentário do Formador: '+comment,'comment');
    });
   });
  }
  if(k==='guia'){
    parts+=paragraph('1. Recordar: abra a margem esquerda e reconheça experiências, instrumentos e aprendizagens construídas.','body');
    parts+=paragraph('2. Mediar: abra a ponte e escolha uma pergunta de reflexão.','body');
    parts+=paragraph('3. Projetar: vá para a margem direita e veja as conquistas já alcançadas e as possibilidades de evolução.','body');
  }
  if(k==='sintese'){
    parts+=paragraph('Minha micro-meta para a próxima mentoria','sub');
    const v=id=>(localStorage.getItem(key('micro:'+id))||'').trim()||'________________';
    parts+=paragraph('Pretendo preservar '+v('preservar')+'; aperfeiçoar '+v('aperfeicoar')+' e observar '+v('observar')+' na próxima mentoria.','body');
    parts+=paragraph('“Um bom registro na agenda ou portfólio potencializa o planejamento e o êxito na prática Docente”','body');
  }
  if(k==='comparacao'){
    parts+=paragraph('O que preservar','sub');
    parts+=paragraph('Os instrumentos que foram úteis; as experiências validadas; os critérios e conhecimentos que confirmaram a assertividade da própria prática ou que redirecionaram a prática docente; o engajamento dos alunos e os vínculos criados.','body');
    parts+=paragraph('O que fortalecer','sub');
    parts+=paragraph('Escuta, feedback orientador, análise das evidências e planejamento de ajustes necessários; esses são todos elementos que acontecem durante a mentoria.','body');
    parts+=paragraph('A função da ponte: Criar as condições de continuidade entre o que já funcionava e o que merece ser aperfeiçoado.','body');
  }
  const general=localStorage.getItem(key(k));
  if(general && k!=='comparacao' && k!=='sintese')parts+=paragraph('Comentário geral: '+general,'comment');
  if(parts)body+=paragraph(label,'section')+parts;
 });
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
 '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+
 '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1100" w:right="1100" w:bottom="1100" w:left="1100" w:header="700" w:footer="700" w:gutter="0"/></w:sectPr></w:body></w:document>';
}
const crcTable=(()=>{const a=[];for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xEDB88320^(c>>>1):c>>>1;a[i]=c>>>0;}return a;})();
function crc32(bytes){let c=0xFFFFFFFF;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function zipDocx(entries){
 const enc=new TextEncoder();let cursor=0;const chunks=[],centers=[];
 function u16(n){return [n&255,(n>>>8)&255];}function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];}
 for(const [name,content] of entries){
  const n=enc.encode(name),d=enc.encode(content),crc=crc32(d),off=cursor;
  const header=new Uint8Array([80,75,3,4,...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0)]);
  chunks.push(header,n,d);cursor+=header.length+n.length+d.length;
  const central=new Uint8Array([80,75,1,2,...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]);
  centers.push(central,n);
 }
 const start=cursor;for(const x of centers){chunks.push(x);cursor+=x.length;}
 chunks.push(new Uint8Array([80,75,5,6,...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(cursor-start),...u32(start),...u16(0)]));
 return new Blob(chunks,{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
}
function exportDocx(){
 const ct='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
 const rel='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 const blob=zipDocx([['[Content_Types].xml',ct],['_rels/.rels',rel],['word/document.xml',wordXml()]]);
 const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download='Relatorio_Feedback_Formativo.docx';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);
}
document.querySelector('#export').onclick=exportDocx;
document.querySelector('#clear').onclick=()=>{if(confirm('Excluir todos os registros salvos neste navegador para este painel?')){['passado','ponte','futuro','guia','comparacao','sintese'].forEach(k=>localStorage.removeItem(key(k)));Object.entries(data).forEach(([area,d])=>Object.entries(d.tabs).forEach(([tab,lines])=>lines.forEach((_,i)=>localStorage.removeItem(statementKey(area,tab,i)))));microFields.forEach(([id])=>localStorage.removeItem(key('micro:'+id)));alert('Registros apagados.')}};
