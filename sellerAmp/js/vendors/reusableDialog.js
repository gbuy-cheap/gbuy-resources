window.sasReusableDialog||(window.sasReusableDialog=!0,window.dialog=function(){let u,v,b,w,g=new Array(["fadeIn","fadeOut"],["slideDown","slideUp"]),k="";const m=()=>{u.classList.add("fadeOut"),v.classList.add(""+g[k][1]),setTimeout(()=>{u.remove()},200)};return{show:(e={})=>{var{title:e=null,content:a="Please entry content",okText:t="ok",cancelText:n="cancel",onOk:l=null,onCancel:d=null,maskDisabled:s=!1,isCancelable:i=!0,animation:c=1}=e,c=(k=c,i?`<div class="btn cancel-btn">${n}</div>`:""),i=e?`<b>${e}</b></br></br>`:"",n=`
    <div class="sasextcl-dialog-wrapper fadeIn">
      <div class="dialog ${g[k][0]}">
        <div class="content">${i}${a}</div>
        <div class="buttons">
          <div class="btn ok-btn">${t}</div>
          ${c}
        </div>
      </div>
    </div>
  `,e=document.createElement("div"),o=(e.innerHTML=n,document.body.appendChild(e),u=document.querySelector(".sasextcl-dialog-wrapper"),v=u.querySelector(".dialog"),b=u.querySelector(".cancel-btn"),w=u.querySelector(".ok-btn"),l),r=d,i=s;w?.addEventListener("click",e=>{m(),o&&o()}),b?.addEventListener("click",e=>{m(),r&&r()}),i&&u.addEventListener("click",e=>{e=e?.target;/sasextcl-dialog-wrapper/.test(e.className)&&m()});return u},hide:m}}());