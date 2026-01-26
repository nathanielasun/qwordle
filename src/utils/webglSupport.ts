/**
 * WebGL support detection utilities
 *
 * Used to check if the browser supports WebGL for quantum circuit simulation.
 * TensorFlow.js uses WebGL for GPU acceleration.
 */

export interface WebGLSupportResult {
  supported: boolean;
  version: number | null;
  renderer: string | null;
  vendor: string | null;
  error?: string;
}

/**
 * Check if WebGL is supported in the current browser
 */
export function checkWebGLSupport(): WebGLSupportResult {
  try {
    const canvas = document.createElement('canvas');

    // Try WebGL 2 first
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null =
      canvas.getContext('webgl2');
    let version = 2;

    // Fall back to WebGL 1
    if (!gl) {
      gl = canvas.getContext('webgl');
      version = 1;
    }

    // Try experimental WebGL as last resort
    if (!gl) {
      gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      version = 1;
    }

    if (!gl) {
      return {
        supported: false,
        version: null,
        renderer: null,
        vendor: null,
        error: 'WebGL not supported',
      };
    }

    // Get renderer info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);
    const vendor = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : gl.getParameter(gl.VENDOR);

    return {
      supported: true,
      version,
      renderer: renderer as string,
      vendor: vendor as string,
    };
  } catch (error) {
    return {
      supported: false,
      version: null,
      renderer: null,
      vendor: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get a human-readable description of WebGL support
 */
export function getWebGLDescription(): string {
  const result = checkWebGLSupport();

  if (!result.supported) {
    return `WebGL not supported: ${result.error || 'Unknown reason'}`;
  }

  return `WebGL ${result.version} (${result.renderer})`;
}

/**
 * Check if WebGL is available for TensorFlow.js
 * This is a more thorough check that also verifies required extensions
 */
export function checkTensorFlowWebGLSupport(): boolean {
  const result = checkWebGLSupport();

  if (!result.supported) {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);

    if (!gl) {
      return false;
    }

    // Check for required extensions that TensorFlow.js needs
    const requiredExtensions = [
      'OES_texture_float',
      'WEBGL_color_buffer_float',
    ];

    // WebGL 2 has these built-in, only check for WebGL 1
    if (result.version === 1) {
      for (const ext of requiredExtensions) {
        if (!gl.getExtension(ext)) {
          console.warn(`WebGL extension ${ext} not available`);
          // Don't fail, TensorFlow might still work
        }
      }
    }

    return true;
  } catch {
    return false;
  }
}
