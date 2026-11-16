 (function(){
var KEY="casualPay.v1",S,tab="entries";
var R=[["Harvesting",150],["Bags of loose fruits",1000],["Uprooting & Supplying Nursery Palms",100],["Digging, Planting and Netting Palms",400],["Cutting of Net & Binding Wires",3000],["Round Weeding (Planted Areas)",3000],["Slashing",0],["Pruning",150],["Weeding of the Nursery",3000],["Bagging of Nursery Bags",3000],["Uprooting/Planting of Sprouts",25],["Work in the Nursery",25],["Packing of Gravels",25],["Weeding of the Lodge, etc",25],["Mill Work",25],["Kernel cracking",800],["Wood Carrying",25],["Deduction (medical)",-1],["Deduction (others)",-1]];
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function seed(){
 var L=[],H=[["Hassan Yaya",177,81],["Ofem Okon Eyong",249,110],["Innocent Oju",139,175],["Kelvin Ankpo",97,0],["Goodluck Victor",135,56],["Friday Ibiang",432,278],["Godfrey Inyang",33,0],["Jacob Usang",181,146],["Eno Esu Usang",165,0],["Kingsley Victor",34,0],["Officer Thankgod",244,0],["Bright Bassey",157,104],["Destiny Akpan",85,81]];
 var W2="2026-11-02",W3="2026-11-09",W4="2026-11-16";
 function a(w,n,t,q,r){L.push({id:uid(),wk:w,worker:n,task:t,qty:q,rate:r==null?"":r})}
 H.forEach(function(h){if(h[1])a(W2,h[0],"Harvesting",h[1]);if(h[2])a(W3,h[0],"Harvesting",h[2])});
 [["Godwin Omini",1,5],["Rejoice Omini",2,3],["Peace Godwin",2,5],["Jemila Mustapha",2,4],["Joy Peters",0,4],["Blessing Arekong",0,4]].forEach(function(m){if(m[1])a(W2,m[0],"Mill Work",m[1],3000);if(m[2])a(W3,m[0],"Mill Work",m[2],3000)});
 a(W3,"Hassan Yaya","Deduction (medical)",1000);a(W2,"Peace Godwin","Deduction (medical)",2500);a(W2,"Bright Bassey","Deduction (medical)",7500);a(W4,"Okoro Edwin","Deduction (medical)",300);
 return{lines:L,rates:R.map(function(r){return{task:r[0],rate:r[1]}}),workers:{},paid:{},wk:W3,weeks:[W2,W3,W4]};
}
function load(){try{var s=localStorage.getItem(KEY);if(s){S=JSON.parse(s);return}}catch(e){}S=seed()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function tier(n){return n<=0?0:n<50.5?1500:n<70.5?2500:n<100.5?3000:n<150.5?5000:n<200.5?7000:n<250.5?8000:10000}
function rateOf(t){var r=S.rates.filter(function(x){return x.task===t})[0];return r?+r.rate||0:0}
function amt(l){var r=(l.rate===""||l.rate==null)?rateOf(l.task):+l.rate;return (+l.qty||0)*r}
function isDed(t){return t.indexOf("Deduction")===0}
function N(n){return (n<0?"-":"")+"₦"+Math.abs(Math.round(n*100)/100).toLocaleString("en-NG")}
function E(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function weeks(){var s={};S.weeks.forEach(function(w){s[w]=1});S.lines.forEach(function(l){s[l.wk]=1});s[S.wk]=1;return Object.keys(s).sort()}
function lab(w){var d=new Date(w+"T00:00:00");return d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
function calc(){
 var m={};S.lines.filter(function(l){return l.wk===S.wk&&l.worker}).forEach(function(l){
  var p=m[l.worker]||(m[l.worker]={h:0,hAmt:0,o:0,d:0});var a=amt(l);
  if(l.task==="Harvesting"){p.h+=+l.qty||0;p.hAmt+=a}else if(isDed(l.task))p.d+=-a;else p.o+=a});
 Object.keys(m).forEach(function(k){var p=m[k];p.pack=tier(p.h);p.net=p.hAmt+p.pack+p.o-p.d});
 return m;
}
function opts(list,v){return list.map(function(o){return "<option"+(o===v?" selected":"")+">"+E(o)+"</option>"}).join("")}
var $=function(i){return document.getElementById(i)};
function render(){
 $("wk").innerHTML=weeks().map(function(w){return '<option value="'+w+'"'+(w===S.wk?" selected":"")+">"+lab(w)+"</option>"}).join("");
 ["entries","pay","rates"].forEach(function(t){$("s-"+t).hidden=t!==tab});
 document.querySelectorAll("[data-tab]").forEach(function(b){b.setAttribute("aria-selected",b.dataset.tab===tab)});
 var C=calc(),ks=Object.keys(C).sort(),g=0,d=0;ks.forEach(function(k){g+=C[k].hAmt+C[k].pack+C[k].o;d+=C[k].d});
 $("tt").innerHTML='<div class="t"><span>Gross pay</span><b>'+N(g)+'</b></div><div class="t"><span>Deductions</span><b>'+N(d)+'</b></div><div class="t"><span>Total due</span><b>'+N(g-d)+'</b></div><div class="t"><span>Workers</span><b>'+ks.length+"</b></div>";
 var wk=S.lines.filter(function(l){return l.wk===S.wk});
 $("eb").innerHTML=wk.map(function(l){return '<tr data-id="'+l.id+'"><td><input data-f="worker" list="wl" value="'+E(l.worker)+'" aria-label="Worker"></td><td><select data-f="task" aria-label="Task">'+opts(S.rates.map(function(r){return r.task}),l.task)+'</select></td><td class="n"><input data-f="qty" inputmode="decimal" value="'+E(l.qty)+'" aria-label="Quantity"></td><td class="n"><input data-f="rate" inputmode="decimal" placeholder="'+rateOf(l.task)+'" value="'+E(l.rate)+'" aria-label="Rate"></td><td class="c'+(amt(l)<0?" neg":"")+'">'+N(amt(l))+'</td><td class="x"><button data-del aria-label="Delete entry">✕</button></td></tr>'}).join("");
 $("ee").hidden=wk.length>0;
 var names={};S.lines.forEach(function(l){if(l.worker)names[l.worker]=1});
 $("wl").innerHTML=Object.keys(names).sort().map(function(n){return "<option>"+E(n)+"</option>"}).join("");
 var tot={h:0,p:0,o:0,d:0,n:0};
 $("pb").innerHTML=ks.map(function(k){var p=C[k],w=S.workers[k]||{},id=S.wk+"|"+k;tot.h+=p.hAmt;tot.p+=p.pack;tot.o+=p.o;tot.d+=p.d;tot.n+=p.net;
  return '<tr data-w="'+E(k)+'"><td style="padding:8px 10px">'+E(k)+'</td><td class="c">'+N(p.hAmt)+'</td><td class="c">'+N(p.pack)+'</td><td class="c">'+N(p.o)+'</td><td class="c">'+N(p.d)+'</td><td class="c"><b>'+N(p.net)+'</b></td><td><input data-b="bank" value="'+E(w.bank)+'" aria-label="Bank"></td><td><input data-b="acct" value="'+E(w.acct)+'" aria-label="Account number"></td><td style="text-align:center"><input type="checkbox" data-paid="'+E(id)+'" '+(S.paid[id]?"checked":"")+' aria-label="Paid" style="width:auto"></td></tr>'}).join("");
 $("pf").innerHTML=ks.length?"<tr><td>Total</td><td>"+N(tot.h)+"</td><td>"+N(tot.p)+"</td><td>"+N(tot.o)+"</td><td>"+N(tot.d)+"</td><td>"+N(tot.n)+'</td><td colspan="3"></td></tr>':"";
 $("pe").hidden=ks.length>0;
 $("rb").innerHTML=S.rates.map(function(r,i){return '<tr data-i="'+i+'"><td style="padding:8px 10px">'+E(r.task)+'</td><td class="n"><input data-r inputmode="decimal" value="'+E(r.rate)+'" aria-label="Rate for '+E(r.task)+'"></td></tr>'}).join("");
}
document.querySelectorAll("[data-tab]").forEach(function(b){b.addEventListener("click",function(){tab=b.dataset.tab;render()})});
$("wk").addEventListener("change",function(){S.wk=this.value;save();render()});
$("addwk").addEventListener("click",function(){var v=$("newwk").value;if(!v)return;S.wk=v;S.weeks.push(v);save();render()});
$("add").addEventListener("click",function(){S.lines.push({id:uid(),wk:S.wk,worker:"",task:"Harvesting",qty:"",rate:""});save();render();var i=document.querySelectorAll('#eb tr:last-child input')[0];if(i)i.focus()});
$("eb").addEventListener("change",function(e){var f=e.target.dataset.f;if(!f)return;var id=e.target.closest("tr").dataset.id;
 S.lines.forEach(function(l){if(l.id===id){var v=e.target.value;if(f==="qty"||f==="rate")v=v===""?"":parseFloat(String(v).replace(/[^0-9.\-]/g,""))||0;l[f]=v}});save();render()});
$("eb").addEventListener("click",function(e){if(!e.target.hasAttribute("data-del"))return;var id=e.target.closest("tr").dataset.id;S.lines=S.lines.filter(function(l){return l.id!==id});save();render()});
$("pb").addEventListener("change",function(e){var t=e.target,tr=t.closest("tr");
 if(t.dataset.b){var k=tr.dataset.w;S.workers[k]=S.workers[k]||{};S.workers[k][t.dataset.b]=t.value;save()}
 else if(t.dataset.paid){S.paid[t.dataset.paid]=t.checked;save()}});
$("rb").addEventListener("change",function(e){if(!e.target.hasAttribute("data-r"))return;S.rates[+e.target.closest("tr").dataset.i].rate=parseFloat(e.target.value)||0;save();render()});
$("copy").addEventListener("click",function(){var b=this,C=calc(),rows=[["Worker","Harvest","Packing","Other work","Deductions","Total due","Bank","Account no."]];
 Object.keys(C).sort().forEach(function(k){var p=C[k],w=S.workers[k]||{};rows.push([k,p.hAmt,p.pack,p.o,p.d,p.net,w.bank||"",w.acct||""])});
 var csv=rows.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"'}).join(",")}).join("\n");
 function fail(){b.textContent="Copy not allowed here";setTimeout(function(){b.textContent="Copy pay list as CSV"},2000)}
 try{navigator.clipboard.writeText(csv).then(function(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy pay list as CSV"},1500)},fail)}catch(x){fail()}});
load();render();
})(); 
