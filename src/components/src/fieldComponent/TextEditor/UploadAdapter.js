import { api } from 'xadmin'

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    // 传入开始状态
    // this.loader.uploadType(true)
    const HOST = api({ name: 'media' }).getHost()
    const uploadImg = (formData) => fetch(`${HOST}core/media/img`, {
      method: 'POST',
      headers: _.omit(api({ name: 'media' }).getHeaders(), 'Content-Type'),
      body: formData
    }).then(res => res.json()).catch(err => console.error(err))

    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
        fetch(`${HOST}core/media/img`, {
          method: 'POST',
          headers: _.omit(api({ name: 'media' }).getHeaders(), 'Content-Type'),
          body: formData
        }).then(res => res.json())
        .then(res => resolve({ default: HOST.slice(0, -1) + res.url })).catch(err => reject(err))
      }));
  }

  // Aborts the upload process.
  abort() {
  }
}

class MyUploadAdapterPlugin {
  constructor(editor) {
    this.editor = editor;
  }

  init() {
    const fileRepository = this.editor.plugins.get('FileRepository');
    if (fileRepository) {
      fileRepository.createUploadAdapter = (loader) => new MyUploadAdapter(loader);
    }
  }
}
MyUploadAdapterPlugin.pluginName = 'MyUploadAdapterPlugin';

export default MyUploadAdapterPlugin