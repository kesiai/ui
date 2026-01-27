

const loadPCAData = async () => {
  const { default: largeData } = await import('./pca.json');
  return largeData;
};

export { loadPCAData } 

export default []
