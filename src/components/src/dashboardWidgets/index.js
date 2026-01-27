import DateRange from './DateRange'
import Upload from './Upload'
import Map from './Map'
import Area from './Area'
import Widget from './Widget'
import Rate from './Rate'

// import { lazy } from 'xadmin-ui'

// const DateRange = lazy(() => import('./DateRange'))
// const Upload = lazy(() => import('./Upload'))
// const Map = lazy(() => import('./Map'))
// const Area = lazy(() => import('./Area'))
// const Widget = lazy(() => import('./Widget'))
// const Rate = lazy(() => import('./Rate'))

const context = app => (context, cb) => {
  // FieldWrap只有在挂载完毕后才能使用，所以只能用这种办法
  const FieldWrap = app.get('components')['Dashboard.Form.FieldWrap']
  if (FieldWrap) {
    app.get('dashboardWidgets')['Form.Widget'] = FieldWrap(Widget)
    app.get('dashboardWidgets')['Form.DateRange'] = FieldWrap(DateRange)
    app.get('dashboardWidgets')['Form.Upload'] = FieldWrap(Upload)
    app.get('dashboardWidgets')['Form.Map'] = FieldWrap(Map)
    app.get('dashboardWidgets')['Form.Area'] = FieldWrap(Area)
    app.get('dashboardWidgets')['Form.Rate'] = FieldWrap(Rate)
  }
  cb(null, context)
}

export { context }