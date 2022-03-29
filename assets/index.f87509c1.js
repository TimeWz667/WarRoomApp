import{o as c,c as d,a as e,w as m,v as x,F as v,r as _,t as u,b as h,d as L,e as N,p as b,f as y,g as I,h as P,i as S,j as $,k as D}from"./vendor.a96da475.js";const w=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function i(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerpolicy&&(a.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?a.credentials="include":o.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=i(o);fetch(o.href,a)}};w();var g=[{Name:"CS",Desc:"Demand generation",Clicked:!1,Pars:[{name:"Scale",label:"Coverage",value:0,min:0,max:1}]},{Name:"TPT",Desc:"TB preventive therapy",Clicked:!1,Pars:[{name:"Scale",label:"Coverage",value:0,min:0,max:1}]},{Name:"PPM",Desc:"Private-public mixing",Clicked:!1,Pars:[{name:"Scale",label:"Coverage",value:.35,min:0,max:1}]},{Name:"UACF",Desc:"Active case-finding, Urban slum",Clicked:!1,Pars:[{name:"Scale",label:"Coverage",value:0,min:0,max:1}]},{Name:"ImpDx",Desc:"Improved TB diagnosis",Clicked:!1,Pars:[{name:"Dx",label:"Diagnosis",value:.95,min:0,max:1},{name:"TxI",label:"Tx initialisation",value:.8,min:0,max:1},{name:"Def",label:"Tx compliance",value:1,min:0,max:1}]}];var k=(t,n)=>{const i=t.__vccOpts||t;for(const[r,o]of n)i[r]=o;return i};const U={name:"Controller",data:function(){return{Locations:["India","North","East","West","South"],SelLoc:"India",CurLoc:"India",YearEnd:2025,Intv0:JSON.stringify(g),IntvForm:g}},methods:{updateSettings:function(t){t.preventDefault(),this.CurLoc=this.SelLoc;const n={Location:this.CurLoc,YearEnd:+this.YearEnd};this.$emit("setting_update",n)},updateIntv(t){t.preventDefault();const n=this.IntvForm.filter(i=>i.Clicked).reduce((i,r)=>(i[r.Name]=r.Pars.reduce((o,a)=>(o[a.name]=a.value,o),{}),i),{});this.$emit("intv_update",n)},resetIntv(t){t.preventDefault(),this.IntvForm=JSON.parse(this.Intv0),this.updateIntv(t)}}},f=t=>(b("data-v-235c156a"),t=t(),y(),t),V={id:"location"},Y=f(()=>e("h4",null,"Settings",-1)),E={class:"form-group"},O={class:"form-floating mb-12 mt-12"},T=["value"],F={for:"sel1",class:"form-label"},A={class:"form-group"},M=f(()=>e("label",{for:"year1"},[e("h5",null,"Proejction end:\xA0")],-1)),B={class:"form-check form-check-inline"},J=I("2025 "),K={class:"form-check form-check-inline"},j=I("2030 "),R={id:"intv"},X=f(()=>e("h4",null,"Interventions",-1)),q={class:"action"},W={class:"form-switch"},z=["onUpdate:modelValue"],G={class:"form-check-label",for:"include"},H={class:"input-group"},Q=["for"],Z=["id","name","min","max","onUpdate:modelValue"];function ee(t,n,i,r,o,a){return c(),d("div",null,[e("form",V,[Y,e("div",E,[e("div",O,[m(e("select",{class:"form-select",id:"loc_sel",name:"sel1","onUpdate:modelValue":n[0]||(n[0]=s=>t.SelLoc=s)},[(c(!0),d(v,null,_(t.Locations,s=>(c(),d("option",{value:s},u(s),9,T))),256))],512),[[x,t.SelLoc]]),e("label",F,u(`Location: (current=${t.CurLoc})`),1)])]),e("div",A,[M,e("div",B,[m(e("input",{type:"radio",class:"form-check-input",name:"year1",value:"2025","onUpdate:modelValue":n[1]||(n[1]=s=>t.YearEnd=s),checked:""},null,512),[[h,t.YearEnd]]),J]),e("div",K,[m(e("input",{type:"radio",class:"form-check-input",name:"year1",value:"2030","onUpdate:modelValue":n[2]||(n[2]=s=>t.YearEnd=s)},null,512),[[h,t.YearEnd]]),j])]),e("button",{type:"submit",class:"btn btn-block btn-primary",onClick:n[3]||(n[3]=(...s)=>a.updateSettings&&a.updateSettings(...s))},"Update")]),e("form",R,[X,(c(!0),d(v,null,_(t.IntvForm,s=>(c(),d("div",q,[e("div",W,[m(e("input",{class:"form-check-input",role:"switch",type:"checkbox",id:"include","onUpdate:modelValue":l=>s.Clicked=l},null,8,z),[[L,s.Clicked]]),e("label",G,[e("h5",null,u(`\xA0${s.Desc}`),1)])]),(c(!0),d(v,null,_(s.Pars,l=>(c(),d("div",H,[e("label",{for:l.name},u(l.label+" "+Math.round(l.value*100)+"%"),9,Q),m(e("input",{class:"form-control",id:l.name,name:l.name,type:"range",min:l.min,max:l.max,step:"0.01","onUpdate:modelValue":C=>l.value=C},null,8,Z),[[N,l.value]])]))),256))]))),256)),e("button",{type:"submit",class:"btn btn-primary",onClick:n[4]||(n[4]=(...s)=>a.updateIntv&&a.updateIntv(...s))},"Update"),e("button",{type:"submit",class:"btn btn-warning",onClick:n[5]||(n[5]=(...s)=>a.resetIntv&&a.resetIntv(...s))},"Reset")])])}var te=k(U,[["render",ee],["__scopeId","data-v-235c156a"]]);const ne={name:"Preview",components:{Controller:te},data(){return{Settings:["Settings"],Interventions:["Interventions"]}},methods:{updateSettings(t){this.Settings=t},updateInterventions(t){this.Interventions=t}}},p=t=>(b("data-v-3be5f3ad"),t=t(),y(),t),se={class:"container"},oe={class:"row"},ae={class:"col-4"},le={class:"col-8"},ie={class:"row"},re=p(()=>e("div",{class:"col-6 figure-slot"},[e("h4",null,"Key figure 1: incidence"),e("p",null,"X-axis: Year"),e("p",null,"Y-axis: Annual rate per 100 000")],-1)),ce=p(()=>e("div",{class:"col-6 figure-slot"},[e("h4",null,"Key figure 2: mortality"),e("p",null,"X-axis: Year"),e("p",null,"Y-axis: Annual rate per 100 000")],-1)),de={class:"col-6"},ue=p(()=>e("h4",null,"Input: simulation settings",-1)),me={class:"col-6"},pe=p(()=>e("h4",null,"Input: interventions",-1));function ve(t,n,i,r,o,a){const s=P("controller");return c(),d("div",se,[e("div",oe,[e("div",ae,[S(s,{onSetting_update:n[0]||(n[0]=l=>a.updateSettings(l)),onIntv_update:n[1]||(n[1]=l=>a.updateInterventions(l))})]),e("div",le,[e("div",ie,[re,ce,e("div",de,[ue,e("p",null,u(JSON.stringify(o.Settings,null,5)),1)]),e("div",me,[pe,e("p",null,u(JSON.stringify(o.Interventions,null,5)),1)])])])])])}var _e=k(ne,[["render",ve],["__scopeId","data-v-3be5f3ad"]]);const fe={setup(t){return(n,i)=>(c(),d("div",null,[S(_e)]))}};$(fe).use(D).mount("#app");