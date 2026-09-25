import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{U as t,d as n,t as r}from"./createLucideIcon-nGl6uDlp.js";import{a as i,i as a,s as o,t as s,u as c}from"./app-shell-CD1POVcg.js";import{n as l,t as u}from"./share-2-CXkkLLsw.js";import{A as d,o as f}from"./use-snapshot-EfZ2o5Bt.js";import{r as p}from"./index-CgIddRwR.js";import{t as m}from"./screen-loader-Dyi_pxkm.js";import{n as h,t as g}from"./input-Dm0tYSIs.js";var _=r(`copy`,[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`}]]),v=r(`printer`,[[`path`,{d:`M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2`,key:`143wyd`}],[`path`,{d:`M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6`,key:`1itne7`}],[`rect`,{x:`6`,y:`14`,width:`12`,height:`8`,rx:`1`,key:`1ue0tg`}]]),y=e(t());function b(e){let t=e==null?``:String(e);return/[;"\n]/.test(t)?`"${t.replace(/"/g,`""`)}"`:t}function x(e){return`\uFEFF${[[`Data`,`Início`,`Término`,`Duração`,`Obra`,`Rua`,`Máquina`,`Atividade`,`Estaca`,`PV`,`Qtd`,`Observações`,`Descrição`,`Latitude`,`Longitude`,`Local GPS`],...e.map(e=>{let t=e.end?i(o(e.start,e.end)):`em andamento`;return[a(e.date),e.start,e.end??``,t,e.workName,e.streetName,e.equipmentName,e.activityName,e.estaca,e.pv,e.quantity??``,e.notes,e.description,e.lat??``,e.lng??``,e.locationLabel].map(b)})].map(e=>e.join(`;`)).join(`
`)}`}function S(e,t,n){let r=new Blob([t],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}function C(e,t){let n=[...t].sort((e,t)=>e.start.localeCompare(t.start)),r=`${a(e)}`,i=n[0]?.workName??``,o=[`${r}${i?` — ${i}`:``}`,``];if(n.length===0)return o.push(`Nenhum apontamento neste dia.`),o.join(`
`);for(let e of n){let t=e.end?`${e.start}–${e.end}`:`${e.start}–…`;o.push(`${t}  ${e.equipmentName}`);let n=[e.activityName,e.streetName,e.estaca&&`Estaca ${e.estaca}`,e.pv].filter(Boolean);o.push(n.join(` — `)),e.locationLabel&&o.push(`GPS: ${e.locationLabel}`),e.notes&&o.push(`Obs: ${e.notes}`),o.push(``)}return o.join(`
`).trim()+`
`}function w(e,t){let n=window.open(``,`_blank`);n&&(n.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/>
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
</style></head><body>${t}</body></html>`),n.document.close(),n.focus(),n.print())}var T=n();function E(){let{data:e,isLoading:t}=f(),[n,r]=(0,y.useState)(c()),[b,E]=(0,y.useState)(c()),O=e?.apontamentos??[],k=(0,y.useMemo)(()=>[...O].filter(e=>e.date>=n&&e.date<=b).sort((e,t)=>e.date===t.date?e.start.localeCompare(t.start):e.date.localeCompare(t.date)),[O,n,b]),A=(0,y.useMemo)(()=>{let e=new Map;for(let t of k){let n=e.get(t.equipmentId)??{name:t.equipmentName,n:0,mins:0};n.n+=1,t.end&&(n.mins+=o(t.start,t.end)),e.set(t.equipmentId,n)}return[...e.values()].sort((e,t)=>t.mins-e.mins)},[k]),j=(0,y.useMemo)(()=>n===b?C(n,k):[...new Set(k.map(e=>e.date))].map(e=>C(e,k.filter(t=>t.date===e))).join(`

`),[n,b,k]);async function M(){await navigator.clipboard.writeText(j),p.success(`Diário copiado`)}async function N(){if(navigator.share){await navigator.share({title:`Diário de apontamento`,text:j});return}await M()}function P(){S(`apontamento_${n}_${b}.csv`,x(k),`text/csv;charset=utf-8`),p.success(`Planilha baixada (abre no Excel)`)}function F(){w(`Relatório de apontamento`,`
      <h1>Relatório de apontamento</h1>
      <p class="meta">${a(n)} a ${a(b)} · ${k.length} registros</p>
      <table>
        <thead><tr>
          <th>Horário</th><th>Máquina</th><th>Atividade</th><th>Rua</th><th>Estaca</th><th>PV</th>
        </tr></thead>
        <tbody>
          ${k.map(e=>`<tr>
            <td>${a(e.date)}<br/>${e.start}${e.end?`–${e.end}`:``}</td>
            <td>${D(e.equipmentName)}</td>
            <td>${D(e.activityName)}${e.notes?`<div class="desc">${D(e.notes)}</div>`:``}</td>
            <td>${D(e.streetName)}</td>
            <td>${D(e.estaca)}</td>
            <td>${D(e.pv)}</td>
          </tr>`).join(``)}
        </tbody>
      </table>`)}return t&&!e?(0,T.jsx)(s,{children:(0,T.jsx)(m,{})}):(0,T.jsxs)(s,{children:[(0,T.jsxs)(`header`,{className:`px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))]`,children:[(0,T.jsx)(`h1`,{className:`font-display text-2xl font-semibold`,children:`Relatório`}),(0,T.jsx)(`p`,{className:`text-sm text-muted`,children:`Resumo, Excel e PDF do período — de toda a equipe.`})]}),(0,T.jsxs)(`main`,{className:`flex flex-col gap-4 px-4 pb-6`,children:[(0,T.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,T.jsxs)(`div`,{children:[(0,T.jsx)(h,{children:`De`}),(0,T.jsx)(g,{type:`date`,value:n,onChange:e=>r(e.target.value)})]}),(0,T.jsxs)(`div`,{children:[(0,T.jsx)(h,{children:`Até`}),(0,T.jsx)(g,{type:`date`,value:b,onChange:e=>E(e.target.value)})]})]}),(0,T.jsxs)(`section`,{className:`rounded-xl border border-border bg-surface p-4 shadow-card`,children:[(0,T.jsxs)(`p`,{className:`text-sm text-muted`,children:[k.length,` apontamentos no período`]}),(0,T.jsxs)(`ul`,{className:`mt-3 flex flex-col gap-2`,children:[A.map(e=>(0,T.jsxs)(`li`,{className:`flex justify-between gap-3 text-sm`,children:[(0,T.jsx)(`span`,{className:`min-w-0 truncate font-medium`,children:e.name}),(0,T.jsxs)(`span`,{className:`shrink-0 tabular-nums text-muted`,children:[e.n,` · `,i(e.mins)]})]},e.name)),A.length===0?(0,T.jsx)(`li`,{className:`text-sm text-muted`,children:`Sem dados neste intervalo.`}):null]})]}),(0,T.jsxs)(`div`,{className:`grid grid-cols-2 gap-2`,children:[(0,T.jsxs)(d,{variant:`outline`,onClick:P,children:[(0,T.jsx)(l,{className:`size-4`}),`Excel`]}),(0,T.jsxs)(d,{variant:`outline`,onClick:F,children:[(0,T.jsx)(v,{className:`size-4`}),`PDF`]}),(0,T.jsxs)(d,{variant:`outline`,onClick:()=>void M(),children:[(0,T.jsx)(_,{className:`size-4`}),`Copiar`]}),(0,T.jsxs)(d,{variant:`outline`,onClick:()=>void N(),children:[(0,T.jsx)(u,{className:`size-4`}),`Enviar`]})]}),(0,T.jsx)(`pre`,{className:`overflow-x-auto whitespace-pre-wrap rounded-xl border border-border bg-surface p-4 font-sans text-sm leading-relaxed text-fg`,children:j||`Nada para exportar.`})]})]})}function D(e){return e.replace(/[&<>]/g,e=>e===`&`?`&amp;`:e===`<`?`&lt;`:e===`>`?`&gt;`:e)}export{E as component};