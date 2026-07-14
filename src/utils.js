/**
 * Compresses state and blockOrder into a base64 string for URL sharing.
 */
export function serializeState(state, blockOrder) {
  try {
    const payload = {
      s: state,
      b: blockOrder
    };
    const jsonStr = JSON.stringify(payload);
    // Use encodeURIComponent to handle non-ASCII/Thai characters safely before base64
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  } catch (err) {
    console.error('Serialization failed:', err);
    return '';
  }
}

/**
 * Decompresses base64 string back into state and blockOrder.
 */
export function deserializeState(hash) {
  if (!hash) return null;
  try {
    const binary = atob(hash);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.s) {
      return {
        state: parsed.s,
        blockOrder: parsed.b || ['role', 'context', 'data', 'analysis', 'output', 'visual']
      };
    }
    return null;
  } catch (err) {
    console.error('Deserialization failed:', err);
    return null;
  }
}

/**
 * Triggers a client-side file download.
 */
export function downloadFile(content, fileName, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Formats JSON nicely for output copy/downloads.
 */
export function formatJsonState(state, blockOrder) {
  return JSON.stringify({
    architecture: "Universal Prompt Architecture (UPA)",
    version: "1.0",
    blockOrder,
    state
  }, null, 2);
}
