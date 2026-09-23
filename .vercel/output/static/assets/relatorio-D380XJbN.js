import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{U as t,d as n,t as r}from"./createLucideIcon-nGl6uDlp.js";import{a as i,i as a,s as o,t as s,u as c}from"./app-shell-BYETOE4P.js";import{n as l,t as u}from"./share-2-CXkkLLsw.js";import{c as d,d as f,f as p,l as m,o as h}from"./use-snapshot-CN6I3Mo0.js";import{t as g,x as _}from"./index-CSePpp_1.js";var v=r(`copy`,[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`}]]),y=r(`printer`,[[`path`,{d:`M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2`,key:`143wyd`}],[`path`,{d:`M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6`,key:`1itne7`}],[`rect`,{x:`6`,y:`14`,width:`12`,height:`8`,rx:`1`,key:`1ue0tg`}]]),b=e(t());function x(e){let t=e==null?``:String(e);return/[;"\n]/.test(t)?`"${t.replace(/"/g,`""`)}"`:t}function S(e){return`\uFEFF${[[`Data`,`Início`,`Término`,`Duração`,`Obra`,`Rua`,`Máquina`,`Atividade`,`Estaca`,`PV`,`Qtd`,`Observações`,`Descrição`,`Latitude`,`Longitude`,`Local GPS`],...e.map(e=>{let t=e.end?i(o(e.start,e.end)):`em andamento`;return[a(e.date),e.start,e.end??``,t,e.workName,e.streetName,e.equipmentName,e.activityName,e.estaca,e.pv,e.quantity??``,e.notes,e.description,e.lat??``,e.lng??``,e.locationLabel].map(x)})].map(e=>e.join(`;`)).join(`
`)}`}function C(e,t,n){let r=new Blob([t],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}function w(e,t){let n=[...t].sort((e,t)=>e.start.localeCompare(t.start)),r=`${a(e)}`,i=n[0]?.workName??``,o=[`${r}${i?` — ${i}`:``}`,``];if(n.length===0)return o.push(`Nenhum apontamento neste dia.`),o.join(`
`);for(let e of n){let t=e.end?`${e.start}–${e.end}`:`${e.start}–…`;o.push(`${t}  ${e.equipmentName}`);let n=[e.activityName,e.streetName,e.estaca&&`Estaca ${e.estaca}`,e.pv].filter(Boolean);o.push(n.join(` — `)),e.locationLabel&&o.push(`GPS: ${e.locationLabel}`),e.notes&&o.push(`Obs: ${e.notes}`),o.push(``)}return o.join(`
`).trim()+`
`}function T(e,t){let n=window.open(``,`_blank`);n&&(n.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/>
<title>${e}</title>
<style>
  body { font-family: "Source Sans 3", "Segoe UI", sans-serif; color: #1c1814; padding: 24px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  p.meta { color: #6b6358; margin: 0 0 20px; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { border: 1px solid #ddd4c6; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #efe8db; font-weight: 600; }
  .desc { color: #6b6358; font-size: 11px; }
  @page { margin: 16mm; }
</style></head><body>${t}</body></html>`),n.document.close(),n.focus(),n.print())}var E=n();function D(){let e=g.useLoaderData(),{data:t,isLoading:n}=h(e),[r,x]=(0,b.useState)(c()),[D,k]=(0,b.useState)(c()),A=t?.apontamentos??[],j=(0,b.useMemo)(()=>[...A].filter(e=>e.date>=r&&e.date<=D).sort((e,t)=>e.date===t.date?e.start.localeCompare(t.start):e.date.localeCompare(t.date)),[A,r,D]),M=(0,b.useMemo)(()=>{let e=new Map;for(let t of j){let n=e.get(t.equipmentId)??{name:t.equipmentName,n:0,mins:0};n.n+=1,t.end&&(n.mins+=o(t.start,t.end)),e.set(t.equipmentId,n)}return[...e.values()].sort((e,t)=>t.mins-e.mins)},[j]),N=(0,b.useMemo)(()=>r===D?w(r,j):[...new Set(j.map(e=>e.date))].map(e=>w(e,j.filter(t=>t.date===e))).join(`

`),[r,D,j]);async function P(){await navigator.clipboard.writeText(N),_.success(`Diário copiado`)}async function F(){if(navigator.share){await navigator.share({title:`Diário de apontamento`,text:N});return}await P()}function I(){C(`apontamento_${r}_${D}.csv`,S(j),`text/csv;charset=utf-8`),_.success(`Planilha baixada (abre no Excel)`)}function L(){T(`Relatório de apontamento`,`
      <h1>Relatório de apontamento</h1>
      <p class="meta">${a(r)} a ${a(D)} · ${j.length} registros</p>
      <table>
        <thead><tr>
          <th>Horário</th><th>Máquina</th><th>Atividade</th><th>Rua</th><th>Estaca</th><th>PV</th>
        </tr></thead>
        <tbody>
          ${j.map(e=>`<tr>
            <td>${a(e.date)}<br/>${e.start}${e.end?`–${e.end}`:``}</td>
            <td>${O(e.equipmentName)}</td>
            <td>${O(e.activityName)}${e.notes?`<div class="desc">${O(e.notes)}</div>`:``}</td>
            <td>${O(e.streetName)}</td>
            <td>${O(e.estaca)}</td>
            <td>${O(e.pv)}</td>
          </tr>`).join(``)}
        </tbody>
      </table>`)}return n&&!t?(0,E.jsx)(s,{children:(0,E.jsx)(f,{})}):(0,E.jsxs)(s,{children:[(0,E.jsxs)(`header`,{className:`px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))]`,children:[(0,E.jsx)(`h1`,{className:`font-display text-2xl font-semibold`,children:`Relatório`}),(0,E.jsx)(`p`,{className:`text-sm text-muted`,children:`Resumo, Excel e PDF do período — de toda a equipe.`})]}),(0,E.jsxs)(`main`,{className:`flex flex-col gap-4 px-4 pb-6`,children:[(0,E.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(m,{children:`De`}),(0,E.jsx)(d,{type:`date`,value:r,onChange:e=>x(e.target.value)})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(m,{children:`Até`}),(0,E.jsx)(d,{type:`date`,value:D,onChange:e=>k(e.target.value)})]})]}),(0,E.jsxs)(`section`,{className:`rounded-xl border border-border bg-surface p-4 shadow-card`,children:[(0,E.jsxs)(`p`,{className:`text-sm text-muted`,children:[j.length,` apontamentos no período`]}),(0,E.jsxs)(`ul`,{className:`mt-3 flex flex-col gap-2`,children:[M.map(e=>(0,E.jsxs)(`li`,{className:`flex justify-between gap-3 text-sm`,children:[(0,E.jsx)(`span`,{className:`min-w-0 truncate font-medium`,children:e.name}),(0,E.jsxs)(`span`,{className:`shrink-0 tabular-nums text-muted`,children:[e.n,` · `,i(e.mins)]})]},e.name)),M.length===0?(0,E.jsx)(`li`,{className:`text-sm text-muted`,children:`Sem dados neste intervalo.`}):null]})]}),(0,E.jsxs)(`div`,{className:`grid grid-cols-2 gap-2`,children:[(0,E.jsxs)(p,{variant:`outline`,onClick:I,children:[(0,E.jsx)(l,{className:`size-4`}),`Excel`]}),(0,E.jsxs)(p,{variant:`outline`,onClick:L,children:[(0,E.jsx)(y,{className:`size-4`}),`PDF`]}),(0,E.jsxs)(p,{variant:`outline`,onClick:()=>void P(),children:[(0,E.jsx)(v,{className:`size-4`}),`Copiar`]}),(0,E.jsxs)(p,{variant:`outline`,onClick:()=>void F(),children:[(0,E.jsx)(u,{className:`size-4`}),`Enviar`]})]}),(0,E.jsx)(`pre`,{className:`overflow-x-auto whitespace-pre-wrap rounded-xl border border-border bg-surface p-4 font-sans text-sm leading-relaxed text-fg`,children:N||`Nada para exportar.`})]})]})}function O(e){return e.replace(/[&<>]/g,e=>e===`&`?`&amp;`:e===`<`?`&lt;`:e===`>`?`&gt;`:e)}export{D as component};