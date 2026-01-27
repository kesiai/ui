import React from "react"
import { C } from "xadmin-ui"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p style={{ color: 'red' }}>编译错误: {this.state.error.message}</p>
    }

    return this.props.children;
  }
}

const FormInfoComponent = ({ schema, args = [], outProps = {} }) => {
  const str = schema?.widgetContent;
  const [runCode, setRunCode] = React.useState();
  const [AppComponent, setAppComponent] = React.useState(null);

  React.useEffect(() => {
    if (!runCode) {
      setAppComponent(null);
      return;
    }

    try {
      const { App, LabelComponent } = new Function(
        "return (() => { " + 
          "let App, LabelComponent; " +
          runCode + 
          "; return { App, LabelComponent }; " + 
        "})();"
      )();

      setAppComponent(() => App || LabelComponent);
    } catch (e) {
      console.error("脚本执行错误:", e);
      setAppComponent(() => () => (
        <p style={{ color: 'red' }}>编译错误: {e.message}</p>
      ));
    }
  }, [runCode]);

  const propsArgs = args.reduce((prev, { key, value }) => {
    prev[key] = value;
    return prev;
  }, {});

  const onTransformedCode = (val) => {
    setRunCode(val);
  };

  return (
    <>
      <C is="LazyBabelTransformedCode" code={str} onTransformedCode={onTransformedCode} />
      {AppComponent ? (
        <ErrorBoundary
          FallbackComponent={({ error }) => (
            <p style={{ color: 'red' }}>运行时错误: {error.message}</p>
          )}
        >
          <AppComponent {...propsArgs} {...outProps} />
        </ErrorBoundary>
      ) : null}
    </>
  );
};

export default FormInfoComponent
