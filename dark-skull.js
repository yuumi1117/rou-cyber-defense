/* Decorative only: does not alter gameplay or send data. */
(() => {
  if (document.getElementById('rou-skull-backdrop')) return;
  const holder=document.createElement('div');
  holder.id='rou-skull-backdrop';
  holder.setAttribute('aria-hidden','true');
  holder.innerHTML=`<svg viewBox="0 0 500 590" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rouBone" x2="1" y2="1"><stop stop-color="#ff4c75"/><stop offset="1" stop-color="#4ceaff"/></linearGradient></defs><path d="M250 40C127 40 73 129 77 245c2 77 37 123 75 151l13 112h170l13-112c42-31 75-78 75-151C427 129 373 40 250 40Z" fill="#0d1423" stroke="url(#rouBone)" stroke-width="12"/><path d="M118 247c9-62 103-55 110 16 6 60-70 83-100 39-11-15-14-34-10-55Zm264 0c-9-62-103-55-110 16-6 60 70 83 100 39 11-15 14-34 10-55Z" fill="#ff255b"><animate attributeName="opacity" values=".6;1;.6" dur="3s" repeatCount="indefinite"/></path><path d="m250 319-33 55h66z" fill="#ff3462"/><path d="M166 432h168M180 468h140M210 432v76m40-76v76m40-76v76" stroke="#42e8ff" stroke-width="9" stroke-linecap="round"/><path d="M110 180c20-70 68-105 140-105m140 105c-20-70-68-105-140-105" fill="none" stroke="#42e8ff" stroke-opacity=".55" stroke-width="5"/></svg>`;
  document.body.prepend(holder);
})();
