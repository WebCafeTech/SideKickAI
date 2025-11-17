// content script for SidekickAI
let iframeEl = null;
let injected = false;
let sidebarWidth = 420; // Default width
let isPinned = false;
let resizeHandle = null;
let isResizing = false;

console.log('[SidekickAI] Content script loaded');

// Notify background that we're ready
chrome.runtime.sendMessage({type: 'contentScriptReady'}).catch(() => {});

// Load saved width and pin state
chrome.storage.local.get(['sidekickai_width', 'sidekickai_pinned'], (result) => {
  if (result.sidekickai_width) sidebarWidth = result.sidekickai_width;
  if (result.sidekickai_pinned !== undefined) isPinned = result.sidekickai_pinned;
  // If sidebar is already injected, adjust layout
  if (injected) {
    adjustPageLayout();
  }
});

chrome.runtime.onMessage.addListener((msg, _, sendResponse)=> {
  console.log('[SidekickAI] Received message:', msg, typeof msg);
  if (msg === 'toggleSidebar' || (typeof msg === 'object' && msg.type === 'toggleSidebar')) {
    console.log('[SidekickAI] Toggling sidebar...');
    toggle();
    sendResponse({success: true});
    return true;
  }
  if (typeof msg === 'object' && msg.type === 'resizeSidebar') {
    resizeSidebar(msg.width);
    sendResponse({success: true});
    return true;
  }
  if (typeof msg === 'object' && msg.type === 'togglePin') {
    togglePin();
    sendResponse({success: true});
    return true;
  }
  return false;
});

function toggle() { 
  console.log('[SidekickAI] Toggle called, injected:', injected);
  if (!injected) inject(); 
  else removeIt(); 
}

