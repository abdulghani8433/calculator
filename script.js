// Simple calculator logic
(() => {
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');

  function appendToDisplay(val){
    if(display.value === '0' && val !== '.') display.value = val;
    else display.value += val;
  }

  function clear(){ display.value = ''; }
  function del(){ display.value = display.value.slice(0, -1); }

  function safeEval(expr){
    // Very small sanitizer to prevent identifiers/calls
    if(/[a-zA-Z]/.test(expr)) throw new Error('Invalid characters');
    // Replace unicode division/multiplication with JS operators if present
    expr = expr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
    // Disallow consecutive operators like ++ or ***(except ** allowed for exponent)
    if(/[^0-9\.\)]\s*[+\-*/%]{2,}/.test(expr)) throw new Error('Malformed expression');
    // eslint-disable-next-line no-new-func
    return Function('return (' + expr + ')')();
  }

  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const action = btn.dataset.action;
    const val = btn.dataset.value;
    if(action === 'clear') return clear();
    if(action === 'delete') return del();
    if(action === 'calculate'){
      try{
        const result = safeEval(display.value || '0');
        display.value = String(result);
      }catch(err){
        display.value = 'Error';
        setTimeout(()=>{display.value='';},1200);
      }
      return;
    }
    appendToDisplay(val);
  });

  // keyboard support
  window.addEventListener('keydown', (e) => {
    if((e.key >= '0' && e.key <= '9') || ['+','-','*','/','.','%','(',')'].includes(e.key)){
      appendToDisplay(e.key);
      e.preventDefault();
    } else if(e.key === 'Enter'){
      e.preventDefault();
      try{ display.value = String(safeEval(display.value || '0')); }catch(err){ display.value = 'Error'; setTimeout(()=>{display.value='';},1200); }
    } else if(e.key === 'Backspace'){
      del();
      e.preventDefault();
    } else if(e.key === 'Escape'){
      clear();
      e.preventDefault();
    }
  });

  // initialize
  clear();
})();
