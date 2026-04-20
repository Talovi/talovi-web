(function() {
  if (document.getElementById('talovi-widget')) return;

  /* ── Config ──────────────────────────────────────────────── */
  var config = (function() {
    var script = document.currentScript ||
      document.querySelector('script[data-key]');
    return {
      key:    script.getAttribute('data-key')    || '',
      domain: script.getAttribute('data-domain') || 'general',
      theme:  script.getAttribute('data-theme')  || 'dark',
      title:  script.getAttribute('data-title')  || 'AI Assistant',
      color:  script.getAttribute('data-color')  || '#534AB7'
    };
  })();

  /* ── Pricing constants ───────────────────────────────────── */
  var PRICING = {
    claude: { input: 0.000003,  output: 0.000015 },
    gemini: { input: 0.000001,  output: 0.000002 },
    grok:   { input: 0.000005,  output: 0.000015 },
    ollama: { input: 0.0,       output: 0.0       }
  };

  var STORAGE_KEY = 'talovi_total_spend';

  function loadTotal()  { return parseFloat(localStorage.getItem(STORAGE_KEY) || '0'); }
  function saveTotal(v) { localStorage.setItem(STORAGE_KEY, v.toFixed(8)); }

  function formatCost(cost) {
    if (cost === 0) return '$0.0000';
    var magnitude = Math.floor(Math.log10(cost));
    var decimals  = Math.max(4, -magnitude + 1);
    return '$' + cost.toFixed(decimals);
  }

  function calcCost(inputTokens, outputTokens) {
    var rates = PRICING.claude; // widget calls Claude directly
    return (inputTokens * rates.input) + (outputTokens * rates.output);
  }

  /* ── State ───────────────────────────────────────────────── */
  var history     = [];
  var isOpen      = false;
  var sessionCost = 0;

  /* ── Domain data ─────────────────────────────────────────── */
  var systemPrompts = {
    healthcare: 'You are a helpful AI assistant for a healthcare business. Help with patient communication, appointment scheduling, billing questions, and general health information. Always recommend consulting a licensed medical professional for medical advice. Be warm, clear, and professional.',
    legal:      'You are a helpful AI assistant for a legal business. Help with general legal questions, document information, and scheduling. Always recommend consulting a licensed attorney for specific legal advice. Be professional and precise.',
    realestate: 'You are a helpful AI assistant for a real estate business. Help with property questions, scheduling viewings, market information, and buyer/seller guidance. Be helpful, knowledgeable, and responsive.',
    retail:     'You are a helpful AI assistant for a retail or hospitality business. Help with product questions, orders, returns, reservations, and customer service. Be friendly, efficient, and solution-focused.',
    general:    'You are a helpful AI assistant for a small business. Help with general inquiries, scheduling, product or service questions, and customer support. Be professional, friendly, and helpful.'
  };

  var greetings = {
    healthcare: 'Hello! How can I help you today? I can assist with appointments, billing questions, and general health information.',
    legal:      'Hello! How can I assist you today? I can help with general legal questions and scheduling.',
    realestate: 'Hello! Looking to buy, sell, or rent? I am here to help with all your real estate questions.',
    retail:     'Hello! Welcome! How can I help you today? I can assist with products, orders, and more.',
    general:    'Hello! How can I help you today?'
  };

  var domainLabels = {
    healthcare: 'Healthcare Assistant',
    legal:      'Legal Assistant',
    realestate: 'Real Estate Assistant',
    retail:     'Retail Assistant',
    general:    'AI Assistant'
  };

  /* ── Styles ──────────────────────────────────────────────── */
  var styles = document.createElement('style');
  styles.textContent = [
    '#talovi-widget * { box-sizing:border-box; margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }',

    '#talovi-widget-btn {',
    '  position:fixed; bottom:24px; right:24px;',
    '  width:56px; height:56px; border-radius:50%;',
    '  background:' + config.color + '; border:none;',
    '  cursor:pointer; z-index:999998;',
    '  box-shadow:0 4px 12px rgba(0,0,0,.3);',
    '  display:flex; align-items:center; justify-content:center;',
    '  transition:transform .2s, box-shadow .2s;',
    '}',
    '#talovi-widget-btn:hover { transform:scale(1.1); box-shadow:0 6px 20px rgba(0,0,0,.4); }',
    '#talovi-widget-btn svg { width:24px; height:24px; fill:white; }',

    '#talovi-widget-panel {',
    '  position:fixed; bottom:88px; right:24px;',
    '  width:340px; height:520px;',
    '  background:#0d1117; border-radius:16px;',
    '  border:1px solid #30363d;',
    '  box-shadow:0 8px 32px rgba(0,0,0,.4);',
    '  z-index:999999; display:none; flex-direction:column; overflow:hidden;',
    '  animation:talovi-slide-up .3s ease;',
    '}',
    '#talovi-widget-panel.open { display:flex; }',
    '@keyframes talovi-slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }',

    /* header */
    '#talovi-widget-header {',
    '  background:' + config.color + '; padding:14px 16px;',
    '  display:flex; align-items:center; justify-content:space-between;',
    '  flex-shrink:0;',
    '}',
    '#talovi-widget-header-title { color:#fff; font-size:14px; font-weight:600; }',
    '#talovi-widget-header-sub   { color:rgba(255,255,255,.7); font-size:11px; margin-top:2px; }',
    '#talovi-widget-header-actions { display:flex; align-items:center; gap:6px; }',

    '#talovi-widget-cost-tab {',
    '  background:rgba(255,255,255,.15); border:none; color:#fff;',
    '  cursor:pointer; font-size:11px; font-weight:600;',
    '  padding:3px 8px; border-radius:4px; line-height:1.4;',
    '  transition:background .15s;',
    '}',
    '#talovi-widget-cost-tab:hover { background:rgba(255,255,255,.25); }',
    '#talovi-widget-cost-tab.active { background:rgba(0,0,0,.25); }',

    '#talovi-widget-close {',
    '  background:none; border:none; color:#fff;',
    '  cursor:pointer; font-size:18px; padding:0 4px; opacity:.8; line-height:1;',
    '}',
    '#talovi-widget-close:hover { opacity:1; }',

    /* chat view */
    '#talovi-widget-messages {',
    '  flex:1; overflow-y:auto; padding:16px;',
    '  display:flex; flex-direction:column; gap:10px;',
    '  background:#111520;',
    '}',

    '.talovi-msg { display:flex; flex-direction:column; }',
    '.talovi-msg.user      { align-items:flex-end; }',
    '.talovi-msg.assistant { align-items:flex-start; }',

    '.talovi-msg-bubble {',
    '  max-width:85%; padding:10px 13px; border-radius:12px;',
    '  font-size:13px; line-height:1.55;',
    '}',
    '.talovi-msg.user .talovi-msg-bubble {',
    '  background:' + config.color + '; color:#fff;',
    '  border-radius:12px 4px 12px 12px;',
    '}',
    '.talovi-msg.assistant .talovi-msg-bubble {',
    '  background:#161b22; color:#e6edf3;',
    '  border:.5px solid #30363d;',
    '  border-radius:4px 12px 12px 12px;',
    '}',
    '.talovi-msg-bubble strong { color:#e6edf3; font-weight:600; }',
    '.talovi-msg-bubble p  { margin:.3rem 0; color:#e6edf3; font-size:inherit; line-height:inherit; }',
    '.talovi-msg-bubble p:first-child { margin-top:0; }',
    '.talovi-msg-bubble p:last-child  { margin-bottom:0; }',
    '.talovi-msg-bubble ul { padding-left:1.2rem; margin:.4rem 0; }',
    '.talovi-msg-bubble li { margin-bottom:.2rem; color:#e6edf3; }',

    /* per-message cost label */
    '.talovi-msg-cost {',
    '  font-size:10px; color:#8b949e; margin-top:3px;',
    '  padding:0 2px;',
    '}',
    '.talovi-msg.assistant .talovi-msg-cost { align-self:flex-start; padding-left:2px; }',

    /* session cost bar (above input) */
    '#talovi-cost-bar {',
    '  padding:5px 12px; font-size:10px; color:#8b949e;',
    '  background:#0d1117; border-top:1px solid #21262d;',
    '  text-align:center; display:none;',
    '}',

    /* input area */
    '#talovi-widget-input-area {',
    '  padding:12px; border-top:1px solid #30363d;',
    '  display:flex; gap:8px; background:#161b22; flex-shrink:0;',
    '}',
    '#talovi-widget-input {',
    '  flex:1; padding:9px 12px; border-radius:8px;',
    '  border:1px solid #6e7681; background:#0d1117;',
    '  color:#e6edf3; font-size:13px; outline:none;',
    '}',
    '#talovi-widget-input::placeholder { color:#8b949e; }',
    '#talovi-widget-input:focus { border-color:' + config.color + '; }',

    '#talovi-widget-send {',
    '  width:36px; height:36px; border-radius:8px;',
    '  background:' + config.color + '; border:none;',
    '  cursor:pointer; display:flex; align-items:center;',
    '  justify-content:center; flex-shrink:0; align-self:flex-end;',
    '}',
    '#talovi-widget-send:disabled { opacity:.5; cursor:not-allowed; }',
    '#talovi-widget-send svg { width:16px; height:16px; fill:white; }',

    /* cost dashboard view */
    '#talovi-cost-dashboard {',
    '  display:none; flex-direction:column; flex:1;',
    '  padding:20px 16px; gap:12px; background:#111520; overflow-y:auto;',
    '}',
    '#talovi-cost-dashboard.visible { display:flex; }',

    '.talovi-cost-row {',
    '  display:flex; justify-content:space-between; align-items:center;',
    '  padding:10px 14px; background:#161b22;',
    '  border:1px solid #30363d; border-radius:8px;',
    '}',
    '.talovi-cost-label { font-size:12px; color:#8b949e; }',
    '.talovi-cost-value { font-size:14px; font-weight:600; color:#e6edf3; font-variant-numeric:tabular-nums; }',
    '.talovi-cost-value.green { color:#5DCAA5; }',

    '#talovi-cost-reset {',
    '  margin-top:4px; padding:8px; border-radius:6px;',
    '  background:none; border:1px solid #30363d;',
    '  color:#8b949e; font-size:12px; cursor:pointer;',
    '  transition:border-color .15s, color .15s;',
    '}',
    '#talovi-cost-reset:hover { border-color:#f85149; color:#f85149; }',

    '.talovi-cost-note {',
    '  font-size:10px; color:#8b949e; text-align:center; line-height:1.5;',
    '}',

    /* footer */
    '#talovi-widget-footer { padding:6px 12px; text-align:center; border-top:1px solid #21262d; flex-shrink:0; }',
    '#talovi-widget-footer a { font-size:10px; color:#8b949e; text-decoration:none; }',
    '#talovi-widget-footer a:hover { color:' + config.color + '; }',

    '@media (max-width:400px) {',
    '  #talovi-widget-panel { width:calc(100vw - 32px); right:16px; bottom:84px; }',
    '  #talovi-widget-btn   { right:16px; }',
    '}'
  ].join('\n');
  document.head.appendChild(styles);

  /* ── Icons ───────────────────────────────────────────────── */
  var chatIcon  = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="white"/></svg>';
  var closeIcon = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white"/></svg>';
  var sendIcon  = '<svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="white"/></svg>';

  var label    = domainLabels[config.domain] || config.title;
  var greeting = greetings[config.domain]    || greetings.general;

  /* ── Widget HTML ─────────────────────────────────────────── */
  var widget = document.createElement('div');
  widget.id = 'talovi-widget';
  widget.innerHTML =
    '<button id="talovi-widget-btn" aria-label="Open AI Assistant">' + chatIcon + '</button>' +
    '<div id="talovi-widget-panel">' +
      '<div id="talovi-widget-header">' +
        '<div>' +
          '<div id="talovi-widget-header-title">' + label + '</div>' +
          '<div id="talovi-widget-header-sub">Powered by Talovi</div>' +
        '</div>' +
        '<div id="talovi-widget-header-actions">' +
          '<button id="talovi-widget-cost-tab" aria-label="Cost summary">$ cost</button>' +
          '<button id="talovi-widget-close" aria-label="Close">' + closeIcon + '</button>' +
        '</div>' +
      '</div>' +
      /* chat view */
      '<div id="talovi-widget-messages">' +
        '<div class="talovi-msg assistant">' +
          '<div class="talovi-msg-bubble">' + greeting + '</div>' +
        '</div>' +
      '</div>' +
      '<div id="talovi-cost-bar"></div>' +
      '<div id="talovi-widget-input-area">' +
        '<input type="text" id="talovi-widget-input" placeholder="Type your message..." />' +
        '<button id="talovi-widget-send" aria-label="Send">' + sendIcon + '</button>' +
      '</div>' +
      /* cost dashboard (hidden by default) */
      '<div id="talovi-cost-dashboard">' +
        '<div class="talovi-cost-row">' +
          '<span class="talovi-cost-label">This conversation</span>' +
          '<span class="talovi-cost-value" id="talovi-cost-session">$0.0000</span>' +
        '</div>' +
        '<div class="talovi-cost-row">' +
          '<span class="talovi-cost-label">All-time total</span>' +
          '<span class="talovi-cost-value green" id="talovi-cost-total">' + formatCost(loadTotal()) + '</span>' +
        '</div>' +
        '<button id="talovi-cost-reset">Reset all-time total</button>' +
        '<p class="talovi-cost-note">All costs are calculated locally in your browser.<br>Nothing is ever sent to Talovi servers.</p>' +
      '</div>' +
      '<div id="talovi-widget-footer">' +
        '<a href="https://talovi.dev" target="_blank" rel="noopener">Powered by Talovi\u2122</a>' +
      '</div>' +
    '</div>';

  document.body.appendChild(widget);

  /* ── Event listeners ─────────────────────────────────────── */
  document.getElementById('talovi-widget-btn').addEventListener('click', taloviToggle);
  document.getElementById('talovi-widget-close').addEventListener('click', taloviToggle);
  document.getElementById('talovi-widget-send').addEventListener('click', taloviSend);
  document.getElementById('talovi-widget-cost-tab').addEventListener('click', toggleCostDashboard);
  document.getElementById('talovi-cost-reset').addEventListener('click', resetTotal);
  document.getElementById('talovi-widget-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') taloviSend();
  });

  /* ── Toggle panel ────────────────────────────────────────── */
  function taloviToggle() {
    isOpen = !isOpen;
    var panel = document.getElementById('talovi-widget-panel');
    var btn   = document.getElementById('talovi-widget-btn');
    if (isOpen) {
      panel.classList.add('open');
      btn.innerHTML = closeIcon;
      document.getElementById('talovi-widget-input').focus();
    } else {
      panel.classList.remove('open');
      btn.innerHTML = chatIcon;
      // ensure chat view is restored on next open
      showChatView();
    }
  }

  /* ── Cost dashboard toggle ───────────────────────────────── */
  var dashboardVisible = false;

  function toggleCostDashboard() {
    dashboardVisible = !dashboardVisible;
    var tab       = document.getElementById('talovi-widget-cost-tab');
    var dashboard = document.getElementById('talovi-cost-dashboard');
    var messages  = document.getElementById('talovi-widget-messages');
    var costBar   = document.getElementById('talovi-cost-bar');
    var inputArea = document.getElementById('talovi-widget-input-area');

    if (dashboardVisible) {
      tab.classList.add('active');
      dashboard.classList.add('visible');
      messages.style.display  = 'none';
      costBar.style.display   = 'none';
      inputArea.style.display = 'none';
      refreshDashboard();
    } else {
      showChatView();
    }
  }

  function showChatView() {
    dashboardVisible = false;
    var tab       = document.getElementById('talovi-widget-cost-tab');
    var dashboard = document.getElementById('talovi-cost-dashboard');
    var messages  = document.getElementById('talovi-widget-messages');
    var inputArea = document.getElementById('talovi-widget-input-area');

    tab.classList.remove('active');
    dashboard.classList.remove('visible');
    messages.style.display  = '';
    inputArea.style.display = '';
    updateCostBar();
  }

  function refreshDashboard() {
    document.getElementById('talovi-cost-session').textContent = formatCost(sessionCost);
    document.getElementById('talovi-cost-total').textContent   = formatCost(loadTotal());
  }

  function resetTotal() {
    saveTotal(0);
    refreshDashboard();
  }

  function updateCostBar() {
    var bar = document.getElementById('talovi-cost-bar');
    if (sessionCost === 0) { bar.style.display = 'none'; return; }
    bar.style.display = 'block';
    bar.textContent   = 'This conversation: ' + formatCost(sessionCost) +
                        ' \u00B7 Total spent: ' + formatCost(loadTotal());
  }

  /* ── Markdown parser ─────────────────────────────────────── */
  function inlineMarkdown(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  function parseMarkdown(text) {
    var lines  = text.split('\n');
    var html   = '';
    var inList = false;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.match(/^#{1,3}\s+/)) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<strong>' + inlineMarkdown(line.replace(/^#{1,3}\s+/, '')) + '</strong><br>';
      } else if (line.match(/^[-*]\s+/)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += '<li>' + inlineMarkdown(line.replace(/^[-*]\s+/, '')) + '</li>';
      } else if (line.trim() === '') {
        if (inList) { html += '</ul>'; inList = false; }
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<p>' + inlineMarkdown(line) + '</p>';
      }
    }
    if (inList) html += '</ul>';
    return html;
  }

  /* ── Send message ────────────────────────────────────────── */
  function taloviSend() {
    if (!config.key) {
      alert('No API key configured. Add data-key to your Talovi script tag.');
      return;
    }
    var input = document.getElementById('talovi-widget-input');
    var text  = input.value.trim();
    if (!text) return;
    input.value = '';

    var msgBox = document.getElementById('talovi-widget-messages');

    // User bubble
    var userEl = document.createElement('div');
    userEl.className = 'talovi-msg user';
    userEl.innerHTML = '<div class="talovi-msg-bubble">' + text + '</div>';
    msgBox.appendChild(userEl);
    history.push({ role: 'user', content: text });
    msgBox.scrollTop = msgBox.scrollHeight;

    // Typing indicator
    var typingEl = document.createElement('div');
    typingEl.className = 'talovi-msg assistant';
    typingEl.id = 'talovi-typing';
    typingEl.innerHTML = '<div class="talovi-msg-bubble" style="color:#8b949e;font-style:italic">Thinking\u2026</div>';
    msgBox.appendChild(typingEl);
    msgBox.scrollTop = msgBox.scrollHeight;

    var sendBtn = document.getElementById('talovi-widget-send');
    sendBtn.disabled = true;

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': config.key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: systemPrompts[config.domain] || systemPrompts.general,
        messages: history
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var reply = (data.content && data.content[0] && data.content[0].text)
        ? data.content[0].text
        : 'Sorry, something went wrong. Please try again.';

      history.push({ role: 'assistant', content: reply });

      // ── Cost tracking ──────────────────────────────────────
      var inputTokens  = (data.usage && data.usage.input_tokens)  || 0;
      var outputTokens = (data.usage && data.usage.output_tokens) || 0;
      var msgCost      = calcCost(inputTokens, outputTokens);
      sessionCost     += msgCost;
      saveTotal(loadTotal() + msgCost);

      // Replace typing indicator with response + cost label
      var typing = document.getElementById('talovi-typing');
      if (typing) {
        typing.id = '';
        typing.innerHTML =
          '<div class="talovi-msg-bubble">' + parseMarkdown(reply) + '</div>' +
          (msgCost > 0
            ? '<div class="talovi-msg-cost">~' + formatCost(msgCost) + '</div>'
            : '');
      }

      updateCostBar();
    })
    .catch(function(err) {
      var typing = document.getElementById('talovi-typing');
      if (typing) {
        typing.id = '';
        typing.querySelector('.talovi-msg-bubble').textContent = 'Error: ' + err.message;
      }
    })
    .finally(function() {
      sendBtn.disabled = false;
      msgBox.scrollTop = msgBox.scrollHeight;
    });
  }

})();