function inject() {
  try {
    // Remove existing iframe if any
    const existing = document.getElementById('sidekickai-iframe');
    if (existing) {
      existing.remove();
      injected = false;
    }
    
    // Remove existing resize handle
    const existingHandle = document.getElementById('sidekickai-resize-handle');
    if (existingHandle) {
      existingHandle.remove();
    }
    
    console.log('[SidekickAI] Injecting sidebar...');
    
    // Create container for sidebar
    const container = document.createElement('div');
    container.id = 'sidekickai-container';
    container.style.cssText = `
      position: fixed;
      right: 0;
      top: 0;
      width: ${sidebarWidth}px;
      height: 100vh;
      z-index: 2147483647;
      display: flex;
      flex-direction: row;
      pointer-events: none;
      box-shadow: -4px 0 12px rgba(0,0,0,0.15);
    `;
    
    // Create resize handle
    resizeHandle = document.createElement('div');
    resizeHandle.id = 'sidekickai-resize-handle';
    resizeHandle.style.cssText = `
      width: 4px;
      background: rgba(45, 212, 191, 0.3);
      cursor: ew-resize;
      pointer-events: all;
      transition: background 0.2s;
      flex-shrink: 0;
    `;
    resizeHandle.addEventListener('mouseenter', () => {
      resizeHandle.style.background = 'rgba(45, 212, 191, 0.6)';
    });
    resizeHandle.addEventListener('mouseleave', () => {
      if (!isResizing) {
        resizeHandle.style.background = 'rgba(45, 212, 191, 0.3)';
      }
    });
    
    // Resize functionality
    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      resizeHandle.style.background = 'rgba(45, 212, 191, 0.8)';
      const startX = e.clientX;
      const startWidth = sidebarWidth;
      
      const onMouseMove = (e) => {
        const diff = startX - e.clientX; // Reverse because we're on the right
        const newWidth = Math.max(300, Math.min(800, startWidth + diff));
        resizeSidebar(newWidth);
      };
      
      const onMouseUp = () => {
        isResizing = false;
        resizeHandle.style.background = 'rgba(45, 212, 191, 0.3)';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        // Save width
        chrome.storage.local.set({sidekickai_width: sidebarWidth});
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
    
    // Create iframe
  iframeEl = document.createElement('iframe');
    const sidebarUrl = chrome.runtime.getURL('sidebar.html');
    console.log('[SidekickAI] Sidebar URL:', sidebarUrl);
    
    // Verify URL is accessible
    if (!sidebarUrl || !sidebarUrl.includes('sidebar.html')) {
      console.error('[SidekickAI] Invalid sidebar URL:', sidebarUrl);
      alert('SidekickAI: Cannot load sidebar. Please check extension installation.');
      return;
    }
    
    iframeEl.src = sidebarUrl;
  iframeEl.id = 'sidekickai-iframe';
    iframeEl.setAttribute('allow', 'clipboard-read; clipboard-write');
    iframeEl.style.cssText = `
      flex: 1;
      border: 0;
      background: #fff;
      pointer-events: all;
    `;
    
    // Assemble container
    container.appendChild(iframeEl);
    container.appendChild(resizeHandle);
    
    document.documentElement.appendChild(container);
  injected = true;
    
    // Adjust page layout
    adjustPageLayout();
    
  window.addEventListener('message', handleMsg);
    window.addEventListener('resize', adjustPageLayout);
    
    // Log iframe load events
    iframeEl.onload = () => {
      console.log('[SidekickAI] Iframe loaded successfully');
      // Send initial width and pin state to iframe
      iframeEl.contentWindow.postMessage({
        type: 'sidebarState',
        width: sidebarWidth,
        pinned: isPinned
      }, '*');
    };
    iframeEl.onerror = (err) => {
      console.error('[SidekickAI] Iframe error:', err);
      alert('SidekickAI: Error loading sidebar. Check console for details.');
    };
    
    console.log('[SidekickAI] Sidebar injected successfully');
  } catch (err) {
    console.error('[SidekickAI] Error injecting sidebar:', err);
    alert('SidekickAI: Failed to inject sidebar. Error: ' + err.message);
  }
}

function resizeSidebar(newWidth) {
  sidebarWidth = newWidth;
  const container = document.getElementById('sidekickai-container');
  if (container) {
    container.style.width = `${sidebarWidth}px`;
    adjustPageLayout();
    // Notify iframe of width change
    if (iframeEl && iframeEl.contentWindow) {
      iframeEl.contentWindow.postMessage({
        type: 'sidebarResize',
        width: sidebarWidth
      }, '*');
    }
  }
}

function togglePin() {
  isPinned = !isPinned;
  chrome.storage.local.set({sidekickai_pinned: isPinned});
  adjustPageLayout();
  // Notify iframe of pin state change
  if (iframeEl && iframeEl.contentWindow) {
    iframeEl.contentWindow.postMessage({
      type: 'sidebarPin',
      pinned: isPinned
    }, '*');
  }
}

function adjustPageLayout() {
  if (!injected) return;
  
  const body = document.body;
  const html = document.documentElement;
  
  if (isPinned) {
    // Calculate available width for content
    const availableWidth = window.innerWidth - sidebarWidth;
    
    // Apply width constraint to body and html to shrink content area
    body.style.width = `${availableWidth}px`;
    body.style.maxWidth = `${availableWidth}px`;
    body.style.marginRight = '0';
    body.style.transition = 'width 0.3s ease, max-width 0.3s ease';
    body.style.overflowX = 'hidden';
    
    html.style.width = `${availableWidth}px`;
    html.style.maxWidth = `${availableWidth}px`;
    html.style.marginRight = '0';
    html.style.transition = 'width 0.3s ease, max-width 0.3s ease';
    html.style.overflowX = 'hidden';
    
    // Also adjust any main content containers
    const mainContainers = document.querySelectorAll('main, [role="main"], .main, #main, .content, #content, .container, #container');
    mainContainers.forEach(container => {
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.maxWidth && computedStyle.maxWidth !== 'none') {
        const currentMaxWidth = parseInt(computedStyle.maxWidth);
        if (currentMaxWidth > availableWidth) {
          container.style.maxWidth = `${availableWidth}px`;
        }
      }
    });
  } else {
    // Reset to full width
    body.style.width = '';
    body.style.maxWidth = '';
    body.style.marginRight = '';
    body.style.overflowX = '';
    body.style.transition = '';
    
    html.style.width = '';
    html.style.maxWidth = '';
    html.style.marginRight = '';
    html.style.overflowX = '';
    html.style.transition = '';
    
    // Reset main containers
    const mainContainers = document.querySelectorAll('main, [role="main"], .main, #main, .content, #content, .container, #container');
    mainContainers.forEach(container => {
      if (container.style.maxWidth) {
        container.style.maxWidth = '';
      }
    });
  }
}
function removeIt() { 
  const container = document.getElementById('sidekickai-container');
  if (container) container.remove();
  iframeEl = null;
  resizeHandle = null;
  injected = false;
  isPinned = false; // Reset pin state
  window.removeEventListener('message', handleMsg);
  window.removeEventListener('resize', adjustPageLayout);
  // Reset page layout completely
  const body = document.body;
  const html = document.documentElement;
  body.style.width = '';
  body.style.maxWidth = '';
  body.style.marginRight = '';
  body.style.overflowX = '';
  body.style.transition = '';
  html.style.width = '';
  html.style.maxWidth = '';
  html.style.marginRight = '';
  html.style.overflowX = '';
  html.style.transition = '';
}
function handleMsg(ev) {
  if (!ev.data || !ev.data.type) return;
  const m = ev.data;
  if (m.type === 'readLeft') { 
    const t = readLeft();
    // Request screenshot capture from background script
    chrome.runtime.sendMessage({
      type: 'captureScreenshot',
      includeImage: true
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[SidekickAI] Error capturing screenshot:', chrome.runtime.lastError);
        // Send text only if screenshot fails
        ev.source.postMessage({type:'leftText', text:t, image: null}, '*');
      } else if (response?.ok && response?.screenshotDataUrl) {
        // Crop screenshot to left half and convert to base64
        cropScreenshotToLeftHalf(response.screenshotDataUrl, (base64Data) => {
          // Send both text and image
          ev.source.postMessage({
            type:'leftText', 
            text:t, 
            image: base64Data
          }, '*');
        });
      } else {
        // Send text only if screenshot processing fails
        ev.source.postMessage({type:'leftText', text:t, image: null}, '*');
      }
    });
  }
  if (m.type === 'cropAndSendScreenshot') {
    // Convert full screenshot to base64 and send to chat (no cropping) - for Answer/Describe
    if (m.screenshotDataUrl) {
      convertScreenshotToBase64(m.screenshotDataUrl, (base64Data) => {
        // Send full screenshot to iframe
        if (iframeEl && iframeEl.contentWindow) {
          iframeEl.contentWindow.postMessage({
            type: 'screenshotCaptured',
            image: base64Data
          }, '*');
        }
      });
    }
  }
  if (m.type === 'cropAndAddToInput') {
    // Convert full screenshot to base64 and add to chat input - for Take Screenshot
    if (m.screenshotDataUrl) {
      convertScreenshotToBase64(m.screenshotDataUrl, (base64Data) => {
        // Send screenshot to iframe input
        if (iframeEl && iframeEl.contentWindow) {
          iframeEl.contentWindow.postMessage({
            type: 'screenshotToInput',
            image: base64Data
          }, '*');
        }
      });
    }
  }
  if (m.type === 'findQuiz') { const q = findQuiz(); ev.source.postMessage({type:'quizFound', quiz:q}, '*'); }
  if (m.type === 'highlight') highlight(m.payload);
  if (m.type === 'removeSidebar') removeIt();
  if (m.type === 'resizeSidebar') resizeSidebar(m.width);
  if (m.type === 'togglePin') togglePin();
}
function readLeft() {
  const mid = window.innerWidth/2; let out=[]; const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let n; while (n = walker.nextNode()) { const p = n.parentElement; if (!p) continue; const r = p.getBoundingClientRect(); if (r.left < mid && r.width>0 && r.height>0) { const t = n.textContent.trim(); if (t.length>5) out.push(t); } }
  return out.join('\n\n').slice(0,20000);
}
function findQuiz() {
  const mid = window.innerWidth/2;
  const radios = Array.from(document.querySelectorAll('input[type=radio], input[type=checkbox]')).filter(r=> r.getBoundingClientRect().left < mid);
  if (radios.length>=2) {
    const opts = radios.map(r=> { const lab=document.querySelector(`label[for='${r.id}']`) || r.parentElement; return lab ? lab.innerText.trim() : 'Option'; });
    const q = radios[0].closest('fieldset') || radios[0].closest('form') || radios[0].parentElement;
    const question = q ? (q.innerText.split('\n')[0] || 'Question') : 'Question';
    return {question, options: opts};
  }
  return {question: readLeft().split('\n\n')[0] || 'No question', options: []};
}
function highlight(text) {
  if (!text) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let n; while (n = walker.nextNode()) { if (n.textContent && n.textContent.includes(text)) { const el = n.parentElement; el.style.transition='background-color 0.3s ease'; el.style.backgroundColor='yellow'; setTimeout(()=> el.style.backgroundColor='', 5000); break; } }
}
function convertScreenshotToBase64(dataUrl, callback) {
  // Simply convert data URL to base64 (no cropping - full screen)
  // Remove data:image/png;base64, prefix
  const base64Data = dataUrl.split(',')[1];
  callback(base64Data);
}

function cropScreenshotToLeftHalf(dataUrl, callback) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate left half width
    const leftWidth = Math.floor(img.width / 2);
    canvas.width = leftWidth;
    canvas.height = img.height;
    
    // Draw left half
    ctx.drawImage(img, 0, 0, leftWidth, img.height, 0, 0, leftWidth, img.height);
    
    // Convert to base64
    const croppedDataUrl = canvas.toDataURL('image/png');
    
    // Convert data URL to base64 string (remove data:image/png;base64, prefix)
    const base64Data = croppedDataUrl.split(',')[1];
    
    callback(base64Data);
  };
  img.onerror = () => {
    console.error('[SidekickAI] Error loading screenshot for cropping');
    callback(null);
  };
  img.src = dataUrl;
}
