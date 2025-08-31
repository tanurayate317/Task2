
const exprEl = document.getElementById("expr");
const previewEl = document.getElementById("preview");
const keys = document.querySelector(".keys");


let rawExpression = "0";
const OPS = new Set(["+", "-", "*", "/"]);


const toDisplay = (expr) => expr.replace(/\//g, "÷").replace(/\*/g, "×");


function matchLastNumber() {
  
  return rawExpression.match(/(-?\d*\.?\d+)$/);
}

function render() {
  exprEl.textContent = toDisplay(rawExpression);
  updatePreview();
}

function updatePreview() {
  try {
    if (
      !rawExpression ||
      OPS.has(rawExpression.slice(-1)) ||
      rawExpression.endsWith(".")
    ) {
      previewEl.textContent = "";
      return;
    }
    const val = Function(`"use strict";return (${rawExpression})`)();
    previewEl.textContent = Number.isFinite(val) ? String(val) : "";
  } catch {
    previewEl.textContent = "";
  }
}


function clearAll() {
  rawExpression = "0";
}

function backspace() {
  rawExpression = rawExpression.length > 1 ? rawExpression.slice(0, -1) : "0";
}

function appendDigit(d) {
  rawExpression = rawExpression === "0" ? d : rawExpression + d;
}

function appendDot() {
  const m = matchLastNumber();
  if (m && m[0].includes(".")) return; 
  if (!m) {
   
    rawExpression += (rawExpression === "0" ? "" : "") + "0.";
  } else {
    rawExpression += ".";
  }
}

function appendOp(op) {
  if (!rawExpression) rawExpression = "0";
  const last = rawExpression.slice(-1);
  if (OPS.has(last)) {
    rawExpression = rawExpression.slice(0, -1) + op; 
  } else {
    rawExpression += op;
  }
}

function percent() {
  const m = matchLastNumber();
  if (!m) return;
  const start = m.index;
  const num = parseFloat(m[0]);
  if (Number.isNaN(num)) return;
  const replaced = (num / 100).toString();
  rawExpression = rawExpression.slice(0, start) + replaced;
}

function toggleSign() {
  const m = matchLastNumber();
  if (!m) return;
  const start = m.index;
  const num = parseFloat(m[0]);
  if (Number.isNaN(num)) return;
  const toggled = (-num).toString();
  rawExpression = rawExpression.slice(0, start) + toggled;
}

function equals() {
  try {
    const val = Function(`"use strict";return (${rawExpression})`)();
    rawExpression = Number.isFinite(val) ? String(val) : "0";
  } catch {
    rawExpression = "Error";
    render();
    setTimeout(() => {
      rawExpression = "0";
      render();
    }, 900);
    return;
  }
}


keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const value = btn.dataset.value;
  const op = btn.dataset.op;
  const action = btn.dataset.action;

  if (value) {
    // digits
    appendDigit(value);
  } else if (op) {
    appendOp(op);
  } else if (action) {
    if (action === "clear") clearAll();
    else if (action === "delete") backspace();
    else if (action === "equals") equals();
    else if (action === "sign") toggleSign();
    else if (action === "percent") percent();
    else if (action === "dot") appendDot();
  }
  render();
});


document.addEventListener("keydown", (e) => {
  const k = e.key;

  if (/^\d$/.test(k)) {
    appendDigit(k);
  } else if (k === ".") {
    appendDot();
  } else if (k === "+" || k === "-" || k === "*" || k === "/") {
    appendOp(k);
  } else if (k === "Enter" || k === "=") {
    e.preventDefault();
    equals();
  } else if (k === "Backspace") {
    backspace();
  } else if (k === "Escape" || k.toLowerCase() === "c") {
    clearAll();
  } else if (k === "%") {
    percent();
  }
  render();
});

//
