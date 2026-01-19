declare module "*.esm.min.js" {
  export class WebControl {
    constructor(options: any);
    JS_StartService(type: string, options: any): Promise<any>;
    JS_CreateWnd(containerId: string, width: number, height: number): Promise<any>;
    JS_RequestInterface(request: any): Promise<any>;
    JS_Resize(width: number, height: number): void;
    JS_SetWindowControlCallback(callbacks: any): void;
    JS_HideWnd?(): void;
    JS_DestroyWnd(): Promise<any>;
  }
}